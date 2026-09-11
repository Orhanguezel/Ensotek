// Explicit seed IDs + reserved email domain; never deletes reviews or resets a database.
const { createRequire } = require('node:module');
const { mkdirSync, writeFileSync } = require('node:fs');
const { join } = require('node:path');
const requireBackend = createRequire(join(process.cwd(), 'package.json'));
requireBackend('dotenv').config({ path: '.env', quiet: true });
const mysql = requireBackend('mysql2/promise');
const ids = ['0001', '0003', '0005', '0011', '0012', '0013', '0014', '0015', '0016'].map(n => `4444${n}-4444-4444-8444-44444444${n}`);
(async () => {
  if (process.env.DB_NAME !== 'ensotek') throw new Error('Expected the verified shared ensotek database');
  const db = await mysql.createConnection({ host: process.env.DB_HOST, port: Number(process.env.DB_PORT || 3306), user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_NAME });
  try {
    await db.beginTransaction();
    const placeholders = ids.map(() => '?').join(',');
    const [rows] = await db.query(`SELECT id, is_active, is_approved, updated_at FROM reviews WHERE id IN (${placeholders}) AND email LIKE '%@example.com' AND target_type = 'custom_page' FOR UPDATE`, ids);
    if (rows.length !== 9) throw new Error(`Seed identity guard failed: expected 9, got ${rows.length}`);
    const apply = process.argv.includes('--apply');
    if (apply) {
      const backupDir = join(process.cwd(), '.checklist-backups'); mkdirSync(backupDir, { recursive: true, mode: 0o700 });
      writeFileSync(join(backupDir, `demo-review-flags-${Date.now()}.json`), JSON.stringify(rows, null, 2), { mode: 0o600, flag: 'wx' });
      await db.query(`UPDATE reviews SET is_active = 0, is_approved = 0 WHERE id IN (${placeholders}) AND email LIKE '%@example.com' AND target_type = 'custom_page'`, ids);
      await db.commit();
    } else await db.rollback();
    const [remaining] = await db.query(`SELECT COUNT(*) AS count FROM reviews WHERE id IN (${placeholders}) AND (is_active = 1 OR is_approved = 1)`, ids);
    console.log(JSON.stringify({ apply, matchedSeedRows: rows.length, remainingActiveOrApproved: remaining[0].count, ids }));
  } catch (error) { await db.rollback(); throw error; }
  finally { await db.end(); }
})().catch(error => { console.error(error.message); process.exitCode = 1; });
