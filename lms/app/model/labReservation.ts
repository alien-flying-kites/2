// tslint:disable: linebreak-style
// import { Application } from 'egg';
import { Document, Model, model, Schema } from 'mongoose';// tslint:disable-line
import { ObjectId } from 'bson';

export enum RepeatType {
    EveryDay = 1, // 每天重复
    EveryNDay = 2, // 每隔N天重复，N需要后面指定
    EveryWeek = 3, // 每周重复
    EveryOtherWeek = 4, // 每隔周重复
    EveryMonth = 5, // 每月重复
}

// model
export interface ILabReservationModel extends Document {
    labId: ObjectId; // 实验室,也就是要预订的资源Id，类似预订会议室时候的会议室
    date: Date; // 开始日期
    endDate: Date; // 结束日期
    startTimeInADay: number; // 开始时间，以半小时为单位，比如上午9点半即为9.5, 下午2点即为14.0
    endTimeInADay: number; // 结束时间，以半小时为单位
    isRepeated: boolean; // 是否重复， false代表单次预订，true代表重复预订，需要继续指定重复规则
    repeatType: RepeatType; // 重复类型
    repeatParams: number[]; // 重复时间参数，按天重复不需要此参数，按周/隔周重复需指定1~7的列表, 按月重复需指定1~31的列表，隔N天需指定N的值
    avoidWeekend: boolean; // 排课时是否避开周六周日，对按周/隔周重复类型无效，对其他重复类型有效
    classId: ObjectId; // 班级的Id，此处必须是课程班，也可以选择学籍班和课程后，生成课程班
    courseId: ObjectId; // 课程Id, 冗余数据，方便查询，填入课程班的courseId, (如选择学籍班和课程，需要先生成课程班)
    createdAt: Date;
    createdBy: ObjectId; // 预订人
    lastUpatedAt: Date;
    lastUpdatedBy: ObjectId;
}
// schema
export const schema: Schema = new Schema({
    labId: {
        type: Schema.Types.ObjectId,
        ref: 'Lab',
    }, // 上课地点
    date: { type: Date, required: true, },
    endDate: { type: Date, required: true, },
    startTime: { type: Number, required: true, }, // 本次上课时间开始时间，以半小时为单位，比如上午9点半即为9.5, 下午2点即为14.0
    endTime: { type: Number, required: true, }, // 本次上课时间结束时间
    isRepeated: { type: Boolean, required: true, default: false }, // 是否重复， false代表单次预订，true代表重复预订，需要继续指定重复规则
    repeatType: { type: Number, required: false, }, // 重复类型
    repeatParams: [{ type: Number, }], // 重复时间参数，按天重复不需要此参数，按周/隔周重复需指定1~7的列表, 按月重复需指定1~31的列表，隔N天需指定N的值
    avoidWeekend: { type: Boolean, required: false }, // 排课时是否避开周六周日，对按周/隔周重复类型无效，对其他重复类型有效
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
    createdAt: { type: Date, required: true },
    createdBy: { type: Schema.Types.ObjectId, default: Date.now },
    lastUpatedAt: { type: Date, required: true },
    lastUpdatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
});

export default (): Model<ILabReservationModel> => {
    return model<ILabReservationModel>('LabReservation', schema, 'LabReservation');
};
