'use strict';
const { Controller } = require('egg');
const CryptoJS = require('crypto-js');
const forge = require('node-forge');
const log = require('node-forge/lib/log');


class LandingRegisterController extends Controller {
    async index() {
        const { ctx } = this;
        const now = new Date();

        // ctx.logger.info('RSA key loaded:', Boolean(ctx.app.config.rsaPrivateKey));

        const { data, key, 'cf-turnstile-response': token, } = ctx.request.body;

        /* validate  */
        if (!data || !key || !token) {
            ctx.status = 400;
            ctx.body = { msg: "INVALID_REQUEST", token };
            return;
        }

        /* verify    Turnstile before stater  */
        const cf_verify = await ctx.service.cfTurnstile.verify(token);
        if (!cf_verify) {
            ctx.status = 401;
            ctx.body = { msg: "TURNSTILE_FAILED", token };
            return;
        }

        /* RSA decrypt */
        let aesKey;
        try {
            const privateKey = forge.pki.privateKeyFromPem(ctx.app.config.rsaPrivateKey);

            aesKey = privateKey.decrypt(forge.util.decode64(key),
                'RSAES-PKCS1-V1_5'
            );
        } catch (err) {
            // ctx.logger.error('RSA decrypt failed', err);
            ctx.status = 400;
            ctx.body = { msg: "KEY_DECRYPT_FAILED", token };
            return;
        }

        /* AES decrypt payload */
        let payload;
        try {
            const bytes = CryptoJS.AES.decrypt(data, aesKey);
            payload = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        } catch (err) {
            // ctx.logger.error('AES decrypt failed', err);
            ctx.status = 400;
            ctx.body = { msg: "DATA_DECRYPT_FAILED", token };
            return;
        }

        // console.log("DATA PAYLOAD : ", payload);

        const { email, password, link_id: event_name, } = payload;

        if (!email || !password || !event_name) {
            ctx.status = 400;
            ctx.body = { msg: 'INVALID_PAYLOAD', token };
            return;
        }

        const check_user = await ctx.service.pointsService.sendCheckPoints({
            email: email,
            user_id: '',
        });

        // console.log(check_user);
        const hasUser = check_user.msg;
        if (hasUser === 'User Id error') {
            ctx.body = { msg: check_user.msg, massage: "invalid account please create account before registeration", token };
            return;
        }

        const check_redeem = await ctx.service.pointsService.redeemCheck({
            email: email,
            user_id: '',
        });
        // const hasRedeemThisMonth = check_redeem.order_status;

        const orders = check_redeem;
        console.log(check_redeem);

        const hasRedeemThisMonth = orders.some(o => {
            if (o.order_status !== 1 || !o.order_payment_time) return false;

            const d = new Date(o.order_payment_time.replace(' ', 'T'));
            return d.getFullYear() === now.getFullYear() &&
                d.getMonth() === now.getMonth();
        });

        if (hasRedeemThisMonth === 1) {
            ctx.status = 403;
            ctx.body = {
                msg: 'You have already redeemed points rewards this month.',
                token,
            };
            return;
        }

        await ctx.model.Overlapping.create({
            email,
            ip_address: ctx.ip,
            status: 'OVERLAPPING',
            created_at: new Date(),
        });

        /* month_key */
        const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

        /* check duplicate user registerd this month */
        const userRegistered = await ctx.model.EventRegistration.findOne({
            where: {
                email,
                month_key: monthKey,
            },
        });

        let status = 'success';
        let failReason = null;
        let resetPoints = null;
        let recalculated_total = null;

        if (userRegistered) {
            status = 'failed';
            failReason = 'ALREADY_REGISTERED_THIS_MONTH';
        }

        /* send email if success */
        if (status === 'success') {
            const dataResetPoints = await ctx.service.pointsService.sendResetPoints({
                email: email,
                user_id: '',
            });
            console.log(dataResetPoints);

            if (dataResetPoints.msg === 'success') {
                resetPoints = dataResetPoints.range_points;
                recalculated_total = dataResetPoints.recalculated_total;
                await ctx.model.EventRegistration.create({
                    event_name,
                    // user_id: '', 
                    email,
                    verify_method: 'password',
                    status,
                    fail_reason: failReason,
                    registered_date: now,
                    month_key: monthKey,
                    points: resetPoints,
                    recalculated_total: recalculated_total,
                    created_at: now,
                });

                await ctx.service.crmMailService.sendConfirmationEmail({
                    email,
                    code: event_name,
                });
                console.log("send email completed");

            } else {

                await ctx.model.Overlapping.create({
                    email,
                    ip_address: ipAddress || ctx.ip,
                    status: 'OVERLAPPING',
                    created_at: new Date(),
                });

                ctx.body = {
                    msg: 'Overlapping reset records found',
                    massage: 'User has existing reset records for overlapping time periods.  Forced resetting may cause user points to become disordered, please use with caution.',
                    token,
                    dataResetPoints
                };
                return;
            }

        } else {
            await ctx.model.EventRegistration.create({
                event_name,
                // user_id: '', 
                email,
                verify_method: 'password',
                status,
                fail_reason: failReason,
                registered_date: now,
                month_key: monthKey,
                points: resetPoints,
                created_at: now,
            });

            ctx.status = 409;
            ctx.body = {
                status: 'DUPLICATE_REGISTERED',
                msg: 'already',
                token
            };
            return;
        }

        ctx.body = {
            msg: "ok",
            token
        };
    }
}

module.exports = LandingRegisterController;
