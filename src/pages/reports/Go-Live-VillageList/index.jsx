import { Alert, Button, Card, Col, Form, Input, message, Row, Select, Modal } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { FormattedMessage } from 'umi';
import styles from './report.module.css';
import { useReactToPrint } from 'react-to-print';
import URLS from '@/URLs/urls';
import useAxios from '@/components/eComponents/use-axios';
import { useModel } from 'umi';
import { useHistory, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useForm } from 'react-hook-form';

function GoLiveVillageReport() {
  const componentRef = useRef();
  const { districtName, talukaName, roles, servarthId } = useModel('details');
  const [divisionList, setDivisionList] = useState();
  const [districtList, setDistrictList] = useState([]);
  const [talukaList, setTalukaList] = useState([]);
  const [divisionCode, setDivisionCode] = useState();
  const [divisionLabel, setDivisionLabel] = useState();
  const [districtCode, setDistrictCode] = useState('');
  const [talukaCode, setTalukaCode] = useState('');
  const [tableData, setTableData] = useState();
  const [loading, setLoading] = useState([]);
  const { sendRequest } = useAxios();
  const location = useLocation();
  const [form1] = Form.useForm();
  const [form2] = Form.useForm();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

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

  // useEffect(() => {
  //   if (location?.state?.divisionCode) {
  //     handleOnChangeDivision();
  //   }
  // }, []);

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
    }, 2000);
  };

  const getAllDistrict = async () => {
    sendRequest(`${URLS.BaseURL}/dashboard/getDropDownsDivision`, 'GET', null, (res) => {
      setDivisionList(
        res.data.map((r, i) => ({
          label: r.divisionName,
          value: r.divisionCode,
        })),
      );
    });
  };

  const handleOnChangeDivision = async (e) => {
    setDistrictList('');
    setTalukaList('');
    form1.resetFields();
    form2.resetFields();

    setTableData();
    sendRequest(
      `${URLS.BaseURL}/dashboard/getDropDownsDistrict?divisionCode=${e}`,
      'GET',
      null,
      (res) => {
        setDistrictList(
          res.data.map((r, i) => ({
            label: r.districtName,
            value: r.districtCode,
          })),
        );
      },
    );
    setDivisionCode(e);
  };

  const handleOnChangeDistrict = async (e) => {
    setTableData();
    sendRequest(
      `${URLS.BaseURL}/dashboard/getDropDownsTaluka?districtCode=${e}`,
      'GET',
      null,
      (res) => {
        setTalukaList(
          res.data.map((r, i) => ({
            label: r.talukaName,
            value: r.talukaCode,
          })),
        );
      },
    );
    setDistrictCode(e);
  };

  const getTableData = async (e) => {
    sendRequest(
      `${URLS.BaseURL}/dashboard/supervisoryDashBoardAllRecords?divisionCode=${divisionCode}&districtCode=${districtCode}&talukaCode=${talukaCode}`,
      'POST',
      null,
      (res) => {
        setTableData(
          res.data.dashboardSupervisoryDtlData.map((r, i) => ({
            srNo: i + 1,
            districtName: r.districtName,
            talukaName: r.talukaName,
            villageName: r.villageName,
            ccode: r.ccode,
          })),
        );
        message.success('Records Fetched!');
      },
      (err) => {
        message.error('Data Not Found !');
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
            <h1 style={{ textAlign: 'center' }}>Go Live Village List</h1>
          </Col>
          {/* <Col span={8}>
            <Button style={{ float: 'right' }} onClick={backToHomeButton} type="primary">
              <FormattedMessage id="formLanguage.form.backhomeButton" />
            </Button>
          </Col> */}
        </Row>

        <Form>
          <Row style={{ marginTop: '20px' }}>
            <Col xl={7} lg={7} md={7} sm={24} xs={24}>
              <Form.Item label={<FormattedMessage id="formLanguage.form.vibhag" />}>
                <Select
                  // defaultValue={location?.state?.division}
                  // disabled
                  placeholder="विभाग"
                  options={divisionList}
                  // onSelect={(e) => setDivisionLabel(e)}
                  onChange={(e) => handleOnChangeDivision(e)}
                />
              </Form.Item>
            </Col>
            <Col xl={1} lg={1} md={1} sm={24} xs={24}></Col>
            <Col xl={7} lg={7} md={7} sm={24} xs={24}>
              <Form form={form1}>
                <Form.Item
                  name="district"
                  label={<FormattedMessage id="villageSelector.label.district" />}
                >
                  <Select
                    placeholder="जिल्हा"
                    options={districtList}
                    onChange={(e) => handleOnChangeDistrict(e)}
                  ></Select>
                </Form.Item>
              </Form>
            </Col>
            <Col xl={1} lg={1} md={1} sm={24} xs={24}></Col>
            <Col xl={7} lg={7} md={7} sm={24} xs={24}>
              <Form form={form2}>
                <Form.Item
                  name="taluka"
                  label={<FormattedMessage id="villageSelector.label.taluka" />}
                >
                  <Select
                    placeholder="तालुका"
                    options={talukaList}
                    onChange={(e) => setTalukaCode(e)}
                  ></Select>
                </Form.Item>
              </Form>
            </Col>

            <Col xl={1} lg={1} md={1} sm={24} xs={24}></Col>

            <Col xl={2} lg={2} md={2} sm={24} xs={24}>
              <Button
                loading={loading[0]}
                onClick={() => {
                  if (divisionCode) {
                    getTableData();
                    enterLoading(0);
                  } else if (divisionCode == null) {
                    message.info('Please Select Division');
                  }
                }}
                type="primary"
              >
                <FormattedMessage id="formLanguage.button.search" />
              </Button>
            </Col>
            {/* <Col xl={1} lg={1} md={1} sm={24} xs={24}></Col>

            <Col xl={2} lg={2} md={2} sm={24} xs={24}>
              <Button
                onClick={resetForm}
                type="default"
                style={{ color: 'white', backgroundColor: 'orange' }}
              >
                <FormattedMessage id="formLanguage.button.reset" />
              </Button>
            </Col> */}
          </Row>
        </Form>
      </Card>
      <ComponentToPrint
        ref={componentRef}
        // divisionLabel={divisionLabel}

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
                  <th colSpan={24}>
                    <h3 style={{ color: 'red' }}>
                      <b>Go Live Village List</b>
                    </h3>
                    {/* <h3>{this.props.divisionLabel}</h3> */}
                  </th>
                </tr>

                {/* <tr>
                  <th colSpan="20">
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
                    <b>{<FormattedMessage id="villageForm.form.srno" />}</b>
                  </th>
                  {/* <th colSpan={1} rowSpan={4}>
                    <b>{<FormattedMessage id="formLanguage.form.vibhag" />}</b>
                  </th> */}
                  <th colSpan={1} rowSpan={4}>
                    <b>
                      <FormattedMessage id="formLanguage.form.district" />
                    </b>
                  </th>
                  <th colSpan={1} rowSpan={4}>
                    <b>
                      <FormattedMessage id="formLanguage.form.taluka" />
                    </b>
                  </th>
                  <th colSpan={1} rowSpan={4}>
                    <b>cCode</b>
                  </th>
                  <th colSpan={1} rowSpan={4}>
                    <b>
                      <FormattedMessage id="villageForm.form.allVillageName" />
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
                  {/* <td>6</td> */}
                </tr>

                {this.props.dataToMap &&
                  this.props.dataToMap.map((r, i) => (
                    <tr>
                      <td>{i + 1}</td>
                      {/* <td>{r.divisionName}</td> */}

                      <td>{r.districtName}</td>
                      <td>{r.talukaName}</td>
                      <td>{r.ccode}</td>
                      <td>{r.villageName}</td>
                    </tr>
                  ))}
                {/* <tr>
                  <td colSpan={1}>
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
                </tr> */}
              </tbody>
            </table>
          </Card>
        </div>
      </div>
    );
  }
}

export default GoLiveVillageReport;
