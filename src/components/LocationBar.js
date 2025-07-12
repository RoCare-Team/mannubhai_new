"use client";
import { CiLocationOn } from "react-icons/ci";
import { MdEditLocationAlt } from "react-icons/md";

export default function LocationBar({ 
  locationText, 
  onLocationClick, 
  isLoading 
}) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border-b border-gray-200">
      <CiLocationOn className="text-gray-500" />
      <div className="flex-1 min-w-0">
        <p 
          className="text-sm text-gray-700 truncate"
          title={locationText}
        >
          {locationText}
        </p>
      </div>
      <button
        onClick={onLocationClick}
        className="text-blue-500 hover:text-blue-600 transition-colors text-lg"
        disabled={isLoading}
        aria-label={isLoading ? "Detecting location" : "Change location"}
      >
        {isLoading ? (
          <span className="inline-block w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        ) : (
          <MdEditLocationAlt />
        )}
      </button>
    </div>
  );
}