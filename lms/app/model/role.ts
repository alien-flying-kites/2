// tslint:disable: linebreak-style
// import { Application } from 'egg';
import { Document, Model, model, Schema } from 'mongoose';// tslint:disable-line
import { ObjectId } from 'bson';

// model
export interface IRoleModel extends Document {
    roleName: string;
    roleType: RoleType;
    description: string;
    createdAt: Date;
    createdBy: ObjectId;
    lastUpatedAt: Date;
    lastUpdatedBy: ObjectId;
}

export enum RoleType {
    SuperAdmin = 1,
    SchoolAdmin = 2,
    CourseAdmin = 4,
    ClassAdmin = 8,
    LabAdmin = 16,
    Teacher = 32,
    Student = 64,
}
// schema
export const schema: Schema = new Schema({
    roleName: { type: String, required: true, unique: true, trim: true },
    roleType: { type: Number, required: true, unique: true },
    description: { type: String, trim: true, default: '' },
    createdAt: { type: Date, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', default: Date.now },
    lastUpatedAt: { type: Date, required: true },
    lastUpdatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
});

export default (): Model<IRoleModel> => {
    return model<IRoleModel>('Role', schema, 'Role');
};
