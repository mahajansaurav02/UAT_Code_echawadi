import { useCallback, useRef } from 'react';
import axios from 'axios';
import { useModel } from 'umi';
import { message } from 'antd';
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

  const refreshPromiseRef = useRef(null);
  const accessTokenRef = useRef(null);

  const getAccessToken = useCallback(
    () =>
      accessTokenRef.current ||
      localStorage.getItem('token') ||
      Cookies.get('token') ||
      token ||
      null,
    [token],
  );

  const getRefreshToken = useCallback(() => {
    const storedRefreshToken =
      Cookies.get('refreshToken') ||
      localStorage.getItem('refreshToken') ||
      localStorage.getItem('mainRefreshToken');
    if (storedRefreshToken) {
      return storedRefreshToken;
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
      if (!newToken) return;

      accessTokenRef.current = newToken;
      localStorage.setItem('token', newToken);
      axios.defaults.headers.common.Authorization = `Bearer ${newToken}`;

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
      const refreshToken = getRefreshToken();
      // const refreshToken = '24c83b02-7c6e-43fd-ae29-595b8cfc89b8';

      if (!refreshToken) {
        // console.log('No refresh token available. Redirecting to login.');
        return null;
      }

      const response = await axios.post(
        `${URLS.AuthURL}/refreshtoken?refreshToken=${refreshToken}`,
        {},
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
      // alert('api gives 500 error. Session expired. Please login again.');
      // localStorage.clear();
      // Cookies.remove('token');
      // Cookies.remove('refreshToken');
      // message.error('Session expired. Please login again.');
      // window.location.href = '/login';

      return null;
    }
  }, [getRefreshToken, updateAccessToken, langType]);

  const sendRequest = useCallback(
    async (url, type = 'GET', reqData, callback, errorCallback) => {
      // const makeRequest = async (currentToken) => {
      const makeRequest = async (currentToken, hasRetried = false) => {
        const tokenToUse = currentToken || localStorage.getItem('token');
        console.log('Headers used:', {
          echHost,
          mhrHost,
          echDbName,
          echSchemaName,
          mhrDbName,
          mhrSchemaName,
          servarthId,
        });
        console.log(tokenToUse, 'tokenToUse-->>');
        const config = {
          headers: {
            'Accept-Language': langType,
            ...(tokenToUse ? { Authorization: `Bearer ${tokenToUse}` } : {}),
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

          if (typeof callback === 'function') {
            callback(response);
          }
          return response;
        } catch (error) {
          const statusCode = error.response?.status;

          if (statusCode === 401 ) {
            if (!refreshPromiseRef.current) {
              refreshPromiseRef.current = refreshAccessToken().finally(() => {
                refreshPromiseRef.current = null;
              });
            }

            const newToken = await refreshPromiseRef.current;

            if (newToken) {
              return makeRequest(newToken, true);
            }

            if (typeof errorCallback === 'function') {
              errorCallback(error.response);
            }
            return;
          }

          message.error(error.response?.data?.message || 'Request failed');

          if (typeof errorCallback === 'function') {
            errorCallback(error.response);
          }
        }
      };

      const currentToken = getAccessToken();
      return makeRequest(currentToken);
    },
    [
      langType,
      echHost,
      mhrHost,
      echDbName,
      echSchemaName,
      mhrDbName,
      mhrSchemaName,
      servarthId,
      getAccessToken,
      refreshAccessToken,
    ],
  );

  return {
    sendRequest,
  };
};

export default useAxios;
