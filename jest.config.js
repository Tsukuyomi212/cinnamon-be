process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'secret-code-for-test';
process.env.JWT_EXPIRATION_TIME = '1d';

module.exports = {
  preset: '@shelf/jest-mongodb',
};
