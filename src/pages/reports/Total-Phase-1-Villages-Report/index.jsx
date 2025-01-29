import { Alert, Button, Card, Col, Form, Input, message, Modal, Row, Select, Spin } from 'antd';
import styles from './report.module.css';
import React, { useState, useRef, useEffect } from 'react';
import VillageSelector from '@/components/eComponents/VillageSelector';
import BaseURL from '@/URLs/urls';
import { useReactToPrint } from 'react-to-print';
import URLS from '@/URLs/urls';
import useAxios from '@/components/eComponents/use-axios';
import { useModel } from 'umi';
import { useHistory, useLocation } from 'react-router-dom';
import { FormattedMessage } from 'umi';
import { ConsoleSqlOutlined } from '@ant-design/icons';
import axios from 'axios';
import { Backdrop, CircularProgress } from '@mui/material';
import ReactHtmlTableToExcel from 'react-html-table-to-excel';

function TotalPhase1VillageCount() {
  const { districtName, talukaName, roles, servarthId } = useModel('details');
  const { sendRequest } = useAxios();
  const [codeVillage, setCodeVillage] = useState('');
  const [textForVillage, setTextForVillage] = useState();
  const [village, setVillage] = useState([]);
  const [tableData, setTableData] = useState();
  const [textVillage, setTextVillage] = useState('');
  const componentRef = useRef();
  const [revenueYear, setRevenueYear] = useState();
  const history = useHistory();
  const [districtCodee, setDistrictCode] = useState();
  const [districts, setDistricts] = useState();
  const [talukaCode, setTalukaCode] = useState();
  const [taluka, setTaluka] = useState();
  const [loading, setLoading] = useState([]);
  const [open, setOpen] = useState(false);

  const location = useLocation();
  const [talukaCount, setTalukaCount] = useState();

  useEffect(() => {
    if (location?.state?.districtCode) {
      handleOnChangeDistrict();
    }
  }, []);

  const backToHomeButton = () => {
    history.push({ pathname: '/dashboard/analysis' });
  };

  const handleOnChangeDistrict = async (e) => {
    // setTableData();
    setOpen(!open);
    await axios
      .post(`${URLS.AuthURL}/getphase1villagecount?districtCode=${location?.state?.districtCode}`)
      .then((res) => {
        setTableData(
          res.data.map((row, i) => ({
            srNo: i + 1,

            districtNameMarathi: row.districtNameMarathi,
            talukaMameMarathi: row.talukaMameMarathi,
            lgdVillageMame: row.lgdVillageMame,
            divisionCode: row.divisionCode,
          })),
        );
        setTalukaCount(res.data[0].talukaCount);
      });
    setOpen(false);
  };

  return (
    <div>
      <Row>
        <Col span={8}>
          {/* <Button type="primary" onClick={handlePrint}>
            <FormattedMessage id="formLanguage.button.print" />
          </Button> */}
        </Col>
        <Col span={8}></Col>
        <Col span={8}>
          <Button style={{ float: 'right' }} onClick={backToHomeButton} type="primary">
            <FormattedMessage id="formLanguage.form.backhomeButton" />
          </Button>
        </Col>
      </Row>
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <ComponentToPrint
        ref={componentRef}
        village={textForVillage}
        taluka={talukaName}
        district={districtName}
        dataToMap={tableData}
        districtName={location?.state?.district}
        totalPhase1Villages={location?.state?.totalPhase1Villages}
        talukaCount={talukaCount}
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
                  <th colSpan={24}>
                    <h3 style={{ color: 'red' }}>
                      <b>भाग - १ मधील गावांची माहिती</b>
                    </h3>
                  </th>
                </tr>

                <tr>
                  <th colSpan="20">
                    <h4 style={{ color: 'red' }}>
                      <pre>
                        <b>
                          <FormattedMessage id="formLanguage.form.district" /> -{' '}
                          {this.props.districtName} मधील भाग - १ मधील गावांची संख्या{' '}
                          {this.props.totalPhase1Villages}
                        </b>
                      </pre>
                    </h4>
                  </th>
                </tr>

                <tr>
                  <th colSpan={1} rowSpan={4}>
                    <b>{<FormattedMessage id="villageForm.form.srno" />}</b>
                  </th>
                  <th colSpan={1} rowSpan={4}>
                    <b>
                      <FormattedMessage id="formLanguage.form.district" />
                    </b>
                  </th>
                  <th colSpan={1} rowSpan={4}>
                    <b>
                      <FormattedMessage id="formLanguage.form.taluka" />({this.props.talukaCount})
                    </b>
                  </th>
                  <th colSpan={1} rowSpan={4}>
                    <b>
                      <FormattedMessage id="villageForm.form.allVillageName" /> (
                      {this.props.totalPhase1Villages})
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
                </tr>

                {this.props.dataToMap &&
                  this.props.dataToMap.map((r, i) => (
                    <tr key={i}>
                      <td>{r.srNo}</td>
                      <td>{r.districtNameMarathi}</td>
                      <td>{r.talukaMameMarathi}</td>
                      <td>{r.lgdVillageMame}</td>
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

export default TotalPhase1VillageCount;
