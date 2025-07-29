  "use client";
  import { useState, useEffect, useCallback } from "react";
  import { FaChevronLeft, FaChevronRight, FaPlay, FaUserTie } from "react-icons/fa";
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
    url: "https://youtube.com/shorts/JkPiEof71u0?si=mhKf7y_CPucdoaXW",
    thumbnail: "/franchise-feedback/YTThumbnailHardwarFranchise.jpg",
    title: "Franchise Partner Success Story",
    partnerName: "Rajesh Kumar",
  },
  {
    id: 2,
    videoId: "5OzSfvyKVuE",
    url: "https://youtube.com/shorts/BmE847rNnvI?si=aU_6wLCVhDM82xkn",
    thumbnail: "/franchise-feedback/YTThumbnailHyderabadFranchise.jpg",
    title: "Business Growth Experience",
    partnerName: "Priya Sharma",
  },
  {
    id: 3,
    videoId: "lB1G5c6wYqk",
    url: "https://youtube.com/shorts/lB1G5c6wYqk?si=L-mly2dw_VEiggnW",
    thumbnail: "/franchise-feedback/YTThumbnailJammuKashmirFranchise.jpg",
    title: "Franchise Support Testimonial",
    partnerName: "Amit Patel",
  },
  {
    id: 4,
    videoId: "JkPiEof71u0",
    url: "https://youtube.com/shorts/ew-c40_0Qho?si=VQZeDG8IhBYJZC5B",
    thumbnail: "/franchise-feedback/YTThumbnailSeramporeFranchise.jpg",
    title: "Success Journey",
    partnerName: "Sunita Gupta",
  },
  {
    id: 5,
    videoId: "zTZK4LbFr84",
    url: "https://youtube.com/shorts/UJyNH-IvHuw?si=04NvlArQbxGI6OLG",
    thumbnail: "/franchise-feedback/YTThumbnailMaharashtraFranchise.jpg",
    title: "Partnership Experience",
    partnerName: "Vikram Singh",
  },
  {
    id: 6,
    videoId: "your-video-id",
    url: "https://youtube.com/your-video",
    thumbnail: "/franchise-feedback/your-thumbnail.jpg",
    title: "Your Success Story",
    partnerName: "Your Name",
  }
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

    const goToSlide = (index) => {
      setCurrentSlide(index);
    };

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

    const getFallbackImage = () => "/images/fallbacks/video-thumbnail.jpg";

    // Preload images
    useEffect(() => {
      const preloadImages = () => {
        const indices = [];
        for (let i = 0; i < slidesToShow; i++) {
          const index = (currentSlide + i) % feedbackVideos.length;
          indices.push(index);
        }
        
        indices.forEach(index => {
          const video = feedbackVideos[index];
          if (!imageErrors[video.id]) {
            const img = document.createElement('img');
            img.src = imageErrors[video.id] ? getFallbackImage() : video.thumbnail;
            img.style.display = 'none';
            document.body.appendChild(img);
            
            setTimeout(() => {
              document.body.removeChild(img);
            }, 1000);
          }
        });
      };
      
      preloadImages();
    }, [currentSlide, feedbackVideos, imageErrors]);

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
            {/* Video Slides */}
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
                  className="w-full flex-shrink-0 relative"
                  style={{ width: `${100 / slidesToShow}%` }}
                >
                  <div className="relative aspect-video bg-gray-900 mx-2">
                    {/* Video Thumbnail */}
                    <Image
                      src={imageErrors[video.id] ? getFallbackImage() : video.thumbnail}
                      alt={video.title}
                      fill
                      className="object-cover"
                      onError={() => handleImageError(video.id)}
                    />
                    
                    {/* Play Button Overlay */}
                    <div 
                      className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-50 transition-all duration-300 cursor-pointer group"
                      onClick={() => handleVideoClick(video.url)}
                      aria-label={`Play video: ${video.title}`}
                    >
                      <div className="bg-pink-600 hover:bg-pink-700 rounded-full p-4 transform group-hover:scale-110 transition-all duration-300 shadow-lg">
                        <FaPlay className="text-white text-2xl ml-1" />
                      </div>
                    </div>

                    {/* Video Info Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/70 to-transparent p-6">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white text-xl font-semibold mb-1 truncate">
                          {video.title}
                        </h3>
                        <p className="text-gray-200 text-sm flex items-center">
                          <FaUserTie className="mr-2 text-pink-400" />
                          {video.partnerName}
                        </p>
                      </div>
                    </div>
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