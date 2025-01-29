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
import { FormattedMessage, useModel } from 'umi';
import URLS from '@/URLs/urls';
import { useHistory, useLocation } from 'react-router';
import useAxios from '@/components/eComponents/use-axios';
import { Option } from 'antd/lib/mentions';
import KeyPressEvents from '@/util/KeyPressEvents';
import axios from 'axios';
import VillageSelector from '@/components/eComponents/VillageSelector';

function VillageForm1Abstract() {
  const langType = localStorage.getItem('umi_locale');
  const { sendRequest } = useAxios();
  const [showGetDataButton, setShowGetDataButton] = useState(false);
  const [surveyNumberValue, setSurveyNumberValue] = useState();
  const [hissaNumberValue, setHissaNumberValue] = useState([]);
  const [textForVillage, setTextForVillage] = useState();
  const [codeVillage, setCodeVillage] = useState('');
  const [isNirank, setIsNirank] = useState(false);

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

  // useEffect(() => {
  //   getDataVillage();
  // }, []);

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
    setCodeVillage(value);
    setTextForVillage(event.label);
    //  getFerfarData();
    // console.log('Name of Village ==>>', event.label, 'cCode==>>', value);
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
      `${URLS.BaseURL}/form1Abstract/getForm1AbstractData?cCode=${codeVillage}`,
      'GET',
      null,
      (r) => {
        setID(r.data.id);
        form.setFieldsValue({
          id: r.data.id,
          RevenueOrLeaseholdLandUnderSpecialAgreement:
            r.data.RevenueOrLeaseholdLandUnderSpecialAgreement,
          assignedForSpecialUse: r.data.assignedForSpecialUse,
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
    // console.log('DATA FOR SAVE Form1ab', article);

    sendRequest(
      `${URLS.BaseURL}/form1Abstract/editForm1Abstract`,
      'POST',
      article,
      (res) => {
        if (res.status === 200) {
          success();
          form.resetFields();
          history.push({
            pathname: `/reports/From 1Abstract`,
          });
        }
        setLoading(false);
      },
      (err) => {
        message.error('Already Exists');
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
    <>
      <Card>
        <h1>
          <center>
            <FormattedMessage id="form1abstract.heading" />
          </center>
        </h1>
        <Form layout="horizontal">
          <Row style={{ marginTop: 10 }}>
            <Col xl={22} lg={22} md={22} sm={22} xs={22}>
              {/* <Form.Item label={<FormattedMessage id="villageSelector.label.district" />}>
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
              </Form.Item> */}
              <VillageSelector
                pageType="withoutYear"
                setCodeVillage={setCodeVillage}
                setTextForVillage={setTextForVillage}
                onVillageChange={setVillage}
                setIsNirank={setIsNirank}

                // yearChange={setRevenueYear}
              />
            </Col>
            {/* <Col xl={1}></Col> */}
            <Col xl={2} lg={2} md={2} sm={24} xs={24}>
              <Button
                type="primary"
                onClick={() => {
                  getDataFor1Abstract();
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
        description="गाव नमुना एकच्या गोषवारासाठी ई-फेरफार प्रणालीतून घेतलेली माहिती गाव नमुना एकच्या गोषवारा अहवालात दाखवलेली आहे. खालील सदरात भरावयाची माहिती ही त्या अहवालात दर्शवण्यात येईल."
        type="info"
        showIcon
      />
      <Form layout="vertical" form={form}>
        <Card>
          <Divider orientation="left">अ - लागवडीकरिता जमीन</Divider>
          <Row>
            <Col xl={11} lg={11} md={11} sm={24} xs={24}>
              <Form.Item
                rules={[
                  // { required: true, message: 'This Field is Required' },
                  {
                    max: 50,
                    message: 'Field shoud be upto 50 Numericals',
                  },
                ]}
                name={'RevenueOrLeaseholdLandUnderSpecialAgreement'}
                label="विशेष करारान्वये महसुल किंवा कमआकारी जमीन"
              >
                <Input maxLength={51} onKeyPress={KeyPressEvents.isInputDecimal} />
              </Form.Item>
            </Col>
            <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>
            <Col xl={11} lg={11} md={11} sm={24} xs={24}>
              <Form.Item
                rules={[
                  //  { required: true, message: 'Remarks is Required..' },
                  {
                    max: 50,
                    message: 'This Field shoud be upto 50 Numericals',
                  },
                ]}
                name={'assignedForSpecialUse'}
                label="विशेष वापरासाठी नेमुन दिलेली उदा ( कृषि प्रक्षेत्र,भात पैदास केंद्र इ.)"
              >
                <Input maxLength={51} onKeyPress={KeyPressEvents.isInputDecimal} />
              </Form.Item>
            </Col>
          </Row>
          <Divider orientation="left">ब - लागवडीसाठी अनुपलब्ध जमीन</Divider>
          <Row>
            <Col xl={11} lg={11} md={11} sm={24} xs={24}>
              <Form.Item
                rules={[
                  //   { required: true, message: 'This Field is Required' },
                  {
                    max: 50,
                    message: 'Field shoud be upto 50 Numericals',
                  },
                ]}
                name={'riversNalas'}
                label="नदी"
              >
                <Input maxLength={51} onKeyPress={KeyPressEvents.isInputDecimal} />
              </Form.Item>
            </Col>
            <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>

            <Col xl={11} lg={11} md={11} sm={24} xs={24}>
              <Form.Item
                rules={[
                  //   { required: true, message: 'This Field is Required' },
                  {
                    max: 50,
                    message: 'Field shoud be upto 50 Numericals',
                  },
                ]}
                name={'nalas'}
                label="नाले"
              >
                <Input maxLength={51} onKeyPress={KeyPressEvents.isInputDecimal} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col xl={11} lg={11} md={11} sm={24} xs={24}>
              <Form.Item
                rules={[
                  //   { required: true, message: 'This Field is Required' },
                  {
                    max: 50,
                    message: 'Field shoud be upto 50 Numericals',
                  },
                ]}
                name={'kuran'}
                label="कुरण"
              >
                <Input maxLength={51} onKeyPress={KeyPressEvents.isInputDecimal} />
              </Form.Item>
            </Col>
            <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>
            <Col xl={11} lg={11} md={11} sm={24} xs={24}>
              <Form.Item
                rules={[
                  //  { required: true, message: 'Remarks is Required..' },
                  {
                    max: 50,
                    message: 'This Field shoud be upto 50 Numericals',
                  },
                ]}
                name={'freePastureCattleStand'}
                label="नि:शुल्क गायरान,गुरांचा तळ"
              >
                <Input maxLength={51} onKeyPress={KeyPressEvents.isInputDecimal} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col xl={11} lg={11} md={11} sm={24} xs={24}>
              <Form.Item
                rules={[
                  // { required: true, message: 'This Field is Required' },
                  {
                    max: 50,
                    message: 'Field shoud be upto 50 Numericals',
                  },
                ]}
                name={'villageSite'}
                label="गावठाण"
              >
                <Input maxLength={51} onKeyPress={KeyPressEvents.isInputDecimal} />
              </Form.Item>
            </Col>
            <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>
            <Col xl={11} lg={11} md={11} sm={24} xs={24}>
              <Form.Item
                rules={[
                  //  { required: true, message: 'Remarks is Required..' },
                  {
                    max: 50,
                    message: 'This Field shoud be upto 50 Numericals',
                  },
                ]}
                name={'tank'}
                label="तलाव"
              >
                <Input maxLength={51} onKeyPress={KeyPressEvents.isInputDecimal} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col xl={11} lg={11} md={11} sm={24} xs={24}>
              <Form.Item
                rules={[
                  // { required: true, message: 'This Field is Required' },
                  {
                    max: 50,
                    message: 'Field shoud be upto 50 Numericals',
                  },
                ]}
                name={'burialGround'}
                label="मसणवटा"
              >
                <Input maxLength={51} onKeyPress={KeyPressEvents.isInputDecimal} />
              </Form.Item>
            </Col>
            <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>
            <Col xl={11} lg={11} md={11} sm={24} xs={24}>
              <Form.Item
                rules={[
                  //  { required: true, message: 'Remarks is Required..' },
                  {
                    max: 50,
                    message: 'This Field shoud be upto 50 Numericals',
                  },
                ]}
                name={'railways'}
                label="रेल्वे"
              >
                <Input maxLength={51} onKeyPress={KeyPressEvents.isInputDecimal} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col xl={11} lg={11} md={11} sm={24} xs={24}>
              <Form.Item
                rules={[
                  // { required: true, message: 'This Field is Required' },
                  {
                    max: 50,
                    message: 'Field shoud be upto 50 Numericals',
                  },
                ]}
                name={'potKharabAssignedRoadsWaterCourses'}
                label="रस्ते,पाण्याचा पाट इत्यांदीकरिता नेमुन दिलेली पोटखराब"
              >
                <Input maxLength={51} onKeyPress={KeyPressEvents.isInputDecimal} />
              </Form.Item>
            </Col>
            <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>
            <Col xl={11} lg={11} md={11} sm={24} xs={24}>
              <Form.Item
                rules={[
                  //  { required: true, message: 'Remarks is Required..' },
                  {
                    max: 50,
                    message: 'This Field shoud be upto 50 Numericals',
                  },
                ]}
                name={'roadsAndPath'}
                label="रस्ते व मार्ग"
              >
                <Input maxLength={51} onKeyPress={KeyPressEvents.isInputDecimal} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col xl={11} lg={11} md={11} sm={24} xs={24}>
              <Form.Item
                rules={[
                  //  { required: true, message: 'This Field is Required' },
                  {
                    max: 50,
                    message: 'Field shoud be upto 50 Numericals',
                  },
                ]}
                name={'pipeLineCanel'}
                label="नळमार्ग,कालवे, चर इत्यादी"
              >
                <Input maxLength={51} onKeyPress={KeyPressEvents.isInputDecimal} />
              </Form.Item>
            </Col>
            <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>
            <Col xl={11} lg={11} md={11} sm={24} xs={24}>
              <Form.Item
                rules={[
                  //  { required: true, message: 'Remarks is Required..' },
                  {
                    max: 50,
                    message: 'This Field shoud be upto 50 Numericals',
                  },
                ]}
                name={'CantonmentLandMilitaryCamp'}
                label="कटक क्षेत्रातील जमिनी सैनिकी छावणी,गोळीबार क्षेत्र इ."
              >
                <Input maxLength={51} onKeyPress={KeyPressEvents.isInputDecimal} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col xl={11} lg={11} md={11} sm={24} xs={24}>
              <Form.Item
                rules={[
                  //  { required: true, message: 'This Field is Required' },
                  {
                    max: 50,
                    message: 'Field shoud be upto 50 Numericals',
                  },
                ]}
                name={'schools'}
                label="शाळा"
              >
                <Input maxLength={51} onKeyPress={KeyPressEvents.isInputDecimal} />
              </Form.Item>
            </Col>
            <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>
            <Col xl={11} lg={11} md={11} sm={24} xs={24}>
              <Form.Item
                rules={[
                  //  { required: true, message: 'Remarks is Required..' },
                  {
                    max: 50,
                    message: 'This Field shoud be upto 50 Numericals',
                  },
                ]}
                name={'dharmshalas'}
                label="धर्मशाळा"
              >
                <Input maxLength={51} onKeyPress={KeyPressEvents.isInputDecimal} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col xl={24} lg={24} md={24} sm={24} xs={24}>
              <Form.Item
                rules={[
                  //  { required: true, message: 'This Field is Required' },
                  {
                    max: 50,
                    message: 'Field shoud be upto 50 Numericals',
                  },
                ]}
                name={'srNoForNonAgricultureUse'}
                label="भुमापन क्रमांकापैकी अकृषिक वापरासाठी (वापरामध्ये बदल केल्यानंतर ) पट्टयाने दिलेली किंवा प्रदान केलेली  जमीन,दुमाला वर्ग सात सह"
              >
                <Input maxLength={51} onKeyPress={KeyPressEvents.isInputDecimal} />
              </Form.Item>
            </Col>
          </Row>
          {/* <Row>
            <Col span={24}>
              <Form.Item
                name={'landType'}
                rules={[{ required: true, message: 'This Field Is Required..' }]}
                label={<FormattedMessage id="form1abstract.landType" />}
              >
                <Select
                  options={landTypeArr}
                  onChange={(e) => {
                    console.log('landType Value', e);
                    setLandTypeValue(e);
                  }}
                ></Select>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col xl={11} lg={11} md={11} sm={24} xs={24}>
              <Form.Item
                name={'area'}
                rules={[{ required: true, message: 'This Field Is Required..' }]}
                label={<FormattedMessage id="form1abstract.area" />}
              >
                <Input onKeyPress={KeyPressEvents.isInputDecimal} />
              </Form.Item>
            </Col>
            <Col xl={2} lg={2} md={2}></Col>
            <Col xl={11} lg={11} md={11} sm={24} xs={24}>
              <Form.Item
                name={'areaUnit'}
                rules={[{ required: true, message: 'This Field Is Required..' }]}
                label={<FormattedMessage id="form1abstract.unit" />}
              >
                <Select>
                  <Select.Option value="form1abstract.unit1">
                    <FormattedMessage id="form1abstract.unit1" />
                  </Select.Option>

                  <Select.Option value="form1abstract.unit2">
                    <FormattedMessage id="form1abstract.unit2" />
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <Form.Item
                name={'assessment'}
                rules={[{ required: true, message: 'This Field Is Required..' }]}
                label={<FormattedMessage id="form1abstract.assessment" />}
              >
                <Input onKeyPress={KeyPressEvents.isInputDecimal} />
              </Form.Item>
            </Col>
            <Col span={7}></Col>
            <Col span={10}>
              <Form.Item
                name={'remarks'}
                // rules={[{ required: true, message: 'This Field Is Required..' }]}
                label={<FormattedMessage id="form1abstract.remarks" />}
              >
                <Input.TextArea onKeyPress={KeyPressEvents.isInputDecimal} />
              </Form.Item>
            </Col>
          </Row> */}
          <Row style={{ marginTop: 20 }}>
            <Col xl={8} lg={4} md={4} sm={5}></Col>
            <Col xl={2} lg={2} md={1} sm={1} xs={1}>
              <Button
                type="primary"
                loading={loading}
                htmlType="submit"
                onClick={() => {
                  if (textForVillage) {
                    onFormFinish();
                  } else {
                    message.info('Please Select Village');
                  }
                }}
              >
                <FormattedMessage id="formLanguage.button.save" />
              </Button>
              {/* </Popconfirm> */}
            </Col>
            <Col xl={1} lg={2} md={3} sm={4} xs={8}></Col>
            <Col xl={2} lg={2} md={1} sm={1} xs={1}>
              <Button onClick={resetForm} style={{ color: 'white', backgroundColor: 'orange' }}>
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

export default VillageForm1Abstract;
