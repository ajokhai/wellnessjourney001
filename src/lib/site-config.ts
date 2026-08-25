export interface ProductItem {
  id: string;
  dose: string;
  tag: string;
  desc: string;
  price: string;
  bullets: string[];
  featured?: boolean;
}

export interface CompoundedProductItem {
  id: string;
  total: string;
  price: string;
  breakdown: string;
  desc: string;
  bullets: string[];
}

export interface FaqItem {
  id: string;
  q: string;
  a: string;
}

export interface SiteConfig {
  seo: {
    title: string;
    description: string;
    keywords: string;
    faviconUrl: string;
    ogTitle: string;
    ogDescription: string;
    ogImageUrl: string;
  };
  tracking: {
    googleTagManagerId: string;
    facebookPixelId: string;
    tiktokPixelId: string;
    customHeadScripts: string;
    customBodyScripts: string;
  };
  contact: {
    phone: string;
    phoneIntl: string;
    whatsappUrl: string;
    instagramUrl: string;
    mapsUrl: string;
    locationText: string;
  };
  hero: {
    badge: string;
    headline: string;
    headlineItalic: string;
    subheadline: string;
    primaryCtaText: string;
    primaryCtaUrl: string;
    secondaryCtaText: string;
    secondaryCtaUrl: string;
    ratingText: string;
    ratingScore: string;
    statBadgeTitle: string;
    statBadgeSubtitle: string;
  };
  products: ProductItem[];
  compoundedProducts: CompoundedProductItem[];
  faq: FaqItem[];
}

export const defaultConfig: SiteConfig = {
  seo: {
    title: "Wellness Journey — Nigeria's Trusted Weight Loss Partner",
    description:
      "GLP-1 weight loss treatments including Mounjaro®. Authentic medication, nationwide delivery, and ongoing support across Nigeria.",
    keywords:
      "Mounjaro Nigeria, Tirzepatide Nigeria, weight loss Abuja, weight loss Lagos, GLP-1 Nigeria, body zenith, wellness journey",
    faviconUrl: "",
    ogTitle: "Wellness Journey — Weight Loss in Nigeria",
    ogDescription:
      "Lose weight. Repair your metabolic health. Reclaim your confidence. Mounjaro® treatment with nationwide delivery.",
    ogImageUrl: "",
  },
  tracking: {
    googleTagManagerId: "",
    facebookPixelId: "",
    tiktokPixelId: "",
    customHeadScripts: "",
    customBodyScripts: "",
  },
  contact: {
    phone: "07036809459",
    phoneIntl: "+2347036809459",
    whatsappUrl: "https://wa.me/2347036809459",
    instagramUrl: "https://www.instagram.com/wellnessjourneyltd/",
    mapsUrl: "https://maps.app.goo.gl/ufi3YCJ6nqcYQJfL9?g_st=iw",
    locationText: "Abuja, Nigeria",
  },
  hero: {
    badge: "Wellness Journey",
    headline: "Nigeria's trusted medical weight-loss partner.",
    headlineItalic: "trusted",
    subheadline:
      "Lose weight. Repair your metabolic health. Reclaim your confidence. Official access to GLP-1 treatments including Mounjaro®, delivered with care across Nigeria.",
    primaryCtaText: "Start Your Journey",
    primaryCtaUrl: "#consult",
    secondaryCtaText: "See real results",
    secondaryCtaUrl: "#results",
    ratingText: "Trusted by 2,400+ Nigerian patients",
    ratingScore: "4.9 / 5",
    statBadgeTitle: "18kg",
    statBadgeSubtitle: "in 4 months",
  },
  products: [
    {
      id: "mounjaro-2-5mg",
      dose: "2.5mg",
      tag: "Starter Dose",
      desc: "Perfect for beginners easing into treatment.",
      price: "₦500,000",
      bullets: ["Helps control appetite", "Reduces cravings", "Supports gradual weight loss"],
    },
    {
      id: "mounjaro-5mg",
      dose: "5mg",
      tag: "Most Popular",
      desc: "Our most requested dose for steady, visible results.",
      price: "₦650,000",
      bullets: ["Enhanced appetite suppression", "Improved blood sugar control", "Stronger weight-loss support"],
      featured: true,
    },
    {
      id: "mounjaro-7-5mg",
      dose: "7.5mg",
      tag: "Continued Progress",
      desc: "Step up when your body is ready for more.",
      price: "₦750,000",
      bullets: ["Supports ongoing fat loss", "Helps maintain consistency", "Increased effectiveness"],
    },
    {
      id: "mounjaro-10mg",
      dose: "10mg",
      tag: "Advanced Support",
      desc: "Maximum support for committed transformation.",
      price: "₦820,000",
      bullets: ["Strong appetite control", "Continued metabolic improvement", "Sustained weight management"],
    },
    {
      id: "mounjaro-12-5mg",
      dose: "12.5mg",
      tag: "Peak Progress",
      desc: "For patients titrating toward their target dose.",
      price: "₦1,000,000",
      bullets: ["Deep appetite regulation", "Accelerated fat-loss support", "Ideal for long-term maintenance prep"],
    },
    {
      id: "mounjaro-15mg",
      dose: "15mg",
      tag: "Maximum Strength",
      desc: "The highest available dose for eligible patients.",
      price: "₦1,080,000",
      bullets: ["Maximum GLP-1 support", "Best for sustained results", "Requires clinical clearance"],
    },
  ],
  compoundedProducts: [
    {
      id: "compounded-10mg",
      total: "10mg",
      price: "₦300,000",
      breakdown: "4 doses of 2.5mg",
      desc: "An affordable entry point for compounded tirzepatide treatment.",
      bullets: ["Weekly dosing over 4 weeks", "Ideal for starting titration", "Pharmacy-compounded quality"],
    },
    {
      id: "compounded-20mg",
      total: "20mg",
      price: "₦350,000",
      breakdown: "4 doses of 5mg",
      desc: "Step up your compounded programme with a stronger weekly dose.",
      bullets: ["Enhanced appetite control", "Steady weekly progression", "Cost-effective option"],
    },
    {
      id: "compounded-30mg",
      total: "30mg",
      price: "₦360,000",
      breakdown: "4 doses of 7.5mg",
      desc: "Mid-tier compounded support for ongoing weight-loss progress.",
      bullets: ["Stronger metabolic support", "4-week supply included", "Suitable for titration phase"],
    },
    {
      id: "compounded-40mg",
      total: "40mg",
      price: "₦400,000",
      breakdown: "4 doses of 10mg",
      desc: "Advanced compounded dosing for patients ready for more.",
      bullets: ["High-strength weekly doses", "Sustained appetite suppression", "Full 4-week course"],
    },
    {
      id: "compounded-50mg",
      total: "50mg",
      price: "₦430,000",
      breakdown: "4 doses of 12.5mg",
      desc: "Near-maximum compounded strength for eligible patients.",
      bullets: ["Peak-tier weekly dosing", "Supports long-term results", "Requires clinical clearance"],
    },
    {
      id: "compounded-60mg",
      total: "60mg",
      price: "₦470,000",
      breakdown: "4 doses of 15mg",
      desc: "The highest compounded tirzepatide option we offer.",
      bullets: ["Maximum weekly dose strength", "Best for maintenance phase", "Dispensed after assessment"],
    },
  ],
  faq: [
    {
      id: "faq-1",
      q: "Is Mounjaro approved for use in Nigeria?",
      a: "Mounjaro® (tirzepatide) is a prescription medication used worldwide under medical supervision. We dispense only through licensed medical assessment and verified supply channels.",
    },
    {
      id: "faq-2",
      q: "How much weight can I realistically lose?",
      a: "Clinical data shows most patients lose 10–20% of their body weight when treatment is combined with nutrition and lifestyle support. Your doctor will set realistic targets for you.",
    },
    {
      id: "faq-3",
      q: "Do I need a consultation before ordering?",
      a: "Yes. Every patient undergoes a confidential medical assessment so we can confirm Mounjaro is safe and appropriate for you, and plan your starting dose.",
    },
    {
      id: "faq-4",
      q: "How is the medication delivered?",
      a: "Cold-chain courier delivery nationwide, in discreet packaging. Lagos and Abuja typically receive same-day or next-day delivery.",
    },
    {
      id: "faq-5",
      q: "What payment methods do you accept?",
      a: "Bank transfer, debit/credit card, and selected instalment options. Payment details are shared after your consultation.",
    },
  ],
};

const STORAGE_KEY = "bodyzenith_site_config";
const CONFIG_CHANGE_EVENT = "bodyzenith_config_updated";

export function getSiteConfig(): SiteConfig {
  if (typeof window === "undefined") {
    return defaultConfig;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultConfig;
    const parsed = JSON.parse(raw);
    return {
      ...defaultConfig,
      ...parsed,
      seo: { ...defaultConfig.seo, ...parsed.seo },
      tracking: { ...defaultConfig.tracking, ...parsed.tracking },
      contact: { ...defaultConfig.contact, ...parsed.contact },
      hero: { ...defaultConfig.hero, ...parsed.hero },
      products: parsed.products || defaultConfig.products,
      compoundedProducts: parsed.compoundedProducts || defaultConfig.compoundedProducts,
      faq: parsed.faq || defaultConfig.faq,
    };
  } catch (e) {
    console.error("Error reading site config from localStorage:", e);
    return defaultConfig;
  }
}

export function saveSiteConfig(newConfig: SiteConfig): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newConfig));
    window.dispatchEvent(new CustomEvent(CONFIG_CHANGE_EVENT, { detail: newConfig }));
  } catch (e) {
    console.error("Error saving site config to localStorage:", e);
  }
}

export function resetSiteConfig(): SiteConfig {
  if (typeof window === "undefined") return defaultConfig;
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent(CONFIG_CHANGE_EVENT, { detail: defaultConfig }));
  } catch (e) {
    console.error("Error resetting site config:", e);
  }
  return defaultConfig;
}

export function subscribeToConfigChange(callback: (config: SiteConfig) => void): () => void {
  if (typeof window === "undefined") return () => {};

  const handleCustomEvent = (e: Event) => {
    const customEvent = e as CustomEvent<SiteConfig>;
    if (customEvent.detail) {
      callback(customEvent.detail);
    } else {
      callback(getSiteConfig());
    }
  };

  const handleStorageEvent = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      callback(getSiteConfig());
    }
  };

  window.addEventListener(CONFIG_CHANGE_EVENT, handleCustomEvent);
  window.addEventListener("storage", handleStorageEvent);

  return () => {
    window.removeEventListener(CONFIG_CHANGE_EVENT, handleCustomEvent);
    window.removeEventListener("storage", handleStorageEvent);
  };
}
