import VillageSelector from '@/components/eComponents/VillageSelector';
import { DeleteOutlined, EditTwoTone, EyeTwoTone } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card, Col, Row, Table } from 'antd';
import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import { FormattedMessage } from 'umi';
function TableForm8() {
  const [codeVillage, setCodeVillage] = useState('');
  const [textForVillage, setTextForVillage] = useState();
  const [village, setVillage] = useState([]);
  const [revenueYear, setRevenueYear] = useState();

  let history = useHistory();

  const addForm = () => {
    history.push({
      pathname: `/form/village-form-18/village-form`,
    });
  };

  const columns = [
    {
      key: '1',
      title: <FormattedMessage id="formLanguage.form.serialNo" />,
      dataIndex: 'srNo',
    },
    {
      key: '2',
      title: <FormattedMessage id="villageForm18.form.communicationReceived" />,
      dataIndex: '',
    },
    {
      key: '3',
      title: <FormattedMessage id="villageForm18.form.communicationNo" />,
      dataIndex: '',
    },
    {
      key: '4',
      title: <FormattedMessage id="villageForm18.form.dateOfReceipt" />,
      dataIndex: '',
    },
    {
      key: '5',
      title: <FormattedMessage id="villageForm18.form.actionTaken" />,
      dataIndex: '',
    },
    {
      key: '6',
      title: <FormattedMessage id="villageForm18.form.toWhomDispatched" />,
      dataIndex: '',
    },
    {
      key: '7',
      title: <FormattedMessage id="villageForm18.form.dateOfDispatch" />,
      dataIndex: '',
    },
    {
      key: '8',
      title: <FormattedMessage id="villageForm18.form.noInABCD" />,
      dataIndex: '',
    },

    {
      key: '9',
      title: <FormattedMessage id="formLanguage.table.action" />,
      width: '56px',
      render: (record) => {
        return (
          <>
            <Row>
              <Col>
                <EditTwoTone /* onClick={() => showModalForEdit(record)} */ />
                <DeleteOutlined
                  /*                     onClick={() => deleteRecord(record)}
                   */ style={{ color: 'red', marginLeft: 12 }}
                />
                <EyeTwoTone
                  /*                     onClick={() => showModalForView(record)}
                   */ style={{ color: 'violet', marginLeft: 12, marginTop: 10 }}
                />
              </Col>
            </Row>
          </>
        );
      },
    },
  ];
  return (
    <>
      <PageContainer>
        <Card>
          <VillageSelector
            setCodeVillage={setCodeVillage}
            setTextForVillage={setTextForVillage}
            onVillageChange={setVillage}
            yearChange={setRevenueYear}
          />
          <Row>
            <Col xl={2} lg={2} md={2} sm={2} xs={2}>
              <Button type="primary" /* onClick={getForm3Data} */>
                <FormattedMessage id="formLanguage.button.search" />
              </Button>
            </Col>
            <Col xl={20} lg={20} md={20} sm={16} xs={16}></Col>
            <Col xl={2} lg={2} md={2} sm={4} xs={4}>
              <Button type="primary" onClick={addForm}>
                <FormattedMessage id="formLanguage.button.add" />
              </Button>
            </Col>
          </Row>
        </Card>
        <Card>
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            <Table
              bordered
              scroll={{ x: 100 }}
              /* dataSource={VillageForm3Data} */ columns={columns}
            />
          </Col>
        </Card>
      </PageContainer>
    </>
  );
}

export default TableForm8;
