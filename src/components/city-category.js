import dynamic from 'next/dynamic';
import React, { memo, useMemo } from 'react';

// Shared loading component for better consistency and reduced bundle size
const LoadingPlaceholder = ({ height = "h-64" }) => (
  <div className={`${height} bg-gray-100 animate-pulse rounded-lg`} />
);

// Lazy load components with optimized loading states
const CityDetails = dynamic(() => import("./CityDetails"), {
  loading: () => <LoadingPlaceholder />
});

const CategoryDetails = dynamic(() => import("./CategoryDetails"), {
  loading: () => <LoadingPlaceholder height="h-96" />
});

const CityAccordion = dynamic(() => import('./CityAccordion'), {
  loading: () => <LoadingPlaceholder />
});

const FooterLinks = dynamic(() => import('@/app/_components/Home/FooterLinks'), {
  loading: () => <LoadingPlaceholder height="h-32" />
});

const CityCategoryView = memo(({
  pageType,
  city,
  category,
  cartItems,
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  cities,
  pageContent
}) => {
  // Early return with memoized condition check
  const isValidPage = useMemo(() => 
    pageType === "city-category" && city && category,
    [pageType, city, category]
  );

  if (!isValidPage) {
    return null;
  }

  // Memoize city service status to prevent unnecessary re-renders
  const showServices = useMemo(() => city.status === 1, [city.status]);

  // Memoize cart-related props to prevent unnecessary re-renders of CategoryDetails
  const cartProps = useMemo(() => ({
    cartItems,
    addToCart,
    increaseQuantity,
    decreaseQuantity
  }), [cartItems, addToCart, increaseQuantity, decreaseQuantity]);

  return (
    <>
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
    </>
  );
});

CityCategoryView.displayName = 'CityCategoryView';

export default CityCategoryView;