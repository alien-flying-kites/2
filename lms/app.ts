// tslint:disable: linebreak-style
import { Application } from 'egg';
import { Gender, UserStatus } from './app/model/user';
import { ObjectId } from 'bson';
import { RoleType } from './app/model/role';

export default (app: Application) => {
  app.beforeStart(async () => {
    try {
      app.mongoose.connection.collections.Lesson.createIndex({ date: 1, startTime: 1, labId: 1 }, { unique: true });
      const minDate = new Date(-8640000000000000);

      // init admin
      const users = await app.model.User.find({});
      if (users.length < 1) {
        // const roleType = RoleType.SuperAdmin;
        const firstAdmin = new app.model.User({
          userName: 'admin', // the account name to login
          password: 'admin', // use SHA256 to hash the plain text (MD5 and SHA1 are both not secure)
          displayName: '超级管理员', // the display name, usually that's the user's real name
          roleTypes: [ RoleType.SuperAdmin ], // roles the user belongs to
          gender: Gender.Unspecified, // female, male, unspecified
          mobilePhone: '13900000000',
          email: 'admin@openailab.com',
          address: '',
          passwordSetAt: new Date(),
          passwordExpired: true,
          status: UserStatus.Activated, // is active or not, default is false
          lastLoginAt: minDate,
          createdAt: new Date(),
          createdBy: ObjectId.createFromHexString('000000000000000000000000'),
          lastUpatedAt: new Date(),
          lastUpdatedBy: ObjectId.createFromHexString('000000000000000000000000'),
        });
        firstAdmin.setPasswordHash();
        await firstAdmin.save();
        app.logger.info('project first setup, init admin account ok!');
      }
      const lab = await app.model.Lab.find({});
      if (lab.length < 1) {
        // const roleType = RoleType.SuperAdmin;
        const firstLab = new app.model.Lab({
          name: '实验室',
          location: '实验室',
          description: '',
          createdAt: new Date(),
          createdBy: ObjectId.createFromHexString('000000000000000000000000'),
          lastUpatedAt: new Date(),
          lastUpdatedBy: ObjectId.createFromHexString('000000000000000000000000'),
        });
        await firstLab.save();
      }
      // add roles
      const roles = await app.model.Role.find({});
      if (roles.length < 1) {
        Object.keys(RoleType).filter(k => typeof RoleType[k] === 'number').map(async (key: string) => {
          const role = new app.model.Role({
            roleName: key,
            roleType: RoleType[key],
            description: '',
            createdAt: new Date(),
            createdBy: ObjectId.createFromHexString('000000000000000000000000'),
            lastUpatedAt: new Date(),
            lastUpdatedBy: ObjectId.createFromHexString('000000000000000000000000'),
          });
          await role.save();
        });
      }
    } catch (error) {
      console.log(error);
    }
  });
};
