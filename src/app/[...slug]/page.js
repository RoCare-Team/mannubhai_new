import React from "react";
import { notFound } from "next/navigation";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../app/firebaseConfig";
import dynamic from 'next/dynamic';

import LogoLoader from '@/components/LogoLoader'; // Adjust path as needed

const FAQSection = dynamic(() => import('@/components/FAQSection'), {
  loading: () => <LogoLoader />
});
// Dynamically import components with your custom loading states
const CityDetails = dynamic(() => import("@/components/CityDetails"), {
  loading: () => <LogoLoader />
});

const CategoryDetails = dynamic(() => import("@/components/CategoryDetails"), {
  loading: () => <LogoLoader />
});

const CityAccordion = dynamic(() => import("@/components/CityAccordion"), {
  loading: () => <LogoLoader />
});

// Simple in-memory cache implementation
const cache = new Map();
const CACHE_TTL = {
  SHORT: 60 * 5, // 5 minutes
  MEDIUM: 60 * 30, // 30 minutes
  LONG: 60 * 60 // 1 hour
};
export const revalidate = 3600;
const getCache = (key) => cache.get(key);
const setCache = (key, value, ttl) => {
  cache.set(key, value);
  setTimeout(() => cache.delete(key), ttl * 1000);
};

// Optimized fetchDoc function with caching
const fetchDoc = async (col, field, val) => {
  const cacheKey = `${col}-${field}-${val}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;

  const q = query(collection(db, col), where(field, "==", val));
  const snap = await getDocs(q);
  const result = snap.empty ? null : { id: snap.docs[0].id, ...snap.docs[0].data() };
  
  setCache(cacheKey, result, CACHE_TTL.MEDIUM);
  return result;
};

// New function to fetch from page_master_tb
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
// Optimized external API call with timeout and caching
const fetchServices = async (leadTypeId) => {
  const cacheKey = `services-${leadTypeId}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

    const response = await fetch("https://waterpurifierservicecenter.in/customer/ro_customer/all_services.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lead_type: leadTypeId }),
      signal: controller.signal,
      next: { revalidate: 3600 } // Revalidate every hour
    });

    clearTimeout(timeoutId);

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

// Fetch cities with caching
const fetchCities = async () => {
  const cacheKey = 'all-cities';
  const cached = getCache(cacheKey);
  if (cached) return cached;

  const snap = await getDocs(collection(db, "city_tb"));
  const cities = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  
  setCache(cacheKey, cities, CACHE_TTL.LONG);
  return cities;
};

// Cache metadata generation
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
    if (slug.length === 1) {
      const [segment] = slug;
      const canonicalUrl = `${baseUrl}/${segment}`;

      const [cityDoc, catDoc] = await Promise.all([
        fetchDoc("city_tb", "city_url", segment),
        fetchDoc("category_manage", "category_url", segment),
      ]);

      if (cityDoc) {
        const result = {
          title: cityDoc.meta_title || `${cityDoc.city_name} Services | Mannu Bhai`,
          description: cityDoc.meta_description || `Find trusted service professionals in ${cityDoc.city_name}`,
          keywords: cityDoc.meta_keywords || `${cityDoc.city_name}, services, home repair, ${cityDoc.city_name} professionals`,
          alternates: { canonical: canonicalUrl },
          robots: { index: true, follow: true },
          openGraph: {
            title: cityDoc.meta_title || `${cityDoc.city_name} Services | Mannu Bhai`,
            description: cityDoc.meta_description || `Find trusted service professionals in ${cityDoc.city_name}`,
            url: canonicalUrl,
            images: [{ 
              url: cityDoc.image || "/default-city.jpg", 
              width: 1200, 
              height: 630, 
              alt: `Mannu Bhai services in ${cityDoc.city_name}` 
            }],
          },
          twitter: {
            card: "summary_large_image",
            title: cityDoc.meta_title || `${cityDoc.city_name} Services | Mannu Bhai`,
            description: cityDoc.meta_description || `Find trusted service professionals in ${cityDoc.city_name}`,
            images: [cityDoc.image || "/default-city.jpg"],
          },
        };
        metadataCache.set(cacheKey, result);
        return result;
      }

      if (catDoc) {
        const result = {
          title: catDoc.meta_title || `${catDoc.category_name} Services | Mannu Bhai`,
          description: catDoc.meta_description || `Professional ${catDoc.category_name} services nationwide`,
          keywords: catDoc.meta_keywords || `${catDoc.category_name}, services, repair, professionals`,
          alternates: { canonical: canonicalUrl },
          robots: { index: true, follow: true },
          openGraph: {
            title: catDoc.meta_title || `${catDoc.category_name} Services | Mannu Bhai`,
            description: catDoc.meta_description || `Professional ${catDoc.category_name} services nationwide`,
            url: canonicalUrl,
            images: [{ 
              url: catDoc.image || "/default-category.jpg", 
              width: 1200, 
              height: 630, 
              alt: `${catDoc.category_name} services` 
            }],
          },
          twitter: {
            card: "summary_large_image",
            title: catDoc.meta_title || `${catDoc.category_name} Services | Mannu Bhai`,
            description: catDoc.meta_description || `Professional ${catDoc.category_name} services nationwide`,
            images: [catDoc.image || "/default-category.jpg"],
          },
        };
        metadataCache.set(cacheKey, result);
        return result;
      }
    }

    if (slug.length === 2) {
      const [citySeg, catSeg] = slug;
      const canonicalUrl = `${baseUrl}/${citySeg}/${catSeg}`;

      const [cityDoc, catDoc] = await Promise.all([
        fetchDoc("city_tb", "city_url", citySeg),
        fetchDoc("category_manage", "category_url", catSeg),
      ]);

      if (cityDoc && catDoc) {
        // Fetch from page_master_tb for combined city+category pages
        const pageMasterDoc = await fetchPageMaster(cityDoc.id, catDoc.id);
        
        const result = {
          title: pageMasterDoc?.meta_title || `${catDoc.category_name} Services in ${cityDoc.city_name} | Mannu Bhai`,
          description: pageMasterDoc?.meta_description || `Top-rated ${catDoc.category_name} services in ${cityDoc.city_name}`,
          keywords: pageMasterDoc?.meta_keywords || `${catDoc.category_name}, ${cityDoc.city_name}, services, repair`,
          alternates: { canonical: canonicalUrl },
          robots: { index: true, follow: true },
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

export default async function DynamicRouteHandler({ params }) {
  const { slug = [] } = params;
  
  if (slug.length === 0) notFound();

  try {
    // Start fetching cities immediately as they're needed in most cases
    const citiesPromise = fetchCities();
    
    if (slug.length === 1) {
      const [segment] = slug;
      
      const [cityDoc, catDoc] = await Promise.all([
        fetchDoc("city_tb", "city_url", segment),
        fetchDoc("category_manage", "category_url", segment),
      ]);
      
      const cities = await citiesPromise;
      
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
    if (slug.length === 2) {
      const [citySeg, catSeg] = slug;
      
      const [cityDoc, catDoc, cities] = await Promise.all([
        fetchDoc("city_tb", "city_url", citySeg),
        fetchDoc("category_manage", "category_url", catSeg),
        citiesPromise,
      ]);
      
      if (!cityDoc || !catDoc) notFound();
      
      // Fetch from page_master_tb for combined city+category pages
      const pageMasterDoc = await fetchPageMaster(cityDoc.id, catDoc.id);
      const services = await fetchServices(catDoc.lead_type_id);
      const prepareFAQ = (doc) => {
        const faqs = [];
        let i = 1;
        while (doc[`faqquestion${i}`] && doc[`faqanswer${i}`]) {
          faqs.push({
            question: doc[`faqquestion${i}`],
            answer: doc[`faqanswer${i}`]
          });
          i++;
        }
        return faqs;
      };
      
      const faqData = pageMasterDoc ? prepareFAQ(pageMasterDoc) : [];
      return (
        <>
          <CategoryDetails 
            category={{ 
              ...(pageMasterDoc || catDoc),
              services,
              meta_title: pageMasterDoc?.meta_title || catDoc.meta_title,
              meta_description: pageMasterDoc?.meta_description || catDoc.meta_description,
              meta_keywords: pageMasterDoc?.meta_keywords || catDoc.meta_keywords,
            }} 
            city={cityDoc}
          />
           {/* FAQ Section - Updated for your data structure */}
       {faqData.length > 0 && <FAQSection faqData={faqData} />}
          {/* Page Content Section - Hidden since your data shows page_content is null */}
{pageMasterDoc?.page_content && (
  <div className="page-content my-8 px-4 max-w-6xl mx-auto">
    <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
      About  {cityDoc.city_name} - {catDoc.category_name}
    </h2>
    <div 
      className="prose max-w-none
        [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:my-6 [&_h2]:pb-2 
        [&_h2]:border-b-2 [&_h2]:border-gradient [&_h2]:from-blue-500 [&_h2]:to-purple-500
        [&_h2]:bg-clip-text [&_h2]:text-transparent [&_h2]:bg-gradient-to-r
        [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:my-4 [&_h3]:text-blue-700
        [&_p]:my-4 [&_p]:text-gray-800 [&_p]:leading-relaxed [&_p]:text-justify
        [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-4 [&_ul]:space-y-2
        [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-4 [&_ol]:space-y-2
        [&_li]:my-2 [&_li]:pl-2 [&_li]:transition-colors [&_li]:hover:text-blue-600
        [&_a]:text-blue-600 [&_a]:hover:text-blue-800 [&_a]:underline [&_a]:font-medium [&_a]:transition-colors
        [&_blockquote]:border-l-4 [&_blockquote]:border-purple-500 [&_blockquote]:pl-4 [&_blockquote]:italic 
        [&_blockquote]:text-gray-700 [&_blockquote]:bg-purple-50 [&_blockquote]:py-2 [&_blockquote]:rounded-r-lg
        [&_img]:rounded-xl [&_img]:shadow-lg [&_img]:my-6 [&_img]:transition-all [&_img]:hover:scale-[1.02] [&_img]:hover:shadow-xl
        [&_table]:border-collapse [&_table]:w-full [&_table]:my-6 [&_table]:shadow-md [&_table]:rounded-lg [&_table]:overflow-hidden
        [&_th]:bg-gradient-to-r [&_th]:from-blue-500 [&_th]:to-purple-500 [&_th]:p-3 [&_th]:text-left [&_th]:text-white [&_th]:font-bold
        [&_td]:p-3 [&_td]:border [&_td]:border-gray-200 [&_td]:even:bg-gray-50
        [&_pre]:bg-gray-800 [&_pre]:text-gray-100 [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto
        [&_code]:bg-gray-100 [&_code]:text-gray-800 [&_code]:px-2 [&_code]:py-1 [&_code]:rounded [&_code]:text-sm
        [&_hr]:my-8 [&_hr]:border-t-2 [&_hr]:border-gray-200 [&_hr]:rounded-full
        hover:[&_img]:shadow-xl transition-all duration-300"
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