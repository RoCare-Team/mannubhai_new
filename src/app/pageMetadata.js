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

  // Additional Schema Scripts for Home Page
  schemas: {
    breadcrumb: {
      "@context": "https://schema.org/", 
      "@type": "BreadcrumbList", 
      "itemListElement": [{
        "@type": "ListItem", 
        "position": 1, 
        "name": "home",
        "item": "https://www.mannubhai.com/"  
      },{
        "@type": "ListItem", 
        "position": 2, 
        "name": "City",
        "item": "https://www.mannubhai.com/delhi/water-purifier-service"  
      },{
        "@type": "ListItem", 
        "position": 3, 
        "name": "Services",
        "item": "https://www.mannubhai.com/water-purifier-service"  
      },{
        "@type": "ListItem", 
        "position": 4, 
        "name": "City+Service",
        "item": "https://www.mannubhai.com/delhi/water-purifier-service"  
      }]
    },

    organization: {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Mannu Bhai Service Expert",
      "alternateName": "Mannu Bhai",
      "url": "https://www.mannubhai.com/",
      "logo": "https://www.mannubhai.com/_next/image?url=%2Flogo.png&w=256&q=75",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "07065012902",
        "contactType": "customer service",
        "contactOption": "TollFree",
        "areaServed": "IN",
        "availableLanguage": ["en","Hindi"]
      },
      "sameAs": [
        "https://www.facebook.com/mannubhaiserviceexperts",
        "https://www.instagram.com/mannubhaiserviceexperts",
        "https://www.youtube.com/@mannubhaiserviceexpert",
        "https://in.linkedin.com/company/mannubhaiserviceexpert",
        "https://www.mannubhai.com/"
      ]
    },

    localBusiness: {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "Mannu Bhai Service Expert",
      "image": "https://www.mannubhai.com/_next/image?url=%2Flogo.png&w=256&q=75",
      "@id": "https://www.mannubhai.com/#localbusiness",
      "url": "https://www.mannubhai.com/",
      "telephone": "07065012902",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Unit No 831 8th Floor, Head Office, JMD MEGAPOLIS, Sector 48, Gurugram, Haryana 122018",
        "addressLocality": "Gurgaon",
        "postalCode": "122018",
        "addressCountry": "IN"
      },
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday"
        ],
        "opens": "00:00",
        "closes": "23:59"
      }
    }
  }
};

// Helper function to generate JSON-LD script tags
export const generateSchemaScripts = () => {
  const schemas = homePageMetadata.schemas;
  
  return Object.keys(schemas).map(key => ({
    type: 'application/ld+json',
    children: JSON.stringify(schemas[key], null, 2)
  }));
};