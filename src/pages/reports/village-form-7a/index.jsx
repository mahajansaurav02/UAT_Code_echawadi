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

var prevTotalArea = 0,
  prevAssessment = 0;

function Report3() {
  const { districtName, talukaName, districtCode, talukaCode } = useModel('details');
  const { sendRequest } = useAxios();
  const [codeVillage, setCodeVillage] = useState('');
  const [textForVillage, setTextForVillage] = useState();
  const [village, setVillage] = useState([]);
  const [tableData, setTableData] = useState();
  const [textVillage, setTextVillage] = useState('');
  const componentRef = useRef();
  const [isNirank, setIsNirank] = useState(false);
  const [revenueYear, setRevenueYear] = useState();
  const history = useHistory();
  const [totalArea, setTotalArea] = useState(0);
  const [netAssessment, setNetAssessment] = useState(0);
  const [loading, setLoading] = useState(false);

  const backToHomeButton = () => {
    history.push({ pathname: '/homepage' });
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  useEffect(() => {
    (prevTotalArea = 0), (prevAssessment = 0);
  }, []);

  const getTableData = async () => {
    (prevTotalArea = 0), (prevAssessment = 0);
    setLoading(true);

    sendRequest(
      `${URLS.BaseURL}/form7a/getForm7AReport?districtCode=${districtCode}&talukaCode=${talukaCode}&cCode=${codeVillage}`,
      'GET',
      null,
      (res) => {
        setTableData(
          res.data.form7AData.map((r, i) => ({
            srNo: i + 1,
            id: r.id,
            khataNo: r.khataNo,
            lastYearSerialNo: r.lastYearSerialNo,
            nameOfTenant: r.nameOfTenant,
            landlordName: r.landlordName,
            pin: r.hissaNo == null || r.hissaNo.trim() == '' ? r.pin : r.pin + '/' + r.hissaNo,
            hissaNo: r.hissaNo,
            area: r.area,
            assessment: r.assessment,
            rent: r.rent,
            serialNoInMutationReg: r.serialNoInMutationReg,
            remarks: r.remarks,
            // hissaNo:r.hissaNo,
            allTotal: getTotalAreaAssess(r.area, r.assessment),
          })),
        );
        setLoading(false);
      },
      (err) => {
        message.error('Reports Details Not Found');

        setLoading(false);
      },
    );
  };

  var totalAreaAddition = prevTotalArea.toFixed(4).substring(prevTotalArea.length - 2);
  var totalAreaOfAll = totalAreaAddition
    .substring(0, totalAreaAddition.length - 2)
    .concat('.')
    .concat(totalAreaAddition.substring(totalAreaAddition.length - 2));

  return (
    <>
      <Card>
        <Row>
          <Col span={8}>
            <Button type="primary" onClick={handlePrint}>
              प्रत मिळवा
            </Button>
          </Col>
          <Col span={8}>
            <h1 style={{ textAlign: 'center' }}>
              {<FormattedMessage id="villageForm.form.villageForm" />}
            </h1>
            {/* <h1 style={{ textAlign: 'center' }}>अहवाल फॉर्म 3</h1> */}
          </Col>
          <Col span={8}>
            <Button style={{ float: 'right' }} onClick={backToHomeButton} type="primary">
              मुख्यपृष्ठ
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
                डेटा मिळवा
              </Button>
            )}
          </Col>
        </Row>
        <Col xl={24} lg={24} md={24} sm={24} xs={24}>
          {loading === true ? (
            <Spin size="large" style={{ marginLeft: '630px', marginTop: '20px' }} />
          ) : null}
        </Col>
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
      />
    </>
  );
}

function getTotalAreaAssess(area, assessment) {
  prevTotalArea += parseFloat(area);

  prevAssessment += parseFloat(assessment);
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
                  <th colSpan="11">
                    <h3 style={{ color: 'red' }}>
                      <b>{<FormattedMessage id="villageForm.form.villageForm" />}</b>
                    </h3>
                  </th>
                </tr>
                <tr>
                  <th colSpan="11">
                    <h3 style={{ color: 'red' }}>
                      <b>{<FormattedMessage id="villageForm.form.registerOfTenancies" />}</b>
                    </h3>
                  </th>
                </tr>
                <tr>
                  <th colSpan="11">
                    <h3 style={{ color: 'red' }}>
                      <b>{<FormattedMessage id="villageForm.form.rulesof32" />}</b>

                      {/* <b>[Rule 32 of the Maharashtra Land Revenue Record of Rights and REg]</b> */}
                    </h3>
                  </th>
                </tr>
                <tr>
                  <th colSpan="11">
                    <h4 style={{ color: 'red' }}>
                      <b>
                        {<FormattedMessage id="villageForm.form.village" />}-{this.props.village}{' '}
                        {<FormattedMessage id="villageForm.form.taluka" />}-{this.props.taluka}{' '}
                        {<FormattedMessage id="villageForm.form.distrcit" />}- {this.props.district}
                      </b>

                      {/* <b>Village- Taluka- District-</b> */}
                    </h4>
                  </th>
                </tr>
                <tr>
                  <th>
                    <b>{<FormattedMessage id="villageForm.form.srno" />}</b>
                  </th>
                  <th>
                    <b>{<FormattedMessage id="villageForm.form.serialNumber" />}</b>
                  </th>
                  <th>
                    <b>
                      <FormattedMessage id="formLanguage.button.khataNo" />
                    </b>
                  </th>
                  <th>
                    <b>{<FormattedMessage id="villageForm.form.nameOfTenant1" />}</b>
                  </th>
                  <th>
                    <b>{<FormattedMessage id="villageForm.form.nameLandlord" />}</b>
                  </th>
                  <th>
                    <b>
                      <FormattedMessage id="villageForm.form.surveyHissa" />
                    </b>
                  </th>
                  <th>
                    <b>
                      <FormattedMessage id="villageForm.form.area" />
                    </b>
                  </th>
                  <th>
                    <b>
                      <FormattedMessage id="villageForm.form.assessement" />
                    </b>
                  </th>
                  <th>
                    <b>
                      <FormattedMessage id="villageForm.form.rent" />
                    </b>
                  </th>
                  <th>
                    <b>
                      <FormattedMessage id="villageForm.form.srlNoOfEntry" />
                    </b>
                  </th>
                  <th>
                    <b>
                      <FormattedMessage id="formLanguage.table.remark" />
                    </b>
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
                </tr>
              </thead>
              <tbody>
                {this.props.dataToMap &&
                  this.props.dataToMap.map((r, i) => (
                    <tr>
                      <td className={styles.td1}>{r.srNo}</td>
                      <td className={styles.td2}>{r.lastYearSerialNo}</td>
                      <td className={styles.td2}>{r.khataNo}</td>

                      <td className={styles.td3}>{r.nameOfTenant}</td>
                      <td className={styles.td4}>{r.landlordName}</td>
                      <td className={styles.td5}>
                        {r.pin}
                        {/*  - {r.hissaNo} */}
                      </td>
                      <td className={styles.td6}>
                        {r.area
                          .substring(0, r.area.length - 2)
                          .concat('.')
                          .concat(r.area.substring(r.area.length - 2))}
                      </td>
                      <td className={styles.td7}>{r.assessment}</td>
                      {/* <td>{r.hissaNo}</td> */}
                      <td className={styles.td8}>{r.rent}</td>
                      <td className={styles.td9}>{r.serialNoInMutationReg}</td>
                      <td className={styles.td10}>{r.remarks}</td>
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
                    <b>{this.props.totalArea}</b>
                  </td>
                  <td>
                    <b>{this.props.netAssessment}</b>
                  </td>
                  <td colSpan={3}></td>
                </tr>
              </tbody>
            </table>
          </Card>
        </div>
      </Col>
    );
  }
}

export default Report3;

// import { PageContainer } from '@ant-design/pro-layout';
// import styles from './report.module.css';
// import React from 'react';
// import { useState, useRef } from 'react';
// import { Card ,Button ,Row} from 'antd';
// import { useReactToPrint } from 'react-to-print';
// import { FormattedMessage } from 'umi';
// import VillageSelector from '@/components/eComponents/VillageSelector';
// import useAxios from '@/components/eComponents/use-axios';
// import { useHistory, useLocation } from 'react-router-dom';

// import URLS from '@/URLs/urls';

// function Report() {

//   const history = useHistory();
//   const componentRef = useRef();
//   const [tableData, setTableData] = useState();
//   const { sendRequest } = useAxios();
//     const [revenueYear, setRevenueYear] = useState();
//     const [village, setVillage] = useState([]);
//   const [textForVillage, setTextForVillage] = useState();
//    const [codeVillage, setCodeVillage] = useState('');
//    const handlePrint = useReactToPrint({
//     content: () => componentRef.current,
//   });

//   const backToHomeButton = () => {
//     history.push({ pathname: '/homepage' });
//   };
//     const getTableData = async () => {
//     sendRequest(
//       // 203.129.224.92:8089/echawdi/api/form7a/getForm7AData
//       `${URLS.BaseURL}/form7a/getForm7AData?cCode=${codeVillage}`,
//       'GET',
//       null,
//       (res) => {
//         console.log('Full Response For Print', res);
//         setTableData(
//           res.data.form1EData.map((r, i) => ({
//             id: r.id,
//              srNo: i+ 1,
//              lastYearSerialNo:r.lastYearSerialNo,
//             nameOfTenant :r.nameOfTenant,
//             landlordName : r.landlordName,
//             area:r.area,
//             assessment:r.assessment,
//             pin: r.pin,
//             hissaNo:r.hissaNo,
//             rent :r.rent,
//             serialNoInMutationReg :r.serialNoInMutationReg,
//             remarks :r.remarks
//           })),
//         );
//       },
//     );
//   };
//   return (

// <PageContainer>
//   <Card>
//     <h1 style={{ textAlign: 'center' }}>{<FormattedMessage id='villageForm.form.reportform7a'/>}
//     </h1>
//     <div style={{ padding: 10 }}>
//       <Button type="primary" onClick={handlePrint}>
//         प्रत काढा
//       </Button>
//       <Button style={{ float: 'right' }} onClick={backToHomeButton} type="primary">
//         मुख्यपृष्ठ
//       </Button>
//     </div>
//       {/* <Row style={{ marginLeft: '15px' }}> */}
//   <VillageSelector
//   setCodeVillage={setCodeVillage}
//   setTextForVillage={setTextForVillage}
//   onVillageChange={setVillage}
//   yearChange={setRevenueYear}
//   />

//   <Button onClick={getTableData} type="primary">
//   डेटा मिळवा
//   </Button>
//   {/* </Row> */}
//   </Card>

//   <Card bordered={true} title='Report'>
//   <div className="report">
//   <table scroll={{ x: 400 }}  className={styles.report_table}>
//   <tr>
//   <th colSpan="11">
//   <h3 style={{ color: 'red' }}>
//   <b>{<FormattedMessage id='villageForm.form.villageForm'/>}</b>
//   </h3>
//   </th>
//   </tr>
//   <tr>
//   <th colSpan="11">
//   <h3 style={{ color: 'red' }}>
//   <b>{<FormattedMessage id='villageForm.form.registerOfTenancies'/>}</b>
//   </h3>
//   </th>
//   </tr>
//   <tr>
//   <th colSpan="11">
//   <h3 style={{ color: 'red' }}>
//   <b>{<FormattedMessage id='villageForm.form.rulesof32'/>}</b>

//   {/* <b>[Rule 32 of the Maharashtra Land Revenue Record of Rights and REg]</b> */}
//   </h3>
//   </th>
//   </tr>
//   <tr>
//   <th colSpan="11">
//   <h4 style={{ color: 'red' }}>
//   <b>{<FormattedMessage id='villageForm.form.village'/>} - {<FormattedMessage id='villageForm.form.taluka'/>}- {<FormattedMessage id='villageForm.form.distrcit'/>}</b>

//   {/* <b>Village- Taluka- District-</b> */}
//   </h4>
//   </th>
//   </tr>
//   <tr>
//   <td>
//   <b>Sr No</b>
//   </td>
//   <td>
//   <b>Serail No of Last years register</b>
//   </td>
//   <td>
//   <b>Name of the Tenant</b>
//   </td>
//   <td>
//   <b>Name of the landlord</b>
//   </td>
//   <td>
//   <b>Survey No</b>
//   </td>
//   <td>
//   <b>Area</b>
//   </td>
//   <td>
//   <b>Assessment</b>
//   </td>
//   <td>
//   <b>Rent</b>
//   </td>
//   <td>
//   <b>Seraol No. of the entry on the mutation register </b>
//   </td>
//   <td>
//   <b>Remark</b>
//   </td>
//   </tr>
//   <tr>
//   <td></td>
//   <td></td>
//   <td></td>
//   <td>Kind</td>
//   <td>Area</td>
//   <td></td>
//   <td></td>
//   <td></td>
//   <td></td>
//   <td></td>
//   </tr>
//   <tr>
//   <td>1</td>
//   <td>2</td>
//   <td>3</td>
//   <td>4</td>
//   <td>5</td>
//   <td>6</td>
//   <td>7</td>
//   <td>8</td>
//   <td>9</td>
//   <td>10</td>

//   </tr>
//   <tr>
// <td></td>
// <td></td>
// <td>H. A.</td>
// <td></td>
// <td>H. A.</td>
// <td>H. A.</td>
// <td>Rs. P.</td>
// <td></td>
// <td></td>
// <td></td>

//   </tr>
//   <tr style={{ height: '20px' }}>
// <td></td>
// <td></td>
// <td></td>
// <td></td>
// <td></td>
// <td></td>
// <td></td>
// <td></td>
// <td></td>
// <td></td>

// </tr>
// <tr>
//   <td>1</td>
//   <td>2</td>
//   <td>3</td>
//   <td>4</td>
//   <td>5</td>
//   <td>6</td>
//   <td>7</td>
//   <td>8</td>
//   <td>9</td>
//   <td>10</td>

// </tr>
//  {this.props.dataToMap &&
//   this.props.dataToMap.map((r, i) => (
//                   <tr>
//                     <td>{r.lastYearSerialNo}</td>
//                     <td>{r.nameOfTenant }</td>
//                     <td>{r.landlordName}</td>
//                     <td>{r.area}</td>
//                     <td>{r.assessment}</td>
//                     <td>{r.pinr}</td>
//                     <td>{r.hissaNo}</td>
//                     <td>{r. rent }</td>
//                     <td>{r.serialNoInMutationReg}</td>
//                     <td></td>
//                     <td></td>
//                     <td></td>
//                     <td></td>
//                     <td></td>
//                     <td></td>
//                     <td></td>
//                     <td>{r.remarks}</td>
//                   </tr>
//                 ))}
// </table>
// </div>
// </Card>

// </PageContainer>
//   );
// }

// export default Report;
