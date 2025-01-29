import { PageContainer } from '@ant-design/pro-layout';
import {
  Card,
  Row,
  Col,
  Select,
  Form,
  Input,
  Button,
  Divider,
  Popconfirm,
  message,
  DatePicker,
  Alert,
} from 'antd';
import React from 'react';
import { useState, useEffect } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import VillageSelector from '@/components/eComponents/VillageSelector';
import URLS from '@/URLs/urls';
import useAxios from '@/components/eComponents/use-axios';
import { useHistory } from 'react-router-dom';
import { FormattedMessage, useModel } from 'umi';
import KeyPressEvents from '@/util/KeyPressEvents';
import moment from 'moment';
import axios from 'axios';

function form6B() {
  useEffect(() => {
    getDataVillage();
  }, []);

  const { sendRequest } = useAxios();
  const echHost = localStorage.getItem('echHost');
  const mhrHost = localStorage.getItem('mhrHost');
  const echDbName = localStorage.getItem('echDbName');
  const echSchemaName = localStorage.getItem('echSchemaName');
  const mhrDbName = localStorage.getItem('mhrDbName');
  const mhrSchemaName = localStorage.getItem('mhrSchemaName');
  const { districtName, servarthId, districtCode, talukaName, talukaCode } = useModel('details');
  const [form6B] = Form.useForm();
  const [villageForm] = Form.useForm();
  const [showAreaAndAssessment, setShowAreaAndAssessment] = useState(false);
  const [codeVillage, setCodeVillage] = useState('');
  const [textForVillage, setTextForVillage] = useState();
  const [textVillage, setTextVillage] = useState('');
  const [buttonFlag, setButtonFlag] = useState(true);
  const [flagButton, setFlagButton] = useState(true);
  const [flagButton2, setFlagButton2] = useState(true);
  const [showGetDataButton, setShowGetDataButton] = useState(false);
  const [surveyNumberValue, setSurveyNumberValue] = useState();
  const [hissaNumber, setHissaNumber] = useState([]);
  const [hissaNumberValue, setHissaNumberValue] = useState([]);
  const [showAreaInput, setshowAreaInput] = useState(false);
  const [area, setArea] = useState();
  const [assessment, setAssessment] = useState();
  const [showHissaNumberInput, setShowHissaNumberInput] = useState(false);
  let history = useHistory();
  const [revenueYear, setRevenueYear] = useState();
  const [isNirank, setIsNirank] = useState(false);

  const [requiredHissa, setRequiredHissa] = useState(false);
  const { token } = useModel('Auth');
  const Header = `Bearer ${token}`;
  const [form6Eferfar] = Form.useForm();
  const [nameOfAcquire] = Form.useForm();
  const [khataDetails] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchLoading2, setSearchLoading2] = useState(false);

  const [showEnteryInVillage, setShowValueEntryInVillage] = useState(false);
  const [entryVillage, setEntryInVillage] = useState();
  // const[  setEntryInVillage,newSetEntryInVIllage ] = useState();
  const [flagInput, setFlagInput] = useState(true);
  const [nameofDocument, setNameOfDocument] = useState();
  const [nameOfAcquirerOfRight, setnameOfAcquirerOfRight] = useState();
  const [khataNoValue, setkhataNoValue] = useState();
  const [receiptNo, setReceiptNo] = useState();
  const [receiptNoValue, setReceiptNoValue] = useState();
  const [receiptDate, setReceiptDate] = useState();
  const [receiptDateValue, setReceiptDateValue] = useState();

  const onFinishFailed = ({ values, errorFields, outOfDate }) => {
    // console.log('Finish Failed called', values, errorFields, outOfDate);
  };
  const [village, setVillage] = useState([]);

  const getDocument = async () => {
    setSearchLoading(true);
    sendRequest(
      `${URLS.BaseURL}/form6B/getForm6BEferfarDetails?districtCode=${districtCode}&talukaCode=${talukaCode}&cCode=${codeVillage}&entryVillageForm6=${entryVillage}`,
      'GET',
      null,
      (response) => {
        setNameOfDocument(
          response.data.map((row) => ({
            label: row.nameOfAcquirerOfRight,
            value: row.nameOfAcquirerOfRight,
          })),
        );
        if (response.status === 200) {
          message.info('Please Select Name Of Acquirer Of Right or Holder Of Document');
          setSearchLoading(false);
        }
      },
      (err) => {
        setSearchLoading(false);
      },
    );
  };

  const getDataVillage = async () => {
    await axios
      .get(`${URLS.BaseURL}/restservice/getVillageListByUser?username=${servarthId}`, {
        headers: {
          Authorization: Header,
          echHost: echHost,
          mhrHost: mhrHost,
          echDbName: echDbName,
          echSchemaName: echSchemaName,
          mhrDbName: mhrDbName,
          mhrSchemaName: mhrSchemaName,
        },
      })
      .then((res) => {
        setVillage(
          res.data.map((row) => ({
            label: row.villageName,
            value: row.cCode,
          })),
        );
      });
  };

  const handleOnChangeForNameOfAcquierHolder = (e) => {
    setnameOfAcquirerOfRight(e);
    setNameOfDocument('');
    // console.log('setnameOfAcquirerOfRight', e);
  };

  const handleOnChangeForReceiptNo = (value) => {
    setReceiptNoValue();
    setReceiptDateValue(receiptDate.find((obj) => obj.key === value).value.receiptDate);
    // let test = moment(receiptDate.find((obj) => obj.key === value).value.receiptDate);
    // console.log(test);
    khataDetails.setFieldsValue({
      receiptDate: moment(receiptDate.find((obj) => obj.key === value).value.receiptDate),
      //   .format(
      //   'YYYY-MM-DD',
      // ),
    });
  };

  const handleOnChange = (value, event) => {
    // setShowValueEntryInVillage(true);
    setEntryInVillage('');
    form6Eferfar.resetFields();
    setCodeVillage(value);
    setFlagInput(false);
    setTextForVillage();
  };

  function handleChangeForKhataNo(event) {
    setkhataNoValue(event.target.value);
  }

  function cancel(e) {
    message.error('request cancelled !!!');
  }

  const resetFrom = () => {
    form6B.resetFields();
    form6Eferfar.resetFields();
    villageForm.resetFields();
    nameOfAcquire.resetFields();

    setEntryInVillage('');

    history.push({
      pathname: `/form/village-form-6B/village-form`,
    });
  };

  const cancelForm = () => {
    history.push({
      pathname: `/form/village-form-6B/table-form`,
    });
  };

  const getSankirnDetails = async () => {
    setSearchLoading2(true);
    sendRequest(
      `${URLS.BaseURL}/form6B/getSankirnReceiptDetails?cCode=${codeVillage}&khataNo=${khataNoValue}`,
      'GET',
      null,
      (res) => {
        setReceiptNo(
          res.data.map((row) => ({
            label: row.receiptNo,
            value: row.receiptNo,
          })),
        );
        setSearchLoading2(false);

        setReceiptDate(
          res.data.map((r) => ({
            key: r.receiptNo,
            value: r,
          })),
        );
      },
      (err) => {
        setSearchLoading2(false);
      },
    );
  };

  const saveform6B = async () => {
    setIsLoading(true);
    const inputParameters = {
      revenueYear: revenueYear,
      districtCode: districtCode,
      talukaCode: talukaCode,
      cCode: codeVillage,
      orderOfTahsildarAsFine: form6B.getFieldValue('orderOfTahsildarAsFine'),
      reasonOfDeath: form6B.getFieldValue('reasonOfDeath'),
      dateOfDeath: form6B.getFieldValue('dateOfDeath')
        ? moment(form6B.getFieldValue('dateOfDeath'), 'DD/MM/YYYY').format('YYYY-MM-DD')
        : null,
      receiptNo: khataDetails.getFieldValue('receiptNo'),
      receiptDate: moment(khataDetails.getFieldValue('receiptDate'), 'DD/MM/YYYY').format(
        'YYYY-MM-DD',
      ),
      entryVillageForm6: entryVillage,
      nameOfAcquirerOfRight: nameOfAcquirerOfRight,
    };
    sendRequest(
      `${URLS.BaseURL}/form6B/saveForm6B`,
      'POST',
      inputParameters,
      (res) => {
        // console.log('inputParameters OF form6B Save API ==>>', inputParameters);
        // console.log('SAVE API CALEED --->', res.status);
        if (res.status === 201) {
          message.success('Data Saved!!');

          history.push({
            pathname: `/form/village-form-6B/table-form`,
          });
          setIsLoading(false);
        }
      },
      (err) => {
        setIsLoading(false);
      },
    );
  };

  return (
    <>
      <Card>
        <h1 style={{ textAlign: 'center' }}>
          <FormattedMessage id="formLanguage.label.villageForm6B" />
        </h1>
        <h1 style={{ textAlign: 'center' }}>
          <FormattedMessage id="formLanguage.label.villageForm6BB" />
        </h1>
        <Form layout="horizontal" form={villageForm}>
          <Row style={{ marginTop: 10 }}>
            {/* <Col xl={5} lg={5} md={24} sm={24} xs={24}>
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
            <Col xl={5} lg={6} md={24} xs={24} sm={24}>
              <Form.Item
                wrapperCol={{ xl: 20, lg: 15 }}
                label={<FormattedMessage id="villageSelector.label.village" />}
              >
                <Select
                  options={village}
                  placeholder=" गाव निवडा"
                  // onSelect={(value, event) => handleOnChange(value, event)}
                  onSelect={(value, event) => handleOnChange(value, event)}
                ></Select>
              </Form.Item>
            </Col> */}
            <Col xl={22} lg={22} md={22} sm={22} xs={22}>
              <VillageSelector
                pageType="withoutYear"
                setCodeVillage={(value, event) => handleOnChange(value, event)}
                setTextForVillage={setTextForVillage}
                onVillageChange={setVillage}
                setIsNirank={setIsNirank}

                // yearChange={setRevenueYear}
              />
            </Col>
          </Row>
        </Form>
      </Card>
      {/* {showEnteryInVillage &&( */}
      {isNirank && (
        <Card>
          <>
            <Alert message="टीप" description="सदर गाव नमुना निरंक आहे." type="info" showIcon />
          </>
        </Card>
      )}
      {!isNirank && (
        <>
          <Card>
            {/* 1st Card */}
            <Divider orientation="left">
              <FormattedMessage id="formLanguage.form.eFerfar" />
            </Divider>

            {/* NewRow */}

            <Row>
              <Col xl={6} lg={6} md={6} sm={24} xs={24}>
                <Form
                  layout="vertical"
                  // onFinish={saveform6B}
                  //  onFinishFailed={onFinishFailed}
                  form={form6Eferfar}
                >
                  <Form.Item
                    //  labelCol={{md:24}}
                    label={<FormattedMessage id="formLanguage.form.entryInVillageForm6" />}
                    rules={[
                      {
                        required: true,
                        message: (
                          <FormattedMessage id="villageForm6B.table.ruleEntryInVillageForm6" />
                        ),
                      },
                      { max: 50, message: 'This field shoud be below 50 characters' },
                    ]}
                  >
                    <Input
                      value={entryVillage}
                      onKeyPress={KeyPressEvents.isInputNumber}
                      maxLength={51}
                      disabled={flagInput}
                      onChange={(e) => {
                        setEntryInVillage(e.target.value);
                        // form6Eferfar.resetFields();
                        nameOfAcquire.resetFields();

                        form6B.resetFields();
                      }}
                      minLength={4}
                    />
                  </Form.Item>
                </Form>
              </Col>

              <Col xl={2} lg={2} md={2} sm={1} xs={1}></Col>

              <Col xl={2} lg={2} md={2} sm={2} xs={1}>
                {!isNirank && (
                  <Button
                    loading={searchLoading}
                    onClick={() => {
                      if (textForVillage && entryVillage) {
                        getDocument();
                      } else if (textForVillage == null) {
                        message.info('Please Select Village');
                      } else if (entryVillage == '') {
                        message.info('Please Enter Entry Village Form 6 Registered Number');
                      }
                    }}
                    type="primary"
                    style={{ marginTop: 30 }}
                  >
                    <FormattedMessage id="formLanguage.button.search" />
                  </Button>
                )}
              </Col>
              <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>

              <Col xl={13} lg={13} md={13} sm={24} xs={24}>
                <Form form={nameOfAcquire}>
                  <Form.Item
                    label={<FormattedMessage id="formLanguage.form.nameOfAcquirerOfRight" />}
                    name="nameOfAcquirerOfRight"
                  >
                    <Select
                      placeholder="Please select Name Of Acquirer Of Right or Holder Of Document"
                      onSelect={(e) => handleOnChangeForNameOfAcquierHolder(e)}
                      value={nameOfAcquirerOfRight}
                      options={nameofDocument}
                    ></Select>
                  </Form.Item>
                </Form>
              </Col>
            </Row>
            <Form form={khataDetails} layout="vertical">
              <Row>
                <Col xl={6} lg={6} md={6} sm={24} xs={24}>
                  <Form.Item
                    label={<FormattedMessage id="oneTimeEntry.form.khataNo" />}
                    name="khataNo"
                    rules={[
                      {
                        required: 'true',
                        message: 'Please Enter Khata No.',
                      },
                      { max: 7, message: 'This field shoud be below 7 numericals' },
                    ]}
                  >
                    <Input
                      onKeyPress={KeyPressEvents.isInputNumber}
                      maxLength={7}
                      onChange={handleChangeForKhataNo}
                    />
                  </Form.Item>
                </Col>
                <Col xl={2} lg={2} md={2} sm={1} xs={1}></Col>

                <Col xl={2} lg={2} md={2} sm={2} xs={1}>
                  <Button
                    loading={searchLoading2}
                    onClick={() => {
                      if (textForVillage && entryVillage && khataNoValue) {
                        getSankirnDetails();
                      } else if (textForVillage == null) {
                        message.info('Please Select Village');
                      } else if (entryVillage == '') {
                        message.info('Please Enter Entry Village Form 6 Registered Number');
                      } else if (khataNoValue == null) {
                        message.info('Please Enter Khata Number');
                      }
                    }}
                    type="primary"
                    style={{ marginTop: 30 }}
                  >
                    <FormattedMessage id="formLanguage.button.search" />
                  </Button>
                </Col>
                <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>

                <Col xl={8} lg={8} md={8} sm={24} xs={24}>
                  <Form.Item
                    label={<FormattedMessage id="formLanguage.form.receiptNo" />}
                    name="receiptNo"
                    rules={[
                      {
                        required: 'true',
                        message: 'Receipt Number is Required !',
                      },
                      // { max: 15, message: 'This field shoud be below 15 characters' },
                    ]}
                  >
                    <Select
                      placeholder="Receipt Number"
                      onSelect={(value) => handleOnChangeForReceiptNo(value)}
                      value={receiptNoValue}
                      options={receiptNo}
                    ></Select>
                  </Form.Item>
                </Col>
                <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>

                <Col xl={4} lg={4} md={4} sm={24} xs={24}>
                  <Form.Item
                    // style={{ marginTop: 25 }}
                    label={<FormattedMessage id="formLanguage.form.receiptDate" />}
                    name="receiptDate"
                    rules={[
                      {
                        required: 'true',
                        message: <FormattedMessage id="villageForm6B.table.ruleDateOfReceipt" />,
                      },
                    ]}
                  >
                    <DatePicker style={{ width: '100%' }} disabled={true} />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
        </>
      )}

      {/* )} */}
      <Form
        layout="vertical"
        // onFinish={saveform6B}
        onFinishFailed={onFinishFailed}
        // initialValues={initvalues}
        form={form6B}
      >
        {!isNirank && (
          <Card>
            {/* 2ndCard */}

            <Divider orientation="left">
              <FormattedMessage id="formLanguage.form.echawdi" />
            </Divider>
            <Row>
              <Col xl={11} lg={11} md={11} sm={13} xs={24}>
                <Form.Item
                  label={<FormattedMessage id="formLanguage.form.orderOfTahashil" />}
                  name="orderOfTahsildarAsFine"
                  rules={[
                    {
                      required: 'true',
                      message: (
                        <FormattedMessage id="villageForm6B.table.ruleOrderOfTahshilAsToFine" />
                      ),
                    },
                    { max: 50, message: 'This field shoud be below 50 characters' },
                  ]}
                >
                  <Input onKeyPress={KeyPressEvents.isInputVarchar} maxLength={51} />
                </Form.Item>
              </Col>
              <Col xl={2} lg={2} md={2} sm={2}></Col>
              <Col xl={11} lg={11} md={11} sm={9} xs={24}>
                <Form.Item
                  label={<FormattedMessage id="formLanguage.table.reasonOfDeath" />}
                  name="reasonOfDeath"
                  rules={[
                    // {
                    //   required: 'true',
                    //   message: (
                    //     <FormattedMessage id="villageForm6B.table.ruleOrderOfTahshilAsToFine" />
                    //   ),
                    // },
                    { max: 50, message: 'This field shoud be below 50 characters' },
                  ]}
                >
                  <Input onKeyPress={KeyPressEvents.isInputVarchar} maxLength={51} />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col xl={11} lg={11} md={11} sm={11} xs={24}>
                <Form.Item
                  label={<FormattedMessage id="formLanguage.form.dateOfDeath" />}
                  name="dateOfDeath"
                >
                  <DatePicker style={{ width: '100%' }}></DatePicker>
                </Form.Item>
              </Col>

              <Col xl={2} lg={2} md={2} sm={2}></Col>
            </Row>
            <Row>
              {/* <Col xl={11} lg={7} md={7} sm={24} xs={24}>
                  <Form.Item
                    // style={{ marginTop: 25 }}
                    label={<FormattedMessage id="formLanguage.form.receiptNo" />}
                    name="receiptNo"
                   rules={[{ required: 'true', message: <FormattedMessage id="villageForm6B.table.ruleReceiptNumber" /> },
                    { max: 15, message: 'This field shoud be below 15 characters' },
                  ]}
                  >
                    <Input onKeyPress={KeyPressEvents.isInputVarchar}
                    maxLength={16} />
                  </Form.Item>
                </Col> */}
            </Row>
            {/* 3rdRow */}
            <Row style={{ marginTop: 20 }}>
              <Col xl={8} lg={4} md={4} sm={5}></Col>
              <Col xl={2} lg={2} md={1} sm={1} xs={1}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isLoading}
                  // onClick={saveform6B}

                  onClick={() => {
                    if (textForVillage && nameOfAcquirerOfRight && khataNoValue) {
                      saveform6B();
                    } else if (textForVillage == null) {
                      message.info('Please Select Village');
                    } else if (nameOfAcquirerOfRight == null) {
                      message.info('Please Select Name Of Acquirer Of Right or Holder Of Document');
                    } else if (khataNoValue == null) {
                      message.info('Please Enter Khata No');
                    }
                  }}
                >
                  <FormattedMessage id="formLanguage.button.save" />
                </Button>
              </Col>
              <Col xl={1} lg={2} md={3} sm={4} xs={8}></Col>
              <Col xl={2} lg={2} md={1} sm={1} xs={1}>
                <Button onClick={resetFrom} style={{ color: 'white', backgroundColor: 'orange' }}>
                  <FormattedMessage id="formLanguage.button.reset" />
                </Button>
              </Col>
              <Col xl={1} lg={2} md={3} sm={4} xs={8}></Col>
              <Col xl={2} lg={2} md={1} sm={1} xs={1}>
                <Button type="danger" onClick={cancelForm}>
                  <FormattedMessage id="formLanguage.button.cancel" />
                </Button>
              </Col>
            </Row>
          </Card>
        )}
      </Form>
    </>
  );
}
export default form6B;
