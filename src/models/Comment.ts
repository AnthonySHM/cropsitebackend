import mongoose, { Schema, Document } from 'mongoose';

export interface IComment extends Document {
  user: mongoose.Types.ObjectId;
  crop: mongoose.Types.ObjectId;
  content: string;
  createdAt: Date;
}

const CommentSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  crop: { type: Schema.Types.ObjectId, ref: 'Crop', required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IComment>('Comment', CommentSchema);
