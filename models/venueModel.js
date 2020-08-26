const mongoose = require('mongoose');
const slugify = require('slugify');

const venueSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  address: {
    type: String,
  },
  city: { type: String },
  country: { type: String },
  telephone: { type: String },
  tags: { type: [String] },
  summary: { type: String },
  description: { type: String },
  ratingsAvg: { type: Number },
  ratingsNum: { type: Number },
  // reviews: { type: [ReviewSchema]},
  priceRange: mongoose.Schema.Types.Mixed,
  images: [String],
  createdAt: { type: Date, default: Date.now() },
  slug: { type: String },
});

venueSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

const Venue = mongoose.model('Venue', venueSchema);

module.exports = Venue;
