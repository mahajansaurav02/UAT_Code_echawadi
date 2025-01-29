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

var prevTotalArea = 0.0,
  prevAssessment = 0,
  prevNetCultiArea = 0,
  prevTotalPotKharabArea = 0;
// prevRoadsAndPath = 0;

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
  const [totalArea, setTotalArea] = useState(0);
  const [netCultiArea, setNetCultiArea] = useState(0);
  const [netAssessment, setNetAssessment] = useState(0);
  const [potkharabaType, setPotkharabaType] = useState('');
  const [revenueYear, setRevenueYear] = useState();
  const [headerData, setHeaderData] = useState();
  const [riceRate, setRiceRate] = useState();
  const [settlementYear, setSettlementYear] = useState();
  const [settlementExpiry, setSettlementExpiry] = useState();
  const [gardenRate, setGardenRate] = useState();
  const [surveyGroup, setSurveyGroup] = useState();
  const [dateInstallment, setDateInstallment] = useState();
  const [dryRate, setDryRate] = useState();
  const [warkasRate, setWarkasRate] = useState();
  const [loading, setLoading] = useState(false);
  const [villageSite, setVillageSite] = useState(0);
  const [river, setRiver] = useState();
  const [roadAndPath, setRoadAndPath] = useState();
  const [prevRoadsAndPath, setPrevRoadsAndPath] = useState(0);
  const [nalas, setNalas] = useState();

  const history = useHistory();

  const backToHomeButton = () => {
    history.push({ pathname: '/homepage' });
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const getHeaderData = async () => {
    setLoading(true);

    sendRequest(
      `${URLS.BaseURL}/form1/getForm1HeaderDetails?districtCode=${districtCode}&talukaCode=${talukaCode}&cCode=${codeVillage}`,
      'GET',
      null,
      (res) => {
        setRiceRate(res.data[0].rice_rate);
        setSettlementYear(res.data[0].settlementYear);
        setSettlementExpiry(res.data[0].settlementExp);
        setGardenRate(res.data[0].garden_rate);
        setSurveyGroup(res.data[0].survey_group);
        setDateInstallment(res.data[0].date_inst);
        setDryRate(res.data[0].dry_rate);
        setWarkasRate(res.data[0].warkas_rate);
      },
    );

    setLoading(false);
  };

  const getFooterData = async () => {
    setLoading(true);
    sendRequest(
      `${URLS.BaseURL}/form1/getForm1ReportFooter?districtCode=${districtCode}&talukaCode=${talukaCode}&cCode=${codeVillage}`,
      'GET',
      null,
      (res) => {
        setVillageSite(res.data[0].villageSite);
        setRiver(res.data[0].riversNalas);
        setNalas(res.data[0].nalas);
        setRoadAndPath(res.data[0].roadsAndPath);
        setPrevRoadsAndPath(
          parseFloat(res.data[0].riversNalas) +
            parseFloat(res.data[0].nalas) +
            parseFloat(res.data[0].roadsAndPath),
        );

        // getFirstTotalArea(
        //   res.data[0].villageSite,
        //   res.data[0].riversNalas,
        //   res.data[0].nalas,
        //   res.data[0].roadsAndPath,
        // );
      },
    );
    setLoading(false);
  };

  useEffect(() => {
    (prevTotalArea = 0), (prevAssessment = 0), (prevNetCultiArea = 0), (prevTotalPotKharabArea = 0);
  }, []);

  const getTableData = async () => {
    (prevTotalArea = 0), (prevAssessment = 0), (prevNetCultiArea = 0), (prevTotalPotKharabArea = 0);
    setLoading(true);

    sendRequest(
      `${URLS.BaseURL}/form1/getForm1Report?districtCode=${districtCode}&talukaCode=${talukaCode}&cCode=${codeVillage}`,
      'GET',
      null,
      (r) => {
        let potkharabaTypeInt;
        let cultivableAreaInt;
        let naAgriAssesment;

        // console.log('test for pot', cultivableAreaInt, 'type', potkharabaTypeInt);

        setTableData(
          r.data.form1Data.map((r) => ({
            id: r.id,
            surveyHissaNo:
              r.hissaNo == null || r.hissaNo.trim() == '' ? r.pin : r.pin + '/' + r.hissaNo,
            designation: r.designation,
            totalAreaH: r.totalAreaH,
            tenureName: r.tenureName,
            netCultiAreaH: r.netCultiAreaH,
            naAssessment: naAgriAssesment,
            assessment: r.assessment,
            publicRightsOfWayAndEasements: r.publicRightsOfWayAndEasements,
            particularsOfAlteration: r.particularsOfAlteration,
            orderSanctioningChanges: r.orderNo,
            orderDate: r.orderDate,
            remarks: r.remarks,
            potkharabaType: getPotkharabaType(
              r.potkharabaAH ? r.potkharabaAH : '0.0000',
              r.potkharabaBH ? r.potkharabaBH : '0.0000',
            ),
            cultivableAreaInt: getPotkharabaTypeAr(
              // r.potkharabaAH === '0.0000' ? '0' :
              r.potkharabaAH,
              // r.potkharabaBH === '0.0000' ? '0' :
              r.potkharabaBH,
            ),
            naAgriAssesment:
              r.naAssessment != null || r.naAssessment > 0 ? r.naAssessment : r.assessment,
            allTotal: getTotalAreaAssess(r.totalAreaH, r.netCultiAreaH, r.assessment),
          })),
          message.success('Records Fetched!!'),
        );
        setLoading(false);
      },
      'ERROR',
    );
    // console.log('potKharabArea', prevTotalPotKharabArea);
  };
  const changeLang = () => {
    getlang('M');
  };

  var totalAreaAddition = prevTotalArea.toFixed(4).substring(prevTotalArea.length - 2);
  var totalAreaOfAll = totalAreaAddition
    .substring(0, totalAreaAddition.length - 2)
    .concat('.')
    .concat(totalAreaAddition.substring(totalAreaAddition.length - 2));

  var totalAreaPathRoad = prevRoadsAndPath.toFixed(4).substring(prevRoadsAndPath.length - 2);
  var totalAreaOfPathRoads = totalAreaPathRoad
    .substring(0, totalAreaPathRoad.length - 2)
    .concat('.')
    .concat(totalAreaPathRoad.substring(totalAreaPathRoad.length - 2));

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

  function additionHoilKaAtaTari(param1, param2) {
    // console.log('param1', param1);
    // console.log('param2', param2);
    let param3 = parseFloat(param1) + parseFloat(param2);
    var param4 = param3.toFixed(4).substring(param3.length - 2);
    var param5 = param4
      .substring(0, param4.length - 2)
      .concat('.')
      .concat(param4.substring(param4.length - 2));
    return param5;
  }

  function additionOfTotalPotkharaba(param1, param2) {
    let param3 = parseFloat(param1) + parseFloat(param2);
    var param4 = param3.toFixed(4).substring(param3.length - 2);
    var param5 = param4
      .substring(0, param4.length - 2)
      .concat('.')
      .concat(param4.substring(param4.length - 2));
    return param5;
  }

  var totalCultiAreaAddition = prevNetCultiArea.toFixed(4).substring(prevNetCultiArea.length - 2);
  var totalNetCultiAreaOfAll = totalCultiAreaAddition
    .substring(0, totalCultiAreaAddition.length - 2)
    .concat('.')
    .concat(totalCultiAreaAddition.substring(totalCultiAreaAddition.length - 2));

  return (
    <div>
      <Card>
        <h1 style={{ textAlign: 'center' }}>
          गाव नमुना एक (आकारबंद)(गाव नमुना-७,ई-फेरफार Live डेटा)
        </h1>
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
              getFooterData();
            } else if (textForVillage == null) {
              message.info('Please Select Village');
            }
          }}
          type="primary"
        >
          <FormattedMessage id="villageReport1.button.getData" />
        </Button>

        {loading === true ? (
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
        isNirank={isNirank}
        villageSite={villageSite}
        river={river}
        nalas={nalas}
        roadAndPath={roadAndPath}
        additionOfTotalArea={additionHoilKaAtaTari(totalAreaOfAll, totalAreaOfPathRoads)}
        additionOfTotalPotkharaba={additionOfTotalPotkharaba(
          totalPotkharabOfAll,
          totalAreaOfPathRoads,
        )}
        // finalAdditionForReport={additionHoilKaAtaTari(
        //   additionHoilKaAtaTari(totalAreaOfAll, totalAreaOfPathRoads),
        //   villageSite,
        // )}
        finalAdditionForReport={
          additionHoilKaAtaTari(totalAreaOfAll, totalAreaOfPathRoads)}
        // finalAdditionOfTotalPotKharaba={additionOfTotalPotkharaba(
        //   additionOfTotalPotkharaba(totalPotkharabOfAll, totalAreaOfPathRoads),
        //   villageSite,
        // )}
        finalAdditionOfTotalPotKharaba={
          additionOfTotalPotkharaba(totalPotkharabOfAll, totalAreaOfPathRoads)}
        
        totalArea={totalAreaOfAll}
        totalForArea={totalAreaOfPathRoads}
        netCultiArea={totalNetCultiAreaOfAll}
        netAssessment={prevAssessment.toFixed(2)}
        totalPotkharabArea={totalPotkharabOfAll}
      />
    </div>
  );
}

function getTotalAreaAssess(totalAreaH, netCultiAreaH, assessment) {
  prevTotalArea += parseFloat(totalAreaH);
  prevNetCultiArea += parseFloat(netCultiAreaH);

  prevAssessment += parseFloat(assessment);
}

function getFirstTotalArea(villageSite, riversNalas, nalas, roadsAndPath) {
  let prevRoadsAndPath =
    parseFloat(villageSite) +
    parseFloat(riversNalas) +
    parseFloat(nalas) +
    parseFloat(roadsAndPath);
  // console.log('roadsAndPath ala ka?', roadsAndPath);
}

function getPotkharabaType(ptypeA, ptypeb) {
  if (ptypeb == '0.0000' && ptypeA == '0.0000') {
    return '-';
  } else if (ptypeb == '0.0000') {
    return 'अ';
  } else if (ptypeA == '0.0000') {
    return 'ब';
  } else {
    return 'अ,ब';
  }
}

function getPotkharabaTypeAr(ptypeA, ptypeb) {
  prevTotalPotKharabArea += parseFloat(ptypeA) + parseFloat(ptypeb);
  if (ptypeb == '0.0000' && ptypeA == '0.0000') {
    return 0 + ' , ' + 0;
  } else if (ptypeb == '0.0000') {
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
            <table id="table-to-xls" className={styles.report_table}>
              <thead>
                <tr>
                  <th colSpan="12">
                    <h3 style={{ color: 'red' }}>
                      <b>गाव नमुना एक (आकारबंद)( गाव नमुना-७,ई-फेरफार Live डेटा)</b>
                    </h3>
                  </th>
                </tr>
                <tr>
                  <th colSpan="12">
                    <h3 style={{ color: 'red' }}>
                      <b>
                        <FormattedMessage id="villageReport1.label.landRegister" />
                      </b>
                    </h3>
                  </th>
                </tr>
                <tr>
                  <th colSpan="12">
                    <h3 style={{ color: 'red' }}>
                      <b>
                        <FormattedMessage id="villageReport1.label.shetwarPatrika" />
                      </b>
                    </h3>
                  </th>
                </tr>
                <tr>
                  <th colSpan="12">
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
                  <th colSpan={3}>
                    <FormattedMessage id="villageReport1.table.standardRates" />
                  </th>
                  <th colSpan={2}></th>

                  <th colSpan={3}>
                    <FormattedMessage id="villageReport1.table.settlementYear" />
                  </th>
                  <th colSpan={4}> {this.props.settlementYear}</th>
                </tr>
                <tr style={{ textAlign: 'left' }}>
                  <th colSpan={3}>
                    <FormattedMessage id="villageReport1.table.dry" />
                  </th>
                  <th colSpan={2}>{this.props.dryRate}</th>

                  <th colSpan={3}>
                    <FormattedMessage id="villageReport1.table.expiredYear" />
                  </th>
                  <th colSpan={4}>{this.props.settlementExpiry}</th>
                </tr>
                <tr style={{ textAlign: 'left' }}>
                  <th colSpan={3}>
                    <FormattedMessage id="villageReport1.table.garden" />
                  </th>
                  <th colSpan={2}>{this.props.gardenRate}</th>

                  <th colSpan={3}>
                    <FormattedMessage id="villageReport1.table.surveyGrp" />
                  </th>
                  <th colSpan={4}>{this.props.surveyGroup}</th>
                </tr>
                <tr style={{ textAlign: 'left' }}>
                  <th colSpan={3}>
                    <FormattedMessage id="villageReport1.table.rice" />
                  </th>
                  <th colSpan={2}>{this.props.riceRate}</th>

                  <th colSpan={3}></th>
                  <th colSpan={4}></th>
                </tr>
                <tr style={{ textAlign: 'left' }}>
                  <th colSpan={3}>
                    <FormattedMessage id="villageReport1.table.warkas" />
                  </th>
                  <th colSpan={2}> {this.props.warkasRate}</th>

                  <th colSpan={3}>
                    <FormattedMessage id="villageReport1.table.dateInstall" />
                  </th>
                  <th colSpan={4}> {this.props.dateInstallment}</th>
                </tr>

                <tr style={{ height: '20px' }}>
                  <th colSpan={5}></th>
                  <th colSpan={7}></th>
                </tr>
                <tr>
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
                  <th>
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
                  </th>
                </tr>
                <tr>
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
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                </tr>
                <tr>
                  <th>1</th>
                  <th>2</th>
                  <th>3</th>
                  <th>4</th>
                  <th>5</th>
                  <th>6</th>
                  <th>7</th>
                  <th>8</th>
                  <th>9</th>
                  <th>10</th>
                  <th>11</th>
                  <th>12</th>
                </tr>
                <tr>
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
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {this.props.dataToMap &&
                  this.props.dataToMap.map((r) => (
                    <tr>
                      <td>{r.surveyHissaNo}</td>
                      <td>{r.tenureName}</td>
                      <td>
                        {r.totalAreaH
                          .substring(0, r.totalAreaH.length - 2)
                          .concat('.')
                          .concat(r.totalAreaH.substring(r.totalAreaH.length - 2))}
                      </td>
                      <td>{r.potkharabaType}</td>
                      <td>{r.cultivableAreaInt}</td>
                      <td>
                        {r.netCultiAreaH
                          .substring(0, r.netCultiAreaH.length - 2)
                          .concat('.')
                          .concat(r.netCultiAreaH.substring(r.netCultiAreaH.length - 2))}
                      </td>
                      {/* <td>{r.naAssessment}</td> */}
                      <td>{r.assessment}</td>
                      <td>{r.publicRightsOfWayAndEasements}</td>
                      <td>{r.particularsOfAlteration}</td>
                      <td>{r.orderSanctioningChanges}</td>
                      <td>{r.orderDate}</td>
                      <td>{r.remarks}</td>
                    </tr>
                  ))}

                <tr colSpan="11">
                  <td>
                    <b>
                      <FormattedMessage id="formLanguage.form.total" />
                    </b>
                  </td>
                  <td>
                    <b>
                      <FormattedMessage id="formLanguage.form.gavthan" />
                    </b>
                  </td>
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

                  <td colSpan={8}></td>
                </tr>

                <tr style={{ height: '20px' }}>
                  <td colSpan={5}></td>
                  <td colSpan={7}></td>
                </tr>
                <tr colSpan="11">
                  <td>
                    {/* <b>
                      <FormattedMessage id="formLanguage.form.total" />
                    </b> */}
                  </td>
                  <td>
                    <b>गावठाण </b>
                  </td>
                  <td>
                    <b>{this.props.villageSite}</b>
                  </td>
                  <td>{/*  <b>गावठाण </b> */}</td>
                  <td>
                    <b>{this.props.villageSite}</b>
                  </td>
                  <td>{/* <b>{this.props.netCultiArea}</b> */}</td>
                  <td>{/* <b>{this.props.netAssessment}</b> */}</td>

                  <td colSpan={8}></td>
                </tr>
                <tr colSpan="11">
                  <td>
                    {/* <b>
                      <FormattedMessage id="formLanguage.form.total" />
                    </b> */}
                  </td>
                  <td>
                    <b>नद्या </b>
                  </td>
                  <td>
                    <b>{this.props.river}</b>
                  </td>
                  <td>
                    <b>नद्या </b>
                  </td>
                  <td>
                    <b>{this.props.river}</b>
                  </td>
                  <td>{/* <b>{this.props.netCultiArea}</b> */}</td>
                  <td>{/* <b>{this.props.netAssessment}</b> */}</td>

                  <td colSpan={8}></td>
                </tr>
                <tr colSpan="11">
                  <td>
                    {/* <b>
                      <FormattedMessage id="formLanguage.form.total" />
                    </b> */}
                  </td>
                  <td>
                    <b>नाले </b>
                  </td>
                  <td>
                    <b>{this.props.nalas}</b>
                  </td>
                  <td>
                    <b>नाले </b>
                  </td>
                  <td>
                    <b>{this.props.nalas}</b>
                  </td>
                  <td>{/* <b>{this.props.netCultiArea}</b> */}</td>
                  <td>{/* <b>{this.props.netAssessment}</b> */}</td>

                  <td colSpan={8}></td>
                </tr>
                <tr colSpan="11">
                  <td>
                    {/* <b>
                      <FormattedMessage id="formLanguage.form.total" />
                    </b> */}
                  </td>
                  <td>
                    <b>रस्ते</b>
                  </td>
                  <td>
                    <b>{this.props.roadAndPath}</b>
                  </td>
                  <td>
                    <b>रस्ते</b>
                  </td>
                  <td>
                    <b>{this.props.roadAndPath}</b>
                  </td>
                  <td>{/* <b>{this.props.netCultiArea}</b> */}</td>
                  <td>{/* <b>{this.props.netAssessment}</b> */}</td>

                  <td colSpan={8}></td>
                </tr>
                <tr colSpan="11">
                  <td>
                    {/* <b>
                      <FormattedMessage id="formLanguage.form.total" />
                    </b> */}
                  </td>
                  <td>
                    <b>भूमापन क्रमांक खेरीज एकूण क्षेत्र</b>
                  </td>
                  <td>
                    <b>{this.props.totalForArea}</b>
                  </td>
                  <td></td>
                  <td>
                    <b>{this.props.totalForArea}</b>
                  </td>
                  <td>{/* <b>{this.props.netCultiArea}</b> */}</td>
                  <td>{/* <b>{this.props.netAssessment}</b> */}</td>

                  <td colSpan={8}></td>
                </tr>
                <tr colSpan="11">
                  <td>
                    {/* <b>
                      <FormattedMessage id="formLanguage.form.total" />
                    </b> */}
                  </td>
                  <td>
                    <b>गावठाणाबाहेरील एकूण </b>
                  </td>
                  <td>
                    <b>{this.props.additionOfTotalArea}</b>
                  </td>
                  <td></td>
                  <td>
                    <b>{this.props.additionOfTotalPotkharaba}</b>
                  </td>
                  <td>{/* <b>{this.props.netCultiArea}</b> */}</td>
                  <td>{/* <b>{this.props.netAssessment}</b> */}</td>

                  <td colSpan={8}></td>
                </tr>
                <tr colSpan="11">
                  <td>
                    {/* <b>
                      <FormattedMessage id="formLanguage.form.total" />
                    </b> */}
                  </td>
                  <td>
                    <b>गावठाण एकूण </b>
                  </td>
                  <td>
                    <b>{this.props.villageSite}</b>
                  </td>
                  <td></td>
                  <td>
                    <b>{this.props.villageSite}</b>
                  </td>
                  <td>{/* <b>{this.props.netCultiArea}</b> */}</td>
                  <td>{/* <b>{this.props.netAssessment}</b> */}</td>

                  <td colSpan={8}></td>
                </tr>
                <tr colSpan="11">
                  <td>
                    {/* <b>
                      <FormattedMessage id="formLanguage.form.total" />
                    </b> */}
                  </td>
                  <td>
                    <b>गावाची एकूण बेरीज </b>
                  </td>
                  <td>
                    <b>{this.props.finalAdditionForReport}</b>
                  </td>
                  <td></td>
                  <td>
                    <b>{this.props.finalAdditionOfTotalPotKharaba}</b>
                  </td>
                  <td>
                    <b>{this.props.netCultiArea}</b>
                  </td>
                  <td>
                    <b>{this.props.netAssessment}</b>
                  </td>
                  <td colSpan={8}></td>
                </tr>
              </tbody>
            </table>
          </Card>
        </div>
      </div>
    );
  }
}

export default Report;
