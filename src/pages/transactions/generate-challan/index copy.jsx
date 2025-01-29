import { PageContainer } from '@ant-design/pro-layout';
import {
  Button,
  message,
  Card,
  Col,
  Divider,
  Form,
  Input,
  Row,
  Table,
  Checkbox,
  Radio,
  Popconfirm,
  Select,
  notification,
  Alert,
} from 'antd';
import URLS from '@/URLs/urls';
import useAxios from '@/components/eComponents/use-axios';
import React, { useState, useEffect } from 'react';
import Selector from '../common/selector';
import ValidationPatterns from '@/components/eComponents/ValidationPatterns';
import BasicInput from '@/components/eComponents/BasicInput/BasicInput';
import Axios from 'axios';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import BaseURL from '@/URLs/urls';
import VillageSelector from '@/components/eComponents/VillageSelector';
import { FormattedMessage, useModel } from 'umi';
import { ToWords } from 'to-words';

const cancel = () => {
  message.error('Request Cancelled!!');
};

var prevTotalJM = 0;
var prevTotalZP = 0;
var prevTotalVP = 0;
var prevTotalJMAkrushik = 0;
var prevTotalJMSankirn = 0;
var prevTotalAddlLandRev = 0;
var prevTotalEGS = 0;
var prevTotalEducational = 0;
var prevTotalAddlEducational = 0;
var prevTotalOf0029 = 0;
var prevTotalAmountInWordsFor0029 = 0;
var prevTotalOf0045 = 0;
var prevTotalAmountInWordsFor0045 = 0;
var prevTotalAmount = 0;
var prevTotalAmountInWords = 0;

function GChallan() {
  const { districtName, talukaName, districtCode, talukaCode, challanHeads, villageData } =
    useModel('details');
  const { sendRequest } = useAxios();
  const [flagButton, setFlagButton] = useState(true);
  const [flagButton2, setflagButton2] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [state, setstate] = useState([]);
  const [textVillage, setTextVillage] = useState();
  const [isNirank, setIsNirank] = useState(false);
  const [village, setVillage] = useState([]);
  const [modeOfPayment, setModeOfPayment] = useState([]);
  const [modeOfPaymentText, setModeOfPaymentText] = useState();
  const [row, setRow] = useState();
  const [textForVillage, setTextForVillage] = useState();
  const [viewAlert, setViewAlert] = useState(false);
  const [codeVillage, setCodeVillage] = useState('');
  const [revenueYear, setRevenueYear] = useState();
  const [lGDCode, setLGDCode] = useState();
  const [confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {
    const result = villageData.filter(
      (thing, index, self) => index === self.findIndex((t) => t.lgdCode === thing.lgdCode),
    );
    var sorting = result?.map((row) => row.lgdCode);

    setLGDCode(sorting.shift());
  }, []);

  function getJm(assessment, jmBindumala, jmDumala, preYearPendingJm) {
    let jm = null;

    if (assessment <= 5) {
      jm = preYearPendingJm;
    } else if (assessment >= 5 && assessment <= 10) {
      jm = preYearPendingJm;
    } else {
      jm = jmBindumala + jmDumala + preYearPendingJm;
    }
    // console.log('jmBindumala kutai re', jmBindumala);
    // console.log('jmDumala kutai re', jmDumala);

    return jm;
  }

  function getZP(
    assessment,
    jmBindumala,
    jmDumala,
    zpAkrushik,
    zpBindumala,
    zpDumala,
    zpSankirn,
    preYearPendingZp,
  ) {
    let zp = null;

    if (assessment < 5) {
      zp = zpAkrushik + zpSankirn + preYearPendingZp;
    } else {
      zp = zpAkrushik + zpBindumala + zpDumala + zpSankirn + preYearPendingZp;
    }

    return zp;
  }

  function getVP(
    assessment,
    jmBindumala,
    jmDumala,
    gpAkrushik,
    gpBindumala,
    gpDumala,
    gpSankirn,
    preYearPendingGp,
  ) {
    let gp = null;

    if (assessment < 5) {
      gp = gpAkrushik + gpSankirn + preYearPendingGp;
    } else {
      gp = gpAkrushik + gpBindumala + gpDumala + gpSankirn + preYearPendingGp;
    }

    return gp;
  }

  let history = useHistory();
  const toWords = new ToWords({
    localeCode: 'mr-IN',
    converterOptions: {
      currency: true,
      ignoreDecimal: false,
      ignoreZeroCurrency: false,
      doNotAddOnly: true,
    },
  });
  const openNotification = (type, placement) => {
    notification[type]({
      message: 'Generate Challan ',
      description: `${modeOfPaymentText} data for Village ${textVillage} fetched !`,
      placement,
      onClick: () => {
        // function on notification click can be added here!
        // console.log('Notification Clicked!');
      },
    });
  };

  const generateChallan = async () => {
    setConfirmLoading(true),
      sendRequest(
        `${URLS.BaseURL}/landRevenue/persistLandRevenueChallan`,
        'POST',
        row,

        (resForPrint) => {
          {
            if (resForPrint.status === 201) {
              message.success('Challan Created!!!');
              history.push({
                pathname: '/transactions/generateChallanPrint',
                state: {
                  district: districtName,
                  taluka: talukaName,
                  village: textVillage,
                  challanNo: resForPrint.data.challanNo,
                  challanNo0045: resForPrint.data.challanNo0045,
                  createDtTm: moment(new Date(), 'YYYY-MM-DD').format('DD/MM/YYYY'),
                  receipts: resForPrint.data.lstReceipt,
                  totalAmount: row.totalAmount,
                  totalJM: row.totalJM,
                  totalZP: row.totalZP,
                  totalVP: row.totalVP,
                  totalOfHead0029: row.totalOfHead0029,
                  totalOfHead0045: row.totalOfHead0045,
                  totalJMAkrushik: row.totalJMAkrushik,
                  totalJMSankirn: row.totalJMSankirn,
                  totalAddlLandRev: row.totalAddlLandRev,
                  totalEGS: row.totalEGS,
                  totalEducational: row.totalEducational,
                  totalAddlEducational: row.totalAddlEducational,
                  AmountInWords: toWords.convert(row.totalAmount),
                  AmountInWords0029: toWords.convert(row.totalOfHead0029),
                  AmountInWords0045: toWords.convert(row.totalOfHead0045),
                  modeofPayment: modeOfPaymentText,
                },
              });
            }
          }
        },
        setConfirmLoading(false),
        (prevTotalJM = 0),
        (prevTotalZP = 0),
        (prevTotalVP = 0),
        (prevTotalJMAkrushik = 0),
        (prevTotalAddlLandRev = 0),
        (prevTotalJMSankirn = 0),
        (prevTotalEGS = 0),
        (prevTotalEducational = 0),
        (prevTotalAddlEducational = 0),
        (prevTotalOf0029 = 0),
        (prevTotalOf0045 = 0),
        (prevTotalAmount = 0),
        (prevTotalAmountInWords = 0),
        (prevTotalAmountInWordsFor0029 = 0),
        (prevTotalAmountInWordsFor0045 = 0),
        (err) => {
          setConfirmLoading(false);
        },
      );

    // console.log(row);
  };

  const handleOnChangeM = (value, event) => {
    setModeOfPaymentText(value);
    setstate();
    // console.log('Mode Of Payment', value);

    setflagButton2(false);
  };

  const getData = async () => {
    setIsLoading(true);
    const article = {
      districtCode: districtCode,
      talukaCode: talukaCode,
      cCode: codeVillage,
      revenueYear: revenueYear,
      isMoneyepositedBank: 'N',
      modeOfPayment: modeOfPaymentText,
    };
    sendRequest(
      `${URLS.BaseURL}/landRevenue/getAllReceiptsByVillage`,
      'POST',
      article,
      (res) => {
        // console.log('test for msg', res);
        setstate(
          res.data.map((r) => ({
            id: r.id,
            receiptNo: r.receiptNo,
            receiptDate: moment(r.receiptDate, 'YYYY-MM-DD').format('DD/MM/YYYY'),
            khataNo: r.khataNo == null ? r.makhtaKhataNo : r.khataNo,
            khataOwnerName: r.khataOwnerName,
            netAmountReceived: r.netAmount,
            modeOfPayment: r.modeOfPayment,
            jmAkrushik: r.jmAkrushik + r.preYearPendingNaCess,
            assessment: r.assessment,
            jmSankirn:
              r.jmSankirn + r.preYearSankirnJmWith + r.preYearSankirnJmWithout + r.preYearNoticeFee,
            addlLandRevenue: r.addlLandRevenue + r.preYearPendingAddlLandRevenue,
            educationalCess: r.educationalCess + r.preYearPendingEducationalCess,
            addlEducationalCess: r.addlEducationalCess + r.preYearPendingAddlEducationalCess,
            employeeGuaranteeScheme:
              r.employeeGuaranteeScheme + r.preYearPendingEmployeeGuaranteeScheme,
            JM: getJm(r.assessment, r.jmBindumala, r.jmDumala, r.preYearPendingJm),
            JM: getJm(r.assessment, r.jmBindumala, r.jmDumala, r.preYearPendingJm),
            ZP: getZP(
              r.assessment,
              r.jmBindumala,
              r.jmDumala,
              r.zpAkrushik,
              r.zpBindumala,
              r.zpDumala,
              r.zpSankirn,
              r.preYearPendingZp,
            ),
            VP: getVP(
              r.assessment,
              r.jmBindumala,
              r.jmDumala,
              r.gpAkrushik,
              r.gpBindumala,
              r.gpDumala,
              r.gpSankirn,
              r.preYearPendingGp,
            ),
            // ZP: r.zpAkrushik + r.zpBindumala + r.zpDumala + r.zpSankirn,
            // VP: r.gpAkrushik + r.gpBindumala + r.gpDumala + r.gpSankirn,
            totalOf0029: r.totalOf0029,
            totalOf0045: r.totalOf0045,
          })),
        );
        // prevTotalJM += JM;

        if (res.data.length > 0) {
          message.success('Challan Records Fetched!');
          openNotification('success', 'bottomRight');
          setIsLoading(false);
        }
      },
      (err) => {
        message.info('No Records Found !');
        setIsLoading(false);
      },
    );
  };
  const columns = [
    {
      title: <FormattedMessage id="challanDetails.table.receiptNo" />,
      dataIndex: 'receiptNo',
    },
    {
      title: <FormattedMessage id="challanDetails.table.receiptDate" />,
      dataIndex: 'receiptDate',
    },
    {
      title: <FormattedMessage id="generateChallan.table.khataNo" />,
      dataIndex: 'khataNo',
    },
    {
      title: <FormattedMessage id="generateChallan.table.khatedarName" />,
      dataIndex: 'khataOwnerName',
    },
    {
      title: <FormattedMessage id="generateChallan.table.jm(akrushik)" />,
      dataIndex: 'jmAkrushik',
      width: '125px',
    },

    {
      title: <FormattedMessage id="generateChallan.table.jm(sankirn)" />,
      dataIndex: 'jmSankirn',
      width: '125px',
    },
    {
      title: <FormattedMessage id="generateChallan.table.jm" />,
      dataIndex: 'JM',
      width: '125px',
    },
    {
      title: <FormattedMessage id="generateChallan.table.zp" />,
      dataIndex: 'ZP',
      width: '125px',
    },
    {
      title: <FormattedMessage id="generateChallan.table.vp" />,
      dataIndex: 'VP',
      width: '125px',
    },
    {
      title: <FormattedMessage id="generateChallan.table.addLandRevenue" />,
      dataIndex: 'addlLandRevenue',
      width: '125px',
    },
    {
      title: <FormattedMessage id="generateChallan.table.EGS" />,
      dataIndex: 'employeeGuaranteeScheme',
      width: '145px',
    },
    {
      title: <FormattedMessage id="generateChallan.table.EduCess" />,
      dataIndex: 'educationalCess',
      width: '125px',
    },
    {
      title: <FormattedMessage id="generateChallan.table.AddlEduCess" />,
      dataIndex: 'addlEducationalCess',
      width: '125px',
    },
    {
      title: <FormattedMessage id="challanDetails.table.totalAmount" />,
      dataIndex: 'netAmountReceived',
    },
  ];

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      // console.log(selectedRowKeys);

      var totalAmount = 0;
      var totalJM = 0;
      var totalZP = 0;
      var totalVP = 0;
      var totalJMAkrushik = 0;
      var totalJMSankirn = 0;
      var totalAddlLandRev = 0;
      var totalEGS = 0;
      var totalEducational = 0;
      var totalAddlEducational = 0;
      var totalOfHead0029 = 0;
      var totalOfHead0045 = 0;
      var lstReceipt = [];

      selectedRows.map((row) => {
        lstReceipt.push({
          id: row.id,
          receiptNo: row.receiptNo,
        });
        totalAmount += row.netAmountReceived;
        totalJM += row.JM;
        totalZP += row.ZP;
        totalVP += row.VP;
        totalJMAkrushik += row.jmAkrushik;
        totalJMSankirn += row.jmSankirn;
        totalAddlLandRev += row.addlLandRevenue;
        totalEGS += row.employeeGuaranteeScheme;
        totalEducational += row.educationalCess;
        totalAddlEducational += row.addlEducationalCess;
        totalOfHead0029 += row.totalOf0029;
        totalOfHead0045 += row.totalOf0045;
      });

      var objForChallan = {
        districtCode: districtCode,
        talukaCode: talukaCode,
        cCode: codeVillage,
        revenueYear: revenueYear,
        lgdCode: lGDCode,
        totalAmount: totalAmount,
        totalJM: totalJM.toFixed(2),
        totalZP: totalZP.toFixed(2),
        totalVP: totalVP.toFixed(2),
        totalJMAkrushik: totalJMAkrushik.toFixed(2),
        totalJMSankirn: totalJMSankirn.toFixed(2),
        totalAddlLandRev: totalAddlLandRev.toFixed(2),
        totalEGS: totalEGS.toFixed(2),
        totalEducational: totalEducational.toFixed(2),
        totalAddlEducational: totalAddlEducational.toFixed(2),
        totalOfHead0029: totalOfHead0029.toFixed(2),
        totalOfHead0045: totalOfHead0045.toFixed(2),
        modeOfPayment: modeOfPaymentText,
        lstReceipt: lstReceipt,
      };

      prevTotalJM = totalJM;
      prevTotalZP = totalZP;
      prevTotalVP = totalVP;
      prevTotalJMAkrushik = totalJMAkrushik;
      prevTotalJMSankirn = totalJMSankirn;
      prevTotalAddlLandRev = totalAddlLandRev;
      prevTotalEGS = totalEGS;
      prevTotalEducational = totalEducational;
      prevTotalAddlEducational = totalAddlEducational;
      prevTotalOf0029 = totalOfHead0029;
      prevTotalOf0045 = totalOfHead0045;
      prevTotalAmount = totalAmount;
      prevTotalAmountInWords = toWords.convert(totalAmount);
      // prevTotalAmountInWordsFor0029 = toWords.convert(totalOfHead0029);
      // prevTotalAmountInWordsFor0045 = toWords.convert(totalOfHead0045);
      setRow(objForChallan);
      // console.log('objForChallan', objForChallan);
    },
  };

  const [selectionType, setSelectionType] = useState('checkbox');

  return (
    <PageContainer>
      <Card bordered={true}>
        <div>
          {viewAlert && (
            <div
              style={{
                display: 'block',
              }}
            >
              <Alert
                message={`Land Revenue records for ${textForVillage} retrieved from DB`}
                type="success"
                closable
              />
            </div>
          )}
          {/* <Button onClick={getData()}>test</Button> */}
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
            <label htmlFor="" style={{ paddingRight: '5px', marginTop: 13 }}>
              <FormattedMessage id="generateChallan.table.paymentMode" />
            </label>
            <Select
              style={{ width: 250, marginRight: '15px', marginTop: 10 }}
              placeholder="कृपया पेमेंट मोड निवडा"
              onSelect={(value, event) => handleOnChangeM(value, event)}
            >
              <Select.Option value="Cash">
                <FormattedMessage id="generateChallan.table.cash" />
              </Select.Option>
              <Select.Option value="Cheque">
                <FormattedMessage id="generateChallan.table.cheque" />
              </Select.Option>
              <Select.Option value="DD">
                <FormattedMessage id="generateChallan.table.dd" />
              </Select.Option>
            </Select>
          </Row>
        </div>
        <Button
          type="primary"
          onClick={() => {
            if (textVillage && revenueYear && modeOfPaymentText) {
              getData();
            } else if (textVillage == null) {
              message.info('Please Select Village !');
            } else if (revenueYear == null) {
              message.info('Please Select Revenue Year !');
            } else if (modeOfPaymentText == null) {
              message.info('Please Select Mode of Payment !');
            }
          }} /* disabled={flagButton || flagButton2} */
        >
          <FormattedMessage id="generateChallan.button.challanButton" />
        </Button>
      </Card>

      <Card>
        <Table
          rowSelection={{
            type: selectionType,
            ...rowSelection,
          }}
          onChange={rowSelection}
          rowKey={(row) => row.id}
          bordered={true}
          columns={columns}
          dataSource={state}
          loading={isLoading}
          pagination={{ pageSize: 10 }}
          scroll={{ y: 350, x: 1800 }}
        />

        <Row style={{ marginTop: '10px' }}>
          <Col xl={11} lg={11} md={11} sm={24} xs={24}>
            <Card
              hoverable={true}
              style={{ borderRadius: '20px', borderColor: 'darkgrey' }}
              title="लेखाशिर्षांक ००२९"
              headStyle={{
                background: '#1e90ff',
                color: 'white',
                borderTopLeftRadius: '20px',
                borderTopRightRadius: '20px',
                height: '1px',
              }}
            >
              <Row>
                <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                  <b>
                    <td>ज.म. उपकर(अकृषक): ₹ {prevTotalJMAkrushik.toFixed(2)}</td>
                    <br />
                    <td>({challanHeads[1].subHeadNo})</td>
                  </b>
                </Col>
                <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                  <b>
                    <td>ज.म. उपकर(संकीर्ण): ₹ {prevTotalJMSankirn.toFixed(2)}</td>
                    <br />
                    <td>({challanHeads[4].subHeadNo})</td>
                  </b>
                </Col>
              </Row>
              <br />
              <Row>
                <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                  <b>
                    <td>ज.म. उपकर : ₹ {prevTotalJM.toFixed(2)}</td>
                    <br />
                    <td>({challanHeads[0].subHeadNo})</td>
                  </b>
                </Col>

                <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                  <b>
                    <td>जि.प. उपकर : ₹ {prevTotalZP.toFixed(2)}</td>
                    <br />
                    <td>({challanHeads[3].subHeadNo})</td>
                  </b>
                </Col>
              </Row>
              <br />
              <Row>
                <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                  <b>
                    <td>ग्रा.पं. उपकर : ₹ {prevTotalVP.toFixed(2)}</td>
                    <br />
                    <td>({challanHeads[2].subHeadNo})</td>
                  </b>
                </Col>

                <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                  <b>
                    <td>वाढीव जमीन महसूल : ₹ {prevTotalAddlLandRev.toFixed(2)}</td>
                    <br />
                    <td>({challanHeads[5].subHeadNo})</td>
                  </b>
                </Col>
              </Row>
              <br />
              <Row>
                <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                  <b>
                    <td>एकूण रक्कम : ₹ {prevTotalOf0029.toFixed(2)}</td>
                  </b>
                </Col>
                {/* <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                  <b>
                    <td>शब्दांमध्ये एकूण रक्कम :₹ {prevTotalAmountInWordsFor0029}</td>
                  </b>
                </Col> */}
              </Row>
              <br />
              {/* <Row>
                <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                  <b>
                    <td>एकूण रक्कम : ₹ {prevTotalAmount}</td>
                  </b>
                </Col>
                <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                  <b>
                    <td>शब्दांमध्ये एकूण रक्कम :₹ {prevTotalAmountInWords}</td>
                  </b>
                </Col>
              </Row> */}
            </Card>
          </Col>
          <Col xl={1} lg={11} md={1} sm={1} xs={1}></Col>

          <Col xl={11} lg={11} md={11} sm={24} xs={24}>
            <Card
              hoverable={true}
              style={{ borderRadius: '20px', borderColor: 'darkgrey' }}
              title="लेखाशिर्षांक ००४५"
              headStyle={{
                background: '#1e90ff',
                color: 'white',
                borderTopLeftRadius: '20px',
                borderTopRightRadius: '20px',
                height: '2px',
              }}
            >
              <Row>
                <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                  <b>
                    <td>रो.ह.उपकर: ₹ {prevTotalEGS.toFixed(2)}</td>
                    <br />
                    <td>({challanHeads[7].subHeadNo})</td>
                  </b>
                </Col>
                <br />

                <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                  <b>
                    <td>शिक्षण उपकर: ₹ {prevTotalEducational.toFixed(2)}</td>
                    <br />
                    <td>({challanHeads[6].subHeadNo})</td>
                  </b>
                </Col>
              </Row>
              <br />

              <Row>
                <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                  <b>
                    <td>वाढीव शिक्षण उपकर : ₹ {prevTotalAddlEducational.toFixed(2)}</td>
                    <br />
                    <td>({challanHeads[6].subHeadNo})</td>
                  </b>
                </Col>
                <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                  <b>
                    <td>एकूण रक्कम : ₹ {prevTotalOf0045}</td>
                  </b>
                </Col>
              </Row>
              <br />

              {/* <Row>
                <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                  <b>
                    <td>शब्दांमध्ये एकूण रक्कम :₹ {prevTotalAmountInWordsFor0045}</td>
                  </b>
                </Col>
              </Row> */}
            </Card>
            <Card
              hoverable={true}
              style={{ marginTop: '10px', borderRadius: '20px', borderColor: 'darkgrey' }}
              title="एकूण"
              headStyle={{
                background: '#1e90ff',
                color: 'white',
                borderTopLeftRadius: '20px',
                borderTopRightRadius: '20px',
                height: '1px',
              }}
            >
              <Row>
                <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                  <b>
                    <td>एकूण रक्कम : ₹ {prevTotalAmount}</td>
                  </b>
                </Col>
                <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                  <b>
                    <td>शब्दांमध्ये एकूण रक्कम :₹ {prevTotalAmountInWords}</td>
                  </b>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col xl={3} lg={3} md={3} sm={24} xs={24}>
            <Popconfirm
              title={<FormattedMessage id="transactionCommon.table.popForSave" />}
              onConfirm={() => {
                if (textVillage && revenueYear && modeOfPaymentText) {
                  generateChallan();
                } else if (textVillage == null) {
                  message.info('Please Select Village !');
                } else if (revenueYear == null) {
                  message.info('Please Select Revenue Year !');
                } else if (modeOfPaymentText == null) {
                  message.info('Please Select Mode of Payment !');
                }
              }}
              okButtonProps={{
                loading: confirmLoading,
              }}
              onCancel={cancel}
              okText={<FormattedMessage id="transactionCommon.table.yes" />}
              cancelText={<FormattedMessage id="transactionCommon.table.no" />}
            >
              <Button type="primary" style={{ marginTop: '15px' }}>
                <FormattedMessage id="generateChallan.table.handWrittenChallan" />
              </Button>
            </Popconfirm>
          </Col>
          <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>
          <Col xl={4} lg={4} md={4} sm={24} xs={24}>
            <Popconfirm
              title={<FormattedMessage id="transactionCommon.table.popForSave" />}
              onConfirm={() => {
                if (textVillage && revenueYear && modeOfPaymentText) {
                  // generateChallan();
                } else if (textVillage == null) {
                  message.info('Please Select Village !');
                } else if (revenueYear == null) {
                  message.info('Please Select Revenue Year !');
                } else if (modeOfPaymentText == null) {
                  message.info('Please Select Mode of Payment !');
                }
              }}
              onCancel={cancel}
              okText={<FormattedMessage id="transactionCommon.table.yes" />}
              cancelText={<FormattedMessage id="transactionCommon.table.no" />}
            >
              <Button type="primary" style={{ marginTop: '15px' }}>
                <FormattedMessage id="generateChallan.table.grasChallan" />
              </Button>
            </Popconfirm>
          </Col>
        </Row>
      </Card>
    </PageContainer>
  );
}

export default GChallan;
