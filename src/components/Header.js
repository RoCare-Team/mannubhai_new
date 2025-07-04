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

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLocationSearch, setShowLocationSearch] = useState(false);
  const [location, setLocation] = useState({
    address: "",
    state: "",
    loading: true,
    error: null,
    isCustomCity: false,
    permissionDenied: false,
  });
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState(null);
  const dropdownTimeoutRef = useRef(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const userPhone = localStorage.getItem("userPhone");

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser({
          ...parsedUser,
          name: parsedUser.name || parsedUser.user_name || "Customer",
          mobile: userPhone || parsedUser.mobile,
        });
      } catch (e) {
        console.error("Error parsing user data:", e);
        localStorage.removeItem("user");
      }
    }

    const fetchCartCount = async () => {
      try {
        const snapshot = await getDocs(collection(db, "add_to_cart"));
        console.log("🛒 Firestore cart data:", snapshot.docs.map(doc => doc.data()));
        setCartCount(snapshot.size);
      } catch (error) {
        console.error("❌ Firestore error fetching add_to_cart:", error.message);
      }
    };

    fetchCartCount();
  }, []);

  const initializeLocation = useCallback(() => {
    async function run() {
      console.log("📍 Initializing location...");

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
          console.log("✅ Loaded custom city:", parsedCity);
          return;
        } catch {
          localStorage.removeItem("selectedCity");
        }
      }

      const cached = localStorage.getItem("userLocation");
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          setLocation({ ...parsed, isCustomCity: false, permissionDenied: false });
          console.log("✅ Loaded cached location:", parsed);
          return;
        } catch {
          localStorage.removeItem("userLocation");
        }
      }

      if (!navigator.geolocation) {
        setLocation({ address: "", state: "", loading: false, error: "Geolocation not supported", isCustomCity: false, permissionDenied: false });
        return;
      }

      setLocation((prev) => ({ ...prev, loading: true }));

      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            resolve,
            (error) => {
              if (error.code === error.PERMISSION_DENIED) {
                setLocation((prev) => ({ ...prev, permissionDenied: true, loading: false }));
                reject(new Error("Permission denied"));
              } else {
                reject(new Error("Geolocation error"));
              }
            },
            { enableHighAccuracy: true, timeout: 8000, maximumAge: 600000 }
          );
        });

        const { latitude, longitude } = position.coords;
        const res = await fetchWithTimeout(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}`);

        const data = await res.json();
        const result = data.results?.[0];
        const formattedAddress = result?.formatted_address || "";
        let city = "", state = "";

        for (const component of result.address_components) {
          if (component.types.includes("locality")) city = component.long_name;
          if (component.types.includes("administrative_area_level_1")) state = component.long_name;
        }

        if (!city && formattedAddress) city = formattedAddress.split(",")[0].trim();

        const loc = {
          address: city || formattedAddress,
          state,
          loading: false,
          error: null,
          isCustomCity: false,
          permissionDenied: false,
        };

        setLocation(loc);
        localStorage.setItem("userLocation", JSON.stringify(loc));
      } catch (err) {
        console.error("⚠️ Location error fallback:", err.message);

        if (err.message === "Permission denied") return;

        try {
          const ipRes = await fetchWithTimeout("https://ipapi.co/json/");
          const ipData = await ipRes.json();
          setLocation({
            address: ipData.city || "",
            state: ipData.region || "",
            loading: false,
            error: null,
            isCustomCity: false,
            permissionDenied: false,
          });
        } catch (ipError) {
          console.error("❌ IP fallback failed:", ipError);
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

  useEffect(() => { initializeLocation(); }, [initializeLocation]);
  useEffect(() => { const handleScroll = () => setIsScrolled(window.scrollY > 10); window.addEventListener("scroll", handleScroll); return () => window.removeEventListener("scroll", handleScroll); }, []);
  useEffect(() => { setIsMobileMenuOpen(false); }, [pathname]);
  useEffect(() => { document.body.style.overflow = (isMobileMenuOpen || showLocationSearch) ? "hidden" : "unset"; return () => { document.body.style.overflow = "unset"; }; }, [isMobileMenuOpen, showLocationSearch]);

  const handleCitySelection = (city) => {
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

  const handleLoginSuccess = (userData) => {
    const storedUser = {
      id: userData.id,
      mobile: userData.mobile,
      name: userData.name || "Customer",
      email: userData.email || "",
    };
    setUser(storedUser);
    localStorage.setItem("user", JSON.stringify(storedUser));
    setShowLogin(false);
  };

  const handleLogout = () => {
  setUser(null);
  ["user", "userPhone", "userToken", "userName", "userEmail", "customer_id"].forEach(k => localStorage.removeItem(k));
  setIsMobileMenuOpen(false);
  router.push("/"); // Add this line to redirect to home page
}


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
          <MobileHeader {...{ cartCount, locationText, setShowLocationSearch, location, setShowLogin, setIsMobileMenuOpen, user }} />
          <DesktopHeader {...{ cartCount, locationText, setShowLocationSearch, setShowLogin, user, navigationItems, pathname, handleLogout, location }} />
        </div>
      </header>

      {showLocationSearch && <LocationSearch onClose={() => setShowLocationSearch(false)} onSelectCity={handleCitySelection} />}
      <MobileMenu {...{ isMobileMenuOpen, setIsMobileMenuOpen, user, setShowLogin, navigationItems, locationText, setShowLocationSearch, handleLogout}} />
      <MobileBottomNavigation {...{ navigationItems, pathname }} />
      <LoginPopup show={showLogin} onClose={() => setShowLogin(false)} onLoginSuccess={handleLoginSuccess} />

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
