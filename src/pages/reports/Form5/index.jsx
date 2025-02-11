import VillageSelector from '@/components/eComponents/VillageSelector';
import useAxios from '@/components/eComponents/use-axios';
import { Button, Card, Col, message, Row, Form, Select } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { FormattedMessage, useHistory } from 'umi';
import { useModel } from 'umi';
import styles from './report.module.css';
import URLS from '@/URLs/urls';

function Report5() {
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const backToHomeButton = () => {
    history.push({ pathname: '/homepage' });
  };
  const history = useHistory();
  const { sendRequest } = useAxios();
  const [textVillage, setTextVillage] = useState();
  const [codeVillage, setCodeVillage] = useState('');
  const [isNirank, setIsNirank] = useState(false);
  const [village, setVillage] = useState([]);
  const [tableData, setTableData] = useState();
  const [revenueYear, setRevenueYear] = useState('2024-25');
  const componentRef = useRef();
  const { districtName, talukaName, districtCode, talukaCode } = useModel('details');
  const [revenueYearForVillage, setRevenueYearForVillage] = useState();

  useEffect(() => {
    getRevenueYear();
  }, []);

  const onYearChange = (value, event) => {
    setRevenueYear(value);
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

  return (
    <div>
      <Card>
        <h1 style={{ textAlign: 'center' }}>
          <FormattedMessage id="villageReport5.form.formName" />
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
          // /* onClick={getTableData} */ onClick={() => {
          //   if (textVillage && revenueYear) {
          //     getTableData();
          //   } else if (textVillage == null) {
          //     message.info('Please Select Village');
          //   } else if (revenueYear == null) {
          //     message.info('Please Select Revenue Year');
          //   }
          // }}
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
        dataToMap={tableData}
      />
    </div>
  );
}
class ComponentToPrint extends React.Component {
  render() {
    return (
      <div style={{ padding: '10px' }}>
        <div className="report">
          <Card>
            <table className={styles.report_table}>
              <thead>
                <tr style={{ color: 'red' }}>
                  <th colSpan="11">
                    <b>गाव नमुना पाच</b>
                  </th>
                </tr>
                <tr style={{ color: 'red' }}>
                  <th colSpan="11">
                    <b>
                      क्षेत्र आणि महसूल यांचा सर्वसाधारण गोषवारा ( ठरावबंद - किस्तबंदी खतावणी
                      जमाबंदी पत्रक )
                    </b>
                  </th>
                </tr>

                <tr style={{ color: 'red' }}>
                  <th colSpan="11">
                    <pre>
                      {' '}
                      <b>
                        <pre>
                          <b>
                            {<FormattedMessage id="villageForm.form.village" />}-
                            {this.props.village} {<FormattedMessage id="villageForm.form.taluka" />}
                            -{this.props.taluka}{' '}
                            {<FormattedMessage id="villageForm.form.distrcit" />}-{' '}
                            {this.props.district}
                          </b>
                        </pre>
                      </b>
                    </pre>
                  </th>
                </tr>

                <tr>
                  <th rowSpan={2}>
                    <FormattedMessage id="villageReport5.table.srNo" />
                  </th>
                  <th rowSpan={2}>
                    <FormattedMessage id="villageReport5.table.descriptOfItm" />
                  </th>
                  <th colSpan={2}>
                    <FormattedMessage id="villageReport5.table.lastYear" />
                  </th>

                  <th colSpan={2}>
                    <FormattedMessage id="villageReport5.table.currentYear" />
                  </th>
                  <th colSpan={2}>
                    <FormattedMessage id="villageReport5.table.decrease" />
                  </th>
                  <th colSpan={2}>
                    <FormattedMessage id="villageReport5.table.increase" />
                  </th>
                  <th rowSpan={2}>
                    <FormattedMessage id="villageReport5.table.remark" />
                  </th>
                </tr>
                <tr>
                  <th>
                    <FormattedMessage id="villageReport5.table.area" />
                  </th>
                  <th>
                    <FormattedMessage id="villageReport5.table.assessment" />
                  </th>

                  <th>
                    <FormattedMessage id="villageReport5.table.area" />
                  </th>
                  <th>
                    <FormattedMessage id="villageReport5.table.assessment" />
                  </th>

                  <th>
                    <FormattedMessage id="villageReport5.table.area" />
                  </th>
                  <th>
                    <FormattedMessage id="villageReport5.table.assessment" />
                  </th>

                  <th>
                    <FormattedMessage id="villageReport5.table.area" />
                  </th>
                  <th>
                    <FormattedMessage id="villageReport5.table.assessment" />
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
                <tr>
                  <td>1</td>
                  <td style={{ color: 'red' }}>
                    <b>
                      <FormattedMessage id="villageReport5.lable.totalAreaAssessment" />
                    </b>
                  </td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>

                <tr>
                  <td>2</td>
                  <td>
                    <b>
                      <FormattedMessage id="villageReport5.lable.add" />
                    </b>
                    &nbsp;
                    <FormattedMessage id="villageReport5.lable.excessOfJudi" />
                  </td>
                  <td></td> <td></td>
                  <td></td>
                  <td></td> <td></td>
                  <td></td>
                  <td></td> <td></td> <td></td>
                </tr>

                <tr>
                  <td>3</td>
                  <td>
                    <b>
                      <FormattedMessage id="villageReport5.lable.deduct" />
                    </b>
                    &nbsp;
                    <FormattedMessage id="villageReport5.lable.landPayingRevenue" />
                  </td>
                  <td></td> <td></td>
                  <td></td>
                  <td></td> <td></td>
                  <td></td>
                  <td></td> <td></td> <td></td>
                </tr>

                <tr>
                  <td></td>
                  <td>
                    <b style={{ color: 'red' }}>
                      <FormattedMessage id="villageReport5.lable.unassessedCultivable1" />
                      <br />
                    </b>
                    <b>
                      {' '}
                      <FormattedMessage id="villageReport5.lable.unassessedCultivable2" />
                    </b>
                  </td>
                  <td></td> <td></td>
                  <td></td>
                  <td></td> <td></td>
                  <td></td>
                  <td></td> <td></td> <td></td>
                </tr>

                <tr>
                  <td></td>
                  <td>
                    <b style={{ color: 'red' }}>
                      <FormattedMessage id="villageReport5.lable.uncultivable" /> <br />
                    </b>
                    <b>
                      <FormattedMessage id="villageReport5.lable.uncultivable2" />
                    </b>
                  </td>
                  <td></td> <td></td>
                  <td></td>
                  <td></td> <td></td>
                  <td></td>
                  <td></td> <td></td> <td></td>
                </tr>

                <tr>
                  <td></td>
                  <td>
                    <b style={{ color: 'red' }}>
                      <FormattedMessage id="villageReport5.lable.unoccupied" /> <br />
                    </b>
                    <b>
                      <FormattedMessage id="villageReport5.lable.unoccupied2" />
                    </b>
                  </td>
                  <td></td> <td></td>
                  <td></td>
                  <td></td> <td></td>
                  <td></td>
                  <td></td> <td></td> <td></td>
                </tr>

                <tr>
                  <td></td>
                  <td>
                    <b style={{ color: 'red' }}>
                      <FormattedMessage id="villageReport5.lable.setAside" /> <br />
                    </b>
                    <b>
                      {' '}
                      <FormattedMessage id="villageReport5.lable.setAside2" />
                    </b>
                  </td>
                  <td></td> <td></td>
                  <td></td>
                  <td></td> <td></td>
                  <td></td>
                  <td></td> <td></td> <td></td>
                </tr>

                <tr>
                  <td></td>
                  <td>
                    <b style={{ color: 'red' }}>
                      <FormattedMessage id="villageReport5.lable.ForestE" />{' '}
                    </b>
                    <br />
                    <b>
                      <FormattedMessage id="villageReport5.lable.ForestE2" />
                    </b>
                  </td>
                  <td></td> <td></td>
                  <td></td>
                  <td></td> <td></td>
                  <td></td>
                  <td></td> <td></td> <td></td>
                </tr>

                <tr>
                  <td></td>
                  <td style={{ color: 'red' }}>
                    <b>
                      <FormattedMessage id="villageReport5.lable.nonAgricultural" />
                    </b>
                  </td>
                  <td></td> <td></td>
                  <td></td>
                  <td></td> <td></td>
                  <td></td>
                  <td></td> <td></td> <td></td>
                </tr>
                <tr>
                  <td></td>
                  <td>
                    <FormattedMessage id="villageReport5.lable.residential" />
                  </td>
                  <td></td> <td></td>
                  <td></td>
                  <td></td> <td></td>
                  <td></td>
                  <td></td> <td></td> <td></td>
                </tr>
                <tr>
                  <td></td>
                  <td>
                    <FormattedMessage id="villageReport5.lable.industrial" />
                  </td>
                  <td></td> <td></td>
                  <td></td>
                  <td></td> <td></td>
                  <td></td>
                  <td></td> <td></td> <td></td>
                </tr>
                <tr>
                  <td></td>
                  <td>
                    <FormattedMessage id="villageReport5.lable.commercial" />
                  </td>
                  <td></td> <td></td>
                  <td></td>
                  <td></td> <td></td>
                  <td></td>
                  <td></td> <td></td> <td></td>
                </tr>
                <tr>
                  <td></td>
                  <td>
                    <FormattedMessage id="villageReport5.lable.otherPurpose" />
                  </td>
                  <td></td> <td></td>
                  <td></td>
                  <td></td> <td></td>
                  <td></td>
                  <td></td> <td></td> <td></td>
                </tr>
                <tr>
                  <td></td>
                  <td>
                    <b>
                      <FormattedMessage id="villageReport5.lable.totalVII" />
                    </b>
                  </td>
                  <td></td> <td></td>
                  <td></td>
                  <td></td> <td></td>
                  <td></td>
                  <td></td> <td></td> <td></td>
                </tr>
                <tr>
                  <td></td>
                  <td style={{ color: 'red' }}>
                    <b>
                      <FormattedMessage id="villageReport5.lable.Alienated" />
                    </b>
                  </td>
                  <td></td> <td></td>
                  <td></td>
                  <td></td> <td></td>
                  <td></td>
                  <td></td> <td></td> <td></td>
                </tr>
                <tr>
                  <td></td>
                  <td>
                    <FormattedMessage id="villageReport5.lable.landGranted" /> <br />
                    <b>
                      <FormattedMessage id="villageReport5.lable.landGranted2" />
                    </b>
                  </td>
                  <td></td> <td></td>
                  <td></td>
                  <td></td> <td></td>
                  <td></td>
                  <td></td> <td></td> <td></td>
                </tr>

                <tr>
                  <td></td>
                  <td>
                    <b>
                      <FormattedMessage id="villageReport5.lable.totalLandRevenue" />
                    </b>
                  </td>
                  <td /> <td />
                  <td />
                  <td /> <td></td>
                  <td></td>
                  <td></td> <td></td> <td></td>
                </tr>

                <tr>
                  <td>4</td>
                  <td>
                    <b style={{ color: 'red' }}>
                      <FormattedMessage id="villageReport5.lable.remainderOccCulLand" />
                    </b>
                    <br />
                    <FormattedMessage id="villageReport5.lable.remainderOccCulLand2" /> &nbsp;
                    <b>
                      <FormattedMessage id="villageReport5.lable.remainderOccCulLand3" />
                    </b>
                  </td>
                  <td></td> <td></td>
                  <td></td>
                  <td></td> <td></td>
                  <td></td>
                  <td></td> <td></td> <td></td>
                </tr>

                <tr>
                  <td></td>
                  <td>
                    <FormattedMessage id="villageReport5.lable.consistingOfFollow" />
                  </td>
                  <td></td> <td></td>
                  <td></td>
                  <td></td> <td></td>
                  <td></td>
                  <td></td> <td></td> <td></td>
                </tr>
                <tr>
                  <td></td>
                  <td>
                    <FormattedMessage id="villageReport5.lable.occClassI" />
                  </td>
                  <td></td> <td></td>
                  <td></td>
                  <td></td> <td></td>
                  <td></td>
                  <td></td> <td></td> <td></td>
                </tr>
                <tr>
                  <td></td>
                  <td>
                    <FormattedMessage id="villageReport5.lable.occClassII" />
                  </td>
                  <td></td> <td></td>
                  <td></td>
                  <td></td> <td></td>
                  <td></td>
                  <td></td> <td></td> <td></td>
                </tr>

                <tr>
                  <td></td>
                  <td>
                    <FormattedMessage id="villageReport5.lable.govLess" />
                  </td>
                  <td></td> <td></td>
                  <td></td>
                  <td></td> <td></td>
                  <td></td>
                  <td></td> <td></td> <td></td>
                </tr>

                <tr>
                  <td>5</td>
                  <td>
                    <b>
                      <FormattedMessage id="villageReport5.lable.add" />
                    </b>
                    &nbsp;
                    <FormattedMessage id="villageReport5.lable.fixedAgricultural" />
                  </td>
                  <td></td> <td></td>
                  <td></td>
                  <td></td> <td></td>
                  <td></td>
                  <td></td> <td></td> <td></td>
                </tr>
                <tr>
                  <td></td>
                  <td style={{ color: 'red' }}>
                    <b>
                      <FormattedMessage id="villageReport5.lable.fixedAgricultural1" />
                    </b>
                  </td>
                  <td></td> <td></td>
                  <td></td>
                  <td></td> <td></td>
                  <td></td>
                  <td></td> <td></td> <td></td>
                </tr>
                <tr>
                  <td></td>
                  <td>
                    <b>
                      <FormattedMessage id="villageReport5.lable.fixedAgricultural2" />
                    </b>
                    &nbsp;
                  </td>
                  <td></td> <td></td>
                  <td></td>
                  <td></td> <td></td>
                  <td></td>
                  <td></td> <td></td> <td></td>
                </tr>

                <tr>
                  <td></td>
                  <td style={{ color: 'orange' }}>
                    <b>
                      <FormattedMessage id="villageReport5.lable.fixedAgricultural3" />
                    </b>
                  </td>
                  <td></td> <td></td>
                  <td></td>
                  <td></td> <td></td>
                  <td></td>
                  <td></td> <td></td> <td></td>
                </tr>

                <tr>
                  <td>6</td>
                  <td style={{ color: 'red' }}>
                    <b>
                      <FormattedMessage id="villageReport5.lable.netRevenue" />
                    </b>
                  </td>
                  <td></td> <td></td>
                  <td></td>
                  <td></td> <td></td>
                  <td></td>
                  <td></td> <td></td> <td></td>
                </tr>

                <tr>
                  <td>7</td>
                  <td>
                    <b>
                      <FormattedMessage id="villageReport5.lable.add" />
                    </b>
                    &nbsp;
                    <b>
                      <FormattedMessage id="villageReport5.lable.nonAgricultural" />
                    </b>
                  </td>
                  <td></td> <td></td>
                  <td></td>
                  <td></td> <td></td>
                  <td></td>
                  <td></td> <td></td> <td></td>
                </tr>
                <tr>
                  <td></td>
                  <td>
                    <FormattedMessage id="villageReport5.lable.nonAgricultural1" />
                  </td>
                  <td></td> <td></td>
                  <td></td>
                  <td></td> <td></td>
                  <td></td>
                  <td></td> <td></td> <td></td>
                </tr>
                <tr>
                  <td></td>
                  <td>
                    <b>
                      <FormattedMessage id="villageReport5.lable.nonAgricultural2" />
                    </b>
                  </td>
                  <td></td> <td></td>
                  <td></td>
                  <td></td> <td></td>
                  <td></td>
                  <td></td> <td></td> <td></td>
                </tr>
                <tr>
                  <td></td>
                  <td>
                    <b style={{ color: 'red' }}>
                      {' '}
                      <FormattedMessage id="villageReport5.lable.deduct1" />
                    </b>
                    &nbsp;
                    <b>
                      <FormattedMessage id="villageReport5.lable.nonAgricultural3" />
                    </b>
                  </td>
                  <td style={{ color: 'red' }}>
                    बिनशेती डिमांड
                    <br /> कन्सल
                  </td>{' '}
                  <td></td>
                  <td style={{ color: 'red' }}>
                    बिनशेती डिमांड <br />
                    कन्सल
                  </td>
                  <td></td> <td></td>
                  <td></td>
                  <td></td> <td></td> <td></td>
                </tr>

                <tr>
                  <td></td>
                  <td style={{ color: 'red' }}>
                    <b>
                      <FormattedMessage id="villageReport5.lable.nonAgricultural4" />
                    </b>
                  </td>
                  <td></td> <td></td>
                  <td></td>
                  <td></td> <td></td>
                  <td></td>
                  <td></td> <td></td> <td></td>
                </tr>
                <tr>
                  <td>8</td>
                  <td>
                    <b>
                      <FormattedMessage id="villageReport5.lable.fixedRevenue" />
                    </b>
                  </td>
                  <td></td> <td></td>
                  <td></td>
                  <td></td> <td></td>
                  <td></td>
                  <td></td> <td></td> <td></td>
                </tr>

                <tr>
                  <td>9</td>
                  <td>
                    <b>
                      <FormattedMessage id="villageReport5.lable.add" />
                    </b>
                    &nbsp;
                    <b>
                      <FormattedMessage id="villageReport5.lable.miscellaneousLand" />
                    </b>
                  </td>
                  <td></td> <td></td>
                  <td></td>
                  <td></td> <td></td>
                  <td></td>
                  <td></td> <td></td> <td></td>
                </tr>
                <tr>
                  <td></td>
                  <td>
                    <FormattedMessage id="villageReport5.lable.miscellaneousLand1" />
                  </td>
                  <td></td> <td></td>
                  <td></td>
                  <td></td> <td></td>
                  <td></td>
                  <td></td> <td></td> <td></td>
                </tr>
                <tr>
                  <td></td>
                  <td>
                    <FormattedMessage id="villageReport5.lable.miscellaneousLand2" />
                  </td>
                  <td></td> <td></td>
                  <td></td>
                  <td></td> <td></td>
                  <td></td>
                  <td></td> <td></td> <td></td>
                </tr>
                <tr>
                  <td></td>
                  <td style={{ color: 'red' }}>
                    <b>
                      <FormattedMessage id="villageReport5.lable.miscellaneousLand3" />
                    </b>
                  </td>
                  <td></td> <td></td>
                  <td></td>
                  <td></td> <td></td>
                  <td></td>
                  <td></td> <td></td> <td></td>
                </tr>

                <tr>
                  <td>10</td>
                  <td>
                    <b>
                      <FormattedMessage id="villageReport5.lable.totalRealizableLand" />
                    </b>
                  </td>
                  <td></td> <td></td>
                  <td></td>
                  <td></td> <td></td>
                  <td></td>
                  <td></td> <td></td> <td></td>
                </tr>

                <tr>
                  <td>11</td>
                  <td>
                    <b>
                      <FormattedMessage id="villageReport5.lable.add" />
                    </b>
                    &nbsp;
                    <b>
                      <FormattedMessage id="villageReport5.lable.localCess" />
                    </b>
                  </td>
                  <td></td> <td></td>
                  <td></td>
                  <td></td> <td></td>
                  <td></td>
                  <td></td> <td></td> <td></td>
                </tr>

                <tr>
                  <td></td>
                  <td>
                    <FormattedMessage id="villageReport5.lable.localCess1" />
                  </td>
                  <td></td> <td></td>
                  <td></td>
                  <td></td> <td></td>
                  <td></td>
                  <td></td> <td></td> <td></td>
                </tr>

                <tr>
                  <td></td>
                  <td>
                    <FormattedMessage id="villageReport5.lable.localCess2" />
                  </td>
                  <td>जि.प.</td> <td></td>
                  <td>जि.प.</td>
                  <td></td> <td></td>
                  <td></td>
                  <td></td> <td></td> <td></td>
                </tr>

                <tr>
                  <td></td>
                  <td></td>
                  <td>ग्रा.पं.</td> <td></td>
                  <td>ग्रा.पं.</td>
                  <td></td> <td></td>
                  <td></td>
                  <td></td> <td></td> <td></td>
                </tr>

                <tr>
                  <td></td>
                  <td style={{ color: 'red' }}>
                    <b>
                      <FormattedMessage id="villageReport5.lable.localCess3" />
                    </b>
                  </td>
                  <td></td> <td></td>
                  <td></td>
                  <td></td> <td></td>
                  <td></td>
                  <td></td> <td></td> <td></td>
                </tr>

                <tr>
                  <td></td>
                  <td>
                    <b>
                      <FormattedMessage id="villageReport5.lable.localCess4" />
                    </b>
                  </td>
                  <td></td> <td></td>
                  <td></td>
                  <td></td> <td></td>
                  <td></td>
                  <td></td> <td></td> <td></td>
                </tr>

                <tr>
                  <td>12</td>
                  <td>
                    <b>
                      <FormattedMessage id="villageReport5.lable.grandTotal" />
                    </b>
                  </td>
                  <td></td> <td></td>
                  <td></td>
                  <td></td> <td></td>
                  <td></td>
                  <td></td> <td></td> <td></td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={11}>
                    <Row>
                      <Col span={7}>
                        <FormattedMessage id="villageReport5.lable.examined" />
                      </Col>
                      <Col span={1}></Col>
                      <Col span={7}>
                        {' '}
                        <FormattedMessage id="villageReport5.lable.audited" />
                      </Col>
                    </Row>

                    <Row>
                      <Col span={7}>
                        <b>
                          <FormattedMessage id="villageReport5.lable.sd" />
                        </b>
                      </Col>
                    </Row>

                    <Row>
                      <Col span={7}>
                        <b>
                          {' '}
                          <FormattedMessage id="villageReport5.lable.talathi" />
                        </b>
                      </Col>
                      <Col span={1}></Col>
                      <Col span={7}>
                        {' '}
                        <b>
                          <FormattedMessage id="villageReport5.lable.jamabandi" />
                        </b>
                      </Col>
                      <Col span={1}></Col>
                      <Col span={7}>
                        {' '}
                        <b>
                          <FormattedMessage id="villageReport5.lable.subDiv" />{' '}
                        </b>
                      </Col>
                    </Row>
                  </td>
                </tr>
              </tfoot>
            </table>
          </Card>
        </div>
      </div>
    );
  }
}

export default Report5;
