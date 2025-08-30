// backend/src/models/note.model.ts
import { Schema, model, Document, Types } from 'mongoose';

export interface INote extends Document {
  user: Types.ObjectId;
  content: string;
}

const NoteSchema = new Schema<INote>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
}, { timestamps: true });

export default model<INote>('Note', NoteSchema);