import ESelector from '@/components/eComponents/ESelector';
import { PageContainer } from '@ant-design/pro-layout';
import {
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
import useAxios from '@/components/eComponents/use-axios';
import { useHistory, useLocation } from 'react-router';
import moment from 'moment';
import KeyPressEvents from '@/util/KeyPressEvents';

const VillageForm2 = () => {
  const [authorityValue, setAuthorityValue] = useState();
  const { sendRequest } = useAxios();
  const [showGetDataButton, setShowGetDataButton] = useState(false);
  const [surveyNumberValue, setSurveyNumberValue] = useState();
  const [hissaNumber, setHissaNumber] = useState(false);
  const [hissaNumberValue, setHissaNumberValue] = useState([]);
  const [codeVillage, setCodeVillage] = useState('');
  const [textForVillage, setTextForVillage] = useState(false);
  const [flagButton2, setFlagButton2] = useState(true);
  const [showArea, setShowArea] = useState(false);
  const [area, setArea] = useState();
  const [assessment, setAssessment] = useState();
  const [form2] = Form.useForm();
  let history = useHistory();
  const [partState, setPartState] = useState();
  const { districtName, servarthId, districtCode, talukaCode } = useModel('details');
  const [periodToDate, setPeriodToDate] = useState();
  const [periodFromDate, setPeriodFromDate] = useState();
  const [datevalidFlag, setDatevalidFlag] = useState(true);

  useEffect(() => {
    if (
      new Date(periodFromDate) > new Date(periodToDate) ||
      new Date(periodToDate) < new Date(periodFromDate)
    ) {
      message.info('Period To-Date Must be greater than From-Date');
      setDatevalidFlag(false);
    } else {
      setDatevalidFlag(true);
    }
  }, [periodFromDate, periodToDate]);

  const getArea = async () => {
    sendRequest(
      `${
        URLS.BaseURL
      }/form2/getFormsAssesment?districtCode=${districtCode}&talukaCode=${talukaCode}&cCode=${codeVillage}&pin=${surveyNumberValue}&hissaNo=${
        hissaNumberValue == null ? '' : hissaNumberValue
      }`,
      'GET',
      null,
      (res) => {
        // console.log('full response', res);
        // console.log('full response data>form1BData', res.data.form2Data[0].totalAreaH);
        //console.log('total areaH', res.data.form2Data.totalAreaH);
        let areaH = res.data.form2Data[0].naAreaH;
        let assessment = res.data.form2Data[0].naAssessment;
        setArea(areaH);
        setAssessment(assessment);
        setShowArea(true);
        // console.log('area in state==>', area);
      },
    );
  };
  const handleESelectorChange = (flagGetDataButton, sn, hn, cCodeV) => {
    // console.log(flagGetDataButton, sn, hn);
    setShowGetDataButton(flagGetDataButton);
    setSurveyNumberValue(sn);
    setHissaNumberValue(hn);
    setCodeVillage(cCodeV);
    setHissaNumber(true);
  };

  const addForm2 = async (values) => {
    // console.log('errors', form2.getFieldsError());
    // console.log('Values', form2.getFieldsValue());
  };
  const onFinishFailed = ({ values, errorFields, outOfDate }) => {
    // console.log('Finish Failed called', values, errorFields, outOfDate);
  };

  const resetForm = () => {
    form2.resetFields();
  };

  const success = () => {
    message.success('Data Saved !!!');
  };

  const handleChangeForAuthority = (e) => {
    setAuthorityValue(e);
  };
  const onFormFinish = async (values) => {
    // console.log('periodFromDate--->', periodFromDate);
    const article = {
      cCode: codeVillage,
      districtCode: districtCode,
      talukaCode: talukaCode,
      pin: surveyNumberValue,
      hissaNo: hissaNumberValue,
      part: form2.getFieldValue('part'),
      purposeOfUse: form2.getFieldValue('purposeOfUse'),
      natureAndTermsOfNaGrant: form2.getFieldValue('natureAndTermsOfNaGrant'),
      occupanyPrice: form2.getFieldValue('occupanyPrice'),
      periodFrom: form2.getFieldValue('periodFrom')
        ? moment(form2.getFieldValue('periodFrom'), 'DD/MM/YYYY').format('YYYY-MM-DD')
        : null,

      periodTo: form2.getFieldValue('periodTo')
        ? moment(form2.getFieldValue('periodTo'), 'DD/MM/YYYY').format('YYYY-MM-DD')
        : null,
      entryNumberInTalukaForm2: form2.getFieldValue('entryNumberInTalukaForm2'),
      //authority: form2.getFieldValue('authority'),
      authority: authorityValue,
      nameOfFirstOccupant: form2.getFieldValue('nameOfFirstOccupant'),
      remarks: form2.getFieldValue('remarks'),
    };

    // console.log('values being sent to api', article);
    sendRequest(`${URLS.BaseURL}/form2/saveForm2`, 'POST', article, (res) => {
      if (res.status === 201) {
        success();
        form2.resetFields();
        history.push({
          pathname: `/form/village-form-2/table-form`,
        });
      }
    });
  };
  const handleChangeForPart = (e) => {
    setPartState(e);
  };
  return (
    <div>
      <>
        <Card>
          <Row>
            <Col xl={22} lg={22} md={22} sm={20} xs={20}>
              <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
                <FormattedMessage id="form2.table.viilageForm2" />
              </h2>
              <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
                <FormattedMessage id="form2.table.label" />
              </h2>
            </Col>
          </Row>
          <ESelector
            pageType={'SurveyVillageForm'}
            setFlagButton2={setFlagButton2}
            allData={handleESelectorChange}
            setShowArea={setShowArea}
            allDataV={handleESelectorChange}
          />
          {showGetDataButton && (
            <>
              <Row style={{ paddingTop: 25 }}>
                <Col span={4}>
                  <Button
                    type="primary"
                    onClick={() => {
                      getArea();
                    }}
                  >
                    <FormattedMessage id="villageForm1E.table.showArea" />
                  </Button>
                </Col>
              </Row>
            </>
          )}
        </Card>
        <Card>
          <Divider orientation="left" style={{ marginBottom: 30 }}>
            <FormattedMessage id="formLanguage.form.eFerfar" />
          </Divider>
          <Row>
            <Col xl={11} lg={11} md={24} sm={24} xs={24}>
              <Input
                addonBefore={<FormattedMessage id="formLanguage.form.Area" />}
                disabled
                value={area}
              ></Input>
            </Col>
            <Col xl={2} lg={2}></Col>

            <Col xl={11} lg={11} md={24} sm={24} xs={24}>
              <Input
                addonBefore={<FormattedMessage id="demandGeneration.table.assessment" />}
                disabled
                value={assessment}
              ></Input>
            </Col>
          </Row>
        </Card>
        <Card>
          <Divider orientation="left" style={{ marginBottom: 30 }}>
            <FormattedMessage id="formLanguage.form.echawdi" />
          </Divider>
          <Form
            layout="vertical"
            form={form2}
            //  onFinish={onFormFinish}
            onFinishFailed={onFinishFailed}
          >
            <Row>
              <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                <Form.Item
                  name="part"
                  rules={[{ required: true, message: 'This Field Is Required..' }]}
                  label={<FormattedMessage id="form2.table.part" />}
                >
                  <Select
                    onChange={(e) => {
                      handleChangeForPart(e);
                    }}
                    placeholder={<FormattedMessage id="form2.table.part" />}
                  >
                    <Select.Option value="form2.table.partA">
                      <FormattedMessage id="form2.table.partA" />
                    </Select.Option>
                    <Select.Option value="form2.table.partB">
                      <FormattedMessage id="form2.table.partB" />
                    </Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xl={2} lg={2} md={2}></Col>
              <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                <Form.Item
                  name="purposeOfUse"
                  rules={[{ required: true, message: 'This Field Is Required..' }]}
                  label={<FormattedMessage id="form2.table.natureTerms" />}
                >
                  {/* {partState && partState === 'form2.table.partA' && ( */}

                  <Select /* placeholder={<FormattedMessage id="form2.table.typeOfUse" />} */>
                    <Select.Option value="form2.table.partA.1">
                      <FormattedMessage id="form2.table.partA.1" />
                    </Select.Option>
                    <Select.Option value="form2.table.partA.2">
                      <FormattedMessage id="form2.table.partA.2" />
                    </Select.Option>
                    <Select.Option value="form2.table.partA.3">
                      <FormattedMessage id="form2.table.partA.3" />
                    </Select.Option>
                    <Select.Option value="form2.table.partA.4">
                      <FormattedMessage id="form2.table.partA.4" />
                    </Select.Option>
                    <Select.Option value="form2.table.partA.5">
                      <FormattedMessage id="form2.table.partA.5" />
                    </Select.Option>
                  </Select>

                  {/* )} */}
                  {/* {partState && partState === 'form2.table.partB' && (
                      <>
                        <Select placeholder={<FormattedMessage id="form2.table.purposeOfUse" />}>
                          <Select.Option value="form2.table.partB.1">
                            <FormattedMessage id="form2.table.partB.1" />
                          </Select.Option>
                          <Select.Option value="form2.table.partB.2">
                            <FormattedMessage id="form2.table.partB.2" />
                          </Select.Option>
                          <Select.Option value="form2.table.partB.3">
                            <FormattedMessage id="form2.table.partB.3" />
                          </Select.Option>
                          <Select.Option value="form2.table.partB.4">
                            <FormattedMessage id="form2.table.partB.4" />
                          </Select.Option>
                          <Select.Option value="form2.table.partB.5">
                            <FormattedMessage id="form2.table.partB.5" />
                          </Select.Option>
                        </Select.Option>
                      </>
                    )} */}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              {/* <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                <Form.Item
                  name="natureAndTermsOfNaGrant"
                  rules={[
                    { required: true, message: 'This Field Is Required..' },
                    {
                      max: 50,
                      message: 'Nature and Terms should be upto 50 characters',
                    },
                  ]}
                  label={<FormattedMessage id="form2.table.natureTerms" />}
                >
                  <Input.TextArea
                    maxLength={51}
                    onKeyPress={KeyPressEvents.isInputVarchar}
                  ></Input.TextArea>
                </Form.Item>
              </Col> */}
              <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                <Form.Item
                  name="occupanyPrice"
                  rules={[
                    {
                      max: 18,
                      message: 'Occupancy Price should be upto 18 Numbers',
                    },
                  ]}
                  label={<FormattedMessage id="form2.table.ocupancy" />}
                >
                  <Input
                    maxLength={19}
                    onKeyPress={KeyPressEvents.isInputDecimal}
                    addonAfter={'₹'}
                  />
                </Form.Item>
              </Col>
              <Col xl={2} lg={2} md={2}></Col>
              <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                <Form.Item
                  name={'nameOfFirstOccupant'}
                  rules={[
                    // { required: true, message: 'This Field Is Required..' },
                    {
                      max: 50,
                      message: 'Name Of First Occupant should be upto 50 characters',
                    },
                  ]}
                  label={<FormattedMessage id="form2.table.nameOfOccupant" />}
                >
                  <Input maxLength={51} onKeyPress={KeyPressEvents.isInputChar} />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col xl={5} lg={5} md={5} sm={24} xs={24}>
                <Form.Item
                  name={'periodFrom'}
                  label={<FormattedMessage id="form2.table.fromDate" />}
                >
                  <DatePicker
                    onChange={(e) => {
                      // console.log('test onchange called');
                      setPeriodFromDate(e);
                    }}
                  />
                </Form.Item>
              </Col>
              <Col xl={1} lg={1} md={1}></Col>
              <Col xl={6} lg={6} md={6} sm={24} xs={24}>
                <Form.Item name="periodTo" label={<FormattedMessage id="form2.table.toDate" />}>
                  <DatePicker
                    onChange={(e) => {
                      setPeriodToDate(e);
                    }}
                  />
                </Form.Item>
              </Col>
              <Col xl={1} lg={1} md={1} sm={1}></Col>
              <Col xl={11} lg={11} md={11} sm={11} xs={24}>
                <Form.Item
                  name="entryNumberInTalukaForm2"
                  rules={[
                    { required: true, message: 'This Field Is Required..' },
                    {
                      max: 18,
                      message: 'Entry Number in Taluka Form 2 should be upto 18 Numbers',
                    },
                  ]}
                  label={<FormattedMessage id="form2.table.entryNumber" />}
                >
                  <Input maxLength={19} onKeyPress={KeyPressEvents.isInputNumber} />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col xl={11} lg={11} md={11} sm={11} xs={24}>
                <Form.Item
                  name="authority"
                  rules={[{ required: true, message: 'This Field Is Required..' }]}
                  label={<FormattedMessage id="form2.table.authority" />}
                >
                  <Select
                    onSelect={(e) => {
                      handleChangeForAuthority(e);
                    }}
                    placeholder={<FormattedMessage id="form2.table.authority" />}
                  >
                    <Select.Option value={'villageForm1.table.collector'}>
                      <FormattedMessage id="villageForm1.table.collector" />
                    </Select.Option>
                    <Select.Option value={'villageForm1.table.deputyCollector'}>
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
              <Col xl={2} lg={2} md={2} sm={2}></Col>
              <Col xl={11} lg={11} md={11} sm={11} xs={24}>
                <Form.Item
                  name="remarks"
                  rules={[
                    //  { required: true, message: 'This Field Is Required..' },
                    {
                      max: 300,
                      message: 'Remarks should be upto 300 characters',
                    },
                  ]}
                  label={<FormattedMessage id="form2.table.remarks" />}
                >
                  <Input.TextArea
                    maxLength={301}
                    onKeyPress={KeyPressEvents.isInputChar}
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
                    if (surveyNumberValue && showArea && datevalidFlag) {
                      onFormFinish();
                    } else if (surveyNumberValue == null) {
                      message.info('Please Select Village and Revenue Year and Survey Number');
                    } else if (showArea == false) {
                      message.info('Please Search for e-Ferfar Data');
                    } else if (
                      new Date(periodFromDate) > new Date(periodToDate) ||
                      new Date(periodToDate) < new Date(periodFromDate)
                    ) {
                      message.error('Period To-Date Must be greater than From-Date');
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
                      pathname: `/form/village-form-2/table-form`,
                    });
                  }}
                  type="danger"
                  htmlType="submit"
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
};

export default VillageForm2;
