import { PageContainer } from '@ant-design/pro-layout';
import styles from './report.module.css';
import React, { useState, useRef } from 'react';
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

function Report7B() {
  const { districtName, talukaName, districtCode, talukaCode } = useModel('details');
  const { sendRequest } = useAxios();
  const [codeVillage, setCodeVillage] = useState('');
  const [textForVillage, setTextForVillage] = useState();
  const [isNirank, setIsNirank] = useState(false);

  const [village, setVillage] = useState([]);
  const [tableData, setTableData] = useState();
  const [textVillage, setTextVillage] = useState('');
  const componentRef = useRef();
  const [revenueYear, setRevenueYear] = useState();
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const backToHomeButton = () => {
    history.push({ pathname: '/homepage' });
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const getTableData = async () => {
    // 203.129.224.92:5432/eChawdiV1/api/form7b/getForm7BData
    setLoading(true);

    sendRequest(
      `${URLS.BaseURL}/form7b/getForm7BReport?districtCode=${districtCode}&talukaCode=${talukaCode}&cCode=${codeVillage}`,
      'GET',
      null,
      (res) => {
        setTableData(
          res.data.form7BData.map((r, i) => ({
            srNo: i + 1,
            id: r.id,
            pin: r.hissaNo == null || r.hissaNo.trim() == '' ? r.pin : r.pin + '/' + r.hissaNo,
            hissaNo: r.hissaNo,
            khataNo: r.khataNo,
            year: r.year,
            fullName:
              r.fnamePersonInPossession +
              ' ' +
              r.mnamePersonInPossession +
              ' ' +
              r.lnamePersonInPossession,
            // designation: r.designation,
            possessionDate: r.possessionDate,
            remarks: r.remarks,
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
              {<FormattedMessage id="villageForm.form.villageForm7B" />}
            </h1>
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
      />
    </>
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
            <table id="table-to-xls" className={styles.report_table}>
              <thead>
                <tr>
                  <th colSpan="17">
                    <h3 style={{ color: 'red' }}>
                      <b>{<FormattedMessage id="villageForm.form.villageForm7B" />}</b>
                    </h3>
                  </th>
                </tr>

                <tr>
                  <th colSpan="17">
                    <h3 style={{ color: 'red' }}>
                      <b>{<FormattedMessage id="villageForm.form.registerReport" />}</b>
                    </h3>
                  </th>
                </tr>
                <tr>
                  <th colSpan="17">
                    <h3 style={{ color: 'red' }}>
                      <b>{<FormattedMessage id="villageForm.form.rule31Report" />}</b>
                    </h3>
                  </th>
                </tr>

                <tr>
                  <th colSpan="17">
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
                  <th colSpan={1} rowSpan={1}>
                    <b>{<FormattedMessage id="formLanguage.form.serialNo" />}</b>
                  </th>
                  <th rowSpan={1} colSpan={1}>
                    <b>{<FormattedMessage id="formLanguage.table.surveyNo" />}</b>
                  </th>
                  <th rowSpan={1} colSpan={1}>
                    {/* <b>Khata No</b> */}
                    <b>{<FormattedMessage id="villageForm.form.khataNo" />}</b>
                  </th>
                  <th rowSpan={1} colSpan={1}>
                    <b>{<FormattedMessage id="villageForm.form.year" />}</b>

                    {/* <b>year</b> */}
                  </th>
                  <th rowSpan={1} colSpan={1}>
                    <b>{<FormattedMessage id="villageForm.form.nameOfThePersonInPsn" />}</b>

                    {/* <b>Name of the person</b> */}
                  </th>
                  <th rowSpan={1} colSpan={1}>
                    <b>{<FormattedMessage id="villageForm.form.datecolom" />}</b>

                    {/* <b>Date</b> */}
                  </th>
                  <th rowSpan={1} colSpan={1}>
                    <FormattedMessage id="formLanguage.table.remark" />
                    <b></b>
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
                </tr>

                {this.props.dataToMap &&
                  this.props.dataToMap.map((r, i) => (
                    <tr>
                      <td>{r.srNo}</td>
                      <td>{r.pin}</td>
                      <td>{r.khataNo}</td>
                      <td>{r.year}</td>
                      <td>{r.fullName}</td>

                      <td>{r.possessionDate}</td>

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
              </tbody>
            </table>
          </Card>
        </div>
      </div>
    );
  }
}

export default Report7B;
