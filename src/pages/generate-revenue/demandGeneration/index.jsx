import { PageContainer } from '@ant-design/pro-layout';
import React, { useState, useEffect, createContext, useContext } from 'react';
import { useModel } from 'umi';
import styles from './report.module.css';
import { FormattedMessage } from 'umi';

import {
  Button,
  Card,
  Col,
  Row,
  Select,
  Input,
  Popconfirm,
  message,
  Table,
  Alert,
  notification,
  Space,
} from 'antd';
import Selector from '@/pages/transactions/common/selector';
import Axios from 'axios';
import { useHistory, useLocation } from 'react-router-dom';
import URLS from '@/URLs/urls';

import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import VillageSelector from '@/components/eComponents/VillageSelector';
import useAxios from '@/components/eComponents/use-axios';

function GRevenue() {
  const [button1State, setButton1State] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const { districtName, servarthId, districtCode, talukaCode } = useModel('details');
  const { sendRequest } = useAxios();
  // const [first, setfirst] = useState(second)
  // flags = 'Ok';

  function poPconfirm(e) {
          setButton1State(true);

    demandConfirm();

    console.log(button1State,"check button state")
    // console.log(e);
  }
  function success(e) {
    demandConfirm();
    // console.log(e);
    message.success('Demand Generate Successfully!!!');
  }
  function cancel(e) {
    // console.log(e);
    message.error('Request Cancelled !!!');
  }
  function poPconfirmForMod(e) {
    if (objForModification === '') {
      message.info('Please Select Records');
    }
    saveForModification();
    // console.log(e);
  }
  function cancelForMod(e) {
    // console.log(e);
    message.error('Request Cancelled !!!');
  }
  let history = useHistory();

  const [data, setData] = useState([]);
  const [viewAlert, setViewAlert] = useState(false);
  const [state, setState] = useState([]);
  const [codeVillage, setCodeVillage] = useState('');
  const [flagCalculateDemand, setFlagCalculateDemand] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [textForVillage, setTextForVillage] = useState();
  const [isNirank, setIsNirank] = useState(false);

  const [objForModification, setObjForModication] = useState();
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [objForGeneration, setObjForGeneration] = useState();
  const [revenueYear, setRevenueYear] = useState();
  const [khataNumber, setKhataNumber] = useState();
  const [selectedRows, setSelectedRows] = useState();
  const [resestClicked, setResestClicked] = useState(false);
  const [selectedRowKeys, setRowKeys] = useState([]);

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            शोधा
          </Button>
          <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            रीसेट
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            फिल्टर करा
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex] ? record[dataIndex].toString().toLowerCase() == value.toLowerCase() : '',
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText();
  };

  const home = () => {
    history.push('/homepage');
  };

  const openNotification = (type, placement) => {
    notification[type]({
      message: 'Demand Generation ',
      description: `Data for Village ${textForVillage} fetched !`,
      placement,
      onClick: () => {
        // function on notification click can be added here!
        // console.log('Notification Clicked!');
      },
    });
  };

  const demandConfirm = async () => {
    setConfirmLoading(true);
    if (objForGeneration && selectedRows != []) {
      setButton1State(true);
      // if (button1State) {
      // message.info('जाऊद्या ना भाऊसाहेब...!!!');
      // }
      // console.log('objForGeneration in demand Confirm', objForGeneration);
      sendRequest(
        `${URLS.BaseURL}/landRevenue/persistLRDemand`,
        'POST',
        objForGeneration,
        (res) => {
          if (res.status === 201) {
            message.success('Demand Generated For Selected Records!');
            setState();
            setFlagCalculateDemand(false);
            setButton1State(false);
            setObjForModication();
            setObjForGeneration();
            setSelectedRows();
          }
        },
      );
      setConfirmLoading(false);
    } else {
      message.info('Please Select Records!');
      setConfirmLoading(false);
    }

    // await Axios.post(`${BaseURL}`, article);
  };

  //!API needs to be changed takes only one input (cCode)
  const getData = async () => {
    setFlagCalculateDemand(true);
    setIsLoading(true);
    const article = {
      revenueYear: revenueYear,
      districtCode: districtCode,
      talukaCode: talukaCode,
      cCode: codeVillage,
    };

    sendRequest(
      `${URLS.BaseURL}/landRevenue/generateRevenue`,
      'POST',
      article,
      (res) => {
        // console.log('log for status', res.status, res.data, res);

    setState(
  res.data
    .filter(row => row.khataOwnerName && row.khataOwnerName.trim() !== '')
    .map((row, index) => ({
      id: row.khataNo,
      khataNo: row.khataNo,
      khataOwnerName: row.khataOwnerName,
      jmBindumala: row.jmBindumala,
      zpBindumala: row.zpBindumala,
      gpBindumala: row.gpBindumala,
      jmDumala: row.jmDumala,
      zpDumala: row.zpDumala,
      gpDumala: row.gpDumala,
      jmAkrushik: row.jmAkrushik,
      zpAkrushik: row.zpAkrushik,
      gpAkrushik: row.gpAkrushik,
      jmSankirn: row.jmSankirn,
      zpSankirn: row.zpSankirn,
      gpSankirn: row.gpSankirn,
      jmVajasut: row.jmVajasut,
      gpVajasut: row.gpVajasut,
      zpVajasut: row.zpVajasut,
      addlLandRevenue: row.addlLandRevenue,
      educationalCess: row.educationalCess,
      addlEducationalCess: row.addlEducationalCess,
      employeeGuaranteeScheme: row.employeeGuaranteeScheme,
      netAmount: row.netAmount,
      netPending: row.netPending,
      preYearPendingJm: row.preYearPendingJm,
      preYearPendingZp: row.preYearPendingZp,
      preYearPendingGp: row.preYearPendingGp,
      preYearPendingAddlLandRevenue: row.preYearPendingAddlLandRevenue,
      preYearPendingEducationalCess: row.preYearPendingEducationalCess,
      preYearPendingAddlEducationalCess: row.preYearPendingAddlEducationalCess,
      preYearPendingEmployeeGuaranteeScheme: row.preYearPendingEmployeeGuaranteeScheme,
      miscellaneousAmount: row.miscellaneousAmount,
      area: row.area,
      assessment: row.assessment,
      srNo: index + 1, 
      surveyHissaNo: row.surveyHissaNo,
      uom: row.uom,
      preYearPendingNaCess: row.preYearPendingNaCess,
      preYearSankirnJmWith: row.preYearSankirnJmWith,
      preYearSankirnJmWithout: row.preYearSankirnJmWithout,
      preYearNoticeFee: row.preYearNoticeFee,
    })),
);



        setIsLoading(false);
        setFlagCalculateDemand(false);
        message.success('Demand Generate Successfully!!!');
        //setViewAlert(true);
        openNotification('success', 'bottomRight');
      },
      (err) => {
        setIsLoading(false);
        message.info('No Records Found !');
      },
    );
  };

  const resetTable = () => {
    setResestClicked(true);
    setState();
    setFlagCalculateDemand(false);
    setSelectedRows([]);
    setRowKeys([]);
  };

  const saveForModification = async () => {
    // console.log('object to be sent for modification', objForModification);
    if (objForModification && selectedRows != []) {
      sendRequest(
        `${URLS.BaseURL}/landRevenue/persistLRDemand`,
        'POST',
        objForModification,
        (res) => {
          if (res.status === 201) {
            message.success('Selected Records Forwarded For Modification');
            setState();
            setObjForModication();
            setObjForGeneration();
            setSelectedRows();
            history.push({
              pathname: '/generate-revenue/demandModification',
              state: {
                revenueYear: revenueYear,
                districtCode: districtCode,
                talukaCode: talukaCode,
                cCode: codeVillage,
                villageName: textForVillage,
                khataNo: khataNumber,
              },
            });
          }
        },
      );
    } else {
      message.info('Please Select Records!');
    }
  };

  const columns = [
    {
      //अनु क्रमांक
      title: <FormattedMessage id="demandGeneration.table.srNo" defaultMessage="अ.क्र" />,
      dataIndex: 'srNo',
      width: 75,
    },
    {
      title: <FormattedMessage id="demandGeneration.table.khataNo" defaultMessage="खाता क्र" />,
      dataIndex: 'khataNo',
      width: 75,
      ...getColumnSearchProps('khataNo'),
    },
    {
      //खातेदाराचे नाव
      title: (
        <FormattedMessage
          id="demandGeneration.table.khataOwnerName"
          defaultMessage="खातेदाराचे नाव"
        />
      ),
      dataIndex: 'khataOwnerName',
      width: 120,
    },
    {
      title: <FormattedMessage id="demandGeneration.table.area" defaultMessage="क्षेत्र" />,
      dataIndex: 'area',
      width: 75,
    },
    {
      title: <FormattedMessage id="demandGeneration.table.assessment" defaultMessage="मूल्यांकन" />,
      dataIndex: 'assessment',
      width: 85,
    },
    {
      //ज.म. बिंदुमाला
      title: (
        <FormattedMessage id="demandGeneration.table.lrBindumala" defaultMessage="ज.म. बिनदुमाला" />
      ),
      dataIndex: 'jmBindumala',
      width: 90,
    },
    {
      //जि.प. बिंदुमाला
      title: (
        <FormattedMessage
          id="demandGeneration.table.zpBindumala"
          defaultMessage="जि.प. बिनदुमाला"
        />
      ),
      dataIndex: 'zpBindumala',
      width: 90,
    },
    {
      //ग्रा.पं. बिंदुमाला
      title: (
        <FormattedMessage
          id="demandGeneration.table.vpBindumala"
          defaultMessage="ग्रा.पं. बिनदुमाला"
        />
      ),
      dataIndex: 'gpBindumala',
      width: 90,
    },
    //Dumala
    {
      //ज.म. दुमाला
      title: <FormattedMessage id="demandGeneration.table.lrdumala" defaultMessage="ज.म. दुमाला" />,
      dataIndex: 'jmDumala',
      width: 75,
    },
    {
      title: (
        <FormattedMessage id="demandGeneration.table.zpdumala" defaultMessage="जि.प. दुमाला" />
      ),
      dataIndex: 'zpDumala',
      width: 75,
    },
    {
      title: (
        <FormattedMessage id="demandGeneration.table.vpdumala" defaultMessage="ग्रा.पं. दुमाला" />
      ),
      dataIndex: 'gpDumala',
      width: 75,
    },
    //Sankirn
    {
      title: (
        <FormattedMessage id="demandGeneration.table.lrSankirn" defaultMessage="ज.म. संकीर्ण" />
      ),
      dataIndex: 'jmSankirn',
      width: 75,
    },
    {
      title: (
        <FormattedMessage id="demandGeneration.table.zpSankirn" defaultMessage="जि.प. संकीर्ण" />
      ),
      dataIndex: 'zpSankirn',
      width: 75,
    },
    {
      title: (
        <FormattedMessage id="demandGeneration.table.vpSankirn" defaultMessage="ग्रा.पं. संकीर्ण" />
      ),
      dataIndex: 'gpSankirn',
      width: 75,
    },
    //Akrushik
    {
      title: (
        <FormattedMessage id="demandGeneration.table.lrAkrushik" defaultMessage="ज.म. आक्रोशिक" />
      ),
      dataIndex: 'jmAkrushik',
      width: 85,
    },
    {
      title: (
        <FormattedMessage id="demandGeneration.table.zpAkrushik" defaultMessage="जि.प. आक्रोशिक" />
      ),
      dataIndex: 'zpAkrushik',
      width: 85,
    },
    {
      title: (
        <FormattedMessage
          id="demandGeneration.table.vpAkrushik"
          defaultMessage="'ग्रा.पं. आक्रोशिक'"
        />
      ),
      dataIndex: 'gpAkrushik',
      width: 85,
    },
    //Vajasut
    {
      title: (
        <FormattedMessage id="demandGeneration.table.lrVajasut" defaultMessage="ज.म. वजासुट" />
      ),
      dataIndex: 'jmVajasut',
      width: 75,
    },
    {
      title: (
        <FormattedMessage id="demandGeneration.table.zpVajasut" defaultMessage="जि.प. वजासुट" />
      ),
      dataIndex: 'zpVajasut',
      width: 75,
    },
    {
      title: (
        <FormattedMessage id="demandGeneration.table.vpVajasut" defaultMessage="ग्रा.पं. वजासुट" />
      ),
      dataIndex: 'gpVajasut',
      width: 75,
    },
    //Total Amount to add logic here
    {
      title: (
        <FormattedMessage
          id="demandGeneration.table.addLandRevenue"
          defaultMessage="वाढीव जमीन महसूल"
        />
      ),
      dataIndex: 'addlLandRevenue',
      width: 85,
    },
    //Education Cess
    {
      title: (
        <FormattedMessage
          id="demandGeneration.table.educationalCess"
          defaultMessage="शिक्षण उपकर"
        />
      ),
      dataIndex: 'educationalCess',
      width: 85,
    },
    {
      title: (
        <FormattedMessage
          id="demandGeneration.table.addlEducationalCess"
          defaultMessage="वाढीव शिक्षण उपकर"
        />
      ),
      dataIndex: 'addlEducationalCess',
      width: 85,
    },
    {
      title: <FormattedMessage id="demandGeneration.table.EGS" defaultMessage="रो.ह. उपकर" />,
      dataIndex: 'employeeGuaranteeScheme',
      width: 100,
    },
    {
      title: (
        <FormattedMessage
          id="demandGeneration.table.preYearPendingJm"
          defaultMessage="मागील ज.म."
        />
      ),
      dataIndex: 'preYearPendingJm',
      width: 75,
    },
    {
      title: (
        <FormattedMessage
          id="demandGeneration.table.preYearPendingZp"
          defaultMessage="मागील जि.प."
        />
      ),
      dataIndex: 'preYearPendingZp',
      width: 75,
    },
    {
      title: (
        <FormattedMessage
          id="demandGeneration.table.preYearPendingGp"
          defaultMessage="मागील ग्रा.पं."
        />
      ),
      dataIndex: 'preYearPendingGp',
      width: 75,
    },
    {
      title: (
        <FormattedMessage
          id="demandGeneration.table.preYearPendingAddlLandRevenue"
          defaultMessage="मागील वाढीव जमीन महसूल"
        />
      ),
      dataIndex: 'preYearPendingAddlLandRevenue',
      width: 85,
    },
    {
      title: (
        <FormattedMessage
          id="demandGeneration.table.preYearPendingEducationalCess"
          defaultMessage="मागील शिक्षण उपकर"
        />
      ),
      dataIndex: 'preYearPendingEducationalCess',
      width: 85,
    },
    {
      title: (
        <FormattedMessage
          id="demandGeneration.table.preYearPendingAddlEducationalCess"
          defaultMessage="मागील वाढीव शिक्षण उपकर"
        />
      ),
      dataIndex: 'preYearPendingAddlEducationalCess',
      width: 85,
    },
    {
      title: (
        <FormattedMessage
          id="demandGeneration.table.preYearPendingEmployeeGuaranteeScheme"
          defaultMessage="मागील वाढीव रो.ह. उपकर"
        />
      ),
      dataIndex: 'preYearPendingEmployeeGuaranteeScheme',
      width: 100,
    },
    {
      title: (
        <FormattedMessage id="demandGeneration.preYearPendingNaCess" defaultMessage="अकृषिक कर" />
      ),
      dataIndex: 'preYearPendingNaCess',
      width: 100,
    },
    {
      title: (
        <FormattedMessage
          id="demandGeneration.preYearSankirnJmWith"
          defaultMessage="संकीर्ण जमीन महसूल स्‍थानिक उपकरांसह"
        />
      ),
      dataIndex: 'preYearSankirnJmWith',
      width: 100,
    },
    {
      title: (
        <FormattedMessage
          id="demandGeneration.preYearSankirnJmWithout"
          defaultMessage="संकीर्ण जमीन महसूल स्‍थानिक उपकरांशिवाय"
        />
      ),
      dataIndex: 'preYearSankirnJmWithout',
      width: 100,
    },
    {
      title: (
        <FormattedMessage id="demandGeneration.preYearNoticeFee" defaultMessage="नोटिसीचा खर्च" />
      ),
      dataIndex: 'preYearNoticeFee',
      width: 100,
    },
    // {
    //   title: (
    //     <FormattedMessage
    //       id="demandGeneration.table.miscellaneousAmount"
    //       defaultMessage="विविध रक्कम"
    //     />
    //   ),
    //   dataIndex: 'miscellaneousAmount',
    //   width: 75,
    // },

    {
      title: (
        <FormattedMessage
          id="demandGeneration.table.netAmount"
          defaultMessage="एकूण निव्वळ रक्कम"
        />
      ),
      dataIndex: 'netAmount',
      width: 75,
    },
  ];
  // !no id present in response mapped khata number instead
  const onSelectChange = (selectedRowKeys, selectedRows) => {
    setRowKeys(selectedRowKeys);
    // console.log('selectedRowKeys', selectedRowKeys, 'selectedRows', selectedRows);
    var selectedRecords = [];
    selectedRows.map((row) => {
      //? mapped all the data here!
      selectedRecords.push({
        khataNo: row.khataNo,
        khataOwnerName: row.khataOwnerName,
        jmBindumala: row.jmBindumala,
        zpBindumala: row.zpBindumala,
        gpBindumala: row.gpBindumala,
        jmDumala: row.jmDumala,
        zpDumala: row.zpDumala,
        gpDumala: row.gpDumala,
        jmAkrushik: row.jmAkrushik,
        zpAkrushik: row.zpAkrushik,
        gpAkrushik: row.gpAkrushik,
        jmSankirn: row.jmSankirn,
        zpSankirn: row.zpSankirn,
        gpSankirn: row.gpSankirn,
        jmVajasut: row.jmVajasut,
        gpVajasut: row.gpVajasut,
        zpVajasut: row.zpVajasut,
        addlLandRevenue: row.addlLandRevenue,
        educationalCess: row.educationalCess,
        addlEducationalCess: row.addlEducationalCess,
        employeeGuaranteeScheme: row.employeeGuaranteeScheme,
        preYearPendingJm: row.preYearPendingJm,
        preYearPendingZp: row.preYearPendingZp,
        preYearPendingGp: row.preYearPendingGp,
        preYearPendingAddlLandRevenue: row.preYearPendingAddlLandRevenue,
        preYearPendingEducationalCess: row.preYearPendingEducationalCess,
        preYearPendingAddlEducationalCess: row.preYearPendingAddlEducationalCess,
        preYearPendingEmployeeGuaranteeScheme: row.preYearPendingEmployeeGuaranteeScheme,
        miscellaneousAmount: row.miscellaneousAmount,
        area: row.area,
        assessment: row.assessment,
        netAmount: row.netAmount,
        netPending: row.netPending,
        surveyHissaNo: row.surveyHissaNo,
        uom: row.uom,
        preYearPendingNaCess: row.preYearPendingNaCess,
        preYearSankirnJmWith: row.preYearSankirnJmWith,
        preYearSankirnJmWithout: row.preYearSankirnJmWithout,
        preYearNoticeFee: row.preYearNoticeFee,
      });
      setKhataNumber(row.khataNo);
    });

    var objForModifiactionApi = {
      revenueYear: revenueYear,
      activeFlag: 'M',
      districtCode: districtCode,
      talukaCode: talukaCode,
      cCode: codeVillage,
      khataNo: khataNumber,
      lstLandRevenueDemandDao: selectedRecords,
    };
    var objForGenerateApi = {
      revenueYear: revenueYear,
      activeFlag: 'Y',
      districtCode: districtCode,
      talukaCode: talukaCode,
      cCode: codeVillage,
      khataNo: khataNumber,
      lstLandRevenueDemandDao: selectedRecords,
    };
    setObjForModication(objForModifiactionApi);
    setObjForGeneration(objForGenerateApi);
  };

  const rowSelection = {
    selectedRowKeys,
    selectedRows,
    onChange: onSelectChange,
  };
  const disableButtonTimer = () => {
    setFlagCalculateDemand(true);
    setTimeout(() => setFlagCalculateDemand(false), 2000);
  };
  const handleOnChangeForVillage = () => {
    setTextForVillage;
    setState('');
  };
  const [selectionType, setSelectionType] = useState('checkbox');
  return (
    <PageContainer>
      <div>
        {viewAlert && (
          <div
            style={{
              display: 'block',
            }}
          >
            <Alert
              message={`Land Revenue records for ${textForVillage} retrieved from DB`}
              type="success"
              closable
            />
          </div>
        )}
        <Card bordered={true} style={{ marginTop: 7.5 }}>
          <VillageSelector
            pageType="withYear"
            setCodeVillage={setCodeVillage}
            setTextForVillage={setTextForVillage}
            onVillageChange={(setFlagCalculateDemand, setState)}
            yearChange={setRevenueYear}
            setIsNirank={setIsNirank}
          />
          <Row>
            <Col span={4}>
              <Button
                type="primary"
                style={{ marginLeft: '70' }}
                disabled={flagCalculateDemand}
                onClick={() => {
                  if (textForVillage && revenueYear) {
                    getData();
                  } else if (textForVillage == null) {
                    message.info('Please Select Village');
                    disableButtonTimer();
                  } else if (revenueYear == null) {
                    message.info('Please Select Revenue Year');
                    disableButtonTimer();
                  } else {
                    message.info('Please Select Village & Revenue Year');
                  }
                }}
              >
                <FormattedMessage
                  id="demandGeneration.button.calculateDemand"
                  defaultMessage=" मागणीची गणना करा"
                />
              </Button>
            </Col>
          </Row>
          <Card style={{ marginTop: 20 }}>
            <Table
              rowSelection={{
                type: selectionType,
                ...rowSelection,
              }}
              onChange={() => rowSelection}
              rowKey={(row) => row.id}
              bordered={true}
              columns={columns}
              dataSource={state}
              loading={isLoading}
              pagination={{ pageSizeOptions: [10, 20, 50, 100] }}
              scroll={{ y: 350, x: 1900 }}
            ></Table>
          </Card>

          <Row style={{ marginTop: 25 }}>
            <Col span={16}>
              <Popconfirm
                title={<FormattedMessage id="demandGeneration.table.popForSave" />}
                onConfirm={poPconfirm}
                onCancel={cancel}
                disabled={button1State}
                okText={<FormattedMessage id="demandGeneration.table.yes" />}
                cancelText={<FormattedMessage id="demandGeneration.table.no" />}
                okButtonProps={{
                  loading: confirmLoading,
                }}
              >
                <Button type="primary"
                disabled={button1State}
>
                  <FormattedMessage
                    id="demandGeneration.button.generate"
                    defaultMessage="मागणीची पुष्टी करा"
                  />
                </Button>
              </Popconfirm>

              <Popconfirm
                title={<FormattedMessage id="demandGeneration.table.popForSave" />}
                onConfirm={poPconfirmForMod}
                onCancel={cancelForMod}
                okText={<FormattedMessage id="demandGeneration.table.yes" />}
                cancelText={<FormattedMessage id="demandGeneration.table.no" />}
                disabled
              >
                <Button type="dashed" disabled style={{ marginLeft: 5 }}>
                  <FormattedMessage
                    id="demandGeneration.button.modify"
                    defaultMessage="बदलासाठी फॉरवर्ड करा"
                  />
                </Button>
              </Popconfirm>

              <Button onClick={resetTable} style={{ marginLeft: 5 }}>
                <FormattedMessage id="demandGeneration.button.reset" defaultMessage="रीसेट" />
              </Button>
              <Button onClick={home} type="danger" style={{ marginLeft: 5 }}>
                <FormattedMessage
                  id="demandGeneration.button.cancel"
                  defaultMessage="रद्द करा"
                ></FormattedMessage>
              </Button>
            </Col>
          </Row>
        </Card>
      </div>
    </PageContainer>
  );
}

export default GRevenue;
