"use client";
import { useState, useMemo } from "react";
import Image from "next/image";
import { FiSearch, FiX } from "react-icons/fi";

const DEFAULT_MODEL_IMAGE = "/brand_images/default-brand.png";

const ModelsModal = ({
  showModelsModal,
  setShowModelsModal,
  loading,
  models,
  selectedBrand,
  handleModelSelection,
}) => {
  const [search, setSearch] = useState("");

  const filteredModels = useMemo(() => {
    if (!search) return models;
    return models.filter((model) =>
      model.name?.toLowerCase().includes(search.toLowerCase())
    );
  }, [models, search]);

  if (!showModelsModal) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: "#000000cf" }}>
      <div className="bg-white rounded-xl p-5 w-full max-w-2xl shadow-2xl animate-fade-in max-h-[80vh] overflow-y-auto border border-gray-100">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 text-css">
              Select Model for {selectedBrand?.name || "Brand"}
            </h2>
          </div>
          <button
            onClick={() => setShowModelsModal(false)}
            className="p-1.5 hover:bg-gray-50 rounded-full transition-colors"
            aria-label="Close models modal"
          >
            <FiX className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-4 relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search models..."
            className="w-full pl-8 pr-3 py-2 text-sm border-0 ring-1 ring-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
          />
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
          </div>
        ) : filteredModels.length > 0 ? (
          <div className="flex overflow-x-auto gap-3 pb-2">
            {filteredModels.map((model) => (
              <article
                key={model.id}
                className="group flex-shrink-0 w-28 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-2 cursor-pointer border border-gray-100 hover:border-blue-50"
                onClick={() => handleModelSelection(model)}
              >
                <div className="aspect-square w-full mb-2 relative">
                  <Image
                    src={model.imageUrl || DEFAULT_MODEL_IMAGE}
                    alt={model.name}
                    fill
                    className="object-contain p-1 group-hover:scale-105 transition-transform duration-200"
                    onError={(e) => {
                      e.target.src = DEFAULT_MODEL_IMAGE;
                      e.target.onerror = null;
                    }}
                    priority
                  />
                </div>
                <h3 className="text-xs font-medium text-gray-800 text-center line-clamp-2 px-1">
                  {model.name}
                </h3>
              </article>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-16 h-16 mb-3 bg-gray-50 rounded-full flex items-center justify-center">
              <FiSearch className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-1">
              No models found
            </h3>
            <p className="text-gray-500 text-sm max-w-xs">
              No matching models found for your search
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModelsModal;