const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');
const User = require('../../models/userModel');
const users = require('../../seeds/usersSeeds');

const request = supertest(app);

describe('Users controller', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/user-controller-tests');
    await User.create(users);
  });

  it('should be able to fetch users from database', async () => {
    const response = await request.get('/api/users');
    expect(response.status).toBe(200);
    expect(response.body.data.users.length).toBeGreaterThan(0);
  });

  it('should be able to fetch single user from database given user id', async () => {
    const newUser = await User.create({
      username: 'test-user',
      email: 'test@mail.com',
      password: 'supersecret123',
      passwordConfirmation: 'supersecret123',
    });

    const response = await request.get(`/api/users/${newUser._id}`);
    expect(response.status).toBe(200);
    expect(response.body.data.user.username).toMatch(newUser.username);
  });

  it('should throw a 404 on fetch single user if said user does not exist in the DB', async () => {
    const response = await request.get('/api/users/1nonexistent');
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('User not found');
  });

  it('should be able to delete single user from database given user id', async () => {
    const newUser = await User.create({
      username: 'test-user-2',
      email: 'test-user-2@mail.com',
      password: 'supersecret123',
      passwordConfirmation: 'supersecret123',
    });
    expect(newUser._id).toBeDefined();

    const response = await request.delete(`/api/users/${newUser._id}`);
    expect(response.status).toBe(204);
  });

  it('should throw a 404 on delete single user if said user does not exist in the DB', async () => {
    const response = await request.delete('/api/users/1nonexistent');
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('User not found');
  });

  it('should throw a 404 on fetch all users if there are no users in the DB', async () => {
    await User.deleteMany();
    const response = await request.get('/api/users');
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Users not found');
  });

  afterAll(async () => {
    await User.deleteMany();
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });
});
