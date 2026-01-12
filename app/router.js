/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, middleware } = app;
  const internalAuth = middleware.internalAuth();

  router.get('/', controller.home.index);

  router.post('/api/register/deposit-and-trade-to-win', controller.depositAndTradeToWin.index);
  router.post('/api/register/deposit-and-trade-to-win2', controller.deposit.index);

  router.post(
    '/api/internal/users/register',
    internalAuth,
    controller.register
  );
};

// module.exports = app => {
//   const { router, controller } = app;

//   router.get('/', controller.home.index);
// };
