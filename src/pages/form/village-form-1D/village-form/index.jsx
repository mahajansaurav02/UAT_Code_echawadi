import VillageSelector from '@/components/eComponents/VillageSelector';
import { SearchOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  message,
  Popconfirm,
  Row,
  Select,
  Tooltip,
} from 'antd';
import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import URLS from '@/URLs/urls';
import useAxios from '@/components/eComponents/use-axios';
import { FormattedMessage, useModel } from 'umi';
import KeyPressEvents from '@/util/KeyPressEvents';

function Form1B() {
  const { sendRequest } = useAxios();
  const { districtName, servarthId, districtCode, talukaCode } = useModel('details');
  const [codeVillage, setCodeVillage] = useState('');
  const [textForVillage, setTextForVillage] = useState();
  const [village, setVillage] = useState([]);
  const [hissaNumber, setHissaNumber] = useState([]);
  const [hissaNumberValue, setHissaNumberValue] = useState([]);
  const [surveyNumberValue, setSurveyNumberValue] = useState();
  const [form] = Form.useForm();
  const [form1] = Form.useForm();

  let history = useHistory();
  let pin1 = hissaNumberValue.slice(0, 1);
  const [revenueYear, setRevenueYear] = useState();
  const [requiredHissa, setRequiredHissa] = useState(false);
  const [validStateEFerfar, setValidStateEFerfar] = useState(false);
  const [showHissaInput, setShowHissaInput] = useState(false);
  const [showGetDataButton, setShowGetDataButton] = useState(false);
  const [rulesValue, setRulesValue] = useState();

  function handleChangeForSurveyNo(event) {
    setSurveyNumberValue(event.target.value);
    form.resetFields();
    form1.resetFields();
    setShowHissaInput(false);
    setShowGetDataButton(false);
    setHissaNumber([]);
    setValidStateEFerfar(false);
  }

  function handleChangeForHissaNo(event) {
    setRequiredHissa(true);
    setHissaNumberValue(event);
    setShowGetDataButton(true);
  }

  const handleChangeForRules = (e) => {
    setRulesValue(e);
  };

  const resetForm = () => {
    form.resetFields();
    form1.resetFields();
    setShowHissaInput(false);
    setShowGetDataButton(false);
    setHissaNumber([]);
    setValidStateEFerfar(false);
  };

  const success = () => {
    message.success('Data Saved!!');
  };

  function cancel(e) {
    // console.log(e);
    message.error('Request Cancelled !!!');
  }

  const cancelForm = () => {
    history.push({
      pathname: `/form/village-form-1D/table-form`,
    });
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
        setShowHissaInput(true);
      },
    ).catch((error) => {
      message.error('Invalid Survey Number!!!');
    });
  };

  const onFinish = async (values) => {
    const article = {
      revenueYear: revenueYear,
      districtCode: districtCode,
      talukaCode: talukaCode,
      cCode: codeVillage,
      hissaNo: hissaNo,
      remarks: form.getFieldValue('remarks'),
      pin: surveyNumberValue,
      hissaNo: hissaNumberValue,
      assessment: form.getFieldValue('assessment'),
      totalAreaH: form.getFieldValue('totalAreaH'),
      rules: rulesValue,
    };
    if (validStateEFerfar == false) {
      message.info('Please Fetch Eferfar Data !');
    }
    sendRequest(`${URLS.BaseURL}/form1d/saveForm1D`, 'POST', article, (res) => {
      if (res.status === 201) {
        success();
        form.resetFields();
        history.push({
          pathname: `/form/village-form-1D/table-form`,
        });
      }
    });
  };

  const getFerfarData = async () => {
    sendRequest(
      `${URLS.BaseURL}/form1d/getForm1DArea?districtCode=${districtCode}&talukaCode=${talukaCode}&cCode=${codeVillage}&pin=${surveyNumberValue}&pin1=${pin1}&hissaNo=${hissaNumberValue}`,
      'GET',
      null,
      (r) => {
        form.setFieldsValue({
          surveyNo: r.data[0].pin,
          hissaNo: r.data[0].hissaNo,
          totalAreaH: r.data[0].totalAreaH,
          assessment: r.data[0].assessment,
          irrigatedArea: r.data[0].irrigatedArea,
          unirrigatedArea: r.data[0].unirrigatedArea,
        });
        setValidStateEFerfar(true);
        if (r.status === 200) {
          message.success('E-ferfar Data Fetched');
        }
      },
      (err) => {},
    );
  };

  const onFinishFailed = ({ values, errorFields, outOfDate }) => {
    // console.log('Finish Failed called', values, errorFields, outOfDate);
  };
  return (
    <>
      <Form layout="horizontal" form={form1}>
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
          <Row style={{ marginTop: '35px' }}>
            <Col span={24}>
              <VillageSelector
                pageType="withoutYear"
                setCodeVillage={setCodeVillage}
                setTextForVillage={setTextForVillage}
                onVillageChange={setVillage}
                yearChange={setRevenueYear}
              />
            </Col>
          </Row>

          <Row style={{ marginTop: 20 }}>
            <Col xl={7} lg={8} md={18} sm={16} xs={17}>
              <Form.Item
                labelCol={{ lg: 11, xs: 8 }}
                wrapperCol={{ lg: 12, xs: 10 }}
                label={<FormattedMessage id="formLanguage.table.surveyNo" />}
                rules={[
                  { required: 'true', message: 'सर्वेक्षण क्रमांक आवश्यक आहे' },
                  { max: 7, message: 'Survey Number shoud be upto 7 numbers' },
                ]}
              >
                <Input
                  name="surveyNo"
                  onKeyPress={KeyPressEvents.isInputNumber}
                  /* addonBefore={<FormattedMessage id="formLanguage.table.surveyNo" />} */
                  maxLength={8}
                  placeholder="सर्वेक्षण क्रमांक प्रविष्ट करा"
                  onChange={handleChangeForSurveyNo}
                />
              </Form.Item>
            </Col>
            <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>
            <Col xl={2} lg={2} md={1} sm={1} xs={1}>
              <Button
                type="primary"
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
                {<FormattedMessage id="formLanguage.button.search" />}
              </Button>
            </Col>
            <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>
            {showHissaInput && (
              <>
                <Col xl={6} lg={8} md={18} sm={16} xs={16}>
                  <Form.Item
                    labelCol={{ lg: 10, xs: 8 }}
                    wrapperCol={{ lg: 12, xs: 10 }}
                    name="hissaNo"
                    label={<FormattedMessage id="formLanguage.form.hissaNo" />}
                    rules={[
                      //{ required: 'true', message: 'हिस्सा क्रमांक आवश्यक आहे' },
                      { type: '', max: 9 },
                    ]}
                  >
                    <Select
                      placeholder="हिस्सा क्रमांक प्रविष्ट करा"
                      options={hissaNumber}
                      onSelect={(value, event) => handleChangeForHissaNo(value, event)}
                    />
                  </Form.Item>
                </Col>
              </>
            )}

            <Col xl={1} md={1} sm={1}></Col>
            {showGetDataButton && (
              <>
                <Col xl={4} lg={1} md={1} sm={1} xs={1}>
                  <Button
                    type="primary"
                    onClick={() => {
                      if (textForVillage && surveyNumberValue && requiredHissa) {
                        getFerfarData();
                      } else if (textForVillage == null) {
                        message.info('Please Select Village');
                      } else if (surveyNumberValue == null) {
                        message.info('Please Select Survey Number');
                      } else if (requiredHissa == false) {
                        message.info('Please Search for Hissa Number');
                      }
                    }}
                  >
                    <FormattedMessage id="formLanguage.button.getFerfar" />
                  </Button>
                </Col>
              </>
            )}

            <Row>
              <Col xl={2}></Col>
            </Row>
          </Row>
        </Card>
      </Form>
      <Form layout="vertical" form={form} /* onFinish={onFinish} */ onFinishFailed={onFinishFailed}>
        {/* //2ndCard */}

        <Card>
          <Divider orientation="left">
            <FormattedMessage id="formLanguage.form.eFerfar" />
          </Divider>

          <Row>
            <Col xl={11} lg={11} md={11} sm={24} xs={24}>
              <Form.Item name="totalAreaH" label={<FormattedMessage id="formLanguage.form.Area" />}>
                <Input
                  disabled
                  // placeholder="क्षेत्र प्रविष्ट करा"
                  addonAfter={<FormattedMessage id="formLanguage.form.unitOfArea" />}
                />
              </Form.Item>
            </Col>
            <Col xl={2} lg={2} md={2}></Col>
            <Col xl={11} lg={11} md={11} sm={24} xs={24}>
              <Form.Item
                name="assessment"
                label={<FormattedMessage id="formLanguage.form.assessment" />}
              >
                <Input
                  disabled
                  // placeholder="मूल्यांकन क्रमांक प्रविष्ट करा"
                  addonAfter={<FormattedMessage id="formLanguage.form.rupees" />}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <h3 style={{ marginTop: 5 }}>
              <b>
                <FormattedMessage id="formLanguage.form.classificationOfLand" />
              </b>
            </h3>
          </Row>
          <Row>
            <Col xl={11} lg={11} md={11} sm={24} xs={24}>
              <Form.Item
                name="irrigatedArea"
                label={<FormattedMessage id="formLanguage.form.irrigated" />}
              >
                <Input
                  disabled
                  // placeholder="सिंचित क्षेत्र प्रविष्ट करा"
                  addonAfter={<FormattedMessage id="formLanguage.form.unitOfArea" />}
                />
              </Form.Item>
            </Col>
            <Col xl={2} lg={2} md={2}></Col>
            <Col xl={11} lg={11} md={11} sm={24} xs={24}>
              <Form.Item
                name="unirrigatedArea"
                label={<FormattedMessage id="formLanguage.form.unIrrigated" />}
              >
                <Input
                  disabled
                  //  placeholder="सिंचित नसलेले क्षेत्र प्रविष्ट करा"
                  addonAfter={<FormattedMessage id="formLanguage.form.unitOfArea" />}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>
        <Card>
          <Divider orientation="left">
            <FormattedMessage id="formLanguage.form.echawdi" />
          </Divider>
          <Row>
            <Col xl={11} lg={11} md={11} sm={24} xs={24}>
              <Form.Item
                name="rules"
                label={<FormattedMessage id="VillageForm1D.form.rules" />}
                rules={[
                  {
                    required: 'true',
                    message: 'This field is required',
                  },
                  // { type: 'string', max: 200, message: 'Remarks shoud be upto 200 characters' },
                ]}
              >
                <Select
                  onSelect={(e) => {
                    handleChangeForRules(e);
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
            <Col xl={2} lg={2} md={2}></Col>
            <Col xl={11} lg={11} md={11} sm={24} xs={24}>
              <Form.Item
                name="remarks"
                label={<FormattedMessage id="VillageForm1D.form.remarks" />}
                rules={[
                  // {
                  //   required: 'true',
                  //   message: <FormattedMessage id="formLanguage.table.ruleRemark" />,
                  // },
                  { type: 'string', max: 200, message: 'Remarks shoud be upto 200 characters' },
                ]}
              >
                <Input.TextArea
                  onKeyPress={KeyPressEvents.isInputChar}
                  // placeholder="अभिप्राय  प्रविष्ट करा"
                  maxLength={201}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col xl={8} lg={8} md={8} sm={5}></Col>
            <Col xl={2} lg={2} md={2} sm={2} xs={1}>
              <Button
                type="primary"
                htmlType="submit"
                onClick={() => {
                  if (textForVillage && surveyNumberValue && requiredHissa && validStateEFerfar) {
                    onFinish();
                  } else if (textForVillage == null) {
                    message.info('Please Select Village');
                    /*    disableButtonTimer(); */
                  } else if (surveyNumberValue == null) {
                    message.info('Please Enter Survey Number');
                  } else if (requiredHissa == false) {
                    message.info('Please Search for Hissa Number');
                  } else if (validStateEFerfar == false) {
                    message.info('Please Fetch EFerfar Data !');
                  }
                }}
              >
                <FormattedMessage id="formLanguage.button.save" />
              </Button>
              {/*  </Popconfirm> */}
            </Col>
            <Col lg={2} md={2} sm={3} xs={8}></Col>
            <Col xl={2} lg={2} md={2} sm={2} xs={1}>
              <Button
                type=""
                onClick={resetForm}
                style={{ color: 'white', backgroundColor: 'orange' }}
              >
                <FormattedMessage id="formLanguage.button.reset" />
              </Button>
            </Col>
            <Col lg={2} md={2} sm={3} xs={8}></Col>
            <Col xl={2} lg={2} md={2} sm={2} xs={1}>
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
