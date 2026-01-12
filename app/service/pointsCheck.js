'use strict';
const Service = require('egg').Service;
const crypto = require('crypto');

class CrmMailService extends Service {
  async sendConfirmationEmail({ email, code }) {
    const { ctx, app } = this;

    // 1. unix timestamp (milliseconds)
    const unix = Date.now();

    // 2. api2_key 
    const api2Key = app.config.crm.api2Key;

    // 3. build source (ต้องเรียง key)
    const source = `code=${code}&email=${email}`;

    // 4. generate sign (md5)
    const sign = crypto
      .createHash('md5')
      .update(`${source}&${unix}&${api2Key}`)
      .digest('hex');

    // 5. call CRM API
    const res = await ctx.curl(
      'https://sgapi.isgfin.com/crm/api/send/mail',
      {
        method: 'POST',
        contentType: 'json',
        data: {
          email,
          code,
        },
        headers: {
          unix,
          sign,
        },
        dataType: 'json',
        timeout: 5000,
      }
    );

    return res.data;
  }
}

module.exports = CrmMailService;
