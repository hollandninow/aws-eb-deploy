const express = require('express');
const fs = require('fs');

const app = express();

const port = process.env.PORT || 8081;

app.get('/', (req, res) => {
  const html = fs.readFileSync('index.html');
  res.writeHead(200);
  res.write(html);

  res.end();
});

app.listen(port, () =>
  console.log(`Server running at http://127.0.0.1:${port}`)
);
