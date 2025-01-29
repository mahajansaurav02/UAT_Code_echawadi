import { Card } from 'antd';
import React from 'react';
import styles from './report.module.css';
import { FormattedMessage } from 'umi';

function ashishSir() {
  return (
    <div>
      <div className="report">
        <Card>
          <table id="table-to-xls" className={styles.report_table}>
            <thead>
              <tr>
                <th colSpan="12">
                  <h3 style={{ color: 'red' }}>
                    <b>Receipt/पावती</b>
                  </h3>
                </th>
              </tr>
              <tr>
                <th colSpan={2}>Receipt No/पावती क्र</th>
                <th colSpan={2}>Date/दिनांक</th>
                <th colSpan={2}>Related/च्या करता</th>
                <th colSpan={3}>CFC Ref./ सी एफ सी संदर्भ</th>
                <th colSpan={3}>Counter Ref./खिडकी संदर्भ</th>
              </tr>
              <tr style={{ textAlign: 'left' }}>
                <th colSpan={3}>Received From/कोणाकडून</th>
                <th colSpan={9}></th>
              </tr>
              <tr style={{ textAlign: 'left' }}>
                <th colSpan={3}>Subject/विषय</th>
                <th colSpan={9}></th>
              </tr>
              <tr style={{ textAlign: 'left' }}>
                <th colSpan={3}>Narration/विवरण</th>
                <th colSpan={9}></th>
              </tr>

              <tr style={{ height: '20px' }}>
                <th colSpan={12}>Payment mode/देयकाचा प्रकार </th>
                {/* <th colSpan={7}></th> */}
              </tr>
              <tr>
                <th colSpan={2}>mode</th>
                <th colSpan={2}>rupees</th>
                <th colSpan={2}>cheque no</th>
                <th colSpan={2}>cheque date</th>
                <th colSpan={2}>bank name</th>

                <th colSpan={2}>
                  <FormattedMessage id="villageReport1.table.naAssessment" />
                </th>
              </tr>

              <tr style={{ height: '20px' }}>
                <th colSpan={2}></th>
                <th colSpan={2}></th>

                <th colSpan={2}></th>

                <th colSpan={2}></th>

                <th colSpan={2}></th>
                <th colSpan={2}></th>
              </tr>
              <tr>
                <th colSpan={2}>Reference No </th>
                <th colSpan={2}>Date</th>
                <th colSpan={2}>details</th>
                <th colSpan={2}>Payable amount</th>
                <th colSpan={2}>amount recd</th>

                <th colSpan={2}>bank name</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={2}>{}</td>
                <td colSpan={2}>{}</td>

                <td colSpan={2}>{}</td>

                <td colSpan={2}>{}</td>

                <td colSpan={2}>{}</td>

                <td colSpan={2}>{}</td>
              </tr>
              {/* {this.props.dataToMap &&
                this.props.dataToMap.map((r) => (
                  <tr>
                    <td>{r.surveyHissaNo}</td>
                    <td>{r.tenureName}</td>
                    <td>
                      {r.totalAreaH
                        .substring(0, r.totalAreaH.length - 2)
                        .concat('.')
                        .concat(r.totalAreaH.substring(r.totalAreaH.length - 2))}
                    </td>
                    <td>{r.potkharabaType}</td>
                    <td>{r.cultivableAreaInt}</td>
                    <td>
                      {r.netCultiAreaH
                        .substring(0, r.netCultiAreaH.length - 2)
                        .concat('.')
                        .concat(r.netCultiAreaH.substring(r.netCultiAreaH.length - 2))}
                    </td>
                    <td>{r.assessment}</td>
                    <td>{r.publicRightsOfWayAndEasements}</td>
                    <td>{r.particularsOfAlteration}</td>
                    <td>{r.orderSanctioningChanges}</td>
                    <td>{r.orderDate}</td>
                    <td>{r.remarks}</td>
                  </tr>
                ))} */}
              <tr colSpan="11">
                <td colSpan={2}>
                  <b>Amount In Words/अक्षरी रुपये</b>
                </td>
                <td colSpan={4}>
                  <b></b>
                </td>
                <td colSpan={2}>
                  <b>Total received amount/एकूण मिळालेली रक्कम</b>
                </td>
                <td colSpan={4}></td>
              </tr>
              <tr colSpan="11" style={{ height: '30px' }}>
                <td colSpan={11}>
                  <b style={{ marginRight: '1100px', marginTop: '30px' }}>ABM Help Line 111000</b>
                  <br />
                  <b>ABM Help Line 111000</b>
                  <b style={{ marginLeft: '820px' }}>
                    Receiver's Signature/स्वीकारनार्याची स्वाक्षरी{' '}
                  </b>
                </td>
              </tr>
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}

export default ashishSir;
