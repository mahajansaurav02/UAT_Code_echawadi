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
  const [villageForm17, setVillageForm17] = useState();
  const [revenueYear, setRevenueYear] = useState('2024-25');
  const componentRef = useRef();
  const [revenueYearForVillage, setRevenueYearForVillage] = useState();

  const handleOnChange = (value, event) => {
    setTextVillage(event.label);
    setCodeVillage(value);

    // console.log('Name of Village ==>>', event.label, 'cCode==>>', value);
  };

  const onYearChange = (value, event) => {
    setRevenueYear(value);
  };

  useEffect(() => {
    getRevenueYear();
  }, []);

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
      `${URLS.BaseURL}/reports/getForm4Report?revenueYear=${revenueYear}&districtCode=${districtCode}&talukaCode=${talukaCode}&cCode=${codeVillage}`,
      'GET',
      null,
      (r) => {
        // console.log('responase for table==>', r.data);
        setVillageForm17(
          r.data.form17Data.map((r) => ({
            srNo: r.id,
            caseNo: r.caseNo,
            personLiable: r.personLiable,
            khataNo: r.khataNo,

            localCess: r.localCess,
            localCessAmount: r.localCessAmount,
            bfreeOfLocalCess: r.bfreeOfLocalCess,
            amountOfZp: r.amountOfZp,
            amountOfGp: r.amountOfGp,
            natureOfCase: r.natureOfCase,
            remarks: r.remarks,
            noteOfEntryInTalukaFormIV: r.noteOfEntryInTalukaFormIV,
            otherLocalCess: r.otherLocalCess,
            otherLocalCessAmount: r.otherLocalCessAmount,
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
          <FormattedMessage id="villageForm17.table.form4Label" />
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
        dataToMap={villageForm17}
      />
    </div>
  );
}
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
              <th colSpan="12">
                <h3 style={{ color: 'red' }}>
                  <b>
                    <FormattedMessage id="villageForm17.table.form4Label" />
                  </b>
                </h3>
              </th>
            </tr>
            <tr>
              <th colSpan="12">
                <h3 style={{ color: 'red' }}>
                  <b>( सिवाई आमदनी -- सिवाई जमाबंदी )</b>
                </h3>
              </th>
            </tr>
            <tr>
              <th colSpan="12">
                <h3 style={{ color: 'red' }}>
                  <pre>
                    <b>
                      {<FormattedMessage id="villageForm.form.village" />}-{this.props.village}{' '}
                      {<FormattedMessage id="villageForm.form.taluka" />}-{this.props.taluka}{' '}
                      {<FormattedMessage id="villageForm.form.distrcit" />}- {this.props.district}
                    </b>
                  </pre>
                </h3>
              </th>
            </tr>

            <tr>
              <td>
                <b>
                  <FormattedMessage id="formLanguage.form.serialNo" />
                </b>
              </td>
              <td>
                <b>
                  <FormattedMessage id="villageForm17.table.noOfCase" />
                </b>
              </td>
              <td>
                <b>
                  <FormattedMessage id="villageForm17.table.personLiable" />
                </b>
              </td>
              <td>
                <b>
                  {' '}
                  <FormattedMessage id="villageForm17.table.khataNo" />
                </b>
              </td>
              <td>
                <b>
                  <FormattedMessage id="villageForm17.table.localCess" />
                </b>
              </td>
              <td>
                <b>
                  <FormattedMessage id="villageForm17.table.amt" />
                </b>
              </td>
              <td>
                <b>
                  <FormattedMessage id="villageForm4.table.amountOfLC" />
                </b>
              </td>
              <td>
                <b>
                  <FormattedMessage id="villageForm4.table.amountOfVP" />
                </b>
              </td>
              <td>
                <b>
                  <FormattedMessage id="villageForm17.table.otherLocalCess" />
                </b>
              </td>
              <td>
                <b>
                  <FormattedMessage id="villageForm17.table.amt" />
                </b>
              </td>
              <td>
                <b>
                  <FormattedMessage id="villageForm17.table.natureOfCase" />
                </b>
              </td>
              <td>
                <b>
                  <FormattedMessage id="villageForm17.table.noteOfEntryFor17" />
                </b>
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
            </tr>
            </thead>
            {this.props.dataToMap &&
              this.props.dataToMap.map((r, i) => (
                <tr>
                  <td>{i + 1}</td>
                  <td>{r.caseNo}</td>
                  <td>{r.personLiable}</td>
                  <td>{r.khataNo}</td>
                  <td>{r.localCess}</td>
                  <td>{r.localCessAmount}</td>
                  <td>{r.amountOfZp}</td>
                  <td>{r.amountOfGp}</td>
                  <td>{r.otherLocalCess}</td>
                  <td>{r.otherLocalCessAmount}</td>
                  <td>{r.natureOfCase}</td>

                  <td>{r.remarks}</td>
                </tr>
              ))}
          </table>
        </Card>
      </div>
    );
  }
}

export default VillageForm;
