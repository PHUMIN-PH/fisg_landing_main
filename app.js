'use strict';

const egg = require('egg');

egg.startCluster({
  baseDir: __dirname,
  workers: 1,
  port: 7001,
});
