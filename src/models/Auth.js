import { configResponsive } from 'ahooks';
import { useState, useEffect } from 'react';

let logoutTimer;
let toastTimerL;
const calculateRemainingTime = (expiryDate) => {
  // console.log(expiryDate, 'expiryDate==>');
  const currentTime = new Date().getTime();
  // console.log('currentTime', currentTime);
  const adjExpirationTime = new Date(expiryDate).getTime();
  // console.log('adjExpirationTime', adjExpirationTime);
  const remainingDuration = adjExpirationTime - currentTime;
  // console.log('remainingDuration', remainingDuration);
  return 300000000;
};

const retrieveStoredToken = () => {
  const storedToken = localStorage.getItem('token');
  const storedExpirationDate = localStorage.getItem('expiryDate');
  // console.log('retrieveStoredToken-->>', storedToken, storedExpirationDate);

  const remainingTime = calculateRemainingTime(+storedExpirationDate);
  // console.log('retrieveStoredToken-remainingTime-->>', remainingTime);
  if (new Date().getTime() + remainingTime <= 30000) {
  //  localStorage.removeItem('token');
    // localStorage.removeItem('expiryDate');
    return null;
  }
  return {
    token: storedToken,
    duration: remainingTime,
  };
};

export default () => {
  const tokenData = retrieveStoredToken();
  let initialToken;
  //let initialToastTimer;
  // initialToastTimer = tokenData.duration - 900000;

  if (tokenData) {
    initialToken = tokenData.token;
  }
  // console.log('on page load -->', initialToken);
  const [token, setToken] = useState(initialToken);
  const [toastTimer, setToastTimer] = useState(false);

  useEffect(() => {
    if (tokenData) {
      //   console.log('Use Effect Log for Token.Duration', tokenData.duration);
      logoutTimer = setTimeout(logout, tokenData.duration);
    }
  }, [tokenData, logout]);

  const logout = () => {
    setToken('');
    setToastTimer(false);
    //setToastTimer();
    localStorage.clear();
    localStorage.removeItem('token');
    localStorage.removeItem('expiryDate');

    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
    if (toastTimerL) {
      clearTimeout(toastTimerL);
    }
  };

  const toastTimerF = () => {
    setToastTimer(true);
  };

  const authLogin = (tokenAfterLogin, expiryDate) => {
    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
    if (toastTimerL) {
      clearTimeout(toastTimerL);
    }
    setToastTimer(false);
    setToken(tokenAfterLogin);
    localStorage.setItem('token', tokenAfterLogin);
    const remainingTime = calculateRemainingTime(expiryDate);
    localStorage.setItem('expiryDate', expiryDate);
    // console.log('Remaining Time==>', remainingTime);
    logoutTimer = setTimeout(logout, remainingTime);
    toastTimerL = setTimeout(toastTimerF, 20000);
  };

  return { token, authLogin, logout, toastTimer };
};
