import React, { useState } from 'react';
import { Select, Card, Input, Row, Col, Button, DatePicker, Form } from 'antd';
import { FormattedMessage } from 'umi';
import KeyPressEvents from '@/util/KeyPressEvents';

const Modeofpayment = (props) => {
  const [modeOfPayment, setModeOfPayment] = useState('');
  function changeHandler(e) {
    console.log('working handler', e);
    setModeOfPayment(e);
    props.changeObjHanlder(e);
  }

  //props.changeObjHanlder

  return (
    <div>
      <Row>
        <Col>
          <label>
            <FormattedMessage id="modeOfPayment.form.paymentMode" />
          </label>
        </Col>
        <Col>
          <Form.Item name="ModeOfPayment" required={true}>
            <Select
              // defaultValue={'Cash'}
              placeholder="Cash/DD/Cheque"
              style={{ marginLeft: 10, width: 200 }}
              onChange={changeHandler}
            >
              <Select.Option value="Cash">
                <FormattedMessage id="modeOfPayment.form.cash" />
              </Select.Option>
              <Select.Option value="Cheque">
                <FormattedMessage id="modeOfPayment.form.Cheque" />
              </Select.Option>
              <Select.Option value="DD">
                <FormattedMessage id="modeOfPayment.form.dd" />
              </Select.Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
      {modeOfPayment && modeOfPayment === 'Cheque' && (
        <Card style={{ magrinTop: 15 }}>
          <Row>
            <label htmlFor="">
              <b>
                {' '}
                <FormattedMessage id="modeOfPayment.form.cheqDetails" />
              </b>
            </label>
          </Row>
          <Row style={{ marginTop: '10px' }}>
            <Col span={8}>
              <Form.Item
                label={<FormattedMessage id="modeOfPayment.form.bankName" />}
                name="chequeBankName"
                rules={[
                  {
                    required: true,
                    message: 'Please Enter Bank Name!',
                  },
                ]}
              >
                <Input maxLength={30} onKeyPress={KeyPressEvents.isInputChar} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label={<FormattedMessage id="modeOfPayment.form.branchName" />}
                name="chequeBranch"
                style={{ paddingLeft: '5px' }}
                rules={[
                  {
                    required: true,
                    message: 'Please Enter Branch Name!',
                  },
                ]}
              >
                <Input maxLength={30} onKeyPress={KeyPressEvents.isInputChar} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label={<FormattedMessage id="modeOfPayment.form.cheqNo" />}
                name="chequeNumber"
                style={{ paddingLeft: '5px' }}
                rules={[
                  {
                    required: true,
                    message: 'Please Enter Cheque Number!',
                  },
                ]}
              >
                <Input maxLength={15} onKeyPress={KeyPressEvents.isInputNumber} />
              </Form.Item>
            </Col>
          </Row>

          <Row style={{ marginTop: '10px' }}>
            <Col span={8}>
              <Form.Item
                label={<FormattedMessage id="modeOfPayment.form.amount" />}
                name="chequeAmount"
                style={{ paddingLeft: '5px' }}
                rules={[
                  {
                    required: true,
                    message: 'Please Enter Cheque Number!',
                  },
                ]}
              >
                <Input disabled={true} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label={<FormattedMessage id="modeOfPayment.form.cheqDate" />}
                name="chequeDate"
                style={{ paddingLeft: '5px' }}
                rules={[
                  {
                    required: true,
                    message: 'Please Select Date!',
                  },
                ]}
              >
                <DatePicker></DatePicker>
              </Form.Item>
            </Col>
          </Row>
        </Card>
      )}

      {modeOfPayment && modeOfPayment === 'DD' && (
        <Card>
          <Row>
            <label htmlFor="">
              <b>
                <FormattedMessage id="modeOfPayment.form.ddDetails" />
              </b>
            </label>
          </Row>
          <Row style={{ marginTop: '10px' }}>
            <Col span={8}>
              <Form.Item
                label={<FormattedMessage id="modeOfPayment.form.bankName" />}
                name="DDBankName"
                rules={[
                  {
                    required: true,
                    message: 'Please Enter Bank Name!',
                  },
                ]}
              >
                <Input maxLength={30} onKeyPress={KeyPressEvents.isInputChar} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label={<FormattedMessage id="modeOfPayment.form.branchName" />}
                name="DDBranch"
                style={{ paddingLeft: '5px' }}
                rules={[
                  {
                    required: true,
                    message: 'Please Enter Branch Name!',
                  },
                ]}
              >
                <Input maxLength={30} onKeyPress={KeyPressEvents.isInputChar} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label={<FormattedMessage id="modeOfPayment.form.ddNumber" />}
                name="DDNumber"
                style={{ paddingLeft: '5px' }}
                rules={[
                  {
                    required: true,
                    message: 'Please Enter DD Number!',
                  },
                ]}
              >
                <Input maxLength={15} onKeyPress={KeyPressEvents.isInputNumber} />
              </Form.Item>
            </Col>
          </Row>

          <Row style={{ marginTop: '10px' }}>
            <Col span={8}>
              <Form.Item
                label={<FormattedMessage id="modeOfPayment.form.amount" />}
                name="DDAmount"
                style={{ paddingLeft: '5px' }}
                rules={[
                  {
                    required: true,
                    message: 'Please Enter DD Amount!',
                  },
                ]}
              >
                <Input disabled={true} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label={<FormattedMessage id="modeOfPayment.form.ddDate" />}
                name="DDDate"
                style={{ paddingLeft: '5px' }}
                rules={[
                  {
                    required: true,
                    message: 'Please Select Date!',
                  },
                ]}
              >
                <DatePicker></DatePicker>
              </Form.Item>
            </Col>
          </Row>
        </Card>
      )}
    </div>
  );
};

export default Modeofpayment;
