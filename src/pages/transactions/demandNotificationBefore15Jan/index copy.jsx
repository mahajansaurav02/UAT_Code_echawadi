import React, { useState, useEffect, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import {
  Form,
  Button,
  Card,
  Col,
  DatePicker,
  Input,
  InputNumber,
  Row,
  Select,
  message,
} from 'antd';
import Selector from '../common/selector';
import ValidationPatterns from '@/components/eComponents/ValidationPatterns';
import BasicInput from '@/components/eComponents/BasicInput/BasicInput';
import Axios from 'axios';
import { render } from 'react-dom';
import { useReactToPrint } from 'react-to-print';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import BaseURL from '@/URLs/urls';
import URLS from '@/URLs/urls';
import useAxios from '@/components/eComponents/use-axios';

import { FormattedMessage } from 'umi';
import { useModel } from 'umi';
import ESelector from '@/components/eComponents/ESelector';
import { ToWords } from 'to-words';
import VillageSelector from '@/components/eComponents/VillageSelector';
import KeyPressEvents from '@/util/KeyPressEvents';

// import SelectorAllInOne from '@/components/eComponents/SelectorAllInOne';

function DemandNotification() {
  const { sendRequest } = useAxios();
  const [flagButton, setFlagButton] = useState(true);
  const [flagButton2, setFlagButton2] = useState(true);
  const [printIsVisible, setPrintIsVisible] = useState(false);
  const [textInput, setTextInput] = useState();
  const [textVillage, setTextVillage] = useState();
  const [isNirank, setIsNirank] = useState(false);
  const [loadings, setLoadings] = useState([]);
  const [form] = Form.useForm();
  const componentRef = useRef();
  let history = useHistory();
  const [codeVillage, setCodeVillage] = useState('');
  const [revenueYear, setRevenueYear] = useState();
  const { districtName, talukaName, districtCode, talukaCode } = useModel('details');

  let khataNoWithComma = `${textInput}`;
  let khataNoWithHash = khataNoWithComma.replace(/,/g, '#');

  const toWords = new ToWords({
    localeCode: 'mr-IN',
    converterOptions: {
      currency: true,
      ignoreDecimal: false,
      ignoreZeroCurrency: false,
      doNotAddOnly: true,
    },
  });

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
    }, 5000);
  };

  const onDemandSearch = async () => {
    enterLoading(2);
    if (textInput !== null && textInput !== undefined && textInput) {
      let flag = false;
      const dt = new Date();
      //2022, 1, 1, 10, 33, 30 place this in Date(block to show another receipt)
      if (dt.getMonth() >= 0 && dt.getMonth() <= 6) {
        if (dt.getMonth() == 0) {
          if (dt.getDate() >= 15 && dt.getDate() <= 31) {
            flag = true;
          } else {
            flag = false;
          }
          // console.log('kute ahe re tu ?', flag);
        } else if (dt.getDate() >= 1 && dt.getDate() <= 31) {
          flag = true;
        } else {
          flag = false;
        }
      } else {
        flag = false;
      }

      const article = {
        revenueYear: revenueYear,
        districtCode: districtCode,
        talukaCode: talukaCode,
        cCode: codeVillage,
        khataNo: khataNoWithHash,
        noticeFeesApplicable: flag === true ? 'Y' : 'N',
      };

      sendRequest(
        `${URLS.BaseURL}/landRevenue/getLandRevenueDemandDtl`,
        'POST',
        article,
        (res) => {
          const dateCreate = moment().format('DD-MM-YYYY hh:mm:ss');
          // if (res.data.netAmount <= 0) {
          //   message.info(`या खात्याची आकारणी '0' असल्यामुळे पावती तयार होणार नाही`);
          // }
          if (res.data.length > 0) {
            var receiptsTest = res.data.map(function (r) {
              let tempArea = r.area;
              let areaToSplit = tempArea.toString();
              let myArray = areaToSplit.split('.');
              var areaHRValue = myArray[0];
              var areaSQValue = myArray[1];
              console.log('areas', areaHRValue, areaHRValue);
              const formattedDate = moment(r.dateOfNotice, 'YYYY-MM-DD hh:mm:ss').format(
                'DD/MM/YYYY',
              );
              var test = {
                id: r.id,
                khataNo: r.khataNo,
                khataOwnerName: r.khataOwnerName,
                LR: r.jmBindumala + r.jmDumala,
                ZP: r.zpBindumala + r.zpDumala + r.zpAkrushik,
                VP: r.gpBindumala + r.gpDumala + r.gpAkrushik,
                AddLandRevenue: r.addlLandRevenue,
                EducationCess: r.educationalCess,
                AddlEducationCess: r.addlEducationalCess,
                localCess: r.localCess,
                otherLocalCess: r.otherLocalCess,
                TotalDemand: r.netAmount,
                TotalDemandWithoutNotice: r.netAmount - r.noticeAmount,
                AmountInWords: toWords.convert(r.netAmount),
                dateCreate: formattedDate,
                employeeGuaranteeScheme: r.employeeGuaranteeScheme,
                noticeAmount: r.noticeAmount,
                areaHRValue: areaHRValue,
                areaSQValue: areaSQValue,
                area: r.area,
                assessment: r.assessment,
                preYearTotal:
                  r.preYearPendingAddlEducationalCess +
                  r.preYearPendingAddlLandRevenue +
                  r.preYearPendingEducationalCess +
                  r.preYearPendingEmployeeGuaranteeScheme +
                  r.preYearPendingGp +
                  r.preYearPendingJm +
                  r.preYearPendingZp +
                  r.miscellaneousAmount,
                akrushiKAR: r.jmAkrushik,
                surveyHissaNo: r.surveyHissaNo,
                uom: r.uom,
              };
              console.log('Var test', test);
              return test;
            });

            if (flag) {
              history.push({
                pathname: '/transactions/demandNotificationPrint',

                state: {
                  district: districtName,
                  taluka: talukaName,
                  village: textVillage,
                  receipts: receiptsTest,
                },
              });
            } else {
              history.push({
                pathname: '/transactions/demandNotificationPrintBefore15Jan',

                state: {
                  district: districtName,
                  taluka: talukaName,
                  village: textVillage,
                  receipts: receiptsTest,
                },
              });
            }

            // //15 jan te 31 july wali notice
            // if (
            //   parseInt(currentDate.getUTCMonth() + 1) >= 1 &&
            //   parseInt(currentDate.getDate()) >= 15 &&
            //   parseInt(currentDate.getUTCMonth()) + 1 <= 7 &&
            //   parseInt(currentDate.getUTCMonth() + 1) <= 31
            // ) {

            // } else {
            //   //1 august te 14 jan notice

            // }
          } else if (res.data === []) {
            message.info('या खात्याची मागणी निश्चिती झालेली नाही ');
          } else if (res.status === 204) {
            message.info('या खात्याची नोटीस तयार होणार नाही ');
          } else {
            message.error('Something went Wrong...!!!');
          }
        },
        'ERROR',
      );
    }
  };

  const handleChangeKhata = (event) => {
    setTextInput(event.target.value);
    setFlagButton(false);
    setFlagButton2(false);
  };

  return (
    <div>
      <PageContainer>
        <Card>
          <Row>
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
            <Col xl={7} lg={7} md={7} sm={7} xs={24}>
              <Input
                name="khataNo"
                onChange={handleChangeKhata}
                addonBefore={<FormattedMessage id="customerView.form.khataNo" />}
                rules={[{ required: true, message: 'कृपया खाता क्रमांक प्रविष्ट करा !!' }]}
                style={{ marginTop: 10 }}
                maxLength={18}
                onKeyPress={KeyPressEvents.isInputNumber1}
              ></Input>
            </Col>
            <Col xl={1} lg={1} md={1} sm={1}></Col>
            <Col xl={7} lg={7} md={7} sm={7} xs={24}>
              <Button
                type="primary"
                loading={loadings[2]}
                style={{ marginLeft: '50', marginTop: 10 }}
                onClick={() => {
                  if (textVillage && revenueYear && textInput) {
                    onDemandSearch();
                  } else if (textVillage == null) {
                    message.info('Please Select Village !');
                  } else if (revenueYear == null) {
                    message.info('Please Select Revenue Year !');
                  } else if (textInput == null) {
                    message.info('Please Enter Khata Number !');
                  }
                }}
                // disabled={flagButton || flagButton2}
              >
                <FormattedMessage id="transactionCommon.table.search" />
              </Button>
            </Col>
            <Col xl={1} lg={1} md={1} sm={1}></Col>
            <Col xl={7} lg={7} md={7} sm={7} xs={24}></Col>
          </Row>
        </Card>
      </PageContainer>
    </div>
  );
}
// render(<Example />, document.querySelector('#root'));

class ComponentToPrint extends React.Component {
  // constructor(props) {
  //   super(props);

  //   console.log('----logs-sss---' + this.props.khataNo);
  // }

  render() {
    console.log('-11---logs-class compo--' + this.props.khataNo);
    return (
      <div>
        <Card>
          <Card>
            <Form>
              <h1>
                <FormattedMessage id="transactionCommon.table.settleOfficer" />
              </h1>
              <Row>
                <label>
                  <FormattedMessage id="transactionCommon.table.district" /> अमरावती
                </label>
                <label>
                  <FormattedMessage id="transactionCommon.table.taluka" /> अचलपूर
                </label>
                <label>
                  <FormattedMessage id="transactionCommon.table.village" />
                </label>
              </Row>
              <div className="table">
                <Row>
                  <Form.Item
                    label={<FormattedMessage id="customerView.form.khataNo" />}
                    name="khataNo"
                    value={this.props.khataNo}
                  >
                    <Input />
                  </Form.Item>
                </Row>
                <Row style={{ marginLeft: '167px' }}>
                  <Col span={6}>
                    <Form.Item
                      label={<FormattedMessage id="customerView.form.lr" />}
                      name="LR"
                      value={this.props.khataNo}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={6} style={{ paddingLeft: '10px' }}>
                    <Form.Item label={<FormattedMessage id="customerView.form.zp" />} name="ZP">
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={8} style={{ paddingLeft: '15px' }}>
                    <Form.Item label={<FormattedMessage id="customerView.form.vp" />} name="VP">
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
                <Row style={{ marginLeft: '64px' }}>
                  <Col>
                    <Form.Item
                      label={<FormattedMessage id="customerView.form.addlLandRevenue" />}
                      name="AddLandRevenue"
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12} style={{ paddingLeft: '85px' }}>
                    <Form.Item
                      label={<FormattedMessage id="customerView.form.egs" />}
                      name="EmployeeGuaranteeScheme"
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
                <Row style={{ marginLeft: '88px' }}>
                  <Col span={8}>
                    <Form.Item
                      label={<FormattedMessage id="customerView.form.educationalCess" />}
                      name="EducationCess"
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12} style={{ paddingLeft: '106px' }}>
                    <Form.Item
                      label={<FormattedMessage id="customerView.form.addlEducationalCess" />}
                      name="AddlEducationCess"
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>

                <Row style={{ marginLeft: '94px' }}>
                  <Form.Item
                    label={<FormattedMessage id="customerView.form.totalPaid" />}
                    name="TotalDemand"
                  >
                    <Input />
                  </Form.Item>
                </Row>
              </div>
            </Form>
          </Card>
        </Card>
      </div>
    );
  }
}
// }

export default DemandNotification;
