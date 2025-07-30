"use client";
import { useState, useEffect, useCallback } from "react";
import { FaChevronLeft, FaChevronRight, FaUserTie } from "react-icons/fa";
import Image from "next/image";

export default function FranchiseFeedback() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [imageErrors, setImageErrors] = useState({});
  const slidesToShow = 4; // Number of slides to show at once

  const feedbackVideos = [
    {
      id: 1,
      videoId: "UJyNH-IvHuw",
      url: "https://youtube.com/shorts/JkPiEof71u0?si=qN7S8NVt2fcG5dsD",
      thumbnail: "/franchies/franchise-feedback/YTThumbnailHaridwarFranchise.jpg",
    },
    {
      id: 2,
      videoId: "5OzSfvyKVuE",
      url: "https://youtube.com/shorts/BmE847rNnvI?si=4No2Ee4BXgOYG6WH",
      thumbnail: "/franchies/franchise-feedback/YTThumbnailHyderabadFranchise.jpg",
    },
    {
      id: 3,
      videoId: "lB1G5c6wYqk",
      url: "https://youtube.com/shorts/lB1G5c6wYqk?si=tdVtjFm-LUB74itn",
      thumbnail: "/franchies/franchise-feedback/YTThumbnailJammuKashmirFranchise.jpg",
    },
    {
      id: 4,
      videoId: "JkPiEof71u0",
      url: "https://youtube.com/shorts/ew-c40_0Qho?si=RaIp9bx8pvUwc77J",
      thumbnail: "/franchies/franchise-feedback/YTThumbnailSeramporeFranchise.jpg",
    },
    {
      id: 5,
      videoId: "zTZK4LbFr84",
      url: "https://youtube.com/shorts/UJyNH-IvHuw?si=1H7KA3Fs-xalvugR",
      thumbnail: "/franchies/franchise-feedback/YTThumbnailMaharashtraFranchise.jpg",
    },
  ];

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => 
      (prev + 1) % (feedbackVideos.length - slidesToShow + 1)
    );
  }, [feedbackVideos.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => 
      (prev - 1 + (feedbackVideos.length - slidesToShow + 1)) % 
      (feedbackVideos.length - slidesToShow + 1)
    );
  }, [feedbackVideos.length]);

  useEffect(() => {
    if (isAutoPlaying) {
      const interval = setInterval(nextSlide, 5000);
      return () => clearInterval(interval);
    }
  }, [isAutoPlaying, nextSlide]);

  const handleVideoClick = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleImageError = (id) => {
    setImageErrors(prev => ({ ...prev, [id]: true }));
  };

  const getFallbackImage = (videoId) => {
    const fallbacks = {
      1: "/franchies/franchise-feedback/YTThumbnailHardwarFranchise.jpg",
      2: "/franchies/franchise-feedback/YTThumbnailHyderabadFranchise.jpg", 
      3: "/franchies/franchise-feedback/YTThumbnailJammuKashmirFranchise.jpg",
      4: "/franchies/franchise-feedback/YTThumbnailSeramporeFranchise.jpg",
      5: "/franchies/franchise-feedback/YTThumbnailMaharashtraFranchise.jpg"
    };
    return fallbacks[videoId] || "/franchise-feedback/YTThumbnailHardwarFranchise.jpg";
  };

  return (
    <section className="py-16 bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <FaUserTie className="text-4xl text-pink-600 mr-3" />
            <h2 className="text-4xl font-bold text-gray-800">
              Our Onboarding Franchise Partners
            </h2>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Hear directly from our successful franchise partners about their journey and experience with our brand
          </p>
        </div>

        {/* Slider Container */}
        <div 
          className="relative overflow-hidden rounded-2xl shadow-2xl bg-white"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {/* Video Slides - Only Images */}
          <div 
            className="flex transition-transform duration-700 ease-in-out"
            style={{ 
              transform: `translateX(-${currentSlide * (100 / slidesToShow)}%)`,
              width: `${feedbackVideos.length * (100 / slidesToShow)}%`
            }}
          >
            {feedbackVideos.map((video) => (
              <div 
                key={video.id} 
                className="w-full flex-shrink-0 relative cursor-pointer"
                style={{ width: `${100 / slidesToShow}%` }}
                onClick={() => handleVideoClick(video.url)}
              >
                <div className="relative aspect-video mx-2">
                  {/* Only Video Thumbnail Image */}
                  <Image
                    src={imageErrors[video.id] ? getFallbackImage(video.id) : video.thumbnail}
                    alt={`Franchise feedback video ${video.id}`}
                    fill
                    className="object-cover rounded-lg hover:scale-105 transition-transform duration-300"
                    onError={() => handleImageError(video.id)}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          {currentSlide > 0 && (
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110 z-10 focus:outline-none focus:ring-2 focus:ring-pink-500"
              aria-label="Previous testimonial"
            >
              <FaChevronLeft className="text-pink-600 text-xl" />
            </button>
          )}
          
          {currentSlide < feedbackVideos.length - slidesToShow && (
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110 z-10 focus:outline-none focus:ring-2 focus:ring-pink-500"
              aria-label="Next testimonial"
            >
              <FaChevronRight className="text-pink-600 text-xl" />
            </button>
          )}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-6">
            Ready to join our growing family of successful franchise partners?
          </p>
        </div>
      </div>
    </section>
  );
}