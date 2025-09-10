import { getActiveBlogs, getCategories, getBlogById, getRelatedBlogs } from "@/app/lib/fetchBlogs";
import BlogImage from '@/components/BlogImage';
import Link from 'next/link';
import { 
  Calendar, 
  User, 
  Clock, 
  Share2, 
  Bookmark, 
  ChevronRight, 
  Home, 
  Tag,
  ArrowLeft,
  Search,
  Filter,
  Menu,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Eye,
  MessageCircle,
  Heart
} from 'lucide-react';
import BlogSidebar from '../../../components/BlogSidebar.client';

export async function generateStaticParams() {
  const blogs = await getActiveBlogs();
  
  if (!blogs || blogs.length === 0) {
    return [];
  }

  return blogs.map(blog => ({
    slug: blog.blog_url
  }));
}

// Function to estimate reading time
function estimateReadingTime(content) {
  const wordsPerMinute = 200;
  const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return minutes;
}

// Updated function to find blog by slug with dual ID support
async function findBlogBySlug(slug) {
  try {
    // First, get all active blogs and try to find by slug
    const blogs = await getActiveBlogs();
    let blog = blogs.find(b => b.blog_url === slug);
    
    if (!blog) {
      // If not found by slug, try to get by ID (in case slug is actually an ID)
      blog = await getBlogById(slug);
    }
    
    return blog;
  } catch (error) {
    console.error("Error finding blog by slug:", error);
    return null;
  }
}

export default async function BlogPost({ params }) {
  // Fetch data concurrently for better performance
  const [blog, categories] = await Promise.all([
    findBlogBySlug(params.slug),
    getCategories()
  ]);

  if (!blog) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Blog post not found</h1>
          <p className="text-gray-600 mb-6">The blog post you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <Link 
            href="/blogs" 
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  // Get related blogs using the updated function from fetchBlogs
  const relatedBlogs = await getRelatedBlogs(
    blog.blog_cat_id, 
    blog.id, // This will work with both ID types now
    3
  );

  const readingTime = estimateReadingTime(blog.blog_content_text || '');
  const currentCategory = categories.find(cat => cat.name === blog.blog_cat_id);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="flex items-center hover:text-blue-600 transition-colors">
              <Home className="w-4 h-4 mr-1" />
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/blogs" className="hover:text-blue-600 transition-colors">
              Blogs
            </Link>
            <ChevronRight className="w-4 h-4" />
            {blog.blog_cat_id && (
              <>
                <Link 
                  href={`/blogs?category=${encodeURIComponent(blog.blog_cat_id)}`}
                  className="hover:text-blue-600 transition-colors"
                >
                  {blog.blog_cat_id}
                </Link>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
            <span className="text-gray-900 font-medium truncate max-w-xs">
              {blog.blog_name}
            </span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content */}
          <main className="lg:w-2/3">
            {/* Back Button */}
            <div className="mb-6">
              <Link 
                href="/blogs" 
                className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" />
                Back to all blogs
              </Link>
            </div>

            {/* Article Header */}
            <article className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Featured Image */}
              <div className="relative h-64 md:h-80 lg:h-96 overflow-hidden">
                <BlogImage
                  src={blog.blog_image ? `/uploads/${blog.blog_image}` : 'uploads/blog_defult.webp'}
                  alt={blog.blog_name}
                  className="w-full h-full object-cover"
                  fallbackSrc="uploads/blog_defult.webp"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                
                {/* Category Badge on Image */}
                {blog.blog_cat_id && (
                  <div className="absolute top-6 left-6">
                    <Link href={`/blogs?category=${encodeURIComponent(blog.blog_cat_id)}`}>
                      <span className="inline-flex items-center bg-white/90 backdrop-blur-sm text-gray-800 text-sm font-semibold px-4 py-2 rounded-full hover:bg-white transition-colors cursor-pointer">
                        <Tag className="w-4 h-4 mr-2" />
                        {blog.blog_cat_id}
                      </span>
                    </Link>
                  </div>
                )}
              </div>

              {/* Article Content */}
              <div className="p-8 lg:p-12">
                {/* Title */}
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  {blog.blog_name || blog.blog_title}
                </h1>

                {/* Description */}
                {blog.blog_description && (
                  <p className="text-xl text-gray-600 leading-relaxed mb-8 font-light">
                    {blog.blog_description}
                  </p>
                )}

                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-8 pb-8 border-b border-gray-200">
                  {/* Author */}
                  {(blog.author_name || blog.author) && (
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {blog.author_name || blog.author}
                        </p>
                        <p className="text-xs text-gray-500">Author</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Date */}
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium">
                        {new Date(blog.publishdate || blog.created_at).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                      <p className="text-xs text-gray-500">Published</p>
                    </div>
                  </div>

                  {/* Reading Time */}
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium">{readingTime} min read</p>
                      <p className="text-xs text-gray-500">Reading time</p>
                    </div>
                  </div>

                  {/* Engagement Stats */}
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Eye className="w-5 h-5 mr-1 text-gray-400" />
                      <span className="text-sm">{blog.views || '0'}</span>
                    </div>
                    <div className="flex items-center">
                      <Heart className="w-5 h-5 mr-1 text-gray-400" />
                      <span className="text-sm">{blog.likes || '0'}</span>
                    </div>
                    <div className="flex items-center">
                      <MessageCircle className="w-5 h-5 mr-1 text-gray-400" />
                      <span className="text-sm">{blog.comments || '0'}</span>
                    </div>
                  </div>
                </div>

                {/* Social Share Buttons */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium text-gray-700">Share this article:</span>
                    <div className="flex space-x-3">
                      <button 
                        onClick={() => {
                          const url = encodeURIComponent(window.location.href);
                          const text = encodeURIComponent(blog.blog_name);
                          window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
                        }}
                        className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Facebook className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => {
                          const url = encodeURIComponent(window.location.href);
                          const text = encodeURIComponent(blog.blog_name);
                          window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
                        }}
                        className="p-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
                      >
                        <Twitter className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => {
                          const url = encodeURIComponent(window.location.href);
                          const title = encodeURIComponent(blog.blog_name);
                          const summary = encodeURIComponent(blog.blog_description || '');
                          window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
                        }}
                        className="p-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
                      >
                        <Linkedin className="w-4 h-4" />
                      </button>
                      <button className="p-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors">
                        <Instagram className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    <Bookmark className="w-4 h-4" />
                    Save for later
                  </button>
                </div>

                {/* Article Content */}
                <div className="prose prose-lg prose-gray max-w-none">
                  <div 
                    className="prose-headings:text-gray-900 prose-headings:font-bold prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ol:text-gray-700 prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-gray-600"
                    dangerouslySetInnerHTML={{ __html: blog.blog_content_text }}
                  />
                </div>

                {/* Tags Section */}
                {blog.meta_keywords && (
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium text-gray-700">Tags:</span>
                      {blog.meta_keywords.split(',').map((tag, index) => (
                        <Link
                          key={index}
                          href={`/blogs?search=${encodeURIComponent(tag.trim())}`}
                          className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm px-3 py-1 rounded-full transition-colors"
                        >
                          #{tag.trim()}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Article Footer */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-600">Was this article helpful?</span>
                      <div className="flex space-x-2">
                        <button className="p-2 text-gray-400 hover:text-green-500 transition-colors">
                          👍
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                          👎
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        <Share2 className="w-4 h-4" />
                        Share
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </article>

            {/* Related Articles */}
            {relatedBlogs.length > 0 && (
              <section className="mt-12">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-gray-900">Related Articles</h2>
                  {blog.blog_cat_id && (
                    <Link 
                      href={`/blogs?category=${encodeURIComponent(blog.blog_cat_id)}`}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
                    >
                      View all in {blog.blog_cat_id}
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedBlogs.map((relatedBlog) => (
                    <article
                      key={relatedBlog.id}
                      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group border border-gray-100"
                    >
                      <Link href={`/blogs/${relatedBlog.blog_url}`}>
                        <div className="relative overflow-hidden">
                          <BlogImage
                            src={relatedBlog.blog_image ? `/uploads/${relatedBlog.blog_image}` : 'uploads/blog_defult.webp'}
                            alt={relatedBlog.blog_name}
                            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                            fallbackSrc="uploads/blog_defult.webp"
                          />
                        </div>

                        <div className="p-6">
                          {relatedBlog.blog_cat_id && (
                            <div className="mb-3">
                              <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                                {relatedBlog.blog_cat_id}
                              </span>
                            </div>
                          )}

                          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                            {relatedBlog.blog_name || relatedBlog.blog_title}
                          </h3>

                          <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                            {relatedBlog.blog_description}
                          </p>

                          <div className="flex items-center justify-between text-gray-500 text-xs">
                            <div className="flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {new Date(relatedBlog.publishdate || relatedBlog.created_at).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric'
                              })}
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center">
                                <Eye className="w-3 h-3 mr-1" />
                                <span>{relatedBlog.views || '0'}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {/* Newsletter Signup */}
            <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Stay Updated</h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Get the latest articles and insights delivered directly to your inbox.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium whitespace-nowrap">
                  Subscribe
                </button>
              </div>
            </div>
          </main>

          {/* Sidebar */}
          <aside className="lg:w-1/3">
            <div className="sticky top-24">
              <BlogSidebar 
                categories={categories} 
                currentCategory={blog.blog_cat_id}
              />
              
              {/* Author Info Widget */}
              {(blog.author_name || blog.author) && (
                <div className="mt-8 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">About the Author</h3>
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {blog.author_name || blog.author}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Content writer passionate about technology and innovation.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Social Networks Widget */}
              <div className="mt-8 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Follow Us</h3>
                <div className="space-y-3">
                  <a href="#" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                    <Facebook className="w-5 h-5 mr-3 text-blue-600" />
                    Facebook
                  </a>
                  <a href="#" className="flex items-center text-gray-600 hover:text-sky-500 transition-colors">
                    <Twitter className="w-5 h-5 mr-3 text-sky-500" />
                    Twitter
                  </a>
                  <a href="#" className="flex items-center text-gray-600 hover:text-pink-600 transition-colors">
                    <Instagram className="w-5 h-5 mr-3 text-pink-600" />
                    Instagram
                  </a>
                  <a href="#" className="flex items-center text-gray-600 hover:text-blue-700 transition-colors">
                    <Linkedin className="w-5 h-5 mr-3 text-blue-700" />
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}