import styles from './report.module.css';
import React, { useState, useRef, useEffect } from 'react';
import { Button, Card, Col, message, Row, Select } from 'antd';
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

let prevNetCultiArea = 0,
  prevNaAreaH = 0,
  prevJuniSalami = 0,
  prevNetPending = 0;

function Report3Abstract() {
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

  const history = useHistory();

  const backToHomeButton = () => {
    history.push({ pathname: '/homepage' });
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  useEffect(() => {
    (prevNetCultiArea = 0), (prevNaAreaH = 0), (prevJuniSalami = 0), (prevNetPending = 0);
  }, []);

  const getTableData = async () => {
    (prevNetCultiArea = 0), (prevNaAreaH = 0), (prevJuniSalami = 0), (prevNetPending = 0);
    sendRequest(
      `${URLS.BaseURL}/form3/getForm3AbstractReport?districtCode=${districtCode}&talukaCode=${talukaCode}&cCode=${codeVillage}`,
      'GET',
      null,
      (res) => {
        setTableData(
          res.data.form3Data.map((r) => ({
            id: r.id,
            surveyNumber: r.pin,
            hissaNo: r.hissaNo,
            classes: r.classes,
            netCultiAreaH: r.netCultiAreaH,
            naAreaH: r.naAreaH,
            juniSalami: r.juniSalami,
            netPending: r.netPending,
            kindAndHowLongContinuable: r.kindAndHowLongContinuable,
            allTotal: getTotalAreaAssess(r.netCultiAreaH, r.naAreaH, r.juniSalami, r.netPending),
          })),
        );
      },
    );
  };

  var totalNetCultiAreaAddition = prevNetCultiArea
    .toFixed(4)
    .substring(prevNetCultiArea.length - 2);
  var totalNetCultiAreaOfAll = totalNetCultiAreaAddition
    .substring(0, totalNetCultiAreaAddition.length - 2)
    .concat('.')
    .concat(totalNetCultiAreaAddition.substring(totalNetCultiAreaAddition.length - 2));

  var totalNetNaAreaAddition = prevNaAreaH.toFixed(4).substring(prevNaAreaH.length - 2);
  var totalNetNaAreaOfAll = totalNetNaAreaAddition
    .substring(0, totalNetNaAreaAddition.length - 2)
    .concat('.')
    .concat(totalNetNaAreaAddition.substring(totalNetNaAreaAddition.length - 2));

  var totalJuniSalamiAddition = prevJuniSalami.toFixed(4).substring(prevJuniSalami.length - 2);
  var totalJuniSalamiOfAll = totalJuniSalamiAddition
    .substring(0, totalJuniSalamiAddition.length - 2)
    .concat('.')
    .concat(totalJuniSalamiAddition.substring(totalJuniSalamiAddition.length - 2));

  var totalNetPendingAddition = prevNetPending.toFixed(4).substring(prevNetPending.length - 2);
  var totalNetPendingOfAll = totalNetPendingAddition
    .substring(0, totalNetPendingAddition.length - 2)
    .concat('.')
    .concat(totalNetPendingAddition.substring(totalNetPendingAddition.length - 2));

  return (
    <div>
      <Card>
        <Row>
          <Col span={8}>
            <Button type="primary" onClick={handlePrint}>
              <FormattedMessage id="formLanguage.button.print" />
            </Button>
          </Col>
          <Col span={8}>
            <h1 style={{ textAlign: 'center' }}>
              <FormattedMessage id="villageForm3.form.headingAbstract" />
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
          </Col>
        </Row>
      </Card>
      <ComponentToPrint
        ref={componentRef}
        village={textForVillage}
        taluka={talukaName}
        district={districtName}
        dataToMap={tableData}
        netCultiArea={totalNetCultiAreaOfAll}
        netNaAreaH={totalNetNaAreaOfAll}
        netJuniSalami={totalJuniSalamiOfAll}
        netNetPending={totalNetPendingOfAll}
      />
    </div>
  );
}

function getTotalAreaAssess(netCultiAreaH, naAreaH, juniSalami, netPending) {
  prevNetCultiArea += parseFloat(netCultiAreaH);
  prevNaAreaH += parseFloat(naAreaH);

  prevJuniSalami += juniSalami == '' || juniSalami == null ? parseFloat(0) : parseFloat(juniSalami);
  prevNetPending += netPending == '' || netPending == null ? parseFloat(0) : parseFloat(netPending);
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
                  <th colSpan={14}>
                    <h3 style={{ color: 'red' }}>
                      <b>
                        <FormattedMessage id="villageForm3.form.villageTitle" />
                      </b>
                    </h3>
                  </th>
                </tr>
                <tr>
                  <th colSpan="14">
                    <h3 style={{ color: 'red' }}>
                      <b>
                        <FormattedMessage id="villageForm3.label.enamLand" />
                        <br />
                        गोषवारा
                      </b>
                    </h3>
                  </th>
                </tr>

                <tr>
                  <th colSpan="14">
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
                  <th colSpan={1} rowSpan={1}>
                    <b>इनाम वर्ग</b>
                  </th>
                  <th rowSpan={1} colSpan={1}>
                    <b>दुमाला प्रकार</b>
                  </th>
                  <th rowSpan={1} colSpan={1}>
                    <b>लागवडक्षम क्षेत्र</b>
                  </th>
                  <th rowSpan={1} colSpan={1}>
                    <b>अकृषिक वापराखालील क्षेत्र</b>
                  </th>
                  <th rowSpan={1} colSpan={1}>
                    <b>शासनाला येणे असलेली रक्कम </b>
                  </th>
                  <th rowSpan={1} colSpan={1}>
                    <b>दुमालादाराकडील शिल्लक</b>
                  </th>
                </tr>    
                <tr>
                  <td>1</td>
                  <td>2</td>
                  <td>3</td>
                  <td>4</td>
                  <td>5</td>
                  <td>6</td>
                </tr>
              </thead>
              <tbody>
            

                {this.props.dataToMap &&
                  this.props.dataToMap.map((r, i) => (
                    <tr>
                      <td>{r.classes}</td>
                      <td>{r.kindAndHowLongContinuable}</td>
                      <td>
                        {r.netCultiAreaH
                          .substring(0, r.netCultiAreaH.length - 2)
                          .concat('.')
                          .concat(r.netCultiAreaH.substring(r.netCultiAreaH.length - 2))}
                      </td>
                      <td>
                        {r.naAreaH
                          .substring(0, r.naAreaH.length - 2)
                          .concat('.')
                          .concat(r.naAreaH.substring(r.naAreaH.length - 2))}
                      </td>
                      <td>{r.juniSalami}</td>
                      <td>{r.netPending}</td>
                    </tr>
                  ))}
                <tr colSpan="6">
                  <td colSpan={2}>
                    <b>
                      <FormattedMessage id="formLanguage.form.total" />
                    </b>
                  </td>

                  <td>
                    <b>{this.props.netCultiArea}</b>
                  </td>
                  <td>
                    <b>{this.props.netNaAreaH}</b>
                  </td>
                  <td>
                    <b>{this.props.netJuniSalami}</b>
                  </td>
                  <td>
                    <b>{this.props.netNetPending}</b>
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

export default Report3Abstract;
