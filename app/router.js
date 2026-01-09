/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, middleware } = app;
  const internalAuth = middleware.internalAuth();

  router.post(
    '/api/internal/users/register',
    internalAuth,
    controller.users.register
  );
};

