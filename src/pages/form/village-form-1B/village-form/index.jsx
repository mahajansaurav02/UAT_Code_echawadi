import { PageContainer } from '@ant-design/pro-layout';
import { Card, Row, Col, Select, Form, Input, Button, Divider, Popconfirm, message } from 'antd';
import React from 'react';
import { useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import VillageSelector from '@/components/eComponents/VillageSelector';
import URLS from '@/URLs/urls';
import useAxios from '@/components/eComponents/use-axios';
import { useHistory } from 'react-router-dom';
import { FormattedMessage, useModel } from 'umi';
import KeyPressEvents from '@/util/KeyPressEvents';
import Center from '@/pages/account/center';

function Form1B() {
  const { sendRequest } = useAxios();
  const { districtName, servarthId, districtCode, talukaCode } = useModel('details');
  const [form1B] = Form.useForm();
  const [Form1] = Form.useForm();
  const [showAreaAndAssessment, setShowAreaAndAssessment] = useState(false);
  const [codeVillage, setCodeVillage] = useState('');
  const [textVillage, setTextVillage] = useState('');
  const [textForVillage, setTextForVillage] = useState();

  const [buttonFlag, setButtonFlag] = useState(false);
  const [flagButton, setFlagButton] = useState(true);
  const [flagButton2, setFlagButton2] = useState(true);
  const [showGetDataButton, setShowGetDataButton] = useState(false);
  const [surveyNumberValue, setSurveyNumberValue] = useState();
  const [hissaNumber, setHissaNumber] = useState([]);
  const [hissaNumberValue, setHissaNumberValue] = useState([]);
  const [showAreaInput, setshowAreaInput] = useState(false);
  const [area, setArea] = useState(false);
  const [assessment, setAssessment] = useState();
  const [showHissaNumberInput, setShowHissaNumberInput] = useState(false);
  let history = useHistory();
  const [revenueYear, setRevenueYear] = useState();
  const [requiredHissa, setRequiredHissa] = useState(false);

  const getHissaFromSurvey = async () => {
    sendRequest(
      `${URLS.BaseURL}/restservice/getHissaByVillageAndSurveyNo?districtCode=${districtCode}&talukaCode=${talukaCode}&cCode=${codeVillage}&pin=${surveyNumberValue}&marked=Y`,
      'GET',
      null,
      (response) => {
        // console.log('this is the suvery number being sent to api on click', surveyNumberValue),
        setHissaNumber(
          response.data.map((row) => ({
            label: row.hissaNo == '' ? 'निरंक' : row.hissaNo,
            value: row.hissaNo,
          })),
        );
      },
      (err) => {},
    );
    setShowHissaNumberInput(true);
  };

  const getAreaAndAssessment = async () => {
    sendRequest(
      `${URLS.BaseURL}/form1b/getFormsAssesment?districtCode=${districtCode}&talukaCode=${talukaCode}&cCode=${codeVillage}&pin=${surveyNumberValue}&hissaNo=${hissaNumberValue}`,
      'GET',
      null,
      (res) => {
        // console.log(res.data);
        setArea(res.data.form1BData[0].totalAreaH);
        setAssessment(res.data.form1BData[0].assessment);
        setShowAreaAndAssessment(true);
        // console.log('area in state==>', area);
      },
      (err) => {},
    ),
      'SURVEY';
    setArea(true);
  };

  function handleChangeForSurveyNo(event) {
    setSurveyNumberValue(event.target.value);
    setShowHissaNumberInput(false);
    setShowGetDataButton(false);

    setFlagButton2(false);
    setArea('');
    setAssessment('');
    setHissaNumberValue(event);
    Form1.resetFields();
    // console.log(event.target.value);
  }

  function handleChangeForHissaNo(event) {
    setRequiredHissa(true);
    setHissaNumberValue(event);
    // console.log(event);
    setFlagButton2(false);
    setShowGetDataButton(true);
    setArea('');
    setAssessment('');
  }

  function cancel(e) {
    message.error('request cancelled !!!');
  }

  const resetFrom = () => {
    form1B.resetFields();
    setArea('');
    setAssessment('');
    setHissaNumberValue('');
    setShowHissaNumberInput(false);
    setShowGetDataButton(false);

    setFlagButton2(false);
  };

  const cancelForm = () => {
    history.push({
      pathname: `/form/village-form-1B/table-form`,
    });
  };

  const saveForm1B = async () => {
    const inputParameters = {
      revenueYear: revenueYear,
      districtCode: districtCode,
      talukaCode: talukaCode,
      cCode: codeVillage,
      pin: surveyNumberValue,
      hissaNo: hissaNumberValue,
      unassessedArea: form1B.getFieldValue('unassessedArea'),
      publicRightsOfWayAndEasements: form1B.getFieldValue('publicRightsOfWayAndEasements'),
      remarks: form1B.getFieldValue('remarks'),
    };
    sendRequest(
      `${URLS.BaseURL}/form1b/saveForm1B`,
      'POST',
      inputParameters,
      (res) => {
        // console.log('inputParameters OF Form1B Save API ==>>', inputParameters);
        // console.log('SAVE API CALEED --->', res.status);
        if (res.status === 201) {
          history.push({
            pathname: `/form/village-form-1B/table-form`,
          });
          message.success('Data Saved!!');
        }
      },
      (err) => {},

      'SURVEY',
    );
  };

  return (
    <>
      {/* <h1 style={{ textAlign: 'center' }}>REGISTER OF UNOCCUPIED (Goverment) LANDS</h1> */}
      <Form layout="vertical" form={form1B} /* onFinish={saveForm1B} */>
        <Card>
          <h1 style={{ textAlign: 'center' }}>
            <FormattedMessage id="formLanguage.label.villageForm1a" />
          </h1>

          <h1 style={{ textAlign: 'center' }}>
            <FormattedMessage id="formLanguage.label.villageForm1aa" />
          </h1>

          <Row style={{ marginTop: 20 }}>
            <Col span={24}>
              <VillageSelector
                pageType="withoutYear"
                setCodeVillage={setCodeVillage}
                setTextForVillage={setTextForVillage}
                onVillageChange={setFlagButton}
                yearChange={setRevenueYear}
              />
            </Col>
          </Row>

          {/* <Row> */}
          {
            <>
              <Row style={{ marginTop: '20px' }}>
                {/* <Col> */}

                {/* <Form layout="inline"> */}
                <Col xl={6}>
                  <Form.Item
                    // labelCol={{ span: 10 }}
                    // wrapperCol={{ span: 14 }}
                    label={<FormattedMessage id="formLanguage.table.surveyNo" />}
                    name="surveyNumber"
                    rules={[
                      {
                        required: true,
                        message: <FormattedMessage id="formLanguage.table.ruleSurveyNo" />,
                      },
                    ]}
                    // style={{ marginLeft: '9px' }}
                  >
                    <Input
                      onKeyPress={KeyPressEvents.isInputNumber}
                      maxLength={7}
                      onChange={handleChangeForSurveyNo}
                    />
                  </Form.Item>
                </Col>
                <Col xl={1}></Col>
                <Col xl={1}>
                  <Button
                    style={{ marginTop: '28px' }}
                    type="primary"
                    //  disabled={flagButton || flagButton2}
                    onClick={() => {
                      if (textForVillage && surveyNumberValue) {
                        getHissaFromSurvey();
                      } else if (textForVillage == null) {
                        message.info('Please Select Village');
                      } else if (surveyNumberValue == null) {
                        message.info('Please Enter Survey Number');
                      }
                    }}
                  >
                    <FormattedMessage id="formLanguage.button.search" />
                  </Button>
                </Col>
                <Col xl={1}></Col>
                <Col xl={6}>
                  <Form form={Form1}>
                    {showHissaNumberInput && (
                      <Form.Item
                        // labelCol={{ span: 18 }}
                        // wrapperCol={{ span: 16 }}
                        label={<FormattedMessage id="formLanguage.form.hissaNo" />}
                        name="hissaNo"
                        // rules={[{ required: true, message: 'कृपया हिस्सा नंबर निवडा!' }]}
                        // style={{ marginLeft: '10px' }}
                      >
                        <Select
                          options={hissaNumber}
                          onSelect={(value, event) => handleChangeForHissaNo(value, event)}
                          placeholder=" हिस्सा नंबर निवडा"
                        ></Select>
                      </Form.Item>
                    )}
                  </Form>
                </Col>
                <Col xl={1}></Col>
                <Col>
                  {showGetDataButton && (
                    <Form.Item>
                      <Button
                        style={{ marginTop: '28px' }}
                        type="primary"
                        onClick={getAreaAndAssessment}
                      >
                        <FormattedMessage id="formLanguage.form.showArea" />
                      </Button>
                    </Form.Item>
                  )}
                </Col>

                {/* </Form> */}
                {/* </Col> */}
              </Row>
            </>
          }
          {/* </Row> */}
          {showGetDataButton && (
            <>
              <Row style={{ paddingTop: 25 }}>
                {showAreaAndAssessment && (
                  <>
                    <Row>
                      <Col span={10}>
                        <Input
                          addonBefore={<FormattedMessage id="formLanguage.form.Area" />}
                          disabled
                          value={area}
                        ></Input>
                      </Col>
                      <Col span={1}></Col>
                      <Col span={10}>
                        <Input
                          addonBefore={<FormattedMessage id="formLanguage.form.assessment" />}
                          disabled
                          value={assessment}
                        ></Input>
                      </Col>
                    </Row>
                  </>
                )}
              </Row>
            </>
          )}
        </Card>

        <Card>
          {/* 2ndCard */}

          <Divider orientation="left">
            <FormattedMessage id="formLanguage.form.echawdi" />
          </Divider>

          <Row>
            <Col xl={11} lg={11} md={11} sm={24} xs={24}>
              <Form.Item
                label={<FormattedMessage id="formLanguage.form.unAssessedArea" />}
                name="unassessedArea"
                rules={[
                  {
                    required: true,
                    message: <FormattedMessage id="formLanguage.form.ruleUnAssessedArea" />,
                  },
                  {
                    max: 18,
                    message: 'Unassessed Area shoud be upto 18 numbers',
                  },
                ]}
              >
                <Input onKeyPress={KeyPressEvents.isInputDecimal} maxLength={19} />
              </Form.Item>
            </Col>
            <Col xl={1} lg={1} md={1}></Col>
            <Col xl={11} lg={11} md={11} sm={24} xs={24}>
              <Form.Item
                label={<FormattedMessage id="formLanguage.table.publicRights" />}
                name="publicRightsOfWayAndEasements"
                rules={[
                  {
                    required: true,
                    message: <FormattedMessage id="formLanguage.form.rulePublicRightsOfWay" />,
                  },
                  {
                    max: 200,
                    message: 'Rights shoud be upto 200 characters',
                  },
                ]}
              >
                <Input onKeyPress={KeyPressEvents.isInputChar} maxLength={201} />
              </Form.Item>
            </Col>
          </Row>
          {/* 3rdRow */}
          <Row>
            <Col xl={23} lg={23} md={23} sm={24} xs={24}>
              <Form.Item
                label={<FormattedMessage id="formLanguage.table.remark" />}
                name="remarks"
                rules={[
                  // {
                  //   required: true,
                  //   message: <FormattedMessage id="formLanguage.table.ruleRemark" />,
                  // },
                  { max: 300, message: 'Remark shoud be upto 300 characters' },
                ]}
              >
                <Input.TextArea
                  onKeyPress={KeyPressEvents.isInputChar}
                  maxLength={301}
                  placeholder="येथे टिप्पणी प्रविष्ट करा"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row style={{ marginTop: 20 }}>
            <Col xl={8} lg={4} md={4} sm={5}></Col>
            <Col xl={2} lg={2} md={1} sm={1} xs={1}>
              <Button
                type="primary"
                htmlType="submit"
                onClick={() => {
                  if (textForVillage && surveyNumberValue && requiredHissa && area) {
                    saveForm1B();
                  } else if (textForVillage == null) {
                    message.info('Please Select Village');
                  } else if (surveyNumberValue == null) {
                    message.info('Please Enter Survey Number');
                  } else if (requiredHissa == false) {
                    message.info('Please Search for Hissa Number');
                  } else if (area == false) {
                    message.info('Please Search for e-Ferfar Details');
                  }
                }}
              >
                <FormattedMessage id="formLanguage.button.save" />
              </Button>
              {/* </Popconfirm> */}
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
      </Form>
    </>
  );
}
export default Form1B;
