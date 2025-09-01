// src/components/server-components.js
import dynamic from 'next/dynamic';

export const ServerComponents = {
  LogoLoader: dynamic(() => import('./LogoLoader'), { 
    ssr: true,
    loading: () => <div>Loading...</div>
  }),
  CityDetails: dynamic(() => import('./CityDetails'), { 
    ssr: true,
    loading: () => <div>Loading city details...</div>
  }),
  CategoryDetails: dynamic(() => import('./CategoryDetails'), {
    ssr: true,
    loading: () => <div>Loading category...</div>
  })
};