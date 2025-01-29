import { PageContainer } from '@ant-design/pro-layout';
import styles from './report.module.css';
import React, { useState, useRef, useEffect } from 'react';
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

let prevTotalArea = 0,
  prevEnchroachedArea = 0;

function Report() {
  const { districtName, talukaName, districtCode, talukaCode } = useModel('details');
  const { sendRequest } = useAxios();
  const [codeVillage, setCodeVillage] = useState('');
  const [textForVillage, setTextForVillage] = useState();
  const [village, setVillage] = useState([]);
  const [tableData, setTableData] = useState();
  const [textVillage, setTextVillage] = useState('');
  const componentRef = useRef();
  const [isNirank, setIsNirank] = useState(false);
  const [revenueYear, setRevenueYear] = useState();
  const history = useHistory();
  const [totalArea, setTotalArea] = useState(0);
  const [netEnchroachedArea, setNetEnchroachedArea] = useState(0);
  const [loadings, setLoadings] = useState([]);

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

  useEffect(() => {
    (prevTotalArea = 0), (prevEnchroachedArea = 0);
  }, []);

  const getTableData = async () => {
    (prevTotalArea = 0), (prevEnchroachedArea = 0);

    sendRequest(
      `${URLS.BaseURL}/form1e/getForm1EReport?districtCode=${districtCode}&talukaCode=${talukaCode}&cCode=${codeVillage}`,
      'GET',
      null,
      (res) => {
        // console.log(res,'------------->>>>>');
        // try{
        setTableData(
          res.data?.form1EData?.map((r, i) => ({
            id: r?.id,
            pin: r?.hissaNo == null || r?.hissaNo.trim() == '' ? r?.pin : r?.pin + '/' + r?.hissaNo,
            nameOfEncroacher: r?.nameOfEncroacher,
            areaOfEncroached: r?.areaOfEncroached,
            totalArea: r?.totalArea,
            dateOfEncroachment: r?.dateOfEncroachment,
            // purposeOfEncroachmentLand: <FormattedMessage id={r.purposeOfEncroachmentLand} />,
            purposeOfEncroachmentLand: r?.purposeOfEncroachmentLand,
            yearFromWhichRentRecoverable: r?.yearFromWhichRentRecoverable,
            yearOfEncroachmentNotedIfRemoved: r?.yearOfEncroachmentNotedIfRemoved,
            dateOfDecisionOnEncroachment: r?.dateOfDecisionOnEncroachment,
            remarks: r?.remarks,
            srNo: i + 1,
            hissaNo: r?.hissaNo,
            allTotal: getTotalOfAll(r?.totalArea, r?.areaOfEncroached),
          })),
        );
        message.success('Records Fetched!!');
        // }
        // catch(err){
        //     console.log(err);
        // }
      },
      (err) => {
        message.error('Reports Details Not Found');
        setLoadings(false);
      },
    );
  };

  var totalAreaAddition = prevTotalArea.toFixed(4).substring(prevTotalArea.length - 2);
  var totalAreaOfAll = totalAreaAddition
    .substring(0, totalAreaAddition.length - 2)
    .concat('.')
    .concat(totalAreaAddition.substring(totalAreaAddition.length - 2));

  var totalEnchroachedAreaAddition = prevEnchroachedArea
    .toFixed(4)
    .substring(prevEnchroachedArea.length - 2);
  var totalEnchroachedAreaOfAll = totalEnchroachedAreaAddition
    .substring(0, totalEnchroachedAreaAddition.length - 2)
    .concat('.')
    .concat(totalEnchroachedAreaAddition.substring(totalEnchroachedAreaAddition.length - 2));

  return (
    <div>
      <Card>
        <h1 style={{ textAlign: 'center' }}>
          {/* गाव नमुना एक- ई */}
          <FormattedMessage id="villageForm1E.table.villageForm1E" />
        </h1>
        <div style={{ padding: 10 }}>
          <Button type="primary" onClick={handlePrint}>
            <FormattedMessage id="formLanguage.button.print" />
          </Button>
          <Button style={{ float: 'right' }} onClick={backToHomeButton} type="primary">
            <FormattedMessage id="formLanguage.form.backhomeButton" />
          </Button>
        </div>
        {/* <Row style={{ marginLeft: '15px' }}> */}
        <VillageSelector
          pageType="withoutYear"
          setCodeVillage={setCodeVillage}
          setTextForVillage={setTextForVillage}
          onVillageChange={(setVillage, setTableData)}
          yearChange={setRevenueYear}
          setIsNirank={setIsNirank}
        />
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
            <FormattedMessage id="formLanguage.form.getData" />
          </Button>
        )}

        {/* </Row> */}
      </Card>
      <ComponentToPrint
        ref={componentRef}
        village={textForVillage}
        taluka={talukaName}
        district={districtName}
        dataToMap={tableData}
        isNirank={isNirank}
        totalArea={totalAreaOfAll}
        netEnchroachedArea={totalEnchroachedAreaOfAll}
      />
    </div>
  );
}

function getTotalOfAll(totalArea, areaOfEncroached) {
  prevTotalArea += parseFloat(totalArea);
  prevEnchroachedArea += parseFloat(areaOfEncroached);
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
                  <th colSpan="11">
                    <h3 style={{ color: 'red' }}>
                      <b>
                        <FormattedMessage id="villageForm1E.table.villageForm1E" />
                      </b>
                    </h3>
                  </th>
                </tr>
                <tr>
                  <th colSpan="11">
                    <h3 style={{ color: 'red' }}>
                      <b>
                        <b>
                          <FormattedMessage id="villageForm1E.table.registerEnchroachment" />
                        </b>

                        {/* शासकीय जमिनींवरील अतिक्रमणांची नोंद */}
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
                      <FormattedMessage id="villageForm1E.table.surveyHissa" />
                    </b>
                  </th>
                  <th>
                    <b>
                      <FormattedMessage id="villageForm1E.table.nameEnchroacher" />
                    </b>
                  </th>
                  <th>
                    <b>
                      <FormattedMessage id="villageForm1E.table.totalArea" />
                    </b>
                  </th>
                  <th>
                    <b>
                      <FormattedMessage id="villageForm1E.table.areaOfEnchroached" />
                    </b>
                  </th>
                  <th>
                    <b>
                      <FormattedMessage id="villageForm1E.table.purposeForWhichTheEncroachment" />
                      {/* अतिक्रमित जमिनीचा उपयोग  */}
                    </b>
                  </th>
                  <th>
                    <b>
                      <FormattedMessage id="villageForm1E.table.enchroachmentDate" />
                    </b>
                  </th>
                  <th>
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
                  </th>
                </tr>

                <tr>
                  <th>1</th>
                  <th>2</th>
                  <th>3</th>
                  <th>4</th>
                  <th>5</th>
                  <th>6</th>
                  <th>7</th>
                  <th>8</th>
                  <th>9</th>
                  <th>10</th>
                  <th>11</th>
                </tr>
              </thead>
              <tbody>
                {this.props.dataToMap &&
                  this.props.dataToMap.map((r) => (
                    <tr>
                      <td>{r.srNo}</td>
                      <td>{r.pin}</td>
                      <td>{r.nameOfEncroacher}</td>
                      <td>{r.totalArea}</td>
                      <td>{r.areaOfEncroached}</td>
                      {/* <td>{r.purposeOfEncroachmentLand} </td> */}
                      <td>
                        <FormattedMessage id="villageForm1E.table.agriculture" />{' '}
                      </td>
                      <td>{r.dateOfEncroachment}</td>
                      <td>{r.dateOfDecisionOnEncroachment}</td>
                      <td>{r.yearFromWhichRentRecoverable}</td>
                      <td>{r.yearOfEncroachmentNotedIfRemoved}</td>
                      <td>{r.remarks}</td>
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
                <tr>
                  <td colSpan={3}>
                    <b>
                      <FormattedMessage id="formLanguage.form.total" />
                    </b>
                  </td>
                  <td>
                    <b>{this.props.totalArea}</b>
                  </td>
                  <td>
                    <b>{this.props.netEnchroachedArea}</b>
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

export default Report;
