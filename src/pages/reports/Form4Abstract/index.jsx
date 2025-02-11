import React, { useEffect, useRef, useState } from 'react';
import styles from './report.module.css';

import { DeleteOutlined, EditTwoTone, EyeTwoTone, SearchOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card, Col, message, Row, Select, Form, Tooltip } from 'antd';
import Axios from 'axios';
import URLS from '@/URLs/urls';
import useAxios from '@/components/eComponents/use-axios';
import VillageSelector from '@/components/eComponents/VillageSelector';
import { useModel } from 'umi';
import { FormattedMessage } from 'umi';
import { useReactToPrint } from 'react-to-print';
import ReactHtmlTableToExcel from 'react-html-table-to-excel';

function VillageForm() {
  const { sendRequest } = useAxios();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const backToHomeButton = () => {
    history.push({ pathname: '/homepage' });
  };
  const { districtName, talukaName, districtCode, talukaCode } = useModel('details');
  const [textVillage, setTextVillage] = useState();
  const [codeVillage, setCodeVillage] = useState('');
  const [village, setVillage] = useState([]);
  const [tableData, setTableData] = useState();
  const [isNirank, setIsNirank] = useState(false);
  const [villageForm4Abstract, setVillageForm4Abstract] = useState();
  const [revenueYear, setRevenueYear] = useState('2024-25');
  const [sthanikUpkar, setSthanikUpkar] = useState();
  const [jaminMahsul, setJaminMahsul] = useState();
  const [ekunJaminMahsul, setEkunJaminMahsul] = useState();
  const [sthanikUpkarAslela, setSthanikUpkarAslela] = useState();
  const [sthanikUpkarNaslela, setSthanikUpkarNaslela] = useState();
  const [vasuli, setVasuli] = useState();
  const [shillakh, setShillakh] = useState();
  const componentRef = useRef();
  const [revenueYearForVillage, setRevenueYearForVillage] = useState();

  useEffect(() => {
    getRevenueYear();
  }, []);

  const onYearChange = (value, event) => {
    setRevenueYear(value);
    setVillageForm4Abstract();
    setSthanikUpkar();
    setJaminMahsul();
    setSthanikUpkarAslela();
    setSthanikUpkarNaslela();
    setEkunJaminMahsul();
    setVasuli();
    setShillakh();
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

  const getDataForForm4 = async () => {
    sendRequest(
      `${URLS.BaseURL}/reports/getForm4GhoshwaraReport?revenueYear=${revenueYear}&cCode=${codeVillage}`,
      'GET',
      null,
      (r) => {
        // console.log('responase for table==>', r.data);
        setSthanikUpkar(r.data.form17Data[0].ekunSthanikUpkar);
        setJaminMahsul(r.data.form17Data[0].jaminMahsul);
        setSthanikUpkarAslela(r.data.form17Data[0].sthanikUpkarAslela);
        setSthanikUpkarNaslela(r.data.form17Data[0].sthanikUpkarNaslela);
        setEkunJaminMahsul(r.data.form17Data[0].ekunJaminMahsul);
        setVasuli(r.data.form17Data[0].vasuli);
        setShillakh(r.data.form17Data[0].shillak);

        setVillageForm4Abstract(
          r.data.form17Data.map((r) => ({
            srNo: r.id,
            ekunSthanikUpkar: r.ekunSthanikUpkar,
            ekunJaminMahsul: r.ekunJaminMahsul,
            jaminMahsul: r.jaminMahsul,
            sthanikUpkarAslela: r.sthanikUpkarAslela,
            sthanikUpkarNaslela: r.sthanikUpkarNaslela,
            shillak: r.shillak,
            vasuli: r.vasuli,
          })),
        );
        message.success('Records Fetched!!');
      },
    );
  };

  return (
    <div>
      <Card>
        <h1 style={{ textAlign: 'center' }}>
          <FormattedMessage id="villageForm17.table.form4LabelAbstract" />
        </h1>
        <div style={{ padding: 10 }}>
          <Button type="primary" onClick={handlePrint}>
            <FormattedMessage id="formLanguage.button.print" />
          </Button>
          <Button style={{ float: 'right' }} onClick={backToHomeButton} type="primary">
            <FormattedMessage id="formLanguage.form.backhomeButton" />
          </Button>
        </div>
        <Row style={{ marginBottom: 10, padding: 10 }}>
          <Col span={19}>
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
              style={{ marginTop: 10 }}
              labelCol={{ lg: 12 }}
              wrapperCol={{ lg: 12 }}
              label={<FormattedMessage id="villageSelector.label.revenueYear" />}
            >
              <Select
                // style={{ width: 200, marginRight: '15px' }}
                options={revenueYearForVillage}
                value={revenueYear}
                placeholder={'महसूल वर्ष'}
                onChange={(value, event) => onYearChange(value, event)}
                // disabled
              ></Select>
            </Form.Item>
          </Col>
        </Row>
        <Button
          onClick={() => {
            if (textVillage && revenueYear) {
              getDataForForm4();
            } else if (textVillage == null) {
              message.info('Please Select Village');
            } else if (revenueYear == null) {
              message.info('Please Select Revenue Year');
            }
          }}
          type="primary"
        >
          <FormattedMessage id="formLanguage.form.getData" />
        </Button>
      </Card>
      <ComponentToPrint
        ref={componentRef}
        village={textVillage}
        taluka={talukaName}
        district={districtName}
        dataToMap={villageForm4Abstract}
        sthanikUpkar={sthanikUpkar}
        ekunJaminMahsul={ekunJaminMahsul}
        jaminMahsul={jaminMahsul}
        sthanikUpkarAslela={sthanikUpkarAslela}
        sthanikUpkarNaslela={sthanikUpkarNaslela}
        vasuli={vasuli}
        shillakh={shillakh}
      />
    </div>
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
                  <th colSpan={2}>
                    <h2 style={{ color: 'red' }}>
                      <b>
                        <FormattedMessage id="villageForm17.table.form4LabelAbstract" />
                      </b>
                    </h2>
                  </th>
                </tr>
                <tr>
                  <th colSpan="2">
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
                  <td></td>
                  {/*   <td>
                    <b>
                      <FormattedMessage id="form1abstract.area" />
                      <br />
                      (हे.आर.चौमी)
                    </b>
                  </td> */}
                  <td>
                    <b>
                      <FormattedMessage id="form1abstract.assessment" />
                      <br />
                      (रु.पैसे)
                    </b>
                  </td>
                  {/* <td>
                    <b>
                      <FormattedMessage id="form1abstract.remarks" />
                    </b>
                  </td> */}
                </tr>
              </thead>
              <tbody>
                
                <tr>
                  <td>
                    <b>
                      <u>एकूण स्थानिक उपकर</u>
                    </b>
                  </td>
                  <td>{this.props.sthanikUpkar}</td>
                  {/* <td>{this.props.tenureAssessment}</td> */}
                  {/* <td></td> */}
                </tr>
                <tr>
                  <td>
                    <b>
                      <u>जमीन महसूल</u>
                    </b>
                  </td>
                  <td>{this.props.jaminMahsul}</td>
                </tr>
                <tr>
                  <td>
                    <b>
                      <u>(एक) स्थानिक उपकर असलेला</u>
                    </b>
                    <br />
                    <b>
                      <u>(दोन) स्थानिक उपकर नसलेला</u>
                    </b>
                    <br />
                  </td>
                  <td>
                    {this.props.sthanikUpkarAslela} <br />
                    {this.props.sthanikUpkarNaslela}
                  </td>
                  {/* <td>{this.props.tenureAssessment}</td> */}
                  {/* <td></td> */}
                </tr>
                <tr>
                  <td>
                    <b>
                      <u>एकत्रिकृत जमीन महसूल</u>
                    </b>
                  </td>
                  <td>{this.props.ekunJaminMahsul}</td>
                  {/* <td>{this.props.tenure4Assessment}</td>
                  <td>{}</td> */}
                </tr>
                <tr>
                  <td>
                    <b>
                      <u>वसुली</u>
                    </b>
                  </td>
                  <td>{this.props.vasuli}</td>
                  {/* <td>{this.props.tenure3Assessment}</td>

                  <td>{}</td> */}
                </tr>
                <tr>
                  <td>
                    <b>
                      <u>शिल्लक</u>
                    </b>
                  </td>

                  <td>{this.props.shillakh}</td>
                  {/* <td>{}</td>
                  <td>{}</td> */}
                </tr>
              </tbody>
            </table>
          </Card>
        </div>
      </div>
    );
  }
}

export default VillageForm;
