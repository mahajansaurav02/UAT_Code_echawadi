import { PageContainer } from '@ant-design/pro-layout';
import styles from './report.module.css';
import React, { useState, useRef, useEffect } from 'react';
import { Button, Card, Col, Row, Select, message, Spin, Alert } from 'antd';
import { useHistory, useLocation } from 'react-router-dom';
import Axios from 'axios';
import VillageSelector from '@/components/eComponents/VillageSelector';
import BaseURL from '@/URLs/urls';
import { useReactToPrint } from 'react-to-print';
import URLS from '@/URLs/urls';
import useAxios from '@/components/eComponents/use-axios';
import { useModel } from 'umi';
import { FormattedMessage } from 'umi';
import Center from '@/pages/account/center';
import moment from 'moment';
import ReactHtmlTableToExcel from 'react-html-table-to-excel';

let prevTotalArea = 0;
let prevTotalAreaB = 0;
let prevAssessmentForA = 0;
let prevAssessmentForB = 0;

function Report2() {
  var revenueYearFromStorage = JSON.parse(localStorage.getItem('revenueYear'));

  const { districtName, talukaName, districtCode, talukaCode } = useModel('details');
  const { sendRequest } = useAxios();
  const [codeVillage, setCodeVillage] = useState('');
  const [textForVillage, setTextForVillage] = useState();
  const [isNirank, setIsNirank] = useState(false);
  const [village, setVillage] = useState([]);
  const [tableData, setTableData] = useState();
  const [textVillage, setTextVillage] = useState('');
  const [totalArea, setTotalArea] = useState(0);
  const componentRef = useRef();
  const [revenueYear, setRevenueYear] = useState();
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  const backToHomeButton = () => {
    history.push({ pathname: '/homepage' });
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  useEffect(() => {
    prevTotalArea = 0;
    prevTotalAreaB = 0;
    prevAssessmentForA = 0;
    prevAssessmentForB = 0;
  }, []);

  const getTableData = async () => {
    prevTotalArea = 0;
    prevTotalAreaB = 0;
    prevAssessmentForA = 0;
    prevAssessmentForB = 0;
    setLoading(true);

    sendRequest(
      `${URLS.BaseURL}/form2/getForm2Report?districtCode=${districtCode}&talukaCode=${talukaCode}&cCode=${codeVillage}`,
      'GET',
      null,
      (res) => {
        setTableData(
          res.data.form2Data /* .map((r, i) => ({
            naAreaH: r.naAreaH,
            natureAndTermsOfNaGrant: r.natureAndTermsOfNaGrant,
            occupanyPrice: r.occupanyPrice,
            // periodFrom:
            //   r.periodFrom != null ? moment(r.periodFrom, 'YYYY-MM-DD').format('YYYY-MM-DD') : '',
            // periodTo:
            //   r.periodTo != null ? moment(r.periodTo, 'YYYY-MM-DD').format('YYYY-MM-DD') : '',
            // entryNumberInTalukaForm2: r.entryNumberInTalukaForm2,
            // authority: r.authority != '' ? <FormattedMessage id={r.authority} /> : '',
            // nameOfFirstOccupant: r.nameOfFirstOccupant,
            // part: r.part != '' ? <FormattedMessage id={r.part} /> : '',
            // purposeOfUse: r.purposeOfUse != '' ? <FormattedMessage id={r.purposeOfUse} /> : '',
            // remarks: r.remarks,
            allTotal: getTotalAreaAssess(r.naAreaH),
          })), */,
          // allTotal:getTotalAreaAssess(r.naAreaH),
          res.data.form2Data.map((r) => ({
            allTotal: getTotalAreaAssess(r.part, r.naAreaH, r.naAssessment),
          })),
        );
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

  var totalAreaAdditionB = prevTotalAreaB.toFixed(4).substring(prevTotalAreaB.length - 2);
  var totalAreaOfAllForB = totalAreaAdditionB
    .substring(0, totalAreaAdditionB.length - 2)
    .concat('.')
    .concat(totalAreaAdditionB.substring(totalAreaAdditionB.length - 2));

  function totalAreaOfABFunction(param1, param2) {
    let param3 = parseFloat(param1) + parseFloat(param2);
    var param4 = param3.toFixed(4).substring(param3.length - 2);
    var param5 = param4
      .substring(0, param4.length - 2)
      .concat('.')
      .concat(param4.substring(param4.length - 2));
    return param5;
  }

  function totalAssessmentOfABFunction(param1, param2) {
    let param3 = parseFloat(param1) + parseFloat(param2);
    return param3;
  }

  return (
    <>
      <Card>
        <Row>
          <Col span={8}>
            <Button type="primary" onClick={handlePrint}>
              <FormattedMessage id="villageReport1.button.print" />

              {/* प्रत काढा */}
            </Button>
          </Col>
          <Col span={8}>
            {/* form2.table.viilageForm2' */}
            <h1 style={{ textAlign: 'center' }}>
              <FormattedMessage id="form2.table.viilageForm2" />
            </h1>
          </Col>
          <Col span={8}>
            <Button style={{ float: 'right' }} onClick={backToHomeButton} type="primary">
              <FormattedMessage id="villageReport1.button.home" />

              {/* मुख्यपृष्ठ */}
            </Button>
          </Col>
        </Row>

        <VillageSelector
          pageType="withoutYear"
          setCodeVillage={setCodeVillage}
          setTextForVillage={setTextForVillage}
          onVillageChange={(setVillage, setTableData)}
          yearChange={setRevenueYear}
          setIsNirank={setIsNirank}
        />
        <Row style={{ marginLeft: '15px' }}>
          <Col xl={22} lg={22} md={22} sm={20} xs={20}></Col>
          <Col xl={2} lg={2} md={2} sm={4} xs={4}>
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
                <FormattedMessage id="villageReport1.button.getData" />
              </Button>
            )}
          </Col>
          {loading === true ? (
            <Spin size="large" style={{ marginLeft: '580px', marginTop: '20px' }} />
          ) : null}
        </Row>
        {/* {isNirank && (
          <>
            <Alert message="टीप" description="सदर गाव नमुना निरंक आहे !!!!" type="info" showIcon />
          </>
        )} */}
      </Card>

      <ComponentToPrint
        ref={componentRef}
        village={textForVillage}
        taluka={talukaName}
        district={districtName}
        revenueYearFromStorage={revenueYearFromStorage}
        dataToMap={tableData}
        isNirank={isNirank}
        totalAreaA={totalAreaOfAll}
        totalAreaOfAllForB={totalAreaOfAllForB}
        // totalAreaOfAB={parseFloat(totalAreaOfAll) + parseFloat(totalAreaOfAllForB)}
        totalAreaOfAB={totalAreaOfABFunction(totalAreaOfAll, totalAreaOfAllForB)}
        assessmentForA={prevAssessmentForA.toFixed(2)}
        assessmentForB={prevAssessmentForB.toFixed(2)}
        totalAssessmentForAandB={totalAssessmentOfABFunction(
          prevAssessmentForA,
          prevAssessmentForB,
        ).toFixed(2)}

        // totalArea={prevTotalArea.toFixed(2)}
      />
    </>
  );
}

function getTotalAreaAssess(part, naAreaH, naAssessment) {
  // console.log('data ala ka??', naAreaH);
  if (part === 'form2.table.partA') {
    prevTotalArea += parseFloat(naAreaH);
    prevAssessmentForA += parseFloat(naAssessment);
  } else if (part === 'form2.table.partB') {
    prevTotalAreaB += parseFloat(naAreaH);
    prevAssessmentForB += parseFloat(naAssessment);
  }
}

class ComponentToPrint extends React.Component {
  render() {
    return (
      <div style={{ padding: '11px' }}>
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
                  <th colSpan="15">
                    <h3 style={{ color: 'red' }}>
                      <b>
                        <FormattedMessage id="form2.table.viilageForm2" />
                      </b>
                    </h3>
                  </th>
                </tr>
                <tr>
                  <th colSpan="16">
                    <h3 style={{ color: 'red' }}>
                      <b>
                        <FormattedMessage id="form2.table.viilageForm2" />-
                        <FormattedMessage id="form2.table.registerOfNonAgriRevenue" />
                      </b>
                      {/* <b>REGISTER OF NON-AGRICULTURE REVENUE</b> */}
                    </h3>
                  </th>
                </tr>

                <tr>
                  <th colSpan="16">
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
                  <th colSpan="16">
                    <h5 style={{ color: 'red' }}>
                      <b>
                        <FormattedMessage id="form2.table.sectionLandRevenueCode" />
                      </b>
                    </h5>
                  </th>
                </tr>
                <tr>
                  <th colSpan={1} rowSpan={3}>
                    <b>{<FormattedMessage id="villageForm.form.srno" />}</b>

                    <b></b>
                  </th>
                  <th rowSpan={3} colSpan={1}>
                    <b>{<FormattedMessage id="form2.table.descriptionOfLand" />}</b>
                    <b></b>
                  </th>
                  <th rowSpan={3} colSpan={1}>
                    <b>
                      क्षेत्र <br />
                      (आर.चौमी)
                    </b>
                  </th>
                  <th colSpan={1} rowSpan={3}>
                    <b>{<FormattedMessage id="form2.table.natureTerms" />}</b>
                  </th>
                  <th rowSpan={3} colSpan={1}>
                    <b>
                      भोगवटा हक्काची किंमत असल्यास <br />
                      (रु.पैसे)
                    </b>
                  </th>
                  <th rowSpan={3} colSpan={1}>
                    <b>{<FormattedMessage id="form2.table.annualReveneue" />}</b>
                  </th>
                  <th colSpan={2} rowSpan={1}>
                    <b>{<FormattedMessage id="form2.table.period" />}</b>
                  </th>

                  <th rowSpan={3} colSpan={1}>
                    <b>{<FormattedMessage id="form2.table.entryNumberInTalukaFrom" />}</b>
                  </th>

                  <th rowSpan={3} colSpan={1}>
                    <b>{<FormattedMessage id="form2.table.nameOfFirstOccupant" />}</b>
                  </th>
                  <th rowSpan={3} colSpan={1}>
                    <b>
                      <FormattedMessage id="form2.table.authority" />
                    </b>
                  </th>
                  <th rowSpan={3} colSpan={1}>
                    <b>
                      <FormattedMessage id="form2.table.orderNo" />
                    </b>
                  </th>
                  <th rowSpan={3} colSpan={1}>
                    <b>
                      <FormattedMessage id="form2.table.authorityDate" />
                    </b>
                  </th>
                  <th rowSpan={3} colSpan={1}>
                    <FormattedMessage id="villageReport1.table.remark" />
                  </th>
                </tr>

                <tr>
                  <th colSpan={1} rowSpan={2}>
                    <FormattedMessage id="form2.table.from" />
                  </th>
                  <th colSpan={1} rowSpan={2}>
                    <FormattedMessage id="form2.table.to" />
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>2</td>
                  <td>3</td>
                  <td>4</td>
                  <td>5</td>
                  <td>6</td>
                  <td>7</td>
                  <td>8</td>
                  <td>9</td>
                  <td>10</td>
                  <td>11</td>
                  <td>12</td>
                  <td>13</td>
                  <td>14</td>
                  {/* <td>16</td>
                <td>17</td> */}
                </tr>
                <tr>
                  <td colSpan="15" style={{ color: 'red', textAlign: 'left' }}>
                    भाग (अ) गावठाणातील --
                  </td>
                </tr>
                <tr>
                  <td colSpan="15" style={{ color: 'red', textAlign: 'left' }}>
                    (एक) निवासविषयक प्रयोजनांकरिता वापर केलेल्या जमिनी
                  </td>
                </tr>
                {this.props.dataToMap &&
                  this.props.dataToMap.map((r, i) => {
                    if (r.part == 'form2.table.partA' && r.purposeOfUse == 'form2.table.partA.1') {
                      return (
                        <>
                          <tr>
                            <td>{(r.srNo = i + 1)}</td>
                            <td>
                              {r.hissaNo == null || r.hissaNo.trim() == ''
                                ? r.pin
                                : r.pin + '/' + r.hissaNo}
                            </td>
                            <td>{r.naAreaH}</td>
                            <td>
                              {r.purposeOfUse != '' ? <FormattedMessage id={r.purposeOfUse} /> : ''}
                            </td>
                            <td>{r.occupanyPrice}</td>
                            <td>{r.naAssessment}</td>
                            <td>
                              {r.periodFrom != null
                                ? moment(r.periodFrom, 'YYYY-MM-DD').format('YYYY-MM-DD')
                                : ''}
                            </td>
                            <td>
                              {r.periodTo != null
                                ? moment(r.periodTo, 'YYYY-MM-DD').format('YYYY-MM-DD')
                                : ''}
                            </td>

                            <td>{r.entryNumberInTalukaForm2}</td>

                            <td>{r.nameOfFirstOccupant}</td>
                            <td>
                              {r.authority != '' ? <FormattedMessage id={r.authority} /> : ''}
                            </td>
                            <td>{r.authorityOrderNo}</td>
                            <td>{r.authorityDate}</td>

                            <td>{r.remarks}</td>
                          </tr>
                        </>
                      );
                    }
                  })}
                <tr>
                  <td colSpan="15" style={{ color: 'red', textAlign: 'left' }}>
                    (दोन) औदयोगिक प्रयोजनांकरिता वापर केलेल्या जमिनी
                  </td>
                </tr>
                {this.props.dataToMap &&
                  this.props.dataToMap.map((r, i) => {
                    if (r.part == 'form2.table.partA' && r.purposeOfUse == 'form2.table.partA.2') {
                      return (
                        <>
                          <tr>
                            <td>{(r.srNo = i + 1)}</td>
                            <td>
                              {r.hissaNo == null || r.hissaNo.trim() == ''
                                ? r.pin
                                : r.pin + '/' + r.hissaNo}
                            </td>
                            <td>{r.naAreaH}</td>
                            <td>
                              {r.purposeOfUse != '' ? <FormattedMessage id={r.purposeOfUse} /> : ''}
                            </td>
                            <td>{r.occupanyPrice}</td>
                            <td>{r.naAssessment}</td>
                            <td>
                              {r.periodFrom != null
                                ? moment(r.periodFrom, 'YYYY-MM-DD').format('YYYY-MM-DD')
                                : ''}
                            </td>
                            <td>
                              {r.periodTo != null
                                ? moment(r.periodTo, 'YYYY-MM-DD').format('YYYY-MM-DD')
                                : ''}
                            </td>

                            <td>{r.entryNumberInTalukaForm2}</td>

                            <td>{r.nameOfFirstOccupant}</td>
                            <td>
                              {r.authority != '' ? <FormattedMessage id={r.authority} /> : ''}
                            </td>
                            <td>{r.authorityOrderNo}</td>
                            <td>{r.authorityDate}</td>

                            <td>{r.remarks}</td>
                          </tr>
                        </>
                      );
                    }
                  })}
                <tr>
                  <td colSpan="15" style={{ color: 'red', textAlign: 'left' }}>
                    (तीन) वाणिज्यिक प्रयोजनांकरिता वापर केलेल्या जमिनी
                  </td>
                </tr>
                {this.props.dataToMap &&
                  this.props.dataToMap.map((r, i) => {
                    if (r.part == 'form2.table.partA' && r.purposeOfUse == 'form2.table.partA.3') {
                      return (
                        <>
                          <tr>
                            <td>{(r.srNo = i + 1)}</td>
                            <td>
                              {r.hissaNo == null || r.hissaNo.trim() == ''
                                ? r.pin
                                : r.pin + '/' + r.hissaNo}
                            </td>
                            <td>{r.naAreaH}</td>
                            <td>
                              {r.purposeOfUse != '' ? <FormattedMessage id={r.purposeOfUse} /> : ''}
                            </td>
                            <td>{r.occupanyPrice}</td>
                            <td>{r.naAssessment}</td>
                            <td>
                              {r.periodFrom != null
                                ? moment(r.periodFrom, 'YYYY-MM-DD').format('YYYY-MM-DD')
                                : ''}
                            </td>
                            <td>
                              {r.periodTo != null
                                ? moment(r.periodTo, 'YYYY-MM-DD').format('YYYY-MM-DD')
                                : ''}
                            </td>

                            <td>{r.entryNumberInTalukaForm2}</td>

                            <td>{r.nameOfFirstOccupant}</td>
                            <td>
                              {r.authority != '' ? <FormattedMessage id={r.authority} /> : ''}
                            </td>
                            <td>{r.authorityOrderNo}</td>
                            <td>{r.authorityDate}</td>

                            <td>{r.remarks}</td>
                          </tr>
                        </>
                      );
                    }
                  })}
                <tr>
                  <td colSpan="15" style={{ color: 'red', textAlign: 'left' }}>
                    (चार)महसूल माफ प्रदानांव्यतिरिक्त,कमी केलेल्या किंवा वाढवलेल्या दराने इतर
                    कोणत्याही प्रयोजनांकरिता
                  </td>
                </tr>
                {this.props.dataToMap &&
                  this.props.dataToMap.map((r, i) => {
                    if (r.part == 'form2.table.partA' && r.purposeOfUse == 'form2.table.partA.4') {
                      return (
                        <>
                          <tr>
                            <td>{(r.srNo = i + 1)}</td>
                            <td>
                              {r.hissaNo == null || r.hissaNo.trim() == ''
                                ? r.pin
                                : r.pin + '/' + r.hissaNo}
                            </td>
                            <td>{r.naAreaH}</td>
                            <td>
                              {r.purposeOfUse != '' ? <FormattedMessage id={r.purposeOfUse} /> : ''}
                            </td>
                            <td>{r.occupanyPrice}</td>
                            <td>{r.naAssessment}</td>
                            <td>
                              {r.periodFrom != null
                                ? moment(r.periodFrom, 'YYYY-MM-DD').format('YYYY-MM-DD')
                                : ''}
                            </td>
                            <td>
                              {r.periodTo != null
                                ? moment(r.periodTo, 'YYYY-MM-DD').format('YYYY-MM-DD')
                                : ''}
                            </td>

                            <td>{r.entryNumberInTalukaForm2}</td>

                            <td>{r.nameOfFirstOccupant}</td>
                            <td>
                              {r.authority != '' ? <FormattedMessage id={r.authority} /> : ''}
                            </td>
                            <td>{r.authorityOrderNo}</td>
                            <td>{r.authorityDate}</td>

                            <td>{r.remarks}</td>
                          </tr>
                        </>
                      );
                    }
                  })}
                <tr>
                  <td colSpan="15" style={{ color: 'red', textAlign: 'left' }}>
                    (पाच)महसूल माफ प्रदाने
                  </td>
                </tr>
                {this.props.dataToMap &&
                  this.props.dataToMap.map((r, i) => {
                    if (r.part == 'form2.table.partA' && r.purposeOfUse == 'form2.table.partA.5') {
                      return (
                        <>
                          <tr>
                            <td>{(r.srNo = i + 1)}</td>
                            <td>
                              {r.hissaNo == null || r.hissaNo.trim() == ''
                                ? r.pin
                                : r.pin + '/' + r.hissaNo}
                            </td>
                            <td>{r.naAreaH}</td>
                            <td>
                              {r.purposeOfUse != '' ? <FormattedMessage id={r.purposeOfUse} /> : ''}
                            </td>
                            <td>{r.occupanyPrice}</td>
                            <td>{r.naAssessment}</td>
                            <td>
                              {r.periodFrom != null
                                ? moment(r.periodFrom, 'YYYY-MM-DD').format('YYYY-MM-DD')
                                : ''}
                            </td>
                            <td>
                              {r.periodTo != null
                                ? moment(r.periodTo, 'YYYY-MM-DD').format('YYYY-MM-DD')
                                : ''}
                            </td>

                            <td>{r.entryNumberInTalukaForm2}</td>

                            <td>{r.nameOfFirstOccupant}</td>
                            <td>
                              {r.authority != '' ? <FormattedMessage id={r.authority} /> : ''}
                            </td>
                            <td>{r.authorityOrderNo}</td>
                            <td>{r.authorityDate}</td>

                            <td>{r.remarks}</td>
                          </tr>
                        </>
                      );
                    }
                  })}
                {/* गावठाणाबाहेरील गट- ब  एन्ट्री */}
                <tr>
                  <td colSpan="15" style={{ color: 'red', textAlign: 'left' }}>
                    भाग (ब) गावठाणा बाहेरील --
                  </td>
                </tr>
                <tr>
                  <td colSpan="15" style={{ color: 'red', textAlign: 'left' }}>
                    (एक) निवासविषयक प्रयोजनांकरिता वापर केलेल्या जमिनी
                  </td>
                </tr>
                {this.props.dataToMap &&
                  this.props.dataToMap.map((r, i) => {
                    if (r.part == 'form2.table.partB' && r.purposeOfUse == 'form2.table.partA.1') {
                      return (
                        <>
                          <tr>
                            <td>{(r.srNo = i + 1)}</td>
                            <td>
                              {r.hissaNo == null || r.hissaNo.trim() == ''
                                ? r.pin
                                : r.pin + '/' + r.hissaNo}
                            </td>
                            <td>{r.naAreaH}</td>
                            <td>
                              {r.purposeOfUse != '' ? <FormattedMessage id={r.purposeOfUse} /> : ''}
                            </td>
                            <td>{r.occupanyPrice}</td>
                            <td>{r.naAssessment}</td>
                            <td>
                              {r.periodFrom != null
                                ? moment(r.periodFrom, 'YYYY-MM-DD').format('YYYY-MM-DD')
                                : ''}
                            </td>
                            <td>
                              {r.periodTo != null
                                ? moment(r.periodTo, 'YYYY-MM-DD').format('YYYY-MM-DD')
                                : ''}
                            </td>

                            <td>{r.entryNumberInTalukaForm2}</td>

                            <td>{r.nameOfFirstOccupant}</td>
                            <td>
                              {r.authority != '' ? <FormattedMessage id={r.authority} /> : ''}
                            </td>
                            <td>{r.authorityOrderNo}</td>
                            <td>{r.authorityDate}</td>

                            <td>{r.remarks}</td>
                          </tr>
                        </>
                      );
                    }
                  })}
                <tr>
                  <td colSpan="15" style={{ color: 'red', textAlign: 'left' }}>
                    (दोन) औदयोगिक प्रयोजनांकरिता वापर केलेल्या जमिनी
                  </td>
                </tr>
                {this.props.dataToMap &&
                  this.props.dataToMap.map((r, i) => {
                    if (r.part == 'form2.table.partB' && r.purposeOfUse == 'form2.table.partA.2') {
                      return (
                        <>
                          <tr>
                            <td>{(r.srNo = i + 1)}</td>
                            <td>
                              {r.hissaNo == null || r.hissaNo.trim() == ''
                                ? r.pin
                                : r.pin + '/' + r.hissaNo}
                            </td>
                            <td>{r.naAreaH}</td>
                            <td>
                              {r.purposeOfUse != '' ? <FormattedMessage id={r.purposeOfUse} /> : ''}
                            </td>
                            <td>{r.occupanyPrice}</td>
                            <td>{r.naAssessment}</td>
                            <td>
                              {r.periodFrom != null
                                ? moment(r.periodFrom, 'YYYY-MM-DD').format('YYYY-MM-DD')
                                : ''}
                            </td>
                            <td>
                              {r.periodTo != null
                                ? moment(r.periodTo, 'YYYY-MM-DD').format('YYYY-MM-DD')
                                : ''}
                            </td>

                            <td>{r.entryNumberInTalukaForm2}</td>

                            <td>{r.nameOfFirstOccupant}</td>
                            <td>
                              {r.authority != '' ? <FormattedMessage id={r.authority} /> : ''}
                            </td>
                            <td>{r.authorityOrderNo}</td>
                            <td>{r.authorityDate}</td>

                            <td>{r.remarks}</td>
                          </tr>
                        </>
                      );
                    }
                  })}
                <tr>
                  <td colSpan="15" style={{ color: 'red', textAlign: 'left' }}>
                    (तीन) वाणिज्यिक प्रयोजनांकरिता वापर केलेल्या जमिनी
                  </td>
                </tr>
                {this.props.dataToMap &&
                  this.props.dataToMap.map((r, i) => {
                    if (r.part == 'form2.table.partB' && r.purposeOfUse == 'form2.table.partA.3') {
                      return (
                        <>
                          <tr>
                            <td>{(r.srNo = i + 1)}</td>
                            <td>
                              {r.hissaNo == null || r.hissaNo.trim() == ''
                                ? r.pin
                                : r.pin + '/' + r.hissaNo}
                            </td>
                            <td>{r.naAreaH}</td>
                            <td>
                              {r.purposeOfUse != '' ? <FormattedMessage id={r.purposeOfUse} /> : ''}
                            </td>
                            <td>{r.occupanyPrice}</td>
                            <td>{r.naAssessment}</td>
                            <td>
                              {r.periodFrom != null
                                ? moment(r.periodFrom, 'YYYY-MM-DD').format('YYYY-MM-DD')
                                : ''}
                            </td>
                            <td>
                              {r.periodTo != null
                                ? moment(r.periodTo, 'YYYY-MM-DD').format('YYYY-MM-DD')
                                : ''}
                            </td>

                            <td>{r.entryNumberInTalukaForm2}</td>

                            <td>{r.nameOfFirstOccupant}</td>

                            <td>
                              {r.authority != '' ? <FormattedMessage id={r.authority} /> : ''}
                            </td>
                            <td>{r.authorityOrderNo}</td>
                            <td>{r.authorityDate}</td>

                            <td>{r.remarks}</td>
                          </tr>
                        </>
                      );
                    }
                  })}
                <tr>
                  <td colSpan="15" style={{ color: 'red', textAlign: 'left' }}>
                    (चार)महसूल माफ प्रदानांव्यतिरिक्त,कमी केलेल्या किंवा वाढवलेल्या दराने इतर
                    कोणत्याही प्रयोजनांकरिता
                  </td>
                </tr>
                {this.props.dataToMap &&
                  this.props.dataToMap.map((r, i) => {
                    if (r.part == 'form2.table.partB' && r.purposeOfUse == 'form2.table.partA.4') {
                      return (
                        <>
                          <tr>
                            <td>{(r.srNo = i + 1)}</td>
                            <td>
                              {r.hissaNo == null || r.hissaNo.trim() == ''
                                ? r.pin
                                : r.pin + '/' + r.hissaNo}
                            </td>
                            <td>{r.naAreaH}</td>
                            <td>
                              {r.purposeOfUse != '' ? <FormattedMessage id={r.purposeOfUse} /> : ''}
                            </td>
                            <td>{r.occupanyPrice}</td>
                            <td>{r.naAssessment}</td>
                            <td>
                              {r.periodFrom != null
                                ? moment(r.periodFrom, 'YYYY-MM-DD').format('YYYY-MM-DD')
                                : ''}
                            </td>
                            <td>
                              {r.periodTo != null
                                ? moment(r.periodTo, 'YYYY-MM-DD').format('YYYY-MM-DD')
                                : ''}
                            </td>

                            <td>{r.entryNumberInTalukaForm2}</td>

                            <td>{r.nameOfFirstOccupant}</td>
                            <td>
                              {r.authority != '' ? <FormattedMessage id={r.authority} /> : ''}
                            </td>
                            <td>{r.authorityOrderNo}</td>
                            <td>{r.authorityDate}</td>

                            <td>{r.remarks}</td>
                          </tr>
                        </>
                      );
                    }
                  })}
                <tr>
                  <td colSpan="15" style={{ color: 'red', textAlign: 'left' }}>
                    (पाच)महसूल माफ प्रदाने
                  </td>
                </tr>
                {this.props.dataToMap &&
                  this.props.dataToMap.map((r, i) => {
                    if (r.part == 'form2.table.partB' && r.purposeOfUse == 'form2.table.partA.5') {
                      return (
                        <>
                          <tr>
                            <td>{(r.srNo = i + 1)}</td>
                            <td>
                              {r.hissaNo == null || r.hissaNo.trim() == ''
                                ? r.pin
                                : r.pin + '/' + r.hissaNo}
                            </td>
                            <td>{r.naAreaH}</td>
                            <td>
                              {r.purposeOfUse != '' ? <FormattedMessage id={r.purposeOfUse} /> : ''}
                            </td>
                            <td>{r.occupanyPrice}</td>
                            <td>{r.naAssessment}</td>
                            <td>
                              {r.periodFrom != null
                                ? moment(r.periodFrom, 'YYYY-MM-DD').format('YYYY-MM-DD')
                                : ''}
                            </td>
                            <td>
                              {r.periodTo != null
                                ? moment(r.periodTo, 'YYYY-MM-DD').format('YYYY-MM-DD')
                                : ''}
                            </td>

                            <td>{r.entryNumberInTalukaForm2}</td>

                            <td>{r.nameOfFirstOccupant}</td>
                            <td>
                              {r.authority != '' ? <FormattedMessage id={r.authority} /> : ''}
                            </td>
                            <td>{r.authorityOrderNo}</td>
                            <td>{r.authorityDate}</td>

                            <td>{r.remarks}</td>
                          </tr>
                        </>
                      );
                    }
                  })}
                <tr>
                  <td colSpan="9"></td>
                  <td colSpan="6" style={{ textAlign: 'left' }}>
                    <center>
                      <strong>
                        वार्षिक गोषवारा वर्ष :-
                        {this.props.revenueYearFromStorage &&
                          this.props.revenueYearFromStorage.map((r, i) => r.revenueYear)}
                      </strong>
                    </center>
                  </td>
                </tr>
                <tr>
                  <td colSpan="9"></td>
                  <td colSpan="2" style={{ textAlign: 'left' }}>
                    <strong> भाग</strong>
                  </td>
                  <td colSpan="1" style={{ textAlign: 'left' }}>
                    <strong> क्षेत्र (आर.चौमी)</strong>
                  </td>
                  <td colSpan="2" style={{ textAlign: 'left' }}>
                    <strong> महसूल (रु.पैसे)</strong>
                  </td>
                </tr>
                <tr>
                  <td colSpan="9"></td>
                  <td colSpan="2" style={{ textAlign: 'left' }}>
                    <strong> (अ)</strong>
                  </td>
                  <td colSpan="1" style={{ textAlign: 'left' }}>
                    <td>
                      {this.props.totalAreaA}
                      {/* {console.log('this.props.totalArea', this.props.totalAreaA)} */}
                    </td>
                  </td>
                  <td colSpan="2" style={{ textAlign: 'left' }}>
                    {this.props.assessmentForA}
                  </td>
                </tr>
                <tr>
                  <td colSpan="9"></td>
                  <td colSpan="2" style={{ textAlign: 'left' }}>
                    <strong> (ब)</strong>
                  </td>
                  <td colSpan="1" style={{ textAlign: 'left' }}>
                    {this.props.totalAreaOfAllForB}
                  </td>
                  <td colSpan="2" style={{ textAlign: 'left' }}>
                    {this.props.assessmentForB}
                  </td>
                </tr>
                <tr>
                  <td colSpan="9"></td>
                  <td colSpan="2" style={{ textAlign: 'left' }}>
                    <strong> एकूण</strong>
                  </td>
                  <td colSpan="1" style={{ textAlign: 'left' }}>
                    {this.props.totalAreaOfAB}
                  </td>
                  <td colSpan="2" style={{ textAlign: 'left' }}>
                    {this.props.totalAssessmentForAandB}
                  </td>
                </tr>
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
              </tbody>
            </table>
          </Card>
        </div>
      </div>
    );
  }
}

export default Report2;
