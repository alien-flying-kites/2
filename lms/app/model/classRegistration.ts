// tslint:disable: linebreak-style
// import { Application } from 'egg';
import { Document, Model, model, Schema } from 'mongoose';// tslint:disable-line
import { ObjectId } from 'bson';

export enum ClassRegistrationApprovalState {
    WaitingForApproval = 1, // 初始状态，等待审核
    Approved = 2, // 审核通过
    Rejected = 3, // 拒绝班级申请
    Adjusted = 4, // 已调整班级
}

// 班级报名model
export interface IClassRegistrationModel extends Document {
    studentId: ObjectId; // 学生
    classId: ObjectId; //  报名哪个班级，报名多个班级需要多条数据
    acceptClassAdjustment: boolean; // 是否接受班级调剂
    approvalState: ClassRegistrationApprovalState; // 审核状态
    adjustedClassId: ObjectId; // 建议调整到的班级Id
    createdAt: Date;
    createdBy: ObjectId;
    lastUpatedAt: Date;
    lastUpdatedBy: ObjectId;
}
// schema
export const schema: Schema = new Schema({
    studentId:  {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    classId:  {
        type: Schema.Types.ObjectId,
        ref: 'Class',
    },
    acceptClassAdjustment: { type: Boolean, default: false },
    approvalState: { type: Number, required: true },
    adjustedClassId:  {
        type: Schema.Types.ObjectId,
        ref: 'Class',
    },
    createdAt: { type: Date, required: true },
    createdBy: { type: Schema.Types.ObjectId, default: Date.now },
    lastUpatedAt: { type: Date, required: true },
    lastUpdatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
});

export default (): Model<IClassRegistrationModel> => {
    return model<IClassRegistrationModel>('ClassRegistration', schema, 'ClassRegistration');
};
