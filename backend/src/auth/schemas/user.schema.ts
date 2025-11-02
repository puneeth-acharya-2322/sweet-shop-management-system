// backend/src/auth/schemas/user.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

@Schema()
export class User extends Document {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: String, enum: UserRole, default: UserRole.USER })
  role: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);

// This is a "pre-save hook"
// Before saving a new 'User' document, this function will run
UserSchema.pre<User>('save', async function (next) {
  // 'this' refers to the document being saved
  if (!this.isModified('password')) {
    // If the password hasn't changed, don't hash it again
    return next();
  }
  
  // Hash the password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});