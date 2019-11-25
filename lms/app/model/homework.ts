// tslint:disable: linebreak-style
// import { Application } from 'egg';
import { Document, Model, model, Schema } from 'mongoose';// tslint:disable-line
import { ObjectId } from 'bson';

export enum HomeworkState {
    Unsubmitted = 1, // 未提交
    Submitted = 2, // 已提交
    Corrected = 3, // 已批改
}

export interface IHomeworkItem extends Document {
    filePath: string[]; // optional
    description: string; // 如果不需要提交文件，可直接以文本方式提交作业
    state: number;
    score: number;
    teacherComments: string;
}

const homeworkItemSchema = new Schema({
    filePath: { type: String, trim: true },
    state: { type: Number, trim: true, required: true, },
    score: { type: Number, trim: true, default: -1 },
    teacherComments: { type: String, trim: true, default: '' },
    description: { type: String, required: true, trim: true, default: '' }, });

// 作业model
export interface IHomeworkModel extends Document {
    description: string; // 作业总体描述，此处不应存放作业结果的内容
    studentId: ObjectId; // 作业所有人
    lessonId: ObjectId; // 该作业属于哪次课
    classId: ObjectId; // 该作业属于哪个班，属于冗余数据，但存储该数据可减少一次查询
    homeworkItems: IHomeworkItem[]; // 做的作业的结果存储在这里
    // state: HomeworkState; // 作业状态
    // score: number; // 作业评分，由老师评定
    // teacherComments: string; // 老师评语
    createdAt: Date;
    createdBy: ObjectId;
    lastUpatedAt: Date;
    lastUpdatedBy: ObjectId;
}
// schema
export const schema: Schema = new Schema({
    description: { type: String, trim: true, default: '' },
    studentId: {
        type: Schema.Types.ObjectId,
        ref: 'User', },
    lessonId: {
            type: Schema.Types.ObjectId,
            ref: 'Lesson',
            required: true, },
    classId: {
            type: Schema.Types.ObjectId,
            ref: 'Class',
            required: true, },
    homeworkItems: [ homeworkItemSchema ],
    // state: { type: Number, required: true, },
    // score: { type: Number, default: -1 },
    // teacherComments: { type: String, trim: true, default: '' },
    createdAt: { type: Date, required: true },
    createdBy: { type: Schema.Types.ObjectId, default: Date.now },
    lastUpatedAt: { type: Date, required: true },
    lastUpdatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
});

export default (): Model<IHomeworkModel> => {
    return model<IHomeworkModel>('Homework', schema, 'Homework');
};
