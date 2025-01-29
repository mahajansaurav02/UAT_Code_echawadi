import ESelector from '@/components/eComponents/ESelector';
import VillageSelector from '@/components/eComponents/VillageSelector';
import { PageContainer } from '@ant-design/pro-layout';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Empty,
  Form,
  Input,
  message,
  Radio,
  Row,
  Select,
  Space,
} from 'antd';
import React, { useState } from 'react';
import { FormattedMessage, useModel } from 'umi';
import moment from 'moment';
import useAxios from '@/components/eComponents/use-axios';
import URLS from '@/URLs/urls';
import { useHistory, useLocation } from 'react-router';
import KeyPressEvents from '@/util/KeyPressEvents';
import { useForm } from 'antd/lib/form/Form';

function VillageForm14() {
  const { districtName, servarthId, districtCode, talukaCode } = useModel('details');
  const [showAreaState, setShowAreaState] = useState(false);
  const [surveyNumberValue, setSurveyNumberValue] = useState(null);
  const [sourceOfWaterArr, setSourceOfWaterArr] = useState([]);
  const [area, setArea] = useState();
  const [codeVillage, setCodeVillage] = useState('');
  const [textVillage, setTextVillage] = useState('');
  const [revenueYear, setRevenueYear] = useState();
  const [isNirank, setIsNirank] = useState(false);
  const { sendRequest } = useAxios();
  const [isLoading, setIsLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  let history = useHistory();
  const [flagButton2, setFlagButton2] = useState(true);
  const [showArea, setShowArea] = useState(false);
  const [showGetDataButton, setShowGetDataButton] = useState(false);
  const [hissaNumberValue, setHissaNumberValue] = useState();
  const [disabledStateForWater, setDisabledStateForWater] = useState(false);
  const [sourceOfWaterValue, setSourceOfWaterValue] = useState();
  const [textForVillage, setTextForVillage] = useState();
  const [village, setVillage] = useState();
  const [showHissaNumberInput, setShowHissaNumberInput] = useState(false);
  const [hissaNumber, setHissaNumber] = useState([]);
  const [radiovalue, setRadioValue] = useState();
  const [otherValue, setOtherValue] = useState();
  const [stateForPakkeandKacche, setStateForPakkeandKacche] = useState();
  const [stateForPakke, setStateForPakke] = useState();
  const [stateForKacche, setStateForKacche] = useState();
  const [stateForThrown, setStateForThrown] = useState();
  const [form14] = Form.useForm();
  const [formWaterArea] = Form.useForm();
  const [selectorForm] = Form.useForm();
  const [form] = useForm();

  const saveForm14 = async () => {
    setIsLoading(true);

    const body = {
      pin: surveyNumberValue,
      hissaNo: hissaNumberValue,
      eWaterSourceName: sourceOfWaterValue == null ? sourceOfWaterArr : sourceOfWaterValue,
      cCode: codeVillage,
      otherType: otherValue,
      position: form14.getFieldValue('position'),
      // pakkaOrKaccha: form14.getFieldValue('pakkaOrKaccha'),
      pakkaOrKaccha: stateForPakkeandKacche,
      pakka: stateForPakke,
      kaccha: stateForKacche,
      thrown: stateForThrown,
      purposeOfUse: form14.getFieldValue('purposeOfUse'),
      governmentbodyOrPrivate: form14.getFieldValue('governmentbodyOrPrivate'),
      remarks: form14.getFieldValue('remarks'),
      talukaCode: talukaCode,
      districtCode: districtCode,
    };
    // console.log('all values', body);
    sendRequest(
      `${URLS.BaseURL}/form14/saveForm14`,
      'POST',
      body,
      (res) => {
        if (res.status === 201) {
          message.success('Record Saved !');
          history.push({
            pathname: `/form/village-form-14/table-form`,
          });
          setIsLoading(false);
        }
      },
      (err) => {
        setIsLoading(false);
      },
    );
  };
  function handleChangeForHissaNo(event) {
    setHissaNumberValue(event);
    setShowAreaState(true);
  }
  const handleChangeForSurveyNoV = (event) => {
    setShowArea(false);
    setShowGetDataButton(false);
    setDisabledStateForWater(false);
    setOtherValue();
    setShowHissaNumberInput(false);
    setFlagButton2(false);
    setSurveyNumberValue(event.target.value);
    setRevenueYear(revenueYear);
    // console.log('year in selector', revenueYear);
  };

  const handleOnSelect = (value, event) => {
    setDisabledStateForWater(true);
    setOtherValue(value);
  };

  const onChangeRadioButton = (e) => {
    form.resetFields();
    setRadioValue(e.target.value);
    setSurveyNumberValue(null);
  };

  const getHissaFromSurvey = async () => {
    // setSearchLoading(true);
    sendRequest(
      `${URLS.BaseURL}/restservice/getHissaByVillageAndSurveyNo?districtCode=${districtCode}&talukaCode=${talukaCode}&cCode=${codeVillage}&pin=${surveyNumberValue}&marked=Y`,
      'GET',
      null,
      (response) => {
        // console.log('this is the suvery number being sent to api on click', surveyNumberValue);
        // console.log('--test data--' + response.data.map((r) => r.hissaNo));
        const mapper = response.data.map((row) => {
          if (row.hissaNo === '') {
            console.log('Emty hissa Found');
          }
        });
        // console.log('mapper', mapper);
        const hissArr = response.data.map((row) => ({
          label: row.hissaNo == '' ? 'निरंक' : row.hissaNo,
          value: row.hissaNo,
        }));
        // test = hissArr.map((e) => e.map((f) => (f ? f : { value: '' })));

        //console.log('mapper', test);
        if (hissArr.length > 1) {
          setShowGetDataButton(true);
          setShowArea(false);
        } else {
          setShowGetDataButton(true);
        }
        setShowHissaNumberInput(true);
        setHissaNumber(hissArr);
        // setSearchLoading(false);
      },
      // setSearchLoading(false),
    );
  };
  const getArea = async () => {
    setSearchLoading(true);

    sendRequest(
      `${
        URLS.BaseURL
      }/form14/getForm14EferfarDetails?districtCode=${districtCode}&talukaCode=${talukaCode}&cCode=${codeVillage}&pin=${surveyNumberValue}&hissaNo=${
        hissaNumberValue == null ? '' : hissaNumberValue
      }`,
      'GET',
      null,
      (res) => {
        setDisabledStateForWater(false);
        setShowArea(true);
        setSourceOfWaterArr(
          res.data.map((r) => ({
            label: r.sourcesOfWater,
            value: r.sourcesOfWater,
          })),
        );
        setSearchLoading(false);
      },
      (error) => {
        if (error) {
          message.info('Please Enter Source of Water Manually');
          setDisabledStateForWater(true);
        }
        setSearchLoading(false);
      },
    );
  };
  return (
    <>
      <Card>
        <h1 style={{ textAlign: 'center' }}>
          <FormattedMessage id="form14.fields.ruleReportHead" />
        </h1>
        <h1 style={{ textAlign: 'center' }}>पाणीपुरवठ्याचा साधनांची नोंदवही</h1>
        <>
          <VillageSelector
            pageType="withoutYear"
            setCodeVillage={setCodeVillage}
            setTextForVillage={setTextForVillage}
            onVillageChange={setVillage}
            yearChange={setRevenueYear}
            setIsNirank={setIsNirank}
          />
          <Form form={form}>
            <Row>
              <Col xs={16} sm={16} md={16} lg={24} xl={24}>
                <Form.Item
                  style={{ marginTop: 10 }}
                  rules={[{ required: true, message: 'This Field Is Required..' }]}
                  label={<FormattedMessage id="form14.table.header1" />}
                >
                  <Space>
                    <Radio.Group
                      name="radiogroup"
                      value={radiovalue}
                      onChange={onChangeRadioButton}
                    >
                      <Radio value="surveyNumber">
                        <FormattedMessage id="form14.table.surveyNumber" />
                      </Radio>
                      <Radio value="others">
                        <FormattedMessage id="form14.table.others" />
                      </Radio>
                    </Radio.Group>
                  </Space>
                </Form.Item>
              </Col>
              <Col xs={8} sm={8} md={16} lg={24} xl={24}></Col>
            </Row>
            {radiovalue && radiovalue === 'surveyNumber' ? (
              <Row style={{ marginTop: 10 }}>
                <Col xl={7} lg={9} md={9} sm={7} xs={24}>
                  <Form.Item
                    labelCol={{
                      xl: 10,
                    }}
                    wrapperCol={{
                      xl: 14,
                      lg: 12,
                      md: 14,
                    }}
                    label={<FormattedMessage id="formLanguage.table.surveyNo" />}
                    name="survey_number"
                    rules={[
                      { required: true, message: 'Survey Number is necessary!' },
                      { type: 'string', max: 7 },
                    ]}
                  >
                    <Input
                      onKeyPress={KeyPressEvents.isInputNumber}
                      maxLength={7}
                      onChange={handleChangeForSurveyNoV}
                    />
                  </Form.Item>
                </Col>
                <Col xl={1} lg={1} md={1} sm={1}></Col>
                <Col xl={2} lg={2} md={24} sm={24} xs={24}>
                  <Button
                    // style={{ marginLeft: 10 }}
                    type="primary"
                    // disabled={flagButton || flagButton2}
                    //onClick={getHissaFromSurvey}
                    // loading={searchLoading}
                    onClick={() => {
                      if (textForVillage && surveyNumberValue) {
                        getHissaFromSurvey();
                      } else if (!codeVillage) {
                        message.info('Please Select Village ');
                      } else if (surveyNumberValue === undefined) {
                        message.info('Please Enter Survey Number');
                      }
                    }}
                  >
                    <FormattedMessage id="formLanguage.button.search" />
                  </Button>
                </Col>
                <Col xl={6} lg={6} md={6} sm={24} xs={24}>
                  {showHissaNumberInput && (
                    <Form layout="inline" form={selectorForm}>
                      <Form.Item
                        // labelCol={{
                        //   xl: 18,
                        // }}
                        wrapperCol={{
                          lg: 12,
                        }}
                        label={<FormattedMessage id="formLanguage.form.hissaNo" />}
                        name="hissa_no"
                        rules={[{ required: false, message: 'Please select hissa number!' }]}
                      >
                        <Select
                          options={hissaNumber}
                          onChange={(value, event) => handleChangeForHissaNo(value, event)}
                          placeholder="Select Hissa Number"
                          value={hissaNumberValue}
                        ></Select>
                      </Form.Item>
                    </Form>
                  )}
                </Col>
                {showGetDataButton && showAreaState && (
                  <>
                    <Col xl={2} lg={2} md={2} sm={24} xs={24}>
                      <Button
                        type="primary"
                        loading={searchLoading}
                        onClick={(value) => getArea(value)}
                      >
                        <FormattedMessage id="form14.button.getFerFarData" />
                      </Button>
                    </Col>
                    <Col span={6}>
                      {showArea && (
                        <Form form={formWaterArea}>
                          <Form.Item
                            label={<FormattedMessage id="form14.input.sourcesOfWater" />}
                            name={'sourcesOfWater'}
                          >
                            <Select
                              onChange={(e) => {
                                setSourceOfWaterValue(e);
                                // console.log('source of water value in dropdown', e);
                              }}
                              options={sourceOfWaterArr}
                            ></Select>
                          </Form.Item>
                        </Form>
                      )}
                    </Col>
                  </>
                )}
              </Row>
            ) : (
              radiovalue === 'others' && (
                <Row>
                  <Col xl={8} lg={8} md={8} sm={24} xs={24}>
                    <Form.Item
                      label={<FormattedMessage id="form14.table.others" />}
                      name="others"
                      style={{ marginTop: 10 }}
                      rules={[{ required: true, message: 'This Field Is Required..' }]}
                    >
                      <Select
                        placeholder="others"
                        onSelect={(value, event) => handleOnSelect(value, event)}
                      >
                        <Select.Option value="गावठाण">
                          <FormattedMessage id="form14.table.gavthan" />
                        </Select.Option>
                        <Select.Option value="इतर">
                          <FormattedMessage id="form14.table.itar" />
                        </Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={8} sm={8} md={8} lg={24} xl={24}></Col>
                </Row>
              )
            )}
          </Form>
        </>
      </Card>

      <Card>
        <Form form={form14} layout="vertical">
          <Row>
            {disabledStateForWater && (
              <Col xl={7} lg={7} md={24} sm={24} xs={24}>
                <Form.Item
                  name="sourcesOfWater123"
                  rules={[{ required: true, message: 'This Field Is Required..' }]}
                  label={<FormattedMessage id="form14.input.sourcesOfWater" />}
                >
                  <Input
                    onChange={(e) => {
                      setSourceOfWaterValue(e.target.value);
                    }}
                  />
                </Form.Item>
              </Col>
            )}

            <Col xl={1} lg={1} md={1} sm={1}></Col>
            <Col xl={7} lg={7} md={24} sm={24} xs={24}>
              <Form.Item
                name="position"
                // rules={[
                //   { required: true, message: 'Position is Required..' },
                //   {
                //     max: 50,
                //     message: 'Position should be upto 50 characters',
                //   },
                // ]}
                label={<FormattedMessage id="form14.fields.position" />}
              >
                {/* <Input maxLength={51} onKeyPress={KeyPressEvents.isInputVarchar} /> */}
                <Input maxLength={51} />
              </Form.Item>
            </Col>
            <Col xl={1} lg={1} md={1} sm={1}></Col>
            <Col xl={7} lg={7} md={24} sm={24} xs={24}>
              <Form.Item
                name="pakkaOrKaccha"
                rules={[
                  { required: true, message: 'Pakka Or Kaccha is Required..' },
                  // {
                  //   max: 25,
                  //   message: 'Pakka Or Kaccha should be upto 25 characters',
                  // },
                ]}
                label={<FormattedMessage id="form14.fields.pakkaOrKaccha" />}
              >
                <Select
                  showSearch
                  placeholder="Select"
                  value={stateForPakkeandKacche}
                  onChange={(value) => {
                    setStateForPakkeandKacche(value);
                  }}
                >
                  <Select.Option value="पक्के">पक्के</Select.Option>
                  <Select.Option value="कच्चे">कच्चे</Select.Option>
                </Select>
                {/* <Input maxLength={26} onKeyPress={KeyPressEvents.isInputVarchar} /> */}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            {stateForPakkeandKacche === 'पक्के' && (
              <Col xl={7} lg={7} md={24} sm={24} xs={24}>
                <Form.Item
                  name="pakka"
                  rules={[
                    { required: true, message: 'Pakka Or Kaccha is Required..' },
                    // {
                    //   max: 25,
                    //   message: 'Pakka Or Kaccha should be upto 25 characters',
                    // },
                  ]}
                  label={'पक्के'}
                >
                  <Select
                    showSearch
                    placeholder="Select"
                    value={stateForPakke}
                    onChange={(value) => {
                      setStateForPakke(value);
                      setStateForKacche();
                    }}
                  >
                    <Select.Option value="प्रत्यक्षात वापरात असलेले">
                      प्रत्यक्षात वापरात असलेले
                    </Select.Option>
                    <Select.Option value="चालू स्थतीत असलेले परंतु वापरात नसलेले">
                      चालू स्थतीत असलेले परंतु वापरात नसलेले
                    </Select.Option>
                    <Select.Option value="टाकलेले">टाकलेले</Select.Option>
                  </Select>
                  {/* <Input maxLength={26} onKeyPress={KeyPressEvents.isInputVarchar} /> */}
                </Form.Item>
              </Col>
            )}
            {stateForPakkeandKacche === 'कच्चे' && (
              <Col xl={7} lg={7} md={24} sm={24} xs={24}>
                <Form.Item
                  name="kaccha"
                  rules={[
                    { required: true, message: 'Pakka Or Kaccha is Required..' },
                    // {
                    //   max: 25,
                    //   message: 'Pakka Or Kaccha should be upto 25 characters',
                    // },
                  ]}
                  label={'कच्चे'}
                >
                  <Select
                    showSearch
                    placeholder="Select"
                    value={stateForKacche}
                    onChange={(value) => {
                      setStateForKacche(value);
                      setStateForPakke();
                      setStateForThrown();
                    }}
                  >
                    <Select.Option value="प्रत्यक्षात वापरात असलेले">
                      प्रत्यक्षात वापरात असलेले
                    </Select.Option>
                    <Select.Option value="चालू स्थतीत असलेले परंतु वापरात नसलेले">
                      चालू स्थतीत असलेले परंतु वापरात नसलेले
                    </Select.Option>
                    <Select.Option value="टाकलेले">टाकलेले</Select.Option>
                  </Select>
                  {/* <Input maxLength={26} onKeyPress={KeyPressEvents.isInputVarchar} /> */}
                </Form.Item>
              </Col>
            )}

            {stateForPakke === 'टाकलेले' ? (
              <>
                <Col xl={1} lg={1} md={1} sm={1}></Col>
                <Col xl={7} lg={7} md={24} sm={24} xs={24}>
                  <Form.Item
                    name="throwned"
                    rules={[
                      { required: true, message: 'Pakka Or Kaccha is Required..' },
                      // {
                      //   max: 25,
                      //   message: 'Pakka Or Kaccha should be upto 25 characters',
                      // },
                    ]}
                    label={'वापरात नसलेले (स्थंभ ४,७ व ८ मध्ये नोंदवलेल्या खेरीज इतर)'}
                  >
                    <Select
                      showSearch
                      placeholder="Select"
                      value={stateForThrown}
                      onChange={(value) => {
                        setStateForThrown(value);
                      }}
                    >
                      <Select.Option value="नादुरुस्त झाल्यामुळे">
                        नादुरुस्त झाल्यामुळे
                      </Select.Option>
                      <Select.Option value="इतर कारणांमुळे">इतर कारणांमुळे</Select.Option>
                    </Select>
                    {/* <Input maxLength={26} onKeyPress={KeyPressEvents.isInputVarchar} /> */}
                  </Form.Item>
                </Col>
              </>
            ) : (
              ''
            )}

            <Col xl={1} lg={1} md={1} sm={1}></Col>

            <Col xl={7} lg={7} md={24} sm={24} xs={24}>
              <Form.Item
                name="purposeOfUse"
                rules={[
                  { required: true, message: 'Purpose for which Used is Required..' },
                  {
                    max: 25,
                    message: 'Purpose for which Used should be upto 20 characters',
                  },
                ]}
                label={<FormattedMessage id="form14.fields.purposeOfUse" />}
              >
                <Input maxLength={21} onKeyPress={KeyPressEvents.isInputVarchar} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col xl={11} lg={11} md={24} sm={24} xs={24}>
              <Form.Item
                name="governmentbodyOrPrivate"
                rules={[
                  { required: true, message: 'Government Body Or Private is Required..' },
                  {
                    max: 50,
                    message: 'Government Body or Private should be upto 50 characters',
                  },
                ]}
                label={<FormattedMessage id="form14.fields.governmentbodyOrPrivate" />}
              >
                <Input maxLength={51} onKeyPress={KeyPressEvents.isInputVarchar} />
              </Form.Item>
            </Col>
            <Col xl={1} lg={1} md={1} sm={1}></Col>

            <Col xl={11} lg={11} md={24} sm={24} xs={24}>
              <Form.Item
                name="remarks"
                rules={[
                  //  { required: true, message: 'This Field Is Required..' },
                  {
                    max: 200,
                    message: 'Remarks should be upto 50 characters',
                  },
                ]}
                label={<FormattedMessage id="form14.fields.remarks" />}
              >
                <Input.TextArea maxLength={201} onKeyPress={KeyPressEvents.isInputVarchar} />
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
                  // console.log('Test For Message in Form codeVillage', codeVillage, '====');
                  // console.log('Test For Message in Form survey', surveyNumberValue);
                  // console.log('Test For Message in Form hissa', hissaNumberValue);

                  if (codeVillage) {
                    saveForm14();
                  } else if (codeVillage === '') {
                    message.info('Please Select Village');
                  }
                }}
              >
                <FormattedMessage id="formLanguage.button.save" />
              </Button>
            </Col>
            <Col xl={1} lg={2} md={3} sm={4} xs={8}></Col>
            <Col xl={2} lg={2} md={1} sm={1} xs={1}>
              <Button
                type="default"
                onClick={() => {
                  form14.resetFields();
                }}
                style={{ color: 'white', backgroundColor: 'orange' }}
              >
                <FormattedMessage id="formLanguage.button.reset" />
              </Button>
            </Col>

            <Col xl={1} lg={2} md={3} sm={4} xs={8}></Col>
            <Col xl={2} lg={2} md={1} sm={1} xs={1}>
              <Button
                type="danger"
                onClick={() => {
                  history.push({
                    pathname: `/form/village-form-14/table-form`,
                  });
                }}
              >
                <FormattedMessage id="formLanguage.button.cancel" />
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
    </>
  );
}

export default VillageForm14;
