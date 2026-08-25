import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useSiteConfig } from "@/components/SiteConfigContext";
import type { SiteConfig, ProductItem, CompoundedProductItem, FaqItem } from "@/lib/site-config";
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

function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");

  const { config, updateConfig, resetConfig } = useSiteConfig();
  const [formData, setFormData] = useState<SiteConfig>(config);
  const [activeTab, setActiveTab] = useState<"copy" | "seo" | "tracking">("copy");
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
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
    updateConfig(formData);
    setSaveSuccess("All changes saved successfully! The site has been updated.");
    setTimeout(() => setSaveSuccess(null), 4000);
  };

  const handleReset = () => {
    resetConfig();
    setShowResetConfirm(false);
    setSaveSuccess("Site configuration reset to original defaults!");
    setTimeout(() => setSaveSuccess(null), 4000);
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
              <h1 className="font-display text-xl font-bold text-primary">Site Management Dashboard</h1>
              <p className="text-xs text-muted-foreground">Wellness Journey Nigeria Admin</p>
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
        {saveSuccess && (
          <div className="mb-6 rounded-2xl bg-emerald-deep text-cream p-4 border border-gold/40 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-3">
              <span className="text-gold text-xl">✓</span>
              <span className="text-sm font-medium">{saveSuccess}</span>
            </div>
            <button
              onClick={() => setSaveSuccess(null)}
              className="text-cream/70 hover:text-cream text-xs uppercase"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex border-b border-border mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab("copy")}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition whitespace-nowrap ${
              activeTab === "copy"
                ? "border-gold text-primary font-semibold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            📝 Copy & Links
          </button>
          <button
            onClick={() => setActiveTab("seo")}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition whitespace-nowrap ${
              activeTab === "seo"
                ? "border-gold text-primary font-semibold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            🔍 Brand & SEO Settings
          </button>
          <button
            onClick={() => setActiveTab("tracking")}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition whitespace-nowrap ${
              activeTab === "tracking"
                ? "border-gold text-primary font-semibold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            📊 Marketing & Tracking Scripts
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
                      Display Phone Number
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
                      className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:border-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">
                      International Phone Number (for tel: link)
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
                      className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:border-gold"
                    />
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
                      className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:border-gold"
                    />
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
                      className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:border-gold"
                    />
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
                      className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:border-gold"
                    />
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
                      Main Headline
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
                      className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:border-gold"
                    />
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
                        Primary CTA Button Text
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
                        className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:border-gold"
                      />
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
                        className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:border-gold"
                      />
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
                          <label className="block text-[10px] uppercase text-muted-foreground mb-0.5">Price</label>
                          <input
                            type="text"
                            value={p.price}
                            onChange={(e) => {
                              const updated = [...formData.products];
                              updated[idx].price = e.target.value;
                              setFormData({ ...formData, products: updated });
                            }}
                            className="w-full rounded-lg border px-3 py-1.5 text-sm font-semibold text-primary"
                          />
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
                        <input
                          type="text"
                          value={item.q}
                          onChange={(e) => {
                            const updated = [...formData.faq];
                            updated[idx].q = e.target.value;
                            setFormData({ ...formData, faq: updated });
                          }}
                          placeholder="Question"
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
                          placeholder="Answer"
                          className="w-full rounded-lg border px-3 py-2 text-xs"
                        />
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
                    className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:border-gold"
                  />
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
                    className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:border-gold"
                  />
                  <p className="text-[11px] text-muted-foreground mt-1">Image shown when sharing links on WhatsApp, Twitter, FB.</p>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-border">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">
                    SEO Title Tag
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
                    className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">
                    SEO Meta Description
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
                    className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:border-gold"
                  />
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
                    className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:border-gold font-mono"
                  />
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
                    className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:border-gold font-mono"
                  />
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
                    className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:border-gold font-mono"
                  />
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

            <button
              type="submit"
              className="rounded-full bg-gold px-8 py-3.5 text-sm font-semibold uppercase tracking-wider text-gold-foreground shadow-gold hover:opacity-90 transition"
            >
              Save All Changes
            </button>
          </div>
        </form>

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
