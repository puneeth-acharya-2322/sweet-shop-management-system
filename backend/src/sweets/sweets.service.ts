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
}