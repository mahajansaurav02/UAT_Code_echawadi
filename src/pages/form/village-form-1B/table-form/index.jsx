import { PageContainer } from '@ant-design/pro-layout';
import {
  Button,
  Card,
  Col,
  Input,
  message,
  Modal,
  Row,
  Select,
  Table,
  Tooltip,
  Form,
  Alert,
  Radio,
  Space,
} from 'antd';
import Axios from 'axios';
import React from 'react';
import { useState } from 'react';
import VillageSelector from '@/components/eComponents/VillageSelector';
import { DeleteOutlined, EditTwoTone, EyeTwoTone, SearchOutlined } from '@ant-design/icons';
import { useHistory, useLocation } from 'react-router-dom';
import useAxios from '@/components/eComponents/use-axios';
import URLS from '@/URLs/urls';
import { FormattedMessage, useModel } from 'umi';
import KeyPressEvents from '@/util/KeyPressEvents';

function Table1B() {
  const { districtName, servarthId, districtCode, talukaCode } = useModel('details');
  const { sendRequest } = useAxios();
  const [codeVillage, setCodeVillage] = useState('');
  const [textForVillage, setTextForVillage] = useState();
  const [isNirank, setIsNirank] = useState(false);
  const [village, setVillage] = useState([]);
  const [form1Bdata, setForm1Bdata] = useState();
  const [pin, setPin] = useState('');
  const [dataInModal, setDataInModal] = useState();
  const [modalForDelete, setModalForDelete] = useState(false);
  const [recordId, setRecordId] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [inputState, setInputState] = useState();
  const [okText, setOkText] = useState();
  const [ID, setID] = useState();
  const [form1B, setFormB] = useState();
  const [hissaNo, setHissaNo] = useState();
  const [revenueYear, setRevenueYear] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [radiovalue, setRadioValue] = useState();
  const [form] = Form.useForm();

  const deleteRecordById = (record) => {
    setRecordId(record.id);
    setModalForDelete(true);
  };

  // const onChangeRadioButton = (e) => {
  //   setRadioValue(e.target.value);
  //   form.setFieldsValue(e.target.value);
  // };

  const columns = [
    {
      key: '1',
      title: <FormattedMessage id="formLanguage.form.serialNo" />,
      dataIndex: 'srNo',
    },
    {
      key: '2',
      title: <FormattedMessage id="formLanguage.table.surveyNo" />,
      dataIndex: 'surveyNumber',
    },
    // {
    //   key: '3',
    //   title: <FormattedMessage id="formLanguage.form.hissaNo" />,
    //   dataIndex: 'hissaNo',
    // },
    {
      key: '3',
      title: <FormattedMessage id="formLanguage.form.Area" />,
      dataIndex: 'assesed',
    },
    {
      key: '4',
      title: <FormattedMessage id="formLanguage.form.assessment" />,
      dataIndex: 'assessment',
    },
    {
      key: '6',
      title: <FormattedMessage id="form1B.form.aakari" />,
      dataIndex: 'assessedArea',
    },

    {
      key: '5',
      title: <FormattedMessage id="formLanguage.form.unAssessedArea" />,
      dataIndex: 'unassessedArea',
    },

    {
      key: '7',
      title: <FormattedMessage id="formLanguage.table.publicRights" />,
      dataIndex: 'publicRightsOfWayAndEasements',
    },
    {
      key: '8',
      title: <FormattedMessage id="formLanguage.table.remark" />,
      dataIndex: 'remarks',
    },
    {
      key: '9',
      title: <FormattedMessage id="formLanguage.table.action" />,
      width: '120px',
      render: (record) => {
        return (
          <>
            <Row>
              {record.id != null ? (
                <Col>
                  <Button
                    onClick={() => showModalForEdit(record)}
                    style={{ backgroundColor: 'lightblue', color: 'black' }}
                  >
                    माहिती भरा
                  </Button>
                  <br />
                  <br />

                  <Button
                    onClick={() => deleteRecordById(record)}
                    style={{ backgroundColor: '	#ff6347', color: 'black' }}
                  >
                    डीलिट करा
                  </Button>
                  <br />
                  <br />

                  <Button
                    onClick={() => showModalForView(record)}
                    style={{ backgroundColor: 'lightgreen', color: 'black' }}
                  >
                    माहिती पहा
                  </Button>
                </Col>
              ) : (
                <Col>
                  <Button
                    onClick={() => showModalForEdit(record)}
                    style={{ backgroundColor: 'lightblue', color: 'black' }}
                  >
                    माहिती भरा
                  </Button>
                </Col>
              )}
            </Row>
          </>
        );
      },
    },
  ];

  const showModalForEdit = (record) => {
    setDataInModal({
      id: record.id,
      pin: record.pin,
      cCode: record.cCode,
      hissaNo: record.hissaNo,
      unassessedArea: record.unassessedArea,
      assessedArea: record.assessedArea,
      publicRightsOfWayAndEasements: record.publicRightsOfWayAndEasements,
      remarks: record.remarks,
      assesed: record.assesed,
      assessment: record.assessment,
    });
    setHissaNo(record.hissaNo);
    setInputState(false);
    // console.log('Data in DataInModal state==>', record);
    setIsModalVisible(true);
    setOkText('Save');
    setID(record.id);
  };

  const editForm1B = async () => {
    setConfirmLoading(true);

    const parametersForEdit = {
      revenueYear: revenueYear,
      districtCode: districtCode,
      talukaCode: talukaCode,
      cCode: codeVillage,
      id: ID,
      pin: dataInModal.pin,
      hissaNo: hissaNo,
      unassessedArea: dataInModal.unassessedArea,
      assessedArea: dataInModal.assessedArea,
      areaTypes: dataInModal.areaTypes,
      publicRightsOfWayAndEasements: dataInModal.publicRightsOfWayAndEasements,
      remarks: dataInModal.remarks,
      assesed: dataInModal.assesed,
      assessment: dataInModal.assessment,
    };
    if (okText === 'Save') {
      // console.log(parametersForEdit);
      sendRequest(
        `${URLS.BaseURL}/form1b/editForm1B`,
        'POST',
        parametersForEdit,
        (res) => {
          if (res.status === 200) {
            message.success('Record Updated!');
            showForm1B();
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

  const showModalForView = (record) => {
    setDataInModal({
      id: record.id,
      pin: record.pin,
      cCode: record.cCode,
      hissaNo: record.hissaNo,
      unassessedArea: record.unassessedArea,
      assessedArea: record.assessedArea,
      publicRightsOfWayAndEasements: record.publicRightsOfWayAndEasements,
      remarks: record.remarks,
      assesed: record.assesed,
      assessment: record.assessment,
    });

    setInputState(true);
    // console.log('Data in DataInModal state==>', record);
    setIsModalVisible(true);
    setOkText('Okay');
  };
  const handleCancelForModal = () => {
    setIsModalVisible(false);
  };

  const onCancelForDeleteModal = () => {
    setModalForDelete(false);
  };

  const showForm1B = async () => {
    setForm1Bdata();
    setIsLoading(true);

    sendRequest(
      `${
        URLS.BaseURL
      }/form1b/getForm1BData?districtCode=${districtCode}&talukaCode=${talukaCode}&cCode=${codeVillage.trim()}&pin=${pin}`,
      'GET',
      null,
      (res) => {
        // console.log('Full response for ShowForm1B ', res);
        setForm1Bdata(
          res.data.form1BData.map((r, i) => ({
            srNo: i + 1,
            id: r.id,
            surveyNumber:
              r.hissaNo == null || r.hissaNo.trim() == '' ? r.pin : r.pin + '/' + r.hissaNo,
            unassessedArea: r.unassessedArea,
            assessedArea: r.assessedArea,
            publicRightsOfWayAndEasements: r.publicRightsOfWayAndEasements,
            remarks: r.remarks,
            assesed: r.totalAreaH
              .substring(0, r.totalAreaH.length - 2)
              .concat('.')
              .concat(r.totalAreaH.substring(r.totalAreaH.length - 2)),
            pin: r.pin,
            hissaNo: r.hissaNo,
            assessment: r.assessment,
          })),
        );
        message.success('Records Fetched !');
        setIsLoading(false);
      },
      (err) => {
        setIsLoading(false);
      },
    );
  };

  const handleChangeForPin = (e) => {
    setPin(e.target.value);
    setForm1Bdata('');
  };

  let history = useHistory();

  const pushToVillageForm = () => {
    history.push({
      pathname: `/form/village-form-1B/village-form`,
    });
  };

  function poPconfirm(e) {
    demandConfirm();
    // console.log(e);
    message.success('Request Successful !!!');
  }

  function cancel(e) {
    // console.log(e);
    message.error('Request Cancelled !!!');
  }

  const deleteRecord = async (record) => {
    setModalForDelete(false);
    sendRequest(`${URLS.BaseURL}/form1b/discardForm1B?id=${recordId}`, 'DELETE', null, (res) => {
      if (res.status === 226) {
        message.success('Record Deleted!');
        setForm1Bdata([]);
        showForm1B();
      }
    });
  };

  return (
    <>
      <PageContainer>
        <Card>
          {/* <h2>
            <center>
              <FormattedMessage id="formLanguage.label.villageForm1a" />
              <br />
              <FormattedMessage id="formLanguage.label.villageForm1aa" />
            </center>
          </h2> */}

          {/* <Row>
            <Col span={21}></Col>
            <Col span={3}>
              <Button type="primary" onClick={pushToVillageForm}>
                <FormattedMessage id="formLanguage.button.add" />
              </Button>
            </Col>
          </Row> */}

          <Row>
            <Col xl={8} lg={8} md={8} sm={7} xs={6}></Col>
            <Col xl={5} lg={7} md={7} sm={9} xs={11}>
              <h1>
                <center>
                  <FormattedMessage id="formLanguage.label.villageForm1a" />
                </center>{' '}
              </h1>
            </Col>
            <Col xl={9} lg={7} md={7} sm={6} xs={2}></Col>
            {/* <Col xl={2} lg={2} md={2} sm={2} xs={2}>
              <Button type="primary" onClick={pushToVillageForm}>
                <FormattedMessage id="formLanguage.button.add" />
              </Button>
            </Col> */}
          </Row>
          <Row>
            <Col xl={1} lg={1} md={1}></Col>
            <Col xl={19} lg={22} md={22} sm={24} xs={24}>
              <h3>
                <center>
                  <FormattedMessage id="formLanguage.label.villageForm1aa" />
                </center>
              </h3>
            </Col>
          </Row>

          <VillageSelector
            pageType="withoutYear"
            setCodeVillage={setCodeVillage}
            setTextForVillage={setTextForVillage}
            onVillageChange={(setVillage, setForm1Bdata)}
            yearChange={setRevenueYear}
            setIsNirank={setIsNirank}
          />

          <Row style={{ marginTop: '20px', marginLeft: '25px' }}>
            <Col span={6}>
              <Input
                onKeyPress={KeyPressEvents.isInputNumber}
                maxLength={7}
                addonBefore={<FormattedMessage id="formLanguage.table.surveyNo" />}
                style={{ width: '200px' }}
                onChange={handleChangeForPin}
              />
            </Col>
            <Col span={6}>
              {!isNirank && (
                <Button
                  onClick={() => {
                    if (textForVillage) {
                      showForm1B();
                    } else if (textForVillage == null) {
                      message.info('Please Select Village');
                    }
                  }}
                  type="primary"
                >
                  <FormattedMessage id="formLanguage.button.search" />
                </Button>
              )}
            </Col>
          </Row>
        </Card>
        <Alert
          message="टीप"
          description="खालील तक्त्यातील माहिती ई-फेरफार प्रणालीतून घेतली आहे.ज्या सातबारावरील भूधारणा प्रकार 'सरकार' असा आहे,केवळ तेच सातबारा येथे दिसतील. 'सरकार भूधारणा असणारे' जे गट या भूधारणाखाली नोंदवलेले नाहीत त्यांची नोंदणीची कार्यवाही ई-फेरफार प्रणालीतून पूर्ण करा.   "
          type="info"
          showIcon
        />
        {isNirank && (
          <>
            <Alert message="टीप" description="सदर गाव नमुना निरंक आहे." type="info" showIcon />
          </>
        )}
        <Card border={true}>
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            {!isNirank && (
              <Table
                bordered
                scroll={{ x: 100 }}
                dataSource={form1Bdata}
                columns={columns}
                loading={isLoading}
              />
            )}
          </Col>
        </Card>

        {/* modal */}
        <Modal
          title={<FormattedMessage id="formLanguage.form.popForDelete" />}
          visible={modalForDelete}
          okText={<FormattedMessage id="formLanguage.form.yes" />}
          okType="danger"
          cancelText={<FormattedMessage id="formLanguage.form.no" />}
          onCancel={onCancelForDeleteModal}
          onOk={deleteRecord}
        ></Modal>

        <Modal
          width={1000}
          title={<FormattedMessage id="formLanguage.form.saveEdit" />}
          visible={isModalVisible}
          okText={okText}
          onOk={editForm1B}
          onCancel={handleCancelForModal}
          confirmLoading={confirmLoading}
        >
          <Row>
            <Col span={11}>
              <Input
                required={true}
                onKeyPress={KeyPressEvents.isInputNumber}
                max={18}
                disabled={inputState}
                value={dataInModal && dataInModal.assessedArea}
                addonBefore={<FormattedMessage id="form1B.form.aakari" />}
                onChange={(e) => {
                  setDataInModal((prevDataInModal) => ({
                    ...prevDataInModal,
                    assessedArea: e.target.value,
                  }));
                }}
              />
            </Col>
            <Col span={2}></Col>

            <Col span={11}>
              <Input
                onKeyPress={KeyPressEvents.isInputNumber}
                max={18}
                disabled={inputState}
                value={dataInModal && dataInModal.unassessedArea}
                addonBefore={<FormattedMessage id="formLanguage.form.unAssessedArea" />}
                onChange={(e) => {
                  setDataInModal((prevDataInModal) => ({
                    ...prevDataInModal,
                    unassessedArea: e.target.value,
                  }));
                }}
              />
            </Col>
          </Row>

          <Row style={{ marginTop: 20 }}>
            <Col span={11}>
              <Input
                onKeyPress={KeyPressEvents.isInputChar}
                max={200}
                disabled={inputState}
                value={dataInModal && dataInModal.publicRightsOfWayAndEasements}
                addonBefore={<FormattedMessage id="formLanguage.table.publicRights" />}
                onChange={(e) => {
                  setDataInModal((prevDataInModal) => ({
                    ...prevDataInModal,
                    publicRightsOfWayAndEasements: e.target.value,
                  }));
                }}
              />
            </Col>
            <Col span={2}></Col>

            <Col span={11}>
              <Form.Item label={<FormattedMessage id="formLanguage.table.remark" />}>
                <Input.TextArea
                  onKeyPress={KeyPressEvents.isInputChar}
                  max={300}
                  style={{ width: 400 }}
                  disabled={inputState}
                  value={dataInModal && dataInModal.remarks}
                  onChange={(e) => {
                    setDataInModal((prevDataInModal) => ({
                      ...prevDataInModal,
                      remarks: e.target.value,
                    }));
                  }}
                ></Input.TextArea>
              </Form.Item>
            </Col>
          </Row>
        </Modal>
      </PageContainer>
    </>
  );
}
export default Table1B;
