import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Radio,
  Row,
  Select,
  Space,
} from 'antd';
import Selector from '../common/selector';
import ValidationPatterns from '@/components/eComponents/ValidationPatterns';
import BasicInput from '@/components/eComponents/BasicInput/BasicInput';
import Modeofpayment from '../common/modeofpayment';
import Axios from 'axios';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import BaseURL from '@/URLs/urls';
import VillageSelector from '@/components/eComponents/VillageSelector';
import URLS from '@/URLs/urls';
import useAxios from '@/components/eComponents/use-axios';
import { FormattedMessage } from 'umi';
import { useModel } from 'umi';
import { ToWords } from 'to-words';
import KeyPressEvents from '@/util/KeyPressEvents';
function ReceiptView() {
  //const { districtName, talukaName, districtCode, talukaCode, revenueYear } = useModel('details');
  const [flagButton, setFlagButton] = useState(true);
  const [form] = Form.useForm();
  const [test, setTest] = useState();
  const [textInput, setTextInput] = useState();
  const [isNirank, setIsNirank] = useState(false);
  const [textForVillage, setTextForVillage] = useState();
  const [village, setVillage] = useState([]);
  const [codeVillage, setCodeVillage] = useState('');
  const [radiovalue, setRadioValue] = useState();
  const [revenueYear1, setRevenueYear1] = useState('2024-25');
  const [revenueYearLOC, setRevenueYearLOC] = useState();
  const { districtName, talukaName, districtCode, talukaCode } = useModel('details');
  const [revenueYearForVillage, setRevenueYearForVillage] = useState();

  let history = useHistory();
  const { sendRequest } = useAxios();
  const [printButtonState, setPrintButtonState] = useState(true);
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
    getRevenueYear();
  }, []);

  //---Dropdown year logic
  const onYearChange = (value, event) => {
    setRevenueYear1(value);
  };
  const getRevenueYear = async () => {
    sendRequest(`${URLS.BaseURL}/revenueYear/getRevenueYearData`, 'GET', null, (res) => {
      setRevenueYearForVillage(
        res.data.revenueYearData.map((row) => ({
          label: row.revenueYear,
          value: row.revenueYear,
        })),
      );
      // message.success('Records Fetched!!');
    });
  };

  // const handleOnChangeYear = (value, event) => {
  //   setRevenueYear1(event.label);
  //   console.log(value, '------------------------------------------->');
  //   console.log(event.label, '------------------------------------------->');
  // };

  // useEffect(() => {
  //   const result = revenueYear.filter(
  //     (thing, index, self) =>
  //       index === self.findIndex((t) => t.revenueYear === thing.revenueYear && t.id === thing.id),
  //   );
  //   setRevenueYearLOC(
  //     result?.map((row) => ({
  //       label: row.revenueYear,
  //       value: row.id,
  //     })),
  //   );
  // }, []);
  //---Dropdown year logic end
  const onChangeRadioButton = (e) => {
    setRadioValue(e.target.value);
    form.resetFields();
    setTest({});
  };
  const getContent = async () => {
    // setPrintIsVisible(!printIsVisible);
    let article;
    if (textInput !== null && textInput !== undefined && textInput) {
      if (radiovalue === 'maktaNumber') {
        article = {
          districtCode: districtCode,
          talukaCode: talukaCode,
          cCode: codeVillage,
          //revenueYear: revenueYear,
          revenueYear: revenueYear1,
          makhtaKhataNo: textInput,
        };
      } else {
        article = {
          districtCode: districtCode,
          talukaCode: talukaCode,
          cCode: codeVillage,
          //revenueYear: revenueYear,
          revenueYear: revenueYear1,
          khataNo: textInput,
        };
      }

      if (radiovalue === 'khataNumber') {
        sendRequest(
          `${URLS.BaseURL}/landRevenue/getLrDtlByKhataNoAndKhataOwnerName`,
          'POST',
          article,
          (res) => {
            // console.log(res, '---------------Date');
            if (res.status === 202) {
              let assessment1 = Math.round(res.data.landRevenueDemandData[0].assessment);
              // console.log(assessment1, '--------------------assessment1');

              setPrintButtonState(false);
              if (res.data.landRevenueDemandData[0].receiptDateForReceipt != '') {
                setTest({
                  khataNo: res.data.landRevenueDemandData[0].khataNo,
                  LR:
                    // assessment1 <= 5
                    //   ? 0
                    //   : res.data.landRevenueDemandData[0].jmBindumala +
                    //     res.data.landRevenueDemandData[0].jmDumala,
                    res.data.landRevenueDemandData[0].jmBindumala +
                    res.data.landRevenueDemandData[0].jmDumala -
                    res.data.landRevenueDemandData[0].jmVajasut,
                  ZP:
                    // assessment1 <= 5
                    //   ? res.data.landRevenueDemandData[0].zpAkrushik
                    //   : res.data.landRevenueDemandData[0].zpBindumala +
                    //     res.data.landRevenueDemandData[0].zpDumala +
                    //     res.data.landRevenueDemandData[0].zpAkrushik,
                    res.data.landRevenueDemandData[0].jmBindumala < 5
                      ? res.data.landRevenueDemandData[0].zpAkrushik
                      : res.data.landRevenueDemandData[0].zpBindumala +
                        res.data.landRevenueDemandData[0].zpDumala +
                        res.data.landRevenueDemandData[0].zpAkrushik,
                  VP:
                    // assessment1 <= 5
                    //   ? res.data.landRevenueDemandData[0].gpAkrushik
                    //   : res.data.landRevenueDemandData[0].gpBindumala +
                    //     res.data.landRevenueDemandData[0].gpDumala +
                    //     res.data.landRevenueDemandData[0].gpAkrushik,

                    res.data.landRevenueDemandData[0].jmBindumala < 5
                      ? res.data.landRevenueDemandData[0].gpAkrushik
                      : res.data.landRevenueDemandData[0].gpBindumala +
                        res.data.landRevenueDemandData[0].gpDumala +
                        res.data.landRevenueDemandData[0].gpAkrushik,
                  AkrushikLR: res.data.landRevenueDemandData[0].jmAkrushik,

                  addLandRevenue: res.data.landRevenueDemandData[0].addlLandRevenue,
                  educationalCess: res.data.landRevenueDemandData[0].educationalCess,
                  addlEducationalCess: res.data.landRevenueDemandData[0].addlEducationalCess,
                  employeeGuaranteeScheme:
                    res.data.landRevenueDemandData[0].employeeGuaranteeScheme,
                  localCess: res.data.landRevenueDemandData[0].localCess,
                  otherLocalCess: res.data.landRevenueDemandData[0].otherLocalCess,
                  TotalDemand: res.data.landRevenueDemandData[0].netAmount,
                  khataOwnerName: res.data.landRevenueDemandData[0].khataOwnerName,
                  NameofTenent: res.data.landRevenueDemandData[0].NameofTenent,
                  landReceiveDemandId: res.data.landRevenueDemandData[0].id,
                  modeOfPayment: res.data.landRevenueDemandData[0].modeOfPayment,
                  receiptNo: res.data.landRevenueDemandData[0].receiptNo,
                  chequeName: res.data.landRevenueDemandData[0].chequeName,
                  ddName: res.data.landRevenueDemandData[0].ddName,
                  chequeAmount: res.data.landRevenueDemandData[0].chequeAmount,
                  ddAmount: res.data.landRevenueDemandData[0].ddAmount,
                  ddBranch: res.data.landRevenueDemandData[0].ddBranch,
                  chequeBranch: res.data.landRevenueDemandData[0].chequeBranch,
                  netAmount: res.data.landRevenueDemandData[0].netAmount,
                  ddDateForReceipt: moment(
                    res.data.landRevenueDemandData[0].ddDateForReceipt,
                    'YYYY-MM-DD',
                  ).format('DD/MM/YYYY'),
                  chequeDateForReceipt: moment(
                    res.data.landRevenueDemandData[0].chequeDateForReceipt,
                    'YYYY-MM-DD',
                  ).format('DD/MM/YYYY'),
                  chequeNumber: res.data.landRevenueDemandData[0].chequeNumber,
                  ddNumber: res.data.landRevenueDemandData[0].ddNumber,
                  surveyHissaNo: res.data.landRevenueDemandData[0].surveyHissaNo,
                  receiptDateForReceipt: moment(
                    res.data.landRevenueDemandData[0].receiptDateForReceipt,
                    'YYYY-MM-DD',
                  ).format('DD/MM/YYYY'),
                  //receiptDateForReceipt:res.data.landRevenueDemandData[0].receiptDateForReceipt,

                  noticeAmount: res.data.landRevenueDemandData[0].noticeAmount,
                  preYearTotal:
                    res.data.landRevenueDemandData[0].preYearPendingAddlEducationalCess +
                    res.data.landRevenueDemandData[0].preYearPendingAddlLandRevenue +
                    res.data.landRevenueDemandData[0].preYearPendingEducationalCess +
                    res.data.landRevenueDemandData[0].preYearPendingEmployeeGuaranteeScheme +
                    res.data.landRevenueDemandData[0].preYearPendingGp +
                    res.data.landRevenueDemandData[0].preYearPendingJm +
                    res.data.landRevenueDemandData[0].preYearPendingZp +
                    res.data.landRevenueDemandData[0].preYearPendingNaCess +
                    res.data.landRevenueDemandData[0].preYearSankirnJmWith +
                    res.data.landRevenueDemandData[0].preYearSankirnJmWithout +
                    res.data.landRevenueDemandData[0].preYearNoticeFee,
                });

                form.setFieldsValue({
                  khataNo: res.data.landRevenueDemandData[0].khataNo,
                  LR:
                    // assessment1 <= 5
                    //   ? 0
                    //   : res.data.landRevenueDemandData[0].jmBindumala +
                    //     res.data.landRevenueDemandData[0].jmDumala,
                    res.data.landRevenueDemandData[0].jmBindumala +
                    res.data.landRevenueDemandData[0].jmDumala -
                    res.data.landRevenueDemandData[0].jmVajasut,
                  ZP:
                    // assessment1 <= 5
                    //   ? res.data.landRevenueDemandData[0].zpAkrushik
                    //   : res.data.landRevenueDemandData[0].zpBindumala +
                    //     res.data.landRevenueDemandData[0].zpDumala +
                    //     res.data.landRevenueDemandData[0].zpAkrushik,
                    res.data.landRevenueDemandData[0].jmBindumala < 5
                      ? res.data.landRevenueDemandData[0].zpAkrushik
                      : res.data.landRevenueDemandData[0].zpBindumala +
                        res.data.landRevenueDemandData[0].zpDumala +
                        res.data.landRevenueDemandData[0].zpAkrushik,
                  VP:
                    // assessment1 <= 5
                    //   ? res.data.landRevenueDemandData[0].gpAkrushik
                    //   : res.data.landRevenueDemandData[0].gpBindumala +
                    //     res.data.landRevenueDemandData[0].gpDumala +
                    //     res.data.landRevenueDemandData[0].gpAkrushik,
                    res.data.landRevenueDemandData[0].jmBindumala < 5
                      ? res.data.landRevenueDemandData[0].gpAkrushik
                      : res.data.landRevenueDemandData[0].gpBindumala +
                        res.data.landRevenueDemandData[0].gpDumala +
                        res.data.landRevenueDemandData[0].gpAkrushik,
                  AkrushikLR: res.data.landRevenueDemandData[0].jmAkrushik,

                  addLandRevenue: res.data.landRevenueDemandData[0].addlLandRevenue,
                  educationalCess: res.data.landRevenueDemandData[0].educationalCess,
                  addlEducationalCess: res.data.landRevenueDemandData[0].addlEducationalCess,
                  employeeGuaranteeScheme:
                    res.data.landRevenueDemandData[0].employeeGuaranteeScheme,
                  localCess: res.data.landRevenueDemandData[0].localCess,
                  otherLocalCess: res.data.landRevenueDemandData[0].otherLocalCess,
                  TotalDemand: res.data.landRevenueDemandData[0].netAmount,
                  khataOwnerName: res.data.landRevenueDemandData[0].khataOwnerName,
                  NameofTenent: res.data.landRevenueDemandData[0].NameofTenent,
                  landReceiveDemandId: res.data.landRevenueDemandData[0].id,
                  modeOfPayment: res.data.landRevenueDemandData[0].modeOfPayment,
                  receiptNo: res.data.landRevenueDemandData[0].receiptNo,
                  surveyHissaNo: res.data.landRevenueDemandData[0].surveyHissaNo,
                  receiptDateForReceipt: moment(
                    res.data.landRevenueDemandData[0].receiptDateForReceipt,
                    'YYYY-MM-DD',
                  ).format('DD/MM/YYYY'),
                  ddDateForReceipt: moment(
                    res.data.landRevenueDemandData[0].ddDateForReceipt,
                    'YYYY-MM-DD',
                  ).format('DD/MM/YYYY'),
                  chequeDateForReceipt: moment(
                    res.data.landRevenueDemandData[0].chequeDateForReceipt,
                    'YYYY-MM-DD',
                  ).format('DD/MM/YYYY'),
                  preYearTotal:
                    res.data.landRevenueDemandData[0].preYearPendingAddlEducationalCess +
                    res.data.landRevenueDemandData[0].preYearPendingAddlLandRevenue +
                    res.data.landRevenueDemandData[0].preYearPendingEducationalCess +
                    res.data.landRevenueDemandData[0].preYearPendingEmployeeGuaranteeScheme +
                    res.data.landRevenueDemandData[0].preYearPendingGp +
                    res.data.landRevenueDemandData[0].preYearPendingJm +
                    res.data.landRevenueDemandData[0].preYearPendingZp +
                    res.data.landRevenueDemandData[0].preYearPendingNaCess +
                    res.data.landRevenueDemandData[0].preYearSankirnJmWith +
                    res.data.landRevenueDemandData[0].preYearSankirnJmWithout +
                    res.data.landRevenueDemandData[0].preYearNoticeFee,
                  // noticeAmount : res.data.noticeAmount,
                });
              } else {
                message.error('Please Generate Receipt!');
              }
            } else if (res.status === '226') {
              message.info(res);
            } else {
              message.error('Please Enter Valid Khata Number!');
            }
          },
          (err) => {
            setPrintButtonState(true);
            message.info(`No Receipt Found For Khata Number ${textInput}`);
          },
        );
      } else if (radiovalue === 'maktaNumber') {
        sendRequest(
          `${URLS.BaseURL}/landRevenue/getReceiptDetailsByMakhtaKhataNo`,
          'POST',
          article,
          (res) => {
            if (res.status === 202) {
              setPrintButtonState(false);
              setTest({
                makhtaKhataNo: res.data.makhtaKhataNo,
                LR: res.data.jmBindumala + res.data.jmDumala,
                ZP: res.data.zpBindumala + res.data.zpDumala + res.data.zpAkrushik,
                VP: res.data.gpBindumala + res.data.gpDumala + res.data.gpAkrushik,
                AkrushikLR: res.data.jmAkrushik,

                addLandRevenue: res.data.addlLandRevenue,
                educationalCess: res.data.educationalCess,
                addlEducationalCess: res.data.addlEducationalCess,
                employeeGuaranteeScheme: res.data.employeeGuaranteeScheme,
                localCess: res.data.localCess,
                otherLocalCess: res.data.otherLocalCess,
                TotalDemand: res.data.netAmount,
                khataOwnerName: res.data.khataOwnerName,
                NameofTenent: res.data.NameofTenent,
                landReceiveDemandId: res.data.id,
                modeOfPayment: res.data.modeOfPayment,
                receiptNo: res.data.receiptNo,
                chequeName: res.data.chequeName,
                ddName: res.data.ddName,
                chequeAmount: res.data.chequeAmount,
                ddAmount: res.data.ddAmount,
                ddBranch: res.data.ddBranch,
                chequeBranch: res.data.chequeBranch,
                netAmount: res.data.netAmount,
                ddDate: moment(res.data.ddDate, 'YYYY-MM-DD').format('DD/MM/YYYY'),
                chequeDate: moment(res.data.chequeDate, 'YYYY-MM-DD').format('DD/MM/YYYY'),
                chequeNumber: res.data.chequeNumber,
                ddNumber: res.data.ddNumber,
                surveyHissaNo: res.data.surveyHissaNo,
                receiptDate: moment(res.data.receiptDate, 'YYYY-MM-DD').format('DD/MM/YYYY'),
                noticeAmount: res.data.noticeAmount,
              });
              form.setFieldsValue({
                makhtaKhataNo: res.data.makhtaKhataNo,

                LR: res.data.jmBindumala + res.data.jmDumala,
                ZP: res.data.zpBindumala + res.data.zpDumala + res.data.zpAkrushik,
                VP: res.data.gpBindumala + res.data.gpDumala + res.data.gpAkrushik,
                AkrushikLR: res.data.jmAkrushik,

                addLandRevenue: res.data.addlLandRevenue,
                educationalCess: res.data.educationalCess,
                addlEducationalCess: res.data.addlEducationalCess,
                employeeGuaranteeScheme: res.data.employeeGuaranteeScheme,
                localCess: res.data.localCess,
                otherLocalCess: res.data.otherLocalCess,
                TotalDemand: res.data.netAmount,
                khataOwnerName: res.data.khataOwnerName,
                NameofTenent: res.data.NameofTenent,
                landReceiveDemandId: res.data.id,
                modeOfPayment: res.data.modeOfPayment,
                receiptNo: res.data.receiptNo,
                surveyHissaNo: res.data.surveyHissaNo,
                receiptDate: moment(res.data.receiptDate, 'YYYY-MM-DD').format('DD/MM/YYYY'),
                // noticeAmount : res.data.noticeAmount,
              });
            } else if (res.status === '226') {
              message.info(res);
            } else {
              message.error('Please Enter Valid Khata Number!');
            }
          },
          (err) => {
            setPrintButtonState(true);
            message.info(`No Receipt Found For Khata Number ${textInput}`);
          },
        );
      }
    }
  };

  const getViewPrint = () => {
    history.push({
      pathname: '/transactions/receiptViewPrint',
      state: {
        district: districtName,
        taluka: talukaName,
        village: textForVillage,
        //revenueYear: revenueYear,
        revenueYear: revenueYear1,
        khataNo: test.khataNo,
        makhtaKhataNo: test.makhtaKhataNo,
        lrAmount: test.LR,
        zpAmount: test.ZP,
        gvAmount: test.VP,
        lrAmountAkrushik: test.AkrushikLR,
        preYearTotal: test.preYearTotal,
        addLandRevenue: test.addLandRevenue,
        educationalCess: test.educationalCess,
        addlEducationalCess: test.addlEducationalCess,
        employeeGuaranteeScheme: test.employeeGuaranteeScheme,
        localCess: test.localCess,
        otherLocalCess: test.otherLocalCess,
        noticeAmount: test.noticeAmount,
        netAmountReceived: test.TotalDemand,
        khataownerName: test.khataOwnerName,
        NameofTenent: test.NameofTenent,
        modeOfPayment: test.modeOfPayment,
        chequeName: test.chequeName,
        ddName: test.ddName,
        chequeAmount: test.chequeAmount,
        ddAmount: test.ddAmount,
        ddBranch: test.ddBranch,
        chequeBranch: test.chequeBranch,
        ddDateForReceipt: test.ddDateForReceipt,
        chequeDateForReceipt: test.chequeDateForReceipt,
        chequeNumber: test.chequeNumber,
        ddNumber: test.ddNumber,
        receiptNo: test.receiptNo,
        receiptDateForReceipt: test.receiptDateForReceipt,
        surveyHissaNo: test.surveyHissaNo,
        amountInWords: toWords.convert(test.netAmount),
      },
    });
  };

  const handleChange = (event) => {
    setTextInput(event.target.value);
    setTest({});
    form.resetFields();
    setPrintButtonState(true);
  };

  return (
    <PageContainer>
      <Card bordered={true}>
        <Row style={{ marginBottom: 10 }}>
          <Col span={24}>
            <VillageSelector
              pageType="withoutYear"
              setCodeVillage={setCodeVillage}
              setTextForVillage={setTextForVillage}
              onVillageChange={setFlagButton}
              //yearChange={setRevenueYear}
              setIsNirank={setIsNirank}
            />
          </Col>
          {/* <Col span={4}>
            <Form.Item wrapperCol={{ xl: 20, lg: 15 }} label="वर्ष">
              <Select
                options={revenueYearLOC}
                placeholder="वर्ष निवडा"
                onSelect={(value, event) => handleOnChangeYear(value, event)}
              ></Select>
            </Form.Item>
          </Col> */}
        </Row>
        <Row>
          <Col xl={6} lg={6} md={6} sm={24} xs={24}>
            <Radio.Group
              style={{ marginTop: 10 }}
              onChange={(e) => onChangeRadioButton(e)}
              value={radiovalue}
            >
              <Space direction="horizontal">
                <Radio value={'khataNumber'}>
                  <FormattedMessage id="generateChallan.table.khataNo" />
                </Radio>
                <Radio value={'maktaNumber'}>
                  <FormattedMessage id="generateChallan.table.maktaNo" />
                </Radio>
              </Space>
            </Radio.Group>
          </Col>
          {radiovalue && radiovalue === 'maktaNumber' ? (
            <Col xl={8} lg={8} md={8} sm={24} xs={24}>
              <Form.Item>
                <Input
                  name="makhtaKhataNo"
                  onChange={handleChange}
                  addonBefore={<FormattedMessage id="generateChallan.table.maktaNo" />}
                  rules={[{ required: true, message: 'Please Enter Khata Number!!' }]}
                  style={{ marginTop: 10, width: 400 }}
                  maxLength={40}
                  //   onKeyPress={KeyPressEvents.isInputNumber}
                ></Input>
              </Form.Item>
            </Col>
          ) : (
            <Col xl={8} lg={8} md={8} sm={24} xs={24}>
              <Form.Item>
                <Input
                  name="khataNo"
                  onChange={handleChange}
                  addonBefore={<FormattedMessage id="generateChallan.table.khataNo" />}
                  rules={[{ required: true, message: 'Please Enter Khata Number!!' }]}
                  style={{ marginTop: 10, width: 400 }}
                  maxLength={40}
                  onKeyPress={KeyPressEvents.isInputNumber}
                ></Input>
              </Form.Item>
            </Col>
          )}
          <Col xl={6} lg={8} md={8} sm={24} xs={24}>
            <Form.Item
              wrapperCol={{ xl: 10, lg: 10 }}
              style={{ paddingTop: '9px' }}
              labelCol={{ lg: 12 }}
              label={<FormattedMessage id="villageSelector.label.revenueYear" />}
            >
              <Select
              value={revenueYear1}
                options={revenueYearForVillage}
                placeholder={'महसूल वर्ष'}
                onChange={(value, event) => onYearChange(value, event)}
              ></Select>
            </Form.Item>
          </Col>
          <Col xl={2} lg={2} md={2} sm={24} xs={24}>
            <Button
              type="primary"
              style={{ marginLeft: '50', marginTop: 10 }}
              onClick={() => {
                //if (textForVillage && revenueYear && textInput) {
                if (textForVillage && revenueYear1 && textInput) {
                  getContent();
                } else if (textForVillage == null) {
                  message.info('Please Select Village !');
                  //} else if (revenueYear == null) {
                } else if (revenueYear1 == null) {
                  message.info('Please Select Revenue Year !');
                } else if (textInput == null) {
                  message.info('Please Enter Khata Number !');
                }
              }}
            >
              <FormattedMessage id="transactionCommon.table.search" />
            </Button>
          </Col>
        </Row>
      </Card>
      <Card bordered={true} style={{ marginTop: 5 }}>
        <Row style={{ paddingBottom: 10 }}>
          <Button disabled={printButtonState} type="primary" onClick={() => getViewPrint()}>
            <FormattedMessage id="transactionCommon.table.print" />
          </Button>
        </Row>
        <Form layout="vertical" name="register" form={form}>
          <Card /* style={{ marginBottom: 5 }} */>
            <Row style={{ marginTop: 20 }}>
              <Col span={11}>
                <Form.Item
                  label={<FormattedMessage id="customerView.form.challanNo" />}
                  name="receiptNo"
                >
                  <Input disabled />
                </Form.Item>
              </Col>

              <Col span={2}></Col>

              <Col span={11}>
                <Form.Item
                  name="receiptDateForReceipt"
                  label={<FormattedMessage id="customerView.form.challanDate" />}
                >
                  <Input disabled />
                </Form.Item>
              </Col>
            </Row>

            <Row>
              {radiovalue && radiovalue === 'maktaNumber' ? (
                <Col span={11}>
                  <Form.Item
                    label={<FormattedMessage id="customerView.form.maktaNo" />}
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

              <Col span={2}></Col>

              <Col span={11}>
                <Form.Item
                  label={<FormattedMessage id="customerView.form.paymentMode" />}
                  name="modeOfPayment"
                >
                  <Input disabled />
                </Form.Item>
              </Col>
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
          </Card>
          <Row>
            <Col span={12}>
              <Card>
                <Col>
                  <Form.Item label={<FormattedMessage id="customerView.form.lr" />} name="LR">
                    <Input disabled addonAfter={<FormattedMessage id="customerView.form.rs" />} />
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item
                    label={<FormattedMessage id="customerView.form.lr(A)" />}
                    name="AkrushikLR"
                  >
                    <Input disabled addonAfter={<FormattedMessage id="customerView.form.rs" />} />
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item label={<FormattedMessage id="customerView.form.zp" />} name="ZP">
                    <Input disabled addonAfter={<FormattedMessage id="customerView.form.rs" />} />
                  </Form.Item>
                </Col>

                <Col>
                  <Form.Item label={<FormattedMessage id="customerView.form.vp" />} name="VP">
                    <Input disabled addonAfter={<FormattedMessage id="customerView.form.rs" />} />
                  </Form.Item>
                </Col>

                <Col>
                  <Form.Item
                    label={<FormattedMessage id="customerView.form.aLiable" />}
                    name="localCess"
                  >
                    <Input disabled addonAfter={<FormattedMessage id="customerView.form.rs" />} />
                  </Form.Item>
                </Col>

                <Col>
                  <Form.Item
                    label={<FormattedMessage id="customerView.form.addlLandRevenue" />}
                    name="addLandRevenue"
                  >
                    <Input disabled addonAfter={<FormattedMessage id="customerView.form.rs" />} />
                  </Form.Item>
                </Col>
              </Card>
            </Col>
            {/* <Col span={2}></Col> */}
            <Col span={12}>
              <Card>
                <Col>
                  <Form.Item
                    label={<FormattedMessage id="customerView.form.educationalCess" />}
                    name="educationalCess"
                  >
                    <Input disabled addonAfter={<FormattedMessage id="customerView.form.rs" />} />
                  </Form.Item>
                </Col>

                <Col>
                  <Form.Item
                    label={<FormattedMessage id="customerView.form.addlEducationalCess" />}
                    name="addlEducationalCess"
                  >
                    <Input disabled addonAfter={<FormattedMessage id="customerView.form.rs" />} />
                  </Form.Item>
                </Col>

                <Col>
                  <Form.Item
                    label={<FormattedMessage id="customerView.form.egs" />}
                    name="employeeGuaranteeScheme"
                  >
                    <Input disabled addonAfter={<FormattedMessage id="customerView.form.rs" />} />
                  </Form.Item>
                </Col>

                <Col>
                  <Form.Item
                    label={<FormattedMessage id="customerView.form.bLiable" />}
                    name="otherLocalCess"
                  >
                    <Input disabled addonAfter={<FormattedMessage id="customerView.form.rs" />} />
                  </Form.Item>
                </Col>

                <Col>
                  <Form.Item
                    label={<FormattedMessage id="customerView.form.totalPaid" />}
                    name="TotalDemand"
                  >
                    <Input disabled addonAfter={<FormattedMessage id="customerView.form.rs" />} />
                  </Form.Item>
                </Col>
              </Card>
            </Col>
          </Row>
        </Form>
      </Card>
    </PageContainer>
  );
}

export default ReceiptView;
