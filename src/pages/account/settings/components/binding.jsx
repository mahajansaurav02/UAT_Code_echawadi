import { AlipayOutlined, DingdingOutlined, TaobaoOutlined } from '@ant-design/icons';
import { List } from 'antd';
import React, { Fragment } from 'react';

const BindingView = () => {
  const getData = () => [
    {
      title: 'Bind Taobao',
      description: 'Taobao account is not currently bound',
      actions: [<a key="Bind">BIND</a>],
      avatar: <TaobaoOutlined className="taobao" />,
    },
    {
      title: 'Bind Alipay',
      description: 'Alipay account is not currently bound',
      actions: [<a key="Bind">BIND</a>],
      avatar: <AlipayOutlined className="alipay" />,
    },
    {
      title: 'Binding DingTalk',
      description: 'DingTalk account is not currently bound',
      actions: [<a key="Bind">BIND</a>],
      avatar: <DingdingOutlined className="dingding" />,
    },
  ];

  return (
    <Fragment>
      <List
        itemLayout="horizontal"
        dataSource={getData()}
        renderItem={(item) => (
          <List.Item actions={item.actions}>
            <List.Item.Meta
              avatar={item.avatar}
              title={item.title}
              description={item.description}
            />
          </List.Item>
        )}
      />
    </Fragment>
  );
};

export default BindingView;
