import fs from 'fs';
import pool from './db.js';
import dotenv from 'dotenv';

dotenv.config();

async function run() {
  const sql = fs.readFileSync(new URL('./migrations/001_create_products_table.sql', import.meta.url), 'utf8');
  await pool.query(sql);
  console.log('✅ products table created or already exists');
  process.exit(0);
}

run().catch(err=>{
  console.error(err);
  process.exit(1);
});
