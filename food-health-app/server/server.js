// server.js — Entry point
require('dotenv').config();
const app = require('./src/app');
const config = require('./src/config');

const PORT = config.port || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} [${config.nodeEnv}]`);
});
