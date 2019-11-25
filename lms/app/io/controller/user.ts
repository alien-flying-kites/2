// tslint:disable: linebreak-style
import { Controller } from 'egg';
// import { ObjectId } from 'bson';
import JwtPayload from '../../core/jwtPayload';
import ResponsePayload from './responsePayload';
import { RoleType } from '../../model/role';
import { UserStatus } from '../../model/user';
// import { WebSocket1 } from 'ws';
declare module 'egg' {
  interface CustomController {
    user: UserController;
  }
}

export default class UserController extends Controller {
  ws: any;
  async ping() {
    const { ctx } = this;
    const message = ctx.args[0] + ' from server';
    await ctx.socket.emit('PushMessageToClient', `Hi! I've got your message: ${message}`);
  }

  async index() {
    const { ctx } = this;
    const payload: ResponsePayload = {
      errCode: 0,
      msg: 'OK',
      data: {},
    };
    //  roleTypes: { $in: [ RoleType.SuperAdmin ] }
    //  .populate({ path: 'adminId', select: { displayName: 1 } })
    try {
      if (ctx.client.user.roleTypes.indexOf(RoleType.SuperAdmin) === -1 && ctx.client.user.roleTypes.indexOf(RoleType.SchoolAdmin) === -1) {
        payload.msg = '您没有此权限';
        payload.errCode = 1;
        ctx.socket.emit('setUserList', payload);
        return;
      }
      const { offset, limit, username } = ctx.packet[1];
      payload.errCode = 0;
      if (username) {
        payload.data.count = await ctx.model.User.find({ displayName: { $regex: username } }).count();
        payload.data.data = await ctx.model.User.find({ displayName: { $regex: username } })
        .populate({ path: 'classId', select: { name: 1 } }).limit(limit).skip(offset);
      } else {
        payload.data.count = await ctx.model.User.find({ }).count();
        payload.data.data = await ctx.model.User.find({})
        .populate({ path: 'classId', select: { name: 1 } }).limit(limit).skip(offset);
      }
    } catch (err) {
      payload.errCode = 1;
      payload.msg = '' + err;
      // ctx.socket.emit('PushMessageToClient', err);
    }
    ctx.socket.emit('setUserList', payload);
  }
 // 获取我的用户信息
  async getMyUserInfo() {
    const { ctx } = this;
    // const config = {
    //   wsPort: 3011,
    // };
    const payload: ResponsePayload = {
      errCode: 0,
      msg: 'OK',
      data: {},
    };
    //  roleTypes: { $in: [ RoleType.SuperAdmin ] }
    //  .populate({ path: 'adminId', select: { displayName: 1 } })
    try {
      const { id } = ctx.packet[1];
      payload.errCode = 0;
      payload.data = await ctx.model.User.find({ _id: id });
    } catch (err) {
      payload.errCode = 1;
      payload.msg = '' + err;
      // ctx.socket.emit('PushMessageToClient', err);
    }
    ctx.socket.emit('setgetMyUserInfo', payload);
  }

  connect(data) {
    const WebSocket = require('ws');
    if (this.ws) return;
    const _data = data;
    this.ws = new WebSocket('ws://127.0.0.1:4444', {});
    if (this.ws.readyState !== 1) {
      console.log(this.ws.readyState);
    }
    // console.log(ws);
    const me = this;
    this.ws.on('open', function open() {
      console.log('***connected');
      console.log(_data);
      me.ws.send(JSON.stringify(_data));
      // me.ws.send({ hahha: 666 });
      // heartBitTimer = setInterval(function () {
      //   console.log('发送心跳' +  new Date());
      //   ws.send(JSON.stringify({ type: 3 }));
      // }, 1000 * 30);
    });
    // Book.find({}, (err: any, docs) => {
    this.ws.on('error', (err: any) => {
      let reConnectNum = 0;
      const isConnected = false;
      console.log('\n*** occur err 11111111111111111');
      console.log(`code: ${err.code}`);
      console.log(`errno:: ${err.errno}`);
      if (!isConnected) {
        console.log(`reconnect num: ${ ++ reConnectNum }, ${new Date()}\n`);
      }
    });
    this.ws.on('close', function close(code) {
      // const isConnected = false;
      console.log(`***close, code: ${code}, ${new Date()}`);
    });
    this.ws.on('message', async function incoming(data: any) {
      console.log('\n***receive:', data);
      const { type, name } = JSON.parse(data);
      if (!type || !name) return;
    });
  }
  async create() {
    const { ctx } = this;
    // const mongoose = require('mongoose');
    // const WebSocket = require('ws');
    const payload: ResponsePayload = {
      errCode: 0,
      msg: 'OK',
      data: {},
    };
    try {
      if (ctx.client.user.roleTypes.indexOf(RoleType.SuperAdmin) === -1 && ctx.client.user.roleTypes.indexOf(RoleType.SchoolAdmin) === -1) {
        payload.msg = '您没有此权限';
        payload.errCode = 1;
        ctx.socket.emit('setUserList', payload);
        return;
      }
      const userInfo = ctx.packet[1];
      if (userInfo.email.length < 5) {
        payload.errCode = 1;
        payload.msg = '邮箱长度太短';
        ctx.socket.emit('setAddUser', payload);
        return;
      }
      const checkUid = await ctx.model.User.find({ userName: userInfo.userName });
      if (checkUid.length > 0) {
        payload.errCode = 1;
        payload.msg = '登录名已存在';
        ctx.socket.emit('setAddUser', payload);
        return;
      }
      const checkdisplayName = await ctx.model.User.find({ displayName: userInfo.displayName });
      if (checkdisplayName.length > 0) {
        payload.errCode = 1;
        payload.msg = '显示名已存在';
        ctx.socket.emit('setAddUser', payload);
        return;
      }
      const checkemail = await ctx.model.User.find({ email: userInfo.email });
      if (checkemail.length > 0) {
        payload.errCode = 1;
        payload.msg = '邮箱已存在';
        ctx.socket.emit('setAddUser', payload);
        return;
      }
      const checkphone = await ctx.model.User.find({ mobilePhone: userInfo.mobilePhone });
      if (checkphone.length > 0) {
        payload.errCode = 1;
        payload.msg = '手机号码已存在';
        ctx.socket.emit('setAddUser', payload);
        return;
      }
      if (!userInfo.class2Name) {
        const minDate = new Date(-8640000000000000);
        const addUser = new ctx.model.User({
          userName: userInfo.userName,
          password: userInfo.password,
          displayName: userInfo.displayName,
          roleTypes: userInfo.roleTypes,
          gender: userInfo.gender,
          mobilePhone: userInfo.mobilePhone,
          email: userInfo.email,
          address: userInfo.address,
          passwordSetAt: new Date(),
          passwordExpired: false,
          status: UserStatus.Unapproved,
          lastLoginAt: minDate,
          createdAt: new Date(),
          createdBy: ctx.client.user._id,
          lastUpatedAt: new Date(),
          lastUpdatedBy: ctx.client.user._id,
        });
        addUser.setPasswordHash();
        payload.errCode = 0;
        payload.msg = '添加成功';
        payload.data = await addUser.save();
        const data = {
          password: userInfo.password,
          newPhone: userInfo.mobilePhone,
          oldPhone: null,
          option: 'C',
        };
        this.connect(data);
      } else {
        const minDate = new Date(-8640000000000000);
        const addUser = new ctx.model.User.discriminators.Student({
          userName: userInfo.userName,
          password: userInfo.password,
          displayName: userInfo.displayName,
          roleTypes: [ RoleType.Student ],
          classId: userInfo.class2Name,
          gender: userInfo.gender,
          mobilePhone: userInfo.mobilePhone,
          email: userInfo.email,
          address: userInfo.address,
          passwordSetAt: new Date(),
          passwordExpired: false,
          status: UserStatus.Unapproved, // 注册用户默认为未激活状态
          lastLoginAt: minDate,
          createdAt: new Date(),
          createdBy: ctx.client.user._id,
          lastUpatedAt: new Date(),
          lastUpdatedBy: ctx.client.user._id,
        });
        addUser.setPasswordHash();
        // const userInfo: IUserModel = await ctx.model.User.findOne(addUser);
        const userFound = await addUser.save();
        await ctx.model.Class2.findByIdAndUpdate(userInfo.class2Name, { $addToSet: { studentIds: userFound._id } });
        const data = {
          password: userInfo.password,
          newPhone: userInfo.mobilePhone,
          oldPhone: '',
          option: 'C',
        };
        this.connect(data);
        // const studentCount = await app.model.User.discriminators.Student.find({}).count();
        ctx.body = { success: true, message: '添加成功', userFound };
        // ctx.status = HTTPStatusCode.OK;
      }
      // ctx.socket.emit('setAddUser', userFound);
    } catch (err) {
      payload.errCode = 1;
      payload.msg = '' + err;
    }
    ctx.socket.emit('setAddUser', payload);
  }

  //  修改用户状态 (激活/冻结)
  async updateState() {
    const { ctx } = this;
    const payload: ResponsePayload = {
      errCode: 0,
      msg: 'OK',
      data: {},
    };
    try {
      if (ctx.client.user.roleTypes.indexOf(RoleType.SuperAdmin) === -1 && ctx.client.user.roleTypes.indexOf(RoleType.SchoolAdmin) === -1) {
        payload.msg = '您没有此权限';
        payload.errCode = 1;
        ctx.socket.emit('setUserList', payload);
        return;
      }
      const { id, status, ids } = ctx.packet[1];
      if (ids.length <= 0) {
        if (!id) {
          ctx.socket.emit('PushMessageToClient', '参数错误');
          return;
        }
        const oldUser = await ctx.model.User.find({ _id: id });
        if (!oldUser) {
          ctx.socket.emit('PushMessageToClient', '个人信息不存在');
          return;
        }
        payload.errCode = 0;
        payload.data = await ctx.model.User.updateOne({ _id: id }, { status, createdAt: new Date(), lastUpatedAt: new Date() });
        payload.msg = '修改成功';
      } else {
        for (const i in ids) {
          const _user = await ctx.model.User.find({ _id: ids[i] });
          if (!_user) {
            ctx.socket.emit('PushMessageToClient', '个人信息不存在');
            return;
          }
          payload.data = await ctx.model.User.updateOne({ _id: ids[i] }, { status, createdAt: new Date(), lastUpatedAt: new Date() });
        }
      }
      // ctx.socket.emit('setupdateUser', result);
    } catch (err) {
      // ctx.socket.emit('PushMessageToClient', err);
      payload.errCode = 1;
      payload.msg = '' + err;
    }
    ctx.socket.emit('setupdateState', payload);
  }
  async checkPwd() {
    const { ctx } = this;
    const payload: ResponsePayload = {
      errCode: 0,
      msg: 'OK',
      data: {},
    };
    try {
      const { id, password, } = ctx.packet[1];
      if (!id) {
        payload.msg = '参数错误';
        ctx.socket.emit('setcheckPwd', payload);
        return;
      }
      if (!password) {
        payload.msg = '原密码为空';
        ctx.socket.emit('setcheckPwd', payload);
        return;
      }
      const oldUser = await ctx.model.User.findById(id);
      if (oldUser) {
        const addUser = new ctx.model.User({
          password,
        });
        addUser.setPasswordHash();
        const checkUid = await ctx.model.User.count({ _id: id, password: addUser.password });
        if (checkUid > 0) {
          payload.msg = '原密码正确';
          ctx.socket.emit('setcheckPwd', payload);
          return;
        } else {
          payload.msg = '原密码输入错误';
          ctx.socket.emit('setcheckPwd', payload);
          return;
        }
      } else {
        payload.msg = '个人信息不存在';
        ctx.socket.emit('setcheckPwd', payload);
        return;
      }
    } catch (err) {
      payload.errCode = 1;
      payload.msg = '' + err;
      // ctx.socket.emit('PushMessageToClient', err);
    }
    ctx.socket.emit('setcheckPwd', payload);
  }
  // 修改用户信息
  async updateUserInfo() {
    const { ctx } = this;
    const payload: ResponsePayload = {
      errCode: 0,
      msg: 'OK',
      data: {},
    };
    try {
      // if (ctx.client.user.roleTypes.indexOf(RoleType.SuperAdmin) === -1 && ctx.client.user.roleTypes.indexOf(RoleType.SchoolAdmin) === -1) {
      //   payload.msg = '您没有此权限';
      //   payload.errCode = 1;
      //   ctx.socket.emit('setUserList', payload);
      //   return;
      // }
      const { id, mobilePhone, email, roleTypes, userName, address, displayName, password, password1, class2Name, gender } = ctx.packet[1];
      if (!id) {
        payload.msg = '参数错误';
        ctx.socket.emit('setupdateUserInfo', payload);
        return;
      }
      if (!userName) {
        payload.msg = '登录名不能为空';
        ctx.socket.emit('setupdateUserInfo', payload);
        return;
      }
      if (email.length < 5) {
        payload.msg = '邮箱长度太短';
        ctx.socket.emit('setupdateUserInfo', payload);
        return;
      }
      const oldUser = await ctx.model.User.findById(id);
      if (oldUser) {
        const checkUid = await ctx.model.User.count({ userName });
        if (checkUid > 0 && oldUser.userName !== userName) {
          payload.msg = '登录名已存在';
          ctx.socket.emit('setupdateUserInfo', payload);
          return;
        }
        const checkdisplayName = await ctx.model.User.count({ displayName });
        if (checkdisplayName > 0 && oldUser.displayName !== displayName) {
          payload.msg = '显示名已存在';
          ctx.socket.emit('setupdateUserInfo', payload);
          return;
        }
        const checkemail = await ctx.model.User.count({ email });
        if (checkemail > 0 && oldUser.email !== email) {
          payload.msg = '邮箱已存在';
          ctx.socket.emit('setupdateUserInfo', payload);
          return;
        }
        const checkmobilePhone = await ctx.model.User.count({ mobilePhone });
        if (checkmobilePhone > 0 && oldUser.mobilePhone !== mobilePhone) {
          payload.msg = '手机号码已存在';
          ctx.socket.emit('setupdateUserInfo', payload);
          return;
        }
        if (password1 && password1.length > 0) {
          const addUser = new ctx.model.User({
            password,
          });
          addUser.setPasswordHash();
          const checkpwd = await ctx.model.User.count({ _id: id, password: addUser.password });
          if (checkpwd <= 0) {
            payload.msg = '原密码输入错误';
            ctx.socket.emit('setupdateUserInfo', payload);
            return;
          }
        }
      } else {
        payload.msg = '个人信息不存在';
        ctx.socket.emit('setupdateUserInfo', payload);
        return;
      }
      payload.errCode = 0;
      if (password && password !== '' && password !== undefined) {
        const addUser = new ctx.model.User({
          userName,
          password: password1,
          displayName,
          roleTypes,
          mobilePhone,
          email,
          gender,
          address,
          passwordSetAt: new Date(),
          passwordExpired: false,
          createdAt: new Date(),
          createdBy: ctx.client.user._id,
          lastUpatedAt: new Date(),
          lastUpdatedBy: ctx.client.user._id,
        });
        addUser.setPasswordHash();
        const oldInfo = await ctx.model.User.findOne({ _id: id });
        const _oldPhone = oldInfo.mobilePhone;
        payload.data = await ctx.model.User.updateOne({ _id: id }, { mobilePhone: addUser.mobilePhone, email: addUser.email, roleTypes: addUser.roleTypes, userName: addUser.userName, address: addUser.address, displayName: addUser.displayName, gender, password: addUser.password, createdAt: new Date(), lastUpatedAt: new Date(), lastUpdatedBy: addUser.lastUpdatedBy });
        payload.data.update = 1;
        payload.msg = '修改成功';
        const data = {
          password: password1,
          newPhone: JSON.stringify(mobilePhone),
          oldPhone: _oldPhone,
          option: 'M',
        };
        this.connect(data);
      } else {
        if (class2Name && class2Name !== '' && class2Name !== undefined) {
          const addUser = new ctx.model.User.discriminators.Student({
            userName,
            displayName,
            roleTypes: [ RoleType.Student ],
            classId: class2Name,
            mobilePhone,
            email,
            gender,
            address,
            passwordSetAt: new Date(),
            passwordExpired: false,
            createdAt: new Date(),
            createdBy: ctx.client.user._id,
            lastUpatedAt: new Date(),
            lastUpdatedBy: ctx.client.user._id,
          });
          // const oldInfo = await ctx.model.User.findOne({ _id: id });
          // const _oldPhone = oldInfo.mobilePhone;
          // addUser.setPasswordHash();
          payload.data = await ctx.model.User.discriminators.Student.update({ _id: id }, { mobilePhone: addUser.mobilePhone, email: addUser.email, roleTypes: addUser.roleTypes, classId: addUser.classId, gender, userName: addUser.userName, address: addUser.address, displayName: addUser.displayName, createdAt: new Date(), lastUpatedAt: new Date(), lastUpdatedBy: addUser.lastUpdatedBy });
          if (!oldUser.classId) {
            await ctx.model.Class2.findByIdAndUpdate(addUser.classId, { $addToSet: { studentIds: oldUser._id } });
          } else {
            await ctx.model.Class2.findByIdAndUpdate(oldUser.classId, { $pull: { studentIds: oldUser._id } });
            await ctx.model.Class2.findByIdAndUpdate(addUser.classId, { $addToSet: { studentIds: oldUser._id } });
          }
          payload.data.update = 1;
          payload.msg = '修改成功';
          //  修改用户信息的时候，没有原始密码，我怎么取出来原始未加密的密码
          // const data = {
          //   password: '',
          //   newPhone: JSON.stringify(mobilePhone),
          //   oldPhone: _oldPhone,
          //   option: 'M',
          // };
          // this.connect(data);
        } else {
          // const oldInfo = await ctx.model.User.findOne({ _id: id });
          // const _oldPhone = oldInfo.mobilePhone;
          payload.data = await ctx.model.User.updateOne({ _id: id }, { mobilePhone, email, roleTypes, userName, address, displayName, gender, createdAt: new Date(), lastUpatedAt: new Date(), lastUpdatedBy: ctx.client.user._id });
          payload.msg = '修改成功';
          // const data = {
          //   password: '',
          //   newPhone: JSON.stringify(mobilePhone),
          //   oldPhone: _oldPhone,
          //   option: 'M',
          // };
          // this.connect(data);
        }
      }
    } catch (err) {
      payload.errCode = 1;
      payload.msg = '' + err;
      // ctx.socket.emit('PushMessageToClient', err);
    }
    ctx.socket.emit('setupdateUserInfo', payload);
  }

  async delete() {
    const { ctx } = this;
    const payload: ResponsePayload = {
      errCode: 0,
      msg: 'OK',
      data: {},
    };
    try {
      if (ctx.client.user.roleTypes.indexOf(RoleType.SuperAdmin) === -1 && ctx.client.user.roleTypes.indexOf(RoleType.SchoolAdmin) === -1) {
        payload.msg = '您没有此权限';
        payload.errCode = 1;
        ctx.socket.emit('setUserList', payload);
        return;
      }
      const { id, classId } = ctx.packet[1];
      if (!id) {
        ctx.socket.emit('PushMessageToClient', '参数错误');
        return;
      }
      const oldUser = await ctx.model.User.find({ _id: id });
      if (!oldUser) {
        ctx.socket.emit('PushMessageToClient', '个人信息不存在');
        return;
      }
      if (!classId) {
        const oldInfo = await ctx.model.User.findOne({ _id: id });
        const _oldPhone = oldInfo.mobilePhone;
        payload.errCode = 0;
        payload.data = await ctx.model.User.deleteOne({ _id: id });
        payload.data.data = await ctx.model.ClassRegistration.deleteMany({ studentId: id });
        payload.msg = '删除成功';
        const data = {
          password: '',
          newPhone: _oldPhone,
          oldPhone: _oldPhone,
          option: 'D',
        };
        this.connect(data);
      } else {
        payload.errCode = 0;
        payload.data = await ctx.model.User.deleteOne({ _id: id });
        await ctx.model.Class2.findByIdAndUpdate(classId, { $pull: { studentIds: id } });
        const _class = await ctx.model.Class.find({ studentIds : { $in: id } });
        for (const i in _class) {
          await ctx.model.Class.findByIdAndUpdate(_class[i]._id, { $pull: { studentIds: id } });
        }
        // await ctx.model.Class.find({ studentIds : { $in: id } }).update({ $pull: { studentIds: id } });
        payload.data.data = await ctx.model.ClassRegistration.deleteMany({ studentId: id });
        payload.msg = '删除成功';
      }
    } catch (err) {
      payload.errCode = 1;
      payload.msg = '' + err;
      // ctx.socket.emit('PushMessageToClient', err);
    }
    ctx.socket.emit('setdeleteUser', payload);
  }
  async deleteManyUsers() {
    const { ctx } = this;
    const payload: ResponsePayload = {
      errCode: 0,
      msg: 'OK',
      data: {},
    };
    try {
      if (ctx.client.user.roleTypes.indexOf(RoleType.SuperAdmin) === -1 && ctx.client.user.roleTypes.indexOf(RoleType.SchoolAdmin) === -1) {
        payload.msg = '您没有此权限';
        payload.errCode = 1;
        ctx.socket.emit('setUserList', payload);
        return;
      }
      const { ids, classIds } = ctx.packet[1];
      if (!ids) {
        ctx.socket.emit('PushMessageToClient', '参数错误');
        return;
      }
      for (const i in ids) {
        const _user = await ctx.model.User.find({ _id: ids[i] });
        const _oldPhone = _user[0].mobilePhone;
        if (!_user) {
          ctx.socket.emit('PushMessageToClient', '个人信息不存在');
          return;
        }
        const data = {
          password: '',
          newPhone: _oldPhone,
          oldPhone: _oldPhone,
          option: 'D',
        };
        this.connect(data);
      }
      if (classIds.length <= 0) {
        for (const i in ids) {
          payload.data = await ctx.model.User.deleteMany({ _id: ids[i] });
          payload.data.data = await ctx.model.ClassRegistration.deleteMany({ studentId: ids[i] });
        }
        payload.errCode = 0;
        payload.msg = '删除成功';
      } else {
        for (const i in ids) {
          payload.data = await ctx.model.User.deleteMany({ _id: ids[i] });
          payload.data.data = await ctx.model.ClassRegistration.deleteMany({ studentId: ids[i] });
        }
        for (const j in classIds) {
          await ctx.model.Class2.findByIdAndUpdate(classIds[j].classId, { $pull: { studentIds: classIds[j].id } });
          const _class = await ctx.model.Class.find({ studentIds : { $in: classIds[j].id } });
          for (const i in _class) {
            await ctx.model.Class.findByIdAndUpdate(_class[i]._id, { $pull: { studentIds: classIds[j].id } });
          }
        }
        payload.errCode = 0;
        payload.msg = '删除成功';
      }
    } catch (err) {
      payload.errCode = 1;
      payload.msg = '' + err;
      // ctx.socket.emit('PushMessageToClient', err);
    }
    ctx.socket.emit('setdeleteManyUsers', payload);
  }

  async refreshToken() {
    const { ctx } = this;
    try {
      const userFound = (ctx.socket.client as any).user;
      let types = 0;
      if (userFound.roleTypes) {
        // tslint:disable: no-bitwise
        userFound.roleTypes.forEach((x: number) => { types |= x; });
      }
      const payLoad: JwtPayload = { _id: userFound._id, displayName: userFound.displayName, roleTypes: types, userName: userFound.userName, mobilePhone: userFound.mobilePhone, email: userFound.email };
      const token = await ctx.service.token.generateToken(payLoad);
      ctx.socket.emit('refreshToken', token);
    } catch (err) {
      ctx.socket.emit('PushMessageToClient', err);
    }
  }

  //  查询角色列表
  async roleIndex() {
    const { ctx } = this;
    const payload: ResponsePayload = {
      errCode: 0,
      msg: 'OK',
      data: {},
    };
    try {
      if (ctx.client.user.roleTypes.indexOf(RoleType.SuperAdmin) === -1 && ctx.client.user.roleTypes.indexOf(RoleType.SchoolAdmin) === -1) {
        payload.msg = '只有管理员可以查看角色列表';
        payload.errCode = 1;
        ctx.socket.emit('setRoleList', payload);
        return;
      }
      const { offset, limit, username } = ctx.packet[1];
      payload.errCode = 0;
      if (username) {
        payload.data.count = await ctx.model.Role.find({ roleName: username }).count();
        payload.data.data = await ctx.model.Role.find({ roleName: username }).limit(limit).skip(offset);
      } else {
        payload.data.count = await ctx.model.Role.find({ }).count();
        payload.data.data = await ctx.model.Role.find({}).limit(limit).skip(offset);
      }
    } catch (err) {
      payload.errCode = 1;
      payload.msg = '' + err;
      // ctx.socket.emit('PushMessageToClient', err);
    }
    ctx.socket.emit('setRoleList', payload);
  }
  //  获取教师列表
  async teacherOptionList() {
    const { ctx } = this;
    const payload: ResponsePayload = {
      errCode: 0,
      msg: 'OK',
      data: {},
    };
    try {
      payload.errCode = 0;
      payload.data = await ctx.model.User.find({ roleTypes: { $in: [ RoleType.Teacher ] } });
    } catch (err) {
      payload.errCode = 1;
      payload.msg = '' + err;
      // ctx.socket.emit('PushMessageToClient', err);
    }
    ctx.socket.emit('setteacherOptionList', payload);
  }
  //  获取课程管理员列表
  async courseAdminOptionList() {
    const { ctx } = this;
    const payload: ResponsePayload = {
      errCode: 0,
      msg: 'OK',
      data: {},
    };
    try {
      payload.errCode = 0;
      payload.data = await ctx.model.User.find({ roleTypes: { $in: [ RoleType.CourseAdmin ] } });
    } catch (err) {
      payload.errCode = 1;
      payload.msg = '' + err;
      // ctx.socket.emit('PushMessageToClient', err);
    }
    // console.log(payload);
    ctx.socket.emit('setcourseAdminOptionList', payload);
  }

  //  获取班级管理员列表
  async classAdminOptionList() {
    const { ctx } = this;
    const payload: ResponsePayload = {
      errCode: 0,
      msg: 'OK',
      data: {},
    };
    try {
      payload.errCode = 0;
      payload.data = await ctx.model.User.find({ roleTypes: { $in: [ RoleType.ClassAdmin ] } });
    } catch (err) {
      payload.errCode = 1;
      payload.msg = '' + err;
      // ctx.socket.emit('PushMessageToClient', err);
    }
    // console.log(payload);
    ctx.socket.emit('setclassAdminOptionList', payload);
  }

  //  获取实验管理员列表
  async labAdminOptionList() {
    const { ctx } = this;
    const payload: ResponsePayload = {
      errCode: 0,
      msg: 'OK',
      data: {},
    };
    try {
      payload.errCode = 0;
      payload.data = await ctx.model.User.find({ roleTypes: { $in: [ RoleType.LabAdmin ] } });
    } catch (err) {
      payload.errCode = 1;
      payload.msg = '' + err;
      // ctx.socket.emit('PushMessageToClient', err);
    }
    // console.log(payload);
    ctx.socket.emit('setlabAdminOptionList', payload);
  }
  // 学生列表
  async studentOptionList() {
    const { ctx } = this;
    const payload: ResponsePayload = {
      errCode: 0,
      msg: 'OK',
      data: {},
    };
    try {
      payload.errCode = 0;
      payload.data = await ctx.model.User.find({ roleTypes: { $in: [ RoleType.Student ] } })
      .populate({ path: 'classId', select: { name: 1 } });
    } catch (err) {
      payload.errCode = 1;
      payload.msg = '' + err;
      // ctx.socket.emit('PushMessageToClient', err);
    }
    // console.log(payload);
    ctx.socket.emit('setstudentOptionList', payload);
  }
  // 课程班添加学生
  async addClassStudent() {
    const { ctx } = this;
    const payload: ResponsePayload = {
      errCode: 0,
      msg: 'OK',
      data: {},
    };
    try {
      const userInfo = ctx.packet[1];
      if (userInfo.class2Id) {
        payload.data = await ctx.model.Class2.findOne({ _id: userInfo.class2Id });
        const studentList = payload.data.studentIds;
        await ctx.model.Class.findByIdAndUpdate(userInfo.classId, { $addToSet: { studentIds: studentList } });
        payload.errCode = 0;
        payload.msg = '添加成功';
      }
      if (userInfo.stutdents) {
        // await ctx.model.Class.findByIdAndUpdate(userInfo.classId, { $addToSet: { studentIds: userInfo.stutdents } });
        const _result = await ctx.model.Class.findOne({ _id: userInfo.classId });
        if (_result.studentIds.length > _result.studentLimit) {
          payload.errCode = 1;
          payload.msg = '选择人数限制已经达到班级限制上限，请重新选择';
          ctx.socket.emit('setaddClassStudent', payload);
          return;
        }
        const _arr: any[] = [];
        const _result1 = _result.studentIds;
        userInfo.stutdents.forEach((x: any) => {
          _arr.push(x._id);
        });
        const diff: any[] = [];
        _arr.forEach((element: any) => {
          if (_result1.indexOf(element) < 0) {
            diff.push(element);
          }
        });
        const _num = _result.studentLimit - _result.studentIds.length;
        if (_num >= diff.length) {
          await ctx.model.Class.findByIdAndUpdate(userInfo.classId, { $addToSet: { studentIds: userInfo.stutdents } });
          payload.errCode = 0;
          payload.msg = '添加成功';
        } else {
          payload.errCode = 1;
          payload.msg = '选择人数限制已经达到班级限制上限，请重新选择';
          ctx.socket.emit('setaddClassStudent', payload);
          return;
        }
      }
    } catch (err) {
      payload.errCode = 1;
      payload.msg = '' + err;
      // ctx.socket.emit('PushMessageToClient', err);
    }
    // console.log(payload);
    ctx.socket.emit('setaddClassStudent', payload);
  }

  async student1OptionList() {
    const { ctx } = this;
    const payload: ResponsePayload = {
      errCode: 0,
      msg: 'OK',
      data: {},
    };
    try {
      const { username } = ctx.packet[1];
      payload.errCode = 0;
      if (username) {
        payload.data = await ctx.model.User.find({ roleTypes: { $in: [ RoleType.Student ] }, displayName: { $regex: username } });
      } else {
        payload.data = await ctx.model.User.find({ roleTypes: { $in: [ RoleType.Student ] } });
      }
    } catch (err) {
      payload.errCode = 1;
      payload.msg = '' + err;
      // ctx.socket.emit('PushMessageToClient', err);
    }
    // console.log(payload);
    ctx.socket.emit('setstudent1OptionList', payload);
  }
  async getAddStudentList() {
    const { ctx } = this;
    const payload: ResponsePayload = {
      errCode: 0,
      msg: 'OK',
      data: {},
    };
    //  roleTypes: { $in: [ RoleType.SuperAdmin ] }
    //  .populate({ path: 'adminId', select: { displayName: 1 } })
    try {
      if (ctx.client.user.roleTypes.indexOf(RoleType.SuperAdmin) === -1 && ctx.client.user.roleTypes.indexOf(RoleType.SchoolAdmin) === -1 && ctx.client.user.roleTypes.indexOf(RoleType.Teacher) === -1) {
        payload.msg = '您没有此权限';
        payload.errCode = 1;
        ctx.socket.emit('setUserList', payload);
        return;
      }
      const { offset, limit, username, class2Name } = ctx.packet[1];
      payload.errCode = 0;
      if (class2Name) {
        if (username) {
          payload.data.count = await ctx.model.User.discriminators.Student.find({ roleTypes: { $in: [ RoleType.Student ] }, status: UserStatus.Activated, displayName: { $regex: username }, classId: class2Name }).count();
          payload.data.data = await ctx.model.User.discriminators.Student.find({ roleTypes: { $in: [ RoleType.Student ] }, status: UserStatus.Activated, displayName: { $regex: username }, classId: class2Name })
          .populate({ path: 'classId', select: { name: 1 } }).limit(limit).skip(offset);
        } else {
          payload.data.count = await ctx.model.User.discriminators.Student.find({ roleTypes: { $in: [ RoleType.Student ] }, status: UserStatus.Activated, classId: class2Name }).count();
          payload.data.data = await ctx.model.User.discriminators.Student.find({ roleTypes: { $in: [ RoleType.Student ] }, status: UserStatus.Activated, classId: class2Name })
          .populate({ path: 'classId', select: { name: 1 } }).limit(limit).skip(offset);
        }
      } else {
        if (username) {
          payload.data.count = await ctx.model.User.find({ roleTypes: { $in: [ RoleType.Student ] }, status: UserStatus.Activated, displayName: { $regex: username } }).count();
          payload.data.data = await ctx.model.User.find({ roleTypes: { $in: [ RoleType.Student ] }, status: UserStatus.Activated, displayName: { $regex: username } })
          .populate({ path: 'classId', select: { name: 1 } }).limit(limit).skip(offset);
        } else {
          payload.data.count = await ctx.model.User.find({ roleTypes: { $in: [ RoleType.Student ] }, status: UserStatus.Activated }).count();
          payload.data.data = await ctx.model.User.find({ roleTypes: { $in: [ RoleType.Student ] }, status: UserStatus.Activated })
          .populate({ path: 'classId', select: { name: 1 } }).limit(limit).skip(offset);
        }
      }
    } catch (err) {
      payload.errCode = 1;
      payload.msg = '' + err;
      // ctx.socket.emit('PushMessageToClient', err);
    }
    ctx.socket.emit('setgetAddStudentList', payload);
  }
  async testClient() {
    const { ctx } = this;
    try {
      const { msg } = ctx.packet[1];
      console.log('1111111111111');
      console.log(msg);
      const text = '1111111111111111111';
      ctx.socket.emit('testClient', text);
    } catch (err) {
      ctx.socket.emit('PushMessageToClient', err);
    }
  }
}
