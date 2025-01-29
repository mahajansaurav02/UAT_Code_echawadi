import { PageContainer } from '@ant-design/pro-layout';
import {
  Button,
  Card,
  Col,
  Input,
  message,
  Modal,
  Row,
  Table,
  Form,
  DatePicker,
  Alert,
} from 'antd';
import React from 'react';
import { useState } from 'react';
import VillageSelector from '@/components/eComponents/VillageSelector';
import { DeleteOutlined, EditTwoTone, EyeTwoTone } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import useAxios from '@/components/eComponents/use-axios';
import URLS from '@/URLs/urls';
import { FormattedMessage, useModel } from 'umi';
import moment from 'moment';
import KeyPressEvents from '@/util/KeyPressEvents';

function Table6D() {
  const { districtCode, talukaCode } = useModel('details');
  const [surveyNumberValue, setSurveyNumberValue] = useState();
  const { sendRequest } = useAxios();
  const [codeVillage, setCodeVillage] = useState('');
  const [textForVillage, setTextForVillage] = useState();
  const [isNirank, setIsNirank] = useState(false);

  const [village, setVillage] = useState([]);
  const [form6Ddata, setForm6Ddata] = useState([]);
  const [pin, setPin] = useState();
  const [dataInModal, setDataInModal] = useState();
  const [modalForDelete, setModalForDelete] = useState(false);
  const [recordId, setRecordId] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [inputState, setInputState] = useState();
  const [okText, setOkText] = useState();
  const [ID, setID] = useState();
  const [revenueYear, setRevenueYear] = useState();
  const [form] = Form.useForm();
  let history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const columns = [
    {
      key: '1',
      title: <FormattedMessage id="formLanguage.form.serialNo" />,
      dataIndex: 'srNo',
    },
    {
      key: '2',
      title: <FormattedMessage id="formLanguage.label.mutationEntryInVillageForm6" />,
      dataIndex: 'mutationEntryInVillageForm6',
    },

    {
      key: '3',
      title: <FormattedMessage id="formLanguage.form.surveyNoOrsubDivisionNo" />,
      dataIndex: 'surveyNo',
    },

    {
      key: '4',
      title: <FormattedMessage id="formLanguage.form.natureOfChangeRequiredInMap" />,
      dataIndex: 'natureOfChangeInMap',
    },
    {
      key: '5',
      title: <FormattedMessage id="formLanguage.form.byWhomDone" />,
      dataIndex: 'byWhomDone',
    },
    {
      key: '6',
      title: <FormattedMessage id="formLanguage.form.date" />,
      dataIndex: 'dateOfChange',
    },
    {
      key: '7',
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

  const showForm6D = async () => {
    setIsLoading(true);

    sendRequest(
      `${URLS.BaseURL}/form6D/getForm6DData?districtCode=${districtCode}&talukaCode=${talukaCode}&cCode=${codeVillage}&pin=${surveyNumberValue}`,
      'GET',
      null,
      (res) => {
        // console.log('Full response for ShowForm6D ', res);
        setForm6Ddata(
          res.data.form6DData.map((r, i) => ({
            srNo: i + 1,
            id: r.id,
            mutationEntryInVillageForm6: r.mutationEntryInVillageForm6,
            pin: r.pin,
            hissaNo: r.hissaNo,
            surveyNo: r.hissaNo == null || r.hissaNo.trim() == '' ? r.pin : r.pin + '/' + r.hissaNo,
            surveyNoOrSubDivisionNo: r.surveyNoOrSubDivisionNo,
            natureOfChangeInMap: r.natureOfChangeInMap,
            byWhomDone: r.byWhomDone,
            dateOfChange:
              r.dateOfChange != null
                ? moment(r.dateOfChange, 'YYYY-MM-DD').format('YYYY-MM-DD')
                : null,
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
    form.resetFields();
    setDataInModal({
      id: record.id,
      cCode: codeVillage,
      pin: record.pin,
      hissaNo: record.hissaNo,
      surveyNoOrSubDivisionNo: record.surveyNoOrSubDivisionNo,
      mutationEntryInVillageForm6: record.mutationEntryInVillageForm6,
      natureOfChangeInMap: record.natureOfChangeInMap,
      byWhomDone: record.byWhomDone,
      dateOfChange: record.dateOfChange,
    });
    setInputState(false);
    setIsModalVisible(true);
    setOkText('Save');
    setID(record.id);
  };

  const editForm6D = async () => {
    setConfirmLoading(true);

    let dateOfChangeI =
      form.getFieldValue('dateOfChange') && form.getFieldValue('dateOfChange') !== 'Invalid date'
        ? moment(form.getFieldValue('dateOfChange'), 'DD/MM/YYYY').format('YYYY-MM-DD')
        : null;

    if (!dateOfChangeI) {
      if (dataInModal.dateOfChange && dataInModal.dateOfChange !== 'Invalid date') {
        dateOfChangeI = moment(dataInModal.dateOfChange).format('YYYY-MM-DD');
      }
    }

    const parametersForEdit = {
      id: ID,
      districtCode: districtCode,
      talukaCode: talukaCode,
      cCode: codeVillage,
      pin: dataInModal.pin,
      hissaNo: dataInModal.hissaNo,
      surveyNoOrSubDivisionNo: dataInModal.surveyNoOrSubDivisionNo,
      mutationEntryInVillageForm6: dataInModal.mutationEntryInVillageForm6,
      natureOfChangeInMap: dataInModal.natureOfChangeInMap,
      byWhomDone: dataInModal.byWhomDone,
      dateOfChange: dateOfChangeI,
    };

    if (okText === 'Save') {
      // console.log(parametersForEdit);
      sendRequest(
        `${URLS.BaseURL}/form6D/editForm6D`,
        'PUT',
        parametersForEdit,
        (res) => {
          if (res.status === 200) {
            message.success('Record Updated!');
            showForm6D();
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

  const showModalForView = (record) => {
    form.resetFields();
    setDataInModal({
      id: record.id,
      surveyNoOrSubDivisionNo: record.surveyNoOrSubDivisionNo,
      cCode: codeVillage,
      pin: record.pin,
      hissaNo: record.hissaNo,
      mutationEntryInVillageForm6: record.mutationEntryInVillageForm6,
      natureOfChangeInMap: record.natureOfChangeInMap,
      byWhomDone: record.byWhomDone,
      dateOfChange: record.dateOfChange,
    });

    setInputState(true);
    setIsModalVisible(true);
    setOkText('Okay');
  };

  const onCancelForDeleteModal = () => {
    setModalForDelete(false);
  };

  const deleteRecordById = (record) => {
    setRecordId(record.id);
    setModalForDelete(true);
  };

  const deleteRecord = async (record) => {
    setModalForDelete(false);
    sendRequest(`${URLS.BaseURL}/form6D/discardForm6D?id=${recordId}`, 'DELETE', null, (res) => {
      if (res.status === 226) {
        message.success('Record Deleted!');
        setForm6Ddata([]);
        showForm6D();
      }
    });
  };

  function handleChangeForSurveyNo(event) {
    setSurveyNumberValue(event.target.value);
    setForm6Ddata('');
    // console.log(event.target.value);
  }
  const handleCancelForModal = () => {
    setIsModalVisible(false);
  };

  const pushToVillageForm = () => {
    history.push({
      pathname: `/form/village-form-6D/village-form`,
    });
  };

  return (
    <>
      <PageContainer>
        <Card>
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
          <h2 style={{ marginBottom: '30px' }}>
            <center>
              <FormattedMessage id="formLanguage.label.villageForm6DD" />
              <br />
            </center>
          </h2>

          <Col span={24}>
            <VillageSelector
              pageType="withoutYear"
              setCodeVillage={setCodeVillage}
              setTextForVillage={setTextForVillage}
              onVillageChange={(setVillage, setForm6Ddata)}
              yearChange={setRevenueYear}
              setIsNirank={setIsNirank}
            />
          </Col>

          {/* newRow */}
          <Row style={{ marginTop: '20px' }}>
            <Col xl={7} lg={8} md={20} sm={19} xs={19}>
              <Form.Item
                labelCol={{ xl: 10, lg: 13 }}
                wrapperCol={{ xl: 13, lg: 10, xs: 10 }}
                label={<FormattedMessage id="formLanguage.table.surveyNo" />}
                name="surveyNumber"
                rules={[{ required: true, message: 'सर्वेक्षण क्रमांक आवश्यक आहे!' }]}
                // style={{ marginLeft: '9px' }}
              >
                <Input
                  style={{ marginLeft: 5 }}
                  maxLength={7}
                  onChange={handleChangeForSurveyNo}
                  onKeyPress={KeyPressEvents.isInputNumber}
                />
              </Form.Item>
            </Col>

            <Col xl={1} lg={1} md={1} sm={1}></Col>
            <Col xl={1} lg={1} md={2} sm={1} xs={1}>
              {!isNirank && (
                <Button
                  onClick={() => {
                    if (textForVillage && surveyNumberValue) {
                      showForm6D();
                    } else if (textForVillage == null) {
                      message.info('Please Select Village !');
                    } else if (surveyNumberValue == null) {
                      message.info('Please Enter Survey Number !');
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
                dataSource={form6Ddata}
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
          onCancel={onCancelForDeleteModal}
          onOk={deleteRecord}
        ></Modal>

        <Modal
          width={1000}
          title={<FormattedMessage id="formLanguage.form.saveEdit" />}
          visible={isModalVisible}
          okText={okText}
          onOk={editForm6D}
          onCancel={handleCancelForModal}
          confirmLoading={confirmLoading}
        >
          <Form layout="vertical" form={form}>
            <Card>
              <Row>
                <Col span={11}>
                  <Form.Item
                    label={<FormattedMessage id="formLanguage.form.natureOfChangeRequiredInMap" />}
                    name="natureOfChangeInMap"
                    rules={[
                      {
                        required: true,
                        message: 'Nature of Change Required in Map is necessary !',
                      },
                    ]}
                  >
                    <Input
                      maxLength={50}
                      disabled={inputState}
                      defaultValue={dataInModal && dataInModal.natureOfChangeInMap}
                      onChange={(e) => {
                        setDataInModal((prevDataInModal) => ({
                          ...prevDataInModal,
                          natureOfChangeInMap: e.target.value,
                        }));
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col span={2}></Col>
                <Col span={11}>
                  <Form.Item
                    label={<FormattedMessage id="formLanguage.form.byWhomDone" />}
                    name="byWhomDone"
                  >
                    <Input
                      maxLength={50}
                      disabled={inputState}
                      defaultValue={dataInModal && dataInModal.byWhomDone}
                      onChange={(e) => {
                        setDataInModal((prevDataInModal) => ({
                          ...prevDataInModal,
                          byWhomDone: e.target.value,
                        }));
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row style={{ marginTop: 20 }}>
                {dataInModal && dataInModal.dateOfChange === null ? (
                  <Form.Item
                    label={<FormattedMessage id="formLanguage.form.date" />}
                    name="dateOfChange"
                  >
                    <DatePicker style={{ width: 400 }} disabled={inputState} />
                  </Form.Item>
                ) : (
                  <Form.Item
                    label={<FormattedMessage id="formLanguage.form.date" />}
                    name="dateOfChange"
                  >
                    <DatePicker
                      style={{ width: 400 }}
                      disabled={inputState}
                      defaultValue={dataInModal && moment(dataInModal.dateOfChange)}
                      onChange={(e) => {
                        setDataInModal((prevDataInModal) => ({
                          ...prevDataInModal,
                          dateOfChange: moment(e).format('YYYY-MM-DD'),
                        }));
                      }}
                    />
                  </Form.Item>
                )}
              </Row>
            </Card>
          </Form>
        </Modal>
      </PageContainer>
    </>
  );
}
export default Table6D;
