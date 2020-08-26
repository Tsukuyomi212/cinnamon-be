const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

mongoose
  .connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to mongoDB!'));

const app = require('./app');

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Cinnamon App running on port ${port}...`);
});
