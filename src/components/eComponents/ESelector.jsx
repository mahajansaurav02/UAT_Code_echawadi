import React from 'react';
import VillageSelector from './VillageSelector';
import { useEffect, useRef, useState } from 'react';
import { Button, Card, Col, Form, Input, message, Row, Select } from 'antd';
import { FormattedMessage, useModel } from 'umi';
import useAxios from '@/components/eComponents/use-axios';
import URLS from '@/URLs/urls';
import KeyPressEvents from '@/util/KeyPressEvents';

const ESelector = (props) => {
  const { sendRequest } = useAxios();
  const [codeVillage, setCodeVillage] = useState('');
  const [revenueYear, setRevenueYear] = useState();
  const [textForVillage, setTextForVillage] = useState();
  const [village, setVillage] = useState([]);
  const [isNirank, setIsNirank] = useState(false);

  const [pageType, setPageType] = useState('V');
  //!For Get Hissa From Survey ('S')
  const [surveyNumberValue, setSurveyNumberValue] = useState();
  const [flagButton2, setFlagButton2] = useState(true);
  const [hissaNumberValue, setHissaNumberValue] = useState([]);
  const [showGetDataButton, setShowGetDataButton] = useState(false);
  const [hissaNumber, setHissaNumber] = useState([]);
  const [showArea, setShowArea] = useState(false);
  const [showHissaNumberInput, setShowHissaNumberInput] = useState(false);
  const [flagButton, setFlagButton] = useState(true);
  const [area, setArea] = useState();
  const [selectorForm] = Form.useForm();
  const [khataNumber, setKhataNumber] = useState();
  const [textInput, setTextInput] = useState('');
  const { districtCode, talukaCode } = useModel('details');

  const handleChangeForSurveyNoV = (event) => {
    // props.setShowArea(false);
    props.allDataV(textForVillage, revenueYear, true);
    selectorForm.resetFields();
    setFlagButton(false);
    setFlagButton2(false);
    setSurveyNumberValue(event.target.value);
    setRevenueYear(revenueYear);
    console.log('year in selector', revenueYear);
  };
  const handleChangeForSurveyNoT = (event) => {
    props.allDataT(event.target.value, codeVillage, textForVillage, revenueYear);
    setSurveyNumberValue(event.target.value);
    console.log('handleChangeForSurveyNoT', revenueYear, textForVillage);
  };

  function handleChangeForHissaNo(event) {
    setHissaNumberValue(event);
    props.allData(true, surveyNumberValue, event, codeVillage);
  }

  const handleChangeKhata = (event) => {
    setTextInput(event.target.value);
    props.allDataK(event.target.value, codeVillage, false, textForVillage, revenueYear);
  };

  const getHissaFromSurvey = async () => {
    sendRequest(
      `${URLS.BaseURL}/restservice/getHissaByVillageAndSurveyNo?districtCode=${districtCode}&talukaCode=${talukaCode}&cCode=${codeVillage}&pin=${surveyNumberValue}&marked=Y`,
      'GET',
      null,
      (response) => {
        console.log('this is the suvery number being sent to api on click', surveyNumberValue);
        // console.log('--test data--' + response.data.map((r) => r.hissaNo));
        const mapper = response.data.map((row) => {
          if (row.hissaNo === '') {
            console.log('Emty hissa Found');
          }
        });
        console.log('mapper', mapper);
        const hissArr = response.data.map((row) => ({
          label: row.hissaNo == '' ? 'निरंक' : row.hissaNo,
          value: row.hissaNo,
        }));
        // test = hissArr.map((e) => e.map((f) => (f ? f : { value: '' })));

        //console.log('mapper', test);
        if (hissArr.length > 1) {
          setShowGetDataButton(false);
          setShowArea(false);
        } else {
          setShowGetDataButton(true);
        }
        setShowHissaNumberInput(true);
        setHissaNumber(hissArr);
      },
    );
  };

  return (
    <>
      {props.pageType == 'V' && (
        <VillageSelector
          pageType="withYear"
          setCodeVillage={setCodeVillage}
          setTextForVillage={setTextForVillage}
          onVillageChange={setVillage}
          yearChange={setRevenueYear}
          setIsNirank={setIsNirank}
        />
      )}

      {props.pageType == 'SurveyVillageForm' && (
        <>
          <VillageSelector
            pageType="withYear"
            setCodeVillage={setCodeVillage}
            setTextForVillage={setTextForVillage}
            onVillageChange={setVillage}
            yearChange={setRevenueYear}
            setIsNirank={setIsNirank}
          />

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
            <Col xl={2} lg={7} md={2} sm={7} xs={24}>
              <Button
                // style={{ marginLeft: 10 }}
                type="primary"
                // disabled={flagButton || flagButton2}
                //onClick={getHissaFromSurvey}
                onClick={() => {
                  if (textForVillage && revenueYear && surveyNumberValue && hissaNumberValue) {
                    getHissaFromSurvey();
                  } else if (textForVillage == null) {
                    message.info('Please Select Village ');
                  } else if (revenueYear == null) {
                    message.info('Please Select revenue Year');
                  } else if (surveyNumberValue == null) {
                    message.info('Please Select Survey Number');
                  } else if (hissaNumberValue == null) {
                    message.info('Please Select Hissa Number');
                  }
                }}
              >
                <FormattedMessage id="formLanguage.button.search" />
              </Button>
            </Col>
            <Col xl={1} md={1} sm={1}></Col>
            <Col xl={7} lg={9} md={7} sm={7} xs={24}>
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
          </Row>
        </>
      )}

      {props.pageType == 'SurveyTableForm' && (
        <>
          <>
            {
              <>
                <VillageSelector
                  pageType="withYear"
                  setCodeVillage={setCodeVillage}
                  setTextForVillage={setTextForVillage}
                  onVillageChange={setVillage}
                  yearChange={setRevenueYear}
                  setIsNirank={setIsNirank}
                />
                <Row style={{ marginTop: 10 }}>
                  <Col>
                    <Form.Item
                      labelCol={{
                        xl: 10,
                      }}
                      wrapperCol={{
                        xl: 14,
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
                        maxLength={8}
                        onChange={handleChangeForSurveyNoT}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </>
            }
          </>
        </>
      )}
      {props.pageType == 'withoutYear' && (
        <>
          <>
            {
              <>
                <VillageSelector
                  pageType="withoutYear"
                  setCodeVillage={setCodeVillage}
                  setTextForVillage={setTextForVillage}
                  onVillageChange={setVillage}
                  yearChange={setRevenueYear}
                  setIsNirank={setIsNirank}
                />

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
                  <Col xl={2} lg={7} md={2} sm={7} xs={24}>
                    <Button
                      // style={{ marginLeft: 10 }}
                      type="primary"
                      // disabled={flagButton || flagButton2}
                      //onClick={getHissaFromSurvey}
                      onClick={() => {
                        console.log(
                          'test for msg in eslector',
                          textForVillage,
                          surveyNumberValue,
                          hissaNumberValue,
                        );
                        if (codeVillage && surveyNumberValue) {
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
                  <Col xl={1} md={1} sm={1}></Col>
                  <Col xl={7} lg={9} md={7} sm={7} xs={24}>
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
                </Row>
              </>
            }
          </>
        </>
      )}
      {props.pageType == 'KhataNumber' && (
        <>
          <VillageSelector
            pageType="withYear"
            setCodeVillage={setCodeVillage}
            setTextForVillage={setTextForVillage}
            onVillageChange={setVillage}
            yearChange={setRevenueYear}
            setIsNirank={setIsNirank}
          />
          <Col xl={7} lg={7} md={7} sm={24} xs={24}>
            <Input
              name="khataNo"
              onChange={handleChangeKhata}
              addonBefore={<FormattedMessage id="customerView.form.khataNo" />}
              rules={[{ required: true, message: 'कृपया खाता क्रमांक प्रविष्ट करा !!' }]}
              style={{ marginTop: 10 }}
            ></Input>
          </Col>
        </>
      )}
    </>
  );
};

export default ESelector;
