import { useCallback, useState, useEffect } from 'react';
import axios from 'axios';
import { useModel } from 'umi';
import { notification, message } from 'antd';
import URLS from '@/URLs/urls';
import Cookies from 'js-cookie';

const useAxios = () => {
  const { token, setToken } = useModel('Auth');
  const echHost = localStorage.getItem('echHost');
  const mhrHost = localStorage.getItem('mhrHost');
  const echDbName = localStorage.getItem('echDbName');
  const echSchemaName = localStorage.getItem('echSchemaName');
  const mhrDbName = localStorage.getItem('mhrDbName');
  const mhrSchemaName = localStorage.getItem('mhrSchemaName');
  const servarthId = localStorage.getItem('servarthId');
  const langType = localStorage.getItem('umi_locale') === 'ma-IN' ? 'mr-IN' : 'en-US';

  const [isRefreshing, setIsRefreshing] = useState(false);
  let refreshSubscribers = [];

  const getRefreshToken = useCallback(() => {
    const refreshTokenFromLS = Cookies.get('refreshToken');
    if (refreshTokenFromLS) {
      return refreshTokenFromLS;
    }

    const name = 'refreshToken=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');

    for (let cookie of cookieArray) {
      cookie = cookie.trim();
      if (cookie.indexOf(name) === 0) {
        return cookie.substring(name.length);
      }
    }

    return null;
  }, []);

  const updateAccessToken = useCallback(
    (newToken) => {
      localStorage.setItem('token', newToken);

      Cookies.remove('token', { path: '/' });

      Cookies.set('token', newToken, {
        expires: 1,
        path: '/',
        secure: true,
        sameSite: 'Lax',
      });

      setToken?.(newToken);
    },
    [setToken],
  );

  const refreshAccessToken = useCallback(async () => {
    try {
      // const refreshToken = getRefreshToken();
      const refreshToken = '1a4c242d-40e8-49d5-bcfe-5b53c311705c';

      if (!refreshToken) {
        return null;
      }

      const response = await axios.post(
        `${URLS.AuthURL}/refreshtoken?refreshToken=${refreshToken}`,
        {
          headers: {
            'Accept-Language': langType,
          },
        },
      );

      if (response.status === 200 && response.data.accessToken) {
        const newAccessToken = response.data.accessToken;
        updateAccessToken(newAccessToken);
        return newAccessToken;
      }
    } catch (error) {
      localStorage.clear();
      Cookies.remove('token');
      Cookies.remove('refreshToken');
      message.error('Session expired. Please login again.');
      window.location.href = '/login';

      return null;
    }
  }, [getRefreshToken, updateAccessToken, langType]);

  const onRefreshed = useCallback((cb) => {
    refreshSubscribers.push(cb);
  }, []);

  const notifyRefreshSubscribers = useCallback((newToken) => {
    refreshSubscribers.forEach((cb) => cb(newToken));
    refreshSubscribers = [];
  }, []);

  const sendRequest = useCallback(
    async (url, type = 'GET', reqData, callback, errorCallback) => {
      const makeRequest = async (currentToken) => {
        const tokenToUse = currentToken || localStorage.getItem('token');
        console.log(tokenToUse, 'tokenToUse-->>');
        const config = {
          headers: {
            'Accept-Language': langType,
            Authorization: `Bearer ${tokenToUse}`, // ← Use updated token
            echHost: echHost,
            mhrHost: mhrHost,
            echDbName: echDbName,
            echSchemaName: echSchemaName,
            mhrDbName: mhrDbName,
            mhrSchemaName: mhrSchemaName,
            servarthId: servarthId,
          },
        };

        try {
          let response;

          if (type === 'POST') {
            response = await axios.post(url, reqData, config);
          } else if (type === 'PUT') {
            response = await axios.put(url, reqData, config);
          } else if (type === 'PATCH') {
            response = await axios.patch(url, reqData, config);
          } else if (type === 'GET') {
            response = await axios.get(url, config);
          } else if (type === 'DELETE') {
            response = await axios.delete(url, config);
          }

          if (response.data?.status === 'FAILURE') {
            message.error(response.data.message);
          }

          callback(response);
          return response;
        } catch (error) {
          const statusCode = error.response?.status;

          if (statusCode === 401 && !isRefreshing) {
            setIsRefreshing(true);
            const newToken = await refreshAccessToken();
            setIsRefreshing(false);

            if (newToken) {
              notifyRefreshSubscribers(newToken);

              return makeRequest(newToken);
            } else {
              if (errorCallback) {
                errorCallback(error.response);
              }
              return;
            }
          } else if ((statusCode === 401 || statusCode === 403) && isRefreshing) {
            return new Promise((resolve) => {
              onRefreshed((newToken) => {
                resolve(makeRequest(newToken));
              });
            });
          }

          message.error(error.response?.data?.message || 'Request failed');

          if (errorCallback) {
            errorCallback(error.response);
          }
        }
      };

      const currentToken = localStorage.getItem('token');
      return makeRequest(currentToken);
    },
    [
      token,
      langType,
      echHost,
      mhrHost,
      echDbName,
      echSchemaName,
      mhrDbName,
      mhrSchemaName,
      servarthId,
      isRefreshing,
      refreshAccessToken,
      notifyRefreshSubscribers,
      onRefreshed,
    ],
  );

  return {
    sendRequest,
  };
};

export default useAxios;
