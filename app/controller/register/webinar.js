'use strict';
const { Controller } = require('egg');
const CryptoJS = require('crypto-js');
const forge = require('node-forge');
const log = require('node-forge/lib/log');


class WebinarController extends Controller {
    async index() {
        const { ctx } = this;
        const now = new Date();

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

        const { email, name, link_id, unique, country, phone, periodtime, timezone } = payload;

        const webinarPeriod = await ctx.model.Webinar.findOne({
            where: {
                name: unique,
            },
        });

        if (!webinarPeriod || !webinarPeriod.end_date) {
            ctx.status = 400;
            ctx.body = { msg: 'WEBINAR_NOT_FOUND' };
            return;
        }

        // console.log(webinarPeriod.end_date);
        // console.log(webinarPeriod.name);
        // console.log(timezone);
        if(webinarPeriod.end_date !== timezone){
            ctx.status = 400;
            ctx.body = { msg: 'Mistake. Please Do not hard code! '+ctx.ip+'' };
            return;
        }

        const registrationEndTime = splitEndDateTimeUTC(timezone);
        const nowTime = nowUTCDateTime();
        // console.log("Current Time : ", nowTime);
        // console.log("EndDateTime : ", registrationEndTime);

        if (nowTime > registrationEndTime) {
            ctx.body = {
                success: false,
                msg: 'REGISTRATION_CLOSED',
            };
            return;
        }

        const exists = await ctx.model.WebinarRegister.findOne({
            where: {
                unique_code: unique,
                email,
                timezone,
            },
        });

        if (exists) {
            ctx.body = {
                success: false,
                msg: 'ALREADY',
            };
            return;
        } else {
            await ctx.model.WebinarRegister.create({
                link_id,
                unique_code: unique,
                periodtime,
                timezone,
                timestamp,
                language,
                signature,
                phonecode,
                name,
                phone,
                email,
                country,
                remote_ip: ctx.ip,
            });

            // await ctx.service.crmMailService.sendConfirmationEmail({
            //         email,
            //         code: event_name,
            //     });
            //     console.log("send email completed");

            ctx.body = {
                success: true,
                msg: 'success',
            };
            return;
        }

    }

}
function splitEndDateTimeUTC(datetime) {
    if (!datetime) return null;

    const d = new Date(datetime);

    const pad = n => String(n).padStart(2, '0');

    return (
        `${d.getUTCFullYear()}-` +
        `${pad(d.getUTCMonth() + 1)}-` +
        `${pad(d.getUTCDate())} ` +
        `${pad(d.getUTCHours())}:` +
        `${pad(d.getUTCMinutes())}:` +
        `${pad(d.getUTCSeconds())}`
    );
}

function nowUTCDateTime() {
    const d = new Date();
    const pad = n => String(n).padStart(2, '0');

    return (
        `${d.getUTCFullYear()}-` +
        `${pad(d.getUTCMonth() + 1)}-` +
        `${pad(d.getUTCDate())} ` +
        `${pad(d.getUTCHours())}:` +
        `${pad(d.getUTCMinutes())}:` +
        `${pad(d.getUTCSeconds())}`
    );
}


module.exports = WebinarController;
