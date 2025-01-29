import { PageContainer } from '@ant-design/pro-layout';
import styles from './report.module.css';
import React, { useState, useRef } from 'react';
import { Button, Card, Col, message, Row, Select, Spin } from 'antd';
import { useHistory, useLocation } from 'react-router-dom';
import Axios from 'axios';
import VillageSelector from '@/components/eComponents/VillageSelector';
import BaseURL from '@/URLs/urls';
import URLS from '@/URLs/urls';
import useAxios from '@/components/eComponents/use-axios';
import { useReactToPrint } from 'react-to-print';
import { useModel } from 'umi';
import { FormattedMessage } from 'umi';

function Form14Report() {
  const { districtName, talukaName, districtCode, talukaCode } = useModel('details');
  const { sendRequest } = useAxios();
  const [codeVillage, setCodeVillage] = useState('');
  const [textForVillage, setTextForVillage] = useState();
  const [isNirank, setIsNirank] = useState(false);

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
      `${URLS.BaseURL}/form14/getForm14Report?districtCode=${districtCode}&talukaCode=${talukaCode}&cCode=${codeVillage}`,
      'GET',
      null,
      (res) => {
        setTableData(
          res.data.form14Data.map((r) => ({
            eWaterSourceName: r.eWaterSourceName,
            position: r.position,
            pakkaOrKaccha: r.pakkaOrKaccha,
            purposeOfUse: r.purposeOfUse,
            governmentbodyOrPrivate: r.governmentbodyOrPrivate,
            remarks: r.remarks,
          })),
        );
        message.success('Records Fetched!!');
        setLoading(false);
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
              <FormattedMessage id="form14.fields.ruleReportHead" />
            </h1>
          </Col>
          <Col span={8}>
            <Button style={{ float: 'right' }} onClick={backToHomeButton} type="primary">
              <FormattedMessage id="formLanguage.form.backhomeButton" />
            </Button>
          </Col>
        </Row>
        <div style={{ padding: 10 }}></div>
        {/* <Row style={{ marginLeft: '15px' }}> */}
        <VillageSelector
          pageType="withoutYear"
          setCodeVillage={setCodeVillage}
          setTextForVillage={setTextForVillage}
          onVillageChange={(setVillage, setTableData)}
          yearChange={setRevenueYear}
          setIsNirank={setIsNirank}
        />

        <Button
          /* onClick={getTableData} */ onClick={() => {
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
                      <FormattedMessage id="form14.fields.ruleReportHead" />
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
                        गाव-{this.props.village} तालुका-{this.props.taluka} जिल्हा-
                        {this.props.district}
                      </b>
                    </pre>
                  </h4>
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
                    <FormattedMessage id="form14.input.sourcesOfWater" />
                  </b>
                </td>
                <td>
                  <b>
                    <FormattedMessage id="form14.fields.position" />
                  </b>
                </td>
                <td>
                  <b>
                    <FormattedMessage id="form14.fields.pakkaOrKaccha" />
                  </b>
                </td>
                <td>
                  <b>
                    <FormattedMessage id="form14.fields.purposeOfUse" />
                  </b>
                </td>

                <td>
                  <b>
                    <FormattedMessage id="form14.fields.governmentbodyOrPrivate" />
                  </b>
                </td>
                <td>
                  <b>
                    <FormattedMessage id="form14.fields.remarks" />
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
              </tr>
              </thead>
              {this.props.dataToMap &&
                this.props.dataToMap.map((r, i) => (
                  <tr>
                    <td>{i + 1}</td>
                    <td>{r.eWaterSourceName}</td>
                    <td>{r.position}</td>
                    <td>{r.pakkaOrKaccha}</td>
                    <td>{r.purposeOfUse}</td>
                    <td>{r.governmentbodyOrPrivate}</td>

                    <td>{r.remarks}</td>
                    {/* <td>{r.noInList}</td>
                  <td>{r.remarks}</td> */}
                  </tr>
                ))}
            </table>
          </Card>
        </div>
      </div>
    );
  }
}

export default Form14Report;
