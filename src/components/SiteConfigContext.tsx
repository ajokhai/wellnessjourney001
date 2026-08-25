import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getSiteConfig,
  resetSiteConfig as resetStore,
  saveSiteConfig as saveStore,
  subscribeToConfigChange,
  type SiteConfig,
} from "../lib/site-config";
import { getSiteConfigServerFn, saveSiteConfigServerFn } from "../lib/api/config.functions";

interface SiteConfigContextType {
  config: SiteConfig;
  updateConfig: (newConfig: SiteConfig) => void;
  resetConfig: () => void;
  isLoadingDb?: boolean;
}

const SiteConfigContext = createContext<SiteConfigContextType | undefined>(undefined);

export function SiteConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<SiteConfig>(() => getSiteConfig());
  const [isLoadingDb, setIsLoadingDb] = useState(true);

  useEffect(() => {
    // 1. Initial client-side sync from localStorage
    setConfig(getSiteConfig());

    // 2. Sync from Vercel Postgres
    getSiteConfigServerFn()
      .then((dbConfig) => {
        if (dbConfig) {
          saveStore(dbConfig);
          setConfig(dbConfig);
        }
      })
      .catch((err) => {
        console.error("Vercel Postgres sync error:", err);
      })
      .finally(() => {
        setIsLoadingDb(false);
      });

    const unsubscribe = subscribeToConfigChange((updatedConfig) => {
      setConfig(updatedConfig);
    });
    return () => unsubscribe();
  }, []);

  const updateConfig = (newConfig: SiteConfig) => {
    // Save to local store immediately for instant UI responsiveness
    saveStore(newConfig);
    setConfig(newConfig);

    // Persist to Vercel Postgres in background
    saveSiteConfigServerFn({ data: { config: newConfig } }).catch((err) => {
      console.error("Error persisting to Vercel Postgres:", err);
    });
  };

  const resetConfig = () => {
    const res = resetStore();
    setConfig(res);
    saveSiteConfigServerFn({ data: { config: res } }).catch((err) => {
      console.error("Error resetting Vercel Postgres:", err);
    });
  };

  return (
    <SiteConfigContext.Provider value={{ config, updateConfig, resetConfig, isLoadingDb }}>
      {children}
    </SiteConfigContext.Provider>
  );
}

export function useSiteConfig(): SiteConfigContextType {
  const context = useContext(SiteConfigContext);
  if (!context) {
    throw new Error("useSiteConfig must be used within a SiteConfigProvider");
  }
  return context;
}
