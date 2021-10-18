const express = require('express');
const cors = require('cors');

const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

//middlewares
app.use(express.json());

app.use(cors());
app.options('*', cors());

//routes
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
