import path from 'path';
import fs from 'fs';
import { app } from './app';
import { env } from './config/env';
import { db, pool } from './shared/database/connection';
import { sql } from 'drizzle-orm';

async function ensureSchema() {
  const result = await pool.query("SELECT to_regclass('public.users') AS users_table");
  if (result.rows[0]?.users_table) return;

  const candidates = [
    path.resolve(__dirname, 'shared/database/seed.sql'),
    path.resolve(__dirname, '../src/shared/database/seed.sql'),
    path.resolve(process.cwd(), 'backend/src/shared/database/seed.sql'),
    path.resolve(process.cwd(), 'src/shared/database/seed.sql'),
  ];
  const seedPath = candidates.find((candidate) => fs.existsSync(candidate));
  if (!seedPath) {
    throw new Error('Database schema is missing and seed.sql was not found');
  }

  console.log('⚙️  Users table not found — applying database schema...');
  await pool.query(fs.readFileSync(seedPath, 'utf-8'));
  console.log('✅ Database schema applied');
}

async function start() {
  if (!fs.existsSync(env.UPLOAD_DIR)) {
    fs.mkdirSync(env.UPLOAD_DIR, { recursive: true });
  }

  try {
    await db.execute(sql`SELECT 1`);
    console.log('✅ Database connected');
    await ensureSchema();
  } catch (err) {
    console.error('❌ Database initialization failed:', err);
    process.exit(1);
  }

  app.listen(parseInt(env.PORT), () => {
    console.log(`🚀 Server running on port ${env.PORT} [${env.NODE_ENV}]`);
  });
}

start();
