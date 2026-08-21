import type { FastifyInstance } from 'fastify';
import { sql } from 'drizzle-orm';

/**
 * DB canlılık yoklaması — `app.db` iki farklı türde olabilir.
 *
 * Bu paket birden çok kurulumda kullanılıyor ve hepsi `db`'yi aynı şekilde
 * tanıtmıyor:
 *   • drizzle örneği          → `execute(sql`...`)`
 *   • `@fastify/mysql` havuzu → `query('...')` (mysql2 promise pool)
 *
 * 22.08.2026'da ensotek.com.tr'nin `/api/health` ucu bu yüzden 500
 * (`health_check_failed`) veriyordu: o kurulum `app.decorate('db', app.mysql)`
 * ile mysql2 havuzu tanıtıyor, buradaki kod ise drizzle'ın `sql` şablonunu
 * mysql2'ye gönderiyordu. Site ve veritabanı sağlıklıydı; yalnız bu uç patlıyordu
 * ve ERP web panelinde site "erişilemiyor" görünüyordu.
 *
 * Bu yüzden yoklama, tanıtılan sürücünün türüne göre davranır. Hangi yol
 * çalışırsa çalışsın sonuç aynı: `SELECT 1` bir satır döndürebiliyor mu?
 */
async function dbCanliMi(db: unknown): Promise<boolean> {
  const surucu = db as {
    query?: (sql: string) => Promise<unknown>;
    execute?: (sql: unknown) => Promise<unknown>;
  } | null;
  if (!surucu) return false;

  // mysql2 / @fastify/mysql: query('SELECT 1 AS ok') → [rows, fields]
  if (typeof surucu.query === 'function') {
    try {
      const sonuc = (await surucu.query('SELECT 1 AS ok')) as unknown;
      const satirlar = Array.isArray(sonuc) ? sonuc[0] : sonuc;
      const ilk = Array.isArray(satirlar)
        ? satirlar[0]
        : (satirlar as { rows?: Array<{ ok?: number }> } | null)?.rows?.[0];
      if ((ilk as { ok?: number } | undefined)?.ok === 1) return true;
    } catch {
      /* bu sürücü mysql2 değilmiş — aşağıdaki drizzle yolu denenir */
    }
  }

  // drizzle: execute(sql`SELECT 1 AS ok`) → rows | { rows }
  if (typeof surucu.execute === 'function') {
    const sonuc = (await surucu.execute(sql`SELECT 1 AS ok`)) as unknown;
    const ilk = Array.isArray(sonuc)
      ? (sonuc[0] as { ok?: number } | undefined)
      : (sonuc as { rows?: Array<{ ok?: number }> } | null)?.rows?.[0];
    return ilk?.ok === 1;
  }

  return false;
}

export async function repoCheckHealth(app: FastifyInstance) {
  const dbOk = await dbCanliMi(app.db);
  const redisReply = app.redis ? await app.redis.ping().catch(() => 'FAIL') : 'SKIP';
  const redisOk = redisReply === 'PONG';

  return {
    status: dbOk && (app.redis ? redisOk : true) ? 'ok' : 'error',
    db: dbOk ? 'ok' : 'error',
    redis: app.redis ? (redisOk ? 'ok' : 'error') : 'disabled',
    uptime: process.uptime(),
  };
}
