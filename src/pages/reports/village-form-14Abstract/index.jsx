import { PageContainer } from '@ant-design/pro-layout';
import styles from './report.module.css';
import React, { useState, useRef, useEffect } from 'react';
import { Alert, Button, Card, Col, message, Row, Select, Spin } from 'antd';
import { useHistory, useLocation } from 'react-router-dom';
import Axios from 'axios';
import VillageSelector from '@/components/eComponents/VillageSelector';
import BaseURL from '@/URLs/urls';
import { useReactToPrint } from 'react-to-print';
import useAxios from '@/components/eComponents/use-axios';
import URLS from '@/URLs/urls';
import { useModel } from 'umi';
import { FormattedMessage } from 'umi';
import ReactHtmlTableToExcel from 'react-html-table-to-excel';

function VillageForm() {
  const [codeVillage, setCodeVillage] = useState('');
  const [textForVillage, setTextForVillage] = useState();
  const [village, setVillage] = useState([]);
  const [tableData, setTableData] = useState();
  const [isNirank, setIsNirank] = useState(false);
  const [textVillage, setTextVillage] = useState('');
  const componentRef = useRef();
  const { sendRequest } = useAxios();
  const { districtName, talukaName, districtCode, talukaCode } = useModel('details');
  const history = useHistory();
  const [revenueYear, setRevenueYear] = useState();
  const [totalArea, setTotalArea] = useState(0);
  const [loading, setLoading] = useState(false);

  const backToHomeButton = () => {
    history.push({ pathname: '/homepage' });
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const getTableData = async () => {
    setLoading(true);

    sendRequest(
      `${URLS.BaseURL}/form14/getForm14GhoshwaraReport?cCode=${codeVillage}`,
      'GET',
      null,
      (res) => {
        // console.log('test for pot', cultivableAreaInt, 'type', potkharabaTypeInt);

        setTableData({
          // id: r.id,
          govCanalKacchaInUse: res.data.form14Data[0].govCanalKacchaInUse,
          govCanalKacchaIsThrown: res.data.form14Data[0].govCanalKacchaIsThrown,
          govCanalKacchaNotUse: res.data.form14Data[0].govCanalKacchaNotUse,
          govCanalPakkaInUse: res.data.form14Data[0].govCanalPakkaInUse,
          govCanalPakkaIsThrown: res.data.form14Data[0].govCanalPakkaIsThrown,
          govCanalPakkaIsThrownOtherReason: res.data.form14Data[0].govCanalPakkaIsThrownOtherReason,
          govCanalPakkaIsThrownUnRepaired: res.data.form14Data[0].govCanalPakkaIsThrownUnRepaired,
          govCanalPakkaNotUse: res.data.form14Data[0].govCanalPakkaNotUse,
          lakeKacchaInUse: res.data.form14Data[0].lakeKacchaInUse,
          lakeKacchaIsThrown: res.data.form14Data[0].lakeKacchaIsThrown,
          lakeKacchaNotUse: res.data.form14Data[0].lakeKacchaNotUse,
          lakePakkaInUse: res.data.form14Data[0].lakePakkaInUse,
          lakePakkaIsThrown: res.data.form14Data[0].lakePakkaIsThrown,
          lakePakkaIsThrownOtherReason: res.data.form14Data[0].lakePakkaIsThrownOtherReason,
          lakePakkaIsThrownUnRepaired: res.data.form14Data[0].lakePakkaIsThrownUnRepaired,
          lakePakkaNotUse: res.data.form14Data[0].lakePakkaNotUse,
          otherKacchaInUse: res.data.form14Data[0].otherKacchaInUse,
          otherKacchaIsThrown: res.data.form14Data[0].otherKacchaIsThrown,
          otherKacchaNotUse: res.data.form14Data[0].otherKacchaNotUse,
          otherPakkaInUse: res.data.form14Data[0].otherPakkaInUse,
          otherPakkaIsThrown: res.data.form14Data[0].otherPakkaIsThrown,
          otherPakkaIsThrownOtherReason: res.data.form14Data[0].otherPakkaIsThrownOtherReason,
          otherPakkaIsThrownUnRepaired: res.data.form14Data[0].otherPakkaIsThrownUnRepaired,
          otherPakkaNotUse: res.data.form14Data[0].otherPakkaNotUse,
          privateCanalKacchaInUse: res.data.form14Data[0].privateCanalKacchaInUse,
          privateCanalKacchaIsThrown: res.data.form14Data[0].privateCanalKacchaIsThrown,
          privateCanalKacchaNotUse: res.data.form14Data[0].privateCanalKacchaNotUse,
          privateCanalPakkaInUse: res.data.form14Data[0].privateCanalPakkaInUse,
          privateCanalPakkaIsThrown: res.data.form14Data[0].privateCanalPakkaIsThrown,
          privateCanalPakkaIsThrownOtherReason:
            res.data.form14Data[0].privateCanalPakkaIsThrownOtherReason,
          privateCanalPakkaIsThrownUnRepaired:
            res.data.form14Data[0].privateCanalPakkaIsThrownUnRepaired,
          privateCanalPakkaNotUse: res.data.form14Data[0].privateCanalPakkaNotUse,
          wellKacchaInUse: res.data.form14Data[0].wellKacchaInUse,
          wellKacchaIsThrown: res.data.form14Data[0].wellKacchaIsThrown,
          wellKacchaNotUse: res.data.form14Data[0].wellKacchaNotUse,
          wellPakkaInUse: res.data.form14Data[0].wellPakkaInUse,
          wellPakkaIsThrown: res.data.form14Data[0].wellPakkaIsThrown,
          wellPakkaIsThrownOtherReason: res.data.form14Data[0].wellPakkaIsThrownOtherReason,
          wellPakkaIsThrownUnRepaired: res.data.form14Data[0].wellPakkaIsThrownUnRepaired,
          wellPakkaNotUse: res.data.form14Data[0].wellPakkaNotUse,
        });
        message.success('Records Fetched!!'), setLoading(false);
      },
    );
  };

  return (
    <div>
      <div>
        <Card>
          <h1 style={{ textAlign: 'center' }}>
            <FormattedMessage id="form14.fields.ruleReportHeadAbstract" />
          </h1>
          <div style={{ padding: 10 }}>
            <Button type="primary" onClick={handlePrint}>
              <FormattedMessage id="villageReport1A.button.print" />
            </Button>
            <Button style={{ float: 'right' }} onClick={backToHomeButton} type="primary">
              <FormattedMessage id="villageReport1A.button.home" />
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
          {!isNirank && (
            <Button
              onClick={
                /* getVillageForm1AData */ () => {
                  if (textForVillage) {
                    getTableData();
                  } else if (textForVillage == null) {
                    message.info('Please Select Village');
                  }
                }
              }
              type="primary"
            >
              <FormattedMessage id="villageReport1A.button.getData" />
            </Button>
          )}
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
        />
      </div>
    </div>
  );
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
            <div>
              <table id="table-to-xls" className={styles.report_table}>
                <thead>
                  <tr>
                    <th colSpan="16">
                      <h3 style={{ color: 'red' }}>
                        <b>
                          <FormattedMessage id="form14.fields.ruleReportHeadAbstract" />
                        </b>
                      </h3>
                    </th>
                  </tr>

                  <tr>
                    <th colSpan="16">
                      <pre>
                        <h3 style={{ color: 'red', fontSize: '20' }}>
                          <b>
                            <FormattedMessage id="villageReport1A.label.village" />
                            {this.props.village}{' '}
                            <FormattedMessage id="villageReport1A.label.taluka" />
                            {this.props.taluka}{' '}
                            <FormattedMessage id="villageReport1A.label.district" />
                            {this.props.district}
                          </b>
                        </h3>
                      </pre>
                    </th>
                  </tr>
                  <tr>
                    <th rowSpan="4">
                      <b>अनुक्रमांक</b>
                    </th>
                    <th rowSpan="4">
                      <b> पाणीपुरवठ्याचे साधन</b>
                    </th>

                    <th colSpan={6}>
                      <h4 align="center" style={{}}>
                        <b>जलसिंचनासाठी</b>
                      </h4>
                    </th>
                    <th colSpan={2} rowSpan="1">
                      <b>माणसांना पिण्याचे पाणी पुरवण्यासाठी परंतु जल सिंचनासाठी नाही</b>
                    </th>
                    <th colSpan={2} rowSpan="1">
                      <b>
                        गुरे धुण्यासाठी व इतर कारणांसाठी परंतु जल सिंचनासाठी किंव्हा पिण्यासाठी नाही
                      </b>
                    </th>
                    <th colSpan={4}>
                      <b>वापरात नसलेले (स्थंभ ४,७ व ८ मध्ये नोंदवलेल्या खेरीज इतर)</b>
                    </th>
                  </tr>
                  <tr>
                    <th colSpan={3}>पक्के</th>
                    <th colSpan={3}>कच्चे</th>
                    <th rowSpan="2">पक्के</th>
                    <th rowSpan="2">कच्चे</th>
                    <th rowSpan="2">पक्के</th>
                    <th rowSpan="2">कच्चे</th>
                    <th colSpan={2} rowSpan="1">
                      नादुरुस्त झाल्यामुळे{' '}
                    </th>
                    <th colSpan={2} rowSpan="1">
                      इतर कारणांमुळे{' '}
                    </th>
                    {/* <th colSpan={1} rowSpan={2}>
                      <FormattedMessage id="villageForm1A.table.villageForest1" />
                      <br />
                      <FormattedMessage id="villageForm1A.table.villageForest12" />
                    </th>
                    <th colSpan={1} rowSpan={2}>
                      <FormattedMessage id="villageForm1A.table.protectedForest" />
                    </th>
                    <th colSpan={1} rowSpan={2}>
                      <FormattedMessage id="villageForm1A.table.reservedForest" />
                    </th> */}
                  </tr>
                  <tr>
                    <th colSpan={1} rowSpan={2}>
                      प्रत्यक्षात वापरात असलेले
                    </th>
                    <th colSpan={1} rowSpan={2}>
                      चालू स्थतीत असलेले परंतु वापरात नसलेले
                    </th>
                    <th colSpan={1} rowSpan={2}>
                      टाकलेले
                    </th>
                    <th colSpan={1} rowSpan={2}>
                      प्रत्यक्षात वापरात असलेले
                    </th>
                    <th colSpan={1} rowSpan={2}>
                      चालू स्थतीत असलेले परंतु वापरात नसलेले
                    </th>
                    <th colSpan={1} rowSpan={2}>
                      टाकलेले
                    </th>
                    <th colSpan={1} rowSpan={2}>
                      पक्के
                    </th>
                    <th colSpan={1} rowSpan={2}>
                      कच्चे
                    </th>
                    <th colSpan={1} rowSpan={2}>
                      पक्के
                    </th>
                    <th colSpan={1} rowSpan={2}>
                      कच्चे
                    </th>
                    {/*<th colSpan={1} rowSpan={2}>
                      <FormattedMessage id="villageForm1A.table.protectedForest" />
                    </th>
                    <th colSpan={1} rowSpan={2}>
                      <FormattedMessage id="villageForm1A.table.reservedForest" />
                    </th> */}
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
                    <td>15</td>
                    <td>16</td>
                  </tr>
                  <tr>
                    <td>
                      <b>अ)</b>
                    </td>
                    <td>
                      <b> सरकारी कालवे </b>
                    </td>
                    <td>{this.props.dataToMap?.govCanalPakkaInUse}</td>

                    <td>{this.props.dataToMap?.govCanalPakkaNotUse}</td>
                    <td>{this.props.dataToMap?.govCanalPakkaIsThrown}</td>
                    <td>{this.props.dataToMap?.govCanalKacchaInUse}</td>
                    <td>{this.props.dataToMap?.govCanalKacchaNotUse}</td>
                    <td>{this.props.dataToMap?.govCanalKacchaIsThrown}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>{this.props.dataToMap?.govCanalPakkaIsThrownUnRepaired}</td>
                    <td></td>
                    <td>{this.props.dataToMap?.govCanalPakkaIsThrownOtherReason}</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>
                      <b>ब)</b>
                    </td>
                    <td>
                      <b> खाजगी कालवे </b>
                    </td>
                    <td>{this.props.dataToMap?.privateCanalPakkaInUse}</td>

                    <td>{this.props.dataToMap?.privateCanalPakkaNotUse}</td>

                    <td>{this.props.dataToMap?.privateCanalPakkaIsThrown}</td>

                    <td>{this.props.dataToMap?.privateCanalKacchaInUse}</td>

                    <td>{this.props.dataToMap?.privateCanalKacchaNotUse}</td>

                    <td>{this.props.dataToMap?.privateCanalKacchaIsThrown}</td>

                    <td></td>

                    <td></td>

                    <td></td>

                    <td></td>

                    <td>{this.props.dataToMap?.privateCanalPakkaIsThrownUnRepaired}</td>
                    <td></td>
                    <td>{this.props.dataToMap?.privateCanalPakkaIsThrownOtherReason}</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>
                      <b>क)</b>
                    </td>
                    <td>
                      <b> तलाव व बंधारे </b>
                    </td>
                    <td>{this.props.dataToMap?.lakePakkaInUse}</td>

                    <td>{this.props.dataToMap?.lakePakkaNotUse}</td>

                    <td>{this.props.dataToMap?.lakePakkaIsThrown}</td>

                    <td>{this.props.dataToMap?.lakeKacchaInUse}</td>

                    <td>{this.props.dataToMap?.lakeKacchaNotUse}</td>

                    <td>{this.props.dataToMap?.lakeKacchaIsThrown}</td>

                    <td></td>

                    <td></td>

                    <td></td>

                    <td></td>

                    <td>{this.props.dataToMap?.lakePakkaIsThrownUnRepaired}</td>
                    <td></td>
                    <td>{this.props.dataToMap?.lakePakkaIsThrownOtherReason}</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>
                      <b>ड)</b>
                    </td>
                    <td>
                      <b>विहीर,बुडकी,इत्यादी </b>
                    </td>
                    <td>{this.props.dataToMap?.wellPakkaInUse}</td>

                    <td>{this.props.dataToMap?.wellPakkaNotUse}</td>

                    <td>{this.props.dataToMap?.wellPakkaIsThrown}</td>

                    <td>{this.props.dataToMap?.wellKacchaInUse}</td>

                    <td>{this.props.dataToMap?.wellKacchaNotUse}</td>

                    <td>{this.props.dataToMap?.wellKacchaIsThrown}</td>

                    <td></td>

                    <td></td>

                    <td></td>

                    <td></td>

                    <td>{this.props.dataToMap?.wellPakkaIsThrownUnRepaired}</td>
                    <td></td>
                    <td>{this.props.dataToMap?.wellPakkaIsThrownOtherReason}</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>
                      <b>ई)</b>
                    </td>
                    <td>
                      <b> इतर साधने,धेकुडी,(तेल,वाफ किंवा पवन शक्तीवर चालणारे) पंप</b>
                    </td>
                    <td>{this.props.dataToMap?.otherPakkaInUse}</td>

                    <td>{this.props.dataToMap?.otherPakkaNotUse}</td>

                    <td>{this.props.dataToMap?.otherPakkaIsThrown}</td>

                    <td>{this.props.dataToMap?.otherKacchaInUse}</td>

                    <td>{this.props.dataToMap?.otherKacchaNotUse}</td>

                    <td>{this.props.dataToMap?.otherKacchaIsThrown}</td>

                    <td></td>

                    <td></td>

                    <td></td>

                    <td></td>

                    <td>{this.props.dataToMap?.otherPakkaIsThrownUnRepaired}</td>
                    <td></td>
                    <td>{this.props.dataToMap?.otherPakkaIsThrownOtherReason}</td>
                    <td></td>
                  </tr>
                  {/*  {this.props.dataToMap &&
                    this.props.dataToMap.map((r) => (
                      <tr>
                        <td>{r.surveyNumber}</td>
                        <td>{r.forestNoIfAny}</td>
                        <td>{r.area}</td>
                        <td>{r.villageForest}</td>
                        <td>{r.protectedForest}</td>
                        <td>{r.reservedForest}</td>
                        <td>{r.rightsRecordedByTheForset}</td>
                        <td>{r.remarks}</td>
                      </tr>
                    ))} */}

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

                  {/*     <tr>
                    <td colSpan={2}>
                      <b>
                        <FormattedMessage id="formLanguage.form.total" />
                      </b>
                    </td>
                    <td>
                      <b>{this.props.totalVillageArea}</b>
                    </td>
                    <td>
                      <b>{this.props.totalVillageForest}</b>
                    </td>
                    <td>
                      <b>{this.props.totalProtectedForest}</b>
                    </td>
                    <td>
                      <b>{this.props.totalReservedForest}</b>
                    </td>
                    <td colSpan={2}></td>
                  </tr> */}
                </tbody>
              </table>
            </div>
            <table className={styles.report_table}></table>
          </Card>
        </div>
      </div>
    );
  }
}

export default VillageForm;
