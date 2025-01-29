import { Alert, Button, Card, Col, Form, message, Modal, Row, Select, Spin } from 'antd';
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

function index() {
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
  const [loading, setLoading] = useState(false);
  const [oneTimeEntry, setOneTimeEntry] = useState(0);
  const [kaJaPa, setKaJaPa] = useState(0);
  const [addlLandRev, setAddlLandRev] = useState(0);
  const [khataMerging, setKhataMerging] = useState(0);
  const [villageForm1, setVillageForm1] = useState(0);
  const [villageForm1A, setVillageForm1A] = useState(0);
  const [villageForm1B, setVillageForm1B] = useState(0);
  const [villageForm1D, setVillageForm1D] = useState(0);
  const [villageForm1E, setVillageForm1E] = useState(0);
  const [villageForm2, setVillageForm2] = useState(0);
  const [villageForm3, setVillageForm3] = useState(0);
  const [villageForm6B, setVillageForm6B] = useState(0);
  const [villageForm6D, setVillageForm6D] = useState(0);
  const [villageForm7A, setVillageForm7A] = useState(0);
  const [villageForm7B, setVillageForm7B] = useState(0);
  const [villageForm8C, setVillageForm8C] = useState(0);
  const [villageForm14, setVillageForm14] = useState(0);
  const [villageForm15, setVillageForm15] = useState(0);
  const [villageForm17, setVillageForm17] = useState(0);
  const [villageForm19, setVillageForm19] = useState(0);

  useEffect(() => {
    if (servarthId === 'Collector') {
      getAllDistrict();
    } else {
      <>
        <Alert
          message="Error"
          description="This is an error message about copywriting."
          type="error"
          showIcon
        />
        ;
      </>;
      Modal.error({
        okType: 'danger',
        okText: 'रद्द करा ',

        //cancelText: <FormattedMessage id="formLanguage.form.no" />,
        title: 'ई-चावडी माहिती',
        content: 'सदर अहवालसाठी आपण पात्र नाही',
        onCancel() {},
      });
    }
  }, []);

  const getAllDistrict = async () => {
    await axios.get(`${URLS.BaseURL1}/m_village/getDropDownsDistrict`).then((res) => {
      // console.log('is Districts there??', res);
      setDistricts(
        res.data.map((row) => ({
          label: row.districtName,
          value: row.districtCode,
        })),
      );
    });
  };

  const handleOnChangeDistrict = async (e) => {
    setTableData();
    setOneTimeEntry(0);
    setKaJaPa(0);
    setAddlLandRev(0);
    setKhataMerging(0);
    setVillageForm1(0);
    setVillageForm1A(0);
    setVillageForm1B(0);
    setVillageForm1D(0);
    setVillageForm1E(0);
    setVillageForm2(0);
    setVillageForm3(0);
    setVillageForm6B(0);
    setVillageForm6D(0);
    setVillageForm7A(0);
    setVillageForm7B(0);
    setVillageForm8C(0);
    setVillageForm14(0);
    setVillageForm15(0);
    setVillageForm17(0);
    setVillageForm19(0);
    await axios
      .get(`${URLS.BaseURL1}/m_village/getDropDownsTaluka?districtCode=${e}`)
      .then((res) => {
        setTaluka(
          res.data.map((row) => ({
            label: row.talukaName,
            value: row.talukaCode,
          })),
        );
      });
    setDistrictCode(e);
  };

  const handleOnChangeTaluka = async (e) => {
    setTalukaCode(e);
    setTableData();
    setOneTimeEntry(0);
    setKaJaPa(0);
    setAddlLandRev(0);
    setKhataMerging(0);
    setVillageForm1(0);
    setVillageForm1A(0);
    setVillageForm1B(0);
    setVillageForm1D(0);
    setVillageForm1E(0);
    setVillageForm2(0);
    setVillageForm3(0);
    setVillageForm6B(0);
    setVillageForm6D(0);
    setVillageForm7A(0);
    setVillageForm7B(0);
    setVillageForm8C(0);
    setVillageForm14(0);
    setVillageForm15(0);
    setVillageForm17(0);
    setVillageForm19(0);
  };

  const handleOnChangeVillage = async (e) => {
    setCodeVillage(e);
  };

  const backToHomeButton = () => {
    history.push({ pathname: '/homepage' });
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const getTableData = async (e) => {
    setOneTimeEntry(0);
    setKaJaPa(0);
    setAddlLandRev(0);
    setKhataMerging(0);
    setVillageForm1(0);
    setVillageForm1A(0);
    setVillageForm1B(0);
    setVillageForm1D(0);
    setVillageForm1E(0);
    setVillageForm2(0);
    setVillageForm3(0);
    setVillageForm6B(0);
    setVillageForm6D(0);
    setVillageForm7A(0);
    setVillageForm7B(0);
    setVillageForm8C(0);
    setVillageForm14(0);
    setVillageForm15(0);
    setVillageForm17(0);
    setVillageForm19(0);
    setLoading(true);

    sendRequest(
      `${URLS.BaseURL1}/m_village/getvillagelist?districtCode=${districtCodee}&talukaCode=${talukaCode}`,
      'GET',
      null,
      (res) => {
        res.data.map((r, i) => {
          setOneTimeEntry((prevOTE) => prevOTE + parseFloat(r.oneTimeDataEntry));
          setKaJaPa((prevKajapa) => prevKajapa + parseFloat(r.form17KaJaPa));
          setAddlLandRev((prevAddleLand) => prevAddleLand + parseFloat(r.addLandRevenue));
          setKhataMerging((prevAddleLand) => prevAddleLand + parseFloat(r.khataMerge));
          setVillageForm1((prevVillage1) => prevVillage1 + parseFloat(r.form1));
          setVillageForm1A((prevVillage1A) => prevVillage1A + parseFloat(r.form1a));
          setVillageForm1B((prevVillage1B) => prevVillage1B + parseFloat(r.form1b));
          setVillageForm1D((prevVillage1D) => prevVillage1D + parseFloat(r.form1d));
          setVillageForm1E((prevVillage1E) => prevVillage1E + parseFloat(r.form1e));
          setVillageForm2((prevVillage2) => prevVillage2 + parseFloat(r.form2));
          setVillageForm3((prevVillage3) => prevVillage3 + parseFloat(r.form3));
          setVillageForm6B((prevVillage6b) => prevVillage6b + parseFloat(r.form6b));
          setVillageForm6D((prevVillage6d) => prevVillage6d + parseFloat(r.form6d));
          setVillageForm7A((prevVillage7a) => prevVillage7a + parseFloat(r.form7a));
          setVillageForm7B((prevVillage7b) => prevVillage7b + parseFloat(r.form7b));
          setVillageForm8C((prevVillage8c) => prevVillage8c + parseFloat(r.form8c));
          setVillageForm14((prevVillage14) => prevVillage14 + parseFloat(r.form14));
          setVillageForm15((prevVillage15) => prevVillage15 + parseFloat(r.form15));
          setVillageForm17((prevVillage17) => prevVillage17 + parseFloat(r.form17));
          setVillageForm19((prevVillage19) => prevVillage19 + parseFloat(r.form19));
        });
        setTableData(
          res.data.map((r, i) => ({
            srNo: i + 1,

            id: r.id,
            districtname: r.districtname,
            talukaname: r.talukaname,
            villagename: r.villagename,
            khataMerge: r.khataMerge,
            oneTimeDataEntry: r.oneTimeDataEntry,
            form17KaJaPa: r.form17KaJaPa,
            addLandRevenue: r.addLandRevenue,
            form1: r.form1,
            form1abstract: r.form1abstract,
            form1a: r.form1a,
            form1b: r.form1b,
            form1d: r.form1d,
            form1e: r.form1e,
            form2: r.form2,
            form3: r.form3,
            form6b: r.form6b,
            form6d: r.form6d,
            form7a: r.form7a,
            form7b: r.form7b,
            form8c: r.form8c,
            form14: r.form14,
            form15: r.form15,
            form17: r.form17,
            form19: r.form19,
          })),
          message.success('Records Fetched Successfully'),
        );
        setLoading(false);
      },
      (err) => {
        message.error('Details not Found');
      },
      setLoading(false),
    );
    //setTalukaCode(e);
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
              <b>तालुका निहाय नोंदवलेली माहिती</b>
            </h1>
          </Col>
          {/* <Col span={8}>
            <Button style={{ float: 'right' }} onClick={backToHomeButton} type="primary">
              <FormattedMessage id="formLanguage.form.backhomeButton" />
            </Button>
          </Col> */}
        </Row>

        {/* <Form>
          <Row style={{ marginTop: '20px' }}>
            <Col xl={10} lg={10} md={10} sm={24} xs={24}>
              <Form.Item label={<FormattedMessage id="villageSelector.label.district" />}>
                <Select options={districts} onSelect={(e) => handleOnChangeDistrict(e)}></Select>
              </Form.Item>
            </Col>
            <Col xl={1} lg={1} md={1} sm={24} xs={24}></Col>
            <Col xl={10} lg={10} md={10} sm={24} xs={24}>
              <Form.Item label={<FormattedMessage id="villageSelector.label.taluka" />}>
                <Select options={taluka} onChange={(e) => handleOnChangeTaluka(e)}></Select>
              </Form.Item>
            </Col>
           
            <Col xl={1} lg={1} md={1} sm={24} xs={24}></Col>

            <Col xl={2} lg={2} md={2} sm={24} xs={24}>
              <Button
                onClick={() => {
                  if (districtCodee && talukaCode) {
                    getTableData();
                  } else if (districtCodee == null) {
                    message.info('Please Select District');
                  } else if (talukaCode == null) {
                    message.info('Please Select Taluka');
                  }
                }}
                type="primary"
              >
                <FormattedMessage id="formLanguage.button.search" />
              </Button>
              <center>
                {loading === true ? <Spin size="large" style={{ marginTop: '20px' }} /> : null}
              </center>
            </Col>
          </Row>
        </Form> */}
      </Card>
      <ComponentToPrint
        ref={componentRef}
        village={textForVillage}
        taluka={talukaName}
        district={districtName}
        dataToMap={tableData}
        oneTimeEntry={oneTimeEntry}
        kaJaPa={kaJaPa}
        addlLandRev={addlLandRev}
        khataMerging={khataMerging}
        villageForm1={villageForm1}
        villageForm1A={villageForm1A}
        villageForm1B={villageForm1B}
        villageForm1D={villageForm1D}
        villageForm1E={villageForm1E}
        villageForm2={villageForm2}
        villageForm3={villageForm3}
        villageForm6B={villageForm6B}
        villageForm6D={villageForm6D}
        villageForm7A={villageForm7A}
        villageForm7B={villageForm7B}
        villageForm8C={villageForm8C}
        villageForm14={villageForm14}
        villageForm15={villageForm15}
        villageForm17={villageForm17}
        villageForm19={villageForm19}
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
                  <th colSpan={24}>
                    <h3 style={{ color: 'red' }}>
                      <b>तालुका निहाय नोंदवलेली माहिती</b>
                    </h3>
                  </th>
                </tr>

                <tr>
                  <th colSpan={1} rowSpan={4}>
                    <b>{<FormattedMessage id="villageForm.form.srno" />}</b>
                  </th>
                  {/* <th colSpan={1} rowSpan={4}>
                    <b>
                      <FormattedMessage id="formLanguage.form.district" />
                    </b>
                  </th> */}
                  <th colSpan={1} rowSpan={4}>
                    <b>
                      <FormattedMessage id="formLanguage.form.taluka" />
                    </b>
                  </th>
                  <th colSpan={1} rowSpan={4}>
                    <b>
                      <FormattedMessage id="villageForm.form.allVillageName" />
                    </b>
                  </th>
                  <th colSpan={1} rowSpan={4}>
                    <b>
                      <FormattedMessage id="oneTimeEntry.form.ote" />
                    </b>
                  </th>
                  <th colSpan={1} rowSpan={4}>
                    <b>
                      <FormattedMessage id="villageForm17.table.kajapa" />
                    </b>
                  </th>
                  <th colSpan={1} rowSpan={4}>
                    <b>
                      <FormattedMessage id="formLanguage.form.addLandRev" />
                    </b>
                  </th>
                  <th colSpan={1} rowSpan={4}>
                    <b>
                      <FormattedMessage id="formLanguage.form.khataMerging" />
                    </b>
                  </th>

                  <th rowSpan={4} colSpan={1}>
                    <b>
                      <FormattedMessage id="formLanguage.label.villageForm" />
                    </b>
                  </th>
                  {/* <th rowSpan={4} colSpan={1}>
                    <b>
                      <FormattedMessage id="form1abstract.heading" />{' '}
                    </b>
                  </th> */}
                  <th rowSpan={4} colSpan={1}>
                    <b>
                      <FormattedMessage id="villageForm1A.table.villageForm1A" />
                    </b>
                  </th>
                  <th rowSpan={4} colSpan={1}>
                    <b>
                      <FormattedMessage id="formLanguage.label.villageForm1a" />
                    </b>
                  </th>
                  <th rowSpan={4} colSpan={1}>
                    <b>
                      <FormattedMessage id="formLanguage.form.villageForm1D" />
                    </b>
                  </th>
                  <th rowSpan={4} colSpan={1}>
                    <b>
                      <FormattedMessage id="villageForm1E.table.villageForm1E" />
                    </b>
                  </th>
                  <th rowSpan={4} colSpan={1}>
                    <b>
                      <FormattedMessage id="villageForm.form.VillageName2" />
                    </b>
                  </th>
                  <th rowSpan={4} colSpan={1}>
                    <b>
                      <FormattedMessage id="villageForm3.form.villageTitle" />
                    </b>
                  </th>
                  <th rowSpan={4} colSpan={1}>
                    <b>
                      <FormattedMessage id="formLanguage.label.villageForm6B" />
                    </b>
                  </th>
                  <th rowSpan={4} colSpan={1}>
                    <b>
                      <FormattedMessage id="formLanguage.label.villageForm6D" />
                    </b>
                  </th>
                  <th rowSpan={4} colSpan={1}>
                    <b>
                      <FormattedMessage id="villageForm.form.villageForm" />
                    </b>
                  </th>
                  <th colSpan={1} rowSpan={4}>
                    <b>
                      <FormattedMessage id="villageForm.form.villageForm7B" />
                    </b>
                  </th>
                  <th colSpan={1} rowSpan={4}>
                    <b>
                      <FormattedMessage id="villageForm8c.form.villageForm8c" />
                    </b>
                  </th>
                  <th colSpan={1} rowSpan={4}>
                    <b>
                      <FormattedMessage id="form14.radio.14" />
                    </b>
                  </th>
                  <th colSpan={1} rowSpan={4}>
                    <b>
                      <FormattedMessage id="form15.village15" />
                    </b>
                  </th>
                  <th colSpan={1} rowSpan={4}>
                    <b>
                      <FormattedMessage id="villageForm17.table.village17" />
                    </b>
                  </th>
                  <th rowSpan={4} colSpan={1}>
                    <b>
                      <FormattedMessage id="villageForm19.title.village19" />
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
                  <td>17</td>
                  <td>18</td>

                  <td>19</td>
                  <td>20</td>
                  <td>21</td>
                  <td>22</td>
                  <td>23</td>
                </tr>

                {this.props.dataToMap &&
                  this.props.dataToMap.map((r, i) => (
                    <tr key={i}>
                      <td>{r.srNo}</td>
                      {/*  <td>{r.districtname}</td> */}
                      <td>{r.talukaname}</td>
                      <td>{r.villagename}</td>
                      <td style={{ backgroundColor: r.oneTimeDataEntry > 0 ? 'skyblue' : 'white' }}>
                        {r.oneTimeDataEntry}
                      </td>
                      <td style={{ backgroundColor: r.form17KaJaPa > 0 ? 'skyblue' : 'white' }}>
                        {r.form17KaJaPa}
                      </td>
                      <td style={{ backgroundColor: r.addLandRevenue > 0 ? 'skyblue' : 'white' }}>
                        {r.addLandRevenue}
                      </td>

                      <td style={{ backgroundColor: r.khataMerge > 0 ? 'skyblue' : 'white' }}>
                        {r.khataMerge}
                      </td>
                      <td style={{ backgroundColor: r.form1 > 0 ? 'skyblue' : 'white' }}>
                        {r.form1}
                      </td>
                      {/* <td style={{ backgroundColor: r.form1abstract > 0 ? 'skyblue' : 'white' }}>
                        {r.form1abstract}
                      </td> */}
                      <td style={{ backgroundColor: r.form1a > 0 ? 'skyblue' : 'white' }}>
                        {r.form1a}
                      </td>
                      <td style={{ backgroundColor: r.form1b > 0 ? 'skyblue' : 'white' }}>
                        {r.form1b}
                      </td>
                      <td style={{ backgroundColor: r.form1d > 0 ? 'skyblue' : 'white' }}>
                        {r.form1d}
                      </td>
                      <td style={{ backgroundColor: r.form1e > 0 ? 'skyblue' : 'white' }}>
                        {r.form1e}
                      </td>
                      <td style={{ backgroundColor: r.form2 > 0 ? 'skyblue' : 'white' }}>
                        {r.form2}
                      </td>
                      <td style={{ backgroundColor: r.form3 > 0 ? 'skyblue' : 'white' }}>
                        {r.form3}
                      </td>
                      <td style={{ backgroundColor: r.form6b > 0 ? 'skyblue' : 'white' }}>
                        {r.form6b}
                      </td>
                      <td style={{ backgroundColor: r.form6d > 0 ? 'skyblue' : 'white' }}>
                        {r.form6d}
                      </td>
                      <td style={{ backgroundColor: r.form7a > 0 ? 'skyblue' : 'white' }}>
                        {r.form7a}
                      </td>
                      <td style={{ backgroundColor: r.form7b > 0 ? 'skyblue' : 'white' }}>
                        {r.form7b}
                      </td>
                      <td style={{ backgroundColor: r.form8c > 0 ? 'skyblue' : 'white' }}>
                        {r.form8c}
                      </td>
                      <td style={{ backgroundColor: r.form14 > 0 ? 'skyblue' : 'white' }}>
                        {r.form14}
                      </td>
                      <td style={{ backgroundColor: r.form15 > 0 ? 'skyblue' : 'white' }}>
                        {r.form15}
                      </td>
                      <td style={{ backgroundColor: r.form17 > 0 ? 'skyblue' : 'white' }}>
                        {r.form17}
                      </td>
                      <td style={{ backgroundColor: r.form19 > 0 ? 'skyblue' : 'white' }}>
                        {r.form19}
                      </td>
                    </tr>
                  ))}
                <tr>
                  <td colSpan={3}>
                    <b>
                      <FormattedMessage id="formLanguage.form.total" />
                    </b>
                  </td>
                  <td>
                    <b>{this.props.oneTimeEntry}</b>
                  </td>
                  <td>
                    <b>{this.props.kaJaPa}</b>
                  </td>
                  <td>
                    <b>{this.props.addlLandRev}</b>
                  </td>
                  <td>
                    <b>{this.props.khataMerging}</b>
                  </td>

                  <td>
                    <b>{this.props.villageForm1}</b>
                  </td>
                  <td>
                    <b>{this.props.villageForm1A}</b>
                  </td>
                  <td>
                    <b>{this.props.villageForm1B}</b>
                  </td>
                  <td>
                    <b>{this.props.villageForm1D}</b>
                  </td>
                  <td>
                    <b>{this.props.villageForm1E}</b>
                  </td>
                  <td>
                    <b>{this.props.villageForm2}</b>
                  </td>
                  <td>
                    <b>{this.props.villageForm3}</b>
                  </td>
                  <td>
                    <b>{this.props.villageForm6B}</b>
                  </td>
                  <td>
                    <b>{this.props.villageForm6D}</b>
                  </td>
                  <td>
                    <b>{this.props.villageForm7A}</b>
                  </td>
                  <td>
                    <b>{this.props.villageForm7B}</b>
                  </td>
                  <td>
                    <b>{this.props.villageForm8C}</b>
                  </td>
                  <td>
                    <b>{this.props.villageForm14}</b>
                  </td>
                  <td>
                    <b>{this.props.villageForm15}</b>
                  </td>
                  <td>
                    <b>{this.props.villageForm17}</b>
                  </td>
                  <td>
                    <b>{this.props.villageForm19}</b>
                  </td>
                </tr>
              </tbody>
            </table>
          </Card>
        </div>
      </div>
    );
  }
}

export default index;
