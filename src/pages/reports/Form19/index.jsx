import { PageContainer } from '@ant-design/pro-layout';
import styles from './report.module.css';
import React, { useState, useRef, useEffect } from 'react';
import { Button, Card, Col, Form, message, Row, Select } from 'antd';
import { useHistory, useLocation } from 'react-router-dom';
import Axios from 'axios';
import VillageSelector from '@/components/eComponents/VillageSelector';
import BaseURL from '@/URLs/urls';
import { useReactToPrint } from 'react-to-print';
import URLS from '@/URLs/urls';
import useAxios from '@/components/eComponents/use-axios';
import { useModel } from 'umi';
import { FormattedMessage } from 'umi';

function Report19() {
  const { sendRequest } = useAxios();
  const [codeVillage, setCodeVillage] = useState('');
  const [textForVillage, setTextForVillage] = useState();
  const [village, setVillage] = useState([]);
  const [isNirank, setIsNirank] = useState(false);

  const [tableData, setTableData] = useState();
  const [textVillage, setTextVillage] = useState('');
  const componentRef = useRef();
  const [revenueYear, setRevenueYear] = useState();
  const [villageSajjaCode, setVillageSajjaCode] = useState();
  const [villageSajjaName, setVillageSajjaName] = useState();
  const [villageSaja, setVillageSaja] = useState([]);
  const { districtName, talukaName, desig, servarthId, villageData } = useModel('details');
  const history = useHistory();

  useEffect(() => {
    setVillageSaja(
      villageData?.map((row) => ({
        label: row.sajjaName,
        value: row.sajjaCode,
      })),
    );
  }, []);

  const handleOnChange = (value, event) => {
    setVillageSajjaCode(value);
    setVillageSajjaName(event.label);
  };

  const backToHomeButton = () => {
    history.push({ pathname: '/homepage' });
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const getTableData = async () => {
    sendRequest(
      `${URLS.BaseURL}/form19/getForm19Data?sajjaCode=${villageSajjaCode}&userId=${''}`,
      'GET',
      null,
      (res) => {
        setTableData(
          res.data.form19Data.map((r) => ({
            id: r.id,
            descriptionOfArticle: r.descriptionOfArticle,
            authorityOfPurchase: r.authorityOfPurchase,
            numberOrQuantity: r.numberOrQuantity,
            dateOfPurchase: r.dateOfPurchase ? r.dateOfPurchase : '',
            authorityOfVoucher: r.authorityOfVoucher,
            amountWrittenOff: r.amountWrittenOff,
            amountRealized: r.amountRealized,
            dateOfCreditAtTreasury: r.dateOfCreditAtTreasury ? r.dateOfCreditAtTreasury : '',
            number: r.number,
            value: r.value,
            remarks: r.remarks,
          })),
        );
        message.success('Records Fetched!!');
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
              <FormattedMessage id="villageForm19.title.villageName" />
            </h1>
          </Col>
          <Col span={8}>
            <Button style={{ float: 'right' }} onClick={backToHomeButton} type="primary">
              <FormattedMessage id="formLanguage.form.backhomeButton" />
            </Button>
          </Col>
        </Row>

        <Form layout="horizontal">
          <Row style={{ marginTop: 15 }}>
            <Col xl={5} lg={5} md={24} sm={24} xs={24}>
              <Form.Item label={<FormattedMessage id="villageSelector.label.district" />}>
                <Select disabled placeholder={districtName}></Select>
              </Form.Item>
            </Col>

            <Col xl={1} lg={1}></Col>
            <Col xl={5} lg={5} md={24} sm={24} xs={24}>
              <Form.Item label={<FormattedMessage id="villageSelector.label.taluka" />}>
                <Select disabled placeholder={talukaName}></Select>
              </Form.Item>
            </Col>

            <Col xl={1} lg={1}></Col>
            <Col xl={5} lg={6} md={24} xs={24} sm={24}>
              <Form.Item wrapperCol={{ xl: 20, lg: 15 }} label="सजा">
                <Select
                  options={villageSaja}
                  placeholder=" गाव निवडा"
                  onSelect={(value, event) => handleOnChange(value, event)}
                ></Select>
              </Form.Item>
            </Col>
            <Col xs={1} sm={1} md={1} lg={2} xl={2}></Col>
            <Col xs={1} sm={1} md={1} lg={2} xl={2}>
              <Button
                type="primary"
                htmlType="submit"
                onClick={() => {
                  getTableData();
                }}
              >
                <FormattedMessage id="formLanguage.button.search" />
              </Button>
            </Col>
            {/* <Col xl={1}></Col> */}
          </Row>
        </Form>
      </Card>
      <ComponentToPrint
        ref={componentRef}
        village={textForVillage}
        taluka={talukaName}
        district={districtName}
        dataToMap={tableData}
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
            <table className={styles.report_table} scroll={{ xs: 1000 }}>
              <thead>
                <tr>
                  <th colSpan={16}>
                    <h2 style={{ textAlign: 'center', color: 'red' }}>
                      <FormattedMessage id="villageForm19.title.villageName" />
                    </h2>
                  </th>
                </tr>
                <tr>
                  <th colSpan="16">
                    <h2 style={{ textAlign: 'center', color: 'red' }}>
                      <FormattedMessage id="villageForm19.label.talathiCircle" />
                    </h2>
                  </th>
                </tr>

                {/* <tr>
                  <th colSpan="16">
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
                    <b>
                      <FormattedMessage id="formLanguage.form.serialNo" />
                    </b>
                  </th>
                  <th rowSpan={4} colSpan={1}>
                    <b>
                      <FormattedMessage id="villageForm19.form.descriptionOfArticle" />
                    </b>
                  </th>
                  <th rowSpan={4} colSpan={1}>
                    <b>
                      <FormattedMessage id="villageForm19.form.authorityOfPurchase" />
                    </b>
                  </th>
                  <th rowSpan={4} colSpan={1}>
                    <b>
                      <FormattedMessage id="villageForm19.form.dateOfPurchase" />
                    </b>
                  </th>
                  <th rowSpan={4} colSpan={1}>
                    <b>
                      <FormattedMessage id="villageForm19.form.numberOrQuantity" />
                    </b>
                  </th>
                  <th rowSpan={4} colSpan={1}>
                    <b>
                      <FormattedMessage id="villageForm19.form.val" />
                    </b>
                  </th>
                  <th rowSpan={4} colSpan={1}>
                    <b>
                      <FormattedMessage id="villageForm19.form.signature" />
                    </b>
                  </th>
                  <th rowSpan={4} colSpan={1}>
                    <b>
                      <FormattedMessage id="villageForm19.form.finalDisposal" />
                    </b>
                  </th>
                  <th rowSpan={4} colSpan={1}>
                    <b>
                      <FormattedMessage id="villageForm19.form.authorityOfVoucher" />
                    </b>
                  </th>
                  <th rowSpan={4} colSpan={1}>
                    <b>
                      <FormattedMessage id="villageForm19.form.amountRealized" />
                    </b>
                  </th>
                  <th rowSpan={4} colSpan={1}>
                    <b>
                      <FormattedMessage id="villageForm19.form.dateOfCreditAtTreasury" />
                    </b>
                  </th>
                  <th rowSpan={4} colSpan={1}>
                    <b>
                      <FormattedMessage id="villageForm19.form.amountWrittenOff" />
                    </b>
                  </th>

                  <th rowSpan={4} colSpan={1}>
                    <b>
                      <FormattedMessage id="villageForm19.form.number" />
                    </b>
                  </th>
                  <th rowSpan={4} colSpan={1}>
                    <b>
                      <FormattedMessage id="villageForm19.form.value" />
                    </b>
                  </th>
                  <th rowSpan={4} colSpan={1}>
                    <b>
                      <FormattedMessage id="villageForm19.form.signature" />
                    </b>
                  </th>
                  <th rowSpan={4} colSpan={1}>
                    <b>
                      <FormattedMessage id="villageForm19.form.remarkAndSignature" />
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
                </tr>
                {this.props.dataToMap &&
                  this.props.dataToMap.map((r, i) => (
                    <tr>
                      <td>{i + 1}</td>

                      <td>{r.descriptionOfArticle}</td>
                      <td>{r.authorityOfPurchase}</td>

                      <td>{r.dateOfPurchase}</td>

                      <td>{r.numberOrQuantity}</td>

                      <td>{/* {r.sanadNo} */}</td>
                      <td>{/* {r.surveyNumber} */}</td>
                      <td>{/* {r.hissaNo} */}</td>
                      <td>{r.authorityOfVoucher}</td>

                      <td>{r.amountRealized}</td>

                      <td>{r.dateOfCreditAtTreasury}</td>

                      <td>{r.amountWrittenOff}</td>
                      <td>{r.number}</td>
                      <td>{r.value}</td>
                      <td></td>
                      <td>{r.remarks}</td>
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

export default Report19;
