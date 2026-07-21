// import { ArrowRightOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import {
  ArrowRightOutlined,
  LockOutlined,
  UserOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
} from '@ant-design/icons';
import Axios from 'axios';
import { Alert, Button, Col, Form, Input, message, Modal, Row, Select, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { useIntl, history, FormattedMessage, SelectLang, useModel } from 'umi';
import { login } from '@/services/ant-design-pro/api';
import mainImage from './../../../../public/maha_map.svg';
import FirstAugustTitle from './../../../../public/eChawadi_1_August.webp';
import URLS from '@/URLs/urls';
import './index.css';
import YouTube from 'react-youtube';
import { Avatar, Card, CardContent, CardHeader, Grid } from '@mui/material';
import ArrowForwardTwoToneIcon from '@mui/icons-material/ArrowForwardTwoTone';
import LiveHelpTwoToneIcon from '@mui/icons-material/LiveHelpTwoTone';
import { AES, enc } from 'crypto-js';
import { LoadCanvasTemplate, loadCaptchaEnginge, validateCaptcha } from 'react-simple-captcha';
import { useHistory } from 'react-router-dom';
import Cookies from 'js-cookie';

// Cookie utility functions
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

const setCookie = (name, value, days = 7, path = '/') => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=${path};SameSite=Lax`;
};

const deleteCookie = (name, path = '/') => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path};`;
  localStorage.removeItem(name);
  sessionStorage.removeItem(name);
};

const setMainRefreshTokenFromCookie = () => {
  const refreshToken = getCookie('refreshToken');

  if (refreshToken) {
    // Store the actual refresh token (UUID) in localStorage
    localStorage.setItem('mainRefreshToken', refreshToken);
    sessionStorage.setItem('mainRefreshToken', refreshToken);

    return true;
  } else {
    return false;
  }
};

const getMainRefreshToken = () => {
  let mainToken = localStorage.getItem('mainRefreshToken');

  if (!mainToken) {
    const refreshToken = getCookie('refreshToken');
    if (refreshToken) {
      mainToken = refreshToken;
      localStorage.setItem('mainRefreshToken', refreshToken);
      sessionStorage.setItem('mainRefreshToken', refreshToken);
    }
  }

  return mainToken;
};

// Configure axios defaults
Axios.defaults.withCredentials = true;
Axios.defaults.headers.common['Content-Type'] = 'application/json';

var login_attempts = 3;

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const [userLoginState, setUserLoginState] = useState({});
  const [type, setType] = useState('account');
  const { initialState, setInitialState } = useModel('@@initialState');
  const intl = useIntl();
  const { authLogin } = useModel('Auth');
  const { details } = useModel('details');
  const [password, setPassword] = useState();
  const [username, setUsername] = useState();
  const [dyslrLogin, setDyslrLogin] = useState(false);
  const [modalHelp, setModalHelp] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalForDelete, setModalForDelete] = useState(false);
  const history = useHistory();
  const [loadings, setLoadings] = useState([]);

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();

    if (userInfo) {
      await setInitialState((s) => ({ ...s, currentUser: userInfo }));
    }
  };

  const key = 'wXhN%8T@hS$Z@Q';
  const CryptoJS = require('crypto-js');
  const encrypted = CryptoJS.AES.encrypt(password, key);

  const reload = () => {
    var myArray = [{}];
    localStorage.setItem('villageData1', JSON.stringify(myArray));
    var myRevenue = [{}];
    localStorage.setItem('revenueYear1', JSON.stringify(myRevenue));
  };

  const handleCancelForModal = () => {
    setIsModalVisible(false);
  };

  const enterLoading = (index) => {
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[index] = true;
      return newLoadings;
    });
  };

  // ADD THIS TO YOUR EXISTING LOGIN COMPONENT - Replace the handleSubmit function

  const handleSubmit = async (values) => {
    enterLoading(2); // Start loading

    try {
      let user_captcha_value = document.getElementById('user_captcha_input').value;
      const article = {
        servarthId: username,
        password: encrypted.toString(),
      };

      const res = await Axios.post(
        `${URLS.AuthURL}/authenticateUserByUsernameAndPassword`,
        article,
        {
          withCredentials: true,
        },
      );

      // ✅ EXTRACT refreshToken (check response body first, then headers)
      const getCookieValue = (name) => {
        const match = document.cookie.split('; ').find((row) => row.startsWith(name + '='));
        return match ? match.split('=')[1] : null;
      };

      // Small delay to ensure browser has set the cookie before reading
      await new Promise((resolve) => setTimeout(resolve, 100));

      if (res.status === 200 && validateCaptcha(user_captcha_value) === true) {
        console.log(res.data, 'checkk main dataaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
        // Successful login logic
        Cookies.set('encoded', res.data.encodedKey, {
          secure: true,
          sameSite: 'strict',
          path: '/',
        });
        details(
          res.data.challanHeads,
          res.data.servarthId,
          res.data.districtCode,
          res.data.districtName,
          res.data.talukaCode,
          res.data.talukaName,
          res.data.marathiName,
          res.data.desg,
          res.data.echDbName,
          res.data.echSchemaName,
          res.data.mhrDbName,
          res.data.mhrSchemaName,
          res.data.echHost,
          res.data.mhrHost,
          res.data.villages,
          res.data.revenueYear,
          res.data.roles,
          res.data.niranks,
        );

        // Use accessToken from response
        authLogin(res.data.accessToken, 3600000);
        reload();

        // Update initialState so menu params change and navbar re-renders
        await setInitialState((s) => ({
          ...s,
          currentUser: { userid: res.data.servarthId },
        }));

        // Proceed with additional login logic
        const msg = await login({ ...values, type });
        if (msg.status === 'ok') {
          const defaultLoginSuccessMessage = intl.formatMessage({
            id: 'pages.login.success',
            defaultMessage: 'Login Successful',
          });
          message.success(defaultLoginSuccessMessage, 2);

          if (!history) return;
          const { query } = history.location;
          const { redirect } = query;
          const ROLES = JSON.parse(localStorage.getItem('roles'));

          if (ROLES[0] === 'ROLE_COLLECTOR') {
            message.error(
              intl.formatMessage({
                id: 'pages.login.failure',
                defaultMessage: 'Login failed, please try again!',
              }),
              2,
            );
          } else if (ROLES[0] === 'ROLE_DYSLR') {
            history.push('/homepageDYSLR');
          } else {
            history.push('/homepageThalati');
          }
        } else {
          throw new Error('Login failed');
        }
      } else {
        throw new Error('Captcha validation failed');
      }
    } catch (err) {
      // Handle all errors in one place
      if (login_attempts <= 0) {
        alert('No Login Attempts Available');
        document.getElementById('username1').disabled = true;
        document.getElementById('password1').disabled = true;
        document.getElementById('btnbtn').disabled = true;
      } else {
        login_attempts -= 1;
        alert(`Login Failed. Now Only ${login_attempts} Login Attempts Available`);
        if (login_attempts <= 0) {
          document.getElementById('username1').disabled = true;
          document.getElementById('password1').disabled = true;
          document.getElementById('btnbtn').disabled = true;
        }
      }

      message.error(
        intl.formatMessage({
          id: 'pages.login.failure',
          defaultMessage: 'Login failed, please try again!',
        }),
        2,
      );
    } finally {
      // Always stop loading, whether success or failure
      setLoadings((prevLoadings) => {
        const newLoadings = [...prevLoadings];
        newLoadings[2] = false;
        return newLoadings;
      });
    }
  };

  const onCancelForHelp = () => {
    setModalHelp(false);
  };

  const newsModal = () => {
    setModalHelp(true);
  };

  const goToMis = (e) => {
    e.preventDefault();
    history.push('/dashboard/collectorMis');
  };

  const info = () => {
    Modal.info({
      okType: 'danger',
      okText: 'रद्द करा ',
      title: 'इ-चावडी माहिती आणि मदत',
      content: (
        <div>
          <a href={`${URLS.AuthURL}/file/1`} target="_blank" rel="noreferrer">
            १) गाव नमुना एक ते एकवीस बाबत माहिती
          </a>{' '}
          <br></br>
          <br />
          <a href={`${URLS.AuthURL}/file/2`} target="_blank" rel="noreferrer">
            २) इ-चावडी सर्वसमावेशक सूचना
          </a>
        </div>
      ),
      onCancel() {},
    });
  };

  const SiteStop = () => {
    Modal.info({
      okType: 'danger',
      okText: 'रद्द करा',
      width: 600,
      title: 'इ-चावडी माहिती आणि मदत',
      content: (
        <div style={{ lineHeight: '1.6', fontSize: '14px' }}>
          <div style={{ textAlign: 'center', marginBottom: '15px' }}>
            <img
              src="/images/maintenance_notice.jpeg"
              alt="Maintenance Notice"
              style={{
                width: '100%',
                maxHeight: '300px',
                objectFit: 'contain',
                borderRadius: '8px',
              }}
            />
          </div>
          <h3 style={{ marginBottom: '10px', color: '#d32f2f', textAlign: 'center' }}>
            देखभाल सूचना
          </h3>
          <p>
            ही वेबसाईट सध्या नियोजित देखभाल व दुरुस्तीच्या कामासाठी{' '}
            <b>2 एप्रिल २०२६ (रात्री 11:59 वाजेपासून)</b> ते{' '}
            <b>५ एप्रिल २०२६ (रात्री 11:59 वाजेपर्यंत)</b> या कालावधीत बंद राहील.
          </p>
          <p>या दरम्यान कोणतीही सेवा उपलब्ध राहणार नाही.</p>
          <p>कृपया देखभाल पूर्ण झाल्यानंतर पुन्हा वेबसाईटला भेट द्यावी.</p>
          <p>आपल्या सहकार्याबद्दल धन्यवाद.</p>
        </div>
      ),
      onCancel() {},
    });
  };

  const { status, type: loginType } = userLoginState;

  useEffect(() => {
    loadCaptchaEnginge(6, 'skyblue');

    // CRITICAL: Restore mainRefreshToken on page load/refresh

    // Get the actual refresh token from cookie or localStorage
    const mainToken = getMainRefreshToken();

    // Set up axios defaults
    Axios.defaults.withCredentials = true;

    // Add axios interceptor to include the refresh token in requests if needed
    const interceptor = Axios.interceptors.request.use(
      (config) => {
        // You can add the refresh token to headers if needed
        const token = getMainRefreshToken();
        if (token && config.url !== `${URLS.AuthURL}/authenticateUserByUsernameAndPassword`) {
          // Add as a custom header if the API expects it
          config.headers['X-Refresh-Token'] = token;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    // Cleanup interceptor on unmount
    return () => {
      Axios.interceptors.request.eject(interceptor);
    };
  }, []);

  return (
    <div className="loginscreen">
      <div>
        <img className="loginImage" src={mainImage} />

        <marquee>
          <h3 style={{ color: 'blueviolet' }}>
            गाव नमुना निरंक आणि गाव नमुना कामकाज पूर्ण निवडण्याचा पर्याय सुविधा देण्यात आली आहे.
            इ-चावडी मधील MIS बघण्यासाठी User id/pw ची आवश्यकता नाही. इ चावडी MIS बघण्यासाठी वरील
            लिंकवर क्लिक करा.
          </h3>
        </marquee>
      </div>

      <div className="rightSide">
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '10px',
          }}
        >
          <Button
            id="registerButton"
            className="registerbttn"
            type="default"
            href="https://testechawadi.mahabhumi.gov.in/user/"
          >
            <FormattedMessage
              id="pages.login.inspectionRegistration"
              defaultMessage="ग्राम दप्तर तपासणीसाठी अधिकारी यांची माहिती भरा"
            />
            <img src="/new.gif" alt="New" className="new-gif" />
          </Button>

          <Button className="go-to-mis-button" type="primary" onClick={goToMis}>
            <ArrowRightOutlined style={{ marginRight: '8px', fontSize: '16px' }} />
            <FormattedMessage id="login.gotoMis" />
          </Button>

          <div className="translator" data-lang>
            {SelectLang && <SelectLang className="trans" />}
          </div>
        </div>
        <div className="loginForm" id="loginForm1">
          <h1>
            <FormattedMessage id="pages.login.title" />
          </h1>

          <form style={{ display: 'none' }}>
            <input type="text" name="fake_user_trap" autoComplete="username" />
            <input type="password" name="fake_pass_trap" autoComplete="current-password" />
          </form>

          <div className="username-div">
            <Input
              id="field_user_99"
              name="field_user_99"
              required
              maxLength={15}
              autoComplete="new-password"
              onChange={(e) => {
                setUsername(e.target.value);
                document.getElementById('empty-username').style.opacity = '0';
              }}
              prefix={<UserOutlined className="usersymb" />}
              type="text"
              className="username"
              placeholder="Username"
            />
            <label id="empty-username">*Please enter a username</label>
          </div>

          <div className="password-div">
            <Input
              id="field_pass_99"
              name="field_pass_99"
              required
              maxLength={25}
              autoComplete="off"
              type="text"
              className={`password ${!showPassword ? 'mask-password-text' : ''}`}
              onChange={(e) => {
                setPassword(e.target.value);
                document.getElementById('empty-pass').style.opacity = '0';
              }}
              prefix={<LockOutlined className="locksymb" />}
              suffix={
                showPassword ? (
                  <EyeOutlined
                    onClick={() => setShowPassword(false)}
                    style={{ cursor: 'pointer', color: 'rgba(0,0,0,0.45)' }}
                  />
                ) : (
                  <EyeInvisibleOutlined
                    onClick={() => setShowPassword(true)}
                    style={{ cursor: 'pointer', color: 'rgba(0,0,0,0.45)' }}
                  />
                )
              }
              placeholder="Password"
            />
            <label id="empty-pass">*Please enter a password</label>
          </div>

          <div>
            <div className="container">
              <div className="form-group">
                <div className="col mt-3">
                  <LoadCanvasTemplate />
                </div>
                <div>
                  <div className="password">
                    <input
                      style={{ width: '100%' }}
                      placeholder="Enter Captcha Value"
                      id="user_captcha_input"
                      name="user_captcha_input"
                      type="text"
                      autoComplete="off"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Button
            id="btnbtn"
            className="loginbttn"
            loading={loadings[2]}
            type="primary"
            onClick={async () => {
              if (!username && !password) {
                document.getElementById('empty-username').style.opacity = '1';
                document.getElementById('empty-pass').style.opacity = '1';
              } else if (!username) {
                document.getElementById('empty-username').style.opacity = '1';
              } else if (!password) {
                document.getElementById('empty-pass').style.opacity = '1';
              } else {
                await handleSubmit();
              }
            }}
          >
            <FormattedMessage id="pages.login.button.final" />
          </Button>

          <Card sx={{ width: 310, height: 190, overflow: 'auto' }}>
            <CardHeader
              sx={{ position: 'static', backgroundColor: 'skyblue', height: 50 }}
              avatar={
                <Avatar sx={{ backgroundColor: '#ffd700' }}>
                  <LiveHelpTwoToneIcon />
                </Avatar>
              }
              title={
                <b>
                  <h3>
                    <FormattedMessage id="login.newsHelp" />
                  </h3>
                </b>
              }
            />
            <CardContent>
              {/* All the Grid items remain the same */}
              <Grid container spacing={1} columns={12}>
                <Grid item xs={24} sm={24} md={2} lg={2} xl={2}>
                  <ArrowForwardTwoToneIcon sx={{ color: 'skyblue' }} />
                </Grid>
                <Grid item xs={24} sm={24} md={10} lg={10} xl={10}>
                  <a href={`${URLS.AuthURL}/file/14`} target="_blank" rel="noreferrer">
                    शिक्षण आणि रोजगार हमी (उपकर) अधिनियम, १९६२
                  </a>
                </Grid>
              </Grid>
              <Grid container spacing={1} columns={12}>
                <Grid item xs={24} sm={24} md={2} lg={2} xl={2}>
                  <ArrowForwardTwoToneIcon sx={{ color: 'skyblue' }} />
                </Grid>
                <Grid item xs={24} sm={24} md={10} lg={10} xl={10}>
                  <a href={`${URLS.AuthURL}/file/13`} target="_blank" rel="noreferrer">
                    महसूल मागणी निश्चिती २०२५-२६
                  </a>
                </Grid>
              </Grid>
              <Grid container spacing={1} columns={12}>
                <Grid item xs={24} sm={24} md={2} lg={2} xl={2}>
                  <ArrowForwardTwoToneIcon sx={{ color: 'skyblue' }} />
                </Grid>
                <Grid item xs={24} sm={24} md={10} lg={10} xl={10}>
                  <a href={`${URLS.AuthURL}/file/12`} target="_blank" rel="noreferrer">
                    इ-चावडी मार्गदर्शक सूचना २०२५
                  </a>
                </Grid>
              </Grid>
              <Grid container spacing={1} columns={12}>
                <Grid item xs={24} sm={24} md={2} lg={2} xl={2}>
                  <ArrowForwardTwoToneIcon sx={{ color: 'skyblue' }} />
                </Grid>
                <Grid item xs={24} sm={24} md={10} lg={10} xl={10}>
                  <a
                    href="https://drive.google.com/u/0/uc?id=1AodMBTimjwcisfdNsPprClpk5ViMOJFr&export=download"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FormattedMessage id="login.downloadTranslator" />
                  </a>
                </Grid>
              </Grid>
              <Grid container spacing={1} columns={12}>
                <Grid item xs={24} sm={24} md={2} lg={2} xl={2}>
                  <ArrowForwardTwoToneIcon sx={{ color: 'skyblue' }} />
                </Grid>
                <Grid item xs={24} sm={24} md={10} lg={10} xl={10}>
                  <a href={`${URLS.AuthURL}/file/10`} target="_blank" rel="noreferrer">
                    इ-चावडी भाग - १ आकारणी विषयक अद्ययावतीकरण
                  </a>
                </Grid>
              </Grid>
              <Grid container spacing={1} columns={12}>
                <Grid item xs={24} sm={24} md={2} lg={2} xl={2}>
                  <ArrowForwardTwoToneIcon sx={{ color: 'skyblue' }} />
                </Grid>
                <Grid item xs={24} sm={24} md={10} lg={10} xl={10}>
                  <a href={`${URLS.AuthURL}/file/9`} target="_blank" rel="noreferrer">
                    Live Data मधील फरक
                  </a>
                </Grid>
              </Grid>
              <Grid container spacing={1} columns={12}>
                <Grid item xs={24} sm={24} md={2} lg={2} xl={2}>
                  <ArrowForwardTwoToneIcon sx={{ color: 'skyblue' }} />
                </Grid>
                <Grid item xs={24} sm={24} md={10} lg={10} xl={10}>
                  <a href={`${URLS.AuthURL}/file/7`} target="_blank" rel="noreferrer">
                    जमीन महसूल आकारणी पुर्णांक कार्यपद्धती
                  </a>
                </Grid>
              </Grid>
              <Grid container spacing={1} columns={12}>
                <Grid item xs={24} sm={24} md={2} lg={2} xl={2}>
                  <ArrowForwardTwoToneIcon sx={{ color: 'skyblue' }} />
                </Grid>
                <Grid item xs={24} sm={24} md={10} lg={10} xl={10}>
                  <a href={`${URLS.AuthURL}/file/8`} target="_blank" rel="noreferrer">
                    जमीन महसूल ज्यादा वसूली
                  </a>
                </Grid>
              </Grid>
              <Grid container spacing={1} columns={12}>
                <Grid item xs={24} sm={24} md={2} lg={2} xl={2}>
                  <ArrowForwardTwoToneIcon sx={{ color: 'skyblue' }} />
                </Grid>
                <Grid item xs={24} sm={24} md={10} lg={10} xl={10}>
                  <a href={`${URLS.AuthURL}/file/5`} target="_blank" rel="noreferrer">
                    इ-चावडी भाग-1 (महसूल मागणी व वसुली)
                  </a>
                </Grid>
              </Grid>
              <Grid container spacing={1} columns={12}>
                <Grid item xs={24} sm={24} md={2} lg={2} xl={2}>
                  <ArrowForwardTwoToneIcon sx={{ color: 'skyblue' }} />
                </Grid>
                <Grid item xs={24} sm={24} md={10} lg={10} xl={10}>
                  <a href={`${URLS.AuthURL}/file/6`} target="_blank" rel="noreferrer">
                    इ-चावडी भाग-2 (दप्तर अद्यायवत आणि अहवाल)
                  </a>
                </Grid>
              </Grid>
              <Grid container spacing={1} columns={12}>
                <Grid item xs={24} sm={24} md={2} lg={2} xl={2}>
                  <ArrowForwardTwoToneIcon sx={{ color: 'skyblue' }} />
                </Grid>
                <Grid item xs={24} sm={24} md={10} lg={10} xl={10}>
                  <a href="https://forms.gle/B3d6dyscKc5hK9LZA" target="_blank" rel="noreferrer">
                    इ-चावडी मधील काही समस्या अथवा सुधारणा असल्यास फॉर्म भरा
                  </a>
                </Grid>
              </Grid>
              <Grid container spacing={1} columns={12}>
                <Grid item xs={24} sm={24} md={2} lg={2} xl={2}>
                  <ArrowForwardTwoToneIcon sx={{ color: 'skyblue' }} />
                </Grid>
                <Grid item xs={24} sm={24} md={10} lg={10} xl={10}>
                  <a href={`${URLS.AuthURL}/file/1`} target="_blank" rel="noreferrer">
                    गाव नमुना एक ते एकवीस बाबत माहिती
                  </a>
                </Grid>
              </Grid>
              <Grid container spacing={1} columns={12}>
                <Grid item xs={24} sm={24} md={2} lg={2} xl={2}>
                  <ArrowForwardTwoToneIcon sx={{ color: 'skyblue' }} />
                </Grid>
                <Grid item xs={24} sm={24} md={10} lg={10} xl={10}>
                  <a href={`${URLS.AuthURL}/file/2`} target="_blank" rel="noreferrer">
                    इ-चावडी सर्वसमावेशक सूचना
                  </a>
                </Grid>
              </Grid>
              <Grid container spacing={1} columns={12}>
                <Grid item xs={24} sm={24} md={2} lg={2} xl={2}>
                  <ArrowForwardTwoToneIcon sx={{ color: 'skyblue' }} />
                </Grid>
                <Grid item xs={24} sm={24} md={10} lg={10} xl={10}>
                  <a href={`${URLS.AuthURL}/file/3`} target="_blank" rel="noreferrer">
                    इ-चावडी जमीन महसूल वसुली बाबत माहिती
                  </a>
                </Grid>
              </Grid>
              <Grid container spacing={1} columns={12}>
                <Grid item xs={24} sm={24} md={2} lg={2} xl={2}>
                  <ArrowForwardTwoToneIcon sx={{ color: 'skyblue' }} />
                </Grid>
                <Grid item xs={24} sm={24} md={10} lg={10} xl={10}>
                  <a href={`${URLS.AuthURL}/file/4`} target="_blank" rel="noreferrer">
                    जमीन महसुलात सूटवजा बाबत परिपत्रक
                  </a>
                </Grid>
              </Grid>
              <Grid container spacing={1} columns={12}>
                <Grid item xs={24} sm={24} md={2} lg={2} xl={2}>
                  <ArrowForwardTwoToneIcon sx={{ color: 'skyblue' }} />
                </Grid>
                <Grid item xs={24} sm={24} md={10} lg={10} xl={10}>
                  <a href={`${URLS.AuthURL}/file/11`} target="_blank" rel="noreferrer">
                    इ-चावडी प्रणाली -मार्गदर्शक सूचना
                  </a>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Modal visible={modalForDelete} okText="Yes" okType="danger">
            <FormattedMessage id="formLanguage.form.popForDelete" />
          </Modal>
        </div>

        <div className="footer">
          <h4>© 2023 महसूल विभाग महाराष्ट्र</h4>
        </div>
      </div>
    </div>
  );
};

export default Login;
