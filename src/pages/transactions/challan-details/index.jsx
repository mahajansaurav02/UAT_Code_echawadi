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
  const [revenueYear, setRevenueYear] = useState('2025-26');
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
  const [challan0029Flag, setChallan0029Flag] = useState(false);
  const [challan0045Flag, setChallan0045Flag] = useState(false);
  const [file0029Flag, setFile0029Flag] = useState(false);
  const [file0045Flag, setFile0045Flag] = useState(false);

  const [revenueYearForVillage, setRevenueYearForVillage] = useState();

  const onYearChange = (value, event) => {
    setRevenueYear(value);
  };

  const getRevenueYear = async () => {
    sendRequest(`${URLS.BaseURL}/revenueYear/getRevenueYearData`, 'GET', null, (res) => {
      var data = res.data?.revenueYearData;
      setRevenueYearForVillage(
        data.map((row) => ({
          label: row.revenueYear,
          value: row.revenueYear,
        })),
      );
    });
  };
  useEffect(() => {
    getRevenueYear();
  }, []);

  const initvalues = {
    image: '',
    image1: '',
    bankName: '',
    bankAddress: '',
    bankReceiptNumber: '',
    bankReceiptNumber0045: ''
  };

  const [myForm] = Form.useForm();

  // Reset form function
  const resetFormAndState = () => {
    myForm.resetFields();
    setFile(null);
    setFile0045(null);
    setSelectedImage(null);
    setSelectedImage1(null);
    setDownloadedImageName(null);
    setDownloadedImageName0045(null);
    setNewImageState(null);
    setNewImageState0045(null);
    setFile0029Flag(false);
    setFile0045Flag(false);
    setChallan0029Flag(false);
    setChallan0045Flag(false);
    setDataInModal(null);
    setModalData(null);
    setUpperModalData(null);
  };

  const showModal = (record) => {
    resetFormAndState(); // Reset form when opening modal for new record

    setModalData();
    const body = {
      id: record.id,
      cCode: codeVillage,
    };

    console.log(body, "payload check")
    sendRequest(`${URLS.BaseURL}/landRevenue/download?districtCode=${districtCode}&talukaCode=${talukaCode}&revenueYear=${revenueYear}&cCode=${codeVillage}`, 'POST', body, (res) => {
      const upperData = {
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
      };
      setUpperModalData(upperData);

      // Set form values based on the record data
      const formValues = {
        bankName: record.bankName || '',
        bankAddress: record.bankAddress || '',
        bankReceiptNumber: record.bankReceiptNumber || '',
        bankReceiptNumber0045: record.bankReceiptNumber0045 || '',
      };

      myForm.setFieldsValue(formValues);
    });

    const modalDataObj = {
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
    };

    setDataInModal(modalDataObj);

    let bankNameDisabled = false,
      bankAddressDisabled = false,
      bankReceiptNumberDisabled = false,
      bankReceiptNumber0045Disabled = false;

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
      }

      sendRequest(`${URLS.BaseURL}/landRevenue/download?districtCode=${districtCode}&talukaCode=${talukaCode}&revenueYear=${revenueYear}&cCode=${codeVillage}`, 'POST', body, (res) => {
        const modalDataResponse = {
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
        };

        setModalData(modalDataResponse);

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

    setIsModalVisible(true);
  };

 const handleOk = () => {
  // Validate all form fields before proceeding
  myForm.validateFields()
    .then((values) => {
      // Get the current form values and update dataInModal immediately
      const formValues = myForm.getFieldsValue();
      const updatedDataInModal = {
        ...dataInModal,
        ...formValues
      };
      
      // Use the updated data immediately
      setDataInModal(updatedDataInModal);
      
      // enterLoading(0);
      saveChallan(updatedDataInModal); // Pass the updated data directly
    })
    .catch((errorInfo) => {
      console.log('Validation failed:', errorInfo);
      message.error('Please fill all required fields correctly!');
    });
};

// Update saveChallan to accept parameter
const saveChallan = async (currentData = dataInModal) => {
  let myfile = file;
  let myFile1 = file0045;
  const val0029 = upperModalData?.totalOfHead0029 || 0;
  const val0045 = upperModalData?.totalOfHead0045 || 0;

  // Create FormData here and pass it to saveChallanMethod
  const formData = new FormData();

  // Use currentData instead of dataInModal
  if (
    val0029 > 0 &&
    val0045 > 0 &&
    file0029Flag == false &&
    file0045Flag == false
  ) {
    message.error('कृपया 0029 आणि 0045 भरणा केलेले चलन अपलोड करा');
  } else if ((val0029 != null || val0029 > 0) && val0045 == 0 && file0029Flag == true) {
    formData.append('file', myfile);
    saveChallanMethod(currentData, formData); // Pass both currentData and formData
  } else if (
    (val0045 != null || val0045 > 0) &&
    (val0029 == 0 || val0029 == null) &&
    file0045Flag == true
  ) {
    formData.append('file0045', myFile1);
    saveChallanMethod(currentData, formData); // Pass both currentData and formData
  } else if (val0029 > 0 && val0045 > 0 && file0045Flag == true && file0029Flag == false) {
    message.error('कृपया 0029 भरणा केलेले चलन अपलोड करा');
  } else if (val0029 > 0 && val0045 == 0 && file0045Flag == false && file0029Flag == false) {
    message.error('कृपया 0029 भरणा केलेले चलन अपलोड करा');
  } else if (val0029 > 0 && val0045 > 0 && file0029Flag == true && file0045Flag == false) {
    message.error('कृपया 0045 भरणा केलेले चलन अपलोड करा');
  } else if (val0045 > 0 && val0029 == 0 && file0045Flag == false && file0029Flag == false) {
    message.error('कृपया 0045 भरणा केलेले चलन अपलोड करा');
  } else {
    formData.append('file', myfile);
    formData.append('file0045', myFile1);
    saveChallanMethod(currentData, formData); // Pass both currentData and formData
  }
};

// Update saveChallanMethod to accept both parameters
const saveChallanMethod = async (currentData = dataInModal, formData = new FormData()) => {
  if (modalButtonState == 'Not Deposited') {
    // Use currentData instead of dataInModal
    if (!currentData?.bankName?.trim()) {
      message.error('Bank Name is required!');
      return;
    }
    if (!currentData?.bankAddress?.trim()) {
      message.error('Bank Branch is required!');
      return;
    }
    if (currentData?.challanNo && !currentData?.bankReceiptNumber?.trim()) {
      message.error('Bank Challan Number (0029) is required!');
      return;
    }
    if (currentData?.challanNo0045 && !currentData?.bankReceiptNumber0045?.trim()) {
      message.error('Bank Challan Number (0045) is required!');
      return;
    }

    // Append all data to FormData
    formData.append('id', currentData.id);
    formData.append('bankName', currentData.bankName);
    formData.append('bankAddress', currentData.bankAddress);
    formData.append('bankReceiptNumber', currentData.bankReceiptNumber || '');
    formData.append('bankReceiptNumber0045', currentData.bankReceiptNumber0045 || '');
    formData.append('revenueYear', revenueYear);
    formData.append('districtCode', districtCode);
    formData.append('talukaCode', talukaCode);
    formData.append('ccode', codeVillage);

    console.log('Saving data:', currentData); // Debug log

    await Axios.put(
      `${URLS.BaseURL}/landRevenue/updateChallanDetails`,
      formData,
      {
        headers: {
          Authorization: Header,
          echHost: echHost,
          mhrHost: mhrHost,
          echDbName: echDbName,
          echSchemaName: echSchemaName,
          mhrDbName: mhrDbName,
          mhrSchemaName: mhrSchemaName,
          'Content-Type': 'multipart/form-data',
        },
      },
    ).then((res) => {
      if (res.status === 204) {
        resetFormAndState();
        message.success('Challan Details Saved!!');
        getChallan();
        setIsModalVisible(false);
      }
    }).catch((error) => {
      console.error('Error saving challan:', error);
      message.error('Error saving challan details!');
    });
  } else {
    setIsModalVisible(false);
    resetFormAndState();
  }
};

  const handleCancel = () => {
    setIsModalVisible(false);
    resetFormAndState(); // Reset form when canceling
  };

  const handleOnChangeForStatus = (value, event) => {
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
    setFile0029Flag(true);
    function checkFileSize(fileSize) {
      if (fileSize >= 1000000) {
        message.error('File Should not be more than 1 MB !');
        myForm.setFieldsValue({ image: '' });
        return false;
      } else {
        return true;
      }
    }
    function checkFileExtension(filename) {
      const extension = filename.split('.').pop();
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
  };

  const handleFile0045 = async (e) => {
    setFile0045Flag(true);
    function checkFileSize(fileSize) {
      if (fileSize >= 1000000) {
        message.error('File Should not be more than 1 MB !');
        myForm.setFieldsValue({ image1: '' });
        return false;
      } else {
        return true;
      }
    }
    function checkFileExtension(filename) {
      const extension = filename.split('.').pop();
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
          <Col span={20}>
            <VillageSelector
              pageType="withoutYear"
              setCodeVillage={setCodeVillage}
              setTextForVillage={setTextVillage}
              onVillageChange={setButtonFlag}
              yearChange={setRevenueYear}
              setIsNirank={setIsNirank}
            />
          </Col>

          <Col xl={2} lg={2} md={24} sm={24} xs={24}>
            <Form.Item
              style={{ marginTop: 10, marginLeft: -440 }}
              labelCol={{ lg: 12 }}
              wrapperCol={{ lg: 12 }}
              label={<FormattedMessage id="villageSelector.label.revenueYear" />}
            >
              <Select
                options={revenueYearForVillage}
                style={{ width: 142 }}
                value={revenueYear}
                placeholder={'महसूल वर्ष'}
                onChange={(value, event) => onYearChange(value, event)}
              ></Select>
            </Form.Item>
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
          destroyOnClose={true} // This ensures modal content is destroyed when closed
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

            <Form
              form={myForm}
              layout="vertical"
              initialValues={initvalues}
              preserve={false} // This ensures form values are not preserved when unmounted
            >
              <Row style={{ marginTop: '30px' }}>
                <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                  <Form.Item
                    name='bankName'
                    label="Bank Name"
                    rules={[{ required: true, message: 'Bank Name is Required!' }]}
                  >
                    <Input
                      disabled={modalDisabled.bankNameDisabled}
                      maxLength={50}
                      onKeyPress={KeyPressEvents.isInputVarchar}
                    />
                  </Form.Item>
                </Col>
                <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>
                <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                  <Form.Item
                    name='bankAddress'
                    label="Bank Branch"
                    rules={[{ required: true, message: 'Bank Branch is Required!' }]}
                  >
                    <Input
                      disabled={modalDisabled.bankAddressDisabled}
                      maxLength={25}
                      onKeyPress={KeyPressEvents.isInputVarchar}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row>
                {dataInModal && dataInModal.challanNo == null ? (
                  <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                    <Form.Item
                      name="bankReceiptNumber"
                      label="Grass Challan No (0029)"
                    >
                      <Input
                        disabled={true}
                        maxLength={18}
                        onKeyPress={KeyPressEvents.isInputVarchar}
                      />
                    </Form.Item>
                  </Col>
                ) : (
                  <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                    <Form.Item
                      name='bankReceiptNumber'
                      label="Grass Challan No (0029)"
                      rules={[{ required: true, message: 'Bank Challan Number is Required!' }]}
                    >
                      <Input
                        disabled={modalDisabled.bankReceiptNumberDisabled}
                        maxLength={18}
                        onKeyPress={KeyPressEvents.isInputVarchar}
                      />
                    </Form.Item>
                  </Col>
                )}
                <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>
                {dataInModal && dataInModal.challanNo0045 == null ? (
                  <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                    <Form.Item
                      name="bankReceiptNumber0045"
                      label="Grass Challan No (0045)"
                    >
                      <Input
                        disabled={true}
                        maxLength={18}
                        onKeyPress={KeyPressEvents.isInputVarchar}
                      />
                    </Form.Item>
                  </Col>
                ) : (
                  <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                    <Form.Item
                      name='bankReceiptNumber0045'
                      label="Grass Challan No (0045)"
                      rules={[{ required: true, message: 'Bank Challan Number is Required!' }]}
                    >
                      <Input
                        disabled={modalDisabled.bankReceiptNumber0045Disabled}
                        maxLength={18}
                        onKeyPress={KeyPressEvents.isInputVarchar}
                      />
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
                    maxLength={10}
                    onKeyPress={KeyPressEvents.isInputVarchar}
                  />
                </Col>
              </Row>

              {moneyStatus && moneyStatus === 'Not Deposited' && (
                <>
                  <Row style={{ marginTop: '20px' }}>
                    {dataInModal &&
                      (dataInModal.challanNo == null || dataInModal.challanNo == 0) ? (
                      <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                        <Form.Item
                          name="image"
                          label="भरणा केलेले चलन अपलोड करा (0029)"
                        >
                          <Input
                            disabled={true}
                            accept="image/png,image/jpeg,image/jpeg,application/pdf"
                            type={'file'}
                            name={'file'}
                          />
                        </Form.Item>
                      </Col>
                    ) : (
                      <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                        <Form.Item
                          name="image"
                          label="भरणा केलेले चलन अपलोड करा (0029)"
                          rules={[
                            {
                              required: true,
                              message: 'Please Add Image',
                            },
                          ]}
                        >
                          <Input
                            accept="image/png,image/jpeg,image/jpeg,application/pdf"
                            type={'file'}
                            name={'file'}
                            onChange={(e) => handleFile(e)}
                          />
                        </Form.Item>
                      </Col>
                    )}
                    <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>

                    {dataInModal &&
                      (dataInModal.challanNo0045 == null || dataInModal.challanNo0045 == 0) ? (
                      <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                        <Form.Item
                          name="image1"
                          label="भरणा केलेले चलन अपलोड करा (0045)"
                        >
                          <Input
                            disabled={true}
                            accept="image/png,image/jpeg,image/jpeg,application/pdf"
                            type={'file'}
                            name={'file0045'}
                          />
                        </Form.Item>
                      </Col>
                    ) : (
                      <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                        <Form.Item
                          name="image1"
                          label="भरणा केलेले चलन अपलोड करा (0045)"
                          rules={[
                            {
                              required: true,
                              message: 'Please Add Image',
                            },
                          ]}
                        >
                          <Input
                            accept="image/png,image/jpeg,image/jpeg,application/pdf"
                            type={'file'}
                            name={'file0045'}
                            onChange={(e) => handleFile0045(e)}
                          />
                        </Form.Item>
                      </Col>
                    )}
                  </Row>

                  <Row>
                    <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                      {selectedImage && <Image width={300} height={200} src={selectedImage} />}
                    </Col>
                    <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>
                    <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                      {selectedImage1 && <Image width={300} height={200} src={selectedImage1} />}
                    </Col>
                  </Row>
                </>
              )}
            </Form>

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
                          link.setAttribute('download', downloadedImageName);
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
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
                          link.setAttribute('download', downloadedImageName0045 || 'file.jpg');
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
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
        </Modal>
      </Card>
    </PageContainer>
  );
}

export default ChallanDetails;