import useAxios from '@/components/eComponents/use-axios';
import VillageSelector from '@/components/eComponents/VillageSelector';
import URLS from '@/URLs/urls';
import { DeleteOutlined, EditTwoTone, EyeTwoTone } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Table,
} from 'antd';
import React, { useState } from 'react';
import { FormattedMessage, useModel } from 'umi';
import moment from 'moment';
import { useHistory } from 'react-router';
import ESelector from '@/components/eComponents/ESelector';

function TableForm14() {
  const [surveyNumberValue, setSurveyNumberValue] = useState();
  const { districtName, servarthId, districtCode, talukaCode } = useModel('details');

  const [codeVillage, setCodeVillage] = useState('');
  const [textVillage, setTextVillage] = useState('');
  const [textForVillage, setTextForVillage] = useState();
  const [village, setVillage] = useState([]);
  const [revenueYear, setRevenueYear] = useState();
  const [isNirank, setIsNirank] = useState(false);

  const [modalForDelete, setModalForDelete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recordId, setRecordId] = useState();
  const { sendRequest } = useAxios();
  const [form14data, setForm14data] = useState();
  const [dataInModal, setDataInModal] = useState();
  const [inputState, setInputState] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [stateForPakkeandKacche, setStateForPakkeandKacche] = useState();
  const [stateForPakke, setStateForPakke] = useState();
  const [stateForKacche, setStateForKacche] = useState();
  const [stateForThrown, setStateForThrown] = useState();
  const [okText, setOkText] = useState();
  const [ID, setID] = useState();
  const [form14] = Form.useForm();
  let history = useHistory();

  const getForm14Data = async () => {
    setIsLoading(true);

    sendRequest(
      `${URLS.BaseURL}/form14/getForm14Data?districtCode=${districtCode}&talukaCode=${talukaCode}&cCode=${codeVillage}`,
      'GET',
      null,
      (res) => {
        setForm14data([]);
        setForm14data(
          res.data.form14Data.map((r, i) => ({
            srNo: i + 1,
            id: r.id,
            position: r.position,
            pakkaOrKaccha: r.pakkaOrKaccha,
            purposeOfUse: r.purposeOfUse,
            governmentbodyOrPrivate: r.governmentbodyOrPrivate,
            pakka: r.pakka,
            kaccha: r.kaccha,
            thrown: r.thrown,
            remarks: r.remarks,
            hissaNo: r.hissaNo,
            pin: r.pin,
            surveyNo: r.hissaNo == null || r.hissaNo.trim() == '' ? r.pin : r.pin + '/' + r.hissaNo,
            //  otherType: r.otherType,
            eWaterSourceName: r.eWaterSourceName,
          })),
        );
        message.success('Records Fetched!');
        setIsLoading(false);
      },
      (err) => {
        setIsLoading(false);
      },
    );
  };
  const cols = [
    {
      key: '1',
      title: <FormattedMessage id="formLanguage.form.serialNo" />,
      dataIndex: 'srNo',
    },
    {
      key: '2',
      title: <FormattedMessage id="form14.table.surveyNumber" />,
      dataIndex: 'surveyNo',
    },

    {
      key: '3',
      title: <FormattedMessage id="form14.input.sourcesOfWater" />,
      dataIndex: 'eWaterSourceName',
    },
    {
      key: '4',
      title: <FormattedMessage id="form14.fields.position" />,
      dataIndex: 'position',
    },
    {
      key: '5',
      title: <FormattedMessage id="form14.fields.pakkaOrKaccha" />,
      dataIndex: 'pakkaOrKaccha',
    },
    {
      key: '5',
      title: 'पक्के',
      dataIndex: 'pakka',
    },
    {
      key: '6',
      title: 'कच्चे',
      dataIndex: 'kaccha',
    },
    {
      key: '7',
      title: 'वापरात नसलेले (स्थंभ ४,७ व ८ मध्ये नोंदवलेल्या खेरीज इतर)',
      dataIndex: 'thrown',
    },
    {
      key: '8',
      title: <FormattedMessage id="form14.fields.purposeOfUse" />,
      dataIndex: 'purposeOfUse',
    },
    {
      key: '9',
      title: <FormattedMessage id="form14.fields.governmentbodyOrPrivate" />,
      dataIndex: 'governmentbodyOrPrivate',
    },
    {
      key: '10',
      title: <FormattedMessage id="form14.fields.remarks" />,
      dataIndex: 'remarks',
    },
    {
      title: <FormattedMessage id="formLanguage.table.action" />,
      width: '75px',
      render: (record) => {
        return (
          <>
            <Row>
              <Col>
                <EditTwoTone onClick={() => showModalForEdit(record)} />

                <DeleteOutlined
                  onClick={() => deleteForRecord(record)}
                  style={{ color: 'red', marginLeft: 12 }}
                />

                <EyeTwoTone
                  onClick={() => showModalForView(record)}
                  style={{ color: 'violet', marginLeft: 12, marginTop: 10 }}
                />
              </Col>
            </Row>
          </>
        );
      },
    },
  ];
  const showModalForView = (record) => {
    // console.log('record', record);
    form14.resetFields();
    setDataInModal({});
    setDataInModal({
      id: record.id,
      pin: record.pin,
      position: record.position,
      pakkaOrKaccha: record.pakkaOrKaccha,
      pakka: record.pakka,
      kaccha: record.kaccha,
      thrown: record.thrown,
      purposeOfUse: record.purposeOfUse,
      governmentbodyOrPrivate: record.governmentbodyOrPrivate,
      remarks: record.remarks,
      hissaNo: record.hissaNo,
      eWaterSourceName: record.eWaterSourceName,
    });

    setInputState(true);
    // console.log('Data in DataInModal state==>', record);
    setIsModalVisible(true);
    setOkText('Okay');
  };

  const onCancelForDelete = () => {
    setModalForDelete(false);
  };

  const deleteForRecord = (record) => {
    setRecordId(record.id);
    setModalForDelete(true);
  };

  const deleteRecord = async (record) => {
    setModalForDelete(false);
    sendRequest(`${URLS.BaseURL}/form14/discardForm14?id=${recordId}`, 'DELETE', null, (res) => {
      if (res.status === 226) {
        message.success('Record Deleted!');
        setForm14data([]);
        getForm14Data();
      }
    });
  };
  const showModalForEdit = (record) => {
    // console.log('record==>', record);
    form14.resetFields();
    setDataInModal({});
    setDataInModal({
      id: record.id,
      pin: record.pin,
      position: record.position,
      pakkaOrKaccha: record.pakkaOrKaccha,
      pakka: record.pakka,
      kaccha: record.kaccha,
      thrown: record.thrown,
      purposeOfUse: record.purposeOfUse,
      governmentbodyOrPrivate: record.governmentbodyOrPrivate,
      remarks: record.remarks,
      hissaNo: record.hissaNo,
      eWaterSourceName: record.eWaterSourceName,
    });

    setInputState(false);
    // console.log('Data in DataInModal state==>', record);
    setIsModalVisible(true);
    setOkText('Save');
    setID(record.id);
  };
  const handleCancelForModal = () => {
    setIsModalVisible(false);
  };
  const editForm14 = () => {
    setConfirmLoading(true);

    const parameterForEdit = {
      pin: dataInModal.pin,
      districtCode: districtCode,
      talukaCode: talukaCode,
      hissaNo: dataInModal.hissaNo,
      districtCode: districtCode,
      talukaCode: talukaCode,
      cCode: codeVillage,
      id: ID,
      position: dataInModal.position,
      pakkaOrKaccha: dataInModal.pakkaOrKaccha,
      pakka: dataInModal.pakka,
      kaccha: dataInModal.kaccha,
      thrown: dataInModal.thrown,
      purposeOfUse: dataInModal.purposeOfUse,
      governmentbodyOrPrivate: dataInModal.governmentbodyOrPrivate,
      remarks: dataInModal.remarks,
      eWaterSourceName: dataInModal.eWaterSourceName,
    };
    // console.log('parameters for edit', parameterForEdit);
    if (okText === 'Save') {
      sendRequest(
        `${URLS.BaseURL}/form14/editForm14`,
        'PUT',
        parameterForEdit,
        (res) => {
          if (res.status === 200) {
            message.success('Data Updated!');
            getForm14Data();
            setConfirmLoading(false);
            setIsModalVisible(false);
          }
        },
        (err) => {
          setIsModalVisible(false);
          setConfirmLoading(false);
        },
      );
    } else if (okText === 'Okay') {
      setIsModalVisible(false);
      setConfirmLoading(false);
    }
  };
  /*   const handleESelectorChange = (sn, cCodeT) => {
    setSurveyNumberValue(sn);
    setCodeVillage(cCodeT);
    setForm14data('');
  }; */
  return (
    <PageContainer>
      <Card>
        <Row style={{ marginBottom: '10px' }}>
          <Col xl={22} lg={22} md={20} sm={24} xs={24}>
            <h1 style={{ textAlign: 'center' }}>पाणीपुरवठ्याचा साधनांची नोंदवही</h1>
          </Col>
          <Col xl={2} lg={2} md={2} sm={24} xs={24}>
            <Button
              style={{ float: 'right' }}
              type="primary"
              onClick={() => {
                history.push({
                  pathname: `/form/village-form-14/village-form`,
                });
              }}
            >
              <FormattedMessage id="formLanguage.button.add" />
            </Button>
          </Col>
        </Row>
        {/*   <ESelector pageType={'SurveyTableForm'} allDataT={handleESelectorChange} /> */}
        <VillageSelector
          pageType="withoutYear"
          setCodeVillage={setCodeVillage}
          setTextForVillage={setTextForVillage}
          onVillageChange={(setVillage, setForm14data)}
          yearChange={setRevenueYear}
          setIsNirank={setIsNirank}
        />
        <Row>
          <Col xl={11} lg={11} md={11} sm={24} xs={24}>
            <Button
              type="primary"
              onClick={() => {
                if (textForVillage) {
                  getForm14Data();
                } else if (textForVillage == null) {
                  message.info('Please Select Village !');
                }
              }}
            >
              <FormattedMessage id="formLanguage.button.search" />
            </Button>
          </Col>
        </Row>
      </Card>
      <Card>
        <Table columns={cols} loading={isLoading} dataSource={form14data}></Table>
      </Card>
      <Modal
        title={<FormattedMessage id="formLanguage.form.popForDelete" />}
        visible={modalForDelete}
        okText={<FormattedMessage id="formLanguage.form.yes" />}
        okType="danger"
        cancelText={<FormattedMessage id="formLanguage.form.no" />}
        onCancel={onCancelForDelete}
        onOk={deleteRecord}
      ></Modal>
      <Modal
        width={900}
        visible={isModalVisible}
        okText={okText}
        onCancel={handleCancelForModal}
        onOk={editForm14}
        confirmLoading={confirmLoading}
      >
        <Form form={form14} layout="vertical">
          <Row>
            <Col xl={7} lg={7} md={7} sm={7} xs={24}>
              <Form.Item
                name="eWaterSourceName"
                rules={[{ required: true, message: 'This Field Is Required..' }]}
                label={<FormattedMessage id="form14.input.sourcesOfWater" />}
              >
                <Input
                  disabled={inputState}
                  defaultValue={dataInModal && dataInModal.eWaterSourceName}
                  onChange={(e) => {
                    setDataInModal((preDataInModal) => ({
                      ...preDataInModal,
                      eWaterSourceName: e.target.value,
                    }));
                  }}
                />
              </Form.Item>
            </Col>
            <Col xl={1} lg={1} md={1} sm={1}></Col>
            <Col xl={7} lg={7} md={7} sm={7} xs={24}>
              <Form.Item
                name="position"
                rules={[{ required: true, message: 'This Field Is Required..' }]}
                label={<FormattedMessage id="form14.fields.position" />}
              >
                <Input
                  disabled={inputState}
                  defaultValue={dataInModal && dataInModal.position}
                  onChange={(e) => {
                    setDataInModal((preDataInModal) => ({
                      ...preDataInModal,
                      position: e.target.value,
                    }));
                  }}
                />
              </Form.Item>
            </Col>
            <Col xl={1} lg={1} md={1} sm={1}></Col>
            <Col xl={7} lg={7} md={7} sm={7} xs={24}>
              <Form.Item
                name="pakkaOrKaccha"
                rules={[
                  { required: true, message: 'Pakka Or Kaccha is Required..' },
                  // {
                  //   max: 25,
                  //   message: 'Pakka Or Kaccha should be upto 25 characters',
                  // },
                ]}
                label={<FormattedMessage id="form14.fields.pakkaOrKaccha" />}
              >
                <Select
                  showSearch
                  placeholder="Select"
                  // value={stateForPakkeandKacche}
                  // onChange={(value) => {
                  //   setStateForPakkeandKacche(value);
                  // }}
                  disabled={inputState}
                  defaultValue={dataInModal && dataInModal.pakkaOrKaccha}
                  onChange={(e) => {
                    setDataInModal((preDataInModal) => ({
                      ...preDataInModal,
                      pakkaOrKaccha: e,
                    }));
                  }}
                >
                  <Select.Option value="पक्के">पक्के</Select.Option>
                  <Select.Option value="कच्चे">कच्चे</Select.Option>
                </Select>
                {/* <Input maxLength={26} onKeyPress={KeyPressEvents.isInputVarchar} /> */}
              </Form.Item>
              {/* <Form.Item
                name="pakkaOrKaccha"
                rules={[{ required: true, message: 'This Field Is Required..' }]}
                label={<FormattedMessage id="form14.fields.pakkaOrKaccha" />}
              >
                <Input
                  disabled={inputState}
                  defaultValue={dataInModal && dataInModal.pakkaOrKaccha}
                  onChange={(e) => {
                    setDataInModal((preDataInModal) => ({
                      ...preDataInModal,
                      pakkaOrKaccha: e.target.value,
                    }));
                  }}
                />
              </Form.Item> */}
            </Col>
          </Row>
          <Row>
            {dataInModal && dataInModal.pakkaOrKaccha === 'पक्के' ? (
              <Col xl={7} lg={7} md={24} sm={24} xs={24}>
                <Form.Item
                  name="pakka"
                  rules={[
                    { required: true, message: 'Pakka Or Kaccha is Required..' },
                    // {
                    //   max: 25,
                    //   message: 'Pakka Or Kaccha should be upto 25 characters',
                    // },
                  ]}
                  label={'पक्के'}
                >
                  <Select
                    disabled={inputState}
                    defaultValue={dataInModal && dataInModal.pakka}
                    onChange={(e) => {
                      setDataInModal((preDataInModal) => ({
                        ...preDataInModal,
                        pakka: e,
                      }));
                      setDataInModal((preDataInModal) => ({
                        ...preDataInModal,
                        kaccha: '',
                      }));
                    }}
                  >
                    <Select.Option value="प्रत्यक्षात वापरात असलेले">
                      प्रत्यक्षात वापरात असलेले
                    </Select.Option>
                    <Select.Option value="चालू स्थतीत असलेले परंतु वापरात नसलेले">
                      चालू स्थतीत असलेले परंतु वापरात नसलेले
                    </Select.Option>
                    <Select.Option value="टाकलेले">टाकलेले</Select.Option>
                  </Select>
                  {/* <Input maxLength={26} onKeyPress={KeyPressEvents.isInputVarchar} /> */}
                </Form.Item>
              </Col>
            ) : (
              <Col xl={7} lg={7} md={24} sm={24} xs={24}>
                <Form.Item
                  name="kaccha"
                  rules={[
                    { required: true, message: 'Pakka Or Kaccha is Required..' },
                    // {
                    //   max: 25,
                    //   message: 'Pakka Or Kaccha should be upto 25 characters',
                    // },
                  ]}
                  label={'कच्चे'}
                >
                  <Select
                    disabled={inputState}
                    defaultValue={dataInModal && dataInModal.kaccha}
                    onChange={(e) => {
                      setDataInModal((preDataInModal) => ({
                        ...preDataInModal,
                        kaccha: e,
                      }));
                      setDataInModal((preDataInModal) => ({
                        ...preDataInModal,
                        pakka: '',
                      }));
                      setDataInModal((preDataInModal) => ({
                        ...preDataInModal,
                        thrown: '',
                      }));
                    }}
                  >
                    <Select.Option value="प्रत्यक्षात वापरात असलेले">
                      प्रत्यक्षात वापरात असलेले
                    </Select.Option>
                    <Select.Option value="चालू स्थतीत असलेले परंतु वापरात नसलेले">
                      चालू स्थतीत असलेले परंतु वापरात नसलेले
                    </Select.Option>
                    <Select.Option value="टाकलेले">टाकलेले</Select.Option>
                  </Select>
                  {/* <Input maxLength={26} onKeyPress={KeyPressEvents.isInputVarchar} /> */}
                </Form.Item>
              </Col>
            )}
            <Col xl={1} lg={1} md={1} sm={1}></Col>

            {dataInModal && dataInModal.pakkaOrKaccha === 'पक्के' ? (
              <Col xl={8} lg={8} md={24} sm={24} xs={24}>
                <Form.Item
                  name="throwned"
                  rules={[{ required: true, message: 'Pakka Or Kaccha is Required..' }]}
                  label={'वापरात नसलेले (स्थंभ ४,७ व ८ मध्ये नोंदवलेल्या खेरीज इतर)'}
                >
                  <Select
                    disabled={inputState}
                    defaultValue={dataInModal && dataInModal.thrown}
                    onChange={(e) => {
                      setDataInModal((preDataInModal) => ({
                        ...preDataInModal,
                        thrown: e,
                      }));
                    }}
                  >
                    <Select.Option value="नादुरुस्त झाल्यामुळे">नादुरुस्त झाल्यामुळे</Select.Option>
                    <Select.Option value="इतर कारणांमुळे">इतर कारणांमुळे</Select.Option>
                  </Select>
                  {/* <Input maxLength={26} onKeyPress={KeyPressEvents.isInputVarchar} /> */}
                </Form.Item>
              </Col>
            ) : (
              ''
            )}

            <Col xl={1} lg={1} md={1} sm={1}></Col>
            <Col xl={7} lg={7} md={24} sm={24} xs={24}>
              <Form.Item
                name="purposeOfUse"
                rules={[{ required: true, message: 'This Field Is Required..' }]}
                label={<FormattedMessage id="form14.fields.purposeOfUse" />}
              >
                <Input
                  disabled={inputState}
                  defaultValue={dataInModal && dataInModal.purposeOfUse}
                  onChange={(e) => {
                    setDataInModal((preDataInModal) => ({
                      ...preDataInModal,
                      purposeOfUse: e.target.value,
                    }));
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col xl={11} lg={11} md={11} sm={24} xs={24}>
              <Form.Item
                name="governmentbodyOrPrivate"
                rules={[{ required: true, message: 'This Field Is Required..' }]}
                label={<FormattedMessage id="form14.fields.governmentbodyOrPrivate" />}
              >
                <Input
                  disabled={inputState}
                  defaultValue={dataInModal && dataInModal.governmentbodyOrPrivate}
                  onChange={(e) => {
                    setDataInModal((preDataInModal) => ({
                      ...preDataInModal,
                      governmentbodyOrPrivate: e.target.value,
                    }));
                  }}
                />
              </Form.Item>
            </Col>
            <Col xl={2} lg={2} md={2} sm={1} xs={1}></Col>
            <Col xl={11} lg={11} md={11} sm={24} xs={24}>
              <Form.Item
                name="remarks"
                rules={[{ required: true, message: 'This Field Is Required..' }]}
                label={<FormattedMessage id="form14.fields.remarks" />}
              >
                <Input.TextArea
                  disabled={inputState}
                  defaultValue={dataInModal && dataInModal.remarks}
                  onChange={(e) => {
                    setDataInModal((preDataInModal) => ({
                      ...preDataInModal,
                      remarks: e.target.value,
                    }));
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </PageContainer>
  );
}

export default TableForm14;
