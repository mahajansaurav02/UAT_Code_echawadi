import { PageContainer } from '@ant-design/pro-layout';
import React, { useState, useEffect, createContext, useContext } from 'react';
import { useModel } from 'umi';
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
  Modal,
  Form,
  Checkbox,
  DatePicker,
} from 'antd';
import Selector from '@/pages/transactions/common/selector';
import URLS from '@/URLs/urls';

import Axios from 'axios';
import { useHistory, useLocation } from 'react-router-dom';

import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import VillageSelector from '@/components/eComponents/VillageSelector';
import useAxios from '@/components/eComponents/use-axios';
import { FormattedMessage } from 'umi';
import KeyPressEvents from '@/util/KeyPressEvents';
import TextArea from 'antd/lib/input/TextArea';

function DemandForModification() {
  const { districtName, servarthId, districtCode, talukaCode, talukaName } = useModel('details');
  const { sendRequest } = useAxios();
  const location = useLocation();
  //const [cCodeForPageMode, setCCodeForPageMode ]=useState()

  let pushedcCode;
  let pushedrevenueYear;
  pushedrevenueYear = location.state?.revenueYear;
  pushedcCode = location.state?.cCode;
  //setCCodeForPageMode(pushedcCode);
  const pushedVillageName = location.state?.villageName;
  const getDataInUseEffect = async () => {
    // setIsLoading(true);
    const article = {
      districtCode: location.state?.districtCode,
      talukaCode: location.state?.talukaCode,
      cCode: location.state?.cCode,
      revenueYear: location.state?.revenueYear,
      khataNo: location.state?.khataNo,
      // activeFlag: 'M',
    };

    sendRequest(
      `${URLS.BaseURL}/landRevenue/getLRDemandBycCodeAndStatus`,
      'POST',
      article,
      (res) => {
        setState(
          res.data.map((row, index) => ({
            districtCode: row.districtCode,
            revenueYear: row.revenueYear,
            netPending: row.netPending,
            preYearPendingAddlEducationalCess: row.preYearPendingAddlEducationalCess,
            preYearPendingAddlLandRevenue: row.preYearPendingAddlLandRevenue,
            preYearPendingEducationalCess: row.preYearPendingEducationalCess,
            preYearPendingEmployeeGuaranteeScheme: row.preYearPendingEmployeeGuaranteeScheme,
            preYearPendingGp: row.preYearPendingGp,
            preYearPendingJm: row.preYearPendingJm,
            preYearPendingZp: row.preYearPendingZp,
            talukaCode: row.talukaCode,
            cCode: row.ccode,
            id: row.id,
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
            zpVajasut: row.zpVajasut,
            gpVajasut: row.gpVajasut,
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
            srNo: index + 1,
            surveyHissaNo: row.surveyHissaNo,
            uom: row.uom,
            preYearPendingNaCess: row.preYearPendingNaCess,
            preYearSankirnJmWith: row.preYearSankirnJmWith,
            preYearSankirnJmWithout: row.preYearSankirnJmWithout,
            preYearNoticeFee: row.preYearNoticeFee,
          })),
        );
        // console.log(res.status);
        if (res.status === 202 || res.status === 204) {
          setIsLoading(false);
        }
        if (res.status === 'ERROR') {
          setIsLoading(false);
        }
      },
      (err) => {},
    );
  };
  useEffect(() => {
    getDataInUseEffect();
  }, []);

  function poPconfirm(e) {
    demandConfirm();
    // console.log(e);
    message.success('Request Successful !!!');
  }
  function cancel(e) {
    // console.log(e);
    message.error('Request Cancelled !!!');
  }
  let history = useHistory();
  const [revenueYear, setRevenueYear] = useState();
  const [viewAlert, setViewAlert] = useState(false);
  const [state, setState] = useState([]);
  const [form] = Form.useForm();
  const [isNirank, setIsNirank] = useState(false);
  const [codeVillage, setCodeVillage] = useState('');
  const [flagCalculateDemand, setFlagCalculateDemand] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [textForVillage, setTextForVillage] = useState();
  const [khataNumber, setKhataNumber] = useState();
  const [recordId, setRecordId] = useState();
  const [checkAgauVasuli, setCheckAgauVasuli] = useState(true);
  const [modalForDelete, setModalForDelete] = useState(false);
  const [obj, setObj] = useState();
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [vasuli, setVasuli] = useState(null);

  // useEffect(() => {
  //   console.log('vasuli', vasuli);
  // }, [vasuli]);

  const [dataInModal, setDataInModal] = useState({
    agauVasuliRemarks: '',
    assessment: '',
    jmBindumala: '',
    zpBindumala: '',
    gpBindumala: '',
    jmDumala: '',
    zpDumala: '',
    gpDumala: '',
    jmAkrushik: '',
    zpAkrushik: '',
    gpAkrushik: '',
    jmSankirn: '',
    zpSankirn: '',
    gpSankirn: '',
    jmVajasut: '',
    gpVajasut: '',
    zpVajasut: '',
    addlLandRevenue: '',
    educationalCess: '',
    addlEducationalCess: '',
    employeeGuaranteeScheme: '',
    preYearPendingNaCess: '',
    preYearSankirnJmWith: '',
    preYearSankirnJmWithout: '',
    preYearNoticeFee: '',
    miscellaneousAmount: '',
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newTotal, setNewTotal] = useState();
  const [dataToSend, setDataToSend] = useState();

  const {
    assessment,
    jmBindumala,
    zpBindumala,
    gpBindumala,
    jmDumala,
    zpDumala,
    gpDumala,
    jmAkrushik,
    zpAkrushik,
    gpAkrushik,
    jmSankirn,
    zpSankirn,
    gpSankirn,
    jmVajasut,
    gpVajasut,
    zpVajasut,
    addlLandRevenue,
    educationalCess,
    addlEducationalCess,
    employeeGuaranteeScheme,
    preYearPendingJm,
    preYearPendingZp,
    preYearPendingGp,
    preYearPendingAddlLandRevenue,
    preYearPendingEducationalCess,
    preYearPendingAddlEducationalCess,
    preYearPendingEmployeeGuaranteeScheme,
    miscellaneousAmount,
    preYearPendingNaCess,
    preYearSankirnJmWith,
    preYearSankirnJmWithout,
    preYearNoticeFee,
  } = dataInModal;

  useEffect(() => {
    calculateTotal();
  }, [
    assessment,
    jmBindumala,
    zpBindumala,
    gpBindumala,
    jmDumala,
    zpDumala,
    gpDumala,
    jmAkrushik,
    zpAkrushik,
    gpAkrushik,
    jmSankirn,
    zpSankirn,
    gpSankirn,
    jmVajasut,
    gpVajasut,
    zpVajasut,
    addlLandRevenue,
    educationalCess,
    addlEducationalCess,
    employeeGuaranteeScheme,
    preYearPendingJm,
    preYearPendingZp,
    preYearPendingGp,
    preYearPendingAddlLandRevenue,
    preYearPendingEducationalCess,
    preYearPendingAddlEducationalCess,
    preYearPendingEmployeeGuaranteeScheme,
    miscellaneousAmount,
    preYearPendingNaCess,
    preYearSankirnJmWith,
    preYearSankirnJmWithout,
    preYearNoticeFee,
  ]);

  const showModal = (record) => {
    // console.log('full Record', record);
    setDataInModal({
      districtCode: record.districtCode,
      revenueYear: record.revenueYear,
      netPending: record.netPending,
      preYearPendingAddlEducationalCess: record.preYearPendingAddlEducationalCess,
      preYearPendingAddlLandRevenue: record.preYearPendingAddlLandRevenue,
      preYearPendingEducationalCess: record.preYearPendingEducationalCess,
      preYearPendingEmployeeGuaranteeScheme: record.preYearPendingEmployeeGuaranteeScheme,
      preYearPendingGp: record.preYearPendingGp,
      preYearPendingJm: record.preYearPendingJm,
      preYearPendingZp: record.preYearPendingZp,
      talukaCode: record.talukaCode,
      cCode: record.cCode,
      id: record.id,
      khataNo: record.khataNo,
      khataOwnerName: record.khataOwnerName,
      jmBindumala: record.jmBindumala,
      zpBindumala: record.zpBindumala,
      gpBindumala: record.gpBindumala,
      jmDumala: record.jmDumala,
      zpDumala: record.zpDumala,
      gpDumala: record.gpDumala,
      jmAkrushik: record.jmAkrushik,
      zpAkrushik: record.zpAkrushik,
      gpAkrushik: record.gpAkrushik,
      jmSankirn: record.jmSankirn,
      zpSankirn: record.zpSankirn,
      gpSankirn: record.gpSankirn,
      jmVajasut: record.jmVajasut,
      gpVajasut: record.gpVajasut,
      zpVajasut: record.zpVajasut,
      addlLandRevenue: record.addlLandRevenue,
      educationalCess: record.educationalCess,
      addlEducationalCess: record.addlEducationalCess,
      employeeGuaranteeScheme: record.employeeGuaranteeScheme,
      preYearPendingJm: record.preYearPendingJm,
      preYearPendingZp: record.preYearPendingZp,
      preYearPendingGp: record.preYearPendingGp,
      preYearPendingAddlLandRevenue: record.preYearPendingAddlLandRevenue,
      preYearPendingEducationalCess: record.preYearPendingEducationalCess,
      preYearPendingAddlEducationalCess: record.preYearPendingAddlEducationalCess,
      preYearPendingEmployeeGuaranteeScheme: record.preYearPendingEmployeeGuaranteeScheme,
      miscellaneousAmount: record.miscellaneousAmount,
      area: record.area,
      assessment: record.assessment,
      netAmount: record.netAmount,
      surveyHissaNo: record.surveyHissaNo,
      uom: record.uom,
      preYearPendingNaCess: record.preYearPendingNaCess,
      preYearSankirnJmWith: record.preYearSankirnJmWith,
      preYearSankirnJmWithout: record.preYearSankirnJmWithout,
      preYearNoticeFee: record.preYearNoticeFee,
    });
    setIsModalVisible(true);
  };

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
            Search
          </Button>
          <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
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
            Filter
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : '',
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

  const onCancelForDeleteModal = () => {
    setModalForDelete(false);
  };

  const deleteRecord = (record) => {
    setRecordId(record.id);
    setModalForDelete(true);
  };

  const onChangeCheckbox = (e) => {
    if (checkAgauVasuli === false) {
      setCheckAgauVasuli(true);
    } else {
      setCheckAgauVasuli(false);
    }
  };

  const deleteModificationData = async () => {
    setModalForDelete(false);
    sendRequest(
      `${URLS.BaseURL}/landRevenue/deleteLRDemand?id=${recordId}`,
      'DELETE',
      null,
      (res) => {
        if (res.status === 226) {
          setState([]);
          message.success('Record Deleted!');
          // console.log('deleted !!!!');
          getData();
        }
      },
    );
  };

  const home = () => {
    history.push('/homepage');
  };

  const openNotification = (type, placement) => {
    notification[type]({
      message: 'Demand Modification ',
      description: `Modification Data for Village ${textForVillage} fetched!`,
      placement,
      onClick: () => {
        // function on notification click can be added here!
        // console.log('Notification Clicked!');
      },
    });
  };

  const article = { cCode: codeVillage };
  const demandConfirm = async () => {
    sendRequest(`${URLS.BaseURL}/landRevenue/persistLandRevenueDemand`, 'POST', article, (res) => {
      // console.log(res.status);
    });
    //await Axios.post(`${BaseURL}`, article);
  };

  const handleCancelForModal = () => {
    setIsModalVisible(false);
  };
  const getData = async () => {
    // setIsLoading(true);
    setFlagCalculateDemand(true);
    setTimeout(() => setFlagCalculateDemand(false), 10000);
    const article = {
      districtCode: districtCode,
      talukaCode: talukaCode,
      cCode: codeVillage,
      revenueYear: revenueYear,
      khataNo: khataNumber,
      // activeFlag: 'M',
    };

    sendRequest(
      `${URLS.BaseURL}/landRevenue/getLRDemandBycCodeAndStatus`,
      'POST',
      article,
      (res) => {
        // console.log(res.data);
        setState(
          res.data.map((row, index) => ({
            districtCode: row.districtCode,
            revenueYear: row.revenueYear,
            netPending: row.netPending,
            preYearPendingAddlEducationalCess: row.preYearPendingAddlEducationalCess,
            preYearPendingAddlLandRevenue: row.preYearPendingAddlLandRevenue,
            preYearPendingEducationalCess: row.preYearPendingEducationalCess,
            preYearPendingEmployeeGuaranteeScheme: row.preYearPendingEmployeeGuaranteeScheme,
            preYearPendingGp: row.preYearPendingGp,
            preYearPendingJm: row.preYearPendingJm,
            preYearPendingZp: row.preYearPendingZp,
            talukaCode: row.talukaCode,
            cCode: row.ccode,
            id: row.id,
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
            zpVajasut: row.zpVajasut,
            gpVajasut: row.gpVajasut,
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
            netAmount: row.netAmount,
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
        // console.log(res.status);
        if (res.status === 202) {
          setIsLoading(false);
          message.success('Modification Records Fetched !');
        }
        if (res.status === 'ERROR') {
          setIsLoading(false);
        }
      },
      (err) => {
        message.info('Modification Records Not Found !');
      },
    );
  };
  const resetTable = () => {
    setState();
  };

  const columns = [
    {
      title: <FormattedMessage id="demandGeneration.table.srNo" defaultMessage="अ. क्र" />,
      dataIndex: 'srNo',
      width: 55,
    },
    {
      title: <FormattedMessage id="demandGeneration.table.khataNo" defaultMessage="खाता क्र" />,
      dataIndex: 'khataNo',
      width: 75,
      ...getColumnSearchProps('khataNo'),
    },
    {
      title: (
        <FormattedMessage
          id="demandGeneration.table.khataOwnerName"
          defaultMessage="खातेदाराचे नाव"
        />
      ),
      dataIndex: 'khataOwnerName',
      width: 130,
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
      title: (
        <FormattedMessage id="demandGeneration.table.lrBindumala" defaultMessage="ज.म. बिनदुमाला" />
      ),
      dataIndex: 'jmBindumala',
      width: 90,
    },
    {
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
      title: <FormattedMessage id="demandGeneration.table.lrdumala" defaultMessage="ज.म. दुमाला" />,
      dataIndex: 'jmDumala',
      width: 70,
    },
    {
      title: (
        <FormattedMessage id="demandGeneration.table.zpdumala" defaultMessage="जि.प. दुमाला" />
      ),
      dataIndex: 'zpDumala',
      width: 70,
    },
    {
      title: (
        <FormattedMessage id="demandGeneration.table.vpdumala" defaultMessage="ग्रा.पं. दुमाला" />
      ),
      dataIndex: 'gpDumala',
      width: 70,
    },
    //Sankirn
    {
      title: (
        <FormattedMessage id="demandGeneration.table.lrSankirn" defaultMessage="ज.म. संकीर्ण" />
      ),
      dataIndex: 'jmSankirn',
      width: 70,
    },
    {
      title: (
        <FormattedMessage id="demandGeneration.table.zpSankirn" defaultMessage="जि.प. संकीर्ण" />
      ),
      dataIndex: 'zpSankirn',
      width: 70,
    },
    {
      title: (
        <FormattedMessage id="demandGeneration.table.vpSankirn" defaultMessage="ग्रा.पं. संकीर्ण" />
      ),
      dataIndex: 'gpSankirn',
      width: 70,
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
      width: 80,
    },
    {
      title: (
        <FormattedMessage id="demandGeneration.table.zpVajasut" defaultMessage="जि.प. वजासुट" />
      ),
      dataIndex: 'zpVajasut',
      width: 80,
    },
    {
      title: (
        <FormattedMessage id="demandGeneration.table.vpVajasut" defaultMessage="ग्रा.पं. वजासुट" />
      ),
      dataIndex: 'gpVajasut',
      width: 80,
    },
    //Total Amount to add logic here
    {
      title: <FormattedMessage id="demandGeneration.table.addLandRevenue" />,
      dataIndex: 'addlLandRevenue',
      width: 85,
    },
    //Education Cess
    {
      title: <FormattedMessage id="demandGeneration.table.educationalCess" />,
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
      width: 90,
    },
    {
      title: (
        <FormattedMessage
          id="demandGeneration.table.preYearPendingEducationalCess"
          defaultMessage="मागील शिक्षण उपकर"
        />
      ),
      dataIndex: 'preYearPendingEducationalCess',
      width: 90,
    },
    {
      title: (
        <FormattedMessage
          id="demandGeneration.table.preYearPendingAddlEducationalCess"
          defaultMessage="मागील वाढीव शिक्षण उपकर"
        />
      ),
      dataIndex: 'preYearPendingAddlEducationalCess',
      width: 90,
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

    // {
    //   title: (
    //     <FormattedMessage
    //       id="demandGeneration.table.miscellaneousAmount"
    //       defaultMessage="विविध रक्कम"
    //     />
    //   ),
    //   dataIndex: 'miscellaneousAmount',
    //   width: 90,
    // },
    {
      title: (
        <FormattedMessage
          id="demandGeneration.table.netAmount"
          defaultMessage="एकूण निव्वळ रक्कम"
        />
      ),
      dataIndex: 'netAmount',
      width: 90,
    },
    // {
    //   title: (
    //     <FormattedMessage id="demandGeneration.table.remarks" defaultMessage="आगाऊ वसुली शेरा" />
    //   ),
    //   dataIndex: 'agauVasuliRemarks',
    //   width: 90,
    // },
    {
      title: <FormattedMessage id="demandGeneration.table.edit" defaultMessage="सुधारणा" />,
      fixed: 'right',
      width: 105,
      render: (record) => {
        return (
          <>
            <Row>
              <Col>
                <Button
                  onClick={() => showModal(record)}
                  // size="small"
                  // type="link"
                  style={{ backgroundColor: 'lightblue', color: 'black' }}
                >
                  <FormattedMessage id="demandGeneration.table.edit" defaultMessage="सुधारणा" />
                </Button>
                <br />
                <br />
                <Button
                  onClick={() => deleteRecord(record)}
                  // size="small"
                  // type="link"
                  style={{ backgroundColor: '	#ff6347', color: 'black' }}
                >
                  डिलीट करा
                </Button>
              </Col>
            </Row>
          </>
        );
      },
    },
  ];

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      // console.log(selectedRowKeys);

      //var totalAmount = 0;
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
          preYearPendingNaCess: row.preYearPendingNaCess,
          preYearSankirnJmWith: row.preYearSankirnJmWith,
          preYearSankirnJmWithout: row.preYearSankirnJmWithout,
          preYearNoticeFee: row.preYearNoticeFee,
        });
        //* refer generate challan to implement logic of pdf print
        // totalAmount += row.netAmountReceived;
      });
      //* use this {objForApi} to send list to api with the cCode
      var objForApi = {
        //! this should also include distirct Code and takula code
        revenueYear: revenueYear,
        activeFlag: 'M',
        districtCode: districtCode,
        talukaCode: talukaCode,
        cCode: codeVillage,
        lstLandRevenueDemandDao: selectedRecords,
      };
      setObj(objForApi);
    },
  };
  const calculateTotal = () => {
    let newTotal =
      dataInModal?.jmBindumala >= dataInModal?.assessment == 5 ||
      dataInModal?.jmDumala >= dataInModal?.assessment == 5 ||
      (dataInModal?.jmAkrushik >= dataInModal?.assessment == 5 &&
        dataInModal?.jmBindumala <= dataInModal?.assessment == 9) ||
      dataInModal?.jmDumala <= dataInModal?.assessment == 9 ||
      dataInModal?.jmAkrushik <= dataInModal?.assessment == 9
        ? Math.round(
            +dataInModal?.zpBindumala +
              +dataInModal?.gpBindumala +
              +dataInModal?.zpDumala +
              +dataInModal?.gpDumala +
              +dataInModal?.zpAkrushik +
              +dataInModal?.gpAkrushik +
              +dataInModal?.jmSankirn +
              +dataInModal?.zpSankirn +
              +dataInModal?.gpSankirn -
              +dataInModal?.jmVajasut -
              +dataInModal?.zpVajasut -
              +dataInModal?.gpVajasut +
              +dataInModal?.addlLandRevenue +
              +dataInModal?.educationalCess +
              +dataInModal?.addlEducationalCess +
              +dataInModal?.employeeGuaranteeScheme +
              +dataInModal?.preYearPendingJm +
              +dataInModal?.preYearPendingZp +
              +dataInModal?.preYearPendingGp +
              +dataInModal?.preYearPendingAddlLandRevenue +
              +dataInModal?.preYearPendingEducationalCess +
              +dataInModal?.preYearPendingAddlEducationalCess +
              +dataInModal?.preYearPendingEmployeeGuaranteeScheme +
              +dataInModal?.miscellaneousAmount +
              +dataInModal?.preYearPendingNaCess +
              +dataInModal?.preYearSankirnJmWith +
              +dataInModal?.preYearSankirnJmWithout +
              +dataInModal?.preYearNoticeFee,
          )
        : Math.round(
            +dataInModal?.jmBindumala +
              +dataInModal?.jmDumala +
              +dataInModal?.jmAkrushik +
              +dataInModal?.zpBindumala +
              +dataInModal?.gpBindumala +
              +dataInModal?.zpDumala +
              +dataInModal?.gpDumala +
              +dataInModal?.zpAkrushik +
              +dataInModal?.gpAkrushik +
              +dataInModal?.jmSankirn +
              +dataInModal?.zpSankirn +
              +dataInModal?.gpSankirn -
              +dataInModal?.jmVajasut -
              +dataInModal?.zpVajasut -
              +dataInModal?.gpVajasut +
              +dataInModal?.addlLandRevenue +
              +dataInModal?.educationalCess +
              +dataInModal?.addlEducationalCess +
              +dataInModal?.employeeGuaranteeScheme +
              +dataInModal?.preYearPendingJm +
              +dataInModal?.preYearPendingZp +
              +dataInModal?.preYearPendingGp +
              +dataInModal?.preYearPendingAddlLandRevenue +
              +dataInModal?.preYearPendingEducationalCess +
              +dataInModal?.preYearPendingAddlEducationalCess +
              +dataInModal?.preYearPendingEmployeeGuaranteeScheme +
              +dataInModal?.miscellaneousAmount +
              +dataInModal?.preYearPendingNaCess +
              +dataInModal?.preYearSankirnJmWith +
              +dataInModal?.preYearSankirnJmWithout +
              +dataInModal?.preYearNoticeFee,
          );

    setNewTotal(newTotal.toFixed(2));
    const toSendData = {
      ...dataInModal,
      netAmount: newTotal >= 0 ? newTotal : 0,
      netPending: newTotal >= 0 ? newTotal : 0,
      agauVasuliRemarks: vasuli,
    };
    setDataToSend(toSendData);
    // console.log('vasuli', vasuli);
  };
  const [selectionType, setSelectionType] = useState('checkbox');

  const saveEditedRecord = async () => {
    const body = {
      ...dataToSend,
      agauVasuliRemarks: vasuli,
    };
    // console.log('Bodyyy+++', body);
    const typeError = 'No Records For the Current Selection';
    sendRequest(
      `${URLS.BaseURL}/landRevenue/updateLRDemand`,
      'PATCH',
      body,
      (res) => {
        if (res.status === 204) {
          message.success('Updated Successfully');
          setIsModalVisible(false);
          resetTable();
          // getData();
          // getDataInUseEffect();
        }
      },
      'ERROR',
    );
  };
  const disableButtonTimer = () => {
    setFlagCalculateDemand(true);
    setTimeout(() => setFlagCalculateDemand(false), 2000);
  };

  // how to retrict state to take negative value in react.js ?

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
          {/* {pushedVillageName ? (
            <>
              <Row>
                <Col span={6}>
                  <label>
                    <FormattedMessage id="villageSelector.label.district" />: {districtName}
                  </label>
                </Col>
                <Col span={6}>
                  <label>
                    <FormattedMessage id="villageSelector.label.taluka" />: {talukaName}
                  </label>
                </Col>
                <Col span={6}>
                  <label>
                    <FormattedMessage id="villageSelector.label.village" />: {pushedVillageName}
                  </label>
                </Col>
                <Col span={6}>
                  <label>
                    <FormattedMessage id="villageSelector.label.revenueYear" />: {pushedrevenueYear}
                  </label>
                </Col>
              </Row>
            </>
          ) : ( */}
          <>
            <VillageSelector
              pageType="withYear"
              setCodeVillage={setCodeVillage}
              setTextForVillage={setTextForVillage}
              onVillageChange={(setFlagCalculateDemand, setState)}
              yearChange={setRevenueYear}
              setIsNirank={setIsNirank}
            />
            <Row>
              <Col xl={5} lg={5} md={5} sm={24} xs={24}>
                <Form layout="vertical" form={form}>
                  <Form.Item
                    label={<FormattedMessage id="formLanguage.button.khataNo" />}
                    name="khataNo"
                    rules={[
                      // {
                      //   required: true,
                      //   message: 'Khata No/Makta No',
                      // },
                      {
                        max: 30,
                        message: 'Khata No/Makta No must be upto 30 Numbers',
                      },
                    ]}
                  >
                    <Input
                      onKeyPress={KeyPressEvents.isInputNumber}
                      maxLength={31}
                      onChange={(event) => {
                        setKhataNumber(event.target.value);
                      }}
                    />
                  </Form.Item>
                </Form>
              </Col>
              <Col xl={1} lg={1} md={1} sm={24} xs={24}></Col>
              <Col xl={4} lg={4} md={4} sm={24} xs={24}>
                <Button
                  type="primary"
                  style={{ marginTop: '33px' }}
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
                  <FormattedMessage id="demandGeneration.button.showDemand" />
                </Button>
              </Col>
            </Row>
          </>
          {/* )} */}

          <Card style={{ marginTop: 20 }}>
            <Table
              // rowSelection={{
              //   type: selectionType,
              //   ...rowSelection,
              // }}
              //onChange={() => rowSelection}
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
              <Button onClick={home} type="danger" style={{ marginLeft: 5 }}>
                <FormattedMessage id="demandGeneration.button.cancel" defaultMessage="रद्द करा" />
              </Button>
            </Col>
          </Row>
        </Card>
      </div>
      <Modal
        width={1000}
        title={
          <FormattedMessage
            id="demandGeneration.table.editRecords"
            defaultMessage="रेकॉर्ड संपादित करा"
          />
        }
        visible={isModalVisible}
        okText={<FormattedMessage id="demandGeneration.button.save" defaultMessage="जतन करा" />}
        onOk={() => {
          saveEditedRecord();
        }}
        cancelText={
          <FormattedMessage id="demandGeneration.button.cancel" defaultMessage="रद्द करा" />
        }
        onCancel={handleCancelForModal}
      >
        <>
          <Row>
            <Col span={4}>
              <Input
                addonBefore={
                  <FormattedMessage id="demandGeneration.table.khataNo" defaultMessage="खाता क्र" />
                }
                disabled
                value={dataInModal && dataInModal.khataNo}
              />
            </Col>
            <Col span={8}>
              <Input
                style={{ paddingLeft: 10 }}
                addonBefore={
                  <FormattedMessage
                    id="demandGeneration.table.khataOwnerName"
                    defaultMessage="खातेदाराचे नाव"
                  />
                }
                disabled
                value={dataInModal && dataInModal.khataOwnerName}
              />
            </Col>
            <Col span={6}>
              <Input
                style={{ paddingLeft: 10 }}
                addonBefore={
                  <FormattedMessage id="demandGeneration.table.area" defaultMessage="क्षेत्र" />
                }
                disabled
                value={dataInModal && dataInModal.area}
              />
            </Col>
            <Col span={6}>
              <Input
                style={{ paddingLeft: 10 }}
                addonBefore={
                  <FormattedMessage
                    id="demandGeneration.table.assessment"
                    defaultMessage="मूल्यांकन"
                  />
                }
                disabled
                value={dataInModal && dataInModal.assessment}
              />
            </Col>
          </Row>
          <Row style={{ paddingTop: 15 }}>
            <Col span={8}>
              <Input
                addonBefore={
                  <FormattedMessage
                    id="demandGeneration.table.lrBindumala"
                    defaultMessage="ज.म. बिंदुमाला"
                  />
                }
                value={dataInModal && dataInModal.jmBindumala}
                onChange={(e) => {
                  setDataInModal((prevDataInModal) => ({
                    ...prevDataInModal,
                    jmBindumala: e.target.value,
                  }));
                }}
                maxLength={18}
                onKeyPress={KeyPressEvents.isInputDecimal}
              />
            </Col>
            <Col span={8}>
              <Input
                style={{ paddingLeft: 10 }}
                addonBefore={
                  <FormattedMessage
                    id="demandGeneration.table.zpBindumala"
                    defaultMessage="जि.प. बिंदुमाला"
                  />
                }
                value={dataInModal && dataInModal.zpBindumala}
                onChange={(e) => {
                  setDataInModal((prevDataInModal) => ({
                    ...prevDataInModal,
                    zpBindumala: e.target.value,
                  }));
                }}
                maxLength={18}
                onKeyPress={KeyPressEvents.isInputDecimal}
              />
            </Col>
            <Col span={8}>
              <Input
                style={{ paddingLeft: 10 }}
                addonBefore={
                  <FormattedMessage
                    id="demandGeneration.table.vpBindumala"
                    defaultMessage="ग्रा.पं. बिंदुमाला"
                  />
                }
                value={dataInModal && dataInModal.gpBindumala}
                onChange={(e) => {
                  setDataInModal((prevDataInModal) => ({
                    ...prevDataInModal,
                    gpBindumala: e.target.value,
                  }));
                }}
                maxLength={18}
                onKeyPress={KeyPressEvents.isInputDecimal}
              />
            </Col>
          </Row>
          <Row style={{ paddingTop: 15 }}>
            <Col span={8}>
              <Input
                addonBefore={
                  <FormattedMessage
                    id="demandGeneration.table.lrdumala"
                    defaultMessage="ज.म. दुमाला"
                  />
                }
                value={dataInModal && dataInModal.jmDumala}
                onChange={(e) => {
                  setDataInModal((prevDataInModal) => ({
                    ...prevDataInModal,
                    jmDumala: e.target.value,
                  }));
                }}
                maxLength={18}
                onKeyPress={KeyPressEvents.isInputDecimal}
              />
            </Col>
            <Col span={8}>
              <Input
                style={{ paddingLeft: 10 }}
                addonBefore={
                  <FormattedMessage
                    id="demandGeneration.table.zpdumala"
                    defaultMessage="जि.प. दुमाला"
                  />
                }
                value={dataInModal && dataInModal.zpDumala}
                onChange={(e) => {
                  setDataInModal((prevDataInModal) => ({
                    ...prevDataInModal,
                    zpDumala: e.target.value,
                  }));
                }}
                maxLength={18}
                onKeyPress={KeyPressEvents.isInputDecimal}
              />
            </Col>
            <Col span={8}>
              <Input
                style={{ paddingLeft: 10 }}
                addonBefore={
                  <FormattedMessage
                    id="demandGeneration.table.vpdumala"
                    defaultMessage="ग्रा.पं. दुमाला"
                  />
                }
                value={dataInModal && dataInModal.gpDumala}
                onChange={(e) => {
                  setDataInModal((prevDataInModal) => ({
                    ...prevDataInModal,
                    gpDumala: e.target.value,
                  }));
                }}
                maxLength={18}
                onKeyPress={KeyPressEvents.isInputDecimal}
              />
            </Col>
          </Row>
          <Row style={{ paddingTop: 15 }}>
            <Col span={8}>
              <Input
                addonBefore={
                  <FormattedMessage
                    id="demandGeneration.table.lrAkrushik"
                    defaultMessage="ज.म. आक्रोशिक"
                  />
                }
                value={dataInModal && dataInModal.jmAkrushik}
                onChange={(e) => {
                  setDataInModal((prevDataInModal) => ({
                    ...prevDataInModal,
                    jmAkrushik: e.target.value,
                  }));
                }}
                maxLength={18}
                onKeyPress={KeyPressEvents.isInputDecimal}
              />
            </Col>
            <Col span={8}>
              <Input
                style={{ paddingLeft: 10 }}
                addonBefore={
                  <FormattedMessage
                    id="demandGeneration.table.zpAkrushik"
                    defaultMessage="जि.प. आक्रोशिक"
                  />
                }
                value={dataInModal && dataInModal.zpAkrushik}
                onChange={(e) => {
                  setDataInModal((prevDataInModal) => ({
                    ...prevDataInModal,
                    zpAkrushik: e.target.value,
                  }));
                }}
                maxLength={18}
                onKeyPress={KeyPressEvents.isInputDecimal}
              />
            </Col>
            <Col span={8}>
              <Input
                style={{ paddingLeft: 10 }}
                addonBefore={
                  <FormattedMessage
                    id="demandGeneration.table.vpAkrushik"
                    defaultMessage="'ग्रा.पं. आक्रोशिक'"
                  />
                }
                value={dataInModal && dataInModal.gpAkrushik}
                onChange={(e) => {
                  setDataInModal((prevDataInModal) => ({
                    ...prevDataInModal,
                    gpAkrushik: e.target.value,
                  }));
                }}
                maxLength={18}
                onKeyPress={KeyPressEvents.isInputDecimal}
              />
            </Col>
          </Row>
          <Row style={{ paddingTop: 15 }}>
            <Col span={8}>
              <Input
                addonBefore={
                  <FormattedMessage
                    id="demandGeneration.table.lrSankirn"
                    defaultMessage="ज.म. संकीर्ण"
                  />
                }
                value={dataInModal && dataInModal.jmSankirn}
                onChange={(e) => {
                  setDataInModal((prevDataInModal) => ({
                    ...prevDataInModal,
                    jmSankirn: e.target.value,
                  }));
                }}
                maxLength={18}
                onKeyPress={KeyPressEvents.isInputDecimal}
              />
            </Col>
            <Col span={8}>
              <Input
                style={{ paddingLeft: 10 }}
                addonBefore={
                  <FormattedMessage
                    id="demandGeneration.table.zpSankirn"
                    defaultMessage="जि.प. संकीर्ण"
                  />
                }
                value={dataInModal && dataInModal.zpSankirn}
                onChange={(e) => {
                  setDataInModal((prevDataInModal) => ({
                    ...prevDataInModal,
                    zpSankirn: e.target.value,
                  }));
                }}
                maxLength={18}
                onKeyPress={KeyPressEvents.isInputDecimal}
              />
            </Col>
            <Col span={8}>
              <Input
                style={{ paddingLeft: 10 }}
                addonBefore={
                  <FormattedMessage
                    id="demandGeneration.table.vpSankirn"
                    defaultMessage="ग्रा.पं. संकीर्ण"
                  />
                }
                value={dataInModal && dataInModal.gpSankirn}
                onChange={(e) => {
                  setDataInModal((prevDataInModal) => ({
                    ...prevDataInModal,
                    gpSankirn: e.target.value,
                  }));
                }}
                maxLength={18}
                onKeyPress={KeyPressEvents.isInputDecimal}
              />
            </Col>
          </Row>
          <Row style={{ paddingTop: 15 }}>
            <Col span={8}>
              <Input
                addonBefore={
                  <FormattedMessage
                    id="demandGeneration.table.lrVajasut"
                    defaultMessage="ज.म. वजासुट"
                  />
                }
                value={dataInModal && dataInModal.jmVajasut}
                onChange={(e) => {
                  setDataInModal((prevDataInModal) => ({
                    ...prevDataInModal,
                    jmVajasut: e.target.value,
                  }));
                }}
                maxLength={18}
                onKeyPress={KeyPressEvents.isInputDecimal}
              />
            </Col>
            <Col span={8}>
              <Input
                style={{ paddingLeft: 10 }}
                addonBefore={
                  <FormattedMessage
                    id="demandGeneration.table.zpVajasut"
                    defaultMessage="जि.प. वजासुट"
                  />
                }
                value={dataInModal && dataInModal.zpVajasut}
                onChange={(e) => {
                  setDataInModal((prevDataInModal) => ({
                    ...prevDataInModal,
                    zpVajasut: e.target.value,
                  }));
                }}
                maxLength={18}
                onKeyPress={KeyPressEvents.isInputDecimal}
              />
            </Col>
            <Col span={8}>
              <Input
                style={{ paddingLeft: 10 }}
                addonBefore={
                  <FormattedMessage
                    id="demandGeneration.table.vpVajasut"
                    defaultMessage="ग्रा.पं. वजासुट"
                  />
                }
                value={dataInModal && dataInModal.gpVajasut}
                onChange={(e) => {
                  setDataInModal((prevDataInModal) => ({
                    ...prevDataInModal,
                    gpVajasut: e.target.value,
                  }));
                }}
                maxLength={18}
                onKeyPress={KeyPressEvents.isInputDecimal}
              />
            </Col>
          </Row>
          <Row style={{ paddingTop: 15 }}>
            <Col span={12}>
              <Input
                addonBefore={
                  <FormattedMessage
                    id="demandGeneration.table.addLandRevenue"
                    defaultMessage="वाढीव जमीन महसूल"
                  />
                }
                value={dataInModal && dataInModal.addlLandRevenue}
                onChange={(e) => {
                  setDataInModal((prevDataInModal) => ({
                    ...prevDataInModal,
                    addlLandRevenue: e.target.value,
                  }));
                }}
                maxLength={18}
                onKeyPress={KeyPressEvents.isInputDecimal}
              />
            </Col>

            <Col span={12}>
              <Input
                style={{ paddingLeft: 10 }}
                addonBefore={
                  <FormattedMessage
                    id="demandGeneration.table.educationalCess"
                    defaultMessage="शिक्षण उपकर"
                  />
                }
                value={dataInModal && dataInModal.educationalCess}
                onChange={(e) => {
                  setDataInModal((prevDataInModal) => ({
                    ...prevDataInModal,
                    educationalCess: e.target.value,
                  }));
                }}
                maxLength={18}
                onKeyPress={KeyPressEvents.isInputDecimal}
              />
            </Col>
          </Row>
          <Row style={{ paddingTop: 15 }}>
            <Col span={12}>
              <Input
                addonBefore={
                  <FormattedMessage id="demandGeneration.table.EGS" defaultMessage="रो.ह. उपकर" />
                }
                value={dataInModal && dataInModal.employeeGuaranteeScheme}
                onChange={(e) => {
                  setDataInModal((prevDataInModal) => ({
                    ...prevDataInModal,
                    employeeGuaranteeScheme: e.target.value,
                  }));
                }}
                maxLength={18}
                onKeyPress={KeyPressEvents.isInputDecimal}
              />
            </Col>
            <Col span={12}>
              <Input
                style={{ paddingLeft: 10 }}
                addonBefore={
                  <FormattedMessage
                    id="demandGeneration.table.addlEducationalCess"
                    defaultMessage="वाढीव शिक्षण उपकर"
                  />
                }
                value={dataInModal && dataInModal.addlEducationalCess}
                onChange={(e) => {
                  setDataInModal((prevDataInModal) => ({
                    ...prevDataInModal,
                    addlEducationalCess: e.target.value,
                  }));
                }}
                maxLength={18}
                onKeyPress={KeyPressEvents.isInputDecimal}
              />
            </Col>
          </Row>
          <Row style={{ paddingTop: 15 }}>
            <Col span={8}>
              <Input
               disabled={false}
                style={{ paddingLeft: 10 }}
                addonBefore={
                  <FormattedMessage
                    id="demandGeneration.table.preYearPendingJm"
                    defaultMessage="मागील ज.म."
                  />
                }
                value={dataInModal && dataInModal.preYearPendingJm}
                onChange={(e) => {
                  setDataInModal((prevDataInModal) => ({
                    ...prevDataInModal,
                    preYearPendingJm: e.target.value,
                  }));
                }}
                maxLength={18}
                onKeyPress={KeyPressEvents.isInputDecimal}
              />
            </Col>
            <Col span={8}>
              <Input
                disabled={false}
                style={{ paddingLeft: 10 }}
                addonBefore={
                  <FormattedMessage
                    id="demandGeneration.table.preYearPendingZp"
                    defaultMessage="मागील जि.प."
                  />
                }
                value={dataInModal && dataInModal.preYearPendingZp}
                onChange={(e) => {
                  setDataInModal((prevDataInModal) => ({
                    ...prevDataInModal,
                    preYearPendingZp: e.target.value,
                  }));
                }}
                maxLength={18}
                onKeyPress={KeyPressEvents.isInputDecimal}
              />
            </Col>
            <Col span={8}>
              <Input
                disabled={false}
                style={{ paddingLeft: 10 }}
                addonBefore={
                  <FormattedMessage
                    id="demandGeneration.table.preYearPendingGp"
                    defaultMessage="मागील ग्रा.पं."
                  />
                }
                value={dataInModal && dataInModal.preYearPendingGp}
                onChange={(e) => {
                  setDataInModal((prevDataInModal) => ({
                    ...prevDataInModal,
                    preYearPendingGp: e.target.value,
                  }));
                }}
                maxLength={18}
                onKeyPress={KeyPressEvents.isInputDecimal}
              />
            </Col>
          </Row>
          <Row style={{ paddingTop: 15 }}>
            <Col span={8}>
              <Input
                disabled={false}
                style={{ paddingLeft: 10 }}
                addonBefore={
                  <FormattedMessage
                    id="demandGeneration.table.preYearPendingAddlLandRevenue"
                    defaultMessage="मागील वाढीव जमीन महसूल"
                  />
                }
                value={dataInModal && dataInModal.preYearPendingAddlLandRevenue}
                onChange={(e) => {
                  setDataInModal((prevDataInModal) => ({
                    ...prevDataInModal,
                    preYearPendingAddlLandRevenue: e.target.value,
                  }));
                }}
                maxLength={18}
                onKeyPress={KeyPressEvents.isInputDecimal}
              />
            </Col>
            <Col span={8}>
              <Input
                disabled={false}
                style={{ paddingLeft: 10 }}
                addonBefore={
                  <FormattedMessage
                    id="demandGeneration.table.preYearPendingEducationalCess"
                    defaultMessage="मागील शिक्षण उपकर"
                  />
                }
                value={dataInModal && dataInModal.preYearPendingEducationalCess}
                onChange={(e) => {
                  setDataInModal((prevDataInModal) => ({
                    ...prevDataInModal,
                    preYearPendingEducationalCess: e.target.value,
                  }));
                }}
                maxLength={18}
                onKeyPress={KeyPressEvents.isInputDecimal}
              />
            </Col>
            <Col span={8}>
              <Input
                disabled={false}
                style={{ paddingLeft: 10 }}
                addonBefore={
                  <FormattedMessage
                    id="demandGeneration.table.preYearPendingAddlEducationalCess"
                    defaultMessage="मागील वाढीव शिक्षण उपकर"
                  />
                }
                value={dataInModal && dataInModal.preYearPendingAddlEducationalCess}
                onChange={(e) => {
                  setDataInModal((prevDataInModal) => ({
                    ...prevDataInModal,
                    preYearPendingAddlEducationalCess: e.target.value,
                  }));
                }}
                maxLength={18}
                onKeyPress={KeyPressEvents.isInputDecimal}
              />
            </Col>
          </Row>
          <Row style={{ paddingTop: 15 }}>
            <Col span={8}>
              <Input
                disabled={false}
                style={{ paddingLeft: 10 }}
                addonBefore={
                  <FormattedMessage
                    id="demandGeneration.table.preYearPendingEmployeeGuaranteeScheme"
                    defaultMessage="मागील वाढीव रो.ह. उपकर"
                  />
                }
                value={dataInModal && dataInModal.preYearPendingEmployeeGuaranteeScheme}
                onChange={(e) => {
                  setDataInModal((prevDataInModal) => ({
                    ...prevDataInModal,
                    preYearPendingEmployeeGuaranteeScheme: e.target.value,
                  }));
                }}
                maxLength={18}
                onKeyPress={KeyPressEvents.isInputDecimal}
              />
            </Col>
            {/* <Col span={8}>
              <Input
                disabled={true}
                style={{ paddingLeft: 10 }}
                addonBefore={
                  <FormattedMessage
                    id="demandGeneration.table.miscellaneousAmount"
                    defaultMessage="विविध रक्कम"
                  />
                }
                value={dataInModal && dataInModal.miscellaneousAmount}
                onChange={(e) => {
                  setDataInModal((prevDataInModal) => ({
                    ...prevDataInModal,
                    miscellaneousAmount: e.target.value,
                  }));
                }}
                maxLength={18}
                onKeyPress={KeyPressEvents.isInputDecimal}
              />
            </Col> */}
            <Col span={8}>
              <Input
               disabled={false}
                style={{ paddingLeft: 10 }}
                addonBefore={
                  <FormattedMessage
                    id="demandGeneration.preYearPendingNaCess"
                    defaultMessage="अकृषिक कर"
                  />
                }
                value={dataInModal && dataInModal.preYearPendingNaCess}
                onChange={(e) => {
                  setDataInModal((prevDataInModal) => ({
                    ...prevDataInModal,
                    preYearPendingNaCess: e.target.value,
                  }));
                }}
                maxLength={18}
                onKeyPress={KeyPressEvents.isInputDecimal}
              />
            </Col>
            <Col span={8}>
              <Input
                disabled={false}
                style={{ paddingLeft: 10 }}
                addonBefore={
                  <FormattedMessage
                    id="demandGeneration.preYearNoticeFee"
                    defaultMessage="नोटिसीचा खर्च"
                  />
                }
                value={dataInModal && dataInModal.preYearNoticeFee}
                onChange={(e) => {
                  setDataInModal((prevDataInModal) => ({
                    ...prevDataInModal,
                    preYearNoticeFee: e.target.value,
                  }));
                }}
                maxLength={18}
                onKeyPress={KeyPressEvents.isInputDecimal}
              />
            </Col>
          </Row>
          <Row style={{ paddingTop: 15 }}>
            <Col span={11}>
              <Input
                disabled={false}
                style={{ paddingLeft: 10 }}
                addonBefore={
                  <FormattedMessage
                    id="demandGeneration.preYearSankirnJmWith"
                    defaultMessage="संकीर्ण जमीन महसूल स्‍थानिक उपकरांसह"
                  />
                }
                value={dataInModal && dataInModal.preYearSankirnJmWith}
                onChange={(e) => {
                  setDataInModal((prevDataInModal) => ({
                    ...prevDataInModal,
                    preYearSankirnJmWith: e.target.value,
                  }));
                }}
                maxLength={18}
                onKeyPress={KeyPressEvents.isInputDecimal}
              />
            </Col>
            <Col span={2}></Col>
            <Col span={11}>
              <Input
                disabled={false}
                style={{ paddingLeft: 10 }}
                addonBefore={
                  <FormattedMessage
                    id="demandGeneration.preYearSankirnJmWithout"
                    defaultMessage="संकीर्ण जमीन महसूल स्‍थानिक उपकरांशिवाय"
                  />
                }
                value={dataInModal && dataInModal.preYearSankirnJmWithout}
                onChange={(e) => {
                  setDataInModal((prevDataInModal) => ({
                    ...prevDataInModal,
                    preYearSankirnJmWithout: e.target.value,
                  }));
                }}
                maxLength={18}
                onKeyPress={KeyPressEvents.isInputDecimal}
              />
            </Col>
          </Row>
          <Row style={{ paddingTop: 15 }}>
            <Col span={6}>
              <Input
                disabled={false}
                addonBefore={
                  <FormattedMessage
                    id="demandGeneration.table.preAmount"
                    defaultMessage="मागील एकूण"
                  />
                }
                value={dataInModal && dataInModal.netAmount}
                onChange={(e) => {
                  setDataInModal((prevDataInModal) => ({
                    ...prevDataInModal,
                    netAmount: e.target.value,
                  }));
                }}
              />
            </Col>
            <Col span={1}></Col>
          </Row>
          <Row style={{ paddingTop: 10 }}>
            <Col xl={6} lg={6} md={24} xs={24} sm={24}>
              <Checkbox
                onChange={onChangeCheckbox}
                name="userId"
                value="userId"
                style={{ marginTop: '8px' }}
              >
                आगाऊ वसुलीस पात्र असाल तर ?
              </Checkbox>
            </Col>
          </Row>
          <Row style={{ paddingTop: 10 }}>
            {checkAgauVasuli === false && (
              <>
                <Col xl={24} lg={24} md={24} xs={24} sm={24}>
                  <TextArea
                    maxLength={300}
                    style={{ paddingLeft: 20 }}
                    addonBefore={
                      <FormattedMessage
                        id="demandGeneration.table.remarks"
                        defaultMessage="आगाऊ वसुली शेरा"
                      />
                    }
                    defaultValue="चलन क्रमांक -       दिनांक -       नुसार चालू वर्षाची मागणी आगाऊ वसूल करण्यात आल्यामुळे सदर मागणी रक्कमेस सूट देण्यात येत आहे."
                    name="agauVasuliRemarks"
                    // value={vasuli}
                    onChange={(e) => {
                      // console.log('agauVasuliRemarks', e.target.value);
                      setDataInModal((prevDataInModal) => ({
                        ...prevDataInModal,
                        agauVasuliRemarks: e.target.value,
                      }));
                      setVasuli(e.target.value);
                    }}
                  />
                </Col>
                <Row style={{ paddingTop: 5 }}>
                  <Col xl={24} lg={24} md={24} xs={24} sm={24}>
                    <Alert
                      message="वरील रिकाम्या जागेत चलन क्रमांक व दिनांक नमूद करा "
                      type="info"
                      showIcon
                    />
                  </Col>
                </Row>
              </>
            )}
          </Row>
          <Row style={{ paddingTop: 15 }}>
            <Col span={12}>
              <p style={{ paddingLeft: 10 }}>
                <FormattedMessage
                  id="demandGeneration.table.newTotal"
                  defaultMessage="नवीन एकूण :"
                />
                <b>{newTotal >= 0 ? newTotal : 0}</b>
                {/* this work is done on 14-12-2022,if fails just remove condition and keep newTotal */}
              </p>
            </Col>
          </Row>
        </>
      </Modal>
      <Modal
        visible={modalForDelete}
        okText={<FormattedMessage id="formLanguage.form.yes" />}
        okType="danger"
        cancelText={<FormattedMessage id="formLanguage.form.no" />}
        onCancel={onCancelForDeleteModal}
        onOk={deleteModificationData}
      >
        <FormattedMessage id="formLanguage.form.popForDelete" />
      </Modal>
    </PageContainer>
  );
}

export default DemandForModification;
