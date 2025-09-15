// Require Blockk
const express = require('express');
const app = express();
require('./api/register');
const pool = require('./api/pool');

// Define
const handler = {
  // Language API
  getLangList: require('./api/language/getLangList'),
};

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Route
app.post('/api', async (request, res, next) => {
  const { action, ...data } = request.body;
  if (typeof handler[action] !== 'function') {
    return res.status(400).send('Invalid Action.');
  }

  try {
    const result = await handler[action](data);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.log('[ERROR]:');
  next(err);
  if (res.headersSent) {
    return;
  }
  res.status(500).send('Internal Server Error.');
});

// Listen
const PORT = 3000;
const server = app.listen(PORT, () => {
  let address = server.address();
  console.log(`Server started on http://${address.address === '::' ? 'localhost' : address.address}:${address.port}`);
});

// Register handler
server.on('error', (err) => {
  console.error('Server error: ', err);
});

// Safe Shutdown
process.on("exit", (code) => {
  console.log(`Process exiting (code: ${code})`);
});

function shutdown(reason, code = 0) {
  console.log(reason);
  if (pool && pool.end) {
    pool.end(() => console.log("Database pool closed."));
  }
  server.close(() => {
    console.log("Server stopped.");
    process.exit(code);
  });

  setTimeout(() => {
    console.error("Force exit.");
    process.exit(1);
  }, 5000);
}

process.on("SIGINT", () => shutdown("Server stopped by user (Ctrl+C)."));
process.on("SIGTERM", () => shutdown("Server stopped by system (SIGTERM)."));
