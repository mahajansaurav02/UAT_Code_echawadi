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
import Selector from '@/pages/transactions/common/selector';
import KeyPressEvents from '@/util/KeyPressEvents';
import moment from 'moment';
import Axios from 'axios';

function Form6D() {
  /*  useEffect(() => {
    getDataVillage();
  }, []); */

  const { sendRequest } = useAxios();
  const { districtName, servarthId, districtCode, talukaCode, talukaName } = useModel('details');
  const [form6D] = Form.useForm();
  const [codeVillage, setCodeVillage] = useState('');
  const [isNirank, setIsNirank] = useState(false);
  const [flagButton2, setFlagButton2] = useState(true);
  const [showGetDataButton, setShowGetDataButton] = useState(false);
  const [surveyNumberValue, setSurveyNumberValue] = useState();
  const [hissaNumber, setHissaNumber] = useState([]);
  const [data, setData] = useState();

  const [hissaNumberValue, setHissaNumberValue] = useState();
  const [mutNo, setMutNo] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  let history = useHistory();
  const [form] = Form.useForm();
  const [form1] = Form.useForm();

  const [revenueYear, setRevenueYear] = useState();
  const [village, setVillage] = useState([]);
  const { token } = useModel('Auth');
  const Header = `Bearer ${token}`;
  const [textForVillage, setTextForVillage] = useState();
  const [surveyNumbers, setSurveyNumbers] = useState();

  const handleOnChange = (value, event) => {
    setCodeVillage(value);
    setTextForVillage(event.label);
    setSurveyNumberValue('');
  };

  const success = () => {
    message.success('Data Saved !!!');
  };

  const getHissaAndMutFromSurvey = async () => {
    setSearchLoading(true);
    sendRequest(
      `${URLS.BaseURL}/form6D/getForm6DEferfarDetail?districtCode=${districtCode}&talukaCode=${talukaCode}&cCode=${codeVillage}&pin=${surveyNumberValue}&marked=Y`,
      'GET',
      null,
      (response) => {
        setHissaNumber(
          response.data.map((row) => ({
            label: row.hissaNo == '' ? 'निरंक' : row.hissaNo,
            value: row.hissaNo,
          })),
        );
        setSearchLoading(false);
      },
      (err) => {
        setSearchLoading(false);
      },
    );
  };

  const onFinish = async () => {
    setIsLoading(true);

    const article = {
      districtCode: districtCode,
      talukaCode: talukaCode,
      cCode: codeVillage,
      hissaNo: hissaNumberValue,
      pin: surveyNumberValue,
      mutationEntryInVillageForm6: form.getFieldValue('mutationEntryInVillageForm6'),
      natureOfChangeInMap: form.getFieldValue('natureOfChangeInMap'),
      dateOfChange: form.getFieldValue('dateOfChange')
        ? moment(form.getFieldValue('dateOfChange'), 'DD/MM/YYYY').format('YYYY-MM-DD')
        : null,
      byWhomDone: form.getFieldValue('byWhomDone'),
    };
    sendRequest(
      `${URLS.BaseURL}/form6D/saveForm6D`,
      'POST',
      article,
      (res) => {
        if (res.status === 201) {
          success();
          form.resetFields();
          history.push({
            pathname: `/form/village-form-6D/table-form`,
          });
          setIsLoading(false);
        }
      },
      (err) => {
        setIsLoading(false);
      },
    );
  };

  function handleChangeForSurveyNo(event) {
    form1.resetFields();
    form.resetFields();
    setMutNo('');
    setSurveyNumberValue(event.target.value);
  }

  function handleChangeForHissaNo(e) {
    // console.log('hissano-->', e);
    setHissaNumberValue(e);
    sendRequest(
      `${URLS.BaseURL}/form6D/getForm6DEferfarDetails?districtCode=${districtCode}&talukaCode=${talukaCode}&cCode=${codeVillage}&pin=${surveyNumberValue}&hissaNo=${e}&marked=Y`,
      'GET',
      null,
      (response) => {
        setMutNo(
          response.data.map((row) => ({
            label: row.mutationEntryInVillageForm6,
            value: row.mutationEntryInVillageForm6,
          })),
        );
      },
    );
  }

  const resetFrom = () => {
    form.resetFields();
  };

  const cancelForm = () => {
    history.push({
      pathname: `/form/village-form-6D/table-form`,
    });
  };

  return (
    <>
      <Form layout="horizontal" form={form1}>
        <Card>
          <h1 style={{ textAlign: 'center' }}>
            <FormattedMessage id="formLanguage.label.villageForm6D" />
          </h1>
          <h1 style={{ textAlign: 'center' }}>
            <FormattedMessage id="formLanguage.label.villageForm6DD" />
          </h1>

          <Row style={{ marginTop: '35px' }}>
            <Col span={24}>
              <VillageSelector
                pageType="withoutYear"
                setCodeVillage={setCodeVillage}
                setTextForVillage={setTextForVillage}
                onVillageChange={setVillage}
                yearChange={setRevenueYear}
                setIsNirank={setIsNirank}
              />
            </Col>
          </Row>

          <Row style={{ marginTop: 20 }}>
            <Col xl={9} lg={9} md={9} sm={24} xs={24}>
              <Form.Item
                label={<FormattedMessage id="formLanguage.table.surveyNo" />}
                rules={[
                  { required: 'true', message: 'सर्वेक्षण क्रमांक आवश्यक आहे' },
                  { max: 7, message: 'Survey Number shoud be upto 7 numbers' },
                ]}
              >
                <Input
                  name="surveyNo"
                  onKeyPress={KeyPressEvents.isInputNumber}
                  maxLength={8}
                  placeholder="सर्वेक्षण क्रमांक प्रविष्ट करा"
                  onChange={handleChangeForSurveyNo}
                />
              </Form.Item>
            </Col>
            <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>
            <Col xl={2} lg={2} md={1} sm={1} xs={1}>
              {!isNirank && (
                <Button
                  type="primary"
                  loading={searchLoading}
                  onClick={() => {
                    if (textForVillage && surveyNumberValue) {
                      getHissaAndMutFromSurvey();
                    } else if (textForVillage == null) {
                      message.info('Please Select Village !');
                    } else if (surveyNumberValue == null) {
                      message.info('Please Enter Survey Number !');
                    }
                  }}
                >
                  {<FormattedMessage id="formLanguage.button.search" />}
                </Button>
              )}
            </Col>
            <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>

            <Col Col xl={9} lg={9} md={9} sm={24} xs={24}>
              {!isNirank && (
                <Form.Item
                  labelCol={{ lg: 10, xs: 8 }}
                  wrapperCol={{ lg: 12, xs: 10 }}
                  name="hissaNo"
                  label={<FormattedMessage id="formLanguage.form.hissaNo" />}
                >
                  <Select
                    placeholder="हिस्सा क्रमांक प्रविष्ट करा"
                    options={hissaNumber}
                    onSelect={(e) => handleChangeForHissaNo(e)}
                  />
                </Form.Item>
              )}
            </Col>
          </Row>
        </Card>
        {isNirank && (
          <Card>
            <Alert message="टीप" description="सदर गाव नमुना निरंक आहे." type="info" showIcon />
          </Card>
        )}
      </Form>
      {!isNirank && (
        <Form layout="vertical" form={form}>
          <Card>
            <Divider orientation="left">
              <FormattedMessage id="formLanguage.form.eFerfar" />
            </Divider>
            <Row>
              <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                {
                  <Form.Item
                    label={<FormattedMessage id="formLanguage.label.mutationEntryInVillageForm6" />}
                    name="mutationEntryInVillageForm6"
                    rules={[{ required: true, message: 'Mutation number is required' }]}
                  >
                    <Select options={mutNo} />
                  </Form.Item>
                }
              </Col>
            </Row>
          </Card>

          <Card>
            <Divider orientation="left">
              <FormattedMessage id="formLanguage.form.echawdi" />
            </Divider>
            <Row>
              <Col xl={7} lg={8} md={9} sm={24} xs={24}>
                <Form.Item
                  label={<FormattedMessage id="formLanguage.form.natureOfChangeRequiredInMap" />}
                  name="natureOfChangeInMap"
                  rules={[
                    {
                      required: true,
                      message: (
                        <FormattedMessage id="villageForm.form.ruleNatureOfChangeRequired" />
                      ),
                    },
                    { max: 50, message: 'This field shoud be upto 50 characters' },
                  ]}
                >
                  <Input onKeyPress={KeyPressEvents.isInputVarchar} maxLength={51} />
                </Form.Item>
              </Col>
              <Col xl={1} lg={1} md={1}></Col>
              <Col xl={7} lg={7} md={7} sm={24} xs={24}>
                <Form.Item
                  label={<FormattedMessage id="formLanguage.form.date" />}
                  name="dateOfChange"
                >
                  <DatePicker
                    style={{ width: '100%' }}
                    disabled={location.state?.pageMode === 'View'}
                  />
                </Form.Item>
              </Col>
              <Col xl={1} lg={1} md={1}></Col>
              <Col xl={7} lg={7} md={6} sm={24} xs={24}>
                <Form.Item
                  label={<FormattedMessage id="formLanguage.form.byWhomDone" />}
                  name="byWhomDone"
                  rules={[{ max: 50, message: 'This field shoud be below 50 characters' }]}
                >
                  <Input onKeyPress={KeyPressEvents.isInputVarchar} maxLength={51} />
                </Form.Item>
              </Col>
            </Row>

            <Row style={{ marginTop: 20 }}>
              <Col xl={8} lg={4} md={4} sm={5}></Col>
              <Col xl={2} lg={2} md={1} sm={1} xs={1}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isLoading}
                  onClick={() => {
                    // console.log('hissaNumberValue', hissaNumberValue);
                    if (
                      textForVillage &&
                      surveyNumberValue &&
                      (hissaNumberValue === '' || hissaNumberValue)
                    ) {
                      onFinish();
                    } else if (textForVillage == null) {
                      message.info('Please Select Village !');
                    } else if (surveyNumberValue == null) {
                      message.info('Please Enter Survey Number !');
                    } else if (!hissaNumberValue) {
                      message.info('Please Select Hissa Number !');
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
        </Form>
      )}
    </>
  );
}
export default Form6D;
