'use strict';
const { Controller } = require('egg');

class FeedMetaController extends Controller {

  async getMonths() {
    const { ctx } = this;

    if (!ctx.session.admin) {
      ctx.throw(401);
    }

    const rows = await ctx.model.WebinarRegister.findAll({
      attributes: [
        [ctx.app.Sequelize.fn('DISTINCT', ctx.app.Sequelize.col('month_key')), 'month_key']
      ],
      order: [['month_key', 'DESC']],
      raw: true,
    });

    ctx.body = {
      success: true,
      data: rows.map(r => r.month_key).filter(Boolean),
    };
  }

  async getLinkIds() {
  const { ctx } = this;

  if (!ctx.session.admin) {
    ctx.throw(401);
  }

  const rows = await ctx.model.Events.findAll({
    attributes: [
      [ctx.app.Sequelize.fn('DISTINCT', ctx.app.Sequelize.col('event_name')), 'link_id']
    ],
    order: [['event_name', 'ASC']],
    raw: true,
  });

  ctx.body = {
    success: true,
    data: rows.map(r => r.link_id).filter(Boolean),
  };
}

}

module.exports = FeedMetaController;
