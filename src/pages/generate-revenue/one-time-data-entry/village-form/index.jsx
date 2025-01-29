import { Card, message, Button, Form, Input, Select, Row, Col, Divider } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { useModel } from 'umi';
import { useHistory, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import VillageSelector from '@/components/eComponents/VillageSelector';
import URLS from '@/URLs/urls';
import useAxios from '@/components/eComponents/use-axios';
import { FormattedMessage } from 'umi';
import KeyPressEvents from '@/util/KeyPressEvents';
import Center from '@/pages/account/center';

const oneTimeDataEntry = () => {
  const { districtName, talukaName, servarthId, districtCode, talukaCode } = useModel('details');
  const { sendRequest } = useAxios();
  const [codeVillage, setCodeVillage] = useState('');
  const [isNirank, setIsNirank] = useState(false);
  const [khataNoText, setkhataNoText] = useState();
  const [khataOwnerName, setKhataOwnerName] = useState();
  const [khata, setKhata] = useState();
  const [cCode, setcCode] = useState();
  const location = useLocation();
  let history = useHistory();
  const [myForm] = Form.useForm();
  const [textForVillage, setTextForVillage] = useState();
  const [village, setVillage] = useState([]);
  const [revenueYear, setRevenueYear] = useState();
  const [flagSearchDisabled, setFlagSearchDisabled] = useState(false);
  const [stateForKSearch, setStateForKSearch] = useState(false);
  const [khataNumbersList, setKhataNumbersList] = useState([]);
  const [loadings, setLoadings] = useState(false);

  const initialValues = {
    // revenueYear: '',
    districtCode: '',
    talukaCode: '',
    cCode: '',
    khataNo: '',
    preYearPendingJm: '',
    preYearPendingZp: '',
    preYearPendingGp: '',
    preYearPendingAddlLandRevenue: '',
    preYearPendingEducationalCess: '',
    preYearPendingAddlEducationalCess: '',
    preYearPendingEmployeeGuaranteeScheme: '',
    preYearPendingNaCess: '',
    preYearSankirnJmWith: '',
    preYearSankirnJmWithout: '',
    preYearNoticeFee: '',
    netPending: '',
  };
  const [values, setValues] = useState(initialValues);

  const handleForValid = (e) => {
    e.preventDefault();
    return false;
  };

  const viewOneTimeEntrylst = () => {
    history.push('/generate-revenue/one-time-data-entry/table-form');
  };

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setValues({
  //     ...values,
  //     [name]: value,
  //   });
  // };
  /*  const disableButtonTimer = () => {
    setFlagCalculateDemand(true);
    setTimeout(() => setFlagCalculateDemand(false), 15000);
  }; */

  function handleChangeForKhataNo(event) {
    setKhataOwnerName();
    setStateForKSearch(false);
    setFlagSearchDisabled(false);
    setkhataNoText(event.target.value);
    // console.log('khataNo', event);
  }

  function handleChange(value) {
    // console.log(`selected ${value}`);
  }

  const resetForm = () => {
    myForm.resetFields();
    setKhataOwnerName('');
  };

  useEffect(() => {
    khataNumbers();
  }, [codeVillage, revenueYear]);

  useEffect(async () => {
    // console.log('khata owner name', khataOwnerName);
    // console.log('id in record is====>', location.state?.id);
    // // await getData();
    // console.log('API For Village Called');
    if (location.state?.pageMode === 'Edit' || location.state?.pageMode === 'View') {
      await getDataById();
      // console.log('API getOneTimeEntryDataById Called');
    }
  }, []);

  useEffect(() => {
    if (
      khataNoText &&
      codeVillage &&
      (location.state?.pageMode === 'Edit' || location.state?.pageMode === 'View')
    ) {
      getKhatOwnerName();
    }
  }, [khataNoText, codeVillage]);

  const getKhatOwnerName = async () => {
    if (khataNoText && codeVillage) {
      sendRequest(
        `${URLS.BaseURL}/restservice/getKhataOwnerName?districtCode=${districtCode}&talukaCode=${talukaCode}&khataNo=${khataNoText}&cCode=${codeVillage}&revenueYear=${revenueYear}`,
        'GET',
        null,
        (res) => {
          setFlagSearchDisabled(true);
          setKhataOwnerName(res.data.khataOwnerName);
          // console.log('new check test ----->', res.data.khataOwnerName);
        },
        (err) => {},
      );
    }
  };

  const khataNumbers = async () => {
    // console.log('Callled...');
    if (codeVillage && revenueYear) {
      sendRequest(
        `${URLS.BaseURL}/oneTimeEntry/khataNumbers?cCode=${codeVillage}&revenueYear=${revenueYear}`,
        'GET',
        null,
        (res) => {
          setKhataNumbersList(res.data);
          // console.log('khataNumbers', res.data);
          setStateForKSearch(true);
        },
        (err) => {},
      );
    }
  };

  const getDataById = async () => {
    sendRequest(
      `${URLS.BaseURL}/oneTimeEntry/getOneTimeEntryDataById?id=${location.state?.id}`,
      'GET',
      null,
      (res) => {
        // console.log('one time id api hint on load status and response', res.data, res.status);
        setcCode(res.data.cCode);
        // console.log('new check test ----->', res.data.cCode);
        setKhata(res.data.khataNo);
        // console.log('new check test ----->', res.data.khataNo);
        setkhataNoText(res.data.khataNo);
        setCodeVillage(res.data.cCode);
        setValues({
          districtCode: res.data.districtCode,
          talukaCode: res.data.talukaCode,
          cCode: res.data.cCode,
          // khataNo: res.data.khataNo,
        });
        myForm.setFieldsValue({
          khataNo: res.data.khataNo,
          preYearPendingJm: res.data.preYearPendingJm,
          preYearPendingZp: res.data.preYearPendingZp,
          preYearPendingGp: res.data.preYearPendingGp,
          preYearPendingAddlLandRevenue: res.data.preYearPendingAddlLandRevenue,
          preYearPendingEducationalCess: res.data.preYearPendingEducationalCess,
          preYearPendingAddlEducationalCess: res.data.preYearPendingAddlEducationalCess,
          preYearPendingEmployeeGuaranteeScheme: res.data.preYearPendingEmployeeGuaranteeScheme,
          miscellaneousAmount: res.data.miscellaneousAmount,
          preYearPendingNaCess: res.data.preYearPendingNaCess,
          preYearSankirnJmWith: res.data.preYearSankirnJmWith,
          preYearSankirnJmWithout: res.data.preYearSankirnJmWithout,
          preYearNoticeFee: res.data.preYearNoticeFee,
        });
      },
    );
  };

  const onFinish = async (values) => {
    setLoadings(true);
    // console.log('pagemode+++ onFinish called', location.state?.pageMode);

    const inputParams = {
      revenueYear: revenueYear,
      districtCode: districtCode,
      talukaCode: talukaCode,
      cCode: codeVillage,
      khataNo: khataNoText,
      preYearPendingJm: myForm.getFieldValue('preYearPendingJm'),
      preYearPendingZp: myForm.getFieldValue('preYearPendingZp'),
      preYearPendingGp: myForm.getFieldValue('preYearPendingGp'),
      preYearPendingAddlLandRevenue: myForm.getFieldValue('preYearPendingAddlLandRevenue'),
      preYearPendingEducationalCess: myForm.getFieldValue('preYearPendingEducationalCess'),
      preYearPendingAddlEducationalCess: myForm.getFieldValue('preYearPendingAddlEducationalCess'),
      preYearPendingEmployeeGuaranteeScheme: myForm.getFieldValue(
        'preYearPendingEmployeeGuaranteeScheme',
      ),
      miscellaneousAmount: myForm.getFieldValue('miscellaneousAmount'),
      preYearPendingNaCess: myForm.getFieldValue('preYearPendingNaCess'),
      preYearSankirnJmWith: myForm.getFieldValue('preYearSankirnJmWith'),
      preYearSankirnJmWithout: myForm.getFieldValue('preYearSankirnJmWithout'),
      preYearNoticeFee: myForm.getFieldValue('preYearNoticeFee'),
    };

    const inputParamsForEdit = {
      revenueYear: location.state?.revenueYear,
      districtCode: location.state?.districtCode,
      talukaCode: location.state?.talukaCode,
      cCode: codeVillage,
      id: location.state?.id,
      khataNo: khataNoText,
      preYearPendingJm: myForm.getFieldValue('preYearPendingJm'),
      preYearPendingZp: myForm.getFieldValue('preYearPendingZp'),
      preYearPendingGp: myForm.getFieldValue('preYearPendingGp'),
      preYearPendingAddlLandRevenue: myForm.getFieldValue('preYearPendingAddlLandRevenue'),
      preYearPendingEducationalCess: myForm.getFieldValue('preYearPendingEducationalCess'),
      preYearPendingAddlEducationalCess: myForm.getFieldValue('preYearPendingAddlEducationalCess'),
      preYearPendingEmployeeGuaranteeScheme: myForm.getFieldValue(
        'preYearPendingEmployeeGuaranteeScheme',
      ),
      miscellaneousAmount: myForm.getFieldValue('miscellaneousAmount'),
      preYearPendingNaCess: myForm.getFieldValue('preYearPendingNaCess'),
      preYearSankirnJmWith: myForm.getFieldValue('preYearSankirnJmWith'),
      preYearSankirnJmWithout: myForm.getFieldValue('preYearSankirnJmWithout'),
      preYearNoticeFee: myForm.getFieldValue('preYearNoticeFee'),
    };

    if (location.state?.pageMode === 'Add' || location.state?.pageMode === undefined) {
      // console.log('save api called!!!');
      sendRequest(
        `${URLS.BaseURL}/oneTimeEntry/saveOneTimeEntry`,
        'POST',
        inputParams,
        (res) => {
          // console.log('--form 17 post call-' + res.data);
          if (res.status === 201) {
            message.success('Data Saved !');
            history.push({
              pathname: '/generate-revenue/one-time-data-entry/table-form',
            });
            setLoadings(false);
          }
          // else if (res.status === 204) {
          //   message.error('Already Exist');
          //   console.log('Error YE na baba-->');
          // }
        },
        (err) => {
          message.error('दिलेल्या खाता क्रमांकाची मागणी आधीच निश्चित केलेली आहे!!!');
          setLoadings(false);
        },
      );
    } else if (location.state?.pageMode === 'Edit') {
      // console.log('edit api called!!!');
      sendRequest(
        `${URLS.BaseURL}/oneTimeEntry/editOneTimeEntry`,
        'PUT',
        inputParamsForEdit,
        (res) => {
          // console.log('--form 17 Put Call-' + res.data);
          if (res.status === 200) {
            message.success('Data Updated !');
            history.push({
              pathname: '/generate-revenue/one-time-data-entry/table-form',
            });
            setLoadings(false);
          }
        },
        setLoadings(false),
      );
    }
  };

  function cancel(e) {
    // console.log(e);
    message.error('Request Cancelled !!!');
  }

  const onFinishFailed = ({ values, errorFields, outOfDate }) => {
    // console.log('Finish Failed called', values, errorFields, outOfDate);
  };

  return (
    <>
      <Form
        autoComplete="off"
        autoSave="off"
        form={myForm}
        /*  onFinish={onFinish} */ onFinishFailed={onFinishFailed}
      >
        <Card bordered={false} style={{ margin: 5 }}>
          <h1 style={{ textAlign: 'center', fontSize: '25px' }}>
            <FormattedMessage id="oneTimeEntry.form.ote" />
          </h1>
          {(location.state?.pageMode === 'Add' || location.state?.pageMode === undefined) && (
            // <Row style={{ marginLeft: '5px' }}>
            <VillageSelector
              pageType="withYear"
              setCodeVillage={setCodeVillage}
              setTextForVillage={setTextForVillage}
              onVillageChange={setVillage}
              yearChange={setRevenueYear}
              setIsNirank={setIsNirank}
            />
            // </Row>
          )}
          {(location.state?.pageMode === 'View' || location.state?.pageMode === 'Edit') && (
            <Row style={{ marginBottom: 10 }}>
              <Col span={24}>
                <label htmlFor="" style={{ paddingRight: '5px' }}>
                  <FormattedMessage id="oneTimeEntry.form.district" />
                  <Input
                    disabled
                    value={districtName}
                    style={{ width: 150, marginRight: '15px' }}
                  />
                </label>
                {/* <Select
                disabled
                placeholder="अमरावती"
                style={{ width: 150, marginRight: '15px' }}
              ></Select.Option> */}
                <label htmlFor="" style={{ paddingRight: '5px' }}>
                  <FormattedMessage id="oneTimeEntry.form.taluka" />
                </label>
                <Select
                  disabled
                  value={talukaName}
                  //placeholder="मुदखेड"
                  style={{ width: 150, marginRight: '15px' }}
                ></Select>
                {/* <Select
                disabled
                placeholder="अचलपूर"
                style={{ width: 150, marginRight: '15px' }}
              ></Select.Option> */}

                <label htmlFor="" style={{ paddingRight: '5px' }}>
                  <FormattedMessage id="oneTimeEntry.form.village" />
                  <Input
                    disabled
                    value={location.state?.villageName}
                    style={{ width: 150, marginRight: '15px' }}
                  />
                </label>
              </Col>
            </Row>
          )}

          <Row style={{ marginTop: '40px' }}>
            <Col span={6}>
              <Form.Item
                name="khataNo"
                rules={[{ required: true, message: 'This Field Is Required..' }]}
              >
                <Input
                  disabled={
                    location.state?.pageMode === 'Edit' || location.state?.pageMode === 'View'
                  }
                  maxLength={7}
                  onKeyPress={KeyPressEvents.isInputNumber}
                  onPaste={handleForValid}
                  onDrop={handleForValid}
                  defaultValue={values.khataNo}
                  onChange={handleChangeForKhataNo}
                  value={khata}
                  addonBefore={<FormattedMessage id="oneTimeEntry.form.khataNo" />}
                />
              </Form.Item>
            </Col>
            <Col span={3} style={{ marginLeft: '40px' }}>
              {(location.state?.pageMode === 'Add' || location.state?.pageMode === undefined) && (
                <Button
                  disabled={flagSearchDisabled}
                  /* onClick={getKhatOwnerName} */ onClick={() => {
                    if (textForVillage && revenueYear && khataNoText) {
                      setKhataOwnerName('');
                      let flag = false;
                      // console.log('List-->', khataNumbersList);
                      for (var index = 0; index < khataNumbersList.length; index++) {
                        // console.log(khataNumbersList[index]);
                        if (khataNoText === khataNumbersList[index]) {
                          flag = true;
                        }
                      }
                      if (flag) {
                        message.info('Record Already Exists..');
                      } else if (!flag) {
                        // console.log('unique..');
                        getKhatOwnerName();
                      }
                    } else if (textForVillage == null) {
                      message.info('Please Select Village');
                      /*  disableButtonTimer(); */
                    } else if (revenueYear == null) {
                      message.info('Please Select Revenue Year');
                      /*  disableButtonTimer(); */
                    } else if (khataNoText == null) {
                      message.info('Please Select Khata Number');
                    } /* else if (khataOwnerName == undefined) {
                      message.info('Please Declare Khata Owner Name');
                    } */
                  }}
                  type="primary"
                >
                  <FormattedMessage id="oneTimeEntry.table.search" />
                </Button>
              )}
            </Col>
            <Col span={10}>
              <Form.Item rules={[{ required: true, message: 'This field is Required' }]}>
                <Input
                  addonBefore={<FormattedMessage id="oneTimeEntry.form.khataOwner" />}
                  value={khataOwnerName}
                  disabled="true"
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card style={{ marginTop: 15 }}>
          <Divider orientation="left" style={{ marginBottom: 30 }}>
            <b>
              <FormattedMessage id="oneTimeEntry.form.echawdi" />
            </b>
          </Divider>
          <Row style={{ marginTop: 25 }}>
            <Col span={10}>
              <Form.Item
                name={'preYearPendingJm'}
                rules={[
                  { required: true, message: 'This Field Is Required..' },
                  {
                    type: '',
                    max: 18,
                    message: <FormattedMessage id="oneTimeEntry.form.Required" />,
                  },
                ]}
              >
                <Input
                  onKeyPress={KeyPressEvents.isInputDecimal}
                  onPaste={handleForValid}
                  onDrop={handleForValid}
                  maxLength={19}
                  addonBefore={<FormattedMessage id="oneTimeEntry.form.lr" />}
                  disabled={location.state?.pageMode === 'View'}
                />
              </Form.Item>
            </Col>
            <Col span={2}> </Col>
            <Col span={10}>
              <Form.Item
                name={'preYearPendingZp'}
                rules={[
                  { required: true, message: 'This Field Is Required..' },

                  { max: 18, message: <FormattedMessage id="oneTimeEntry.form.Required" /> },
                ]}
              >
                <Input
                  onKeyPress={KeyPressEvents.isInputDecimal}
                  onPaste={handleForValid}
                  onDrop={handleForValid}
                  maxLength={19}
                  addonBefore={<FormattedMessage id="oneTimeEntry.form.zp" />}
                  disabled={location.state?.pageMode === 'View'}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row style={{ marginTop: 25 }}>
            <Col span={10}>
              <Form.Item
                name={'preYearPendingGp'}
                rules={[
                  { required: true, message: 'This Field Is Required..' },
                  { max: 18, message: <FormattedMessage id="oneTimeEntry.form.Required" /> },
                ]}
              >
                <Input
                  onKeyPress={KeyPressEvents.isInputDecimal}
                  onPaste={handleForValid}
                  onDrop={handleForValid}
                  maxLength={19}
                  addonBefore={<FormattedMessage id="oneTimeEntry.form.vp" />}
                  disabled={location.state?.pageMode === 'View'}
                />
              </Form.Item>
            </Col>
            <Col span={2}> </Col>
            <Col span={10}>
              <Form.Item
                name={'preYearPendingAddlLandRevenue'}
                rules={[
                  { required: true, message: 'This Field Is Required..' },
                  { max: 18, message: <FormattedMessage id="oneTimeEntry.form.Required" /> },
                ]}
              >
                <Input
                  onKeyPress={KeyPressEvents.isInputDecimal}
                  onPaste={handleForValid}
                  onDrop={handleForValid}
                  maxLength={19}
                  addonBefore={<FormattedMessage id="oneTimeEntry.form.addlLandRevenue" />}
                  disabled={location.state?.pageMode === 'View'}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row style={{ marginTop: 25 }}>
            <Col span={10}>
              <Form.Item
                name={'preYearPendingEducationalCess'}
                rules={[
                  { required: true, message: 'This Field Is Required..' },
                  { max: 18, message: <FormattedMessage id="oneTimeEntry.form.Required" /> },
                ]}
              >
                <Input
                  onKeyPress={KeyPressEvents.isInputDecimal}
                  onPaste={handleForValid}
                  onDrop={handleForValid}
                  maxLength={19}
                  addonBefore={<FormattedMessage id="oneTimeEntry.form.educationalCess" />}
                  disabled={location.state?.pageMode === 'View'}
                />
              </Form.Item>
            </Col>
            <Col span={2}> </Col>
            <Col span={10}>
              <Form.Item
                name={'preYearPendingAddlEducationalCess'}
                rules={[
                  { required: true, message: 'This Field Is Required..' },
                  { max: 18, message: <FormattedMessage id="oneTimeEntry.form.Required" /> },
                ]}
              >
                <Input
                  onKeyPress={KeyPressEvents.isInputDecimal}
                  onPaste={handleForValid}
                  onDrop={handleForValid}
                  maxLength={19}
                  addonBefore={<FormattedMessage id="oneTimeEntry.form.addlEducationalCess" />}
                  disabled={location.state?.pageMode === 'View'}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row style={{ marginTop: 25 }}>
            <Col span={10}>
              <Form.Item
                name={'preYearPendingEmployeeGuaranteeScheme'}
                rules={[
                  { required: true, message: 'This Field Is Required..' },

                  { max: 18, message: <FormattedMessage id="oneTimeEntry.form.Required" /> },
                ]}
              >
                <Input
                  onKeyPress={KeyPressEvents.isInputDecimal}
                  onPaste={handleForValid}
                  onDrop={handleForValid}
                  maxLength={19}
                  addonBefore={<FormattedMessage id="oneTimeEntry.form.egs" />}
                  disabled={location.state?.pageMode === 'View'}
                />
              </Form.Item>
            </Col>
            <Col span={2}> </Col>
            <Col span={10}>
              <Form.Item
                name={'preYearPendingNaCess'}
                rules={[
                  { required: true, message: 'This Field Is Required..' },

                  { max: 18, message: <FormattedMessage id="oneTimeEntry.form.Required" /> },
                ]}
              >
                <Input
                  onKeyPress={KeyPressEvents.isInputDecimal}
                  onPaste={handleForValid}
                  onDrop={handleForValid}
                  maxLength={19}
                  addonBefore={<FormattedMessage id="oneTimeEntry.form.preYearPendingNaCess" />}
                  disabled={location.state?.pageMode === 'View'}
                />
              </Form.Item>
            </Col>
            {/* <Col span={10}>
              <Form.Item
                name={'miscellaneousAmount'}
                rules={[
                  { required: true, message: 'This Field Is Required..' },
                  { max: 18, message: <FormattedMessage id="oneTimeEntry.form.Required" /> },
                ]}
              >
                <Input
                  onKeyPress={KeyPressEvents.isInputDecimal}
                  onPaste={handleForValid}
                  onDrop={handleForValid}
                  maxLength={19}
                  addonBefore={<FormattedMessage id="oneTimeEntry.form.additionalCess" />}
                  disabled={location.state?.pageMode === 'View'}
                />
              </Form.Item>
            </Col> */}
          </Row>

          <Row style={{ marginTop: 25 }}>
            <Col span={10}>
              <Form.Item
                name={'preYearSankirnJmWith'}
                rules={[
                  { required: true, message: 'This Field Is Required..' },
                  { max: 18, message: <FormattedMessage id="oneTimeEntry.form.Required" /> },
                ]}
              >
                <Input
                  onKeyPress={KeyPressEvents.isInputDecimal}
                  onPaste={handleForValid}
                  onDrop={handleForValid}
                  maxLength={19}
                  addonBefore={<FormattedMessage id="oneTimeEntry.form.preYearSankirnJmWith" />}
                  disabled={location.state?.pageMode === 'View'}
                />
              </Form.Item>
            </Col>
            <Col span={2}></Col>
            <Col span={10}>
              <Form.Item
                name={'preYearSankirnJmWithout'}
                rules={[
                  { required: true, message: 'This Field Is Required..' },

                  { max: 18, message: <FormattedMessage id="oneTimeEntry.form.Required" /> },
                ]}
              >
                <Input
                  onKeyPress={KeyPressEvents.isInputDecimal}
                  onPaste={handleForValid}
                  onDrop={handleForValid}
                  maxLength={19}
                  addonBefore={<FormattedMessage id="oneTimeEntry.form.preYearSankirnJmWithout" />}
                  disabled={location.state?.pageMode === 'View'}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row style={{ marginTop: 25 }}>
            <Col span={10}>
              <Form.Item
                name={'preYearNoticeFee'}
                rules={[
                  { required: true, message: 'This Field Is Required..' },
                  { max: 18, message: <FormattedMessage id="oneTimeEntry.form.Required" /> },
                ]}
              >
                <Input
                  onKeyPress={KeyPressEvents.isInputDecimal}
                  onPaste={handleForValid}
                  onDrop={handleForValid}
                  maxLength={19}
                  addonBefore={<FormattedMessage id="oneTimeEntry.form.preYearNoticeFee" />}
                  disabled={location.state?.pageMode === 'View'}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row style={{ marginTop: 30 }}>
            <Col span={8}></Col>
            <Col span={8}>
              {(location.state?.pageMode === 'Add' || location.state?.pageMode === undefined) && (
                <Button
                  type="primary"
                  loading={loadings}
                  htmlType=""
                  style={{ marginLeft: 25 }}
                  onClick={() => {
                    if (textForVillage && revenueYear && khataNoText && khataOwnerName) {
                      onFinish();
                    } else if (textForVillage == null) {
                      message.info('Please Select Village');
                      /*    disableButtonTimer(); */
                    } else if (revenueYear == null) {
                      message.info('Please Select Revenue Year');
                      /*      disableButtonTimer(); */
                    } else if (khataNoText == null) {
                      message.info('Please Select Khata Number');
                    } else if (khataOwnerName === null || typeof khataOwnerName === 'undefined') {
                      message.info('Invalid Khata No..');
                    }
                  }}
                >
                  <FormattedMessage id="oneTimeEntry.table.save" />
                </Button>
              )}
              {/* start */}
              {location.state?.pageMode && location.state?.pageMode === 'Edit' && (
                <Button
                  type="primary"
                  htmlType=""
                  style={{ marginLeft: 25 }}
                  onClick={() => {
                    onFinish();
                  }}
                >
                  <FormattedMessage id="oneTimeEntry.table.save" />
                </Button>
              )}

              {/* End */}
              {(location.state?.pageMode === 'Add' || location.state?.pageMode === undefined) && (
                <Button
                  onClick={resetForm}
                  type="default"
                  style={{ color: 'white', backgroundColor: 'orange', marginLeft: 25 }}
                >
                  <FormattedMessage id="oneTimeEntry.table.reset" />
                </Button>
              )}
              <Button
                onClick={viewOneTimeEntrylst}
                type="danger"
                htmlType="submit"
                style={{ marginLeft: 25 }}
              >
                <FormattedMessage id="oneTimeEntry.table.cancel" />
              </Button>
            </Col>
            <Col span={8}></Col>
          </Row>
        </Card>
      </Form>
    </>
  );
};
export default oneTimeDataEntry;
