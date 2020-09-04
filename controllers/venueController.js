const Venue = require('../models/venueModel');
const AppError = require('../utilities/appError');
const catchAsync = require('../utilities/catchAsync');

exports.getVenues = catchAsync(async (req, res, next) => {
  const venues = await Venue.find();

  res.status(200).json({
    status: 'success',
    results: venues.length,
    data: { venues },
  });
});

exports.getVenue = catchAsync(async (req, res, next) => {
  const venue = await Venue.findById(req.params.id);

  if (!venue) {
    return next(new AppError('There is no venue with that ID!', 404));
  }
  res.status(200).json({
    status: 'success',
    data: { venue },
  });
});

exports.createVenue = catchAsync(async (req, res, next) => {
  const newVenue = await Venue.create(req.body);

  res.status(201).json({
    status: 'success',
    data: { venue: newVenue },
  });
});

exports.updateVenue = catchAsync(async (req, res, next) => {
  const venue = await Venue.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  if (!venue) {
    return next(new AppError('Venue not found!', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { venue },
  });
});

exports.deleteVenue = catchAsync(async (req, res, next) => {
  const venue = await Venue.findByIdAndDelete(req.params.id);

  if (!venue) {
    return next(new AppError('Venue not found!', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
