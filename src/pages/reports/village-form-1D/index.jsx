import { PageContainer } from '@ant-design/pro-layout';
import styles from './report.module.css';
import React, { useState, useRef, useEffect } from 'react';
import { Alert, Button, Card, Col, message, Row, Select, Spin } from 'antd';
import { useHistory, useLocation } from 'react-router-dom';
import Axios from 'axios';
import VillageSelector from '@/components/eComponents/VillageSelector';
import BaseURL from '@/URLs/urls';
import URLS from '@/URLs/urls';
import useAxios from '@/components/eComponents/use-axios';
import { useReactToPrint } from 'react-to-print';
import { useModel } from 'umi';
import { FormattedMessage } from 'umi';
import ReactHtmlTableToExcel from 'react-html-table-to-excel';

let prevTotalArea = 0,
  prevAssessment = 0,
  prevIrrigatedArea = 0,
  prevUnIrrigatedArea = 0;

function Report() {
  const { districtName, talukaName, districtCode, talukaCode } = useModel('details');
  const { sendRequest } = useAxios();
  const [codeVillage, setCodeVillage] = useState('');
  const [isNirank, setIsNirank] = useState(false);
  const [textForVillage, setTextForVillage] = useState();
  const [village, setVillage] = useState([]);
  const [tableData, setTableData] = useState();
  const [textVillage, setTextVillage] = useState('');
  const componentRef = useRef();
  const [revenueYear, setRevenueYear] = useState();
  const [loadings, setLoadings] = useState([]);

  const history = useHistory();

  const backToHomeButton = () => {
    history.push({ pathname: '/homepage' });
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
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
    }, 2000);
  };

  useEffect(() => {
    (prevTotalArea = 0), (prevAssessment = 0), (prevIrrigatedArea = 0), (prevUnIrrigatedArea = 0);
  }, []);

  const getTableData = async () => {
    (prevTotalArea = 0), (prevAssessment = 0), (prevIrrigatedArea = 0), (prevUnIrrigatedArea = 0);

    sendRequest(
      `${URLS.BaseURL}/form1d/getForm1DReport?districtCode=${districtCode}&talukaCode=${talukaCode}&cCode=${codeVillage}`,
      'GET',
      null,
      (res) => {
        setTableData(
          res.data.form1DData.map((r) => ({
            id: r.id,
            surveyNumber:
              r.hissaNo == null || r.hissaNo.trim() == '' ? r.pin : r.pin + '/' + r.hissaNo,
            hissaNo: r.hissaNo,
            totalAreaH: r.totalAreaH,
            assessment: r.assessment,
            remarks: r.remarks,
            irrigatedArea: r.irrigatedArea,
            unirrigatedArea: r.unirrigatedArea,
            rules: r.rules,
            allTotal: getTotalOfAll(r.totalAreaH, r.assessment, r.irrigatedArea, r.unirrigatedArea),
          })),
        );
        message.success('Records Fetched!!');
      },
    );
  };

  var totalAreaAddition = prevTotalArea.toFixed(4).substring(prevTotalArea.length - 2);
  var totalAreaOfAll = totalAreaAddition
    .substring(0, totalAreaAddition.length - 2)
    .concat('.')
    .concat(totalAreaAddition.substring(totalAreaAddition.length - 2));

  var totalIrriagtedAreaAddition = prevIrrigatedArea
    .toFixed(4)
    .substring(prevIrrigatedArea.length - 2);
  var totalIrrigatedAreaOfAll = totalIrriagtedAreaAddition
    .substring(0, totalIrriagtedAreaAddition.length - 2)
    .concat('.')
    .concat(totalIrriagtedAreaAddition.substring(totalIrriagtedAreaAddition.length - 2));

  var totalUnIrriagtedAreaAddition = prevUnIrrigatedArea
    .toFixed(4)
    .substring(prevUnIrrigatedArea.length - 2);
  var totalUnIrrigatedAreaOfAll = totalUnIrriagtedAreaAddition
    .substring(0, totalUnIrriagtedAreaAddition.length - 2)
    .concat('.')
    .concat(totalUnIrriagtedAreaAddition.substring(totalUnIrriagtedAreaAddition.length - 2));

  return (
    <div>
      <Card>
        <Row>
          <Col span={8}>
            <Button type="primary" onClick={handlePrint}>
              <FormattedMessage id="formLanguage.button.print" />
            </Button>
          </Col>
          <Col span={8}>
            <h1 style={{ textAlign: 'center' }}>
              {' '}
              <FormattedMessage id="formLanguage.form.villageForm1D" />
            </h1>
          </Col>
          <Col span={8}>
            <Button style={{ float: 'right' }} onClick={backToHomeButton} type="primary">
              <FormattedMessage id="formLanguage.form.backhomeButton" />
            </Button>
          </Col>
        </Row>
        <div style={{ padding: 10 }}></div>
        {/* <Row style={{ marginLeft: '15px' }}> */}
        <VillageSelector
          pageType="withoutYear"
          setCodeVillage={setCodeVillage}
          setTextForVillage={setTextForVillage}
          onVillageChange={(setVillage, setTableData)}
          yearChange={setRevenueYear}
          setIsNirank={setIsNirank}
        />
        {!isNirank && (
          <Button
            loading={loadings[0]}
            onClick={() => {
              if (textForVillage) {
                getTableData();
                enterLoading(0);
              } else if (textForVillage == null) {
                message.info('Please Select Village');
              }
            }}
            type="primary"
          >
            <FormattedMessage id="formLanguage.form.getData" />
          </Button>
        )}

        {/* </Row> */}
      </Card>
      <ComponentToPrint
        ref={componentRef}
        village={textForVillage}
        taluka={talukaName}
        district={districtName}
        dataToMap={tableData}
        isNirank={isNirank}
        netTotalArea={totalAreaOfAll}
        netAssessment={prevAssessment.toFixed(2)}
        netIrrigatedArea={totalIrrigatedAreaOfAll}
        netUnIrrigatedArea={totalUnIrrigatedAreaOfAll}
      />
    </div>
  );
}

function getTotalOfAll(totalAreaH, assessment, irrigatedArea, unirrigatedArea) {
  prevTotalArea += parseFloat(totalAreaH);
  prevAssessment += parseFloat(assessment);
  prevIrrigatedArea += parseFloat(irrigatedArea);
  prevUnIrrigatedArea += parseFloat(unirrigatedArea);
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
            <table id="table-to-xls" className={styles.report_table}>
              <thead>
                <tr>
                  <th colSpan="11">
                    <h3 style={{ color: 'red' }}>
                      <b>
                        {' '}
                        <FormattedMessage id="formLanguage.form.villageForm1D" />
                      </b>
                    </h3>
                  </th>
                </tr>
                <tr>
                  <th colSpan="11">
                    <h3 style={{ color: 'red' }}>
                      <b>
                        {/* <b>
                          {' '}
                          <FormattedMessage id="formLanguage.form.registerShowingLand" />
                        </b> */}
                        कुळवहिवाट कायदा आणि महाराष्ट्र शेतजमीन (जमीनधारणेची कमाल मर्यादा)
                        अधिनियम,1961
                        <br />
                        यांच्या उपबंधानुसार अतिरिक्त म्हणून घोषित केलेल्या जमिनी दर्शविणारी नोंदवही
                      </b>
                    </h3>
                  </th>
                </tr>

                <tr>
                  <th colSpan="11">
                    <h4 style={{ color: 'red' }}>
                      <pre>
                        <b>
                          <FormattedMessage id="villageReport1.label.village" />
                          {this.props.village} <FormattedMessage id="villageReport1.label.taluka" />
                          {this.props.taluka}{' '}
                          <FormattedMessage id="villageReport1.label.district" />
                          {this.props.district}
                        </b>
                      </pre>
                    </h4>
                  </th>
                </tr>

                <tr>
                  <th>
                    <b>अ.क्र</b>
                  </th>
                  <th>
                    <b>भूमापन क्र</b>
                  </th>
                  {/* <th>
                    <b>हिस्सा क्र</b>
                  </th> */}
                  <th>
                    <b>क्षेत्र</b>
                  </th>
                  <th>
                    <b>आकारणी</b>
                  </th>
                  <th colSpan={2}>
                    <b>जमिनीचे वर्गीकरण</b>
                  </th>
                  <th>
                    <b>कायदा</b>
                  </th>
                  <th>
                    <b>तहसीलदार/उपजिल्हाधिकारी - आदेश क्रमांक आणि दिनांक</b>
                  </th>
                </tr>
                <tr>
                  {/* <th></th> */}
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th>जलसिंचित क्षेत्र</th>
                  <th>अजलसिंचित क्षेत्र</th>
                  <th></th>
                  <th></th>
                  {/*  <td></td>
               <td></td>
              <td></td> */}
                </tr>
                <tr>
                  <th>1</th>
                  <th>2</th>
                  <th>3</th>
                  <th>4</th>
                  <th>5</th>
                  <th>6(अ)</th>
                  <th>6(ब)</th>
                  <th>7</th>
                  {/* <th>8</th> */}
                </tr>
              </thead>
              <tbody>
                {this.props.dataToMap &&
                  this.props.dataToMap.map((r, i) => (
                    <tr>
                      <td>{i + 1}</td>
                      <td>{r.surveyNumber}</td>
                      {/* <td>{r.hissaNo}</td> */}
                      <td>
                        {r.totalAreaH
                          .substring(0, r.totalAreaH.length - 2)
                          .concat('.')
                          .concat(r.totalAreaH.substring(r.totalAreaH.length - 2))}
                      </td>
                      <td>{r.assessment}</td>
                      <td>
                        {r.irrigatedArea
                          .substring(0, r.irrigatedArea.length - 2)
                          .concat('.')
                          .concat(r.irrigatedArea.substring(r.irrigatedArea.length - 2))}
                      </td>
                      <td>
                        {r.unirrigatedArea
                          .substring(0, r.unirrigatedArea.length - 2)
                          .concat('.')
                          .concat(r.unirrigatedArea.substring(r.unirrigatedArea.length - 2))}
                      </td>
                      <td>{r.rules}</td>
                      <td>{r.remarks}</td>
                    </tr>
                  ))}

                {this.props.isNirank && (
                  <tr>
                    <th colSpan={18}>
                      {
                        <Alert
                          // message="टीप"
                          description="सदर गाव नमुना निरंक आहे."
                          type="info"
                          showIcon
                          style={{ width: '100%' }}
                        />
                      }
                    </th>
                  </tr>
                )}
                <tr>
                  <td colSpan={2}>
                    <b>
                      <FormattedMessage id="formLanguage.form.total" />
                    </b>
                  </td>
                  <td>
                    <b>{this.props.netTotalArea}</b>
                  </td>
                  <td>
                    <b>{this.props.netAssessment}</b>
                  </td>
                  <td>
                    <b>{this.props.netIrrigatedArea}</b>
                  </td>
                  <td>
                    <b>{this.props.netUnIrrigatedArea}</b>
                  </td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
            <table className={styles.report_table}>
              <tfoot>
                <tr style={{ marginTop: 100 }}>
                  <td colSpan={2} style={{ width: '30px' }}></td>
                  <td colSpan={2}></td>
                  <td colSpan={2} style={{ width: '20px' }}></td>
                  <td colSpan={2}>
                    <h5 style={{ fontSize: '15px' }}>
                      <FormattedMessage id="villageReport1A.table.examined" />
                    </h5>
                  </td>
                  <td colSpan={2}></td>
                  <td colSpan={2}>
                    <h5 style={{ fontSize: '15px' }}>
                      <FormattedMessage id="villageReport1A.table.examined" />
                    </h5>
                  </td>
                  <td colSpan={2}></td>
                </tr>
                <tr style={{ marginTop: 10 }}>
                  <td colSpan={2}></td>
                  <td colSpan={2}>
                    <h5 style={{ fontSize: '15px' }}>
                      <FormattedMessage id="villageReport1A.table.date" />
                    </h5>
                  </td>
                  <td colSpan={2}></td>
                  <td colSpan={2}>
                    <h5 style={{ fontSize: '15px' }}>
                      <FormattedMessage id="villageReport1A.table.date" />
                    </h5>
                  </td>
                  <td colSpan={2}></td>
                  <td colSpan={2}>
                    <h5 style={{ fontSize: '15px' }}>
                      <FormattedMessage id="villageReport1A.table.date" />
                    </h5>
                  </td>
                  <td colSpan={2}></td>
                </tr>
                <tr style={{ marginTop: 20 }}>
                  <td colSpan={2}></td>
                  <td colSpan={2}>
                    <h5 style={{ fontSize: '15px' }}>
                      <FormattedMessage id="villageReport1A.table.sign" />
                    </h5>
                  </td>
                  <td colSpan={2}></td>
                  <td colSpan={2}>
                    <h5 style={{ fontSize: '15px' }}>
                      <FormattedMessage id="villageReport1A.table.sign" />
                    </h5>
                  </td>
                  <td colSpan={2}></td>
                  <td colSpan={2}>
                    <h5 style={{ fontSize: '15px' }}>
                      <FormattedMessage id="villageReport1A.table.sign" />
                    </h5>
                  </td>
                  <td colSpan={2}></td>
                </tr>
                <tr style={{ marginTop: 20 }}>
                  <td colSpan={2}></td>
                  <td colSpan={2}>
                    <h5 style={{ fontSize: '15px' }}>
                      <FormattedMessage id="villageReport1A.table.talathi" />
                    </h5>
                  </td>
                  <td colSpan={2}></td>
                  <td colSpan={2}>
                    <h5 style={{ fontSize: '15px' }}>
                      <FormattedMessage id="villageReport1A.table.clerk" />
                    </h5>
                  </td>
                  <td colSpan={2}></td>
                  <td colSpan={2}>
                    <h4 style={{ fontSize: '15px' }}>
                      <FormattedMessage id="villageReport1A.table.tahsildar" />
                    </h4>
                  </td>
                  <td colSpan={2}></td>
                </tr>
              </tfoot>
            </table>
          </Card>
        </div>
      </div>
    );
  }
}

export default Report;
