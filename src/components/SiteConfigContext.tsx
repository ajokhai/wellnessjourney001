import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getSiteConfig,
  resetSiteConfig as resetStore,
  saveSiteConfig as saveStore,
  subscribeToConfigChange,
  type SiteConfig,
} from "../lib/site-config";

interface SiteConfigContextType {
  config: SiteConfig;
  updateConfig: (newConfig: SiteConfig) => void;
  resetConfig: () => void;
}

const SiteConfigContext = createContext<SiteConfigContextType | undefined>(undefined);

export function SiteConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<SiteConfig>(() => getSiteConfig());

  useEffect(() => {
    // Initial fetch to sync client side after hydration
    setConfig(getSiteConfig());
    const unsubscribe = subscribeToConfigChange((updatedConfig) => {
      setConfig(updatedConfig);
    });
    return () => unsubscribe();
  }, []);

  const updateConfig = (newConfig: SiteConfig) => {
    saveStore(newConfig);
    setConfig(newConfig);
  };

  const resetConfig = () => {
    const res = resetStore();
    setConfig(res);
  };

  return (
    <SiteConfigContext.Provider value={{ config, updateConfig, resetConfig }}>
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
