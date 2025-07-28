"use client";
import { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight, FaPlay, FaUserTie } from "react-icons/fa";

export default function FranchiseFeedback() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const feedbackVideos = [
    {
      id: 1,
      videoId: "UJyNH-IvHuw",
      url: "https://youtube.com/shorts/UJyNH-IvHuw?si=3Yj5FqbPVSCD3YQt",
      thumbnail: `https://img.youtube.com/vi/UJyNH-IvHuw/maxresdefault.jpg`,
      title: "Franchise Partner Success Story",
      partnerName: "Rajesh Kumar",
      partnerImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: 2,
      videoId: "5OzSfvyKVuE",
      url: "https://youtube.com/shorts/5OzSfvyKVuE?si=WOQEZm6ZmovWTb2w",
      thumbnail: `https://img.youtube.com/vi/5OzSfvyKVuE/maxresdefault.jpg`,
      title: "Business Growth Experience",
      partnerName: "Priya Sharma",
      partnerImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: 3,
      videoId: "lB1G5c6wYqk",
      url: "https://youtube.com/shorts/lB1G5c6wYqk?si=qU2pxlUh7u4NCrXd",
      thumbnail: `https://img.youtube.com/vi/lB1G5c6wYqk/maxresdefault.jpg`,
      title: "Franchise Support Testimonial",
      partnerName: "Amit Patel",
      partnerImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: 4,
      videoId: "JkPiEof71u0",
      url: "https://youtube.com/shorts/JkPiEof71u0?si=JY1zHJ_sHYfNjSa-",
      thumbnail: `https://img.youtube.com/vi/JkPiEof71u0/maxresdefault.jpg`,
      title: "Success Journey",
      partnerName: "Sunita Gupta",
      partnerImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: 5,
      videoId: "zTZK4LbFr84",
      url: "https://youtube.com/shorts/zTZK4LbFr84?si=cMMIwlI3WrBbVf4v",
      thumbnail: `https://img.youtube.com/vi/zTZK4LbFr84/maxresdefault.jpg`,
      title: "Partnership Experience",
      partnerName: "Vikram Singh",
      partnerImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: 6,
      videoId: "IQDUDP705t4",
      url: "https://youtube.com/shorts/IQDUDP705t4?si=XZFu9ZRY7JKUioP1",
      thumbnail: `https://img.youtube.com/vi/IQDUDP705t4/maxresdefault.jpg`,
      title: "Business Achievement",
      partnerName: "Meera Joshi",
      partnerImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: 7,
      videoId: "e7WQ5raJczQ",
      url: "https://youtube.com/shorts/e7WQ5raJczQ?si=ldtzgX5sjBqEy2rU",
      thumbnail: `https://img.youtube.com/vi/e7WQ5raJczQ/maxresdefault.jpg`,
      title: "Growth Story",
      partnerName: "Arjun Reddy",
      partnerImage: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: 8,
      videoId: "ew-c40_0Qho",
      url: "https://youtube.com/shorts/ew-c40_0Qho?si=ZkHKVXdMGVtHzWL7",
      thumbnail: `https://img.youtube.com/vi/ew-c40_0Qho/maxresdefault.jpg`,
      title: "Franchise Success",
      partnerName: "Kavita Agarwal",
      partnerImage: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % feedbackVideos.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + feedbackVideos.length) % feedbackVideos.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    if (isAutoPlaying) {
      const interval = setInterval(nextSlide, 4000);
      return () => clearInterval(interval);
    }
  }, [isAutoPlaying]);

  const handleVideoClick = (url) => {
    window.open(url, '_blank');
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
          {/* Video Slides */}
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {feedbackVideos.map((video, index) => (
              <div key={video.id} className="w-full flex-shrink-0">
                <div className="relative aspect-video bg-gray-900">
                  {/* Video Thumbnail */}
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='640' height='360' viewBox='0 0 640 360'%3E%3Crect width='640' height='360' fill='%23f3f4f6'/%3E%3Ctext x='320' y='180' text-anchor='middle' dy='0.3em' font-family='Arial, sans-serif' font-size='18' fill='%236b7280'%3EVideo Thumbnail%3C/text%3E%3C/svg%3E";
                    }}
                  />
                  
                  {/* Play Button Overlay */}
                  <div 
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-50 transition-all duration-300 cursor-pointer group"
                    onClick={() => handleVideoClick(video.url)}
                  >
                    <div className="bg-pink-600 hover:bg-pink-700 rounded-full p-4 transform group-hover:scale-110 transition-all duration-300 shadow-lg">
                      <FaPlay className="text-white text-2xl ml-1" />
                    </div>
                  </div>

                  {/* Video Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/70 to-transparent p-6">
                    <div className="flex items-center space-x-4">
                      {/* Partner Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={video.partnerImage}
                          alt={video.partnerName}
                          className="w-12 h-12 rounded-full border-2 border-white object-cover"
                          onError={(e) => {
                            e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Ccircle cx='24' cy='24' r='24' fill='%23e5e7eb'/%3E%3Cpath d='M24 12c3.3 0 6 2.7 6 6s-2.7 6-6 6-6-2.7-6-6 2.7-6 6-6zm0 22c-6.6 0-12-3.4-12-7.5 0-2.5 3.9-4.5 9-4.5s9 2 9 4.5c0 4.1-5.4 7.5-12 7.5z' fill='%239ca3af'/%3E%3C/svg%3E";
                          }}
                        />
                      </div>
                      
                      {/* Partner Info */}
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
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110"
          >
            <FaChevronLeft className="text-pink-600 text-xl" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110"
          >
            <FaChevronRight className="text-pink-600 text-xl" />
          </button>
        </div>

        {/* Partner Thumbnails Row */}
        <div className="mt-8">
          <div className="flex justify-center items-center space-x-4 overflow-x-auto pb-4">
            {feedbackVideos.map((video, index) => (
              <div
                key={video.id}
                className={`flex-shrink-0 cursor-pointer transition-all duration-300 ${
                  currentSlide === index 
                    ? 'transform scale-110' 
                    : 'opacity-70 hover:opacity-100'
                }`}
                onClick={() => goToSlide(index)}
              >
                <div className="relative">
                  <img
                    src={video.partnerImage}
                    alt={video.partnerName}
                    className={`w-16 h-16 rounded-full object-cover border-4 transition-all duration-300 ${
                      currentSlide === index 
                        ? 'border-pink-500 shadow-lg' 
                        : 'border-gray-300 hover:border-pink-300'
                    }`}
                    onError={(e) => {
                      e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Ccircle cx='32' cy='32' r='32' fill='%23e5e7eb'/%3E%3Cpath d='M32 16c4.4 0 8 3.6 8 8s-3.6 8-8 8-8-3.6-8-8 3.6-8 8-8zm0 30c-8.8 0-16-4.5-16-10 0-3.3 5.2-6 12-6s12 2.7 12 6c0 5.5-7.2 10-16 10z' fill='%239ca3af'/%3E%3C/svg%3E";
                    }}
                  />
                  {currentSlide === index && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
                      <FaPlay className="text-white text-xs ml-0.5" />
                    </div>
                  )}
                </div>
                <p className="text-center text-xs text-gray-600 mt-2 max-w-16 truncate">
                  {video.partnerName.split(' ')[0]}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Video Grid for Mobile */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 md:hidden">
          {feedbackVideos.map((video, index) => (
            <div
              key={video.id}
              className="relative aspect-video rounded-lg overflow-hidden shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-300"
              onClick={() => handleVideoClick(video.url)}
            >
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='180' viewBox='0 0 320 180'%3E%3Crect width='320' height='180' fill='%23f3f4f6'/%3E%3Ctext x='160' y='90' text-anchor='middle' dy='0.3em' font-family='Arial, sans-serif' font-size='14' fill='%236b7280'%3EVideo%3C/text%3E%3C/svg%3E";
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                <div className="bg-pink-600 rounded-full p-2">
                  <FaPlay className="text-white text-sm ml-0.5" />
                </div>
              </div>
            </div>
          ))}
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