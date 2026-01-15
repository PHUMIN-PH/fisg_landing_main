const { Controller } = require('egg');

class HomeController extends Controller {
  async index() {
    // const { ctx } = this;
    this.ctx.status = 404;
    // const result = await ctx.service.crmMailService.sendConfirmationEmail({
    //   email: 'phuwis.dev@gmail.com',
    //   code: 'deposit-and-trade-to-win',
    // });

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
// this.ctx.status = 404;


// // app/controller/home.js
// const { Controller } = require('egg');

// class HomeController extends Controller {
//   async index() {
//     const { ctx } = this;
//     await ctx.render('test.ejs', { result: null });
//   }

//   async redeemCheck() {
//     const { ctx } = this;
//     const { email, user_id } = ctx.request.body;

//     const result = await ctx.service.pointsService.redeemCheck({
//       email,
//       user_id,
//     });

//     await ctx.render('test.ejs', { result });
//   }

//   async checkPoints() {
//     const { ctx } = this;
//     const { email, user_id } = ctx.request.body;

//     const result = await ctx.service.pointsService.sendCheckPoints({
//       email,
//       user_id,
//     });

//     await ctx.render('test.ejs', { result });
//   }

//   async resetPoints() {
//     const { ctx } = this;
//     const { email, user_id } = ctx.request.body;

//     const result = await ctx.service.pointsService.sendResetPoints({
//       email,
//       user_id,
//     });

//     await ctx.render('test.ejs', { result });
//   }
// }

// module.exports = HomeController;
