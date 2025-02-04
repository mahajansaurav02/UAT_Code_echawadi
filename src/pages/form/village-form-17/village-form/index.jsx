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
  Space,
  Radio,
  Alert,
} from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { useHistory, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import VillageSelector from '@/components/eComponents/VillageSelector';
import URLS from '@/URLs/urls';
import useAxios from '@/components/eComponents/use-axios';
import { FormattedMessage, useModel } from 'umi';
import moment from 'moment';
import KeyPressEvents from '@/util/KeyPressEvents';

const BasicForm = () => {
  let history = useHistory();
  const [dataById, setDataById] = useState({});
  const [village, setVillage] = useState([]);
  const [textForVillage, setTextForVillage] = useState();
  const [isNirank, setIsNirank] = useState(false);

  const { districtCode, talukaCode, villageData } = useModel('details');
  const { Option } = Select;
  const location = useLocation();
  const [selector, setSelector] = useState(false);
  const [form] = Form.useForm();
  const { sendRequest } = useAxios();
  const [khataNoText, setkhataNoText] = useState();
  const [codeVillage, setCodeVillage] = useState('');
  const [revenueYear, setRevenueYear] = useState();
  const [localCessValue, setLocalCessValue] = useState();
  const [bLocalCessValue, setBLocalCessValue] = useState();
  const [assesmentValue, setAssesmentValue] = useState(null);
  const [otherLocalCessDesc, setOtherLocalCessDesc] = useState();
  const [otherLocalCess, setOtherLocalCess] = useState();
  const [localCess, setLocalCess] = useState();
  const [amountOfLrValue, setAmountOfLrValue] = useState();
  const [amountOfLcValue, setAmountOfLcValue] = useState();
  const [amountOfVpValue, setAmountOfVpValue] = useState();
  const [natureOfCaseValue, setNatureOfCaseValue] = useState();
  const [surveyHissaNumberValue, setSurveyHissaNumberValue] = useState();
  const [totalAreaValue, setTotalAreaValue] = useState(0);
  const [totalAreaInUOM, setTotalAreaInUOM] = useState();
  const [affectedAreaValue, setAffectedAreaValue] = useState();
  const [surveyHissaNoValue, setSurveyHissaNoValue] = useState();
  const [periodFromDateForedit, setPeriodFromDateForedit] = useState();
  const [periodToDateForedit, setPeriodToDateForedit] = useState();
  const [periodFromDateForValid, setPeriodFromDateForValid] = useState();
  const [periodToDateForValid, setPeriodToDateForValid] = useState();
  const [data, setData] = useState();
  const [saveFlag, setSaveFlag] = useState(true);
  const [datevalidFlag, setDatevalidFlag] = useState(true);
  const [flagForSearch, setFlagForSearch] = useState(false);
  const [stateForKSearch, setStateForKSearch] = useState(false);
  const [khataNumbersList, setKhataNumbersList] = useState([]);
  const [radiovalue, setRadioValue] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [lGDCode, setLGDCode] = useState();
  const [lGDCodeFromVillageData, setLGDCodeFromVillageData] = useState();
  const [RevenueYearLGDCode, setRevenueYearLGDCode] = useState();

  useEffect(() => {
    khataNumbers();
  }, [codeVillage, revenueYear]);

  useEffect(() => {

    // if (totalAreaValue < affectedAreaValue) {

    console.log(totalAreaValue,affectedAreaValue,"ssammmmmmmm")

    if (!(totalAreaValue >= affectedAreaValue)) {

      console.log(

        parseFloat(totalAreaValue) +

          '  ' +

          parseFloat(affectedAreaValue) +

          '-----------------Data123',

      );

      if(affectedAreaValue){

        message.info('Affected Area should be Less that or Equal to Total Area');



      }

      setSaveFlag(false);

    } else {

      setSaveFlag(true);

    }

  }, [affectedAreaValue]);

  useEffect(() => {
    if (
      new Date(periodFromDateForValid) > new Date(periodToDateForValid) ||
      new Date(periodToDateForValid) < new Date(periodFromDateForValid)
    ) {
      message.info('Period To-Date Must be greater than From-Date');
      setDatevalidFlag(false);
    } else {
      setDatevalidFlag(true);
    }
  }, [periodFromDateForValid, periodToDateForValid]);

  useEffect(() => {
    if (localCessValue && bLocalCessValue) {
      setAmountOfLrValue(parseInt(localCessValue) + parseInt(bLocalCessValue));
    } else if (
      localCessValue &&
      (typeof bLocalCessValue === 'undefined' || bLocalCessValue == null || bLocalCessValue <= 0)
    ) {
      setAmountOfLrValue(parseInt(localCessValue));
    } else if (
      bLocalCessValue &&
      (typeof localCessValue === 'undefined' || localCessValue == null || localCessValue <= 0)
    ) {
      setAmountOfLrValue(parseInt(bLocalCessValue));
    } else {
      setAmountOfLrValue(null);
    }
    setAmountOfLcValue(parseInt(localCessValue) ? parseInt(localCessValue) * 7 : null);
    setAmountOfVpValue(parseInt(localCessValue) ? parseInt(localCessValue) : null);
    setAssesmentValue(
      parseInt(amountOfLrValue != null ? amountOfLrValue : 0) +
        parseInt(amountOfLcValue != null ? amountOfLcValue : 0) +
        parseInt(amountOfVpValue != null ? amountOfVpValue : 0),
    );
    form.setFieldsValue({
      amountOfJm: amountOfLrValue,
      amountOfZp: amountOfLcValue,
      amountOfGp: amountOfVpValue,
      assessment: assesmentValue,
    });
    // console.log(
    //   'calculations->',
    //   localCessValue,
    //   bLocalCessValue,
    //   amountOfLrValue,
    //   amountOfLcValue,
    //   amountOfVpValue,
    //   'Assessment',
    //   assesmentValue,
    // );
  }, [
    localCessValue,
    bLocalCessValue,
    amountOfLrValue,
    amountOfLcValue,
    amountOfVpValue,
    assesmentValue,
  ]);

  useEffect(() => {
    if (location.state?.pageMode === 'Edit' || location.state?.pageMode === 'View') {
      // console.log('pushedData', location.state);
      getDataById();
    }
  }, []);

  useEffect(() => {
    if (otherLocalCess === 'इतर दंडात्मक वसुली') {
      setSelector(true);
    }
  }, [otherLocalCess]);

  const khataNumbers = async () => {
    // console.log('Callled...');
    if (codeVillage && revenueYear) {
      sendRequest(
        `${URLS.BaseURL}/form17/khataNumbers?cCode=${codeVillage}&revenueYear=${revenueYear}`,
        'GET',
        null,
        (res) => {
          setKhataNumbersList(res.data);
          // console.log('khataNumbers', res.data);
          setStateForKSearch(true);
        },
        (err) => {},
      );
    }
  };

  const getDetailBykhatNo = async () => {
    if (khataNoText && codeVillage) {
      sendRequest(
        `${URLS.BaseURL}/form17/getDetailByKhataNo?districtCode=${districtCode}&talukaCode=${talukaCode}&khataNo=${khataNoText}&cCode=${codeVillage}`,
        'GET',
        null,
        (res) => {
          setFlagForSearch(true),
            form.setFieldsValue({
              personLiable: res.data.form17Data[0].personLiable,
            });
          setSurveyHissaNumberValue(
            res.data.form17Data.map((row) => ({
              label: row.surveyHissaNo,
              value: row.surveyHissaNo,
            })),
          );
          setData(
            res.data.form17Data.map((r) => ({
              key: r.surveyHissaNo,
              value: r,
            })),
          );
        },
      );
    }
  };

  const getTotalAreaAndUom = async (value) => {
    setSurveyHissaNoValue(value);
    setTotalAreaValue(data.find((obj) => obj.key === value).value.totalArea);
    setAffectedAreaValue(data.find((obj) => obj.key === value).value.totalArea);
    setTotalAreaInUOM(data.find((obj) => obj.key === value).value.uomOfTotalArea);
  };

  const getDataById = async () => {
    sendRequest(
      `${URLS.BaseURL}/form17/getForm17DataById?id=${location.state?.id}`,
      'GET',
      null,
      (res) => {
        // console.log('full res', res.data);
        if (res.data.khataType == 'M') {
          setRadioValue('maktaNumber');
        }
        setTotalAreaValue(res.data.totalArea);
        setTotalAreaInUOM(res.data.uomOfTotalArea);
        setAffectedAreaValue(res.data.areaAffected);
        setLocalCessValue(res.data.localCessAmount);
        setBLocalCessValue(res.data.otherLocalCessAmount);
        setLocalCess(res.data.localCess);
        setOtherLocalCess(res.data.otherLocalCess);
        setOtherLocalCessDesc(res.data.otherLocalCessDesc);
        setSurveyHissaNoValue(res.data.surveyHissaNo),
          setNatureOfCaseValue(res.data.natureOfCase),
          // setPeriodFromDateForedit(res.data.periodFromDate),
          //   setPeriodToDateForedit(res.data.periodToDate),
          setPeriodFromDateForedit(location.state.periodFromDate),
          setPeriodToDateForedit(location.state.periodToDate),
          //   console.log('from', location.state.periodFromDate);
          // console.log('to', periodToDateForedit);

          setDataById({
            revenueYear: res.data.revenueYear,
            districtCode: res.data.districtCode,
            talukaCode: res.data.talukaCode,
            cCode: res.data.cCode,
            caseNo: res.data.caseNo,
            khataNo: res.data.khataNo,
            makhtaKhataNo: res.data.makhtaKhataNo,
            personLiable: res.data.personLiable,
            surveyHissaNo: res.data.surveyHissaNo,
            totalArea: res.data.totalArea,
            totalAreaInUOM: res.data.totalAreaInUOM,
            natureOfCase: res.data.natureOfCase,
            areaAffected: res.data.areaAffected,
            periodIfMoreThanYear: res.data.periodIfMoreThanYear,
            localCess: res.data.localCess,
            localCessAmount: res.data.localCessAmount,
            otherLocalCess: res.data.otherLocalCess,
            otherLocalCessAmount: res.data.otherLocalCessAmount,
            amountOfZp: res.data.amountOfZp,
            amountOfJm: res.data.amountOfJm,
            amountOfGp: res.data.amountOfGp,
            assessment: res.data.assessment,
            remarks: res.data.remarks,
            periodFromDate: periodFromDateForedit,
            periodToDate: periodToDateForedit,
          });
        form.setFieldsValue({
          khataNo: res.data.khataNo,
          maktaNo: res.data.makhtaKhataNo,
          personLiable: res.data.personLiable,
          surveyHissaNo: res.data.surveyHissaNo,
          natureOfCase: res.data.natureOfCase,
          periodIfMoreThanYear: res.data.periodIfMoreThanYear,
          // periodFromDate: location.state.periodFromDate,
          // periodToDate:location.state.periodToDate,
          periodFromDate: periodFromDateForedit,
          periodToDate: periodToDateForedit,

          totalArea: res.data.totalArea,
          caseNo: res.data.caseNo,
          areaAffected: res.data.areaAffected,
          localCess: res.data.localCess,
          otherLocalCess: res.data.otherLocalCess,
          otherLocalCessDesc: res.data.otherLocalCessDesc,
          localCessAmount: res.data.localCessAmount,
          otherLocalCessAmount: res.data.otherLocalCessAmount,
          amountOfJm: res.data.amountOfJm,
          amountOfZp: res.data.amountOfZp,
          amountOfGp: res.data.amountOfGp,
          assessment: res.data.assessment,
          remarks: res.data.remarks,
        });
      },
    );
  };

  const onFinish = async (values) => {
    setIsLoading(true);

    const inputParamsForAdd = {
      revenueYear: revenueYear,
      districtCode: districtCode,
      talukaCode: talukaCode,
      cCode: codeVillage,
      khataNo: form.getFieldValue('khataNo'),
      makhtaKhataNo: form.getFieldValue('maktaNo'),
      personLiable: form.getFieldValue('personLiable'),
      surveyHissaNo: surveyHissaNoValue,
      totalArea: totalAreaValue,
      uomOfTotalArea: totalAreaInUOM,
      caseNo: form.getFieldValue('caseNo'),
      areaAffected: affectedAreaValue,
      uomOfAreaAffected: totalAreaInUOM,
      natureOfCase: natureOfCaseValue,
      periodFromDate: form.getFieldValue('periodFromDate')
        ? moment(form.getFieldValue('periodFromDate')).format('YYYY-MM-DD')
        : null,
      periodToDate: form.getFieldValue('periodToDate')
        ? moment(form.getFieldValue('periodToDate')).format('YYYY-MM-DD')
        : null,
      localCessAmount: localCessValue,
      localCess: localCess,
      otherLocalCess: otherLocalCess,
      otherLocalCessAmount: bLocalCessValue,
      otherLocalCessDesc: otherLocalCessDesc,
      amountOfJm: form.getFieldValue('amountOfJm'),
      amountOfZp: form.getFieldValue('amountOfZp'),
      amountOfGp: form.getFieldValue('amountOfGp'),
      assessment: form.getFieldValue('assessment'),
      remarks: form.getFieldValue('remarks'),
    };

    const inputParamsForEdit = {
      id: location.state?.id,
      revenueYear: location.state?.revenueYear,
      districtCode: location.state?.districtCode,
      talukaCode: location.state?.talukaCode,
      cCode: location.state?.cCode,
      khataNo: form.getFieldValue('khataNo'),
      makhtaKhataNo: form.getFieldValue('maktaNo'),
      personLiable: form.getFieldValue('personLiable'),
      totalArea: totalAreaValue,
      uomOfTotalArea: totalAreaInUOM,
      caseNo: form.getFieldValue('caseNo'),
      surveyHissaNo: form.getFieldValue('surveyHissaNo'),
      areaAffected: totalAreaValue,
      uomOfAreaAffected: totalAreaInUOM,
      natureOfCase: natureOfCaseValue,
      periodFromDate: periodFromDateForedit,
      periodToDate: periodToDateForedit,
      localCessAmount: localCessValue,
      localCess: localCess,
      otherLocalCess: otherLocalCess,
      otherLocalCessAmount: bLocalCessValue,
      otherLocalCessDesc: otherLocalCessDesc,
      amountOfJm: form.getFieldValue('amountOfJm'),
      amountOfZp: form.getFieldValue('amountOfZp'),
      amountOfGp: form.getFieldValue('amountOfGp'),
      assessment: form.getFieldValue('assessment'),
      remarks: form.getFieldValue('remarks'),
    };

    if (location.state?.pageMode === 'Edit') {
      sendRequest(
        `${URLS.BaseURL}/form17/editForm17`,
        'POST',
        inputParamsForEdit,
        (res) => {
          // console.log('form17PayLoad', inputParamsForEdit);
          // // setloading(false);
          // console.log('--form 17 post call-' + res.data);
          if (res.status === 200) {
            message.success('Data Saved!!');
            form.resetFields();
            history.push({
              pathname: `/form/village-form-17/table-form`,
            });
            setIsLoading(false);
          }
        },
        (err) => {
          setIsLoading(false);
        },
      );
    } else if (location.state?.pageMode === 'Add' || location.state?.pageMode === undefined) {
      // console.log('form17PayLoad', inputParamsForAdd);
      sendRequest(
        `${URLS.BaseURL}/form17/saveForm17`,
        'POST',
        inputParamsForAdd,
        (res) => {
          // console.log('--form 17 post call-' + res.data);
          if (res.status === 201) {
            message.success('Data Saved!!');
            form.resetFields();
            history.push({
              pathname: `/form/village-form-17/table-form`,
            });
            setIsLoading(false);
          }
        },
        (err) => {
          setIsLoading(false);
        },
      );
    }
  };

  useEffect(() => {
    const result = villageData.filter(
      (thing, index, self) => index === self.findIndex((t) => t.lgdCode === thing.lgdCode),
    );
    var sorting = result?.map((row) => row.lgdCode);

    setLGDCode(sorting.shift());
  }, []);

  useEffect(() => {
    // const result1 = villageData;
    // console.log('--------result1--1', result1);
    const year1 = JSON.parse(localStorage.getItem('revenueYear1'));
    const year = year1[0];
    const y = year['revenueYear'];
    //console.log(year['revenueYear'], '-----year--1');

    const cCodeFromVillageData1 = JSON.parse(localStorage.getItem('villageData1'));
    const zeroItemCCodefromVillageData1 = cCodeFromVillageData1?.map((item) => item.cCode);
    //console.log(zeroItemCCodefromVillageData1[0], '-----zeroItemCCode1--2');

    const b = zeroItemCCodefromVillageData1[0];
    //console.log(b, '-----b--2');

    const VillageData = JSON.parse(localStorage.getItem('villageData'));
    // console.log(VillageData, '-----VillageData-List--3');

    VillageData.map((item) => {
      if (item.cCode == zeroItemCCodefromVillageData1) {
        setLGDCodeFromVillageData(item.lgdCode);
      }
    });

    //console.log(lGDCodeFromVillageData, '--------lGDCodeFromVillageData--4');

    //setLGDCodeFromVillageData(lgdCodeFromVillageData[0]);
    setRevenueYearLGDCode(y);
  }, [lGDCodeFromVillageData, RevenueYearLGDCode]);

  const getMaktaKhataNo = async () => {
    sendRequest(
      // `${URLS.BaseURL}/form17/makhtakhataNumbers?cCode=${codeVillage}&lgdCode=${lGDCode}&revenueYear=${revenueYear}`,
      // 10JAN2024
      `${URLS.BaseURL}/form17/makhtakhataNumbers?cCode=${codeVillage}&lgdCode=${lGDCodeFromVillageData}&revenueYear=${RevenueYearLGDCode}`,
      'GET',
      null,
      (res) => {
        if (res) {
          form.setFieldsValue({
            maktaNo: res.data,
          });
        }
      },
    );
  };

  const handleForValid = (e) => {
    e.preventDefault();
    return false;
  };

  const onChangeRadioButton = (e) => {
    form.resetFields();
    setRadioValue(e.target.value);
  };

  const dateFormat = 'YYYY/MM/DD';

  return (
    <>
      {/* <Divider /> */}

      <Card>
        {/* <Row style={{ marginLeft: '5px' }}> */}
        <h1 style={{ textAlign: 'center' }}>
          <FormattedMessage id="villageForm17.table.villageLabel" />
        </h1>
        <h1 style={{ textAlign: 'center' }}>संकीर्ण महसूल बसविण्यासंबंधीचे प्रतिवृत नोंदवही </h1>
        {(location.state?.pageMode === 'Add' || location.state?.pageMode === undefined) && (
          <VillageSelector
            pageType="withYear"
            setCodeVillage={setCodeVillage}
            setTextForVillage={setTextForVillage}
            onVillageChange={setVillage}
            yearChange={setRevenueYear}
            setIsNirank={setIsNirank}
          />
        )}
        {/* </Row> */}
        {(location.state?.pageMode === 'View' || location.state?.pageMode === 'Edit') && (
          <Row style={{ marginBottom: 10 }}>
            <Col xl={5} lg={5} md={5} sm={24} xs={24}>
              <label htmlFor="" style={{ paddingRight: '5px' }}>
                <FormattedMessage id="villageForm17.table.district" />
              </label>
              <Input
                disabled
                value={location.state?.districtName}
                style={{ width: 150, marginRight: '15px' }}
              />
            </Col>

            <Col xl={1} lg={1} md={1} sm={24} xs={24}></Col>

            <Col xl={5} lg={5} md={5} sm={24} xs={24}>
              <label htmlFor="" style={{ paddingRight: '5px' }}>
                <FormattedMessage id="villageForm17.table.taluka" />
              </label>
              <Input
                disabled
                value={location.state?.talukaName}
                style={{ width: 150, marginRight: '15px' }}
              />
            </Col>

            <Col xl={1} lg={1} md={1} sm={24} xs={24}></Col>

            <Col xl={5} lg={5} md={5} sm={24} xs={24}>
              <label htmlFor="" style={{ paddingRight: '5px' }}>
                <FormattedMessage id="villageForm17.table.village" />
                <Input
                  disabled
                  value={location.state?.villageName}
                  style={{ width: 150, marginRight: '15px' }}
                />
              </label>
            </Col>

            <Col xl={1} lg={1} md={1} sm={24} xs={24}></Col>

            <Col xl={5} lg={5} md={5} sm={24} xs={24}>
              <label htmlFor="" style={{ paddingRight: '5px' }}>
                <FormattedMessage id="villageForm17.table.revenueYear" />
                <Input
                  disabled
                  value={location.state?.revenueYear}
                  style={{ width: 150, marginRight: '15px' }}
                />
              </label>
            </Col>
          </Row>
        )}
      </Card>
      {isNirank && (
        <Card>
          <Alert message="टीप" description="सदर गाव नमुना निरंक आहे." type="info" showIcon />
        </Card>
      )}
      {!isNirank && (
        <Card style={{ marginTop: 15 }}>
          <Form layout="vertical" form={form}>
            <Row>
              <Col xs={16} sm={16} md={16} lg={24} xl={24}>
                <Form.Item
                  style={{ marginTop: 10 }}
                  rules={[{ required: true, message: 'This Field Is Required..' }]}
                  label={<FormattedMessage id="villageForm17.table.header2" />}
                >
                  <Space>
                    <Radio.Group
                      disabled={
                        location.state?.pageMode === 'Edit' || location.state?.pageMode === 'View'
                      }
                      name="radiogroup"
                      value={radiovalue}
                      onChange={onChangeRadioButton}
                    >
                      <Radio value="KhataNumber">
                        <FormattedMessage id="villageForm17.form.khataNo" />
                      </Radio>
                      <Radio value="maktaNumber" onClick={getMaktaKhataNo}>
                        <FormattedMessage id="villageForm17.form.maktaNo" />
                      </Radio>
                    </Radio.Group>
                  </Space>
                </Form.Item>
              </Col>
              <Col xs={8} sm={8} md={16} lg={24} xl={24}></Col>
            </Row>
            {radiovalue && radiovalue === 'maktaNumber' ? (
              <Row style={{ marginTop: '40px' }}>
                <Col xl={7} lg={7} md={7} sm={24} xs={24}>
                  <Form.Item label="Makta Number" name="maktaNo">
                    <Input
                      disabled
                      onChange={(event) => {
                        setFlagForSearch(false);
                        setkhataNoText(event.target.value);
                        setSurveyHissaNumberValue();
                        setTotalAreaValue();
                        setAffectedAreaValue();
                      }}
                    />
                  </Form.Item>
                </Col>

                <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>
              </Row>
            ) : (
              <Row style={{ marginTop: '40px' }}>
                <Col xl={7} lg={7} md={7} sm={24} xs={24}>
                  <Form.Item
                    label={<FormattedMessage id="villageForm17.table.khataNo" />}
                    name="khataNo"
                    rules={[
                      {
                        required: true,
                        message: 'Khata No/Makta No',
                      },
                      {
                        max: 30,
                        message: 'Khata No/Makta No must be upto 30 Numbers',
                      },
                    ]}
                  >
                    <Input
                      onKeyPress={KeyPressEvents.isInputNumber}
                      maxLength={31}
                      disabled={
                        location.state?.pageMode === 'View' || location.state?.pageMode === 'Edit'
                      }
                      onChange={(event) => {
                        setFlagForSearch(false);
                        setkhataNoText(event.target.value);
                        setSurveyHissaNumberValue();
                        setAffectedAreaValue();
                        setTotalAreaValue();
                      }}
                    />
                  </Form.Item>
                </Col>

                <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>

                <Col
                  xl={7}
                  lg={7}
                  md={7}
                  sm={24}
                  xs={24}
                  style={{ marginLeft: '10px', marginTop: '30px' }}
                >
                  {(location.state?.pageMode === 'Add' ||
                    location.state?.pageMode === undefined) && (
                    <Button
                      disabled={flagForSearch}
                      onClick={() => {
                        if (textForVillage && revenueYear && khataNoText) {
                          setAffectedAreaValue();
                          setTotalAreaInUOM();
                          setTotalAreaValue();
                          form.setFieldsValue({
                            personLiable: '',
                            surveyHissaNo: '',
                          });
                          let flag = false;
                          // console.log('List-->', khataNumbersList);
                          for (var index = 0; index < khataNumbersList.length; index++) {
                            // console.log(khataNumbersList[index]);
                            if (khataNoText === khataNumbersList[index]) {
                              flag = true;
                            }
                          }
                          getDetailBykhatNo();

                          // if (flag) {
                          //   message.info('Record Already Exists..');
                          // } else if (!flag) {
                          //   console.log('unique..');
                          // }
                        } else if (textForVillage == null) {
                          message.info('Please Select Village');
                          /*  disableButtonTimer(); */
                        } else if (revenueYear == null) {
                          message.info('Please Select Revenue Year');
                          /*  disableButtonTimer(); */
                        } else if (khataNoText == null) {
                          message.info('Please Select Khata Number');
                        }
                      }}
                      type="primary"
                    >
                      <FormattedMessage id="oneTimeEntry.table.search" />
                    </Button>
                  )}
                </Col>
              </Row>
            )}

            <Row style={{ marginTop: 10 }}>
              <Col xl={7} lg={7} md={7} sm={24} xs={24}>
                {radiovalue && radiovalue === 'maktaNumber' ? (
                  <Form.Item
                    label={<FormattedMessage id="villageForm17.table.personLiable" />}
                    name="personLiable"
                    rules={[
                      // {
                      //   required: true,
                      //   message: 'Please Enter Person Liable',
                      // },
                      {
                        type: 'string',
                        // max: 500,
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                ) : (
                  <Form.Item
                    label={<FormattedMessage id="villageForm17.table.personLiable" />}
                    name="personLiable"
                    rules={[
                      // {
                      //   required: true,
                      //   message: 'Please Enter Person Liable',
                      // },
                      {
                        type: 'string',
                        // max: 500,
                      },
                    ]}
                  >
                    <Input disabled="true" />
                  </Form.Item>
                )}
              </Col>

              <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>
              {radiovalue && radiovalue === 'maktaNumber' ? (
                <Col xl={7} lg={7} md={7} sm={24} xs={24}>
                  {(location.state?.pageMode === 'Add' ||
                    location.state?.pageMode === undefined) && (
                    <Form.Item
                      label={<FormattedMessage id="villageForm17.table.surveyNo" />}
                      name="surveyHissaNo"
                      rules={[
                        // {
                        //   required: true,
                        //   message: 'SurveyNo',
                        // },
                        {
                          max: 18,
                        },
                      ]}
                    >
                      <Select
                        // disabled={
                        //   location.state?.pageMode === 'View' || location.state?.pageMode === 'Edit'
                        // }
                        disabled
                        options={surveyHissaNumberValue}
                        value={surveyHissaNoValue}
                        onSelect={(value) => {
                          getTotalAreaAndUom(value);
                        }}
                        placeholder="Select Survey Number"
                      />
                    </Form.Item>
                  )}
                  {(location.state?.pageMode === 'Edit' || location.state?.pageMode === 'View') && (
                    <Form.Item
                      label={<FormattedMessage id="villageForm17.table.surveyNo" />}
                      name="surveyHissaNo"
                    >
                      <Input disabled />
                    </Form.Item>
                  )}
                </Col>
              ) : (
                <Col xl={7} lg={7} md={7} sm={24} xs={24}>
                  {(location.state?.pageMode === 'Add' ||
                    location.state?.pageMode === undefined) && (
                    <Form.Item
                      label={<FormattedMessage id="villageForm17.table.surveyNo" />}
                      name="surveyHissaNo"
                      rules={[
                        // {
                        //   required: true,
                        //   message: 'SurveyNo',
                        // },
                        {
                          max: 18,
                        },
                      ]}
                    >
                      <Select
                        disabled={
                          location.state?.pageMode === 'View' || location.state?.pageMode === 'Edit'
                        }
                        options={surveyHissaNumberValue}
                        value={surveyHissaNoValue}
                        onSelect={(value) => {
                          getTotalAreaAndUom(value);
                        }}
                        placeholder="Select Survey Number"
                      />
                    </Form.Item>
                  )}
                  {(location.state?.pageMode === 'Edit' || location.state?.pageMode === 'View') && (
                    <Form.Item
                      label={<FormattedMessage id="villageForm17.table.surveyNo" />}
                      name="surveyHissaNo"
                    >
                      <Input disabled />
                    </Form.Item>
                  )}
                </Col>
              )}

              <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>

              <Col xl={7} lg={7} md={7} sm={24} xs={24}>
              {radiovalue && radiovalue === 'maktaNumber' ? (
                <Form.Item
                  label={<FormattedMessage id="formLanguage.table.totalArea" />}
                  name="totalArea"
                  // rules={[
                  //   {
                  //     required: true,
                  //     // message: 'Please Enter total area1111',
                  //     message: 'Total Area should be greater that or Equal to Affected Area',
                  //     //'Please Enter total area1111'
                  //   },
                  // ]}
                >
                  <Input.Group compact>
                    {/* <Input disabled style={{ width: '60%' }} value={totalAreaValue} /> */}
                    <Input 
                      style={{ width: '60%' }}
                      value={totalAreaValue}
                      onChange={(e) => {
                        setTotalAreaValue(e.target.value);
                        
                      }}
                    />
                    <Input disabled style={{ width: '40%' }} value={totalAreaInUOM} />
                  </Input.Group>
                </Form.Item>
              ):(



<Form.Item
                  label={<FormattedMessage id="formLanguage.table.totalArea" />}
                  name="totalArea"
                  // rules={[
                  //   {
                  //     required: true,
                  //     // message: 'Please Enter total area1111',
                  //     message: 'Total Area should be greater that or Equal to Affected Area',
                  //     //'Please Enter total area1111'
                  //   },
                  // ]}
                >
                  <Input.Group compact>
                    {/* <Input disabled style={{ width: '60%' }} value={totalAreaValue} /> */}
                    <Input  disabled
                      style={{ width: '60%' }}
                      value={totalAreaValue}
                      onChange={(e) => {
                        setTotalAreaValue(e.target.value);
                        
                      }}
                    />
                    <Input disabled style={{ width: '40%' }} value={totalAreaInUOM} />
                  </Input.Group>
                </Form.Item>


              )}
              </Col>
            </Row>

            <Row style={{ marginTop: 10 }}>
              <Col xl={7} lg={7} md={7} sm={24} xs={24}>
                <Form.Item
                  label={<FormattedMessage id="villageForm17.table.noOfCase" />}
                  name="caseNo"
                  rules={[
                    {
                      required: true,
                      message: 'Please Enter No.of Case',
                    },
                    {
                      max: 18,
                      message: 'Please Enter Case Number upto 18 numbers',
                    },
                  ]}
                >
                  <Input
                    onKeyPress={KeyPressEvents.isInputNumber}
                    maxLength={19}
                    disabled={location.state?.pageMode === 'View'}
                  />
                </Form.Item>
              </Col>

              <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>

              <Col xl={7} lg={7} md={7} sm={24} xs={24}>
                <Form.Item
                  style={{ marginLeft: 5 }}
                  label={<FormattedMessage id="villageForm17.table.areaAffected" />}
                  name="areaAffected"
                  rules={[
                    {
                      required: true,

                      message: 'Total Area should be greater than or Equal to Affected Area',
                    },
                  ]}
                >
                  <Input.Group compact>
                    <Input
                      disabled={location.state?.pageMode === 'View'}
                      style={{ width: '60%' }}
                      value={affectedAreaValue}
                      onChange={(event) => {
                        setAffectedAreaValue(event.target.value);
                      }}
                    />
                    <Input disabled style={{ width: '40%' }} value={totalAreaInUOM} />
                  </Input.Group>
                </Form.Item>
              </Col>

              <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>

              <Col xl={7} lg={7} md={7} sm={24} xs={24}>
                <Form.Item
                  label={<FormattedMessage id="villageForm17.table.natureOfCase" />}
                  name="natureOfCase"
                  rules={[
                    // {
                    //   required: true,
                    //   message: 'Please Select Nature of Case',
                    // },
                    {
                      type: 'string',
                    },
                  ]}
                >
                  <Select
                    disabled={location.state?.pageMode === 'View'}
                    showSearch
                    placeholder="Select"
                    value={natureOfCaseValue}
                    onChange={(value) => {
                      setNatureOfCaseValue(value);
                    }}
                  >
                    <Select.Option value="आकारी पडीत जमीन महसुल वसुली (पाच वर्षांपेक्षा कमी कालावधीकरिता)">
                      आकारी पडीत जमीन महसुल वसुली (पाच वर्षांपेक्षा कमी कालावधीकरिता)
                    </Select.Option>
                    <Select.Option value="कलिंगडांच्या बागा">कलिंगडांच्या बागा</Select.Option>
                    <Select.Option value="बेट">बेट </Select.Option>
                    <Select.Option value="मळई जमीन किंमत">मळई जमीन किंमत </Select.Option>
                    <Select.Option value="कुमरी किंवा डोंगराळ पट्टे प्रदान">
                      कुमरी किंवा डोंगराळ पट्टे प्रदान
                    </Select.Option>
                    <Select.Option value="गायरान जमीन प्रदान फी ">
                      गायरान जमीन प्रदान फी{' '}
                    </Select.Option>
                    <Select.Option value="एक साला लावणी फी">एक साला लावणी फी </Select.Option>
                    <Select.Option value="कुरणे">कुरणे </Select.Option>
                    <Select.Option value="लिलावात विकलेले गवत किंवा चराई">
                      लिलावात विकलेले गवत किंवा चराई
                    </Select.Option>
                    <Select.Option value="झाडांपासून मिळणारे उत्पन्न विक्री">
                      झाडांपासून मिळणारे उत्पन्न विक्री
                    </Select.Option>
                    <Select.Option value="संकीर्ण उत्पादने">संकीर्ण उत्पादने </Select.Option>
                    <Select.Option value="अनधिकृत लागवड (दंडाशिवाय)">
                      अनधिकृत लागवड (दंडाशिवाय){' '}
                    </Select.Option>
                    <Select.Option value="प्रासंगिक पाणीपट्टी">प्रासंगिक पाणीपट्टी </Select.Option>
                    <Select.Option value="अनधिकृत जलसिंचन दंड (पाणीपट्‍टी)">
                      अनधिकृत जलसिंचन दंड (पाणीपट्‍टी)
                    </Select.Option>
                    <Select.Option value="अकृषिक भाडे"> अकृषिक भाडे </Select.Option>
                    <Select.Option value="खंडित कालावधीचा (५ वर्षांहून कमी) जमीन महसूल">
                      खंडित कालावधीचा (५ वर्षांहून कमी) जमीन महसूल
                    </Select.Option>
                    <Select.Option value="सरकारी पड जमिनीवरील विटभट्‍टी फी">
                      सरकारी पड जमिनीवरील विटभट्‍टी फी
                    </Select.Option>
                    <Select.Option value="सरकारी पड जमिनीवरील चुनाभट्‍टी फी">
                      सरकारी पड जमिनीवरील चुनाभट्‍टी फी
                    </Select.Option>
                    <Select.Option value="अकृषिक प्रयोजनार्थ अस्‍थाई रूपांतरण आकारणी">
                      अकृषिक प्रयोजनार्थ अस्‍थाई रूपांतरण आकारणी
                    </Select.Option>
                    <Select.Option value="अनधिकृत भोगवट्याकरिता आकारणी">
                      अनधिकृत भोगवट्याकरिता आकारणी
                    </Select.Option>
                    <Select.Option value="परवानगीने केलेल्या अकृषिक वापरासाठी दंड">
                      परवानगीने केलेल्या अकृषिक वापरासाठी दंड
                    </Select.Option>
                    <Select.Option value="तालुका कार्यालयात गोळा केलेला पट्ट्याखालील खंड व स्वामित्वधन">
                      तालुका कार्यालयात गोळा केलेला पट्ट्याखालील खंड व स्वामित्वधन
                    </Select.Option>
                    <Select.Option value="वसूल केलेला निर्लेखित जमीन महसूल">
                      वसूल केलेला निर्लेखित जमीन महसूल
                    </Select.Option>
                    <Select.Option value="जमीन महसूल न भरल्यामुळे २५ टक्के शास्ती">
                      जमीन महसूल न भरल्यामुळे २५ टक्के शास्ती
                    </Select.Option>
                    <Select.Option value="नोटीस फी">नोटीस फी</Select.Option>
                    <Select.Option value="अधिकार अभिलेख कायद्यान्‍वये दंड">
                      अधिकार अभिलेख कायद्यान्‍वये दंड
                    </Select.Option>
                    <Select.Option value="म.ज.म.अ. कलम २१४ अन्वये विक्री खर्चाची वसुली">
                      म.ज.म.अ. कलम २१४ अन्वये विक्री खर्चाची वसुली
                    </Select.Option>
                    <Select.Option value="अनधिकृत कृषिक दंड">अनधिकृत कृषिक दंड </Select.Option>
                    <Select.Option value="अनधिकृत अकृषिक दंड">अनधिकृत अकृषिक दंड </Select.Option>
                    <Select.Option value="इनाम जमिनीवरील नजराणा">
                      इनाम जमिनीवरील नजराणा{' '}
                    </Select.Option>
                    <Select.Option value="इनामे व वतन जमिनीवरील गैरहजेरी आकार इत्‍यादी">
                      इनामे व वतन जमिनीवरील गैरहजेरी आकार इत्‍यादी
                    </Select.Option>
                    <Select.Option value="भोगवटा अधिकाराच्या विक्रीपासून मिळणारे उत्पन्न">
                      भोगवटा अधिकाराच्या विक्रीपासून मिळणारे उत्पन्न
                    </Select.Option>
                    <Select.Option value="लागवडयोग्य जमिनीपासून मिळणारे विक्री उत्पन्न">
                      लागवडयोग्य जमिनीपासून मिळणारे विक्री उत्पन्न
                    </Select.Option>
                    <Select.Option value="धारणाधिकार वर्ग दोन चे वर्ग एक मध्ये केलेल्या अधिकृत रूपांतरांवरील अधिमूल्य">
                      धारणाधिकार वर्ग दोन चे वर्ग एक मध्ये केलेल्या अधिकृत रूपांतरांवरील अधिमूल्य
                    </Select.Option>
                    <Select.Option value="पैज कर">पैज कर </Select.Option>
                    <Select.Option value="नुकसान भरपाई">नुकसान भरपाई </Select.Option>
                    <Select.Option value="दंड">दंड </Select.Option>
                    <Select.Option value="गौण खनीज शुल्‍क">गौण खनीज शुल्‍क </Select.Option>
                    <Select.Option value="स्‍वामित्‍वधन"> स्‍वामित्‍वधन </Select.Option>
                    <Select.Option value="पोट हिस्सा फी">पोट हिस्सा फी </Select.Option>
                    <Select.Option value="सिंचन कर">सिंचन कर </Select.Option>
                    <Select.Option value="आयकर">आयकर </Select.Option>
                    <Select.Option value="विक्री कर">विक्री कर </Select.Option>
                    <Select.Option value="आर.टी.ओ. कर">आर.टी.ओ. कर </Select.Option>
                    <Select.Option value="पाटबंधारे विषयक येणे रकमा">
                      पाटबंधारे विषयक येणे रकमा{' '}
                    </Select.Option>
                    <Select.Option value="वारस फेरफार विलंब शुल्‍क">
                      वारस फेरफार विलंब शुल्‍क
                    </Select.Option>

                    <Select.Option value="विटभटटी बिनशेती वसुली">
                      विटभटटी बिनशेती वसुली{' '}
                    </Select.Option>
                    <Select.Option value="वापरात बदल जमीन महसुल वसुली">
                      वापरात बदल जमीन महसुल वसुली{' '}
                    </Select.Option>
                    <Select.Option value="दुरसंचार / मोबाइल टॉवर">
                      दुरसंचार / मोबाइल टॉवर{' '}
                    </Select.Option>
                    <Select.Option value="गाळपेर जमीन आकारणी">गाळपेर जमीन आकारणी </Select.Option>
                    <Select.Option value="अभिलेख नक्कल फी">अभिलेख नक्कल फी </Select.Option>
                    <Select.Option value="गावात अस्वच्‍छता पसरविणे दंड">
                      गावात अस्वच्‍छता पसरविणे दंड
                    </Select.Option>
                    <Select.Option value="गावठाण हददीतील वापरात बदल">
                      गावठाण हददीतील वापरात बदल{' '}
                    </Select.Option>
                    <Select.Option value="सिंचन कर">सिंचन कर </Select.Option>
                    <Select.Option value="तात्पुर्ती  बिनशेती ">तात्पुरती बिनशेती </Select.Option>
                    <Select.Option value="इतर दंडात्मक वसुली">इतर दंडात्मक वसुली </Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row style={{ marginTop: 10 }}>
              <Col xl={7} lg={7} md={7} sm={24} xs={24} style={{ marginTop: '30px' }}>
                <label htmlFor="" style={{ marginLeft: '130px', paddingRight: '5px' }}>
                  <strong>
                    <FormattedMessage id="villageForm17.table.periodOfYear" />
                  </strong>
                </label>
              </Col>

              <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>

              <Col xl={7} lg={7} md={7} sm={24} xs={24}>
                {location.state?.pageMode === 'Add' || location.state?.pageMode === undefined ? (
                  <Form.Item
                    label={<FormattedMessage id="villageForm17.table.fromDate" />}
                    name="periodFromDate"
                    rules={[
                      {
                        required: true,
                        message: 'Please Select Period From Date',
                      },
                      {
                        type: 'date',
                      },
                    ]}
                  >
                    <DatePicker
                      // defaultValue={moment()}
                      // format={dateFormat}
                      onSelect={(event) => {
                        setPeriodFromDateForValid(event);
                      }}
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                ) : (
                  <Form.Item
                    label={<FormattedMessage id="villageForm17.table.fromDate" />}
                    name="periodFromDate"
                    rules={[
                      {
                        required: true,
                        message: 'Please Select Period From Date',
                      },
                      {
                        type: 'date',
                      },
                    ]}
                  >
                    <DatePicker
                      style={{ width: '100%' }}
                      defaultValue={
                        location.state.periodFromDate != null
                          ? moment(location.state.periodFromDate, 'YYYY-MM-DD')
                          : null
                      }
                      //  defaultValue={moment(periodFromDateForedit)}
                      disabled={location.state?.pageMode === 'View'}
                      onChange={(e) => {
                        setPeriodFromDateForedit(moment(e).format('YYYY-MM-DD'));
                        // console.log('date change', e);
                      }}
                    />
                  </Form.Item>
                )}
              </Col>

              <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>

              <Col xl={7} lg={7} md={7} sm={24} xs={24}>
                {location.state?.pageMode === 'Add' || location.state?.pageMode === undefined ? (
                  <Form.Item
                    label={<FormattedMessage id="villageForm17.table.toDate" />}
                    name="periodToDate"
                    rules={[
                      {
                        required: true,
                        message: 'Please Select Period From Date',
                      },
                      {
                        type: 'date',
                      },
                    ]}
                  >
                    <DatePicker
                      // defaultValue={moment()}
                      // format={dateFormat}
                      onSelect={(event) => {
                        setPeriodToDateForValid(event);
                      }}
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                ) : (
                  <Form.Item
                    label={<FormattedMessage id="villageForm17.table.toDate" />}
                    name="periodToDate"
                    rules={[
                      {
                        required: true,
                        message: 'Please Select Period From Date',
                      },
                      {
                        type: 'date',
                      },
                    ]}
                  >
                    <DatePicker
                      style={{ width: '100%' }}
                      defaultValue={
                        location.state.periodToDate != null
                          ? moment(location.state.periodToDate, 'YYYY-MM-DD')
                          : null
                      }
                      // defaultValue={moment(periodToDateForedit)}
                      disabled={location.state?.pageMode === 'View'}
                      onChange={(e) => {
                        setPeriodToDateForedit(moment(e).format('YYYY-MM-DD'));
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

            <Row style={{ marginTop: 10 }}>
              <Col xl={7} lg={7} md={7} sm={24} xs={24}>
              <Form.Item
                  label={<FormattedMessage id="villageForm17.table.localCess" />}
                  name="localCess"
                  rules={[
                    {
                      required: true,
                      message: 'Local Cess is required ',
                    },
                    {
                      validator: (_, value) =>
                        value == ''
                          ? Promise.resolve()
                          : Promise.reject('Please enter A-Liable For Local Cess'),
                    },
                  ]}
                >
                  <Input.Group compact>
                    <Select
                      name="localCessSelect"
                      showSearch
                      style={{ width: '50%' }}
                      placeholder="Select"
                      disabled={location.state?.pageMode === 'View'}
                      value={localCess}
                      onChange={(e) => {
                        setLocalCess(e);
                      }}
                      onSelect={(e) => {
                        setLocalCess(e);
                      }}
                    >
                      <Select.Option value="आकारी पडीत जमीन महसुल वसुली (पाच वर्षांपेक्षा कमी कालावधीकरिता)">
                        आकारी पड जमीन महसूल वसुली (पाच वर्षांपेक्षा कमी कालावधीकरिता)
                      </Select.Option>
                      <Select.Option value="कलिंगडांच्या बागा">कलिंगडांच्या बागा</Select.Option>
                      <Select.Option value="बेट">बेट </Select.Option>
                      <Select.Option value="मळई जमीन किंमत">मळई जमीन किंमत </Select.Option>
                      <Select.Option value="कुमरी किंवा डोंगराळ पट्टे प्रदान">
                        कुमरी किंवा डोंगराळ पट्टे प्रदान
                      </Select.Option>
                      <Select.Option value="गायरान जमीन प्रदान फी ">
                        गायरान जमीन प्रदान फी{' '}
                      </Select.Option>
                      <Select.Option value="एक साला लावणी फी">एक साला लावणी फी </Select.Option>
                      <Select.Option value="कुरणे">कुरणे </Select.Option>
                      <Select.Option value="लिलावात विकलेले गवत किंवा चराई">
                        लिलावात विकलेले गवत किंवा चराई
                      </Select.Option>
                      <Select.Option value="झाडांपासून मिळणारे उत्पन्न विक्री">
                        झाडांपासून मिळणारे उत्पन्न विक्री
                      </Select.Option>
                      <Select.Option value="संकीर्ण उत्पादने">संकीर्ण उत्पादने </Select.Option>
                      <Select.Option value="अनधिकृत लागवड (दंडाशिवाय)">
                        अनधिकृत लागवड (दंडाशिवाय){' '}
                      </Select.Option>
                      <Select.Option value="प्रासंगिक पाणीपट्टी">
                        प्रासंगिक पाणीपट्टी{' '}
                      </Select.Option>
                      <Select.Option value="अनधिकृत जलसिंचन दंड (पाणीपट्‍टी)">
                        अनधिकृत जलसिंचन दंड (पाणीपट्‍टी)
                      </Select.Option>
                      <Select.Option value="अकृषिक भाडे"> अकृषिक भाडे </Select.Option>
                      <Select.Option value="खंडित कालावधीचा (५ वर्षांहून कमी) जमीन महसूल">
                        खंडित कालावधीचा (५ वर्षांहून कमी) जमीन महसूल
                      </Select.Option>
                      <Select.Option value="सरकारी पड जमिनीवरील विटभट्‍टी फी">
                        सरकारी पड जमिनीवरील विटभट्‍टी फी
                      </Select.Option>
                      <Select.Option value="सरकारी पड जमिनीवरील चुनाभट्‍टी फी">
                        सरकारी पड जमिनीवरील चुनाभट्‍टी फी
                      </Select.Option>
                      <Select.Option value="अकृषिक प्रयोजनार्थ अस्‍थाई रूपांतरण आकारणी">
                        अकृषिक प्रयोजनार्थ अस्‍थाई रूपांतरण आकारणी
                      </Select.Option>
                      <Select.Option value="अनधिकृत भोगवट्याकरिता आकारणी">
                        अनधिकृत भोगवट्याकरिता आकारणी
                      </Select.Option>
                      <Select.Option value="परवानगीने केलेल्या अकृषिक वापरासाठी दंड">
                        परवानगीने केलेल्या अकृषिक वापरासाठी फी
                      </Select.Option>
                      <Select.Option value="तालुका कार्यालयात गोळा केलेला पट्ट्याखालील खंड व स्वामित्वधन">
                        तालुका कार्यालयात गोळा केलेला पट्ट्याखालील खंड व स्वामित्वधन
                      </Select.Option>
                      <Select.Option value="वसूल केलेला निर्लेखित जमीन महसूल">
                        वसूल केलेला निर्लेखित जमीन महसूल
                      </Select.Option>
                      <Select.Option value="जमीन महसूल न भरल्यामुळे २५ टक्के शास्ती">
                        जमीन महसूल न भरल्यामुळे २५ टक्के शास्ती
                      </Select.Option>
                    </Select>
                    <Input
                      onKeyPress={KeyPressEvents.isInputNumber}
                      maxLength={10}
                      name="localCessInput"
                      onChange={(event) => {
                        setLocalCessValue(event.target.value);
                        // console.log('localCessValue++', localCessValue);
                      }}
                      style={{ width: '50%' }}
                      addonBefore={<FormattedMessage id="villageForm17.table.amt" />}
                      value={localCessValue}
                      disabled={location.state?.pageMode === 'View'}
                    />
                  </Input.Group>
                </Form.Item>
              </Col>

              <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>

              <Col xl={7} lg={7} md={7} sm={24} xs={24}>
                <Form.Item
                  label={<FormattedMessage id="villageForm17.table.amountOfLC" />}
                  name="amountOfZp"
                  rules={[
                    // {
                    //   required: true,
                    //   message: 'Please Enter Amount Of L.C',
                    // },
                    {
                      type: 'integer',
                      max: 100000000,
                    },
                  ]}
                >
                  <Input maxLength={19} disabled />
                </Form.Item>
              </Col>

              <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>

              <Col xl={7} lg={7} md={7} sm={24} xs={24}>
                <Form.Item
                  label={<FormattedMessage id="villageForm17.table.amountOfVP" />}
                  name="amountOfGp"
                  rules={[
                    // {
                    //   required: true,
                    //   message: 'Please Enter Amount Of V.P',
                    // },
                    {
                      type: 'integer',
                      max: 100000000,
                    },
                  ]}
                >
                  <Input maxLength={19} disabled />
                </Form.Item>
              </Col>
            </Row>
            <Row style={{ marginTop: 10 }}>
              <Col xl={7} lg={7} md={7} sm={24} xs={24}>
                <Form.Item
                  label={<FormattedMessage id="villageForm17.table.otherLocalCess" />}
                  name="otherLocalCess"
                >
                  <Input.Group compact>
                    <Select
                      name="otherLocalCessSelect"
                      disabled={location.state?.pageMode === 'View'}
                      showSearch
                      style={{ width: '50%' }}
                      placeholder="Select"
                      value={otherLocalCess}
                      onChange={(e) => {
                        // console.log('otherLocalCess change', otherLocalCess);
                        setOtherLocalCess(e);
                        if (e === 'इतर दंडात्मक वसुली') {
                          setSelector(true);
                        } else {
                          setSelector(false);
                        }
                      }}
                    >
                      <Select.Option value="नोटीस फी">नोटीस फी</Select.Option>
                      <Select.Option value="अधिकार अभिलेख कायद्यान्‍वये दंड">
                        अधिकार अभिलेख कायद्यान्‍वये दंड
                      </Select.Option>
                      <Select.Option value="म.ज.म.अ. कलम २१४ अन्वये विक्री खर्चाची वसुली">
                        म.ज.म.अ. कलम २१४ अन्वये विक्री खर्चाची वसुली
                      </Select.Option>
                      <Select.Option value="अनधिकृत कृषिक दंड">अनधिकृत कृषिक दंड </Select.Option>
                      <Select.Option value="अनधिकृत अकृषिक दंड">अनधिकृत अकृषिक दंड </Select.Option>
                      <Select.Option value="इनाम जमिनीवरील नजराणा">
                        इनाम जमिनीवरील नजराणा{' '}
                      </Select.Option>
                      <Select.Option value="इनामे व वतन जमिनीवरील गैरहजेरी आकार इत्‍यादी">
                        इनाम व वतन जमिनीवरील गैरहजेरी आकार इत्‍यादी
                      </Select.Option>
                      <Select.Option value="भोगवटा अधिकाराच्या विक्रीपासून मिळणारे उत्पन्न">
                        भोगवटाधिकाराच्या विक्रीपासून मिळणारे उत्पन्न
                      </Select.Option>
                      <Select.Option value="लागवडयोग्य जमिनीपासून मिळणारे विक्री उत्पन्न">
                        लागवडयोग्य जमिनीपासून मिळणारे विक्री उत्पन्न
                      </Select.Option>
                      <Select.Option value="धारणाधिकार वर्ग दोन चे वर्ग एक मध्ये केलेल्या अधिकृत रूपांतरांवरील अधिमूल्य">
                        धारणाधिकार वर्ग दोनचे वर्ग एकमध्ये केलेल्या अधिकृत रूपांतरांवरील अधिमूल्य
                      </Select.Option>
                      <Select.Option value="पैज कर">पैज कर </Select.Option>
                      <Select.Option value="नुकसान भरपाई">नुकसान भरपाई </Select.Option>
                      <Select.Option value="दंड">दंड </Select.Option>
                      <Select.Option value="गौण खनीज शुल्‍क">गौण खनीज शुल्‍क </Select.Option>
                      <Select.Option value="स्‍वामित्‍वधन"> स्‍वामित्‍वधन </Select.Option>
                      <Select.Option value="पोट हिस्सा फी">पोट हिस्सा फी </Select.Option>
                      <Select.Option value="सिंचन कर">सिंचन कर </Select.Option>
                      <Select.Option value="आयकर">आयकर </Select.Option>
                      <Select.Option value="विक्री कर">विक्री कर </Select.Option>
                      <Select.Option value="आर.टी.ओ. कर">आर.टी.ओ. कर </Select.Option>
                      <Select.Option value="पाटबंधारे विषयक येणे रकमा">
                        पाटबंधारे विषयक येणे रकमा{' '}
                      </Select.Option>
                      <Select.Option value="वारस फेरफार विलंब शुल्‍क">
                        वारस फेरफार विलंब शुल्‍क
                      </Select.Option>

                      <Select.Option value="विटभटटी बिनशेती वसुली">
                        विटभटटी बिनशेती वसुली{' '}
                      </Select.Option>
                      <Select.Option value="वापरात बदल जमीन महसुल वसुली">
                        वापरात बदल जमीन महसूल वसुली{' '}
                      </Select.Option>
                      <Select.Option value="दुरसंचार / मोबाइल टॉवर">
                        दुरसंचार / मोबाइल टॉवर{' '}
                      </Select.Option>
                      <Select.Option value="गाळपेर जमीन आकारणी">गाळपेर जमीन आकारणी </Select.Option>
                      <Select.Option value="अभिलेख नक्कल फी">अभिलेख नक्कल फी </Select.Option>
                      <Select.Option value="गावात अस्वच्‍छता पसरविणे दंड">
                        गावात अस्वच्‍छता पसरविणे दंड
                      </Select.Option>
                      <Select.Option value="गावठाण हददीतील वापरात बदल">
                        गावठाण हददीतील वापरात बदल
                      </Select.Option>
                      <Select.Option value="सिंचन कर">सिंचन कर </Select.Option>

                      <Select.Option value="इतर दंडात्मक वसुली">इतर दंडात्मक वसुली </Select.Option>
                    </Select>
                    <Input
                      onKeyPress={KeyPressEvents.isInputNumber}
                      maxLength={10}
                      style={{ width: '50%' }}
                      addonBefore={<FormattedMessage id="villageForm17.table.amt" />}
                      value={bLocalCessValue}
                      onChange={(event) => {
                        setBLocalCessValue(event.target.value);
                        // console.log('blocalCessValue-->', event.target.value, bLocalCessValue);
                      }}
                      disabled={location.state?.pageMode === 'View'}
                    />
                  </Input.Group>
                </Form.Item>
              </Col>

              <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>

              <Col xl={7} lg={7} md={7} sm={24} xs={24}>
                {selector && (
                  <Form.Item
                    style={{ marginLeft: 5 }}
                    label={<FormattedMessage id="villageForm17.table.otherLocalCessDesc" />}
                    name="otherLocalCessDesc"
                    values={otherLocalCessDesc}
                    rules={[
                      {
                        required: true,
                        message: 'Please enter B - Liable For Local Cess',
                      },
                    ]}
                  >
                    <Input
                      disabled={location.state?.pageMode === 'View'}
                      onChange={(e) => {
                        setOtherLocalCessDesc(e.target.value);
                      }}
                    />
                  </Form.Item>
                )}
              </Col>

              <Col xl={7} lg={7} md={7} sm={24} xs={24}></Col>

              <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>
            </Row>

            <Row style={{ marginTop: 10 }}>
              <Col xl={7} lg={7} md={7} sm={24} xs={24}>
                <Form.Item
                  label={<FormattedMessage id="villageForm17.table.amountOfLR" />}
                  name="amountOfJm"
                  rules={[
                    {
                      required: true,
                      message: 'Please Enter Amount Of L.R',
                    },
                    {
                      type: 'integer',
                      max: 100000000,
                    },
                  ]}
                >
                  {/* <Input onKeyPress={KeyPressEvents.isInputVarchar} maxLength={19} disabled /> */}
                  <Input onKeyPress={KeyPressEvents.isInputVarchar} maxLength={19} />
                </Form.Item>
              </Col>

              <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>

              <Col xl={7} lg={7} md={7} sm={24} xs={24}>
                <Form.Item
                  style={{ marginLeft: 5 }}
                  label={<FormattedMessage id="villageForm17.table.assessment" />}
                  name="assessment"
                  rules={[
                    {
                      required: true,
                      message: 'Please Enter Assessment',
                    },
                    { type: 'integer', max: 100000000 },
                  ]}
                >
                  {/* <Input onKeyPress={KeyPressEvents.isInputVarchar} maxLength={19} disabled /> */}
                  <Input onKeyPress={KeyPressEvents.isInputVarchar} maxLength={19} />
                </Form.Item>
              </Col>

              <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>

              <Col xl={7} lg={7} md={7} sm={24} xs={24}>
                <Form.Item
                  label={<FormattedMessage id="formLanguage.table.remark" />}
                  name="remarks"
                  rules={[
                    // {
                    //   required: true,
                    //   message: 'Please Enter Remarks',
                    // },
                    {
                      max: 200,
                      message: 'Please Enter Remarks upto 200 Characters',
                    },
                  ]}
                >
                  <Input.TextArea
                    onKeyPress={KeyPressEvents.isInputVarchar}
                    maxLength={201}
                    disabled={location.state?.pageMode === 'View'}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row style={{ marginTop: 30 }}>
              <Col xl={7} lg={7} md={7} sm={24} xs={24}></Col>

              <Col xl={10} lg={10} md={10} sm={24} xs={24}>
                {(location.state?.pageMode === 'Add' ||
                  location.state?.pageMode === undefined ||
                  location.state?.pageMode === 'Edit') && (
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={isLoading}
                    style={{ marginLeft: 25 }}
                    onClick={() => {
                      let flagForCess;

                      // console.log('saveFlag', saveFlag);
                      if (location.state?.pageMode === 'Add') {
                        if (
                          saveFlag &&
                          datevalidFlag &&
                          radiovalue &&
                          (localCess || otherLocalCess)
                        ) {
                          onFinish();
                          // console.log('Called');
                        } else {
                          // if (totalAreaValue < affectedAreaValue) {
                          if (totalAreaValue >= affectedAreaValue) {
                            message.error(
                              'Affected Area should be Less that or Equal to Total Area1',
                            );
                          } else if (
                            new Date(periodFromDateForValid) > new Date(periodToDateForValid) ||
                            new Date(periodToDateForValid) < new Date(periodFromDateForValid)
                          ) {
                            message.error('Period To-Date Must be greater than From-Date');
                          } else if (radiovalue == null && location.state.pageMode == 'Add') {
                            message.info('Please Select Khata No or Makta No as option !');
                          }
                          // else if (
                          //   location.state.pageMode == 'Add' &&
                          //   (otherLocalCess == null || localCess == null)
                          // ) {
                          //   message.info('Please Mention Local Cess or Other Local Cess !');
                          // }
                        }
                      } else {
                        if (saveFlag && datevalidFlag) {
                          onFinish();
                          // console.log('Called');
                        } else {
                          // if (totalAreaValue < affectedAreaValue) {
                          if (totalAreaValue >= affectedAreaValue) {
                            message.error(
                              'Affected Area should be Less that or Equal to Total Area2',
                            );
                          } else if (
                            new Date(periodFromDateForValid) > new Date(periodToDateForValid) ||
                            new Date(periodToDateForValid) < new Date(periodFromDateForValid)
                          ) {
                            message.error('Period To-Date Must be greater than From-Date');
                          }
                          // else if (
                          //   location.state.pageMode == 'Add' &&
                          //   (otherLocalCess == null || localCess == null)
                          // ) {
                          //   message.info('Please Mention Local Cess or Other Local Cess !');
                          // }
                        }
                      }
                    }}
                  >
                    <FormattedMessage id="formLanguage.button.save" />
                  </Button>

                  // <Popconfirm
                  //   title={<FormattedMessage id="formLanguage.form.popForSave" />}
                  //   onConfirm={() => {
                  //                         }
                  //   }
                  //   onCancel={() => {
                  //     message.error('Request Cancelled !!!');
                  //   }}
                  //   okText={<FormattedMessage id="formLanguage.form.yes" />}
                  //   cancelText={<FormattedMessage id="formLanguage.form.no" />}
                  // >
                  // </Popconfirm>
                )}
                {(location.state?.pageMode === 'Add' || location.state?.pageMode === undefined) && (
                  <Button
                    onClick={() => {
                      setAffectedAreaValue();
                      setTotalAreaInUOM();
                      setTotalAreaValue();
                      form.resetFields();
                      setLocalCessValue();
                      setBLocalCessValue();
                      setOtherLocalCess();
                      setLocalCess();
                    }}
                    type="default"
                    style={{ color: 'white', backgroundColor: 'orange', marginLeft: 25 }}
                  >
                    <FormattedMessage id="formLanguage.button.reset" />
                  </Button>
                )}

                <Button
                  onClick={() => {
                    history.push('/form/village-form-17/table-form');
                  }}
                  type="danger"
                  htmlType="submit"
                  style={{ marginLeft: 25 }}
                >
                  <FormattedMessage id="formLanguage.button.cancel" />
                </Button>
              </Col>

              <Col xl={7} lg={7} md={7} sm={24} xs={24}></Col>
            </Row>
          </Form>
        </Card>
      )}
    </>
  );
};
export default BasicForm;
