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
  Modal,
  Popconfirm,
  Row,
  Select,
  Table,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { FormattedMessage, useModel } from 'umi';
import URLS from '@/URLs/urls';
import { useHistory, useLocation } from 'react-router';
import useAxios from '@/components/eComponents/use-axios';
import { DeleteOutlined, EditTwoTone, EyeTwoTone } from '@ant-design/icons';
import KeyPressEvents from '@/util/KeyPressEvents';
import axios from 'axios';

function TableForm1Abstract() {
  const [village, setVillage] = useState([]);
  const [landTypeArr, setLandTypeArr] = useState();
  const [landTypeValue, setLandTypeValue] = useState();
  const { sendRequest } = useAxios();
  const [showGetDataButton, setShowGetDataButton] = useState(false);
  const [surveyNumberValue, setSurveyNumberValue] = useState();
  const [codeVillage, setCodeVillage] = useState();
  const [flagButton2, setFlagButton2] = useState(true);
  const [assessment, setAssessment] = useState();
  const [modalForDelete, setModalForDelete] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [VillageForm3Data, setVillageForm3Data] = useState([]);
  const [recordId, setRecordId] = useState();
  const [dataInModal, setDataInModal] = useState();
  const [inputState, setInputState] = useState();
  const [okText, setOkText] = useState();
  const [ID, setID] = useState();
  const [pin, setPin] = useState();
  const [form] = Form.useForm();
  const { districtName, servarthId, districtCode, talukaCode, talukaName } = useModel('details');
  const { token } = useModel('Auth');
  const Header = `Bearer ${token}`;
  const langType = localStorage.getItem('umi_locale');
    const echHost = localStorage.getItem('echHost');
  const mhrHost = localStorage.getItem('mhrHost');
  const echDbName = localStorage.getItem('echDbName');
  const echSchemaName = localStorage.getItem('echSchemaName');
  const mhrDbName = localStorage.getItem('mhrDbName');
  const mhrSchemaName = localStorage.getItem('mhrSchemaName');

  let history = useHistory();

  const handleESelectorChange = (sn, cCodeT) => {
    setSurveyNumberValue(sn);
    setCodeVillage(cCodeT);
  };

  const addForm = () => {
    history.push({
      pathname: `/form/village-form-1abstract/village-form`,
    });
  };
  useEffect(() => {
    getDataVillage();
  }, []);

  const getDataVillage = async () => {
    await axios
      .get(`${URLS.BaseURL}/restservice/getVillageListByUser?username=${servarthId}`, {
        headers: {
          Authorization: Header,
        'echHost': echHost,
          'mhrHost':mhrHost,
          'echDbName': echDbName,
          'echSchemaName': echSchemaName,
          'mhrDbName': mhrDbName,
          'mhrSchemaName': mhrSchemaName
        },
      })
      .then((res) => {
        setVillage(
          res.data.map((row) => ({
            label: row.villageName,
            value: row.cCode,
          })),
        );
      });
  };
  const getForm1Abstract = async () => {
    sendRequest(
      `${URLS.BaseURL}/form1Abstract/getForm1AbstractDetails?districtCode=${districtCode}&talukaCode=${talukaCode}&cCode=${codeVillage}`,
      'GET',
      null,
      (res) => {
        if (langType === 'ma-IN') {
          setVillageForm3Data(
            res.data.map((r, index) => ({
              srNo: index + 1,
              id: r.id,
              landType: r.landType,
              landTypeName: r.landTypeNameMarathi,
              area: r.area,
              areaUnit: r.areaUnit,
              assessment: r.assessment,
              remarks: r.remarks,
            })),
          );
        } else {
          setVillageForm3Data(
            res.data.map((r, index) => ({
              srNo: index + 1,
              id: r.id,
              landType: r.landType,
              landTypeName: r.landTypeName,
              area: r.area,
              areaUnit: r.areaUnit,
              assessment: r.assessment,
              remarks: r.remarks,
            })),
          );
        }

        message.success('Records Fetched!');
      },
    );
  };

  const onCancelForDelete = () => {
    setModalForDelete(false);
  };

  const deleteRecord = (record) => {
    setRecordId(record.id);
    setModalForDelete(true);
  };

  const deleteForm3Data = async (record) => {
    setModalForDelete(false);
    sendRequest(
      `${URLS.BaseURL}/form1Abstract/discardForm1Abstract?id=${recordId}`,
      'DELETE',
      null,
      (res) => {
        if (res.status == 226) {
          message.success('Record Deleted !');
          setVillageForm3Data([]);
          getForm1Abstract();
        }
      },
    );
  };

  const columns = [
    {
      key: '1',
      title: <FormattedMessage id="formLanguage.form.serialNo" />,
      dataIndex: 'srNo',
    },
    {
      key: '2',
      title: <FormattedMessage id="form1abstract.landType" />,
      dataIndex: 'landTypeName',
    },
    {
      key: '3',
      title: <FormattedMessage id="form1abstract.area" />,
      dataIndex: 'area',
    },
    {
      key: '4',
      title: <FormattedMessage id="form1abstract.unit" />,
      render: (record) => {
        return <FormattedMessage id={record.areaUnit} />;
      },
    },
    {
      key: '5',
      title: <FormattedMessage id="form1abstract.assessment" />,
      dataIndex: 'assessment',
    },
    {
      key: '6',
      title: <FormattedMessage id="form1abstract.remarks" />,
      dataIndex: 'remarks',
    },
    {
      key: '10',
      title: <FormattedMessage id="formLanguage.table.action" />,
      width: '56px',
      render: (record) => {
        return (
          <>
            <Row>
              <Col>
                <EditTwoTone onClick={() => showModalForEdit(record)} />
                <DeleteOutlined
                  onClick={() => deleteRecord(record)}
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

  const handleCancelForModal = () => {
    setIsModalVisible(false);
  };

  const handleOkForModal = () => {
    setIsModalVisible(false);
  };

  const showModalForView = (record) => {
    form.resetFields();
    setDataInModal({});
    setDataInModal({
      id: record.id,
      pin: record.pin,
      hissaNo: record.hissaNo,
      cCode: codeVillage,
      landType: record.landType,
      landTypeName: record.landTypeName,
      area: record.area,
      areaUnit: record.areaUnit,
      assessment: record.assessment,
      remarks: record.remarks,
    });
    setInputState(true);
    setIsModalVisible(true);
    setOkText('Okay');
  };

  const showModalForEdit = (record) => {
    form.resetFields();
    setDataInModal({});
    setDataInModal({
      id: record.id,
      pin: record.pin,
      cCode: codeVillage,
      landType: record.landType,
      landTypeName: record.landTypeName,
      area: record.area,
      areaUnit: record.areaUnit,
      assessment: record.assessment,
      remarks: record.remarks,
    });
    setInputState(false);
    setIsModalVisible(true);
    setOkText('Save');
    setID(record.id);
    setPin(record.pin);
  };

  const editForm3 = async () => {
    const parametersForEdit = {
      id: ID,
      pin: dataInModal.pin,
      districtCode: districtCode,
      talukaCode: talukaCode,
      cCode: codeVillage,
      landType: dataInModal.landType,
      landTypeName: dataInModal.landTypeName,
      area: dataInModal.area,
      areaUnit: dataInModal.areaUnit,
      assessment: dataInModal.assessment,
      remarks: dataInModal.remarks,
    };
    if (okText === 'Save') {
      sendRequest(
        `${URLS.BaseURL}/form1Abstract/editForm1Abstract`,
        'PUT',
        parametersForEdit,
        (res) => {
          if (res.status === 200) {
            message.success('Data Updated!');
            getForm1Abstract();
            setIsModalVisible(false);
          }
        },
      );
    } else if (okText === 'Okay') {
      setIsModalVisible(false);
    }
  };
  const handleOnChange = (value, event) => {
    setCodeVillage(value);
    setVillageForm3Data('');
  };

  return (
    <>
      <PageContainer>
        <Card>
          <Form layout="horizontal">
            <Row>
              <Col xl={22} lg={22} md={20} sm={18} xs={18}></Col>

              <Col xl={2} lg={2} md={2} sm={4} xs={4}>
                <Button type="primary" onClick={addForm}>
                  <FormattedMessage id="formLanguage.button.add" />
                </Button>
              </Col>
            </Row>

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
                <Form.Item
                  wrapperCol={{ xl: 20, lg: 15 }}
                  label={<FormattedMessage id="villageSelector.label.village" />}
                >
                  <Select
                    options={village}
                    placeholder=" गाव निवडा"
                    onSelect={(value, event) => handleOnChange(value, event)}
                  ></Select>
                </Form.Item>
              </Col>
              {/* <Col xl={1}></Col> */}

              <Col xl={6} lg={6} md={24} sm={24} xs={24}></Col>
            </Row>
          </Form>
          <Row>
            <Col xl={2} lg={2} md={2} sm={2} xs={2}>
              <Button
                type="primary"
                onClick={() => {
                  if (codeVillage) {
                    getForm1Abstract();
                  } else if (codeVillage == null) {
                    message.info('Please Select Village !');
                  }
                }}
              >
                <FormattedMessage id="formLanguage.button.search" />
              </Button>
            </Col>
            <Col xl={22} lg={22} md={20} sm={18} xs={18}></Col>
          </Row>
        </Card>
        <Card>
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            <Table bordered scroll={{ x: 100 }} dataSource={VillageForm3Data} columns={columns} />
          </Col>
        </Card>
        <Modal
          title={<FormattedMessage id="formLanguage.form.popForDelete" />}
          visible={modalForDelete}
          okText={<FormattedMessage id="formLanguage.form.yes" />}
          okType="danger"
          cancelText={<FormattedMessage id="formLanguage.form.no" />}
          onCancel={onCancelForDelete}
          onOk={deleteForm3Data}
        ></Modal>
        <Modal
          width={1000}
          visible={isModalVisible}
          okText={okText}
          onCancel={handleCancelForModal}
          onOk={editForm3}
        >
          <Form layout="vertical" form={form}>
            <Card>
              <Row>
                <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                  <Form.Item
                    name={'area'}
                    rules={[{ required: true, message: 'This Field Is Required..' }]}
                    label={<FormattedMessage id="form1abstract.area" />}
                  >
                    <Input
                      onKeyPress={KeyPressEvents.isInputDecimal}
                      max={30}
                      disabled={inputState}
                      defaultValue={dataInModal && dataInModal.area}
                      onChange={(e) => {
                        setDataInModal((prevDataInModal) => ({
                          ...prevDataInModal,
                          area: e.target.value,
                        }));
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col xl={2} lg={2} md={2}></Col>
                <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                  <Form.Item
                    name={'uom'}
                    rules={[{ required: true, message: 'This Field Is Required..' }]}
                    label={<FormattedMessage id="form1abstract.unit" />}
                  >
                    <Select
                      disabled={inputState}
                      defaultValue={dataInModal && dataInModal.areaUnit}
                      onChange={(e) => {
                        setDataInModal((prevDataInModal) => ({
                          ...prevDataInModal,
                          areaUnit: e,
                        }));
                      }}
                    >
                      <Select.Option value="form1abstract.unit1">
                        {' '}
                        <FormattedMessage id="form1abstract.unit1" />
                      </Select.Option>
                      <Select.Option value="form1abstract.unit2">
                        <FormattedMessage id="form1abstract.unit2" />
                      </Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={6}>
                  <Form.Item
                    name={'assessment'}
                    rules={[{ required: true, message: 'This Field Is Required..' }]}
                    label={<FormattedMessage id="form1abstract.assessment" />}
                  >
                    <Input
                      onKeyPress={KeyPressEvents.isInputDecimal}
                      max={30}
                      disabled={inputState}
                      defaultValue={dataInModal && dataInModal.assessment}
                      onChange={(e) => {
                        setDataInModal((prevDataInModal) => ({
                          ...prevDataInModal,
                          assessment: e.target.value,
                        }));
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col span={2}></Col>
                <Col>
                  <Form.Item
                    name={'remarks'}
                    rules={[{ required: true, message: 'This Field Is Required..' }]}
                    label={<FormattedMessage id="form1abstract.remarks" />}
                  >
                    <Input.TextArea
                      onKeyPress={KeyPressEvents.isInputVarchar}
                      max={200}
                      disabled={inputState}
                      defaultValue={dataInModal && dataInModal.remarks}
                      onChange={(e) => {
                        setDataInModal((prevDataInModal) => ({
                          ...prevDataInModal,
                          remarks: e.target.value,
                        }));
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Form>
        </Modal>
      </PageContainer>
    </>
  );
}

export default TableForm1Abstract;
