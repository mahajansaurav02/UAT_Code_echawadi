---
title: Business Component
sidemenu: false
---

> This feature is provided by[dumi](https://d.umijs.org/zh-CN/guide/advanced#umi-%E9%A1%B9%E7%9B%AE%E9%9B%86%E6%88%90%E6%A8%A1%E5%BC%8F)Provied, dumi is an 📖 The documentation tools born for component development scenarios are good for those who have used them.

# Business Component

Lister here Pro All of the components used in these components are not suitable as component libraries, but they are actually needed in the business. So we prepared this document to guide you whether you need to use this component.

## Footer Component

This component comes with some Pro configuration, you generally need to change its information.

```tsx
/**
 * background: '#f0f2f5'
 */
import React from 'react';
import Footer from '@/components/Footer';

export default () => <Footer />;
```

## HeaderDropdown Header drop-down list

HeaderDropdown 是 antd Dropdown The package, but with the addition of special processing on the mobile terminal, the usage is the same.

```tsx
/**
 * background: '#f0f2f5'
 */
import { Button, Menu } from 'antd';
import React from 'react';
import HeaderDropdown from '@/components/HeaderDropdown';

export default () => {
  const menuHeaderDropdown = (
    <Menu selectedKeys={[]}>
      <Menu.Item key="center">Personal Center</Menu.Item>
      <Menu.Item key="settings">Personal Settings</Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout">Sign Out</Menu.Item>
    </Menu>
  );
  return (
    <HeaderDropdown overlay={menuHeaderDropdown}>
      <Button>Show Menu</Button>
    </HeaderDropdown>
  );
};
```

## HeaderSearch

An input box with complete data, supports collapse and expand Input

```tsx
/**
 * background: '#f0f2f5'
 */
import { Button, Menu } from 'antd';
import React from 'react';
import HeaderSearch from '@/components/HeaderSearch';

export default () => {
  return (
    <HeaderSearch
      placeholder="Site Search"
      defaultValue="umi ui"
      options={[
        { label: 'Ant Design Pro', value: 'Ant Design Pro' },
        {
          label: 'Ant Design',
          value: 'Ant Design',
        },
        {
          label: 'Pro Table',
          value: 'Pro Table',
        },
        {
          label: 'Pro Layout',
          value: 'Pro Layout',
        },
      ]}
      onSearch={(value) => {
        console.log('input', value);
      }}
    />
  );
};
```

### API

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | The value of the input box | `string` | - |
| onChange | Triggered after the value is modified | `(value?: string) => void` | - |
| onSearch | Triggered after query | `(value?: string) => void` | - |
| options | List of options menu | `{label,value}[]` | - |
| defaultVisible | Whether the input box is displayed by default, it only takes effect the first time | `boolean` | - |
| visible |  | `boolean` | - |
| onVisibleChange | The input box shows the hidden callback function | `(visible: boolean) => void` | - |

## NoticeIcon

The notification tool provides an interface for displaying various notification information。

```tsx
/**
 * background: '#f0f2f5'
 */
import { message } from 'antd';
import React from 'react';
import NoticeIcon from '@/components/NoticeIcon/NoticeIcon';

export default () => {
  const list = [
    {
      id: '000000001',
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png',
      title: 'You have received 14 new weekly reports',
      datetime: '2017-08-09',
      type: 'notification',
    },
    {
      id: '000000002',
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/OKJXDXrmkNshAMvwtvhu.png',
      title: 'Your recommended Qu Nini has passed the third round of interviews',
      datetime: '2017-08-08',
      type: 'notification',
    },
  ];
  return (
    <NoticeIcon
      count={10}
      onItemClick={(item) => {
        message.info(`${item.title} Was Clicked`);
      }}
      onClear={(title: string, key: string) => message.info('Click to clear more')}
      loading={false}
      clearText="Empty"
      viewMoreText="see more"
      onViewMore={() => message.info('Click to see more')}
      clearClose
    >
      <NoticeIcon.Tab
        tabKey="notification"
        count={2}
        list={list}
        title="Notice"
        emptyText="You have viewed all notifications"
        showViewMore
      />
      <NoticeIcon.Tab
        tabKey="message"
        count={2}
        list={list}
        title="Information"
        emptyText="You have read all the messages"
        showViewMore
      />
      <NoticeIcon.Tab
        tabKey="event"
        title="Upcoming"
        emptyText="You have completed all to-do"
        count={2}
        list={list}
        showViewMore
      />
    </NoticeIcon>
  );
};
```

### NoticeIcon API

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| count | 有多少未读通知 | `number` | - |
| bell | 铃铛的图表 | `ReactNode` | - |
| onClear | 点击清空数据按钮 | `(tabName: string, tabKey: string) => void` | - |
| onItemClick | 未读消息列被点击 | `(item: API.NoticeIconData, tabProps: NoticeIconTabProps) => void` | - |
| onViewMore | 查看更多的按钮点击 | `(tabProps: NoticeIconTabProps, e: MouseEvent) => void` | - |
| onTabChange | 通知 Tab 的切换 | `(tabTile: string) => void;` | - |
| popupVisible | 通知显示是否展示 | `boolean` | - |
| onPopupVisibleChange | 通知信息显示隐藏的回调函数 | `(visible: boolean) => void` | - |
| clearText | 清空按钮的文字 | `string` | - |
| viewMoreText | 查看更多的按钮文字 | `string` | - |
| clearClose | 展示清空按钮 | `boolean` | - |
| emptyImage | 列表为空时的兜底展示 | `ReactNode` | - |

### NoticeIcon.Tab API

| 参数         | 说明               | 类型                                 | 默认值 |
| ------------ | ------------------ | ------------------------------------ | ------ |
| count        | 有多少未读通知     | `number`                             | -      |
| title        | 通知 Tab 的标题    | `ReactNode`                          | -      |
| showClear    | 展示清除按钮       | `boolean`                            | `true` |
| showViewMore | 展示加载更         | `boolean`                            | `true` |
| tabKey       | Tab 的唯一 key     | `string`                             | -      |
| onClick      | 子项的单击事件     | `(item: API.NoticeIconData) => void` | -      |
| onClear      | 清楚按钮的点击     | `()=>void`                           | -      |
| emptyText    | 为空的时候测试     | `()=>void`                           | -      |
| viewMoreText | 查看更多的按钮文字 | `string`                             | -      |
| onViewMore   | 查看更多的按钮点击 | `( e: MouseEvent) => void`           | -      |
| list         | 通知信息的列表     | `API.NoticeIconData`                 | -      |

### NoticeIconData

```tsx | pure
export interface NoticeIconData {
  id: string;
  key: string;
  avatar: string;
  title: string;
  datetime: string;
  type: string;
  read?: boolean;
  description: string;
  clickClose?: boolean;
  extra: any;
  status: string;
}
```

## RightContent

RightContent 是以上几个组件的组合，同时新增了 plugins 的 `SelectLang` 插件。

```tsx | pure
<Space>
  <HeaderSearch
    placeholder="Site Search"
    defaultValue="umi ui"
    options={[
      { label: <a href="https://umijs.org/zh/guide/umi-ui.html">umi ui</a>, value: 'umi ui' },
      {
        label: <a href="next.ant.design">Ant Design</a>,
        value: 'Ant Design',
      },
      // {
      //   label: <a href="https://protable.ant.design/">Pro Table</a>,
      //   value: 'Pro Table',
      // },
      // {
      //   label: <a href="https://prolayout.ant.design/">Pro Layout</a>,
      //   value: 'Pro Layout',
      // },
    ]}
  />
  <Tooltip title="Use documentation">
    <span
      className={styles.action}
      onClick={() => {
        window.location.href = 'https://pro.ant.design/docs/getting-started';
      }}
    >
      <QuestionCircleOutlined />
    </span>
  </Tooltip>
  <Avatar />
  {REACT_APP_ENV && (
    <span>
      <Tag color={ENVTagColor[REACT_APP_ENV]}>{REACT_APP_ENV}</Tag>
    </span>
  )}
  <SelectLang className={styles.action} />
</Space>
```
