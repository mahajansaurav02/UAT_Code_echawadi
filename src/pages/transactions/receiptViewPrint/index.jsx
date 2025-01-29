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
import emblem from '../../homepage/GOI Emblem.png';
import logo1 from '../../homepage/logo1.png';

function ReceiptViewPrint(props) {
  const { marathiName, villageData } = useModel('details');
  const [textInput, setTextInput] = useState('');
  const [textVillage, setTextVillage] = useState('');
  const [form] = Form.useForm();
  const componentRef = useRef();
  const [village, setVillage] = useState([]);
  const location = useLocation();
  const [villageSaja, setVillageSaja] = useState([]);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  useEffect(() => {
    setVillageSaja(
      villageData.map((r) => (location.state?.village === r.villageName ? r.sajjaName : '')),
    );
  }, []);

  // console.log(location.state?.lrAmount + '-11---logs-class function--' + location.state?.khataNo);

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
            khataNo={location.state?.khataNo}
            makhtaKhataNo={location.state?.makhtaKhataNo}
            // LR={location.state?.lrAmount}
            LR={location.state?.lrAmount <= 5 ? 0 : location.state?.lrAmount}
            ZP={location.state?.zpAmount}
            VP={location.state?.gvAmount}
            addLandRevenue={location.state?.addLandRevenue}
            preYearTotal={location.state?.preYearTotal}
            AkrushikLR={location.state?.lrAmountAkrushik}
            educationalCess={location.state?.educationalCess}
            addlEducationalCess={location.state?.addlEducationalCess}
            employeeGuaranteeScheme={location.state?.employeeGuaranteeScheme}
            localCessAmount={location.state?.localCess}
            otherLocalCessAmount={location.state?.otherLocalCess}
            TotalDemand={location.state?.netAmountReceived}
            khataownerName={location.state?.khataownerName}
            chequeName={location.state?.chequeName}
            ddName={location.state?.ddName}
            ddAmount={location.state?.ddAmount}
            chequeAmount={location.state?.chequeAmount}
            ddBranch={location.state?.ddBranch}
            chequeBranch={location.state?.chequeBranch}
            ddDateForReceipt={location.state?.ddDateForReceipt}
            chequeDateForReceipt={location.state?.chequeDateForReceipt}
            chequeNumber={location.state?.chequeNumber}
            ddNumber={location.state?.ddNumber}
            receiptNo={location.state?.receiptNo}
            receiptDate={location.state?.receiptDate}
            receiptDateForReceipt={location.state?.receiptDateForReceipt}
            modeOfPayment={location.state?.modeOfPayment}
            marathiName={marathiName}
            sajjaName={villageSaja}
            amountInWords={location.state?.amountInWords}
            surveyHissaNo={location.state?.surveyHissaNo}
            noticeAmount={location.state?.noticeAmount}
            revenueYear={location.state?.revenueYear}
            preYearNetAmount={location.state?.preYearNetAmount}
            NameofTenent={location.state?.NameofTenent}
          />
        </Card>
      </PageContainer>
    </div>
  );
}

class ComponentToPrint extends React.Component {
  render() {
    // console.log('-11---logs-class compo--' + this.props.khataNo);
    return (
      <Card>
        {/* <div style={{ marginLeft: 500 }}>
          <tr>
            <strong>
              <h5>क्रमांक: {this.props.receiptNo}</h5>
            </strong>
          </tr>
        </div> */}
        <div>
          <table cellPadding={2} cellSpacing={2} style={{ overflowWrap: 'anywhere' }}>
            <Row>
              <Col span={10}>
                <img
                  src={logo1}
                  style={{ width: '130px', height: '130px', textAlign: 'left' }}
                ></img>
              </Col>
              <p>
                <img src={emblem} style={{ width: '80px', textAlign: 'center' }}></img>
              </p>
            </Row>
            <Row>
              <Col span={8}></Col>
              <Col span={8}>
                <tr>
                  <td>
                    <h1 align="center">
                      <b> जमीन महसूलाची पावती</b>
                    </h1>
                  </td>
                </tr>
              </Col>
              <Col span={8}>
                <strong>
                  <h5>क्रमांक: {this.props.receiptNo}</h5>
                </strong>
              </Col>
            </Row>
            <div style={{ float: 'right' }}></div>

            <tr>
              <td>
                <h4 align="center">
                  <b>(महाराष्ट्र जमीन महसूल नियमपुस्‍तिका-खंड चार- गा.न. क्र. ९ आणि ९-अ पहा)</b>
                </h4>
              </td>
            </tr>
            <div style={{ float: 'right' }}></div>

            <tr style={{ align: 'center' }}>
              <p style={{ marginTop: '20px' }}>
                {this.props.khataownerName} ,
                {this.props.NameofTenent && 'जमीन महसूल भरणार तर्फे कुळ'}{' '}
                {this.props.NameofTenent && this.props.NameofTenent}
                <br /> राहणार {this.props.village} तालुका {this.props.taluka}, जिल्हा{' '}
                {this.props.district} यांचे मार्फत सन {this.props.revenueYear} या महसूल वर्षासाठी,
                खालीलप्रमाणे जमीन महसूलाची देय रक्‍कम प्राप्‍त झाली.
              </p>
            </tr>
            <Row>
              <Col span={12}>
                <tr>
                  <td>गाव:</td>
                  <td>{this.props.village}</td>
                </tr>
              </Col>
              {this.props.khataNo ? (
                <Col span={12}>
                  <tr>
                    <td>खाते क्रमांक:</td>
                    <td>{this.props.khataNo}</td>
                  </tr>
                </Col>
              ) : (
                <Col span={12}>
                  <tr>
                    <td>मक्ता क्रमांक:</td>
                    <td>{this.props.makhtaKhataNo}</td>
                  </tr>
                </Col>
              )}
            </Row>

            <Row>
              <Col span={12}>
                <tr>
                  <td>भूमापन व उप-विभाग क्रमांक : {this.props.surveyHissaNo}</td>
                </tr>
              </Col>
              <Col span={12}></Col>
            </Row>

            <tr>
              <td>
                <h3>
                  <b>
                    <u>प्राप्‍त रक्कम:</u>
                  </b>
                </h3>
              </td>
            </tr>
            <Row>
              <Col span={12}>
                <tr>
                  <td>१) मागील थकबाकी: </td>
                  {<td> ₹ {this.props.preYearTotal}</td>}
                </tr>
              </Col>
              <Col span={12}>
                <tr>
                  <td>२) नियत जमीन महसूल:</td>
                  <td> ₹ {this.props.LR}</td>
                </tr>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <tr>
                  <td>३) वाढीव जमीन महसूल: </td>

                  <td colSpan={5}> ₹ {this.props.addLandRevenue}</td>
                </tr>
              </Col>
              <Col span={12}>
                <tr>
                  <td>४) अकृषीक कर: </td>
                  <td colSpan={5}> ₹ {this.props.AkrushikLR}</td>
                </tr>
              </Col>
            </Row>

            <Row>
              <Col span={12}>
                <tr>
                  <td>५) जि.प. उपकर: </td>

                  <td> ₹ {this.props.ZP} </td>
                </tr>
              </Col>
              <Col span={12}>
                <tr>
                  <td>६) ग्रा.प. उपकर: </td>

                  <td colSpan={5}> ₹ {this.props.VP}</td>
                </tr>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <tr>
                  <td>७) शिक्षण उपकर: </td>

                  <td colSpan={5}> ₹ {this.props.educationalCess} </td>
                </tr>
              </Col>
              <Col span={12}>
                <tr>
                  <td>८) वाढीव शिक्षण उपकर:</td>
                  <td colSpan={5}> ₹ {this.props.addlEducationalCess}</td>
                </tr>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <tr>
                  <td>९) रो.ह. उपकर: </td>

                  <td colSpan={5}> ₹ {this.props.employeeGuaranteeScheme} </td>
                </tr>
              </Col>
            </Row>
            <Row>
              <tr>
                <td>१०) संकीर्ण जमीन महसूल (स्था.क. सह): ₹</td>
                <td colSpan={5}>{<>{this.props.localCessAmount}</>}</td>
              </tr>
            </Row>

            <Row>
              <Col span={12}>
                <tr>
                  <td>१०-अ) संकीर्ण जमीन महसूल (स्था.क. शिवाय): ₹</td>
                  <td colSpan={5}>{<>{this.props.otherLocalCessAmount}</>}</td>
                </tr>
              </Col>

              <Col span={12}>
                <tr>
                  <td>११) नोटिसीचा खर्च: ₹</td>
                  <td colSpan={5}>{<> {this.props.noticeAmount} </>}</td>
                </tr>
              </Col>
            </Row>
            <tr>
              <td>एकूण प्राप्‍त रक्‍कम: ₹ {this.props.TotalDemand}</td>
            </tr>
            <Row>
              <Col span={15}>
                <tr>
                  <td>(अक्षरी) ₹ {this.props.amountInWords}</td>
                </tr>
              </Col>
            </Row>

            <Row style={{ marginTop: '15px' }}>
              <Col span={8}>
                <tr>
                  <td>ठिकाण: {this.props.village} </td>
                </tr>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <tr>
                  {/* <td>दिनांक: {this.props.receiptDate}</td> */}
                  <td>दिनांक: {this.props.receiptDateForReceipt}</td>
                  <td></td>
                </tr>
              </Col>
              <Col span={6}>
                <tr>
                  <td>कार्यालयाचा शिक्‍का: </td>
                </tr>
              </Col>
              <Col span={8}>
                <tr>
                  <td>सही/-</td>
                </tr>
              </Col>
            </Row>
            <Row>
              <Col span={8}></Col>
              <Col span={6}></Col>
              <Col span={10}>
                <tr>
                  <td>नाव : </td>

                  <td>{this.props.marathiName}</td>
                </tr>
              </Col>
            </Row>
            <Row>
              <Col span={8}></Col>
              <Col span={6}></Col>
              <Col span={10}>
                <tr>
                  {/* <td>तलाठी : </td> */}
                  <td>ग्राम महसूल अधिकारी : </td>

                  <td></td>
                </tr>
              </Col>
            </Row>
            <Row>
              <Col span={8}></Col>
              <Col span={6}></Col>
              <Col span={10}>
                <tr>
                  <td>साझा : </td>
                  <td>{this.props.sajjaName}</td>
                </tr>
              </Col>
            </Row>
            <Row>
              <Col span={8}></Col>
              <Col span={6}></Col>
              <Col span={10}>
                <tr>
                  <td>तालुका :{this.props.taluka}</td>

                  <td>जिल्हा :{this.props.district}</td>
                </tr>
              </Col>
            </Row>
          </table>
          <table cellPadding={10} cellSpacing={10}>
            {this.props.modeOfPayment != null && this.props.modeOfPayment === 'Cash' && (
              <tr>
                <th>देय पद्धत:</th>
                <td>{this.props.modeOfPayment ? 'रोख' : ''}</td>
              </tr>
            )}
            {this.props.modeOfPayment != null &&
              (this.props.modeOfPayment === 'Cheque' || this.props.modeOfPayment === 'DD') && (
                <>
                  <tr>
                    <b>
                      <th>देय पद्धत:</th>
                      <td>{this.props.modeOfPayment === 'Cheque' ? 'धनादेश' : 'डिमांड ड्राफ्ट'}</td>
                    </b>
                  </tr>
                  <tr>
                    <td>
                      <b>
                        <u>बँक तपशील</u>
                      </b>
                    </td>
                  </tr>
                  <Row>
                    <Col span={12}>
                      <tr>
                        <b>
                          <th>
                            बँकेचे नाव:{' '}
                            {this.props.modeOfPayment === 'Cheque' && this.props.chequeName}
                            {this.props.modeOfPayment === 'DD' && this.props.ddName}
                          </th>
                        </b>
                      </tr>
                    </Col>
                    <Col span={8}>
                      <tr>
                        <b>
                          <span style={{ marginLeft: '118px' }}>
                            <th>
                              शाखा: {this.props.modeOfPayment === 'DD' && this.props.ddBranch}
                              {this.props.modeOfPayment === 'Cheque' && this.props.chequeBranch}
                            </th>
                          </span>
                        </b>
                      </tr>
                    </Col>
                  </Row>
                  <tr>
                    {this.props.modeOfPayment === 'Cheque' && (
                      <b>
                        <th>
                          धनादेश क्रमांक:{' '}
                          {this.props.modeOfPayment === 'Cheque' && this.props.chequeNumber}
                        </th>
                      </b>
                    )}
                    {this.props.modeOfPayment === 'DD' && (
                      <b>
                        <th>
                          डीडी क्रमांक: {this.props.modeOfPayment === 'DD' && this.props.ddNumber}
                        </th>
                      </b>
                    )}

                    <b>
                      <span style={{ marginLeft: '210px' }}>
                        <th>
                          रक्कम: ₹{' '}
                          {this.props.modeOfPayment === 'Cheque' && this.props.chequeAmount}
                          {this.props.modeOfPayment === 'DD' && this.props.ddAmount}
                        </th>
                      </span>
                    </b>
                  </tr>
                  <tr>
                    <b>
                      <th>
                        दिनांक:{' '}
                        {this.props.modeOfPayment === 'Cheque' && this.props.chequeDateForReceipt}
                        {this.props.modeOfPayment === 'DD' && this.props.ddDateForReceipt}
                      </th>
                    </b>
                  </tr>
                </>
              )}
          </table>
        </div>
      </Card>
    );
  }
}
// }

export default ReceiptViewPrint;
