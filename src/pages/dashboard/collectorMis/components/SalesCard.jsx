import { Card, Col, DatePicker, Row, Tabs } from 'antd';
import { Column } from '@ant-design/charts';
import numeral from 'numeral';
import styles from '../style.less';
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;
const rankingListData = [];

for (let i = 0; i < 7; i += 1) {
  rankingListData.push({
    title: `Industrial Road ${i} Pune`,
    total: 323234,
  });
}

const SalesCard = ({
  rangePickerValue,
  salesData,
  salesTypeData,
  isActive,
  handleRangePickerChange,
  loading,
  selectDate,
}) => (
  // <Card
  //   loading={loading}
  //   bordered={false}
  //   bodyStyle={{
  //     padding: 0,
  //   }}
  // >
  //   <div className={styles.salesCard}>
  //     <Tabs
  //       tabBarExtraContent={
  //         <div className={styles.salesExtraWrap}>

  //           <RangePicker
  //             value={rangePickerValue}
  //             onChange={handleRangePickerChange}
  //             style={{
  //               width: 256,
  //             }}
  //           />
  //         </div>
  //       }
  //       size="large"
  //       tabBarStyle={{
  //         marginBottom: 24,
  //       }}
  //     >
  //       <TabPane tab="Village Form Daily Entries" key="sales">
  //         <Row>
  //           <Col xl={24} lg={24} md={24} sm={24} xs={24}>
  //             <div className={styles.salesBar}>
  //               <Column
  //                 height={300}
  //                 forceFit
  //                 data={salesTypeData}
  //                 xField="x"
  //                 yField="y"
  //                 xAxis={{
  //                   visible: true,
  //                   title: {
  //                     visible: false,
  //                   },
  //                 }}
  //                 yAxis={{
  //                   visible: true,
  //                   title: {
  //                     visible: false,
  //                   },
  //                 }}
  //                 title={{
  //                   visible: true,
  //                   text: 'Total Entries',
  //                   style: {
  //                     fontSize: 18,
  //                   },
  //                 }}
  //                 meta={{
  //                   y: {
  //                     alias: '₹',
  //                   },
  //                 }}
  //               />
  //             </div>
  //           </Col>

  //         </Row>
  //       </TabPane>

  //     </Tabs>
  //   </div>
  // </Card>
  <></>
);

export default SalesCard;
