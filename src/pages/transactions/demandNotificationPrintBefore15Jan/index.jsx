import React, { useState, useEffect, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Form, Button, Card, Col, DatePicker, Input, InputNumber, Row, Select } from 'antd';
import { useReactToPrint } from 'react-to-print';
import { useLocation } from 'react-router-dom';
import { useModel } from 'umi';
import { FormattedMessage } from 'umi';
import styles from './styles.module.css';

function DemandNotificationPrintBefore15() {
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
          {/* {console.log(location.state?.receipts, '--------------recipt')} */}
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
              <Row>
                <Col xl={12} lg={12} md={10} sm={11} xs={10}></Col>
                <Col xl={4}>
                  <h5>नमुना १</h5>
                </Col>
              </Row>
              <Row>
                <Col xl={9} lg={8} md={6} sm={5} xs={7}></Col>
                <Col>
                  <h4>(महाराष्‍ट्र जमीन महसुलाच्या वसुलीबाबत नियम, १९६७ नियम ५</h4>
                  <h4>आणि महाराष्‍ट्र जमीन महसूल अधिनियम १९६६, कलम १७८ पहा)</h4>
                </Col>
              </Row>
              {/* <Row>
                <Col xl={9} lg={8} md={6} sm={5} xs={7}></Col>
                <Col></Col>
              </Row> */}
              <Row style={{ marginLeft: '10px' }}>
                <Col xl={9} lg={8} md={6} sm={5} xs={7}></Col>

                <Col>
                  <b> मागणी तपशील ( 01/08/2025 रोजी निश्चित मागणी नुसार)</b>
                </Col>
              </Row>

              <table
                cellPadding={9}
                cellSpacing={9}
                className={styles.center}
                style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}
              >
                <Row style={{ marginTop: '55px' }}>
                  <Col xl={4} lg={12} md={10}>
                    <p> प्रति,</p>
                  </Col>
                </Row>
                <Row>
                  <Col xl={24}>
                    {receipt.khataOwnerName} , राहणार {this.props.village} तालुका{' '}
                    {this.props.taluka}, जिल्हा {this.props.district}.<br />{' '}
                  </Col>
                </Row>
                <Row>
                  <Col xl={12}>
                    <tr>
                      <td>गाव:</td>
                      <td>{this.props.village}</td>
                    </tr>
                  </Col>
                  <Col xl={12}>
                    <tr>
                      <td>खाते क्रमांक:</td>
                      {/* <td>{receipt.khataNo}</td> */}
                      {receipt.khataNo && (
                        <>
                          <td>{receipt.khataNo}</td>
                        </>
                      )}
                      {receipt.makhtaKhataNo && (
                        <>
                          <td>{receipt.makhtaKhataNo}</td>
                        </>
                      )}
                    </tr>
                  </Col>
                </Row>
                <Row>
                  <Col xl={12}>
                    <tr>
                      <td>भूमापन व उप-विभाग क्रमांक : {receipt.surveyHissaNo}</td>
                    </tr>
                  </Col>
                  <Col xl={12}>
                    <tr>
                      {receipt.akrushiKAR > '0.00' ? (
                        <td>
                          क्षेत्र : {receipt.areaHRValue} हे. {receipt.areaSQValue} आर.चौमी
                        </td>
                      ) : (
                        <td>
                          क्षेत्र : {receipt.areaHRValue} हे. {receipt.areaSQValue} आर
                        </td>
                      )}
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
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <tr>
                      <td>९) रो.ह. उपकर: ₹ {receipt.employeeGuaranteeScheme}</td>

                      <td colSpan={5}> </td>
                    </tr>
                  </Col>
                  <Col span={12}></Col>
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
                {/* <Row>
                  <Col span={12}>
                    <tr>
                      <td>११) नोटिसीचा खर्च: ₹ {receipt.noticeAmount}</td>
                      <td colSpan={5}> </td>
                    </tr>
                  </Col>
                  <Col span={12}></Col>
                </Row> */}
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
                {/* <tr>
                  <td>ही नोटीस माझ्या सही व या कार्यालयाच्या शिक्क्यानिशी दिली </td>
                </tr> */}
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
                      {/* <td>तलाठी: </td> */}
                      <td>ग्राम महसूल अधिकारी: </td>

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
              </table>
            </Card>
          ))}
      </div>
    );
  }
}

export default DemandNotificationPrintBefore15;
