'use client';

import dynamic from 'next/dynamic';

const withLoader = (loader, componentName) => dynamic(
  () => loader()
    .then(mod => {
      // Handle both default and named exports
      const Component = mod.default || mod[componentName];
      if (!Component) {
        console.error(`${componentName} component not found`);
        return () => <div>Component failed to load</div>;
      }
      return Component;
    })
    .catch(err => {
      console.error(`Error loading ${componentName}:`, err);
      return () => <div>Error loading component</div>;
    }),
  {
    loading: () => <div>Loading {componentName}...</div>
  }
);

export const components = {
  CityDetails: withLoader(() => import('@/components/CityDetails'), 'CityDetails'),
  CategoryDetails: withLoader(() => import('@/components/CategoryDetails'), 'CategoryDetails'),
  CityAccordion: withLoader(() => import('@/components/CityAccordion'), 'CityAccordion'),
  FAQSection: withLoader(() => import('@/components/FAQSection'), 'FAQSection')
};