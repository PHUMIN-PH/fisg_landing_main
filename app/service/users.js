'use strict';

const Service = require('egg').Service;

class UsersService extends Service {
  async upsert(data) {
    const { Users } = this.ctx.model;
    return Users.upsert(data);
  }
}

module.exports = UsersService;
