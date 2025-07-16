"use client";
import { useState, useEffect, useCallback } from "react";
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
import { findExactMatch } from "@/app/utils/locationUtils";

const AddToCart = dynamic(() => import("../app/checkout/page.js"), { ssr: false });

const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || "AIzaSyCFsdnyczEGJ1qOYxUvkS6blm5Fiph5u2o";

async function fetchWithTimeout(url, options = {}, timeout = 5000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, { 
      ...options, 
      signal: controller.signal 
    });
    clearTimeout(timeoutId);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

async function searchPlaces(query) {
  try {
    const encodedQuery = encodeURIComponent(query.trim());
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedQuery}&key=${GOOGLE_API_KEY}&language=en&region=IN`;
    const response = await fetchWithTimeout(url);
    const data = await response.json();

    if (data.status !== 'OK') {
      console.warn('Google Maps API returned status:', data.status);
      return [];
    }
    return data.results;
  } catch (error) {
    console.error('Error searching places:', error);
    return [];
  }
}

async function getLocationFromCoords(latitude, longitude) {
  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}&language=en&region=IN&result_type=locality|administrative_area_level_1|administrative_area_level_2`;
    const response = await fetchWithTimeout(url);
    const data = await response.json();

    if (data.status !== 'OK' || data.results.length === 0) {
      return { success: false, error: data.status || 'No results' };
    }

    const result = data.results[0];
    let city = "", state = "";

    for (const component of result.address_components) {
      if (component.types.includes("locality")) {
        city = component.long_name;
      } else if (component.types.includes("administrative_area_level_1")) {
        state = component.long_name;
      } else if (!city && component.types.includes("administrative_area_level_2")) {
        city = component.long_name;
      }
    }

    if (!city && result.formatted_address) {
      city = result.formatted_address.split(",")[0].trim();
    }

    return {
      address: city || result.formatted_address,
      state: state || "",
      success: true
    };
  } catch (error) {
    console.error('Error getting location from coordinates:', error);
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
  const [showLocationSearch, setShowLocationSearch] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [location, setLocation] = useState({
    city: "",
    state: "",
    loading: true,
    error: null,
    permissionDenied: false,
    isManualSelection: false,
  });

  const persistLocation = useCallback((locationData) => {
    try {
      localStorage.setItem('userLocation', JSON.stringify(locationData));
    } catch (error) {
      console.error('Error persisting location:', error);
    }
  }, []);

  const getPersistedLocation = useCallback(() => {
    try {
      const saved = localStorage.getItem('userLocation');
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error('Error getting persisted location:', error);
      return null;
    }
  }, []);

const matchAndRedirect = useCallback(async (detectedCity) => {
  if (!detectedCity) {
    router.push("/");
    return;
  }

  try {
    const persistedLocation = getPersistedLocation();
    if (persistedLocation?.isManualSelection) {
      setLocation(persistedLocation);
      return;
    }

    const matchedCity = await findExactMatch(detectedCity);
    
    if (matchedCity) {
      const newLocation = {
        city: matchedCity.city_name,
        state: matchedCity.state || "",
        loading: false,
        error: null,
        permissionDenied: false,
        isManualSelection: false,
      };
      
      setLocation(newLocation);
      persistLocation(newLocation);
      
      const cityUrl = matchedCity.city_url || 
                     matchedCity.city_name.toLowerCase().replace(/\s+/g, '-');
      
      const currentPath = pathname.split('/')[1];
      if (currentPath !== cityUrl) {
        router.push(`/${cityUrl}`);
      }
    } else {
      // City not found - set state and redirect to home
      setLocation({
        city: "",
        state: "",
        loading: false,
        error: "City not found in our service area",
        permissionDenied: false,
        isManualSelection: false,
      });
      
      // Clear any persisted location
      localStorage.removeItem('userLocation');
      
      // Redirect to home route
      router.push("/");
    }
  } catch (error) {
    console.error("Error in matchAndRedirect:", error);
    setLocation({
      city: "",
      state: "",
      loading: false,
      error: "Error matching location",
      permissionDenied: false,
      isManualSelection: false,
    });
    
    // Redirect to home on error
    router.push("/");
  }
}, [router, pathname, persistLocation, getPersistedLocation]);



 const initializeLocation = useCallback(async () => {
  const persistedLocation = getPersistedLocation();
  if (persistedLocation) {
    setLocation(persistedLocation);
    return;
  }

  try {
    setLocation(prev => ({ ...prev, loading: true, error: null }));

    // Try geolocation first
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          { timeout: 10000, maximumAge: 300000 }
        );
      });

      const { latitude, longitude } = position.coords;
      const locationData = await getLocationFromCoords(latitude, longitude);
      
      if (locationData.success) {
        await matchAndRedirect(locationData.address);
        return;
      }
    } catch (geoError) {
      console.warn('Geolocation failed:', geoError);
      if (geoError.code === geoError.PERMISSION_DENIED) {
        setLocation(prev => ({
          ...prev,
          loading: false,
          permissionDenied: true
        }));
      }
    }

    // Fallback to IP-based location
    try {
      const ipResponse = await fetchWithTimeout("https://ipapi.co/json/");
      const ipData = await ipResponse.json();
      
      if (ipData.city) {
        await matchAndRedirect(ipData.city);
      } else {
        throw new Error("IP location data incomplete");
      }
    } catch (ipError) {
      console.error('IP location fallback failed:', ipError);
      // If all location methods fail, redirect to home
      await matchAndRedirect(null);
    }
  } catch (error) {
    console.error('Location initialization failed:', error);
    await matchAndRedirect(null);
  }
}, [matchAndRedirect, getPersistedLocation]);

const handleCitySelection = useCallback(async (selectedCity) => {
  if (!selectedCity?.city_name) {
    router.push("/");
    return;
  }

  // Normalize city name for Gurgaon/Gurugram case
  const normalizedCity = selectedCity.city_name.toLowerCase();
  const isGurgaonVariant = ['gurgaon', 'gurugram'].includes(normalizedCity);

  // Get the canonical city data (Gurgaon for Gurgaon/Gurugram variants)
  const cityData = isGurgaonVariant 
    ? await findExactMatch('Gurgaon')
    : await findExactMatch(selectedCity.city_name);

  if (!cityData) {
    setLocation({
      city: "",
      state: "",
      loading: false,
      error: "City not in service area",
      permissionDenied: false,
      isManualSelection: false,
    });
    router.push("/");
    return;
  }

  const newLocation = {
    city: cityData.city_name, // This will be "Gurgaon" for Gurugram variants
    state: cityData.state || "",
    loading: false,
    error: null,
    permissionDenied: false,
    isManualSelection: true,
  };

  setLocation(newLocation);
  persistLocation(newLocation);

  const cityUrl = cityData.city_url || 
                 cityData.city_name.toLowerCase().replace(/\s+/g, '-');
  router.push(`/${cityUrl}`);
  setShowLocationSearch(false);
}, [router, persistLocation]);

  const handleLoginSuccess = useCallback(() => {
    setShowLogin(false);
    checkLoginStatus();
  }, [checkLoginStatus]);

  const handleLogout = useCallback(() => {
    contextLogout();
    setIsMobileMenuOpen(false);
    router.push("/");
  }, [contextLogout, router]);

  useEffect(() => { 
    initializeLocation(); 
  }, [initializeLocation]);

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

  useEffect(() => { 
    const handleScroll = () => setIsScrolled(window.scrollY > 10); 
    window.addEventListener("scroll", handleScroll); 
    return () => window.removeEventListener("scroll", handleScroll); 
  }, []);

  useEffect(() => { 
    setIsMobileMenuOpen(false); 
  }, [pathname]);

  useEffect(() => { 
    const body = document.body;
    const originalOverflow = body.style.overflow;
    body.style.overflow = (isMobileMenuOpen || showLocationSearch) ? "hidden" : originalOverflow;
    return () => { body.style.overflow = originalOverflow }; 
  }, [isMobileMenuOpen, showLocationSearch]);

  const locationText = location.loading
    ? "Detecting location..."
    : location.permissionDenied
      ? "Location blocked - Tap to set"
      : location.error
        ? "Location unavailable"
        : `${location.city}${location.state ? `, ${location.state}` : ''}`;

  return (
    <>
      <header className={`bg-white fixed top-0 left-0 right-0 w-full z-50 border-b border-b-gray-200 transition-all duration-300 ${isScrolled ? "shadow-md" : ""}`}>
        <div className="w-full px-0 sm:px-6 lg:px-8">
          <MobileHeader {...{ 
            cartCount, 
            locationText, 
            onLocationClick: () => setShowLocationSearch(true),
            setShowLogin, 
            setIsMobileMenuOpen, 
            user: userInfo 
          }} />
          <DesktopHeader {...{ 
            cartCount, 
            locationText, 
            onLocationClick: () => setShowLocationSearch(true),
            setShowLogin, 
            user: userInfo, 
            navigationItems, 
            pathname, 
            handleLogout 
          }} />
        </div>
      </header>

      {showLocationSearch && (
        <LocationSearch 
          onClose={() => setShowLocationSearch(false)}
          onSelectCity={handleCitySelection}
          currentCity={location.city}
        />
      )}

      <MobileMenu {...{ 
        isMobileMenuOpen, 
        setIsMobileMenuOpen, 
        user: userInfo, 
        setShowLogin, 
        navigationItems, 
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
        @media (min-width: 1024px) {
          body { 
            padding-top: 50px; 
            padding-bottom: 0; 
          }
        }
      `}</style>
    </>
  );
};

export default Header;