// tslint:disable: linebreak-style
import { Controller } from 'egg';
import { IUserModel, UserStatus, Gender } from '../model/user';
import JwtPayload from '../core/jwtPayload';
import { createHash } from 'crypto';
import { ObjectId } from 'bson';
import { RoleType } from '../model/role';
import ResponsePayload from '../io/controller/responsePayload';
import * as fs from 'fs';
import * as path from 'path';
import * as pump from 'mz-modules/pump';
import HTTPStatusCode from '../core/HTTPStatusCode';
import * as XLSX from 'xlsx';

export default class UserController extends Controller {
  // public model: mongoose.Model<IUser>;
  ws: any;
  public async index() {
    const { ctx } = this;

    await ctx.model.User.find({}, (err: any, result: IUserModel[]) => {
      if (err) {
        console.log(err);
      } else {
        ctx.body = result;
      }
    });
  }

  public async create() {
    const { ctx } = this;
    try {
      const user = ctx.request.body;
      if (!user.password) {
        ctx.body = { success: false, message: '密码不能为空' };
        return;
      }
      if (user.mobilePhone && !/^1[3456789]\d{9}$/.test(user.mobilePhone)) {
        ctx.body = { success: false, message: '手机号有误' };
        return;
      }
      const checkUid = await ctx.model.User.find({ userName: user.userName });
      if (checkUid.length > 0) {
        ctx.body = { success: false, message: '登录名已存在' };
        return;
      }
      const checkdisplayName = await ctx.model.User.find({ displayName: user.displayName });
      if (checkdisplayName.length > 0) {
        ctx.body = { success: false, message: '显示名已存在' };
        return;
      }
      const checkemail = await ctx.model.User.find({ email: user.email });
      if (checkemail.length > 0) {
        ctx.body = { success: false, message: '邮箱已存在' };
        return;
      }
      const checkphone = await ctx.model.User.find({ mobilePhone: user.mobilePhone });
      if (checkphone.length > 0) {
        ctx.body = { success: false, message: '手机号码已存在' };
        return;
      }
      if (!user.class2Name) {
        const minDate = new Date(-8640000000000000);
        const addUser = new ctx.model.User({
          userName: user.userName,
          password: user.password,
          displayName: user.displayName,
          roleTypes: user.roleTypes,
          gender: user.gender,
          mobilePhone: user.mobilePhone,
          email: user.email,
          address: user.address,
          passwordSetAt: new Date(),
          passwordExpired: false,
          status: UserStatus.Unapproved, // 注册用户默认为末激活状态
          lastLoginAt: minDate,
          createdAt: new Date(),
          createdBy: ObjectId.createFromHexString('000000000000000000000000'),
          lastUpatedAt: new Date(),
          lastUpdatedBy: ObjectId.createFromHexString('000000000000000000000000'),
        });
        addUser.setPasswordHash();
        // const userInfo: IUserModel = await ctx.model.User.findOne(addUser);
        const userFound = await addUser.save();
        ctx.body = { success: true, message: '注册成功', userFound };
        const data = {
          password: user.password,
          newPhone: user.mobilePhone,
          oldPhone: '',
          option: 'C',
        };
        this.connect(data);
        ctx.status = HTTPStatusCode.OK;
      } else {
        const minDate = new Date(-8640000000000000);
        const addUser = new ctx.model.User.discriminators.Student({
          userName: user.userName,
          password: user.password,
          displayName: user.displayName,
          roleTypes: [ RoleType.Student ],
          classId: user.class2Name,
          gender: user.gender,
          mobilePhone: user.mobilePhone,
          email: user.email,
          address: user.address,
          passwordSetAt: new Date(),
          passwordExpired: false,
          status: UserStatus.Unapproved, // 注册用户默认为末激活状态
          lastLoginAt: minDate,
          createdAt: new Date(),
          createdBy: ObjectId.createFromHexString('000000000000000000000000'),
          lastUpatedAt: new Date(),
          lastUpdatedBy: ObjectId.createFromHexString('000000000000000000000000'),
        });
        addUser.setPasswordHash();
        // const userInfo: IUserModel = await ctx.model.User.findOne(addUser);
        const userFound = await addUser.save();
        await ctx.model.Class2.findByIdAndUpdate(user.class2Name, { $addToSet: { studentIds: userFound._id } });
        // const studentCount = await app.model.User.discriminators.Student.find({}).count();
        ctx.body = { success: true, message: '注册成功', userFound };
        const data = {
          password: user.password,
          newPhone: user.mobilePhone,
          oldPhone: '',
          option: 'C',
        };
        this.connect(data);
        ctx.status = HTTPStatusCode.OK;
      }
    } catch (error) {
      const errorMessage = (error && error.message) || '发生了未知错误';
      ctx.body = { success: false, message: errorMessage };
      ctx.status = HTTPStatusCode.BAD_REQUEST;
    }
  }

  public async uploadStudent() {
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
      if (!ctx.user.roleTypes || ctx.user.roleTypes.indexOf(RoleType.SuperAdmin) === -1) {
        ctx.app.io.emit('PushMessageToClient', '只有管理员才可以上传学生数据');
        return;
      }
      const isoString = new Date().toISOString();
      const isoDate = isoString.substr(0, isoString.indexOf('T'));
      const userIdIsoTime = ctx.user._id + '_' + isoString.substr(isoString.indexOf('T') + 1).replace(/[:\.Z]/ig, '');

      const files: string[] = [];
      const stream = await ctx.getFileStream();
      const filename = stream.filename.toLowerCase();
      const relativePath = path.join('public', isoDate, userIdIsoTime);
      const directory = path.join(this.config.baseDir, 'app', relativePath);
      fs.mkdirSync(directory, { recursive: true });
      const target = path.join(directory, filename);
      const writeStream = fs.createWriteStream(target);
      await pump(stream, writeStream);
      files.push(path.join(relativePath, filename));

      const wb: XLSX.WorkBook = XLSX.readFile(target);
      if (wb.SheetNames.length !== 0) {
        const ws = wb.Sheets[wb.SheetNames[0]];
        const headers: string[] = [];
        const sheetRange = ws['!ref'] || '';
        const range = XLSX.utils.decode_range(sheetRange);
        const R = range.s.r; /* start in the first row */
        /* walk every column in the range */
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const cell = ws[XLSX.utils.encode_cell({ c: C, r: R })]; /* find the cell in the first row */
          let hdr = 'UNKNOWN ' + C; // <-- replace with your desired default
          if (cell && cell.t) hdr = XLSX.utils.format_cell(cell);
          headers.push(hdr);
        }
        if (headers.indexOf('班级名称') === -1 || headers.indexOf('学生姓名') === -1
        || headers.indexOf('手机号') === -1) {
          ctx.app.io.emit('PushMessageToClient', '格式不正确，请使用正确的Excel模板！');
          return;
        }
        const sheetRows = XLSX.utils.sheet_to_json(ws, { header: 0, raw: true });
        // validate data
        let errorMessage = '';
        let rowIndex = 0;
        let successCount = 0;
        const minDate = new Date(-8640000000000000);
        for (const row of sheetRows) {
          rowIndex++;
          try {
// tslint:disable: no-string-literal
            const className = String(row['班级名称']).toString().trim();
            const studentName = String(row['学生姓名']).toString().trim();
            const genderStr = String(row['性别']).toString().trim();
            let gender = Gender.Unspecified;
            if (genderStr === '男') {
              gender = Gender.Male;
            } else if (genderStr === '女') {
              gender = Gender.Female;
            }
            const mobilePhone = String(row['手机号']).toString().trim();
            const email = String(row['邮箱']).toString().trim();
            const address = String(row['联系地址']).toString().trim();

            if (className.length === 0) {
              errorMessage += ('第' + rowIndex.toString() + '条学生数据缺少班级名称; ');
              continue;
            }
            if (studentName.length === 0) {
              errorMessage += ('第' + rowIndex.toString() + '条学生数据缺少学生姓名; ');
              continue;
            }
            if (!/^1[3|4|5|7|8|9][0-9]\d{4,8}$/.test(mobilePhone)) {
              errorMessage += (studentName + '的手机号格式错误; ');
              continue;
            }
            if (email.length < 5) {
              errorMessage += (studentName + '的邮箱长度太短; ');
              continue;
            }
            if (!/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(email)) {
              errorMessage += (studentName + '的邮箱格式错误; ');
              continue;
            }
            const checkUid = await ctx.model.User.find({ userName: studentName });
            if (checkUid.length > 0) {
              errorMessage += (studentName + '的用户名"' + studentName + '"已存在; ');
              continue;
            }
            const checkdisplayName = await ctx.model.User.find({ displayName: studentName });
            if (checkdisplayName.length > 0) {
              errorMessage += (studentName + '的显示名已存在:' + studentName + '; ');
              continue;
            }
            const checkemail = await ctx.model.User.find({ email });
            if (checkemail.length > 0) {
              errorMessage += (studentName + '的邮箱已存在:' + email + '; ');
              continue;
            }
            const checkphone = await ctx.model.User.find({ mobilePhone });
            if (checkphone.length > 0) {
              errorMessage += (studentName + '的手机号码已存在:' + mobilePhone + '; ');
              continue;
            }
            let class2 = await ctx.model.Class2.findOne({ name: className });
            // if no class, add it
            if (!class2) {
              const addClass2 = new ctx.model.Class2({
                name: className,
                description: '',
                studentIds: [],
                createdAt: new Date(),
                isActive: true,
                createdBy: ctx.user._id,
                lastUpatedAt: new Date(),
                lastUpdatedBy: ctx.user._id,
              });
              class2 = await addClass2.save();
            }

            // add student and add it to the class
            const addUser = new ctx.model.User.discriminators.Student({
              userName: studentName,
              password: mobilePhone,
              displayName: studentName,
              roleTypes: [ RoleType.Student ],
              classId: class2._id,
              gender,
              mobilePhone,
              email,
              address,
              passwordSetAt: new Date(),
              passwordExpired: false,
              status: UserStatus.Activated, // 导入用户默认为已激活状态
              lastLoginAt: minDate,
              createdAt: new Date(),
              createdBy: ctx.user._id,
              lastUpatedAt: new Date(),
              lastUpdatedBy: ctx.user._id,
            });
            addUser.setPasswordHash();
            // const userInfo: IUserModel = await ctx.model.User.findOne(addUser);
            const userFound = await addUser.save();
            const data = {
              password: mobilePhone,
              newPhone: mobilePhone,
              oldPhone: mobilePhone,
              option: 'C',
            };
            this.connect(data);
            ctx.status = HTTPStatusCode.OK;
            // console.log('userFound  00000000000000000000000000000000000000000000000000000000000000000000000');
            // console.log(userFound);
            await ctx.model.Class2.findByIdAndUpdate(class2._id, { $addToSet: { studentIds: userFound._id } });
            successCount++;
          } catch (err) {
            errorMessage += err.message;
            continue;
          }
        }
        errorMessage = '成功导入了' + successCount.toString() + '条学生数据.\r\n' + errorMessage;
        ctx.app.io.emit('PushMessageToClient', errorMessage);
      } else {
        ctx.app.io.emit('PushMessageToClient', 'Excel文件为空，没有数据需要导入');
      }
      ctx.body = { success: true, message: '导入成功' };
      ctx.status = HTTPStatusCode.OK;
    } catch (err) {
      payload.errCode = 1;
      payload.msg = '' + err.message;
      ctx.app.io.emit('PushMessageToClient', payload.msg);
      ctx.status = HTTPStatusCode.BAD_REQUEST;
      ctx.body = payload.msg;
    }
    ctx.app.io.emit('PushMessageToClient', payload);
  }

  public async login() {
    const { ctx } = this;
    try {
      // const { account, password } = JSON.parse(ctx.query.params); // as { account: string, password: string };
      const { account, password } = ctx.request.body; // as { account: string, password: string };
      let condition: any = { userName: account };
      if (/^1[3|4|5|6|7|8|9][0-9]\d{4,8}$/.test(account)) {
        condition = { mobilePhone: account };
      }
      if (/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(account)) {
        condition = { email: account };
      }
      const userFound: IUserModel = await ctx.model.User.findOne(condition);
      if (!userFound) {
        ctx.throw(new Error('账号或密码错误，请重新输入'));
      }

      const passwordSalt = ctx.app.config.keys;
      const hash = createHash('sha256');

      if (!(hash.update(passwordSalt + password).digest('hex') === userFound.password)) {
        ctx.throw(new Error('账号或密码错误，请重新输入'));
      }

      if (userFound.status === UserStatus.Unapproved) {
        ctx.throw(new Error('该用户还未激活，请等待管理员激活后再登录'));
      }
      if (userFound.status === UserStatus.Locked) {
        ctx.throw(new Error('该用户已被冻结，请等待管理员激活后再登录'));
      }
      let types = 0;
      if (userFound.roleTypes) {
        // tslint:disable: no-bitwise
        userFound.roleTypes.forEach(x => { types |= x; });
      }
      const payLoad: JwtPayload = { _id: userFound._id, displayName: userFound.displayName, roleTypes: types, userName: userFound.userName, mobilePhone: userFound.mobilePhone, email: userFound.email };
      const token = await ctx.service.token.generateToken(payLoad);

      ctx.body = { success: true, message: '登录成功，正在跳转...', token };
      ctx.status = HTTPStatusCode.OK;
    } catch (error) {
      const errorMessage = (error && error.message) || '发生了未知错误';
      ctx.body = { success: false, message: errorMessage };
      ctx.status = HTTPStatusCode.BAD_REQUEST;
    }
  }

  public async update() {
    const { ctx } = this;
    const user = JSON.parse(ctx.query.params);
    // console.log(user);
    const result = await ctx.model.User.update(user, (err: any) => {
      if (err) {
        console.log(err);
      }
    });
    ctx.body = result;
  }

  public async delete() {
    const { ctx } = this;
    const user = JSON.parse(ctx.query.params);
    console.log(user);
    const result = await ctx.model.User.remove(user, (err: any) => {
      if (err) {
        console.log(err);
      }
    });
    ctx.body = result;
  }

  public async find() {
    const { ctx } = this;
    try {
      const userName = ctx.request.body; // as { account: string, password: string };
      const data: IUserModel = await ctx.model.User.findOne(userName);
      ctx.body = { message: '操作成功', data };
      ctx.status = HTTPStatusCode.OK;
    } catch (error) {
      const errorMessage = (error && error.message) || 'unexpected error occurred';
      ctx.body = { message: errorMessage };
      ctx.status = HTTPStatusCode.BAD_REQUEST;
    }
  }

  public async getClass2Option() {
      const { ctx } = this;
      await ctx.model.Class2.find({}, (err: any, result) => {
        if (err) {
          console.log(err);
        } else {
          ctx.body = result;
        }
      });
    }
  public async changePassword() {
    const { ctx } = this;
    try {
      const user = ctx.request.body;
      if (!user.username) {
        ctx.body = { success: false, message: '登录名不能为空' };
        return;
      }
      if (!user.oldpassword) {
        ctx.body = { success: false, message: '登录名不能为空' };
        return;
      }
      if (!user.newpassword) {
        ctx.body = { success: false, message: '登录名不能为空' };
        return;
      }
      if (!user.newpassword2) {
        ctx.body = { success: false, message: '登录名不能为空' };
        return;
      }
      if (user.newpassword2 !== user.newpassword) {
        ctx.body = { success: false, message: '两次密码输入不一致' };
        return;
      }
      const userInfo = new ctx.model.User({
        password: user.oldpassword,
      });
      userInfo.setPasswordHash();
      const checkUid = await ctx.model.User.find({ userName: user.username, password: userInfo.password });
      if (checkUid.length > 0 && checkUid.length === 1) {
        ctx.body = { success: true, message: '原密码正确' };
      } else {
        ctx.body = { success: false, message: '原密码错误' };
        return;
      }
      const userInfo2 = new ctx.model.User({
        password: user.newpassword2,
      });
      userInfo2.setPasswordHash();
      const userFound = await ctx.model.User.updateOne({ userName: user.username }, { password: userInfo2.password });
      ctx.body = { success: true, message: '修改密码成功', userFound };
      ctx.status = HTTPStatusCode.OK;
    } catch (error) {
      const errorMessage = (error && error.message) || '发生了未知错误';
      ctx.body = { success: false, message: errorMessage };
      ctx.status = HTTPStatusCode.BAD_REQUEST;
    }
  }
  connect(data) {
    const WebSocket = require('ws');
    if (this.ws) return;
    console.log(this.ws);
    console.log(data);
    const _data = data;
    console.log(_data);
    this.ws = new WebSocket('ws://127.0.0.1:4444', {});
    if (this.ws.readyState !== 1) {
      console.log('未连接');
      console.log(this.ws.readyState);
    }
    // console.log(ws);
    const me = this;
    let isConnected = true;
    this.ws.on('open', function open() {
      console.log('***connected');
      console.log(_data);
      me.ws.send(JSON.stringify(_data));
      isConnected = false;
      // me.ws.send({ hahha: 666 });
      // heartBitTimer = setInterval(function () {
      //   console.log('发送心跳' +  new Date());
      //   ws.send(JSON.stringify({ type: 3 }));
      // }, 1000 * 30);
    });
    // Book.find({}, (err: any, docs) => {
    this.ws.on('error', (err: any) => {
      let reConnectNum = 0;
      // const isConnected = false;
      isConnected = false;
      console.log('\n*** occur err 11111111111111111');
      console.log(`code: ${err.code}`);
      console.log(`errno:: ${err.errno}`);
      if (!isConnected) {
        console.log(`reconnect num: ${ ++ reConnectNum }, ${new Date()}\n`);
      }
    });
    if (!isConnected) {
      this.ws.on('close', function close(code) {
        // const isConnected = false;
        console.log(`***close, code: ${code}, ${new Date()}`);
      });
    }
    this.ws.on('message', async function incoming(data: any) {
      console.log('\n***receive:', data);
      const { type, name } = JSON.parse(data);
      if (!type || !name) return;
    });
  }
}
