import { PageContainer } from '@ant-design/pro-layout';
import styles from './report.module.css';
import React, { useRef, useState } from 'react';
import { Alert, Button, Card, Col, message, Row, Select, Spin, Form } from 'antd';
import useAxios from '@/components/eComponents/use-axios';
import { useHistory, useLocation } from 'react-router-dom';
import VillageSelector from '@/components/eComponents/VillageSelector';
import { useReactToPrint } from 'react-to-print';
import URLS from '@/URLs/urls';
import { useModel } from 'umi';
import { FormattedMessage } from 'umi';
import ReactHtmlTableToExcel from 'react-html-table-to-excel';
import { useEffect } from 'react';

function Report() {
  const { sendRequest } = useAxios();
  const { districtName, talukaName, districtCode, talukaCode } = useModel('details');
  const [codeVillage, setCodeVillage] = useState('');
  const [textForVillage, setTextForVillage] = useState();
  const [village, setVillage] = useState([]);
  const [tableData, setTableData] = useState();
  const [textVillage, setTextVillage] = useState('');
  const componentRef = useRef();
  const [revenueYear, setRevenueYear] = useState();
  const [isNirank, setIsNirank] = useState(false);
  const [revenueYearForVillage, setRevenueYearForVillage] = useState();
  const history = useHistory();
  const [totalArea, setTotalArea] = useState(0);
  const [netAssessment, setNetAssessment] = useState(0);
  const [netAffectedArea, setNetAffectedArea] = useState(0);
  const [loading, setLoading] = useState(false);

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
    setTableData();
    setTotalArea(0);
    setNetAssessment(0);
    setNetAffectedArea(0);
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
    setTotalArea(0);
    setNetAssessment(0);
    setNetAffectedArea(0);
    setLoading(true);

    sendRequest(
      `${URLS.BaseURL}/form17/getForm17Report?revenueYear=${revenueYear}&districtCode=${districtCode}&talukaCode=${talukaCode}&cCode=${codeVillage}`,
      'GET',
      null,
      (res) => {
        res.data.form17Data.map((r) => {
          setTotalArea((prevTotalArea) => prevTotalArea + parseFloat(r.totalArea));
          setNetAssessment((prevTotalAssessment) => prevTotalAssessment + parseFloat(r.assessment));
          setNetAffectedArea((prevAffectedArea) => prevAffectedArea + parseFloat(r.areaAffected));
        });
        // console.log('report 17 data', res.data);
        setTableData(
          res.data.form17Data.map((row) => ({
            khataNo: row.khataNo === null ? row.makhtaKhataNo : row.khataNo,
            caseNo: row.caseNo,
            id: row.id,
            totalArea: row.totalArea,
            assessment: row.assessment,
            personLiable: row.personLiable,
            natureOfCase: row.natureOfCase,
            areaAffected: row.areaAffected,
            amountOfJm: row.amountOfJm,
            amountOfZp: row.amountOfZp,
            amountOfGp: row.amountOfGp,
            periodIfMoreThanOneYear: row.periodIfMoreThanOneYear,
            noteOfEntryInTalukaFormIV: row.noteOfEntryInTalukaFormIV,
            // irrigatedArea: r.irrigatedArea,
            // unirrigatedArea: r.unirrigatedArea,
          })),
        );
        message.success('Records Fetched!!');
        setLoading(false);
      },
      setLoading(false),
    );
  };
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
              <FormattedMessage id="villageForm17.table.villageLabel" />
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
        {!isNirank && (
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
            डेटा मिळवा
          </Button>
        )}
        {loading === true ? (
          <Spin size="large" style={{ marginLeft: '530px', marginTop: '20px' }} />
        ) : null}
        {/* </Row> */}
      </Card>
      <ComponentToPrint
        ref={componentRef}
        village={textVillage}
        taluka={talukaName}
        district={districtName}
        dataToMap={tableData}
        isNirank={isNirank}
        totalArea={totalArea.toFixed(2)}
        netAssessment={netAssessment}
        netAffectedArea={netAffectedArea.toFixed(2)}
      />
    </div>
  );
}

//http://203.129.224.92:8089/echawdi/api/form17/getForm17Report

class ComponentToPrint extends React.Component {
  render() {
    return (
      <div className="report" style={{ marginTop: '15px', padding: '13px' }}>
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
              <th colSpan="13">
                <h3 style={{ color: 'red' }}>
                  <b>
                    <FormattedMessage id="villageForm17.table.villageLabel" />
                  </b>
                </h3>
              </th>
            </tr>
            <tr>
              <th colSpan="13">
                <h3 style={{ color: 'red' }}>
                  <b>प्रकरणाचा अहवाल</b>
                </h3>
              </th>
            </tr>
            <tr>
              <th colSpan="13">
                <h3 style={{ color: 'red' }}>
                  <b>प्रकरणाचे वर्णन (दोन किंवा तीन शब्दात)</b>
                </h3>
              </th>
            </tr>
            <tr>
              <th colSpan="13">
                <h4 style={{ color: 'red' }}>
                  <b>शेतीद्वारे सरकारी जमिनीचे अतिक्रमण - विविध महसूल आकारणीचा अहवाल</b>
                </h4>
              </th>
            </tr>

            <tr>
              <td>
                <b>अ.क्र.</b>
              </td>
              <td>
                <b>खाता क्र.</b>
              </td>
              <td>
                <b> जबाबदार व्यक्ती</b>
              </td>
              <td>
                <b>केसचे स्वरूप</b>
              </td>
              <td>
                <b>एकूण क्षेत्रफळ</b>
              </td>
              <td>
                <b>प्रभावित क्षेत्र</b>
              </td>
              <td>
                <b>आकारणी </b>
              </td>

              <td>
                <b>एलआरची रक्कम स्वतंत्रपणे</b>
              </td>
              <td>
                <b>एलसीची रक्कम स्वतंत्रपणे</b>
              </td>
              <td>
                <b>ग्रा.प रक्कम स्वतंत्रपणे</b>
              </td>
              <td>
                <b>वर्षापेक्षा जास्त कालावधी</b>
              </td>
              <td>
                <b>तालुका प्रपत्र IV मध्ये नोंदीची नोंद</b>
              </td>
              <td>
                <b>गाव नमुना IV चा अनुक्रमांक</b>
              </td>
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
              <td>9</td>
              <td>10</td>
              <td>11</td>
              <td>12</td>
              <td>13</td>
            </tr>
            </thead>
            {this.props.dataToMap &&
              this.props.dataToMap.map((r, i) => (
                <tr>
                  <td>{i + 1}</td>
                  <td>{r.khataNo}</td>
                  <td>{r.personLiable}</td>
                  <td>{r.natureOfCase}</td>
                  <td>{r.totalArea}</td>
                  <td>{r.areaAffected}</td>
                  <td>{r.assessment}</td>
                  <td>{r.amountOfJm}</td>
                  <td>{r.amountOfZp}</td>
                  <td>{r.amountOfGp}</td>
                  <td>{r.periodIfMoreThanOneYear}</td>
                  <td>{r.noteOfEntryInTalukaFormIV}</td>
                  <td></td>
                </tr>
              ))}

            {this.props.isNirank && (
              <tr>
                <th colSpan={19}>
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

            <tr>
              <td colSpan={4}>
                <b>
                  <FormattedMessage id="formLanguage.form.total" />
                </b>
              </td>
              <td>
                <b>{this.props.totalArea}</b>
              </td>
              <td>
                <b>{this.props.netAffectedArea}</b>
              </td>
              <td>
                <b>{this.props.netAssessment}</b>
              </td>
              <td colSpan={7}></td>
            </tr>
            {/*   <tr style={{ height: '20px' }}>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr> */}
          </table>
        </Card>
      </div>
    );
  }
}

export default Report;
