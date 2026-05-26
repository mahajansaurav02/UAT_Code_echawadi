import React, { useState, useRef, useMemo } from 'react';
import { Card, Row, Col, Button, Spin, Alert, Modal, message } from 'antd';
import { PrinterOutlined, CloseOutlined, DownloadOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import html2pdf from 'html2pdf.js';

import moment from 'moment';
import { useIntl, useModel } from 'umi';

import VillageSelector from '@/components/eComponents/VillageSelector';
import URLS from '@/URLs/urls';
import useAxios from '@/components/eComponents/use-axios';

import PrintTemplate from './PrintTemplate';

// --- TABLE STYLES (SCREEN ONLY) ---
const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  marginBottom: '30px',
  border: '1px solid #d9d9d9',
  fontSize: '14px',
};
const thStyle = {
  border: '1px solid #d9d9d9',
  padding: '12px 8px',
  background: '#fafafa',
  fontWeight: 'bold',
  color: '#333',
  textAlign: 'center',
};
const tdStyle = { border: '1px solid #d9d9d9', padding: '10px 8px', textAlign: 'center' };
const tdLeftStyle = { border: '1px solid #d9d9d9', padding: '10px 8px', textAlign: 'left' };
const subTdLeftStyle = {
  border: '1px solid #d9d9d9',
  padding: '10px 8px 10px 50px',
  textAlign: 'left',
};

const idBadgeStyle = {
  background: '#1890ff',
  color: '#fff',
  padding: '4px 10px',
  borderRadius: '4px',
  fontWeight: 'bold',
  display: 'inline-block',
};

const getRemarkTypeLabel = (typeId, intl) => {
  if (typeId === 3) return intl.formatMessage({ id: 'daptar.severity.critical' });
  if (typeId === 2) return intl.formatMessage({ id: 'daptar.severity.high' });
  if (typeId === 1) return intl.formatMessage({ id: 'daptar.severity.normal' });
  return intl.formatMessage({ id: 'daptar.severity.normal' });
};

const getSeverityBadgeStyle = (type, intl) => {
  let bgColor = '#1890ff';
  if (type === intl.formatMessage({ id: 'daptar.severity.critical' })) bgColor = '#f5222d';
  else if (type === intl.formatMessage({ id: 'daptar.severity.high' })) bgColor = '#faad14';
  else if (type === intl.formatMessage({ id: 'daptar.severity.normal' })) bgColor = '#52c41a';
  return {
    background: bgColor,
    color: '#fff',
    padding: '4px 10px',
    borderRadius: '4px',
    fontWeight: 'bold',
    display: 'inline-block',
  };
};

const initialData = {
  tapasaniAdhikariName: localStorage.getItem('fullName') || '-',
  tapasaniAdhikariPadnam: '-',
  tapasaniDinanck: moment().format('DD/MM/YYYY'),
  gramMahsulAdhikariName: '-',
  eHakkArjData: { trutiArjList: [] },
  ehakkaCounts: { 180: 0, '90to180': 0, '30to90': 0, lessThan30: 0 },
  eChawadiData: {
    gawNamunaPurna: { nirank: 0, kamkajPurna: 0, aghoshana: 0 },
    mangniRakkamKamiKhatedar: 0,
    akrushakDarBharlaKay: '-',
    akarbandTapshil: { gawNamunaEk: '-', dyslr: 0 },
  },
  vasuliDetails: {
    jaminMahsul029: { mangni: 0, vasuli: 0, percentage: 0 },
    itarMahsul045: { mangni: 0, vasuli: 0, percentage: 0 },
    uddishtanusar: { mangni: 0, vasuli: 0, percentage: 0 },
  },
  sarvSadharanShera: '-',
  purttatekkaritaMudde: '-',
};

// =====================================================================
// ---> MOCK DATA
// =====================================================================
const MOCK_TESTING_MODE = false;

const getMockInspectionData = (endpoint) => {
  // 1.  (Section A and Modal)
  if (endpoint.includes('/FetchAllFerfarSavedData')) {
    const allFerfarMockData = [
      // 1: Aadesh Ferfar
      {
        mutNo: '101',
        ferfarType: 1,
        remark: 'आदेशानुसार फेरफाराची योग्य नोंद घेतली आहे.',
        typeOfRemark: 1,
      },
      { mutNo: '102', ferfarType: 1, remark: 'मूळ आदेशाची प्रत जोडलेली नाही.', typeOfRemark: 2 },

      // 2:Kalam 155 nusar kelele Ferfar
      {
        mutNo: '205',
        ferfarType: 2,
        remark: 'कलम १५५ नुसार दुरुस्ती योग्य प्रकारे करण्यात आली आहे.',
        typeOfRemark: 1,
      },

      // 3: Itar Ferfar ya template ne kelele Ferfar
      {
        mutNo: '308',
        ferfarType: 3,
        remark: 'टेम्प्लेटमध्ये भरलेली माहिती आणि मूळ दस्तऐवज यात तफावत आहे.',
        typeOfRemark: 2,
      },

      // 4: Tantrik karanastav namanjur kelele Ferfar
      {
        mutNo: '410',
        ferfarType: 4,
        remark: 'सर्व्हर त्रुटीमुळे फेरफार नामंजूर झाला आहे.',
        typeOfRemark: 3,
      },
      {
        mutNo: '411',
        ferfarType: 4,
        remark: 'कागदपत्रे अस्पष्ट असल्याने प्रणालीने नामंजूर केले.',
        typeOfRemark: 3,
      },

      // 5: Re-entry kelele Ferfar
      {
        mutNo: '501',
        ferfarType: 5,
        remark: 'रि-एन्ट्रीची प्रक्रिया यशस्वीरित्या पूर्ण झाली.',
        typeOfRemark: 1,
      },

      // 6: Niyantrit satta prakar aslele
      {
        mutNo: '612',
        ferfarType: 6,
        remark: 'नियंत्रित सत्ता प्रकाराची नोंद घेताना पूर्वपरवानगी घेतलेली नाही.',
        typeOfRemark: 3,
      },

      // 7: Sthagiti aslele Ferfar
      {
        mutNo: '705',
        ferfarType: 7,
        remark: 'मा. न्यायालयाच्या आदेशानुसार या फेरफारास स्थगिती देण्यात आली आहे.',
        typeOfRemark: 2,
      },

      // 8: Template Ferfar
      {
        mutNo: '808',
        ferfarType: 8,
        remark: 'टेंप्लेट फेरफारमध्ये तांत्रिक अडचण येत आहे, कृपया पुन्हा प्रयत्न करा.',
        typeOfRemark: 2,
      },
    ];

    const urlParams = new URLSearchParams(endpoint.split('?')[1]);
    const requestedType = parseInt(urlParams.get('ferFarType'), 10);

    if (requestedType === 0 || isNaN(requestedType)) {
      return allFerfarMockData;
    } else {
      return allFerfarMockData.filter((item) => item.ferfarType === requestedType);
    }
  }

  // 2.(Section B)
  if (endpoint.includes('/getEHakkaTypeFiveDetails')) {
    return [
      { applicationId: '701', remarkType: 'गंभीर', remark: 'कागदपत्रे अपूर्ण आहेत.' },
      { applicationId: '702', remarkType: 'अतीगंभीर', remark: 'चुकीची माहिती दिलेली आहे.' },
    ];
  }

  // 3.(Section B)
  if (endpoint.includes('/getEHakkaApplicationCountDetails')) {
    const urlParams = new URLSearchParams(endpoint.split('?')[1]);
    const eHakkaType = parseInt(urlParams.get('eHakkaType'), 10);

    if (eHakkaType === 1) {
      // Type 1
      return [
        {
          applicationId: '1801',
          remarkType: 'अतीगंभीर',
          remark: '६ महिन्यांपेक्षा जास्त काळ प्रलंबित आहे.',
        },
        { applicationId: '1832', remarkType: 'गंभीर', remark: 'कागदपत्रे गहाळ आहेत.' },
      ];
    } else if (eHakkaType === 2) {
      // Type 2
      return [
        { applicationId: '3903', remarkType: 'गंभीर', remark: 'तलाठी स्तरावर कार्यवाही बाकी आहे.' },
        { applicationId: '2902', remarkType: 'साधारण', remark: 'प्रक्रिया चालू आहे.' },
        { applicationId: '2903', remarkType: 'गंभीर', remark: 'नोंद अपूर्ण आहे.' },
      ];
    } else if (eHakkaType === 3) {
      // Type 3
      return [{ applicationId: '2301', remarkType: 'साधारण', remark: 'अर्ज तपासाधीन आहे.' }];
    } else if (eHakkaType === 4) {
      // Type 4
      return [
        { applicationId: '1112', remarkType: 'साधारण', remark: 'नुकताच प्राप्त झाला आहे.' },
        { applicationId: '1153', remarkType: 'साधारण', remark: 'तपासणी बाकी आहे.' },
        { applicationId: '1102', remarkType: 'साधारण', remark: 'पुढील आठवड्यात काम होईल.' },
        { applicationId: '1103', remarkType: 'साधारण', remark: 'सही बाकी आहे.' },
      ];
    }
    return [];
  }

  // 4.(Section C)
  if (endpoint.includes('/getEchawadiRemark')) {
    return [
      { echawdiType: 1, remark: 'गाव नमुना पूर्ण भरला आहे.' },
      { echawdiType: 2, remark: 'मागणी निश्चितीनंतर दुरुस्ती तपासली.' },
      { echawdiType: 3, remark: 'अकृषक दर योग्य आहे.' },
      { echawdiType: 4, remark: 'वसुली प्रगतीपथावर आहे.' },
      { echawdiType: 5, remark: 'गाव नमुना एक तपासला.' },
      { echawdiType: 6, remark: 'Dyslr आकारबंद वगळलेले नाहीत.' },
    ];
  }

  // 5.(Section C)
  if (endpoint.includes('/getNirankCounts')) {
    return { nirankYesCount: 15, completedYesCount: 42, completedNoNirankNoCount: 5 };
  }
  if (endpoint.includes('/getMaganiDurustiKhatedarCount')) {
    return { maganiDurustiKhatedarCount: 9 };
  }
  if (endpoint.includes('/getAkrushakDar')) {
    return [{ declaration: 'Y', nprate: 12.5, mnparate: 0, tenpaise: 0, fivepaise: 0 }];
  }
  if (endpoint.includes('/getDyslrAkarbandDeletedCount')) {
    return { dyslrAkarbandDeletedCount: 4 };
  }
  if (endpoint.includes('/getDyslrDurustiCount')) {
    return { dyslrDurustiCount: 7 };
  }

  // 6. (Section D)
  if (endpoint.includes('/getTotalVasuliForReport')) {
    return {
      totalDemand: 150000,
      totalCollected: 120000,
      totalEgsDemand: 25000,
      totalEgsCollected: 20000,
      totalEduCessDemand: 15000,
      totalEduCessCollected: 15000,
    };
  }
  if (endpoint.includes('/getTargetAndSankirnDemandForInspection')) {
    return { annualVillageTarget: 200000, grandTotal: 180000 };
  }

  return null;
};
// =====================================================================

const InspectionReport = () => {
  const intl = useIntl();
  const { districtCode, talukaCode, revenueYear: modelRevenueYear } = useModel('details');

  const [showTable, setShowTable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const printRef = useRef();
  const history = useHistory();
  const { sendRequest } = useAxios();

  const [codeVillage, setCodeVillage] = useState('');
  const [textForVillage, setTextForVillage] = useState();
  const [isNirank, setIsNirank] = useState(false);

  const [apiData, setApiData] = useState(initialData);
  const [allFerfarList, setAllFerfarList] = useState([]);

  const [printData, setPrintData] = useState({
    echawadi: [],
    ehakkTruti: [],
    ehakkPending: [],
  });

  const [showAbhiprayModal, setShowAbhiprayModal] = useState(false);
  const [modalType, setModalType] = useState('ferfar');
  const [activeRemarkData, setActiveRemarkData] = useState([]);
  const [isLoadingRemark, setIsLoadingRemark] = useState(false);
  const [modalTitleKey, setModalTitleKey] = useState('daptar.modal.remarkTitle');
  const [remarkText, setRemarkText] = useState('');
  const [isRemarkSubmitted, setIsRemarkSubmitted] = useState(false);

  const getAuthParams = () => {
    let rYear = '2025-26';
    try {
      if (modelRevenueYear && modelRevenueYear !== 'undefined' && modelRevenueYear !== 'null') {
        rYear = modelRevenueYear;
      } else {
        const storedYear = localStorage.getItem('revenueYear');
        if (storedYear && storedYear !== 'undefined' && storedYear !== 'null') {
          rYear = storedYear;
        } else {
          const userStr = localStorage.getItem('user');
          if (userStr) {
            const userObj = JSON.parse(userStr);
            if (userObj?.revenueYear?.[0]?.revenueYear) rYear = userObj.revenueYear[0].revenueYear;
          }
        }
      }
    } catch (e) {
      console.error('Error reading revenueYear', e);
    }
    return { dCode: districtCode || '', tCode: talukaCode || '', rYear };
  };

  const handleSaveRemark = () => {
    if (!remarkText.trim()) {
      message.warning('कृपया शेरा लिहा!');
      return;
    }

    const currentServarthId = localStorage.getItem('servarthId') || '';

    const payload = {
      ccode: codeVillage,
      remark: remarkText,
      designation: 'Talathi',
      servarthId: currentServarthId,
      inspectionOfficerUsername: currentServarthId,
    };

    const hideMsg = message.loading('अभिप्राय जतन होत आहे...', 0);

    // --- MOCK TESTING MODE ---
    if (MOCK_TESTING_MODE) {
      setTimeout(() => {
        hideMsg();
        message.success('अभिप्राय यशस्वीरित्या जतन केला!');
        setIsRemarkSubmitted(true);
      }, 800);
      return;
    }
    // -------------------------

    sendRequest(
      `${URLS.BaseURL}/inpsection/saveTalathiRemark`,
      'POST',
      payload,
      (res) => {
        hideMsg();
        console.log('🔥 API Response:', res);
        message.success('अभिप्राय यशस्वीरित्या जतन केला!');

        setRemarkText('');
        setIsRemarkSubmitted(true);

        // @modification: Added page auto-refresh after successful remark submission
        // to ensure the latest Inspector Officer updates and states reflect correctly on the next screen.
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      },
      (err) => {
        hideMsg();
        console.error('❌ API Error:', err);
        message.error('अभिप्राय जतन करताना त्रुटी आली. कृपया पुन्हा प्रयत्न करा.');
      },
    );
  };

  const handleDownloadPDF = () => {
    if (!printRef.current) {
      message.error(
        intl.formatMessage({
          id: 'daptar.msg.pdfError',
          defaultMessage: 'रिपोर्ट तैयार नहीं है। कृपया पहले डेटा लोड करें।',
        }),
      );
      return;
    }

    setIsDownloading(true);
    const hideMsg = message.loading(
      intl.formatMessage({
        id: 'daptar.msg.generatingPDF',
        defaultMessage: 'PDF तैयार किया जा रहा है...',
      }),
      0,
    );

    const element = printRef.current;
    const safeVillageName = textForVillage ? textForVillage.replace(/[\s\/\\]+/g, '_') : 'Village';
    const fileName = `Inspection_Report_${safeVillageName}_${moment().format('DD-MM-YYYY')}.pdf`;

    const opt = {
      margin: 10,
      filename: fileName,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, windowWidth: 1024 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['css', 'legacy'] },
    };

    html2pdf()
      .set(opt)
      .from(element)
      .save()
      .then(() => {
        hideMsg();
        setIsDownloading(false);
        message.success(
          intl.formatMessage({
            id: 'daptar.msg.pdfSuccess',
            defaultMessage: 'PDF सफलतापूर्वक डाउनलोड हुआ!',
          }),
        );
      })
      .catch((error) => {
        console.error('PDF Generation Error:', error);
        hideMsg();
        setIsDownloading(false);
        message.error(
          intl.formatMessage({
            id: 'daptar.msg.pdfGenerationError',
            defaultMessage: 'PDF तैयार करने में त्रुटि आई।',
          }),
        );
      });
  };

  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  const sortedRemarkData = useMemo(() => {
    let sortableItems = [...activeRemarkData];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        let valA, valB;
        if (sortConfig.key === 'id') {
          valA = a.id || a.mutNo || 0;
          valB = b.id || b.mutNo || 0;
        } else if (sortConfig.key === 'pendingType') {
          valA = a.pendingType || a.duration || '';
          valB = b.pendingType || b.duration || '';
        } else if (sortConfig.key === 'typeOfRemark') {
          valA = a.typeOfRemark || 0;
          valB = b.typeOfRemark || 0;
        } else if (sortConfig.key === 'remark') {
          valA = a.remark || a.shera || '';
          valB = b.remark || b.shera || '';
        }
        if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [activeRemarkData, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') direction = 'descending';
    setSortConfig({ key, direction });
  };

  const backToHomeButton = () => {
    history.push({ pathname: '/homepage' });
  };

  const handlePrint = useReactToPrint({ content: () => printRef.current });

  const ferfarTypeLabel = {
    1: intl.formatMessage({ id: 'daptar.ferfar.type1' }),
    2: intl.formatMessage({ id: 'daptar.ferfar.type2' }),
    3: intl.formatMessage({ id: 'daptar.ferfar.type3' }),
    4: intl.formatMessage({ id: 'daptar.ferfar.type4' }),
    5: intl.formatMessage({ id: 'daptar.ferfar.type5' }),
    6: intl.formatMessage({ id: 'daptar.ferfar.type6' }),
    7: intl.formatMessage({ id: 'daptar.ferfar.type7' }),
    8: intl.formatMessage({ id: 'daptar.ferfar.type8' }),
  };

  const sequentialFerfarList = useMemo(() => {
    const map = new Map();
    Object.keys(ferfarTypeLabel).forEach((key) => map.set(Number(key), []));

    // Array.isArray safety check protects against bad data mapping
    if (Array.isArray(allFerfarList)) {
      allFerfarList.forEach((item) => {
        if (item && item.ferfarType && item.mutNo) map.get(item.ferfarType).push(item.mutNo);
      });
    }

    return Object.keys(ferfarTypeLabel).map((type) => {
      const typeId = Number(type);
      const uniqueMutNos = [...new Set(map.get(typeId) || [])];
      return { ferfarType: typeId, mutNos: uniqueMutNos };
    });
  }, [allFerfarList, ferfarTypeLabel]);

  // =====================================================================
  // ---> DATA FETCHER <---
  // =====================================================================
  const fetchApiData = (endpoint) => {
    return new Promise((resolve, reject) => {
      // --- MOCK INTERCEPTOR ---
      if (MOCK_TESTING_MODE) {
        const mockData = getMockInspectionData(endpoint);
        if (mockData !== null) {
          console.log(`[TESTING] Mocking API: ${endpoint}`);
          setTimeout(() => resolve(mockData), 400);
          return;
        }
      }
      // ------------------------

      sendRequest(
        `${URLS.BaseURL}${endpoint}`,
        'GET',
        null,
        (res) => resolve(res.data),
        (err) => reject(err),
      );
    });
  };
  // =====================================================================

  const handleGetData = async () => {
    if (!codeVillage) {
      message.info(intl.formatMessage({ id: 'daptar.msg.selectVillage' }));
      return;
    }
    setLoading(true);
    setShowTable(false);

    const { dCode, tCode, rYear } = getAuthParams();
    let getRevenueYear = Array.isArray(rYear) ? rYear[0]?.revenueYear : rYear;

    try {
      const ferfarData = await fetchApiData(
        `/inpsection/FetchAllFerfarSavedData?ccode=${codeVillage}&districtCode=${dCode}&talukaCode=${tCode}&revenueYear=${getRevenueYear}&activeFlag=Y&ferFarType=0`,
      ).catch(() => []);
      // SAFETY NET: Forces ferfarData to be an array so PrintTemplate.jsx never crashes on .filter()
      setAllFerfarList(Array.isArray(ferfarData) ? ferfarData : []);

      const trutiData = await fetchApiData(
        `/inpsection/getEHakkaTypeFiveDetails?ccode=${codeVillage}&districtCode=${dCode}&talukaCode=${tCode}`,
      ).catch(() => []);
      // SAFETY NET: Array check before filter/map
      const safeTrutiData = Array.isArray(trutiData) ? trutiData : [];
      const trutiArjList = safeTrutiData
        .filter((item) => item.applicationId !== null)
        .map((item) => item.applicationId);

      const ehakkTypes = [1, 2, 3, 4];
      const ehakkaCountsRes = await Promise.all(
        ehakkTypes.map((t) =>
          fetchApiData(
            `/inpsection/getEHakkaApplicationCountDetails?ccode=${codeVillage}&districtCode=${dCode}&talukaCode=${tCode}&eHakkaType=${t}`,
          ).catch(() => []),
        ),
      );
      const ehakkaCounts = {
        180: ehakkaCountsRes[0]?.length || 0,
        '90to180': ehakkaCountsRes[1]?.length || 0,
        '30to90': ehakkaCountsRes[2]?.length || 0,
        lessThan30: ehakkaCountsRes[3]?.length || 0,
      };

      const echawadiRemarkData = await fetchApiData(
        `/inpsection/getEchawadiRemark?districtCode=${dCode}&talukaCode=${tCode}&ccode=${codeVillage}`,
      ).catch(() => []);

      setPrintData({
        // SAFETY NETS: Guarantee these are arrays for the PrintTemplate
        echawadi: Array.isArray(echawadiRemarkData) ? echawadiRemarkData : [],
        ehakkTruti: safeTrutiData,
        ehakkPending: Array.isArray(ehakkaCountsRes) ? ehakkaCountsRes : [],
      });

      const nirankData = await fetchApiData(
        `/inpsection/getNirankCounts?ccode=${codeVillage}&revenueYear=${getRevenueYear}`,
      ).catch(() => ({}));
      const maganiData = await fetchApiData(
        `/inpsection/getMaganiDurustiKhatedarCount?ccode=${codeVillage}&revenueYear=${getRevenueYear}`,
      ).catch(() => ({}));
      const akrushakDataArray = await fetchApiData(
        `/inpsection/getAkrushakDar?ccode=${codeVillage}`,
      ).catch(() => []);
      const akrushakData =
        Array.isArray(akrushakDataArray) && akrushakDataArray.length > 0
          ? akrushakDataArray[0]
          : null;

      let akrushakStatus = akrushakData || '-';

      const dyslrData = await fetchApiData(
        `/inpsection/getDyslrAkarbandDeletedCount?ccode=${codeVillage}&revenueYear=${getRevenueYear}`,
      ).catch(() => ({}));
      const gawNamunaEkData = await fetchApiData(
        `/inpsection/getDyslrDurustiCount?ccode=${codeVillage}&revenueYear=${getRevenueYear}`,
      ).catch(() => ({}));
      const vasuliData = await fetchApiData(
        `/inpsection/getTotalVasuliForReport?revenueYear=${getRevenueYear}&ccode=${codeVillage}`,
      ).catch(() => ({}));
      const targetData = await fetchApiData(
        `/inpsection/getTargetAndSankirnDemandForInspection?revenueYear=${getRevenueYear}&ccode=${codeVillage}`,
      ).catch(() => ({}));

      // ------ TALATHI SHERA CHECK ------
      const remarkHistory = await fetchApiData(
        `/inpsection/getTalathiRemarkInspection?revenueYear=${getRevenueYear}&ccode=${codeVillage}`,
      ).catch(() => []);

      // @modification: Checked if 'Talathi' has EVER submitted a remark in the history array.
      // If yes, disable the remark box permanently, preventing it from re-enabling when the Inspector Officer replies.
      if (Array.isArray(remarkHistory) && remarkHistory.length > 0) {
        const hasTalathiReplied = remarkHistory.some(
          (remark) =>
            (remark.designation && remark.designation.toLowerCase() === 'talathi') ||
            (remark.role && remark.role.toLowerCase() === 'talathi'),
        );

        setIsRemarkSubmitted(hasTalathiReplied);
      } else {
        setIsRemarkSubmitted(false);
      }

      // ------

      const jaminDemand = Number(vasuliData?.totalDemand) || 0;
      const jaminCollected = Number(vasuliData?.totalCollected) || 0;
      const jaminPercentage = jaminDemand ? ((jaminCollected / jaminDemand) * 100).toFixed(2) : 0;

      const itarDemand =
        (Number(vasuliData?.totalEgsDemand) || 0) + (Number(vasuliData?.totalEduCessDemand) || 0);
      const itarCollected =
        (Number(vasuliData?.totalEgsCollected) || 0) +
        (Number(vasuliData?.totalEduCessCollected) || 0);
      const itarPercentage = itarDemand ? ((itarCollected / itarDemand) * 100).toFixed(2) : 0;

      const targetMangni = Number(targetData?.annualVillageTarget) || 0;
      const targetVasuli = Number(targetData?.grandTotal) || 0;
      const targetPercentage = targetMangni ? ((targetVasuli / targetMangni) * 100).toFixed(2) : 0;

      setApiData((prev) => ({
        ...prev,
        tapasaniAdhikariName: localStorage.getItem('fullName') || '-',
        eHakkArjData: { trutiArjList: trutiArjList },
        ehakkaCounts: ehakkaCounts,
        eChawadiData: {
          gawNamunaPurna: {
            nirank: nirankData?.nirankYesCount || 0,
            kamkajPurna: nirankData?.completedYesCount || 0,
            aghoshana: nirankData?.completedNoNirankNoCount || 0,
          },
          mangniRakkamKamiKhatedar: maganiData?.maganiDurustiKhatedarCount || 0,
          akrushakDarBharlaKay: akrushakStatus,
          akarbandTapshil: {
            gawNamunaEk: gawNamunaEkData?.dyslrDurustiCount || gawNamunaEkData?.count || 0,
            dyslr: dyslrData?.dyslrAkarbandDeletedCount || dyslrData?.count || 0,
          },
        },
        vasuliDetails: {
          jaminMahsul029: {
            mangni: jaminDemand,
            vasuli: jaminCollected,
            percentage: jaminPercentage,
          },
          itarMahsul045: { mangni: itarDemand, vasuli: itarCollected, percentage: itarPercentage },
          uddishtanusar: {
            mangni: targetMangni,
            vasuli: targetVasuli,
            percentage: targetPercentage,
          },
        },
      }));

      message.success(intl.formatMessage({ id: 'daptar.msg.dataSuccess' }));
      setShowTable(true);
    } catch (error) {
      console.error('Error fetching data:', error);
      message.error(intl.formatMessage({ id: 'daptar.msg.dataError' }));
    } finally {
      setLoading(false);
    }
  };

  const openAbhiprayModal = async (type, kramank = 0, titleKey = 'daptar.modal.remarkTitle') => {
    setModalType(type);
    setModalTitleKey(titleKey);
    setShowAbhiprayModal(true);
    setIsLoadingRemark(true);
    setActiveRemarkData([]);
    setSortConfig({ key: null, direction: 'ascending' });

    const { dCode, tCode, rYear } = getAuthParams();
    try {
      if (type === 'ferfar' && kramank !== 0) {
        const data = await fetchApiData(
          `/inpsection/FetchAllFerfarSavedData?ccode=${codeVillage}&districtCode=${dCode}&talukaCode=${tCode}&revenueYear=${rYear}&activeFlag=Y&ferFarType=${kramank}`,
        );
        // SAFETY NET
        setActiveRemarkData(Array.isArray(data) ? data : []);
      } else if (type === 'echawadi') {
        const data = await fetchApiData(
          `/inpsection/getEchawadiRemark?districtCode=${dCode}&talukaCode=${tCode}&ccode=${codeVillage}`,
        );
        // SAFETY NET
        setActiveRemarkData(
          (Array.isArray(data) ? data : []).filter((item) => item.echawdiType === kramank),
        );
      } else if (type === 'ehakk_truti') {
        const data = await fetchApiData(
          `/inpsection/getEHakkaTypeFiveDetails?ccode=${codeVillage}&districtCode=${dCode}&talukaCode=${tCode}`,
        );
        // SAFETY NET
        setActiveRemarkData(
          (Array.isArray(data) ? data : [])
            .filter((item) => item.applicationId !== null)
            .map((item) => ({
              id: item.applicationId,
              typeOfRemark: item.remarkType == 'गंभीर' ? 1 : item.remarkType == 'अतीगंभीर' ? 3 : 2,
              remark: item.remark,
            })),
        );
      } else if (type === 'ehakk_pending') {
        const types = [1, 2, 3, 4];
        const labels = {
          1: '१८० दिवसापेक्षा जास्त दिवस प्रलंबित',
          2: '९० ते १८० दिवसातील प्रलंबित',
          3: '३० ते ९० दिवसातील प्रलंबित',
          4: '३० दिवसा पेक्षा कमी दिवस प्रलंबित',
        };
        const responses = await Promise.all(
          types.map((t) =>
            fetchApiData(
              `/inpsection/getEHakkaApplicationCountDetails?ccode=${codeVillage}&districtCode=${dCode}&talukaCode=${tCode}&eHakkaType=${t}`,
            ),
          ),
        );
        let allPralambit = [];
        responses.forEach((data, index) => {
          // SAFETY NET inside loop
          allPralambit.push(
            ...(Array.isArray(data) ? data : []).map((item) => ({
              id: item.applicationId,
              pendingType: labels[types[index]],
              typeOfRemark: item.remarkType == 'गंभीर' ? 1 : item.remarkType == 'अतीगंभीर' ? 3 : 2,
              remark: item.remark,
            })),
          );
        });
        setActiveRemarkData(allPralambit);
      }
    } catch (err) {
      message.error(intl.formatMessage({ id: 'daptar.msg.remarkError' }));
    } finally {
      setIsLoadingRemark(false);
    }
  };

  const totalDemandAll =
    apiData.vasuliDetails.jaminMahsul029.mangni +
    apiData.vasuliDetails.itarMahsul045.mangni +
    apiData.vasuliDetails.uddishtanusar.mangni;
  const totalCollectedAll =
    apiData.vasuliDetails.jaminMahsul029.vasuli +
    apiData.vasuliDetails.itarMahsul045.vasuli +
    apiData.vasuliDetails.uddishtanusar.vasuli;
  const totalPercentageAll = totalDemandAll
    ? ((totalCollectedAll / totalDemandAll) * 100).toFixed(2)
    : 0;

  // --- BILINGUAL AKRUSHAK DAR FORMATTER FOR SCREEN ---
  const getAkrushakStatusText = (akrushakData) => {
    if (!akrushakData || akrushakData === '-') return '-';
    if (typeof akrushakData === 'string') return akrushakData;

    const declarationText =
      akrushakData.declaration === 'N'
        ? intl.formatMessage({ id: 'daptar.no', defaultMessage: 'नाही' })
        : intl.formatMessage({ id: 'daptar.yes', defaultMessage: 'होय' });

    let rateText = '-';
    const rupee = intl.formatMessage({ id: 'daptar.rupee', defaultMessage: 'रुपये' });
    const paise = intl.formatMessage({ id: 'daptar.paise', defaultMessage: 'पैसे' });

    if (akrushakData.nprate > 0) rateText = `${akrushakData.nprate} ${rupee}`;
    else if (akrushakData.mnparate > 0) rateText = `${akrushakData.mnparate} ${rupee}`;
    else if (akrushakData.tenpaise > 0) rateText = `${akrushakData.tenpaise} ${paise}`;
    else if (akrushakData.fivepaise > 0) rateText = `${akrushakData.fivepaise} ${paise}`;

    const rateLabel = intl.formatMessage({
      id: 'daptar.ratePerSqM',
      defaultMessage: 'दर (प्रति चौ.मी)',
    });

    return `${declarationText} (${rateLabel}: ${rateText})`;
  };

  return (
    <div>
      {/* Search Header */}
      <Card className="shadow-sm mb-4">
        <Row justify="space-between" align="middle" style={{ marginBottom: '20px' }}>
          <Col span={8}></Col>
          <Col span={8} style={{ textAlign: 'center' }}>
            <h2>
              <b>{intl.formatMessage({ id: 'daptar.title' })}</b>
            </h2>
          </Col>
          <Col span={8} style={{ textAlign: 'right' }}>
            <Button onClick={backToHomeButton} type="primary">
              {intl.formatMessage({ id: 'daptar.btn.home' })}
            </Button>
          </Col>
        </Row>
        <div style={{ padding: 10 }}>
          <VillageSelector
            pageType="withoutYear"
            setCodeVillage={setCodeVillage}
            setTextForVillage={setTextForVillage}
            setIsNirank={setIsNirank}
            onVillageChange={() => setShowTable(false)}
          />
          {!isNirank && (
            <Button type="primary" onClick={handleGetData} style={{ marginTop: '15px' }}>
              {intl.formatMessage({ id: 'daptar.btn.getData' })}
            </Button>
          )}
          {loading && (
            <Col span={24} style={{ textAlign: 'center', marginTop: '20px' }}>
              <Spin size="large" />
            </Col>
          )}
        </div>
      </Card>

      {!showTable && !loading ? (
        <Alert
          message={intl.formatMessage({ id: 'daptar.alert.getData' })}
          type="info"
          showIcon
          style={{ border: '1px dashed' }}
        />
      ) : showTable ? (
        <div style={{ padding: '13px' }}>
          {/* ===================== HIDDEN PRINT COMPONENT ===================== */}
          <div
            style={{
              position: 'absolute',
              top: '-10000px',
              left: '-10000px',
              width: '210mm',
              backgroundColor: '#fff',
            }}
          >
            <PrintTemplate
              ref={printRef}
              village={textForVillage}
              data={apiData}
              sequentialFerfarList={sequentialFerfarList}
              allFerfarList={allFerfarList}
              printData={printData}
              ferfarTypeLabel={ferfarTypeLabel}
              intl={intl}
            />
          </div>

          {/* ===================== SCREEN COMPONENT ===================== */}
          <div className="report" style={{ background: '#fff', padding: '20px' }}>
            <div
              id="daptar-table-to-xls"
              style={{ overflowX: 'auto', fontFamily: 'Arial, sans-serif' }}
            >
              <div style={{ textAlign: 'center', color: 'red', marginBottom: '20px' }}>
                <h2>
                  <b>{intl.formatMessage({ id: 'daptar.title' })}</b>
                </h2>
              </div>
              <table style={{ width: '100%', marginBottom: '20px', border: 'none' }}>
                <tbody>
                  <tr>
                    <td style={{ textAlign: 'left', padding: '5px' }}>
                      <p>
                        <strong>{intl.formatMessage({ id: 'daptar.officerNameDesig' })}:</strong>{' '}
                        {apiData.tapasaniAdhikariName} ({apiData.tapasaniAdhikariPadnam})
                      </p>
                      <p>
                        <strong>{intl.formatMessage({ id: 'daptar.sajaName' })}:</strong>{' '}
                        {textForVillage || '—'}
                      </p>
                      <p>
                        <strong>{intl.formatMessage({ id: 'daptar.villageName' })}:</strong>{' '}
                        {textForVillage || '—'}
                      </p>
                    </td>
                    <td style={{ textAlign: 'left', padding: '5px' }}>
                      <p>
                        <strong>{intl.formatMessage({ id: 'daptar.inspectionDate' })}:</strong>{' '}
                        {apiData.tapasaniDinanck}
                      </p>
                      <p>
                        <strong>{intl.formatMessage({ id: 'daptar.gramRevenueOfficer' })}:</strong>{' '}
                        {apiData.gramMahsulAdhikariName}
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
              <hr style={{ borderTop: '1px solid #ccc', marginBottom: '20px' }} />

              <h3 style={{ color: '#1890ff', marginTop: '30px' }}>
                <b>{intl.formatMessage({ id: 'daptar.secA.title' })}</b>
              </h3>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={{ ...thStyle, width: '5%' }}>
                      {intl.formatMessage({ id: 'daptar.table.srNo' })}
                    </th>
                    <th style={thStyle}>{intl.formatMessage({ id: 'daptar.table.details' })}</th>
                    <th style={thStyle}>{intl.formatMessage({ id: 'daptar.table.ferfarNo' })}</th>
                    <th style={{ ...thStyle, width: '15%' }}>
                      {intl.formatMessage({ id: 'daptar.table.remark' })}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sequentialFerfarList.map((item, index) => (
                    <tr key={index}>
                      <td style={tdStyle}>{index + 1}</td>
                      <td style={tdLeftStyle}>{ferfarTypeLabel[item.ferfarType]}</td>
                      <td style={tdStyle}>
                        <b>{item.mutNos.length > 0 ? item.mutNos.join(', ') : '-'}</b>
                      </td>
                      <td style={tdStyle}>
                        <Button
                          size="small"
                          type="primary"
                          disabled={item.mutNos.length === 0}
                          onClick={() =>
                            openAbhiprayModal(
                              'ferfar',
                              item.ferfarType,
                              'daptar.modal.title.ferfar',
                            )
                          }
                        >
                          {intl.formatMessage({ id: 'daptar.btn.viewRemark' })}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <h3 style={{ color: '#1890ff', marginTop: '30px' }}>
                <b>{intl.formatMessage({ id: 'daptar.secB.title' })}</b>
              </h3>
              <p style={{ fontWeight: 'bold', marginBottom: '10px' }}>
                {intl.formatMessage({ id: 'daptar.secB.q1' })}{' '}
                {apiData.eHakkArjData.trutiArjList.length}
              </p>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={{ ...thStyle, width: '30%' }}>
                      {intl.formatMessage({ id: 'daptar.table.details' })}
                    </th>
                    <th style={thStyle}>{intl.formatMessage({ id: 'daptar.table.arjNo' })}</th>
                    <th style={{ ...thStyle, width: '15%' }}>
                      {intl.formatMessage({ id: 'daptar.table.remark' })}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={tdLeftStyle}>{intl.formatMessage({ id: 'daptar.secB.row1' })}</td>
                    <td style={{ ...tdLeftStyle, lineHeight: '1.8' }}>
                      {apiData.eHakkArjData.trutiArjList.length > 0
                        ? apiData.eHakkArjData.trutiArjList.join(', ')
                        : '-'}
                    </td>
                    <td style={tdStyle}>
                      <Button
                        size="small"
                        type="primary"
                        onClick={() =>
                          openAbhiprayModal('ehakk_truti', 0, 'daptar.modal.title.ehakk1')
                        }
                      >
                        {intl.formatMessage({ id: 'daptar.btn.viewRemark' })}
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>

              <p style={{ fontWeight: 'bold', marginTop: '20px', marginBottom: '10px' }}>
                {intl.formatMessage({ id: 'daptar.secB.q2' })}
              </p>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>{intl.formatMessage({ id: 'daptar.secB.gt180' })}</th>
                    <th style={thStyle}>{intl.formatMessage({ id: 'daptar.secB.90to180' })}</th>
                    <th style={thStyle}>{intl.formatMessage({ id: 'daptar.secB.30to90' })}</th>
                    <th style={thStyle}>{intl.formatMessage({ id: 'daptar.secB.lt30' })}</th>
                    <th style={{ ...thStyle, width: '15%' }}>
                      {intl.formatMessage({ id: 'daptar.table.remark' })}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={tdStyle}>
                      <b>{apiData.ehakkaCounts['180']}</b>
                    </td>
                    <td style={tdStyle}>
                      <b>{apiData.ehakkaCounts['90to180']}</b>
                    </td>
                    <td style={tdStyle}>
                      <b>{apiData.ehakkaCounts['30to90']}</b>
                    </td>
                    <td style={tdStyle}>
                      <b>{apiData.ehakkaCounts['lessThan30']}</b>
                    </td>
                    <td style={tdStyle}>
                      <Button
                        size="small"
                        type="primary"
                        onClick={() =>
                          openAbhiprayModal('ehakk_pending', 0, 'daptar.modal.title.ehakk2')
                        }
                      >
                        {intl.formatMessage({ id: 'daptar.btn.viewRemark' })}
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>

              <h3 style={{ color: '#1890ff', marginTop: '30px' }}>
                <b>{intl.formatMessage({ id: 'daptar.secC.title' })}</b>
              </h3>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={{ ...thStyle, width: '5%' }}>
                      {intl.formatMessage({ id: 'daptar.table.srNo' })}
                    </th>
                    <th style={thStyle}>{intl.formatMessage({ id: 'daptar.table.details' })}</th>
                    <th style={{ ...thStyle, width: '15%' }}>
                      {intl.formatMessage({ id: 'daptar.table.count' })}
                    </th>
                    <th style={{ ...thStyle, width: '15%' }}>
                      {intl.formatMessage({ id: 'daptar.table.remark' })}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ background: '#f9f9f9' }}>
                    <td style={tdStyle}>
                      <b>१.</b>
                    </td>
                    <td style={tdLeftStyle}>
                      <b>{intl.formatMessage({ id: 'daptar.secC.q1' })}</b>
                    </td>
                    <td style={tdStyle}></td>
                    <td style={tdStyle}></td>
                  </tr>
                  <tr>
                    <td style={tdStyle}></td>
                    <td style={subTdLeftStyle}>{intl.formatMessage({ id: 'daptar.secC.q1.1' })}</td>
                    <td style={tdStyle}>{apiData.eChawadiData.gawNamunaPurna.nirank}</td>
                    <td style={tdStyle}></td>
                  </tr>
                  <tr>
                    <td style={tdStyle}></td>
                    <td style={subTdLeftStyle}>{intl.formatMessage({ id: 'daptar.secC.q1.2' })}</td>
                    <td style={tdStyle}>{apiData.eChawadiData.gawNamunaPurna.kamkajPurna}</td>
                    <td style={tdStyle}>
                      <Button
                        size="small"
                        type="primary"
                        onClick={() =>
                          openAbhiprayModal('echawadi', 1, 'daptar.modal.title.echawadi')
                        }
                      >
                        {intl.formatMessage({ id: 'daptar.btn.viewRemark' })}
                      </Button>
                    </td>
                  </tr>
                  <tr>
                    <td style={tdStyle}></td>
                    <td style={subTdLeftStyle}>{intl.formatMessage({ id: 'daptar.secC.q1.3' })}</td>
                    <td style={tdStyle}>{apiData.eChawadiData.gawNamunaPurna.aghoshana}</td>
                    <td style={tdStyle}></td>
                  </tr>
                  <tr>
                    <td style={tdStyle}>
                      <b>२.</b>
                    </td>
                    <td style={tdLeftStyle}>
                      <b>{intl.formatMessage({ id: 'daptar.secC.q2' })}</b>
                    </td>
                    <td style={tdStyle}>{apiData.eChawadiData.mangniRakkamKamiKhatedar}</td>
                    <td style={tdStyle}>
                      <Button
                        size="small"
                        type="primary"
                        onClick={() =>
                          openAbhiprayModal('echawadi', 2, 'daptar.modal.title.echawadi')
                        }
                      >
                        {intl.formatMessage({ id: 'daptar.btn.viewRemark' })}
                      </Button>
                    </td>
                  </tr>

                  <tr>
                    <td style={tdStyle}>
                      <b>३.</b>
                    </td>
                    <td style={tdLeftStyle}>
                      <b>{intl.formatMessage({ id: 'daptar.secC.q3' })}</b>
                    </td>
                    <td style={tdStyle}>
                      {getAkrushakStatusText(apiData.eChawadiData.akrushakDarBharlaKay)}
                    </td>
                    <td style={tdStyle}>
                      <Button
                        size="small"
                        type="primary"
                        onClick={() =>
                          openAbhiprayModal('echawadi', 3, 'daptar.modal.title.echawadi')
                        }
                      >
                        {intl.formatMessage({ id: 'daptar.btn.viewRemark' })}
                      </Button>
                    </td>
                  </tr>

                  <tr style={{ background: '#f9f9f9' }}>
                    <td style={tdStyle}>
                      <b>४.</b>
                    </td>
                    <td style={tdLeftStyle}>
                      <b>{intl.formatMessage({ id: 'daptar.secC.q4' })}</b>
                    </td>
                    <td style={tdStyle}></td>
                    <td style={tdStyle}></td>
                  </tr>
                  <tr>
                    <td style={tdStyle}></td>
                    <td style={subTdLeftStyle}>{intl.formatMessage({ id: 'daptar.secC.q4.1' })}</td>
                    <td style={tdStyle}>{apiData.eChawadiData.akarbandTapshil.gawNamunaEk}</td>
                    <td style={tdStyle}>
                      <Button
                        size="small"
                        type="primary"
                        onClick={() =>
                          openAbhiprayModal('echawadi', 5, 'daptar.modal.title.echawadi')
                        }
                      >
                        {intl.formatMessage({ id: 'daptar.btn.viewRemark' })}
                      </Button>
                    </td>
                  </tr>
                  <tr>
                    <td style={tdStyle}></td>
                    <td style={subTdLeftStyle}>{intl.formatMessage({ id: 'daptar.secC.q4.2' })}</td>
                    <td style={tdStyle}>{apiData.eChawadiData.akarbandTapshil.dyslr}</td>
                    <td style={tdStyle}>
                      <Button
                        size="small"
                        type="primary"
                        onClick={() =>
                          openAbhiprayModal('echawadi', 6, 'daptar.modal.title.echawadi')
                        }
                      >
                        {intl.formatMessage({ id: 'daptar.btn.viewRemark' })}
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>

              <h3 style={{ color: '#1890ff', marginTop: '30px' }}>
                <b>{intl.formatMessage({ id: 'daptar.secD.title' })}</b>
              </h3>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>{intl.formatMessage({ id: 'daptar.table.details' })}</th>
                    <th style={thStyle}>{intl.formatMessage({ id: 'daptar.table.demand' })}</th>
                    <th style={thStyle}>{intl.formatMessage({ id: 'daptar.table.recovery' })}</th>
                    <th style={thStyle}>{intl.formatMessage({ id: 'daptar.table.percentage' })}</th>
                    <th style={{ ...thStyle, width: '15%' }}>
                      {intl.formatMessage({ id: 'daptar.table.remark' })}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={tdLeftStyle}>{intl.formatMessage({ id: 'daptar.secD.row1' })}</td>
                    <td style={tdStyle}>{apiData.vasuliDetails.jaminMahsul029.mangni}</td>
                    <td style={tdStyle}>{apiData.vasuliDetails.jaminMahsul029.vasuli}</td>
                    <td style={tdStyle}>{apiData.vasuliDetails.jaminMahsul029.percentage}%</td>
                    <td style={tdStyle} rowSpan="3">
                      <Button
                        size="small"
                        type="primary"
                        onClick={() =>
                          openAbhiprayModal('echawadi', 4, 'daptar.modal.title.vasuli')
                        }
                      >
                        {intl.formatMessage({ id: 'daptar.btn.viewRemark' })}
                      </Button>
                    </td>
                  </tr>
                  <tr>
                    <td style={tdLeftStyle}>{intl.formatMessage({ id: 'daptar.secD.row2' })}</td>
                    <td style={tdStyle}>{apiData.vasuliDetails.itarMahsul045.mangni}</td>
                    <td style={tdStyle}>{apiData.vasuliDetails.itarMahsul045.vasuli}</td>
                    <td style={tdStyle}>{apiData.vasuliDetails.itarMahsul045.percentage}%</td>
                  </tr>
                  <tr>
                    <td style={tdLeftStyle}>{intl.formatMessage({ id: 'daptar.secD.row3' })}</td>
                    <td style={tdStyle}>{apiData.vasuliDetails.uddishtanusar.mangni}</td>
                    <td style={tdStyle}>{apiData.vasuliDetails.uddishtanusar.vasuli}</td>
                    <td style={tdStyle}>{apiData.vasuliDetails.uddishtanusar.percentage}%</td>
                  </tr>
                  <tr style={{ background: '#fafafa' }}>
                    <td style={tdLeftStyle}>
                      <b>{intl.formatMessage({ id: 'daptar.secD.total' })}</b>
                    </td>
                    <td style={tdStyle}>
                      <b>{totalDemandAll}</b>
                    </td>
                    <td style={tdStyle}>
                      <b>{totalCollectedAll}</b>
                    </td>
                    <td style={tdStyle} colSpan="2">
                      <b>{totalPercentageAll}%</b>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* --- ACTION BUTTONS --- */}
            <div style={{ display: 'flex', gap: '15px', marginTop: '20px', marginBottom: '20px' }}>
              <Button type="primary" onClick={handlePrint} icon={<PrinterOutlined />}>
                {intl.formatMessage({ id: 'daptar.btn.print' })}
              </Button>

              <Button
                type="primary"
                icon={<DownloadOutlined />}
                style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                onClick={handleDownloadPDF}
                loading={isDownloading}
                disabled={isDownloading}
              >
                {intl.formatMessage({ id: 'daptar.btn.download', defaultMessage: 'डाउनलोड करा' })}
              </Button>
            </div>

            {/* --- FOOTER REMARK BOX (For Screen Only) --- */}
            <div style={{ marginTop: '40px' }}>
              <div
                style={{
                  border: '1px solid #d9d9d9',
                  borderRadius: '6px',
                  padding: '20px',
                  backgroundColor: '#fff',
                }}
              >
                <h4
                  style={{
                    fontWeight: 'bold',
                    marginBottom: '16px',
                    fontSize: '15px',
                    color: '#262626',
                  }}
                >
                  {intl.formatMessage({ id: 'daptar.remarkBox.title' })}
                </h4>

                <textarea
                  value={remarkText}
                  onChange={(e) => setRemarkText(e.target.value)}
                  disabled={isRemarkSubmitted}
                  maxLength={250}
                  style={{
                    width: '100%',
                    minHeight: '100px',
                    padding: '12px',
                    borderRadius: '4px',
                    border: '1px solid #d9d9d9',
                    fontSize: '14px',
                    resize: 'vertical',
                    outline: 'none',
                    fontFamily: 'inherit',
                    backgroundColor: isRemarkSubmitted ? '#f5f5f5' : '#fff',
                    cursor: isRemarkSubmitted ? 'not-allowed' : 'text',
                    color: isRemarkSubmitted ? '#595959' : 'inherit',
                  }}
                  placeholder={
                    isRemarkSubmitted
                      ? intl.formatMessage({
                          id: 'daptar.remarkBox.waitingReply',
                          defaultMessage: "Waiting for Inspector Officer's reply...",
                        })
                      : intl.formatMessage({
                          id: 'daptar.remarkBox.placeholder',
                          defaultMessage: 'Type your remark here...',
                        })
                  }
                ></textarea>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '12px',
                    marginTop: '16px',
                  }}
                >
                  <Button
                    type="primary"
                    style={{
                      backgroundColor: isRemarkSubmitted ? '#d9d9d9' : '#198754',
                      borderColor: isRemarkSubmitted ? '#d9d9d9' : '#198754',
                      color: isRemarkSubmitted ? '#00000040' : '#fff',
                    }}
                    onClick={handleSaveRemark}
                    disabled={isRemarkSubmitted}
                  >
                    {isRemarkSubmitted
                      ? intl.formatMessage({
                          id: 'daptar.remarkBox.btn.saved',
                          defaultMessage: 'अभिप्राय जतन झाला',
                        })
                      : intl.formatMessage({ id: 'daptar.remarkBox.btn.save' })}
                  </Button>

                  <Button onClick={() => setRemarkText('')} disabled={isRemarkSubmitted}>
                    {intl.formatMessage({ id: 'daptar.remarkBox.btn.reset' })}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* --- ABHIPRAY MODAL (For Screen Only) --- */}
      <Modal
        title={null}
        closable={false}
        visible={showAbhiprayModal}
        onCancel={() => setShowAbhiprayModal(false)}
        footer={null}
        width={800}
        bodyStyle={{ padding: 0 }}
      >
        <div
          style={{
            background: '#1890ff',
            padding: '15px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTopLeftRadius: '8px',
            borderTopRightRadius: '8px',
          }}
        >
          <span style={{ color: '#fff', fontSize: '16px', fontWeight: 'bold' }}>
            {intl.formatMessage({ id: modalTitleKey })}
          </span>
          <CloseOutlined
            style={{ color: '#fff', fontSize: '16px', cursor: 'pointer' }}
            onClick={() => setShowAbhiprayModal(false)}
          />
        </div>
        <div style={{ padding: '20px' }}>
          {isLoadingRemark ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <Spin size="large" />
            </div>
          ) : activeRemarkData.length > 0 ? (
            modalType === 'echawadi' ? (
              <table
                style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #f0f0f0' }}
              >
                <thead>
                  <tr>
                    <th
                      style={{
                        border: '1px solid #f0f0f0',
                        padding: '12px',
                        background: '#fafafa',
                        textAlign: 'left',
                        fontWeight: 'bold',
                      }}
                    >
                      {intl.formatMessage({ id: 'daptar.table.remark' })}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {activeRemarkData.map((item, index) => (
                    <tr key={index}>
                      <td
                        style={{
                          border: '1px solid #f0f0f0',
                          padding: '12px',
                          textAlign: 'left',
                          color: '#333',
                          whiteSpace: 'pre-wrap',
                        }}
                      >
                        {item.remark || item.shera || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : modalType === 'ehakk_truti' || modalType === 'ehakk_pending' ? (
              <table
                style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #f0f0f0' }}
              >
                <thead>
                  <tr>
                    <th
                      onClick={() => requestSort('id')}
                      style={{
                        border: '1px solid #f0f0f0',
                        padding: '12px',
                        background: '#fafafa',
                        textAlign: 'center',
                        cursor: 'pointer',
                      }}
                    >
                      अर्ज क्र.{' '}
                      {sortConfig.key === 'id'
                        ? sortConfig.direction === 'ascending'
                          ? '↑'
                          : '↓'
                        : ''}
                    </th>
                    {modalType === 'ehakk_pending' && (
                      <th
                        onClick={() => requestSort('pendingType')}
                        style={{
                          border: '1px solid #f0f0f0',
                          padding: '12px',
                          background: '#fafafa',
                          textAlign: 'center',
                          cursor: 'pointer',
                        }}
                      >
                        प्रलंबित प्रकार{' '}
                        {sortConfig.key === 'pendingType'
                          ? sortConfig.direction === 'ascending'
                            ? '↑'
                            : '↓'
                          : ''}
                      </th>
                    )}
                    <th
                      onClick={() => requestSort('typeOfRemark')}
                      style={{
                        border: '1px solid #f0f0f0',
                        padding: '12px',
                        background: '#fafafa',
                        textAlign: 'center',
                        cursor: 'pointer',
                      }}
                    >
                      प्रकार{' '}
                      {sortConfig.key === 'typeOfRemark'
                        ? sortConfig.direction === 'ascending'
                          ? '↑'
                          : '↓'
                        : ''}
                    </th>
                    <th
                      onClick={() => requestSort('remark')}
                      style={{
                        border: '1px solid #f0f0f0',
                        padding: '12px',
                        background: '#fafafa',
                        textAlign: 'left',
                        cursor: 'pointer',
                      }}
                    >
                      शेरा{' '}
                      {sortConfig.key === 'remark'
                        ? sortConfig.direction === 'ascending'
                          ? '↑'
                          : '↓'
                        : ''}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedRemarkData.map((item, index) => {
                    const typeLabel = getRemarkTypeLabel(item.typeOfRemark, intl);
                    return (
                      <tr key={index}>
                        <td
                          style={{
                            border: '1px solid #f0f0f0',
                            padding: '12px',
                            textAlign: 'center',
                          }}
                        >
                          <span style={idBadgeStyle}>{item.id || item.mutNo || index + 1}</span>
                        </td>
                        {modalType === 'ehakk_pending' && (
                          <td
                            style={{
                              border: '1px solid #f0f0f0',
                              padding: '12px',
                              textAlign: 'center',
                            }}
                          >
                            {item.pendingType || item.duration || '-'}
                          </td>
                        )}
                        <td
                          style={{
                            border: '1px solid #f0f0f0',
                            padding: '12px',
                            textAlign: 'center',
                          }}
                        >
                          <span style={getSeverityBadgeStyle(typeLabel, intl)}>{typeLabel}</span>
                        </td>
                        <td
                          style={{
                            border: '1px solid #f0f0f0',
                            padding: '12px',
                            textAlign: 'left',
                            color: '#333',
                            whiteSpace: 'pre-wrap',
                          }}
                        >
                          {item.remark || item.shera || '-'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <table
                style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #f0f0f0' }}
              >
                <thead>
                  <tr>
                    <th
                      style={{
                        border: '1px solid #f0f0f0',
                        padding: '12px',
                        background: '#fafafa',
                        textAlign: 'center',
                        width: '20%',
                      }}
                    >
                      {intl.formatMessage({ id: 'daptar.table.ferfarNo' })}
                    </th>
                    <th
                      style={{
                        border: '1px solid #f0f0f0',
                        padding: '12px',
                        background: '#fafafa',
                        textAlign: 'center',
                        width: '20%',
                      }}
                    >
                      {intl.formatMessage({ id: 'daptar.table.type' })}
                    </th>
                    <th
                      style={{
                        border: '1px solid #f0f0f0',
                        padding: '12px',
                        background: '#fafafa',
                        textAlign: 'left',
                      }}
                    >
                      {intl.formatMessage({ id: 'daptar.table.remark' })}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {activeRemarkData.map((item, index) => {
                    const typeLabel = getRemarkTypeLabel(item.typeOfRemark, intl);
                    return (
                      <tr key={index}>
                        <td
                          style={{
                            border: '1px solid #f0f0f0',
                            padding: '12px',
                            textAlign: 'center',
                          }}
                        >
                          <span style={idBadgeStyle}>{item.mutNo || item.id || index + 1}</span>
                        </td>
                        <td
                          style={{
                            border: '1px solid #f0f0f0',
                            padding: '12px',
                            textAlign: 'center',
                          }}
                        >
                          <span style={getSeverityBadgeStyle(typeLabel, intl)}>{typeLabel}</span>
                        </td>
                        <td
                          style={{
                            border: '1px solid #f0f0f0',
                            padding: '12px',
                            textAlign: 'left',
                            color: '#333',
                            whiteSpace: 'pre-wrap',
                          }}
                        >
                          {item.remark || item.shera || '-'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )
          ) : (
            <div
              style={{ textAlign: 'center', padding: '20px', color: '#ff4d4f', fontWeight: 'bold' }}
            >
              {intl.formatMessage({ id: 'daptar.modal.noRemark' })}
            </div>
          )}
          <div style={{ textAlign: 'right', marginTop: '20px' }}>
            <Button onClick={() => setShowAbhiprayModal(false)}>
              {intl.formatMessage({ id: 'daptar.btn.close' })}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default InspectionReport;
