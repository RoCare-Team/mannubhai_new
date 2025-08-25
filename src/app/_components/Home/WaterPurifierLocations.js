"use client";
import { useState } from 'react';
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

const WaterPurifierLocations = () => {
  const [isQuickLinksOpen, setIsQuickLinksOpen] = useState(true);
  const [selectedCity, setSelectedCity] = useState('');

  // Service locations data
  const locations = [
    { name: 'Agartala', url: 'https://www.mannubhai.com/agartala/water-purifier-service' },
    { name: 'Agra', url: 'https://www.mannubhai.com/agra/water-purifier-service' },
    { name: 'Ahmedabad', url: 'https://www.mannubhai.com/ahmedabad/water-purifier-service' },
    { name: 'Bargarh', url: 'https://www.mannubhai.com/bargarh/water-purifier-service' },
    { name: 'Bawal', url: 'https://www.mannubhai.com/bawal/water-purifier-service' },
    { name: 'Bhagalpur', url: 'https://www.mannubhai.com/bhagalpur/water-purifier-service' },
    { name: 'Bhubaneswar', url: 'https://www.mannubhai.com/bhubaneswar/water-purifier-service' },
    { name: 'Bhuj', url: 'https://www.mannubhai.com/bhuj/water-purifier-service' },
    { name: 'Bijnor', url: 'https://www.mannubhai.com/bijnor/water-purifier-service' },
    { name: 'Chapra', url: 'https://www.mannubhai.com/chapra/water-purifier-service' },
    { name: 'Chaudwar', url: 'https://www.mannubhai.com/chaudwar/water-purifier-service' },
    { name: 'Cuttack', url: 'https://www.mannubhai.com/cuttack/water-purifier-service' },
    { name: 'Dhampur', url: 'https://www.mannubhai.com/dhampur/water-purifier-service' },
    { name: 'Dholka', url: 'https://www.mannubhai.com/dholka/water-purifier-service' },
    { name: 'East Delhi', url: 'https://www.mannubhai.com/east-delhi/water-purifier-service' },
    { name: 'Faridabad', url: 'https://www.mannubhai.com/faridabad/water-purifier-service' },
    { name: 'Gandhinagar', url: 'https://www.mannubhai.com/gandhinagar/water-purifier-service' },
    { name: 'Gandhidham', url: 'https://www.mannubhai.com/gandhidham/water-purifier-service' },
    { name: 'Ghaziabad', url: 'https://www.mannubhai.com/ghaziabad/water-purifier-service' },
    { name: 'Ghilot', url: 'https://www.mannubhai.com/ghilot/water-purifier-service' },
    { name: 'Gonda', url: 'https://www.mannubhai.com/gonda/water-purifier-service' },
    { name: 'Greater Noida', url: 'https://www.mannubhai.com/greater-noida/water-purifier-service' },
    { name: 'Gurgaon', url: 'https://www.mannubhai.com/gurgaon/water-purifier-service' },
    { name: 'Guwahati', url: 'https://www.mannubhai.com/guwahati/water-purifier-service' },
    { name: 'Haridwar', url: 'https://www.mannubhai.com/haridwar/water-purifier-service' },
    { name: 'Hazaribagh', url: 'https://www.mannubhai.com/hazaribagh/water-purifier-service' },
    { name: 'Indore', url: 'https://www.mannubhai.com/indore/water-purifier-service' },
    { name: 'Jaipur', url: 'https://www.mannubhai.com/jaipur/water-purifier-service' },
    { name: 'Jamugurihat', url: 'https://www.mannubhai.com/jamugurihat/water-purifier-service' },
    { name: 'Kanpur', url: 'https://www.mannubhai.com/kanpur/water-purifier-service' },
    { name: 'Khordha', url: 'https://www.mannubhai.com/khordha/water-purifier-service' },
    { name: 'Kota', url: 'https://www.mannubhai.com/kota/water-purifier-service' },
    { name: 'Kotputli', url: 'https://www.mannubhai.com/kotputli/water-purifier-service' },
    { name: 'Lucknow', url: 'https://www.mannubhai.com/lucknow/water-purifier-service' },
    { name: 'Moradabad', url: 'https://www.mannubhai.com/moradabad/water-purifier-service' },
    { name: 'Nagpur', url: 'https://www.mannubhai.com/nagpur/water-purifier-service' },
    { name: 'Namsai', url: 'https://www.mannubhai.com/namsai/water-purifier-service' },
    { name: 'Narnaul', url: 'https://www.mannubhai.com/narnaul/water-purifier-service' },
    { name: 'Nashik', url: 'https://www.mannubhai.com/nashik/water-purifier-service' },
    { name: 'Neemrana', url: 'https://www.mannubhai.com/neemrana/water-purifier-service' },
    { name: 'Noida', url: 'https://www.mannubhai.com/noida/water-purifier-service' },
    { name: 'Patna', url: 'https://www.mannubhai.com/patna/water-purifier-service' },
    { name: 'Port Blair', url: 'https://www.mannubhai.com/port-blair/water-purifier-service' },
    { name: 'Prayagraj', url: 'https://www.mannubhai.com/prayagraj/water-purifier-service' },
    { name: 'Pune', url: 'https://www.mannubhai.com/pune/water-purifier-service' },
    { name: 'Raipur', url: 'https://www.mannubhai.com/raipur/water-purifier-service' },
    { name: 'Ranchi', url: 'https://www.mannubhai.com/ranchi/water-purifier-service' },
    { name: 'Rewari', url: 'https://www.mannubhai.com/rewari/water-purifier-service' },
    { name: 'Rohini Delhi', url: 'https://www.mannubhai.com/rohini-delhi/water-purifier-service' },
    { name: 'Rohtak', url: 'https://www.mannubhai.com/rohtak/water-purifier-service' },
    { name: 'Shahjahanpur', url: 'https://www.mannubhai.com/shahjahanpur/water-purifier-service' },
    { name: 'Siliguri', url: 'https://www.mannubhai.com/siliguri/water-purifier-service' },
    { name: 'South Delhi', url: 'https://www.mannubhai.com/south-delhi/water-purifier-service' },
    { name: 'Surat', url: 'https://www.mannubhai.com/surat/water-purifier-service' },
    { name: 'Thane', url: 'https://www.mannubhai.com/thane/water-purifier-service' },
    { name: 'Tinsukia', url: 'https://www.mannubhai.com/tinsukia/water-purifier-service' },
    { name: 'Tohana', url: 'https://www.mannubhai.com/tohana/water-purifier-service' },
    { name: 'Ujjain', url: 'https://www.mannubhai.com/ujjain/water-purifier-service' },
    { name: 'Vadodara', url: 'https://www.mannubhai.com/vadodara/water-purifier-service' },
    { name: 'Varanasi', url: 'https://www.mannubhai.com/varanasi/water-purifier-service' },
    { name: 'Vikaspuri Delhi', url: 'https://www.mannubhai.com/vikaspuri-delhi/water-purifier-service' },
    { name: 'West Delhi', url: 'https://www.mannubhai.com/west-delhi/water-purifier-service' }
  ];

  const selectedLocation = locations.find(loc => loc.name === selectedCity);

  return (
    <div className="min-h-screen bg-gray-50 p-6 mb-0">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Quick Links
          </h1>
        </div>
        {/* Quick Links Section */}
        <div className="mb-8">
          <div className="bg-white rounded-lg border border-gray-200">
            <button
              onClick={() => setIsQuickLinksOpen(!isQuickLinksOpen)}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors duration-200 rounded-t-lg"
            >
              <h2 className="text-lg font-semibold text-gray-900">
                Popular Serving Cities In India
              </h2>
              {isQuickLinksOpen ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
            
            {isQuickLinksOpen && (
              <div className="px-6 pb-6 border-t border-gray-100">
                <div className="flex flex-wrap gap-2 mt-4">
                  {locations.map((location, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedCity(location.name)}
                      className={`px-3 py-2 text-sm rounded-md transition-all duration-200 border ${
                        selectedCity === location.name
                          ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-sm'
                          : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                      } ${
                        location.name === 'Faridabad' 
                          ? 'font-semibold ring-2 ring-blue-300 ring-opacity-50' 
                          : ''
                      }`}
                    >
                      {location.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Selected City Display */}
        {selectedLocation && (
          <div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-0">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Water Purifier Service in {selectedLocation.name}
                    {selectedLocation.name === 'Faridabad' && (
                      <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        Your City
                      </span>
                    )}
                  </h3>
                  <p className="text-gray-600">
                    Professional maintenance and repair services for all brands of water purifiers
                  </p>
                </div>
                <a
                  href={selectedLocation.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Visit Page
                  <ExternalLink className="w-4 h-4 ml-1" />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WaterPurifierLocations;