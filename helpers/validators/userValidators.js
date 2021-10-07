const validator = require('validator');

const validateUsername = username => typeof username === 'string' && username.length > 0;

const validateEmail = email =>
  typeof email === 'string' && email.length > 0 && validator.isEmail(email);

const validatePassword = password => typeof password === 'string' && password.length >= 8;

const validatePasswordConfirmation = (password, passwordConfirmation) =>
  passwordConfirmation === password;

const validateUser = user =>
  validateUsername(user.username) &&
  validateEmail(user.email) &&
  validatePassword(user.password) &&
  validatePasswordConfirmation(user.password, user.passwordConfirmation);

module.exports = validateUser;
