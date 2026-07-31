import React, { useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { FormattedMessage } from 'umi';
import styles from './TalukaGoshwaraReport.module.css';

const publicUseCols = [
  { prefixKey: 'form1abstract.(a)', 
    labelKey: 'form1abstract.Forest' },
  { prefixKey: 'form1abstract.(b)', 
    labelKey: 'form1abstract.Kuran' },
  { prefixKey: 'form1abstract.(c)', 
    labelKey: 'form1abstract.pastureCattle' },
  { prefixKey: 'form1abstract.(d)', 
    labelKey: 'form1abstract.VillageSite' },
  { prefixKey: 'form1abstract.(e)', 
    labelKey: 'form1abstract.Tank' },
  { prefixKey: 'form1abstract.(fENG)', 
    labelKey: 'form1abstract.burialGround' },
  { prefixKey: 'form1abstract.(gENG)', 
    labelKey: 'form1abstract.railways' },
  { prefixKey: 'form1abstract.(hENG)', 
    labelKey: 'form1abstract.PotKharabAssigned' },
  { prefixKey: 'form1abstract.(ie)', 
    labelKey: 'form1abstract.RoadsPaths' },
  { prefixKey: 'form1abstract.(j)', 
    labelKey: 'form1abstract.pipeLines' },
  { prefixKey: 'form1abstract.(k)', 
    labelKey: 'form1abstract.Cantonment' },
  { prefixKey: 'form1abstract.(l)', 
    labelKey: 'form1abstract.School' },
  { prefixKey: 'form1abstract.(m)', 
    labelKey: 'form1abstract.Dharmashalas' },
  { labelKey: 'form1abstract.leasedorGranted' },
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
          <h2 className={styles.boxHeading}>
            <FormattedMessage id="form1abstract.goshwaraTable.heading" />
          </h2>
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
        <h3 className={styles.tableHeading}>
          <FormattedMessage id="form1abstract.goshwaraTable.heading" />
        </h3>
        <div className={styles.subHeading}>
          गाव- {'—'} &nbsp;&nbsp; तालुका- {talukaName || '—'} &nbsp;&nbsp; जिल्हा-{' '}
          {districtName || '—'}
        </div>

        <div className={styles.tableScroll}>
          <table className={styles.goshwaraTable}>
            <thead>
              {/* ओळ 1 */}
              <tr>
                <th rowSpan={4}>
                  <FormattedMessage id="form1abstract.goshwaraTable.srNo" />
                </th>
                <th rowSpan={4}>
                  <FormattedMessage id="form1abstract.goshwaraTable.villageName" />
                </th>
                <th colSpan={9}>
                  <FormattedMessage id="form1abstract.A.landForCultivation" />
                </th>
                <th colSpan={16}>
                  <FormattedMessage id="form1abstract.B.landNotForCultivation" />
                </th>
                <th rowSpan={4}>
                  <FormattedMessage id="form1abstract.goshwaraTable.totalBLabel" />
                </th>
                <th rowSpan={4}>
                  <FormattedMessage id="form1abstract.goshwaraTable.grandTotalLabel" />
                </th>
              </tr>
              {/* ओळ 2 */}
              <tr>
                <th colSpan={6}>
                  <FormattedMessage id="form1abstract.assessed" />
                </th>
                <th colSpan={2}>
                  <FormattedMessage id="form1abstract.Unassessed" />
                </th>
                <th rowSpan={3}>
                  <FormattedMessage id="form1abstract.goshwaraTable.totalALabel" />
                </th>
                <th colSpan={2}>
                  <FormattedMessage id="form1abstract.Uncultivated" />
                </th>
                <th colSpan={14}>
                  <FormattedMessage id="form1abstract.Assignedforpublic" />
                </th>
              </tr>
              {/* ओळ 3 */}
              <tr>
                <th colSpan={3}>
                  <FormattedMessage id="form1abstract.occupied(unalienated)" />
                </th>
                <th rowSpan={2}>
                  <FormattedMessage id="form1abstract.(b)" />
                   <FormattedMessage id="form1abstract.govtLand" />
                </th>
                <th rowSpan={2}>
                  <FormattedMessage id="form1abstract.(c)" />
                   <FormattedMessage id="form1abstract.CessFree" />
                </th>
                <th rowSpan={2}>
                  <FormattedMessage id="form1abstract.(d)" />
                   <FormattedMessage id="form1abstract.Alienated" />
                </th>
                <th rowSpan={2}>
                  <FormattedMessage id="form1abstract.Unoccupied" />
                </th>
                <th rowSpan={2}>
                  <FormattedMessage id="form1abstract.(b)" />{' '}
                  <FormattedMessage id="form1abstract.AssignedForSpecialuse" />
                </th>
                <th rowSpan={2}>
                  <FormattedMessage id="form1abstract.(a)" />
                   <FormattedMessage id="form1abstract.potkharab" />
                </th>
                <th rowSpan={2}>
                  <FormattedMessage id="form1abstract.(b)" />
                   <FormattedMessage id="form1abstract.rivers" /> व{' '}
                  <FormattedMessage id="form1abstract.Nallas" />
                </th>
                {publicUseCols.map((col, i) => (
                  <th key={i} rowSpan={2}>
                    {col.prefixKey && (
                      <>
                        <FormattedMessage id={col.prefixKey} />{' '}
                      </>
                    )}
                    <FormattedMessage id={col.labelKey} />
                  </th>
                ))}
              </tr>
              {/* ओळ 4 */}
              <tr>
                <th>
                  <FormattedMessage id="form1abstract.(I)" />
                   <FormattedMessage id="form1abstract.OccupantsClass I" />
                </th>
                <th>
                  <FormattedMessage id="form1abstract.(II)" />{' '}
                  <FormattedMessage id="form1abstract.OccupantsClass II" />
                </th>
                <th>
                  <FormattedMessage id="form1abstract.(III)" />{' '}
                  <FormattedMessage id="form1abstract.Goverment.Lessees" />
                </th>
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
