import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import heroImg from "@/assets/hero.jpg";
import penImg from "@/assets/pen.jpg";
import transformImg from "@/assets/transformation1.jpg";
import transform1 from "@/assets/transform1.jpeg";
import transformOpe10 from "@/assets/ope10.jpeg";
import transformOpe11 from "@/assets/ope11.jpeg";
import opePensVideo from "@/assets/opepens.mp4";
import t1 from "@/assets/testimonial1.jpg";
import t2 from "@/assets/testimonial2.jpg";
import t3 from "@/assets/testimonial3.jpg";
import logoImg from "@/assets/ope14.jpeg";
import kwikPensImg from "@/assets/ope6.jpg";
import starterKitImg from "@/assets/ope8.jpg";
import coldChainImg from "@/assets/ope9.jpg";
import review1 from "@/assets/testim1.jpeg";
import review2 from "@/assets/testim2.jpeg";
import review3 from "@/assets/testim3.jpeg";
import review4 from "@/assets/testim4.jpeg";
import review5 from "@/assets/testim5.jpeg";
import review6 from "@/assets/testim6.jpeg";
import review7 from "@/assets/testim7.jpeg";
import review8 from "@/assets/testim8.jpeg";
import WhatsAppChat from "@/components/WhatsAppChat";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Wellness Journey — Nigeria's Trusted Weight Loss Partner" },
      { name: "description", content: "GLP-1 weight loss treatments including Mounjaro®. Authentic medication, nationwide delivery, and ongoing support across Nigeria." },
      { property: "og:title", content: "Wellness Journey — Weight Loss in Nigeria" },
      { property: "og:description", content: "Lose weight. Repair your metabolic health. Reclaim your confidence. Mounjaro® treatment with nationwide delivery." },
      { property: "og:type", content: "website" },
      { property: "og:image", content: logoImg },
    ],
  }),
  component: Home,
});

const PHONE = "07036809459";
const PHONE_INTL = "+2347036809459";
const WHATSAPP = "https://wa.me/2347036809459";
const INSTAGRAM = "https://www.instagram.com/wellnessjourneyltd/";
const MAPS = "https://maps.app.goo.gl/ufi3YCJ6nqcYQJfL9?g_st=iw";


function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <img src={logoImg} alt="Wellness Journey logo" width={44} height={44} className="h-11 w-11 object-contain" />
      <div className="leading-none">
        <div className="font-display text-[1.05rem] font-semibold tracking-wide">Wellness Journey</div>
        <div className="text-[0.62rem] uppercase tracking-[0.22em] text-gold">Abuja · Nigeria</div>
      </div>
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-cream/60 px-3 py-1 text-xs font-medium text-primary backdrop-blur">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M5 12l4 4L19 7" stroke="var(--gold)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
      {children}
    </span>
  );
}

function GoldRule() {
  return <div className="gold-rule my-12 opacity-60" />;
}

const products = [
  { dose: "2.5mg", tag: "Starter Dose", desc: "Perfect for beginners easing into treatment.", price: "₦500,000", bullets: ["Helps control appetite", "Reduces cravings", "Supports gradual weight loss"] },
  { dose: "5mg", tag: "Most Popular", desc: "Our most requested dose for steady, visible results.", price: "₦650,000", bullets: ["Enhanced appetite suppression", "Improved blood sugar control", "Stronger weight-loss support"], featured: true },
  { dose: "7.5mg", tag: "Continued Progress", desc: "Step up when your body is ready for more.", price: "₦750,000", bullets: ["Supports ongoing fat loss", "Helps maintain consistency", "Increased effectiveness"] },
  { dose: "10mg", tag: "Advanced Support", desc: "Maximum support for committed transformation.", price: "₦820,000", bullets: ["Strong appetite control", "Continued metabolic improvement", "Sustained weight management"] },
  { dose: "12.5mg", tag: "Peak Progress", desc: "For patients titrating toward their target dose.", price: "₦1,000,000", bullets: ["Deep appetite regulation", "Accelerated fat-loss support", "Ideal for long-term maintenance prep"] },
  { dose: "15mg", tag: "Maximum Strength", desc: "The highest available dose for eligible patients.", price: "₦1,080,000", bullets: ["Maximum GLP-1 support", "Best for sustained results", "Requires clinical clearance"] },
];

const compoundedProducts = [
  { total: "10mg", price: "₦300,000", breakdown: "4 doses of 2.5mg", desc: "An affordable entry point for compounded tirzepatide treatment.", bullets: ["Weekly dosing over 4 weeks", "Ideal for starting titration", "Pharmacy-compounded quality"] },
  { total: "20mg", price: "₦350,000", breakdown: "4 doses of 5mg", desc: "Step up your compounded programme with a stronger weekly dose.", bullets: ["Enhanced appetite control", "Steady weekly progression", "Cost-effective option"] },
  { total: "30mg", price: "₦360,000", breakdown: "4 doses of 7.5mg", desc: "Mid-tier compounded support for ongoing weight-loss progress.", bullets: ["Stronger metabolic support", "4-week supply included", "Suitable for titration phase"] },
  { total: "40mg", price: "₦400,000", breakdown: "4 doses of 10mg", desc: "Advanced compounded dosing for patients ready for more.", bullets: ["High-strength weekly doses", "Sustained appetite suppression", "Full 4-week course"] },
  { total: "50mg", price: "₦430,000", breakdown: "4 doses of 12.5mg", desc: "Near-maximum compounded strength for eligible patients.", bullets: ["Peak-tier weekly dosing", "Supports long-term results", "Requires clinical clearance"] },
  { total: "60mg", price: "₦470,000", breakdown: "4 doses of 15mg", desc: "The highest compounded tirzepatide option we offer.", bullets: ["Maximum weekly dose strength", "Best for maintenance phase", "Dispensed after assessment"] },
];

function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Top utility bar */}
      <div className="bg-emerald-deep text-cream/90">
        <div className="container-x flex items-center justify-between py-2 text-[11px] uppercase tracking-[0.18em]">
          <span className="text-gold">✦ Trusted Care</span>
          <span className="hidden sm:inline">Nationwide Delivery · Authentic Medication</span>
          <a href={WHATSAPP} className="hover:text-gold transition">WhatsApp Us</a>
        </div>
      </div>

      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-xl">
        <div className="container-x flex h-16 items-center justify-between text-primary">
          <Logo />
          <nav className="hidden md:flex items-center gap-7 text-sm">
            <a href="#treatment" className="hover:text-gold transition">Treatment</a>
            <a href="#gallery" className="hover:text-gold transition">Stock</a>
            <a href="#results" className="hover:text-gold transition">Results</a>
            <a href="#reviews" className="hover:text-gold transition">Reviews</a>
            <a href="#bmi" className="hover:text-gold transition">BMI Tool</a>
            <a href="#faq" className="hover:text-gold transition">FAQ</a>
          </nav>

          <a href="#consult" className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-medium uppercase tracking-wider text-primary-foreground hover:opacity-90 transition">
            Book Consultation
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden bg-emerald-deep text-cream">
        <div className="absolute inset-0 opacity-[0.07] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, var(--gold) 0, transparent 40%), radial-gradient(circle at 80% 60%, var(--gold) 0, transparent 35%)" }} />
        <div className="container-x relative grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 py-20 lg:py-28 items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.32em] text-gold mb-6">
              <span className="h-px w-8 bg-gold/60" /> Wellness Journey
            </div>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl leading-[1.02] tracking-tight text-cream">
              Nigeria's <span className="italic text-gold">trusted</span> medical weight-loss partner.
            </h1>
            <p className="mt-7 max-w-xl text-lg text-cream/80 leading-relaxed">
              Lose weight. Repair your metabolic health. Reclaim your confidence. Official access to GLP-1 treatments including Mounjaro®, delivered with care across Nigeria.
            </p>

            <div className="mt-9 flex flex-wrap gap-2.5">
              <Pill>Trusted Care</Pill>
              <Pill>Nationwide Delivery</Pill>
              <Pill>Authentic Medication</Pill>
              <Pill>Ongoing Support</Pill>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a href="#consult" className="group inline-flex items-center gap-3 rounded-full bg-gold px-7 py-4 text-sm font-semibold uppercase tracking-[0.14em] text-gold-foreground shadow-gold hover:translate-y-[-1px] transition">
                Start Your Journey
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14m-5-5l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </a>
              <a href="#results" className="inline-flex items-center gap-2 text-sm text-cream/80 hover:text-gold transition">
                See real results <span aria-hidden>→</span>
              </a>
            </div>

            <div className="mt-12 flex items-center gap-5 border-t border-cream/15 pt-6 text-sm text-cream/70">
              <div className="flex -space-x-3">
                {[t1, t3, t2].map((src, i) => (
                  <img key={i} src={src} alt="" width={40} height={40} className="h-10 w-10 rounded-full border-2 border-emerald-900 object-cover" loading="lazy" />
                ))}
              </div>
              <div>
                <div className="text-gold">★★★★★ <span className="text-cream/90">4.9 / 5</span></div>
                <div className="text-xs">Trusted by 2,400+ Nigerian patients</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-luxe ring-1 ring-gold/30">
              <img src={heroImg} alt="Confident woman experiencing the Wellness Journey programme" width={1080} height={1350} className="h-full w-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                <div className="rounded-2xl bg-cream/95 p-5 text-foreground shadow-luxe">
                  <div className="text-gold text-sm">★★★★★</div>
                  <p className="mt-2 font-display text-xl leading-snug">"I lost 18kg in 4 months."</p>
                  <p className="mt-1 text-sm text-muted-foreground">Mounjaro changed everything — cravings, energy, confidence.</p>
                  <p className="mt-3 text-xs uppercase tracking-[0.18em] text-primary">— Sarah A., Lagos</p>
                </div>
              </div>
            </div>
            <div className="absolute -top-6 -right-6 hidden md:flex h-28 w-28 items-center justify-center rounded-full bg-gold text-gold-foreground shadow-gold rotate-6">
              <div className="text-center">
                <div className="font-display text-2xl leading-none">18kg</div>
                <div className="text-[10px] uppercase tracking-widest mt-1">in 4 months</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PAIN POINTS */}
      <section className="container-x py-20 lg:py-28">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-20 items-center">
          <div className="relative">
            <img src={penImg} alt="Mounjaro auto-injector pen on velvet" width={1200} height={900} loading="lazy" className="rounded-3xl shadow-luxe" />
            <div className="absolute -bottom-8 -right-4 md:-right-8 max-w-xs rounded-2xl bg-primary p-6 text-primary-foreground shadow-luxe">
              <div className="text-gold text-xs uppercase tracking-[0.2em] mb-2">Clinical Outcome</div>
              <div className="font-display text-3xl">10–20%</div>
              <p className="text-sm mt-1 opacity-85">average body-weight reduction with medical guidance.</p>
            </div>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-[0.3em] text-gold mb-4">Are you dealing with —</div>
            <h2 className="font-display text-4xl md:text-5xl leading-tight text-primary">A body that's been fighting you for too long?</h2>
            <p className="mt-5 text-muted-foreground max-w-lg">Mounjaro gives you a real chance to repair your metabolic health and finally lose the weight — with attentive care.</p>
            <ul className="mt-8 grid grid-cols-2 gap-3 text-sm">
              {["Excessive weight gain","Type 2 diabetes","Insulin resistance","Chronic fatigue","Hormonal imbalance","Irregular periods","PCOS","Constant cravings"].map((x) => (
                <li key={x} className="flex items-center gap-2.5 rounded-xl border border-border bg-card px-4 py-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                  <span className="text-foreground">{x}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* TREATMENT / PRODUCTS */}
      <section id="treatment" className="bg-secondary/60 py-20 lg:py-28 border-y border-border">
        <div className="container-x">
          <div className="max-w-2xl">
            <div className="text-[11px] uppercase tracking-[0.3em] text-gold mb-4">Which Mounjaro do you need?</div>
            <h2 className="font-display text-4xl md:text-5xl text-primary leading-tight">A dose tailored to where you are in your journey.</h2>
            <p className="mt-4 text-muted-foreground">Every patient is assessed by our team before any prescription is issued. Your starting dose and titration plan are guided by your health profile.</p>
          </div>

          <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map((p) => (
              <article key={p.dose} className={`group relative flex flex-col rounded-2xl border bg-card p-6 transition hover:-translate-y-1 ${p.featured ? "border-gold shadow-gold" : "border-border shadow-luxe"}`}>
                {p.featured && <div className="absolute -top-3 left-6 rounded-full bg-gold px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-foreground">Most Popular</div>}
                <div className="text-[10px] uppercase tracking-[0.25em] text-gold">{p.tag}</div>
                <div className="mt-3 font-display text-4xl text-primary">Mounjaro<span className="text-gold">.</span></div>
                <div className="font-display text-2xl">{p.dose}</div>
                <p className="mt-3 text-sm text-muted-foreground">{p.desc}</p>
                <ul className="mt-5 space-y-2 text-sm">
                  {p.bullets.map((b) => (
                    <li key={b} className="flex gap-2">
                      <span className="text-gold mt-0.5">✦</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 pt-5 border-t border-border">
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">From</div>
                  <div className="font-display text-3xl text-primary">{p.price}</div>
                </div>
                <a href="#consult" className={`mt-5 inline-flex items-center justify-center rounded-full px-4 py-3 text-xs font-semibold uppercase tracking-[0.15em] transition ${p.featured ? "bg-primary text-primary-foreground hover:bg-primary/90" : "border border-primary text-primary hover:bg-primary hover:text-primary-foreground"}`}>
                  Order via Consultation
                </a>
              </article>
            ))}
          </div>

          <div className="mt-20 max-w-2xl">
            <div className="text-[11px] uppercase tracking-[0.3em] text-gold mb-4">Compounded Option</div>
            <h3 className="font-display text-3xl md:text-4xl text-primary leading-tight">Compounded Tirzepatide</h3>
            <p className="mt-4 text-muted-foreground">Pharmacy-compounded tirzepatide supplied in 4-week courses. Each vial includes four weekly doses as listed below.</p>
          </div>

          <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {compoundedProducts.map((p) => (
              <article key={p.total} className="group relative flex flex-col rounded-2xl border border-border bg-card p-6 shadow-luxe transition hover:-translate-y-1">
                <div className="text-[10px] uppercase tracking-[0.25em] text-gold">{p.breakdown}</div>
                <div className="mt-3 font-display text-3xl text-primary leading-tight">Compounded Tirzepatide</div>
                <div className="font-display text-2xl">{p.total}</div>
                <p className="mt-3 text-sm text-muted-foreground">{p.desc}</p>
                <ul className="mt-5 space-y-2 text-sm">
                  {p.bullets.map((b) => (
                    <li key={b} className="flex gap-2">
                      <span className="text-gold mt-0.5">✦</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 pt-5 border-t border-border">
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">From</div>
                  <div className="font-display text-3xl text-primary">{p.price}</div>
                </div>
                <a href="#consult" className="mt-5 inline-flex items-center justify-center rounded-full border border-primary px-4 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-primary transition hover:bg-primary hover:text-primary-foreground">
                  Order via Consultation
                </a>
              </article>
            ))}
          </div>

          <p className="mt-8 text-xs text-muted-foreground max-w-2xl">Prescription medication. Sold only after medical assessment. Mounjaro® is a registered trademark of Eli Lilly and Company. Compounded tirzepatide is prepared by licensed pharmacies and is not Mounjaro®. Prices subject to change.</p>
        </div>
      </section>

      {/* PRODUCT GALLERY */}
      <section id="gallery" className="container-x py-20 lg:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
          <div className="max-w-xl">
            <div className="text-[11px] uppercase tracking-[0.3em] text-gold mb-4">Authentic Stock · Photographed In-House</div>
            <h2 className="font-display text-4xl md:text-5xl text-primary leading-tight">Real Mounjaro®. Sealed. Verified.</h2>
            <p className="mt-4 text-muted-foreground">Every pen we dispense is sourced through verified pharmaceutical channels and stored under proper cold-chain conditions before delivery.</p>
          </div>
          <a href={WHATSAPP} className="inline-flex items-center gap-2 rounded-full border border-primary px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-primary hover:bg-primary hover:text-primary-foreground transition">
            Check current stock
          </a>
        </div>
        <figure className="mb-8 overflow-hidden rounded-3xl border border-border bg-card shadow-luxe">
          <video
            src={opePensVideo}
            controls
            muted
            defaultMuted
            playsInline
            preload="metadata"
            className="w-full aspect-video object-cover bg-black"
            aria-label="How your Mounjaro pens arrive"
            onLoadedMetadata={(e) => {
              e.currentTarget.muted = true;
              e.currentTarget.volume = 0;
            }}
            onVolumeChange={(e) => {
              e.currentTarget.muted = true;
              e.currentTarget.volume = 0;
            }}
          />
          <figcaption className="flex items-center justify-between border-t border-border px-5 py-4">
            <div>
              <div className="font-display text-lg text-primary">How your pens arrive</div>
              <p className="mt-1 text-sm text-muted-foreground">Sealed packaging, verified stock, and cold-chain handling from dispatch to your door.</p>
            </div>
            <span className="text-gold text-xs uppercase tracking-[0.2em]">Unboxing</span>
          </figcaption>
        </figure>

        <div className="grid md:grid-cols-3 gap-5">
          {[
            { src: kwikPensImg, label: "7.5mg & 10mg KwikPens" },
            { src: starterKitImg, label: "2.5mg Starter Kit" },
            { src: coldChainImg, label: "Cold-chain delivery" },
          ].map((p) => (
            <figure key={p.label} className="group relative overflow-hidden rounded-3xl border border-border bg-card shadow-luxe">
              <div className="aspect-[4/5] overflow-hidden">
                <img src={p.src} alt={p.label} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              </div>
              <figcaption className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/80 to-transparent p-5 text-cream">
                <span className="font-display text-lg">{p.label}</span>
                <span className="text-gold text-xs uppercase tracking-[0.2em]">Authentic</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>



      {/* RESULTS */}
      <section id="results" className="container-x py-20 lg:py-28">
        <div className="grid lg:grid-cols-[1fr_1fr] gap-14 items-center">
          <div>
            <div className="text-[11px] uppercase tracking-[0.3em] text-gold mb-4">Real Results · Real Nigerians</div>
            <h2 className="font-display text-4xl md:text-5xl text-primary leading-tight">Transformations that feel as good as they look.</h2>
            <p className="mt-5 text-muted-foreground max-w-md">Photographs shared with patient consent. Outcomes vary and depend on adherence, nutrition, and consistent follow-up.</p>
            <div className="mt-8 grid grid-cols-3 gap-6">
              {[
                { k: "2,400+", v: "Patients served" },
                { k: "14kg", v: "Avg. 4-month loss" },
                { k: "94%", v: "Would recommend" },
              ].map((s) => (
                <div key={s.k}>
                  <div className="font-display text-3xl text-primary">{s.k}</div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">{s.v}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img src={transform1} alt="Before and after transformation" width={1200} height={1300} loading="lazy" className="col-span-2 rounded-3xl shadow-luxe w-full" />
            <img src={transformImg} alt="Before and after transformation" width={1200} height={1300} loading="lazy" className="col-span-2 rounded-3xl shadow-luxe w-full" />
            <img src={transformOpe10} alt="Patient transformation" width={600} height={800} loading="lazy" className="rounded-3xl shadow-luxe w-full" />
            <img src={transformOpe11} alt="Patient transformation" width={600} height={800} loading="lazy" className="rounded-3xl shadow-luxe w-full" />
          </div>
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-6">
          {[
            { img: t1, name: "Chidinma", city: "Abuja", quote: "I lost 14kg in 3 months. My energy improved and my clothes fit again." },
            { img: t2, name: "Tunde", city: "Lagos", quote: "I struggled with cravings for years. Within weeks my appetite was finally under control." },
            { img: t3, name: "Kemi", city: "Port Harcourt", quote: "My blood sugar improved and I lost 11kg. The best decision I've made for my health." },
          ].map((r) => (
            <figure key={r.name} className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-luxe">
              <div className="flex items-center gap-4">
                <img src={r.img} alt={r.name} width={64} height={64} loading="lazy" className="h-14 w-14 rounded-full object-cover ring-2 ring-gold/40" />
                <div>
                  <div className="font-display text-lg text-primary">{r.name}</div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">{r.city}</div>
                </div>
              </div>
              <div className="text-gold mt-4 text-sm">★★★★★</div>
              <blockquote className="mt-2 font-display text-xl leading-snug text-foreground">"{r.quote}"</blockquote>
            </figure>
          ))}
        </div>
      </section>

      {/* WHATSAPP REVIEWS */}
      <section id="reviews" className="bg-secondary/60 border-y border-border py-20 lg:py-28">
        <div className="container-x">
          <div className="max-w-2xl mb-12">
            <div className="text-[11px] uppercase tracking-[0.3em] text-gold mb-4">Unfiltered · Straight from WhatsApp</div>
            <h2 className="font-display text-4xl md:text-5xl text-primary leading-tight">What our clients message us, in their own words.</h2>
            <p className="mt-4 text-muted-foreground">Real conversations from real Nigerian clients — shared with consent, names redacted for privacy.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[review1, review2, review3, review4, review5, review6, review7, review8].map((r, i) => (
              <a key={i} href={WHATSAPP} className="group block overflow-hidden rounded-2xl border border-border bg-card shadow-luxe hover:-translate-y-1 transition">
                <div className="aspect-[3/4] overflow-hidden bg-emerald-deep/5">
                  <img src={r} alt={`Client testimonial ${i + 1}`} loading="lazy" className="h-full w-full object-cover object-top transition duration-700 group-hover:scale-105" />
                </div>
              </a>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card p-6">
            <p className="font-display text-xl text-primary">Want to be our next success story?</p>
            <a href={WHATSAPP} className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-gold-foreground hover:translate-y-[-1px] transition">
              Message us on WhatsApp
            </a>
          </div>
        </div>
      </section>



      {/* WHY US */}
      <section id="why" className="bg-emerald-deep text-cream py-20 lg:py-28">
        <div className="container-x grid lg:grid-cols-[0.9fr_1.1fr] gap-14">
          <div>
            <div className="text-[11px] uppercase tracking-[0.3em] text-gold mb-4">Why Nigerians choose us</div>
            <h2 className="font-display text-4xl md:text-5xl leading-tight">Premium care, not just a prescription.</h2>
            <p className="mt-5 text-cream/75 max-w-md">We are not a pharmacy — we are a medically led weight-loss programme. From your first consultation to long-term maintenance, our team stays with you.</p>
            <a href={WHATSAPP} className="mt-8 inline-flex items-center gap-3 rounded-full bg-gold px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-gold-foreground hover:translate-y-[-1px] transition">
              Chat with our team on WhatsApp
            </a>
          </div>
          <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-5 text-sm">
            {[
              ["Authentic Medication", "Sourced through verified pharmaceutical channels."],
              ["Doctor-Led Consultations", "Every patient is medically assessed before treatment."],
              ["Ongoing Follow-Up", "Dose titration, side-effect support, and progress tracking."],
              ["Nutrition Guidance", "Realistic, Nigerian-food-friendly meal frameworks."],
              ["Exercise Programmes", "Sustainable movement tailored to your body."],
              ["WhatsApp Support", "Direct line to your care team, 7 days a week."],
              ["Nationwide Delivery", "Discreet cold-chain delivery to every state."],
              ["Flexible Payments", "Bank transfer, card, and instalment options."],
            ].map(([title, body]) => (
              <li key={title} className="flex gap-3 border-t border-cream/15 pt-5">
                <span className="text-gold mt-1">✦</span>
                <div>
                  <div className="font-display text-lg">{title}</div>
                  <p className="text-cream/70 mt-0.5">{body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* BMI CALCULATOR */}
      <section id="bmi" className="container-x py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <div className="text-[11px] uppercase tracking-[0.3em] text-gold mb-4">BMI & Projection Tool</div>
            <h2 className="font-display text-4xl md:text-5xl text-primary leading-tight">See what your journey could look like.</h2>
            <p className="mt-5 text-muted-foreground max-w-md">Calculate your current BMI and see a typical 4-month projection based on the average 15% weight reduction seen in our programme.</p>
            <p className="mt-4 text-xs text-muted-foreground">Estimates are illustrative and not a medical prediction.</p>
          </div>
          <BMICalculator />
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-secondary/60 border-y border-border py-20 lg:py-28">
        <div className="container-x grid lg:grid-cols-[0.7fr_1.3fr] gap-14">
          <div>
            <div className="text-[11px] uppercase tracking-[0.3em] text-gold mb-4">Frequently asked</div>
            <h2 className="font-display text-4xl md:text-5xl text-primary leading-tight">Answers from our team.</h2>
          </div>
          <div className="divide-y divide-border border-y border-border">
            {[
              { q: "Is Mounjaro approved for use in Nigeria?", a: "Mounjaro® (tirzepatide) is a prescription medication used worldwide under medical supervision. We dispense only through licensed medical assessment and verified supply channels." },
              { q: "How much weight can I realistically lose?", a: "Clinical data shows most patients lose 10–20% of their body weight when treatment is combined with nutrition and lifestyle support. Your doctor will set realistic targets for you." },
              { q: "Do I need a consultation before ordering?", a: "Yes. Every patient undergoes a confidential medical assessment so we can confirm Mounjaro is safe and appropriate for you, and plan your starting dose." },
              { q: "How is the medication delivered?", a: "Cold-chain courier delivery nationwide, in discreet packaging. Lagos and Abuja typically receive same-day or next-day delivery." },
              { q: "What payment methods do you accept?", a: "Bank transfer, debit/credit card, and selected instalment options. Payment details are shared after your consultation." },
            ].map((item, i) => (
              <details key={i} className="group py-5">
                <summary className="flex cursor-pointer items-center justify-between gap-6 list-none">
                  <span className="font-display text-xl text-primary">{item.q}</span>
                  <span className="text-gold text-2xl transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-muted-foreground leading-relaxed max-w-2xl">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CONSULT CTA */}
      <section id="consult" className="container-x py-20 lg:py-28">
        <div className="relative overflow-hidden rounded-[2rem] bg-emerald-deep text-cream p-10 md:p-16 shadow-luxe">
          <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-gold/20 blur-3xl" />
          <div className="relative grid lg:grid-cols-[1.2fr_0.8fr] gap-10 items-center">
            <div>
              <div className="text-[11px] uppercase tracking-[0.3em] text-gold mb-4">Ready to start?</div>
              <h2 className="font-display text-4xl md:text-5xl leading-tight">Book your consultation today.</h2>
              <p className="mt-4 text-cream/80 max-w-lg">Speak with our team confidentially. We'll assess your goals, your health, and the right starting dose — usually within 24 hours.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href={WHATSAPP} className="inline-flex items-center gap-3 rounded-full bg-gold px-7 py-4 text-sm font-semibold uppercase tracking-[0.14em] text-gold-foreground hover:translate-y-[-1px] transition">
                  WhatsApp Now
                </a>
                <a href={`tel:${PHONE_INTL}`} className="inline-flex items-center gap-3 rounded-full border border-cream/30 px-7 py-4 text-sm font-semibold uppercase tracking-[0.14em] text-cream hover:border-gold hover:text-gold transition">
                  Call {PHONE}
                </a>
              </div>
            </div>
            <div className="rounded-2xl border border-cream/15 bg-cream/[0.04] p-6 backdrop-blur">
              <div className="text-gold text-xs uppercase tracking-[0.2em]">Visit / Reach Us</div>
              <div className="mt-4 space-y-3 text-sm text-cream/85">
                <div>📞 <a href={`tel:${PHONE_INTL}`} className="hover:text-gold transition">{PHONE}</a></div>
                <div>💬 WhatsApp 7 days a week</div>
                <div>📸 <a href={INSTAGRAM} target="_blank" rel="noreferrer" className="hover:text-gold transition">@wellnessjourneyltd</a></div>
                <div>📍 <a href={MAPS} target="_blank" rel="noreferrer" className="hover:text-gold transition">Abuja, Nigeria — view on Maps</a></div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <GoldRule />

      {/* FOOTER */}
      <footer className="container-x pb-12">
        <div className="grid md:grid-cols-[1.4fr_1fr_1fr] gap-10">
          <div>
            <Logo className="text-primary" />
            <p className="mt-4 text-sm text-muted-foreground max-w-sm">Helping Nigerians achieve sustainable weight loss and better metabolic health through trusted GLP-1 treatment.</p>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-[0.25em] text-gold mb-3">Programme</div>
            <ul className="space-y-2 text-sm">
              <li><a href="#treatment" className="hover:text-gold transition">Mounjaro Doses</a></li>
              <li><a href="#results" className="hover:text-gold transition">Patient Results</a></li>
              <li><a href="#bmi" className="hover:text-gold transition">BMI Calculator</a></li>
              <li><a href="#faq" className="hover:text-gold transition">FAQ</a></li>
            </ul>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-[0.25em] text-gold mb-3">Contact</div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href={`tel:${PHONE_INTL}`} className="hover:text-gold transition">{PHONE}</a></li>
              <li><a href={WHATSAPP} className="hover:text-gold transition">WhatsApp Chat</a></li>
              <li><a href={INSTAGRAM} target="_blank" rel="noreferrer" className="hover:text-gold transition">@wellnessjourneyltd</a></li>
              <li><a href={MAPS} target="_blank" rel="noreferrer" className="hover:text-gold transition">Abuja, Nigeria</a></li>
            </ul>

          </div>
        </div>
        <div className="mt-12 border-t border-border pt-6 text-xs text-muted-foreground flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img src={logoImg} alt="Wellness Journey logo" width={36} height={36} className="h-9 w-9 object-contain" />
            <span>© {new Date().getFullYear()} Wellness Journey Nigeria. All rights reserved.</span>
          </div>
          <span>Mounjaro® is a registered trademark of Eli Lilly. Prescription only.</span>
        </div>
      </footer>

      {/* WhatsApp Chat Widget */}
      <WhatsAppChat />
    </main>
  );
}

function BMICalculator() {
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(85);
  const bmi = weight / ((height / 100) ** 2);
  const projected = weight * 0.85;
  const projectedLoss = weight - projected;
  const category =
    bmi < 18.5 ? "Underweight" :
    bmi < 25 ? "Healthy" :
    bmi < 30 ? "Overweight" :
    bmi < 35 ? "Obesity I" :
    bmi < 40 ? "Obesity II" : "Obesity III";

  return (
    <div className="rounded-3xl border border-border bg-card p-8 shadow-luxe">
      <div className="grid grid-cols-2 gap-6">
        <label className="block">
          <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Height (cm)</span>
          <input type="number" value={height} onChange={(e) => setHeight(+e.target.value || 0)} className="mt-2 w-full rounded-lg border border-input bg-background px-4 py-3 font-display text-2xl text-primary focus:outline-none focus:border-gold" />
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Weight (kg)</span>
          <input type="number" value={weight} onChange={(e) => setWeight(+e.target.value || 0)} className="mt-2 w-full rounded-lg border border-input bg-background px-4 py-3 font-display text-2xl text-primary focus:outline-none focus:border-gold" />
        </label>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-6 border-t border-border pt-6">
        <div>
          <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Your BMI</div>
          <div className="font-display text-5xl text-primary mt-1">{isFinite(bmi) ? bmi.toFixed(1) : "—"}</div>
          <div className="text-sm text-gold mt-1">{category}</div>
        </div>
        <div className="rounded-xl bg-emerald-deep p-5 text-cream">
          <div className="text-[10px] uppercase tracking-[0.18em] text-gold">4-month projection</div>
          <div className="font-display text-3xl mt-1">{projected.toFixed(1)} kg</div>
          <div className="text-xs text-cream/75 mt-1">Estimated loss of {projectedLoss.toFixed(1)} kg (~15%)</div>
        </div>
      </div>

      <a href="#consult" className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-primary px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.15em] text-primary-foreground hover:opacity-90 transition">
        Book Free Assessment
      </a>
    </div>
  );
}
