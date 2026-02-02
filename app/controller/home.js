const { Controller } = require('egg');

class HomeController extends Controller {
  async index() {
    // const { ctx } = this;
    this.ctx.status = 404;
    // const result = await ctx.service.crmMailService.sendConfirmationEmail({
    //   email: 'phuwis.dev@gmail.com',
    //   code: 'deposit-and-trade-to-win',
    //   Date: '30 Jan, 2026',
    //   Time: '14:00 (UTC+2)',
    //   Language: 'English',
    //   zoomLink: 'https://us06web.zoom.us/j/82031183371'
    // });

    // Date: '30 Jan, 2026',
    //   Time: '14:00 (UTC+2)',
    //   Language: 'English',
    //   zoomLink: 'https://us06web.zoom.us/j/82031183371'
    // const result = await ctx.service.pointsService.sendCheckPoints({
    // const result = await ctx.service.pointsService.sendResetPoints({
    // const result = await ctx.service.pointsService.redeemCheck({
    //   email: '',
    //   user_id: '36315',
    // });
    // 36315
    // ctx.body = {  
    //   msg: result,
    // };
  }
}

module.exports = HomeController;
