import { PageContainer } from '@ant-design/pro-layout';
import { Alert, Button, Card, Col, Divider, Form, Input, message, Row, Select } from 'antd';
import VillageSelector from '@/components/eComponents/VillageSelector';
import { useEffect, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import ESelector from '@/components/eComponents/ESelector';
import { useHistory } from 'react-router-dom';
import { FormattedMessage, useModel } from 'umi';
import Axios from 'axios';
import useAxios from '@/components/eComponents/use-axios';
import URLS from '@/URLs/urls';
import React from 'react';
import KeyPressEvents from '@/util/KeyPressEvents';

const { Option } = Select;
const { TextArea } = Input;
function onChange(value) {
  // console.log(`selected ${value}`);
}

function onSearch(val) {
  // console.log('search:', val);
}
function VillageForm7A() {
  const [textForVillage, setTextForVillage] = useState();
  const [selectorForm] = Form.useForm();
  const [khataForm] = Form.useForm();

  const [form7A] = Form.useForm();
  const [form] = Form.useForm();
  let history = useHistory();
  const { sendRequest } = useAxios();
  const [myForm] = Form.useForm();
  const [codeVillage, setCodeVillage] = useState();
  const [textVillage, setTextVillage] = useState('');
  const [village, setVillage] = useState([]);
  const [flagButton, setFlagButton] = useState(true);
  const [revenueYear, setRevenueYear] = useState();
  const [isNirank, setIsNirank] = useState(false);
  const [hissaNumber, setHissaNumber] = useState([]);
  const [khataNumber, setKhataNumber] = useState([]);
  const [khataNumberValue, setKhataNumberValue] = useState([]);
  const [flagButton2, setFlagButton2] = useState(true);
  const [showArea, setShowArea] = useState(false);
  const [showGetDataButton, setShowGetDataButton] = useState(false);
  const [surveyNumberValue, setSurveyNumberValue] = useState();
  const [hissaNumberValue, setHissaNumberValue] = useState([]);
  const [showHissaNumberInput, setShowHissaNumberInput] = useState(false);
  const [showKhataNumberInput, setShowKhataNumberInput] = useState(false);
  const [showKhataNumberButton, setShowKhataNumberButton] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchLoading2, setSearchLoading2] = useState(false);
  const [searchLoading3, setSearchLoading3] = useState(false);
  const { districtName, servarthId, districtCode, talukaCode } = useModel('details');
  const [validStateEFerfar, setValidStateEFerfar] = useState(false);
  const [totalArea, setTotalArea] = useState();
  const [enteredArea, setEnteredArea] = useState();
  const [saveFlag, setSaveFlag] = useState(true);

  const onFinishFailed = ({ values, errorFields, outOfDate }) => {
    // console.log('Finish Failed called', values, errorFields, outOfDate);
  };
  const initvalues = {
    image: '',
  };

  const resetFrom = () => {
    form.resetFields();
  };

  const errorMessage = async () => {
    message.info('Entered Area is greater than Actual ferfar Area');
  };

  useEffect(() => {
    if (enteredArea > totalArea) {
      errorMessage();
      setSaveFlag(false);
    } else {
      setSaveFlag(true);
    }
  }, [enteredArea, totalArea]);

  function handleChangeForHissaNo(event) {
    setHissaNumberValue(event);
    setShowKhataNumberButton(true);

    // setShowGetDataButton(true);
  }

  function handleChangeForKhataNo(event) {
    setKhataNumber(event);
    setShowGetDataButton(true);
  }
  const getHissaFromSurvey = async () => {
    setSearchLoading(true);
    sendRequest(
      `${URLS.BaseURL}/restservice/getHissaByVillageAndSurveyNo?districtCode=${districtCode}&talukaCode=${talukaCode}&cCode=${codeVillage}&pin=${surveyNumberValue}&marked=Y`,
      'GET',
      null,
      (response) => {
        // console.log('this is the suvery number being sent to api on click', surveyNumberValue);
        const mapper = response.data.map((row) => {
          if (row.hissaNo === '') {
            // console.log('Emty hissa Found');
          }
        });
        // console.log('mapper', mapper);
        const hissArr = response.data.map((row) => ({
          label: row.hissaNo == '' ? 'निरंक' : row.hissaNo,
          value: row.hissaNo,
        }));

        if (hissArr.length > 1) {
          setShowArea(false);
        }
        setShowHissaNumberInput(true);
        setHissaNumber(hissArr);
        setSearchLoading(false);
      },
      (err) => {
        setSearchLoading(false);
      },
    );
  };

  const getKhataData = async (value) => {
    setSearchLoading2(true);
    sendRequest(
      `${URLS.BaseURL}/form7a/getForm7AEferfarDetials?districtCode=${districtCode}&talukaCode=${talukaCode}&cCode=${codeVillage}&pin=${surveyNumberValue}&hissaNo=${hissaNumberValue}`,
      'GET',
      null,

      (res) => {
        // console.log('full res', res.data[0]);
        setKhataNumberValue(
          res.data.map((row) => ({
            label: row.khataNo,
            value: row.khataNo,
          })),
        );
        setSearchLoading2(false);

        // form.setFieldsValue({
        //   khataNo: res.data[0].khataNo,
        //   landlordName: res.data[0].landlordName,
        //   assessment: res.data[0].assessment,
        //   TotalArea: res.data[0].TotalArea,
        // });
        setShowKhataNumberInput(true);
        setValidStateEFerfar(true);
      },
      (err) => {
        setSearchLoading2(false);
      },
    );
  };

  const getDataFromKhataNumber = async (values) => {
    setSearchLoading3(true);
    sendRequest(
      `${URLS.BaseURL}/form7a/getForm7AEferfarKhataDetials?cCode=${codeVillage}&pin=${surveyNumberValue}&hissaNo=${hissaNumberValue}&khataNo=${khataNumber}`,
      'GET',
      null,
      (res) => {
        form.setFieldsValue(
          {
            khataNo: res.data[0].khataNo,
            landlordName: res.data[0].landlordName,
            assessment: res.data[0].assessment,
            TotalArea: res.data[0].TotalArea,
          },
          setTotalArea(res.data[0].TotalArea),
        );
        setSearchLoading3(false);
        // let totalAreaH = res.data[0].TotalArea;
      },
      setSearchLoading3(false),
    );
  };

  const sveForm7A = async () => {
    setIsLoading(true);

    // console.log('api called !!');
    const inputParams = {
      pin: surveyNumberValue,
      hissaNo: hissaNumberValue,
      cCode: codeVillage,
      districtCode: districtCode,
      talukaCode: talukaCode,
      khataNo: form.getFieldValue('khataNo'),
      landlordName: form.getFieldValue('landlordName'),
      assessment: form.getFieldValue('assessment'),
      area: form.getFieldValue('area'),
      TotalArea: totalArea,
      lastYearSerialNo: form.getFieldValue('lastYearSerialNo'),
      nameOfTenant: form.getFieldValue('nameOfTenant'),
      rent: form.getFieldValue('rent'),
      serialNoInMutationReg: form.getFieldValue('srlNoOfEntry'),
      remarks: form.getFieldValue('remarks'),
    };
    if (validStateEFerfar == false) {
      message.info('Please Fetch Eferfar Data !');
    }
    // console.log('values being sent to api', inputParams);
    sendRequest(
      `${URLS.BaseURL}/form7a/saveForm7A`,
      'POST',
      inputParams,
      (res) => {
        {
          if (res.status === 201) {
            message.success('Data Saved!!');
            form.resetFields();
            history.push({
              pathname: '/form/village-form-7a/table-form',
            });
            setIsLoading(false);
          }
        }
      },
      (err) => {
        setIsLoading(false);
      },
    );
  };
  const cancelForm = () => {
    history.push({
      pathname: `/form/village-form-7a/table-form`,
    });
  };

  const handleESelectorChange = (flagGetDataButton, sn, hn, cCodeV) => {
    // console.log('test log in handle change for selector', flagGetDataButton, sn, hn, revenueYear);
    setShowGetDataButton(flagGetDataButton);
    setSurveyNumberValue(sn);
    setHissaNumberValue(hn);
    setCodeVillage(cCodeV);
    setRevenueYear(revenueYear);
  };

  const handleChangeForSurveyNoV = (event) => {
    selectorForm.resetFields();
    khataForm.resetFields();
    setFlagButton(false);
    setFlagButton2(false);
    setSurveyNumberValue(event.target.value);
    setRevenueYear(revenueYear);
    setShowArea(false);
    setShowGetDataButton(false);
    form.resetFields();
  };
  return (
    <>
      <Card>
        <h1 style={{ textAlign: 'center' }}>
          <FormattedMessage id="villageForm.form.villageForm" />
        </h1>
        <h2>
          <center>
            <FormattedMessage id="villageForm.form.registerOfTenancies" />
          </center>
        </h2>
        <>
          <Col xl={22} lg={24}>
            <VillageSelector
              pageType="withoutYear"
              setCodeVillage={setCodeVillage}
              setTextForVillage={setTextForVillage}
              onVillageChange={setVillage}
              yearChange={setRevenueYear}
              setIsNirank={setIsNirank}
            />
          </Col>

          <Row style={{ marginTop: 10 }}>
            <Col xl={6} lg={6} md={6} sm={24} xs={24}>
              <Form.Item
                label={<FormattedMessage id="formLanguage.table.surveyNo" />}
                name="survey_number"
                rules={[
                  { required: true, message: 'Survey Number is necessary!' },
                  { type: 'string', max: 7 },
                ]}
              >
                <Input
                  onKeyPress={KeyPressEvents.isInputNumber}
                  maxLength={7}
                  onChange={handleChangeForSurveyNoV}
                />
              </Form.Item>
            </Col>
            <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>
            <Col xl={2} lg={2} md={2} sm={24} xs={24}>
              {!isNirank && (
                <Button
                  type="primary"
                  loading={searchLoading}
                  onClick={() => {
                    if (codeVillage && surveyNumberValue) {
                      getHissaFromSurvey();
                    } else if (!codeVillage) {
                      message.info('Please Select Village ');
                    } else if (surveyNumberValue === undefined) {
                      message.info('Please Enter Survey Number');
                    }
                  }}
                >
                  <FormattedMessage id="formLanguage.button.search" />
                </Button>
              )}
            </Col>
            <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>
            <Col xl={5} lg={5} md={5} sm={24} xs={24}>
              {showHissaNumberInput && (
                <Form layout="inline" form={selectorForm}>
                  <Form.Item
                    label={<FormattedMessage id="formLanguage.form.hissaNo" />}
                    name="hissa_no"
                    rules={[{ required: false, message: 'Please select hissa number!' }]}
                  >
                    <Select
                      // onSelect={(value) => getKhataData(value)}
                      options={hissaNumber}
                      onSelect={(value, event) => handleChangeForHissaNo(value, event)}
                      placeholder="Select Hissa Number"
                      value={hissaNumberValue}
                    ></Select>
                  </Form.Item>
                </Form>
              )}
            </Col>
            <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>

            <Col xl={2} lg={2} md={2} sm={24} xs={24}>
              {showKhataNumberButton && (
                <Button
                  type="primary"
                  loading={searchLoading2}
                  onClick={(value) => getKhataData(value)}
                >
                  <FormattedMessage id="formLanguage.button.search" />
                </Button>
              )}
            </Col>
            <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>

            <Col xl={5} lg={5} md={5} sm={24} xs={24}>
              {showKhataNumberInput && (
                <Form layout="inline" form={khataForm}>
                  <Form.Item
                    label={<FormattedMessage id="formLanguage.button.khataNo" />}
                    name="khataNo"
                    rules={[{ required: false, message: 'Please select Khata number!' }]}
                  >
                    <Select
                      options={khataNumberValue}
                      onChange={(value, event) => handleChangeForKhataNo(value, event)}
                      placeholder="Select Khata Number"
                      value={khataNumber}
                    ></Select>
                  </Form.Item>
                </Form>
              )}
            </Col>
          </Row>
        </>

        <Col xl={4}>
          {showGetDataButton && (
            <Button
              type="primary"
              loading={searchLoading3}
              onClick={(value) => getDataFromKhataNumber(value)}
            >
              <FormattedMessage id="formLanguage.button.getFerfar" />
            </Button>
          )}
        </Col>
      </Card>
      {isNirank && (
        <Card>
          <Alert message="टीप" description="सदर गाव नमुना निरंक आहे." type="info" showIcon />
        </Card>
      )}
      {!isNirank && (
        <Form
          layout="vertical"
          //      onFinish={sveForm7A}
          onFinishFailed={onFinishFailed}
          initialValues={initvalues}
          form={form}
        >
          <Card style={{ marginTop: 20 }} bordered={true}>
            <Divider orientation="left">
              <FormattedMessage id="formLanguage.form.eFerfar" />
            </Divider>
            <Row style={{ marginTop: 20 }}>
              <Col xl={5} lg={5} md={5} sm={24} xs={24}>
                <Form.Item
                  label={<FormattedMessage id="formLanguage.button.khataNo" />}
                  name="khataNo"
                  // rules={[
                  //           {
                  //             required: true,
                  //             message: 'Please Enter Name of the Landlord',
                  //           },
                  //         ]}
                >
                  <Input disabled></Input>
                </Form.Item>
              </Col>
              <Col xl={1} lg={1} md={1}></Col>
              <Col xl={5} lg={5} md={5} sm={24} xs={24}>
                <Form.Item
                  label={<FormattedMessage id="villageForm.form.nameLandlord" />}
                  name="landlordName"
                  // rules={[
                  //           {
                  //             required: true,
                  //             message: 'Please Enter Name of the Landlord',
                  //           },
                  //         ]}
                >
                  <Input disabled></Input>
                </Form.Item>
              </Col>
              <Col xl={1} lg={1} md={1}></Col>

              <Col xl={5} lg={5} md={5} sm={24} xs={24}>
                <Form.Item
                  label={<FormattedMessage id="villageForm.form.assessement" />}
                  name="assessment"
                  //  rules={[
                  //   {
                  //     required: true,
                  //     message: 'Please Enter Assessment',
                  //   },
                  // ]}
                >
                  <Input disabled></Input>
                </Form.Item>
              </Col>

              <Col xl={1} lg={1} md={1}></Col>
              <Col xl={5} lg={5} md={5} sm={24} xs={24}>
                <Form.Item
                  // rules={[
                  //         {
                  //           required: true,

                  //         },
                  //       ]}
                  label={<FormattedMessage id="formLanguage.table.totalArea" />}
                  name="TotalArea"
                  value={totalArea}
                >
                  <Input disabled></Input>
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {/* 2ndCard */}
          <Card bordered={true} style={{ marginTop: 15 }}>
            <Divider orientation="left" style={{ marginBottom: 10 }}>
              <FormattedMessage id="formLanguage.form.echawdi" />
            </Divider>

            <Row style={{ marginTop: '25px' }}>
              <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                <Form.Item
                  name="lastYearSerialNo"
                  label={<FormattedMessage id="villageForm.form.serialNumber" />}
                  //  Name of Tenant
                  rules={[
                    // {
                    //   required: true,
                    //   message: <FormattedMessage id="formLanguage.table.ruleSerailNumberOfLast" />,
                    // },
                    { max: 50, message: 'This field shoud be below 50 characters' },
                  ]}
                >
                  <Input onKeyPress={KeyPressEvents.isInputVarchar} maxLength={51}></Input>
                </Form.Item>
              </Col>
              <Col xl={2} lg={2} md={2}></Col>

              <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                <Form.Item
                  name="nameOfTenant"
                  label={<FormattedMessage id="villageForm.form.nameOfTenant" />}
                  rules={[
                    {
                      required: true,
                      message: <FormattedMessage id="villageForm.form.ruleNameOfTenant" />,
                    },
                    { max: 50, message: 'This field shoud be below 50 characters' },
                  ]}
                >
                  <Input onKeyPress={KeyPressEvents.isInputVarchar} maxLength={51}></Input>
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                <Form.Item
                  name="rent"
                  label={<FormattedMessage id="villageForm.form.rent" />}
                  rules={[
                    // { required: true, message: <FormattedMessage id="villageForm.form.ruleRent" /> },
                    { max: 50, message: 'This field shoud be below 50 characters' },
                  ]}
                >
                  <Input onKeyPress={KeyPressEvents.isInputVarchar} maxLength={51}></Input>
                </Form.Item>
              </Col>
              <Col xl={2} lg={2} md={2}></Col>
              <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                <Form.Item
                  name="srlNoOfEntry"
                  label={<FormattedMessage id="villageForm.form.srlNoOfEntry" />}
                  rules={[
                    {
                      required: true,
                      message: (
                        <FormattedMessage id="villageForm.form.ruleSerailNumberOfEntryOnTheMutation" />
                      ),
                    },
                    { max: 50, message: 'This field shoud be below 50 characters' },
                  ]}
                >
                  <Input onKeyPress={KeyPressEvents.isInputVarchar} maxLength={51}></Input>
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                <Form.Item
                  name="area"
                  label={<FormattedMessage id="villageForm.form.area" />}
                  rules={[
                    {
                      required: true,
                      message: <FormattedMessage id="villageForm.form.areaMessage" />,
                    },
                    { max: 50, message: 'This field shoud be below 18 Numbers' },
                  ]}
                >
                  <Input
                    value={enteredArea}
                    onChange={(event) => {
                      setEnteredArea(event.target.value);
                    }}
                    onKeyPress={KeyPressEvents.isInputVarchar}
                    maxLength={51}
                  ></Input>
                </Form.Item>
              </Col>
              <Col xl={2} lg={2} md={2}></Col>

              <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                <Form.Item
                  name="remarks"
                  label={<FormattedMessage id="formLanguage.table.remark" />}
                  rules={[
                    // {
                    //   required: true,
                    //   message: <FormattedMessage id="formLanguage.table.ruleRemark" />,
                    // },
                    { max: 200, message: 'This field shoud be below 200 characters' },
                  ]}
                >
                  <TextArea onKeyPress={KeyPressEvents.isInputChar} maxLength={201}></TextArea>
                </Form.Item>
              </Col>
            </Row>

            {/* BUttonSection */}
            <Row style={{ marginTop: 15 }}>
              <Col sm={6} md={7} lg={7} xl={8}></Col>
              <Col xs={1} sm={1} md={1} lg={2} xl={2}>
                <Button
                  loading={isLoading}
                  onClick={() => {
                    if (
                      codeVillage &&
                      surveyNumberValue &&
                      hissaNumberValue != null &&
                      validStateEFerfar &&
                      saveFlag
                    ) {
                      sveForm7A();
                    } else if (!codeVillage) {
                      message.info('Please Select Village');
                    } else if (surveyNumberValue == null) {
                      message.info('Please Enter Survey Number');
                    } else if (showHissaNumberInput == false) {
                      message.info('Please Search for Hissa Number');
                    } else if (validStateEFerfar == false) {
                      message.info('Please Fetch EFerfar Data !');
                    } else if (!saveFlag) {
                      errorMessage();
                    }
                  }}
                  type="primary"
                  htmlType="submit"
                >
                  <FormattedMessage id="formLanguage.button.save" />
                </Button>
              </Col>
              <Col xl={1} lg={2} md={3} sm={4} xs={8}></Col>
              <Col xl={2} lg={2} md={1} sm={1} xs={1}>
                <Button
                  onClick={resetFrom}
                  htmlType="submit"
                  style={{ color: 'white', backgroundColor: 'orange' }}
                  type="default"
                >
                  <FormattedMessage id="formLanguage.button.reset" />
                </Button>
              </Col>

              <Col xl={1} lg={2} md={3} sm={4} xs={8}></Col>
              <Col xl={2} lg={2} md={1} sm={1} xs={1}>
                <Button onClick={cancelForm} type="danger">
                  <FormattedMessage id="formLanguage.button.cancel" />
                </Button>
              </Col>
            </Row>
          </Card>
        </Form>
      )}
    </>
  );
}

export default VillageForm7A;
