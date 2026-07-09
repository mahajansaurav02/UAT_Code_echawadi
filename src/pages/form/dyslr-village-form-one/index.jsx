import ESelector from '@/components/eComponents/ESelector';
import { PageContainer } from '@ant-design/pro-layout';
import {
  Alert,
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  message,
  Popconfirm,
  Row,
  Select,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { FormattedMessage, useModel, useHistory, useLocation } from 'umi';
import URLS from '@/URLs/urls';
import useAxios from '@/components/eComponents/use-axios';
import { Option } from 'antd/lib/mentions';
import KeyPressEvents from '@/util/KeyPressEvents';
import axios from 'axios';
import VillageSelector from '@/components/eComponents/VillageSelector';

function DYSLRVillageFormOne() {
  const langType = localStorage.getItem('umi_locale');
  const { sendRequest } = useAxios();
  const [showGetDataButton, setShowGetDataButton] = useState(false);
  const [surveyNumberValue, setSurveyNumberValue] = useState();
  const [hissaNumberValue, setHissaNumberValue] = useState([]);
  const [textForVillage, setTextForVillage] = useState();
  const [codeVillage, setCodeVillage] = useState('');
  const [isNirank, setIsNirank] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [flagButton2, setFlagButton2] = useState(true);
  const [showArea, setShowArea] = useState(false);
  const [area, setArea] = useState();
  const [assessment, setAssessment] = useState();
  const [form] = Form.useForm();
  const { districtName, servarthId, districtCode, talukaCode, talukaName } = useModel('details');
  const [eferfarDataRetrieved, setEferfarDataRetrieved] = useState(false);
  const [validStateEFerfar, setValidStateEFerfar] = useState(false);
  const [village, setVillage] = useState([]);
  const { token } = useModel('Auth');
  const [landTypeArr, setLandTypeArr] = useState();
  const [landTypeValue, setLandTypeValue] = useState();
  const [loading, setLoading] = useState(false);
  const [ID, setID] = useState(null);
  const Header = `Bearer ${token}`;
  const echHost = localStorage.getItem('echHost');
  const mhrHost = localStorage.getItem('mhrHost');
  const echDbName = localStorage.getItem('echDbName');
  const echSchemaName = localStorage.getItem('echSchemaName');
  const mhrDbName = localStorage.getItem('mhrDbName');
  const mhrSchemaName = localStorage.getItem('mhrSchemaName');
  let history = useHistory();

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

  const handleOnChange = (value, event) => {
    setCodeVillage(value);
    setTextForVillage(event.label);
  };

  const resetForm = () => {
    form.resetFields();
  };

  const success = () => {
    message.success('Data Saved !!!');
  };

  const cancelForm = () => {
    history.push({
      pathname: `/homepage`,
    });
  };

  const getDataFor1Abstract = async () => {
    sendRequest(
      `${URLS.BaseURL}/form1Abstract/getForm1AbstractDataDyslr?cCode=${codeVillage}`,
      'GET',
      null,
      (r) => {
        setID(r.data.id);
        form.setFieldsValue({
          id: r.data.id,
          RevenueOrLeaseholdLandUnderSpecialAgreement:
            r.data.RevenueOrLeaseholdLandUnderSpecialAgreement,
          assignedForSpecialUse: r.data.assignedForSpecialUse,
          dumalaLandArea: r.data.dumala,
          forestArea: r.data.forest,
          kuran: r.data.kuran,
          freePastureCattleStand: r.data.freePastureCattleStand,
          villageSite: r.data.villageSite,
          tank: r.data.tank,
          burialGround: r.data.burialGround,
          railways: r.data.railways,
          potKharabAssignedRoadsWaterCourses: r.data.potKharabAssignedRoadsWaterCourses,
          roadsAndPath: r.data.roadsAndPath,
          pipeLineCanel: r.data.pipeLineCanel,
          CantonmentLandMilitaryCamp: r.data.CantonmentLandMilitaryCamp,
          schools: r.data.schools,
          dharmshalas: r.data.dharmshalas,
          srNoForNonAgricultureUse: r.data.srNoForNonAgricultureUse,
          riversNalas: r.data.riversNalas,
          nalas: r.data.nalas,
        });
        message.success('Data Fetched Successfully !');
      },
    );
  };

  const onFormFinish = async () => {
    setLoading(true);
    console.log('Saving with cCode:', codeVillage);
    const article = {
      cCode: codeVillage,
      districtCode: districtCode,
      talukaCode: talukaCode,
      landType: landTypeValue,
      id: ID,
      RevenueOrLeaseholdLandUnderSpecialAgreement: form.getFieldValue(
        'RevenueOrLeaseholdLandUnderSpecialAgreement',
      ),
      assignedForSpecialUse: form.getFieldValue('assignedForSpecialUse'),
      dumala: form.getFieldValue('dumalaLandArea'),
      forest: form.getFieldValue('forestArea'),
      kuran: form.getFieldValue('kuran'),
      freePastureCattleStand: form.getFieldValue('freePastureCattleStand'),
      villageSite: form.getFieldValue('villageSite'),
      tank: form.getFieldValue('tank'),
      burialGround: form.getFieldValue('burialGround'),
      railways: form.getFieldValue('railways'),
      potKharabAssignedRoadsWaterCourses: form.getFieldValue('potKharabAssignedRoadsWaterCourses'),
      roadsAndPath: form.getFieldValue('roadsAndPath'),
      pipeLineCanel: form.getFieldValue('pipeLineCanel'),
      CantonmentLandMilitaryCamp: form.getFieldValue('CantonmentLandMilitaryCamp'),
      schools: form.getFieldValue('schools'),
      dharmshalas: form.getFieldValue('dharmshalas'),
      srNoForNonAgricultureUse: form.getFieldValue('srNoForNonAgricultureUse'),
      riversNalas: form.getFieldValue('riversNalas'),
      nalas: form.getFieldValue('nalas'),
    };

    sendRequest(
      `${URLS.BaseURL}/form1Abstract/editForm1AbstractDyslr`,
      'POST',
      article,
      (res) => {
        if (res.status === 200) {
          success();
          form.resetFields();
          history.push({
            pathname: `/reports/Dyslr-From-1-Abstract`,
            state: {
              cCode: codeVillage,
              villageName: textForVillage,
            },
          });
        }
        setLoading(false);
      },
      (err) => {
        message.error('Something wents to wrong, please try again !');
        setLoading(false);
      },
    );
  };

  const getFerfarData = async () => {
    sendRequest(
      `${URLS.BaseURL}/form1Abstract/getLandTypeForm1AbstractDetails`,
      'GET',
      null,
      (res) => {
        if (langType === 'ma-IN') {
          setLandTypeArr(
            res.data.map((r) => ({
              label: r.landTypeWithSubtypeMarathi,
              value: r.landTypeCode,
            })),
          );
        } else {
          setLandTypeArr(
            res.data.map((r) => ({
              label: r.landTypeWithSubtype,
              value: r.landTypeCode,
            })),
          );
        }
      },
    );
  };

  return (
    <PageContainer header={{ title: '', breadcrumb: {} }}>
      <Card>
        <h1>
          <center>गाव नमुना एक चा गोषवारा(तेरीज)(DYSLR)</center>
        </h1>
        <Form layout="horizontal">
          <Row align="middle" gutter={16} style={{ marginTop: 10 }}>
            <Col flex="auto">
              <VillageSelector
                pageType="withoutYear"
                setCodeVillage={setCodeVillage}
                setTextForVillage={setTextForVillage}
                onVillageChange={setVillage}
                setIsNirank={setIsNirank}
              />
            </Col>
            <Col>
              <Button
                type="primary"
                style={{ backgroundColor: 'green', borderColor: 'green' }}
                onClick={() => {
                  if (textForVillage) {
                    getDataFor1Abstract();
                    setShowForm(true);
                  } else {
                    message.info('Please Select Village');
                  }
                }}
              >
                शोधा
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>

      <Alert
        message="टीप"
        description="गाव नमुना एकच्या गोषवारासाठी ई - चावडी प्रणालीतून घेतलेली माहिती गाव नमुना एकच्या गोषवारा अहवालात दाखवलेली आहे. खालील सदरात भरावयाची माहिती ही त्या अहवालात दर्शवण्यात येइल."
        type="info"
        showIcon
        style={{ margin: '16px 0' }}
      />
      {showForm && (
        <Form
          layout="horizontal"
          form={form}
          labelAlign="left"
          labelWrap={true}
          labelCol={{ xl: 13, lg: 13, md: 24, sm: 24 }}
          wrapperCol={{ xl: 11, lg: 11, md: 24, sm: 24 }}
        >
          <Card>
            <Divider orientation="left">अ - लागवडीकरिता जमीन</Divider>
            <Row gutter={24}>
              <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                <Form.Item
                  rules={[{ max: 50, message: 'Field shoud be upto 50 Numericals' }]}
                  name={'RevenueOrLeaseholdLandUnderSpecialAgreement'}
                  label="विशेष करारान्वये महसुल किंवा कमआकारी जमीन"
                >
                  <Input maxLength={51} onKeyPress={KeyPressEvents.isInputDecimal} />
                </Form.Item>
              </Col>
              <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                <Form.Item
                  rules={[{ max: 50, message: 'This Field shoud be upto 50 Numericals' }]}
                  name={'assignedForSpecialUse'}
                  label="विशेष वापरासाठी नेमुन दिलेली उदा ( कृषि प्रक्षेत्र,भात पैदास केंद्र इ.)"
                >
                  <Input maxLength={51} onKeyPress={KeyPressEvents.isInputDecimal} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                <Form.Item
                  rules={[{ max: 50, message: 'Field shoud be upto 50 Numericals' }]}
                  name={'dumalaLandArea'}
                  label="दुमाला जमीन"
                >
                  <Input maxLength={51} onKeyPress={KeyPressEvents.isInputDecimal} />
                </Form.Item>
              </Col>
            </Row>

            <Divider orientation="left">ब - लागवडीसाठी अनुपलब्ध जमीन</Divider>

            <Row gutter={24}>
              <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                <Form.Item
                  rules={[{ max: 50, message: 'Field shoud be upto 50 Numericals' }]}
                  name={'riversNalas'}
                  label="(ब1) नद्या"
                >
                  <Input maxLength={51} onKeyPress={KeyPressEvents.isInputDecimal} />
                </Form.Item>
              </Col>
              <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                <Form.Item
                  rules={[{ max: 50, message: 'Field shoud be upto 50 Numericals' }]}
                  name={'nalas'}
                  label="(ब2) नाले"
                >
                  <Input maxLength={51} onKeyPress={KeyPressEvents.isInputDecimal} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                <Form.Item
                  rules={[{ max: 50, message: 'Field shoud be upto 50 Numericals' }]}
                  name={'forestArea'}
                  label="(अ) वन"
                >
                  <Input maxLength={51} onKeyPress={KeyPressEvents.isInputDecimal} />
                </Form.Item>
              </Col>
              <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                <Form.Item
                  rules={[{ max: 50, message: 'Field shoud be upto 50 Numericals' }]}
                  name={'kuran'}
                  label="(ब) कुरण"
                >
                  <Input maxLength={51} onKeyPress={KeyPressEvents.isInputDecimal} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                <Form.Item
                  rules={[{ max: 50, message: 'This Field shoud be upto 50 Numericals' }]}
                  name={'freePastureCattleStand'}
                  label="(क) नि:शुल्‍क गायरान, गुरांचा तळ"
                >
                  <Input maxLength={51} onKeyPress={KeyPressEvents.isInputDecimal} />
                </Form.Item>
              </Col>
              <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                <Form.Item
                  rules={[{ max: 50, message: 'Field shoud be upto 50 Numericals' }]}
                  name={'villageSite'}
                  label="(ड) गावठाण"
                >
                  <Input maxLength={51} onKeyPress={KeyPressEvents.isInputDecimal} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                <Form.Item
                  rules={[{ max: 50, message: 'This Field shoud be upto 50 Numericals' }]}
                  name={'tank'}
                  label="(इ) तलाव"
                >
                  <Input maxLength={51} onKeyPress={KeyPressEvents.isInputDecimal} />
                </Form.Item>
              </Col>
              <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                <Form.Item
                  rules={[{ max: 50, message: 'Field shoud be upto 50 Numericals' }]}
                  name={'burialGround'}
                  label="(फ) स्मशानभूमी (मसनवट)"
                >
                  <Input maxLength={51} onKeyPress={KeyPressEvents.isInputDecimal} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                <Form.Item
                  rules={[{ max: 50, message: 'This Field shoud be upto 50 Numericals' }]}
                  name={'railways'}
                  label="(ग) रेल्वे"
                >
                  <Input maxLength={51} onKeyPress={KeyPressEvents.isInputDecimal} />
                </Form.Item>
              </Col>
              <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                <Form.Item
                  rules={[{ max: 50, message: 'Field shoud be upto 50 Numericals' }]}
                  name={'potKharabAssignedRoadsWaterCourses'}
                  label="(ह) रस्ते‍,पाण्याचे पाट इत्यांदीकरीता नेमून दिलेली पोटखराब"
                >
                  <Input maxLength={51} onKeyPress={KeyPressEvents.isInputDecimal} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                <Form.Item
                  rules={[{ max: 50, message: 'This Field shoud be upto 50 Numericals' }]}
                  name={'roadsAndPath'}
                  label="(आय) रस्ते‍ व मार्ग"
                >
                  <Input maxLength={51} onKeyPress={KeyPressEvents.isInputDecimal} />
                </Form.Item>
              </Col>
              <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                <Form.Item
                  rules={[{ max: 50, message: 'Field shoud be upto 50 Numericals' }]}
                  name={'pipeLineCanel'}
                  label="(जे) नळमार्ग, कालवे, चर इत्यादी"
                >
                  <Input maxLength={51} onKeyPress={KeyPressEvents.isInputDecimal} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                <Form.Item
                  rules={[{ max: 50, message: 'This Field shoud be upto 50 Numericals' }]}
                  name={'CantonmentLandMilitaryCamp'}
                  label="(के) कटक (कॅन्‍टोन्‍मेट) क्षेत्रातील जमिनी (सैनिकी छावणी, गोळीबार क्षेत्र इत्यादी)"
                >
                  <Input maxLength={51} onKeyPress={KeyPressEvents.isInputDecimal} />
                </Form.Item>
              </Col>
              <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                <Form.Item
                  rules={[{ max: 50, message: 'Field shoud be upto 50 Numericals' }]}
                  name={'schools'}
                  label="(एल) शाळा"
                >
                  <Input maxLength={51} onKeyPress={KeyPressEvents.isInputDecimal} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                <Form.Item
                  rules={[{ max: 50, message: 'This Field shoud be upto 50 Numericals' }]}
                  name={'dharmshalas'}
                  label="(एम) धर्मशाळा"
                >
                  <Input maxLength={51} onKeyPress={KeyPressEvents.isInputDecimal} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={24}>
                <Form.Item
                  labelCol={{ xl: 7, lg: 8, md: 24 }}
                  wrapperCol={{ xl: 17, lg: 16, md: 24 }}
                  rules={[{ max: 50, message: 'Field shoud be upto 50 Numericals' }]}
                  name={'srNoForNonAgricultureUse'}
                  label="भुमापन क्रमांकापैकी अकृषिक वापरासाठी (वापरामध्ये बदल केल्यानंतर ) पट्टयाने दिलेली किंवा प्रदान केलेली जमीन,दुमाला वर्ग सात सह"
                >
                  <Input maxLength={51} onKeyPress={KeyPressEvents.isInputDecimal} />
                </Form.Item>
              </Col>
            </Row>

            <Row justify="center" gutter={16} style={{ marginTop: 30, marginBottom: 10 }}>
              <Col>
                <Button
                  type="primary"
                  loading={loading}
                  style={{ backgroundColor: 'green', borderColor: 'green' }}
                  onClick={() => {
                    if (textForVillage) {
                      onFormFinish();
                    } else {
                      message.info('Please Select Village');
                    }
                  }}
                >
                  जतन करा
                </Button>
              </Col>
              <Col>
                <Button
                  onClick={resetForm}
                  style={{ color: 'white', backgroundColor: 'orange', borderColor: 'orange' }}
                >
                  पुनर्स्थापित करा
                </Button>
              </Col>
              <Col>
                <Button danger type="primary" onClick={cancelForm}>
                  रद्द करा
                </Button>
              </Col>
            </Row>
          </Card>
        </Form>
      )}
    </PageContainer>
  );
}

export default DYSLRVillageFormOne;
