import VillageSelector from '@/components/eComponents/VillageSelector';
import { Button, Card, Col, message, Row, Select, Spin, Form } from 'antd';

import styles from './ReceiptReportPrint.module.css';
import React, { useRef, useState } from 'react';
import { useHistory, useModel, FormattedMessage } from 'umi';
import { useReactToPrint } from 'react-to-print';
import URLS from '@/URLs/urls';
import useAxios from '@/components/eComponents/use-axios';
import ReactHtmlTableToExcel from 'react-html-table-to-excel';
import { useEffect } from 'react';

function EducationalCess() {
  const [codeVillage, setCodeVillage] = useState('');
  const [textForVillage, setTextForVillage] = useState();
  const [village, setVillage] = useState([]);
  const [tableData, setTableData] = useState();
  const [revenueYear, setRevenueYear] = useState('2025-26');
  const [isNirank, setIsNirank] = useState(false);
  const componentRef = useRef();
  const { sendRequest } = useAxios();
  const { districtName, talukaName, districtCode, talukaCode } = useModel('details');
  const [loading, setLoading] = useState(false);
  const [revenueYearForVillage, setRevenueYearForVillage] = useState();

  const history = useHistory();

  useEffect(() => {
    getRevenueYear();
  }, []);

  const backToHomeButton = () => {
    history.push({ pathname: '/homepage' });
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const onYearChange = (value, event) => {
    setRevenueYear(value);
  };

  const getRevenueYear = async () => {
    sendRequest(`${URLS.BaseURL}/revenueYear/getRevenueYearData`, 'GET', null, (res) => {
      // var data = res.data?.revenueYearData?.slice(0, 2);
      var data = res.data?.revenueYearData;
      setRevenueYearForVillage(
        // res.data.revenueYearData.map((row) => ({
        data.map((row) => ({
          label: row.revenueYear,
          value: row.revenueYear,
        })),
      );
      // message.success('Records Fetched!!');
    });
  };

  const getTableData = async () => {
    setLoading(true);

    sendRequest(
      // `${URLS.BaseURL}/reports/landRevenueForm8B?cCode=${codeVillage}&revenueYear=${revenueYear}&districtCode=${districtCode}&talukaCode=${talukaCode}`,
      //---8 Jan 2024
      `${URLS.BaseURL}/reports/getEduCessTax?districtCode=${districtCode}&talukaCode=${talukaCode}&cCode=${codeVillage}&revenueYear=${revenueYear}`,
      // revenueYear == '2023-24'
      //   ? `${URLS.BaseURL}/reports/landRevenueForm8BViewPre?cCode=${codeVillage}&revenueYear=${revenueYear}&districtCode=${districtCode}&talukaCode=${talukaCode}`
      //   : `${URLS.BaseURL}/reports/landRevenueForm8BView?cCode=${codeVillage}&revenueYear=${revenueYear}&districtCode=${districtCode}&talukaCode=${talukaCode}`,

      'GET',
      null,
      (res) => {
        console.log(res.data.landRevenueDemandData, '----------------res');

        setTableData(
          res.data.landRevenueDemandData.map((r, i) => ({
            srNo: i + 1,
            id: r.id,
            khataNo: r.khataNo,
            khataOwnerName: r.khataOwnerName,
            surveyHissaNo: r.surveyHissaNo,
            seasonCode: r.seasonCode,
            educationalCess: r.educationalCess,
            addlEducationalCess: r.addlEducationalCess,
            employeeGuaranteeScheme: r.employeeGuaranteeScheme,
            area: r.area,
            remarks: r.remarks,
          })),
          // message.success('Records Fetched!!'),
        );
        setLoading(false);
      },
      (err) => {
        message.error('Report Details Not Found');

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
              <FormattedMessage id="formLanguage.button.print" />
            </Button>
          </Col>
          <Col span={8}>
            <h1 style={{ textAlign: 'center' }}>
              {/* <FormattedMessage id="EducationalCess.form.EducationalCess" /> */}
              रोजगार हमी कर अहवाल
            </h1>
          </Col>
          <Col span={8}>
            <Button style={{ float: 'right' }} onClick={backToHomeButton} type="primary">
              <FormattedMessage id="formLanguage.form.backhomeButton" />
            </Button>
          </Col>
        </Row>
        <Row style={{ marginBottom: 10 }}>
          <Col span={16}>
            <VillageSelector
              pageType="withoutYear"
              setCodeVillage={setCodeVillage}
              setTextForVillage={setTextForVillage}
              onVillageChange={(setVillage, setTableData)}
              yearChange={setRevenueYear}
              setIsNirank={setIsNirank}
            />
          </Col>
          <Col xl={3} lg={3} md={24} sm={24} xs={24}>
            <Form.Item
              style={{ marginTop: 10, marginLeft: -440 }}
              labelCol={{ lg: 12 }}
              wrapperCol={{ lg: 12 }}
              label={<FormattedMessage id="villageSelector.label.revenueYear" />}
            >
              <Select
                // style={{ width: 200, marginRight: '15px' }}
                options={revenueYearForVillage}
                style={{ width: 142 }}
                value={revenueYear}
                placeholder={'महसूल वर्ष'}
                onChange={(value, event) => onYearChange(value, event)}
                // disabled
              ></Select>
            </Form.Item>
          </Col>
          <Col xl={2} lg={2} md={2} sm={4} xs={4}>
            <Button
              /* onClick={getTableData} */ onClick={() => {
                if (textForVillage) {
                  getTableData();
                } else if (textForVillage == null) {
                  message.info('Please Select Village');
                }
              }}
              type="primary"
              style={{ marginTop: 10 }}
            >
              <FormattedMessage id="formLanguage.form.getData" />
            </Button>
          </Col>

          {loading === true ? (
            <Spin size="large" style={{ marginLeft: '540px', marginTop: '20px' }} />
          ) : null}
        </Row>
      </Card>
      <ComponentToPrint
        ref={componentRef}
        village={textForVillage}
        taluka={talukaName}
        district={districtName}
        dataToMap={tableData}
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
                  <th colSpan="11">
                    <h3 style={{ color: 'red' }}>
                      <b>
                        <FormattedMessage id="RojgarlaguRojgarHami.form.RojgarlaguRojgarHami" />
                        {/* रोजगार हमी कर अहवाल */}
                      </b>
                    </h3>
                  </th>
                </tr>
                <tr>
                  <th colSpan="11">
                    <h3 style={{ color: 'red' }}>
                      <b>
                        <b>
                          <FormattedMessage id="RojgarlaguRojgarHami.form.departmentNm" />
                        </b>

                        {/* शासकीय जमिनींवरील अतिक्रमणांची नोंद */}
                      </b>
                    </h3>
                  </th>
                </tr>

                <tr>
                  <th colSpan="11">
                    <h4 style={{ color: 'red' }}>
                      <pre>
                        {' '}
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

                <tr>
                  <th>
                    <b>
                      <FormattedMessage id="RojgarlaguRojgarHami.form.serialNo" />
                    </b>
                  </th>
                  <th>
                    <b>
                      <FormattedMessage id="RojgarlaguRojgarHami.form.khatedarName" />
                    </b>
                  </th>
                  <th>
                    <b>
                      <FormattedMessage id="RojgarlaguRojgarHami.form.khataNo" />
                    </b>
                  </th>
                  <th>
                    <b>
                      <FormattedMessage id="RojgarlaguRojgarHami.form.gatNumber" />
                    </b>
                  </th>
                  <th>
                    <b>
                      <FormattedMessage id="RojgarlaguRojgarHami.form.hangam" />
                    </b>
                  </th>
                  <th>
                    <b>
                      <FormattedMessage id="RojgarlaguRojgarHami.form.Areaunderirrigation" />
                    </b>
                  </th>
                  <th>
                    <b>
                      <FormattedMessage id="RojgarlaguRojgarHami.form.minusAreaunderirrigation" />
                    </b>
                  </th>
                  <th>
                    <b>
                      <FormattedMessage id="RojgarlaguRojgarHami.form.totalapplicable" />
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
                </tr>
              </thead>
              <tbody>
              {console.log(this.props, '---------component clggggg--------')}

                {this.props.dataToMap &&
                  this.props.dataToMap.map((r) => (
                    <tr>
                      <td>{r.srNo}</td>
                      <td>{r.khataOwnerName}</td>
                      <td>{r.khataNo}</td>
                      <td>0</td>
                      <td>{r.seasonCode}</td>
                      <td>0</td>
                      <td>0</td>
                      <td>0</td>
                    </tr>
                  ))}

                <tr>
                  <td colSpan={3}>
                    <b>
                      <FormattedMessage id="formLanguage.form.total" />
                    </b>
                  </td>
                  <td>
                    <b>{this.props.totalArea}</b>
                  </td>
                  <td>
                    <b>{this.props.netEnchroachedArea}</b>
                  </td>
                  <td colSpan={6}></td>
                </tr>
              </tbody>
            </table>
          </Card>
        </div>
      </div>
    );
  }
}
export default EducationalCess;
