import { DownloadOutlined } from '@ant-design/icons';
import { memo } from 'react';

const num = (value) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};

const handleInLakh = (value) => {
  const n = num(value);
  return n === 0 ? '0.00' : (n / 100000).toFixed(2);
};

const calculateVasuliPercentage = (r) => {
  const totalMagani = num(r?.totalDemandJm) + num(r?.totalDemandSakirn);

  const totalVasuli = num(r?.totalCollectedJm) + num(r?.totalCollectedSankirn);

  if (totalMagani === 0) return 0;

  return (totalVasuli / totalMagani) * 100;
};

const getPercentageColor = (percent) => {
  if (percent >= 90) return '#28a745'; // Green
  if (percent >= 60) return '#ffc107'; // Yellow
  return '#dc3545'; // Red
};

const ExportToExcelVasuliFile = (props) => {
  const tableId = props?.tableId || 'GridDivisionTab5';
  const buttonId = props?.buttonId || `${tableId}-xls-button`;
  const downloadFileName = `${props?.filename || 'Vasuli_Report'}.xls`;

  const handleDownload = () => {
    if (typeof document === 'undefined') return;

    const table = document.getElementById(tableId);
    if (!table) return;

    const htmlContent = `\ufeff${table.outerHTML}`;
    const blob = new Blob([htmlContent], {
      type: 'application/vnd.ms-excel;charset=utf-8;',
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', downloadFileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  /* ================= STYLES ================= */

  const tableStyle = {
    borderCollapse: 'collapse',
    width: '100%',
    fontFamily: 'Arial',
    fontSize: '12px',
  };

  const thStyle = {
    border: '1px solid #000',
    padding: '8px',
    textAlign: 'center',
    backgroundColor: '#e6e6e6',
    fontWeight: 'bold',
  };

  const tdStyle = {
    border: '1px solid #000',
    padding: '6px',
    textAlign: 'right',
  };

  const tdLeftStyle = {
    border: '1px solid #000',
    padding: '6px',
    textAlign: 'left',
  };

  return (
    <>
      <button
        type="button"
        id={buttonId}
        className="download-table-xls-button"
        onClick={handleDownload}
        style={{
          marginBottom: '10px',
          padding: '6px 12px',
          backgroundColor: '#1890ff',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        {props?.btnName === 'GridDivision' ? 'Download as XLS' : <DownloadOutlined />}
      </button>

      <div style={{ display: 'none' }}>
        <table id={tableId} style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>विभाग/जिल्हा</th>
              <th style={thStyle}>जिल्हे</th>
              <th style={thStyle}>तालुके</th>
              <th style={thStyle}>एकूण गावांची संख्या</th>

              <th style={thStyle} colSpan="3">
                एकूण मागणी (रुपये लाखात)
              </th>

              <th style={thStyle} colSpan="3">
                एकूण वसूली (रुपये लाखात)
              </th>

              <th style={thStyle} rowSpan="2">
                टक्केवारी %
              </th>
            </tr>

            <tr>
              <th colSpan="4" style={thStyle}></th>

              <th style={thStyle}>जमीन महसुलाची मागणी</th>
              <th style={thStyle}>जमिनोत्तर महसुलाची मागणी</th>
              <th style={thStyle}>एकुण</th>

              <th style={thStyle}>जमीन महसुलाची वसुली</th>
              <th style={thStyle}>जमिनोत्तर महसुलाची वसुली</th>
              <th style={thStyle}>एकुण</th>
            </tr>
          </thead>

          <tbody>
            {/* ================= DIVISION LEVEL ================= */}
            {(props?.data || []).map((row, idx) => {
              const percent = calculateVasuliPercentage(row);

              return (
                <tr key={`division-${idx}`}>
                  <td style={tdLeftStyle}>{row?.divisionName || ''}</td>
                  <td style={tdStyle}>{row?.districtsCount || 0}</td>
                  <td style={tdStyle}>{row?.totalTaluka || 0}</td>
                  <td style={tdStyle}>{row?.totalVillages || 0}</td>

                  {/* DEMAND */}
                  <td style={tdStyle}>{handleInLakh(row?.totalDemandJm)}</td>
                  <td style={tdStyle}>{handleInLakh(row?.totalDemandSakirn)}</td>
                  <td style={tdStyle}>
                    {handleInLakh(num(row?.totalDemandJm) + num(row?.totalDemandSakirn))}
                  </td>

                  {/* COLLECTION */}
                  <td style={tdStyle}>{handleInLakh(row?.totalCollectedJm)}</td>
                  <td style={tdStyle}>{handleInLakh(row?.totalCollectedSankirn)}</td>
                  <td style={tdStyle}>
                    {handleInLakh(num(row?.totalCollectedJm) + num(row?.totalCollectedSankirn))}
                  </td>

                  {/* PERCENTAGE */}
                  <td
                    style={{
                      ...tdStyle,
                      textAlign: 'center',
                      fontWeight: 'bold',
                      color: '#fff',
                      backgroundColor: getPercentageColor(percent),
                    }}
                  >
                    {Math.round(percent)}%
                  </td>
                </tr>
              );
            })}

            {/* ================= DISTRICT LEVEL ================= */}
            {(props?.dataDistrict || []).map((row, idx) => {
              const percent = calculateVasuliPercentage(row);

              return (
                <tr key={`district-${idx}`}>
                  <td style={tdLeftStyle}>{row?.districtName || ''}</td>
                  <td style={tdStyle}>{row?.districtsCount || 0}</td>
                  <td style={tdStyle}>{row?.totalTaluka || 0}</td>
                  <td style={tdStyle}>{row?.totalVillages || 0}</td>

                  {/* DEMAND */}
                  <td style={tdStyle}>{handleInLakh(row?.totalDemandJm)}</td>
                  <td style={tdStyle}>{handleInLakh(row?.totalDemandSakirn)}</td>
                  <td style={tdStyle}>
                    {handleInLakh(num(row?.totalDemandJm) + num(row?.totalDemandSakirn))}
                  </td>

                  {/* COLLECTION */}
                  <td style={tdStyle}>{handleInLakh(row?.totalCollectedJm)}</td>
                  <td style={tdStyle}>{handleInLakh(row?.totalCollectedSankirn)}</td>
                  <td style={tdStyle}>
                    {handleInLakh(num(row?.totalCollectedJm) + num(row?.totalCollectedSankirn))}
                  </td>

                  {/* PERCENTAGE */}
                  <td
                    style={{
                      ...tdStyle,
                      textAlign: 'center',
                      fontWeight: 'bold',
                      color: '#fff',
                      backgroundColor: getPercentageColor(percent),
                    }}
                  >
                    {Math.round(percent)}%
                  </td>
                </tr>
              );
            })}

            {/* ================= TALUKA LEVEL ================= */}
            {(props?.dataTaluka || []).map((row, idx) => {
              const percent = calculateVasuliPercentage(row);

              return (
                <tr key={`taluka-${idx}`}>
                  <td style={tdLeftStyle}>{row?.talukaName || ''}</td>
                  <td style={tdStyle}>0</td>
                  <td style={tdStyle}>1</td>
                  <td style={tdStyle}>{row?.totalVillages || 0}</td>

                  {/* DEMAND */}
                  <td style={tdStyle}>{handleInLakh(row?.totalDemandJm)}</td>
                  <td style={tdStyle}>{handleInLakh(row?.totalDemandSakirn)}</td>
                  <td style={tdStyle}>
                    {handleInLakh(num(row?.totalDemandJm) + num(row?.totalDemandSakirn))}
                  </td>

                  {/* COLLECTION */}
                  <td style={tdStyle}>{handleInLakh(row?.totalCollectedJm)}</td>
                  <td style={tdStyle}>{handleInLakh(row?.totalCollectedSankirn)}</td>
                  <td style={tdStyle}>
                    {handleInLakh(num(row?.totalCollectedJm) + num(row?.totalCollectedSankirn))}
                  </td>

                  {/* PERCENTAGE */}
                  <td
                    style={{
                      ...tdStyle,
                      textAlign: 'center',
                      fontWeight: 'bold',
                      color: '#fff',
                      backgroundColor: getPercentageColor(percent),
                    }}
                  >
                    {Math.round(percent)}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default memo(ExportToExcelVasuliFile);
