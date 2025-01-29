import { PageContainer } from '@ant-design/pro-layout';
import {
  Card,
  Row,
  Col,
  Input,
  Select,
  Form,
  Divider,
  Table,
  Button,
  Modal,
  message,
  Image,
} from 'antd';
import moment from 'moment';
import URLS from '@/URLs/urls';
import useAxios from '@/components/eComponents/use-axios';
import React, { useEffect, useRef, useState } from 'react';
import Modeofpayment from '../common/modeofpayment';
import Axios from 'axios';
import { EyeTwoTone, UploadOutlined } from '@ant-design/icons';
import VillageSelector from '@/components/eComponents/VillageSelector';
import { FormattedMessage, useModel } from 'umi';
import KeyPressEvents from '@/util/KeyPressEvents';
const { TextArea } = Input;

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

//function onChange(date, dateString) {
//console.log(date, dateString);
//}
function ChallanDetails() {
  const { districtName, talukaName, districtCode, talukaCode } = useModel('details');
  const [fileName, setFileName] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState([]);
  const { token } = useModel('Auth');
  const Header = `Bearer ${token}`;
  const { sendRequest } = useAxios();
  const [downloadedImageName, setDownloadedImageName] = useState();
  const [downloadedImageName0045, setDownloadedImageName0045] = useState();
  const [downloadedImage, setDownloadedImage] = useState();
  const [file, setFile] = useState(null);
  const [file0045, setFile0045] = useState(null);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState();
  const [selectedImage1, setSelectedImage1] = useState();
  const [buttonFlag, setButtonFlag] = useState(true);
  const [buttonFlag2, setButtonFlag2] = useState(true);
  const [moneyStatus, setMoneyStatus] = useState();
  const [bankName, setBankName] = useState();
  const [bankReceiptNumber, setBankReceiptNumber] = useState();
  const [bankReceiptNumber0045, setBankReceiptNumber0045] = useState();
  const [bankAddress, setBankAddress] = useState();
  const [bankAmount, setBankAmount] = useState();
  const [saveButtonDisable, setSaveButtonDisable] = useState();
  const [detailState, setDetailState] = useState();
  const [modalDisabled, setModalDisabled] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [textVillage, setTextVillage] = useState();
  const [village, setVillage] = useState([]);
  const [challanData, setChallanData] = useState([]);
  const [savedChallan, setSavedChallan] = useState();
  const bankNameRef = useRef();
  const [codeVillage, setCodeVillage] = useState('');
  const [newImageState, setNewImageState] = useState();
  const [newImageState0045, setNewImageState0045] = useState();
  const [dataInModal, setDataInModal] = useState();
  const [imageDownLoad, setImageDownLoad] = useState();
  const [imageDownLoad0045, setImageDownLoad0045] = useState();
  const [revenueYear, setRevenueYear] = useState();
  const [isNirank, setIsNirank] = useState(false);
  const [okText, setOkText] = useState();
  const [upperModalData, setUpperModalData] = useState();
  const [modalButtonState, setModalButtonState] = useState('');
  const [modalData, setModalData] = useState();
  const echHost = localStorage.getItem('echHost');
  const mhrHost = localStorage.getItem('mhrHost');
  const echDbName = localStorage.getItem('echDbName');
  const echSchemaName = localStorage.getItem('echSchemaName');
  const mhrDbName = localStorage.getItem('mhrDbName');
  const mhrSchemaName = localStorage.getItem('mhrSchemaName');

  const initvalues = {
    image: '',
  };
  const [myForm] = Form.useForm();
  const showModal = (record) => {
    setModalData();
    const body = {
      id: record.id,
      cCode: codeVillage,
    };
    sendRequest(`${URLS.BaseURL}/landRevenue/download`, 'POST', body, (res) => {
      setUpperModalData({
        bankName: res.data.bankName,
        id: res.data.id,
        challanNo: res.data.challanNo,
        challanDate: moment(res.data.challanDate, 'YYYY-MM-DD').format('DD/MM/YYYY'),
        totalAmount: res.data.totalAmount,
        modeOfPayment: res.data.modeOfPayment,
        bankReceiptPath: res.data.bankReceiptPath,
        myfile: res.data.myfile,
        myfile1: res.data.myfile,
        path0029: res.data.path0029,
        path0045: res.data.path0045,
        actualFileName: res.data.actualFileName,
        actualFileName0045: res.data.actualFileName0045,
        bankAddress: res.data.bankAddress,
        bankReceiptNumber: res.data.bankReceiptNumber,
        bankReceiptNumber0045: res.data.bankReceiptNumber0045,
        challanNo0045: res.data.challanNo0045,
        totalOfHead0029: res.data.totalOfHead0029,
        totalOfHead0045: res.data.totalOfHead0045,
      });
    });
    // console.log('Record!!!!', record);
    setDataInModal({
      bankName: record.bankName,
      id: record.id,
      challanNo: record.challanNo,
      challanDate: record.challanDate,
      totalAmount: record.totalAmount,
      modeOfPayment: record.modeOfPayment,
      bankReceiptPath: record.bankReceiptPath,
      myfile: record.myfile,
      myfile1: record.myfile,
      actualFileName: record.actualFileName,
      actualFileName0045: record.actualFileName0045,
      bankAddress: record.bankAddress,
      bankReceiptNumber: record.bankReceiptNumber,
      bankReceiptNumber0045: record.bankReceiptNumber0045,
      challanNo0045: record.challanNo0045,
      totalOfHead0029: record.totalOfHead0029,
      totalOfHead0045: record.totalOfHead0045,
    });
    let bankNameDisabled = false,
      bankAddressDisabled = false,
      bankReceiptNumberDisabled = false,
      bankReceiptNumber0045Disabled = false;

    // bankReceiptPathDisabled = false;

    if (record.bankName != null) {
      bankNameDisabled = true;
    }
    if (record.bankAddress != null) {
      bankAddressDisabled = true;
    }
    if (record.bankReceiptNumber != null) {
      bankReceiptNumberDisabled = true;
    }
    if (record.bankReceiptNumber0045 != null) {
      bankReceiptNumber0045Disabled = true;
    }
    // if (record.bankReceiptPath != null) {
    //   bankReceiptPathDisabled = true;
    // }

    const showDownloadedImage = async () => {
      function base64ToArrayBuffer(base64) {
        var binary_string = window.atob(base64);
        var len = binary_string.length;
        var bytes = new Uint8Array(len);
        for (var i = 0; i < len; i++) {
          bytes[i] = binary_string.charCodeAt(i);
        }
        setImageDownLoad(bytes);
        return bytes.buffer;
        //setNewImageState(bytes)
      }

      function base64ToArrayBuffer0045(base64) {
        var binary_string = window.atob(base64);
        var len = binary_string.length;
        var bytes = new Uint8Array(len);
        for (var i = 0; i < len; i++) {
          bytes[i] = binary_string.charCodeAt(i);
        }
        setImageDownLoad0045(bytes);
        return bytes.buffer;
        //setNewImageState(bytes)
      }

      // how to set two response data in two diffrent states in react js ?

      sendRequest(`${URLS.BaseURL}/landRevenue/download`, 'POST', body, (res) => {
        // console.log('data ala ka re bgh jara', res);
        setModalData({
          bankName: res.data.bankName,
          id: res.data.id,
          challanNo: res.data.challanNo,
          challanDate: res.data.challanDate,
          totalAmount: res.data.totalAmount,
          modeOfPayment: res.data.modeOfPayment,
          bankReceiptPath: res.data.bankReceiptPath,
          myfile: res.data.myfile,
          myfile1: res.data.myfile,
          path0029: res.data.path0029,
          path0045: res.data.path0045,
          actualFileName: res.data.actualFileName,
          actualFileName0045: res.data.actualFileName0045,
          bankAddress: res.data.bankAddress,
          bankReceiptNumber: res.data.bankReceiptNumber,
          bankReceiptNumber0045: res.data.bankReceiptNumber0045,
          challanNo0045: res.data.challanNo0045,
          totalOfHead0029: res.data.totalOfHead0029,
          totalOfHead0045: res.data.totalOfHead0045,
        });

        setNewImageState('data:image/jpeg;base64,' + res.data.path0029);
        base64ToArrayBuffer(res.data.path0029);
        setNewImageState0045('data:image/jpeg;base64,' + res.data.path0045);
        base64ToArrayBuffer0045(res.data.path0045);
      });
    };
    if (record.actualFileName != null) {
      showDownloadedImage();
      setDownloadedImageName(record.actualFileName);
      setSelectedImage();
    }
    if (record.actualFileName0045 != null) {
      showDownloadedImage();
      setDownloadedImageName0045(record.actualFileName0045);
      setSelectedImage1();
    }
    setModalDisabled({
      bankNameDisabled,
      bankAddressDisabled,
      bankReceiptNumberDisabled,
      bankReceiptNumber0045Disabled,
    });
    setBankName(record.bankName);
    setBankReceiptNumber(record.bankReceiptNumber);
    setBankReceiptNumber0045(record.bankReceiptNumber0045);
    setBankAddress(record.bankAddress);
    setIsModalVisible(true);

    //dusri image
    // const showDownloadedImage0045 = async () => {
    //   function base64ToArrayBuffer0045(base64) {
    //     var binary_string = window.atob(base64);
    //     var len = binary_string.length;
    //     var bytes = new Uint8Array(len);
    //     for (var i = 0; i < len; i++) {
    //       bytes[i] = binary_string.charCodeAt(i);
    //     }
    //     setImageDownLoad0045(bytes);
    //     return bytes.buffer;
    //     //setNewImageState(bytes)
    //   }
    //   sendRequest(
    //     `${URLS.BaseURL}/landRevenue/download0045?id=${record.id}`,
    //     'GET',
    //     null,
    //     (res) => {
    //       setNewImageState0045('data:image/jpeg;base64,' + res.data);
    //       base64ToArrayBuffer0045(res.data);
    //     },
    //   );
    // };
    // if (record.actualFileName0045 != null) {
    //   showDownloadedImage0045();
    //   setDownloadedImageName0045(record.actualFileName0045);
    //   setSelectedImage1();
    // }
    // setModalDisabled({
    //   bankNameDisabled,
    //   bankAddressDisabled,
    //   bankReceiptNumberDisabled,
    //   bankReceiptNumber0045Disabled,
    // });
    // setBankName(record.bankName);
    // setBankReceiptNumber(record.bankReceiptNumber);
    // setBankReceiptNumber0045(record.bankReceiptNumber0045);
    // setBankAddress(record.bankAddress);
    // setIsModalVisible(true);
  };

  const handleOk = () => {
    enterLoading(0);
    // console.log(
    //   'bank deatils to be sent',
    //   dataInModal.id,
    //   bankReceiptNumber,
    //   bankAddress,
    //   bankName,
    //   bankReceiptNumber0045,
    // );
    saveChallan();
  };

  const enterLoading = (index) => {
    setLoading((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[index] = true;
      return newLoadings;
    });
    setTimeout(() => {
      setLoading((prevLoadings) => {
        const newLoadings = [...prevLoadings];
        newLoadings[index] = false;
        return newLoadings;
      });
    }, 2000);
  };

  const saveChallan = async () => {
    let myfile = file;
    let myFile1 = file0045;
    let formData = new FormData();
    formData.append('file', myfile);
    formData.append('file0045', myFile1);

    // let myFile0045 = file0045;
    // let formData1 = new FormData();
    // formData1.append('file0045', myFile0045);

    // console.log('bank name', bankName);

    if (modalButtonState == 'Not Deposited') {
      await Axios.put(
        `${URLS.BaseURL}/landRevenue/updateChallanDetails?id=${dataInModal.id}&bankAddress=${dataInModal.bankAddress}&bankName=${dataInModal.bankName}&bankReceiptNumber=${dataInModal.bankReceiptNumber}&bankReceiptNumber0045=${dataInModal.bankReceiptNumber0045}`,
        formData,
        // formData1,
        {
          headers: {
            Authorization: Header,
            echHost: echHost,
            mhrHost: mhrHost,
            echDbName: echDbName,
            echSchemaName: echSchemaName,
            mhrDbName: mhrDbName,
            mhrSchemaName: mhrSchemaName,
          },
        },
      ).then((res) => {
        if (res.status === 204) {
          setSelectedImage();
          setSelectedImage1();
          message.success('Challan Details Saved!!');
          setBankName(res.bankName);
          // console.log('Challan Data Saved');
          // console.log('Saved Challan Data==> ', res.data);
          getChallan();
          setChallanData();
          setIsModalVisible(false);
        }
      });
    } else {
      setIsModalVisible(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedImage();
    setSelectedImage1();
  };

  const handleOnChangeForStatus = (value, event) => {
    // console.log('current Value for Status', value);
    setMoneyStatus(value);
    setButtonFlag2(false);
    setChallanData([]);

    if (value == 'Deposited') {
      let text = <FormattedMessage id="challanDetails.button.saveokay" />;
      setOkText(text);
      setModalButtonState('Deposited');
    } else if (value == 'Not Deposited') {
      let text = <FormattedMessage id="challanDetails.button.save" />;
      setOkText(text);
      setModalButtonState('Not Deposited');
    }
  };

  const getChallan = async () => {
    setIsLoading(true);
    const article = {
      revenueYear: revenueYear,
      districtCode: districtCode,
      talukaCode: talukaCode,
      cCode: codeVillage,
      status: moneyStatus,
    };
    sendRequest(
      `${URLS.BaseURL}/landRevenue/getChallanDetails`,
      'POST',
      article,
      (res) => {
        // console.log('res for get challan details', res.data);
        setChallanData(
          res.data.map((row) => ({
            id: row.id,
            challanNo: row.challanNo,
            challanDate: moment(row.challanDate, 'YYYY-MM-DD').format('DD/MM/YYYY'),
            totalAmount: row.totalAmount,
            totalOfHead0029: row.totalOfHead0029,
            totalOfHead0045: row.totalOfHead0045,
            challanNo0045: row.challanNo0045,
            modeOfPayment: row.modeOfPayment,
            status: row.status,
            bankName: row.bankName,
            bankReceiptNumber: row.bankReceiptNumber,
            bankReceiptNumber0045: row.bankReceiptNumber0045,
            bankAddress: row.bankAddress,
            actualFileName: row.actualFileName,
            actualFileName0045: row.actualFileName0045,
            bankReceiptPath: row.bankReceiptPath,
            bankReceiptPath0045: row.bankReceiptPath0045,
          })),
        );
        if (res.data.length > 0) {
          message.success('Records Fetched !');
          setIsLoading(false);
        }
      },
      (err) => {
        message.info('No Records Found !');
        setIsLoading(false);
      },
    );
  };

  const handleFile = async (e) => {
    function checkFileSize(fileSize) {
      if (fileSize >= 2097152) {
        message.error('File Should not be more than 2 MB !');
        myForm.setFieldsValue({ image: '' });
        return false;
      } else {
        return true;
      }
    }
    function checkFileExtension(filename) {
      const extension = filename.split('.').pop();
      // console.log(extension);
      if (['jpeg', 'jpg', 'png', 'pdf'].indexOf(extension) < 0) {
        message.error('Please Select Valid File Format JPEG,JPG,PNG,PDF!');
        myForm.setFieldsValue({ image: '' });
        return false;
      } else {
        return true;
      }
    }

    if (e.target.files && e.target.files.length > 0) {
      if (checkFileExtension(e.target.files[0].name)) {
        if (checkFileSize(e.target.files[0].size)) {
          setFile(e.target.files[0]);
          setSelectedImage(await getBase64(e.target.files[0]));
        }
      }
    } else {
      setSelectedImage(null);
    }
    e.target.files = null;
    // const myfile = URL.creatObjectURL(e.target.files[0]);
    // setFile(myfile);
    // console.log(e.target.files);
    // if (e.target.files && e.target.files.length > 0) {
    //   setSelectedImage(myfile);
    // }
  };

  const handleFile0045 = async (e) => {
    function checkFileSize(fileSize) {
      if (fileSize >= 2097152) {
        message.error('File Should not be more than 2 MB !');
        myForm.setFieldsValue({ image1: '' });
        return false;
      } else {
        return true;
      }
    }
    function checkFileExtension(filename) {
      const extension = filename.split('.').pop();
      console.log(extension);
      if (['jpeg', 'jpg', 'png', 'pdf'].indexOf(extension) < 0) {
        message.error('Please Select Valid File Format JPEG,JPG,PNG,PDF!');
        myForm.setFieldsValue({ image1: '' });
        return false;
      } else {
        return true;
      }
    }

    if (e.target.files && e.target.files.length > 0) {
      if (checkFileExtension(e.target.files[0].name)) {
        if (checkFileSize(e.target.files[0].size)) {
          setFile0045(e.target.files[0]);
          setSelectedImage1(await getBase64(e.target.files[0]));
        }
      }
    } else {
      setSelectedImage1(null);
    }
    e.target.files = null;
  };

  const handleUpload = (e) => {
    // console.log(file, 'this is the file data');
  };
  const showModalForImageModal = () => {
    setImageModalVisible(true);
    // console.log(selectedImage);
  };

  const handleOkForImageModal = () => {
    setImageModalVisible(false);
  };

  const handleCancelForImageModal = () => {
    setImageModalVisible(false);
  };

  const removeSelectedImage = () => {
    setSelectedImage();
  };

  const columns = [
    {
      title: <FormattedMessage id="challanDetails.table.challanNo0029" />,
      dataIndex: 'challanNo',
    },
    {
      title: <FormattedMessage id="challanDetails.table.totalAmount29" />,
      dataIndex: 'totalOfHead0029',
    },
    {
      title: <FormattedMessage id="challanDetails.table.challanNo0045" />,
      dataIndex: 'challanNo0045',
    },
    {
      title: <FormattedMessage id="challanDetails.table.totalAmount45" />,
      dataIndex: 'totalOfHead0045',
    },
    {
      title: <FormattedMessage id="challanDetails.table.challanDate" />,
      dataIndex: 'challanDate',
    },
    {
      title: <FormattedMessage id="challanDetails.table.paymentMode" />,
      dataIndex: 'modeOfPayment',
    },
    {
      title: <FormattedMessage id="challanDetails.table.totalAmount" />,
      dataIndex: 'totalAmount',
    },
    {
      title: <FormattedMessage id="challanDetails.table.action" />,
      render: (record) => {
        return (
          <div>
            <Button onClick={() => showModal(record)} size="small" type="link">
              {moneyStatus && moneyStatus === 'Not Deposited' && (
                <FormattedMessage id="challanDetails.table.uploadkara" />
              )}
              {moneyStatus && moneyStatus === 'Deposited' && (
                <FormattedMessage id="challanDetails.table.viewUpload" />
              )}
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <PageContainer>
      <Card>
        <Row style={{ marginBottom: 10 }}>
          <Col span={24}>
            <VillageSelector
              pageType="withYear"
              setCodeVillage={setCodeVillage}
              setTextForVillage={setTextVillage}
              onVillageChange={setButtonFlag}
              yearChange={setRevenueYear}
              setIsNirank={setIsNirank}
            />
          </Col>
        </Row>

        <Row style={{ marginTop: 20 }}>
          <Col span={7}>
            <Form.Item
              name="test"
              label={<FormattedMessage id="challanDetails.table.status" />}
              rules={[{ required: true }]}
            >
              <Select
                onSelect={(value, event) => handleOnChangeForStatus(value, event)}
                style={{ width: 200 }}
                placeholder="Please Select Type"
              >
                <Select.Option value="Deposited">
                  <FormattedMessage id="challanDetails.table.moneyDeposited" />
                </Select.Option>
                <Select.Option value="Not Deposited">
                  <FormattedMessage id="challanDetails.table.moneyNotDeposited" />
                </Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Button
              type="primary"
              /* disabled={buttonFlag || buttonFlag2} */ /* onClick={getChallan} */
              onClick={() => {
                if (textVillage && revenueYear && moneyStatus) {
                  getChallan();
                } else if (textVillage == null) {
                  message.info('Please Select Village !');
                } else if (revenueYear == null) {
                  message.info('Please Select Revenue Year !');
                } else if (moneyStatus == null) {
                  message.info('Please Select Money Status !');
                }
              }}
            >
              <FormattedMessage id="challanDetails.table.viewChallan" />
            </Button>
          </Col>
        </Row>
      </Card>
      <Card>
        <Table
          rowKey={(row) => row.id}
          loading={isLoading}
          bordered={true}
          columns={columns}
          dataSource={challanData}
        />
        <Modal
          width={1000}
          title={<FormattedMessage id="challanDetails.table.uploadChallan" />}
          visible={isModalVisible}
          okText={okText}
          onOk={handleOk}
          okButtonProps={{ disabled: saveButtonDisable }}
          cancelText={<FormattedMessage id="challanDetails.button.cancel" />}
          onCancel={handleCancel}
          confirmLoading={loading[0]}
        >
          <>
            <Card>
              <Row style={{ marginBottom: 20 }}>
                <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                  <Input
                    addonBefore={<FormattedMessage id="challanDetails.table.challanNo0029" />}
                    disabled
                    value={upperModalData && upperModalData.challanNo}
                  />
                </Col>
                <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>

                <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                  <Input
                    addonBefore={<FormattedMessage id="challanDetails.table.totalAmount29" />}
                    disabled
                    value={upperModalData && upperModalData.totalOfHead0029}
                  />
                </Col>
              </Row>
              <Row style={{ marginBottom: 20 }}>
                <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                  <Input
                    addonBefore={<FormattedMessage id="challanDetails.table.challanNo0045" />}
                    disabled
                    value={upperModalData && upperModalData.challanNo0045}
                  />
                </Col>
                <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>

                <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                  <Input
                    addonBefore={<FormattedMessage id="challanDetails.table.totalAmount45" />}
                    disabled
                    value={upperModalData && upperModalData.totalOfHead0045}
                  />
                </Col>
              </Row>
              <Row style={{ marginBottom: 20 }}>
                <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                  <Input
                    addonBefore={<FormattedMessage id="challanDetails.table.paymentMode" />}
                    value={upperModalData && upperModalData.modeOfPayment}
                    disabled
                  />
                </Col>
                <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>

                <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                  <Input
                    addonBefore={<FormattedMessage id="challanDetails.table.challanDate" />}
                    value={upperModalData && upperModalData.challanDate}
                    disabled
                  />
                </Col>
              </Row>
              <Row>
                <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                  <Input
                    addonBefore={<FormattedMessage id="challanDetails.table.totalAmount" />}
                    addonAfter={'₹'}
                    value={upperModalData && upperModalData.totalAmount}
                    disabled
                  />
                </Col>
              </Row>
            </Card>

            <>
              <Row style={{ marginTop: '30px' }}>
                <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                  <Form.Item rules={[{ required: true, message: 'Bank Name is Required..' }]}>
                    <Input
                      addonBefore={<FormattedMessage id="challanDetails.table.bankName" />}
                      value={modalData && modalData.bankName}
                      disabled={modalDisabled.bankAddressDisabled}
                      onChange={(e) => {
                        setDataInModal((prevDataInModal) => ({
                          ...prevDataInModal,
                          bankName: e.target.value,
                        }));
                      }}
                      maxLength={50}
                      onKeyPress={KeyPressEvents.isInputVarchar}
                    ></Input>
                  </Form.Item>
                </Col>
                <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>
                <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                  <Form.Item rules={[{ required: true, message: 'Bank Branch is Required..' }]}>
                    <Input
                      addonBefore={<FormattedMessage id="challanDetails.table.bankBranch" />}
                      value={modalData && modalData.bankAddress}
                      disabled={modalDisabled.bankAddressDisabled}
                      onChange={(e) => {
                        setDataInModal((prevDataInModal) => ({
                          ...prevDataInModal,
                          bankAddress: e.target.value,
                        }));
                      }}
                      maxLength={25}
                      onKeyPress={KeyPressEvents.isInputVarchar}
                    ></Input>
                  </Form.Item>
                </Col>
              </Row>
              <br />
              <Row>
                {dataInModal && dataInModal.challanNo == null ? (
                  <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                    <Form.Item
                      rules={[{ required: true, message: 'Bank Challan Number is Required..' }]}
                    >
                      <Input
                        addonBefore={
                          <FormattedMessage id="challanDetails.table.grassChallanNo0029" />
                        }
                        // value={dataInModal && dataInModal.bankReceiptNumber}
                        disabled={true}
                        // onChange={(e) => {
                        //   setDataInModal((prevDataInModal) => ({
                        //     ...prevDataInModal,
                        //     bankReceiptNumber: e.target.value,
                        //   }));
                        // }}
                        maxLength={18}
                        onKeyPress={KeyPressEvents.isInputVarchar}
                      ></Input>
                    </Form.Item>
                  </Col>
                ) : (
                  <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                    <Form.Item
                      rules={[{ required: true, message: 'Bank Challan Number is Required..' }]}
                    >
                      <Input
                        addonBefore={
                          <FormattedMessage id="challanDetails.table.grassChallanNo0029" />
                        }
                        value={modalData && modalData.bankReceiptNumber}
                        disabled={modalDisabled.bankReceiptNumberDisabled}
                        onChange={(e) => {
                          setDataInModal((prevDataInModal) => ({
                            ...prevDataInModal,
                            bankReceiptNumber: e.target.value,
                          }));
                        }}
                        maxLength={18}
                        onKeyPress={KeyPressEvents.isInputVarchar}
                      ></Input>
                    </Form.Item>
                  </Col>
                )}
                <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>
                {dataInModal && dataInModal.challanNo0045 == null ? (
                  <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                    <Form.Item
                      rules={[{ required: true, message: 'Bank Challan Number is Required..' }]}
                    >
                      <Input
                        addonBefore={
                          <FormattedMessage id="challanDetails.table.grassChallanNo0045" />
                        }
                        // value={dataInModal && dataInModal.bankReceiptNumber0045}
                        disabled={true}
                        // onChange={(e) => {
                        //   setDataInModal((prevDataInModal) => ({
                        //     ...prevDataInModal,
                        //     bankReceiptNumber0045: e.target.value,
                        //   }));
                        // }}
                        maxLength={18}
                        onKeyPress={KeyPressEvents.isInputVarchar}
                      ></Input>
                    </Form.Item>
                  </Col>
                ) : (
                  <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                    <Form.Item
                      rules={[{ required: true, message: 'Bank Challan Number is Required..' }]}
                    >
                      <Input
                        addonBefore={
                          <FormattedMessage id="challanDetails.table.grassChallanNo0045" />
                        }
                        value={modalData && modalData.bankReceiptNumber0045}
                        disabled={modalDisabled.bankReceiptNumber0045Disabled}
                        onChange={(e) => {
                          setDataInModal((prevDataInModal) => ({
                            ...prevDataInModal,
                            bankReceiptNumber0045: e.target.value,
                          }));
                        }}
                        maxLength={18}
                        onKeyPress={KeyPressEvents.isInputVarchar}
                      ></Input>
                    </Form.Item>
                  </Col>
                )}
              </Row>
              <Row>
                <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                  <Input
                    addonBefore={<FormattedMessage id="challanDetails.table.totalAmount" />}
                    addonAfter="₹"
                    value={dataInModal && dataInModal.totalAmount}
                    disabled={true}
                    onChange={(e) => setBankAmount(e.target.value)}
                    maxLength={10}
                    onKeyPress={KeyPressEvents.isInputVarchar}
                  ></Input>
                </Col>
              </Row>
              {moneyStatus && moneyStatus === 'Not Deposited' && (
                <Form form={myForm} initialValues={initvalues}>
                  <Row style={{ marginTop: '20px' }}>
                    {dataInModal && dataInModal.challanNo == null ? (
                      <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                        <Form.Item
                          name="image"
                          rules={[
                            {
                              required: true,
                              message: 'Please Add Image',
                            },
                          ]}
                        >
                          <Input
                            disabled={true}
                            addonBefore="भरणा केलेले चलन अपलोड करा (0029)"
                            // accept="image/png,image/jpeg,image/jpeg,application/pdf"
                            type={'file'}
                            name={'file'}
                            // onChange={(e) => handleFile(e)}
                          ></Input>
                        </Form.Item>
                      </Col>
                    ) : (
                      <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                        <Form.Item
                          name="image"
                          rules={[
                            {
                              required: true,
                              message: 'Please Add Image',
                            },
                          ]}
                        >
                          <Input
                            addonBefore="भरणा केलेले चलन अपलोड करा (0029)"
                            accept="image/png,image/jpeg,image/jpeg,application/pdf"
                            type={'file'}
                            name={'file'}
                            onChange={(e) => handleFile(e)}
                          ></Input>
                        </Form.Item>
                      </Col>
                    )}
                    <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>

                    {dataInModal && dataInModal.challanNo0045 == null ? (
                      <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                        <Form.Item
                          name="image1"
                          rules={[
                            {
                              required: true,
                              message: 'Please Add Image',
                            },
                          ]}
                        >
                          <Input
                            disabled={true}
                            addonBefore="भरणा केलेले चलन अपलोड करा (0045)"
                            // accept="image/png,image/jpeg,image/jpeg,application/pdf"
                            type={'file'}
                            name={'file0045'}
                            // onChange={(e) => handleFile0045(e)}
                          ></Input>
                        </Form.Item>
                      </Col>
                    ) : (
                      <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                        <Form.Item
                          name="image1"
                          rules={[
                            {
                              required: true,
                              message: 'Please Add Image',
                            },
                          ]}
                        >
                          <Input
                            addonBefore="भरणा केलेले चलन अपलोड करा (0045)"
                            accept="image/png,image/jpeg,image/jpeg,application/pdf"
                            type={'file'}
                            name={'file0045'}
                            onChange={(e) => handleFile0045(e)}
                          ></Input>
                        </Form.Item>
                      </Col>
                    )}
                  </Row>
                </Form>
              )}
              <Row>
                <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                  {selectedImage && <Image width={300} height={200} src={selectedImage} />}
                </Col>
                <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>

                <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                  {selectedImage1 && <Image width={300} height={200} src={selectedImage1} />}
                </Col>
              </Row>
              {moneyStatus && moneyStatus === 'Deposited' && (
                <>
                  {dataInModal && dataInModal.challanNo == null ? (
                    ''
                  ) : (
                    <>
                      <Row style={{ marginTop: '20px' }}>
                        <Col span={8}>
                          <Image width={300} height={200} src={newImageState} />
                        </Col>
                        <Col span={1}></Col>
                        <Col span={8}>
                          <p>
                            {<FormattedMessage id="challanDetails.table.fileName" />}
                            {downloadedImageName}
                          </p>
                        </Col>
                      </Row>
                      <Row style={{ marginTop: 10 }}>
                        <Button
                          type="primary"
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = newImageState;
                            link.setAttribute('download', 'file.jpeg,file.png,file.pdf'); //or any other extension
                            link.download = dataInModal?.actualFileName;
                            document.body.appendChild(link);
                            link.click();
                          }}
                        >
                          <FormattedMessage id="challanDetails.table.download" />
                        </Button>
                      </Row>
                    </>
                  )}

                  {dataInModal && dataInModal.challanNo0045 == null ? (
                    ''
                  ) : (
                    <>
                      <Row style={{ marginTop: '10px' }}>
                        <Col span={8}>
                          <Image width={300} height={200} src={newImageState0045} />
                        </Col>
                        <Col span={1}></Col>
                        <Col span={8}>
                          <p>
                            {<FormattedMessage id="challanDetails.table.fileName" />}
                            {downloadedImageName0045}
                          </p>
                        </Col>
                      </Row>
                      <Row style={{ marginTop: 10 }}>
                        <Button
                          type="primary"
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = newImageState0045;
                            link.setAttribute('download', 'file.jpeg,file.png,file.pdf'); //or any other extension
                            link.download = dataInModal?.actualFileName;
                            document.body.appendChild(link);
                            link.click();
                          }}
                        >
                          <FormattedMessage id="challanDetails.table.download" />
                        </Button>
                      </Row>
                    </>
                  )}
                </>
              )}
            </>
          </>
        </Modal>
      </Card>
    </PageContainer>
  );
}
export default ChallanDetails;
