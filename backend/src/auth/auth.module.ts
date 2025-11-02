// backend/src/auth/auth.module.ts

import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose'; // <-- 1. Import
import { User, UserSchema } from './schemas/user.schema'; // <-- 2. Import

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), // <-- 3. Add this line
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}