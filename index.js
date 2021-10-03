const express = require('express');
const app = express();
const port = 3030;

app.get('/', (req, res) => {
  res.send('Hello Cinnamon');
});

app.listen(port, () => {
  console.log(`Cinammon app listening at http://localhost:${port}`);
});
