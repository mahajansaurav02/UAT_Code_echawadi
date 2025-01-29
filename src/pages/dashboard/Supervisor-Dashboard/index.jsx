import { InfoCircleOutlined } from '@ant-design/icons';
import react, { useState } from 'react';
import { TinyArea, TinyColumn, Progress } from '@ant-design/charts';
// import { Button, Card, Col, Form, message, Row, Select, Tooltip } from 'antd';

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
} from '@mui/material';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
// import down_img from '../../../homepage/downimage.png';
import { Col, Form, Row, Tooltip, Modal } from 'antd';
// import { LoadingButton } from '@mui/lab';
// import LoadingButton from '@mui/lab/LoadingButton';

function SupervisorDashboard() {
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
  let history = useHistory();

  useEffect(() => {
    if (servarthId === 'Collector') {
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

  const getZoneData = async () => {
    sendRequest(`${URLS.BaseURL}/dashboard/getDropDownsDivision`, 'GET', null, (res) => {
      setZoneData(
        res.data.map((r, i) => ({
          divisionCode: r.divisionCode,
          divisionName: r.divisionName,
        })),
      );
    });
  };

  const getDashBoardDetails = async () => {
    sendRequest(
      `${URLS.BaseURL}/dashboard/supervisoryDashBoardByDistrict?divisionCode=${divisionCode}`,
      'POST',
      null,
      (res) => {
        setDashBoardDetail(
          res.data.map((r, i) => ({
            divisionName: r.divisionName,
            districtCode: r.districtCode,
            districtName: r.districtName,
            totalDistricts: r.totalDistricts,
            totalTalukas: r.totalTalukas,
            totalVillages: r.totalVillages,
          })),
        );
      },
      setIsLoading(false),
    );
  };

  const getDashBoardTotalCount = async () => {
    setIsLoading(true);
    sendRequest(
      `${URLS.BaseURL}/dashboard/supervisoryDashBoardByDivision?divisionCode=${divisionCode}`,
      'POST',
      null,
      (r) => {
        setDashBoardCount({
          totalDistricts: r.data[0].totalDistricts,
          totalTalukas: r.data[0].totalTalukas,
          totalVillages: r.data[0].totalVillages,
        });
        getDashBoardDetails();
      },
    );
  };

  const redirectToReport = async (divisionName, divisionCode) => {
    console.log('district Nmae', divisionName);
    history.push({
      pathname: `/reports/Go-Live-VillageList`,
      state: {
        division: divisionName,
        divisionCode: divisionCode,
      },
    });
  };

  return (
    <div>
      <Card className={styles.Footercard}>
        <Grid container spacing={1} columns={16} style={{ padding: '10px' }}>
          <Grid item xs={24} sm={24} md={24} lg={8} xl={8}>
            <Stack sx={{ width: '100%' }} spacing={2}>
              <Button variant="contained" size="medium" style={{ height: 35 }}>
                विभाग
              </Button>
            </Stack>
          </Grid>
          <Grid item xs={24} sm={24} md={24} lg={6} xl={6}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">विभाग </InputLabel>

              <Select
                style={{ height: 40 }}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                // value={zoneData}
                label="विभाग"
                onChange={(e) => setDivisionCode(e.target.value)}
              >
                {zoneData &&
                  zoneData.map((divisionName, index) => (
                    <MenuItem key={index} value={divisionName.divisionCode}>
                      {' '}
                      {divisionName.divisionName}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={24} sm={24} md={24} lg={2} xl={2}>
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
          </Grid>
        </Grid>
      </Card>
      <Paper className={styles.Footercard}>
        <Grid
          container
          spacing={1}
          columns={21}
          // style={{ padding: '2px', paddingLeft: '80px', marginTop: '20px' }}
        >
          <Grid item xs={24} sm={24} md={24} lg={7} xl={7}></Grid>

          <Grid item xs={24} sm={24} md={24} lg={11} xl={11}>
            <Stack sx={{ width: '60%' }} spacing={2}>
              <Button variant="contained" size="large" style={{ justifyContent: 'center' }}>
                विभाग निहाय डॅशबोर्ड
              </Button>
            </Stack>
          </Grid>
          <Grid item xs={24} sm={24} md={24} lg={3} xl={3}>
            <a
              onClick={() => {
                redirectToReport(/* r.divisionName, r.divisionCode */);
              }}
            >
              अहवालासाठी क्लिक करा
              {/* <u> {r.districtName}</u> */}
            </a>
          </Grid>
        </Grid>
        <Grid
          container
          spacing={1}
          columns={21}
          style={{ padding: '2px', paddingLeft: '80px', marginTop: '20px' }}
        >
          <Grid item xs={24} sm={24} md={24} lg={5} xl={5}>
            <Card>
              <Box>
                <Typography
                  component="div"
                  align="center"
                  style={{ backgroundColor: '#002884', color: 'white' }}
                >
                  <h3 style={{ paddingLeft: '10px', color: 'white' }}>
                    जिल्ह्याचे नाव ({dashBoardCount?.totalDistricts})
                  </h3>
                </Typography>

                <Divider variant="middle" />
                {/* <center>
                  <h1 style={{ paddingLeft: '10px' }}>({dashBoardCount?.totalDistricts})</h1>
                </center> */}
              </Box>
            </Card>
          </Grid>
          <Grid item xs={24} sm={24} md={24} lg={2} xl={2}></Grid>
          <Grid item xs={24} sm={24} md={24} lg={5} xl={5}>
            <Card>
              <Box>
                <Typography
                  component="div"
                  align="center"
                  style={{ backgroundColor: '#002884', color: 'white' }}
                >
                  <h3 style={{ paddingLeft: '10px', color: 'white' }}>
                    तालुक्यांची संख्या ({dashBoardCount?.totalTalukas})
                  </h3>
                </Typography>

                <Divider variant="middle" />
                {/* <center>
                  <h1 style={{ paddingLeft: '10px' }}> ({dashBoardCount?.totalTalukas})</h1>
                </center> */}
              </Box>
            </Card>
          </Grid>
          <Grid item xs={24} sm={24} md={24} lg={2} xl={2}></Grid>
          <Grid item xs={24} sm={24} md={24} lg={5} xl={5}>
            <Card>
              <Box>
                <Typography
                  component="div"
                  align="center"
                  style={{ backgroundColor: '#002884', color: 'white' }}
                >
                  <h3 style={{ paddingLeft: '10px', color: 'white' }}>
                    एकूण गावांची संख्या ({dashBoardCount?.totalVillages}){' '}
                  </h3>
                </Typography>

                <Divider variant="middle" />
                {/* <center>
                  <h1 style={{ paddingLeft: '10px' }}> ({dashBoardCount?.totalVillages}) </h1>
                </center> */}
              </Box>
            </Card>
          </Grid>
        </Grid>
        {dashBoardDetail &&
          dashBoardDetail.map((r, i) => {
            return (
              <>
                <Grid
                  container
                  spacing={1}
                  columns={21}
                  style={{ padding: '2px', paddingLeft: '80px', marginTop: '5px' }}
                >
                  <Grid item xs={24} sm={24} md={24} lg={5} xl={5}>
                    <Card>
                      <Box
                        sx={{
                          bgcolor: '#64b5f6',
                          height: 50,
                        }}
                      >
                        <CardContent>
                          <center>
                            <h3>{r.districtName}</h3>
                            {/* <a
                              onClick={() => {
                                redirectToReport(r.divisionName, r.divisionCode);
                              }}
                            >
                              <h3>
                                <u> {r.districtName}</u>
                              </h3>
                            </a> */}
                            {/* <h3>{r.totalDistricts}</h3> */}
                          </center>
                        </CardContent>
                      </Box>
                    </Card>
                  </Grid>
                  <Grid item xs={24} sm={24} md={24} lg={2} xl={2}></Grid>

                  <Grid item xs={24} sm={24} md={24} lg={5} xl={5}>
                    <Card>
                      <Box
                        sx={{
                          bgcolor: '#64b5f6',
                          height: 50,
                        }}
                      >
                        <CardContent>
                          <center>
                            <h1>{r.totalTalukas}</h1>
                          </center>
                        </CardContent>
                      </Box>
                    </Card>
                  </Grid>
                  <Grid item xs={24} sm={24} md={24} lg={2} xl={2}></Grid>

                  <Grid item xs={24} sm={24} md={24} lg={5} xl={5}>
                    <Card>
                      <Box
                        sx={{
                          bgcolor: '#64b5f6',
                          height: 50,
                        }}
                      >
                        <CardContent>
                          <center>
                            <h1>{r.totalVillages}</h1>
                          </center>
                        </CardContent>
                      </Box>
                    </Card>
                  </Grid>
                  {/* <Grid item xs={24} sm={24} md={24} lg={4} xl={4}>
                    <Card>
                      <Box
                        sx={{
                          bgcolor: '#64b5f6',
                          height: 50,
                        }}
                      >
                        <CardContent>
                          <center>
                            <h3>{r.totalPhase1Villages}</h3>
                          </center>
                        </CardContent>
                      </Box>
                    </Card>
                  </Grid>
                  <Grid item xs={24} sm={24} md={24} lg={4} xl={4}>
                    <Card>
                      <Box
                        sx={{
                          bgcolor: '#64b5f6',
                          height: 50,
                        }}
                      >
                        <CardContent>
                          <center>
                            <h3>{r.totalPhase1Login}</h3>
                          </center>
                        </CardContent>
                      </Box>
                    </Card>
                  </Grid>
                  <Grid item xs={24} sm={24} md={24} lg={4} xl={4}>
                    <Card>
                      <Box
                        sx={{
                          bgcolor: '#64b5f6',
                          height: 50,
                        }}
                      >
                        <CardContent>
                          <center>
                            <a
                              onClick={() => {
                                redirectToReport(r.districtName, r.districtCode);
                              }}
                            >
                              <h3>
                                <u> {r.totalEntry}</u>
                              </h3>
                            </a>
                          </center>
                        </CardContent>
                      </Box>
                    </Card>
                  </Grid> */}
                </Grid>
              </>
            );
          })}
      </Paper>
    </div>
  );
}

export default SupervisorDashboard;
