// tslint:disable: linebreak-style
// import { Application } from 'egg';
import { Document, Model, model, Schema } from 'mongoose';// tslint:disable-line
import { ObjectId } from 'bson';

// model
export interface ILabModel extends Document {
    name: string;
    location: string; // 实验室位置
    description: string;
    adminId: ObjectId; // 实验室管理员
    createdAt: Date;
    createdBy: ObjectId;
    lastUpatedAt: Date;
    lastUpdatedBy: ObjectId;
}
// schema
export const schema: Schema = new Schema({
    name: { type: String, required: true, unique: true, trim: true },
    location: { type: String, trim: true },
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

export default (): Model<ILabModel> => {
    return model<ILabModel>('Lab', schema, 'Lab');
};
