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

describe('Sweets API (e2e)', () => {
  let app: INestApplication;
  let userModel: Model<User>;
  let jwtToken: string; // We'll store the token here

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    userModel = moduleFixture.get<Model<User>>(getModelToken(User.name));
    await app.init();

    // 1. Clean the DB and register/login a user to get a token
    await userModel.deleteMany({});

    const testUser = { username: 'sweetstester', password: 'password123' };

    // Register user
    await request(app.getHttpServer())
      .post('/api/auth/register')
      .send(testUser);

    // Login to get the token
    const loginRes = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send(testUser);

    jwtToken = loginRes.body.access_token; // Save the token
  });

  afterAll(async () => {
    await app.close();
  });

  // --- Our New "Red" Test ---
  it('should create a new sweet (POST /api/sweets)', () => {
    const newSweet = {
      name: 'Jalebi',
      category: 'Traditional',
      price: 5.99,
      quantity: 100,
    };

    return request(app.getHttpServer())
      .post('/api/sweets') // The new endpoint
      .set('Authorization', `Bearer ${jwtToken}`) // 2. Send the token
      .send(newSweet)
      .expect(201) // 3. Expect "Created"
      .expect((res) => {
        expect(res.body).toHaveProperty('name', 'Jalebi');
        expect(res.body).toHaveProperty('quantity', 100);
      });
  });
  it('should block unauthenticated access (POST /api/sweets)', () => {
  const newSweet = {
    name: 'Barfi',
    category: 'Milk-based',
    price: 7.99,
    quantity: 50,
  };
  return request(app.getHttpServer())
    .post('/api/sweets')
    // Notice: No .set('Authorization', ...) header
    .send(newSweet)
    .expect(401); // Expect "Unauthorized"
});
// --- Our New "Red" Test for GET /api/sweets ---
it('should get a list of all sweets (GET /api/sweets)', () => {
  return request(app.getHttpServer())
    .get('/api/sweets') // The new endpoint
    .set('Authorization', `Bearer ${jwtToken}`) // It's protected
    .expect(200) // Expect "OK"
    .expect((res) => {
      // The response should be an array
      expect(Array.isArray(res.body)).toBe(true);
    });
});
});