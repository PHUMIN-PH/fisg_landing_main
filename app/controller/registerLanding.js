'use strict';
const { Controller } = require('egg');
const CryptoJS = require('crypto-js');
const forge = require('node-forge');
const log = require('node-forge/lib/log');


class LandingRegisterController extends Controller {
    async index() {
        const { ctx } = this;
        const PRIVATE_KEY = ctx.app.config.rsaPrivateKey;

        ctx.logger.info('RSA key loaded:', Boolean(ctx.app.config.rsaPrivateKey));

        const { data, key, 'cf-turnstile-response': token, } = ctx.request.body;

        /* validate  */
        if (!data || !key || !token) {
            ctx.status = 400;
            ctx.body = { success: false, status: 'INVALID_REQUEST' };
            return;
        }

        /* verify  Turnstile  */
        const cf_verify = await ctx.service.cfTurnstile.verify(token);
        if (!cf_verify) {
            ctx.body = { success: false, status: 'TURNSTILE_FAILED' };
            return;
        }

        /* RSA decrypt AES key */
        let aesKey;
        try {
            const privateKey = forge.pki.privateKeyFromPem(ctx.app.config.rsaPrivateKey);

            aesKey = privateKey.decrypt(forge.util.decode64(key),
                'RSAES-PKCS1-V1_5'
            );
        } catch (err) {
            ctx.logger.error('RSA decrypt failed', err);
            ctx.body = { success: false, status: 'KEY_DECRYPT_FAILED' };
            return;
        }

        /* AES decrypt payload */
        let payload;
        try {
            const bytes = CryptoJS.AES.decrypt(data, aesKey);
            payload = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        } catch (err) {
            ctx.logger.error('AES decrypt failed', err);
            ctx.body = { success: false, status: 'DATA_DECRYPT_FAILED' };
            return;
        }

        console.log("DATA PAYLOAD : ", payload);

        const { email, password, link_id: event_name, } = payload;

        if (!email || !password || !event_name) {
            ctx.body = { success: false, status: 'INVALID_PAYLOAD' };
            return;
        }

        const check_user = await ctx.service.pointsService.sendResetPoints({
            email: email,
            user_id: '',
        });
        // console.log(check_user);
        const hasUser = check_user.msg;
        if(hasUser === 'User Id error'){
            ctx.body = { success: false,msg: check_user.msg ,massage: "invalid account please create account before registeration"};
            return;
        }
        
        /* month_key */
        const now = new Date();
        const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

        /* check duplicate this month */
        const exists = await ctx.model.EventRegistration.findOne({
            where: {
                email,
                month_key: monthKey,
            },
        });

        let status = 'success';
        let failReason = null;

        if (exists) {
            status = 'failed';
            failReason = 'ALREADY_REGISTERED_THIS_MONTH';
        }

        await ctx.model.EventRegistration.create({
            event_name,
            // user_id: '', // หรือ user.user_id
            email,
            verify_method: 'password',
            status,
            fail_reason: failReason,
            registered_date: now,
            month_key: monthKey,
            created_at: now,
        });

        /* send email if success */
        if (status === 'success') {
            await ctx.service.crmMailService.sendConfirmationEmail({
                email,
                code: event_name,
            });
        }

        if (status === 'failed') {
            ctx.body = {
                success: false,
                ok: false,
                status: 'DUPLICATE_REGISTERED',
                msg: 'already',
                month_key: monthKey,
            };
            return;
        }

        ctx.body = {
            msg: "ok"
        };
    }
}

module.exports = LandingRegisterController;
