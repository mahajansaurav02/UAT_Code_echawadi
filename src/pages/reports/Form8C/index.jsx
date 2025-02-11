import VillageSelector from '@/components/eComponents/VillageSelector';
import { Button, Card, Col, message, Row, Select, Spin, Form } from 'antd';

import styles from './ReceiptReportPrint.module.css';
import React, { useRef, useState } from 'react';
import { useHistory, useModel, FormattedMessage } from 'umi';
import { useReactToPrint } from 'react-to-print';
import URLS from '@/URLs/urls';
import useAxios from '@/components/eComponents/use-axios';
import ReactHtmlTableToExcel from 'react-html-table-to-excel';
import { useEffect } from 'react';

function Report8C() {
  const [codeVillage, setCodeVillage] = useState('');
  const [textForVillage, setTextForVillage] = useState();
  const [village, setVillage] = useState([]);
  const [tableData, setTableData] = useState();
  const [revenueYear, setRevenueYear] = useState('2024-25');
  const [isNirank, setIsNirank] = useState(false);
  const componentRef = useRef();
  const { sendRequest } = useAxios();
  const { districtName, talukaName, districtCode, talukaCode } = useModel('details');
  const [loading, setLoading] = useState(false);
  const [revenueYearForVillage, setRevenueYearForVillage] = useState();

  const history = useHistory();

  useEffect(() => {
    getRevenueYear();
  }, []);

  const backToHomeButton = () => {
    history.push({ pathname: '/homepage' });
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const onYearChange = (value, event) => {
    setRevenueYear(value);
  };

  const getRevenueYear = async () => {
    sendRequest(`${URLS.BaseURL}/revenueYear/getRevenueYearData`, 'GET', null, (res) => {
      //var data = res.data?.revenueYearData?.slice(0, 2);
      var data = res.data?.revenueYearData;
      setRevenueYearForVillage(
        // res.data.revenueYearData.map((row) => ({
        data.map((row) => ({
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
      // `${URLS.BaseURL}/reports/landRevenueForm8B?cCode=${codeVillage}&revenueYear=${revenueYear}&districtCode=${districtCode}&talukaCode=${talukaCode}`,
      //---8 Jan 2024
      revenueYear == '2023-24'
        ? `${URLS.BaseURL}/reports/landRevenueForm8BViewPre?cCode=${codeVillage}&revenueYear=${revenueYear}&districtCode=${districtCode}&talukaCode=${talukaCode}`
        : `${URLS.BaseURL}/reports/landRevenueForm8BView?cCode=${codeVillage}&revenueYear=${revenueYear}&districtCode=${districtCode}&talukaCode=${talukaCode}`,

      'POST',
      null,
      (res) => {
        setTableData(
          res.data
            .filter((r) => {
              if (
                r.addlEducationalCess > 0 ||
                r.educationalCess > 0 ||
                r.employeeGuaranteeScheme > 0 ||
                r.preYearPendingEducationalCess > 0 ||
                r.preYearPendingAddlEducationalCess > 0 ||
                r.preYearPendingEmployeeGuaranteeScheme > 0
              )
                return res.data;
            })
            .map((r, i) => ({
              srNo: i + 1,
              id: r.id,
              khataNo: r.khataNo,
              khataOwnerName: r.khataOwnerName,
              educationalCess: r.educationalCess,
              addlEducationalCess: r.addlEducationalCess,
              employeeGuaranteeScheme: r.employeeGuaranteeScheme,
              preYearPendingEducationalCess: r.preYearPendingEducationalCess,
              preYearPendingAddlEducationalCess: r.preYearPendingAddlEducationalCess,
              preYearPendingEmployeeGuaranteeScheme: r.preYearPendingEmployeeGuaranteeScheme,
              currentYear: r.currentYear,
              totalDemand: r.totalDemand,
              receiptNo: r.receiptNo,
              receiptDate: r.receiptDate,
              netPending: r.netPending,
              netReceived: r.netReceived,
              amountRecovered: r.amountRecovered,
              balanceForRecovery: r.balanceForRecovery,
              challanNoCreditInTreasury: r.challanNoCreditInTreasury,
              challanDate: r.challanDate,
              challanNo: r.challanNo,
              remarks: r.remarks,
            })),
          // message.success('Records Fetched!!'),
        );
        setLoading(false);
      },
      (err) => {
        message.error('Report Details Not Found');

        setLoading(false);
      },
    );
  };

  return (
    <>
      <Card>
        <Row>
          <Col span={8}>
            <Button type="primary" onClick={handlePrint}>
              <FormattedMessage id="formLanguage.button.print" />
            </Button>
          </Col>
          <Col span={8}>
            <h1 style={{ textAlign: 'center' }}>
              <FormattedMessage id="villageForm8c.form.villageForm8c" />
            </h1>
          </Col>
          <Col span={8}>
            <Button style={{ float: 'right' }} onClick={backToHomeButton} type="primary">
              <FormattedMessage id="formLanguage.form.backhomeButton" />
            </Button>
          </Col>
        </Row>
        <Row style={{ marginBottom: 10 }}>
          <Col span={16}>
            <VillageSelector
              pageType="withoutYear"
              setCodeVillage={setCodeVillage}
              setTextForVillage={setTextForVillage}
              onVillageChange={(setVillage, setTableData)}
              yearChange={setRevenueYear}
              setIsNirank={setIsNirank}
            />
          </Col>
          <Col xl={3} lg={3} md={24} sm={24} xs={24}>
            <Form.Item
              style={{ marginTop: 10, marginLeft: -440 }}
              labelCol={{ lg: 12 }}
              wrapperCol={{ lg: 12 }}
              label={<FormattedMessage id="villageSelector.label.revenueYear" />}
            >
              <Select
                // style={{ width: 200, marginRight: '15px' }}
                options={revenueYearForVillage}
                style={{ width: 142 }}
                value={revenueYear}
                placeholder={'महसूल वर्ष'}
                onChange={(value, event) => onYearChange(value, event)}
                // disabled
              ></Select>
            </Form.Item>
          </Col>
          <Col xl={2} lg={2} md={2} sm={4} xs={4}>
            <Button
              /* onClick={getTableData} */ onClick={() => {
                if (textForVillage) {
                  getTableData();
                } else if (textForVillage == null) {
                  message.info('Please Select Village');
                }
              }}
              type="primary"
              style={{ marginTop: 10 }}
            >
              <FormattedMessage id="formLanguage.form.getData" />
            </Button>
          </Col>

          {loading === true ? (
            <Spin size="large" style={{ marginLeft: '540px', marginTop: '20px' }} />
          ) : null}
        </Row>
      </Card>
      <ComponentToPrint
        ref={componentRef}
        village={textForVillage}
        taluka={talukaName}
        district={districtName}
        dataToMap={tableData}
      />
    </>
  );
}
class ComponentToPrint extends React.Component {
  render() {
    return (
      <div style={{ padding: '13px' }}>
        <div className="report">
          <Card>
            <ReactHtmlTableToExcel
              id="test-table-xls-button"
              className="download-table-xls-button"
              table="table-to-xls"
              filename="Reportxls"
              sheet="tablexls"
              buttonText="Download as XLS"
            />
            <table id="table-to-xls" className={styles.table}>
              <thead>
                <tr>
                  <th colSpan="30">
                    <h3 style={{ color: 'red' }}>
                      <b>
                        <FormattedMessage id="villageForm8c.form.villageForm8c" />
                      </b>
                    </h3>
                  </th>
                </tr>

                <tr>
                  <th colSpan="30">
                    <h3 style={{ color: 'red' }}>
                      <FormattedMessage id="villageForm8c.form.villageForm8cname" />
                    </h3>
                  </th>
                </tr>
                <tr>
                  <th colSpan="30">
                    <h3 style={{ color: 'red' }}>
                      <b>
                        <FormattedMessage id="villageForm8c.form.departmentNm" />
                      </b>
                    </h3>
                  </th>
                </tr>

                <tr>
                  <th colSpan="30">
                    <h4 style={{ color: 'red' }}>
                      <pre>
                        <b>
                          गाव-{this.props.village} तालुका-{this.props.taluka} जिल्हा-
                          {this.props.district}
                        </b>
                      </pre>
                    </h4>
                  </th>
                </tr>

                <tr>
                  <th rowSpan="2">
                    <b>
                      <FormattedMessage id="formLanguage.form.serialNo" />
                    </b>
                  </th>
                  <th rowSpan="2">
                    <b>
                      <FormattedMessage id="villageForm8c.form.khataNo" />
                    </b>
                  </th>
                  <th rowSpan="2">
                    <b>
                      <FormattedMessage id="villageForm8c.form.nameOfPerson" />
                    </b>
                  </th>

                  <th colSpan="3">
                    <b>
                      <FormattedMessage id="villageForm8c.form.arrears" />
                    </b>
                  </th>

                  <th colSpan="3">
                    <b>
                      <FormattedMessage id="villageForm8c.form.currentYear" />
                    </b>
                  </th>
                  <th rowSpan={2}>
                    <b>
                      <FormattedMessage id="villageForm8c.form.totalDemand" />
                    </b>
                  </th>
                  <th rowSpan={2}>
                    <b>
                      <FormattedMessage id="villageForm8c.form.receiptNoAmtRecovered" />
                    </b>
                  </th>

                  <th rowSpan={2}>
                    <b>
                      <FormattedMessage id="villageForm8c.form.amountForRecovered" />
                    </b>
                  </th>
                  <th rowSpan={2}>
                    <b>
                      <FormattedMessage id="villageForm8c.form.balanceRecovery" />
                    </b>
                  </th>
                  <th rowSpan={3}>
                    <b>
                      <FormattedMessage id="villageForm8c.form.challanNoCredit" />
                      <br />
                      (0045)
                    </b>
                  </th>

                  <th rowSpan={2}>
                    <b>
                      <FormattedMessage id="villageForm8c.form.remarks" />
                    </b>
                  </th>
                </tr>
                <tr>
                  <th>शिक्षण उपकर </th>
                  <th>वाढीव शिक्षण उपकर </th>

                  <th>रो.ह उपकर </th>
                  <th>शिक्षण उपकर </th>
                  <th>वाढीव शिक्षण उपकर </th>

                  <th>रो.ह उपकर </th>
                </tr>
              </thead>
              <tbody>
                {this.props.dataToMap &&
                  this.props.dataToMap.map((r, i) => (
                    <tr>
                      <td>{r.srNo}</td>
                      <td>{r.khataNo}</td>

                      <td>{r.khataOwnerName}</td>
                      <td>{r.preYearPendingEducationalCess}</td>
                      <td>{r.preYearPendingAddlEducationalCess}</td>
                      <td>{r.preYearPendingEmployeeGuaranteeScheme}</td>
                      <td>{r.educationalCess}</td>
                      <td>{r.addlEducationalCess}</td>
                      <td>{r.employeeGuaranteeScheme}</td>
                      <td>
                        {r.preYearPendingEducationalCess +
                          r.preYearPendingAddlEducationalCess +
                          r.preYearPendingEmployeeGuaranteeScheme +
                          r.educationalCess +
                          r.addlEducationalCess +
                          r.employeeGuaranteeScheme}
                      </td>
                      <td>
                        {r.receiptNo}-{r.receiptDate}
                      </td>
                      <td>
                        {r.preYearPendingEducationalCess +
                          r.preYearPendingAddlEducationalCess +
                          r.preYearPendingEmployeeGuaranteeScheme +
                          r.educationalCess +
                          r.addlEducationalCess +
                          r.employeeGuaranteeScheme}
                      </td>
                      <td>{0}</td>

                      <td>
                        {r.challanNo}-{r.challanDate}
                      </td>
                      <td>{r.remarks}</td>
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
export default Report8C;
