import React from 'react';

const PrintTemplate = React.forwardRef((props, ref) => {
  const { village, data, sequentialFerfarList, allFerfarList, printData, ferfarTypeLabel, intl } = props;

  if (!data || !data.vasuliDetails) return <div ref={ref}>Loading Print Data...</div>;

  const totalDemandAll = (data.vasuliDetails.jaminMahsul029?.mangni || 0) + 
                         (data.vasuliDetails.itarMahsul045?.mangni || 0) + 
                         (data.vasuliDetails.uddishtanusar?.mangni || 0);
  const totalCollectedAll = (data.vasuliDetails.jaminMahsul029?.vasuli || 0) + 
                            (data.vasuliDetails.itarMahsul045?.vasuli || 0) + 
                            (data.vasuliDetails.uddishtanusar?.vasuli || 0);
  const totalPercentageAll = totalDemandAll ? ((totalCollectedAll / totalDemandAll) * 100).toFixed(2) : 0;

  // Print format helpers for bilingual severity
  const getPrintRemarkType = (item) => {
    if (item.remarkType) return item.remarkType;
    if (item.typeOfRemark === 3 || item.typeOfRemark === 'अतीगंभीर') return intl.formatMessage({ id: 'daptar.severity.critical', defaultMessage: 'अतीगंभीर' });
    if (item.typeOfRemark === 2 || item.typeOfRemark === 'गंभीर') return intl.formatMessage({ id: 'daptar.severity.high', defaultMessage: 'गंभीर' });
    return intl.formatMessage({ id: 'daptar.severity.normal', defaultMessage: 'साधारण' });
  };

  const getPrintSeverityStyle = (type) => {
    let color = '#333';
    if (type === intl.formatMessage({ id: 'daptar.severity.critical', defaultMessage: 'अतीगंभीर' })) color = '#f5222d';
    else if (type === intl.formatMessage({ id: 'daptar.severity.high', defaultMessage: 'गंभीर' })) color = '#faad14';
    else if (type === intl.formatMessage({ id: 'daptar.severity.normal', defaultMessage: 'साधारण' })) color = '#52c41a';
    return { color: color, fontWeight: 'bold' };
  };

  // --- BILINGUAL AKRUSHAK DAR FORMATTER ---
  const getAkrushakStatusText = (akrushakData) => {
    if (!akrushakData || akrushakData === '-') return '-';
    // Fallback if data is still a string
    if (typeof akrushakData === 'string') return akrushakData; 

    const declarationText = akrushakData.declaration === 'N' 
      ? intl.formatMessage({ id: 'daptar.no', defaultMessage: 'नाही' }) 
      : intl.formatMessage({ id: 'daptar.yes', defaultMessage: 'होय' });
      
    let rateText = '-';
    const rupee = intl.formatMessage({ id: 'daptar.rupee', defaultMessage: 'रुपये' });
    const paise = intl.formatMessage({ id: 'daptar.paise', defaultMessage: 'पैसे' });

    if (akrushakData.nprate > 0) rateText = `${akrushakData.nprate} ${rupee}`;
    else if (akrushakData.mnparate > 0) rateText = `${akrushakData.mnparate} ${rupee}`;
    else if (akrushakData.tenpaise > 0) rateText = `${akrushakData.tenpaise} ${paise}`;
    else if (akrushakData.fivepaise > 0) rateText = `${akrushakData.fivepaise} ${paise}`;

    const rateLabel = intl.formatMessage({ id: 'daptar.ratePerSqM', defaultMessage: 'दर (प्रति चौ.मी)' });
    
    return `${declarationText} (${rateLabel}: ${rateText})`;
  };

  const trutiRemarksPrint = (printData?.ehakkTruti || []).filter(item => item.applicationId !== null && item.remark);
  
  let allPendingRemarksPrint = [];
  const pendingLabels = [
    intl.formatMessage({ id: 'daptar.secB.gt180', defaultMessage: '१८० दिवसापेक्षा जास्त प्रलंबित' }), 
    intl.formatMessage({ id: 'daptar.secB.90to180', defaultMessage: '९० ते १८० दिवसातील प्रलंबित' }), 
    intl.formatMessage({ id: 'daptar.secB.30to90', defaultMessage: '३० ते ९० दिवसातील प्रलंबित' }), 
    intl.formatMessage({ id: 'daptar.secB.lt30', defaultMessage: '३० दिवसा पेक्षा कमी प्रलंबित' })
  ];
  
  (printData?.ehakkPending || []).forEach((dataArr, index) => {
      if (dataArr && dataArr.length > 0) {
          dataArr.forEach(item => { if (item.remark) allPendingRemarksPrint.push({ ...item, pendingType: pendingLabels[index] }); });
      }
  });

  const getEchawadiRemarkText = (typeId) => {
      const items = (printData?.echawadi || []).filter(item => item.echawdiType === typeId);
      if (items.length === 0) return '-';
      return items.map(item => item.remark || item.shera).join('\n');
  };

  return (
    <div ref={ref} className="print-wrapper" style={{ padding: '15mm', fontFamily: 'Arial, sans-serif', backgroundColor: '#fff', color: '#000' }}>
      <style>
        {`
          /* STRICT STYLES FOR PDF AND PRINT (Removed @media print wrapper for tables) */
          .print-wrapper { padding: 0 !important; background: white; }
          .page-break { page-break-before: always; margin-top: 20px; }
          
          /* Table Styling - Now applies to PDF generation as well */
          .print-wrapper table { width: 100%; border-collapse: collapse; margin-bottom: 20px; page-break-inside: auto; font-size: 14px; border: 1px solid #000; }
          .print-wrapper tr { page-break-inside: avoid; page-break-after: auto; }
          .print-wrapper th { background-color: #f2f2f2 !important; border: 1px solid #000 !important; padding: 10px !important; text-align: left; color: #000 !important; font-weight: bold; }
          .print-wrapper td { border: 1px solid #000 !important; padding: 8px !important; color: #000 !important; vertical-align: top; }
          
          .print-wrapper .text-center { text-align: center !important; }
          .print-wrapper .text-right { text-align: right !important; }
          
          /* Headers */
          .print-wrapper .doc-title { text-align: center; font-size: 20px; font-weight: bold; margin-bottom: 5px; color: #000 !important; }
          .print-wrapper .doc-subtitle { text-align: center; font-size: 16px; margin-bottom: 20px; font-weight: bold; text-decoration: underline; color: #000 !important; }
          .print-wrapper .section-heading { font-weight: bold; margin-top: 20px; margin-bottom: 10px; font-size: 15px; color: #000 !important; }
          
          .print-wrapper .flex-row { display: flex; justify-content: space-between; margin-bottom: 5px; }

          /* Print specific page margins */
          @media print {
            @page { size: A4 portrait; margin: 10mm; }
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; margin: 0; background: white; }
          }
        `}
      </style>
      {/* ===================== PAGE 1: MAIN REPORT SUMMARIES ===================== */}
      <div className="doc-title">निरीक्षण रिपोर्ट - {village || '—'}</div>
      <div className="doc-subtitle">{intl.formatMessage({ id: 'daptar.title', defaultMessage: 'ग्राम महसूल अधिकारी दप्तर निरीक्षण टिप्पणी' })}</div>
      
      <table style={{ border: 'none', marginBottom: '20px', width: '100%', fontSize: '14px' }}>
        <tbody>
          <tr>
            <td style={{ border: 'none', padding: '2px', width: '60%', verticalAlign: 'top' }}>
              <div className="flex-row"><span><strong>{intl.formatMessage({ id: 'daptar.officerNameDesig' })}:</strong></span> <span>{data.tapasaniAdhikariName} ({data.tapasaniAdhikariPadnam})</span></div>
              <div className="flex-row"><span><strong>{intl.formatMessage({ id: 'daptar.sajaName' })}:</strong></span> <span>{village || '—'}</span></div>
              <div className="flex-row"><span><strong>{intl.formatMessage({ id: 'daptar.villageName' })}:</strong></span> <span>{village || '—'}</span></div>
              <div className="flex-row"><span><strong>{intl.formatMessage({ id: 'daptar.gramRevenueOfficer' })}:</strong></span> <span>{data.gramMahsulAdhikariName}</span></div>
            </td>
            <td style={{ border: 'none', padding: '2px', width: '40%', verticalAlign: 'top', textAlign: 'right' }}>
              <div><strong>{intl.formatMessage({ id: 'daptar.inspectionDate' })}:</strong> {data.tapasaniDinanck}</div>
            </td>
          </tr>
        </tbody>
      </table>

      {/* SECTION A */}
      <div className="section-heading">{intl.formatMessage({ id: 'daptar.secA.title' })}</div>
      <table>
        <thead>
          <tr>
            <th className="text-center" style={{ width: '8%' }}>{intl.formatMessage({ id: 'daptar.table.srNo' })}</th>
            <th style={{ width: '42%' }}>{intl.formatMessage({ id: 'daptar.table.details' })}</th>
            <th style={{ width: '50%' }}>{intl.formatMessage({ id: 'daptar.table.ferfarNo' })}</th>
          </tr>
        </thead>
        <tbody>
          {sequentialFerfarList.map((item, index) => (
            <tr key={index}>
              <td className="text-center">{index + 1}</td>
              <td>{ferfarTypeLabel[item.ferfarType]}</td>
              <td style={{ fontWeight: 'bold' }}>{item.mutNos.length > 0 ? item.mutNos.join(', ') : '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* SECTION B */}
      <div className="section-heading">{intl.formatMessage({ id: 'daptar.secB.title' })}</div>
      <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>{intl.formatMessage({ id: 'daptar.secB.q1' })} {data.eHakkArjData?.trutiArjList?.length || 0}</div>
      <table>
        <thead><tr><th style={{ width: '50%' }}>{intl.formatMessage({ id: 'daptar.table.details' })}</th><th>{intl.formatMessage({ id: 'daptar.table.arjNo' })}</th></tr></thead>
        <tbody>
          <tr>
            <td>{intl.formatMessage({ id: 'daptar.secB.row1' })}</td>
            <td style={{ lineHeight: '1.6' }}>{data.eHakkArjData?.trutiArjList?.length > 0 ? data.eHakkArjData.trutiArjList.join(', ') : '-'}</td>
          </tr>
        </tbody>
      </table>

      <div style={{ marginBottom: '8px', marginTop: '15px', fontWeight: 'bold' }}>{intl.formatMessage({ id: 'daptar.secB.q2' })}</div>
      <table>
        <thead>
          <tr>
            <th className="text-center" style={{ width: '25%' }}>{intl.formatMessage({ id: 'daptar.secB.90to180' })}</th>
            <th className="text-center" style={{ width: '25%' }}>{intl.formatMessage({ id: 'daptar.secB.gt180' })}</th>
            <th className="text-center" style={{ width: '25%' }}>{intl.formatMessage({ id: 'daptar.secB.30to90' })}</th>
            <th className="text-center" style={{ width: '25%' }}>{intl.formatMessage({ id: 'daptar.secB.lt30' })}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="text-center" style={{ fontWeight: 'bold' }}>{data.ehakkaCounts['90to180']}</td>
            <td className="text-center" style={{ fontWeight: 'bold' }}>{data.ehakkaCounts['180']}</td>
            <td className="text-center" style={{ fontWeight: 'bold' }}>{data.ehakkaCounts['30to90']}</td>
            <td className="text-center" style={{ fontWeight: 'bold' }}>{data.ehakkaCounts['lessThan30']}</td>
          </tr>
        </tbody>
      </table>

      {/* SECTION C */}
      <div className="section-heading">{intl.formatMessage({ id: 'daptar.secC.title' })}</div>
      <table>
        <thead>
          <tr>
            <th className="text-center" style={{ width: '8%' }}>{intl.formatMessage({ id: 'daptar.table.srNo' })}</th>
            <th style={{ width: '62%' }}>{intl.formatMessage({ id: 'daptar.table.details' })}</th>
            <th className="text-center" style={{ width: '30%' }}>{intl.formatMessage({ id: 'daptar.table.count', defaultMessage: 'संख्या / शेरा' })}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="text-center">1</td>
            <td>
              <div style={{ marginBottom: '10px' }}>{intl.formatMessage({ id: 'daptar.secC.q1' })}</div>
              <div style={{ paddingLeft: '15px' }}>I) {intl.formatMessage({ id: 'daptar.secC.q1.1' })}</div>
              <div style={{ paddingLeft: '15px' }}>II) {intl.formatMessage({ id: 'daptar.secC.q1.2' })}</div>
              <div style={{ paddingLeft: '15px' }}>III) {intl.formatMessage({ id: 'daptar.secC.q1.3' })}</div>
            </td>
            <td className="text-center" style={{ verticalAlign: 'bottom', paddingBottom: '8px' }}>
              <div style={{ marginBottom: '10px' }}>&nbsp;</div>
              <div style={{ fontWeight: 'bold' }}>{data.eChawadiData.gawNamunaPurna?.nirank || 0}</div>
              <div style={{ fontWeight: 'bold' }}>{data.eChawadiData.gawNamunaPurna?.kamkajPurna || 0}</div>
              <div style={{ fontWeight: 'bold' }}>{data.eChawadiData.gawNamunaPurna?.aghoshana || 0}</div>
            </td>
          </tr>
          <tr>
            <td className="text-center">2</td>
            <td>{intl.formatMessage({ id: 'daptar.secC.q2' })}</td>
            <td className="text-center" style={{ fontWeight: 'bold' }}>{data.eChawadiData.mangniRakkamKamiKhatedar}</td>
          </tr>
          <tr>
            <td className="text-center">3</td>
            <td>{intl.formatMessage({ id: 'daptar.secC.q3' })}</td>
            {/* THIS IS THE UPDATED AKRUSHAK RENDER */}
            <td className="text-center" style={{ fontWeight: 'bold' }}>{getAkrushakStatusText(data.eChawadiData.akrushakDarBharlaKay)}</td>
          </tr>
          <tr>
            <td className="text-center">4</td>
            <td>{intl.formatMessage({ id: 'daptar.secC.q4.2' })}</td>
            <td className="text-center" style={{ fontWeight: 'bold' }}>{data.eChawadiData.akarbandTapshil?.dyslr || 0}</td>
          </tr>
        </tbody>
      </table>

      {/* SECTION D */}
      <div className="section-heading">{intl.formatMessage({ id: 'daptar.secD.title' })}</div>
      <table>
        <thead>
          <tr>
            <th style={{ width: '40%' }}>{intl.formatMessage({ id: 'daptar.table.details' })}</th>
            <th className="text-center" style={{ width: '20%' }}>{intl.formatMessage({ id: 'daptar.table.demand' })}</th>
            <th className="text-center" style={{ width: '20%' }}>{intl.formatMessage({ id: 'daptar.table.recovery' })}</th>
            <th className="text-center" style={{ width: '20%' }}>{intl.formatMessage({ id: 'daptar.table.percentage' })}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{intl.formatMessage({ id: 'daptar.secD.row1' })}</td>
            <td className="text-center">{data.vasuliDetails.jaminMahsul029.mangni}</td>
            <td className="text-center">{data.vasuliDetails.jaminMahsul029.vasuli}</td>
            <td className="text-center">{data.vasuliDetails.jaminMahsul029.percentage}%</td>
          </tr>
          <tr>
            <td>{intl.formatMessage({ id: 'daptar.secD.row2' })}</td>
            <td className="text-center">{data.vasuliDetails.itarMahsul045.mangni}</td>
            <td className="text-center">{data.vasuliDetails.itarMahsul045.vasuli}</td>
            <td className="text-center">{data.vasuliDetails.itarMahsul045.percentage}%</td>
          </tr>
          <tr>
            <td>{intl.formatMessage({ id: 'daptar.secD.row3' })}</td>
            <td className="text-center">{data.vasuliDetails.uddishtanusar.mangni}</td>
            <td className="text-center">{data.vasuliDetails.uddishtanusar.vasuli}</td>
            <td className="text-center">{data.vasuliDetails.uddishtanusar.percentage}%</td>
          </tr>
          <tr style={{ backgroundColor: '#fafafa' }}>
            <td><b>{intl.formatMessage({ id: 'daptar.secD.total' })}</b></td>
            <td className="text-center"><b>{totalDemandAll}</b></td>
            <td className="text-center"><b>{totalCollectedAll}</b></td>
            <td className="text-center"><b>{totalPercentageAll}%</b></td>
          </tr>
        </tbody>
      </table>

      {/* ===================== PAGE 2: APPENDIX (REMARKS) ===================== */}
      <div className="page-break">
        <div className="doc-title" style={{ color: 'red !important' }}>{intl.formatMessage({ id: 'daptar.print.appendixTitle', defaultMessage: 'परिशिष्ट - १' })}</div>
        <div className="doc-subtitle" style={{ border: 'none', textDecoration: 'none' }}>{intl.formatMessage({ id: 'daptar.print.appendixSubTitle', defaultMessage: 'ग्राम महसूल अधिकारी दप्तर तपासणी - सविस्तर शेरा व अभिप्राय' })}</div>

        <div className="section-heading" style={{ borderBottom: '2px solid #000' }}>{intl.formatMessage({ id: 'daptar.print.secA', defaultMessage: 'अ. फेरफार तपासणी शेरा' })}</div>
        {Object.keys(ferfarTypeLabel).map(typeKey => {
          const typeId = Number(typeKey);
          const items = allFerfarList.filter(f => f.ferfarType === typeId && f.remark);
          if(items.length === 0) return null;
          return (
            <div key={typeKey}>
              <div style={{ fontWeight: 'bold', margin: '15px 0 8px 0', fontSize: '14px' }}>• {ferfarTypeLabel[typeId]}:</div>
              <table>
                <thead>
                  <tr>
                    <th className="text-center" style={{ width: '20%' }}>{intl.formatMessage({ id: 'daptar.table.ferfarNo', defaultMessage: 'फेरफार क्र.' })}</th>
                    <th className="text-center" style={{ width: '20%' }}>{intl.formatMessage({ id: 'daptar.print.type', defaultMessage: 'प्रकार' })}</th>
                    <th>{intl.formatMessage({ id: 'daptar.table.remark', defaultMessage: 'शेरा' })}</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, idx) => {
                    const typeLabel = getPrintRemarkType(item);
                    return (
                      <tr key={idx}>
                        <td className="text-center" style={{ fontWeight: 'bold' }}>{item.mutNo}</td>
                        <td className="text-center"><span style={getPrintSeverityStyle(typeLabel)}>{typeLabel}</span></td>
                        <td style={{ whiteSpace: 'pre-wrap' }}>{item.remark}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )
        })}

        <div className="section-heading" style={{ marginTop: '30px', borderBottom: '2px solid #000' }}>{intl.formatMessage({ id: 'daptar.print.secB', defaultMessage: 'ब. ई-हक्क प्रणाली शेरा' })}</div>
        {trutiRemarksPrint.length > 0 && (
          <div>
            <div style={{ fontWeight: 'bold', margin: '15px 0 8px 0', fontSize: '14px' }}>{intl.formatMessage({ id: 'daptar.print.secB1', defaultMessage: '१. त्रुटीपूर्ततेसाठी भूधारकास परत पाठविण्यात आलेल्या अर्जाची तपासणीः' })}</div>
            <table>
              <thead>
                <tr>
                  <th className="text-center" style={{ width: '20%' }}>{intl.formatMessage({ id: 'daptar.table.arjNo', defaultMessage: 'अर्ज क्र.' })}</th>
                  <th className="text-center" style={{ width: '20%' }}>{intl.formatMessage({ id: 'daptar.print.type', defaultMessage: 'प्रकार' })}</th>
                  <th>{intl.formatMessage({ id: 'daptar.table.remark', defaultMessage: 'शेरा' })}</th>
                </tr>
              </thead>
              <tbody>
                {trutiRemarksPrint.map((item, idx) => {
                  const typeLabel = getPrintRemarkType(item);
                  return (
                    <tr key={idx}>
                      <td className="text-center" style={{ fontWeight: 'bold' }}>{item.applicationId}</td>
                      <td className="text-center"><span style={getPrintSeverityStyle(typeLabel)}>{typeLabel}</span></td>
                      <td style={{ whiteSpace: 'pre-wrap' }}>{item.remark}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {allPendingRemarksPrint.length > 0 && (
          <div>
            <div style={{ fontWeight: 'bold', margin: '15px 0 8px 0', fontSize: '14px' }}>{intl.formatMessage({ id: 'daptar.print.secB2', defaultMessage: '२. तलाठी स्तरावर फेरफाराकरीता प्रलंबित अर्जाची तपासणीः' })}</div>
            <table>
              <thead>
                <tr>
                  <th className="text-center" style={{ width: '20%' }}>{intl.formatMessage({ id: 'daptar.table.arjNo', defaultMessage: 'अर्ज क्र.' })}</th>
                  <th style={{ width: '30%' }}>{intl.formatMessage({ id: 'daptar.print.pendingType', defaultMessage: 'प्रलंबित प्रकार' })}</th>
                  <th className="text-center" style={{ width: '20%' }}>{intl.formatMessage({ id: 'daptar.print.type', defaultMessage: 'प्रकार' })}</th>
                  <th>{intl.formatMessage({ id: 'daptar.table.remark', defaultMessage: 'शेरा' })}</th>
                </tr>
              </thead>
              <tbody>
                {allPendingRemarksPrint.map((item, idx) => {
                  const typeLabel = getPrintRemarkType(item);
                  return (
                    <tr key={idx}>
                      <td className="text-center" style={{ fontWeight: 'bold' }}>{item.applicationId}</td>
                      <td>{item.pendingType}</td>
                      <td className="text-center"><span style={getPrintSeverityStyle(typeLabel)}>{typeLabel}</span></td>
                      <td style={{ whiteSpace: 'pre-wrap' }}>{item.remark}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="section-heading" style={{ marginTop: '30px', borderBottom: '2px solid #000' }}>{intl.formatMessage({ id: 'daptar.print.secC_D', defaultMessage: 'क. ई-चावडी व ड. वसुली बाबत शेरा' })}</div>
        <table>
          <tbody>
            <tr><td style={{ width: '40%' }}><b>{intl.formatMessage({ id: 'daptar.print.echawadi1', defaultMessage: 'ई-चावडी (गाव नमुना पूर्ण)' })}</b></td><td><pre style={{ margin: 0, fontFamily: 'inherit', whiteSpace: 'pre-wrap' }}>{getEchawadiRemarkText(1)}</pre></td></tr>
            <tr><td style={{ width: '40%' }}><b>{intl.formatMessage({ id: 'daptar.print.echawadi2', defaultMessage: 'मागणी निश्चितीनंतर दुरुस्ती' })}</b></td><td><pre style={{ margin: 0, fontFamily: 'inherit', whiteSpace: 'pre-wrap' }}>{getEchawadiRemarkText(2)}</pre></td></tr>
            <tr><td style={{ width: '40%' }}><b>{intl.formatMessage({ id: 'daptar.print.echawadi3', defaultMessage: 'अकृषक दर तपासणी' })}</b></td><td><pre style={{ margin: 0, fontFamily: 'inherit', whiteSpace: 'pre-wrap' }}>{getEchawadiRemarkText(3)}</pre></td></tr>
            <tr><td style={{ width: '40%' }}><b>{intl.formatMessage({ id: 'daptar.print.echawadi4', defaultMessage: 'वसुली बाबत शेरा' })}</b></td><td><pre style={{ margin: 0, fontFamily: 'inherit', whiteSpace: 'pre-wrap' }}>{getEchawadiRemarkText(4)}</pre></td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
});

export default PrintTemplate;