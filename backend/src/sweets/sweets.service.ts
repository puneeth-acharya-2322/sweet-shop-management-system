// backend/src/sweets/sweets.service.ts

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose'; // <-- 1. Import
import { Model } from 'mongoose'; // <-- 2. Import
import { Sweet } from './schemas/sweet.schema'; // <-- 3. Import

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