"use client";

import React from "react";

const testimonialVideos = [
  "https://www.youtube.com/embed/JkPiEof71u0",
  "https://www.youtube.com/embed/zTZK4LbFr84",
  "https://www.youtube.com/embed/1VUd5sLR5hs",
  "https://www.youtube.com/embed/IQDUDP705t4",
];

export default function Testimonials() {
  return (
    <section
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      aria-label="Customer Testimonials"
    >
      {testimonialVideos.map((videoUrl, i) => (
        <article
          key={i}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="relative h-40">
            <iframe
              src={videoUrl}
              title={`Testimonial ${i + 1}`}
              className="w-full h-full"
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
          <div className="p-4">
            <h4 className="font-bold text-indigo-700">
              New Franchise Onboarding
            </h4>
            <p className="text-sm text-gray-600 mt-1">
              Watch our partners&apos; success stories
            </p>
          </div>
        </article>
      ))}
    </section>
  );
}
