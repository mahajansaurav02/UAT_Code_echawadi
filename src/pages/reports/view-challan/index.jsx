import Selector from '@/pages/transactions/common/selector';
import { EditTwoTone, EyeTwoTone } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Input,
  Row,
  Select,
  Form,
  Table,
  Modal,
  message,
  Alert,
  ConfigProvider,
} from 'antd';
import React from 'react';
import styles from './report.module.css';
import { FormattedMessage, useModel } from 'umi';

import { useState, useEffect } from 'react';
import Axios from 'axios';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import BaseURL from '@/URLs/urls';
import URLS from '@/URLs/urls';
import useAxios from '@/components/eComponents/use-axios';
import VillageSelector from '@/components/eComponents/VillageSelector';
const { Option } = Select;

function handleChange(value) {
  // console.log(`selected ${value}`);
}

function onChange(date, dateString) {
  // console.log(date, dateString);
}

function ChallanReports() {
  const { districtName, talukaName, districtCode, talukaCode } = useModel('details');
  const { sendRequest } = useAxios();
  let history = useHistory();
  const { RangePicker } = DatePicker;
  const [isLoading, setIsLoading] = useState(false);
  const [state, setstate] = useState([]);
  const [flagButton, setFlagButton] = useState(true);
  const [textVillage, setTextVillage] = useState('');
  const [village, setVillage] = useState([]);
  const [codeVillage, setCodeVillage] = useState('');
  const [isNirank, setIsNirank] = useState(false);
  const [dataInModal, setDataInModal] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [printButtonFlag, setPrintButtonFlag] = useState(true);
  const [challanData, setChallanData] = useState([]);
  const [moneyStatus, setMoneyStatus] = useState();
  const [revenueYear, setRevenueYear] = useState('2024-25');
  const [allButtonState, setAllButtonState] = useState(false);
  const [revenueYearForVillage, setRevenueYearForVillage] = useState();

  function getJm(jmBindumala, jmDumala, preYearPendingJm) {
    let jm = null;

    if (jmBindumala + jmDumala <= 5) {
      jm = preYearPendingJm;
    } else if (jmBindumala + jmDumala >= 5 && jmBindumala + jmDumala <= 9) {
      jm = preYearPendingJm;
    } else {
      jm = jmBindumala + jmDumala + preYearPendingJm;
    }
    // console.log('jmBindumala kutai re', jmBindumala);
    // console.log('jmDumala kutai re', jmDumala);

    return jm;
  }

  function getZP(
    jmBindumala,
    jmDumala,
    zpAkrushik,
    zpBindumala,
    zpDumala,
    zpSankirn,
    preYearPendingZp,
  ) {
    let zp = null;

    if (jmBindumala + jmDumala < 5) {
      zp = zpAkrushik + zpSankirn + preYearPendingZp;
    } else {
      zp = zpAkrushik + zpBindumala + zpDumala + zpSankirn + preYearPendingZp;
    }

    return zp;
  }

  function getVP(
    jmBindumala,
    jmDumala,
    gpAkrushik,
    gpBindumala,
    gpDumala,
    gpSankirn,
    preYearPendingGp,
  ) {
    let gp = null;

    if (jmBindumala + jmDumala < 5) {
      gp = gpAkrushik + gpSankirn + preYearPendingGp;
    } else {
      gp = gpAkrushik + gpBindumala + gpDumala + gpSankirn + preYearPendingGp;
    }

    return gp;
  }

  const handleOnChangeForStatus = (value, event) => {
    // console.log('current Value for Status', value);
    setMoneyStatus(value);
    setChallanData([]);
    setAllButtonState(false);
  };
  const showModal = (record) => {
    // console.log('Record==>>', record);
    setDataInModal({
      id: record.id,
      challanNo: record.challanNo,
      challanDateForReport: record.challanDateForReport,
      countOfReceipts: record.countOfReceipts,
      totalAmount: record.totalAmount,
      modeOfPayment: record.modeOfPayment,
      challanNo0045: record.challanNo0045,
      totalOfHead0029: record.totalOfHead0029,
      totalOfHead0045: record.totalOfHead0045,
      bankAddress: record.bankAddress,
      bankDepositeDate: record.bankDepositeDate,
      bankName: record.bankName,
      bankReceiptNumber: record.bankReceiptNumber,
      bankReceiptNumber0045: record.bankReceiptNumber0045,
      jmAkrushik: record.jmAkrushik,
      jmSankirn: record.jmSankirn,
      addlLandRevenue: record.addlLandRevenue,
      JM: record.JM,
      ZP: record.ZP,
      VP: record.VP,
      addlEducationalCess: record.addlEducationalCess,
      educationalCess: record.educationalCess,
      employeeGuaranteeScheme: record.employeeGuaranteeScheme,
      receiptNo: record.receiptNo,
    });
    setIsModalVisible(true);
  };
  const handleOk = () => {
    setIsModalVisible(false);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    getRevenueYear();
  }, []);

  const onYearChange = (value, event) => {
    setRevenueYear(value);
    setChallanData();
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

  const getChallan = async () => {
    setIsLoading(true);

    const article = {
      revenueYear: revenueYear,
      districtCode: districtCode,
      talukaCode: talukaCode,
      cCode: codeVillage,
      status: moneyStatus,
    };
    sendRequest(`${URLS.BaseURL}/landRevenue/getChallanDetailsAll`, 'POST', article, (res) => {
      setAllButtonState(true);
      if (res.status === 202) {
        setChallanData(
          res.data.landRevenueDemandData.map((row) => ({
            id: row.id,
            jmAkrushik: row.jmAkrushik + row.preYearPendingNaCess,
            jmSankirn:
              row.jmSankirn +
              row.preYearSankirnJmWith +
              row.preYearSankirnJmWithout +
              row.preYearNoticeFee,
            addlLandRevenue: row.addlLandRevenue + row.preYearPendingAddlLandRevenue,
            JM: getJm(row.jmBindumala, row.jmDumala, row.preYearPendingJm),
            ZP: getZP(
              row.jmBindumala,
              row.jmDumala,
              row.zpAkrushik,
              row.zpBindumala,
              row.zpDumala,
              row.zpSankirn,
              row.preYearPendingZp,
            ),
            VP: getVP(
              row.jmBindumala,
              row.jmDumala,
              row.gpAkrushik,
              row.gpBindumala,
              row.gpDumala,
              row.gpSankirn,
              row.preYearPendingGp,
            ),
            challanNo: row.challanNo,
            challanDateForReport: moment(row.challanDateForReport, 'YYYY-MM-DD').format(
              'DD/MM/YYYY',
            ),
            countOfReceipts: row.countOfReceipts,
            totalAmount: row.totalAmount,
            addlEducationalCess: row.addlEducationalCess,
            educationalCess: row.educationalCess,
            employeeGuaranteeScheme: row.employeeGuaranteeScheme,
            totalOfHead0029: row.totalOfHead0029,
            totalOfHead0045: row.totalOfHead0045,
            challanNo0045: row.challanNo0045,
            modeOfPayment: row.modeOfPayment,
            status: row.status,
            bankName: row.bankName,
            bankAddress: row.bankAddress,
            actualFileName: row.actualFileName,
            bankReceiptPat: row.bankReceiptPath,
            bankReceiptNumber: row.bankReceiptNumber,
            bankReceiptNumber0045: row.bankReceiptNumber0045,
            receiptNo: row.receiptNo,
          })),
        );
        setIsLoading(false);
        setPrintButtonFlag(false);
        message.success('Records Fetched!!');
        setAllButtonState(true);
      } else if (res.status === 204) {
        message.info('No Challans !');
        setIsLoading(false);
        setPrintButtonFlag(true);
      }
    });
  };
  const print = () => {
    if (revenueYear && moneyStatus && allButtonState) {
      // console.log('the object to be pushed', state);
      history.push({
        pathname: '/reports/challan-report-print',
        state: {
          receipts: challanData,
          district: districtName,
          taluka: talukaName,
          village: textVillage,
          status: moneyStatus,
        },
      });
    } else if (!revenueYear) {
      message.info('Please Select Revenue Year');
    } else if (!moneyStatus) {
      message.info('Please Select Money Status');
    } else if (allButtonState === false) {
      message.info('Please Search For Challans');
    }
  };
  const columns = [
    {
      title: <FormattedMessage id="challanDetails.table.challanNo0029" />,
      dataIndex: 'challanNo',
      width: '125px',
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
      title: <FormattedMessage id="challanDetails.table.totalAmount29" />,
      dataIndex: 'totalOfHead0029',
      width: '125px',
    },

    {
      title: <FormattedMessage id="challanDetails.table.challanNo0045" />,
      dataIndex: 'challanNo0045',
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
      title: <FormattedMessage id="challanDetails.table.totalAmount45" />,
      dataIndex: 'totalOfHead0045',
      width: '125px',
    },
    {
      title: <FormattedMessage id="challanDetails.table.challanDate" />,
      dataIndex: 'challanDateForReport',
      width: '125px',
    },
    {
      title: <FormattedMessage id="challanDetails.table.paymentMode" />,
      dataIndex: 'modeOfPayment',
    },
    {
      title: <FormattedMessage id="challanDetails.table.totalAmount" />,
      dataIndex: 'totalAmount',
      width: '125px',
    },
    {
      title: <FormattedMessage id="challanDetails.table.action" />,
      render: (record) => {
        return (
          <>
            <EyeTwoTone onClick={() => showModal(record)} style={{ marginLeft: '10px' }} />
          </>
        );
      },
    },
  ];

  return (
    <div>
      <PageContainer>
        <Card bordered={true}>
          {/* <Button
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
                onVillageChange={(setPrintButtonFlag, setChallanData)}
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
                  value={revenueYear}
                  placeholder={'महसूल वर्ष'}
                  onChange={(value, event) => onYearChange(value, event)}
                  // disabled
                ></Select>
              </Form.Item>
            </Col>
          </Row>

          <Row style={{ marginTop: '25px' }}>
            {/* <Col span={6}>
              <RangePicker picker="year" />
            </Col> */}

            <Col span={12} style={{ marginLeft: '10px' }}>
              <Form.Item
                label={<FormattedMessage id="challanDetails.table.status" />}
                rules={[{ required: true }]}
              >
                <Select
                  onSelect={(value, event) => handleOnChangeForStatus(value, event)}
                  style={{ width: 200 }}
                  placeholder="Please Select Type"
                >
                  <Select.Option value="Deposited">
                    <FormattedMessage id="challanDetails.table.moneyDeposited" />
                  </Select.Option>
                  <Select.Option value="Not Deposited">
                    <FormattedMessage id="challanDetails.table.moneyNotDeposited" />
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Button
            style={{ marginTop: 10 }}
            type="primary"
            loading={isLoading}
            onClick={() => {
              if (codeVillage && moneyStatus) {
                getChallan();
              } else if (!codeVillage) {
                message.info('Please Select Village');
              } else if (!moneyStatus) {
                message.info('Please Select Status');
              }
            }}
          >
            <FormattedMessage id="challanDetails.table.viewChallan" />
          </Button>
        </Card>
        <Card bordered={true} style={{ marginTop: 10 }}>
          <Divider orientation="left">
            <b>
              <FormattedMessage id="challanDetails.table.challanDetails" />
            </b>
          </Divider>

          <ConfigProvider
            theme={{
              token: {
                colorPrimary: '#00b96b',
              },
            }}
          >
            <Table
              // className={styles.tableColor}
              rowKey={(row) => row.id}
              bordered={true}
              columns={columns}
              dataSource={challanData}
              loading={isLoading}
              pagination={{ pageSize: 10 }}
              scroll={{ y: 450, x: 2100 }}
            />
          </ConfigProvider>
          <Modal
            width={1000}
            title="चलनांची माहिती(००२९ व ००४५)"
            visible={isModalVisible}
            okText={'OK'}
            onOk={handleOk}
            onCancel={handleCancel}
          >
            <Row style={{ marginBottom: 10 }}>
              <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                <Input
                  // placeholder={<style color="black" />}
                  addonBefore={<FormattedMessage id="challanDetails.table.receiptNo" />}
                  value={dataInModal && dataInModal.receiptNo}
                  // disabled
                ></Input>
              </Col>
              <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>

              <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                <Input
                  addonBefore={<FormattedMessage id="challanDetails.table.receiptCount" />}
                  // disabled
                  value={dataInModal && dataInModal.countOfReceipts}
                />
              </Col>
            </Row>
            <Row style={{ marginBottom: 10 }}>
              <Col xl={23} lg={23} md={23} sm={23} xs={23}>
                <Alert
                  // message="टीप"
                  description="या पावती/पाव्त्यांसाठी खालील प्रमाणे चलने तयार करावीत."
                  type="info"
                  showIcon
                />
              </Col>
            </Row>

            <Row style={{ marginBottom: 10 }}>
              <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                <Input
                  addonBefore={<FormattedMessage id="challanDetails.table.challanNo0029" />}
                  // disabled
                  value={dataInModal && dataInModal.challanNo}
                />
              </Col>
              <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>

              <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                <Input
                  addonBefore={<FormattedMessage id="challanDetails.table.challanNo0045" />}
                  // disabled
                  value={dataInModal && dataInModal.challanNo0045}
                />
              </Col>
            </Row>
            <Row style={{ marginBottom: 10 }}>
              <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                <Input
                  addonBefore={<FormattedMessage id="challanDetails.table.totalAmount29" />}
                  // disabled
                  value={dataInModal && dataInModal.totalOfHead0029}
                />
              </Col>
              <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>

              <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                <Input
                  addonBefore={<FormattedMessage id="challanDetails.table.totalAmount45" />}
                  // disabled
                  value={dataInModal && dataInModal.totalOfHead0045}
                />
              </Col>
            </Row>
            <Row style={{ marginBottom: 10 }}>
              <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                <Input
                  addonBefore={<FormattedMessage id="generateChallan.table.jm(akrushik)" />}
                  // disabled
                  value={dataInModal && dataInModal.jmAkrushik}
                />
              </Col>
              <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>
              <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                <Input
                  addonBefore={<FormattedMessage id="generateChallan.table.EGS" />}
                  // disabled
                  value={dataInModal && dataInModal.employeeGuaranteeScheme}
                />
              </Col>
            </Row>
            <Row style={{ marginBottom: 10 }}>
              <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                <Input
                  addonBefore={<FormattedMessage id="generateChallan.table.jm(sankirn)" />}
                  // disabled
                  value={dataInModal && dataInModal.jmSankirn}
                />
              </Col>

              <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>
              <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                <Input
                  addonBefore={<FormattedMessage id="generateChallan.table.EduCess" />}
                  // disabled
                  value={dataInModal && dataInModal.educationalCess}
                />
              </Col>
            </Row>
            <Row style={{ marginBottom: 10 }}>
              <Col xl={5} lg={5} md={5} sm={24} xs={24}>
                <Input
                  addonBefore={<FormattedMessage id="generateChallan.table.zp" />}
                  // disabled
                  value={dataInModal && dataInModal.ZP}
                />
              </Col>
              <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>
              <Col xl={5} lg={5} md={5} sm={24} xs={24}>
                <Input
                  addonBefore={<FormattedMessage id="generateChallan.table.jm" />}
                  // disabled
                  value={dataInModal && dataInModal.JM}
                />
              </Col>
              <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>

              <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                <Input
                  addonBefore={<FormattedMessage id="generateChallan.table.AddlEduCess" />}
                  // disabled
                  value={dataInModal && dataInModal.addlEducationalCess}
                />
              </Col>
            </Row>
            <Row style={{ marginBottom: 10 }}>
              <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>
            </Row>
            <Row style={{ marginBottom: 10 }}>
              <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                <Input
                  addonBefore={<FormattedMessage id="generateChallan.table.vp" />}
                  // disabled
                  value={dataInModal && dataInModal.VP}
                />
              </Col>
              <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>
            </Row>
            <Row style={{ marginBottom: 10 }}>
              <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                <Input
                  addonBefore={<FormattedMessage id="generateChallan.table.addLandRevenue" />}
                  // disabled
                  value={dataInModal && dataInModal.addlLandRevenue}
                />
              </Col>
              <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>
            </Row>
            <Divider />
            <Row style={{ marginBottom: 10 }}>
              <Col xl={7} lg={7} md={7} sm={24} xs={24}>
                <Input
                  addonBefore={<FormattedMessage id="challanDetails.table.paymentMode" />}
                  value={dataInModal && dataInModal.modeOfPayment}
                  // disabled
                />
              </Col>
              <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>
              <Col xl={7} lg={7} md={7} sm={24} xs={24}>
                <Input
                  addonBefore={<FormattedMessage id="challanDetails.table.challanDate" />}
                  // disabled
                  value={dataInModal && dataInModal.challanDateForReport}
                />
              </Col>
              <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>

              <Col xl={7} lg={7} md={7} sm={24} xs={24}>
                <Input
                  addonBefore={<FormattedMessage id="challanDetails.table.totalAmount" />}
                  addonAfter={'₹'}
                  // disabled
                  value={dataInModal && dataInModal.totalAmount}
                />
              </Col>
            </Row>
            <Row style={{ marginBottom: 10 }}>
              <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                <Input
                  addonBefore={<FormattedMessage id="challanDetails.table.bankName" />}
                  value={dataInModal && dataInModal.bankName}
                  // disabled
                ></Input>
              </Col>
              <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>
              <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                <Input
                  addonBefore={<FormattedMessage id="challanDetails.table.bankBranch" />}
                  value={dataInModal && dataInModal.bankAddress}
                  // disabled
                ></Input>
              </Col>
            </Row>

            <Row>
              <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                <Input
                  addonBefore={<FormattedMessage id="challanDetails.table.grassChallanNo0029" />}
                  value={dataInModal && dataInModal.bankReceiptNumber}
                  // disabled
                ></Input>
              </Col>
              <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>

              <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                <Input
                  addonBefore={<FormattedMessage id="challanDetails.table.grassChallanNo0045" />}
                  value={dataInModal && dataInModal.bankReceiptNumber0045}
                  // disabled
                ></Input>
              </Col>
            </Row>
          </Modal>

          {/* <table className={styles.report_table}>
            <tr>
              <th>Sr No.</th>
              <th>Khata No.</th>
              <th>Challan No.</th>
              <th>Challan Date</th>
              <th>Bank Name</th>
              <th>Amount</th>
              <th>Action</th>
            </tr>
            <tr>
              <td>123</td>
              <td>a-23</td>
              <td>456</td>
              <td>12/12/22</td>
              <td>Corporation Bank</td>
              <td>10000/-</td>
              <td>
                <EyeTwoTone style={{ marginLeft: 5 }} />
                <EditTwoTone style={{ marginLeft: 5 }} />
              </td>
            </tr>
          </table> */}
        </Card>
      </PageContainer>
    </div>
  );
}

export default ChallanReports;
