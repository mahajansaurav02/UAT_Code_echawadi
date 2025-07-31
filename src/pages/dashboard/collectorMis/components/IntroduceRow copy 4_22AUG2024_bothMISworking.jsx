import ExportToExcel from './ExportToExcelFile';

import { DownloadOutlined, InfoCircleOutlined } from '@ant-design/icons';
import react, { useState } from 'react';

import { TinyArea, TinyColumn, Progress } from '@ant-design/charts';
// import { Button, Card, Col, Form, message, Row, Select, Tooltip } from 'antd';
import numeral from 'numeral';
import { ChartCard, Field } from './Charts';
import Trend from './Trend';
import Yuan from '../utils/Yuan';
import URLS from '@/URLs/urls';
import useAxios from '@/components/eComponents/use-axios';
import { useModel } from 'umi';
import { useEffect } from 'react';
import React from 'react';
import { FormattedMessage } from 'umi';
import axios from 'axios';
import styles from './dashboard.module.css';
import styled from '@emotion/styled';
import { Tabs } from 'antd';
import {
  Alert,
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
  Select,
  CardHeader,
  Divider,
  Paper,
  Backdrop,
  CircularProgress,
} from '@mui/material';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import down_img from '../../../homepage/downimage.png';
import { Col, Form, Row, Tooltip, Modal } from 'antd';
import Chart from 'react-apexcharts';
import ReactHtmlTableToExcel from 'react-html-table-to-excel';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { log } from 'lodash-decorators/utils';
import { CSVLink, CSVDownload } from 'react-csv';

// import { LoadingButton } from '@mui/lab';
// import LoadingButton from '@mui/lab/LoadingButton';

const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 8,
  style: {
    marginBottom: 24,
    marginTop: 24,
  },
};

export const IntroduceRow = ({ loading, visitData }) => {
  const { districtName, talukaName, districtCode, talukaCode, servarthId } = useModel('details');
  const [codeVillage, setCodeVillage] = useState('');
  const { sendRequest } = useAxios();
  const [totalDemand, setTotalDemand] = useState(0);
  const [khataNumbersForCard, setKhataNumbersForCard] = useState(0);
  let TotalDemandForCard;
  const [village, setVillage] = useState([]);
  const [textForVillage, setTextForVillage] = useState();
  const [zoneData, setZoneData] = useState([]);
  const [dashBoardDetail, setDashBoardDetail] = useState();
  const [dashBoardDetailExcel, setDashBoardDetailExcel] = useState([]);
  const [staticdashBoardDivision, setstaticdashBoardDivision] = useState();
  const [staticdashBoardDistrict, setstaticdashBoardDistrict] = useState();
  const [dashBoardDetail1, setDashBoardDetail1] = useState();

  const [dashBoardDetail2Tab4, setDashBoardDetail2forTab4] = useState();
  const [tab2Detail, setTab2Detail] = useState();
  const [tab3Detail, setTab3Detail] = useState();
  const [tab4Detail, setTab4Detail] = useState();
  const [tab4Detail1, setTab4Detail1] = useState();
  const [tab5Detail, setTab5Detail] = useState();
  const [tab5Detail1, setTab5Detail1] = useState();

  const [countLrDuesAdded, setCountIsLrDuesAdded] = useState();
  const [countKajapaAdded, setCountKajapaAdded] = useState();
  const [countisMsLrAdded1, setCountisMsLrAdded1] = useState();
  const [countisNoticeAdded1, setCountisNoticeAdded1] = useState();
  const [countisKhataMergeAdded1, setCountisKhataMergeAdded1] = useState();
  const [countisAddLandAdded1, setCountisAddLandAdded] = useState();
  const [countTotalVillage, setCountTotalVillage] = useState();

  const [dashBoardCount, setDashBoardCount] = useState();
  const [dashBoardCount1, setDashBoardCount1] = useState();

  const [dashBoardCountTab4, setDashBoardCountTab4] = useState();
  const [dashBoardCount1Tab4, setDashBoardCount1Tab4] = useState();

  const [dashBoardDetail1_2023_2024_Dist, setDashBoardDetail1_2023_2024_Dist] = useState();
  const [dashBoardDetail2, setDashBoardDetail2] = useState();
  const [dashBoardDetail2_2023_2024, setDashBoardDetail2_2023_2024] = useState();
  const [dashBoardCount2023_2024_TD, setDashBoardCount2023_2024_TD] = useState();
  const [dashBoardCount1_2023_2024_Dist_Count, setDashBoardCount1_2023_2024_Dist_Count] =
    useState();

  const [dashBoardDetail2023_2024_MDiv, setDashBoardDetail2023_2024_MDiv] = useState();

  const [showStaticDashboard, setshowStaticDashboard] = useState(false);
  const [showCurrentDashboard, setshowCurrentDashboard] = useState(true);

  const [dashBoardCountTab5, setDashBoardCountTab5] = useState();
  const [dashBoardCount1Tab5, setDashBoardCount1Tab5] = useState();
  const [revenueYearForVillage, setRevenueYearForVillage] = useState();

  const [netAmount, setNetAmount] = useState(0);
  const [netReceived, setNetReceived] = useState(0);
  const { token } = useModel('Auth');
  const Header = `Bearer ${token}`;
  const echHost = localStorage.getItem('echHost');
  const mhrHost = localStorage.getItem('mhrHost');
  const echDbName = localStorage.getItem('echDbName');
  const echSchemaName = localStorage.getItem('echSchemaName');
  const mhrDbName = localStorage.getItem('mhrDbName');
  const mhrSchemaName = localStorage.getItem('mhrSchemaName');

  const [divisionCode, setDivisionCode] = useState();
  const [districtsCode, setDistricts] = useState();

  const [talukaC, setTalukaCode] = useState();
  const [divisionCodeTab4, setDivisionCodeTab4] = useState();
  const [divisionCodeTab5, setDivisionCodeTab5] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [finalDivisionCode, setFinalDivisionCode] = useState();
  const [totalDivisionEntry, setTotalDivisionEntry] = useState();
  const [totalPhase1Logins, setTotalPhase1Login] = useState();
  const [totalPhase1Village, setTotalPhase1Villages] = useState();
  const [totalOnlineVillagesCounts, setTotalOnlineVillagesCount] = useState();
  const [totalAmravatiPhase1Villages, setTotalAmravatiPhase1Villages] = useState();
  const [totalAmravatiPhase1Login, setTotalAmravatiPhase1Login] = useState();
  const [totalAmravatiOnlineCount, setTotalAmravatiOnlineCount] = useState();
  const [totalAurangabadPhase1Villages, setTotalAurangabadPhase1Villages] = useState();
  const [totalAurangabadPhase1Login, setTotalAurangabadPhase1Login] = useState();
  const [totalAurangabadOnlineCount, setTotalAurangabadOnlineCount] = useState();
  const [totalKokanPhase1Villages, setTotalKokanPhase1Villages] = useState();
  const [totalKokanPhase1Login, setTotalKokanPhase1Login] = useState();
  const [totalKokanOnlineCount, setTotalKokanOnlineCount] = useState();
  const [totalNagpurPhase1Villages, setTotalNagpurPhase1Villages] = useState();
  const [totalNagpurPhase1Login, setTotalNagpurPhase1Login] = useState();
  const [totalNagpurOnlineCount, setTotalNagpurOnlineCount] = useState();
  const [totalNashikPhase1Villages, setTotalNashikPhase1Villages] = useState();
  const [totalNashikPhase1Login, setTotalNashikPhase1Login] = useState();
  const [totalNashikOnlineCount, setTotalNashikOnlineCount] = useState();
  const [totalPunePhase1Villages, setTotalPunePhase1Villages] = useState();
  const [totalPunePhase1Login, setTotalPunePhase1Login] = useState();
  const [totalPuneOnlineCount, setTotalPuneOnlineCount] = useState();
  const [isAddLandAdded, setIsAddLandAdded] = useState();

  const [showSpin, setshowSpin] = useState(false);
  const [showSpin2, setshowSpin2] = useState(false);

  const antIcon = (
    <LoadingOutlined
      style={{
        fontSize: 20,
        color: 'white',
      }}
      spin
    />
  );

  //asha new 0ct13
  const [showDistrict, setshowDistrict] = useState(false);
  const [showDistrict4, setshowDistrict4] = useState(false);
  const [showDistrict5, setshowDistrict5] = useState(false);
  let history = useHistory();

  //Rahul 21 Nov
  const [showTaluka, setshowTaluka] = useState(false);
  const [showTalukafortab4, setshowTalukafortab4] = useState(false);

  // Tab 2
  const [showDistrictForTab2, setShowDistrictForTab2] = useState(false);
  const [dashBoardforDistrictTab2, setDashBoardforDistrictTab2] = useState();
  const [tab2DistrictDetail, setTab2DistrictDetail] = useState();
  const [divisionCodeTab2, setDivisionCodeTab2] = useState();

  const [showTalukaForTab2, setShowTalukaForTab2] = useState(false);
  const [dashBoardforTalukaTab2, setDashBoardforTalukaTab2] = useState();
  const [tab2TalukaDetail, setTab2TalukaDetail] = useState();
  const [districtCodeTab2, setDistrictCodeTab2] = useState();
  const [talukaCodeTab2, setTalukaCodeTab2] = useState();

  const [countDistrictLrDuesAdded, setDistrictCountIsLrDuesAdded] = useState();
  const [countDistrictKajapaAdded, setDistrictCountKajapaAdded] = useState();
  const [countDistrictisMsLrAdded1, setDistrictCountisMsLrAdded1] = useState();
  const [countDistrictisNoticeAdded1, setDistrictCountisNoticeAdded1] = useState();
  const [countDistrictisKhataMergeAdded1, setDistrictCountisKhataMergeAdded1] = useState();
  const [countDistrictisAddLandAdded1, setDistrictCountisAddLandAdded] = useState();
  const [countDistrictTotalVillage, setDistrictCountTotalVillage] = useState();

  const [countTalukaKajapaAdded, setTalukaCountKajapaAdded] = useState();
  const [countTalukaisMsLrAdded1, setTalukaCountisMsLrAdded1] = useState();
  const [countTalukaisNoticeAdded1, setTalukaCountisNoticeAdded1] = useState();
  const [countTalukaisKhataMergeAdded1, setTalukaCountisKhataMergeAdded1] = useState();
  const [countTalukaisAddLandAdded, setTalukaCountisAddLandAdded] = useState();
  const [countTalukaTotalVillage, setTalukaCountTotalVillage] = useState();
  const [countTalukaIsLrDuesAdded, setTalukaCountIsLrDuesAdded] = useState();

  // Tab 4
  const [dashBoardforTalukaTab4, setDashBoardforTalukaTab4] = useState();

  // Tab 5
  const [showTalukafortab5, setshowTalukafortab5] = useState(false);
  const [dashBoardDetailTab45, setDashBoardDetailforTab5] = useState();
  const [dashBoardforTalukaTab5, setDashBoardforTalukaTab5] = useState();

  //selectedYear
  const [selectedYear, setSelectedYear] = useState('2024-2025');
  const [showDistrictforStaticDashboard, setshowDistrictforStaticDashboard] = useState(false);
  const [sequenceA, setSequenceA] = useState();
  const [active, setActive] = useState(false);

  const [totalCountdyslrWorkCompletedCount, settotalCountdyslrWorkCompletedCount] = useState();
  const [totalCountdyslrWorkCompletedCountDivision, settotalCountdyslrWorkCompletedCountDivision] =
    useState();

  const [showPreDashboard, setshowPreDashboard] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    methods,
    reset,
    formState: { errors },
  } = useForm({
    criteriaMode: 'all',
    // resolver: yupResolver(schema),
    mode: 'onChange',
  });

  useEffect(() => {
    getDashBoardDetails();
    getDashBoardDetails2023_2024_MDiv();
  }, []);
  useEffect(() => {
    getDashBoardDetails1();
    getDashBoardDetails1_2023_2024_DistricrGrid();
  }, []);
  useEffect(() => {
    getDashBoardDetails2();
    getDashBoardDetails2_2023_2024();
  }, []);
  useEffect(() => {
    getDashBoardDetails2forTab4();
  }, []);
  useEffect(() => {
    getDashBoardDetailsforTab5();
  }, []);
  // useEffect(() => {
  //   getTabD4etails();
  // }, []);
  useEffect(() => {
    getTab5Details();
  }, []);

  useEffect(() => {}, [divisionCode]);
  useEffect(() => {}, [talukaCode]);

  useEffect(() => {}, [divisionCodeTab4]);
  useEffect(() => {}, [divisionCodeTab5]);

  // useEffect(() => {
  //   getDashBoardTotalCount();
  // }, [divisionCode]);
  const handleYearChange = async (e) => {
    // setSelectedYear('');
    console.log('Selected Year...', e?.target?.value);
    setSelectedYear(e?.target?.value);

    if (e?.target?.value === '2022-2023') {
      setshowStaticDashboard(true);
      setshowPreDashboard(false);
      setshowCurrentDashboard(false);
    }

    if (e?.target?.value === '2023-2024') {
      setshowPreDashboard(true);
      setshowStaticDashboard(false);
      setshowCurrentDashboard(false);
    }

    if (e?.target?.value === '2024-2025') {
      setshowCurrentDashboard(true);
      setshowPreDashboard(false);
      setshowStaticDashboard(false);
    }
  };

  const getStaticMISData = async () => {
    sendRequest(
      `${URLS.AuthURL}/staticDashboard?code=0&year=2022-2023`,
      'GET',
      null,
      (res) => {
        try {
          setstaticdashBoardDivision(
            res.data.map((r, i) => ({
              vibhagjillaha1: r.vibhagjillaha1,
              jilhanchisankhya2: r.jilhanchisankhya2,
              talukasankhya3: r.talukasankhya3,
              totalgaonsankhya4: r.totalgaonsankhya4,
              bhagonegoansankhya5: r.bhagonegoansankhya5,
              logingoansankhya6: r.logingoansankhya6,
              vasuligoansankhya7: r.vasuligoansankhya7,
              totalbharlalihiti8: r.totalbharlalihiti8,
              year: r.year,

              sequence: r.sequence,
            })),
          );
          setshowSpin(false);
        } catch (error) {
          console.log(error);
        }
      },
      (err) => {
        console.log(err, 'errror in getStaticMISDataDiv');
      },
    );
  };

  useEffect(() => {
    getStaticMISData();
  }, []);

  const getStaticMISDataDistrict = async (code, year) => {
    sendRequest(
      `${URLS.AuthURL}/staticDashboard?code=${code === undefined ? '' : code}&year=${
        year === undefined ? '' : year
      }`,
      'GET',
      null,
      (res) => {
        try {
          setstaticdashBoardDistrict(
            res.data.map((r, i) => ({
              vibhagjillaha1d: r.vibhagjillaha1,
              jilhanchisankhya2d: r.jilhanchisankhya2,
              talukasankhya3d: r.talukasankhya3,
              totalgaonsankhya4d: r.totalgaonsankhya4,
              bhagonegoansankhya5d: r.bhagonegoansankhya5,
              logingoansankhya6d: r.logingoansankhya6,
              vasuligoansankhya7d: r.vasuligoansankhya7,
              totalbharlalihiti8d: r.totalbharlalihiti8,
              yeard: r.year,
              sequenced: r.sequence,
            })),
          );
          setshowSpin(false);
        } catch (error) {
          console.log(error);
        }
      },
      (err) => {
        console.log(err, 'errror in getStaticMISDataDistrict');
      },
    );
  };

  //method for handling year select
  // const handleYearChange = (e) => {
  //   // console.log('Selected Year...', e?.target?.value);
  //   setSelectedYear(e?.target?.value);
  // };

  useEffect(() => {
    if (servarthId === 'Collector' || servarthId === null) {
      getZoneData();
    } else {
      <>
        <Alert
          message="Error"
          description="This is an error message about copywriting."
          type="error"
          showIcon
        />
        ;
      </>;
      Modal.error({
        okType: 'danger',
        okText: 'रद्द करा ',

        //cancelText: <FormattedMessage id="formLanguage.form.no" />,
        title: 'ई-चावडी माहिती',
        // content: 'सदर अहवालसाठी आपण पात्र नाही',
        content: 'सदर  अहवाल जिल्हाअधिकारी लॉगिनला उपलब्ध आहे',
        onCancel() {},
      });
    }
  }, []);

  const date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();

  const getZoneData = async () => {
    setOpen(!open);

    sendRequest(`${URLS.AuthURL}/getDivisionLst`, 'GET', null, (res) => {
      setZoneData(
        res.data.map((r, i) => ({
          divisionCode: r.divisionCode,
          divisionName: r.divisionName,
        })),
      );
    });
    setOpen(false);
  };
  //Main Division grid
  const getDashBoardDetails2023_2024_MDiv = async (divisionCode) => {
    // alert('data fetched');

    sendRequest(
      // `${URLS.AuthURL}/adminDashboard?divisionCode=${
      //   divisionCode === undefined ? '' : divisionCode
      // }`,
      //`${URLS.AuthURL}/adminDashboard?divisionCode=${''}`,
      // `${URLS.AuthURL}/adminDashboardUpdatedMIS?divisionCode=${''}`,
      // `${URLS.AuthURL}/adminDashboardUpdatedMIS?divisionCode=${''}`,
      `${URLS.AuthURL}/adminDashboardUpdatedMISPre?divisionCode=${''}`,

      'POST',
      null,
      (res) => {
        //alert('Data Fetch');
        console.log(res, '----Data---Dashboard  for Division 0');
        setDashBoardDetail2023_2024_MDiv(
          res.data.map((r, i) => ({
            divisionName: r.divisionName,
            divisionCode: r.divisionCode,
            districtCode: r.districtCode,
            districtName: r.districtName,
            talukaName: r.talukaName,
            totalDemandCompletedCount: r.totalDemandCompletedCount,
            totalGaonNamunaCount: r.totalGaonNamunaCount,
            vasuliCompletedCount: r.vasuliCompletedCount,
            vasuliWithoutDemandCount: r.vasuliWithoutDemandCount,
            totalEntry: r.totalEntry,
            districtsCount: r.districtsCount,
            totalPhase1Login: r.totalPhase1Login,
            totalPhase1Villages: r.totalPhase1Villages,
            totalVillages: r.totalVillages,
            totalKhataNumbers: r.totalKhataNumbers,
            totalTaluka: r.totalTaluka,
            totalOnlineVillagesCount: r.totalOnlineVillagesCount,
            demandCount: r.demandCount,
            totalOfSevenEight: r.totalOfSevenEight,
            chartPlotting: getChartData(
              r.divisionCode,
              r.totalVillages,
              r.totalPhase1Login,
              r.totalPhase1Villages,
              r.totalOnlineVillagesCount,
            ),
          })),

          // console.log('DIvisionCOde kidhar he?', res.data.divisionCode),
        );
        // setDashBoardDetailExcel(res.data, dashBoardCount?.districtsCount);
      },
      (err) => {
        // alert('errror in Division Dashboard');
        console.log(err, 'errror in Division Dashboard');
        //setshowSpin2(false);
      },
      getDashBoardTotalCount2023_2024_TD(),
      setIsLoading(false),
      setOpen(false),
      // getTab2Details(),
    );
  };
  //-----------New ------
  //total Division 2023 2024
  const getDashBoardTotalCount2023_2024_TD = async () => {
    //alert('data fetched');
    setIsLoading(true);
    setOpen(!open);
    sendRequest(
      `${URLS.AuthURL}/getDivisionCountUpdatedMISPre?divisionCode=${''}`,
      //`${URLS.AuthURL}/getDivisionCount?divisionCode=${''}`,
      // `${URLS.AuthURL}/getDivisionCount?divisionCode=${
      //   divisioncode === undefined ? '' : divisioncode
      // }`,
      'POST',
      null,
      (r) => {
        //alert('data fetched');
        // console.log(r, 'Division Dashboard Total Data--------->');
        setDashBoardCount2023_2024_TD({
          districtsCount: r.data.districtsCount,
          totalEntryT: r.data.totalEntry,
          totalPhase1LoginT: r.data.totalPhase1Login,
          totalPhase1VillagesT: r.data.totalPhase1Villages,
          totalTalukaT: r.data.totalTaluka,
          totalVillagesT: r.data.totalVillages,
          totalKhataNumberT: r.data.totalKhataNumbers,
          totalOnlineVillagesCount: r.data.totalOnlineVillagesCount,

          totalDemandCompletedCountT: r.data.totalDemandCompletedCount,
          totalGaonNamunaCountT: r.data.totalGaonNamunaCount,
          vasuliCompletedCountT: r.data.vasuliCompletedCount,
          vasuliWithoutDemandCountT: r.data.vasuliWithoutDemandCount,
          demandCountT: r.data.demandCount,
          totalOfSevenEightT: r.data.totalOfSevenEight,
        });
      },
    );
  };

  const getDashBoardDetails1_2023_2024_DistricrGrid = async (divisioncode) => {
    sendRequest(
      //`${URLS.AuthURL}/adminDashboard?divisionCode=${
      `${URLS.AuthURL}/adminDashboardUpdatedMISPre?divisionCode=${
        divisioncode === undefined ? '' : divisioncode
      }`,
      // `${URLS.AuthURL}/getDivisionAndDTCount?divisionCode=${
      //   divisioncode === undefined ? '' : divisioncode
      // }&districtCode=${districtCode}`,
      'POST',
      null,
      (res) => {
        console.log(res, '----Data---Dashboard 1  dashBoardDetail1_2023_2024');
        setDashBoardDetail1_2023_2024_Dist(
          res.data.map((r, i) => ({
            divisionName: r.divisionName,
            divisionCode: divisioncode,
            districtCode: r.districtCode,
            districtName: r.districtName,
            talukaCode: r.talukaCode,
            talukaName: r.talukaName,
            totalEntry: r.totalEntry,
            totalDemandCompletedCount: r.totalDemandCompletedCount,
            totalGaonNamunaCount: r.totalGaonNamunaCount,
            vasuliCompletedCount: r.vasuliCompletedCount,
            vasuliWithoutDemandCount: r.vasuliWithoutDemandCount,
            districtsCount: r.districtsCount,
            totalPhase1Login: r.totalPhase1Login,
            totalPhase1Villages: r.totalPhase1Villages,
            totalVillages: r.totalVillages,
            totalKhataNumbers: r.totalKhataNumbers,
            totalTaluka: r.totalTaluka,
            totalOnlineVillagesCount: r.totalOnlineVillagesCount,
            demandCount: r.demandCount,
            totalOfSevenEight: r.totalOfSevenEight,
            chartPlotting: getChartData(
              r.divisionCode,
              r.totalVillages,
              r.totalPhase1Login,
              r.totalPhase1Villages,
              r.totalOnlineVillagesCount,
            ),
          })),
          // console.log('DIvisionCOde kidhar he?', res.data.divisionCode),
        );

        setshowSpin(false);
      },
      (err) => {
        //console.log(err, 'err');
        setshowSpin(false);
      },
      setDashBoardDetail1_2023_2024_Dist([]),
      getDashBoardTotalCount1_2023_2024_Dist(divisioncode),
      setIsLoading(false),
      setOpen(false),
    );
  };
  const getDashBoardTotalCount1_2023_2024_Dist = async (divisioncode) => {
    setIsLoading(true);
    setOpen(!open);
    sendRequest(
      // `${URLS.AuthURL}/getDivisionCount?divisionCode=${
      `${URLS.AuthURL}/getDivisionCountUpdatedMISPre?divisionCode=${
        divisioncode === undefined ? '' : divisioncode
      }`,
      'POST',
      null,
      (r) => {
        console.log(r, 'getDashBoardTotalCount 1');
        setDashBoardCount1_2023_2024_Dist_Count({
          districtsCount: r.data.districtsCount,
          totalEntryT: r.data.totalEntry,
          totalPhase1LoginT: r.data.totalPhase1Login,
          totalPhase1VillagesT: r.data.totalPhase1Villages,
          totalTalukaT: r.data.totalTaluka,
          totalVillagesT: r.data.totalVillages,
          totalKhataNumberT: r.data.totalKhataNumbers,
          totalOnlineVillagesCount: r.data.totalOnlineVillagesCount,
          totalGaonNamunaCountT: r.data.totalGaonNamunaCount,
          vasuliCompletedCountT: r.data.vasuliCompletedCount,
          vasuliWithoutDemandCountT: r.data.vasuliWithoutDemandCount,
          totalDemandCompletedCountT: r.data.totalDemandCompletedCount,
          demandCountT: r.data.demandCount,
          totalOfSevenEightT: r.data.totalOfSevenEight,
        });

        // getTab2Details();
        // getTab3Details();
      },
    );
  };

  const getDashBoardDetails2_2023_2024 = async (divisioncode, districtCode) => {
    // alert(districtCode);
    sendRequest(
      `${URLS.AuthURL}/adminDashboardTalukaDetailPre?divisionCode=${
        divisioncode === undefined ? '' : divisioncode
      }&districtCode=${districtCode === undefined ? '' : districtCode}`,
      'POST',
      null,
      (res) => {
        console.log(res, '-------Taluka-----2023');
        setDashBoardDetail2_2023_2024(
          res.data.map((r, i) => ({
            divisionName: r.divisionName,
            divisionCode: divisioncode,
            districtCode: r.districtCode,
            districtName: r.districtName,
            talukaCode: r.talukaCode,
            talukaName: r.talukaName,
            totalEntry: r.totalEntry,
            totalDemandCompletedCount: r.totalDemandCompletedCount,
            totalGaonNamunaCount: r.totalGaonNamunaCount,
            vasuliCompletedCount: r.vasuliCompletedCount,
            vasuliWithoutDemandCount: r.vasuliWithoutDemandCount,
            districtsCount: r.districtsCount,
            totalPhase1Login: r.totalPhase1Login,
            totalPhase1Villages: r.totalPhase1Villages,
            totalVillages: r.totalVillages,
            totalKhataNumbers: r.totalKhataNumbers,
            totalTaluka: r.totalTaluka,
            totalOnlineVillagesCount: r.totalOnlineVillagesCount,
            totalOnlineVillagesCount: r.totalOnlineVillagesCount,
            demandCount: r.demandCount,
            totalOfSevenEight: r.totalOfSevenEight,
            chartPlotting: getChartData(
              r.divisionCode,
              r.totalVillages,
              r.totalPhase1Login,
              r.totalPhase1Villages,
              r.totalOnlineVillagesCount,
            ),
          })),
          //console.log('DIvisionCOde kidhar he?', res.data.divisionCode),
        );
        setshowSpin2(false);
      },
      (err) => {
        // console.log(err, 'err');
        setshowSpin2(false);
      },
      //setDashBoardCount2([]),
      //getDashBoardTotalCount2_2023_2024_DistTotalCount(divisioncode, districtCode),
      setIsLoading(false),
      setOpen(false),
    );
  };

  const getDashBoardDetails = async (divisionCode) => {
    // alert('data fetched');
    sendRequest(
      // `${URLS.AuthURL}/adminDashboard?divisionCode=${
      //   divisionCode === undefined ? '' : divisionCode
      // }`,
      //`${URLS.AuthURL}/adminDashboard?divisionCode=${''}`,
      `${URLS.AuthURL}/adminDashboardUpdatedMIS?divisionCode=${''}`,

      'POST',
      null,
      (res) => {
        //alert('Data Fetch');
        //console.log(res, '----Data---Dashboard  for Division 0');
        setDashBoardDetail(
          res.data.map((r, i) => ({
            divisionName: r.divisionName,
            divisionCode: r.divisionCode,
            districtCode: r.districtCode,
            districtName: r.districtName,
            talukaName: r.talukaName,
            totalDemandCompletedCount: r.totalDemandCompletedCount,
            totalGaonNamunaCount: r.totalGaonNamunaCount,
            vasuliCompletedCount: r.vasuliCompletedCount,
            vasuliWithoutDemandCount: r.vasuliWithoutDemandCount,
            totalEntry: r.totalEntry,
            districtsCount: r.districtsCount,
            totalPhase1Login: r.totalPhase1Login,
            totalPhase1Villages: r.totalPhase1Villages,
            totalVillages: r.totalVillages,
            totalKhataNumbers: r.totalKhataNumbers,
            totalTaluka: r.totalTaluka,
            totalOnlineVillagesCount: r.totalOnlineVillagesCount,
            demandCount: r.demandCount,
            totalOfSevenEight: r.totalOfSevenEight,
            chartPlotting: getChartData(
              r.divisionCode,
              r.totalVillages,
              r.totalPhase1Login,
              r.totalPhase1Villages,
              r.totalOnlineVillagesCount,
            ),
          })),

          // console.log('DIvisionCOde kidhar he?', res.data.divisionCode),
        );
        // setDashBoardDetailExcel(res.data, dashBoardCount?.districtsCount);
      },
      (err) => {
        // alert('errror in Division Dashboard');
        console.log(err, 'errror in Division Dashboard');
        //setshowSpin2(false);
      },
      getDashBoardTotalCount(),
      setIsLoading(false),
      setOpen(false),
      // getTab2Details(),
    );
  };

  const getDashBoardDetails1 = async (divisioncode) => {
    sendRequest(
      //`${URLS.AuthURL}/adminDashboard?divisionCode=${
      `${URLS.AuthURL}/adminDashboardUpdatedMIS?divisionCode=${
        divisioncode === undefined ? '' : divisioncode
      }`,
      // `${URLS.AuthURL}/getDivisionAndDTCount?divisionCode=${
      //   divisioncode === undefined ? '' : divisioncode
      // }&districtCode=${districtCode}`,
      'POST',
      null,
      (res) => {
        // console.log(res, '----Data---Dashboard 1 ');
        setDashBoardDetail1(
          res.data.map((r, i) => ({
            divisionName: r.divisionName,
            divisionCode: divisioncode,
            districtCode: r.districtCode,
            districtName: r.districtName,
            talukaCode: r.talukaCode,
            talukaName: r.talukaName,
            totalEntry: r.totalEntry,
            totalDemandCompletedCount: r.totalDemandCompletedCount,
            totalGaonNamunaCount: r.totalGaonNamunaCount,
            vasuliCompletedCount: r.vasuliCompletedCount,
            vasuliWithoutDemandCount: r.vasuliWithoutDemandCount,
            districtsCount: r.districtsCount,
            totalPhase1Login: r.totalPhase1Login,
            totalPhase1Villages: r.totalPhase1Villages,
            totalVillages: r.totalVillages,
            totalKhataNumbers: r.totalKhataNumbers,
            totalTaluka: r.totalTaluka,
            totalOnlineVillagesCount: r.totalOnlineVillagesCount,
            demandCount: r.demandCount,
            totalOfSevenEight: r.totalOfSevenEight,
            chartPlotting: getChartData(
              r.divisionCode,
              r.totalVillages,
              r.totalPhase1Login,
              r.totalPhase1Villages,
              r.totalOnlineVillagesCount,
            ),
          })),
          // console.log('DIvisionCOde kidhar he?', res.data.divisionCode),
        );

        setshowSpin(false);
      },
      (err) => {
        //console.log(err, 'err');
        setshowSpin(false);
      },
      setDashBoardCount1([]),
      getDashBoardTotalCount1(divisioncode),
      setIsLoading(false),
      setOpen(false),
    );
  };

  const getDashBoardDetails2 = async (divisioncode, districtCode) => {
    // alert(districtCode);
    sendRequest(
      `${URLS.AuthURL}/adminDashboardTalukaDetail?divisionCode=${
        divisioncode === undefined ? '' : divisioncode
      }&districtCode=${districtCode === undefined ? '' : districtCode}`,
      'POST',
      null,
      (res) => {
        //console.log(res, '----Data---Dashboard--------adminDashboardTalukaDetail----2');
        setDashBoardDetail2(
          res.data.map((r, i) => ({
            divisionName: r.divisionName,
            divisionCode: divisioncode,
            districtCode: r.districtCode,
            districtName: r.districtName,
            talukaCode: r.talukaCode,
            talukaName: r.talukaName,
            totalEntry: r.totalEntry,
            totalDemandCompletedCount: r.totalDemandCompletedCount,
            totalGaonNamunaCount: r.totalGaonNamunaCount,
            vasuliCompletedCount: r.vasuliCompletedCount,
            vasuliWithoutDemandCount: r.vasuliWithoutDemandCount,
            districtsCount: r.districtsCount,
            totalPhase1Login: r.totalPhase1Login,
            totalPhase1Villages: r.totalPhase1Villages,
            totalVillages: r.totalVillages,
            totalKhataNumbers: r.totalKhataNumbers,
            totalTaluka: r.totalTaluka,
            totalOnlineVillagesCount: r.totalOnlineVillagesCount,
            demandCount: r.demandCount,
            totalOfSevenEight: r.totalOfSevenEight,
            chartPlotting: getChartData(
              r.divisionCode,
              r.totalVillages,
              r.totalPhase1Login,
              r.totalPhase1Villages,
              r.totalOnlineVillagesCount,
            ),
          })),
          //console.log('DIvisionCOde kidhar he?', res.data.divisionCode),
        );
        setshowSpin2(false);
      },
      (err) => {
        // console.log(err, 'err');
        setshowSpin2(false);
      },
      //setDashBoardCount2([]),
      //getDashBoardTotalCount2(divisioncode, districtCode),
      setIsLoading(false),
      setOpen(false),
    );
  };

  const getDashBoardDetails2forTab4 = async (divisioncode, districtCode) => {
    //alert(divisioncode, 'division Code');
    sendRequest(
      `${URLS.AuthURL}/adminDashboardTalukaDetailTab4?divisionCode=${
        divisioncode === undefined ? '' : divisioncode
      }&districtCode=${districtCode === undefined ? '' : districtCode}`,
      'POST',
      null,
      (res) => {
        //console.log(res, '----Data---Dashboard--------adminDashboardTalukaDetail----->4');
        setDashBoardforTalukaTab4(
          res.data.map((r, i) => ({
            divisionName: r.divisionName,
            divisionCode: divisioncode,
            districtCode: r.districtCode,
            districtName: r.districtName,
            talukaCode: r.talukaCode,
            talukaName: r.talukaName,
            totalEntry: r.totalEntry,
            totalDyslrWorkCount: r.totalDyslrWorkCount,
            // totalDyslrWorkCountForTaluka:
            //   r.totalDyslrWorkCountForTaluka == 'null' ? '0' : r.totalDyslrWorkCountForTaluka,
            // dyslrWorkCompletedCount:
            //   r.dyslrWorkCompletedCount == 'null' ? '0' : r.dyslrWorkCompletedCount,
            //डी.वाय.असं.आलं.आर यांनी आकारबंद भरण्यासाठी कामकाज सुरु केलेल्या गावांची संख्या *100/एकूण गावांची संख्या
            // dyslrWorkCompletedCount: Math.round((parseInt(2) * 100) / parseInt(r.totalVillages)),
            dyslrWorkCompletedCount: Math.round((r.totalDyslrWorkCount * 100) / r.totalVillages),
            // dyslrWorkCompletedCount: Math.round((2 * 100) / 2),
            districtsCount: r.districtsCount,
            totalPhase1Login: r.totalPhase1Login,
            totalPhase1Villages: r.totalPhase1Villages,
            totalVillages: r.totalVillages,
            totalKhataNumbers: r.totalKhataNumbers,
            totalTaluka: r.totalTaluka,
            totalOnlineVillagesCount: r.totalOnlineVillagesCount,
            Finaltotal: Math.round((r.totalDyslrWorkCount * 100) / r.totalVillages),
            chartPlotting: getChartData(
              r.divisionCode,
              r.totalVillages,
              r.totalPhase1Login,
              r.totalPhase1Villages,
              r.totalOnlineVillagesCount,

              // console.log(r.totalDyslrWorkCount + '----' + r.totalVillages),
              // console.log(
              //   Math.round((r.totalDyslrWorkCount * 100) / r.totalVillages) + '----Total',
              // ),

              // console.log(
              //   Math.round((r.totalDyslrWorkCount * 100) / r.totalVillages) + '----FinalTotal',
              // ),
            ),
          })),
          //console.log('DIvisionCOde kidhar he?', res.data.divisionCode),
        );
        setshowSpin2(false);
      },
      (err) => {
        // console.log(err, 'err');
        setshowSpin2(false);
      },
      //setDashBoardCount2([]),
      //getDashBoardTotalCount2(divisioncode, districtCode),
      setIsLoading(false),
      setOpen(false),
    );
  };
  const getDashBoardDetailsforTab5 = async (divisioncode, districtCode) => {
    //alert(divisioncode, 'division Code');
    sendRequest(
      `${URLS.AuthURL}/adminDashboardTalukaDetailTab4?divisionCode=${
        divisioncode === undefined ? '' : divisioncode
      }&districtCode=${districtCode === undefined ? '' : districtCode}`,
      'POST',
      null,
      (res) => {
        //console.log(res, '----Data---Dashboard--------adminDashboardTalukaDetail----->5');
        setDashBoardforTalukaTab5(
          res.data.map((r, i) => ({
            divisionName: r.divisionName,
            divisionCode: divisioncode,
            districtCode: r.districtCode,
            districtName: r.districtName,
            talukaCode: r.talukaCode,
            talukaName: r.talukaName,
            totalEntry: r.totalEntry,
            totalDyslrWorkCount: r.totalDyslrWorkCount,
            // totalDyslrWorkCountForTaluka:
            //   r.totalDyslrWorkCountForTaluka == 'null' ? '0' : r.totalDyslrWorkCountForTaluka,
            dyslrWorkCompletedCount:
              r.dyslrWorkCompletedCount == 'null' ? '0' : r.dyslrWorkCompletedCount,
            districtsCount: r.districtsCount,
            totalPhase1Login: r.totalPhase1Login,
            totalPhase1Villages: r.totalPhase1Villages,
            totalVillages: r.totalVillages,
            totalKhataNumbers: r.totalKhataNumbers,
            totalTaluka: r.totalTaluka,
            totalOnlineVillagesCount: r.totalOnlineVillagesCount,
            chartPlotting: getChartData(
              r.divisionCode,
              r.totalVillages,
              r.totalPhase1Login,
              r.totalPhase1Villages,
              r.totalOnlineVillagesCount,
            ),
          })),
          //console.log('DIvisionCOde kidhar he?', res.data.divisionCode),
        );
        setshowSpin2(false);
      },
      (err) => {
        // console.log(err, 'err');
        setshowSpin2(false);
      },
      //setDashBoardCount2([]),
      //getDashBoardTotalCount2(divisioncode, districtCode),
      setIsLoading(false),
      setOpen(false),
    );
  };
  //---Tab2 --Division List
  const getTab2Details = async () => {
    sendRequest(
      `${URLS.AuthURL}/getPragatipatraNineCount`,
      'POST',
      null,
      (res) => {
        //console.log(res, '------getTab2Details----');
        // alert(divisionCode, '-----');

        let data = [];
        let sum1 = 0;
        let sum2 = 0;
        let sum3 = 0;
        let sum4 = 0;
        let sum5 = 0;
        let sum6 = 0;
        let sum7 = 0;

        res.data.filter((r) => {
          data.push({
            divisionName: r.divisionName,
            divisionCode: r.divisionCode,
            isAddLandAdded: r.isAddLandAdded,
            isKajapaAdded: r.isKajapaAdded,
            isKhataMergeAdded: r.isKhataMergeAdded,
            isLrDuesAdded: r.isLrDuesAdded,
            isMsLrAdded: r.isMsLrAdded,
            isNoticeAdded: r.isNoticeAdded,
            villageCount: r.villageCount,
          });
          sum1 = sum1 + parseInt(r.isLrDuesAdded);
          sum2 = sum2 + parseInt(r.isKajapaAdded);
          sum3 = sum3 + parseInt(r.isMsLrAdded);
          sum4 = sum4 + parseInt(r.isNoticeAdded);
          sum5 = sum5 + parseInt(r.isKhataMergeAdded);
          sum6 = sum6 + parseInt(r.isAddLandAdded);
          sum7 = sum7 + parseInt(r.villageCount);
        });
        // data.push({
        //   divisionName: res.data.divisionName,
        //   divisionCode: res.data.divisionCode,
        //   isAddLandAdded: res.data.isAddLandAdded,
        //   isKajapaAdded: res.data.isKajapaAdded,
        //   isKhataMergeAdded: res.data.isKhataMergeAdded,
        //   isLrDuesAdded: res.data.isLrDuesAdded,
        //   isMsLrAdded: res.data.isMsLrAdded,
        //   isNoticeAdded: res.data.isNoticeAdded,
        // });

        //console.log(data, '*****************');
        setTab2Detail(data);
        setCountIsLrDuesAdded(sum1);
        setCountKajapaAdded(sum2);
        setCountisMsLrAdded1(sum3);
        setCountisNoticeAdded1(sum4);
        setCountisKhataMergeAdded1(sum5);
        setCountisAddLandAdded(sum6);
        setCountTotalVillage(sum7);

        // setTab2Detail(
        //   // setDivisionCode(res.data.divisionCode),
        //   // setIsAddLandAdded(res.data.isAddLandAdded),
        //   res.data.map((r, i) => ({
        //     // divisionName: r.divisionName,
        //     divisionCode: r.divisionCode,
        //     isAddLandAdded: r.isAddLandAdded,
        //     isKajapaAdded: r.isKajapaAdded,
        //     isKhataMergeAdded: r.isKhataMergeAdded,
        //     isLrDuesAdded: r.isLrDuesAdded,
        //     isMsLrAdded: r.isMsLrAdded,
        //     isNoticeAdded: r.isNoticeAdded,
        //   })),
        //   // console.log('DIvisionCOde kidhar he?', res.data.divisionCode),
        // );
      },
      (err) => {
        // alert('errror in Division Dashboard');
        console.log(err, 'errror in Division List Tab2');
        //setshowSpin2(false);
      },
      setIsLoading(false),
      setOpen(false),
    );
  };
  //---Tab2 District List
  const getDistrictDetailsForTab2 = async (divisioncodeTab2) => {
    sendRequest(
      `${URLS.AuthURL}/getPragatipatraNineTab2ForDistrictList?divisionCode=${
        divisioncodeTab2 === undefined ? '' : divisioncodeTab2
      }`,

      'POST',
      null,
      (res) => {
        //console.log(res, '------getTab2Details District List---->2');
        // alert(divisionCode, '-----');

        let data = [];
        let sum1District = 0;
        let sum2District = 0;
        let sum3District = 0;
        let sum4District = 0;
        let sum5District = 0;
        let sum6District = 0;
        let sum7District = 0;

        res.data.filter((r) => {
          data.push({
            divisionName: r.divisionName,
            divisionCode: r.divisionCode,
            districtCode: r.districtCode,
            districtName: r.districtNameMarathi,

            isAddLandAdded: r.isAddLandAdded,
            isKajapaAdded: r.isKajapaAdded,
            isKhataMergeAdded: r.isKhataMergeAdded,
            isLrDuesAdded: r.isLrDuesAdded,
            isMsLrAdded: r.isMsLrAdded,
            isNoticeAdded: r.isNoticeAdded,
            villageCount: r.villageCount,
          });
          sum1District = sum1District + parseInt(r.isLrDuesAdded);
          sum2District = sum2District + parseInt(r.isKajapaAdded);
          sum3District = sum3District + parseInt(r.isMsLrAdded);
          sum4District = sum4District + parseInt(r.isNoticeAdded);
          sum5District = sum5District + parseInt(r.isKhataMergeAdded);
          sum6District = sum6District + parseInt(r.isAddLandAdded);
          sum7District = sum7District + parseInt(r.villageCount);
        });

        // console.log(data, '*****************');
        setTab2DistrictDetail(data);
        setDistrictCountIsLrDuesAdded(sum1District);
        setDistrictCountKajapaAdded(sum2District);
        setDistrictCountisMsLrAdded1(sum3District);
        setDistrictCountisNoticeAdded1(sum4District);
        setDistrictCountisKhataMergeAdded1(sum5District);
        setDistrictCountisAddLandAdded(sum6District);
        setDistrictCountTotalVillage(sum7District);
      },
      (err) => {
        // alert('errror in Division Dashboard');
        console.log(err, 'errror in District List Tab2');
        //setshowSpin2(false);
      },
      setIsLoading(false),
      setOpen(false),
    );
  };
  const getTalukaDetailsForTab2 = async (divisioncodeTab2, districtcodeTab2) => {
    sendRequest(
      `${URLS.AuthURL}/getPragatipatraNineTab2ForTalukaList?divisionCode=${
        divisioncodeTab2 === undefined ? '' : divisioncodeTab2
      }&districtCode=${districtcodeTab2 === undefined ? '' : districtcodeTab2}`,

      'POST',
      null,
      (res) => {
        //console.log(res, '------getTab2Details Taluka List---->3');
        // alert(divisionCode, '-----');

        let data = [];
        let sum1Taluka = 0;
        let sum2Taluka = 0;
        let sum3Taluka = 0;
        let sum4Taluka = 0;
        let sum5Taluka = 0;
        let sum6Taluka = 0;
        let sum7Taluka = 0;

        res.data.filter((r) => {
          data.push({
            divisionName: r.divisionName,
            divisionCode: r.divisionCode,
            districtCode: r.districtCode,
            districtName: r.districtNameMarathi,
            talukaCode: r.talukaCode,
            talukaName: r.talukaMameMarathi,

            isAddLandAdded: r.isAddLandAdded,
            isKajapaAdded: r.isKajapaAdded,
            isKhataMergeAdded: r.isKhataMergeAdded,
            isLrDuesAdded: r.isLrDuesAdded,
            isMsLrAdded: r.isMsLrAdded,
            isNoticeAdded: r.isNoticeAdded,
            villageCount: r.villageCount,
          });
          sum1Taluka = sum1Taluka + parseInt(r.isLrDuesAdded);
          sum2Taluka = sum2Taluka + parseInt(r.isKajapaAdded);
          sum3Taluka = sum3Taluka + parseInt(r.isMsLrAdded);
          sum4Taluka = sum4Taluka + parseInt(r.isNoticeAdded);
          sum5Taluka = sum5Taluka + parseInt(r.isKhataMergeAdded);
          sum6Taluka = sum6Taluka + parseInt(r.isAddLandAdded);
          sum7Taluka = sum7Taluka + parseInt(r.villageCount);
        });

        // console.log(data, '*****************');
        setTab2TalukaDetail(data);
        setTalukaCountIsLrDuesAdded(sum1Taluka);
        setTalukaCountKajapaAdded(sum2Taluka);
        setTalukaCountisMsLrAdded1(sum3Taluka);
        setTalukaCountisNoticeAdded1(sum4Taluka);
        setTalukaCountisKhataMergeAdded1(sum5Taluka);
        setTalukaCountisAddLandAdded(sum6Taluka);
        setTalukaCountTotalVillage(sum7Taluka);
      },
      (err) => {
        // alert('errror in Division Dashboard');
        console.log(err, 'errror in Taluka List Tab2');
        //setshowSpin2(false);
      },
      setIsLoading(false),
      setOpen(false),
    );
  };

  const getTab3Details = async () => {
    sendRequest(
      `${URLS.AuthURL}/adminDashboard?divisionCode=${
        divisionCode === undefined ? '' : divisionCode
      }`,
      'POST',
      null,
      (res) => {
        // alert(divisionCode, '-----');
        setTab3Detail(
          res.data.map((r, i) => ({
            divisionName: r.divisionName,
            divisionCode: r.divisionCode,
            districtCode: r.districtCode,
            districtName: r.districtName,
            talukaName: r.talukaName,
            totalEntry: r.totalEntry,
            districtsCount: r.districtsCount,
            totalPhase1Login: r.totalPhase1Login,
            totalPhase1Villages: r.totalPhase1Villages,
            totalVillages: r.totalVillages,
            totalKhataNumbers: r.totalKhataNumbers,
            totalTaluka: r.totalTaluka,
            totalOnlineVillagesCount: r.totalOnlineVillagesCount,
            chartPlotting: getChartData(
              r.divisionCode,
              r.totalVillages,
              r.totalPhase1Login,
              r.totalPhase1Villages,
              r.totalOnlineVillagesCount,
            ),
          })),
          // console.log('DIvisionCOde kidhar he?', res.data.divisionCode),
        );
      },
      setIsLoading(false),
      setOpen(false),
    );
  };
  const getTabD4etails = async () => {
    let totalCountdyslrWorkCompletedCountDivision1 = 0;
    // alert(divisionCodeTab4);
    sendRequest(
      //`${URLS.AuthURL}/adminDashboard?divisionCode=${
      `${URLS.AuthURL}/dyslrmistableTab4?divisionCode=${
        divisionCodeTab4 === undefined ? '' : divisionCodeTab4
      }`,
      'POST',
      null,
      (res) => {
        // alert(divisionCode, '-----');
        //console.log(res, '-----------------------+     getTabD4etails     1 +');
        setTab4Detail(
          res.data.map((r, i) => ({
            divisionName: r.divisionName,
            divisionCode: r.divisionCode,
            districtCode: r.districtCode,
            districtName: r.districtName,
            // dyslrWorkCompletedCount: r.dyslrWorkCompletedCount,
            dyslrWorkCompletedCount: Math.round((r.totalDyslrWorkCount * 100) / r.totalVillages),
            talukaName: r.talukaName,
            totalEntry: r.totalEntry,
            districtsCount: r.districtsCount,
            totalDyslrWorkCount: r.totalDyslrWorkCount,
            totalPhase1Login: r.totalPhase1Login,
            totalPhase1Villages: r.totalPhase1Villages,
            totalVillages: r.totalVillages,
            totalKhataNumbers: r.totalKhataNumbers,
            totalTaluka: r.totalTaluka,
            totalOnlineVillagesCount: r.totalOnlineVillagesCount,
            chartPlotting: getChartData(
              r.divisionCode,
              r.totalVillages,
              r.totalPhase1Login,
              r.totalPhase1Villages,
              r.totalOnlineVillagesCount,
            ),
          })),
          // console.log('DIvisionCOde kidhar he?', res.data.divisionCode),
        );
        res.data.filter((r) => {
          // console.log(r.totalDyslrWorkCount + '-----' + r.totalVillages);
          totalCountdyslrWorkCompletedCountDivision1 =
            totalCountdyslrWorkCompletedCountDivision1 +
            Math.round((r.totalDyslrWorkCount * 100) / r.totalVillages);
        });
        // console.log(
        //   totalCountdyslrWorkCompletedCountDivision1,
        //   'totalCountdyslrWorkCompletedCountDivision1---------->1',
        // );
        // settotalCountdyslrWorkCompletedCountDivision(totalCountdyslrWorkCompletedCountDivision1);
      },
      getDashBoardTotalCountTab4(),
      setIsLoading(false),
      setOpen(false),
    );
  };

  // Tab4 District list shows on grid
  const getTabD4etails1 = async (divisionCodeTab4) => {
    let totalCountdyslrWorkCompletedCount = 0;
    sendRequest(
      //`${URLS.AuthURL}/adminDashboard?divisionCode=${
      `${URLS.AuthURL}/dyslrmistableTab4?divisionCode=${
        divisionCodeTab4 === undefined ? '' : divisionCodeTab4
      }`,
      'POST',
      null,
      (res) => {
        //console.log(res, '--------------+    getTabD4etails1 District list +    ');
        setTab4Detail1(
          res.data.map((r, i) => ({
            divisionName: r.divisionName,
            divisionCode: r.divisionCode,
            districtCode: r.districtCode,
            districtName: r.districtName,
            // dyslrWorkCompletedCount: r.dyslrWorkCompletedCount,
            dyslrWorkCompletedCount: Math.round((r.totalDyslrWorkCount * 100) / r.totalVillages),
            // talukaCode: r.totalTaluka,
            talukaName: r.talukaName,
            totalEntry: r.totalEntry,
            totalDyslrWorkCount: r.totalDyslrWorkCount,
            districtsCount: r.districtsCount,
            totalPhase1Login: r.totalPhase1Login,
            totalPhase1Villages: r.totalPhase1Villages,
            totalVillages: r.totalVillages,
            totalKhataNumbers: r.totalKhataNumbers,
            totalTaluka: r.totalTaluka,
            totalOnlineVillagesCount: r.totalOnlineVillagesCount,
            chartPlotting: getChartData(
              r.divisionCode,
              r.totalVillages,
              r.totalPhase1Login,
              r.totalPhase1Villages,
              r.totalOnlineVillagesCount,
            ),
          })),
          // console.log('DIvisionCOde kidhar he?', res.data.divisionCode),
        );
        res.data.filter((r) => {
          totalCountdyslrWorkCompletedCount =
            totalCountdyslrWorkCompletedCount +
            Math.round((r.totalDyslrWorkCount * 100) / r.totalVillages);
        });
        // console.log(
        //   totalCountdyslrWorkCompletedCount,
        //   'totalCountdyslrWorkCompletedCount--------------->2',
        // );
        // settotalCountdyslrWorkCompletedCount(totalCountdyslrWorkCompletedCount);
        setshowSpin(false);
      },
      (err) => {
        console.log(err, 'err');
        setshowSpin(false);
      },
      setDashBoardCount1Tab4([]),
      getDashBoardTotalCount1Tab4(divisionCodeTab4),
      setIsLoading(false),
      setOpen(false),
    );
  };
  const getTab5Details = async () => {
    sendRequest(
      `${URLS.AuthURL}/adminDashboard?divisionCode=${
        divisionCodeTab5 === undefined ? '' : divisionCodeTab5
      }`,
      'POST',
      null,
      (res) => {
        // alert(divisionCode, '-----');
        setTab5Detail(
          res.data.map((r, i) => ({
            divisionName: r.divisionName,
            divisionCode: r.divisionCode,
            districtCode: r.districtCode,
            districtName: r.districtName,
            talukaName: r.talukaName,
            totalEntry: r.totalEntry,
            districtsCount: r.districtsCount,
            totalPhase1Login: r.totalPhase1Login,
            totalPhase1Villages: r.totalPhase1Villages,
            totalVillages: r.totalVillages,
            totalKhataNumbers: r.totalKhataNumbers,
            totalTaluka: r.totalTaluka,
            totalOnlineVillagesCount: r.totalOnlineVillagesCount,
            chartPlotting: getChartData(
              r.divisionCode,
              r.totalVillages,
              r.totalPhase1Login,
              r.totalPhase1Villages,
              r.totalOnlineVillagesCount,
            ),
          })),
          // console.log('DIvisionCOde kidhar he?', res.data.divisionCode),
        );
      },
      getDashBoardTotalCountTab5(),
      setIsLoading(false),
      setOpen(false),
    );
  };
  const getTabD5etails1 = async (divisionCodeTab5) => {
    sendRequest(
      `${URLS.AuthURL}/adminDashboard?divisionCode=${
        divisionCodeTab5 === undefined ? '' : divisionCodeTab5
      }`,
      'POST',
      null,
      (res) => {
        //console.log('DIvisionCOde kidhar he?', res);
        // alert(divisionCode, '-----');
        setTab5Detail1(
          res.data.map((r, i) => ({
            divisionName: r.divisionName,
            divisionCode: r.divisionCode,
            districtCode: r.districtCode,
            districtName: r.districtName,
            talukaName: r.talukaName,
            totalEntry: r.totalEntry,
            districtsCount: r.districtsCount,
            totalPhase1Login: r.totalPhase1Login,
            totalPhase1Villages: r.totalPhase1Villages,
            totalVillages: r.totalVillages,
            totalKhataNumbers: r.totalKhataNumbers,
            totalTaluka: r.totalTaluka,
            totalOnlineVillagesCount: r.totalOnlineVillagesCount,
            chartPlotting: getChartData(
              r.divisionCode,
              r.totalVillages,
              r.totalPhase1Login,
              r.totalPhase1Villages,
              r.totalOnlineVillagesCount,
            ),
          })),
          // console.log('DIvisionCOde kidhar he?', res.data.divisionCode),
        );
        setshowSpin(false);
      },
      (err) => {
        console.log(err, 'err');
        setshowSpin(false);
      },
      setDashBoardCount1Tab5([]),
      getDashBoardTotalCount1Tab5(divisionCodeTab5),
      setIsLoading(false),
      setOpen(false),
    );
  };

  useEffect(() => {}, [tab2Detail]);
  useEffect(() => {}, [showDistrictForTab2]);
  useEffect(() => {}, [showTalukaForTab2]);
  useEffect(() => {}, [tab2DistrictDetail]);
  useEffect(() => {}, [tab2TalukaDetail]);
  useEffect(() => {}, [tab3Detail]);
  useEffect(() => {}, [tab4Detail]);
  useEffect(() => {}, [tab5Detail]);

  const getChartData = async (
    divisionCode,
    totalVillages,
    totalPhase1Login,
    totalPhase1Villages,
    totalOnlineVillagesCount,
  ) => {
    setFinalDivisionCode(divisionCode);
    setTotalDivisionEntry(totalVillages);
    setTotalPhase1Login(totalPhase1Login);
    setTotalPhase1Villages(totalPhase1Villages);
    setTotalOnlineVillagesCount(totalOnlineVillagesCount);
  };

  useEffect(() => {
    if (finalDivisionCode === '1') {
      setTotalAmravatiPhase1Villages(totalPhase1Village);
      setTotalAmravatiPhase1Login(totalPhase1Logins);
      setTotalAmravatiOnlineCount(totalOnlineVillagesCounts);
    } else if (finalDivisionCode === '2') {
      setTotalAurangabadPhase1Villages(totalPhase1Village);
      setTotalAurangabadPhase1Login(totalPhase1Logins);
      setTotalAurangabadOnlineCount(totalOnlineVillagesCounts);
    } else if (finalDivisionCode === '3') {
      setTotalKokanPhase1Villages(totalPhase1Village);
      setTotalKokanPhase1Login(totalPhase1Logins);
      setTotalKokanOnlineCount(totalOnlineVillagesCounts);
    } else if (finalDivisionCode === '4') {
      setTotalNagpurPhase1Villages(totalPhase1Village);
      setTotalNagpurPhase1Login(totalPhase1Logins);
      setTotalNagpurOnlineCount(totalOnlineVillagesCounts);
    } else if (finalDivisionCode === '5') {
      setTotalNashikPhase1Villages(totalPhase1Village);
      setTotalNashikPhase1Login(totalPhase1Logins);
      setTotalNashikOnlineCount(totalOnlineVillagesCounts);
    } else if (finalDivisionCode === '6') {
      setTotalPunePhase1Villages(totalPhase1Village);
      setTotalPunePhase1Login(totalPhase1Logins);
      setTotalPuneOnlineCount(totalOnlineVillagesCounts);
    }
  });

  // console.log('DIvisionCOde hai kya idhar?', finalDivisionCode);
  // yekun for Division
  const getDashBoardTotalCount = async () => {
    //alert('data fetched');
    setIsLoading(true);
    setOpen(!open);
    sendRequest(
      `${URLS.AuthURL}/getDivisionCountUpdatedMIS?divisionCode=${''}`,
      //`${URLS.AuthURL}/getDivisionCount?divisionCode=${''}`,
      // `${URLS.AuthURL}/getDivisionCount?divisionCode=${
      //   divisioncode === undefined ? '' : divisioncode
      // }`,
      'POST',
      null,
      (r) => {
        //alert('data fetched');
        // console.log(r, 'Division Dashboard Total Data--------->');
        setDashBoardCount({
          districtsCount: r.data.districtsCount,
          totalEntryT: r.data.totalEntry,
          totalPhase1LoginT: r.data.totalPhase1Login,
          totalPhase1VillagesT: r.data.totalPhase1Villages,
          totalTalukaT: r.data.totalTaluka,
          totalVillagesT: r.data.totalVillages,
          totalKhataNumberT: r.data.totalKhataNumbers,
          totalOnlineVillagesCount: r.data.totalOnlineVillagesCount,

          totalDemandCompletedCountT: r.data.totalDemandCompletedCount,
          totalGaonNamunaCountT: r.data.totalGaonNamunaCount,
          vasuliCompletedCountT: r.data.vasuliCompletedCount,
          vasuliWithoutDemandCountT: r.data.vasuliWithoutDemandCount,
          demandCountT: r.data.demandCount,
          totalOfSevenEightT: r.data.totalOfSevenEight,
        });

        getTab3Details();
        getTab2Details();
      },
    );
  };

  const getDashBoardTotalCount1 = async (divisioncode) => {
    setIsLoading(true);
    setOpen(!open);
    sendRequest(
      // `${URLS.AuthURL}/getDivisionCount?divisionCode=${
      `${URLS.AuthURL}/getDivisionCountUpdatedMIS?divisionCode=${
        divisioncode === undefined ? '' : divisioncode
      }`,
      'POST',
      null,
      (r) => {
        //console.log(r, 'getDashBoardTotalCount 1');
        setDashBoardCount1({
          districtsCount: r.data.districtsCount,
          totalEntryT: r.data.totalEntry,
          totalPhase1LoginT: r.data.totalPhase1Login,
          totalPhase1VillagesT: r.data.totalPhase1Villages,
          totalTalukaT: r.data.totalTaluka,
          totalVillagesT: r.data.totalVillages,
          totalKhataNumberT: r.data.totalKhataNumbers,
          totalOnlineVillagesCount: r.data.totalOnlineVillagesCount,
          totalGaonNamunaCountT: r.data.totalGaonNamunaCount,
          vasuliCompletedCountT: r.data.vasuliCompletedCount,
          vasuliWithoutDemandCountT: r.data.vasuliWithoutDemandCount,
          totalDemandCompletedCountT: r.data.totalDemandCompletedCount,
          demandCountT: r.data.demandCount,
          totalOfSevenEightT: r.data.totalOfSevenEight,
        });

        getTab2Details();
        getTab3Details();
      },
    );
  };

  // const getDashBoardTotalCount2 = async (divisioncode, districtCode) => {
  //   setIsLoading(true);
  //   setOpen(!open);
  //   sendRequest(
  //     `${URLS.AuthURL}/getDivisionCount?divisionCode=${
  //       divisioncode === undefined ? '' : divisioncode
  //     }&districtcode=${districtCode === undefined ? '' : districtCode}`,
  //     'POST',
  //     null,
  //     (r) => {
  //       setDashBoardCount2({
  //         districtsCount: r.data.districtsCount,
  //         totalEntryT: r.data.totalEntry,
  //         totalPhase1LoginT: r.data.totalPhase1Login,
  //         totalPhase1VillagesT: r.data.totalPhase1Villages,
  //         totalTalukaT: r.data.totalTaluka,
  //         totalVillagesT: r.data.totalVillages,
  //         totalKhataNumberT: r.data.totalKhataNumbers,
  //         totalOnlineVillagesCount: r.data.totalOnlineVillagesCount,
  //       });
  //     },
  //   );
  // };
  const getDashBoardTotalCountTab4 = async () => {
    setIsLoading(true);
    setOpen(!open);

    //sendRequest(`${URLS.AuthURL}/getDivisionCount?divisionCode=${''}`, 'POST', null, (r) => {       dyslrmistableTotalTab4
    sendRequest(`${URLS.AuthURL}/dyslrmistableTotalTab4?divisionCode=${''}`, 'POST', null, (r) => {
      //console.log(r, '-------------------getDashBoardTotalCountTab4-----Q---1+'),
      //   console.log(r.data[0], '-------------------getDashBoardTotalCountTab4-----Q---1+data'),

      //एकूण division 4 -Tab4
      setDashBoardCountTab4({
        districtsCountTT: r.data[0].districtsCount,
        totalDyslrWorkCountTT: r.data[0].totalDyslrWorkCount,
        totalTalukaTT: r.data[0].totalTaluka,
        totalVillagesTT: r.data[0].totalVillages,
        totalCountdyslrWorkCompletedCountDivisionTT:
          (r.data[0].totalDyslrWorkCount * 100) / r.data[0].totalVillages,

        // totalCountdyslrWorkCompletedCountTTI:
        //     (r.data[0].totalDyslrWorkCount * 100) / r.data[0].totalVillages,
      });
    });
  };
  const getDashBoardTotalCount1Tab4 = async (divisioncode) => {
    setIsLoading(true);
    setOpen(!open);
    sendRequest(
      // `${URLS.AuthURL}/getDivisionCount?divisionCode=${
      `${URLS.AuthURL}/dyslrmistableTotalTab4?divisionCode=${
        divisioncode === undefined ? '' : divisioncode
      }`,
      'POST',
      null,
      (r) => {
        //console.log(r, '-------------------------->>>>>>>yakun');

        // totalCountdyslrWorkCompletedCount =
        // totalCountdyslrWorkCompletedCount +
        // Math.round((r.totalDyslrWorkCount * 100) / r.totalVillages);
        setDashBoardCount1Tab4({
          districtsCountTTI: r.data[0].districtsCount,
          totalDyslrWorkCountTTI: r.data[0].totalDyslrWorkCount,
          totalTalukaTTI: r.data[0].totalTaluka,
          totalVillagesTTI: r.data[0].totalVillages,
          totalCountdyslrWorkCompletedCountTTI:
            (r.data[0].totalDyslrWorkCount * 100) / r.data[0].totalVillages,
        });

        //getTab4Details();
      },
    );
  };

  const getDashBoardTotalCountTab5 = async () => {
    setIsLoading(true);
    setOpen(!open);
    sendRequest(`${URLS.AuthURL}/getDivisionCount?divisionCode=${''}`, 'POST', null, (r) => {
      setDashBoardCountTab5({
        districtsCount: r.data.districtsCount,
        totalEntryT: r.data.totalEntry,
        totalPhase1LoginT: r.data.totalPhase1Login,
        totalPhase1VillagesT: r.data.totalPhase1Villages,
        totalTalukaT: r.data.totalTaluka,
        totalVillagesT: r.data.totalVillages,
        totalKhataNumberT: r.data.totalKhataNumbers,
        totalOnlineVillagesCount: r.data.totalOnlineVillagesCount,
      });
    });
  };
  const getDashBoardTotalCount1Tab5 = async (divisioncode) => {
    setIsLoading(true);
    setOpen(!open);
    sendRequest(
      `${URLS.AuthURL}/getDivisionCount?divisionCode=${
        divisioncode === undefined ? '' : divisioncode
      }`,
      'POST',
      null,
      (r) => {
        setDashBoardCount1Tab5({
          districtsCount: r.data.districtsCount,
          totalEntryT: r.data.totalEntry,
          totalPhase1LoginT: r.data.totalPhase1Login,
          totalPhase1VillagesT: r.data.totalPhase1Villages,
          totalTalukaT: r.data.totalTaluka,
          totalVillagesT: r.data.totalVillages,
          totalKhataNumberT: r.data.totalKhataNumbers,
          totalOnlineVillagesCount: r.data.totalOnlineVillagesCount,
        });
      },
    );
  };

  const redirectToReport = async (districtName, districtCode, talukaname, talukaCode) => {
    // console.log('district Nmae', districtName);
    history.push({
      pathname: `/reports/All-Village-Search-Data1`,
      state: {
        district: districtName,
        districtCode: districtCode,
        talukaname: talukaname,
        talukacode: talukaCode,
      },
    });
  };

  const redirectToOnlineVillagesCount = async (
    districtName,
    districtCode,
    totalOnlineVillagesCount,
  ) => {
    history.push({
      pathname: `/reports/Online-Village-Count-Report`,
      state: {
        district: districtName,
        districtCode: districtCode,
        totalOnlineVillagesCount: totalOnlineVillagesCount,
      },
    });
  };

  const redirectToTotalPhase1Login = async (districtName, districtCode, totalPhase1Login) => {
    history.push({
      pathname: `/reports/Total-Phase-1-Login-Report`,
      state: {
        district: districtName,
        districtCode: districtCode,
        totalPhase1Login: totalPhase1Login,
      },
    });
  };

  // -------redirectToTotalPhase1LoginTab1
  //--------redirectToMagniNichtiKeleliGaoanSankhya
  const redirectToMagniNichtiKeleliGaoanSankhya = async (
    districtName,
    districtCode,
    totalPhase1Login,
    talukaCode,
  ) => {
    history.push({
      pathname: `/reports/Magni_Nichti_Keleli_Gaoan_Sankhya`,
      state: {
        district: districtName,
        districtCode: districtCode,
        totalPhase1Login: totalPhase1Login,
        talukaCode: talukaCode,
      },
    });
  };

  const redirectToMagniNichtiNaKartaVasuliSuruKelelyaGaoanSankhya = async (
    districtName,
    districtCode,
    totalPhase1Login,
    talukaCode,
  ) => {
    history.push({
      pathname: `/reports/Magni_Nichti_Na_Karta_Vasuli_SuruKelelya_GaoanSankhya`,
      state: {
        district: districtName,
        districtCode: districtCode,
        totalPhase1Login: totalPhase1Login,
        talukaCode: talukaCode,
      },
    });
  };
  //Vasuli_Zalelya_Gawanchi_Sankhya
  const redirectToVasuli_Zalelya_Gawanchi_Sankhya = async (
    districtName,
    districtCode,
    totalPhase1Login,
    talukaCode,
  ) => {
    history.push({
      pathname: `/reports/Vasuli_Zalelya_Gawanchi_Sankhya`,
      state: {
        district: districtName,
        districtCode: districtCode,
        totalPhase1Login: totalPhase1Login,
        talukaCode: talukaCode,
      },
    });
  };

  const redirectToTotalPhase1Villages = async (districtName, districtCode, totalPhase1Villages) => {
    history.push({
      pathname: `/reports/Total-Phase-1-Villages-Report`,
      state: {
        district: districtName,
        districtCode: districtCode,
        totalPhase1Villages: totalPhase1Villages,
      },
    });
  };
  const redirectToGoannamune_Purna_Bharlyababat_Ghoshna_Keleli_Gaon_Sankhya = async (
    districtName,
    districtCode,
    totalPhase1Villages,
    talukaCode,
  ) => {
    history.push({
      pathname: `/reports/Goannamune_Purna_Bharlyababat_Ghoshna_Keleli_Gaon_Sankhya`,
      state: {
        district: districtName,
        districtCode: districtCode,
        totalPhase1Villages: totalPhase1Villages,
        talukaCode: talukaCode,
      },
    });
  };
  // const exportToExcelFun = async (data, text) => {
  //   //alert('in function');
  //   history.push({
  //     pathname: `eComponents/ExportToExcel`,
  //     state: {
  //       data: data,
  //       grideName: text,
  //     },
  //   });
  //   // return <ExportToExcel data={data} grideName={text} />;
  // };

  const callbackTabClicked = (key, event) => {
    setActive(false);

    if (key === 'tab4') {
      setDivisionCodeTab4(' ');
      //setDivisionCodeTab4(divisionCodeTab4 !== undefined ? '' : divisionCodeTab4);
      // console.log('tab 4 clicked...');
      setActive(true);
      // console.log(divisionCodeTab4, 'divisionCodeTab4');

      setTab4Detail('');
      // console.log(tab4Detail, 'Tab4Detail');
      setshowTalukafortab4(false);
      setshowDistrict4(false);
      getTabD4etails();
    }
  };

  return (
    <div>
      <h3 style={{ position: 'absolute', top: '6px', left: '1250px' }}>
        <b>(आज रोजी : {`${day} - ${month} - ${year}`})</b>
      </h3>
      {/* <FormControl fullWidth sx={{ width: 160, position: 'absolute', left: '1037px', zIndex: 22 }}>
        <InputLabel id="demo-simple-select-label">Select Year</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={selectedYear}
          label="Select Revenue Year"
          onChange={handleYearChange}
          size="small"
        >
          <MenuItem value="2022-2023">2022-2023</MenuItem>
          <MenuItem value="2023-2024">2023-2024</MenuItem>
          <MenuItem value="2024-2025">2024-2025</MenuItem>
        </Select>
      </FormControl> */}
      <FormControl fullWidth sx={{ width: 160, position: 'absolute', left: '1037px', zIndex: 22 }}>
        <InputLabel id="demo-simple-select-label">Select Year</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={selectedYear}
          label="Select Revenue Year"
          onChange={handleYearChange}
          size="small"
        >
          <MenuItem value="2022-2023">2022-2023</MenuItem>
          <MenuItem value="2023-2024">2023-2024</MenuItem>
          <MenuItem value="2024-2025">2024-2025</MenuItem>
        </Select>
      </FormControl>

      <Tabs
        defaultActiveKey="tab1"
        type="card"
        size="large"
        tabBarGutter="10"
        animated="true"
        style={{ position: 'sticky! important', top: '0px' }}
        onTabClick={callbackTabClicked}
      >
        {/* <Tabs.TabPane tab="कामकाज प्रगती अहवाल" key="tab1"> */}
        <Tabs.TabPane tab="ई-चावडी कामकाज प्रगती अहवाल" key="tab1">
          {/* Old 2023-2024 */}
          {showPreDashboard == true && showStaticDashboard != true && (
            <>
              {/*Current year 2023-2024 */}
              <Paper className={styles.Footercard}>
                <ExportToExcel
                  data={dashBoardDetail}
                  total={dashBoardCount}
                  btnName={'GridDivision'}
                >
                  <DownloadOutlined />
                </ExportToExcel>
                {/* <h1>2023-2024 Prev</h1> */}

                <Paper className={styles.Footercard} style={{ height: '800px', overflowY: 'auto' }}>
                  {/* Main Grid */}
                  <Grid
                    container
                    spacing={1}
                    columns={24}
                    style={{
                      padding: '2px',
                      position: 'sticky',
                      top: '0px',
                      zIndex: '5',
                    }}
                  >
                    <Grid
                      item
                      xs={24}
                      sm={24}
                      md={24}
                      lg={2}
                      xl={3}
                      style={{ position: 'sticky! important', top: '0px', overflowY: 'auto' }}
                    >
                      <Card>
                        <Box>
                          <Typography
                            sx={{ height: 120 }}
                            component="div"
                            align="center"
                            style={{ backgroundColor: '#002884', color: '#F0F2F5' }}
                          >
                            {/* विभाग/जिल्हा नाव */}
                            विभाग/जिल्हा
                          </Typography>

                          <Divider variant="middle" />
                        </Box>
                      </Card>
                    </Grid>
                    <Grid item xs={24} sm={24} md={24} lg={2} xl={2}>
                      <Card>
                        <Box>
                          <Typography
                            sx={{ height: 120 }}
                            component="div"
                            align="center"
                            style={{
                              backgroundColor: '#002884',
                              color: '#F0F2F5',
                            }}
                          >
                            {/* जिल्ह्यांची संख्या */}
                            जिल्हे
                          </Typography>

                          <Divider variant="middle" />
                        </Box>
                      </Card>
                    </Grid>
                    <Grid item xs={24} sm={24} md={24} lg={2} xl={2}>
                      <Card>
                        <Box>
                          <Typography
                            sx={{ height: 120 }}
                            component="div"
                            align="center"
                            style={{ backgroundColor: '#002884', color: '#F0F2F5' }}
                          >
                            {/* तालुक्यांची संख्या */}
                            तालुके
                          </Typography>

                          <Divider variant="middle" />
                        </Box>
                      </Card>
                    </Grid>
                    <Grid item xs={24} sm={24} md={24} lg={3} xl={2}>
                      <Card>
                        <Box>
                          <Typography
                            sx={{ height: 120 }}
                            component="div"
                            align="center"
                            style={{ backgroundColor: '#002884', color: '#F0F2F5' }}
                          >
                            एकूण गावांची संख्या
                          </Typography>

                          <Divider variant="middle" />
                        </Box>
                      </Card>
                    </Grid>
                    <Grid item xs={24} sm={24} md={24} lg={3} xl={2}>
                      <Card>
                        <Box>
                          <Typography
                            sx={{ height: 120 }}
                            component="div"
                            align="center"
                            style={{ backgroundColor: '#002884', color: '#F0F2F5' }}
                          >
                            {/* एकूण खातेदारांची संख्या */}
                            {/* ग. न . भरलेली माहिती */}
                            गांव नमुन्या मध्ये केलेल्या एकूण नोंदीची संख्या
                          </Typography>

                          <Divider variant="middle" />
                        </Box>
                      </Card>
                    </Grid>
                    <Grid item xs={24} sm={24} md={24} lg={3} xl={2}>
                      <Card>
                        <Box>
                          <Typography
                            sx={{ height: 120 }}
                            component="div"
                            align="center"
                            style={{ backgroundColor: '#002884', color: '#F0F2F5' }}
                          >
                            गावनमुने पूर्ण भरलेबाबत घोषणा केलेली गाव संख्या
                          </Typography>

                          <Divider variant="middle" />
                        </Box>
                      </Card>
                    </Grid>

                    {/* new column added 8AUG24 */}

                    <Grid item xs={24} sm={24} md={24} lg={3} xl={7}>
                      <Card style={{ flex: 1 }}>
                        <Box>
                          <Typography
                            sx={{ height: 25 }}
                            component="div"
                            align="center"
                            style={{
                              backgroundColor: '#002884',
                              color: '#F0F2F5',
                              fontSize: '12px',
                            }}
                          >
                            अशी गावे ज्यांनी मागणी निश्चिती प्रक्रिया पुर्ण केलेली नाही.
                          </Typography>
                          <Divider variant="middle" />
                        </Box>
                      </Card>
                      <Box
                        display="flex"
                        flexDirection="row" // Change to 'column' for vertical layout
                        gap={1} // Optional: Adds space between cards
                        alignItems="stretch" // Ensures cards stretch to fill the container height
                      >
                        <Card style={{ flex: 1.1 }}>
                          <Box>
                            <Typography
                              sx={{ height: 95 }}
                              component="div"
                              align="center"
                              style={{
                                backgroundColor: '#002884',
                                color: '#F0F2F5',
                                fontSize: '12px',
                              }}
                            >
                              ई-चावडी प्रणाली- मध्ये एक ही खातेदारांची मागणी निश्चिती न केल्याने
                              वसुली न करणाऱ्या गावांची संख्या
                            </Typography>
                            <Divider variant="middle" />
                          </Box>
                        </Card>

                        <Card style={{ flex: 1.6 }}>
                          <Box>
                            <Typography
                              sx={{ height: 95 }}
                              component="div"
                              align="center"
                              style={{
                                backgroundColor: '#002884',
                                color: '#F0F2F5',
                                fontSize: '12px',
                              }}
                            >
                              १००% मागणी निश्चिती न करता वसूली सुरू केलेल्या गावांची संख्या
                            </Typography>
                            <Divider variant="middle" />
                          </Box>
                        </Card>

                        <Card style={{ flex: 1.1 }}>
                          <Box>
                            <Typography
                              sx={{ height: 95 }}
                              component="div"
                              align="center"
                              style={{
                                backgroundColor: '#002884',
                                color: '#F0F2F5',
                                paddingTop: '20',
                              }}
                            >
                              एकुण
                            </Typography>
                            <Divider variant="middle" />
                          </Box>
                        </Card>
                      </Box>
                    </Grid>

                    <Grid item xs={24} sm={24} md={24} lg={3} xl={2}>
                      <Card>
                        <Box>
                          <Typography
                            sx={{ height: 120 }}
                            component="div"
                            align="center"
                            style={{ backgroundColor: '#002884', color: '#F0F2F5' }}
                          >
                            {/* भाग - १ मधील गावांची संख्या */}
                            {/* 100 % मागणी निश्चिती केलेले गांव संख्या */}
                            {/* १००% मागणी निश्चिती केलेले गांव संख्या */}
                            १००% मागणी निश्चिती केलेली गांव संख्या
                          </Typography>

                          <Divider variant="middle" />
                        </Box>
                      </Card>
                    </Grid>
                    <Grid item xs={24} sm={24} md={24} lg={3} xl={2}>
                      <Card>
                        <Box>
                          <Typography
                            sx={{ height: 120 }}
                            component="div"
                            align="center"
                            style={{ backgroundColor: '#002884', color: '#F0F2F5' }}
                          >
                            १००% वसूली झालेल्या गावांची संख्या
                          </Typography>

                          <Divider variant="middle" />
                        </Box>
                      </Card>
                    </Grid>
                  </Grid>
                  {/* Main Grid */}
                  {dashBoardDetail2023_2024_MDiv &&
                    dashBoardDetail2023_2024_MDiv.map((r, i) => {
                      return (
                        <>
                          <Grid container spacing={1} columns={24} style={{ padding: '2px' }}>
                            <Grid
                              item
                              xs={24}
                              sm={24}
                              md={24}
                              lg={2}
                              xl={3}
                              style={{
                                cursor: 'pointer',
                                position: 'sticky!important',
                                top: '0px',
                                width: '100%',
                              }}
                            >
                              <Card>
                                <Box
                                  sx={{
                                    bgcolor: '#91ceff',
                                    height: 50,
                                  }}
                                >
                                  {/* Division Click */}
                                  <CardContent>
                                    <h3>
                                      {' '}
                                      <u
                                        onClick={(e) => {
                                          //alert('showdist');
                                          if (
                                            showDistrict === true &&
                                            r.divisionCode === divisionCode
                                          ) {
                                            setshowDistrict(false);
                                          } else {
                                            setshowSpin(true);
                                            setDashBoardDetail1_2023_2024_Dist([]);
                                            setDivisionCode(r.divisionCode);
                                            setDistricts(r.districtCode);
                                            // get list of district when click division
                                            getDashBoardDetails1_2023_2024_DistricrGrid(
                                              r.divisionCode,
                                            );
                                            setshowDistrict(true);
                                          }
                                        }}
                                      >
                                        {r.divisionName}
                                      </u>{' '}
                                      &nbsp;
                                      {showDistrict === true && r.divisionCode === divisionCode && (
                                        <ExportToExcel
                                          dataDistrict={dashBoardDetail1_2023_2024_Dist}
                                          totalDistrict={dashBoardCount1_2023_2024_Dist_Count}
                                          btnName={'GridDistrict'}
                                          style={{ width: '10px' }}
                                        >
                                          {/* <DownloadOutlined style={{ width: '100%' }} /> */}
                                        </ExportToExcel>
                                      )}
                                      {showSpin === true && r.divisionCode === divisionCode && (
                                        <Spin indicator={antIcon} />
                                      )}
                                    </h3>
                                  </CardContent>
                                </Box>
                              </Card>
                            </Grid>
                            {/* )} */}
                            <Grid item xs={24} sm={24} md={24} lg={2} xl={2}>
                              <Card>
                                <Box
                                  sx={{
                                    bgcolor: '#91ceff',
                                    height: 50,
                                  }}
                                >
                                  <CardContent>
                                    <center>
                                      <h3>{r.districtsCount}</h3>
                                    </center>
                                  </CardContent>
                                </Box>
                              </Card>
                            </Grid>
                            <Grid item xs={24} sm={24} md={24} lg={2} xl={2}>
                              <Card>
                                <Box
                                  sx={{
                                    bgcolor: '#91ceff',
                                    height: 50,
                                  }}
                                >
                                  <CardContent>
                                    <center>
                                      <h3>{r.totalTaluka}</h3>
                                    </center>
                                  </CardContent>
                                </Box>
                              </Card>
                            </Grid>
                            <Grid item xs={24} sm={24} md={24} lg={3} xl={2}>
                              <Card>
                                <Box
                                  sx={{
                                    bgcolor: '#91ceff',
                                    height: 50,
                                  }}
                                >
                                  <CardContent>
                                    <center>
                                      <h3>{r.totalVillages}</h3>
                                    </center>
                                  </CardContent>
                                </Box>
                              </Card>
                            </Grid>
                            <Grid item xs={24} sm={24} md={24} lg={3} xl={2}>
                              <Card>
                                <Box
                                  sx={{
                                    bgcolor: '#91ceff',
                                    height: 50,
                                  }}
                                >
                                  <CardContent>
                                    <center>
                                      <h3>{r.totalEntry}</h3>
                                    </center>
                                  </CardContent>
                                </Box>
                              </Card>
                            </Grid>
                            <Grid item xs={24} sm={24} md={24} lg={3} xl={2}>
                              <Card>
                                <Box
                                  sx={{
                                    bgcolor: '#91ceff',
                                    height: 50,
                                  }}
                                >
                                  <CardContent>
                                    <center>
                                      <h3>{r.totalGaonNamunaCount}</h3>
                                    </center>
                                  </CardContent>
                                </Box>
                              </Card>
                            </Grid>
                            <Grid item xs={24} sm={24} md={24} lg={3} xl={2}>
                              <Card>
                                <Box
                                  sx={{
                                    bgcolor: '#91ceff',
                                    height: 50,
                                  }}
                                >
                                  <CardContent>
                                    <center>
                                      {/* <h3>4 </h3> */}
                                      <h3>{r.demandCount} </h3>
                                    </center>
                                  </CardContent>
                                </Box>
                              </Card>
                            </Grid>
                            {/* Newly mapped variable */}

                            <Grid item xs={24} sm={24} md={24} lg={3} xl={3}>
                              <Card>
                                <Box
                                  sx={{
                                    bgcolor: '#91ceff',
                                    height: 50,
                                  }}
                                >
                                  <CardContent>
                                    <center>
                                      <h3>{r.vasuliWithoutDemandCount}</h3>
                                    </center>
                                  </CardContent>
                                </Box>
                              </Card>
                            </Grid>
                            <Grid item xs={24} sm={24} md={24} lg={3} xl={2}>
                              <Card>
                                <Box
                                  sx={{
                                    bgcolor: '#91ceff',
                                    height: 50,
                                  }}
                                >
                                  <CardContent>
                                    <center>
                                      {/* <h3>T</h3> */}
                                      <h3>{r.totalOfSevenEight}</h3>
                                    </center>
                                  </CardContent>
                                </Box>
                              </Card>
                            </Grid>
                            <Grid item xs={24} sm={24} md={24} lg={3} xl={2}>
                              <Card>
                                <Box
                                  sx={{
                                    bgcolor: '#91ceff',
                                    height: 50,
                                  }}
                                >
                                  <CardContent>
                                    <center>
                                      <h3>{r.totalDemandCompletedCount}</h3>
                                    </center>
                                  </CardContent>
                                </Box>
                              </Card>
                            </Grid>
                            <Grid item xs={24} sm={24} md={24} lg={3} xl={2}>
                              <Card>
                                <Box
                                  sx={{
                                    bgcolor: '#91ceff',
                                    height: 50,
                                  }}
                                >
                                  <CardContent>
                                    <center>
                                      <h3>{r.vasuliCompletedCount}</h3>
                                    </center>
                                  </CardContent>
                                </Box>
                              </Card>
                            </Grid>
                          </Grid>
                          {/* District Grid */}
                          {showDistrict === true && r.divisionCode === divisionCode && (
                            <Grid
                              container
                              spacing={1}
                              columns={24}
                              style={{ padding: '2px' }}
                            ></Grid>
                          )}
                          {showDistrict === true &&
                            dashBoardDetail1_2023_2024_Dist?.length !== 0 &&
                            r.divisionCode === divisionCode &&
                            dashBoardDetail1_2023_2024_Dist?.map((r, i) => {
                              return (
                                <>
                                  <Grid
                                    container
                                    spacing={1}
                                    columns={24}
                                    style={{ padding: '2px', cursor: 'pointer' }}
                                  >
                                    <Grid item xs={24} sm={24} md={24} lg={2} xl={3}>
                                      <Card>
                                        <Box
                                          sx={{
                                            // bgcolor: '#91ceff',
                                            bgcolor: '#cce8ff',
                                            height: r.districtName?.length >= 11 ? 60 : 50,
                                          }}
                                        >
                                          <CardContent>
                                            <h4>
                                              <u
                                                onClick={(e) => {
                                                  //alert('showtaluka');
                                                  if (
                                                    showTaluka === true &&
                                                    r.districtCode === districtsCode
                                                  ) {
                                                    setshowTaluka(false);
                                                  } else {
                                                    setshowSpin2(true);
                                                    setDashBoardDetail2_2023_2024([]);
                                                    setDivisionCode(r.divisionCode);
                                                    setDistricts(r.districtCode);
                                                    //for Taluka grid
                                                    setTalukaCode(r.talukaCode);
                                                    getDashBoardDetails2_2023_2024(
                                                      r.divisionCode,
                                                      r.districtCode,
                                                    );
                                                    setshowTaluka(true);
                                                  }
                                                }}
                                              >
                                                {' '}
                                                {r.districtName}
                                              </u>
                                              &nbsp;
                                              {showTaluka === true &&
                                                r.districtCode === districtsCode && (
                                                  <ExportToExcel
                                                    dataTaluka={dashBoardDetail2_2023_2024}
                                                    btnName={'GridTaluka'}
                                                    style={{ width: '10px' }}
                                                  />
                                                )}
                                              {showSpin2 === true &&
                                                r.districtsCode === districtsCode && (
                                                  <Spin indicator={antIcon} />
                                                )}
                                            </h4>
                                          </CardContent>
                                        </Box>
                                      </Card>
                                    </Grid>
                                    <Grid item xs={24} sm={24} md={24} lg={2} xl={2}>
                                      <Card>
                                        <Box
                                          sx={{
                                            bgcolor: '#cce8ff',
                                            //height: 50,
                                            height: r.districtName?.length >= 11 ? 60 : 50,
                                          }}
                                        >
                                          <CardContent>
                                            <center>
                                              <h3>{r.districtsCount}</h3>
                                            </center>
                                          </CardContent>
                                        </Box>
                                      </Card>
                                    </Grid>
                                    <Grid item xs={24} sm={24} md={24} lg={2} xl={2}>
                                      <Card>
                                        <Box
                                          sx={{
                                            bgcolor: '#cce8ff',
                                            //height: 50,
                                            height: r.districtName?.length >= 11 ? 60 : 50,
                                          }}
                                        >
                                          <CardContent>
                                            <center>
                                              <h3>{r.totalTaluka}</h3>
                                            </center>
                                          </CardContent>
                                        </Box>
                                      </Card>
                                    </Grid>
                                    <Grid item xs={24} sm={24} md={24} lg={3} xl={2}>
                                      <Card>
                                        <Box
                                          sx={{
                                            bgcolor: '#cce8ff',
                                            //height: 50,
                                            height: r.districtName?.length >= 11 ? 60 : 50,
                                          }}
                                        >
                                          <CardContent>
                                            <center>
                                              <h3>{r.totalVillages}</h3>
                                            </center>
                                          </CardContent>
                                        </Box>
                                      </Card>
                                    </Grid>
                                    <Grid item xs={24} sm={24} md={24} lg={3} xl={2}>
                                      <Card>
                                        <Box
                                          sx={{
                                            bgcolor: '#cce8ff',
                                            //height: 50,
                                            height: r.districtName?.length >= 11 ? 60 : 50,
                                          }}
                                        >
                                          <CardContent>
                                            <center>
                                              <h3>{r.totalEntry}</h3>
                                            </center>
                                          </CardContent>
                                        </Box>
                                      </Card>
                                    </Grid>
                                    <Grid item xs={24} sm={24} md={24} lg={3} xl={2}>
                                      <Card>
                                        <Box
                                          sx={{
                                            bgcolor: '#cce8ff',
                                            // height: 50,
                                            height: r.districtName?.length >= 11 ? 60 : 50,
                                          }}
                                        >
                                          <CardContent>
                                            <center>
                                              <h3>{r.totalGaonNamunaCount}</h3>
                                            </center>
                                          </CardContent>
                                        </Box>
                                      </Card>
                                    </Grid>
                                    <Grid item xs={24} sm={24} md={24} lg={3} xl={2}>
                                      <Card>
                                        <Box
                                          sx={{
                                            bgcolor: '#cce8ff',
                                            // height: 50,
                                            height: r.districtName?.length >= 11 ? 60 : 50,
                                          }}
                                        >
                                          <CardContent>
                                            <center>
                                              {/* <h3>4 D</h3> */}
                                              <h3>{r.demandCount}</h3>
                                            </center>
                                          </CardContent>
                                        </Box>
                                      </Card>
                                    </Grid>

                                    <Grid item xs={24} sm={24} md={24} lg={3} xl={3}>
                                      <Card>
                                        <Box
                                          sx={{
                                            bgcolor: '#cce8ff',
                                            //height: 50,
                                            height: r.districtName?.length >= 11 ? 60 : 50,
                                          }}
                                        >
                                          <CardContent>
                                            <center>
                                              <h3>{r.vasuliWithoutDemandCount}</h3>
                                            </center>
                                          </CardContent>
                                        </Box>
                                      </Card>
                                    </Grid>
                                    <Grid item xs={24} sm={24} md={24} lg={3} xl={2}>
                                      <Card>
                                        <Box
                                          sx={{
                                            bgcolor: '#cce8ff',
                                            //height: 50,
                                            height: r.districtName?.length >= 11 ? 60 : 50,
                                          }}
                                        >
                                          <CardContent>
                                            <center>
                                              {/* <h3>T D</h3> */}
                                              {/* <h3>0</h3> */}
                                              <h3>{r.totalOfSevenEight}</h3>
                                            </center>
                                          </CardContent>
                                        </Box>
                                      </Card>
                                    </Grid>
                                    <Grid item xs={24} sm={24} md={24} lg={3} xl={2}>
                                      <Card>
                                        <Box
                                          sx={{
                                            bgcolor: '#cce8ff',
                                            //height: 50,
                                            height: r.districtName?.length >= 11 ? 60 : 50,
                                          }}
                                        >
                                          <CardContent>
                                            <center>
                                              <h3>{r.totalDemandCompletedCount}</h3>
                                            </center>
                                          </CardContent>
                                        </Box>
                                      </Card>
                                    </Grid>
                                    <Grid item xs={24} sm={24} md={24} lg={3} xl={2}>
                                      <Card>
                                        <Box
                                          sx={{
                                            bgcolor: '#cce8ff',
                                            //height: 50,
                                            height: r.districtName?.length >= 11 ? 60 : 50,
                                          }}
                                        >
                                          <CardContent>
                                            <center>
                                              <h3>{r.vasuliCompletedCount}</h3>
                                            </center>
                                          </CardContent>
                                        </Box>
                                      </Card>
                                    </Grid>
                                  </Grid>
                                  {/* Show Taluka */}
                                  {showTaluka === true && r.districtCode === districtsCode && (
                                    <Grid
                                      container
                                      spacing={1}
                                      columns={24}
                                      style={{ padding: '2px' }}
                                    ></Grid>
                                  )}

                                  {showTaluka === true &&
                                    dashBoardDetail2_2023_2024?.length !== 0 &&
                                    r.districtCode === districtsCode &&
                                    dashBoardDetail2_2023_2024?.map((r, i) => {
                                      return (
                                        <>
                                          <Grid
                                            container
                                            spacing={1}
                                            columns={24}
                                            style={{ padding: '2px' }}
                                          >
                                            <Grid item xs={24} sm={24} md={24} lg={2} xl={3}>
                                              <Card>
                                                <Box
                                                  sx={{
                                                    // bgcolor: '#91ceff',
                                                    bgcolor: '#F0F2F5',
                                                    height: 50,
                                                  }}
                                                >
                                                  <CardContent>
                                                    <center>
                                                      <a
                                                        onClick={() => {
                                                          redirectToReport(
                                                            r.districtName,
                                                            r.districtCode,
                                                            r.talukaName,
                                                            r.talukaCode,
                                                          );
                                                        }}
                                                      >
                                                        <h4>
                                                          <u> {r.talukaName}</u>
                                                        </h4>
                                                      </a>{' '}
                                                    </center>
                                                  </CardContent>
                                                </Box>
                                              </Card>
                                            </Grid>
                                            <Grid item xs={24} sm={24} md={24} lg={2} xl={2}>
                                              <Card>
                                                <Box
                                                  sx={{
                                                    bgcolor: '#F0F2F5',
                                                    height: 50,
                                                  }}
                                                >
                                                  <CardContent>
                                                    <center>
                                                      {/* <h3>{r.districtsCount}</h3> */}
                                                      <h3>0-</h3>
                                                    </center>
                                                  </CardContent>
                                                </Box>
                                              </Card>
                                            </Grid>
                                            <Grid item xs={24} sm={24} md={24} lg={2} xl={2}>
                                              <Card>
                                                <Box
                                                  sx={{
                                                    bgcolor: '#F0F2F5',
                                                    height: 50,
                                                  }}
                                                >
                                                  <CardContent>
                                                    <center>
                                                      {/* <h3>{r.totalTaluka}</h3>
                                                       */}
                                                      <h3>1</h3>
                                                    </center>
                                                  </CardContent>
                                                </Box>
                                              </Card>
                                            </Grid>
                                            <Grid item xs={24} sm={24} md={24} lg={3} xl={2}>
                                              <Card>
                                                <Box
                                                  sx={{
                                                    // bgcolor: '#F0F2F5',
                                                    bgcolor: '#e4f4ff',
                                                    height: 50,
                                                  }}
                                                >
                                                  <CardContent>
                                                    <center>
                                                      <h3>{r.totalVillages}</h3>
                                                    </center>
                                                  </CardContent>
                                                </Box>
                                              </Card>
                                            </Grid>
                                            <Grid item xs={24} sm={24} md={24} lg={3} xl={2}>
                                              <Card>
                                                <Box
                                                  sx={{
                                                    bgcolor: '#e4f4ff',
                                                    height: 50,
                                                  }}
                                                >
                                                  <CardContent>
                                                    <center>
                                                      {/* <h3>{r.totalEntry}</h3> */}
                                                      <a
                                                        onClick={() => {
                                                          redirectToReport(
                                                            r.districtName,
                                                            r.districtCode,
                                                            r.talukaName,
                                                            r.talukaCode,
                                                          );
                                                        }}
                                                      >
                                                        <h3>
                                                          {/* <u> {r.vasuliCompletedCount}</u> */}
                                                          <u> {r.totalEntry}</u>
                                                        </h3>
                                                      </a>{' '}
                                                    </center>
                                                  </CardContent>
                                                </Box>
                                              </Card>
                                            </Grid>
                                            <Grid item xs={24} sm={24} md={24} lg={3} xl={2}>
                                              <Card>
                                                <Box
                                                  sx={{
                                                    bgcolor: '#e4f4ff',
                                                    height: 50,
                                                  }}
                                                >
                                                  <CardContent>
                                                    <center>
                                                      {/* <h3>{r.totalGaonNamunaCount}</h3> */}
                                                      <a
                                                        onClick={() => {
                                                          redirectToGoannamune_Purna_Bharlyababat_Ghoshna_Keleli_Gaon_Sankhya(
                                                            r.districtName,
                                                            r.districtCode,
                                                            r.totalPhase1Villages,
                                                            r.talukaCode,
                                                          );
                                                        }}
                                                      >
                                                        <h3>
                                                          <u> {r.totalGaonNamunaCount}</u>
                                                        </h3>
                                                      </a>
                                                    </center>
                                                  </CardContent>
                                                </Box>
                                              </Card>
                                            </Grid>
                                            <Grid item xs={24} sm={24} md={24} lg={3} xl={2}>
                                              <Card>
                                                <Box
                                                  sx={{
                                                    bgcolor: '#e4f4ff',
                                                    height: 50,
                                                  }}
                                                >
                                                  <CardContent>
                                                    <center>
                                                      <a>
                                                        <h3>
                                                          {/* <u>4T</u> */}
                                                          {/* <u>4</u> */}
                                                          {r.demandCount}
                                                        </h3>
                                                      </a>
                                                    </center>
                                                  </CardContent>
                                                </Box>
                                              </Card>
                                            </Grid>

                                            {/* 7777 */}
                                            <Grid item xs={24} sm={24} md={24} lg={3} xl={3}>
                                              <Card>
                                                <Box
                                                  sx={{
                                                    bgcolor: '#e4f4ff',
                                                    height: 50,
                                                  }}
                                                >
                                                  <CardContent>
                                                    <center>
                                                      <a
                                                        onClick={() => {
                                                          redirectToMagniNichtiNaKartaVasuliSuruKelelyaGaoanSankhya(
                                                            r.districtName,
                                                            r.districtCode,
                                                            r.totalOnlineVillagesCount,
                                                            r.talukaCode,
                                                          );
                                                        }}
                                                      >
                                                        <h3>
                                                          <u>{r.vasuliWithoutDemandCount}</u>
                                                        </h3>
                                                      </a>
                                                    </center>
                                                  </CardContent>
                                                </Box>
                                              </Card>
                                            </Grid>
                                            <Grid item xs={24} sm={24} md={24} lg={3} xl={2}>
                                              <Card>
                                                <Box
                                                  sx={{
                                                    bgcolor: '#e4f4ff',
                                                    height: 50,
                                                  }}
                                                >
                                                  <CardContent>
                                                    <center>
                                                      <a>
                                                        <h3>
                                                          {/* <u>T T</u> */}
                                                          {r.totalOfSevenEight}
                                                        </h3>
                                                      </a>
                                                    </center>
                                                  </CardContent>
                                                </Box>
                                              </Card>
                                            </Grid>
                                            <Grid item xs={24} sm={24} md={24} lg={3} xl={2}>
                                              <Card>
                                                <Box
                                                  sx={{
                                                    bgcolor: '#e4f4ff',
                                                    height: 50,
                                                  }}
                                                >
                                                  <CardContent>
                                                    <center>
                                                      <a
                                                        onClick={() => {
                                                          redirectToMagniNichtiKeleliGaoanSankhya(
                                                            r.districtName,
                                                            r.districtCode,
                                                            r.totalPhase1Login,
                                                            r.talukaCode,
                                                          );
                                                        }}
                                                      >
                                                        <h3>
                                                          <u> {r.totalDemandCompletedCount}</u>
                                                        </h3>
                                                      </a>
                                                    </center>
                                                  </CardContent>
                                                </Box>
                                              </Card>
                                            </Grid>
                                            <Grid item xs={24} sm={24} md={24} lg={3} xl={2}>
                                              <Card>
                                                <Box
                                                  sx={{
                                                    bgcolor: '#e4f4ff',
                                                    height: 50,
                                                  }}
                                                >
                                                  <CardContent>
                                                    <center>
                                                      <a
                                                        onClick={() => {
                                                          redirectToVasuli_Zalelya_Gawanchi_Sankhya(
                                                            r.districtName,
                                                            r.districtCode,
                                                            r.totalOnlineVillagesCount,
                                                            r.talukaCode,
                                                          );
                                                        }}
                                                      >
                                                        <h3>
                                                          <u> {r.vasuliCompletedCount}</u>
                                                        </h3>
                                                      </a>
                                                    </center>
                                                  </CardContent>
                                                </Box>
                                              </Card>
                                            </Grid>
                                          </Grid>
                                        </>
                                      );
                                    })}
                                </>
                              );
                            })}

                          {/* Taluka एकूण */}
                          {/* TO add Taluka एकूण code put here */}
                          {/* District एकूण */}
                          {showDistrict === true && r.divisionCode === divisionCode && (
                            <div>
                              <Grid container spacing={1} columns={24}>
                                <Grid item xs={24} sm={24} md={24} lg={2} xl={3}>
                                  <Card>
                                    <Box
                                      sx={{
                                        bgcolor: '#cce8ff',
                                        height: 50,
                                      }}
                                    >
                                      <CardContent>
                                        <center>
                                          <h3>एकूण</h3>
                                          {/* <h3>एकूण district</h3> */}
                                        </center>
                                      </CardContent>
                                    </Box>
                                  </Card>
                                </Grid>
                                <Grid item xs={24} sm={24} md={24} lg={2} xl={2}>
                                  <Card>
                                    <Box
                                      sx={{
                                        bgcolor: '#cce8ff',
                                        height: 50,
                                      }}
                                    >
                                      <CardContent>
                                        <center>
                                          <h3>
                                            {dashBoardCount1_2023_2024_Dist_Count?.districtsCount}
                                          </h3>
                                        </center>
                                      </CardContent>
                                    </Box>
                                  </Card>
                                </Grid>
                                <Grid item xs={24} sm={24} md={24} lg={2} xl={2}>
                                  <Card>
                                    <Box
                                      sx={{
                                        bgcolor: '#cce8ff',
                                        height: 50,
                                      }}
                                    >
                                      <CardContent>
                                        <center>
                                          <h3>
                                            {dashBoardCount1_2023_2024_Dist_Count?.totalTalukaT}
                                          </h3>
                                        </center>
                                      </CardContent>
                                    </Box>
                                  </Card>
                                </Grid>
                                <Grid item xs={24} sm={24} md={24} lg={3} xl={2}>
                                  <Card>
                                    <Box
                                      sx={{
                                        bgcolor: '#cce8ff',
                                        height: 50,
                                      }}
                                    >
                                      <CardContent>
                                        <center>
                                          <h3>
                                            {' '}
                                            {dashBoardCount1_2023_2024_Dist_Count?.totalVillagesT}
                                          </h3>
                                        </center>
                                      </CardContent>
                                    </Box>
                                  </Card>
                                </Grid>
                                <Grid item xs={24} sm={24} md={24} lg={3} xl={2}>
                                  <Card>
                                    <Box
                                      sx={{
                                        bgcolor: '#cce8ff',
                                        height: 50,
                                      }}
                                    >
                                      <CardContent>
                                        <center>
                                          <h3>
                                            {' '}
                                            {dashBoardCount1_2023_2024_Dist_Count?.totalEntryT}
                                          </h3>
                                        </center>
                                      </CardContent>
                                    </Box>
                                  </Card>
                                </Grid>
                                <Grid item xs={24} sm={24} md={24} lg={3} xl={2}>
                                  <Card>
                                    <Box
                                      sx={{
                                        bgcolor: '#cce8ff',
                                        height: 50,
                                      }}
                                    >
                                      <CardContent>
                                        <center>
                                          <h3>
                                            {' '}
                                            {
                                              dashBoardCount1_2023_2024_Dist_Count?.totalGaonNamunaCountT
                                            }
                                          </h3>
                                        </center>
                                      </CardContent>
                                    </Box>
                                  </Card>
                                </Grid>
                                <Grid item xs={24} sm={24} md={24} lg={3} xl={2}>
                                  <Card>
                                    <Box
                                      sx={{
                                        bgcolor: '#cce8ff',
                                        height: 50,
                                      }}
                                    >
                                      <CardContent>
                                        <center>
                                          {/* <h3>4T</h3> */}
                                          <h3>
                                            {dashBoardCount1_2023_2024_Dist_Count?.demandCountT}
                                          </h3>
                                        </center>
                                      </CardContent>
                                    </Box>
                                  </Card>
                                </Grid>

                                <Grid item xs={24} sm={24} md={24} lg={3} xl={3}>
                                  <Card>
                                    <Box
                                      sx={{
                                        bgcolor: '#cce8ff',
                                        height: 50,
                                      }}
                                    >
                                      <CardContent>
                                        <center>
                                          <h3>
                                            {' '}
                                            {
                                              dashBoardCount1_2023_2024_Dist_Count?.vasuliWithoutDemandCountT
                                            }
                                          </h3>
                                        </center>
                                      </CardContent>
                                    </Box>
                                  </Card>
                                </Grid>
                                <Grid item xs={24} sm={24} md={24} lg={3} xl={2}>
                                  <Card>
                                    <Box
                                      sx={{
                                        bgcolor: '#cce8ff',
                                        height: 50,
                                      }}
                                    >
                                      <CardContent>
                                        <center>
                                          {/* <h3> T</h3> */}
                                          <h3>
                                            {
                                              dashBoardCount1_2023_2024_Dist_Count?.totalOfSevenEightT
                                            }
                                          </h3>
                                        </center>
                                      </CardContent>
                                    </Box>
                                  </Card>
                                </Grid>
                                <Grid item xs={24} sm={24} md={24} lg={3} xl={2}>
                                  <Card>
                                    <Box
                                      sx={{
                                        bgcolor: '#cce8ff',
                                        height: 50,
                                      }}
                                    >
                                      <CardContent>
                                        <center>
                                          <h3>
                                            {' '}
                                            {
                                              dashBoardCount1_2023_2024_Dist_Count?.totalDemandCompletedCountT
                                            }
                                          </h3>
                                        </center>
                                      </CardContent>
                                    </Box>
                                  </Card>
                                </Grid>
                                <Grid item xs={24} sm={24} md={24} lg={3} xl={2}>
                                  <Card>
                                    <Box
                                      sx={{
                                        bgcolor: '#cce8ff',
                                        height: 50,
                                      }}
                                    >
                                      <CardContent>
                                        <center>
                                          <h3>
                                            {' '}
                                            {
                                              dashBoardCount1_2023_2024_Dist_Count?.vasuliCompletedCountT
                                            }
                                          </h3>
                                        </center>
                                      </CardContent>
                                    </Box>
                                  </Card>
                                </Grid>
                              </Grid>
                            </div>
                          )}
                        </>
                      );
                    })}

                  {/* Division एकूण */}
                  <Grid container spacing={1} columns={24} style={{ padding: '2px' }}>
                    <Grid item xs={24} sm={24} md={24} lg={2} xl={3}>
                      <Card>
                        <Box
                          sx={{
                            bgcolor: '#91ceff',
                            height: 50,
                          }}
                        >
                          <CardContent>
                            <center>
                              {/* <h3>एकूण Division t1</h3> */}
                              <h3>एकूण</h3>
                            </center>
                          </CardContent>
                        </Box>
                      </Card>
                    </Grid>
                    <Grid item xs={24} sm={24} md={24} lg={2} xl={2}>
                      <Card>
                        <Box
                          sx={{
                            bgcolor: '#91ceff',
                            height: 50,
                          }}
                        >
                          <CardContent>
                            <center>
                              <h3>{dashBoardCount2023_2024_TD?.districtsCount}</h3>
                            </center>
                          </CardContent>
                        </Box>
                      </Card>
                    </Grid>
                    <Grid item xs={24} sm={24} md={24} lg={2} xl={2}>
                      <Card>
                        <Box
                          sx={{
                            bgcolor: '#91ceff',
                            height: 50,
                          }}
                        >
                          <CardContent>
                            <center>
                              <h3>{dashBoardCount2023_2024_TD?.totalTalukaT}</h3>
                            </center>
                          </CardContent>
                        </Box>
                      </Card>
                    </Grid>
                    <Grid item xs={24} sm={24} md={24} lg={3} xl={2}>
                      <Card>
                        <Box
                          sx={{
                            bgcolor: '#91ceff',
                            height: 50,
                          }}
                        >
                          <CardContent>
                            <center>
                              <h3> {dashBoardCount2023_2024_TD?.totalVillagesT}</h3>
                            </center>
                          </CardContent>
                        </Box>
                      </Card>
                    </Grid>

                    <Grid item xs={24} sm={24} md={24} lg={3} xl={2}>
                      <Card>
                        <Box
                          sx={{
                            bgcolor: '#91ceff',
                            height: 50,
                          }}
                        >
                          <CardContent>
                            <center>
                              <h3> {dashBoardCount2023_2024_TD?.totalEntryT}</h3>
                            </center>
                          </CardContent>
                        </Box>
                      </Card>
                    </Grid>

                    {/* New variable Mapped */}
                    <Grid item xs={24} sm={24} md={24} lg={3} xl={2}>
                      <Card>
                        <Box
                          sx={{
                            bgcolor: '#91ceff',
                            height: 50,
                          }}
                        >
                          <CardContent>
                            <center>
                              <h3> {dashBoardCount2023_2024_TD?.totalGaonNamunaCountT}</h3>
                            </center>
                          </CardContent>
                        </Box>
                      </Card>
                    </Grid>
                    <Grid item xs={24} sm={24} md={24} lg={3} xl={2}>
                      <Card>
                        <Box
                          sx={{
                            bgcolor: '#91ceff',
                            height: 50,
                          }}
                        >
                          <CardContent>
                            <center>
                              {/* <h3> 4</h3> */}
                              <h3> {dashBoardCount2023_2024_TD?.demandCountT}</h3>
                            </center>
                          </CardContent>
                        </Box>
                      </Card>
                    </Grid>
                    {/* <Grid item xs={24} sm={24} md={24} lg={3} xl={3}>
                      <Card>
                        <Box
                          sx={{
                            bgcolor: '#91ceff',
                            height: 50,
                          }}
                        >
                          <CardContent>
                            <center>
                              <h3> {dashBoardCount?.totalDemandCompletedCountT}</h3>
                            </center>
                          </CardContent>
                        </Box>
                      </Card>
                    </Grid> */}
                    <Grid item xs={24} sm={24} md={24} lg={3} xl={3}>
                      <Card>
                        <Box
                          sx={{
                            bgcolor: '#91ceff',
                            height: 50,
                          }}
                        >
                          <CardContent>
                            <center>
                              <h3> {dashBoardCount2023_2024_TD?.vasuliWithoutDemandCountT}</h3>
                            </center>
                          </CardContent>
                        </Box>
                      </Card>
                    </Grid>
                    <Grid item xs={24} sm={24} md={24} lg={3} xl={2}>
                      <Card>
                        <Box
                          sx={{
                            bgcolor: '#91ceff',
                            height: 50,
                          }}
                        >
                          <CardContent>
                            <center>
                              {/* <h3> T</h3> */}
                              <h3> {dashBoardCount2023_2024_TD?.totalOfSevenEightT}</h3>
                            </center>
                          </CardContent>
                        </Box>
                      </Card>
                    </Grid>
                    <Grid item xs={24} sm={24} md={24} lg={3} xl={2}>
                      <Card>
                        <Box
                          sx={{
                            bgcolor: '#91ceff',
                            height: 50,
                          }}
                        >
                          <CardContent>
                            <center>
                              <h3> {dashBoardCount2023_2024_TD?.totalDemandCompletedCountT}</h3>
                            </center>
                          </CardContent>
                        </Box>
                      </Card>
                    </Grid>
                    <Grid item xs={24} sm={24} md={24} lg={3} xl={2}>
                      <Card>
                        <Box
                          sx={{
                            bgcolor: '#91ceff',
                            height: 50,
                          }}
                        >
                          <CardContent>
                            <center>
                              <h3> {dashBoardCount2023_2024_TD?.vasuliCompletedCountT}</h3>
                            </center>
                          </CardContent>
                        </Box>
                      </Card>
                    </Grid>
                  </Grid>
                </Paper>
              </Paper>
            </>
          )}
          {/* Current year 2024-2025 */}
          {/* {selectedYear === '2023-2024' ? ( */}
          {showCurrentDashboard === true && (
            <>
              {/*Current year 2023-2024 */}
              <Paper className={styles.Footercard}>
                {/* <ExportToExcel>
                  <DownloadOutlined />
                </ExportToExcel> */}

                <ExportToExcel
                  data={dashBoardDetail}
                  total={dashBoardCount}
                  btnName={'GridDivision'}
                >
                  <DownloadOutlined />
                </ExportToExcel>

                <Paper className={styles.Footercard} style={{ height: '800px', overflowY: 'auto' }}>
                  {/* Main Grid */}
                  <Grid
                    container
                    spacing={1}
                    columns={24}
                    style={{
                      padding: '2px',
                      position: 'sticky',
                      top: '0px',
                      zIndex: '5',
                    }}
                  >
                    <Grid
                      item
                      xs={24}
                      sm={24}
                      md={24}
                      lg={2}
                      xl={3}
                      style={{ position: 'sticky! important', top: '0px', overflowY: 'auto' }}
                    >
                      <Card>
                        <Box>
                          <Typography
                            sx={{ height: 120 }}
                            component="div"
                            align="center"
                            style={{ backgroundColor: '#002884', color: '#F0F2F5' }}
                          >
                            {/* विभाग/जिल्हा नाव */}
                            विभाग/जिल्हा
                          </Typography>

                          <Divider variant="middle" />
                        </Box>
                      </Card>
                    </Grid>
                    <Grid item xs={24} sm={24} md={24} lg={2} xl={2}>
                      <Card>
                        <Box>
                          <Typography
                            sx={{ height: 120 }}
                            component="div"
                            align="center"
                            style={{
                              backgroundColor: '#002884',
                              color: '#F0F2F5',
                            }}
                          >
                            {/* जिल्ह्यांची संख्या */}
                            जिल्हे
                          </Typography>

                          <Divider variant="middle" />
                        </Box>
                      </Card>
                    </Grid>
                    <Grid item xs={24} sm={24} md={24} lg={2} xl={2}>
                      <Card>
                        <Box>
                          <Typography
                            sx={{ height: 120 }}
                            component="div"
                            align="center"
                            style={{ backgroundColor: '#002884', color: '#F0F2F5' }}
                          >
                            {/* तालुक्यांची संख्या */}
                            तालुके
                          </Typography>

                          <Divider variant="middle" />
                        </Box>
                      </Card>
                    </Grid>
                    <Grid item xs={24} sm={24} md={24} lg={3} xl={2}>
                      <Card>
                        <Box>
                          <Typography
                            sx={{ height: 120 }}
                            component="div"
                            align="center"
                            style={{ backgroundColor: '#002884', color: '#F0F2F5' }}
                          >
                            एकूण गावांची संख्या
                          </Typography>

                          <Divider variant="middle" />
                        </Box>
                      </Card>
                    </Grid>
                    <Grid item xs={24} sm={24} md={24} lg={3} xl={2}>
                      <Card>
                        <Box>
                          <Typography
                            sx={{ height: 120 }}
                            component="div"
                            align="center"
                            style={{ backgroundColor: '#002884', color: '#F0F2F5' }}
                          >
                            {/* एकूण खातेदारांची संख्या */}
                            {/* ग. न . भरलेली माहिती */}
                            गांव नमुन्या मध्ये केलेल्या एकूण नोंदीची संख्या
                          </Typography>

                          <Divider variant="middle" />
                        </Box>
                      </Card>
                    </Grid>
                    <Grid item xs={24} sm={24} md={24} lg={3} xl={2}>
                      <Card>
                        <Box>
                          <Typography
                            sx={{ height: 120 }}
                            component="div"
                            align="center"
                            style={{ backgroundColor: '#002884', color: '#F0F2F5' }}
                          >
                            गावनमुने पूर्ण भरलेबाबत घोषणा केलेली गाव संख्या
                          </Typography>

                          <Divider variant="middle" />
                        </Box>
                      </Card>
                    </Grid>
                    {/* <Grid item xs={24} sm={24} md={24} lg={3} xl={3}>
                      <Card>
                        <Box>
                          <Typography
                            sx={{ height: 70 }}
                            component="div"
                            align="center"
                            style={{ backgroundColor: '#002884', color: '#F0F2F5' }}
                          >
                           
                            १००% मागणी निश्चिती केलेली गांव संख्या
                          </Typography>

                          <Divider variant="middle" />
                        </Box>
                      </Card>
                    </Grid> */}
                    {/* new column added 8AUG24 */}

                    <Grid item xs={24} sm={24} md={24} lg={3} xl={7}>
                      <Card style={{ flex: 1 }}>
                        <Box>
                          <Typography
                            sx={{ height: 25 }}
                            component="div"
                            align="center"
                            style={{
                              backgroundColor: '#002884',
                              color: '#F0F2F5',
                              fontSize: '12px',
                            }}
                          >
                            अशी गावे ज्यांनी मागणी निश्चिती प्रक्रिया पुर्ण केलेली नाही.
                          </Typography>
                          <Divider variant="middle" />
                        </Box>
                      </Card>
                      <Box
                        display="flex"
                        flexDirection="row" // Change to 'column' for vertical layout
                        gap={1} // Optional: Adds space between cards
                        alignItems="stretch" // Ensures cards stretch to fill the container height
                      >
                        <Card style={{ flex: 1.1 }}>
                          <Box>
                            <Typography
                              sx={{ height: 95 }}
                              component="div"
                              align="center"
                              style={{
                                backgroundColor: '#002884',
                                color: '#F0F2F5',
                                fontSize: '12px',
                              }}
                            >
                              ई-चावडी प्रणाली- मध्ये एक ही खातेदारांची मागणी निश्चिती न केल्याने
                              वसुली न करणाऱ्या गावांची संख्या
                            </Typography>
                            <Divider variant="middle" />
                          </Box>
                        </Card>

                        <Card style={{ flex: 1.6 }}>
                          <Box>
                            <Typography
                              sx={{ height: 95 }}
                              component="div"
                              align="center"
                              style={{
                                backgroundColor: '#002884',
                                color: '#F0F2F5',
                                fontSize: '12px',
                              }}
                            >
                              १००% मागणी निश्चिती न करता वसूली सुरू केलेल्या गावांची संख्या
                            </Typography>
                            <Divider variant="middle" />
                          </Box>
                        </Card>

                        <Card style={{ flex: 1.1 }}>
                          <Box>
                            <Typography
                              sx={{ height: 95 }}
                              component="div"
                              align="center"
                              style={{
                                backgroundColor: '#002884',
                                color: '#F0F2F5',
                                paddingTop: '20',
                              }}
                            >
                              एकुण
                            </Typography>
                            <Divider variant="middle" />
                          </Box>
                        </Card>
                      </Box>
                    </Grid>

                    {/* <Grid item xs={24} sm={24} md={24} lg={3} xl={2}>
                      <Card>
                        <Box>
                          <Typography
                            sx={{ height: 120 }}
                            component="div"
                            align="center"
                            style={{
                              backgroundColor: '#002884',
                              color: '#F0F2F5',
                              fontSize: '12px',
                            }}
                          >
                            ई-चावडी प्रणाली- मध्ये एक ही खातेदारांची मागणी निश्चिती न केल्याने वसुली
                            न करणाऱ्या गावांची संख्या
                          </Typography>
                          <Divider variant="middle" />
                        </Box>
                      </Card>
                    </Grid>

                    <Grid item xs={24} sm={24} md={24} lg={3} xl={3}>
                      <Card>
                        <Box>
                          <Typography
                            sx={{ height: 120 }}
                            component="div"
                            align="center"
                            style={{ backgroundColor: '#002884', color: '#F0F2F5' }}
                          >
                            १००% मागणी निश्चिती न करता वसूली सुरू केलेल्या गावांची संख्या
                          </Typography>

                          <Divider variant="middle" />
                        </Box>
                      </Card>
                    </Grid>
                    <Grid item xs={24} sm={24} md={24} lg={3} xl={2}>
                      <Card>
                        <Box>
                          <Typography
                            sx={{ height: 120 }}
                            component="div"
                            align="center"
                            style={{ backgroundColor: '#002884', color: '#F0F2F5' }}
                          >
                            <p>एकुण</p>
                          </Typography>
                          <Divider variant="middle" />
                        </Box>
                      </Card>
                    </Grid> */}

                    <Grid item xs={24} sm={24} md={24} lg={3} xl={2}>
                      <Card>
                        <Box>
                          <Typography
                            sx={{ height: 120 }}
                            component="div"
                            align="center"
                            style={{ backgroundColor: '#002884', color: '#F0F2F5' }}
                          >
                            {/* भाग - १ मधील गावांची संख्या */}
                            {/* 100 % मागणी निश्चिती केलेले गांव संख्या */}
                            {/* १००% मागणी निश्चिती केलेले गांव संख्या */}
                            १००% मागणी निश्चिती केलेली गांव संख्या
                          </Typography>

                          <Divider variant="middle" />
                        </Box>
                      </Card>
                    </Grid>
                    <Grid item xs={24} sm={24} md={24} lg={3} xl={2}>
                      <Card>
                        <Box>
                          <Typography
                            sx={{ height: 120 }}
                            component="div"
                            align="center"
                            style={{ backgroundColor: '#002884', color: '#F0F2F5' }}
                          >
                            १००% वसूली झालेल्या गावांची संख्या
                          </Typography>

                          <Divider variant="middle" />
                        </Box>
                      </Card>
                    </Grid>
                  </Grid>
                  {/* Main Grid */}
                  {dashBoardDetail &&
                    dashBoardDetail.map((r, i) => {
                      return (
                        <>
                          <Grid container spacing={1} columns={24} style={{ padding: '2px' }}>
                            <Grid
                              item
                              xs={24}
                              sm={24}
                              md={24}
                              lg={2}
                              xl={3}
                              style={{
                                cursor: 'pointer',
                                position: 'sticky!important',
                                top: '0px',
                                width: '100%',
                              }}
                            >
                              <Card>
                                <Box
                                  sx={{
                                    bgcolor: '#91ceff',
                                    height: 50,
                                  }}
                                >
                                  {/* Division Click */}
                                  <CardContent>
                                    <h3
                                    // onClick={(e) => {
                                    //   //alert('showdist');
                                    //   if (
                                    //     showDistrict === true &&
                                    //     r.divisionCode === divisionCode
                                    //   ) {
                                    //     setshowDistrict(false);
                                    //   } else {
                                    //     setshowSpin(true);
                                    //     setDashBoardDetail1([]);
                                    //     setDivisionCode(r.divisionCode);
                                    //     setDistricts(r.districtCode);
                                    //     getDashBoardDetails1(r.divisionCode);
                                    //     setshowDistrict(true);
                                    //   }
                                    // }}
                                    >
                                      {' '}
                                      <u
                                        onClick={(e) => {
                                          //alert('showdist');
                                          if (
                                            showDistrict === true &&
                                            r.divisionCode === divisionCode
                                          ) {
                                            setshowDistrict(false);
                                          } else {
                                            setshowSpin(true);
                                            setDashBoardDetail1([]);
                                            setDivisionCode(r.divisionCode);
                                            setDistricts(r.districtCode);
                                            getDashBoardDetails1(r.divisionCode);
                                            setshowDistrict(true);
                                          }
                                        }}
                                      >
                                        {r.divisionName}
                                      </u>{' '}
                                      &nbsp;
                                      {showDistrict === true && r.divisionCode === divisionCode && (
                                        <ExportToExcel
                                          dataDistrict={dashBoardDetail1}
                                          totalDistrict={dashBoardCount1}
                                          btnName={'GridDistrict'}
                                          style={{ width: '10px' }}
                                        >
                                          {/* <DownloadOutlined style={{ width: '100%' }} /> */}
                                        </ExportToExcel>
                                      )}
                                      {showSpin === true && r.divisionCode === divisionCode && (
                                        <Spin indicator={antIcon} />
                                      )}
                                    </h3>
                                  </CardContent>
                                </Box>
                              </Card>
                            </Grid>
                            {/* )} */}
                            <Grid item xs={24} sm={24} md={24} lg={2} xl={2}>
                              <Card>
                                <Box
                                  sx={{
                                    bgcolor: '#91ceff',
                                    height: 50,
                                  }}
                                >
                                  <CardContent>
                                    <center>
                                      <h3>{r.districtsCount}</h3>
                                    </center>
                                  </CardContent>
                                </Box>
                              </Card>
                            </Grid>
                            <Grid item xs={24} sm={24} md={24} lg={2} xl={2}>
                              <Card>
                                <Box
                                  sx={{
                                    bgcolor: '#91ceff',
                                    height: 50,
                                  }}
                                >
                                  <CardContent>
                                    <center>
                                      <h3>{r.totalTaluka}</h3>
                                    </center>
                                  </CardContent>
                                </Box>
                              </Card>
                            </Grid>
                            <Grid item xs={24} sm={24} md={24} lg={3} xl={2}>
                              <Card>
                                <Box
                                  sx={{
                                    bgcolor: '#91ceff',
                                    height: 50,
                                  }}
                                >
                                  <CardContent>
                                    <center>
                                      <h3>{r.totalVillages}</h3>
                                    </center>
                                  </CardContent>
                                </Box>
                              </Card>
                            </Grid>
                            <Grid item xs={24} sm={24} md={24} lg={3} xl={2}>
                              <Card>
                                <Box
                                  sx={{
                                    bgcolor: '#91ceff',
                                    height: 50,
                                  }}
                                >
                                  <CardContent>
                                    <center>
                                      <h3>{r.totalEntry}</h3>
                                    </center>
                                  </CardContent>
                                </Box>
                              </Card>
                            </Grid>
                            <Grid item xs={24} sm={24} md={24} lg={3} xl={2}>
                              <Card>
                                <Box
                                  sx={{
                                    bgcolor: '#91ceff',
                                    height: 50,
                                  }}
                                >
                                  <CardContent>
                                    <center>
                                      <h3>{r.totalGaonNamunaCount}</h3>
                                    </center>
                                  </CardContent>
                                </Box>
                              </Card>
                            </Grid>
                            <Grid item xs={24} sm={24} md={24} lg={3} xl={2}>
                              <Card>
                                <Box
                                  sx={{
                                    bgcolor: '#91ceff',
                                    height: 50,
                                  }}
                                >
                                  <CardContent>
                                    <center>
                                      {/* <h3>4 </h3> */}
                                      <h3>{r.demandCount} </h3>
                                    </center>
                                  </CardContent>
                                </Box>
                              </Card>
                            </Grid>
                            {/* Newly mapped variable */}

                            <Grid item xs={24} sm={24} md={24} lg={3} xl={3}>
                              <Card>
                                <Box
                                  sx={{
                                    bgcolor: '#91ceff',
                                    height: 50,
                                  }}
                                >
                                  <CardContent>
                                    <center>
                                      <h3>{r.vasuliWithoutDemandCount}</h3>
                                    </center>
                                  </CardContent>
                                </Box>
                              </Card>
                            </Grid>
                            <Grid item xs={24} sm={24} md={24} lg={3} xl={2}>
                              <Card>
                                <Box
                                  sx={{
                                    bgcolor: '#91ceff',
                                    height: 50,
                                  }}
                                >
                                  <CardContent>
                                    <center>
                                      {/* <h3>T</h3> */}
                                      <h3>{r.totalOfSevenEight} </h3>
                                    </center>
                                  </CardContent>
                                </Box>
                              </Card>
                            </Grid>
                            <Grid item xs={24} sm={24} md={24} lg={3} xl={2}>
                              <Card>
                                <Box
                                  sx={{
                                    bgcolor: '#91ceff',
                                    height: 50,
                                  }}
                                >
                                  <CardContent>
                                    <center>
                                      <h3>{r.totalDemandCompletedCount}</h3>
                                    </center>
                                  </CardContent>
                                </Box>
                              </Card>
                            </Grid>
                            <Grid item xs={24} sm={24} md={24} lg={3} xl={2}>
                              <Card>
                                <Box
                                  sx={{
                                    bgcolor: '#91ceff',
                                    height: 50,
                                  }}
                                >
                                  <CardContent>
                                    <center>
                                      <h3>{r.vasuliCompletedCount}</h3>
                                    </center>
                                  </CardContent>
                                </Box>
                              </Card>
                            </Grid>
                          </Grid>
                          {/* District Grid */}
                          {showDistrict === true && r.divisionCode === divisionCode && (
                            <Grid
                              container
                              spacing={1}
                              columns={24}
                              style={{ padding: '2px' }}
                            ></Grid>
                          )}
                          {showDistrict === true &&
                            dashBoardDetail1?.length !== 0 &&
                            r.divisionCode === divisionCode &&
                            dashBoardDetail1?.map((r, i) => {
                              return (
                                <>
                                  <Grid
                                    container
                                    spacing={1}
                                    columns={24}
                                    style={{ padding: '2px', cursor: 'pointer' }}
                                  >
                                    <Grid item xs={24} sm={24} md={24} lg={2} xl={3}>
                                      <Card>
                                        <Box
                                          sx={{
                                            // bgcolor: '#91ceff',
                                            bgcolor: '#cce8ff',
                                            height: r.districtName?.length >= 11 ? 60 : 50,
                                          }}
                                        >
                                          <CardContent>
                                            <h4
                                            // onClick={(e) => {
                                            //   //alert('showtaluka');
                                            //   if (
                                            //     showTaluka === true &&
                                            //     r.districtCode === districtsCode
                                            //   ) {
                                            //     setshowTaluka(false);
                                            //   } else {
                                            //     setshowSpin2(true);
                                            //     setDashBoardDetail2([]);
                                            //     setDivisionCode(r.divisionCode);
                                            //     setDistricts(r.districtCode);
                                            //     //for Taluka grid
                                            //     setTalukaCode(r.talukaCode);
                                            //     getDashBoardDetails2(
                                            //       r.divisionCode,
                                            //       r.districtCode,
                                            //     );
                                            //     setshowTaluka(true);
                                            //   }
                                            // }}
                                            >
                                              <u
                                                onClick={(e) => {
                                                  //alert('showtaluka');
                                                  if (
                                                    showTaluka === true &&
                                                    r.districtCode === districtsCode
                                                  ) {
                                                    setshowTaluka(false);
                                                  } else {
                                                    setshowSpin2(true);
                                                    setDashBoardDetail2([]);
                                                    setDivisionCode(r.divisionCode);
                                                    setDistricts(r.districtCode);
                                                    //for Taluka grid
                                                    setTalukaCode(r.talukaCode);
                                                    getDashBoardDetails2(
                                                      r.divisionCode,
                                                      r.districtCode,
                                                    );
                                                    setshowTaluka(true);
                                                  }
                                                }}
                                              >
                                                {' '}
                                                {r.districtName}
                                              </u>
                                              &nbsp;
                                              {showTaluka === true &&
                                                r.districtCode === districtsCode && (
                                                  <ExportToExcel
                                                    dataTaluka={dashBoardDetail2}
                                                    btnName={'GridTaluka'}
                                                    style={{ width: '10px' }}
                                                  />
                                                )}
                                              {showSpin2 === true &&
                                                r.districtsCode === districtsCode && (
                                                  <Spin indicator={antIcon} />
                                                )}
                                            </h4>
                                          </CardContent>
                                        </Box>
                                      </Card>
                                    </Grid>
                                    <Grid item xs={24} sm={24} md={24} lg={2} xl={2}>
                                      <Card>
                                        <Box
                                          sx={{
                                            bgcolor: '#cce8ff',
                                            //height: 50,
                                            height: r.districtName?.length >= 11 ? 60 : 50,
                                          }}
                                        >
                                          <CardContent>
                                            <center>
                                              <h3>{r.districtsCount}</h3>
                                            </center>
                                          </CardContent>
                                        </Box>
                                      </Card>
                                    </Grid>
                                    <Grid item xs={24} sm={24} md={24} lg={2} xl={2}>
                                      <Card>
                                        <Box
                                          sx={{
                                            bgcolor: '#cce8ff',
                                            //height: 50,
                                            height: r.districtName?.length >= 11 ? 60 : 50,
                                          }}
                                        >
                                          <CardContent>
                                            <center>
                                              <h3>{r.totalTaluka}</h3>
                                            </center>
                                          </CardContent>
                                        </Box>
                                      </Card>
                                    </Grid>
                                    <Grid item xs={24} sm={24} md={24} lg={3} xl={2}>
                                      <Card>
                                        <Box
                                          sx={{
                                            bgcolor: '#cce8ff',
                                            //height: 50,
                                            height: r.districtName?.length >= 11 ? 60 : 50,
                                          }}
                                        >
                                          <CardContent>
                                            <center>
                                              <h3>{r.totalVillages}</h3>
                                            </center>
                                          </CardContent>
                                        </Box>
                                      </Card>
                                    </Grid>

                                    <Grid item xs={24} sm={24} md={24} lg={3} xl={2}>
                                      <Card>
                                        <Box
                                          sx={{
                                            bgcolor: '#cce8ff',
                                            //height: 50,
                                            height: r.districtName?.length >= 11 ? 60 : 50,
                                          }}
                                        >
                                          <CardContent>
                                            <center>
                                              <h3>{r.totalEntry}</h3>
                                            </center>
                                          </CardContent>
                                        </Box>
                                      </Card>
                                    </Grid>
                                    <Grid item xs={24} sm={24} md={24} lg={3} xl={2}>
                                      <Card>
                                        <Box
                                          sx={{
                                            bgcolor: '#cce8ff',
                                            // height: 50,
                                            height: r.districtName?.length >= 11 ? 60 : 50,
                                          }}
                                        >
                                          <CardContent>
                                            <center>
                                              <h3>{r.totalGaonNamunaCount}</h3>
                                            </center>
                                          </CardContent>
                                        </Box>
                                      </Card>
                                    </Grid>
                                    <Grid item xs={24} sm={24} md={24} lg={3} xl={2}>
                                      <Card>
                                        <Box
                                          sx={{
                                            bgcolor: '#cce8ff',
                                            // height: 50,
                                            height: r.districtName?.length >= 11 ? 60 : 50,
                                          }}
                                        >
                                          <CardContent>
                                            <center>
                                              {/* <h3>4 D</h3> */}
                                              <h3>{r.demandCount}</h3>
                                            </center>
                                          </CardContent>
                                        </Box>
                                      </Card>
                                    </Grid>

                                    <Grid item xs={24} sm={24} md={24} lg={3} xl={3}>
                                      <Card>
                                        <Box
                                          sx={{
                                            bgcolor: '#cce8ff',
                                            //height: 50,
                                            height: r.districtName?.length >= 11 ? 60 : 50,
                                          }}
                                        >
                                          <CardContent>
                                            <center>
                                              <h3>{r.vasuliWithoutDemandCount}</h3>
                                            </center>
                                          </CardContent>
                                        </Box>
                                      </Card>
                                    </Grid>
                                    <Grid item xs={24} sm={24} md={24} lg={3} xl={2}>
                                      <Card>
                                        <Box
                                          sx={{
                                            bgcolor: '#cce8ff',
                                            //height: 50,
                                            height: r.districtName?.length >= 11 ? 60 : 50,
                                          }}
                                        >
                                          <CardContent>
                                            <center>
                                              {/* <h3>T D</h3> */}
                                              <h3>{r?.totalOfSevenEight}</h3>
                                            </center>
                                          </CardContent>
                                        </Box>
                                      </Card>
                                    </Grid>
                                    <Grid item xs={24} sm={24} md={24} lg={3} xl={2}>
                                      <Card>
                                        <Box
                                          sx={{
                                            bgcolor: '#cce8ff',
                                            //height: 50,
                                            height: r.districtName?.length >= 11 ? 60 : 50,
                                          }}
                                        >
                                          <CardContent>
                                            <center>
                                              <h3>{r.totalDemandCompletedCount}</h3>
                                            </center>
                                          </CardContent>
                                        </Box>
                                      </Card>
                                    </Grid>
                                    <Grid item xs={24} sm={24} md={24} lg={3} xl={2}>
                                      <Card>
                                        <Box
                                          sx={{
                                            bgcolor: '#cce8ff',
                                            //height: 50,
                                            height: r.districtName?.length >= 11 ? 60 : 50,
                                          }}
                                        >
                                          <CardContent>
                                            <center>
                                              <h3>{r.vasuliCompletedCount}</h3>
                                            </center>
                                          </CardContent>
                                        </Box>
                                      </Card>
                                    </Grid>
                                  </Grid>
                                  {/* Show Taluka */}
                                  {showTaluka === true && r.districtCode === districtsCode && (
                                    <Grid
                                      container
                                      spacing={1}
                                      columns={24}
                                      style={{ padding: '2px' }}
                                    ></Grid>
                                  )}

                                  {showTaluka === true &&
                                    dashBoardDetail2?.length !== 0 &&
                                    r.districtCode === districtsCode &&
                                    dashBoardDetail2?.map((r, i) => {
                                      return (
                                        <>
                                          <Grid
                                            container
                                            spacing={1}
                                            columns={24}
                                            style={{ padding: '2px' }}
                                          >
                                            <Grid item xs={24} sm={24} md={24} lg={2} xl={3}>
                                              <Card>
                                                <Box
                                                  sx={{
                                                    // bgcolor: '#91ceff',
                                                    bgcolor: '#F0F2F5',
                                                    height: 50,
                                                  }}
                                                >
                                                  {/* <CardContent>
                                                    <center>
                                                      <h4>{r.talukaName}</h4>
                                                    </center>
                                                  </CardContent> */}
                                                  <CardContent>
                                                    <center>
                                                      <a
                                                        onClick={() => {
                                                          redirectToReport(
                                                            r.districtName,
                                                            r.districtCode,
                                                            r.talukaName,
                                                            r.talukaCode,
                                                          );
                                                        }}
                                                      >
                                                        <h4>
                                                          <u> {r.talukaName}</u>
                                                        </h4>
                                                      </a>{' '}
                                                    </center>
                                                  </CardContent>
                                                </Box>
                                              </Card>
                                            </Grid>
                                            <Grid item xs={24} sm={24} md={24} lg={2} xl={2}>
                                              <Card>
                                                <Box
                                                  sx={{
                                                    bgcolor: '#F0F2F5',
                                                    height: 50,
                                                  }}
                                                >
                                                  <CardContent>
                                                    <center>
                                                      {/* <h3>{r.districtsCount}</h3> */}
                                                      <h3>0</h3>
                                                    </center>
                                                  </CardContent>
                                                </Box>
                                              </Card>
                                            </Grid>
                                            <Grid item xs={24} sm={24} md={24} lg={2} xl={2}>
                                              <Card>
                                                <Box
                                                  sx={{
                                                    bgcolor: '#F0F2F5',
                                                    height: 50,
                                                  }}
                                                >
                                                  <CardContent>
                                                    <center>
                                                      {/* <h3>{r.totalTaluka}</h3>
                                                       */}
                                                      <h3>1</h3>
                                                    </center>
                                                  </CardContent>
                                                </Box>
                                              </Card>
                                            </Grid>
                                            <Grid item xs={24} sm={24} md={24} lg={3} xl={2}>
                                              <Card>
                                                <Box
                                                  sx={{
                                                    // bgcolor: '#F0F2F5',
                                                    bgcolor: '#e4f4ff',
                                                    height: 50,
                                                  }}
                                                >
                                                  <CardContent>
                                                    <center>
                                                      <h3>{r.totalVillages}</h3>
                                                    </center>
                                                  </CardContent>
                                                  {/* <CardContent>
                                                    <center>
                                                      <a
                                                        onClick={() => {
                                                          redirectToReport(
                                                            r.districtName,
                                                            r.districtCode,
                                                          );
                                                        }}
                                                      >
                                                        <h3>{r.totalVillages}</h3>
                                                      </a>{' '}
                                                    </center>
                                                  </CardContent> */}
                                                </Box>
                                              </Card>
                                            </Grid>
                                            <Grid item xs={24} sm={24} md={24} lg={3} xl={2}>
                                              <Card>
                                                <Box
                                                  sx={{
                                                    bgcolor: '#e4f4ff',
                                                    height: 50,
                                                  }}
                                                >
                                                  <CardContent>
                                                    <center>
                                                      {/* <h3>{r.totalEntry}</h3> */}
                                                      <a
                                                        onClick={() => {
                                                          redirectToReport(
                                                            r.districtName,
                                                            r.districtCode,
                                                            r.talukaName,
                                                            r.talukaCode,
                                                          );
                                                        }}
                                                      >
                                                        <h3>
                                                          {/* <u> {r.vasuliCompletedCount}</u> */}
                                                          <u> {r.totalEntry}</u>
                                                        </h3>
                                                      </a>{' '}
                                                    </center>
                                                  </CardContent>
                                                </Box>
                                              </Card>
                                            </Grid>
                                            <Grid item xs={24} sm={24} md={24} lg={3} xl={2}>
                                              <Card>
                                                <Box
                                                  sx={{
                                                    bgcolor: '#e4f4ff',
                                                    height: 50,
                                                  }}
                                                >
                                                  <CardContent>
                                                    <center>
                                                      {/* <h3>{r.totalGaonNamunaCount}</h3> */}
                                                      <a
                                                        onClick={() => {
                                                          redirectToGoannamune_Purna_Bharlyababat_Ghoshna_Keleli_Gaon_Sankhya(
                                                            r.districtName,
                                                            r.districtCode,
                                                            r.totalPhase1Villages,
                                                            r.talukaCode,
                                                          );
                                                        }}
                                                      >
                                                        <h3>
                                                          <u> {r.totalGaonNamunaCount}</u>
                                                        </h3>
                                                      </a>
                                                    </center>
                                                  </CardContent>
                                                </Box>
                                              </Card>
                                            </Grid>
                                            <Grid item xs={24} sm={24} md={24} lg={3} xl={2}>
                                              <Card>
                                                <Box
                                                  sx={{
                                                    bgcolor: '#e4f4ff',
                                                    height: 50,
                                                  }}
                                                >
                                                  <CardContent>
                                                    <center>
                                                      {/* <h3>{r.totalGaonNamunaCount}</h3> */}
                                                      <a
                                                      // onClick={() => {
                                                      //   redirectToGoannamune_Purna_Bharlyababat_Ghoshna_Keleli_Gaon_Sankhya(
                                                      //     r.districtName,
                                                      //     r.districtCode,
                                                      //     r.totalPhase1Villages,
                                                      //     r.talukaCode,
                                                      //   );
                                                      // }}
                                                      >
                                                        <h3>
                                                          {/* <u>4T</u> */}
                                                          {r.demandCount}
                                                        </h3>
                                                      </a>
                                                    </center>
                                                  </CardContent>
                                                </Box>
                                              </Card>
                                            </Grid>
                                            {/* <Grid item xs={24} sm={24} md={24} lg={3} xl={3}>
                                              <Card>
                                                <Box
                                                  sx={{
                                                    bgcolor: '#e4f4ff',
                                                    height: 50,
                                                  }}
                                                >
                                                  <CardContent>
                                                    <center>
                                                      
                                                      <a
                                                        onClick={() => {
                                                          redirectToMagniNichtiKeleliGaoanSankhya(
                                                            r.districtName,
                                                            r.districtCode,
                                                            r.totalPhase1Login,
                                                            r.talukaCode,
                                                          );
                                                        }}
                                                      >
                                                        <h3>
                                                          <u> {r.totalDemandCompletedCount}</u>
                                                        </h3>
                                                      </a>
                                                    </center>
                                                  </CardContent>
                                                </Box>
                                              </Card>
                                            </Grid> */}

                                            {/* 7777 */}
                                            <Grid item xs={24} sm={24} md={24} lg={3} xl={3}>
                                              <Card>
                                                <Box
                                                  sx={{
                                                    bgcolor: '#e4f4ff',
                                                    height: 50,
                                                  }}
                                                >
                                                  <CardContent>
                                                    <center>
                                                      <a
                                                        onClick={() => {
                                                          redirectToMagniNichtiNaKartaVasuliSuruKelelyaGaoanSankhya(
                                                            r.districtName,
                                                            r.districtCode,
                                                            r.totalOnlineVillagesCount,
                                                            r.talukaCode,
                                                          );
                                                        }}
                                                      >
                                                        <h3>
                                                          <u>{r.vasuliWithoutDemandCount}</u>
                                                        </h3>
                                                      </a>
                                                    </center>
                                                  </CardContent>
                                                </Box>
                                              </Card>
                                            </Grid>
                                            <Grid item xs={24} sm={24} md={24} lg={3} xl={2}>
                                              <Card>
                                                <Box
                                                  sx={{
                                                    bgcolor: '#e4f4ff',
                                                    height: 50,
                                                  }}
                                                >
                                                  <CardContent>
                                                    <center>
                                                      <a
                                                      // onClick={() => {
                                                      //   redirectToMagniNichtiNaKartaVasuliSuruKelelyaGaoanSankhya(
                                                      //     r.districtName,
                                                      //     r.districtCode,
                                                      //     r.totalOnlineVillagesCount,
                                                      //     r.talukaCode,
                                                      //   );
                                                      // }}
                                                      >
                                                        <h3>
                                                          {/* <u>T T</u> */}
                                                          {r.totalOfSevenEight}
                                                        </h3>
                                                      </a>
                                                    </center>
                                                  </CardContent>
                                                </Box>
                                              </Card>
                                            </Grid>
                                            <Grid item xs={24} sm={24} md={24} lg={3} xl={2}>
                                              <Card>
                                                <Box
                                                  sx={{
                                                    bgcolor: '#e4f4ff',
                                                    height: 50,
                                                  }}
                                                >
                                                  <CardContent>
                                                    <center>
                                                      <a
                                                        onClick={() => {
                                                          redirectToMagniNichtiKeleliGaoanSankhya(
                                                            r.districtName,
                                                            r.districtCode,
                                                            r.totalPhase1Login,
                                                            r.talukaCode,
                                                          );
                                                        }}
                                                      >
                                                        <h3>
                                                          <u> {r.totalDemandCompletedCount}</u>
                                                        </h3>
                                                      </a>
                                                    </center>
                                                  </CardContent>
                                                </Box>
                                              </Card>
                                            </Grid>
                                            <Grid item xs={24} sm={24} md={24} lg={3} xl={2}>
                                              <Card>
                                                <Box
                                                  sx={{
                                                    bgcolor: '#e4f4ff',
                                                    height: 50,
                                                  }}
                                                >
                                                  <CardContent>
                                                    <center>
                                                      {/* <h3>{r.vasuliCompletedCount}</h3> */}
                                                      <a
                                                        onClick={() => {
                                                          redirectToVasuli_Zalelya_Gawanchi_Sankhya(
                                                            r.districtName,
                                                            r.districtCode,
                                                            r.totalOnlineVillagesCount,
                                                            r.talukaCode,
                                                          );
                                                        }}
                                                      >
                                                        <h3>
                                                          <u> {r.vasuliCompletedCount}</u>
                                                        </h3>
                                                      </a>
                                                    </center>
                                                  </CardContent>
                                                </Box>
                                              </Card>
                                            </Grid>
                                          </Grid>
                                        </>
                                      );
                                    })}
                                </>
                              );
                            })}

                          {/* Taluka एकूण */}
                          {/* TO add Taluka एकूण code put here */}
                          {/* District एकूण */}
                          {showDistrict === true && r.divisionCode === divisionCode && (
                            <div>
                              <Grid container spacing={1} columns={24}>
                                <Grid item xs={24} sm={24} md={24} lg={2} xl={3}>
                                  <Card>
                                    <Box
                                      sx={{
                                        bgcolor: '#cce8ff',
                                        height: 50,
                                      }}
                                    >
                                      <CardContent>
                                        <center>
                                          <h3>एकूण</h3>
                                          {/* <h3>एकूण district</h3> */}
                                        </center>
                                      </CardContent>
                                    </Box>
                                  </Card>
                                </Grid>
                                <Grid item xs={24} sm={24} md={24} lg={2} xl={2}>
                                  <Card>
                                    <Box
                                      sx={{
                                        bgcolor: '#cce8ff',
                                        height: 50,
                                      }}
                                    >
                                      <CardContent>
                                        <center>
                                          <h3>{dashBoardCount1?.districtsCount}</h3>
                                        </center>
                                      </CardContent>
                                    </Box>
                                  </Card>
                                </Grid>
                                <Grid item xs={24} sm={24} md={24} lg={2} xl={2}>
                                  <Card>
                                    <Box
                                      sx={{
                                        bgcolor: '#cce8ff',
                                        height: 50,
                                      }}
                                    >
                                      <CardContent>
                                        <center>
                                          <h3>{dashBoardCount1?.totalTalukaT}</h3>
                                        </center>
                                      </CardContent>
                                    </Box>
                                  </Card>
                                </Grid>
                                <Grid item xs={24} sm={24} md={24} lg={3} xl={2}>
                                  <Card>
                                    <Box
                                      sx={{
                                        bgcolor: '#cce8ff',
                                        height: 50,
                                      }}
                                    >
                                      <CardContent>
                                        <center>
                                          <h3> {dashBoardCount1?.totalVillagesT}</h3>
                                        </center>
                                      </CardContent>
                                    </Box>
                                  </Card>
                                </Grid>

                                <Grid item xs={24} sm={24} md={24} lg={3} xl={2}>
                                  <Card>
                                    <Box
                                      sx={{
                                        bgcolor: '#cce8ff',
                                        height: 50,
                                      }}
                                    >
                                      <CardContent>
                                        <center>
                                          <h3> {dashBoardCount1?.totalEntryT}</h3>
                                        </center>
                                      </CardContent>
                                    </Box>
                                  </Card>
                                </Grid>
                                <Grid item xs={24} sm={24} md={24} lg={3} xl={2}>
                                  <Card>
                                    <Box
                                      sx={{
                                        bgcolor: '#cce8ff',
                                        height: 50,
                                      }}
                                    >
                                      <CardContent>
                                        <center>
                                          <h3> {dashBoardCount1?.totalGaonNamunaCountT}</h3>
                                        </center>
                                      </CardContent>
                                    </Box>
                                  </Card>
                                </Grid>
                                <Grid item xs={24} sm={24} md={24} lg={3} xl={2}>
                                  <Card>
                                    <Box
                                      sx={{
                                        bgcolor: '#cce8ff',
                                        height: 50,
                                      }}
                                    >
                                      <CardContent>
                                        <center>
                                          {/* <h3>4T</h3> */}
                                          <h3>{dashBoardCount1?.demandCountT}</h3>
                                        </center>
                                      </CardContent>
                                    </Box>
                                  </Card>
                                </Grid>

                                <Grid item xs={24} sm={24} md={24} lg={3} xl={3}>
                                  <Card>
                                    <Box
                                      sx={{
                                        bgcolor: '#cce8ff',
                                        height: 50,
                                      }}
                                    >
                                      <CardContent>
                                        <center>
                                          <h3> {dashBoardCount1?.vasuliWithoutDemandCountT}</h3>
                                        </center>
                                      </CardContent>
                                    </Box>
                                  </Card>
                                </Grid>
                                <Grid item xs={24} sm={24} md={24} lg={3} xl={2}>
                                  <Card>
                                    <Box
                                      sx={{
                                        bgcolor: '#cce8ff',
                                        height: 50,
                                      }}
                                    >
                                      <CardContent>
                                        <center>
                                          {/* <h3> T</h3> */}
                                          <h3>{dashBoardCount1?.totalOfSevenEightT}</h3>
                                        </center>
                                      </CardContent>
                                    </Box>
                                  </Card>
                                </Grid>
                                <Grid item xs={24} sm={24} md={24} lg={3} xl={2}>
                                  <Card>
                                    <Box
                                      sx={{
                                        bgcolor: '#cce8ff',
                                        height: 50,
                                      }}
                                    >
                                      <CardContent>
                                        <center>
                                          <h3> {dashBoardCount1?.totalDemandCompletedCountT}</h3>
                                        </center>
                                      </CardContent>
                                    </Box>
                                  </Card>
                                </Grid>
                                <Grid item xs={24} sm={24} md={24} lg={3} xl={2}>
                                  <Card>
                                    <Box
                                      sx={{
                                        bgcolor: '#cce8ff',
                                        height: 50,
                                      }}
                                    >
                                      <CardContent>
                                        <center>
                                          <h3> {dashBoardCount1?.vasuliCompletedCountT}</h3>
                                        </center>
                                      </CardContent>
                                    </Box>
                                  </Card>
                                </Grid>
                              </Grid>
                            </div>
                          )}
                        </>
                      );
                    })}

                  {/* Division एकूण */}
                  <Grid container spacing={1} columns={24} style={{ padding: '2px' }}>
                    <Grid item xs={24} sm={24} md={24} lg={2} xl={3}>
                      <Card>
                        <Box
                          sx={{
                            bgcolor: '#91ceff',
                            height: 50,
                          }}
                        >
                          <CardContent>
                            <center>
                              {/* <h3>एकूण Division t1</h3> */}
                              <h3>एकूण</h3>
                            </center>
                          </CardContent>
                        </Box>
                      </Card>
                    </Grid>
                    <Grid item xs={24} sm={24} md={24} lg={2} xl={2}>
                      <Card>
                        <Box
                          sx={{
                            bgcolor: '#91ceff',
                            height: 50,
                          }}
                        >
                          <CardContent>
                            <center>
                              <h3>{dashBoardCount?.districtsCount}</h3>
                            </center>
                          </CardContent>
                        </Box>
                      </Card>
                    </Grid>
                    <Grid item xs={24} sm={24} md={24} lg={2} xl={2}>
                      <Card>
                        <Box
                          sx={{
                            bgcolor: '#91ceff',
                            height: 50,
                          }}
                        >
                          <CardContent>
                            <center>
                              <h3>{dashBoardCount?.totalTalukaT}</h3>
                            </center>
                          </CardContent>
                        </Box>
                      </Card>
                    </Grid>
                    <Grid item xs={24} sm={24} md={24} lg={3} xl={2}>
                      <Card>
                        <Box
                          sx={{
                            bgcolor: '#91ceff',
                            height: 50,
                          }}
                        >
                          <CardContent>
                            <center>
                              <h3> {dashBoardCount?.totalVillagesT}</h3>
                            </center>
                          </CardContent>
                        </Box>
                      </Card>
                    </Grid>

                    <Grid item xs={24} sm={24} md={24} lg={3} xl={2}>
                      <Card>
                        <Box
                          sx={{
                            bgcolor: '#91ceff',
                            height: 50,
                          }}
                        >
                          <CardContent>
                            <center>
                              <h3> {dashBoardCount?.totalEntryT}</h3>
                            </center>
                          </CardContent>
                        </Box>
                      </Card>
                    </Grid>

                    {/* New variable Mapped */}
                    <Grid item xs={24} sm={24} md={24} lg={3} xl={2}>
                      <Card>
                        <Box
                          sx={{
                            bgcolor: '#91ceff',
                            height: 50,
                          }}
                        >
                          <CardContent>
                            <center>
                              <h3> {dashBoardCount?.totalGaonNamunaCountT}</h3>
                            </center>
                          </CardContent>
                        </Box>
                      </Card>
                    </Grid>
                    <Grid item xs={24} sm={24} md={24} lg={3} xl={2}>
                      <Card>
                        <Box
                          sx={{
                            bgcolor: '#91ceff',
                            height: 50,
                          }}
                        >
                          <CardContent>
                            <center>
                              {/* <h3> 4</h3> */}
                              <h3> {dashBoardCount?.demandCountT}</h3>
                            </center>
                          </CardContent>
                        </Box>
                      </Card>
                    </Grid>

                    <Grid item xs={24} sm={24} md={24} lg={3} xl={3}>
                      <Card>
                        <Box
                          sx={{
                            bgcolor: '#91ceff',
                            height: 50,
                          }}
                        >
                          <CardContent>
                            <center>
                              <h3> {dashBoardCount?.vasuliWithoutDemandCountT}</h3>
                            </center>
                          </CardContent>
                        </Box>
                      </Card>
                    </Grid>
                    <Grid item xs={24} sm={24} md={24} lg={3} xl={2}>
                      <Card>
                        <Box
                          sx={{
                            bgcolor: '#91ceff',
                            height: 50,
                          }}
                        >
                          <CardContent>
                            <center>
                              {/* <h3> T</h3> */}
                              <h3> {dashBoardCount?.totalOfSevenEightT}</h3>
                            </center>
                          </CardContent>
                        </Box>
                      </Card>
                    </Grid>
                    <Grid item xs={24} sm={24} md={24} lg={3} xl={2}>
                      <Card>
                        <Box
                          sx={{
                            bgcolor: '#91ceff',
                            height: 50,
                          }}
                        >
                          <CardContent>
                            <center>
                              <h3> {dashBoardCount?.totalDemandCompletedCountT}</h3>
                            </center>
                          </CardContent>
                        </Box>
                      </Card>
                    </Grid>
                    <Grid item xs={24} sm={24} md={24} lg={3} xl={2}>
                      <Card>
                        <Box
                          sx={{
                            bgcolor: '#91ceff',
                            height: 50,
                          }}
                        >
                          <CardContent>
                            <center>
                              <h3> {dashBoardCount?.vasuliCompletedCountT}</h3>
                            </center>
                          </CardContent>
                        </Box>
                      </Card>
                    </Grid>
                  </Grid>
                  {/*asha new 0ct13*/}
                  {/************************************************list district**********************************************************8 */}
                </Paper>
              </Paper>
            </>
          )}

          {/* Static Dashboard */}
          {showStaticDashboard == true && (
            <>
              <Paper className={styles.Footercard}>
                <Paper className={styles.Footercard} style={{ height: '800px', overflowY: 'auto' }}>
                  {/* Main Grid */}
                  <Grid
                    container
                    spacing={1}
                    columns={24}
                    style={{
                      padding: '2px',
                      position: 'sticky',
                      top: '0px',
                      zIndex: '5',
                    }}
                  >
                    <Grid
                      item
                      xs={24}
                      sm={24}
                      md={24}
                      lg={3}
                      xl={3}
                      style={{ position: 'sticky! important', top: '0px', overflowY: 'auto' }}
                    >
                      <Card>
                        <Box>
                          <Typography
                            sx={{ height: 70 }}
                            component="div"
                            align="center"
                            style={{ backgroundColor: '#002884', color: '#F0F2F5' }}
                          >
                            विभाग/जिल्हा नाव
                          </Typography>

                          <Divider variant="middle" />
                        </Box>
                      </Card>
                    </Grid>
                    <Grid item xs={24} sm={24} md={24} lg={3} xl={3}>
                      <Card>
                        <Box>
                          <Typography
                            sx={{ height: 70 }}
                            component="div"
                            align="center"
                            style={{
                              backgroundColor: '#002884',
                              color: '#F0F2F5',
                            }}
                          >
                            जिल्ह्यांची संख्या
                          </Typography>

                          <Divider variant="middle" />
                        </Box>
                      </Card>
                    </Grid>
                    <Grid item xs={24} sm={24} md={24} lg={3} xl={3}>
                      <Card>
                        <Box>
                          <Typography
                            sx={{ height: 70 }}
                            component="div"
                            align="center"
                            style={{ backgroundColor: '#002884', color: '#F0F2F5' }}
                          >
                            तालुक्यांची संख्या
                          </Typography>

                          <Divider variant="middle" />
                        </Box>
                      </Card>
                    </Grid>
                    <Grid item xs={24} sm={24} md={24} lg={3} xl={3}>
                      <Card>
                        <Box>
                          <Typography
                            sx={{ height: 70 }}
                            component="div"
                            align="center"
                            style={{ backgroundColor: '#002884', color: '#F0F2F5' }}
                          >
                            एकूण गावांची संख्या
                          </Typography>

                          <Divider variant="middle" />
                        </Box>
                      </Card>
                    </Grid>

                    <Grid item xs={24} sm={24} md={24} lg={3} xl={3}>
                      <Card>
                        <Box>
                          <Typography
                            sx={{ height: 70 }}
                            component="div"
                            align="center"
                            style={{ backgroundColor: '#002884', color: '#F0F2F5' }}
                          >
                            भाग - १ मधील गावांची संख्या
                          </Typography>

                          <Divider variant="middle" />
                        </Box>
                      </Card>
                    </Grid>
                    <Grid item xs={24} sm={24} md={24} lg={3} xl={3}>
                      <Card>
                        <Box>
                          <Typography
                            sx={{ height: 70 }}
                            component="div"
                            align="center"
                            style={{ backgroundColor: '#002884', color: '#F0F2F5' }}
                          >
                            लॉगिन गावांची संख्या
                          </Typography>

                          <Divider variant="middle" />
                        </Box>
                      </Card>
                    </Grid>
                    <Grid item xs={24} sm={24} md={24} lg={3} xl={3}>
                      <Card>
                        <Box>
                          <Typography
                            sx={{ height: 70 }}
                            component="div"
                            align="center"
                            style={{ backgroundColor: '#002884', color: '#F0F2F5' }}
                          >
                            वसुली करणाऱ्या गावांची माहिती
                          </Typography>

                          <Divider variant="middle" />
                        </Box>
                      </Card>
                    </Grid>
                    <Grid item xs={24} sm={24} md={24} lg={3} xl={3}>
                      <Card>
                        <Box>
                          <Typography
                            sx={{ height: 70 }}
                            component="div"
                            align="center"
                            style={{ backgroundColor: '#002884', color: '#F0F2F5' }}
                          >
                            एकूण भरलेली माहिती
                          </Typography>

                          <Divider variant="middle" />
                        </Box>
                      </Card>
                    </Grid>
                  </Grid>
                  {/* Main Grid */}
                  {staticdashBoardDivision &&
                    staticdashBoardDivision.map((r, i) => {
                      return (
                        <>
                          <Grid container spacing={1} columns={24} style={{ padding: '2px' }}>
                            <Grid
                              item
                              xs={24}
                              sm={24}
                              md={24}
                              lg={3}
                              xl={3}
                              style={{
                                cursor: 'pointer',
                                position: 'sticky!important',
                                top: '0px',
                                width: '100%',
                              }}
                            >
                              <Card>
                                <Box
                                  sx={{
                                    bgcolor: '#91ceff',
                                    height: 50,
                                  }}
                                >
                                  {/* Division Click */}
                                  <CardContent>
                                    {/* <h3>{r.vibhagjillaha1}</h3> */}
                                    <h3
                                      onClick={(e) => {
                                        //alert('showdist');
                                        if (
                                          showDistrictforStaticDashboard === true &&
                                          r.sequence == sequenceA
                                        ) {
                                          setshowDistrictforStaticDashboard(false);
                                        } else {
                                          setshowSpin(true);
                                          setstaticdashBoardDistrict([]);
                                          getStaticMISDataDistrict(r.sequence, r.year);
                                          setSequenceA(r.sequence);
                                          setshowDistrictforStaticDashboard(true);
                                        }
                                      }}
                                    >
                                      {' '}
                                      {r.vibhagjillaha1 == 'एकूण' ? (
                                        r.vibhagjillaha1
                                      ) : (
                                        <u>{r.vibhagjillaha1}</u>
                                      )}{' '}
                                      &nbsp;&nbsp;
                                      {showSpin === true && r.sequence == sequenceA && (
                                        <Spin indicator={antIcon} />
                                      )}
                                    </h3>
                                  </CardContent>
                                </Box>
                              </Card>
                            </Grid>
                            {/* )} */}
                            <Grid item xs={24} sm={24} md={24} lg={3} xl={3}>
                              <Card>
                                <Box
                                  sx={{
                                    bgcolor: '#91ceff',
                                    height: 50,
                                  }}
                                >
                                  <CardContent>
                                    <center>
                                      <h3>{r.jilhanchisankhya2}</h3>
                                    </center>
                                  </CardContent>
                                </Box>
                              </Card>
                            </Grid>
                            <Grid item xs={24} sm={24} md={24} lg={3} xl={3}>
                              <Card>
                                <Box
                                  sx={{
                                    bgcolor: '#91ceff',
                                    height: 50,
                                  }}
                                >
                                  <CardContent>
                                    <center>
                                      <h3>{r.talukasankhya3}</h3>
                                    </center>
                                  </CardContent>
                                </Box>
                              </Card>
                            </Grid>
                            <Grid item xs={24} sm={24} md={24} lg={3} xl={3}>
                              <Card>
                                <Box
                                  sx={{
                                    bgcolor: '#91ceff',
                                    height: 50,
                                  }}
                                >
                                  <CardContent>
                                    <center>
                                      <h3>{r.totalgaonsankhya4}</h3>
                                    </center>
                                  </CardContent>
                                </Box>
                              </Card>
                            </Grid>
                            <Grid item xs={24} sm={24} md={24} lg={3} xl={3}>
                              <Card>
                                <Box
                                  sx={{
                                    bgcolor: '#91ceff',
                                    height: 50,
                                  }}
                                >
                                  <CardContent>
                                    <center>
                                      <h3>{r.bhagonegoansankhya5}</h3>
                                    </center>
                                  </CardContent>
                                </Box>
                              </Card>
                            </Grid>
                            <Grid item xs={24} sm={24} md={24} lg={3} xl={3}>
                              <Card>
                                <Box
                                  sx={{
                                    bgcolor: '#91ceff',
                                    height: 50,
                                  }}
                                >
                                  <CardContent>
                                    <center>
                                      <h3>{r.logingoansankhya6}</h3>
                                    </center>
                                  </CardContent>
                                </Box>
                              </Card>
                            </Grid>
                            <Grid item xs={24} sm={24} md={24} lg={3} xl={3}>
                              <Card>
                                <Box
                                  sx={{
                                    bgcolor: '#91ceff',
                                    height: 50,
                                  }}
                                >
                                  <CardContent>
                                    <center>
                                      <h3>{r.vasuligoansankhya7}</h3>
                                    </center>
                                  </CardContent>
                                </Box>
                              </Card>
                            </Grid>
                            <Grid item xs={24} sm={24} md={24} lg={3} xl={3}>
                              <Card>
                                <Box
                                  sx={{
                                    bgcolor: '#91ceff',
                                    height: 50,
                                  }}
                                >
                                  <CardContent>
                                    <center>
                                      <h3>{r.totalbharlalihiti8}</h3>
                                    </center>
                                  </CardContent>
                                </Box>
                              </Card>
                            </Grid>
                          </Grid>
                          {/* District Grid */}
                          {showDistrictforStaticDashboard === true && (
                            <Grid
                              container
                              spacing={1}
                              columns={24}
                              style={{ padding: '2px' }}
                            ></Grid>
                          )}
                          {showDistrictforStaticDashboard === true &&
                            staticdashBoardDistrict?.length !== 0 &&
                            r.sequence == sequenceA &&
                            staticdashBoardDistrict?.map((r, i) => {
                              return (
                                <>
                                  <Grid
                                    container
                                    spacing={1}
                                    columns={24}
                                    style={{ padding: '2px', cursor: 'pointer' }}
                                  >
                                    <Grid item xs={24} sm={24} md={24} lg={3} xl={3}>
                                      <Card>
                                        <Box
                                          sx={{
                                            bgcolor: '#cce8ff',
                                            //height: 50,
                                            height: r.vibhagjillaha1d?.length >= 11 ? 60 : 50,
                                          }}
                                        >
                                          <CardContent>
                                            <center>
                                              <h3>{r.vibhagjillaha1d}</h3>
                                            </center>
                                          </CardContent>
                                        </Box>
                                      </Card>
                                    </Grid>
                                    <Grid item xs={24} sm={24} md={24} lg={3} xl={3}>
                                      <Card>
                                        <Box
                                          sx={{
                                            bgcolor: '#cce8ff',
                                            //height: 50,
                                            height: r.vibhagjillaha1d?.length >= 11 ? 60 : 50,
                                          }}
                                        >
                                          <CardContent>
                                            <center>
                                              <h3>{r.jilhanchisankhya2d}</h3>
                                            </center>
                                          </CardContent>
                                        </Box>
                                      </Card>
                                    </Grid>
                                    <Grid item xs={24} sm={24} md={24} lg={3} xl={3}>
                                      <Card>
                                        <Box
                                          sx={{
                                            bgcolor: '#cce8ff',
                                            //height: 50,
                                            height: r.vibhagjillaha1d?.length >= 11 ? 60 : 50,
                                          }}
                                        >
                                          <CardContent>
                                            <center>
                                              <h3>{r.talukasankhya3d}</h3>
                                            </center>
                                          </CardContent>
                                        </Box>
                                      </Card>
                                    </Grid>
                                    <Grid item xs={24} sm={24} md={24} lg={3} xl={3}>
                                      <Card>
                                        <Box
                                          sx={{
                                            bgcolor: '#cce8ff',
                                            //height: 50,
                                            height: r.vibhagjillaha1d?.length >= 11 ? 60 : 50,
                                          }}
                                        >
                                          <CardContent>
                                            <center>
                                              <h3>{r.totalgaonsankhya4d}</h3>
                                            </center>
                                          </CardContent>
                                        </Box>
                                      </Card>
                                    </Grid>
                                    <Grid item xs={24} sm={24} md={24} lg={3} xl={3}>
                                      <Card>
                                        <Box
                                          sx={{
                                            bgcolor: '#cce8ff',
                                            // height: 50,
                                            height: r.vibhagjillaha1d?.length >= 11 ? 60 : 50,
                                          }}
                                        >
                                          <CardContent>
                                            <center>
                                              <h3>{r.bhagonegoansankhya5d}</h3>
                                            </center>
                                          </CardContent>
                                        </Box>
                                      </Card>
                                    </Grid>
                                    <Grid item xs={24} sm={24} md={24} lg={3} xl={3}>
                                      <Card>
                                        <Box
                                          sx={{
                                            bgcolor: '#cce8ff',
                                            //height: 50,
                                            height: r.vibhagjillaha1d?.length >= 11 ? 60 : 50,
                                          }}
                                        >
                                          <CardContent>
                                            <center>
                                              <h3>{r.logingoansankhya6d}</h3>
                                            </center>
                                          </CardContent>
                                        </Box>
                                      </Card>
                                    </Grid>
                                    <Grid item xs={24} sm={24} md={24} lg={3} xl={3}>
                                      <Card>
                                        <Box
                                          sx={{
                                            bgcolor: '#cce8ff',
                                            //height: 50,
                                            height: r.vibhagjillaha1d?.length >= 11 ? 60 : 50,
                                          }}
                                        >
                                          <CardContent>
                                            <center>
                                              <h3>{r.vasuligoansankhya7d}</h3>
                                            </center>
                                          </CardContent>
                                        </Box>
                                      </Card>
                                    </Grid>
                                    <Grid item xs={24} sm={24} md={24} lg={3} xl={3}>
                                      <Card>
                                        <Box
                                          sx={{
                                            bgcolor: '#cce8ff',
                                            //height: 50,
                                            height: r.vibhagjillaha1d?.length >= 11 ? 60 : 50,
                                          }}
                                        >
                                          <CardContent>
                                            <center>
                                              <h3>{r.totalbharlalihiti8d}</h3>
                                            </center>
                                          </CardContent>
                                        </Box>
                                      </Card>
                                    </Grid>
                                  </Grid>
                                </>
                              );
                            })}
                        </>
                      );
                    })}
                </Paper>
              </Paper>
            </>
          )}
        </Tabs.TabPane>
        {/* <Tabs.TabPane tab="भूमी उपाधीक्षक प्रगती अहवाल (DYSLR)" key="tab4"> */}
        <Tabs.TabPane tab="उप भूमि अधीक्षक प्रगती अहवाल (DYSLR)" key="tab4">
          <Paper className={styles.Footercard} style={{ height: '800px', overflowY: 'auto' }}>
            <Grid
              container
              spacing={1}
              columns={24}
              style={{
                padding: '2px',
                position: 'sticky',
                top: '0px',
                zIndex: '5',
              }}
            >
              <Grid
                item
                xs={24}
                sm={24}
                md={24}
                lg={2}
                xl={2}
                style={{ position: 'sticky! important', top: '30px', overflowY: 'auto' }}
              >
                <Card>
                  <Box>
                    <Typography
                      sx={{ height: 95 }}
                      component="div"
                      align="center"
                      style={{ backgroundColor: '#002884', color: '#F0F2F5' }}
                    >
                      {/* विभाग/जिल्हा नाव */}
                      विभाग/जिल्हा
                    </Typography>

                    <Divider variant="middle" />
                  </Box>
                </Card>
              </Grid>
              <Grid item xs={24} sm={24} md={24} lg={2} xl={2}>
                <Card>
                  <Box>
                    <Typography
                      sx={{ height: 95 }}
                      component="div"
                      align="center"
                      style={{ backgroundColor: '#002884', color: '#F0F2F5' }}
                    >
                      जिल्ह्यांची संख्या
                    </Typography>

                    <Divider variant="middle" />
                  </Box>
                </Card>
              </Grid>
              <Grid item xs={24} sm={24} md={24} lg={3} xl={3}>
                <Card>
                  <Box>
                    <Typography
                      sx={{ height: 95 }}
                      component="div"
                      align="center"
                      style={{ backgroundColor: '#002884', color: '#F0F2F5' }}
                    >
                      तालुक्यांची संख्या
                    </Typography>

                    <Divider variant="middle" />
                  </Box>
                </Card>
              </Grid>
              <Grid item xs={24} sm={24} md={24} lg={3} xl={3}>
                <Card>
                  <Box>
                    <Typography
                      sx={{ height: 95 }}
                      component="div"
                      align="center"
                      style={{ backgroundColor: '#002884', color: '#F0F2F5' }}
                    >
                      एकूण गावांची संख्या
                    </Typography>

                    <Divider variant="middle" />
                  </Box>
                </Card>
              </Grid>
              <Grid item xs={24} sm={24} md={24} lg={3} xl={3}>
                <Card>
                  <Box>
                    <Typography
                      sx={{ height: 95 }}
                      component="div"
                      align="center"
                      style={{ backgroundColor: '#002884', color: '#F0F2F5' }}
                    >
                      {/* एकूण खातेदारांची संख्या */}
                      {/* ग. न . भरलेली माहिती */}
                      {/* डी.वाय.असं.आलं.आर यांनी आकारबंद भरण्यासाठी कामकाज सुरु केलेल्या गावांची संख्या */}
                      उप-अधीक्षक भूमिअभिलेख यांनी आकारबंद भरण्यासाठी कामकाज सुरु केलेल्या गावांची
                      संख्या
                    </Typography>

                    <Divider variant="middle" />
                  </Box>
                </Card>
              </Grid>
              <Grid item xs={24} sm={24} md={24} lg={3} xl={3}>
                <Card>
                  <Box>
                    <Typography
                      sx={{ height: 95 }}
                      component="div"
                      align="center"
                      style={{ backgroundColor: '#002884', color: '#F0F2F5' }}
                    >
                      {/* भाग - १ मधील गावांची संख्या */}
                      {/* 100 % मागणी निश्चिती केलेले गांव संख्या */}
                      आकारबंद पूर्ण भरून झालेल्या गावांची संख्या (%)
                    </Typography>

                    <Divider variant="middle" />
                  </Box>
                </Card>
              </Grid>
            </Grid>
            {/*--- Division grid tab 4 */}
            {tab4Detail &&
              tab4Detail.map((r, i) => {
                return (
                  <>
                    <Grid container spacing={1} columns={24} style={{ padding: '2px' }}>
                      <Grid
                        item
                        xs={24}
                        sm={24}
                        md={24}
                        lg={2}
                        xl={2}
                        style={{
                          cursor: 'pointer',
                          position: 'sticky!important',
                          top: '50px',
                          width: '100%',
                        }}
                      >
                        <Card>
                          <Box
                            sx={{
                              bgcolor: '#91ceff',
                              height: 50,
                            }}
                          >
                            <CardContent>
                              <h3
                                onClick={(e) => {
                                  if (
                                    showDistrict4 === true &&
                                    r.divisionCode === divisionCodeTab4
                                  ) {
                                    setshowDistrict4(false);
                                  } else {
                                    setshowSpin(true);
                                    setTab4Detail1([]);

                                    // setDivisionCode(r.divisionCode);
                                    setDivisionCodeTab4(r.divisionCode);
                                    setDistricts(r.districtCode);
                                    getTabD4etails1(r.divisionCode);
                                    setshowDistrict4(true);
                                  }
                                }}
                              >
                                {' '}
                                <u>{r.divisionName}</u> &nbsp;&nbsp;
                                {showSpin === true && r.divisionCode === divisionCodeTab4 && (
                                  <Spin indicator={antIcon} />
                                )}
                              </h3>
                            </CardContent>
                          </Box>
                        </Card>
                      </Grid>
                      {/* )} */}
                      <Grid item xs={24} sm={24} md={24} lg={2} xl={2}>
                        <Card>
                          <Box
                            sx={{
                              bgcolor: '#91ceff',
                              height: 50,
                            }}
                          >
                            <CardContent>
                              <center>
                                <h3>{r.districtsCount}</h3>
                              </center>
                            </CardContent>
                          </Box>
                        </Card>
                      </Grid>
                      <Grid item xs={24} sm={24} md={24} lg={3} xl={3}>
                        <Card>
                          <Box
                            sx={{
                              bgcolor: '#91ceff',
                              height: 50,
                            }}
                          >
                            <CardContent>
                              <center>
                                <h3>{r.totalTaluka}</h3>
                              </center>
                            </CardContent>
                          </Box>
                        </Card>
                      </Grid>
                      <Grid item xs={24} sm={24} md={24} lg={3} xl={3}>
                        <Card>
                          <Box
                            sx={{
                              bgcolor: '#91ceff',
                              height: 50,
                            }}
                          >
                            <CardContent>
                              <center>
                                <h3>{r.totalVillages}</h3>
                              </center>
                            </CardContent>
                          </Box>
                        </Card>
                      </Grid>
                      <Grid item xs={24} sm={24} md={24} lg={3} xl={3}>
                        <Card>
                          <Box
                            sx={{
                              bgcolor: '#91ceff',
                              height: 50,
                            }}
                          >
                            <CardContent>
                              <center>
                                <h3>{r.totalDyslrWorkCount}</h3>
                              </center>
                            </CardContent>
                          </Box>
                        </Card>
                      </Grid>
                      <Grid item xs={24} sm={24} md={24} lg={3} xl={3}>
                        <Card>
                          <Box
                            sx={{
                              bgcolor: '#91ceff',
                              height: 50,
                            }}
                          >
                            <CardContent>
                              <center>
                                <h3>{r.dyslrWorkCompletedCount}</h3>
                              </center>
                            </CardContent>
                          </Box>
                        </Card>
                      </Grid>
                    </Grid>
                    {/*---district grid tab 4 */}
                    {showDistrict4 === true && r.divisionCode === divisionCodeTab4 && (
                      <Grid container spacing={1} columns={24} style={{ padding: '2px' }}></Grid>
                    )}
                    {showDistrict4 === true &&
                      tab4Detail1.length !== 0 &&
                      r.divisionCode === divisionCodeTab4 &&
                      tab4Detail1.map((r, i) => {
                        return (
                          <>
                            <Grid container spacing={1} columns={24} style={{ padding: '2px' }}>
                              <Grid
                                item
                                xs={24}
                                sm={24}
                                md={24}
                                lg={2}
                                xl={2}
                                style={{ cursor: 'pointer' }}
                              >
                                <Card>
                                  <Box
                                    sx={{
                                      // bgcolor: '#91ceff',
                                      bgcolor: '#cce8ff',
                                      height: 50,
                                    }}
                                  >
                                    <CardContent>
                                      <h4
                                        onClick={(e) => {
                                          // alert('showtaluka');
                                          // console.log(
                                          //   showTalukafortab4,
                                          //   '----------showTalukafortab4Tab4',
                                          // );
                                          if (
                                            showTalukafortab4 === true &&
                                            r.districtCode === districtsCode
                                          ) {
                                            setshowTalukafortab4(false);
                                          } else {
                                            setshowSpin2(true);
                                            // setDashBoardDetail2([]);
                                            setDashBoardDetail2forTab4([]);
                                            setDivisionCode(r.divisionCode);
                                            setDistricts(r.districtCode);

                                            //for Taluka grid
                                            setTalukaCode(r.talukaCode);
                                            // getDashBoardDetails2(r.divisionCode, r.districtCode);
                                            // console.log(
                                            //   districtsCode,
                                            //   '-----------districtsCodeTab4',
                                            // );
                                            getDashBoardDetails2forTab4(
                                              r.divisionCode,
                                              r.districtCode,
                                            );
                                            setshowTalukafortab4(true);
                                          }
                                        }}
                                      >
                                        <u> {r.districtName}</u>

                                        {showSpin2 === true &&
                                          r.districtsCode === districtsCode && (
                                            <Spin indicator={antIcon} />
                                          )}
                                      </h4>
                                    </CardContent>
                                  </Box>
                                </Card>
                              </Grid>
                              <Grid item xs={24} sm={24} md={24} lg={2} xl={2}>
                                <Card>
                                  <Box
                                    sx={{
                                      bgcolor: '#cce8ff',
                                      height: 50,
                                    }}
                                  >
                                    <CardContent>
                                      <center>
                                        <h3>{r.districtsCount}</h3>
                                      </center>
                                    </CardContent>
                                  </Box>
                                </Card>
                              </Grid>
                              <Grid item xs={24} sm={24} md={24} lg={3} xl={3}>
                                <Card>
                                  <Box
                                    sx={{
                                      bgcolor: '#cce8ff',
                                      height: 50,
                                    }}
                                  >
                                    <CardContent>
                                      <center>
                                        <h3>{r.totalTaluka}</h3>
                                      </center>
                                    </CardContent>
                                  </Box>
                                </Card>
                              </Grid>
                              <Grid item xs={24} sm={24} md={24} lg={3} xl={3}>
                                <Card>
                                  <Box
                                    sx={{
                                      bgcolor: '#cce8ff',
                                      height: 50,
                                    }}
                                  >
                                    <CardContent>
                                      <center>
                                        <h3>{r.totalVillages}</h3>
                                      </center>
                                    </CardContent>
                                  </Box>
                                </Card>
                              </Grid>
                              <Grid item xs={24} sm={24} md={24} lg={3} xl={3}>
                                <Card>
                                  <Box
                                    sx={{
                                      bgcolor: '#cce8ff',
                                      height: 50,
                                    }}
                                  >
                                    <CardContent>
                                      <center>
                                        <h3>{r.totalDyslrWorkCount}</h3>
                                      </center>
                                    </CardContent>
                                  </Box>
                                </Card>
                              </Grid>
                              <Grid item xs={24} sm={24} md={24} lg={3} xl={3}>
                                <Card>
                                  <Box
                                    sx={{
                                      bgcolor: '#cce8ff',
                                      height: 50,
                                    }}
                                  >
                                    <CardContent>
                                      <center>
                                        <a
                                          onClick={() => {
                                            redirectToTotalPhase1Villages(
                                              r.districtName,
                                              r.districtCode,
                                              r.totalPhase1Villages,
                                            );
                                          }}
                                        >
                                          <h3>
                                            {r.dyslrWorkCompletedCount}
                                            {/* <u> 0</u> */}
                                          </h3>
                                        </a>
                                      </center>
                                    </CardContent>
                                  </Box>
                                </Card>
                              </Grid>
                            </Grid>
                            {/* Show Taluka Grid For tab4 */}

                            {showTalukafortab4 === true && r.districtCode === districtsCode && (
                              <Grid
                                container
                                spacing={1}
                                columns={24}
                                style={{ padding: '2px' }}
                              ></Grid>
                            )}

                            {showTalukafortab4 === true &&
                              dashBoardforTalukaTab4?.length !== 0 &&
                              r.districtCode === districtsCode &&
                              dashBoardforTalukaTab4?.map((r, i) => {
                                return (
                                  <>
                                    <Grid
                                      container
                                      spacing={1}
                                      columns={24}
                                      style={{ padding: '2px' }}
                                    >
                                      <Grid item xs={24} sm={24} md={24} lg={2} xl={2}>
                                        <Card>
                                          <Box
                                            sx={{
                                              // bgcolor: '#91ceff',
                                              bgcolor: '#F0F2F5',
                                              height: 50,
                                            }}
                                          >
                                            <CardContent>
                                              <h4>{r.talukaName}</h4>
                                            </CardContent>
                                          </Box>
                                        </Card>
                                      </Grid>
                                      <Grid item xs={24} sm={24} md={24} lg={2} xl={2}>
                                        <Card>
                                          <Box
                                            sx={{
                                              bgcolor: '#F0F2F5',
                                              height: 50,
                                            }}
                                          >
                                            <CardContent>
                                              <center>
                                                {/* <h3>{r.districtsCount}</h3> */}
                                                <h3>0</h3>
                                              </center>
                                            </CardContent>
                                          </Box>
                                        </Card>
                                      </Grid>
                                      <Grid item xs={24} sm={24} md={24} lg={3} xl={3}>
                                        <Card>
                                          <Box
                                            sx={{
                                              bgcolor: '#F0F2F5',
                                              height: 50,
                                            }}
                                          >
                                            <CardContent>
                                              <center>
                                                {/* <h3>{r.totalTaluka}</h3>
                                                 */}
                                                <h3>1</h3>
                                              </center>
                                            </CardContent>
                                          </Box>
                                        </Card>
                                      </Grid>
                                      <Grid item xs={24} sm={24} md={24} lg={3} xl={3}>
                                        <Card>
                                          <Box
                                            sx={{
                                              // bgcolor: '#F0F2F5',
                                              bgcolor: '#e4f4ff',
                                              height: 50,
                                            }}
                                          >
                                            <CardContent>
                                              <center>
                                                <h3>{r.totalVillages}</h3>
                                              </center>
                                            </CardContent>
                                          </Box>
                                        </Card>
                                      </Grid>
                                      <Grid item xs={24} sm={24} md={24} lg={3} xl={3}>
                                        <Card>
                                          <Box
                                            sx={{
                                              bgcolor: '#e4f4ff',
                                              height: 50,
                                            }}
                                          >
                                            <CardContent>
                                              <center>
                                                {/* <h3>{r.totalDyslrWorkCountForTaluka}</h3> */}
                                                <h3>
                                                  {r.totalDyslrWorkCount == 'null'
                                                    ? '0'
                                                    : r.totalDyslrWorkCount}
                                                </h3>
                                              </center>
                                            </CardContent>
                                          </Box>
                                        </Card>
                                      </Grid>
                                      <Grid item xs={24} sm={24} md={24} lg={3} xl={3}>
                                        <Card>
                                          <Box
                                            sx={{
                                              bgcolor: '#e4f4ff',
                                              height: 50,
                                            }}
                                          >
                                            <CardContent>
                                              <center>
                                                {/* <h3>{r.dyslrWorkCompletedCount}</h3> */}
                                                {/* <h3>{r.Finaltotal}</h3> */}
                                                {/* <h3>test</h3> */}
                                                <h3>
                                                  {Math.round(
                                                    (r.totalDyslrWorkCount * 100) / r.totalVillages,
                                                  )}
                                                </h3>
                                              </center>
                                            </CardContent>
                                          </Box>
                                        </Card>
                                      </Grid>
                                    </Grid>
                                  </>
                                );
                              })}
                          </>
                        );
                      })}

                    {/*--- एकूण district tab 4 */}
                    {showDistrict4 === true && r.divisionCode === divisionCodeTab4 && (
                      <div>
                        <Grid container spacing={1} columns={24}>
                          <Grid item xs={24} sm={24} md={24} lg={2} xl={2}>
                            <Card>
                              <Box
                                sx={{
                                  bgcolor: '#cce8ff',
                                  height: 50,
                                }}
                              >
                                <CardContent>
                                  <center>
                                    {/* <h3>एकूण t</h3> */}
                                    <h3>एकूण</h3>
                                  </center>
                                </CardContent>
                              </Box>
                            </Card>
                          </Grid>
                          <Grid item xs={24} sm={24} md={24} lg={2} xl={2}>
                            <Card>
                              <Box
                                sx={{
                                  bgcolor: '#cce8ff',
                                  height: 50,
                                }}
                              >
                                <CardContent>
                                  <center>
                                    <h3>{dashBoardCount1Tab4?.districtsCountTTI}</h3>
                                  </center>
                                </CardContent>
                              </Box>
                            </Card>
                          </Grid>
                          <Grid item xs={24} sm={24} md={24} lg={3} xl={3}>
                            <Card>
                              <Box
                                sx={{
                                  bgcolor: '#cce8ff',
                                  height: 50,
                                }}
                              >
                                <CardContent>
                                  <center>
                                    <h3>{dashBoardCount1Tab4?.totalTalukaTTI}</h3>
                                  </center>
                                </CardContent>
                              </Box>
                            </Card>
                          </Grid>
                          <Grid item xs={24} sm={24} md={24} lg={3} xl={3}>
                            <Card>
                              <Box
                                sx={{
                                  bgcolor: '#cce8ff',
                                  height: 50,
                                }}
                              >
                                <CardContent>
                                  <center>
                                    <h3> {dashBoardCount1Tab4?.totalVillagesTTI}</h3>
                                  </center>
                                </CardContent>
                              </Box>
                            </Card>
                          </Grid>
                          <Grid item xs={24} sm={24} md={24} lg={3} xl={3}>
                            <Card>
                              <Box
                                sx={{
                                  bgcolor: '#cce8ff',
                                  height: 50,
                                }}
                              >
                                <CardContent>
                                  <center>
                                    {/* <h3> {dashBoardCount1Tab4?.totalDyslrWorkCount}</h3> */}
                                    <h3> {dashBoardCount1Tab4?.totalDyslrWorkCountTTI}</h3>
                                  </center>
                                </CardContent>
                              </Box>
                            </Card>
                          </Grid>

                          <Grid item xs={24} sm={24} md={24} lg={3} xl={3}>
                            <Card>
                              <Box
                                sx={{
                                  bgcolor: '#cce8ff',
                                  height: 50,
                                }}
                              >
                                <CardContent>
                                  <center>
                                    {/* <h3>{totalCountdyslrWorkCompletedCount}</h3> */}
                                    <h3>
                                      {Math.round(
                                        dashBoardCount1Tab4?.totalCountdyslrWorkCompletedCountTTI,
                                      )}
                                    </h3>
                                  </center>
                                </CardContent>
                              </Box>
                            </Card>
                          </Grid>
                        </Grid>
                      </div>
                    )}
                  </>
                );
              })}
            {/*--- एकूण division tab 4 */}
            <Grid container spacing={1} columns={24} style={{ padding: '2px' }}>
              <Grid item xs={24} sm={24} md={24} lg={2} xl={2}>
                <Card>
                  <Box
                    sx={{
                      bgcolor: '#91ceff',
                      height: 50,
                    }}
                  >
                    <CardContent>
                      <center>
                        <h3>एकूण</h3>
                        {/* <h3>एकूण division 4</h3> */}
                      </center>
                    </CardContent>
                  </Box>
                </Card>
              </Grid>
              <Grid item xs={24} sm={24} md={24} lg={2} xl={2}>
                <Card>
                  <Box
                    sx={{
                      bgcolor: '#91ceff',
                      height: 50,
                    }}
                  >
                    <CardContent>
                      <center>
                        <h3>{dashBoardCountTab4?.districtsCountTT}</h3>
                      </center>
                    </CardContent>
                  </Box>
                </Card>
              </Grid>
              <Grid item xs={24} sm={24} md={24} lg={3} xl={3}>
                <Card>
                  <Box
                    sx={{
                      bgcolor: '#91ceff',
                      height: 50,
                    }}
                  >
                    <CardContent>
                      <center>
                        <h3>{dashBoardCountTab4?.totalTalukaTT}</h3>
                      </center>
                    </CardContent>
                  </Box>
                </Card>
              </Grid>
              <Grid item xs={24} sm={24} md={24} lg={3} xl={3}>
                <Card>
                  <Box
                    sx={{
                      bgcolor: '#91ceff',
                      height: 50,
                    }}
                  >
                    <CardContent>
                      <center>
                        <h3> {dashBoardCountTab4?.totalVillagesTT}</h3>
                      </center>
                    </CardContent>
                  </Box>
                </Card>
              </Grid>
              <Grid item xs={24} sm={24} md={24} lg={3} xl={3}>
                <Card>
                  <Box
                    sx={{
                      bgcolor: '#91ceff',
                      height: 50,
                    }}
                  >
                    <CardContent>
                      <center>
                        <h3> {dashBoardCountTab4?.totalDyslrWorkCountTT}</h3>
                      </center>
                    </CardContent>
                  </Box>
                </Card>
              </Grid>

              <Grid item xs={24} sm={24} md={24} lg={3} xl={3}>
                <Card>
                  <Box
                    sx={{
                      bgcolor: '#91ceff',
                      height: 50,
                    }}
                  >
                    <CardContent>
                      <center>
                        <h3>
                          {' '}
                          {Math.round(
                            dashBoardCountTab4?.totalCountdyslrWorkCompletedCountDivisionTT,
                          )}
                        </h3>
                      </center>
                    </CardContent>
                  </Box>
                </Card>
              </Grid>
              {/* <Grid item xs={24} sm={24} md={24} lg={2} xl={2}>
                <Card>
                  <Box
                    sx={{
                      bgcolor: '#91ceff',
                      height: 50,
                    }}
                  >
                    <CardContent>
                      <center>
                        <h3> {dashBoardCountTab4?.totalPhase1LoginT}</h3>
                      </center>
                    </CardContent>
                  </Box>
                </Card>
              </Grid> */}
              {/* <Grid item xs={24} sm={24} md={24} lg={3} xl={3}>
                <Card>
                  <Box
                    sx={{
                      bgcolor: '#91ceff',
                      height: 50,
                    }}
                  >
                    <CardContent>
                      <center>
                        <h3> {dashBoardCountTab4?.totalOnlineVillagesCount}</h3>
                      </center>
                    </CardContent>
                  </Box>
                </Card>
              </Grid> */}
              {/* <Grid item xs={24} sm={24} md={24} lg={3} xl={3}>
                <Card>
                  <Box
                    sx={{
                      bgcolor: '#91ceff',
                      height: 50,
                    }}
                  >
                    <CardContent>
                      <center>
                        <h3> {dashBoardCountTab4?.totalEntryT}</h3>
                      </center>
                    </CardContent>
                  </Box>
                </Card>
              </Grid> */}
            </Grid>
          </Paper>
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default IntroduceRow;
