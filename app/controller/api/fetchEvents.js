// app/controller/api/events.js
'use strict';
const { Controller } = require('egg');

class EventsController extends Controller {
  async list() {
    const { ctx } = this;

    const rows = await ctx.model.Events.findAll({
      attributes: [
        [ctx.app.Sequelize.fn('DISTINCT', ctx.app.Sequelize.col('event_name')), 'event_name'],
      ],
      where: {
        event_name: { [ctx.app.Sequelize.Op.ne]: null },
      },
      order: [['event_name', 'ASC']],
      raw: true,
    });

    ctx.body = {
      success: true,
      data: rows.map(r => r.event_name),
    };
  }
}

module.exports = EventsController;
