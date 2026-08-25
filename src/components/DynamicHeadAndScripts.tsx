import { useEffect } from "react";
import { useSiteConfig } from "./SiteConfigContext";

export default function DynamicHeadAndScripts() {
  const { config } = useSiteConfig();
  const { seo, tracking } = config;

  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") return;

    // 1. Update Document Title
    if (seo.title) {
      document.title = seo.title;
    }

    // 2. Helper to set/update meta tag
    const setMetaTag = (selector: string, attrName: string, attrVal: string, content: string) => {
      if (!content) return;
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attrName, attrVal);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    setMetaTag('meta[name="description"]', 'name', 'description', seo.description);
    setMetaTag('meta[name="keywords"]', 'name', 'keywords', seo.keywords);
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', seo.ogTitle || seo.title);
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', seo.ogDescription || seo.description);
    if (seo.ogImageUrl) {
      setMetaTag('meta[property="og:image"]', 'property', 'og:image', seo.ogImageUrl);
    }

    // 3. Dynamic Favicon
    if (seo.faviconUrl) {
      let iconLink = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
      if (!iconLink) {
        iconLink = document.createElement("link");
        iconLink.rel = "icon";
        document.head.appendChild(iconLink);
      }
      iconLink.href = seo.faviconUrl;
    }
  }, [seo]);

  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") return;

    // Clear previously injected dynamic tracking elements
    const existingInjected = document.querySelectorAll("[data-dynamic-tracking]");
    existingInjected.forEach((el) => el.remove());

    // Helper to append script/HTML element with metadata tag
    const injectHeadElement = (element: HTMLElement) => {
      element.setAttribute("data-dynamic-tracking", "true");
      document.head.appendChild(element);
    };

    const injectBodyElement = (element: HTMLElement) => {
      element.setAttribute("data-dynamic-tracking", "true");
      document.body.appendChild(element);
    };

    // A. Google Tag Manager / Analytics
    if (tracking.googleTagManagerId) {
      const gtmId = tracking.googleTagManagerId.trim();
      if (gtmId.startsWith("G-")) {
        // Google Analytics 4
        const script1 = document.createElement("script");
        script1.async = true;
        script1.src = `https://www.googletagmanager.com/gtag/js?id=${gtmId}`;
        injectHeadElement(script1);

        const script2 = document.createElement("script");
        script2.innerHTML = `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gtmId}');
        `;
        injectHeadElement(script2);
      } else if (gtmId.startsWith("GTM-")) {
        // GTM
        const gtmScript = document.createElement("script");
        gtmScript.innerHTML = `
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${gtmId}');
        `;
        injectHeadElement(gtmScript);
      }
    }

    // B. Facebook Pixel
    if (tracking.facebookPixelId) {
      const fbId = tracking.facebookPixelId.trim();
      const fbScript = document.createElement("script");
      fbScript.innerHTML = `
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${fbId}');
        fbq('track', 'PageView');
      `;
      injectHeadElement(fbScript);
    }

    // C. TikTok Pixel
    if (tracking.tiktokPixelId) {
      const ttId = tracking.tiktokPixelId.trim();
      const ttScript = document.createElement("script");
      ttScript.innerHTML = `
        !function (w, d, t) {
          w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndVerify=function(t,e){const n=t.split(".");2==n.length?(t[n[0]]=t[n[0]]||{},t[n[0]][n[1]]=e):t[t]=e};ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
          ttq.load('${ttId}');
          ttq.page();
        }(window, document, 'ttq');
      `;
      injectHeadElement(ttScript);
    }

    // D. Custom Head Scripts / HTML
    if (tracking.customHeadScripts) {
      const div = document.createElement("div");
      div.innerHTML = tracking.customHeadScripts;
      Array.from(div.children).forEach((child) => {
        if (child.tagName === "SCRIPT") {
          const newScript = document.createElement("script");
          Array.from(child.attributes).forEach((attr) => newScript.setAttribute(attr.name, attr.value));
          newScript.innerHTML = child.innerHTML;
          injectHeadElement(newScript);
        } else {
          injectHeadElement(child.cloneNode(true) as HTMLElement);
        }
      });
    }

    // E. Custom Body Scripts / HTML
    if (tracking.customBodyScripts) {
      const div = document.createElement("div");
      div.innerHTML = tracking.customBodyScripts;
      Array.from(div.children).forEach((child) => {
        if (child.tagName === "SCRIPT") {
          const newScript = document.createElement("script");
          Array.from(child.attributes).forEach((attr) => newScript.setAttribute(attr.name, attr.value));
          newScript.innerHTML = child.innerHTML;
          injectBodyElement(newScript);
        } else {
          injectBodyElement(child.cloneNode(true) as HTMLElement);
        }
      });
    }
  }, [tracking]);

  return null;
}
