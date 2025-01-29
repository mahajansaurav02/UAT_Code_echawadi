import VillageSelector from '@/components/eComponents/VillageSelector';
import { DeleteOutlined, EditTwoTone, EyeTwoTone, SearchOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import {
  Alert,
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Table,
} from 'antd';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { useHistory, useLocation } from 'react-router-dom';
import useAxios from '@/components/eComponents/use-axios';
import URLS from '@/URLs/urls';
import { FormattedMessage, useModel } from 'umi';
import ESelector from '@/components/eComponents/ESelector';
import KeyPressEvents from '@/util/KeyPressEvents';

function Table1B() {
  const { districtName, servarthId, districtCode, talukaCode } = useModel('details');
  const [codeVillage, setCodeVillage] = useState('');
  const [textForVillage, setTextForVillage] = useState();
  const [village, setVillage] = useState([]);
  const [form1Edata, setForm1Edata] = useState();
  const [dataInModal, setDataInModal] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [inputState, setInputState] = useState();
  const [dateOfEncroachment, setDateOfEncroachment] = useState();
  const [valueForRemovedYear, setValueForRemovedYear] = useState();
  const [decisionDate, setDecisionDate] = useState();
  const [valueForRentYear, setValueForRentYear] = useState();
  const [okText, setOkText] = useState();
  const [ID, setID] = useState();
  const [modalForDelete, setModalForDelete] = useState(false);
  const [recordId, setRecordId] = useState();
  const { sendRequest } = useAxios();
  const [revenueYear, setRevenueYear] = useState();
  const [isNirank, setIsNirank] = useState(false);
  const [surveyNumberValue, setSurveyNumberValue] = useState();
  const [file, setFile] = useState(null);
  const [areaOfEnchroachment, setAreaOfEnchroachment] = useState();
  const [area, setArea] = useState();
  const [dateOfDecisionOnEncroachment, setDateOfDecisionOnEncroachment] = useState();
  const [yearOfEncroachmentNotedIfRemoved, setYearOfEncroachmentNotedIfRemoved] = useState();
  const [showNewDate, setShowNewDate] = useState(false);
  const [showNewYear, setShowNewYear] = useState(false);
  const [saveFlag, setSaveFlag] = useState(false);
  const [form1] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFile = async (e) => {
    function checkFileSize(fileSize) {
      if (fileSize >= 2097152) {
        message.error('File Should not be more than 2 MB !');
        form1E.setFieldsValue({ image: '' });
        return false;
      } else {
        return true;
      }
    }

    const errorMessage = async () => {
      message.info(' Area of Enchroachment should be Less than or Equal to Total Area');
    };

    useEffect(() => {
      if (areaOfEnchroachment > area) {
        errorMessage();
        setSaveFlag(false);
      } else {
        setSaveFlag(true);
      }
    }, [areaOfEnchroachment, area]);

    function checkFileExtension(filename) {
      const extension = filename.split('.').pop();
      // console.log(extension);
      if (['jpeg', 'jpg', 'png', 'pdf'].indexOf(extension) < 0) {
        message.error('Please Select Valid File Format JPEG,JPG,PNG,PDF!');
        form1E.setFieldsValue({ image: '' });
        return false;
      } else {
        return true;
      }
    }
    if (e.target.files && e.target.files.length > 0) {
      if (checkFileExtension(e.target.files[0].name)) {
        if (checkFileSize(e.target.files[0].size)) {
          setFile(e.target.files[0]);
          setSelectedImage(await getBase64(e.target.files[0]));
        }
      }
    } else {
      setSelectedImage(null);
    }
    e.target.files = null;
    const myfile = URL.creatObjectURL(e.target.files[0]);
    setFile(myfile);
    // console.log(e.target.files);
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(myfile);
    }
  };

  const columns = [
    {
      key: '1',
      title: <FormattedMessage id="formLanguage.form.serialNo" />,
      dataIndex: 'srNo',
    },
    {
      key: '2',
      title: <FormattedMessage id="villageForm1E.table.surveyHissa" />,
      dataIndex: 'pin',
    },
    {
      key: '3',
      title: <FormattedMessage id="villageForm1E.table.nameEnchroacher" />,
      dataIndex: 'nameOfEncroacher',
    },
    {
      key: '4',
      title: <FormattedMessage id="villageForm1E.table.totalArea" />,
      dataIndex: 'totalArea',
    },
    {
      key: '5',
      title: <FormattedMessage id="villageForm1E.table.areaOfEnchroached" />,
      dataIndex: 'areaOfEncroached',
    },
    {
      key: '6',
      title: <FormattedMessage id="villageForm1E.table.dateOfEnchroachment" />,
      render: (record) => {
        return <FormattedMessage id={record.purposeOfEncroachmentLand} />;
      },
    },
    {
      key: '7',
      title: <FormattedMessage id="villageForm1E.table.enchroachmentDate" />,
      dataIndex: 'dateOfEncroachment',
    },
    {
      key: '8',
      title: <FormattedMessage id="villageForm1E.table.rentRecoverable" />,
      dataIndex: 'yearFromWhichRentRecoverable',
    },
    {
      key: '9',
      title: <FormattedMessage id="villageForm1E.table.enchroachmentColumn" />,
      dataIndex: 'yearOfEncroachmentNotedIfRemoved',
    },
    {
      key: '10',
      title: <FormattedMessage id="villageForm1E.table.decisionOfEnchroachment" />,
      dataIndex: 'dateOfDecisionOnEncroachment',
    },

    {
      key: '11',
      title: <FormattedMessage id="formLanguage.table.remark" />,
      dataIndex: 'remarks',
    },

    {
      title: <FormattedMessage id="formLanguage.table.action" />,
      width: '56px',

      render: (record) => {
        return (
          <>
            <Row>
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
            </Row>
          </>
        );
      },
    },
  ];

  function cancel(e) {
    // console.log(e);
    message.error('Request Cancelled !!!');
  }

  const onCancelForDelete = () => {
    setModalForDelete(false);
  };

  const deleteRecord = (record) => {
    setRecordId(record.id);
    setModalForDelete(true);
  };

  const deleteRecordFor1E = async (record) => {
    setModalForDelete(false);
    sendRequest(`${URLS.BaseURL}/form1e/discardForm1E?id=${recordId}`, 'DELETE', null, (res) => {
      if (res.status === 226) {
        message.success('Record Deleted!');
        setForm1Edata([]);
        showForm1E();
      }
    });
  };

  function handleChangeForSurveyNo(event) {
    setSurveyNumberValue(event.target.value);
  }

  const showModalForEdit = (record) => {
    //setShowNewDate(false);
    setShowNewYear(false);

    // if (record.dateOfDecisionOnEncroachment === 'No Date Specified') {
    //   setShowNewDate(true);
    // }
    // if (record.yearOfEncroachmentNotedIfRemoved === 'No Year Specified') {
    //   setShowNewYear(true);
    // }
    // console.log('Full Record', record);
    setDataInModal({
      id: record.id,
      pin: record.pin,
      nameOfEncroacher: record.nameOfEncroacher,
      dateOfEncroachment: record.dateOfEncroachment,
      purposeOfEncroachmentLand: record.purposeOfEncroachmentLand,
      yearFromWhichRentRecoverable: record.yearFromWhichRentRecoverable,
      yearOfEncroachmentNotedIfRemoved: record.yearOfEncroachmentNotedIfRemoved,
      dateOfDecisionOnEncroachment: record.dateOfDecisionOnEncroachment,
      remarks: record.remarks,
      hissaNo: record.hissaNo,
      areaOfEncroached: record.areaOfEncroached,
    });
    setDateOfEncroachment(record.dateOfEncroachment);
    setDecisionDate(record.dateOfDecisionOnEncroachment);
    setInputState(false);
    // console.log('Data in DataInModal state==>', record);
    setIsModalVisible(true);
    setOkText('Save');
    setID(record.id);
    setSurveyNumberValue(record.pin);
  };
  const showModalForView = (record) => {
    setDataInModal({
      id: record.id,
      pin: record.pin,
      nameOfEncroacher: record.nameOfEncroacher,
      dateOfEncroachment: record.dateOfEncroachment,
      purposeOfEncroachmentLand: record.purposeOfEncroachmentLand,
      yearFromWhichRentRecoverable: record.yearFromWhichRentRecoverable,
      yearOfEncroachmentNotedIfRemoved: record.yearOfEncroachmentNotedIfRemoved,
      dateOfDecisionOnEncroachment: record.dateOfDecisionOnEncroachment,
      remarks: record.remarks,
      areaOfEncroached: record.areaOfEncroached,
    });

    setInputState(true);
    // console.log('Data in DataInModal state==>', record);
    setIsModalVisible(true);
    setOkText('Okay');
  };
  const handleCancelForModal = () => {
    setIsModalVisible(false);
  };

  const showForm1E = async () => {
    setForm1Edata([]);
    setIsLoading(true);

    sendRequest(
      `${URLS.BaseURL}/form1e/getForm1EData?districtCode=${districtCode}&talukaCode=${talukaCode}&cCode=${codeVillage}&pin=${surveyNumberValue}`,
      'GET',
      null,
      (res) => {
        res.data.form1EData.map((r) => {
          // if (r.dateOfDecisionOnEncroachment == null) {
          //   setShowNewDate(true);
          // } else {
          //   setDateOfDecisionOnEncroachment(r.dateOfDecisionOnEncroachment);
          //   setShowNewDate(false);
          // }
          if (r.yearOfEncroachmentNotedIfRemoved == null) {
            setShowNewYear(true);
          } else {
            setYearOfEncroachmentNotedIfRemoved(r.yearOfEncroachmentNotedIfRemoved);
            setShowNewYear(false);
          }
        });
        setForm1Edata(
          res.data.form1EData.map((r, i) => ({
            id: r.id,
            pin: r.pin,
            dateOfDecisionOnEncroachment:
              r.dateOfDecisionOnEncroachment != null
                ? moment(r.dateOfDecisionOnEncroachment, 'YYYY-MM-DD').format('YYYY-MM-DD')
                : null,
            nameOfEncroacher: r.nameOfEncroacher,
            dateOfEncroachment:
              r.dateOfEncroachment != null
                ? moment(r.dateOfEncroachment, 'YYYY-MM-DD').format('YYYY-MM-DD')
                : 'No Date Specified',
            purposeOfEncroachmentLand: r.purposeOfEncroachmentLand,
            yearFromWhichRentRecoverable: r.yearFromWhichRentRecoverable,
            yearOfEncroachmentNotedIfRemoved:
              r.yearOfEncroachmentNotedIfRemoved != null
                ? r.yearOfEncroachmentNotedIfRemoved
                : 'No Year Specified',
            areaOfEncroached: r.areaOfEncroached,
            totalArea: r.totalArea,
            remarks: r.remarks,
            srNo: i + 1,
            hissaNo: r.hissaNo,
          })),
        );
        if (res.status === 200) {
          message.success('Records Fetched!');
          setIsLoading(false);
        } else {
          // console.log('check');
          setForm1Edata();
          setIsLoading(false);
        }
      },
    );
  };

  let history = useHistory();
  const pushToVillageForm = () => {
    history.push({
      pathname: `/form/village-form-1E/village-form`,
    });
  };

  const editForm1E = async () => {
    // console.log('dateOfEncroachment record', dataInModal.dateOfEncroachment);
    // console.log(' dateOfDecisionOnEncroachment record', dataInModal.dateOfDecisionOnEncroachment);
    // console.log('dateOfEncroachment state', dateOfEncroachment);
    // console.log('decisionDate state', decisionDate);
    setConfirmLoading(true);

    let dateOfDecisionOnEncroachmentI =
      form1.getFieldValue('dateOfDecisionOnEncroachment') &&
      form1.getFieldValue('dateOfDecisionOnEncroachment') !== 'Invalid date'
        ? moment(form1.getFieldValue('dateOfDecisionOnEncroachment'), 'DD/MM/YYYY').format(
            'YYYY-MM-DD',
          )
        : null;

    if (!dateOfDecisionOnEncroachmentI) {
      if (
        dataInModal.dateOfDecisionOnEncroachment &&
        dataInModal.dateOfDecisionOnEncroachment !== 'Invalid date'
      ) {
        dateOfDecisionOnEncroachmentI = moment(dataInModal.dateOfDecisionOnEncroachment).format(
          'YYYY-MM-DD',
        );
      }
    }
    const parametersForEdit = {
      revenueYear: revenueYear,
      districtCode: districtCode,
      talukaCode: talukaCode,
      cCode: codeVillage,
      id: ID,
      pin: surveyNumberValue,
      hissaNo: dataInModal.hissaNo,
      nameOfEncroacher: dataInModal.nameOfEncroacher,
      purposeOfEncroachmentLand: dataInModal.purposeOfEncroachmentLand,
      dateOfEncroachment: moment(dataInModal.dateOfEncroachment).format('YYYY-MM-DD'),
      dateOfDecisionOnEncroachment: dateOfDecisionOnEncroachmentI,
      yearFromWhichRentRecoverable: moment(valueForRentYear).format('YYYY'),
      yearOfEncroachmentNotedIfRemoved: moment(valueForRemovedYear).format('YYYY'),
      remarks: dataInModal.remarks,
      areaOfEncroached: dataInModal.areaOfEncroached,
    };

    if (okText === 'Save') {
      // console.log(parametersForEdit);
      sendRequest(
        `${URLS.BaseURL}/form1e/editForm1E`,
        'POST',
        parametersForEdit,
        (res) => {
          if (res.status === 200) {
            message.success('Record Saved!');
            showForm1E();
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
  const handleESelectorChange = (sn, cCodeT, textForVillage, revenueYear) => {
    setSurveyNumberValue(sn);
    setCodeVillage(cCodeT);
    setRevenueYear(revenueYear);
    setTextForVillage(textForVillage);
    // console.log('handleChangeForSurveyNoT in Form', revenueYear, textForVillage);
  };

  return (
    <>
      <PageContainer>
        <Card>
          <Row>
            <Col xl={8} lg={8} md={8} sm={7} xs={6}></Col>
            <Col xl={5} lg={7} md={7} sm={9} xs={11}>
              <h1>
                <center>
                  {<FormattedMessage id="villageForm1E.table.registerEnchroachment" />}
                </center>{' '}
              </h1>
            </Col>
            <Col xl={9} lg={7} md={7} sm={6} xs={2}></Col>

            <Col xl={2} lg={2} md={2} sm={2} xs={2}>
              {!isNirank && (
                <Button
                  onClick={pushToVillageForm}
                  type="primary"
                  style={{ marginBottom: '10px', marginTop: '5px' }}
                >
                  <FormattedMessage id="formLanguage.button.add" />
                </Button>
              )}
            </Col>
          </Row>
          <VillageSelector
            pageType="withoutYear"
            setCodeVillage={setCodeVillage}
            setTextForVillage={setTextForVillage}
            onVillageChange={(setVillage, setForm1Edata)}
            yearChange={setRevenueYear}
            setIsNirank={setIsNirank}
          />

          <Row style={{ marginTop: 10 }}>
            <Col xl={8} lg={11} md={20} sm={19} xs={17}>
              <Input
                // labelCol={{xs:9}}
                // wrapperCol={{xs:12}}
                onKeyPress={KeyPressEvents.isInputNumber}
                maxLength={7}
                onChange={handleChangeForSurveyNo}
                addonBefore={<FormattedMessage id="formLanguage.table.surveyNo" />}
                // style={{ width: '200px' }}
              />
            </Col>
            <Col lg={1} md={1} sm={1} xs={1}></Col>
            <Col span={6}>
              {!isNirank && (
                <Button
                  onClick={() => {
                    if (textForVillage && surveyNumberValue) {
                      showForm1E();
                    } else if (textForVillage == null) {
                      message.info('Please Select Village');
                    } else if (surveyNumberValue == null) {
                      message.info('Please Enter Survey Number ');
                    }
                  }}
                  type="primary" /* shape="circle" icon={<SearchOutlined />} */
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
        <Card border={true}>
          {!isNirank && (
            <Table
              loading={isLoading}
              bordered
              scroll={{ x: 100 }}
              dataSource={form1Edata}
              columns={columns}
            />
          )}
        </Card>
        <Modal
          title={<FormattedMessage id="formLanguage.form.popForDelete" />}
          visible={modalForDelete}
          okText={<FormattedMessage id="formLanguage.form.yes" />}
          okType="danger"
          cancelText={<FormattedMessage id="formLanguage.form.no" />}
          onCancel={onCancelForDelete}
          onOk={deleteRecordFor1E}
        ></Modal>
        <Modal
          width={1000}
          title={<FormattedMessage id="villageForm1E.table.viewEdit" />}
          visible={isModalVisible}
          okText={okText}
          // okButtonProps={{ disabled: okButtonState }}
          onOk={editForm1E}
          onCancel={handleCancelForModal}
          confirmLoading={confirmLoading}
        >
          <Form layout="vertical" form={form1}>
            <Row>
              <Col span={11}>
                <Input
                  onKeyPress={KeyPressEvents.isInputChar}
                  max={30}
                  disabled={inputState}
                  value={dataInModal && dataInModal.nameOfEncroacher}
                  addonBefore={<FormattedMessage id="villageForm1E.table.nameEnchroacher" />}
                  onChange={(e) => {
                    setDataInModal((prevDataInModal) => ({
                      ...prevDataInModal,
                      nameOfEncroacher: e.target.value,
                    }));
                  }}
                />
              </Col>
              <Col span={1}></Col>
              <Col span={12} style={{ paddingTop: 25 }}></Col>
            </Row>
            <Row style={{ marginTop: 20 }}>
              <Col span={11}>
                <Form.Item
                  label={<FormattedMessage id="villageForm1E.table.enchroachmentDate" />}
                  name="dateOfEncroachment"
                  rules={[
                    {
                      required: true,
                      message: 'This Field is Required',
                    },
                  ]}
                >
                  <DatePicker
                    disabled={inputState}
                    defaultValue={dataInModal && moment(dataInModal.dateOfEncroachment)}
                    onChange={(e) => {
                      setDataInModal((prevDataInModal) => ({
                        ...prevDataInModal,
                        dateOfEncroachment: moment(e).format('YYYY-MM-DD'),
                      }));
                      setDateOfEncroachment(moment(e).format('YYYY-MM-DD'));
                    }}
                    style={{ marginLeft: 3 }}
                  ></DatePicker>
                </Form.Item>
              </Col>
              <Col span={1}></Col>

              <Col span={12}>
                <Form.Item
                  label={<FormattedMessage id="villageForm1E.table.enchroachmentPurpose" />}
                  name="purposeOfEncroachmentLand"
                  rules={[
                    {
                      required: true,
                      message: 'This Field is Required',
                    },
                  ]}
                >
                  <Select
                    disabled={inputState}
                    defaultValue={dataInModal && dataInModal.purposeOfEncroachmentLand}
                    onChange={(e) => {
                      setDataInModal((prevDataInModal) => ({
                        ...prevDataInModal,
                        purposeOfEncroachmentLand: e,
                      }));
                    }}
                  >
                    <Select.Option value="villageForm1E.table.agriculture">
                      <FormattedMessage id="villageForm1E.table.agriculture" />
                    </Select.Option>
                    <Select.Option value="villageForm1E.table.Non-agricultural">
                      <FormattedMessage id="villageForm1E.table.Non-agricultural" />
                    </Select.Option>
                    <Select.Option value="villageForm1E.table.Resident">
                      <FormattedMessage id="villageForm1E.table.Resident" />
                    </Select.Option>
                    <Select.Option value="villageForm1E.table.Farming">
                      <FormattedMessage id="villageForm1E.table.Farming" />
                    </Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row style={{ marginTop: 20 }}>
              <Col span={11}>
                <Form.Item
                  label={<FormattedMessage id="villageForm1E.table.rentRecoverable" />}
                  name="yearFromWhichRentRecoverable"
                  rules={[
                    {
                      required: true,
                      message: 'This Field is Required',
                    },
                  ]}
                >
                  <DatePicker
                    onChange={(e) => {
                      setValueForRentYear(e);
                    }}
                    defaultValue={
                      dataInModal && moment(dataInModal.yearFromWhichRentRecoverable, 'YYYY')
                    }
                    disabled={inputState}
                    picker="year"
                  ></DatePicker>
                </Form.Item>
              </Col>
              <Col span={1}></Col>
              <Col span={12}>
                {dataInModal && dataInModal.dateOfDecisionOnEncroachment === null ? (
                  <Form.Item
                    name={'dateOfDecisionOnEncroachment'}
                    label={<FormattedMessage id="villageForm1E.table.decisionOfEnchroachment" />}
                  >
                    <DatePicker
                      disabled={inputState}
                      // onSelect={(e) => {
                      //   setPeriodFromDate(e);
                      // }}
                    />
                  </Form.Item>
                ) : (
                  <Form.Item
                    name={'dateOfDecisionOnEncroachment'}
                    label={<FormattedMessage id="villageForm1E.table.decisionOfEnchroachment" />}
                  >
                    <DatePicker
                      disabled={inputState}
                      defaultValue={dataInModal && moment(dataInModal.dateOfDecisionOnEncroachment)}
                      onChange={(e) => {
                        setDataInModal((prevDataInModal) => ({
                          ...prevDataInModal,
                          dateOfDecisionOnEncroachment: moment(e).format('YYYY-MM-DD'),
                        }));
                        setDecisionDate(moment(e).format('YYYY-MM-DD'));
                      }}
                    ></DatePicker>
                  </Form.Item>
                )}
              </Col>
            </Row>
            <Row style={{ marginTop: 20 }}>
              <Col span={11}>
                {showNewYear == true ? (
                  <>
                    <Form.Item
                      label={<FormattedMessage id="villageForm1E.table.enchroachmentColumn" />}
                    >
                      <DatePicker
                        onChange={(e) => {
                          setValueForRemovedYear(e);
                        }}
                        disabled={inputState}
                        style={{ marginLeft: 3 }}
                        picker="year"
                      ></DatePicker>
                    </Form.Item>
                  </>
                ) : (
                  <>
                    <Form.Item
                      label={<FormattedMessage id="villageForm1E.table.enchroachmentColumn" />}
                    >
                      <DatePicker
                        onChange={(e) => {
                          setValueForRemovedYear(e);
                        }}
                        disabled={inputState}
                        defaultValue={
                          dataInModal &&
                          moment(dataInModal.yearOfEncroachmentNotedIfRemoved, 'YYYY')
                        }
                        style={{ marginLeft: 3 }}
                        picker="year"
                      ></DatePicker>
                    </Form.Item>
                  </>
                )}
              </Col>
              <Col span={1}></Col>
              <Col span={12}>
                <Form.Item
                  label={<FormattedMessage id="villageForm1E.table.areaOfEnchroached" />}
                  name="areaOfEncroached"
                  rules={[
                    {
                      required: true,
                      message: 'This Field is Required',
                    },
                  ]}
                >
                  <Input
                    onKeyPress={KeyPressEvents.isInputDecimal}
                    max={15}
                    disabled={inputState}
                    value={dataInModal && dataInModal.areaOfEncroached}
                    onChange={(e) => {
                      setDataInModal((prevDataInModal) => ({
                        ...prevDataInModal,
                        areaOfEncroached: e.target.value,
                      }));
                    }}
                  ></Input>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item label={<FormattedMessage id="formLanguage.table.remark" />}>
                  <Input.TextArea
                    onKeyPress={KeyPressEvents.isInputChar}
                    max={201}
                    disabled={inputState}
                    value={dataInModal && dataInModal.remarks}
                    onChange={(e) => {
                      setDataInModal((prevDataInModal) => ({
                        ...prevDataInModal,
                        remarks: e.target.value,
                      }));
                    }}
                  ></Input.TextArea>
                </Form.Item>
              </Col>
            </Row>
          </Form>

          {/* <Row>
            <Col span={7}>
                <Input
                  accept="image/png,image/jpeg,image/jpeg,application/pdf"
                  type={'file'}
                  name={'file'}
                  onChange={(e) => handleFile(e)}
                >
                </Input>
             </Col>
          </Row> */}
        </Modal>
      </PageContainer>
    </>
  );
}

export default Table1B;
