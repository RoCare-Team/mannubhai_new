'use client';
import dynamic from 'next/dynamic';
import React, { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
// Optimized loading component with accessibility features
const LoadingPlaceholder = ({ height = "h-64", className = "" }) => (
  <div 
    className={`${height} bg-gray-100 animate-pulse rounded-lg ${className}`}
    role="status"
    aria-label="Loading content"
  />
);
// Dynamic imports with error boundaries and optimized loading
const createDynamicComponent = (loader, displayName) => {
  return dynamic(() => loader()
    .then(mod => mod.default || mod[displayName])
    .catch(() => {
      console.error(`Failed to load ${displayName}`);
      return () => <div className="text-red-500 p-4">Failed to load {displayName}</div>;
    }), 
    {
      loading: ({ error }) => {
        if (error) {
          return <div className="text-red-500 p-4">Error loading {displayName}</div>;
        }
        return <LoadingPlaceholder />;
      }
    }
  );
};
// Lazy-loaded components
const CityDetails = createDynamicComponent(() => import("./CityDetails"), 'CityDetails');
const CategoryDetails = createDynamicComponent(() => import("./CategoryDetails"), 'CategoryDetails');
const CityAccordion = createDynamicComponent(() => import('./CityAccordion'), 'CityAccordion');
const FooterLinks = createDynamicComponent(() => import('@/app/_components/Home/FooterLinks'), 'FooterLinks');
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
  // Early validation with memoization
  const isValidPage = useMemo(() => 
    pageType === "city-category" && city && category,
    [pageType, city, category]
  );

  // Memoized cart props to prevent unnecessary re-renders
  const cartProps = useMemo(() => ({
    cartItems,
    addToCart,
    increaseQuantity,
    decreaseQuantity
  }), [cartItems, addToCart, increaseQuantity, decreaseQuantity]);

  // Show services only if city is active
  const showServices = useMemo(() => city?.status === 1, [city?.status]);

  if (!isValidPage) {
    return (
      <div className="w-full text-center py-12">
        <p className="text-gray-500">Loading city and category information...</p>
      </div>
    );
  }
  return (
    <div className="space-y-8">
      <CityDetails
        city={city}
        showServices={showServices}
      />
      <CategoryDetails
        category={category}
        city={city}
        {...cartProps}
        cities={cities}
        pageContent={pageContent}
      />
      <CityAccordion
        cities={cities}
        currentCity={city}
      />
      <FooterLinks />
    </div>
  );
});
CityCategoryView.propTypes = {
  pageType: PropTypes.string.isRequired,
  city: PropTypes.shape({
    status: PropTypes.number,
    // Add other city properties here
  }),
  category: PropTypes.object,
  cartItems: PropTypes.array,
  addToCart: PropTypes.func,
  increaseQuantity: PropTypes.func,
  decreaseQuantity: PropTypes.func,
  cities: PropTypes.array,
  pageContent: PropTypes.string
};
CityCategoryView.displayName = 'CityCategoryView';
export default CityCategoryView;
export const fetchCache = 'force-cache';