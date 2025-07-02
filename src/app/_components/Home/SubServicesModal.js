"use client";
import { CiStar } from "react-icons/ci";
import { PiUsersThree } from "react-icons/pi";
import Image from "next/image";

const DEFAULT_SUB_SERVICE_IMAGE = "/subCatImage/default-subservice.png";

const SUBSERVICE_IMAGES = {
  "Water Purifier": "/HomeIcons/water-purifier.png",
  "Air Conditioner": "/HomeIcons/AIR-CONDITIONAR.png",
  "Fridge": "/HomeIcons/REFRIGERATOR.png",
  "Washing Machine": "/HomeIcons/WASHING-Machine.png",
  "Microwave": "/HomeIcons/MICROWAVE.png",
  "Kitchen Chimney": "/HomeIcons/Kitchen-chimney.png",
  "LED TV": "/HomeIcons/LED-TV.png",
  "Vacuum Cleaner": "/HomeIcons/vacuum-cleaner.png",
  "Air Purifier": "/HomeIcons/air-purifier.png",
  "Air Cooler": "/HomeIcons/air-cooler.png",
  "Kitchen Appliance": "/HomeIcons/Kitchen-Appliance.png",
  "Geyser": "/HomeIcons/Geyser.png",
   "Women Salon At Home": "/BeautyCare/women salon at home.png",
    "Makeup": "/BeautyCare/makeup.png",
    "Spa For Women": "/BeautyCare/spa for women.png",
    "Men Salon At Home": "/BeautyCare/Men Salon at Home.png",
    "Massage For Men": "/BeautyCare/massage for men.png",
    "Pedicure And Manicure": "/BeautyCare/pedicure and maniure.png",
    "Hair Studio": "/BeautyCare/hair studio.png",
      "Carpenter": "/HandyMan/CARPENTER.png",
    "Electrician": "/HandyMan/ELECTRICIAN.png",
    "Painter": "/HandyMan/PAINTER.png",
    "Plumber": "/HandyMan/PLUMBER.png",
    "Masons": "/HandyMan/OTHER.png",
  "Sofa Cleaning": "/HomeCare/SOFA-CLEANING.png",
  "Bathroom Cleaning": "/HomeCare/BATHROOM-CLEANING.png",
  "Kitchen Cleaning": "/HomeCare/KITCHEN-CLEANING.png",
  "Home Deep Cleaning": "/HomeCare/HOMEDEEPCLEANING.png",
  "Pest Control": "/HomeCare/PEST-CONTROL.png",
  "Tank Cleaning": "/HomeCare/TANK-CLEANING.png",
};

const SubServicesModal = ({
  showModal,
  setShowModal,
  loading,
  subServices,
  selectedService,
  handleSubServiceClick,
}) => {
  if (!showModal) return null;

  return (
   
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{background: "#000000cf"}}>
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl shadow-lg animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800 text-css">
            {selectedService?.name || "Service"}
          </h2>
          <button
            onClick={() => setShowModal(false)}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : subServices.length > 0 ? (
          <div className="relative">
            <div
              className="flex flex-row overflow-x-auto gap-4 pb-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              {subServices.map((sub) => {
                const imageSrc = SUBSERVICE_IMAGES[sub.type] || DEFAULT_SUB_SERVICE_IMAGE;
                
                return (
                  <div
                    key={sub.id}
                    className="group flex-shrink-0 relative bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300 w-40 h-48 flex flex-col items-center justify-center cursor-pointer"
                    onClick={() => handleSubServiceClick(sub)}
                  >
                    <div className="p-4 flex flex-col items-center">
                      <div className="relative w-20 h-20 mb-3">
                        <Image
                          src={imageSrc}
                          alt={sub.type || "Sub-service"}
                          fill
                          className="object-contain group-hover:scale-110 transition-transform duration-300"
                          onError={(e) => {
                            e.target.src = DEFAULT_SUB_SERVICE_IMAGE;
                          }}
                        />
                      </div>
                      <h4 className="text-sm font-medium text-center text-gray-800">
                        {sub.type || "Unnamed Service"}
                      </h4>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No services found for this category.
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors duration-300"
            onClick={() => setShowModal(false)}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubServicesModal;