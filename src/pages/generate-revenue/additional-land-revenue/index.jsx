import VillageSelector from '@/components/eComponents/VillageSelector';
import { DeleteOutlined, EditTwoTone, EyeTwoTone, SearchOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import {
  Button,
  Card,
  Checkbox,
  Col,
  Divider,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Radio,
  Row,
  Select,
  Table,
  Tooltip,
  Alert,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import URLS from '@/URLs/urls';
import useAxios from '@/components/eComponents/use-axios';
import { FormattedMessage, useModel } from 'umi';
import KeyPressEvents from '@/util/KeyPressEvents';
import { StackedArea } from '@ant-design/charts';
import TextArea from 'antd/lib/input/TextArea';

function additionalLandRevenueForm() {
  const { districtName, talukaName, districtCode, talukaCode } = useModel('details');
  const { sendRequest } = useAxios();
  let history = useHistory();
  const [village, setVillage] = useState([]);
  const [modalForDelete, setModalForDelete] = useState(false);
  const [recordId, setRecordId] = useState();
  const [codeVillage, setCodeVillage] = useState();
  const [textForVillage, setTextForVillage] = useState();
  const [khataNoValue, setKhataNoValue] = useState();
  const [revenueYear, setRevenueYear] = useState();
  const [isNirank, setIsNirank] = useState();
  const [isNirank1, setIsNirank1] = useState();
  const [true1, setTrue] = useState(true);

  const [flagDisableButton, setDisableFlagButton] = useState(false);
  const [khataOwnerName, setKhataOwnerName] = useState();
  const [radiovalue, setRadioValue] = useState();
  const [fiftyPercent, setFiftyPercent] = useState();
  const [addLandForm] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState();
  const [objForMergingTheModal, setObjForMergingTheModal] = useState();
  const [assessment, setAssessment] = useState();
  const [area, setArea] = useState();
  const [tableData, setTableData] = useState();
  const [objForSaving, setObjForSaving] = useState();
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [loadingForSave, setLoadingForSave] = useState(false);
  const [formVisibility, setFormVisibility] = useState(true);

  const [cCodeVillageData1, setcCodeVillaheData1] = useState();
  const [villageNameVillageData1, setvillageNameVillageData1] = useState();

  const [villageName, setVillageName] = useState(false);

  const [cCodeVillageData, setcCodeVillaheData] = useState();
  const [villageNameVillageData, setvillageNameVillageData] = useState();
  const [singleVal, setSingleVal] = useState({});

  const getNirankReq = () => {
    const villageData1 = JSON.parse(localStorage.getItem('villageData1'));
    const cCode1 = villageData1[0]?.cCode;
    const selecterdVillage1 = villageData1[0]?.villageName;
    console.log(cCode1 + ' ' + selecterdVillage1);
    sendRequest(
      `${URLS.BaseURL}/restservice/getNirankForFourForm?cCode=${villageData1[0]?.cCode}`,
      'GET',
      null,
      (res) => {
        // var a = res?.data;
        console.log(res);
        const singleVal11 = res?.data?.find((obj) => obj?.formId === 'addlandlr');
        console.log('singleVal data...', singleVal11);
        setSingleVal(res?.data?.find((obj) => obj?.formId === 'addlandlr'));
        //console.log(singleVal11?.isNirank + '/ ' + singleVal11?.village_name);

        if (
          (singleVal11?.isNirank === 'Y' || singleVal11?.isCompleted === 'Y') &&
          singleVal11?.village_name === selecterdVillage1
        ) {
          setIsNirank1(true);
          // alert(isNirank1 + '   ' + 'true');
          //console.log(isNirank1 + '   ' + 'true');
        } else {
          setIsNirank1(false);
          //console.log(isNirank1 + '   ' + 'false');
        }
      },
      (err) => {
        console.log('message', err);
        //message.error(err.data.message);
      },
    );
  };
  useEffect(() => {
    getNirankReq();
  }, [isNirank1]);

  function handleChangeForkhataNo(event) {
    setKhataOwnerName();
    setArea();
    setAssessment();
    setDisableFlagButton(false);
    setKhataNoValue(event.target.value);
  }

  // const onChangeRadioButton = (e) => {
  //   setRadioValue(e.target.value);
  //   setFiftyPercent('');
  // };
  const handleOnChangeForForm = (e) => {
    setFormVisibility(false);
  };

  const onChangeCheckbox = (e) => {
    setFiftyPercent(e[0]);
    // console.log('value of e', e[0]);
  };

  const resetData = () => {
    addLandForm.resetFields();
    setKhataOwnerName();
    setFiftyPercent();
    setArea();
    setAssessment();
  };

  const poPconfirm = (e) => {
    setOpen(true);
  };

  // useEffect(() => {
  //   var a = JSON.parse(localStorage.getItem('niranks'));
  //   console.log(a, '-------Nirank Logic');

  //   var villageData1 = JSON.parse(localStorage.getItem('villageData1'));
  //   var villageData = JSON.parse(localStorage.getItem('villageData'));
  //   var cCode1 = villageData1[0]?.cCode;
  //   var villageName1 = villageData1[0]?.villageName;

  //   setcCodeVillaheData1(villageData1[0]?.cCode);
  //   setvillageNameVillageData1(villageData1[0]?.villageName);
  //   var b = villageData.find((obj) => obj?.cCode === cCodeVillageData1);

  //   var cCode = b?.cCode;
  //   var villageName = b?.villageName;

  //   if (cCode1 == cCode && villageName1 == villageName) {
  //     setVillageName(true);
  //   }
  //   console.log(cCode, cCode1, villageName, villageName1, '-------villageData1 comp-----ABHI');

  //   a.map((r, index) => {
  //     if (r.formId == 'addlandlr' && r.isNirank == 'Y') {
  //       console.log(r.isNirank);
  //       setIsNirank1(true);
  //     }
  //   });
  // }, [isNirank1, villageName]);

  function cancel(e) {
    message.error('Request Cancelled !!!');
  }

  const onCancelForDelete = () => {
    setModalForDelete(false);
  };

  const getKhatOwnerName = async () => {
    setLoading(true);

    sendRequest(
      `${URLS.BaseURL}/additionalLandRevenue/getAdditionalLandRevenueDetails?cCode=${codeVillage}&khataNo=${khataNoValue}`,
      'GET',
      null,
      (res) => {
        setKhataOwnerName(res.data.additionalLandRevenueData[0].khataOwnerName);
        setArea(res.data.additionalLandRevenueData[0].area);
        setAssessment(res.data.additionalLandRevenueData[0].assessment);

        // console.log('new check test ----->', res.data.khataOwnerName);
        setLoading(false);
      },

      (err) => {
        setLoading(false);
      },
    );
  };

  const onFinish = async () => {
    setLoadingForSave(true);
    const inputParams = {
      cCode: codeVillage,
      revenueYear: revenueYear,
      khataNo: khataNoValue,
      khataOwnerName: khataOwnerName,
      checkboxgroup: fiftyPercent,
      area: area,
      remarks: addLandForm.getFieldValue('remarks'),
      assessment: fiftyPercent === '50%' ? assessment * 0.5 : assessment * 1,
    };
    sendRequest(
      `${URLS.BaseURL}/additionalLandRevenue/saveAdditionalLandRevenue`,
      'POST',
      inputParams,
      (res) => {
        if (res.status === 201) {
          message.success('Record Saved !');

          addLandForm.resetFields();
          setFiftyPercent();
          setKhataOwnerName();
          setArea();
          setAssessment();
          // setTableData(
          //   res.data.additionalLandRevenueData.map((row, index) => ({
          //     srNo: index + 1,
          //     id: row.id,
          //     khataNo: row.khataNo,
          //     khataOwnerName: row.khataOwnerName,
          //     area: row.area,
          //     assessment: row.assessment,
          //     remarks: row.remarks,
          //     checkboxgroup: row.checkboxgroup,
          //   })),
          // );
          getAllDetails();
          setLoadingForSave(false);
          setFormVisibility(true);
        }
      },
      (err) => {
        setLoadingForSave(false);
        message.error('दिलेल्या खाता क्रमांकाची मागणी आधीच निश्चित केलेली आहे.');
      },
    );
  };

  const onFinalFinish = async () => {
    if (objForSaving && selectedRows != []) {
      setConfirmLoading(true);
      setTimeout(() => {
        setOpen(false);
        setConfirmLoading(false);
      }, 2000);
      sendRequest(
        `${URLS.BaseURL}/additionalLandRevenue/confirmAdditionalLandRevenueDemand`,
        'POST',
        objForSaving,
        (res) => {
          if (res.status === 201) {
            message.success('Additional Land Revenue Generated For Selected Records!');

            setObjForSaving();
            setSelectedRows();
            setTableData();
            getAllDetails();
          }
        },
      );
    } else {
      message.info('Please Select Records!');
    }
  };

  const getAllDetails = async () => {
    setIsLoading(true);
    sendRequest(
      `${URLS.BaseURL}/additionalLandRevenue/getAdditionalLandRevenueTableRecords?cCode=${codeVillage}&revenueYear=${revenueYear}`,
      'GET',
      null,
      (res) => {
        setTableData(
          res.data.additionalLandRevenueData.map((r, index) => ({
            srNo: index + 1,
            id: r.id,
            khataNo: r.khataNo,
            khataOwnerName: r.khataOwnerName,
            area: r.area,
            assessment: r.assessment,
            remarks: r.remarks,
            checkboxgroup: r.checkboxgroup,
          })),
        );
        message.success('Records Fetched!');
        setIsLoading(false);
      },
      (err) => {},
      setIsLoading(false),
    );
  };

  // const getTableData = async () => {
  //   sendRequest(
  //     `${URLS.BaseURL}/additionalLandRevenue/getAdditionalLandRevenueTableRecords?cCode=${codeVillage}&revenueYear=${revenueYear}`,
  //     'GET',
  //     null,
  //     (res) => {
  //       setTableData(
  //         res.data.additionalLandRevenueData.map((r, index) => ({
  //           srNo: index + 1,
  //           id: r.id,
  //           khataNo: r.khataNo,
  //           khataOwnerName: r.khataOwnerName,
  //           area: r.area,
  //           assessment: r.assessment,
  //           remarks: r.remarks,
  //           checkboxgroup: r.checkboxgroup,
  //         })),
  //       );
  //       message.success('Records Fetched!');
  //     },
  //     (err) => {},
  //   );
  // }

  const columns = [
    {
      key: '1',
      title: <FormattedMessage id="formLanguage.form.serialNo" />,
      dataIndex: 'srNo',
    },
    {
      key: '2',
      title: <FormattedMessage id="demandGeneration.table.khataNo" />,
      dataIndex: 'khataNo',
    },
    {
      key: '3',
      title: <FormattedMessage id="oneTimeEntry.form.khataOwner" />,
      dataIndex: 'khataOwnerName',
    },
    {
      key: '4',
      title: <FormattedMessage id="formLanguage.form.Area" />,
      dataIndex: 'area',
    },
    {
      key: '5',
      title: <FormattedMessage id="formLanguage.form.assessment" />,
      dataIndex: 'assessment',
    },

    {
      key: '6',
      title: <FormattedMessage id="formLanguage.table.percentage" />,
      dataIndex: 'checkboxgroup',
    },
    {
      key: '7',
      title: <FormattedMessage id="formLanguage.form.addLandInf" />,
      dataIndex: 'remarks',
    },

    // {
    //   key: '8',
    //   title: <FormattedMessage id="formLanguage.table.reasonOfDeath" />,
    //   dataIndex: 'reasonOfDeath',
    // },
    {
      key: '8',
      title: <FormattedMessage id="formLanguage.table.action" />,
      width: '56px',
      render: (record) => {
        return (
          <>
            <Row>
              <Col>
                <Button
                  onClick={() => deleteRecordById(record)}
                  style={{ color: 'red', marginLeft: 12 }}
                >
                  डिलीट
                </Button>
              </Col>
            </Row>
          </>
        );
      },
    },
  ];

  const deleteRecord = async (record) => {
    setModalForDelete(false);
    sendRequest(
      `${URLS.BaseURL}/additionalLandRevenue/discardAdditionalLandRevenue?id=${recordId}`,
      'DELETE',
      null,
      (res) => {
        if (res.status === 226) {
          message.success('Record Deleted!');
          setTableData([]);
          getAllDetails();
        }
      },
    );
  };

  const deleteRecordById = (record) => {
    setRecordId(record.id);
    setModalForDelete(true);
  };

  const onSelectChange = (selectedRowKeys, selectedRows) => {
    setSelectedRowKeys(selectedRowKeys);

    // console.log('selectedRowKeys', selectedRowKeys, 'selectedRows', selectedRows);
    var selectedRecords = [];
    selectedRows.map((row) => {
      selectedRecords.push({
        id: row.id,
        cCode: codeVillage,
        revenueYear: revenueYear,
        activeFlag: 'Y',
        khataNo: row.khataNo,
        khataOwnerName: row.khataOwnerName,
        checkboxgroup: row.checkboxgroup,
        area: row.area,
        assessment: row.assessment,
        remarks: row.remarks,
      });
    });

    var objForSavingDetails = {
      // revenueYear: revenueYear,

      // districtCode: districtCode,
      // talukaCode: talukaCode,
      // cCode: codeVillage,
      additionalLandRevenueDao: selectedRecords,
    };
    setObjForSaving(selectedRecords);
  };

  const rowSelection = {
    selectedRowKeys,
    selectedRows,
    onChange: onSelectChange,
  };

  const [selectionType, setSelectionType] = useState('checkbox');

  return (
    <div>
      <Card bordered={false}>
        <h1>
          <center>
            <FormattedMessage id="formLanguage.form.addLandRev" />
          </center>
        </h1>

        <Row>
          <Col xl={21} lg={21} md={21} sm={24} xs={24}>
            <VillageSelector
              pageType="withYear"
              setCodeVillage={setCodeVillage}
              setTextForVillage={setTextForVillage}
              onVillageChange={(setVillage, setTableData)}
              yearChange={setRevenueYear}
              setIsNirank={setIsNirank}
            />
          </Col>
          {/*   <Col span={1}></Col> */}
          <Col xl={3} lg={3} md={3} sm={24} xs={24}>
            {isNirank1 == false && (
              <Button
                style={{ marginTop: '10px' }}
                //disabled={flagDisableButton}
                // loading={loading}
                onClick={() => {
                  if (textForVillage && revenueYear) {
                    getAllDetails();
                  } else if (textForVillage == null) {
                    message.info('Please Select Village');
                  } else if (revenueYear == null) {
                    message.info('Please Select Revenue Year');
                  }
                }}
                type="primary"
              >
                <FormattedMessage id="formLanguage.button.search" />
              </Button>
            )}
          </Col>
        </Row>

        {formVisibility === false ? (
          <>
            <Form form={addLandForm} layout="vertical">
              <Row style={{ marginTop: '40px' }}>
                <Col xl={8} lg={8} md={8} sm={24} xs={24}>
                  <Form.Item
                    label={<FormattedMessage id="demandGeneration.table.khataNo" />}
                    type="number"
                    name="khataNo"
                    rules={[{ required: true, message: 'Please Enter Khata Number!!' }]}
                    // style={{ width: 300 }}
                  >
                    <Input
                      onKeyPress={KeyPressEvents.isInputNumber}
                      maxLength={40}
                      onChange={handleChangeForkhataNo}
                    />
                  </Form.Item>
                </Col>
                <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>
                <Col xl={1} lg={1} md={1} sm={1} xs={1}>
                  <Button
                    style={{ marginTop: '30px' }}
                    disabled={flagDisableButton}
                    loading={loading}
                    onClick={getKhatOwnerName}
                    type="primary"
                  >
                    <FormattedMessage id="formLanguage.button.search" />
                  </Button>
                </Col>
                <Col xl={2} lg={2} md={2} sm={2} xs={2}></Col>

                <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                  <Form.Item
                    label={<FormattedMessage id="oneTimeEntry.form.khataOwner" />}
                    rules={[{ required: true, message: 'This field is Required' }]}
                  >
                    <Input
                      // addonBefore={<FormattedMessage id="oneTimeEntry.form.khataOwner" />}
                      value={khataOwnerName}
                      disabled="true"
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row style={{ marginTop: '20px' }}>
                <Col xl={10} lg={10} md={10} sm={24} xs={24}>
                  <Form.Item label={<FormattedMessage id="form1abstract.area" />}>
                    <Input disabled value={area}></Input>
                  </Form.Item>
                </Col>
                <Col xl={2} lg={2} md={2} sm={2} xs={2}></Col>

                <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                  <Form.Item label={<FormattedMessage id="form1abstract.assessment" />}>
                    <Input disabled value={assessment}></Input>
                  </Form.Item>
                </Col>
              </Row>
              <Row style={{ marginTop: '20px' }}>
                <Col xl={6} lg={6} md={6} sm={24} xs={24}>
                  <label>
                    <b>
                      <FormattedMessage id="formLanguage.table.ifApplicable1" />
                    </b>
                  </label>
                  <Checkbox.Group
                    style={{ marginTop: '15px' }}
                    name="checkboxgroup"
                    value={fiftyPercent}
                    onChange={onChangeCheckbox}
                  >
                    <Checkbox value="50%">50%</Checkbox>

                    <Checkbox value="100%">100%</Checkbox>
                  </Checkbox.Group>
                </Col>
                <Col xl={6} lg={6} md={6} sm={2} xs={2}></Col>
                <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                  <Form.Item
                    label={<FormattedMessage id="formLanguage.form.addLandInf" />}
                    name="remarks"
                    rules={[
                      // { required: true, message: 'Field is necessary!' },
                      {
                        max: 200,
                        message: 'Remarks shoud be upto 200 characters',
                      },
                    ]}
                  >
                    <TextArea onKeyPress={KeyPressEvents.isInputVarchar} maxLength={201}></TextArea>
                  </Form.Item>
                </Col>
              </Row>
              {/* <Row style={{ marginTop: '20px' }}>
            <Col xl={4} lg={4} md={4} sm={24} xs={24}>
              <Radio.Group name="radiogroup" value={radiovalue} onChange={onChangeRadioButton}>
                <Radio value={'Yes'}>
                  <FormattedMessage id="villageForm1E.table.yes" />
                </Radio>
                <Radio value={'No'}>
                  <FormattedMessage id="villageForm1E.table.no" />
                </Radio>
              </Radio.Group>
            </Col>
            {radiovalue == 'Yes' ? (

            ) : (
              <Col xl={6} lg={6} md={6} sm={24} xs={24}>
                <>
                <label>
                  <b> Additional Land Revenue If Applicable : </b>
                </label>
              </>
              </Col>
            )} 
          </Row> */}
            </Form>

            <Row style={{ marginTop: 30 }}>
              <Col xl={9} lg={9} md={9} sm={24} xs={24}></Col>
              <Col xs={1} sm={1} md={1} lg={2} xl={2}>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    onClick={() => {
                      if (textForVillage && khataNoValue && khataOwnerName) {
                        onFinish();
                      } else if (textForVillage == null) {
                        message.info('Please Select Village');
                      } else if (khataNoValue == null) {
                        message.info('Please Enter Khata Number');
                      } else if (khataOwnerName == null || '') {
                        message.info('Please Enter Khata Number for Khatedar Name');
                      } else if (fiftyPercent == null || '') {
                        message.info('Please Tick Any One Option');
                      }
                    }}
                    loading={loadingForSave}
                  >
                    <FormattedMessage id="formLanguage.button.save" />
                  </Button>
                </Form.Item>
              </Col>
              <Col xl={1} lg={2} md={3} sm={4} xs={8}></Col>
              <Col xl={2} lg={2} md={1} sm={1} xs={1}>
                <Button
                  type=""
                  style={{ color: 'white', backgroundColor: 'orange' }}
                  onClick={resetData}
                >
                  <FormattedMessage id="formLanguage.button.reset" />
                </Button>
              </Col>
              <Col xl={10} lg={10} md={10} sm={24} xs={24}></Col>

              {/*   <Col xl={1} lg={2} md={3} sm={4} xs={8}></Col>
          <Col xl={2} lg={2} md={1} sm={1} xs={1}>
            <Button type="danger" onClick={pushToTableForm} htmlType="submit">
              <FormattedMessage id="formLanguage.button.cancel" />
            </Button>
          </Col> */}
            </Row>
          </>
        ) : (
          ''
        )}
      </Card>
      {isNirank1 == true && (
        <>
          <Alert
            message="टीप"
            description="सदर गावात वाढीव जमीन महसूल खातेदार नाहीत ."
            type="info"
            showIcon
          />
        </>
      )}
      <Card border={true}>
        <Row>
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            {isNirank1 == false && (
              <Button
                type="primary"
                style={{ marginBottom: '10px', float: 'right' }}
                onClick={() => setFormVisibility(false)}
              >
                <FormattedMessage id="formLanguage.button.add" />
              </Button>
            )}
          </Col>
        </Row>
        <Row>
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            {isNirank1 == false && (
              <Table
                loading={isLoading}
                rowSelection={{
                  type: selectionType,
                  ...rowSelection,
                }}
                onChange={() => rowSelection}
                rowKey={(row) => row.id}
                bordered={true}
                scroll={{ x: 100 }}
                dataSource={tableData}
                pagination={{ pageSizeOptions: [10, 20, 50, 100] }}
                columns={columns}
              />
            )}
          </Col>
        </Row>
        <Row style={{ marginTop: '25px' }}>
          <Col xl={2} lg={2} md={2} sm={24} xs={24}>
            <Popconfirm
              title={<FormattedMessage id="demandGeneration.table.popForSave" />}
              open={open}
              onConfirm={onFinalFinish}
              okButtonProps={{
                loading: confirmLoading,
              }}
              onCancel={cancel}
              // disabled={button1State}
              okText={<FormattedMessage id="demandGeneration.table.yes" />}
              cancelText={<FormattedMessage id="demandGeneration.table.no" />}
            >
              {isNirank1 == false && (
                <Button type="primary" onClick={poPconfirm}>
                  <FormattedMessage id="formLanguage.button.save" />
                </Button>
              )}
            </Popconfirm>
          </Col>
        </Row>
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
    </div>
  );
}

export default additionalLandRevenueForm;
