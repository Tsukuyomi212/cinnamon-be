process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'secret-code-for-test';
process.env.JWT_EXPIRATION_TIME = '1d';

module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['jest-extended'],
  preset: '@shelf/jest-mongodb',
};
