const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Venue = require('../../models/venueModel');

dotenv.config({ path: './config.env' });

mongoose
  .connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to mongoDB!'));

const venues = JSON.parse(fs.readFileSync(`${__dirname}/venues.json`, 'utf-8'));

const importData = async () => {
  try {
    await Venue.create(venues);
    console.log('DB seeded!');
  } catch (error) {
    console.log('importData -> error', error);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Venue.deleteMany();
    console.log('DB deleted!');
  } catch (error) {
    console.log('deleteData -> error', error);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
