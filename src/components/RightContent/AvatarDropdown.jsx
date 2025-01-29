import React, { useCallback, useEffect } from 'react';
import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Menu, Spin, notification, message, Button } from 'antd';
import { history, useModel } from 'umi';
import { stringify } from 'querystring';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import { outLogin } from '@/services/ant-design-pro/api';

/**
 * Log out and change the current,, url ,,save
 */
// const villageData = localStorage.getItem('villageData1');
// const roles = JSON.parse(localStorage.getItem('roles'));
// const role = roles[0];
//console.info(role, '----------roles');

const loginOut = async () => {
  await outLogin();
  const { query = {}, pathname } = history.location;

  const { redirect } = query; // Note: There may be security issues, please note

  if (window.location.pathname !== '/user/login' && !redirect) {
    history.replace({
      pathname: '/user/login',
      search: stringify({
        redirect: pathname,
      }),
    });
  }
};

const AvatarDropdown = ({ menu }) => {
  const { marathiName } = useModel('details');
  const { logout, token, toastTimer } = useModel('Auth');
  useEffect(() => {
    if (token === '') {
      //  loginOut();
    }
  }, [token]);

  // useEffect(() => {
  //   if (toastTimer) {
  //     notification.open({
  //       type: 'info',
  //       message: 'Logout Timer',
  //       description: 'You will be logged out in 15 minutes! Click to Extend !!',
  //       duration: 15,
  //       placement: 'topRight',
  //       onClick: () => {
  //         message.success('Logout Timer Reset');
  //       },
  //     });
  //   }
  // }, [toastTimer]);

  const { initialState, setInitialState } = useModel('@@initialState');
  const onMenuClick = useCallback(
    (event) => {
      const { key } = event;

      if (key === 'logout') {
        setInitialState((s) => ({ ...s, currentUser: undefined }));
        loginOut();
        logout();
        return;
      }

      history.push(`/account/${key}`);
    },
    [setInitialState],
  );
  const loading = (
    <span className={`${styles.action} ${styles.account}`}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (!initialState) {
    return loading;
  }

  const { currentUser } = initialState;

  if (!currentUser || !currentUser.name) {
    return loading;
  }

  const menuHeaderDropdown = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
      {/* {menu && (
        <Menu.Item key="center">
          <UserOutlined />
          Personal Center
        </Menu.Item>
      )} */}
      {/* {menu && (
        <Menu.Item key="settings">
          <SettingOutlined />
          Personal Settings
        </Menu.Item>
      )} */}
      {/* {menu && <Menu.Divider />} */}

      <Menu.Item key="logout">
        <LogoutOutlined />
        Sign Out
      </Menu.Item>
    </Menu>
  );
  return (
    <HeaderDropdown overlay={menuHeaderDropdown}>
      <span className={`${styles.action} ${styles.account}`}>
        <Avatar size="small" className={styles.avatar} src={currentUser.avatar} alt="avatar" />
        {/* {role == 'ROLE_COLLECTOR' ? ( */}
        <span className={`${styles.name} anticon`}>{marathiName}</span>
        {/* ) : (
          <span className={`${styles.name} anticon`}>
            {marathiName} - {villageData ? villageData[0]?.villageName : ''}
          </span>
        )} */}
      </span>
    </HeaderDropdown>
  );
};

export default AvatarDropdown;
