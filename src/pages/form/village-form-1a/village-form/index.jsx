import { PageContainer } from '@ant-design/pro-layout';
import VillageSelector from '@/components/eComponents/VillageSelector';
import React from 'react';
import Axios from 'axios';
import { useHistory, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import BaseURL from '@/URLs/urls';
import URLS from '@/URLs/urls';
import useAxios from '@/components/eComponents/use-axios';
import { useModel } from 'umi';
import {
  Form,
  Input,
  Button,
  Row,
  Col,
  Select,
  Divider,
  Radio,
  Space,
  Popconfirm,
  Tooltip,
  Card,
  message,
  Layout,
  Checkbox,
  Alert,
} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { FormattedMessage } from 'umi';
import KeyPressEvents from '@/util/KeyPressEvents';

let vForest = 2;
function Form1A() {
  const [textVillage, setTextVillage] = useState('');
  const { districtName, servarthId, districtCode, talukaCode } = useModel('details');
  const [village, setVillage] = useState([]);
  const [codeVillage, setCodeVillage] = useState();
  const [textTypeOfLand, setTextTypeOfLand] = useState('');
  const [codeTypeOfLand, setCodeTypeOfLand] = useState();
  const [isNirank, setIsNirank] = useState(false);

  const [areaInUOM, setAreaInUOM] = useState();
  const { sendRequest } = useAxios();
  const [revenueYear, setRevenueYear] = useState();
  const location = useLocation();
  const [surveyNumberValue, setSurveyNumberValue] = useState();
  const [villageForm1, setVillageForm1] = useState();
  const [recordId, setRecordId] = useState();
  const [modalForDelete, setModalForDelete] = useState(false);
  const [flagButton, setFlagButton] = useState(true);
  const [flagButton2, setFlagButton2] = useState(true);
  const [showGetDataButton, setShowGetDataButton] = useState(false);
  const [radiovalue, setRadioValue] = useState();
  const [radioValueForSurvey, setRadioValueForSurvey] = useState();
  const [myForm] = Form.useForm();
  const [myForm1] = Form.useForm();

  const [showHissaNumberInput, setShowHissaNumberInput] = useState(false);
  const [hissaNumber, setHissaNumber] = useState([]);
  const [hissaNumberValue, setHissaNumberValue] = useState();
  const [area, setArea] = useState(false);
  const [reservedForest, setReservedForest] = useState(false);
  const [protectedForest, setProtectedForest] = useState(false);
  const [gramForest, setGramForest] = useState(false);
  const [gramForestValue, setGramForestValue] = useState();
  const [loadings, setLoadings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showArea, setShowArea] = useState(false);
  const [textForVillage, setTextForVillage] = useState();
  const [validateState, setValidateState] = useState(false);
  const [validateEferfarData, setVlaidateEferfarData] = useState(false);
  const [nirankState, setNirankState] = useState();

  const success = () => {
    message.success('Data Saved!!');
  };

  const enterLoading = (index) => {
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[index] = true;
      return newLoadings;
    });
    setTimeout(() => {
      setLoadings((prevLoadings) => {
        const newLoadings = [...prevLoadings];
        newLoadings[index] = false;
        return newLoadings;
      });
    }, 3000);
  };

  const getAreaValue = async () => {
    sendRequest(
      `${URLS.BaseURL}/form1a/getForm1AArea?districtCode=${districtCode}&talukaCode=${talukaCode}&cCode=${codeVillage}&pin=${surveyNumberValue}&hissaNo=${hissaNumberValue}`,
      'GET',
      null,
      (res) => {
        // console.log('full response', res.data[0]);
        // console.log('total areaH', res.data[0].totalAreaH);
        setArea(res.data[0].totalAreaH);
        setShowArea(true);
        setVlaidateEferfarData(true);
      },
    );
    setArea(true);
  };

  const getHissaFromSurvey = async () => {
    sendRequest(
      `${URLS.BaseURL}/restservice/getHissaByVillageAndSurveyNo?districtCode=${districtCode}&talukaCode=${talukaCode}&cCode=${codeVillage}&pin=${surveyNumberValue}&marked=Y`,
      'GET',
      null,
      (response) => {
        setHissaNumber(
          response.data.map((row) => ({
            label: row.hissaNo == '' ? 'निरंक' : row.hissaNo,
            value: row.hissaNo,
          })),
        );
        setShowHissaNumberInput(true);
      },
      (err) => {},
    );
  };

  const onFinish = async () => {
    // setLoading(true);
    const inputParams = {
      revenueYear: revenueYear,
      districtCode: districtCode,
      talukaCode: talukaCode,
      cCode: codeVillage,
      pin: surveyNumberValue,
      hissaNo: hissaNumberValue,
      typeOfLand: codeTypeOfLand,
      uom: areaInUOM,
      villageForest: myForm.getFieldValue('villageForest'),
      protectedForest: myForm.getFieldValue('protectedForest'),
      reservedForest: myForm.getFieldValue('reservedForest'),
      forestNoIfAny: myForm.getFieldValue('noIfAny'),
      area: myForm.getFieldValue('area123'),
      remarks: myForm.getFieldValue('remark'),
      rightsRecordedByTheForestOfficer: myForm.getFieldValue('rightsRecordedByTheForestOfficer'),
      uom: areaInUOM,
    };

    sendRequest(
      `${URLS.BaseURL}/form1a/saveForm1A`,
      'POST',
      inputParams,
      (res) => {
        {
          if (res.status === 201) {
            success();
            myForm.resetFields();
            history.push({
              pathname: '/form/village-form-1a/table-form',
            });
          }
        }
      },
      // setLoading(false),
    );
  };

  const pushToTableForm = () => {
    history.push({
      pathname: '/form/village-form-1a/table-form',
    });
  };

  const resetData = () => {
    myForm.resetFields();
    setArea('');
    setRadioValue('');
    myForm1.resetFields();
    setShowHissaNumberInput(false);
    setShowGetDataButton(false);
    setHissaNumber([]);
    setShowArea(false);
    setVlaidateEferfarData(false);
  };
  const { Option } = Select;
  let history = useHistory();

  const handleOnChangeT = (value, event) => {
    setCodeTypeOfLand(value);
    // console.log('value in selctor', value);
  };

  const handleChangeForArea = (value, event) => {
    setAreaInUOM(value);
    // console.log('value in selctor', value);
  };

  const handleChange = (event) => {
    setTextInput(event.target.value);
  };

  function handleChangeForSurveyNo(event) {
    setShowHissaNumberInput(false);
    setShowGetDataButton(false);
    setHissaNumber([]);
    setArea('');
    myForm1.resetFields();
    setSurveyNumberValue(event.target.value);
    setFlagButton2(false);
    setShowArea(false);
    setVlaidateEferfarData(false);
  }

  function handleChangeForHissaNo(event) {
    setValidateState(true);
    setHissaNumberValue(event);
    setFlagButton2(false);
    setShowGetDataButton(true);
  }
  const onFinishFailed = ({ values, errorFields, outOfDate }) => {
    // console.log('Finish Failed called', values, errorFields, outOfDate);
  };
  const onChangeRadioButton = (e) => {
    setRadioValue(e);
  };

  const onChangeGramForest = (e) => {
    if (gramForest === true) {
      setGramForest(false);
    } else {
      setGramForest(true);
    }
  };

  const onChangeProtectedForest = (e) => {
    if (protectedForest === true) {
      setProtectedForest(false);
    } else {
      setProtectedForest(true);
    }
  };

  const onChangeReservedForest = (e) => {
    if (reservedForest === true) {
      setReservedForest(false);
    } else {
      setReservedForest(true);
    }
  };

  const onChangeRadioButtonForSurvey = (e) => {
    setRadioValueForSurvey(e.target.value);
  };

  const cancelForm = () => {
    history.push({
      pathname: `/form/village-form-1a/table-form`,
    });
  };
  return (
    <div>
      {/* <h1 style={{ textAlign: 'center' }}>FOREST REGISTER</h1> */}

      <Card xs={24} xl={8}>
        <h1>
          <center>
            <FormattedMessage id="villageForm1A.table.villageForm1A" />
          </center>
        </h1>

        <h1 style={{ textAlign: 'center', fontSize: '25px' }}>
          <FormattedMessage id="villageForm1A.table.forestRegister" />
        </h1>
        {/* <Row style={{ marginTop: 70, marginLeft: '25px' }}> */}
        <VillageSelector
          pageType="withoutYear"
          setCodeVillage={setCodeVillage}
          setTextForVillage={setTextForVillage}
          onVillageChange={(setVillage, setFlagButton)}
          yearChange={setRevenueYear}
          setIsNirank={setIsNirank}
        />
        {/* </Row> */}
        <Form form={myForm1}>
          {/* <Row style={{ marginLeft: '25px' }}>
            <Col xs={11} sm={24} md={24} lg={15} xl={20}>
              <Form.Item
                style={{ marginTop: 10 }}
                rules={[{ required: true, message: 'This Field Is Required..' }]}
                label={<FormattedMessage id="form14.table.header1" />}
              >
                <Space>
                  <Radio.Group
                    name="srNumber"
                    value={radioValueForSurvey}
                    onChange={onChangeRadioButtonForSurvey}
                  >
                    <Radio value="surveyNo">
                      <FormattedMessage id="form14.radio.surveyNo" />
                    </Radio>
                    <Radio value="निरंक">
                      <FormattedMessage id="form14.radio.nirank" />
                    </Radio>
                  </Radio.Group>
                </Space>
              </Form.Item>
            </Col>
            <Col span={8}></Col>
          </Row> */}
          {/* {radioValueForSurvey && radioValueForSurvey === 'surveyNo' ? ( */}
          <Row style={{ marginTop: 10 }}>
            <Col xl={5} lg={5} md={24} sm={24} xs={24}>
              <Form.Item
                // labelCol={{ xs: 10 }}
                // wrapperCol={{ xl: 14, lg: 11, xs: 14 }}
                label={<FormattedMessage id="formLanguage.table.surveyNo" />}
                //  name="surveyNo"
                rules={[
                  {
                    required: true,
                    message: 'Please Enter Survey Number',
                  },
                  {
                    max: 7,
                    message: 'Survey Number shoud be upto 7 numbers',
                  },
                ]}
              >
                <Input
                  onKeyPress={KeyPressEvents.isInputNumber}
                  maxLength={7}
                  onChange={handleChangeForSurveyNo}
                />
              </Form.Item>
            </Col>
            <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>

            <Col xl={2} lg={2} md={24} sm={24} xs={24}>
              {!isNirank && (
                <Button
                  loading={loadings[1]}
                  type="primary"
                  onClick={() => {
                    if (textForVillage && surveyNumberValue) {
                      getHissaFromSurvey();
                      enterLoading(1);
                    } else if (textForVillage == null) {
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

            <Col xl={1} lg={2}></Col>

            {showHissaNumberInput && (
              <Col xl={5} lg={5} md={24} sm={24} xs={24}>
                <Form.Item
                  name="hissaNo"
                  label={<FormattedMessage id="formLanguage.form.hissaNo" />}
                >
                  <Select
                    onSelect={(value, event) => handleChangeForHissaNo(value, event)}
                    placeholder="हिस्सा क्रमांक निवडा"
                    options={hissaNumber}
                  ></Select>
                </Form.Item>
              </Col>
            )}
            <Col md={1} xs={1}></Col>
            <Col xl={2} lg={2} md={24} sm={24} xs={24}>
              {showGetDataButton && (
                <Form.Item>
                  <Button
                    loading={loadings[2]}
                    type="primary"
                    onClick={() => {
                      getAreaValue();
                      enterLoading(2);
                    }}
                  >
                    <FormattedMessage id="formLanguage.button.search" />
                  </Button>
                </Form.Item>
              )}
            </Col>
            {showArea && (
              <Col xl={5} lg={5} md={24} sm={24} xs={24}>
                <Form.Item label={<FormattedMessage id="villageForm1A.table.area" />}>
                  <Input style={{ marginLeft: 6 }} disabled value={area}></Input>
                </Form.Item>
              </Col>
            )}
          </Row>
          {/* ) : (
            radioValueForSurvey === 'निरंक' && (
              <Row>
                <Col xl={8} lg={8} md={24} sm={24} xs={24}>
                  <Form.Item label={<FormattedMessage id="form14.table.others" />}>
                    <Select onSelect={(value, event) => handleRadioValueChange(value, event)}>
                      <Select.Option value="निरंक">निरंक </Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            )
          )} */}
        </Form>

        {/* <Row style={{ marginTop: 10, marginLeft: 15 }}>

            </Row> */}
      </Card>
      {isNirank && (
        <Card>
          <Alert message="टीप" description="सदर गाव नमुना निरंक आहे." type="info" showIcon />
        </Card>
      )}
      <Form layout="vertical" form={myForm} onFinishFailed={onFinishFailed}>
        {!isNirank && (
          <Card>
            <Divider orientation="left">
              <FormattedMessage id="formLanguage.form.echawdi" />
            </Divider>
            <strong>
              <FormattedMessage id="villageForm1A.table.forestType" />
            </strong>
            <br />
            <br />
            <Checkbox onChange={onChangeGramForest} name="villageForest" value="villageForest">
              <FormattedMessage id="villageForm1A.table.villageForest" />
            </Checkbox>
            <Row>
              <Col xs={24} sm={24} md={24} lg={6} xl={6}>
                {gramForest === true && (
                  <Form.Item name="villageForest">
                    <Input onKeyPress={KeyPressEvents.isInputDecimal} />
                  </Form.Item>
                )}
              </Col>
            </Row>
            <Col lg={1} xl={1}></Col>

            <Checkbox
              name="protectedForest"
              value="protectedForest"
              onChange={onChangeProtectedForest}
            >
              <FormattedMessage id="villageForm1A.table.protectedForest" />
            </Checkbox>
            <Row>
              <Col xs={24} sm={24} md={24} lg={6} xl={6}>
                {protectedForest === true && (
                  <Form.Item name="protectedForest">
                    <Input onKeyPress={KeyPressEvents.isInputDecimal} />
                  </Form.Item>
                )}
              </Col>
            </Row>
            <Col lg={1} xl={1}></Col>

            <Checkbox
              name="reservedForest"
              value="reservedForest"
              onChange={onChangeReservedForest}
            >
              <FormattedMessage id="villageForm1A.table.reservedForest" />
            </Checkbox>
            <Row>
              <Col xs={24} sm={24} md={24} lg={6} xl={6}>
                {reservedForest === true && (
                  <Form.Item name="reservedForest">
                    <Input onKeyPress={KeyPressEvents.isInputDecimal} />
                  </Form.Item>
                )}
              </Col>
            </Row>

            <br />
            <br />

            <Row style={{ marginTop: 10 }}>
              {/* <Col xs={24} sm={16} md={24} lg={11}>
              <Form.Item
                name={'test'}
                label={<FormattedMessage id="villageForm1A.table.landType" />}
                rules={[
                  {
                    required: true,
                    message: <FormattedMessage id="villageForm1.table.ruleTypeOfLand" />,
                  },
                ]}
                // label="Type: "
              >
                <Select
                  placeholder="जमिनीचा प्रकार"
                  onSelect={(value, event) => handleOnChangeT(value, event)}
                >
                  <Select.Option value="villageForm1A.table.surveyedLand">
                    <FormattedMessage id="villageForm1A.table.surveyedLand" />
                  </Select.Option>
                  <Select.Option value="villageForm1A.table.unSurveyedLand">
                    <FormattedMessage id="villageForm1A.table.unSurveyedLand" />
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col> */}

              {/* <Col xs={20} sm={16} md={24} lg={2}></Col> */}

              <Col xs={11} sm={11} md={11} lg={11} xl={11}>
                <Form.Item
                  label={<FormattedMessage id="villageForm1A.table.forestOfficer" />}
                  name="rightsRecordedByTheForestOfficer"
                  rules={[
                    {
                      //  required: true,
                      // message: (
                      //   <FormattedMessage id="villageForm1.table.ruleRightsByTheForestSettelement" />
                      // ),
                    },
                    { max: 50, message: 'Rights should be upto 50 characters' },
                  ]}
                >
                  <Input onKeyPress={KeyPressEvents.isInputChar} maxLength={51} />
                </Form.Item>
              </Col>
              <Col xs={1} sm={1} md={1} lg={1} xl={1}></Col>

              <Col xs={11} sm={11} md={11} lg={11} xl={11}>
                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: <FormattedMessage id="villageForm1A.table.ruleArea" />,
                    },
                    {
                      max: 18,
                      message: 'Area shoud be upto 18 numbers',
                    },
                  ]}
                  label={<FormattedMessage id="formLanguage.form.Area" />}
                  name="area123"
                >
                  <Input
                    onKeyPress={KeyPressEvents.isInputDecimal}
                    minLength={1}
                    maxLength={19}
                    placeholder="क्षेत्र प्रविष्ट करा"
                    addonAfter="हे.आर.चौमी"
                  ></Input>
                </Form.Item>
              </Col>
            </Row>

            <Row style={{ marginTop: 10 }}>
              {/* <Col xs={20} sm={16} md={24} lg={2}></Col> */}
              <Col xs={11} sm={11} md={11} lg={11} xl={11}>
                <Form.Item
                  name="noIfAny"
                  label={<FormattedMessage id="villageForm1A.table.noIfAny" />}
                  // rules={[
                  //   {
                  //     required: true,
                  //     message:"This field is required",
                  //   },
                  // ]}
                >
                  <Input maxLength={19} onKeyPress={KeyPressEvents.isInputChar} />
                </Form.Item>
              </Col>
              <Col xs={1} sm={1} md={1} lg={1} xl={1}></Col>

              <Col xs={11} sm={11} md={11} lg={11} xl={11}>
                <Form.Item
                  label={<FormattedMessage id="formLanguage.table.remark" />}
                  //label="Remarks :"
                  name="remark"
                  rules={[
                    /*  {
                      required: true,
                      message: <FormattedMessage id="formLanguage.table.ruleRemark" />,
                    }, */
                    {
                      max: 200,
                      message: 'Remarks shoud be upto 200 Characters',
                    },
                  ]}
                >
                  <Input.TextArea
                    onKeyPress={KeyPressEvents.isInputChar}
                    maxLength={201}
                    placeholder="अभिप्राय  प्रविष्ट करा"
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* <Row style={{ marginTop: 10 }}>
            <Col xs={11} sm={11} md={11} lg={11} xl={11}>
              <Form.Item
                label={<FormattedMessage id="formLanguage.table.remark" />}
                name="remark"
                rules={[
                 
                  {
                    max: 200,
                    message: 'Remarks shoud be upto 200 Characters',
                  },
                ]}
              >
                <Input.TextArea
                  onKeyPress={KeyPressEvents.isInputChar}
                  maxLength={201}
                  placeholder="अभिप्राय  प्रविष्ट करा"
                />
              </Form.Item>
            </Col>
          </Row> */}

            <Row style={{ marginTop: 30 }}>
              <Col sm={2} md={4} lg={4} xl={8}></Col>
              <Col xs={1} sm={1} md={1} lg={2} xl={2}>
                <Form.Item>
                  <Button
                    loading={loadings[0]}
                    type="primary"
                    htmlType="submit"
                    onClick={() => {
                      if (textForVillage) {
                        onFinish();
                        enterLoading(0);
                      } else if (textForVillage == null) {
                        message.info('Please Select Village');
                      }
                    }}
                  >
                    <FormattedMessage id="formLanguage.button.save" />
                  </Button>
                </Form.Item>
              </Col>
              <Col xl={1} lg={2} md={3} sm={4} xs={8}></Col>
              <Col xl={2} lg={2} md={1} sm={1} xs={1}>
                <Button
                  type=""
                  style={{ color: 'white', backgroundColor: 'orange' }}
                  onClick={resetData}
                >
                  <FormattedMessage id="formLanguage.button.reset" />
                </Button>
              </Col>

              <Col xl={1} lg={2} md={3} sm={4} xs={8}></Col>
              <Col xl={2} lg={2} md={1} sm={1} xs={1}>
                <Button type="danger" onClick={pushToTableForm} htmlType="submit">
                  <FormattedMessage id="formLanguage.button.cancel" />
                </Button>
              </Col>
            </Row>
          </Card>
        )}
      </Form>
    </div>
  );
}

export default Form1A;
