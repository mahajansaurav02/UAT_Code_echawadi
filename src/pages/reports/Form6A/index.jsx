import VillageSelector from '@/components/eComponents/VillageSelector';
import { Button, Card, Col, message, Row, Spin } from 'antd';
import React, { useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { FormattedMessage } from 'umi';
import { useModel } from 'umi';
import useAxios from '@/components/eComponents/use-axios';
import styles from './report.module.css';
import URLS from '@/URLs/urls';
import { useHistory, useLocation } from 'react-router-dom';
import ReactHtmlTableToExcel from 'react-html-table-to-excel';

function Report6A() {
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
    setLoading(true);

    sendRequest(
      `${URLS.BaseURL}/reports/getForm6AReport?districtCode=${districtCode}&talukaCode=${talukaCode}&cCode=${codeVillage}`,
      'GET',
      null,
      (res) => {
        setTableData(
          res.data.form1Data.map((r) => ({
            id: r.id,
            mutNo: r.mutNo,
            objectionDate: r.objectionDate,
            objectionRemark: r.objectionRemark,
            firstName: r.firstName,
            middelName: r.middelName,
            lastName: r.lastName,
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
              <FormattedMessage id="villageReport6A.label.villageForm6" />
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
                      <b>
                        <FormattedMessage id="villageReport6A.label.villageForm6" />
                      </b>
                    </h3>
                  </th>
                </tr>

                <tr>
                  <th colSpan="17">
                    <h3 style={{ color: 'red' }}>
                      <b>विवादग्रस्त प्रकरणांची नोंदवही</b>
                    </h3>
                  </th>
                </tr>
                <tr>
                  <th colSpan="17">
                    <h4 style={{ color: 'red' }}>
                      <pre>
                        <b>
                          {<FormattedMessage id="villageForm.form.village" />}-{this.props.village}{' '}
                          {<FormattedMessage id="villageForm.form.taluka" />}-{this.props.taluka}{' '}
                          {<FormattedMessage id="villageForm.form.distrcit" />}-{' '}
                          {this.props.district}
                        </b>
                      </pre>
                    </h4>
                  </th>
                </tr>
                <tr>
                  <th colSpan={1} rowSpan={1}>
                    <b>अनुक्रमांक</b>
                  </th>
                  <th rowSpan={1} colSpan={1}>
                    {/* <b>भूमापन क्रमांक</b> */}
                    <b>फेरफारांच्या नोंदवहीतील अनुक्रमांक किंवा अधिकार अभिलेखाची कच्ची प्रत</b>
                  </th>
                  <th rowSpan={1} colSpan={1}>
                    <b>भूमापन क्रमांक आणि उपविभाग क्रमांक</b>
                  </th>
                  <th rowSpan={1} colSpan={1}>
                    {/* <b>हरकत प्राप्त झालेचा दिनांक </b> */}
                    <b>हरकत मिळाल्याचा दिनांक</b>
                  </th>
                  <th rowSpan={1} colSpan={1}>
                    {/* <b>विवाद करणाऱ्या पक्षकारांच्या विवादाचा तपशील</b> */}
                    <b>विवाद करणाऱ्या पक्षकारांच्या नावासह विवादाचा तपशील</b>
                  </th>
                  <th rowSpan={1} colSpan={1}>
                    {/* <b>अधिकाऱ्याचा थोडक्यात तपशील</b> */}
                    <b>अधिकाऱ्याचा निर्णय</b>
                  </th>
                </tr>
                <tr>
                  <td>1</td>
                  <td>2</td>
                  <td>3</td>
                  <td>4</td>
                  <td>5</td>
                  <td>6</td>
                  {/* <td>7</td> */}
                </tr>
                {/* <tr>
                  <th colSpan={1} rowSpan={1}>
                    <b>अ.क्र</b>
                  </th>
                  <th rowSpan={1} colSpan={1}>
                    <b>फेरफार क्र</b>
                  </th>
                  <th rowSpan={1} colSpan={1}>
                    <b>भूमापन क्रमांक</b>
                  </th>
                  <th rowSpan={1} colSpan={1}>
                    <b>हरकत प्राप्त झालेचा दिनांक </b>
                  </th>
                  <th rowSpan={1} colSpan={1}>
                    <b>विवाद करणाऱ्या पक्षकाराचे नाव</b>
                  </th>
                  <th rowSpan={1} colSpan={1}>
                    <b>विवाद करणाऱ्या पक्षकारांच्या विवादाचा तपशील</b>
                  </th>
                  <th rowSpan={1} colSpan={1}>
                    <b>अधिकाऱ्याचा थोडक्यात तपशील</b>
                  </th>
                </tr> */}
              </thead>
              <tbody>
              
                {this.props.dataToMap &&
                  this.props.dataToMap.map((r, i) => (
                    <tr>
                    <td>{i + 1}</td>
                    <td>{r.mutNo}</td>
                    <td></td>
                    <td>{r.objectionDate}</td>
                    <td>
                      {r.firstName} {r.middelName} {r.lastName}
                    </td>
                    <td>{r.objectionRemark}</td>
                    <td></td>
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
export default Report6A;
