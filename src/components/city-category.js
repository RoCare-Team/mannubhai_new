import dynamic from 'next/dynamic';
import React, { memo } from 'react';
// Lazy load components with loading states
const CityDetails = dynamic(() => import("./CityDetails"), {
  loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded-lg" />
});

const CategoryDetails = dynamic(() => import("./CategoryDetails"), {
  loading: () => <div className="h-96 bg-gray-100 animate-pulse rounded-lg" />
});

const CityAccordion = dynamic(() => import('./CityAccordion'), {
  loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded-lg" />
});

const FooterLinks = dynamic(() => import('@/app/_components/Home/FooterLinks'), {
  loading: () => <div className="h-32 bg-gray-100 animate-pulse" />
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
  if (pageType !== "city-category" || !city || !category) {
    return null;
  }

  return (
    <>
   
      <CityDetails
        city={city} 
        showServices={city.status === 1}
      />
      
      <CategoryDetails
        category={category}
        city={city}
        cartItems={cartItems}
        addToCart={addToCart}
        increaseQuantity={increaseQuantity}
        decreaseQuantity={decreaseQuantity}
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

// Add display name for debugging
CityCategoryView.displayName = 'CityCategoryView';

export default CityCategoryView;