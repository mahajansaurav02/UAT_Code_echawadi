import React, { useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import styles from './TalukaGoshwaraReport.module.css';

const publicUseCols = [
  '(अ) वन',
  '(ब) कुरण',
  '(क) नि:शुल्‍क गायरान, गुरांचा तळ',
  '(ड) गावठाण',
  '(इ) तलाव',
  '(फ) स्मशानभूमी (मसनवट)',
  '(ग) रेल्वे',
  '(ह) रस्ते,पाण्याचे पाट इत्यादीकरीता नेमून दिलेली पोटखराब',
  '(आय) रस्ते व मार्ग',
  '(जे) नळमार्ग, कालवे, चर इत्यादी',
  '(के) कटक (कॅन्‍टोन्‍मेट) क्षेत्रातील जमिनी (सैनिकी छावणी, गोळीबार क्षेत्र इत्यादी)',
  '(एल) शाळा',
  '(एम) धर्मशाळा',
  '(तीन) भूमापन क्रमांकापैकी अकृषिक वापरासाठी',
];

const TOTAL_COLS = 29;

const dummyRows = [
  {
    anu: 1,
    village: 'सारोळा उजाड',
    values: [
      '10.78',
      '1.09',
      '2.93',
      '0.00',
      '0.00',
      '1.31',
      '2.01',
      '0.00',
      '18.12',
      '0.22',
      '0.05',
      '1.44',
      '0.36',
      '1.22',
      '0.43',
      '0.29',
      '0.20',
      '0.93',
      '0.29',
      '0.43',
      '0.45',
      '0.51',
      '0.14',
      '0.17',
      '0.53',
      '7.36',
      '25.48',
    ],
  },
  {
    anu: 2,
    village: 'आनंदवाडी',
    values: [
      '8.79',
      '9.30',
      '6.74',
      '0.00',
      '0.00',
      '0.60',
      '0.00',
      '0.00',
      '25.43',
      '0.32',
      '0.25',
      '0.17',
      '0.53',
      '0.04',
      '0.27',
      '0.24',
      '0.01',
      '0.52',
      '0.08',
      '0.01',
      '0.08',
      '0.37',
      '0.17',
      '0.03',
      '0.90',
      '3.06',
      '28.49',
    ],
  },
  {
    anu: 3,
    village: 'खरवंडी',
    values: [
      '5.12',
      '3.44',
      '1.00',
      '0.00',
      '0.00',
      '0.75',
      '0.00',
      '0.00',
      '10.31',
      '0.18',
      '0.06',
      '0.20',
      '0.13',
      '0.29',
      '0.22',
      '0.56',
      '0.00',
      '0.31',
      '0.02',
      '0.03',
      '0.20',
      '0.58',
      '0.29',
      '0.29',
      '0.00',
      '3.07',
      '13.38',
    ],
  },
];

function TalukaGoshwaraReport({ talukaName, districtName, onBack }) {
  const [showData, setShowData] = useState(false);

  const printRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: 'गाव नमुना एक चा गोषवारा',
    pageStyle: `
      @page { size: A2 landscape; margin: 8mm; }
      html, body {
        height: auto !important;
        min-height: 0 !important;
        margin: 0 !important;
        padding: 0 !important;
      }
    `,
  });

  return (
    <div className={styles.screen}>
      {onBack && (
        <div className={styles.topBar}>
          <button type="button" className={styles.backButton} onClick={onBack}>
            ← मागे
          </button>
        </div>
      )}

      <div className={styles.controlBox}>
        <div className={styles.controlTopRow}>
          <button type="button" className={styles.pratButton} onClick={handlePrint}>
            प्रत मिळवा
          </button>
          <h2 className={styles.boxHeading}>गाव नमुना एक चा गोषवारा</h2>
          <span className={styles.topRowSpacer} />
        </div>

        <div className={styles.controlFields}>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>जिल्हा:</label>
            <input className={styles.fieldInput} value={districtName || ''} disabled readOnly />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>तालुका:</label>
            <input className={styles.fieldInput} value={talukaName || ''} disabled readOnly />
          </div>

          <button type="button" className={styles.getDataButton} onClick={() => setShowData(true)}>
            डेटा मिळवा
          </button>
        </div>
      </div>

      <div className={styles.tableWrapper} ref={printRef}>
        <h3 className={styles.tableHeading}>गाव नमुना एक चा गोषवारा</h3>
        <div className={styles.subHeading}>
          गाव- {'—'} &nbsp;&nbsp; तालुका- {talukaName || '—'} &nbsp;&nbsp; जिल्हा-{' '}
          {districtName || '—'}
        </div>

        <div className={styles.tableScroll}>
          <table className={styles.goshwaraTable}>
            <thead>
              {/* ओळ 1 */}
              <tr>
                <th rowSpan={4}>अनु.क्र.</th>
                <th rowSpan={4}>गावाचे नाव</th>
                <th colSpan={9}>अ- लागवडीकरीता जमीन</th>
                <th colSpan={16}>ब- लागवडीसाठी अनुपलब्ध जमीन</th>
                <th rowSpan={4}>ब - लागवडीकरीता जमीन एकूण</th>
                <th rowSpan={4}>गावची एकूण बेरीज (अ+ब)</th>
              </tr>
              {/* ओळ 2 */}
              <tr>
                <th colSpan={6}>(एक) आकारी</th>
                <th colSpan={2}>(दोन) बिनआकारी</th>
                <th rowSpan={3}>अ- लागवडीकरीता जमीन एकूण</th>
                <th colSpan={2}>(एक) लागवड अयोग्य</th>
                <th colSpan={14}>(दोन) सार्वजनिक किंवा विशेष वापरासाठी नेमून दिलेली</th>
              </tr>
              {/* ओळ 3 */}
              <tr>
                <th colSpan={3}>(अ) भोगवटयाची (बिनदुमाला)</th>
                <th rowSpan={2}>(ब) बिन-भोगवटयाची जमीन(सरकार)</th>
                <th rowSpan={2}>(क) विशेष करारान्‍वये महसूल माफ किंवा कम आकारी जमीन</th>
                <th rowSpan={2}>(ड) दुमाला जमीन</th>
                <th rowSpan={2}>(अ) बिन-भोगवटयाची</th>
                <th rowSpan={2}>
                  (ब) विशेष वापरासाठी नेमून दिलेली जमीन(उदा. कृषी क्षेत्र, भात पैदास केंद्र इ.)
                </th>
                <th rowSpan={2}>(अ) पोट खराब</th>
                <th rowSpan={2}>(ब) नद्या व नाले</th>
                {publicUseCols.map((label, i) => (
                  <th key={i} rowSpan={2}>
                    {label}
                  </th>
                ))}
              </tr>
              {/* ओळ 4 */}
              <tr>
                <th>(एक) भोगवटादार, वर्ग १</th>
                <th>(दोन) भोगवटादार, वर्ग २</th>
                <th>(तीन) सरकारी पट्‍टेदार</th>
              </tr>
            </thead>
            <tbody>
              {showData ? (
                dummyRows.map((row) => (
                  <tr key={row.anu}>
                    <td>{row.anu}</td>
                    <td className={styles.villageName}>{row.village}</td>
                    {row.values.map((v, i) => (
                      <td key={i}>{v}</td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={TOTAL_COLS} className={styles.noData}>
                    No Data Available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default TalukaGoshwaraReport;
