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
import { useEffect } from 'react';
import ReactHtmlTableToExcel from 'react-html-table-to-excel';

let prevTotalArea = 0,
  prevAssessment = 0,
  prevNetCultiArea = 0,
  prevTotalPotKharabArea = 0;

function Report1ODC() {
  const { districtName, talukaName, districtCode, talukaCode } = useModel('details');
  const { sendRequest } = useAxios();
  const [codeVillage, setCodeVillage] = useState('');
  const [textForVillage, setTextForVillage] = useState();
  const [village, setVillage] = useState([]);
  const [tableData, setTableData] = useState();
  const [isNirank, setIsNirank] = useState(false);
  const [textVillage, setTextVillage] = useState('');
  const componentRef = useRef();
  const [totalArea, setTotalArea] = useState(0);
  const [netCultiArea, setNetCultiArea] = useState(0);
  const [netAssessment, setNetAssessment] = useState(0);
  const [potkharabaType, setPotkharabaType] = useState('');
  const [revenueYear, setRevenueYear] = useState();
  const [riceRate, setRiceRate] = useState();
  const [settlementYear, setSettlementYear] = useState();
  const [settlementExpiry, setSettlementExpiry] = useState();
  const [gardenRate, setGardenRate] = useState();
  const [surveyGroup, setSurveyGroup] = useState();
  const [dateInstallment, setDateInstallment] = useState();
  const [dryRate, setDryRate] = useState();
  const [warkasRate, setWarkasRate] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();
  const backToHomeButton = () => {
    history.push({ pathname: '/homepage' });
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const getHeaderData = async () => {
    sendRequest(
      `${URLS.BaseURL}/form1/getForm1HeaderDetails?districtCode=${districtCode}&talukaCode=${talukaCode}&cCode=${codeVillage}`,
      'GET',
      null,
      (res) => {
        setRiceRate(res.data[0].rice_rate), setSettlementYear(res.data[0].settlementYear);
        setSettlementExpiry(res.data[0].settlementExp);
        setGardenRate(res.data[0].garden_rate);
        setSurveyGroup(res.data[0].survey_group);
        setDateInstallment(res.data[0].date_inst);
        setDryRate(res.data[0].dry_rate);
        setWarkasRate(res.data[0].warkas_rate);
      },
    );
  };

  useEffect(() => {
    (prevTotalArea = 0), (prevAssessment = 0), (prevNetCultiArea = 0), (prevTotalPotKharabArea = 0);
  }, []);

  const getTableData = async () => {
    (prevTotalArea = 0), (prevAssessment = 0), (prevNetCultiArea = 0), (prevTotalPotKharabArea = 0);

    setIsLoading(true);
    // setTotalArea(0);
    // setNetCultiArea(0);
    // setNetAssessment(0);
    sendRequest(
      `${URLS.BaseURL}/form1/getForm1ODCReport?districtCode=${districtCode}&talukaCode=${talukaCode}&cCode=${codeVillage}`,
      'GET',
      null,
      (r) => {
        let potkharabaTypeInt;
        let cultivableAreaInt;
        let naAgriAssesment;

        setTableData(
          r.data.map((r, i) => ({
            id: r.id,
            srNo: i + 1,
            surveyHissaNo: r.hissaNo == null || r.hissaNo == '' ? r.pin : r.pin + '/' + r.hissaNo,
            designation: r.designation,
            totalAreaH: r.totalAreaH,
            tenureName: r.tenureName,
            netCultiAreaH: r.netCultiAreaH,
            naAssessment: naAgriAssesment,
            assessment: r.assessment,
            publicRightsOfWayAndEasements: r.publicRightsOfWayAndEasements,
            particularsOfAlteration: r.particularsOfAlteration,
            orderSanctioningChanges: r.orderNo,
            orderDt: r.orderDt,
            remarks: r.remarks,
            potkharabaType: getPotkharabaType(
              r.potkharabaAH ? r.potkharabaAH : '0.0000',
              r.potkharabaBH ? r.potkharabaBH : '0.0000',
            ),
            cultivableAreaInt: getPotkharabaTypeAr(
              r.potkharabaAH ? r.potkharabaAH : '0.0000',
              r.potkharabaBH ? r.potkharabaBH : '0.0000',
            ),
            naAgriAssesment:
              r.naAssessment != null || r.naAssessment > 0 ? r.naAssessment : r.assessment,
            test: TotalOfArea(r.totalAreaH, r.assessment, r.netCultiAreaH),
          })),
          message.success('Records Fetched!!'),
        );
        setIsLoading(false);
      },
      'ERROR',
    );
    // setTotalArea(prevTotalArea);
    // setNetAssessment(prevAssessment);
    // setNetCultiArea(prevNetCultiArea);
  };

  var totalAreaAddition = prevTotalArea.toFixed(4).substring(prevTotalArea.length - 2);
  var totalAreaOfAll = totalAreaAddition
    .substring(0, totalAreaAddition.length - 2)
    .concat('.')
    .concat(totalAreaAddition.substring(totalAreaAddition.length - 2));

  var totalPotkharabAddition = prevTotalPotKharabArea
    .toFixed(4)
    .substring(prevTotalPotKharabArea.length - 2);
  var totalPotkharabOfAll = totalPotkharabAddition
    .substring(0, totalPotkharabAddition.length - 2)
    .concat('.')
    .concat(totalPotkharabAddition.substring(totalPotkharabAddition.length - 2));

  var totalCultiAreaAddition = prevNetCultiArea.toFixed(4).substring(prevNetCultiArea.length - 2);
  var totalNetCultiAreaOfAll = totalCultiAreaAddition
    .substring(0, totalCultiAreaAddition.length - 2)
    .concat('.')
    .concat(totalCultiAreaAddition.substring(totalCultiAreaAddition.length - 2));

  return (
    <div>
      <Card>
        <h1 style={{ textAlign: 'center' }}>गाव नमुना एक( ई फेरफार ओ.डी.सी )</h1>
        <div style={{ padding: 10 }}>
          <Button type="primary" onClick={handlePrint}>
            <FormattedMessage id="villageReport1.button.print" />
          </Button>
          <Button style={{ float: 'right' }} onClick={backToHomeButton} type="primary">
            <FormattedMessage id="villageReport1.button.home" />
          </Button>
        </div>
        {/* <Row style={{ marginLeft: '15px' }}> */}
        <VillageSelector
          pageType="withoutYear"
          setCodeVillage={setCodeVillage}
          setTextForVillage={setTextForVillage}
          onVillageChange={(setVillage, setTableData)}
          yearChange={setRevenueYear}
          setIsNirank={setIsNirank}
        />

        <Button
          onClick={() => {
            if (textForVillage) {
              getHeaderData();
              getTableData();
            } else if (textForVillage == null) {
              message.info('Please Select Village');
            }
          }}
          type="primary"
        >
          <FormattedMessage id="villageReport1.button.getData" />
        </Button>
        {isLoading === true ? (
          <Spin size="large" style={{ marginLeft: '500px', marginTop: '20px' }} />
        ) : null}
        {/* </Row> */}
      </Card>
      <ComponentToPrint
        ref={componentRef}
        village={textForVillage}
        taluka={talukaName}
        district={districtName}
        dataToMap={tableData}
        riceRate={riceRate}
        settlementExpiry={settlementExpiry}
        gardenRate={gardenRate}
        surveyGroup={surveyGroup}
        dateInstallment={dateInstallment}
        dryRate={dryRate}
        settlementYear={settlementYear}
        warkasRate={warkasRate}
        totalArea={totalAreaOfAll}
        netCultiArea={totalNetCultiAreaOfAll}
        netAssessment={prevAssessment.toFixed(2)}
        totalPotkharabArea={totalPotkharabOfAll}
      />
    </div>
  );
}

function TotalOfArea(totalAreaH, assessment, netCultiAreaH) {
  prevTotalArea += parseFloat(totalAreaH);
  prevAssessment += parseFloat(assessment);
  prevNetCultiArea += parseFloat(netCultiAreaH);
  // console.log('Values', prevTotalArea, prevAssessment, prevNetCultiArea);
}

function getPotkharabaType(ptypeA, ptypeb) {
  if (ptypeb == 0 && ptypeA == '0.0000') {
    return '-';
  } else if (ptypeb == 0) {
    return 'अ';
  } else if (ptypeA == '0.0000') {
    return 'ब';
  } else {
    return 'अ,ब';
  }
}

function getPotkharabaTypeAr(ptypeA, ptypeb) {
  prevTotalPotKharabArea += parseFloat(ptypeA) + parseFloat(ptypeb);

  if (ptypeb == 0 && ptypeA == '0.0000') {
    return ptypeb + ' , ' + ptypeA;
  } else if (ptypeb == 0) {
    return ptypeA;
  } else if (ptypeA == '0.0000') {
    return ptypeb;
  } else {
    return ptypeb + ' , ' + ptypeA;
  }
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
            <table
              id="table-to-xls"
              className={styles.report_table} /* style={{ backgroundColor: 'white' }} */
            >
              <thead style={{backgroundColor:'#ADD8E6', border:'1px solid black' }}>
                <tr>
                  <th colSpan="8">
                    <h3 style={{ color: 'red' }}>
                      <b>गाव नमुना एक( ई फेरफार मधील ओ.डी.सी प्रमाणे दुरुस्त)</b>
                    </h3>
                  </th>
                </tr>
                <tr>
                  <th colSpan="8">
                    <h3 style={{ color: 'red' }}>
                      <b>
                        <FormattedMessage id="villageReport1.label.landRegister" />
                      </b>
                    </h3>
                  </th>
                </tr>
                <tr>
                  <th colSpan="8">
                    <h3 style={{ color: 'red' }}>
                      <b>
                        <FormattedMessage id="villageReport1.label.shetwarPatrika" />
                      </b>
                    </h3>
                  </th>
                </tr>
                <tr>
                  <th colSpan="8">
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

                <tr style={{ textAlign: 'left' }}>
                  <th colSpan={2}>
                    <FormattedMessage id="villageReport1.table.standardRates" />
                  </th>
                  <th colSpan={2}></th>

                  <th colSpan={2}>
                    <FormattedMessage id="villageReport1.table.settlementYear" />
                  </th>
                  <th colSpan={3}> {this.props.settlementYear}</th>
                </tr>
                <tr style={{ textAlign: 'left' }}>
                  <th colSpan={2}>
                    <FormattedMessage id="villageReport1.table.dry" />
                  </th>
                  <th colSpan={2}>{this.props.dryRate}</th>

                  <th colSpan={2}>
                    <FormattedMessage id="villageReport1.table.expiredYear" />
                  </th>
                  <th colSpan={3}>{this.props.settlementExpiry}</th>
                </tr>
                <tr style={{ textAlign: 'left' }}>
                  <th colSpan={2}>
                    <FormattedMessage id="villageReport1.table.garden" />
                  </th>
                  <th colSpan={2}>{this.props.gardenRate}</th>

                  <th colSpan={2}>
                    <FormattedMessage id="villageReport1.table.surveyGrp" />
                  </th>
                  <th colSpan={3}>{this.props.surveyGroup}</th>
                </tr>
                <tr style={{ textAlign: 'left' }}>
                  <th colSpan={2}>
                    <FormattedMessage id="villageReport1.table.rice" />
                  </th>
                  <th colSpan={2}>{this.props.riceRate}</th>

                  <th colSpan={2}></th>
                  <th colSpan={3}></th>
                </tr>
                <tr style={{ textAlign: 'left' }}>
                  <th colSpan={2}>
                    <FormattedMessage id="villageReport1.table.warkas" />
                  </th>
                  <th colSpan={2}> {this.props.warkasRate}</th>

                  <th colSpan={2}>
                    <FormattedMessage id="villageReport1.table.dateInstall" />
                  </th>
                  <th colSpan={3}> {this.props.dateInstallment}</th>
                </tr>
                <tr style={{ height: '20px' }}>
                  <th colSpan={4}></th>
                  <th colSpan={6}></th>
                </tr>
                <tr>
                  {/* <th>{<FormattedMessage id="villageForm.form.srno" />}</th> */}
                  <th>
                    <FormattedMessage id="villageReport1.table.surveyNo" />
                  </th>
                  <th>
                    <FormattedMessage id="villageReport1.table.tenure" />
                  </th>
                  <th>
                    <FormattedMessage id="villageReport1.table.totalArea" />
                  </th>
                  <th colSpan={2}>
                    <FormattedMessage id="villageReport1.label.deductMessage" />
                  </th>
                  <th>
                    <FormattedMessage id="villageReport1.table.netCultivableArea" />
                  </th>

                  <th>
                    <FormattedMessage id="villageReport1.table.naAssessment" />
                  </th>
                  {/* <th>
                    <FormattedMessage id="villageReport1.table.publicRights" />
                  </th>
                  <th>
                    <FormattedMessage id="villageReport1.table.alteration" />
                  </th>
                  <th>
                    <FormattedMessage id="villageReport1.form.sanctioningChanges" />
                  </th>
                  <th>
                    <FormattedMessage id="formLanguage.table.orderDate" />
                  </th> 
                  <th>
                    <FormattedMessage id="villageReport1.table.remark" />
                  </th>*/}
                </tr>
                <tr>
                  {/* <th></th> */}
                  <th></th>
                  <th></th>
                  <th></th>
                  <th>
                    <FormattedMessage id="villageReport1.table.kind" />
                  </th>
                  <th>
                    <FormattedMessage id="villageReport1.table.area" />
                  </th>
                  <th></th>
                  <th></th>
                  {/*<th></th>
                   <th></th>
                  <th></th>
                  <th></th>
                  <th></th> */}
                </tr>
                <tr>
                  <th>1</th>
                  <th>2</th>
                  <th>3</th>
                  <th>4</th>
                  <th>5</th>
                  <th>6</th>
                  <th>7</th>
                  {/* <th>8</th> */}
                  {/* <th>8</th> */}
                </tr>
                <tr>
                  {/* <th></th> */}
                  <th></th>

                  <th></th>
                  <th>
                    <FormattedMessage id="villageReport1.table.hectareArea" />
                  </th>
                  <th></th>
                  <th>
                    <FormattedMessage id="villageReport1.table.hectareArea" />
                  </th>
                  <th>
                    <FormattedMessage id="villageReport1.table.hectareArea" />
                  </th>
                  <th>
                    <FormattedMessage id="villageReport1.table.rupeesP" />
                  </th>
                  {/*  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th> */}
                </tr>
              </thead>
              <tbody>
                {this.props.dataToMap &&
                  this.props.dataToMap.map((r, i) => (
                    <tr>
                      {/* <td>{r.srNo}</td> */}
                      <td>{r.surveyHissaNo}</td>
                      <td>{r.tenureName}</td>
                      <td>
                        {r.totalAreaH
                          .substring(0, r.totalAreaH.length - 2)
                          .concat('.')
                          .concat(r.totalAreaH.substring(r.totalAreaH.length - 2))}
                      </td>
                      <td>{r.potkharabaType}</td>
                      <td>
                        {r.cultivableAreaInt
                          .substring(0, r.cultivableAreaInt.length - 2)
                          .concat('.')
                          .concat(r.cultivableAreaInt.substring(r.cultivableAreaInt.length - 2))}
                      </td>
                      <td>
                        {r.netCultiAreaH
                          .substring(0, r.netCultiAreaH.length - 2)
                          .concat('.')
                          .concat(r.netCultiAreaH.substring(r.netCultiAreaH.length - 2))}
                      </td>
                      <td>{r.assessment}</td>
                      {/* <td>{r.publicRightsOfWayAndEasements}</td>
                      <td>{r.particularsOfAlteration}</td>
                      <td>{r.orderSanctioningChanges}</td>
                      <td>{r.orderDt}</td> 
                      <td>{r.remarks}</td>*/}
                    </tr>
                  ))}
                <tr colSpan="10">
                  <td>
                    <b>
                      <FormattedMessage id="formLanguage.form.total" />
                    </b>
                  </td>
                  {/* <td></td> */}
                  <td></td>
                  <td>
                    <b>{this.props.totalArea}</b>
                  </td>
                  <td></td>
                  <td>
                    <b>{this.props.totalPotkharabArea}</b>
                  </td>
                  <td>
                    <b>{this.props.netCultiArea}</b>
                  </td>
                  <td>
                    <b>{this.props.netAssessment}</b>
                  </td>
                </tr>
              </tbody>
            </table>
          </Card>
        </div>
      </div>
    );
  }
}

export default Report1ODC;
