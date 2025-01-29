import VillageSelector from '@/components/eComponents/VillageSelector';
import { PageContainer } from '@ant-design/pro-layout';
import {
  Button,
  Card,
  Col,
  Row,
  Table,
  message,
  Form,
  Modal,
  Input,
  DatePicker,
  Divider,
} from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { FormattedMessage, useModel } from 'umi';
import { useHistory, useLocation } from 'react-router';
import { DeleteOutlined, EditTwoTone, EyeTwoTone } from '@ant-design/icons';
import useAxios from '@/components/eComponents/use-axios';
import URLS from '@/URLs/urls';
import KeyPressEvents from '@/util/KeyPressEvents';

function TableForm21() {
  const { sendRequest } = useAxios();

  const [codeVillage, setCodeVillage] = useState('');
  const [textForVillage, setTextForVillage] = useState();
  const [village, setVillage] = useState([]);
  const [revenueYear, setRevenueYear] = useState();
  const [villageForm21, setVillageForm21] = useState();
  const [recordId, setRecordId] = useState();
  const [modalForDelete, setModalForDelete] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [inputState, setInputState] = useState();
  const [dataInModal, setDataInModal] = useState();
  const [okText, setOkText] = useState();
  const [Day, setDay] = useState();
  const [ID, setID] = useState();
  const { districtName, servarthId, districtCode, talukaCode } = useModel('details');
  const [form] = Form.useForm();
  let history = useHistory();

  useEffect(() => {
    getForm21Data();
  }, []);

  const addForm = () => {
    history.push({
      pathname: `/form/village-form-21/village-form`,
    });
  };

  const handleCancelForModal = () => {
    setIsModalVisible(false);
  };

  function handleOnChangeDate(e) {
    const dates = moment(e);
    //setDay(dates.getDay());
    //setDay();
    var weekday;
    switch (dates.weekday()) {
      case 1:
        form.setFieldsValue({
          day: 'Monday',
        });
        setDay('Monday');
        console.log('test', dates.weekday());
        break;
      case 2:
        form.setFieldsValue({
          day: 'Tuesday',
        });
        setDay('Tuesday');
        console.log('test', dates.weekday());
        break;
      case 3:
        form.setFieldsValue({
          day: 'Wednesday',
        });
        setDay('Wednesday');
        console.log('test', dates.weekday());
        break;
      case 4:
        form.setFieldsValue({
          day: 'Thursday',
        });
        setDay('Thursday');
        console.log('test', dates.weekday());

        break;
      case 5:
        form.setFieldsValue({
          day: 'Friday',
        });
        setDay('Friday');
        console.log('test', dates.weekday());

        break;
      case 6:
        form.setFieldsValue({
          day: 'Saturday',
        });
        setDay('Saturday');
        console.log('test', dates.weekday());

        break;
      case 0:
        form.setFieldsValue({
          day: 'Sunday',
        });
        setDay('Sunday');
        console.log('test', dates.weekday());

        break;
      default:
        break;
    }
    console.log('weekday for selected dates', dates.weekday());
  }

  const getForm21Data = async () => {
    sendRequest(`${URLS.BaseURL}/form21/getForm21Data?userId=${servarthId}`, 'GET', null, (res) => {
      setVillageForm21(
        res.data.form21Data.map((row, index) => ({
          srNo: index + 1,
          id: row.id,
          // districtCode: districtCode,
          // talukaCode: talukaCode,
          // revenueYear: revenueYear,
          servarthId: row.servarthId,
          villageName: row.villageName,
          diaryDate: row.diaryDate,
          day: row.day,
          remarks: row.remarks,
        })),
      );
      message.success('Records Fetched !');
    });
  };

  const showModalForView = (record) => {
    form.resetFields();
    setDataInModal({
      id: record.id,
      cCode: codeVillage,
      villageName: record.villageName,
      diaryDate: record.diaryDate,
      day: record.day,
      date: record.date,
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
      villageName: record.villageName,
      diaryDate: record.diaryDate,
      day: record.day,
      date: record.date,
      remarks: record.remarks,
    });
    setInputState(false);
    setIsModalVisible(true);
    setOkText('Save');
    setID(record.id);
  };

  const editForm21 = () => {
    const parametersForEdit = {
      id: ID,
      // cCode: codeVillage,
      // districtCode: districtCode,
      // talukaCode: talukaCode,
      userId: servarthId,

      villageName: dataInModal.villageName,
      diaryDate: moment(dataInModal.diaryDate).format('YYYY-MM-DD'),
      day: form.getFieldValue('day'),
      date: dataInModal.date,
      remarks: dataInModal.remarks,
    };
    if (okText === 'Save') {
      sendRequest(`${URLS.BaseURL}/form21/editForm21`, 'PUT', parametersForEdit, (res) => {
        if (res.status === 200) {
          message.success('Data Updated!');
          getForm21Data();
          setIsModalVisible(false);
        }
      });
    } else if (okText === 'Okay') {
      setIsModalVisible(false);
    }
  };

  const onCancelForDelete = () => {
    setModalForDelete(false);
  };

  const deleteRecord = (record) => {
    setRecordId(record.id);
    setModalForDelete(true);
  };

  const deleteForm21Data = async () => {
    setModalForDelete(false);
    sendRequest(`${URLS.BaseURL}/form21/discardForm21?id=${recordId}`, 'DELETE', null, (res) => {
      if (res.status === 226) {
        message.success('Record Deleted !');
        setVillageForm21([]);
        getForm21Data();
      }
    });
  };

  const columns = [
    {
      key: '1',
      title: <FormattedMessage id="formLanguage.form.serialNo" />,
      dataIndex: 'srNo',
    },
    {
      key: '2',
      title: <FormattedMessage id="villageForm21.form.villageName" />,
      dataIndex: 'villageName',
    },
    {
      key: '3',
      title: <FormattedMessage id="villageForm21.form.date" />,
      dataIndex: 'diaryDate',
    },
    {
      key: '4',
      title: <FormattedMessage id="villageForm21.form.day" />,
      dataIndex: 'day',
    },
    {
      key: '5',
      title: <FormattedMessage id="formLanguage.table.remark" />,
      dataIndex: 'remarks',
    },
    {
      key: '5',
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
    <div>
      <PageContainer>
        <Card>
          <Row>
            <Col xl={2} lg={2} md={2} sm={2} xs={2}></Col>
            <Col xl={20} lg={20} md={20} sm={16} xs={16}></Col>
            <Col xl={2} lg={2} md={2} sm={4} xs={4}>
              <Button type="primary" onClick={addForm}>
                <FormattedMessage id="formLanguage.button.add" />
              </Button>
            </Col>
          </Row>
          <h2>
            <center>
              <FormattedMessage id="villageForm21.form.reuleVillageForm21" />
            </center>
          </h2>
          <h2>
            <center>
              <FormattedMessage id="villageForm21.form.diaryOff" />
            </center>
          </h2>
          {/* <VillageSelector
            pageType="withoutYear"
            setCodeVillage={setCodeVillage}
            setTextForVillage={setTextForVillage}
            onVillageChange={(setVillage, setVillageForm21)}
            yearChange={setRevenueYear}
          /> */}
        </Card>
        <Card>
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            <Table bordered scroll={{ x: 100 }} dataSource={villageForm21} columns={columns} />
          </Col>
        </Card>
        <Modal
          title={<FormattedMessage id="formLanguage.form.popForDelete" />}
          visible={modalForDelete}
          okText={<FormattedMessage id="formLanguage.form.yes" />}
          okType="danger"
          cancelText={<FormattedMessage id="formLanguage.form.no" />}
          onCancel={onCancelForDelete}
          onOk={deleteForm21Data}
        ></Modal>
        <Modal
          width={1000}
          visible={isModalVisible}
          okText={okText}
          onCancel={handleCancelForModal}
          onOk={editForm21}
        >
          <Form layout="vertical" form={form}>
            <Card>
              <Divider orientation="left">
                <FormattedMessage id="formLanguage.form.echawdi" />
              </Divider>
              <Row>
                <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                  <Form.Item
                    label={<FormattedMessage id="villageForm21.form.villageName" />}
                    name="villageName"
                    rules={[{ required: true, message: 'Field is necessary!' }]}
                  >
                    <Input
                      onKeyPress={KeyPressEvents.isInputVarchar}
                      max={50}
                      disabled={inputState}
                      defaultValue={dataInModal && dataInModal.villageName}
                      onChange={(e) => {
                        setDataInModal((preDataInModal) => ({
                          ...preDataInModal,
                          villageName: e.target.value,
                        }));
                      }}
                    />
                  </Form.Item>
                </Col>

                <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>

                <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                  <Form.Item
                    label={<FormattedMessage id="villageForm21.form.date" />}
                    name="diaryDate"
                    rules={[{ required: true, message: 'Field is necessary!' }]}
                  >
                    <DatePicker
                      disabled={inputState}
                      defaultValue={dataInModal && moment(dataInModal.diaryDate)}
                      onChange={(e) => {
                        setDataInModal((preDataInModal) => ({
                          ...preDataInModal,
                          diaryDate: moment(e).format('YYYY-MM-DD'),
                        }));
                      }}
                      onSelect={(e) => {
                        handleOnChangeDate(e);
                      }}
                    ></DatePicker>
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                  <Form.Item
                    label={<FormattedMessage id="villageForm21.form.day" />}
                    name="day"
                    rules={[{ required: true, message: 'Field is necessary!' }]}
                  >
                    <Input
                      onKeyPress={KeyPressEvents.isInputChar}
                      max={10}
                      disabled
                      defaultValue={dataInModal && dataInModal.day}
                      onChange={(e) => {
                        setDataInModal((preDataInModal) => ({
                          ...preDataInModal,
                          day: e.target.value,
                        }));
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>
                <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                  <Form.Item
                    label={<FormattedMessage id="formLanguage.table.remark" />}
                    name="remarks"
                    rules={[{ required: true, message: 'Remarks is necessary!' }]}
                  >
                    <Input
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
    </div>
  );
}

export default TableForm21;
