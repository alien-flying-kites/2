// tslint:disable: linebreak-style
// import { Application } from 'egg';
import { Document, Model, model, Schema } from 'mongoose';// tslint:disable-line
import { ObjectId } from 'bson';

// 课程班model，课程班指该学生实际上课时形成的班级，其学生可以是学籍班里的学生，也可以是上选修课时报名形成的班，比如高等数学班，西方美术班
export interface ICourseClassModel extends Document {
    name: string;
    description: string;
    class2Id: ObjectId; // 学籍班Id, 如果课程班由学籍班生成，该值指向学籍班Id，学生列表也从学籍班里取，否则学生列表由studentIds里取
    studentIds: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }]; // 当前学生列表
    courseId: ObjectId;
    teacherId: ObjectId; // 任课老师
    adminId: ObjectId; // 班级管理员
    // studyTime: string; // 上课时间 如：一三五上午10:00-12:00
    dateToOpenClass: Date; // 开班日期
    // placeToStudy: string; // 上课地点
    isOpenForRegisteration: boolean; // 是否接受报名
    studentLimit: number; // 学生人数限制
    isActive: boolean; // 班级是否已解散，true为活动状态，为解散，false, 为已解散
    createdAt: Date;
    createdBy: ObjectId;
    lastUpatedAt: Date;
    lastUpdatedBy: ObjectId;
}

// schema
export const courseClassSchema: Schema = new Schema({
    name: { type: String, required: true, unique: true, trim: true },
    courseId:  {
        type: Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
    },
    description: { type: String, trim: true, default: '' },
    class2Id:  {
        type: Schema.Types.ObjectId,
        ref: 'Class2',
        required: false,
    },
    teacherId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    adminId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    // studyTime: { type: String, trim: true, default: '' },
    dateToOpenClass: { type: Date, required: false },
    // placeToStudy: { type: String, trim: true, default: '' },
    studentIds: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
    isOpenForRegisteration: { type: Boolean, required: true, default: true },
    studentLimit: { type: Number, required: true },
    isActive: { type: Boolean, required: true, default: true },
    createdAt: { type: Date, required: true },
    createdBy: { type: Schema.Types.ObjectId, default: Date.now },
    lastUpatedAt: { type: Date, required: true },
    lastUpdatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
});

export default (): Model<ICourseClassModel> => {
    return model<ICourseClassModel>('Class', courseClassSchema, 'Class');
};
