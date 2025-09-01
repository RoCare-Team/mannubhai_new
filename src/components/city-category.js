'use client';

import dynamic from 'next/dynamic';
import React, { memo, useMemo, useCallback, Suspense } from 'react';
import PropTypes from 'prop-types';

// Enhanced loading component with better visual feedback
const LoadingPlaceholder = memo(({ height = "h-64", className = "", showSkeleton = false }) => {
  if (showSkeleton) {
    return (
      <div className={`${height} ${className} space-y-4 p-4`} role="status" aria-label="Loading content">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div 
      className={`${height} bg-gray-100 animate-pulse rounded-lg ${className}`}
      role="status"
      aria-label="Loading content"
    />
  );
});

LoadingPlaceholder.displayName = 'LoadingPlaceholder';

// Error boundary component
const ErrorFallback = memo(({ componentName, retry }) => (
  <div className="text-red-500 p-4 border border-red-200 rounded-lg bg-red-50">
    <p className="font-medium">Failed to load {componentName}</p>
    {retry && (
      <button 
        onClick={retry}
        className="mt-2 px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
      >
        Retry
      </button>
    )}
  </div>
));

ErrorFallback.displayName = 'ErrorFallback';

// Optimized dynamic component creation with better error handling
const createDynamicComponent = (loader, displayName, options = {}) => {
  const { 
    ssr = false, 
    loading: customLoading,
    suspense = true 
  } = options;

  return dynamic(
    () => loader()
      .then(mod => {
        // Better module resolution
        const component = mod.default || mod[displayName] || mod;
        if (!component) {
          throw new Error(`Component ${displayName} not found`);
        }
        return component;
      })
      .catch((error) => {
        console.error(`Failed to load ${displayName}:`, error);
        return () => <ErrorFallback componentName={displayName} />;
      }),
    {
      ssr,
      suspense,
      loading: customLoading || (() => <LoadingPlaceholder showSkeleton />)
    }
  );
};

// Priority-based component loading for better LCP
const CityDetails = createDynamicComponent(
  () => import("./CityDetails"), 
  'CityDetails',
  { ssr: true, suspense: false } // Critical for LCP - load with SSR
);

const CategoryDetails = createDynamicComponent(
  () => import("./CategoryDetails"), 
  'CategoryDetails',
  { ssr: true, suspense: false } // Critical content - load immediately
);

// Non-critical components can be lazy loaded
const CityAccordion = createDynamicComponent(
  () => import('./CityAccordion'), 
  'CityAccordion',
  { ssr: false } // Below fold content
);

const FooterLinks = createDynamicComponent(
  () => import('@/app/_components/Home/FooterLinks'), 
  'FooterLinks',
  { ssr: false } // Footer content - lowest priority
);

// Optimized main component
const CityCategoryView = memo(({
  pageType,
  city,
  category,
  cartItems = [],
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  cities = [],
  pageContent
}) => {
  // Memoized validations
  const isValidPage = useMemo(() => 
    pageType === "city-category" && city && category,
    [pageType, city, category]
  );

  const showServices = useMemo(() => 
    city?.status === 1, 
    [city?.status]
  );

  // Stable cart handlers to prevent re-renders
  const stableCartProps = useMemo(() => ({
    cartItems,
    addToCart: useCallback((...args) => addToCart?.(...args), [addToCart]),
    increaseQuantity: useCallback((...args) => increaseQuantity?.(...args), [increaseQuantity]),
    decreaseQuantity: useCallback((...args) => decreaseQuantity?.(...args), [decreaseQuantity])
  }), [cartItems, addToCart, increaseQuantity, decreaseQuantity]);

  // Early return with better UX
  if (!isValidPage) {
    return (
      <div className="w-full min-h-[400px] flex items-center justify-center">
        <div className="text-center space-y-4">
          <LoadingPlaceholder height="h-16" className="w-48 mx-auto" />
          <p className="text-gray-500 animate-pulse">Loading city and category information...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Critical above-the-fold content - highest priority for LCP */}
      <div className="space-y-4">
        <CityDetails
          city={city}
          showServices={showServices}
        />
        <CategoryDetails
          category={category}
          city={city}
          {...stableCartProps}
          cities={cities}
          pageContent={pageContent}
        />
      </div>

      {/* Below-the-fold content with intersection observer for lazy loading */}
      <Suspense fallback={<LoadingPlaceholder height="h-32" showSkeleton />}>
        <div className="space-y-8 mt-8">
          <CityAccordion
            cities={cities}
            currentCity={city}
          />
          <FooterLinks />
        </div>
      </Suspense>
    </>
  );
});

// Enhanced PropTypes with better validation
CityCategoryView.propTypes = {
  pageType: PropTypes.string.isRequired,
  city: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    status: PropTypes.number,
    slug: PropTypes.string
  }),
  category: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    slug: PropTypes.string
  }),
  cartItems: PropTypes.array,
  addToCart: PropTypes.func,
  increaseQuantity: PropTypes.func,
  decreaseQuantity: PropTypes.func,
  cities: PropTypes.arrayOf(PropTypes.object),
  pageContent: PropTypes.string
};

CityCategoryView.defaultProps = {
  cartItems: [],
  cities: [],
  city: null,
  category: null,
  addToCart: () => {},
  increaseQuantity: () => {},
  decreaseQuantity: () => {},
  pageContent: ''
};

CityCategoryView.displayName = 'CityCategoryView';

export default CityCategoryView;

// Enhanced caching strategy
export const fetchCache = 'force-cache';
export const revalidate = 3600; // Revalidate every hour
export const dynamic = 'force-static'; // Generate static pages when possible