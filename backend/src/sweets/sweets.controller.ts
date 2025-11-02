// backend/src/sweets/sweets.controller.ts

import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards, // <-- 1. Import
  Get,
  Query,
  Put,     
  Param,
} from '@nestjs/common';
import { SweetsService } from './sweets.service';
import { AuthGuard } from '@nestjs/passport'; // <-- 2. Import
import { SearchSweetDto } from './dto/search-sweet.dto';
import { UpdateSweetDto } from './dto/update-sweet.dto';

@Controller('api/sweets')
@UseGuards(AuthGuard()) // <-- 3. Add this guard
export class SweetsController {
  constructor(private readonly sweetsService: SweetsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() body: any) {
    return this.sweetsService.create(body);
  }
  
  @Get()
  findAll() {
    return this.sweetsService.findAll();
  }

  @Get('search')
  // 2. Change 'query: any' to use the DTO
  search(@Query() query: SearchSweetDto) { 
    // 'query' is now a fully validated and typed object
    return this.sweetsService.search(query);
  }
  
  @Put(':id')
  update(@Param('id') id: string, @Body() updateSweetDto: UpdateSweetDto) {
    return this.sweetsService.update(id, updateSweetDto);
  }
}