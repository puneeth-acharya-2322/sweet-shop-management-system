// backend/src/auth/auth.controller.ts

import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service'; // Make sure this is imported

@Controller('api/auth')
export class AuthController {
  // This line "injects" the service so the controller can use it
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() body: any) {
    // The controller's job is just to call the service.
    // This is much cleaner!
    return this.authService.register(body);
  }
}