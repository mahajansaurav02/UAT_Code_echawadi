import VillageSelector from '@/components/eComponents/VillageSelector';
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
  Row,
  Select,
  Space,
} from 'antd';
import React, { useState } from 'react';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import URLS from '@/URLs/urls';
import useAxios from '@/components/eComponents/use-axios';
// import { FormattedMessage } from 'umi';
import ESelector from '@/components/eComponents/ESelector';
import { SearchOutlined } from '@ant-design/icons';
import { FormattedMessage, useModel } from 'umi';
import KeyPressEvents from '@/util/KeyPressEvents';

const success = () => {
  message.success('Data Saved !!!');
};

// import React from 'react'

function Form7B() {
  let history = useHistory();

  const [surveyNumberValue, setSurveyNumberValue] = useState();
  const [hissaNumberValue, setHissaNumberValue] = useState([]);
  const [codeVillage, setCodeVillage] = useState();
  const [textVillage, setTextVillage] = useState('');
  const [village, setVillage] = useState([]);
  const [flagButton, setFlagButton] = useState(true);
  const [revenueYear, setRevenueYear] = useState();
  const [isNirank, setIsNirank] = useState(false);
  const [textForVillage, setTextForVillage] = useState();
  const [hissaNumber, setHissaNumber] = useState([]);
  const [showHissaInput, setShowHissaInput] = useState(false);
  const [showKhataInput, setShowKhataInput] = useState(false);
  const [khataNumber, setKhataNumber] = useState();
  const [khataNumberValue, setKhataNumberValue] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const { sendRequest } = useAxios();
  const [form] = Form.useForm();
  const [form1] = Form.useForm();
  const { districtName, servarthId, districtCode, talukaCode } = useModel('details');

  const resetFrom = () => {
    form.resetFields();
  };

  function handleChangeForHissaNo(event) {
    setHissaNumberValue(event);
    setShowKhataInput(false);
  }

  function handleChangeForKhataNo(event) {
    setKhataNumber(event.target.value);
  }

  function handleChangeForSurveyNo(event) {
    setSurveyNumberValue(event.target.value);

    setHissaNumber([]);
    setShowHissaInput(false);
    setShowKhataInput(false);
  }

  const getHissaFromSurvey = async () => {
    setSearchLoading(true);

    sendRequest(
      `${URLS.BaseURL}/restservice/getHissaByVillageAndSurveyNo?districtCode=${districtCode}&talukaCode=${talukaCode}&cCode=${codeVillage}&pin=${surveyNumberValue}&marked=Y`,
      'GET',
      null,
      (res) => {
        setHissaNumber(
          res.data.map((row) => ({
            label: row.hissaNo == '' ? 'निरंक' : row.hissaNo,
            value: row.hissaNo,
          })),
        );
        setShowHissaInput(true);
        setSearchLoading(false);
      },
      setSearchLoading(true),
    );
  };

  const getKhataNumberFromHissa = async (value) => {
    // setHissaNumberValue(value);
    sendRequest(
      `${URLS.BaseURL}/form7b/getKhataNodetails?districtCode=${districtCode}&talukaCode=${talukaCode}&cCode=${codeVillage}&pin=${surveyNumberValue}&hissaNo=${value}`,
      'GET',
      null,
      (res) => {
        setKhataNumberValue(
          res.data.form7BData.map((r) => ({
            label: r.khataNo,
            value: r.khataNo,
          })),
        );
        setShowKhataInput(true);
      },
    );
  };

  const onFormFinish = async (values) => {
    setIsLoading(true);

    const article = {
      cCode: codeVillage,
      districtCode: districtCode,
      talukaCode: talukaCode,
      pin: surveyNumberValue,
      hissaNo: hissaNumberValue,
      khataNo: form1.getFieldValue('khataNo'),
      year: moment(form.getFieldValue('year'), 'DD/MM/YYYY').format('YYYY'),
      fnamePersonInPossession: form.getFieldValue('fnamePersonInPossession'),
      mnamePersonInPossession: form.getFieldValue('mnamePersonInPossession'),
      lnamePersonInPossession: form.getFieldValue('lnamePersonInPossession'),
      designation: form.getFieldValue('designation'),
      possessionDate: moment(form.getFieldValue('possessionDate'), 'DD/MM/YYYY').format(
        'YYYY-MM-DD',
      ),
      orderDate: moment(form.getFieldValue('orderDate'), 'DD/MM/YYYY').format('YYYY-MM-DD'),
      orderNo: form.getFieldValue('orderNo'),
      remarks: form.getFieldValue('remarks'),
    };
    // console.log('DATA FOR SAVE FORM3-------->', article);

    sendRequest(
      `${URLS.BaseURL}/form7b/saveForm7B`,
      'POST',
      article,
      (res) => {
        if (res.status === 201) {
          success();
          form.resetFields();
          history.push({
            pathname: `/form/village-form-7b/table-form`,
          });
          setIsLoading(false);
        }
      },
      (err) => {
        setIsLoading(false);
      },
    );
  };
  const cancelForm = () => {
    history.push({
      pathname: `/form/village-form-7b/table-form`,
    });
  };

  return (
    <>
      <Card>
        <h1 style={{ textAlign: 'center' }}>
          <FormattedMessage id="villageForm.form.villageForm7B" />
        </h1>
        <h1 style={{ textAlign: 'center' }}>
          {<FormattedMessage id="villageForm.form.registerReport" />}
        </h1>
        <VillageSelector
          pageType="withoutYear"
          setCodeVillage={setCodeVillage}
          setTextForVillage={setTextForVillage}
          onVillageChange={(setVillage, setFlagButton)}
          yearChange={setRevenueYear}
          setIsNirank={setIsNirank}
        />
        <Form form={form1}>
          <Row style={{ marginTop: 30 }}>
            <Col xl={6} lg={6} md={6} sm={24} xs={24}>
              <Form.Item
                label={<FormattedMessage id="formLanguage.table.surveyNo" />}
                type="number"
                name="surveyNo"
                rules={[
                  {
                    required: true,
                    message: <FormattedMessage id="villageForm.form.ruleSurveyNumber" />,
                  },
                  { max: 7, message: 'This field shoud be up to 7 characters' },
                ]}
              >
                <Input
                  onKeyPress={KeyPressEvents.isInputVarchar}
                  maxLength={8}
                  onChange={handleChangeForSurveyNo}
                />
              </Form.Item>
            </Col>
            <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>
            <Col xl={2} lg={2} md={2} sm={24} xs={24}>
              {!isNirank && (
                <Button type="primary" loading={searchLoading} onClick={getHissaFromSurvey}>
                  <FormattedMessage id="formLanguage.button.search" />
                </Button>
              )}
            </Col>

            <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>
            {showHissaInput && (
              <Col xl={6} lg={6} md={6} sm={24} xs={24}>
                <Form.Item
                  name="hissaNo"
                  label={<FormattedMessage id="formLanguage.form.hissaNo" />}
                  // rules={[
                  //   {
                  //     required: true,
                  //     message: <FormattedMessage id="villageForm.form.ruleHissaNumber" />,
                  //   },
                  // ]}
                >
                  <Select
                    onSelect={(value) => getKhataNumberFromHissa(value)}
                    placeholder="हिस्सा क्रमांक निवडा"
                    options={hissaNumber}
                    onChange={handleChangeForHissaNo}
                  ></Select>
                </Form.Item>
              </Col>
            )}
            <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>
            {showKhataInput && (
              <Col xl={6} lg={6} md={6} sm={24} xs={24}>
                <Form.Item
                  label={<FormattedMessage id="villageForm.form.khataNo" />}
                  name="khataNo"
                  rules={[
                    {
                      required: true,
                      message: <FormattedMessage id="villageForm.form.ruleKhataNumber" />,
                    },
                    { max: 7, message: 'This field shoud be up to 7 characters' },
                  ]}
                >
                  <Select options={khataNumberValue}></Select>
                </Form.Item>
              </Col>
            )}
          </Row>
        </Form>

        {/* {showGetDataButton && ( */}
        <>
          {/* <Row style={{ paddingTop: 25 }}>
                <Col span={4}>
                  <Button type="default" 
                  // onClick={getArea}
                  >
                    <FormattedMessage id="villageForm1E.table.showArea" />
                  </Button>
                </Col>
                <Col>
                  {showArea && (
                    <Col span={12}>
                      <Input
                        addonBefore={<FormattedMessage id="formLanguage.form.Area" />}
                        disabled
                        value={area}
                      ></Input>
                    </Col>
                  )}
                </Col>
              </Row> */}
        </>
        {/* )} */}
      </Card>
      {isNirank && (
        <Card>
          <Alert message="टीप" description="सदर गाव नमुना निरंक आहे." type="info" showIcon />
        </Card>
      )}
      {!isNirank && (
        <Card>
          <Divider orientation="left">
            {' '}
            <FormattedMessage id="formLanguage.form.echawdi" />
          </Divider>

          <Form layout={'vertical'} /* onFinish={onFormFinish} */ form={form}>
            <Row>
              <Col xl={11} lg={11} md={11} sm={24} xs={24}></Col>
              <Col xl={2} lg={2} md={2} sm={2} xs={2}></Col>
            </Row>
            <Row>
              <Col xl={5} lg={5} md={5} sm={24} xs={24}>
                <Form.Item
                  style={{ fontSize: '18px', fontWeight: 'bold' }}
                  label={<FormattedMessage id="villageForm.form.nameOfThePersonInPsn" />}
                >
                  {/* <Input></Input> */}
                </Form.Item>
              </Col>
              <Col xl={1} lg={1} md={1}></Col>

              <Col xl={5} lg={5} md={5} sm={24} xs={24}>
                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: <FormattedMessage id="villageForm.form.ruleFirstName" />,
                    },
                    { max: 25, message: 'This field shoud be up to 25 characters' },
                  ]}
                  name="fnamePersonInPossession"
                  // label="First Name"
                  label={<FormattedMessage id="villageForm.form.fname" />}
                >
                  <Input onKeyPress={KeyPressEvents.isInputVarchar} maxLength={26}></Input>
                </Form.Item>
              </Col>
              <Col xl={1} lg={1} md={1}></Col>

              <Col xl={5} lg={5} md={5} sm={24} xs={24}>
                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: 'Please Enter Middle Name of Person',
                    },
                    { max: 25, message: 'This field shoud be up to 25 characters' },
                  ]}
                  name="mnamePersonInPossession"
                  // label="Middle  Name"
                  label={<FormattedMessage id="villageForm.form.mname" />}
                >
                  <Input onKeyPress={KeyPressEvents.isInputVarchar} maxLength={26}></Input>
                </Form.Item>
              </Col>
              <Col xl={1} lg={1} md={1}></Col>

              <Col xl={5} lg={5} md={5} sm={24} xs={24}>
                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: 'Please Enter Last Name of Person',
                    },
                    { max: 25, message: 'This field shoud be up to 25 characters' },
                  ]}
                  name="lnamePersonInPossession"
                  // label="Last  Name"
                  label={<FormattedMessage id="villageForm.form.lname" />}
                >
                  <Input onKeyPress={KeyPressEvents.isInputVarchar} maxLength={26}></Input>
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col xl={11} lg={12} md={13} sm={24} xs={24}>
                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: 'Please Enter Designation',
                    },
                    //  { max: 20, message: 'This field shoud be up to 20 characters' },
                  ]}
                  name="designation"
                  //  label="Designation :"
                  label={<FormattedMessage id="villageForm.form.designation" />}
                >
                  <Select placeholder="designation">
                    <Select.Option value="collector">
                      <FormattedMessage id="villageForm1.table.collector" />
                    </Select.Option>
                    <Select.Option value="Deputy Collector">
                      <FormattedMessage id="villageForm1.table.deputyCollector" />
                    </Select.Option>
                    <Select.Option value="Tahsildar">
                      <FormattedMessage id="villageForm1.table.tahsildar" />
                    </Select.Option>
                    <Select.Option value="Nayab Tahsildar">
                      <FormattedMessage id="villageForm1.table.nayabTahsildar" />
                    </Select.Option>
                    <Select.Option value="Circle">
                      <FormattedMessage id="villageForm1.table.circle" />
                    </Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xl={1} lg={2} md={1}></Col>
              <Col xl={11} lg={10} md={10} sm={24} xs={24}>
                <Form.Item
                  labelCol={{ lg: 24 }}
                  rules={[
                    {
                      required: true,
                      message: 'Please Select Date of Possession of Land',
                    },
                  ]}
                  name="possessionDate"
                  // label="Date from which the person in column 6 is in possession of the land:"
                  label={<FormattedMessage id="villageForm.form.datecolom" />}
                >
                  <DatePicker style={{ width: '100%' }}></DatePicker>
                </Form.Item>

                {/* <Form.Item 
          //  label="Order Date:"
          label={<FormattedMessage id="villageForm.form.orderDate" />}>
          <DatePicker  style={{ width: '100%'}} ></DatePicker>

        </Form.Item> */}
              </Col>
            </Row>
            <Row>
              <Col xl={11} lg={12} md={13} sm={24} xs={24}>
                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: 'Please Select Date of Order',
                    },
                  ]}
                  name="orderDate"
                  //  label="Order Date:"
                  label={<FormattedMessage id="villageForm.form.orderDate" />}
                >
                  <DatePicker style={{ width: '100%' }}></DatePicker>
                </Form.Item>

                {/* <Form.Item
          // label="Order No:"
          label={<FormattedMessage id="villageForm.form.orderNo" />}

        > 
        <Input></Input>
        </Form.Item> */}
              </Col>
              <Col xl={1} lg={2} md={1}></Col>
              <Col xl={11} lg={10} md={10} sm={24} xs={24}>
                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: 'Please Enter Order Number',
                    },
                    { max: 100, message: 'This field shoud be up to 100 characters' },
                  ]}
                  name="orderNo"
                  // label="Order No:"
                  label={<FormattedMessage id="villageForm.form.orderNo" />}
                >
                  <Input onKeyPress={KeyPressEvents.isInputVarchar} maxLength={100}></Input>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                <Form.Item
                  name="year"
                  label={<FormattedMessage id="villageForm.form.year" />}
                  rules={[
                    {
                      required: true,
                      message: <FormattedMessage id="villageForm1E.table.ruleYear" />,
                    },
                  ]}
                >
                  <DatePicker picker="year" style={{ width: '100%' }}></DatePicker>
                </Form.Item>
              </Col>
              <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>
              <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                <Form.Item
                  rules={[
                    // {
                    //   required: true,
                    //   message: 'Please Enter Remarks',
                    // },
                    { max: 200, message: 'This field shoud be up to 200 characters' },
                  ]}
                  name="remarks"
                  //  label="Remarks:"
                  label={<FormattedMessage id="formLanguage.table.remark" />}
                >
                  <Input.TextArea
                    onKeyPress={KeyPressEvents.isInputChar}
                    maxLength={201}
                  ></Input.TextArea>
                </Form.Item>
              </Col>
            </Row>
            <Row style={{ marginTop: 30 }}>
              <Col xs={1} sm={5} md={7} lg={6} xl={8}></Col>
              <Col xs={1} sm={1} md={1} lg={2} xl={2}>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={isLoading}
                    onClick={() => {
                      if (textForVillage && khataNumberValue) {
                        onFormFinish();
                      } else if (textForVillage == null) {
                        message.info('Please Select Village');
                      } else if (khataNumberValue == null) {
                        message.info('Please Select Khata Number');
                      }
                    }}
                  >
                    <FormattedMessage id="formLanguage.button.save" />
                  </Button>
                </Form.Item>
              </Col>
              <Col xl={1} lg={2} md={3} sm={4} xs={7}></Col>
              <Col xl={2} lg={2} md={1} sm={1} xs={1}>
                <Button
                  onClick={resetFrom}
                  type="default"
                  htmlType="submit"
                  style={{ color: 'white', backgroundColor: 'orange' }}
                >
                  <FormattedMessage id="formLanguage.button.reset" />
                </Button>
              </Col>
              <Col xl={1} lg={2} md={3} sm={4} xs={7}></Col>
              <Col xl={2} lg={2} md={1} sm={1} xs={1}>
                <Button type="danger" onClick={cancelForm} htmlType="submit">
                  <FormattedMessage id="formLanguage.button.cancel" />
                </Button>
              </Col>
            </Row>
          </Form>
        </Card>
      )}
    </>
  );
}

export default Form7B;
