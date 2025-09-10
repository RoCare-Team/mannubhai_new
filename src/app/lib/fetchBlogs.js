import { db } from "../firebaseConfig"; 
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  limit,
  doc,
  getDoc
} from "firebase/firestore";

// Helper function to create blog object with proper ID handling
function createBlogObject(docSnapshot) {
  const data = docSnapshot.data();
  return {
    id: data.id || docSnapshot.id, // Use data.id if available, fallback to doc.id
    docId: docSnapshot.id, // Always include document ID for reference
    ...data
  };
}

// Get all active blogs
export async function getActiveBlogs() {
  try {
    const q = query(
      collection(db, "blog"),
      where("status", "==", "active"),
      orderBy("publishdate", "desc")
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => createBlogObject(doc));
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return [];
  }
}

// Get a single blog by ID (checks both data.id and doc.id)
export async function getBlogById(blogId) {
  try {
    // First try to get by document ID
    const docRef = doc(db, "blog", blogId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return createBlogObject(docSnap);
    }
    
    // If not found by document ID, search by data.id field
    const q = query(
      collection(db, "blog"),
      where("id", "==", blogId),
      where("status", "==", "active"),
      limit(1)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      return createBlogObject(querySnapshot.docs[0]);
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching blog by ID:", error);
    return null;
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

// Get related blogs by category - Updated with dual ID support
export async function getRelatedBlogs(category, currentBlogId, limitCount = 3) {
  try {
    if (!category) return [];
    
    console.log("Looking for related blogs with category:", category);
    
    // Use the correct field name: blog_cat_id
    const q = query(
      collection(db, "blog"),
      where("status", "==", "active"),
      where("blog_cat_id", "==", category),
      orderBy("publishdate", "desc"),
      limit(limitCount + 5) // Get more to ensure we have enough after filtering
    );
    
    const querySnapshot = await getDocs(q);
    console.log("Related blogs found:", querySnapshot.size);
    
    return querySnapshot.docs
      .map(doc => createBlogObject(doc))
      .filter(blog => {
        // Filter out current blog by checking both id and docId
        return blog.id !== currentBlogId && blog.docId !== currentBlogId;
      })
      .slice(0, limitCount);
  } catch (error) {
    console.error("Error fetching related blogs:", error);
    // Fallback: get recent blogs excluding current
    const recentBlogs = await getRecentBlogs(limitCount + 1);
    return recentBlogs.filter(blog => 
      blog.id !== currentBlogId && blog.docId !== currentBlogId
    ).slice(0, limitCount);
  }
}

// Get blogs by category - Updated with dual ID support
export async function getBlogsByCategory(category) {
  try {
    console.log("Fetching blogs for category:", category);
    
    // Use the correct field name: blog_cat_id
    const q = query(
      collection(db, "blog"),
      where("status", "==", "active"),
      where("blog_cat_id", "==", category),
      orderBy("publishdate", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    console.log("Blogs found for category:", querySnapshot.size);
    
    const blogs = querySnapshot.docs.map(doc => createBlogObject(doc));
    
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

// Search blogs - UPDATED to use correct field names and dual ID support
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
      blog.blog_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.meta_title?.toLowerCase().includes(searchTerm.toLowerCase())
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
    
    return querySnapshot.docs.map(doc => createBlogObject(doc));
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
    
    return querySnapshot.docs.map(doc => createBlogObject(doc));
  } catch (error) {
    console.error("Error fetching popular blogs:", error);
    // Fallback to recent blogs if views field doesn't exist
    return await getRecentBlogs(limitCount);
  }
}

// Get blogs with pagination support
export async function getBlogsWithPagination(pageSize = 10, startAfterDoc = null) {
  try {
    let q = query(
      collection(db, "blog"),
      where("status", "==", "active"),
      orderBy("publishdate", "desc"),
      limit(pageSize)
    );

    if (startAfterDoc) {
      q = query(
        collection(db, "blog"),
        where("status", "==", "active"),
        orderBy("publishdate", "desc"),
        startAfter(startAfterDoc),
        limit(pageSize)
      );
    }

    const querySnapshot = await getDocs(q);
    
    return {
      blogs: querySnapshot.docs.map(doc => createBlogObject(doc)),
      lastDoc: querySnapshot.docs[querySnapshot.docs.length - 1] || null,
      hasMore: querySnapshot.docs.length === pageSize
    };
  } catch (error) {
    console.error("Error fetching blogs with pagination:", error);
    return {
      blogs: [],
      lastDoc: null,
      hasMore: false
    };
  }
}

// Debug function to check what categories exist
export async function debugCategories() {
  try {
    const blogs = await getActiveBlogs();
    const categories = blogs.map(blog => ({
      id: blog.id,
      docId: blog.docId,
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

// Utility function to check if a blog exists by either ID
export async function blogExists(blogId) {
  try {
    const blog = await getBlogById(blogId);
    return blog !== null;
  } catch (error) {
    console.error("Error checking if blog exists:", error);
    return false;
  }
}