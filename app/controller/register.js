'use strict';

const Controller = require('egg').Controller;

class UsersController extends Controller {
  async register() {
    const { ctx } = this;

    const {
      user_id,
      email,
      lastname,
      country,
      status,
      type,
      account_created_at,
    } = ctx.request.body;

    // basic validation
    if (!user_id || !email || !account_created_at) {
      ctx.throw(400, 'Missing required fields');
    }

    await ctx.service.users.upsertFromMainSystem({
      account_id: user_id,
      email,
      lastname: lastname || null,
      country: country || null,
      status: status || 'pending',
      type: type || 'user',
      account_created_at,
    });

    ctx.body = {
      success: true,
    };
  }
}

module.exports = UsersController;
