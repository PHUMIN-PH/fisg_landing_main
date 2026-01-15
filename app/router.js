/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, middleware } = app;
  const internalAuth = middleware.internalAuth();

  router.get('/', controller.home.index);
  router.get('/api/v1/fuser' , controller.api.feedUsers.getData);


  // router.post('/api/register/deposit-and-trade-to-win', controller.depositAndTradeToWin.index);
  router.post('/api/register/', controller.registerLanding.index);

};

