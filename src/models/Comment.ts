import mongoose, { Schema, Document } from 'mongoose';

export interface IComment extends Document {
  user: mongoose.Types.ObjectId;
  crop: mongoose.Types.ObjectId;
  content: string;
  createdAt: Date;
  tab: string; // Add this line
}

const CommentSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  crop: { type: Schema.Types.ObjectId, ref: 'Crop', required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  tab: { type: String, required: true }, // Add this line
});

export default mongoose.model<IComment>('Comment', CommentSchema);