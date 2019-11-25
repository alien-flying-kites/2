// tslint:disable: linebreak-style
import { Context } from 'egg';
export default () => {
    return async (ctx: Context, next: any) => {
        // 在这里可以对消息作过滤
        const clockTimestamp = Math.floor(Date.now() / 1000);
        const tokenExpirationTime = (ctx.socket.client as any).tokenExpirationTime;
        const clockTolerance = 0;
        if (clockTimestamp >= tokenExpirationTime + clockTolerance) {
            // expired
            ctx.socket.disconnect();
            return;
        }
        // console.log(ctx, app);
        await next();
    };
};
