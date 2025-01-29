import React, { useEffect, useState, useCallback } from 'react';

let logoutTimer;

const AuthContext = React.createContext({
  token: '',
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
});

const calculateRemainingTime = (expiryDate) => {
  const currentTime = new Date().getTime();
  const adjExpirationTime = new Date(expiryDate).getTime();
  const remainingDuration = adjExpirationTime - currentTime;
  return remainingDuration;
};

const retrieveStoredToken = () => {
  const storedToken = localStorage.getItem('token');
  const storedExpirationDate = localStorage.getItem('expiryDate');
  console.log('retrieveStoredToken-->>', storedToken, storedExpirationDate);

  const remainingTime = calculateRemainingTime(+storedExpirationDate);
  console.log('retrieveStoredToken-remainingTime-->>', remainingTime);
  if (remainingTime <= 60000) {
    localStorage.removeItem('token');
    localStorage.removeItem('expiryDate');
    return null;
  }
  return {
    token: storedToken,
    duration: remainingTime,
  };
};

export const AuthContextProvider = (props) => {
  const tokenData = retrieveStoredToken();
  let initialToken;

  if (tokenData) {
    initialToken = tokenData.token;
  }

  const [token, setToken] = useState(initialToken);

  const userIsLoggedIn = !!token;

  const logoutHandler = useCallback(() => {
    setToken(null);
    //localStorage.clear();
    localStorage.removeItem('token');
    localStorage.removeItem('expiryDate');

    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
  }, []);

  const loginHandler = (token, expiryDate) => {
    setToken(token);
    localStorage.setItem('token', token);
    localStorage.setItem('expiryDate', expiryDate);

    const remainingTime = calculateRemainingTime(expiryDate);
    logoutTimer = setTimeout(logoutHandler, remainingTime);
  };

  useEffect(() => {
    if (tokenData) {
      console.log(tokenData.duration);
      logoutTimer = setTimeout(logoutHandler, tokenData.duration);
    }
  }, [tokenData, logoutHandler]);

  const contextValue = {
    token,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };

  return <AuthContext.Provider value={contextValue}>{props.children}</AuthContext.Provider>;
};

export default AuthContext;
