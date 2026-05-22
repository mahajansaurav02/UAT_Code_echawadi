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
import { FormattedMessage, useModel } from 'umi';
import styles from './GenerateChallan.module.css';
function ReceiptViewPrint(props) {
  const [textInput, setTextInput] = useState('');
  const [textVillage, setTextVillage] = useState('');
  const [form] = Form.useForm();
  const componentRef = useRef();
  const [village, setVillage] = useState([]);
  const [head0045Visiblity, setHead0045Visiblity] = useState(false);
  const location = useLocation();
  const { districtName, talukaName, districtCode, talukaCode, challanHeads } = useModel('details');

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  // useEffect(() => {
  //   console.log('0045', location?.state.totalOf0045);
  //   console.log('0029', location?.state?.totalOf0029);
  // }, []);

  // console.log(location.state?.lrAmount + '-11---logs-class function--' + location.state?.receipts);
  // console.log('Educational cess alai ka', location.state?.educationalCess);

  return (
    <div>
      <PageContainer>
        <Card>
          <Button type="primary" style={{ marginRight: '100px' }} onClick={handlePrint}>
            प्रत काढा
          </Button>
          {/* Const {khataNo,LR,ZP} = {location.state}; */}
          <ComponentToPrint
            ref={componentRef}
            challanNo={location.state?.challanNo}
            challanNo0045={location.state?.challanNo0045}
            createDtTm={location.state?.createDtTm}
            district={location.state?.district}
            taluka={location.state?.taluka}
            village={location.state?.village}
            khataNo={location.state?.khataNo}
            LR={location.state?.lrAmount}
            ZP={location.state?.zpAmount}
            VP={location.state?.gvAmount}
            JM={location.state?.jmBindumala + location.state?.jmDumala}
            jmAkrushik={location.state?.jmAkrushik}
            jmBindumala={location.state?.jmBindumala}
            jmDumala={location.state?.jmDumala}
            jmSankirn={location.state?.jmSankirn}
            zpSankirn={location.state?.zpSankirn}
            zpAkrushik={location.state?.zpAkrushik}
            zpBindumala={location.state?.zpBindumala}
            zpDumala={location.state?.zpDumala}
            gpSankirn={location.state?.gpSankirn}
            gpAkrushik={location.state?.gpAkrushik}
            gpBindumala={location.state?.gpBindumala}
            gpDumala={location.state?.gpDumala}
            addlLandRevenue={location.state?.addlLandRevenue}
            educationalCess={location.state?.educationalCess}
            addlEducationalCess={location.state?.addlEducationalCess}
            preYearPendingAddlEducationalCess={location.state?.preYearPendingAddlEducationalCess}
            preYearPendingAddlLandRevenue={location.state?.preYearPendingAddlLandRevenue}
            preYearPendingEducationalCess={location.state?.preYearPendingEducationalCess}
            preYearPendingEmployeeGuaranteeScheme={
              location.state?.preYearPendingEmployeeGuaranteeScheme
            }
            preYearPendingGp={location.state?.preYearPendingGp}
            preYearPendingJm={location.state?.preYearPendingJm}
            preYearPendingNaCess={location.state?.preYearPendingNaCess}
            preYearPendingZp={location.state?.preYearPendingZp}
            preYearSankirnJmWith={location.state?.preYearPendingZp}
            preYearSankirnJmWithout={location.state?.preYearSankirnJmWithout}
            employeeGuaranteeScheme={location.state?.employeeGuaranteeScheme}
            TotalDemand={location.state?.netAmount}
            khataownerName={location.state?.khataownerName}
            chequeName={location.state?.chequeName}
            ddName={location.state?.ddName}
            ddAmount={location.state?.ddAmount}
            chequeAmount={location.state?.chequeAmount}
            ddBranch={location.state?.ddBranch}
            chequeBranch={location.state?.chequeBranch}
            ddDate={location.state?.ddDate}
            chequeDate={location.state?.chequeDate}
            chequeNumber={location.state?.chequeNumber}
            ddNumber={location.state?.ddNumber}
            receiptNo={location.state?.receiptNo}
            receiptDate={location.state?.receiptDate}
            modeofPayment={location.state?.modeofPayment}
            receipts={location.state?.receipts}
            totalAmount={location.state?.totalAmount}
            totalOf0029={location.state?.totalOf0029}
            totalOfHead0029={location.state?.totalOfHead0029}
            totalOf0045={location.state?.totalOf0045}
            totalOfHead0045={location.state?.totalOfHead0045}
            AmountInWords={location.state?.AmountInWords}
            AmountInWords0029={location.state?.AmountInWords0029}
            AmountInWords0045={location.state?.AmountInWords0045}
            totalJM={location.state?.totalJM}
            totalZP={location.state?.totalZP}
            totalVP={location.state?.totalVP}
            totalEGS={location.state?.totalEGS}
            totalJMAkrushik={location.state?.totalJMAkrushik}
            totalJMSankirn={location.state?.totalJMSankirn}
            totalEducational={location.state?.totalEducational}
            totalAddlEducational={location.state?.totalAddlEducational}
            totalAddlLandRev={location.state?.totalAddlLandRev}
            head0045Visiblity={head0045Visiblity}
            challanHeads={challanHeads}
          />
        </Card>
      </PageContainer>
    </div>
  );
}

class ComponentToPrint extends React.Component {
  render() {
    // console.log('-11---logs-class compo--' + this.props.receipts);
    return (
      <div>
        <Card>
          <div style={{ marginTop: ' 40px' }}>
            <label>
              <b>जिल्हा : </b>
              <td>{this.props.district}</td>
            </label>
            <label style={{ marginLeft: '150px' }}>
              <b>तालुका : </b>
              <td>{this.props.taluka}</td>
            </label>
            <label style={{ marginLeft: '150px' }}>
              <b>गाव : </b>
              <td>{this.props.village}</td>
            </label>
          </div>

          {/* {parseInt(location?.state?.totalOf0029) > 0 && ( */}
          {this.props.totalOfHead0029 > 0 && (
            <>
              <div className="row" style={{ marginTop: ' 20px' }}>
                <label>
                  <b>इ-चावडी भरणा क्रमांक : </b>
                  <td>{this.props.challanNo}</td>
                </label>
              </div>
              <div style={{ marginTop: '20px' }}>
                <label>
                  <b>चलनाची तारीख : </b>
                  <td>{this.props.createDtTm}</td>
                </label>
              </div>
              <div className="row" style={{ marginTop: ' 20px', marginBottom: '20px;' }}>
                <label>
                  <b>देय पद्धत : </b>
                  <td>{this.props.modeofPayment}</td>
                </label>
              </div>
              <div style={{ marginTop: ' 20px', marginBottom: '20px;' }}></div>
              <label>
                <b>पावतीचा तपशील : 0029</b>
              </label>
              <div>
                <table className={styles.table} cellPadding={10} style={{ marginTop: ' 20px' }}>
                  <tr>
                    <th>
                      <b>अ.क्र.</b>
                    </th>
                    <th>
                      <b>पावती क्रमांक</b>
                    </th>
                    <th>
                      <b>खाता क्रमांक</b>
                    </th>
                    <th>
                      <b>खातेदाराचे नाव</b>
                    </th>
                    <th>
                      <b>ज.म. उपकर(अकृषक)</b>
                    </th>
                    <th>
                      <b>ज.म. उपकर(संकीर्ण)</b>
                    </th>
                    <th>
                      <b>ज.म. उपकर</b>
                    </th>
                    <th>
                      <b>जि.प. उपकर</b>
                    </th>
                    <th>
                      <b>ग्रा.पं. उपकर</b>
                    </th>
                    <th>
                      <b>वाढीव जमीन महसूल</b>
                    </th>
                    <th>
                      <b>रक्कम (₹)</b>
                    </th>
                  </tr>

                  {this.props.receipts &&
                    this.props.receipts.map(
                      (receipt, index) =>
                        // console.log('totalOf0029', receipt.totalOf0029),
                        receipt.totalOf0029 > 0 && (
                          <tr style={{ textAlign: 'center' }}>
                            <td>{index + 1}</td>
                            <td>{receipt.receiptNo}</td>
                            <td>
                              {receipt.khataNo == null ? receipt.makhtaKhataNo : receipt.khataNo}
                            </td>
                            <td>{receipt.khataOwnerName}</td>
                            <td>{receipt.jmAkrushik + receipt.preYearPendingNaCess}</td>
                            <td>
                              {receipt.jmSankirn +
                                receipt.preYearSankirnJmWith +
                                receipt.preYearSankirnJmWithout +
                                receipt.preYearNoticeFee}
                            </td>

                            <td>
                              {/* {receipt.jmBindumala >= 5 && receipt.jmBindumala <= 10
                                ? receipt.jmDumala + receipt.preYearPendingJm + receipt.jmSankirn
                                : receipt.jmBindumala + receipt.jmDumala + receipt.preYearPendingJm} */}

                              {(receipt.jmBindumala >= 5 && receipt.jmBindumala <= 10) ||
                              receipt.area <= 3
                                ? receipt.jmDumala + receipt.preYearPendingJm + receipt.jmSankirn
                                : receipt.jmBindumala < 5
                                ? 0
                                : receipt.jmBindumala > 10 && receipt.area <= 3
                                ? receipt.jmDumala + receipt.preYearPendingJm + receipt.jmSankirn
                                : receipt.jmBindumala +
                                  receipt.jmDumala +
                                  receipt.preYearPendingJm +
                                  receipt.jmSankirn}
                            </td>
                            <td>
                              {/* {receipt.zpAkrushik +
                                receipt.zpBindumala +
                                receipt.zpDumala +
                                receipt.preYearPendingZp +
                                receipt.zpSankirn} */}
                              {receipt.jmBindumala < 5
                                ? receipt.zpAkrushik + receipt.preYearPendingZp + receipt.zpSankirn
                                : receipt.zpAkrushik +
                                  receipt.preYearPendingZp +
                                  receipt.zpSankirn +
                                  receipt.zpBindumala}
                            </td>

                            <td>
                              {/* {receipt.gpAkrushik +
                                receipt.gpBindumala +
                                receipt.gpDumala +
                                receipt.gpSankirn +
                                receipt.preYearPendingGp} */}
                              {receipt.jmBindumala < 5
                                ? receipt.gpAkrushik + receipt.gpSankirn + receipt.preYearPendingGp
                                : receipt.gpAkrushik +
                                  receipt.gpSankirn +
                                  receipt.preYearPendingGp +
                                  receipt.gpBindumala}
                            </td>
                            <td>
                              {receipt.addlLandRevenue + receipt.preYearPendingAddlLandRevenue}
                            </td>

                            <td>{receipt.totalOf0029}</td>
                            {/* <td>{this.props.totalOfHead0029}</td> */}
                          </tr>
                        ),
                    )}
                </table>
              </div>
            </>
          )}

          {this.props.totalOfHead0029 > 0 && (
            <>
              <div style={{ marginTop: ' 30px' }}>
                <label style={{ paddingRight: '25px' }}>
                  <b>ज.म. उपकर(अकृषक) ({this.props.challanHeads[1].subHeadNo}) : </b>
                  <td>₹ {this.props.totalJMAkrushik}</td>
                </label>
                <label style={{ paddingRight: '25px' }}>
                  <b>ज.म. उपकर(संकीर्ण) ({this.props.challanHeads[4].subHeadNo}) : </b>
                  <td>₹ {this.props.totalJMSankirn}</td>
                </label>
                <label style={{ paddingRight: '25px' }}>
                  <b>ज.म. उपकर ({this.props.challanHeads[0].subHeadNo}) : </b>
                  <td>₹ {this.props.totalJM}</td>
                </label>
                <label style={{ paddingRight: '25px' }}>
                  <b>जि.प. उपकर ({this.props.challanHeads[3].subHeadNo}) : </b>
                  <td>₹ {this.props.totalZP}</td>
                </label>
              </div>
              <div style={{ marginTop: ' 20px' }}>
                <label style={{ paddingRight: '25px' }}>
                  <b>ग्रा.पं. उपकर ({this.props.challanHeads[2].subHeadNo}) : </b>
                  <td>₹ {this.props.totalVP}</td>
                </label>
                <label style={{ paddingRight: '25px' }}>
                  <b>वाढीव जमीन महसूल ({this.props.challanHeads[5].subHeadNo}) : </b>
                  <td>₹ {this.props.totalAddlLandRev}</td>
                </label>
                <label style={{ paddingRight: '25px' }}>
                  <b>एकूण रक्कम : </b>
                  <td>₹ {this.props.totalOfHead0029}</td>
                </label>
                <label style={{ paddingRight: '25px' }}>
                  <b>शब्दांमध्ये एकूण रक्कम (₹): </b>
                  <td>{this.props.AmountInWords0029}</td>
                </label>
              </div>
            </>
          )}

          {this.props.totalOfHead0045 > 0 && (
            <>
              <div className="row" style={{ marginTop: '50px' }}>
                <label>
                  <b>इ-चावडी भरणा क्रमांक : </b>
                  <td>{this.props.challanNo0045}</td>
                </label>
              </div>
              <div style={{ marginTop: '20px' }}>
                <label>
                  <b>चलनाची तारीख : </b>
                  <td>{this.props.createDtTm}</td>
                </label>
              </div>
              <div className="row" style={{ marginTop: ' 20px', marginBottom: '20px;' }}>
                <label>
                  <b>देय पद्धत : </b>
                  <td>{this.props.modeofPayment}</td>
                </label>
              </div>
              <div style={{ marginTop: '10px', marginBottom: '20px;' }}>
                <label>
                  <b>पावतीचा तपशील : 0045 </b>
                </label>
                <div>
                  <table className={styles.table} cellPadding={10} style={{ marginTop: ' 20px' }}>
                    <tr>
                      <th>
                        <b>अ.क्र.</b>
                      </th>
                      <th>
                        <b>पावती क्रमांक</b>
                      </th>
                      <th>
                        <b>खाता क्रमांक</b>
                      </th>
                      <th>
                        <b>खातेदाराचे नाव</b>
                      </th>
                      <th>
                        <b>रो.ह.उपकर</b>
                      </th>
                      <th>
                        <b>शिक्षण उपकर</b>
                      </th>
                      <th>
                        <b>वाढीव शिक्षण उपकर</b>
                      </th>
                      <th>
                        <b>रक्कम (₹)</b>
                      </th>
                    </tr>
                    {this.props.receipts &&
                      this.props.receipts.map(
                        (receipt, index) =>
                          receipt.totalOf0045 > 0 && (
                            <tr style={{ textAlign: 'center' }}>
                              <td>{index + 1}</td>
                              <td>{receipt.receiptNo}</td>
                              <td>{receipt.khataNo}</td>
                              <td>{receipt.khataOwnerName}</td>
                              <td>
                                {receipt.employeeGuaranteeScheme +
                                  receipt.preYearPendingEmployeeGuaranteeScheme}
                              </td>
                              <td>
                                {receipt.educationalCess + receipt.preYearPendingEducationalCess}
                              </td>
                              <td>
                                {receipt.addlEducationalCess +
                                  receipt.preYearPendingAddlEducationalCess}
                              </td>
                              <td>{receipt.totalOf0045}</td>
                            </tr>
                          ),
                      )}
                  </table>
                </div>
              </div>

              {this.props.totalOfHead0045 > 0 && (
                <>
                  <div style={{ marginTop: ' 30px' }}>
                    <label style={{ paddingRight: '30px' }}>
                      <b>रो.ह.उपकर ({this.props.challanHeads[7].subHeadNo}) : </b>
                      <td>₹ {this.props.totalEGS}</td>
                    </label>
                    <label style={{ paddingRight: '30px' }}>
                      <b>शिक्षण उपकर ({this.props.challanHeads[6].subHeadNo}) : </b>
                      <td>₹ {this.props.totalEducational}</td>
                    </label>
                    <label style={{ paddingRight: '30px' }}>
                      <b>वाढीव शिक्षण उपकर : </b>
                      <td>₹ {this.props.totalAddlEducational}</td>
                    </label>
                    <label>
                      <b>एकूण रक्कम : </b>
                      <td>₹ {this.props.totalOfHead0045}</td>
                    </label>
                  </div>
                  <div style={{ marginTop: ' 20px' }}>
                    <label style={{ marginRight: '25px' }}>
                      <b>शब्दांमध्ये एकूण रक्कम (₹): </b>
                      <td>{this.props.AmountInWords0045}</td>
                    </label>
                  </div>
                </>
              )}
            </>
          )}
          {/* )} */}
        </Card>
      </div>
    );
  }
}
// }

export default ReceiptViewPrint;
