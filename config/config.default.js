/* eslint valid-jsdoc: "off" */

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
require('dotenv').config();

module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  config.sequelize = {
    dialect: 'mysql',
    host: process.env.DB_HOST || '',
    port: process.env.DB_PORT || '',
    database: process.env.DB_NAME || '',
    username: process.env.DB_USER || '',
    password: process.env.DB_PASSWORD || '',
    
    logging: false,
  };

  config.proxy = true;

  config.cors = {
    origin: (ctx) => {
    const origin = ctx.get('origin');
    if (!origin) return false;

    // allow vercel subdomain ทั้งหมด
    if (origin.endsWith('.vercel.app')) {
      return origin;
    }

    const allowList = [
      'http://127.0.0.1:7001',
      'http://localhost:7001',
      'http://localhost:4200',
      'https://fisg.com',
      'https://www.fisg.com',
      'https://event-system-ochre.vercel.app',
    ];

    if (allowList.includes(origin)) {
      return origin;
    }

    return false;
  },
    // origin: (ctx) => {
    //   const allowList = [
    //     'http://127.0.0.1:7001',
    //     'http://localhost:7001',
    //     'https://www.fisg.com',
    //     'https://fisg.com',// prod
    //     'https://event-system-ochre.vercel.app',
    //     'http://localhost:4200'
    //   ];

    //   const origin = ctx.get('origin');
    //   if (allowList.includes(origin)) {
    //     return origin;
    //   }
    //   return '';
    // },
    allowMethods: 'GET,HEAD,PUT,POST,OPTIONS',
    // allowHeaders: 'Content-Type, Authorization',
    allowHeaders: [
    'Content-Type',
    'Authorization',
    'Accept',
    'X-Requested-With',
    'X-CSRF-Token',
    'X-XSRF-TOKEN',
  ].join(','),
    credentials: true,
  };

  config.crm = {
    apiPointsKey: process.env.CRM_API_POINTMALL_KEY,
    apiMailKey: process.env.CRM_MAIL_KEY,
  }

  config.multipart = {
    mode: 'file', // หรือ 'file'
  }

  config.turnstile = {
    secretKey: process.env.TURNSTILE_SECRET_KEY,
  }
  // main confirmation
  config.pointsMall = {
    baseUrl: process.env.POINTS_MALL_BASE_URL || 'https://www.fisg.com',
    apiKey: process.env.POINTS_MALL_API_KEY || 'of4d3M.6&5Hs7V8zjo!23kHG*2I13R8j9Chgj',
    timeout: 10000,
  };

  config.security = {
    csrf: {
      ignore: ctx => {
        return ctx.path.startsWith('/api/');
      },
    },
  };


  config.internalApiKey = process.env.INTERNAL_API_KEY;
  config.internalApiSecret = process.env.INTERNAL_API_SECRET;
  config.rsaPrivateKey = process.env.RSA_PRIVATE_KEY.replace(/\\n/g, '\n');


  // console.log('API KEY:', config.internalApiKey);
  // console.log(
  //   'API SECRET:',
  //   config.internalApiSecret ? 'LOADED' : 'MISSING'
  // );

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1767929013003_7428';

  config.session = {
    key: 'FISG_ADMIN_SESSION',
    maxAge: 8 * 60 * 60 * 1000, // 1 day
    httpOnly: true,
    encrypt: true,
    sameSite: 'none',
    // signed: true,
    secure: true,  // https
  };

  // config.onerror = {
  //   all(err, ctx) {
  //     ctx.status = err.status || 500;
  //     ctx.body = {
  //       success: false,
  //       message: err.status === 401 ? 'Unauthorized' : 'Server Error',
  //     };
  //   },
  // };

  // add your middleware config here
  // config.middleware = [];
  config.middleware = ['errorHandler'];


  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
