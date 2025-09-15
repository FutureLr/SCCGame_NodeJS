const fs = require('fs');

let env = {};
const env_path = './configs/.env';

try {
  const raw = fs.readFileSync(env_path, 'utf-8');  // đọc xong trả về string
  const lines = raw.split('\n');

  lines.forEach(line => {
    line = line.trim();
    if (!line || line.startsWith('#')) return; // bỏ dòng trống và comment
    const [key, value] = line.split('=', 2);
    env[key.trim()] = value.trim();
  });
} catch (err) {
  console.error("Error loading .env:", err.message);
  process.exit(1);
}

module.exports = env;