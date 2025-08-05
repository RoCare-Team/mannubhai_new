'use client';

import Script from 'next/script';
import React from 'react';

export function SEOAndTrackingScripts() {
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Mannubhai Service Expert",
    "url": "https://www.mannubhai.com/",
    "logo": "https://www.mannubhai.com/logo.png",
    "image": "https://www.mannubhai.com/logo.png",
    "description": "Mannubhai Service Expert is a trusted home service company offering repair, maintenance, and installation services for home appliances, gadgets, water purifiers, beauty, and home care needs across India.",
    "sameAs": [
      "https://www.facebook.com/mannubhaiserviceexperts",
      "https://www.instagram.com/mannubhaiserviceexperts/",
      "https://www.linkedin.com/company/mannubhaiserviceexpert/",
      "https://www.youtube.com/@mannubhaiserviceexpert"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-7065012902",
      "contactType": "Customer Service",
      "areaServed": "IN",
      "availableLanguage": ["English", "Hindi"]
    }
  };

  return (
    <>
      {/* Google Tag Manager Script */}
      <Script id="gtm-script" strategy="afterInteractive">
        {`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id=' + i + dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-KLC9RHXW');
        `}
      </Script>

      {/* Structured Data Script */}
      <Script
        id="org-structured-data"
        type="application/ld+json"
        strategy="afterInteractive"
      >
        {JSON.stringify(orgJsonLd)}
      </Script>
    </>
  );
}
