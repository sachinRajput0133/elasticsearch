const request = require('supertest');
const app = require('../src/app');
const userStore = require('../src/store/userStore');

// Reset in-memory store before each test to ensure isolation
beforeEach(() => {
  userStore.clear();
});

// ─────────────────────────────────────────────
// REGISTER
// ─────────────────────────────────────────────
describe('POST /api/auth/register', () => {
  it('should register a new user successfully', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Alice',
      email: 'alice@example.com',
      password: 'password123',
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('User registered successfully');
    expect(res.body.user).toHaveProperty('email', 'alice@example.com');
    expect(res.body.user).not.toHaveProperty('password'); // never expose hash
  });

  it('should return 400 when name is missing', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: 'alice@example.com',
      password: 'password123',
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/required/i);
  });

  it('should return 400 when email is missing', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Alice',
      password: 'password123',
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/required/i);
  });

  it('should return 400 when password is missing', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Alice',
      email: 'alice@example.com',
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/required/i);
  });

  it('should return 400 for invalid email format', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Alice',
      email: 'not-an-email',
      password: 'password123',
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/invalid email/i);
  });

  it('should return 400 when password is shorter than 6 characters', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Alice',
      email: 'alice@example.com',
      password: '123',
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/at least 6/i);
  });

  it('should return 409 when email is already registered', async () => {
    const payload = { name: 'Alice', email: 'alice@example.com', password: 'password123' };

    await request(app).post('/api/auth/register').send(payload);
    const res = await request(app).post('/api/auth/register').send(payload);

    expect(res.statusCode).toBe(409);
    expect(res.body.message).toMatch(/already registered/i);
  });
});

// ─────────────────────────────────────────────
// LOGIN
// ─────────────────────────────────────────────
describe('POST /api/auth/login', () => {
  beforeEach(async () => {
    // Pre-register a user before each login test
    await request(app).post('/api/auth/register').send({
      name: 'Bob',
      email: 'bob@example.com',
      password: 'secret123',
    });
  });

  it('should login successfully with correct credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'bob@example.com',
      password: 'secret123',
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Login successful');
    expect(res.body).toHaveProperty('token');
    expect(typeof res.body.token).toBe('string');
  });

  it('should return 400 when email is missing', async () => {
    const res = await request(app).post('/api/auth/login').send({ password: 'secret123' });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/required/i);
  });

  it('should return 400 when password is missing', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'bob@example.com' });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/required/i);
  });

  it('should return 401 for unregistered email', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'ghost@example.com',
      password: 'secret123',
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch(/invalid credentials/i);
  });

  it('should return 401 for wrong password', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'bob@example.com',
      password: 'wrongpassword',
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch(/invalid credentials/i);
  });
});

// ─────────────────────────────────────────────
// HEALTH CHECK
// ─────────────────────────────────────────────
describe('GET /health', () => {
  it('should return 200 with status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});
