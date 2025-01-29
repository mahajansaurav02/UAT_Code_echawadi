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
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Space,
  Table,
  Tooltip,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { FormattedMessage, useModel } from 'umi';
import { useHistory, useLocation } from 'react-router';
import VillageSelector from '@/components/eComponents/VillageSelector';
import ColumnGroup from 'antd/lib/table/ColumnGroup';
import { Column } from '@ant-design/charts';

var prevTotalArea = 0.0,
  prevAssessment = 0,
  prevNetCultiArea = 0,
  prevTotalPotKharabArea = 0;

const TableFormAkarbandChanges = () => {
  const [surveyNumberValue, setSurveyNumberValue] = useState('');
  const [pin, setPin] = useState('');
  const [codeVillage, setCodeVillage] = useState('');
  const [modalForDelete, setModalForDelete] = useState(false);
  const [recordId, setRecordId] = useState();
  const [textForVillage, setTextForVillage] = useState();
  const [village, setVillage] = useState([]);
  const [revenueYear, setRevenueYear] = useState();
  const [dataInModal, setDataInModal] = useState();
  const [inputState, setInputState] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [okText, setOkText] = useState();
  const [ID, setID] = useState();
  const [form2data, setForm2data] = useState([]);
  const [isNirank, setIsNirank] = useState(false);
  const { sendRequest } = useAxios();
  let history = useHistory();
  const [valuesToDisplay, setValuesToDisplay] = useState();
  const [hissaNoValue, setHissaNoValue] = useState();
  const [form2] = Form.useForm();
  const { districtName, servarthId, districtCode, talukaCode } = useModel('details');
  const [periodToDate, setPeriodToDate] = useState();
  const [periodFromDate, setPeriodFromDate] = useState();
  const [datevalidFlag, setDatevalidFlag] = useState(true);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [authorityDate, setAuthorityDate] = useState();
  const [tableData, setTableData] = useState();
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  const addForm = () => {
    history.push({
      pathname: `/form/village-form-18/village-form`,
    });
  };
  const navigateToAdd = () => {
    history.push({
      pathname: `/form/dyslr-form-akarband-changes/table-form`,
    });
  };

  useEffect(() => {
    if (
      new Date(periodFromDate) > new Date(periodToDate) ||
      new Date(periodToDate) < new Date(periodFromDate)
    ) {
      message.info('Period To-Date Must be greater than From-Date');
      setDatevalidFlag(false);
    } else {
      setDatevalidFlag(true);
    }
  }, [periodFromDate, periodToDate]);

  const handleESelectorChange = (sn, cCodeT, buttonState, year) => {
    setSurveyNumberValue(sn);
    setCodeVillage(cCodeT);
    // console.log('year', year);
  };

  function handleChangeForSurveyNo(event) {
    setSurveyNumberValue(event.target.value);
    setPin(event.target.value);
    console.log(event.target.value, '----------------eeeeee');
    setForm2data('');
  }

  const showModalForEdit = (record) => {
    console.log('record', record);

    form2.resetFields();
    //setDataInModal({});
    setDataInModal({
      id: record.id,
      surveyHissaNo: record.surveyHissaNo,
      tenureName: record.tenureName,
      totalAreaH: record.totalAreaH,
      potkharabaType: record.potkharabaType,
      cultivableAreaInt: record.cultivableAreaInt,
      particularsOfAlteration: record.particularsOfAlteration,
      jirayatArea: record.jirayatArea,
      bagayatArea: record.bagayatArea,
      tariArea: record.tariArea,
      otherArea: record.otherArea,
      netCultiAreaH: record.netCultiAreaH,
      jirayatAssessment: record.jirayatAssessment,
      bagayatAssessment: record.bagayatAssessment,
      tariAssessment: record.tariAssessment,
      otherAssessment: record.otherAssessment,
      assessment: record.assessment,
      publicRightsOfWayAndEasements: record.publicRightsOfWayAndEasements,
      orderSanctioningChanges: record.orderSanctioningChanges,
      orderDate: record.orderDate,
      remarks: record.remarks,
    });

    setInputState(true);
    // console.log('Data in DataInModal state==>', record);
    setIsModalVisible(true);
    setOkText('Okay');
  };

  // const showModalForEdit = (record) => {
  //   // console.log('record==>', record);
  //   form2.resetFields();
  //   setDataInModal({});
  //   setDataInModal({
  //     id: record.id,
  //     pin: record.pin,
  //     hissaNo: record.hissaNo,
  //     cCode: codeVillage,
  //     part: record.part,
  //     purposeOfUse: record.purposeOfUse,
  //     authority: record.authority,
  //     natureAndTermsOfNaGrant: record.natureAndTermsOfNaGrant,
  //     remarks: record.remarks,
  //     occupanyPrice: record.occupanyPrice,
  //     periodFrom: record.periodFrom,
  //     periodTo: record.periodTo,
  //     entryNumberInTalukaForm2: record.entryNumberInTalukaForm2,
  //     nameOfFirstOccupant: record.nameOfFirstOccupant,
  //     authorityOrderNo: record.authorityOrderNo,
  //     authorityDate: record.authorityDate,
  //     particularsOfAlteration: record.particularsOfAlteration,
  //   });

  //   setInputState(false);
  //   // console.log('Data in DataInModal state==>', record);
  //   setIsModalVisible(true);
  //   setOkText('Save');
  //   setID(record.id);
  //   //  setSurveyNumberValue(record.pin);
  //   setHissaNoValue(record.hissaNo);
  // };

  const updateForm2 = (record) => {
    setConfirmLoading(true);
    //console.log(record, '-------------->preDataInModal');

    const a = record.surveyHissaNo.split('/');
    // console.log(a[0], '------------1');
    // console.log(a[1], '------------1');

    const parameterForEdit = {
      id: record.id,
      pin: a[0],
      hissaNo: a[1],
      cCode: codeVillage,
      surveyHissaNo: record.surveyHissaNo,
      tenureName: record.tenureName,
      totalAreaH: record.totalAreaH,
      potkharabaType: record.potkharabaType,
      cultivableAreaInt: record.cultivableAreaInt,
      jirayatArea: record.jirayatArea,
      bagayatArea: record.bagayatArea,
      tariArea: record.tariArea,
      otherArea: record.otherArea,
      particularsOfAlteration: record.particularsOfAlteration,
      netCultiAreaH: record.netCultiAreaH,
      jirayatAssessment: record.jirayatAssessment,
      bagayatAssessment: record.bagayatAssessment,
      tariAssessment: record.tariAssessment,
      otherAssessment: record.otherAssessment,
      assessment: record.assessment,
      publicRightsOfWayAndEasements: record.publicRightsOfWayAndEasements,
      orderSanctioningChanges: record.orderSanctioningChanges,
      orderDate: record.orderDate,
      remarks: record.remarks,
    };
    console.log('parameterfpr edit------>', parameterForEdit);
    console.log('parameterfpr edit------>1', okText);
    if (okText === 'Okay') {
      sendRequest(
        `${URLS.BaseURL}/form1Dyslr/editForm1DysrlAkarBand`,
        'PUT',
        parameterForEdit,
        (res) => {
          console.log(res, '----------------edit1');
          if (res.status === 200) {
            message.success('Data Updated!');
            //showForm2();
            setConfirmLoading(false);
            setIsModalVisible(false);
            //navigateToAdd();
            getTableData();
          } else {
            console.log('----------------edit1 error---1');
          }
          console.log('----------------edit1 error---2');
        },
        (err) => {
          console.log(err, '----------------edit1 error--3');
          message.error(err.message);
          setIsModalVisible(false);
          setConfirmLoading(false);
        },
      );
    }
    // } else if (okText === 'Okay') {
    //   setIsModalVisible(false);
    //   setConfirmLoading(false);
    // }
    setConfirmLoading(false);
  };

  const onCancelForDelete = () => {
    setModalForDelete(false);
  };

  const deleteForm2Record = (record) => {
    setRecordId(record.id);
    setModalForDelete(true);
  };

  //const deleteRecord = async (record) => {
  const deleteRecord = async () => {
    alert(recordId);
    setModalForDelete(false);
    //sendRequest(`${URLS.BaseURL}/form1Dyslr/discardForm2?id=${recordId}`, 'DELETE', null, (res) => {
    sendRequest(
      `${URLS.BaseURL}/form1Dyslr/discardForm1Dyslr?id=${recordId}`,
      'DELETE',
      null,
      (res) => {
        if (res.status === 226) {
          message.success('Record Deleted!');
          setForm2data([]);
          showForm2();
        }
      },
    );
  };

  function getTotalAreaAssess(totalAreaH, cultivableAreaInt, netCultiAreaH, assessment) {
    prevTotalArea += parseFloat(totalAreaH);
    prevTotalPotKharabArea += parseFloat(cultivableAreaInt);
    prevNetCultiArea += parseFloat(netCultiAreaH);

    prevAssessment += parseFloat(assessment);
  }

  const getTableData = async () => {
    (prevTotalArea = 0), (prevAssessment = 0), (prevNetCultiArea = 0), (prevTotalPotKharabArea = 0);
    setLoading(true);

    sendRequest(
      // `${URLS.BaseURL}/form1Dyslr/getFormDyslrSaveEntries?cCode=${codeVillage}`,
      `${URLS.BaseURL}/form1Dyslr/getForm1DyslrAkarband?cCode=${codeVillage}&pin=${pin}`,
      'GET',
      null,
      (r) => {
        let potkharabaTypeInt;
        let cultivableAreaInt;
        let naAgriAssesment;

        console.log('test for pot', r);

        setTableData(
          r.data.form1DyslrData.map((r) => ({
            id: r.id,
            surveyHissaNo:
              r.hissaNo == null || r.hissaNo.trim() == '' ? r.pin : r.pin + '/' + r.hissaNo,
            designation: r.designation,
            totalAreaH: r.totalAreaH,
            tenureName: r.tenureName,
            netCultiAreaH: r.netCultiAreaH,
            naAssessment: naAgriAssesment,
            assessment: r.assessment,
            publicRightsOfWayAndEasements: r.publicRightsOfWayAndEasements,
            particularsOfAlteration: r.particularsOfAlteration,
            orderSanctioningChanges: r.orderNo,
            orderDate: r.orderDate,
            remarks: r.remarks,
            potkharabaType: r.potkharabaType /*  getPotkharabaType(
              r.potkharabaAH ? r.potkharabaAH : '0.0000',
              r.potkharabaBH ? r.potkharabaBH : '0.0000',
            ), */,
            cultivableAreaInt: r.cultivableAreaInt,
            jirayatArea: r.jirayatArea,
            jirayatAssessment: r.jirayatAssessment,
            bagayatArea: r.bagayatArea,
            bagayatAssessment: r.bagayatAssessment,
            tariArea: r.tariArea,
            tariAssessment: r.tariAssessment,
            otherArea: r.otherArea,
            otherAssessment: r.otherAssessment,
            /*  getPotkharabaTypeAr(
              // r.potkharabaAH === '0.0000' ? '0' :
              r.potkharabaAH,
              // r.potkharabaBH === '0.0000' ? '0' :
              r.potkharabaBH,
            ), */
            naAgriAssesment:
              r.naAssessment != null || r.naAssessment > 0 ? r.naAssessment : r.assessment,
            allTotal: getTotalAreaAssess(
              r.totalAreaH,
              r.cultivableAreaInt,
              r.netCultiAreaH,
              r.assessment,
            ),
          })),
          message.success('Records Fetched!!'),
        );
        setLoading(false);
      },
      (err) => {
        setIsLoading(false);
        message.success(err.message);
      },
    );
    // console.log('potKharabArea', prevTotalPotKharabArea);
  };

  const handleCancelForModal = () => {
    setIsModalVisible(false);
    setIsLoading(false);
  };

  const handleOkForModal = () => {
    setIsModalVisible(false);
    setIsLoading(false);
  };

  console.info('dataInModal--->>', dataInModal);
  return (
    <>
      <PageContainer>
        <Card>
          <Row>
            <Col xl={22} lg={22} md={22} sm={20} xs={20}>
              <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
                {/* <FormattedMessage id="form2.table.label" /> */}
                <b> गाव नमुना एक Dyslr(आकारबंद दुरुस्ती) </b>
              </h2>
            </Col>
            <Col xl={2} lg={2} md={2} sm={4} xs={4}>
              {/* <Button type="primary" onClick={addForm}>
                <FormattedMessage id="formLanguage.button.add" />
              </Button> */}
            </Col>
          </Row>
          <VillageSelector
            pageType="withoutYear"
            setCodeVillage={setCodeVillage}
            setTextForVillage={setTextForVillage}
            onVillageChange={(setVillage, setForm2data)}
            yearChange={setRevenueYear}
            setIsNirank={setIsNirank}
          />
          <Row style={{ marginTop: '20px' }}>
            <Col xl={7} lg={7} md={7} sm={24} xs={24}>
              <Form.Item
                // labelCol={{ xl: 10, lg: 13 }}
                // wrapperCol={{ xl: 13, lg: 10, xs: 10 }}
                label={<FormattedMessage id="formLanguage.table.surveyNo" />}
                name="surveyNumber"
                rules={[{ required: true, message: 'Survey Number is Required' }]}
                // style={{ marginLeft: '9px' }}
              >
                <Input style={{ marginLeft: 5 }} maxLength={7} onChange={handleChangeForSurveyNo} />
              </Form.Item>
            </Col>

            <Col xl={1} lg={1} md={1} sm={1}></Col>
            <Col xl={2} lg={2} md={2} sm={2} xs={2}>
              {!isNirank && (
                <Button
                  onClick={() => {
                    if (textForVillage) {
                      // showForm2();
                      getTableData();
                    } else if (textForVillage == null) {
                      message.info('Please Select Village !');
                    }
                  }}
                  type="primary"
                >
                  <FormattedMessage id="formLanguage.button.search" />
                </Button>
              )}
            </Col>
            <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>
          </Row>
        </Card>
        <Alert
          message="टीप"
          description="ई-फेरफार प्रणालीतून (अकृषिक सातबारा ) दाखवलेल्या अकृषिक सातबारापैकी ज्या सातबारांच्या क्षेत्रात कृषिक व अकृषिक क्षेत्र एकत्र दाखवलेले आहेत अश्या साताबारांची नोंद येथे घेता येणार नाही.
                          तसेच सर्व अकृषिक सातबारा हे 'गावठाणाबाहेरील' दाखवलेले आहेत. (जर सातबारा गावठाणातील असेल तर त्या प्रमाणे भाग व भूप्रदानाचे स्वरूप निवडून 'गावठाण' प्रकारात समाविष्ट करा.)  "
          type="info"
          showIcon
        />
        {isNirank && (
          <>
            <Alert message="टीप" description="सदर गाव नमुना निरंक आहे." type="info" showIcon />
          </>
        )}
        <Card>
          {/* {!isNirank && ( */}
          <Table
            // columns={cols}
            loading={isLoading}
            // dataSource={form2data}
            dataSource={tableData}
            scroll={{ y: 350, x: 1900 }}
          >
            <Column
              title={<FormattedMessage id="form2.table.survey" />}
              dataIndex="surveyHissaNo"
              key="1"
            />

            <Column
              title={<FormattedMessage id="villageReport1.table.tenure" />}
              dataIndex="tenureName"
              key="2"
            />

            <Column
              title={<FormattedMessage id="villageReport1.table.totalArea" />}
              dataIndex="totalAreaH"
              key="3"
            />

            <ColumnGroup title={<FormattedMessage id="villageReport1.label.deductMessage" />}>
              <Column
                title={<FormattedMessage id="villageReport1.table.kind" />}
                dataIndex="potkharabaType"
                key="4"
              />
              <Column
                title={<FormattedMessage id="villageReport1.table.area" />}
                dataIndex="cultivableAreaInt"
                key="5"
              />
            </ColumnGroup>
            <ColumnGroup title={<FormattedMessage id="villageReport1.table.netCultivableArea" />}>
              <Column
                title={<FormattedMessage id="villageReport1.table.CultivatedArea" />}
                dataIndex="jirayatArea"
                key="6"
              />
              <Column
                title={<FormattedMessage id="villageReport1.table.HorticulatedArea" />}
                dataIndex="bagayatArea"
                key="7"
              />
              <Column
                title={<FormattedMessage id="villageReport1.table.TariArea" />}
                dataIndex="tariArea"
                key="8"
              />
              <Column
                title={<FormattedMessage id="villageReport1.table.OtherArea" />}
                dataIndex="otherArea"
                key="9"
              />
              <Column
                title={<FormattedMessage id="villageReport1.table.TotalArea" />}
                dataIndex="netCultiAreaH"
                key="10"
              />
            </ColumnGroup>
            <ColumnGroup title={<FormattedMessage id="villageReport1.table.naAssessment" />}>
              <Column
                title={<FormattedMessage id="villageReport1.table.CultivatedArea" />}
                dataIndex="jirayatAssessment"
                key="11"
              />
              <Column
                title={<FormattedMessage id="villageReport1.table.HorticulatedArea" />}
                dataIndex="bagayatAssessment"
                key="12"
              />
              <Column
                title={<FormattedMessage id="villageReport1.table.TariArea" />}
                dataIndex="tariAssessment"
                key="13"
              />
              <Column
                title={<FormattedMessage id="villageReport1.table.OtherArea" />}
                dataIndex="otherAssessment"
                key="14"
              />
              <Column
                title={<FormattedMessage id="villageReport1.table.TotalArea" />}
                dataIndex="assessment"
                key="15"
              />
            </ColumnGroup>
            <Column
              title={<FormattedMessage id="villageReport1.table.publicRights" />}
              dataIndex="publicRightsOfWayAndEasements"
              key="16"
            />
            <Column
              title={<FormattedMessage id="villageReport1.table.alteration" />}
              dataIndex="particularsOfAlteration"
              key="17"
            />
            <Column
              title={<FormattedMessage id="villageReport1.form.sanctioningChanges" />}
              dataIndex="orderSanctioningChanges"
              key="18"
            />
            <Column
              title={<FormattedMessage id="formLanguage.table.orderDate" />}
              dataIndex="orderDate"
              key="19"
            />
            <Column
              title={<FormattedMessage id="villageReport1.table.remark" />}
              dataIndex="remarks"
              key="20"
            />
            <Column
              title={<FormattedMessage id="formLanguage.table.action" />}
              key="21"
              fixed="right"
              width="120px"
              render={(record) => (
                <Space size="middle">
                  <Row>
                    {/* {record.id != null ? ( */}
                    <Col>
                      {/* <Button
                        onClick={() => deleteForm2Record(record)}
                        style={{ backgroundColor: '	#ff6347', color: 'black' }}
                      >
                        डीलिट करा
                      </Button>
                      <br />
                      <br /> */}

                      <Button
                        onClick={() => showModalForEdit(record)}
                        style={{ backgroundColor: 'lightgreen', color: 'black' }}
                      >
                        माहिती सुधारा
                      </Button>
                      <br />
                      <br />

                      {/* <Button
                          onClick={() => navigateToAdd()}
                          style={{ backgroundColor: 'lightblue', color: 'black' }}
                        >
                          माहिती भरा
                        </Button>
                      </Col>
                    ) : (
                      <Col>
                        <Button
                          onClick={() => navigateToAdd()}
                          style={{ backgroundColor: 'lightblue', color: 'black' }}
                        >
                          माहिती भरा
                        </Button>
                      </Col>
                    )} */}
                    </Col>
                  </Row>
                </Space>
              )}
            />
          </Table>
          {/* )} */}
        </Card>
        <Modal
          // visible={}
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
          //okText={okText}
          okText="Update"
          onCancel={handleCancelForModal}
          onOk={() => {
            //updateForm2(dataInModal);
            if (datevalidFlag != null) {
              updateForm2(dataInModal);
            }
            // } else if (
            //   new Date(periodFromDate) > new Date(periodToDate) ||
            //   new Date(periodToDate) < new Date(periodFromDate)
            // ) {
            else {
              message.error('Please fill the data');
            }
          }}
          confirmLoading={confirmLoading}
        >
          <Card>
            <Form
              layout="vertical"
              form={form2}
              // onFinish={onFormFinish}
              // onFinishFailed={onFinishFailed} */
            >
              {/* <Row gutter={20}> */}
              <Col xl={8} lg={8} md={8} sm={24} xs={24}>
                <Form.Item
                  name={'surveyHissaNo'}
                  rules={[{ required: true, message: 'This Field Is Required..' }]}
                  label={<FormattedMessage id="सर्वे/गट क्रमांक" />}
                >
                  <Input
                    disabled={inputState}
                    defaultValue={dataInModal && dataInModal.surveyHissaNo}
                    onChange={(e) => {
                      setDataInModal((preDataInModal) => ({
                        ...preDataInModal,
                        surveyHissaNo: e.target.value,
                      }));
                    }}
                  />
                </Form.Item>
              </Col>
              {/* <Col xl={1} lg={1} md={1}></Col> */}
              <Col xl={8} lg={8} md={8} sm={24} xs={24}>
                <Form.Item
                  name="tenureName"
                  rules={[{ required: true, message: 'This Field Is Required..' }]}
                  label={<FormattedMessage id="धारणा प्रकार" />}
                >
                  {/* <Input
                    //disabled={inputState}
                    defaultValue={dataInModal && dataInModal.tenureName}
                    onChange={(e) => {
                      setDataInModal((preDataInModal) => ({
                        ...preDataInModal,
                        tenureName: e.target.value,
                      }));
                    }}
                  /> */}

                  <Select
                    defaultValue={dataInModal && dataInModal.tenureName}
                    onChange={(e) => {
                      setDataInModal((preDataInModal) => ({
                        ...preDataInModal,
                        tenureName: e,
                      }));
                    }}
                  >
                    <Select.Option value={'भोगवटादार वर्ग -1'}>भोगवटादार वर्ग -1</Select.Option>
                    <Select.Option value={'भोगवटादार वर्ग - 2'}>भोगवटादार वर्ग - 2</Select.Option>
                    <Select.Option value={'सरकारी पट्टेदार'}>सरकारी पट्टेदार</Select.Option>
                    <Select.Option value={'सरकार'}>सरकार</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              {/* <Col xl={1} lg={1} md={1}></Col> */}
              <Col xl={8} lg={8} md={8} sm={24} xs={24}>
                <Form.Item
                  name="totalAreaH"
                  rules={[{ required: true, message: 'This Field Is Required..' }]}
                  label={
                    <FormattedMessage id="वजा-लागवड अयोग्य बिनआकारी किंवा लागवडीसाठी अनुपलब्ध-प्रकार" />
                  }
                >
                  <Input
                    //disabled={inputState}
                    defaultValue={dataInModal && dataInModal.totalAreaH}
                    onChange={(e) => {
                      setDataInModal((preDataInModal) => ({
                        ...preDataInModal,
                        totalAreaH: e.target.value,
                      }));
                    }}
                  />
                </Form.Item>
              </Col>
              <Col xl={8} lg={8} md={8} sm={24} xs={24}>
                <Form.Item
                  name="potkharabaType"
                  rules={[{ required: true, message: 'This Field Is Required..' }]}
                  label={
                    <FormattedMessage id="वजा-लागवड अयोग्य बिनआकारी किंवा लागवडीसाठी अनुपलब्ध-क्षेत्र" />
                  }
                >
                  {/* <Input
                    //disabled={inputState}
                    defaultValue={dataInModal && dataInModal.potkharabaType}
                    onChange={(e) => {
                      setDataInModal((preDataInModal) => ({
                        ...preDataInModal,
                        potkharabaType: e.target.value,
                      }));
                    }}
                  /> */}

                  <Select
                    defaultValue={dataInModal && dataInModal.potkharabaType}
                    // onKeyPress={KeyPressEvents.isInputVarchar}
                    maxLength={501}
                    onChange={(e) => {
                      setDataInModal((preDataInModal) => ({
                        ...preDataInModal,
                        potkharabaType: e,
                      }));
                    }}
                  >
                    <Select.Option value={'अ'}>अ</Select.Option>
                    <Select.Option value={'ब'}>ब</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xl={8} lg={8} md={8} sm={24} xs={24}>
                <Form.Item
                  name="cultivableAreaInt"
                  rules={[{ required: true, message: 'This Field Is Required..' }]}
                  label={
                    <FormattedMessage id="वजा-लागवड (पोटखराबा) अयोग्य बिनआकारी किंवा लागवडीसाठी अनुपलब्ध-प्रकार" />
                  }
                >
                  <Input
                    //disabled={inputState}
                    defaultValue={dataInModal && dataInModal.cultivableAreaInt}
                    onChange={(e) => {
                      setDataInModal((preDataInModal) => ({
                        ...preDataInModal,
                        cultivableAreaInt: e.target.value,
                      }));
                    }}
                  />
                </Form.Item>
              </Col>

              {/* <Row gutter={20}> */}
              {/* <ColumnGroup title={<FormattedMessage id="villageReport1.label.deductMessage" />}>
                <Col xl={8} lg={8} md={8} sm={24} xs={24}>
                  <Form.Item
                    name={'potkharabaType'}
                    rules={[{ required: true, message: 'This Field Is Required..' }]}
                    label={<FormattedMessage id="villageReport1.table.kind" />}
                  >
                    <Input
                      //disabled={inputState}
                      defaultValue={dataInModal && dataInModal.potkharabaType}
                      onChange={(e) => {
                        setDataInModal((preDataInModal) => ({
                          ...preDataInModal,
                          potkharabaType: e.target.value,
                        }));
                      }}
                    />
                  </Form.Item>
                </Col>

                <Col xl={8} lg={8} md={8} sm={24} xs={24}>
                  <Form.Item
                    name="cultivableAreaInt"
                    rules={[{ message: 'This Field Is Required..' }]}
                    label={<FormattedMessage id="villageReport1.table.area" />}
                  >
                    <Input
                      //disabled={inputState}
                      defaultValue={dataInModal && dataInModal.cultivableAreaInt}
                      onChange={(e) => {
                        setDataInModal((preDataInModal) => ({
                          ...preDataInModal,
                          cultivableAreaInt: e.target.value,
                        }));
                      }}
                    />
                  </Form.Item>
                </Col>
              </ColumnGroup> */}
              {/* </Row> */}

              {/* Title: क्षेत्र,आकारणी */}

              <Row>
                <Col xl={8} lg={8} md={8} sm={24} xs={24}>
                  <Form.Item label="क्षेत्र" style={{ paddingLeft: '93px' }} />
                </Col>
                <Col xl={8} lg={8} md={8} sm={24} xs={24}>
                  <Form.Item label="आकारणी" style={{ paddingLeft: '93px' }} />
                </Col>
              </Row>
              {/* जिरायत क्षेत्र */}
              <Row gutter={20}>
                <Col xl={8} lg={8} md={8} sm={24} xs={24}>
                  <Form.Item
                    name="jirayatArea"
                    rules={[{ required: true, message: 'This Field Is Required..' }]}
                    label={<FormattedMessage id="villageReport1.table.CultivatedArea" />}
                  >
                    <Input
                      // disabled={inputState}
                      defaultValue={dataInModal && dataInModal.jirayatArea}
                      onChange={(e) => {
                        setDataInModal((preDataInModal) => ({
                          ...preDataInModal,
                          jirayatArea: e.target.value,
                        }));
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col xl={8} lg={8} md={8} sm={24} xs={24}>
                  <Form.Item
                    name="jirayatAssessment"
                    rules={[{ message: 'This Field Is Required..' }]}
                    label={<FormattedMessage id="जिरायत" />}
                  >
                    <Input
                      //disabled={inputState}
                      defaultValue={dataInModal && dataInModal.jirayatAssessment}
                      onChange={(e) => {
                        setDataInModal((preDataInModal) => ({
                          ...preDataInModal,
                          jirayatAssessment: e.target.value,
                        }));
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>
              {/* बागायत क्षेत्र */}
              <Row gutter={20}>
                <Col xl={8} lg={8} md={8} sm={24} xs={24}>
                  <Form.Item
                    name={'bagayatArea'}
                    rules={[{ required: true, message: 'This Field Is Required..' }]}
                    label={<FormattedMessage id="villageReport1.table.HorticulatedArea" />}
                  >
                    <Input
                      // disabled={inputState}
                      defaultValue={dataInModal && dataInModal.bagayatArea}
                      onChange={(e) => {
                        setDataInModal((preDataInModal) => ({
                          ...preDataInModal,
                          bagayatArea: e.target.value,
                        }));
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col xl={8} lg={8} md={8} sm={24} xs={24}>
                  <Form.Item
                    name="bagayatAssessment"
                    rules={[{ message: 'This Field Is Required..' }]}
                    label={<FormattedMessage id="बागायत" />}
                  >
                    <Input
                      //disabled={inputState}
                      defaultValue={dataInModal && dataInModal.bagayatAssessment}
                      onChange={(e) => {
                        setDataInModal((preDataInModal) => ({
                          ...preDataInModal,
                          bagayatAssessment: e.target.value,
                        }));
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>
              {/* तरी क्षेत्र */}
              <Row gutter={20}>
                <Col xl={8} lg={8} md={8} sm={24} xs={24}>
                  <Form.Item
                    name="tariArea"
                    rules={[{ required: true, message: 'This Field Is Required..' }]}
                    label={<FormattedMessage id="villageReport1.table.TariArea" />}
                  >
                    <Input
                      //disabled={inputState}
                      defaultValue={dataInModal && dataInModal.tariArea}
                      onChange={(e) => {
                        setDataInModal((preDataInModal) => ({
                          ...preDataInModal,
                          tariArea: e.target.value,
                        }));
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col xl={8} lg={8} md={8} sm={24} xs={24}>
                  <Form.Item
                    name={'tariAssessment'}
                    rules={[{ message: 'This Field Is Required..' }]}
                    label={<FormattedMessage id="तरी" />}
                  >
                    <Input
                      // disabled={inputState}
                      defaultValue={dataInModal && dataInModal.tariAssessment}
                      onChange={(e) => {
                        setDataInModal((preDataInModal) => ({
                          ...preDataInModal,
                          tariAssessment: e.target.value,
                        }));
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>
              {/* इतर क्षेत्र */}
              <Row gutter={20}>
                <Col xl={8} lg={8} md={8} sm={24} xs={24}>
                  <Form.Item
                    name="otherArea"
                    rules={[{ required: true, message: 'This Field Is Required..' }]}
                    label={<FormattedMessage id="villageReport1.table.OtherArea" />}
                  >
                    <Input
                      //disabled={inputState}
                      defaultValue={dataInModal && dataInModal.otherArea}
                      onChange={(e) => {
                        setDataInModal((preDataInModal) => ({
                          ...preDataInModal,
                          otherArea: e.target.value,
                        }));
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col xl={8} lg={8} md={8} sm={24} xs={24}>
                  <Form.Item
                    name="otherAssessment"
                    rules={[{ message: 'This Field Is Required..' }]}
                    label={<FormattedMessage id="इतर" />}
                  >
                    <Input
                      //disabled={inputState}
                      defaultValue={dataInModal && dataInModal.otherAssessment}
                      onChange={(e) => {
                        setDataInModal((preDataInModal) => ({
                          ...preDataInModal,
                          otherAssessment: e.target.value,
                        }));
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>
              {/* एकूण */}
              <Row gutter={20}>
                <Col xl={8} lg={8} md={8} sm={24} xs={24}>
                  <Form.Item
                    name={'netCultiAreaH'}
                    rules={[
                      { required: true, required: true, message: 'This Field Is Required..' },
                    ]}
                    label={<FormattedMessage id="निव्वळ लागवड योग्य क्षेत्र" />}
                  >
                    <Input
                      //disabled={inputState}
                      defaultValue={dataInModal && dataInModal.netCultiAreaH}
                      onChange={(e) => {
                        setDataInModal((preDataInModal) => ({
                          ...preDataInModal,
                          netCultiAreaH: e.target.value,
                        }));
                      }}
                    />
                  </Form.Item>
                </Col>

                <Col xl={8} lg={8} md={8} sm={24} xs={24}>
                  <Form.Item
                    name="assessment"
                    rules={[{ message: 'This Field Is Required..' }]}
                    label={<FormattedMessage id="कृषिक आकारणी" />}
                  >
                    <Input
                      //disabled={inputState}
                      defaultValue={dataInModal && dataInModal.assessment}
                      onChange={(e) => {
                        setDataInModal((preDataInModal) => ({
                          ...preDataInModal,
                          assessment: e.target.value,
                        }));
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <br />
              <br />
              <Row gutter={20}>
                <Col xl={8} lg={8} md={8} sm={24} xs={24}>
                  <Form.Item
                    name={'publicRightsOfWayAndEasements'}
                    rules={[{ required: true, message: 'This Field Is Required..' }]}
                    label={<FormattedMessage id="villageReport1.table.publicRights" />}
                  >
                    <Input
                      // disabled={inputState}
                      defaultValue={dataInModal && dataInModal.publicRightsOfWayAndEasements}
                      onChange={(e) => {
                        setDataInModal((preDataInModal) => ({
                          ...preDataInModal,
                          publicRightsOfWayAndEasements: e.target.value,
                        }));
                      }}
                    />
                  </Form.Item>
                </Col>

                <Col xl={8} lg={8} md={8} sm={24} xs={24}>
                  <Form.Item
                    name="particularsOfAlteration"
                    rules={[{ message: 'This Field Is Required..' }]}
                    label={<FormattedMessage id="villageReport1.table.alteration" />}
                  >
                    <Input
                      // disabled={inputState}
                      defaultValue={dataInModal && dataInModal.particularsOfAlteration}
                      onChange={(e) => {
                        setDataInModal((preDataInModal) => ({
                          ...preDataInModal,
                          particularsOfAlteration: e.target.value,
                        }));
                      }}
                    />
                  </Form.Item>
                </Col>

                <Col xl={8} lg={8} md={8} sm={24} xs={24}>
                  <Form.Item
                    name="orderSanctioningChanges"
                    rules={[{ message: 'This Field Is Required..' }]}
                    label={<FormattedMessage id="villageReport1.form.sanctioningChanges" />}
                  >
                    <Input
                      //disabled={inputState}
                      defaultValue={dataInModal && dataInModal.orderSanctioningChanges}
                      onChange={(e) => {
                        setDataInModal((preDataInModal) => ({
                          ...preDataInModal,
                          orderSanctioningChanges: e.target.value,
                        }));
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={20}>
                <Col xl={8} lg={8} md={8} sm={24} xs={24}>
                  <Form.Item
                    name={'orderDate'}
                    rules={[{ required: true, message: 'This Field Is Required..' }]}
                    label={<FormattedMessage id="formLanguage.table.orderDate" />}
                  >
                    <Input
                      //disabled={inputState}
                      type="date"
                      defaultValue={dataInModal && dataInModal.orderDate}
                      onChange={(e) => {
                        setDataInModal((preDataInModal) => ({
                          ...preDataInModal,
                          orderDate: e.target.value,
                        }));
                      }}
                    />
                  </Form.Item>
                </Col>

                <Col xl={8} lg={8} md={8} sm={24} xs={24}>
                  <Form.Item
                    name="remarks"
                    rules={[{ message: 'This Field Is Required..' }]}
                    label={<FormattedMessage id="villageReport1.table.remark" />}
                  >
                    <Input
                      //disabled={inputState}
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

                <Col xl={8} lg={8} md={8} sm={24} xs={24}></Col>
              </Row>
            </Form>
          </Card>
        </Modal>
      </PageContainer>
    </>
  );
};

export default TableFormAkarbandChanges;
