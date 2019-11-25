// tslint:disable: linebreak-style
// import { Application } from 'egg';
import { Document, Model, model, Schema } from 'mongoose';// tslint:disable-line
import { ObjectId } from 'bson';

// 学籍班model，指学籍所在的班，不与课程关联
export interface IRegularClassModel extends Document {
    name: string; // 比如： 2019级计算机1班
    description: string;
    studentIds: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }]; // 当前学生列表
    isActive: boolean; // 班级是否已解散，true为活动状态，为解散，false, 为已解散
    createdAt: Date;
    createdBy: ObjectId;
    lastUpatedAt: Date;
    lastUpdatedBy: ObjectId;
}

// schema
export const schema: Schema = new Schema({
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, trim: true, default: '' },
    studentIds: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
    isActive: { type: Boolean, required: true, default: true },
    createdAt: { type: Date, required: true },
    createdBy: { type: Schema.Types.ObjectId, default: Date.now },
    lastUpatedAt: { type: Date, required: true },
    lastUpdatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
});

export default (): Model<IRegularClassModel> => {
    return model<IRegularClassModel>('Class2', schema, 'Class2');
};
