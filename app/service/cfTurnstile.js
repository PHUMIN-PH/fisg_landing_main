'use strict';
const Service = require('egg').Service;

const SECRET_KEY = '0x4AAAAAACL_ectzuytWTDMJ6Bwcfym7qGw';
// 1x0000000000000000000000000000000AA
// 0x4AAAAAACL_ectzuytWTDMJ6Bwcfym7qGw
class TurnstileService extends Service {
  async verify(token) {
    const res = await this.ctx.curl(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        contentType: 'json',
        data: {
          secret: SECRET_KEY,
          response: token,
          remoteip: this.ctx.ip,
        },
        dataType: 'json',
      }
    );

    return res.data && res.data.success === true;
  }
}

module.exports = TurnstileService;
