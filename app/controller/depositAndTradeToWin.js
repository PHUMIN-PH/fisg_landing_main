'use strict';
const { Controller } = require('egg');

class DepositAndTradeToWinController extends Controller {
  async index() {
    const { ctx } = this;
    const { email, password, event_name, 'cf-turnstile-response': token } = ctx.request.body;
    // const { data, key, 'cf-turnstile-response': token } = ctx.request.body;

    // ctx.disableCSRF = true;

    /* ---------- validate ---------- */
    if (!email || !password || !token) {
      ctx.status = 400;
      ctx.body = { success: false, status: 'INVALID_REQUEST' };
      return;
    }

    /* ---------- verify Cloudflare Turnstile ---------- */
    const cf_verify = await ctx.service.cfTurnstile.verify(token);
    // console.log("CF Verify : ",cf_verify);
    
    if (!cf_verify) {
      ctx.body = { success: false, status: 'TURNSTILE_FAILED'  };
      // ctx.body = { success: false, status: 'TURNSTILE_FAILED',cf_verify:cf_verify  };
      return;
    }

    /* ---------- check user with main login system ---------- */
    // const authResult = await ctx.service.mainAuth.verifyUser({
    //   email,
    //   password,
    // });

    // if (!authResult.success) {
    //   // แยกให้ชัด: user ไม่มี vs password ผิด
    //   ctx.body = {
    //     success: false,
    //     status: authResult.reason === 'NOT_FOUND'
    //       ? 'USER_NOT_FOUND'
    //       : 'INVALID_CREDENTIAL',
    //   };
    //   return;
    // }

    /* ---------- check already registered campaign ---------- */
    // const exists = await ctx.model.CampaignRegistration.findOne({
    //   where: {
    //     email,
    //     campaign_code: 'deposit-and-trade-to-win',
    //   },
    // });

    // if (exists) {
    //   ctx.body = {
    //     success: false,
    //     status: 'ALREADY_REGISTERED',
    //   };
    //   return;
    // }

    const user = await ctx.model.User.findOne({
      where: { email },
    });

    // if (!user) {
    //   ctx.body = {
    //     success: false,
    //     status: 'INVALID_USER',
    //     token: token,
    //   };
    //   return;
    // }

    /* ---------- month_key (YYYY-MM) ---------- */
    const now = new Date();
    const monthKey = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, '0')}`;

    /* ---------- check duplicate in same month ---------- */
    const exists = await ctx.model.EventRegistration.findOne({
      where: {
        month_key: monthKey,
      },
    });

    let status = 'success';
    let failReason = null;

    if (exists) {
      status = 'failed';
      failReason = 'ALREADY_REGISTERED_THIS_MONTH';
    }

    await ctx.model.EventRegistration.create({
      event_name,
      user_id: "001",
      // user_id: user.user_id,
      email: email,
      verify_method: 'password',
      status,
      fail_reason: failReason,
      registered_date: now,
      month_key: monthKey,
      created_at: now,
    });

    //Confirm check in database
    const event_registered = await ctx.model.EventRegistration.findOne({
      where:{
        email:email,
      },
    });

    if(event_registered && status=="success" ){
      const result = await ctx.service.crmMailService.sendConfirmationEmail({
        email: email,
        code: event_name,
        // code: 'deposit-and-trade-to-win',
      });
      console.log("Mail Confirmation has send to : ",email);
    }else{
      console.log("SEND EMAIL : No sending . . .");
      
    }
    /* ---------- response ---------- */
    if (status === 'failed') {
      ctx.body = {
        success: false,
        ok:false,
        status: 'DUPLICATE_REGISTERED',
        msg : 'already',
        month_key: monthKey,
      };
      return;
    }

    ctx.body = {
      success: true,
      ok: true,
    };
  }
}

module.exports = DepositAndTradeToWinController;

// status code , msg
// redeem, registered, exists, email is already
// : all is show err dialog

// msg : redeem
