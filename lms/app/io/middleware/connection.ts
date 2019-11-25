// tslint:disable: linebreak-style
import { Application, Context } from 'egg';
export default (app: Application) => {
    return async (ctx: Context, next: any) => {
        // 授权验证
        const token = ctx.request.query.token;
        let isAuthenticated = false;
        try {
            const decoded = ctx.service.token.verifyToken(token) as any;
            if (decoded && decoded._id) {
                const user = await ctx.model.User.findById(decoded._id);
                if (user) {
                    isAuthenticated = true;
                    ctx.user = user;
                    Object.assign(ctx.socket.client, { user });
                    Object.assign(ctx.socket.client, { tokenExpirationTime: decoded.exp });
                }
            }

        } catch (err) {
            console.log(err);
        }
        if (!isAuthenticated) {
            ctx.socket.disconnect();
            return;
        }
        // ctx.socket.emit('PushMessageToClient', '来自服务器的消息: socket已连接!这是一条调试消息，发布前需删除');
        console.log(app.logger);
        await next();
    };
};
