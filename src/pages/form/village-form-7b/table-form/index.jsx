import VillageSelector from '@/components/eComponents/VillageSelector';
import { PageContainer } from '@ant-design/pro-layout';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  message,
  Row,
  Select,
  Space,
  Table,
  Modal,
  Alert,
} from 'antd';
import React, { useState } from 'react';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import URLS from '@/URLs/urls';
import useAxios from '@/components/eComponents/use-axios';
import { FormattedMessage } from 'umi';
import ESelector from '@/components/eComponents/ESelector';
import { useModel } from 'umi';
import { DeleteOutlined, EditTwoTone, EyeTwoTone } from '@ant-design/icons';
import KeyPressEvents from '@/util/KeyPressEvents';

function Form7B() {
  const { districtName, servarthId, districtCode, talukaCode } = useModel('details');
  const { sendRequest } = useAxios();
  const [codeVillage, setCodeVillage] = useState('');
  const [textForVillage, setTextForVillage] = useState();
  const [village, setVillage] = useState([]);
  const [isNirank, setIsNirank] = useState(false);
  const [revenueYear, setRevenueYear] = useState();
  let history = useHistory();
  const [VillageForm7BData, setVillageForm7BData] = useState([]);
  const [dataInModal, setDataInModal] = useState();
  const [form] = Form.useForm();
  const [inputState, setInputState] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [okText, setOkText] = useState();
  const [ID, setID] = useState();
  const [pin, setPin] = useState();
  const [recordId, setRecordId] = useState();
  const [modalForDelete, setModalForDelete] = useState(false);
  const [possessionDate, setpossessionDate] = useState();
  const [orderDate, setorderDate] = useState();
  const [saveButtonState, setSaveButtonState] = useState(false);
  const [surveyNumberValue, setSurveyNumberValue] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleChangeForSurveyNoT = (event) => {
    setSurveyNumberValue(event.target.value);
    setVillageForm7BData();
  };

  const addForm = () => {
    history.push({
      pathname: `/form/village-form-7b/village-form`,
      state: {
        pageMode: 'Add',
      },
    });
  };

  const getForm7BData = async () => {
    setIsLoading(true);

    sendRequest(
      `${URLS.BaseURL}/form7b/getForm7BData?districtCode=${districtCode}&talukaCode=${talukaCode}&cCode=${codeVillage}&pin=${surveyNumberValue}`,
      'GET',
      null,
      (res) => {
        // console.log('Full res for form1AData', res.data.form7BData);
        setVillageForm7BData(
          res.data.form7BData.map((row, index) => ({
            srNo: index + 1,
            id: row.id,
            pin: row.pin,
            hissaNo: row.hissaNo,
            surveyNumber:
              row.hissaNo == null || row.hissaNo.trim() == ''
                ? row.pin
                : row.pin + '/' + row.hissaNo,
            khataNo: row.khataNo,
            year: moment(row.year, 'YYYY-MM-DD').format('YYYY'),
            fullName:
              row.fnamePersonInPossession +
              ' ' +
              row.mnamePersonInPossession +
              ' ' +
              row.lnamePersonInPossession,
            fnamePersonInPossession: row.fnamePersonInPossession,
            mnamePersonInPossession: row.mnamePersonInPossession,
            lnamePersonInPossession: row.lnamePersonInPossession,
            designation: row.designation,
            orderDate: moment(row.orderDate, 'YYYY-MM-DD').format('YYYY-MM-DD'),
            orderNo: row.orderNo,
            possessionDate: moment(row.possessionDate, 'YYYY-MM-DD').format('YYYY-MM-DD'),
            remarks: row.remarks,
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
  const handleCancelForModal = () => {
    setIsModalVisible(false);
  };

  const deleteRecord = (record) => {
    setRecordId(record.id);
    setModalForDelete(true);
  };
  const onCancelForDelete = () => {
    setModalForDelete(false);
  };
  const deleteForm7BData = async (record) => {
    setModalForDelete(false);
    // 203.129.224.92:5432/eChawdiV1/api/form7b/discardForm7B
    sendRequest(`${URLS.BaseURL}/form7b/discardForm7B?id=${recordId}`, 'DELETE', null, (res) => {
      if (res.status == 226) {
        message.success('Record Deleted !');
        setVillageForm7BData([]);

        getForm7BData();
      }
    });
  };

  const columns = [
    {
      key: '1',
      // title: 'Sr No.',
      title: <FormattedMessage id="formLanguage.form.serialNo" />,

      dataIndex: 'srNo',
    },
    {
      key: '2',
      // title: 'Survey Number',
      title: <FormattedMessage id="formLanguage.table.surveyNo" />,

      dataIndex: 'surveyNumber',
    },
    {
      key: '3',
      // title: 'Khata Number',
      title: <FormattedMessage id="villageForm.form.khataNo" />,
      dataIndex: 'khataNo',
    },
    {
      key: '4',
      // title: 'Year',
      title: <FormattedMessage id="villageForm.form.year" />,
      dataIndex: 'year',
    },
    {
      key: '5',

      title: <FormattedMessage id="villageForm.form.nameOfThePersonInPsn" />,

      //title: 'Name of the person in possession of the land other than the person recorded in the record of rights',
      dataIndex: 'fullName',
    },

    {
      key: '6',
      // title: 'Remarks(DesignationOrder Date,Order no)',
      title: <FormattedMessage id="villageForm.form.designation" />,

      dataIndex: 'designation',
    },
    {
      key: '7',
      // title: 'Remarks(DesignationOrder Date,Order no)',
      title: <FormattedMessage id="villageForm.form.datecolom" />,

      dataIndex: 'possessionDate',
    },

    {
      key: '8',
      // title: 'Remarks(DesignationOrder Date,Order no)',
      title: <FormattedMessage id="villageForm.form.orderDate" />,

      dataIndex: 'orderDate',
    },

    {
      key: '9',
      // title: 'Remarks(DesignationOrder Date,Order no)',
      title: <FormattedMessage id="villageForm.form.orderNo" />,

      dataIndex: 'orderNo',
    },

    {
      key: '10',
      // title: 'Remarks(DesignationOrder Date,Order no)',
      title: <FormattedMessage id="villageForm.form.rmk" />,

      dataIndex: 'remarks',
    },

    {
      key: '11',
      title: <FormattedMessage id="formLanguage.table.action" />,
      // fixed: "right",
      render: (record) => {
        return (
          <>
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
          </>
        );
      },
    },
  ];

  const showModalForEdit = (record) => {
    form.resetFields();
    setDataInModal({});
    setDataInModal({
      pin: record.pin,
      hissaNo: record.hissaNo,
      id: record.id,
      cCode: codeVillage,
      khataNo: record.khataNo,
      year: record.year,
      fnamePersonInPossession: record.fnamePersonInPossession,
      mnamePersonInPossession: record.mnamePersonInPossession,
      lnamePersonInPossession: record.lnamePersonInPossession,
      designation: record.designation,
      possessionDate: record.possessionDate,
      orderDate: record.orderDate,
      orderNo: record.orderNo,
      remarks: record.remarks,
    });
    setInputState(false);
    setIsModalVisible(true);
    setOkText(<FormattedMessage id="formLanguage.button.save" />);
    setID(record.id);
    setPin(record.pin);
    setSaveButtonState(true);
  };

  const showModalForView = (record) => {
    form.resetFields();
    setDataInModal({});
    setDataInModal({
      id: record.id,
      pin: record.pin,
      hissaNo: record.hissaNo,
      cCode: codeVillage,
      hissaNo: record.hissaNo,
      surveyNo: record.surveyNo,
      khataNo: record.khataNo,
      year: record.year,
      fnamePersonInPossession: record.fnamePersonInPossession,
      mnamePersonInPossession: record.mnamePersonInPossession,
      lnamePersonInPossession: record.lnamePersonInPossession,
      designation: record.designation,
      possessionDate: record.possessionDate,
      orderDate: record.orderDate,
      orderNo: record.orderNo,
      remarks: record.remarks,
    });
    setInputState(true);
    setIsModalVisible(true);
    setOkText(<FormattedMessage id="challanDetails.button.saveokay" />);
    setSaveButtonState(false);
  };

  const editForm7B = async () => {
    setConfirmLoading(true);
    // console.log(' possessionDate state', possessionDate);

    const parametersForEdit = {
      id: ID,
      pin: dataInModal.pin,
      districtCode: districtCode,
      talukaCode: talukaCode,
      cCode: codeVillage,
      hissaNo: dataInModal.hissaNo,
      surveyNo: dataInModal.surveyNo,
      khataNo: dataInModal.khataNo,
      year: moment(dataInModal.year).format('YYYY'),
      fnamePersonInPossession: dataInModal.fnamePersonInPossession,
      mnamePersonInPossession: dataInModal.mnamePersonInPossession,
      lnamePersonInPossession: dataInModal.lnamePersonInPossession,
      designation: dataInModal.designation,
      possessionDate: moment(dataInModal.possessionDate).format('YYYY-MM-DD'),
      orderDate: moment(dataInModal.orderDate).format('YYYY-MM-DD'),

      // possessionDate: dataInModal.possessionDate,
      // orderDate:dataInModal.orderDate,
      orderNo: dataInModal.orderNo,
      remarks: dataInModal.remarks,
    };
    if (saveButtonState == true) {
      sendRequest(
        `${URLS.BaseURL}/form7b/editForm7B`,
        'PUT',
        parametersForEdit,
        (res) => {
          if (res.status === 200) {
            message.success('Data Updated!');
            getForm7BData();
            setConfirmLoading(false);
            setIsModalVisible(false);
          }
        },
        (err) => {
          setIsModalVisible(false);
          setConfirmLoading(false);
        },
      );
      setVillageForm7BData('');
    } else if (saveButtonState == false) {
      setIsModalVisible(false);
      setConfirmLoading(false);
    }
  };

  return (
    <>
      <PageContainer>
        <Card>
          <Row>
            <Col xl={22} lg={22} md={22} sm={24} xs={24}></Col>
            <Col xl={2} lg={2} md={2} sm={2} xs={2}>
              {!isNirank && (
                <Button type="primary" onClick={addForm}>
                  <FormattedMessage id="formLanguage.button.add" />
                </Button>
              )}
            </Col>
          </Row>
          <Row style={{ marginTop: '10px' }}>
            <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>
            <Col xl={22} lg={22} md={22} sm={24} xs={24}>
              <h2>
                <center>{<FormattedMessage id="villageForm.form.registerReport" />} </center>
              </h2>
            </Col>
          </Row>

          <>
            <Col xl={24}>
              <VillageSelector
                pageType="withoutYear"
                setCodeVillage={setCodeVillage}
                setTextForVillage={setTextForVillage}
                onVillageChange={(setVillage, setVillageForm7BData)}
                yearChange={setRevenueYear}
                setIsNirank={setIsNirank}
              />
            </Col>

            <Row style={{ marginTop: 10 }}>
              <Col>
                <Form.Item
                  labelCol={{
                    xl: 10,
                  }}
                  wrapperCol={{
                    xl: 14,
                  }}
                  label={<FormattedMessage id="formLanguage.table.surveyNo" />}
                  name="survey_number"
                  rules={[
                    { required: true, message: 'Survey Number is necessary!' },
                    { type: 'string', max: 7 },
                  ]}
                >
                  <Input
                    onKeyPress={KeyPressEvents.isInputNumber}
                    maxLength={8}
                    onChange={handleChangeForSurveyNoT}
                  />
                </Form.Item>
              </Col>
              <Col span={1}></Col>
              <Col span={2}>
                {!isNirank && (
                  <Button
                    type="primary"
                    onClick={() => {
                      if (textForVillage && surveyNumberValue) {
                        getForm7BData();
                      } else if (textForVillage == null) {
                        message.info('Please Select Village');
                      } else if (surveyNumberValue == null) {
                        message.info('Please Enter Survey Number');
                      }
                    }}
                  >
                    <FormattedMessage id="formLanguage.button.search" />
                  </Button>
                )}
              </Col>
            </Row>
          </>
        </Card>
        {isNirank && (
          <Card>
            <Alert message="टीप" description="सदर गाव नमुना निरंक आहे." type="info" showIcon />
          </Card>
        )}
        {/* 2ndCard */}
        <Card>
          <Col span={24}>
            {!isNirank && (
              <Table
                bordered
                scroll={{ x: 1000 }}
                columns={columns}
                dataSource={VillageForm7BData}
                loading={isLoading}
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
          onOk={deleteForm7BData}
          // cancelButtonProps={
          //   [
          //     cancelText
          //   ]
          // }
        ></Modal>

        <Modal
          width={1000}
          title={<FormattedMessage id="villageForm1E.table.viewEdit" />}
          visible={isModalVisible}
          okText={okText}
          onCancel={handleCancelForModal}
          onOk={editForm7B}
          confirmLoading={confirmLoading}
        >
          <Card>
            <Form layout="vertical" form={form}>
              <Row>
                <Col span={7}>
                  <Form.Item
                    label={<FormattedMessage id="villageForm.form.fname" />}
                    name=" fnamePersonInPossession"
                    rules={[
                      {
                        required: true,
                        message: 'Please Enter First Name of Person',
                      },
                      { max: 25, message: 'This field shoud be up to 25 characters' },
                    ]}
                  >
                    <Input
                      disabled={inputState}
                      defaultValue={dataInModal && dataInModal.fnamePersonInPossession}
                      onChange={(e) => {
                        setDataInModal((preDataInModal) => ({
                          ...preDataInModal,
                          fnamePersonInPossession: e.target.value,
                        }));
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col span={1}></Col>
                <Col span={7}>
                  <Form.Item
                    label={<FormattedMessage id="villageForm.form.mname" />}
                    name=" mnamePersonInPossession"
                    rules={[
                      {
                        required: true,
                        message: 'Please Enter Middle Name of Person',
                      },
                      { max: 25, message: 'This field shoud be up to 25 characters' },
                    ]}
                  >
                    <Input
                      onKeyPress={KeyPressEvents.isInputVarchar}
                      maxLength={26}
                      disabled={inputState}
                      defaultValue={dataInModal && dataInModal.mnamePersonInPossession}
                      onChange={(e) => {
                        setDataInModal((preDataInModal) => ({
                          ...preDataInModal,
                          mnamePersonInPossession: e.target.value,
                        }));
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col span={1}></Col>
                <Col span={7}>
                  <Form.Item
                    label={<FormattedMessage id="villageForm.form.lname" />}
                    name="lnamePersonInPossession"
                    rules={[
                      {
                        required: true,
                        message: 'Please Enter Last Name of Person',
                      },
                      { max: 25, message: 'This field shoud be up to 25 characters' },
                    ]}
                  >
                    <Input
                      onKeyPress={KeyPressEvents.isInputVarchar}
                      maxLength={26}
                      disabled={inputState}
                      defaultValue={dataInModal && dataInModal.lnamePersonInPossession}
                      onChange={(e) => {
                        setDataInModal((preDataInModal) => ({
                          ...preDataInModal,
                          lnamePersonInPossession: e.target.value,
                        }));
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row>
                <Col span={11}>
                  <Form.Item
                    label={<FormattedMessage id="villageForm.form.designation" />}
                    name="designation"
                    rules={[
                      {
                        required: true,
                        message: 'Please Enter Designation',
                      },
                      { max: 20, message: 'This field shoud be up to 20 characters' },
                    ]}
                  >
                    <Input.TextArea
                      onKeyPress={KeyPressEvents.isInputVarchar}
                      maxLength={21}
                      disabled={inputState}
                      defaultValue={dataInModal && dataInModal.designation}
                      onChange={(e) => {
                        setDataInModal((preDataInModal) => ({
                          ...preDataInModal,
                          designation: e.target.value,
                        }));
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col span={2}></Col>

                <Col span={11}>
                  <Form.Item
                    label={<FormattedMessage id="villageForm.form.datecolom" />}
                    name="possessionDate"
                    rules={[{ required: true, message: 'Field is necessary!' }]}
                  >
                    <DatePicker
                      style={{ width: '100%', marginTop: 10 }}
                      disabled={inputState}
                      defaultValue={dataInModal && moment(dataInModal.possessionDate)}
                      onChange={(e) => {
                        setDataInModal((prevDataInModal) => ({
                          ...prevDataInModal,
                          possessionDate: moment(e).format('YYYY-MM-DD'),
                        }));
                        setpossessionDate(moment(e).format('YYYY-MM-DD'));
                      }}
                    ></DatePicker>
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={11}>
                  <Form.Item
                    label={<FormattedMessage id="villageForm.form.orderDate" />}
                    name="orderDate"
                    rules={[{ required: true, message: 'Field is necessary!' }]}
                  >
                    <DatePicker
                      disabled={inputState}
                      defaultValue={dataInModal && moment(dataInModal.orderDate)}
                      onChange={(e) => {
                        setDataInModal((prevDataInModal) => ({
                          ...prevDataInModal,
                          orderDate: moment(e).format('YYYY-MM-DD'),
                        }));
                        setorderDate(moment(e).format('YYYY-MM-DD'));
                      }}
                      style={{ width: '100%', marginTop: 10 }}
                    ></DatePicker>
                  </Form.Item>
                </Col>

                <Col span={2}></Col>
                <Col span={11}>
                  <Form.Item
                    label={<FormattedMessage id="villageForm.form.orderNo" />}
                    name="orderNo"
                    rules={[
                      {
                        required: true,
                        message: 'Please Enter Order Number',
                      },
                      { max: 100, message: 'This field shoud be up to 100 characters' },
                    ]}
                  >
                    <Input
                      onKeyPress={KeyPressEvents.isInputVarchar}
                      maxLength={21}
                      disabled={inputState}
                      defaultValue={dataInModal && dataInModal.orderNo}
                      onChange={(e) => {
                        setDataInModal((preDataInModal) => ({
                          ...preDataInModal,
                          orderNo: e.target.value,
                        }));
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={11}>
                  <Form.Item
                    label={<FormattedMessage id="villageForm.form.year" />}
                    name="year"
                    rules={[{ required: true, message: 'Field is necessary!' }]}
                  >
                    <DatePicker
                      disabled={inputState}
                      defaultValue={dataInModal && moment(dataInModal.year, 'YYYY')}
                      onChange={(e) => {
                        setDataInModal((prevDataInModal) => ({
                          ...prevDataInModal,
                          year: moment(e).format('YYYY'),
                        }));
                      }}
                      picker="year"
                    />
                  </Form.Item>
                </Col>

                <Col span={11}>
                  <Form.Item
                    label={<FormattedMessage id="formLanguage.table.remark" />}
                    name="remarks"
                    rules={[
                      {
                        required: true,
                        message: 'Please Enter Remarks',
                      },
                      { max: 200, message: 'This field shoud be up to 200 characters' },
                    ]}
                  >
                    <Input.TextArea
                      onKeyPress={KeyPressEvents.isInputChar}
                      maxLength={201}
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

export default Form7B;
