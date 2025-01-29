import VillageSelector from '@/components/eComponents/VillageSelector';
import URLS from '@/URLs/urls';
import { DeleteOutlined, EditTwoTone, EyeTwoTone, SearchOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import {
  Button,
  Card,
  Col,
  Divider,
  DatePicker,
  Input,
  message,
  Modal,
  Popconfirm,
  Row,
  Select,
  Table,
  Tooltip,
  Form,
  Radio,
  Alert,
} from 'antd';
import React, { useState } from 'react';
import Axios from 'axios';
import moment from 'moment';
import { useHistory, useLocation } from 'react-router-dom';
import useAxios from '@/components/eComponents/use-axios';
import { FormattedMessage, useModel } from 'umi';
import KeyPressEvents from '@/util/KeyPressEvents';

function Table1A() {
  const { Option } = Select;
  const { districtName, servarthId, districtCode, talukaCode } = useModel('details');
  const [radiovalue, setradiovalue] = useState();
  const [codeVillage, setCodeVillage] = useState('');
  const [textForVillage, setTextForVillage] = useState();
  const [village, setVillage] = useState([]);
  const [isNirank, setIsNirank] = useState(false);

  const [form1Edata, setForm1Edata] = useState();
  const [pin, setPin] = useState();
  const [dataInModal, setDataInModal] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [inputState, setInputState] = useState();
  const [dateOfEncroachment, setDateOfEncroachment] = useState();
  const [valueForRemovedYear, setValueForRemovedYear] = useState();
  const [decisionDate, setDecisionDate] = useState();
  const [valueForRentYear, setValueForRentYear] = useState();
  const [okText, setOkText] = useState();
  const [ID, setID] = useState();
  const [villageForm1A, setVillageForm1A] = useState();
  const [purposeValue, setPurposeValue] = useState();
  const { sendRequest } = useAxios();
  const [areaInUOM, setAreaInUOM] = useState();
  const [revenueYear, setRevenueYear] = useState();
  const [modalForDelete, setModalForDelete] = useState(false);
  const [recordId, setRecordId] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [tableForm] = Form.useForm();
  const columns = [
    {
      title: <FormattedMessage id="formLanguage.form.serialNo" />,
      dataIndex: 'srNo',
      // key:'key',
      width: '100px',
    },

    {
      title: <FormattedMessage id="formLanguage.table.surveyNo" />,
      width: '100px',
      dataIndex: 'surveyNo',
    },
    {
      title: <FormattedMessage id="formLanguage.form.Area" />,
      dataIndex: 'area',
      width: '56px',
    },
    // {
    //   title: <FormattedMessage id="villageForm1A.table.landType" />,
    //   width: '100px',
    //   render: (record) => {
    //     return record.typeOfLand != '' ? <FormattedMessage id={record.typeOfLand} /> : '';
    //   },

    // },
    {
      title: <FormattedMessage id="villageForm1A.table.areaUnderForest" />,
      children: [
        {
          title: <FormattedMessage id="villageForm1A.table.noIfAny" />,
          dataIndex: 'forestNoIfAny',
          key: 'noIfAny',
          width: '100px',
        },
        {
          title: <FormattedMessage id="villageForm1A.table.villageForest2" />,
          dataIndex: 'villageForest',
          key: 'villageForest',
          width: '180px',
        },
        {
          title: <FormattedMessage id="villageForm1A.table.protectedForest" />,
          dataIndex: 'protectedForest',
          key: 'protectedForest',
          width: '100px',
        },
        {
          title: <FormattedMessage id="villageForm1A.table.reservedForest" />,
          dataIndex: 'reservedForest',
          key: 'reservedForest',
          width: '100px',
        },
      ],

      // key:'key'
    },
    {
      title: <FormattedMessage id="villageForm1A.table.forestOfficer" />,
      dataIndex: 'rightsRecordedByTheForestOfficer',
      width: '300px',
      // key:'key'
    },
    {
      title: <FormattedMessage id="formLanguage.table.remark" />,
      dataIndex: 'remarks',
      width: '100px',

      // key:'key',
    },
    {
      title: <FormattedMessage id="formLanguage.table.action" />,
      width: '70px',
      render: (record) => {
        return (
          <>
            <Row>
              <Col>
                <EditTwoTone onClick={() => showModalForEdit(record)} />

                <DeleteOutlined
                  onClick={() => deleteRecordIcon(record)}
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
  const deleteRecord = async (record) => {
    setModalForDelete(false);
    sendRequest(`${URLS.BaseURL}/form1a/discardForm1A?id=${recordId}`, 'DELETE', null, (res) => {
      if (res.status === 226) {
        setVillageForm1A([]);
        message.success('Record Deleted!');

        getVillageForm1AData();
      }
    });
  };

  const deleteRecordIcon = (record) => {
    setRecordId(record.id);
    setModalForDelete(true);
  };
  const showModalForEdit = (record) => {
    // console.log('Full Record', record);
    tableForm.resetFields();
    setDataInModal({
      id: record.id,
      typeOfLand: record.typeOfLand,
      forestNoIfAny: record.forestNoIfAny,
      villageForest: record.villageForest,
      protectedForest: record.protectedForest,
      reservedForest: record.reservedForest,
      // whetherVillageOrProtectedOrReservedForest: record.whetherVillageOrProtectedOrReservedForest,
      area: record.area,
      rightsRecordedByTheForestOfficer: record.rightsRecordedByTheForestOfficer,
      remarks: record.remarks,
      surveyNumber: record.surveyNumber,
      hissaNo: record.hissaNo,
      uom: record.uom,
    });

    setInputState(false);
    // console.log('Data in DataInModal state==>', record);
    setIsModalVisible(true);
    setOkText('Save');
    setID(record.id);
    setPin(record.surveyNumber);
  };
  const showModalForView = (record) => {
    tableForm.resetFields();
    setDataInModal({
      id: record.id,
      surveyNumber: record.surveyNumber,
      typeOfLand: record.typeOfLand,
      forestNoIfAny: record.forestNoIfAny,
      villageForest: record.villageForest,
      protectedForest: record.protectedForest,
      reservedForest: record.reservedForest,
      // whetherVillageOrProtectedOrReservedForest: record.whetherVillageOrProtectedOrReservedForest,
      area: record.area,
      rightsRecordedByTheForestOfficer: record.rightsRecordedByTheForestOfficer,
      remarks: record.remarks,
      hissaNo: record.hissaNo,
      uom: record.uom,
    });

    setInputState(true);
    // console.log('Data in DataInModal state==>', record);
    setIsModalVisible(true);
    setOkText('Okay');
  };
  const handleCancelForModal = () => {
    setIsModalVisible(false);
  };
  const onChangeRadioButton = (e) => {
    setradiovalue(e);
  };

  const onCancelForDelete = () => {
    setModalForDelete(false);
  };
  const handleChangeForPin = (e) => {
    setPin(e.target.value);
    setVillageForm1A('');
  };
  let history = useHistory();
  const pushToVillageForm = () => {
    history.push({
      pathname: `/form/village-form-1a/village-form`,
    });
  };
  const getVillageForm1AData = async () => {
    setVillageForm1A();
    setIsLoading(true);

    sendRequest(
      `${URLS.BaseURL}/form1a/getForm1AData?districtCode=${districtCode}&talukaCode=${talukaCode}&cCode=${codeVillage}`,
      'GET',
      null,
      (res) => {
        // console.log('Full res for form1AData', res.data.form1AData);
        setVillageForm1A(
          res.data.form1AData.map((row, index) => ({
            srNo: index + 1,
            area: row.area,
            hissaNo: row.hissaNo,
            id: row.id,
            surveyNo:
              row.hissaNo == null || row.hissaNo.trim() == ''
                ? row.pin
                : row.pin + '/' + row.hissaNo,
            surveyNumber: row.pin,
            cCode: row.cCode,
            typeOfLand: row.typeOfLand,
            remarks: row.remarks,
            forestNoIfAny: row.forestNoIfAny,
            protectedForest: row.protectedForest,
            reservedForest: row.reservedForest,
            villageForest: row.villageForest,
            // whetherVillageOrProtectedOrReservedForest:
            //   row.whetherVillageOrProtectedOrReservedForest,
            rightsRecordedByTheForestOfficer: row.rightsRecordedByTheForestOfficer,
            uom: row.uom,
          })),
        );
        message.success('Records Fetched!');
        setIsLoading(false);
      },
      (err) => {
        setIsLoading(false);
      },
    );
  };
  const handleChangeForArea = (value) => {
    setAreaInUOM(value);
    // console.log('value in selctor', value);
  };

  const editForm1A = async () => {
    if (okText == 'Save') {
      const parametersForEdit = {
        revenueYear: revenueYear,
        districtCode: districtCode,
        talukaCode: talukaCode,
        cCode: codeVillage,
        id: dataInModal.id,
        pin: dataInModal.surveyNumber,
        hissaNo: dataInModal.hissaNo,
        typeOfLand: dataInModal.typeOfLand,
        forestNoIfAny: dataInModal.forestNoIfAny,
        villageForest: dataInModal.villageForest,
        protectedForest: dataInModal.protectedForest,
        reservedForest: dataInModal.reservedForest,
        // whetherVillageOrProtectedOrReservedForest:
        //   dataInModal.whetherVillageOrProtectedOrReservedForest,
        area: dataInModal.area,
        rightsRecordedByTheForestOfficer: dataInModal.rightsRecordedByTheForestOfficer,
        remarks: dataInModal.remarks,
        uom: dataInModal.uom,
      };
      // console.log(parametersForEdit);
      sendRequest(`${URLS.BaseURL}/form1a/editForm1A`, 'PUT', parametersForEdit, (res) => {
        if (res.status === 200) {
          message.success('Record Saved!');
          setIsModalVisible(false);
          getVillageForm1AData();
        }
      });
    } else {
      setIsModalVisible(false);
    }
  };

  return (
    <>
      <PageContainer>
        <Card>
          <Row>
            <Col xl={8} lg={8} md={8} sm={7} xs={6}></Col>
            <Col xl={5} lg={7} md={7} sm={9} xs={11}>
              <h1 style={{ textAlign: 'center', fontSize: '25px' }}>
                <FormattedMessage id="villageForm1A.table.forestRegister" />
              </h1>
            </Col>
            <Col xl={9} lg={7} md={7} sm={6} xs={2}></Col>
            <Col xl={2} lg={2} md={2} sm={2} xs={2}>
              {!isNirank && (
                <Button type="primary" onClick={pushToVillageForm}>
                  <FormattedMessage id="formLanguage.button.add" />
                </Button>
              )}
            </Col>
          </Row>

          <Row style={{ marginLeft: '25px' }}>
            <Col xl={21}></Col>

            {/* <Col xl={3}>
              <Button type="primary" onClick={pushToVillageForm}>
                <FormattedMessage id="formLanguage.button.add" />
              </Button>
            </Col> */}
          </Row>
          <Row style={{ marginTop: '20px' }}>
            <Col xl={20} lg={24}>
              <VillageSelector
                pageType="withoutYear"
                setCodeVillage={setCodeVillage}
                setTextForVillage={setTextForVillage}
                onVillageChange={(setVillage, setVillageForm1A)}
                yearChange={setRevenueYear}
                setIsNirank={setIsNirank}
              />
            </Col>
          </Row>

          <Row style={{ marginTop: '20px' }}>
            {/* <Col xl={6} lg={13} md={20} sm={19} xs={17}>
              <Form.Item
                labelCol={{ xs: 10 }}
                wrapperCol={{ xl: 14, xs: 13 }}
                label={<FormattedMessage id="formLanguage.table.surveyNo" />}
                type="number"
                name="surveyNo"
                rules={[
                  { required: true, message: 'Please Enter Survey Number!!' },
                  {
                    type: '',
                    max: 7,
                    message: 'Survey Number shoud be upto 7 numbers',
                  },
                ]}
              >
                <Input
                  onKeyPress={KeyPressEvents.isInputNumber}
                  maxLength={8}
                  onChange={handleChangeForPin}
                />
              </Form.Item>
            </Col> */}
            <Col xl={4} lg={2} md={2} sm={2} xs={1}>
              {!isNirank && (
                <Button
                  type="primary"
                  onClick={() => {
                    if (textForVillage) {
                      getVillageForm1AData();
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
        {isNirank && (
          <>
            <Alert message="टीप" description="सदर गाव नमुना निरंक आहे." type="info" showIcon />
          </>
        )}
        <Card>
          {!isNirank && (
            <Table
              bordered
              scroll={{ x: 100 }}
              columns={columns}
              dataSource={villageForm1A}
              loading={isLoading}
            ></Table>
          )}
        </Card>
        {/* modal */}
        <Modal
          width={1000}
          title={<FormattedMessage id="villageForm1A.table.editRecords" />}
          visible={isModalVisible}
          okText={okText}
          onOk={editForm1A}
          onCancel={handleCancelForModal}
        >
          <Form form={tableForm} layout="vertical">
            <Row style={{ paddingTop: 10 }}>
              <Col span={7}>
                <Form.Item
                  name="villageForest"
                  label={<FormattedMessage id={'villageForm1A.table.villageForest'} />}
                >
                  <Input
                    onKeyPress={KeyPressEvents.isInputDecimal}
                    disabled={inputState}
                    defaultValue={dataInModal && dataInModal.villageForest}
                    onChange={(e) => {
                      setDataInModal((prevDataInModal) => ({
                        ...prevDataInModal,
                        villageForest: e.target.value,
                      }));
                    }}
                  ></Input>
                </Form.Item>
              </Col>
              <Col span={1}></Col>
              <Col span={7}>
                <Form.Item
                  name="protectedForest"
                  label={<FormattedMessage id={'villageForm1A.table.protectedForest'} />}
                >
                  <Input
                    onKeyPress={KeyPressEvents.isInputDecimal}
                    disabled={inputState}
                    defaultValue={dataInModal && dataInModal.protectedForest}
                    onChange={(e) => {
                      setDataInModal((prevDataInModal) => ({
                        ...prevDataInModal,
                        protectedForest: e.target.value,
                      }));
                    }}
                  ></Input>
                </Form.Item>
              </Col>
              <Col span={1}></Col>

              <Col span={7}>
                <Form.Item
                  name={'reservedForest'}
                  label={<FormattedMessage id={'villageForm1A.table.reservedForest'} />}
                >
                  <Input
                    onKeyPress={KeyPressEvents.isInputDecimal}
                    max={50}
                    disabled={inputState}
                    defaultValue={dataInModal && dataInModal.reservedForest}
                    onChange={(e) => {
                      setDataInModal((prevDataInModal) => ({
                        ...prevDataInModal,
                        reservedForest: e.target.value,
                      }));
                    }}
                  ></Input>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={11}>
                <Form.Item
                  name="typeOfLand"
                  label={<FormattedMessage id="villageForm1A.table.landType" />}
                >
                  <Select
                    disabled={inputState}
                    defaultValue={dataInModal && dataInModal.typeOfLand}
                    onChange={(e) => {
                      setDataInModal((prevDataInModal) => ({
                        ...prevDataInModal,
                        typeOfLand: e,
                      }));
                    }}
                  >
                    <Select.Option value="villageForm1A.table.surveyedLand">
                      {/* Surveyed */}
                      <FormattedMessage id="villageForm1A.table.surveyedLand" />
                    </Select.Option>
                    <Select.Option value="villageForm1A.table.unSurveyedLand">
                      {/* Un-Surveyed  */}
                      <FormattedMessage id="villageForm1A.table.unSurveyedLand" />
                    </Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={2}></Col>
              <Col span={11}>
                <Form.Item
                  name={'forestOfficer'}
                  label={<FormattedMessage id="villageForm1A.table.forestOfficer" />}
                >
                  <Input
                    onKeyPress={KeyPressEvents.isInputChar}
                    max={50}
                    disabled={inputState}
                    defaultValue={dataInModal && dataInModal.rightsRecordedByTheForestOfficer}
                    onChange={(e) => {
                      setDataInModal((prevDataInModal) => ({
                        ...prevDataInModal,
                        rightsRecordedByTheForestOfficer: e.target.value,
                      }));
                    }}
                  ></Input>
                </Form.Item>
              </Col>
            </Row>

            <Row style={{ paddingTop: 10 }}>
              <Col span={11}>
                <Form.Item name="Area" label={<FormattedMessage id="formLanguage.form.Area" />}>
                  <Input
                    onKeyPress={KeyPressEvents.isInputDecimal}
                    disabled={inputState}
                    addonAfter="हे.आर.चौमी"
                    defaultValue={dataInModal && dataInModal.area}
                    onChange={(e) => {
                      setDataInModal((prevDataInModal) => ({
                        ...prevDataInModal,
                        area: e.target.value,
                      }));
                    }}
                  ></Input>
                </Form.Item>
              </Col>
              <Col span={2}></Col>
              <Col span={11}>
                <Form.Item
                  name="noIfAny"
                  label={<FormattedMessage id="villageForm1A.table.noIfAny" />}
                >
                  <Input
                    onKeyPress={KeyPressEvents.isInputChar}
                    disabled={inputState}
                    defaultValue={dataInModal && dataInModal.forestNoIfAny}
                    onChange={(e) => {
                      setDataInModal((prevDataInModal) => ({
                        ...prevDataInModal,
                        forestNoIfAny: e.target.value,
                      }));
                    }}
                  ></Input>
                </Form.Item>
              </Col>
              <Col span={1}></Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item
                  name={'remark'}
                  label={<FormattedMessage id="formLanguage.table.remark" />}
                >
                  <Input.TextArea
                    max={200}
                    onKeyPress={KeyPressEvents.isInputChar}
                    disabled={inputState}
                    defaultValue={dataInModal && dataInModal.remarks}
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
        </Modal>
        <Modal
          title={<FormattedMessage id="formLanguage.form.popForDelete" />}
          visible={modalForDelete}
          okText={<FormattedMessage id="formLanguage.form.yes" />}
          okType="danger"
          cancelText={<FormattedMessage id="formLanguage.form.no" />}
          onCancel={onCancelForDelete}
          onOk={deleteRecord}
        ></Modal>
      </PageContainer>
    </>
  );
}

export default Table1A;
