// tslint:disable: linebreak-style
import { Controller } from 'egg';
import { IUserModel } from '../model/user';

export default class UserController extends Controller {
  // public model: mongoose.Model<IUser>;

  public async index() {
    const { ctx } = this;

    await ctx.model.Role.find({}, (err: any, result: IUserModel[]) => {
      if (err) {
        console.log(err);
      } else {
        ctx.body = result;
      }
    });
  }
}
