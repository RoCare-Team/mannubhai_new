import { getActiveBlogs } from '../lib/fetchBlogs';
import Link from 'next/link';

export default async function BlogList() {
  const blogs = await getActiveBlogs();

  if (!blogs || blogs.length === 0) {
    return <div className="container mx-auto px-4 py-8">No blogs found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Our Blog Posts</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map(blog => (
          <div key={blog.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <Link href={`/blogs/${blog.blog_url}`}>
              <div>
                {blog.blog_image && (
                  <img 
                    src={`/blogs/${blog.blog_image}`} 
                    alt={blog.blog_name}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h2 className="text-xl font-bold mb-2">{blog.blog_name}</h2>
                  <p className="text-gray-600 text-sm mb-3">
                    {blog.blog_description}
                  </p>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">
                      {blog.publishdate || blog.created_at}
                    </span>
                    <span className="text-blue-600">Read more →</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}