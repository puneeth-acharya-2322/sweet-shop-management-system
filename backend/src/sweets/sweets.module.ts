// backend/src/sweets/sweets.module.ts

import { Module } from '@nestjs/common';
import { SweetsService } from './sweets.service';
import { SweetsController } from './sweets.controller';
import { MongooseModule } from '@nestjs/mongoose'; // <-- 1. Import
import { Sweet, SweetSchema } from './schemas/sweet.schema'; // <-- 2. Import
import { AuthModule } from '../auth/auth.module'; // <-- This is the fix

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Sweet.name, schema: SweetSchema }]), // <-- 3. Add
    AuthModule,
  ],
  controllers: [SweetsController],
  providers: [SweetsService],
})
export class SweetsModule {}