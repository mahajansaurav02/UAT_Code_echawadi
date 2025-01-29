import useAxios from '@/components/eComponents/use-axios';
// import VillageSelector from '@/components/eComponents/VillageSelector';
import URLS from '@/URLs/urls';
import { DeleteOutlined, EditTwoTone, EyeTwoTone } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import {
  Button,
  Card,
  Checkbox,
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
import { FormattedMessage } from 'umi';
import moment from 'moment';
import { useHistory } from 'react-router';
import { useModel } from 'umi';

function TableForm15() {
  const [codeVillage, setCodeVillage] = useState('');
  const [textVillage, setTextVillage] = useState('');
  const [textForVillage, setTextForVillage] = useState();

  const { sendRequest } = useAxios();
  const [form15data, setForm15data] = useState();
  const [dataInModal, setDataInModal] = useState();
  const [inputState, setInputState] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalForDelete, setModalForDelete] = useState(false);
  const [recordId, setRecordId] = useState();
  const [okText, setOkText] = useState();
  const [ID, setID] = useState();
  const [form15] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [sajjaBox, setSajjaBox] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [villageSaja, setVillageSaja] = useState([]);
  const [revenueYearLOC, setRevenueYearLOC] = useState();
  const [villageSajjaCode, setVillageSajjaCode] = useState();
  const [revenueYear1, setRevenueYear1] = useState();
  const [villageSajjaName, setVillageSajjaName] = useState();
  const [sajjaCode, setSajjaCode] = useState([]);
  let history = useHistory();
  const { districtName, talukaName, desig, servarthId, villageData, revenueYear } =
    useModel('details');
  const desgNew = localStorage.getItem('desg');

  // useEffect(() => {
  //   getForm15Data();
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

  useEffect(() => {
    const result = revenueYear.filter(
      (thing, index, self) =>
        index === self.findIndex((t) => t.revenueYear === thing.revenueYear && t.id === thing.id),
    );
    setRevenueYearLOC(
      result?.map((row) => ({
        label: row.revenueYear,
        value: row.id,
      })),
    );
  }, []);

  const handleOnChange = (value, event) => {
    setVillageSajjaCode(value);
    setVillageSajjaName(event.label);
  };
  //---Dropdown year logic
  const handleOnChangeYear = (value, event) => {
    setRevenueYear1(value);
    //setVillageSajjaName(event.label);
  };

  const onChangeSajjaCheckbox = (e) => {
    if (sajjaBox === false) {
      setSajjaBox(true);
    } else {
      setSajjaBox(false);
    }
    setForm15data([]);
  };

  const getForm15Data = async () => {
    setIsLoading(true);

    sendRequest(
      `${URLS.BaseURL}/form15/getForm15Data?sajjaCode=${villageSajjaCode}`,
      //&
      // }&userId=${sajjaBox === false ? '' : servarthId}`,
      'GET',
      null,
      (res) => {
        setForm15data([]);
        setForm15data(
          res.data.form15Data.map((r, i) => ({
            srNo: i + 1,
            id: r.id,
            communicationDispatchedToWhom: r.communicationDispatchedToWhom,
            communicationReceivedFrom: r.communicationReceivedFrom,
            noOfCommunication: r.noOfCommunication,
            dateOfReceipt: r.dateOfReceipt,
            subjectActionToTake: r.subjectActionToTake,
            dateOfDispatch:
              r.dateOfDispatch != null
                ? moment(r.dateOfDispatch, 'YYYY-MM-DD').format('YYYY-MM-DD')
                : null,
            noInList: r.noInList,
            remarks: r.remarks,
            designation: r.designation,
            sajjaCode: r.sajjaCode,
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
  const cols = [
    {
      title: <FormattedMessage id="formLanguage.form.serialNo" />,
      dataIndex: 'srNo',
    },
    {
      key: '1',
      title: <FormattedMessage id="form15.communicationReceivedform" />,
      dataIndex: 'communicationReceivedFrom',
    },
    {
      key: '2',
      title: <FormattedMessage id="form15.noOfCommunication" />,
      dataIndex: 'noOfCommunication',
    },
    {
      key: '3',
      title: <FormattedMessage id="form15.dateOfReceipt" />,
      dataIndex: 'dateOfReceipt',
    },
    {
      key: '4',
      title: <FormattedMessage id="form15.subjectActionToTake" />,
      dataIndex: 'subjectActionToTake',
    },
    {
      key: '5',
      title: <FormattedMessage id="form15.communicationDispatchedToWhom" />,
      dataIndex: 'communicationDispatchedToWhom',
    },
    {
      key: '6',
      title: <FormattedMessage id="form15.dateOfDispatch" />,
      dataIndex: 'dateOfDispatch',
    },
    {
      key: '7',
      title: <FormattedMessage id="form15.noInList" />,
      dataIndex: 'noInList',
    },
    {
      key: '8',
      title: <FormattedMessage id="form15.remarks" />,
      dataIndex: 'remarks',
    },
    {
      title: <FormattedMessage id="formLanguage.table.action" />,
      width: '75px',
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
  const showModalForView = (record) => {
    // console.log('record', record);
    form15.resetFields();
    setDataInModal({});
    setDataInModal({
      id: record.id,
      communicationDispatchedToWhom: record.communicationDispatchedToWhom,
      communicationReceivedFrom: record.communicationReceivedFrom,
      noOfCommunication: record.noOfCommunication,
      dateOfReceipt: record.dateOfReceipt,
      subjectActionToTake: record.subjectActionToTake,
      dateOfDispatch: record.dateOfDispatch,
      noInList: record.noInList,
      remarks: record.remarks,
      designation: record.designation,
      sajjaCode: record.sajjaCode,
    });

    setInputState(true);
    // console.log('Data in DataInModal state==>', record);
    setIsModalVisible(true);
    setOkText('Okay');
  };

  const onCancelForDeleteModal = () => {
    setModalForDelete(false);
  };

  const handleChangeForSajja = (value, event) => {
    setSajjaCode(value);
  };

  const deleteRecordById = (record) => {
    setRecordId(record.id);
    setModalForDelete(true);
  };
  const deleteRecord = async (record) => {
    setModalForDelete(false);
    sendRequest(`${URLS.BaseURL}/form15/discardForm15?id=${recordId}`, 'DELETE', null, (res) => {
      if (res.status === 226) {
        message.success('Record Deleted!');
        setForm15data([]);
        getForm15Data();
      }
    });
  };
  const showModalForEdit = (record) => {
    // console.log('record==>', record);
    form15.resetFields();
    setDataInModal({});
    setDataInModal({
      id: record.id,
      communicationDispatchedToWhom: record.communicationDispatchedToWhom,
      communicationReceivedFrom: record.communicationReceivedFrom,
      noOfCommunication: record.noOfCommunication,
      dateOfReceipt: record.dateOfReceipt,
      subjectActionToTake: record.subjectActionToTake,
      dateOfDispatch: record.dateOfDispatch,
      noInList: record.noInList,
      remarks: record.remarks,
      designation: record.designation,
      sajjaCode: record.sajjaCode,
    });

    setInputState(false);
    // console.log('Data in DataInModal state==>', record);
    setIsModalVisible(true);
    setOkText('Save');
    setID(record.id);
  };
  const handleCancelForModal = () => {
    setIsModalVisible(false);
  };
  const editForm15 = () => {
    setConfirmLoading(true);
    let dateOfDispatchI =
      form15.getFieldValue('dateOfDispatch') &&
      form15.getFieldValue('dateOfDispatch') !== 'Invalid date'
        ? moment(form15.getFieldValue('dateOfDispatch'), 'DD/MM/YYYY').format('YYYY-MM-DD')
        : null;

    if (!dateOfDispatchI) {
      if (dataInModal.dateOfDispatch && dataInModal.dateOfDispatch !== 'Invalid date') {
        dateOfDispatchI = moment(dataInModal.dateOfDispatch).format('YYYY-MM-DD');
      }
    }
    const parameterForEdit = {
      // ccode: codeVillage,
      // districtCode: districtCode,
      // talukaCode: talukaCode,
      userId: servarthId,
      // sajjaCode: sajjaCode,
      id: ID,
      communicationDispatchedToWhom: dataInModal.communicationDispatchedToWhom,
      communicationReceivedFrom: dataInModal.communicationReceivedFrom,
      noOfCommunication: dataInModal.noOfCommunication,
      dateOfReceipt: dataInModal.dateOfReceipt,
      subjectActionToTake: dataInModal.subjectActionToTake,
      dateOfDispatch: dateOfDispatchI,
      noInList: dataInModal.noInList,
      remarks: dataInModal.remarks,
      designation: dataInModal.designation,
      sajjaCode: dataInModal.sajjaCode,
    };
    // console.log('parameters for edit', parameterForEdit);
    if (okText === 'Save') {
      sendRequest(
        `${URLS.BaseURL}/form15/editForm15`,
        'PUT',
        parameterForEdit,
        (res) => {
          if (res.status === 200) {
            message.success('Data Updated!');
            getForm15Data();
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
  return (
    <PageContainer>
      <Card>
        <Row style={{ marginTop: '10px' }}>
          <Col xl={22} lg={22} md={22} sm={24} xs={24}>
            <center>
              <h2>
                <FormattedMessage id="form15.InwardOutward1" />
              </h2>
            </center>
          </Col>
          <Col xl={2} lg={2} md={2} sm={2} xs={2}>
            <Button
              type="primary"
              onClick={() => {
                history.push({
                  pathname: `/form/village-form-15/village-form`,
                });
              }}
            >
              <FormattedMessage id="formLanguage.button.add" />
            </Button>
          </Col>
        </Row>
        <Form layout="horizontal">
          <Row style={{ marginTop: 15 }}>
            <Col xl={4} lg={4} md={24} sm={24} xs={24}>
              <Form.Item label={<FormattedMessage id="villageSelector.label.district" />}>
                <Select disabled placeholder={districtName}></Select>
              </Form.Item>
            </Col>

            <Col xl={1} lg={1}></Col>
            <Col xl={4} lg={4} md={24} sm={24} xs={24}>
              <Form.Item label={<FormattedMessage id="villageSelector.label.taluka" />}>
                <Select disabled placeholder={talukaName}></Select>
              </Form.Item>
            </Col>
            <Col xl={1} lg={1}></Col>
            {/*   <Col xl={2} lg={2} md={24} xs={24} sm={24}>
              <Checkbox
                onChange={onChangeSajjaCheckbox}
                name="userId"
                value="userId"
                style={{ marginTop: '8px' }}
              >
                UserId
              </Checkbox>
            </Col> */}
            <Col xl={1} lg={1}></Col>
            <Col xl={4} lg={4} md={24} sm={24} xs={24}>
              {sajjaBox === false && (
                <Form.Item wrap5erCol={{ xl: 20, lg: 15 }} label="सजा">
                  <Select
                    options={villageSaja}
                    placeholder=" गाव निवडा"
                    onSelect={(value, event) => handleOnChange(value, event)}
                  ></Select>
                </Form.Item>
              )}
            </Col>
            <Col xl={1} lg={1}></Col>
            <Col xl={4} lg={4} md={24} sm={24} xs={24}>
              {sajjaBox === false && (
                <Form.Item wrapperCol={{ xl: 20, lg: 15 }} label="वर्ष">
                  <Select
                    options={revenueYearLOC}
                    placeholder="वर्ष निवडा"
                    onSelect={(value, event) => handleOnChangeYear(value, event)}
                  ></Select>
                </Form.Item>
              )}
            </Col>
            <Col xl={1} lg={1}></Col>
            <Col xs={1} sm={1} md={1} lg={2} xl={2}>
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                onClick={() => {
                  getForm15Data();
                }}
              >
                <FormattedMessage id="formLanguage.button.search" />
              </Button>
            </Col>
            {/* <Col xl={1}></Col> */}
          </Row>
        </Form>
        <Table loading={isLoading} columns={cols} dataSource={form15data}></Table>
      </Card>
      <Modal
        title={<FormattedMessage id="formLanguage.form.popForDelete" />}
        visible={modalForDelete}
        okText={<FormattedMessage id="formLanguage.form.yes" />}
        okType="danger"
        cancelText={<FormattedMessage id="formLanguage.form.no" />}
        onCancel={onCancelForDeleteModal}
        onOk={deleteRecord}
      ></Modal>
      <Modal
        width={900}
        visible={isModalVisible}
        okText={okText}
        onCancel={handleCancelForModal}
        onOk={editForm15}
        confirmLoading={confirmLoading}
      >
        <Form form={form15} layout="vertical" onFinish={editForm15}>
          <Row>
            <Col xl={7} lg={7} md={7} sm={7} xs={24}>
              <Form.Item
                rules={[{ required: true, message: 'This Field Is Required..' }]}
                name={'communicationReceivedFrom'}
                label={<FormattedMessage id="form15.communicationReceivedform" />}
              >
                <Input
                  maxLength={50}
                  disabled={inputState}
                  defaultValue={dataInModal && dataInModal.communicationReceivedFrom}
                  onChange={(e) => {
                    setDataInModal((preDataInModal) => ({
                      ...preDataInModal,
                      communicationReceivedFrom: e.target.value,
                    }));
                  }}
                />
              </Form.Item>
            </Col>
            <Col xl={1} lg={1} md={1} sm={1}></Col>
            <Col xl={7} lg={7} md={7} sm={7} xs={24}>
              <Form.Item
                rules={[{ required: true, message: 'This Field Is Required..' }]}
                name={'noOfCommunication'}
                label={<FormattedMessage id="form15.noOfCommunication" />}
              >
                <Input
                  maxLength={50}
                  disabled={inputState}
                  defaultValue={dataInModal && dataInModal.noOfCommunication}
                  onChange={(e) => {
                    setDataInModal((preDataInModal) => ({
                      ...preDataInModal,
                      noOfCommunication: e.target.value,
                    }));
                  }}
                />
              </Form.Item>
            </Col>
            <Col xl={1} lg={1} md={1} sm={1}></Col>
            <Col xl={7} lg={7} md={7} sm={7} xs={24}>
              <Form.Item
                rules={[{ required: true, message: 'This Field Is Required..' }]}
                name={'dateOfReceipt'}
                label={<FormattedMessage id="form15.dateOfReceipt" />}
              >
                <DatePicker
                  disabled={inputState}
                  defaultValue={dataInModal && moment(dataInModal.dateOfReceipt)}
                  onChange={(e) => {
                    setDataInModal((preDataInModal) => ({
                      ...preDataInModal,
                      dateOfReceipt: moment(e).format('YYYY-MM-DD'),
                    }));
                    // console.log('dateOfReceipt onchange', e);
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col xl={7} lg={7} md={7} sm={7} xs={24}>
              <Form.Item
                rules={[{ required: true, message: 'This Field Is Required..' }]}
                name={'subjectActionToTake'}
                label={<FormattedMessage id="form15.subjectActionToTake" />}
              >
                <Input.TextArea
                  maxLength={150}
                  disabled={inputState}
                  defaultValue={dataInModal && dataInModal.subjectActionToTake}
                  onChange={(e) => {
                    setDataInModal((preDataInModal) => ({
                      ...preDataInModal,
                      subjectActionToTake: e.target.value,
                    }));
                  }}
                />
              </Form.Item>
            </Col>
            <Col xl={1} lg={1} md={1} sm={1}></Col>
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
            <Col xl={7} lg={7} md={7} sm={7} xs={24}></Col>
            <Col xl={7} lg={7} md={7} sm={7} xs={24}>
              <Form.Item
                name={'communicationDispatchedToWhom'}
                label={<FormattedMessage id="form15.communicationDispatchedToWhom" />}
              >
                <Input.TextArea
                  maxLength={50}
                  disabled={inputState}
                  defaultValue={dataInModal && dataInModal.communicationDispatchedToWhom}
                  onChange={(e) => {
                    setDataInModal((preDataInModal) => ({
                      ...preDataInModal,
                      communicationDispatchedToWhom: e.target.value,
                    }));
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col xl={7} lg={7} md={7} sm={7} xs={24}>
              {dataInModal && dataInModal.dateOfDispatch === null ? (
                <Form.Item
                  name={'dateOfDispatch'}
                  label={<FormattedMessage id="form15.dateOfDispatch" />}
                >
                  <DatePicker disabled={inputState} />
                </Form.Item>
              ) : (
                <Form.Item
                  name={'dateOfDispatch'}
                  label={<FormattedMessage id="form15.dateOfDispatch" />}
                >
                  <DatePicker
                    disabled={inputState}
                    defaultValue={dataInModal && moment(dataInModal.dateOfDispatch)}
                    onChange={(e) => {
                      setDataInModal((preDataInModal) => ({
                        ...preDataInModal,
                        dateOfDispatch: moment(e).format('YYYY-MM-DD'),
                      }));
                    }}
                  />
                </Form.Item>
              )}
            </Col>
            <Col xl={1} lg={1} md={1} sm={1}></Col>
            <Col xl={7} lg={7} md={7} sm={7} xs={24}>
              <Form.Item
                name="noInList"
                label={<FormattedMessage id="form15.noInList" />}
                rules={[
                  {
                    required: 'true',
                    message: 'This field is required',
                  },
                  // { max: 50, message: 'No In List is Required' },
                ]}
              >
                <Select
                  disabled={inputState}
                  defaultValue={dataInModal && dataInModal.noInList}
                  onChange={(e) => {
                    setDataInModal((preDataInModal) => ({
                      ...preDataInModal,
                      noInList: e,
                    }));
                  }}
                >
                  <Select.Option value="अ">अ</Select.Option>
                  <Select.Option value="ब">ब</Select.Option>
                  <Select.Option value="क">क</Select.Option>
                  <Select.Option value="क१">क१</Select.Option>
                  <Select.Option value="ड">ड</Select.Option>
                </Select>
              </Form.Item>

              {/* <Form.Item
                rules={[{ required: true, message: 'This Field Is Required..' }]}
                name={'noInList'}
                label={<FormattedMessage id="form15.noInList" />}
              >
                <Input
                  maxLength={50}
                  disabled={inputState}
                  defaultValue={dataInModal && dataInModal.noInList}
                  onChange={(e) => {
                    setDataInModal((preDataInModal) => ({
                      ...preDataInModal,
                      noInList: e.target.value,
                    }));
                  }}
                />
              </Form.Item> */}
            </Col>
            <Col xl={1} lg={1} md={1} sm={1}></Col>
            <Col xl={7} lg={7} md={7} sm={7} xs={24}>
              <Form.Item
                rules={[{ required: true, message: 'This Field Is Required..' }]}
                name={'remarks'}
                label={<FormattedMessage id="form15.remarks" />}
              >
                <Input.TextArea
                  maxLength={150}
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
      </Modal>
    </PageContainer>
  );
}

export default TableForm15;
