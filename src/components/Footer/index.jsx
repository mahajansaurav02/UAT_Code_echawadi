import { useIntl } from 'umi';
import { LinkedinOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-layout';
import { Col, Row } from 'antd';
export default () => {
  const intl = useIntl();
  const defaultMessage = intl.formatMessage({
    id: '001',
    defaultMessage: 'महसूल विभाग महाराष्ट्र',
  });
  const currentYear = new Date().getFullYear();
  return (
    <>
      <DefaultFooter
        copyright={`${currentYear} ${defaultMessage}`}
        links={
          [
            // {
            //   key: 'Probity Software',
            //   title: '',
            //   href: 'https://www.probitysoft.in',
            //   blankTarget: true,
            // },
            // {
            //   key: 'linkedin',
            //   title: <LinkedinOutlined />,
            //   href: 'https://in.linkedin.com/company/probity-soft-pvt-ltd',
            //   blankTarget: true,
            // },
          ]
        }
      />
    </>
  );
};
