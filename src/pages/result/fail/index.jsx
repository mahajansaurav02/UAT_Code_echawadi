import { CloseCircleOutlined, RightOutlined } from '@ant-design/icons';
import { Button, Card, Result } from 'antd';
import { Fragment } from 'react';
import { GridContent } from '@ant-design/pro-layout';
import styles from './index.less';
const Content = (
  <Fragment>
    <div className={styles.title}>
      <span>Your submission contains the following errors:</span>
    </div>
    <div
      style={{
        marginBottom: 16,
      }}
    >
      <CloseCircleOutlined
        style={{
          marginRight: 8,
        }}
        className={styles.error_icon}
      />
      <span>您的账户已被冻结</span>
      <a
        style={{
          marginLeft: 16,
        }}
      >
        <span>立即解冻</span>
        <RightOutlined />
      </a>
    </div>
    <div>
      <CloseCircleOutlined
        style={{
          marginRight: 8,
        }}
        className={styles.error_icon}
      />
      <span>Your account is not yet eligible to apply</span>
      <a
        style={{
          marginLeft: 16,
        }}
      >
        <span>upgrade immediately</span>
        <RightOutlined />
      </a>
    </div>
  </Fragment>
);
export default () => (
  <GridContent>
    <Card bordered={false}>
      <Result
        status="error"
        title="提交失败"
        subTitle="Please check and modify the following information before resubmitting."
        extra={
          <Button type="primary">
            <span>Back to modify</span>
          </Button>
        }
        style={{
          marginTop: 48,
          marginBottom: 16,
        }}
      >
        {Content}
      </Result>
    </Card>
  </GridContent>
);
