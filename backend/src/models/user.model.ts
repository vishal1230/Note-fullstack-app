// backend/src/models/user.model.ts
import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  dateOfBirth: Date;
  googleId?: string;
  otp?: string;
  otpExpires?: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  dateOfBirth: { type: Date, required: true },
  googleId: { type: String },
  otp: { type: String },
  otpExpires: { type: Date },
}, { timestamps: true });

export default model<IUser>('User', UserSchema);