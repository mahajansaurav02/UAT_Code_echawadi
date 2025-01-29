import React, { useRef, useState } from 'react';
import moment from 'moment';

import { useHistory } from 'react-router-dom';
import {
  DatePicker,
  Input,
  Form,
  Card,
  Result,
  Button,
  Descriptions,
  Divider,
  Alert,
  Statistic,
  Table,
  Col,
  Row,
  Tooltip,
  Modal,
  message,
  Select,
} from 'antd';
import { PageContainer } from '@ant-design/pro-layout';

import ESelector from '@/components/eComponents/ESelector';
import URLS from '@/URLs/urls';
import Axios from 'axios';
import useAxios from '@/components/eComponents/use-axios';
import { EditTwoTone, DeleteOutlined, EyeTwoTone } from '@ant-design/icons';

import { FormattedMessage, useModel } from 'umi';
import { SearchOutlined } from '@ant-design/icons';
import KeyPressEvents from '@/util/KeyPressEvents';
import VillageSelector from '@/components/eComponents/VillageSelector';

//for table############

function StepForm() {
  const { districtName, servarthId, districtCode, talukaCode } = useModel('details');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [okText, setOkText] = useState();
  const [dataInModal, setDataInModal] = useState();
  const [pin, setPin] = useState();
  const [villageForm7A, setVillageForm7A] = useState([]);
  const { sendRequest } = useAxios();
  const [codeVillage, setCodeVillage] = useState('');

  let history = useHistory();
  const [inputState, setInputState] = useState();
  const [ID, setID] = useState();
  const [form] = Form.useForm();
  const [hissaNumberValue, setHissaNumberValue] = useState([]);
  const [recordId, setRecordId] = useState();
  const [modalForDelete, setModalForDelete] = useState(false);
  const [surveyNumberValue, setSurveyNumberValue] = useState();
  const [textForVillage, setTextForVillage] = useState();
  const [village, setVillage] = useState([]);
  const [revenueYear, setRevenueYear] = useState();
  const [isNirank, setIsNirank] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleCancelForModal = () => {
    setIsModalVisible(false);
  };

  const handleChangeForSurveyNoV = (event) => {
    // props.setShowArea(false);
    // props.allDataV(textForVillage, revenueYear, true);
    selectorForm.resetFields();
    setFlagButton(false);
    setFlagButton2(false);
    setSurveyNumberValue(event.target.value);
    setRevenueYear(revenueYear);
    // console.log('year in selector', revenueYear);
  };

  function handleChangeForHissaNo(event) {
    setHissaNumberValue(event);
    // props.allData(true, surveyNumberValue, event, codeVillage);
  }

  const editForm7A = async () => {
    setConfirmLoading(true);
    const parameterForEdit = {
      districtCode: districtCode,
      talukaCode: talukaCode,
      cCode: codeVillage,
      pin: dataInModal.pin,
      hissaNo: dataInModal.hissaNo,
      id: ID,
      area: dataInModal.area,
      lastYearSerialNo: dataInModal.lastYearSerialNo,
      nameOfTenant: dataInModal.nameOfTenant,
      rent: dataInModal.rent,
      serialNoInMutationReg: dataInModal.serialNoInMutationReg,
      remarks: dataInModal.remarks,
    };

    if (okText === 'Save') {
      // console.log('parameters for edit', parameterForEdit);
      sendRequest(
        `${URLS.BaseURL}/form7a/editForm7A`,
        'PUT',
        parameterForEdit,
        (res) => {
          if (res.status === 200) {
            message.success('Data Updated!');
            getVillageForm7AData();
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
      // console.log('set to false');
      setIsModalVisible(false);
      setConfirmLoading(false);
    }
  };

  const showModalForEdit = (record) => {
    // console.log('record==>', record);
    form.resetFields();
    setDataInModal({});
    setDataInModal({
      id: record.id,
      pin: record.pin,
      cCode: codeVillage,
      hissaNo: record.hissaNo,
      area: record.area,
      lastYearSerialNo: record.lastYearSerialNo,
      nameOfTenant: record.nameOfTenant,
      rent: record.rent,
      serialNoInMutationReg: record.serialNoInMutationReg,
      remarks: record.remarks,
    });

    setInputState(false);
    // console.log('Data in DataInModal state==>', record);
    setIsModalVisible(true);
    setOkText('Save');
    setID(record.id);
  };

  const showModalForView = (record) => {
    form.resetFields();
    setDataInModal({});
    setDataInModal({
      id: record.id,
      pin: record.pin,
      hissaNo: record.hissaNo,
      cCode: codeVillage,
      area: record.area,
      lastYearSerialNo: record.lastYearSerialNo,
      nameOfTenant: record.nameOfTenant,
      rent: record.rent,
      serialNoInMutationReg: record.serialNoInMutationReg,
      remarks: record.remarks,
    });
    setInputState(true);
    setIsModalVisible(true);
    setOkText('Okay');
  };
  const onCancelForDelete = () => {
    setModalForDelete(false);
  };
  const deleteRecord = (record) => {
    setRecordId(record.id);
    setModalForDelete(true);
  };

  const deleteForm7AData = async (record) => {
    setModalForDelete(false);
    // 203.129.224.92:8089/echawdi/api/form7a/discardForm7A
    sendRequest(`${URLS.BaseURL}/form7a/discardForm7A?id=${recordId}`, 'DELETE', null, (res) => {
      if (res.status == 226) {
        message.success('Record Deleted !');
        setVillageForm7A([]);
        getVillageForm7AData();
      }
    });
  };

  const getHissaFromSurvey = async () => {
    sendRequest(
      `${URLS.BaseURL}/restservice/getHissaByVillageAndSurveyNo?districtCode=${districtCode}&talukaCode=${talukaCode}&cCode=${codeVillage}&pin=${surveyNumberValue}&marked=Y`,
      'GET',
      null,
      (response) => {
        // console.log('this is the suvery number being sent to api on click', surveyNumberValue);
        // console.log('--test data--' + response.data.map((r) => r.hissaNo));
        const mapper = response.data.map((row) => {
          if (row.hissaNo === '') {
            console.log('Emty hissa Found');
          }
        });
        // console.log('mapper', mapper);
        const hissArr = response.data.map((row) => ({
          label: row.hissaNo == '' ? 'Empty Hissa' : row.hissaNo,
          value: row.hissaNo,
        }));
        // test = hissArr.map((e) => e.map((f) => (f ? f : { value: '' })));

        //console.log('mapper', test);
        if (hissArr.length > 1) {
          setShowGetDataButton(false);
          setShowArea(false);
        } else {
          setShowGetDataButton(true);
        }
        setShowHissaNumberInput(true);
        setHissaNumber(hissArr);
      },
    );
  };

  const getVillageForm7AData = async () => {
    setVillageForm7A();
    setIsLoading(true);

    sendRequest(
      `${URLS.BaseURL}/form7a/getForm7AData?districtCode=${districtCode}&talukaCode=${talukaCode}&cCode=${codeVillage}&pin=${surveyNumberValue}`,
      'GET',
      null,
      (res) => {
        // console.log('Full res for form1AData', res.data.form7AData);
        setVillageForm7A(
          res.data.form7AData.map((row, index) => ({
            id: row.id,
            srNo: index + 1,
            lastYearSerialNo: row.lastYearSerialNo,
            khataNo: row.khataNo,
            nameOfTenant: row.nameOfTenant,
            landlordName: row.landlordName,
            area: row.area,
            TotalArea: row.TotalArea.substring(0, row.TotalArea.length - 2)
              .concat('.')
              .concat(row.TotalArea.substring(row.TotalArea.length - 2)),
            assessment: row.assessment,
            pin: row.pin,
            hissaNo: row.hissaNo,
            surveyNo:
              row.hissaNo == null || row.hissaNo.trim() == ''
                ? row.pin
                : row.pin + '/' + row.hissaNo,
            rent: row.rent,
            serialNoInMutationReg: row.serialNoInMutationReg,
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
  const handleChangeForSurveyNoT = (event) => {
    setSurveyNumberValue(event.target.value);
    setVillageForm7A();
  };

  const addForm7A = () => {
    history.push({
      pathname: `/form/village-form-7a/village-form`,
      state: {
        pageMode: 'Add',
      },
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
      title: <FormattedMessage id="villageForm.form.serialNumber" />,
      dataIndex: 'lastYearSerialNo',
    },
    {
      key: '3',
      title: <FormattedMessage id="villageForm.form.nameOfTenant" />,

      dataIndex: 'nameOfTenant',
    },
    {
      key: '4',
      title: <FormattedMessage id="formLanguage.button.khataNo" />,

      dataIndex: 'khataNo',
    },
    {
      key: '5',
      title: <FormattedMessage id="villageForm.form.nameLandlord" />,

      dataIndex: 'landlordName',
    },
    {
      key: '6',
      title: <FormattedMessage id="formLanguage.table.surveyNo" />,
      dataIndex: 'surveyNo',
    },
    // {
    //   title: <FormattedMessage id="formLanguage.form.hissaNo" />,
    //   dataIndex: 'hissaNo',
    // },
    {
      key: '7',
      title: <FormattedMessage id="formLanguage.table.totalArea" />,
      dataIndex: 'TotalArea',
    },
    {
      key: '8',
      title: <FormattedMessage id="villageForm.form.area" />,
      dataIndex: 'area',
    },
    {
      key: '9',
      title: <FormattedMessage id="villageForm.form.assessement" />,
      dataIndex: 'assessment',
    },
    {
      key: '10',
      title: <FormattedMessage id="villageForm.form.rent" />,

      dataIndex: 'rent',
    },
    {
      key: '11',
      title: <FormattedMessage id="villageForm.form.srlNoOfEntry" />,

      dataIndex: 'serialNoInMutationReg',
    },
    {
      key: '12',
      title: <FormattedMessage id="formLanguage.table.remark" />,

      dataIndex: 'remarks',
    },

    {
      key: '12',
      title: <FormattedMessage id="formLanguage.table.action" />,
      width: '120px',

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
    <PageContainer>
      <Card>
        <Row>
          <Col xl={10} lg={10} md={10} sm={10} xs={10}></Col>

          <Col xl={12} lg={12} md={12} sm={12} xs={12}>
            <h1>{<FormattedMessage id="villageForm.form.registerOfTenancies" />}</h1>
          </Col>

          <Col xl={2} lg={2} md={2} sm={2} xs={2}>
            {!isNirank && (
              <Button style={{ float: 'right' }} onClick={addForm7A} type="primary">
                {<FormattedMessage id="formLanguage.button.add" />}
              </Button>
            )}
          </Col>
        </Row>

        <>
          <Col xl={24}>
            <VillageSelector
              pageType="withoutYear"
              setCodeVillage={setCodeVillage}
              setTextForVillage={setTextForVillage}
              onVillageChange={(setVillage, setVillageForm7A)}
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
                    if (surveyNumberValue && codeVillage) {
                      getVillageForm7AData();
                    } else if (!codeVillage) {
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
      <Card>
        <Col xl={24} lg={24} md={24} sm={24} xs={24}>
          {!isNirank && (
            <Table
              bordered
              scroll={{ x: 100 }}
              columns={columns}
              dataSource={villageForm7A}
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
        onOk={deleteForm7AData}
      ></Modal>

      <Modal
        width={900}
        title={<FormattedMessage id="villageForm1A.table.editRecords" />}
        visible={isModalVisible}
        okText={okText}
        onCancel={handleCancelForModal}
        onOk={editForm7A}
        confirmLoading={confirmLoading}
      >
        <Form
          form={form}
          layout="vertical"
          // onFinish={editForm7A}
        >
          <Row>
            <Col xl={11} lg={7} md={7} sm={7} xs={24}>
              <Form.Item
                rules={[
                  { required: true, message: 'This Field Is Required..' },
                  { max: 50, message: 'This field shoud be below 50 characters' },
                ]}
                name={'lastYearSerialNo'}
                label={<FormattedMessage id="villageForm.form.serialNumber" />}
              >
                <Input
                  onKeyPress={KeyPressEvents.isInputVarchar}
                  maxLength={51}
                  disabled={inputState}
                  defaultValue={dataInModal && dataInModal.lastYearSerialNo}
                  onChange={(e) => {
                    setDataInModal((preDataInModal) => ({
                      ...preDataInModal,
                      lastYearSerialNo: e.target.value,
                    }));
                  }}
                />
              </Form.Item>
            </Col>
            <Col xl={2} lg={1} md={1} sm={1}></Col>
            <Col xl={11} lg={7} md={7} sm={7} xs={24}>
              <Form.Item
                rules={[
                  { required: true, message: 'This Field Is Required..' },
                  { max: 50, message: 'This field shoud be below 50 characters' },
                ]}
                name={'nameOfTenant'}
                label={<FormattedMessage id="villageForm.form.nameOfTenant" />}
              >
                <Input
                  onKeyPress={KeyPressEvents.isInputVarchar}
                  maxLength={51}
                  disabled={inputState}
                  defaultValue={dataInModal && dataInModal.nameOfTenant}
                  onChange={(e) => {
                    setDataInModal((preDataInModal) => ({
                      ...preDataInModal,
                      nameOfTenant: e.target.value,
                    }));
                  }}
                />
              </Form.Item>
            </Col>
            <Col xl={1} lg={1} md={1} sm={1}></Col>
          </Row>
          <Row>
            <Col xl={11} lg={11} md={11} sm={24} xs={24}>
              <Form.Item
                rules={[
                  { required: true, message: 'This Field Is Required..' },
                  { max: 50, message: 'This field shoud be below 50 characters' },
                ]}
                name={'rent'}
                label={<FormattedMessage id="villageForm.form.rent" />}
              >
                <Input
                  onKeyPress={KeyPressEvents.isInputVarchar}
                  maxLength={51}
                  disabled={inputState}
                  defaultValue={dataInModal && dataInModal.rent}
                  onChange={(e) => {
                    setDataInModal((preDataInModal) => ({
                      ...preDataInModal,
                      rent: e.target.value,
                    }));
                  }}
                />
              </Form.Item>
            </Col>
            <Col xl={2} lg={2} md={2}></Col>
            <Col xl={11} lg={11} md={11} sm={24} xs={24}>
              <Form.Item
                rules={[
                  { required: true, message: 'This Field Is Required..' },
                  { max: 50, message: 'This field shoud be below 50 characters' },
                ]}
                name={'serialNoInMutationReg'}
                label={<FormattedMessage id="villageForm.form.srlNoOfEntry" />}
              >
                <Input
                  onKeyPress={KeyPressEvents.isInputVarchar}
                  maxLength={51}
                  disabled={inputState}
                  defaultValue={dataInModal && dataInModal.serialNoInMutationReg}
                  onChange={(e) => {
                    setDataInModal((preDataInModal) => ({
                      ...preDataInModal,
                      serialNoInMutationReg: e.target.value,
                    }));
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            {/* <Col xl={1} lg={1} md={1} sm={1}></Col> */}

            {/* <Col xl={1} lg={1} md={1} sm={1}></Col> */}
            <Col xl={11} lg={11} md={11} sm={24} xs={24}>
              <Form.Item
                rules={[
                  { required: true, message: 'This Field Is Required..' },
                  { max: 50, message: 'This field shoud be below 18 numbers' },
                ]}
                name={'area'}
                label={<FormattedMessage id="villageForm.form.area" />}
              >
                <Input
                  onKeyPress={KeyPressEvents.isInputVarchar}
                  maxLength={51}
                  disabled={inputState}
                  defaultValue={dataInModal && dataInModal.area}
                  onChange={(e) => {
                    setDataInModal((preDataInModal) => ({
                      ...preDataInModal,
                      area: e.target.value,
                    }));
                  }}
                />
              </Form.Item>
            </Col>
            <Col xl={2} lg={2} md={2}></Col>
            <Col xl={11} lg={11} md={11} sm={24} xs={24}>
              <Form.Item
                rules={[
                  { required: true, message: 'This Field Is Required..' },
                  { max: 25, message: 'This field shoud be below 25 characters' },
                ]}
                name={'remarks'}
                label={<FormattedMessage id="form15.remarks" />}
              >
                <Input.TextArea
                  onKeyPress={KeyPressEvents.isInputVarchar}
                  maxLength={26}
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

export default StepForm;
