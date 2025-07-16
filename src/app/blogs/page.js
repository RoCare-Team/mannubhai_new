import BlogImage from '@/components/BlogImage';
import { getActiveBlogs } from '../lib/fetchBlogs';
import Link from 'next/link';
import Footer from "@/components/Footer";
import Header from "@/components/Header";
export default async function BlogList() {

  const blogs = await getActiveBlogs();

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
    <>
     <Header />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative container mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
              Our Blog
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
              Discover insights, stories, and knowledge from our latest posts
            </p>
            <div className="mt-8 flex justify-center">
              <div className="w-20 h-1 bg-white rounded-full"></div>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white opacity-5 rounded-full"></div>
          <div className="absolute top-1/2 -left-20 w-60 h-60 bg-white opacity-5 rounded-full"></div>
          <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-white opacity-5 rounded-full"></div>
        </div>
      </div>

      {/* Blog Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog, index) => (
            <article 
              key={blog.id} 
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Link href={`/blogs/${blog.blog_url}`} className="block">
                <div className="relative overflow-hidden">
                  <BlogImage
                    src={blog.blog_image ? `/uploads/${blog.blog_image}` : 'uploads/blog_defult.webp'}
                    alt={blog.blog_name}
                    className="w-full h-56 object-cover transition-transform duration-700 group-hover:scale-110"
                    fallbackSrc="uploads/blog_defult.webp"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Read More Badge */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 transform translate-x-12 group-hover:translate-x-0 transition-transform duration-300">
                    <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
                
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                    {blog.blog_name}
                  </h2>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                    {blog.blog_description}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          {blog.blog_name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-gray-500 text-sm">
                        {new Date(blog.publishdate || blog.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-1 text-blue-600 group-hover:text-blue-700 transition-colors duration-300">
                      <span className="text-sm font-medium">Read more</span>
                      <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
        
        {/* Load More Button (Optional) */}
        
      </div>
    </div>
     <Footer />
    </>
   
  );
}