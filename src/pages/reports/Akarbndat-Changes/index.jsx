import { PageContainer } from '@ant-design/pro-layout';
import styles from './report.module.css';
import React, { useState, useRef } from 'react';
import { Button, Card, Col, message, Row, Select, Spin, Table } from 'antd';
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
import { log } from 'lodash-decorators/utils';

function AkarbandChanges() {
  const { districtName, talukaName, districtCode, talukaCode } = useModel('details');
  const { sendRequest } = useAxios();
  const [codeVillage, setCodeVillage] = useState('');
  const [textForVillage, setTextForVillage] = useState();
  const [village, setVillage] = useState([]);
  const [isNirank, setIsNirank] = useState(false);
  const [tableData, setTableData] = useState();
  const [textVillage, setTextVillage] = useState('');
  const componentRef = useRef();

  const [potkharabaType, setPotkharabaType] = useState('');
  const [revenueYear, setRevenueYear] = useState();
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const backToHomeButton = () => {
    history.push({ pathname: '/homepage' });
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const getTableData = async () => {
    setIsLoading(true);
    sendRequest(
      `${URLS.BaseURL}/form1/form1OdcDiff?districtCode=${districtCode}&talukaCode=${talukaCode}&cCode=${codeVillage}`,
      'GET',
      null,
      (res) => {
        console.log(res, '-----res----->');

        setTableData(
          res.data.map((r) => ({
            // if(r.form1TenureCode !== r.form7TenureCode && r.form1Totalarea !== r.form7Totalarea && r.form1PotType !== r.form7PotType && r.form1PotKharaba !== r.form7PotKharaba && r.form1NetCultiArea !== r.form7NetCultiArea && r.form1Assessment !== r.form7Assessment)
            // {

            // },

            surveyNumber: r.pin,
            totalAreaFlag:
              r.form1Totalarea === r.form7Totalarea ? (
                <a style={{ color: 'green' }}>नाही</a>
              ) : (
                <a style={{ color: 'red' }}>
                  होय{' '}
                  <button
                    type="button"
                    // class="ant-btn css-1ck3jst ant-btn-default ant-btn-dangerous"
                    style={{
                      border: '1px solid #8C92AC',
                      marginLeft: '5px',
                      height: '32px',
                      padding: '4px 15px',
                      backgroundColor: '#FFFFFF',
                      color: '#2E3138',
                      borderRadius: '3px',
                    }}
                  >
                    <span>{r.form1Totalarea}</span>
                  </button>
                  <button
                    type="button"
                    // class="ant-btn css-1ck3jst ant-btn-primary ant-btn-background-ghost"
                    style={{
                      border: '1px solid #FF8F00',
                      marginLeft: '5px',
                      height: '32px',
                      width: '80px',
                      padding: '4px 15px',
                      backgroundColor: '#FFFFFF',
                      color: '#2E3138',
                      borderRadius: '3px',
                    }}
                  >
                    <span>{r.form7Totalarea} </span>
                  </button>
                </a>
              ),
            potKharabaFlag:
              r.form1PotKharaba === r.form7PotKharaba ? (
                <a style={{ color: 'green' }}>नाही</a>
              ) : (
                <a style={{ color: 'red' }}>
                  होय
                  <button
                    type="button"
                    // class="ant-btn css-1ck3jst ant-btn-default ant-btn-dangerous"
                    style={{
                      border: '1px solid #8C92AC',
                      marginLeft: '5px',
                      height: '32px',
                      padding: '4px 15px',
                      backgroundColor: '#FFFFFF',

                      color: '#2E3138',
                      borderRadius: '3px',
                    }}
                  >
                    <span>{r.form1PotKharaba}</span>
                  </button>
                  <button
                    type="button"
                    style={{
                      border: '1px solid #FF8F00',
                      marginLeft: '5px',
                      height: '32px',
                      width: '80px',
                      padding: '4px 15px',
                      backgroundColor: '#FFFFFF',
                      color: '#2E3138',
                      borderRadius: '3px',
                    }}
                  >
                    <span>{r.form7PotKharaba} </span>
                  </button>
                </a>
              ),
            potKharabaTypeFlag:
              r.form1PotType === r.form7PotType ? (
                <a style={{ color: 'green' }}>नाही</a>
              ) : (
                <a style={{ color: 'red' }}>होय</a>
              ),
            // form7PotKharaba: r.form7PotKharaba,
            areaNetCultiAreaFlag:
              r.form1AreaNetCultiArea === r.form7AreaNetCultiArea ? (
                <a style={{ color: 'green' }}>नाही</a>
              ) : (
                <a style={{ color: 'red' }}>
                  होय
                  <button
                    type="button"
                    style={{
                      border: '1px solid #8C92AC',
                      marginLeft: '5px',
                      height: '32px',
                      padding: '4px 15px',
                      backgroundColor: '#FFFFFF',

                      color: '#2E3138',
                      borderRadius: '3px',
                    }}
                    // class="ant-btn css-1ck3jst ant-btn-default ant-btn-dangerous"
                  >
                    <span>{r.form1AreaNetCultiArea}</span>
                  </button>
                  <button
                    type="button"
                    style={{
                      border: '1px solid #FF8F00',
                      marginLeft: '5px',
                      height: '32px',
                      width: '80px',
                      padding: '4px 15px',
                      backgroundColor: '#FFFFFF',
                      color: '#2E3138',
                      borderRadius: '3px',
                    }}
                  >
                    <span>{r.form7AreaNetCultiArea} </span>
                  </button>
                </a>
              ),
            // form7AreaNetCultiArea: r.form7AreaNetCultiArea,
            AssessmentFlag:
              r.form1Assessment === r.form7Assessment ? (
                <a style={{ color: 'green' }}>नाही</a>
              ) : (
                <a style={{ color: 'red' }}>
                  होय
                  <button
                    type="button"
                    style={{
                      border: '1px solid #8C92AC',
                      marginLeft: '5px',
                      height: '32px',
                      padding: '4px 15px',
                      backgroundColor: '#FFFFFF',

                      color: '#2E3138',
                      borderRadius: '3px',
                    }}
                    // class="ant-btn css-1ck3jst ant-btn-default ant-btn-dangerous"
                  >
                    <span>{r.form1Assessment}</span>
                  </button>
                  <button
                    type="button"
                    style={{
                      border: '1px solid #FF8F00',
                      marginLeft: '5px',
                      height: '32px',
                      width: '80px',
                      padding: '4px 15px',
                      backgroundColor: '#FFFFFF',
                      color: '#2E3138',
                      borderRadius: '3px',
                    }}
                  >
                    <span>{r.form7Assessment} </span>
                  </button>
                </a>
              ),
            // form7Assessment: r.form7Assessment,
            tenureCodeFlag:
              r.form1TenureCode === r.form7TenureCode ? (
                <a style={{ color: 'green' }}>नाही</a>
              ) : (
                <a style={{ color: 'red' }}>
                  होय
                  <button
                    type="button"
                    // class="ant-btn css-1ck3jst ant-btn-default ant-btn-dangerous"
                    style={{
                      border: '1px solid #8C92AC',
                      marginLeft: '5px',
                      height: '32px',
                      width: '50px',
                      padding: '4px 15px',
                      backgroundColor: '#FFFFFF',
                      //borderColor: ' ',
                      color: '#2E3138',
                      borderRadius: '3px',
                    }}
                  >
                    <span>{r.form1TenureCode}</span>
                  </button>
                  <button
                    // style={{ marginLeft: '5px', height: '32px', width: '50px', color: '#2E3138' }}
                    type="button"
                    // class="ant-btn css-1ck3jst ant-btn-primary ant-btn-background-ghost"
                    style={{
                      border: '1px solid #FF8F00',
                      marginLeft: '5px',
                      height: '32px',
                      width: '50px',
                      padding: '4px 15px',
                      backgroundColor: '#FFFFFF',
                      color: '#2E3138',
                      borderRadius: '3px',
                    }}
                  >
                    <span>{r.form7TenureCode} </span>
                  </button>
                </a>
              ),
            // form7TenureCode: r.form7TenureCode,
            netCultiAreaFlag:
              r.form1NetCultiArea === r.form7NetCultiArea ? (
                <a style={{ color: 'green' }}>नाही</a>
              ) : (
                <a style={{ color: 'red' }}>
                  होय
                  <button
                    type="button"
                    style={{
                      border: '1px solid #8C92AC',
                      height: '32px',
                      marginLeft: '5px',
                      padding: '4px 15px',
                      backgroundColor: '#FFFFFF',

                      color: '#CC0000',
                      borderRadius: '3px',
                    }}
                    // class="ant-btn css-1ck3jst ant-btn-default ant-btn-dangerous"
                  >
                    <span>{r.form1NetCultiArea}</span>
                  </button>
                  <button
                    type="button"
                    // class="ant-btn css-1ck3jst ant-btn-primary ant-btn-background-ghost"
                    style={{
                      border: '1px solid #FF8F00',
                      marginLeft: '5px',
                      height: '32px',
                      width: '80px',
                      padding: '4px 15px',
                      backgroundColor: '#FFFFFF',
                      color: '#2E3138',
                      borderRadius: '3px',
                    }}
                  >
                    <span>{r.form7NetCultiArea} </span>
                  </button>
                </a>
              ),
            //  form7NetCultiArea: r.form7NetCultiArea,
            //}
          })),
        );
        setIsLoading(false);
      },
    );
  };

  return (
    <div>
      <Card>
        <h1 style={{ textAlign: 'center' }}>दुरुस्तीसाठी पडताळणी तक्ता </h1>
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
          <Spin size="large" style={{ marginLeft: '530px', marginTop: '20px' }}></Spin>
        ) : null}
        {/* </Row> */}
      </Card>
      <ComponentToPrint
        ref={componentRef}
        village={textForVillage}
        taluka={talukaName}
        district={districtName}
        dataToMap={tableData}
      />
    </div>
  );
}

class ComponentToPrint extends React.Component {
  render() {
    return (
      <div style={{ padding: '13px' }}>
        <div className="report">
          <Card style={{ height: '500px', overflowY: 'auto' }}>
            <ReactHtmlTableToExcel
              id="test-table-xls-button"
              className="download-table-xls-button"
              table="table-to-xls"
              filename="Reportxls"
              sheet="tablexls"
              buttonText="Download as XLS"
              style={{ position: 'sticky! important', top: '0' }}
            />

            <table id="table-to-xls" className={styles.report_table}>
              <thead>
                <tr style={{ backgroundColor: 'white', border: '1px solid black' }}>
                  <th colSpan="7" style={{ backgroundColor: '#add8e6', width: '100%' }}>
                    <h3 style={{ color: 'red' }}>
                      <b>गाव नमुना एक( दुरुस्तीसाठी पडताळणी तक्ता )</b>
                    </h3>
                  </th>
                </tr>

                <tr style={{ backgroundColor: 'white', border: '1px solid black' }}>
                  <th colSpan="7" style={{ backgroundColor: '#add8e6', width: '100%' }}>
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

                <tr style={{ backgroundColor: '#add8e6', border: '1px solid black' }}>
                  <th>
                    <FormattedMessage id="villageReport1.table.surveyNo" />
                  </th>
                  <th>
                    धारणा प्रकार <span style={{ color: '#8C92AC' }}>(ODC फरक)</span>{' '}
                    <span style={{ color: '#FF8F00' }}>(Live फरक)</span>
                  </th>
                  <th>
                    एकूण क्षेत्र<span style={{ color: '#8C92AC' }}>(ODC फरक)</span>{' '}
                    <span style={{ color: '#FF8F00' }}>(Live फरक)</span>
                  </th>
                  <th>पोट खराब क्षेत्रातील फरक </th>
                  <th>
                    पोट खराब क्षेत्र<span style={{ color: '#8C92AC' }}>(ODC फरक)</span>{' '}
                    <span style={{ color: '#FF8F00' }}>(Live फरक)</span>
                  </th>
                  <th>
                    निव्वळ लागवड योग्य क्षेत्र <span style={{ color: '#8C92AC' }}>(ODC फरक)</span>{' '}
                    <span style={{ color: '#FF8F00' }}>(Live फरक)</span>
                  </th>
                  <th>
                    कृषिक आकारणीतील फरक <span style={{ color: '#8C92AC' }}>(ODC फरक)</span>{' '}
                    <span style={{ color: '#FF8F00' }}>(Live फरक)</span>
                  </th>
                </tr>

                <tr style={{ backgroundColor: '#add8e6', border: '1px solid black' }}>
                  <th>1</th>
                  <th>2</th>
                  <th>3</th>
                  <th>4</th>
                  <th>5</th>
                  <th>6</th>
                  <th>7</th>
                </tr>
              </thead>
              <tbody>
                {this.props.dataToMap &&
                  this.props.dataToMap.map((r) => (
                    <tr>
                      <td>{r.surveyNumber}</td>
                      <td>{r.tenureCodeFlag}</td>
                      <td>{r.totalAreaFlag}</td>
                      <td>{r.potKharabaTypeFlag}</td>
                      <td>{r.potKharabaFlag}</td>
                      <td>{r.netCultiAreaFlag}</td>
                      <td>{r.AssessmentFlag}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </Card>
        </div>
      </div>
    );
  }
}

export default AkarbandChanges;
