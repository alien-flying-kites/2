// tslint:disable: linebreak-style
import { Application } from 'egg';
import { Document, Model, model, Schema } from 'mongoose';// tslint:disable-line
import { ObjectId } from 'bson';
import { createHash } from 'crypto';
import { RoleType } from './role';

export enum Gender {
    Unspecified = 0,
    Male = 1,
    Female = 2,
}

export enum UserStatus {
  Unapproved = 0, // 已注册未批准，刚注册的用户无法登陆
  Activated = 1, // 已激活
  Locked = 2, // 已冻结，冻结的用户可以登录，但功能受限
}

export interface IUserModel extends Document {
    userName: string; // the account name to login
    password: string; // use SHA256 to hash the plain text (MD5 and SHA1 are both not secure)
    displayName: string; // the display name, usually that's the user's real name
    roleTypes: number[]; // roles the user belongs to
    gender: Gender; // female, male, unspecified
    mobilePhone: string;
    email: string;
    address: string;
    passwordSetAt: Date; // when the password is set
    passwordExpired: boolean; // if the pssword has ben expired, user must reset password when password is expired.true for actively created user, false for registered user
    status: UserStatus;
    lastLoginAt: Date;
    createdAt: Date;
    createdBy: ObjectId;
    lastUpatedAt: Date;
    lastUpdatedBy: ObjectId;
    verifyPassword(password: string): boolean;
    setPasswordHash(): void;
  }

  // 学生
export interface IStudentModel extends IUserModel {
  roleTypes: number[]; // roles the user belongs to
  classId: ObjectId;
}

// schema
export const userSchema: Schema = new Schema({
    userName: { type: String, required: true, unique: true, index: true, trim: true, maxlength: 255, minlength: 2 },
    password: { type: String, required: true },
    displayName: { type: String, required: true, unique: true, trim: true, maxlength: 255, minlength: 2 },
    roleTypes: [{ type: Number, }],
    gender: { type: Number, required: true },
    mobilePhone: { type: String, unique: true, trim: true, maxlength: 20, minlength: 4 },
    address: { type: String },
    email: { type: String, required: true, unique: true, trim: true, maxlength: 255, minlength: 5 },
    passwordSetAt: { type: Date, required: true, default: Date.now },
    passwordExpired: { type: Boolean, required: true, default: false },
    status: { type: Number, required: true, default: 0 },
    lastLoginAt: { type: Date, required: true },
    createdAt: { type: Date, required: true, default: Date.now },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    lastUpatedAt: { type: Date, required: true },
    lastUpdatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
});

// schema
export const studentSchema: Schema = new Schema({
  userName: { type: String, required: true, unique: true, index: true, trim: true, maxlength: 255, minlength: 2 },
  password: { type: String, required: true },
  displayName: { type: String, required: true, unique: true, trim: true, maxlength: 255, minlength: 2 },
  roleTypes: [{ type: Number, }],
  classId: {
    type: Schema.Types.ObjectId,
    ref: 'Class2',
  },
  gender: { type: Number, required: true },
  mobilePhone: { type: String, unique: true, trim: true, maxlength: 20, minlength: 4 },
  address: { type: String },
  email: { type: String, required: true, unique: true, trim: true, maxlength: 255, minlength: 5 },
  passwordSetAt: { type: Date, required: true, default: Date.now },
  passwordExpired: { type: Boolean, required: true, default: false },
  status: { type: Number, required: true, default: 0 },
  lastLoginAt: { type: Date, required: true },
  createdAt: { type: Date, required: true, default: Date.now },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  lastUpatedAt: { type: Date, required: true },
  lastUpdatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
  },
});

// tslint:disable-next-line: ter-prefer-arrow-callback
studentSchema.pre<IStudentModel>('save', function (next) {
  this.roleTypes = [ RoleType.Student ];
  next();
});

export default (app: Application): Model<IUserModel> => {
    const passwordSalt = app.config.keys;
    userSchema.methods.verifyPassword = function (password: string): boolean {
      const hash = createHash('sha256');
      return hash.update(passwordSalt + password).digest('hex') === this.password;
    };
    userSchema.methods.setPasswordHash = function () {
      const hash = createHash('sha256');
      this.password = hash.update(passwordSalt + this.password).digest('hex');
    };
    const User = model<IUserModel>('User', userSchema, 'User');
    User.discriminator('Student', studentSchema);
    return User;
  };
