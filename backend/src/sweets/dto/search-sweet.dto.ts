// backend/src/sweets/dto/search-sweet.dto.ts

import { IsString, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchSweetDto {
  @IsString()
  @IsOptional() // Makes this field optional
  name?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number) // Automatically transform the query string "10" to the number 10
  minPrice?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  maxPrice?: number;
}