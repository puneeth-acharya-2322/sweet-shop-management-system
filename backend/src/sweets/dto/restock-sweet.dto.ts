// backend/src/sweets/dto/restock-sweet.dto.ts

import { IsNumber, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class RestockSweetDto {
  @IsNumber()
  @IsPositive() // Ensures the quantity is a positive number
  @Type(() => Number)
  quantity: number;
}