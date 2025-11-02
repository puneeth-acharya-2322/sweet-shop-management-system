// backend/src/auth/auth.controller.ts

import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service'; // Make sure this is imported

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() body: any) {
    return this.authService.register(body);
  }

  
  @Post('login')
  @HttpCode(HttpStatus.CREATED) // We'll use 201 for consistency for now
  login(@Body() body: any) {
    // Call a 'login' service function that we will create next
    return this.authService.login(body);
  }
}