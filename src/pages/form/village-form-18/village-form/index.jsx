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
import { FormattedMessage } from 'umi';
import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import URLS from '@/URLs/urls';
import moment from 'moment';
import useAxios from '@/components/eComponents/use-axios';

function VillageForm8() {
  const { sendRequest } = useAxios();

  const [codeVillage, setCodeVillage] = useState('');
  const [textForVillage, setTextForVillage] = useState();
  const [village, setVillage] = useState([]);
  const [revenueYear, setRevenueYear] = useState();
  const [form] = Form.useForm();

  let history = useHistory();

  const success = () => {
    message.success('Data Saved !!!');
  };

  const resetForm = () => {
    form.resetFields();
  };

  const cancelForm = () => {
    history.push({
      pathname: `/form/village-form-18/table-form`,
    });
  };

  const onFormFinish = async (values) => {
    const article = {
      cCode: codeVillage,
      communicationReceivedFrom: form.getFieldValue('communicationReceivedFrom'),
      noOfCommunication: form.getFieldValue('noOfCommunication'),
      dateOfReceipt: moment(form.getFieldValue('dateOfReceipt'), 'DD/MM/YYYY').format('YYYY-MM-DD'),
      subjectActionTaken: form.getFieldValue('subjectActionTaken'),
      communicationDispatchedToWhom: form.getFieldValue('communicationDispatchedToWhom'),
      dateOfDispatch: moment(form.getFieldValue('dateOfDispatch'), 'DD/MM/YYYY').format(
        'YYYY-MM-DD',
      ),
      noInList: form.getFieldValue('noInList'),
      remarks: form.getFieldValue('remarks'),
    };
    sendRequest(`${URLS.BaseURL}/form18/saveForm18`, 'POST', article, (res) => {
      if (res.status === 201) {
        success();
        form.resetFields();
        history.push({
          pathname: `/form/village-form-18/table-form`,
        });
      }
    });
  };
  return (
    <>
      <PageContainer>
        <Card>
          <h2 style={{ textAlign: 'center' }}>INWARD OUTWARD REGISTER FOR CIRCLE OFFICER</h2>
          <VillageSelector
            setCodeVillage={setCodeVillage}
            setTextForVillage={setTextForVillage}
            onVillageChange={setVillage}
            yearChange={setRevenueYear}
          />
        </Card>
        <Form layout="vertical" onFinish={onFormFinish} form={form}>
          <Card>
            <Divider orientation="left">e-Chawdi</Divider>
            <Row>
              <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                <Form.Item
                  label="From Whom Communication Received"
                  name="communicationReceivedFrom"
                  rules={[{ required: true, message: 'Field is necessary!' }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xl={2} lg={2} md={2} sm={2} xs={2}></Col>
            </Row>
            <Row>
              <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                <Form.Item
                  label="No. of Communication"
                  name="noOfCommunication"
                  rules={[{ required: true, message: 'Field is necessary!' }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xl={2} lg={2} md={2} sm={2} xs={2}></Col>
              <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                <Form.Item
                  label="Date of Receipt"
                  name="dateOfReceipt"
                  rules={[
                    {
                      required: true,
                      message: 'Please Select Date of Receipt',
                    },
                  ]}
                >
                  <DatePicker></DatePicker>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                <Form.Item
                  label="Subject in Brief and Action to be Taken"
                  name="subjectActionTaken"
                  rules={[{ required: true, message: 'Field is necessary!' }]}
                >
                  <Input.TextArea />
                </Form.Item>
              </Col>
              <Col xl={2} lg={2} md={2} sm={2} xs={2}></Col>
              <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                <Form.Item
                  label="Communication to Whom Dispatched"
                  name="communicationDispatchedToWhom"
                  rules={[{ required: true, message: 'Field is necessary!' }]}
                >
                  <Input.TextArea />
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                <Form.Item
                  label="Date of Dispatch with Substance of Report Made"
                  name="dateOfDispatch"
                  rules={[{ required: true, message: 'Field is necessary!' }]}
                >
                  <DatePicker></DatePicker>
                </Form.Item>
              </Col>
              <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>
              <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                <Form.Item
                  label="No. in A,B,C,D List Under Which Recorded and Remarks"
                  name="noInList"
                  rules={[{ required: true, message: 'Remarks is necessary!' }]}
                >
                  <Input.TextArea maxLength={51} />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                <Form.Item
                  label="Remarks"
                  name="remarks"
                  rules={[{ required: true, message: 'Remarks is necessary!' }]}
                >
                  <Input.TextArea maxLength={51} />
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
                <Button type="primary" htmlType="submit">
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
      </PageContainer>
    </>
  );
}

export default VillageForm8;
