import ESelector from '@/components/eComponents/ESelector';
import useAxios from '@/components/eComponents/use-axios';
import URLS from '@/URLs/urls';
import { DeleteOutlined, EditTwoTone, EyeTwoTone, SearchOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import moment from 'moment';
import {
  Alert,
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
  Tooltip,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { FormattedMessage, useModel } from 'umi';
import { useHistory, useLocation } from 'react-router';
import axios from 'axios';
import KeyPressEvents from '@/util/KeyPressEvents';
import VillageSelector from '@/components/eComponents/VillageSelector';

const TableForm1C = () => {
  // useEffect(() => {
  //   getDataVillage();
  // }, []);
  const { token } = useModel('Auth');
  const Header = `Bearer ${token}`;
  const { Option } = Select;
  const [surveyNumberValue, setSurveyNumberValue] = useState('');
  const [textForVillage, setTextForVillage] = useState();
  const [data, setData] = useState();
  const [showSurveyNumberDropBox, setShowSurveyNumberDropBox] = useState(false);
  const [showArea, setShowArea] = useState(false);
  const [area, setArea] = useState();
  const [name, setName] = useState();
  const [village, setVillage] = useState([]);
  const [assessment, setAssessment] = useState();
  const [form1c] = Form.useForm();
  const [SurveyField] = Form.useForm();
  const [surveyNumbers, setSurveyNumbers] = useState();
  const [codeVillage, setCodeVillage] = useState('');
  const [revenueYear, setRevenueYear] = useState();
  const [isNirank, setIsNirank] = useState(false);
  const [dataInModal, setDataInModal] = useState();
  const [inputState, setInputState] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [okText, setOkText] = useState();
  const [ID, setID] = useState();
  const [form1cdata, setForm1cdata] = useState();
  const { sendRequest } = useAxios();
  const [recordId, setRecordId] = useState();
  let history = useHistory();
  const [hissaNoValue, setHissaNoValue] = useState();
  const [modalForDelete, setModalForDelete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [master, setMaster] = useState([]);
  const [rulesValue, setRulesValue] = useState();
  const [clause, setClause] = useState();
  const { districtName, servarthId, districtCode, talukaCode, talukaName } = useModel('details');
  const [clauses, setClauses] = useState();

  // const handleOnChange = (value, event) => {
  //  // setShowSurveyNumberDropBox(true);
  //   setSurveyNumbers('');
  //   SurveyField.resetFields();
  //   setCodeVillage(value);
  //   setTextForVillage(event.label);
  //   console.log('Name of Village ==>>', event.label, 'cCode==>>', value);
  //   getArea(value);
  //   setShowArea(false);
  // };
  useEffect(() => {
    sendRequest(`${URLS.BaseURL}/form1c/getClauses`, 'GET', null, (res) => {
      setClauses(
        res.data.map((row) => ({
          label: row.clause,
          value: row.codeNo,
        })),
      );
    });
  }, []);

  const handleChangeForSurveyNo = (event) => {
    setSurveyNumberValue(event.target.value);
    setForm1cdata('');
  };

  const showModalForView = (record) => {
    // console.log('record', record);
    form1c.resetFields();
    setDataInModal({
      id: record.id,
      pin: record.pin,
      hissaNo: record.hissaNo,
      cCode: codeVillage,
      nameOfVillagePanchayat: record.nameOfVillagePanchayat,
      nameOfApplicant: record.nameOfApplicant,
      termsOfGrant: record.termsOfGrant,
      remarks: record.remarks,
      hissaNo: record.hissaNo,
      aadeshOnDate: record.aadeshOnDate,
      authorityCompetentToPermitTransferOfLand: record.authorityCompetentToPermitTransferOfLand,
      detailsOfUnclaimedAmount: record.detailsOfUnclaimedAmount,
      breachOfCondition: record.breachOfCondition,
      inspectingOfficer: record.inspectingOfficer,
      inspectionDate: record.inspectionDate,
      purposeOfLandIntended: record.purposeOfLandIntended,
    });

    setInputState(true);
    // console.log('Data in DataInModal state==>', record);
    setIsModalVisible(true);
    setOkText('Okay');
  };

  const showModalForEdit = (record) => {
    // console.log('record==>', record);
    form1c.resetFields();
    setDataInModal({
      id: record.id,
      pin: record.pin,
      hissaNo: record.hissaNo,
      cCode: codeVillage,
      nameOfVillagePanchayat: record.nameOfVillagePanchayat,
      khataOwnerName: record.khataOwnerName,
      termsOfGrant: record.termsOfGrant,
      remarks: record.remarks,
      aadeshOnDate: record.aadeshOnDate,
      authorityCompetentToPermitTransferOfLand: record.authorityCompetentToPermitTransferOfLand,
      detailsOfUnclaimedAmount: record.detailsOfUnclaimedAmount,
      breachOfCondition: record.breachOfCondition,
      inspectingOfficer: record.inspectingOfficer,
      inspectionDate: record.inspectionDate,
      purposeOfLandIntended: record.purposeOfLandIntended,
    });

    setInputState(false);
    // console.log('Data in DataInModal state==>', record);
    setIsModalVisible(true);
    setOkText('Save');
    setID(record.id);
    // setSurveyNumberValue(record.pin);
    setHissaNoValue(record.hissaNo);
  };

  const editform1c = async () => {
    setConfirmLoading(true);

    const parameterForEdit = {
      id: ID,
      pin: dataInModal.pin,
      hissaNo: dataInModal.hissaNo,
      cCode: codeVillage,
      districtCode: districtCode,
      talukaCode: talukaCode,
      nameOfVillagePanchayat: dataInModal.nameOfVillagePanchayat,
      khataOwnerName: dataInModal.khataOwnerName,
      termsOfGrant: dataInModal.termsOfGrant,
      remarks: dataInModal.remarks,
      aadeshOnDate: dataInModal.aadeshOnDate,
      authorityCompetentToPermitTransferOfLand:
        dataInModal.authorityCompetentToPermitTransferOfLand,
      detailsOfUnclaimedAmount: dataInModal.detailsOfUnclaimedAmount,
      breachOfCondition: dataInModal.breachOfCondition,
      inspectingOfficer: dataInModal.inspectingOfficer,
      inspectionDate: dataInModal.inspectionDate,
      purposeOfLandIntended: dataInModal.purposeOfLandIntended,
      typesOf1C: rulesValue,
    };
    // console.log('parameterfpr edit', parameterForEdit);
    if (okText === 'Save') {
      sendRequest(
        `${URLS.BaseURL}/form1c/editForm1C`,
        'PUT',
        parameterForEdit,
        (res) => {
          if (res.status === 200) {
            message.success('Data Updated!');
            showForm1c();
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

    // else if (okText === 'Okay') {
    //   setIsModalVisible(false);
    // }
  };

  const onCancelForDelete = () => {
    setModalForDelete(false);
  };
  const deleteRecord = (record) => {
    setRecordId(record.id);
    setModalForDelete(true);
  };

  const deleteRecordForForm1C = async (record) => {
    setModalForDelete(false);
    sendRequest(`${URLS.BaseURL}/form1c/discardForm1C?id=${recordId}`, 'DELETE', null, (res) => {
      if (res.status === 226) {
        message.success('Record Deleted!');
        setForm1cdata([]);
        showForm1c();
      }
    });
  };

  const showForm1c = async () => {
    setIsLoading(true);

    sendRequest(
      `${
        URLS.BaseURL
      }/form1c/getForm1CData?cCode=${codeVillage.trim()}&pin=${surveyNumberValue}&clause=${clause}`,
      'GET',
      null,
      (res) => {
        // console.log('Full response for Showform1c ', res);
        setForm1cdata(
          res.data.form1CData.map((r, i) => ({
            srNo: i + 1,
            id: r.id,
            surveyNo: r.hissaNo == null || r.hissaNo.trim() == '' ? r.pin : r.pin + '/' + r.hissaNo,
            pin: r.pin,
            hissaNo: r.hissaNo,
            totalAreaH: r.totalAreaH,
            assessment: r.assessment,
            nameOfVillagePanchayat: r.nameOfVillagePanchayat,
            khataOwnerName: r.khataOwnerName,
            termsOfGrant: r.termsOfGrant,
            remarks: r.remarks,
            aadeshOnDate: r.aadeshOnDate,
            authorityCompetentToPermitTransferOfLand: r.authorityCompetentToPermitTransferOfLand,
            detailsOfUnclaimedAmount: r.detailsOfUnclaimedAmount,
            breachOfCondition: r.breachOfCondition,
            inspectingOfficer: r.inspectingOfficer,
            inspectionDate: r.inspectionDate,
            purposeOfLandIntended: r.purposeOfLandIntended,
            typesOf1C: rulesValue,
          })),
        );
        setIsLoading(false);

        message.success('Records Fetched!');
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
      width: '86px',
    },
    {
      key: '2',
      title: <FormattedMessage id="form2.table.survey" />,
      dataIndex: 'surveyNo',
      width: '86px',
    },
    {
      key: '3',
      title: <FormattedMessage id="form1c.labels.nameOfApplicant" />,
      dataIndex: 'khataOwnerName',
      width: '110px',
    },
    {
      key: '4',
      title: <FormattedMessage id="form2.table.area" />,
      dataIndex: 'totalAreaH',
      width: '130px',
    },
    {
      key: '5',
      title: <FormattedMessage id="demandGeneration.table.assessment" />,
      dataIndex: 'assessment',
      width: '86px',
    },

    {
      key: '6',
      title: <FormattedMessage id="form1c.labels.termsOfGrant2" />,
      dataIndex: 'termsOfGrant',
      width: '86px',
    },
    {
      key: '7',
      title: <FormattedMessage id="form1c.labels.orderNoAndDate" />,
      dataIndex: 'aadeshOnDate',
      width: '86px',
    },
    {
      key: '8',
      title: <FormattedMessage id="form1c.labels.termsOfGrant" />,
      dataIndex: 'purposeOfLandIntended',
      width: '120px',
    },
    {
      key: '9',
      title: <FormattedMessage id="form1c.labels.nameOfVillagePanchayat" />,
      dataIndex: 'nameOfVillagePanchayat',
      width: '150px',
    },
    {
      key: '10',
      title: <FormattedMessage id="form1c.labels.authorityCompetentToPermitTransferOfLand" />,
      dataIndex: 'authorityCompetentToPermitTransferOfLand',
      width: '120px',
    },
    {
      key: '11',
      title: <FormattedMessage id="form1c.labels.unClaimedAmount" />,
      dataIndex: 'detailsOfUnclaimedAmount',
      width: '170px',
    },
    {
      key: '12',
      title: <FormattedMessage id="form1c.labels.breachOfCOndition" />,
      dataIndex: 'breachOfCondition',
      width: '170px',
    },
    {
      key: '13',
      title: <FormattedMessage id="form1c.labels.inspectingOfficerAndDate" />,
      dataIndex: 'inspectingOfficer',
      width: '86px',
    },

    {
      key: '14',
      title: <FormattedMessage id="form1c.labels.remarks" />,
      dataIndex: 'remarks',
      width: '96px',
    },
    {
      key: '15',
      fixed: 'right',
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
                    onClick={() => deleteRecord(record)}
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

  const handleCancelForModal = () => {
    setIsModalVisible(false);
  };

  const handleOkForModal = () => {
    setIsModalVisible(false);
  };

  const addForm = () => {
    history.push({
      pathname: `/form/village-form-1c/village-form`,
    });
  };

  const handleChangeForRules = (e) => {
    setRulesValue(e.label);
    setClause(e);
    setForm1cdata('');
  };
  const children = [];
  for (let i = 0; i < master.length; i++) {
    children.push(<Select.Option key={master[i]}>{master[i]}</Select.Option>);
  }

  return (
    <>
      <PageContainer>
        <Card>
          <Row>
            <Col xl={8} lg={8} md={8} sm={7} xs={6}></Col>

            <Col xl={7} lg={7} md={7} sm={9} xs={11}>
              <h2>
                <center>
                  <FormattedMessage id="form1c.report.headings1" />
                </center>
              </h2>
            </Col>
            <Col xl={9} lg={9} md={9} sm={8} xs={4}></Col>

            {/* <Col xl={2} lg={2} md={2} sm={2} xs={2}>
              <Button type="primary" onClick={addForm}>
                <FormattedMessage id="formLanguage.button.add" />
              </Button>
            </Col> */}
          </Row>

          <Row style={{ marginTop: '35px' }}>
            <Col span={24}>
              <VillageSelector
                pageType="withoutYear"
                setCodeVillage={setCodeVillage}
                setTextForVillage={setTextForVillage}
                onVillageChange={(setVillage, setForm1cdata)}
                yearChange={setRevenueYear}
                setIsNirank={setIsNirank}
              />
            </Col>
          </Row>

          <Form form={SurveyField} layout="vertical">
            <Row>
              <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                <Form.Item
                  name="typesOf1C"
                  label="प्रकार"
                  rules={[
                    {
                      required: 'true',
                      message: 'This field is required',
                    },
                  ]}
                >
                  <Select
                    onSelect={(e) => {
                      handleChangeForRules(e);
                    }}
                    options={clauses}
                  >
                    {/* <Select.Option value="1">
                      १क(१)-सक्षम प्राधिकार्यांच्या पूर्व परवानगी शिवाय हस्तांतरास बंदी - कुळ
                      कायद्यान्वये विक्री झालेल्या जमिनी
                    </Select.Option>
                    <Select.Option value="2">
                      १क(२)-सक्षम प्राधिकार्यांच्या पूर्व परवानगी शिवाय हस्तांतरास बंदी - वेगवेगळ्या
                      इनाम व वतन जमिनी (देवस्थान जमिनी वगळून)
                    </Select.Option>
                    <Select.Option value="3">
                      १क(3)-सक्षम प्राधिकार्यांच्या पूर्व परवानगी शिवाय हस्तांतरास बंदी - महाराष्ट्र
                      जमीन महसूल अधिनियम 1966 अंतर्गत विविध योजने अंतर्गत प्रदान/ अतिक्रमण
                      नियामानुकुल केलेल्या जमिनी (भूमिहीन, शेतमजूर ,स्वातंत्रसैनिक इ.)
                    </Select.Option>
                    <Select.Option value="4">
                      १क(४)-सक्षम प्राधिकार्यांच्या पूर्व परवानगी शिवाय हस्तांतरास बंदी - महाराष्ट्र
                      जमीन महसूल अधिनियम 1966 अन्वये विविध योजने अंतर्गत प्रदान/ अतिक्रमण
                      नियामानुकुल केलेल्या जमिनी(गृह निर्माण संस्था,औद्योगिक आस्थापना,शैक्षणिक
                      संस्था,विशेष वसाहत प्रकल्प इ.)
                    </Select.Option>
                    <Select.Option value="5">
                      १क(५)-सक्षम प्राधिकार्यांच्या पूर्व परवानगी शिवाय हस्तांतरास बंदी - महाराष्ट्र
                      शेतजमीन कमाल धारणा कायदा 1961 अंतर्गत वाटप केलेल्या जमिनी
                    </Select.Option>
                    <Select.Option value="6">
                      १क(६)-सक्षम प्राधिकार्यांच्या पूर्व परवानगी शिवाय हस्तांतरास बंदी -
                      म.न.पा/न.पा/विविध प्राधिकरण यांच्या विकास आराखड्यात समाविष्ट जमिनी किंवा
                      ग्रा.प.कडे गुरचरण अथवा इतर प्रयोजनासाठी वर्ग केलेल्या जमिनी
                    </Select.Option>

                    <Select.Option value="7">
                      १क(७)-सक्षम प्राधिकार्यांच्या पूर्व परवानगी शिवाय हस्तांतरास बंदी - देवस्थान
                      इनाम जमिनी
                    </Select.Option>
                    <Select.Option value="8">
                      १क(८)-सक्षम प्राधिकार्यांच्या पूर्व परवानगी शिवाय हस्तांतरास बंदी - आदिवासी
                      खातेदारांच्या जमिनी,महाराष्ट्र जमीन महसूल अधिनियम १९६६ च्या कलम ३६ अ प्रमाणे
                    </Select.Option>
                    <Select.Option value="9">
                      १क(९)-सक्षम प्राधिकार्यांच्या पूर्व परवानगी शिवाय हस्तांतरास बंदी -महाराष्ट्र
                      पुर्नवसन अधिनियम 1999 कलम 16 अन्वये प्रदान केलेल्या जमिनी
                    </Select.Option>
                    <Select.Option value="10">
                      १क(१०)-सक्षम प्राधिकार्यांच्या पूर्व परवानगी शिवाय हस्तांतरास बंदी - भाडे
                      पट्ट्याने दिलेल्या शासकीय जमिनी
                    </Select.Option>
                    <Select.Option value="11">
                      १क(११)-सक्षम प्राधिकार्यांच्या पूर्व परवानगी शिवाय हस्तांतरास बंदी - भुदान व
                      ग्रामदान अंतर्गत दिलेल्या जमिनी
                    </Select.Option>

                    <Select.Option value="12">
                      १क(१२)-सक्षम प्राधिकार्यांच्या पूर्व परवानगी शिवाय हस्तांतरास बंदी -
                      महाराष्ट्र खाजगी वने(संपादन) कायदा 1975 तसेच महाराष्ट्र शेतजमीन(जमीन धारणेची
                      कमाल मर्यादा)अधिनियम 1961 अन्वये चौकशीसाठी प्रलंबित असलेल्या जमिनी
                    </Select.Option>
                    <Select.Option value="13">
                      १क(१३)-सक्षम प्राधिकार्यांच्या पूर्व परवानगी शिवाय हस्तांतरास बंदी - भुमीधारी
                      हक्कान्वये प्राप्त झालेली जमिनी
                    </Select.Option>
                    <Select.Option value="14">
                      १क(१४)-सक्षम प्राधिकार्यांच्या पूर्व परवानगी शिवाय हस्तांतरास बंदी -
                      महाराष्ट्र शेतजमीन(जमीन धारणेची कमाल मर्यादा)अधिनियम 1961 अन्वये कमाल
                      मर्यादेपेक्षा अधिक धारण करण्यास सूट दिलेल्या जमिनी
                    </Select.Option>
                    <Select.Option value="15">
                      १क(१५)-सक्षम प्राधिकार्यांच्या पूर्व परवानगी शिवाय हस्तांतरास बंदी - भूसंपादन
                      अधिनियमान्वये संपादित केलेल्या जमिनी
                    </Select.Option>
                    <Select.Option value="16">
                      १क(१६)-सक्षम प्राधिकार्यांच्या पूर्व परवानगी शिवाय हस्तांतरास बंदी - वक्फ
                      जमिनी{' '}
                    </Select.Option> */}
                  </Select>
                </Form.Item>
              </Col>

              <Col xl={2} lg={2} md={2}></Col>
              <Col xl={5} lg={5} md={11} sm={24} xs={24}>
                <Form.Item
                  label={<FormattedMessage id="formLanguage.table.surveyNo" />}
                  name="surveyNumber"
                >
                  <Input maxLength={7} onChange={handleChangeForSurveyNo} />
                </Form.Item>
              </Col>
              <Col xl={1} lg={1} md={1} sm={1} xs={1} />
              <Col xl={2} lg={2} md={2} sm={2} xs={2} style={{ marginTop: '30px' }}>
                {!isNirank && (
                  <Button
                    onClick={() => {
                      if (textForVillage) {
                        showForm1c();
                      } else if (textForVillage == null) {
                        message.info('Please Select village');
                      }
                    }}
                    type="primary"
                  >
                    <FormattedMessage id="formLanguage.button.search" />
                  </Button>
                )}
              </Col>
            </Row>
            {/* <Row>
              <span>प्रकार - {rulesValue} </span>
            </Row> */}
          </Form>

          {/*  <Col xl={2} lg={2} md={2} sm={4} xs={4}>
              <Button type="primary" onClick={addForm}>
                <FormattedMessage id="formLanguage.button.add" />
              </Button>
            </Col>
           */}
        </Card>
        {isNirank && (
          <>
            <Alert message="टीप" description="सदर गाव नमुना निरंक आहे." type="info" showIcon />
          </>
        )}
        <Card>
          {!isNirank && (
            <Table
              scroll={{ y: 250, x: 1600 }}
              columns={cols}
              loading={isLoading}
              dataSource={form1cdata}
            ></Table>
          )}
        </Card>
        <Modal
          title={<FormattedMessage id="formLanguage.form.popForDelete" />}
          visible={modalForDelete}
          okText={<FormattedMessage id="formLanguage.form.yes" />}
          okType="danger"
          cancelText={<FormattedMessage id="formLanguage.form.no" />}
          onCancel={onCancelForDelete}
          onOk={deleteRecordForForm1C}
        ></Modal>
        <Modal
          width={900}
          visible={isModalVisible}
          okText={okText}
          onCancel={handleCancelForModal}
          onOk={editform1c}
          confirmLoading={confirmLoading}
        >
          <Card>
            <Form layout="vertical" form={form1c}>
              <Row>
                <Col xl={7} lg={7} md={7} sm={7} xs={24}>
                  <Form.Item
                    name="termsOfGrant"
                    //  rules={[{ required: true, message: 'This Field Is Required..' }]}
                    label="जमीन कोणत्या शर्तीवर प्रदान करण्‍यात आली आहे"
                  >
                    <Input.TextArea
                      maxLength={51}
                      onKeyPress={KeyPressEvents.isInputVarchar}
                      disabled={inputState}
                      defaultValue={dataInModal && dataInModal.termsOfGrant}
                      onChange={(e) => {
                        setDataInModal((preDataInModal) => ({
                          ...preDataInModal,
                          termsOfGrant: e.target.value,
                        }));
                      }}
                    ></Input.TextArea>
                  </Form.Item>
                </Col>
                <Col xl={1} lg={1} md={1} sm={1}></Col>
                <Col xl={7} lg={7} md={7} sm={7} xs={24}>
                  <Form.Item
                    name="aadeshOnDate"
                    //   rules={[{ required: true, message: 'This Field Is Required..' }]}
                    label="जमीन प्रदानाचे आदेश क्रमांक व दिनांक  "
                  >
                    <Input.TextArea
                      maxLength={51}
                      onKeyPress={KeyPressEvents.isInputVarchar}
                      disabled={inputState}
                      defaultValue={dataInModal && dataInModal.aadeshOnDate}
                      onChange={(e) => {
                        setDataInModal((preDataInModal) => ({
                          ...preDataInModal,
                          aadeshOnDate: e.target.value,
                        }));
                      }}
                    ></Input.TextArea>
                  </Form.Item>
                </Col>
                <Col xl={1} lg={1} md={1} sm={1}></Col>
                <Col xl={7} lg={7} md={7} sm={7} xs={24}>
                  <Form.Item
                    name="inspectingOfficer"
                    //  rules={[{ required: true, message: 'This Field Is Required..' }]}
                    label="तपासणी अधिकारी व तपासणी दिनांक  "
                  >
                    <Input.TextArea
                      maxLength={51}
                      onKeyPress={KeyPressEvents.isInputVarchar}
                      disabled={inputState}
                      defaultValue={dataInModal && dataInModal.inspectingOfficer}
                      onChange={(e) => {
                        setDataInModal((preDataInModal) => ({
                          ...preDataInModal,
                          inspectingOfficer: e.target.value,
                        }));
                      }}
                    ></Input.TextArea>
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col xl={7} lg={7} md={7} sm={7} xs={24}>
                  <Form.Item
                    name="nameOfVillagePanchayat"
                    //  rules={[{ required: true, message: 'This Field Is Required..' }]}
                    label={<FormattedMessage id="form1c.labels.nameOfVillagePanchayat" />}
                  >
                    <Input.TextArea
                      maxLength={51}
                      onKeyPress={KeyPressEvents.isInputVarchar}
                      disabled={inputState}
                      defaultValue={dataInModal && dataInModal.nameOfVillagePanchayat}
                      onChange={(e) => {
                        setDataInModal((preDataInModal) => ({
                          ...preDataInModal,
                          nameOfVillagePanchayat: e.target.value,
                        }));
                      }}
                    ></Input.TextArea>
                  </Form.Item>
                </Col>
                <Col xl={1} lg={1} md={1} sm={1}></Col>
                <Col xl={7} lg={7} md={7} sm={7} xs={24}>
                  <Form.Item
                    name="purposeOfLandIntended"
                    // rules={[{ required: true, message: 'This Field Is Required..' }]}
                    label={<FormattedMessage id="form1c.labels.termsOfGrant" />}
                  >
                    <Input.TextArea
                      maxLength={51}
                      onKeyPress={KeyPressEvents.isInputVarchar}
                      disabled={inputState}
                      defaultValue={dataInModal && dataInModal.purposeOfLandIntended}
                      onChange={(e) => {
                        setDataInModal((preDataInModal) => ({
                          ...preDataInModal,
                          purposeOfLandIntended: e.target.value,
                        }));
                      }}
                    ></Input.TextArea>
                  </Form.Item>
                </Col>
                <Col xl={1} lg={1} md={1} sm={1}></Col>
                <Col xl={7} lg={7} md={7} sm={7} xs={24}>
                  <Form.Item
                    name="authorityCompetentToPermitTransferOfLand"
                    // rules={[{ required: true, message: 'This Field Is Required..' }]}
                    label="जमीन हस्‍तांतरणास परवानगी देण्‍यास सक्षम प्राधिकारी"
                  >
                    <Input.TextArea
                      maxLength={51}
                      onKeyPress={KeyPressEvents.isInputVarchar}
                      disabled={inputState}
                      defaultValue={
                        dataInModal && dataInModal.authorityCompetentToPermitTransferOfLand
                      }
                      onChange={(e) => {
                        setDataInModal((preDataInModal) => ({
                          ...preDataInModal,
                          authorityCompetentToPermitTransferOfLand: e.target.value,
                        }));
                      }}
                    ></Input.TextArea>
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col xl={7} lg={7} md={7} sm={7} xs={24}>
                  <Form.Item
                    name="detailsOfUnclaimedAmount"
                    //  rules={[{ required: true, message: 'This Field Is Required..' }]}
                    label="शासनास भरावी लागणारी अनार्जित रक्‍कम /नजराणा/ कब्‍जेहक्‍काची रकमेचा तपशिल"
                  >
                    <Input.TextArea
                      maxLength={51}
                      onKeyPress={KeyPressEvents.isInputVarchar}
                      disabled={inputState}
                      defaultValue={dataInModal && dataInModal.detailsOfUnclaimedAmount}
                      onChange={(e) => {
                        setDataInModal((preDataInModal) => ({
                          ...preDataInModal,
                          detailsOfUnclaimedAmount: e.target.value,
                        }));
                      }}
                    ></Input.TextArea>
                  </Form.Item>
                </Col>
                <Col xl={1} lg={1} md={1} sm={1}></Col>
                <Col xl={7} lg={7} md={7} sm={7} xs={24}>
                  <Form.Item
                    name="breachOfCondition"
                    //   rules={[{ required: true, message: 'This Field Is Required..' }]}
                    label="सक्षम प्राधिकार्‍यांची विक्री परवानगी/ शर्तभंग प्रकरणी आदेश पारीत झाले असल्‍यास त्‍याचा अनुक्रमांक व दिनांक "
                  >
                    <Input.TextArea
                      maxLength={51}
                      onKeyPress={KeyPressEvents.isInputVarchar}
                      disabled={inputState}
                      defaultValue={dataInModal && dataInModal.breachOfCondition}
                      onChange={(e) => {
                        setDataInModal((preDataInModal) => ({
                          ...preDataInModal,
                          breachOfCondition: e.target.value,
                        }));
                      }}
                    ></Input.TextArea>
                  </Form.Item>
                </Col>
                <Col xl={1} lg={1} md={1} sm={1}></Col>

                <Col xl={7} lg={7} md={7} sm={7} xs={24}>
                  <Form.Item
                    name="remarks"
                    // rules={[{ required: true, message: 'This Field Is Required..' }]}
                    label={<FormattedMessage id="form1c.labels.remarks" />}
                  >
                    <Input.TextArea
                      maxLength={201}
                      onKeyPress={KeyPressEvents.isInputVarchar}
                      disabled={inputState}
                      defaultValue={dataInModal && dataInModal.remarks}
                      onChange={(e) => {
                        setDataInModal((preDataInModal) => ({
                          ...preDataInModal,
                          remarks: e.target.value,
                        }));
                      }}
                    ></Input.TextArea>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
        </Modal>
      </PageContainer>
    </>
  );
};

export default TableForm1C;
