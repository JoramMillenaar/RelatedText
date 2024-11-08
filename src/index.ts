import express from 'express';

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello, TypeScript with ESM!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
