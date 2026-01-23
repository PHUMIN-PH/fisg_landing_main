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

        const admin = await this.app.model.AdminUser.findOne({
            where: { email },
        });

        if (!admin || admin.status !== 'active') {
            ctx.throw(401, 'Invalid User');
        }

        const hasAdmin = await bcrypt.compare(password, admin.password);
        if (!hasAdmin) {
            ctx.throw(401, 'Invalid User');
        }

        //session flow
        ctx.session.admin = {
            id: admin.id,
            email: admin.email,
            role: admin.role,
        };

        ctx.body = { success: true };
    }

    async signup() {

    }

    async logout() {
        const { ctx } = this;
        ctx.session = null;
        ctx.body = { success: true };
    }

    async resetPassword() {

    }
}

module.exports = AuthenController;