import { InfoCircleOutlined } from '@ant-design/icons';
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
  const [dashBoardCount, setDashBoardCount] = useState();
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
  const [districts, setDistricts] = useState();
  const [divisionCode, setDivisionCode] = useState();
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

  let history = useHistory();

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
    getDashBoardTotalCount();
  }, [divisionCode]);

  // useEffect(() => {
  //   getDashBoardTotalCount();
  // }, [divisionCode]);

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
        content: 'सदर अहवालसाठी आपण पात्र नाही',
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

  const getDashBoardDetails = async () => {
    sendRequest(
      `${URLS.AuthURL}/adminDashboard?divisionCode=${
        divisionCode === undefined ? '' : divisionCode
      }`,
      'POST',
      null,
      (res) => {
        setDashBoardDetail(
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

  const getDashBoardTotalCount = async () => {
    setIsLoading(true);
    setOpen(!open);
    sendRequest(
      `${URLS.AuthURL}/getDivisionCount?divisionCode=${
        divisionCode === undefined ? '' : divisionCode
      }`,
      'POST',
      null,
      (r) => {
        setDashBoardCount({
          districtsCount: r.data.districtsCount,
          totalEntryT: r.data.totalEntry,
          totalPhase1LoginT: r.data.totalPhase1Login,
          totalPhase1VillagesT: r.data.totalPhase1Villages,
          totalTalukaT: r.data.totalTaluka,
          totalVillagesT: r.data.totalVillages,
          totalKhataNumberT: r.data.totalKhataNumbers,
          totalOnlineVillagesCount: r.data.totalOnlineVillagesCount,
        });
        getDashBoardDetails();
      },
    );
  };

  const redirectToReport = async (districtName, districtCode) => {
    // console.log('district Nmae', districtName);
    history.push({
      pathname: `/reports/All-Village-Search-Data`,
      state: {
        district: districtName,
        districtCode: districtCode,
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

  return (
    <div>
      <Card className={styles.Footercard}>
        <Grid container spacing={1} columns={16} style={{ padding: '10px' }}>
        <Grid item xs={24} sm={24} md={24} lg={6} xl={6}>
            <Stack sx={{ width: '100%' }} spacing={2}>
              <Button variant="contained" size="medium" style={{ height: 35 }}>
                विभाग
              </Button>
            </Stack>
          </Grid>
          <Grid item xs={24} sm={24} md={24} lg={7} xl={5}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">विभाग </InputLabel>

              <Select
                style={{ height: 40 }}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                // value={zoneData}
                label="विभाग"
                onChange={(e) => setDivisionCode(e.target.value)}
                // onClick={(e) => getDashBoardTotalCount(e.target.value)}
              >
                {zoneData &&
                  zoneData.map((divisionName, index) => (
                    <MenuItem key={index} value={divisionName.divisionCode}>
                      {divisionName.divisionName}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>
          {/* <Grid item xs={24} sm={24} md={24} lg={1} xl={1}>
            <Button
              loading={isLoading}
              loadingPosition="start"
              variant="contained"
              size="medium"
              onClick={() => {
                getDashBoardTotalCount();
                // getDashBoardDetails();
              }}
            >
              शोधा
            </Button>
          </Grid> */}
          <Grid item xs={24} sm={24} md={24} lg={3} xl={5}>
            <h3>
              <b>(1 ऑगस्ट  २०२३   पासूनची  स्थिति. दिनांक: {`${day} - ${month} - ${year}`})</b>
            </h3>
          </Grid>
        </Grid>
      </Card>
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Paper className={styles.Footercard}>
        {/* <center>
          <Stack sx={{ width: '50%', marginTop: '10px' }} spacing={2}>
            <Button variant="contained" size="large" style={{ justifyContent: 'center' }}>
              विभाग निहाय डॅशबोर्ड
            </Button>
          </Stack>
        </center> */}

        <Grid container spacing={1} columns={24} style={{ padding: '2px' }}>
          <Grid item xs={24} sm={24} md={24} lg={3} xl={3}>
            <Card>
              <Box>
                <Typography
                  sx={{ height: 50 }}
                  component="div"
                  align="center"
                  style={{ backgroundColor: '#002884', color: 'white' }}
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
                  sx={{ height: 50 }}
                  component="div"
                  align="center"
                  style={{ backgroundColor: '#002884', color: 'white' }}
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
                  sx={{ height: 50 }}
                  component="div"
                  align="center"
                  style={{ backgroundColor: '#002884', color: 'white' }}
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
                  sx={{ height: 50 }}
                  component="div"
                  align="center"
                  style={{ backgroundColor: '#002884', color: 'white' }}
                >
                  एकूण गावांची संख्या
                </Typography>

                <Divider variant="middle" />
              </Box>
            </Card>
          </Grid>
          {/* <Grid item xs={24} sm={24} md={24} lg={3} xl={3}>
            <Card>
              <Box>
                <Typography
                  sx={{ height: 50 }}
                  component="div"
                  align="center"
                  style={{ backgroundColor: '#002884', color: 'white' }}
                >
                  एकूण खातेदारांची संख्या
                </Typography>

                <Divider variant="middle" />
              </Box>
            </Card>
          </Grid> */}
          <Grid item xs={24} sm={24} md={24} lg={3} xl={3}>
            <Card>
              <Box>
                <Typography
                  sx={{ height: 50 }}
                  component="div"
                  align="center"
                  style={{ backgroundColor: '#002884', color: 'white' }}
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
                  sx={{ height: 50 }}
                  component="div"
                  align="center"
                  style={{ backgroundColor: '#002884', color: 'white' }}
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
                  sx={{ height: 50 }}
                  component="div"
                  align="center"
                  style={{ backgroundColor: '#002884', color: 'white' }}
                >
                  <h5 style={{ backgroundColor: '#002884', color: 'white' }}>
                    वसुली करणाऱ्या गावांची माहिती
                  </h5>
                </Typography>

                <Divider variant="middle" />
              </Box>
            </Card>
          </Grid>
          <Grid item xs={24} sm={24} md={24} lg={3} xl={3}>
            <Card>
              <Box>
                <Typography
                  sx={{ height: 50 }}
                  component="div"
                  align="center"
                  style={{ backgroundColor: '#002884', color: 'white' }}
                >
                  एकूण भरलेली माहिती
                </Typography>

                <Divider variant="middle" />
              </Box>
            </Card>
          </Grid>
        </Grid>

        {dashBoardDetail &&
          dashBoardDetail.map((r, i) => {
            return (
              <>
                <Grid container spacing={1} columns={24} style={{ padding: '2px' }}>
                  {r.districtName !== null ? (
                    <Grid item xs={24} sm={24} md={24} lg={3} xl={3}>
                      <Card>
                        <Box
                          sx={{
                            bgcolor: '#64b5f6',
                            height: 50,
                          }}
                        >
                          <CardContent>
                            <h4>{r.districtName}</h4>
                          </CardContent>
                        </Box>
                      </Card>
                    </Grid>
                  ) : (
                    <Grid item xs={24} sm={24} md={24} lg={3} xl={3}>
                      <Card>
                        <Box
                          sx={{
                            bgcolor: '#64b5f6',
                            height: 50,
                          }}
                        >
                          <CardContent>
                            <h3>{r.divisionName}</h3>
                          </CardContent>
                        </Box>
                      </Card>
                    </Grid>
                  )}
                  <Grid item xs={24} sm={24} md={24} lg={3} xl={3}>
                    <Card>
                      <Box
                        sx={{
                          bgcolor: '#64b5f6',
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
                          bgcolor: '#64b5f6',
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
                          bgcolor: '#64b5f6',
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
                  {/* <Grid item xs={24} sm={24} md={24} lg={3} xl={3}>
                    <Card>
                      <Box
                        sx={{
                          bgcolor: '#64b5f6',
                          height: 50,
                        }}
                      >
                        <CardContent>
                          <center>
                            <h3>{r.totalKhataNumbers}</h3>
                          </center>
                        </CardContent>
                      </Box>
                    </Card>
                  </Grid> */}
                  <Grid item xs={24} sm={24} md={24} lg={3} xl={3}>
                    <Card>
                      <Box
                        sx={{
                          bgcolor: '#64b5f6',
                          height: 50,
                        }}
                      >
                        <CardContent>
                          <center>
                            {divisionCode === undefined ? (
                              <h3>{r.totalPhase1Villages}</h3>
                            ) : (
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
                                  <u> {r.totalPhase1Villages}</u>
                                </h3>
                              </a>
                            )}
                          </center>
                        </CardContent>
                      </Box>
                    </Card>
                  </Grid>
                  <Grid item xs={24} sm={24} md={24} lg={3} xl={3}>
                    <Card>
                      <Box
                        sx={{
                          bgcolor: '#64b5f6',
                          height: 50,
                        }}
                      >
                        <CardContent>
                          <center>
                            {divisionCode === undefined ? (
                              <h3>{r.totalPhase1Login}</h3>
                            ) : (
                              <a
                                onClick={() => {
                                  redirectToTotalPhase1Login(
                                    r.districtName,
                                    r.districtCode,
                                    r.totalPhase1Login,
                                  );
                                }}
                              >
                                <h3>
                                  <u> {r.totalPhase1Login}</u>
                                </h3>
                              </a>
                            )}
                          </center>
                        </CardContent>
                      </Box>
                    </Card>
                  </Grid>
                  <Grid item xs={24} sm={24} md={24} lg={3} xl={3}>
                    <Card>
                      <Box
                        sx={{
                          bgcolor: '#64b5f6',
                          height: 50,
                        }}
                      >
                        <CardContent>
                          <center>
                            {divisionCode === undefined ? (
                              <h3>{r.totalOnlineVillagesCount}</h3>
                            ) : (
                              <a
                                onClick={() => {
                                  redirectToOnlineVillagesCount(
                                    r.districtName,
                                    r.districtCode,
                                    r.totalOnlineVillagesCount,
                                  );
                                }}
                              >
                                <h3>
                                  <u>{r.totalOnlineVillagesCount}</u>
                                </h3>
                              </a>
                            )}
                          </center>
                        </CardContent>
                      </Box>
                    </Card>
                  </Grid>
                  <Grid item xs={24} sm={24} md={24} lg={3} xl={3}>
                    <Card>
                      <Box
                        sx={{
                          bgcolor: '#64b5f6',
                          height: 50,
                        }}
                      >
                        <CardContent>
                          <center>
                            {divisionCode === undefined ? (
                              <h3>{r.totalEntry}</h3>
                            ) : (
                              <a
                                onClick={() => {
                                  redirectToReport(r.districtName, r.districtCode);
                                }}
                              >
                                <h3>
                                  <u> {r.totalEntry}</u>
                                </h3>
                              </a>
                            )}
                          </center>
                        </CardContent>
                      </Box>
                    </Card>
                  </Grid>
                </Grid>
              </>
            );
          })}
        <Grid container spacing={1} columns={24} style={{ padding: '2px' }}>
          <Grid item xs={24} sm={24} md={24} lg={3} xl={3}>
            <Card>
              <Box
                sx={{
                  bgcolor: '#64b5f6',
                  height: 50,
                }}
              >
                <CardContent>
                  <center>
                    <h3>एकूण</h3>
                  </center>
                </CardContent>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={24} sm={24} md={24} lg={3} xl={3}>
            <Card>
              <Box
                sx={{
                  bgcolor: '#64b5f6',
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
          <Grid item xs={24} sm={24} md={24} lg={3} xl={3}>
            <Card>
              <Box
                sx={{
                  bgcolor: '#64b5f6',
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
          <Grid item xs={24} sm={24} md={24} lg={3} xl={3}>
            <Card>
              <Box
                sx={{
                  bgcolor: '#64b5f6',
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
          {/* <Grid item xs={24} sm={24} md={24} lg={3} xl={3}>
            <Card>
              <Box
                sx={{
                  bgcolor: '#64b5f6',
                  height: 50,
                }}
              >
                <CardContent>
                  <center>
                    <h3> {dashBoardCount?.totalKhataNumberT}</h3>
                  </center>
                </CardContent>
              </Box>
            </Card>
          </Grid> */}

          <Grid item xs={24} sm={24} md={24} lg={3} xl={3}>
            <Card>
              <Box
                sx={{
                  bgcolor: '#64b5f6',
                  height: 50,
                }}
              >
                <CardContent>
                  <center>
                    <h3> {dashBoardCount?.totalPhase1VillagesT}</h3>
                  </center>
                </CardContent>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={24} sm={24} md={24} lg={3} xl={3}>
            <Card>
              <Box
                sx={{
                  bgcolor: '#64b5f6',
                  height: 50,
                }}
              >
                <CardContent>
                  <center>
                    <h3> {dashBoardCount?.totalPhase1LoginT}</h3>
                  </center>
                </CardContent>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={24} sm={24} md={24} lg={3} xl={3}>
            <Card>
              <Box
                sx={{
                  bgcolor: '#64b5f6',
                  height: 50,
                }}
              >
                <CardContent>
                  <center>
                    <h3> {dashBoardCount?.totalOnlineVillagesCount}</h3>
                  </center>
                </CardContent>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={24} sm={24} md={24} lg={3} xl={3}>
            <Card>
              <Box
                sx={{
                  bgcolor: '#64b5f6',
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
        </Grid>
      </Paper>

      <Card sx={{ height: 500 }}>
        <Grid container spacing={1} columns={16} style={{ padding: '10px' }}>
          <Grid item xs={24} sm={24} md={24} lg={24} xl={24}>
            {finalDivisionCode != null ? (
              <Chart
                type="bar"
                width={1249}
                height={450}
                series={[
                  {
                    name: 'भाग १ मधील गावांची संख्या',
                    data: [
                      parseInt(totalAmravatiPhase1Villages),
                      parseInt(totalAurangabadPhase1Villages),
                      parseInt(totalKokanPhase1Villages),
                      parseInt(totalNagpurPhase1Villages),
                      parseInt(totalNashikPhase1Villages),
                      parseInt(totalPunePhase1Villages),
                    ],
                  },
                  {
                    name: 'लॉगीन गावांची संख्या',
                    data: [
                      parseInt(totalAmravatiPhase1Login),
                      parseInt(totalAurangabadPhase1Login),
                      parseInt(totalKokanPhase1Login),
                      parseInt(totalNagpurPhase1Login),
                      parseInt(totalNashikPhase1Login),
                      parseInt(totalPunePhase1Login),
                    ],
                  },
                  {
                    name: 'वसुली करणाऱ्या गावांची माहिती',
                    data: [
                      parseInt(totalAmravatiOnlineCount),
                      parseInt(totalAurangabadOnlineCount),
                      parseInt(totalKokanOnlineCount),
                      parseInt(totalNagpurOnlineCount),
                      parseInt(totalNashikOnlineCount),
                      parseInt(totalPuneOnlineCount),
                    ],
                  },
                ]}
                options={{
                  title: {
                    text: 'Daily Updated Data',
                    style: {
                      // marginTop: '50px',
                      fontSize: '20',
                      color: 'blue',
                    },
                  },
                  chart: {
                    stacked: true,
                  },
                  // plotOptions: {
                  //   bar: {
                  //     // horizontal: true,
                  //     columnWidth: 50,
                  //   },
                  // },
                  stroke: {
                    width: 5,
                  },
                  xaxis: {
                    title: {
                      // text: 'विभाग',
                      style: {
                        // marginTop: '50px',
                        fontSize: '20',
                        color: 'red',
                      },
                    },
                    categories: ['अमरावती', 'औरंगाबाद', ' कोकण', 'नागपूर', 'नाशिक', 'पुणे'],
                  },
                  yaxis: {
                    title: {
                      text: 'एकूण गावांची संख्या',
                      style: {
                        // marginTop: '50px',
                        fontSize: '20',
                        color: 'green',
                      },
                    },
                  },
                  legend: {
                    position: 'top',
                  },
                  dataLabels: {
                    enabled: true,
                  },
                }}
              />
            ) : (
              <Chart
                type="bar"
                width={1249}
                height={450}
                series={[
                  {
                    name: 'भाग १ मधील गावांची संख्या',
                    data: [233, 134, 345, 300, 289, 200],
                  },
                  {
                    name: 'लॉगीन गावांची संख्या',
                    data: [312, 212, 412, 100, 130, 140],
                  },
                  {
                    name: 'वसुली करणाऱ्या गावांची माहिती',
                    data: [412, 323, 122, 122, 134, 90],
                  },
                ]}
                options={{
                  title: {
                    text: 'Daily Updated Data',
                    style: {
                      // marginTop: '50px',
                      fontSize: '20',
                      color: 'blue',
                    },
                  },
                  chart: {
                    stacked: true,
                  },
                  // plotOptions: {
                  //   bar: {
                  //     // horizontal: true,
                  //     columnWidth: 50,
                  //   },
                  // },
                  stroke: {
                    width: 5,
                  },
                  xaxis: {
                    title: {
                      // text: 'विभाग',
                      style: {
                        // marginTop: '50px',
                        fontSize: '20',
                        color: 'red',
                      },
                    },
                    categories: ['अमरावती', 'औरंगाबाद', ' कोकण', 'नागपूर', 'नाशिक', 'पुणे'],
                  },
                  yaxis: {
                    title: {
                      text: 'एकूण गावांची संख्या',
                      style: {
                        // marginTop: '50px',
                        fontSize: '20',
                        color: 'green',
                      },
                    },
                  },
                  legend: {
                    position: 'top',
                  },
                  dataLabels: {
                    enabled: true,
                  },
                }}
              />
            )}
          </Grid>
        </Grid>
      </Card>
    </div>
  );
};

export default IntroduceRow;
