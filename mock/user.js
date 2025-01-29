const waitTime = (time = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

async function getFakeCaptcha(req, res) {
  await waitTime(2000);
  return res.json('captcha-xxx');
}

const { ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION } = process.env;
/**
 * The permissions of the current user, if it is empty, it means not logged in
 * current user access， if is '', user need login
 *If pro Preview, which is authorized by default
 */

let access = ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site' ? 'admin' : '';
const getAccess = () => {
  return access;
}; // The Code will be compatible with local,, service mock And the static data of the deployment site

export default {
  // Support Value Object and Array
  'GET /api/currentUser': (req, res) => {
    if (!getAccess()) {
      res.status(401).send({
        data: {
          isLogin: false,
        },
        errorCode: '401',
        errorMessage: 'Please Login in First',
        success: true,
      });
      return;
    }

    res.send({
      success: true,
      data: {
        name: 'Revenue Department',
        avatar: `<UserOUtlined>`,
        userid: '00000001',
        email: 'revenue.department@e-Chawdi.in',
        signature: 'signature',
        title: 'Interaction Expert',
        group: 'Technology Department- Probity',
        tags: [
          {
            key: '0',
            label: 'Very Thoughtfull',
          },
          {
            key: '1',
            label: 'Focus on Design',
          },
          {
            key: '2',
            label: 'Spice',
          },
          {
            key: '3',
            label: 'Long',
          },
          {
            key: '4',
            label: 'Kiran Varekar',
          },
          {
            key: '5',
            label: 'Inclusive of all',
          },
        ],
        notifyCount: 12,
        unreadCount: 11,
        country: 'India',
        access: getAccess(),
        geographic: {
          province: {
            label: 'Maha',
            key: '330000',
          },
          city: {
            label: 'Pune',
            key: '330100',
          },
        },
        address: 'Baner',
        phone: '7350977851',
      },
    });
  },
  // GET POST can be ommited
  'GET /api/users': [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
    },
  ],

  // getAuth: async () => {
  //   // const { password, username, type } = myreq.body
  //   // await waitTime(2000);
  //   const article = {
  //     servarthId: values.username,
  //     password: values.password,
  //   };

  //   Axios.post(
  //     `${BaseURL}/restservice/authenticateUserByUsernameAndPassword`,
  //     article,
  //   ).then((res) => {
  //     console.log('test+++++=', res);
  //   });
  //   return
  // },

  'POST /api/login/account': async (req, res) => {
    //getAuth();
    const { password, username, type } = req.body;
    await waitTime(2000);

    // if (password === 'ant.design' && username === 'admin') {

    res.send({
      status: 'ok',
      type,
      currentAuthority: 'admin',
    });
    access = 'admin';
    return;
    //}

    // if (password === 'ant.design' && username === 'user') {
    //   res.send({
    //     status: 'ok',
    //     type,
    //     currentAuthority: 'user',
    //   });
    //   access = 'user';
    //   return;
    // }

    // if (type === 'mobile') {
    //   res.send({
    //     status: 'ok',
    //     type,
    //     currentAuthority: 'admin',
    //   });
    //   access = 'admin';
    //   return;
    // }

    res.send({
      status: 'error',
      type,
      currentAuthority: 'guest',
    });
    access = 'guest';
  },

  'POST /api/login/outLogin': (req, res) => {
    access = '';
    res.send({
      data: {},
      success: true,
    });
  },
  'POST /api/register': (req, res) => {
    res.send({
      status: 'ok',
      currentAuthority: 'user',
      success: true,
    });
  },
  'GET /api/500': (req, res) => {
    res.status(500).send({
      timestamp: 1513932555104,
      status: 500,
      error: 'error',
      message: 'error',
      path: '/base/category/list',
    });
  },
  'GET /api/404': (req, res) => {
    res.status(404).send({
      timestamp: 1513932643431,
      status: 404,
      error: 'Not Found',
      message: 'No message available',
      path: '/base/category/list/2121212',
    });
  },
  'GET /api/403': (req, res) => {
    res.status(403).send({
      timestamp: 1513932555104,
      status: 403,
      error: 'Forbidden',
      message: 'Forbidden',
      path: '/base/category/list',
    });
  },
  'GET /api/401': (req, res) => {
    res.status(401).send({
      timestamp: 1513932555104,
      status: 401,
      error: 'Unauthorized',
      message: 'Unauthorized',
      path: '/base/category/list',
    });
  },
  'GET  /api/login/captcha': getFakeCaptcha,
};
