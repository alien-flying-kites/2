// tslint:disable: linebreak-style
import { Controller } from 'egg';
import { IUserModel } from '../model/user';
import { RoleType } from '../model/role';
import ResponsePayload from '../io/controller/responsePayload';
import * as fs from 'fs';
import * as path from 'path';
import * as pump from 'mz-modules/pump';
import HTTPStatusCode from '../core/HTTPStatusCode';
// import { HomeworkState } from '../model/homework';

export default class CourseController extends Controller {
  // public model: mongoose.Model<IUser>;

  public async index() {
    const { ctx } = this;

    await ctx.model.Course.find({}, (err: any, result: IUserModel[]) => {
      if (err) {
        // console.log(err);
      } else {
        ctx.body = result;
      }
    });
  }

  public async uploadLessonMaterial() {
    const { ctx } = this;
    const payload: ResponsePayload = {
      errCode: 0,
      msg: 'OK',
      data: {},
    };
    try {
      if (!ctx.user) {
        ctx.app.io.emit('PushMessageToClient', '用户未登录或者身份已过期');
        return;
      }
      if (!ctx.user.roleTypes || ctx.user.roleTypes.indexOf(RoleType.Teacher) === -1) {
        ctx.app.io.emit('PushMessageToClient', '只有老师才可以上传课次材料');
        return;
      }
      const isoString = new Date().toISOString();
      const isoDate = isoString.substr(0, isoString.indexOf('T'));
      const userIdIsoTime = ctx.user._id + '_' + isoString.substr(isoString.indexOf('T') + 1).replace(/[:\.Z]/ig, '');
      const { lessonMaterialType, lessonMaterialDescription, lessonId } = ctx.request.query;
      const oldUser = await ctx.model.Lesson.find({ _id: lessonId });
      if (!oldUser) {
        ctx.socket.emit('PushMessageToClient', '课次不存在');
        return;
      }

      const parts = this.ctx.multipart({ autoFields: true });
      const files: string[] = [];
      let stream;
// tslint:disable-next-line: no-conditional-assignment
      while ((stream = await parts()) != null) {
        if (stream.length) {
          // // arrays are busboy fields
          // console.log('field: ' + stream[0]);
          // console.log('value: ' + stream[1]);
          // console.log('valueTruncated: ' + stream[2]);
          // console.log('fieldnameTruncated: ' + stream[3]);
        } else {
          if (!stream.filename) {
            // user click `upload` before choose a file,
            // `part` will be file stream, but `part.filename` is empty
            // must handler this, such as log error.
            continue;
          }
          const filename = stream.filename.toLowerCase();
          const relativePath = path.join('public', isoDate, userIdIsoTime);
          const directory = path.join(this.config.baseDir, 'app', relativePath);
          fs.mkdirSync(directory, { recursive: true });
          const target = path.join(directory, filename);
          const writeStream = fs.createWriteStream(target);
          await pump(stream, writeStream);
          files.push(path.join(relativePath, filename));
        }
      }

      const data = {  materialItemType: lessonMaterialType,
                      fileList: files,
                      description: lessonMaterialDescription };
      let result = await ctx.model.Lesson.findOneAndUpdate({ _id: lessonId },
        { $push: { lessonMaterialItems: data } });
      result = await ctx.model.Lesson.findById(lessonId);
      payload.data = result.lessonMaterialItems;
      this.ctx.body = { result: files.length + ' file(s) uploaded.' };
      ctx.app.io.emit('PushMessageToClient', files.length + ' file(s) uploaded.');
    } catch (err) {
      payload.errCode = 1;
      payload.msg = '' + err.message;
      ctx.app.io.emit('PushMessageToClient', payload.msg);
      ctx.status = HTTPStatusCode.BAD_REQUEST;
      ctx.body = payload.msg;
    }
    ctx.app.io.emit('PushMessageToClient', payload);
  }
  public async uploadHomework() {
    const { ctx } = this;
    const payload: ResponsePayload = {
      errCode: 0,
      msg: 'OK',
      data: {},
    };
    try {
      if (!ctx.user) {
        ctx.app.io.emit('PushMessageToClient', '用户未登录或者身份已过期');
        return;
      }
      if (!ctx.user.roleTypes || ctx.user.roleTypes.indexOf(RoleType.Student) === -1) {
        ctx.app.io.emit('PushMessageToClient', '只有学生才可以上传');
        return;
      }
      const isoString = new Date().toISOString();
      const isoDate = isoString.substr(0, isoString.indexOf('T'));
      const userIdIsoTime = ctx.user._id + '_' + isoString.substr(isoString.indexOf('T') + 1).replace(/[:\.Z]/ig, '');
      const { lessonMaterialDescription, homeworkScore, homeworkState, lessonId, studentId, classId } = ctx.request.query;
      const parts = this.ctx.multipart({ autoFields: true });
      const files: string[] = [];
      let stream;
// tslint:disable-next-line: no-conditional-assignment
      while ((stream = await parts()) != null) {
        if (stream.length) {
          // console.log('fieldnameTruncated: ' + stream[3]);
        } else {
          if (!stream.filename) {
            continue;
          }
          const filename = stream.filename.toLowerCase();
          const relativePath = path.join('public', isoDate, userIdIsoTime);
          const directory = path.join(this.config.baseDir, 'app', relativePath);
          fs.mkdirSync(directory, { recursive: true });
          const target = path.join(directory, filename);
          const writeStream = fs.createWriteStream(target);
          await pump(stream, writeStream);
          files.push(path.join(relativePath, filename));
        }
      }
      const data = {
        filePath: files.toString(),
        description: lessonMaterialDescription,
        score: homeworkScore,
        state: homeworkState,
        teacherComments: ' ',
      };
      console.log('data 77777777777777777777777777777777777777');
      console.log(data);
      const oldUser = await ctx.model.Homework.find({ studentId, lessonId });
      if (oldUser.length < 1) {
        console.log('000000000000000000000000000000000000000055555555555555555');
        const addInfo = new ctx.model.Homework({
                studentId,
                lessonId,
                classId,
                homeworkItems: {
                  filePath: files.toString(),
                  description: lessonMaterialDescription,
                  score: homeworkScore,
                  state: homeworkState,
                  teacherComments: '',
                },
                createdAt: new Date(),
                isSignup: false,
                createdBy: studentId,
                lastUpatedAt: new Date(),
                lastUpdatedBy: studentId,
        });
        console.log(addInfo);
        let result = await addInfo.save();
        console.log(result);
        result = await ctx.model.Homework.find({ lessonId, studentId });
        payload.data = result.homeworkItems;
        this.ctx.body = { result: files.length + ' file(s) uploaded.' };
        ctx.app.io.emit('PushMessageToClient', files.length + ' file(s) uploaded.');
      } else if (oldUser.length === 1) {
        let result = await ctx.model.Homework.findOne({ studentId, lessonId }).update({ $push: { homeworkItems: data } });
        console.log(result);
        // let result = await ctx.model.Homework.findOneAndUpdate({ studentId, lessonId },
        // { $push: { homeworkItems: data } });
        result = await ctx.model.Homework.findOne({ studentId, lessonId });
        this.ctx.body = { result: files.length + ' file(s) uploaded.' };
        ctx.app.io.emit('PushMessageToClient', files.length + ' file(s) uploaded.');
      }
      // let result = await ctx.model.Homework.findOneAndUpdate({ _id: lessonId },
      //   { $push: { homeworkItems: data } });

    } catch (err) {
      console.log(err);
      payload.errCode = 1;
      payload.msg = '' + err.message;
      ctx.app.io.emit('PushMessageToClient', payload.msg);
      ctx.status = HTTPStatusCode.BAD_REQUEST;
      ctx.body = payload.msg;
    }
    ctx.app.io.emit('PushMessageToClient', payload);
  }
}
