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

let tablesInitialized = false;

export async function initDbTables() {
  if (tablesInitialized) return;
  try {
    const db = getPool();

    await db.query(`
      CREATE TABLE IF NOT EXISTS site_settings (
        key VARCHAR(255) PRIMARY KEY,
        value TEXT NOT NULL DEFAULT '',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS hidden_sections (
        section_key VARCHAR(100) PRIMARY KEY,
        is_hidden BOOLEAN NOT NULL DEFAULT false,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(100) PRIMARY KEY,
        dose VARCHAR(20) NOT NULL,
        tag VARCHAR(100) NOT NULL DEFAULT '',
        description TEXT NOT NULL DEFAULT '',
        price VARCHAR(50) NOT NULL,
        bullets TEXT[] NOT NULL DEFAULT '{}',
        featured BOOLEAN NOT NULL DEFAULT false,
        cta_text VARCHAR(100) DEFAULT 'Order via Consultation',
        cta_url VARCHAR(255) DEFAULT '#consult',
        sort_order INTEGER NOT NULL DEFAULT 0,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS compounded_products (
        id VARCHAR(100) PRIMARY KEY,
        total VARCHAR(20) NOT NULL,
        price VARCHAR(50) NOT NULL,
        breakdown VARCHAR(100) NOT NULL DEFAULT '',
        description TEXT NOT NULL DEFAULT '',
        bullets TEXT[] NOT NULL DEFAULT '{}',
        cta_text VARCHAR(100) DEFAULT 'Order via Consultation',
        cta_url VARCHAR(255) DEFAULT '#consult',
        sort_order INTEGER NOT NULL DEFAULT 0,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS faqs (
        id VARCHAR(100) PRIMARY KEY,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        sort_order INTEGER NOT NULL DEFAULT 0,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS testimonials (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        city VARCHAR(100) NOT NULL,
        quote TEXT NOT NULL,
        sort_order INTEGER NOT NULL DEFAULT 0,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS stats (
        id VARCHAR(100) PRIMARY KEY,
        value VARCHAR(50) NOT NULL,
        label VARCHAR(100) NOT NULL,
        sort_order INTEGER NOT NULL DEFAULT 0,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS features (
        id VARCHAR(100) PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        description TEXT NOT NULL DEFAULT '',
        sort_order INTEGER NOT NULL DEFAULT 0,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    tablesInitialized = true;
  } catch (err) {
    console.error("[DB] Table initialization error:", err);
  }
}

// ── Helper: parse settings rows into nested config sections ─────────────────
function settingsRowsToConfig(
  rows: Array<{ key: string; value: string }>
): Partial<SiteConfig> {
  const result: Record<string, Record<string, unknown>> = {};

  for (const { key, value } of rows) {
    const dotIdx = key.indexOf(".");
    if (dotIdx === -1) continue;
    const section = key.substring(0, dotIdx);
    const field = key.substring(dotIdx + 1);

    if (!result[section]) result[section] = {};

    // Convert comma-separated lists back to arrays for known array fields
    if (
      (section === "hero" && field === "pills") ||
      (section === "painPoints" && field === "items")
    ) {
      result[section][field] = value ? value.split(",") : [];
    } else {
      result[section][field] = value;
    }
  }

  return result as unknown as Partial<SiteConfig>;
}

// ── Helper: flatten config sections into key-value pairs ────────────────────
function configToSettingsRows(
  config: SiteConfig
): Array<[string, string]> {
  const rows: Array<[string, string]> = [];
  const sections = [
    "seo", "tracking", "contact", "topBar", "hero", "painPoints",
    "treatment", "gallery", "results", "whatsappReviews", "whyUs",
    "bmiSection", "faqSection", "consultSection", "footer",
  ] as const;

  for (const section of sections) {
    const sectionData = config[section];
    if (!sectionData || typeof sectionData !== "object") continue;

    for (const [field, value] of Object.entries(sectionData)) {
      // Skip nested objects/arrays that have their own tables
      if (
        (section === "results" && (field === "stats" || field === "testimonials")) ||
        (section === "whyUs" && field === "features")
      ) {
        continue;
      }

      if (Array.isArray(value)) {
        rows.push([`${section}.${field}`, value.join(",")]);
      } else {
        rows.push([`${section}.${field}`, String(value ?? "")]);
      }
    }
  }

  return rows;
}

// ══════════════════════════════════════════════════════════════════════════════
// FETCH — assemble SiteConfig from all 8 tables
// ══════════════════════════════════════════════════════════════════════════════
export async function fetchDbConfigServer(): Promise<SiteConfig> {
  try {
    await initDbTables();
    const db = getPool();

    // Run all queries in parallel
    const [
      settingsRes,
      hiddenRes,
      productsRes,
      compoundedRes,
      faqsRes,
      testimonialsRes,
      statsRes,
      featuresRes,
    ] = await Promise.all([
      db.query("SELECT key, value FROM site_settings"),
      db.query("SELECT section_key, is_hidden FROM hidden_sections"),
      db.query("SELECT * FROM products ORDER BY sort_order ASC"),
      db.query("SELECT * FROM compounded_products ORDER BY sort_order ASC"),
      db.query("SELECT * FROM faqs ORDER BY sort_order ASC"),
      db.query("SELECT * FROM testimonials ORDER BY sort_order ASC"),
      db.query("SELECT * FROM stats ORDER BY sort_order ASC"),
      db.query("SELECT * FROM features ORDER BY sort_order ASC"),
    ]);

    // If no settings exist yet, return default
    if (settingsRes.rows.length === 0) {
      return defaultConfig;
    }

    // Build config from settings key-value pairs
    const settingsPartial = settingsRowsToConfig(settingsRes.rows);

    // Build hiddenSections
    const hiddenSections: Record<string, boolean> = {};
    for (const row of hiddenRes.rows) {
      hiddenSections[row.section_key] = row.is_hidden;
    }

    // Build products array
    const products = productsRes.rows.map((r) => ({
      id: r.id,
      dose: r.dose,
      tag: r.tag,
      desc: r.description,
      price: r.price,
      bullets: r.bullets || [],
      featured: r.featured || false,
      ctaText: r.cta_text || "Order via Consultation",
      ctaUrl: r.cta_url || "#consult",
    }));

    // Build compounded products array
    const compoundedProducts = compoundedRes.rows.map((r) => ({
      id: r.id,
      total: r.total,
      price: r.price,
      breakdown: r.breakdown,
      desc: r.description,
      bullets: r.bullets || [],
      ctaText: r.cta_text || "Order via Consultation",
      ctaUrl: r.cta_url || "#consult",
    }));

    // Build FAQs array
    const faq = faqsRes.rows.map((r) => ({
      id: r.id,
      q: r.question,
      a: r.answer,
    }));

    // Build testimonials array
    const testimonials = testimonialsRes.rows.map((r) => ({
      id: r.id,
      name: r.name,
      city: r.city,
      quote: r.quote,
    }));

    // Build stats array
    const statsArr = statsRes.rows.map((r) => ({
      id: r.id,
      value: r.value,
      label: r.label,
    }));

    // Build features array
    const featuresArr = featuresRes.rows.map((r) => ({
      id: r.id,
      title: r.title,
      description: r.description,
    }));

    // Merge everything with defaults
    const config: SiteConfig = {
      ...defaultConfig,
      ...(settingsPartial as Partial<SiteConfig>),
      hiddenSections: { ...defaultConfig.hiddenSections, ...hiddenSections },
      seo: { ...defaultConfig.seo, ...(settingsPartial as any).seo },
      tracking: { ...defaultConfig.tracking, ...(settingsPartial as any).tracking },
      contact: { ...defaultConfig.contact, ...(settingsPartial as any).contact },
      topBar: { ...defaultConfig.topBar, ...(settingsPartial as any).topBar },
      hero: { ...defaultConfig.hero, ...(settingsPartial as any).hero },
      painPoints: { ...defaultConfig.painPoints, ...(settingsPartial as any).painPoints },
      treatment: { ...defaultConfig.treatment, ...(settingsPartial as any).treatment },
      gallery: { ...defaultConfig.gallery, ...(settingsPartial as any).gallery },
      results: {
        ...defaultConfig.results,
        ...(settingsPartial as any).results,
        stats: statsArr.length > 0 ? statsArr : defaultConfig.results.stats,
        testimonials: testimonials.length > 0 ? testimonials : defaultConfig.results.testimonials,
      },
      whatsappReviews: { ...defaultConfig.whatsappReviews, ...(settingsPartial as any).whatsappReviews },
      whyUs: {
        ...defaultConfig.whyUs,
        ...(settingsPartial as any).whyUs,
        features: featuresArr.length > 0 ? featuresArr : defaultConfig.whyUs.features,
      },
      bmiSection: { ...defaultConfig.bmiSection, ...(settingsPartial as any).bmiSection },
      faqSection: { ...defaultConfig.faqSection, ...(settingsPartial as any).faqSection },
      consultSection: { ...defaultConfig.consultSection, ...(settingsPartial as any).consultSection },
      footer: { ...defaultConfig.footer, ...(settingsPartial as any).footer },
      products: products.length > 0 ? products : defaultConfig.products,
      compoundedProducts: compoundedProducts.length > 0 ? compoundedProducts : defaultConfig.compoundedProducts,
      faq: faq.length > 0 ? faq : defaultConfig.faq,
    };

    return config;
  } catch (err) {
    console.error("[DB] Error fetching config:", err);
  }
  return defaultConfig;
}

// ══════════════════════════════════════════════════════════════════════════════
// SAVE — write SiteConfig across all 8 tables
// ══════════════════════════════════════════════════════════════════════════════
export async function saveDbConfigServer(config: SiteConfig): Promise<boolean> {
  try {
    await initDbTables();
    const db = getPool();
    const client = await db.connect();

    try {
      await client.query("BEGIN");

      // ── 1. Site settings (upsert key-value pairs) ───────────────────────
      const settingsRows = configToSettingsRows(config);
      for (const [key, value] of settingsRows) {
        await client.query(
          `INSERT INTO site_settings (key, value, updated_at) VALUES ($1, $2, NOW())
           ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`,
          [key, value]
        );
      }

      // ── 2. Hidden sections ──────────────────────────────────────────────
      if (config.hiddenSections) {
        for (const [sectionKey, isHidden] of Object.entries(config.hiddenSections)) {
          await client.query(
            `INSERT INTO hidden_sections (section_key, is_hidden, updated_at) VALUES ($1, $2, NOW())
             ON CONFLICT (section_key) DO UPDATE SET is_hidden = EXCLUDED.is_hidden, updated_at = NOW()`,
            [sectionKey, isHidden ?? false]
          );
        }
      }

      // ── 3. Products ─────────────────────────────────────────────────────
      if (config.products) {
        // Delete old products not in the new list
        const productIds = config.products.map((p) => p.id);
        if (productIds.length > 0) {
          await client.query(
            "DELETE FROM products WHERE id != ALL($1::text[])",
            [productIds]
          );
        } else {
          await client.query("DELETE FROM products");
        }

        for (let i = 0; i < config.products.length; i++) {
          const p = config.products[i];
          await client.query(
            `INSERT INTO products (id, dose, tag, description, price, bullets, featured, cta_text, cta_url, sort_order, updated_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
             ON CONFLICT (id) DO UPDATE SET dose=EXCLUDED.dose, tag=EXCLUDED.tag, description=EXCLUDED.description,
               price=EXCLUDED.price, bullets=EXCLUDED.bullets, featured=EXCLUDED.featured,
               cta_text=EXCLUDED.cta_text, cta_url=EXCLUDED.cta_url, sort_order=EXCLUDED.sort_order, updated_at=NOW()`,
            [p.id, p.dose, p.tag, p.desc, p.price, p.bullets, p.featured || false, p.ctaText || "Order via Consultation", p.ctaUrl || "#consult", i + 1]
          );
        }
      }

      // ── 4. Compounded Products ──────────────────────────────────────────
      if (config.compoundedProducts) {
        const cpIds = config.compoundedProducts.map((p) => p.id);
        if (cpIds.length > 0) {
          await client.query(
            "DELETE FROM compounded_products WHERE id != ALL($1::text[])",
            [cpIds]
          );
        } else {
          await client.query("DELETE FROM compounded_products");
        }

        for (let i = 0; i < config.compoundedProducts.length; i++) {
          const p = config.compoundedProducts[i];
          await client.query(
            `INSERT INTO compounded_products (id, total, price, breakdown, description, bullets, cta_text, cta_url, sort_order, updated_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
             ON CONFLICT (id) DO UPDATE SET total=EXCLUDED.total, price=EXCLUDED.price, breakdown=EXCLUDED.breakdown,
               description=EXCLUDED.description, bullets=EXCLUDED.bullets,
               cta_text=EXCLUDED.cta_text, cta_url=EXCLUDED.cta_url, sort_order=EXCLUDED.sort_order, updated_at=NOW()`,
            [p.id, p.total, p.price, p.breakdown, p.desc, p.bullets, p.ctaText || "Order via Consultation", p.ctaUrl || "#consult", i + 1]
          );
        }
      }

      // ── 5. FAQs ────────────────────────────────────────────────────────
      if (config.faq) {
        const faqIds = config.faq.map((f) => f.id);
        if (faqIds.length > 0) {
          await client.query(
            "DELETE FROM faqs WHERE id != ALL($1::text[])",
            [faqIds]
          );
        } else {
          await client.query("DELETE FROM faqs");
        }

        for (let i = 0; i < config.faq.length; i++) {
          const f = config.faq[i];
          await client.query(
            `INSERT INTO faqs (id, question, answer, sort_order, updated_at)
             VALUES ($1, $2, $3, $4, NOW())
             ON CONFLICT (id) DO UPDATE SET question=EXCLUDED.question, answer=EXCLUDED.answer, sort_order=EXCLUDED.sort_order, updated_at=NOW()`,
            [f.id, f.q, f.a, i + 1]
          );
        }
      }

      // ── 6. Testimonials ─────────────────────────────────────────────────
      if (config.results?.testimonials) {
        const tIds = config.results.testimonials.map((t) => t.id);
        if (tIds.length > 0) {
          await client.query(
            "DELETE FROM testimonials WHERE id != ALL($1::text[])",
            [tIds]
          );
        } else {
          await client.query("DELETE FROM testimonials");
        }

        for (let i = 0; i < config.results.testimonials.length; i++) {
          const t = config.results.testimonials[i];
          await client.query(
            `INSERT INTO testimonials (id, name, city, quote, sort_order, updated_at)
             VALUES ($1, $2, $3, $4, $5, NOW())
             ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name, city=EXCLUDED.city, quote=EXCLUDED.quote, sort_order=EXCLUDED.sort_order, updated_at=NOW()`,
            [t.id, t.name, t.city, t.quote, i + 1]
          );
        }
      }

      // ── 7. Stats ────────────────────────────────────────────────────────
      if (config.results?.stats) {
        const sIds = config.results.stats.map((s) => s.id);
        if (sIds.length > 0) {
          await client.query(
            "DELETE FROM stats WHERE id != ALL($1::text[])",
            [sIds]
          );
        } else {
          await client.query("DELETE FROM stats");
        }

        for (let i = 0; i < config.results.stats.length; i++) {
          const s = config.results.stats[i];
          await client.query(
            `INSERT INTO stats (id, value, label, sort_order, updated_at)
             VALUES ($1, $2, $3, $4, NOW())
             ON CONFLICT (id) DO UPDATE SET value=EXCLUDED.value, label=EXCLUDED.label, sort_order=EXCLUDED.sort_order, updated_at=NOW()`,
            [s.id, s.value, s.label, i + 1]
          );
        }
      }

      // ── 8. Features ─────────────────────────────────────────────────────
      if (config.whyUs?.features) {
        const fIds = config.whyUs.features.map((f) => f.id);
        if (fIds.length > 0) {
          await client.query(
            "DELETE FROM features WHERE id != ALL($1::text[])",
            [fIds]
          );
        } else {
          await client.query("DELETE FROM features");
        }

        for (let i = 0; i < config.whyUs.features.length; i++) {
          const f = config.whyUs.features[i];
          await client.query(
            `INSERT INTO features (id, title, description, sort_order, updated_at)
             VALUES ($1, $2, $3, $4, NOW())
             ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, description=EXCLUDED.description, sort_order=EXCLUDED.sort_order, updated_at=NOW()`,
            [f.id, f.title, f.description, i + 1]
          );
        }
      }

      await client.query("COMMIT");
      return true;
    } catch (txErr) {
      await client.query("ROLLBACK");
      throw txErr;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("[DB] Error saving config:", err);
    return false;
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// VERIFY ADMIN CREDENTIALS — check username/password from site_settings
// ══════════════════════════════════════════════════════════════════════════════
export async function verifyAdminCredentials(
  username: string,
  password: string
): Promise<boolean> {
  try {
    await initDbTables();
    const db = getPool();

    const result = await db.query(
      "SELECT key, value FROM site_settings WHERE key IN ('admin.username', 'admin.password')"
    );

    let dbUsername = "admin";
    let dbPassword = "$Admin4lyf";

    for (const row of result.rows) {
      if (row.key === "admin.username") dbUsername = row.value;
      if (row.key === "admin.password") dbPassword = row.value;
    }

    return username.trim() === dbUsername && password === dbPassword;
  } catch (err) {
    console.error("[DB] Error verifying admin credentials:", err);
    return false;
  }
}
