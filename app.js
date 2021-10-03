const express = require('express');
const app = express();
const port = 3030;

app.listen(port, () => {
  console.log(`Cinammon app listening at http://localhost:${port}`);
});

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello Cinnamon' });
});
