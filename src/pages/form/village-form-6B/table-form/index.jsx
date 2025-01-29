import { PageContainer } from '@ant-design/pro-layout';
import {
  Button,
  Card,
  Col,
  Input,
  message,
  Modal,
  Row,
  Select,
  Table,
  Tooltip,
  Form,
  DatePicker,
  Divider,
  Alert,
} from 'antd';
import React from 'react';
import { useState } from 'react';
import VillageSelector from '@/components/eComponents/VillageSelector';
import { DeleteOutlined, EditTwoTone, EyeTwoTone, SearchOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import useAxios from '@/components/eComponents/use-axios';
import URLS from '@/URLs/urls';
import { FormattedMessage, useModel } from 'umi';
import moment from 'moment';
import KeyPressEvents from '@/util/KeyPressEvents';

function Table1B() {
  const { districtName, servarthId, districtCode, talukaCode } = useModel('details');
  const [villageForm6B, setVillageForm6B] = useState([]);
  const { sendRequest } = useAxios();
  const [codeVillage, setCodeVillage] = useState('');
  const [textForVillage, setTextForVillage] = useState();
  const [village, setVillage] = useState([]);
  const [form6Bdata, setForm6Bdata] = useState();
  const [pin, setPin] = useState();
  const [entryVillageForm6, setentryVillageForm6] = useState();
  const [dataInModal, setDataInModal] = useState();
  const [modalForDelete, setModalForDelete] = useState(false);
  const [recordId, setRecordId] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [inputState, setInputState] = useState();
  const [okText, setOkText] = useState();
  const [ID, setID] = useState();
  const [form6B] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [hissaNo, setHissaNo] = useState();
  const [revenueYear, setRevenueYear] = useState();
  const [isNirank, setIsNirank] = useState(false);

  const [receiptDate, setReceiptDate] = useState();
  const [dateOfDeath, setDateOfDeath] = useState();
  const [surveyNumberValue, setSurveyNumberValue] = useState();
  const [tableForm] = Form.useForm();

  const [saveButtonState, setSaveButtonState] = useState(false);

  const deleteRecordById = (record) => {
    setRecordId(record.id);
    setModalForDelete(true);
  };

  const handleChangeForEntryVillageForm6 = (e) => {
    setentryVillageForm6(e.target.value);
    setVillageForm6B('');
  };

  const getVillageForm6BData = async () => {
    setIsLoading(true);
    sendRequest(
      // localhost:8089/echawdi/api/form6B/getForm6BEferfarDetails
      // form6B/getForm6BData
      `${URLS.BaseURL}/form6B/getForm6BData?districtCode=${districtCode}&talukaCode=${talukaCode}&cCode=${codeVillage}&entryVillageForm6=${entryVillageForm6}`,
      'GET',
      null,
      (res) => {
        // console.log('Full res for form6BData', res.data.form6BData);
        setVillageForm6B(
          res.data.form6BData.map((row, index) => ({
            srNo: index + 1,
            id: row.id,
            surveyNo: row.pin,
            cCode: row.cCode,
            entryVillageForm6: row.entryVillageForm6,
            nameOfAcquirerOfRight: row.nameOfAcquirerOfRight,
            orderOfTahsildarAsFine: row.orderOfTahsildarAsFine,
            receiptNo: row.receiptNo,
            receiptDate: row.receiptDate,
            dateOfDeath:
              row.dateOfDeath != null
                ? moment(row.dateOfDeath, 'YYYY-MM-DD').format('YYYY-MM-DD')
                : '',
            reasonOfDeath: row.reasonOfDeath == null ? '' : row.reasonOfDeath,
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

  const showModalForEdit = (record) => {
    // console.log('Full Record', record);
    form6B.resetFields();
    setDataInModal({
      id: record.id,
      surveyNo: record.surveyNo,
      cCode: record.cCode,
      entryInVillageForm6: record.entryInVillageForm6,
      nameOfAcquirerOfRight: record.nameOfAcquirerOfRight,
      orderOfTahsildarAsFine: record.orderOfTahsildarAsFine,
      receiptNo: record.receiptNo,
      receiptDate: record.receiptDate,
      dateOfDeath: record.dateOfDeath,
      reasonOfDeath: record.reasonOfDeath,
    });

    setInputState(false);
    // console.log('Data in DataInModal state==>', record);
    setIsModalVisible(true);
    setOkText('Save');
    setID(record.id);
    setPin(record.surveyNo);
    setSaveButtonState(true);
  };

  const editForm6B = async () => {
    setConfirmLoading(true);
    if (okText == 'Save') {
      const parametersForEdit = {
        revenueYear: revenueYear,
        districtCode: districtCode,
        talukaCode: talukaCode,
        cCode: codeVillage,
        entryVillageForm6: entryVillageForm6,
        nameOfAcquirerOfRight: dataInModal.nameOfAcquirerOfRight,
        dateOfDeath: form6B.getFieldValue('dateOfDeath')
          ? moment(form6B.getFieldValue('dateOfDeath'), 'DD/MM/YYYY').format('YYYY-MM-DD')
          : null,
        reasonOfDeath: dataInModal.reasonOfDeath,
        id: dataInModal.id,
        pin: dataInModal.surveyNo,
        hissaNo: 'null',
        orderOfTahsildarAsFine: dataInModal.orderOfTahsildarAsFine,
        receiptNo: dataInModal.receiptNo,
        receiptDate: moment(dataInModal.receiptDate).format('YYYY-MM-DD'),
        reasonOfDeath: dataInModal.reasonOfDeath,
      };
      // console.log(parametersForEdit);
      if (saveButtonState == true) {
        sendRequest(
          `${URLS.BaseURL}/form6B/editForm6B`,
          'PUT',
          parametersForEdit,
          (res) => {
            if (res.status === 200) {
              message.success('Record Saved!');

              getVillageForm6BData();
              setConfirmLoading(false);
              setIsModalVisible(false);
            }
          },
          (err) => {
            setIsModalVisible(false);
            setConfirmLoading(false);
          },
        );
      }
    } else if (saveButtonState == false) {
      setIsModalVisible(false);
      setConfirmLoading(false);
    }
  };

  const handleCancelForModal = () => {
    setIsModalVisible(false);
  };

  const onCancelForDelete = () => {
    setModalForDelete(false);
  };
  const deleteForm6BData = async (record) => {
    setModalForDelete(false);
    // 203.129.224.92:5432/eChawdiV1/api/form7b/discardForm7B
    sendRequest(`${URLS.BaseURL}/form6B/discardForm6B?id=${recordId}`, 'DELETE', null, (res) => {
      if (res.status == 226) {
        message.success('Record Deleted !');
        setVillageForm6B([]);

        getVillageForm6BData();
      }
    });
  };

  const showModalForView = (record) => {
    form6B.resetFields();
    setDataInModal({});
    setDataInModal({
      id: record.id,
      pin: record.pin,
      hissaNo: record.hissaNo,
      cCode: codeVillage,
      surveyNo: record.surveyNo,
      orderOfTahsildarAsFine: record.orderOfTahsildarAsFine,
      receiptNo: record.receiptNo,
      entryVillageForm6: record.entryVillageForm6,
      nameOfAcquirerOfRight: record.nameOfAcquirerOfRight,
      receiptDate: record.receiptDate,
      dateOfDeath: record.dateOfDeath,

      reasonOfDeath: record.reasonOfDeath,
    });
    setInputState(true);
    setIsModalVisible(true);
    setOkText(<FormattedMessage id="challanDetails.button.saveokay" />);
    setSaveButtonState(false);
  };

  const columns = [
    {
      key: '1',
      title: <FormattedMessage id="formLanguage.form.serialNo" />,
      dataIndex: 'srNo',
    },
    {
      key: '2',
      title: <FormattedMessage id="formLanguage.form.entryInVillageForm6" />,
      dataIndex: 'entryVillageForm6',
    },
    {
      key: '3',
      title: <FormattedMessage id="formLanguage.form.nameOfAcquirerOfRight" />,
      dataIndex: 'nameOfAcquirerOfRight',
    },
    {
      key: '4',
      title: <FormattedMessage id="formLanguage.form.orderOfTahashil" />,
      dataIndex: 'orderOfTahsildarAsFine',
    },

    {
      key: '5',
      title: <FormattedMessage id="formLanguage.form.receiptNo" />,
      dataIndex: 'receiptNo',
    },
    {
      key: '6',
      title: <FormattedMessage id="formLanguage.form.receiptDate" />,
      dataIndex: 'receiptDate',
    },
    {
      key: '7',
      title: <FormattedMessage id="formLanguage.form.dateOfDeath" />,
      dataIndex: 'dateOfDeath',
    },
    {
      key: '8',
      title: <FormattedMessage id="formLanguage.table.reasonOfDeath" />,
      dataIndex: 'reasonOfDeath',
    },
    {
      key: '9',
      title: <FormattedMessage id="formLanguage.table.action" />,
      width: '56px',
      render: (record) => {
        return (
          <>
            <Row>
              <Col>
                <EditTwoTone onClick={() => showModalForEdit(record)} />
                <DeleteOutlined
                  onClick={() => deleteRecordById(record)}
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

  let history = useHistory();

  const pushToVillageForm = () => {
    history.push({
      pathname: `/form/village-form-6B/village-form`,
    });
  };

  function cancel(e) {
    // console.log(e);
    message.error('Request Cancelled !!!');
  }

  return (
    <>
      <PageContainer>
        <Card>
          {/* <h2>
                <FormattedMessage id="formLanguage.label.villageForm6B" />
              </h2> */}
          <Row>
            <Col xl={22} lg={22} md={22} sm={24} xs={24}></Col>
            <Col xl={2} lg={2} md={2} sm={2} xs={2}>
              {!isNirank && (
                <Button type="primary" onClick={pushToVillageForm}>
                  <FormattedMessage id="formLanguage.button.add" />
                </Button>
              )}
            </Col>
          </Row>

          <Row>
            <Col xl={4} lg={4} md={4} sm={4} xs={4}></Col>
            <Col xl={20} lg={20} md={20} sm={24} xs={24}>
              <h2>
                <FormattedMessage id="formLanguage.label.villageForm6BB" />
              </h2>
            </Col>
          </Row>
          <Col span={24}>
            <VillageSelector
              pageType="withoutYear"
              setCodeVillage={setCodeVillage}
              setTextForVillage={setTextForVillage}
              onVillageChange={(setVillage, setVillageForm6B)}
              yearChange={setRevenueYear}
              setIsNirank={setIsNirank}
            />
          </Col>
          <Row style={{ marginTop: '20px' }}>
            <Col xl={9} lg={12} md={20} sm={19} xs={24}>
              <Col>
                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: (
                        <FormattedMessage id="villageForm6B.table.ruleEntryInVillageForm6" />
                      ),
                    },
                    { max: 50, message: 'This field shoud be below 50 characters' },
                  ]}
                  label={<FormattedMessage id="formLanguage.form.entryInVillageForm6" />}
                  name="entryVillageForm6"
                >
                  <Input
                    onKeyPress={KeyPressEvents.isInputNumber}
                    maxLength={51}
                    onChange={handleChangeForEntryVillageForm6}
                  ></Input>
                </Form.Item>
              </Col>
            </Col>
            <Col lg={1} sm={1}></Col>
            <Col xl={1} lg={1} md={2} sm={1} xs={1}>
              {!isNirank && (
                <Button
                  onClick={() => {
                    if (textForVillage && entryVillageForm6) {
                      getVillageForm6BData();
                    } else if (textForVillage == null) {
                      message.info('Please Select Village');
                    } else if (entryVillageForm6 == null) {
                      message.info('Please Enter Entry Village Form 6');
                    }
                  }}
                  type="primary"
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
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            {!isNirank && (
              <Table
                bordered
                scroll={{ x: 100 }}
                dataSource={villageForm6B}
                columns={columns}
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
          onOk={deleteForm6BData}
        ></Modal>

        <Modal
          width={1000}
          title={<FormattedMessage id="villageForm1A.table.editRecords" />}
          visible={isModalVisible}
          okText={okText}
          onOk={editForm6B}
          onCancel={handleCancelForModal}
          confirmLoading={confirmLoading}
        >
          <Form form={form6B} layout="vertical">
            <Row>
              <Col span={11}>
                <Form.Item
                  name="orderOfTahsildarAsFine"
                  label={<FormattedMessage id="formLanguage.form.orderOfTahashil" />}
                >
                  <Input
                    max={200}
                    onKeyPress={KeyPressEvents.isInputVarchar}
                    disabled={inputState}
                    defaultValue={dataInModal && dataInModal.orderOfTahsildarAsFine}
                    onChange={(e) => {
                      setDataInModal((prevDataInModal) => ({
                        ...prevDataInModal,
                        orderOfTahsildarAsFine: e.target.value,
                      }));
                    }}
                  ></Input>
                </Form.Item>
              </Col>
              <Col span={2}></Col>
              <Col span={11}>
                <Form.Item
                  name="reasonOfDeath"
                  label={<FormattedMessage id="formLanguage.table.reasonOfDeath" />}
                >
                  <Input
                    onKeyPress={KeyPressEvents.isInputVarchar}
                    disabled={inputState}
                    defaultValue={dataInModal && dataInModal.reasonOfDeath}
                    onChange={(e) => {
                      setDataInModal((prevDataInModal) => ({
                        ...prevDataInModal,
                        reasonOfDeath: e.target.value,
                      }));
                    }}
                  ></Input>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={11}>
                {dataInModal && dataInModal.dateOfDeath === '' ? (
                  <Form.Item
                    name="dateOfDeath"
                    label={<FormattedMessage id="formLanguage.form.dateOfDeath" />}
                  >
                    <DatePicker
                      style={{ width: '100%', marginTop: 10 }}
                      disabled={inputState}
                    ></DatePicker>
                  </Form.Item>
                ) : (
                  <Form.Item
                    name="dateOfDeath"
                    label={<FormattedMessage id="formLanguage.form.dateOfDeath" />}
                  >
                    <DatePicker
                      style={{ width: '100%', marginTop: 10 }}
                      disabled={inputState}
                      defaultValue={dataInModal && moment(dataInModal.dateOfDeath)}
                      onChange={(e) => {
                        setDataInModal((preDataInModal) => ({
                          ...preDataInModal,
                          dateOfDeath: moment(e).format('YYYY-MM-DD'),
                        }));
                      }}
                      // style={{ marginLeft: 3 }}
                    ></DatePicker>
                  </Form.Item>
                )}
              </Col>
              <Col span={2}></Col>
              <Col span={11}>
                <Form.Item
                  name="receiptNo"
                  label={<FormattedMessage id="formLanguage.form.receiptNo" />}
                >
                  <Input
                    onKeyPress={KeyPressEvents.isInputVarchar}
                    disabled={true}
                    defaultValue={dataInModal && dataInModal.receiptNo}
                    // onChange={(e) => {
                    //   setDataInModal((prevDataInModal) => ({
                    //     ...prevDataInModal,
                    //     receiptNo: e.target.value,
                    //   }));
                    // }}
                  ></Input>
                </Form.Item>
              </Col>
            </Row>
            <Row style={{ paddingTop: 10 }}>
              <Col span={11}>
                <Form.Item
                  name="receiptDate"
                  label={<FormattedMessage id="formLanguage.form.receiptDate" />}
                >
                  <DatePicker
                    style={{ width: '100%', marginTop: 10 }}
                    disabled={true}
                    defaultValue={dataInModal && moment(dataInModal.receiptDate)}
                    // onChange={(e) => {
                    //   setDataInModal((preDataInModal) => ({
                    //     ...preDataInModal,
                    //     receiptDate: moment(e).format('YYYY-MM-DD'),
                    //   }));
                    // }}
                  ></DatePicker>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      </PageContainer>
    </>
  );
}
export default Table1B;
