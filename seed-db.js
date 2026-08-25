import pg from "pg";

const connectionString =
  "postgresql://neondb_owner:npg_RH67jgMDFNXz@ep-aged-moon-augpgn8x-pooler.c-10.us-east-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require";

// ── All site settings as key-value pairs ──────────────────────────────────────
const siteSettings = [
  // Admin credentials
  ["admin.username", "admin"],
  ["admin.password", "$Admin4lyf"],
  // SEO
  ["seo.title", "Wellness Journey — Nigeria's Trusted Weight Loss Partner"],
  ["seo.description", "GLP-1 weight loss treatments including Mounjaro®. Authentic medication, nationwide delivery, and ongoing support across Nigeria."],
  ["seo.keywords", "Mounjaro Nigeria, Tirzepatide Nigeria, weight loss Abuja, weight loss Lagos, GLP-1 Nigeria, body zenith, wellness journey"],
  ["seo.faviconUrl", ""],
  ["seo.ogTitle", "Wellness Journey — Weight Loss in Nigeria"],
  ["seo.ogDescription", "Lose weight. Repair your metabolic health. Reclaim your confidence. Mounjaro® treatment with nationwide delivery."],
  ["seo.ogImageUrl", ""],
  // Tracking
  ["tracking.googleTagManagerId", ""],
  ["tracking.facebookPixelId", ""],
  ["tracking.tiktokPixelId", ""],
  ["tracking.customHeadScripts", ""],
  ["tracking.customBodyScripts", ""],
  // Contact
  ["contact.phone", "07036809459"],
  ["contact.phoneIntl", "+2347036809459"],
  ["contact.whatsappUrl", "https://wa.me/2347036809459"],
  ["contact.instagramUrl", "https://www.instagram.com/wellnessjourneyltd/"],
  ["contact.mapsUrl", "https://maps.app.goo.gl/ufi3YCJ6nqcYQJfL9?g_st=iw"],
  ["contact.locationText", "Abuja, Nigeria"],
  // Top Bar
  ["topBar.badgeText", "✦ Trusted Care"],
  ["topBar.subText", "Nationwide Delivery · Authentic Medication"],
  ["topBar.whatsappText", "WhatsApp Us"],
  // Hero
  ["hero.badge", "Wellness Journey"],
  ["hero.headline", "Nigeria's trusted medical weight-loss partner."],
  ["hero.headlineItalic", "trusted"],
  ["hero.subheadline", "Lose weight. Repair your metabolic health. Reclaim your confidence. Official access to GLP-1 treatments including Mounjaro®, delivered with care across Nigeria."],
  ["hero.pills", "Trusted Care,Nationwide Delivery,Authentic Medication,Ongoing Support"],
  ["hero.primaryCtaText", "Start Your Journey"],
  ["hero.primaryCtaUrl", "#consult"],
  ["hero.secondaryCtaText", "See real results"],
  ["hero.secondaryCtaUrl", "#results"],
  ["hero.ratingText", "Trusted by 2,400+ Nigerian patients"],
  ["hero.ratingScore", "4.9 / 5"],
  ["hero.overlayQuote", '"I lost 18kg in 4 months."'],
  ["hero.overlaySubtext", "Mounjaro changed everything — cravings, energy, confidence."],
  ["hero.overlayAuthor", "— Sarah A., Lagos"],
  ["hero.statBadgeTitle", "18kg"],
  ["hero.statBadgeSubtitle", "in 4 months"],
  // Pain Points
  ["painPoints.eyebrow", "Are you dealing with —"],
  ["painPoints.headline", "A body that's been fighting you for too long?"],
  ["painPoints.description", "Mounjaro gives you a real chance to repair your metabolic health and finally lose the weight — with attentive care."],
  ["painPoints.outcomeTag", "Clinical Outcome"],
  ["painPoints.outcomeStat", "10–20%"],
  ["painPoints.outcomeDesc", "average body-weight reduction with medical guidance."],
  ["painPoints.items", "Excessive weight gain,Type 2 diabetes,Insulin resistance,Chronic fatigue,Hormonal imbalance,Irregular periods,PCOS,Constant cravings"],
  // Treatment
  ["treatment.mounjaroEyebrow", "Which Mounjaro do you need?"],
  ["treatment.mounjaroHeadline", "A dose tailored to where you are in your journey."],
  ["treatment.mounjaroDesc", "Every patient is assessed by our team before any prescription is issued. Your starting dose and titration plan are guided by your health profile."],
  ["treatment.compoundedEyebrow", "Compounded Option"],
  ["treatment.compoundedHeadline", "Compounded Tirzepatide"],
  ["treatment.compoundedDesc", "Pharmacy-compounded tirzepatide supplied in 4-week courses. Each vial includes four weekly doses as listed below."],
  ["treatment.disclaimerText", "Prescription medication. Sold only after medical assessment. Mounjaro® is a registered trademark of Eli Lilly and Company. Compounded tirzepatide is prepared by licensed pharmacies and is not Mounjaro®. Prices subject to change."],
  // Gallery
  ["gallery.eyebrow", "Authentic Stock · Photographed In-House"],
  ["gallery.headline", "Real Mounjaro®. Sealed. Verified."],
  ["gallery.description", "Every pen we dispense is sourced through verified pharmaceutical channels and stored under proper cold-chain conditions before delivery."],
  ["gallery.ctaText", "Check current stock"],
  ["gallery.videoTitle", "How your pens arrive"],
  ["gallery.videoDesc", "Sealed packaging, verified stock, and cold-chain handling from dispatch to your door."],
  ["gallery.videoTag", "Unboxing"],
  // Results
  ["results.eyebrow", "Real Results · Real Nigerians"],
  ["results.headline", "Transformations that feel as good as they look."],
  ["results.description", "Photographs shared with patient consent. Outcomes vary and depend on adherence, nutrition, and consistent follow-up."],
  // WhatsApp Reviews
  ["whatsappReviews.eyebrow", "Unfiltered · Straight from WhatsApp"],
  ["whatsappReviews.headline", "What our clients message us, in their own words."],
  ["whatsappReviews.description", "Real conversations from real Nigerian clients — shared with consent, names redacted for privacy."],
  ["whatsappReviews.ctaBannerHeadline", "Want to be our next success story?"],
  ["whatsappReviews.ctaBannerButtonText", "Message us on WhatsApp"],
  // Why Us
  ["whyUs.eyebrow", "Why Nigerians choose us"],
  ["whyUs.headline", "Premium care, not just a prescription."],
  ["whyUs.description", "We are not a pharmacy — we are a medically led weight-loss programme. From your first consultation to long-term maintenance, our team stays with you."],
  ["whyUs.ctaText", "Chat with our team on WhatsApp"],
  // BMI Section
  ["bmiSection.eyebrow", "BMI & Projection Tool"],
  ["bmiSection.headline", "See what your journey could look like."],
  ["bmiSection.description", "Calculate your current BMI and see a typical 4-month projection based on the average 15% weight reduction seen in our programme."],
  ["bmiSection.disclaimerText", "Estimates are illustrative and not a medical prediction."],
  ["bmiSection.ctaButtonText", "Book Free Assessment"],
  // FAQ Section
  ["faqSection.eyebrow", "Frequently asked"],
  ["faqSection.headline", "Answers from our team."],
  // Consult Section
  ["consultSection.eyebrow", "Ready to start?"],
  ["consultSection.headline", "Book your consultation today."],
  ["consultSection.description", "Speak with our team confidentially. We'll assess your goals, your health, and the right starting dose — usually within 24 hours."],
  ["consultSection.whatsappButtonText", "WhatsApp Now"],
  ["consultSection.callButtonText", "Call"],
  // Footer
  ["footer.aboutText", "Helping Nigerians achieve sustainable weight loss and better metabolic health through trusted GLP-1 treatment."],
  ["footer.copyrightText", "Wellness Journey Nigeria. All rights reserved."],
  ["footer.trademarkText", "Mounjaro® is a registered trademark of Eli Lilly. Prescription only."],
];

// ── Hidden sections ───────────────────────────────────────────────────────────
const hiddenSections = [
  ["topBar", false],
  ["hero", false],
  ["painPoints", false],
  ["mounjaroTreatment", false],
  ["compoundedTreatment", false],
  ["gallery", false],
  ["results", false],
  ["whatsappReviews", false],
  ["whyUs", false],
  ["bmiSection", false],
  ["faqSection", false],
  ["consultSection", false],
];

// ── Products ──────────────────────────────────────────────────────────────────
const products = [
  { id: "mounjaro-2-5mg", dose: "2.5mg", tag: "Starter Dose", desc: "Perfect for beginners easing into treatment.", price: "₦500,000", bullets: ["Helps control appetite", "Reduces cravings", "Supports gradual weight loss"], featured: false, ctaText: "Order via Consultation", ctaUrl: "#consult", sortOrder: 1 },
  { id: "mounjaro-5mg", dose: "5mg", tag: "Most Popular", desc: "Our most requested dose for steady, visible results.", price: "₦650,000", bullets: ["Enhanced appetite suppression", "Improved blood sugar control", "Stronger weight-loss support"], featured: true, ctaText: "Order via Consultation", ctaUrl: "#consult", sortOrder: 2 },
  { id: "mounjaro-7-5mg", dose: "7.5mg", tag: "Continued Progress", desc: "Step up when your body is ready for more.", price: "₦750,000", bullets: ["Supports ongoing fat loss", "Helps maintain consistency", "Increased effectiveness"], featured: false, ctaText: "Order via Consultation", ctaUrl: "#consult", sortOrder: 3 },
  { id: "mounjaro-10mg", dose: "10mg", tag: "Advanced Support", desc: "Maximum support for committed transformation.", price: "₦820,000", bullets: ["Strong appetite control", "Continued metabolic improvement", "Sustained weight management"], featured: false, ctaText: "Order via Consultation", ctaUrl: "#consult", sortOrder: 4 },
  { id: "mounjaro-12-5mg", dose: "12.5mg", tag: "Peak Progress", desc: "For patients titrating toward their target dose.", price: "₦1,000,000", bullets: ["Deep appetite regulation", "Accelerated fat-loss support", "Ideal for long-term maintenance prep"], featured: false, ctaText: "Order via Consultation", ctaUrl: "#consult", sortOrder: 5 },
  { id: "mounjaro-15mg", dose: "15mg", tag: "Maximum Strength", desc: "The highest available dose for eligible patients.", price: "₦1,080,000", bullets: ["Maximum GLP-1 support", "Best for sustained results", "Requires clinical clearance"], featured: false, ctaText: "Order via Consultation", ctaUrl: "#consult", sortOrder: 6 },
];

// ── Compounded Products ───────────────────────────────────────────────────────
const compoundedProducts = [
  { id: "compounded-10mg", total: "10mg", price: "₦300,000", breakdown: "4 doses of 2.5mg", desc: "An affordable entry point for compounded tirzepatide treatment.", bullets: ["Weekly dosing over 4 weeks", "Ideal for starting titration", "Pharmacy-compounded quality"], ctaText: "Order via Consultation", ctaUrl: "#consult", sortOrder: 1 },
  { id: "compounded-20mg", total: "20mg", price: "₦350,000", breakdown: "4 doses of 5mg", desc: "Step up your compounded programme with a stronger weekly dose.", bullets: ["Enhanced appetite control", "Steady weekly progression", "Cost-effective option"], ctaText: "Order via Consultation", ctaUrl: "#consult", sortOrder: 2 },
  { id: "compounded-30mg", total: "30mg", price: "₦360,000", breakdown: "4 doses of 7.5mg", desc: "Mid-tier compounded support for ongoing weight-loss progress.", bullets: ["Stronger metabolic support", "4-week supply included", "Suitable for titration phase"], ctaText: "Order via Consultation", ctaUrl: "#consult", sortOrder: 3 },
  { id: "compounded-40mg", total: "40mg", price: "₦400,000", breakdown: "4 doses of 10mg", desc: "Advanced compounded dosing for patients ready for more.", bullets: ["High-strength weekly doses", "Sustained appetite suppression", "Full 4-week course"], ctaText: "Order via Consultation", ctaUrl: "#consult", sortOrder: 4 },
  { id: "compounded-50mg", total: "50mg", price: "₦430,000", breakdown: "4 doses of 12.5mg", desc: "Near-maximum compounded strength for eligible patients.", bullets: ["Peak-tier weekly dosing", "Supports long-term results", "Requires clinical clearance"], ctaText: "Order via Consultation", ctaUrl: "#consult", sortOrder: 5 },
  { id: "compounded-60mg", total: "60mg", price: "₦470,000", breakdown: "4 doses of 15mg", desc: "The highest compounded tirzepatide option we offer.", bullets: ["Maximum weekly dose strength", "Best for maintenance phase", "Dispensed after assessment"], ctaText: "Order via Consultation", ctaUrl: "#consult", sortOrder: 6 },
];

// ── FAQs ──────────────────────────────────────────────────────────────────────
const faqs = [
  { id: "faq-1", q: "Is Mounjaro approved for use in Nigeria?", a: "Mounjaro® (tirzepatide) is a prescription medication used worldwide under medical supervision. We dispense only through licensed medical assessment and verified supply channels.", sortOrder: 1 },
  { id: "faq-2", q: "How much weight can I realistically lose?", a: "Clinical data shows most patients lose 10–20% of their body weight when treatment is combined with nutrition and lifestyle support. Your doctor will set realistic targets for you.", sortOrder: 2 },
  { id: "faq-3", q: "Do I need a consultation before ordering?", a: "Yes. Every patient undergoes a confidential medical assessment so we can confirm Mounjaro is safe and appropriate for you, and plan your starting dose.", sortOrder: 3 },
  { id: "faq-4", q: "How is the medication delivered?", a: "Cold-chain courier delivery nationwide, in discreet packaging. Lagos and Abuja typically receive same-day or next-day delivery.", sortOrder: 4 },
  { id: "faq-5", q: "What payment methods do you accept?", a: "Bank transfer, debit/credit card, and selected instalment options. Payment details are shared after your consultation.", sortOrder: 5 },
];

// ── Testimonials ──────────────────────────────────────────────────────────────
const testimonials = [
  { id: "testim-1", name: "Chidinma", city: "Abuja", quote: "I lost 14kg in 3 months. My energy improved and my clothes fit again.", sortOrder: 1 },
  { id: "testim-2", name: "Tunde", city: "Lagos", quote: "I struggled with cravings for years. Within weeks my appetite was finally under control.", sortOrder: 2 },
  { id: "testim-3", name: "Kemi", city: "Port Harcourt", quote: "My blood sugar improved and I lost 11kg. The best decision I've made for my health.", sortOrder: 3 },
];

// ── Stats ─────────────────────────────────────────────────────────────────────
const stats = [
  { id: "stat-1", value: "2,400+", label: "Patients served", sortOrder: 1 },
  { id: "stat-2", value: "14kg", label: "Avg. 4-month loss", sortOrder: 2 },
  { id: "stat-3", value: "94%", label: "Would recommend", sortOrder: 3 },
];

// ── Features (Why Us) ─────────────────────────────────────────────────────────
const features = [
  { id: "why-1", title: "Authentic Medication", description: "Sourced through verified pharmaceutical channels.", sortOrder: 1 },
  { id: "why-2", title: "Doctor-Led Consultations", description: "Every patient is medically assessed before treatment.", sortOrder: 2 },
  { id: "why-3", title: "Ongoing Follow-Up", description: "Dose titration, side-effect support, and progress tracking.", sortOrder: 3 },
  { id: "why-4", title: "Nutrition Guidance", description: "Realistic, Nigerian-food-friendly meal frameworks.", sortOrder: 4 },
  { id: "why-5", title: "Exercise Programmes", description: "Sustainable movement tailored to your body.", sortOrder: 5 },
  { id: "why-6", title: "WhatsApp Support", description: "Direct line to your care team, 7 days a week.", sortOrder: 6 },
  { id: "why-7", title: "Nationwide Delivery", description: "Discreet cold-chain delivery to every state.", sortOrder: 7 },
  { id: "why-8", title: "Flexible Payments", description: "Bank transfer, card, and instalment options.", sortOrder: 8 },
];

// ══════════════════════════════════════════════════════════════════════════════
// SEED SCRIPT
// ══════════════════════════════════════════════════════════════════════════════
async function runSeed() {
  const pool = new pg.Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  try {
    const client = await pool.connect();
    console.log("Connected to Neon Postgres!\n");

    // ── Drop old table ────────────────────────────────────────────────────
    await client.query("DROP TABLE IF EXISTS site_config_store CASCADE;");
    console.log("✓ Dropped old site_config_store table");

    // ── Create new tables ─────────────────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS site_settings (
        key VARCHAR(255) PRIMARY KEY,
        value TEXT NOT NULL DEFAULT '',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✓ Created table: site_settings");

    await client.query(`
      CREATE TABLE IF NOT EXISTS hidden_sections (
        section_key VARCHAR(100) PRIMARY KEY,
        is_hidden BOOLEAN NOT NULL DEFAULT false,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✓ Created table: hidden_sections");

    await client.query(`
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
    console.log("✓ Created table: products");

    await client.query(`
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
    console.log("✓ Created table: compounded_products");

    await client.query(`
      CREATE TABLE IF NOT EXISTS faqs (
        id VARCHAR(100) PRIMARY KEY,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        sort_order INTEGER NOT NULL DEFAULT 0,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✓ Created table: faqs");

    await client.query(`
      CREATE TABLE IF NOT EXISTS testimonials (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        city VARCHAR(100) NOT NULL,
        quote TEXT NOT NULL,
        sort_order INTEGER NOT NULL DEFAULT 0,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✓ Created table: testimonials");

    await client.query(`
      CREATE TABLE IF NOT EXISTS stats (
        id VARCHAR(100) PRIMARY KEY,
        value VARCHAR(50) NOT NULL,
        label VARCHAR(100) NOT NULL,
        sort_order INTEGER NOT NULL DEFAULT 0,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✓ Created table: stats");

    await client.query(`
      CREATE TABLE IF NOT EXISTS features (
        id VARCHAR(100) PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        description TEXT NOT NULL DEFAULT '',
        sort_order INTEGER NOT NULL DEFAULT 0,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✓ Created table: features\n");

    // ── Insert data ───────────────────────────────────────────────────────

    // Site settings
    for (const [key, value] of siteSettings) {
      await client.query(
        `INSERT INTO site_settings (key, value, updated_at) VALUES ($1, $2, NOW())
         ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`,
        [key, value]
      );
    }
    console.log(`✓ Inserted ${siteSettings.length} site_settings rows`);

    // Hidden sections
    for (const [key, hidden] of hiddenSections) {
      await client.query(
        `INSERT INTO hidden_sections (section_key, is_hidden, updated_at) VALUES ($1, $2, NOW())
         ON CONFLICT (section_key) DO UPDATE SET is_hidden = EXCLUDED.is_hidden, updated_at = NOW()`,
        [key, hidden]
      );
    }
    console.log(`✓ Inserted ${hiddenSections.length} hidden_sections rows`);

    // Products
    for (const p of products) {
      await client.query(
        `INSERT INTO products (id, dose, tag, description, price, bullets, featured, cta_text, cta_url, sort_order, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
         ON CONFLICT (id) DO UPDATE SET dose=EXCLUDED.dose, tag=EXCLUDED.tag, description=EXCLUDED.description,
           price=EXCLUDED.price, bullets=EXCLUDED.bullets, featured=EXCLUDED.featured,
           cta_text=EXCLUDED.cta_text, cta_url=EXCLUDED.cta_url, sort_order=EXCLUDED.sort_order, updated_at=NOW()`,
        [p.id, p.dose, p.tag, p.desc, p.price, p.bullets, p.featured, p.ctaText, p.ctaUrl, p.sortOrder]
      );
    }
    console.log(`✓ Inserted ${products.length} products rows`);

    // Compounded Products
    for (const p of compoundedProducts) {
      await client.query(
        `INSERT INTO compounded_products (id, total, price, breakdown, description, bullets, cta_text, cta_url, sort_order, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
         ON CONFLICT (id) DO UPDATE SET total=EXCLUDED.total, price=EXCLUDED.price, breakdown=EXCLUDED.breakdown,
           description=EXCLUDED.description, bullets=EXCLUDED.bullets,
           cta_text=EXCLUDED.cta_text, cta_url=EXCLUDED.cta_url, sort_order=EXCLUDED.sort_order, updated_at=NOW()`,
        [p.id, p.total, p.price, p.breakdown, p.desc, p.bullets, p.ctaText, p.ctaUrl, p.sortOrder]
      );
    }
    console.log(`✓ Inserted ${compoundedProducts.length} compounded_products rows`);

    // FAQs
    for (const f of faqs) {
      await client.query(
        `INSERT INTO faqs (id, question, answer, sort_order, updated_at)
         VALUES ($1, $2, $3, $4, NOW())
         ON CONFLICT (id) DO UPDATE SET question=EXCLUDED.question, answer=EXCLUDED.answer, sort_order=EXCLUDED.sort_order, updated_at=NOW()`,
        [f.id, f.q, f.a, f.sortOrder]
      );
    }
    console.log(`✓ Inserted ${faqs.length} faqs rows`);

    // Testimonials
    for (const t of testimonials) {
      await client.query(
        `INSERT INTO testimonials (id, name, city, quote, sort_order, updated_at)
         VALUES ($1, $2, $3, $4, $5, NOW())
         ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name, city=EXCLUDED.city, quote=EXCLUDED.quote, sort_order=EXCLUDED.sort_order, updated_at=NOW()`,
        [t.id, t.name, t.city, t.quote, t.sortOrder]
      );
    }
    console.log(`✓ Inserted ${testimonials.length} testimonials rows`);

    // Stats
    for (const s of stats) {
      await client.query(
        `INSERT INTO stats (id, value, label, sort_order, updated_at)
         VALUES ($1, $2, $3, $4, NOW())
         ON CONFLICT (id) DO UPDATE SET value=EXCLUDED.value, label=EXCLUDED.label, sort_order=EXCLUDED.sort_order, updated_at=NOW()`,
        [s.id, s.value, s.label, s.sortOrder]
      );
    }
    console.log(`✓ Inserted ${stats.length} stats rows`);

    // Features
    for (const f of features) {
      await client.query(
        `INSERT INTO features (id, title, description, sort_order, updated_at)
         VALUES ($1, $2, $3, $4, NOW())
         ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, description=EXCLUDED.description, sort_order=EXCLUDED.sort_order, updated_at=NOW()`,
        [f.id, f.title, f.description, f.sortOrder]
      );
    }
    console.log(`✓ Inserted ${features.length} features rows`);

    // ── Verification ──────────────────────────────────────────────────────
    console.log("\n══ VERIFICATION ══");
    const tables = ["site_settings", "hidden_sections", "products", "compounded_products", "faqs", "testimonials", "stats", "features"];
    for (const table of tables) {
      const res = await client.query(`SELECT COUNT(*) as cnt FROM ${table}`);
      console.log(`  ${table}: ${res.rows[0].cnt} rows`);
    }

    console.log("\n✅ SUCCESS: All 8 tables created and populated!");

    client.release();
    await pool.end();
  } catch (err) {
    console.error("Database seed error:", err);
  }
}

runSeed();
