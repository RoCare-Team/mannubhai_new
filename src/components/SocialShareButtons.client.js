'use client';

import { Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

export default function SocialShareButtons({ blog }) {
  const handleShare = (platform) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(blog.blog_name);
    
    switch(platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
        break;
      case 'instagram':
        // Instagram doesn't have a direct share API, so we'll just open the app
        window.open('instagram://app', '_blank');
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex space-x-3">
      <button 
        onClick={() => handleShare('facebook')}
        className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Facebook className="w-4 h-4" />
      </button>
      <button 
        onClick={() => handleShare('twitter')}
        className="p-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
      >
        <Twitter className="w-4 h-4" />
      </button>
      <button 
        onClick={() => handleShare('linkedin')}
        className="p-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
      >
        <Linkedin className="w-4 h-4" />
      </button>
      <button 
        onClick={() => handleShare('instagram')}
        className="p-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
      >
        <Instagram className="w-4 h-4" />
      </button>
    </div>
  );
}