'use strict';
const Service = require('egg').Service;

class MainAuthService extends Service {
  async verifyUser({ email, password }) {
    // เรียก API ระบบ login หลัก
    const res = await this.ctx.curl(
      'https://main-auth.yourcompany.com/api/login/check',
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
