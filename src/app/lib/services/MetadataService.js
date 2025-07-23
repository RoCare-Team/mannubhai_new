// src/lib/services/MetadataService.js
export class MetadataService {
  static generateCityMetadata(city) {
    return {
      title: city.meta_title || `${city.city_name} | Your Site Name`,
      description: city.meta_description || `Services and information about ${city.city_name}`,
      keywords: city.meta_keywords || `${city.city_name}, services, local`,
      openGraph: {
        title: city.meta_title || `${city.city_name} | Your Site Name`,
        description: city.meta_description || `Services and information about ${city.city_name}`,
        url: `https://yourdomain.com/${city.city_url}`,
        images: city.banner ? [{ url: city.banner }] : [],
      },
    };
  }

  static generateCategoryMetadata(category) {
    return {
      title: category.meta_title || `${category.category_name} | Your Site Name`,
      description: category.meta_description || `Services for ${category.category_name}`,
      keywords: category.meta_keywords || `${category.category_name}, services, repair`,
      openGraph: {
        title: category.meta_title || `${category.category_name} | Your Site Name`,
        description: category.meta_description || `Services for ${category.category_name}`,
        url: `https://yourdomain.com/${category.category_url}`,
        images: category.banner ? [{ url: category.banner }] : [],
      },
    };
  }

  static generateCityCategoryMetadata({ city, category, pageMaster }) {
    return {
      title: pageMaster?.meta_title || `${category.category_name} in ${city.city_name} | Your Site Name`,
      description: pageMaster?.meta_description || `${category.category_name} services in ${city.city_name}`,
      keywords: pageMaster?.meta_keywords || `${category.category_name}, ${city.city_name}, services`,
      openGraph: {
        title: pageMaster?.meta_title || `${category.category_name} in ${city.city_name} | Your Site Name`,
        description: pageMaster?.meta_description || `${category.category_name} services in ${city.city_name}`,
        url: `https://yourdomain.com/${city.city_url}/${category.category_url}`,
        images: category.banner ? [{ url: category.banner }] : [],
      },
    };
  }

  static generateDefaultMetadata() {
    return {
      title: 'Your Site Name | Services',
      description: 'Find the best services in your city',
    };
  }
}