import express from 'express';

const app = express();
const port = 3000;

app.use(express.json());

app.listen(port, async () => {
  console.log(`Server is runnig on port ${port}`)
})