import ESelector from '@/components/eComponents/ESelector';
import { PageContainer } from '@ant-design/pro-layout';
import {
  Alert,
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Row,
  Select,
  Table,
} from 'antd';
import React, { useState } from 'react';
import { FormattedMessage, useModel } from 'umi';
import URLS from '@/URLs/urls';
import { useHistory, useLocation } from 'react-router';
import useAxios from '@/components/eComponents/use-axios';
import { DeleteOutlined, EditTwoTone, EyeTwoTone } from '@ant-design/icons';
import KeyPressEvents from '@/util/KeyPressEvents';
import VillageSelector from '@/components/eComponents/VillageSelector';
import { useEffect } from 'react';

function TableForm3() {
  const { sendRequest } = useAxios();
  const [surveyNumberValue, setSurveyNumberValue] = useState('');
  const [codeVillage, setCodeVillage] = useState('');
  const [textForVillage, setTextForVillage] = useState();
  const [village, setVillage] = useState([]);
  const [revenueYear, setRevenueYear] = useState();
  const [isNirank, setIsNirank] = useState(false);
  const [modalForDelete, setModalForDelete] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [VillageForm3Data, setVillageForm3Data] = useState([]);
  const [serialNumber, setSerialNumber] = useState();
  const [recordId, setRecordId] = useState();
  const [dataInModal, setDataInModal] = useState();
  const [inputState, setInputState] = useState();
  const [typeAndContinuable, setTypeAndContinuable] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [okText, setOkText] = useState();
  const [ID, setID] = useState();
  const [pin, setPin] = useState();
  const [form] = Form.useForm();
  const { districtName, servarthId, districtCode, talukaCode } = useModel('details');
  const [confirmLoading, setConfirmLoading] = useState(false);

  let history = useHistory();

  const handleESelectorChange = (sn, cCodeT) => {
    setSurveyNumberValue(sn);
    setCodeVillage(cCodeT);
  };

  function handleChangeForSurveyNo(event) {
    setSurveyNumberValue(event.target.value);
    setVillageForm3Data('');
    // console.log(event.target.value);
  }

  const addForm = () => {
    history.push({
      pathname: `/form/village-form-3/village-form`,
    });
  };

  function typesOfSanad(value) {
    if (value == 'इनाम वर्ग-१') {
      form.setFieldsValue({ kindAndHowLongContinuable: 'सरंजामइनाम' });
    }
    if (value == 'इनाम वर्ग-२') {
      form.setFieldsValue({ kindAndHowLongContinuable: 'जात' });
    }
    if (value == 'इनाम वर्ग-३') {
      form.setFieldsValue({ kindAndHowLongContinuable: 'देवस्थानइनाम' });
    }
    if (value == 'इनाम वर्ग-४') {
      form.setFieldsValue({ kindAndHowLongContinuable: 'देशपांडे/देशमुख/कुलकर्णी' });
    }
    if (value == 'इनाम वर्ग-५') {
      form.setFieldsValue({ kindAndHowLongContinuable: 'परगना' });
    }
    if (value == 'इनाम वर्ग-६अ') {
      form.setFieldsValue({ kindAndHowLongContinuable: 'रामोशी' });
    }
    if (value == 'इनाम वर्ग-६ब') {
      form.setFieldsValue({ kindAndHowLongContinuable: 'महार' });
    }
    if (value == 'इनाम वर्ग-७') {
      form.setFieldsValue({ kindAndHowLongContinuable: 'संकीर्ण' });
    }
  }

  useEffect(() => {
    console.log('nirank village ahe ka??', isNirank);
  }, []);

  useEffect(() => {
    // console.log('typeAndContinuable', typeAndContinuable);
  }, [typeAndContinuable]);

  const getForm3Data = async () => {
    setIsLoading(true);
    sendRequest(
      `${URLS.BaseURL}/form3/getForm3DataN?cCode=${codeVillage}&pin=${surveyNumberValue}`,
      'GET',
      null,
      (res) => {
        // console.log('res dakhav', res);
        // form.setFieldsValue({
        //   runningNoEachClass: res.data.serialNoForForm3,
        // });
        setSerialNumber(res.data.serialNoForForm3);
        setVillageForm3Data(
          res.data.form3Data.map((row, index) => ({
            srNo: index + 1,
            id: row.id,
            classes: row.classes,
            kindAndHowLongContinuable: row.kindAndHowLongContinuable,
            runningNoEachClass: row.runningNoEachClass,
            netCultiAreaH: row.netCultiAreaH
              .substring(0, row.netCultiAreaH.length - 2)
              .concat('.')
              .concat(row.netCultiAreaH.substring(row.netCultiAreaH.length - 2)),
            assessment: row.assessment,
            naAreaH: row.naAreaH
              .substring(0, row.naAreaH.length - 2)
              .concat('.')
              .concat(row.naAreaH.substring(row.naAreaH.length - 2)),
            naAssessment: row.naAssessment,
            juniSalami: row.juniSalami,
            jamabandiRate: row.jamabandiRate,
            echAssessment: row.echAssessment,
            rate: row.rate,
            noInRegisterOfLands: row.noInRegisterOfLands,
            sanadNo: row.sanadNo,
            netPending: row.netPending,
            pin: row.pin,
            hissaNo: row.hissaNo,
            surveyNo:
              row.hissaNo == null || row.hissaNo.trim() == ''
                ? row.pin
                : row.pin + '/' + row.hissaNo,
            remarks: row.remarks,
            total: row.total,
          })),
        );
        setIsLoading(false);
      },
      (err) => {
        setIsLoading(false);
      },
    );
  };

  const onCancelForDelete = () => {
    setModalForDelete(false);
  };

  const deleteRecord = (record) => {
    setRecordId(record.id);
    setModalForDelete(true);
  };

  const deleteForm3Data = async (record) => {
    setModalForDelete(false);
    sendRequest(`${URLS.BaseURL}/form3/discardForm3?id=${recordId}`, 'DELETE', null, (res) => {
      if (res.status == 226) {
        message.success('Record Deleted !');
        setVillageForm3Data([]);

        getForm3Data();
      }
    });
  };

  const columns = [
    {
      key: '1',
      title: <FormattedMessage id="formLanguage.form.serialNo" />,
      dataIndex: 'srNo',
      width: '80px',
    },
    {
      key: '2',
      title: <FormattedMessage id="villageForm3.form.class" />,
      dataIndex: 'classes',
      width: '100px',
    },
    {
      key: '3',
      title: <FormattedMessage id="villageForm3.form.howLongContinuable" />,
      dataIndex: 'kindAndHowLongContinuable',
      width: '120px',
    },
    {
      key: '4',
      title: <FormattedMessage id="villageForm3.form.runningEachClass" />,
      dataIndex: 'runningNoEachClass',
      width: '120px',
    },
    {
      key: '5',
      title: <FormattedMessage id="formLanguage.table.surveyNo" />,
      dataIndex: 'surveyNo',
      width: '110px',
    },
    // {
    //   key: '6',
    //   title: <FormattedMessage id="formLanguage.form.hissaNo" />,
    //   dataIndex: 'hissaNo',
    //   width: '110px',
    // },
    {
      key: '6',
      title: <FormattedMessage id="villageForm3.form.cultivableArea" />,
      dataIndex: 'netCultiAreaH',
      width: '110px',
    },
    {
      key: '7',

      title: <FormattedMessage id="villageForm3.form.assessment" />,
      dataIndex: 'assessment',
      width: '110px',
    },
    {
      key: '8',
      title: <FormattedMessage id="villageForm3.form.areaNaUse" />,
      dataIndex: 'naAreaH',
      width: '110px',
    },
    {
      key: '9',

      title: <FormattedMessage id="villageForm3.form.assessment" />,
      dataIndex: 'naAssessment',
      width: '110px',
    },

    {
      key: '10',
      title: <FormattedMessage id="villageForm3.form.sanadNo" />,
      dataIndex: 'sanadNo',
      width: '110px',
    },
    {
      key: '11',
      title: <FormattedMessage id="villageForm3.form.registerOfLands" />,
      dataIndex: 'noInRegisterOfLands',
      width: '200px',
    },

    {
      key: '12',

      title: <FormattedMessage id="villageForm3.form.amountPayable" />,
      children: [
        {
          title: <FormattedMessage id="villageForm3.form.oldSalami" />,
          dataIndex: 'juniSalami',
          key: 'salami',
          width: '100px',
        },
        {
          title: <FormattedMessage id="villageForm3.form.settlement" />,
          children: [
            {
              title: <FormattedMessage id="villageForm3.form.rate" />,
              dataIndex: 'rate',
              key: 'rate',
              width: '80px',
            },
            {
              title: <FormattedMessage id="villageForm3.form.assessment" />,
              dataIndex: 'echAssessment',
              key: 'echAssessment',
              width: '120px',
            },
          ],
        },
      ],
    },
    {
      key: '13',
      title: <FormattedMessage id="villageForm3.form.total" />,
      dataIndex: 'total',
      width: '100px',
    },
    {
      key: '14',
      title: <FormattedMessage id="villageForm3.form.balancewithAlienee" />,
      dataIndex: 'netPending',
      width: '150px',
    },
    {
      key: '15',
      title: <FormattedMessage id="villageForm3.form.remarks" />,
      dataIndex: 'remarks',
      width: '120px',
    },

    {
      key: '16',
      fixed: 'right',
      title: <FormattedMessage id="formLanguage.table.action" />,
      width: '120px',

      render: (record) => {
        return (
          <>
            {/* <Row>
              <Col>
                <EditTwoTone onClick={() => showModalForEdit(record)} />
                <DeleteOutlined
                  onClick={() => deleteRecord(record)}
                  style={{ color: 'red', marginLeft: 12 }}
                />
                <EyeTwoTone
                  onClick={() => showModalForView(record)}
                  style={{ color: 'violet', marginLeft: 12, marginTop: 10 }}
                />
              </Col>
            </Row> */}
            <Row>
              {record.id != null ? (
                <Col>
                  <Button
                    onClick={() => showModalForEdit(record)}
                    style={{ backgroundColor: 'lightblue', color: 'black' }}
                  >
                    माहिती भरा
                  </Button>
                  <br />
                  <br />

                  <Button
                    onClick={() => deleteRecord(record)}
                    style={{ backgroundColor: '	#ff6347', color: 'black' }}
                  >
                    डीलिट करा
                  </Button>
                  <br />
                  <br />

                  <Button
                    onClick={() => showModalForView(record)}
                    style={{ backgroundColor: 'lightgreen', color: 'black' }}
                  >
                    माहिती पहा
                  </Button>
                </Col>
              ) : (
                <Col>
                  <Button
                    onClick={() => showModalForEdit(record)}
                    style={{ backgroundColor: 'lightblue', color: 'black' }}
                  >
                    {' '}
                    माहिती भरा
                  </Button>
                </Col>
              )}
            </Row>
          </>
        );
      },
    },
  ];

  const handleCancelForModal = () => {
    setIsModalVisible(false);
  };

  const handleOkForModal = () => {
    setIsModalVisible(false);
  };

  const showModalForView = (record) => {
    form.resetFields();
    setDataInModal({});
    setDataInModal({
      id: record.id,
      cCode: codeVillage,
      classes: record.classes,
      kindAndHowLongContinuable: record.kindAndHowLongContinuable,
      runningNoEachClass:
        record.runningNoEachClass == null ? serialNumber : record.runningNoEachClass,
      pin: record.pin,
      hissaNo: record.hissaNo,

      netCultiAreaH: record.netCultiAreaH,
      assessment: record.assessment,
      naAreaH: record.naAreaH,
      naAssessment: record.naAssessment,
      sanadNo: record.sanadNo,
      noInRegisterOfLands: record.noInRegisterOfLands,
      juniSalami: record.juniSalami,
      rate: record.rate,
      echAssessment: record.echAssessment,
      total: record.total,

      netPending: record.netPending,
      remarks: record.remarks,
    });
    setInputState(true);
    setIsModalVisible(true);
    setOkText('Okay');
  };

  const showModalForEdit = (record) => {
    form.resetFields();
    setDataInModal({});
    setDataInModal({
      id: record.id,
      cCode: codeVillage,
      classes: record.classes,
      kindAndHowLongContinuable: record.kindAndHowLongContinuable,
      runningNoEachClass:
        record.runningNoEachClass == null ? serialNumber : record.runningNoEachClass,
      pin: record.pin,
      hissaNo: record.hissaNo,
      netCultiAreaH: record.netCultiAreaH,
      assessment: record.assessment,
      naAreaH: record.naAreaH,
      naAssessment: record.naAssessment,
      sanadNo: record.sanadNo,
      noInRegisterOfLands: record.noInRegisterOfLands,
      juniSalami: record.juniSalami,
      rate: record.rate,
      echAssessment: record.echAssessment,
      total: record.total,
      netPending: record.netPending,
      remarks: record.remarks,
    });
    setInputState(false);
    setIsModalVisible(true);
    setOkText('Save');
    setID(record.id);
    setPin(record.pin);
  };

  const editForm3 = async () => {
    setConfirmLoading(true);

    const parametersForEdit = {
      id: dataInModal.id,
      pin: dataInModal.pin,
      districtCode: districtCode,
      talukaCode: talukaCode,
      cCode: codeVillage,
      classes: dataInModal.classes,
      kindAndHowLongContinuable: dataInModal.kindAndHowLongContinuable,
      runningNoEachClass:
        dataInModal.runningNoEachClass != null ? dataInModal.runningNoEachClass : serialNumber,
      hissaNo: dataInModal.hissaNo,
      netCultiAreaH: dataInModal.netCultiAreaH,
      assessment: dataInModal.assessment,
      naAreaH: dataInModal.naAreaH,
      naAssessment: dataInModal.naAssessment,
      sanadNo: dataInModal.sanadNo,
      noInRegisterOfLands: dataInModal.noInRegisterOfLands,
      juniSalami: dataInModal.juniSalami,
      rate: dataInModal.rate,
      echAssessment: dataInModal.echAssessment,
      total: dataInModal.total,
      netPending: dataInModal.netPending,
      remarks: dataInModal.remarks,
    };
    if (okText === 'Save') {
      sendRequest(
        `${URLS.BaseURL}/form3/editForm3`,
        'PUT',
        parametersForEdit,
        (res) => {
          if (res.status === 200) {
            message.success('Data Updated!');
            getForm3Data();
            setConfirmLoading(false);
            setIsModalVisible(false);
          }
        },
        (err) => {
          setIsModalVisible(false);
          setConfirmLoading(false);
        },
      );
    } else if (okText === 'Okay') {
      setIsModalVisible(false);
      setConfirmLoading(false);
    }
  };

  // const getValueForClass = async (value) => {
  //   setTypeAndContinuable(typesOfSanad(value));
  // };

  return (
    <>
      <PageContainer>
        <Card>
          <Row>
            <Col xl={22} lg={22} md={22} sm={20} xs={20}>
              <h2 style={{ textAlign: 'center', marginBottom: '10px' }}>
                <FormattedMessage id="villageForm3.form.villageTitle" />
              </h2>
              <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>
                <FormattedMessage id="villageForm3.label.enamLand" />
              </h3>
            </Col>
            {/* <Col xl={2} lg={2} md={2} sm={4} xs={4}>
              <Button type="primary" onClick={addForm}>
                <FormattedMessage id="formLanguage.button.add" />
              </Button>
            </Col> */}
          </Row>
          <VillageSelector
            pageType="withoutYear"
            setCodeVillage={setCodeVillage}
            setTextForVillage={setTextForVillage}
            onVillageChange={(setVillage, setVillageForm3Data)}
            yearChange={setRevenueYear}
            setIsNirank={setIsNirank}
          />
          <Row style={{ marginTop: '20px' }}>
            <Col xl={7} lg={8} md={20} sm={19} xs={19}>
              <Form.Item
                labelCol={{ xl: 10, lg: 13 }}
                wrapperCol={{ xl: 13, lg: 10, xs: 10 }}
                label={<FormattedMessage id="formLanguage.table.surveyNo" />}
                name="surveyNumber"
                rules={[{ required: true, message: 'Survey Number is Required' }]}
                // style={{ marginLeft: '9px' }}
              >
                <Input
                  onKeyPress={KeyPressEvents.isInputNumber}
                  style={{ marginLeft: 5 }}
                  maxLength={7}
                  onChange={handleChangeForSurveyNo}
                />
              </Form.Item>
            </Col>

            <Col xl={1} lg={1} md={1} sm={1}></Col>
            <Col xl={2} lg={2} md={2} sm={2} xs={2}>
              {!isNirank && (
                <Button
                  type="primary"
                  /* onClick={getForm3Data} */ onClick={() => {
                    if (textForVillage) {
                      getForm3Data();
                    } else if (textForVillage == null) {
                      message.info('Please Select Village !');
                    }
                  }}
                >
                  <FormattedMessage id="formLanguage.button.search" />
                </Button>
              )}
            </Col>
          </Row>
        </Card>
        {isNirank && (
          <>
            <Alert message="टीप" description="सदर गाव नमुना निरंक आहे." type="info" showIcon />
          </>
        )}
        <Card>
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            {!isNirank && (
              <Table
                bordered
                scroll={{ y: 350, x: 1900 }}
                loading={isLoading}
                dataSource={VillageForm3Data}
                columns={columns}
              />
            )}
          </Col>
        </Card>
        <Modal
          title={<FormattedMessage id="formLanguage.form.popForDelete" />}
          visible={modalForDelete}
          okText={<FormattedMessage id="formLanguage.form.yes" />}
          okType="danger"
          cancelText={<FormattedMessage id="formLanguage.form.no" />}
          onCancel={onCancelForDelete}
          onOk={deleteForm3Data}
        ></Modal>
        <Modal
          width={1000}
          visible={isModalVisible}
          okText={okText}
          onCancel={handleCancelForModal}
          onOk={editForm3}
          confirmLoading={confirmLoading}
        >
          <Card>
            <Divider orientation="left">e-Chawdi</Divider>
            <Form layout="vertical" form={form}>
              <Row>
                <Col span={7}>
                  <Form.Item
                    label="वर्ग"
                    name="classes"
                    rules={[{ required: true, message: 'Class is necessary!' }]}
                  >
                    <Select
                      disabled={inputState}
                      defaultValue={dataInModal && dataInModal.classes}
                      onChange={(e) => {
                        setDataInModal((preDataInModal) => ({
                          ...preDataInModal,
                          classes: e,
                        }));
                      }}
                      onSelect={(value) => {
                        setTypeAndContinuable(typesOfSanad(value));
                      }}
                    >
                      <Select.Option value="इनाम वर्ग-१">इनाम वर्ग-१</Select.Option>
                      <Select.Option value="इनाम वर्ग-२">इनाम वर्ग-२</Select.Option>
                      <Select.Option value="इनाम वर्ग-३">इनाम वर्ग-३</Select.Option>
                      <Select.Option value="इनाम वर्ग-४">इनाम वर्ग-४</Select.Option>
                      <Select.Option value="इनाम वर्ग-५">इनाम वर्ग-५</Select.Option>
                      <Select.Option value="इनाम वर्ग-६अ">इनाम वर्ग-६अ</Select.Option>
                      <Select.Option value="इनाम वर्ग-६ब">इनाम वर्ग-६ब</Select.Option>
                      <Select.Option value="इनाम वर्ग-७">इनाम वर्ग-७</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={1}></Col>
                <Col span={7}>
                  <Form.Item
                    label={<FormattedMessage id="villageForm3.form.howLongContinuable" />}
                    name="kindAndHowLongContinuable"
                    rules={[{ required: true, message: 'Field is necessary!' }]}
                  >
                    <Input
                      onKeyPress={KeyPressEvents.isInputVarchar}
                      max={50}
                      disabled={true}
                      defaultValue={dataInModal && dataInModal.kindAndHowLongContinuable}
                      onChange={(e) => {
                        setDataInModal((preDataInModal) => ({
                          ...preDataInModal,
                          kindAndHowLongContinuable: e.target.value,
                        }));
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col span={1}></Col>
                <Col span={7}>
                  <Form.Item
                    label="चालु क्रमांक"
                    name="runningNoEachClass"
                    rules={[{ required: true, message: 'Field is necessary!' }]}
                  >
                    <Input
                      onKeyPress={KeyPressEvents.isInputVarchar}
                      max={50}
                      disabled={true}
                      defaultValue={dataInModal && dataInModal.runningNoEachClass}
                      onChange={(e) => {
                        setDataInModal((preDataInModal) => ({
                          ...preDataInModal,
                          runningNoEachClass: e.target.value,
                        }));
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={15}>
                  <Form.Item
                    label={<FormattedMessage id="villageForm3.form.registerOfLands" />}
                    name="noInRegisterOfLands"
                    // rules={[{ required: true, message: 'Field is necessary!' }]}
                  >
                    <Input.TextArea
                      onKeyPress={KeyPressEvents.isInputVarchar}
                      max={50}
                      disabled={inputState}
                      defaultValue={dataInModal && dataInModal.noInRegisterOfLands}
                      onChange={(e) => {
                        setDataInModal((preDataInModal) => ({
                          ...preDataInModal,
                          noInRegisterOfLands: e.target.value,
                        }));
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col span={1}></Col>

                <Col span={8}>
                  <Form.Item
                    label={<FormattedMessage id="villageForm3.form.sanadNo" />}
                    name="sanadNo"
                    //rules={[{ required: true, message: 'Sanad No. is necessary!' }]}
                  >
                    <Input
                      onKeyPress={KeyPressEvents.isInputVarchar}
                      max={20}
                      disabled={inputState}
                      defaultValue={dataInModal && dataInModal.sanadNo}
                      onChange={(e) => {
                        setDataInModal((preDataInModal) => ({
                          ...preDataInModal,
                          sanadNo: e.target.value,
                        }));
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col span={1}></Col>
              </Row>
              <Row>
                <Col span={7}>
                  <Form.Item
                    label="जुनी सलामी"
                    name="juniSalami"
                    //  rules={[{ required: true, message: 'Field is necessary!' }]}
                  >
                    <Input
                      onKeyPress={KeyPressEvents.isInputVarchar}
                      max={50}
                      disabled={inputState}
                      defaultValue={dataInModal && dataInModal.juniSalami}
                      onChange={(e) => {
                        setDataInModal((preDataInModal) => ({
                          ...preDataInModal,
                          juniSalami: e.target.value,
                        }));
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col span={1}></Col>
                <Col span={7}>
                  <Form.Item
                    label="दर"
                    name="rate"
                    // rules={[{ required: true, message: 'Field is necessary!' }]}
                  >
                    <Input
                      onKeyPress={KeyPressEvents.isInputVarchar}
                      max={50}
                      disabled={inputState}
                      defaultValue={dataInModal && dataInModal.rate}
                      onChange={(e) => {
                        setDataInModal((preDataInModal) => ({
                          ...preDataInModal,
                          rate: e.target.value,
                        }));
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col span={1}></Col>
                <Col span={7}>
                  <Form.Item
                    label="आकारणी"
                    name="echAssessment"
                    // rules={[{ required: true, message: 'Field is necessary!' }]}
                  >
                    <Input
                      onKeyPress={KeyPressEvents.isInputVarchar}
                      max={50}
                      disabled={inputState}
                      defaultValue={dataInModal && dataInModal.echAssessment}
                      onChange={(e) => {
                        setDataInModal((preDataInModal) => ({
                          ...preDataInModal,
                          echAssessment: e.target.value,
                        }));
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row>
                <Col span={7}>
                  <Form.Item
                    label="एकूण"
                    name="total"
                    //  rules={[{ required: true, message: 'Field is necessary!' }]}
                  >
                    <Input
                      onKeyPress={KeyPressEvents.isInputVarchar}
                      max={50}
                      disabled={inputState}
                      defaultValue={dataInModal && dataInModal.total}
                      onChange={(e) => {
                        setDataInModal((preDataInModal) => ({
                          ...preDataInModal,
                          total: e.target.value,
                        }));
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col span={1}></Col>
                <Col span={7}>
                  <Form.Item
                    label="दुमालादाराकडील शिल्लक किंवा नुकसान"
                    name="netPending"
                    // rules={[{ required: true, message: 'Field is necessary!' }]}
                  >
                    <Input
                      onKeyPress={KeyPressEvents.isInputVarchar}
                      max={50}
                      disabled={inputState}
                      defaultValue={dataInModal && dataInModal.netPending}
                      onChange={(e) => {
                        setDataInModal((preDataInModal) => ({
                          ...preDataInModal,
                          netPending: e.target.value,
                        }));
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col span={1}></Col>
                <Col span={7}>
                  <Form.Item
                    label={<FormattedMessage id="villageForm3.form.remarks" />}
                    name="remarks"
                    // rules={[{ required: true, message: 'Remarks is necessary!' }]}
                  >
                    <Input.TextArea
                      onKeyPress={KeyPressEvents.isInputChar}
                      max={200}
                      disabled={inputState}
                      defaultValue={dataInModal && dataInModal.remarks}
                      onChange={(e) => {
                        setDataInModal((preDataInModal) => ({
                          ...preDataInModal,
                          remarks: e.target.value,
                        }));
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
        </Modal>
      </PageContainer>
    </>
  );
}

export default TableForm3;
