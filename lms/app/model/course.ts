// tslint:disable: linebreak-style
// import { Application } from 'egg';
import { Document, Model, model, Schema } from 'mongoose';// tslint:disable-line
import { ObjectId } from 'bson';

// 课程model, 一门课程(course)包含很多节课(lesson)
export interface ICourseModel extends Document {
    name: string;
    classIds: ObjectId[]; // 该课程下有哪些班级
    description: string;
    adminId: ObjectId; // 课程管理员
    createdAt: Date;
    createdBy: ObjectId;
    lastUpatedAt: Date;
    lastUpdatedBy: ObjectId;
}
// schema
export const schema: Schema = new Schema({
    name: { type: String, required: true, unique: true, trim: true },
    classIds: [{
        type: Schema.Types.ObjectId,
        ref: 'Class',
    }],
    description: { type: String, trim: true, default: '' },
    adminId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    createdAt: { type: Date, required: true },
    createdBy: { type: Schema.Types.ObjectId, default: Date.now },
    lastUpatedAt: { type: Date, required: true },
    lastUpdatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
});

export default (): Model<ICourseModel> => {
    return model<ICourseModel>('Course', schema, 'Course');
};
