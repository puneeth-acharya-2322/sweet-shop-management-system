// backend/test/app.e2e-spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module'; // Correct path
import { INestApplication } from '@nestjs/common';
const request = require('supertest');

describe('Authentication API (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // This is our "Red" test for a feature that doesn't exist yet
  it('should register a new user (POST /api/auth/register)', () => {
    return request(app.getHttpServer())
      .post('/api/auth/register') // The endpoint we want 
      .send({
        username: 'testuser',
        password: 'password123',
      })
      .expect(201) // Expect "Created" status
      .expect((res) => {
        // We'll make our future endpoint return this message
        expect(res.body).toHaveProperty('message', 'User registered successfully');
      });
  });
});