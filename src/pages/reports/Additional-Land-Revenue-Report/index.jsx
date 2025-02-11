import { PageContainer } from '@ant-design/pro-layout';
import styles from './report.module.css';
import React, { useState, useRef, useEffect } from 'react';
import { Button, Card, Col, message, Row, Select, Form } from 'antd';
import { useHistory, useLocation } from 'react-router-dom';
import Axios from 'axios';
import VillageSelector from '@/components/eComponents/VillageSelector';
import BaseURL from '@/URLs/urls';
import { useReactToPrint } from 'react-to-print';
import URLS from '@/URLs/urls';
import useAxios from '@/components/eComponents/use-axios';
import { useModel } from 'umi';
import { FormattedMessage } from 'umi';

let prevTotalArea = 0,
  prevAssessment = 0;

function AddLandRevenue() {
  const { districtName, talukaName, districtCode, talukaCode } = useModel('details');
  const { sendRequest } = useAxios();
  const [codeVillage, setCodeVillage] = useState('');
  const [textForVillage, setTextForVillage] = useState();
  const [village, setVillage] = useState([]);
  const [tableData, setTableData] = useState();
  const [textVillage, setTextVillage] = useState('');
  const componentRef = useRef();
  const [revenueYear, setRevenueYear] = useState('2024-25');
  const [isNirank, setIsNirank] = useState(false);
  const history = useHistory();
  const [totalArea, setTotalArea] = useState(0);
  const [netEnchroachedArea, setNetEnchroachedArea] = useState(0);
  const [loadings, setLoadings] = useState([]);
  const [revenueYearForVillage, setRevenueYearForVillage] = useState();

  const backToHomeButton = () => {
    history.push({ pathname: '/homepage' });
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  useEffect(() => {
    getRevenueYear();
  }, []);

  useEffect(() => {
    (prevTotalArea = 0), (prevAssessment = 0);
  }, []);

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
    (prevTotalArea = 0), (prevAssessment = 0);
    sendRequest(
      `${URLS.BaseURL}/additionalLandRevenue/ReportGetAdditionalLandRevenue?cCode=${codeVillage}&revenueYear=${revenueYear}`,
      'GET',
      null,
      (res) => {
        setTableData(
          res.data.additionalLandRevenueData.map((r, i) => ({
            id: r.id,
            srNo: i + 1,
            khataNo: r.khataNo,
            area: r.area,
            assessment: r.assessment,
            checkboxgroup: r.checkboxgroup,
            khataOwnerName: r.khataOwnerName,
            remarks: r.remarks,
            allTotal: getTotalOfAll(r.area, r.assessment),
          })),
        );
        message.success('Records Fetched!!');
      },
    );
    (err) => {};
  };

  var totalAreaAddition = prevTotalArea.toFixed(4).substring(prevTotalArea.length - 2);
  var totalAreaOfAll = totalAreaAddition
    .substring(0, totalAreaAddition.length - 2)
    .concat('.')
    .concat(totalAreaAddition.substring(totalAreaAddition.length - 2));

  return (
    <div>
      <Card>
        <h1 style={{ textAlign: 'center' }}>
          <FormattedMessage id="formLanguage.form.addLandRev" />
        </h1>
        <div style={{ padding: 10 }}>
          <Button type="primary" onClick={handlePrint}>
            <FormattedMessage id="formLanguage.button.print" />
          </Button>
          <Button style={{ float: 'right' }} onClick={backToHomeButton} type="primary">
            <FormattedMessage id="formLanguage.form.backhomeButton" />
          </Button>
        </div>
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
                value={revenueYear}
                placeholder={'महसूल वर्ष'}
                onChange={(value, event) => onYearChange(value, event)}
                // disabled
              ></Select>
            </Form.Item>
          </Col>
        </Row>
        <Button
          loading={loadings[0]}
          onClick={() => {
            if (textForVillage && revenueYear) {
              getTableData();
              enterLoading(0);
            } else if (textForVillage == null) {
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
        village={textForVillage}
        taluka={talukaName}
        district={districtName}
        dataToMap={tableData}
        totalArea={totalAreaOfAll}
        netAssessment={prevAssessment.toFixed(2)}
      />
    </div>
  );
}

function getTotalOfAll(area, assessment) {
  prevTotalArea += parseFloat(area);
  prevAssessment += parseFloat(assessment);
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
                  <th colSpan="11">
                    <h3 style={{ color: 'red' }}>
                      <b>
                        <FormattedMessage id="formLanguage.form.addLandRev" />
                      </b>
                    </h3>
                  </th>
                </tr>

                <tr>
                  <th colSpan="11">
                    <h4 style={{ color: 'red' }}>
                      <pre>
                        {' '}
                        <b>
                          <FormattedMessage id="villageReport1.label.village" />
                          {this.props.village} <FormattedMessage id="villageReport1.label.taluka" />
                          {this.props.taluka}{' '}
                          <FormattedMessage id="villageReport1.label.district" />
                          {this.props.district}
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
                      <FormattedMessage id="demandGeneration.table.khataNo" />
                    </b>
                  </th>
                  <th>
                    <b>
                      <FormattedMessage id="oneTimeEntry.form.khataOwner" />
                    </b>
                  </th>
                  <th>
                    <b>
                      <FormattedMessage id="formLanguage.form.Area" />
                    </b>
                  </th>
                  <th>
                    <b>
                      <FormattedMessage id="formLanguage.form.assessment" />
                    </b>
                  </th>
                  <th>
                    <b>
                      <FormattedMessage id="formLanguage.table.percentage" />
                    </b>
                  </th>
                  <th>
                    <b>
                      <FormattedMessage id="formLanguage.form.addLandInf" />
                    </b>
                  </th>
                  {/* <th>
                    <b>
                      <FormattedMessage id="villageForm1E.table.detectionOfEnchroachment" />
                    </b>
                  </th>
                  <th>
                    <b>
                      <FormattedMessage id="villageForm1E.table.rentRecoverable" />
                    </b>
                  </th>
                  <th>
                    <b>
                      <FormattedMessage id="villageForm1E.table.enchroachmentColumn" />
                    </b>
                  </th>
                  <th>
                    <b>
                      <FormattedMessage id="formLanguage.table.remark" />
                    </b>
                  </th> */}
                </tr>

                <tr>
                  <th>1</th>
                  <th>2</th>
                  <th>3</th>
                  <th>4</th>
                  <th>5</th>
                  <th>6</th>
                  <th>7</th>
                  {/* <th>8</th>
                  <th>9</th>
                  <th>10</th>
                  <th>11</th> */}
                </tr>
              </thead>
              <tbody>
                {this.props.dataToMap &&
                  this.props.dataToMap.map((r) => (
                    <tr>
                      <td>{r.srNo}</td>
                      <td>{r.khataNo}</td>
                      <td>{r.khataOwnerName}</td>
                      <td>{r.area}</td>
                      <td>{r.assessment}</td>
                      <td>{r.checkboxgroup} </td>
                      <td>{r.remarks}</td>
                    </tr>
                  ))}
                <tr>
                  <td colSpan={3}>
                    <b>
                      <FormattedMessage id="formLanguage.form.total" />
                    </b>
                  </td>
                  <td>
                    {' '}
                    <b>{this.props.totalArea}</b>
                  </td>
                  <td>
                    {' '}
                    <b>{this.props.netAssessment}</b>
                  </td>
                  <td colSpan={6}></td>
                </tr>
              </tbody>
            </table>
          </Card>
        </div>
      </div>
    );
  }
}

export default AddLandRevenue;
