import React, { useEffect, useState } from 'react';

import {
  Button,
  Card,
  Checkbox,
  Col,
  Divider,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Radio,
  Row,
  Select,
  Table,
  Tooltip,
} from 'antd';
import VillageSelector from '@/components/eComponents/VillageSelector';
import URLS from '@/URLs/urls';
import useAxios from '@/components/eComponents/use-axios';
import { FormattedMessage, useModel } from 'umi';
import KeyPressEvents from '@/util/KeyPressEvents';
import { DeleteOutlined, EditTwoTone, EyeTwoTone } from '@ant-design/icons';

function Target() {
  const [village, setVillage] = useState([]);
  const [modalForDelete, setModalForDelete] = useState(false);
  const [codeVillage, setCodeVillage] = useState();
  const [textForVillage, setTextForVillage] = useState();
  const [revenueYear, setRevenueYear] = useState();
  const [isNirank, setIsNirank] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [loadingForSave, setLoadingForSave] = useState(false);
  const [formVisibility, setFormVisibility] = useState(true);
  const [targetForm] = Form.useForm();
  const [modalForm] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [inputState, setInputState] = useState();
  const [dataInModal, setDataInModal] = useState();
  const [okText, setOkText] = useState();
  const [recordId, setRecordId] = useState();
  const [ID, setID] = useState();
  const [villageTarget, setVillageTarget] = useState();
  const { sendRequest } = useAxios();
  const [form] = Form.useForm();
  const { servarthId, talukaName, districtName, villageData, districtCode, talukaCode } =
    useModel('details');

  useEffect(() => {
    // console.log('village name', textForVillage);
  }, []);

  const resetData = () => {
    targetForm.resetFields();
  };

  const handleChangeForTarget = (e) => {
    setVillageTarget(e);
  };

  const onFinish = async () => {
    setLoadingForSave(true);
    const inputParams = {
      cCode: codeVillage,
      revenueYear: revenueYear,
      villageName: textForVillage,
      districtCode: districtCode,
      talukaCode: talukaCode,
      annualVillageTarget: targetForm.getFieldValue('target'),
    };
    sendRequest(
      `${URLS.BaseURL}/restservice/saveTalathiTarget`,
      'POST',
      inputParams,
      (res) => {
        if (res.status === 201) {
          message.success('Record Saved !');

          getAllDetails();
          setLoadingForSave(false);
          setFormVisibility(true);
        }
      },
      (err) => {
        setLoadingForSave(false);
        message.error('Data Already Exist');
      },
    );
  };

  const getAllDetails = async () => {
    setIsLoading(true);
    sendRequest(
      `${URLS.BaseURL}/restservice/getVillageTarget?cCode=${codeVillage}&revenueYear=${revenueYear}`,
      'GET',
      null,
      (res) => {
        setTableData(
          res.data.talathiDashBoardData.map((r, index) => ({
            srNo: index + 1,
            id: r.id,
            cCode: r.cCode,
            villageName: villageData?.find((v) => v?.cCode == r?.cCode)?.villageName,
            revenueYear: r.revenueYear,
            annualVillageTarget: r.annualVillageTarget,
          })),
        );

        message.success('Records Fetched!');
        setIsLoading(false);
      },
      (err) => {},
      setIsLoading(false),
    );
  };

  const onCancelForDelete = () => {
    setModalForDelete(false);
  };

  const handleCancelForModal = () => {
    setIsModalVisible(false);
  };

  // const deleteRecord = async (record) => {
  //   setModalForDelete(false);
  //   // sendRequest(
  //   //   `${URLS.BaseURL}/form19/discardForm19?id=${recordId}`,
  //   //   'DELETE',
  //   //   null,
  //   //   (res) => {
  //   //     if (res.status == 226) {
  //   //       message.success('Record Deleted !');
  //   //       setVillageForm19Data([]);
  //   //       getForm19Data();
  //   //     }
  //   //   },
  //   // );
  // };

  const showModalForEdit = (record) => {
    form.resetFields();
    setDataInModal({});
    setDataInModal({
      id: record.id,
      //   cCode: codeVillage,
      annualVillageTarget: record.annualVillageTarget,
    });
    setInputState(false);
    setIsModalVisible(true);
    setOkText('Save');
    setID(record.id);
  };

  // const showModalForView = (record) => {
  //   form.resetFields();
  //   setDataInModal({
  //     //  id: record.id,
  //     //  //  cCode: codeVillage,
  //     //  descriptionOfArticle: record.descriptionOfArticle,
  //     //  authorityOfPurchase: record.authorityOfPurchase,
  //     //  numberOrQuantity: record.numberOrQuantity,
  //     //  dateOfPurchase: record.dateOfPurchase,
  //     //  authorityOfVoucher: record.authorityOfVoucher,
  //     //  amountWrittenOff: record.amountWrittenOff,
  //     //  amountRealized: record.amountRealized,
  //     //  dateOfCreditAtTreasury: record.dateOfCreditAtTreasury,
  //     //  number: record.number,
  //     //  value: record.value,
  //     //  remarks: record.remarks,
  //     //  sajjaCode: record.sajjaCode,
  //   });
  //   setInputState(true);
  //   setIsModalVisible(true);
  //   setOkText('Okay');
  // };

  const editTargetForm = async () => {
    setConfirmLoading(true);

    const parametersForEdit = {
      revenueYear: revenueYear,
      districtCode: districtCode,
      talukaCode: talukaCode,
      cCode: codeVillage,

      id: ID,
      annualVillageTarget: dataInModal.annualVillageTarget,
    };
    if (okText === 'Save') {
      // console.log(parametersForEdit);
      sendRequest(
        `${URLS.BaseURL}/restservice/editTalathiTarget`,
        'PUT',
        parametersForEdit,
        (res) => {
          if (res.status === 200) {
            message.success('Data Updated!');
            getAllDetails();
            setConfirmLoading(false);
            setIsModalVisible(false);
          }
        },
        (err) => {
          setIsModalVisible(false);
          setConfirmLoading(false);
        },
      );
    }
  };

  const columns = [
    {
      key: '1',
      title: <FormattedMessage id="formLanguage.form.serialNo" />,
      dataIndex: 'srNo',
    },
    {
      key: '2',
      title: <FormattedMessage id="villageForm.form.allVillageName" />,
      dataIndex: 'villageName',
    },
    {
      key: '3',
      title: <FormattedMessage id="formLanguage.form.revYear" />,
      dataIndex: 'revenueYear',
    },
    {
      key: '4',
      title: <FormattedMessage id="formLanguage.form.target" />,
      dataIndex: 'annualVillageTarget',
    },

    {
      key: '8',
      title: <FormattedMessage id="formLanguage.table.action" />,
      width: '56px',
      render: (record) => {
        return (
          <>
            <Row>
              <Col>
                <EditTwoTone onClick={() => showModalForEdit(record)} />
                {/* <DeleteOutlined
                  onClick={() => deleteRecord(record)}
                  style={{ color: 'red', marginLeft: 12 }}
                /> */}
              </Col>
            </Row>
          </>
        );
      },
    },
  ];

  return (
    <div>
      <Card bordered={false}>
        <h1>
          <center>
            <FormattedMessage id="formLanguage.form.target" />
          </center>
        </h1>

        <Row>
          <Col xl={21} lg={21} md={21} sm={24} xs={24}>
            <VillageSelector
              pageType="withYear"
              setCodeVillage={setCodeVillage}
              setTextForVillage={setTextForVillage}
              onVillageChange={(setVillage, setTableData)}
              yearChange={setRevenueYear}
              setIsNirank={setIsNirank}
            />
          </Col>
          {/*   <Col span={1}></Col> */}
          <Col xl={3} lg={3} md={3} sm={24} xs={24}>
            <Button
              style={{ marginTop: '10px' }}
              loading={loading}
              onClick={() => {
                if (textForVillage && revenueYear) {
                  getAllDetails();
                } else if (textForVillage == null) {
                  message.info('Please Select Village');
                } else if (revenueYear == null) {
                  message.info('Please Select Revenue Year');
                }
              }}
              type="primary"
            >
              <FormattedMessage id="formLanguage.button.search" />
            </Button>
          </Col>
        </Row>

        {formVisibility === false ? (
          <>
            <Form form={targetForm} layout="vertical">
              <Row style={{ marginTop: '40px' }}>
                <Col xl={8} lg={8} md={8} sm={24} xs={24}>
                  <Form.Item
                    label={<FormattedMessage id="formLanguage.form.target" />}
                    // type="number"
                    name="target"
                    rules={[{ required: true, message: 'Please Enter Target!' }]}
                    // style={{ width: 300 }}
                  >
                    <Input
                      onKeyPress={KeyPressEvents.isInputNumber}
                      maxLength={40}
                      onChange={(e) => handleChangeForTarget(e)}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form>

            <Row style={{ marginTop: 30 }}>
              <Col xl={9} lg={9} md={9} sm={24} xs={24}></Col>
              <Col xs={1} sm={1} md={1} lg={2} xl={2}>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    onClick={() => {
                      if (textForVillage) {
                        onFinish();
                      } else if (textForVillage == null) {
                        message.info('Please Select Village');
                      }
                    }}
                    loading={loadingForSave}
                  >
                    <FormattedMessage id="formLanguage.button.save" />
                  </Button>
                </Form.Item>
              </Col>
              <Col xl={1} lg={2} md={3} sm={4} xs={8}></Col>
              <Col xl={2} lg={2} md={1} sm={1} xs={1}>
                <Button
                  type=""
                  style={{ color: 'white', backgroundColor: 'orange' }}
                  onClick={resetData}
                >
                  <FormattedMessage id="formLanguage.button.reset" />
                </Button>
              </Col>
              <Col xl={10} lg={10} md={10} sm={24} xs={24}></Col>

              {/*   <Col xl={1} lg={2} md={3} sm={4} xs={8}></Col>
          <Col xl={2} lg={2} md={1} sm={1} xs={1}>
            <Button type="danger" onClick={pushToTableForm} htmlType="submit">
              <FormattedMessage id="formLanguage.button.cancel" />
            </Button>
          </Col> */}
            </Row>
          </>
        ) : (
          ''
        )}
      </Card>
      <Card border={true}>
        <Row>
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            <Button
              type="primary"
              loading={isLoading}
              style={{ marginBottom: '10px', float: 'right' }}
              onClick={() => setFormVisibility(false)}
            >
              <FormattedMessage id="formLanguage.button.add" />
            </Button>
          </Col>
        </Row>
        <Row>
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            <Table
              loading={isLoading}
              bordered={true}
              scroll={{ x: 100 }}
              dataSource={tableData}
              pagination={{ pageSizeOptions: [10, 20, 50, 100] }}
              columns={columns}
            />
          </Col>
        </Row>
      </Card>
      {/* <Modal
        title={<FormattedMessage id="formLanguage.form.popForDelete" />}
        visible={modalForDelete}
        okText={<FormattedMessage id="formLanguage.form.yes" />}
        okType="danger"
        cancelText={<FormattedMessage id="formLanguage.form.no" />}
        onCancel={onCancelForDelete}
        onOk={deleteRecord}
      ></Modal> */}
      <Modal
        width={400}
        visible={isModalVisible}
        okText={okText}
        onCancel={handleCancelForModal}
        onOk={editTargetForm}
        confirmLoading={confirmLoading}
      >
        <Form form={modalForm} layout="vertical">
          <Row>
            <Col xl={24} lg={24} md={24} sm={24} xs={24}>
              <Form.Item
                rules={[{ required: true, message: 'This Field Is Required..' }]}
                name={'target'}
                label={<FormattedMessage id="formLanguage.form.target" />}
              >
                <Input
                  maxLength={50}
                  defaultValue={dataInModal && dataInModal.annualVillageTarget}
                  onChange={(e) => {
                    setDataInModal((preDataInModal) => ({
                      ...preDataInModal,
                      annualVillageTarget: e.target.value,
                    }));
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}

export default Target;
