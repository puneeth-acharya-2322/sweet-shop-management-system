// backend/src/auth/auth.service.ts

import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class AuthService {
  // 1. Inject the User model
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async register(body: any) {
    // 2. We will use a DTO (Data Transfer Object) here later
    //    to validate the body, but for now, we'll use 'any'.

    try {
      // 3. Create a new user instance (password will be hashed by the schema hook)
      const newUser = new this.userModel({
        username: body.username,
        password: body.password,
      });

      // 4. Save the new user to the database
      await newUser.save();

      return { message: 'User registered successfully' };
    } catch (error) {
      // 5. Handle the "duplicate username" error
      if (error.code === 11000) {
        throw new ConflictException('Username already exists');
      }
      throw error;
    }
  }
}