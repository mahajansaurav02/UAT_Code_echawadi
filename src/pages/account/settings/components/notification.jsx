import { List, Switch } from 'antd';
import React, { Fragment } from 'react';

const NotificationView = () => {
  const getData = () => {
    const Action = <Switch checkedChildren="open" unCheckedChildren="close" defaultChecked />;
    return [
      {
        title: 'account password',
        description: 'Messages from other users will be notified in the form of internal messages',
        actions: [Action],
      },
      {
        title: 'system information',
        description: 'System messages will be notified in the form of internal messages',
        actions: [Action],
      },
      {
        title: 'Upcoming Tasks',
        description: 'To-do tasks will be notified in the form of an internal letter',
        actions: [Action],
      },
    ];
  };

  const data = getData();
  return (
    <Fragment>
      <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item) => (
          <List.Item actions={item.actions}>
            <List.Item.Meta title={item.title} description={item.description} />
          </List.Item>
        )}
      />
    </Fragment>
  );
};

export default NotificationView;
