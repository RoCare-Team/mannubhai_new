"use client";
import { useState, useMemo } from "react";
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

  const filteredBrands = useMemo(() => {
    if (!search) return brands;
    return brands.filter((brand) =>
      brand.name?.toLowerCase().includes(search.toLowerCase())
    );
  }, [brands, search]);

  if (!showBrandsModal) return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{background: "#000000cf"}}>
      <div className="bg-white rounded-xl p-5 w-full max-w-2xl shadow-2xl animate-fade-in max-h-[80vh] overflow-y-auto border border-gray-100">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
              {currentSubService?.type && (
            <h2 className="text-xl font-bold text-gray-900 text-css">
              Select Brand  For  {currentSubService.type}
            </h2>
              )}
          </div>
          <button
            onClick={() => setShowBrandsModal(false)}
            className="p-1.5 hover:bg-gray-50 rounded-full transition-colors"
          >
            <FiX className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Compact Search Bar */}
        <div className="mb-4 relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search brands..."
            className="w-full pl-8 pr-3 py-2 text-sm border-0 ring-1 ring-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
          />
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
          </div>
        ) : filteredBrands.length > 0 ? (
          <div className="flex overflow-x-auto gap-3 pb-2">
            {filteredBrands.map((brand) => (
              <article
                key={brand.id}
                className="group flex-shrink-0 w-28 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-2 cursor-pointer border border-gray-100 hover:border-blue-50"
                onClick={() => handleBrandSelection(brand)}
              >
                <div className="aspect-square w-full mb-2 relative">
                  <Image
                    src={brand.imageUrl}
                    alt={brand.name}
                    fill
                    className="object-contain p-1 group-hover:scale-105 transition-transform duration-200"
                    onError={(e) => {
                      e.target.src = DEFAULT_BRAND_IMAGE;
                      e.target.onerror = null;
                    }}
                    priority
                  />
                </div>
                <h3 className="text-xs font-medium text-gray-800 text-center line-clamp-2 px-1">
                  {brand.name}
                </h3>
              </article>
            ))}
          </div>
        )  : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-16 h-16 mb-3 bg-gray-50 rounded-full flex items-center justify-center">
              <FiSearch className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-1">
              No brands found
            </h3>
            <p className="text-gray-500 text-sm max-w-xs">
              No matching brands found for your search
            </p>
          </div>
        )}

        {/* <div className="mt-6 border-t border-gray-100 pt-4">
          <button
            className="w-full px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            onClick={() => setShowBrandsModal(false)}
          >
            Close
          </button>
        </div> */}
      </div>
    </div>
  );
};
export default BrandsModal;