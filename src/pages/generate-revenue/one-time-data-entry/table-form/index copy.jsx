import React, { useState } from 'react';
import { Card, Button, Table, Col, Row, Select, Input, Modal, Form, Tooltip, message } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { useHistory } from 'react-router-dom';
import { DeleteOutlined, EditTwoTone, EyeTwoTone } from '@ant-design/icons';
import VillageSelector from '@/components/eComponents/VillageSelector';
import URLS from '@/URLs/urls';
import useAxios from '@/components/eComponents/use-axios';
import { FormattedMessage, useModel } from 'umi';
import KeyPressEvents from '@/util/KeyPressEvents';
function ViewOneTimeEntry() {
  const { districtCode, talukaCode } = useModel('details');
  const { sendRequest } = useAxios();
  let history = useHistory();
  const [village, setVillage] = useState([]);
  const [codeVillage, setCodeVillage] = useState('');
  const [modalForDelete, setModalForDelete] = useState(false);
  const [recordId, setRecordId] = useState();
  const [textForVillage, setTextForVillage] = useState();
  const [khataNoValue, setkhataNoValue] = useState();
  const [revenueYear, setRevenueYear] = useState();
  const [isNirank, setIsNirank] = useState(false);
  const [flagForSearch, setFlagForSearch] = useState(false);

  function handleChangeForKhataNo(event) {
    setFlagForSearch(false);
    setkhataNoValue(event.target.value);
    setDataSource();
  }

  const addOneTimeEntry = () => {
    history.push({
      pathname: `/generate-revenue/one-time-data-entry/village-form`,
      state: {
        pageMode: 'Add',
      },
    });
  };

  const editOneTimeEntry = (record) => {
    history.push({
      pathname: `/generate-revenue/one-time-data-entry/village-form`,
      state: {
        pageMode: 'Edit',
        id: record.id,
        villageName: textForVillage,
        revenueYear: revenueYear,
        districtCode: districtCode,
        talukaCode: talukaCode,
      },
    });
  };

  const viewOneTimeEntry = (record) => {
    history.push({
      pathname: `/generate-revenue/one-time-data-entry/village-form`,
      state: {
        pageMode: 'View',
        id: record.id,
        villageName: textForVillage,
      },
    });
  };

  const deleteOneTimeEntry = (record) => {
    setRecordId(record.id);
    setModalForDelete(true);
  };

  const deleteOneTimeEntryById = async () => {
    setModalForDelete(false);
    sendRequest(
      `${URLS.BaseURL}/oneTimeEntry/discardOneTimeEntry?id=${recordId}`,
      'DELETE',
      null,
      (res) => {
        if (res.status === 226) {
          setDataSource([]);
          message.success('Deleted Successfully');
          getOneTimeEntryData();
        }
      },
    );
  };

  const [dataSoruce, setDataSource] = useState([]);

  const columns = [
    {
      key: '1',
      title: <FormattedMessage id="oneTimeEntry.form.serialNo" />,
      dataIndex: 'srNo',
    },
    {
      key: '2',
      title: <FormattedMessage id="oneTimeEntry.form.khataNo" />,
      dataIndex: 'khataNo',
    },
    {
      key: '3',
      title: <FormattedMessage id="oneTimeEntry.form.lr" />,
      dataIndex: 'preYearPendingJm',
    },
    {
      key: '4',
      title: <FormattedMessage id="oneTimeEntry.form.zp" />,
      dataIndex: 'preYearPendingZp',
    },
    {
      key: '5',
      title: <FormattedMessage id="oneTimeEntry.form.vp" />,
      dataIndex: 'preYearPendingGp',
    },
    {
      key: '6',
      title: <FormattedMessage id="oneTimeEntry.form.addlLandRevenue" />,
      dataIndex: 'preYearPendingAddlLandRevenue',
    },
    {
      key: '7',
      title: <FormattedMessage id="oneTimeEntry.form.educationalCess" />,
      dataIndex: 'preYearPendingEducationalCess',
    },
    {
      key: '8',
      title: <FormattedMessage id="oneTimeEntry.form.addlEducationalCess" />,
      dataIndex: 'preYearPendingAddlEducationalCess',
    },
    {
      key: '9',
      title: <FormattedMessage id="oneTimeEntry.form.egs" />,
      dataIndex: 'preYearPendingEmployeeGuaranteeScheme',
    },
    // {
    //   key: '10',
    //   title: <FormattedMessage id="oneTimeEntry.form.additionalCess" />,
    //   dataIndex: 'miscellaneousAmount',
    // },
    {
      key: '11',
      title: <FormattedMessage id="oneTimeEntry.form.preYearPendingNaCess" />,
      dataIndex: 'preYearPendingNaCess',
    },
    {
      key: '12',
      title: <FormattedMessage id="oneTimeEntry.form.preYearSankirnJmWith" />,
      dataIndex: 'preYearSankirnJmWith',
    },
    {
      key: '13',
      title: <FormattedMessage id="oneTimeEntry.form.preYearSankirnJmWithout" />,
      dataIndex: 'preYearSankirnJmWithout',
    },
    {
      key: '14',
      title: <FormattedMessage id="oneTimeEntry.form.preYearNoticeFee" />,
      dataIndex: 'preYearNoticeFee',
    },
    {
      key: '15',
      title: <FormattedMessage id="oneTimeEntry.form.netPending" />,
      dataIndex: 'netPending',
    },
    {
      key: '11',
      title: <FormattedMessage id="oneTimeEntry.form.action" />,
      render: (record) => {
        return (
          <>
            <Row>
              <EditTwoTone onClick={() => editOneTimeEntry(record)} />
              <DeleteOutlined
                onClick={() => deleteOneTimeEntry(record)}
                style={{ color: 'red', marginLeft: 12 }}
              />
              <EyeTwoTone
                onClick={() => viewOneTimeEntry(record)}
                style={{ color: 'violet', marginLeft: 12, marginTop: 10 }}
              />
            </Row>
          </>
        );
      },
    },
  ];

  const onCancelForDeleteModal = () => {
    setModalForDelete(false);
  };

  const getOneTimeEntryData = async () => {
    setDataSource([]);
    sendRequest(
      `${URLS.BaseURL}/oneTimeEntry/getOneTimeEntryData?districtCode=${districtCode}&talukaCode=${talukaCode}&cCode=${codeVillage}&khataNo=${khataNoValue}`,
      'GET',
      null,
      (res) => {
        setFlagForSearch(true);
        // console.log('--test data--' + res.data);
        setDataSource(
          res.data.oneTimeEntryData.map((row, index) => ({
            srNo: index + 1,
            id: row.id,
            khataNo: row.khataNo,
            preYearPendingJm: row.preYearPendingJm,
            preYearPendingGp: row.preYearPendingGp,
            preYearPendingZp: row.preYearPendingZp,
            preYearPendingAddlLandRevenue: row.preYearPendingAddlLandRevenue,
            preYearPendingEducationalCess: row.preYearPendingEducationalCess,
            preYearPendingAddlEducationalCess: row.preYearPendingAddlEducationalCess,
            preYearPendingEmployeeGuaranteeScheme: row.preYearPendingEmployeeGuaranteeScheme,
            netPending: row.netPending,
            miscellaneousAmount: row.miscellaneousAmount,
            preYearPendingNaCess: row.preYearPendingNaCess,
            preYearSankirnJmWith: row.preYearSankirnJmWith,
            preYearSankirnJmWithout: row.preYearSankirnJmWithout,
            preYearNoticeFee: row.preYearNoticeFee,
          })),
        );
        message.success('Records Fetched!');
      },
      (err) => {},
    );
  };

  return (
    <PageContainer>
      <Card bordered={false} style={{ margin: 5 }}>
        <Row>
          <Col span={21}></Col>
          <Col span={3}>
            <Button onClick={addOneTimeEntry} type="primary" style={{ margin: 10 }}>
              <FormattedMessage id="oneTimeEntry.table.add" />
            </Button>
          </Col>
        </Row>
        {/* <Row style={{ marginBottom: 10 }}> */}

        <VillageSelector
          pageType="withYear"
          setCodeVillage={setCodeVillage}
          setTextForVillage={setTextForVillage}
          onVillageChange={(setVillage, setDataSource)}
          yearChange={setRevenueYear}
          setIsNirank={setIsNirank}
        />

        {/* </Row> */}
        <Row style={{ marginTop: '40px' }}>
          <label Col span={4} htmlFor="" style={{ paddingRight: '5px' }}>
            <FormattedMessage id="oneTimeEntry.form.khataNo" /> :
          </label>
          <Col span={4}>
            <Input
              onKeyPress={KeyPressEvents.isInputNumber}
              maxLength={7}
              onChange={handleChangeForKhataNo}
            />
          </Col>
          <Col span={1}></Col>
          <Button
            type="primary"
            disabled={flagForSearch}
            /* onClick={getOneTimeEntryData} */
            onClick={() => {
              if (textForVillage && revenueYear && khataNoValue) {
                getOneTimeEntryData();
              } else if (textForVillage == null) {
                message.info('Please Select Village');
                // disableButtonTimer();
              } else if (revenueYear == null) {
                message.info('Please Select Revenue Year');
                /*      disableButtonTimer(); */
              } else if (khataNoValue == null) {
                message.info('Please Enter Khata Number');
              } else {
                message.info('Please Select Village & Revenue Year');
              }
            }} /* icon={<SearchOutlined />} */
          >
            <FormattedMessage id="oneTimeEntry.table.search" />
          </Button>
        </Row>
      </Card>
      <Card border={true}>
        <Row>
          <Col span={23}>
            <Table bordered scroll={{ x: 100 }} columns={columns} dataSource={dataSoruce} />
          </Col>
        </Row>
        <Modal
          visible={modalForDelete}
          okText={<FormattedMessage id="oneTimeEntry.table.yes" />}
          okType="danger"
          onCancel={onCancelForDeleteModal}
          cancelText={<FormattedMessage id="oneTimeEntry.table.no" />}
          onOk={deleteOneTimeEntryById}
        >
          <FormattedMessage id="oneTimeEntry.table.delete" />
        </Modal>
      </Card>
    </PageContainer>
  );
}
export default ViewOneTimeEntry;
