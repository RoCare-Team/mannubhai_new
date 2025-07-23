// src/app/[...slug]/metadata.js
import DataService from "../lib/services/DataService";
import { normalizeUrlSegment } from "../lib/utils/urlUtils";

export async function generateMetadata({ params, searchParams }) {
  const { slug = [] } = params;
  const { city: cityQueryParam } = searchParams;
  const normalizedSlug = slug.map(normalizeUrlSegment);

  try {
    // Handle city query parameter redirects first
    if (cityQueryParam) {
      const cities = await DataService.fetchCities();
      const normalizedQueryParam = normalizeUrlSegment(cityQueryParam);
      const selectedCity = cities.find(c => 
        [normalizeUrlSegment(c.city_name), normalizeUrlSegment(c.city_url)]
          .includes(normalizedQueryParam)
      );
      if (selectedCity) {
        return {
          title: `${selectedCity.city_name} Services`,
          description: `Best services in ${selectedCity.city_name}`,
        };
      }
    }

    // Handle regular slug-based routes
    if (normalizedSlug.length === 1) {
      const [cityDoc, catDoc] = await Promise.all([
        DataService.fetchDocument("city_tb", "city_url", normalizedSlug[0]),
        DataService.fetchDocument("category_manage", "category_url", normalizedSlug[0]),
      ]);

      if (cityDoc) {
        return {
          title: cityDoc.meta_title || `${cityDoc.city_name} Services`,
          description: cityDoc.meta_description || `Services in ${cityDoc.city_name}`,
          keywords: cityDoc.meta_keywords,
          openGraph: {
            images: cityDoc.banner ? [{ url: cityDoc.banner }] : [],
          },
        };
      }

      if (catDoc) {
        return {
          title: catDoc.meta_title || `${catDoc.category_name} Services`,
          description: catDoc.meta_description || `${catDoc.category_name} services`,
          keywords: catDoc.meta_keywords,
          openGraph: {
            images: catDoc.banner ? [{ url: catDoc.banner }] : [],
          },
        };
      }
    }

    if (normalizedSlug.length === 2) {
      const [cityDoc, catDoc] = await Promise.all([
        DataService.fetchDocument("city_tb", "city_url", normalizedSlug[0]),
        DataService.fetchDocument("category_manage", "category_url", normalizedSlug[1]),
      ]);

      if (cityDoc && catDoc) {
        const pageMasterDoc = await DataService.fetchPageMaster(cityDoc.id, catDoc.id);
        return {
          title: pageMasterDoc?.meta_title || `${catDoc.category_name} in ${cityDoc.city_name}`,
          description: pageMasterDoc?.meta_description || `${catDoc.category_name} services in ${cityDoc.city_name}`,
          keywords: pageMasterDoc?.meta_keywords,
          openGraph: {
            images: catDoc.banner ? [{ url: catDoc.banner }] : [],
          },
        };
      }
    }

    return {
      title: 'Services Directory',
      description: 'Find the best services in your city',
    };
  } catch (error) {
    console.error('Metadata generation error:', error);
    return {
      title: 'Services',
      description: 'Find local services',
    };
  }
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;