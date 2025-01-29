import ESelector from '@/components/eComponents/ESelector';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card, Col, DatePicker, Form, Input, message, Popconfirm, Row, Select } from 'antd';
import React, { useState, useEffect } from 'react';
import { FormattedMessage, useModel } from 'umi';
import URLS from '@/URLs/urls';
import useAxios from '@/components/eComponents/use-axios';
import { useHistory, useLocation } from 'react-router';
import moment from 'moment';
import VillageSelector from '@/components/eComponents/VillageSelector';
import axios from 'axios';
import KeyPressEvents from '@/util/KeyPressEvents';

function VillageForm1c() {
  useEffect(() => {
    getDataVillage();
  }, []);
  const { token } = useModel('Auth');
  const Header = `Bearer ${token}`;
  const [name, setName] = useState();
  const [village, setVillage] = useState([]);
  const [authorityValue, setAuthorityValue] = useState();
  const [textForVillage, setTextForVillage] = useState();
  const [showSurveyNumberDropBox, setShowSurveyNumberDropBox] = useState(false);
  const { sendRequest } = useAxios();
  const [showGetDataButton, setShowGetDataButton] = useState(false);
  const [surveyNumberValue, setSurveyNumberValue] = useState();
  const [hissaNumberValue, setHissaNumberValue] = useState([]);
  const [codeVillage, setCodeVillage] = useState('');
  const [flagButton2, setFlagButton2] = useState(true);
  const [showArea, setShowArea] = useState(false);
  const [area, setArea] = useState();
  const [assessment, setAssessment] = useState();
  const [form1c] = Form.useForm();
  const [SurveyField] = Form.useForm();
  let history = useHistory();
  const [partState, setPartState] = useState();
  const { districtName, servarthId, districtCode, talukaCode, talukaName } = useModel('details');
  const [revenueYear, setRevenueYear] = useState();
  const [surveyNumbers, setSurveyNumbers] = useState();
  const [data, setData] = useState();
  const echHost = localStorage.getItem('echHost');
  const mhrHost = localStorage.getItem('mhrHost');
  const echDbName = localStorage.getItem('echDbName');
  const echSchemaName = localStorage.getItem('echSchemaName');
  const mhrDbName = localStorage.getItem('mhrDbName');
  const mhrSchemaName = localStorage.getItem('mhrSchemaName');

  const getDataVillage = async () => {
    // console.log('Village API Called', URLS.BaseURL);
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
  const handleOnChange = (value, event) => {
    setShowSurveyNumberDropBox(true);
    setSurveyNumbers('');
    SurveyField.resetFields();
    setCodeVillage(value);
    setTextForVillage(event.label);
    // console.log('Name of Village ==>>', event.label, 'cCode==>>', value);
    getArea(value);
    setShowArea(false);
  };
  const getArea = async (value) => {
    sendRequest(
      `${URLS.BaseURL}/form1c/getForm1CeFerfarData?districtCode=${districtCode}&talukaCode=${talukaCode}&cCode=${value}`,
      'GET',
      null,
      (res) => {
        setSurveyNumbers(
          res.data.form1CData.map((r) => ({
            label: r.pin,
            value: r.pin,
          })),
        );
        if (res.status != 200) {
          setShowSurveyNumberDropBox(false);
        }
        setData(
          res.data.form1CData.map((r) => ({
            key: r.pin,
            value: r,
          })),
        );
      },
    );
  };

  const handleOnChangeForSurveyNumber = (e) => {
    setSurveyNumberValue(e);
    // console.log('New Test ', data.find((obj) => obj.key === e).value);
    setArea(data.find((obj) => obj.key === e).value.totalAreaH);
    setAssessment(data.find((obj) => obj.key === e).value.assessment);
    setName(data.find((obj) => obj.key === e).value.khataOwnerName);
    message.success('Data Fetched !');
    setShowArea(true);
  };

  const onFinishFailed = ({ values, errorFields, outOfDate }) => {
    // console.log('Finish Failed called', values, errorFields, outOfDate);
  };

  const resetForm = () => {
    form1c.resetFields();
  };

  const success = () => {
    message.success('Data Saved !!!');
  };

  const onFormFinish = async () => {
    const article = {
      cCode: codeVillage,
      districtCode: districtCode,
      talukaCode: talukaCode,
      pin: surveyNumberValue,
      nameOfVillagePanchayat: form1c.getFieldValue('nameOfVillagePanchayat'),
      termsOfGrant: form1c.getFieldValue('termsOfGrant'),
      remarks: form1c.getFieldValue('remarks'),
    };
    // console.log('values being sent to api', article);
    sendRequest(`${URLS.BaseURL}/form1c/saveForm1C`, 'POST', article, (res) => {
      if (res.status === 201) {
        success();
        form1c.resetFields();
        history.push({
          pathname: `/form/village-form-1c/table-form`,
        });
      }
    });
  };

  return (
    <div>
      <>
        <Card>
          <Row>
            <Col xl={8} lg={8} md={8} sm={7} xs={6}></Col>

            <Col xl={7} lg={7} md={7} sm={9} xs={11}>
              <h2>
                <center>
                  <FormattedMessage id="form1c.report.headings1" />
                </center>
              </h2>
            </Col>
            <Col xl={7} lg={7} md={7} sm={6} xs={2}></Col>

            {/*   <Col xl={2} lg={2} md={2} sm={2} xs={2}>
                <Button type="primary" >
                  <FormattedMessage id="formLanguage.button.add" />
                </Button>
              </Col> */}
          </Row>
          <Row>
            <Col xl={6} lg={6} md={6} sm={6} xs={6}></Col>
            <Col xl={12} lg={12} md={12} sm={12} xs={12}>
              <h3>
                <center>
                  <FormattedMessage id="form1c.report.headings2" />
                </center>
              </h3>
            </Col>
            <Col xl={6} lg={6} md={6} sm={6} xs={6}></Col>
          </Row>

          <Form layout="horizontal">
            <Row style={{ marginTop: 10 }}>
              <Col xl={5} lg={5} md={24} sm={24} xs={24}>
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
                    onSelect={(value, event) => handleOnChange(value, event)}
                  ></Select>
                </Form.Item>
              </Col>
            </Row>
          </Form>
          {showSurveyNumberDropBox && (
            <>
              <Form form={SurveyField} layout="vertical">
                <Form.Item
                  required
                  name="surveyNumbers"
                  wrapperCol={{ xl: 20, lg: 15 }}
                  label={<FormattedMessage id="form2.table.survey" />}
                >
                  <Select
                    options={surveyNumbers}
                    placeholder="Select Survey Number"
                    onSelect={(e) => handleOnChangeForSurveyNumber(e)}
                  ></Select>
                </Form.Item>
              </Form>
            </>
          )}
          {showArea && (
            <>
              <Row>
                <Col xl={7} lg={7} md={7} sm={7} xs={24}>
                  <Input
                    addonBefore={<FormattedMessage id="form1c.labels.nameOfApplicant" />}
                    disabled
                    value={name}
                  ></Input>
                </Col>
                <Col xl={1} lg={1} md={1} sm={1}></Col>
                <Col xl={7} lg={7} md={7} sm={7} xs={24}>
                  <Input
                    addonBefore={<FormattedMessage id="formLanguage.form.Area" />}
                    disabled
                    value={area}
                  ></Input>
                </Col>
                <Col xl={1} lg={1} md={1} sm={1}></Col>
                <Col xl={7} lg={7} md={7} sm={7} xs={24}>
                  <Input
                    addonBefore={<FormattedMessage id="demandGeneration.table.assessment" />}
                    disabled
                    value={assessment}
                  ></Input>
                </Col>
              </Row>
            </>
          )}
        </Card>
        <Card>
          <Form
            layout="vertical"
            form={form1c}
            /*    onFinish={onFormFinish} */
            onFinishFailed={onFinishFailed}
          >
            <Row>
              <Col xl={7} lg={7} md={7} sm={7} xs={24}>
                <Form.Item
                  name="nameOfVillagePanchayat"
                  rules={[{ required: true, message: 'This Field Is Required..' }]}
                  label={<FormattedMessage id="form1c.labels.nameOfVillagePanchayat" />}
                >
                  <Input.TextArea
                    maxLength={51}
                    onKeyPress={KeyPressEvents.isInputVarchar}
                  ></Input.TextArea>
                </Form.Item>
              </Col>
              <Col xl={1} lg={1} md={1} sm={1}></Col>
              <Col xl={7} lg={7} md={7} sm={7} xs={24}>
                <Form.Item
                  name="termsOfGrant"
                  rules={[{ required: true, message: 'This Field Is Required..' }]}
                  label={<FormattedMessage id="form1c.labels.termsOfGrant" />}
                >
                  <Input.TextArea
                    maxLength={51}
                    onKeyPress={KeyPressEvents.isInputVarchar}
                  ></Input.TextArea>
                </Form.Item>
              </Col>
              <Col xl={1} lg={1} md={1} sm={1}></Col>
              <Col xl={7} lg={7} md={7} sm={7} xs={24}>
                <Form.Item
                  name="remarks"
                  rules={[{ required: true, message: 'This Field Is Required..' }]}
                  label={<FormattedMessage id="form1c.labels.remarks" />}
                >
                  <Input.TextArea
                    maxLength={51}
                    onKeyPress={KeyPressEvents.isInputVarchar}
                  ></Input.TextArea>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col sm={2} md={4} lg={4} xl={8}></Col>
              <Col xs={1} sm={1} md={1} lg={2} xl={2}>
                <Button
                  type="primary"
                  htmlType="submit"
                  onClick={() => {
                    if (textForVillage && surveyNumberValue) {
                      onFormFinish();
                    } else if (textForVillage == null) {
                      message.info('Please Select Village');
                    } else if (surveyNumberValue == null) {
                      message.info('Please Enter Survey Number');
                    }
                  }}
                >
                  <FormattedMessage id="formLanguage.button.save" />
                </Button>
              </Col>
              <Col xl={1} lg={2} md={3} sm={4} xs={8}></Col>
              <Col xl={2} lg={2} md={1} sm={1} xs={1}>
                <Button onClick={resetForm} style={{ color: 'white', backgroundColor: 'orange' }}>
                  <FormattedMessage id="formLanguage.button.reset" />
                </Button>
              </Col>

              <Col xl={1} lg={2} md={3} sm={4} xs={8}></Col>
              <Col xl={2} lg={2} md={1} sm={1} xs={1}>
                <Button
                  onClick={() => {
                    history.push({
                      pathname: `/form/village-form-1c/table-form`,
                    });
                  }}
                  type="danger"
                  htmlType=""
                >
                  <FormattedMessage id="formLanguage.button.cancel" />
                </Button>
              </Col>
            </Row>
          </Form>
        </Card>
      </>
    </div>
  );
}

export default VillageForm1c;
