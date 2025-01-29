import URLS from '@/URLs/urls';
import { Col, Form, message, Row, Select } from 'antd';
import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';
import { FormattedMessage } from 'umi';
import useAxios from '@/components/eComponents/use-axios';
import { propTypes } from 'react-fittext';
import { useHistory, useLocation } from 'react-router';

const VillageSelector = (props) => {
  const { token } = useModel('Auth');
  const Header = `Bearer ${token}`;
  const {
    servarthId,
    talukaName,
    districtName,
    villageData,
    revenueYear,
    niranks,
    villageData1,
    revenueYear1,
  } = useModel('details');
  const [village, setVillage] = useState([]);
  const [myForm] = Form.useForm();
  const [textForVillage, setTextForVillage] = useState();
  const [validateState, setValidateState] = useState(false);
  // const [revenueYear, setRevenueYear] = useState();
  const [revenueYearForVillage, setRevenueYearForVillage] = useState();
  const echHost = localStorage.getItem('echHost');
  const mhrHost = localStorage.getItem('mhrHost');
  const echDbName = localStorage.getItem('echDbName');
  const echSchemaName = localStorage.getItem('echSchemaName');
  const mhrDbName = localStorage.getItem('mhrDbName');
  const mhrSchemaName = localStorage.getItem('mhrSchemaName');
  const { sendRequest } = useAxios();
  const location = useLocation();
  //const niranks = localStorage.getItem('niranks');
  const [villageFormMaster, setVillageFormMaster] = useState([]);
  const [nirankss, setNirankss] = useState([]);
  const [form] = Form.useForm();

  // var revenueYear1 = JSON.parse(localStorage.getItem('revenueYear1'));

  useEffect(() => {
    setVillage(
      villageData1?.map((row) => ({
        label: row.villageName,
        value: row.cCode,
      })),
    );

    // console.log('gggg', villageData[0]?.niranks);
    // sendRequest(`${URLS.BaseURL}/restservice/getAllVillageForm`, 'GET', null, (res) => {
    setNirankss(
      niranks.map((a) => {
        return {
          ...a,
          // isNirank:
          //   res?.data?.villageFormMaster?.find((vfm) => vfm?.formId == a?.formId)?.isNirank ===
          //   'Y'
          //     ? true
          //     : false,
          // isCompleted:
          //   res?.data?.villageFormMaster?.find((vfm) => vfm?.formId == a?.formId)
          //     ?.isCompleted === 'Y'
          //     ? true
          //     : false,
          formName: villageData[0]?.niranks?.find((vfm) => vfm?.formId == a?.formId)?.formName,
          // formName: res?.data?.villageFormMaster?.find((vfm) => vfm?.formId == a?.formId)?.formName,
        };
      }),
    );
    // });
  }, []);

  useEffect(() => {
    if (nirankss?.length >= 0) {
      handleOnChange(
        villageData1?.map((row) => ({
          label: row.villageName,
          value: row.cCode,
        }))[0].value,
        villageData1?.map((row) => ({
          label: row.villageName,
          value: row.cCode,
        }))[0].label,
      );
    }

    //  console.log('niranks....', niranks);
    // getDataVillage();
    // setVillage(
    //   villageData1?.map((row) => ({
    //     label: row.villageName,
    //     value: row.cCode,
    //   })),
    // )

    // sendRequest(`${URLS.BaseURL}/restservice/getAllVillageForm`, 'GET', null, (res) => {
    //   setNirankss(
    //     niranks.map((a) => {
    //       return {
    //         ...a,
    //         // isNirank:
    //         //   res?.data?.villageFormMaster?.find((vfm) => vfm?.formId == a?.formId)?.isNirank ===
    //         //   'Y'
    //         //     ? true
    //         //     : false,
    //         // isCompleted:
    //         //   res?.data?.villageFormMaster?.find((vfm) => vfm?.formId == a?.formId)
    //         //     ?.isCompleted === 'Y'
    //         //     ? true
    //         //     : false,
    //         formName: res?.data?.villageFormMaster?.find((vfm) => vfm?.formId == a?.formId)
    //           ?.formName,
    //       };
    //     }),
    //   );

    // setVillageFormMaster(
    //   res.data.villageFormMaster.map((vfm) => {
    //     return {
    //       ...vfm,
    //       isNirank: false,
    //       isCompleted: false,
    //     };
    //   }),
    // );
    // message.success('Records Fetched !');
    // }),
    // );
  }, [nirankss]);

  // useEffect(() => {
  //   console.log('village list', villageData);
  // }, [village]);

  useEffect(() => {
    if (props.pageType == 'withYear') {
      //getYearForVillage();
      onYearChange(
        revenueYear1?.map((row) => ({
          label: row.revenueYear,
          value: row.revenueYear,
        }))[0].value,
        revenueYear1?.map((row) => ({
          label: row.revenueYear,
          value: row.revenueYear,
        }))[0].label,
      );
      setRevenueYearForVillage(
        revenueYear1?.map((row) => ({
          label: row.revenueYear,
          value: row.revenueYear,
        })),
      );
    }
  }, []);

  const handleOnChange = (value, label) => {
    // console.log(value, label);
    setNirank(value);
    // console.log('nirank value', niranks);
    props.setCodeVillage(value);
    props.setTextForVillage(label);
    props.onVillageChange(false);
    // console.log('Name of Village ==>>', event.label, 'cCode==>>', value);
  };

  // let forms = niranks.filter(
  //   (thing, index, self) =>
  //     index ===
  //     self.findIndex(
  //       (t) =>
  //         t.cCode === thing.value && t.formId === thing.formId && t.isNirank === thing.isNirank,
  //     ),
  // );

  const setNirank = (value) => {
    // console.log('value if present', value);

    // let forms = niranks?.filter((r) => r.cCode === value).map((r) => r.formId);

    let identity = [];
    let exponential = [];
    // let forms = niranks?.filter((r) => r.cCode === value).map((r) => {
    //   identity :r.formName, ',';
    // });
    //
    // console.log('nirankss', nirankss);

    for (let i = 0; i < nirankss.length; i++) {
      if (nirankss[i].cCode === value && nirankss[i].isNirank === 'Y') {
        identity.push(nirankss[i].formName);
      }
      if (nirankss[i].cCode === value && nirankss[i].isCompleted === 'Y') {
        exponential.push(nirankss[i].formName);
      }
    }
    // console.log('nirankss', nirankss);
    // console.log('isNirank', identity.toString());
    // console.log('isCompleted', exponential.toString());

    let formNameArr = location.pathname.split('/');
    // console.log('formNameArr', formNameArr);
    let formName = formNameArr[2];
    let flag = false,
      flag1 = false;
    // console.log(location.pathname);
    // console.log('formsnirank....', identity);
    // console.log('formscompleted....', exponential);
    // console.log('formName please', formName);

    // let formArray = forms[0]?.split(',');
    let formArray = identity;
    // console.log('let formArray = identity', (formArray = identity));

    if (formArray?.length > 0) {
      // console.log('formArray is there u?', formArray);
      for (var i = 0; i < formArray.length; i++) {
        if (formName == formArray[i]) {
          // console.log('Catched', formArray[i]);
          flag = true;
        }
      }
    }

    let completedFormArray = exponential;
    if (completedFormArray?.length > 0) {
      // console.log('completedFormArray is there u?', completedFormArray);
      for (var i = 0; i < completedFormArray.length; i++) {
        if (formName == completedFormArray[i]) {
          // console.log('Catched', formArray[i]);
          flag1 = true;
        }
      }
    }
    // else {
    if (flag === true) {
      // console.log('Nirank');
      props.setIsNirank(true);
    } else {
      // console.log('No Nirank');
      props.setIsNirank(false);
    }

    if (flag1 === true) {
      // console.log('Completed');
      // props.setIsCompleted(true);
    } else {
      // console.log('Not Completed');
      // props.setIsCompleted(false);
    }
    // };
  };
  const onYearChange = (value, event) => {
    props.yearChange(value);
    //setRevenueYear(event);
    // console.log('Selected Year', e);
    //props.button1State(false);
  };

  // const getYearForVillage = async () => {
  //   await Axios.get(`${URLS.BaseURL}/revenueYear/getRevenueYearData`, {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //       echHost: echHost,
  //       mhrHost: mhrHost,
  //       echDbName: echDbName,
  //       echSchemaName: echSchemaName,
  //       mhrDbName: mhrDbName,
  //       mhrSchemaName: mhrSchemaName,
  //     },
  //   })
  //     .then((res) => {
  //       setRevenueYearForVillage(
  //         res.data.revenueYearData.map((row) => ({
  //           label: row.revenueYear,
  //           value: row.revenueYear,
  //         })),
  //       );
  //     })
  //     .catch((err) => {
  //       console.log('Error in Village Selector for Revenue Year', err);
  //     });
  // };

  // const getDataVillage = async () => {
  //   console.log('Village API Called', URLS.BaseURL);
  //   await Axios.get(`${URLS.BaseURL}/restservice/getVillageListByUser?username=${servarthId}`, {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //       echHost: echHost,
  //       mhrHost: mhrHost,
  //       echDbName: echDbName,
  //       echSchemaName: echSchemaName,
  //       mhrDbName: mhrDbName,
  //       mhrSchemaName: mhrSchemaName,
  //     },
  //   })
  //     .then((res) => {
  //       setVillage(
  //         res.data.map((row) => ({
  //           label: row.villageName,
  //           value: row.cCode,
  //         })),
  //       );
  //       console.log('districtName->', res.data[0].districtName);
  //       res.data[0].districtName;
  //       res.data[0].districtName;
  //     })
  //     .catch((err) => {
  //       console.log('Error in Village Selector', err);
  //     });
  // };

  return (
    <>
      {props.pageType == 'withYear' && (
        <>
          <Form layout="horizontal" form={form}>
            <Row style={{ marginTop: 10 }}>
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
                <Form.Item
                  wrapperCol={{ xl: 20, lg: 15 }}
                  label={<FormattedMessage id="villageSelector.label.village" />}
                >
                  <Select
                    // options={village}
                    value={village}
                    placeholder=" गाव निवडा"
                    // onChange={(value, event) => handleOnChange(value, event)}
                    disabled
                  ></Select>
                </Form.Item>
              </Col>
              {/* <Col xl={1}></Col> */}

              <Col xl={6} lg={6} md={24} sm={24} xs={24}>
                <Form.Item
                  labelCol={{ lg: 12 }}
                  wrapperCol={{ lg: 12 }}
                  label={<FormattedMessage id="villageSelector.label.revenueYear" />}
                >
                  <Select
                    // style={{ width: 200, marginRight: '15px' }}
                    // options={revenueYearForVillage}
                    value={revenueYearForVillage}
                    placeholder={'महसूल वर्ष'}
                    onChange={(value, event) => onYearChange(value, event)}
                   // disabled
                  >
                    {/* <Select.Option value="2020-21">2020-21</Select.Option> */}
                    {/* <Select.Option value="2022-23">2022-23</Select.Option> */}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </>
      )}

      {props.pageType == 'withoutYear' && (
        <>
          <Form layout="horizontal">
            <Row style={{ marginTop: 10 }}>
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
                <Form.Item
                  wrapperCol={{ xl: 20, lg: 15 }}
                  label={<FormattedMessage id="villageSelector.label.village" />}
                >
                  <Select
                    // options={village}
                    value={village}
                    placeholder=" गाव निवडा"
                    // onSelect={(value, event) => handleOnChange(value, event)}
                    disabled
                  ></Select>
                </Form.Item>
              </Col>
              {/* <Col xl={1}></Col> */}
            </Row>
          </Form>
        </>
      )}
    </>
  );
};

export default VillageSelector;
