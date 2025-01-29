import { Button, Card, Col, message, Row, Select } from 'antd';
import styles from './report.module.css';
import React, { useState, useRef, useEffect } from 'react';
import VillageSelector from '@/components/eComponents/VillageSelector';
import BaseURL from '@/URLs/urls';
import { useReactToPrint } from 'react-to-print';
import URLS from '@/URLs/urls';
import useAxios from '@/components/eComponents/use-axios';
import { useModel } from 'umi';
import { useHistory, useLocation } from 'react-router-dom';
import { FormattedMessage } from 'umi';
import { ConsoleSqlOutlined } from '@ant-design/icons';

function index() {
  const { districtName, talukaName, districtCode, talukaCode } = useModel('details');
  const { sendRequest } = useAxios();
  const [codeVillage, setCodeVillage] = useState('');
  const [textForVillage, setTextForVillage] = useState();
  const [village, setVillage] = useState([]);
  const [tableData, setTableData] = useState();
  const [textVillage, setTextVillage] = useState('');
  const componentRef = useRef();
  const [revenueYear, setRevenueYear] = useState();
  const history = useHistory();

  useEffect(() => {
    getTableData();
  }, []);

  const backToHomeButton = () => {
    history.push({ pathname: '/homepage' });
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const getTableData = async () => {
    sendRequest(
      `${URLS.BaseURL}/m_village/getvillagelist?districtCode=${districtCode}&talukaCode=${talukaCode}&cCode=${codeVillage}`,
      'GET',
      null,
      (res) => {
        setTableData(
          res.data.villageData.map((r, i) => ({
            srNo: i + 1,

            id: r.id,
            districtname: r.districtname,
            talukaname: r.talukaname,
            villagename: r.villagename,
            form1: r.form1,
            form1abstract: r.form1abstract,
            form1a: r.form1a,
            form1b: r.form1b,
            form1d: r.form1d,
            form1e: r.form1e,
            form2: r.form2,
            form3: r.form3,
            form6b: r.form6b,
            form6d: r.form6d,
            form7a: r.form7a,
            form7b: r.form7b,
            form8c: r.form8c,
            form14: r.form14,
            form15: r.form15,
            form17: r.form17,
            form19: r.form19,
            form21: r.form21,
          })),
        );
      },
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
              <FormattedMessage id="villageForm.form.allVillageReport" />
            </h1>
          </Col>
          <Col span={8}>
            <Button style={{ float: 'right' }} onClick={backToHomeButton} type="primary">
              <FormattedMessage id="formLanguage.form.backhomeButton" />
            </Button>
          </Col>
        </Row>

        {/* <VillageSelector
          pageType="withYear"
          setCodeVillage={setCodeVillage}
          setTextForVillage={setTextForVillage}
          onVillageChange={(setVillage, setTableData)}
          yearChange={setRevenueYear}
        />
        <Row>
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
              <FormattedMessage id="formLanguage.form.getData" />
            </Button>
          </Col>
        </Row> */}
      </Card>
      <ComponentToPrint
        ref={componentRef}
        village={textForVillage}
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
      <div style={{ padding: '13px' }}>
        <div className="report">
          <Card>
            <table className={styles.report_table}>
              <thead>
                <tr>
                  <th colSpan={22}>
                    <h3 style={{ color: 'red' }}>
                      <b>
                        <FormattedMessage id="villageForm.form.allVillageReport" />
                      </b>
                    </h3>
                  </th>
                </tr>

                {/* <tr>
                  <th colSpan="20">
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
                </tr> */}

                <tr>
                  <th colSpan={1} rowSpan={4}>
                    <b>{<FormattedMessage id="villageForm.form.srno" />}</b>
                  </th>
                  <th colSpan={1} rowSpan={4}>
                    <b>
                      <FormattedMessage id="formLanguage.form.district" />
                    </b>
                  </th>
                  <th colSpan={1} rowSpan={4}>
                    <b>
                      <FormattedMessage id="formLanguage.form.taluka" />
                    </b>
                  </th>
                  <th colSpan={1} rowSpan={4}>
                    <b>
                      <FormattedMessage id="villageForm.form.allVillageName" />
                    </b>
                  </th>

                  <th rowSpan={4} colSpan={1}>
                    <b>
                      <FormattedMessage id="formLanguage.label.villageForm" />
                    </b>
                  </th>
                  <th rowSpan={4} colSpan={1}>
                    <b>
                      <FormattedMessage id="form1abstract.heading" />{' '}
                    </b>
                  </th>
                  <th rowSpan={4} colSpan={1}>
                    <b>
                      <FormattedMessage id="villageForm1A.table.villageForm1A" />
                    </b>
                  </th>
                  <th rowSpan={4} colSpan={1}>
                    <b>
                      <FormattedMessage id="formLanguage.label.villageForm1a" />
                    </b>
                  </th>
                  <th rowSpan={4} colSpan={1}>
                    <b>
                      <FormattedMessage id="formLanguage.form.villageForm1D" />
                    </b>
                  </th>
                  <th rowSpan={4} colSpan={1}>
                    <b>
                      <FormattedMessage id="villageForm1E.table.villageForm1E" />
                    </b>
                  </th>
                  <th rowSpan={4} colSpan={1}>
                    <b>
                      <FormattedMessage id="villageForm.form.VillageName2" />
                    </b>
                  </th>
                  <th rowSpan={4} colSpan={1}>
                    <b>
                      <FormattedMessage id="villageForm3.form.villageTitle" />
                    </b>
                  </th>
                  <th rowSpan={4} colSpan={1}>
                    <b>
                      <FormattedMessage id="formLanguage.label.villageForm6B" />
                    </b>
                  </th>
                  <th rowSpan={4} colSpan={1}>
                    <b>
                      <FormattedMessage id="formLanguage.label.villageForm6D" />
                    </b>
                  </th>
                  <th rowSpan={4} colSpan={1}>
                    <b>
                      <FormattedMessage id="villageForm.form.villageForm" />
                    </b>
                  </th>
                  <th colSpan={1} rowSpan={4}>
                    <b>
                      <FormattedMessage id="villageForm.form.villageForm7B" />
                    </b>
                  </th>
                  <th colSpan={1} rowSpan={4}>
                    <b>
                      <FormattedMessage id="villageForm8c.form.villageForm8c" />
                    </b>
                  </th>
                  <th colSpan={1} rowSpan={4}>
                    <b>
                      <FormattedMessage id="form14.fields.ruleReportHead" />
                    </b>
                  </th>
                  <th colSpan={1} rowSpan={4}>
                    <b>
                      <FormattedMessage id="form15.InwardOutward" />
                    </b>
                  </th>
                  <th colSpan={1} rowSpan={4}>
                    <b>
                      <FormattedMessage id="villageForm17.table.villageLabel" />
                    </b>
                  </th>
                  <th rowSpan={4} colSpan={1}>
                    <b>
                      <FormattedMessage id="villageForm19.title.villageName" />
                    </b>
                  </th>
                  <th rowSpan={4} colSpan={1}>
                    <b>
                      <FormattedMessage id="villageForm21.form.reuleVillageForm21" />
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
                  <td>9</td>
                  <td>10</td>
                  <td>11</td>
                  <td>12</td>
                  <td>13</td>
                  <td>14</td>
                  <td>15</td>
                  <td>16</td>
                  <td>17</td>
                  <td>18</td>

                  <td>19</td>
                  <td>20</td>
                  <td>21</td>
                  <td>22</td>
                </tr>

                {this.props.dataToMap &&
                  this.props.dataToMap.map((r, i) => (
                    <tr key={i}>
                      <td>{r.srNo}</td>
                      <td>{r.districtname}</td>
                      <td>{r.talukaname}</td>
                      <td>{r.villagename}</td>
                      <td style={{ backgroundColor: r.form1 > 0 ? 'skyblue' : 'white' }}>
                        {r.form1}
                      </td>
                      <td style={{ backgroundColor: r.form1abstract > 0 ? 'skyblue' : 'white' }}>
                        {r.form1abstract}
                      </td>
                      <td style={{ backgroundColor: r.form1a > 0 ? 'skyblue' : 'white' }}>
                        {r.form1a}
                      </td>
                      <td style={{ backgroundColor: r.form1b > 0 ? 'skyblue' : 'white' }}>
                        {r.form1b}
                      </td>
                      <td style={{ backgroundColor: r.form1d > 0 ? 'skyblue' : 'white' }}>
                        {r.form1d}
                      </td>
                      <td style={{ backgroundColor: r.form1e > 0 ? 'skyblue' : 'white' }}>
                        {r.form1e}
                      </td>
                      <td style={{ backgroundColor: r.form2 > 0 ? 'skyblue' : 'white' }}>
                        {r.form2}
                      </td>
                      <td style={{ backgroundColor: r.form3 > 0 ? 'skyblue' : 'white' }}>
                        {r.form3}
                      </td>
                      <td style={{ backgroundColor: r.form6b > 0 ? 'skyblue' : 'white' }}>
                        {r.form6b}
                      </td>
                      <td style={{ backgroundColor: r.form6d > 0 ? 'skyblue' : 'white' }}>
                        {r.form6d}
                      </td>
                      <td style={{ backgroundColor: r.form7a > 0 ? 'skyblue' : 'white' }}>
                        {r.form7a}
                      </td>
                      <td style={{ backgroundColor: r.form7b > 0 ? 'skyblue' : 'white' }}>
                        {r.form7b}
                      </td>
                      <td style={{ backgroundColor: r.form8c > 0 ? 'skyblue' : 'white' }}>
                        {r.form8c}
                      </td>
                      <td style={{ backgroundColor: r.form14 > 0 ? 'skyblue' : 'white' }}>
                        {r.form14}
                      </td>
                      <td style={{ backgroundColor: r.form15 > 0 ? 'skyblue' : 'white' }}>
                        {r.form15}
                      </td>
                      <td style={{ backgroundColor: r.form17 > 0 ? 'skyblue' : 'white' }}>
                        {r.form17}
                      </td>
                      <td style={{ backgroundColor: r.form19 > 0 ? 'skyblue' : 'white' }}>
                        {r.form19}
                      </td>
                      <td style={{ backgroundColor: r.form21 > 0 ? 'skyblue' : 'white' }}>
                        {r.form21}
                      </td>
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

export default index;
