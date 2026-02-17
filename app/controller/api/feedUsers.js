'use strict';
const { Controller } = require('egg');

class FeedUsersDataController extends Controller {
  async getData() {
    const { ctx } = this;

    // if (!ctx.session.admin) {
    //   ctx.throw(401);
    // }

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
        'unique_code',
        'language',
        'phonecode',
        'phone',
        'name',
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
        // name: maskName(r.name),
        email: maskEmail(r.email),
        phone: maskPhone(r.phone),
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

function maskEmail(email) {
  if (!email) return null;

  const [name, domain] = email.split('@');
  if (!name || !domain) return email;

  const visible = name.slice(0, 7);
  return `${visible}******@${domain}`;
}

function maskPhone(phone) {
  if (!phone) return null;

  const str = String(phone);

  if (str.length <= 4) {
    return str;
  }

  const last4 = str.slice(-4);
  const masked = '*'.repeat(str.length - 4);

  return masked + last4;
}


function maskName(name) {
  if (!name) return null;

  if (name.length <= 3) {
    return name[0] + '***';
  }

  const visible = name.slice(0, 7);
  return `${visible}******`;
}


module.exports = FeedUsersDataController;
