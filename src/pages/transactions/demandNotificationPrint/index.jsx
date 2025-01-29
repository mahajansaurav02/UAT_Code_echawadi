import React, { useState, useEffect, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Form, Button, Card, Col, DatePicker, Input, InputNumber, Row, Select } from 'antd';
import Selector from '../common/selector';
import ValidationPatterns from '@/components/eComponents/ValidationPatterns';
import BasicInput from '@/components/eComponents/BasicInput/BasicInput';
import Axios from 'axios';
import { render } from 'react-dom';
import { useReactToPrint } from 'react-to-print';
import { useLocation } from 'react-router-dom';
import { BorderBottomOutlined } from '@ant-design/icons';
import { Color } from '@antv/l7-react/lib/component/LayerAttribute';
import { useModel } from 'umi';
import { FormattedMessage } from 'umi';
import styles from './styles.module.css';
function DemandNotificationPrint(props) {
  const [textInput, setTextInput] = useState('');
  const [textVillage, setTextVillage] = useState('');
  const [form] = Form.useForm();
  const componentRef = useRef();
  const [village, setVillage] = useState([]);
  const location = useLocation();
  const { marathiName, villageData } = useModel('details');
  const [villageSaja, setVillageSaja] = useState([]);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  useEffect(() => {
    setVillageSaja(villageData[0]?.sajjaName);
  }, []);

  return (
    <div>
      <PageContainer>
        <Card>
          <Button type="primary" style={{ marginRight: '100px' }} onClick={handlePrint}>
            <FormattedMessage id="transactionCommon.table.print" />
          </Button>
          {/* Const {khataNo,LR,ZP} = {location.state}; */}
          <ComponentToPrint
            ref={componentRef}
            district={location.state?.district}
            taluka={location.state?.taluka}
            village={location.state?.village}
            receipts={location.state?.receipts}
            marathiName={marathiName}
            sajjaName={villageSaja}
          />
        </Card>
      </PageContainer>
    </div>
  );
}

class ComponentToPrint extends React.Component {
  render() {
    // console.log('all receipts==>', this.props.receipts);
    return (
      <div>
        {this.props.receipts &&
          this.props.receipts.map((receipt, index) => (
            <Card>
              <table
                className={styles}
                cellPadding={9}
                cellSpacing={9}
                // style={{ fontWeight: 'bold' }}
              >
                <tr style={{ marginBottom: 25 }}>
                  <td>
                    <h5 align="center">नमुना १</h5>
                    <h4 align="center">(महाराष्‍ट्र जमीन महसुलाच्या वसुलीबाबत नियम, १९६७ नियम ५</h4>
                    <h4 align="center">आणि महाराष्‍ट्र जमीन महसूल अधिनियम १९६६, कलम १७८ पहा)</h4>
                  </td>
                </tr>
                <tr>
                  <td colSpan={6}>
                    <h2 align="center">
                      <b>कसूरदारास मागणी नोटीस</b>
                    </h2>
                  </td>
                </tr>
                <div style={{ float: 'right' }}></div>
                <div style={{ align: 'center', marginTop: '5px' }}>
                  <tr style={{ marginTop: 25 }}>
                    <p>
                      प्रति,
                      <br />
                      {receipt.khataOwnerName} ,<br /> राहणार {this.props.village} तालुका{' '}
                      {this.props.taluka}, जिल्हा {this.props.district},<br /> आपणास याद्वारे ही
                      नोटीस देण्यात येत आहे की, सन 2024 ते 2025 या महसूल वर्षासाठी, खालील
                      विवरणपत्रात दिलेल्या तपशिलाप्रमाणे, जमीन महसुलाच्या थकबाकीबद्दल आपणाकडून रुपये{' '}
                      {receipt.TotalDemand} (अक्षरी रूपये)
                      {receipt.AmountInWords} येणे आहेत. आणि ही नोटीस बजावल्याच्या तारखेपासून पंधरा
                      दिवसांच्या आत, उक्त रक्कम व या नोटीस दाखल आकारणीयोग्य असलेली फी म्हणून रुपये{' '}
                      {receipt.noticeAmount} एवढी रक्कम, न दिल्यास, देय रकमांच्या वसुली नियमान्‍वये
                      तुमच्याविरुद्ध अनिवार्य कारवाई करण्यात येईल व महाराष्ट्र जमीन महसूल अधिनियम
                      १९६६, कलम १७४ अन्वये उक्त थकबाकीच्या एक-चतुर्थांशापेक्षा अधिक असणार नाही एवढी
                      रक्कम, वाढीव दंड म्हणून वसूल करण्‍यात येईल.
                    </p>
                  </tr>
                </div>
                <Row>
                  <Col span={12}>
                    <tr>
                      <td>गाव:</td>
                      <td>{this.props.village}</td>
                    </tr>
                  </Col>
                  <Col span={12}>
                    <tr>
                      <td>खाते क्रमांक:</td>
                      <td>{receipt.khataNo}</td>
                    </tr>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <tr>
                      <td>भूमापन व उप-विभाग क्रमांक : {receipt.surveyHissaNo}</td>
                    </tr>
                  </Col>
                  <Col span={12}>
                    <tr>
                      <td>
                        क्षेत्र : {receipt.areaHRValue} हे.आर. {receipt.areaSQValue} चौमी
                      </td>
                    </tr>
                  </Col>
                </Row>

                <tr>
                  <td>
                    <h3>
                      <b>
                        <u>थकबाकीची रक्कम:</u>
                      </b>
                    </h3>
                  </td>
                </tr>
                <Row>
                  <Col span={12}>
                    <tr>
                      <td>१) मागील थकबाकी: ₹ {receipt.preYearTotal}</td>
                    </tr>
                  </Col>
                  <Col span={12}>
                    <tr>
                      <td>२) नियत जमीन महसूल: ₹ {receipt.LR}</td>
                    </tr>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <tr>
                      <td>३) वाढीव जमीन महसूल: ₹ {receipt.AddLandRevenue}</td>

                      <td colSpan={5}> </td>
                    </tr>
                  </Col>
                  <Col span={12}>
                    <tr>
                      <td>४) अकृषीक कर: ₹ {receipt.akrushiKAR}</td>
                      <td colSpan={5}> </td>
                    </tr>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <tr>
                      <td>५) जि.प. उपकर: ₹ {receipt.ZP}</td>
                      <td> </td>
                    </tr>
                  </Col>
                  <Col>
                    <tr>
                      <td>६) ग्रा.पं. उपकर: ₹ {receipt.VP}</td>
                      <td colSpan={5}> </td>
                    </tr>
                    {/*  <tr>
                      <b>
                        <td>४) ग्रा.पं. उपकर:</td>
                        <td colSpan={5}> ₹ {receipt.VP}</td>
                      </b>
                    </tr> */}
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <tr>
                      <td>७) शिक्षण उपकर: ₹ {receipt.EducationCess} </td>

                      <td colSpan={5}></td>
                    </tr>
                  </Col>

                  <Col span={12}>
                    <tr>
                      <td>८) वाढीव शिक्षण उपकर: ₹ {receipt.AddlEducationCess}</td>

                      <td colSpan={5}> </td>
                    </tr>
                    {/*  <tr>
                      <b>
                        <td>६) रो.ह. उपकर:</td>

                        <td colSpan={5}> ₹ {receipt.employeeGuaranteeScheme} </td>
                      </b>
                    </tr> */}
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <tr>
                      <td>९) रो.ह. उपकर: ₹ {receipt.employeeGuaranteeScheme}</td>

                      <td colSpan={5}> </td>
                    </tr>
                    {/* <tr>
                      <b>
                        <td>७) वाढीव जमीन महसूल:</td>

                        <td colSpan={5}> ₹ {receipt.AddLandRevenue}</td>
                      </b>
                    </tr> */}
                  </Col>
                  <Col span={12}>
                    {/*  <tr>
                      <b>
                        <td>८) वाढीव शिक्षण उपकर:</td>

                        <td colSpan={5}> ₹ {receipt.AddlEducationCess} </td>
                      </b>
                    </tr> */}
                  </Col>
                </Row>
                <Row>
                  <tr>
                    <td>१०) संकीर्ण जमीन महसूल (स्था.क. सह): ₹ {receipt.localCess}</td>
                    <td colSpan={5}></td>
                  </tr>
                </Row>
                <Row>
                  <tr>
                    <td>१०-अ) संकीर्ण जमीन महसूल (स्था.क. शिवाय): ₹ {receipt.otherLocalCess}</td>
                    <td colSpan={5}></td>
                  </tr>
                </Row>
                <Row>
                  <Col span={12}>
                    <tr>
                      <td>११) नोटिसीचा खर्च: ₹ {receipt.noticeAmount}</td>
                      <td colSpan={5}> </td>
                    </tr>
                  </Col>
                  <Col span={12}></Col>
                </Row>
                <tr>
                  <b>
                    <td>
                      एकूण देय रक्‍कम: ₹ {receipt.TotalDemand} ({receipt.AmountInWords})
                    </td>

                    <td colSpan={5}></td>
                  </b>
                </tr>
                {/* <tr>
                  <b></b>
                </tr> */}
                <tr>
                  <td>ही नोटीस माझ्या सही व या कार्यालयाच्या शिक्क्यानिशी दिली </td>
                </tr>
                <Row>
                  <Col span={8}>
                    <tr>
                      <td>ठिकाण: {this.props.village} </td>
                    </tr>
                  </Col>
                </Row>
                <Row>
                  <Col span={7}>
                    <tr>
                      <td>दिनांक: {receipt.dateCreate}</td>
                    </tr>
                  </Col>
                  <Col span={7}>
                    <tr>
                      <td>कार्यालयाचा शिक्‍का </td>
                    </tr>
                  </Col>
                  <Col span={9}>
                    <tr>
                      <td>सही/-</td>
                    </tr>
                  </Col>
                </Row>
                <Row>
                  <Col span={7}></Col>
                  <Col span={7}></Col>
                  <Col span={9}>
                    <tr>
                      {/* <td>तलाठी : </td> */}
                      <td>ग्राम महसूल अधिकारी : </td>

                      <td>{this.props.marathiName}</td>
                    </tr>
                  </Col>
                </Row>
                <Row>
                  <Col span={7}></Col>
                  <Col span={7}></Col>
                  <Col span={9}>
                    <tr>
                      <td>साझा - </td>
                      <td>{this.props.sajjaName}</td>
                    </tr>
                  </Col>
                </Row>
                {/* <tr>
              <td>In Words-</td>
              <td colSpan={5}>{receipt.AmountInWords}</td>
            </tr> */}
              </table>
            </Card>
          ))}
      </div>
    );
  }
}
// }

export default DemandNotificationPrint;
