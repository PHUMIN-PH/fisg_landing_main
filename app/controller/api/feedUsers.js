'use strict';
const { Controller } = require('egg');

class FeedUsersDataController extends Controller {
  async getData() {
    const { ctx } = this;

    // if (!ctx.session.admin) {
    //         ctx.throw(401);
    //     }

    const {
      event_name,
      email,
      status,
      month_key,
      page = Number(ctx.query.page || 1),
      pageSize = Number(ctx.query.page_size || 20),
    } = ctx.query;

    const limit = Math.min(Number(page_size) || 20, 100);
    const offset = (Number(page) - 1) * limit;

    /* ---------- build where condition ---------- */
    const where = {};

    if (event_name) where.event_name = event_name;
    if (email) where.email = email;
    if (status) where.status = status;
    if (month_key) where.month_key = month_key;

    /* ---------- query db WebinarRegister---------- */
    // const { rows, count } = await ctx.model.EventRegistration.findAndCountAll({

    const { count, rows } = await ctx.model.WebinarRegister.findAndCountAll({
      attributes: [
        'type',
        'link_id',
        'language',
        'phonecode',
        'name',
        'phone',
        'email',
        'country',
        'created_at',
      ],
      where: {
        ...(ctx.query.link_id ? { link_id: ctx.query.link_id } : {}),
      },
      order: [['created_at', 'DESC']],
      limit: pageSize,
      offset: (page - 1) * pageSize,
    });

    ctx.body = {
      success: true,
      data: rows,
      pagination: {
        total: count,
        page,
        page_size: pageSize,
      },
    };

  }
}

module.exports = FeedUsersDataController;
