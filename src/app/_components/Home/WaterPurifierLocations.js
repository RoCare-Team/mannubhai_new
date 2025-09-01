"use client";
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const WaterPurifierLocations = () => {
  const [isQuickLinksOpen, setIsQuickLinksOpen] = useState(false);

  // Service locations data
  const locations = [
    { name: 'Agartala', url: 'https://www.mannubhai.com/agartala/water-purifier-service' },
    { name: 'Agra', url: 'https://www.mannubhai.com/agra/water-purifier-service' },
    { name: 'Ahmedabad', url: 'https://www.mannubhai.com/ahmedabad/water-purifier-service' },
    { name: 'Aligarh', url: 'https://www.mannubhai.com/aligarh/water-purifier-service' },
    { name: 'Amritsar', url: 'https://www.mannubhai.com/amritsar/water-purifier-service' },
    { name: 'Amroha', url: 'https://www.mannubhai.com/amroha/water-purifier-service' },
    { name: 'Auraiya', url: 'https://www.mannubhai.com/auraiya/water-purifier-service' },
    { name: 'Bahraich', url: 'https://www.mannubhai.com/bahraich/water-purifier-service' },
    { name: 'Balangir', url: 'https://www.mannubhai.com/balangir/water-purifier-service' },
    { name: 'Ballia', url: 'https://www.mannubhai.com/ballia/water-purifier-service' },
    { name: 'Balrampur', url: 'https://www.mannubhai.com/balrampur/water-purifier-service' },
    { name: 'Bardhaman', url: 'https://www.mannubhai.com/bardhaman/water-purifier-service' },
    { name: 'Bareilly', url: 'https://www.mannubhai.com/bareilly/water-purifier-service' },
    { name: 'Bargarh', url: 'https://www.mannubhai.com/bargarh/water-purifier-service' },
    { name: 'Bawal', url: 'https://www.mannubhai.com/bawal/water-purifier-service' },
    { name: 'Bhadrak', url: 'https://www.mannubhai.com/bhadrak/water-purifier-service' },
    { name: 'Bhagalpur', url: 'https://www.mannubhai.com/bhagalpur/water-purifier-service' },
    { name: 'Bhiwadi', url: 'https://www.mannubhai.com/bhiwadi/water-purifier-service' },
    { name: 'Bhubaneswar', url: 'https://www.mannubhai.com/bhubaneswar/water-purifier-service' },
    { name: 'Bhuj', url: 'https://www.mannubhai.com/bhuj/water-purifier-service' },
    { name: 'Bijnor', url: 'https://www.mannubhai.com/bijnor/water-purifier-service' },
    { name: 'Bikaner', url: 'https://www.mannubhai.com/bikaner/water-purifier-service' },
    { name: 'Bilaspur', url: 'https://www.mannubhai.com/bilaspur/water-purifier-service' },
    { name: 'Chapra', url: 'https://www.mannubhai.com/chapra/water-purifier-service' },
    { name: 'Chaudwar', url: 'https://www.mannubhai.com/chaudwar/water-purifier-service' },
    { name: 'Chickmagalur', url: 'https://www.mannubhai.com/chickmagalur/water-purifier-service' },
    { name: 'Cooch Behar', url: 'https://www.mannubhai.com/cooch-behar/water-purifier-service' },
    { name: 'Cuddalore', url: 'https://www.mannubhai.com/cuddalore/water-purifier-service' },
    { name: 'Cuttack', url: 'https://www.mannubhai.com/cuttack/water-purifier-service' },
    { name: 'Darrang', url: 'https://www.mannubhai.com/darrang/water-purifier-service' },
    { name: 'Dhampur', url: 'https://www.mannubhai.com/dhampur/water-purifier-service' },
    { name: 'Dharwad', url: 'https://www.mannubhai.com/dharwad/water-purifier-service' },
    { name: 'Dhemaji', url: 'https://www.mannubhai.com/dhemaji/water-purifier-service' },
    { name: 'Dholka', url: 'https://www.mannubhai.com/dholka/water-purifier-service' },
    { name: 'Dibang Valley', url: 'https://www.mannubhai.com/dibang-valley/water-purifier-service' },
    { name: 'Dimapur', url: 'https://www.mannubhai.com/dimapur/water-purifier-service' },
    { name: 'East Delhi', url: 'https://www.mannubhai.com/east-delhi/water-purifier-service' },
    { name: 'Faridabad', url: 'https://www.mannubhai.com/faridabad/water-purifier-service' },
    { name: 'Firozabad', url: 'https://www.mannubhai.com/firozabad/water-purifier-service' },
    { name: 'Gandhinagar', url: 'https://www.mannubhai.com/gandhinagar/water-purifier-service' },
    { name: 'Gandhidham', url: 'https://www.mannubhai.com/gandhidham/water-purifier-service' },
    { name: 'Ghaziabad', url: 'https://www.mannubhai.com/ghaziabad/water-purifier-service' },
    { name: 'Ghazipur', url: 'https://www.mannubhai.com/ghazipur/water-purifier-service' },
    { name: 'Ghilot', url: 'https://www.mannubhai.com/ghilot/water-purifier-service' },
    { name: 'Gonda', url: 'https://www.mannubhai.com/gonda/water-purifier-service' },
    { name: 'Greater Noida', url: 'https://www.mannubhai.com/greater-noida/water-purifier-service' },
    { name: 'Gurdaspur', url: 'https://www.mannubhai.com/gurdaspur/water-purifier-service' },
    { name: 'Gurgaon', url: 'https://www.mannubhai.com/gurgaon/water-purifier-service' },
    { name: 'Guwahati', url: 'https://www.mannubhai.com/guwahati/water-purifier-service' },
    { name: 'Gwalior', url: 'https://www.mannubhai.com/gwalior/water-purifier-service' },
    { name: 'Hansi', url: 'https://www.mannubhai.com/hansi/water-purifier-service' },
    { name: 'Haridwar', url: 'https://www.mannubhai.com/haridwar/water-purifier-service' },
    { name: 'Hazaribagh', url: 'https://www.mannubhai.com/hazaribagh/water-purifier-service' },
    { name: 'Indore', url: 'https://www.mannubhai.com/indore/water-purifier-service' },
    { name: 'Jabalpur', url: 'https://www.mannubhai.com/jabalpur/water-purifier-service' },
    { name: 'Jaipur', url: 'https://www.mannubhai.com/jaipur/water-purifier-service' },
    { name: 'Jamugurihat', url: 'https://www.mannubhai.com/jamugurihat/water-purifier-service' },
    { name: 'Jodhpur', url: 'https://www.mannubhai.com/jodhpur/water-purifier-service' },
    { name: 'Kanpur', url: 'https://www.mannubhai.com/kanpur/water-purifier-service' },
    { name: 'Kharar', url: 'https://www.mannubhai.com/Kharar/water-purifier-service' },
    { name: 'Khordha', url: 'https://www.mannubhai.com/khordha/water-purifier-service' },
    { name: 'Kokrajhar', url: 'https://www.mannubhai.com/kokrajhar/water-purifier-service' },
    { name: 'Kolar', url: 'https://www.mannubhai.com/kolar/water-purifier-service' },
    { name: 'Kota', url: 'https://www.mannubhai.com/kota/water-purifier-service' },
    { name: 'Kotputli', url: 'https://www.mannubhai.com/kotputli/water-purifier-service' },
    { name: 'Lucknow', url: 'https://www.mannubhai.com/lucknow/water-purifier-service' },
    { name: 'Ludhiana', url: 'https://www.mannubhai.com/ludhiana/water-purifier-service' },
    { name: 'Moradabad', url: 'https://www.mannubhai.com/moradabad/water-purifier-service' },
    { name: 'Nagpur', url: 'https://www.mannubhai.com/nagpur/water-purifier-service' },
    { name: 'Namsai', url: 'https://www.mannubhai.com/namsai/water-purifier-service' },
    { name: 'Nanded', url: 'https://www.mannubhai.com/nanded/water-purifier-service' },
    { name: 'Narnaul', url: 'https://www.mannubhai.com/narnaul/water-purifier-service' },
    { name: 'Nashik', url: 'https://www.mannubhai.com/nashik/water-purifier-service' },
    { name: 'Neemrana', url: 'https://www.mannubhai.com/neemrana/water-purifier-service' },
    { name: 'Noida', url: 'https://www.mannubhai.com/noida/water-purifier-service' },
    { name: 'Pali', url: 'https://www.mannubhai.com/pali/water-purifier-service' },
    { name: 'Patna', url: 'https://www.mannubhai.com/patna/water-purifier-service' },
    { name: 'Port Blair', url: 'https://www.mannubhai.com/port-blair/water-purifier-service' },
    { name: 'Prayagraj', url: 'https://www.mannubhai.com/prayagraj/water-purifier-service' },
    { name: 'Pune', url: 'https://www.mannubhai.com/pune/water-purifier-service' },
    { name: 'Raipur', url: 'https://www.mannubhai.com/raipur/water-purifier-service' },
    { name: 'Ramban', url: 'https://www.mannubhai.com/ramban/water-purifier-service' },
    { name: 'Ranchi', url: 'https://www.mannubhai.com/ranchi/water-purifier-service' },
    { name: 'Rewa', url: 'https://www.mannubhai.com/rewa/water-purifier-service' },
    { name: 'Rewari', url: 'https://www.mannubhai.com/rewari/water-purifier-service' },
    { name: 'Rohini Delhi', url: 'https://www.mannubhai.com/rohini-delhi/water-purifier-service' },
    { name: 'Rohtak', url: 'https://www.mannubhai.com/rohtak/water-purifier-service' },
    { name: 'Sagar', url: 'https://www.mannubhai.com/sagar/water-purifier-service' },
    { name: 'Salem', url: 'https://www.mannubhai.com/salem/water-purifier-service' },
    { name: 'Secunderabad', url: 'https://www.mannubhai.com/secunderabad/water-purifier-service' },
    { name: 'Shahjahanpur', url: 'https://www.mannubhai.com/shahjahanpur/water-purifier-service' },
    { name: 'Shimla', url: 'https://www.mannubhai.com/shimla/water-purifier-service' },
    { name: 'Siliguri', url: 'https://www.mannubhai.com/siliguri/water-purifier-service' },
    { name: 'Sonitpur', url: 'https://www.mannubhai.com/sonitpur/water-purifier-service' },
    { name: 'South Delhi', url: 'https://www.mannubhai.com/south-delhi/water-purifier-service' },
    { name: 'Sundergarh', url: 'https://www.mannubhai.com/sundergarh/water-purifier-service' },
    { name: 'Surat', url: 'https://www.mannubhai.com/surat/water-purifier-service' },
    { name: 'Tezpur', url: 'https://www.mannubhai.com/tezpur/water-purifier-service' },
    { name: 'Thane', url: 'https://www.mannubhai.com/thane/water-purifier-service' },
    { name: 'Tinsukia', url: 'https://www.mannubhai.com/tinsukia/water-purifier-service' },
    { name: 'Tiruvallur', url: 'https://www.mannubhai.com/tiruvallur/water-purifier-service' },
    { name: 'Tohana', url: 'https://www.mannubhai.com/tohana/water-purifier-service' },
    { name: 'Tumkur', url: 'https://www.mannubhai.com/tumkur/water-purifier-service' },
    { name: 'Udaipur', url: 'https://www.mannubhai.com/udaipur/water-purifier-service' },
    { name: 'Ujjain', url: 'https://www.mannubhai.com/ujjain/water-purifier-service' },
    { name: 'Vadodara', url: 'https://www.mannubhai.com/vadodara/water-purifier-service' },
    { name: 'Varanasi', url: 'https://www.mannubhai.com/varanasi/water-purifier-service' },
    { name: 'Vikaspuri Delhi', url: 'https://www.mannubhai.com/vikaspuri-delhi/water-purifier-service' },
    { name: 'West Delhi', url: 'https://www.mannubhai.com/west-delhi/water-purifier-service' }
  ];

  // Sort locations alphabetically
  const sortedLocations = locations.sort((a, b) => a.name.localeCompare(b.name));

  // Handle city click - redirect to the corresponding URL
  const handleCityClick = (location) => {
    window.open(location.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-gray-50 p-6 mb-0">
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
                Popular Serving Cities In India ({sortedLocations.length} Cities)
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
                  {sortedLocations.map((location, index) => (
                    <button
                      key={index}
                      onClick={() => handleCityClick(location)}
                      className={`px-3 py-2 text-sm rounded-md transition-all duration-200 border bg-gray-100 text-gray-700 border-gray-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 ${
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
      </div>
    </div>
  );
};

export default WaterPurifierLocations;