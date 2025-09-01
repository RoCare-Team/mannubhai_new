'use client';

import { useState } from 'react';
import Link from 'next/link';
import { X, Tag } from 'lucide-react';

export default function BlogSidebar({ categories, currentCategory, posts = [] }) {
  const [isOpen, setIsOpen] = useState(false);

  // Calculate category counts from posts if not provided in categories
  const getCategoryCount = (categoryName) => {
    // First check if count is already provided in category object
    const category = categories.find(cat => cat.name === categoryName);
    if (category && category.count !== undefined) {
      return category.count;
    }
    
    // If no count provided, calculate from posts array
    if (posts && posts.length > 0) {
      return posts.filter(post => 
        post.category === categoryName || 
        post.categories?.includes(categoryName) ||
        (Array.isArray(post.tags) && post.tags.includes(categoryName))
      ).length;
    }
    
    return 0;
  };

  // Calculate total posts count
  const getTotalCount = () => {
    if (posts && posts.length > 0) {
      return posts.length;
    }
    
    // Sum up all category counts if posts not available
    return categories.reduce((total, cat) => {
      const count = getCategoryCount(cat.name);
      return total + count;
    }, 0);
  };

  return (
    <>
      {/* Mobile toggle button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-30 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
      >
        <Tag className="w-6 h-6" />
      </button>
      
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0 lg:shadow-none lg:z-auto lg:w-full
        ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 h-full overflow-y-auto">
          {/* Close button for mobile */}
          <button 
            onClick={() => setIsOpen(false)}
            className="lg:hidden absolute top-4 left-4 p-2 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="mt-8 lg:mt-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
            
            <div className="space-y-2">
              {/* All Categories option */}
              <Link
                href="/blogs"
                className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                  !currentCategory
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <span>All Categories</span>
                <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                  {getTotalCount()}
                </span>
              </Link>
              
              {/* Individual categories */}
              {categories.map((category) => {
                const count = getCategoryCount(category.name);
                return (
                  <Link
                    key={category.id || category.name}
                    href={`/blogs?category=${category.name}`}
                    className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                      currentCategory === category.name
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <span>{category.name}</span>
                    <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                      {count}
                    </span>
                  </Link>
                );
              })}
            </div>
            
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                {categories
                  .filter(category => getCategoryCount(category.name) > 0)
                  .sort((a, b) => getCategoryCount(b.name) - getCategoryCount(a.name))
                  .slice(0, 10)
                  .map((category) => (
                    <Link
                      key={category.id || category.name}
                      href={`/blogs?category=${category.name}`}
                      className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-blue-100 hover:text-blue-700 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {category.name}
                    </Link>
                  ))}
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Subscribe to Newsletter</h4>
              <p className="text-sm text-blue-700 mb-3">Get the latest articles delivered to your inbox.</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 p-2 text-sm border border-blue-300 rounded focus:ring-1 focus:ring-blue-500"
                />
                <button className="px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}