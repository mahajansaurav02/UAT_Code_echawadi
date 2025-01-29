import { PageContainer } from '@ant-design/pro-layout';
import styles from './report.module.css';
import React, { useState, useRef, useEffect } from 'react';
import { Button, Card, Checkbox, Col, Form, message, Row, Select } from 'antd';
import { useHistory, useLocation } from 'react-router-dom';
import Axios from 'axios';
import VillageSelector from '@/components/eComponents/VillageSelector';
import BaseURL from '@/URLs/urls';
import URLS from '@/URLs/urls';
import useAxios from '@/components/eComponents/use-axios';
import { useReactToPrint } from 'react-to-print';
import { useModel } from 'umi';
import { FormattedMessage } from 'umi';

function Form15Report() {
  const desgNew = localStorage.getItem('desg');
  const { sendRequest } = useAxios();
  const [codeVillage, setCodeVillage] = useState('');
  const [textForVillage, setTextForVillage] = useState();
  const [village, setVillage] = useState([]);
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
    const result = villageData.filter(
      (thing, index, self) =>
        index ===
        self.findIndex((t) => t.sajjaName === thing.sajjaName && t.sajjaCode === thing.sajjaCode),
    );
    setVillageSaja(
      result?.map((row) => ({
        label: row.sajjaName,
        value: row.sajjaCode,
      })),
    );
  }, []);

  const backToHomeButton = () => {
    history.push({ pathname: '/homepage' });
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const handleOnChange = (value, event) => {
    setVillageSajjaCode(value);
    setVillageSajjaName(event.label);
  };

  const getTableData = async () => {
    sendRequest(
      `${URLS.BaseURL}/form15/getForm15Data?sajjaCode=${villageSajjaCode}&userId=${''}`,
      'GET',
      null,
      (res) => {
        setTableData(
          res.data.form15Data.map((r) => ({
            communicationDispatchedToWhom: r.communicationDispatchedToWhom,
            communicationReceivedFrom: r.communicationReceivedFrom,
            noOfCommunication: r.noOfCommunication,
            dateOfReceipt: r.dateOfReceipt,
            subjectActionToTake: r.subjectActionToTake,
            dateOfDispatch: r.dateOfDispatch ? r.dateOfDispatch : '',
            noInList: r.noInList,
            remarks: r.remarks,
            designation: r.designation,
          })),
        );
        message.success('Records Fetched!!');
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
              <FormattedMessage id="form15.InwardOutward" />
            </h1>
          </Col>
          <Col span={8}>
            <Button style={{ float: 'right' }} onClick={backToHomeButton} type="primary">
              <FormattedMessage id="formLanguage.form.backhomeButton" />
            </Button>
          </Col>
        </Row>
        <div style={{ padding: 10 }}></div>
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

        {/* <Button
           onClick={() => {
            if (textForVillage && revenueYear) {
              getTableData();
            } else if (textForVillage == null) {
              message.info('Please Select Village');
            } else if (revenueYear == null) {
              message.info('Please Select Revenue Year');
            }
          }}
          type="primary"
        >
          <FormattedMessage id="formLanguage.form.getData" />
        </Button> */}
        {/* </Row> */}
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
                <th colSpan="11">
                  <h3 style={{ color: 'red' }}>
                    <b>
                      <FormattedMessage id="form15.InwardOutward" />
                    </b>
                  </h3>
                </th>
              </tr>

              {/* <tr>
                <th colSpan="11">
                  <h4 style={{ color: 'red' }}>
                    <pre>
                      {' '}
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
                <td>
                  <b>
                    <FormattedMessage id="formLanguage.form.serialNo" />
                  </b>
                </td>
                <td>
                  <b>
                    <FormattedMessage id="form15.communicationReceivedform" />
                  </b>
                </td>
                <td>
                  <b>
                    <FormattedMessage id="form15.noOfCommunication" />
                  </b>
                </td>
                <td>
                  <b>
                    <FormattedMessage id="form15.dateOfReceipt" />
                  </b>
                </td>
                <td>
                  <b>
                    <FormattedMessage id="form15.subjectActionToTake" />
                  </b>
                </td>
                <td>
                  <b>
                    <FormattedMessage id="form15.communicationDispatchedToWhom" />
                  </b>
                </td>
                <td>
                  <b>
                    <FormattedMessage id="form15.dateOfDispatch" />
                  </b>
                </td>
                <td>
                  <b>
                    <FormattedMessage id="form15.noInList" />
                  </b>
                </td>
                <td>
                  <b>
                    <FormattedMessage id="form15.remarks" />
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
              </tr>
              </thead>
              <tbody>
              {this.props.dataToMap &&
                this.props.dataToMap.map((r, i) => (
                  <tr>
                    <td>{i + 1}</td>
                    <td>{r.communicationReceivedFrom}</td>
                    <td>{r.noOfCommunication}</td>
                    <td>{r.dateOfReceipt}</td>
                    <td>{r.subjectActionToTake}</td>
                    <td>{r.communicationDispatchedToWhom}</td>
                    <td>{r.dateOfDispatch}</td>
                    <td>{r.noInList}</td>
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

export default Form15Report;
