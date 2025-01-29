import VillageSelector from '@/components/eComponents/VillageSelector';
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
import { FormattedMessage, useModel } from 'umi';
import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import URLS from '@/URLs/urls';
import moment from 'moment';
import useAxios from '@/components/eComponents/use-axios';
import KeyPressEvents from '@/util/KeyPressEvents';

function VillageForm19() {
  const { sendRequest } = useAxios();
  const [codeVillage, setCodeVillage] = useState('');
  const [textForVillage, setTextForVillage] = useState();
  const [village, setVillage] = useState([]);
  const [villageSaja, setVillageSaja] = useState([]);
  const [villageSajjaCode, setVillageSajjaCode] = useState();
  const [villageSajjaName, setVillageSajjaName] = useState();
  const [revenueYear, setRevenueYear] = useState();
  const [form] = Form.useForm();
  const { servarthId, districtCode, talukaCode, districtName, talukaName, desig, villageData } =
    useModel('details');
  const [isLoading, setIsLoading] = useState(false);

  let history = useHistory();

  useEffect(() => {
    const result = villageData.filter(
      (thing, index, self) =>
        index ===
        self.findIndex((t) => t.sajjaName === thing.sajjaName && t.sajjaCode === thing.sajjaCode),
    );
    setVillageSaja(
      result?.map((row) => ({
        label: row.sajjaName,
        value: row.sajjaCode,
      })),
    );
  }, []);

  const handleOnChange = (value, event) => {
    setVillageSajjaCode(value);
    setVillageSajjaName(event.label);
    // console.log('Name of Village ==>>', event.label, 'cCode==>>', value);
  };

  const success = () => {
    message.success('Data Saved !!!');
  };

  const resetForm = () => {
    form.resetFields();
  };

  const cancelForm = () => {
    history.push({
      pathname: `/form/village-form-19/table-form`,
    });
  };

  const onFormFinish = async (values) => {
    setIsLoading(true);

    const article = {
      // cCode: codeVillage,
      // districtCode: districtCode,
      // talukaCode: talukaCode,
      descriptionOfArticle: form.getFieldValue('descriptionOfArticle'),
      authorityOfPurchase: form.getFieldValue('authorityOfPurchase'),
      numberOrQuantity: form.getFieldValue('numberOrQuantity'),
      dateOfPurchase: form.getFieldValue('dateOfPurchase')
        ? moment(form.getFieldValue('dateOfPurchase'), 'DD/MM/YYYY').format('YYYY-MM-DD')
        : null,
      authorityOfVoucher: form.getFieldValue('authorityOfVoucher'),
      amountWrittenOff: form.getFieldValue('amountWrittenOff'),
      amountRealized: form.getFieldValue('amountRealized'),
      dateOfCreditAtTreasury: form.getFieldValue('dateOfCreditAtTreasury')
        ? moment(form.getFieldValue('dateOfCreditAtTreasury'), 'DD/MM/YYYY').format('YYYY-MM-DD')
        : null,

      number: form.getFieldValue('number'),
      value: form.getFieldValue('value'),
      remarks: form.getFieldValue('remarks'),
      // designation: desig,
      userId: servarthId,
      sajjaCode: villageSajjaCode,
    };
    sendRequest(
      `${URLS.BaseURL}/form19/saveForm19`,
      'POST',
      article,
      (res) => {
        if (res.status === 201) {
          success();
          //message.success("Data Saved!")
          form.resetFields();
          history.push({
            pathname: `/form/village-form-19/table-form`,
          });
          setIsLoading(false);
        }
      },
      (err) => {
        setIsLoading(false);
      },
    );
  };
  return (
    <>
      <Card>
        <h2 style={{ marginBottom: '15px' }}>
          <center>
            <FormattedMessage id="villageForm19.title.villageName" />
          </center>
        </h2>
        <h2 style={{ textAlign: 'center' }}>
          <FormattedMessage id="villageForm19.label.talathiCircle" />
        </h2>
        {/*  <VillageSelector
          pageType="withoutYear"
          setCodeVillage={setCodeVillage}
          setTextForVillage={setTextForVillage}
          onVillageChange={setVillage}
          yearChange={setRevenueYear}
        /> */}
        <Form layout="horizontal">
          <Row style={{ marginTop: 15 }}>
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
              <Form.Item wrapperCol={{ xl: 20, lg: 15 }} label="सजा">
                <Select
                  options={villageSaja}
                  placeholder=" गाव निवडा"
                  onSelect={(value, event) => handleOnChange(value, event)}
                ></Select>
              </Form.Item>
            </Col>
            {/* <Col xs={1} sm={1} md={1} lg={2} xl={2}></Col>
            <Col xs={1} sm={1} md={1} lg={2} xl={2}>
              <Button type="primary" htmlType="submit" onClick={() => {}}>
                <FormattedMessage id="formLanguage.button.search" />
              </Button>
            </Col> */}
            {/* <Col xl={1}></Col> */}
          </Row>
        </Form>
      </Card>

      <Form layout="vertical" /* onFinish={onFormFinish} */ form={form}>
        <Card>
          <Divider orientation="left">
            <FormattedMessage id="formLanguage.form.echawdi" />
          </Divider>
          <Row>
            <Col xl={11} lg={11} md={11} sm={24} xs={24}>
              <Form.Item
                label={<FormattedMessage id="villageForm19.form.descriptionOfArticle" />}
                name="descriptionOfArticle"
                rules={[
                  { required: true, message: 'Field is necessary!' },
                  {
                    max: 50,
                    message: 'Description of Article shoud be upto 50 characters',
                  },
                ]}
              >
                <Input onKeyPress={KeyPressEvents.isInputVarchar} maxLength={51} />
              </Form.Item>
            </Col>

            <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>
            <Col xl={11} lg={11} md={11} sm={24} xs={24}>
              <Form.Item
                label={<FormattedMessage id="villageForm19.form.numberOrQuantity" />}
                name="numberOrQuantity"
                rules={[
                  { required: true, message: 'Field is necessary!' },
                  {
                    max: 18,
                    message: 'Number or Quantity shoud be upto 18 Numbers',
                  },
                ]}
              >
                <Input onKeyPress={KeyPressEvents.isInputNumber} maxLength={19} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col xl={11} lg={11} md={11} sm={24} xs={24}>
              <Form.Item
                label={<FormattedMessage id="villageForm19.form.authorityOfPurchase" />}
                name="authorityOfPurchase"
                rules={[
                  { required: true, message: 'Field is necessary!' },

                  {
                    max: 50,
                    message: 'Authority of Purchase shoud be upto 50 characters',
                  },
                ]}
              >
                <Input onKeyPress={KeyPressEvents.isInputVarchar} maxLength={51} />
              </Form.Item>
            </Col>

            <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>

            <Col xl={11} lg={11} md={11} sm={24} xs={24}>
              <Form.Item
                label={<FormattedMessage id="villageForm19.form.dateOfPurchase" />}
                name="dateOfPurchase"
              >
                <DatePicker></DatePicker>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col xl={11} lg={11} md={11} sm={24} xs={24}>
              <Form.Item
                label={<FormattedMessage id="villageForm19.form.authorityOfVoucher" />}
                name="authorityOfVoucher"
                rules={[
                  // { required: true, message: 'Field is necessary!' },
                  {
                    max: 50,
                    message: 'Authority of Voucher shoud be upto 50 characters',
                  },
                ]}
              >
                <Input onKeyPress={KeyPressEvents.isInputVarchar} maxLength={51} />
              </Form.Item>
            </Col>

            <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>
            <Col xl={11} lg={11} md={11} sm={24} xs={24}>
              <Form.Item
                label={<FormattedMessage id="villageForm19.form.amountWrittenOff" />}
                name="amountWrittenOff"
                rules={[
                  // { required: true, message: 'Field is necessary!' },
                  {
                    max: 18,
                    message: 'Amount Written Off shoud be upto 18 Number',
                  },
                ]}
              >
                <Input onKeyPress={KeyPressEvents.isInputNumber} maxLength={19} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col xl={11} lg={11} md={11} sm={24} xs={24}>
              <Form.Item
                label={<FormattedMessage id="villageForm19.form.amountRealized" />}
                name="amountRealized"
                rules={[
                  {
                    max: 18,
                    message: 'Amount Realized shoud be upto 18 Number',
                  },
                ]}
              >
                <Input onKeyPress={KeyPressEvents.isInputNumber} maxLength={19} />
              </Form.Item>
            </Col>
            <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>

            <Col xl={11} lg={11} md={11} sm={24} xs={24}>
              <Form.Item
                label={<FormattedMessage id="villageForm19.form.dateOfCreditAtTreasury" />}
                name="dateOfCreditAtTreasury"
              >
                <DatePicker></DatePicker>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col xl={11} lg={11} md={11} sm={24} xs={24}>
              <Form.Item
                label={<FormattedMessage id="villageForm19.form.number" />}
                name="number"
                rules={[
                  { required: true, message: 'Field is necessary!' },

                  {
                    max: 18,
                    message: 'Number shoud be upto 18 Numericals',
                  },
                ]}
              >
                <Input onKeyPress={KeyPressEvents.isInputNumber} maxLength={19} />
              </Form.Item>
            </Col>

            <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>
            <Col xl={11} lg={11} md={11} sm={24} xs={24}>
              <Form.Item
                label={<FormattedMessage id="villageForm19.form.value" />}
                name="value"
                rules={[
                  { required: true, message: 'Field is necessary!' },
                  {
                    max: 18,
                    message: 'Value shoud be upto 18 Numbers',
                  },
                ]}
              >
                <Input onKeyPress={KeyPressEvents.isInputNumber} maxLength={19} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col xl={24} lg={24} md={24} sm={24} xs={24}>
              <Form.Item
                label={<FormattedMessage id="formLanguage.table.remark" />}
                name="remarks"
                rules={[
                  // { required: true, message: 'Field is necessary!' },
                  {
                    max: 200,
                    message: 'Remarks shoud be upto 200 characters',
                  },
                ]}
              >
                <Input.TextArea onKeyPress={KeyPressEvents.isInputVarchar} maxLength={201} />
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
                loading={isLoading}
                onClick={
                  /* getForm19Data */ () => {
                    if (servarthId) {
                      onFormFinish();
                    }
                  }
                }
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

export default VillageForm19;
