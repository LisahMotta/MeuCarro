const { readFileSync } = require('fs');
const { join } = require('path');
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function main() {
  const sql = readFileSync(join(__dirname, 'seed.sql'), 'utf-8');
  const client = await pool.connect();
  try {
    await client.query(sql);
    console.log('Schema applied successfully.');
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((err) => { console.error(err); process.exit(1); });
