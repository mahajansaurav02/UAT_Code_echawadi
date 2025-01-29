import VillageSelector from '@/components/eComponents/VillageSelector';
import {
  Box,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  TextField,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { Col, Input, Row, Form, message, Modal, DatePicker, Select, Table, Button } from 'antd';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { FormattedMessage, useModel } from 'umi';
import KeyPressEvents from '@/util/KeyPressEvents';
import URLS from '@/URLs/urls';
import useAxios from '@/components/eComponents/use-axios';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import ValidationPatterns from '@/components/eComponents/ValidationPatterns';

function dysclrForm() {
  const { districtName, servarthId, districtCode, talukaCode } = useModel('details');
  const [codeVillage, setCodeVillage] = useState('');
  const [textVillage, setTextVillage] = useState('');
  const [textForVillage, setTextForVillage] = useState();
  const [village, setVillage] = useState([]);
  const [revenueYear, setRevenueYear] = useState();
  const [isNirank, setIsNirank] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [modalForDelete, setModalForDelete] = useState(false);
  const [recordId, setRecordId] = useState();
  const [surveyNumberValue, setSurveyNumberValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [potkharabaType, setPotkharabaType] = useState('');
  const [dysclrForm1, setDysclrForm1] = useState([]);
  const [form1] = Form.useForm();
  const [dataInModal, setDataInModal] = useState();
  const [orderDate, setOrderDate] = useState();
  const [dataInModalUpdate, setDataInModalUpdate] = useState();
  const [designationDyslr, setDesignationDyslr] = useState();
  const [inputState, setInputState] = useState();
  const [okText, setOkText] = useState();
  const [ID, setID] = useState();
  const [pin, setPin] = useState();
  const [hissa, setHissa] = useState();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [totalAssesmentValue, setTotalAssesmentValue] = useState(null);

  const { sendRequest } = useAxios();

  let history = useHistory();

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    overflowY: 'scroll',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  };

  function handleChangeForSurveyNo(event) {
    setSurveyNumberValue(event.target.value);
    // setVillageForm1('');
    // setButtonFlag(false);
  }

  const onCancelForDeleteModal = () => {
    setModalForDelete(false);
  };

  const handleClose = () => {
    setIsModalVisible(false);
    setIsUpdateModalVisible(false);
  };

  // const deleteDysclrFormById = async () => {
  //   setModalForDelete(false);
  //   // console.log('id in state', recordId);
  //   sendRequest(
  //     `${URLS.BaseURL}/form1Dyslr/discardForm1Dyslr?id=${recordId}`,
  //     'DELETE',
  //     null,
  //     (res) => {
  //       if (res.status === 226) {
  //         message.success('Record Deleted !');
  //         setDysclrForm1([]);
  //         getDysclrForm1Data();
  //       }
  //     },
  //     (errorCallback) => {
  //       // console.log('errorCallback', errorCallback);
  //     },
  //   );
  // };

  // useEffect(() => {
  //   setTotalAssesmentValue(
  //     parseInt(
  //       dataInModalUpdate?.jirayatAssessment != null ? dataInModalUpdate?.jirayatAssessment : 0,
  //     ) +
  //       parseInt(
  //         dataInModalUpdate?.bagayatAssessment != null ? dataInModalUpdate?.bagayatAssessment : 0,
  //       ) +
  //       parseInt(
  //         dataInModalUpdate?.tariAssessment != null ? dataInModalUpdate?.tariAssessment : 0,
  //       ) +
  //       parseInt(
  //         dataInModalUpdate?.otherAssessment != null ? dataInModalUpdate?.otherAssessment : 0,
  //       ),
  //   );
  //   form1.setFieldsValue({
  //     totalAssessment: totalAssesmentValue,
  //   });
  // }, [dataInModalUpdate, totalAssesmentValue]);

  const deleteDysclrFormById = async () => {
    setModalForDelete(false);
    setIsUpdateModalVisible(false);

    const parameterForDelete = {
      id: ID,
      pin: dataInModalUpdate && dataInModalUpdate.pin,
      hissaNo: dataInModalUpdate && dataInModalUpdate.hissaNo,
      cCode: codeVillage,
      districtCode: districtCode,
      talukaCode: talukaCode,
      surveyNo: dataInModalUpdate && dataInModalUpdate.surveyNumber,
      tenureName: dataInModalUpdate && dataInModalUpdate.tenureName,
      totalAreaH: dataInModalUpdate && dataInModalUpdate.totalAreaH,
      potkharabaType: dataInModalUpdate && dataInModalUpdate.potkharabaType,
      cultivableAreaInt: dataInModalUpdate && dataInModalUpdate.cultivableAreaInt,
      netCultiAreaH: dataInModalUpdate && dataInModalUpdate.netCultiAreaH,
      assessment: dataInModalUpdate && dataInModalUpdate.assessment,
      publicRightsOfWayAndEasements:
        dataInModalUpdate && dataInModalUpdate.publicRightsOfWayAndEasements,
      particularsOfAlteration: dataInModalUpdate && dataInModalUpdate.particularsOfAlteration,

      orderNo: dataInModalUpdate && dataInModalUpdate.orderNo,
      orderDate: dataInModalUpdate && dataInModalUpdate.orderDate,
      designation: dataInModalUpdate && dataInModalUpdate.designation,
      remarks: dataInModalUpdate && dataInModalUpdate.remarks,
      jirayatArea: dataInModalUpdate.jirayatArea ? dataInModalUpdate.jirayatArea : '',
      jirayatAssessment: dataInModalUpdate.jirayatAssessment
        ? dataInModalUpdate.jirayatAssessment
        : '',
      bagayatArea: dataInModalUpdate.bagayatArea ? dataInModalUpdate.bagayatArea : '',
      bagayatAssessment: dataInModalUpdate.bagayatAssessment
        ? dataInModalUpdate.bagayatAssessment
        : '',
      tariArea: dataInModalUpdate.tariArea ? dataInModalUpdate.tariArea : '',
      tariAssessment: dataInModalUpdate.tariAssessment ? dataInModalUpdate.tariAssessment : '',
      otherArea: dataInModalUpdate.otherArea ? dataInModalUpdate.otherArea : '',
      otherAssessment: dataInModalUpdate.otherAssessment ? dataInModalUpdate.otherAssessment : '',
    };

    // console.log('dataInModal in state', surveyNumber);
    sendRequest(
      `${URLS.BaseURL}/form1Dyslr/discardForm1Dyslr`,
      'POST',
      parameterForDelete,
      // null,
      (res) => {
        if (res.status === 226) {
          message.success('Record Deleted !');
          setDysclrForm1([]);
          getDysclrForm1Data();
        }
      },
      (errorCallback) => {
        // console.log('errorCallback', errorCallback);
      },
    );
  };

  const deleteRecord = (record) => {
    setRecordId(record.id);
    setModalForDelete(true);
  };

  const showModalForUpdate = (record) => {
    form1.resetFields();
    setDataInModalUpdate({});
    setDataInModalUpdate({
      id: record.id,
      cCode: codeVillage,
      pin: record.pin,
      hissaNo: record.hissaNo,
      surveyNumber: record.surveyNumber,
      tenureName: record.tenureName,
      totalAreaH: record.totalAreaH,
      potkharabaType: record.potkharabaType,
      cultivableAreaInt: record.cultivableAreaInt,
      netCultiAreaH: record.netCultiAreaH,
      assessment: record.assessment,

      publicRightsOfWayAndEasements: record.publicRightsOfWayAndEasements,
      particularsOfAlteration: record.particularsOfAlteration,
      orderNo: record.orderNo,
      orderDate: record.orderDate,
      designation: record.designation,
      remarks: record.remarks,
      jirayatArea: record.jirayatArea,
      jirayatAssessment: record.jirayatAssessment,
      bagayatArea: record.bagayatArea,
      bagayatAssessment: record.bagayatAssessment,
      tariArea: record.tariArea,
      tariAssessment: record.tariAssessment,
      otherArea: record.otherArea,
      otherAssessment: record.otherAssessment,
      // totalArea: record.totalArea,
      // totalAssessment: record.totalAssessment,
    });
    setInputState(true);
    setIsUpdateModalVisible(true);
    setOkText('Save');
    setID(record.id);
  };

  const updateDysclrForm = async () => {
    setConfirmLoading(true);

    let orderDateI =
      form1.getFieldValue('orderDateDs') && form1.getFieldValue('orderDateDs') !== 'Invalid date'
        ? moment(form1.getFieldValue('orderDateDs'), 'DD/MM/YYYY').format('YYYY-MM-DD')
        : null;

    if (!orderDateI) {
      if (dataInModalUpdate.orderDate && dataInModalUpdate.orderDate !== 'Invalid date') {
        orderDateI = moment(dataInModalUpdate.orderDate).format('YYYY-MM-DD');
      }
    }

    const parameterForEdit = {
      id: ID,
      pin: dataInModalUpdate.pin,
      hissaNo: dataInModalUpdate.hissaNo,
      cCode: codeVillage,
      districtCode: districtCode,
      talukaCode: talukaCode,
      surveyNo: /* form1.getFieldValue('surveyNoDyslr') */ dataInModalUpdate.surveyNumber,
      tenureName: /* form1.getFieldValue('tenureDyslr') */ dataInModalUpdate.tenureName,
      totalAreaH: dataInModalUpdate.totalAreaH,
      potkharabaType: dataInModalUpdate.potkharabaType,
      cultivableAreaInt: dataInModalUpdate.cultivableAreaInt,
      netCultiAreaH: dataInModalUpdate.netCultiAreaH,
      assessment: dataInModalUpdate.assessment,
      publicRightsOfWayAndEasements: dataInModalUpdate.publicRightsOfWayAndEasements,
      particularsOfAlteration: dataInModalUpdate.particularsOfAlteration,
      orderNo: dataInModalUpdate.orderNo,
      orderDate: orderDateI,
      designation: dataInModalUpdate.designation,
      remarks: dataInModalUpdate.remarks,
      jirayatArea: dataInModalUpdate.jirayatArea ? dataInModalUpdate.jirayatArea : '',
      jirayatAssessment: dataInModalUpdate.jirayatAssessment
        ? dataInModalUpdate.jirayatAssessment
        : '',
      bagayatArea: dataInModalUpdate.bagayatArea ? dataInModalUpdate.bagayatArea : '',
      bagayatAssessment: dataInModalUpdate.bagayatAssessment
        ? dataInModalUpdate.bagayatAssessment
        : '',
      tariArea: dataInModalUpdate.tariArea ? dataInModalUpdate.tariArea : '',
      tariAssessment: dataInModalUpdate.tariAssessment ? dataInModalUpdate.tariAssessment : '',
      otherArea: dataInModalUpdate.otherArea ? dataInModalUpdate.otherArea : '',
      otherAssessment: dataInModalUpdate.otherAssessment ? dataInModalUpdate.otherAssessment : '',
      // totalArea: dataInModalUpdate.totalArea ? dataInModalUpdate.totalArea : '',
      // totalAssessment: /* totalAssesmentValue */ dataInModalUpdate.totalArea
      //   ? dataInModalUpdate.totalArea
      //   : '',
    };
    // console.log('parameterForEdit', parameterForEdit);
    if (okText === 'Save') {
      sendRequest(
        `${URLS.BaseURL}/form1Dyslr/editForm1Dyslr`,
        'POST',
        parameterForEdit,
        (res) => {
          if (res.status === 200) {
            message.success('Data Updated!');
            getDysclrForm1Data();
            setIsUpdateModalVisible(false);
            setConfirmLoading(false);
          }
        },
        (err) => {
          setConfirmLoading(false);
        },
      );
    } else if (okText === 'Okay') {
      setIsUpdateModalVisible(false);
      setConfirmLoading(false);
    }
  };

  const showModalForEdit = (record) => {
    form1.resetFields();
    setDataInModal({});
    setDataInModal({
      id: record.id,
      cCode: codeVillage,
      pin: record.pin,
      hissaNo: record.hissaNo,
      surveyNumber: record.surveyNumber,
      tenureName: record.tenureName,
      totalAreaH: record.totalAreaH,
      potkharabaType: record.potkharabaType,
      cultivableAreaInt: record.cultivableAreaInt,
      netCultiAreaH: record.netCultiAreaH,
      assessment: record.assessment,

      publicRightsOfWayAndEasements: record.publicRightsOfWayAndEasements,
      particularsOfAlteration: record.particularsOfAlteration,
      orderNo: record.orderNo,
      orderDate: record.orderDate,
      designation: record.designation,
      remarks: record.remarks,
    });
    setInputState(false);
    setIsModalVisible(true);
    setOkText('Save');
    setID(record.id);
  };

  const editDysclrForm = async () => {
    setConfirmLoading(true);

    let orderDateI =
      form1.getFieldValue('orderDate') && form1.getFieldValue('orderDate') !== 'Invalid date'
        ? moment(form1.getFieldValue('orderDate'), 'DD/MM/YYYY').format('YYYY-MM-DD')
        : null;

    if (!orderDateI) {
      if (dataInModal.orderDate && dataInModal.orderDate !== 'Invalid date') {
        orderDateI = moment(dataInModal.orderDate).format('YYYY-MM-DD');
      }
    }

    const parameterForEdit = {
      id: ID,
      pin: dataInModal.pin,
      hissaNo: dataInModal.hissaNo,
      cCode: codeVillage,
      districtCode: districtCode,
      talukaCode: talukaCode,
      surveyNumber: dataInModal.surveyNumber,
      tenureName: dataInModal.tenureName,
      totalAreaH: dataInModal.totalAreaH,
      potkharabaType: dataInModal.potkharabaType,
      cultivableAreaInt: dataInModal.cultivableAreaInt,
      netCultiAreaH: dataInModal.netCultiAreaH,
      assessment: dataInModal.assessment,

      publicRightsOfWayAndEasements: dataInModal.publicRightsOfWayAndEasements,
      particularsOfAlteration: dataInModal.particularsOfAlteration,
      orderNo: dataInModal.orderNo,
      orderDate: dataInModal.orderDate,
      designation: dataInModal.designation,
      remarks: dataInModal.remarks,
    };
    // console.log('parameterForEdit', parameterForEdit);
    if (okText === 'Save') {
      sendRequest(
        `${URLS.BaseURL}/form1Dyslr/editForm1Dyslr`,
        'POST',
        parameterForEdit,
        (res) => {
          if (res.status === 200) {
            message.success('Data Updated!');
            getDysclrForm1Data();
            setIsModalVisible(false);
            setConfirmLoading(false);
          }
        },
        (err) => {
          setConfirmLoading(false);
        },
      );
    } else if (okText === 'Okay') {
      setIsModalVisible(false);
      setConfirmLoading(false);
    }
  };

  const getDysclrForm1Data = async () => {
    setIsLoading(true);

    sendRequest(
      `${
        URLS.BaseURL
      }/form1Dyslr/getForm1DyslrReport?districtCode=${districtCode}&talukaCode=${talukaCode}&cCode=${codeVillage.trim()}`,
      'GET',
      null,
      (res) => {
        let potkharabaTypeInt;
        let cultivableAreaInt;
        let naAgriAssesment;
        // console.log('test-->', res.data.form1Data);

        res.data.form1Data.map((r) => {
          if (r.naAssessment != null && r.naAssessment > 0) {
            naAgriAssesment = r.naAssessment;
          } else {
            naAgriAssesment = r.assessment;
          }

          if (r.potkharabaBH == '0.0000') {
            setPotkharabaType('अ');
            potkharabaTypeInt = 'अ';
            cultivableAreaInt = r.potkharabaAH;
          } else {
            setPotkharabaType('ब');
            potkharabaTypeInt = 'ब';
            cultivableAreaInt = r.potkharabaBH;
          }
        });
        // console.log('test for pot', cultivableAreaInt, 'type', potkharabaTypeInt);
        setDysclrForm1(
          res.data.form1Data.map((row, index) => ({
            srNo: index + 1,
            id: row.id,
            surveyNumber:
              row.hissaNo == null || row.hissaNo.trim() == ''
                ? row.pin
                : row.pin + '/' + row.hissaNo,
            hissaNo: row.hissaNo,
            pin: row.pin,
            tenureName: row.tenureName,
            totalAreaH: row.totalAreaH
              .substring(0, row.totalAreaH.length - 2)
              .concat('.')
              .concat(row.totalAreaH.substring(row.totalAreaH.length - 2)),
            netCultiAreaH: row.netCultiAreaH
              .substring(0, row.netCultiAreaH.length - 2)
              .concat('.')
              .concat(row.netCultiAreaH.substring(row.netCultiAreaH.length - 2)),
            agricultureAssessment: naAgriAssesment,
            publicRightsOfWayAndEasements: row.publicRightsOfWayAndEasements,
            particularsOfAlteration: row.particularsOfAlteration,
            remarks: row.remarks,
            orderNo: row.orderNo,
            orderDate:
              row.orderDate != null
                ? moment(row.orderDate, 'YYYY-MM-DD').format('YYYY-MM-DD')
                : null,
            designation: row.designation,
            assessment: row.assessment,
            potkharabaAH: row.potkharabaAH,
            potkharabaBH: row.potkharabaBH,
            potkharabaType: row.potkharabaBH == '0.0000' ? 'अ' : 'ब',
            cultivableAreaInt: row.potkharabaBH == '0.0000' ? row.potkharabaAH : row.potkharabaBH,
            naAgriAssesment:
              row.naAssessment != null || row.naAssessment > 0 ? row.naAssessment : row.assessment,
          })),
        );
        if (res.console === 404) {
          message.error('Form Details Not Found');
        } else {
          message.success('Records Fetched!');
        }
        setIsLoading(false);
      },
      (err) => {
        setIsLoading(false);
      },
    );
  };

  const columns = [
    {
      key: '1',
      dataIndex: 'surveyNumber',
      title: <FormattedMessage id="formLanguage.table.surveyNo" />,
      // width: 150,
    },

    {
      key: '2',
      dataIndex: 'tenureName',
      title: <FormattedMessage id="villageForm1.table.tenure" />,
      // width: 150,
    },

    {
      key: '3',
      dataIndex: 'totalAreaH',
      title: <FormattedMessage id="formLanguage.table.totalArea" />,
      // width: 130,

      //   valueFormatter: (params) => moment(params.value).format('DD/MM/YYYY'),
    },

    {
      key: '4',
      dataIndex: 'potkharabaType',
      title: <FormattedMessage id="formLanguage.table.kind" />,
      // width: 410,
    },

    {
      key: '5',
      dataIndex: 'cultivableAreaInt',
      title: <FormattedMessage id="formLanguage.table.area" />,
      // width: 380,
    },

    {
      key: '6',
      dataIndex: 'netCultiAreaH',
      title: <FormattedMessage id="formLanguage.table.netCultivableArea" />,
      // width: 180,
    },

    {
      key: '7',
      dataIndex: 'assessment',
      title: <FormattedMessage id="formLanguage.table.naAssessment" />,
      // width: 180,
    },

    {
      key: '8',
      dataIndex: 'publicRightsOfWayAndEasements',
      title: <FormattedMessage id="formLanguage.table.publicRights" />,
      // width: 280,
    },

    {
      key: '9',
      dataIndex: 'particularsOfAlteration',
      title: <FormattedMessage id="formLanguage.table.alteration" />,
      // width: 180,
    },

    {
      key: '10',
      // dataIndex: 'designation',
      title: <FormattedMessage id="formLanguage.table.designation" />,
      // width: 120,
      render: (record) => {
        return record.designation != '' ? <FormattedMessage id={record.designation} /> : '';
      },
    },

    {
      key: '11',
      dataIndex: 'orderNo',
      title: <FormattedMessage id="formLanguage.table.orderNo" />,
      // width: 120,
    },

    {
      key: '12',
      dataIndex: 'orderDate',
      title: <FormattedMessage id="formLanguage.table.orderDate" />,
      // width: 120,
    },

    {
      key: '13',
      dataIndex: 'remarks',
      title: <FormattedMessage id="formLanguage.table.remark" />,
      // width: 100,
    },

    {
      key: '14',
      fixed: 'right',
      title: <FormattedMessage id="formLanguage.table.action" />,
      width: '120px',
      render: (record) => {
        return (
          deleteRecord(record),
          (
            <>
              <Row>
                <Col>
                  {/* <Button
                  onClick={() => {
                    showModalForEdit(record), deleteRecord(record);
                  }}
                  style={{ backgroundColor: 'lightblue', color: 'black' }}
                >
                  Confirm
                </Button> */}
                  <br />
                  <br />

                  <Button
                    onClick={() => showModalForUpdate(record)}
                    type="primary"
                    size="large"
                    // style={{ backgroundColor: 'lightgreen', color: 'black' }}
                  >
                    Update
                  </Button>
                </Col>
              </Row>
            </>
          )
        );
      },
    },
  ];

  return (
    <div>
      <Card>
        <Row>
          <Col xl={20} lg={20} md={20} sm={20} xs={20}>
            <h2>
              <center>
                <FormattedMessage id="formLanguage.label.landRegister" />
              </center>
            </h2>
          </Col>
          <Col xl={2} lg={2} md={2} sm={2} xs={2}></Col>
          <Col xl={2} lg={2} md={2} sm={2} xs={2}>
            <Button
              style={{
                marginTop: '10px',
              }}
              type="primary"
              onClick={() => {
                history.push({
                  pathname: `/form/dysclr-form/village-form`,
                });
              }}
            >
              <FormattedMessage id="formLanguage.button.add" />
            </Button>
          </Col>
        </Row>
        <Row style={{ marginTop: '20px', paddingLeft: '20px' }}>
          <Col xl={18} lg={18} md={18} sm={18} xs={18}>
            <VillageSelector
              pageType="withoutYear"
              setCodeVillage={setCodeVillage}
              setTextForVillage={setTextForVillage}
              onVillageChange={setVillage}
              yearChange={setRevenueYear}
              setIsNirank={setIsNirank}
            />
          </Col>

          <Col xl={2} lg={2} md={2} sm={2} xs={2}>
            <Button
              style={{
                height: '30px',
                width: '100px',
                marginTop: '10px',
              }}
              variant="contained"
              color="primary"
              type="primary"
              onClick={() => {
                if (textForVillage) {
                  getDysclrForm1Data();
                } else if (textForVillage == null) {
                  message.info('Please Select Village');
                }
              }}
            >
              <FormattedMessage id="formLanguage.button.search" />
            </Button>
          </Col>
          {/* <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col> */}

          {/* <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col> */}
        </Row>
        {/* <Row style={{ marginTop: '10px', paddingLeft: '20px' }}>
          <Col xl={7} lg={10} md={12} sm={15} xs={18}>
            <Form.Item
              style={{
                marginTop: '5px',
              }}
              labelCol={{ xs: 10 }}
              wrapperCol={{ xl: 14, md: 20, xs: 14 }}
              label={<FormattedMessage id="formLanguage.table.surveyNo" />}
              type="number"
              name="surveyNo"
              rules={[
                // { required: true, message: 'Please Enter Survey Number!!' },
                {
                  type: 'string',
                  max: 7,
                  message: 'Survey Number shoud be upto 7 numbers',
                },
              ]}
              // style={{  marginRight: '10px'}}
            >
              <Input
                onKeyPress={KeyPressEvents.isInputNumber}
                maxLength={8}
                onChange={handleChangeForSurveyNo}
              />
            </Form.Item>
          </Col>
          <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>

          <Col xl={4} lg={4} md={4} sm={4} xs={4}>
            <IconButton>
              <Button
                style={{
                  height: '30px',
                  width: '100px',
                }}
                variant="contained"
                color="primary"
                onClick={() => {
                  if (textForVillage) {
                    getDysclrForm1Data();
                  } else if (textForVillage == null) {
                    message.info('Please Select Village');
                  }
                }}
              >
                <FormattedMessage id="formLanguage.button.search" />
              </Button>
            </IconButton>
          </Col>
        </Row> */}
      </Card>
      <Card>
        <Table
          style={{ marginTop: 20 }}
          bordered
          scroll={{ y: 350, x: 1900 }}
          loading={isLoading}
          dataSource={dysclrForm1}
          columns={columns}
        />
      </Card>
      {/* <Modal
        title={<FormattedMessage id="formLanguage.form.popForDelete" />}
        visible={modalForDelete}
        okText={<FormattedMessage id="formLanguage.form.yes" />}
        okType="danger"
        onCancel={onCancelForDeleteModal}
        cancelText={<FormattedMessage id="formLanguage.form.no" />}
        onOk={deleteDysclrFormById}
      ></Modal> */}
      <Modal
        width={350}
        visible={isModalVisible}
        okText={okText}
        onCancel={handleClose}
        onOk={() => {
          editDysclrForm();
        }}
        confirmLoading={confirmLoading}
      >
        सदर माहिती जतन करायची आहे का ?
      </Modal>
      <Modal
        width={900}
        visible={isUpdateModalVisible}
        okText={okText}
        // onCancel={handleClose}
        // onOk={() => {
        //   updateDysclrForm();
        // }}
        confirmLoading={confirmLoading}
        footer={[
          <Button
            type="primary"
            loading={confirmLoading}
            key="submit"
            onClick={() => {
              updateDysclrForm();
            }}
          >
            Save
          </Button>,
          <Button
            type="primary"
            onClick={() => {
              handleClose();
            }}
          >
            Cancel
          </Button>,
          <Button
            type="primary"
            danger
            onClick={() => {
              deleteDysclrFormById();
            }}
          >
            Delete
          </Button>,
        ]}
      >
        <Form form={form1} layout="vertical">
          <h2 id="child-modal-title">माहिती भरा</h2>
          <Divider />
          <Row>
            <Col xs={24} sm={24} md={24} lg={11} xl={11}>
              <Form.Item
                label={<FormattedMessage id="formLanguage.table.surveyNo" />}
                name="surveyNumber"
                rules={[
                  {
                    required: true,
                    // message: <FormattedMessage id="villageForm1.table.publicRightsOfWays" />,
                  },
                ]}
              >
                <Input
                  //    onKeyPress={KeyPressEvents.isInputChar}
                  max={200}
                  disabled={inputState}
                  defaultValue={dataInModalUpdate && dataInModalUpdate.surveyNumber}
                  onChange={(e) => {
                    setDataInModal((preDataInModal) => ({
                      ...preDataInModal,
                      surveyNumber: e.target.value,
                    }));
                  }}
                />
              </Form.Item>
            </Col>
            <Col xs={2} sm={2} md={2} lg={2} xl={2}></Col>
            <Col xs={24} sm={24} md={24} lg={11} xl={11}>
              <Form.Item
                label={<FormattedMessage id="formLanguage.table.surveyNoDs" />}
                name="surveyNoDyslr"
                rules={[
                  {
                    required: 'true',
                    // message: (
                    //   <FormattedMessage id="villageForm6B.table.ruleOrderOfTahshilAsToFine" />
                    // ),
                  },
                  { max: 500, message: 'This field shoud be below 500 characters' },
                ]}
              >
                <Input
                  disabled={inputState}
                  defaultValue={dataInModalUpdate && dataInModalUpdate.surveyNumber}
                  onKeyPress={KeyPressEvents.isInputVarchar}
                  maxLength={501}
                  onChange={(e) => {
                    setDataInModalUpdate((preDataInModal) => ({
                      ...preDataInModal,
                      surveyNumber: e.target.value,
                    }));
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col xs={24} sm={24} md={24} lg={11} xl={11}>
              <Form.Item
                label={<FormattedMessage id="villageForm1.table.tenure" />}
                name="tenureName"
                rules={[
                  {
                    required: true,
                    // message: <FormattedMessage id="villageForm1.table.publicRightsOfWays" />,
                  },
                ]}
              >
                <Input
                  //    onKeyPress={KeyPressEvents.isInputChar}
                  max={200}
                  disabled={inputState}
                  defaultValue={dataInModalUpdate && dataInModalUpdate.tenureName}
                  onChange={(e) => {
                    setDataInModal((preDataInModal) => ({
                      ...preDataInModal,
                      tenureName: e.target.value,
                    }));
                  }}
                />
              </Form.Item>
            </Col>{' '}
            <Col xs={2} sm={2} md={2} lg={2} xl={2}></Col>
            <Col xs={24} sm={24} md={24} lg={11} xl={11}>
              <Form.Item
                label={<FormattedMessage id="formLanguage.table.tenureDs" />}
                name="tenureDyslr"
                rules={[
                  {
                    required: 'true',
                    // message: (
                    //   <FormattedMessage id="villageForm6B.table.ruleOrderOfTahshilAsToFine" />
                    // ),
                  },
                  { max: 500, message: 'This field shoud be below 500 characters' },
                ]}
              >
                <Select
                  defaultValue={dataInModalUpdate && dataInModalUpdate.tenureName}
                  // onKeyPress={KeyPressEvents.isInputVarchar}
                  maxLength={501}
                  onChange={(e) => {
                    setDataInModalUpdate((preDataInModal) => ({
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
          </Row>
          <Row>
            <Col xs={24} sm={24} md={24} lg={11} xl={11}>
              <Form.Item
                label={<FormattedMessage id="formLanguage.table.totalArea" />}
                name="totalAreaH"
                rules={[
                  {
                    required: true,
                    // message: <FormattedMessage id="villageForm1.table.publicRightsOfWays" />,
                  },
                ]}
              >
                <Input
                  //    onKeyPress={KeyPressEvents.isInputChar}
                  max={200}
                  disabled={inputState}
                  defaultValue={dataInModalUpdate && dataInModalUpdate.totalAreaH}
                  onChange={(e) => {
                    setDataInModal((preDataInModal) => ({
                      ...preDataInModal,
                      totalAreaH: e.target.value,
                    }));
                  }}
                />
              </Form.Item>
            </Col>
            <Col xs={2} sm={2} md={2} lg={2} xl={2}></Col>
            <Col xs={24} sm={24} md={24} lg={11} xl={11}>
              <Form.Item
                label={<FormattedMessage id="formLanguage.table.totalAreaHDs" />}
                name="totalAreaHDyslr"
                rules={[
                  {
                    required: 'true',
                    // message: (
                    //   <FormattedMessage id="villageForm6B.table.ruleOrderOfTahshilAsToFine" />
                    // ),
                  },
                  { max: 500, message: 'This field shoud be below 500 characters' },
                ]}
              >
                <Input.TextArea
                  defaultValue={dataInModalUpdate && dataInModalUpdate.totalAreaH}
                  onKeyPress={KeyPressEvents.isInputVarchar}
                  maxLength={501}
                  onChange={(e) => {
                    setDataInModalUpdate((preDataInModal) => ({
                      ...preDataInModal,
                      totalAreaH: e.target.value,
                    }));
                  }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col xs={24} sm={24} md={24} lg={11} xl={11}>
              <Form.Item
                label={<FormattedMessage id="formLanguage.table.kind" />}
                name="potkharabaType"
                rules={[
                  {
                    required: true,
                    // message: <FormattedMessage id="villageForm1.table.publicRightsOfWays" />,
                  },
                ]}
              >
                <Input
                  //    onKeyPress={KeyPressEvents.isInputChar}
                  max={200}
                  disabled={inputState}
                  defaultValue={dataInModalUpdate && dataInModalUpdate.potkharabaType}
                  onChange={(e) => {
                    setDataInModal((preDataInModal) => ({
                      ...preDataInModal,
                      potkharabaType: e.target.value,
                    }));
                  }}
                />
              </Form.Item>
            </Col>{' '}
            <Col xs={2} sm={2} md={2} lg={2} xl={2}></Col>
            <Col xs={24} sm={24} md={24} lg={11} xl={11}>
              <Form.Item
                label={<FormattedMessage id="formLanguage.table.kindDs" />}
                name="potkharabaTypeDyslr"
                rules={[
                  {
                    required: 'true',
                    // message: (
                    //   <FormattedMessage id="villageForm6B.table.ruleOrderOfTahshilAsToFine" />
                    // ),
                  },
                  { max: 500, message: 'This field shoud be below 500 characters' },
                ]}
              >
                {/* <Input.TextArea
                  defaultValue={dataInModalUpdate && dataInModalUpdate.potkharabaType}
                  onKeyPress={KeyPressEvents.isInputVarchar}
                  maxLength={501}
                  onChange={(e) => {
                    setDataInModalUpdate((preDataInModal) => ({
                      ...preDataInModal,
                      potkharabaType: e.target.value,
                    }));
                  }}
                /> */}
                <Select
                  defaultValue={dataInModalUpdate && dataInModalUpdate.potkharabaType}
                  // onKeyPress={KeyPressEvents.isInputVarchar}
                  maxLength={501}
                  onChange={(e) => {
                    setDataInModalUpdate((preDataInModal) => ({
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
          </Row>
          <Row>
            <Col xs={24} sm={24} md={24} lg={11} xl={11}>
              <Form.Item
                label={<FormattedMessage id="formLanguage.table.area" />}
                name="cultivableAreaInt"
                rules={[
                  {
                    required: true,
                    // message: <FormattedMessage id="villageForm1.table.publicRightsOfWays" />,
                  },
                ]}
              >
                <Input
                  //    onKeyPress={KeyPressEvents.isInputChar}
                  max={200}
                  disabled={inputState}
                  defaultValue={dataInModalUpdate && dataInModalUpdate.cultivableAreaInt}
                  onChange={(e) => {
                    setDataInModal((preDataInModal) => ({
                      ...preDataInModal,
                      cultivableAreaInt: e.target.value,
                    }));
                  }}
                />
              </Form.Item>
            </Col>
            <Col xs={2} sm={2} md={2} lg={2} xl={2}></Col>
            <Col xs={24} sm={24} md={24} lg={11} xl={11}>
              <Form.Item
                label={<FormattedMessage id="formLanguage.table.areaDs" />}
                name="cultivableAreaIntDyslr"
                rules={[
                  {
                    required: 'true',
                    // message: (
                    //   <FormattedMessage id="villageForm6B.table.ruleOrderOfTahshilAsToFine" />
                    // ),
                  },
                  { max: 500, message: 'This field shoud be below 500 characters' },
                ]}
              >
                <Input.TextArea
                  defaultValue={dataInModalUpdate && dataInModalUpdate.cultivableAreaInt}
                  onKeyPress={KeyPressEvents.isInputVarchar}
                  maxLength={501}
                  onChange={(e) => {
                    setDataInModalUpdate((preDataInModal) => ({
                      ...preDataInModal,
                      cultivableAreaInt: e.target.value,
                    }));
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col item xs={24} sm={24} md={24} lg={15} xl={15}></Col>

            <Col xs={24} sm={24} md={24} lg={4} xl={4}>
              <h2>
                <label htmlFor="">क्षेत्र</label>
              </h2>
            </Col>
            <Col xs={1} sm={1} md={1} lg={1} xl={1}></Col>

            <Col xs={24} sm={24} md={24} lg={4} xl={4}>
              <h2>
                <label htmlFor="">आकारणी </label>
              </h2>
            </Col>
          </Row>
          <Row>
            <Col item xs={24} sm={24} md={24} lg={13} xl={13}></Col>
            <Col xs={24} sm={24} md={24} lg={2} xl={2}>
              <h2>
                <label htmlFor="">
                  <span style={{ color: 'red' }}>*</span> जिरायत :
                </label>
              </h2>
            </Col>
            <Col xs={24} sm={24} md={24} lg={4} xl={4}>
              <Form.Item
                // label={'बागायत'}
                name="jirayatArea"
                rules={[
                  {
                    required: 'true',
                    // message: (
                    //   <FormattedMessage id="villageForm6B.table.ruleOrderOfTahshilAsToFine" />
                    // ),
                  },

                  { max: 10, message: 'This field shoud be below 10 numbers' },
                ]}
              >
                <Input
                  defaultValue={dataInModalUpdate && dataInModalUpdate.jirayatArea}
                  // onKeyPress={KeyPressEvents.isInputVarchar}
                  maxLength={11}
                  onChange={(e) => {
                    setDataInModalUpdate((preDataInModal) => ({
                      ...preDataInModal,
                      jirayatArea: e.target.value,
                    }));
                  }}
                  onKeyPress={KeyPressEvents.isInputNumber1}
                />
              </Form.Item>
            </Col>
            <Col xs={1} sm={1} md={1} lg={1} xl={1}></Col>

            <Col xs={24} sm={24} md={24} lg={4} xl={4}>
              <Form.Item
                // label={'बागायत'}
                name="jirayatAssessment"
                rules={[
                  {
                    required: 'true',
                    // message: (
                    //   <FormattedMessage id="villageForm6B.table.ruleOrderOfTahshilAsToFine" />
                    // ),
                  },

                  { max: 10, message: 'This field shoud be below 10 numbers' },
                ]}
              >
                <Input
                  defaultValue={dataInModalUpdate && dataInModalUpdate.jirayatAssessment}
                  // onKeyPress={KeyPressEvents.isInputVarchar}
                  onKeyPress={KeyPressEvents.isInputNumber1}
                  maxLength={11}
                  onChange={(e) => {
                    setDataInModalUpdate((preDataInModal) => ({
                      ...preDataInModal,
                      jirayatAssessment: e.target.value,
                    }));
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col item xs={24} sm={24} md={24} lg={13} xl={13}></Col>
            <Col xs={24} sm={24} md={24} lg={2} xl={2}>
              <h2>
                <label htmlFor="">
                  <span style={{ color: 'red' }}>*</span> बागायत :
                </label>
              </h2>
            </Col>
            <Col xs={24} sm={24} md={24} lg={4} xl={4}>
              <Form.Item
                // label={'बागायत'}
                name="bagayatArea"
                rules={[
                  {
                    required: 'true',
                    // message: (
                    //   <FormattedMessage id="villageForm6B.table.ruleOrderOfTahshilAsToFine" />
                    // ),
                  },

                  { max: 10, message: 'This field shoud be below 10 numbers' },
                ]}
              >
                <Input
                  defaultValue={dataInModalUpdate && dataInModalUpdate.bagayatArea}
                  // onKeyPress={KeyPressEvents.isInputVarchar}
                  onKeyPress={KeyPressEvents.isInputNumber1}
                  maxLength={11}
                  onChange={(e) => {
                    setDataInModalUpdate((preDataInModal) => ({
                      ...preDataInModal,
                      bagayatArea: e.target.value,
                    }));
                  }}
                />
              </Form.Item>
            </Col>
            <Col xs={1} sm={1} md={1} lg={1} xl={1}></Col>

            <Col xs={24} sm={24} md={24} lg={4} xl={4}>
              <Form.Item
                // label={'बागायत'}
                name="bagayatAssessment"
                rules={[
                  {
                    required: 'true',
                    // message: (
                    //   <FormattedMessage id="villageForm6B.table.ruleOrderOfTahshilAsToFine" />
                    // ),
                  },

                  { max: 10, message: 'This field shoud be below 10 numbers' },
                ]}
              >
                <Input
                  defaultValue={dataInModalUpdate && dataInModalUpdate.bagayatAssessment}
                  // onKeyPress={KeyPressEvents.isInputVarchar}
                  onKeyPress={KeyPressEvents.isInputNumber1}
                  maxLength={11}
                  onChange={(e) => {
                    setDataInModalUpdate((preDataInModal) => ({
                      ...preDataInModal,
                      bagayatAssessment: e.target.value,
                    }));
                  }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col item xs={24} sm={24} md={24} lg={13} xl={13}></Col>
            <Col xs={24} sm={24} md={24} lg={2} xl={2}>
              <h2>
                <label htmlFor="">
                  <span style={{ color: 'red' }}>*</span> तरी :
                </label>
              </h2>
            </Col>
            <Col xs={24} sm={24} md={24} lg={4} xl={4}>
              <Form.Item
                // label={'बागायत'}
                name="tariArea"
                rules={[
                  {
                    required: 'true',
                    // message: (
                    //   <FormattedMessage id="villageForm6B.table.ruleOrderOfTahshilAsToFine" />
                    // ),
                  },

                  { max: 10, message: 'This field shoud be below 10 numbers' },
                ]}
              >
                <Input
                  defaultValue={dataInModalUpdate && dataInModalUpdate.tariArea}
                  // onKeyPress={KeyPressEvents.isInputVarchar}
                  onKeyPress={KeyPressEvents.isInputNumber1}
                  maxLength={11}
                  onChange={(e) => {
                    setDataInModalUpdate((preDataInModal) => ({
                      ...preDataInModal,
                      tariArea: e.target.value,
                    }));
                  }}
                />
              </Form.Item>
            </Col>
            <Col xs={1} sm={1} md={1} lg={1} xl={1}></Col>

            <Col xs={24} sm={24} md={24} lg={4} xl={4}>
              <Form.Item
                // label={'बागायत'}
                name="tariAssessment"
                rules={[
                  {
                    required: 'true',
                    // message: (
                    //   <FormattedMessage id="villageForm6B.table.ruleOrderOfTahshilAsToFine" />
                    // ),
                  },

                  { max: 10, message: 'This field shoud be below 10 numbers' },
                ]}
              >
                <Input
                  defaultValue={dataInModalUpdate && dataInModalUpdate.tariAssessment}
                  // onKeyPress={KeyPressEvents.isInputVarchar}
                  onKeyPress={KeyPressEvents.isInputNumber1}
                  maxLength={11}
                  onChange={(e) => {
                    setDataInModalUpdate((preDataInModal) => ({
                      ...preDataInModal,
                      tariAssessment: e.target.value,
                    }));
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col item xs={24} sm={24} md={24} lg={13} xl={13}></Col>
            <Col xs={24} sm={24} md={24} lg={2} xl={2}>
              <h2>
                <label htmlFor="">
                  {' '}
                  <span style={{ color: 'red' }}>*</span> इतर :
                </label>
              </h2>
            </Col>
            <Col xs={24} sm={24} md={24} lg={4} xl={4}>
              <Form.Item
                // label={'बागायत'}
                name="otherArea"
                rules={[
                  {
                    required: 'true',
                    // message: (
                    //   <FormattedMessage id="villageForm6B.table.ruleOrderOfTahshilAsToFine" />
                    // ),
                  },

                  { max: 10, message: 'This field shoud be below 10 numbers' },
                ]}
              >
                <Input
                  defaultValue={dataInModalUpdate && dataInModalUpdate.otherArea}
                  // onKeyPress={KeyPressEvents.isInputVarchar}
                  onKeyPress={KeyPressEvents.isInputNumber1}
                  maxLength={11}
                  onChange={(e) => {
                    setDataInModalUpdate((preDataInModal) => ({
                      ...preDataInModal,
                      otherArea: e.target.value,
                    }));
                  }}
                />
              </Form.Item>
            </Col>
            <Col xs={1} sm={1} md={1} lg={1} xl={1}></Col>

            <Col xs={24} sm={24} md={24} lg={4} xl={4}>
              <Form.Item
                // label={'बागायत'}
                name="otherAssessment"
                rules={[
                  {
                    required: 'true',
                    // message: (
                    //   <FormattedMessage id="villageForm6B.table.ruleOrderOfTahshilAsToFine" />
                    // ),
                  },

                  { max: 10, message: 'This field shoud be below 10 numbers' },
                ]}
              >
                <Input
                  defaultValue={dataInModalUpdate && dataInModalUpdate.otherAssessment}
                  // onKeyPress={KeyPressEvents.isInputVarchar}
                  onKeyPress={KeyPressEvents.isInputNumber1}
                  maxLength={11}
                  onChange={(e) => {
                    setDataInModalUpdate((preDataInModal) => ({
                      ...preDataInModal,
                      otherAssessment: e.target.value,
                    }));
                  }}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* <Row>
            <Col item xs={24} sm={24} md={24} lg={13} xl={13}></Col>
            <Col xs={24} sm={24} md={24} lg={2} xl={2}>
              <h2>
                <label htmlFor="">एकूण :</label>
              </h2>
            </Col>
            <Col xs={24} sm={24} md={24} lg={4} xl={4}>
              <Form.Item
                // label={'बागायत'}
                name="totalArea"
                rules={[
                  {
                    required: 'true',
                    // message: (
                    //   <FormattedMessage id="villageForm6B.table.ruleOrderOfTahshilAsToFine" />
                    // ),
                  },

                  { max: 10, message: 'This field shoud be below 10 numbers' },
                ]}
              >
                <Input
                  defaultValue={dataInModalUpdate && dataInModalUpdate.totalArea}
                  // onKeyPress={KeyPressEvents.isInputVarchar}
                  onKeyPress={KeyPressEvents.isInputNumber1}
                  maxLength={11}
                  onChange={(e) => {
                    setDataInModalUpdate((preDataInModal) => ({
                      ...preDataInModal,
                      totalArea: e.target.value,
                    }));
                  }}
                />
              </Form.Item>
            </Col>
            <Col xs={1} sm={1} md={1} lg={1} xl={1}></Col>

            <Col xs={24} sm={24} md={24} lg={4} xl={4}>
              <Form.Item
                // label={'बागायत'}
                name="totalAssessment"
                rules={[
                  {
                    required: 'true',
                    // message: (
                    //   <FormattedMessage id="villageForm6B.table.ruleOrderOfTahshilAsToFine" />
                    // ),
                  },

                  { max: 10, message: 'This field shoud be below 10 numbers' },
                ]}
              >
                <Input
                  defaultValue={dataInModalUpdate && dataInModalUpdate.totalAssessment}
                  // onKeyPress={KeyPressEvents.isInputVarchar}
                  onKeyPress={KeyPressEvents.isInputNumber1}
                  maxLength={11}
                  onChange={(e) => {
                    setDataInModalUpdate((preDataInModal) => ({
                      ...preDataInModal,
                      totalAssessment: e.target.value,
                    }));
                  }}
                />
              </Form.Item>
            </Col>
          </Row> */}
          <Row>
            <Col item xs={24} sm={24} md={24} lg={11} xl={11}>
              <Form.Item
                label={<FormattedMessage id="formLanguage.table.netCultivableArea" />}
                name="netCultiAreaH"
                rules={[
                  {
                    required: true,
                    // message: <FormattedMessage id="villageForm1.table.publicRightsOfWays" />,
                  },
                ]}
              >
                <Input
                  //    onKeyPress={KeyPressEvents.isInputChar}
                  max={200}
                  disabled={inputState}
                  defaultValue={dataInModalUpdate && dataInModalUpdate.netCultiAreaH}
                  onChange={(e) => {
                    setDataInModal((preDataInModal) => ({
                      ...preDataInModal,
                      netCultiAreaH: e.target.value,
                    }));
                  }}
                />
              </Form.Item>
            </Col>
            <Col xs={2} sm={2} md={2} lg={2} xl={2}></Col>
            <Col xs={24} sm={24} md={24} lg={11} xl={11}>
              <Form.Item
                label={<FormattedMessage id="formLanguage.table.netCultivableAreaDs" />}
                name="netCultivationAreaDyslr"
                rules={[
                  {
                    required: 'true',
                    // message: (
                    //   <FormattedMessage id="villageForm6B.table.ruleOrderOfTahshilAsToFine" />
                    // ),
                  },
                  { max: 500, message: 'This field shoud be below 500 characters' },
                ]}
              >
                <Input.TextArea
                  defaultValue={dataInModalUpdate && dataInModalUpdate.netCultiAreaH}
                  onKeyPress={KeyPressEvents.isInputVarchar}
                  maxLength={501}
                  onChange={(e) => {
                    setDataInModalUpdate((preDataInModal) => ({
                      ...preDataInModal,
                      netCultiAreaH: e.target.value,
                    }));
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col item xs={24} sm={24} md={24} lg={11} xl={11}>
              <Form.Item
                label={<FormattedMessage id="formLanguage.table.naAssessment" />}
                name="assessment"
                rules={[
                  {
                    required: true,
                    // message: <FormattedMessage id="villageForm1.table.publicRightsOfWays" />,
                  },
                ]}
              >
                <Input
                  //    onKeyPress={KeyPressEvents.isInputChar}
                  max={200}
                  disabled={inputState}
                  defaultValue={dataInModalUpdate && dataInModalUpdate.assessment}
                  onChange={(e) => {
                    setDataInModal((preDataInModal) => ({
                      ...preDataInModal,
                      assessment: e.target.value,
                    }));
                  }}
                />
              </Form.Item>
            </Col>
            <Col xs={2} sm={2} md={2} lg={2} xl={2}></Col>
            <Col xs={24} sm={24} md={24} lg={11} xl={11}>
              <Form.Item
                label={<FormattedMessage id="formLanguage.table.naAssessmentDs" />}
                name="assessmentDyslr"
                rules={[
                  {
                    required: 'true',
                    // message: (
                    //   <FormattedMessage id="villageForm6B.table.ruleOrderOfTahshilAsToFine" />
                    // ),
                  },
                  { max: 500, message: 'This field shoud be below 500 characters' },
                ]}
              >
                <Input.TextArea
                  defaultValue={dataInModalUpdate && dataInModalUpdate.assessment}
                  onKeyPress={KeyPressEvents.isInputVarchar}
                  maxLength={501}
                  onChange={(e) => {
                    setDataInModalUpdate((preDataInModal) => ({
                      ...preDataInModal,
                      assessment: e.target.value,
                    }));
                  }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col xs={24} sm={24} md={24} lg={11} xl={11}>
              <Form.Item
                label={<FormattedMessage id="formLanguage.table.publicRights" />}
                name="publicRightsOfWayAndEasements"
                // rules={[
                //   {
                //     required: true,
                //     // message: <FormattedMessage id="villageForm1.table.publicRightsOfWays" />,
                //   },
                // ]}
              >
                <Input.TextArea
                  //    onKeyPress={KeyPressEvents.isInputChar}
                  max={200}
                  disabled={inputState}
                  defaultValue={
                    dataInModalUpdate && dataInModalUpdate.publicRightsOfWayAndEasements
                  }
                  onChange={(e) => {
                    setDataInModal((preDataInModal) => ({
                      ...preDataInModal,
                      publicRightsOfWayAndEasements: e.target.value,
                    }));
                  }}
                />
              </Form.Item>
            </Col>
            <Col xs={2} sm={2} md={2} lg={2} xl={2}></Col>
            <Col xs={24} sm={24} md={24} lg={11} xl={11}>
              <Form.Item
                label={<FormattedMessage id="formLanguage.table.publicRightsDs" />}
                name="publicRightsOfWayAndEasementsDyslr"
                // rules={[
                //   {
                //     required: 'true',
                //     // message: (
                //     //   <FormattedMessage id="villageForm6B.table.ruleOrderOfTahshilAsToFine" />
                //     // ),
                //   },
                //   { max: 500, message: 'This field shoud be below 500 characters' },
                // ]}
              >
                <Input.TextArea
                  defaultValue={
                    dataInModalUpdate && dataInModalUpdate.publicRightsOfWayAndEasements
                  }
                  onKeyPress={KeyPressEvents.isInputVarchar}
                  maxLength={501}
                  onChange={(e) => {
                    setDataInModalUpdate((preDataInModal) => ({
                      ...preDataInModal,
                      publicRightsOfWayAndEasements: e.target.value,
                    }));
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col xs={24} sm={24} md={24} lg={11} xl={11}>
              <Form.Item
                label={<FormattedMessage id="formLanguage.table.alteration" />}
                name="particularsOfAlteration"
                // rules={[
                //   {
                //     required: true,
                //     // message: <FormattedMessage id="villageForm1.table.publicRightsOfWays" />,
                //   },
                // ]}
              >
                <Input
                  //    onKeyPress={KeyPressEvents.isInputChar}
                  max={200}
                  disabled={inputState}
                  defaultValue={dataInModalUpdate && dataInModalUpdate.particularsOfAlteration}
                  onChange={(e) => {
                    setDataInModal((preDataInModal) => ({
                      ...preDataInModal,
                      particularsOfAlteration: e.target.value,
                    }));
                  }}
                />
              </Form.Item>
            </Col>
            <Col xs={2} sm={2} md={2} lg={2} xl={2}></Col>
            <Col xs={24} sm={24} md={24} lg={11} xl={11}>
              <Form.Item
                label={<FormattedMessage id="formLanguage.table.alterationDs" />}
                name="particularsOfAlterationDyslr"
                // rules={[
                //   {
                //     required: 'true',
                //     // message: (
                //     //   <FormattedMessage id="villageForm6B.table.ruleOrderOfTahshilAsToFine" />
                //     // ),
                //   },
                //   { max: 500, message: 'This field shoud be below 500 characters' },
                // ]}
              >
                <Input.TextArea
                  defaultValue={dataInModalUpdate && dataInModalUpdate.particularsOfAlteration}
                  onKeyPress={KeyPressEvents.isInputVarchar}
                  maxLength={501}
                  onChange={(e) => {
                    setDataInModalUpdate((preDataInModal) => ({
                      ...preDataInModal,
                      particularsOfAlteration: e.target.value,
                    }));
                  }}
                />
              </Form.Item>
            </Col>
          </Row>

          <h3 style={{ marginTop: 5 }}>
            <FormattedMessage id="formLanguage.form.sanctioningChanges" />
          </h3>
          <Row>
            <Col xs={24} sm={24} md={24} lg={11} xl={11}>
              <Form.Item
                label={<FormattedMessage id="formLanguage.table.designation" />}
                name="designation"
                // rules={[
                //   {
                //     required: true,
                //     // message: <FormattedMessage id="villageForm1.table.publicRightsOfWays" />,
                //   },
                // ]}
              >
                <Select
                  //    onKeyPress={KeyPressEvents.isInputChar}
                  max={200}
                  disabled={inputState}
                  defaultValue={dataInModalUpdate && dataInModalUpdate.designation}
                  onChange={(e) => {
                    setDataInModal((preDataInModal) => ({
                      ...preDataInModal,
                      designation: e,
                    }));
                  }}
                >
                  <Select.Option value={'villageForm1.table.collector'}>
                    <FormattedMessage id="villageForm1.table.collector" />
                  </Select.Option>
                  <Select.Option value={`villageForm1.table.deputyCollector`}>
                    <FormattedMessage id="villageForm1.table.deputyCollector" />
                  </Select.Option>
                  <Select.Option value={'villageForm1.table.tahsildar'}>
                    <FormattedMessage id="villageForm1.table.tahsildar" />
                  </Select.Option>
                  <Select.Option value={'villageForm1.table.nayabTahsildar'}>
                    <FormattedMessage id="villageForm1.table.nayabTahsildar" />
                  </Select.Option>
                  <Select.Option value={'villageForm1.table.circle'}>
                    <FormattedMessage id="villageForm1.table.circle" />
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={2} sm={2} md={2} lg={2} xl={2}></Col>
            <Col xs={24} sm={24} md={24} lg={11} xl={11}>
              <Form.Item
                label={<FormattedMessage id="formLanguage.table.designationDs" />}
                name="designationDyslr"
                // rules={[
                //   {
                //     required: 'true',
                //     // message: (
                //     //   <FormattedMessage id="villageForm6B.table.ruleOrderOfTahshilAsToFine" />
                //     // ),
                //   },
                //   // { max: 500, message: 'This field shoud be below 500 characters' },
                // ]}
              >
                <Select
                  //    onKeyPress={KeyPressEvents.isInputChar}
                  max={200}
                  placeholder="Select"
                  defaultValue={dataInModalUpdate && dataInModalUpdate.designation}
                  // value={designationDyslr}
                  // onChange={(value) => {
                  //   setDesignationDyslr(value);
                  // }}
                  onChange={(e) => {
                    setDataInModalUpdate((preDataInModal) => ({
                      ...preDataInModal,
                      designation: e,
                    }));
                  }}
                >
                  <Select.Option value={'villageForm1.table.collector'}>
                    <FormattedMessage id="villageForm1.table.collector" />
                  </Select.Option>
                  <Select.Option value={`villageForm1.table.deputyCollector`}>
                    <FormattedMessage id="villageForm1.table.deputyCollector" />
                  </Select.Option>
                  <Select.Option value={'villageForm1.table.tahsildar'}>
                    <FormattedMessage id="villageForm1.table.tahsildar" />
                  </Select.Option>
                  <Select.Option value={'villageForm1.table.nayabTahsildar'}>
                    <FormattedMessage id="villageForm1.table.nayabTahsildar" />
                  </Select.Option>
                  <Select.Option value={'villageForm1.table.circle'}>
                    <FormattedMessage id="villageForm1.table.circle" />
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col xs={24} sm={24} md={24} lg={11} xl={11}>
              {dataInModalUpdate && dataInModalUpdate.orderDate === null ? (
                <Form.Item
                  name={'orderDate'}
                  label={<FormattedMessage id="formLanguage.table.orderDate" />}
                >
                  <DatePicker
                    disabled={inputState}
                    // onSelect={(e) => {
                    //   setPeriodFromDate(e);
                    // }}
                  />
                </Form.Item>
              ) : (
                <Form.Item
                  name="orderDate"
                  label={<FormattedMessage id="formLanguage.table.orderDate" />}
                >
                  <DatePicker
                    disabled={inputState}
                    defaultValue={dataInModalUpdate && moment(dataInModalUpdate.orderDate)}
                    onChange={(e) => {
                      setDataInModal((preDataInModal) => ({
                        ...preDataInModal,
                        orderDate: moment(e).format('YYYY-MM-DD'),
                      }));
                      // console.log('periodFrom onchange', e);
                    }}
                  />
                </Form.Item>
              )}
            </Col>
            <Col xs={2} sm={2} md={2} lg={2} xl={2}></Col>
            <Col xs={24} sm={24} md={24} lg={11} xl={11}>
              {dataInModalUpdate && dataInModalUpdate.orderDate === null ? (
                <Form.Item
                  name={'orderDateDs'}
                  label={<FormattedMessage id="formLanguage.table.orderDate" />}
                >
                  <DatePicker
                  // disabled={inputState}
                  // onSelect={(e) => {
                  //   setPeriodFromDate(e);
                  // }}
                  />
                </Form.Item>
              ) : (
                <Form.Item
                  label={<FormattedMessage id="formLanguage.table.orderDateDs" />}
                  name="orderDateDs"
                  // rules={[
                  //   {
                  //     required: 'true',
                  //     // message: (
                  //     //   <FormattedMessage id="villageForm6B.table.ruleOrderOfTahshilAsToFine" />
                  //     // ),
                  //   },
                  // ]}
                >
                  <DatePicker
                    style={{ width: '100%' }}
                    //  defaultValue={moment(periodFromDateForedit)}
                    defaultValue={dataInModalUpdate && moment(dataInModalUpdate.orderDate)}
                    // onChange={(e) => {
                    //   setOrderDate(moment(e).format('YYYY-MM-DD'));
                    // }}
                    onChange={(e) => {
                      setDataInModalUpdate((preDataInModal) => ({
                        ...preDataInModal,
                        orderDate: moment(e).format('YYYY-MM-DD'),
                      }));
                      // console.log('periodFrom onchange', e);
                    }}
                  />
                </Form.Item>
              )}
            </Col>
          </Row>
          <Row>
            <Col xs={24} sm={24} md={24} lg={11} xl={11}>
              <Form.Item
                label={<FormattedMessage id="formLanguage.table.orderNo" />}
                name="orderNo"
                // rules={[
                //   {
                //     required: true,
                //     // message: <FormattedMessage id="villageForm1.table.publicRightsOfWays" />,
                //   },
                // ]}
              >
                <Input
                  //    onKeyPress={KeyPressEvents.isInputChar}
                  max={200}
                  disabled={inputState}
                  defaultValue={dataInModalUpdate && dataInModalUpdate.orderNo}
                  onChange={(e) => {
                    setDataInModal((preDataInModal) => ({
                      ...preDataInModal,
                      orderNo: e.target.value,
                    }));
                  }}
                />
              </Form.Item>
            </Col>{' '}
            <Col xs={2} sm={2} md={2} lg={2} xl={2}></Col>
            <Col xs={24} sm={24} md={24} lg={11} xl={11}>
              <Form.Item
                label={<FormattedMessage id="formLanguage.table.orderNoDs" />}
                name="orderNoDs"
                // rules={[
                //   {
                //     required: 'true',
                //     // message: (
                //     //   <FormattedMessage id="villageForm6B.table.ruleOrderOfTahshilAsToFine" />
                //     // ),
                //   },
                //   { max: 500, message: 'This field shoud be below 500 characters' },
                // ]}
              >
                <Input.TextArea
                  defaultValue={dataInModalUpdate && dataInModalUpdate.orderNo}
                  onKeyPress={KeyPressEvents.isInputVarchar}
                  maxLength={501}
                  onChange={(e) => {
                    setDataInModalUpdate((preDataInModal) => ({
                      ...preDataInModal,
                      orderNo: e.target.value,
                    }));
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col xs={24} sm={24} md={24} lg={11} xl={11}>
              <Form.Item
                label={<FormattedMessage id="formLanguage.table.remark" />}
                name="remarks"
                // rules={[
                //   {
                //     required: true,
                //     // message: <FormattedMessage id="villageForm1.table.publicRightsOfWays" />,
                //   },
                // ]}
              >
                <Input
                  //    onKeyPress={KeyPressEvents.isInputChar}
                  max={200}
                  disabled={inputState}
                  defaultValue={dataInModalUpdate && dataInModalUpdate.remarks}
                  onChange={(e) => {
                    setDataInModal((preDataInModal) => ({
                      ...preDataInModal,
                      remarks: e.target.value,
                    }));
                  }}
                />
              </Form.Item>
            </Col>
            <Col xs={2} sm={2} md={2} lg={2} xl={2}></Col>
            <Col xs={24} sm={24} md={24} lg={11} xl={11}>
              <Form.Item
                label={<FormattedMessage id="formLanguage.table.remarkDs" />}
                name="remarkDs"
                // rules={[
                //   {
                //     required: 'true',
                //     // message: (
                //     //   <FormattedMessage id="villageForm6B.table.ruleOrderOfTahshilAsToFine" />
                //     // ),
                //   },
                //   { max: 500, message: 'This field shoud be below 500 characters' },
                // ]}
              >
                <Input.TextArea
                  defaultValue={dataInModalUpdate && dataInModalUpdate.remarks}
                  onKeyPress={KeyPressEvents.isInputVarchar}
                  maxLength={501}
                  onChange={(e) => {
                    setDataInModalUpdate((preDataInModal) => ({
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
    </div>
  );
}

export default dysclrForm;
