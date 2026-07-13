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

// Utility functions for safe parsing
const safeParseFloat = (value) => {
  if (value === null || value === undefined || value === '' || value === 'NaN') {
    return 0;
  }
  const parsed = parseFloat(value);
  return isNaN(parsed) ? 0 : parsed;
};

const safeAddition = (...values) => {
  return values.reduce((sum, val) => sum + safeParseFloat(val), 0);
};

const safeToString = (value) => {
  if (value === null || value === undefined) return '0';
  return String(value);
};

const safeToFixed = (value, decimals = 4) => {
  const num = safeParseFloat(value);
  return num.toFixed(decimals);
};

var prevTotalArea = 0.0,
  prevAssessment = 0,
  prevNetCultiArea = 0,
  prevTotalPotKharabArea = 0;

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

  const [prejirayatArea, setPrejirayatArea] = useState(0);
  const [prebagayatArea, setPrebagayatArea] = useState(0);
  const [pretariArea, setPretariArea] = useState(0);
  const [otherArea, setPreotherArea] = useState(0);

  const [prejirayatAreaA, setPrejirayatAreaA] = useState(0);
  const [prebagayatAreaA, setPrebagayatAreaA] = useState(0);
  const [pretariAreaA, setPretariAreaA] = useState(0);
  const [otherAreaA, setPreotherAreaA] = useState(0);

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
        setRiceRate(res.data[0]?.rice_rate || 0);
        setSettlementYear(res.data[0]?.settlementYear || '');
        setSettlementExpiry(res.data[0]?.settlementExp || '');
        setGardenRate(res.data[0]?.garden_rate || 0);
        setSurveyGroup(res.data[0]?.survey_group || '');
        setDateInstallment(res.data[0]?.date_inst || '');
        setDryRate(res.data[0]?.dry_rate || 0);
        setWarkasRate(res.data[0]?.warkas_rate || 0);
      },
    );

    setLoading(false);
  };

  const getFooterData = async () => {
    setLoading(true);
    sendRequest(
      `${URLS.BaseURL
      }/form1Dyslr/getDyslrForm1ReportFooter?cCode=${codeVillage}&districtCode=${districtCode}&talukaCode=${talukaCode}${revenueYear ? `&revenueYear=${revenueYear}` : ''
      }`,
      'GET',
      null,
      (res) => {
        const footerData = res.data?.[0];
        if (footerData) {
          setVillageSite(safeParseFloat(footerData.villageSite));
          setRiver(footerData.riversNalas || 0);
          setNalas(footerData.nalas || 0);
          setRoadAndPath(footerData.roadsAndPath || 0);
          setPrevRoadsAndPath(
            safeAddition(footerData.riversNalas, footerData.nalas, footerData.roadsAndPath)
          );
        }
      },
    );
    setLoading(false);
  };

  useEffect(() => {
    prevTotalArea = 0;
    prevAssessment = 0;
    prevNetCultiArea = 0;
    prevTotalPotKharabArea = 0;
  }, []);

  const getTableData = async () => {
    prevTotalArea = 0;
    prevAssessment = 0;
    prevNetCultiArea = 0;
    prevTotalPotKharabArea = 0;
    
    // Reset state values
    setPrejirayatArea(0);
    setPrebagayatArea(0);
    setPretariArea(0);
    setPreotherArea(0);
    setPrejirayatAreaA(0);
    setPrebagayatAreaA(0);
    setPretariAreaA(0);
    setPreotherAreaA(0);
    
    setLoading(true);

    sendRequest(
      `${URLS.BaseURL}/form1Dyslr/getFormDyslrSaveEntries?cCode=${codeVillage}`,
      'GET',
      null,
      (r) => {
        let potkharabaTypeInt;
        let cultivableAreaInt;
        let naAgriAssesment;

        // Reset accumulators for this request
        let totalJirayat = 0;
        let totalBagayat = 0;
        let totalTari = 0;
        let totalOther = 0;
        let totalJirayatA = 0;
        let totalBagayatA = 0;
        let totalTariA = 0;
        let totalOtherA = 0;

        r.data.form1DyslrData.forEach((d) => {
          totalJirayat += safeParseFloat(d.jirayatArea);
          totalBagayat += safeParseFloat(d.bagayatArea);
          totalTari += safeParseFloat(d.tariArea);
          totalOther += safeParseFloat(d.otherArea);
          totalJirayatA += safeParseFloat(d.jirayatAssessment);
          totalBagayatA += safeParseFloat(d.bagayatAssessment);
          totalTariA += safeParseFloat(d.tariAssessment);
          totalOtherA += safeParseFloat(d.otherAssessment);
        });

        // Update state with accumulated values
        setPrejirayatArea(totalJirayat);
        setPrebagayatArea(totalBagayat);
        setPretariArea(totalTari);
        setPreotherArea(totalOther);
        setPrejirayatAreaA(totalJirayatA);
        setPrebagayatAreaA(totalBagayatA);
        setPretariAreaA(totalTariA);
        setPreotherAreaA(totalOtherA);

        setTableData(
          r.data.form1DyslrData.map((r) => ({
            id: r.id,
            surveyHissaNo: (() => {
              let pinValue = r.pin != null ? String(r.pin) : '';
              let hissaValue = r.hissaNo != null ? String(r.hissaNo).trim() : '';
              let val = hissaValue === '' ? pinValue : pinValue + '/' + hissaValue;
              return val.replace(/\/\/+/g, '');
            })(),
            designation: r.designation || 0,
            totalAreaH: safeToString(r.totalAreaH),
            tenureName: r.tenureName ? r.tenureName : '',
            netCultiAreaH: safeToString(r.netCultiAreaH),
            naAssessment: naAgriAssesment || 0,
            assessment: safeParseFloat(r.assessment),
            publicRightsOfWayAndEasements: r.publicRightsOfWayAndEasements || 0,
            particularsOfAlteration: r.particularsOfAlteration ? r.particularsOfAlteration : '',
            orderSanctioningChanges: r.orderNo ? r.orderNo : '',
            orderDate: r.orderDate ? r.orderDate : '',
            remarks: r.remarks ? r.remarks : '',
            potkharabaType: getPotkharabaType(
              safeToString(r.potkharabaAH),
              safeToString(r.potkharabaBH),
            ),
            cultivableAreaInt: safeToString(r.cultivableAreaInt),
            jirayatArea: safeToString(r.jirayatArea),
            jirayatAssessment: safeToString(r.jirayatAssessment),
            bagayatArea: safeToString(r.bagayatArea),
            bagayatAssessment: safeToString(r.bagayatAssessment),
            tariArea: safeToString(r.tariArea),
            tariAssessment: safeToString(r.tariAssessment),
            otherArea: safeToString(r.otherArea),
            otherAssessment: safeToString(r.otherAssessment),
            naAgriAssesment: safeParseFloat(r.naAssessment) > 0 ? safeParseFloat(r.naAssessment) : safeParseFloat(r.assessment),
            allTotal: getTotalAreaAssess(
              r.totalAreaH,
              r.cultivableAreaInt,
              r.netCultiAreaH,
              r.assessment,
            ),
          })),
          message.success('Records Fetched!!'),
        );
        setLoading(false);
      },
      (err) => {
        setLoading(false);
        console.error('Error fetching data:', err);
        message.error('Failed to fetch records');
      },
    );
  };

  const changeLang = () => {
    getlang('M');
  };

  // Safe formatting functions
  const formatArea = (value) => {
    const num = safeParseFloat(value);
    const str = num.toFixed(4);
    return str;
  };

  // Recalculate all totals safely
  const totalAreaOfAll = formatArea(prevTotalArea);
  const totalAreaOfPathRoads = formatArea(prevRoadsAndPath);
  const totalPotkharabOfAll = formatArea(prevTotalPotKharabArea);
  const totalNetCultiAreaOfAll = formatArea(prevNetCultiArea);

  function additionHoilKaAtaTari(param1, param2) {
    return safeToFixed(safeParseFloat(param1) + safeParseFloat(param2), 4);
  }

  function additionOfTotalPotkharaba(param1, param2) {
    return safeToFixed(safeParseFloat(param1) + safeParseFloat(param2), 4);
  }

  const totalPotKharabAreaAdditionAll = formatArea(prevTotalPotKharabArea);

  return (
    <div>
      <Card>
        <h1 style={{ textAlign: 'center' }}>गाव नमुना एक Dyslr(आकारबंद)</h1>
        <div style={{ padding: 10 }}>
          <Button type="primary" onClick={handlePrint}>
            <FormattedMessage id="villageReport1.button.print" />
          </Button>
          <Button style={{ float: 'right' }} onClick={backToHomeButton} type="primary">
            <FormattedMessage id="villageReport1.button.home" />
          </Button>
        </div>
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
        finalAdditionForReport={additionHoilKaAtaTari(totalAreaOfAll, totalAreaOfPathRoads)}
        finalAdditionOfTotalPotKharaba={additionOfTotalPotkharaba(
          totalPotkharabOfAll,
          totalAreaOfPathRoads,
        )}
        totalArea={totalAreaOfAll}
        totalForArea={totalAreaOfPathRoads}
        netCultiArea={totalNetCultiAreaOfAll}
        netAssessment={safeToFixed(prevAssessment, 2)}
        totalPotkharabArea={totalPotKharabAreaAdditionAll}
        prejirayatArea={prejirayatArea}
        prebagayatArea={prebagayatArea}
        pretariArea={pretariArea}
        otherArea={otherArea}
        prejirayatAreaA={prejirayatAreaA}
        prebagayatAreaA={prebagayatAreaA}
        pretariAreaA={pretariAreaA}
        otherAreaA={otherAreaA}
      />
    </div>
  );
}

function getTotalAreaAssess(totalAreaH, cultivableAreaInt, netCultiAreaH, assessment) {
  prevTotalArea += safeParseFloat(totalAreaH);
  prevTotalPotKharabArea += safeParseFloat(cultivableAreaInt);
  prevNetCultiArea += safeParseFloat(netCultiAreaH);
  prevAssessment += safeParseFloat(assessment);
}

function getPotkharabaType(ptypeA, ptypeb) {
  const a = safeParseFloat(ptypeA);
  const b = safeParseFloat(ptypeb);
  
  if (a === 0 && b === 0) {
    return '-';
  } else if (b === 0) {
    return 'अ';
  } else if (a === 0) {
    return 'ब';
  } else {
    return 'अ,ब';
  }
}

function getPotkharabaTypeAr(ptypeA, ptypeb) {
  const a = safeParseFloat(ptypeA);
  const b = safeParseFloat(ptypeb);
  prevTotalPotKharabArea += a + b;
  
  if (a === 0 && b === 0) {
    return '0 , 0';
  } else if (b === 0) {
    return safeToString(a);
  } else if (a === 0) {
    return safeToString(b);
  } else {
    return safeToString(b) + ' , ' + safeToString(a);
  }
}

export default Report;

// ------------------------------------------------------------------------------
class ComponentToPrint extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isUpside: true,
    };
  }

  handleClick = () => {
    this.setState((prevState) => ({
      isUpside: !prevState.isUpside,
    }));
  };
  
  render() {
    // Safe values for display
    const netAssessmentDisplay = this.props.netAssessment === 'NaN' || !this.props.netAssessment 
      ? '0.00' 
      : this.props.netAssessment;
    
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
                  <th colSpan="22">
                    <h3 style={{ color: 'red' }}>
                      <b> गाव नमुना एक Dyslr(आकारबंद) </b>
                    </h3>
                  </th>
                </tr>
                <tr>
                  <th colSpan="22">
                    <h4 style={{ color: 'red' }}>
                      <pre>
                        <b>
                          <FormattedMessage id="villageReport1.label.village" />
                          {this.props.village || ''} <FormattedMessage id="villageReport1.label.taluka" />
                          {this.props.taluka || ''}{' '}
                          <FormattedMessage id="villageReport1.label.district" />
                          {this.props.district || ''}
                        </b>
                      </pre>
                    </h4>
                  </th>
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
                  <th colSpan={5}>
                    <FormattedMessage id="villageReport1.table.netCultivableArea" />
                  </th>

                  <th colSpan={5}>
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
                  <th>जिरायत क्षेत्र</th>
                  <th> बागायत क्षेत्र </th>
                  <th>तरी क्षेत्र </th>
                  <th>इतर क्षेत्र</th>
                  <th>एकूण</th>
                  <th>जिरायत आकारणी</th>
                  <th> बागायत आकारणी </th>
                  <th>तरी आकारणी </th>
                  <th>इतर आकारणी</th>
                  <th>एकूण</th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                </tr>
                <tr>
                  <th onClick={this.handleClick} style={{ cursor: 'pointer' }}>
                    1 {this.state.isUpside ? <>&#9650;</> : <>&#9660;</>}
                  </th>
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
                  <th>13</th>
                  <th>14</th>
                  <th>15</th>
                  <th>16</th>
                  <th>17</th>
                  <th>18</th>
                  <th>19</th>
                  <th>20</th>
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
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th>
                    <FormattedMessage id="villageReport1.table.hectareArea" />
                  </th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
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
                  this.props.dataToMap
                    .sort((a, b) => {
                      const valA = String(a.surveyHissaNo || '');
                      const valB = String(b.surveyHissaNo || '');
                      const res = valA.localeCompare(valB, undefined, {
                        numeric: true,
                        sensitivity: 'base',
                      });
                      return this.state.isUpside ? res : -res;
                    })
                    .map((r, i) => (
                      <tr key={r.id ? r.id : `${r.surveyHissaNo}-${i}`}>
                        <td>{r.surveyHissaNo || ''}</td>
                        <td>{r.tenureName || ''}</td>
                        <td>{r.totalAreaH || '0'}</td>
                        <td>{r.potkharabaType || '-'}</td>
                        <td>{r.cultivableAreaInt || '0'}</td>
                        <td>{r.jirayatArea || '0'}</td>
                        <td>{r.bagayatArea || '0'}</td>
                        <td>{r.tariArea || '0'}</td>
                        <td>{r.otherArea || '0'}</td>
                        <td>{r.netCultiAreaH || '0'}</td>
                        <td>{r.jirayatAssessment || '0'}</td>
                        <td>{r.bagayatAssessment || '0'}</td>
                        <td>{r.tariAssessment || '0'}</td>
                        <td>{r.otherAssessment || '0'}</td>
                        <td>{r.assessment || '0'}</td>
                        <td>{r.publicRightsOfWayAndEasements || '0'}</td>
                        <td>{r.particularsOfAlteration || ''}</td>
                        <td>{r.orderSanctioningChanges || ''}</td>
                        <td>{r.orderDate || ''}</td>
                        <td>{r.remarks || ''}</td>
                      </tr>
                    ))}

                {this.props.dataToMap && (
                  <>
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
                        <b>{this.props.totalArea || '0'}</b>
                      </td>
                      <td></td>
                      <td>
                        <b>{this.props.totalPotkharabArea || '0'}</b>
                      </td>
                      <td>
                        <b>{this.props.prejirayatArea ? this.props.prejirayatArea.toFixed(2) : '0.00'} </b>
                      </td>
                      <td>
                        <b>{this.props.prebagayatArea ? this.props.prebagayatArea.toFixed(2) : '0.00'} </b>
                      </td>
                      <td>
                        <b>{this.props.pretariArea ? this.props.pretariArea.toFixed(2) : '0.00'} </b>
                      </td>
                      <td>
                        <b>{this.props.otherArea ? this.props.otherArea.toFixed(2) : '0.00'} </b>
                      </td>
                      <td>
                        <b>{this.props.netCultiArea || '0'}</b>
                      </td>
                      <td>
                        <b>{this.props.prejirayatAreaA ? this.props.prejirayatAreaA.toFixed(2) : '0.00'}</b>
                      </td>
                      <td>
                        <b>{this.props.prebagayatAreaA ? this.props.prebagayatAreaA.toFixed(2) : '0.00'}</b>
                      </td>
                      <td>
                        <b>{this.props.pretariAreaA ? this.props.pretariAreaA.toFixed(2) : '0.00'}</b>
                      </td>
                      <td>
                        <b>{this.props.otherAreaA ? this.props.otherAreaA.toFixed(2) : '0.00'}</b>
                      </td>
                      <td>
                        <b>{netAssessmentDisplay}</b>
                      </td>
                      <td colSpan={5}></td>
                    </tr>

                    <tr>
                      <td colSpan={20}>&nbsp;</td>
                    </tr>

                    {/* FOOTER */}
                    <tr>
                      <td></td>
                      <td>
                        <FormattedMessage id="formLanguage.form.gaothan" />
                      </td>
                      <td>{this.props.villageSite || '0'}</td>
                      <td></td>
                      <td>{this.props.villageSite || '0'}</td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td></td>
                      <td>
                        <FormattedMessage id="formLanguage.form.river" />
                      </td>
                      <td>{this.props.river || '0'}</td>
                      <td>
                        <FormattedMessage id="formLanguage.form.river" />
                      </td>
                      <td>{this.props.river || '0'}</td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td></td>
                      <td>
                        <FormattedMessage id="formLanguage.form.nala" />
                      </td>
                      <td>{this.props.nalas || '0'}</td>
                      <td>
                        <FormattedMessage id="formLanguage.form.nala" />
                      </td>
                      <td>{this.props.nalas || '0'}</td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td></td>
                      <td>
                        <FormattedMessage id="formLanguage.form.road" />
                      </td>
                      <td>{this.props.roadAndPath || '0'}</td>
                      <td>
                        <FormattedMessage id="formLanguage.form.road" />
                      </td>
                      <td>{this.props.roadAndPath || '0'}</td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td></td>
                      <td>
                        <b>
                          <FormattedMessage id="formLanguage.form.nonSurveyTotal" />
                        </b>
                      </td>
                      <td>
                        <b>{this.props.totalForArea || '0'}</b>
                      </td>
                      <td></td>
                      <td>
                        <b>{this.props.totalForArea || '0'}</b>
                      </td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td></td>
                      <td>
                        <b>
                          <FormattedMessage id="formLanguage.form.outsideGaothanTotal" />
                        </b>
                      </td>
                      <td>
                        <b>{this.props.additionOfTotalArea || '0'}</b>
                      </td>
                      <td></td>
                      <td>
                        <b>{this.props.additionOfTotalPotkharaba || '0'}</b>
                      </td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td></td>
                      <td>
                        <b>
                          <FormattedMessage id="formLanguage.form.gaothanTotal" />
                        </b>
                      </td>
                      <td>
                        <b>{this.props.villageSite || '0'}</b>
                      </td>
                      <td></td>
                      <td>
                        <b>{this.props.villageSite || '0'}</b>
                      </td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td></td>
                      <td>
                        <b>
                          <FormattedMessage id="formLanguage.form.villageGrandTotal" />
                        </b>
                      </td>
                      <td>
                        <b>{this.props.finalAdditionForReport || '0'}</b>
                      </td>
                      <td></td>
                      <td>
                        <b>{this.props.finalAdditionOfTotalPotKharaba || '0'}</b>
                      </td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td>
                        <b>{this.props.netCultiArea || '0'}</b>
                      </td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td>
                        <b>{netAssessmentDisplay}</b>
                      </td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </Card>
        </div>
      </div>
    );
  }
}