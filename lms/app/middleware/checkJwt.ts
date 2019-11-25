// tslint:disable: linebreak-style
import { Context } from 'egg';

// import JwtPayload from '../core/jwtPayload';
export default () => {
    return async (ctx: Context, next: any) => {
        let token: string = ctx.request.query.token;
        try {
            if (!token && ctx.request.headers && ctx.request.headers.authorization) {
                const parts = ctx.request.headers.authorization.split(' ');
                if (parts.length === 2) {
                    const scheme = parts[0],
                    credentials = parts[1];

                    if (/^Bearer$/i.test(scheme)) {
                        token = credentials;
                    }
                }
            }

            if (!token) {
                ctx.user = null;
                return await next();
            }
            const decoded = ctx.service.token.verifyToken(token) as any;
            if (decoded && decoded._id) {
                const user = await ctx.model.User.findById(decoded._id);
                if (!user) {
                    throw new Error('该用户不存在');
                }
                ctx.user = user;
            } else {
                throw new Error('用户token格式错误');
            }
            await next();
        } catch (error) {
            if (
                error.name === 'TokenExpiredError' ||
                error.name === 'JsonWebTokenError'
            ) {
                ctx.user = null;
                await next();
            } else {
                ctx.throw(error);
            }
        }
    };
};
