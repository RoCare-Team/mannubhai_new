"use client";
import { useEffect, useState, useCallback } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../app/firebaseConfig";
import { HiChevronDown, HiChevronUp } from "react-icons/hi";

const FooterLinks = () => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState(null);

  // Memoize the fetch function
  const fetchLinks = useCallback(async () => {
    try {
      const snap = await getDocs(collection(db, "footer_url"));
      const data = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      data.sort((a, b) => a.name.localeCompare(b.name));
      setCities(data);
    } catch (error) {
      console.error("Error fetching data", error);
      // Consider adding error state for UI feedback
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  // Memoize the toggle function
  const toggleAccordion = useCallback((index) => {
    setOpenIndex(prev => prev === index ? null : index);
  }, []);

  // Memoize the accordion content to prevent unnecessary re-renders
  const accordions = [
    {
      title: "Popular Serving Cities In India",
      content: loading ? (
        <p className="text-gray-500">Loading cities...</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 mt-2">
          {cities.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm px-3 py-1 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-800 transition-colors duration-200"
              aria-label={`Link to ${link.name}`}
            >
              {link.name}
            </a>
          ))}
        </div>
      ),
    },
  ];

  return (
    <section className="bg-white py-8 sm:py-10 px-4 sm:px-6 lg:px-8 xl:px-10 border-t border-gray-200">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-900">Quick Links</h2>

          {accordions.map((item, i) => (
            <div key={i} className="border-b border-gray-200 pb-2 sm:pb-3">
              <button
                onClick={() => toggleAccordion(i)}
                className="flex justify-between w-full text-left items-center text-base sm:text-lg font-medium text-gray-800 hover:text-blue-600 transition-colors duration-200"
                aria-expanded={openIndex === i}
                aria-controls={`accordion-content-${i}`}
              >
                {item.title}
                {openIndex === i ? (
                  <HiChevronUp className="w-5 h-5" />
                ) : (
                  <HiChevronDown className="w-5 h-5" />
                )}
              </button>
              {openIndex === i && (
                <div id={`accordion-content-${i}`} className="mt-2 sm:mt-3">
                  {item.content}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FooterLinks;