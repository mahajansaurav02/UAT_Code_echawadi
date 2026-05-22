import { Alert, Button, Card, Col, Form, Input, message, Modal, Row, Select, Spin } from 'antd';
import styles from './report.module.css';
import React, { useState, useRef, useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';
import URLS from '@/URLs/urls';
import useAxios from '@/components/eComponents/use-axios';
import { useModel } from 'umi';
import { useHistory, useLocation } from 'react-router-dom';
import { FormattedMessage } from 'umi';
import axios from 'axios';

function Index() {
  const location = useLocation();
  const { districtName, talukaName, servarthId } = useModel('details');
  const { sendRequest } = useAxios();
  const [codeVillage, setCodeVillage] = useState('');
  const [textForVillage, setTextForVillage] = useState();
  const [village, setVillage] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [tableData, setTableData] = useState();
  const [textVillage, setTextVillage] = useState('');
  const componentRef = useRef();
  const [revenueYear, setRevenueYear] = useState();
  const history = useHistory();
  const [districtCodee, setDistrictCode] = useState();
  const [districts, setDistricts] = useState();
  const [talukaCode, setTalukaCode] = useState(location?.state?.talukacode);
  const [taluka, setTaluka] = useState();
  const [loading, setLoading] = useState([]);
  const [oneTimeEntry, setOneTimeEntry] = useState(0);
  const [kaJaPa, setKaJaPa] = useState(0);
  const [addlLandRev, setAddlLandRev] = useState(0);
  const [khataMerging, setKhataMerging] = useState(0);
  const [villageForm1, setVillageForm1] = useState(0);
  const [villageForm1A, setVillageForm1A] = useState(0);
  const [villageForm1B, setVillageForm1B] = useState(0);
  const [villageForm1C, setVillageForm1C] = useState(0);
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
  const [khatedarNumbers, setKhatedarNumbers] = useState(0);
  const [ekunWasuli, setEkunWasuli] = useState(0);
  const [echawadiData, setEchawadiData] = useState([]);
  const [magnipaikiWasuli, setMagnipaikiWasuli] = useState(0);
  const [eight_b_cVillageForm, setEight_b_cVillageForm] = useState(0);
  const [nirankData, setNirankData] = useState([]);

  // Revenue summary data from your image - Division/District wise
  const [revenueSummary, setRevenueSummary] = useState([
    {
      srNo: 1,
      division: 'अमरावती',
      district: 'अमरावती',
      taluka: 'अमरावती',
      totalVillages: '5567',
      totalDemand: '4665',
      totalDemandLakhs: '5834.21',
      landRevenueDemand: '14.24',
      totalDemandAmount: '5848.45',
      totalCollection: '1628.24',
      landRevenueCollection: '13.80',
      totalCollectionAmount: '1642.04',
      percentage: '28%'
    },
    {
      srNo: 2,
      division: 'कोकण',
      district: 'कोकण',
      taluka: 'कोकण',
      totalVillages: '6506',
      totalDemand: '4071',
      totalDemandLakhs: '18387.15',
      landRevenueDemand: '988.43',
      totalDemandAmount: '19375.58',
      totalCollection: '1271.26',
      landRevenueCollection: '806.25',
      totalCollectionAmount: '2077.51',
      percentage: '11%'
    },
    {
      srNo: 3,
      division: 'नागपूर',
      district: 'नागपूर',
      taluka: 'नागपूर',
      totalVillages: '6648',
      totalDemand: '6961',
      totalDemandLakhs: '19275.81',
      landRevenueDemand: '118.85',
      totalDemandAmount: '19294.66',
      totalCollection: '1417.32',
      landRevenueCollection: '15.00',
      totalCollectionAmount: '1432.32',
      percentage: '7%'
    },
    {
      srNo: 4,
      division: 'नाशिक',
      district: 'नाशिक',
      taluka: 'नाशिक',
      totalVillages: '5546',
      totalDemand: '6539',
      totalDemandLakhs: '9706.74',
      landRevenueDemand: '318.98',
      totalDemandAmount: '10025.72',
      totalCollection: '3120.84',
      landRevenueCollection: '306.42',
      totalCollectionAmount: '3427.26',
      percentage: '35%'
    },
    {
      srNo: 5,
      division: 'पुणे',
      district: 'पुणे',
      taluka: 'पुणे',
      totalVillages: '5586',
      totalDemand: '7651',
      totalDemandLakhs: '12540.53',
      landRevenueDemand: '377.57',
      totalDemandAmount: '12918.10',
      totalCollection: '2649.18',
      landRevenueCollection: '309.85',
      totalCollectionAmount: '2959.04',
      percentage: '24%'
    },
    {
      srNo: 6,
      division: 'छत्रपती संभाजीनगर',
      district: 'छत्रपती संभाजीनगर',
      taluka: 'छत्रपती संभाजीनगर',
      totalVillages: '8768',
      totalDemand: '3121',
      totalDemandLakhs: '1546.64',
      landRevenueDemand: '71.94',
      totalDemandAmount: '1618.58',
      totalCollection: '340.47',
      landRevenueCollection: '53.44',
      totalCollectionAmount: '393.90',
      percentage: '25%'
    },
    {
      srNo: 7,
      division: 'एकूण',
      district: '',
      taluka: '',
      totalVillages: '35358',
      totalDemand: '44296',
      totalDemandLakhs: '67291.09',
      landRevenueDemand: '1790.01',
      totalDemandAmount: '69081.09',
      totalCollection: '10427.31',
      landRevenueCollection: '1504.75',
      totalCollectionAmount: '11932.06',
      percentage: '17.73%'
    }
  ]);

  useEffect(() => {
    if (servarthId === 'Collector' || servarthId === null) {
      getAllDistrict();
    } else {
      Modal.error({
        okType: 'danger',
        okText: 'रद्द करा',
        title: 'इ-चावडी माहिती',
        content: 'सदर अहवालसाठी आपण पात्र नाही',
        onCancel() {
          history.push('/homepage');
        },
      });
    }
  }, [servarthId, history]);

  useEffect(() => {
    if (location?.state?.districtCode) {
      handleOnChangeDistrict(location?.state?.districtCode);
    }
  }, [location?.state?.districtCode]);

  const enterLoading = (index) => {
    setLoading((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[index] = true;
      return newLoadings;
    });
    setTimeout(() => {
      setLoading((prevLoadings) => {
        const newLoadings = [...prevLoadings];
        newLoadings[index] = false;
        return newLoadings;
      });
    }, 20000);
  };

  const getAllDistrict = async () => {
    try {
      const res = await axios.get(`${URLS.BaseURL1}/m_village/getDropDownsDistrict`);
      setDistricts(
        res.data.map((row) => ({
          label: row.districtName,
          value: row.districtCode,
        })),
      );
    } catch (error) {
      message.error('Failed to fetch districts');
    }
  };

  const resetAllCounts = () => {
    setOneTimeEntry(0);
    setKaJaPa(0);
    setAddlLandRev(0);
    setKhataMerging(0);
    setVillageForm1(0);
    setVillageForm1A(0);
    setVillageForm1B(0);
    setVillageForm1C(0);
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
    setKhatedarNumbers(0);
    setEkunWasuli(0);
    setMagnipaikiWasuli(0);
    setEight_b_cVillageForm(0);
  };

  const handleOnChangeDistrict = async (e) => {
    setTableData();
    resetAllCounts();
    try {
      const res = await axios.get(
        `${URLS.BaseURL1}/m_village/getDropDownsTaluka?districtCode=${e}`,
      );
      setTaluka(
        res.data.map((row) => ({
          label: row.talukaName,
          value: row.talukaCode,
        })),
      );
      setDistrictCode(e);
    } catch (error) {
      message.error('Failed to fetch talukas');
    }
  };

  const handleOnChangeTaluka = async (e) => {
    setTalukaCode(e);
    setTableData();
    resetAllCounts();
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



  const getEchawadiVasuliData = async () => {
    if (!location?.state?.districtCode || !talukaCode) {
      message.info('Please Select Taluka');
      return;
    }

    resetAllCounts();
    setTableLoading(true);   // START LOADING

    let revenueYear;

    if (location?.state?.selectedYear === '2025-2026') {
      revenueYear = '2025-26';
    } else if (location?.state?.selectedYear === '2024-2025') {
      revenueYear = '2024-25';
    } else if (location?.state?.selectedYear === '2023-2024') {
      revenueYear = '2023-24';
    }

    try {
      const res = await axios.get(
        `${URLS.BaseURL1}/m_village/getvillageVasuliList?districtCode=${location?.state?.districtCode}&talukaCode=${talukaCode}&revenueYear=${revenueYear}`
      );

      if (res?.data && Array.isArray(res.data)) {
        setEchawadiData(res.data);

        message.success('Data loaded successfully ✅');
      } else {
        setEchawadiData([]);
        message.warning('No records found');
      }
    } catch (error) {
      console.error(error);
      message.error('Failed to fetch data ❌');
    } finally {
      setTableLoading(false);   // STOP LOADING
    }
  };






  const handleSearch = () => {
    if (talukaCode) {
      // getTableData();
      // getNirankStatus();
      enterLoading(0);
      getEchawadiVasuliData()
    } else {
      message.info('Please Select Taluka');
    }
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
          <Col span={12}>
            <h1 style={{ textAlign: 'center' }}>
              <FormattedMessage id="villageForm.form.allVillageReportEchawadi" />
            </h1>
          </Col>
        </Row>

        <Form>
          <Row style={{ marginTop: '20px' }}>
            <Col xl={10} lg={10} md={10} sm={24} xs={24}>
              <Form.Item label={<FormattedMessage id="villageSelector.label.district" />}>
                <Input
                  defaultValue={location?.state?.district}
                  disabled
                />
              </Form.Item>
            </Col>
            <Col xl={1} lg={1} md={1} sm={24} xs={24}></Col>
            <Col xl={10} lg={10} md={10} sm={24} xs={24}>
              <Form.Item label={<FormattedMessage id="villageSelector.label.taluka" />}>
                <Select
                  defaultValue={location?.state?.talukaname}
                  options={taluka}
                  onChange={(e) => handleOnChangeTaluka(e)}
                  placeholder="Select Taluka"
                />
              </Form.Item>
            </Col>
            <Col xl={1} lg={1} md={1} sm={24} xs={24}></Col>
            <Col xl={2} lg={2} md={2} sm={24} xs={24}>
              <Button
                loading={loading[0]}
                onClick={handleSearch}
                type="primary"
              >
                <FormattedMessage id="formLanguage.button.search" />
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
      <ComponentToPrint
        ref={componentRef}
        village={textForVillage}
        taluka={talukaName}
        district={districtName}
        dataToMap={tableData}
        dataToMap1={nirankData}
        revenueSummary={revenueSummary}
        oneTimeEntry={oneTimeEntry}
        kaJaPa={kaJaPa}
        addlLandRev={addlLandRev}
        khataMerging={khataMerging}
        villageForm1={villageForm1}
        villageForm1A={villageForm1A}
        villageForm1B={villageForm1B}
        villageForm1C={villageForm1C}
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
        eight_b_cVillageForm={eight_b_cVillageForm}
        khatedarNumbers={khatedarNumbers}
        ekunWasuli={ekunWasuli}
        magnipaikiWasuli={magnipaikiWasuli}
        echawadiData={echawadiData}
        tableLoading={tableLoading}
      />
    </div>
  );
}

class ComponentToPrint extends React.Component {
  render() {
    const { dataToMap, dataToMap1, revenueSummary, echawadiData,tableLoading } = this.props;

    function calculateVasuliPercentage(r) {
      const totalMagani =
        Number(r.totalDemandJm || 0) +
        Number(r.totalDemandSankirn || 0);

      const totalVasuli =
        Number(r.totalCollectedJm || 0) +
        Number(r.totalCollectedSankirn || 0);

      if (totalMagani > 0) {
        return (totalVasuli / totalMagani) * 100;
      }

      return 0;
    }

    const getCellStyle = (value, formId, cCode, isComparison = false, compareValue = null) => {
      if (!dataToMap1 || !Array.isArray(dataToMap1)) {
        return value > 0 ? 'skyblue' : 'white';
      }

      const formData = dataToMap1.find(d1 => d1?.cCode == cCode && d1?.formId === formId);

      if (formData?.isCompleted === 'Y' || formData?.isNirank === 'Y') {
        return '#90EE90';
      }

      if (isComparison && compareValue !== null) {
        if (value === 0) return 'white';
        return value > compareValue ? '#90EE90' : 'skyblue';
      }

      return value > 0 ? 'skyblue' : 'white';
    };

    return (
      <div style={{ padding: '13px' }}>
        <div className="report">
          <Card>
            {/* Revenue Summary Table - Matches Image Structure with Division/District/Taluka */}
            <table className={styles.report_table} style={{ marginBottom: '30px', width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th colSpan={13} style={{ textAlign: 'center', backgroundColor: '#f0f0f0', padding: '10px' }}>
                    <h3 style={{ color: 'red', margin: 0 }}>
                      <b>जिल्हानिहाय जमीन महसूल अहवाल (District-wise Land Revenue Report)</b>
                    </h3>
                  </th>
                </tr>
                <tr>
                  <th rowSpan={2} style={{ border: '1px solid #000', padding: '8px', backgroundColor: '#e6f7ff', width: '5%' }}>अ.क्र.</th>
                  {/* <th rowSpan={2} style={{ border: '1px solid #000', padding: '8px', backgroundColor: '#e6f7ff', width: '8%' }}>विभाग</th> */}
                  <th rowSpan={2} style={{ border: '1px solid #000', padding: '8px', backgroundColor: '#e6f7ff', width: '8%' }}>जिल्हा</th>
                  <th rowSpan={2} style={{ border: '1px solid #000', padding: '8px', backgroundColor: '#e6f7ff', width: '8%' }}>तालुका</th>
                  <th rowSpan={2} style={{ border: '1px solid #000', padding: '8px', backgroundColor: '#e6f7ff', width: '8%' }}>गाव</th>
                  <th colSpan={3} style={{ border: '1px solid #000', padding: '8px', textAlign: 'center', backgroundColor: '#bae7ff' }}>एकूण मागणी (रुपये लाखात)</th>
                  <th colSpan={3} style={{ border: '1px solid #000', padding: '8px', textAlign: 'center', backgroundColor: '#bae7ff' }}>एकूण वसुली (रुपये लाखात)</th>
                  <th rowSpan={2} style={{ border: '1px solid #000', padding: '8px', backgroundColor: '#e6f7ff', width: '8%' }}>टक्केवारी (%)</th>
                </tr>
                <tr>
                  <th style={{ border: '1px solid #000', padding: '8px', backgroundColor: '#d9f0ff' }}>जमीन महसुलाची मागणी</th>
                  <th style={{ border: '1px solid #000', padding: '8px', backgroundColor: '#d9f0ff' }}>जमिनोत्तर महसुलाची मागणी</th>
                  <th style={{ border: '1px solid #000', padding: '8px', backgroundColor: '#d9f0ff' }}>एकूण</th>
                  <th style={{ border: '1px solid #000', padding: '8px', backgroundColor: '#d9f0ff' }}>जमीन महसुलाची वसुली</th>
                  <th style={{ border: '1px solid #000', padding: '8px', backgroundColor: '#d9f0ff' }}>जमिनोत्तर महसुलाची वसुली</th>
                  <th style={{ border: '1px solid #000', padding: '8px', backgroundColor: '#d9f0ff' }}>एकूण</th>
                </tr>
              </thead>
  <tbody>
  {tableLoading ? (
    <tr>
      <td colSpan={12} style={{ textAlign: 'center', padding: '20px' }}>
        <Spin size="large" />
      </td>
    </tr>
  ) : echawadiData && echawadiData.length > 0 ? (
    echawadiData.map((item, index) => (
 <tr key={index} style={item.district === '' ? { backgroundColor: '#f5f5f5', fontWeight: 'bold' } : {}}>
                    <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>{index + 1}</td>
                    {/* <td style={{ border: '1px solid #000', padding: '8px' }}>{item.division}</td> */}
                    <td style={{ border: '1px solid #000', padding: '8px' }}>{item.districtName}</td>
                    <td style={{ border: '1px solid #000', padding: '8px' }}>{item.talukaName}</td>

                    <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'right' }}>
                      {item.villageName}
                    </td>

                    <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'right' }}>
                      {Number(item.totalDemandJm || 0)}
                    </td>

                    <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'right' }}>
                      {Number(item.totalDemandSankirn || 0)}
                    </td>

                    <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'right' }}>
                      {Number(item.totalDemandJm || 0) + Number(item.totalDemandSankirn || 0)}
                    </td>

                    <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'right' }}>
                      {Number(item.totalCollectedJm || 0)}
                    </td>

                    <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'right' }}>
                      {Number(item.totalCollectedSankirn || 0)}
                    </td>

                    <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'right' }}>
                      {Number(item.totalCollectedJm || 0) + Number(item.totalCollectedSankirn || 0)}
                    </td>

                    <td
                      style={{
                        border: '1px solid #000',
                        padding: '8px',
                        textAlign: 'center',
                        fontWeight: 'bold'
                      }}
                    >
                      {Math.round(calculateVasuliPercentage(item))}%
                    </td>
                  </tr>    ))
  ) : (
    <tr>
      <td colSpan={12} style={{ textAlign: 'center', padding: '20px' }}>
        No Data Available
      </td>
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














export default Index;