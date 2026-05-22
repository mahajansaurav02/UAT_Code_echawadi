import { PageLoading } from '@ant-design/pro-layout';
import { history, Link } from 'umi';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import AccessibilityWidget from '@/components/AccessibilityWidget';
import { currentUser as queryCurrentUser } from './services/ant-design-pro/api';
import {
  AccountBookOutlined,
  BookOutlined,
  DashboardOutlined,
  FacebookFilled,
  FormOutlined,
  LinkOutlined,
  TableOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import { Button, Modal } from 'antd';

const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';

export const initialStateConfig = {
  loading: <PageLoading />,
};
/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */

//let menuData;
// axios.get('http://localhost:5000/cuemasters/MenuApi').then((r) => {
//   menuData = r.data.menu;
//   console.log('Menu API HIT !!!!!!!!!!============>>>>>>>>>');
// });
export async function getInitialState() {

  const fetchUserInfo = async () => {
    try {

      const msg = await queryCurrentUser();

      if (!msg?.data) {
        throw new Error('Unauthorized');
      }

      return msg.data;

    } catch (error) {

      history.push('/user/login');

      return undefined;
    }
  };

  if (history.location.pathname !== '/user/login') {

    const currentUser = await fetchUserInfo();

    return {
      fetchUserInfo,
      currentUser,
      settings: {},
    };
  }

  return {
    fetchUserInfo,
    settings: {},
  };
}
 
export const layout = ({ initialState }) => {
  // console.log('layout called');
  // console.log('roles1', JSON.parse(localStorage.getItem('roles')));
  const pushToPage = (e) => {
    window.location.reload(false);
  };
  let roleMenus = {
    ROLE_TALATHI: [
      {
        path: '/user',
        layout: false,
        routes: [
          {
            path: '/user/login',
            layout: false,
            name: 'login',
            component: './user/Login',
          },
          {
            path: '/user',
            redirect: '/user/login',
          },
         
          {
            component: '404',
          },
        ],
      },
      {
        path: '/homepage',
        //name: 'Home Page ',
        // icon: 'smile',
        routes: [
          // {
          //   path: '/homepage',
          //   redirect: '/homepage',
          // },
          {
            //name: 'Home Page',
            // icon: 'smile',
            path: '/homepage',
            component: './homepage',
          },
          {
            component: '404',
          },
        ],
      },
      {
        path: '/village-selection',
        name: (
          <>
            <Button type="primary" /*  onClick={(e) => pushToPage(e)} */>
              गाव आणि वर्ष निवडा{' '}
            </Button>
          </>
        ),
        //name: 'Home Page ',
        // icon: 'smile',
        routes: [
          // {
          //   path: '/homepage',
          //   redirect: '/homepage',
          // },
          {
            //name: 'Home Page',
            // icon: 'smile',
            path: '/village-selection',
            component: './village-selection',
          },
          {
            component: '404',
          },
        ],
      },

      {
        path: '/generate-revenue',
        name: 'Generate Revenue',
        icon: <FormOutlined />,
        routes: [
          // {
          //   path: '/generate-revenue',
          //   redirect: '/generate-revenue/',
          // },
          {
            /* name: 'Village Form 17',
            icon: 'smile', */
            path: '/generate-revenue/one-time-data-entry/village-form',
            component: './generate-revenue/one-time-data-entry/village-form',
          },
          {
            name: 'One Time Data-Entry',
            icon: 'form',
            path: '/generate-revenue/one-time-data-entry/table-form',
            component: './generate-revenue/one-time-data-entry/table-form',
          },
          {
            /* name: 'Village Form 17',
          icon: 'smile', */
            path: '/generate-revenue/village-form-17Abstract/village-form',
            component: './generate-revenue/village-form-17Abstract/village-form',
          },
          {
            name: 'Village Form 17 ka.ja.pa',
            icon: 'smile',
            path: '/generate-revenue/village-form-17Abstract/table-form',
            component: './generate-revenue/village-form-17Abstract/table-form',
          },
          {
            name: 'Additional Land Revenue',
            icon: 'smile',
            path: '/generate-revenue/additional-land-revenue',
            component: './generate-revenue/additional-land-revenue',
          },
          {
            name: 'Khata Merging',
            icon: 'smile',
            path: '/generate-revenue/khata-merging/khata-merge-list',
            component: './generate-revenue/khata-merging/khata-merge-list',
          },

          {
            name: 'Demand Generation',
            icon: 'smile',
            path: '/generate-revenue/demandGeneration',
            component: './generate-revenue/demandGeneration',
          },
          {
            name: 'Demand Modification',
            icon: 'form',
            path: '/generate-revenue/demandModification',
            component: './generate-revenue/demandModification',
          },

          // {
          //   name: 'Khata Merging',
          //   icon: 'form',
          //   path: '/generate-revenue/khata-merging/khata-view-list',
          //   component: './generate-revenue/khata-merging/khata-view-list',
          // },
          {
            component: '404',
          },
        ],
      },
      {
        path: '/transactions',
        name: 'Transactions',
        icon: <FormOutlined />,
        routes: [
          {
            path: '/transactions',
            redirect: '/transactions/receive-money',
          },
          // {
          //   name: 'Generate Revenue',
          //   icon: 'smile',
          //   path: '/transactions/generate-revenue',
          //   component: './transactions/generate-revenue',
          // },
          {
            name: 'Demand Details',
            icon: 'smile',
            path: '/transactions/demandNotificationBefore15Jan',
            component: './transactions/demandNotificationBefore15Jan',
          },
          {
            //   name: 'Demand Notice',
            //   icon: 'smile',
            path: '/transactions/demandNotification',
            component: './transactions/demandNotification',
          },

          {
            //   name: 'Demand Notice Print',
            //   icon: 'smile',
            path: '/transactions/receiptPrint',
            component: './transactions/receiptPrint',
          },
          {
            //   name: 'Demand Notice Print',
            //   icon: 'smile',
            path: '/transactions/receiptViewPrint',
            component: './transactions/receiptViewPrint',
          },
          {
            //   name: 'generateChallanPrint',
            //   icon: 'smile',
            path: '/transactions/generateChallanPrint',
            component: './transactions/generateChallanPrint',
          },
          {
            //   name: 'Demand Notice Print',
            //   icon: 'smile',
            path: '/transactions/demandNotificationPrint',
            component: './transactions/demandNotificationPrint',
          },
          {
            // name: 'Demand Notice Print',
            // icon: 'smile',
            path: '/transactions/demandNotificationPrintBefore15Jan',
            component: './transactions/demandNotificationPrintBefore15Jan',
          },
          {
            name: 'Receive Payment',
            icon: 'smile',
            path: '/transactions/receive-money',
            component: './transactions/receive-money',
          },
          {
            name: 'Receipt Print',
            icon: 'smile',
            path: '/transactions/receipt-view',
            component: './transactions/receipt-view',
          },
          {
            name: 'Generate Challan',
            icon: 'smile',
            path: '/transactions/generate-challan',
            component: './transactions/generate-challan',
          },
          {
            name: 'Challan Details',
            icon: 'smile',
            path: '/transactions/challan-details',
            component: './transactions/challan-details',
          },
          {
            component: '404',
          },
          // {
          //   name: 'Upload Bank Challan',
          //   icon: 'smile',
          //   path: '/transactions/upload-bank-chalan',
          //   component: './transactions/upload-bank-chalan',
          // },
        ],
      },
      {
        path: '/form',
        icon: <FormOutlined />,
        name: 'form',
        routes: [
          {
            path: '/form',
            redirect: '/homepage',
          },
          //dysclrForm
          // {
          //   name: 'Dysclr Form',
          //   icon: 'smile',
          //   path: '/form/dysclr-form/table-form',
          //   component: './form/dysclr-form/table-form',
          // },
          {
            name: 'Nirank Village Form',
            icon: 'smile',
            path: '/form/village-nirank-form/village-form',
            component: './form/village-nirank-form/village-form',
          },

          {
            /* name: 'Village Form 1',
          icon: 'smile', */
            path: '/form/village-form-1/village-form',
            component: './form/village-form-1/village-form',
          },
          {
            name: 'Village Form 1',
            icon: 'smile',
            path: '/form/village-form-1/table-form',
            component: './form/village-form-1/table-form',
          },
          {
            name: 'Village Form 1 Absract',
            icon: 'smile',
            path: '/form/village-form-1abstract/village-form',
            component: './form/village-form-1abstract/village-form',
          },
          // {
          //   name: 'Village Form 1 Absract',
          //   icon: 'form',
          //   path: '/form/village-form-1abstract/table-form',
          //   component: './form/village-form-1abstract/table-form',
          // },
          {
            // name: 'Village Form 1A',
            // icon: 'smile',
            path: '/form/village-form-1a/village-form',
            component: './form/village-form-1a/village-form',
          },
          {
            name: 'Village Form 1A',
            icon: 'smile',
            path: '/form/village-form-1a/table-form',
            component: './form/village-form-1a/table-form',
          },
          {
            // name: 'Village Form 1B',
            // icon: 'smile',
            path: '/form/village-form-1B/village-form',
            component: './form/village-form-1B/village-form',
          },
          {
            name: 'Village Form 1B',
            icon: 'smile',
            path: '/form/village-form-1B/table-form',
            component: './form/village-form-1B/table-form',
          },
          {
            // name: 'Village Form 1C',
            // icon: 'smile',
            path: '/form/village-form-1c/village-form',
            component: './form/village-form-1c/village-form',
          },
          {
            name: 'Village Form 1C',
            icon: 'smile',
            path: '/form/village-form-1c/table-form',
            component: './form/village-form-1c/table-form',
          },
          {
            // name: 'Village Form 1D',
            // icon: 'smile',
            path: '/form/village-form-1D/village-form',
            component: './form/village-form-1D/village-form',
          },
          {
            name: 'Village Form 1D',
            icon: 'smile',
            path: '/form/village-form-1D/table-form',
            component: './form/village-form-1D/table-form',
          },
          {
            // name: 'Village Form 1E',
            // icon: 'smile',
            path: '/form/village-form-1E/village-form',
            component: './form/village-form-1E/village-form',
          },
          {
            name: 'Village Form 1E',
            icon: 'smile',
            path: '/form/village-form-1E/table-form',
            component: './form/village-form-1E/table-form',
          },
          {
            // name: 'Village Form 2',
            // icon: 'smile',
            path: '/form/village-form-2/village-form',
            component: './form/village-form-2/village-form',
          },
          {
            name: 'Village Form 2',
            icon: 'smile',
            path: '/form/village-form-2/table-form',
            component: './form/village-form-2/table-form',
          },
          {
            /*  name: 'Village Form 3',
          icon: 'smile', */
            path: '/form/village-form-3/village-form',
            component: './form/village-form-3/village-form',
          },
          {
            name: 'Village Form 3',
            icon: 'smile',
            path: '/form/village-form-3/table-form',
            component: './form/village-form-3/table-form',
          },
          {
            // name: 'Village Form 6B',
            // icon: 'smile',
            path: '/form/village-form-6B/village-form',
            component: './form/village-form-6B/village-form',
          },
          {
            name: 'Village Form 6B',
            icon: 'smile',
            path: '/form/village-form-6B/table-form',
            component: './form/village-form-6B/table-form',
          },
          {
            // name: 'Village Form 6D',
            // icon: 'smile',
            path: '/form/village-form-6D/village-form',
            component: './form/village-form-6D/village-form',
          },
          {
            name: 'Village Form 6D',
            icon: 'smile',
            path: '/form/village-form-6D/table-form',
            component: './form/village-form-6D/table-form',
          },
          {
            // name: 'Village Form 7A',
            // icon: 'smile',
            path: '/form/village-form-7a/village-form',
            component: './form/village-form-7a/village-form',
          },
          {
            name: 'Village Form 7A',
            icon: 'smile',
            path: '/form/village-form-7a/table-form',
            component: './form/village-form-7a/table-form',
          },

          {
            // name: 'Village Form 7B',
            // icon: 'smile',
            path: '/form/village-form-7b/village-form',
            component: './form/village-form-7b/village-form',
          },
          {
            name: 'Village Form 7B',
            icon: 'smile',
            path: '/form/village-form-7b/table-form',
            component: './form/village-form-7b/table-form',
          },

          /*  {
          //name: 'Village Form 8C',
         // icon: 'smile',
          path: '/form/village-form-8c/village-form',
          component: './form/village-form-8c/village-form',
        },
        {
          name: 'Village Form 8C',
          icon: 'smile',
          path: '/form/village-form-8c/table-form',
          component: './form/village-form-8c/table-form',
        }, */

          {
            // name: 'Village Form 14',
            // icon: 'smile',
            path: '/form/village-form-14/village-form',
            component: './form/village-form-14/village-form',
          },
          {
            name: 'Village Form 14',
            icon: 'smile',
            path: '/form/village-form-14/table-form',
            component: './form/village-form-14/table-form',
          },
          {
            // name: 'Village Form 15',
            // icon: 'smile',
            path: '/form/village-form-15/village-form',
            component: './form/village-form-15/village-form',
          },
          {
            name: 'Inward / Outward',
            icon: 'smile',
            path: '/form/village-form-15/table-form',
            component: './form/village-form-15/table-form',
          },
          {
            /* name: 'Village Form 17',
          icon: 'smile', */
            path: '/form/village-form-17/village-form',
            component: './form/village-form-17/village-form',
          },
          {
            name: 'Village Form 17',
            icon: 'smile',
            path: '/form/village-form-17/table-form',
            component: './form/village-form-17/table-form',
          },

          {
            /*  name: 'Village Form 19',
          icon: 'smile', */
            path: '/form/village-form-19/village-form',
            component: './form/village-form-19/village-form',
          },
          {
            name: 'Village Form 19',
            icon: 'smile',
            path: '/form/village-form-19/table-form',
            component: './form/village-form-19/table-form',
          },

          {
            name: 'Target',
            icon: 'smile',
            path: '/form/village-target',
            component: './form/village-target',
          },


          {
            component: '404',
          },
        ],
      },
      {
        name: 'Reports',
        icon: <TableOutlined />,
        path: '/reports',
        routes: [
          {
            path: '/reports',
            redirect: '/reports/reports',
          },
          {
            name: 'Demand Generation Report',
            icon: 'smile',
            path: '/reports/Demand-Generation-Challan-Report',
            component: './reports/Demand-Generation-Challan-Report',
          },
          {
            name: 'Demand Generation',
            layout: false,
            icon: 'form',
            path: '/reports/demand-generation-report',
            component: './reports/demand-generation-report',
          },
          {
            name: 'One Time Data Entry Report',
            layout: false,
            icon: 'form',
            path: '/reports/One_Time_Data_Entry_Report',
            component: './reports/One_Time_Data_Entry_Report',
          },
          {
            name: 'Village Form 17 ka.ja.pa Report',
            layout: false,
            icon: 'form',
            path: '/reports/Village_Form_17_ka_ja_pa_Report',
            component: './reports/Village_Form_17_ka_ja_pa_Report',
          },

          {
            name: 'View Challan',
            icon: 'smile',
            path: '/reports/view-challan',
            component: './reports/view-challan',
          },
          {
            //   name: 'Print Receipts',
            //   icon: 'form',
            path: '/reports/challan-report-print',
            component: './reports/challan-report-print',
          },
          {
            name: 'View Receipts',
            icon: 'smile',
            path: '/reports/receipt-reports',
            component: './reports/receipt-reports',
          },
          {
            //   name: 'Print Receipts',
            //   icon: 'form',
            path: '/reports/receipt-report-print',
            component: './reports/receipt-report-print',
          },
          {
            name: 'Additional Land Revenue',
            icon: 'smile',
            path: '/reports/Additional-Land-Revenue-Report',
            component: './reports/Additional-Land-Revenue-Report',
          },
          {
            name: 'Merged Khata',
            icon: 'smile',
            path: '/reports/merged-khata-report',
            component: './reports/merged-khata-report',
          },
          {
            name: 'Form 1',
            icon: 'smile',
            path: '/reports/village-form-1',
            component: './reports/village-form-1',
          },
          {
            name: 'Form 1 ODC',
            icon: 'smile',
            path: '/reports/Form1ODC',
            component: './reports/Form1ODC',
          },
          {
            name: 'Form 1 ODC Difference',
            icon: 'smile',
            path: '/reports/Form1ODC-Difference',
            component: './reports/Form1ODC-Difference',
          },
          {
            name: 'Form 1A',
            icon: 'smile',
            path: '/reports/village-form-1a',
            component: './reports/village-form-1a',
          },
          {
            name: 'Form 1 Abstract',
            icon: 'smile',
            path: '/reports/From 1Abstract',
            component: './reports/From 1Abstract',
          },
          {
            name: 'Form 1B',
            icon: 'smile',
            path: '/reports/village-form-1B',
            component: './reports/village-form-1B',
          },
          {
            name: 'Form 1C',
            icon: 'smile',
            path: '/reports/village-form-1c',
            component: './reports/village-form-1c',
          },
          {
            name: 'Form 1D',
            icon: 'smile',
            path: '/reports/village-form-1D',
            component: './reports/village-form-1D',
          },
          {
            name: 'Form 1E',
            icon: 'smile',
            path: '/reports/village-form-1E',
            component: './reports/village-form-1E',
          },
          {
            name: 'Form 2',
            icon: 'smile',
            path: '/reports/village-form-2',
            component: './reports/village-form-2',
          },
          {
            name: 'Form 3',
            icon: 'smile',
            path: '/reports/village-form-3',
            component: './reports/village-form-3',
          },
          {
            name: 'Form 3 Abstract',
            icon: 'smile',
            path: '/reports/Form 3Abstract',
            component: './reports/Form 3Abstract',
          },
          {
            name: 'Form 4',
            icon: 'smile',
            path: '/reports/Form4',
            component: './reports/Form4',
          },
          {
            name: 'Form 4 Abstract',
            icon: 'smile',
            path: '/reports/Form4Abstract',
            component: './reports/Form4Abstract',
          },
          {
            name: 'Form 5',
            icon: 'smile',
            path: '/reports/Form5',
            component: './reports/Form5',
          },

          {
            name: 'Form 6A',
            icon: 'smile',
            path: '/reports/Form6A',
            component: './reports/Form6A',
          },
          {
            name: 'Form 6B',
            icon: 'smile',
            path: '/reports/village-form-6B',
            component: './reports/village-form-6B',
          },
          {
            name: 'Form 6D',
            icon: 'smile',
            path: '/reports/village-form-6D',
            component: './reports/village-form-6D',
          },
          {
            name: 'Form 7A',
            icon: 'smile',
            path: '/reports/village-form-7a',
            component: './reports/village-form-7a',
          },
          {
            name: 'Form 7B',
            icon: 'smile',
            path: '/reports/village-form-7b',
            component: './reports/village-form-7b',
          },
          {
            name: 'Form 8B',
            layout: false,
            icon: 'smile',
            path: '/reports/Form8B',
            component: './reports/Form8B',
          },
          {
            name: 'Form 8C',
            // layout: false,
            icon: 'smile',
            path: '/reports/Form8C',
            component: './reports/Form8C',
          },
          {
            name: 'Form 8B & 8C',
            layout: false,
            icon: 'smile',
            path: '/reports/Form8B&8C',
            component: './reports/Form8B&8C',
          },

          {
            name: 'Form 8D',
            //    layout: false,
            icon: 'smile',
            path: '/reports/Form8D',
            component: './reports/Form8D',
          },
          {
            name: 'Form 9B',
            icon: 'smile',
            path: '/reports/Form9B',
            component: './reports/Form9B',
          },
          // {
          //   name: 'Form 11',
          //   icon: 'smile',
          //   path: '/reports/Form11',
          //   component: './reports/Form11',
          // },
          // {
          //   name: 'Form 11B',
          //   icon: 'smile',
          //   path: '/reports/Form11B',
          //   component: './reports/Form11B',
          // },
          {
            name: 'Form 14',
            icon: 'smile',
            path: '/reports/village-form-14',
            component: './reports/village-form-14',
          },
          {
            name: 'Form 14 Abstract',
            icon: 'smile',
            path: '/reports/village-form-14Abstract',
            component: './reports/village-form-14Abstract',
          },
          {
            name: 'Inward / Outward',
            icon: 'smile',
            path: '/reports/Form15',
            component: './reports/Form15',
          },
          {
            name: 'Form 17',
            icon: 'smile',
            path: '/reports/village-form-17',
            component: './reports/village-form-17',
          },
          {
            name: 'Form 19',
            icon: 'smile',
            path: '/reports/Form19',
            component: './reports/Form19',
          },
          {
            name: 'Dyslr Akarbndat-Changes',
            icon: 'smile',
            path: '/reports/Akarbndat-Changes',
            component: './reports/Akarbndat-Changes',
          },
          // {
          //   name: 'All Taluka Record',
          //   icon: 'smile',
          //   path: '/reports/All-Taluka-Data',
          //   component: './reports/All-Taluka-Data',
          // },
          {
            name: 'All Village Record',
            icon: 'smile',
            path: '/reports/All-Village-Search-Data',
            component: './reports/All-Village-Search-Data',
          },
          // {
          //   name: 'All Village Record',
          //   icon: 'smile',
          //   path: '/reports/All-Village-Search-Data1',
          //   component: './reports/All-Village-Search-Data1',
          // },
          // {
          //   name: 'Go Live Village List',
          //   icon: 'smile',
          //   path: '/reports/Go-Live-VillageList',
          //   component: './reports/Go-Live-VillageList',
          // },
          {
            // name: 'Online Village Count List',
            // icon: 'smile',
            path: '/reports/Online-Village-Count-Report',
            component: './reports/Online-Village-Count-Report',
          },
          {
            // name: 'Total Login Villages',
            // icon: 'smile',
            path: '/reports/Total-Phase-1-Login-Report',
            component: './reports/Total-Phase-1-Login-Report',
          },
          {
            // name: 'Total Phase One Villages',
            // icon: 'smile',
            path: '/reports/Total-Phase-1-Villages-Report',
            component: './reports/Total-Phase-1-Villages-Report',
          },
          // {
          //   name: 'Ashish sir',
          //   icon: 'smile',
          //   path: '/reports/ashishSir',
          //   component: './reports/ashishSir',
          // },

          // {
          //   name: 'Form 21',
          //   icon: 'smile',
          //   path: '/reports/Form21',
          //   component: './reports/Form21',
          // },
          {
            // name: 'All Village Record',
            // icon: 'smile',
            path: '/reports/All-Village-Report',
            component: './reports/All-Village-Report',
          },
          {
            name: 'Educational Cess',
            icon: 'smile',
            path: '/reports/EducationalCess',
            component: './reports/EducationalCess',
          },
          {
            name: 'Employment Guarantee Tax applicable on',
            icon: 'smile',
            path: '/reports/EmploymentGuaranteeTaxapplicableon',
            component: './reports/EmploymentGuaranteeTaxapplicableon',
          },

          {
            component: '404',
          },
        ],
      },

      {
        name: 'daptarTapasni',
        icon: <BookOutlined />,
        path: '/daptar-tapasni',
        routes: [
          {
            name: 'ahawal',
            path: '/daptar-tapasni/ahawal',
            component: './reports/Daptar_Tapasni_Ahawal',
          },
          {
            name: 'abhiprayYadi',
            path: '/daptar-tapasni/abhipray-yadi',
            component: './reports/Abhipray_Yadi',
          },
        ],
      },
      // {
      //   path: '/dashboard',
      //   name: 'dashboard',
      //   icon: <DashboardOutlined />,
      //   routes: [
      //     {
      //       path: '/dashboard',
      //       redirect: '/dashboard/analysis',
      //     },
      //     {
      //       name: 'Collector Dashboard',
      //       icon: 'smile',
      //       path: '/dashboard/analysis',
      //       component: './dashboard/analysis',
      //     },
      //     // {
      //     //   name: 'Supervisor Dashboard',
      //     //   icon: 'smile',
      //     //   path: '/dashboard/Supervisor-Dashboard',
      //     //   component: './dashboard/Supervisor-Dashboard',
      //     // },

      //     {
      //       component: '404',
      //     },
      //   ],
      // },

      {
        path: '/',
        redirect: '/user/login',
      },
      {
        path: '/all-villages',
        redirect: '/reports/All-Village-Report',
      },
     {
        path: '/*',
        component: '404',
        layout: false, 
      },
    ],
    ROLE_COLLECTOR: [
      {
        path: '/user',
        layout: false,
        routes: [
          {
            path: '/user/login',
            layout: false,
            name: 'login',
            component: './user/Login',
          },
          {
            path: '/user',
            redirect: '/user/login',
          },
          // {
          //   name: 'register-result',
          //   icon: 'smile',
          //   path: '/user/register-result',
          //   component: './user/register-result',
          // },
          // {
          //   name: 'register',
          //   icon: 'smile',
          //   path: '/user/register',
          //   component: './user/register',
          // },
          {
            component: '404',
          },
        ],
      },
      {
        path: '/homepage',
        //name: 'Home Page ',
        // icon: 'smile',
        routes: [
          // {
          //   path: '/homepage',
          //   redirect: '/homepage',
          // },
          {
            //name: 'Home Page',
            // icon: 'smile',
            path: '/homepage',
            component: './homepage',
          },
          {
            component: '404',
          },
        ],
      },
     
      {
        path: '/dashboard',
        name: 'dashboard',
        icon: <DashboardOutlined />,
        routes: [
          {
            path: '/dashboard',
            redirect: '/dashboard/analysis',
          },
          {
            name: 'Collector Dashboard',
            icon: 'smile',
            path: '/dashboard/analysis',
            component: './dashboard/analysis',
          },
          // {
          //   name: 'Supervisor Dashboard',
          //   icon: 'smile',
          //   path: '/dashboard/Supervisor-Dashboard',
          //   component: './dashboard/Supervisor-Dashboard',
          // },

          {
            component: '404',
          },
        ],
      },
      {
        path: '/all-villages',
        redirect: '/reports/All-Village-Report',
      },
     {
        path: '/*',
        component: '404',
        layout: false, 
      },
    ],
    ROLE_DYSLR: [
      {
        path: '/user',
        layout: false,
        routes: [
          {
            path: '/user/login',
            layout: false,
            name: 'login',
            component: './user/Login',
          },
          {
            path: '/user',
            redirect: '/user/login',
          },
        
          {
            component: '404',
          },
        ],
      },
     
      {
        path: '/homepageDYSLR',
        //name: 'Home Page ',
        // icon: 'smile',
        routes: [
          // {
          //   path: '/homepage',
          //   redirect: '/homepage',
          // },
          {
            //name: 'Home Page',
            // icon: 'smile',
            path: '/homepageDYSLR',
            component: './homepageDYSLR',
          },
          {
            component: '404',
          },
        ],
      },
      {
        path: '/village-selection',
        name: (
          <>
            <Button type="primary" /*  onClick={(e) => pushToPage(e)} */>
              गाव आणि वर्ष निवडा{' '}
            </Button>
          </>
        ),
        //name: 'Home Page ',
        // icon: 'smile',
        routes: [
          // {
          //   path: '/homepage',
          //   redirect: '/homepage',
          // },
          {
            //name: 'Home Page',
            // icon: 'smile',
            path: '/village-selection',
            component: './village-selection',
          },
          {
            component: '404',
          },
        ],
      },
      {
        path: '/form',
        icon: <FormOutlined />,
        name: 'form',
        routes: [
          {
            path: '/form',
            redirect: '/homepage',
          },
          //dysclrForm
          {
            name: 'Dysclr Form',
            icon: 'smile',
            path: '/form/dysclr-form/table-form',
            component: './form/dysclr-form/table-form',
          },
          {
            // name: 'Dysclr Form',
            // icon: 'smile',
            path: '/form/dysclr-form/village-form',
            component: './form/dysclr-form/village-form',
          },
          {
            name: 'गाव नमुना १ आकारबंद दुरूस्ती',
            icon: 'smile',
            path: '/form/dyslr-form-akarband-changes/table-form',
            component: './form/dyslr-form-akarband-changes/table-form',
          },

          {
            component: '404',
          },
        ],
      },
      {
        name: 'Reports',
        icon: <TableOutlined />,
        path: '/reports',
        routes: [
          {
            path: '/reports',
            redirect: '/reports/reports',
          },
  
          {
            name: 'Form 1',
            icon: 'smile',
            path: '/reports/village-form-1',
            component: './reports/village-form-1',
          },
          {
            name: 'Form 1 ODC',
            icon: 'smile',
            path: '/reports/Form1ODC',
            component: './reports/Form1ODC',
          },
          {
            name: 'Form 1 ODC Difference',
            icon: 'smile',
            path: '/reports/Form1ODC-Difference',
            component: './reports/Form1ODC-Difference',
          },
          {
            name: 'Dyslr Entry Record',
            icon: 'smile',
            path: '/reports/Dyslr-Entry-Record',
            component: './reports/Dyslr-Entry-Record',
          },
          {
            name: 'Dyslr Delete Record',
            icon: 'smile',
            path: '/reports/Dyslr-Delete-Record',
            component: './reports/Dyslr-Delete-Record',
          },

         

          {
            component: '404',
          },
        ],
      },
      {
        path: '/',
        redirect: '/user/login',
      },
      {
        path: '/all-villages',
        redirect: '/reports/All-Village-Report',
      },
      {
        path: '/*',
        component: '404',
        layout: false, 
      },
    ],
  };

  return {
    menu: {
      // Re-execute request whenever initialState?.currentUser?.userid is modified
      params: {
        userId: initialState?.currentUser?.userid,
        menuData: roleMenus[JSON.parse(localStorage.getItem('roles'))],
      },
      request: async (params, defaultMenuData) => {
        return params.menuData ? params.menuData : [];
      },
    },

 rightContentRender: () => (
    <>
      {/* <AccessibilityWidget /> */}
      <RightContent />
    </>
  ),    disableContentMargin: false,

    footerRender: () => <Footer />,
  onPageChange: () => {

  const { location } = history;

  if (
    !initialState?.currentUser &&
    location.pathname !== '/user/login'
  ) {

    history.push('/user/login');
  }
},
    menuHeaderRender: undefined,

    ...initialState?.settings,
  };
};
