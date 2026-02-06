'use strict';
const { Controller } = require('egg');

class FeedUsersDataController extends Controller {
  async getData() {
    const { ctx } = this;

    if (!ctx.session.admin) {
            ctx.throw(401);
        }

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

    //build where condition 
    const where = {};

    if (event_name) where.event_name = event_name;
    if (email) where.email = email;
    if (status) where.status = status;
    if (month_key) where.month_key = month_key;

    // //query db WebinarRegister
    const { rows, count } = await ctx.model.WebinarRegister.findAndCountAll({
      where,
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
      order: [['created_at', 'DESC']],
      limit,
      offset,
    });

    //response 
    const data = rows.map(row => {
      const r = row.toJSON();
      return {
        ...r,
        created_at: formatDate(r.created_at),
      };
    });

    // response
    ctx.body = {
      success: true,
      data,
      pagination: {
        total: count,
        page: Number(page),
        page_size: limit,
        total_pages: Math.ceil(count / limit),
      },
    };
  }

}

function formatDate(dt) {
  if (!dt) return null;
  const d = new Date(dt);

  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mi = String(d.getMinutes()).padStart(2, '0');
  const ss = String(d.getSeconds()).padStart(2, '0');

  return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
}

module.exports = FeedUsersDataController;
