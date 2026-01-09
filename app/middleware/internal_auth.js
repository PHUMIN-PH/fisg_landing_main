'use strict';

const crypto = require('crypto');

module.exports = (options, app) => {
  return async function internalAuth(ctx, next) {
    const apiKey = ctx.get('x-api-key');
    const timestamp = ctx.get('x-timestamp');
    const signature = ctx.get('x-signature');

    if (apiKey !== app.config.internalApiKey) {
      ctx.throw(401, 'Invalid API key');
    }

    const now = Math.floor(Date.now() / 1000);
    if (Math.abs(now - Number(timestamp)) > 300) {
      ctx.throw(401, 'Request expired');
    }

    const payload = `${timestamp}.${JSON.stringify(ctx.request.body)}`;
    const expected = crypto
      .createHmac('sha256', app.config.internalApiSecret)
      .update(payload)
      .digest('hex');

    if (expected !== signature) {
      ctx.throw(401, 'Invalid signature');
    }

    await next();
  };
};
