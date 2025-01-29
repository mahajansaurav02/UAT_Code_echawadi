import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import emblem from './GOI Emblem.png';
import logo1 from './logo1.png';
import mahaMap from './mahaMap.png';
import maha_map from './maha_map.svg';

import styles from './homePage.module.css';
import { Col, Divider, Row } from 'antd';
import {
  AppBar,
  Box,
  Card,
  Button,
  CardActions,
  CardContent,
  CardMedia,
  Drawer,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Toolbar,
  Typography,
  CardActionArea,
  FormControl,
  TextField,
  MenuItem,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import InboxIcon from '@mui/icons-material/Inbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import Chart from 'react-apexcharts';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DescriptionIcon from '@mui/icons-material/Description';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import { Footer, Menu } from 'antd/lib/layout/layout';
import { useHistory } from 'react-router-dom';
import URLS from '@/URLs/urls';
import { FormattedMessage, useModel } from 'umi';
import useAxios from '@/components/eComponents/use-axios';
import axios from 'axios';
import AddSharpIcon from '@mui/icons-material/AddSharp';
import ViewStreamSharpIcon from '@mui/icons-material/ViewStreamSharp';

function HomePage(props) {
  const useStyles = makeStyles({
    card: {
      maxWidth: 345,
      borderRadius: 10,
      // transform: 'translate(-50%, -50%)',
      backgroundSize: '200%',
      boxShadow: '0 3px 5px 2px rgba(255,105,135, .3)',
      transition: '0.6s',
      backgroundImage: 'linear-gradient(45deg, #FFC312 ,#EE5A24, #00a8ff)',
      '&:hover': {
        backgroundPosition: 'right',
      },
    },

    card1: {
      maxWidth: 345,
      borderRadius: 10,
      // transform: 'translate(-50%, -50%)',
      backgroundSize: '200%',
      boxShadow: '0 3px 5px 2px rgba(255,105,135, .3)',
      transition: '0.6s',
      backgroundImage: 'linear-gradient(45deg, red, blue)', // linear-gradient(135deg, orange 60%, cyan);
      '&:hover': {
        backgroundPosition: 'right',
      },
    },

    card2: {
      maxWidth: 345,
      borderRadius: 10,
      // transform: 'translate(-50%, -50%)',
      backgroundSize: '200%',
      boxShadow: '0 3px 5px 2px rgba(255,105,135, .3)',
      transition: '0.6s',
      backgroundImage: 'linear-gradient(45deg, orange , cyan)', // linear-gradient(135deg, orange 60%, cyan);
      '&:hover': {
        backgroundPosition: 'right',
      },
    },

    paperRadius: {
      borderRadius: 10,
      marginTop: 20,
    },

    button1: {
      width: 260,
      height: 90,
      // backgroundSize: '200%',
      boxShadow: '0 3px 5px 2px rgba(255,105,135, .3)',
      transition: '0.6s',
      backgroundImage: 'linear-gradient(45deg,  #00a8ff)',
      '&:hover': {
        backgroundPosition: 'right',
      },
    },

    box1: {
      display: 'flex',
      WebkitBoxPack: 'center',
      justifyContent: 'center',
      WebkitBoxAlign: 'center',
      alignItems: 'center',
      width: ' 3rem',
      height: ' 3rem',
      marginLeft: '20px',
      marginTop: '-16px',
      opacity: 1,
      backgroundSize: '200%',
      boxShadow: '0 3px 5px 2px rgba(255,105,135, .3)',
      transition: '0.6s',
      backgroundImage: 'linear-gradient(45deg, #FFC312 ,#EE5A24, #00a8ff)',
      '&:hover': {
        backgroundPosition: 'right',
      },
      color: 'white',
      borderRadius: '0.75rem',
    },

    box2: {
      display: 'flex',
      WebkitBoxPack: 'center',
      justifyContent: 'center',
      WebkitBoxAlign: 'center',
      alignItems: 'center',
      width: ' 2rem',
      height: ' 2rem',
      marginLeft: '20px',
      marginTop: '-16px',
      opacity: 1,
      backgroundSize: '200%',
      boxShadow: '0 3px 5px 2px rgba(255,105,135, .3)',
      transition: '0.6s',
      backgroundImage: 'linear-gradient(45deg, #FFC312 ,#EE5A24, #00a8ff)',
      '&:hover': {
        backgroundPosition: 'right',
      },
      color: 'white',
      borderRadius: '0.75rem',
    },
  });

  const classes = useStyles();
  const [component, setComponent] = useState();
  const [khatedarNumber, setKhatedarNumber] = useState();
  const { districtName, talukaName, districtCode, talukaCode, villageData, revenueYear } =
    useModel('details');
  const [village, setVillage] = useState();
  const [revenueYearForVillage, setRevenueYearForVillage] = useState();
  const { sendRequest } = useAxios();
  const [totalKhatedar, setTotalKhatedar] = useState(0);
  const [AugPin1, setAugPin1] = useState(0);
  const [codeVillage, setCodeVillage] = useState('');
  const [revenueYear1, setRevenueYear] = useState();
  const [totalLiveKhatedar, setTotalLiveKhatedar] = useState(0);
  const [totalSurveyNumber, setTotalSurveyNumber] = useState(0);
  const [totalNetAmount, setTotalNetAmount] = useState(0);
  const [totalNetReceived, setTotalNetReceived] = useState(0);
  const [khatedarAmountReceived, setKhatedarAmountReceived] = useState(0);
  const [sankirnWith, setSankirnWith] = useState(0);
  const [sankirnWithOut, setSankirnWithOut] = useState(0);
  const [targetData, setTargetData] = useState(0);
  const [demandGenerated, setDemandGenerated] = useState(0);
  const [Wasulipatrakhatedar, setWasulipatrakhatedar] = useState(0);

  let history = useHistory();

  const handleOnChangeForVillage = async (e) => {
    setCodeVillage(e);
    // props.setCodeVillage(setCodeVillage());
    // props.setTextForVillage(event.label);
    // props.onVillageChange(false);
    // console.log('Name of Village ==>>', event.label, 'cCode==>>', value);
  };

  const handleOnChangeForRevenueYear = async (e) => {
    setRevenueYear(e);
  };

  // useEffect(() => {
  //   var myArray = [{}];
  //   localStorage.setItem('villageData1', JSON.stringify(myArray));
  //   var myRevenue = [{}];
  //   localStorage.setItem('revenueYear1', JSON.stringify(myRevenue));
  // }, []);

  useEffect(() => {
    if ((codeVillage, revenueYear1)) {
      TotalLiveKhatedar();
      TotalLiveDemandDetails();
      getTargetData();
    }
  }, [codeVillage, revenueYear1]);

  // useEffect(() => {
  //   if (revenueYear1) {
  //     TotalLiveDemandDetails();
  //   }
  // }, [revenueYear1]);

  const TotalLiveKhatedar = async () => {
    const talukCode = JSON.parse(localStorage.getItem('talukaCode'));
    sendRequest(
      //---15 March only api change
      //`${URLS.BaseURL}/restservice/getDashBoardKhataNoDetails?cCode=${codeVillage}`,
      `${URLS.BaseURL}/restservice/getDashBoardKhataNoDetails?cCode=${codeVillage}&talukaCode=${talukCode}`,
      'GET',
      null,
      (res) => {
        // setTotalLiveKhatedar(
        //   res.data.form7KhataData[0].khataNo,
        //   // pin: r.pin,
        // );
        // setTotalSurveyNumber(res.data.form7KhataData[0].pin);
        // setTotalKhatedar(res.data.form7KhataDataAug[0].khataNo);
        // setAugPin1(res.data.form7KhataDataAug[0].pin);
        // console.log('data for live khatedar', res);
        // setWasulipatrakhatedar(res.data.khatedarPatra[0].netAmount1);

        setTotalLiveKhatedar(
          res.data.form7KhataData[0].khataNo,
          // pin: r.pin,
        );
        setTotalSurveyNumber(res.data.form7KhataData[0].pin);
        setTotalKhatedar(res.data.form7KhataDataAug[0].khataNo);
        setAugPin1(res.data.form7KhataDataAug[0].pin);
        setWasulipatrakhatedar(res.data.khatedarPatra[0].netAmount1);
      },
    );
  };

  const TotalLiveDemandDetails = async () => {
    sendRequest(
      `${URLS.BaseURL}/restservice/getDashBoardTotalDemandDetails?cCode=${codeVillage}&revenueYear=${revenueYear1}`,
      'GET',
      null,
      (res) => {
        setTotalNetAmount(res.data.landRevenueDemandData[0].netAmount);
        setTotalNetReceived(res.data.landRevenueDemandData[0].netReceived);
        setKhatedarAmountReceived(res.data.landRevenueDemandData[0].khataNo);
        setSankirnWith(res.data.landRevenueDemandData[0].totalOfWithSankirn);
        setSankirnWithOut(res.data.landRevenueDemandData[0].totalOfWithuotSankirn);
        //setDemandGenerated(res.data.landRevenueDemandData[0].demandGeneratedKhataNo); 15 March 2024
        setDemandGenerated(res.data.demandGenerated[0].demandGenerated); //--15 March 2024
      },
    );
  };

  const getTargetData = async () => {
    sendRequest(
      `${URLS.BaseURL}/restservice/getVillageTarget?cCode=${codeVillage}&revenueYear=${revenueYear1}`,
      'GET',
      null,
      (res) => {
        setTargetData(res.data.talathiDashBoardData[0].annualVillageTarget);
      },
    );
  };

  const handleOnChange = () => {
    history.push({
      pathname: `/form/village-form-17/village-form`,
    });
  };

  const handleOnChangeForOTE = () => {
    history.push({
      pathname: `/generate-revenue/one-time-data-entry/village-form`,
    });
  };

  const handleOnChangeForDemand = () => {
    history.push({
      pathname: `/transactions/demandNotificationBefore15Jan`,
    });
  };

  const handleOnChangeReceipts = () => {
    history.push({
      pathname: `/transactions/receive-money`,
    });
  };

  const handleOnChangeForChallanGeneration = () => {
    history.push({
      pathname: `/transactions/generate-challan`,
    });
  };

  const handleOnChangeForReceiptReport = () => {
    history.push({
      pathname: `/reports/receipt-reports`,
    });
  };

  useEffect(() => {
    // getDataVillage();
    setVillage(
      villageData?.map((row) => ({
        label: row.villageName,
        value: row.cCode,
      })),
    );
  }, []);

  useEffect(() => {
    //getYearForVillage();
    setRevenueYearForVillage(
      revenueYear?.map((row) => ({
        label: row.revenueYear,
        value: row.revenueYear,
      })),
    );
  }, []);

  return (
    // <>
    //   <Row>
    //     <Col span={8}>
    //       <img src={logo1} style={{ width: '100px', height: '100px' }}></img>
    //     </Col>
    //     <Col span={8}>
    //       <h2 style={{ textAlign: 'center' }}>
    //         <b>
    //           <FormattedMessage id="homepage.page.echawdi" />
    //         </b>
    //       </h2>
    //       <h2 style={{ textAlign: 'center' }}>
    //         <FormattedMessage id="homepage.page.goi" />
    //       </h2>
    //     </Col>
    //     <Col span={8}>
    //       <img src={emblem} style={{ width: '90px', float: 'right', marginLeft: '640px' }}></img>
    //     </Col>
    //   </Row>
    //   <Row>
    //     <Col xs={4} sm={4} md={4} lg={4}></Col>
    //     <Col xs={18} sm={18} md={18} lg={18}>
    //       <img src={maha_map} style={{ width: '900px', height: '400px' }}></img>
    //     </Col>
    //   </Row>
    // </>

    <>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          // backgroundColor: 'white',
        }}
      >
        <Card
          elevation={10}
          // sx={{ minWidth: 1000 }}
          style={{
            padding: 10,
            height: '163vh',
            width: 1000,
            margin: '20px auto',
          }}
        >
          <Grid container spacing={2} columns={24}>
            <Grid item xs={24} sm={24} md={6} lg={6} xl={6}>
              <FormControl sx={{ m: 1, width: 230 }}>
                <TextField
                  id="outlined-select-currency"
                  // select
                  size="small"
                  multiple
                  disabled
                  defaultValue={districtName}
                  // onChange={(e) => handleOnChangeDistrict(e.target.value)}
                  //input={<OutlinedInput label="Name" />}
                  label="जिल्हा"
                />
              </FormControl>
            </Grid>
            <Grid item xs={24} sm={24} md={6} lg={6} xl={6}>
              <FormControl sx={{ m: 1, width: 230 }}>
                <TextField
                  id="outlined-select-currency"
                  // select
                  size="small"
                  multiple
                  disabled
                  defaultValue={talukaName}
                  // onChange={(e) => handleOnChangeDistrict(e.target.value)}
                  //input={<OutlinedInput label="Name" />}
                  label="तालुका"
                ></TextField>
              </FormControl>
            </Grid>
            <Grid item xs={24} sm={24} md={6} lg={6} xl={6}>
              <FormControl sx={{ m: 1, width: 230 }}>
                <TextField
                  id="outlined-select-currency"
                  select
                  size="small"
                  multiple
                  value={village}
                  onChange={(e) => handleOnChangeForVillage(e.target.value)}
                  // onSelect={(value, event) => handleOnChangeForVillage(value, event)}
                  //input={<OutlinedInput label="Name" />}
                  label="गाव"
                >
                  {village &&
                    village.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                </TextField>
              </FormControl>
            </Grid>
            <Grid item xs={24} sm={24} md={6} lg={6} xl={6}>
              <FormControl sx={{ m: 1, width: 230 }}>
                <TextField
                  id="outlined-select-currency"
                  select
                  size="small"
                  multiple
                  value={revenueYearForVillage}
                  onChange={(e) => handleOnChangeForRevenueYear(e.target.value)}
                  // onSelect={(value, event) => handleOnChangeForVillage(value, event)}
                  //input={<OutlinedInput label="Name" />}
                  label="महसूल वर्ष"
                >
                  {revenueYearForVillage &&
                    revenueYearForVillage.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                </TextField>
              </FormControl>
            </Grid>
          </Grid>
          <Grid container spacing={2} columns={24}>
            <Grid item xs={24} sm={24} md={8} lg={8} xl={8}>
              <Card className={classes.card}>
                <Typography gutterBottom variant="h5" component="div">
                  <center>एकूण खातेदार संख्या</center>
                </Typography>
                {/* <CardActions>
                  <Button size="small" color="primary">
                    Share
                  </Button>
                </CardActions> */}
              </Card>

              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  '& > :not(style)': {
                    m: 1,
                    width: 142,
                    height: 128,
                  },
                }}
              >
                <Paper style={{ marginTop: '20px' }} elevation={3} className={classes.paperRadius}>
                  <Box className={classes.box1}>
                    <DescriptionIcon />
                  </Box>
                  <Row>
                    <Col xl={24} lg={24} md={18} sm={18} xs={18}>
                      <center>
                        <h4 style={{ padding: '5px' }}>
                          <b>०१ ऑगस्ट २०२३ रोजी </b>
                        </h4>
                      </center>
                      <center style={{ marginBottom: '30px' }}>
                        <h1 style={{ fontSize: '2.5em' }}>{totalKhatedar}</h1>
                      </center>
                    </Col>
                  </Row>
                </Paper>
                <Paper style={{ marginTop: '20px' }} elevation={3} className={classes.paperRadius}>
                  <Box className={classes.box1}>
                    <DescriptionIcon />
                  </Box>
                  <Row>
                    <Col xl={24} lg={24} md={18} sm={18} xs={18}>
                      <center>
                        <h3 style={{ padding: '5px' }}>
                          <b>आजची संख्या </b>
                        </h3>
                      </center>
                      <center style={{ marginBottom: '30px' }}>
                        <h1 style={{ fontSize: '2.5em' }}>{totalLiveKhatedar}</h1>
                      </center>
                    </Col>
                  </Row>
                </Paper>
              </Box>
            </Grid>
            <Grid item xs={24} sm={24} md={8} lg={8} xl={8}>
              <Card className={classes.card1}>
                <Typography gutterBottom variant="h5" component="div">
                  <center> एकूण ७/१२ संख्या</center>
                </Typography>
                {/* <CardActions>
                  <Button size="small" color="primary">
                    Share
                  </Button>
                </CardActions> */}
              </Card>
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  '& > :not(style)': {
                    m: 1,
                    width: 142,
                    height: 128,
                  },
                }}
              >
                <Paper style={{ marginTop: '20px' }} elevation={3} className={classes.paperRadius}>
                  <Box className={classes.box1}>
                    <NoteAltIcon />
                  </Box>
                  <Row>
                    <Col xl={24} lg={24} md={18} sm={18} xs={18}>
                      <center>
                        <h4 style={{ padding: '5px' }}>
                          <b>०१ ऑगस्ट २०२३ रोजी</b>
                        </h4>
                      </center>
                      <center style={{ marginBottom: '30px' }}>
                        <h1 style={{ fontSize: '2.5em' }}>{AugPin1}</h1>
                      </center>
                    </Col>
                  </Row>
                </Paper>
                <Paper style={{ marginTop: '20px' }} elevation={3} className={classes.paperRadius}>
                  <Box className={classes.box1}>
                    <NoteAltIcon />
                  </Box>
                  <Row>
                    <Col xl={24} lg={24} md={18} sm={18} xs={18}>
                      <center>
                        <h3 style={{ padding: '5px' }}>
                          <b>आजची संख्या </b>
                        </h3>
                      </center>
                      <center style={{ marginBottom: '30px' }}>
                        <h1 style={{ fontSize: '2.5em' }}>{totalSurveyNumber}</h1>
                      </center>
                    </Col>
                  </Row>
                </Paper>
              </Box>
            </Grid>
            <Grid item xs={24} sm={24} md={8} lg={8} xl={8}>
              <Card className={classes.card2}>
                <Typography gutterBottom variant="h5" component="div">
                  <center> वसुली </center>
                </Typography>
                {/* <CardActions>
                  <Button size="small" color="primary">
                    Share
                  </Button>
                </CardActions> */}
              </Card>
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  '& > :not(style)': {
                    m: 1,
                    width: 142,
                    height: 128,
                  },
                }}
              >
                <Paper style={{ marginTop: '20px' }} elevation={3} className={classes.paperRadius}>
                  <Row>
                    <Col xl={14} lg={14} md={14} sm={14} xs={14}>
                      <Box className={classes.box1}>
                        <CurrencyRupeeIcon />
                      </Box>
                    </Col>
                    <Col xl={8} lg={8} md={8} sm={8} xs={8}>
                      <h4>
                        <b> प्रपत्र-अ</b>
                      </h4>
                    </Col>
                  </Row>
                  <Row>
                    <Col xl={24} lg={24} md={18} sm={18} xs={18}>
                      <center>
                        <h3 style={{ padding: '5px' }}>
                          <b>जमाबंदी प्रमाणे</b>
                        </h3>
                      </center>
                      <center style={{ marginBottom: '30px' }}>
                        <h1 style={{ fontSize: '2.5em' }}>{totalNetAmount}</h1>
                      </center>
                    </Col>
                  </Row>
                </Paper>
                <Paper style={{ marginTop: '20px' }} elevation={3} className={classes.paperRadius}>
                  <Row>
                    <Col xl={14} lg={14} md={14} sm={14} xs={14}>
                      <Box className={classes.box1}>
                        <CurrencyRupeeIcon />
                      </Box>
                    </Col>
                    <Col xl={8} lg={8} md={8} sm={8} xs={8}>
                      <h4>
                        <b> प्रपत्र-अ</b>
                      </h4>
                    </Col>
                  </Row>
                  <Row>
                    <Col xl={24} lg={24} md={18} sm={18} xs={18}>
                      <center>
                        <h3 style={{ padding: '5px' }}>
                          <b>उद्दिष्ट</b>
                        </h3>
                      </center>
                      <center style={{ marginBottom: '30px' }}>
                        <h1 style={{ fontSize: '2.5em' }}>{targetData}</h1>
                      </center>
                    </Col>
                  </Row>
                </Paper>
              </Box>
            </Grid>
          </Grid>
          <Card
            elevation={10}
            style={{
              padding: 10,
              // height: '68vh',
              width: 910,
              margin: '20px auto',
            }}
          >
            <Row>
              {/* <Col xl={12} lg={12} md={12} sm={12} xs={12}> */}
              <Col xl={8} lg={8} md={8} sm={8} xs={8}>
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    '& > :not(style)': {
                      m: 1,
                      width: 432,
                      height: 128,
                    },
                  }}
                >
                  <Paper
                    /* style={{ marginTop: '70px' }} */ elevation={3}
                    className={classes.paperRadius}
                  >
                    <Box className={classes.box1}>
                      <DescriptionIcon />
                    </Box>
                    <Row>
                      <Col xl={24} lg={24} md={18} sm={18} xs={18}>
                        <h3 style={{ padding: '5px' }}>
                          <b>मागणी निश्चित केलेली खातेदार संख्या</b>
                        </h3>
                        <center>
                          <h1 style={{ fontSize: '2.5em' }}> {demandGenerated}</h1>
                        </center>
                      </Col>
                    </Row>
                  </Paper>
                </Box>
              </Col>

              <Col xl={8} lg={8} md={8} sm={8} xs={8}>
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    '& > :not(style)': {
                      m: 1,
                      width: 432,
                      height: 128,
                    },
                  }}
                >
                  <Paper
                    /* style={{ marginTop: '70px' }} */ elevation={3}
                    className={classes.paperRadius}
                  >
                    <Box className={classes.box1}>
                      <DescriptionIcon />
                    </Box>
                    <Row>
                      <Col xl={24} lg={24} md={18} sm={18} xs={18}>
                        <h3 style={{ padding: '5px' }}>
                          {/* <b>मागणी निश्चित केलेले गांव संख्या </b> */}
                          <b>वसुली पात्र खातेदार संख्या</b>
                        </h3>
                        <center>
                          <h1 style={{ fontSize: '2.5em' }}> {Wasulipatrakhatedar}</h1>
                        </center>
                      </Col>
                    </Row>
                  </Paper>
                </Box>
              </Col>

              {/* <Col xl={12} lg={12} md={12} sm={12} xs={12}> */}
              <Col xl={8} lg={8} md={8} sm={8} xs={8}>
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    '& > :not(style)': {
                      m: 1,
                      width: 242,
                      height: 128,
                    },
                  }}
                >
                  <Paper
                    // style={{ marginTop: '70px' }}
                    elevation={3}
                    className={classes.paperRadius}
                  >
                    <Box className={classes.box1}>
                      <DescriptionIcon />
                    </Box>
                    <Row>
                      <Col xl={24} lg={24} md={18} sm={18} xs={18}>
                        <h3 style={{ padding: '5px' }}>
                          <b>वसुली पूर्ण खातेदार संख्या</b>
                        </h3>
                        <center style={{ marginBottom: '30px' }}>
                          <h1 style={{ fontSize: '2.5em' }}>{khatedarAmountReceived}</h1>
                        </center>
                      </Col>
                    </Row>
                  </Paper>
                </Box>
              </Col>
            </Row>

            <Grid container spacing={2} columns={25}>
              <Grid item xs={24} sm={24} md={12} lg={12} xl={12}>
                {totalLiveKhatedar === 0 ? (
                  <div>
                    <Chart
                      type="donut"
                      width={480}
                      height={250}
                      series={[50, 50]}
                      options={{
                        labels: [
                          'मागणी निश्चित झालेली खातेदार संख्या % मध्ये',
                          'मागणी निश्चित न झालेली खातेदार संख्या % मध्ये',
                        ],
                        // chart: {
                        //   background: '#f00',
                        // },
                        plotOptions: {
                          pie: {
                            donut: {
                              labels: {
                                show: true,
                                total: {
                                  show: true,
                                  // fontSize:20
                                  color: 'red',
                                },
                              },
                            },
                          },
                        },
                        // title: {
                        //   text: 'वसुली',
                        // },
                        colors: ['#33FF99', '#f00'],
                      }}
                    />
                  </div>
                ) : (
                  <div>
                    <Chart
                      type="donut"
                      width={480}
                      height={250}
                      series={[
                        parseInt(demandGenerated),
                        parseInt(totalLiveKhatedar - demandGenerated),
                      ]}
                      options={{
                        labels: [
                          'मागणी निश्चित झालेली खातेदार संख्या % मध्ये',
                          'मागणी निश्चित न झालेली खातेदार संख्या % मध्ये',
                        ],
                        // chart: {
                        //   background: '#f00',
                        // },
                        plotOptions: {
                          pie: {
                            donut: {
                              labels: {
                                show: true,
                                total: {
                                  show: true,
                                  // fontSize:20
                                  color: 'red',
                                },
                              },
                            },
                          },
                        },
                        // title: {
                        //   text: 'वसुली',
                        // },
                        // colors: ['#ffffff', '#f00'],
                        colors: ['#33FF99', '#f00'],
                      }}
                    />
                  </div>
                )}
              </Grid>
              <Grid item xs={24} sm={24} md={8} lg={8} xl={8}>
                {totalLiveKhatedar === 0 ? (
                  <div>
                    <Chart
                      type="donut"
                      width={480}
                      height={250}
                      series={[50, 50]}
                      options={{
                        labels: [
                          'वसुली पूर्ण झालेली खातेदार संख्या % मध्ये',
                          'वसुली पूर्ण न झालेली खातेदार संख्या % मध्ये',
                        ],
                        // chart: {
                        //   background: '#f00',
                        // },
                        plotOptions: {
                          pie: {
                            donut: {
                              labels: {
                                show: true,
                                total: {
                                  show: true,
                                  // fontSize:20
                                  color: 'red',
                                },
                              },
                            },
                          },
                        },
                        // title: {
                        //   text: 'वसुली',
                        // },
                        // colors: ['#ffffff', '#f00'],
                        colors: ['#33FF99', '#f00'],
                      }}
                    />
                  </div>
                ) : (
                  <div>
                    <Chart
                      type="donut"
                      width={480}
                      height={250}
                      series={[
                        parseInt(khatedarAmountReceived),
                        parseInt(totalLiveKhatedar - khatedarAmountReceived),
                      ]}
                      options={{
                        labels: [
                          'वसुली पूर्ण झालेली खातेदार संख्या % मध्ये',
                          'वसुली पूर्ण न झालेली खातेदार संख्या % मध्ये',
                        ],
                        // chart: {
                        //   background: '#f00',
                        // },
                        plotOptions: {
                          pie: {
                            donut: {
                              labels: {
                                show: true,
                                total: {
                                  show: true,
                                  // fontSize:20
                                  color: 'red',
                                },
                              },
                            },
                          },
                        },
                        // title: {
                        //   text: 'वसुली',
                        // },
                        // colors: ['#ffffff', '#f00'],

                        colors: ['#33FF99', '#f00'],
                      }}
                    />
                  </div>
                )}
              </Grid>
            </Grid>
          </Card>
          <Card
            elevation={10}
            style={{
              padding: 10,
              height: '61vh',
              width: 900,
              margin: '20px auto',
            }}
          >
            <Row>
              <Col xl={7} lg={7} md={7} sm={8} xs={8}>
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    '& > :not(style)': {
                      m: 1,
                      width: 242,
                      height: 128,
                    },
                  }}
                >
                  <Paper
                    /* style={{ marginTop: '70px' }} */ elevation={3}
                    className={classes.paperRadius}
                  >
                    <Box className={classes.box1}>
                      <CurrencyRupeeIcon />
                    </Box>
                    <Row>
                      <Col xl={24} lg={24} md={18} sm={18} xs={18}>
                        <h3 style={{ padding: '5px' }}>
                          <b> वसूल झालेली रक्कम</b>
                        </h3>
                        <center>
                          <h1 style={{ fontSize: '2.5em' }}> {totalNetReceived}</h1>
                        </center>
                      </Col>
                    </Row>
                  </Paper>
                </Box>
              </Col>
              <Col xl={1} lg={1} md={1} sm={1} xs={1}>
                <ViewStreamSharpIcon sx={{ fontSize: 35, marginTop: '50px' }} />
              </Col>
              <Col xl={7} lg={7} md={7} sm={8} xs={8}>
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    '& > :not(style)': {
                      m: 1,
                      width: 242,
                      height: 128,
                    },
                  }}
                >
                  <Paper
                    /* style={{ marginTop: '70px' }} */ elevation={3}
                    className={classes.paperRadius}
                  >
                    <Box className={classes.box1}>
                      <CurrencyRupeeIcon />
                    </Box>
                    <Row>
                      <Col xl={24} lg={24} md={18} sm={18} xs={18}>
                        <h4 style={{ padding: '5px' }}>
                          <b>जमीन व इतर महसूल (संकीर्ण वगळता)</b>
                        </h4>
                        <center>
                          <h1 style={{ fontSize: '2.5em' }}> {sankirnWithOut}</h1>
                        </center>
                      </Col>
                    </Row>
                  </Paper>
                </Box>
              </Col>
              <Col xl={1} lg={1} md={1} sm={1} xs={1}>
                <AddSharpIcon sx={{ fontSize: 40, marginTop: '50px' }} />
              </Col>
              <Col xl={7} lg={7} md={7} sm={8} xs={8}>
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    '& > :not(style)': {
                      m: 1,
                      width: 242,
                      height: 128,
                    },
                  }}
                >
                  <Paper
                    /* style={{ marginTop: '70px' }} */ elevation={3}
                    className={classes.paperRadius}
                  >
                    <Box className={classes.box1}>
                      <CurrencyRupeeIcon />
                    </Box>
                    <Row>
                      <Col xl={24} lg={24} md={18} sm={18} xs={18}>
                        <h3 style={{ padding: '5px' }}>
                          <b>संकीर्ण महसूल</b>
                        </h3>
                        <center>
                          <h1 style={{ fontSize: '2.5em' }}> {sankirnWith}</h1>
                        </center>
                      </Col>
                    </Row>
                  </Paper>
                </Box>
              </Col>
            </Row>
            <Grid container spacing={2} columns={24}>
              <Grid item xs={24} sm={24} md={12} lg={12} xl={12}>
                {totalNetAmount === 0 ? (
                  <div style={{ marginTop: '20px' }}>
                    <Chart
                      type="pie"
                      width={450}
                      height={250}
                      series={[50, 50]}
                      options={{
                        labels: [
                          'वसुली पूर्ण झालेली रक्कम % मध्ये',
                          'वसुली पूर्ण न झालेली रक्कम % मध्ये',
                        ],
                        tooltip: {
                          y: {
                            formatter: (val) => {
                              return `₹${val}`;
                            },
                          },
                        },
                        plotOptions: {
                          pie: {
                            donut: {
                              labels: {
                                show: true,
                                // total: {
                                //   show: true,
                                // },
                              },
                            },
                          },
                        },
                        title: {
                          text: 'Against उद्दिष्ट',
                        },
                        colors: ['#33FF99', '#f00'],
                      }}
                    />
                  </div>
                ) : (
                  <div style={{ marginTop: '20px' }}>
                    <Chart
                      type="pie"
                      width={450}
                      height={250}
                      series={[parseInt(totalNetReceived), parseInt(targetData - totalNetReceived)]}
                      options={{
                        labels: [
                          'वसुली पूर्ण झालेली रक्कम % मध्ये',
                          'वसुली पूर्ण न झालेली रक्कम % मध्ये',
                        ],
                        tooltip: {
                          y: {
                            formatter: (val) => {
                              return `₹${val}`;
                            },
                          },
                        },
                        plotOptions: {
                          pie: {
                            donut: {
                              labels: {
                                show: true,
                                // total: {
                                //   show: true,
                                // },
                              },
                            },
                          },
                        },
                        title: {
                          text: 'Against Target',
                        },
                        colors: ['#33FF99', '#f00'],
                      }}
                    />
                  </div>
                )}
              </Grid>
              <Grid item xs={24} sm={24} md={8} lg={8} xl={8}>
                {totalNetAmount === 0 ? (
                  <div style={{ marginTop: '20px' }}>
                    <Chart
                      type="pie"
                      width={450}
                      height={250}
                      series={[50, 50]}
                      options={{
                        labels: [
                          'वसुली पूर्ण झालेली रक्कम % मध्ये',
                          'वसुली पूर्ण न झालेली रक्कम % मध्ये',
                        ],
                        tooltip: {
                          y: {
                            formatter: (val) => {
                              return `₹${val}`;
                            },
                          },
                        },
                        plotOptions: {
                          pie: {
                            donut: {
                              labels: {
                                show: true,
                                // total: {
                                //   show: true,
                                // },
                              },
                            },
                          },
                        },
                        title: {
                          text: 'Against जमाबंदी',
                        },
                        colors: ['#33FF99', '#f00'],
                      }}
                    />
                  </div>
                ) : (
                  <div style={{ marginTop: '20px' }}>
                    <Chart
                      type="pie"
                      width={450}
                      height={250}
                      series={[
                        parseInt(totalNetReceived),
                        parseInt(totalNetAmount - totalNetReceived),
                      ]}
                      options={{
                        labels: [
                          'वसुली पूर्ण झालेली रक्कम % मध्ये',
                          'वसुली पूर्ण न झालेली रक्कम % मध्ये',
                        ],
                        tooltip: {
                          y: {
                            formatter: (val) => {
                              return `₹${val}`;
                            },
                          },
                        },
                        plotOptions: {
                          pie: {
                            donut: {
                              labels: {
                                show: true,
                                // total: {
                                //   show: true,
                                // },
                              },
                            },
                          },
                        },
                        title: {
                          text: 'Against जमाबंदी',
                        },
                        colors: ['#33FF99', '#f00'],
                      }}
                    />
                  </div>
                )}
              </Grid>
            </Grid>
          </Card>
        </Card>
        <FormProvider /* {...methods} */>
          <form>
            <div className="demo-wrap">
              <Paper
                // className="echawdiLogo"
                elevation={10}
                style={{
                  padding: 20,
                  height: '163vh',
                  width: 300,
                  margin: '20px auto',
                }}
              >
                <Button
                  onClick={handleOnChange}
                  className={classes.button1}
                  variant="contained"
                  size="large"
                >
                  संकीर्ण महसूल
                </Button>
                <Button
                  style={{ marginTop: '35px' }}
                  onClick={handleOnChangeForOTE}
                  className={classes.button1}
                  variant="contained"
                  size="large"
                >
                  थकबाकी भरणे
                </Button>
                <Button
                  style={{ marginTop: '35px' }}
                  onClick={handleOnChangeForDemand}
                  className={classes.button1}
                  variant="contained"
                  size="large"
                >
                  मागणी तपशील
                </Button>
                <Button
                  style={{ marginTop: '35px' }}
                  onClick={handleOnChangeReceipts}
                  className={classes.button1}
                  variant="contained"
                  size="large"
                >
                  पावती तयार करा
                </Button>
                <Button
                  style={{ marginTop: '35px' }}
                  onClick={handleOnChangeForChallanGeneration}
                  className={classes.button1}
                  variant="contained"
                  size="large"
                >
                  चलन तयार करा
                </Button>
                <Button
                  style={{ marginTop: '35px' }}
                  onClick={handleOnChangeForReceiptReport}
                  className={classes.button1}
                  variant="contained"
                  size="large"
                >
                  पावत्या पहा
                </Button>
              </Paper>
            </div>
          </form>
        </FormProvider>
      </Box>
      {/* <Box
        sx={{
          width: 1000,
          height: 500,
          // display: 'flex',
          // flexWrap: 'wrap',
          backgroundColor: 'white',
        }}
      /> */}
    </>
  );
}

export default HomePage;
