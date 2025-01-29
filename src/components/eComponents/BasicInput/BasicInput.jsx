import { Form, Input } from 'antd';
import React from 'react';

const BasicInput = (props) => {

  const keyPressHandler = (e) => {
    const key = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if (props.validKeys && !props.validKeys.test(key)) {
      e.preventDefault();
      return false;
    }
  };

  return (
    <Form>
      <Form.Item {...props}>
        <Input type={props.type} onKeyPress={keyPressHandler} />
      </Form.Item>
    </Form>
  );
};

export default BasicInput;
