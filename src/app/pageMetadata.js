export const homePageMetadata = {
  title: {
    default: "Mannubhai - Get Expert Professional Services at Home",
    template: "%s | Mannubhai Services",
  },
  alternates: {
    canonical: "https://www.mannubhai.com",
  },
  robots: {
    index: true,
    follow: true,
  },
  description:
    "Mannubhai is your one-stop destination for expert local services in India. Book trusted professionals for appliance repair, beauty services, home care, and more.",
  keywords: [
    "Mannubhai service",
    "Professional Services",
    "appliance repair",
    "beauty services",
    "home care",
    "handyman services",
  ],
  metadataBase: new URL('https://www.mannubhai.com'),
  openGraph: {
    title: "Mannubhai - Professional Home Services",
    description: "Book trusted professionals for all your home service needs",
  },

  manifest: '/site.webmanifest',
  verification: {
    google: 'IaTaWIzhmYLa4xubMA-U595_5CX8O-zVfP_Y69z2Wss',
    other: {
      'ahrefs-site-verification': '483dfd13bd02e15036ba68fb4b8adc6ab44c031dbdfc6e9de0c36ea01ea99eab',
    },
  },
  // Organization Schema moved from SEOAndTrackingScripts.js
  organizationSchema: {
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
  },
};