'use client';
import { useState, useEffect, useMemo } from 'react';
import BlogImage from '@/components/BlogImage';
import { getActiveBlogs, getCategories } from '../lib/fetchBlogs';
import Link from 'next/link';
import { Search, Filter, Calendar, User, ChevronRight, Home } from 'lucide-react';

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    async function fetchData() {
      try {
        const [blogData, categoryData] = await Promise.all([
          getActiveBlogs(),
          getCategories()
        ]);
        setBlogs(blogData || []);
        setCategories(categoryData || []);
        
        // Debug logs
        console.log('Blogs loaded:', blogData?.length || 0);
        console.log('Categories loaded:', categoryData);
        console.log('Sample blog data:', blogData?.[0]);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredAndSortedBlogs = useMemo(() => {
    console.log('Filtering blogs with category:', selectedCategory);
    
    let filtered = blogs.filter(blog => {
      const matchesSearch = blog.blog_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           blog.blog_description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           blog.blog_title?.toLowerCase().includes(searchTerm.toLowerCase());
      
      // FIXED: Use blog_cat_id instead of category
      const matchesCategory = selectedCategory === 'all' || blog.blog_cat_id === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });

    console.log('Filtered blogs count:', filtered.length);

    // Sort blogs
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.publishdate || b.created_at) - new Date(a.publishdate || a.created_at);
        case 'oldest':
          return new Date(a.publishdate || a.created_at) - new Date(b.publishdate || b.created_at);
        case 'alphabetical':
          return (a.blog_name || '').localeCompare(b.blog_name || '');
        default:
          return 0;
      }
    });

    return filtered;
  }, [blogs, searchTerm, selectedCategory, sortBy]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading blogs...</p>
        </div>
      </div>
    );
  }

  if (!blogs || blogs.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No blogs found</h2>
          <p className="text-gray-600">Check back later for new content</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="flex items-center hover:text-blue-600 transition-colors">
              <Home className="w-4 h-4 mr-1" />
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Blogs</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Blog</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Discover insights, stories, and knowledge from our latest posts
          </p>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search blogs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-4 items-center">
              {/* Category Filter - FIXED */}
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    console.log('Category selected:', e.target.value);
                    setSelectedCategory(e.target.value);
                  }}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Options */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="alphabetical">A-Z</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredAndSortedBlogs.length} of {blogs.length} blogs
            {selectedCategory !== 'all' && (
              <span className="ml-2 text-blue-600">
                in "{selectedCategory}" category
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Blog Grid */}
      <div className="container mx-auto px-4 py-12">
        {filteredAndSortedBlogs.length === 0 ? (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No blogs found</h3>
            <p className="text-gray-500">
              {selectedCategory !== 'all' 
                ? `No blogs found in "${selectedCategory}" category. Try adjusting your search or filter criteria.`
                : 'Try adjusting your search or filter criteria'
              }
            </p>
            {selectedCategory !== 'all' && (
              <button
                onClick={() => setSelectedCategory('all')}
                className="mt-4 text-blue-600 hover:text-blue-700 underline"
              >
                Show all categories
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAndSortedBlogs.map((blog, index) => (
              <article
                key={blog.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group border border-gray-100"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Link href={`/blogs/${blog.blog_url}`}>
                  <div className="relative overflow-hidden">
                    <BlogImage
                      src={blog.blog_image ? `/uploads/${blog.blog_image}` : 'uploads/blog_defult.webp'}
                      alt={blog.blog_name}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                      fallbackSrc="uploads/blog_defult.webp"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  <div className="p-6">
                    {/* Category Badge - FIXED */}
                    {blog.blog_cat_id && (
                      <div className="mb-3">
                        <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                          {blog.blog_cat_id}
                        </span>
                      </div>
                    )}

                    <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                      {blog.blog_name}
                    </h2>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                      {blog.blog_description}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center text-gray-500 text-sm">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(blog.publishdate || blog.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>
                        {(blog.author_name || blog.author) && (
                          <div className="flex items-center text-gray-500 text-sm">
                            <User className="w-4 h-4 mr-1" />
                            {blog.author_name || blog.author}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center text-blue-600 text-sm font-medium group-hover:text-blue-700">
                        Read more
                        <ChevronRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}