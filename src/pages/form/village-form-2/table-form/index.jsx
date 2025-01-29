import ESelector from '@/components/eComponents/ESelector';
import useAxios from '@/components/eComponents/use-axios';
import URLS from '@/URLs/urls';
import { DeleteOutlined, EditTwoTone, EyeTwoTone, SearchOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import moment from 'moment';
import {
  Alert,
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Table,
  Tooltip,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { FormattedMessage, useModel } from 'umi';
import { useHistory, useLocation } from 'react-router';
import VillageSelector from '@/components/eComponents/VillageSelector';

const TableForm2 = () => {
  const [surveyNumberValue, setSurveyNumberValue] = useState('');
  const [codeVillage, setCodeVillage] = useState('');
  const [modalForDelete, setModalForDelete] = useState(false);
  const [recordId, setRecordId] = useState();
  const [textForVillage, setTextForVillage] = useState();
  const [village, setVillage] = useState([]);
  const [revenueYear, setRevenueYear] = useState();
  const [dataInModal, setDataInModal] = useState();
  const [inputState, setInputState] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [okText, setOkText] = useState();
  const [ID, setID] = useState();
  const [form2data, setForm2data] = useState([]);
  const [isNirank, setIsNirank] = useState(false);
  const { sendRequest } = useAxios();
  let history = useHistory();
  const [valuesToDisplay, setValuesToDisplay] = useState();
  const [hissaNoValue, setHissaNoValue] = useState();
  const [form2] = Form.useForm();
  const { districtName, servarthId, districtCode, talukaCode } = useModel('details');
  const [periodToDate, setPeriodToDate] = useState();
  const [periodFromDate, setPeriodFromDate] = useState();
  const [datevalidFlag, setDatevalidFlag] = useState(true);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [authorityDate, setAuthorityDate] = useState();
  const location = useLocation();

  useEffect(() => {
    if (
      new Date(periodFromDate) > new Date(periodToDate) ||
      new Date(periodToDate) < new Date(periodFromDate)
    ) {
      message.info('Period To-Date Must be greater than From-Date');
      setDatevalidFlag(false);
    } else {
      setDatevalidFlag(true);
    }
  }, [periodFromDate, periodToDate]);

  const handleESelectorChange = (sn, cCodeT, buttonState, year) => {
    setSurveyNumberValue(sn);
    setCodeVillage(cCodeT);
    // console.log('year', year);
  };

  function handleChangeForSurveyNo(event) {
    setSurveyNumberValue(event.target.value);
    // console.log(event.target.value);
    setForm2data('');
  }

  const showModalForView = (record) => {
    // console.log('record', record);
    form2.resetFields();
    setDataInModal({});
    setDataInModal({
      id: record.id,
      pin: record.pin,
      hissaNo: record.hissaNo,
      cCode: codeVillage,
      part: record.part,
      purposeOfUse: record.purposeOfUse,
      authority: record.authority,
      natureAndTermsOfNaGrant: record.natureAndTermsOfNaGrant,
      remarks: record.remarks,
      occupanyPrice: record.occupanyPrice,
      periodFrom: record.periodFrom,
      periodTo: record.periodTo,
      entryNumberInTalukaForm2: record.entryNumberInTalukaForm2,
      nameOfFirstOccupant: record.nameOfFirstOccupant,
      authorityOrderNo: record.authorityOrderNo,
      authorityDate: record.authorityDate,
    });

    setInputState(true);
    // console.log('Data in DataInModal state==>', record);
    setIsModalVisible(true);
    setOkText('Okay');
  };

  const showModalForEdit = (record) => {
    // console.log('record==>', record);
    form2.resetFields();
    setDataInModal({});
    setDataInModal({
      id: record.id,
      pin: record.pin,
      hissaNo: record.hissaNo,
      cCode: codeVillage,
      part: record.part,
      purposeOfUse: record.purposeOfUse,
      authority: record.authority,
      natureAndTermsOfNaGrant: record.natureAndTermsOfNaGrant,
      remarks: record.remarks,
      occupanyPrice: record.occupanyPrice,
      periodFrom: record.periodFrom,
      periodTo: record.periodTo,
      entryNumberInTalukaForm2: record.entryNumberInTalukaForm2,
      nameOfFirstOccupant: record.nameOfFirstOccupant,
      authorityOrderNo: record.authorityOrderNo,
      authorityDate: record.authorityDate,
    });

    setInputState(false);
    // console.log('Data in DataInModal state==>', record);
    setIsModalVisible(true);
    setOkText('Save');
    setID(record.id);
    //  setSurveyNumberValue(record.pin);
    setHissaNoValue(record.hissaNo);
  };

  const editForm2 = () => {
    setConfirmLoading(true);

    let periodFromI =
      form2.getFieldValue('periodFrom') && form2.getFieldValue('periodFrom') !== 'Invalid date'
        ? moment(form2.getFieldValue('periodFrom'), 'DD/MM/YYYY').format('YYYY-MM-DD')
        : null;

    if (!periodFromI) {
      if (dataInModal.periodFrom && dataInModal.periodFrom !== 'Invalid date') {
        periodFromI = moment(dataInModal.periodFrom).format('YYYY-MM-DD');
      }
    }
    let periodFromII =
      form2.getFieldValue('periodTo') && form2.getFieldValue('periodTo') !== 'Invalid date'
        ? moment(form2.getFieldValue('periodTo'), 'DD/MM/YYYY').format('YYYY-MM-DD')
        : null;

    if (!periodFromII) {
      if (dataInModal.periodTo && dataInModal.periodTo !== 'Invalid date') {
        periodFromII = moment(dataInModal.periodTo).format('YYYY-MM-DD');
      }
    }

    let authorityDateI =
      form2.getFieldValue('authorityDate') &&
      form2.getFieldValue('authorityDate') !== 'Invalid date'
        ? moment(form2.getFieldValue('authorityDate'), 'DD/MM/YYYY').format('YYYY-MM-DD')
        : null;

    if (!authorityDateI) {
      if (dataInModal.authorityDate && dataInModal.authorityDate !== 'Invalid date') {
        authorityDateI = moment(dataInModal.authorityDate).format('YYYY-MM-DD');
      }
    }
    const parameterForEdit = {
      id: ID,
      hissaNo: hissaNoValue,
      pin: dataInModal.pin,
      cCode: codeVillage,
      districtCode: districtCode,
      talukaCode: talukaCode,
      part: dataInModal.part,
      purposeOfUse: dataInModal.purposeOfUse,
      natureAndTermsOfNaGrant: dataInModal.natureAndTermsOfNaGrant,
      authority: dataInModal.authority,
      remarks: dataInModal.remarks,
      occupanyPrice: dataInModal.occupanyPrice,
      periodFrom: periodFromI,
      periodTo: periodFromII,
      entryNumberInTalukaForm2: dataInModal.entryNumberInTalukaForm2,
      nameOfFirstOccupant: dataInModal.nameOfFirstOccupant,
      authorityOrderNo: dataInModal.authorityOrderNo,
      authorityDate: authorityDateI,
    };
    // console.log('parameterfpr edit', parameterForEdit);
    if (okText === 'Save') {
      sendRequest(
        `${URLS.BaseURL}/form2/editForm2`,
        'PUT',
        parameterForEdit,
        (res) => {
          if (res.status === 200) {
            message.success('Data Updated!');
            showForm2();
            setConfirmLoading(false);
            setIsModalVisible(false);
          }
        },
        (err) => {
          setIsModalVisible(false);
          setConfirmLoading(false);
        },
      );
    } else if (okText === 'Okay') {
      setIsModalVisible(false);
      setConfirmLoading(false);
    }
  };

  const onCancelForDelete = () => {
    setModalForDelete(false);
  };

  const deleteForm2Record = (record) => {
    setRecordId(record.id);
    setModalForDelete(true);
  };

  const deleteRecord = async (record) => {
    setModalForDelete(false);
    sendRequest(`${URLS.BaseURL}/form2/discardForm2?id=${recordId}`, 'DELETE', null, (res) => {
      if (res.status === 226) {
        message.success('Record Deleted!');
        setForm2data([]);
        showForm2();
      }
    });
  };

  const showForm2 = async () => {
    setIsLoading(true);

    sendRequest(
      `${URLS.BaseURL}/form2/getForm2Data?districtCode=${districtCode}&talukaCode=${talukaCode}&cCode=${codeVillage}&pin=${surveyNumberValue}`,
      'GET',
      null,
      (res) => {
        // console.log('Full response for ShowForm2 ', res);
        setForm2data(
          res.data.form2Data.map((r, i) => ({
            srNo: i + 1,
            id: r.id,
            surveyNo: r.hissaNo == null || r.hissaNo.trim() == '' ? r.pin : r.pin + '/' + r.hissaNo,
            pin: r.pin,
            hissaNo: r.hissaNo,
            naAreaH: r.naAreaH
              .substring(0, r.naAreaH.length - 2)
              .concat('.')
              .concat(r.naAreaH.substring(r.naAreaH.length - 2)),
            naAssessment: r.naAssessment,
            natureAndTermsOfNaGrant: r.natureAndTermsOfNaGrant,
            part: r.part,
            purposeOfUse: r.purposeOfUse,
            authority: r.authority,
            remarks: r.remarks,
            periodFrom:
              r.periodFrom != null ? moment(r.periodFrom, 'YYYY-MM-DD').format('YYYY-MM-DD') : '',
            periodTo:
              r.periodTo != null ? moment(r.periodTo, 'YYYY-MM-DD').format('YYYY-MM-DD') : '',
            occupanyPrice: r.occupanyPrice,
            nameOfFirstOccupant: r.nameOfFirstOccupant,
            entryNumberInTalukaForm2: r.entryNumberInTalukaForm2,
            authorityOrderNo: r.authorityOrderNo,
            authorityDate:
              r.authorityDate != null
                ? moment(r.authorityDate, 'YYYY-MM-DD').format('YYYY-MM-DD')
                : '',
          })),
        );
        message.success('Records Fetched !');
        setIsLoading(false);
      },
      (err) => {
        setIsLoading(false);
      },
    );
  };
  const cols = [
    {
      key: '1',
      title: <FormattedMessage id="formLanguage.form.serialNo" />,
      dataIndex: 'srNo',
    },
    {
      key: '2',
      title: <FormattedMessage id="form2.table.survey" />,
      dataIndex: 'surveyNo',
    },
    // {
    //   key: '3',
    //   title: <FormattedMessage id="formLanguage.form.hissaNo" />,
    //   dataIndex: 'hissaNo',
    // },
    {
      key: '3',
      title: <FormattedMessage id="form2.table.area" />,
      dataIndex: 'naAreaH',
      width: '160px',
    },
    {
      key: '4',
      title: <FormattedMessage id="demandGeneration.table.assessment" />,
      dataIndex: 'naAssessment',
      width: '140px',
    },
    {
      key: '5',
      title: <FormattedMessage id="form2.table.part" />,
      width: '100px',
      render: (record) => {
        return record.part != '' ? <FormattedMessage id={record.part} /> : '';
      },
    },
    {
      key: '6',
      title: <FormattedMessage id="form2.table.natureTerms" />,
      width: '150px',

      render: (record) => {
        return record.purposeOfUse != '' ? <FormattedMessage id={record.purposeOfUse} /> : '';
      },
    },
    {
      key: '8',
      title: <FormattedMessage id="form2.table.ocupancy" />,
      dataIndex: 'occupanyPrice',
    },
    {
      key: '9',
      title: <FormattedMessage id="form2.table.nameOfOccupant" />,
      dataIndex: 'nameOfFirstOccupant',
    },

    {
      key: '10',
      title: <FormattedMessage id="form2.table.fromDate" />,
      dataIndex: 'periodFrom',
    },
    {
      key: '11',
      title: <FormattedMessage id="form2.table.toDate" />,
      dataIndex: 'periodTo',
    },
    {
      key: '12',
      title: <FormattedMessage id="form2.table.entryNumber" />,
      dataIndex: 'entryNumberInTalukaForm2',
    },
    {
      key: '13',
      title: <FormattedMessage id="form2.table.authority" />,
      width: '150px',
      render: (record) => {
        return record.authority != '' ? <FormattedMessage id={record.authority} /> : '';
      },
    },
    {
      key: '14',
      title: <FormattedMessage id="form2.table.orderNo" />,
      dataIndex: 'authorityOrderNo',
    },
    {
      key: '15',
      title: <FormattedMessage id="form2.table.authorityDate" />,
      dataIndex: 'authorityDate',
    },
    {
      key: '16',
      title: <FormattedMessage id="form2.table.remarks" />,
      dataIndex: 'remarks',
    },
    {
      key: '17',
      fixed: 'right',
      title: <FormattedMessage id="formLanguage.table.action" />,
      width: '120px',
      render: (record) => {
        return (
          <>
            <Row>
              {record.id != null ? (
                <Col>
                  <Button
                    onClick={() => showModalForEdit(record)}
                    style={{ backgroundColor: 'lightblue', color: 'black' }}
                  >
                    माहिती भरा
                  </Button>
                  <br />
                  <br />

                  <Button
                    onClick={() => deleteForm2Record(record)}
                    style={{ backgroundColor: '	#ff6347', color: 'black' }}
                  >
                    डीलिट करा
                  </Button>
                  <br />
                  <br />

                  <Button
                    onClick={() => showModalForView(record)}
                    style={{ backgroundColor: 'lightgreen', color: 'black' }}
                  >
                    माहिती पहा
                  </Button>
                </Col>
              ) : (
                <Col>
                  <Button
                    onClick={() => showModalForEdit(record)}
                    style={{ backgroundColor: 'lightblue', color: 'black' }}
                  >
                    माहिती भरा
                  </Button>
                </Col>
              )}
            </Row>
          </>
        );
      },
    },
  ];

  const handleCancelForModal = () => {
    setIsModalVisible(false);
  };

  const handleOkForModal = () => {
    setIsModalVisible(false);
  };

  const addForm = () => {
    history.push({
      pathname: `/form/village-form-2/village-form`,
    });
  };
  return (
    <>
      <PageContainer>
        <Card>
          <Row>
            <Col xl={22} lg={22} md={22} sm={20} xs={20}>
              <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
                <FormattedMessage id="form2.table.label" />
              </h2>
            </Col>
            <Col xl={2} lg={2} md={2} sm={4} xs={4}>
              {/* <Button type="primary" onClick={addForm}>
                <FormattedMessage id="formLanguage.button.add" />
              </Button> */}
            </Col>
          </Row>
          <VillageSelector
            pageType="withoutYear"
            setCodeVillage={setCodeVillage}
            setTextForVillage={setTextForVillage}
            onVillageChange={(setVillage, setForm2data)}
            yearChange={setRevenueYear}
            setIsNirank={setIsNirank}
          />
          <Row style={{ marginTop: '20px' }}>
            <Col xl={7} lg={7} md={7} sm={24} xs={24}>
              <Form.Item
                // labelCol={{ xl: 10, lg: 13 }}
                // wrapperCol={{ xl: 13, lg: 10, xs: 10 }}
                label={<FormattedMessage id="formLanguage.table.surveyNo" />}
                name="surveyNumber"
                rules={[{ required: true, message: 'Survey Number is Required' }]}
                // style={{ marginLeft: '9px' }}
              >
                <Input style={{ marginLeft: 5 }} maxLength={7} onChange={handleChangeForSurveyNo} />
              </Form.Item>
            </Col>

            <Col xl={1} lg={1} md={1} sm={1}></Col>
            <Col xl={2} lg={2} md={2} sm={2} xs={2}>
              {!isNirank && (
                <Button
                  onClick={() => {
                    if (textForVillage) {
                      showForm2();
                    } else if (textForVillage == null) {
                      message.info('Please Select Village !');
                    }
                  }}
                  type="primary"
                >
                  <FormattedMessage id="formLanguage.button.search" />
                </Button>
              )}
            </Col>
            <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>
          </Row>
        </Card>
        <Alert
          message="टीप"
          description="ई-फेरफार प्रणालीतून (अकृषिक सातबारा ) दाखवलेल्या अकृषिक सातबारापैकी ज्या सातबारांच्या क्षेत्रात कृषिक व अकृषिक क्षेत्र एकत्र दाखवलेले आहेत अश्या साताबारांची नोंद येथे घेता येणार नाही.
                          तसेच सर्व अकृषिक सातबारा हे 'गावठाणाबाहेरील' दाखवलेले आहेत. (जर सातबारा गावठाणातील असेल तर त्या प्रमाणे भाग व भूप्रदानाचे स्वरूप निवडून 'गावठाण' प्रकारात समाविष्ट करा.)  "
          type="info"
          showIcon
        />
        {isNirank && (
          <>
            <Alert message="टीप" description="सदर गाव नमुना निरंक आहे." type="info" showIcon />
          </>
        )}
        <Card>
          {!isNirank && (
            <Table
              columns={cols}
              loading={isLoading}
              dataSource={form2data}
              scroll={{ y: 350, x: 1900 }}
            ></Table>
          )}
        </Card>
        <Modal
          title={<FormattedMessage id="formLanguage.form.popForDelete" />}
          visible={modalForDelete}
          okText={<FormattedMessage id="formLanguage.form.yes" />}
          okType="danger"
          cancelText={<FormattedMessage id="formLanguage.form.no" />}
          onCancel={onCancelForDelete}
          onOk={deleteRecord}
        ></Modal>
        <Modal
          width={900}
          visible={isModalVisible}
          okText={okText}
          onCancel={handleCancelForModal}
          onOk={() => {
            if (datevalidFlag) {
              editForm2();
            } else if (
              new Date(periodFromDate) > new Date(periodToDate) ||
              new Date(periodToDate) < new Date(periodFromDate)
            ) {
              message.error('Period To-Date Must be greater than From-Date');
            }
          }}
          confirmLoading={confirmLoading}
        >
          <Card>
            <Form
              layout="vertical"
              form={form2}
              // onFinish={onFormFinish}
              // onFinishFailed={onFinishFailed} */
            >
              <Row>
                <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                  <Form.Item
                    name="part"
                    rules={[{ required: true, message: 'This Field Is Required..' }]}
                    label={<FormattedMessage id="form2.table.part" />}
                  >
                    <Select
                      disabled={inputState}
                      defaultValue={dataInModal && dataInModal.part}
                      onChange={(e) => {
                        setDataInModal((preDataInModal) => ({
                          ...preDataInModal,
                          part: e,
                        }));
                      }}
                      placeholder={<FormattedMessage id="form2.table.part" />}
                    >
                      <Select.Option value="form2.table.partA">
                        <FormattedMessage id="form2.table.partA" />
                      </Select.Option>
                      <Select.Option value="form2.table.partB">
                        <FormattedMessage id="form2.table.partB" />
                      </Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xl={2} lg={2} md={2}></Col>
                <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                  <Form.Item
                    name="purposeOfUse"
                    rules={[{ required: true, message: 'This Field Is Required..' }]}
                    label={<FormattedMessage id="form2.table.natureTerms" />}
                  >
                    <Select
                      placeholder={valuesToDisplay && valuesToDisplay.purposeOfUse}
                      disabled={inputState}
                      defaultValue={dataInModal && dataInModal.purposeOfUse}
                      onChange={(e) => {
                        setDataInModal((preDataInModal) => ({
                          ...preDataInModal,
                          purposeOfUse: e,
                        }));
                      }}
                    >
                      <Select.Option value="form2.table.partA.1">
                        <FormattedMessage id="form2.table.partA.1" />
                      </Select.Option>
                      <Select.Option value="form2.table.partA.2">
                        <FormattedMessage id="form2.table.partA.2" />
                      </Select.Option>
                      <Select.Option value="form2.table.partA.3">
                        <FormattedMessage id="form2.table.partA.3" />
                      </Select.Option>
                      <Select.Option value="form2.table.partA.4">
                        <FormattedMessage id="form2.table.partA.4" />
                      </Select.Option>
                      <Select.Option value="form2.table.partA.5">
                        <FormattedMessage id="form2.table.partA.5" />
                      </Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                  <Form.Item
                    name={'nameOfFirstOccupant'}
                    rules={[{ required: true, message: 'This Field Is Required..' }]}
                    label={<FormattedMessage id="form2.table.nameOfOccupant" />}
                  >
                    <Input
                      disabled={inputState}
                      defaultValue={dataInModal && dataInModal.nameOfFirstOccupant}
                      onChange={(e) => {
                        setDataInModal((preDataInModal) => ({
                          ...preDataInModal,
                          nameOfFirstOccupant: e.target.value,
                        }));
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col xl={2} lg={2} md={2}></Col>
                <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                  <Form.Item
                    name="occupanyPrice"
                    rules={[{ message: 'This Field Is Required..' }]}
                    label={<FormattedMessage id="form2.table.ocupancy" />}
                  >
                    <Input
                      disabled={inputState}
                      defaultValue={dataInModal && dataInModal.occupanyPrice}
                      onChange={(e) => {
                        setDataInModal((preDataInModal) => ({
                          ...preDataInModal,
                          occupanyPrice: e.target.value,
                        }));
                      }}
                      addonAfter={'₹'}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                  {(dataInModal && dataInModal.periodFrom === '') || null ? (
                    <Form.Item
                      name={'periodFrom'}
                      label={<FormattedMessage id="form2.table.fromDate" />}
                    >
                      <DatePicker
                        disabled={inputState}
                        onSelect={(e) => {
                          setPeriodFromDate(e);
                        }}
                      />
                    </Form.Item>
                  ) : (
                    <Form.Item
                      name={'periodFrom'}
                      label={<FormattedMessage id="form2.table.fromDate" />}
                    >
                      <DatePicker
                        disabled={inputState}
                        defaultValue={dataInModal && moment(dataInModal.periodFrom)}
                        onChange={(e) => {
                          setDataInModal((preDataInModal) => ({
                            ...preDataInModal,
                            periodFrom: moment(e).format('YYYY-MM-DD'),
                          }));
                          // console.log('periodFrom onchange', e);
                        }}
                        onSelect={(e) => {
                          setPeriodFromDate(e);
                        }}
                      />
                    </Form.Item>
                  )}
                </Col>
                <Col xl={2} lg={2} md={2}></Col>
                <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                  {(dataInModal && dataInModal.periodTo === '') || null ? (
                    <Form.Item name="periodTo" label={<FormattedMessage id="form2.table.toDate" />}>
                      <DatePicker
                        disabled={inputState}
                        onSelect={(e) => {
                          setPeriodToDate(e);
                        }}
                      />
                    </Form.Item>
                  ) : (
                    <Form.Item name="periodTo" label={<FormattedMessage id="form2.table.toDate" />}>
                      <DatePicker
                        disabled={inputState}
                        defaultValue={dataInModal && moment(dataInModal.periodTo)}
                        onChange={(e) => {
                          setDataInModal((preDataInModal) => ({
                            ...preDataInModal,
                            periodTo: moment(e).format('YYYY-MM-DD'),
                          }));
                          // console.log('periodTo onchange', e);
                        }}
                        onSelect={(e) => {
                          setPeriodToDate(e);
                        }}
                      />
                    </Form.Item>
                  )}
                </Col>
              </Row>
              <Row>
                <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                  <Form.Item
                    name="entryNumberInTalukaForm2"
                    rules={[{ required: true, message: 'This Field Is Required..' }]}
                    label={<FormattedMessage id="form2.table.entryNumber" />}
                  >
                    <Input
                      disabled={inputState}
                      defaultValue={dataInModal && dataInModal.entryNumberInTalukaForm2}
                      onChange={(e) => {
                        setDataInModal((preDataInModal) => ({
                          ...preDataInModal,
                          entryNumberInTalukaForm2: e.target.value,
                        }));
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col xl={2} lg={2} md={2}></Col>

                <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                  <Form.Item
                    name="authority"
                    rules={[{ required: true, message: 'This Field Is Required..' }]}
                    label={<FormattedMessage id="form2.table.authority" />}
                  >
                    <Select
                      disabled={inputState}
                      defaultValue={dataInModal && dataInModal.authority}
                      onChange={(e) => {
                        setDataInModal((preDataInModal) => ({
                          ...preDataInModal,
                          authority: e,
                        }));
                      }}
                      /*  onSelect={(e) => {
                        handleChangeForAuthority(e);
                      }} */
                      placeholder={<FormattedMessage id="form2.table.authority" />}
                    >
                      <Select.Option value={'villageForm1.table.collector'}>
                        <FormattedMessage id="villageForm1.table.collector" />
                      </Select.Option>
                      <Select.Option value={`villageForm1.table.deputyCollector`}>
                        <FormattedMessage id="villageForm1.table.deputyCollector" />
                      </Select.Option>
                      <Select.Option value={'villageForm1.table.tahsildar'}>
                        <FormattedMessage id="villageForm1.table.tahsildar" />
                      </Select.Option>
                      {/* <Select.Option value={'villageForm1.table.nayabTahsildar'}>
                        <FormattedMessage id="villageForm1.table.nayabTahsildar" />
                      </Select.Option>
                      <Select.Option value={'villageForm1.table.circle'}>
                        <FormattedMessage id="villageForm1.table.circle" />
                      </Select.Option> */}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                  <Form.Item
                    name="authorityOrderNo"
                    rules={[{ required: true, message: 'This Field Is Required..' }]}
                    label={<FormattedMessage id="form2.table.orderNo" />}
                  >
                    <Input
                      disabled={inputState}
                      defaultValue={dataInModal && dataInModal.authorityOrderNo}
                      onChange={(e) => {
                        setDataInModal((preDataInModal) => ({
                          ...preDataInModal,
                          authorityOrderNo: e.target.value,
                        }));
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col xl={2} lg={2} md={2}></Col>

                <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                  {(dataInModal && dataInModal.authorityDate === '') || null ? (
                    <Form.Item
                      name={'authorityDate'}
                      label={<FormattedMessage id="form2.table.authorityDate" />}
                    >
                      <DatePicker
                        disabled={inputState}
                        onSelect={(e) => {
                          setAuthorityDate(e);
                        }}
                      />
                    </Form.Item>
                  ) : (
                    <Form.Item
                      name={'authorityDate'}
                      label={<FormattedMessage id="form2.table.authorityDate" />}
                    >
                      <DatePicker
                        disabled={inputState}
                        defaultValue={dataInModal && moment(dataInModal.authorityDate)}
                        onChange={(e) => {
                          setDataInModal((preDataInModal) => ({
                            ...preDataInModal,
                            authorityDate: moment(e).format('YYYY-MM-DD'),
                          }));
                          // console.log('periodFrom onchange', e);
                        }}
                        onSelect={(e) => {
                          setAuthorityDate(e);
                        }}
                      />
                    </Form.Item>
                  )}
                </Col>
              </Row>
              <Row>
                <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                  <Form.Item
                    name="remarks"
                    // rules={[{ required: true, message: 'This Field Is Required..' }]}
                    label={<FormattedMessage id="form2.table.remarks" />}
                  >
                    <Input.TextArea
                      disabled={inputState}
                      defaultValue={dataInModal && dataInModal.remarks}
                      onChange={(e) => {
                        setDataInModal((preDataInModal) => ({
                          ...preDataInModal,
                          remarks: e.target.value,
                        }));
                      }}
                    ></Input.TextArea>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
        </Modal>
      </PageContainer>
    </>
  );
};

export default TableForm2;
