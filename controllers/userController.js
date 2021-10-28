const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find({});

  if (!users.length) {
    return next(new AppError('Users not found', 404));
  }

  res.status(200).json({
    status: '200',
    users,
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  res.status(200).json({
    status: '200',
    user,
  });
});

exports.createUser = catchAsync(async (req, res, next) => {
  try {
    const newUser = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      passwordConfirmation: req.body.passwordConfirmation,
      role: req.body.role,
    });

    res.status(201).json({
      status: '201',
      user: newUser,
    });
  } catch (e) {
    console.log(e);
    return next(new AppError('There was an error creating user', 500));
  }
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  res.status(204).json({
    status: '204',
    message: 'User deleted successfully',
  });
});
