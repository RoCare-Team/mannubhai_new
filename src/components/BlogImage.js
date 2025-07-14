'use client';

export default function BlogImage({ src, alt, className, fallbackSrc }) {
  return (
    <img 
      src={src} 
      alt={alt} 
      className={className}
      onError={(e) => {
        e.target.src = fallbackSrc;
      }}
    />
  );
}