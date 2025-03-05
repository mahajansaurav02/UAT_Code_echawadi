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
  const [revenueYear, setRevenueYear] = useState();
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
    console.log(revenueYear, '--------------------revenueYear');

    sendRequest(
      // `${URLS.BaseURL}/reports/landRevenueForm8B?cCode=${codeVillage}&revenueYear=${revenueYear}&districtCode=${districtCode}&talukaCode=${talukaCode}`,
      `${URLS.BaseURL}/reports/getEduCessTax?districtCode=${districtCode}&talukaCode=${talukaCode}&cCode=${codeVillage}&revenueYear=${revenueYear}`,
      //---8 Jan 2024
      // revenueYear == '2023-24'
      //   ? `${URLS.BaseURL}/reports/landRevenueForm8BViewPre?cCode=${codeVillage}&revenueYear=${revenueYear}&districtCode=${districtCode}&talukaCode=${talukaCode}`
      //   : `${URLS.BaseURL}/reports/landRevenueForm8BView?cCode=${codeVillage}&revenueYear=${revenueYear}&districtCode=${districtCode}&talukaCode=${talukaCode}`,

      'GET',
      null,
      (res) => {
        console.log(res.data.landRevenueDemandData, '-----------lll');

        setTableData(
        res.data.landRevenueDemandData.map((r, i) => ({
          srNo: i + 1,
          id: r.id,
          khataNo: r.khataNo,
          khataOwnerName: r.khataOwnerName,
          surveyHissaNo: r.surveyHissaNo,
          seasonCode: r.seasonCode,
          // cropName: r.cropName,
          educationalCess: r.educationalCess,
          addlEducationalCess: r.addlEducationalCess,
          // employeeGuaranteeScheme: r.employeeGuaranteeScheme,
          // preYearPendingEducationalCess: r.preYearPendingEducationalCess,
          // preYearPendingAddlEducationalCess: r.preYearPendingAddlEducationalCess,
          // preYearPendingEmployeeGuaranteeScheme: r.preYearPendingEmployeeGuaranteeScheme,
          // currentYear: r.currentYear,
          // totalDemand: r.totalDemand,
          // receiptNo: r.receiptNo,
          // receiptDate: r.receiptDate,
          // netPending: r.netPending,
          // netReceived: r.netReceived,
          // amountRecovered: r.amountRecovered,
          // balanceForRecovery: r.balanceForRecovery,
          // challanNoCreditInTreasury: r.challanNoCreditInTreasury,
          // challanDate: r.challanDate,
          // challanNo: r.challanNo,
          // remarks: r.remarks,
        })),
        message.success('Records Fetched!!'),
      )
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
              <FormattedMessage id="EducationalCess.form.EducationalCess" />
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
                // value={revenueYearForVillage}
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
                <th colSpan="7">
                  <h3 style={{ color: 'red' }}>
                    <FormattedMessage id="EducationalCess.form.EducationalCessname" />
                  </h3>
                </th>
              </tr>
              <tr>
                <th colSpan="7">
                  <h3 style={{ color: 'red' }}>
                    <b>
                      <FormattedMessage id="EducationalCess.form.departmentNm" />
                    </b>
                  </h3>
                </th>
              </tr>
              <tr>
                <th colSpan="7">
                  <h4 style={{ color: 'red' }}>
                    <b>गाव-{this.props.village} तालुका-{this.props.taluka} जिल्हा-{this.props.district}</b>
                  </h4>
                </th>
              </tr>
              <tr>
                <th colSpan="7">
                  <h3 style={{ color: 'red' }}>
                    <b>
                      <FormattedMessage id="EducationalCess.form.revenueYear" />
                    </b>
                  </h3>
                </th>
              </tr>
              <tr>
                <th><b><FormattedMessage id="formLanguage.form.serialNo" /></b></th>
                <th><b><FormattedMessage id="EducationalCess.form.khatedarName" /></b></th>
                <th><b><FormattedMessage id="EducationalCess.form.khataNo" /></b></th>
                <th><b><FormattedMessage id="EducationalCess.form.gatNumber" /></b></th>
                <th><b><FormattedMessage id="EducationalCess.form.hangam" /></b></th>
                <th><b><FormattedMessage id="EducationalCess.form.cropName" /></b></th>
                <th><b><FormattedMessage id="EducationalCess.form.increseadEducationalTax" /></b></th>
              </tr>
            </thead>
            <tbody>
              {this.props.dataToMap &&
                this.props.dataToMap.map((r, index) => (
                  <tr key={index}>
                    <td>{r.srNo}</td>
                    <td>{r.khataOwnerName}</td>
                    <td>{r.khataNo}</td>
                    <td>{r.surveyHissaNo}</td>
                    <td>{r.seasonCode}</td>
                    <td>{r.cropName}</td>
                    <td>{r.addlEducationalCess}</td>
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
export default EducationalCess;
