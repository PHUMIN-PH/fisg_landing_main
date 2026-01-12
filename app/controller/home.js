const { Controller } = require('egg');

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    // const unix2 = Date.now();
    // const result = await ctx.service.crmMailService.sendConfirmationEmail({
    //   email: 'phuwis.dev@gmail.com',
    //   code: 'deposit-and-trade-to-win',
    // });

    // const result = await ctx.service.pointsService.sendCheckPoints({
    const result = await ctx.service.pointsService.sendResetPoints({
      email: 'phuwisdd.dev@gmail.com',
      user_id: '',
    });

    ctx.body = {  
      data: result,
      // date: unix2,
    };
  }
}

module.exports = HomeController;
