import React, { useState, useEffect } from 'react';
import BasicInput from '@/components/eComponents/BasicInput/BasicInput';
import { PageContainer } from '@ant-design/pro-layout';
import {
  Form,
  Button,
  Card,
  Row,
  Col,
  Input,
  DatePicker,
  Select,
  Alert,
  message,
  Popconfirm,
  Radio,
  Space,
} from 'antd';
import { useModel } from 'umi';
import Selector from '../common/selector';
import ValidationPatterns from '@/components/eComponents/ValidationPatterns';
import Modeofpayment from '../common/modeofpayment';
import Axios from 'axios';
import { fromPairs } from 'lodash';
import { useReactToPrint } from 'react-to-print';
import { useHistory } from 'react-router-dom';
import { render } from 'react-dom';
import moment from 'moment';
import BaseURL from '@/URLs/urls';
import VillageSelector from '@/components/eComponents/VillageSelector';
import { ToWords } from 'to-words';
// const { Option } = Select;
import URLS from '@/URLs/urls';
import useAxios from '@/components/eComponents/use-axios';
import { FormattedMessage } from 'umi';
import KeyPressEvents from '@/util/KeyPressEvents';
function ReceiveMoney() {
  const [button1State, setButton1State] = useState(true);
  const { sendRequest } = useAxios();
  const [flagButton, setFlagButton] = useState(true);
  const [printIsVisible, setPrintIsVisible] = useState(true);
  const [textInput, setTextInput] = useState();
  const [textVillage, setTextVillage] = useState();
  const [isNirank, setIsNirank] = useState(false);
  const [form] = Form.useForm();
  const [village, setVillage] = useState([]);
  const [test, setTest] = useState();
  const [modeOfPayment, setModeOfPayment] = useState();
  const [codeVillage, setCodeVillage] = useState('');
  const [stateForAmount, setStateForAmount] = useState();
  const [radiovalue, setRadioValue] = useState();
  const [mainRadiovalue, setMainRadioValue] = useState();
  let history = useHistory();
  const [revenueYear, setRevenueYear] = useState();
  const [selectorState, setSelectorState] = useState(false);
  const [khataMakhtaOwner, setKhataMakhtaOwner] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState([]);
  const [lGDCode, setLGDCode] = useState();
  const { districtName, talukaName, districtCode, talukaCode, villageData } = useModel('details');
  // const[lgd,setLGD]=useState(localStorage.getItem('LGD_Code'));

  const toWords = new ToWords({
    localeCode: 'mr-IN',
    converterOptions: {
      currency: true,
      ignoreDecimal: false,
      ignoreZeroCurrency: false,
      doNotAddOnly: true,
    },
  });

  useEffect(() => {
    const result = villageData.filter(
      (thing, index, self) => index === self.findIndex((t) => t.lgdCode === thing.lgdCode),
    );
    var sorting = result?.map((row) => row.lgdCode);

    setLGDCode(sorting.shift());
  }, []);

  const success = () => {
    message.success('Data Saved!!');
  };

  function confirm(e) {
    message.success('Request Successful !!!');
  }

  function cancel(e) {
    // console.log(e);
    message.error('Request Cancelled !!!');
  }

  const enterLoading = (index) => {
    setSearchLoading((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[index] = true;
      return newLoadings;
    });
    setTimeout(() => {
      setSearchLoading((prevLoadings) => {
        const newLoadings = [...prevLoadings];
        newLoadings[index] = false;
        return newLoadings;
      });
    }, 2000);
  };

  const getConent = async () => {
    let article;
    // console.log(textVillage + '--textInput---' + textInput);
    if (textInput !== null && textInput !== undefined && textInput) {
      if (khataMakhtaOwner == 'khataOwnerName') {
        article = {
          revenueYear: revenueYear,
          districtCode: districtCode,
          talukaCode: talukaCode,
          cCode: codeVillage,
          khataOwnerName: textInput,
        };
      } else if (mainRadiovalue === 'maktaNumber') {
        article = {
          revenueYear: revenueYear,
          districtCode: districtCode,
          talukaCode: talukaCode,
          cCode: codeVillage,
          makhtaKhataNo: textInput,
        };
      } else {
        article = {
          revenueYear: revenueYear,
          districtCode: districtCode,
          talukaCode: talukaCode,
          cCode: codeVillage,
          khataNo: textInput,
        };
      }
      if (mainRadiovalue === 'khataNumber') {
        // console.log('DaoForForm17Data', article);
        sendRequest(
          `${URLS.BaseURL}/form17/getForm17DataByCCodeAndRevenueYearAndKhataNo`,
          'POST',
          article,
          (res) => {
            // console.log('ResponseOfForm17-->', res);
            setTest({
              landReceiveForm17Id: res.data.id,
              revenueYear: res.data.revenueYear,
              districtCode: res.data.districtCode,
              talukaCode: res.data.talukaCode,
              cCode: res.data.cCode,
              khataNo: res.data.khataNo,
              khataOwnerName: res.data.personLiable,
              NameofTenent: res.data.NameofTenent,
              preYearTotal: 0,
              LR: 0,
              ZP: 0,
              VP: 0,
              AkrushikLR: 0,
              addlLandRevenue: 0,
              educationalCess: 0,
              addlEducationalCess: 0,
              employeeGuaranteeScheme: 0,
              jmSankirn: res.data.amountOfJm,
              zpSankirn: res.data.amountOfZp,
              gpSankirn: res.data.amountOfGp,
              localCessAmount: res.data.localCessAmount,
              otherLocalCessAmount: res.data.otherLocalCessAmount,
              TotalDemand: res.data.assessment,
              DDAmount: res.data.assessment,
              chequeAmount: res.data.assessment,
              surveyHissaNo: res.data.surveyHissaNo,
              area: res.data.areaAffected,
              uom: res.data.uomOfAreaAffected,
            });
            setSelectorState(true);

            form.setFieldsValue({
              landReceiveForm17Id: res.data.id,
              khataNo: res.data.khataNo,
              khataOwnerName: res.data.personLiable,
              NameofTenent: res.data.NameofTenent,
              preYearTotal: 0,
              LR: 0,
              ZP: 0,
              VP: 0,
              addlLandRevenue: 0,
              educationalCess: 0,
              addlEducationalCess: 0,
              employeeGuaranteeScheme: 0,
              localCessAmount: res.data.localCessAmount,
              otherLocalCessAmount: res.data.otherLocalCessAmount,
              TotalDemand: res.data.assessment,
              DDAmount: res.data.assessment,
              chequeAmount: res.data.assessment,
            });
          },

          (err) => { },
        );
      }
      //------old---
      // else if (radiovalue === 'Land Revenue') {
      //   sendRequest(
      //     `${URLS.BaseURL}/landRevenue/getLrDtlByKhataNoAndKhataOwnerName`,
      //     'POST',
      //     article,
      //     (res) => {
      //       // console.log('res', res.data.landRevenueDemandData);
      //       if (res.data.length === 0) {
      //         message.info(`${textInput} या खात्याची मागणी निश्चिती झालेली नाही `);
      //         setTest({});
      //         form.resetFields();
      //       } else if (res.data.landRevenueDemandData[0].netAmount <= 0) {
      //         message.info(`${textInput} या खात्याची आकारणी '0' असल्यामुळे पावती तयार होणार नाही `);
      //       } else {
      //         if (res.data.landRevenueDemandData[0].receiptNo) {
      //           message.info(` ${textInput} या खात्याची पावती आधीच तयार झालेली आहे`);
      //         } else {
      //           setTest(
      //             {
      //               id: res.data.landRevenueDemandData[0].id,
      //               khataNo: res.data.landRevenueDemandData[0].khataNo,
      //               khataOwnerName: res.data.landRevenueDemandData[0].khataOwnerName,
      //               NameofTenent: res.data.landRevenueDemandData[0].NameofTenent,
      //               surveyHissaNo: res.data.landRevenueDemandData[0].surveyHissaNo,
      //               LR:
      //                 res.data.landRevenueDemandData[0].jmBindumala +
      //                 res.data.landRevenueDemandData[0].jmDumala,
      //               ZP:
      //                 res.data.landRevenueDemandData[0].zpBindumala +
      //                 res.data.landRevenueDemandData[0].zpDumala +
      //                 res.data.landRevenueDemandData[0].zpAkrushik,
      //               VP:
      //                 res.data.landRevenueDemandData[0].gpBindumala +
      //                 res.data.landRevenueDemandData[0].gpDumala +
      //                 res.data.landRevenueDemandData[0].gpAkrushik,
      //               AkrushikLR: res.data.landRevenueDemandData[0].jmAkrushik,
      //               addlLandRevenue: res.data.landRevenueDemandData[0].addlLandRevenue,
      //               educationalCess: res.data.landRevenueDemandData[0].educationalCess,
      //               addlEducationalCess: res.data.landRevenueDemandData[0].addlEducationalCess,
      //               employeeGuaranteeScheme:
      //                 res.data.landRevenueDemandData[0].employeeGuaranteeScheme,
      //               TotalDemand: res.data.landRevenueDemandData[0].netAmount,
      //               DDAmount: res.data.landRevenueDemandData[0].netAmount,
      //               chequeAmount: res.data.landRevenueDemandData[0].netAmount,
      //               preYearTotal:
      //                 res.data.landRevenueDemandData[0].preYearPendingAddlEducationalCess +
      //                 res.data.landRevenueDemandData[0].preYearPendingAddlLandRevenue +
      //                 res.data.landRevenueDemandData[0].preYearPendingEducationalCess +
      //                 res.data.landRevenueDemandData[0].preYearPendingEmployeeGuaranteeScheme +
      //                 res.data.landRevenueDemandData[0].preYearPendingGp +
      //                 res.data.landRevenueDemandData[0].preYearPendingJm +
      //                 res.data.landRevenueDemandData[0].preYearPendingZp +
      //                 res.data.landRevenueDemandData[0].preYearPendingNaCess +
      //                 res.data.landRevenueDemandData[0].preYearSankirnJmWith +
      //                 res.data.landRevenueDemandData[0].preYearSankirnJmWithout +
      //                 res.data.landRevenueDemandData[0].preYearNoticeFee,
      //               localCessAmount: res.data.landRevenueDemandData[0].localCess,
      //               otherLocalCessAmount: res.data.landRevenueDemandData[0].otherLocalCess,
      //               noticeAmount: res.data.landRevenueDemandData[0].noticeAmount,
      //             },
      //             // console.log(
      //             //   'res khataOwnerName',
      //             //   res.data.landRevenueDemandData[0].khataOwnerName,
      //             // ),
      //           );
      //           setSelectorState(true);

      //           form.setFieldsValue(
      //             // console.log('res khataOwnerName', res.data[0].khataOwnerName),

      //             {
      //               id: res.data.landRevenueDemandData[0].id,
      //               khataNo: res.data.landRevenueDemandData[0].khataNo,
      //               khataOwnerName: res.data.landRevenueDemandData[0].khataOwnerName,
      //               NameofTenent: res.data.landRevenueDemandData[0].NameofTenent,
      //               surveyHissaNo: res.data.landRevenueDemandData[0].surveyHissaNo,
      //               LR:
      //                 res.data.landRevenueDemandData[0].jmBindumala +
      //                 res.data.landRevenueDemandData[0].jmDumala,
      //               ZP:
      //                 res.data.landRevenueDemandData[0].zpBindumala +
      //                 res.data.landRevenueDemandData[0].zpDumala +
      //                 res.data.landRevenueDemandData[0].zpAkrushik,
      //               VP:
      //                 res.data.landRevenueDemandData[0].gpBindumala +
      //                 res.data.landRevenueDemandData[0].gpDumala +
      //                 res.data.landRevenueDemandData[0].gpAkrushik,
      //               AkrushikLR: res.data.landRevenueDemandData[0].jmAkrushik,
      //               addlLandRevenue: res.data.landRevenueDemandData[0].addlLandRevenue,
      //               educationalCess: res.data.landRevenueDemandData[0].educationalCess,
      //               addlEducationalCess: res.data.landRevenueDemandData[0].addlEducationalCess,
      //               employeeGuaranteeScheme:
      //                 res.data.landRevenueDemandData[0].employeeGuaranteeScheme,
      //               TotalDemand: res.data.landRevenueDemandData[0].netAmount,
      //               DDAmount: res.data.landRevenueDemandData[0].netAmount,
      //               chequeAmount: res.data.landRevenueDemandData[0].netAmount,
      //               preYearTotal:
      //                 res.data.landRevenueDemandData[0].preYearPendingAddlEducationalCess +
      //                 res.data.landRevenueDemandData[0].preYearPendingAddlLandRevenue +
      //                 res.data.landRevenueDemandData[0].preYearPendingEducationalCess +
      //                 res.data.landRevenueDemandData[0].preYearPendingEmployeeGuaranteeScheme +
      //                 res.data.landRevenueDemandData[0].preYearPendingGp +
      //                 res.data.landRevenueDemandData[0].preYearPendingJm +
      //                 res.data.landRevenueDemandData[0].preYearPendingZp +
      //                 res.data.landRevenueDemandData[0].preYearPendingNaCess +
      //                 res.data.landRevenueDemandData[0].preYearSankirnJmWith +
      //                 res.data.landRevenueDemandData[0].preYearSankirnJmWithout +
      //                 res.data.landRevenueDemandData[0].preYearNoticeFee,
      //               localCessAmount:
      //                 res.data.landRevenueDemandData[0].jmSankirn +
      //                 res.data.landRevenueDemandData[0].gpSankirn +
      //                 res.data.landRevenueDemandData[0].zpSankirn,
      //               otherLocalCessAmount: res.data.landRevenueDemandData[0].jmSankirn,
      //               noticeAmount: res.data.landRevenueDemandData[0].noticeAmount,
      //             },
      //             // console.log(
      //             //   'form setfield khataOwnerName',
      //             //   res.data.landRevenueDemandData[0].khataOwnerName,
      //             // ),
      //             // console.log('form setfield ZP', res.data.landRevenueDemandData[0].ZP),
      //           );
      //         }
      //       }
      //     },
      //   );
      // }
      //-----new 12June 2024 abhishek tushar
      else if (radiovalue === 'Land Revenue') {
        sendRequest(
          `${URLS.BaseURL}/landRevenue/getLrDtlByKhataNoAndKhataOwnerName`,
          'POST',
          article,
          (res) => {
            // console.log('res', res.data.landRevenueDemandData);
            if (res.data.length === 0) {
              message.info(`${textInput} या खात्याची मागणी निश्चिती झालेली नाही `);
              setTest({});
              form.resetFields();
            } else if (res.data.landRevenueDemandData[0].netAmount <= 0) {
              message.info(`${textInput} या खात्याची आकारणी '0' असल्यामुळे पावती तयार होणार नाही `);
            } else if (
              res.data.landRevenueDemandData.length == 1 &&
              res.data.landRevenueDemandData[0].receiptNo
            ) {
              message.info(` ${textInput} या खात्याची पावती आधीच तयार झालेली आहे`);
            } else {
              let index = res.data.landRevenueDemandData.findIndex((u) => u.receiptNo == '');

              if (index == -1) {
                // console.info('if 3 block method', index);
                message.info(` ${textInput} या खात्याची पावती आधीच तयार झालेली आहे`);
              } else {
                // console.info('else 3 block method', index);
                setTest(
                  {
                    id: res.data.landRevenueDemandData[index].id,
                    khataNo: res.data.landRevenueDemandData[index].khataNo,
                    khataOwnerName: res.data.landRevenueDemandData[index].khataOwnerName,
                    NameofTenent: res.data.landRevenueDemandData[index].NameofTenent,
                    surveyHissaNo: res.data.landRevenueDemandData[index].surveyHissaNo,
                    LR:
                      // res.data.landRevenueDemandData[index].jmBindumala +
                      // res.data.landRevenueDemandData[index].jmDumala,
                      res.data.landRevenueDemandData[index].jmBindumala +
                      res.data.landRevenueDemandData[index].jmDumala -
                      res.data.landRevenueDemandData[index].jmVajasut,
                    ZP:
                      // res.data.landRevenueDemandData[index].assessment < 5
                      res.data.landRevenueDemandData[index].jmBindumala < 5
                        ? res.data.landRevenueDemandData[index].zpAkrushik + res.data.landRevenueDemandData[index].zpDumala
                        : res.data.landRevenueDemandData[index].zpAkrushik +
                        res.data.landRevenueDemandData[index].zpBindumala +
                        res.data.landRevenueDemandData[index].zpDumala
                        - res.data.landRevenueDemandData[index].zpVajasut,
                    VP:
                      // res.data.landRevenueDemandData[index].assessment < 5
                      res.data.landRevenueDemandData[index].jmBindumala < 5
                        ? res.data.landRevenueDemandData[index].gpAkrushik+ res.data.landRevenueDemandData[index].gpDumala
                        : res.data.landRevenueDemandData[index].gpAkrushik +
                        res.data.landRevenueDemandData[index].gpBindumala +
                        res.data.landRevenueDemandData[index].gpDumala - res.data.landRevenueDemandData[index].gpVajasut,
                   AkrushikLR: res.data.landRevenueDemandData[index].jmAkrushik,

                        
                    //zpAmount: test.zpAkrushik,
                    // gvAmount: test.gpAkrushik,
                    // lrAmountAkrushik: test.jmAkrushik,
                    //-----New---
                    zpAkrushik: res.data.landRevenueDemandData[index].zpAkrushik,
                    gpAkrushik: res.data.landRevenueDemandData[index].gpAkrushik,
                    jmAkrushik: res.data.landRevenueDemandData[index].jmAkrushik,

                    addlLandRevenue: res.data.landRevenueDemandData[index].addlLandRevenue,
                    educationalCess: res.data.landRevenueDemandData[index].educationalCess,
                    addlEducationalCess: res.data.landRevenueDemandData[index].addlEducationalCess,
                    employeeGuaranteeScheme:
                      res.data.landRevenueDemandData[index].employeeGuaranteeScheme,
                    TotalDemand: res.data.landRevenueDemandData[index].netAmount,
                    DDAmount: res.data.landRevenueDemandData[index].netAmount,
                    chequeAmount: res.data.landRevenueDemandData[index].netAmount,
                    preYearTotal:
                      res.data.landRevenueDemandData[index].preYearPendingAddlEducationalCess +
                      res.data.landRevenueDemandData[index].preYearPendingAddlLandRevenue +
                      res.data.landRevenueDemandData[index].preYearPendingEducationalCess +
                      res.data.landRevenueDemandData[index].preYearPendingEmployeeGuaranteeScheme +
                      res.data.landRevenueDemandData[index].preYearPendingGp +
                      res.data.landRevenueDemandData[index].preYearPendingJm +
                      res.data.landRevenueDemandData[index].preYearPendingZp +
                      res.data.landRevenueDemandData[index].preYearPendingNaCess +
                      res.data.landRevenueDemandData[index].preYearSankirnJmWith +
                      res.data.landRevenueDemandData[index].preYearSankirnJmWithout +
                      res.data.landRevenueDemandData[index].preYearNoticeFee,
                    localCessAmount: res.data.landRevenueDemandData[index].localCess,
                    otherLocalCessAmount: res.data.landRevenueDemandData[index].otherLocalCess,
                    noticeAmount: res.data.landRevenueDemandData[index].noticeAmount,
                    jmVajasut: res.data.landRevenueDemandData[index].jmVajasut,
                    zpVajasut: res.data.landRevenueDemandData[index].zpVajasut,
                    gpVajasut: res.data.landRevenueDemandData[index].gpVajasut, 
                  },
                  // console.log(
                  //   'res khataOwnerName',
                  //   res.data.landRevenueDemandData[0].khataOwnerName,
                  // ),
                );
                setSelectorState(true);

                form.setFieldsValue(
                  // console.log('res khataOwnerName', res.data[0].khataOwnerName),

                  {
                    id: res.data.landRevenueDemandData[index].id,
                    khataNo: res.data.landRevenueDemandData[index].khataNo,
                    khataOwnerName: res.data.landRevenueDemandData[index].khataOwnerName,
                    NameofTenent: res.data.landRevenueDemandData[index].NameofTenent,
                    surveyHissaNo: res.data.landRevenueDemandData[index].surveyHissaNo,
                    LR:
                      // res.data.landRevenueDemandData[index].jmBindumala <= 5
                      //   ? 0
                      //   : res.data.landRevenueDemandData[index].jmBindumala +
                      //     res.data.landRevenueDemandData[index].jmDumala,
                      //----------new
                      res.data.landRevenueDemandData[index].jmBindumala +
                      res.data.landRevenueDemandData[index].jmDumala -
                      res.data.landRevenueDemandData[index].jmVajasut,
                    ZP:
                      // res.data.landRevenueDemandData[index].assessment < 5
                      res.data.landRevenueDemandData[index].jmBindumala < 5
                        ? res.data.landRevenueDemandData[index].zpAkrushik + res.data.landRevenueDemandData[index].zpDumala

                        : res.data.landRevenueDemandData[index].zpAkrushik +
                        res.data.landRevenueDemandData[index].zpBindumala +
                        res.data.landRevenueDemandData[index].zpDumala
                        - res.data.landRevenueDemandData[index].zpVajasut,

// 31-12-2025 before

        //  : res.data.landRevenueDemandData[index].zpAkrushik +
        //                 res.data.landRevenueDemandData[index].zpBindumala +
        //                 res.data.landRevenueDemandData[index].zpDumala,



                    // res.data.landRevenueDemandData[index].zpBindumala +
                    // res.data.landRevenueDemandData[index].zpDumala +
                    // res.data.landRevenueDemandData[index].zpAkrushik,
                    //----------new
                    VP:
                      // res.data.landRevenueDemandData[index].assessment < 5
                      res.data.landRevenueDemandData[index].jmBindumala < 5
                        ? res.data.landRevenueDemandData[index].gpAkrushik + res.data.landRevenueDemandData[index].gpDumala
                        : res.data.landRevenueDemandData[index].gpAkrushik +
                        res.data.landRevenueDemandData[index].gpBindumala +
                        res.data.landRevenueDemandData[index].gpDumala - res.data.landRevenueDemandData[index].gpVajasut,


                        // before 31-12-2025
                        //  : res.data.landRevenueDemandData[index].gpAkrushik +
                        // res.data.landRevenueDemandData[index].gpBindumala +
                        // res.data.landRevenueDemandData[index].gpDumala ,


                    // res.data.landRevenueDemandData[index].gpBindumala +
                    // res.data.landRevenueDemandData[index].gpDumala +
                    // res.data.landRevenueDemandData[index].gpAkrushik,
                    AkrushikLR: res.data.landRevenueDemandData[index].jmAkrushik,

                    //-----New---
                    zpAkrushik: res.data.landRevenueDemandData[index].zpAkrushik,
                    gpAkrushik: res.data.landRevenueDemandData[index].gpAkrushik,
                    jmAkrushik: res.data.landRevenueDemandData[index].jmAkrushik,
                    addlLandRevenue: res.data.landRevenueDemandData[index].addlLandRevenue,
                    educationalCess: res.data.landRevenueDemandData[index].educationalCess,
                    addlEducationalCess: res.data.landRevenueDemandData[index].addlEducationalCess,
                    employeeGuaranteeScheme:
                      res.data.landRevenueDemandData[index].employeeGuaranteeScheme,
                    TotalDemand: res.data.landRevenueDemandData[index].netAmount,
                    DDAmount: res.data.landRevenueDemandData[index].netAmount,
                    chequeAmount: res.data.landRevenueDemandData[index].netAmount,
                    preYearTotal:
                      res.data.landRevenueDemandData[index].preYearPendingAddlEducationalCess +
                      res.data.landRevenueDemandData[index].preYearPendingAddlLandRevenue +
                      res.data.landRevenueDemandData[index].preYearPendingEducationalCess +
                      res.data.landRevenueDemandData[index].preYearPendingEmployeeGuaranteeScheme +
                      res.data.landRevenueDemandData[index].preYearPendingGp +
                      res.data.landRevenueDemandData[index].preYearPendingJm +
                      res.data.landRevenueDemandData[index].preYearPendingZp +
                      res.data.landRevenueDemandData[index].preYearPendingNaCess +
                      res.data.landRevenueDemandData[index].preYearSankirnJmWith +
                      res.data.landRevenueDemandData[index].preYearSankirnJmWithout +
                      res.data.landRevenueDemandData[index].preYearNoticeFee,
                    localCessAmount:
                      res.data.landRevenueDemandData[index].jmSankirn +
                      res.data.landRevenueDemandData[index].gpSankirn +
                      res.data.landRevenueDemandData[index].zpSankirn,
                    otherLocalCessAmount: res.data.landRevenueDemandData[index].otherLocalCessAmount || 0,
                    noticeAmount: res.data.landRevenueDemandData[index].noticeAmount,
                  },
                  // console.log(
                  //   'form setfield khataOwnerName',
                  //   res.data.landRevenueDemandData[0].khataOwnerName,
                  // ),
                  // console.log('form setfield ZP', res.data.landRevenueDemandData[0].ZP),
                );
              }
            }
          },
        );
      } else if (mainRadiovalue === 'maktaNumber') {
        sendRequest(
          `${URLS.BaseURL}/form17/getReceiptDetailByMaktaKhataNoAndMaktakhataOwnerName`,
          'POST',
          article,
          (res) => {
            setTest({
              id: res.data.form17Data[0].id,
              revenueYear: res.data.form17Data[0].revenueYear,
              districtCode: res.data.form17Data[0].districtCode,
              talukaCode: res.data.form17Data[0].talukaCode,
              cCode: res.data.form17Data[0].cCode,
              khataNo:
                res.data.form17Data[0].khataNo == null
                  ? res.data.form17Data[0].makhtaKhataNo
                  : res.data.form17Data[0].khataNo,
              makhtaKhataNo: res.data.form17Data[0].makhtaKhataNo,
              khataOwnerName: res.data.form17Data[0].personLiable,
              NameofTenent: res.data.form17Data[0].NameofTenent,
              surveyHissaNo: res.data.form17Data[0].surveyHissaNo,
              totalArea: res.data.form17Data[0].totalArea,
              uomOfTotalArea: res.data.form17Data[0].uomOfTotalArea,
              caseNo: res.data.form17Data[0].caseNo,
              areaAffected: res.data.form17Data[0].areaAffected,
              uomOfAreaAffected: res.data.form17Data[0].uomOfAreaAffected,
              natureOfCase: res.data.form17Data[0].natureOfCase,
              periodIfMoreThanOneYear: res.data.form17Data[0].periodIfMoreThanOneYear,
              periodFromDate: res.data.form17Data[0].periodFromDate,
              periodToDate: res.data.form17Data[0].periodToDate,
              localCess: res.data.form17Data[0].localCess,
              localCessAmount: res.data.form17Data[0].assessment - res.data.form17Data[0].otherLocalCessAmount,
              otherLocalCess: res.data.form17Data[0].otherLocalCess,
              otherLocalCessDesc: res.data.form17Data[0].otherLocalCessDesc,
              otherLocalCessAmount: res.data.form17Data[0].otherLocalCessAmount,
              // LR: res.data.form17Data[0].amountOfJm,
              // ZP: res.data.form17Data[0].amountOfZp,
              // VP: res.data.form17Data[0].amountOfGp,
              LR: 0,
              ZP: 0,
              VP: 0,
              jmSankirn: res.data.form17Data[0].amountOfJm,
              zpSankirn: res.data.form17Data[0].amountOfZp,
              gpSankirn: res.data.form17Data[0].amountOfGp,
              TotalDemand: res.data.form17Data[0].assessment,
              DDAmount: res.data.form17Data[0].assessment,
              chequeAmount: res.data.form17Data[0].assessment,
              addlLandRevenue: 0,
              educationalCess: 0,
              addlEducationalCess: 0,
              employeeGuaranteeScheme: 0,
              remarks: res.data.form17Data[0].remarks,
              isAmountPaid: res.data.form17Data[0].isAmountPaid,
              demandGenerated: res.data.form17Data[0].demandGenerated,
              khataType: res.data.form17Data[0].khataType,
              //---Form area 0
              totalArea: res.data.form17Data[0].totalArea,
            });
            setSelectorState(true);
            form.setFieldsValue({
              id: res.data.form17Data[0].id,
              khataNo: res.data.form17Data[0].khataNo,
              makhtaKhataNo: res.data.form17Data[0].makhtaKhataNo,
              khataOwnerName: res.data.form17Data[0].personLiable,
              NameofTenent: res.data.form17Data[0].NameofTenent,
              localCess: res.data.form17Data[0].localCess,
              localCessAmount: res.data.form17Data[0].localCessAmount,
              // localCessAmount: res.data.form17Data[0].localCessAmount,

              otherLocalCess: res.data.form17Data[0].otherLocalCess,
              otherLocalCessDesc: res.data.form17Data[0].otherLocalCessDesc,
              otherLocalCessAmount: res.data.form17Data[0].otherLocalCessAmount,
              LR: 0,
              ZP: 0,
              VP: 0,
              TotalDemand: res.data.form17Data[0].assessment,
              DDAmount: res.data.form17Data[0].assessment,
              chequeAmount: res.data.form17Data[0].assessment,
              addlLandRevenue: 0,
              educationalCess: 0,
              addlEducationalCess: 0,
              employeeGuaranteeScheme: 0,
            });
          },
          (err) => {
            message.error('Data Not Found');
          },
        );
      }
    }
  };


  const handleClick = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      await onFinish();
    } finally {
      setIsLoading(false);
    }
  };
  const onFinish = async (values, value) => {
    //console.log(lgd,'----lgdCode----');
    // e.preventDefault();
    // setPrintIsVisible(!printIsVisible);
    // console.log('test+++++++++++++++++++++', form.getFieldValue('chequeDate'));
    var inputstartdate = moment(form.getFieldValue('chequeDate'), 'DD-MMMM-YYYY').format(
      'MM/DD/YYYY',
    );
    // console.log('Dd amount', test.DDamount, test.chequeAmount);
    // form.validateFields((error, values) => {
    //   if (error) {
    //     console.log('error while validating');
    //   } else if (values) {
    //     console.log('oooname: ', values.LR, 'email: ', values.ZP);
    //   }
    // });
    setIsLoading(true);

    console.log(test, "---test---");

    if (test) {
      console.log(test.LR, 'before test.LR')
      console.log(test.ZP, 'after test.ZP')
      console.log(test.VP, 'after test.VP')




let calculateTotal = 
  (test.LR || 0) + 
  (test.ZP || 0) + 
  (test.VP || 0) + 
  (test.AkrushikLR || 0) +
  (test.addlLandRevenue || 0) + 
  (test.educationalCess || 0) + 
  (test.addlEducationalCess || 0) +
  (test.employeeGuaranteeScheme || 0) + 
  (test.localCessAmount || 0) +
  (test.otherLocalCessAmount || 0) + 
  (test.preYearTotal || 0) + 
  (test.noticeAmount || 0)  ;



// before 31-12-2025

// let calculateTotal = 
//   (test.LR || 0) + 
//   (test.ZP || 0) + 
//   (test.VP || 0) + 
//   (test.AkrushikLR || 0) +
//   (test.addlLandRevenue || 0) + 
//   (test.educationalCess || 0) + 
//   (test.addlEducationalCess || 0) +
//   (test.employeeGuaranteeScheme || 0) + 
//   (test.localCessAmount || 0) +
//   (test.otherLocalCessAmount || 0) + 
//   (test.preYearTotal || 0) + 
//   (test.noticeAmount || 0) ;



  console.log(test.LR , test.ZP , test.VP , test.AkrushikLR ,test.addlLandRevenue , test.educationalCess , test.addlEducationalCess , test.employeeGuaranteeScheme , test.localCessAmount , test.otherLocalCessAmount , test.preYearTotal , test.noticeAmount,"all values")
  console.log(calculateTotal,"calculateTotal before round")

  calculateTotal = Math.round(calculateTotal);
console.log(calculateTotal,"calculateTotal")
console.log(test.TotalDemand,"test.TotalDemand")
if (test.TotalDemand !== calculateTotal) {
  message.error("कृपया पुन्हा एकदा शोधा कारण आकारणी मध्ये बदल झाला आहे");
  console.log("कृपया पुन्हा एकदा शोधा कारण आकारणी मध्ये बदल झाला आहे");
  setIsLoading(false);
  return;  // stops execution of entire function
}

    }

    const article = {
      id: form.getFieldValue('id'),
      landReceiveForm17Id: test.landReceiveForm17Id,
      cCode: codeVillage,
      lgdCode: lGDCode,
      //lgdCode: lgd,
      khataNo: test.khataNo,
      revenueYear: revenueYear,
      jmSankirn: test.localCessAmount,
      zpSankirn: test.otherLocalCessAmount,
      netAmount: test.TotalDemand,
      modeOfPayment: form.getFieldValue('ModeOfPayment'),
      ddName: form.getFieldValue('DDBankName'),
      ddBranch: form.getFieldValue('DDBranch'),
      ddNumber: form.getFieldValue('DDNumber'),
      ddDate: form.getFieldValue('DDDate'),
      ddAmount: form.getFieldValue('DDAmount'),
      chequeName: form.getFieldValue('chequeBankName'),
      chequeBranch: form.getFieldValue('chequeBranch'),
      chequeNumber: form.getFieldValue('chequeNumber'),
      chequeAmount: form.getFieldValue('chequeAmount'),
      chequeDate: form.getFieldValue('chequeDate'),
    };

    if (radiovalue === 'Land Revenue') {
      // console.log('Value in Test', test);
      sendRequest(
        `${URLS.BaseURL}/landRevenue/lrReceiptMoneyFromCustomer`,
        'PATCH',
        article,
        (responseForPrint) => {
          // setloading(false);
          // console.log('+++++Status+++++++', responseForPrint.status);
          // console.log('data saved', responseForPrint.data.khataNo, responseForPrint.data.lrAmount);
          const formattedDate = moment(responseForPrint.receiptDate).format('DD-MM-YYYY');
          const dateCreate = moment().format('DD-MM-YYYY hh:mm:ss');
          const chequeDate = moment(responseForPrint.data.chequeDate).format('DD-MM-YYYY');
          const ddDate = moment(responseForPrint.data.ddDate).format('DD-MM-YYYY');
          // console.log('landReceiveDemandId ==>', responseForPrint.data);
          history.push({
            pathname: '/transactions/receiptPrint',
            state: {
              district: districtName,
              taluka: talukaName,
              village: textVillage,
              revenueYear: revenueYear,
              khataNo: test.khataNo,
              khataownerName: test.khataOwnerName,
              NameofTenent: test.NameofTenent,
              lrAmount: test.LR,
              zpAmount: test.ZP,
              gvAmount: test.VP,
              lrAmountAkrushik: test.AkrushikLR,
              addlLandRevenue: test.addlLandRevenue,
              educationalCess: test.educationalCess,
              addlEducationalCess: test.addlEducationalCess,
              employeeGuaranteeScheme: test.employeeGuaranteeScheme,
              localCessAmount: test.localCessAmount,
              otherLocalCessAmount: test.otherLocalCessAmount,
              netAmountReceived: test.TotalDemand,

              modeOfPayment: responseForPrint.data.modeOfPayment,
              ddName: form.getFieldValue('DDBankName'),
              ddBranch: form.getFieldValue('DDBranch'),
              ddNumber: form.getFieldValue('DDNumber'),
              ddDate: moment(form.getFieldValue('DDDate')).format('DD/MM/YYYY'),
              ddAmount: form.getFieldValue('DDAmount'),
              chequeName: form.getFieldValue('chequeBankName'),
              chequeBranch: form.getFieldValue('chequeBranch'),
              chequeNumber: form.getFieldValue('chequeNumber'),
              chequeAmount: form.getFieldValue('chequeAmount'),
              chequeDate: moment(form.getFieldValue('chequeDate')).format('DD/MM/YYYY'),
              // modeOfPayment: responseForPrint.data.modeOfPayment,
              // ddName: responseForPrint.data.ddName,
              // ddBranch: responseForPrint.data.ddBranch,
              // ddNumber: responseForPrint.data.ddNumber,
              // ddDate: ddDate,
              // ddAmount: responseForPrint.data.netAmount ,
              // chequeName: responseForPrint.data.chequeName,
              // chequeBranch: responseForPrint.data.chequeBranch,
              // chequeAmount: responseForPrint.data.netAmount ,
              // chequeNumber: responseForPrint.data.chequeNumber,
              // chequeDate: chequeDate,

              receiptNo: responseForPrint.data.receiptNo,
              receiptDate: formattedDate,
              AmountInWords: toWords.convert(test.TotalDemand),
              noticeAmount: responseForPrint.data.noticeAmount,
              preYearTotal: test.preYearTotal,
              surveyHissaNo: test.surveyHissaNo,
            },
          });
          setIsLoading(false);
          if (responseForPrint.status === 500) {
            message.success('Receipt Already Exists');
            setIsLoading(false);
          }
        },
      );
    }

    const inputParamsIfIsForm17Khata = {
      id: test.id,
      lgdCode: lGDCode,
      //lgdCode: lgd,
      landReceiveForm17Id: test.landReceiveForm17Id,
      revenueYear: test.revenueYear,
      districtCode: test.districtCode,
      talukaCode: test.talukaCode,
      cCode: test.cCode,
      khataNo: test.khataNo,
      area: test.area,
      //makhtaKhataNo: test.makhtaKhataNo,
      khataOwnerName: test.khataOwnerName,
      NameofTenent: test.NameofTenent,
      uom: test.uom,
      surveyHissaNo: test.surveyHissaNo,
      lrAmount: test.LR,
      zpAmount: test.ZP,
      gvAmount: test.VP,
      lrAmountAkrushik: test.AkrushikLR,
      addLandRevenue: test.addlLandRevenue,
      educational_cess: test.educationalCess,
      addlEducationalCess: test.addlEducationalCess,
      employeeGuaranteeScheme: test.employeeGuaranteeScheme,
      jmSankirn: test.jmSankirn,
      zpSankirn: test.zpSankirn,
      gpSankirn: test.gpSankirn,
      netAmount: test.TotalDemand,
      modeOfPayment: form.getFieldValue('ModeOfPayment'),
      ddName: form.getFieldValue('DDBankName'),
      ddBranch: form.getFieldValue('DDBranch'),
      ddNumber: form.getFieldValue('DDNumber'),
      ddDate: form.getFieldValue('DDDate'),
      ddAmount: form.getFieldValue('DDAmount'),
      chequeName: form.getFieldValue('chequeBankName'),
      chequeBranch: form.getFieldValue('chequeBranch'),
      chequeNumber: form.getFieldValue('chequeNumber'),
      chequeAmount: form.getFieldValue('chequeAmount'),
      chequeDate: form.getFieldValue('chequeDate'),
    };

    if (mainRadiovalue === 'khataNumber') {
      // console.log('id====>>>', inputParamsIfIsForm17Khata.id);
      sendRequest(
        `${URLS.BaseURL}/landRevenue/persistSankirn`,
        'POST',
        inputParamsIfIsForm17Khata,
        (responseForPrint) => {
          const formattedDate = moment(responseForPrint.receiptDate).format('DD-MM-YYYY');
          const dateCreate = moment().format('DD-MM-YYYY hh:mm:ss');
          const chequeDate = moment(responseForPrint.data.chequeDate).format('DD-MM-YYYY');
          const ddDate = moment(responseForPrint.data.ddDate).format('DD-MM-YYYY');
          if (responseForPrint.status === 201) {
            history.push({
              pathname: '/transactions/receiptPrint',
              state: {
                district: districtName,
                taluka: talukaName,
                village: textVillage,
                revenueYear: revenueYear,
                khataNo: responseForPrint.data.khataNo,
                khataownerName: responseForPrint.data.khataOwnerName,
                NameofTenent: responseForPrint.data.NameofTenent,
                lrAmount: test.LR,
                zpAmount: test.ZP,
                gvAmount: test.VP,
                lrAmountAkrushik: test.AkrushikLR,
                addlLandRevenue: 0,
                educationalCess: 0,
                addlEducationalCess: 0,
                employeeGuaranteeScheme: 0,
                localCessAmount: test.localCessAmount,
                otherLocalCessAmount: test.otherLocalCessAmount,
                netAmountReceived: responseForPrint.data.netAmount,
                modeOfPayment: responseForPrint.data.modeOfPayment,
                chequeName: responseForPrint.data.chequeName,
                ddName: responseForPrint.data.ddName,
                chequeAmount: responseForPrint.data.netAmount,
                ddAmount: responseForPrint.data.netAmount,
                ddBranch: responseForPrint.data.ddBranch,
                chequeBranch: responseForPrint.data.chequeBranch,
                ddDate: ddDate,
                chequeDate: chequeDate,
                chequeNumber: responseForPrint.data.chequeNumber,
                ddNumber: responseForPrint.data.ddNumber,
                receiptNo: responseForPrint.data.receiptNo,
                receiptDate: formattedDate,
                AmountInWords: toWords.convert(responseForPrint.data.netAmount),
                noticeAmount: 0,
                preYearTotal: 0,
                surveyHissaNo: responseForPrint.data.surveyHissaNo,
              },
            });
          }
          setIsLoading(false);
        },
        setIsLoading(false),
      );
    }
    if (mainRadiovalue === 'maktaNumber') {
      const inputParamsIfIsForm17Makta = {
        lgdCode: lGDCode,
        //lgdCode: lgd,
        landReceiveForm17Id: test.id,
        revenueYear: test.revenueYear,
        districtCode: test.districtCode,
        talukaCode: test.talukaCode,
        cCode: test.cCode,
        //khataNo: test.khataNo,
        makhtaKhataNo: test.makhtaKhataNo,
        khataOwnerName: test.khataOwnerName,
        NameofTenent: test.NameofTenent,
        //area: test.area,
        area: test.totalArea,
        uom: test.uom,
        surveyHissaNo: test.surveyHissaNo,
        lrAmount: test.LR,
        zpAmount: test.ZP,
        gvAmount: test.VP,
        lrAmountAkrushik: test.AkrushikLR,

        addLandRevenue: test.addlLandRevenue,
        educational_cess: test.educationalCess,
        addlEducationalCess: test.addlEducationalCess,
        employeeGuaranteeScheme: test.employeeGuaranteeScheme,
        jmSankirn: test.jmSankirn,
        zpSankirn: test.zpSankirn,
        gpSankirn: test.gpSankirn,
        netAmount: test.TotalDemand,
        modeOfPayment: form.getFieldValue('ModeOfPayment'),
        ddName: form.getFieldValue('DDBankName'),
        ddBranch: form.getFieldValue('DDBranch'),
        ddNumber: form.getFieldValue('DDNumber'),
        ddDate: form.getFieldValue('DDDate'),
        ddAmount: form.getFieldValue('DDAmount'),
        chequeName: form.getFieldValue('chequeBankName'),
        chequeBranch: form.getFieldValue('chequeBranch'),
        chequeNumber: form.getFieldValue('chequeNumber'),
        chequeAmount: form.getFieldValue('chequeAmount'),
        chequeDate: form.getFieldValue('chequeDate'),
      };
      // console.log('id====>>>', inputParamsIfIsForm17Makta.id);

      sendRequest(
        `${URLS.BaseURL}/landRevenue/persistSankirn`,
        'POST',
        inputParamsIfIsForm17Makta,
        (responseForPrint) => {
          const formattedDate = moment(responseForPrint.receiptDate).format('DD-MM-YYYY');
          const dateCreate = moment().format('DD-MM-YYYY hh:mm:ss');
          const chequeDate = moment(responseForPrint.data.chequeDate).format('DD-MM-YYYY');
          const ddDate = moment(responseForPrint.data.ddDate).format('DD-MM-YYYY');

          if (responseForPrint.status === 201) {
            history.push({
              pathname: '/transactions/receiptPrint',
              state: {
                district: districtName,
                taluka: talukaName,
                village: textVillage,
                revenueYear: revenueYear,
                //  khataNo: responseForPrint.data.khataNo,
                makhtaKhataNo: responseForPrint.data.makhtaKhataNo,
                khataownerName: responseForPrint.data.khataOwnerName,
                NameofTenent: responseForPrint.data.NameofTenent,
                lrAmount: test.LR,
                zpAmount: test.ZP,
                gvAmount: test.VP,
                lrAmountAkrushik: test.AkrushikLR,

                addlLandRevenue: 0,
                educationalCess: 0,
                addlEducationalCess: 0,
                employeeGuaranteeScheme: 0,
                localCessAmount: test.localCessAmount,
                otherLocalCessAmount: test.otherLocalCessAmount,
                netAmountReceived: responseForPrint.data.netAmount,
                modeOfPayment: responseForPrint.data.modeOfPayment,
                chequeName: responseForPrint.data.chequeName,
                ddName: responseForPrint.data.ddName,
                chequeAmount: responseForPrint.data.netAmount,
                ddAmount: responseForPrint.data.netAmount,
                ddBranch: responseForPrint.data.ddBranch,
                chequeBranch: responseForPrint.data.chequeBranch,
                ddDate: ddDate,
                chequeDate: chequeDate,
                chequeNumber: responseForPrint.data.chequeNumber,
                ddNumber: responseForPrint.data.ddNumber,
                receiptNo: responseForPrint.data.receiptNo,
                receiptDate: formattedDate,
                AmountInWords: toWords.convert(responseForPrint.data.netAmount),
                noticeAmount: 0,
                preYearTotal: 0,
                surveyHissaNo: responseForPrint.data.surveyHissaNo,
              },
            });
          }
          setIsLoading(false);
        },
        setIsLoading(false),
      );
    }
  };

  const onChangeRadioButton = (e) => {
    // console.log('radio checked', e.target.value);
    setRadioValue(e.target.value);
    form.resetFields();
    setTest({});
  };

  const onChangeRadioButton2 = (e) => {
    setMainRadioValue(e.target.value);
    form.resetFields();
    setTest({});
  };

  const handleChange = (event) => {
    setTextInput(event.target.value);
  };

  return (
    <PageContainer>
      <Card>
        <Row style={{ marginBottom: 10 }}>
          <Col span={24}>
            <VillageSelector
              pageType="withYear"
              setCodeVillage={setCodeVillage}
              setTextForVillage={setTextVillage}
              onVillageChange={setFlagButton}
              yearChange={setRevenueYear}
              setIsNirank={setIsNirank}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={24} sm={24} md={6} lg={6} xl={6}>
            <Input.Group compact>
              <Select
                defaultValue={'खाता क्रमांक'}
                onChange={(e) => {
                  setKhataMakhtaOwner(e);
                  setTextInput('');
                  form.resetFields();
                }}
                style={{ width: '130px' }}
              >
                <Select.Option value="khataNo">खाता क्रमांक</Select.Option>
                {/* <Select.Option value="makhtaKhataNo">MaktaKhata No</Select.Option> */}
                <Select.Option value="khataOwnerName">खातेदाराचे नाव</Select.Option>
              </Select>
              <Input
                style={{ width: '150px' }}
                onChange={handleChange} /* value={totalAreaInUOM} */
                onKeyPress={KeyPressEvents.isInputVarchar}
              />
            </Input.Group>

            {/* <Input
              addonBefore={<FormattedMessage id="villageForm17.table.khataNo" />}
              name="khataNo"
              onChange={handleChange}
              rules={[{ required: true, message: 'Please Enter Khata Number!!' }]}
              //   style={{ marginTop: 10, width: 225 }}
              maxLength={35}
              onKeyPress={KeyPressEvents.isInputNumber}
            ></Input> */}
          </Col>
          <Col span={1}></Col>
          <Col xs={24} sm={24} md={14} lg={14} xl={14}>
            <Radio.Group
              onChange={onChangeRadioButton}
              value={radiovalue}
              style={{ marginTop: 10 }}
            >
              <Radio value={'Sankirn'}>
                <FormattedMessage id="transactionCommon.table.sankirn" />
              </Radio>
              <Radio value={'Land Revenue'}>
                <FormattedMessage id="transactionCommon.table.landRevenueMaganiPavti" />
              </Radio>
            </Radio.Group>
          </Col>
          <Col xs={24} sm={24} md={2} lg={2} xl={2}>
            <Button
              type="primary"
              style={{ marginTop: 10 }}
              loading={searchLoading[0]}
              onClick={() => {
                if (textVillage && revenueYear && textInput && radiovalue) {
                  getConent();
                  enterLoading(0);
                } else if (textVillage == null) {
                  message.info('Please Select Village !');
                } else if (revenueYear == null) {
                  message.info('Please Select Revenue Year !');
                } else if (textInput == null) {
                  message.info('Please Enter Khata Number !');
                } else if (radiovalue == null) {
                  message.info('Please Select Radio Value !');
                }
              }}
            // disabled={flagButton}
            >
              <FormattedMessage id="transactionCommon.table.search" />
            </Button>
          </Col>
        </Row>
        <Row>
          <Col xl={7} lg={7} md={7} sm={24} xs={24}></Col>
          <Col xl={12} lg={12} md={12} sm={24} xs={24}>
            <Radio.Group onChange={(e) => onChangeRadioButton2(e)} value={mainRadiovalue}>
              <Space direction="vertical">
                {/* removed on Date 7 OCT 2024 */}
                {/* {radiovalue === 'Sankirn' ? (
                  <Radio value={'khataNumber'}>
                    <FormattedMessage id="villageForm17.form.khataNo" />
                  </Radio>
                ) : (
                  ''
                )} */}
                {radiovalue === 'Sankirn' ? (
                  <Radio value={'maktaNumber'}>
                    <FormattedMessage id="villageForm17.form.maktaNo" />
                  </Radio>
                ) : (
                  ''
                )}
              </Space>
            </Radio.Group>
          </Col>
          <Col xl={6} lg={6} md={6} sm={24} xs={24}></Col>
        </Row>
      </Card>

      <Card bordered={true} style={{ marginTop: 5 }}>
        <div className="table" style={{ marginTop: 10 }}>
          <Form layout="vertical" name="register" form={form} onFinish={onFinish}>
            {/* <Row style={{ marginLeft: '140px' }}>
              <label htmlFor="">
                <FormattedMessage id="transactionCommon.table.district" /> {districtName}
              </label>
              <label htmlFor="" style={{ paddingLeft: '125px' }}>
                <FormattedMessage id="transactionCommon.table.taluka" /> {talukaName}
              </label>
              <label htmlFor="" style={{ paddingLeft: '125px' }}>
                <FormattedMessage id="transactionCommon.table.village" /> {textVillage}
              </label>
            </Row> */}
            <div className="table" style={{ marginTop: 40 }}>
              <Row>
                {mainRadiovalue == 'maktaNumber' ? (
                  <Col span={11}>
                    <Form.Item
                      label={<FormattedMessage id="villageForm17.form.maktaNo" />}
                      name="makhtaKhataNo"
                    >
                      <Input disabled />
                    </Form.Item>
                  </Col>
                ) : (
                  <Col span={11}>
                    <Form.Item
                      label={<FormattedMessage id="customerView.form.khataNo" />}
                      name="khataNo"
                    >
                      <Input disabled />
                    </Form.Item>
                  </Col>
                )}
              </Row>
              <Row>
                <Col span={11}>
                  <Form.Item
                    label={<FormattedMessage id="transactionCommon.table.khatedarName" />}
                    name="khataOwnerName"
                  >
                    <Input disabled />
                  </Form.Item>
                </Col>
                <Col span={2}></Col>

                <Col span={11}>
                  <Form.Item
                    label={<FormattedMessage id="transactionCommon.table.kulName" />}
                    name="NameofTenent"
                  >
                    <Input disabled />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={11}>
                  <Form.Item label={<FormattedMessage id="customerView.form.lr" />} name="LR">
                    <Input disabled addonAfter={<FormattedMessage id="customerView.form.rs" />} />
                  </Form.Item>
                </Col>
                <Col span={2}></Col>
                <Col span={11}>
                  <Form.Item
                    label={<FormattedMessage id="customerView.form.lr(A)" />}
                    name="AkrushikLR"
                  >
                    <Input disabled addonAfter={<FormattedMessage id="customerView.form.rs" />} />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={11}>
                  <Form.Item label={<FormattedMessage id="customerView.form.zp" />} name="ZP">
                    <Input disabled addonAfter={<FormattedMessage id="customerView.form.rs" />} />
                  </Form.Item>
                </Col>
                <Col span={2}></Col>

                <Col span={11}>
                  <Form.Item label={<FormattedMessage id="customerView.form.vp" />} name="VP">
                    <Input disabled addonAfter={<FormattedMessage id="customerView.form.rs" />} />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={11}>
                  <Form.Item
                    label={<FormattedMessage id="customerView.form.addlLandRevenue" />}
                    name="addlLandRevenue"
                  >
                    <Input disabled addonAfter={<FormattedMessage id="customerView.form.rs" />} />
                  </Form.Item>
                </Col>
                <Col span={2}></Col>

                <Col span={11}>
                  <Form.Item
                    label={<FormattedMessage id="customerView.form.educationalCess" />}
                    name="educationalCess"
                  >
                    <Input disabled addonAfter={<FormattedMessage id="customerView.form.rs" />} />
                  </Form.Item>
                </Col>
              </Row>

              <Row>
                <Col span={11}>
                  <Form.Item
                    label={<FormattedMessage id="customerView.form.addlEducationalCess" />}
                    name="addlEducationalCess"
                  >
                    <Input disabled addonAfter={<FormattedMessage id="customerView.form.rs" />} />
                  </Form.Item>
                </Col>
                <Col span={2}></Col>

                <Col span={11}>
                  <Form.Item
                    label={<FormattedMessage id="customerView.form.aLiable" />}
                    name="localCessAmount"
                  >
                    <Input disabled addonAfter={<FormattedMessage id="customerView.form.rs" />} />
                  </Form.Item>
                </Col>
              </Row>

              <Row>
                <Col span={11}>
                  <Form.Item
                    label={<FormattedMessage id="customerView.form.bLiable" />}
                    name="otherLocalCessAmount"
                  >
                    <Input disabled addonAfter={<FormattedMessage id="customerView.form.rs" />} />
                  </Form.Item>
                </Col>
                <Col span={2}></Col>

                <Col span={11}>
                  <Form.Item
                    label={<FormattedMessage id="customerView.form.egs" />}
                    name="employeeGuaranteeScheme"
                  >
                    <Input disabled addonAfter={<FormattedMessage id="customerView.form.rs" />} />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={11}>
                  <Form.Item label="नोटीस रक्कम" name="noticeAmount">
                    <Input disabled addonAfter={<FormattedMessage id="customerView.form.rs" />} />
                  </Form.Item>
                </Col>
                <Col span={2}></Col>

                <Col span={11}>
                  <Form.Item label="मागील थकबाकी" name="preYearTotal">
                    <Input disabled addonAfter={<FormattedMessage id="customerView.form.rs" />} />
                  </Form.Item>
                </Col>
              </Row>
            </div>

            <Row>
              <Col span={11}>
                <Modeofpayment changeObjHanlder={setModeOfPayment} />
              </Col>
              <Col span={2}></Col>

              <Col span={11}>
                <Form.Item
                  label={<FormattedMessage id="customerView.form.totalPaid" />}
                  name="TotalDemand"
                >
                  <Input disabled addonAfter={<FormattedMessage id="customerView.form.rs" />} />
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={8}>
                {(modeOfPayment === 'Cash' ||
                  modeOfPayment === 'DD' ||
                  modeOfPayment === 'Cheque') &&
                  selectorState && (
                    <Button
                      type="primary"
                      disabled={isLoading}
                      htmlType="submit"
                      style={{ marginRight: 10 }}
                      onClick={handleClick}
                    // changes above onclick
                    >
                      <FormattedMessage id="transactionCommon.table.save" />
                    </Button>
                  )}

                <Button
                  onClick={() => {
                    form.resetFields();
                    setTextInput();
                  }}
                  type="danger"
                  style={{ marginRight: 10 }}
                >
                  <FormattedMessage id="transactionCommon.table.reset" />
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
      </Card>
    </PageContainer>
  );
}

export default ReceiveMoney;
