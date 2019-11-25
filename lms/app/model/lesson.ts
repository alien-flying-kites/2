// tslint:disable: linebreak-style
// import { Application } from 'egg';
import { Document, Model, model, Schema } from 'mongoose';// tslint:disable-line
import { ObjectId } from 'bson';

export enum LessonMaterialItemType {
    LessonPlan = 1, // 教案
    SampleCode = 2, // 示例代码
    HomeworkAssignment = 3, // 作业
}

export interface ILessonMaterialItem extends Document {
    materialItemType: LessonMaterialItemType;
    fileList: string[];
    description: string;
}

const materialItemSchema = new Schema({
    materialItemType: { type: Number, required: true },
    fileList: [{ type: String, trim: true }],
    description: { type: String, required: true, trim: true, default: '' }, });

// 课次model，一门课程(course)包含很多节课(lesson)
export interface ILessonModel extends Document {
    // name: string; // 可以是第几次课后者直接是本次课的主题名称(比如：梯度下降，积分计算)
    // description: string; // 课次的描述，比如：本次课可以让学生理解什么是积分
    reservationId: ObjectId; // 排课Id
    courseId: ObjectId; // 本次课是对应什么课程
    classId: ObjectId; // 本次课是哪个班级的课, 可以是课程班，也可以是学籍班
    teacherId: ObjectId; // 任课老师，默认就是班级的老师，但有可能有代课现象，所以有可能是代课老师
    date: Date; // 2019.03.22
    startTime: number; // 本次上课时间开始时间，以半小时为单位，比如上午9点半即为9.5, 下午2点即为14.0
    endTime: number; // 本次上课时间结束时间
    labId: ObjectId; // 上课地点
    absentStudentIds: ObjectId[]; // 缺席上课的学生列表
    attendantStudentIds: ObjectId[]; // 参加上课的学生列表
    lessonMaterialItems: ILessonMaterialItem[];
    createdAt: Date;
    createdBy: ObjectId;
    lastUpatedAt: Date;
    lastUpdatedBy: ObjectId;
}
// schema
export const schema: Schema = new Schema({
    // name: { type: String, required: true, trim: true }, // 应建立联合索引:课程id+班级id+课次名称
    // description: { type: String, trim: true, default: '' },
    reservationId:  { // 排课Id
        type: Schema.Types.ObjectId,
        ref: 'LabReservation',
        required: true,
    },
    courseId:  {
        type: Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
    },
    classId:  {
        type: Schema.Types.ObjectId,
        ref: 'Class',
        required: true,
    },
    teacherId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    date: { type: Date, required: true, },
    startTime: { type: Number, required: true, }, // 本次上课时间开始时间，以半小时为单位，比如上午9点半即为9.5, 下午2点即为14.0
    endTime: { type: Number, required: true, }, // 本次上课时间结束时间
    labId: {
        type: Schema.Types.ObjectId,
        ref: 'Lab',
    }, // 上课地点
    absentStudentIds: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
    attendantStudentIds: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
    lessonMaterialItems: [ materialItemSchema ],
    createdAt: { type: Date, required: true },
    createdBy: { type: Schema.Types.ObjectId, default: Date.now },
    lastUpatedAt: { type: Date, required: true },
    lastUpdatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
});

// tslint:disable-next-line: ter-prefer-arrow-callback
schema.pre<ILessonModel>('save', function (next) {
    this.date = new Date(this.date.toDateString());
    next();
  });

// schema.index({ date: 1, startTime: 1, labId: 1 }, { unique: true });
export default (): Model<ILessonModel> => {
    return model<ILessonModel>('Lesson', schema, 'Lesson');
};
