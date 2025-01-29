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
import landType from './landType';
import ReactHtmlTableToExcel from 'react-html-table-to-excel';
function Report() {
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

  const getTableData = async () => {
    sendRequest(
      `${URLS.BaseURL}/form1Abstract/getForm1AbstractReport?districtCode=${districtCode}&talukaCode=${talukaCode}&cCode=${codeVillage}`,
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
        // setRiversArea(res.data.riverAreaH);
        setRiversArea(res.data.riversNalas);
        // setNalasArea(res.data.nalaAreaH);
        setNalasArea(res.data.nalas);
        setUnOccupied(res.data.unOccupied);
        //revenueOrLeaseholdLandUnderSpecialAgreement
        // for (let index = 0; index < res.data.form1AbstractData.length; index++) {
        //   setMp((iniMp) => {
        //     iniMp.set(res.data.form1AbstractData[index].landType, {
        //       tenure1Area: res.data.form1AbstractData[index].tenure1Area,
        //       assessment: res.data.form1AbstractData[index].assessment,
        //       areaUnit: res.data.form1AbstractData[index].areaUnit,
        //       remarks: res.data.form1AbstractData[index].remarks,
        //     });
        //     console.log('iniMpiniMp', iniMp);
        //     console.log('iniMpiniMp get 1', iniMp.get(1));
        //     return iniMp;
        //   });
        // }

        // message.success('Records Fetched!!');
      },
    );
  };
  const changeLang = () => {
    getlang('M');
  };
  return (
    <div>
      <Card>
        <h1 style={{ textAlign: 'center' }}>
          <FormattedMessage id="form1abstract.heading" />
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
              //  getTableData();
            } else if (textForVillage == null) {
              message.info('Please Select Village');
            }
          }}
          type="primary"
        >
          <FormattedMessage id="villageReport1.button.getData" />
        </Button>
        {/* </Row> */}
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
      />
    </div>
  );
}
class ComponentToPrint extends React.Component {
  render() {
    return (
      // console.log('ye ki re bhava', this.props.values),
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
            {/* <table className={styles.upper_table}>
              <thead>
                <tr>
                  <th colSpan={9}>
                    <h2 style={{ color: 'red' }}>
                      <Row>
                        <Col span={10}>गाव नमुना एक (भाग अ)</Col>
                        <Col span={4}></Col>
                        <Col span={10}> आकारबंद</Col>
                      </Row>
                      <FormattedMessage id="form1abstract.VillageName" /> :{this.props.village}{' '}
                      <FormattedMessage id="form1abstract.TalukaName" />: {this.props.taluka}{' '}
                      <FormattedMessage id="form1abstract.District" />: {this.props.district}
                    </h2>
                  </th>
                </tr>
                <tr>
                  <th colSpan={9}>
                    <Row style={{ textAlign: 'left' }}>
                      <Col span={10}>हेक्टरी प्रमाण दर ..... रु. पै.</Col>
                      <Col span={4}></Col>
                      <Col span={10}>अ) जमाबंदी सुरू केल्याचे वर्ष :</Col>
                    </Row>
                    <Row style={{ textAlign: 'left' }}>
                      <Col span={10}>कोरडवाहू .....</Col>
                      <Col span={4}></Col>
                      <Col span={10}>ब) जमाबंदी मुदत संपल्याचे वर्ष :</Col>
                    </Row>
                    <Row style={{ textAlign: 'left' }}>
                      <Col span={10}>बागायत .....</Col>
                      <Col span={4}></Col>
                      <Col span={10}>क) सर्वेक्षण गट :</Col>
                    </Row>
                    <Row style={{ textAlign: 'left' }}>
                      <Col span={10}>भात .....</Col>
                      <Col span={4}></Col>
                      <Col span={10}> ड) गाव- खरीप किंवा रब्बी</Col>
                    </Row>
                    <Row style={{ textAlign: 'left' }}>
                      <Col span={10}>वरकस किंवा इतर .....</Col>
                      <Col span={4}></Col>
                      <Col span={10}></Col>
                    </Row>
                  </th>
                </tr>
                <tr>
                  <th style={{ color: 'red' }} colSpan={9}>
                    कृषिक जमिनींविषयक माहिती
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th style={{ writingMode: 'vertical-lr' }}>भूमापन क्रमांक</th>
                  <th style={{ writingMode: 'vertical-lr' }}>धारणा प्रकार</th>
                  <th style={{ writingMode: 'vertical-lr' }}>एकूण कृषिक क्षेत्र (हे.आर)</th>
                  <th style={{ writingMode: 'vertical-lr' }}>पोट खराब 'अ' क्षेत्र (हे.आर)</th>
                  <th style={{ writingMode: 'vertical-lr' }}>पोट खराब 'ब' क्षेत्र (हे.आर)</th>
                  <th style={{ writingMode: 'vertical-lr' }}>कृषिक आकारणी (रू. पै.)</th>
                  <th style={{ writingMode: 'vertical-lr' }}>
                    सुविधाधिकार (हे.आर) <br />
                    सार्वजनिक मार्गाधिकार आणि
                  </th>
                  <th colSpan={2} style={{ writingMode: 'vertical-lr', width: '' }}>
                    शेरा
                  </th>
                </tr>
                <tr>
                  <td>१</td>
                  <td>२</td>
                  <td>३</td>
                  <td>४-अ</td>
                  <td>४-ब</td>
                  <td>५</td>
                  <td>६</td>
                  <td colSpan={2}>७</td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td colSpan={2}></td>
                </tr>
                <tr>
                  <td style={{ color: 'red', textAlign: 'center' }} colSpan={9}>
                    <b>शासकीय अकृषिक जमिनींविषयक माहिती</b>
                  </td>
                </tr>
                <tr>
                  <th style={{ writingMode: 'vertical-lr' }}>भूमापन क्रमांक</th>
                  <th style={{ writingMode: 'vertical-lr' }}>धारणा प्रकार</th>
                  <th style={{ writingMode: 'vertical-lr' }}>निवासी प्रयोजन (चौ.मी.)</th>
                  <th style={{ writingMode: 'vertical-lr' }}>औद्योगिक प्रयोजन (चौ.मी.)</th>
                  <th style={{ writingMode: 'vertical-lr' }}>वाणिज्यिक प्रयोजन (चौ.मी.)</th>
                  <th style={{ writingMode: 'vertical-lr' }}>अन्य प्रयोजन (चौ.मी.)</th>
                  <th style={{ writingMode: 'vertical-lr' }}>अकृषिक आकारणी (रू.पै.)</th>
                  <th style={{ writingMode: 'vertical-lr' }}>
                    आदेश क्र. व दिनांक <br /> प्रयोजन बदलाचा तपशील
                  </th>
                  <th style={{ writingMode: 'vertical-lr' }}>शेरा</th>
                </tr>
                <tr>
                  <td>१</td>
                  <td>२</td>
                  <td>३</td>
                  <td>४</td>
                  <td>५</td>
                  <td>६</td>
                  <td>७</td>
                  <td>८</td>
                  <td>९</td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td colSpan={4}></td>
                </tr>
                <tr>
                  <td style={{ color: 'red', textAlign: 'center' }} colSpan={9}>
                    <b>खाजगी अकृषिक जमिनींविषयक माहिती</b>
                  </td>
                </tr>
                <tr>
                  <th style={{ writingMode: 'vertical-lr' }}>भूमापन क्रमांक</th>
                  <th style={{ writingMode: 'vertical-lr' }}>धारणा प्रकार</th>
                  <th style={{ writingMode: 'vertical-lr' }}>निवासी प्रयोजन (चौ.मी.)</th>
                  <th style={{ writingMode: 'vertical-lr' }}>औद्योगिक प्रयोजन (चौ.मी.)</th>
                  <th style={{ writingMode: 'vertical-lr' }}>वाणिज्यिक प्रयोजन(चौ.मी.)</th>
                  <th style={{ writingMode: 'vertical-lr' }}>अन्य प्रयोजन (चौ.मी.)</th>
                  <th style={{ writingMode: 'vertical-lr' }}>अकृषिक आकारणी (रू.पै.)</th>
                  <th style={{ writingMode: 'vertical-lr' }}>
                    आदेश क्र. व दिनांक <br /> प्रयोजन बदलाचा तपशील
                  </th>
                  <th style={{ writingMode: 'vertical-lr' }}>शेरा</th>
                </tr>
                <tr>
                  <td>१</td>
                  <td>२</td>
                  <td>३</td>
                  <td>४</td>
                  <td>५</td>
                  <td>६</td>
                  <td>७</td>
                  <td>८</td>
                  <td>९</td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td colSpan={4}></td>
                </tr>
              </tbody>
              <tfoot></tfoot>
            </table> */}
            <table id="table-to-xls" className={styles.report_table}>
              <thead>
                <tr>
                  <th colSpan={5}>
                    <h2 style={{ color: 'red' }}>
                      <b>
                        <FormattedMessage id="form1abstract.heading" />
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
                        <FormattedMessage id="form1abstract.total1+2A" />
                      </u>
                    </b>
                  </td>
                  <td>{this.props.totalOfA1 + this.props.totalOfA2}</td>
                  <td>{this.props.totalOfA1Assessment + this.props.totalOfA2Assesment}</td>
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
                  <td>{this.props.riversArea + this.props.nalasArea}</td>
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
                        <FormattedMessage id="form1abstract.total4B" />
                      </u>
                    </b>
                  </td>
                  <td>
                    {this.props.totalOfB1 + this.props.totalOfB2 + this.props.totalOfB3 === ''
                      ? '0'
                      : parseFloat(
                          this.props.totalOfB1 + this.props.totalOfB2 + this.props.totalOfB3,
                        )}
                  </td>
                  <td>{this.props.totalOfB1Assessment}</td>
                  <td></td>
                </tr>

                <tr>
                  <td>
                    <b>
                      <u style={{ float: 'right' }}>
                        <FormattedMessage id="form1abstract.village.Total" />
                      </u>
                    </b>
                  </td>
                  <td>
                    {this.props.totalOfA1 +
                      this.props.totalOfA2 +
                      this.props.totalOfB1 +
                      this.props.totalOfB2 +
                      this.props.totalOfB3 ===
                    ''
                      ? '0'
                      : parseFloat(this.props.totalOfA1 + this.props.totalOfA2) +
                        parseFloat(
                          this.props.totalOfB1 + this.props.totalOfB2 + this.props.totalOfB3,
                        )}
                    {/* {this.props.totalOfB1 +
                          this.props.totalOfB2 +
                          this.props.totalOfB3 } */}
                  </td>
                  <td>
                    {parseFloat(
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
                        ) / 100}
                  </td>
                  <td></td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="5">
                    <Row>
                      <Col span={7}>
                        <FormattedMessage id="form1abstract.Date" />
                      </Col>
                      <Col span={1}></Col>
                      <Col span={7}>
                        {' '}
                        <FormattedMessage id="form1abstract.Date2" />
                      </Col>
                      <Col span={1}></Col>
                      <Col span={7}>
                        <FormattedMessage id="form1abstract.ExaminedDate" />
                      </Col>
                    </Row>
                    <Row style={{ marginTop: 30 }}>
                      <Col span={7}>
                        <FormattedMessage id="form1abstract.Talathi" />,{' '}
                        {/*   <FormattedMessage id="form1abstract.VillageName" /> : */}
                        {this.props.village}
                      </Col>
                      <Col span={1}></Col>
                      <Col span={7}>
                        <FormattedMessage id="form1abstract.clerk" />,{' '}
                      </Col>
                      <Col span={1}></Col>
                      <Col span={7}>
                        <FormattedMessage id="form1abstract.tahsildar" />,{' '}
                      </Col>
                    </Row>
                    <Row>
                      <Col span={7}>
                        <FormattedMessage id="form1abstract.TalukaName" />: {this.props.taluka}{' '}
                        <FormattedMessage id="form1abstract.District" />: {this.props.district}
                      </Col>
                      <Col span={1}></Col>
                      <Col span={7}>
                        <FormattedMessage id="form1abstract.TalukaName" />: {this.props.taluka}{' '}
                        <FormattedMessage id="form1abstract.District" />: {this.props.district}
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

export default Report;
