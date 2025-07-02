"use client";
import { useState, useMemo, useCallback } from "react";
import Image from "next/image";
import { FiSearch, FiX } from "react-icons/fi";

const DEFAULT_BRAND_IMAGE = "/problem_images/default-problem.png";

const BrandsModal = ({
  showBrandsModal,
  setShowBrandsModal,
  loading,
  brands,
  currentSubService,
  handleBrandSelection,
}) => {
  const [search, setSearch] = useState("");

  // Memoized filtered brands computation
  const filteredBrands = useMemo(() => {
    if (!search) return brands;
    const searchTerm = search.toLowerCase();
    return brands.filter((brand) => 
      brand.name?.toLowerCase().includes(searchTerm)
    );
  }, [brands, search]);

  // Memoized close handler
  const handleClose = useCallback(() => {
    setShowBrandsModal(false);
    setSearch(""); // Reset search on close
  }, [setShowBrandsModal]);

  // Memoized brand selection handler
  const handleBrandClick = useCallback((brand) => {
    handleBrandSelection(brand);
    handleClose();
  }, [handleBrandSelection, handleClose]);

  // Early return if not visible
  if (!showBrandsModal) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/80">
      <div className="bg-white rounded-xl p-5 w-full max-w-2xl shadow-2xl animate-fade-in max-h-[80vh] overflow-y-auto border border-gray-100">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            {currentSubService?.type && (
              <h2 className="text-xl font-bold text-gray-900">
                Select Brand For {currentSubService.type}
              </h2>
            )}
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 hover:bg-gray-50 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <FiX className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-4 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400 text-sm" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search brands..."
            className="w-full pl-8 pr-3 py-2 text-sm border-0 ring-1 ring-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
            aria-label="Search brands"
          />
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent" />
          </div>
        ) : filteredBrands.length > 0 ? (
          <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {filteredBrands.map((brand) => (
              <button
                key={brand.id}
                className="group flex flex-col items-center bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-2 border border-gray-100 hover:border-blue-50"
                onClick={() => handleBrandClick(brand)}
                aria-label={`Select ${brand.name}`}
              >
                <div className="relative aspect-square w-full mb-2">
                  <Image
                    src={brand.imageUrl || DEFAULT_BRAND_IMAGE}
                    alt={brand.name}
                    fill
                    className="object-contain p-1 group-hover:scale-105 transition-transform duration-200"
                    sizes="(max-width: 640px) 100px, 120px"
                    priority={brands.indexOf(brand) < 10} // Only prioritize first 10 images
                    onError={(e) => {
                      e.target.src = DEFAULT_BRAND_IMAGE;
                      e.target.onerror = null;
                    }}
                  />
                </div>
                <span className="text-xs font-medium text-gray-800 text-center line-clamp-2 px-1">
                  {brand.name}
                </span>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-16 h-16 mb-3 bg-gray-50 rounded-full flex items-center justify-center">
              <FiSearch className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-1">
              No brands found
            </h3>
            <p className="text-gray-500 text-sm max-w-xs">
              {search ? "No matching brands found" : "No brands available"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandsModal;