import Selector from '@/pages/transactions/common/selector';
import { EditTwoTone, EyeTwoTone } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import {
  Card,
  Col,
  Row,
  Button,
  Table,
  Select,
  Form,
  DatePicker,
  Modal,
  Input,
  message,
} from 'antd';
import React from 'react';
import { useState, useEffect } from 'react';
import Axios from 'axios';
import styles from './report.module.css';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import BaseURL from '@/URLs/urls';
import URLS from '@/URLs/urls';
import useAxios from '@/components/eComponents/use-axios';
import VillageSelector from '@/components/eComponents/VillageSelector';
import { useModel } from 'umi';
import { FormattedMessage } from 'umi';
import { ToWords } from 'to-words';

function onChange(date, dateString) {
  // console.log(date, dateString);
}

function ReceiptReports() {
  const { districtName, talukaName, districtCode, talukaCode } = useModel('details');
  const { RangePicker } = DatePicker;
  let history = useHistory();
  const { sendRequest } = useAxios();
  const [isLoading, setIsLoading] = useState(false);
  const [flagButton, setFlagButton] = useState(true);
  const [textVillage, setTextVillage] = useState();
  const [state, setstate] = useState([]);
  const [village, setVillage] = useState([]);
  const [codeVillage, setCodeVillage] = useState('');
  const [dataInModal, setDataInModal] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [printButtonFlag, setPrintButtonFlag] = useState(true);
  const [revenueYear, setRevenueYear] = useState();
  const [isNirank, setIsNirank] = useState(false);
  const [khataNumber, setKhataNumber] = useState();
  const [test, setTest] = useState();
  const [form] = Form.useForm();
  const [revenueYearForVillage, setRevenueYearForVillage] = useState();

  const toWords = new ToWords({
    localeCode: 'mr-IN',
    converterOptions: {
      currency: true,
      ignoreDecimal: false,
      ignoreZeroCurrency: false,
      doNotAddOnly: true,
    },
  });

  const handleOnChange = (value, event) => {
    setTextVillage(event.label);
    setCodeVillage(value);
    // console.log('Name of Village ==>>', event.label, 'cCode==>>', value);
    setFlagButton(false);
    setstate();
  };

  useEffect(() => {
    getRevenueYear();
  }, []);

  const onYearChange = (value, event) => {
    setRevenueYear(value);
    setstate();
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

  const getData = async () => {
    setIsLoading(true);
    const article = {
      districtCode: districtCode,
      talukaCode: talukaCode,
      cCode: codeVillage,
      revenueYear: revenueYear,
      isMoneyepositedBank: 'Y',
    };
    sendRequest(`${URLS.BaseURL}/landRevenue/getAllReceiptsByVillage`, 'POST', article, (res) => {
      // console.log('Data', res);
      if (res.status == '202') {
        setstate(
          res.data.map((r) => ({
            id: r.id,
            receiptNo: r.receiptNo,
            receiptDate: moment(r.receiptDate, 'YYYY-MM-DD').format('DD/MM/YYYY'),
            khataNo: r.khataNo,
            khataOwnerName: r.khataOwnerName,
            netAmount: r.netAmount,
            modeOfPayment: r.modeOfPayment,
            getKhata: setKhataNumber(r.khataNo),

            LR: r.jmBindumala + r.jmDumala + r.jmAkrushik,
            ZP: r.zpBindumala + r.zpDumala + r.zpAkrushik,
            VP: r.gpBindumala + r.gpDumala + r.gpAkrushik,
            addlLandRevenue: r.addlLandRevenue,
            educationalCess: r.educationalCess,
            addlEducationalCess: r.addlEducationalCess,
            employeeGuaranteeScheme: r.employeeGuaranteeScheme,
            localCess: r.localCess,
            otherLocalCess: r.otherLocalCess,
            TotalDemand: r.netAmount,
            khataOwnerName: r.khataOwnerName,
            landReceiveDemandId: r.id,
            modeOfPayment: r.modeOfPayment,
            receiptNo: r.receiptNo,
            chequeName: r.chequeName,
            ddName: r.ddName,
            chequeAmount: r.chequeAmount,
            ddAmount: r.ddAmount,
            ddBranch: r.ddBranch,
            chequeBranch: r.chequeBranch,
            netAmount: r.netAmount,
            ddDate: moment(r.ddDate, 'YYYY-MM-DD').format('DD/MM/YYYY'),
            chequeDate: moment(r.chequeDate, 'YYYY-MM-DD').format('DD/MM/YYYY'),
            chequeNumber: r.chequeNumber,
            ddNumber: r.ddNumber,
            surveyHissaNo: r.surveyHissaNo,
            receiptDate: moment(r.receiptDate, 'YYYY-MM-DD').format('DD/MM/YYYY'),
            noticeAmount: r.noticeAmount,
            preYearNetAmount:
              r.preYearNoticeFee +
              r.preYearPendingAddlEducationalCess +
              r.preYearPendingAddlLandRevenue +
              r.preYearPendingEducationalCess +
              r.preYearPendingEmployeeGuaranteeScheme +
              r.preYearPendingGp +
              r.preYearPendingJm +
              r.preYearPendingNaCess +
              r.preYearPendingZp +
              r.preYearSankirnJmWith +
              r.preYearSankirnJmWithout,
          })),
        );

        setIsLoading(false);
        setPrintButtonFlag(false);
        message.success('Records Fetched!!');
      }
      if (res.data === '') {
        message.info('No Receipts !');
        setIsLoading(false);
        setPrintButtonFlag(true);
      }
    });
  };

  const print = async (value) => {
    // console.log('ahe ka', value);
    history.push({
      pathname: '/transactions/receiptViewPrint',
      state: {
        // ...value,
        district: districtName,
        taluka: talukaName,
        village: textVillage,
        revenueYear: revenueYear,
        khataNo: value.khataNo,
        makhtaKhataNo: value.makhtaKhataNo,
        lrAmount: value.LR,
        zpAmount: value.ZP,
        gvAmount: value.VP,
        addlLandRevenue: value.addlLandRevenue,
        educationalCess: value.educationalCess,
        addlEducationalCess: value.addlEducationalCess,
        employeeGuaranteeScheme: value.addlEducationalCess,
        localCess: value.localCess,
        otherLocalCess: value.otherLocalCess,
        noticeAmount: value.noticeAmount ? value.noticeAmount : 0,
        preYearNetAmount: value.preYearNetAmount,
        netAmountReceived: value.TotalDemand,
        khataownerName: value.khataOwnerName,
        modeOfPayment: value.modeOfPayment,
        chequeName: value.chequeName,
        ddName: value.ddName,
        chequeAmount: value.chequeAmount,
        ddAmount: value.ddAmount,
        ddBranch: value.ddBranch,
        chequeBranch: value.chequeBranch,
        ddDate: value.ddDate,
        chequeDate: value.chequeDate,
        chequeNumber: value.chequeNumber,
        ddNumber: value.ddNumber,
        receiptNo: value.receiptNo,
        receiptDate: value.receiptDate,
        surveyHissaNo: value.surveyHissaNo,
        amountInWords: toWords.convert(value.netAmount),
      },
    });
    // const article = {
    //   districtCode: districtCode,
    //   talukaCode: talukaCode,
    //   cCode: codeVillage,
    //   revenueYear: revenueYear,
    //   khataNo: khataNumber,
    // };

    // sendRequest(
    //   `${URLS.BaseURL}/landRevenue/getReceiptDetailsByKhataNo`,
    //   'POST',
    //   article,
    //   (res) => {
    //     setTest({
    //       khataNo: res.data.khataNo,
    //       LR: res.data.jmBindumala + res.data.jmDumala + res.data.jmAkrushik,
    //       ZP: res.data.zpBindumala + res.data.zpDumala + res.data.zpAkrushik,
    //       VP: res.data.gpBindumala + res.data.gpDumala + res.data.gpAkrushik,
    //       addLandRevenue: res.data.addlLandRevenue,
    //       educationalCess: res.data.educationalCess,
    //       addlEducationalCess: res.data.addlEducationalCess,
    //       employeeGuaranteeScheme: res.data.employeeGuaranteeScheme,
    //       localCess: res.data.localCess,
    //       otherLocalCess: res.data.otherLocalCess,
    //       TotalDemand: res.data.netAmount,
    //       khataOwnerName: res.data.khataOwnerName,
    //       landReceiveDemandId: res.data.id,
    //       modeOfPayment: res.data.modeOfPayment,
    //       receiptNo: res.data.receiptNo,
    //       chequeName: res.data.chequeName,
    //       ddName: res.data.ddName,
    //       chequeAmount: res.data.chequeAmount,
    //       ddAmount: res.data.ddAmount,
    //       ddBranch: res.data.ddBranch,
    //       chequeBranch: res.data.chequeBranch,
    //       netAmount: res.data.netAmount,
    //       ddDate: moment(res.data.ddDate, 'YYYY-MM-DD').format('DD/MM/YYYY'),
    //       chequeDate: moment(res.data.chequeDate, 'YYYY-MM-DD').format('DD/MM/YYYY'),
    //       chequeNumber: res.data.chequeNumber,
    //       ddNumber: res.data.ddNumber,
    //       surveyHissaNo: res.data.surveyHissaNo,
    //       receiptDate: moment(res.data.receiptDate, 'YYYY-MM-DD').format('DD/MM/YYYY'),
    //       noticeAmount: res.data.noticeAmount,
    //     });
    //     if (res.status === 202) {
    //       history.push({
    //         pathname: '/transactions/receiptPrint',
    //         state: {
    //           district: districtName,
    //           taluka: talukaName,
    //           village: codeVillage,
    //           revenueYear: revenueYear,
    //           khataNo: test.khataNo,
    //           makhtaKhataNo: test.makhtaKhataNo,
    //           lrAmount: test.LR,
    //           zpAmount: test.ZP,
    //           gvAmount: test.VP,
    //           addLandRevenue: test.addLandRevenue,
    //           educationalCess: test.educationalCess,
    //           addlEducationalCess: test.addlEducationalCess,
    //           employeeGuaranteeScheme: test.addlEducationalCess,
    //           localCess: test.localCess,
    //           otherLocalCess: test.otherLocalCess,
    //           noticeAmount: test.noticeAmount,
    //           netAmountReceived: test.TotalDemand,
    //           khataownerName: test.khataOwnerName,
    //           modeOfPayment: test.modeOfPayment,
    //           chequeName: test.chequeName,
    //           ddName: test.ddName,
    //           chequeAmount: test.chequeAmount,
    //           ddAmount: test.ddAmount,
    //           ddBranch: test.ddBranch,
    //           chequeBranch: test.chequeBranch,
    //           ddDate: test.ddDate,
    //           chequeDate: test.chequeDate,
    //           chequeNumber: test.chequeNumber,
    //           ddNumber: test.ddNumber,
    //           receiptNo: test.receiptNo,
    //           receiptDate: test.receiptDate,
    //           surveyHissaNo: test.surveyHissaNo,
    //           amountInWords: toWords.convert(test.netAmount),
    //         },
    //       });
    //     }
    //   },
    // );
    // console.log('the object to be pushed', state);
    // history.push({
    //   pathname: '/transactions/receiptViewPrint',
    //   state: {
    //     receipts: state,
    //     district: districtName,
    //     taluka: talukaName,
    //     village: textVillage,
    //   },
    // });
  };

  const showModal = (record) => {
    // console.log('Record==>>', record);
    setDataInModal({
      id: record.id,
      receiptNo: record.receiptNo,
      receiptDate: record.receiptDate,
      khataNo: record.khataNo,
      khataOwnerName: record.khataOwnerName,
      netAmount: record.netAmount,
      modeOfPayment: record.modeOfPayment,
    });
    setIsModalVisible(true);
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
      title: <FormattedMessage id="oneTimeEntry.form.khataNo" />,
      dataIndex: 'khataNo',
    },
    {
      title: <FormattedMessage id="oneTimeEntry.form.khataOwner" />,
      dataIndex: 'khataOwnerName',
    },
    {
      title: <FormattedMessage id="challanDetails.table.amount" />,
      dataIndex: 'netAmount',
    },
    {
      title: <FormattedMessage id="challanDetails.table.paymentMode" />,
      dataIndex: 'modeOfPayment',
    },
    {
      title: <FormattedMessage id="challanDetails.table.action" />,

      render: (record) => {
        return (
          <>
            {/* <EyeTwoTone onClick={() => showModal(record)} style={{ marginLeft: '10px' }} /> */}
            <Button onClick={() => print(record)} type="primary">
              पावती प्रत
            </Button>
          </>
        );
      },
    },
  ];
  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <PageContainer>
      <Card bordered={true}>
        {/*  <Button
          disabled={printButtonFlag}
          type="primary"
          style={{ float: 'right' }}
          onClick={print}
        >
          <FormattedMessage id="villageReport1.button.print" />
        </Button> */}
        <Row style={{ marginBottom: 10 }}>
          <Col span={19}>
            <VillageSelector
              pageType="withoutYear"
              setCodeVillage={setCodeVillage}
              setTextForVillage={setTextVillage}
              onVillageChange={(setPrintButtonFlag, setFlagButton, setstate)}
              yearChange={setRevenueYear}
              setIsNirank={setIsNirank}
            />
          </Col>
          <Col xl={5} lg={5} md={24} sm={24} xs={24}>
            <Form.Item
              style={{ marginTop: 10 }}
              labelCol={{ lg: 12 }}
              wrapperCol={{ lg: 12 }}
              label={<FormattedMessage id="villageSelector.label.revenueYear" />}
            >
              <Select
                // style={{ width: 200, marginRight: '15px' }}
                options={revenueYearForVillage}
                // value={revenueYearForVillage}
                placeholder={'महसूल वर्ष'}
                onChange={(value, event) => onYearChange(value, event)}
                // disabled
              ></Select>
            </Form.Item>
          </Col>
        </Row>
        {/* <Row style={{ marginTop: 30 }}>
          <Col span={6}>
            <RangePicker picker="year" />
          </Col>
          <Col span={6}> */}
        {/* <Form.Item label="Status" rules={[{ required: true }]}>
              <Select style={{ width: 200 }} placeholder="Please Select Status">
                <Select.Option value="Y">Paid</Select.Option>
                <Select.Option value="N">Unpaid</Select.Option>
              </Select.Option>
            </Form.Item> */}
        {/* </Col>
        </Row> */}
        <Button
          /*disabled={flagButton}*/ type="primary"
          style={{ marginTop: 10 }}
          loading={isLoading}
          onClick={() => {
            if (textVillage && revenueYear) {
              getData();
            } else if (textVillage == null) {
              message.info('Please Select Village');
            } else if (revenueYear == null) {
              message.info('Please Select Revenue Year');
            }
          }}
        >
          <FormattedMessage id="challanDetails.table.viewReceipt" />
        </Button>
      </Card>
      <Card
        bordered={true}
        title={<FormattedMessage id="challanDetails.table.receiptDetails" />}
        style={{ marginTop: 10 }}
      >
        {/* <table className={styles.report_table}>
          <tr>
            <th>Sr No.</th>
            <th>Khata No.</th>
            <th>Receipt No.</th>
            <th>Receipt Date</th>
            <th>Challan No.</th>
            <th>Amount</th>
            <th>Action</th>
          </tr>
          <tr>
            <td>123</td>
            <td>a-23</td>
            <td>456</td>
            <td>12/12/22</td>
            <td>xyz-123</td>
            <td>10000/-</td>
            <td>
              <EyeTwoTone style={{ marginLeft: 5 }} />
              <EditTwoTone style={{ marginLeft: 5 }} />
            </td>
          </tr>
        </table> */}

        <Table
          rowKey={(row) => row.id}
          bordered={true}
          columns={columns}
          dataSource={state}
          loading={isLoading}
          pagination={{ pageSize: 10 }}
        />
        <Modal
          width={1000}
          title="Receipts Details"
          visible={isModalVisible}
          okText={'OK'}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <Row style={{ paddingBottom: 10 }}>
            <Col span={10}>
              <Input
                addonBefore="Receipt No"
                disabled
                value={dataInModal && dataInModal.receiptNo}
              />
            </Col>
            <Col span={2}></Col>
            <Col span={10}>
              <Input
                addonBefore="Receipt Date"
                disabled
                value={dataInModal && dataInModal.receiptDate}
              />
            </Col>
          </Row>
          <Row style={{ paddingBottom: 10 }}>
            <Col span={10}>
              <Input addonBefore="Khata No" disabled value={dataInModal && dataInModal.khataNo} />
            </Col>
            <Col span={2}></Col>
            <Col span={10}>
              <Input
                addonBefore="Khata Owner Name"
                disabled
                value={dataInModal && dataInModal.khataOwnerName}
              />
            </Col>
          </Row>
          <Row>
            <Col span={10}>
              <Input addonBefore="Amount" disabled value={dataInModal && dataInModal.netAmount} />
            </Col>
            <Col span={2}></Col>
            <Col span={10}>
              <Input
                addonBefore="Mode Of Payment"
                disabled
                value={dataInModal && dataInModal.modeOfPayment}
              />
            </Col>
          </Row>
        </Modal>
      </Card>
    </PageContainer>
  );
}

export default ReceiptReports;
