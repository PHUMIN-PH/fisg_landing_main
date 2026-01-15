'use strict';
const Service = require('egg').Service;

class MainAuthService extends Service {
  async verifyUser({ email, password }) {
    const res = await this.ctx.curl(
      'api/auth/login',
      {
        method: 'POST',
        contentType: 'json',
        data: { email, password },
        dataType: 'json',
        timeout: 5000,
      }
    );

    return res.data; // { success: true/false }
  }
}

module.exports = MainAuthService;
