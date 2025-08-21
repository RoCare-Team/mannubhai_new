import { notFound, redirect } from "next/navigation";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../app/firebaseConfig";
import dynamic from 'next/dynamic';

const BASE_URL = "https://www.mannubhai.com";
const DEFAULT_IMAGE = "/default-service.jpg";
const LOGO_IMAGE = `${BASE_URL}/logo.png`;
const CONTACT_NUMBER = "+91-7065012902";

const components = {
  LogoLoader: dynamic(() => import('@/components/LogoLoader'), { ssr: true }),
  FAQSection: dynamic(() => import('@/components/FAQSection'), { ssr: true, loading: () => <components.LogoLoader /> }),
  CityDetails: dynamic(() => import('@/components/CityDetails'), { ssr: true, loading: () => <components.LogoLoader /> }),
  CategoryDetails: dynamic(() => import('@/components/CategoryDetails'), { ssr: true, loading: () => <components.LogoLoader /> }),
  CityAccordion: dynamic(() => import('@/components/CityAccordion'), {
    ssr: true, // Explicitly disable SSR for this component
    loading: () => <div className="min-h-[200px] flex items-center justify-center">Loading nearby cities...</div>
  })
};

// --- AppCache can remain the same ---
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
    if (this.instance.size > 100) {
      Array.from(this.instance.keys()).slice(0, 20).forEach(k => this.instance.delete(k));
    }
  }
}

// --- Helper Functions ---
const sanitizeData = (data) => {
  if (!data) return data;
  if (Array.isArray(data)) {
    return data.map(item => sanitizeData(item));
  }
  if (typeof data === 'object' && data !== null) {
    if (data.seconds !== undefined && data.nanoseconds !== undefined && typeof data.toDate === 'function') {
      return data.toDate().toISOString();
    }
    const sanitizedObject = {};
    for (const key in data) {
      sanitizedObject[key] = sanitizeData(data[key]);
    }
    return sanitizedObject;
  }
  return data;
};

const normalizeUrlSegment = (segment) =>
  segment?.toLowerCase().trim().replace(/\s+/g, '-') || '';

const generateCacheKey = (prefix, ...args) =>
  `${prefix}-${args.map(arg => normalizeUrlSegment(arg)).join('-')}`;

// --- DataService is now cleaner without fetchCities ---
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
    const sanitizedResult = sanitizeData(result);
    AppCache.set(cacheKey, sanitizedResult);
    return sanitizedResult;
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
    const sanitizedResult = sanitizeData(result);
    AppCache.set(cacheKey, sanitizedResult);
    return sanitizedResult;
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
      console.error("Failed to fetch services:", error);
      return [];
    }
  }
}

// --- MetadataService remains the same ---
class MetadataService {
    static cache = new Map();
  
    static getDefaultMetadata() {
      return {
        title: "Home Services | Mannu Bhai",
        description: "Find trusted home service professionals near you",
        keywords: "home services, professionals, Mannu Bhai",
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
          { "@type": "ListItem", "position": 1, "name": "Home", "item": BASE_URL },
          { "@type": "ListItem", "position": 2, "name": cityDoc.city_name, "item": `${BASE_URL}/${cityDoc.city_url}` },
          { "@type": "ListItem", "position": 3, "name": catDoc.category_name, "item": `${BASE_URL}/${slug.join('/')}` }
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
  const cityName = cityDoc.city_name; // dynamic city

  return {
    title:`MannuBhai - Get Specialist Services At Doorstep in ${cityName}`,
    description:`Get trusted home appliance, beauty care, home care, and handyman services in ${cityName} with MannuBhai’s globally trained and verified professionals at your doorstep.`,
    keywords: `mannubhai service ${cityName.toLowerCase()}, Professional Services ${cityName.toLowerCase()}, appliance repair service at home in ${cityName}, beauty service at home in ${cityName}, home care service in ${cityName}, handyman services in ${cityName}`,
    
    alternates: { canonical: canonicalUrl },
    robots: { index: true, follow: true },
    
    openGraph: {
      title: cityDoc.meta_title || `MannuBhai - Get Specialist Services At Doorstep in ${cityName}`,
      description: cityDoc.meta_description || `Get trusted home appliance, beauty care, home care, and handyman services in ${cityName} with MannuBhai’s globally trained and verified professionals at your doorstep.`,
      url: canonicalUrl,
      images: [
        {
          url: cityDoc.image || DEFAULT_IMAGE,
          width: 1200,
          height: 630,
          alt: `Home services in ${cityName}`
        }
      ],
    },
    
    twitter: {
      card: "summary_large_image",
      title: cityDoc.meta_title || `MannuBhai - Get Specialist Services At Doorstep in ${cityName}`,
      description: cityDoc.meta_description || `Get trusted home appliance, beauty care, home care, and handyman services in ${cityName} with MannuBhai’s globally trained and verified professionals at your doorstep.`,
      images: [cityDoc.image || DEFAULT_IMAGE],
    }
  };
}

  
    static async generateForCategory(slug, catDoc, pageMasterDoc = null) {
      const canonicalUrl = `${BASE_URL}/${slug.join('/')}`;
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
          images: [{ url: catDoc.image || DEFAULT_IMAGE, width: 1200, height: 630, alt: `${catDoc.category_name} services` }],
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
      const metaTitle = pageMasterDoc?.meta_title || catDoc.meta_title || `${catDoc.category_name} Services in ${cityDoc.cityName} | MannuBhai`;
      const metaDescription = pageMasterDoc?.meta_description || catDoc.meta_description || `Professional ${catDoc.category_name} services in ${cityDoc.cityName}. Call ${CONTACT_NUMBER} for assistance.`;
      const metaKeywords = pageMasterDoc?.meta_keywords || catDoc.meta_keywords || `${catDoc.category_name}, ${cityDoc.cityName}, services, repair, maintenance`;
      const imageUrl = pageMasterDoc?.image || catDoc.image || cityDoc.image || DEFAULT_IMAGE;
  
      let faqSchema = null;
      if (pageMasterDoc) {
        const faqData = [];
        for (let i = 1; pageMasterDoc[`faqquestion${i}`] && pageMasterDoc[`faqanswer${i}`]; i++) {
          faqData.push({ question: pageMasterDoc[`faqquestion${i}`], answer: pageMasterDoc[`faqanswer${i}`] });
        }
        if (faqData.length > 0) {
          faqSchema = this.generateFAQSchema(faqData);
        }
      }
  
      const breadcrumbSchema = this.generateBreadcrumbSchema(slug, cityDoc, catDoc);
      const localBusinessSchema = this.generateLocalBusinessSchema(cityDoc, catDoc, canonicalUrl);
      
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
          images: [{ url: imageUrl, width: 1200, height: 630, alt: `${catDoc.category_name} services in ${cityDoc.city_name}` }],
        },
        twitter: {
          card: "summary_large_image",
          title: metaTitle,
          description: metaDescription,
          images: [imageUrl],
        },
        other: {
          'script:ld+json': JSON.stringify(schemas)
        }
      };
    }
  
    static async generate({ params }) {
      const resolvedParams = await params;
      const { slug = [] } = resolvedParams;
      const cacheKey = `metadata-${slug.join('-') || 'home'}`;
      if (process.env.NODE_ENV === 'development') {
        this.cache.delete(cacheKey);
      }
      if (this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey);
      }
  
      if (slug.length === 0) {
        const result = { ...this.getDefaultMetadata(), alternates: { canonical: BASE_URL } };
        this.cache.set(cacheKey, result);
        return result;
      }
  
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
          console.error('Metadata generation error:', error);
        }
      }
  
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
          console.error('Metadata generation error:', error);
        }
      }
  
      const result = { ...this.getDefaultMetadata(), alternates: { canonical: `${BASE_URL}/${slug.join('/')}` } };
      this.cache.set(cacheKey, result);
      return result;
    }
}

export async function generateMetadata({ params }) {
  return MetadataService.generate({ params });
}

export default async function DynamicRouteHandler({ params, searchParams }) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const { slug = [] } = resolvedParams;
  const { city: cityQueryParam } = resolvedSearchParams;
  const normalizedSlug = slug.map(normalizeUrlSegment);
  // console.log(normalizedSlug+"this is beaut")

  if (slug.length === 0) notFound();

  try {
    // The redirect logic now needs to fetch cities on its own if a query param exists.
    if (cityQueryParam) {
      const normalizedQueryParam = normalizeUrlSegment(cityQueryParam);
      const citiesSnap = await getDocs(collection(db, "city_tb"));
      const cities = citiesSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      const selectedCity = cities.find(c =>
        [normalizeUrlSegment(c.city_name), normalizeUrlSegment(c.city_url)]
          .includes(normalizedQueryParam)
      );
      if (selectedCity) {
        redirect(`/${selectedCity.city_url.toLowerCase()}`);
      }
    }

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
            {/* The 'cities' prop is removed. The component will fetch its own data. */}
            <components.CityAccordion currentCity={cityDoc} />
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

      if (
        (pageMasterDoc?.group_category === "5" && pageMasterDoc?.status !== "0") ||
        (pageMasterDoc?.group_category === "6" && pageMasterDoc?.status !== "1")
      ) {
        redirect("/410");
      }

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
              ...(pageMasterDoc || catDoc),
              services,
              category_name: catDoc.category_name,
              banner: catDoc.banner,
              cityDoc,
              meta_title: pageMasterDoc?.meta_title || catDoc.meta_title,
              meta_description: pageMasterDoc?.meta_description || catDoc.meta_description,
              meta_keywords: pageMasterDoc?.meta_keywords || catDoc.meta_keywords,
            }}
            city={cityDoc}
          />
          {faqData.length > 0 && <components.FAQSection faqData={faqData} />}
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
          {/* The 'cities' prop is removed. The component will fetch its own data. */}
          <components.CityAccordion currentCity={cityDoc} />
        </>
      );
    }

    notFound();
  } catch (error) {
    console.error('Route handler error:', error);
    throw error;
  }
}

export const dynamicParams = true;
export const revalidate = 3600;
export const fetchCache = 'force-cache';
