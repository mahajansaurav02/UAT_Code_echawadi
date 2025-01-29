import styles from './report.module.css';
import { useModel, FormattedMessage } from 'umi';
import React, { useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import { Alert, Button, Card, Col, Spin } from 'antd';
import VillageSelector from '@/components/eComponents/VillageSelector';
import URLS from '@/URLs/urls';
import useAxios from '@/components/eComponents/use-axios';
import ReactHtmlTableToExcel from 'react-html-table-to-excel';

function Report1C() {
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

  const backToHomeButton = () => {
    history.push({ pathname: '/homepage' });
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const getTableData = async () => {
    setLoading(true);
    sendRequest(
      `${URLS.BaseURL}/form1c/getForm1CReport?districtCode=${districtCode}&talukaCode=${talukaCode}&cCode=${codeVillage}`,
      'GET',
      null,
      (res) => {
        // console.log('Full res for form1cData', res.data.form1cData);
        setTableData(res.data.form1CData);
        setLoading(false);
      },
      (err) => {
        setLoading(false);
      },
    );
  };

  return (
    <div>
      <Card>
        <h1 style={{ textAlign: 'center' }}>
          <FormattedMessage id="form1c.report.headings1" />
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
          pageType="withoutYear"
          setCodeVillage={setCodeVillage}
          setTextForVillage={setTextForVillage}
          onVillageChange={(setVillage, setTableData)}
          yearChange={setRevenueYear}
          setIsNirank={setIsNirank}
        />
        {!isNirank && (
          <Button type="primary" onClick={getTableData}>
            <FormattedMessage id="villageReport1.button.getData" />
          </Button>
        )}
        {loading === true ? (
          <Spin size="large" style={{ marginLeft: '530px', marginTop: '20px' }} />
        ) : null}
      </Card>
      {/*  <Card>
        <center>
        
          <h3>
            <FormattedMessage id="form1c.labels.report" /> -{' '}
            <u>
              <a
                href="https://www.google.com/search?q=https://bhumiabhilekh.maharashtra.gov.in/1091/%E0%A4%88-%E0%A4%AB%E0%A5%87%E0%A4%B0%E0%A4%AB%E0%A4%BE%E0%A4%B0"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FormattedMessage id="form1c.report.headings1" />
              </a>
            </u>
          </h3>
        </center>
      </Card> */}

      <ComponentToPrint
        ref={componentRef}
        village={textForVillage}
        taluka={talukaName}
        district={districtName}
        dataToMap={tableData}
        isNirank={isNirank}
      />
    </div>
  );
}

class ComponentToPrint extends React.Component {
  render() {
    return (
      <Col xl={24} lg={24} md={24} sm={24} xs={24}>
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
            <table id="table-to-xls" bordered scroll={{ x: 100 }} className={styles.report_table}>
              <thead>
                <tr>
                  <th colSpan="14">
                    <h3 style={{ color: 'red' }}>
                      <b>{<FormattedMessage id="form1c.report.headings1" />}</b>
                    </h3>
                  </th>
                </tr>
                {/* <tr>
                  <th colSpan="14">
                    <h3 style={{ color: 'red' }}>
                      <b>{<FormattedMessage id="form1c.report.headings2" />}</b>
                    </h3>
                  </th>
                </tr> */}
                <tr></tr>
                <tr>
                  <th colSpan="14">
                    <h4 style={{ color: 'red' }}>
                      <b>
                        {<FormattedMessage id="villageForm.form.village" />}-{this.props.village}{' '}
                        {<FormattedMessage id="villageForm.form.taluka" />}-{this.props.taluka}{' '}
                        {<FormattedMessage id="villageForm.form.distrcit" />}- {this.props.district}
                      </b>
                    </h4>
                  </th>
                </tr>

                <tr>
                  {/* <th>
                    <b>{<FormattedMessage id="formLanguage.form.serialNo" />}</b>
                  </th> */}
                  <th>
                    <b>भूमापन क्रमांक</b>
                  </th>
                  <th>
                    <b>भोगवटादाराचे नाव</b>
                  </th>
                  <th>
                    <b>
                      क्षेत्र <br />
                      (हे.आर.चौमी)
                    </b>
                  </th>

                  <th>
                    <b>
                      आकारणी <br />
                      (रु.पैसे)
                    </b>
                  </th>

                  <th>
                    <b>जमीन कोणत्या शर्तीवर प्रदान करण्‍यात आली आहे</b>
                  </th>
                  <th>
                    <b>जमीन प्रदानाचा आदेश क्रमांक व दिनांक </b>
                  </th>
                  <th>
                    <b>जमीन ज्‍या कारणास्‍तव निहीत केली आहे त्‍या उपयोगाचे प्रयोजन</b>
                  </th>
                  <th>
                    <b>निहित केलेल्‍या प्राधिकरणाचे नाव उदा. नगरपालिका/ ग्रामपंचायत इ.</b>
                  </th>
                  {/* <th>
                    <b>{'Unit'}</b>
                  </th> */}
                  <th>
                    <b>जमीन हस्‍तांतरणास परवानगी देण्‍यास सक्षम प्राधिकारी</b>
                  </th>
                  <th>
                    <b>
                      शासनास भरावी लागणारी अनार्जित रक्‍कम /नजराणा/ कब्‍जेहक्‍काच्या रक्‍कमेचा तपशिल
                    </b>
                  </th>
                  <th>
                    <b>
                      सक्षम प्राधिकार्‍याचे विक्री परवानगी/ शर्तभंग प्रकरणी आदेश पारीत झाले असल्‍यास
                      त्‍याचा क्रमांक व दिनांक
                    </b>
                  </th>
                  <th>
                    <b>तपासणी अधिकारी व तपासणीचा दिनांक</b>
                  </th>
                  <th>
                    <b>शेरा</b>
                  </th>
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
                  <th>13</th>
                  {/* <th>14</th> */}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan="14" style={{ color: 'red', textAlign: 'left' }}>
                    १क(१)-मुंबई कुळ्वाहिवाट व शेत जमीन अधिनियम १९४८ चे कलम ३२ ग अन्वये विक्री
                    झालेल्या जमिनी
                  </td>
                </tr>
                {this.props.dataToMap &&
                  this.props.dataToMap.map((r) => {
                    if (r.clause == '1') {
                      return (
                        <>
                          <tr>
                            <td>
                              {r.hissaNo == null || r.hissaNo.trim() == ''
                                ? r.pin
                                : r.pin + '/' + r.hissaNo}
                            </td>
                            <td>{r.khataOwnerName}</td>
                            <td>{r.totalAreaH}</td>
                            <td>{r.assessment}</td>
                            <td>{r.termsOfGrant}</td>
                            <td>{r.aadeshOnDate}</td>
                            <td>{r.purposeOfLandIntended}</td>
                            <td>{r.nameOfVillagePanchayat}</td>
                            <td>{r.authorityCompetentToPermitTransferOfLand}</td>
                            <td>{r.detailsOfUnclaimedAmount}</td>
                            <td>{r.breachOfCondition}</td>
                            <td>{r.inspectingOfficer}</td>
                            <td>{r.remarks}</td>
                          </tr>
                        </>
                      );
                    }
                  })}

                <tr>
                  <td colSpan="14" style={{ color: 'red', textAlign: 'left' }}>
                    १क(२)-वेगवेगळ्या इनाम व वतन जमिनी (देवस्तान जमिनी वगळून)
                  </td>
                </tr>
                {this.props.dataToMap &&
                  this.props.dataToMap.map((r) => {
                    if (r.clause == '2') {
                      return (
                        <>
                          <tr>
                            <td>
                              {r.hissaNo == null || r.hissaNo.trim() == ''
                                ? r.pin
                                : r.pin + '/' + r.hissaNo}
                            </td>
                            <td>{r.khataOwnerName}</td>
                            <td>{r.totalAreaH}</td>
                            <td>{r.assessment}</td>
                            <td>{r.termsOfGrant}</td>
                            <td>{r.aadeshOnDate}</td>
                            <td>{r.purposeOfLandIntended}</td>
                            <td>{r.nameOfVillagePanchayat}</td>
                            <td>{r.authorityCompetentToPermitTransferOfLand}</td>
                            <td>{r.detailsOfUnclaimedAmount}</td>
                            <td>{r.breachOfCondition}</td>
                            <td>{r.inspectingOfficer}</td>
                            <td>{r.remarks}</td>
                          </tr>
                        </>
                      );
                    }
                    // return <>निरंक</>
                  })}
                <tr>
                  <td colSpan="14" style={{ color: 'red', textAlign: 'left' }}>
                    १क(४)-महाराष्ट्र जमिन महसूल अधिनियम, १९६६ अंतर्गत विविध योजने अंतर्गत प्रदान/
                    अतिक्रमण नियमानुकूल केलेल्या जमिनी (भूमिहीन, शेतमजुर, स्वातंत्र्य सैनिक इ.)
                  </td>
                </tr>
                {this.props.dataToMap &&
                  this.props.dataToMap.map((r) => {
                    if (r.clause == '3') {
                      return (
                        <>
                          <tr>
                            <td>
                              {r.hissaNo == null || r.hissaNo.trim() == ''
                                ? r.pin
                                : r.pin + '/' + r.hissaNo}
                            </td>
                            <td>{r.khataOwnerName}</td>
                            <td>{r.totalAreaH}</td>
                            <td>{r.assessment}</td>
                            <td>{r.termsOfGrant}</td>
                            <td>{r.aadeshOnDate}</td>
                            <td>{r.purposeOfLandIntended}</td>
                            <td>{r.nameOfVillagePanchayat}</td>
                            <td>{r.authorityCompetentToPermitTransferOfLand}</td>
                            <td>{r.detailsOfUnclaimedAmount}</td>
                            <td>{r.breachOfCondition}</td>
                            <td>{r.inspectingOfficer}</td>
                            <td>{r.remarks}</td>
                          </tr>
                        </>
                      );
                    }
                    // return <>निरंक</>
                  })}
                <tr>
                  <td colSpan="14" style={{ color: 'red', textAlign: 'left' }}>
                    १क(५)-महाराष्ट्र जमिन महसूल अधिनियम, १९६६ अंतर्गत विविध योजने अंतर्गत प्रदान/
                    आतिक्रमण नियमांनुकूल केलेल्या जमिनी (गृह निर्माण संस्था, औद्यागिक आस्थापना,
                    शैक्षणिक संस्था, विशेष वसाहत प्रकल्प इ.)
                  </td>
                </tr>
                {this.props.dataToMap &&
                  this.props.dataToMap.map((r) => {
                    if (r.clause == '4') {
                      return (
                        <>
                          <tr>
                            <td>
                              {r.hissaNo == null || r.hissaNo.trim() == ''
                                ? r.pin
                                : r.pin + '/' + r.hissaNo}
                            </td>
                            <td>{r.khataOwnerName}</td>
                            <td>{r.totalAreaH}</td>
                            <td>{r.assessment}</td>
                            <td>{r.termsOfGrant}</td>
                            <td>{r.aadeshOnDate}</td>
                            <td>{r.purposeOfLandIntended}</td>
                            <td>{r.nameOfVillagePanchayat}</td>
                            <td>{r.authorityCompetentToPermitTransferOfLand}</td>
                            <td>{r.detailsOfUnclaimedAmount}</td>
                            <td>{r.breachOfCondition}</td>
                            <td>{r.inspectingOfficer}</td>
                            <td>{r.remarks}</td>
                          </tr>
                        </>
                      );
                    }
                    // return <>निरंक</>
                  })}
                <tr>
                  <td colSpan="14" style={{ color: 'red', textAlign: 'left' }}>
                    १क(५)-महाराष्ट्र शेत जमिन कमाल धारणा अधिनियम, १९६१ अंतर्गत वाटप केलेल्या जमिनी
                  </td>
                </tr>
                {this.props.dataToMap &&
                  this.props.dataToMap.map((r) => {
                    if (r.clause == '5') {
                      return (
                        <>
                          <tr>
                            <td>
                              {r.hissaNo == null || r.hissaNo.trim() == ''
                                ? r.pin
                                : r.pin + '/' + r.hissaNo}
                            </td>
                            <td>{r.khataOwnerName}</td>
                            <td>{r.totalAreaH}</td>
                            <td>{r.assessment}</td>
                            <td>{r.termsOfGrant}</td>
                            <td>{r.aadeshOnDate}</td>
                            <td>{r.purposeOfLandIntended}</td>
                            <td>{r.nameOfVillagePanchayat}</td>
                            <td>{r.authorityCompetentToPermitTransferOfLand}</td>
                            <td>{r.detailsOfUnclaimedAmount}</td>
                            <td>{r.breachOfCondition}</td>
                            <td>{r.inspectingOfficer}</td>
                            <td>{r.remarks}</td>
                          </tr>
                        </>
                      );
                    }
                    // return <>निरंक</>
                  })}
                <tr>
                  <td colSpan="14" style={{ color: 'red', textAlign: 'left' }}>
                    १क(६)-महानगरपालिका, नगरपालिका व विविध प्राधिकारण यांच्या विकास आराखड्यात
                    समाविष्ट असलेल्या जमिनी अथवा ग्रामपंचायतीकडे गुरचरण अथवा इतर प्रयोजनासाठी वर्ग
                    केलेल्या जमिनी
                  </td>
                </tr>
                {this.props.dataToMap &&
                  this.props.dataToMap.map((r) => {
                    if (r.clause == '6') {
                      return (
                        <>
                          <tr>
                            <td>
                              {r.hissaNo == null || r.hissaNo.trim() == ''
                                ? r.pin
                                : r.pin + '/' + r.hissaNo}
                            </td>
                            <td>{r.khataOwnerName}</td>
                            <td>{r.totalAreaH}</td>
                            <td>{r.assessment}</td>
                            <td>{r.termsOfGrant}</td>
                            <td>{r.aadeshOnDate}</td>
                            <td>{r.purposeOfLandIntended}</td>
                            <td>{r.nameOfVillagePanchayat}</td>
                            <td>{r.authorityCompetentToPermitTransferOfLand}</td>
                            <td>{r.detailsOfUnclaimedAmount}</td>
                            <td>{r.breachOfCondition}</td>
                            <td>{r.inspectingOfficer}</td>
                            <td>{r.remarks}</td>
                          </tr>
                        </>
                      );
                    }
                    // return <>निरंक</>
                  })}
                <tr>
                  <td colSpan="14" style={{ color: 'red', textAlign: 'left' }}>
                    १क(७)-देवस्थान इनाम जमिनी
                  </td>
                </tr>
                {this.props.dataToMap &&
                  this.props.dataToMap.map((r) => {
                    if (r.clause == '7') {
                      return (
                        <>
                          <tr>
                            <td>
                              {r.hissaNo == null || r.hissaNo.trim() == ''
                                ? r.pin
                                : r.pin + '/' + r.hissaNo}
                            </td>
                            <td>{r.khataOwnerName}</td>
                            <td>{r.totalAreaH}</td>
                            <td>{r.assessment}</td>
                            <td>{r.termsOfGrant}</td>
                            <td>{r.aadeshOnDate}</td>
                            <td>{r.purposeOfLandIntended}</td>
                            <td>{r.nameOfVillagePanchayat}</td>
                            <td>{r.authorityCompetentToPermitTransferOfLand}</td>
                            <td>{r.detailsOfUnclaimedAmount}</td>
                            <td>{r.breachOfCondition}</td>
                            <td>{r.inspectingOfficer}</td>
                            <td>{r.remarks}</td>
                          </tr>
                        </>
                      );
                    }
                    // return <>निरंक</>
                  })}
                <tr>
                  <td colSpan="14" style={{ color: 'red', textAlign: 'left' }}>
                    १क(८)-आदिवासी खातेदारांचा जमिनी, महाराष्ट्र जमिनी महसूल अधिनियम, १९६६ च्या कलम
                    ३६ अ प्रमाणे
                  </td>
                </tr>
                {this.props.dataToMap &&
                  this.props.dataToMap.map((r) => {
                    if (r.clause == '8') {
                      return (
                        <>
                          <tr>
                            <td>
                              {r.hissaNo == null || r.hissaNo.trim() == ''
                                ? r.pin
                                : r.pin + '/' + r.hissaNo}
                            </td>
                            <td>{r.khataOwnerName}</td>
                            <td>{r.totalAreaH}</td>
                            <td>{r.assessment}</td>
                            <td>{r.termsOfGrant}</td>
                            <td>{r.aadeshOnDate}</td>
                            <td>{r.purposeOfLandIntended}</td>
                            <td>{r.nameOfVillagePanchayat}</td>
                            <td>{r.authorityCompetentToPermitTransferOfLand}</td>
                            <td>{r.detailsOfUnclaimedAmount}</td>
                            <td>{r.breachOfCondition}</td>
                            <td>{r.inspectingOfficer}</td>
                            <td>{r.remarks}</td>
                          </tr>
                        </>
                      );
                    }
                    // return <>निरंक</>
                  })}
                <tr>
                  <td colSpan="14" style={{ color: 'red', textAlign: 'left' }}>
                    १क(९)-महाराष्ट्र पुनर्वसन अधिनियम, १९९९ च्या कलम १६ अन्वये प्रदान केलेल्या जमिनी
                  </td>
                </tr>
                {this.props.dataToMap &&
                  this.props.dataToMap.map((r) => {
                    if (r.clause == '9') {
                      return (
                        <>
                          <tr>
                            <td>
                              {r.hissaNo == null || r.hissaNo.trim() == ''
                                ? r.pin
                                : r.pin + '/' + r.hissaNo}
                            </td>
                            <td>{r.khataOwnerName}</td>
                            <td>{r.totalAreaH}</td>
                            <td>{r.assessment}</td>
                            <td>{r.termsOfGrant}</td>
                            <td>{r.aadeshOnDate}</td>
                            <td>{r.purposeOfLandIntended}</td>
                            <td>{r.nameOfVillagePanchayat}</td>
                            <td>{r.authorityCompetentToPermitTransferOfLand}</td>
                            <td>{r.detailsOfUnclaimedAmount}</td>
                            <td>{r.breachOfCondition}</td>
                            <td>{r.inspectingOfficer}</td>
                            <td>{r.remarks}</td>
                          </tr>
                        </>
                      );
                    }
                    // return <>निरंक</>
                  })}
                <tr>
                  <td colSpan="14" style={{ color: 'red', textAlign: 'left' }}>
                    १क(१०)-भाडेपट्याने दिलेल्या शासकीय जमिनी
                  </td>
                </tr>
                {this.props.dataToMap &&
                  this.props.dataToMap.map((r) => {
                    if (r.clause == '10') {
                      return (
                        <>
                          <tr>
                            <td>
                              {r.hissaNo == null || r.hissaNo.trim() == ''
                                ? r.pin
                                : r.pin + '/' + r.hissaNo}
                            </td>
                            <td>{r.khataOwnerName}</td>
                            <td>{r.totalAreaH}</td>
                            <td>{r.assessment}</td>
                            <td>{r.termsOfGrant}</td>
                            <td>{r.aadeshOnDate}</td>
                            <td>{r.purposeOfLandIntended}</td>
                            <td>{r.nameOfVillagePanchayat}</td>
                            <td>{r.authorityCompetentToPermitTransferOfLand}</td>
                            <td>{r.detailsOfUnclaimedAmount}</td>
                            <td>{r.breachOfCondition}</td>
                            <td>{r.inspectingOfficer}</td>
                            <td>{r.remarks}</td>
                          </tr>
                        </>
                      );
                    }
                    // return <>निरंक</>
                  })}
                <tr>
                  <td colSpan="14" style={{ color: 'red', textAlign: 'left' }}>
                    1क(११)-भूदान व ग्रामदान अंतर्गत दिलेल्या जमिनी
                  </td>
                </tr>
                {this.props.dataToMap &&
                  this.props.dataToMap.map((r) => {
                    if (r.clause == '11') {
                      return (
                        <>
                          <tr>
                            <td>
                              {r.hissaNo == null || r.hissaNo.trim() == ''
                                ? r.pin
                                : r.pin + '/' + r.hissaNo}
                            </td>
                            <td>{r.khataOwnerName}</td>
                            <td>{r.totalAreaH}</td>
                            <td>{r.assessment}</td>
                            <td>{r.termsOfGrant}</td>
                            <td>{r.aadeshOnDate}</td>
                            <td>{r.purposeOfLandIntended}</td>
                            <td>{r.nameOfVillagePanchayat}</td>
                            <td>{r.authorityCompetentToPermitTransferOfLand}</td>
                            <td>{r.detailsOfUnclaimedAmount}</td>
                            <td>{r.breachOfCondition}</td>
                            <td>{r.inspectingOfficer}</td>
                            <td>{r.remarks}</td>
                          </tr>
                        </>
                      );
                    }
                    // return <>निरंक</>
                  })}
                <tr>
                  <td colSpan="14" style={{ color: 'red', textAlign: 'left' }}>
                    १क(१२)-महाराष्ट्र खाजगी वने(संपादन) अधिनियम, १९६१ अन्वये चौकशीसाठी प्रलंबित
                    असलेल्या जमिनी
                  </td>
                </tr>
                {this.props.dataToMap &&
                  this.props.dataToMap.map((r) => {
                    if (r.clause == '12') {
                      return (
                        <>
                          <tr>
                            <td>
                              {r.hissaNo == null || r.hissaNo.trim() == ''
                                ? r.pin
                                : r.pin + '/' + r.hissaNo}
                            </td>
                            <td>{r.khataOwnerName}</td>
                            <td>{r.totalAreaH}</td>
                            <td>{r.assessment}</td>
                            <td>{r.termsOfGrant}</td>
                            <td>{r.aadeshOnDate}</td>
                            <td>{r.purposeOfLandIntended}</td>
                            <td>{r.nameOfVillagePanchayat}</td>
                            <td>{r.authorityCompetentToPermitTransferOfLand}</td>
                            <td>{r.detailsOfUnclaimedAmount}</td>
                            <td>{r.breachOfCondition}</td>
                            <td>{r.inspectingOfficer}</td>
                            <td>{r.remarks}</td>
                          </tr>
                        </>
                      );
                    }
                    // return <>निरंक</>
                  })}
                <tr>
                  <td colSpan="14" style={{ color: 'red', textAlign: 'left' }}>
                    1क(१३)-भूमिधारी हक्कान्वये
                  </td>
                </tr>
                {this.props.dataToMap &&
                  this.props.dataToMap.map((r) => {
                    if (r.clause == '13') {
                      return (
                        <>
                          <tr>
                            <td>
                              {r.hissaNo == null || r.hissaNo.trim() == ''
                                ? r.pin
                                : r.pin + '/' + r.hissaNo}
                            </td>
                            <td>{r.khataOwnerName}</td>
                            <td>{r.totalAreaH}</td>
                            <td>{r.assessment}</td>
                            <td>{r.termsOfGrant}</td>
                            <td>{r.aadeshOnDate}</td>
                            <td>{r.purposeOfLandIntended}</td>
                            <td>{r.nameOfVillagePanchayat}</td>
                            <td>{r.authorityCompetentToPermitTransferOfLand}</td>
                            <td>{r.detailsOfUnclaimedAmount}</td>
                            <td>{r.breachOfCondition}</td>
                            <td>{r.inspectingOfficer}</td>
                            <td>{r.remarks}</td>
                          </tr>
                        </>
                      );
                    }
                    // return <>निरंक</>
                  })}

                <tr>
                  <td colSpan="14" style={{ color: 'red', textAlign: 'left' }}>
                    १क(१४)-महाराष्ट्र शेतजमीन (जमिन धरणेची कमाल मर्यादा) अधिनियम, १९६१ अंतर्गत कमाल
                    मर्यादेपेक्षा अधिक धारण करण्यास सूट दिलेल्या जमिनी
                  </td>
                </tr>

                {this.props.dataToMap &&
                  this.props.dataToMap.map((r) => {
                    if (r.clause == '14') {
                      return (
                        <>
                          <tr>
                            <td>
                              {r.hissaNo == null || r.hissaNo.trim() == ''
                                ? r.pin
                                : r.pin + '/' + r.hissaNo}
                            </td>
                            <td>{r.khataOwnerName}</td>
                            <td>{r.totalAreaH}</td>
                            <td>{r.assessment}</td>
                            <td>{r.termsOfGrant}</td>
                            <td>{r.aadeshOnDate}</td>
                            <td>{r.purposeOfLandIntended}</td>
                            <td>{r.nameOfVillagePanchayat}</td>
                            <td>{r.authorityCompetentToPermitTransferOfLand}</td>
                            <td>{r.detailsOfUnclaimedAmount}</td>
                            <td>{r.breachOfCondition}</td>
                            <td>{r.inspectingOfficer}</td>
                            <td>{r.remarks}</td>
                          </tr>
                        </>
                      );
                    }
                    // return <>निरंक</>
                  })}

                <tr>
                  <td colSpan="14" style={{ color: 'red', textAlign: 'left' }}>
                    १क(१५)-भूसंपादन अधिनियमान्वये संपादित केलेल्या जमिनी
                  </td>
                </tr>
                {this.props.dataToMap &&
                  this.props.dataToMap.map((r) => {
                    if (r.clause == '15') {
                      return (
                        <>
                          <tr>
                            <td>
                              {r.hissaNo == null || r.hissaNo.trim() == ''
                                ? r.pin
                                : r.pin + '/' + r.hissaNo}
                            </td>
                            <td>{r.khataOwnerName}</td>
                            <td>{r.totalAreaH}</td>
                            <td>{r.assessment}</td>
                            <td>{r.termsOfGrant}</td>
                            <td>{r.aadeshOnDate}</td>
                            <td>{r.purposeOfLandIntended}</td>
                            <td>{r.nameOfVillagePanchayat}</td>
                            <td>{r.authorityCompetentToPermitTransferOfLand}</td>
                            <td>{r.detailsOfUnclaimedAmount}</td>
                            <td>{r.breachOfCondition}</td>
                            <td>{r.inspectingOfficer}</td>
                            <td>{r.remarks}</td>
                          </tr>
                        </>
                      );
                    }
                    // return <>निरंक</>
                  })}
                <tr>
                  <td colSpan="14" style={{ color: 'red', textAlign: 'left' }}>
                    १क(१६)-वक्फ जमिनी
                  </td>
                </tr>
                {this.props.dataToMap &&
                  this.props.dataToMap.map((r) => {
                    if (r.clause == '16') {
                      return (
                        <>
                          <tr>
                            <td>
                              {r.hissaNo == null || r.hissaNo.trim() == ''
                                ? r.pin
                                : r.pin + '/' + r.hissaNo}
                            </td>
                            <td>{r.khataOwnerName}</td>
                            <td>{r.totalAreaH}</td>
                            <td>{r.assessment}</td>
                            <td>{r.termsOfGrant}</td>
                            <td>{r.aadeshOnDate}</td>
                            <td>{r.purposeOfLandIntended}</td>
                            <td>{r.nameOfVillagePanchayat}</td>
                            <td>{r.authorityCompetentToPermitTransferOfLand}</td>
                            <td>{r.detailsOfUnclaimedAmount}</td>
                            <td>{r.breachOfCondition}</td>
                            <td>{r.inspectingOfficer}</td>
                            <td>{r.remarks}</td>
                          </tr>
                        </>
                      );
                    }
                  })}

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
      </Col>
    );
  }
}

export default Report1C;
