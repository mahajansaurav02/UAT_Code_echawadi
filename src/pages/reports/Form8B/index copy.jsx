import React, { useState, useEffect, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card, Col, Form, message, Row, Select, Spin } from 'antd';
import { useReactToPrint } from 'react-to-print';
import { useHistory, useLocation } from 'react-router-dom';
import styles from './ReceiptReportPrint.module.css';
import Axios from 'axios';
import BaseURL from '@/URLs/urls';
import URLS from '@/URLs/urls';
import useAxios from '@/components/eComponents/use-axios';
import VillageSelector from '@/components/eComponents/VillageSelector';
import { useModel } from 'umi';
import { ToWords } from 'to-words';
import { FormattedMessage } from 'umi';
import { CSVDownload, CSVLink } from 'react-csv';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';

function Report8B() {
  const { districtName, talukaName, districtCode, talukaCode } = useModel('details');
  const { sendRequest } = useAxios();
  const componentRef = useRef();
  const location = useLocation(); //location.state?.receipts
  const [textVillage, setTextVillage] = useState();
  const [codeVillage, setCodeVillage] = useState('');
  const [village, setVillage] = useState([]);
  const [isNirank, setIsNirank] = useState(false);

  const [tableData, setTableData] = useState();
  const history = useHistory();
  const [revenueYear, setRevenueYear] = useState();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [revenueYearForVillage, setRevenueYearForVillage] = useState();

  useEffect(() => {
    getRevenueYear();
  }, []);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const printCss = () => {
    document.getElementById('print_css').style.fontSize = '1vh';
    handlePrint();
    document.getElementById('print_css').style.fontSize = '2vh';
  };
  const backToHomeButton = () => {
    history.push({ pathname: '/homepage' });
  };

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

  const getTableData = async () => {
    setLoading(true);

    sendRequest(
      // `${URLS.BaseURL}/reports/landRevenueForm8B?cCode=${codeVillage}&revenueYear=${revenueYear}&districtCode=${districtCode}&talukaCode=${talukaCode}`,
      `${URLS.BaseURL}/reports/landRevenueForm8BView?cCode=${codeVillage}&revenueYear=${revenueYear}&districtCode=${districtCode}&talukaCode=${talukaCode}`,
      'POST',
      null,
      (res) => {
        // res.data.map((r) => ({
        //   console.log("jmVajasut: "+ r.jmVajasut + " zpVajasut: " +r.zpVajasut +" gpVajasut: " +r.gpVajasut);
        // }));
        setTableData(
          res.data.map((r) => ({
            khataNo: r.khataNo === null ? r.makhtaKhataNo : r.khataNo,
            khataOwnerName: r.khataOwnerName,
            jmBindumala: r.jmBindumala,
            zpBindumala: r.zpBindumala,
            gpBindumala: r.gpBindumala,
            jmDumala: r.jmDumala,
            zpDumala: r.zpDumala,
            gpDumala: r.gpDumala,
            jmAkrushik: r.jmAkrushik,
            zpAkrushik: r.zpAkrushik,
            gpAkrushik: r.gpAkrushik,
            jmSankirn: r.jmSankirn,
            zpSankirn: r.zpSankirn,
            gpSankirn: r.gpSankirn,

            jmVajasut: r.jmVajasut,
            zpVajasut: r.zpVajasut,
            gpVajasut: r.gpVajasut,

            addlLandRevenue: r.addlLandRevenue,
            educationalCess: r.educationalCess,
            addlEducationalCess: r.addlEducationalCess,
            employeeGuaranteeScheme: r.employeeGuaranteeScheme,
            preYearNoticeFee: r.preYearNoticeFee,
            preYearPendingJm: r.preYearPendingJm,
            preYearSankirnJmWith: r.preYearSankirnJmWith,
            preYearSankirnJmWithout: r.preYearSankirnJmWithout,
            preYearPendingNaCess: r.preYearPendingNaCess,
            preYearPendingZp: r.preYearPendingZp,
            preYearPendingGp: r.preYearPendingGp,
            preYearPendingAddlLandRevenue: r.preYearPendingAddlLandRevenue,
            preYearPendingEducationalCess: r.preYearPendingEducationalCess,
            preYearPendingAddlEducationalCess: r.preYearPendingAddlEducationalCess,
            preYearPendingEmployeeGuaranteeScheme: r.preYearPendingEmployeeGuaranteeScheme,
            netAmount: r.netAmount,
            noticeAmount: r.noticeAmount,
            netReceived: r.netReceived,
            netPending: r.netPending,
            amountOfZp: r.amountOfZp,
            amountOfJm: r.amountOfJm,
            receiptNo: r.receiptNo,
            netAmountReceived: r.netAmountReceived,
            sanikirn: r.sanikirn,
            challanNo: r.challanNo,
            challanDate: r.challanDate,
            landReceiveForm17Id: r.landReceiveForm17Id,
            area: r.area === null ? 0 : r.area,
            assessment: r.assessment,
            totalGp: r.totalGp,
            totalJm: r.totalJm,
            totalZp: r.totalZp,
            agauVasuliRemarks: r.agauVasuliRemarks,
          })),
        );
        message.success('Records Fetched !');

        setLoading(false);
      },
      (err) => {
        message.error('Reports Details Not Found');

        setLoading(false);
      },
    );
  };

  return (
    <div>
      <Card>
        <h1 style={{ textAlign: 'center' }}>गाव नमुना ८ ब</h1>
        <div style={{ padding: 10 }}>
          <Button type="primary" onClick={printCss}>
            प्रत मिळवा
          </Button>
          <Button style={{ float: 'right' }} onClick={backToHomeButton} type="primary">
            मुख्यपृष्ठ
          </Button>
        </div>
        <Row style={{ marginBottom: 10 }}>
          <Col span={18}>
            <VillageSelector
              pageType="withoutYear"
              setCodeVillage={setCodeVillage}
              setTextForVillage={setTextVillage}
              onVillageChange={(setVillage, setTableData)}
              yearChange={setRevenueYear}
              setIsNirank={setIsNirank}
            />
          </Col>
          <Col xl={6} lg={6} md={24} sm={24} xs={24}>
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
        <Row>
          <Col xl={2} lg={2} md={2} sm={24} xs={24}>
            <Button
              /* onClick={getTableData} */ onClick={() => {
                if (textVillage && revenueYear) {
                  getTableData();
                } else if (textVillage == null) {
                  message.info('Please Select Village');
                } else if (revenueYear == null) {
                  message.info('Please Select Revenue Year');
                }
              }}
              type="primary"
            >
              डेटा मिळवा
            </Button>

            {loading === true ? (
              <Spin size="large" style={{ marginLeft: '630px', marginTop: '20px' }} />
            ) : null}
          </Col>
          <Col xl={20} lg={20} md={2} sm={24} xs={24}></Col>
          {/* <Col>
            <Button type="primary" onClick={''}>
              Download Excel Sheet
            </Button>
          </Col> */}
        </Row>
      </Card>
      <ComponentToPrint
        ref={componentRef}
        village={textVillage}
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
      <div style={{ padding: 3 }}>
        <ReactHTMLTableToExcel
          id="test-table-xls-button"
          className="download-table-xls-button"
          table="table-to-xls"
          filename="Reportxls"
          sheet="tablexls"
          buttonText="Download as XLS"
        />
        <div id="print_css">
          <table id="table-to-xls" className={styles.table}>
            <thead className={styles.tHead}>
              <tr>
                <th colspan="52">
                  <b>गाव नमुना ८ ब (आसामीवार खतावणी व लागणी पत्रक)</b>
                </th>
              </tr>
              <tr>
                <th colspan="52">
                  <b>
                    येणे रकमा व वसुली यांची वार्षिक खातेवही व सर्व ठरावबंद बाबींचे चाचणी ताळेबंद
                    याची नोंदवही
                  </b>
                </th>
              </tr>

              <tr>
                <th colspan="52">
                  <pre>
                    {' '}
                    <b>
                      गाव-{this.props.village} तालुका-{this.props.taluka} जिल्हा-
                      {this.props.district}
                    </b>
                  </pre>
                </th>
              </tr>
              <tr>
                <th rowspan="5">खाता क्र</th>
                <th rowspan="5" style={{ paddingLeft: '125px', paddingRight: '125px' }}>
                  खातेदाराचे नाव
                </th>
                <th rowspan="5">क्षेत्र</th>

                <th colSpan={5}>थकबाकी </th>
                <th colspan="20">चालू वर्ष</th>
                <th rowspan="5">वाढीव जमीन महसूल</th>

                <th colspan="5" rowspan="2">
                  एकूण
                </th>
                <th rowspan="5">वसुलीबद्दल दिलेल्या पावतीचा क्र. व दि.</th>
                <th colspan="5" rowspan="2">
                  वसुली
                </th>
                {/* <th rowspan="5">शिक्षण उपकर</th>
            <th rowspan="5">वाढीव शिक्षण उपकर</th>
            <th rowspan="5">रो.ह. उपकर</th> 
            <th rowspan="4">जमीन महसूल व्यतरिक्त(0045) </th>

            <th rowspan="4">एकूण रक्कम</th>*/}

                <th rowspan="5">कोषागारमध्ये भरल्याचा दिनांक</th>
                <th rowspan="5">चलन क्र (0029)</th>
                <th rowspan="5" style={{ paddingLeft: '50px', paddingRight: '50px' }}>
                  शेरा
                </th>
              </tr>
              <tr>
                <th colspan="5">रक्कम</th>
                <th colspan="4">बिनदुमाला</th>
                <th colspan="4">दुमाला</th>
                <th colspan="4">वजासुट</th>
                <th colspan="4">अकृषिक</th>
                <th colspan="4">संकीर्ण</th>
              </tr>
              <tr>
                <th rowspan="2" colspan="">
                  ज.म{' '}
                </th>
                <th colspan="2">स्थानिक उपकर</th>
                <th rowspan="2">वाढीव जमीन महसूल</th>
                <th rowspan="2">एकूण</th>

                <th rowspan="2" colspan="">
                  ज.म
                </th>
                <th colspan="3">स्थानिक उपकर</th>
                {/* <th rowspan="2">एकूण</th> */}
                <th rowspan="2" colspan="1">
                  ज.म
                </th>
                <th colspan="3">स्थानिक उपकर</th>
                {/* <th rowspan="2" colspan="1">
              एकूण
            </th> */}
                <th rowspan="2" colspan="1">
                  ज.म
                </th>
                <th colspan="3">स्थानिक उपकर</th>
                {/* <th rowspan="2" colspan="1">
              एकूण
            </th> */}
                <th rowspan="2" colspan="1">
                  ज.म
                </th>
                <th colspan="3">स्थानिक उपकर</th>
                {/* <th rowspan="2" colspan="1">
              एकूण
            </th> */}
                <th rowspan="2" colspan="1">
                  ज.म
                </th>
                <th colspan="3">स्थानिक उपकर</th>
                {/* <th rowspan="2" colspan="1">
              एकूण
            </th> */}
                <th rowspan="2" colspan="1">
                  ज.म
                </th>
                {/* <th rowspan="2" colspan="1">
              संकीर्ण
            </th> */}
                <th colspan="3">स्थानिक उपकर</th>
                <th rowspan="2" colspan="1">
                  एकूण
                </th>
                <th rowspan="2">ज.म</th>
                {/* <th rowspan="2">संकीर्ण</th> */}
                <th colspan="3">स्थानिक उपकर</th>
                <th rowspan="2">एकूण</th>
              </tr>
              <tr>
                <th>जि.प.</th>
                <th>ग्रा.पं.</th>
                <th colspan="2">जि.प.</th>
                <th colspan="1">ग्रा.पं.</th>
                <th colspan="2">जि.प.</th>
                <th colspan="1">ग्रा.पं.</th>
                <th colspan="2">जि.प.</th>
                <th colspan="1">ग्रा.पं.</th>
                <th colspan="2">जि.प.</th>
                <th colspan="1">ग्रा.पं.</th>
                <th colspan="2">जि.प.</th>
                <th colspan="1">ग्रा.पं.</th>
                <th colspan="2">जि.प.</th>
                <th colspan="1">ग्रा.पं.</th>
                <th colspan="2">जि.प.</th>
                <th colspan="1">ग्रा.पं.</th>
              </tr>
              <tr>
                <td>रु</td>
                <td>रु</td>
                <td>रु</td>
                <td>रु</td>
                <td>रु</td>
                <td colspan="2">रु</td>
                <td>रु</td>
                <td>रु</td>
                <td colspan="2">रु</td>
                <td>रु</td>
                <td>रु</td>
                <td colspan="2">रु</td>
                <td>रु</td>
                <td>रु</td>
                <td colspan="2">रु</td>
                <td>रु</td>
                <td>रु</td>
                <td colspan="2">रु</td>
                <td>रु</td>
                <td>रु</td>
                <td>रु</td>
                <td colspan="2">रु</td>
                <td>रु</td>
                <td>रु</td>
                <td>रु</td>
                <td colspan="2">रु</td>
                <td>रु</td>
                <td>रु</td>
              </tr>
              <tr>
                <td>1</td>
                <td>2</td>
                <td>3</td>
                <td>4</td>
                <td>5</td>
                <td>6</td>
                <td>7</td>
                <td>8</td>
                <td colspan="2">9</td>
                <td>10</td>
                <td>11</td>
                <td>12</td>
                <td colspan="2">13</td>
                <td>14</td>
                <td colspan="2">15</td>
                <td>16</td>
                <td>17</td>
                <td colspan="2">18</td>
                <td>19</td>
                <td>20</td>
                <td colspan="2">21</td>
                <td>22</td>
                <td>23</td>
                <td>24</td>
                <td>25</td>
                <td colspan="2">26</td>
                <td>27</td>
                <td>28</td>
                <td>29</td>
                <td>30</td>
                <td colspan="2">31</td>
                <td>32</td>
                <td>33</td>
                <td>34</td>
                <td>35</td>
                <td>36</td>
              </tr>
            </thead>

            {this.props.dataToMap &&
              this.props.dataToMap.map((r) => (
                <tr>
                  <td>{r.khataNo}</td>
                  <td>{r.khataOwnerName}</td>
                  <td>{r.area}</td>
                  <td>
                    {r.preYearPendingJm +
                      r.preYearPendingNaCess +
                      r.preYearSankirnJmWith +
                      r.preYearSankirnJmWithout}
                  </td>
                  <td>{r.preYearPendingZp}</td>
                  <td>{r.preYearPendingGp}</td>
                  <td>{r.preYearPendingAddlLandRevenue}</td>
                  <td>
                    {r.preYearPendingJm +
                      r.preYearPendingZp +
                      r.preYearPendingGp +
                      r.preYearPendingNaCess +
                      r.preYearSankirnJmWith +
                      r.preYearSankirnJmWithout +
                      r.preYearPendingAddlLandRevenue}
                  </td>
                  <td>{r.jmBindumala}</td>
                  <td colspan="2">{r.zpBindumala}</td>
                  <td>{r.gpBindumala}</td>
                  <td>{r.jmDumala}</td>
                  <td colspan="2">{r.zpDumala}</td>
                  <td>{r.gpDumala}</td>
                  {/* 15,16,17 */}
                  <td>{r.jmVajasut}</td>
                  <td colspan="2">{r.zpVajasut}</td>
                  <td>{r.gpVajasut}</td>

                  <td>{r.jmAkrushik}</td>
                  <td colspan="2">{r.zpAkrushik}</td>
                  <td>{r.gpAkrushik}</td>
                  <td>{r.jmSankirn + r.noticeAmount}</td>
                  <td colspan="2">{r.zpSankirn}</td>
                  <td>{r.gpSankirn}</td>

                  <td>{r.addlLandRevenue}</td>
                  {/* ---------------------------------------------------------------------25 */}
                  <td colspan="2">
                    {r.preYearPendingJm +
                      r.jmBindumala +
                      r.jmDumala +
                      r.jmAkrushik +
                      r.jmSankirn +
                      r.noticeAmount -
                      r.jmVajasut}
                  </td>
                  {/* ---------------------------------------------------------------------26 */}
                  <td>
                    {r.preYearPendingZp +
                      r.zpBindumala +
                      r.zpDumala +
                      r.zpAkrushik +
                      r.zpSankirn -
                      r.zpVajasut}
                  </td>
                  {/* ---------------------------------------------------------------------27 */}
                  <td>
                    {r.preYearPendingGp +
                      r.gpBindumala +
                      r.gpDumala +
                      r.gpAkrushik +
                      r.gpSankirn -
                      r.gpVajasut}
                  </td>
                  {/*-----------------  */}

                  <td>
                    {r.jmBindumala + r.jmDumala == 5
                      ? r.netAmount -
                        r.educationalCess -
                        r.employeeGuaranteeScheme -
                        r.addlEducationalCess -
                        r.preYearPendingEducationalCess -
                        r.preYearPendingAddlEducationalCess -
                        r.preYearPendingEmployeeGuaranteeScheme -
                        r.preYearNoticeFee -
                        r.zpVajasut -
                        r.gpVajasut
                      : r.netAmount -
                        r.educationalCess -
                        r.employeeGuaranteeScheme -
                        r.addlEducationalCess -
                        r.preYearPendingEducationalCess -
                        r.preYearPendingAddlEducationalCess -
                        r.preYearPendingEmployeeGuaranteeScheme -
                        r.preYearNoticeFee}
                  </td>

                  {/* 29 */}

                  <td>{r.receiptNo}</td>
                  <td>{r.receiptNo != null ? r.totalJm : 0}</td>
                  <td colspan="2">{r.receiptNo != null ? r.totalZp : 0}</td>
                  <td>{r.receiptNo != null ? r.totalGp : 0}</td>
                  <td>
                    {r.receiptNo != null
                      ? r.netPending -
                        r.educationalCess -
                        r.employeeGuaranteeScheme -
                        r.addlEducationalCess -
                        r.preYearPendingEducationalCess -
                        r.preYearPendingAddlEducationalCess -
                        r.preYearPendingEmployeeGuaranteeScheme -
                        r.preYearNoticeFee
                      : 0}
                  </td>

                  <td>{r.challanDate}</td>
                  <td>{r.challanNo}</td>
                  <td>{r.agauVasuliRemarks}</td>
                </tr>
              ))}
          </table>
        </div>
      </div>
    );
  }
}

export default Report8B;
