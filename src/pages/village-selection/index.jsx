import { Col, Form, Modal, Row, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'umi';
import { useModel } from 'umi';
import { useHistory } from 'react-router-dom';

function villageSelection(props) {
  const [modalForDelete, setModalForDelete] = useState(false);
  const { servarthId, talukaName, districtName, villageData, revenueYear, niranks } =
    useModel('details');
  const [village, setVillage] = useState([]);
  const [codeVillage, setCodeVillage] = useState();
  const [textForVillage, setTextForVillage] = useState();
  const [revenueYear1, setRevenueYear1] = useState();
  const [revenueYearForVillage, setRevenueYearForVillage] = useState();
  const [form] = Form.useForm();
  let history = useHistory();

  useEffect(() => {
    //  console.log('niranks....', niranks);
    // getDataVillage();
    setVillage(
      villageData?.map((row) => ({
        label: row.villageName,
        value: row.cCode,
        // lgdcode:row.lgdcode,
      })),
    );
  }, []);

  useEffect(() => {
    //getYearForVillage();
    setRevenueYearForVillage(
      revenueYear?.map((row) => ({
        label: row.revenueYear,
        value: row.revenueYear,
      })),
    );
  }, []);

  useEffect(() => {
    setModalForDelete(true);
  }, []);

  const onCancelForDeleteModal = () => {
    setModalForDelete(false);
  };

  const handleOnChange = (value, event) => {
    setCodeVillage(value);
    setTextForVillage(event.label);
    //localStorage.setItem('LGD_Code',event.lgdcode)
    //  setNirank(value);
    // props.setCodeVillage(value);
    // props.setTextForVillage(event.label);
    // props.onVillageChange(false);
    // console.log('Name of Village ==>>', event.label, 'cCode==>>', value);
  };

  const onYearChange = (value, event) => {
    // props.yearChange(value);
    setRevenueYear1(value);
    // console.log('Selected Year', e);
    //props.button1State(false);
  };

  const onFinish = async () => {
    var myArray = [
      {
        cCode: codeVillage,
        villageName: textForVillage,
      },
    ];
    // console.log('myArray', myArray);
    localStorage.setItem('villageData1', JSON.stringify(myArray));
    // localStorage.setItem('villageLabel', JSON.stringify(textForVillage));
    var myArrayForRevenue = [
      {
        revenueYear: revenueYear1,
      },
    ];
    localStorage.setItem('revenueYear1', JSON.stringify(myArrayForRevenue));
    form.resetFields();
    history.push({
      pathname: `/reports/village-form-1`,
    });
    window.location.reload(false);
  };

  return (
    <div>
      <Modal
        visible={modalForDelete}
        okText="Yes"
        okType="danger"
        onCancel={onCancelForDeleteModal}
        onOk={onFinish}
      >
        <FormattedMessage id="formLanguage.table.villageYear" />
        <Form layout="horizontal" form={form}>
          <Row style={{ marginTop: 10 }}>
            <Col xl={11} lg={11} md={24} xs={24} sm={24}>
              <Form.Item
                // wrapperCol={{ xl: 20, lg: 15 }}
                label={<FormattedMessage id="villageSelector.label.village" />}
              >
                <Select
                  options={village}
                  placeholder=" गाव निवडा"
                  onSelect={(value, event) => handleOnChange(value, event)}
                ></Select>
              </Form.Item>
            </Col>
            <Col xl={2} lg={2} md={24} sm={24} xs={24}></Col>

            <Col xl={11} lg={11} md={24} sm={24} xs={24}>
              <Form.Item
                // labelCol={{ lg: 12 }}
                // wrapperCol={{ lg: 12 }}
                label={<FormattedMessage id="villageSelector.label.revenueYear" />}
              >
                <Select
                  // style={{ width: 200, marginRight: '15px' }}
                  options={revenueYearForVillage}
                  placeholder={'महसूल वर्ष'}
                  onSelect={(value, event) => onYearChange(value, event)}
                >
                  {/* <Select.Option value="2020-21">2020-21</Select.Option> */}
                  {/* <Select.Option value="2022-23">2022-23</Select.Option> */}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}

export default villageSelection;
