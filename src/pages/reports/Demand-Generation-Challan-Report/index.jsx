import React, { useState, useEffect, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card, Col, message, Row, Select, Form, Spin } from 'antd';
import { useReactToPrint } from 'react-to-print';
import { useHistory, useLocation } from 'react-router-dom';
import Axios from 'axios';
import styles from './report.module.css';
import { FormattedMessage } from 'umi';
import BaseURL from '@/URLs/urls';
import URLS from '@/URLs/urls';
import useAxios from '@/components/eComponents/use-axios';
import VillageSelector from '@/components/eComponents/VillageSelector';
import { useModel } from 'umi';

function DemandGenerationChallan() {
  const { districtName, talukaName, districtCode, talukaCode } = useModel('details');
  const { sendRequest } = useAxios();
  const componentRef = useRef();
  const location = useLocation(); //location.state?.receipts
  //  const [totalAmount, setTotalAmount] = useState(0);
  const [textVillage, setTextVillage] = useState();
  const [isNirank, setIsNirank] = useState(false);
  const [codeVillage, setCodeVillage] = useState('');
  const [village, setVillage] = useState([]);
  const [tableData, setTableData] = useState();
  const history = useHistory();
  const [revenueYear, setRevenueYear] = useState('2025-26');
  const [moneyStatus, setMoneyStatus] = useState();
  const [loading, setLoading] = useState(false);
  const [revenueYearForVillage, setRevenueYearForVillage] = useState();

  useEffect(() => {
    getRevenueYear();
  }, []);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const backToHomeButton = () => {
    history.push({ pathname: '/homepage' });
  };

  const handleOnChangeForStatus = (value, event) => {
    setMoneyStatus(value);
    setTableData([]);
  };

  const onYearChange = (value, event) => {
    setRevenueYear(value);
    setTableData();
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

  const getTableData = async () => {
    setLoading(true);

    sendRequest(
      `${URLS.BaseURL}/reports/landRevenueForm8B?cCode=${codeVillage}&revenueYear=${revenueYear}&districtCode=${districtCode}&talukaCode=${talukaCode}`,
      'POST',
      null,
      (res) => {
        setTableData(
          res.data
            .filter((obj) => obj.isMoneyepositedBank === moneyStatus)
            .map((r) => ({
              khataNo: r.khataNo,
              status: r.status,
              khataOwnerName: r.khataOwnerName,
              Bindumala: r.jmBindumala + r.zpBindumala + r.gpBindumala,
              Dumala: r.jmDumala + r.zpDumala + r.gpDumala,
              jmAkrushik: r.jmAkrushik + r.zpAkrushik + r.gpAkrushik,
              Sankirn: r.jmSankirn + r.zpSankirn + r.gpSankirn,
              Vajasut: r.jmVajasut + r.zpVajasut + r.gpVajasut,
              addlLandRevenue: r.addlLandRevenue,
              educationalCess: r.educationalCess,
              addlEducationalCess: r.addlEducationalCess,
              employeeGuaranteeScheme: r.employeeGuaranteeScheme,
              preYearPending:
                r.preYearPendingJm +
                r.preYearPendingZp +
                r.preYearPendingGp +
                r.preYearPendingAddlLandRevenue +
                r.preYearPendingEducationalCess +
                r.preYearPendingAddlEducationalCess +
                r.preYearPendingEmployeeGuaranteeScheme,
              receiptNo: r.receiptNo,
              netAmount: r.netAmount,
              netReceived: r.netReceived,
              netPending: r.netPending,
              amountOfZp: r.amountOfZp,
              amountOfJm: r.amountOfJm,
              netAmountReceived: r.netAmountReceived,
              netAmount: r.netAmount,
              sanikirn: r.sanikirn,
              challanNo: r.challanNo,
              challanDate: r.challanDate,
              landReceiveForm17Id: r.landReceiveForm17Id,
            })),
        );
        setLoading(false);
      },
      (err) => {
        message.error('Reports Details Not Found');

        setLoading(false);
      },
    );
  };
  return (
    <div>
      <Card>
        <h1 style={{ textAlign: 'center' }}>मागणी निश्चिती अहवाल</h1>
        <div style={{ padding: 10 }}>
          <Button type="primary" onClick={handlePrint}>
            <FormattedMessage id="villageReport1.button.print" />
          </Button>
          <Button style={{ float: 'right' }} onClick={backToHomeButton} type="primary">
            <FormattedMessage id="villageReport1.button.home" />
          </Button>
        </div>
        <Row style={{ marginBottom: 10 }}>
          <Col span={19}>
            <VillageSelector
              pageType="withoutYear"
              setCodeVillage={setCodeVillage}
              setTextForVillage={setTextVillage}
              onVillageChange={(setVillage, setTableData)}
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
        <Row style={{ marginTop: '10px' }}>
          <Col span={6} style={{ marginLeft: '10px' }}>
            <Form.Item
              label={<FormattedMessage id="challanDetails.table.status" />}
              rules={[{ required: true }]}
            >
              <Select
                onSelect={(value, event) => handleOnChangeForStatus(value, event)}
                style={{ width: 200 }}
                placeholder="Please Select Type"
              >
                <Select.Option value="Y">
                  <FormattedMessage id="challanDetails.table.moneyDeposited" />
                </Select.Option>
                <Select.Option value="N">
                  <FormattedMessage id="challanDetails.table.moneyNotDeposited" />
                </Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={4}>
            <Button
              onClick={() => {
                if (textVillage && revenueYear && moneyStatus) {
                  getTableData();
                } else if (textVillage == null) {
                  message.info('Please Select Village');
                } else if (revenueYear == null) {
                  message.info('Please Select Revenue Year');
                } else if (moneyStatus == null) {
                  message.info('Please Select Money Status');
                }
              }}
              type="primary"
            >
              <FormattedMessage id="villageReport1.button.getData" />
            </Button>
          </Col>
          {loading === true ? (
            <Spin size="large" style={{ marginLeft: '100px', marginTop: '20px' }} />
          ) : null}
        </Row>
      </Card>
      <ComponentToPrint
        ref={componentRef}
        village={textVillage}
        taluka={talukaName}
        district={districtName}
        dataToMap={tableData}
        //   totalAmount={totalAmount}
      />
    </div>
  );
}
class ComponentToPrint extends React.Component {
  render() {
    return (
      <div>
        <div className="report">
          <Card>
            <table className={styles.report_table}>
              <thead>
                <tr>
                  <th colSpan="32">
                    <h2 style={{ textAlign: 'center', color: 'red' }}>मागणी निश्चिती अहवाल </h2>
                  </th>
                </tr>

                <tr>
                  <th colSpan="32">
                    <h4 style={{ color: 'red' }}>
                      <pre>
                        <b>
                          <FormattedMessage id="formLanguage.form.village" />-{this.props.village}{' '}
                          <FormattedMessage id="formLanguage.form.taluka" />-{this.props.taluka}{' '}
                          <FormattedMessage id="formLanguage.form.district" />-{this.props.district}
                        </b>
                      </pre>
                    </h4>
                  </th>
                </tr>

                <tr>
                  <th>
                    <b>खाता क्र</b>
                  </th>
                  <th>
                    <b>खातेदाराचे नाव</b>
                  </th>

                  <th>
                    <b>मागील-वर्ष प्रलंबित रक्कम</b>
                  </th>
                  <th>
                    <b>बिनदुमाला</b>
                  </th>

                  <th>
                    <b>दुमाला</b>
                  </th>
                  <th>
                    <b>वजासुट</b>
                  </th>
                  <th>
                    <b>अकृषिक</b>
                  </th>
                  <th>
                    <b>संकीर्ण</b>
                  </th>

                  <th>
                    <b>पावती क्रमांक आणि तारीख</b>
                  </th>

                  <th>
                    <b>वाढीव जमीन महसूल</b>
                  </th>
                  <th>
                    <b>शिक्षण उपकर</b>
                  </th>
                  <th>
                    <b>वाढीव शिक्षण उपकर</b>
                  </th>

                  <th>
                    <b>रो.ह. उपकर</b>
                  </th>
                  <th>
                    <b>एकूण रक्कम</b>
                  </th>
                  <th>
                    <b>कोषागारमध्ये भरल्याचा दिनांक</b>
                  </th>
                  <th>
                    <b>चलन क्र</b>
                  </th>
                </tr>
              </thead>
              <tbody>
                {this.props.dataToMap &&
                  this.props.dataToMap.map((r, i) => (
                    <tr>
                      <td>{r.khataNo}</td>
                      <td>{r.khataOwnerName}</td>
                      <td>{r.preYearPending} </td>
                      <td>{r.Bindumala}</td>
                      <td>{r.Dumala}</td>
                      <td>{r.Vajasut}</td>
                      <td>{r.jmAkrushik}</td>
                      <td>{r.Sankirn}</td>
                      <td>{r.receiptNo}</td>
                      <td>{r.addlLandRevenue}</td>
                      <td>{r.educationalCess}</td>
                      <td>{r.addlEducationalCess}</td>
                      <td>{r.employeeGuaranteeScheme}</td>
                      <td>{r.netAmount}</td>
                      <td>{r.challanDate}</td>

                      <td>{r.challanNo}</td>

                      {/*  <td>{r.jmAkrushik}</td>
                    <td>{r.zpAkrushik}</td>
                    <td>{r.gpAkrushik}</td>
                    <td>{r.jmVajasut}</td>
                    <td>{r.zpVajasut}</td>
                    <td>{r.gpVajasut}</td> */}

                      {/* <td>{r.preYearPendingJm}</td>
                    <td>{r.preYearPendingZp}</td>
                    <td>{r.preYearPendingGp}</td>
                    <td>{r.preYearPendingAddlLandRevenue}</td>
                    <td>{r.preYearPendingEducationalCess}</td>
                    <td>{r.preYearPendingAddlEducationalCess}</td>
                    <td>{r.preYearPendingEmployeeGuaranteeScheme}</td>
                    <td>{r.miscellaneousAmount}</td> */}
                    </tr>
                  ))}
              </tbody>
            </table>
          </Card>
        </div>
      </div>
    );
  }
}

export default DemandGenerationChallan;
