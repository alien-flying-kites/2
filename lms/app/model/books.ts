// tslint:disable: linebreak-style
// import { Application } from 'egg';
import { Document, Model, model, Schema } from 'mongoose';// tslint:disable-line

// model
export interface IBooksModel extends Document {
    ip: string;
    port: string;
    content: string;
    createdAt: Date;
}

// schema
export const schema: Schema = new Schema({
    ip: { type: String, required: true, unique: true, trim: true },
    port: { type: String, required: true, unique: true, trim: true },
    content: { type: String },
    createdAt: { type: Date, required: true },
});

export default (): Model<IBooksModel> => {
    return model<IBooksModel>('books', schema, 'books');
};
