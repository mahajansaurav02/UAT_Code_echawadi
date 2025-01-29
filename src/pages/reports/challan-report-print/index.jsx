import React, { useState, useEffect, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Form, Button, Card, Col, DatePicker, Input, InputNumber, Row, Select } from 'antd';
import { useReactToPrint } from 'react-to-print';
import { useLocation } from 'react-router-dom';
import { useHistory } from 'react-router';
import styles from './challan.module.css';
import { ToWords } from 'to-words';

function ChallanReportPrint() {
  const componentRef = useRef();
  const location = useLocation(); //location.state?.receipts
  const [totalAmount, setTotalAmount] = useState(0);
  const history = useHistory();

  const receipts = location.state?.receipts;
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  useEffect(() => {
    if (!location.state) {
      history.push('/reports/view-challan');
    }
    if (receipts) {
      receipts.map((row) => {
        setTotalAmount((prevTotalAmount) => prevTotalAmount + row.totalAmount);
      });
    }
  }, [receipts]);

  const toWords = new ToWords({
    localeCode: 'mr-IN',
    converterOptions: {
      currency: true,
      ignoreDecimal: false,
      ignoreZeroCurrency: false,
      doNotAddOnly: true,
    },
  });
  return (
    <div>
      <PageContainer>
        <Card>
          <Button type="primary" style={{ marginRight: '100px' }} onClick={handlePrint}>
            Print
          </Button>
          <ComponentToPrint
            ref={componentRef}
            receipts={location.state?.receipts}
            totalAmount={totalAmount}
            district={location.state?.district}
            taluka={location.state?.taluka}
            village={location.state?.village}
            AmountInWords={toWords.convert(totalAmount)}
            status={location.state?.status}
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
          <h1 align="center">
            <b> Settlement Commissioner & Director of Land Records Maharashtra State</b>
          </h1>
          <div style={{ marginTop: ' 40px' }}>
            <label>
              <b>District :</b>
              <td>{this.props.district}</td>
            </label>
            <label style={{ marginLeft: '150px' }}>
              <b>Taluka :</b>
              <td>{this.props.taluka}</td>
            </label>
            <label style={{ marginLeft: '150px' }}>
              <b>Village :</b>
              <td>{this.props.village}</td>
            </label>
          </div>
          <div style={{ marginTop: ' 20px', marginBottom: '20px;' }}>
            <label>
              <h3>
                <u>
                  <b>Challan Details</b>
                </u>
              </h3>
            </label>
            <div style={{ marginTop: 15 }}>
              <label>
                <b>Staus: </b>
                {this.props.status}
              </label>
            </div>

            <div>
              <table className={styles.table} cellPadding={10} style={{ marginTop: ' 20px' }}>
                <tr>
                  <th>
                    <b>Sr.no</b>
                  </th>
                  <th>
                    <b>Challan Number</b>
                  </th>
                  <th>
                    <b>Challan Date</b>
                  </th>
                  <th>
                    <b>Mode Of Payment </b>
                  </th>
                  <th>
                    <b>Amount</b>
                  </th>
                </tr>
                {this.props.receipts &&
                  this.props.receipts.map((receipt, index) => (
                    <tr style={{ textAlign: 'center' }}>
                      <td>{index + 1}</td>
                      <td>{receipt.challanNo}</td>
                      <td>{receipt.challanDate}</td>
                      <td>{receipt.modeOfPayment}</td>

                      <td>{receipt.totalAmount}</td>
                    </tr>
                  ))}
              </table>
            </div>
          </div>

          <div style={{ marginTop: ' 30px' }}>
            <label>
              <b>Total Amount :</b>
              <td>{this.props.totalAmount}</td>
              <b> ₹</b>
            </label>
            <label style={{ marginLeft: '150px' }}>
              <b>Total Amount in Words :</b>
              <td>{this.props.AmountInWords}</td>
            </label>
          </div>
        </Card>
      </div>
    );
  }
}
export default ChallanReportPrint;
