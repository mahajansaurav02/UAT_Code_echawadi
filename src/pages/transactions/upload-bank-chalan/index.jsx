import { PageContainer } from '@ant-design/pro-layout';
import { Card, Form, Row, Col, Input, Select, Upload, Button, Divider } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import React from 'react';
import ValidationPatterns from '@/components/eComponents/ValidationPatterns';
import BasicInput from '@/components/eComponents/BasicInput/BasicInput';

const { TextArea } = Input;
function BankChalan() {
  return (
    <PageContainer>
      <Card>
        <Divider orientation='left'>Challan Details</Divider>
        <Form>
          <Row style={{marginTop:"50px"}}>
            <Col span={12}>
              <BasicInput
                label="Challan Number"
                type="number"
                name="Total Amount"
                rules={[
                  { required: true, message: 'Please Enter Challan Number' },
                  {
                    pattern: ValidationPatterns.NUMBERS_ONLY,
                    message: 'Please Enter Numbers Only',
                  },
                ]}
              >               
              </BasicInput>
            </Col>
          </Row>
         
          <Row style={{ marginTop: 10 }}>
            <Col span={12}>
              <BasicInput
                label="Total Amount to be Deposited"
                type="number"
                name="Total Amount"
                rules={[
                  { required: true, message: 'Please Enter Amount' },
                  {
                    pattern: ValidationPatterns.NUMBERS_ONLY,
                    message: 'Please Enter Numbers Only',
                  },
                ]}
              >
                
              </BasicInput>
             {/*  <Input addonBefore="Total Amount to be Deposited" addonAfter="Rs"></Input> */}
            </Col>

            <Col span={12}>
              <Form.Item
                style={{marginLeft:"30px"}}
                label="Status"              
                rules={[{ required: true}]}
              >
               <Select style={{ width: 200 }} placeholder="Please Select Type">
                <Select.Option value="paid">Paid</Select.Option>
                <Select.Option value="unpaid">Unpaid</Select.Option>
              </Select.Option>
              </Form.Item>             
            </Col>
          </Row>

          <Row style={{ marginTop: 10 }}>
            <Col span={4}>
              <Form.Item
                style={{ width: '300px' }}
                label="Upload Bank Receipt: "
                name="Upload Bank Receipt"
                rules={[{ required: true, message: 'Upload Bank Receipt No.' }]}
              >                              
              </Form.Item>              
            </Col>
            <Col>
              <Upload>
                  <Button icon={<UploadOutlined />}>Click to Upload</Button>
              </Upload>
            </Col>
          </Row>
        </Form>
      </Card>

      <Card>
        <Divider orientation='left'>Bank Details</Divider>
        <Row  style={{marginTop:"50px"}}>        
          <Col span={12}>
            <BasicInput
                validKeys={ValidationPatterns.CHAR_ONLY}
                style={{marginLeft:"30px"}}
                label="Bank Name"
                name="Bank Name"
              rules={[{ required: true, message: 'Please Enter Bank Name' },
                  {
                    pattern: ValidationPatterns.CHAR_ONLY,
                    message: 'Please Enter in Characters Only',
                },
                /* { min: 1, message: 'Username must be minimum 5 characters.' },
                  { max: 5, message: 'Username must be minimum 5 characters.' }, */
              ]}
            >
              {/* <Input style={{width:"280px"}}></Input> */}
              </BasicInput>
          </Col>
           <Col span={12}>
              <Form.Item
                style={{marginLeft:"20px"}}
                label="Bank Receipt No:"
                name="Bank Receipt No."
                rules={[{ required: true, message: 'Please Enter Receipt Number' }]}
              >
              <Input style={{width:"280px"}}></Input>
              </Form.Item>
          </Col>
        </Row> <br />
        <Row>
          <Col>
              <Form.Item
                style={{marginLeft:"30px"}}
                label="Bank Address"
                name="Bank Address"
                rules={[{ required: true, message: 'Please Enter Address' }]}
            >
              <TextArea style={{width:"380px"}}></TextArea>
              </Form.Item>
          </Col>
        </Row> <br />
        
        <Row>
          <Col span={8}></Col>
          <Col span={8}>
            <Button type='primary' style={{marginRight:"30px"}} >Save</Button>
            <Button type='default'  style={{marginRight:"30px"}}>Reset</Button>
            <Button type="danger">Cancel</Button>
          </Col>
          <Col span={8}></Col>
        </Row>
      </Card>
    </PageContainer>
  );
}

export default BankChalan;
