const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');
const User = require('../../models/userModel');
const users = require('../../seeds/usersSeeds');

const request = supertest(app);

describe('Auth integration', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/auth-controller-tests');
    await User.create(users);
  });

  it('should create new user on signup', async () => {
    const response = await request.post('/api/auth/signup').send({
      username: 'test123-user',
      email: 'test123@gmail.com',
      password: 'supersecret123',
      passwordConfirmation: 'supersecret123',
    });

    expect(response.status).toBe(201);
    expect(response.body.user._id).toBeDefined();
    expect(response.body.user.username).toBe('test123-user');
  });

  it('should throw an error if username is missing', async () => {
    const response = await request.post('/api/auth/signup').send({
      email: 'missing-username@gmail.com',
      password: 'supersecret123',
      passwordConfirmation: 'supersecret123',
    });

    expect(response.error.status).toBe(500);
    expect(response.body.message).toMatch('Username is required');
  });

  it('should throw an error if email already exists', async () => {
    const response = await request.post('/api/auth/signup').send({
      username: 'hope123',
      email: 'hope@mail.com',
      password: 'supersecret123',
      passwordConfirmation: 'supersecret123',
    });

    expect(response.error.status).toBe(500);
    expect(response.body.message).toMatch('duplicate key error');
  });

  it('should throw an error if passwords do not match', async () => {
    const response = await request.post('/api/auth/signup').send({
      username: 'hope123',
      email: 'hope-123@mail.com',
      password: 'supersecret123',
      passwordConfirmation: 'supersecret124',
    });

    expect(response.error.status).toBe(500);
    expect(response.body.message).toMatch('Passwords are not the same!');
  });

  it('should login user successfully if given correct email and password', async () => {
    const response = await request.post('/api/auth/login').send({
      email: 'hope@mail.com',
      password: 'supersecret123',
    });
    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
  });

  it('should throw an error on login if password is missing', async () => {
    const response = await request.post('/api/auth/login').send({
      email: 'hope@mail.com',
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Please provide email and password!');
  });

  it('should throw an error on login if email is missing', async () => {
    const response = await request.post('/api/auth/login').send({
      password: 'supersecret123',
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Please provide email and password!');
  });

  it('should throw an error if email is not correct', async () => {
    const response = await request.post('/api/auth/login').send({
      email: 'incorrect@mail.com',
      password: 'supersecret123',
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Incorrect email or password');
  });

  it('should throw an error if password is not correct', async () => {
    const response = await request.post('/api/auth/login').send({
      email: 'hope@mail.com',
      password: 'incorrect123',
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Incorrect email or password');
  });

  it('endpoint /me should return authenticated user if there is one', async () => {
    const loginResponse = await request.post('/api/auth/login').send({
      email: 'hope@mail.com',
      password: 'supersecret123',
    });
    expect(loginResponse.status).toBe(200);
    const user = loginResponse.body.user;
    const token = loginResponse.body.token;

    const meResponse = await supertest(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);
    expect(meResponse.status).toBe(200);
    expect(meResponse.body.user._id).toBe(user._id);
  });

  afterAll(async () => {
    await User.deleteMany();
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });
});
