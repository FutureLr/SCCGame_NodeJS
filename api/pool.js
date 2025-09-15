const mysql = require('mysql2/promise');
const env = require('./env');

const pool = mysql.createPool({
  host: env.DB_HOST,
  user: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  database: env.DB_DATABASE,
  connectionLimit: env.POOL_CONNECTION_LIMIT,
  waitForConnections: env.WAIT_FOR_CONNECTIONS
});

module.exports = pool;