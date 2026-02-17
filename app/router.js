/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, middleware } = app;
  const internalAuth = middleware.internalAuth();
  const authAdmin = middleware.authenAdmin();

  router.get('/', controller.home.index);
  router.get('/api/v1/fuser' ,authAdmin , controller.api.feedUsers.getData);
  router.get('/api/v1/fuser/month' ,authAdmin , controller.api.feedMeta.getMonths);
  router.get('/api/v1/fuser/linkid' ,authAdmin , controller.api.feedMeta.getLinkIds);
  router.get('/api/v1/events',authAdmin, controller.api.fetchEvents.list);

  router.post('/api/v1/signin', controller.api.authAdmin.signin);
  router.post('/api/v1/signup', controller.api.authAdmin.signup);
  router.post('/api/v1/logout', controller.api.authAdmin.logout);
  router.get('/api/v1/logout', controller.api.authAdmin.logout);
  router.get('/api/v1/me', controller.api.authAdmin.me);

  // router.post('/api/register/deposit-and-trade-to-win', controller.depositAndTradeToWin.index);
  router.post('/api/register/', controller.registerLanding.index);
  router.post('/api/register/webinar/', controller.register.webinar.index);


  // router.get('/ping', ctx => {ctx.body = 'pong';});

};

