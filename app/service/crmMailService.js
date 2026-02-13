'use strict';
const Service = require('egg').Service;
const { log } = require('console');
const crypto = require('crypto');

class CrmMailService extends Service {
  async sendConfirmationEmail({ email, code, Date: dateValue, Time: timeValue, Language: languageValue, zoomLink, }) {
    const { ctx, app } = this;

    const unix = Date.now();
    const api2Key = app.config.crm.apiMailKey;

    const body = {
      email,
      code,
      params: {
        Date: dateValue,
        Time: timeValue,
        Language: languageValue,
        zoomLink,
      },
    };

    const source = Object.keys(body).sort().map((x) => `${x}=${typeof body[x] != 'string' ? JSON.stringify(body[x]) : body[x]}`).join('&');

    const sign = crypto
      .createHash('md5')
      .update(`${source}&${unix}&${api2Key}`)
      .digest('hex');

    // const res = await ctx.curl(
    //   'https://sgapi.isgfin.com/crm/api/send/mail',
    //   {
    //     method: 'POST',
    //     contentType: 'json',
    //     data: body,
    //     headers: {
    //       unix,
    //       sign,
    //     },
    //     dataType: 'json',
    //     timeout: 5000,
    //   }
    // );
    try {
      const res = await ctx.curl(
        'https://sgapi.isgfin.com/crm/api/send/mail',
        {
          method: 'POST',
          contentType: 'json',
          data: body,
          headers: {
            unix,
            sign,
          },
          dataType: 'json',
          timeout: 5000,
        }
      );

      if (res.status !== 200) {
        ctx.logger.error('CRM MailServer HTTP error', res.status, res.data);
        return { success: false, error: 'HTTP_ERROR' };
      }

      if (!res.data || res.data.success === false) {
        ctx.logger.error('CRM Mail provider fail', res.data);
        return { success: false, error: 'PROVIDER_FAIL' };
      }

      ctx.logger.info(`CRM Mail sent success → ${email}`);

      return { success: true };

    } catch (err) {
      ctx.logger.error('CRM Mail exception', err);
      return { success: false, error: err.message };
    }

    // return res.data;
  }
}

module.exports = CrmMailService;
