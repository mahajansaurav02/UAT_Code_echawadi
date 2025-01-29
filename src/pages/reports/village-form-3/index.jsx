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

let prevCultiArea = 0,
  prevAssessment = 0,
  prevPotKharabArea = 0,
  prevTotalArea = 0,
  prevNaArea = 0,
  prevNaAssessment = 0,
  prevJudiSalami = 0,
  prevRate = 0,
  prevEchAssessment = 0,
  prevTotal = 0,
  prevNetPending = 0;

function Report3() {
  const { districtName, talukaName, districtCode, talukaCode } = useModel('details');
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
  const [netCultivableArea, setNetCultivableArea] = useState(0);
  const [netAssessment, setNetAssessment] = useState(0);
  const [netAssessmentNA, setNetAssessmentNA] = useState(0);
  const [netAreaUnderNA, setNetAreaUnderNA] = useState(0);

  const backToHomeButton = () => {
    history.push({ pathname: '/homepage' });
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  useEffect(() => {
    (prevCultiArea = 0),
      (prevAssessment = 0),
      (prevPotKharabArea = 0),
      (prevTotalArea = 0),
      (prevNaArea = 0),
      (prevNaAssessment = 0),
      (prevJudiSalami = 0),
      (prevRate = 0),
      (prevEchAssessment = 0),
      (prevTotal = 0),
      (prevNetPending = 0);
  }, []);

  const getTableData = async () => {
    setLoading(true);

    (prevCultiArea = 0),
      (prevAssessment = 0),
      (prevPotKharabArea = 0),
      (prevTotalArea = 0),
      (prevNaArea = 0),
      (prevNaAssessment = 0),
      (prevJudiSalami = 0),
      (prevRate = 0),
      (prevEchAssessment = 0),
      (prevTotal = 0),
      (prevNetPending = 0);

    sendRequest(
      `${URLS.BaseURL}/form3/getForm3Report?districtCode=${districtCode}&talukaCode=${talukaCode}&cCode=${codeVillage}`,
      'GET',
      null,
      (res) => {
        setTableData(
          res.data.form3Data.map((r) => ({
            id: r.id,
            surveyNumber:
              r.hissaNo == null || r.hissaNo.trim() == '' ? r.pin : r.pin + '/' + r.hissaNo,
            hissaNo: r.hissaNo,
            classes: r.classes,
            kindAndHowLongContinuable: r.kindAndHowLongContinuable,
            runningNoEachClass: r.runningNoEachClass,
            noInRegisterOfLands: r.noInRegisterOfLands,
            sanadNo: r.sanadNo,
            hissaNo: r.hissaNo,
            netCultiAreaH: r.netCultiAreaH,
            assessment: r.assessment,
            areaUnderNaUse: r.areaUnderNaUse,
            remarks: r.remarks,
            potKharabArea: r.potKharabArea,
            totalArea: r.totalArea,
            naAreaH: r.naAreaH,
            naAssessment: r.naAssessment,
            juniSalami: r.juniSalami,
            rate: r.rate,
            echAssessment: r.echAssessment,
            netPending: r.netPending,
            total: r.total,
            allTotal: getTotalAreaAssess(
              r.netCultiAreaH,
              r.potKharabArea,
              r.totalArea,
              r.assessment,
              r.naAreaH,
              r.naAssessment,
              r.juniSalami,
              r.rate,
              r.echAssessment,
              r.total,
              r.netPending,
            ),
          })),
        );
        setLoading(false);
      },
      (err) => {
        setLoading(false);
      },
    );
  };

  var totalNetCultiAreaAddition = prevCultiArea.toFixed(4).substring(prevCultiArea.length - 2);
  var totalNetCultiAreaOfAll = totalNetCultiAreaAddition
    .substring(0, totalNetCultiAreaAddition.length - 2)
    .concat('.')
    .concat(totalNetCultiAreaAddition.substring(totalNetCultiAreaAddition.length - 2));

  var totalNetPotkharabaAreaAddition = prevPotKharabArea
    .toFixed(4)
    .substring(prevPotKharabArea.length - 2);
  var totalNetPotkharabaAreaOfAll = totalNetPotkharabaAreaAddition
    .substring(0, totalNetPotkharabaAreaAddition.length - 2)
    .concat('.')
    .concat(totalNetPotkharabaAreaAddition.substring(totalNetPotkharabaAreaAddition.length - 2));

  var totalAreaAddition = prevTotalArea.toFixed(4).substring(prevTotalArea.length - 2);
  var totalAreaOfAll = totalAreaAddition
    .substring(0, totalAreaAddition.length - 2)
    .concat('.')
    .concat(totalAreaAddition.substring(totalAreaAddition.length - 2));

  var totalNaAreaAddition = prevNaArea.toFixed(4).substring(prevNaArea.length - 2);
  var totalNaAreaOfAll = totalNaAreaAddition
    .substring(0, totalNaAreaAddition.length - 2)
    .concat('.')
    .concat(totalNaAreaAddition.substring(totalNaAreaAddition.length - 2));

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
              <FormattedMessage id="villageForm3.form.villageTitle" />
            </h1>
          </Col>
          <Col span={8}>
            <Button style={{ float: 'right' }} onClick={backToHomeButton} type="primary">
              <FormattedMessage id="formLanguage.form.backhomeButton" />
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
                /*   onClick={getTableData} */
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
          </Col>
          {loading === true ? (
            <Spin size="large" style={{ marginLeft: '560px', marginTop: '10px' }} />
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
        dataToMap={tableData}
        isNirank={isNirank}
        netCultivableArea={totalNetCultiAreaOfAll}
        totalArea={totalAreaOfAll}
        netAssessment={prevAssessment.toFixed(2)}
        netPotkharab={totalNetPotkharabaAreaOfAll}
        netNaArea={totalNaAreaOfAll}
        netNaAssessment={prevNaAssessment.toFixed(2)}
        netJudiSalami={prevJudiSalami.toFixed(2)}
        netRate={prevRate.toFixed(2)}
        netEchAssessment={prevEchAssessment.toFixed(2)}
        netTotal={prevTotal.toFixed(2)}
        netPending={prevNetPending.toFixed(2)}
      />
    </>
  );
}

function getTotalAreaAssess(
  netCultiAreaH,
  potKharabArea,
  totalArea,
  assessment,
  naAreaH,
  naAssessment,
  juniSalami,
  rate,
  echAssessment,
  total,
  netPending,
) {
  prevCultiArea += parseFloat(netCultiAreaH);
  prevPotKharabArea += parseFloat(potKharabArea);
  prevTotalArea += parseFloat(totalArea);
  prevAssessment += parseFloat(assessment);
  prevNaArea += parseFloat(naAreaH);
  prevNaAssessment += parseFloat(naAssessment);
  prevJudiSalami += parseFloat(juniSalami == '' || juniSalami === null ? 0 : juniSalami);
  prevRate += parseFloat(rate == '' || rate === null ? 0 : rate);
  prevEchAssessment += parseFloat(
    echAssessment == '' || echAssessment === null ? 0 : echAssessment,
  );
  prevTotal += parseFloat(total == '' || total === null ? 0 : total);
  prevNetPending += parseFloat(netPending == '' || netPending === null ? 0 : netPending);
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
                  <th colSpan={18}>
                    <h3 style={{ color: 'red' }}>
                      <b>
                        <FormattedMessage id="villageForm3.form.villageTitle" />
                      </b>
                    </h3>
                  </th>
                </tr>
                <tr>
                  <th colSpan="18">
                    <h3 style={{ color: 'red' }}>
                      <b>
                        <FormattedMessage id="villageForm3.label.enamLand" />
                      </b>
                    </h3>
                  </th>
                </tr>

                <tr>
                  <th colSpan="18">
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
                  <th colSpan={1} rowSpan={3}>
                    <b>
                      इनाम वर्ग
                      {/* <FormattedMessage id="villageForm3.form.tenure" /> */}
                    </b>
                  </th>
                  <th rowSpan={3} colSpan={1}>
                    <b>
                      <FormattedMessage id="villageForm3.form.howLongContinuable" />
                    </b>
                  </th>
                  <th rowSpan={3} colSpan={1}>
                    <b>
                      <FormattedMessage id="villageForm3.form.runningEachClass" />
                    </b>
                  </th>
                  <th rowSpan={3} colSpan={1}>
                    <b>
                      <FormattedMessage id="villageForm3.form.registerOfLands" />
                    </b>
                  </th>
                  <th rowSpan={3} colSpan={1}>
                    <b>
                      <FormattedMessage id="villageForm3.form.sanadNo" />
                    </b>
                  </th>
                  <th rowSpan={3} colSpan={1}>
                    <b>भूमापन क्रमांक आणि हिस्सा क्रमांक</b>
                  </th>
                  {/*  <th rowSpan={4} colSpan={1}>
                    <b>
                      <FormattedMessage id="formLanguage.form.hissaNo" />
                    </b>
                  </th>
                   <th rowSpan={4} colSpan={1}>
                    <b>
                      <FormattedMessage id="villageForm3.form.cultivableArea" />
                    </b>
                  </th>
                  <th rowSpan={4} colSpan={1}>
                    <b>
                      <FormattedMessage id="villageForm3.form.assessment" />
                    </b>
                  </th>
                  <th rowSpan={4} colSpan={1}>
                    <b>
                      <FormattedMessage id="villageForm3.form.areaNaUse" />
                    </b>
                  </th>
                  <th rowSpan={4} colSpan={1}>
                    <b>
                      <FormattedMessage id="villageForm3.form.assessment" />
                    </b>
                  </th> */}
                  <th colSpan={3}>
                    <b>निव्वळ लागवडी योग्य क्षेत्र</b>
                  </th>
                  <th rowSpan={3} colSpan={1}>
                    <b>
                      <FormattedMessage id="villageForm3.form.assessment" />
                      <br />
                      (रु.पैसे)
                    </b>
                  </th>
                  <th colSpan={1} rowSpan={3}>
                    <b>
                      अकृषिक वापराखालील क्षेत्र
                      {/* <FormattedMessage id="villageForm3.form.tenure" /> */}
                    </b>
                  </th>
                  <th rowSpan={3} colSpan={1}>
                    <b>
                      आकारणी <br /> (रु.पैसे)
                    </b>
                  </th>
                  <th rowSpan={1} colSpan={3}>
                    <b>शासनाला येणे असलेली रक्कम</b>
                  </th>
                  <th rowSpan={3} colSpan={1}>
                    <b>एकूण </b>
                  </th>
                  <th rowSpan={3} colSpan={1}>
                    <b>दुमालादाराकडील शिल्लक किंवा नुकसान</b>
                  </th>
                  <th rowSpan={3} colSpan={1}>
                    <b>शेरा </b>
                  </th>
                </tr>

                <tr>
                  <th colSpan={1} rowSpan={2} style={{ width: '100px' }}>
                    {/* <FormattedMessage id="villageForm3.form.oldSalami" /> */}
                    लागवडक्षम क्षेत्र <br />( हे.आर.चौमी)
                  </th>
                  <th colSpan={1} rowSpan={2}>
                    पोटखराब क्षेत्र <br />
                    (हे.आर.चौमी)
                    {/* <FormattedMessage id="villageForm3.form.settlement" /> */}
                  </th>
                  <th colSpan={1} rowSpan={2}>
                    एकूण क्षेत्र <br />
                    (हे.आर.चौमी)
                    {/* <FormattedMessage id="villageForm3.form.settlement" /> */}
                  </th>
                  <th colSpan={1} rowSpan={2}>
                    जुडी/सलामी
                  </th>
                  <th colSpan={2} rowSpan={1}>
                    जमाबंदी
                  </th>
                </tr>
                <tr>
                  <th colSpan={1} rowSpan={1}>
                    दर
                  </th>
                  <th colSpan={1} rowSpan={2}>
                    आकारणी
                    <br /> (रु.पैसे)
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
                  <td>7-अ</td>
                  <td>7-ब</td>
                  <td>7-क</td>
                  <td>8</td>
                  <td>9</td>
                  <td>10</td>
                  <td>11</td>
                  <td>12</td>
                  <td>13</td>
                  <td>14</td>
                  <td>15</td>
                  <td>16</td>
                </tr>
                {this.props.dataToMap &&
                  this.props.dataToMap.map((r, i) => (
                    <tr>
                      <td>{r.classes}</td>
                      <td>{r.kindAndHowLongContinuable}</td>
                      <td>{r.runningNoEachClass}</td>
                      <td>{r.noInRegisterOfLands}</td>
                      <td>{r.sanadNo}</td>
                      <td>
                        {r.surveyNumber}
                        {/* {r.hissaNo && '/' + r.hissaNo} */}
                      </td>

                      <td>
                        {r.netCultiAreaH
                          .substring(0, r.netCultiAreaH.length - 2)
                          .concat('.')
                          .concat(r.netCultiAreaH.substring(r.netCultiAreaH.length - 2))}
                      </td>
                      <td>
                        {r.potKharabArea
                          .substring(0, r.potKharabArea.length - 2)
                          .concat('.')
                          .concat(r.potKharabArea.substring(r.potKharabArea.length - 2))}
                      </td>
                      <td>
                        {r.totalArea
                          .substring(0, r.totalArea.length - 2)
                          .concat('.')
                          .concat(r.totalArea.substring(r.totalArea.length - 2))}
                      </td>
                      <td>{r.assessment}</td>
                      <td>
                        {r.naAreaH
                          .substring(0, r.naAreaH.length - 2)
                          .concat('.')
                          .concat(r.naAreaH.substring(r.naAreaH.length - 2))}
                      </td>
                      <td>{r.naAssessment}</td>
                      <td>{r.juniSalami}</td>
                      <td>{r.rate}</td>
                      <td>{r.echAssessment}</td>
                      <td>{r.total}</td>
                      <td>{r.netPending}</td>
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
                  <td colSpan={6}>
                    <b>
                      <FormattedMessage id="formLanguage.form.total" />
                    </b>
                  </td>
                  <td>
                    <b>{this.props.netCultivableArea}</b>
                  </td>
                  <td>
                    <b>{this.props.netPotkharab}</b>
                  </td>
                  <td>
                    <b>{this.props.totalArea}</b>
                  </td>
                  <td>
                    <b>{this.props.netAssessment}</b>
                  </td>
                  <td>
                    <b>{this.props.netNaArea}</b>
                  </td>
                  <td>
                    <b>{this.props.netNaAssessment}</b>
                  </td>
                  <td>
                    <b>{this.props.netJudiSalami}</b>
                  </td>
                  <td>
                    <b>{this.props.netRate}</b>
                  </td>
                  <td>
                    <b>{this.props.netEchAssessment}</b>
                  </td>
                  <td>
                    <b>{this.props.netTotal}</b>
                  </td>
                  <td>
                    <b>{this.props.netPending}</b>
                  </td>
                  <td></td>
                </tr>{' '}
              </tbody>
            </table>
          </Card>
        </div>
      </div>
    );
  }
}

export default Report3;
