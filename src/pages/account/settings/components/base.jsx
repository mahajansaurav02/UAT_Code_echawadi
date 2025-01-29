import React from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Input, Upload, message } from 'antd';
import ProForm, {
  ProFormDependency,
  ProFormFieldSet,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-form';
import { useRequest } from 'umi';
import { queryCurrent } from '../service';
import { queryProvince, queryCity } from '../service';
import styles from './BaseView.less';

const validatorPhone = (rule, value, callback) => {
  if (!value[0]) {
    callback('Please input your area code!');
  }

  if (!value[1]) {
    callback('Please input your phone number!');
  }

  callback();
}; // The avatar component is convenient to be independent in the future, and functions such as cropping can be added.

const AvatarView = ({ avatar }) => (
  <>
    <div className={styles.avatar_title}>Avatar</div>
    <div className={styles.avatar}>
      <img src={avatar} alt="avatar" />
    </div>
    <Upload showUploadList={false}>
      <div className={styles.button_view}>
        <Button>
          <UploadOutlined />
          Change Avatar
        </Button>
      </div>
    </Upload>
  </>
);

const BaseView = () => {
  const { data: currentUser, loading } = useRequest(() => {
    return queryCurrent();
  });

  const getAvatarURL = () => {
    if (currentUser) {
      if (currentUser.avatar) {
        return currentUser.avatar;
      }

      const url = 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';
      return url;
    }

    return '';
  };

  const handleFinish = async () => {
    message.success('Success');
  };

  return (
    <div className={styles.baseView}>
      {loading ? null : (
        <>
          <div className={styles.left}>
            <ProForm
              layout="vertical"
              onFinish={handleFinish}
              submitter={{
                resetButtonProps: {
                  style: {
                    display: 'none',
                  },
                },
                submitButtonProps: {
                  children: 'Update basic information',
                },
              }}
              initialValues={{ ...currentUser, phone: currentUser?.phone.split('-') }}
              hideRequiredMark
            >
              <ProFormText
                width="md"
                name="email"
                label="Mail"
                rules={[
                  {
                    required: true,
                    message: 'Please Enter Your Email',
                  },
                ]}
              />
              <ProFormText
                width="md"
                name="name"
                label="Nick Name"
                rules={[
                  {
                    required: true,
                    message: 'Please Enter Your Nickname!',
                  },
                ]}
              />
              <ProFormTextArea
                name="profile"
                label="Introduction"
                rules={[
                  {
                    required: true,
                    message: 'Please Enter a Profile',
                  },
                ]}
                placeholder="Personal Profile"
              />
              <ProFormSelect
                width="sm"
                name="country"
                label="India"
                rules={[
                  {
                    required: true,
                    message: 'Please Enter Your State!',
                  },
                ]}
                options={[
                  {
                    label: 'India',
                    value: 'India',
                  },
                ]}
              />

              <ProForm.Group title="City" size={8}>
                <ProFormSelect
                  rules={[
                    {
                      required: true,
                      message: 'Please Enter Your Province',
                    },
                  ]}
                  width="sm"
                  fieldProps={{
                    labelInValue: true,
                  }}
                  name="province"
                  className={styles.item}
                  request={async () => {
                    return queryProvince().then(({ data }) => {
                      return data.map((item) => {
                        return {
                          label: item.name,
                          value: item.id,
                        };
                      });
                    });
                  }}
                />
                <ProFormDependency name={['province']}>
                  {({ province }) => {
                    return (
                      <ProFormSelect
                        params={{
                          key: province?.value,
                        }}
                        name="city"
                        width="sm"
                        rules={[
                          {
                            required: true,
                            message: 'Please Enter Your City!',
                          },
                        ]}
                        disabled={!province}
                        className={styles.item}
                        request={async () => {
                          if (!province?.key) {
                            return [];
                          }

                          return queryCity(province.key || '').then(({ data }) => {
                            return data.map((item) => {
                              return {
                                label: item.name,
                                value: item.id,
                              };
                            });
                          });
                        }}
                      />
                    );
                  }}
                </ProFormDependency>
              </ProForm.Group>
              <ProFormText
                width="md"
                name="address"
                label="Street address"
                rules={[
                  {
                    required: true,
                    message: 'Please Enter your Street Address!',
                  },
                ]}
              />
              <ProFormFieldSet
                name="phone"
                label="Contact Number"
                rules={[
                  {
                    required: true,
                    message: 'Please Enter Your Contact Number!',
                  },
                  {
                    validator: validatorPhone,
                  },
                ]}
              >
                <Input className={styles.area_code} />
                <Input className={styles.phone_number} />
              </ProFormFieldSet>
            </ProForm>
          </div>
          <div className={styles.right}>
            <AvatarView avatar={getAvatarURL()} />
          </div>
        </>
      )}
    </div>
  );
};

export default BaseView;
