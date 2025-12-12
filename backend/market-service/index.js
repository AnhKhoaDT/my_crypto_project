require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 4001;

const coins = ['BTC', 'ETH', 'SOL', 'BNB'];

app.get('/api/market/coins', (req, res) => {
  res.json({ coins });
});

app.get('/api/market/price', (req, res) => {
  const symbol = (req.query.symbol || 'BTC').toUpperCase();
  if (!coins.includes(symbol)) return res.status(404).json({ error: 'Unknown symbol' });
  // Trả giá random cho dev/test
  const price = (Math.random() * (60000 - 1000) + 1000).toFixed(2);
  res.json({ symbol, price });
});

app.listen(PORT, () => console.log(`Market service running on port ${PORT}`));
