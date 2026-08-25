import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { useSiteConfig } from "@/components/SiteConfigContext";
import type { SiteConfig, FaqItem, HiddenSections } from "@/lib/site-config";
import logoImg from "@/assets/ope14.jpeg";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Wellness Journey" },
      { name: "description", content: "Comprehensive admin dashboard for site content, section visibility, SEO, and tracking script management." },
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

  if (!config.contact.phone.trim()) errors["contact.phone"] = "Display Phone Number is required.";
  if (!config.contact.phoneIntl.trim()) errors["contact.phoneIntl"] = "International Phone Number is required.";
  if (config.contact.whatsappUrl && !isValidUrlOrPath(config.contact.whatsappUrl)) {
    errors["contact.whatsappUrl"] = "Invalid WhatsApp URL.";
  }
  if (config.contact.instagramUrl && !isValidUrlOrPath(config.contact.instagramUrl)) {
    errors["contact.instagramUrl"] = "Invalid Instagram URL.";
  }
  if (config.contact.mapsUrl && !isValidUrlOrPath(config.contact.mapsUrl)) {
    errors["contact.mapsUrl"] = "Invalid Google Maps URL.";
  }

  if (!config.hero.headline.trim()) errors["hero.headline"] = "Hero Headline is required.";
  if (!config.seo.title.trim()) errors["seo.title"] = "SEO Title Tag is required.";
  if (!config.seo.description.trim()) errors["seo.description"] = "SEO Meta Description is required.";

  if (config.tracking.googleTagManagerId.trim()) {
    const gtmId = config.tracking.googleTagManagerId.trim();
    if (!/^(GTM-[A-Z0-9]+|G-[A-Z0-9]+|UA-\d+-\d+)$/i.test(gtmId)) {
      errors["tracking.googleTagManagerId"] = "Format must match GTM-XXXXXXX or G-XXXXXXX";
    }
  }

  return errors;
}

type TabType = "visibility" | "hero" | "pain_why" | "products" | "results_gallery" | "bmi_faq" | "seo" | "tracking";

function SectionToggle({
  label,
  hidden,
  onToggle,
}: {
  label: string;
  hidden?: boolean;
  onToggle: (hidden: boolean) => void;
}) {
  return (
    <div className={`flex items-center justify-between rounded-2xl px-4 py-3 border transition ${
      hidden ? "bg-amber-500/5 border-amber-500/30" : "bg-card border-border"
    }`}>
      <div className="flex items-center gap-2.5">
        <span className="text-lg">{hidden ? "🙈" : "👁"}</span>
        <div>
          <span className="text-xs font-bold text-primary block">{label}</span>
          <span className="text-[11px] text-muted-foreground">
            {hidden ? "Currently hidden from public visitors" : "Visible on live website"}
          </span>
        </div>
      </div>
      <button
        type="button"
        onClick={() => onToggle(!hidden)}
        className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition ${
          hidden
            ? "bg-amber-500/20 text-amber-700 border border-amber-500/40 hover:bg-amber-500/30"
            : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm"
        }`}
      >
        {hidden ? "Show Section" : "Hide Section"}
      </button>
    </div>
  );
}

function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");

  const { config, updateConfig, resetConfig } = useSiteConfig();
  const [formData, setFormData] = useState<SiteConfig>(config);
  const [activeTab, setActiveTab] = useState<TabType>("visibility");

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

  const isDirty = useMemo(() => {
    return JSON.stringify(formData) !== JSON.stringify(config);
  }, [formData, config]);

  const hiddenCount = useMemo(() => {
    return Object.values(formData.hiddenSections || {}).filter(Boolean).length;
  }, [formData.hiddenSections]);

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

    const validationErrors = validateConfig(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

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

  const toggleSection = (key: keyof HiddenSections, isHidden: boolean) => {
    setFormData({
      ...formData,
      hiddenSections: {
        ...formData.hiddenSections,
        [key]: isHidden,
      },
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-emerald-deep text-cream flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-card text-foreground rounded-3xl p-8 shadow-2xl border border-gold/30">
          <div className="flex flex-col items-center text-center mb-8">
            <img src={logoImg} alt="Wellness Journey Logo" className="h-16 w-16 object-contain mb-3" />
            <h1 className="font-display text-3xl font-bold text-primary">Admin Access</h1>
            <p className="text-sm text-muted-foreground mt-1">Sign in to manage site content, section visibility, & tracking</p>
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
                <h1 className="font-display text-xl font-bold text-primary">Master Site Management Dashboard</h1>
                {isDirty && (
                  <span className="rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/30 px-2.5 py-0.5 text-[10px] font-bold uppercase">
                    Unsaved Edits
                  </span>
                )}
                {hiddenCount > 0 && (
                  <span className="rounded-full bg-slate-500/10 text-slate-600 border border-slate-500/30 px-2.5 py-0.5 text-[10px] font-bold uppercase">
                    {hiddenCount} Sections Hidden
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Wellness Journey Nigeria Admin
                {lastSavedTimestamp && <span className="ml-2 text-emerald-600 font-medium">· Last saved at {lastSavedTimestamp}</span>}
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

      {/* Main content layout with Left Sidebar Navigation */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        {/* Validation Errors Alert Banner */}
        {Object.keys(errors).length > 0 && (
          <div className="mb-6 rounded-2xl bg-destructive/10 border border-destructive/30 p-5 text-destructive shadow-sm">
            <div className="flex items-center gap-2 font-semibold text-base mb-2">
              <span>⚠️</span> Validation Errors Found ({Object.keys(errors).length})
            </div>
            <ul className="list-disc list-inside space-y-1 text-xs font-medium">
              {Object.entries(errors).map(([key, msg]) => (
                <li key={key}>{msg}</li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSave} className="grid lg:grid-cols-4 gap-8 items-start">
          {/* LEFT SIDEBAR: Vertical Admin Navigation Bar */}
          <div className="lg:col-span-1 lg:sticky lg:top-24 space-y-6">
            <div className="rounded-3xl border border-border bg-card p-5 shadow-luxe space-y-2">
              <div className="text-xs uppercase tracking-widest font-bold text-gold px-3 mb-3 flex items-center justify-between">
                <span>Admin Menu</span>
                <span className="text-[10px] text-muted-foreground">Left Nav</span>
              </div>
              {[
                { id: "visibility", label: "👁 Section Visibility", badge: `${12 - hiddenCount}/12` },
                { id: "hero", label: "📝 Hero & Header" },
                { id: "pain_why", label: "💥 Pain Points & Why Us" },
                { id: "products", label: "💊 Treatment & Products" },
                { id: "results_gallery", label: "📸 Gallery & Results" },
                { id: "bmi_faq", label: "⚖️ BMI, FAQ & Consult" },
                { id: "seo", label: "🔍 Brand & SEO" },
                { id: "tracking", label: "📊 Tracking Scripts" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-semibold transition flex items-center justify-between ${
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground font-bold shadow-md"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.badge ? (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full ${
                        activeTab === tab.id ? "bg-gold/20 text-gold font-bold" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {tab.badge}
                    </span>
                  ) : (
                    activeTab === tab.id && <span className="text-gold font-bold">▶</span>
                  )}
                </button>
              ))}
            </div>

            <div className="rounded-3xl border border-border bg-card p-5 shadow-luxe space-y-3">
              <div className="text-xs font-bold text-primary mb-1">Quick Actions</div>
              <button
                type="submit"
                className="w-full rounded-full bg-gold py-3 text-xs font-semibold uppercase tracking-wider text-gold-foreground shadow-gold hover:opacity-90 transition"
              >
                Save All Changes
              </button>
              {isDirty && (
                <div className="text-[11px] text-amber-600 text-center font-medium">
                  ⚠️ You have unsaved changes
                </div>
              )}
            </div>
          </div>

          {/* RIGHT CONTENT AREA: Active Tab Form Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* TAB 0: SECTION VISIBILITY CONTROL PANEL */}
            {activeTab === "visibility" && (
              <div className="rounded-3xl border border-border bg-card p-6 shadow-luxe space-y-6">
                <div>
                  <h2 className="font-display text-2xl text-primary font-semibold">Master Section Visibility Controls</h2>
                  <p className="text-xs text-muted-foreground mt-1">
                    Easily hide or show any section on the live website with a single click. Click "Save All Changes" to publish.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <SectionToggle
                    label="Top Utility Bar (Announcement Header)"
                    hidden={formData.hiddenSections?.topBar}
                    onToggle={(h) => toggleSection("topBar", h)}
                  />
                  <SectionToggle
                    label="Hero Banner Section"
                    hidden={formData.hiddenSections?.hero}
                    onToggle={(h) => toggleSection("hero", h)}
                  />
                  <SectionToggle
                    label="Pain Points Section ('Are you dealing with —')"
                    hidden={formData.hiddenSections?.painPoints}
                    onToggle={(h) => toggleSection("painPoints", h)}
                  />
                  <SectionToggle
                    label="Mounjaro Doses & Pricing Section"
                    hidden={formData.hiddenSections?.mounjaroTreatment}
                    onToggle={(h) => toggleSection("mounjaroTreatment", h)}
                  />
                  <SectionToggle
                    label="Compounded Tirzepatide Section"
                    hidden={formData.hiddenSections?.compoundedTreatment}
                    onToggle={(h) => toggleSection("compoundedTreatment", h)}
                  />
                  <SectionToggle
                    label="Stock Product Gallery & Unboxing Video"
                    hidden={formData.hiddenSections?.gallery}
                    onToggle={(h) => toggleSection("gallery", h)}
                  />
                  <SectionToggle
                    label="Patient Results & Transformations"
                    hidden={formData.hiddenSections?.results}
                    onToggle={(h) => toggleSection("results", h)}
                  />
                  <SectionToggle
                    label="WhatsApp Reviews & Testimonials Grid"
                    hidden={formData.hiddenSections?.whatsappReviews}
                    onToggle={(h) => toggleSection("whatsappReviews", h)}
                  />
                  <SectionToggle
                    label="Why Choose Us Section (8 Feature Cards)"
                    hidden={formData.hiddenSections?.whyUs}
                    onToggle={(h) => toggleSection("whyUs", h)}
                  />
                  <SectionToggle
                    label="BMI Calculator & Projection Tool"
                    hidden={formData.hiddenSections?.bmiSection}
                    onToggle={(h) => toggleSection("bmiSection", h)}
                  />
                  <SectionToggle
                    label="Frequently Asked Questions (FAQ)"
                    hidden={formData.hiddenSections?.faqSection}
                    onToggle={(h) => toggleSection("faqSection", h)}
                  />
                  <SectionToggle
                    label="Consultation Booking CTA Banner"
                    hidden={formData.hiddenSections?.consultSection}
                    onToggle={(h) => toggleSection("consultSection", h)}
                  />
                </div>
              </div>
            )}

            {/* TAB 1: HERO & HEADER */}
            {activeTab === "hero" && (
              <div className="space-y-8">
                {/* Top Utility Bar */}
                <div className="rounded-3xl border border-border bg-card p-6 shadow-luxe space-y-4">
                  <SectionToggle
                    label="Top Utility Bar"
                    hidden={formData.hiddenSections?.topBar}
                    onToggle={(h) => toggleSection("topBar", h)}
                  />
                  <h2 className="font-display text-2xl text-primary font-semibold mb-4">Top Announcement Bar & Contact Details</h2>
                  <div className="grid md:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">Badge Text</label>
                      <input
                        type="text"
                        value={formData.topBar.badgeText}
                        onChange={(e) => setFormData({ ...formData, topBar: { ...formData.topBar, badgeText: e.target.value } })}
                        className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:border-gold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">Subtext</label>
                      <input
                        type="text"
                        value={formData.topBar.subText}
                        onChange={(e) => setFormData({ ...formData, topBar: { ...formData.topBar, subText: e.target.value } })}
                        className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:border-gold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">WhatsApp Link Text</label>
                      <input
                        type="text"
                        value={formData.topBar.whatsappText}
                        onChange={(e) => setFormData({ ...formData, topBar: { ...formData.topBar, whatsappText: e.target.value } })}
                        className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:border-gold"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5 pt-5 border-t border-border">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">Display Phone Number *</label>
                      <input
                        type="text"
                        value={formData.contact.phone}
                        onChange={(e) => setFormData({ ...formData, contact: { ...formData.contact, phone: e.target.value } })}
                        className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:border-gold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">International Phone (tel:)</label>
                      <input
                        type="text"
                        value={formData.contact.phoneIntl}
                        onChange={(e) => setFormData({ ...formData, contact: { ...formData.contact, phoneIntl: e.target.value } })}
                        className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:border-gold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">WhatsApp URL</label>
                      <input
                        type="text"
                        value={formData.contact.whatsappUrl}
                        onChange={(e) => setFormData({ ...formData, contact: { ...formData.contact, whatsappUrl: e.target.value } })}
                        className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:border-gold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">Instagram URL</label>
                      <input
                        type="text"
                        value={formData.contact.instagramUrl}
                        onChange={(e) => setFormData({ ...formData, contact: { ...formData.contact, instagramUrl: e.target.value } })}
                        className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:border-gold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">Google Maps Link</label>
                      <input
                        type="text"
                        value={formData.contact.mapsUrl}
                        onChange={(e) => setFormData({ ...formData, contact: { ...formData.contact, mapsUrl: e.target.value } })}
                        className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:border-gold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">Location Text</label>
                      <input
                        type="text"
                        value={formData.contact.locationText}
                        onChange={(e) => setFormData({ ...formData, contact: { ...formData.contact, locationText: e.target.value } })}
                        className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:border-gold"
                      />
                    </div>
                  </div>
                </div>

                {/* Hero Copy & Badges */}
                <div className="rounded-3xl border border-border bg-card p-6 shadow-luxe space-y-4">
                  <SectionToggle
                    label="Hero Banner Section"
                    hidden={formData.hiddenSections?.hero}
                    onToggle={(h) => toggleSection("hero", h)}
                  />
                  <h2 className="font-display text-2xl text-primary font-semibold">Hero Banner Section</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">Hero Eyebrow Badge</label>
                      <input
                        type="text"
                        value={formData.hero.badge}
                        onChange={(e) => setFormData({ ...formData, hero: { ...formData.hero, badge: e.target.value } })}
                        className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:border-gold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">Italic Accent Word</label>
                      <input
                        type="text"
                        value={formData.hero.headlineItalic}
                        onChange={(e) => setFormData({ ...formData, hero: { ...formData.hero, headlineItalic: e.target.value } })}
                        className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:border-gold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">Hero Main Headline *</label>
                    <input
                      type="text"
                      value={formData.hero.headline}
                      onChange={(e) => setFormData({ ...formData, hero: { ...formData.hero, headline: e.target.value } })}
                      className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:border-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">Subheadline / Paragraph</label>
                    <textarea
                      rows={3}
                      value={formData.hero.subheadline}
                      onChange={(e) => setFormData({ ...formData, hero: { ...formData.hero, subheadline: e.target.value } })}
                      className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:border-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">Hero Feature Pills (Comma Separated)</label>
                    <input
                      type="text"
                      value={formData.hero.pills.join(", ")}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hero: {
                            ...formData.hero,
                            pills: e.target.value.split(",").map((s) => s.trim()),
                          },
                        })
                      }
                      className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:border-gold"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">Primary CTA Button Text</label>
                      <input
                        type="text"
                        value={formData.hero.primaryCtaText}
                        onChange={(e) => setFormData({ ...formData, hero: { ...formData.hero, primaryCtaText: e.target.value } })}
                        className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:border-gold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">Secondary CTA Text</label>
                      <input
                        type="text"
                        value={formData.hero.secondaryCtaText}
                        onChange={(e) => setFormData({ ...formData, hero: { ...formData.hero, secondaryCtaText: e.target.value } })}
                        className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:border-gold"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: PAIN POINTS & WHY US */}
            {activeTab === "pain_why" && (
              <div className="space-y-8">
                {/* Pain Points */}
                <div className="rounded-3xl border border-border bg-card p-6 shadow-luxe space-y-4">
                  <SectionToggle
                    label="Pain Points Section"
                    hidden={formData.hiddenSections?.painPoints}
                    onToggle={(h) => toggleSection("painPoints", h)}
                  />
                  <h2 className="font-display text-2xl text-primary font-semibold">Pain Points Section</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">Section Eyebrow</label>
                      <input
                        type="text"
                        value={formData.painPoints.eyebrow}
                        onChange={(e) => setFormData({ ...formData, painPoints: { ...formData.painPoints, eyebrow: e.target.value } })}
                        className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:border-gold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">Section Headline</label>
                      <input
                        type="text"
                        value={formData.painPoints.headline}
                        onChange={(e) => setFormData({ ...formData, painPoints: { ...formData.painPoints, headline: e.target.value } })}
                        className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:border-gold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">Section Description</label>
                    <textarea
                      rows={2}
                      value={formData.painPoints.description}
                      onChange={(e) => setFormData({ ...formData, painPoints: { ...formData.painPoints, description: e.target.value } })}
                      className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:border-gold"
                    />
                  </div>
                </div>

                {/* Why Us */}
                <div className="rounded-3xl border border-border bg-card p-6 shadow-luxe space-y-4">
                  <SectionToggle
                    label="Why Choose Us Section"
                    hidden={formData.hiddenSections?.whyUs}
                    onToggle={(h) => toggleSection("whyUs", h)}
                  />
                  <h2 className="font-display text-2xl text-primary font-semibold">Why Choose Us Section</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">Why Us Eyebrow</label>
                      <input
                        type="text"
                        value={formData.whyUs.eyebrow}
                        onChange={(e) => setFormData({ ...formData, whyUs: { ...formData.whyUs, eyebrow: e.target.value } })}
                        className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:border-gold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">Why Us Headline</label>
                      <input
                        type="text"
                        value={formData.whyUs.headline}
                        onChange={(e) => setFormData({ ...formData, whyUs: { ...formData.whyUs, headline: e.target.value } })}
                        className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:border-gold"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: PRODUCTS & DOSES */}
            {activeTab === "products" && (
              <div className="space-y-8">
                {/* Mounjaro Products */}
                <div className="rounded-3xl border border-border bg-card p-6 shadow-luxe space-y-4">
                  <SectionToggle
                    label="Mounjaro Doses Section"
                    hidden={formData.hiddenSections?.mounjaroTreatment}
                    onToggle={(h) => toggleSection("mounjaroTreatment", h)}
                  />
                  <h2 className="font-display text-2xl text-primary font-semibold">Mounjaro Doses Section</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">Mounjaro Eyebrow</label>
                      <input
                        type="text"
                        value={formData.treatment.mounjaroEyebrow}
                        onChange={(e) => setFormData({ ...formData, treatment: { ...formData.treatment, mounjaroEyebrow: e.target.value } })}
                        className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:border-gold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">Mounjaro Headline</label>
                      <input
                        type="text"
                        value={formData.treatment.mounjaroHeadline}
                        onChange={(e) => setFormData({ ...formData, treatment: { ...formData.treatment, mounjaroHeadline: e.target.value } })}
                        className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:border-gold"
                      />
                    </div>
                  </div>
                </div>

                {/* Compounded Products */}
                <div className="rounded-3xl border border-border bg-card p-6 shadow-luxe space-y-4">
                  <SectionToggle
                    label="Compounded Tirzepatide Section"
                    hidden={formData.hiddenSections?.compoundedTreatment}
                    onToggle={(h) => toggleSection("compoundedTreatment", h)}
                  />
                  <h2 className="font-display text-2xl text-primary font-semibold">Compounded Tirzepatide Section</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">Compounded Eyebrow</label>
                      <input
                        type="text"
                        value={formData.treatment.compoundedEyebrow}
                        onChange={(e) => setFormData({ ...formData, treatment: { ...formData.treatment, compoundedEyebrow: e.target.value } })}
                        className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:border-gold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">Compounded Headline</label>
                      <input
                        type="text"
                        value={formData.treatment.compoundedHeadline}
                        onChange={(e) => setFormData({ ...formData, treatment: { ...formData.treatment, compoundedHeadline: e.target.value } })}
                        className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:border-gold"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: GALLERY & RESULTS */}
            {activeTab === "results_gallery" && (
              <div className="space-y-8">
                {/* Gallery Section */}
                <div className="rounded-3xl border border-border bg-card p-6 shadow-luxe space-y-4">
                  <SectionToggle
                    label="Stock Product Gallery & Video"
                    hidden={formData.hiddenSections?.gallery}
                    onToggle={(h) => toggleSection("gallery", h)}
                  />
                  <h2 className="font-display text-2xl text-primary font-semibold">Stock Gallery Section</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">Gallery Eyebrow</label>
                      <input
                        type="text"
                        value={formData.gallery.eyebrow}
                        onChange={(e) => setFormData({ ...formData, gallery: { ...formData.gallery, eyebrow: e.target.value } })}
                        className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:border-gold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">Gallery Headline</label>
                      <input
                        type="text"
                        value={formData.gallery.headline}
                        onChange={(e) => setFormData({ ...formData, gallery: { ...formData.gallery, headline: e.target.value } })}
                        className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:border-gold"
                      />
                    </div>
                  </div>
                </div>

                {/* Patient Results */}
                <div className="rounded-3xl border border-border bg-card p-6 shadow-luxe space-y-4">
                  <SectionToggle
                    label="Patient Results & Transformations"
                    hidden={formData.hiddenSections?.results}
                    onToggle={(h) => toggleSection("results", h)}
                  />
                  <h2 className="font-display text-2xl text-primary font-semibold">Patient Results & Statistics</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">Results Eyebrow</label>
                      <input
                        type="text"
                        value={formData.results.eyebrow}
                        onChange={(e) => setFormData({ ...formData, results: { ...formData.results, eyebrow: e.target.value } })}
                        className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:border-gold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">Results Headline</label>
                      <input
                        type="text"
                        value={formData.results.headline}
                        onChange={(e) => setFormData({ ...formData, results: { ...formData.results, headline: e.target.value } })}
                        className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:border-gold"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: BMI, FAQ & CONSULT */}
            {activeTab === "bmi_faq" && (
              <div className="space-y-8">
                {/* BMI Tool */}
                <div className="rounded-3xl border border-border bg-card p-6 shadow-luxe space-y-4">
                  <SectionToggle
                    label="BMI Calculator & Projection Tool"
                    hidden={formData.hiddenSections?.bmiSection}
                    onToggle={(h) => toggleSection("bmiSection", h)}
                  />
                  <h2 className="font-display text-2xl text-primary font-semibold">BMI Calculator Section</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">BMI Eyebrow</label>
                      <input
                        type="text"
                        value={formData.bmiSection.eyebrow}
                        onChange={(e) => setFormData({ ...formData, bmiSection: { ...formData.bmiSection, eyebrow: e.target.value } })}
                        className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:border-gold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">BMI Headline</label>
                      <input
                        type="text"
                        value={formData.bmiSection.headline}
                        onChange={(e) => setFormData({ ...formData, bmiSection: { ...formData.bmiSection, headline: e.target.value } })}
                        className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:border-gold"
                      />
                    </div>
                  </div>
                </div>

                {/* FAQ */}
                <div className="rounded-3xl border border-border bg-card p-6 shadow-luxe space-y-4">
                  <SectionToggle
                    label="Frequently Asked Questions (FAQ)"
                    hidden={formData.hiddenSections?.faqSection}
                    onToggle={(h) => toggleSection("faqSection", h)}
                  />
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-display text-2xl text-primary font-semibold">FAQ Items ({formData.faq.length})</h2>
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
                      <div key={item.id} className="rounded-2xl border border-border p-4 bg-background space-y-2">
                        <div className="flex items-center justify-between">
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
                        <input
                          type="text"
                          value={item.q}
                          onChange={(e) => {
                            const updated = [...formData.faq];
                            updated[idx].q = e.target.value;
                            setFormData({ ...formData, faq: updated });
                          }}
                          className="w-full rounded-lg border px-3 py-2 text-sm font-medium"
                        />
                        <textarea
                          rows={2}
                          value={item.a}
                          onChange={(e) => {
                            const updated = [...formData.faq];
                            updated[idx].a = e.target.value;
                            setFormData({ ...formData, faq: updated });
                          }}
                          className="w-full rounded-lg border px-3 py-2 text-xs"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Consult Banner */}
                <div className="rounded-3xl border border-border bg-card p-6 shadow-luxe space-y-4">
                  <SectionToggle
                    label="Consultation Booking CTA Banner"
                    hidden={formData.hiddenSections?.consultSection}
                    onToggle={(h) => toggleSection("consultSection", h)}
                  />
                  <h2 className="font-display text-2xl text-primary font-semibold">Consultation Banner</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">Consult Headline</label>
                      <input
                        type="text"
                        value={formData.consultSection.headline}
                        onChange={(e) => setFormData({ ...formData, consultSection: { ...formData.consultSection, headline: e.target.value } })}
                        className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:border-gold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">Consult Description</label>
                      <textarea
                        rows={2}
                        value={formData.consultSection.description}
                        onChange={(e) => setFormData({ ...formData, consultSection: { ...formData.consultSection, description: e.target.value } })}
                        className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:border-gold"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: BRAND & SEO */}
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
                      onChange={(e) => setFormData({ ...formData, seo: { ...formData.seo, faviconUrl: e.target.value } })}
                      placeholder="https://example.com/favicon.ico"
                      className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:border-gold"
                    />
                    {errors["seo.faviconUrl"] && <p className="text-[11px] text-destructive mt-1">{errors["seo.faviconUrl"]}</p>}
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">
                      Social Media Thumbnail (OG Image URL)
                    </label>
                    <input
                      type="text"
                      value={formData.seo.ogImageUrl}
                      onChange={(e) => setFormData({ ...formData, seo: { ...formData.seo, ogImageUrl: e.target.value } })}
                      placeholder="https://example.com/og-image.jpg"
                      className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:border-gold"
                    />
                    {errors["seo.ogImageUrl"] && <p className="text-[11px] text-destructive mt-1">{errors["seo.ogImageUrl"]}</p>}
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-border">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">SEO Title Tag *</label>
                    <input
                      type="text"
                      value={formData.seo.title}
                      onChange={(e) => setFormData({ ...formData, seo: { ...formData.seo, title: e.target.value } })}
                      className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:border-gold"
                    />
                    {errors["seo.title"] && <p className="text-[11px] text-destructive mt-1">{errors["seo.title"]}</p>}
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">SEO Meta Description *</label>
                    <textarea
                      rows={3}
                      value={formData.seo.description}
                      onChange={(e) => setFormData({ ...formData, seo: { ...formData.seo, description: e.target.value } })}
                      className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:border-gold"
                    />
                    {errors["seo.description"] && <p className="text-[11px] text-destructive mt-1">{errors["seo.description"]}</p>}
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">SEO Keywords (Comma Separated)</label>
                    <input
                      type="text"
                      value={formData.seo.keywords}
                      onChange={(e) => setFormData({ ...formData, seo: { ...formData.seo, keywords: e.target.value } })}
                      className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:border-gold"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 7: MARKETING & TRACKING */}
            {activeTab === "tracking" && (
              <div className="rounded-3xl border border-border bg-card p-6 shadow-luxe space-y-6">
                <div>
                  <h2 className="font-display text-2xl text-primary font-semibold">Marketing & Tracking Scripts</h2>
                  <p className="text-xs text-muted-foreground mt-1">Insert container IDs or raw custom JavaScript tags for marketing platforms like Google, Facebook, & TikTok.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">Google Tag Manager / GA4 ID</label>
                    <input
                      type="text"
                      value={formData.tracking.googleTagManagerId}
                      onChange={(e) => setFormData({ ...formData, tracking: { ...formData.tracking, googleTagManagerId: e.target.value } })}
                      placeholder="GTM-XXXXXXX or G-XXXXXXX"
                      className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm font-mono focus:border-gold"
                    />
                    {errors["tracking.googleTagManagerId"] && <p className="text-[11px] text-destructive mt-1">{errors["tracking.googleTagManagerId"]}</p>}
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">Facebook Pixel ID</label>
                    <input
                      type="text"
                      value={formData.tracking.facebookPixelId}
                      onChange={(e) => setFormData({ ...formData, tracking: { ...formData.tracking, facebookPixelId: e.target.value } })}
                      placeholder="123456789012345"
                      className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm font-mono focus:border-gold"
                    />
                    {errors["tracking.facebookPixelId"] && <p className="text-[11px] text-destructive mt-1">{errors["tracking.facebookPixelId"]}</p>}
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">TikTok Pixel ID</label>
                    <input
                      type="text"
                      value={formData.tracking.tiktokPixelId}
                      onChange={(e) => setFormData({ ...formData, tracking: { ...formData.tracking, tiktokPixelId: e.target.value } })}
                      placeholder="C1234567890"
                      className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm font-mono focus:border-gold"
                    />
                    {errors["tracking.tiktokPixelId"] && <p className="text-[11px] text-destructive mt-1">{errors["tracking.tiktokPixelId"]}</p>}
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-border">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">Custom Head HTML / Scripts</label>
                    <textarea
                      rows={4}
                      value={formData.tracking.customHeadScripts}
                      onChange={(e) => setFormData({ ...formData, tracking: { ...formData.tracking, customHeadScripts: e.target.value } })}
                      placeholder="<script>/* custom tracking script for <head> */</script>"
                      className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-xs font-mono focus:border-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">Custom Body HTML / Scripts</label>
                    <textarea
                      rows={4}
                      value={formData.tracking.customBodyScripts}
                      onChange={(e) => setFormData({ ...formData, tracking: { ...formData.tracking, customBodyScripts: e.target.value } })}
                      placeholder="<script>/* custom tracking script for <body> */</script>"
                      className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-xs font-mono focus:border-gold"
                    />
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
                {isDirty && <span className="text-xs text-amber-600 font-medium">⚠️ Unsaved changes pending</span>}
                <button
                  type="submit"
                  className="rounded-full bg-gold px-8 py-3.5 text-sm font-semibold uppercase tracking-wider text-gold-foreground shadow-gold hover:opacity-90 transition flex items-center gap-2"
                >
                  <span>Save All Changes</span>
                </button>
              </div>
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
                All site modifications, section visibility settings, SEO meta tags, and tracking scripts have been validated and saved successfully. The live website is updated.
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
                Are you sure you want to restore original default copy, prices, section visibility, SEO settings, and links? Custom changes will be cleared.
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
