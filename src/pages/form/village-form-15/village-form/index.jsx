import ESelector from '@/components/eComponents/ESelector';
// import VillageSelector from '@/components/eComponents/VillageSelector';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card, Col, DatePicker, Form, Input, message, Row, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'umi';
import moment from 'moment';
import useAxios from '@/components/eComponents/use-axios';
import URLS from '@/URLs/urls';
import { useHistory, useLocation } from 'react-router';
import { useModel } from 'umi';
import KeyPressEvents from '@/util/KeyPressEvents';

function VillageForm15() {
  const [codeVillage, setCodeVillage] = useState('');
  const [textVillage, setTextVillage] = useState('');
  const [revenueYear, setRevenueYear] = useState();
  const [textForVillage, setTextForVillage] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [noOfList, setNoOfList] = useState();
  const [villageSaja, setVillageSaja] = useState([]);
  const [villageSajjaCode, setVillageSajjaCode] = useState();
  const [villageSajjaName, setVillageSajjaName] = useState();
  const desgNew = localStorage.getItem('desg');
  const { sendRequest } = useAxios();
  const { servarthId, districtCode, talukaCode, districtName, talukaName, desig, villageData } =
    useModel('details');
  const [form15] = Form.useForm();
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

    // setNirank(value);
    // props.setCodeVillage(value);
    // props.setTextForVillage(event.label);
    // props.onVillageChange(false);
    // console.log('Name of Village ==>>', event.label, 'cCode==>>', value);
  };

  const handleChangeForList = (e) => {
    setNoOfList(e);
  };

  const saveForm15 = async () => {
    setIsLoading(true);

    const body = {
      // ccode: codeVillage,
      // districtCode: districtCode,
      // talukaCode: talukaCode,
      communicationReceivedFrom: form15.getFieldValue('communicationReceivedFrom'),
      noOfCommunication: form15.getFieldValue('noOfCommunication'),
      dateOfReceipt: moment(form15.getFieldValue('dateOfReceipt')).format('YYYY-MM-DD'),
      subjectActionToTake: form15.getFieldValue('subjectActionToTake'),
      communicationDispatchedToWhom: form15.getFieldValue('communicationDispatchedToWhom'),
      dateOfDispatch: form15.getFieldValue('dateOfDispatch')
        ? moment(form15.getFieldValue('dateOfDispatch')).format('YYYY-MM-DD')
        : null,
      noInList: noOfList,
      remarks: form15.getFieldValue('remarks'),
      // kiran// designation: desig,
      designation: desgNew,
      // sajjaName: villageSajjaName,
      sajjaCode: villageSajjaCode,
      userId: servarthId,
    };
    // console.log('all values', body);
    sendRequest(
      `${URLS.BaseURL}/form15/saveForm15`,
      'POST',
      body,
      (res) => {
        if (res.status === 201) {
          message.success('Record Saved !');
          history.push({
            pathname: `/form/village-form-15/table-form`,
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
      {/* <VillageSelector
          pageType="withoutYear"
          setCodeVillage={setCodeVillage}
          setTextForVillage={setTextForVillage}
          onVillageChange={() => {
            console.log('Button State set to false!');
          }}
          yearChange={setRevenueYear}
        /> */}

      <Card>
        <Row>
          <Col xl={8} lg={8} md={8} sm={24} xs={24}></Col>
          <Col xl={8} lg={8} md={8} sm={24} xs={24}>
            <h2>
              <FormattedMessage id="form15.InwardOutward" />
            </h2>
          </Col>
          <Col xl={8} lg={8} md={8} sm={24} xs={24}></Col>
        </Row>
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
              <Form.Item wrapperCol={{ xl: 20, lg: 15 }} label="सज्जा">
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
      <Card>
        <Form form={form15} layout="vertical" /* onFinish={saveForm15} */>
          <Row>
            <Col xl={11} lg={11} md={11} sm={24} xs={24}>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: 'Communication Received From is Required',
                  },
                  {
                    max: 50,
                    message: 'Communication Received From shoud be upto 50 Characters',
                  },
                ]}
                name={'communicationReceivedFrom'}
                label={<FormattedMessage id="form15.communicationReceivedform" />}
              >
                <Input maxLength={51} onKeyPress={KeyPressEvents.isInputVarchar} />
              </Form.Item>
            </Col>
            <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>
            <Col xl={11} lg={11} md={11} sm={24} xs={24}>
              <Form.Item
                rules={[
                  { required: true, message: 'No. Of Communication is Required' },
                  {
                    max: 50,
                    message: 'No. Of Communication shoud be upto 50 Characters',
                  },
                ]}
                name={'noOfCommunication'}
                label={<FormattedMessage id="form15.noOfCommunication" />}
              >
                <Input maxLength={51} onKeyPress={KeyPressEvents.isInputVarchar} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col xl={11} lg={11} md={11} sm={24} xs={24}>
              <Form.Item
                rules={[{ required: true, message: 'This Field Is Required..' }]}
                name={'dateOfReceipt'}
                label={<FormattedMessage id="form15.dateOfReceipt" />}
              >
                <DatePicker
                  style={{
                    width: '100%',
                  }}
                />
              </Form.Item>
            </Col>
            <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>

            <Col xl={11} lg={11} md={11} sm={24} xs={24}>
              <Form.Item
                rules={[
                  { required: true, message: 'Subject Action To Take is Required' },
                  {
                    max: 150,
                    message: 'Subject Action To Take shoud be upto 150 Characters',
                  },
                ]}
                name={'subjectActionToTake'}
                label={<FormattedMessage id="form15.subjectActionToTake" />}
              >
                <Input.TextArea maxLength={151} onKeyPress={KeyPressEvents.isInputVarchar} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col xl={11} lg={11} md={11} sm={24} xs={24}>
              <Form.Item
                rules={[
                  {
                    max: 50,
                    message: 'Communication Dispatched To Whom shoud be upto 50 Characters',
                  },
                ]}
                name={'communicationDispatchedToWhom'}
                label={<FormattedMessage id="form15.communicationDispatchedToWhom" />}
              >
                <Input.TextArea maxLength={51} onKeyPress={KeyPressEvents.isInputVarchar} />
              </Form.Item>
            </Col>
            <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>

            <Col xl={11} lg={11} md={11} sm={24} xs={24}>
              <Form.Item
                name={'dateOfDispatch'}
                label={<FormattedMessage id="form15.dateOfDispatch" />}
              >
                <DatePicker
                  style={{
                    width: '100%',
                  }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col xl={11} lg={11} md={11} sm={24} xs={24}>
              {/* <Form.Item
                rules={[
                  { required: true, message: 'No In List is Required' },
                  {
                    max: 50,
                    message: 'No In List shoud be upto 50 Characters',
                  },
                ]}
                name={'noInList'}
                label={<FormattedMessage id="form15.noInList" />}
              >
                <Input maxLength={51} onKeyPress={KeyPressEvents.isInputVarchar} />
              </Form.Item> */}
              <Form.Item
                name="noInList"
                label={<FormattedMessage id="form15.noInList" />}
                rules={[
                  {
                    required: 'true',
                    message: 'No In List is Required',
                  },
                  // { max: 50, message: 'No In List is Required' },
                ]}
              >
                <Select
                  onSelect={(e) => {
                    handleChangeForList(e);
                  }}
                >
                  <Select.Option value="अ">अ</Select.Option>
                  <Select.Option value="ब">ब</Select.Option>
                  <Select.Option value="क">क</Select.Option>
                  <Select.Option value="क१">क१</Select.Option>
                  <Select.Option value="ड">ड</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>
            <Col xl={11} lg={11} md={11} sm={24} xs={24}>
              <Form.Item
                rules={[
                  //  { required: true, message: 'Remarks is Required..' },
                  {
                    max: 300,
                    message: 'Remarks shoud be upto 300 Characters',
                  },
                ]}
                name={'remarks'}
                label={<FormattedMessage id="form15.remarks" />}
              >
                <Input.TextArea maxLength={301} onKeyPress={KeyPressEvents.isInputVarchar} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col sm={2} md={4} lg={4} xl={8}></Col>
            <Col xs={1} sm={1} md={1} lg={2} xl={2}>
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                onClick={() => {
                  if (servarthId) {
                    saveForm15();
                  }
                }}
              >
                <FormattedMessage id="formLanguage.button.save" />
              </Button>
            </Col>
            <Col xl={1} lg={2} md={3} sm={4} xs={8}></Col>
            <Col xl={2} lg={2} md={1} sm={1} xs={1}>
              <Button
                onClick={() => {
                  form15.resetFields();
                }}
                type="default"
                htmlType="submit"
                style={{ color: 'white', backgroundColor: 'orange' }}
              >
                <FormattedMessage id="formLanguage.button.reset" />
              </Button>
            </Col>

            <Col xl={1} lg={2} md={3} sm={4} xs={8}></Col>
            <Col xl={2} lg={2} md={1} sm={1} xs={1}>
              <Button
                onClick={() => {
                  history.push({
                    pathname: `/form/village-form-15/table-form`,
                  });
                }}
                type="danger"
                htmlType="submit"
              >
                <FormattedMessage id="formLanguage.button.cancel" />
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
    </>
  );
}

export default VillageForm15;
