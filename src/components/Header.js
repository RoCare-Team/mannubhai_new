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
const GOOGLE_API_KEY = "AIzaSyCFsdnyczEGJ1qOYxUvkS6blm5Fiph5u2o";

async function fetchWithTimeout(url, options = {}, timeout = 5000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
    throw new Error("Request timed out");
  }, timeout);

  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timeoutId);
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

    return data.status === 'OK' ? data.results : [];
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

    if (data.status === 'OK' && data.results.length > 0) {
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
    }
    return { success: false, error: data.status };
  } catch (error) {
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
  });



   const matchAndRedirect = useCallback(async (detectedCity) => {
    try {
      // Find matching city in your database
      const matchedCity = await findExactMatch(detectedCity);
      
      if (matchedCity) {
        // Update location state
        setLocation({
          city: matchedCity.city_name,
          loading: false,
          error: null
        });
        
        // Redirect to city page
        const cityUrl = matchedCity.city_url || 
                       matchedCity.city_name.toLowerCase().replace(/\s+/g, '-');
        router.push(`/${cityUrl}`);
      } else {
        // No match found - show location selector
        setLocation({
          city: detectedCity,
          loading: false,
          error: "City not found in our service area"
        });
      }
    } catch (error) {
      setLocation({
        city: "",
        loading: false,
        error: "Error matching location"
      });
    }
  }, [router]);


   useEffect(() => {
    const initializeLocation = async () => {
      // Your existing location detection logic...
      const detectedCity = "Delhi"; // Example - replace with actual detected city
      
      // Match and redirect
      await matchAndRedirect(detectedCity);
    };

    initializeLocation();
  }, [matchAndRedirect]);
  // Fetch cart count and check login status
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




  // Initialize location
  const initializeLocation = useCallback(async () => {
    try {
      setLocation(prev => ({ ...prev, loading: true }));

      // Try geolocation first
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          (error) => {
            if (error.code === error.PERMISSION_DENIED) {
              setLocation(prev => ({
                ...prev,
                loading: false,
                permissionDenied: true
              }));
            }
            reject(error);
          },
          { timeout: 10000, maximumAge: 300000 }
        );
      });

      const { latitude, longitude } = position.coords;
      const locationData = await getLocationFromCoords(latitude, longitude);
      
      if (locationData.success) {
        setLocation({
          city: locationData.address,
          state: locationData.state,
          loading: false,
          error: null,
          permissionDenied: false,
        });
      } else {
        throw new Error(locationData.error || 'Failed to get location');
      }
    } catch (error) {
      console.error('Location fetch failed:', error);
      
      // Fallback to IP-based location
      try {
        const ipResponse = await fetch("https://ipapi.co/json/");
        const ipData = await ipResponse.json();
        
        setLocation({
          city: ipData.city || "",
          state: ipData.region || "",
          loading: false,
          error: null,
          permissionDenied: false,
        });
      } catch (ipError) {
        console.error('IP location fallback failed:', ipError);
        setLocation({
          city: "",
          state: "",
          loading: false,
          error: "Location unavailable",
          permissionDenied: false,
        });
      }
    }
  }, []);

  useEffect(() => { 
    initializeLocation(); 
  }, [initializeLocation]);

  // Handle scroll effect
  useEffect(() => { 
    const handleScroll = () => setIsScrolled(window.scrollY > 10); 
    window.addEventListener("scroll", handleScroll); 
    return () => window.removeEventListener("scroll", handleScroll); 
  }, []);

  // Close mobile menu on route change
  useEffect(() => { 
    setIsMobileMenuOpen(false); 
  }, [pathname]);

  // Handle body overflow
  useEffect(() => { 
    document.body.style.overflow = (isMobileMenuOpen || showLocationSearch) ? "hidden" : "unset"; 
    return () => { document.body.style.overflow = "unset" }; 
  }, [isMobileMenuOpen, showLocationSearch]);

  // Handle city selection
  const handleCitySelection = useCallback((selectedCity) => {
    if (!selectedCity?.city_name) {
      router.push("/");
      return;
    }

    setLocation({
      city: selectedCity.city_name,
      state: selectedCity.state || "",
      loading: false,
      error: null,
      permissionDenied: false,
    });

    const citySlug = selectedCity.city_url || 
                   selectedCity.city_name.toLowerCase().replace(/\s+/g, '-');
    router.push(`/${citySlug}`);
    setShowLocationSearch(false);
  }, [router]);

  const handleLoginSuccess = () => {
    setShowLogin(false);
    checkLoginStatus();
  };

  const handleLogout = () => {
    contextLogout();
    setIsMobileMenuOpen(false);
    router.push("/");
  };

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
          body { padding-top: 50px; padding-bottom: 0; }
        }
      `}</style>
    </>
  );
};

export default Header;