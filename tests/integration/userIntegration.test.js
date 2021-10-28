const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');
const User = require('../../models/userModel');
const users = require('../../seeds/usersSeeds');

const request = supertest(app);

describe('Users integration - crud', () => {
  let token;
  beforeAll(async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/user-controller-tests');
    await User.create(users);
    const loginResponse = await request.post('/api/auth/login').send({
      email: 'hope@mail.com',
      password: 'supersecret123',
    });
    token = loginResponse.body.token;
  });

  it('should be able to fetch users from database', async () => {
    const response = await request.get('/api/users').set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.users.length).toBeGreaterThan(0);
  });

  it('should be able to fetch single user from database given user id', async () => {
    const newUser = await User.create({
      username: 'test-user',
      email: 'test@mail.com',
      password: 'supersecret123',
      passwordConfirmation: 'supersecret123',
    });

    const response = await request
      .get(`/api/users/${newUser._id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.user.username).toMatch(newUser.username);
  });

  it('should throw a 404 on fetch single user if said user does not exist in the DB', async () => {
    const response = await request
      .get('/api/users/1nonexistent')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('User not found');
  });

  it('should create new user when given valid data', async () => {
    const validUser = {
      username: 'sandy',
      email: 'sandy@mail.com',
      password: 'supersecret123',
      passwordConfirmation: 'supersecret123',
    };

    const response = await request
      .post('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .send(validUser);
    expect(response.status).toBe(201);
  });

  it('should be able to delete single user from database given user id', async () => {
    const newUser = await User.create({
      username: 'test-user-2',
      email: 'test-user-2@mail.com',
      password: 'supersecret123',
      passwordConfirmation: 'supersecret123',
    });
    expect(newUser._id).toBeDefined();

    const response = await request
      .delete(`/api/users/${newUser._id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(204);
  });

  it('should throw a 404 on delete single user if said user does not exist in the DB', async () => {
    const response = await request
      .delete('/api/users/1nonexistent')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('User not found');
  });

  afterAll(async () => {
    await User.deleteMany();
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });
});
