const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: './config.env' });
const DB = process.env.DATABASE;
const PORT = process.env.PORT;

mongoose.connect(DB).then(() => console.log('DB connection successful!'));

app.listen(PORT || 8000, () => {
  console.log(`Cinammon app listening at http://localhost:${PORT}`);
});
