"use client";
import { CiLocationOn } from "react-icons/ci";
import { MdEditLocationAlt } from "react-icons/md";

export default function LocationBar({ locationText, setShowLocationSearch, location }) {
  return (
    <div className="flex items-center gap-2 py-2 border-b border-gray-100">
      
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-700 truncate" title={locationText}>
          {locationText}
        </p>
      </div>
      <button
        onClick={() => setShowLocationSearch(true)}
        className="text-blue-500 hover:text-blue-600 transition-colors text-lg shrink-0"
        disabled={location.loading}
        aria-label="Change location"
      >
        {location.loading ? "..." : <MdEditLocationAlt />}
      </button>
    </div>
  );
}
