"use client";
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { IoSearchOutline, IoCloseOutline } from 'react-icons/io5';
import { db } from '../app/firebaseConfig';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';

const CategorySearch = ({ isDesktop = false, className = '' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  // Fetch categories from Firebase
  const fetchCategories = async (term) => {
    if (!term.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    setIsLoading(true);
    try {
      const categoriesRef = collection(db, 'category_manage');
      
      // Convert search term to lowercase for case-insensitive search
      const searchTermLower = term.toLowerCase();
      
      // Method 1: Prefix search (recommended for Firestore)
      const q = query(
        categoriesRef,
        orderBy('category_name'),
        where('category_name', '>=', searchTermLower),
        where('category_name', '<=', searchTermLower + '\uf8ff'),
        limit(10) // Limit results for better performance
      );
      
      const querySnapshot = await getDocs(q);
      const results = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        // Additional client-side filtering for partial matches
        if (data.category_name && data.category_name.toLowerCase().includes(searchTermLower)) {
          results.push({ id: doc.id, ...data });
        }
      });
      
      // If no results with prefix search, try getting all and filter client-side
      if (results.length === 0) {
        const allQuery = query(categoriesRef, limit(50)); // Limit for performance
        const allSnapshot = await getDocs(allQuery);
        
        allSnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.category_name && data.category_name.toLowerCase().includes(searchTermLower)) {
            results.push({ id: doc.id, ...data });
          }
        });
      }
      
      setSearchResults(results);
      setShowDropdown(true);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setSearchResults([]);
      setShowDropdown(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Alternative method: Fetch all categories and filter client-side
  const fetchCategoriesClientSide = async (term) => {
    if (!term.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    setIsLoading(true);
    try {
      const categoriesRef = collection(db, 'category_manage');
      const q = query(categoriesRef, limit(100)); // Adjust limit based on your data size
      
      const querySnapshot = await getDocs(q);
      const results = [];
      const searchTermLower = term.toLowerCase();
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.category_name && data.category_name.toLowerCase().includes(searchTermLower)) {
          results.push({ id: doc.id, ...data });
        }
      });
      
      // Sort results by relevance (exact matches first, then partial matches)
      results.sort((a, b) => {
        const aName = a.category_name.toLowerCase();
        const bName = b.category_name.toLowerCase();
        
        // Exact matches first
        if (aName === searchTermLower && bName !== searchTermLower) return -1;
        if (bName === searchTermLower && aName !== searchTermLower) return 1;
        
        // Then matches that start with the search term
        if (aName.startsWith(searchTermLower) && !bName.startsWith(searchTermLower)) return -1;
        if (bName.startsWith(searchTermLower) && !aName.startsWith(searchTermLower)) return 1;
        
        // Finally alphabetical order
        return aName.localeCompare(bName);
      });
      
      setSearchResults(results.slice(0, 10)); // Limit displayed results
      setShowDropdown(true);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setSearchResults([]);
      setShowDropdown(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle search input changes with debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      // Use fetchCategoriesClientSide for better search results
      fetchCategoriesClientSide(searchTerm);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle search submit
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim() && searchResults.length > 0) {
      router.push(searchResults[0].category_url);
      setSearchTerm('');
      setShowDropdown(false);
    }
  };

  // Handle category selection
  const handleSelectCategory = (category) => {
    router.push(category.category_url);
    setSearchTerm('');
    setShowDropdown(false);
  };

  // Clear search input
  const clearSearch = () => {
    setSearchTerm('');
    setShowDropdown(false);
    inputRef.current?.focus();
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setShowDropdown(false);
    } else if (e.key === 'ArrowDown' && searchResults.length > 0) {
      e.preventDefault();
      const firstResult = document.getElementById(`result-0`);
      firstResult?.focus();
    }
  };

  // Handle keyboard navigation in results
  const handleResultKeyDown = (e, index, category) => {
    if (e.key === 'Enter') {
      handleSelectCategory(category);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextResult = document.getElementById(`result-${index + 1}`);
      nextResult?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (index === 0) {
        inputRef.current?.focus();
      } else {
        const prevResult = document.getElementById(`result-${index - 1}`);
        prevResult?.focus();
      }
    }
  };

  return (
    <div className={`relative ${className}`} ref={searchRef}>
      <form onSubmit={handleSearch}>
        <div className={`flex items-center gap-2 rounded-lg px-3 ${
          isDesktop 
            ? 'border border-gray-300 h-10 bg-white' 
            : 'bg-gray-50 py-2'
        } ${isFocused ? 'ring-2 ring-blue-500 border-blue-500' : ''}`}>
          <IoSearchOutline className="text-gray-500 text-lg shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => {
              setIsFocused(true);
              if (searchTerm) setShowDropdown(true);
            }}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none text-sm placeholder-gray-500"
            aria-haspopup="listbox"
            aria-expanded={showDropdown}
          />
          {searchTerm && !isLoading && (
            <button
              type="button"
              onClick={clearSearch}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Clear search"
            >
              <IoCloseOutline className="text-lg" />
            </button>
          )}
          {isLoading && (
            <div className="ml-1">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
            </div>
          )}
        </div>
      </form>

      {/* Search Results Dropdown */}
      {showDropdown && (
        <div 
          className={`absolute top-full left-0 z-20 mt-1 bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 ${
            isDesktop ? 'w-full' : 'right-0'
          }`}
          role="listbox"
        >
          <div className="max-h-60 overflow-y-auto">
            {searchResults.length > 0 ? (
              searchResults.map((category, index) => (
                <div
                  key={category.id}
                  id={`result-${index}`}
                  tabIndex={0}
                  className="px-4 py-3 hover:bg-blue-50 cursor-pointer flex items-center gap-3 transition-colors duration-150 focus:bg-blue-50 focus:outline-none"
                  onClick={() => handleSelectCategory(category)}
                  onKeyDown={(e) => handleResultKeyDown(e, index, category)}
                  role="option"
                  aria-selected={index === 0}
                >
                  <div className="bg-gray-100 rounded-md w-8 h-8 flex items-center justify-center shrink-0">
                    <IoSearchOutline className="text-gray-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-800 capitalize truncate">
                      {category.category_name}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {category.category_url?.replace(/^https?:\/\//, '') || 'No URL'}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-3 text-gray-500 text-center">
                {searchTerm.trim() ? "No matching services found" : "Type to search services"}
              </div>
            )}
          </div>
          
          {searchResults.length > 0 && (
            <div className="bg-gray-50 px-4 py-2 text-xs text-gray-500 border-t border-gray-200">
              Press Enter to go to first result
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CategorySearch;