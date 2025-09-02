// LazyMap.jsx
"use client";
import React, { useState } from "react";

const LazyMap = ({ className }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={className} style={{ position: 'relative' }}>
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14127.340561883426!2d77.038622!3d28.419554!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d229e71ef44dd%3A0x9931b80f30d32dd3!2sJMD%20Megapolis!5e1!3m2!1sen!2sin!4v1751564206008!5m2!1sen!2sin"
        width="100%"
        height="100%"
        className={`w-full h-full border-0 transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        onLoad={() => setIsLoaded(true)}
        title="JMD Megapolis Location - Mannubhai Service Expert Office"
        aria-label="Interactive map showing Mannubhai Service Expert office location at JMD Megapolis"
        style={{ aspectRatio: '4/3' }}
      />
      {!isLoaded && (
        <div 
          className="absolute inset-0 bg-gray-100 flex items-center justify-center"
          style={{ aspectRatio: '4/3' }}
        >
          <div className="text-gray-400 text-sm" role="status" aria-live="polite">
            Loading map...
          </div>
        </div>
      )}
    </div>
  );
};

export default LazyMap;