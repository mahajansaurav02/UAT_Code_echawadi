import {
  Card,
  message,
  DatePicker,
  Button,
  Form,
  Input,
  Select,
  Row,
  Col,
  Divider,
  Popconfirm,
  Checkbox,
  Table,
  Alert,
} from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import ValidationPatterns from '@/components/eComponents/ValidationPatterns';
import { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import moment from 'moment';
import VillageSelector from '@/components/eComponents/VillageSelector';
import URLS from '@/URLs/urls';
import useAxios from '@/components/eComponents/use-axios';
import { FormattedMessage, useModel } from 'umi';
import ValidationExpressions from '@/util/ValidationExpressions';
import KeyPressEvents from '@/util/KeyPressEvents';
import { useForm } from 'antd/lib/form/Form';
import { check } from 'prettier';
import { Backdrop, CircularProgress } from '@mui/material';

function NirankForm() {
  const { sendRequest } = useAxios();
  const { districtName, talukaName, servarthId, districtCode, talukaCode, niranks, villageData } =
    useModel('details');
  const location = useLocation();
  const [textForVillage, setTextForVillage] = useState();
  const [loading, setLoading] = useState(false);
  const [form1] = Form.useForm();

  const [codeVillage, setCodeVillage] = useState('');
  const [village, setVillage] = useState([]);
  const [textVillage, setTextVillage] = useState('');
  const [buttonVisible, setButtonVisible] = useState(false);
  let history = useHistory();
  const [datePicker, setDatePicker] = useState();
  const [revenueYear, setRevenueYear] = useState(null);
  const defaultCheckedList = [];
  const [checks, setChecks] = useState();
  const defaultCheckedListCom = [];
  const [checks1, setChecks1] = useState(defaultCheckedListCom);
  const [isNirank, setIsNirank] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [flagForNirank, setFlagForNirank] = useState();
  const [flagForCompleted, setFlagForCompleted] = useState();
  const [tableData, setTableData] = useState([]);
  const [selectionType, setSelectionType] = useState('radio');
  const [villageForms, setVillageForms] = useState([]);
  const [selectedRows, setSelectedRows] = useState();
  const [selectedRowKeys, setRowKeys] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [open, setOpen] = useState(false);

  // let formId = checks.toLocaleString();
  // const [isNirank, setIsNirank] = useState();
  // useEffect(() => {
  //   /* if (revenueYear) */ getNirankData();
  // }, [revenueYear]);

  useEffect(() => {
    getVillageForms();
  }, []);

  const getVillageForms = async () => {
    sendRequest(`${URLS.BaseURL}/restservice/getAllVillageForm`, 'GET', null, (res) => {
      setVillageForms(
        res.data.villageFormMaster.map((vfm) => {
          return {
            ...vfm,
            formName: vfm.formNameMr,
            isNirank: false,
            isCompleted: false,
          };
        }),
      );
      // message.success('Records Fetched !');
    });
  };

  // const onSelectChange = (selectedRowKeys, selectedRows) => {
  //   setRowKeys(selectedRowKeys);
  // };
  // useEffect(() => {
  //   setChecks([]);
  //   niranks
  //     ?.filter((r) => r.cCode === codeVillage)
  //     .forEach((r) => {
  //       console.log(codeVillage, r.formId, r.formId.split(','));
  //       setChecks(r.formId.split(','));
  //     });
  //   console.log(niranks?.filter((r) => r.cCode === codeVillage).map((r) => r.formId.split(',')));
  // }, [revenueYear]);

  //  const rowSelection = {
  //    selectedRowKeys,
  //    selectedRows,
  //    onChange: onSelectChange,
  // };

  // const onChange = (e) => {
  //   console.log('checked = ', e);

  //   setChecks(e[0]);
  //   // var setFlagIsNirank = {
  //   //   revenueYear: revenueYear,
  //   //   isNirank: 'Y',
  //   //   formId: checks,
  //   //   districtCode: districtCode,
  //   //   talukaCode: talukaCode,
  //   //   cCode: codeVillage,
  //   // };

  //   // setFlagForNirank(setFlagIsNirank);
  // };

  // const onChange1 = (e) => {
  //   console.log('checked = ', e);
  //   setChecks1(e[0]);
  //   // var setFlagIsCompleted = {
  //   //   revenueYear: revenueYear,
  //   //   isCompleted: 'N',
  //   //   formId: checks1,
  //   //   districtCode: districtCode,
  //   //   talukaCode: talukaCode,
  //   //   cCode: codeVillage,
  //   // };
  //   // setFlagForCompleted(setFlagIsCompleted);
  // };

  // const onChangeOfNirank = (record, checked) => {
  //   console.log('recordddd = ', record);
  //   console.log('checked = ', checked);
  //   // setChecks1(e[0]);
  //   // var setFlagIsCompleted = {
  //   //   revenueYear: revenueYear,
  //   //   isCompleted: 'N',
  //   //   formId: checks1,
  //   //   districtCode: districtCode,
  //   //   talukaCode: talukaCode,
  //   //   cCode: codeVillage,
  //   // };
  //   // setFlagForCompleted(setFlagIsCompleted);
  // };

  // const cancelForm = () => {
  //   history.push({
  //     pathname: '/homepage',
  //   });
  // };

  useEffect(() => {
    // console.log('kiran dada');
    if (tableData.length != 0) {
      // console.log('kumar dada');
      let bghu = villageForms.map((vfm) => {
        return {
          ...vfm,
          id: tableData.find((t) => t.formId == vfm.formId)?.id,
          // formName: tableData.find((t) => t.formId == vfm.formId)?.formName,
          isCompleted:
            tableData.find((t) => t.formId == vfm.formId)?.isCompleted == 'Y' ? true : false,
          isNirank: tableData.find((t) => t.formId == vfm.formId)?.isNirank == 'Y' ? true : false,
        };
      });
      // console.log('rushi dada');
      // console.log('bghu', bghu);
      setVillageForms(bghu);
    }
  }, [tableData]);

  // useEffect(() => {
  //   console.log('**villageForms**', villageForms);
  // }, [villageForms]);

  const getNirankData = async () => {
    setOpen(!open);

    sendRequest(
      `${URLS.BaseURL}/restservice/getNirankandCompleted?cCode=${codeVillage}&revenueYear=${revenueYear}`,
      'GET',
      null,
      (res) => {
        let dataa = res.data.nirank.map((row, index) => ({
          srNo: index + 1,
          id: row.id,
          formId: row.formId,
          isCompleted: row.isCompleted,
          isNirank: row.isNirank,
          // formName: villageForms?.find((v) => v?.formId == row.formId)?.formName,
          // isCompleted: row.isCompleted == 'Y' ? true : false,
          // isNirank: row.isNirank == 'Y' ? true : false,
        }));
        // console.log('dataa**', dataa);
        setTableData(dataa);
        setShowTable(true);
        message.success('Records Fetched !');
        setOpen(false);
      },
      (err) => {
        setOpen(false);
      },
    );
  };

  const saveForm = async (record) => {
    setOpen(!open);

    const nirank = {
      ...record,

      districtCode: districtCode,
      talukaCode: talukaCode,
      cCode: codeVillage,
      revenueYear: revenueYear,
      isNirank: isNirank ? 'Y' : 'N',
      isCompleted: isCompleted ? 'Y' : 'N',
    };

    // console.log('RequestBody', nirank);

    sendRequest(
      `${URLS.BaseURL}/restservice/persistNirankandCompleted`,
      'POST',
      nirank,
      (res) => {
        if (res.status === 200) {
          message.success('Data Saved!!');
          history.push({
            pathname: '/user/login',
          });
        }
        setLoading(false);
        setOpen(false);
      },
      (err) => {
        setLoading(false);
        setOpen(false);
      },
    );
  };

  const columns = [
    {
      title: <FormattedMessage id="formLanguage.form.formName" />,
      dataIndex: 'formName',
      key: 'name',
    },
    {
      title: <FormattedMessage id="formLanguage.form.isNirank" />,
      dataIndex: 'isNirank',
      key: 'nirank',
      render: (record) => (
        <Checkbox
          onChange={(e) => {
            setIsNirank(e.target.checked), setIsCompleted(e.target.checked);
          }}
          // value={() => {
          //   console.log('checkedddd', record), record;
          // }}
          defaultChecked={record}
        />
      ),
    },
    {
      title: <FormattedMessage id="formLanguage.form.isCompleted" />,
      dataIndex: 'isCompleted',
      key: 'workProgress',
      render: (record) => (
        <Checkbox onChange={(e) => setIsCompleted(e.target.checked)} defaultChecked={record} />
      ),
    },
    {
      key: '9',
      title: <FormattedMessage id="formLanguage.table.action" />,
      width: '120px',
      render: (record) => {
        return (
          <>
            <Row>
              <Col>
                <Button
                  type="primary"
                  onClick={() => {
                    if (textForVillage && revenueYear) {
                      saveForm(record);
                    } else if (textForVillage == null) {
                      message.info('Please Select Village');
                    } else if (revenueYear == null) {
                      message.info('Please Select Revenue Year');
                    }
                  }}
                  style={{ color: 'white' }}
                >
                  जतन करा
                </Button>
              </Col>
            </Row>
          </>
        );
      },
    },
  ];

  return (
    <div>
      <Card>
        <Row>
          <Col xl={22} lg={22} md={22} sm={22} xs={22}>
            <VillageSelector
              pageType="withYear"
              setCodeVillage={setCodeVillage}
              setTextForVillage={setTextForVillage}
              onVillageChange={setVillage}
              yearChange={setRevenueYear}
              setIsNirank={setIsNirank}
            />
          </Col>
          <Col xl={2} lg={2} md={2} sm={2} xs={2}>
            <Button
              style={{ marginTop: '10px' }}
              type="primary"
              // onClick={getNirankData}
              onClick={() => {
                if (textForVillage && revenueYear) {
                  getNirankData();
                } else if (textForVillage == null) {
                  message.info('Please Select Village');
                } else if (revenueYear == null) {
                  message.info('Please Select Revenue Year');
                }
              }}
            >
              <FormattedMessage id="formLanguage.button.search" />
            </Button>
          </Col>
        </Row>
      </Card>
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Card>
        <Alert
          message="टीप"
          description="एका वेळेस एकच गाव नमुना निरंक किंवा कामकाज पूर्ण पर्याय निवडून त्या समोरील जतन बटनावर क्लिक करा."
          type="info"
          showIcon
        />
        {showTable && (
          <>
            <Divider orientation="left">निरंक गाव व कामकाज पुर्ण असलेले नमुने निवडा</Divider>
            <Table
              // rowSelection={{
              //   type: selectionType,
              //   ...rowSelection,
              // }}
              // onChange={() => rowSelection}
              rowKey={(row) => row.id}
              bordered
              columns={columns}
              dataSource={villageForms}
            />
          </>
        )}
      </Card>
    </div>
  );
}

export default NirankForm;
