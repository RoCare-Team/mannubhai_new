  import { notFound, redirect } from "next/navigation";
  import { collection, getDocs, query, where } from "firebase/firestore";
  import { db } from "../../app/firebaseConfig";
  import dynamic from 'next/dynamic';
  
  // Constants
  const BASE_URL = "https://www.mannubhai.com";
  const DEFAULT_IMAGE = "/default-service.jpg";
  const LOGO_IMAGE = `${BASE_URL}/logo.png`;
  const CONTACT_NUMBER = "+91-7065012902";

  // Client Components with improved loading states
  const components = {
    LogoLoader: dynamic(() => import('@/components/LogoLoader'), {
      loading: () => <div className="min-h-[200px] flex items-center justify-center"></div>
    }),
    FAQSection: dynamic(() => import('@/components/FAQSection'), {
      loading: () => <components.LogoLoader />
    }),
    CityDetails: dynamic(() => import('@/components/CityDetails'), {
      loading: () => <components.LogoLoader />
    }),
    CategoryDetails: dynamic(() => import('@/components/CategoryDetails'), {
      loading: () => <components.LogoLoader />
    }),
    CityAccordion: dynamic(() => import('@/components/CityAccordion'), {
      loading: () => <components.LogoLoader />
    })
  };
  // Enhanced Cache Implementation
  class AppCache {
    static instance = new Map();
    static TTL = {
      SHORT: 300,  
      MEDIUM: 1800, 
      LONG: 3600     
    };

    static get(key) {
      const entry = this.instance.get(key);
      return entry && entry.expiry > Date.now() ? entry.value : null;
    }

    static set(key, value, ttl = this.TTL.MEDIUM) {
      this.instance.set(key, { value, expiry: Date.now() + ttl * 1000 });
      // Auto-cleanup when cache grows large
      if (this.instance.size > 100) {
        Array.from(this.instance.keys()).slice(0, 20).forEach(k => this.instance.delete(k));
      }
    }
  }

  // Utility Functions
  const normalizeUrlSegment = (segment) => 
    segment?.toLowerCase().trim().replace(/\s+/g, '-') || '';

  const generateCacheKey = (prefix, ...args) => 
    `${prefix}-${args.map(arg => normalizeUrlSegment(arg)).join('-')}`;

  // Data Services
  class DataService {
    static async fetchDocument(collectionName, field, value) {
      const normalizedValue = normalizeUrlSegment(value);
      const cacheKey = generateCacheKey(`${collectionName}-doc`, field, normalizedValue);
      const cached = AppCache.get(cacheKey);
      if (cached) return cached;

      const q = query(collection(db, collectionName));
      const snap = await getDocs(q);
      
      const doc = snap.docs.find(d => {
        const fieldValue = d.data()[field];
        return fieldValue && normalizeUrlSegment(fieldValue) === normalizedValue;
      });
      
      const result = doc ? { id: doc.id, ...doc.data() } : null;
      AppCache.set(cacheKey, result);
      return result;
    }

    static async fetchPageMaster(cityId, categoryId) {
      const cacheKey = generateCacheKey('page-master', cityId, categoryId);
      const cached = AppCache.get(cacheKey);
      if (cached) return cached;

      const q = query(
        collection(db, "page_master_tb"),
        where("city_id", "==", cityId),
        where("category_id", "==", categoryId)
      );
      const snap = await getDocs(q);
      const result = snap.empty ? null : { id: snap.docs[0].id, ...snap.docs[0].data() };
      AppCache.set(cacheKey, result);
      return result;
    }

    static async fetchServices(leadTypeId) {
      const cacheKey = generateCacheKey('services', leadTypeId);
      const cached = AppCache.get(cacheKey);
      if (cached) return cached;

      try {
        const response = await fetch("https://waterpurifierservicecenter.in/customer/ro_customer/all_services.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lead_type: leadTypeId }),
          next: { revalidate: 3600 }
        });

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        const services = data.service_details?.map(service => ({
          service_id: service.id,
          service_name: service.service_name,
          description: service.description,
          price: service.price,
          image_icon: service.image,
          status: "1"
        })) || [];

        AppCache.set(cacheKey, services);
        return services;
      } catch (error) {

        return [];
      }
    }

    static async fetchCities() {
      const cacheKey = 'all-cities';
      const cached = AppCache.get(cacheKey);
      if (cached) return cached;

      const snap = await getDocs(collection(db, "city_tb"));
      const cities = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      AppCache.set(cacheKey, cities, AppCache.TTL.LONG);
      return cities;
    }
  }

  // Metadata Service
  class MetadataService {
    static cache = new Map();

  static getDefaultMetadata() {
    return {
      title: "Home Services | Mannu Bhai",
      description: "Find trusted home service professionals near you",
      keywords: "home services, professionals, Mannu Bhai",
      charset: 'utf-8',
      viewport: {
        width: 'device-width',
        initialScale: 1,
        maximumScale: 5,
        userScalable: true,
      },
      robots: { index: true, follow: true },
      openGraph: {
        type: "website",
        images: [{
          url: DEFAULT_IMAGE,
          width: 1200,
          height: 630,
          alt: "Mannu Bhai Home Services",
        }],
      },
      twitter: {
        card: "summary_large_image",
      }
    };
  }
    static generateFAQSchema(faqData) {
      return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqData.map(faq => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
          }
        }))
      };
    }

    static generateBreadcrumbSchema(slug, cityDoc, catDoc) {
      return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": BASE_URL
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": cityDoc.city_name,
            "item": `${BASE_URL}/${cityDoc.city_url}`
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": catDoc.category_name,
            "item": `${BASE_URL}/${slug.join('/')}`
          }
        ]
      };
    }

    static generateLocalBusinessSchema(cityDoc, catDoc, canonicalUrl) {
      return {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": `Mannubhai ${catDoc.category_name} Service`,
        "image": LOGO_IMAGE,
        "url": canonicalUrl,
        "telephone": CONTACT_NUMBER,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": cityDoc.city_name,
          "addressRegion": cityDoc.city_name,
          "addressCountry": "IN"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "reviewCount": "10483"
        }
      };
    }

  static async generateForCity(slug, cityDoc) {
      const canonicalUrl = `${BASE_URL}/${slug.join('/')}`;
      
      return {
        title: cityDoc.meta_title || `${cityDoc.city_name} Home Services | Mannu Bhai`,
        description: cityDoc.meta_description || `Find trusted home service professionals in ${cityDoc.city_name}. Call ${CONTACT_NUMBER} for quick service.`,
        keywords: cityDoc.meta_keywords || `home services, ${cityDoc.city_name}, professionals, Mannu Bhai`,  charset: 'utf-8',  viewport: {
        width: 'device-width',
        initialScale: 1,
        maximumScale: 5,
        userScalable: true,
      },
        alternates: { canonical: canonicalUrl },
        robots: { index: true, follow: true },
        openGraph: {
          title: cityDoc.meta_title || `${cityDoc.city_name} Home Services | Mannu Bhai`,
          description: cityDoc.meta_description || `Find trusted home service professionals in ${cityDoc.city_name}`,
          url: canonicalUrl,
          images: [{
            url: cityDoc.image || DEFAULT_IMAGE,
            width: 1200,
            height: 630,
            alt: `Home services in ${cityDoc.city_name}`,
          }],
        },
        twitter: {
          card: "summary_large_image",
          title: cityDoc.meta_title || `${cityDoc.city_name} Home Services | Mannu Bhai`,
          description: cityDoc.meta_description || `Find trusted home service professionals in ${cityDoc.city_name}`,
          images: [cityDoc.image || DEFAULT_IMAGE],
        }
      };
    }

    static async generateForCategory(slug, catDoc, pageMasterDoc = null) {
      const canonicalUrl = `${BASE_URL}/${slug.join('/')}`;
      
      // Determine which meta fields to use (pageMasterDoc takes precedence over catDoc)
      const metaTitle = pageMasterDoc?.meta_title || catDoc.meta_title || `${catDoc.category_name} Services | Mannu Bhai`;
      const metaDescription = pageMasterDoc?.meta_description || catDoc.meta_description || `Professional ${catDoc.category_name} services across India. Call ${CONTACT_NUMBER} for assistance.`;
      const metaKeywords = pageMasterDoc?.meta_keywords || catDoc.meta_keywords || `${catDoc.category_name}, services, repair, maintenance`;
      
      return {
        title: metaTitle,
        description: metaDescription,
        keywords: metaKeywords,
        alternates: { canonical: canonicalUrl },
        robots: { index: true, follow: true },
        openGraph: {
          title: metaTitle,
          description: metaDescription,
          url: canonicalUrl,
          images: [{
            url: catDoc.image || DEFAULT_IMAGE,
            width: 1200,
            height: 630,
            alt: `${catDoc.category_name} services`,
          }],
        },
        twitter: {
          card: "summary_large_image",
          title: metaTitle,
          description: metaDescription,
          images: [catDoc.image || DEFAULT_IMAGE],
        }
      };
    }

  static async generateForCityCategory(slug, cityDoc, catDoc, pageMasterDoc = null) {
      const canonicalUrl = `${BASE_URL}/${slug.join('/')}`;
      
      // Always prioritize page_master_tb fields when available (for slug length 2)
      const metaTitle = pageMasterDoc?.meta_title || 
                      catDoc.meta_title || 
                      `${catDoc.category_name} Services in ${cityDoc.city_name} | MannuBhai`;
      
      const metaDescription = pageMasterDoc?.meta_description || 
                            catDoc.meta_description || 
                            `Professional ${catDoc.category_name} services in ${cityDoc.city_name}. Call ${CONTACT_NUMBER} for assistance.`;
      
      const metaKeywords = pageMasterDoc?.meta_keywords || 
                        catDoc.meta_keywords || 
                        `${catDoc.category_name}, ${cityDoc.city_name}, services, repair, maintenance`;

      // Determine image - prioritize pageMasterDoc image first
      const imageUrl = pageMasterDoc?.image || catDoc.image || cityDoc.image || DEFAULT_IMAGE;

      // Generate FAQ schema only when pageMasterDoc exists (slug length 2)
      let faqSchema = null;
      if (pageMasterDoc) {
        const faqData = [];
        for (let i = 1; pageMasterDoc[`faqquestion${i}`] && pageMasterDoc[`faqanswer${i}`]; i++) {
          faqData.push({
            question: pageMasterDoc[`faqquestion${i}`],
            answer: pageMasterDoc[`faqanswer${i}`]
          });
        }
        if (faqData.length > 0) {
          faqSchema = this.generateFAQSchema(faqData);
        }
      }

      // Generate breadcrumb schema (only relevant for slug length 2)
      const breadcrumbSchema = this.generateBreadcrumbSchema(slug, cityDoc, catDoc);

      // Generate local business schema
      const localBusinessSchema = this.generateLocalBusinessSchema(cityDoc, catDoc, canonicalUrl);

      // Combine all schemas
      const schemas = [breadcrumbSchema, localBusinessSchema];
      if (faqSchema) schemas.push(faqSchema);

      return {
        title: metaTitle,
        description: metaDescription,
        keywords: metaKeywords,
        alternates: { canonical: canonicalUrl },
        robots: { index: true, follow: true },
        openGraph: {
          title: metaTitle,
          description: metaDescription,
          url: canonicalUrl,
          images: [{
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: `${catDoc.category_name} services in ${cityDoc.city_name}`,
          }],
        },
        twitter: {
          card: "summary_large_image",
          title: metaTitle,
          description: metaDescription,
          images: [imageUrl],
        },
        other: {
          // Include all schemas in the metadata
          ...(schemas.length > 0 && {
            schemaJson: schemas
          })
        }
      };
  }
    static async generate({ params }) {
      const { slug = [] } = params;
      const cacheKey = `metadata-${slug.join('-') || 'home'}`;
      
      // Clear cache for development (optional)
      if (process.env.NODE_ENV === 'development') {
        this.cache.delete(cacheKey);
      }

      // Return cached if available
      if (this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey);
      }

      // Home page case
      if (slug.length === 0) {
        const result = {
          ...this.getDefaultMetadata(),
          alternates: { canonical: BASE_URL }
        };
        this.cache.set(cacheKey, result);
        return result;
      }

      // City page case (e.g., /delhi)
      if (slug.length === 1) {
        const [segment] = slug;
        
        try {
          const [cityDoc, catDoc] = await Promise.all([
            DataService.fetchDocument("city_tb", "city_url", segment),
            DataService.fetchDocument("category_manage", "category_url", segment),
          ]);

          if (cityDoc) {
            const result = await this.generateForCity(slug, cityDoc);
            this.cache.set(cacheKey, result);
            return result;
          }
          
          if (catDoc) {
            const result = await this.generateForCategory(slug, catDoc);
            this.cache.set(cacheKey, result);
            return result;
          }
        } catch (error) {

        }
      }

      // City + Category page case (e.g., /delhi/water-purifier-repair)
      if (slug.length === 2) {
        const [citySeg, catSeg] = slug;
        
        try {
          const [cityDoc, catDoc] = await Promise.all([
            DataService.fetchDocument("city_tb", "city_url", citySeg),
            DataService.fetchDocument("category_manage", "category_url", catSeg),
          ]);

          if (cityDoc && catDoc) {
            const pageMasterDoc = await DataService.fetchPageMaster(cityDoc.id, catDoc.id);
            const result = await this.generateForCityCategory(slug, cityDoc, catDoc, pageMasterDoc);
            this.cache.set(cacheKey, result);
            return result;
          }
        } catch (error) {
      
        }
      }
      // Fallback case
      const result = {
        ...this.getDefaultMetadata(),
        alternates: { canonical: `${BASE_URL}/${slug.join('/')}` }
      };
      this.cache.set(cacheKey, result);
      return result;
    }
  }
  export async function generateMetadata({ params }) {
    return MetadataService.generate({ params });
  }
  // Main Page Component
  export default async function DynamicRouteHandler({ params, searchParams }) {
    const { slug = [] } = params;
    const { city: cityQueryParam } = searchParams;
    const normalizedSlug = slug.map(normalizeUrlSegment);
    if (slug.length === 0) notFound();
    try {
      const cities = await DataService.fetchCities();
      // Handle city query parameter redirect
      if (cityQueryParam) {
        const normalizedQueryParam = normalizeUrlSegment(cityQueryParam);
        const selectedCity = cities.find(c => 
          [normalizeUrlSegment(c.city_name), normalizeUrlSegment(c.city_url)]
            .includes(normalizedQueryParam)
        );
        
        if (selectedCity) {
          redirect(`/${selectedCity.city_url.toLowerCase()}`);
        }
      }
      // City page (e.g., /delhi)
      if (normalizedSlug.length === 1) {
        const [segment] = normalizedSlug;
        
        const [cityDoc, catDoc] = await Promise.all([
          DataService.fetchDocument("city_tb", "city_url", segment),
          DataService.fetchDocument("category_manage", "category_url", segment),
        ]);
        if (cityDoc) {
          return (
            <>
              <components.CityDetails city={cityDoc} />
              <components.CityAccordion cities={cities} currentCity={cityDoc} />
            </>
          );
        }
        
        if (catDoc) {
          const services = await DataService.fetchServices(catDoc.lead_type_id);
          return <components.CategoryDetails category={{ ...catDoc, services }} />;
        }
        notFound();
      }


        if (normalizedSlug.length === 2) {
          const [citySeg, catSeg] = normalizedSlug;
          const [cityDoc, catDoc] = await Promise.all([
            DataService.fetchDocument("city_tb", "city_url", citySeg),
            DataService.fetchDocument("category_manage", "category_url", catSeg),
          ]);
          
          if (!cityDoc || !catDoc) notFound();
          
          const [pageMasterDoc, services] = await Promise.all([
            DataService.fetchPageMaster(cityDoc.id, catDoc.id),
            DataService.fetchServices(catDoc.lead_type_id)
          ]);
          if (pageMasterDoc?.group_category === "5" && pageMasterDoc?.status !== "0") {
          redirect("/410");
           }

          // Generate FAQ data (only for slug length 2)
          const faqData = [];
          if (pageMasterDoc) {
            for (let i = 1; pageMasterDoc[`faqquestion${i}`] && pageMasterDoc[`faqanswer${i}`]; i++) {
              faqData.push({
                question: pageMasterDoc[`faqquestion${i}`],
                answer: pageMasterDoc[`faqanswer${i}`]
              });
            }
          }

          return (
            <>
              <components.CategoryDetails 
                category={{ 
                  ...(pageMasterDoc || catDoc), // Spread pageMasterDoc first to prioritize its fields
                  services,
                  category_name: catDoc.category_name,
                  banner: catDoc.banner,
                  cityDoc,
                  // Meta fields from pageMasterDoc take precedence
                  meta_title: pageMasterDoc?.meta_title || catDoc.meta_title,
                  meta_description: pageMasterDoc?.meta_description || catDoc.meta_description,
                  meta_keywords: pageMasterDoc?.meta_keywords || catDoc.meta_keywords,
                }} 
                city={cityDoc}
              />
              
              {/* Only show FAQ section if we have FAQ data */}
              {faqData.length > 0 && <components.FAQSection faqData={faqData} />}
              
              {/* Only show page content if we have it from page_master_tb */}
              {pageMasterDoc?.page_content && (
                <div className="page-content my-8 px-4 max-w-6xl mx-auto">
                  <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    About {cityDoc.city_name} - {catDoc.category_name}
                  </h2>
                  <div 
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: pageMasterDoc.page_content }} 
                  />
                </div>
              )}
              
              <components.CityAccordion cities={cities} currentCity={cityDoc} />
            </>
          );
        }

      notFound();
    } catch (error) {
  
      throw error;
    }
  }

  export const dynamicParams = true;
  export const revalidate = 3600;
  export const fetchCache = 'force-cache';