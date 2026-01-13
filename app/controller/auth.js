'use strict';
const Controller = require('egg').Controller;

class AuthController extends Controller {
  async register() {
    const { ctx } = this;
    const { email } = ctx.request.body;

    // register user logic 

    // ส่ง confirmation mail
    const result = await ctx.service.crmMail.sendConfirmationEmail({
      email,
      code: 'deposit-and-trade-to-win', // หรือ user-register-confirm
    });

    ctx.body = {
      success: true,
      crmResult: result,
    };
  }
}

module.exports = AuthController;
