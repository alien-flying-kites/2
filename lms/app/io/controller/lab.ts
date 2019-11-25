// tslint:disable: linebreak-style
import { Controller } from 'egg';
// import { ObjectId } from 'bson';
// import JwtPayload from '../../core/jwtPayload';
import ResponsePayload from './responsePayload';
import { RoleType } from '../../model/role';

declare module 'egg' {
  interface CustomController {
    lab: LabController;
  }
}

export default class LabController extends Controller {
  //  查询实验室列表
  async labIndex() {
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
        ctx.socket.emit('setlabList', payload);
        return;
      }
      const { offset, limit, username } = ctx.packet[1];
      payload.errCode = 0;
      if (username) {
        payload.data.count = await ctx.model.Lab.find({ name: username }).count();
        payload.data.data = await ctx.model.Lab.find({ name: username }).limit(limit).skip(offset).populate({ path: 'adminId', select: { displayName: 1 } });
      } else {
        payload.data.count = await ctx.model.Lab.find({ }).count();
        payload.data.data = await ctx.model.Lab.find({ }).limit(limit).skip(offset).populate({ path: 'adminId', select: { displayName: 1 } });
      }
    } catch (err) {
      payload.errCode = 1;
      payload.msg = '' + err;
      // ctx.socket.emit('PushMessageToClient', err);
    }
    ctx.socket.emit('setlabList', payload);
  }
  //  添加实验室
  async addLab() {
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
        ctx.socket.emit('setaddLab', payload);
        return;
      }
      const userInfo = ctx.packet[1];
      const courseCount = await ctx.model.Lab.count({ name: userInfo.name });
      if (courseCount > 0) {
        ctx.socket.emit('PushMessageToClient', '实验室名称已存在');
        return;
      }
      const newCourse = {
        name: userInfo.name,
        location: userInfo.location,
        description: userInfo.description,
        adminId: userInfo.adminId,
        createdAt: new Date(),
        createdBy: ctx.client.user._id,
        lastUpatedAt: new Date(),
        lastUpdatedBy: ctx.client.user._id,
      };
      payload.errCode = 0;
      const addUser = new ctx.model.Lab(newCourse);
      payload.data = await addUser.save();
      // console.log(payload);
      // ctx.socket.emit('setAddCourse', userFound);
    } catch (err) {
      const error = err as Error;
      payload.errCode = 1;
      if (error && error.message) {
        payload.msg = '' + error.message;
        // ctx.socket.emit('PushMessageToClient', error.message);
      } else {
        payload.msg = '' + error;
        ctx.socket.emit('PushMessageToClient', error);
      }
    }
    ctx.socket.emit('setaddLab', payload);
  }
  // 删除实验室
  async deleteLab() {
    const { ctx } = this;
    try {
      if (ctx.client.user.roleTypes.indexOf(RoleType.SuperAdmin) === -1 && ctx.client.user.roleTypes.indexOf(RoleType.SchoolAdmin) === -1) {
        ctx.socket.emit('PushMessageToClient', '您没有此权限');
        return;
      }
      const { id } = ctx.packet[1];
      if (!id) {
        ctx.socket.emit('PushMessageToClient', '参数错误');
        return;
      }
      const oldUser = await ctx.model.Lab.find({ _id: id });
      if (!oldUser) {
        ctx.socket.emit('PushMessageToClient', '该实验室不存在');
        return;
      }
      const result = await ctx.model.Lab.deleteOne({ _id: id });
      ctx.socket.emit('setdeleteCourse', result);

    } catch (err) {
      ctx.socket.emit('PushMessageToClient', err);
    }
  }

  async updateLab() {
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
        ctx.socket.emit('setupdateLab', payload);
        return;
      }
      const { id, name, adminId, location, description } = ctx.packet[1];
      if (!id) {
        ctx.socket.emit('PushMessageToClient', '参数错误');
        return;
      }
      if (!name) {
        ctx.socket.emit('PushMessageToClient', '实验室名称不能为空');
        return;
      }
      // const oldUser = await ctx.model.Lab.find({ _id: id });
      // if (!oldUser) {
      //   ctx.socket.emit('PushMessageToClient', '实验室不存在');
      //   return;
      // }
      const oldInfo = await ctx.model.Lab.findById({ _id: id });
      if (oldInfo) {
        const checkUid = await ctx.model.Lab.count({ name });
        if (checkUid > 0 && oldInfo.name !== name) {
          payload.msg = '实验室名称已经存在';
          payload.errCode = 1;
          ctx.socket.emit('setupdateLab', payload);
          return;
        }
      } else {
        // payload.msg = '课程不存在';
        payload.msg = '实验室不存在';
        payload.errCode = 1;
        ctx.socket.emit('setupdateLab', payload);
        // ctx.socket.emit('setCourseList', '实验室不存在');
        return;
      }
      payload.errCode = 0;
      payload.data = await ctx.model.Lab.updateOne({ _id: id }, { name, adminId, location, description, createdAt: new Date(), lastUpatedAt: new Date() });
    } catch (err) {
      payload.errCode = 1;
      payload.msg = '' + err;
      // ctx.socket.emit('PushMessageToClient', err);
    }
    ctx.socket.emit('setupdateLab', payload);
  }
  //  查询我的实验室列表
  async getMylab() {
    const { ctx } = this;
    const payload: ResponsePayload = {
      errCode: 0,
      msg: 'OK',
      data: {},
    };
    try {
      const { id, offset, limit } = ctx.packet[1];
      payload.errCode = 0;
      payload.data.count = await ctx.model.Lab.find({ adminId: id }).count();
      payload.data.data = await ctx.model.Lab.find({ adminId: id }).limit(limit).skip(offset).populate({ path: 'adminId', select: { displayName: 1 } });
      // ctx.socket.emit('setCourseList', userList);
    } catch (err) {
      payload.errCode = 1;
      payload.msg = '' + err;
      // ctx.socket.emit('PushMessageToClient', err);
    }
    ctx.socket.emit('setgetMylab', payload);
  }
  //  查询实验室列表
  async labOptionList() {
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
        ctx.socket.emit('setlabOptionList', payload);
        return;
      }
      payload.data.data = await ctx.model.Lab.find({ });
    } catch (err) {
      payload.errCode = 1;
      payload.msg = '' + err;
      // ctx.socket.emit('PushMessageToClient', err);
    }
    ctx.socket.emit('setlabOptionList', payload);
  }
}
