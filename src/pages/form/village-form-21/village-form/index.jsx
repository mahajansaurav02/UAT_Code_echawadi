import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card, Col, DatePicker, Divider, Form, Input, message, Row, Select } from 'antd';
import VillageSelector from '@/components/eComponents/VillageSelector';
import { useEffect, useState } from 'react';
import ESelector from '@/components/eComponents/ESelector';
import { useHistory } from 'react-router-dom';
import { FormattedMessage, useModel } from 'umi';
import useAxios from '@/components/eComponents/use-axios';
import URLS from '@/URLs/urls';
import moment from 'moment';
import KeyPressEvents from '@/util/KeyPressEvents';
import InputValidation from '@/util/InputValidation';

function VillageForm21() {
  const { sendRequest } = useAxios();
  const [codeVillage, setCodeVillage] = useState('');
  const [textForVillage, setTextForVillage] = useState();
  const [village, setVillage] = useState([]);
  const [revenueYear, setRevenueYear] = useState();
  const [form] = Form.useForm();
  let history = useHistory();
  const { districtName, servarthId, districtCode, talukaCode } = useModel('details');
  const [day, setDay] = useState();

  const resetForm = () => {
    form.resetFields();
  };
  const cancelForm = () => {
    history.push({
      pathname: `/form/village-form-21/table-form`,
    });
  };

  const success = () => {
    message.console('Data Saved !!!');
  };

  function handleOnChangeDate(e) {
    const dates = moment(e);
    //setDay(dates.getDay());
    //setDay();
    var weekday;
    switch (dates.weekday()) {
      case 1:
        form.setFieldsValue({
          day: 'Monday',
        });
        setDay('Monday');
        console.log('test', dates.weekday());
        break;
      case 2:
        form.setFieldsValue({
          day: 'Tuesday',
        });
        setDay('Tuesday');
        console.log('test', dates.weekday());
        break;
      case 3:
        form.setFieldsValue({
          day: 'Wednesday',
        });
        setDay('Wednesday');
        console.log('test', dates.weekday());
        break;
      case 4:
        form.setFieldsValue({
          day: 'Thursday',
        });
        setDay('Thursday');
        console.log('test', dates.weekday());

        break;
      case 5:
        form.setFieldsValue({
          day: 'Friday',
        });
        setDay('Friday');
        console.log('test', dates.weekday());

        break;
      case 6:
        form.setFieldsValue({
          day: 'Saturday',
        });
        setDay('Saturday');
        console.log('test', dates.weekday());

        break;
      case 0:
        form.setFieldsValue({
          day: 'Sunday',
        });
        setDay('Sunday');
        console.log('test', dates.weekday());

        break;
      default:
        break;
    }
    console.log('weekday for selected dates', dates.weekday());
  }

  const saveForm21 = async (values) => {
    const article = {
      // districtCode: districtCode,
      // talukaCode: talukaCode,
      // cCode: codeVillage,
      userId: servarthId,
      villageName: form.getFieldValue('villageName'),
      diaryDate: moment(form.getFieldValue('diaryDate'), 'DD/MM/YYYY').format('YYYY-MM-DD'),
      day: form.getFieldValue('day'),
      remarks: form.getFieldValue('remarks'),
    };
    console.log('Data for form 21 before api', article);

    sendRequest(`${URLS.BaseURL}/form21/saveForm21`, 'POST', article, (res) => {
      console.log('Data for form 21', article);

      if (res.status === 201) {
        message.success('Data Saved !!!');
        form.resetFields();
        history.push({
          pathname: `/form/village-form-21/table-form`,
        });
      }
    });
  };

  const handleForValid = (e) => {
    e.preventDefault();
    return false;
  };

  return (
    <div>
      <Card>
        <h2>
          <center>
            <FormattedMessage id="villageForm21.form.reuleVillageForm21" />
          </center>
        </h2>
        <h2>
          <center>
            <FormattedMessage id="villageForm21.form.diaryOff" />
          </center>
        </h2>
        {/* <VillageSelector
          pageType="withoutYear"
          setCodeVillage={setCodeVillage}
          setTextForVillage={setTextForVillage}
          onVillageChange={setVillage}
          yearChange={setRevenueYear}
        /> */}
      </Card>
      <Form layout="vertical" form={form} /* onFinish={saveForm21} */>
        <Card>
          <Divider orientation="left">
            <FormattedMessage id="formLanguage.form.echawdi" />
          </Divider>
          <Row>
            <Col xl={11} lg={11} md={11} sm={24} xs={24}>
              <Form.Item
                label={<FormattedMessage id="villageForm21.form.villageName" />}
                name="villageName"
                rules={[
                  { required: true, message: 'Field is necessary!' },
                  {
                    max: 50,
                    message: 'Village name shoud be upto 50 characters',
                  },
                ]}
              >
                {/* <InputValidation keyType={'isInputVarchar'} length={ 51}/> */}

                <Input
                  /*  onPaste={handleForValid}
                    onCopy={handleForValid}
                    onDragOver={handleForValid} */
                  onKeyPress={KeyPressEvents.isInputVarchar}
                  maxLength={51}
                />
              </Form.Item>
            </Col>

            <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>

            <Col xl={11} lg={11} md={11} sm={24} xs={24}>
              <Form.Item
                label={<FormattedMessage id="villageForm21.form.date" />}
                name="diaryDate"
                rules={[{ required: true, message: 'Field is necessary!' }]}
              >
                <DatePicker
                  onSelect={(e) => {
                    handleOnChangeDate(e);
                  }}
                ></DatePicker>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col xl={11} lg={11} md={11} sm={24} xs={24}>
              <Form.Item
                label={<FormattedMessage id="villageForm21.form.day" />}
                name="day"
                rules={[
                  { required: true, message: 'Field is necessary!' },
                  {
                    max: 10,
                    message: 'Day shoud be upto 10 characters',
                  },
                ]}
              >
                <Input
                  onKeyPress={KeyPressEvents.isInputChar}
                  maxLength={11}
                  //defaultValue={day}
                  //value={day}
                  disabled
                />
              </Form.Item>
            </Col>
            <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>
            <Col xl={11} lg={11} md={11} sm={24} xs={24}>
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
                <Input onKeyPress={KeyPressEvents.isInputVarchar} maxLength={201} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col xl={7} lg={7} md={7} sm={5}></Col>
            <Col xl={2} lg={2} md={2} sm={2} xs={1}>
              <Button
                type="primary"
                htmlType="submit"
                onClick={() => {
                  if (servarthId) {
                    saveForm21();
                  }
                }}
              >
                <FormattedMessage id="formLanguage.button.save" />
              </Button>
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
    </div>
  );
}

export default VillageForm21;
