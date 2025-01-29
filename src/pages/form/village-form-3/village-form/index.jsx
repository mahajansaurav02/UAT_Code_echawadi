import ESelector from '@/components/eComponents/ESelector';
import { PageContainer } from '@ant-design/pro-layout';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  message,
  Popconfirm,
  Row,
  Select,
} from 'antd';
import React, { useState } from 'react';
import { FormattedMessage, useModel } from 'umi';
import URLS from '@/URLs/urls';
import { useHistory, useLocation } from 'react-router';
import useAxios from '@/components/eComponents/use-axios';
import { Option } from 'antd/lib/mentions';
import KeyPressEvents from '@/util/KeyPressEvents';

function VillageForm3() {
  const { sendRequest } = useAxios();
  const [showGetDataButton, setShowGetDataButton] = useState(false);
  const [surveyNumberValue, setSurveyNumberValue] = useState();
  const [hissaNumberValue, setHissaNumberValue] = useState([]);
  const [codeVillage, setCodeVillage] = useState('');
  const [flagButton2, setFlagButton2] = useState(true);
  const [showArea, setShowArea] = useState(false);
  const [area, setArea] = useState();
  const [assessment, setAssessment] = useState();
  const [form] = Form.useForm();
  const { districtName, servarthId, districtCode, talukaCode } = useModel('details');
  const [eferfarDataRetrieved, setEferfarDataRetrieved] = useState(false);
  const [validStateEFerfar, setValidStateEFerfar] = useState(false);

  let history = useHistory();

  const handleESelectorChange = (flagGetDataButton, sn, hn, cCodeV) => {
    // console.log(flagGetDataButton, sn, hn);
    setShowGetDataButton(flagGetDataButton);
    setSurveyNumberValue(sn);
    setHissaNumberValue(hn);
    setCodeVillage(cCodeV);
  };

  const resetForm = () => {
    form.resetFields();
  };
  const success = () => {
    message.success('Data Saved !!!');
  };

  const cancelForm = () => {
    history.push({
      pathname: `/form/village-form-3/table-form`,
    });
  };

  const onFormFinish = async (values) => {
    const article = {
      cCode: codeVillage,
      districtCode: districtCode,
      talukaCode: talukaCode,
      pin: surveyNumberValue,
      hissaNo: hissaNumberValue,

      tenure: form.getFieldValue('tenure'),
      kindAndHowLongContinuable: form.getFieldValue('kindAndHowLongContinuable'), //kindAndHowLongContinuable
      sanadNo: form.getFieldValue('sanadNo'),
      noInRegisterOfLands: form.getFieldValue('noInRegisterOfLands'),
      remarks: form.getFieldValue('remarks'),
      cultivatedArea: form.getFieldValue('cultivatedArea'),
      assessment: form.getFieldValue('assessment'),
      areaUnderNaUse: form.getFieldValue('areaUnderNaUse'),
      naAssessment: form.getFieldValue('naAssessment'),
      rate: form.getFieldValue('rate'),
      assessment1: form.getFieldValue('assessment1'),
    };
    // if (validStateEFerfar == false) {
    //     message.info('Please Fetch Eferfar Data !');
    // }

    // console.log('DATA FOR SAVE FORM3-------->', article);
    if (eferfarDataRetrieved) {
      sendRequest(`${URLS.BaseURL}/form3/saveForm3`, 'POST', article, (res) => {
        if (res.status === 201) {
          success();
          form.resetFields();
          history.push({
            pathname: `/form/village-form-3/table-form`,
          });
        }
      });
    } else {
      //  message.info('Please Get Eferfar Data First...!!!');
    }
  };

  const getFerfarData = async (values) => {
    sendRequest(
      `${URLS.BaseURL}/form3/getForm3EferfarDetials?districtCode=${districtCode}&talukaCode=${talukaCode}&cCode=${codeVillage}&pin=${surveyNumberValue}&hissaNo=${hissaNumberValue}`,
      'GET',
      null,
      (res) => {
        setEferfarDataRetrieved(true);
        form.setFieldsValue({
          netCultiAreaH: res.data[0].netCultiAreaH,
          assessment: res.data[0].assessment,
          naAreaH: res.data[0].naAreaH,
          naAssessment: res.data[0].naAssessment,
        });
        setValidStateEFerfar(true);
      },
    );
  };

  return (
    <>
      <Card>
        <h2 style={{ textAlign: 'center', marginBottom: '5px' }}>
          <FormattedMessage id="villageForm3.form.villageTitle" />
        </h2>
        <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>
          <FormattedMessage id="villageForm3.label.enamLand" />
        </h3>
        {/*  <VillageSelector
              setCodeVillage={setCodeVillage}
              setTextForVillage={setTextForVillage}
              onVillageChange={(setVillage, setFlagButton)}
              yearChange={setRevenueYear}
            /> */}
        <ESelector
          pageType={'withoutYear'}
          setFlagButton2={setFlagButton2}
          allData={handleESelectorChange}
          setShowArea={setShowArea}
          allDataV={handleESelectorChange}
        />
        <Row style={{ marginTop: '10' }}>
          <Col xl={2} lg={2} md={2} sm={2} xs={2}>
            <Button
              type="primary"
              onClick={
                /* getFerfarData */ () => {
                  getFerfarData();
                }
              }
            >
              <FormattedMessage id="formLanguage.button.getFerfar" />
            </Button>
          </Col>
          <Col xl={22} lg={22} md={22} sm={22} xs={22}></Col>
        </Row>
      </Card>
      <Form layout="vertical" onFinish={onFormFinish} form={form}>
        <Card>
          <Divider orientation="left">
            <FormattedMessage id="formLanguage.form.eFerfar" />
          </Divider>
          <Row>
            <Col xl={11} lg={11} md={11} sm={24} xs={24}>
              <Form.Item
                label={<FormattedMessage id="villageForm3.form.cultivableArea" />}
                name="netCultiAreaH"
              >
                <Input disabled addonAfter={<FormattedMessage id="villageForm3.form.hectare" />} />
              </Form.Item>
            </Col>
            <Col xl={2} lg={2} md={2} sm={2} xs={2}></Col>
            <Col xl={11} lg={11} md={11} sm={24} xs={24}>
              <Form.Item
                label={<FormattedMessage id="villageForm3.form.assessment" />}
                name="assessment"
              >
                <Input disabled addonAfter={<FormattedMessage id="formLanguage.form.rupees" />} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col xl={11} lg={11} md={11} sm={24} xs={24}>
              <Form.Item
                label={<FormattedMessage id="villageForm3.form.areaUnderUse" />}
                name="naAreaH"
              >
                <Input disabled addonAfter={<FormattedMessage id="villageForm3.form.hectare" />} />
              </Form.Item>
            </Col>
            <Col xl={2} lg={2} md={2} sm={2} xs={2}></Col>
            <Col xl={11} lg={11} md={11} sm={24} xs={24}>
              <Form.Item
                label={<FormattedMessage id="villageForm3.form.assessment" />}
                name="naAssessment"
              >
                <Input disabled addonAfter={<FormattedMessage id="formLanguage.form.rupees" />} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col xl={11} lg={11} md={11} sm={24} xs={24}>
              <Form.Item label={<FormattedMessage id="villageForm3.form.rate" />} name="rate">
                <Input disabled addonAfter={<FormattedMessage id="formLanguage.form.rupees" />} />
              </Form.Item>
            </Col>
            <Col xl={2} lg={2} md={2} sm={2} xs={2}></Col>
            <Col xl={11} lg={11} md={11} sm={24} xs={24}>
              <Form.Item
                label={<FormattedMessage id="villageForm3.form.assessment" />}
                name="assessment1"
              >
                <Input disabled addonAfter={<FormattedMessage id="formLanguage.form.rupees" />} />
              </Form.Item>
            </Col>
          </Row>
        </Card>
        <Card>
          <Divider orientation="left">
            <FormattedMessage id="formLanguage.form.echawdi" />
          </Divider>
          <Row>
            <Col xl={7} lg={7} md={7} sm={24} xs={24}>
              <Form.Item
                label={<FormattedMessage id="villageForm3.form.tenure" />}
                name="tenure"
                rules={[{ required: true, message: 'This field is Required..' }]}
              >
                <Select>
                  <Select.Option value="देवस्थानइनाम">
                    <FormattedMessage id="villageForm3.form.divasthan" />
                  </Select.Option>
                  <Select.Option value="सरंजामइनाम">
                    <FormattedMessage id="villageForm3.form.saranjamEnam" />
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>
            <Col xl={7} lg={7} md={7} sm={24} xs={24}>
              <Form.Item
                label={<FormattedMessage id="villageForm3.form.howLongContinuable" />}
                name="kindAndHowLongContinuable"
                rules={[
                  { required: 'true', message: 'This field is Required..' },
                  {
                    type: 'string',
                    max: 50,
                    message: 'Kind and how long continuable shoud be upto 50 characters',
                  },
                ]}
              >
                <Input onKeyPress={KeyPressEvents.isInputVarchar} maxLength={51} />
              </Form.Item>
            </Col>
            <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>
            <Col xl={7} lg={7} md={7} sm={24} xs={24}>
              <Form.Item
                label={<FormattedMessage id="villageForm3.form.sanadNo" />}
                name="sanadNo"
                rules={[
                  //{ required: 'true', message: 'This field is Required..' },
                  {
                    type: 'string',
                    max: 20,
                    message: 'Sanad Number shoud be upto 20 characters',
                  },
                ]}
              >
                <Input onKeyPress={KeyPressEvents.isInputVarchar} maxLength={21} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col xl={11} lg={11} md={11} sm={24} xs={24}>
              <Form.Item
                label={<FormattedMessage id="villageForm3.form.registerOfLands" />}
                name="noInRegisterOfLands"
                rules={[
                  { required: 'true', message: 'This field is Required..' },
                  {
                    type: 'string',
                    max: 50,
                    message: 'Number in Register of Lands shoud be upto 50 characters',
                  },
                ]}
              >
                <Input.TextArea onKeyPress={KeyPressEvents.isInputVarchar} maxLength={51} />
              </Form.Item>
            </Col>
            <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>
            <Col xl={11} lg={11} md={11} sm={24} xs={24}>
              <Form.Item
                label={<FormattedMessage id="formLanguage.table.remark" />}
                name="remarks"
                rules={[
                  // { required: 'true', message: 'This field is Required..' },
                  {
                    type: 'string',
                    max: 200,
                    message: 'Remarks shoud be upto 50 characters',
                  },
                ]}
              >
                <Input.TextArea onKeyPress={KeyPressEvents.isInputChar} maxLength={201} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col xl={7} lg={7} md={7} sm={5}></Col>
            <Col xl={2} lg={2} md={2} sm={2} xs={1}>
              {/*  <Popconfirm
                  title={<FormattedMessage id="formLanguage.form.popFo₹ave" />}
                  onConfirm={onFinish}
                  onCancel={cancel}
                  okText={<FormattedMessage id="formLanguage.form.yes" />}
                  cancelText={<FormattedMessage id="formLanguage.form.no" />}
                > */}
              <Button
                type="primary"
                htmlType="submit"
                onClick={() => {
                  if (surveyNumberValue && hissaNumberValue && validStateEFerfar) {
                    onFormFinish();
                  } else if (surveyNumberValue == null) {
                    message.info('Please Select Village and Revenue Year and Survey Number');
                  } else if (hissaNumberValue == null) {
                    message.info('Please Search for Hissa Number');
                  } else if (validStateEFerfar == false) {
                    message.info('Please Fetch EFerfar Data !');
                  }
                }}
              >
                <FormattedMessage id="formLanguage.button.save" />
              </Button>
              {/*  </Popconfirm> */}
            </Col>
            <Col lg={2} md={2} sm={3} xs={8}></Col>
            <Col xl={2} lg={2} md={2} sm={2} xs={1}>
              <Button
                type=""
                onClick={resetForm}
                style={{ color: 'white', backgroundColor: 'orange' }}
              >
                <FormattedMessage id="formLanguage.button.reset" />
              </Button>
            </Col>
            <Col lg={2} md={2} sm={3} xs={8}></Col>
            <Col xl={2} lg={2} md={2} sm={2} xs={1}>
              <Button type="danger" onClick={cancelForm}>
                <FormattedMessage id="formLanguage.button.cancel" />
              </Button>
            </Col>
          </Row>
        </Card>
      </Form>
    </>
  );
}

export default VillageForm3;
