import useAxios from '@/components/eComponents/use-axios';
import VillageSelector from '@/components/eComponents/VillageSelector';
import URLS from '@/URLs/urls';
import { DeleteOutlined, EditTwoTone, EyeTwoTone } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import moment from 'moment';
import {
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Table,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import { FormattedMessage, useModel } from 'umi';
import KeyPressEvents from '@/util/KeyPressEvents';

function TableForm19() {
  const { sendRequest } = useAxios();
  const { districtName, talukaName, servarthId, districtCode, talukaCode, villageData } =
    useModel('details');
  const [codeVillage, setCodeVillage] = useState('');
  const [textForVillage, setTextForVillage] = useState();
  const [village, setVillage] = useState([]);
  const [revenueYear, setRevenueYear] = useState();
  const [villageForm19Data, setVillageForm19Data] = useState();
  const [recordId, setRecordId] = useState();
  const [modalForDelete, setModalForDelete] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [inputState, setInputState] = useState();
  const [dataInModal, setDataInModal] = useState();
  const [okText, setOkText] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [creditAtTreasury, setCreditAtTreasury] = useState();
  const [purchaseDate, setPurchaseDate] = useState();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [sajjaBox, setSajjaBox] = useState(false);
  const [villageSaja, setVillageSaja] = useState([]);
  const [villageSajjaCode, setVillageSajjaCode] = useState();
  const [villageSajjaName, setVillageSajjaName] = useState();
  const [sajjaCode, setSajjaCode] = useState([]);

  const [ID, setID] = useState();
  const [form] = Form.useForm();

  let history = useHistory();

  // useEffect(() => {
  //   getForm19Data();
  // }, []);

  useEffect(() => {
    const result = villageData.filter(
      (thing, index, self) =>
        index ===
        self.findIndex((t) => t.sajjaName === thing.sajjaName && t.sajjaCode === thing.sajjaCode),
    );
    setVillageSaja(
      result?.map((row) => ({
        label: row.sajjaName,
        value: row.sajjaCode,
      })),
    );
  }, []);

  const handleOnChange = (value, event) => {
    setVillageSajjaCode(value);
    setVillageSajjaName(event.label);
  };

  const handleChangeForSajja = (value, event) => {
    setSajjaCode(value);
  };

  const onChangeSajjaCheckbox = (e) => {
    if (sajjaBox === false) {
      setSajjaBox(true);
    } else {
      setSajjaBox(false);
    }
    setVillageForm19Data([]);
  };

  const addForm = () => {
    history.push({
      pathname: `/form/village-form-19/village-form`,
    });
  };

  const getForm19Data = async () => {
    setIsLoading(true);

    sendRequest(
      `${URLS.BaseURL}/form19/getForm19Data?sajjaCode=${
        sajjaBox === true ? '' : villageSajjaCode
      }&userId=${sajjaBox === false ? '' : servarthId}`,
      'GET',
      null,
      (res) => {
        setVillageForm19Data(
          res.data.form19Data.map((row, index) => ({
            srNo: index + 1,
            id: row.id,
            descriptionOfArticle: row.descriptionOfArticle,
            authorityOfPurchase: row.authorityOfPurchase,
            numberOrQuantity: row.numberOrQuantity,
            dateOfPurchase:
              row.dateOfPurchase != null
                ? moment(row.dateOfPurchase, 'YYYY-MM-DD').format('YYYY-MM-DD')
                : null,
            authorityOfVoucher: row.authorityOfVoucher,
            amountWrittenOff: row.amountWrittenOff,
            amountRealized: row.amountRealized,
            dateOfCreditAtTreasury:
              row.dateOfCreditAtTreasury != null
                ? moment(row.dateOfCreditAtTreasury, 'YYYY-MM-DD').format('YYYY-MM-DD')
                : null,
            number: row.number,
            value: row.value,
            remarks: row.remarks,
            servarthId: row.servarthId,
            sajjaCode: row.sajjaCode,
          })),
        );
        message.success('Records Fetched !');
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

  const deleteForm19Data = async (record) => {
    setModalForDelete(false);
    sendRequest(`${URLS.BaseURL}/form19/discardForm19?id=${recordId}`, 'DELETE', null, (res) => {
      if (res.status == 226) {
        message.success('Record Deleted !');
        setVillageForm19Data([]);
        getForm19Data();
      }
    });
  };

  const handleCancelForModal = () => {
    setIsModalVisible(false);
  };

  const showModalForView = (record) => {
    form.resetFields();
    setDataInModal({
      id: record.id,
      //  cCode: codeVillage,
      descriptionOfArticle: record.descriptionOfArticle,
      authorityOfPurchase: record.authorityOfPurchase,
      numberOrQuantity: record.numberOrQuantity,
      dateOfPurchase: record.dateOfPurchase,
      authorityOfVoucher: record.authorityOfVoucher,
      amountWrittenOff: record.amountWrittenOff,
      amountRealized: record.amountRealized,
      dateOfCreditAtTreasury: record.dateOfCreditAtTreasury,
      number: record.number,
      value: record.value,
      remarks: record.remarks,
      sajjaCode: record.sajjaCode,
    });
    setInputState(true);
    setIsModalVisible(true);
    setOkText('Okay');
  };

  const showModalForEdit = (record) => {
    form.resetFields();
    setDataInModal({
      id: record.id,
      //   cCode: codeVillage,
      descriptionOfArticle: record.descriptionOfArticle,
      authorityOfPurchase: record.authorityOfPurchase,
      numberOrQuantity: record.numberOrQuantity,
      dateOfPurchase: record.dateOfPurchase,
      authorityOfVoucher: record.authorityOfVoucher,
      amountWrittenOff: record.amountWrittenOff,
      amountRealized: record.amountRealized,
      dateOfCreditAtTreasury: record.dateOfCreditAtTreasury,
      number: record.number,
      value: record.value,
      remarks: record.remarks,
      sajjaCode: record.sajjaCode,
    });
    setInputState(false);
    setIsModalVisible(true);
    setOkText('Save');
    setID(record.id);
  };

  const editForm19 = async () => {
    setConfirmLoading(true);

    let dateOfPurchaseI =
      form.getFieldValue('dateOfPurchase') &&
      form.getFieldValue('dateOfPurchase') !== 'Invalid date'
        ? moment(form.getFieldValue('dateOfPurchase'), 'DD/MM/YYYY').format('YYYY-MM-DD')
        : null;

    if (!dateOfPurchaseI) {
      if (dataInModal.dateOfPurchase && dataInModal.dateOfPurchase !== 'Invalid date') {
        dateOfPurchaseI = moment(dataInModal.dateOfPurchase).format('YYYY-MM-DD');
      }
    }

    let dateOfCreditAtTreasuryI =
      form.getFieldValue('dateOfCreditAtTreasury') &&
      form.getFieldValue('dateOfCreditAtTreasury') !== 'Invalid date'
        ? moment(form.getFieldValue('dateOfCreditAtTreasury'), 'DD/MM/YYYY').format('YYYY-MM-DD')
        : null;

    if (!dateOfCreditAtTreasuryI) {
      if (
        dataInModal.dateOfCreditAtTreasury &&
        dataInModal.dateOfCreditAtTreasury !== 'Invalid date'
      ) {
        dateOfCreditAtTreasuryI = moment(dataInModal.dateOfCreditAtTreasury).format('YYYY-MM-DD');
      }
    }

    const parametersForEdit = {
      userId: servarthId,
      id: ID,
      // cCode: codeVillage,
      // districtCode: districtCode,
      // talukaCode: talukaCode,
      descriptionOfArticle: dataInModal.descriptionOfArticle,
      authorityOfPurchase: dataInModal.authorityOfPurchase,
      numberOrQuantity: dataInModal.numberOrQuantity,
      dateOfPurchase: dateOfPurchaseI,
      authorityOfVoucher: dataInModal.authorityOfVoucher,
      amountWrittenOff: dataInModal.amountWrittenOff,
      amountRealized: dataInModal.amountRealized,
      dateOfCreditAtTreasury: dateOfCreditAtTreasuryI,
      number: dataInModal.number,
      value: dataInModal.value,
      remarks: dataInModal.remarks,
      sajjaCode: dataInModal.sajjaCode,
    };
    if (okText === 'Save') {
      sendRequest(
        `${URLS.BaseURL}/form19/editForm19`,
        'PUT',
        parametersForEdit,
        (res) => {
          if (res.status === 200) {
            message.success('Data Updated!');
            getForm19Data();
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

  const columns = [
    {
      key: '1',
      title: <FormattedMessage id="formLanguage.form.serialNo" />,
      dataIndex: 'srNo',
    },
    {
      key: '2',
      title: <FormattedMessage id="villageForm19.form.descriptionOfArticle" />,
      dataIndex: 'descriptionOfArticle',
    },
    {
      key: '3',
      title: <FormattedMessage id="villageForm19.form.authorityOfPurchase" />,
      dataIndex: 'authorityOfPurchase',
    },
    {
      key: '4',
      title: <FormattedMessage id="villageForm19.form.numberOrQuantity" />,
      dataIndex: 'numberOrQuantity',
    },
    {
      key: '5',
      title: <FormattedMessage id="villageForm19.form.dateOfPurchase" />,
      dataIndex: 'dateOfPurchase',
    },
    {
      key: '6',
      title: <FormattedMessage id="villageForm19.form.authorityOfVoucher" />,
      dataIndex: 'authorityOfVoucher',
    },
    {
      key: '7',
      title: <FormattedMessage id="villageForm19.form.amountWrittenOff" />,
      dataIndex: 'amountWrittenOff',
    },
    {
      key: '8',
      title: <FormattedMessage id="villageForm19.form.amountRealized" />,
      dataIndex: 'amountRealized',
    },
    {
      key: '9',
      title: <FormattedMessage id="villageForm19.form.dateOfCreditAtTreasury" />,
      dataIndex: 'dateOfCreditAtTreasury',
    },
    {
      key: '10',
      title: <FormattedMessage id="villageForm19.form.number" />,
      dataIndex: 'number',
    },
    {
      key: '11',
      title: <FormattedMessage id="villageForm19.form.value" />,
      dataIndex: 'value',
    },
    {
      key: '12',
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
  return (
    <>
      <PageContainer>
        <Card>
          {/*
          <VillageSelector
            pageType="withoutYear"
            setCodeVillage={setCodeVillage}
            setTextForVillage={setTextForVillage}
            onVillageChange={(setVillage, setVillageForm19Data)}
            yearChange={setRevenueYear}
          /> */}
          <Row>
            <Col xl={2} lg={2} md={2} sm={2} xs={2}></Col>
            <Col xl={20} lg={20} md={20} sm={24} xs={24}>
              <h2 style={{ marginBottom: '15px' }}>
                <center>
                  <FormattedMessage id="villageForm19.label.talathiCircle" />
                </center>
              </h2>
            </Col>
            <Col xl={2} lg={2} md={2} sm={2} xs={2}>
              <Button type="primary" onClick={addForm}>
                <FormattedMessage id="formLanguage.button.add" />
              </Button>
            </Col>
          </Row>
          <Form layout="horizontal">
            <Row style={{ marginTop: 15 }}>
              <Col xl={5} lg={5} md={24} sm={24} xs={24}>
                <Form.Item label={<FormattedMessage id="villageSelector.label.district" />}>
                  <Select disabled placeholder={districtName}></Select>
                </Form.Item>
              </Col>

              <Col xl={1} lg={1}></Col>
              <Col xl={5} lg={5} md={24} sm={24} xs={24}>
                <Form.Item label={<FormattedMessage id="villageSelector.label.taluka" />}>
                  <Select disabled placeholder={talukaName}></Select>
                </Form.Item>
              </Col>
              <Col xl={1} lg={1}></Col>
              <Col xl={2} lg={2} md={24} xs={24} sm={24}>
                <Checkbox
                  onChange={onChangeSajjaCheckbox}
                  name="userId"
                  value="userId"
                  style={{ marginTop: '8px' }}
                >
                  UserId
                </Checkbox>
              </Col>

              <Col xl={1} lg={1}></Col>
              <Col xl={5} lg={6} md={24} xs={24} sm={24}>
                {sajjaBox === false && (
                  <Form.Item wrapperCol={{ xl: 20, lg: 15 }} label="सजा">
                    <Select
                      options={villageSaja}
                      placeholder=" गाव निवडा"
                      onSelect={(value, event) => handleOnChange(value, event)}
                    ></Select>
                  </Form.Item>
                )}
              </Col>
              <Col xs={1} sm={1} md={1} lg={2} xl={2}></Col>
              <Col xs={1} sm={1} md={1} lg={2} xl={2}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isLoading}
                  onClick={() => {
                    getForm19Data();
                  }}
                >
                  <FormattedMessage id="formLanguage.button.search" />
                </Button>
              </Col>
              {/* <Col xl={1}></Col> */}
            </Row>
          </Form>
          <Row>
            <Col xl={24} lg={24} md={24} sm={24} xs={24}>
              <Table
                bordered
                loading={isLoading}
                scroll={{ x: 100 }}
                dataSource={villageForm19Data}
                columns={columns}
              />
            </Col>
          </Row>
        </Card>
        <Modal
          title={<FormattedMessage id="formLanguage.form.popForDelete" />}
          visible={modalForDelete}
          okText={<FormattedMessage id="formLanguage.form.yes" />}
          okType="danger"
          cancelText={<FormattedMessage id="formLanguage.form.no" />}
          onCancel={onCancelForDelete}
          onOk={deleteForm19Data}
        ></Modal>
        <Modal
          width={1000}
          visible={isModalVisible}
          okText={okText}
          onCancel={handleCancelForModal}
          onOk={editForm19}
          confirmLoading={confirmLoading}
        >
          {/*  disabled={inputState}
          defaultValue={dataInModal && dataInModal.communicationReceivedFrom}
          onChange=
          {(e) => {
            setDataInModal((preDataInModal) => ({
              ...preDataInModal,
              communicationReceivedFrom: e.target.value,
            }));
          }} */}
          <Form layout="vertical" form={form}>
            <Card>
              <Divider orientation="left">
                <FormattedMessage id="formLanguage.form.echawdi" />
              </Divider>
              <Row>
                <Col xl={7} lg={7} md={7} sm={7} xs={24}>
                  <Form.Item
                    name="sajjaCode"
                    label="सज्जा नाव "
                    rules={[
                      {
                        required: 'true',
                        message: 'This field is required',
                      },
                      // { max: 50, message: 'No In List is Required' },
                    ]}
                  >
                    <Select
                      options={villageSaja}
                      disabled={inputState}
                      defaultValue={dataInModal && dataInModal.sajjaCode}
                      onChange={(e) => {
                        setDataInModal((preDataInModal) => ({
                          ...preDataInModal,
                          sajjaCode: e,
                        }));
                      }}
                      onSelect={(value, event) => handleChangeForSajja(value, event)}
                    ></Select>
                  </Form.Item>
                </Col>
                <Col xl={1} lg={1} md={1} sm={1}></Col>

                <Col xl={7} lg={7} md={7} sm={7} xs={24}>
                  <Form.Item
                    label={<FormattedMessage id="villageForm19.form.descriptionOfArticle" />}
                    name="descriptionOfArticle"
                    rules={[{ required: true, message: 'Field is necessary!' }]}
                  >
                    <Input
                      onKeyPress={KeyPressEvents.isInputVarchar}
                      max={50}
                      disabled={inputState}
                      defaultValue={dataInModal && dataInModal.descriptionOfArticle}
                      onChange={(e) => {
                        setDataInModal((preDataInModal) => ({
                          ...preDataInModal,
                          descriptionOfArticle: e.target.value,
                        }));
                      }}
                    />
                  </Form.Item>
                </Col>

                <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>

                <Col xl={7} lg={7} md={7} sm={7} xs={24}>
                  <Form.Item
                    label={<FormattedMessage id="villageForm19.form.numberOrQuantity" />}
                    name="numberOrQuantity"
                    rules={[{ required: true, message: 'Field is necessary!' }]}
                  >
                    <Input
                      onKeyPress={KeyPressEvents.isInputNumber}
                      max={18}
                      disabled={inputState}
                      defaultValue={dataInModal && dataInModal.numberOrQuantity}
                      onChange={(e) => {
                        setDataInModal((preDataInModal) => ({
                          ...preDataInModal,
                          numberOrQuantity: e.target.value,
                        }));
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                  <Form.Item
                    label={<FormattedMessage id="villageForm19.form.authorityOfPurchase" />}
                    name="authorityOfPurchase"
                  >
                    <Input
                      onKeyPress={KeyPressEvents.isInputVarchar}
                      max={50}
                      disabled={inputState}
                      defaultValue={dataInModal && dataInModal.authorityOfPurchase}
                      onChange={(e) => {
                        setDataInModal((preDataInModal) => ({
                          ...preDataInModal,
                          authorityOfPurchase: e.target.value,
                        }));
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>

                <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                  {dataInModal && dataInModal.dateOfPurchase === null ? (
                    <Form.Item
                      label={<FormattedMessage id="villageForm19.form.dateOfPurchase" />}
                      name="dateOfPurchase"
                    >
                      <DatePicker disabled={inputState}></DatePicker>
                    </Form.Item>
                  ) : (
                    <Form.Item
                      label={<FormattedMessage id="villageForm19.form.dateOfPurchase" />}
                      name="dateOfPurchase"
                    >
                      <DatePicker
                        disabled={inputState}
                        defaultValue={dataInModal && moment(dataInModal.dateOfPurchase)}
                        onChange={(e) => {
                          setDataInModal((preDataInModal) => ({
                            ...preDataInModal,
                            dateOfPurchase: moment(e).format('YYYY-MM-DD'),
                          }));
                        }}
                      ></DatePicker>
                    </Form.Item>
                  )}
                </Col>
              </Row>
              <Row>
                <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                  <Form.Item
                    label={<FormattedMessage id="villageForm19.form.authorityOfVoucher" />}
                    name="authorityOfVoucher"
                    rules={[{ required: true, message: 'Field is necessary!' }]}
                  >
                    <Input
                      onKeyPress={KeyPressEvents.isInputVarchar}
                      max={50}
                      disabled={inputState}
                      defaultValue={dataInModal && dataInModal.authorityOfVoucher}
                      onChange={(e) => {
                        setDataInModal((preDataInModal) => ({
                          ...preDataInModal,
                          authorityOfVoucher: e.target.value,
                        }));
                      }}
                    />
                  </Form.Item>
                </Col>

                <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>
                <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                  <Form.Item
                    label={<FormattedMessage id="villageForm19.form.amountWrittenOff" />}
                    name="amountWrittenOff"
                    rules={[{ required: true, message: 'Remarks is necessary!' }]}
                  >
                    <Input
                      onKeyPress={KeyPressEvents.isInputNumber}
                      max={18}
                      disabled={inputState}
                      defaultValue={dataInModal && dataInModal.amountWrittenOff}
                      onChange={(e) => {
                        setDataInModal((preDataInModal) => ({
                          ...preDataInModal,
                          amountWrittenOff: e.target.value,
                        }));
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                  <Form.Item
                    label={<FormattedMessage id="villageForm19.form.amountRealized" />}
                    name="amountRealized"
                  >
                    <Input
                      onKeyPress={KeyPressEvents.isInputNumber}
                      max={18}
                      disabled={inputState}
                      defaultValue={dataInModal && dataInModal.amountRealized}
                      onChange={(e) => {
                        setDataInModal((preDataInModal) => ({
                          ...preDataInModal,
                          amountRealized: e.target.value,
                        }));
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>

                <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                  {dataInModal && dataInModal.dateOfCreditAtTreasury === null ? (
                    <Form.Item
                      label={<FormattedMessage id="villageForm19.form.dateOfCreditAtTreasury" />}
                      name="dateOfCreditAtTreasury"
                    >
                      <DatePicker disabled={inputState}></DatePicker>
                    </Form.Item>
                  ) : (
                    <Form.Item
                      label={<FormattedMessage id="villageForm19.form.dateOfCreditAtTreasury" />}
                      name="dateOfCreditAtTreasury"
                    >
                      <DatePicker
                        disabled={inputState}
                        defaultValue={dataInModal && moment(dataInModal.dateOfCreditAtTreasury)}
                        onChange={(e) => {
                          setDataInModal((preDataInModal) => ({
                            ...preDataInModal,
                            dateOfCreditAtTreasury: moment(e).format('YYYY-MM-DD'),
                          }));
                        }}
                      ></DatePicker>
                    </Form.Item>
                  )}
                </Col>
              </Row>
              <Row>
                <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                  <Form.Item
                    label={<FormattedMessage id="villageForm19.form.number" />}
                    name="number"
                    rules={[{ required: true, message: 'Field is necessary!' }]}
                  >
                    <Input
                      onKeyPress={KeyPressEvents.isInputNumber}
                      max={18}
                      disabled={inputState}
                      defaultValue={dataInModal && dataInModal.number}
                      onChange={(e) => {
                        setDataInModal((preDataInModal) => ({
                          ...preDataInModal,
                          number: e.target.value,
                        }));
                      }}
                    />
                  </Form.Item>
                </Col>

                <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>
                <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                  <Form.Item
                    label={<FormattedMessage id="villageForm19.form.value" />}
                    name="value"
                    rules={[{ required: true, message: 'Remarks is necessary!' }]}
                  >
                    <Input
                      onKeyPress={KeyPressEvents.isInputNumber}
                      max={18}
                      disabled={inputState}
                      defaultValue={dataInModal && dataInModal.value}
                      onChange={(e) => {
                        setDataInModal((preDataInModal) => ({
                          ...preDataInModal,
                          value: e.target.value,
                        }));
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                  <Form.Item
                    label={<FormattedMessage id="formLanguage.table.remark" />}
                    name="remarks"
                    rules={[{ required: true, message: 'Remarks is necessary!' }]}
                  >
                    <Input.TextArea
                      onKeyPress={KeyPressEvents.isInputVarchar}
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
            </Card>
          </Form>
        </Modal>
      </PageContainer>
    </>
  );
}

export default TableForm19;
