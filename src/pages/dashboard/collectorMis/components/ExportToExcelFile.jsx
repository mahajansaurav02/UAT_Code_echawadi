import { DownloadOutlined } from '@ant-design/icons';
import { Button } from '@mui/material';
import { useEffect, useState, memo } from 'react';
import ReactHtmlTableToExcel from 'react-html-table-to-excel';
import './dashboard.module.css';

const ExportToExcelFile = (props) => {
  return (
    <>
      <ReactHtmlTableToExcel
        id="test-table-xls-button"
        className="download-table-xls-button"
        table={props?.btnName}
        filename="Reportxls"
        sheet="tablexls"
        // buttonText={<DownloadOutlined />}

        buttonText={props?.btnName === 'GridDivision' ? 'Download as XLS' : <DownloadOutlined />}
      />

      {/* {console.info('props?.dataDistrict.....', props?.dataDistrict)}
      {console.info('props?.btnName.....', props?.btnName)} */}
      <div style={{ display: 'none' }}>
        {/* <div> */}
        <table id={props?.btnName}>
          {/* <tr>
            <th>विभाग/जिल्हा</th>
            <th>जिल्हे</th>
            <th>तालुके</th>
            <th>एकूण गावांची संख्या</th>
            <th>गांव नमुन्या मध्ये केलेल्या एकूण नोंदीची संख्या</th>
            <th>गावनमुने पूर्ण भरलेबाबत घोषणा केलेली गाव संख्या</th>
            <th>
              <tr>
                <th colSpan="3">अशी गावे ज्यांनी मागणी निश्चिती प्रक्रिया पुर्ण केलेली नाही.</th>
              </tr>
              <tr>
                <th>
                  ई-चावडी प्रणाली- मध्ये एक ही खातेदारांची मागणी निश्चिती न केल्याने वसुली न
                  करणाऱ्या गावांची संख्या
                </th>
                <th>१००% मागणी निश्चिती न करता वसूली सुरू केलेल्या गावांची संख्या</th>
                <th>एकुण</th>
              </tr>
            </th>

            <th>१००% मागणी निश्चिती केलेली गांव संख्या</th>
            <th>१००% वसूली झालेल्या गावांची संख्या</th>
            
          </tr> */}
          <tr>
            <th>विभाग/जिल्हा</th>
            <th>जिल्हे</th>
            <th>तालुके</th>
            <th>एकूण गावांची संख्या</th>
            <th>गांव नमुन्या मध्ये केलेल्या एकूण नोंदीची संख्या</th>
            <th>गावनमुने पूर्ण भरलेबाबत घोषणा केलेली गाव संख्या</th>
            <th colSpan="3">अशी गावे ज्यांनी मागणी निश्चिती प्रक्रिया पुर्ण केलेली नाही.</th>
            <th>१००% मागणी निश्चिती केलेली गांव संख्या</th>
            <th>१००% वसूली झालेल्या गावांची संख्या</th>
          </tr>
          <tr>
            <th colSpan="6"></th>
            <th>
              ई-चावडी प्रणाली- मध्ये एक ही खातेदारांची मागणी निश्चिती न केल्याने वसुली न करणाऱ्या
              गावांची संख्या
            </th>
            <th>१००% मागणी निश्चिती न करता वसूली सुरू केलेल्या गावांची संख्या</th>
            <th>एकुण</th>
            {/* <th colSpan="2"></th> */}
          </tr>
          {/* {props?.btnName == 'GridDivision' && */}
          {props?.data?.map((val, i) => {
            return (
              <tr>
                <td>{val?.divisionName}</td>
                <td>{val?.districtsCount}</td>
                <td>{val?.totalTaluka}</td>
                <td>{val?.totalVillages}</td>
                <td>{val?.totalEntry}</td>
                <td>{val?.totalGaonNamunaCount}</td>
                <td>{val?.demandCount}</td>
                {/* <td>{val?.totalDemandCompletedCount}</td> */}
                <td>{val?.vasuliWithoutDemandCount}</td>
                <td>{val?.totalOfSevenEight}</td>
                <td>{val?.totalDemandCompletedCount}</td>
                <td>{val?.vasuliCompletedCount}</td>
                {/* <td>{val?.vasuliCompletedCount}</td> */}
              </tr>
            );
          })}
          {/* {props?.btnName == 'GridDistrict' && */}
          {props?.dataDistrict?.map((val, i) => {
            return (
              <tr>
                <td>{val?.districtName}</td>
                <td>{val?.districtsCount}</td>
                <td>{val?.totalTaluka}</td>
                <td>{val?.totalVillages}</td>
                <td>{val?.totalEntry}</td>
                <td>{val?.totalGaonNamunaCount}</td>
                <td>{val?.demandCount}</td>
                <td>{val?.vasuliWithoutDemandCount}</td>
                <td>{val?.totalOfSevenEight}</td>
                <td>{val?.totalDemandCompletedCount}</td>
                <td>{val?.vasuliCompletedCount}</td>

                {/* <td>{val?.totalDemandCompletedCount}</td>
                <td>{val?.vasuliWithoutDemandCount}</td>
                <td>{val?.vasuliCompletedCount}</td> */}
              </tr>
            );
          })}
          {props?.dataTaluka?.map((val, i) => {
            return (
              <tr>
                <td>{val?.talukaName}</td>
                <td>0</td>
                <td>1</td>
                <td>{val?.totalVillages}</td>
                <td>{val?.totalEntry}</td>
                <td>{val?.totalGaonNamunaCount}</td>
                <td>{val?.demandCount}</td>
                <td>{val?.vasuliWithoutDemandCount}</td>
                <td>{val?.totalOfSevenEight}</td>
                <td>{val?.totalDemandCompletedCount}</td>
                <td>{val?.vasuliCompletedCount}</td>
                {/* <td>{val?.totalDemandCompletedCount}</td>
                <td>{val?.vasuliWithoutDemandCount}</td>
                <td>{val?.vasuliCompletedCount}</td> */}
              </tr>
            );
          })}
          {props?.btnName == 'GridDivision' && (
            <tr>
              <td>एकूण</td>
              <td>{props?.total?.districtsCount}</td>
              <td>{props?.total?.totalTalukaT}</td>
              <td>{props?.total?.totalVillagesT}</td>
              <td>{props?.total?.totalEntryT}</td>
              <td>{props?.total?.totalGaonNamunaCountT}</td>
              <td>{props?.total?.demandCountT}</td>
              <td>{props?.total?.vasuliWithoutDemandCountT}</td>
              <td>{props?.total?.totalOfSevenEightT}</td>
              <td>{props?.total?.totalDemandCompletedCountT}</td>
              <td>{props?.total?.vasuliCompletedCountT}</td>
              {/* <td>{props?.total?.vasuliCompletedCountT}</td> */}
              {/* <td>{props?.total?.totalGaonNamunaCountT}</td>
              <td>{props?.total?.totalDemandCompletedCountT}</td>
              <td>{props?.total?.vasuliWithoutDemandCountT}</td>
              <td>{props?.total?.vasuliCompletedCountT}</td> */}
            </tr>
          )}
          {props?.btnName == 'GridDistrict' && (
            <tr>
              <td>एकूण</td>
              <td>{props?.totalDistrict?.districtsCount}</td>
              <td>{props?.totalDistrict?.totalTalukaT}</td>
              <td>{props?.totalDistrict?.totalVillagesT}</td>
              <td>{props?.totalDistrict?.totalEntryT}</td>
              <td>{props?.totalDistrict?.totalGaonNamunaCountT}</td>
              <td>{props?.totalDistrict?.demandCountT}</td>
              <td>{props?.totalDistrict?.vasuliWithoutDemandCountT}</td>
              <td>{props?.totalDistrict?.totalOfSevenEightT}</td>
              <td>{props?.totalDistrict?.totalDemandCompletedCountT}</td>
              <td>{props?.totalDistrict?.vasuliCompletedCountT}</td>
              {/* <td>{props?.totalDistrict?.totalDemandCompletedCountT}</td>
              <td>{props?.totalDistrict?.vasuliWithoutDemandCountT}</td>
              <td>{props?.totalDistrict?.vasuliCompletedCountT}</td> */}
            </tr>
          )}
        </table>
      </div>
    </>
  );
};

export default memo(ExportToExcelFile);
