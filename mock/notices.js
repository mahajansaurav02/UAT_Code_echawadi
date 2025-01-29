const getNotices = (req, res) => {
  res.json({
    data: [
      {
        id: '000000001',
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png',
        title: 'You have received 1 new Task Today ',
        datetime: '2017-08-09',
        type: 'notification',
      },
      
    ],
  });
};

export default {
  'GET /api/notices': getNotices,
};
