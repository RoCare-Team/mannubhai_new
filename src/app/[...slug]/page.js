import React from "react";
import { notFound } from "next/navigation";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../app/firebaseConfig";
import dynamic from 'next/dynamic';

// Import your custom loader
import LogoLoader from '@/components/LogoLoader'; // Adjust path as needed

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
          title: cityDoc.meta_title,
          description: cityDoc.meta_description,
          keywords: cityDoc.meta_keywords,
          alternates: { canonical: canonicalUrl },
          robots: { index: true, follow: true },
          openGraph: {
            title: cityDoc.meta_title,
            description: cityDoc.meta_description,
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
            title: cityDoc.meta_title,
            description: cityDoc.meta_description,
            images: [cityDoc.image || "/default-city.jpg"],
          },
        };
        metadataCache.set(cacheKey, result);
        return result;
      }

      if (catDoc) {
        const result = {
          title: catDoc.meta_title,
          description: catDoc.meta_description,
          keywords: catDoc.meta_keywords,
          alternates: { canonical: canonicalUrl },
          robots: { index: true, follow: true },
          openGraph: {
            title: `${catDoc.category_name} Services | Mannu Bhai`,
            description: `Professional ${catDoc.category_name} services nationwide.`,
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
            title: `${catDoc.category_name} Services | Mannu Bhai`,
            description: `Professional ${catDoc.category_name} services nationwide.`,
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
        const result = {
          title: catDoc.meta_title,
          description: catDoc.meta_description,
          keywords: catDoc.meta_keywords,
          alternates: { canonical: canonicalUrl },
          robots: { index: true, follow: true },
          openGraph: {
            title: `${catDoc.category_name} Services in ${cityDoc.city_name} | Mannu Bhai`,
            description: `Top-rated ${catDoc.category_name} services in ${cityDoc.city_name}.`,
            url: canonicalUrl,
            images: [{ 
              url: catDoc.image || "/default-service.jpg", 
              width: 1200, 
              height: 630, 
              alt: `${catDoc.category_name} services in ${cityDoc.city_name}` 
            }],
          },
          twitter: {
            card: "summary_large_image",
            title: `${catDoc.category_name} Services in ${cityDoc.city_name} | Mannu Bhai`,
            description: `Top-rated ${catDoc.category_name} services in ${cityDoc.city_name}.`,
            images: [catDoc.image || "/default-service.jpg"],
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
      
      const services = await fetchServices(catDoc.lead_type_id);
      return (
        <>
          <CategoryDetails 
            category={{ ...catDoc, services}} 
            city={cityDoc} 
            meta_title={catDoc.meta_title}
            meta_description={catDoc.meta_description}
            meta_keywords={catDoc.meta_keywords}
          />
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