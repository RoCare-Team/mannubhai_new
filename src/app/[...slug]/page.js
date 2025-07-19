import { notFound, redirect } from "next/navigation";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../app/firebaseConfig";
import dynamic from 'next/dynamic';

// Client Components
const LogoLoader = dynamic(() => import('@/components/LogoLoader'), {
  loading: () => <div className="min-h-[200px] flex items-center justify-center">Loading...</div>
});

const FAQSection = dynamic(() => import('@/components/FAQSection'), {
  loading: () => <LogoLoader />
});

const CityDetails = dynamic(() => import('@/components/CityDetails'), {
  loading: () => <LogoLoader />
});

const CategoryDetails = dynamic(() => import('@/components/CategoryDetails'), {
  loading: () => <LogoLoader />
});

const CityAccordion = dynamic(() => import('@/components/CityAccordion'), {
  loading: () => <LogoLoader />
});

// Cache Implementation
const cache = new Map();
const CACHE_TTL = {
  SHORT: 60 * 5,
  MEDIUM: 60 * 30,
  LONG: 60 * 60
};

const getCache = (key) => {
  const entry = cache.get(key);
  return entry && entry.expiry > Date.now() ? entry.value : null;
};

const setCache = (key, value, ttl = CACHE_TTL.MEDIUM) => {
  cache.set(key, { value, expiry: Date.now() + ttl * 1000 });
  if (cache.size > 100) {
    Array.from(cache.keys()).slice(0, 20).forEach(k => cache.delete(k));
  }
};

// Utility Functions
const normalizeUrlSegment = (segment) => 
  segment?.toLowerCase().trim().replace(/\s+/g, '-') || '';

// Data Fetching
const fetchDoc = async (col, field, val) => {
  const normalizedVal = normalizeUrlSegment(val);
  const cacheKey = `${col}-${field}-${normalizedVal}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;

  const q = query(collection(db, col));
  const snap = await getDocs(q);
  
  const doc = snap.docs.find(d => {
    const fieldValue = d.data()[field];
    return fieldValue && normalizeUrlSegment(fieldValue) === normalizedVal;
  });
  
  const result = doc ? { id: doc.id, ...doc.data() } : null;
  setCache(cacheKey, result, CACHE_TTL.MEDIUM);
  return result;
};

const fetchPageMaster = async (cityId, categoryId) => {
  const cacheKey = `page-master-${cityId}-${categoryId}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;

  const q = query(
    collection(db, "page_master_tb"),
    where("city_id", "==", cityId),
    where("category_id", "==", categoryId)
  );
  const snap = await getDocs(q);
  const result = snap.empty ? null : { id: snap.docs[0].id, ...snap.docs[0].data() };
  setCache(cacheKey, result, CACHE_TTL.MEDIUM);
  return result;
};

const fetchServices = async (leadTypeId) => {
  const cacheKey = `services-${leadTypeId}`;
  const cached = getCache(cacheKey);
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

    setCache(cacheKey, services, CACHE_TTL.MEDIUM);
    return services;
  } catch (error) {
    console.error("Error fetching services:", error);
    return [];
  }
};

const fetchCities = async () => {
  const cacheKey = 'all-cities';
  const cached = getCache(cacheKey);
  if (cached) return cached;

  const snap = await getDocs(collection(db, "city_tb"));
  const cities = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  setCache(cacheKey, cities, CACHE_TTL.LONG);
  return cities;
};

// Metadata Generation
const metadataCache = new Map();

export async function generateMetadata({ params }) {
  const { slug = [] } = params;
  const baseUrl = "https://www.mannubhai.com";
  const cacheKey = slug.join('-') || 'home';
  
  if (metadataCache.has(cacheKey)) {
    return metadataCache.get(cacheKey);
  }

  const defaultMetadata = {
    title: "Home Services | Mannu Bhai",
    description: "Find trusted home service professionals near you",
    robots: { index: true, follow: true },
  };

  if (slug.length === 0) {
    const result = {
      ...defaultMetadata,
      alternates: { canonical: baseUrl },
      keywords: "home services, professionals, Mannu Bhai",
    };
    metadataCache.set(cacheKey, result);
    return result;
  }

  try {
    if (slug.length === 2) {
      const [citySeg, catSeg] = slug;
      const canonicalUrl = `${baseUrl}/${citySeg}/${catSeg}`;

      const [cityDoc, catDoc] = await Promise.all([
        fetchDoc("city_tb", "city_url", citySeg),
        fetchDoc("category_manage", "category_url", catSeg),
      ]);

      if (cityDoc && catDoc) {
        const pageMasterDoc = await fetchPageMaster(cityDoc.id, catDoc.id);
        
        // Generate FAQ data from pageMasterDoc or use default FAQs
        const faqData = [];
        if (pageMasterDoc) {
          for (let i = 1; pageMasterDoc[`faqquestion${i}`] && pageMasterDoc[`faqanswer${i}`]; i++) {
            faqData.push({
              question: pageMasterDoc[`faqquestion${i}`],
              answer: pageMasterDoc[`faqanswer${i}`]
            });
          }
        }

        // Default FAQs if none found in pageMasterDoc
        const defaultFAQs = [
          {
            question: "Why should I get my water purifier serviced regularly?",
            answer: "Regular servicing ensures clean and safe drinking water, improves purifier efficiency, and extends the life of the appliance."
          },
          {
            question: "What types of water purifiers do you service in Delhi?",
            answer: "We service all major water purifier brands and models, including RO, UV, UF, and gravity-based purifiers."
          },
          {
            question: "How do I book a water purifier service with Mannubhai?",
            answer: "You can book easily online through our website or call our customer care number for instant assistance."
          }
        ];

        const finalFAQs = faqData.length > 0 ? faqData : defaultFAQs;

        // Generate structured data
        const structuredData = {
          localBusiness: {
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": `Mannubhai ${catDoc.category_name} Service`,
            "image": "https://www.mannubhai.com/assets/images/logo.png",
            "url": canonicalUrl,
            "telephone": "+91-7065012902",
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
          },
          breadcrumb: {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": `${baseUrl}/`
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": cityDoc.city_name,
                "item": `${baseUrl}/${cityDoc.city_url}/`
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": catDoc.category_name,
                "item": canonicalUrl
              }
            ]
          },
          faqPage: {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": finalFAQs.map(faq => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
              }
            }))
          }
        };

        const result = {
          title: pageMasterDoc?.meta_title || `${catDoc.category_name} Services in ${cityDoc.city_name} | Mannu Bhai`,
          description: pageMasterDoc?.meta_description || `Top-rated ${catDoc.category_name} services in ${cityDoc.city_name}`,
          keywords: pageMasterDoc?.meta_keywords || `${catDoc.category_name}, ${cityDoc.city_name}, services, repair`,
          alternates: { canonical: canonicalUrl },
          robots: { index: true, follow: true },
          other: {
            'local-business-ld+json': JSON.stringify(structuredData.localBusiness),
            'breadcrumb-ld+json': JSON.stringify(structuredData.breadcrumb),
            'faqpage-ld+json': JSON.stringify(structuredData.faqPage)
          },
          openGraph: {
            title: pageMasterDoc?.meta_title || `${catDoc.category_name} Services in ${cityDoc.city_name} | Mannu Bhai`,
            description: pageMasterDoc?.meta_description || `Top-rated ${catDoc.category_name} services in ${cityDoc.city_name}`,
            url: canonicalUrl,
            images: [{ 
              url: pageMasterDoc?.image || catDoc.image || "/default-service.jpg", 
              width: 1200, 
              height: 630, 
              alt: `${catDoc.category_name} services in ${cityDoc.city_name}` 
            }],
          },
          twitter: {
            card: "summary_large_image",
            title: pageMasterDoc?.meta_title || `${catDoc.category_name} Services in ${cityDoc.city_name} | Mannu Bhai`,
            description: pageMasterDoc?.meta_description || `Top-rated ${catDoc.category_name} services in ${cityDoc.city_name}`,
            images: [pageMasterDoc?.image || catDoc.image || "/default-service.jpg"],
          },
        };
        metadataCache.set(cacheKey, result);
        return result;
      }
    }
  } catch (error) {
    console.error("Error generating metadata:", error);
  }

  const result = {
    ...defaultMetadata,
    alternates: { canonical: `${baseUrl}/${slug.join('/')}` },
    keywords: "home services, professionals, Mannu Bhai",
  };
  metadataCache.set(cacheKey, result);
  return result;
}




// Main Component
export default async function DynamicRouteHandler({ params, searchParams }) {
  const { slug = [] } = params;
  const { city: cityQueryParam } = searchParams;
  const normalizedSlug = slug.map(segment => normalizeUrlSegment(segment));

  if (slug.length === 0) notFound();

  try {
    const cities = await fetchCities();
    
    if (cityQueryParam) {
      const normalizedQueryParam = normalizeUrlSegment(cityQueryParam);
      const selectedCity = cities.find(c => 
        normalizeUrlSegment(c.city_name) === normalizedQueryParam ||
        normalizeUrlSegment(c.city_url) === normalizedQueryParam
      );
      
      if (selectedCity) {
        redirect(`/${selectedCity.city_url.toLowerCase()}`);
      }
    }

    if (normalizedSlug.length === 1) {
      const [segment] = normalizedSlug;
      
      const [cityDoc, catDoc] = await Promise.all([
        fetchDoc("city_tb", "city_url", segment),
        fetchDoc("category_manage", "category_url", segment),
      ]);
      
      if (cityDoc) {
        return (
          <>
            <CityDetails city={cityDoc} />
            <CityAccordion cities={cities} currentCity={cityDoc} />
          </>
        );
      }
      
      if (catDoc) {
        const services = await fetchServices(catDoc.lead_type_id);
        return <CategoryDetails category={{ ...catDoc, services }} />;
      }
      
      notFound();
    }

    if (normalizedSlug.length === 2) {
      const [citySeg, catSeg] = normalizedSlug;
      
      const [cityDoc, catDoc] = await Promise.all([
        fetchDoc("city_tb", "city_url", citySeg),
        fetchDoc("category_manage", "category_url", catSeg),
      ]);
      
      if (!cityDoc || !catDoc) notFound();
      
      const [pageMasterDoc, services] = await Promise.all([
        fetchPageMaster(cityDoc.id, catDoc.id),
        fetchServices(catDoc.lead_type_id)
      ]);
      
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
          <CategoryDetails 
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
          
          {faqData.length > 0 && <FAQSection faqData={faqData} />}
          
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
          
          <CityAccordion cities={cities} currentCity={cityDoc} />
        </>
      );
    }
    
    notFound();
  } catch (error) {
    console.error("Dynamic page error:", error);
    throw error;
  }
}

export const dynamicParams = true;
export const revalidate = 3600;
export const fetchCache = 'force-cache';