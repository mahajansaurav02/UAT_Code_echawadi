import { Button, Result } from 'antd';
import { Link } from 'umi';
import React from 'react';
import styles from './style.less';
const actions = (
  <div className={styles.actions}>
    <a href="">
      <Button size="large" type="primary">
        <span>View mailbox</span>
      </Button>
    </a>
    <Link to="/">
      <Button size="large">Back to Home</Button>
    </Link>
  </div>
);

const RegisterResult = ({ location }) => {
  const email = location.state ? location.state?.account : 'AntDesign@example.com';
  return (
    <Result
      className={styles.registerResult}
      status="success"
      title={
        <div className={styles.title}>
          <span>your account:{email} registration success</span>
        </div>
      }
      subTitle="An activation email has been sent to your mailbox, and the email is valid for 24 hours. Please log in to your email in time and click the link in the email to activate your account."
      extra={actions}
    />
  );
};

export default RegisterResult;
