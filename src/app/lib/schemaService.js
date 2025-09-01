const BASE_URL = "https://www.mannubhai.com";
const LOGO_IMAGE = `${BASE_URL}/assets/images/logo.png`;
const CONTACT_NUMBER = "+91-7065012902";

export class SchemaService {
  static generateFAQSchema(faqData) {
    if (!faqData || faqData.length === 0) return null;
    
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

  static generateLocalBusinessSchema(cityDoc, catDoc, canonicalUrl) {
    return {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": `Mannubhai ${catDoc.category_name}`,
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

  static generateCityCategorySchemas(slug, cityDoc, catDoc, faqData = []) {
    const canonicalUrl = `${BASE_URL}/${slug.join('/')}`;
    const schemas = [];

    // Add LocalBusiness schema (Rating schema)
    schemas.push(this.generateLocalBusinessSchema(cityDoc, catDoc, canonicalUrl));
    
    // Add FAQ schema if FAQ data exists
    const faqSchema = this.generateFAQSchema(faqData);
    if (faqSchema) {
      schemas.push(faqSchema);
    }

    return schemas; 
  }

static generateSchemaScript(schemas) {
  if (!schemas || schemas.length === 0) return null;
  
  return schemas.map(schema => JSON.stringify(schema, null, 2)).join('\n');
}

}