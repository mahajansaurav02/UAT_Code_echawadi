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
  const [flagDisableButton, setDisableFlagButton] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function handleChangeForkhataNo(event) {
    setDisableFlagButton(false);
    setKhataNoValue(event.target.value);
  }

  const addForm17 = () => {
    history.push({
      pathname: `/form/village-form-17/village-form`,
      state: {
        pageMode: 'Add',
      },
    });
  };

  const editForm17 = (record) => {
    // console.log('Record To be Pushed--<>', record);
    if (record.periodFromDate === 'Invalid date' && record.periodToDate === 'Invalid date') {
      history.push({
        pathname: `/form/village-form-17/village-form`,

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

          id: record.id,
        },
      });
    } else {
      history.push({
        pathname: `/form/village-form-17/village-form`,

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
          periodFromDate: record.periodFromDate,
          periodToDate: record.periodToDate,
          id: record.id,
        },
      });
    }
  };

  const viewForm17 = (record) => {
    history.push({
      pathname: `/form/village-form-17/village-form`,
      state: {
        pageMode: 'View',
        villageName: textForVillage,
        revenueYear: revenueYear,
        districtName: districtName,
        talukaName: talukaName,
        cCode: codeVillage,
        surveyHissaNo: record.surveyHissaNo,
        id: record.id,
        periodFromDate: moment(record.periodFromDate, 'DD/MM/YYYY').format('YYYY-MM-DD'),
        periodToDate: moment(record.periodToDate, 'DD/MM/YYYY').format('YYYY-MM-DD'),
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
    sendRequest(`${URLS.BaseURL}/form17/discardForm17?id=${recordId}`, 'DELETE', null, (res) => {
      if (res.status === 226) {
        setDataSource([]);
        message.success('Record Deleted!');
        // console.log('deleted !!!!');
        getForm17Data();
      }
    });
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
      title: <FormattedMessage id="villageForm17.table.khataNo" />,
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
      title: <FormattedMessage id="villageForm17.table.natureOfCase" />,
      dataIndex: 'natureOfCase',
    },
    {
      key: '7',
      title: <FormattedMessage id="villageForm17.table.areaAffected" />,
      dataIndex: 'areaAffected',
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
    {
      key: '11',
      title: <FormattedMessage id="villageForm17.table.periodOfYear" />,
      dataIndex: 'periodIfMoreThanOneYear',
    },
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

  useEffect(async () => {
    //  getData();
  }, []);

  const getForm17Data = async () => {
    setIsLoading(true);

    sendRequest(
      `${URLS.BaseURL}/form17/getForm17Data?districtCode=${districtCode}&talukaCode=${talukaCode}&khataNo=${khataNoValue}&cCode=${codeVillage}&revenueYear=${revenueYear}`,
      'GET',
      null,
      (res) => {
        // console.log('--test data--' + res.data.form17Data);
        setDisableFlagButton(true),
          setDataSource(
            res.data.form17Data.map((row, index) => ({
              id: row.id,
              srNo: index + 1,
              khataNo: row.khataNo == '' ? row.makhtaKhataNo : row.khataNo,
              surveyHissaNo: row.surveyHissaNo,
              totalArea: row.totalArea,
              uomOfTotalArea: row.uomOfTotalArea,
              assessment: row.assessment,
              personLiable: row.personLiable,
              natureOfCase: row.natureOfCase,
              areaAffected: row.areaAffected,
              uomOfTotalArea: row.uomOfTotalArea,
              areaAffected: row.areaAffected,
              amountOfJm: row.amountOfJm,
              amountOfZp: row.amountOfZp,
              amountOfGp: row.amountOfGp,
              periodIfMoreThanOneYear: row.periodIfMoreThanOneYear,
              makhtaKhataNo: row.makhtaKhataNo,
              // noteOfEntryInTalukaFormIV: row.noteOfEntryInTalukaFormIV,
              caseNo: row.caseNo,
              periodFromDate:
                row.periodFromDate != null
                  ? moment(row.periodFromDate, 'YYYY-MM-DD').format('YYYY-MM-DD')
                  : null,
              periodToDate:
                row.periodToDate != null
                  ? moment(row.periodToDate, 'YYYY-MM-DD').format('YYYY-MM-DD')
                  : null,
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

  return (
    <PageContainer>
      {/* content="View Form (View / Edit / Delete)" */}

      <Card bordered={false}>
        <Row>
          <Col xl={22} lg={22} md={22} sm={24} xs={24}>
            <center>
              <h2>
                <FormattedMessage id="villageForm17.table.village17table" />
              </h2>
            </center>
          </Col>
          <Col xl={2} lg={2} md={2} sm={2} xs={2}>
            {!isNirank && (
              <Button onClick={addForm17} type="primary">
                <FormattedMessage id="formLanguage.button.add" />
              </Button>
            )}
          </Col>
        </Row>
        {/* <Row>
          <Col xl={22} lg={22} md={22} sm={24} xs={24}>
            <center>
              <h2>
                <FormattedMessage id="villageForm17.table.village17table" />
              </h2>
            </center>
          </Col>
        </Row> */}
        {/* <Row style={{ marginBottom: 10, marginTop: '10px' }}> */}
        <VillageSelector
          pageType="withYear"
          setCodeVillage={setCodeVillage}
          setTextForVillage={setTextForVillage}
          onVillageChange={(setVillage, setDataSource)}
          yearChange={setRevenueYear}
          setIsNirank={setIsNirank}
        />
        <Row style={{ marginTop: '40px' }}>
          <Col span={8}>
            <Form>
              <Form.Item
                label={<FormattedMessage id="villageForm17.table.khataNo" />}
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
            {!isNirank && (
              <Button disabled={flagDisableButton} onClick={getForm17Data} type="primary">
                <FormattedMessage id="formLanguage.button.search" />
              </Button>
            )}
          </Col>
        </Row>
      </Card>
      {isNirank && (
        <Card>
          <Alert message="टीप" description="सदर गाव नमुना निरंक आहे." type="info" showIcon />
        </Card>
      )}
      <Card border={true}>
        <div>
          <Row>
            <Col xl={24} lg={24} md={24} sm={24} xs={24}>
              {!isNirank && (
                <Table
                  bordered
                  pagination={{ pageSize: 5 }}
                  columns={columns}
                  dataSource={dataSoruce}
                  loading={isLoading}
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
