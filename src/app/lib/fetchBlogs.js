import { db } from "../firebaseConfig"; 
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  limit 
} from "firebase/firestore";

// Get all active blogs
export async function getActiveBlogs() {
  try {
    const q = query(
      collection(db, "blog"),
      where("status", "==", "active"),
      orderBy("publishdate", "desc")
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return [];
  }
}

// Get categories for filtering
export async function getCategories() {
  try {
    // Extract unique categories directly from blogs using blog_cat_id
    const blogs = await getActiveBlogs();
    const uniqueCategories = [...new Set(blogs
      .filter(blog => blog.blog_cat_id && blog.blog_cat_id.trim() !== '')
      .map(blog => blog.blog_cat_id)
    )];
    
    console.log("Unique categories found:", uniqueCategories);
    
    return uniqueCategories.map((category, index) => ({
      id: index + 1,
      name: category,
      category_url: category.toLowerCase().replace(/\s+/g, '-')
    }));
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

// Get related blogs by category - FIXED
export async function getRelatedBlogs(category, currentBlogId, limitCount = 3) {
  try {
    if (!category) return [];
    
    console.log("Looking for related blogs with category:", category);
    
    // Use the correct field name: blog_cat_id
    const q = query(
      collection(db, "blog"),
      where("status", "==", "active"),
      where("blog_cat_id", "==", category), // FIXED: Use blog_cat_id
      orderBy("publishdate", "desc"),
      limit(limitCount + 1) // +1 to exclude current blog
    );
    
    const querySnapshot = await getDocs(q);
    console.log("Related blogs found:", querySnapshot.size);
    
    return querySnapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      .filter(blog => blog.id !== currentBlogId)
      .slice(0, limitCount);
  } catch (error) {
    console.error("Error fetching related blogs:", error);
    // Fallback: get recent blogs excluding current
    const recentBlogs = await getRecentBlogs(limitCount + 1);
    return recentBlogs.filter(blog => blog.id !== currentBlogId).slice(0, limitCount);
  }
}

// Get blogs by category - FIXED
export async function getBlogsByCategory(category) {
  try {
    console.log("Fetching blogs for category:", category);
    
    // Use the correct field name: blog_cat_id
    const q = query(
      collection(db, "blog"),
      where("status", "==", "active"),
      where("blog_cat_id", "==", category), // FIXED: Use blog_cat_id
      orderBy("publishdate", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    console.log("Blogs found for category:", querySnapshot.size);
    
    const blogs = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Log the first blog for debugging
    if (blogs.length > 0) {
      console.log("First blog data:", blogs[0]);
    }
    
    return blogs;
  } catch (error) {
    console.error("Error fetching blogs by category:", error);
    return [];
  }
}

// Search blogs - UPDATED to use correct field names
export async function searchBlogs(searchTerm) {
  try {
    // Firebase doesn't support full-text search natively
    // You might want to implement this with Algolia or similar service
    // For now, we'll get all blogs and filter client-side
    const allBlogs = await getActiveBlogs();
    
    return allBlogs.filter(blog => 
      blog.blog_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.blog_description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.blog_content_text?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.blog_title?.toLowerCase().includes(searchTerm.toLowerCase()) // Added blog_title
    );
  } catch (error) {
    console.error("Error searching blogs:", error);
    return [];
  }
}

// Get recent blogs
export async function getRecentBlogs(limitCount = 5) {
  try {
    const q = query(
      collection(db, "blog"),
      where("status", "==", "active"),
      orderBy("publishdate", "desc"),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching recent blogs:", error);
    return [];
  }
}

// Get popular blogs (assuming you have a views or likes field)
export async function getPopularBlogs(limitCount = 5) {
  try {
    const q = query(
      collection(db, "blog"),
      where("status", "==", "active"),
      orderBy("views", "desc"), // or "likes", "shares", etc.
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching popular blogs:", error);
    // Fallback to recent blogs if views field doesn't exist
    return await getRecentBlogs(limitCount);
  }
}

// Debug function to check what categories exist
export async function debugCategories() {
  try {
    const blogs = await getActiveBlogs();
    const categories = blogs.map(blog => ({
      id: blog.id,
      blog_cat_id: blog.blog_cat_id,
      blog_type: blog.blog_type,
      blog_name: blog.blog_name
    }));
    console.log("All blog categories:", categories);
    return categories;
  } catch (error) {
    console.error("Error debugging categories:", error);
    return [];
  }
}