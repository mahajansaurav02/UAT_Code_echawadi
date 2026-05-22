import React, { useEffect, useState } from 'react';
import {
  Card,
  Button,
  Table,
  Col,
  Row,
  Select,
  Input,
  Modal,
  Form,
  Space,
  message,
  Alert,
} from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { useHistory } from 'react-router-dom';
import { DeleteOutlined, EditTwoTone, EyeTwoTone } from '@ant-design/icons';
import useAxios from '@/components/eComponents/use-axios';
import URLS from '@/URLs/urls';
import VillageSelector from '@/components/eComponents/VillageSelector';
import { FormattedMessage, useModel } from 'umi';
import moment from 'moment';
import KeyPressEvents from '@/util/KeyPressEvents';

//for table############
function StepForm() {
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
  const [isNirank, setIsNirank] = useState(false);
  const [isNirank1, setIsNirank1] = useState();

  const [flagDisableButton, setDisableFlagButton] = useState(false);

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
      `${URLS.BaseURL}/restservice/getNirankForFourForm?cCode=${cCode1} `,
      'GET',
      null,
      (res) => {
        // var a = res?.data;
        console.log(res);
        const singleVal11 = res?.data?.find((obj) => obj?.formId === 'kajapa');
        console.log('singleVal data...', singleVal11);
        setSingleVal(res?.data?.find((obj) => obj?.formId === 'kajapa'));
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
    setDisableFlagButton(false);
    setKhataNoValue(event.target.value);
  }

  const addForm17 = () => {
    history.push({
      pathname: `/generate-revenue/village-form-17Abstract/village-form`,
      state: {
        pageMode: 'Add',
      },
    });
  };

  const editForm17 = (record) => {
    // console.log('Record To be Pushed--<>', record);
    if (record.periodFromDate === 'Invalid date' && record.periodToDate === 'Invalid date') {
      history.push({
        pathname: `/generate-revenue/village-form-17Abstract/village-form`,

        state: {
          pageMode: 'Edit',
          villageName: textForVillage,
          revenueYear: revenueYear,
          districtName: districtName,
          districtCode: districtCode,
          talukaName: talukaName,
          talukaCode: talukaCode,
          cCode: codeVillage,
          surveyHissaNo: record.surveyHissaNo,
          prayojanType: record.prayojanType,
          locationOfLand: record.locationOfLand,
          id: record.id,
          khataNo: record.khataNo,
        },
      });
    } else {
      history.push({
        pathname: `/generate-revenue/village-form-17Abstract/village-form`,

        state: {
          pageMode: 'Edit',
          villageName: textForVillage,
          revenueYear: revenueYear,
          districtName: districtName,
          districtCode: districtCode,
          talukaName: talukaName,
          talukaCode: talukaCode,
          cCode: codeVillage,
          surveyHissaNo: record.surveyHissaNo,
          // periodFromDate: record.periodFromDate,
          // periodToDate: record.periodToDate,
          prayojanType: record.prayojanType,
          locationOfLand: record.locationOfLand,
          id: record.id,
          khataNo: record.khataNo,
        },
      });
    }
  };

  const viewForm17 = (record) => {
    history.push({
      pathname: `/generate-revenue/village-form-17Abstract/village-form`,
      state: {
        pageMode: 'View',
        villageName: textForVillage,
        revenueYear: revenueYear,
        districtName: districtName,
        talukaName: talukaName,
        cCode: codeVillage,
        surveyHissaNo: record.surveyHissaNo,
        id: record.id,
        // periodFromDate: moment(record.periodFromDate, 'DD/MM/YYYY').format('YYYY-MM-DD'),
        // periodToDate: moment(record.periodToDate, 'DD/MM/YYYY').format('YYYY-MM-DD'),
      },
    });
  };
  const deleteForm17 = (record) => {
    setRecordId(record.id);
    setModalForDelete(true);
  };

  const deleteForm17ById = async () => {
    setModalForDelete(false);
    // console.log('id in state', recordId);
    sendRequest(
      `${URLS.BaseURL}/form17NoKaJaPa/discardForm17NoKaJaPa?id=${recordId}`,
      'DELETE',
      null,
      (res) => {
        if (res.status === 226) {
          setDataSource([]);
          message.success('Record Deleted!');
          // console.log('deleted !!!!');
          getForm17Data();
        }
      },
    );
  };

  const [dataSoruce, setDataSource] = useState([]);

  const columns = [
    {
      key: '1',
      title: <FormattedMessage id="formLanguage.form.serialNo" />,
      dataIndex: 'srNo',
    },
    {
      key: '2',
      title: <FormattedMessage id="villageForm17.form.khataNo" />,
      dataIndex: 'khataNo',
    },
    {
      key: '3',
      title: <FormattedMessage id="villageForm17.form.surveyHissaNo" />,
      dataIndex: 'surveyHissaNo',
    },

    {
      key: '3',
      title: <FormattedMessage id="formLanguage.table.totalArea" />,
      dataIndex: 'totalArea',
    },
    {
      key: '4',
      title: <FormattedMessage id="formLanguage.form.assessment" />,
      dataIndex: 'assessment',
    },
    {
      key: '5',
      title: <FormattedMessage id="villageForm17.table.personLiable" />,
      dataIndex: 'personLiable',
    },
    {
      key: '6',
      title: 'बिनशेती आदेश क्रमांक',
      dataIndex: 'orderNo',
    },
    {
      key: '7',
      title: 'बिनशेती क्षेत्र',
      dataIndex: 'areaAffected',
    },
    {
      key: '7',
      title: 'बिनशेती क्षेत्राचे स्थान',
      render: (record) => {
        return record.locationOfLand != '' ? <FormattedMessage id={record.locationOfLand} /> : '';
      },
    },
    {
      key: '7',
      title: 'प्रयोजन',
      dataIndex: 'prayojanType',
    },
    {
      key: '8',
      title: <FormattedMessage id="villageForm17.table.amountOfLR" />,
      dataIndex: 'amountOfJm',
    },
    {
      key: '9',
      title: <FormattedMessage id="villageForm17.table.amountOfLC" />,
      dataIndex: 'amountOfZp',
    },
    {
      key: '10',
      title: <FormattedMessage id="villageForm17.table.amountOfVP" />,
      dataIndex: 'amountOfGp',
    },
    // {
    //   key: '11',
    //   title: <FormattedMessage id="villageForm17.table.periodOfYear" />,
    //   dataIndex: 'periodIfMoreThanOneYear',
    // },
    // {
    //   key: '12',
    //   title: <FormattedMessage id="villageForm17.table.noteOfEntry" />,
    //   dataIndex: 'noteOfEntry',
    // },

    {
      key: '12',
      title: <FormattedMessage id="formLanguage.table.action" />,
      render: (record) => {
        return (
          <>
            <Row>
              <EditTwoTone onClick={() => editForm17(record)} />
              <DeleteOutlined
                onClick={() => deleteForm17(record)}
                style={{ color: 'red', marginLeft: 12 }}
              />
              <EyeTwoTone
                onClick={() => viewForm17(record)}
                style={{ color: 'violet', marginLeft: 12, marginTop: 10 }}
              />
            </Row>
          </>
        );
      },
    },
    /*     {
      key: '10',
      title: 'Note Of Entry In Taluka Form IV',
      dataIndex: 'noteOfEntryInTalukaFormIV',
    }, */
  ];
  const onCancelForDeleteModal = () => {
    setModalForDelete(false);
  };

  // useEffect(async () => {
  //   //  getData();
  // }, []);

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
  //     if (r.formId == 'kajapa' && r.isNirank == 'Y') {
  //       //alert(r.isNirank);
  //       setIsNirank1(true);
  //     }
  //   });
  // }, [isNirank1, villageName]);

  const getForm17Data = async () => {
    sendRequest(
      `${URLS.BaseURL}/form17NoKaJaPa/getForm17NoKaJaPaData?districtCode=${districtCode}&talukaCode=${talukaCode}&khataNo=${khataNoValue}&cCode=${codeVillage}&revenueYear=${revenueYear}`,
      'GET',
      null,
      (res) => {
        console.log('--test data--', res.data);
        setDisableFlagButton(true),
          setDataSource(
            res.data.form17NoKaJaPaData.map((row, index) => ({
              id: row.id,
              srNo: index + 1,
              khataNo: row.khataNo == '' ? row.makhtaKhataNo : row.khataNo,
              surveyHissaNo: row.surveyHissaNo,
              totalArea: row.totalArea,
              uomOfTotalArea: row.uomOfTotalArea,
              assessment: row.assessment,
              personLiable: row.personLiable,
              orderNo: row.orderNo,
              areaAffected: row.areaAffected,
              uomOfTotalArea: row.uomOfTotalArea,
              areaAffected: row.areaAffected,
              amountOfJm: row.amountOfJm,
              amountOfZp: row.amountOfZp,
              amountOfGp: row.amountOfGp,
              prayojanType: row.prayojanType,
              locationOfLand: row.locationOfLand,
              // periodIfMoreThanOneYear: row.periodIfMoreThanOneYear,
              // makhtaKhataNo: row.makhtaKhataNo,
              // noteOfEntryInTalukaFormIV: row.noteOfEntryInTalukaFormIV,
              // caseNo: row.caseNo,
              // periodFromDate:
              //   row.periodFromDate != null
              //     ? moment(row.periodFromDate, 'YYYY-MM-DD').format('YYYY-MM-DD')
              //     : null,
              // periodToDate:
              //   row.periodToDate != null
              //     ? moment(row.periodToDate, 'YYYY-MM-DD').format('YYYY-MM-DD')
              //     : null,
            })),
          );
        message.success('Records Fetched!');
      },
    );
  };

  return (
    <PageContainer>
      {/* content="View Form (View / Edit / Delete)" */}

      <Card bordered={false}>
        <h1>
          <center>
            गाव नमुना १७ मधील कजाप न झालेल्या बिनशेती जमिनींच्या सारा निश्चितीसाठी भरावयाची माहिती
          </center>
        </h1>

        <Row>
          <Col span={21}></Col>
          <Col span={3}>
            {isNirank1 == false && (
              <Button onClick={addForm17} type="primary" style={{ margin: 10 }}>
                <FormattedMessage id="formLanguage.button.add" />
              </Button>
            )}
          </Col>
        </Row>
        {/* <Row style={{ marginBottom: 10, marginTop: '10px' }}> */}
        <VillageSelector
          pageType="withYear"
          setCodeVillage={setCodeVillage}
          setTextForVillage={setTextForVillage}
          onVillageChange={(setVillage, setDataSource)}
          yearChange={setRevenueYear}
          setIsNirank={setIsNirank}
        />
        {isNirank1 == false && (
          <Row style={{ marginTop: '40px' }}>
            <Col span={8}>
              <Form>
                <Form.Item
                  label={<FormattedMessage id="villageForm17.form.khataNo" />}
                  type="number"
                  name="maktaKhataNo"
                  rules={[{ required: true, message: 'Please Enter Khata Number!!' }]}
                  style={{ width: 300 }}
                >
                  <Input
                    onKeyPress={KeyPressEvents.isInputNumber}
                    maxLength={40}
                    onChange={handleChangeForkhataNo}
                  />
                </Form.Item>
              </Form>
            </Col>

            <Col span={8}>
              <Button disabled={flagDisableButton} onClick={getForm17Data} type="primary">
                <FormattedMessage id="formLanguage.button.search" />
              </Button>
            </Col>
          </Row>
        )}
      </Card>
      {isNirank1 == true && (
        <>
          <Alert
            message="टीप"
            description="सदर गावात कजाप न झालेल्या बिनशेती जमिनी प्रकरण नाही."
            type="info"
            showIcon
          />
        </>
      )}
      <Card border={true}>
        <div>
          <Row>
            <Col span={23}>
              {isNirank1 == false && (
                <Table
                  bordered
                  pagination={{ pageSize: 5 }}
                  columns={columns}
                  dataSource={dataSoruce}
                  style={{ width: '100%' }}
                />
              )}
            </Col>
          </Row>
        </div>
        <Modal
          visible={modalForDelete}
          okText="Yes"
          okType="danger"
          onCancel={onCancelForDeleteModal}
          onOk={deleteForm17ById}
        >
          <FormattedMessage id="formLanguage.form.popForDelete" />
        </Modal>
      </Card>
    </PageContainer>
  );
}
export default StepForm;
