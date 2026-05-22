
import { Card, message, Button, Form, Input, Select, Row, Col } from 'antd';
import { useHistory, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import VillageSelector from '@/components/eComponents/VillageSelector';
import URLS from '@/URLs/urls';
import useAxios from '@/components/eComponents/use-axios';
import { FormattedMessage, useModel } from 'umi';
import KeyPressEvents from '@/util/KeyPressEvents';
import { isEmpty } from 'lodash';

let rate = 0.1,
  h2R = 10000;
const BasicForm = () => {
  // const { Option } = Select;
  let history = useHistory();
  const [dataById, setDataById] = useState({});
  const [village, setVillage] = useState([]);
  const [textForVillage, setTextForVillage] = useState();
  const { districtCode, talukaCode } = useModel('details');
  const location = useLocation();
  const [form] = Form.useForm();
  const [form1] = Form.useForm();
  const { sendRequest } = useAxios();
  const [isLoading, setIsLoading] = useState(false);
  const [khataNoText, setkhataNoText] = useState();
  const [codeVillage, setCodeVillage] = useState('');
  const [revenueYear, setRevenueYear] = useState();
  const [isNirank, setIsNirank] = useState(false);

  const [localCessValue, setLocalCessValue] = useState();
  const [bLocalCessValue, setBLocalCessValue] = useState();
  const [assesmentValue, setAssesmentValue] = useState(null);
  const [otherLocalCess, setOtherLocalCess] = useState();
  const [amountOfLrValue, setAmountOfLrValue] = useState();
  const [amountOfLcValue, setAmountOfLcValue] = useState();
  const [amountOfVpValue, setAmountOfVpValue] = useState();
  const [surveyHissaNumberValue, setSurveyHissaNumberValue] = useState();
  const [totalAreaValue, setTotalAreaValue] = useState();
  const [totalAreaInUOM, setTotalAreaInUOM] = useState();
  const [kaJaPaRate, setKaJaPaRate] = useState();
  const [affectedAreaValue, setAffectedAreaValue] = useState();
  const [surveyHissaNoValue, setSurveyHissaNoValue] = useState();
  const [data, setData] = useState();
  const [saveFlag, setSaveFlag] = useState(true);
  const [flagForSearch, setFlagForSearch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [part, setPart] = useState(null);
  const [partL, setPartL] = useState(null);
  const [prayojan, setPrayojan] = useState(null);
  const [outsideGavthanRate,setOutsideGavthanRate]=useState()
  const [outsideGavthanData,setOutsideGavthanData]=useState()
      
  useEffect(() => {
    if (codeVillage) {
      getKaJaPaRate();
    }
  }, [codeVillage]);

  useEffect(() => {
     console.log(outsideGavthanRate,'outsideGavthanRate---------11111111111111111111')
     console.log(partL,"----------partL")
    if(partL=='form2.table.partB' && outsideGavthanRate!=undefined){
    

    if (prayojan == 'निवासी') {
 const jm = !outsideGavthanData?.rate
  ? kaJaPaRate * (affectedAreaValue * h2R)
  : outsideGavthanRate * (affectedAreaValue * h2R);

const zp = !outsideGavthanData?.rate
  ? kaJaPaRate * (affectedAreaValue * h2R) * 7
  : 0;

const gp = !outsideGavthanData?.rate
  ? kaJaPaRate * (affectedAreaValue * h2R)
  : 0;

const assessment = !outsideGavthanData?.rate
  ? jm * 9
  : jm + zp + gp;

form.setFieldsValue({
  amountOfJm: jm.toFixed(2),
  amountOfZp: zp.toFixed(2),
  amountOfGp: gp.toFixed(2),
  assessment: assessment.toFixed(2),
});

      // console.log('निवासी', rate * affectedAreaValue * h2R);
    }
    
    
    
    
    
    
    
    else if (prayojan == 'औद्योगिक') {
     const jm = !outsideGavthanData?.rate
  ? kaJaPaRate * (affectedAreaValue * h2R) * 1.5
  : outsideGavthanRate * (affectedAreaValue * h2R) * 1.5;

const zp = !outsideGavthanData?.rate
  ? kaJaPaRate * (affectedAreaValue * h2R) * 1.5 * 7
  : 0;

const gp = !outsideGavthanData?.rate
  ? kaJaPaRate * (affectedAreaValue * h2R) * 1.5
  : 0;

const assessment = !outsideGavthanData?.rate
  ? kaJaPaRate * (affectedAreaValue * h2R) * 1.5 * 9
  : jm + zp + gp;

form.setFieldsValue({
  amountOfJm: jm.toFixed(2),
  amountOfZp: zp.toFixed(2),
  amountOfGp: gp.toFixed(2),
  assessment: assessment.toFixed(2),
});

    } else if (prayojan == 'वाणिज्य') {
  const jm = !outsideGavthanData?.rate
  ? kaJaPaRate * (affectedAreaValue * h2R) * 2
  : outsideGavthanRate * (affectedAreaValue * h2R) * 2;

const zp = !outsideGavthanData?.rate
  ? kaJaPaRate * (affectedAreaValue * h2R) * 2 * 7
  : 0;

const gp = !outsideGavthanData?.rate
  ? kaJaPaRate * (affectedAreaValue * h2R) * 2
  : 0;

  const assessment = !outsideGavthanData?.rate
    ? kaJaPaRate * (affectedAreaValue * h2R) * 2 * 9
    : jm + zp + gp;

form.setFieldsValue({
  amountOfJm: jm.toFixed(2),
  amountOfZp: zp.toFixed(2),
  amountOfGp: gp.toFixed(2),
  assessment: assessment.toFixed(2),
});

    
    } else if (prayojan == 'इतर') {
     const jm = !outsideGavthanData?.rate
  ? kaJaPaRate * (affectedAreaValue * h2R) * 1.5
  : outsideGavthanRate * (affectedAreaValue * h2R) * 1.5;

const zp = !outsideGavthanData?.rate
  ? kaJaPaRate * (affectedAreaValue * h2R) * 1.5 * 7
  : 0;

const gp = !outsideGavthanData?.rate
  ? kaJaPaRate * (affectedAreaValue * h2R) * 1.5
  : 0;

const assessment = !outsideGavthanData?.rate
  ? kaJaPaRate * (affectedAreaValue * h2R) * 1.5 * 9
  : jm + zp + gp;

form.setFieldsValue({
  amountOfJm: jm.toFixed(2),
  amountOfZp: zp.toFixed(2),
  amountOfGp: gp.toFixed(2),
  assessment: assessment.toFixed(2),
});
    }
  }else{

    if (prayojan == 'निवासी') {
      // form.setFieldsValue({
      //   amountOfJm: Math.round(kaJaPaRate * (affectedAreaValue * h2R) * 1).toFixed(2),
      //   amountOfGp: 0,
      //   amountOfZp:0,
      //   assessment: Math.round(kaJaPaRate * (affectedAreaValue * h2R) * 1).toFixed(2),
      // });
 
      // console.log('निवासी', rate * affectedAreaValue * h2R);
    const jm = !outsideGavthanData?.rate
  ? kaJaPaRate * (affectedAreaValue * h2R) * 1
  : outsideGavthanRate * (affectedAreaValue * h2R) * 1;

const zp = !outsideGavthanData?.rate
  ? kaJaPaRate * (affectedAreaValue * h2R) * 1 * 7
  : 0;

const gp = !outsideGavthanData?.rate
  ? kaJaPaRate * (affectedAreaValue * h2R) * 1
  : 0;

const assessment = !outsideGavthanData?.rate
  ? kaJaPaRate * (affectedAreaValue * h2R) * 1 * 9
  : jm + zp + gp;


form.setFieldsValue({
  amountOfJm: jm.toFixed(2),
  amountOfZp: zp.toFixed(2),
  amountOfGp: gp.toFixed(2),
  assessment: assessment.toFixed(2),
});

    }
    
    else if (prayojan == 'औद्योगिक') {
      const jm = !outsideGavthanData?.rate
  ? kaJaPaRate * (affectedAreaValue * h2R) * 1.5
  : outsideGavthanRate * (affectedAreaValue * h2R) * 1.5;

const zp = !outsideGavthanData?.rate
  ? kaJaPaRate * (affectedAreaValue * h2R) * 1.5 * 7
  : 0;

const gp = !outsideGavthanData?.rate
  ? kaJaPaRate * (affectedAreaValue * h2R) * 1.5
  : 0;

const assessment = !outsideGavthanData?.rate
  ? kaJaPaRate * (affectedAreaValue * h2R) * 1.5 * 9
  : jm + zp + gp;


form.setFieldsValue({
  amountOfJm: jm.toFixed(2),
  amountOfZp: zp.toFixed(2),
  amountOfGp: gp.toFixed(2),
  assessment: assessment.toFixed(2),
});

    } else if (prayojan == 'वाणिज्य') {
    const jm = !outsideGavthanData?.rate
  ? kaJaPaRate * (affectedAreaValue * h2R) * 2
  : outsideGavthanRate * (affectedAreaValue * h2R) * 2;

const zp = !outsideGavthanData?.rate
  ? kaJaPaRate * (affectedAreaValue * h2R) * 2 * 7
  : 0;

const gp = !outsideGavthanData?.rate
  ? kaJaPaRate * (affectedAreaValue * h2R) * 2
  : 0;

const assessment = !outsideGavthanData?.rate
  ? kaJaPaRate * (affectedAreaValue * h2R) * 2 * 9
  : jm + zp + gp;

form.setFieldsValue({
  amountOfJm: jm.toFixed(2),
  amountOfZp: zp.toFixed(2),
  amountOfGp: gp.toFixed(2),
  assessment: assessment.toFixed(2),
});

      
    } else if (prayojan == 'इतर') {
    const jm = !outsideGavthanData?.rate
  ? kaJaPaRate * (affectedAreaValue * h2R) * 1.5
  : outsideGavthanRate * (affectedAreaValue * h2R) * 1.5;

const zp = !outsideGavthanData?.rate
  ? kaJaPaRate * (affectedAreaValue * h2R) * 1.5 * 7
  : 0;

const gp = !outsideGavthanData?.rate
  ? kaJaPaRate * (affectedAreaValue * h2R) * 1.5
  : 0;

const assessment = !outsideGavthanData?.rate
  ? kaJaPaRate * (affectedAreaValue * h2R) * 1.5 * 9
  : jm + zp + gp;

form.setFieldsValue({
  amountOfJm: jm.toFixed(2),
  amountOfZp: zp.toFixed(2),
  amountOfGp: gp.toFixed(2),
  assessment: assessment.toFixed(2),
});
    }
  }
  }, [prayojan, partL, affectedAreaValue]);

  useEffect(() => {
    if (totalAreaValue < affectedAreaValue) {
      message.info('Affected Area should be Less that or Equal to Total Area');
      setSaveFlag(false);
    } else {
      setSaveFlag(true);
    }
  }, [affectedAreaValue]);

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
      getKaJaPaRate();
    }
  }, []);

  useEffect(() => {
    if (otherLocalCess === 'इतर दंडात्मक वसुली') {
      // setSelector(true);
    }
  }, [otherLocalCess]);

  const handleOnChangeOfKhata = (event) => {
    setkhataNoText(event.target.value);
    setSurveyHissaNumberValue();
    setAffectedAreaValue();
    form.resetFields();
    setTotalAreaValue();
    setLoading(false);
  };

  const getKaJaPaRate = async () => {
    sendRequest(
      `${URLS.BaseURL}/landRevenue/getKaJaPaRate?cCode=${codeVillage}`,
      'GET',
      null,
      (res) => {
        setKaJaPaRate(res.data.akrushakRate.length === 0 ? 0.1 : res.data.akrushakRate[0].rate);
      },
    );
  };

  const getDetailBykhatNo = async () => {
    setLoading(true);
    if (khataNoText && codeVillage) {
      sendRequest(
        // `${URLS.BaseURL}/form17/getDetailByKhataNo?districtCode=${districtCode}&talukaCode=${talukaCode}&khataNo=${khataNoText}&cCode=${codeVillage}`,
        `${URLS.BaseURL}/form17NoKaJaPa/getDetailByKhataNoKaJaPa?districtCode=${districtCode}&talukaCode=${talukaCode}&khataNo=${khataNoText}&cCode=${codeVillage}`,
        'GET',
        null,
        (res) => {
          form.setFieldsValue({
            personLiable: res.data.form17Data[0].personLiable,
          });
          setLoading(false),
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
      `${URLS.BaseURL}/form17NoKaJaPa/getForm17NoKaJaPaDataById?id=${location.state?.id}`,
      'GET',
      null,
      (res) => {
        // console.log('full res', res.data);
        setTotalAreaValue(res.data.totalArea);
        setTotalAreaInUOM(res.data.uomOfTotalArea);
        setAffectedAreaValue(res.data.areaAffected);
        setSurveyHissaNoValue(res.data.surveyHissaNo),
          setPrayojan(res.data.prayojanType),
          setPartL(res.data.locationOfLand),
          setDataById({
            revenueYear: res.data.revenueYear,
            districtCode: res.data.districtCode,
            talukaCode: res.data.talukaCode,
            cCode: res.data.cCode,
            orderNo: res.data.orderNo,
            khataNo: res.data.khataNo,
            personLiable: res.data.personLiable,
            surveyHissaNo: res.data.surveyHissaNo,
            totalArea: res.data.totalArea,
            totalAreaInUOM: res.data.totalAreaInUOM,
            areaAffected: res.data.areaAffected,
            amountOfZp: res.data.amountOfZp,
            amountOfJm: res.data.amountOfJm,
            amountOfGp: res.data.amountOfGp,
            assessment: res.data.assessment,
            remarks: res.data.remarks,
          });
        form1.setFieldsValue({
          khataNo: res.data.khataNo,
        });
        form.setFieldsValue({
          personLiable: res.data.personLiable,
          surveyHissaNo: res.data.surveyHissaNo,
          totalArea: res.data.totalArea,
          orderNo: res.data.orderNo,
          areaAffected: res.data.areaAffected,
          amountOfJm: res.data.amountOfJm,
          amountOfZp: res.data.amountOfZp,
          amountOfGp: res.data.amountOfGp,
          assessment: res.data.assessment,
          remarks: res.data.remarks,
        });
      },
    );
  };
  const getnapamanaparate = async (value) => {
    setOutsideGavthanRate(0);
    
    // Extract the number before any special character
    const numericPart = value.split(/[-/]/)[0];
    // Or if you want to be more specific about extracting digits only:
    // const numericPart = value.match(/^\d+/)?.[0] || '';

    sendRequest(
        `${URLS.BaseURL}/form17NoKaJaPa/getrate?cCode=${codeVillage}&pin=${numericPart}`,
        'GET',
        null,
        (res) => {
          console.log(res,"check reponse for rate");
            setOutsideGavthanRate(res.data.rate);
            setOutsideGavthanData(res.data);
            console.log(rate, "check rateeee");
            console.log(res.data.rate, "checkreponse");
        }
    );
}
  const onFinish = async (values) => {
    const inputParamsForAdd = {
      revenueYear: revenueYear,
      districtCode: districtCode,
      talukaCode: talukaCode,
      cCode: codeVillage,
      khataNo: form1.getFieldValue('khataNo'),
      personLiable: form.getFieldValue('personLiable'),
      surveyHissaNo: surveyHissaNoValue,
      totalArea: totalAreaValue,
      uomOfTotalArea: totalAreaInUOM,
      orderNo: form.getFieldValue('orderNo'),
      areaAffected: affectedAreaValue,
      uomOfAreaAffected: totalAreaInUOM,
      locationOfLand: partL,
      prayojanType: prayojan,
      amountOfJm: form.getFieldValue('amountOfJm'),
      amountOfZp: form.getFieldValue('amountOfZp'),
      amountOfGp: form.getFieldValue('amountOfGp'),
      assessment: form.getFieldValue('assessment'),
      remarks: form.getFieldValue('remarks'),
      kaJaPaRate: kaJaPaRate,
    };

   if(!inputParamsForAdd.orderNo){
      return console.log("orderNo is required ")
    }
    if(!inputParamsForAdd.areaAffected){
      return console.log("areaAffected area is required ")
    }
    setIsLoading(true);


    const inputParamsForEdit = {
      id: location.state?.id,
      revenueYear: location.state?.revenueYear,
      districtCode: location.state?.districtCode,
      talukaCode: location.state?.talukaCode,
      cCode: location.state?.cCode,
      khataNo: location.state?.khataNo,
      personLiable: form.getFieldValue('personLiable'),
      totalArea: totalAreaValue,
      uomOfTotalArea: totalAreaInUOM,
      orderNo: form.getFieldValue('orderNo'),
      surveyHissaNo: form.getFieldValue('surveyHissaNo'),
      areaAffected: totalAreaValue,
      uomOfAreaAffected: totalAreaInUOM,
      locationOfLand: partL,
      prayojanType: prayojan,
      amountOfJm: form.getFieldValue('amountOfJm'),
      amountOfZp: form.getFieldValue('amountOfZp'),
      amountOfGp: form.getFieldValue('amountOfGp'),
      assessment: form.getFieldValue('assessment'),
      remarks: form.getFieldValue('remarks'),
      kaJaPaRate: kaJaPaRate,
    };
      if(!inputParamsForAdd.orderNo){
      return console.log("orderNo is required ")
    }
    if(!inputParamsForAdd.areaAffected){
      return console.log("areaAffected area is required ")
    }
    setIsLoading(true);


    if (location.state?.pageMode === 'Edit') {
      sendRequest(
        `${URLS.BaseURL}/form17NoKaJaPa/editForm17NoKaJaPa`,
        'POST',
        inputParamsForEdit,
        (res) => {
          // console.log('form17PayLoad', inputParamsForEdit);
          // console.log('--form 17 post call-' + res.data);
          if (res.status === 200) {
            message.success('Data Saved!!');
            form.resetFields();
            history.push({
              pathname: `/generate-revenue/village-form-17Abstract/table-form`,
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
        `${URLS.BaseURL}/form17NoKaJaPa/saveForm17NoKaJaPa`,
        'POST',
        inputParamsForAdd,
        (res) => {
          // console.log('--form 17 post call-' + res.data);
          if (res.status === 201) {
            message.success('Data Saved!!');
            form.resetFields();
            history.push({
              pathname: `/generate-revenue/village-form-17Abstract/table-form`,
            });
            setIsLoading(false);
          }
        },
        (err) => {
          setIsLoading(false);
          message.error('दिलेल्या खाता क्रमांकाची मागणी आधीच निश्चित केलेली आहे!!!');
        },
      );
    }
  };

  return (
    <>
      <Card>
        <h1 style={{ textAlign: 'center' }}>
          गाव नमुना १७ मधील कजाप न झालेल्या बिनशेती जमिनींच्या सारा निश्चितीसाठी भरावयाची माहिती
        </h1>
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

      <Card style={{ marginTop: 15 }}>
        <Form layout="vertical" form={form1}>
          <Row style={{ marginTop: '40px' }}>
            <Col xl={7} lg={7} md={7} sm={24} xs={24}>
              <Form.Item
                label={<FormattedMessage id="villageForm17.form.khataNo" />}
                name="khataNo"
                rules={[
                  {
                    required: true,
                    message: 'Khata No is Required',
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
                    handleOnChangeOfKhata(event);
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
              {(location.state?.pageMode === 'Add' || location.state?.pageMode === undefined) && (
                <Button
                  loading={loading}
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
                      getDetailBykhatNo();
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
          {/* )} */}
        </Form>
        <Form layout="vertical" form={form}>
          <Row style={{ marginTop: 10 }}>
            <Col xl={7} lg={7} md={7} sm={24} xs={24}>
              <Form.Item
                label={<FormattedMessage id="villageForm17.table.personLiable" />}
                name="personLiable"
                rules={[
                  {
                    type: 'string',
                    max: 500,
                  },
                ]}
              >
                <Input disabled="true" />
              </Form.Item>
            </Col>

            <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>
            <Col xl={7} lg={7} md={7} sm={24} xs={24}>
              {(location.state?.pageMode === 'Add' || location.state?.pageMode === undefined) && (
                <Form.Item
                  label={<FormattedMessage id="villageForm17.table.surveyNo" />}
                  name="surveyHissaNo"
                  rules={[
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
                                            getnapamanaparate(value);

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
            {/* )} */}

            <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>

            <Col xl={7} lg={7} md={7} sm={24} xs={24}>
              <Form.Item
                label={<FormattedMessage id="formLanguage.table.totalArea" />}
                name="totalArea"
              >
                <Input.Group compact>
                  <Input disabled style={{ width: '60%' }} value={totalAreaValue} />
                  <Input disabled style={{ width: '40%' }} value={totalAreaInUOM} />
                </Input.Group>
              </Form.Item>
            </Col>
          </Row>

          <Row style={{ marginTop: 10 }}>
            <Col xl={7} lg={7} md={7} sm={24} xs={24}>
              <Form.Item
                label={'बिनशेती आदेश क्रमांक'}
                required
                name="orderNo"
                rules={[
                  {
                    max: 50,
                    message: 'Please Enter Case Number upto 50 characters',
                  },
                  { required: true, message: 'This Field Is Required..' }
                ]}
              >
                <Input
                  onKeyPress={KeyPressEvents.isInputVarchar}
                  maxLength={51}
                  disabled={location.state?.pageMode === 'View'}
                />
              </Form.Item>
            </Col>

            <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>

            <Col xl={7} lg={7} md={7} sm={24} xs={24}>
              <Form.Item style={{ marginLeft: 5 }} label={'बिनशेती क्षेत्र '} 
               required 
                  name="areaAffected"
                  >
                <Input.Group compact>
                  <Input
                    disabled={location.state?.pageMode === 'View'}
                    style={{ width: '60%' }}
                    value={affectedAreaValue}
                    required
                    onChange={(event) => {
                      setAffectedAreaValue(event.target.value);
                    }}        
                  />
                  <Input disabled style={{ width: '40%' }} value={totalAreaInUOM} />
                </Input.Group>
              </Form.Item>
            </Col>

            <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>
          </Row>
          <Row>
            <Col xl={7} lg={7} md={7} sm={24} xs={24}>
              <Form.Item
                name="part"
                rules={[{ required: true, message: 'This Field Is Required..' }]}
                label={'बिनशेती क्षेत्राचे स्थान'}
              >
                <Select
                  defaultValue={location.state?.locationOfLand}
                  onChange={(value) => {
                    setPartL(value);
                  }}
                  placeholder="बिनशेती क्षेत्राचे स्थान"
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
            <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>
            <Col xl={7} lg={7} md={7} sm={24} xs={24}>
              <Form.Item
                name="prayojan"
                rules={[{ required: true, message: 'This Field Is Required..' }]}
                label={'प्रयोजन'}
              >
                <Select
                  onChange={(value) => setPrayojan(value)}
                  defaultValue={location.state?.prayojanType}
                  placeholder="प्रयोजन"
                >
                  <Select.Option value="निवासी">निवासी</Select.Option>
                  <Select.Option value="औद्योगिक">औदयोगिक </Select.Option>
                  <Select.Option value="वाणिज्य">वाणिज्य</Select.Option>
                  <Select.Option value="इतर">इतर </Select.Option>
                </Select>
              </Form.Item>
            </Col>
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
                    max: 50,
                    message: 'This Field shoud be upto 50 Numericals',
                  },
                ]}
              >
                <Input maxLength={51} disabled />
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
                    max: 50,
                    message: 'This Field shoud be upto 50 Numericals',
                  },
                ]}
              >
                <Input maxLength={51} disabled />
              </Form.Item>
            </Col>

            <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>

            <Col xl={7} lg={7} md={7} sm={24} xs={24}>
              <Form.Item
                label={<FormattedMessage id="villageForm17.table.amountOfVP" />}
                name="amountOfGp"
                rules={[
                  {
                    max: 50,
                    message: 'This Field shoud be upto 50 Numericals',
                  },
                ]}
              >
                <Input maxLength={51} disabled />
              </Form.Item>
            </Col>
          </Row>

          <Row style={{ marginTop: 10 }}>
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
                  {
                    max: 50,
                    message: 'This Field shoud be upto 50 Numericals',
                  },
                ]}
              >
                <Input maxLength={51} disabled />
              </Form.Item>
            </Col>

            <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>

            <Col xl={7} lg={7} md={7} sm={24} xs={24}>
              <Form.Item
                label={<FormattedMessage id="formLanguage.table.remark" />}
                name="remarks"
                rules={[
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
                      if (saveFlag) {
                        onFinish();
                        // console.log('Called');
                      } else {
                        if (totalAreaValue < affectedAreaValue) {
                          message.error('Affected Area should be Less that or Equal to Total Area');
                        }
                      }
                    } else {
                      if (saveFlag) {
                        onFinish();
                        // console.log('Called');
                      } else {
                        if (totalAreaValue < affectedAreaValue) {
                          message.error('Affected Area should be Less that or Equal to Total Area');
                        }
                      }
                    }
                  }}
                >
                  <FormattedMessage id="formLanguage.button.save" />
                </Button>
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
                  }}
                  type="default"
                  style={{ color: 'white', backgroundColor: 'orange', marginLeft: 25 }}
                >
                  <FormattedMessage id="formLanguage.button.reset" />
                </Button>
              )}

              <Button
                onClick={() => {
                  history.push('/generate-revenue/village-form-17Abstract/table-form');
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
    </>
  );
};
export default BasicForm;
