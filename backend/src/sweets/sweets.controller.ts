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
  Delete,
} from '@nestjs/common';
import { SweetsService } from './sweets.service';
import { AuthGuard } from '@nestjs/passport'; // <-- 2. Import
import { SearchSweetDto } from './dto/search-sweet.dto';
import { UpdateSweetDto } from './dto/update-sweet.dto';
import { Roles } from '../auth/decorators/roles.decorator'; // <-- 2. Import Roles
import { UserRole } from '../auth/schemas/user.schema'; // <-- 3. Import UserRole
import { RolesGuard } from '../auth/guards/roles.guard';
import { RestockSweetDto } from './dto/restock-sweet.dto';

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

  @Delete(':id')
  @UseGuards(RolesGuard) // <-- 5. Apply the RolesGuard
  @Roles(UserRole.ADMIN) // <-- 6. Set required role to ADMIN
  @HttpCode(HttpStatus.OK) // Set response code to 200
  remove(@Param('id') id: string) {
    return this.sweetsService.remove(id);
  }

  @Post(':id/purchase')
  @HttpCode(HttpStatus.OK) // Set response code to 200
  purchase(@Param('id') id: string) {
    // This endpoint is protected by the class-level AuthGuard
    // but does not require Admin role
    return this.sweetsService.purchase(id);
  }

  @Post(':id/restock')
  @UseGuards(RolesGuard) // <-- Apply the RolesGuard
  @Roles(UserRole.ADMIN) // <-- Set required role to ADMIN
  @HttpCode(HttpStatus.OK) // Set response code to 200
  restock(
    @Param('id') id: string,
    @Body() restockSweetDto: RestockSweetDto,
  ) {
    return this.sweetsService.restock(id, restockSweetDto);
  }

}