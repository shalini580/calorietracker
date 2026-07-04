const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const foodsRouter = require('./routes/foods');

app.get('/api/ping', (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

app.use('/api/foods', foodsRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
