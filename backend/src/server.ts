import { app } from './app';
import { env } from './config/env';
import { db } from './shared/database/connection';
import { sql } from 'drizzle-orm';
import fs from 'fs';

async function start() {
  if (!fs.existsSync(env.UPLOAD_DIR)) {
    fs.mkdirSync(env.UPLOAD_DIR, { recursive: true });
  }

  try {
    await db.execute(sql`SELECT 1`);
    console.log('✅ Database connected');
  } catch (err) {
    console.error('❌ Database connection failed:', err);
    process.exit(1);
  }

  app.listen(parseInt(env.PORT), () => {
    console.log(`🚀 Server running on port ${env.PORT} [${env.NODE_ENV}]`);
  });
}

start();
