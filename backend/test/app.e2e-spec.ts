// backend/test/app.e2e-spec.ts

const request = require('supertest'); // Use 'require' as we did before
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { User, UserRole } from '../src/auth/schemas/user.schema'; // <-- IMPORT UserRole
import { Model } from 'mongoose';
import { Sweet } from '../src/sweets/schemas/sweet.schema';

// --- BLOCK 1: AUTHENTICATION TESTS ---
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

  // Cleans the 'users' collection before each auth test
  beforeEach(async () => {
    await userModel.deleteMany({});
  });

  afterAll(async () => {
    await app.close();
  });

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

  it('should log in an existing user and return a token (POST /api/auth/login)', () => {
    const loginUser = {
      username: 'logintestuser',
      password: 'password123',
    };
    return request(app.getHttpServer())
      .post('/api/auth/register')
      .send(loginUser)
      .expect(201)
      .then(() => {
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

// --- BLOCK 2: SWEETS TESTS ---
describe('Sweets API (e2e)', () => {
  let app: INestApplication;
  let userModel: Model<User>;
  let sweetModel: Model<Sweet>;
  let userToken: string; // Token for regular user
  let adminToken: string; // Token for admin user

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    userModel = moduleFixture.get<Model<User>>(getModelToken(User.name));
    sweetModel = moduleFixture.get<Model<Sweet>>(getModelToken(Sweet.name));
    await app.init();

    // 1. Clean DBs
    await userModel.deleteMany({});
    await sweetModel.deleteMany({});

    // 2. Create and login a REGULAR USER
    const regularUser = { username: 'sweetstester', password: 'password123' };
    await request(app.getHttpServer())
      .post('/api/auth/register')
      .send(regularUser);

    const userLoginRes = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send(regularUser);
    userToken = userLoginRes.body.access_token; // Save user token

    // 3. Create and login an ADMIN USER
    const adminUser = new userModel({
      username: 'adminuser',
      password: 'password123',
      role: UserRole.ADMIN, // Set the role
    });
    await adminUser.save(); // Hashes password

    const adminLoginRes = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ username: 'adminuser', password: 'password123' });
    adminToken = adminLoginRes.body.access_token; // Save admin token
  });

  // Cleans the 'sweets' collection before each test
  beforeEach(async () => {
    await sweetModel.deleteMany({});
  });

  afterAll(async () => {
    await app.close();
  });

  // --- EXISTING SWEETS TESTS (now using userToken) ---

  it('should create a new sweet (POST /api/sweets)', () => {
    const newSweet = {
      name: 'Jalebi',
      category: 'Traditional',
      price: 5.99,
      quantity: 100,
    };
    return request(app.getHttpServer())
      .post('/api/sweets')
      .set('Authorization', `Bearer ${userToken}`) // <-- Use userToken
      .send(newSweet)
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('name', 'Jalebi');
      });
  });

  it('should block unauthenticated access (POST /api/sweets)', () => {
    const newSweet = { name: 'Barfi', category: 'Milk', price: 7, quantity: 50 };
    return request(app.getHttpServer())
      .post('/api/sweets')
      .send(newSweet)
      .expect(401);
  });

  it('should get a list of all sweets (GET /api/sweets)', () => {
    return request(app.getHttpServer())
      .get('/api/sweets')
      .set('Authorization', `Bearer ${userToken}`) // <-- Use userToken
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
      });
  });

  it('should search for sweets by name (GET /api/sweets/search)', async () => {
    const newSweet = {
      name: 'Gulab Jamun',
      category: 'Syrup',
      price: 8.99,
      quantity: 50,
    };
    await request(app.getHttpServer())
      .post('/api/sweets')
      .set('Authorization', `Bearer ${userToken}`) // <-- Use userToken
      .send(newSweet);

    return request(app.getHttpServer())
      .get('/api/sweets/search?name=Gulab')
      .set('Authorization', `Bearer ${userToken}`) // <-- Use userToken
      .expect(200)
      .expect((res) => {
        expect(res.body.length).toBe(1);
        expect(res.body[0]).toHaveProperty('name', 'Gulab Jamun');
      });
  });

  it('should update a sweet (PUT /api/sweets/:id)', async () => {
    const newSweet = {
      name: 'Kaju Katli',
      category: 'Cashew',
      price: 10.99,
      quantity: 30,
    };
    const createRes = await request(app.getHttpServer())
      .post('/api/sweets')
      .set('Authorization', `Bearer ${userToken}`) // <-- Use userToken
      .send(newSweet);
    const sweetId = createRes.body._id;
    const updateData = { price: 12.99, quantity: 25 };

    return request(app.getHttpServer())
      .put(`/api/sweets/${sweetId}`)
      .set('Authorization', `Bearer ${userToken}`) // <-- Use userToken
      .send(updateData)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('price', 12.99);
      });
  });

  // --- NEW "RED" TESTS FOR DELETE ---

  it('should BLOCK a non-admin from deleting a sweet (DELETE /api/sweets/:id)', async () => {
    const createRes = await request(app.getHttpServer())
      .post('/api/sweets')
      .set('Authorization', `Bearer ${adminToken}`) // Admin creates
      .send({ name: 'Temp Sweet', category: 'Temp', price: 1, quantity: 1 });
    const sweetId = createRes.body._id;

    return request(app.getHttpServer())
      .delete(`/api/sweets/${sweetId}`)
      .set('Authorization', `Bearer ${userToken}`) // <-- Regular user tries to delete
      .expect(403); // This will fail 404
  });

  it('should allow an ADMIN to delete a sweet (DELETE /api/sweets/:id)', async () => {
    const createRes = await request(app.getHttpServer())
      .post('/api/sweets')
      .set('Authorization', `Bearer ${adminToken}`) // Admin creates
      .send({ name: 'Temp Sweet 2', category: 'Temp', price: 1, quantity: 1 });
    const sweetId = createRes.body._id;

    return request(app.getHttpServer())
      .delete(`/api/sweets/${sweetId}`)
      .set('Authorization', `Bearer ${adminToken}`) // <-- Admin tries to delete
      .expect(200); // This will fail 404
  });

  it('should purchase a sweet and decrease its quantity (POST /api/sweets/:id/purchase)', async () => {
    // 1. Create a sweet to purchase
    const createRes = await request(app.getHttpServer())
      .post('/api/sweets')
      .set('Authorization', `Bearer ${adminToken}`) // Admin stocks the sweet
      .send({ name: 'Ladoo', category: 'Classic', price: 3, quantity: 10 });

    const sweetId = createRes.body._id;

    // 2. Purchase the sweet as a regular user
    return request(app.getHttpServer())
      .post(`/api/sweets/${sweetId}/purchase`) // The new endpoint
      .set('Authorization', `Bearer ${userToken}`) // Regular user purchases
      .expect(200) // Expect "OK"
      .expect((res) => {
        expect(res.body).toHaveProperty('name', 'Ladoo');
        expect(res.body).toHaveProperty('quantity', 9); // Quantity should decrease by 1
      });
  });

  // --- Our New "Red" Tests for POST /api/sweets/:id/restock ---

it('should BLOCK a non-admin from restocking a sweet (POST /api/sweets/:id/restock)', async () => {
  // 1. Create a sweet
  const createRes = await request(app.getHttpServer())
    .post('/api/sweets')
    .set('Authorization', `Bearer ${adminToken}`) // Admin creates
    .send({ name: 'Rasmalai', category: 'Milk', price: 9, quantity: 0 });
  const sweetId = createRes.body._id;

  // 2. Try to restock as a REGULAR USER
  return request(app.getHttpServer())
    .post(`/api/sweets/${sweetId}/restock`)
    .set('Authorization', `Bearer ${userToken}`) // <-- Use user token
    .send({ quantity: 50 })
    .expect(403); // Expect "Forbidden"
});

it('should allow an ADMIN to restock a sweet (POST /api/sweets/:id/restock)', async () => {
  // 1. Create a sweet
  const createRes = await request(app.getHttpServer())
    .post('/api/sweets')
    .set('Authorization', `Bearer ${adminToken}`) // Admin creates
    .send({ name: 'Soan Papdi', category: 'Flaky', price: 6, quantity: 10 });
  const sweetId = createRes.body._id;

  // 2. Try to restock as an ADMIN
  return request(app.getHttpServer())
    .post(`/api/sweets/${sweetId}/restock`)
    .set('Authorization', `Bearer ${adminToken}`) // <-- Use admin token
    .send({ quantity: 50 }) // Send the new quantity
    .expect(200) // This will fail 404
    .expect((res) => {
      expect(res.body).toHaveProperty('name', 'Soan Papdi');
      expect(res.body).toHaveProperty('quantity', 60); // 10 + 50
    });
});

});