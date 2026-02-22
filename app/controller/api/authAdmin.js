'use strict';

const { Controller } = require("egg");
const bcrypt = require('bcryptjs');

class AuthenController extends Controller {
    async signin() {
        const { ctx } = this;
        const { email, password } = ctx.request.body;
        // app/controller/api/authAdmin.js

        if (!email || !password) {
            ctx.throw(400, 'Email and password required');
        }

        console.log('AdminUser model:', ctx.model.AdminUsers);

        const admin = await this.app.model.AdminUsers.findOne({
            where: { email },
        });

        if (!admin || admin.status !== 'active') {
            ctx.status = 401;
            ctx.body = {
                success: false,
                code: 'INVALID_USER',
            };
            return;
        }

        const hasAdmin = await bcrypt.compare(password, admin.password);
        if (!hasAdmin) {
            ctx.status = 401;
            ctx.body = {
                success: false,
                code: 'INVALID_USER',
            };
            return;
        }

        //session flow
        ctx.session.admin = {
            id: admin.id,
            email: admin.email,
            role: admin.role,
        };

        if(hasAdmin){
            await ctx.model.AdminLogs.create({
                admin_id : admin.id,
                admin_email : admin.email,
                action : "Login",
                resource : "",
                reaget_id: "",
                status: "success",
                message : "",
                ip_address : ctx.ip,
                user_agent : ctx.user_agent,
                payload : "",
            });
        }

        ctx.status = 200;
        ctx.body = {
            success: true,
            admin: {
                email: admin.email,
                role: admin.role,
            },
        };
        return;
    }

    async signup() {
        const { ctx } = this;
        const { email, password, name } = ctx.request.body;

        console.log("Payload : ", ctx.request.body);
        // ctx.body = { success: false, message: 'missing required fields' };
        //     return;

        if (!email || !password) {
            ctx.status = 400;
            ctx.body = { success: false, message: 'missing required fields' };
            return;
        }

        const exists = await ctx.model.AdminUsers.findOne({ where: { email } });
        if (exists) {
            ctx.status = 409;
            ctx.body = { success: false, message: 'email already exists' };
            return;
        }

        const hashPassword = await bcrypt.hash(password, 10);

        console.log("hashPassword : ", hashPassword);


        await ctx.model.AdminUsers.create({
            email,
            password: hashPassword,
            name,
            role: 'admin',
            status: 'active',
            account_created_at: new Date(),
            register_date: new Date(),
            created_at: new Date(),
            updated_at: new Date(),
        });

        ctx.body = {
            success: true,
            message: 'success',
        };
    }

    async logout() {
        const { ctx } = this;
        ctx.session = null;
        ctx.body = { success: true };
    }

    async me() {
        const { ctx } = this;

        if (!ctx.session.admin) {
            ctx.throw(401);
        }

        ctx.body = {
            id: ctx.session.admin.id,
            email: ctx.session.admin.email,
            role: ctx.session.admin.role,
        };
    }


    async resetPassword() {

    }
}

module.exports = AuthenController;