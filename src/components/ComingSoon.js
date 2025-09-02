'use client';
import React, { memo, useMemo, useState, useCallback } from "react";
import Image from 'next/image';
const SERVICE_IMAGES = {
  "Beauty & Personal Care": {
    "Women Salon At Home": "/BeautyHomeIcons/women salon at home.webp",
    "Makeup": "/BeautyHomeIcons/makeup.webp",
    "Spa For Women": "/BeautyHomeIcons/spa for women.webp",
    "Men Salon At Home": "/BeautyHomeIcons/Men Salon at Home.webp",
    "Massage For Men": "/BeautyHomeIcons/massage for men.webp",
    "Pedicure And Manicure": "/BeautyHomeIcons/pedicure and manicure.webp",
    "Hair Studio": "/BeautyHomeIcons/hair studio.webp",
  },
  "Handyman Services": {
    "Painter": "/HandyMan/PAINTER.webp",
    "Plumber": "/HandyMan/PLUMBER.webp",
    "Carpenter": "/HandyMan/CARPENTER.webp",
    "Electrician": "/HandyMan/ELECTRICIAN.webp",
    "Masons": "/HandyMan/OTHER.webp",
  },
  "Home Care Services": {
    "Sofa Cleaning": "/HomeCareHomeIcon/SOFA-CLEANING.webp",
    "Bathroom Cleaning": "/HomeCareHomeIcon/BATHROOM-CLEANING.webp",
    "Kitchen Cleaning": "/HomeCareHomeIcon/KITCHEN-CLEANING.webp",
    "Home Deep Cleaning": "/HomeCareHomeIcon/HOMEDEEPCLEANING.webp",
    "Pest Control": "/HomeCareHomeIcon/PEST-CONTROL.webp",
    "Tank Cleaning": "/HomeCareHomeIcon/TANK-CLEANING.webp",
  }
};

// ============================================================================
// OPTIMIZED COMING SOON SECTION
// ============================================================================

const ComingSoonSection = memo(({ title, cityName }) => {
  const services = useMemo(() =>
    Object.entries(SERVICE_IMAGES[title] || {}),
    [title]
  );

  const [imageErrors, setImageErrors] = useState(new Set());

  const handleImageError = useCallback((serviceName) => {
    setImageErrors(prev => new Set(prev).add(serviceName));
  }, []);

  return (
    <section className="py-12 px-4 bg-gray-50 h-[400px] overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px bg-gray-300 flex-1 max-w-20"></div>
            <span className="px-4 py-2 bg-orange-100 rounded-full text-sm font-semibold text-orange-700">
              Coming Soon
            </span>
            <div className="h-px bg-gray-300 flex-1 max-w-20"></div>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We&apos;re expanding our {title.toLowerCase()} services to{' '}
            <span className="font-semibold text-indigo-600">{cityName}</span>
          </p>
        </div>

        {/* Services Grid - Fixed height container */}
        <div className="h-[200px] overflow-hidden">
          {services.length > 0 ? (
            <div className="grid grid-cols-4 gap-4 max-w-4xl mx-auto">
              {services.slice(0, 8).map(([serviceName, imagePath], index) => (
                <div
                  key={serviceName}
                  className="bg-white rounded-xl shadow-sm border p-4 text-center h-[180px] flex flex-col"
                >
                  {/* Image Container - Fixed size */}
                  <div className="relative w-16 h-16 mx-auto mb-3 flex-shrink-0">
                    {!imageErrors.has(serviceName) ? (
                      <Image
                        src={imagePath}
                        alt={`${serviceName} service`}
                        fill
                        className="object-contain"
                        sizes="64px"
                        priority={index < 4}
                        onError={() => handleImageError(serviceName)}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}

                    {/* Coming Soon Badge */}
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      Soon
                    </div>
                  </div>

                  {/* Service Name - Fixed height */}
                  <div className="flex-1 flex items-center justify-center min-h-[2.5rem]">
                    <h3 className="font-medium text-gray-900 text-sm text-center line-clamp-2">
                      {serviceName}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No services available</p>
            </div>
          )}
        </div>
      </div>
      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
});

ComingSoonSection.displayName = 'ComingSoonSection';

export default ComingSoonSection;