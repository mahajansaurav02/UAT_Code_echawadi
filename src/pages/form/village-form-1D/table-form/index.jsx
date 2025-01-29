import VillageSelector from '@/components/eComponents/VillageSelector';
import BaseURL from '@/URLs/urls';
import { DeleteOutlined, EditTwoTone, EyeTwoTone, SearchOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import {
  Alert,
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Table,
  Tooltip,
} from 'antd';
import Axios from 'axios';
import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import URLS from '@/URLs/urls';
import useAxios from '@/components/eComponents/use-axios';
import { FormattedMessage, useModel } from 'umi';
import KeyPressEvents from '@/util/KeyPressEvents';

function Table1B() {
  const { districtName, servarthId, districtCode, talukaCode } = useModel('details');
  const { sendRequest } = useAxios();
  const [codeVillage, setCodeVillage] = useState('');
  const [textForVillage, setTextForVillage] = useState();
  const [village, setVillage] = useState([]);
  const [surveyNumberValue, setSurveyNumberValue] = useState('');
  const [villageForm1DData, setVillageForm1DData] = useState([]);
  const [isNirank, setIsNirank] = useState(false);
  const [modalForDelete, setModalForDelete] = useState(false);
  const [recordId, setRecordId] = useState();
  const [dataInModal, setDataInModal] = useState();
  const [inputState, setInputState] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [okText, setOkText] = useState();
  const [ID, setID] = useState();
  const [pin, setPin] = useState();
  const [revenueYear, setRevenueYear] = useState();
  const [form] = Form.useForm();

  //const [form] = Form.useForm();
  let history = useHistory();

  const addForm = () => {
    history.push({
      pathname: `/form/village-form-1D/village-form`,
    });
  };

  const onCancelForDeleteModal = () => {
    setModalForDelete(false);
  };

  const deleteForm1DData = async () => {
    setModalForDelete(false);
    sendRequest(`${URLS.BaseURL}/form1d/discardForm1D?id=${recordId}`, 'DELETE', null, (res) => {
      // console.log('records are Deleted', res.data);
      if (res.status == 226) {
        setVillageForm1DData([]);
        message.success('Record Deleted !');
        getForm1DData();
      }
    });
  };
  const deleteRecord = (record) => {
    setRecordId(record.id);
    setModalForDelete(true);
  };

  const getForm1DData = async () => {
    setIsLoading(true);
    sendRequest(
      `${URLS.BaseURL}/form1d/getForm1DData?districtCode=${districtCode}&talukaCode=${talukaCode}&cCode=${codeVillage}&pin=${surveyNumberValue}`,
      'GET',
      null,
      (res) => {
        // console.log('get form1D', res.data);
        setVillageForm1DData(
          res.data.form1DData.map((row, index) => ({
            srNo: index + 1,
            id: row.id,
            surveyNo:
              row.hissaNo == null || row.hissaNo.trim() == ''
                ? row.pin
                : row.pin + '/' + row.hissaNo,
            surveyNumber: row.pin,
            hissaNo: row.hissaNo,
            remarks: row.remarks,
            totalAreaH: row.totalAreaH
              .substring(0, row.totalAreaH.length - 2)
              .concat('.')
              .concat(row.totalAreaH.substring(row.totalAreaH.length - 2)),
            assessment: row.assessment,
            irrigatedArea: row.irrigatedArea
              .substring(0, row.irrigatedArea.length - 2)
              .concat('.')
              .concat(row.irrigatedArea.substring(row.irrigatedArea.length - 2)),
            unirrigatedArea: row.unirrigatedArea
              .substring(0, row.unirrigatedArea.length - 2)
              .concat('.')
              .concat(row.unirrigatedArea.substring(row.unirrigatedArea.length - 2)),
            rules: row.rules,
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

  const showModalForEdit = (record) => {
    form.resetFields();
    setDataInModal({});
    setDataInModal({
      id: record.id,
      cCode: codeVillage,
      surveyNumber: record.surveyNumber,
      hissaNo: record.hissaNo,
      remarks: record.remarks,
      rules: record.rules,
      totalAreaH: record.totalAreaH,
      assessment: record.assessment,
      irrigatedArea: record.irrigatedArea,
      unirrigatedArea: record.unirrigatedArea,
    });
    setInputState(false);
    setIsModalVisible(true);
    setOkText('Save');
    setID(record.id);
    setPin(record.pin);
  };

  const showModalForView = (record) => {
    form.resetFields();
    setDataInModal({});
    setDataInModal({
      id: record.id,
      cCode: codeVillage,
      surveyNumber: record.surveyNumber,
      hissaNo: record.hissaNo,
      remarks: record.remarks,
      rules: record.rules,
      totalAreaH: record.totalAreaH,
      assessment: record.assessment,
      irrigatedArea: record.irrigatedArea,
      unirrigatedArea: record.unirrigatedArea,
    });
    setInputState(true);
    setIsModalVisible(true);
    setOkText('Okay');
  };

  const editForm1D = async () => {
    setConfirmLoading(true);

    const parametersForEdit = {
      revenueYear: revenueYear,
      districtCode: districtCode,
      talukaCode: talukaCode,
      cCode: codeVillage,

      id: ID,
      pin: dataInModal.surveyNumber,
      hissaNo: dataInModal.hissaNo,
      remarks: dataInModal.remarks,
      rules: dataInModal.rules,
      totalAreaH: dataInModal.totalAreaH,
      assessment: dataInModal.assessment,
      irrigatedArea: dataInModal.irrigatedArea,
      unirrigatedArea: dataInModal.unirrigatedArea,
    };
    // console.log('edit parameters', parametersForEdit);
    if (okText === 'Save') {
      // console.log(parametersForEdit);
      sendRequest(
        `${URLS.BaseURL}/form1d/editForm1D`,
        'POST',
        parametersForEdit,
        (res) => {
          if (res.status === 200) {
            message.success('Data Updated!');
            getForm1DData();
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

  const handleCancelForModal = () => {
    setIsModalVisible(false);
  };

  function handleChangeForSurveyNo(event) {
    setSurveyNumberValue(event.target.value);
    setVillageForm1DData('');
  }

  const columns = [
    {
      key: '1',
      title: <FormattedMessage id="formLanguage.form.serialNo" />,
      dataIndex: 'srNo',
    },
    {
      key: '2',
      title: <FormattedMessage id="formLanguage.table.surveyNo" />,
      dataIndex: 'surveyNo',
    },
    // {
    //   key: '3',
    //   title: <FormattedMessage id="formLanguage.form.hissaNo" />,
    //   dataIndex: 'hissaNo',
    // },
    {
      key: '3',
      title: <FormattedMessage id="formLanguage.form.Area" />,
      dataIndex: 'totalAreaH',
    },
    {
      key: '4',
      title: <FormattedMessage id="formLanguage.form.assessment" />,
      dataIndex: 'assessment',
    },
    {
      key: '5',
      title: <FormattedMessage id="formLanguage.form.irrigated" />,
      dataIndex: 'irrigatedArea',
    },
    {
      key: '6',
      title: <FormattedMessage id="formLanguage.form.unIrrigated" />,
      dataIndex: 'unirrigatedArea',
    },
    {
      key: '7',
      title: <FormattedMessage id="VillageForm1D.form.rules" />,
      dataIndex: 'rules',
    },
    {
      key: '8',
      title: <FormattedMessage id="VillageForm1D.form.remarks" />,
      dataIndex: 'remarks',
    },

    {
      key: '9',
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
                    माहिती भरा
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
                <Col>
                  <Button
                    onClick={() => showModalForEdit(record)}
                    style={{ backgroundColor: 'lightblue', color: 'black' }}
                  >
                    माहिती भरा
                  </Button>
                </Col>
              )}
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
          <h2>
            <center>
              <FormattedMessage id="formLanguage.form.villageForm1D" />
            </center>
          </h2>
          <h3>
            <center>
              <FormattedMessage id="formLanguage.form.registerShowingLand" />
            </center>
          </h3>
          {/* <Row>
            <Col span={21}></Col>
            <Col span={3}>
              <Button
                type="primary"
                style={{ marginBottom: '10px', marginTop: '5px' }}
                onClick={addForm}
              >
                <FormattedMessage id="formLanguage.button.add" />
              </Button>
            </Col>
          </Row> */}

          <VillageSelector
            pageType="withoutYear"
            setCodeVillage={setCodeVillage}
            setTextForVillage={setTextForVillage}
            onVillageChange={(setVillage, setVillageForm1DData)}
            yearChange={setRevenueYear}
            setIsNirank={setIsNirank}
          />

          <Row style={{ marginTop: 10 }}>
            <Col xl={8} lg={11} md={20} sm={19} xs={17}>
              <Input
                onKeyPress={KeyPressEvents.isInputNumber}
                maxLength={7}
                onChange={handleChangeForSurveyNo}
                addonBefore={<FormattedMessage id="formLanguage.table.surveyNo" />}
              />
            </Col>
            <Col lg={1} md={1} sm={1} xs={1}></Col>

            <Col xl={4} lg={2} md={2} sm={2} xs={1}>
              <Tooltip title="search">
                {!isNirank && (
                  <Button
                    type="primary"
                    onClick={() => {
                      if (textForVillage) {
                        getForm1DData();
                      } else if (textForVillage == null) {
                        message.info('Please Select Village');
                      }
                    }}
                    //icon={<SearchOutlined />}
                  >
                    <FormattedMessage id="formLanguage.button.search" />
                  </Button>
                )}
              </Tooltip>
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
                loading={isLoading}
                dataSource={villageForm1DData}
                columns={columns}
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
          onOk={deleteForm1DData}
        ></Modal>

        <Card>
          <Modal
            width={1000}
            title="Edit/View Record"
            visible={isModalVisible}
            okText={okText}
            onCancel={handleCancelForModal}
            onOk={editForm1D}
            confirmLoading={confirmLoading}
          >
            <Form layout="vertical" form={form}>
              <Row>
                <Col xl={13} lg={13} md={13} sm={24} xs={24}>
                  <Form.Item
                    name="rules"
                    rules={[{ required: true, message: 'This Field Is Required..' }]}
                    label={<FormattedMessage id="VillageForm1D.form.rules" />}
                  >
                    <Select
                      disabled={inputState}
                      defaultValue={dataInModal && dataInModal.rules}
                      onChange={(e) => {
                        setDataInModal((preDataInModal) => ({
                          ...preDataInModal,
                          rules: e,
                        }));
                      }}
                    >
                      <Select.Option value="कुळवहिवाट कायदा">
                        <FormattedMessage id="VillageForm1D.form.kulvahivat" />
                      </Select.Option>
                      <Select.Option value="महाराष्ट्र शेतजमीन (जमीनधारणेची कमाल मर्यादा) अधिनियम,१९६१">
                        <FormattedMessage id="VillageForm1D.form.mhAgriCeiling" />
                      </Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xl={1} lg={1} md={1} sm={24} xs={24}></Col>
                <Col xl={10} lg={10} md={10} sm={24} xs={24}>
                  <Form.Item
                    name="remarks"
                    label={<FormattedMessage id="VillageForm1D.form.remarks" />}
                  >
                    <Input.TextArea
                      onKeyPress={KeyPressEvents.isInputChar}
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
            </Form>
          </Modal>
        </Card>
      </PageContainer>
    </>
  );
}

export default Table1B;
