import useAxios from '@/components/eComponents/use-axios';
import VillageSelector from '@/components/eComponents/VillageSelector';
import URLS from '@/URLs/urls';
import { DeleteOutlined, EditTwoTone, EyeTwoTone } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card, Col, DatePicker, Form, Input, message, Modal, Row, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import villageForm8c from '../village-form';
import { FormattedMessage, useModel } from 'umi';
import moment from 'moment';
import KeyPressEvents from '@/util/KeyPressEvents';

function tableForm8c() {
  const [villageForm8c, setVillageForm8CData] = useState();
  const [okText, setOkText] = useState();
  const [ID, setID] = useState();
  const [form] = Form.useForm();
  const [dataInModal, setDataInModal] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [valueForRentYear, setValueForRentYear] = useState();
  const [recordId, setRecordId] = useState();
  const [modalForDelete, setModalForDelete] = useState(false);
  const [inputState, setInputState] = useState();
  const { sendRequest } = useAxios();
  const { districtName, servarthId, districtCode, talukaCode } = useModel('details');
  const [codeVillage, setCodeVillage] = useState('');
  const [textForVillage, setTextForVillage] = useState();
  const [village, setVillage] = useState([]);
  const [revenueYear, setRevenueYear] = useState();

  let history = useHistory();
  function onChange(date, dateString) {
    console.log(date, dateString);
  }

  const addForm = () => {
    history.push({
      pathname: `/form/village-form-8c/village-form`,
    });
  };

  const getForm8CData = async () => {
    sendRequest(
      `${URLS.BaseURL}/form8c/getForm8CData?districtCode=${districtCode}&talukaCode=${talukaCode}&cCode=${codeVillage}`,
      'GET',
      null,
      (res) => {
        setVillageForm8CData(
          res.data.form8CData.map((row, index) => ({
            srNo: index + 1,
            id: row.id,
            nameOfPersonFromWhomRecoverable: row.nameOfPersonFromWhomRecoverable,
            totalDemand: row.totalDemand,
            currentYear: row.currentYear,
            receiptNo: row.receiptNo,
            receiptDate: row.receiptDate,
            amountRecovered: row.amountRecovered,
            balanceForRecovery: row.balanceForRecovery,
            challanNoCreditInTreasury: row.challanNoCreditInTreasury,
            challanDate: row.challanDate,
            remarks: row.remarks,
            arrears: row.arrears,
          })),
        );
        message.success('Records Fetched !');
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
  const deleteForm8c = async (record) => {
    setModalForDelete(false);
    sendRequest(`${URLS.BaseURL}/form8c/discardForm8C?id=${recordId}`, 'DELETE', null, (res) => {
      if (res.status == 226) {
        message.success('record Deleted !');
        setVillageForm8CData([]);
        getForm8CData();
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
      cCode: codeVillage,
      nameOfPersonFromWhomRecoverable: record.nameOfPersonFromWhomRecoverable,
      arrears: record.arrears,
      currentYear: record.currentYear,
      totalDemand: record.totalDemand,
      receiptNo: record.receiptNo,
      receiptDate: record.receiptDate,
      amountRecovered: record.amountRecovered,
      balanceForRecovery: record.balanceForRecovery,
      challanNoCreditInTreasury: record.challanNoCreditInTreasury,
      challanDate: record.challanDate,
      remarks: record.remarks,
    });
    setInputState(true);
    setIsModalVisible(true);
    setOkText('Okay');
  };

  const showModalForEdit = (record) => {
    form.resetFields();
    setDataInModal({
      id: record.id,
      cCode: codeVillage,
      nameOfPersonFromWhomRecoverable: record.nameOfPersonFromWhomRecoverable,
      arrears: record.arrears,
      currentYear: record.currentYear,
      totalDemand: record.totalDemand,
      receiptNo: record.receiptNo,
      receiptDate: record.receiptDate,
      amountRecovered: record.amountRecovered,
      balanceForRecovery: record.balanceForRecovery,
      challanNoCreditInTreasury: record.challanNoCreditInTreasury,
      challanDate: record.challanDate,
      remarks: record.remarks,
    });
    setInputState(false);
    setIsModalVisible(true);
    setOkText('Save');
    setID(record.id);
  };

  const editForm8C = async () => {
    const parametersForEdit = {
      id: ID,
      cCode: codeVillage,
      districtCode: districtCode,
      talukaCode: talukaCode,
      nameOfPersonFromWhomRecoverable: dataInModal.nameOfPersonFromWhomRecoverable,
      arrears: dataInModal.arrears,
      totalDemand: dataInModal.totalDemand,
      receiptNo: dataInModal.receiptNo,
      amountRecovered: dataInModal.amountRecovered,
      balanceForRecovery: dataInModal.balanceForRecovery,
      challanNoCreditInTreasury: dataInModal.challanNoCreditInTreasury,
      remarks: dataInModal.remarks,
      receiptDate: moment(dataInModal.receiptDate).format('YYYY-MM-DD'),
      challanDate: moment(dataInModal.challanDate).format('YYYY-MM-DD'),
      currentYear: moment(valueForRentYear).format('YYYY'),
    };
    if (okText === 'Save') {
      sendRequest(`${URLS.BaseURL}/form8c/editForm8C`, 'PUT', parametersForEdit, (res) => {
        if (res.status === 200) {
          message.success('Data Updated!');
          getForm8CData();
          setIsModalVisible(false);
        }
      });
    } else if (okText === 'Okay') {
      setIsModalVisible(false);
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
      title: <FormattedMessage id="villageForm8c.form.nameOfPerson" />,
      dataIndex: 'nameOfPersonFromWhomRecoverable',
    },
    {
      key: '3',
      title: <FormattedMessage id="villageForm8c.form.arrears" />,
      dataIndex: 'arrears',
    },
    {
      key: '4',
      title: <FormattedMessage id="villageForm8c.form.currentYear" />,
      dataIndex: 'currentYear',
    },
    {
      key: '5',
      title: <FormattedMessage id="villageForm8c.form.totalDemand" />,
      dataIndex: 'totalDemand',
    },
    {
      key: '6',
      title: <FormattedMessage id="villageForm8c.form.receiptNoAmtRecovered" />,
      dataIndex: 'receiptNo',
    },
    {
      key: '7',
      title: <FormattedMessage id="villageForm8c.form.receiptDate" />,
      dataIndex: 'receiptDate',
    },

    {
      key: '8',
      title: <FormattedMessage id="villageForm8c.form.amountForRecovered" />,
      dataIndex: 'amountRecovered',
    },
    {
      key: '9',
      title: <FormattedMessage id="villageForm8c.form.balanceRecovery" />,
      dataIndex: 'balanceForRecovery',
    },
    {
      key: '10',
      title: <FormattedMessage id="villageForm8c.form.challanNoCredit" />,
      dataIndex: 'challanNoCreditInTreasury',
    },

    {
      key: '11',
      title: <FormattedMessage id="villageForm8c.form.challanDate" />,
      dataIndex: 'challanDate',
    },

    {
      key: '12',
      title: <FormattedMessage id="villageForm8c.form.remarks" />,
      dataIndex: 'remarks',
    },
    {
      key: '13',
      title: <FormattedMessage id="formLanguage.table.action" />,

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
    <div>
      <PageContainer>
        <Card>
          <h2>
            <center>
              <FormattedMessage id="villageForm8c.form.villageForm8c" />
            </center>
          </h2>
          <h3>
            <center>
              <FormattedMessage id="villageForm8c.form.villageForm8cname" />
            </center>
          </h3>
          <Row style={{ marginBottom: '10px' }}>
            <Col xl={22} lg={22} md={20} sm={18} xs={18}></Col>

            <Col xl={2} lg={2} md={2} sm={4} xs={4}>
              <Button type="primary" onClick={addForm}>
                <FormattedMessage id="formLanguage.button.add" />
              </Button>
            </Col>
          </Row>
          <VillageSelector
            pageType="withoutYear"
            setCodeVillage={setCodeVillage}
            setTextForVillage={setTextForVillage}
            onVillageChange={(setVillage, setVillageForm8CData)}
            yearChange={setRevenueYear}
          />

          <Row>
            <Col xl={2} lg={2} md={2} sm={2} xs={2}>
              <Button
                type="primary"
                onClick={() => {
                  if (textForVillage) {
                    getForm8CData();
                  } else if (textForVillage == null) {
                    message.info('Please Select Village');
                  }
                }}
              >
                <FormattedMessage id="formLanguage.button.search" />
              </Button>
            </Col>
          </Row>
        </Card>

        <Card>
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            <Table bordered scroll={{ x: 100 }} dataSource={villageForm8c} columns={columns} />
          </Col>
        </Card>
        <Modal
          title={<FormattedMessage id="formLanguage.form.popForDelete" />}
          visible={modalForDelete}
          okText={<FormattedMessage id="formLanguage.form.yes" />}
          okType="danger"
          cancelText={<FormattedMessage id="formLanguage.form.no" />}
          onCancel={onCancelForDelete}
          onOk={deleteForm8c}
        ></Modal>

        <Modal
          width={1000}
          visible={isModalVisible}
          okText={okText}
          onCancel={handleCancelForModal}
          onOk={editForm8C}
        >
          <Form layout="vertical" form={form}>
            <Card>
              <Row>
                <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                  <Form.Item
                    label={<FormattedMessage id="villageForm8c.form.nameOfPerson" />}
                    name="nameOfPersonFromWhomRecoverable"
                    rules={[{ required: true, message: 'Field is necessary!' }]}
                  >
                    <Input
                      onKeyPress={KeyPressEvents.isInputVarchar}
                      max={50}
                      disabled={inputState}
                      defaultValue={dataInModal && dataInModal.nameOfPersonFromWhomRecoverable}
                      onChange={(e) => {
                        setDataInModal((preDataInModal) => ({
                          ...preDataInModal,
                          nameOfPersonFromWhomRecoverable: e.target.value,
                        }));
                      }}
                    />
                  </Form.Item>
                </Col>

                <Col xl={2} lg={2} md={2} sm={2} xs={2}></Col>

                <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                  <Form.Item
                    label={<FormattedMessage id="villageForm8c.form.currentYear" />}
                    name="currentYear"
                    rules={[{ required: true, message: 'Field is necessary!' }]}
                  >
                    <DatePicker
                      onChange={(e) => {
                        setValueForRentYear(e);
                      }}
                      defaultValue={dataInModal && moment(dataInModal.currentYear, 'YYYY')}
                      disabled={inputState}
                      picker="year"
                    ></DatePicker>
                  </Form.Item>
                </Col>
              </Row>

              <h2>{<FormattedMessage id="villageForm8c.form.amountofrecovery" />}</h2>
              <Row>
                <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                  <Form.Item
                    label={<FormattedMessage id="villageForm8c.form.totalDemand" />}
                    name="totalDemand"
                    rules={[{ required: true, message: 'Field is necessary!' }]}
                  >
                    <Input
                      onKeyPress={KeyPressEvents.isInputVarchar}
                      max={50}
                      disabled={inputState}
                      defaultValue={dataInModal && dataInModal.totalDemand}
                      onChange={(e) => {
                        setDataInModal((preDataInModal) => ({
                          ...preDataInModal,
                          totalDemand: e.target.value,
                        }));
                      }}
                    />
                  </Form.Item>
                </Col>

                <Col xl={2} lg={2} md={2} sm={2} xs={2}></Col>
                <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                  <Form.Item
                    label={<FormattedMessage id="villageForm8c.form.arrears" />}
                    name="arrears"
                    rules={[{ required: true, message: 'Field is necessary!' }]}
                  >
                    <Input
                      onKeyPress={KeyPressEvents.isInputVarchar}
                      max={50}
                      disabled={inputState}
                      defaultValue={dataInModal && dataInModal.arrears}
                      onChange={(e) => {
                        setDataInModal((preDataInModal) => ({
                          ...preDataInModal,
                          arrears: e.target.value,
                        }));
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row>
                <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                  <Form.Item
                    label={<FormattedMessage id="villageForm8c.form.receiptNoAmtRecovered" />}
                    name="receiptNo"
                    rules={[{ required: true, message: 'Field is necessary!' }]}
                  >
                    <Input
                      onKeyPress={KeyPressEvents.isInputVarchar}
                      max={50}
                      disabled={inputState}
                      defaultValue={dataInModal && dataInModal.receiptNo}
                      onChange={(e) => {
                        setDataInModal((preDataInModal) => ({
                          ...preDataInModal,
                          receiptNo: e.target.value,
                        }));
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col xl={2} lg={2} md={2} sm={2} xs={2}></Col>

                <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                  <Form.Item
                    label={<FormattedMessage id="villageForm8c.form.receiptDate" />}
                    name="receiptDate"
                    rules={[{ required: true, message: 'Field is necessary!' }]}
                  >
                    <DatePicker
                      disabled={inputState}
                      defaultValue={dataInModal && moment(dataInModal.receiptDate)}
                      onChange={(e) => {
                        setDataInModal((preDataInModal) => ({
                          ...preDataInModal,
                          receiptDate: moment(e).format('YYYY-MM-DD'),
                        }));
                      }}
                    ></DatePicker>
                  </Form.Item>
                </Col>
              </Row>

              <Row>
                <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                  <Form.Item
                    label={<FormattedMessage id="villageForm8c.form.amountForRecovered" />}
                    name="amountRecovered"
                    rules={[{ required: true, message: 'Field is necessary!' }]}
                  >
                    <Input
                      onKeyPress={KeyPressEvents.isInputVarchar}
                      max={50}
                      disabled={inputState}
                      defaultValue={dataInModal && dataInModal.amountRecovered}
                      onChange={(e) => {
                        setDataInModal((preDataInModal) => ({
                          ...preDataInModal,
                          amountRecovered: e.target.value,
                        }));
                      }}
                    />
                  </Form.Item>
                </Col>

                <Col xl={2} lg={2} md={2} sm={2} xs={2}></Col>
                <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                  <Form.Item
                    label={<FormattedMessage id="villageForm8c.form.balanceRecovery" />}
                    name="balanceForRecovery"
                    rules={[{ required: true, message: 'Field is necessary!' }]}
                  >
                    <Input
                      onKeyPress={KeyPressEvents.isInputVarchar}
                      max={50}
                      disabled={inputState}
                      defaultValue={dataInModal && dataInModal.balanceForRecovery}
                      onChange={(e) => {
                        setDataInModal((preDataInModal) => ({
                          ...preDataInModal,
                          balanceForRecovery: e.target.value,
                        }));
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row>
                <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                  <Form.Item
                    label={<FormattedMessage id="villageForm8c.form.challanNoCredit" />}
                    name="challanNoCreditInTreasury"
                    rules={[{ required: true, message: 'Field is necessary!' }]}
                  >
                    <Input
                      onKeyPress={KeyPressEvents.isInputVarchar}
                      max={50}
                      disabled={inputState}
                      defaultValue={dataInModal && dataInModal.challanNoCreditInTreasury}
                      onChange={(e) => {
                        setDataInModal((preDataInModal) => ({
                          ...preDataInModal,
                          challanNoCreditInTreasury: e.target.value,
                        }));
                      }}
                    />
                  </Form.Item>
                </Col>

                <Col xl={2} lg={2} md={2} sm={2} xs={2}></Col>

                <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                  <Form.Item
                    label={<FormattedMessage id="villageForm8c.form.challanDate" />}
                    name="challanDate"
                    rules={[{ required: true, message: 'Field is necessary!' }]}
                  >
                    <DatePicker
                      disabled={inputState}
                      defaultValue={dataInModal && moment(dataInModal.challanDate)}
                      onChange={(e) => {
                        setDataInModal((preDataInModal) => ({
                          ...preDataInModal,
                          challanDate: moment(e).format('YYYY-MM-DD'),
                        }));
                      }}
                    ></DatePicker>
                  </Form.Item>
                </Col>
              </Row>

              <Row>
                <Col xl={20} lg={15} md={15} sm={24} xs={24}>
                  <Form.Item
                    label={<FormattedMessage id="villageForm8c.form.remarks" />}
                    name="remarks"
                    rules={[{ required: true, message: 'Field is necessary!' }]}
                  >
                    <Input
                      onKeyPress={KeyPressEvents.isInputVarchar}
                      max={50}
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
    </div>
  );
}

export default tableForm8c;
