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
  Radio,
  Row,
  Select,
} from 'antd';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import URLS from '@/URLs/urls';
import useAxios from '@/components/eComponents/use-axios';
import { FormattedMessage, useModel } from 'umi';
import ESelector from '@/components/eComponents/ESelector';
import KeyPressEvents from '@/util/KeyPressEvents';

function Form1E() {
  const [showArea, setShowArea] = useState(false);
  const [revenueYear, setRevenueYear] = useState();
  const { districtName, servarthId, districtCode, talukaCode } = useModel('details');
  const [codeVillage, setCodeVillage] = useState('');
  const [isNirank, setIsNirank] = useState(false);

  const [textVillage, setTextVillage] = useState('');
  const [buttonFlag, setButtonFlag] = useState(true);
  const [flagButton, setFlagButton] = useState(true);
  const [flagButton2, setFlagButton2] = useState(true);
  const [form1E] = Form.useForm();
  const [showGetDataButton, setShowGetDataButton] = useState(false);
  const [surveyNumberValue, setSurveyNumberValue] = useState();
  const [hissaNumber, setHissaNumber] = useState(false);
  const [hissaNumberValue, setHissaNumberValue] = useState([]);
  const [showAreaInput, setshowAreaInput] = useState(false);
  const [radiovalue, setRadioValue] = useState();
  const [totalAreaValue, setTotalAreaValue] = useState();
  const [totalAreaInUOM, setTotalAreaInUOM] = useState();
  const [areaOfEnchroachment, setAreaOfEnchroachment] = useState();
  const [area, setArea] = useState();
  const { sendRequest } = useAxios();
  const [file, setFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState();
  const [showHissaNumberInput, setShowHissaNumberInput] = useState(false);
  const [saveFlag, setSaveFlag] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [loadings, setLoadings] = useState([]);

  const initvalues = {
    image: '',
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

  function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  const errorMessage = async () => {
    message.info(' Area of Enchroachment should be Less than or Equal to Total Area');
  };

  useEffect(() => {
    if (areaOfEnchroachment > area) {
      errorMessage();
      setSaveFlag(false);
    } else {
      setSaveFlag(true);
    }
  }, [areaOfEnchroachment, area]);

  const handleFile = async (e) => {
    function checkFileSize(fileSize) {
      if (fileSize >= 2097152) {
        message.error('File Should not be more than 2 MB !');
        form1E.setFieldsValue({ image: '' });
        return false;
      } else {
        return true;
      }
    }
    function checkFileExtension(filename) {
      const extension = filename.split('.').pop();
      // console.log(extension);
      if (['jpeg', 'jpg', 'png', 'pdf'].indexOf(extension) < 0) {
        message.error('Please Select Valid File Format JPEG,JPG,PNG,PDF!');
        form1E.setFieldsValue({ image: '' });
        return false;
      } else {
        return true;
      }
    }
    if (e.target.files && e.target.files.length > 0) {
      if (checkFileExtension(e.target.files[0].name)) {
        if (checkFileSize(e.target.files[0].size)) {
          setFile(e.target.files[0]);
          setSelectedImage(await getBase64(e.target.files[0]));
        }
      }
    } else {
      setSelectedImage(null);
    }
    e.target.files = null;
    // const myfile = URL.creatObjectURL(e.target.files[0]);
    // setFile(myfile);
    // console.log(e.target.files);
    // if (e.target.files && e.target.files.length > 0) {
    //   setSelectedImage(myfile);
    // }
  };

  const handleESelectorChangeHissa = (flagGetDataButton, sn, hn, cCodeV) => {
    // console.log('log in villahe form1E', flagGetDataButton, sn, hn, revenueYear);
    setShowGetDataButton(flagGetDataButton);
    setSurveyNumberValue(sn);
    setHissaNumberValue(hn);
    setCodeVillage(cCodeV);
    //  setRevenueYear(revenueYear);
    setHissaNumber(true);
  };

  const handleESelectorChange = (flagGetDataButton, sn, hn, cCodeV) => {
    // console.log('log in villahe form1E', flagGetDataButton, sn, hn, revenueYear);
    setShowGetDataButton(false);
    setSurveyNumberValue(sn);
    setHissaNumberValue(hn);
    setCodeVillage(cCodeV);
    //setRevenueYear(revenueYear);
    setArea('');
  };

  const getArea = async () => {
    sendRequest(
      `${
        URLS.BaseURL
      }/form1a/getForm1AArea?districtCode=${districtCode}&talukaCode=${talukaCode}&cCode=${codeVillage}&revenueYear=${revenueYear}&pin=${surveyNumberValue}&hissaNo=${
        hissaNumberValue == null ? '' : hissaNumberValue
      }`,
      'GET',
      null,
      (res) => {
        // console.log('full response', res.data);
        // console.log('total areaH', res.data[0].totalAreaH);
        let areaH = res.data[0].totalAreaH;
        setArea(areaH);
        setShowArea(true);
        form1E.setFieldsValue('areaH');
        // console.log('area in state==>', area);
      },
    ).catch((error) => {
      message.error('Invalid area');
    });
  };
  // moment(row.data.orderDate, 'YYYY-MM-DD').format('DD/MM/YYYY');
  const saveForm1E = async () => {
    setIsLoading(true);
    const inputParameters = {
      revenueYear: revenueYear,
      districtCode: districtCode,
      talukaCode: talukaCode,
      cCode: codeVillage,

      pin: surveyNumberValue,
      hissaNo: hissaNumberValue,
      dateOfEncroachment: moment(form1E.getFieldValue('dateOfEncroachment'), 'DD/MM/YYYY').format(
        'YYYY-MM-DD',
      ),
      nameOfEncroacher: form1E.getFieldValue('nameOfEncroacher'),
      purposeOfEncroachmentLand: form1E.getFieldValue('purposeOfEncroachmentLand'),
      yearFromWhichRentRecoverable: moment(
        form1E.getFieldValue('yearFromWhichRentRecoverable'),
        'DD/MM/YYYY',
      ).format('YYYY'),

      yearOfEncroachmentNotedIfRemoved:
        form1E.getFieldValue('yearOfEncroachmentNotedIfRemoved') != null
          ? moment(form1E.getFieldValue('yearOfEncroachmentNotedIfRemoved'), 'DD/MM/YYYY').format(
              'YYYY',
            )
          : null,
      dateOfDecisionOnEncroachment:
        form1E.getFieldValue('dateOfDecisionOnEncroachment') != null
          ? moment(form1E.getFieldValue('dateOfDecisionOnEncroachment'), 'DD/MM/YYYY').format(
              'YYYY-MM-DD',
            )
          : '1992-02-29',

      remarks: form1E.getFieldValue('remarks'),
      totalArea: area, //eferfar area.
      areaOfEncroached: areaOfEnchroachment, // user enterd area .
    };
    let myfile = file;
    let formData = new FormData();
    // console.log('file', myfile);
    formData.append('form1EDao', JSON.stringify(inputParameters));
    formData.append('file', myfile);
    // console.log('inputParameters being sent for Form1E Save API ==>>', formData);
    sendRequest(
      `${URLS.BaseURL}/form1e/saveForm1E`,
      'POST',
      formData,
      (res) => {
        if (res.status === 201) {
          message.success('Data Saved!!');
          history.push({
            pathname: `/form/village-form-1E/table-form`,
          });
          setIsLoading(false);
        }
      },
      (err) => {
        setIsLoading(false);
      },
    );
  };
  const onChangeRadioButton = (e) => {
    // console.log('radio checked', e.target.value);
    setRadioValue(e.target.value);
  };
  let history = useHistory();
  const resetFrom = () => {
    //!Remove Image from state here!!
    form1E.resetFields();
    setRadioValue('');
  };
  const cancelForm = () => {
    history.push({
      pathname: `/form/village-form-1E/table-form`,
    });
  };
  const onFinishFailed = ({ values, errorFields, outOfDate }) => {
    // console.log('Finish Failed called', values, errorFields, outOfDate);
  };

  return (
    <>
      <Card>
        <h2 style={{ marginBottom: '20px' }}>
          <center>{<FormattedMessage id="villageForm1E.table.villageForm1E" />}</center>
        </h2>
        <h2 style={{ marginBottom: '20px' }}>
          <center>{<FormattedMessage id="villageForm1E.table.registerEnchroachment" />}</center>
        </h2>

        <ESelector
          pageType={'withoutYear'}
          setFlagButton2={setFlagButton2}
          allDataV={handleESelectorChange}
          //setShowArea={setShowArea}
          //  revenueYear={setRevenueYear}
          allData={handleESelectorChangeHissa}
          setIsNirank={setIsNirank}
        />
        {showGetDataButton && (
          <>
            <Row style={{ paddingTop: 25 }}>
              <Col span={4}>
                {!isNirank && (
                  <Button
                    loading={loadings[0]}
                    type="primary"
                    onClick={() => {
                      getArea();
                      enterLoading(0);
                      if (hissaNumberValue == null) {
                        message.info('Please Search for Hissa Number');
                      }
                    }}
                  >
                    <FormattedMessage id="villageForm1E.table.showArea" />
                  </Button>
                )}
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
            </Row>
          </>
        )}
      </Card>
      <Card>
        {isNirank && (
          <>
            <Alert message="टीप" description="सदर गाव नमुना निरंक आहे." type="info" showIcon />
          </>
        )}
      </Card>
      {!isNirank && (
        <Card>
          <Divider orientation="left">
            {' '}
            <FormattedMessage id="formLanguage.form.echawdi" />
          </Divider>

          <Form
            form={form1E}
            layout={'vertical'}
            //  onFinish={saveForm1E}
            // onFinishFailed={onFinishFailed}
            initialValues={initvalues}
          >
            <Row>
              <Col xl={11} lg={9} md={8} sm={24} xs={24}>
                <Form.Item
                  name="nameOfEncroacher"
                  label={<FormattedMessage id="villageForm1E.table.nameEnchroacher" />}
                  rules={[
                    {
                      required: true,
                      message: <FormattedMessage id="villageForm1E.table.ruleEncroacher" />,
                    },
                    { type: '', max: 30, message: 'Name shoud be upto 30 characters' },
                  ]}
                >
                  <Input onKeyPress={KeyPressEvents.isInputChar} maxLength={31} />
                </Form.Item>
              </Col>

              <Col xl={1} lg={1} md={1}></Col>
              <Col xl={12} lg={14} md={15} sm={24} xs={24} style={{ paddingTop: 25 }}>
                <Form.Item
                  name="image"
                  rules={[
                    {
                      required: true,
                      message: <FormattedMessage id="villageForm1E.table.ruleImage" />,
                    },
                  ]}
                >
                  <Input
                    labelCol={{ xs: 8 }}
                    wrapperCol={{ xs: 8 }}
                    addonBefore={<FormattedMessage id="villageForm1E.table.uploadImage" />}
                    accept="image/*"
                    type={'file'}
                    name={'file'}
                    onChange={(e) => handleFile(e)}
                  ></Input>
                </Form.Item>
              </Col>
            </Row>

            <Row style={{ marginTop: 10 }}>
              <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                <Form.Item
                  name="dateOfEncroachment"
                  label={<FormattedMessage id="villageForm1E.table.enchroachmentDate" />}
                  rules={[
                    {
                      required: true,
                      message: <FormattedMessage id="villageForm1E.table.ruleDateOfEncroachment" />,
                    },
                  ]}
                >
                  <DatePicker></DatePicker>
                </Form.Item>
              </Col>
              <Col xl={1} lg={1} md={1}></Col>

              <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                <Form.Item
                  name="purposeOfEncroachmentLand"
                  label={<FormattedMessage id="villageForm1E.table.enchroachmentPurpose" />}
                  rules={[
                    {
                      required: true,
                      message: (
                        <FormattedMessage id="villageForm1E.table.rulePurposeOfEncroachment" />
                      ),
                    },
                  ]}
                >
                  <Select placeholder="उद्देश">
                    <Select.Option value="villageForm1E.table.agriculture">
                      <FormattedMessage id="villageForm1E.table.agriculture" />
                    </Select.Option>
                    <Select.Option value="villageForm1E.table.Non-agricultural">
                      <FormattedMessage id="villageForm1E.table.Non-agricultural" />
                    </Select.Option>
                    <Select.Option value="villageForm1E.table.Resident">
                      <FormattedMessage id="villageForm1E.table.Resident" />
                    </Select.Option>
                    <Select.Option value="villageForm1E.table.Farming">
                      <FormattedMessage id="villageForm1E.table.Farming" />
                    </Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row style={{ marginTop: 10 }}>
              <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                <Form.Item
                  name="yearFromWhichRentRecoverable"
                  label={<FormattedMessage id="villageForm1E.table.rentRecoverable" />}
                  rules={[
                    {
                      required: true,
                      message: <FormattedMessage id="villageForm1E.table.ruleYear" />,
                    },
                  ]}
                >
                  <DatePicker picker="year"></DatePicker>
                </Form.Item>
              </Col>
              <Col xl={1} lg={1} md={1}></Col>
              <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                <Form.Item
                  name="dateOfDecisionOnEncroachment"
                  label={<FormattedMessage id="villageForm1E.table.decisionOfEnchroachment" />}
                  rules={[
                    {
                      required: false,
                      message: (
                        <FormattedMessage id="villageForm1E.table.ruleDateOfEncroachmentDecision" />
                      ),
                    },
                  ]}
                >
                  <DatePicker></DatePicker>
                </Form.Item>
              </Col>
            </Row>

            <Row style={{ marginTop: 10 }}>
              <Col xl={11} lg={11} md={11} sm={24}>
                {radiovalue == 'Yes' ? (
                  <>
                    <Form.Item
                      name="yearOfEncroachmentNotedIfRemoved"
                      label={
                        <>
                          <FormattedMessage id="villageForm1E.table.enchroachmentColumn" />
                        </>
                      }
                      rules={[
                        {
                          required: true,
                          message: <FormattedMessage id="villageForm1E.table.ruleYear" />,
                        },
                      ]}
                    >
                      <DatePicker picker="year"></DatePicker>
                    </Form.Item>
                  </>
                ) : (
                  <>
                    <FormattedMessage id="villageForm1E.table.enchroachmentColumn" />
                    <br />
                  </>
                )}
                <Radio.Group name="radiogroup" value={radiovalue} onChange={onChangeRadioButton}>
                  <Radio value={'Yes'}>
                    <FormattedMessage id="villageForm1E.table.yes" />
                  </Radio>
                  <Radio value={'No'}>
                    <FormattedMessage id="villageForm1E.table.no" />
                  </Radio>
                </Radio.Group>
              </Col>
              <Col xl={1} lg={1} md={1}></Col>
              <Col xl={12} lg={12} md={12} sm={24}>
                <Form.Item
                  name="areaOfEncroached"
                  label={<FormattedMessage id="villageForm1E.table.areaOfEnchroached" />}
                  rules={[
                    {
                      required: true,
                      message: <FormattedMessage id="villageForm1E.table.ruleAreaOfEnchroached" />,
                    },
                    { max: 15, message: 'Remark shoud be upto 15 Numbers' },
                  ]}
                >
                  <Input
                    value={areaOfEnchroachment}
                    onChange={(event) => {
                      setAreaOfEnchroachment(event.target.value);
                    }}
                    onKeyPress={KeyPressEvents.isInputDecimal}
                    maxLength={16}
                  ></Input>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col xl={24} lg={24} md={24} sm={24}>
                <Form.Item
                  name="remarks"
                  label={<FormattedMessage id="formLanguage.table.remark" />}
                  rules={[
                    // {
                    //   required: true,
                    //   message: 'Please Enter Remarks',
                    // },
                    { type: 'string', max: 200, message: 'Remark shoud be upto 200 characters' },
                  ]}
                >
                  <Input.TextArea
                    onKeyPress={KeyPressEvents.isInputChar}
                    maxLength={201}
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
                  loading={isLoading}
                  onClick={() => {
                    if (surveyNumberValue && hissaNumber && showArea && saveFlag) {
                      saveForm1E();
                    } else if (surveyNumberValue == null) {
                      message.info('Please Select Village and Survey Number');
                    } else if (hissaNumber == false) {
                      message.info('Please Search for Hissa Number');
                    } else if (showArea == false) {
                      message.info('Please Search for e-Ferfar Data');
                    } else if (!saveFlag) {
                      errorMessage();
                    }
                  }}
                >
                  <FormattedMessage id="formLanguage.button.save" />
                </Button>
              </Col>
              <Col xl={1} lg={2} md={3} sm={4} xs={8}>
                {' '}
              </Col>
              <Col xl={2} lg={2} md={1} sm={1} xs={1}>
                <Button
                  onClick={resetFrom}
                  type="default"
                  style={{ color: 'white', backgroundColor: 'orange' }}
                >
                  <FormattedMessage id="formLanguage.button.reset" />
                </Button>
              </Col>

              <Col xl={1} lg={2} md={3} sm={4} xs={8}></Col>
              <Col xl={2} lg={2} md={1} sm={1} xs={1}>
                <Button onClick={cancelForm} type="danger">
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

export default Form1E;
