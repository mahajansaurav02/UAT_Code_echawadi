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

function Report6B() {
  const { districtName, talukaName, districtCode, talukaCode } = useModel('details');
  const { sendRequest } = useAxios();
  const [codeVillage, setCodeVillage] = useState('');
  const [textForVillage, setTextForVillage] = useState();
  const [village, setVillage] = useState([]);
  const [tableData, setTableData] = useState();
  const [textVillage, setTextVillage] = useState('');
  const componentRef = useRef();
  const [revenueYear, setRevenueYear] = useState();
  const [isNirank, setIsNirank] = useState(false);
  const [loadings, setLoadings] = useState([]);

  const history = useHistory();

  const backToHomeButton = () => {
    history.push({ pathname: '/homepage' });
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const enterLoading = (index) => {
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[index] = true;
      return newLoadings;
    });
    setTimeout(() => {
      setLoadings((prevLoadings) => {
        const newLoadings = [...prevLoadings];
        newLoadings[index] = false;
        return newLoadings;
      });
    }, 2000);
  };

  const getTableData = async () => {
    // localhost:8089/echawdi/api/form6B/getForm6BReport

    sendRequest(
      `${URLS.BaseURL}/form6B/getForm6BReport?districtCode=${districtCode}&talukaCode=${talukaCode}&cCode=${codeVillage}`,
      'GET',
      null,
      (res) => {
        setTableData(
          res.data.form6BData.map((r, i) => ({
            srNo: i + 1,
            entryInVillageForm6: r.entryInVillageForm6,
            nameOfAcquirerOfRightOrHolderOfDocument: r.nameOfAcquirerOfRightOrHolderOfDocument,
            orderOfTahsildarAsFine: r.orderOfTahsildarAsFine,
            receiptNo: r.receiptNo,
            receiptDate: r.receiptDate,
            entryVillageForm6: r.entryVillageForm6,
            nameOfAcquirerOfRight: r.nameOfAcquirerOfRight,
          })),
        );
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
              {<FormattedMessage id="formLanguage.label.villageForm6B" />}
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
            {!isNirank && (
              <Button
                loading={loadings[0]}
                onClick={() => {
                  if (textForVillage) {
                    getTableData();
                    enterLoading(0);
                  } else if (textForVillage == null) {
                    message.info('Please Select Village');
                  }
                }}
                type="primary"
              >
                डेटा मिळवा
              </Button>
            )}
          </Col>
        </Row>
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
                      <b>{<FormattedMessage id="formLanguage.label.villageForm6B" />}</b>
                    </h3>
                  </th>
                </tr>

                <tr>
                  <th colSpan="17">
                    <h3 style={{ color: 'red' }}>
                      <b>{<FormattedMessage id="formLanguage.label.villageForm6BB" />}</b>
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
                    <b>{<FormattedMessage id="formLanguage.form.entryInVillageForm6" />}</b>
                  </th>
                  <th rowSpan={1} colSpan={1}>
                    <b>{<FormattedMessage id="formLanguage.form.nameOfAcquirerOfRight" />}</b>
                  </th>
                  <th rowSpan={1} colSpan={1}>
                    {/* <b>Khata No</b> */}
                    <b>{<FormattedMessage id="formLanguage.form.orderOfTahashil" />}</b>
                  </th>
                  <th rowSpan={1} colSpan={1}>
                    <b>{<FormattedMessage id="formLanguage.form.receiptNo" />}</b>

                    {/* <b>year</b> */}
                  </th>
                  <th rowSpan={1} colSpan={1}>
                    <b>{<FormattedMessage id="formLanguage.form.receiptDate" />}</b>

                    {/* <b>year</b> */}
                  </th>
                </tr>
                <tr>
                  <td>1</td>
                  <td>2</td>
                  <td>3</td>
                  <td>4</td>
                  <td>5</td>
                </tr>
              </thead>
              <tbody>
           
                {this.props.dataToMap &&
                  this.props.dataToMap.map((r, i) => (
                    <tr>
                      <td>{r.entryVillageForm6}</td>
                      <td>{r.nameOfAcquirerOfRight}</td>
                      <td>{r.orderOfTahsildarAsFine}</td>
                      <td>{r.receiptNo}</td>
                      <td>{r.receiptDate}</td>
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

export default Report6B;
