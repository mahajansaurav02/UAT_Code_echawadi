import React, { useCallback } from 'react';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Menu } from 'antd';
import { history, useModel } from 'umi';
import { stringify } from 'querystring';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import { outLogin } from '@/services/ant-design-pro/api';

const loginOut = async () => {
  await outLogin();
  const { query = {}, pathname } = history.location;
  const { redirect } = query;

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
  const { logout } = useModel('Auth');

  // ✅ FIXED: Removed setInitialState - it's not available here!
  const onMenuClick = useCallback(
    (event) => {
      const { key } = event;

      if (key === 'logout') {
        // ✅ Just clear localStorage and call logout
        const currentLocale = localStorage.getItem('umi_locale');
        localStorage.clear();

        if (currentLocale) {
          localStorage.setItem('umi_locale', currentLocale);
        }

        // Call logout functions
        loginOut();
        logout();
        return;
      }

      history.push(`/account/${key}`);
    },
    [logout], // ✅ Only logout in dependencies
  );

  const menuHeaderDropdown = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
      <Menu.Item key="logout">
        <LogoutOutlined />
        Sign Out
      </Menu.Item>
    </Menu>
  );

  return (
    <HeaderDropdown overlay={menuHeaderDropdown}>
      <span className={`${styles.action} ${styles.account}`}>
        <Avatar
          size="small"
          className={styles.avatar}
          style={{ backgroundColor: '#87d068' }}
          icon={<UserOutlined />}
        />
        <span className={`${styles.name} anticon`}>{marathiName}</span>
      </span>
    </HeaderDropdown>
  );
};

export default AvatarDropdown;
