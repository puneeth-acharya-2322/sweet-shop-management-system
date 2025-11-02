// backend/src/auth/auth.service.ts

import {
  Injectable,
  ConflictException,
  UnauthorizedException, 
} from '@nestjs/common';
import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { JwtService } from '@nestjs/jwt'; // <-- 2. Import
import * as bcrypt from 'bcrypt'; // <-- 3. Import

@Injectable()
export class AuthService {
  // 1. Inject the User model
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService, // <-- 5. Inject JwtService
  ) {}

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
  async login(body: any) {
    // 1. Find the user by username
    const user = await this.userModel.findOne({ username: body.username });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 2. Compare passwords
    const isMatch = await bcrypt.compare(body.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 3. Generate and return JWT
    const payload = { sub: user._id, username: user.username };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}