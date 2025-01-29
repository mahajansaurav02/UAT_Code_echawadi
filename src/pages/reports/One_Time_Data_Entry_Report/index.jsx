import { PageContainer } from '@ant-design/pro-layout';
import styles from './report.module.css';
import React, { useState, useRef } from 'react';
import { Button, Card, Col, message, Row, Select, Spin } from 'antd';
import { useHistory, useLocation } from 'react-router-dom';
import Axios from 'axios';
import VillageSelector from '@/components/eComponents/VillageSelector';
import BaseURL from '@/URLs/urls';
import { useReactToPrint } from 'react-to-print';
import URLS from '@/URLs/urls';
import useAxios from '@/components/eComponents/use-axios';
import { useModel } from 'umi';
import { FormattedMessage } from 'umi';
import ReactHtmlTableToExcel from 'react-html-table-to-excel';

function OneTimeDataEntryReport() {
  const { districtName, talukaName, servarthId, districtCode, talukaCode } = useModel('details');

  const { sendRequest } = useAxios();
  const [codeVillage, setCodeVillage] = useState('');
  const [textForVillage, setTextForVillage] = useState();
  const [village, setVillage] = useState([]);
  const [tableData, setTableData] = useState();
  const [textVillage, setTextVillage] = useState('');
  const componentRef = useRef();
  const [revenueYear, setRevenueYear] = useState();
  const [isNirank, setIsNirank] = useState(false);
  const [loading, setLoading] = useState(false);

  const history = useHistory();

  const backToHomeButton = () => {
    history.push({ pathname: '/homepage' });
    //history.push({ pathname: '/homepageThalati' });
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const printCss = () => {
    document.getElementById('print_css').style.fontSize = '1vh';
    handlePrint();
    document.getElementById('print_css').style.fontSize = '2vh';
  };

  const getTableData = async () => {
    setLoading(true);

    sendRequest(
      `${URLS.BaseURL}/oneTimeEntry/getReportOneTimeEntryDetails?cCode=${codeVillage}`,
      // `${URLS.BaseURL}/oneTimeEntry/getReportOneTimeEntryDetails?cCode=${codeVillage}&revenueYear=${revenueYear}`,
      'GET',
      null,
      (res) => {
        console.log('full res for One TimeData entry report', res);
        try {
          if (res.data.length <= 0) {
            message.info('No Records Found !');
          } else {
            message.success('Records Fetched!!');
          }
          setTableData(
            res.data.oneTimeEntryData.map((row, index) => ({
              srNo: index + 1,
              id: row.khataNo,
              khataNo: row.khataNo,

              preYearNoticeFee: row.preYearNoticeFee,
              preYearPendingAddlEducationalCess: row.preYearPendingAddlEducationalCess,
              preYearPendingAddlLandRevenue: row.preYearPendingAddlLandRevenue,
              preYearPendingEducationalCess: row.preYearPendingEducationalCess,
              preYearPendingEmployeeGuaranteeScheme: row.preYearPendingEmployeeGuaranteeScheme,
              preYearPendingGp: row.preYearPendingGp,
              preYearPendingJm: row.preYearPendingJm,
              preYearPendingNaCess: row.preYearPendingNaCess,
              preYearPendingZp: row.preYearPendingZp,
              preYearSankirnJmWith: row.preYearSankirnJmWith,
              preYearSankirnJmWithout: row.preYearSankirnJmWithout,
              netPending: row.netPending,
            })),
          );
          setLoading(false);
        } catch (err) {
          console.log(err, 'Error in ----getTableData-----');
        }
      },
    );
  };

  return (
    <>
      <Card>
        <Row>
          <Col span={8}>
            <Button type="primary" onClick={printCss}>
              <FormattedMessage id="formLanguage.button.print" />
            </Button>
          </Col>
          <Col span={8}>
            <h1 style={{ textAlign: 'center' }}>
              <FormattedMessage id="OneTimeDataEntryReport.table.Title" />
            </h1>
          </Col>
          <Col span={8}>
            <Button style={{ float: 'right' }} onClick={backToHomeButton} type="primary">
              <FormattedMessage id="formLanguage.form.backhomeButton" />
            </Button>
          </Col>
        </Row>
        <Row style={{ marginLeft: '15px' }}>
          <Col xl={22} lg={22} md={22} sm={20} xs={20}>
            <VillageSelector
              pageType="withYear"
              setCodeVillage={setCodeVillage}
              setTextForVillage={setTextForVillage}
              onVillageChange={(setVillage, setTableData)}
              yearChange={setRevenueYear}
              setIsNirank={setIsNirank}
            />
          </Col>
          <Col xl={2} lg={2} md={2} sm={4} xs={4}>
            <Button
              onClick={() => {
                if (textForVillage && revenueYear) {
                  getTableData();
                } else if (textForVillage == null) {
                  message.info('Please Select Village !');
                } else if (revenueYear == null) {
                  message.info('Please Select Revenue Year !');
                }
              }}
              type="primary"
              style={{ marginTop: 10 }}
            >
              <FormattedMessage id="formLanguage.form.getData" />
            </Button>
          </Col>
          {loading === true ? (
            <Spin size="large" style={{ marginLeft: '730px', marginTop: '20px' }} />
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
          <ReactHtmlTableToExcel
            id="test-table-xls-button"
            className="download-table-xls-button"
            table="print_css"
            filename="Reportxls"
            sheet="tablexls"
            buttonText="Download as XLS"
          />
          <table id="print_css" className={styles.report_table} scroll={{ xs: 1000 }}>
            <thead className={styles.tHead}>
              <tr>
                <th colSpan="33">
                  <h2 style={{ textAlign: 'center', color: 'red' }}>
                    <FormattedMessage id="OneTimeDataEntryReport.table.Title" />
                  </h2>
                </th>
              </tr>

              <tr>
                <th colSpan="33">
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
                  <b>
                    <FormattedMessage id="OneTimeDataEntryReport.table.srNo" />
                  </b>
                </th>
                <th>
                  <b>
                    <FormattedMessage id="OneTimeDataEntryReport.table.khataNo" />
                  </b>
                </th>
                <th>
                  <b>
                    <FormattedMessage id="OneTimeDataEntryReport.table.lr" />
                  </b>
                </th>
                <th>
                  <b>
                    <FormattedMessage id="OneTimeDataEntryReport.table.zp" />
                  </b>
                </th>
                <th>
                  <b>
                    <FormattedMessage id="OneTimeDataEntryReport.table.vp" />
                  </b>
                </th>
                <th>
                  <b>
                    <FormattedMessage id="OneTimeDataEntryReport.table.AddlLandRevenue" />
                  </b>
                </th>
                <th>
                  <b>
                    <FormattedMessage id="OneTimeDataEntryReport.table.EducationalCess" />
                  </b>
                </th>
                <th>
                  <b>
                    <FormattedMessage id="OneTimeDataEntryReport.table.AddEducationalCess" />
                  </b>
                </th>
                <th>
                  <b>
                    <FormattedMessage id="OneTimeDataEntryReport.table.EmployeeGuaranteeScheme" />
                  </b>
                </th>
                <th>
                  <b>
                    <FormattedMessage id="OneTimeDataEntryReport.table.NaCess" />
                  </b>
                </th>
                <th>
                  <b>
                    <FormattedMessage id="OneTimeDataEntryReport.table.SankirnJmWith" />
                  </b>
                </th>

                <th>
                  <b>
                    <FormattedMessage id="OneTimeDataEntryReport.table.SankirnOtherLocalCess" />
                  </b>
                </th>
                <th>
                  <b>
                    <FormattedMessage id="OneTimeDataEntryReport.table.NoticeFee" />
                  </b>
                </th>
                <th>
                  <b>
                    <FormattedMessage id="OneTimeDataEntryReport.table.netPending" />
                  </b>
                </th>
              </tr>
            </thead>
            <tbody>
              {this.props.dataToMap &&
                this.props.dataToMap.map((r, i) => (
                  <tr>
                    <td>{r.srNo}</td>
                    <td>{r.khataNo}</td>

                    <td>{r.preYearPendingJm}</td>
                    <td>{r.preYearPendingZp}</td>
                    <td>{r.preYearPendingGp}</td>
                    <td>{r.preYearPendingAddlLandRevenue}</td>
                    <td>{r.preYearPendingEducationalCess}</td>
                    <td>{r.preYearPendingAddlEducationalCess}</td>
                    <td>{r.preYearPendingEmployeeGuaranteeScheme}</td>
                    <td>{r.preYearPendingNaCess}</td>
                    <td>{r.preYearSankirnJmWith}</td>
                    <td>{r.preYearSankirnJmWithout}</td>
                    <td>{r.preYearNoticeFee}</td>
                    <td>{r.netPending}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default OneTimeDataEntryReport;
