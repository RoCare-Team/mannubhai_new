// src/components/client-components.js
'use client';
import dynamic from 'next/dynamic';

export const ClientComponents = {
  FAQSection: dynamic(() => import('./FAQSection/FAQSection'), {
    ssr: false,
    loading: () => <div className="min-h-[300px] flex items-center justify-center">
      <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200" />
    </div>
  }),
  CityAccordion: dynamic(() => import('./CityAccordion'), {
    ssr: false,
    loading: () => <div className="min-h-[200px] flex items-center justify-center">
      Loading nearby cities...
    </div>
  })
};