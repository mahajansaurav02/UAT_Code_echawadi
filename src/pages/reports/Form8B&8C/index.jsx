import React, { useState, useEffect, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card, Col, message, Row, Select, Spin, Form } from 'antd';
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
import ReactHtmlTableToExcel from 'react-html-table-to-excel';

function Report8b() {
  const { districtName, talukaName, districtCode, talukaCode } = useModel('details');
  const { sendRequest } = useAxios();
  const componentRef = useRef();
  const location = useLocation(); //location.state?.receipts
  const [totalAmount, setTotalAmount] = useState(0);
  const [textVillage, setTextVillage] = useState();
  const [codeVillage, setCodeVillage] = useState('');
  const [isNirank, setIsNirank] = useState(false);
  const [revenueYearForVillage, setRevenueYearForVillage] = useState();
  const [village, setVillage] = useState([]);
  const [tableData, setTableData] = useState();
  const history = useHistory();
  const [revenueYear, setRevenueYear] = useState();
  const [totalArea, setTotalArea] = useState(0);
  const [loading, setLoading] = useState(false);

  const [selectVal, setSelectVal] = useState('0');

  const toWords = new ToWords({
    localeCode: 'mr-IN',
    converterOptions: {
      currency: true,
      ignoreDecimal: false,
      ignoreZeroCurrency: false,
      doNotAddOnly: true,
    },
  });
  //const { receipts } = location.state;
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

  useEffect(() => {
    getRevenueYear();
  }, []);

  const onYearChange = (value, event) => {
    setRevenueYear(value);
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
    // setTotalAmount(0);
    // setTotalArea(0);
    sendRequest(
      // `${URLS.BaseURL}/reports/landRevenueForm8B?cCode=${codeVillage}&revenueYear=${revenueYear}&districtCode=${districtCode}&talukaCode=${talukaCode}`,
      //---8 Jan 2024
      //`${URLS.BaseURL}/reports/landRevenueForm8BView?cCode=${codeVillage}&revenueYear=${revenueYear}&districtCode=${districtCode}&talukaCode=${talukaCode}`,
      //---3 April 2024
      `${URLS.BaseURL}/reports/landRevenueForm8B8kView?cCode=${codeVillage}&revenueYear=${revenueYear}&districtCode=${districtCode}&talukaCode=${talukaCode}&dropdownVal=${selectVal}`,
      'POST',
      null,
      (res) => {
        // res.data.map((r) => {
        //   setTotalAmount(
        //     (prevTotalAmount) =>
        //       prevTotalAmount +
        //       r.preYearPendingGp +
        //       r.gpBindumala +
        //       r.gpDumala +
        //       r.gpAkrushik +
        //       r.gpSankirn +
        //       r.preYearPendingZp +
        //       r.zpBindumala +
        //       r.zpDumala +
        //       r.zpAkrushik +
        //       r.zpSankirn +
        //       r.preYearPendingJm +
        //       r.jmBindumala +
        //       r.jmDumala +
        //       r.jmAkrushik +
        //       r.jmSankirn +
        //       r.addlLandRevenue +
        //       r.educationalCess +
        //       r.addlEducationalCess +
        //       r.employeeGuaranteeScheme,
        //   );
        //   setTotalArea((prevTotalArea) => prevTotalArea + parseFloat(r.area));
        // });

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
            preYearPendingJm: r.preYearPendingJm,
            preYearPendingZp: r.preYearPendingZp,
            preYearPendingGp: r.preYearPendingGp,
            preYearPendingNaCess: r.preYearPendingNaCess,
            preYearSankirnJmWith: r.preYearSankirnJmWith,
            preYearSankirnJmWithout: r.preYearSankirnJmWithout,
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
            area: r.area,
            agauVasuliRemarks: r.agauVasuliRemarks,
          })),
          message.success('Records Fetched!!'),
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
    <div>
      <Card>
        <h1 style={{ textAlign: 'center' }}>गाव नमुना ८ ब आणि ८ क </h1>
        <div style={{ padding: 10 }}>
          <Button type="primary" onClick={printCss}>
            प्रत मिळवा
          </Button>
          <Button style={{ float: 'right' }} onClick={backToHomeButton} type="primary">
            मुख्यपृष्ठ
          </Button>
        </div>
        <Row style={{ marginBottom: 10 }}>
          {/* <Col span={14}> */}
          <Col xl={11} lg={11} md={24} sm={24} xs={24}>
            <VillageSelector
              pageType="withoutYear"
              setCodeVillage={setCodeVillage}
              setTextForVillage={setTextVillage}
              onVillageChange={(setVillage, setTableData)}
              yearChange={setRevenueYear}
              setIsNirank={setIsNirank}
            />
          </Col>
          <Col xl={5} lg={5} md={24} sm={24} xs={24}>
            <Form.Item
              style={{ marginTop: 16 }}
              labelCol={{ lg: 12 }}
              wrapperCol={{ lg: 8 }}
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
          <Col xl={4} lg={4} md={24} sm={24} xs={24}>
            <Form.Item
              //  label={<FormattedMessage id="villageSelector.label.taluka" />}
              style={{ marginTop: 16 }}
              label="खाते"
              wrapperCol={{ xl: 8, lg: 8 }}
            >
              <Select
                style={{ width: 200, marginRight: '15px' }}
                value={selectVal}
                placeholder="पूर्ण"
                onChange={(value, event) => setSelectVal(value)}
              >
                <Select.Option value="0">पूर्ण</Select.Option>
                <Select.Option value="1">वसूली पात्र</Select.Option>
                <Select.Option value="2">सूट</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xl={4} lg={4} md={24} sm={24} xs={24}>
            <Form.Item style={{ marginTop: 16 }}>
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
            </Form.Item>

            {loading === true ? (
              <Spin size="large" style={{ marginLeft: '530px', marginTop: '20px' }} />
            ) : null}
          </Col>
        </Row>
        <Row style={{ marginBottom: 10, padding: 10 }}>
          <Col span={24}>
            {/* <Form.Item
              
              label="खाते"
              wrapperCol={{ xl: 8, lg: 8 }}
            >
              <Select
                style={{ width: 200, marginRight: '15px' }}
                value={selectVal}
                placeholder="पूर्ण"
                onChange={(value, event) => setSelectVal(value)}
              >
                <Select.Option value="0">पूर्ण</Select.Option>
                <Select.Option value="1">वसूली पात्र</Select.Option>
                <Select.Option value="2">सूट</Select.Option>
              </Select>
              <Button
                 onClick={() => {
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
            </Form.Item> */}
            {/* <Button
              onClick={() => {
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
            </Button> */}
            {/* {loading === true ? (
              <Spin size="large" style={{ marginLeft: '530px', marginTop: '20px' }} />
            ) : null} */}
          </Col>
        </Row>
      </Card>
      <ComponentToPrint
        ref={componentRef}
        village={textVillage}
        taluka={talukaName}
        district={districtName}
        dataToMap={tableData}
        // totalAmount={totalAmount}
        // totalArea={totalArea.toFixed(2)}
      />
    </div>
  );
}
class ComponentToPrint extends React.Component {
  render() {
    return (
      <div style={{ padding: 3 }}>
        <ReactHtmlTableToExcel
          id="test-table-xls-button"
          className="download-table-xls-button"
          table="table-to-xls"
          filename="Reportxls"
          sheet="tablexls"
          buttonText="Download as XLS"
        />
        <div id="print_css">
          <table id="table-to-xls" className={styles.table}>
            <thead>
              <tr>
                <th colspan="52">
                  <b>गाव नमुना ८ ब व ८ क ( गणना पत्रक) </b>
                </th>
              </tr>
              <tr>
                <th colspan="52">
                  <b>सदर नमुना केवळ संगणकीय वापरासाठी आहे</b>
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

                <th colSpan="12">थकबाकी </th>
                <th colspan="26">चालू वर्ष</th>
                <th rowspan="4">वसूल योग्य एकूण रक्कम</th>

                <th rowspan="5">वसुलीनंतर दिलेल्या पावतीचा क्र. व दि.</th>

                <th rowspan="5">कोषागारमध्ये भरल्याचा दिनांक</th>
                <th rowspan="5">चलन क्र (0029,0045)</th>
                <th rowspan="5" style={{ paddingLeft: '50px', paddingRight: '50px' }}>
                  शेरा
                </th>
              </tr>
              <tr>
                <th colspan="12">रक्कम</th>
                <th colspan="4">बिनदुमाला</th>
                <th colspan="4">दुमाला</th>
                <th colspan="4">वजासुट</th>
                <th colspan="4">अकृषिक</th>
                <th colspan="4">संकीर्ण</th>
                <th rowspan="3">वाढीव जमीन महसूल</th>
                <th rowspan="3"> शिक्षण उपकर</th>

                <th rowspan="3">वाढीव शिक्षण उपकर</th>

                <th rowspan="3">रो.ह. उपकर</th>
                <th rowspan="3" colSpan="2">
                  एकूण रक्कम{' '}
                </th>
              </tr>
              <tr>
                <th rowspan="2" colspan="">
                  ज.म{' '}
                </th>
                <th colspan="2">स्थानिक उपकर</th>
                <th colSpan="2" rowspan="2">
                  वाढीव जमीन महसूल
                </th>
                <th colSpan="2" rowspan="2">
                  शिक्षण उपकर{' '}
                </th>
                <th colSpan="2" rowspan="2">
                  वाढीव शिक्षण उपकर{' '}
                </th>
                <th colSpan="2" rowspan="2">
                  रो.ह. उपकर{' '}
                </th>

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
              </tr>
              <tr>
                <td>रु</td>
                <td>रु</td>
                <td>रु</td>
                <td colspan="2">रु</td>
                <td colspan="2">रु</td>
                <td colspan="2">रु</td>
                <td colspan="2">रु</td>
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
                <td>रु</td>
                <td>रु</td>
                <td colspan="2">रु</td>
                <td>रु</td>
              </tr>
              <tr>
                <td>1</td>
                <td>2</td>
                <td>3</td>
                <td>4</td>
                <td>5</td>
                <td>6</td>
                <td colspan="2">7</td>
                <td colspan="2">8</td>
                <td colspan="2">9</td>
                <td colspan="2">10</td>
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
                <td colspan="2">24</td>
                <td>25</td>
                <td>26</td>
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
                  <td colspan="2">{r.preYearPendingAddlLandRevenue}</td>
                  <td colspan="2">{r.preYearPendingEducationalCess}</td>
                  <td colspan="2">{r.preYearPendingAddlEducationalCess}</td>
                  <td colspan="2">{r.preYearPendingEmployeeGuaranteeScheme}</td>
                  <td>
                    {r.preYearPendingJm +
                      r.preYearPendingZp +
                      r.preYearPendingGp +
                      r.preYearPendingNaCess +
                      r.preYearSankirnJmWith +
                      r.preYearSankirnJmWithout +
                      r.preYearPendingAddlLandRevenue +
                      r.preYearPendingEducationalCess +
                      r.preYearPendingAddlEducationalCess +
                      r.preYearPendingEmployeeGuaranteeScheme}
                  </td>
                  <td>{r.jmBindumala}</td>
                  <td colspan="2">{r.zpBindumala}</td>
                  <td>{r.gpBindumala}</td>
                  <td>{r.jmDumala}</td>
                  <td colspan="2">{r.zpDumala}</td>
                  <td>{r.gpDumala}</td>
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
                  <td>{r.educationalCess}</td>
                  <td>{r.addlEducationalCess}</td>
                  <td>{r.employeeGuaranteeScheme}</td>
                  <td>{r.netAmount}</td>
                  <td colspan="2">{r.netPending}</td>

                  <td>{r.receiptNo}</td>

                  <td>{r.challanDate}</td>
                  <td>{r.challanNo}</td>
                  <td style={{ width: '20px' }}>{r.agauVasuliRemarks}</td>
                </tr>
              ))}
          </table>
        </div>
      </div>
    );
  }
}
export default Report8b;
