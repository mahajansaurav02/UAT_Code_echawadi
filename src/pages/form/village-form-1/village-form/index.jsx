import {
  Card,
  message,
  DatePicker,
  Button,
  Form,
  Input,
  Select,
  Row,
  Col,
  Divider,
  Popconfirm,
} from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import ValidationPatterns from '@/components/eComponents/ValidationPatterns';
import { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import moment from 'moment';
import VillageSelector from '@/components/eComponents/VillageSelector';
import URLS from '@/URLs/urls';
import useAxios from '@/components/eComponents/use-axios';
import { FormattedMessage, useModel } from 'umi';
import ValidationExpressions from '@/util/ValidationExpressions';
import KeyPressEvents from '@/util/KeyPressEvents';
import { useForm } from 'antd/lib/form/Form';

const BasicForm = () => {
  const [validatStateEferfar, setValidatStateEferfar] = useState(false);
  const { sendRequest } = useAxios();
  const { districtName, talukaName, servarthId, districtCode, talukaCode } = useModel('details');
  const location = useLocation();
  const [hissaNumber, setHissaNumber] = useState([]);
  const [textForVillage, setTextForVillage] = useState();
  const [surveyNumberValue, setSurveyNumberValue] = useState();
  const [hissaNumberValue, setHissaNumberValue] = useState();
  const [potkharabaType, setPotkharabaType] = useState('');
  const [showGetDataButton, setShowGetDataButton] = useState(false);
  const [showHissaNumberInput, setShowHissaNumberInput] = useState(false);
  const [form2] = Form.useForm();
  const [form1] = Form.useForm();
  const [hissaForm] = Form.useForm();

  const [codeVillage, setCodeVillage] = useState('');
  const [flagButton, setFlagButton] = useState(true);
  const [flagButton2, setFlagButton2] = useState(true);
  const [village, setVillage] = useState([]);
  const [textVillage, setTextVillage] = useState('');
  const [buttonVisible, setButtonVisible] = useState(false);
  let history = useHistory();
  const [datePicker, setDatePicker] = useState();
  const [khataNoInRes, setKhataNoInRes] = useState();
  const [pin1FromRes, setPin1FromRes] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [orderDateee, setOrderDateee] = useState();
  const [cultivableAreaaa, setCultivableAreaa] = useState();
  const [revenueYear, setRevenueYear] = useState();
  const [requiredHissa, setRequiredHissa] = useState(false);
  const success = () => {
    message.success('Data Saved!!');
  };

  useEffect(() => {
    // console.log('id in record is====>', location.state?.pageMode);
    if (location.state?.pageMode === 'Edit' || location.state?.pageMode === 'View') {
      getDataById();
    }

    let potkharabaTypeInt;
    let cultivableAreaInt;

    if (location.state?.potkharabaBH == '0.0000') {
      setPotkharabaType('अ');
      potkharabaTypeInt = 'अ';
      cultivableAreaInt = location.state?.potkharabaAH;
      setCultivableAreaa(cultivableAreaInt);
    } else if (location.state?.potkharabaAH == '0.0000') {
      setPotkharabaType('ब');
      potkharabaTypeInt = 'ब';
      cultivableAreaInt = location.state?.potkharabaBH;
      setCultivableAreaa(cultivableAreaInt);
    } else {
      setPotkharabaType('अ,ब');
      potkharabaTypeInt = 'अ,ब';
      cultivableAreaInt = location.state?.potkharabaAH + ',' + location.state?.potkharabaBH;
      setCultivableAreaa(cultivableAreaInt);
    }

    setOrderDateee(location.state?.orderDate);
  }, []);

  const getHissaFromSurvey = async () => {
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
      },
      (err) => {},
    );
    /*  if (hissaNumber === null) {
      getFerfarData();
    } */ setShowHissaNumberInput(true);
  };

  const { Option } = Select;

  function handleChange(value) {
    // console.log(`selected ${value}`);
  }

  const handleOnChange = (value, event) => {
    setFlagButton(false);
    setTextVillage(event.label);
    setCodeVillage(value);
    // console.log('Name of Village ==>>', event.label, 'cCode==>>', value);
  };

  const getFerfarData = async () => {
    setButtonVisible(true);
    setTimeout(() => setButtonVisible(false), 5000);
    setIsLoading(true);

    // console.log('pin 1==>', pin1, 'Hissa Number', hissaNumberValue);
    sendRequest(
      `${URLS.BaseURL}/restservice/getForm1DetailsBySurveyAndHissa?districtCode=${districtCode}&talukaCode=${talukaCode}&cCode=${codeVillage}&pin=${surveyNumberValue}&hissaNo=${hissaNumberValue}`,
      'GET',
      null,
      (r) => {
        // console.log(r.data);
        // console.log('rushi', r.data[0].khataNo);
        let potkharabaTypeInt;
        let cultivableAreaInt;
        let setcCodeInRes = r.data.cCode;
        let naAgriAssesment;

        if (r.data[0].naAssessment != null && r.data[0].naAssessment > 0) {
          naAgriAssesment = r.data[0].naAssessment;
        } else {
          naAgriAssesment = r.data[0].assessment;
        }

        if (r.data[0].potkharabaBH == '0.0000') {
          setPotkharabaType('अ');
          potkharabaTypeInt = 'अ';
          cultivableAreaInt = r.data[0].potkharabaAH;
        } else if (r.data[0].potkharabaAH == '0.0000') {
          setPotkharabaType('ब');
          potkharabaTypeInt = 'ब';
          cultivableAreaInt = r.data[0].potkharabaBH;
        } else {
          setPotkharabaType('अ,ब');
          potkharabaTypeInt = 'अ,ब';
          cultivableAreaInt = r.data[0].potkharabaAH + ',' + r.data[0].potkharabaBH;
        }

        // console.log('Data array returned', r.data[0]);
        // console.log('Type of potkharaba', potkharabaType);
        // console.log('Cultivable Area', cultivableAreaInt);
        form2.setFieldsValue({
          tenureName: r.data[0].tenureName,
          totalAreaH: r.data[0].totalAreaH,
          naAssessment: naAgriAssesment,
          cultivationArea: cultivableAreaInt,
          potkharabaType: potkharabaTypeInt,
          netCultiAreaH: r.data[0].netCultiAreaH,
        });
        setKhataNoInRes(r.data[0].khataNo);
        // console.log('current khata Number', r.data[0].khataNo);
        setValidatStateEferfar(true);
      },
    );

    message.info('e-Ferfar Data Fetched !');
  };
  const getDataById = async () => {
    sendRequest(
      `${URLS.BaseURL}/form1/getForm1DataById?id=${location.state?.id}`,
      'GET',
      null,
      (row) => {
        let pin1FromResponse = row.data.pin1;
        setPin1FromRes(pin1FromResponse);
        // console.log('Rushi==>>', row.data);
        setDatePicker(row.data.orderDate);
        form2.setFieldsValue({
          // id: row.data.id,
          // surveyNumber: row.data.pin,

          Designation: row.data.designation,
          public_rights: row.data.publicRightsOfWayAndEasements,
          Particulars: row.data.particularsOfAlteration,
          remark: row.data.remarks,
          order_num: row.data.orderNo,
        });
        const orderDate = moment(row.data.orderDate, 'DD/MM/YYYY').format('YYYY-MM-DD');
        var desig = row.data.designation;

        // console.log('values in data and desig');
      },
    );
  };

  const onFinish = async (values) => {
    const inputParamsForAdd = {
      revenueYear: revenueYear,
      districtCode: districtCode,
      talukaCode: talukaCode,
      cCode: codeVillage,

      pin: surveyNumberValue,
      hissaNo: hissaNumberValue,

      publicRightsOfWayAndEasements: form2.getFieldValue('public_rights'),
      particularsOfAlteration: form2.getFieldValue('Particulars'),
      designation: form2.getFieldValue('Designation'),
      orderDate: form2.getFieldValue('order_date'),
      orderNo: form2.getFieldValue('order_num'),
      remarks: form2.getFieldValue('remark'),
    };
    const inputParamsForEdit = {
      revenueYear: location.state?.revenueYear,
      districtCode: location.state?.districtCode,
      talukaCode: location.state?.talukaCode,
      cCode: location.state?.cCode,

      id: location.state?.id,
      pin: location.state?.surveyNo,
      hissaNo: location.state?.hissaNo,

      publicRightsOfWayAndEasements: form2.getFieldValue('public_rights'),
      particularsOfAlteration: form2.getFieldValue('Particulars'),
      designation: form2.getFieldValue('Designation'),
      orderDate: orderDateee,
      orderNo: form2.getFieldValue('order_num'),
      remarks: form2.getFieldValue('remark'),
      // orderDate:  moment(location.state?.orderDate, 'DD/MM/YYYY').format('YYYY-MM-DD'),
    };
    /*  if (validatStateEferfar == false) {
      message.info('Please Fetch Eferfar Data !');
    } */
    if (
      location.state?.pageMode === 'Add' ||
      (location.state?.pageMode === undefined && validatStateEferfar)
    ) {
      sendRequest(`${URLS.BaseURL}/form1/saveForm1`, 'POST', inputParamsForAdd, (res) => {
        // console.log('--form2 17 Add Call-' + res.status);
        {
          if (res.status === 201) {
            success();
            form2.resetFields();
            history.push({
              pathname: `/form/village-form-1/table-form`,
            });
          }
        }
      });
    } else if (location.state?.pageMode === 'Edit') {
      // console.log('paramsForEdit', inputParamsForEdit);
      sendRequest(`${URLS.BaseURL}/form1/editForm1`, 'PUT', inputParamsForEdit, (res) => {
        // console.log('--form 17 Edit Called-' + res.status);
        {
          if (res.status === 200) {
            success();
            form2.resetFields();
            history.push({
              pathname: `/form/village-form-1/table-form`,
            });
          }
        }
      });
    }
  };

  function handleChangeForSurveyNo(event) {
    hissaForm.resetFields();
    form2.resetFields();
    form1.resetFields();
    setSurveyNumberValue(event.target.value);
    setShowHissaNumberInput(false);
    setShowGetDataButton(false);
    setValidatStateEferfar(false);
  }

  function handleChangeForHissaNo(event) {
    setHissaNumberValue(event);
    setFlagButton2(false);
    setShowGetDataButton(true);
    setRequiredHissa(true);
  }

  const cancelForm = () => {
    history.push({
      pathname: `/form/village-form-1/table-form`,
    });
  };

  function cancel(e) {
    // console.log(e);
    message.error('Request Cancelled !!!');
  }

  return (
    <>
      <Card>
        <h1>
          <center>
            <FormattedMessage id="formLanguage.label.villageForm" />
          </center>
        </h1>
        <h2>
          <center>
            <FormattedMessage id="formLanguage.label.landRegister" />
          </center>
        </h2>
        {(location.state?.pageMode === 'View' || location.state?.pageMode === 'Edit') && (
          <Row style={{ marginBottom: 10 }}>
            <Col span={24}>
              <label htmlFor="" style={{ paddingRight: '5px' }}>
                जिल्हा :
              </label>
              <Select
                disabled
                value={districtName}
                //placeholder="अमरावती"
                style={{ width: 150, marginRight: '15px' }}
              ></Select>
              <label htmlFor="" style={{ paddingRight: '5px' }}>
                तालुका :
              </label>
              <Select
                disabled
                value={talukaName}
                // placeholder="अचलपूर"
                style={{ width: 150, marginRight: '15px' }}
              ></Select>
              <label htmlFor="" style={{ paddingRight: '5px' }}>
                गाव :{' '}
                <Input
                  disabled
                  value={location.state?.villageName}
                  style={{ width: 150, marginRight: '15px' }}
                />
              </label>

              {(location.state?.pageMode === 'View' || location.state?.pageMode === 'Edit') && (
                <label htmlFor="" style={{ paddingRight: '5px' }}>
                  <FormattedMessage id="formLanguage.table.surveyNo" />:
                  <Input
                    disabled
                    style={{ width: 150, marginRight: '15px' }}
                    value={location.state?.surveyNo}
                  />
                </label>
              )}
            </Col>
          </Row>
        )}

        <Form form={form1}>
          {(location.state?.pageMode === 'Add' || location.state?.pageMode === undefined) && (
            <>
              {/* <Row style={{ marginLeft: '15px' }}>
              <VillageSelector
                setCodeVillage={setCodeVillage}
                setTextForVillage={setTextForVillage}
                onVillageChange={(setVillage, setFlagButton)}
              />
            </Row> */}
              {(location.state?.pageMode === 'Add' || location.state?.pageMode === undefined) && (
                // <Row style={{ marginLeft: '5px' }}>
                <VillageSelector
                  pageType="withoutYear"
                  setCodeVillage={setCodeVillage}
                  setTextForVillage={setTextForVillage}
                  onVillageChange={(setVillage, setFlagButton)}
                  yearChange={setRevenueYear}
                />
                // </Row>
              )}
              {(location.state?.pageMode === 'View' || location.state?.pageMode === 'Edit') && (
                <Row style={{ marginBottom: 10 }}>
                  <Col span={24}>
                    <label htmlFor="" style={{ paddingRight: '5px' }}>
                      <FormattedMessage id="villageForm17.table.district" />
                    </label>
                    <Select
                      disabled
                      placeholder="नांदेड"
                      style={{ width: 150, marginRight: '15px' }}
                    ></Select>
                    <label htmlFor="" style={{ paddingRight: '5px' }}>
                      <FormattedMessage id="villageForm17.table.taluka" />
                    </label>
                    <Select
                      disabled
                      placeholder="मुदखेड"
                      style={{ width: 150, marginRight: '15px' }}
                    ></Select>

                    <label htmlFor="" style={{ paddingRight: '5px' }}>
                      <FormattedMessage id="villageForm17.table.village" />

                      <Input
                        disabled
                        value={location.state?.villageName}
                        style={{ width: 150, marginRight: '15px' }}
                      />
                    </label>
                  </Col>
                </Row>
              )}

              {/* <Form layout="inline"> */}

              <Row style={{ marginTop: '20px' }}>
                <Col xl={8} lg={10} md={11} sm={19} xs={19}>
                  <Form.Item
                    wrapperCol={{
                      xl: 14,
                      lg: 11,
                      md: 11,
                      xs: 12,
                    }}
                    label={<FormattedMessage id="formLanguage.table.surveyNo" />}
                    //name="survey_number"
                    rules={[
                      { required: true, message: 'Survey Number is necessary!' },
                      {
                        type: 'string',
                        max: 7,
                        message: 'Survey Number should be upto 7 numbers',
                      },
                    ]}
                    /*  style={{ marginLeft: '9px' }} */
                  >
                    <Input
                      onKeyPress={KeyPressEvents.isInputNumber}
                      maxLength={8}
                      onChange={handleChangeForSurveyNo}
                    />
                  </Form.Item>
                </Col>
                <Col xl={1} sm={1}></Col>
                <Col xl={2} lg={2} md={2} sm={2} xs={1}>
                  <Form.Item style={{ marginLeft: 6 }}>
                    <Button
                      //  style={{ marginLeft: 10 }}
                      type="primary"
                      /*   disabled={flagButton || flagButton2} */
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
                  </Form.Item>
                </Col>
                <Col></Col>
                <Col lg={1} md={1}></Col>

                <Col xl={7} lg={10} md={10} sm={24} xs={24}></Col>
              </Row>
              {/* </Form> */}
            </>
          )}
        </Form>

        <Row style={{ marginTop: 10 }}>
          <Col span={6}>
            <Form form={hissaForm}>
              {showHissaNumberInput && (
                <Form.Item
                  wrapperCol={{
                    xl: 14,
                    lg: 11,
                    md: 11,
                  }}
                  label={<FormattedMessage id="formLanguage.form.hissaNo" />}
                  name="hissaNo"
                >
                  <Select
                    options={hissaNumber}
                    onSelect={(value, event) => handleChangeForHissaNo(value, event)}
                    placeholder="Select Hissa Number"
                  ></Select>
                </Form.Item>
              )}
            </Form>
          </Col>
          <Col span={1}></Col>
          <Col span={6}>
            {showGetDataButton && (
              <Button
                disabled={buttonVisible}
                style={{ paddingLeft: 25 }}
                type="primary"
                onClick={getFerfarData}
              >
                <FormattedMessage id="formLanguage.button.getFerfar" />
              </Button>
            )}
          </Col>
        </Row>
      </Card>

      <Form layout="vertical" onSubmit={onFinish} form={form2} loading={isLoading}>
        <Card style={{ marginTop: 20 }} bordered={true}>
          <Divider orientation="left" style={{ marginBottom: 30 }}>
            <FormattedMessage id="formLanguage.form.eFerfar" />
            <b> </b>
          </Divider>

          {/* Add form Logic */}

          {/*  <Form layout="vertical" form={form2} loading={isLoading}> */}

          <Row>
            <Col xl={7} lg={7} md={7} sm={7} xs={24}>
              <Form.Item
                // labelCol={{
                //   xl: 10,
                // }}
                // wrapperCol={{
                //   span: 20,
                // }}
                label={<FormattedMessage id="formLanguage.table.tenure" />}
                name="tenureName"
                rules={[{ required: true, message: 'Please Enter Tenure!' }]}
              >
                <Input disabled defaultValue={location.state?.tenureName}></Input>
              </Form.Item>
            </Col>
            <Col xl={1} lg={1} md={1} sm={1}></Col>
            <Col xl={7} lg={7} md={7} sm={7} xs={24}>
              <Form.Item
                label={<FormattedMessage id="formLanguage.table.totalArea" />}
                name="totalAreaH"
                rules={[
                  { required: true, message: 'Please Enter NA Area!' },
                  {
                    pattern: ValidationPatterns.NUMBERS_ONLY,
                    message: 'Please Enter in Correct Format',
                  },
                ]}
              >
                <Input disabled defaultValue={location.state?.totalAreaH} />
              </Form.Item>
            </Col>
            <Col xl={1} lg={1} md={1} sm={1}></Col>
            <Col xl={7} lg={7} md={7} sm={7} xs={24}>
              <Form.Item
                label={<FormattedMessage id="formLanguage.table.naAssessment" />}
                type="number"
                name="naAssessment"
                rules={[
                  { required: true, message: 'Please Enter Agricultural Area!' },
                  {
                    pattern: ValidationPatterns.NUMBERS_ONLY,
                    message: 'Please Enter in Correct Format',
                  },
                ]}
              >
                <Input disabled defaultValue={location.state?.agricultureAssessment} />
              </Form.Item>
            </Col>
          </Row>

          <Row style={{ marginTop: 30 }}>
            <Col xl={7} lg={7} md={7} sm={7} xs={24}>
              {location.state?.pageMode === 'Add' || location.state?.pageMode === undefined ? (
                <Form.Item
                  // labelCol={{
                  //   span: 10,
                  // }}
                  // wrapperCol={{
                  //   span: 20,
                  // }}
                  label={<FormattedMessage id="formLanguage.table.kind" />}
                  name="potkharabaType"
                  rules={[{ required: true, message: 'Please Enter Area!' }]}
                >
                  <Input disabled />
                </Form.Item>
              ) : (
                <Form.Item
                  label={<FormattedMessage id="villageForm1.table.kind" />}
                  rules={[{ required: true, message: 'Please Enter Area!' }]}
                >
                  {location.state?.pageMode != 'Add' && (
                    <Input
                      //   addonBefore={<FormattedMessage id="villageForm1.table.kind" />}
                      name="potkharabaType"
                      rules={[{ required: true, message: 'Please Enter Area!' }]}
                      disabled
                      value={potkharabaType}
                    />
                  )}
                </Form.Item>
              )}
            </Col>
            <Col xl={1} lg={1} md={1} sm={1}></Col>
            <Col xl={7} lg={7} md={7} sm={7} xs={24}>
              {location.state?.pageMode === 'Add' || location.state?.pageMode === undefined ? (
                <Form.Item
                  // labelCol={{
                  //   span: 10,
                  // }}
                  // wrapperCol={{
                  //   span: 20,
                  // }}
                  label={<FormattedMessage id="formLanguage.table.area" />}
                  name="cultivationArea"
                  rules={[{ required: true, message: 'Please Enter Cultivation Area!' }]}
                >
                  <Input
                    disabled
                    rules={[
                      { required: true, message: 'Please Enter Cultivation Area!' },
                      {
                        pattern: ValidationPatterns.NUMBERS_ONLY,
                        message: 'Please Enter in Correct Format',
                      },
                    ]}
                  />
                </Form.Item>
              ) : (
                <Form.Item
                  label={<FormattedMessage id="villageForm1.table.area" />}
                  rules={[{ required: true, message: 'Please Enter Cultivation Area!' }]}
                >
                  {location.state?.pageMode != 'Add' && (
                    <Input
                      // addonBefore={<FormattedMessage id="villageForm1.table.area" />}
                      name="cultivationArea"
                      value={cultivableAreaaa}
                      disabled
                    />
                  )}
                </Form.Item>
              )}
            </Col>
            <Col xl={1} lg={1} md={1} sm={1}></Col>
            <Col xl={7} lg={7} md={7} sm={8} xs={24}>
              <Form.Item
                // labelCol={{
                //   span: 14,
                // }}
                // wrapperCol={{
                //   span: 20,
                // }}

                label={<FormattedMessage id="formLanguage.table.netCultivableArea" />}
                type="number"
                name="netCultiAreaH"
                rules={[
                  { required: true, message: 'Please Enter Cultivable Area!' },
                  {
                    pattern: ValidationPatterns.NUMBERS_ONLY,
                    message: 'Please Enter in Correct Format',
                  },
                ]}
              >
                <Input disabled defaultValue={location.state?.netCultivationArea} />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card style={{ marginTop: 15 }}>
          <Divider orientation="left" style={{ marginBottom: 30 }}>
            <b>
              <FormattedMessage id="formLanguage.form.echawdi" />
            </b>
          </Divider>

          <Row>
            <Col xl={11} lg={11} md={11} sm={24} xs={24}>
              <Form.Item
                label={<FormattedMessage id="formLanguage.table.publicRights" />}
                name="public_rights"
                rules={[
                  {
                    required: true,
                    message: <FormattedMessage id="villageForm1.table.publicRightsOfWays" />,
                  },
                  { max: 200, message: 'This field should be below 200 characters' },
                ]}
              >
                <Input.TextArea
                  //    onKeyPress={KeyPressEvents.isInputChar}
                  maxLength={201}
                  disabled={location.state?.pageMode === 'View'}
                />
              </Form.Item>
            </Col>
            <Col xl={2} lg={2} md={2}></Col>
            <Col xl={11} lg={11} md={11} sm={24} xs={24}>
              <Form.Item
                label={<FormattedMessage id="formLanguage.table.alteration" />}
                name="Particulars"
                rules={[
                  {
                    required: true,
                    message: <FormattedMessage id="villageForm1.table.particularsOfAlteration" />,
                  },
                  { max: 50, message: 'This field should be below 50 characters' },
                ]}
              >
                <Input
                  //   onKeyPress={KeyPressEvents.isInputChar}
                  maxLength={51}
                  disabled={location.state?.pageMode === 'View'}
                />
              </Form.Item>
            </Col>
          </Row>

          <h3 style={{ marginTop: 5 }}>
            <FormattedMessage id="formLanguage.form.sanctioningChanges" />
          </h3>
          <Row>
            <Col xl={11} lg={11} md={11} sm={24} xs={24}>
              <Form.Item
                label={<FormattedMessage id="formLanguage.table.designation" />}
                name="Designation"
                rules={[
                  {
                    required: true,
                    message: <FormattedMessage id="villageForm1.table.ruleDesignation" />,
                  },
                  { max: 50, message: 'This field should be below 50 characters' },
                ]}
              >
                <Select
                  maxLength={51}
                  placeholder="पदनाम"
                  onChange={handleChange}
                  disabled={location.state?.pageMode === 'View'}
                  // defaultValue={desig}
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
            <Col xl={2} lg={2} md={2}></Col>
            <Col xl={11} lg={11} md={11} sm={24} xs={24}>
              {location.state?.pageMode === 'Add' || location.state?.pageMode === undefined ? (
                <Form.Item
                  name="order_date"
                  label={<FormattedMessage id="formLanguage.table.orderDate" />}
                  rules={[
                    {
                      required: true,
                      message: <FormattedMessage id="villageForm1.table.ruleOrderDate" />,
                    },
                  ]}
                >
                  <DatePicker
                    style={{ width: '100%' }}
                    disabled={location.state?.pageMode === 'View'}
                  />
                </Form.Item>
              ) : (
                <Form.Item
                  name="order_date"
                  label={<FormattedMessage id="formLanguage.table.orderDate" />}
                >
                  <DatePicker
                    defaultValue={moment(location.state?.orderDate, 'YYYY-MM-DD')}
                    disabled={location.state?.pageMode === 'View'}
                    onChange={(e) => {
                      setOrderDateee(moment(e).format('YYYY-MM-DD'));
                      // console.log('date change', e);
                    }}
                    onSelect={(e) => {
                      // console.log('onselect', e);
                    }}
                  />
                </Form.Item>
              )}
            </Col>
          </Row>

          <Row>
            <Col xl={11} lg={11} md={11} sm={24} xs={24}>
              <Form.Item
                label={<FormattedMessage id="formLanguage.table.orderNo" />}
                name="order_num"
                rules={[
                  {
                    required: true,
                    message: <FormattedMessage id="villageForm1.table.ruleOrderNo" />,
                  },
                  { max: 50, message: 'This field should be below 50 characters' },
                ]}
              >
                <Input
                  type="text"
                  //  onKeyPress={KeyPressEvents.isInputVarchar}
                  maxLength={51}
                  disabled={location.state?.pageMode === 'View'}
                ></Input>
              </Form.Item>
            </Col>
            <Col xl={2} lg={2} md={2}></Col>
            <Col xl={11} lg={11} md={11} sm={24} xs={24}>
              <Form.Item
                label={<FormattedMessage id="formLanguage.table.remark" />}
                name="remark"
                rules={[
                  /*  {
                    required: true,
                    message: <FormattedMessage id="villageForm1.table.ruleRemarks" />,
                  }, */
                  { max: 200, message: 'This field should be below 200 characters' },
                ]}
              >
                <Input.TextArea
                  //  onKeyPress={KeyPressEvents.isInputChar}
                  maxLength={201}
                  disabled={location.state?.pageMode === 'View'}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col sm={2} md={4} lg={4} xl={8}></Col>
            <Col xs={1} sm={1} md={1} lg={2} xl={2}>
              {(location.state?.pageMode === 'Add' || location.state?.pageMode === undefined) && (
                /*   <Popconfirm
                  title={<FormattedMessage id="formLanguage.form.popForSave" />}
                  onConfirm={onFinish}
                  onCancel={cancel}
                  okText={<FormattedMessage id="formLanguage.form.yes" />}
                  cancelText={<FormattedMessage id="formLanguage.form.no" />}
                  || location.state?.pageMode === 'Edit'
                > */
                <Button
                  type="primary"
                  htmlType="submit"
                  onClick={() => {
                    if (
                      textForVillage &&
                      surveyNumberValue &&
                      requiredHissa &&
                      validatStateEferfar
                    ) {
                      onFinish();
                    } else if (textForVillage == null) {
                      message.info('Please Select Village');
                    } else if (surveyNumberValue == null) {
                      message.info('Please Enter Survey Number');
                    } else if (requiredHissa == false) {
                      message.info('Please Search for Hissa Number');
                    } else if (!validatStateEferfar) {
                      message.info('Please Search for e-Ferfar Data');
                    }
                  }}
                >
                  <FormattedMessage id="formLanguage.button.save" />
                </Button>
                //</Popconfirm>
              )}

              {location.state?.pageMode === 'Edit' && (
                /*   <Popconfirm
                  title={<FormattedMessage id="formLanguage.form.popForSave" />}
                  onConfirm={onFinish}
                  onCancel={cancel}
                  okText={<FormattedMessage id="formLanguage.form.yes" />}
                  cancelText={<FormattedMessage id="formLanguage.form.no" />}
                  || location.state?.pageMode === 'Edit'
                > */
                <Button
                  type="primary"
                  htmlType="submit"
                  onClick={onFinish} /* () => {
                    if (textForVillage && surveyNumberValue && revenueYear && requiredHissa) {
                      ();
                    } else if (textForVillage == null) {
                      message.info('Please Select Village');
                    } else if (revenueYear == null) {
                      message.info('Please Select Revenue Year');
                    } else if (surveyNumberValue == null) {
                      message.info('Please Select Survey Number');
                    } else if (requiredHissa == false) {
                      message.info('Please Search for Hissa Number');
                    }
                  }} */
                >
                  <FormattedMessage id="formLanguage.button.save" />
                </Button>
                //</Popconfirm>
              )}
            </Col>
            <Col xl={1} lg={2} md={3} sm={4} xs={8}>
              {' '}
            </Col>
            <Col xl={2} lg={2} md={1} sm={1} xs={1}>
              {(location.state?.pageMode === 'Add' || location.state?.pageMode === undefined) && (
                <Button
                  onClick={() => {
                    form2.resetFields();
                    setShowHissaNumberInput(false);
                    setShowGetDataButton(false);
                    hissaForm.resetFields();
                    setValidatStateEferfar(false);
                  }}
                  type="default"
                  style={{ color: 'white', backgroundColor: 'orange' }}
                >
                  <FormattedMessage id="formLanguage.button.reset" />
                </Button>
              )}
            </Col>

            <Col xl={1} lg={2} md={3} sm={4} xs={8}></Col>
            <Col xl={2} lg={2} md={1} sm={1} xs={1}>
              <Button
                onClick={cancelForm}
                type="danger"
                htmlType="submit"
                // style={{ marginLeft: 25 }}
              >
                <FormattedMessage id="formLanguage.button.cancel" />
              </Button>
            </Col>
          </Row>
        </Card>
      </Form>
    </>
  );
};

export default BasicForm;
