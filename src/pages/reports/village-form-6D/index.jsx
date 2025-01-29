import { PageContainer } from '@ant-design/pro-layout';
import styles from './report.module.css';
import React, { useState, useRef } from 'react';
import { Alert, Button, Card, Col, message, Row, Select, Spin } from 'antd';
import { useHistory, useLocation } from 'react-router-dom';
import Axios from 'axios';
import VillageSelector from '@/components/eComponents/VillageSelector';
import BaseURL from '@/URLs/urls';
import { useReactToPrint } from 'react-to-print';
import URLS from '@/URLs/urls';
import useAxios from '@/components/eComponents/use-axios';
import { useModel } from 'umi';
import { FormattedMessage } from 'umi';
import ReactHtmlTableToExcel from 'react-html-table-to-excel';

function Report6D() {
  const { districtName, talukaName, districtCode, talukaCode } = useModel('details');
  const { sendRequest } = useAxios();
  const [codeVillage, setCodeVillage] = useState('');
  const [isNirank, setIsNirank] = useState(false);

  const [textForVillage, setTextForVillage] = useState();
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
      `${URLS.BaseURL}/form6D/getForm6DReport?districtCode=${districtCode}&talukaCode=${talukaCode}&cCode=${codeVillage}`,
      'GET',
      null,
      (res) => {
        setTableData(
          res.data.form6DData.map((r) => ({
            id: r.id,
            mutationEntryInVillageForm6: r.mutationEntryInVillageForm6,
            surveyNoOrSubDivisionNo: r.surveyNoOrSubDivisionNo,
            natureOfChangeInMap: r.natureOfChangeInMap,
            byWhomDoneAndDate: r.byWhomDoneAndDate,
            dateOfChange: r.dateOfChange ? r.dateOfChange : '',
            byWhomDone: r.byWhomDone,
          })),
        );
        message.success('Records Fetched!!');
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
              {<FormattedMessage id="formLanguage.label.villageForm6D" />}
            </h1>
          </Col>
          <Col span={8}>
            <Button style={{ float: 'right' }} onClick={backToHomeButton} type="primary">
              <FormattedMessage id="formLanguage.form.backhomeButton" />
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
            {!isNirank && (
              <Button
                onClick={() => {
                  if (textForVillage) {
                    getTableData();
                  } else if (textForVillage == null) {
                    message.info('Please Select Village !');
                  }
                }}
                type="primary"
              >
                <FormattedMessage id="formLanguage.form.getData" />
              </Button>
            )}
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
        isNirank={isNirank}
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
                        {<FormattedMessage id="formLanguage.form.reportForm6D" />}:
                        {<FormattedMessage id="formLanguage.label.villageForm6DD" />}
                      </b>
                    </h3>
                  </th>
                </tr>
                <tr>
                  <th colSpan="17">
                    <h4 style={{ color: 'red' }}>
                      <pre>
                        <b>
                          <FormattedMessage id="villageReport1.label.village" />
                          {this.props.village}
                          <FormattedMessage id="villageReport1.label.taluka" />
                          {this.props.taluka}
                          <FormattedMessage id="villageReport1.label.district" />
                          {this.props.district}
                        </b>
                      </pre>
                    </h4>
                  </th>
                </tr>

                <tr>
                  <th colSpan={1} rowSpan={1}>
                    <b>
                      {<FormattedMessage id="formLanguage.label.mutationEntryInVillageForm6" />}
                    </b>
                  </th>
                  <th rowSpan={1} colSpan={1}>
                    <b>
                      <FormattedMessage id="formLanguage.form.surveyNoOrsubDivisionNo" />
                    </b>
                  </th>
                  <th rowSpan={1} colSpan={1}>
                    {/* <b>Khata No</b> */}
                    <b>{<FormattedMessage id="formLanguage.form.natureOfChangeRequiredInMap" />}</b>
                  </th>
                  <th rowSpan={1} colSpan={1}>
                    <b>{<FormattedMessage id="formLanguage.form.byWhomDoneandDate" />}</b>

                    {/* <b>year</b> */}
                  </th>
                </tr>
                <tr>
                  <td>1</td>
                  <td>2</td>
                  <td>3</td>
                  <td>4</td>
                </tr>
              </thead>
              <tbody>
               
                {this.props.dataToMap &&
                  this.props.dataToMap.map((r) => (
                    <tr>
                      <td>{r.mutationEntryInVillageForm6}</td>
                      <td>{r.surveyNoOrSubDivisionNo}</td>
                      <td>{r.natureOfChangeInMap}</td>
                      <td>
                        {r.byWhomDone}/{r.dateOfChange}
                      </td>
                    </tr>
                  ))}

                {this.props.isNirank && (
                  <tr>
                    <th colSpan={18}>
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
              </tbody>
            </table>
          </Card>
        </div>
      </div>
    );
  }
}

export default Report6D;
