import { PageContainer } from '@ant-design/pro-layout';
import styles from './report.module.css';
import React, { useState, useRef, useEffect } from 'react';
import { Button, Card, Col, message, Row, Select } from 'antd';
import { useHistory, useLocation } from 'react-router-dom';
import Axios from 'axios';
import VillageSelector from '@/components/eComponents/VillageSelector';
import BaseURL from '@/URLs/urls';
import { useReactToPrint } from 'react-to-print';
import URLS from '@/URLs/urls';
import useAxios from '@/components/eComponents/use-axios';
import { useModel } from 'umi';
import { FormattedMessage } from 'umi';

function Report21() {
  const { districtName, talukaName, districtCode, talukaCode, servarthId } = useModel('details');
  const { sendRequest } = useAxios();
  const [codeVillage, setCodeVillage] = useState('');
  const [textForVillage, setTextForVillage] = useState();
  const [isNirank, setIsNirank] = useState(false);

  const [village, setVillage] = useState([]);
  const [tableData, setTableData] = useState();
  const [textVillage, setTextVillage] = useState('');
  const componentRef = useRef();
  const [revenueYear, setRevenueYear] = useState();
  const history = useHistory();

  useEffect(() => {
    getTableData();
  }, []);

  const backToHomeButton = () => {
    history.push({ pathname: '/homepage' });
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const getTableData = async () => {
    sendRequest(`${URLS.BaseURL}/form21/getForm21Data?userId=${servarthId}`, 'GET', null, (res) => {
      setTableData(
        res.data.form21Data.map((r, index) => ({
          srNo: index + 1,
          id: r.id,
          villageName: r.villageName,
          diaryDate: r.diaryDate,
          day: r.day,
          remarks: r.remarks,
        })),
      );
      message.success('Records Fetched!!');
    });
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
              <FormattedMessage id="villageForm21.form.reuleVillageForm21" />
            </h1>
          </Col>
          <Col span={8}>
            <Button style={{ float: 'right' }} onClick={backToHomeButton} type="primary">
              <FormattedMessage id="formLanguage.form.backhomeButton" />
            </Button>
          </Col>
        </Row>

        {/* <VillageSelector
          pageType="withoutYear"
          setCodeVillage={setCodeVillage}
          setTextForVillage={setTextForVillage}
          onVillageChange={(setVillage,setTableData)}
          yearChange={setRevenueYear}
        />
        <Row style={{ marginLeft: '15px' }}>
          <Col xl={22} lg={22} md={22} sm={20} xs={20}></Col>
          <Col xl={2} lg={2} md={2} sm={4} xs={4}>
            <Button
             onClick={() => {
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
          </Col>
        </Row> */}
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
                      <FormattedMessage id="villageForm21.form.reuleVillageForm21" />
                    </h2>
                  </th>
                </tr>
                <tr>
                  <th colSpan="16">
                    <h2 style={{ textAlign: 'center', color: 'red' }}>
                      <FormattedMessage id="villageForm21.form.diaryOff" />
                    </h2>
                  </th>
                </tr>

                <tr>
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
                </tr>

                <tr>
                  <th colSpan={1} rowSpan={4}>
                    <b>
                      <FormattedMessage id="formLanguage.form.serialNo" />
                    </b>
                  </th>
                  <th rowSpan={4} colSpan={1}>
                    <b>
                      <FormattedMessage id="villageForm21.form.villageName" />
                    </b>
                  </th>
                  <th rowSpan={4} colSpan={1}>
                    <b>
                      <FormattedMessage id="villageForm21.form.date" />
                    </b>
                  </th>
                  <th rowSpan={4} colSpan={1}>
                    <b>
                      <FormattedMessage id="villageForm21.form.day" />
                    </b>
                  </th>
                  <th rowSpan={4} colSpan={1}>
                    <b>
                      <FormattedMessage id="formLanguage.table.remark" />
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
                </tr>
                {this.props.dataToMap ? (
                  this.props.dataToMap.map((r, i) => (
                    <tr>
                      <td>{i + 1}</td>

                      <td>{r.villageName}</td>
                      <td>{r.diaryDate}</td>

                      <td>{r.day}</td>

                      <td>{r.remarks}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5}> निरंक </td>
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

export default Report21;
