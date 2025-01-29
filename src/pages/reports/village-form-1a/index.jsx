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

let preVillageTotalArea = 0;
let prevVillageForest = 0;
let prevProtectedForest = 0;
let prevReservedForest = 0;

function Report() {
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

  useEffect(() => {
    preVillageTotalArea = 0;
    prevVillageForest = 0;
    prevProtectedForest = 0;
    prevReservedForest = 0;
  }, []);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const getVillageForm1AData = async () => {
    preVillageTotalArea = 0;

    prevVillageForest = 0;
    prevProtectedForest = 0;
    prevReservedForest = 0;
    setLoading(true);

    sendRequest(
      `${URLS.BaseURL}/form1a/getForm1AReport?districtCode=${districtCode}&talukaCode=${talukaCode}&cCode=${codeVillage}`,
      'GET',
      null,
      (res) => {
        res.data.form1AData.map((r) => {
          setTotalArea((prevTotalArea) => prevTotalArea + parseFloat(r.area));
        });
        // console.log('Full res for form1AData', res);
        setTableData(
          res.data.form1AData.map((r) => ({
            hissaNo: r.hissaNo,
            surveyNumber:
              r.hissaNo == null || r.hissaNo.trim() == '' ? r.pin : r.pin + '/' + r.hissaNo,
            area: r.area,
            typeOfLand: r.typeOfLand != '' ? <FormattedMessage id={r.typeOfLand} /> : '',
            remarks: r.remarks,
            // whetherVillageOrProtectedOrReservedForest: (
            //   <FormattedMessage id={r.whetherVillageOrProtectedOrReservedForest} />
            // ),
            area: r.area,
            forestNoIfAny: r.forestNoIfAny,
            protectedForest: r.protectedForest,
            reservedForest: r.reservedForest,
            villageForest: r.villageForest,
            rightsRecordedByTheForset: r.rightsRecordedByTheForestOfficer,
            allTotal: getTotalAreaAssess(
              r.area,
              r.villageForest,
              r.protectedForest,
              r.reservedForest,
            ),
          })),
        );
        message.success('Records Fetched!!');
        setLoading(false);
      },
      (err) => {
        message.error('Reports Details Not Found');

        setLoading(false);
      },
    );
  };

  var totalVillageAreaAddition = preVillageTotalArea
    .toFixed(4)
    .substring(preVillageTotalArea.length - 2);
  var totalVillageAreaOfAll = totalVillageAreaAddition
    .substring(0, totalVillageAreaAddition.length - 2)
    .concat('.')
    .concat(totalVillageAreaAddition.substring(totalVillageAreaAddition.length - 2));

  var totalVillageForestAddition = prevVillageForest
    .toFixed(4)
    .substring(prevVillageForest.length - 2);
  var totalVillageForestAreaOfAll = totalVillageForestAddition
    .substring(0, totalVillageForestAddition.length - 2)
    .concat('.')
    .concat(totalVillageForestAddition.substring(totalVillageForestAddition.length - 2));

  var totalProtectedForestAddition = prevProtectedForest
    .toFixed(4)
    .substring(prevProtectedForest.length - 2);
  var totalProtectedForestAreaOfAll = totalProtectedForestAddition
    .substring(0, totalProtectedForestAddition.length - 2)
    .concat('.')
    .concat(totalProtectedForestAddition.substring(totalProtectedForestAddition.length - 2));

  var totalReservedForestAddition = prevReservedForest
    .toFixed(4)
    .substring(prevReservedForest.length - 2);
  var totalReservedForestAreaOfAll = totalReservedForestAddition
    .substring(0, totalReservedForestAddition.length - 2)
    .concat('.')
    .concat(totalReservedForestAddition.substring(totalReservedForestAddition.length - 2));

  return (
    <div>
      <Card>
        <h1 style={{ textAlign: 'center' }}>
          <FormattedMessage id="villageForm1A.table.villageForm1A" />
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
                  getVillageForm1AData();
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
        totalVillageArea={totalVillageAreaOfAll}
        totalVillageForest={totalVillageForestAreaOfAll}
        totalProtectedForest={totalProtectedForestAreaOfAll}
        totalReservedForest={totalReservedForestAreaOfAll}
      />
    </div>
  );
}

function getTotalAreaAssess(area, villageForest, protectedForest, reservedForest) {
  preVillageTotalArea += parseFloat(area ? area : '0');
  prevVillageForest += parseFloat(villageForest ? villageForest : '0');
  prevProtectedForest += parseFloat(protectedForest ? protectedForest : '0');
  prevReservedForest += parseFloat(reservedForest ? reservedForest : '0');
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
                    <th colSpan="11">
                      <h3 style={{ color: 'red' }}>
                        <b>
                          <FormattedMessage id="villageForm1A.table.villageForm1A" />
                        </b>
                      </h3>
                    </th>
                  </tr>
                  <tr>
                    <th colSpan="11">
                      <h3 style={{ color: 'red' }}>
                        <b>
                          <FormattedMessage id="villageReport1A.label.landRegister" />
                        </b>
                      </h3>
                    </th>
                  </tr>
                  <tr>
                    <th colSpan="11">
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
                      <b>
                        <FormattedMessage id="villageReport1A.table.surveyNo" />
                      </b>
                    </th>

                    <th colSpan={5}>
                      <h4 align="center" style={{}}>
                        <b>
                          <FormattedMessage id="villageReport1A.table.forestLand" />
                        </b>
                      </h4>
                    </th>
                    <th rowSpan="4">
                      <b>
                        <FormattedMessage id="villageReport1A.table.settleOfficer" />
                      </b>
                    </th>
                    <th rowSpan="4">
                      <b>
                        <FormattedMessage id="villageReport1A.table.remark" />
                      </b>
                    </th>
                  </tr>
                  <tr>
                    <th colSpan={1} rowSpan={2}>
                      <FormattedMessage id="villageForm1A.table.noIfAny" />
                    </th>
                    <th colSpan={1} rowSpan={2}>
                      <FormattedMessage id="villageForm1A.table.area" />
                    </th>
                    <th colSpan={1} rowSpan={2}>
                      <FormattedMessage id="villageForm1A.table.villageForest1" />
                      <br />
                      <FormattedMessage id="villageForm1A.table.villageForest12" />
                    </th>
                    <th colSpan={1} rowSpan={2}>
                      <FormattedMessage id="villageForm1A.table.protectedForest" />
                    </th>
                    <th colSpan={1} rowSpan={2}>
                      <FormattedMessage id="villageForm1A.table.reservedForest" />
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
                  </tr>
                  {this.props.dataToMap &&
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
                  </tr>
                </tbody>
              </table>
            </div>
            <table className={styles.report_table}>
              <tfoot>
                <tr style={{ marginTop: 100 }}>
                  <td colSpan={2} style={{ width: '30px' }}></td>
                  <td colSpan={2}></td>
                  <td colSpan={2} style={{ width: '20px' }}></td>
                  <td colSpan={2}>
                    <h5 style={{ fontSize: '15px' }}>
                      <FormattedMessage id="villageReport1A.table.examined" />
                    </h5>
                  </td>
                  <td colSpan={2}></td>
                  <td colSpan={2}>
                    <h5 style={{ fontSize: '15px' }}>
                      <FormattedMessage id="villageReport1A.table.examined" />
                    </h5>
                  </td>
                  <td colSpan={2}></td>
                </tr>
                <tr style={{ marginTop: 10 }}>
                  <td colSpan={2}></td>
                  <td colSpan={2}>
                    <h5 style={{ fontSize: '15px' }}>
                      <FormattedMessage id="villageReport1A.table.date" />
                    </h5>
                  </td>
                  <td colSpan={2}></td>
                  <td colSpan={2}>
                    <h5 style={{ fontSize: '15px' }}>
                      <FormattedMessage id="villageReport1A.table.date" />
                    </h5>
                  </td>
                  <td colSpan={2}></td>
                  <td colSpan={2}>
                    <h5 style={{ fontSize: '15px' }}>
                      <FormattedMessage id="villageReport1A.table.date" />
                    </h5>
                  </td>
                  <td colSpan={2}></td>
                </tr>
                <tr style={{ marginTop: 20 }}>
                  <td colSpan={2}></td>
                  <td colSpan={2}>
                    <h5 style={{ fontSize: '15px' }}>
                      <FormattedMessage id="villageReport1A.table.sign" />
                    </h5>
                  </td>
                  <td colSpan={2}></td>
                  <td colSpan={2}>
                    <h5 style={{ fontSize: '15px' }}>
                      <FormattedMessage id="villageReport1A.table.sign" />
                    </h5>
                  </td>
                  <td colSpan={2}></td>
                  <td colSpan={2}>
                    <h5 style={{ fontSize: '15px' }}>
                      <FormattedMessage id="villageReport1A.table.sign" />
                    </h5>
                  </td>
                  <td colSpan={2}></td>
                </tr>
                <tr style={{ marginTop: 20 }}>
                  <td colSpan={2}></td>
                  <td colSpan={2}>
                    <h5 style={{ fontSize: '15px' }}>
                      <FormattedMessage id="villageReport1A.table.talathi" />
                    </h5>
                  </td>
                  <td colSpan={2}></td>
                  <td colSpan={2}>
                    <h5 style={{ fontSize: '15px' }}>
                      <FormattedMessage id="villageReport1A.table.clerk" />
                    </h5>
                  </td>
                  <td colSpan={2}></td>
                  <td colSpan={2}>
                    <h4 style={{ fontSize: '15px' }}>
                      <FormattedMessage id="villageReport1A.table.tahsildar" />
                    </h4>
                  </td>
                  <td colSpan={2}></td>
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
