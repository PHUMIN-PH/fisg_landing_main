module.exports = () => {
    return async function authenAdmin(ctx,next){
        if(!ctx.session.admin){
            ctx.status = 401;
            ctx.body = {
                success: false,
                message: 'Unauthorized'
            };
            return;
        }
        await next();
    };
};