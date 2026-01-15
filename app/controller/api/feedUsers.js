'use strict';
const { Controller } = require('egg');

class FeedUsersDataController extends Controller {
  async getData() {
    const { ctx } = this;

    /* ---------- query params ---------- */
    const {
      event_name,
      email,
      status,
      month_key,
      page = 1,
      page_size = 20,
    } = ctx.query;

    const limit = Math.min(Number(page_size) || 20, 100);
    const offset = (Number(page) - 1) * limit;

    /* ---------- build where condition ---------- */
    const where = {};

    if (event_name) where.event_name = event_name;
    if (email) where.email = email;
    if (status) where.status = status;
    if (month_key) where.month_key = month_key;

    /* ---------- query db ---------- */
    const { rows, count } = await ctx.model.EventRegistration.findAndCountAll({
      where,
      order: [['created_at', 'DESC']],
      limit,
      offset,
    });

    /* ---------- response ---------- */
    ctx.body = {
      success: true,
      data: rows,
      pagination: {
        total: count,
        page: Number(page),
        page_size: limit,
        total_pages: Math.ceil(count / limit),
      },
    };
  }
}

module.exports = FeedUsersDataController;
