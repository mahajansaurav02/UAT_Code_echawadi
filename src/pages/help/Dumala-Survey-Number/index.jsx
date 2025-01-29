import useAxios from '@/components/eComponents/use-axios';
import VillageSelector from '@/components/eComponents/VillageSelector';
import URLS from '@/URLs/urls';
import { Button, Card, Col, Form, Input, message, Row, Table } from 'antd';
import React from 'react';
import { useState } from 'react';
import { FormattedMessage, useModel } from 'umi';

function DumalaSurveyNo() {
  const [codeVillage, setCodeVillage] = useState('');
  const [textForVillage, setTextForVillage] = useState();
  const [village, setVillage] = useState([]);
  const [revenueYear, setRevenueYear] = useState();
  const [surveyDetails, setSurveyDetails] = useState();
  const { sendRequest } = useAxios();
  const { districtName, servarthId, districtCode, talukaCode } = useModel('details');

  const columns = [
    {
      key: '1',
      title: <FormattedMessage id="formLanguage.form.serialNo" />,
      dataIndex: 'srNo',
    },
    {
      key: '2',
      title: <FormattedMessage id="formLanguage.button.khataNo" />,
      dataIndex: 'khataNo',
    },
    {
      key: '3',
      title: <FormattedMessage id="formLanguage.button.khatedarName" />,
      dataIndex: 'khatedarNames',
    },
    {
      key: '4',
      title: <FormattedMessage id="formLanguage.table.surveyNo" />,
      dataIndex: 'pin',
    },
    {
      key: '5',
      title: <FormattedMessage id="formLanguage.form.Area" />,
      dataIndex: 'area',
    },
    {
      key: '6',
      title: <FormattedMessage id="formLanguage.form.assessment" />,
      dataIndex: 'dumalaAssessment',
    },
  ];

  const showSurveyForm = async () => {
    sendRequest(
      `${URLS.BaseURL}/reports/Form3ServeyNoDetails?districtCode=${districtCode}&talukaCode=${talukaCode}&cCode=${codeVillage}&revenueYear=${revenueYear}`,
      'GET',
      null,
      (res) => {
        console.log('test-->', res.data.form1Data);

        setSurveyDetails(
          res.data.form3SrNo.map((r, i) => ({
            id: r.id,
            srNo: i + 1,
            khataNo: r.khataNo,
            khatedarNames: r.khatedarNames,
            area: r.area,
            dumalaAssessment: r.dumalaAssessment,
            pin: r.pin,
            unit: r.unit,
          })),
        );
        if (res.status === 200) {
          message.success('Records Fetched!');
        }
      },
      (err) => {},
    );
  };

  return (
    <div>
      <Card>
        <Row>
          <Col xl={22} lg={22} md={22} sm={20} xs={20}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
              <FormattedMessage id="formLanguage.title.dumalaSurveyNo" />
            </h2>
          </Col>
        </Row>
        <Row>
          <Col xl={22} lg={22} md={22} sm={24} xs={24}>
            <VillageSelector
              pageType="withoutYear"
              setCodeVillage={setCodeVillage}
              setTextForVillage={setTextForVillage}
              onVillageChange={setVillage}
              yearChange={setRevenueYear}
            />
          </Col>
          <Col xl={2} lg={2} md={2} sm={24} xs={24}>
            <Button
              onClick={() => {
                if (textForVillage) {
                  showSurveyForm();
                } else if (textForVillage == null) {
                  message.info('Please Select Village !');
                }
              }}
              type="primary"
            >
              <FormattedMessage id="formLanguage.button.search" />
            </Button>
          </Col>
        </Row>
      </Card>
      <Card>
        <Table columns={columns} dataSource={surveyDetails}></Table>
      </Card>
    </div>
  );
}

export default DumalaSurveyNo;
