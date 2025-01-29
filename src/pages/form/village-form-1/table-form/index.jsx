import React, { useEffect, useState } from 'react';

import {
  Card,
  Button,
  Divider,
  Table,
  Col,
  Row,
  Select,
  Input,
  Form,
  Modal,
  message,
  Space,
  DatePicker,
  Alert,
} from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import Axios from 'axios';
import { useHistory } from 'react-router-dom';
import { DeleteOutlined, EditTwoTone, EyeTwoTone, SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import moment from 'moment';
import URLS from '@/URLs/urls';
import useAxios from '@/components/eComponents/use-axios';
import VillageSelector from '@/components/eComponents/VillageSelector';
import { FormattedMessage, useModel } from 'umi';
import ValidationExpressions from '@/util/ValidationExpressions';
import KeyPressEvents from '@/util/KeyPressEvents';
import { CSVLink } from 'react-csv';
//for table############

function VillageForm1TableForm() {
  const { districtName, servarthId, districtCode, talukaCode } = useModel('details');
  const { sendRequest } = useAxios();
  const [textVillage, setTextVillage] = useState('');
  const [textForVillage, setTextForVillage] = useState();
  const [village, setVillage] = useState([]);
  const [codeVillage, setCodeVillage] = useState('');
  const [surveyNumberValue, setSurveyNumberValue] = useState('');
  const [villageForm1, setVillageForm1] = useState([]);
  const [recordId, setRecordId] = useState();
  const [modalForDelete, setModalForDelete] = useState(false);
  const [buttonFlag, setButtonFlag] = useState(true);
  const [loadingButton, setLoadingButton] = useState(false);
  const [revenueYear, setRevenueYear] = useState();
  const [potkharabaType, setPotkharabaType] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [dataInModal, setDataInModal] = useState();
  const [inputState, setInputState] = useState();
  const [okText, setOkText] = useState();
  const [ID, setID] = useState();
  let history = useHistory();
  const [form1] = Form.useForm();
  const [isNirank, setIsNirank] = useState(false);

  // useEffect(() => {
  //   setVillageForm1('');
  // }, [textForVillage]);

  function handleChangeForSurveyNo(event) {
    setSurveyNumberValue(event.target.value);
    setVillageForm1('');
    setButtonFlag(false);
  }

  const handleChange = (event) => {
    setTextInput(event.target.value);
  };

  const handleCancelForModal = () => {
    setIsModalVisible(false);
  };

  const addForm = () => {
    history.push({
      pathname: `/form/village-form-1/village-form`,
      state: {
        pageMode: 'Add',
      },
    });
  };

  const onCancelForDeleteModal = () => {
    setModalForDelete(false);
  };

  const showModalForView = (record) => {
    form1.resetFields();
    setDataInModal({});
    setDataInModal({
      id: record.id,
      cCode: codeVillage,
      pin: record.pin,
      hissaNo: record.hissaNo,
      publicRightsOfWayAndEasements: record.publicRightsOfWayAndEasements,
      particularsOfAlteration: record.particularsOfAlteration,
      orderNo: record.orderNo,
      orderDate: record.orderDate,
      designation: record.designation,

      remarks: record.remarks,
    });
    setInputState(true);
    setIsModalVisible(true);
    setOkText('Okay');
  };

  const showModalForEdit = (record) => {
    form1.resetFields();
    setDataInModal({});
    setDataInModal({
      id: record.id,
      cCode: codeVillage,
      pin: record.pin,
      hissaNo: record.hissaNo,
      publicRightsOfWayAndEasements: record.publicRightsOfWayAndEasements,
      particularsOfAlteration: record.particularsOfAlteration,
      orderNo: record.orderNo,
      orderDate: record.orderDate,
      designation: record.designation,

      remarks: record.remarks,
    });
    setInputState(false);
    setIsModalVisible(true);
    setOkText('Save');
    setID(record.id);
  };

  const editForm1 = async () => {
    setConfirmLoading(true);
    // console.log(form1.getFieldValue('orderDate'));
    // console.log(dataInModal.orderDate);
    // console.log(moment(form1.getFieldValue('orderDate'), 'DD/MM/YYYY').format('YYYY-MM-DD'));
    // console.log(moment(dataInModal.orderDate).format('YYYY-MM-DD'));

    let orderDateI =
      form1.getFieldValue('orderDate') && form1.getFieldValue('orderDate') !== 'Invalid date'
        ? moment(form1.getFieldValue('orderDate'), 'DD/MM/YYYY').format('YYYY-MM-DD')
        : null;

    if (!orderDateI) {
      if (dataInModal.orderDate && dataInModal.orderDate !== 'Invalid date') {
        orderDateI = moment(dataInModal.orderDate).format('YYYY-MM-DD');
      }
    }

    const parameterForEdit = {
      id: ID,
      pin: dataInModal.pin,
      hissaNo: dataInModal.hissaNo,
      cCode: codeVillage,
      districtCode: districtCode,
      talukaCode: talukaCode,
      publicRightsOfWayAndEasements: dataInModal.publicRightsOfWayAndEasements,
      particularsOfAlteration: dataInModal.particularsOfAlteration,
      orderNo: dataInModal.orderNo,
      orderDate: orderDateI,
      designation: dataInModal.designation,

      remarks: dataInModal.remarks,
    };
    if (okText === 'Save') {
      sendRequest(
        `${URLS.BaseURL}/form1/editForm1`,
        'POST',
        parameterForEdit,
        (res) => {
          if (res.status === 200) {
            message.success('Data Updated!');
            getVillageForm1Data();
            setIsModalVisible(false);
            setConfirmLoading(false);
          }
        },
        (err) => {
          setConfirmLoading(false);
        },
      );
    } else if (okText === 'Okay') {
      setIsModalVisible(false);
      setConfirmLoading(false);
    }
  };

  const deleteForm1ById = async () => {
    setModalForDelete(false);
    // console.log('id in state', recordId);
    sendRequest(
      `${URLS.BaseURL}/form1/discardForm1?id=${recordId}`,
      'DELETE',
      null,
      (res) => {
        if (res.status === 226) {
          message.success('Record Deleted !');
          setVillageForm1([]);
          getVillageForm1Data();
        }
      },
      (errorCallback) => {
        // console.log('errorCallback', errorCallback);
      },
    );
  };
  const deleteRecord = (record) => {
    setRecordId(record.id);
    setModalForDelete(true);
  };

  const getVillageForm1Data = async () => {
    setVillageForm1();
    setIsLoading(true);
    // setLoadingButton(true);
    sendRequest(
      `${
        URLS.BaseURL
      }/form1/getForm1Data?districtCode=${districtCode}&talukaCode=${talukaCode}&cCode=${codeVillage.trim()}&pin=${surveyNumberValue}`,
      'GET',
      null,
      (res) => {
        let potkharabaTypeInt;
        let cultivableAreaInt;
        let naAgriAssesment;
        // console.log('test-->', res.data.form1Data);

        res.data.form1Data.map((r) => {
          if (r.naAssessment != null && r.naAssessment > 0) {
            naAgriAssesment = r.naAssessment;
          } else {
            naAgriAssesment = r.assessment;
          }

          if (r.potkharabaBH == '0.0000') {
            setPotkharabaType('अ');
            potkharabaTypeInt = 'अ';
            cultivableAreaInt = r.potkharabaAH;
          } else {
            setPotkharabaType('ब');
            potkharabaTypeInt = 'ब';
            cultivableAreaInt = r.potkharabaBH;
          }
        });
        // console.log('test for pot', cultivableAreaInt, 'type', potkharabaTypeInt);
        setVillageForm1(
          res.data.form1Data.map((row, index) => ({
            srNo: index + 1,
            id: row.id,
            surveyNumber:
              row.hissaNo == null || row.hissaNo.trim() == ''
                ? row.pin
                : row.pin + '/' + row.hissaNo,
            hissaNo: row.hissaNo,
            pin: row.pin,
            tenure: row.tenureName,
            totalAreaH: row.totalAreaH
              .substring(0, row.totalAreaH.length - 2)
              .concat('.')
              .concat(row.totalAreaH.substring(row.totalAreaH.length - 2)),
            netCultivationArea: row.netCultiAreaH
              .substring(0, row.netCultiAreaH.length - 2)
              .concat('.')
              .concat(row.netCultiAreaH.substring(row.netCultiAreaH.length - 2)),
            agricultureAssessment: naAgriAssesment,
            publicRightsOfWayAndEasements: row.publicRightsOfWayAndEasements,
            particularsOfAlteration: row.particularsOfAlteration,
            remarks: row.remarks,
            orderNo: row.orderNo,
            orderDate:
              row.orderDate != null
                ? moment(row.orderDate, 'YYYY-MM-DD').format('YYYY-MM-DD')
                : null,
            designation: row.designation,
            assessment: row.assessment,
            potkharabaAH: row.potkharabaAH,
            potkharabaBH: row.potkharabaBH,
            potkharabaType: row.potkharabaBH == '0.0000' ? 'अ' : 'ब',
            cultivableAreaInt: row.potkharabaBH == '0.0000' ? row.potkharabaAH : row.potkharabaBH,
            naAgriAssesment:
              row.naAssessment != null || row.naAssessment > 0 ? row.naAssessment : row.assessment,
          })),
        );
        if (res.console === 404) {
          message.error('Form Details Not Found');
        } else {
          message.success('Records Fetched!');
        }
        setIsLoading(false);
      },
      (err) => {
        setIsLoading(false);
      },
    );
  };

  const columns = [
    {
      key: '1',
      title: <FormattedMessage id="formLanguage.table.surveyNo" />,
      dataIndex: 'surveyNumber',
    },
    {
      key: '2',
      title: <FormattedMessage id="villageForm1.table.tenure" />,
      dataIndex: 'tenure',
    },
    {
      key: '3',
      title: <FormattedMessage id="formLanguage.table.totalArea" />,
      dataIndex: 'totalAreaH',
    },
    {
      key: '4',
      title: <FormattedMessage id="formLanguage.table.kind" />,
      dataIndex: 'potkharabaType',
    },
    {
      key: '5',
      title: <FormattedMessage id="formLanguage.table.area" />,
      dataIndex: 'cultivableAreaInt',
    },

    {
      key: '6',
      title: <FormattedMessage id="formLanguage.table.netCultivableArea" />,
      dataIndex: 'netCultivationArea',
    },
    {
      key: '7',
      title: <FormattedMessage id="formLanguage.table.naAssessment" />,
      dataIndex: 'assessment',
    },
    {
      key: '8',
      title: <FormattedMessage id="formLanguage.table.publicRights" />,
      dataIndex: 'publicRightsOfWayAndEasements',
    },
    {
      key: '9',
      title: <FormattedMessage id="formLanguage.table.alteration" />,
      dataIndex: 'particularsOfAlteration',
    },
    {
      key: '10',
      title: <FormattedMessage id="formLanguage.table.designation" />,
      render: (record) => {
        return record.designation != '' ? <FormattedMessage id={record.designation} /> : '';
      },
    },
    {
      key: '11',
      title: <FormattedMessage id="formLanguage.table.orderNo" />,
      dataIndex: 'orderNo',
    },
    {
      key: '12',
      title: <FormattedMessage id="formLanguage.table.orderDate" />,
      dataIndex: 'orderDate',
    },
    {
      key: '13',
      title: <FormattedMessage id="formLanguage.table.remark" />,
      dataIndex: 'remarks',
    },
    {
      key: '14',
      fixed: 'right',
      title: <FormattedMessage id="formLanguage.table.action" />,
      width: '120px',
      render: (record) => {
        return (
          <>
            <Row>
              {record.id != null ? (
                <Col>
                  <Button
                    onClick={() => showModalForEdit(record)}
                    style={{ backgroundColor: 'lightblue', color: 'black' }}
                  >
                    माहिती भरा{' '}
                  </Button>
                  <br />
                  <br />
                  <Button
                    onClick={() => deleteRecord(record)}
                    style={{ backgroundColor: '	#ff6347', color: 'black' }}
                  >
                    डिलीट करा
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
                <Button
                  onClick={() => showModalForEdit(record)}
                  style={{ backgroundColor: 'lightblue', color: 'black' }}
                >
                  माहिती भरा{' '}
                </Button>
              )}
            </Row>
          </>
        );
      },
    },
  ];

  return (
    <PageContainer>
      <Card>
        {/* <Divider orientation="left" style={{ marginBottom: 30 }}>
          <FormattedMessage id="formLanguage.label.villageForm" />
        </Divider> */}

        <Row>
          <Col span={24}>
            <h2>
              <center>
                <FormattedMessage id="formLanguage.label.landRegister" />
              </center>
            </h2>
          </Col>
          {/* <Col span={3}>
            <Button
              type="primary"
              // style={{ marginTop: '25px' }}
              onClick={addForm}
            >
              <FormattedMessage id="formLanguage.button.add" />
            </Button>
          </Col> */}
        </Row>
        {/* <Row style={{ marginTop: '25px' }}> */}
        {/* <Col  lg={24} md={24}> */}
        <VillageSelector
          pageType="withoutYear"
          setCodeVillage={setCodeVillage}
          setTextForVillage={setTextForVillage}
          onVillageChange={(setVillage, setVillageForm1)}
          yearChange={setRevenueYear}
          setIsNirank={setIsNirank}
        />
        {/* </Col> */}
        {/* <Col xl={2} lg={2}>

          </Col> */}
        {/* </Row> */}
        <Row style={{ marginTop: '20px' }}>
          <Col xl={7} lg={10} md={12} sm={15} xs={18}>
            <Form.Item
              labelCol={{ xs: 10 }}
              wrapperCol={{ xl: 14, md: 20, xs: 14 }}
              label={<FormattedMessage id="formLanguage.table.surveyNo" />}
              type="number"
              name="surveyNo"
              rules={[
                // { required: true, message: 'Please Enter Survey Number!!' },
                {
                  type: 'string',
                  max: 7,
                  message: 'Survey Number shoud be upto 7 numbers',
                },
              ]}
              // style={{  marginRight: '10px'}}
            >
              <Input
                onKeyPress={KeyPressEvents.isInputNumber}
                maxLength={8}
                onChange={handleChangeForSurveyNo}
              />
            </Form.Item>
          </Col>
          <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>
          <Col xl={4} lg={4} md={2} sm={2} xs={1}>
            {!isNirank && (
              <Button
                type="primary"
                // style={{ marginLeft: '50' }}
                disabled={loadingButton}
                onClick={() => {
                  if (textForVillage) {
                    getVillageForm1Data();
                  } else if (textForVillage == null) {
                    message.info('Please Select Village');
                  }
                }}
              >
                <FormattedMessage id="formLanguage.button.search" />
              </Button>
            )}
          </Col>
        </Row>
      </Card>

      <Card border={true}>
        {!isNirank && (
          <Table
            bordered
            scroll={{ y: 350, x: 1900 }}
            loading={isLoading}
            dataSource={villageForm1}
            columns={columns}
          />
        )}
      </Card>

      <Modal
        title={<FormattedMessage id="formLanguage.form.popForDelete" />}
        visible={modalForDelete}
        okText={<FormattedMessage id="formLanguage.form.yes" />}
        okType="danger"
        onCancel={onCancelForDeleteModal}
        cancelText={<FormattedMessage id="formLanguage.form.no" />}
        onOk={deleteForm1ById}
      ></Modal>
      <Modal
        width={900}
        visible={isModalVisible}
        okText={okText}
        onCancel={handleCancelForModal}
        onOk={() => {
          editForm1();
        }}
        confirmLoading={confirmLoading}
      >
        <Card>
          <Form form={form1} layout="vertical">
            <Row>
              <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                <Form.Item
                  label={<FormattedMessage id="formLanguage.table.publicRights" />}
                  name="publicRightsOfWayAndEasements"
                  rules={[
                    {
                      required: true,
                      message: <FormattedMessage id="villageForm1.table.publicRightsOfWays" />,
                    },
                  ]}
                >
                  <Input.TextArea
                    //    onKeyPress={KeyPressEvents.isInputChar}
                    max={200}
                    disabled={inputState}
                    defaultValue={dataInModal && dataInModal.publicRightsOfWayAndEasements}
                    onChange={(e) => {
                      setDataInModal((preDataInModal) => ({
                        ...preDataInModal,
                        publicRightsOfWayAndEasements: e.target.value,
                      }));
                    }}
                  />
                </Form.Item>
              </Col>
              <Col xl={2} lg={2} md={2}></Col>
              <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                <Form.Item
                  label={<FormattedMessage id="formLanguage.table.alteration" />}
                  name="particularsOfAlteration"
                  rules={[
                    {
                      required: true,
                      message: <FormattedMessage id="villageForm1.table.particularsOfAlteration" />,
                    },
                  ]}
                >
                  <Input
                    //   onKeyPress={KeyPressEvents.isInputChar}
                    disabled={inputState}
                    defaultValue={dataInModal && dataInModal.particularsOfAlteration}
                    onChange={(e) => {
                      setDataInModal((preDataInModal) => ({
                        ...preDataInModal,
                        particularsOfAlteration: e.target.value,
                      }));
                    }}
                    max={50}
                  />
                </Form.Item>
              </Col>
            </Row>

            <h3 style={{ marginTop: 5 }}>
              <FormattedMessage id="formLanguage.form.sanctioningChanges" />
            </h3>
            <Row>
              <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                <Form.Item
                  label={<FormattedMessage id="formLanguage.table.designation" />}
                  name="designation"
                  rules={[
                    {
                      required: true,
                      message: <FormattedMessage id="villageForm1.table.ruleDesignation" />,
                    },
                  ]}
                >
                  <Select
                    disabled={inputState}
                    defaultValue={dataInModal && dataInModal.designation}
                    onChange={(e) => {
                      setDataInModal((preDataInModal) => ({
                        ...preDataInModal,
                        designation: e,
                      }));
                    }}
                  >
                    <Select.Option value={'villageForm1.table.collector'}>
                      <FormattedMessage id="villageForm1.table.collector" />
                    </Select.Option>
                    <Select.Option value={`villageForm1.table.deputyCollector`}>
                      <FormattedMessage id="villageForm1.table.deputyCollector" />
                    </Select.Option>
                    <Select.Option value={'villageForm1.table.tahsildar'}>
                      <FormattedMessage id="villageForm1.table.tahsildar" />
                    </Select.Option>
                    <Select.Option value={'villageForm1.table.nayabTahsildar'}>
                      <FormattedMessage id="villageForm1.table.nayabTahsildar" />
                    </Select.Option>
                    <Select.Option value={'villageForm1.table.circle'}>
                      <FormattedMessage id="villageForm1.table.circle" />
                    </Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xl={2} lg={2} md={2}></Col>
              <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                {dataInModal && dataInModal.orderDate === null ? (
                  <Form.Item
                    name={'orderDate'}
                    label={<FormattedMessage id="formLanguage.table.orderDate" />}
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
                    name="orderDate"
                    label={<FormattedMessage id="formLanguage.table.orderDate" />}
                  >
                    <DatePicker
                      disabled={inputState}
                      defaultValue={dataInModal && moment(dataInModal.orderDate)}
                      onChange={(e) => {
                        setDataInModal((preDataInModal) => ({
                          ...preDataInModal,
                          orderDate: moment(e).format('YYYY-MM-DD'),
                        }));
                        // console.log('periodFrom onchange', e);
                      }}
                      // onSelect={(e) => {
                      //   setPeriodFromDate(e);
                      // }}
                    />
                  </Form.Item>
                )}
              </Col>
            </Row>

            <Row>
              <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                <Form.Item
                  label={<FormattedMessage id="formLanguage.table.orderNo" />}
                  name="orderNo"
                  rules={[
                    {
                      required: true,
                      message: <FormattedMessage id="villageForm1.table.ruleOrderNo" />,
                    },
                  ]}
                >
                  <Input
                    max={50}
                    disabled={inputState}
                    defaultValue={dataInModal && dataInModal.orderNo}
                    onChange={(e) => {
                      setDataInModal((preDataInModal) => ({
                        ...preDataInModal,
                        orderNo: e.target.value,
                      }));
                    }}
                  ></Input>
                </Form.Item>
              </Col>
              <Col xl={2} lg={2} md={2}></Col>
              <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                <Form.Item
                  label={<FormattedMessage id="formLanguage.table.remark" />}
                  name="remarks"
                  rules={[{ max: 200, message: 'This field should be below 200 characters' }]}
                >
                  <Input.TextArea
                    //  onKeyPress={KeyPressEvents.isInputChar}
                    max={201}
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
  );
}

export default VillageForm1TableForm;
