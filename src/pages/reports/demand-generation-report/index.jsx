import { PageContainer } from '@ant-design/pro-layout';
import styles from './report.module.css';
import React, { useState, useRef, useEffect } from 'react';
import { Button, Card, Col, message, Row, Select, Spin, Form } from 'antd';
import { useHistory, useLocation } from 'react-router-dom';
import Axios from 'axios';
import VillageSelector from '@/components/eComponents/VillageSelector';
import BaseURL from '@/URLs/urls';
import { useReactToPrint } from 'react-to-print';
import URLS from '@/URLs/urls';
import useAxios from '@/components/eComponents/use-axios';
import { useModel } from 'umi';
import { FormattedMessage } from 'umi';

function DemandGenerationReport() {
  const { districtName, talukaName, servarthId, districtCode, talukaCode } = useModel('details');

  const { sendRequest } = useAxios();
  const [codeVillage, setCodeVillage] = useState('');
  const [textForVillage, setTextForVillage] = useState();
  const [village, setVillage] = useState([]);
  const [tableData, setTableData] = useState();
  const [textVillage, setTextVillage] = useState('');
  const componentRef = useRef();
  const [revenueYear, setRevenueYear] = useState();
  const [isNirank, setIsNirank] = useState(false);
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

  const printCss = () => {
    document.getElementById('print_css').style.fontSize = '1vh';
    handlePrint();
    document.getElementById('print_css').style.fontSize = '2vh';
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
      `${URLS.BaseURL}/landRevenue/getLandRevenueDemandDetails?districtCode=${districtCode}&talukaCode=${talukaCode}&cCode=${codeVillage}&activeFlag=E&revenueYear=${revenueYear}
`,
      'GET',
      null,
      (res) => {
        // console.log('full res for demand geenration report', res);
        if (res.data.length <= 0) {
          message.info('No Records Found !');
        } else {
          message.success('Records Fetched!!');
        }
        setTableData(
          res.data.map((row, index) => ({
            id: row.khataNo,
            khataNo: row.khataNo,
            khataOwnerName: row.khataOwnerName,
            jmBindumala: row.jmBindumala,
            zpBindumala: row.zpBindumala,
            gpBindumala: row.gpBindumala,
            jmDumala: row.jmDumala,
            zpDumala: row.zpDumala,
            gpDumala: row.gpDumala,
            jmAkrushik: row.jmAkrushik,
            zpAkrushik: row.zpAkrushik,
            gpAkrushik: row.gpAkrushik,
            jmSankirn: row.jmSankirn,
            zpSankirn: row.zpSankirn,
            gpSankirn: row.gpSankirn,
            jmVajasut: row.jmVajasut,
            gpVajasut: row.gpVajasut,
            zpVajasut: row.zpVajasut,
            addlLandRevenue: row.addlLandRevenue,
            educationalCess: row.educationalCess,
            addlEducationalCess: row.addlEducationalCess,
            employeeGuaranteeScheme: row.employeeGuaranteeScheme,
            netAmount: row.netAmount,
            preYearPendingJm: row.preYearPendingJm,
            preYearPendingZp: row.preYearPendingZp,
            preYearPendingGp: row.preYearPendingGp,
            preYearPendingAddlLandRevenue: row.preYearPendingAddlLandRevenue,
            preYearPendingEducationalCess: row.preYearPendingEducationalCess,
            preYearPendingAddlEducationalCess: row.preYearPendingAddlEducationalCess,
            preYearPendingEmployeeGuaranteeScheme: row.preYearPendingEmployeeGuaranteeScheme,
            miscellaneousAmount: row.miscellaneousAmount,
            area: row.area,
            assessment: row.assessment,
            srNo: index + 1,
            surveyHissaNo: row.surveyHissaNo,
            uom: row.uom,
          })),
        );
        setLoading(false);
      },
    );
  };

  return (
    <>
      <Card>
        <Row>
          <Col span={8}>
            <Button type="primary" onClick={printCss}>
              <FormattedMessage id="formLanguage.button.print" />
            </Button>
          </Col>
          <Col span={8}>
            <h1 style={{ textAlign: 'center' }}>
              <FormattedMessage id="demandGeneration.table.Title" />
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
          <Col xl={22} lg={22} md={22} sm={20} xs={20}></Col>
          <Col xl={2} lg={2} md={2} sm={4} xs={4}>
            <Button
              onClick={() => {
                if (textForVillage && revenueYear) {
                  getTableData();
                } else if (textForVillage == null) {
                  message.info('Please Select Village !');
                } else if (revenueYear == null) {
                  message.info('Please Select Revenue Year !');
                }
              }}
              type="primary"
            >
              <FormattedMessage id="formLanguage.form.getData" />
            </Button>
          </Col>
          {loading === true ? (
            <Spin size="large" style={{ marginLeft: '730px', marginTop: '20px' }} />
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
          <table id="print_css" className={styles.report_table} scroll={{ xs: 1000 }}>
            <thead>
              <tr>
                <th colSpan="33">
                  <h2 style={{ textAlign: 'center', color: 'red' }}>
                    <FormattedMessage id="demandGeneration.table.Title" />
                  </h2>
                </th>
              </tr>

              <tr>
                <th colSpan="33">
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
                <th>
                  <b>
                    <FormattedMessage id="formLanguage.form.serialNo" />
                  </b>
                </th>
                <th>
                  <b>
                    <FormattedMessage
                      id="demandGeneration.table.khataNo"
                      defaultMessage="खाता क्र"
                    />
                  </b>
                </th>
                <th>
                  <b>
                    <FormattedMessage
                      id="demandGeneration.table.khataOwnerName"
                      defaultMessage="खातेदाराचे नाव"
                    />
                  </b>
                </th>
                <th>
                  <b>
                    <FormattedMessage id="demandGeneration.table.area" defaultMessage="क्षेत्र" />
                  </b>
                </th>
                <th>
                  <b>
                    <FormattedMessage
                      id="demandGeneration.table.assessment"
                      defaultMessage="मूल्यांकन"
                    />
                  </b>
                </th>
                <th>
                  <b>
                    <FormattedMessage
                      id="demandGeneration.table.lrBindumala"
                      defaultMessage="ज.म. बिनदुमाला"
                    />
                  </b>
                </th>
                <th>
                  <b>
                    <FormattedMessage
                      id="demandGeneration.table.zpBindumala"
                      defaultMessage="जि.प. बिनदुमाला"
                    />
                  </b>
                </th>
                <th>
                  <b>
                    <FormattedMessage
                      id="demandGeneration.table.vpBindumala"
                      defaultMessage="ग्रा.पं. बिनदुमाला"
                    />
                  </b>
                </th>
                <th>
                  <b>
                    <FormattedMessage
                      id="demandGeneration.table.lrdumala"
                      defaultMessage="ज.म. दुमाला"
                    />
                  </b>
                </th>
                <th>
                  <b>
                    <FormattedMessage
                      id="demandGeneration.table.zpdumala"
                      defaultMessage="जि.प. दुमाला"
                    />
                  </b>
                </th>
                <th>
                  <b>
                    <FormattedMessage
                      id="demandGeneration.table.vpdumala"
                      defaultMessage="ग्रा.पं. दुमाला"
                    />
                  </b>
                </th>

                <th>
                  <b>
                    <FormattedMessage
                      id="demandGeneration.table.lrSankirn"
                      defaultMessage="ज.म. संकीर्ण"
                    />
                  </b>
                </th>
                <th>
                  <b>
                    <FormattedMessage
                      id="demandGeneration.table.zpSankirn"
                      defaultMessage="जि.प. संकीर्ण"
                    />
                  </b>
                </th>
                <th>
                  <b>
                    <FormattedMessage
                      id="demandGeneration.table.vpSankirn"
                      defaultMessage="ग्रा.पं. संकीर्ण"
                    />
                  </b>
                </th>
                <th>
                  <b>
                    <FormattedMessage
                      id="demandGeneration.table.lrAkrushik"
                      defaultMessage="ज.म. आक्रोशिक"
                    />
                  </b>
                </th>

                <th>
                  <b>
                    <FormattedMessage
                      id="demandGeneration.table.zpAkrushik"
                      defaultMessage="जि.प. आक्रोशिक"
                    />
                  </b>
                </th>
                <th>
                  <b>
                    <FormattedMessage
                      id="demandGeneration.table.vpAkrushik"
                      defaultMessage="'ग्रा.पं. आक्रोशिक'"
                    />
                  </b>
                </th>
                <th>
                  <b>
                    <FormattedMessage
                      id="demandGeneration.table.lrVajasut"
                      defaultMessage="ज.म. वजासुट"
                    />
                  </b>
                </th>
                <th>
                  <b>
                    <FormattedMessage
                      id="demandGeneration.table.zpVajasut"
                      defaultMessage="जि.प. वजासुट"
                    />
                  </b>
                </th>
                <th>
                  <b>
                    <FormattedMessage
                      id="demandGeneration.table.vpVajasut"
                      defaultMessage="ग्रा.पं. वजासुट"
                    />
                  </b>
                </th>
                <th>
                  <b>
                    <FormattedMessage
                      id="demandGeneration.table.addLandRevenue"
                      defaultMessage="वाढीव जमीन महसूल"
                    />
                  </b>
                </th>
                <th>
                  <b>
                    <FormattedMessage
                      id="demandGeneration.table.educationalCess"
                      defaultMessage="शिक्षण उपकर"
                    />
                  </b>
                </th>
                <th>
                  <b>
                    <FormattedMessage
                      id="demandGeneration.table.addlEducationalCess"
                      defaultMessage="वाढीव शिक्षण उपकर"
                    />
                  </b>
                </th>
                <th>
                  <b>
                    <FormattedMessage id="demandGeneration.table.EGS" defaultMessage="रो.ह. उपकर" />
                  </b>
                </th>
                <th>
                  <b>
                    <FormattedMessage
                      id="demandGeneration.table.preYearPendingJm"
                      defaultMessage="मागील ज.म."
                    />
                  </b>
                </th>
                <th>
                  <b>
                    <FormattedMessage
                      id="demandGeneration.table.preYearPendingZp"
                      defaultMessage="मागील जि.प."
                    />
                  </b>
                </th>
                <th>
                  <b>
                    <FormattedMessage
                      id="demandGeneration.table.preYearPendingGp"
                      defaultMessage="मागील ग्रा.पं."
                    />
                  </b>
                </th>

                <th>
                  <b>
                    <FormattedMessage
                      id="demandGeneration.table.preYearPendingAddlLandRevenue"
                      defaultMessage="मागील वाढीव जमीन महसूल"
                    />
                  </b>
                </th>
                <th>
                  <b>
                    <FormattedMessage
                      id="demandGeneration.table.preYearPendingEducationalCess"
                      defaultMessage="मागील शिक्षण उपकर"
                    />
                  </b>
                </th>
                <th>
                  <b>
                    <FormattedMessage
                      id="demandGeneration.table.preYearPendingAddlEducationalCess"
                      defaultMessage="मागील वाढीव शिक्षण उपकर"
                    />
                  </b>
                </th>
                <th>
                  <b>
                    <FormattedMessage
                      id="demandGeneration.table.preYearPendingEmployeeGuaranteeScheme"
                      defaultMessage="मागील वाढीव रो.ह. उपकर"
                    />
                  </b>
                </th>
                <th>
                  <b>
                    <FormattedMessage
                      id="demandGeneration.table.miscellaneousAmount"
                      defaultMessage="विविध रक्कम"
                    />
                  </b>
                </th>
                <th>
                  <b>
                    <FormattedMessage
                      id="demandGeneration.table.netAmount"
                      defaultMessage="एकूण निव्वळ रक्कम"
                    />
                  </b>
                </th>
              </tr>
            </thead>
            <tbody>
              {this.props.dataToMap &&
                this.props.dataToMap.map((r, i) => (
                  <tr>
                    <td>{i + 1}</td>
                    <td>{r.khataNo}</td>
                    <td>{r.khataOwnerName}</td>
                    <td>{r.area}</td>

                    <td>{r.assessment}</td>

                    <td>{r.jmBindumala} </td>
                    <td>{r.zpBindumala}</td>
                    <td>{r.gpBindumala}</td>
                    <td>{r.jmDumala}</td>
                    <td>{r.zpDumala}</td>
                    <td>{r.gpDumala}</td>
                    <td>{r.jmSankirn}</td>
                    <td>{r.zpSankirn}</td>
                    <td>{r.gpSankirn}</td>
                    <td>{r.jmAkrushik}</td>
                    <td>{r.zpAkrushik}</td>
                    <td>{r.gpAkrushik}</td>
                    <td>{r.jmVajasut}</td>
                    <td>{r.zpVajasut}</td>
                    <td>{r.gpVajasut}</td>
                    <td>{r.addlLandRevenue}</td>
                    <td>{r.educationalCess}</td>
                    <td>{r.addlEducationalCess}</td>
                    <td>{r.employeeGuaranteeScheme}</td>
                    <td>{r.preYearPendingJm}</td>
                    <td>{r.preYearPendingZp}</td>
                    <td>{r.preYearPendingGp}</td>
                    <td>{r.preYearPendingAddlLandRevenue}</td>
                    <td>{r.preYearPendingEducationalCess}</td>
                    <td>{r.preYearPendingAddlEducationalCess}</td>
                    <td>{r.preYearPendingEmployeeGuaranteeScheme}</td>
                    <td>{r.miscellaneousAmount}</td>
                    <td>{r.netAmount}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default DemandGenerationReport;
