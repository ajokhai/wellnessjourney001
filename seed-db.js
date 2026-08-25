import pg from "pg";

const connectionString = "postgresql://neondb_owner:npg_RH67jgMDFNXz@ep-aged-moon-augpgn8x-pooler.c-10.us-east-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require";

const defaultConfig = {
  hiddenSections: { topBar: false, hero: false, painPoints: false, mounjaroTreatment: false, compoundedTreatment: false, gallery: false, results: false, whatsappReviews: false, whyUs: false, bmiSection: false, faqSection: false, consultSection: false },
  seo: { title: "Wellness Journey — Nigeria's Trusted Weight Loss Partner", description: "GLP-1 weight loss treatments including Mounjaro®. Authentic medication, nationwide delivery, and ongoing support across Nigeria.", keywords: "Mounjaro Nigeria, Tirzepatide Nigeria, weight loss Abuja, weight loss Lagos, GLP-1 Nigeria, body zenith, wellness journey", faviconUrl: "", ogTitle: "Wellness Journey — Weight Loss in Nigeria", ogDescription: "Lose weight. Repair your metabolic health. Reclaim your confidence. Mounjaro® treatment with nationwide delivery.", ogImageUrl: "" },
  tracking: { googleTagManagerId: "", facebookPixelId: "", tiktokPixelId: "", customHeadScripts: "", customBodyScripts: "" },
  contact: { phone: "07036809459", phoneIntl: "+2347036809459", whatsappUrl: "https://wa.me/2347036809459", instagramUrl: "https://www.instagram.com/wellnessjourneyltd/", mapsUrl: "https://maps.app.goo.gl/ufi3YCJ6nqcYQJfL9?g_st=iw", locationText: "Abuja, Nigeria" },
  topBar: { badgeText: "✦ Trusted Care", subText: "Nationwide Delivery · Authentic Medication", whatsappText: "WhatsApp Us" },
  hero: { badge: "Wellness Journey", headline: "Nigeria's trusted medical weight-loss partner.", headlineItalic: "trusted", subheadline: "Lose weight. Repair your metabolic health. Reclaim your confidence. Official access to GLP-1 treatments including Mounjaro®, delivered with care across Nigeria.", pills: ["Trusted Care", "Nationwide Delivery", "Authentic Medication", "Ongoing Support"], primaryCtaText: "Start Your Journey", primaryCtaUrl: "#consult", secondaryCtaText: "See real results", secondaryCtaUrl: "#results", ratingText: "Trusted by 2,400+ Nigerian patients", ratingScore: "4.9 / 5", overlayQuote: '"I lost 18kg in 4 months."', overlaySubtext: "Mounjaro changed everything — cravings, energy, confidence.", overlayAuthor: "— Sarah A., Lagos", statBadgeTitle: "18kg", statBadgeSubtitle: "in 4 months" },
  painPoints: { eyebrow: "Are you dealing with —", headline: "A body that's been fighting you for too long?", description: "Mounjaro gives you a real chance to repair your metabolic health and finally lose the weight — with attentive care.", outcomeTag: "Clinical Outcome", outcomeStat: "10–20%", outcomeDesc: "average body-weight reduction with medical guidance.", items: ["Excessive weight gain","Type 2 diabetes","Insulin resistance","Chronic fatigue","Hormonal imbalance","Irregular periods","PCOS","Constant cravings"] },
  treatment: { mounjaroEyebrow: "Which Mounjaro do you need?", mounjaroHeadline: "A dose tailored to where you are in your journey.", mounjaroDesc: "Every patient is assessed by our team before any prescription is issued. Your starting dose and titration plan are guided by your health profile.", compoundedEyebrow: "Compounded Option", compoundedHeadline: "Compounded Tirzepatide", compoundedDesc: "Pharmacy-compounded tirzepatide supplied in 4-week courses. Each vial includes four weekly doses as listed below.", disclaimerText: "Prescription medication. Sold only after medical assessment. Mounjaro® is a registered trademark of Eli Lilly and Company. Compounded tirzepatide is prepared by licensed pharmacies and is not Mounjaro®. Prices subject to change." },
  gallery: { eyebrow: "Authentic Stock · Photographed In-House", headline: "Real Mounjaro®. Sealed. Verified.", description: "Every pen we dispense is sourced through verified pharmaceutical channels and stored under proper cold-chain conditions before delivery.", ctaText: "Check current stock", videoTitle: "How your pens arrive", videoDesc: "Sealed packaging, verified stock, and cold-chain handling from dispatch to your door.", videoTag: "Unboxing" },
  results: { eyebrow: "Real Results · Real Nigerians", headline: "Transformations that feel as good as they look.", description: "Photographs shared with patient consent. Outcomes vary and depend on adherence, nutrition, and consistent follow-up.", stats: [{ id: "stat-1", value: "2,400+", label: "Patients served" }, { id: "stat-2", value: "14kg", label: "Avg. 4-month loss" }, { id: "stat-3", value: "94%", label: "Would recommend" }], testimonials: [{ id: "testim-1", name: "Chidinma", city: "Abuja", quote: "I lost 14kg in 3 months. My energy improved and my clothes fit again." }, { id: "testim-2", name: "Tunde", city: "Lagos", quote: "I struggled with cravings for years. Within weeks my appetite was finally under control." }, { id: "testim-3", name: "Kemi", city: "Port Harcourt", quote: "My blood sugar improved and I lost 11kg. The best decision I've made for my health." }] },
  whatsappReviews: { eyebrow: "Unfiltered · Straight from WhatsApp", headline: "What our clients message us, in their own words.", description: "Real conversations from real Nigerian clients — shared with consent, names redacted for privacy.", ctaBannerHeadline: "Want to be our next success story?", ctaBannerButtonText: "Message us on WhatsApp" },
  whyUs: { eyebrow: "Why Nigerians choose us", headline: "Premium care, not just a prescription.", description: "We are not a pharmacy — we are a medically led weight-loss programme. From your first consultation to long-term maintenance, our team stays with you.", ctaText: "Chat with our team on WhatsApp", features: [{ id: "why-1", title: "Authentic Medication", description: "Sourced through verified pharmaceutical channels." }, { id: "why-2", title: "Doctor-Led Consultations", description: "Every patient is medically assessed before treatment." }, { id: "why-3", title: "Ongoing Follow-Up", description: "Dose titration, side-effect support, and progress tracking." }, { id: "why-4", title: "Nutrition Guidance", description: "Realistic, Nigerian-food-friendly meal frameworks." }, { id: "why-5", title: "Exercise Programmes", description: "Sustainable movement tailored to your body." }, { id: "why-6", title: "WhatsApp Support", description: "Direct line to your care team, 7 days a week." }, { id: "why-7", title: "Nationwide Delivery", description: "Discreet cold-chain delivery to every state." }, { id: "why-8", title: "Flexible Payments", description: "Bank transfer, card, and instalment options." }] },
  bmiSection: { eyebrow: "BMI & Projection Tool", headline: "See what your journey could look like.", description: "Calculate your current BMI and see a typical 4-month projection based on the average 15% weight reduction seen in our programme.", disclaimerText: "Estimates are illustrative and not a medical prediction.", ctaButtonText: "Book Free Assessment" },
  faqSection: { eyebrow: "Frequently asked", headline: "Answers from our team." },
  consultSection: { eyebrow: "Ready to start?", headline: "Book your consultation today.", description: "Speak with our team confidentially. We'll assess your goals, your health, and the right starting dose — usually within 24 hours.", whatsappButtonText: "WhatsApp Now", callButtonText: "Call" },
  footer: { aboutText: "Helping Nigerians achieve sustainable weight loss and better metabolic health through trusted GLP-1 treatment.", copyrightText: "Wellness Journey Nigeria. All rights reserved.", trademarkText: "Mounjaro® is a registered trademark of Eli Lilly. Prescription only." },
  products: [
    { id: "mounjaro-2-5mg", dose: "2.5mg", tag: "Starter Dose", desc: "Perfect for beginners easing into treatment.", price: "₦500,000", bullets: ["Helps control appetite", "Reduces cravings", "Supports gradual weight loss"], ctaText: "Order via Consultation", ctaUrl: "#consult" },
    { id: "mounjaro-5mg", dose: "5mg", tag: "Most Popular", desc: "Our most requested dose for steady, visible results.", price: "₦650,000", bullets: ["Enhanced appetite suppression", "Improved blood sugar control", "Stronger weight-loss support"], featured: true, ctaText: "Order via Consultation", ctaUrl: "#consult" },
    { id: "mounjaro-7-5mg", dose: "7.5mg", tag: "Continued Progress", desc: "Step up when your body is ready for more.", price: "₦750,000", bullets: ["Supports ongoing fat loss", "Helps maintain consistency", "Increased effectiveness"], ctaText: "Order via Consultation", ctaUrl: "#consult" },
    { id: "mounjaro-10mg", dose: "10mg", tag: "Advanced Support", desc: "Maximum support for committed transformation.", price: "₦820,000", bullets: ["Strong appetite control", "Continued metabolic improvement", "Sustained weight management"], ctaText: "Order via Consultation", ctaUrl: "#consult" },
    { id: "mounjaro-12-5mg", dose: "12.5mg", tag: "Peak Progress", desc: "For patients titrating toward their target dose.", price: "₦1,000,000", bullets: ["Deep appetite regulation", "Accelerated fat-loss support", "Ideal for long-term maintenance prep"], ctaText: "Order via Consultation", ctaUrl: "#consult" },
    { id: "mounjaro-15mg", dose: "15mg", tag: "Maximum Strength", desc: "The highest available dose for eligible patients.", price: "₦1,080,000", bullets: ["Maximum GLP-1 support", "Best for sustained results", "Requires clinical clearance"], ctaText: "Order via Consultation", ctaUrl: "#consult" }
  ],
  compoundedProducts: [
    { id: "compounded-10mg", total: "10mg", price: "₦300,000", breakdown: "4 doses of 2.5mg", desc: "An affordable entry point for compounded tirzepatide treatment.", bullets: ["Weekly dosing over 4 weeks", "Ideal for starting titration", "Pharmacy-compounded quality"], ctaText: "Order via Consultation", ctaUrl: "#consult" },
    { id: "compounded-20mg", total: "20mg", price: "₦350,000", breakdown: "4 doses of 5mg", desc: "Step up your compounded programme with a stronger weekly dose.", bullets: ["Enhanced appetite control", "Steady weekly progression", "Cost-effective option"], ctaText: "Order via Consultation", ctaUrl: "#consult" },
    { id: "compounded-30mg", total: "30mg", price: "₦360,000", breakdown: "4 doses of 7.5mg", desc: "Mid-tier compounded support for ongoing weight-loss progress.", bullets: ["Stronger metabolic support", "4-week supply included", "Suitable for titration phase"], ctaText: "Order via Consultation", ctaUrl: "#consult" },
    { id: "compounded-40mg", total: "40mg", price: "₦400,000", breakdown: "4 doses of 10mg", desc: "Advanced compounded dosing for patients ready for more.", bullets: ["High-strength weekly doses", "Sustained appetite suppression", "Full 4-week course"], ctaText: "Order via Consultation", ctaUrl: "#consult" },
    { id: "compounded-50mg", total: "50mg", price: "₦430,000", breakdown: "4 doses of 12.5mg", desc: "Near-maximum compounded strength for eligible patients.", bullets: ["Peak-tier weekly dosing", "Supports long-term results", "Requires clinical clearance"], ctaText: "Order via Consultation", ctaUrl: "#consult" },
    { id: "compounded-60mg", total: "60mg", price: "₦470,000", breakdown: "4 doses of 15mg", desc: "The highest compounded tirzepatide option we offer.", bullets: ["Maximum weekly dose strength", "Best for maintenance phase", "Dispensed after assessment"], ctaText: "Order via Consultation", ctaUrl: "#consult" }
  ],
  faq: [
    { id: "faq-1", q: "Is Mounjaro approved for use in Nigeria?", a: "Mounjaro® (tirzepatide) is a prescription medication used worldwide under medical supervision. We dispense only through licensed medical assessment and verified supply channels." },
    { id: "faq-2", q: "How much weight can I realistically lose?", a: "Clinical data shows most patients lose 10–20% of their body weight when treatment is combined with nutrition and lifestyle support. Your doctor will set realistic targets for you." },
    { id: "faq-3", q: "Do I need a consultation before ordering?", a: "Yes. Every patient undergoes a confidential medical assessment so we can confirm Mounjaro is safe and appropriate for you, and plan your starting dose." },
    { id: "faq-4", q: "How is the medication delivered?", a: "Cold-chain courier delivery nationwide, in discreet packaging. Lagos and Abuja typically receive same-day or next-day delivery." },
    { id: "faq-5", q: "What payment methods do you accept?", a: "Bank transfer, debit/credit card, and selected instalment options. Payment details are shared after your consultation." }
  ]
};

async function runSeed() {
  const pool = new pg.Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  try {
    const client = await pool.connect();
    console.log("Connected to Neon Postgres!");

    await client.query(`
      CREATE TABLE IF NOT EXISTS site_config_store (
        id VARCHAR(255) PRIMARY KEY,
        config JSONB NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(
      `INSERT INTO site_config_store (id, config, updated_at)
       VALUES ('main', $1, NOW())
       ON CONFLICT (id) DO UPDATE SET config = EXCLUDED.config, updated_at = NOW();`,
      [JSON.stringify(defaultConfig)]
    );

    console.log("✓ SUCCESS: Database table 'site_config_store' populated!");

    const res = await client.query("SELECT id, updated_at, pg_size_pretty(length(config::text)::bigint) as size FROM site_config_store;");
    console.log("Row in database:", res.rows[0]);

    client.release();
    await pool.end();
  } catch (err) {
    console.error("Database seed error:", err);
  }
}

runSeed();
