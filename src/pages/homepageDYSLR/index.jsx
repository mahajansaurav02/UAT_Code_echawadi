import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import emblem from './GOI Emblem.png';
import logo1 from './logo1.png';
import mahaMap from './mahaMap.png';
import maha_map from './maha_map.svg';
import Rating from './rating';

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

function HomepageDYSLR(props) {
  let arry = [
    {
      name: 'list1',
      star: 1,
    },
    {
      name: 'list2',
      star: 0,
    },
    {
      name: 'list3',
      star: 2,
    },
  ];

  const [ratinglist, setratinglist] = useState(arry);
  // alert('FFFF');
  console.log(ratinglist, 'arry');

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
    sendRequest(
      `${URLS.BaseURL}/restservice/getDashBoardKhataNoDetails?cCode=${codeVillage}`,
      'GET',
      null,
      (res) => {
        setTotalLiveKhatedar(
          res.data.form7KhataData[0].khataNo,
          // pin: r.pin,
        );
        setTotalSurveyNumber(res.data.form7KhataData[0].pin);
        // console.log('data for live khatedar', totalLiveKhatedar);
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
        setDemandGenerated(res.data.landRevenueDemandData[0].demandGeneratedKhataNo);
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
        ></Card>
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

export default HomepageDYSLR;
