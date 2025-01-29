import { Card } from 'antd';
import React from 'react';
import { FormattedMessage } from 'umi';

function Report11B() {
  return (
    <div>
      <Card>
        <center>
          <h2>
            <FormattedMessage id="form11b.labels.Mainlabel" />
          </h2>

          <h3>
            <FormattedMessage id="form1c.labels.report" /> -{' '}
            <u>
              <a
                href="https://www.google.com/search?q=https://bhumiabhilekh.maharashtra.gov.in/1091/%E0%A4%88-%E0%A4%AB%E0%A5%87%E0%A4%B0%E0%A4%AB%E0%A4%BE%E0%A4%B0"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FormattedMessage id="form11b.labels.Mainlabel" />
              </a>
            </u>
          </h3>
        </center>
      </Card>
    </div>
  );
}

export default Report11B;
