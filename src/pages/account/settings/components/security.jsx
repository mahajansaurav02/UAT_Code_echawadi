import React from 'react';
import { List } from 'antd';
const passwordStrength = {
  strong: <span className="strong">powerful</span>,
  medium: <span className="medium">middle</span>,
  weak: <span className="weak"> Weak</span>,
};

const SecurityView = () => {
  const getData = () => [
    {
      title: 'account password',
      description: (
        <>
          Current password strength:
          {passwordStrength.strong}
        </>
      ),
      actions: [<a key="Modify">Revise</a>],
    },
    {
      title: 'secret phone',
      description: `Binding mobile phone: 138****8293`,
      actions: [<a key="Modify">Revise</a>],
    },
    {
      title: 'Security Question',
      description: 'No security questions are set, which can effectively protect account security',
      actions: [<a key="Set">set up</a>],
    },
    {
      title: 'Backup email',
      description: `Binding email: ant***sign.com`,
      actions: [<a key="Modify">Revise</a>],
    },
    {
      title: 'MFA equipment',
      description: 'unbound MFA After the device is bound, it can be confirmed twice',
      actions: [<a key="bind">bind</a>],
    },
  ];

  const data = getData();
  return (
    <>
      <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item) => (
          <List.Item actions={item.actions}>
            <List.Item.Meta title={item.title} description={item.description} />
          </List.Item>
        )}
      />
    </>
  );
};

export default SecurityView;
