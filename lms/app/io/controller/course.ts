// tslint:disable: linebreak-style
import { Controller } from 'egg';
import { ObjectId } from 'bson';
// import JwtPayload from '../../core/jwtPayload';
import ResponsePayload from './responsePayload';
import { ClassRegistrationApprovalState } from '../../model/classRegistration';
import { ILessonModel } from '../../model/lesson';
import { IHomeworkModel } from '../../model/homework';
import { RoleType } from '../../model/role';
import { RepeatType } from '../../model/labReservation';
// var Book = mongoose.model('Book');
// import { Mongoose } from 'mongoose';
declare module 'egg' {
  interface CustomController {
    course: CourseController;
  }
}

export default class CourseController extends Controller {
  //  查询课程列表
  async coursesIndex() {
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
        ctx.socket.emit('setCourseList', payload);
        return;
      }
      const { offset, limit, username } = ctx.packet[1];
      payload.errCode = 0;
      if (username) {
        payload.data.count = await ctx.model.Course.find({ name: { $regex: username } }).count();
        // payload.data.data = await ctx.model.Course.find({ name: username }).limit(limit).skip(offset).populate({ path: 'adminId', select: { displayName: 1 } });
        payload.data.data = await ctx.model.Course.find({ name: { $regex: username } }).limit(limit).skip(offset);
      } else {
        payload.data.count = await ctx.model.Course.find({}).count();
        // payload.data.data = await ctx.model.Course.find({}).limit(limit).skip(offset).populate({ path: 'adminId', select: { displayName: 1 } });
        payload.data.data = await ctx.model.Course.find({}).limit(limit).skip(offset);
      }
      // ctx.socket.emit('setCourseList', userList);
    } catch (err) {
      payload.errCode = 1;
      payload.msg = '' + err;
      // ctx.socket.emit('PushMessageToClient', err);
    }
    ctx.socket.emit('setCourseList', payload);
  }

  //  添加课程
  async addCourse() {
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
        ctx.socket.emit('setCourseList', payload);
        return;
      }
      const userInfo = ctx.packet[1];
      const courseCount = await ctx.model.Course.count({ name: userInfo.courseName });
      if (courseCount > 0) {
        ctx.socket.emit('PushMessageToClient', '课程名称已存在');
        return;
      }
      const newCourse = {
        name: userInfo.courseName,
        classIds: [],
        description: userInfo.description,
        // adminId: userInfo.teacherId,
        createdAt: new Date(),
        createdBy: ctx.client.user._id,
        lastUpatedAt: new Date(),
        lastUpdatedBy: ctx.client.user._id,
      };
      payload.errCode = 0;
      const addUser = new ctx.model.Course(newCourse);
      payload.data = await addUser.save();
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
    ctx.socket.emit('setAddCourse', payload);
  }
  // 删除课程
  // 若删除课程，则对应的班级也全部删除，班级对应的全部课次也全部删除
  async deleteCourse() {
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
      const oldUser = await ctx.model.Course.find({ _id: id });
      if (!oldUser) {
        ctx.socket.emit('PushMessageToClient', '该课程不存在');
        return;
      }
      const _aa = await ctx.model.Class.find({ courseId: id });
      const result = await ctx.model.Course.deleteOne({ _id: id });
      const _result = await ctx.model.Class.deleteMany({ courseId: id });
      await ctx.model.Lesson.deleteMany({ courseId: id });
      await ctx.model.Lesson.deleteMany({ courseId: id });
      if (_aa && _aa.length >= 1) {
        for (const i in _aa) {
          await ctx.model.ClassRegistration.deleteMany({ classId: _aa[i]._id });
          await ctx.model.LabReservation.deleteMany({ classId: _aa[i]._id });
        }
      }
      ctx.socket.emit('setdeleteCourse', result, _result);

    } catch (err) {
      ctx.socket.emit('PushMessageToClient', err);
    }
  }
  //  更新课程
  async updateCourse() {
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
        ctx.socket.emit('setupdateCourse', payload);
        return;
      }
      const { id, courseName, description } = ctx.packet[1];
      if (!id) {
        payload.msg = '参数错误';
        payload.errCode = 1;
        ctx.socket.emit('setupdateCourse', payload);
        return;
      }
      if (!courseName) {
        payload.msg = '课程名不能为空';
        payload.errCode = 1;
        ctx.socket.emit('setupdateCourse', payload);
        return;
      }
      const oldInfo = await ctx.model.Course.findById({ _id: id });
      if (oldInfo) {
        const checkUid = await ctx.model.Course.count({ name: courseName });
        if (checkUid > 0 && oldInfo.name !== courseName) {
          payload.msg = '课程名称已存在';
          payload.errCode = 1;
          ctx.socket.emit('setupdateCourse', payload);
          return;
        }
      } else {
        payload.msg = '课程不存在';
        payload.errCode = 1;
        ctx.socket.emit('setupdateCourse', payload);
        return;
      }
      payload.errCode = 0;
      payload.msg = '修改成功';
      payload.data = await ctx.model.Course.updateOne({ _id: id }, { name: courseName, description, createdAt: new Date(), lastUpatedAt: new Date() });
      // ctx.socket.emit('setupdateCourse', result);

    } catch (err) {
      payload.errCode = 1;
      payload.msg = '' + err;
      // ctx.socket.emit('PushMessageToClient', err);
    }
    ctx.socket.emit('setupdateCourse', payload);
  }

  //  查询课程详情列表
  async courseDetailIndex() {
    const { ctx } = this;
    const payload: ResponsePayload = {
      errCode: 0,
      msg: 'OK',
      data: {},
    };
    try {
      if (ctx.client.user.roleTypes.indexOf(RoleType.SuperAdmin) === -1 && ctx.client.user.roleTypes.indexOf(RoleType.SchoolAdmin) === -1 && ctx.client.user.roleTypes.indexOf(RoleType.CourseAdmin) === -1) {
        payload.msg = '您没有此权限';
        payload.errCode = 1;
        ctx.socket.emit('setCourseDetailList', payload);
        return;
      }
      const { id, offset, limit, username } = ctx.packet[1];
      payload.errCode = 0;
      if (username) {
        payload.data.count = await ctx.model.Class.find({ courseId: id, name: { $regex: username } }).count();
        payload.data.data = await ctx.model.Class.find({ courseId: id, name: { $regex: username } }).limit(limit).skip(offset)
          .populate({ path: 'teacherId', select: { displayName: 1 } });
        // .populate({ path: 'adminId', select: { displayName: 1 } });
      } else {
        payload.data.count = await ctx.model.Class.find({ courseId: id }).count();
        payload.data.data = await ctx.model.Class.find({ courseId: id }).limit(limit).skip(offset)
          .populate({ path: 'teacherId', select: { displayName: 1 } });
        // .populate({ path: 'adminId', select: { displayName: 1 } });
      }
    } catch (err) {
      payload.errCode = 1;
      payload.msg = '' + err;
      // ctx.socket.emit('PushMessageToClient', err);
    }
    ctx.socket.emit('setCourseDetailList', payload);
  }

  //  添加课程班级列表
  async addCoursesClass() {
    const { ctx } = this;
    const payload: ResponsePayload = {
      errCode: 0,
      msg: 'OK',
      data: {},
    };
    try {
      if (ctx.client.user.roleTypes.indexOf(RoleType.SuperAdmin) === -1 && ctx.client.user.roleTypes.indexOf(RoleType.SchoolAdmin) === -1 && ctx.client.user.roleTypes.indexOf(RoleType.CourseAdmin) === -1) {
        payload.msg = '您没有此权限';
        payload.errCode = 1;
        ctx.socket.emit('setCourseDetailList', payload);
        return;
      }
      const userInfo = ctx.packet[1];
      const checkUid = await ctx.model.Course.find({ name: userInfo.className });
      if (checkUid.length > 0) {
        ctx.socket.emit('PushMessageToClient', '班级名称已存在');
        return;
      }
      const addClass = new ctx.model.Class({
        courseId: userInfo.courseId,
        name: userInfo.className,
        description: userInfo.description,
        teacherId: userInfo.teacherId,
        // adminId: userInfo.classTeacherId,
        dateToOpenClass: userInfo.startTime,
        isOpenForRegisteration: userInfo.isOpenForRegisteration,
        studentIds: [],
        studentLimit: userInfo.limit,
        createdAt: new Date(),
        isSignup: false,
        createdBy: ctx.client.user._id,
        lastUpatedAt: new Date(),
        lastUpdatedBy: ctx.client.user._id,
      });
      payload.errCode = 0;
      payload.msg = '添加成功';
      payload.data = await addClass.save();
      // ctx.socket.emit('setAddCourseClass', classFound);
    } catch (err) {
      payload.errCode = 1;
      payload.msg = '' + err;
      // ctx.socket.emit('PushMessageToClient', err);
    }
    ctx.socket.emit('setAddCourseClass', payload);
  }

  //  修改课程详情(某班级信息)
  async updateCourseDetail() {
    const { ctx } = this;
    try {
      if (ctx.client.user.roleTypes.indexOf(RoleType.SuperAdmin) === -1 && ctx.client.user.roleTypes.indexOf(RoleType.SchoolAdmin) === -1 && ctx.client.user.roleTypes.indexOf(RoleType.CourseAdmin) === -1) {
        ctx.socket.emit('setupdateCourseDetail', '您没有此权限');
        return;
      }
      const { id, courseId, className, teacherId, limit, startTime, description, isOpenForRegisteration } = ctx.packet[1];
      if (!id) {
        ctx.socket.emit('PushMessageToClient', '参数错误');
        return;
      }
      const oldInfo = await ctx.model.Class.findById({ _id: id });
      if (oldInfo) {
        const checkUid = await ctx.model.Class.count({ name: className });
        if (checkUid > 0 && oldInfo.name !== className) {
          // payload.msg = '课程名称已存在';
          ctx.socket.emit('PushMessageToClient', '班级名称已存在');
          return;
        }
      } else {
        // payload.msg = '课程不存在';
        ctx.socket.emit('setCourseList', '班级不存在');
        return;
      }
      const result = await ctx.model.Class.updateOne({ _id: id },
        {
          courseId, name: className, teacherId,
          studentLimit: limit, dateToOpenClass: startTime, description,
          isOpenForRegisteration, createdAt: new Date(), lastUpatedAt: new Date(),
        });
      const _ids = await ctx.model.Lesson.find({ classId: id });
      for (const i in _ids) {
        // const _user = await ctx.model.User.find({ _id: _ids[i]._id });
        await ctx.model.Lesson.updateOne({ _id: _ids[i]._id }, { teacherId, createdAt: new Date(), lastUpatedAt: new Date() });
      }
      ctx.socket.emit('setupdateCourseDetail', result);

    } catch (err) {
      ctx.socket.emit('PushMessageToClient', err);
    }
  }

  // 删除某课程班级信息
  // 若删除某班级，则该班级对应的所有的课次也将全部删除
  async deleteCourseDetail() {
    const { ctx } = this;
    try {
      if (ctx.client.user.roleTypes.indexOf(RoleType.SuperAdmin) === -1 && ctx.client.user.roleTypes.indexOf(RoleType.SchoolAdmin) === -1 && ctx.client.user.roleTypes.indexOf(RoleType.CourseAdmin) === -1) {
        ctx.socket.emit('PushMessageToClient', '您没有此权限');
        return;
      }
      const { id } = ctx.packet[1];
      if (!id) {
        ctx.socket.emit('PushMessageToClient', '参数错误');
        return;
      }
      const oldInfo = await ctx.model.Class.find({ _id: id });
      if (!oldInfo) {
        ctx.socket.emit('PushMessageToClient', '该课程不存在');
        return;
      }
      const result = await ctx.model.Class.deleteOne({ _id: id });
      const _result = await ctx.model.Lesson.deleteMany({ classId: id });
      const _aa = await ctx.model.ClassRegistration.deleteMany({ classId: id });
      console.log('_aa 000000000000000000000000000000000000000000000000000000000');
      console.log(_aa);
      ctx.socket.emit('setdeleteCourseDetail', result, _result);

    } catch (err) {
      ctx.socket.emit('PushMessageToClient', err);
    }
  }
  //  获取班级学生列表
  async getStudentList() {
    const { ctx } = this;
    const payload: ResponsePayload = {
      errCode: 0,
      msg: 'OK',
      data: {},
    };
    try {
      if (ctx.client.user.roleTypes.indexOf(RoleType.SuperAdmin) === -1 && ctx.client.user.roleTypes.indexOf(RoleType.SchoolAdmin) === -1 && ctx.client.user.roleTypes.indexOf(RoleType.ClassAdmin) === -1 && ctx.client.user.roleTypes.indexOf(RoleType.Teacher) === -1) {
        ctx.socket.emit('PushMessageToClient', '您没有此权限');
        return;
      }
      const { offset, limit, classid } = ctx.packet[1];
      payload.errCode = 0;
      const query = ctx.model.Class.aggregate([
        { $match: { _id: ObjectId.createFromHexString(classid) } },
        { $unwind: '$studentIds' },
        {
          $addFields: {
            'studentIds._id': '$studentIds',
            'studentIds.name': '$name',
          },
        },
        {
          $replaceRoot: {
            newRoot: '$studentIds',
          },
        },
      ]);
      const countDocs = await Object.create(query).count('number');
      if (countDocs.length > 0) {
        payload.data.count = countDocs[0].number;
      } else {
        payload.data.count = 0;
      }
      const students = await query.skip(offset).limit(limit);
      const studentIds = students.map(x => x._id);
      const users = await ctx.model.User.find({ _id: { $in:  studentIds } }, { displayName: 1 });
      const usersMap = users.reduce((map, obj) => {
        map[obj._id] = obj;
        return map;
      }, {});
      students.forEach(lm => {
        if (usersMap[lm._id]) {
          lm._id = usersMap[lm._id];
        }
      });
      payload.data.data = students;
      //

    } catch (err) {
      payload.errCode = 1;
      payload.msg = '' + err;
      // ctx.socket.emit('PushMessageToClient', err);
    }
    // console.log(payload);
    ctx.socket.emit('setgetStudentList', payload);
  }
  // 删除课程班学生
  async deleteClassStudent() {
    const { ctx } = this;
    const payload: ResponsePayload = {
      errCode: 0,
      msg: 'OK',
      data: {},
    };
    try {
      if (ctx.client.user.roleTypes.indexOf(RoleType.SuperAdmin) === -1 && ctx.client.user.roleTypes.indexOf(RoleType.SchoolAdmin) === -1 && ctx.client.user.roleTypes.indexOf(RoleType.Teacher) === -1) {
        ctx.socket.emit('PushMessageToClient', '您没有此权限');
        return;
      }
      const { id, classId } = ctx.packet[1];
      if (!id) {
        payload.msg = '参数错误';
        payload.errCode = 1;
        ctx.socket.emit('setdeleteClassStudent', payload);
        return;
      }
      const oldUser = await ctx.model.Class.find({ _id: id });
      if (!oldUser) {
        payload.msg = '该班级不存在';
        payload.errCode = 1;
        ctx.socket.emit('setdeleteClassStudent', payload);
        return;
      }
      const oldStu = await ctx.model.Class.find({ _id: classId, studentIds: { $in: id } });
      if (!oldStu) {
        payload.msg = '该学生不在此班级';
        payload.errCode = 1;
        ctx.socket.emit('setdeleteClassStudent', payload);
        return;
      }
      payload.data = await ctx.model.Class.findByIdAndUpdate(classId, { $pull: { studentIds: id } });
      payload.msg = '删除成功';
      payload.errCode = 0;
    } catch (err) {
      payload.msg = err;
      payload.errCode = 1;
    }
    ctx.socket.emit('setdeleteClassStudent', payload);
  }
  //  查询全部班级列表
  async classIndex() {
    const { ctx } = this;
    const payload: ResponsePayload = {
      errCode: 0,
      msg: 'OK',
      data: {},
    };
    try {
      if (ctx.client.user.roleTypes.indexOf(RoleType.SuperAdmin) === -1 && ctx.client.user.roleTypes.indexOf(RoleType.SchoolAdmin) === -1 && ctx.client.user.roleTypes.indexOf(RoleType.Student) === -1) {
        payload.msg = '您没有此权限';
        payload.errCode = 1;
        ctx.socket.emit('setclassList', payload);
        return;
      }
      const { offset, limit, username } = ctx.packet[1];
      payload.errCode = 0;
      if (username) {
        payload.data.count = await ctx.model.Class.find({ name: { $regex: username } }).count();
        payload.data.data = await ctx.model.Class.find({ name: { $regex: username } }).limit(limit).skip(offset)
          .populate({ path: 'courseId', select: { name: 1 } })
          .populate({ path: 'teacherId', select: { displayName: 1 } });
        // .populate({ path: 'adminId', select: { displayName: 1 } });
      } else {
        payload.data.count = await ctx.model.Class.find({}).count();
        payload.data.data = await ctx.model.Class.find({}).limit(limit).skip(offset)
          .populate({ path: 'courseId', select: { name: 1 } })
          .populate({ path: 'teacherId', select: { displayName: 1 } });
        // .populate({ path: 'adminId', select: { displayName: 1 } });
      }
    } catch (err) {
      payload.errCode = 1;
      payload.msg = '' + err;
      // ctx.socket.emit('PushMessageToClient', err);
    }
    ctx.socket.emit('setclassList', payload);
  }
 //  查询全部班级列表
  async signUpClassIndex() {
    const { ctx } = this;
    const payload: ResponsePayload = {
      errCode: 0,
      msg: 'OK',
      data: {},
    };
    try {
      if (ctx.client.user.roleTypes.indexOf(RoleType.SuperAdmin) === -1 && ctx.client.user.roleTypes.indexOf(RoleType.SchoolAdmin) === -1 && ctx.client.user.roleTypes.indexOf(RoleType.Student) === -1) {
        payload.msg = '您没有此权限';
        payload.errCode = 1;
        ctx.socket.emit('setsignUpClassIndex', payload);
        return;
      }
      const { offset, limit } = ctx.packet[1];
      payload.errCode = 0;
      payload.data.count = await ctx.model.Class.find({ isOpenForRegisteration: true }).count();
      payload.data.data = await ctx.model.Class.find({ isOpenForRegisteration: true }).limit(limit).skip(offset)
        .populate({ path: 'courseId', select: { name: 1 } })
        .populate({ path: 'teacherId', select: { displayName: 1 } });
      // .populate({ path: 'adminId', select: { displayName: 1 } });
    } catch (err) {
      payload.errCode = 1;
      payload.msg = '' + err;
      // ctx.socket.emit('PushMessageToClient', err);
    }
    ctx.socket.emit('setsignUpClassIndex', payload);
  }
  //  查询报名列表
  async signupIndex() {
    const { ctx } = this;
    const payload: ResponsePayload = {
      errCode: 0,
      msg: 'OK',
      data: {},
    };
    try {
      payload.errCode = 0;
      payload.data = await ctx.model.Class.find({ isOpenForRegisteration: true });
      // ctx.socket.emit('setCourseList', userList);
    } catch (err) {
      payload.errCode = 1;
      payload.msg = '' + err;
      // ctx.socket.emit('PushMessageToClient', err);
    }
    ctx.socket.emit('setclassList', payload);
  }

  //  报名列表
  async singup() {
    const { ctx } = this;
    try {
      if (ctx.client.user.roleTypes.indexOf(RoleType.Student) === -1) {
        ctx.socket.emit('PushMessageToClient', '您没有此权限');
        return;
      }
      // const { id, offset, limit } = ctx.packet[1];
      const userInfo = ctx.packet[1];
      const cls = await ctx.model.Class.findById(userInfo.classId);
      if (cls !== null && cls.studentIds.indexOf(userInfo.studentId) >= 0) {
        ctx.socket.emit('PushMessageToClient', '你已经成为该班学生，请勿重复报名');
        return;
      }
      const checkUid = await ctx.model.ClassRegistration.find({ studentId: userInfo.studentId, classId: userInfo.classId });
      if (checkUid.length > 0) {
        ctx.socket.emit('PushMessageToClient', '已报名该课程');
        return;
      }
      const data = new ctx.model.ClassRegistration({
        teacherId: userInfo.teacherId,
        classId: userInfo.classId,
        studentId: userInfo.studentId,
        acceptClassAdjustment: userInfo.acceptClassAdjustment,
        approvalState: 1,
        createdAt: new Date(),
        createdBy: ctx.client.user._id,
        lastUpatedAt: new Date(),
        lastUpdatedBy: ctx.client.user._id,
      });
      const classFound = await data.save();
      ctx.socket.emit('setsingup', classFound);
    } catch (err) {
      ctx.socket.emit('PushMessageToClient', err);
    }
  }

  async signupList() {
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
        ctx.socket.emit('setsignupList', payload);
        return;
      }
      const { offset, limit } = ctx.packet[1];
      payload.errCode = 0;
      payload.data.count = await ctx.model.ClassRegistration.find({}).count();
      payload.data.data = await ctx.model.ClassRegistration.find({}).limit(limit).skip(offset)
        .populate({ path: 'classId', select: { name: 1 } })
        .populate({ path: 'studentId', select: { displayName: 1 } })
        .populate({ path: 'adjustedClassId', select: { name: 1 } });
      // ctx.socket.emit('setCourseList', userList);
    } catch (err) {
      payload.errCode = 1;
      payload.msg = '' + err;
      // ctx.socket.emit('PushMessageToClient', err);
    }
    ctx.socket.emit('setsignupList', payload);
  }
  //  删除班级
  async deleteClass() {
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
      const oldUser = await ctx.model.Class.find({ _id: id });
      if (!oldUser) {
        ctx.socket.emit('PushMessageToClient', '该课程不存在');
        return;
      }
      const result = await ctx.model.Class.deleteOne({ _id: id });
      const _result = await ctx.model.Lesson.deleteMany({ classId: id });
      ctx.socket.emit('setdeleteCourse', result, _result);

    } catch (err) {
      ctx.socket.emit('PushMessageToClient', err);
    }
  }

  //  查询课次列表
  async LessonIndex() {
    const { ctx } = this;
    const payload: ResponsePayload = {
      errCode: 0,
      msg: 'OK',
      data: {},
    };
    try {
      // if (ctx.client.user.roleTypes.indexOf(RoleType.SuperAdmin) === -1 && ctx.client.user.roleTypes.indexOf(RoleType.SchoolAdmin) === -1 && ctx.client.user.roleTypes.indexOf(RoleType.Teacher) === -1 && ctx.client.user.roleTypes.indexOf(RoleType.ClassAdmin) === -1) {
      //   payload.msg = '您没有此权限';
      //   payload.errCode = 1;
      //   ctx.socket.emit('setsignupList', payload);
      //   return;
      // }
      const { id, offset, limit, username } = ctx.packet[1];
      payload.errCode = 0;
      if (username) {
        payload.data.count = await ctx.model.Lesson.find({ classId: id, name: { $regex: username } }).count();
        payload.data.data = await ctx.model.Lesson.find({ classId: id, name: { $regex: username } }).limit(limit).skip(offset)
          .populate({ path: 'classId', select: { name: 1 } })
          .populate({ path: 'labId', select: { name: 1 } })
          .populate({ path: 'teacherId', select: { displayName: 1 } }).sort({ date: 1, startTime: 1 });
        // .populate({ path: 'adminId', select: { displayName: 1 } });
      } else {
        payload.data.count = await ctx.model.Lesson.find({ classId: id }).count();
        payload.data.data = await ctx.model.Lesson.find({ classId: id }).limit(limit).skip(offset)
          .populate({ path: 'labId', select: { name: 1 } })
          .populate({ path: 'classId', select: { name: 1 } })
          .populate({ path: 'teacherId', select: { displayName: 1 } }).sort({ date: 1, startTime: 1 });
        // .populate({ path: 'adminId', select: { displayName: 1 } });
      }
    } catch (err) {
      payload.errCode = 1;
      payload.msg = '' + err;
      // ctx.socket.emit('PushMessageToClient', err);
    }
    ctx.socket.emit('setLessonList', payload);
  }

  //  删除课次
  async deleteLesson() {
    const { ctx } = this;
    try {
      if (ctx.client.user.roleTypes.indexOf(RoleType.SuperAdmin) === -1 && ctx.client.user.roleTypes.indexOf(RoleType.SchoolAdmin) === -1 && ctx.client.user.roleTypes.indexOf(RoleType.Teacher) === -1) {
        ctx.socket.emit('PushMessageToClient', '您没有此权限');
        return;
      }
      const { id } = ctx.packet[1];
      if (!id) {
        ctx.socket.emit('PushMessageToClient', '参数错误');
        return;
      }
      const oldUser = await ctx.model.Lesson.find({ _id: id });
      if (!oldUser) {
        ctx.socket.emit('PushMessageToClient', '该课程不存在');
        return;
      }
      const result = await ctx.model.Lesson.deleteOne({ _id: id });
      ctx.socket.emit('setdeleteLesson', result);

    } catch (err) {
      ctx.socket.emit('PushMessageToClient', err);
    }
  }

  //  修改课次信息
  async updateLesson() {
    const { ctx } = this;
    try {
      if (ctx.client.user.roleTypes.indexOf(RoleType.SuperAdmin) === -1 && ctx.client.user.roleTypes.indexOf(RoleType.SchoolAdmin) === -1 && ctx.client.user.roleTypes.indexOf(RoleType.Teacher) === -1) {
        ctx.socket.emit('PushMessageToClient', '您没有此权限');
        return;
      }
      const { id, courseId, classId, teacherId, remark, name } = ctx.packet[1];
      if (!id) {
        ctx.socket.emit('PushMessageToClient', '参数错误');
        return;
      }
      // const oldUser = await ctx.model.Lesson.find({ _id: id });
      // if (!oldUser) {
      //   ctx.socket.emit('PushMessageToClient', '课次不存在');
      //   return;
      // }
      const oldInfo = await ctx.model.Lesson.findById({ _id: id });
      if (oldInfo) {
        const checkUid = await ctx.model.Lesson.count({ name });
        if (checkUid > 0 && oldInfo.name !== name) {
          ctx.socket.emit('PushMessageToClient', '课次名称已存在，建议换个名字');
          return;
        }
      } else {
        ctx.socket.emit('PushMessageToClient', '课次不存在');
        return;
      }
      // const checkUid = await ctx.model.Lesson.find({ name });
      // if (checkUid.length > 0) {
      //   ctx.socket.emit('PushMessageToClient', '课次名称已存在，建议换个名字');
      //   return;
      // }
      const result = await ctx.model.Lesson.updateOne({ _id: id },
        {
          courseId, classId, name, teacherId, description: remark,
          createdAt: new Date(), lastUpatedAt: new Date(),
        });
      ctx.socket.emit('setupdateLesson', result);

    } catch (err) {
      ctx.socket.emit('PushMessageToClient', err);
    }
  }

  // //  添加课次
  // async addLesson() {
  //   const { ctx } = this;
  //   const payload: ResponsePayload = {
  //     errCode: 0,
  //     msg: 'OK',
  //     data: {},
  //   };
  //   try {
  //     if (ctx.client.user.roleTypes.indexOf(RoleType.SuperAdmin) === -1 && ctx.client.user.roleTypes.indexOf(RoleType.SchoolAdmin) === -1 && ctx.client.user.roleTypes.indexOf(RoleType.Teacher) === -1) {
  //       payload.msg = '您没有此权限';
  //       payload.errCode = 1;
  //       ctx.socket.emit('setsignupList', payload);
  //       return;
  //     }
  //     const userInfo = ctx.packet[1];
  //     const checkUid = await ctx.model.Lesson.find({ name: userInfo.name });
  //     if (checkUid.length > 0) {
  //       ctx.socket.emit('PushMessageToClient', '课次名称已存在，建议换个名字');
  //       return;
  //     }
  //     const addLesson = new ctx.model.Lesson({
  //       classId: userInfo.classId,
  //       courseId: userInfo.courseId,
  //       teacherId: userInfo.teacherId,
  //       description: userInfo.remark,
  //       lessonMaterialItems: userInfo.lessonMaterialItems,
  //       absentStudentIds: [],
  //       attendantStudentIds: [],
  //       createdAt: new Date(),
  //       createdBy: ctx.client.user._id,
  //       lastUpatedAt: new Date(),
  //       lastUpdatedBy: ctx.client.user._id,
  //     });
  //     // console.log('addLesson 0000000000000000000000000000000000000000000000000');
  //     // console.log(addLesson);
  //     payload.errCode = 0;
  //     payload.data = await addLesson.save();
  //     // ctx.socket.emit('setAddCourseClass', classFound);
  //   } catch (err) {
  //     payload.errCode = 1;
  //     payload.msg = '' + err;
  //     // ctx.socket.emit('PushMessageToClient', err);
  //   }
  //   ctx.socket.emit('setaddLesson', payload);
  // }

  //  获取课程列表
  async courseOptionList() {
    const { ctx } = this;
    const payload: ResponsePayload = {
      errCode: 0,
      msg: 'OK',
      data: {},
    };
    try {
      payload.errCode = 0;
      payload.data = await ctx.model.Course.find();
    } catch (err) {
      payload.errCode = 1;
      payload.msg = '' + err;
      // ctx.socket.emit('PushMessageToClient', err);
    }
    // console.log(payload);
    ctx.socket.emit('setcourseOptionList', payload);
  }
  //  获取逻辑班级列表
  async classOptionList() {
    const { ctx } = this;
    const payload: ResponsePayload = {
      errCode: 0,
      msg: 'OK',
      data: {},
    };
    try {
      payload.errCode = 0;
      payload.data = await ctx.model.Class.find();
    } catch (err) {
      payload.errCode = 1;
      payload.msg = '' + err;
      // ctx.socket.emit('PushMessageToClient', err);
    }
    // console.log(payload);
    ctx.socket.emit('setclassOptionList', payload);
  }
    //  获取逻辑班级列表
  async classAdjustOptionList() {
    const { ctx } = this;
    const payload: ResponsePayload = {
      errCode: 0,
      msg: 'OK',
      data: {},
    };
    try {
      payload.errCode = 0;
      payload.data = await ctx.model.Class.find({ isOpenForRegisteration: true });
    } catch (err) {
      payload.errCode = 1;
      payload.msg = '' + err;
      // ctx.socket.emit('PushMessageToClient', err);
    }
    // console.log(payload);
    ctx.socket.emit('setclassAdjustOptionList', payload);
  }

  //  更新报名审核在状态
  async updateSignupState() {
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
        ctx.socket.emit('setupdateSignupState', payload);
        return;
      }
      const { id, approvalState, adjustedClassId } = ctx.packet[1];
      if (!id) {
        ctx.socket.emit('PushMessageToClient', '参数错误');
        return;
      }
      const oldInfo = await ctx.model.ClassRegistration.findById(id);
      if (!oldInfo) {
        ctx.socket.emit('PushMessageToClient', '报名信息不存在');
        return;
      }
      if (oldInfo.approvalState === approvalState
        && (approvalState === ClassRegistrationApprovalState.Approved || approvalState === ClassRegistrationApprovalState.Rejected)) {
        ctx.socket.emit('PushMessageToClient', '已通过或已拒绝，无需重复操作');
        return;
      }
      // 如果更改审核状态，需要先撤回之前的处理
      if (oldInfo.approvalState === ClassRegistrationApprovalState.Approved) {
        await ctx.model.Class.findByIdAndUpdate(oldInfo.classId, { $pull: { studentIds: oldInfo.studentId } });
      }
      if (oldInfo.approvalState === ClassRegistrationApprovalState.Adjusted) {
        await ctx.model.Class.findByIdAndUpdate(oldInfo.adjustedClassId, { $pull: { studentIds: oldInfo.studentId } });
      }
      payload.errCode = 0;
      payload.data = await ctx.model.ClassRegistration.updateOne({ _id: id }, { approvalState, adjustedClassId });
      payload.msg = '修改成功';
      if (approvalState === ClassRegistrationApprovalState.Approved) {
        await ctx.model.Class.findByIdAndUpdate(oldInfo.classId, { $addToSet: { studentIds: oldInfo.studentId } });
      }
      if (approvalState === ClassRegistrationApprovalState.Adjusted) {
        await ctx.model.Class.findByIdAndUpdate(adjustedClassId, { $addToSet: { studentIds: oldInfo.studentId } });
      }
    } catch (err) {
      // ctx.socket.emit('PushMessageToClient', err);
      payload.errCode = 1;
      payload.msg = '' + err;
    }
    // ctx.socket.emit('setupdateUser', payload);
    ctx.socket.emit('setupdateSignupState', payload);
  }

  //  获取课次列表
  async lessonOptionList() {
    const { ctx } = this;
    const payload: ResponsePayload = {
      errCode: 0,
      msg: 'OK',
      data: {},
    };
    try {
      payload.errCode = 0;
      payload.data = await ctx.model.Lesson.find();
    } catch (err) {
      payload.errCode = 1;
      payload.msg = '' + err;
      // ctx.socket.emit('PushMessageToClient', err);
    }
    ctx.socket.emit('setlessonOptionList', payload);
  }
  //  添加教案
  async addLessonMaterial() {
    const { ctx } = this;
    try {
      const { lessonMaterialType, lessonMaterialDescription, lessonMaterialFilePath, id } = ctx.packet[1];
      const oldUser = await ctx.model.Lesson.find({ _id: id });
      if (!oldUser) {
        ctx.socket.emit('PushMessageToClient', '课次不存在');
        return;
      }
      const data = {
        materialItemType: lessonMaterialType,
        filePath: lessonMaterialFilePath,
        description: lessonMaterialDescription,
      };
      const result = await ctx.model.Lesson.updateOne({ _id: id },
        { $addToSet: { lessonMaterialItems: data } });
      ctx.socket.emit('setupdateLesson', result);
    } catch (err) {
      ctx.socket.emit('PushMessageToClient', err);
    }
  }

  //  获取我的教案列表
  async getMyLessonPlan() {
    const { ctx } = this;
    const payload: ResponsePayload = {
      errCode: 0,
      msg: 'OK',
      data: {},
    };
    try {
      if (ctx.client.user.roleTypes.indexOf(RoleType.SuperAdmin) === -1 && ctx.client.user.roleTypes.indexOf(RoleType.SchoolAdmin) === -1 && ctx.client.user.roleTypes.indexOf(RoleType.Teacher) === -1) {
        payload.msg = '您没有此权限';
        payload.errCode = 1;
        ctx.socket.emit('setgetMyLessonPlan', payload);
        return;
      }
      const { offset, limit } = ctx.packet[1];
      payload.errCode = 0;
      // find the classes I am teaching
      // const myClasses = (await ctx.model.Class.find({ teacherId: ctx.client.user._id }, { _id: 1 })) || [];
      const myLesson = (await ctx.model.Lesson.find({ teacherId: ctx.client.user._id }, { _id: 1 })) || [];
      // const myClassIds = myClasses.map(x => x._id);
      const myLessonIds = myLesson.map(x => x._id);
      const query = ctx.model.Lesson.aggregate([
        // { $match: { classId: { $in: myClassIds }, teacherId: { $in: myLessonIds } } },
        { $match: { _id: { $in: myLessonIds } } },
        { $unwind: '$lessonMaterialItems' },
        {
          $addFields: {
            'lessonMaterialItems._id': '$_id',
            'lessonMaterialItems.classId': '$classId',
            'lessonMaterialItems.courseId': '$courseId',
            'lessonMaterialItems.name': '$name',
            'lessonMaterialItems.time': '$date',
            'lessonMaterialItems.teacherId': '$teacherId',
          },
        },
        {
          $replaceRoot: {
            newRoot: '$lessonMaterialItems',
          },
        },
      ]);
      const countDocs = await Object.create(query).count('number');
      if (countDocs.length > 0) {
        payload.data.count = countDocs[0].number;
      } else {
        payload.data.count = 0;
      }
      const lessonMaterials = await query.skip(offset).limit(limit);
      // replace classId
      const classIds: string[] = [];
      const courseIds: string[] = [];
      const teacherIds: string[] = [];
      lessonMaterials.forEach(lm => {
        classIds.push(lm.classId);
        courseIds.push(lm.courseId);
        teacherIds.push(lm.teacherId);
      });
      const classes = await ctx.model.Class.find({ _id: { $in: classIds } }, { name: 1 });
      const classesMap = classes.reduce((map, obj) => {
        map[obj._id] = obj;
        return map;
      }, {});
      const courses = await ctx.model.Course.find({ _id: { $in: courseIds } }, { name: 1 });
      const coursesMap = courses.reduce((map, obj) => {
        map[obj._id] = obj;
        return map;
      }, {});
      const users = await ctx.model.User.find({ _id: { $in: teacherIds } }, { displayName: 1 });
      const usersMap = users.reduce((map, obj) => {
        map[obj._id] = obj;
        return map;
      }, {});
      lessonMaterials.forEach(lm => {
        lm.classId = classesMap[lm.classId];
        lm.courseId = coursesMap[lm.courseId];
        lm.teacherId = usersMap[lm.teacherId];
      });
      payload.data.data = lessonMaterials;

      // .limit(limit)
      // .skip(offset);
    } catch (err) {
      payload.errCode = 1;
      payload.msg = '' + err;
      // ctx.socket.emit('PushMessageToClient', err);
    }
    ctx.socket.emit('setgetMyLessonPlan', payload);
  }
  //  获取全部教师上传的教案列表
  async getAllLessonPlan() {
    const { ctx } = this;
    const payload: ResponsePayload = {
      errCode: 0,
      msg: 'OK',
      data: {},
    };
    try {
      if (ctx.client.user.roleTypes.indexOf(RoleType.SuperAdmin) === -1 && ctx.client.user.roleTypes.indexOf(RoleType.SchoolAdmin) === -1 && ctx.client.user.roleTypes.indexOf(RoleType.Teacher) === -1) {
        payload.msg = '您没有此权限';
        payload.errCode = 1;
        ctx.socket.emit('setgetAllLessonPlan', payload);
        return;
      }
      const { offset, limit } = ctx.packet[1];
      payload.errCode = 0;
      const query = ctx.model.Lesson.aggregate([
        { $unwind: '$lessonMaterialItems' },
        {
          $addFields: {
            'lessonMaterialItems._id': '$_id',
            'lessonMaterialItems.classId': '$classId',
            'lessonMaterialItems.courseId': '$courseId',
            'lessonMaterialItems.name': '$name',
            'lessonMaterialItems.time': '$date',
            'lessonMaterialItems.teacherId': '$teacherId',
          },
        },
        {
          $replaceRoot: {
            newRoot: '$lessonMaterialItems',
          },
        },
      ]);
      const countDocs = await Object.create(query).count('number');
      if (countDocs.length > 0) {
        payload.data.count = countDocs[0].number;
      } else {
        payload.data.count = 0;
      }
      // payload.data.count = countDocs[0].number;
      const lessonMaterials = await query.skip(offset).limit(limit);
      // replace classId
      const classIds: string[] = [];
      const courseIds: string[] = [];
      const teacherIds: string[] = [];
      lessonMaterials.forEach(lm => {
        classIds.push(lm.classId);
        courseIds.push(lm.courseId);
        teacherIds.push(lm.teacherId);
      });
      const classes = await ctx.model.Class.find({ _id: { $in: classIds } }, { name: 1 });
      const classesMap = classes.reduce((map, obj) => {
        map[obj._id] = obj;
        return map;
      }, {});
      const courses = await ctx.model.Course.find({ _id: { $in: courseIds } }, { name: 1 });
      const coursesMap = courses.reduce((map, obj) => {
        map[obj._id] = obj;
        return map;
      }, {});
      const users = await ctx.model.User.find({ _id: { $in: teacherIds } }, { displayName: 1 });
      const usersMap = users.reduce((map, obj) => {
        map[obj._id] = obj;
        return map;
      }, {});
      lessonMaterials.forEach(lm => {
        lm.classId = classesMap[lm.classId];
        lm.courseId = coursesMap[lm.courseId];
        lm.teacherId = usersMap[lm.teacherId];
      });
      payload.data.data = lessonMaterials;

      // .limit(limit)
      // .skip(offset);
    } catch (err) {
      payload.errCode = 1;
      payload.msg = '' + err;
      // ctx.socket.emit('PushMessageToClient', err);
    }
    ctx.socket.emit('setgetMyLessonPlan', payload);
  }
  //  获取全部上传教案列表
  async getLessonMaterialList() {
    const { ctx } = this;
    const payload: ResponsePayload = {
      errCode: 0,
      msg: 'OK',
      data: {},
    };
    try {
      if (ctx.client.user.roleTypes.indexOf(RoleType.SuperAdmin) === -1 && ctx.client.user.roleTypes.indexOf(RoleType.SchoolAdmin) === -1 && ctx.client.user.roleTypes.indexOf(RoleType.Teacher) === -1) {
        payload.msg = '您没有此权限';
        payload.errCode = 1;
        ctx.socket.emit('setgetAllLessonPlan', payload);
        return;
      }
      const { id } = ctx.packet[1];
      payload.errCode = 0;
      const lesson = await ctx.model.Lesson.findById(id) as ILessonModel;
      payload.data = lesson.lessonMaterialItems;
    } catch (err) {
      payload.errCode = 1;
      payload.msg = '' + err;
      // ctx.socket.emit('PushMessageToClient', err);
    }
    ctx.socket.emit('setgetAllLessonPlan', payload);
  }

  async deleteLessonMaterial() {
    const { ctx } = this;
    const payload: ResponsePayload = {
      errCode: 0,
      msg: 'OK',
      data: {},
    };
    try {
      const { lessonId, id } = ctx.packet[1];
      if (!id) {
        ctx.socket.emit('PushMessageToClient', '参数错误');
        return;
      }
      const oldUser = await ctx.model.Lesson.find({ _id: lessonId });
      if (!oldUser) {
        ctx.socket.emit('PushMessageToClient', '该课次不存在');
        return;
      }
      const data = { _id: id };
      let result = await ctx.model.Lesson.findOneAndUpdate({ _id: lessonId },
        { $pull: { lessonMaterialItems: data } });
      result = await ctx.model.Lesson.findById(lessonId);
      payload.data = result.lessonMaterialItems;
    } catch (err) {
      payload.errCode = 1;
      payload.msg += err;
      ctx.socket.emit('PushMessageToClient', err);
    }
    ctx.socket.emit('setgetAllLessonPlan', payload);
  }
  //  获取班级课次的教案列表
  async lessonDetail() {
    const { ctx } = this;
    const payload: ResponsePayload = {
      errCode: 0,
      msg: 'OK',
      data: {},
    };
    try {
      // if (ctx.client.user.roleTypes.indexOf(RoleType.SuperAdmin) === -1 && ctx.client.user.roleTypes.indexOf(RoleType.SchoolAdmin) === -1 && ctx.client.user.roleTypes.indexOf(RoleType.Teacher) === -1) {
      //   payload.msg = '您没有此权限';
      //   payload.errCode = 1;
      //   ctx.socket.emit('setgetMyLessonPlan', payload);
      //   return;
      // }
      const { offset, limit, lessonId } = ctx.packet[1];
      payload.errCode = 0;
      const myClasses = (await ctx.model.Lesson.find({ _id: lessonId }, { _id: 1 })) || [];
      const myClassIds = myClasses.map(x => x._id);
      const query = ctx.model.Lesson.aggregate([
        { $match: { _id: { $in: myClassIds } } },
        { $unwind: '$lessonMaterialItems' },
        {
          $addFields: {
            'lessonMaterialItems._id': '$_id',
            'lessonMaterialItems.classId': '$classId',
            'lessonMaterialItems.courseId': '$courseId',
            'lessonMaterialItems.name': '$name',
            'lessonMaterialItems.teacherId': '$teacherId',
          },
        },
        {
          $replaceRoot: {
            newRoot: '$lessonMaterialItems',
          },
        },
      ]);
      const countDocs = await Object.create(query).count('number');
      if (countDocs.length > 0) {
        payload.data.count = countDocs[0].number;
      } else {
        payload.data.count = 0;
      }
      const lessonMaterials = await query.skip(offset).limit(limit);
      // replace classId
      const classIds: string[] = [];
      const courseIds: string[] = [];
      const teacherIds: string[] = [];
      lessonMaterials.forEach(lm => {
        classIds.push(lm.classId);
        courseIds.push(lm.courseId);
        teacherIds.push(lm.teacherId);
      });
      const classes = await ctx.model.Class.find({ _id: { $in: classIds } }, { name: 1 });
      const classesMap = classes.reduce((map, obj) => {
        map[obj._id] = obj;
        return map;
      }, {});
      const courses = await ctx.model.Course.find({ _id: { $in: courseIds } }, { name: 1 });
      const coursesMap = courses.reduce((map, obj) => {
        map[obj._id] = obj;
        return map;
      }, {});
      const users = await ctx.model.User.find({ _id: { $in: teacherIds } }, { displayName: 1 });
      const usersMap = users.reduce((map, obj) => {
        map[obj._id] = obj;
        return map;
      }, {});
      lessonMaterials.forEach(lm => {
        lm.classId = classesMap[lm.classId];
        lm.courseId = coursesMap[lm.courseId];
        lm.teacherId = usersMap[lm.teacherId];
      });
      payload.data.data = lessonMaterials;

      // .limit(limit)
      // .skip(offset);
    } catch (err) {
      payload.errCode = 1;
      payload.msg = '' + err;
      // ctx.socket.emit('PushMessageToClient', err);
    }
    ctx.socket.emit('setgetMyLessonPlan', payload);
  }
  //  获取我的课程列表
  async getMyCourse() {
    const { ctx } = this;
    const payload: ResponsePayload = {
      errCode: 0,
      msg: 'OK',
      data: {},
    };
    try {
      if (ctx.client.user.roleTypes.indexOf(RoleType.CourseAdmin) === -1) {
        payload.msg = '您没有此权限';
        payload.errCode = 1;
        ctx.socket.emit('setsignupList', payload);
        return;
      }
      const { id, offset, limit } = ctx.packet[1];
      payload.errCode = 0;
      payload.data.count = await ctx.model.Course.find({ adminId: id }).count();
      payload.data.data = await ctx.model.Course.find({ adminId: id }).limit(limit).skip(offset)
        .populate({ path: 'adminId', select: { displayName: 1 } });
    } catch (err) {
      payload.errCode = 1;
      payload.msg = '' + err;
    }
    ctx.socket.emit('setgetMyCourse', payload);
  }

  //  获取我的管理班级列表
  async getMyClass() {
    const { ctx } = this;
    const payload: ResponsePayload = {
      errCode: 0,
      msg: 'OK',
      data: {},
    };
    try {
      if (ctx.client.user.roleTypes.indexOf(RoleType.ClassAdmin) === -1) {
        payload.msg = '您没有此权限';
        payload.errCode = 1;
        ctx.socket.emit('setsignupList', payload);
        return;
      }
      const { id, offset, limit } = ctx.packet[1];
      payload.errCode = 0;
      payload.data.count = await ctx.model.Class.find({ adminId: id }).count();
      payload.data.data = await ctx.model.Class.find({ adminId: id }).limit(limit).skip(offset)
        .populate({ path: 'courseId', select: { name: 1 } })
        .populate({ path: 'adminId', select: { displayName: 1 } })
        .populate({ path: 'teacherId', select: { displayName: 1 } });
    } catch (err) {
      payload.errCode = 1;
      payload.msg = '' + err;
    }
    ctx.socket.emit('setgetMyClass', payload);
  }
  //  获取我的任课班级列表
  async getMyTeachClass() {
    const { ctx } = this;
    const payload: ResponsePayload = {
      errCode: 0,
      msg: 'OK',
      data: {},
    };
    try {
      if (ctx.client.user.roleTypes.indexOf(RoleType.Teacher) === -1) {
        payload.msg = '您没有此权限';
        payload.errCode = 1;
        ctx.socket.emit('setsignupList', payload);
        return;
      }
      const { id, offset, limit } = ctx.packet[1];
      payload.errCode = 0;
      payload.data.count = await ctx.model.Class.find({ teacherId: id }).count();
      payload.data.data = await ctx.model.Class.find({ teacherId: id }).limit(limit).skip(offset)
        .populate({ path: 'teacherId', select: { displayName: 1 } })
        .populate({ path: 'courseId', select: { name: 1 } });
      // .populate({ path: 'adminId', select: { displayName: 1 } });
    } catch (err) {
      payload.errCode = 1;
      payload.msg = '' + err;
    }
    ctx.socket.emit('setgetMyTeachClass', payload);
  }

  //  获取我的选课班级列表
  async getMyChooseClass() {
    const { ctx } = this;
    const payload: ResponsePayload = {
      errCode: 0,
      msg: 'OK',
      data: {},
    };
    try {
      if (ctx.client.user.roleTypes.indexOf(RoleType.Student) === -1) {
        payload.msg = '您没有此权限';
        payload.errCode = 1;
        ctx.socket.emit('setsignupList', payload);
        return;
      }
      const { id, offset, limit } = ctx.packet[1];
      payload.errCode = 0;
      payload.data.count = await ctx.model.ClassRegistration.find({ studentId: id }).count();
      payload.data.data = await ctx.model.ClassRegistration.find({ studentId: id }).limit(limit).skip(offset)
        .populate({ path: 'classId', select: { name: 1 } })
        .populate({ path: 'adjustedClassId', select: { name: 1 } })
        .populate({ path: 'studentId', select: { displayName: 1 } });
    } catch (err) {
      payload.errCode = 1;
      payload.msg = '' + err;
    }
    ctx.socket.emit('setgetMyChooseClass', payload);
  }
  //  取消报名
  async deleteMyChooseClass() {
    const { ctx } = this;
    const payload: ResponsePayload = {
      errCode: 0,
      msg: 'OK',
      data: {},
    };
    try {
      if (ctx.client.user.roleTypes.indexOf(RoleType.Student) === -1) {
        payload.msg = '您没有此权限';
        payload.errCode = 1;
        ctx.socket.emit('setdeleteMyChooseClass', payload);
        return;
      }
      const { id } = ctx.packet[1];
      payload.errCode = 0;
      payload.data = await ctx.model.ClassRegistration.deleteOne({ _id: id });
    } catch (err) {
      payload.errCode = 1;
      payload.msg = '' + err;
    }
    ctx.socket.emit('setdeleteMyChooseClass', payload);
  }
  //  获取我的选课班级列表
  async getMyStudyClass() {
    const { ctx } = this;
    const payload: ResponsePayload = {
      errCode: 0,
      msg: 'OK',
      data: {},
    };
    try {
      if (ctx.client.user.roleTypes.indexOf(RoleType.Student) === -1) {
        payload.msg = '您没有此权限';
        payload.errCode = 1;
        ctx.socket.emit('setgetMyStudyClass', payload);
        return;
      }
      const { id, offset, limit } = ctx.packet[1];
      payload.errCode = 0;
      // const classes = await ctx.model.Class.find({ _id: { $in: classIds } }, { name: 1 });
      payload.data.count = await ctx.model.Class.find({ studentIds: { $in: id } }).count();
      payload.data.data = await ctx.model.Class.find({ studentIds: { $in: id } }).limit(limit).skip(offset)
        .populate({ path: 'classId', select: { name: 1 } })
        .populate({ path: 'courseId', select: { name: 1 } })
        .populate({ path: 'studentId', select: { displayName: 1 } });
    } catch (err) {
      payload.errCode = 1;
      payload.msg = '' + err;
    }
    ctx.socket.emit('setgetMyStudyClass', payload);
  }
  //  获取我的学籍班级列表
  async getMyStatusClass() {
    const { ctx } = this;
    const payload: ResponsePayload = {
      errCode: 0,
      msg: 'OK',
      data: {},
    };
    try {
      if (ctx.client.user.roleTypes.indexOf(RoleType.Student) === -1) {
        payload.msg = '您没有此权限';
        payload.errCode = 1;
        ctx.socket.emit('setgetMyStatusClass', payload);
        return;
      }
      const { id, offset, limit } = ctx.packet[1];
      payload.errCode = 0;
      // const classes = await ctx.model.Class.find({ _id: { $in: classIds } }, { name: 1 });
      payload.data.count = await ctx.model.Class2.find({ studentIds: { $in: id } }).count();
      payload.data.data = await ctx.model.Class2.find({ studentIds: { $in: id } }).limit(limit).skip(offset)
        .populate({ path: 'classId', select: { name: 1 } })
        .populate({ path: 'studentId', select: { displayName: 1 } });
    } catch (err) {
      payload.errCode = 1;
      payload.msg = '' + err;
    }
    ctx.socket.emit('setgetMyStatusClass', payload);
  }

  //  获取学籍班（物理班）列表
  async class2OptionList() {
    const { ctx } = this;
    const payload: ResponsePayload = {
      errCode: 0,
      msg: 'OK',
      data: {},
    };
    try {
      payload.errCode = 0;
      payload.data = await ctx.model.Class2.find();
    } catch (err) {
      payload.errCode = 1;
      payload.msg = '' + err;
      // ctx.socket.emit('PushMessageToClient', err);
    }
    // console.log(payload);
    ctx.socket.emit('setclass2OptionList', payload);
  }

  //  查询全部班级列表
  async class2Index() {
    const { ctx } = this;
    const payload: ResponsePayload = {
      errCode: 0,
      msg: 'OK',
      data: {},
    };
    try {
      if (ctx.client.user.roleTypes.indexOf(RoleType.SuperAdmin) === -1 && ctx.client.user.roleTypes.indexOf(RoleType.SchoolAdmin) === -1 && ctx.client.user.roleTypes.indexOf(RoleType.Student) === -1) {
        payload.msg = '您没有此权限';
        payload.errCode = 1;
        ctx.socket.emit('setclass2List', payload);
        return;
      }
      const { offset, limit, username } = ctx.packet[1];
      payload.errCode = 0;
      if (username) {
        payload.data.count = await ctx.model.Class2.find({ name: { $regex: username } }).count();
        payload.data.data = await ctx.model.Class2.find({ name: { $regex: username } }).limit(limit).skip(offset)
          .populate({ path: 'courseId', select: { name: 1 } })
          .populate({ path: 'teacherId', select: { displayName: 1 } });
        // .populate({ path: 'adminId', select: { displayName: 1 } });
      } else {
        payload.data.count = await ctx.model.Class2.find({}).count();
        payload.data.data = await ctx.model.Class2.find({}).limit(limit).skip(offset)
          .populate({ path: 'courseId', select: { name: 1 } })
          .populate({ path: 'teacherId', select: { displayName: 1 } });
        // .populate({ path: 'adminId', select: { displayName: 1 } });
      }
    } catch (err) {
      payload.errCode = 1;
      payload.msg = '' + err;
      // ctx.socket.emit('PushMessageToClient', err);
    }
    ctx.socket.emit('setclass2List', payload);
  }
  //  添加课程班级列表
  async addClass2() {
    const { ctx } = this;
    const payload: ResponsePayload = {
      errCode: 0,
      msg: 'OK',
      data: {},
    };
    try {
      if (ctx.client.user.roleTypes.indexOf(RoleType.SuperAdmin) === -1 && ctx.client.user.roleTypes.indexOf(RoleType.SchoolAdmin) === -1 && ctx.client.user.roleTypes.indexOf(RoleType.CourseAdmin) === -1) {
        payload.msg = '您没有此权限';
        payload.errCode = 1;
        ctx.socket.emit('setAddClass2', payload);
        return;
      }
      const userInfo = ctx.packet[1];
      const checkUid = await ctx.model.Class2.find({ name: userInfo.className });
      if (checkUid.length > 0) {
        ctx.socket.emit('PushMessageToClient', '名称已存在，建议换个名字');
        return;
      }
      const addClass2 = new ctx.model.Class2({
        name: userInfo.className,
        description: userInfo.description,
        studentIds: [],
        createdAt: new Date(),
        isActive: true,
        createdBy: ctx.client.user._id,
        lastUpatedAt: new Date(),
        lastUpdatedBy: ctx.client.user._id,
      });
      payload.errCode = 0;
      payload.msg = '添加成功';
      payload.data = await addClass2.save();
      // ctx.socket.emit('setAddCourseClass', classFound);
    } catch (err) {
      payload.errCode = 1;
      payload.msg = '' + err;
      // ctx.socket.emit('PushMessageToClient', err);
    }
    ctx.socket.emit('setAddClass2', payload);
  }
  //  修改课程详情(某班级信息)
  async updateClass2() {
    const { ctx } = this;
    try {
      if (ctx.client.user.roleTypes.indexOf(RoleType.SuperAdmin) === -1 && ctx.client.user.roleTypes.indexOf(RoleType.SchoolAdmin) === -1 && ctx.client.user.roleTypes.indexOf(RoleType.CourseAdmin) === -1) {
        ctx.socket.emit('setupdateCourseDetail', '您没有此权限');
        return;
      }
      const { id, className, description, } = ctx.packet[1];
      if (!id) {
        ctx.socket.emit('PushMessageToClient', '参数错误');
        return;
      }
      const oldInfo = await ctx.model.Class2.findById({ _id: id });
      if (oldInfo) {
        const checkUid = await ctx.model.Class2.count({ name: className });
        if (checkUid > 0 && oldInfo.name !== className) {
          // payload.msg = '课程名称已存在';
          ctx.socket.emit('PushMessageToClient', '班级名称已存在');
          return;
        }
      } else {
        ctx.socket.emit('setupdateClass2', '班级不存在');
        return;
      }
      const result = await ctx.model.Class2.updateOne({ _id: id },
        {
          name: className, description, createdAt: new Date(), lastUpatedAt: new Date(),
        });
      ctx.socket.emit('setupdateCourseDetail', result);

    } catch (err) {
      ctx.socket.emit('PushMessageToClient', err);
    }
  }
  async deleteClass2Student() {
    const { ctx } = this;
    const payload: ResponsePayload = {
      errCode: 0,
      msg: 'OK',
      data: {},
    };
    try {
      if (ctx.client.user.roleTypes.indexOf(RoleType.SuperAdmin) === -1 && ctx.client.user.roleTypes.indexOf(RoleType.SchoolAdmin) === -1 && ctx.client.user.roleTypes.indexOf(RoleType.Teacher) === -1) {
        payload.msg = '您没有此权限';
        payload.errCode = 1;
        ctx.socket.emit('setdeleteClass2Student', payload);
        return;
      }
      const { id, classId } = ctx.packet[1];
      if (!id) {
        payload.msg = '参数错误';
        payload.errCode = 1;
        ctx.socket.emit('setdeleteClass2Student', payload);
        return;
      }
      const oldUser = await ctx.model.Class2.find({ _id: id });
      if (!oldUser) {
        payload.msg = '该班级不存在';
        payload.errCode = 1;
        ctx.socket.emit('setdeleteClass2Student', payload);
        return;
      }
      const oldStu = await ctx.model.Class2.find({ _id: classId, studentIds: { $in: id } });
      if (!oldStu) {
        payload.msg = '该学生不在此班级';
        payload.errCode = 1;
        ctx.socket.emit('setdeleteClass2Student', payload);
        return;
      }
      payload.data = await ctx.model.Class2.findByIdAndUpdate(classId, { $pull: { studentIds: id } });
      payload.msg = '删除成功';
      payload.errCode = 0;
    } catch (err) {
      payload.msg = err;
      payload.errCode = 1;
    }
    ctx.socket.emit('setdeleteClass2Student', payload);
  }
   //  修改课程详情(某班级信息)
  async deleteClass2() {
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
      const oldUser = await ctx.model.Class2.find({ _id: id });
      if (!oldUser) {
        ctx.socket.emit('PushMessageToClient', '该课程不存在');
        return;
      }
      const result = await ctx.model.Class2.deleteOne({ _id: id });
      ctx.socket.emit('setdeleteClass2', result);

    } catch (err) {
      ctx.socket.emit('PushMessageToClient', err);
    }
  }
  //  获取班级学生列表
  async getLClass2StudentList() {
    const { ctx } = this;
    const payload: ResponsePayload = {
      errCode: 0,
      msg: 'OK',
      data: {},
    };
    try {
      if (ctx.client.user.roleTypes.indexOf(RoleType.SuperAdmin) === -1 && ctx.client.user.roleTypes.indexOf(RoleType.SchoolAdmin) === -1 && ctx.client.user.roleTypes.indexOf(RoleType.ClassAdmin) === -1 && ctx.client.user.roleTypes.indexOf(RoleType.Teacher) === -1) {
        ctx.socket.emit('PushMessageToClient', '您没有此权限');
        return;
      }
      const { offset, limit, classid } = ctx.packet[1];
      payload.errCode = 0;
      const query = ctx.model.Class2.aggregate([
        { $match: { _id: ObjectId.createFromHexString(classid) } },
        { $unwind: '$studentIds' },
        {
          $addFields: {
            'studentIds._id': '$studentIds',
            'studentIds.name': '$name',
          },
        },
        {
          $replaceRoot: {
            newRoot: '$studentIds',
          },
        },
      ]);
      const countDocs = await Object.create(query).count('number');
      if (countDocs.length > 0) {
        payload.data.count = countDocs[0].number;
      } else {
        payload.data.count = 0;
      }
      const students = await query.skip(offset).limit(limit);
      const studentIds = students.map(x => x._id);
      const users = await ctx.model.User.find({ _id: { $in:  studentIds } }, { displayName: 1 });
      const usersMap = users.reduce((map, obj) => {
        map[obj._id] = obj;
        return map;
      }, {});
      students.forEach(lm => {
        if (usersMap[lm._id]) {
          lm._id = usersMap[lm._id];
        }
      });
      payload.data.data = students;
      //

    } catch (err) {
      payload.errCode = 1;
      payload.msg = '' + err;
      // ctx.socket.emit('PushMessageToClient', err);
    }
    // console.log(payload);
    ctx.socket.emit('setgetLClass2StudentList', payload);
  }
  // //  获取班级学生列表
  // async getLClass2StudentList() {
  //   const { ctx } = this;
  //   const payload: ResponsePayload = {
  //     errCode: 0,
  //     msg: 'OK',
  //     data: {},
  //   };
  //   try {
  //     if (ctx.client.user.roleTypes.indexOf(RoleType.SuperAdmin) === -1 && ctx.client.user.roleTypes.indexOf(RoleType.SchoolAdmin) === -1 && ctx.client.user.roleTypes.indexOf(RoleType.ClassAdmin) === -1 && ctx.client.user.roleTypes.indexOf(RoleType.Teacher) === -1) {
  //       ctx.socket.emit('PushMessageToClient', '您没有此权限');
  //       return;
  //     }
  //     const { offset, limit, username, classid } = ctx.packet[1];
  //     // console.log(id);
  //     payload.errCode = 0;
  //     if (username) {
  //       // payload.data.count = await ctx.model.Class2.find({ _id: classid, name: username }).count();
  //       payload.data.data = await ctx.model.Class2.find({ _id: classid, name: username }, { studentIds: 1 }).limit(limit).skip(offset)
  //         .populate({ path: 'studentIds', select: { displayName: 1 } });
  //       payload.data.count = payload.data.data[0].studentIds.length;
  //       // .populate({ path: 'adminId', select: { displayName: 1 } });
  //     } else {
  //       // payload.data.count = await ctx.model.Class2.find({ _id: classid }, { studentIds: 1 }).count();
  //       payload.data.data = await ctx.model.Class2.find({ _id: classid }, { studentIds: 1 }).limit(limit).skip(offset)
  //         .populate({ path: 'studentIds', select: { displayName: 1 } });
  //       payload.data.count = payload.data.data[0].studentIds.length;
  //       // .populate({ path: 'adminId', select: { displayName: 1 } });
  //     }
  //   } catch (err) {
  //     payload.errCode = 1;
  //     payload.msg = '' + err;
  //     // ctx.socket.emit('PushMessageToClient', err);
  //   }
  //   // console.log(payload);
  //   ctx.socket.emit('setgetLClass2StudentList', payload);
  // }
     //  查询全部排课列表
  async getScheduleList() {
    const { ctx } = this;
    const payload: ResponsePayload = {
      errCode: 0,
      msg: 'OK',
      data: {},
    };
    try {
      if (ctx.client.user.roleTypes.indexOf(RoleType.SuperAdmin) === -1 && ctx.client.user.roleTypes.indexOf(RoleType.SchoolAdmin) === -1 && ctx.client.user.roleTypes.indexOf(RoleType.Student) === -1) {
        payload.msg = '您没有此权限';
        payload.errCode = 1;
        ctx.socket.emit('setgetScheduleList', payload);
        return;
      }
      const { offset, limit, username } = ctx.packet[1];
      payload.errCode = 0;
      if (username) {
        payload.data.count = await ctx.model.LabReservation.find({}).count();
        payload.data.data = await ctx.model.LabReservation.find({}).limit(limit).skip(offset)
          .populate({ path: 'courseId', select: { name: 1 } })
          .populate({ path: 'labId', select: { name: 1 } })
          .populate({ path: 'classId', select: { name: 1 } });
          // .populate({ path: 'adminId', select: { displayName: 1 } });
      } else {
        payload.data.count = await ctx.model.LabReservation.find({}).count();
        payload.data.data = await ctx.model.LabReservation.find({}).limit(limit).skip(offset)
          .populate({ path: 'courseId', select: { name: 1 } })
          .populate({ path: 'labId', select: { name: 1 } })
          .populate({ path: 'classId', select: { name: 1 } });
          // .populate({ path: 'adminId', select: { displayName: 1 } });
      }
    } catch (err) {
      payload.errCode = 1;
      payload.msg = '' + err;
      // ctx.socket.emit('PushMessageToClient', err);
    }
    ctx.socket.emit('setgetScheduleList', payload);
  }

  numberToTime(num: number) {
    const integerPart = Math.floor(num);
    const digitPart = num - integerPart;
    const minutes = digitPart * 60;
    return integerPart.toString() + ':' + ('0' + minutes).slice(-2);
  }

  // 设置排课信息
  async addSchedule() {
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
        ctx.socket.emit('setaddSchedule', payload);
        return;
      }
      const userInfo = ctx.packet[1];
      const classCount = await ctx.model.Class.count({ _id: userInfo.classId });
      if (classCount < 1) {
        const findStu = await ctx.model.Class2.findOne({ _id: userInfo.classId });
        if (!findStu) {
          payload.msg = '该学籍班不存在，无法排课';
          payload.errCode = 1;
          ctx.socket.emit('setaddSchedule', payload);
          return;
        }
        const findCourse = await ctx.model.Course.findById(userInfo.courseId);
        if (!findCourse) {
          payload.msg = '该课程不存在，无法排课';
          payload.errCode = 1;
          ctx.socket.emit('setaddSchedule', payload);
          return;
        }
        const addClass = new ctx.model.Class({
          class2Id: findStu._id,
          courseId: userInfo.courseId,
          name: findStu.name + '_' + findCourse.name,
          description: '',
          teacherId: userInfo.teacherId,
          // adminId: userInfo.classTeacherId,
          dateToOpenClass: userInfo.date,
          isOpenForRegisteration: true,
          studentIds: findStu.studentIds,
          studentLimit: 200,
          createdAt: new Date(),
          isSignup: false,
          createdBy: ctx.client.user._id,
          lastUpatedAt: new Date(),
          lastUpdatedBy: ctx.client.user._id,
        });
        // await ctx.model.Class.findByIdAndUpdate(userInfo.classId.classId, { $pull: { studentIds: oldInfo.studentId } });
        let classFound = await ctx.model.Class.findOne({ class2Id: findStu._id, courseId: userInfo.courseId });
        if (!classFound) {
          classFound = await ctx.model.Class.findOne({ name: addClass.name });
        }
        if (!classFound) {
          payload.data = await addClass.save();
          userInfo.classId = payload.data._id;
        } else {
          userInfo.classId = classFound._id;
        }
      }
      if (userInfo.isRepeated === false) {
        const startDate = new Date(new Date(userInfo.date).toDateString());
        const conflictLesson = await ctx.model.Lesson.findOne(
          {
            $and: [
              { labId: userInfo.labId },
              { date: startDate },
              {
                $or: [
                  // { startTime: userInfo.startTime },
                  // { startTime: { $lt: userInfo.startTime }, endTime: { $gte: userInfo.endTime } },
                  // { endTime: userInfo.endTime },
                  // { endTime: { $gt: userInfo.endTime }, startTime: { $lte: userInfo.startTime } },
                  { startTime: userInfo.startTime },
                  { startTime: { $lt: userInfo.startTime }, endTime: { $gte: userInfo.endTime } },
                  { endTime: userInfo.endTime },
                  { endTime: { $lt: userInfo.endTime, $gt: userInfo.startTime } },
                  { startTime: { $lt: userInfo.endTime, $gt: userInfo.startTime } },
                  { endTime: { $gt: userInfo.endTime }, startTime: { $lte: userInfo.startTime } },
                ],
              },
            ],
          }).populate({ path: 'classId', select: { name: 1 } })
          .populate({ path: 'courseId', select: { name: 1 } });
        if (conflictLesson) {
            payload.msg = '这天的' + this.numberToTime(userInfo.startTime)
            + '-' + this.numberToTime(userInfo.endTime) + '与'
            + (conflictLesson.classId ? conflictLesson.classId.name : '-') + '的'
            + (conflictLesson.courseId ? conflictLesson.courseId.name : '-') + '上课的时间'
            + this.numberToTime(conflictLesson.startTime)
            + '-' + this.numberToTime(conflictLesson.endTime) + '有冲突';
            // await ctx.model.Class.deleteOne({ _id: userInfo.classId });
            payload.errCode = 1;
            ctx.socket.emit('setaddSchedule', payload);
            return;
        }
        const newCourse = {
          labId: userInfo.labId,
          isRepeated: userInfo.isRepeated,
          avoidWeekend: userInfo.avoidWeekend,
          repeatType: userInfo.repeatType,
          repeatParams: userInfo.repeatParams,
          date: startDate,
          endDate: userInfo.endDate,
          startTime: userInfo.startTime,
          endTime: userInfo.endTime,
          classId: userInfo.classId,
          courseId: userInfo.courseId,
          createdAt: new Date(),
          createdBy: ctx.client.user._id,
          lastUpatedAt: new Date(),
          lastUpdatedBy: ctx.client.user._id,
        };
        payload.errCode = 0;
        payload.msg = '时间安排成功';
        const addUser = new ctx.model.LabReservation(newCourse);
        payload.data = await addUser.save();
        const _reservationId = payload.data._id;
        const addLesson = new ctx.model.Lesson({
          reservationId: _reservationId,
          classId: userInfo.classId,
          courseId: userInfo.courseId,
          teacherId: userInfo.teacherId,
          date: userInfo.date,
          startTime: userInfo.startTime,
          endTime: userInfo.endTime,
          labId: userInfo.labId,
          lessonMaterialItems: userInfo.lessonMaterialItems,
          absentStudentIds: [],
          attendantStudentIds: [],
          createdAt: new Date(),
          createdBy: ctx.client.user._id,
          lastUpatedAt: new Date(),
          lastUpdatedBy: ctx.client.user._id,
        });
        payload.errCode = 0;
        payload.data = await addLesson.save();
      } else if (userInfo.isRepeated === true) {
        console.log('11111111111111111111111111111');
        // if (userInfo.avoidWeekend === true) {
        const dates: Date[] = [];
        const firstDay = new Date(new Date(userInfo.date).toDateString());
        const lastDay = new Date(new Date(userInfo.endDate).toDateString());
        let step: number = 1;
        let currentDate = firstDay;
        switch (userInfo.repeatType) {
          case RepeatType.EveryDay:
            step = 1;
            currentDate = firstDay;
            while (currentDate <= lastDay) {
              console.log('1111111111111111111111111111122222222222222222');
              console.log(userInfo.avoidWeekend);
              console.log(currentDate);
              console.log(currentDate.getDay());
              if (!userInfo.avoidWeekend || (currentDate.getDay() !== 6 && currentDate.getDay() !== 0)) {
                dates.push(new Date(currentDate));
              }
              currentDate.setDate(currentDate.getDate() + step);
            }
            break;
          case RepeatType.EveryNDay:
            step = userInfo.repeatParams[0] + 1;
            currentDate = firstDay;
            while (currentDate <= lastDay) {
              if (!userInfo.avoidWeekend || (currentDate.getDay() !== 6 && currentDate.getDay() !== 0)) {
                dates.push(new Date(currentDate));
              }
              currentDate.setDate(currentDate.getDate() + step);
            }
            break;
          case RepeatType.EveryWeek:
            step = 1;
            currentDate = firstDay;
            while (currentDate <= lastDay) {
              if (userInfo.repeatParams.indexOf(currentDate.getDay()) !== -1) {
                dates.push(new Date(currentDate));
              }
              currentDate.setDate(currentDate.getDate() + step);
            }
            break;
          case RepeatType.EveryOtherWeek:
            step = 1;
            const firstDayOfTheWeek = new Date(firstDay);
            firstDayOfTheWeek.setDate(firstDayOfTheWeek.getDate() + 1 - firstDay.getDay());
            currentDate = firstDay;
            while (currentDate <= lastDay) {
              const firstDayOfThatWeek = new Date(currentDate);
              firstDayOfThatWeek.setDate(firstDayOfThatWeek.getDate() + 1 - firstDayOfThatWeek.getDay());
              const diff = Math.floor((firstDayOfThatWeek.valueOf() - firstDayOfTheWeek.valueOf()) / 86400000);
              if ((((diff / 7) % 2 === 0) && userInfo.repeatParams.indexOf(currentDate.getDay()) !== -1)) {
                dates.push(new Date(currentDate));
              }
              currentDate.setDate(currentDate.getDate() + step);
            }
            break;
          case RepeatType.EveryMonth:
            step = 1;
            currentDate = firstDay;
            while (currentDate <= lastDay) {
              if (userInfo.repeatParams.indexOf(currentDate.getDate()) !== -1) {
                dates.push(new Date(currentDate));
              }
              currentDate.setDate(currentDate.getDate() + step);
            }
            break;
          default:
            payload.msg = '重复类型参数错误';
            payload.errCode = 1;
            ctx.socket.emit('setaddSchedule', payload);
            return;
        }
        //
        const conflictLesson = await ctx.model.Lesson.findOne(
          {
            $and: [
              { labId: userInfo.labId },
              { date: { $in: dates } },
              {
                $or: [
                  { startTime: userInfo.startTime },
                  { startTime: { $lt: userInfo.startTime }, endTime: { $gte: userInfo.endTime } },
                  { endTime: userInfo.endTime },
                  { endTime: { $lt: userInfo.endTime, $gt: userInfo.startTime } },
                  { startTime: { $lt: userInfo.endTime, $gt: userInfo.startTime } },
                  { endTime: { $gt: userInfo.endTime }, startTime: { $lte: userInfo.startTime } },
                  // { startTime: userInfo.startTime },
                  // { startTime: { $lt: userInfo.startTimeed } },
                  // { endTime: { $gt: userInfo.endTime } },
                  // { startTime: { $lt: userInfo.startTime }, endTime: { $gte: userInfo.endTime } },
                  // { endTime: userInfo.endTime },
                  // { endTime: { $gt: userInfo.endTime }, startTime: { $lte: userInfo.startTime } },
                ],
              },
            ],
          }).populate({ path: 'classId', select: { name: 1 } })
          .populate({ path: 'courseId', select: { name: 1 } });
        console.log('conflictLesson  0000000000000000000000000000000000000000000000000000000000000000000022');
        console.log(conflictLesson);
        console.log(userInfo.startTime);
        console.log(userInfo.endTime);
        if (conflictLesson) {
          console.log('conflictLesson  00000000000000000000000000000000000000000000000000000000000000000000');
          console.log(conflictLesson);
          payload.msg = '这天的' + this.numberToTime(userInfo.startTime)
            + '-' + this.numberToTime(userInfo.endTime) + '与'
            + (conflictLesson.classId ? conflictLesson.classId.name : '-') + '的'
            + (conflictLesson.courseId ? conflictLesson.courseId.name : '-') + '上课的时间'
            + this.numberToTime(conflictLesson.startTime)
            + '-' + this.numberToTime(conflictLesson.endTime) + '有冲突';
          // await ctx.model.Class.deleteOne({ _id: userInfo.classId });
          payload.errCode = 1;
          ctx.socket.emit('setaddSchedule', payload);
          return;
        }
        const startDate = new Date(new Date(userInfo.date).toDateString());
        const newCourse = {
          labId: userInfo.labId,
          isRepeated: userInfo.isRepeated,
          avoidWeekend: userInfo.avoidWeekend,
          repeatType: userInfo.repeatType,
          repeatParams: userInfo.repeatParams,
          date: startDate,
          endDate: userInfo.endDate,
          startTime: userInfo.startTime,
          endTime: userInfo.endTime,
          classId: userInfo.classId,
          courseId: userInfo.courseId,
          createdAt: new Date(),
          createdBy: ctx.client.user._id,
          lastUpatedAt: new Date(),
          lastUpdatedBy: ctx.client.user._id,
        };
        const addUser = new ctx.model.LabReservation(newCourse);
        payload.data = await addUser.save();
        for (const currentDate of dates) {
          const _reservationId = payload.data._id;
          const addLesson = new ctx.model.Lesson({
            reservationId: _reservationId,
            classId: userInfo.classId,
            courseId: userInfo.courseId,
            teacherId: userInfo.teacherId,
            date: currentDate,
            startTime: userInfo.startTime,
            endTime: userInfo.endTime,
            labId: userInfo.labId,
            lessonMaterialItems: userInfo.lessonMaterialItems,
            absentStudentIds: [],
            attendantStudentIds: [],
            createdAt: new Date(),
            createdBy: ctx.client.user._id,
            lastUpatedAt: new Date(),
            lastUpdatedBy: ctx.client.user._id,
          });
          await addLesson.save();
        }
        payload.errCode = 0;
        payload.msg = '时间安排成功';
        //
        // ctx.socket.emit('setaddSchedule', payload);

      }
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
    ctx.socket.emit('setaddSchedule', payload);
  }
  // 删除排课信息
  async deleteSchedule() {
    const { ctx } = this;
    const payload: ResponsePayload = {
      errCode: 0,
      msg: 'OK',
      data: {},
    };
    try {
      if (ctx.client.user.roleTypes.indexOf(RoleType.SuperAdmin) === -1 && ctx.client.user.roleTypes.indexOf(RoleType.SchoolAdmin) === -1) {
        ctx.socket.emit('PushMessageToClient', '您没有此权限');
        return;
      }
      const { id } = ctx.packet[1];
      if (!id) {
        payload.errCode = 1;
        payload.msg = '参数错误';
        ctx.socket.emit('setdeleteSchedule', payload);
        return;
      }
      const oldUser = await ctx.model.LabReservation.find({ _id: id });
      if (!oldUser) {
        payload.errCode = 1;
        payload.msg = '该数据不存在';
        ctx.socket.emit('setdeleteSchedule', payload);
        return;
      }
      const result = await ctx.model.LabReservation.deleteOne({ _id: id });
      const _result = await ctx.model.Lesson.deleteMany({ reservationId: id });
      ctx.socket.emit('setdeleteCourse', result, _result);

    } catch (err) {
      payload.errCode = 1;
      payload.msg = err;
      ctx.socket.emit('setdeleteSchedule', payload);
    }
  }
   //  获取作业 列表
  async gethomeworklList() {
    const { ctx } = this;
    const payload: ResponsePayload = {
      errCode: 0,
      msg: 'OK',
      data: {},
    };
    try {
      if (ctx.client.user.roleTypes.indexOf(RoleType.Student) === -1) {
        payload.msg = '您没有此权限';
        payload.errCode = 1;
        ctx.socket.emit('setgethomeworklList', payload);
        return;
      }
      const { studentId, lessonId, classId } = ctx.packet[1];
      payload.errCode = 0;
      const lesson = await ctx.model.Homework.findOne({ lessonId, studentId, classId }) as IHomeworkModel;
      payload.data = lesson.homeworkItems;
      console.log('lesson  1111111111111');
      console.log(lesson);
    } catch (err) {
      payload.errCode = 1;
      payload.msg = '' + err;
      // ctx.socket.emit('PushMessageToClient', err);
    }
    ctx.socket.emit('setgethomeworklList', payload);
  }

  async deleteHomework() {
    const { ctx } = this;
    const payload: ResponsePayload = {
      errCode: 0,
      msg: 'OK',
      data: {},
    };
    try {
      const { id, lessonId, studentId } = ctx.packet[1];
      if (!id) {
        ctx.socket.emit('PushMessageToClient', '参数错误');
        return;
      }
      const data = { _id: id };
      let result = await ctx.model.Homework.findOneAndUpdate({ lessonId, studentId },
        { $pull: { homeworkItems: data } });
      result = await ctx.model.Homework.findOne({ lessonId, studentId });
      payload.data = result.homeworkItems;
      if (payload.data.length < 1) {
        result = await ctx.model.Homework.deleteOne({ lessonId, studentId });
        payload.data = {};
      }
    } catch (err) {
      payload.errCode = 1;
      payload.msg += err;
      ctx.socket.emit('PushMessageToClient', err);
    }
    ctx.socket.emit('setgethomeworklList', payload);
  }
  //  //  获取课次下学生全部作业列表
  // async getAllHomeworkList() {
  //   const { ctx } = this;
  //   const payload: ResponsePayload = {
  //     errCode: 0,
  //     msg: 'OK',
  //     data: {},
  //   };
  //   try {
  //     const { offset, limit, lessonId } = ctx.packet[1];
  //     payload.errCode = 0;
  //     payload.data.count = await ctx.model.Homework.find({ lessonId }).count();
  //     // payload.data.data = await ctx.model.Course.find({}).limit(limit).skip(offset).populate({ path: 'adminId', select: { displayName: 1 } });
  //     payload.data.data = await ctx.model.Homework.find({ lessonId }).limit(limit).skip(offset)
  //     .populate({ path: 'studentId', select: { displayName: 1 } })
  //     .populate({ path: 'classId', select: { name: 1 } })
  //     .populate({ path: 'lessonId', select: { name: 1 } });
  //   } catch (err) {
  //     payload.errCode = 1;
  //     payload.msg = '' + err;
  //     // ctx.socket.emit('PushMessageToClient', err);
  //   }
  //   ctx.socket.emit('setgetAllHomeworkList', payload);
  // }
  //  获取课次下学生全部作业列表
  async getAllHomeworkList() {
    const { ctx } = this;
    const payload: ResponsePayload = {
      errCode: 0,
      msg: 'OK',
      data: {},
    };
    try {
      if (ctx.client.user.roleTypes.indexOf(RoleType.SuperAdmin) === -1 && ctx.client.user.roleTypes.indexOf(RoleType.SchoolAdmin) === -1 && ctx.client.user.roleTypes.indexOf(RoleType.Teacher) === -1) {
        payload.msg = '您没有此权限';
        payload.errCode = 1;
        ctx.socket.emit('setgetAllHomeworkList', payload);
        return;
      }
      const { offset, limit, lessonId } = ctx.packet[1];
      payload.errCode = 0;
      const myClasses = (await ctx.model.Homework.find({ lessonId })) || [];
      const myClassIds = myClasses.map(x => x.lessonId);
      const query = ctx.model.Homework.aggregate([
        { $match: { lessonId: { $in: myClassIds } } },
      // const query = ctx.model.Homework.aggregate([
        { $unwind: '$homeworkItems' },
        {
          $addFields: {
            'homeworkItems.id': '$_id',
            'homeworkItems.classId': '$classId',
            'homeworkItems.courseId': '$courseId',
            'homeworkItems.name': '$name',
            'homeworkItems.studentId': '$studentId',
          },
        },
        {
          $replaceRoot: {
            newRoot: '$homeworkItems',
          },
        },
      ]);
      const countDocs = await Object.create(query).count('number');
      if (countDocs.length > 0) {
        payload.data.count = countDocs[0].number;
      } else {
        payload.data.count = 0;
      }
      // payload.data.count = countDocs[0].number;
      const homeworkItems = await query.skip(offset).limit(limit);
      // replace classId
      const classIds: string[] = [];
      const courseIds: string[] = [];
      const studentIds: string[] = [];
      homeworkItems.forEach(lm => {
        classIds.push(lm.classId);
        courseIds.push(lm.courseId);
        studentIds.push(lm.studentId);
      });
      const classes = await ctx.model.Class.find({ _id: { $in: classIds } }, { name: 1 });
      const classesMap = classes.reduce((map, obj) => {
        map[obj._id] = obj;
        return map;
      }, {});
      const courses = await ctx.model.Course.find({ _id: { $in: courseIds } }, { name: 1 });
      const coursesMap = courses.reduce((map, obj) => {
        map[obj._id] = obj;
        return map;
      }, {});
      const users = await ctx.model.User.find({ _id: { $in: studentIds } }, { displayName: 1 });
      const usersMap = users.reduce((map, obj) => {
        map[obj._id] = obj;
        return map;
      }, {});
      homeworkItems.forEach(lm => {
        lm.classId = classesMap[lm.classId];
        lm.courseId = coursesMap[lm.courseId];
        lm.studentId = usersMap[lm.studentId];
      });
      payload.data.data = homeworkItems;

      // .limit(limit)
      // .skip(offset);
    } catch (err) {
      payload.errCode = 1;
      payload.msg = '' + err;
      // ctx.socket.emit('PushMessageToClient', err);
    }
    ctx.socket.emit('setgetAllHomeworkList', payload);
  }
    //  获取课次下学生全部作业列表
  async updateHomeworkScore() {
    const { ctx } = this;
    const payload: ResponsePayload = {
      errCode: 0,
      msg: 'OK',
      data: {},
    };
    try {
      const { score, state, homeworkId, teacherComments, filePath, description, id } = ctx.packet[1];
      payload.errCode = 0;
      const _data = {
        _id: homeworkId,
      };
      payload.data = await ctx.model.Homework.updateOne({ _id: id }, { $pull: { homeworkItems: _data } });
      const data = {
        teacherComments, filePath, description, score, state,
      };
      payload.data = await ctx.model.Homework.updateOne({ _id: id }, { $addToSet: { homeworkItems: data } });
      payload.errCode = 0;
      payload.msg = '批改成功';
    } catch (err) {
      payload.errCode = 1;
      payload.msg = '' + err;
      // ctx.socket.emit('PushMessageToClient', err);
    }
    ctx.socket.emit('setupdateHomeworkScore', payload);
  }
   //  查询全部班级列表
  async classDetail() {
    const { ctx } = this;
    const payload: ResponsePayload = {
      errCode: 0,
      msg: 'OK',
      data: {},
    };
    try {
      if (ctx.client.user.roleTypes.indexOf(RoleType.SuperAdmin) === -1 && ctx.client.user.roleTypes.indexOf(RoleType.SchoolAdmin) === -1 && ctx.client.user.roleTypes.indexOf(RoleType.Teacher) === -1) {
        payload.msg = '您没有此权限';
        payload.errCode = 1;
        ctx.socket.emit('setclassDetail', payload);
        return;
      }
      const { id } = ctx.packet[1];
      payload.errCode = 0;
      payload.data.data = await ctx.model.Class.findOne({ _id: id });
      // .populate({ path: 'adminId', select: { displayName: 1 } });
    } catch (err) {
      payload.errCode = 1;
      payload.msg = '' + err;
      // ctx.socket.emit('PushMessageToClient', err);
    }
    ctx.socket.emit('setclassDetail', payload);
  }
   //  查询全部服务器列表
  async serverState() {
    const mongoose = require('mongoose');
    require('../../../../card/model.js');
    const { ctx } = this;
    const payload: ResponsePayload = {
      errCode: 0,
      msg: 'OK',
      data: {},
    };
    try {
      const Book = mongoose.model('books');
      Book.find({}, (err: any, docs) => {
        if (err) {
          return;
        }
        payload.data = docs;
        payload.errCode = 0;
        ctx.socket.emit('setserverState', payload);
      });
      // .populate({ path: 'adminId', select: { displayName: 1 } });
    } catch (err) {
      payload.errCode = 1;
      payload.msg = '' + err;
      // ctx.socket.emit('PushMessageToClient', err);
    }
    ctx.socket.emit('setserverState', payload);
  }
    //  查询全部班级列表
  async deleteServerState() {
    const mongoose = require('mongoose');
    require('../../../../card/model.js');
    const { ctx } = this;
    const payload: ResponsePayload = {
      errCode: 0,
      msg: 'OK',
      data: {},
    };
    try {
      const { id } = ctx.packet[1];
      const Book = mongoose.model('books');
      Book.findOne({ _id: id }, (err: any, docs) => {
        if (err) {
          return;
        }
        if (docs) {
          docs.remove();
          Book.find({}, (err: any, docs) => {
            if (err) {
              return;
            }
            payload.data = docs;
            payload.errCode = 0;
            ctx.socket.emit('setdeleteServerState', payload);
          });
        }
        // payload.data = docs;
        // payload.errCode = 0;
        // ctx.socket.emit('setdeleteServerState', payload);
      });
      // .populate({ path: 'adminId', select: { displayName: 1 } });
    } catch (err) {
      payload.errCode = 1;
      payload.msg = '' + err;
      // ctx.socket.emit('PushMessageToClient', err);
    }
    ctx.socket.emit('setdeleteServerState', payload);
  }
}
