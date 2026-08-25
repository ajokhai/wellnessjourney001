import pg from "pg";
import type { SiteConfig } from "./site-config";
import { defaultConfig } from "./site-config";

const { Pool } = pg;

let pool: pg.Pool | null = null;

function getPool(): pg.Pool {
  if (!pool) {
    const connectionString =
      process.env.POSTGRES_URL ||
      process.env.DATABASE_URL ||
      process.env.POSTGRES_PRISMA_URL ||
      "postgresql://neondb_owner:npg_RH67jgMDFNXz@ep-aged-moon-augpgn8x-pooler.c-10.us-east-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require";

    pool = new Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: false,
      },
    });
  }
  return pool;
}

let tableInitialized = false;

export async function initDbTable() {
  if (tableInitialized) return;
  try {
    const db = getPool();
    await db.query(`
      CREATE TABLE IF NOT EXISTS site_config_store (
        id VARCHAR(255) PRIMARY KEY,
        config JSONB NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    const check = await db.query("SELECT id FROM site_config_store WHERE id = 'main' LIMIT 1");
    if (check.rows.length === 0) {
      await db.query(
        "INSERT INTO site_config_store (id, config, updated_at) VALUES ('main', $1, NOW())",
        [defaultConfig]
      );
      console.log("[Vercel Postgres] Seeded initial defaultConfig row into database.");
    }

    tableInitialized = true;
  } catch (err) {
    console.error("[Vercel Postgres] Table initialization error:", err);
  }
}

export async function fetchDbConfigServer(): Promise<SiteConfig> {
  try {
    await initDbTable();
    const db = getPool();
    const result = await db.query(
      "SELECT config FROM site_config_store WHERE id = 'main' LIMIT 1"
    );
    if (result.rows.length > 0 && result.rows[0].config) {
      return {
        ...defaultConfig,
        ...(result.rows[0].config as Partial<SiteConfig>),
      };
    }
  } catch (err) {
    console.error("[Vercel Postgres] Error fetching config:", err);
  }
  return defaultConfig;
}

export async function saveDbConfigServer(config: SiteConfig): Promise<boolean> {
  try {
    await initDbTable();
    const db = getPool();
    await db.query(
      `INSERT INTO site_config_store (id, config, updated_at)
       VALUES ('main', $1, NOW())
       ON CONFLICT (id)
       DO UPDATE SET config = EXCLUDED.config, updated_at = NOW()`,
      [config]
    );
    return true;
  } catch (err) {
    console.error("[Vercel Postgres] Error saving config:", err);
    return false;
  }
}
