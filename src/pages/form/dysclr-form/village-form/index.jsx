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

function form1Dyslr() {
  const { sendRequest } = useAxios();

  const { districtName, servarthId, districtCode, talukaName, talukaCode } = useModel('details');
  const [form1] = Form.useForm();
  const [villageForm] = Form.useForm();
  const [codeVillage, setCodeVillage] = useState('');
  const [textForVillage, setTextForVillage] = useState();
  const [textVillage, setTextVillage] = useState('');
  let history = useHistory();
  const [revenueYear, setRevenueYear] = useState();
  const [isNirank, setIsNirank] = useState(false);
  const { token } = useModel('Auth');
  const Header = `Bearer ${token}`;
  const [isLoading, setIsLoading] = useState(false);
  const [entryVillage, setEntryInVillage] = useState();
  const [flagInput, setFlagInput] = useState(true);
  const [village, setVillage] = useState([]);
  const [tenureName, setTenureName] = useState();
  const [potkharabaType, setpotkharabaType] = useState();
  const [designation, setDesignation] = useState();

  const handleOnChange = (value, event) => {
    // setShowValueEntryInVillage(true);
    setCodeVillage(value);
    setFlagInput(false);
    setTextForVillage();
  };

  const resetFrom = () => {
    form1.resetFields();
    villageForm.resetFields();

    setEntryInVillage('');

    history.push({
      pathname: `/form/dysclr-form/village-form`,
    });
  };

  const cancelForm = () => {
    history.push({
      pathname: `/form/dysclr-form/table-form`,
    });
  };

  const saveform = async () => {
    setIsLoading(true);
    const inputParameters = {
      districtCode: districtCode,
      talukaCode: talukaCode,
      cCode: codeVillage,

      pin: form1.getFieldValue('surveyNo'),
      tenureName: tenureName,
      totalAreaH: form1.getFieldValue('totalAreaH'),
      // potkharabaType: form1.getFieldValue('potkharabaType'),
      potkharabaType: potkharabaType,
      cultivableAreaInt: form1.getFieldValue('cultivableAreaInt'),
      netCultiAreaH: form1.getFieldValue('netCultiAreaH'),
      assessment: form1.getFieldValue('assessment'),

      publicRightsOfWayAndEasements: form1.getFieldValue('publicRightsOfWayAndEasements'),
      particularsOfAlteration: form1.getFieldValue('particularsOfAlteration'),
      orderNo: form1.getFieldValue('orderNo'),
      orderDate: form1.getFieldValue('orderDate')
        ? moment(form1.getFieldValue('orderDate'), 'DD/MM/YYYY').format('YYYY-MM-DD')
        : null,

      // form1.getFieldValue('orderDate') ? form1.getFieldValue('orderDate') : null,
      designation: designation,
      remarks: form1.getFieldValue('remarks'),
      jirayatArea: form1.getFieldValue('jirayatArea'),
      jirayatAssessment: form1.getFieldValue('jirayatAssessment'),
      bagayatArea: form1.getFieldValue('bagayatArea'),
      bagayatAssessment: form1.getFieldValue('bagayatAssessment'),
      tariArea: form1.getFieldValue('tariArea'),
      tariAssessment: form1.getFieldValue('tariAssessment'),
      otherArea: form1.getFieldValue('otherArea'),
      otherAssessment: form1.getFieldValue('otherAssessment'),
    };
    sendRequest(
      `${URLS.BaseURL}/form1Dyslr/saveForm1Dyslr`,
      'POST',
      inputParameters,
      (res) => {
        if (res.status === 200) {
          message.success('Data Saved!!');

          history.push({
            pathname: `/form/dysclr-form/table-form`,
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
        <Row>
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            <h2>
              <center>
                <FormattedMessage id="formLanguage.label.landRegister" />
              </center>
            </h2>
          </Col>
        </Row>
        <Form layout="horizontal" form={villageForm}>
          <Row style={{ marginTop: 10 }}>
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

      <Form
        layout="vertical"
        // onFinish={saveform6B}
        // onFinishFailed={onFinishFailed}
        // initialValues={initvalues}
        form={form1}
      >
        <Card>
          {/* 2ndCard */}

          <Divider orientation="left">
            {/* <FormattedMessage id="formLanguage.form.echawdi" /> */}
          </Divider>
          <Row>
            <Col xl={11} lg={11} md={11} sm={13} xs={24}>
              <Form.Item
                label={<FormattedMessage id="formLanguage.table.surveyNoDs" />}
                name="surveyNo"
                rules={[
                  {
                    required: true,
                    message: 'Please enter survey number',
                  },
                  { max: 200, message: 'This field shoud be below 200 characters' },
                ]}
              >
                <Input onKeyPress={KeyPressEvents.isSurveyNumber} maxLength={201} />
              </Form.Item>
            </Col>
            <Col xl={2} lg={2} md={2} sm={2}></Col>
            <Col xl={11} lg={11} md={11} sm={9} xs={24}>
              <Form.Item
                label={<FormattedMessage id="formLanguage.table.tenureDs" />}
                name="tenureName"
                rules={[
                  {
                    required: 'true',
                    message: 'Please enter tenure',
                  },
                  // { max: 50, message: 'This field shoud be below 50 characters' },
                ]}
              >
                <Select
                  onChange={(e) => {
                    setTenureName(e);
                  }}
                >
                  <Select.Option value={'भोगवटादार वर्ग -1'}>भोगवटादार वर्ग -1</Select.Option>
                  <Select.Option value={'भोगवटादार वर्ग - 2'}>भोगवटादार वर्ग - 2</Select.Option>
                  <Select.Option value={'सरकारी पट्टेदार'}>सरकारी पट्टेदार</Select.Option>
                  <Select.Option value={'सरकार'}>सरकार</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col xl={11} lg={11} md={11} sm={13} xs={24}>
              <Form.Item
                label={<FormattedMessage id="formLanguage.table.totalAreaHDs" />}
                name="totalAreaH"
                rules={[
                  {
                    required: true,
                    message: 'Please enter total area',
                  },
                  { max: 200, message: 'This field shoud be below 200 characters' },
                ]}
              >
                <Input.TextArea onKeyPress={KeyPressEvents.isInputVarchar} max={201} />
              </Form.Item>
            </Col>
            <Col xl={2} lg={2} md={2} sm={2}></Col>
            <Col xl={11} lg={11} md={11} sm={9} xs={24}>
              <Form.Item
                label={<FormattedMessage id="formLanguage.table.kindDs" />}
                name="potkharabaType"
                rules={[
                  {
                    required: 'true',
                    message: 'Please enter total area',
                  },
                  { max: 200, message: 'This field shoud be below 200 characters' },
                ]}
              >
                {/* <Input.TextArea onKeyPress={KeyPressEvents.isInputVarchar} maxLength={201} /> */}
                {/* below select code on date 5/04/2024 */}
                <Select
                  maxLength={501}
                  onChange={(e) => {
                    setpotkharabaType(e);
                  }}
                >
                  <Select.Option value={'अ'}>अ</Select.Option>
                  <Select.Option value={'ब'}>ब</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col item xs={24} sm={24} md={24} lg={15} xl={15}></Col>

            <Col xs={24} sm={24} md={24} lg={4} xl={4}>
              <h2>
                <label htmlFor="">क्षेत्र</label>
              </h2>
            </Col>
            <Col xs={1} sm={1} md={1} lg={1} xl={1}></Col>

            <Col xs={24} sm={24} md={24} lg={4} xl={4}>
              <h2>
                <label htmlFor="">आकारणी </label>
              </h2>
            </Col>
          </Row>

          <Row>
            <Col item xs={24} sm={24} md={24} lg={13} xl={13}></Col>
            <Col xs={24} sm={24} md={24} lg={2} xl={2}>
              <h2>
                <label htmlFor="">जिरायत :</label>
              </h2>
            </Col>

            <Col xl={4} lg={4} md={4} sm={24} xs={24}>
              <Form.Item
                // label={'जिरायत '}
                name="jirayatArea"
                rules={[
                  {
                    required: true,
                    message: 'Please enter jirayat area',
                  },
                  { max: 10, message: 'This field shoud be below 10 characters' },
                ]}
              >
                <Input onKeyPress={KeyPressEvents.isInputNumber1} maxLength={201} />
              </Form.Item>
            </Col>
            <Col xs={1} sm={1} md={1} lg={1} xl={1}></Col>
            <Col xl={4} lg={4} md={4} sm={24} xs={24}>
              <Form.Item
                // label={<FormattedMessage id="formLanguage.table.netCultivableAreaDs" />}
                name="jirayatAssessment"
                rules={[
                  {
                    required: 'true',
                    message: 'Please enter jirayat assessment',
                  },
                  { max: 10, message: 'This field shoud be below 10 characters' },
                ]}
              >
                <Input onKeyPress={KeyPressEvents.isInputNumber1} maxLength={11} />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col item xs={24} sm={24} md={24} lg={13} xl={13}></Col>
            <Col xs={24} sm={24} md={24} lg={2} xl={2}>
              <h2>
                <label htmlFor="">बागायत :</label>
              </h2>
            </Col>

            <Col xl={4} lg={4} md={4} sm={24} xs={24}>
              <Form.Item
                // label={'जिरायत '}
                name="bagayatArea"
                rules={[
                  {
                    required: true,
                    message: 'Please enter bagayat area',
                  },
                  { max: 10, message: 'This field shoud be below 10 characters' },
                ]}
              >
                <Input onKeyPress={KeyPressEvents.isInputNumber1} maxLength={201} />
              </Form.Item>
            </Col>
            <Col xs={1} sm={1} md={1} lg={1} xl={1}></Col>
            <Col xl={4} lg={4} md={4} sm={24} xs={24}>
              <Form.Item
                // label={<FormattedMessage id="formLanguage.table.netCultivableAreaDs" />}
                name="bagayatAssessment"
                rules={[
                  {
                    required: 'true',
                    message: 'Please enter bagayat assessment',
                  },
                  { max: 10, message: 'This field shoud be below 10 characters' },
                ]}
              >
                <Input onKeyPress={KeyPressEvents.isInputNumber1} maxLength={11} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col item xs={24} sm={24} md={24} lg={13} xl={13}></Col>
            <Col xs={24} sm={24} md={24} lg={2} xl={2}>
              <h2>
                <label htmlFor="">तरी :</label>
              </h2>
            </Col>

            <Col xl={4} lg={4} md={4} sm={24} xs={24}>
              <Form.Item
                // label={'जिरायत '}
                name="tariArea"
                rules={[
                  {
                    required: true,
                    message: 'Please enter tari area',
                  },
                  { max: 10, message: 'This field shoud be below 10 characters' },
                ]}
              >
                <Input onKeyPress={KeyPressEvents.isInputNumber1} maxLength={201} />
              </Form.Item>
            </Col>
            <Col xs={1} sm={1} md={1} lg={1} xl={1}></Col>
            <Col xl={4} lg={4} md={4} sm={24} xs={24}>
              <Form.Item
                // label={<FormattedMessage id="formLanguage.table.netCultivableAreaDs" />}
                name="tariAssessment"
                rules={[
                  {
                    required: 'true',
                    message: 'Please enter tari assessment',
                  },
                  { max: 10, message: 'This field shoud be below 10 characters' },
                ]}
              >
                <Input onKeyPress={KeyPressEvents.isInputNumber1} maxLength={11} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col item xs={24} sm={24} md={24} lg={13} xl={13}></Col>
            <Col xs={24} sm={24} md={24} lg={2} xl={2}>
              <h2>
                <label htmlFor="">इतर :</label>
              </h2>
            </Col>

            <Col xl={4} lg={4} md={4} sm={24} xs={24}>
              <Form.Item
                // label={'जिरायत '}
                name="otherArea"
                rules={[
                  {
                    required: true,
                    message: 'Please enter other area ',
                  },
                  { max: 10, message: 'This field shoud be below 10 characters' },
                ]}
              >
                <Input onKeyPress={KeyPressEvents.isInputNumber1} maxLength={201} />
              </Form.Item>
            </Col>
            <Col xs={1} sm={1} md={1} lg={1} xl={1}></Col>
            <Col xl={4} lg={4} md={4} sm={24} xs={24}>
              <Form.Item
                // label={<FormattedMessage id="formLanguage.table.netCultivableAreaDs" />}
                name="otherAssessment"
                rules={[
                  {
                    required: 'true',
                    message: 'Please enter other assessment',
                  },
                  { max: 10, message: 'This field shoud be below 10 characters' },
                ]}
              >
                <Input onKeyPress={KeyPressEvents.isInputNumber1} maxLength={11} />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col xl={11} lg={11} md={11} sm={13} xs={24}>
              <Form.Item
                label={<FormattedMessage id="formLanguage.table.areaDs" />}
                name="cultivableAreaInt"
                rules={[
                  {
                    required: true,
                    message: 'Please enter area',
                  },
                  { max: 200, message: 'This field shoud be below 200 characters' },
                ]}
              >
                <Input.TextArea onKeyPress={KeyPressEvents.isInputVarchar} maxLength={201} />
              </Form.Item>
            </Col>
            <Col xl={2} lg={2} md={2} sm={2}></Col>
            <Col xl={11} lg={11} md={11} sm={9} xs={24}>
              <Form.Item
                label={<FormattedMessage id="formLanguage.table.netCultivableAreaDs" />}
                name="netCultiAreaH"
                rules={[
                  {
                    required: 'true',
                    message: 'Please enter cultivation area',
                  },
                  { max: 200, message: 'This field shoud be below 200 characters' },
                ]}
              >
                <Input.TextArea onKeyPress={KeyPressEvents.isInputVarchar} maxLength={201} />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col xl={11} lg={11} md={11} sm={13} xs={24}>
              <Form.Item
                label={<FormattedMessage id="formLanguage.table.naAssessmentDs" />}
                name="assessment"
                rules={[
                  {
                    required: true,
                    message: 'Please enter assessment',
                  },
                  { max: 200, message: 'This field shoud be below 200 characters' },
                ]}
              >
                <Input.TextArea onKeyPress={KeyPressEvents.isInputVarchar} maxLength={201} />
              </Form.Item>
            </Col>
            <Col xl={2} lg={2} md={2} sm={2}></Col>
            <Col xl={11} lg={11} md={11} sm={9} xs={24}>
              <Form.Item
                label={<FormattedMessage id="formLanguage.table.alterationDs" />}
                name="particularsOfAlteration"
                rules={[
                  {
                    required: true,
                    message: 'Please enter particulars of alteration',
                  },
                  { max: 200, message: 'This field shoud be below 200 characters' },
                ]}
              >
                <Input.TextArea onKeyPress={KeyPressEvents.isInputVarchar} maxLength={201} />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col xl={11} lg={11} md={11} sm={13} xs={24}>
              <Form.Item
                label={<FormattedMessage id="formLanguage.table.publicRightsDs" />}
                name="publicRightsOfWayAndEasements"
                rules={[
                  // {
                  //   required: 'true',
                  //   message: (
                  //     <FormattedMessage id="villageForm6B.table.ruleOrderOfTahshilAsToFine" />
                  //   ),
                  // },
                  { max: 300, message: 'This field shoud be below 300 characters' },
                ]}
              >
                <Input.TextArea onKeyPress={KeyPressEvents.isInputVarchar} maxLength={301} />
              </Form.Item>
            </Col>
            <Col xl={2} lg={2} md={2} sm={2}></Col>
            <Col xl={11} lg={11} md={11} sm={9} xs={24}>
              <Form.Item
                label={<FormattedMessage id="formLanguage.table.designationDs" />}
                name="designation"
                rules={
                  [
                    // {
                    //   required: 'true',
                    //   message: (
                    //     <FormattedMessage id="villageForm6B.table.ruleOrderOfTahshilAsToFine" />
                    //   ),
                    // },
                    // { max: 50, message: 'This field shoud be below 50 characters' },
                  ]
                }
              >
                <Select
                  placeholder="Select"
                  onChange={(e) => {
                    setDesignation(e);
                  }}
                >
                  <Select.Option value={'villageForm1.table.collector'}>
                    <FormattedMessage id="villageForm1.table.collector" />
                  </Select.Option>
                  <Select.Option value={`villageForm1.table.deputyCollector`}>
                    <FormattedMessage id="villageForm1.table.deputyCollector" />
                  </Select.Option>
                  <Select.Option value={'villageForm1.table.tahsildar'}>
                    <FormattedMessage id="villageForm1.table.tahsildar" />
                  </Select.Option>
                  <Select.Option value={'villageForm1.table.nayabTahsildar'}>
                    <FormattedMessage id="villageForm1.table.nayabTahsildar" />
                  </Select.Option>
                  <Select.Option value={'villageForm1.table.circle'}>
                    <FormattedMessage id="villageForm1.table.circle" />
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col xl={11} lg={11} md={11} sm={11} xs={24}>
              <Form.Item
                label={<FormattedMessage id="formLanguage.table.orderDateDs" />}
                name="orderDate"
              >
                <DatePicker style={{ width: '100%' }}></DatePicker>
              </Form.Item>
            </Col>

            <Col xl={2} lg={2} md={2} sm={2}></Col>
            <Col xl={11} lg={11} md={11} sm={13} xs={24}>
              <Form.Item
                label={<FormattedMessage id="formLanguage.table.orderNoDs" />}
                name="orderNo"
                rules={[
                  // {
                  //   required: true,
                  //   // message: <FormattedMessage id="villageForm1.table.publicRightsOfWays" />,
                  // },
                  { max: 200, message: 'This field shoud be below 200 characters' },
                ]}
              >
                <Input.TextArea onKeyPress={KeyPressEvents.isInputVarchar} maxLength={201} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col xl={11} lg={11} md={11} sm={9} xs={24}>
              <Form.Item
                label={<FormattedMessage id="formLanguage.table.remarkDs" />}
                name="remarks"
                rules={[
                  // {
                  //   required: 'true',
                  //   message: (
                  //     <FormattedMessage id="villageForm6B.table.ruleOrderOfTahshilAsToFine" />
                  //   ),
                  // },
                  { max: 300, message: 'This field shoud be below 300 characters' },
                ]}
              >
                <Input.TextArea onKeyPress={KeyPressEvents.isInputVarchar} maxLength={301} />
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
                // onClick={saveform6B}

                onClick={() => {
                  if (textForVillage) {
                    saveform();
                  } else if (textForVillage == null) {
                    message.info('Please Select Village');
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
    </>
  );
}
export default form1Dyslr;
