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
    database: process.env.DB_NAME || 'landing',
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password88',
    timezone: '+00:00',
    dialectOptions: {
      socketPath: '/tmp/mysql.sock',
    },
    logging: false,
  };

  config.crm = {
    api2Key: process.env.CRM_API2_KEY,
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
        return ctx.path.startsWith('/api/register/');
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

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
