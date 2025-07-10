"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../app/firebaseConfig";
import dynamic from "next/dynamic";
import MobileHeader from "./MobileHeader";
import DesktopHeader from "./DesktopHeader";
import LocationSearch from "./LocationSearch";
import MobileMenu from "./MobileMenu";
import LoginPopup from "./login";
import MobileBottomNavigation from "./MobileBottomNavigation";
import navigationItems from "./navigationItems";
import { useAuth } from "@/app/contexts/AuthContext";
import FloatingContactButtons from "./FloatingContactButtons";

const AddToCart = dynamic(() => import("../app/checkout/page.js"), { ssr: false });

const GOOGLE_API_KEY = "AIzaSyCFsdnyczEGJ1qOYxUvkS6blm5Fiph5u2o";

function fetchWithTimeout(url, options = {}, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      reject(new Error("Request timed out"));
    }, timeout);

    fetch(url, { ...options, signal: controller.signal })
      .then((response) => {
        clearTimeout(timeoutId);
        resolve(response);
      })
      .catch((error) => {
        clearTimeout(timeoutId);
        reject(error);
      });
  });
}

// Function to search for places with proper encoding
async function searchPlaces(query) {
  try {
    // Encode the query to handle special characters and case
    const encodedQuery = encodeURIComponent(query.trim());
    
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedQuery}&key=${GOOGLE_API_KEY}&language=en&region=IN`;
    
    console.log('Searching for:', query);
    console.log('Encoded query:', encodedQuery);
    console.log('Request URL:', url);
    
    const response = await fetchWithTimeout(url);
    const data = await response.json();
    
    console.log('API Response:', data);
    
    if (data.status === 'OK') {
      return data.results;
    } else {
      console.error('Geocoding API error:', data.status, data.error_message);
      return [];
    }
  } catch (error) {
    console.error('Error searching places:', error);
    return [];
  }
}

// Function to get location from coordinates with better handling
async function getLocationFromCoords(latitude, longitude) {
  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}&language=en&region=IN&result_type=locality|administrative_area_level_1|administrative_area_level_2`;
    
    console.log('Reverse geocoding URL:', url);
    
    const response = await fetchWithTimeout(url);
    const data = await response.json();
    
    console.log('Reverse geocoding response:', data);
    
    if (data.status === 'OK' && data.results.length > 0) {
      const result = data.results[0];
      const formattedAddress = result.formatted_address || "";
      let city = "", state = "";

      // Extract city and state from address components
      for (const component of result.address_components) {
        if (component.types.includes("locality")) {
          city = component.long_name;
        }
        if (component.types.includes("administrative_area_level_1")) {
          state = component.long_name;
        }
        // Fallback to administrative_area_level_2 if locality not found
        if (!city && component.types.includes("administrative_area_level_2")) {
          city = component.long_name;
        }
      }

      // If no city found, try to extract from formatted address
      if (!city && formattedAddress) {
        city = formattedAddress.split(",")[0].trim();
      }

      return {
        address: city || formattedAddress,
        state: state || "",
        formatted_address: formattedAddress,
        success: true
      };
    } else {
      console.error('Reverse geocoding failed:', data.status, data.error_message);
      return { success: false, error: data.status };
    }
  } catch (error) {
    console.error('Error in reverse geocoding:', error);
    return { success: false, error: error.message };
  }
}

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn, userInfo, checkLoginStatus, logout: contextLogout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentCity, setCurrentCity] = useState("")

   const [showLocationSearch, setShowLocationSearch] = useState(false);
  const [currentLocation, setCurrentLocation] = useState({
    name: "Detecting location...",
    url: ""
  });
  const [location, setLocation] = useState({
    address: "",
    state: "",
    loading: true,
    error: null,
    isCustomCity: false,
    permissionDenied: false,
  });
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const snapshot = await getDocs(collection(db, "add_to_cart"));
        setCartCount(snapshot.size);
      } catch (error) {
        console.error("Error fetching cart count:", error);
      }
    };

    fetchCartCount();
    checkLoginStatus();
  }, [checkLoginStatus]);

  const initializeLocation = useCallback(() => {
    async function run() {
      // Check for stored custom city first
      const storedCity = localStorage.getItem("selectedCity");
      if (storedCity) {
        try {
          const parsedCity = JSON.parse(storedCity);
          setLocation({
            address: parsedCity.city_name,
            state: parsedCity.state || "",
            loading: false,
            error: null,
            isCustomCity: true,
            permissionDenied: false,
          });
          return;
        } catch (error) {
          console.error('Error parsing stored city:', error);
          localStorage.removeItem("selectedCity");
        }
      }

      // Check for cached location
      const cached = localStorage.getItem("userLocation");
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          // Check if cached location is not too old (e.g., 1 hour)
          const cacheTime = parsed.timestamp || 0;
          const now = Date.now();
          const oneHour = 60 * 60 * 1000;
          
          if (now - cacheTime < oneHour) {
            setLocation({ 
              ...parsed, 
              isCustomCity: false, 
              permissionDenied: false 
            });
            return;
          } else {
            localStorage.removeItem("userLocation");
          }
        } catch (error) {
          console.error('Error parsing cached location:', error);
          localStorage.removeItem("userLocation");
        }
      }

      // Check geolocation support
      if (!navigator.geolocation) {
        setLocation({ 
          address: "", 
          state: "", 
          loading: false, 
          error: "Geolocation not supported", 
          isCustomCity: false, 
          permissionDenied: false 
        });
        return;
      }

      setLocation(prev => ({ ...prev, loading: true }));

      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            resolve,
            (error) => {
              console.error('Geolocation error:', error);
              if (error.code === error.PERMISSION_DENIED) {
                setLocation(prev => ({ 
                  ...prev, 
                  permissionDenied: true, 
                  loading: false 
                }));
                reject(new Error("Permission denied"));
              } else {
                reject(new Error(`Geolocation error: ${error.message}`));
              }
            },
            { 
              enableHighAccuracy: true, 
              timeout: 10000, 
              maximumAge: 300000 // 5 minutes
            }
          );
        });

        const { latitude, longitude } = position.coords;
        console.log('Got coordinates:', latitude, longitude);
        
        const locationData = await getLocationFromCoords(latitude, longitude);
        
        if (locationData.success) {
          const loc = {
            address: locationData.address,
            state: locationData.state,
            loading: false,
            error: null,
            isCustomCity: false,
            permissionDenied: false,
            timestamp: Date.now()
          };

          setLocation(loc);
          localStorage.setItem("userLocation", JSON.stringify(loc));
        } else {
          throw new Error(locationData.error || 'Failed to get location');
        }
      } catch (err) {
        console.error('Primary location fetch failed:', err);
        
        if (err.message === "Permission denied") {
          return; // Already handled above
        }

        // Fallback to IP-based location
        try {
          console.log('Trying IP-based location fallback...');
          const ipResponse = await fetchWithTimeout("https://ipapi.co/json/");
          const ipData = await ipResponse.json();
          
          console.log('IP location data:', ipData);
          
          setLocation({
            address: ipData.city || "",
            state: ipData.region || "",
            loading: false,
            error: null,
            isCustomCity: false,
            permissionDenied: false,
            timestamp: Date.now()
          });
        } catch (ipError) {
          console.error('IP location fallback failed:', ipError);
          setLocation({
            address: "",
            state: "",
            loading: false,
            error: "Location unavailable",
            isCustomCity: false,
            permissionDenied: false,
          });
        }
      }
    }
    
    run();
  }, []);

  useEffect(() => { 
    initializeLocation(); 
  }, [initializeLocation]);
  
  useEffect(() => { 
    const handleScroll = () => setIsScrolled(window.scrollY > 10); 
    window.addEventListener("scroll", handleScroll); 
    return () => window.removeEventListener("scroll", handleScroll); 
  }, []);
  
  useEffect(() => { 
    setIsMobileMenuOpen(false); 
  }, [pathname]);
  
  useEffect(() => { 
    document.body.style.overflow = (isMobileMenuOpen || showLocationSearch) ? "hidden" : "unset"; 
    return () => { 
      document.body.style.overflow = "unset"; 
    }; 
  }, [isMobileMenuOpen, showLocationSearch]);

  const handleCitySelection = async (city) => {
  
    if (typeof city === 'string') {
      try {
        const searchResults = await searchPlaces(city);
        if (searchResults.length > 0) {
          const result = searchResults[0];
          let cityName = "", stateName = "";
          
          // Extract city and state from the result
          for (const component of result.address_components) {
            if (component.types.includes("locality")) {
              cityName = component.long_name;
            }
            if (component.types.includes("administrative_area_level_1")) {
              stateName = component.long_name;
            }
          }
          
          if (!cityName && result.formatted_address) {
            cityName = result.formatted_address.split(",")[0].trim();
          }
          
          city = {
            city_name: cityName || city,
            state: stateName || "",
            formatted_address: result.formatted_address,
            place_id: result.place_id
          };
        } else {
          // If no results found, create a basic city object
          city = {
            city_name: city,
            state: "",
            formatted_address: city
          };
        }
      } catch (error) {
        console.error('Error searching for city:', error);
        city = {
          city_name: city,
          state: "",
          formatted_address: city
        };
      }
    }

    localStorage.setItem("selectedCity", JSON.stringify(city));
    setLocation({
      address: city.city_name,
      state: city.state || "",
      loading: false,
      error: null,
      isCustomCity: true,
      permissionDenied: false,
    });
    localStorage.removeItem("userLocation");
    setShowLocationSearch(false);
    if (city.city_url) router.push(city.city_url);
  };

  const handleLoginSuccess = () => {
    setShowLogin(false);
    checkLoginStatus();
  };

  const handleLogout = () => {
    contextLogout();
    setIsMobileMenuOpen(false);
    router.push("/");
  };

  // Function to handle manual location search (for debugging)
  const handleLocationSearch = async (searchQuery) => {
    if (!searchQuery.trim()) return [];
    
    try {
      const results = await searchPlaces(searchQuery);
      return results.map(result => ({
        city_name: result.address_components.find(comp => 
          comp.types.includes('locality')
        )?.long_name || result.formatted_address.split(',')[0],
        state: result.address_components.find(comp => 
          comp.types.includes('administrative_area_level_1')
        )?.long_name || '',
        formatted_address: result.formatted_address,
        place_id: result.place_id
      }));
    } catch (error) {
      console.error('Location search failed:', error);
      return [];
    }
  };

  const locationText = location.loading
    ? "Detecting location..."
    : location.permissionDenied
    ? "Location blocked - Tap to set"
    : location.error
    ? "Location unavailable"
    : location.address + (location.state ? `, ${location.state}` : "");

  return (
    <>
      <header className={`bg-white fixed top-0 left-0 right-0 w-full z-50 border-b border-b-gray-200 transition-all duration-300 ${isScrolled ? "shadow-md" : ""}`}>
        <div className="w-full px-0 sm:px-6 lg:px-8">
          <MobileHeader {...{ 
            cartCount, 
            locationText, 
            setShowLocationSearch, 
            location, 
            setShowLogin, 
            setIsMobileMenuOpen, 
            user: userInfo 
          }} />
          <DesktopHeader    locationText={currentLocation.name}setShowLocationSearch={setShowLocationSearch}{...{ 
            
            cartCount, 
            locationText, 
            setShowLocationSearch, 
            setShowLogin, 
            user: userInfo, 
            navigationItems, 
            pathname, 
            handleLogout, 
            location 
          }} />
        </div>
      </header>

{showLocationSearch && (
  <LocationSearch 
    onClose={() => setShowLocationSearch(false)}
    onSelectCity={(selectedCity) => {
      if (!selectedCity || !selectedCity.city_name) {
        // If no valid city selected, redirect to home
        router.push("/");
        return;
      }

      // Update current city in state and localStorage
      setCurrentCity(selectedCity.city_name);
      localStorage.setItem('currentCity', selectedCity.city_name);

      // Get current path segments
      const segments = window.location.pathname.split('/').filter(Boolean);
      
      // Generate URL-safe city slug (fallback if city_url missing)
      const citySlug = selectedCity.city_url || 
                      selectedCity.city_name.toLowerCase().replace(/\s+/g, '-');

      // Preserve service if on service page, otherwise go to city page
      if (segments.length === 2 && segments[0] !== 'undefined') {
        router.push(`/${citySlug}/${segments[1]}`);
      } else {
        router.push(`/${citySlug}`);
      }
    }}
    currentCity={currentCity}
  />
)}
      <MobileMenu {...{ 
        isMobileMenuOpen, 
        setIsMobileMenuOpen, 
        user: userInfo, 
        setShowLogin, 
        navigationItems, 
        locationText, 
        setShowLocationSearch, 
        handleLogout 
      }} />
      <MobileBottomNavigation {...{ navigationItems, pathname }} />
      <LoginPopup 
        show={showLogin} 
        onClose={() => setShowLogin(false)} 
        onLoginSuccess={handleLoginSuccess} 
      />
<FloatingContactButtons />
      <style jsx global>{`
        body { padding-top: 75px; padding-bottom: 80px; }
        @media (min-width: 1024px) {
          body { padding-top: 80px; padding-bottom: 0; }
        }
        .safe-area-pb { padding-bottom: env(safe-area-inset-bottom); }
      `}</style>
    </>
  );
};

export default Header;