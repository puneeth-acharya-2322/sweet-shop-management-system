// backend/src/app.module.ts

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config'; // <-- Import ConfigService
import { MongooseModule } from '@nestjs/mongoose'; // <-- Import MongooseModule
import { SweetsModule } from './sweets/sweets.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({ // <-- Add this configuration
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DATABASE_URL'),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    SweetsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}