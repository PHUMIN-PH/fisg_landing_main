const { Controller } = require('egg');

class HomeController extends Controller {
  async index() {
    this.ctx.status = 404;
  }
}

module.exports = HomeController;
