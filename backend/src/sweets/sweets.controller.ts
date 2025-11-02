// backend/src/sweets/sweets.controller.ts

import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards, // <-- 1. Import
} from '@nestjs/common';
import { SweetsService } from './sweets.service';
import { AuthGuard } from '@nestjs/passport'; // <-- 2. Import

@Controller('api/sweets')
@UseGuards(AuthGuard()) // <-- 3. Add this guard
export class SweetsController {
  constructor(private readonly sweetsService: SweetsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() body: any) {
    return this.sweetsService.create(body);
  }
}