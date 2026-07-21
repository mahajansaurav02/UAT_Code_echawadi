import { PageContainer } from '@ant-design/pro-layout';
import styles from './report.module.css';
import React, { useState, useRef, useEffect } from 'react';
import { Button, Card, Col, message, Row, Select, Spin } from 'antd';
import { useHistory, useLocation } from 'umi';
import Axios from 'axios';
import VillageSelector from '@/components/eComponents/VillageSelector';
import BaseURL from '@/URLs/urls';
import { useReactToPrint } from 'react-to-print';
import URLS from '@/URLs/urls';
import useAxios from '@/components/eComponents/use-axios';
import { useModel } from 'umi';
import { FormattedMessage } from 'umi';
import landType from './landType';
import ReactHtmlTableToExcel from 'react-html-table-to-excel';

function DyslrForm1AbstractReport() {
  const { districtName, talukaName, districtCode, talukaCode } = useModel('details');
  const { sendRequest } = useAxios();
  const [isNirank, setIsNirank] = useState(false);
  const [codeVillage, setCodeVillage] = useState('');
  const [textForVillage, setTextForVillage] = useState();
  const [village, setVillage] = useState([]);
  const [tableData, setTableData] = useState();
  const [textVillage, setTextVillage] = useState('');
  const [tenureArea, setTenureArea] = useState(0);
  const [tenureAssessment, setTenureAssessment] = useState(0);
  const [tenure2Area, setTenure2Area] = useState(0);
  const [tenure2Assessment, setTenure2Assessment] = useState(0);
  const [tenure3Area, setTenure3Area] = useState(0);
  const [tenure3Assessment, setTenure3Assessment] = useState(0);
  const [tenure4Area, setTenure4Area] = useState(0);
  const [tenure4Assessment, setTenure4Assessment] = useState(0);
  const [specialAgreement, setSpecialAgreement] = useState(0);
  const [dumalaLandArea, setDumalaLandArea] = useState(0);
  const [dumalaLandAssessment, setDumalaLandAssessment] = useState(0);
  const [forestArea, setForestArea] = useState(0);
  const [kuranArea, setKuranArea] = useState(0);
  const [cattleLandArea, setCattleLandArea] = useState(0);
  const [villageSiteArea, setVillageSiteArea] = useState(0);
  const [tankArea, setTankArea] = useState(0);
  const [burialGroundArea, setBurialGroundArea] = useState(0);
  const [railwayArea, setRailwayArea] = useState(0);
  const [roadWaterCourseArea, setRoadWaterCourseArea] = useState(0);
  const [roadAndPathsArea, setRoadAndPathsArea] = useState(0);
  const [pipeLineArea, setPipeLineArea] = useState(0);
  const [contonmentArea, setContonmentArea] = useState(0);
  const [schoolArea, setSchoolArea] = useState(0);
  const [dharmashalasArea, setDharmashalasArea] = useState(0);
  const [srNoForNonAgricultureUseArea, setSrNoForNonAgricultureUseArea] = useState(0);
  const [assignedForSpecialUseArea, setAssignedForSpecialUseArea] = useState(0);
  const [potKharabaArea, setPotKharabaArea] = useState(0);
  const [potKharabaAssessment, setPotKharabaAssessment] = useState(0);
  const [riversArea, setRiversArea] = useState(0);
  const [nalasArea, setNalasArea] = useState(0);
  const componentRef = useRef();
  const [values, setValues] = useState();
  const [revenueYear, setRevenueYear] = useState();
  const history = useHistory();
  const [mp, setMp] = useState(new Map());
  const [unOccupied, setUnOccupied] = useState(0);
  const [loadings, setLoadings] = useState([]);
  const location = useLocation();
  const [autoFetch, setAutoFetch] = useState(false);
  const [footerVillageSite, setFooterVillageSite] = useState(0);
  const [footerRiversNalas, setFooterRiversNalas] = useState(0);
  const [footerNalas, setFooterNalas] = useState(0);
  const [footerRoadsAndPath, setFooterRoadsAndPath] = useState(0);

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
    }, 3000);
  };
  useEffect(() => {
    if (location.state?.cCode) {
      setCodeVillage(location.state.cCode);
      setTextForVillage(location.state.villageName);
      getTableData(location.state.cCode);
    }
  }, [location.state]);

  const getTableData = async (cCodeParam) => {
    const cCodeToUse = cCodeParam || codeVillage;
    console.log(
      'Fetching with cCode:',
      cCodeToUse,
      'district:',
      districtCode,
      'taluka:',
      talukaCode,
    );
    sendRequest(
      `${URLS.BaseURL}/form1Dyslr/getForm1AbstractReportDyslr?districtCode=${districtCode}&talukaCode=${talukaCode}&cCode=${cCodeToUse}`,
      'GET',
      null,
      (res) => {
        setTenureArea(res.data.tenure1Area);
        setTenureAssessment(res.data.tenure1Assessment);
        setTenure2Area(res.data.tenure2Area);
        setTenure2Assessment(res.data.tenure2Assessment);
        setTenure3Area(res.data.tenure3Area);
        setTenure3Assessment(res.data.tenure3Assessment);
        setTenure4Area(res.data.tenure4Area);
        setTenure4Assessment(res.data.tenure4Assessment);
        setSpecialAgreement(res.data.revenueOrLeaseholdLandUnderSpecialAgreement);
        setDumalaLandArea(res.data.form3NetCultiArea);
        setDumalaLandAssessment(res.data.form3Assessment);
        setForestArea(res.data.forest);
        setKuranArea(res.data.kuran);
        setCattleLandArea(res.data.freePastureCattleStand);
        setVillageSiteArea(res.data.villageSite);
        setTankArea(res.data.tank);
        setBurialGroundArea(res.data.burialGround);
        setRailwayArea(res.data.railways);
        setRoadWaterCourseArea(res.data.potKharabAssignedRoadsWaterCourses);
        setRoadAndPathsArea(res.data.roadsAndPath);
        setPipeLineArea(res.data.pipeLineCanel);
        setContonmentArea(res.data.cantonmentLandMilitaryCamp);
        setSchoolArea(res.data.schools);
        setDharmashalasArea(res.data.dharmshalas);
        setSrNoForNonAgricultureUseArea(res.data.srNoForNonAgricultureUse);
        setAssignedForSpecialUseArea(res.data.assignedForSpecialUse);
        setPotKharabaArea(res.data.potKharabArea);
        setPotKharabaAssessment(res.data.potKharabAssessment);
        setRiversArea(res.data.riversNalas);
        setNalasArea(res.data.nalas);
        setUnOccupied(res.data.unOccupied);
        message.success('Data Fetched Successfully !');
      },
    );

    // sendRequest(
    //   `${
    //     URLS.BaseURL
    //   }/form1Dyslr/getDyslrForm1ReportFooter?cCode=${cCodeToUse}&districtCode=${districtCode}&talukaCode=${talukaCode}${
    //     revenueYear ? `&revenueYear=${revenueYear}` : ''
    //   }`,
    //   'GET',
    //   null,
    //   (res) => {
    //     const footerData = res.data?.[0];
    //     if (footerData) {
    //       setFooterVillageSite(parseFloat(footerData.villageSite) || 0);
    //       setFooterRiversNalas(parseFloat(footerData.riversNalas) || 0);
    //       setFooterNalas(parseFloat(footerData.nalas) || 0);
    //       setFooterRoadsAndPath(parseFloat(footerData.roadsAndPath) || 0);
    //     }
    //   },
    // );
  };

  const changeLang = () => {
    getlang('M');
  };

  return (
    <div>
      <Card>
        <h1 style={{ textAlign: 'center' }}>
          <FormattedMessage id="form1abstract.heading" /> (DYSLR)
        </h1>
        <div style={{ padding: 10 }}>
          <Button type="primary" onClick={handlePrint}>
            <FormattedMessage id="villageReport1.button.print" />
          </Button>
          <Button style={{ float: 'right' }} onClick={backToHomeButton} type="primary">
            <FormattedMessage id="villageReport1.button.home" />
          </Button>
        </div>
        <VillageSelector
          pageType={'withoutYear'}
          setCodeVillage={setCodeVillage}
          setTextForVillage={setTextForVillage}
          onVillageChange={setVillage}
          yearChange={setRevenueYear}
          setIsNirank={setIsNirank}
        />

        <Button
          loading={loadings[0]}
          onClick={async () => {
            if (textForVillage) {
              getTableData();
              enterLoading(0);
            } else if (textForVillage == null) {
              message.info('Please Select Village');
            }
          }}
          type="primary"
        >
          <FormattedMessage id="villageReport1.button.getData" />
        </Button>
      </Card>

      <ComponentToPrint
        ref={componentRef}
        village={textForVillage}
        taluka={talukaName}
        district={districtName}
        tenureArea={tenureArea === 0 ? '' : tenureArea}
        tenureAssessment={tenureAssessment === 0 ? '' : tenureAssessment}
        tenure2Area={tenure2Area === 0 ? '' : tenure2Area}
        tenure2Assessment={tenure2Assessment === 0 ? '' : tenure2Assessment}
        tenure3Area={tenure3Area === 0 ? '' : tenure3Area}
        tenure3Assessment={tenure3Assessment === 0 ? '' : tenure3Assessment}
        tenure4Area={tenure4Area === 0 ? '' : tenure4Area}
        tenure4Assessment={tenure4Assessment === 0 ? '' : tenure4Assessment}
        specialAgreement={specialAgreement === 0 ? '' : specialAgreement}
        dumalaLandArea={dumalaLandArea === 0 ? '' : dumalaLandArea}
        dumalaLandAssessment={dumalaLandAssessment === 0 ? '' : dumalaLandAssessment}
        forestArea={forestArea === 0 ? '' : forestArea}
        kuranArea={kuranArea === 0 ? '' : kuranArea}
        cattleLandArea={cattleLandArea === 0 ? '' : cattleLandArea}
        villageSiteArea={villageSiteArea === 0 ? '' : villageSiteArea}
        tankArea={tankArea === 0 ? '' : tankArea}
        burialGroundArea={burialGroundArea === 0 ? '' : burialGroundArea}
        railwayArea={railwayArea === 0 ? '' : railwayArea}
        roadWaterCourseArea={roadWaterCourseArea === 0 ? '' : roadWaterCourseArea}
        roadAndPathsArea={roadAndPathsArea === 0 ? '' : roadAndPathsArea}
        pipeLineArea={pipeLineArea === 0 ? '' : pipeLineArea}
        contonmentArea={contonmentArea === 0 ? '' : contonmentArea}
        schoolArea={schoolArea === 0 ? '' : schoolArea}
        dharmashalasArea={dharmashalasArea === 0 ? '' : dharmashalasArea}
        srNoForNonAgricultureUseArea={
          srNoForNonAgricultureUseArea === 0 ? '' : srNoForNonAgricultureUseArea
        }
        assignedForSpecialUseArea={assignedForSpecialUseArea === 0 ? '' : assignedForSpecialUseArea}
        potKharabaArea={potKharabaArea === 0 ? '' : potKharabaArea}
        potKharabaAssessment={potKharabaAssessment === 0 ? '' : potKharabaAssessment}
        riversArea={riversArea === 0 ? '' : riversArea}
        nalasArea={nalasArea === 0 ? '' : nalasArea}
        totalOfA1={
          tenureArea +
            tenure2Area +
            tenure3Area +
            tenure4Area +
            specialAgreement +
            dumalaLandArea ===
          0
            ? ''
            : Math.round(
                (tenureArea +
                  tenure2Area +
                  tenure3Area +
                  tenure4Area +
                  specialAgreement +
                  dumalaLandArea +
                  Number.EPSILON) *
                  100,
              ) / 100
        }
        totalOfA1Assessment={
          tenureAssessment +
            tenure2Assessment +
            tenure3Assessment +
            tenure4Assessment +
            dumalaLandAssessment ===
          0
            ? ''
            : Math.round(
                (tenureAssessment +
                  tenure2Assessment +
                  tenure3Assessment +
                  tenure4Assessment +
                  dumalaLandAssessment +
                  Number.EPSILON) *
                  100,
              ) / 100
        }
        totalOfA2={
          unOccupied + assignedForSpecialUseArea === 0
            ? ''
            : Math.round((unOccupied + assignedForSpecialUseArea + Number.EPSILON) * 100) / 100
        }
        totalOfA2Assesment={
          tenure4Assessment === 0
            ? ''
            : Math.round((tenure4Assessment + Number.EPSILON) * 100) / 100
        }
        totalOfB1={
          potKharabaArea + riversArea + nalasArea === 0
            ? ''
            : Math.round((potKharabaArea + riversArea + nalasArea + Number.EPSILON) * 100) / 100
        }
        totalOfB1Assessment={potKharabaAssessment === 0 ? '' : potKharabaAssessment}
        totalOfB2={
          forestArea +
            kuranArea +
            cattleLandArea +
            villageSiteArea +
            tankArea +
            burialGroundArea +
            railwayArea +
            roadWaterCourseArea +
            roadAndPathsArea +
            pipeLineArea +
            contonmentArea +
            schoolArea +
            dharmashalasArea ===
          0
            ? ''
            : Math.round(
                (forestArea +
                  kuranArea +
                  cattleLandArea +
                  villageSiteArea +
                  tankArea +
                  burialGroundArea +
                  railwayArea +
                  roadWaterCourseArea +
                  roadAndPathsArea +
                  pipeLineArea +
                  contonmentArea +
                  schoolArea +
                  dharmashalasArea +
                  Number.EPSILON) *
                  100,
              ) / 100
        }
        totalOfB3={srNoForNonAgricultureUseArea === 0 ? '' : srNoForNonAgricultureUseArea}
        unOccupied={unOccupied}
        mp={mp}
        footerVillageSite={footerVillageSite}
        footerRiversNalas={footerRiversNalas}
        footerNalas={footerNalas}
        footerRoadsAndPath={footerRoadsAndPath}
      />
    </div>
  );
}
class ComponentToPrint extends React.Component {
  render() {
    const formatSum = (...values) => {
      const total = values.reduce((acc, val) => acc + (parseFloat(val) || 0), 0);
      return total === 0 ? '' : total.toFixed(2);
    };

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
                  <th colSpan={5}>
                    <h2 style={{ color: 'red' }}>
                      <b>
                        <FormattedMessage id="form1abstract.heading" /> (DYSLR)
                      </b>
                    </h2>
                  </th>
                </tr>
                <tr>
                  <th colSpan="5">
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
                  <td></td>
                  <td>
                    <b>
                      <FormattedMessage id="form1abstract.area" />
                      <br />
                      (हे.आर.चौमी)
                    </b>
                  </td>
                  <td>
                    <b>
                      <FormattedMessage id="form1abstract.assessment" />
                      <br />
                      (रु.पैसे)
                    </b>
                  </td>
                  <td>
                    <b>
                      <FormattedMessage id="form1abstract.remarks" />
                    </b>
                  </td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <b>
                      <u>
                        <FormattedMessage id="form1abstract.A.landForCultivation" />
                      </u>
                    </b>
                    <br />
                    <b>
                      <u>
                        <FormattedMessage id="form1abstract.assessed" />
                      </u>
                    </b>
                    <br />
                    <FormattedMessage id="form1abstract.occupied(unalienated)" />
                    <br />
                    <FormattedMessage id="form1abstract.(I)" />{' '}
                    <FormattedMessage id="form1abstract.OccupantsClass I" />
                  </td>
                  <td>{this.props.tenureArea}</td>
                  <td>{this.props.tenureAssessment}</td>
                  <td></td>
                </tr>
                <tr>
                  <td>
                    {' '}
                    <FormattedMessage id="form1abstract.(II)" />{' '}
                    <FormattedMessage id="form1abstract.OccupantsClass II" />
                  </td>
                  <td>{this.props.tenure2Area}</td>
                  <td>{this.props.tenure2Assessment}</td>
                  <td>{}</td>
                </tr>
                <tr>
                  <td>
                    {' '}
                    <FormattedMessage id="form1abstract.(III)" />{' '}
                    <FormattedMessage id="form1abstract.Goverment.Lessees" />
                  </td>
                  <td>{this.props.tenure4Area}</td>
                  <td>{this.props.tenure4Assessment}</td>
                  <td>{}</td>
                </tr>
                <tr>
                  <td>
                    {' '}
                    <FormattedMessage id="form1abstract.(b)" />{' '}
                    <FormattedMessage id="form1abstract.govtLand" />
                  </td>
                  <td>{this.props.tenure3Area}</td>
                  <td>{this.props.tenure3Assessment}</td>

                  <td>{}</td>
                </tr>
                <tr>
                  <td>
                    {' '}
                    <FormattedMessage id="form1abstract.(c)" />{' '}
                    <FormattedMessage id="form1abstract.CessFree" />
                  </td>
                  <td>{this.props.specialAgreement}</td>
                  <td>{}</td>
                  <td>{}</td>
                </tr>
                <tr>
                  <td>
                    {' '}
                    <FormattedMessage id="form1abstract.(d)" />{' '}
                    <FormattedMessage id="form1abstract.Alienated" />
                  </td>
                  <td>{this.props.dumalaLandArea}</td>
                  <td>{this.props.dumalaLandAssessment}</td>
                  <td>{}</td>
                </tr>
                <tr>
                  <td>
                    <b>
                      <u style={{ float: 'right' }}>
                        <FormattedMessage id="form1abstract.total1A" />{' '}
                      </u>
                    </b>
                  </td>
                  <td>{this.props.totalOfA1}</td>
                  <td>{this.props.totalOfA1Assessment}</td>
                  <td></td>
                </tr>
                <tr>
                  <td>
                    <b>
                      <u>
                        <FormattedMessage id="form1abstract.Unassessed" />{' '}
                      </u>
                    </b>
                    <br />
                    <FormattedMessage id="form1abstract.Unoccupied" />
                  </td>
                  <td>
                    {parseFloat(this.props.unOccupied) == '0.00' ? '' : this.props.unOccupied}
                  </td>
                  <td>{parseFloat(this.props.unOccupied) == '0.00' ? '' : 0}</td>
                  <td>{}</td>
                </tr>
                <tr>
                  <td>
                    <FormattedMessage id="form1abstract.(b)" />{' '}
                    <FormattedMessage id="form1abstract.AssignedForSpecialuse" />
                  </td>
                  <td>{this.props.assignedForSpecialUseArea}</td>
                  <td>{}</td>
                  <td>{}</td>
                </tr>
                <tr>
                  <td>
                    <b>
                      <u style={{ float: 'right' }}>
                        <FormattedMessage id="form1abstract.total2A" />
                      </u>
                    </b>
                  </td>
                  <td>{this.props.totalOfA2}</td>
                  <td>{this.props.totalOfA2Assesment}</td>
                  <td></td>
                </tr>
                <tr>
                  <td>
                    <b>
                      <u style={{ float: 'right' }}>
                        <FormattedMessage id="form1abstract.dyslr.totalA" />
                      </u>
                    </b>
                  </td>
                  {/* <td>{this.props.totalOfA1 + this.props.totalOfA2}</td>
                  <td>{this.props.totalOfA1Assessment + this.props.totalOfA2Assesment}</td> */}
                  <td>{formatSum(this.props.totalOfA1, this.props.totalOfA2)}</td>
                  <td>
                    {formatSum(this.props.totalOfA1Assessment, this.props.totalOfA2Assesment)}
                  </td>
                  <td></td>
                </tr>
                <tr>
                  <td>
                    <b>
                      <u>
                        <FormattedMessage id="form1abstract.B.landNotForCultivation" />
                      </u>
                    </b>
                    <br />
                    <b>
                      <u>
                        <FormattedMessage id="form1abstract.(I)" />{' '}
                        <FormattedMessage id="form1abstract.nonCultivalble" />
                      </u>
                    </b>
                    <br />
                    <FormattedMessage id="form1abstract.(a)" />{' '}
                    <FormattedMessage id="form1abstract.potkharab" />
                  </td>
                  <td>{this.props.potKharabaArea}</td>
                  <td>{this.props.potKharabaAssessment}</td>
                  <td>{}</td>
                </tr>
                <tr>
                  <td>
                    <FormattedMessage id="form1abstract.(b)" />
                    <FormattedMessage id="form1abstract.rivers" /> व{' '}
                    <FormattedMessage id="form1abstract.Nallas" />
                  </td>
                  {/* <td>{this.props.riversArea + this.props.nalasArea}</td> */}
                  <td>{formatSum(this.props.riversArea, this.props.nalasArea)}</td>
                  <td>{}</td>
                  <td>{}</td>
                </tr>

                <tr>
                  <td>
                    <b>
                      <u style={{ float: 'right' }}>
                        <FormattedMessage id="form1abstract.total1B" />
                      </u>
                    </b>
                  </td>
                  <td>{this.props.totalOfB1}</td>
                  <td>{this.props.totalOfB1Assessment}</td>
                  <td></td>
                </tr>
                <tr>
                  <td>
                    <b>
                      <u>
                        <FormattedMessage id="form1abstract.Assignedforpublic" />
                      </u>
                    </b>
                    <br />
                    <FormattedMessage id="form1abstract.(aENG)" />{' '}
                    <FormattedMessage id="form1abstract.Forest" />
                  </td>
                  <td>{this.props.forestArea}</td>
                  <td>{}</td>
                  <td>{}</td>
                </tr>
                <tr>
                  <td>
                    <FormattedMessage id="form1abstract.(bENG)" />{' '}
                    <FormattedMessage id="form1abstract.Kuran" />
                  </td>
                  <td>{this.props.kuranArea}</td>
                  <td>{}</td>
                  <td>{}</td>
                </tr>
                <tr>
                  <td>
                    <FormattedMessage id="form1abstract.(cENG)" />{' '}
                    <FormattedMessage id="form1abstract.pastureCattle" />
                  </td>
                  <td>{this.props.cattleLandArea}</td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td>
                    <FormattedMessage id="form1abstract.(dENG)" />{' '}
                    <FormattedMessage id="form1abstract.VillageSite" />
                  </td>
                  <td>{this.props.villageSiteArea}</td>
                  <td>{}</td>
                  <td>{}</td>
                </tr>
                <tr>
                  <td>
                    <FormattedMessage id="form1abstract.(eENG)" />{' '}
                    <FormattedMessage id="form1abstract.Tank" />
                  </td>
                  <td>{this.props.tankArea}</td>
                  <td>{}</td>
                  <td>{}</td>
                </tr>
                <tr>
                  <td>
                    <FormattedMessage id="form1abstract.(fENG)" />{' '}
                    <FormattedMessage id="form1abstract.burialGround" />
                  </td>
                  <td>{this.props.burialGroundArea}</td>
                  <td>{}</td>
                  <td>{}</td>
                </tr>
                <tr>
                  <td>
                    <FormattedMessage id="form1abstract.(gENG)" />{' '}
                    <FormattedMessage id="form1abstract.railways" />
                  </td>
                  <td>{this.props.railwayArea}</td>
                  <td>{}</td>
                  <td>{}</td>
                </tr>
                <tr>
                  <td>
                    <FormattedMessage id="form1abstract.(hENG)" />{' '}
                    <FormattedMessage id="form1abstract.PotKharabAssigned" />
                  </td>
                  <td>{this.props.roadWaterCourseArea}</td>
                  <td>{}</td>
                  <td>{}</td>
                </tr>
                <tr>
                  <td>
                    <FormattedMessage id="form1abstract.(ie)" />{' '}
                    <FormattedMessage id="form1abstract.RoadsPaths" />
                  </td>
                  <td>{this.props.roadAndPathsArea}</td>
                  <td>{}</td>
                  <td>{}</td>
                </tr>
                <tr>
                  <td>
                    <FormattedMessage id="form1abstract.(j)" />{' '}
                    <FormattedMessage id="form1abstract.pipeLines" />
                  </td>
                  <td>{this.props.pipeLineArea}</td>
                  <td>{}</td>
                  <td>{}</td>
                </tr>

                <tr>
                  <td>
                    <FormattedMessage id="form1abstract.(k)" />{' '}
                    <FormattedMessage id="form1abstract.Cantonment" />
                  </td>
                  <td>{this.props.contonmentArea}</td>
                  <td>{}</td>
                  <td>{}</td>
                </tr>
                <tr>
                  <td>
                    <FormattedMessage id="form1abstract.(l)" />{' '}
                    <FormattedMessage id="form1abstract.School" />
                  </td>
                  <td>{this.props.schoolArea}</td>
                  <td>{}</td>
                  <td>{}</td>
                </tr>
                <tr>
                  <td>
                    <FormattedMessage id="form1abstract.(m)" />{' '}
                    <FormattedMessage id="form1abstract.Dharmashalas" />
                  </td>
                  <td>{this.props.dharmashalasArea}</td>
                  <td>{}</td>
                  <td>{}</td>
                </tr>
                <tr>
                  <td>
                    <b>
                      <u style={{ float: 'right' }}>
                        <FormattedMessage id="form1abstract.total2B" />
                      </u>
                    </b>
                  </td>
                  <td>{this.props.totalOfB2}</td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td>
                    <b>
                      <u>
                        <FormattedMessage id="form1abstract.leasedorGranted" />
                      </u>
                    </b>
                    <br />
                    <FormattedMessage id="form1abstract.leasedorGranted2" />
                  </td>
                  <td>{this.props.srNoForNonAgricultureUseArea}</td>
                  <td>{}</td>
                  <td>{}</td>
                </tr>
                <tr>
                  <td>
                    <b>
                      <u style={{ float: 'right' }}>
                        <FormattedMessage id="form1abstract.total3B" />
                      </u>
                    </b>
                  </td>
                  <td>{this.props.totalOfB3}</td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td>
                    <b>
                      <u style={{ float: 'right' }}>
                        <FormattedMessage id="form1abstract.dyslr.totalB" />
                      </u>
                    </b>
                  </td>
                  <td>
                    {/* {this.props.totalOfB1 + this.props.totalOfB2 + this.props.totalOfB3 === ''
                      ? '0'
                      : parseFloat(
                          this.props.totalOfB1 + this.props.totalOfB2 + this.props.totalOfB3,
                        )} */}
                    {formatSum(this.props.totalOfB1, this.props.totalOfB2, this.props.totalOfB3)}
                  </td>
                  <td>{this.props.totalOfB1Assessment}</td>
                  <td></td>
                </tr>

                {/* --- NEW SECTION 4 STARTS HERE --- */}
                {/* <tr>
                  <td colSpan={4}>
                    <b>
                      <u>
                        <FormattedMessage id="form1abstract.section4.heading" />
                      </u>
                    </b>
                  </td>
                </tr> */}
                {/* <tr>
                  <td style={{ paddingLeft: '20px' }}>
                    <FormattedMessage id="form1abstract.(a)" />{' '}
                    <FormattedMessage id="form1abstract.section4.gaothan" />
                  </td>
                  <td>{this.props.footerVillageSite}</td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td style={{ paddingLeft: '20px' }}>
                    <FormattedMessage id="form1abstract.(b)" />{' '}
                    <FormattedMessage id="form1abstract.section4.nadi" />
                  </td>
                  <td>{this.props.footerRiversNalas}</td>
                  <td></td>
                  <td></td>
                </tr> */}
                {/* <tr>
                  <td style={{ paddingLeft: '20px' }}>
                    <FormattedMessage id="form1abstract.(c)" />{' '}
                    <FormattedMessage id="form1abstract.section4.nale" />
                  </td>
                  <td>{this.props.footerNalas}</td>
                  <td></td>
                  <td></td>
                </tr> */}
                {/* <tr>
                  <td style={{ paddingLeft: '20px' }}>
                    <FormattedMessage id="form1abstract.(d)" />{' '}
                    <FormattedMessage id="form1abstract.section4.raste" />
                  </td>
                  <td>{this.props.footerRoadsAndPath}</td>
                  <td></td>
                  <td></td>
                </tr> */}
                {/* <tr>
                  <td style={{ paddingLeft: '20px' }}>
                    <b>
                      <FormattedMessage id="form1abstract.section4.bhumapanTotal" />
                    </b>
                  </td>
                  <td>
                    {formatSum(
                    this.props.footerVillageSite,
                    this.props.footerRiversNalas,
                    this.props.footerNalas,
                    this.props.footerRoadsAndPath
                    )}
                  </td>
                  <td></td>
                  <td></td>
                </tr> */}
                {/* <tr>
                  <td style={{ paddingLeft: '20px' }}>
                    <b>
                      <FormattedMessage id="form1abstract.section4.outsideGaothanTotal" />
                    </b>
                  </td>
                  <td>
                    {formatSum(
                      this.props.footerRiversNalas,
                      this.props.footerNalas,
                      this.props.footerRoadsAndPath
                    )}
                  </td>
                  <td></td>
                  <td></td>
                </tr> */}
                {/* <tr>
                  <td style={{ paddingLeft: '20px' }}>
                    <b>
                      <FormattedMessage id="form1abstract.section4.gaothanTotal" />
                    </b>
                  </td>
                  <td>{this.props.footerVillageSite}</td>
                  <td></td>
                  <td></td>
                </tr> */}
                {/* --- NEW SECTION 4 ENDS HERE --- */}

                <tr>
                  <td>
                    <b>
                      <u style={{ float: 'right' }}>
                        <FormattedMessage id="form1abstract.dyslr.villageTotal" />
                      </u>
                    </b>
                  </td>
                  <td>
                    {/* {this.props.totalOfA1 +
                      this.props.totalOfA2 +
                      this.props.totalOfB1 +
                      this.props.totalOfB2 +
                      this.props.totalOfB3 ===
                    ''
                      ? '0'
                      : parseFloat(this.props.totalOfA1 + this.props.totalOfA2) +
                        parseFloat(
                          this.props.totalOfB1 + this.props.totalOfB2 + this.props.totalOfB3,
                        )} */}
                    {formatSum(
                      this.props.totalOfA1,
                      this.props.totalOfA2,
                      this.props.totalOfB1,
                      this.props.totalOfB2,
                      this.props.totalOfB3,
                    )}
                  </td>
                  <td>
                    {/* {parseFloat(
                      this.props.totalOfA1Assessment == '' ? 0 : this.props.totalOfA1Assessment,
                    ) +
                      parseFloat(
                        this.props.totalOfA2Assesment == '' ? 0 : this.props.totalOfA2Assesment,
                      ) +
                      parseFloat(
                        this.props.totalOfB1Assessment == '' ? 0 : this.props.totalOfB1Assessment,
                      ) ==
                    '0'
                      ? ''
                      : Math.round(
                          (parseFloat(
                            this.props.totalOfA1Assessment == ''
                              ? 0
                              : this.props.totalOfA1Assessment,
                          ) +
                            parseFloat(
                              this.props.totalOfA2Assesment == ''
                                ? 0
                                : this.props.totalOfA2Assesment,
                            ) +
                            parseFloat(
                              this.props.totalOfB1Assessment == ''
                                ? 0
                                : this.props.totalOfB1Assessment,
                            ) +
                            Number.EPSILON) *
                            100,
                        ) / 100} */}
                    {formatSum(
                      this.props.totalOfA1Assessment,
                      this.props.totalOfA2Assesment,
                      this.props.totalOfB1Assessment,
                    )}
                  </td>
                  <td></td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="5">
                    <Row>
                      <Col span={7}>{/* <FormattedMessage id="form1abstract.Date" /> */}</Col>
                      <Col span={1}></Col>
                      <Col span={7}> {/* <FormattedMessage id="form1abstract.Date2" /> */}</Col>
                      <Col span={1}></Col>
                      <Col span={7}>
                        <FormattedMessage id="form1abstract.ExaminedDate" />
                      </Col>
                    </Row>
                    <Row style={{ marginTop: 30 }}>
                      <Col span={7}>
                        {/* <FormattedMessage id="form1abstract.Talathi" />, {this.props.village} */}
                      </Col>
                      <Col span={1}></Col>
                      <Col span={7}>
                        {/* <FormattedMessage id="form1abstract.clerk" />,{' '} */}
                      </Col>
                      <Col span={1}></Col>
                      <Col span={7}>
                        <FormattedMessage id="form1abstract.tahsildar" />,{' '}
                      </Col>
                    </Row>
                    <Row>
                      <Col span={7}>
                        {/* <FormattedMessage id="form1abstract.TalukaName" />: {this.props.taluka}{' '}
                        <FormattedMessage id="form1abstract.District" />: {this.props.district} */}
                      </Col>
                      <Col span={1}></Col>
                      <Col span={7}>
                        {/* <FormattedMessage id="form1abstract.TalukaName" />: {this.props.taluka}{' '}
                        <FormattedMessage id="form1abstract.District" />: {this.props.district} */}
                      </Col>
                      <Col span={1}></Col>
                      <Col span={7}>
                        <FormattedMessage id="form1abstract.TalukaName" />: {this.props.taluka}{' '}
                        <FormattedMessage id="form1abstract.District" />: {this.props.district}
                      </Col>
                    </Row>
                  </td>
                </tr>
              </tfoot>
            </table>
          </Card>
        </div>
      </div>
    );
  }
}

export default DyslrForm1AbstractReport;
