import VillageSelector from '@/components/eComponents/VillageSelector';
import success from '@/pages/result/success';
import URLS from '@/URLs/urls';

import { Button, Card, Col, DatePicker, Form, Input, message, Row } from 'antd';

import { PageContainer } from '@ant-design/pro-layout';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { FormattedMessage, useModel } from 'umi';
import moment from 'moment';
import useAxios from '@/components/eComponents/use-axios';
import KeyPressEvents from '@/util/KeyPressEvents';

function villageForm8c() {
  const { sendRequest } = useAxios();

  const [codeVillage, setCodeVillage] = useState('');
  const [textForVillage, setTextForVillage] = useState();
  const [village, setVillage] = useState([]);
  const [revenueYear, setRevenueYear] = useState();
  const { districtName, servarthId, districtCode, talukaCode } = useModel('details');
  const [form] = Form.useForm();
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalArrears, setTotalArrears] = useState(0);
  const [finalAmountRecovered, setFinalAmountRecovered] = useState();
  const [amountToBeRecovered, setAmountToBeRecovered] = useState();
  const [totalAmountRecovered, setTotalAmountRecovered] = useState();
  const [finalAmountToBeRecovered, setFinalAmountToBeRecovered] = useState();

  useEffect(() => {
    if (totalAmount && totalArrears) {
      setFinalAmountRecovered(parseInt(totalAmount) + parseInt(totalArrears));
    } else if (
      (totalAmount && typeof totalArrears === undefined) ||
      totalArrears === null ||
      totalArrears <= 0
    ) {
      setFinalAmountRecovered(parseInt(totalAmount));
    } else if (
      (totalArrears && typeof totalAmount === undefined) ||
      totalAmount === null ||
      totalAmount <= 0
    ) {
      setFinalAmountRecovered(parseInt(totalArrears));
    } else {
      setFinalAmountRecovered(null);
    }

    form.setFieldsValue({
      amountRecovered: finalAmountRecovered,
    });
  }, [totalAmount, totalArrears, finalAmountRecovered]);

  useEffect(() => {
    if (finalAmountRecovered && totalAmountRecovered) {
      setFinalAmountToBeRecovered(parseInt(finalAmountRecovered) - parseInt(totalAmountRecovered));
    } else if (
      (finalAmountRecovered && typeof totalAmountRecovered === undefined) ||
      totalAmountRecovered === null ||
      totalAmountRecovered <= 0
    ) {
      setFinalAmountToBeRecovered(finalAmountRecovered);
    } else if (
      (totalAmountRecovered && typeof finalAmountRecovered === undefined) ||
      finalAmountRecovered === null ||
      finalAmountRecovered <= 0
    ) {
      setFinalAmountToBeRecovered(totalAmountRecovered);
    } else {
      setFinalAmountToBeRecovered(null);
    }
    form.setFieldsValue({
      balanceForRecovery: finalAmountToBeRecovered,
    });
  }, [finalAmountRecovered, finalAmountToBeRecovered, totalAmountRecovered]);

  let history = useHistory();

  const Cancel = () => {
    history.push({
      pathname: `/form/village-form-8c/table-form`,
    });
  };
  const resetForm = () => {
    form.resetFields();
  };

  function onChange(date, dateString) {
    console.log(date, dateString);
  }

  const onFormFinish = async () => {
    const article = {
      cCode: codeVillage,
      districtCode: districtCode,
      talukaCode: talukaCode,
      nameOfPersonFromWhomRecoverable: form.getFieldValue('nameOfPersonFromWhomRecoverable'),
      totalDemand: form.getFieldValue('totalDemand'),
      receiptNo: form.getFieldValue('receiptNo'),
      amountRecovered: form.getFieldValue('amountRecovered'),
      balanceForRecovery: form.getFieldValue('balanceForRecovery'),
      challanNoCreditInTreasury: form.getFieldValue('challanNoCreditInTreasury'),
      arrears: form.getFieldValue('arrears'),
      currentYear: moment(form.getFieldValue('currentYear'), 'DD/MM/YYYY').format('YYYY'),
      receiptDate: moment(form.getFieldValue('receiptDate'), 'DD/MM/YYYY').format('YYYY-MM-DD'),
      challanDate: moment(form.getFieldValue('receiptDate'), 'DD/MM/YYYY').format('YYYY-MM-DD'),
      remarks: form.getFieldValue('remarks'),
    };
    sendRequest(`${URLS.BaseURL}/form8c/saveForm8C`, 'POST', article, (res) => {
      if (res.status === 201) {
        success();
        form.resetFields();

        history.push({
          pathname: `/form/village-form-8c/table-form`,
        });
      }
    });
  };

  return (
    <div>
      <Form layout="vertical" form={form}>
        <Card>
          <h2>
            <center>
              <FormattedMessage id="villageForm8c.form.villageForm8c" />
            </center>
          </h2>
          <h2>
            <center>
              <FormattedMessage id="villageForm8c.form.villageForm8cname" />
            </center>
          </h2>

          <VillageSelector
            pageType="withoutYear"
            setCodeVillage={setCodeVillage}
            setTextForVillage={setTextForVillage}
            onVillageChange={setVillage}
            yearChange={setRevenueYear}
          />
        </Card>

        <Card>
          <Row>
            <Col xl={11} lg={11} md={11} sm={24} xs={24}>
              <Form.Item
                label={<FormattedMessage id="villageForm8c.form.nameOfPerson" />}
                name="nameOfPersonFromWhomRecoverable"
                rules={[
                  { required: true, message: 'Field is necessary!' },
                  {
                    max: 40,
                    message: 'Name of the Person  should be upto 40 characters',
                  },
                ]}
              >
                <Input onKeyPress={KeyPressEvents.isInputVarchar} maxLength={41} />
              </Form.Item>
            </Col>

            <Col xl={2} lg={2} md={2} sm={2} xs={2}></Col>

            <Col xl={11} lg={11} md={11} sm={24} xs={24}>
              <Form.Item
                label={<FormattedMessage id="villageForm8c.form.currentYear" />}
                name="currentYear"
                rules={[{ required: true, message: 'Field is necessary!' }]}
              >
                <DatePicker onChange={onChange} picker="year" />
              </Form.Item>
            </Col>
          </Row>

          <h2>{<FormattedMessage id="villageForm8c.form.amountForRecovery" />} :</h2>
          <Row>
            <Col xl={11} lg={11} md={11} sm={24} xs={24}>
              <Form.Item
                label={<FormattedMessage id="villageForm8c.form.totalDemand" />}
                name="totalDemand"
                rules={[
                  { required: true, message: 'Field is necessary!' },
                  {
                    max: 18,
                    message: 'Total demand should be upto 18 Numeric',
                  },
                ]}
              >
                <Input
                  onKeyPress={KeyPressEvents.isInputNumber}
                  maxLength={19}
                  onChange={(event) => {
                    setTotalAmount(event.target.value);
                  }}
                />
              </Form.Item>
            </Col>

            <Col xl={2} lg={2} md={2} sm={2} xs={2}></Col>
            <Col xl={11} lg={11} md={11} sm={24} xs={24}>
              <Form.Item
                label={<FormattedMessage id="villageForm8c.form.arrears" />}
                name="arrears"
                rules={[
                  { required: true, message: 'Field is necessary!' },
                  {
                    max: 18,
                    message: 'Arrears should be upto 18 Numeric',
                  },
                ]}
              >
                <Input
                  onKeyPress={KeyPressEvents.isInputNumber}
                  maxLength={19}
                  onChange={(event) => {
                    setTotalArrears(event.target.value);
                  }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col xl={11} lg={11} md={11} sm={24} xs={24}>
              <Form.Item
                label={<FormattedMessage id="villageForm8c.form.receiptNoAmtRecovered" />}
                name="receiptNo"
                rules={[
                  { required: true, message: 'Field is necessary!' },
                  {
                    max: 20,
                    message: 'enter no. of receipt amount recovered should be upto 20 number ',
                  },
                ]}
              >
                <Input onKeyPress={KeyPressEvents.isInputVarchar} maxLength={21} />
              </Form.Item>
            </Col>
            <Col xl={2} lg={2} md={2} sm={2} xs={2}></Col>

            <Col xl={11} lg={11} md={11} sm={24} xs={24}>
              <Form.Item
                label={<FormattedMessage id="villageForm8c.form.receiptDate" />}
                name="receiptDate"
                rules={[{ required: true, message: 'Field is necessary!' }]}
              >
                <DatePicker></DatePicker>
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col xl={11} lg={11} md={11} sm={24} xs={24}>
              <Form.Item
                label={<FormattedMessage id="villageForm8c.form.amountForRecovered" />}
                name="amountRecovered"
                rules={[
                  { required: true, message: 'Field is necessary!' },
                  {
                    max: 18,
                    message: 'Amount Recovered should be upto 18 Numeric',
                  },
                ]}
              >
                <Input
                  onKeyPress={KeyPressEvents.isInputNumber}
                  maxLength={19}
                  onChange={(event) => {
                    setTotalAmountRecovered(event.target.value);
                  }}
                  value={totalAmountRecovered}
                />
              </Form.Item>
            </Col>

            <Col xl={2} lg={2} md={2} sm={2} xs={2}></Col>
            <Col xl={11} lg={11} md={11} sm={24} xs={24}>
              <Form.Item
                label={<FormattedMessage id="villageForm8c.form.balanceRecovery" />}
                name="balanceForRecovery"
                rules={[
                  { required: true, message: 'Field is necessary!' },
                  {
                    max: 18,
                    message: 'Balance for recovery should be upto 18 Numeric',
                  },
                ]}
              >
                <Input disabled onKeyPress={KeyPressEvents.isInputNumber} maxLength={19} />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col xl={11} lg={11} md={11} sm={24} xs={24}>
              <Form.Item
                label={<FormattedMessage id="villageForm8c.form.challanNoCredit" />}
                name="challanNoCreditInTreasury"
                rules={[
                  { required: true, message: 'Field is necessary!' },
                  {
                    max: 18,
                    message: 'Challan No of should be upto 18 Numeric',
                  },
                ]}
              >
                <Input onKeyPress={KeyPressEvents.isInputNumber} maxLength={19} />
              </Form.Item>
            </Col>

            <Col xl={2} lg={2} md={2} sm={2} xs={2}></Col>

            <Col xl={11} lg={11} md={11} sm={24} xs={24}>
              <Form.Item
                label={<FormattedMessage id="villageForm8c.form.challanDate" />}
                name="challanDate"
                rules={[{ required: true, message: 'Field is necessary!' }]}
              >
                <DatePicker></DatePicker>
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col xl={24} lg={15} md={15} sm={24} xs={24}>
              <Form.Item
                label={<FormattedMessage id="villageForm8c.form.remarks" />}
                name="remarks"
                rules={[
                  //  { required: true, message: 'This field is Required..' },
                  {
                    max: 300,
                    message: 'Remarks should be upto 50 characters',
                  },
                ]}
              >
                <Input.TextArea onKeyPress={KeyPressEvents.isInputVarchar} maxLength={300} />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col sm={2} md={4} lg={4} xl={8}></Col>
            <Col xs={1} sm={1} md={1} lg={2} xl={2}>
              <Button
                htmlType="submit"
                type="primary"
                onClick={() => {
                  if (textForVillage) {
                    onFormFinish();
                  } else if (textForVillage == null) {
                    message.info('Please Select Village');
                  }
                }}
              >
                <FormattedMessage id="formLanguage.button.save" />
              </Button>
            </Col>
            <Col xl={1} lg={2} md={3} sm={4} xs={8}></Col>
            <Col xl={2} lg={2} md={1} sm={1} xs={1}>
              <Button
                type=""
                onClick={resetForm}
                style={{ color: 'white', backgroundColor: 'orange' }}
              >
                <FormattedMessage id="formLanguage.button.reset" />
              </Button>
            </Col>
            <Col xl={1} lg={2} md={3} sm={4} xs={8}></Col>
            <Col xl={2} lg={2} md={1} sm={1} xs={1}>
              <Button type="danger" onClick={Cancel}>
                <FormattedMessage id="formLanguage.button.cancel" />
              </Button>
            </Col>
          </Row>
        </Card>
      </Form>
    </div>
  );
}

export default villageForm8c;
