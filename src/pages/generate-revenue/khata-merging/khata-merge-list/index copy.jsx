import VillageSelector from '@/components/eComponents/VillageSelector';
import URLS from '@/URLs/urls';
import { DeleteOutlined, EditTwoTone, EyeTwoTone, SearchOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import {
  Button,
  Card,
  Col,
  Divider,
  DatePicker,
  Input,
  message,
  Modal,
  Popconfirm,
  Row,
  Alert,
  Select,
  Table,
  Tooltip,
  Form,
  Radio,
  Space,
} from 'antd';
import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import moment from 'moment';
import { useHistory, useLocation } from 'react-router-dom';
import useAxios from '@/components/eComponents/use-axios';
import { FormattedMessage, useModel } from 'umi';
import KeyPressEvents from '@/util/KeyPressEvents';
import Highlighter from 'react-highlight-words';

function khataMerging() {
  const { Option } = Select;
  const { districtName, servarthId, districtCode, talukaCode } = useModel('details');
  const [codeVillage, setCodeVillage] = useState('');
  const [textForVillage, setTextForVillage] = useState();
  const [village, setVillage] = useState([]);
  const [dataInModal, setDataInModal] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [okText, setOkText] = useState();
  const [ID, setID] = useState();
  const [mergerForm] = Form.useForm();
  const [isNirank, setIsNirank] = useState(false);
  const { sendRequest } = useAxios();
  const [revenueYear, setRevenueYear] = useState();
  const [modalForDelete, setModalForDelete] = useState(false);
  const [recordId, setRecordId] = useState();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState();
  const [mergeData, setMergeData] = useState();
  const [objForMergingTheModal, setObjForMergingTheModal] = useState();
  const [mainKhata, setMainKhata] = useState();
  const [mainKhataSelection, setMainKhataSelection] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [disableButtonForMerge, setDisableButtonForMerge] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [searchButtonState, setSearchButtonState] = useState(false);

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            शोधा
          </Button>
          <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            रीसेट
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            फिल्टर करा
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex] ? record[dataIndex].toString().toLowerCase() == value.toLowerCase() : '',
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText();
  };

  const success = () => {
    message.success('Data Saved!!');
  };

  const onCancelForDeleteModal = () => {
    setModalForDelete(false);
  };

  const saveMergedKhata = async () => {
    setIsLoading(true);

    const inputParamsForMerge = {
      ...objForMergingTheModal,
      khataNo: mainKhata,
    };
    setSearchButtonState(true);

    sendRequest(
      `${URLS.BaseURL}/khatamerge/saveMergeDtl`,
      'POST',
      inputParamsForMerge,
      (res) => {
        {
          if (res.status === 200) {
            success();
            mergerForm.resetFields();
            setMergeData(
              res.data.khataMergeDtlLst.map((r, index) => ({
                srNo: index + 1,
                parentId: r.parentId,
                idForSelector: r.khataNo,
                khataNo: r.khataNo,
                surveyHissaNo: r.surveyHissaNo,
                khataOwnerName: r.khataOwnerName,
                area: r.area,
                assessment: r.assessment,
                mergeId: r.mergeId,
              })),
            );
            setIsLoading(false);
            // setMergeData('');
            setMainKhata();
            //  setSearchButtonState(false);
          }
        }
      },
      (err) => {
        setIsLoading(false);

        // console.log('message', err.data.message);
        message.error(err.data.message);
      },
    );

    setIsModalVisible(false);
    setSelectedRowKeys();
  };

  const deleteRecordById = (record) => {
    setRecordId(record.parentId);
    setModalForDelete(true);
  };

  const deleteRecord = async (record) => {
    setModalForDelete(false);
    sendRequest(
      `${URLS.BaseURL}/khatamerge/discardMergeDtl?parentId=${recordId}`,
      'DELETE',
      null,
      (res) => {
        if (res.status === 226) {
          message.success('Record Deleted!');
          setMergeData([]);
          getDataForMerging();
        }
      },
    );
  };

  const getDataForMerging = async () => {
    setIsLoading(true);
    setDisableButtonForMerge(true);
    setSearchButtonState(true);

    sendRequest(
      `${URLS.BaseURL}/khatamerge/getKhataMergeDetails?cCode=${codeVillage}`,
      'GET',
      null,
      (res) => {
        setMergeData(
          res.data.khataMergeDtlLst.map((r, index) => ({
            srNo: index + 1,
            parentId: r.parentId,
            idForSelector: r.khataNo,
            khataNo: r.khataNo,
            surveyHissaNo: r.surveyHissaNo,
            khataOwnerName: r.khataOwnerName,
            area: r.area,
            assessment: r.assessment,
            mergeId: r.mergeId,
            childKhataNumbers: r.childKhataNumbers,
          })),
        );
        message.success('Records Fetched !');

        setIsLoading(false);
        setDisableButtonForMerge(false);
        setSearchButtonState(false);
      },
      (err) => {
        setIsLoading(false);
        message.info('No Records Found !');
      },
    );
  };

  const showModalForMerge = (record) => {
    if (objForMergingTheModal && selectedRowKeys.length > 1) {
      // console.log('records:', record);
      setDataInModal(
        record.khataMergeDtlLst.map((r) => ({
          label: r.khataNo,
          value: r.khataNo,
        })),
      );
      setIsModalVisible(true);
    } else {
      message.info('Please Select Records !');
    }
  };

  const columns = [
    {
      title: <FormattedMessage id="formLanguage.form.serialNo" />,
      dataIndex: 'srNo',
      width: '50px',
    },

    {
      title: <FormattedMessage id="demandGeneration.table.khataNo" />,
      dataIndex: 'khataNo',
      width: '50px',
      ...getColumnSearchProps('khataNo'),
    },
    {
      title: <FormattedMessage id="demandGeneration.table.mergeId" />,
      dataIndex: 'mergeId',
      width: '66px',
    },
    {
      title: <FormattedMessage id="formLanguage.form.combination" />,
      dataIndex: 'childKhataNumbers',
      width: '60px',
    },
    {
      title: <FormattedMessage id="formLanguage.table.surveyNo" />,
      dataIndex: 'surveyHissaNo',
      width: '100px',
    },

    {
      title: <FormattedMessage id="demandGeneration.table.khataOwnerName" />,
      width: '150px',
      dataIndex: 'khataOwnerName',
    },
    {
      title: <FormattedMessage id="formLanguage.form.Area" />,
      dataIndex: 'area',
      width: '56px',
    },

    {
      title: <FormattedMessage id="formLanguage.form.assessment" />,
      dataIndex: 'assessment',
      width: '65px',
    },

    {
      title: <FormattedMessage id="formLanguage.table.action" />,
      width: '56px',

      render: (record) => {
        return (
          <>
            <Row>
              {(record.mergeId && record.mergeId !== null) ||
              (record.mergeId && record.mergeId !== '') ? (
                <Col>
                  {/* <EditTwoTone onClick={() => showModalForEdit(record)} /> */}

                  <Button
                    onClick={() => deleteRecordById(record)}
                    style={{ backgroundColor: ' #ff6347', color: 'black' }}
                  >
                    डिलीट
                  </Button>

                  {/* <EyeTwoTone
                  onClick={() => showModalForView(record)}
                  style={{ color: 'violet', marginLeft: 12, marginTop: 10 }}
                /> */}
                </Col>
              ) : (
                ''
              )}
            </Row>
          </>
        );
      },
    },
  ];

  const onSelectChange = (selectedRowKeys, selectedRows) => {
    setSelectedRowKeys(selectedRowKeys);
    // console.log('selectedRowKeys', selectedRowKeys, 'selectedRows', selectedRows);
    var selectedRecords = [];
    selectedRows.map((row) => {
      //? mapped all the data here!
      selectedRecords.push({
        khataNo: row.khataNo,
        khataOwnerName: row.khataOwnerName,
        surveyHissaNo: row.surveyHissaNo,
        area: row.area,
        assessment: row.assessment,
        mergeId: row.mergeId,
      });
    });

    var objForMergingModal = {
      // revenueYear: revenueYear,
      districtCode: districtCode,
      talukaCode: talukaCode,
      cCode: codeVillage,
      khataMergeDtlLst: selectedRecords,
    };

    setObjForMergingTheModal(objForMergingModal);
  };

  const rowSelection = {
    selectedRowKeys,
    selectedRows,
    onChange: onSelectChange,
    getCheckboxProps: (record) => ({
      disabled: record.mergeId !== '',
      // Column configuration not to be checked
    }),
  };

  const [selectionType, setSelectionType] = useState('checkbox');

  const handleCancelForModal = () => {
    setIsModalVisible(false);
  };

  return (
    <div>
      <PageContainer>
        <Card>
          <VillageSelector
            pageType="withoutYear"
            setCodeVillage={setCodeVillage}
            setTextForVillage={setTextForVillage}
            onVillageChange={(setVillage, setMergeData)}
            yearChange={setRevenueYear}
            setIsNirank={setIsNirank}
          />
          <Row>
            <Col xl={2} lg={2} md={2} sm={2} xs={2}>
              <Button
                type="primary"
                disabled={searchButtonState}
                onClick={() => {
                  if (textForVillage) {
                    getDataForMerging();
                  } else if (textForVillage == null) {
                    message.info('Please Select Village');
                  }
                }}
              >
                <FormattedMessage id="formLanguage.button.search" />
              </Button>
            </Col>
          </Row>

          <br />
          <Row>           
            <marquee>
              <span style={{ color: '#FF0800', paddingLeft: '5px' }}>
                <h4 style={{ color: '#FF0800' }}>
                   
                  टीप * वरील खाता एकत्रीकरण सुविधेमध्ये मागील वर्षातील केवळ असेच खाते दर्शविण्यात
                  आले आहे ज्या खातेदार नावामध्ये कोणताही बदल झालेला नाही. * तलाठी यांनी मागणी
                  निश्चिती करतांना गावातील सर्व खातेदारांची दरवर्षी एकत्रीकरण करण्यासाठी पडताळणी
                  करून खाता एकत्रीकरण प्रक्रिया हाती घ्यावयाची आहे.
                </h4>
              </span>
            </marquee>
          </Row>

          {/* <Row>
            <Col>
              <Alert
                message="टीप"
                description="वरील खाता एकत्रीकरण सुविधेमध्ये मागील वर्षातील केवळ असेच खाते दर्शविण्यात आले आहे ज्या खातेदार नावामध्ये कोणताही बदल झालेला नाही."
                type="info"
                showIcon
              />
              <Alert
                message="टीप"
                description="तलाठी यांनी मागणी निश्चिती करतांना गावातील सर्व खातेदारांची दरवर्षी पळताळणी करून खाता एकत्रीकरण प्रक्रिया हाती घ्यावयाची आहे."
                type="info"
                showIcon
              />
            </Col>
          </Row>
          <Divider></Divider> */}
          <Card style={{ marginTop: 20 }}>
            <Table
              rowSelection={{
                type: selectionType,
                ...rowSelection,
              }}
              onChange={() => rowSelection}
              rowKey={(r) => r.idForSelector}
              bordered={true}
              scroll={{ y: 450, x: 1100 }}
              columns={columns}
              dataSource={mergeData}
              loading={isLoading}
            ></Table>
          </Card>
          <Row style={{ marginTop: '25px' }}>
            <Col xl={2} lg={2} md={2} sm={24} xs={24}>
              <Button
                type="primary"
                disabled={disableButtonForMerge}
                onClick={() => showModalForMerge(objForMergingTheModal)}
              >
                Merge
              </Button>
            </Col>
          </Row>
        </Card>
        <Modal
          title={<FormattedMessage id="formLanguage.form.popForDelete" />}
          visible={modalForDelete}
          okText={<FormattedMessage id="formLanguage.form.yes" />}
          okType="danger"
          cancelText={<FormattedMessage id="formLanguage.form.no" />}
          onCancel={onCancelForDeleteModal}
          onOk={deleteRecord}
        ></Modal>

        <Modal
          width={500}
          title={<FormattedMessage id="villageForm1A.table.editRecords" />}
          visible={isModalVisible}
          okText={okText}
          onOk={saveMergedKhata}
          onCancel={handleCancelForModal}
        >
          <Form form={mergerForm} layout="vertical">
            <Row style={{ paddingTop: 10 }}>
              <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                <Form.Item
                  name="khataNo"
                  label={<FormattedMessage id="formLanguage.form.labelForModal" />}
                  required={true}
                >
                  <Select
                    options={dataInModal}
                    // onKeyPress={KeyPressEvents.isInputVarchar}
                    //  disabled={inputState}
                    // defaultValue={mainKhata}
                    onChange={(e) => {
                      setMainKhata(e);
                    }}
                    // onSelect={(e) => {
                    //   setMainKhataSelection(e);
                    // }}
                  ></Select>
                </Form.Item>
              </Col>
              {/* <Col span={7}>
                <Form.Item name="khataOwnerName" label="Please Select Khata Owner Name">
                  <Input
                    // onKeyPress={KeyPressEvents.isInputVarchar}
                    //  disabled={inputState}
                    defaultValue={khatedarName}
                    // onChange={(e) => {
                    //   setMainKhata(e);
                    // }}
                  ></Input>
                </Form.Item>
              </Col> */}
            </Row>
          </Form>
        </Modal>
      </PageContainer>
    </div>
  );
}

export default khataMerging;
