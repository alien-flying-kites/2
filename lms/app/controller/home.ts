// tslint:disable: linebreak-style
import { Controller } from 'egg';

export default class HomeController extends Controller {
  public async index() {
    const { ctx } = this;
    let message = '你好，这里是实验室管理系统的后台，请打开前台网址访问本站。';
    message += (' \nSocket状态:' + (ctx.socket as any).readyState);
    message += (' \nSocket连接数:' + (ctx.socket.server as any).connections);
    ctx.body = message;
  }
}
