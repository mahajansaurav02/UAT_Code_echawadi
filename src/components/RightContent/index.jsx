import { Space } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import React from 'react';
import { useModel, SelectLang } from 'umi';
import Avatar from './AvatarDropdown';
import HeaderSearch from '../HeaderSearch';
import styles from './index.less';
import NoticeIconView from '../NoticeIcon';

const GlobalHeaderRight = () => {
  const { initialState } = useModel('@@initialState');

  if (!initialState || !initialState.settings) {
    return null;
  }

  const { navTheme, layout } = initialState.settings;
  let className = styles.right;

  if ((navTheme === 'dark' && layout === 'top') || layout === 'mix') {
    className = `${styles.right}  ${styles.dark}`;
  }

  return (
    <Space className={className}>
      <HeaderSearch
        className={`${styles.action} ${styles.search}`}
        placeholder="Site Search"
        defaultValue="e-Chawdi"
        options={[
          {
            label: <a href="">Option 1</a>,
            value: 'Option 1',
          },
          {
            label: <a href="./pages/form/village-form">Village Form</a>,
            value: 'Probity Design',
          },
          {
            label: <a href="">Option 2</a>,
            value: 'Option 2',
          },
        ]} // onSearch={value => {
        //   console.log('input', value);
        // }}
      />
      {/* <span
        className={styles.action}
        onClick={() => {
          window.open('https://www.probitysoft.in');
        }}
      >
        <QuestionCircleOutlined />
      </span> */}
      {/* <NoticeIconView /> */}
      <Avatar menu />
      <SelectLang className={styles.action} />
    </Space>
  );
};

export default GlobalHeaderRight;
