const mongoose = require('mongoose');
const User = require('../../models/userModel');
const validateUser = require('../../helpers/validators/userValidators');

describe('User Model Test', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/user-tests');
  });

  it('creates and saves user successfully if given valid data', async () => {
    const validUser = {
      username: 'test-user',
      email: 'test@mail.com',
      password: 'supersecret123',
      passwordConfirmation: 'supersecret123',
    };

    expect(validateUser(validUser)).toBe(true);

    const savedUser = await User.create(validUser);
    expect(savedUser._id).toBeDefined();
    expect(savedUser.username).toBe(validUser.username);
    expect(savedUser.email).toBe(validUser.email);
  });

  it('throws error if username is missing', async () => {
    const invalidUser = {
      username: '',
      email: 'invalid@mail.com',
      password: 'supersecret123',
      passwordConfirmation: 'supersecret123',
    };

    expect(validateUser(invalidUser)).toBe(false);
    await expect(User.create(invalidUser)).rejects.toThrow('Username is required');
  });

  it('throws error if email is missing', async () => {
    const invalidUser = {
      username: 'invalid-user',
      email: '',
      password: 'supersecret123',
      passwordConfirmation: 'supersecret123',
    };

    expect(validateUser(invalidUser)).toBe(false);
    await expect(User.create(invalidUser)).rejects.toThrow('Email is required');
  });

  it('throws error if given email is invalid', async () => {
    const invalidUser = {
      username: 'test-user',
      email: 'invalid-email',
      password: 'supersecret123',
      passwordConfirmation: 'supersecret123',
    };

    expect(validateUser(invalidUser)).toBe(false);
    await expect(User.create(invalidUser)).rejects.toThrow('Please provide a valid email');
  });

  it('throws error if password is missing', async () => {
    const invalidUser = {
      username: 'test-user',
      email: 'test@mail.com',
      password: '',
      passwordConfirmation: 'supersecret123',
    };
    expect(validateUser(invalidUser)).toBe(false);
    await expect(User.create(invalidUser)).rejects.toThrow('Please provide a password');
  });

  it('throws error if password is shorter than 8 characters', async () => {
    const invalidUser = {
      username: 'test-user',
      email: 'test@mail.com',
      password: 'pass',
      passwordConfirmation: 'pass',
    };
    expect(validateUser(invalidUser)).toBe(false);
    await expect(User.create(invalidUser)).rejects.toThrow(
      'User validation failed: password: Path `password` (`pass`) is shorter than the minimum allowed length (8).',
    );
  });

  it('throws error if password confirmation is not the same as given password', async () => {
    const invalidUser = {
      username: 'test-user',
      email: 'invtest@mail.com',
      password: 'pass1234',
      passwordConfirmation: 'pass1235',
    };

    expect(validateUser(invalidUser)).toBe(false);
    await expect(User.create(invalidUser)).rejects.toThrow('Passwords are not the same!');
  });

  it('assigns user role to newly created user if role is not specified', async () => {
    const validUser = {
      username: 'test-user',
      email: 'test-user@mail.com',
      password: 'supersecret123',
      passwordConfirmation: 'supersecret123',
    };

    const savedUser = await User.create(validUser);
    expect(savedUser.role).toBe('user');
  });

  it('assigns admin role to newly created user if specified', async () => {
    const validAdmin = {
      username: 'test-admin',
      email: 'test-admin@mail.com',
      password: 'supersecret123',
      passwordConfirmation: 'supersecret123',
      role: 'admin',
    };

    const savedAdmin = await User.create(validAdmin);
    expect(savedAdmin.role).toBe('admin');
  });

  afterAll(async () => {
    await User.deleteMany();
    // Closing the DB connection allows Jest to exit successfully.
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });
});
