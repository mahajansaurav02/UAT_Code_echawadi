import VillageSelector from '@/components/eComponents/VillageSelector';
import { Alert, Button, Card, Col, message, Row, Spin, Form, Select } from 'antd';
import { FormattedMessage, useModel } from 'umi';
import { useHistory, useLocation } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import styles from './report.module.css';
import useAxios from '@/components/eComponents/use-axios';
import URLS from '@/URLs/urls';
import React, { useRef, useState } from 'react';
import ReactHtmlTableToExcel from 'react-html-table-to-excel';
import moment from 'moment';
import { useEffect } from 'react';

function Report8D() {
  const { districtName, talukaName, servarthId, districtCode, talukaCode } = useModel('details');

  const { sendRequest } = useAxios();
  const [codeVillage, setCodeVillage] = useState('');
  const [textForVillage, setTextForVillage] = useState();
  const [village, setVillage] = useState([]);
  const [isNirank, setIsNirank] = useState(false);
  const [tableData, setTableData] = useState();
  const [textVillage, setTextVillage] = useState('');
  const componentRef = useRef();
  const [revenueYear, setRevenueYear] = useState();
  const [loading, setLoading] = useState(false);
  const [revenueYearForVillage, setRevenueYearForVillage] = useState();

  const history = useHistory();

  useEffect(() => {
    getRevenueYear();
  }, []);

  const onYearChange = (value, event) => {
    setRevenueYear(value);
    setTableData();
  };

  const getRevenueYear = async () => {
    sendRequest(`${URLS.BaseURL}/revenueYear/getRevenueYearData`, 'GET', null, (res) => {
      setRevenueYearForVillage(
        res.data.revenueYearData.map((row) => ({
          label: row.revenueYear,
          value: row.revenueYear,
        })),
      );
      // message.success('Records Fetched!!');
    });
  };

  const backToHomeButton = () => {
    history.push({ pathname: '/homepage' });
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const getTableData = async () => {
    setLoading(true);

    sendRequest(
      `${URLS.BaseURL}/reports/getForm8DReport?cCode=${codeVillage}&revenueYear=${revenueYear}&districtCode=${districtCode}&talukaCode=${talukaCode}`,
      'GET',
      null,
      (res) => {
        setTableData(
          res.data.landRevenueDemandData.map((r) => ({
            receiptDateForReport: moment(r.receiptDateForReport, 'YYYY-MM-DD  h:mm:ss a').format(
              'YYYY-MM-DD  h:mm:ss a',
            ),
            challanDateForReport:
              r.challanDateForReport != ''
                ? moment(r.challanDateForReport, 'YYYY-MM-DD  h:mm:ss a').format(
                    'YYYY-MM-DD  h:mm:ss a',
                  )
                : '',
            receiptNo: r.receiptNo,
            challanNo: r.challanNo,
            challanNo0045: r.challanNo0045,
            status: r.status,
            netAmount: r.netAmount,
            challanAmount: r.status == 'Deposited' ? r.netAmount : '',
            // totalAmount: r.totalAmount,
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
              <FormattedMessage id="formLanguage.button.print" />
            </Button>
          </Col>
          <Col span={8}>
            <h1 style={{ textAlign: 'center' }}>
              <FormattedMessage id="villageReport8d.formName" />
            </h1>
          </Col>
          <Col span={8}>
            <Button style={{ float: 'right' }} onClick={backToHomeButton} type="primary">
              <FormattedMessage id="formLanguage.form.backhomeButton" />
            </Button>
          </Col>
        </Row>
        <Row style={{ marginBottom: 10 }}>
          <Col span={19}>
            <VillageSelector
              pageType="withoutYear"
              setCodeVillage={setCodeVillage}
              setTextForVillage={setTextForVillage}
              onVillageChange={(setVillage, setTableData)}
              yearChange={setRevenueYear}
              setIsNirank={setIsNirank}
            />
          </Col>
          <Col xl={5} lg={5} md={24} sm={24} xs={24}>
            <Form.Item
              style={{ marginTop: 10 }}
              labelCol={{ lg: 12 }}
              wrapperCol={{ lg: 12 }}
              label={<FormattedMessage id="villageSelector.label.revenueYear" />}
            >
              <Select
                // style={{ width: 200, marginRight: '15px' }}
                options={revenueYearForVillage}
                // value={revenueYearForVillage}
                placeholder={'महसूल वर्ष'}
                onChange={(value, event) => onYearChange(value, event)}
                // disabled
              ></Select>
            </Form.Item>
          </Col>
        </Row>
        <Row style={{ marginLeft: '15px' }}>
          <Col xl={2} lg={2} md={2} sm={4} xs={4}>
            <Button
              onClick={() => {
                if (textForVillage && revenueYear) {
                  getTableData();
                } else if (textForVillage == null) {
                  message.info('Please Select Village');
                } else if (revenueYear == null) {
                  message.info('Please Select Revenue Year');
                }
              }}
              type="primary"
            >
              <FormattedMessage id="formLanguage.form.getData" />
            </Button>
          </Col>
          <Col xl={22} lg={22} md={22} sm={20} xs={20}></Col>
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
            <Alert
              message="टीप"
              description="आपल्या दफ्तरातील महसुलाची रक्कम रु. २५०० पेक्षा अधिक जमा झाली असेल तर सदर रकमेचा चलनाद्वारे भरणा शासकीय कोषागारात तत्काळ करावा.(परिपत्रकानुसार) परिपत्रक क्रमांक : संकीर्ण-१०९२/प्र.क्र.४०३-ई-१० , दिनांक १ ऑगस्ट, १९९५   "
              type="info"
              showIcon
            />
            <ReactHtmlTableToExcel
              id="test-table-xls-button"
              className="download-table-xls-button"
              table="table-to-xls"
              filename="Reportxls"
              sheet="tablexls"
              buttonText="Download as XLS"
            />
            <table
              id="table-to-xls"
              className={styles.report_table}
              scroll={{ xs: 1000 }}
              style={{ marginTop: '10px' }}
            >
              <thead>
                <tr>
                  <th colSpan={8}>
                    <h2 style={{ textAlign: 'center', color: 'red' }}>
                      <FormattedMessage id="villageReport8d.formName" />
                    </h2>
                  </th>
                </tr>
                <tr>
                  <th colSpan="8">
                    <h2 style={{ textAlign: 'center', color: 'red' }}>
                      तलाठयाने/मंडळ निरीक्षकाने वसुल केलेल्या सरकारी येणे रकमांची व इतर रकमांची
                      नोंदवी
                    </h2>
                  </th>
                </tr>

                <tr>
                  <th colSpan="8">
                    <h4 style={{ color: 'red', wordSpacing: '200px' }}>
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
                  <th colSpan="4">
                    <b>
                      <FormattedMessage id="villageReport8d.jamaReceipt" />
                    </b>
                  </th>
                  <th colSpan="4">
                    <b>
                      <FormattedMessage id="villageReport8d.expenditure" />
                    </b>
                  </th>
                </tr>
                <tr>
                  <th colSpan={1} rowSpan={1}>
                    <b>
                      <FormattedMessage id="villageReport8d.date" />
                    </b>
                  </th>
                  <th rowSpan={1} colSpan={1}>
                    <b>
                      <FormattedMessage id="villageReport8d.items" />
                    </b>
                  </th>
                  <th rowSpan={1} colSpan={1}>
                    <b>
                      <FormattedMessage id="villageReport8d.receipt" />
                    </b>
                  </th>
                  <th rowSpan={1} colSpan={1}>
                    <b>
                      <FormattedMessage id="villageReport8d.amount" />
                    </b>
                  </th>

                  <th rowSpan={1} colSpan={1}>
                    <b>
                      <FormattedMessage id="villageReport8d.date" />
                    </b>
                  </th>
                  <th rowSpan={1} colSpan={1}>
                    <b>
                      <FormattedMessage id="villageReport8d.items" />
                    </b>
                  </th>
                  <th rowSpan={1} colSpan={1}>
                    <b>
                      <FormattedMessage id="villageReport8d.challan" />
                    </b>
                  </th>
                  <th rowSpan={1} colSpan={1}>
                    <b>
                      <FormattedMessage id="villageReport8d.amount" />
                    </b>
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
                  this.props.dataToMap.map((r, i) => (
                    <tr>
                      <td>{r.receiptDateForReport}</td>
                      <td>{'ज.म'}</td>
                      <td>{r.receiptNo}</td>

                      <td>{r.netAmount}</td>

                      <td>{r.challanDateForReport}</td>

                      <td>{'ज.म'}</td>

                      <td>
                        {r.challanNo} <br /> {r.challanNo0045}
                      </td>

                      <td>{r.challanAmount}</td>
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

export default Report8D;
