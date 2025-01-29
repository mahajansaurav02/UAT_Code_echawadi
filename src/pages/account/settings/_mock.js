// eslint-disable-next-line import/no-extraneous-dependencies
const city = require('./geographic/city.json');

const province = require('./geographic/province.json');

function getProvince(_, res) {
  return res.json({
    data: province,
  });
}

function getCity(req, res) {
  return res.json({
    data: city[req.params.province],
  });
}

function getCurrentUse(req, res) {
  return res.json({
    data: {
      name: 'Serati Ma',
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
      userid: '00000001',
      email: 'antdesign@alipay.com',
      signature: 'Be tolerant to diversity, tolerance is a virtue',
      title: 'Interaction expert',
      group:
        'Ant Financial - XX Business Group - XX Platform Department - XX Technology Department - UED',
      tags: [
        {
          key: '0',
          label: 'very thoughtful',
        },
        {
          key: '1',
          label: 'Focus on design',
        },
        {
          key: '2',
          label: 'hot~',
        },
        // {
        //   key: '3',
        //   label: 'long legs',
        // },
        {
          key: '4',
          label: 'Chuanmeizi',
        },
        {
          key: '5',
          label: 'All rivers are inclusive',
        },
      ],
      notifyCount: 12,
      unreadCount: 11,
      country: 'China',
      geographic: {
        province: {
          label: 'Zhejiang Province',
          key: '330000',
        },
        city: {
          label: 'Hangzhou',
          key: '330100',
        },
      },
      address: 'Xihu District Gongzhuan Road 77 ',
      phone: '0752-268888888',
    },
  });
} //The code will be compatible with local service mocks and static data of the deployment site

export default {
  // The supported value is Object AND Array
  'GET  /api/accountSettingCurrentUser': getCurrentUse,
  'GET  /api/geographic/province': getProvince,
  'GET  /api/geographic/city/:province': getCity,
};
