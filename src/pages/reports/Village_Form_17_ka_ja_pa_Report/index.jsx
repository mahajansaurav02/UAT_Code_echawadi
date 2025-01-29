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

function DemandGenerationReport1() {
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
      //       `${URLS.BaseURL}/landRevenue/getLandRevenueDemandDetails?districtCode=${districtCode}&talukaCode=${talukaCode}&cCode=${codeVillage}&activeFlag=E&revenueYear=${revenueYear}
      // `,
      `${URLS.BaseURL}/form17NoKaJaPa/getReportForm17NoKaJaPa?cCode=${codeVillage}`,
      // `${URLS.BaseURL}/form17NoKaJaPa/getReportForm17NoKaJaPa?cCode=${codeVillage}&revenueYear=${revenueYear}`,
      'GET',
      null,
      (res) => {
        console.log('full res for demand geenration report getReportForm17NoKaJaPa', res);
        try {
          if (res.data.length <= 0) {
            message.info('No Records Found !');
          } else {
            message.success('Records Fetched!!');
          }
          setTableData(
            res.data.form17NoKaJaPaData.map((row, index) => ({
              srNo: index + 1,
              id: row.khataNo,
              khataNo: row.khataNo,
              surveyHissaNo: row.surveyHissaNo,
              totalArea: row.totalArea,
              uomOfTotalArea: row.uomOfTotalArea,
              assessment: row.assessment,
              personLiable: row.personLiable,
              orderNo: row.orderNo,
              areaAffected: row.areaAffected,
              uomOfTotalArea: row.uomOfTotalArea,
              areaAffected: row.areaAffected,
              amountOfJm: row.amountOfJm,
              amountOfZp: row.amountOfZp,
              amountOfGp: row.amountOfGp,
              prayojanType: row.prayojanType,
              locationOfLand: row.locationOfLand,
            })),
          );
          setLoading(false);
        } catch (err) {
          console.log(err, 'error in getTableData block');
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
            <h1 style={{ textAlign: 'center' }}>कजाप न झालेल्या बिनशेती जमिनी</h1>
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
            <thead>
              <tr>
                <th colSpan="33">
                  <h2 style={{ textAlign: 'center' }}>कजाप न झालेल्या बिनशेती जमिनी</h2>
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
                    <FormattedMessage id="formLanguage.form.serialNo" />
                  </b>
                </th>
                <th>
                  <b>
                    <FormattedMessage id="villageForm17.form.khataNo" defaultMessage="खाता क्र" />
                  </b>
                </th>
                <th>
                  <b>
                    <FormattedMessage id="villageForm17.form.surveyHissaNo" />
                  </b>
                </th>
                <th>
                  <b>
                    <FormattedMessage id="formLanguage.table.totalArea" />
                  </b>
                </th>

                <th>
                  <b>
                    <FormattedMessage id="formLanguage.form.assessment" defaultMessage="क्षेत्र" />
                  </b>
                </th>
                <th>
                  <b>
                    <FormattedMessage id="villageForm17.table.personLiable" />
                  </b>
                </th>
                <th>
                  <b>
                    {' '}
                    <FormattedMessage id="villageForm17.table.Non-agriculturalOrderNo" />
                  </b>
                </th>
                <th>
                  <b>
                    {' '}
                    <FormattedMessage id="villageForm17.table.non-cultivatedArea" />
                  </b>
                </th>
                <th>
                  <b>
                    <FormattedMessage id="villageForm17.table.LocationOfNon-agriculturalAreas" />
                  </b>
                </th>
                <th>
                  <h3>
                    <b>प्रयोजन</b>
                  </h3>
                </th>
                <th>
                  <b>
                    <FormattedMessage id="villageForm17.table.amountOfLR" />
                  </b>
                </th>
                <th>
                  <b>
                    <FormattedMessage id="villageForm17.table.amountOfLC" />
                  </b>
                </th>
                <th>
                  <b>
                    <FormattedMessage id="villageForm17.table.amountOfVP" />
                  </b>
                </th>
              </tr>
            </thead>
            <tbody>
              {this.props.dataToMap &&
                this.props.dataToMap.map((r, i) => (
                  <tr>
                    <td>{i + 1}</td>
                    <td>{r.khataNo}</td>
                    <td>{r.surveyHissaNo}</td>
                    <td>{r.totalArea}</td>
                    <td>{r.assessment}</td>
                    <td>{r.personLiable} </td>

                    <td>{r.orderNo}</td>
                    <td>0</td>
                    <td>
                      {r.locationOfLand != '' ? <FormattedMessage id={r.locationOfLand} /> : ''}
                    </td>
                    <td>{r.prayojanType}</td>

                    <td>{r.amountOfJm}</td>
                    <td>{r.amountOfZp}</td>
                    <td>{r.amountOfGp}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default DemandGenerationReport1;
