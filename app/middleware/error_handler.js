module.exports = () => {
  return async function errorHandler(ctx, next) {
    try {
      await next();
    } catch (err) {
      ctx.status = err.status || 500;

      ctx.body = {
        success: false,
        message: err.message || 'Internal Server Error',
      };

      // ไม่โชว์ stack
      if (ctx.app.config.env === 'prod') {
        ctx.app.emit('error', err, ctx);
      }
    }
  };
};
