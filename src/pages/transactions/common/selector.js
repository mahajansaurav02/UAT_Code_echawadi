import React, { useState, useEffect } from 'react';
import { Button, Card, Col, Input, Row, Select } from 'antd';
import Axios from 'axios';
import { isNamedTupleMember } from 'typescript';
import BaseURL from '@/URLs/urls';

// class FormValidator{
//   constructor(validations)
// }

//const { Option } = Select;
// const provinceData = ['Pune', 'Mumbai', 'Nashik'];
// const cityData = {
//   Pune: ['Pune City', 'Baramati', 'Maval'],
//   Mumbai: ['Navi Mumbai', 'Badlapur', 'Thane'],
// };

function Selector() {
  const [village, setVillage] = useState([]);

  useEffect(() => {
    getData();
  }, []);
  const getData = async () => {
    await Axios.get(`${BaseURL}/restservice/getVillageListByUser?username=admin`).then((res) => {
      //setloading(false);
      // console.log('--test data--' + res.data);
      // setVillage();

      setVillage(
        res.data.map((row) => ({
          label: row.villageName,
          value: row.cCode,
        })),
      );
    });
  };

  return (
    <div>
      {/* <Button onClick={getData()}>test</Button> */}
      <Row style={{ marginBottom: 10 }}>
        <Col span={24}>
          <label htmlFor="" style={{ paddingRight: '5px' }}>
            District :{' '}
          </label>
          <Select
            disabled
            placeholder="अमरावती"
            style={{ width: 150, marginRight: '15px' }}
          ></Select>
          <label htmlFor="" style={{ paddingRight: '5px' }}>
            Taluka :{' '}
          </label>
          <Select
            disabled
            placeholder="अचलपूर"
            style={{ width: 150, marginRight: '15px' }}
          ></Select>
          <label htmlFor="" style={{ paddingRight: '5px' }}>
            Village :
          </label>
          <Select
            style={{ width: 200, marginRight: '15px' }}
            options={village}
            placeholder="Please Select Village"
          ></Select>
        </Col>
      </Row>
    </div>
  );
}

export default Selector;
