// backend/src/sweets/sweets.service.ts

import { InjectModel } from '@nestjs/mongoose'; // <-- 1. Import
import { Model } from 'mongoose'; // <-- 2. Import
import { Sweet } from './schemas/sweet.schema'; // <-- 3. Import
import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateSweetDto } from './dto/update-sweet.dto';

@Injectable()
export class SweetsService {
  // 4. Inject the model
  constructor(@InjectModel(Sweet.name) private sweetModel: Model<Sweet>) {}

  // 5. Add the create method
  async create(sweetData: any): Promise<Sweet> {
    const newSweet = new this.sweetModel(sweetData);
    return newSweet.save();
  }

  async findAll(): Promise<Sweet[]> {
    return this.sweetModel.find().exec();
  }
  
  async update(id: string, updateSweetDto: UpdateSweetDto): Promise<Sweet> {
  const updatedSweet = await this.sweetModel.findByIdAndUpdate(
    id,
    updateSweetDto,
    { new: true }, // This option returns the modified document
  );

  if (!updatedSweet) {
    throw new NotFoundException(`Sweet with ID "${id}" not found`);
  }
  return updatedSweet;
}

async search(query: {
  name?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}): Promise<Sweet[]> {
  const filter: any = {};

  if (query.name) {
    // Use a case-insensitive regex to find partial matches
    filter.name = { $regex: query.name, $options: 'i' };
  }

  if (query.category) {
    filter.category = { $regex: query.category, $options: 'i' };
  }

  // Add price range logic
  if (query.minPrice || query.maxPrice) {
    filter.price = {};
    if (query.minPrice) {
      filter.price.$gte = query.minPrice;
    }
    if (query.maxPrice) {
      filter.price.$lte = query.maxPrice;
    }
  }

  return this.sweetModel.find(filter).exec();
}
}