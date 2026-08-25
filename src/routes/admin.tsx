import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { useSiteConfig } from "@/components/SiteConfigContext";
import type { SiteConfig, FaqItem } from "@/lib/site-config";
import logoImg from "@/assets/ope14.jpeg";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Wellness Journey" },
      { name: "description", content: "Admin dashboard for content, SEO, and tracking script management." },
    ],
  }),
  component: AdminPage,
});

const AUTH_KEY = "bodyzenith_admin_auth";

interface ValidationErrors {
  [key: string]: string;
}

function isValidUrlOrPath(val: string): boolean {
  if (!val.trim()) return true;
  if (val.startsWith("/") || val.startsWith("#")) return true;
  try {
    const url = new URL(val.startsWith("wa.me") ? `https://${val}` : val);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function validateConfig(config: SiteConfig): ValidationErrors {
  const errors: ValidationErrors = {};

  // Contact Links
  if (!config.contact.phone.trim()) {
    errors["contact.phone"] = "Display Phone Number is required.";
  }
  if (!config.contact.phoneIntl.trim()) {
    errors["contact.phoneIntl"] = "International Phone Number is required.";
  }
  if (config.contact.whatsappUrl && !isValidUrlOrPath(config.contact.whatsappUrl)) {
    errors["contact.whatsappUrl"] = "Invalid URL. Must start with http://, https://, or wa.me/";
  }
  if (config.contact.instagramUrl && !isValidUrlOrPath(config.contact.instagramUrl)) {
    errors["contact.instagramUrl"] = "Invalid Instagram URL format.";
  }
  if (config.contact.mapsUrl && !isValidUrlOrPath(config.contact.mapsUrl)) {
    errors["contact.mapsUrl"] = "Invalid Google Maps URL format.";
  }

  // Hero Section
  if (!config.hero.headline.trim()) {
    errors["hero.headline"] = "Main Headline is required.";
  }
  if (!config.hero.primaryCtaText.trim()) {
    errors["hero.primaryCtaText"] = "Primary CTA Text is required.";
  }
  if (config.hero.primaryCtaUrl && !isValidUrlOrPath(config.hero.primaryCtaUrl)) {
    errors["hero.primaryCtaUrl"] = "Invalid CTA Link target format.";
  }

  // Products
  config.products.forEach((p, idx) => {
    if (!p.price.trim()) {
      errors[`products.${idx}.price`] = `Price for dose ${p.dose} is required.`;
    }
  });

  // FAQ
  config.faq.forEach((item, idx) => {
    if (!item.q.trim()) {
      errors[`faq.${idx}.q`] = `Question #${idx + 1} title cannot be empty.`;
    }
    if (!item.a.trim()) {
      errors[`faq.${idx}.a`] = `Answer #${idx + 1} content cannot be empty.`;
    }
  });

  // SEO & Brand
  if (!config.seo.title.trim()) {
    errors["seo.title"] = "SEO Title Tag is required.";
  }
  if (!config.seo.description.trim()) {
    errors["seo.description"] = "SEO Meta Description is required.";
  }
  if (config.seo.faviconUrl && !isValidUrlOrPath(config.seo.faviconUrl)) {
    errors["seo.faviconUrl"] = "Favicon URL must be a valid http://, https://, or relative path.";
  }
  if (config.seo.ogImageUrl && !isValidUrlOrPath(config.seo.ogImageUrl)) {
    errors["seo.ogImageUrl"] = "Social Media Thumbnail URL must be a valid http://, https://, or relative path.";
  }

  // Marketing & Tracking IDs
  if (config.tracking.googleTagManagerId.trim()) {
    const gtmId = config.tracking.googleTagManagerId.trim();
    if (!/^(GTM-[A-Z0-9]+|G-[A-Z0-9]+|UA-\d+-\d+)$/i.test(gtmId)) {
      errors["tracking.googleTagManagerId"] = "Format must match GTM-XXXXXXX or G-XXXXXXX or UA-XXXXX-X";
    }
  }

  if (config.tracking.facebookPixelId.trim()) {
    const fbId = config.tracking.facebookPixelId.trim();
    if (!/^\d+$/.test(fbId)) {
      errors["tracking.facebookPixelId"] = "Facebook Pixel ID must contain numbers only.";
    }
  }

  if (config.tracking.tiktokPixelId.trim()) {
    const ttId = config.tracking.tiktokPixelId.trim();
    if (!/^[A-Za-z0-9]+$/.test(ttId)) {
      errors["tracking.tiktokPixelId"] = "TikTok Pixel ID must be alphanumeric.";
    }
  }

  return errors;
}

function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");

  const { config, updateConfig, resetConfig } = useSiteConfig();
  const [formData, setFormData] = useState<SiteConfig>(config);
  const [activeTab, setActiveTab] = useState<"copy" | "seo" | "tracking">("copy");

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [saveSuccessModal, setSaveSuccessModal] = useState<boolean>(false);
  const [lastSavedTimestamp, setLastSavedTimestamp] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const auth = sessionStorage.getItem(AUTH_KEY) || localStorage.getItem(AUTH_KEY);
      if (auth === "true") {
        setIsAuthenticated(true);
      }
    }
  }, []);

  useEffect(() => {
    setFormData(config);
  }, [config]);

  // Check for unsaved changes
  const isDirty = useMemo(() => {
    return JSON.stringify(formData) !== JSON.stringify(config);
  }, [formData, config]);

  // Count tab-specific errors
  const copyErrorsCount = useMemo(() => {
    return Object.keys(errors).filter(
      (k) => k.startsWith("contact.") || k.startsWith("hero.") || k.startsWith("products.") || k.startsWith("faq.")
    ).length;
  }, [errors]);

  const seoErrorsCount = useMemo(() => {
    return Object.keys(errors).filter((k) => k.startsWith("seo.")).length;
  }, [errors]);

  const trackingErrorsCount = useMemo(() => {
    return Object.keys(errors).filter((k) => k.startsWith("tracking.")).length;
  }, [errors]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameInput.trim() === "admin" && passwordInput === "$Admin4lyf") {
      setIsAuthenticated(true);
      setLoginError("");
      sessionStorage.setItem(AUTH_KEY, "true");
    } else {
      setLoginError("Invalid username or password. Please try again.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(AUTH_KEY);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Perform strict input validation
    const validationErrors = validateConfig(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      // Switch tab to first tab containing error
      if (copyErrorsCount > 0) setActiveTab("copy");
      else if (seoErrorsCount > 0) setActiveTab("seo");
      else if (trackingErrorsCount > 0) setActiveTab("tracking");

      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // 2. Clear errors and apply updates
    setErrors({});
    updateConfig(formData);

    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    setLastSavedTimestamp(now);
    setSaveSuccessModal(true);
  };

  const handleReset = () => {
    resetConfig();
    setShowResetConfirm(false);
    setErrors({});
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    setLastSavedTimestamp(now);
    setSaveSuccessModal(true);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-emerald-deep text-cream flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-card text-foreground rounded-3xl p-8 shadow-2xl border border-gold/30">
          <div className="flex flex-col items-center text-center mb-8">
            <img src={logoImg} alt="Wellness Journey Logo" className="h-16 w-16 object-contain mb-3" />
            <h1 className="font-display text-3xl font-bold text-primary">Admin Access</h1>
            <p className="text-sm text-muted-foreground mt-1">Sign in to manage site content, SEO, & tracking</p>
          </div>

          {loginError && (
            <div className="mb-6 rounded-xl bg-destructive/10 border border-destructive/30 p-4 text-xs text-destructive font-medium">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs uppercase tracking-wider font-medium text-muted-foreground mb-1.5">
                Username
              </label>
              <input
                type="text"
                required
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="Enter admin username"
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-medium text-muted-foreground mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter password"
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:border-gold"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-full bg-gold py-3.5 text-sm font-semibold uppercase tracking-wider text-gold-foreground shadow-gold hover:opacity-90 transition"
            >
              Sign In to Dashboard
            </button>
          </form>

          <div className="mt-8 text-center border-t border-border pt-4">
            <Link to="/" className="text-xs text-muted-foreground hover:text-gold transition">
              ← Return to Main Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logoImg} alt="Logo" className="h-10 w-10 object-contain" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-xl font-bold text-primary">Site Management Dashboard</h1>
                {isDirty && (
                  <span className="rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/30 px-2.5 py-0.5 text-[10px] font-bold uppercase">
                    Unsaved Edits
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Wellness Journey Nigeria Admin
                {lastSavedTimestamp && <span className="ml-2 text-emerald-600 font-medium">· Last validated & saved at {lastSavedTimestamp}</span>}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              target="_blank"
              className="rounded-full border border-border px-4 py-2 text-xs font-medium text-foreground hover:bg-accent transition"
            >
              View Live Website ↗
            </Link>
            <button
              onClick={handleLogout}
              className="rounded-full bg-destructive/10 text-destructive border border-destructive/20 px-4 py-2 text-xs font-medium hover:bg-destructive/20 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main content area */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        {/* Validation Errors Alert Banner */}
        {Object.keys(errors).length > 0 && (
          <div className="mb-6 rounded-2xl bg-destructive/10 border border-destructive/30 p-5 text-destructive shadow-sm">
            <div className="flex items-center gap-2 font-semibold text-base mb-2">
              <span>⚠️</span> Cannot Save: Validation Errors Found ({Object.keys(errors).length})
            </div>
            <p className="text-xs opacity-90 mb-3">Please fix the highlighted errors below before saving changes:</p>
            <ul className="list-disc list-inside space-y-1 text-xs font-medium">
              {Object.entries(errors).map(([key, msg]) => (
                <li key={key}>{msg}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex border-b border-border mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab("copy")}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition whitespace-nowrap flex items-center gap-2 ${
              activeTab === "copy"
                ? "border-gold text-primary font-semibold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>📝 Copy & Links</span>
            {copyErrorsCount > 0 && (
              <span className="rounded-full bg-destructive text-destructive-foreground px-2 py-0.5 text-[10px] font-bold">
                {copyErrorsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("seo")}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition whitespace-nowrap flex items-center gap-2 ${
              activeTab === "seo"
                ? "border-gold text-primary font-semibold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>🔍 Brand & SEO Settings</span>
            {seoErrorsCount > 0 && (
              <span className="rounded-full bg-destructive text-destructive-foreground px-2 py-0.5 text-[10px] font-bold">
                {seoErrorsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("tracking")}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition whitespace-nowrap flex items-center gap-2 ${
              activeTab === "tracking"
                ? "border-gold text-primary font-semibold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>📊 Marketing & Tracking Scripts</span>
            {trackingErrorsCount > 0 && (
              <span className="rounded-full bg-destructive text-destructive-foreground px-2 py-0.5 text-[10px] font-bold">
                {trackingErrorsCount}
              </span>
            )}
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-8">
          {/* TAB 1: SITE COPY & LINKS */}
          {activeTab === "copy" && (
            <div className="space-y-8">
              {/* Contact Information & Links */}
              <div className="rounded-3xl border border-border bg-card p-6 shadow-luxe">
                <h2 className="font-display text-2xl text-primary font-semibold mb-4">Contact Information & Links</h2>
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">
                      Display Phone Number *
                    </label>
                    <input
                      type="text"
                      value={formData.contact.phone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contact: { ...formData.contact, phone: e.target.value },
                        })
                      }
                      className={`w-full rounded-xl border bg-background px-4 py-2.5 text-sm focus:outline-none ${
                        errors["contact.phone"] ? "border-destructive focus:border-destructive" : "border-input focus:border-gold"
                      }`}
                    />
                    {errors["contact.phone"] && <p className="text-[11px] text-destructive mt-1">{errors["contact.phone"]}</p>}
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">
                      International Phone Number (for tel: link) *
                    </label>
                    <input
                      type="text"
                      value={formData.contact.phoneIntl}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contact: { ...formData.contact, phoneIntl: e.target.value },
                        })
                      }
                      className={`w-full rounded-xl border bg-background px-4 py-2.5 text-sm focus:outline-none ${
                        errors["contact.phoneIntl"] ? "border-destructive focus:border-destructive" : "border-input focus:border-gold"
                      }`}
                    />
                    {errors["contact.phoneIntl"] && <p className="text-[11px] text-destructive mt-1">{errors["contact.phoneIntl"]}</p>}
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">
                      WhatsApp Chat Link / URL
                    </label>
                    <input
                      type="text"
                      value={formData.contact.whatsappUrl}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contact: { ...formData.contact, whatsappUrl: e.target.value },
                        })
                      }
                      placeholder="https://wa.me/2347036809459"
                      className={`w-full rounded-xl border bg-background px-4 py-2.5 text-sm focus:outline-none ${
                        errors["contact.whatsappUrl"] ? "border-destructive focus:border-destructive" : "border-input focus:border-gold"
                      }`}
                    />
                    {errors["contact.whatsappUrl"] && <p className="text-[11px] text-destructive mt-1">{errors["contact.whatsappUrl"]}</p>}
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">
                      Instagram Profile URL
                    </label>
                    <input
                      type="text"
                      value={formData.contact.instagramUrl}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contact: { ...formData.contact, instagramUrl: e.target.value },
                        })
                      }
                      placeholder="https://www.instagram.com/wellnessjourneyltd/"
                      className={`w-full rounded-xl border bg-background px-4 py-2.5 text-sm focus:outline-none ${
                        errors["contact.instagramUrl"] ? "border-destructive focus:border-destructive" : "border-input focus:border-gold"
                      }`}
                    />
                    {errors["contact.instagramUrl"] && <p className="text-[11px] text-destructive mt-1">{errors["contact.instagramUrl"]}</p>}
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">
                      Google Maps Link
                    </label>
                    <input
                      type="text"
                      value={formData.contact.mapsUrl}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contact: { ...formData.contact, mapsUrl: e.target.value },
                        })
                      }
                      placeholder="https://maps.app.goo.gl/..."
                      className={`w-full rounded-xl border bg-background px-4 py-2.5 text-sm focus:outline-none ${
                        errors["contact.mapsUrl"] ? "border-destructive focus:border-destructive" : "border-input focus:border-gold"
                      }`}
                    />
                    {errors["contact.mapsUrl"] && <p className="text-[11px] text-destructive mt-1">{errors["contact.mapsUrl"]}</p>}
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">
                      Location Name / Text
                    </label>
                    <input
                      type="text"
                      value={formData.contact.locationText}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contact: { ...formData.contact, locationText: e.target.value },
                        })
                      }
                      className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:border-gold"
                    />
                  </div>
                </div>
              </div>

              {/* Hero Section Copy */}
              <div className="rounded-3xl border border-border bg-card p-6 shadow-luxe">
                <h2 className="font-display text-2xl text-primary font-semibold mb-4">Hero Banner Copy</h2>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">
                        Hero Tag Badge
                      </label>
                      <input
                        type="text"
                        value={formData.hero.badge}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            hero: { ...formData.hero, badge: e.target.value },
                          })
                        }
                        className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:border-gold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">
                        Highlighted Accent Word
                      </label>
                      <input
                        type="text"
                        value={formData.hero.headlineItalic}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            hero: { ...formData.hero, headlineItalic: e.target.value },
                          })
                        }
                        className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:border-gold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">
                      Main Headline *
                    </label>
                    <input
                      type="text"
                      value={formData.hero.headline}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hero: { ...formData.hero, headline: e.target.value },
                        })
                      }
                      className={`w-full rounded-xl border bg-background px-4 py-2.5 text-sm focus:outline-none ${
                        errors["hero.headline"] ? "border-destructive focus:border-destructive" : "border-input focus:border-gold"
                      }`}
                    />
                    {errors["hero.headline"] && <p className="text-[11px] text-destructive mt-1">{errors["hero.headline"]}</p>}
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">
                      Subheadline / Description
                    </label>
                    <textarea
                      rows={3}
                      value={formData.hero.subheadline}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hero: { ...formData.hero, subheadline: e.target.value },
                        })
                      }
                      className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:border-gold"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">
                        Primary CTA Button Text *
                      </label>
                      <input
                        type="text"
                        value={formData.hero.primaryCtaText}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            hero: { ...formData.hero, primaryCtaText: e.target.value },
                          })
                        }
                        className={`w-full rounded-xl border bg-background px-4 py-2.5 text-sm focus:outline-none ${
                          errors["hero.primaryCtaText"] ? "border-destructive focus:border-destructive" : "border-input focus:border-gold"
                        }`}
                      />
                      {errors["hero.primaryCtaText"] && <p className="text-[11px] text-destructive mt-1">{errors["hero.primaryCtaText"]}</p>}
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">
                        Primary CTA Button Link Target
                      </label>
                      <input
                        type="text"
                        value={formData.hero.primaryCtaUrl}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            hero: { ...formData.hero, primaryCtaUrl: e.target.value },
                          })
                        }
                        className={`w-full rounded-xl border bg-background px-4 py-2.5 text-sm focus:outline-none ${
                          errors["hero.primaryCtaUrl"] ? "border-destructive focus:border-destructive" : "border-input focus:border-gold"
                        }`}
                      />
                      {errors["hero.primaryCtaUrl"] && <p className="text-[11px] text-destructive mt-1">{errors["hero.primaryCtaUrl"]}</p>}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">
                        Rating Text
                      </label>
                      <input
                        type="text"
                        value={formData.hero.ratingText}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            hero: { ...formData.hero, ratingText: e.target.value },
                          })
                        }
                        className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:border-gold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">
                        Stat Badge Title / Weight Loss
                      </label>
                      <input
                        type="text"
                        value={formData.hero.statBadgeTitle}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            hero: { ...formData.hero, statBadgeTitle: e.target.value },
                          })
                        }
                        className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:border-gold"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Mounjaro Products Prices & Copy */}
              <div className="rounded-3xl border border-border bg-card p-6 shadow-luxe">
                <h2 className="font-display text-2xl text-primary font-semibold mb-4">Mounjaro Doses & Prices</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {formData.products.map((p, idx) => (
                    <div key={p.id} className="rounded-2xl border border-border p-4 bg-background">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-display font-bold text-lg text-primary">Dose: {p.dose}</span>
                        <input
                          type="text"
                          value={p.tag}
                          onChange={(e) => {
                            const updated = [...formData.products];
                            updated[idx].tag = e.target.value;
                            setFormData({ ...formData, products: updated });
                          }}
                          placeholder="Tag"
                          className="text-xs border rounded-lg px-2 py-1 w-28 bg-card text-right font-medium"
                        />
                      </div>

                      <div className="space-y-3 mt-3">
                        <div>
                          <label className="block text-[10px] uppercase text-muted-foreground mb-0.5">Price *</label>
                          <input
                            type="text"
                            value={p.price}
                            onChange={(e) => {
                              const updated = [...formData.products];
                              updated[idx].price = e.target.value;
                              setFormData({ ...formData, products: updated });
                            }}
                            className={`w-full rounded-lg border px-3 py-1.5 text-sm font-semibold text-primary focus:outline-none ${
                              errors[`products.${idx}.price`] ? "border-destructive" : "border-input focus:border-gold"
                            }`}
                          />
                          {errors[`products.${idx}.price`] && (
                            <p className="text-[10px] text-destructive mt-0.5">{errors[`products.${idx}.price`]}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase text-muted-foreground mb-0.5">Description</label>
                          <textarea
                            rows={2}
                            value={p.desc}
                            onChange={(e) => {
                              const updated = [...formData.products];
                              updated[idx].desc = e.target.value;
                              setFormData({ ...formData, products: updated });
                            }}
                            className="w-full rounded-lg border px-3 py-1.5 text-xs text-foreground"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQ Editor */}
              <div className="rounded-3xl border border-border bg-card p-6 shadow-luxe">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display text-2xl text-primary font-semibold">Frequently Asked Questions</h2>
                  <button
                    type="button"
                    onClick={() => {
                      const newFaq: FaqItem = {
                        id: `faq-${Date.now()}`,
                        q: "New Question Title",
                        a: "Answer content goes here.",
                      };
                      setFormData({ ...formData, faq: [...formData.faq, newFaq] });
                    }}
                    className="rounded-full bg-gold/20 text-gold-foreground border border-gold/40 px-4 py-1.5 text-xs font-semibold hover:bg-gold/30 transition"
                  >
                    + Add New FAQ
                  </button>
                </div>

                <div className="space-y-4">
                  {formData.faq.map((item, idx) => (
                    <div key={item.id} className="rounded-2xl border border-border p-4 bg-background">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs uppercase font-bold text-gold">Question #{idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = formData.faq.filter((_, i) => i !== idx);
                            setFormData({ ...formData, faq: updated });
                          }}
                          className="text-xs text-destructive hover:underline"
                        >
                          Delete FAQ
                        </button>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <input
                            type="text"
                            value={item.q}
                            onChange={(e) => {
                              const updated = [...formData.faq];
                              updated[idx].q = e.target.value;
                              setFormData({ ...formData, faq: updated });
                            }}
                            placeholder="Question Title *"
                            className={`w-full rounded-lg border px-3 py-2 text-sm font-medium ${
                              errors[`faq.${idx}.q`] ? "border-destructive" : "border-input"
                            }`}
                          />
                          {errors[`faq.${idx}.q`] && <p className="text-[10px] text-destructive mt-0.5">{errors[`faq.${idx}.q`]}</p>}
                        </div>

                        <div>
                          <textarea
                            rows={2}
                            value={item.a}
                            onChange={(e) => {
                              const updated = [...formData.faq];
                              updated[idx].a = e.target.value;
                              setFormData({ ...formData, faq: updated });
                            }}
                            placeholder="Answer Content *"
                            className={`w-full rounded-lg border px-3 py-2 text-xs ${
                              errors[`faq.${idx}.a`] ? "border-destructive" : "border-input"
                            }`}
                          />
                          {errors[`faq.${idx}.a`] && <p className="text-[10px] text-destructive mt-0.5">{errors[`faq.${idx}.a`]}</p>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BRAND & SEO */}
          {activeTab === "seo" && (
            <div className="rounded-3xl border border-border bg-card p-6 shadow-luxe space-y-6">
              <div>
                <h2 className="font-display text-2xl text-primary font-semibold">Brand Assets & Meta Tags</h2>
                <p className="text-xs text-muted-foreground mt-1">Configure site icons, search engine indexing headers, and social media thumbnails.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">
                    Favicon Image URL
                  </label>
                  <input
                    type="text"
                    value={formData.seo.faviconUrl}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        seo: { ...formData.seo, faviconUrl: e.target.value },
                      })
                    }
                    placeholder="https://example.com/favicon.ico"
                    className={`w-full rounded-xl border bg-background px-4 py-2.5 text-sm focus:outline-none ${
                      errors["seo.faviconUrl"] ? "border-destructive focus:border-destructive" : "border-input focus:border-gold"
                    }`}
                  />
                  {errors["seo.faviconUrl"] && <p className="text-[11px] text-destructive mt-1">{errors["seo.faviconUrl"]}</p>}
                  <p className="text-[11px] text-muted-foreground mt-1">Direct URL to .ico, .png, or .svg icon.</p>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">
                    Social Media Thumbnail (OG Image URL)
                  </label>
                  <input
                    type="text"
                    value={formData.seo.ogImageUrl}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        seo: { ...formData.seo, ogImageUrl: e.target.value },
                      })
                    }
                    placeholder="https://example.com/og-image.jpg"
                    className={`w-full rounded-xl border bg-background px-4 py-2.5 text-sm focus:outline-none ${
                      errors["seo.ogImageUrl"] ? "border-destructive focus:border-destructive" : "border-input focus:border-gold"
                    }`}
                  />
                  {errors["seo.ogImageUrl"] && <p className="text-[11px] text-destructive mt-1">{errors["seo.ogImageUrl"]}</p>}
                  <p className="text-[11px] text-muted-foreground mt-1">Image shown when sharing links on WhatsApp, Twitter, FB.</p>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-border">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">
                    SEO Title Tag *
                  </label>
                  <input
                    type="text"
                    value={formData.seo.title}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        seo: { ...formData.seo, title: e.target.value },
                      })
                    }
                    className={`w-full rounded-xl border bg-background px-4 py-2.5 text-sm focus:outline-none ${
                      errors["seo.title"] ? "border-destructive focus:border-destructive" : "border-input focus:border-gold"
                    }`}
                  />
                  {errors["seo.title"] && <p className="text-[11px] text-destructive mt-1">{errors["seo.title"]}</p>}
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">
                    SEO Meta Description *
                  </label>
                  <textarea
                    rows={3}
                    value={formData.seo.description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        seo: { ...formData.seo, description: e.target.value },
                      })
                    }
                    className={`w-full rounded-xl border bg-background px-4 py-2.5 text-sm focus:outline-none ${
                      errors["seo.description"] ? "border-destructive focus:border-destructive" : "border-input focus:border-gold"
                    }`}
                  />
                  {errors["seo.description"] && <p className="text-[11px] text-destructive mt-1">{errors["seo.description"]}</p>}
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">
                    SEO Keywords (Comma Separated)
                  </label>
                  <input
                    type="text"
                    value={formData.seo.keywords}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        seo: { ...formData.seo, keywords: e.target.value },
                      })
                    }
                    className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:border-gold"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">
                      OpenGraph Title (Social Media)
                    </label>
                    <input
                      type="text"
                      value={formData.seo.ogTitle}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          seo: { ...formData.seo, ogTitle: e.target.value },
                        })
                      }
                      className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:border-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">
                      OpenGraph Description (Social Media)
                    </label>
                    <input
                      type="text"
                      value={formData.seo.ogDescription}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          seo: { ...formData.seo, ogDescription: e.target.value },
                        })
                      }
                      className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:border-gold"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MARKETING & TRACKING */}
          {activeTab === "tracking" && (
            <div className="rounded-3xl border border-border bg-card p-6 shadow-luxe space-y-6">
              <div>
                <h2 className="font-display text-2xl text-primary font-semibold">Marketing & Tracking Scripts</h2>
                <p className="text-xs text-muted-foreground mt-1">Insert container IDs or raw custom JavaScript tags for marketing platforms like Google, Facebook, & TikTok.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">
                    Google Tag Manager / GA4 ID
                  </label>
                  <input
                    type="text"
                    value={formData.tracking.googleTagManagerId}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tracking: { ...formData.tracking, googleTagManagerId: e.target.value },
                      })
                    }
                    placeholder="GTM-XXXXXXX or G-XXXXXXX"
                    className={`w-full rounded-xl border bg-background px-4 py-2.5 text-sm font-mono focus:outline-none ${
                      errors["tracking.googleTagManagerId"] ? "border-destructive focus:border-destructive" : "border-input focus:border-gold"
                    }`}
                  />
                  {errors["tracking.googleTagManagerId"] && (
                    <p className="text-[11px] text-destructive mt-1">{errors["tracking.googleTagManagerId"]}</p>
                  )}
                  <p className="text-[11px] text-muted-foreground mt-1">Automatically loads Google Tag Manager or GA4 snippet.</p>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">
                    Facebook Pixel ID
                  </label>
                  <input
                    type="text"
                    value={formData.tracking.facebookPixelId}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tracking: { ...formData.tracking, facebookPixelId: e.target.value },
                      })
                    }
                    placeholder="123456789012345"
                    className={`w-full rounded-xl border bg-background px-4 py-2.5 text-sm font-mono focus:outline-none ${
                      errors["tracking.facebookPixelId"] ? "border-destructive focus:border-destructive" : "border-input focus:border-gold"
                    }`}
                  />
                  {errors["tracking.facebookPixelId"] && (
                    <p className="text-[11px] text-destructive mt-1">{errors["tracking.facebookPixelId"]}</p>
                  )}
                  <p className="text-[11px] text-muted-foreground mt-1">Loads Meta Pixel snippet & tracks PageView events.</p>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">
                    TikTok Pixel ID
                  </label>
                  <input
                    type="text"
                    value={formData.tracking.tiktokPixelId}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tracking: { ...formData.tracking, tiktokPixelId: e.target.value },
                      })
                    }
                    placeholder="C1234567890"
                    className={`w-full rounded-xl border bg-background px-4 py-2.5 text-sm font-mono focus:outline-none ${
                      errors["tracking.tiktokPixelId"] ? "border-destructive focus:border-destructive" : "border-input focus:border-gold"
                    }`}
                  />
                  {errors["tracking.tiktokPixelId"] && (
                    <p className="text-[11px] text-destructive mt-1">{errors["tracking.tiktokPixelId"]}</p>
                  )}
                  <p className="text-[11px] text-muted-foreground mt-1">Loads TikTok Pixel SDK and tracks PageView.</p>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-border">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">
                    Custom Head HTML / Scripts
                  </label>
                  <textarea
                    rows={4}
                    value={formData.tracking.customHeadScripts}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tracking: { ...formData.tracking, customHeadScripts: e.target.value },
                      })
                    }
                    placeholder="<script>/* custom tracking script for <head> */</script>"
                    className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-xs font-mono focus:border-gold"
                  />
                  <p className="text-[11px] text-muted-foreground mt-1">Injected directly into document &lt;head&gt;.</p>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">
                    Custom Body HTML / Scripts
                  </label>
                  <textarea
                    rows={4}
                    value={formData.tracking.customBodyScripts}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tracking: { ...formData.tracking, customBodyScripts: e.target.value },
                      })
                    }
                    placeholder="<script>/* custom tracking script for <body> */</script>"
                    className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-xs font-mono focus:border-gold"
                  />
                  <p className="text-[11px] text-muted-foreground mt-1">Injected at the end of document &lt;body&gt;.</p>
                </div>
              </div>
            </div>
          )}

          {/* Action Footer */}
          <div className="flex items-center justify-between pt-6 border-t border-border">
            <button
              type="button"
              onClick={() => setShowResetConfirm(true)}
              className="rounded-full border border-destructive/30 bg-destructive/5 text-destructive px-5 py-2.5 text-xs font-semibold hover:bg-destructive/10 transition"
            >
              Reset to Defaults
            </button>

            <div className="flex items-center gap-4">
              {isDirty && (
                <span className="text-xs text-amber-600 font-medium">⚠️ Unsaved changes pending</span>
              )}
              <button
                type="submit"
                className="rounded-full bg-gold px-8 py-3.5 text-sm font-semibold uppercase tracking-wider text-gold-foreground shadow-gold hover:opacity-90 transition flex items-center gap-2"
              >
                <span>Save All Changes</span>
              </button>
            </div>
          </div>
        </form>

        {/* Save Confirmation Success Modal */}
        {saveSuccessModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-card rounded-3xl p-6 border border-gold/40 shadow-2xl text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-deep text-gold flex items-center justify-center text-3xl mx-auto mb-4 border border-gold/40">
                ✓
              </div>
              <h3 className="font-display text-2xl font-bold text-primary mb-2">Updates Validated & Saved!</h3>
              <p className="text-sm text-muted-foreground mb-6">
                All site modifications, SEO settings, and tracking scripts have been validated and saved successfully. The live website is updated.
              </p>
              <div className="text-xs text-emerald-600 font-medium mb-6 bg-emerald-500/10 py-2 rounded-xl border border-emerald-500/20">
                Validated at {lastSavedTimestamp}
              </div>
              <button
                type="button"
                onClick={() => setSaveSuccessModal(false)}
                className="w-full rounded-full bg-gold py-3 text-xs font-semibold uppercase tracking-wider text-gold-foreground hover:opacity-90 transition"
              >
                Continue Editing
              </button>
            </div>
          </div>
        )}

        {/* Reset Confirmation Modal */}
        {showResetConfirm && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-card rounded-3xl p-6 border border-border shadow-2xl">
              <h3 className="font-display text-xl font-bold text-primary mb-2">Reset Site Settings?</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Are you sure you want to restore original default copy, prices, SEO settings, and links? Custom changes will be cleared.
              </p>
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(false)}
                  className="rounded-full border border-border px-4 py-2 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="rounded-full bg-destructive text-destructive-foreground px-4 py-2 text-xs font-semibold"
                >
                  Confirm Reset
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
