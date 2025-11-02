// backend/test/app.e2e-spec.ts

const request = require('supertest'); // Use 'require' as we did before
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../src/auth/schemas/user.schema';
import { Model } from 'mongoose';

describe('Authentication API (e2e)', () => {
  let app: INestApplication;
  let userModel: Model<User>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    userModel = moduleFixture.get<Model<User>>(getModelToken(User.name));
    await app.init();
  });

  // This cleans the DB before each test
  beforeEach(async () => {
    await userModel.deleteMany({});
  });

  afterAll(async () => {
    await app.close();
  });

  // --- TEST 1 ---
  it('should register a new user (POST /api/auth/register)', () => {
    return request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        password: 'password123',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('message', 'User registered successfully');
      });
  });

  // --- TEST 2 ---
  it('should log in an existing user and return a token (POST /api/auth/login)', () => {
    const loginUser = {
      username: 'logintestuser',
      password: 'password123',
    };

    // 1. First, register the user
    return request(app.getHttpServer())
      .post('/api/auth/register')
      .send(loginUser)
      .expect(201) // Ensure registration is successful
      .then(() => {
        // 2. Then, try to log in
        return request(app.getHttpServer())
          .post('/api/auth/login')
          .send(loginUser)
          .expect(201) 
          .expect((res) => {
            expect(res.body).toHaveProperty('access_token');
          });
      });
  });
});