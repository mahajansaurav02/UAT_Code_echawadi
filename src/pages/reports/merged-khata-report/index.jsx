import { PageContainer } from '@ant-design/pro-layout';
import styles from './report.module.css';
import React, { useState, useRef, useEffect } from 'react';
import { Button, Card, Col, message, Row, Select, Spin } from 'antd';
import { useHistory, useLocation } from 'react-router-dom';
import Axios from 'axios';
import VillageSelector from '@/components/eComponents/VillageSelector';
import BaseURL from '@/URLs/urls';
import { useReactToPrint } from 'react-to-print';
import useAxios from '@/components/eComponents/use-axios';
import URLS from '@/URLs/urls';
import { useModel } from 'umi';
import { FormattedMessage } from 'umi';

function mergerdKhataReport() {
  const [codeVillage, setCodeVillage] = useState('');
  const [textForVillage, setTextForVillage] = useState();
  const [village, setVillage] = useState([]);
  const [tableData, setTableData] = useState();
  const [isNirank, setIsNirank] = useState(false);
  const [textVillage, setTextVillage] = useState('');
  const componentRef = useRef();
  const { sendRequest } = useAxios();
  const { districtName, talukaName, districtCode, talukaCode } = useModel('details');
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  // const [revenueYear, setRevenueYear] = useState;
  const backToHomeButton = () => {
    history.push({ pathname: '/homepage' });
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const getMergedKhataDetails = async () => {
    setLoading(true);

    sendRequest(
      `${URLS.BaseURL}/khatamerge/getReportKhataMergeDetails?cCode=${codeVillage}`,
      'GET',
      null,
      (res) => {
        setTableData(
          res.data.khataMergeDtlLst.map((r) => ({
            // srNo: index + 1,
            parentId: r.parentId,
            idForSelector: r.khataNo,
            khataNo: r.khataNo,
            surveyHissaNo: r.surveyHissaNo,
            khataOwnerName: r.khataOwnerName,
            area: r.area,
            assessment: r.assessment,
            mergeId: r.mergeId,
            childKhataNumbers: r.childKhataNumbers,
          })),
        );
        setLoading(false);

        message.success('Records Fetched!!');
      },
      (err) => {
        setLoading(false);
      },
    );
  };

  return (
    <div>
      <Card>
        <h1 style={{ textAlign: 'center' }}>
          <b>खाता एकत्रीकरण</b>
        </h1>
        <div style={{ padding: 10 }}>
          <Button type="primary" onClick={handlePrint}>
            <FormattedMessage id="villageReport1A.button.print" />
          </Button>
          <Button style={{ float: 'right' }} onClick={backToHomeButton} type="primary">
            <FormattedMessage id="villageReport1A.button.home" />
          </Button>
        </div>
        {/* <Row style={{ marginLeft: '15px' }}> */}
        <VillageSelector
          pageType="withoutYear"
          setCodeVillage={setCodeVillage}
          setTextForVillage={setTextForVillage}
          onVillageChange={(setVillage, setTableData)}
          //yearChange={setRevenueYear}
          setIsNirank={setIsNirank}
        />

        <Button
          onClick={() => {
            if (textForVillage) {
              getMergedKhataDetails();
            } else if (textForVillage == null) {
              message.info('Please Select Village');
            }
          }}
          type="primary"
        >
          <FormattedMessage id="villageReport1A.button.getData" />
        </Button>
        {loading === true ? (
          <Spin size="large" style={{ marginLeft: '530px', marginTop: '20px' }} />
        ) : null}
        {/* </Row> */}
      </Card>
      <ComponentToPrint
        ref={componentRef}
        village={textForVillage}
        taluka={talukaName}
        district={districtName}
        dataToMap={tableData}
        // totalVillageForest={totalVillageForestAreaOfAll}
        // totalProtectedForest={totalProtectedForestAreaOfAll}
        // totalReservedForest={totalReservedForestAreaOfAll}
      />
    </div>
  );
}

class ComponentToPrint extends React.Component {
  render() {
    return (
      <div>
        <div className="report">
          <Card>
            <table className={styles.report_table}>
              <thead>
                <tr>
                  <th colSpan="11">
                    <h3 style={{ color: 'red' }}>
                      <b>खाता एकत्रीकरण</b>
                    </h3>
                  </th>
                </tr>
                <tr>
                  <th colSpan="11">
                    <pre>
                      <h3 style={{ color: 'red', fontSize: '20' }}>
                        <b>
                          <FormattedMessage id="villageReport1A.label.village" />
                          {this.props.village}{' '}
                          <FormattedMessage id="villageReport1A.label.taluka" />
                          {this.props.taluka}{' '}
                          <FormattedMessage id="villageReport1A.label.district" />
                          {this.props.district}
                        </b>
                      </h3>
                    </pre>
                  </th>
                </tr>
                <tr>
                  <th colSpan={1} rowSpan={4}>
                    <b>
                      <FormattedMessage id="demandGeneration.table.khataNo" />
                    </b>
                  </th>
                  <th colSpan={1} rowSpan={4}>
                    <b>
                      <FormattedMessage id="demandGeneration.table.mergeId" />
                    </b>
                  </th>
                  <th colSpan={1} rowSpan={4}>
                    <b>
                      <FormattedMessage id="formLanguage.form.combination" />
                    </b>
                  </th>
                  {/*  <th rowSpan={4} colSpan={1}>
                    <b>
                      <FormattedMessage id="formLanguage.table.surveyNo" />
                    </b>
                  </th> */}
                  <th rowSpan={4} colSpan={1}>
                    <b>
                      <FormattedMessage id="demandGeneration.table.khataOwnerName" />
                    </b>
                  </th>
                  <th rowSpan={4} colSpan={1}>
                    <b>
                      <FormattedMessage id="formLanguage.form.Area" />
                    </b>
                  </th>
                  <th rowSpan={4} colSpan={1}>
                    <b>
                      <FormattedMessage id="formLanguage.form.assessment" />
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
                  {/*  <td>7</td> */}
                </tr>
                {this.props.dataToMap &&
                  this.props.dataToMap.map((r) => (
                    <tr>
                      <td>{r.khataNo}</td>
                      <td>{r.mergeId}</td>
                      <td>{r.childKhataNumbers}</td>
                      {/*  <td>{r.surveyHissaNo}</td> */}
                      <td>{r.khataOwnerName}</td>
                      <td>{r.area}</td>
                      <td>{r.assessment}</td>
                    </tr>
                  ))}
                {/* 
                <tr>
                  <td colSpan={2}>
                    <b>
                      <FormattedMessage id="formLanguage.form.total" />
                    </b>
                  </td>

                  <td>
                    <b>{this.props.totalVillageForest}</b>
                  </td>
                  <td>
                    <b>{this.props.totalProtectedForest}</b>
                  </td>
                  <td>
                    <b>{this.props.totalReservedForest}</b>
                  </td>
                  <td colSpan={2}></td>
                </tr> */}
              </tbody>
            </table>
          </Card>
        </div>
      </div>
    );
  }
}
export default mergerdKhataReport;
