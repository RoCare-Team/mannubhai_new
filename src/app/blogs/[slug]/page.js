import { getActiveBlogs } from "@/app/lib/fetchBlogs";
export async function generateStaticParams() {
  const blogs = await getActiveBlogs();
  
  if (!blogs || blogs.length === 0) {
    return [];
  }

  return blogs.map(blog => ({
    slug: blog.blog_url
  }));
}

export default async function BlogPost({ params }) {
  const blogs = await getActiveBlogs();
  const blog = blogs.find(b => b.blog_url === params.slug);

  if (!blog) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">Blog post not found</h1>
      </div>
    );
  }

  return (
    <>
    
     <div className="container mx-auto px-4 py-8 max-w-4xl">
      <article>
        <h1 className="text-3xl font-bold mb-4">{blog.blog_name}</h1>
        <div 
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: blog.blog_content_text }}
        />
      </article>
    </div>

    </>
   
  );
}