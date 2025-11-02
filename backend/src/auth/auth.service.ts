// backend/src/auth/auth.service.ts

import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {

  register(body: any) {
    // In the future, we'll add database logic here.
    // For now, we just move the response from the controller
    // to here.
    console.log('Registering user with body:', body);
    return { message: 'User registered successfully' };
  }
}