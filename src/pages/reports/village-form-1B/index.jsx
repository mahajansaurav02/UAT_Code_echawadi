import { PageContainer } from '@ant-design/pro-layout';
import styles from './report.module.css';
import React, { useState, useRef, useEffect } from 'react';
import { Alert, Button, Card, Col, message, Row, Select, Spin } from 'antd';
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

let prevTotalArea = 0,
  prevAssessment = 0,
  prevAssessedArea = 0,
  prevUnAssessedArea = 0;

function Report() {
  const { districtName, talukaName, districtCode, talukaCode } = useModel('details');
  const [isNirank, setIsNirank] = useState(false);
  const [codeVillage, setCodeVillage] = useState('');
  const [textForVillage, setTextForVillage] = useState();
  const [village, setVillage] = useState([]);
  const [tableData, setTableData] = useState();
  const [textVillage, setTextVillage] = useState('');
  const componentRef = useRef();
  const { sendRequest } = useAxios();
  const history = useHistory();
  const [totalArea, setTotalArea] = useState(0);
  const [netAssessment, setNetAssessment] = useState(0);
  const [netUnassessedArea, setNetUnassessedArea] = useState(0);
  const [revenueYear, setRevenueYear] = useState();
  const [loading, setLoading] = useState(false);

  const backToHomeButton = () => {
    history.push({ pathname: '/homepage' });
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  useEffect(() => {
    (prevTotalArea = 0), (prevAssessment = 0), (prevUnAssessedArea = 0), (prevAssessedArea = 0);
  }, []);

  const getTableData = async () => {
    (prevTotalArea = 0), (prevAssessment = 0), (prevUnAssessedArea = 0), (prevAssessedArea = 0);
    setLoading(true);
    sendRequest(
      `${URLS.BaseURL}/form1b/getForm1BReport?districtCode=${districtCode}&talukaCode=${talukaCode}&cCode=${codeVillage}`,
      'GET',
      null,
      (res) => {
        // console.log(res.data);
        setTableData(
          res.data.form1BData.map((r, i) => ({
            srNo: i + 1,
            //hissaNo: r.hissaNo,
            totalAreaH: r.totalAreaH,
            assessment: r.assessment,
            publicRightsOfWayAndEasements: r.publicRightsOfWayAndEasements,
            remarks: r.remarks,
            assessedArea: r.assessedArea,
            unassessedArea: r.unassessedArea,
            surveyNumber:
              r.hissaNo == null || r.hissaNo.trim() == '' ? r.pin : r.pin + '/' + r.hissaNo,
            allTotal: getTotalAreaAssess(
              r.totalAreaH,
              r.assessedArea,
              r.unassessedArea,
              r.assessment,
            ),
          })),
        );
        message.success('Records Fetched!!');
        setLoading(false);
      },
      (err) => {
        setLoading(false);
      },
    );
  };

  var totalAreaAddition = prevTotalArea.toFixed(4).substring(prevTotalArea.length - 2);
  var totalAreaOfAll = totalAreaAddition
    .substring(0, totalAreaAddition.length - 2)
    .concat('.')
    .concat(totalAreaAddition.substring(totalAreaAddition.length - 2));

  var totalAssessedAreaAddition = prevAssessedArea
    .toFixed(4)
    .substring(prevAssessedArea.length - 2);
  var totalAssessedAreaOfAll = totalAssessedAreaAddition
    .substring(0, totalAssessedAreaAddition.length - 2)
    .concat('.')
    .concat(totalAssessedAreaAddition.substring(totalAssessedAreaAddition.length - 2));

  var totalUnAssessedAreaAddition = prevUnAssessedArea
    .toFixed(4)
    .substring(prevUnAssessedArea.length - 2);
  var totalUnAssessedAreaOfAll = totalUnAssessedAreaAddition
    .substring(0, totalUnAssessedAreaAddition.length - 2)
    .concat('.')
    .concat(totalUnAssessedAreaAddition.substring(totalUnAssessedAreaAddition.length - 2));

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
              <FormattedMessage id="formLanguage.label.villageForm1a" />
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
            onClick={() => {
              if (textForVillage) {
                getTableData();
              } else if (textForVillage == null) {
                message.info('Please Select Village');
              }
            }}
            type="primary"
          >
            <FormattedMessage id="formLanguage.form.getData" />
          </Button>
        )}
        {loading === true ? (
          <Spin size="large" style={{ marginLeft: '520px', marginTop: '20px' }} />
        ) : null}
      </Card>
      <ComponentToPrint
        ref={componentRef}
        village={textForVillage}
        taluka={talukaName}
        district={districtName}
        dataToMap={tableData}
        isNirank={isNirank}
        totalArea={totalAreaOfAll}
        netAssessment={prevAssessment.toFixed(2)}
        netUnassessedArea={totalUnAssessedAreaOfAll}
        netAssessedArea={totalAssessedAreaOfAll}
      />
    </div>
  );
}

function getTotalAreaAssess(totalAreaH, assessedArea, unassessedArea, assessment) {
  prevTotalArea += parseFloat(totalAreaH);
  prevAssessment += parseFloat(assessment);
  prevUnAssessedArea += unassessedArea == null ? parseFloat(0) : parseFloat(unassessedArea);
  prevAssessedArea += assessedArea == null ? parseFloat(0) : parseFloat(assessedArea);
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
                        <FormattedMessage id="formLanguage.label.villageForm1a" />
                      </b>
                    </h3>
                  </th>
                </tr>

                <tr>
                  <th colSpan="11">
                    <h3 style={{ color: 'red' }}>
                      <b>बिनभोगवटयाच्या (सरकारी) जमिनींची नोंदवही</b>
                    </h3>
                  </th>
                </tr>
                <tr>
                  <th colSpan="11">
                    <h4 style={{ color: 'red' }}>
                      <pre>
                        {' '}
                        <b>
                          गाव-{this.props.village} तालुका-{this.props.taluka} जिल्हा-
                          {this.props.district}{' '}
                        </b>
                      </pre>
                    </h4>
                  </th>
                </tr>

                <tr>
                  <th>
                    <b>भूमापन क्र</b>
                  </th>
                  <th colSpan={2}>
                    <b>आकारणी</b>
                  </th>
                  <th>
                    <b> बिनआकारी क्षेत्र</b>
                  </th>
                  <th>
                    <b>सार्वजनिक मार्गाधिकार आणि सुविधाधिकार</b>
                  </th>
                  <th>
                    <b>शेरा</b>
                  </th>
                </tr>
                <tr>
                  <th></th>
                  <th>क्षेत्रफळ</th>
                  <th>आकारणी</th>
                  <th></th>
                  <th></th>
                  {/* <th>आकारी क्षेत्र</th>
                  <th>बिनआकारी क्षेत्र</th> */}
                  <th></th>
                  {/* <th></th> */}
                </tr>
                <tr>
                  <th>1</th>
                  <th>2(अ)</th>
                  <th>2(ब)</th>
                  <th>3</th>
                  <th>4</th>
                  <th>5</th>
                  {/* <th>6</th> */}
                </tr>
              </thead>

              <tbody>
                {this.props.dataToMap &&
                  this.props.dataToMap.map((r) => (
                    <tr>
                      <td>{r.surveyNumber}</td>
                      {/* <td>
                        {r.totalAreaH
                          .substring(0, r.totalAreaH.length - 2)
                          .concat('.')
                          .concat(r.totalAreaH.substring(r.totalAreaH.length - 2))}
                      </td> */}
                      <td>{r.assessedArea}</td>

                      <td>{r.assessment}</td>
                      {/* <td>{r.assessedArea}</td> */}
                      <td>{r.unassessedArea}</td>
                      <td>{r.publicRightsOfWayAndEasements}</td>
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
                  <td>
                    <b>
                      <FormattedMessage id="formLanguage.form.total" />
                    </b>
                  </td>
                  <td>
                    <b>{this.props.netAssessedArea}</b>
                  </td>

                  <td>
                    <b>{this.props.netAssessment}</b>
                  </td>
                  {/* <td>
                    <b>{this.props.netAssessedArea}</b>
                  </td> */}

                  <td>
                    <b>{this.props.netUnassessedArea}</b>
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
