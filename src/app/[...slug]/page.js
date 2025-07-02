import React from "react";
import { notFound } from "next/navigation";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../app/firebaseConfig";
import CityDetails from "@/components/CityDetails";
import CategoryDetails from "@/components/CategoryDetails";
import CityAccordion from "@/components/CityAccordion";

// Helper functions moved outside component
const fetchDoc = async (col, field, val) => {
  const q = query(collection(db, col), where(field, "==", val));
  const snap = await getDocs(q);
  return snap.empty ? null : { id: snap.docs[0].id, ...snap.docs[0].data() };
};

const fetchServices = async (leadTypeId) => {
  try {
    const response = await fetch("https://waterpurifierservicecenter.in/customer/ro_customer/all_services.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ lead_type: leadTypeId }),
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("API response JSON:", data);
    
    // Transform the API response to match your expected structure
    if (data.service_details) {
      return data.service_details.map(service => ({
        service_id: service.id,
        service_name: service.service_name,
        description: service.description,
        price: service.price,
        image_icon: service.image, // assuming this exists in the response
        status: "1" // assuming active status
      }));
    }
    return [];
  } catch (error) {
    console.error("Error fetching services from external API:", error);
    return [];
  }
};

const fetchCities = async () => {
  const snap = await getDocs(collection(db, "city_tb"));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

// Generate metadata for the page (unchanged)
export async function generateMetadata({ params }) {
  const { slug = [] } = params;
  const baseUrl = "https://mannubhai-new.vercel.app/";

  const defaultMetadata = {
    title: "Home Services | Mannu Bhai",
    description: "Find trusted home service professionals near you",
    robots: {
      index: false,
      follow: false,
    },

  };

  if (slug.length === 0) {
    return {
      ...defaultMetadata,
      alternates: { canonical: baseUrl },
      keywords: "home services, professionals, Mannu Bhai",
    };
  }

  try {
    if (slug.length === 1) {
      const [segment] = slug;
      const canonicalUrl = `${baseUrl}/${segment}`;

      const cityDoc = await fetchDoc("city_tb", "city_url", segment);
      if (cityDoc) {
        return {
          title: cityDoc.meta_title,
          description: cityDoc.meta_description,
          keywords: cityDoc.meta_keywords,
          alternates: { canonical: canonicalUrl },
          robots: { index: false, follow: false },
          openGraph: {
            title: cityDoc.meta_title,
            description: cityDoc.meta_description,
            url: canonicalUrl,
            images: [{ url: cityDoc.image || "/default-city.jpg", width: 1200, height: 630, alt: `Mannu Bhai services in ${cityDoc.city_name}` }],
          },
          twitter: {
            card: "summary_large_image",
            title: cityDoc.meta_title,
            description: cityDoc.meta_description,
            images: [cityDoc.image || "/default-city.jpg"],
          },
        };
      }

      const catDoc = await fetchDoc("category_manage", "category_url", segment);
      if (catDoc) {
        return {
          title: catDoc.meta_title,
          description: catDoc.meta_description,
          keywords: catDoc.meta_keywords,
          alternates: { canonical: canonicalUrl },
          robots: { index: false, follow: false },
          openGraph: {
            title: `${catDoc.category_name} Services | Mannu Bhai`,
            description: `Professional ${catDoc.category_name} services nationwide.`,
            url: canonicalUrl,
            images: [{ url: catDoc.image || "/default-category.jpg", width: 1200, height: 630, alt: `${catDoc.category_name} services` }],
          },
          twitter: {
            card: "summary_large_image",
            title: `${catDoc.category_name} Services | Mannu Bhai`,
            description: `Professional ${catDoc.category_name} services nationwide.`,
            images: [catDoc.image || "/default-category.jpg"],
          },
        };
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
        return {
          title: catDoc.meta_title,
          description: catDoc.meta_description,
          keywords: catDoc.meta_keywords,
          alternates: { canonical: canonicalUrl },
          robots: { index: false, follow: false },
          openGraph: {
            title: `${catDoc.category_name} Services in ${cityDoc.city_name} | Mannu Bhai`,
            description: `Top-rated ${catDoc.category_name} services in ${cityDoc.city_name}.`,
            url: canonicalUrl,
            images: [{ url: catDoc.image || "/default-service.jpg", width: 1200, height: 630, alt: `${catDoc.category_name} services in ${cityDoc.city_name}` }],
          },
          twitter: {
            card: "summary_large_image",
            title: `${catDoc.category_name} Services in ${cityDoc.city_name} | Mannu Bhai`,
            description: `Top-rated ${catDoc.category_name} services in ${cityDoc.city_name}.`,
            images: [catDoc.image || "/default-service.jpg"],
          },
        };
      }
    }
  } catch (error) {
    console.error("Error generating metadata:", error);
  }

  return {
    ...defaultMetadata,
    alternates: { canonical: `${baseUrl}/${slug.join('/')}` },
    keywords: "home services, professionals, Mannu Bhai",
  };
}

// Main component - now server component
export default async function DynamicRouteHandler({ params }) {
  const { slug = [] } = params;
  
  if (slug.length === 0) {
    notFound();
  }
  try {
    const cities = await fetchCities();
    
    // Single segment
    if (slug.length === 1) {
      const [segment] = slug;
      
      // Check for city
      const cityDoc = await fetchDoc("city_tb", "city_url", segment);
      if (cityDoc) {
        return (
          <>
            <CityDetails city={cityDoc} />
            <CityAccordion cities={cities} currentCity={cityDoc} />
          </>
        );
      }
      
      // Check for category
      const catDoc = await fetchDoc("category_manage", "category_url", segment);
      if (catDoc) {
        const services = await fetchServices(catDoc.lead_type_id);
        return <CategoryDetails category={{ ...catDoc, services }} />;
      }
      
      notFound();
    }
    
    // Two segments
    if (slug.length === 2) {
      const [citySeg, catSeg] = slug;
      
      const [cityDoc, catDoc] = await Promise.all([
        fetchDoc("city_tb", "city_url", citySeg),
        fetchDoc("category_manage", "category_url", catSeg),
      ]);
      
      if (cityDoc && catDoc) {
        const services = await fetchServices(catDoc.lead_type_id);
        return (
          <>
            <CategoryDetails 
              category={{ ...catDoc, services }} 
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
    }
    
    // More than two segments
    notFound();
    
  } catch (error) {
    console.error("Dynamic page error:", error);
    throw error; // This will show the error page
  }
}