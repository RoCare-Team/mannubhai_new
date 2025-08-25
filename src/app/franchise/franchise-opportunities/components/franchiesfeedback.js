"use client";
import { useState, useEffect, useCallback } from "react";
import { FaChevronLeft, FaChevronRight, FaUserTie } from "react-icons/fa";
import Image from "next/image";

export default function FranchiseFeedback() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [imageErrors, setImageErrors] = useState({});
  const [slidesToShow, setSlidesToShow] = useState(4); // Default for desktop

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

  // Handle responsive slides to show
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setSlidesToShow(2); // Mobile: 2 slides
      } else if (window.innerWidth < 1024) {
        setSlidesToShow(3); // Tablet: 3 slides
      } else {
        setSlidesToShow(4); // Desktop: 4 slides
      }
    };

    handleResize(); // Set initial value
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Reset current slide when slidesToShow changes
  useEffect(() => {
    const maxSlide = Math.max(0, feedbackVideos.length - slidesToShow);
    if (currentSlide > maxSlide) {
      setCurrentSlide(maxSlide);
    }
  }, [slidesToShow, feedbackVideos.length, currentSlide]);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => 
      (prev + 1) % (feedbackVideos.length - slidesToShow + 1)
    );
  }, [feedbackVideos.length, slidesToShow]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => 
      (prev - 1 + (feedbackVideos.length - slidesToShow + 1)) % 
      (feedbackVideos.length - slidesToShow + 1)
    );
  }, [feedbackVideos.length, slidesToShow]);

  useEffect(() => {
    if (isAutoPlaying) {
      const interval = setInterval(nextSlide, 5000);
      return () => clearInterval(interval);
    }
  }, [isAutoPlaying, nextSlide]);

  const handleVideoClick = (url) => {
    // Better mobile link handling
    if (typeof window !== 'undefined') {
      // For mobile devices, use location.href for better compatibility
      if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        window.location.href = url;
      } else {
        // Desktop browsers
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    }
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
    <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="flex items-center justify-center mb-4">
            <FaUserTie className="text-2xl sm:text-3xl lg:text-4xl text-pink-600 mr-2 sm:mr-3" />
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">
             Our Recently Onboarded Franchise Partners
            </h2>
          </div>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-3xl mx-auto px-4">
            Hear directly from our successful franchise partners about their journey and experience with our brand
          </p>
        </div>

        {/* Slider Container */}
        <div 
          className="relative overflow-hidden rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl bg-white"
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
                className="w-full flex-shrink-0 relative cursor-pointer touch-manipulation"
                style={{ width: `${100 / slidesToShow}%` }}
                onClick={() => handleVideoClick(video.url)}
                onTouchEnd={(e) => {
                  // Prevent default touch behavior that might interfere with clicks
                  e.preventDefault();
                  handleVideoClick(video.url);
                }}
              >
                <div className="relative aspect-video mx-1 sm:mx-2">
                  {/* Only Video Thumbnail Image */}
                  <Image
                    src={imageErrors[video.id] ? getFallbackImage(video.id) : video.thumbnail}
                    alt={`Franchise feedback video ${video.id}`}
                    fill
                    className="object-cover rounded-md sm:rounded-lg hover:scale-105 transition-transform duration-300"
                    onError={() => handleImageError(video.id)}
                  />
                  {/* Play button overlay for better UX */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-md sm:rounded-lg">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                      <div className="w-0 h-0 border-l-[8px] sm:border-l-[12px] border-l-pink-600 border-t-[6px] sm:border-t-[8px] border-t-transparent border-b-[6px] sm:border-b-[8px] border-b-transparent ml-1"></div>
                    </div>
                  </div>
                  {/* Mobile-friendly tap target */}
                  <div className="absolute inset-0 z-10 sm:hidden" />
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          {currentSlide > 0 && (
            <button
              onClick={prevSlide}
              className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 sm:p-3 shadow-lg transition-all duration-300 hover:scale-110 z-10 focus:outline-none focus:ring-2 focus:ring-pink-500"
              aria-label="Previous testimonial"
            >
              <FaChevronLeft className="text-pink-600 text-sm sm:text-xl" />
            </button>
          )}
          
          {currentSlide < feedbackVideos.length - slidesToShow && (
            <button
              onClick={nextSlide}
              className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 sm:p-3 shadow-lg transition-all duration-300 hover:scale-110 z-10 focus:outline-none focus:ring-2 focus:ring-pink-500"
              aria-label="Next testimonial"
            >
              <FaChevronRight className="text-pink-600 text-sm sm:text-xl" />
            </button>
          )}
        </div>

        {/* Slide Indicators */}
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: feedbackVideos.length - slidesToShow + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                currentSlide === index 
                  ? 'bg-pink-600 w-6 sm:w-8' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        {/* Call to Action */}
        <div className="text-center mt-8 sm:mt-12">
          <p className="text-sm sm:text-base text-gray-600 mb-6 px-4">
            Ready to join our growing family of successful franchise partners?
          </p>
        </div>
      </div>
    </section>
  );
}