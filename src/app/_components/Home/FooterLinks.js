"use client";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../app/firebaseConfig";
import { HiChevronDown, HiChevronUp } from "react-icons/hi";

const FooterLinks = () => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    const fetchLinks = async () => {
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
      } finally {
        setLoading(false);
      }
    };

    fetchLinks();
  }, []);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const accordions = [

    {
      title: "Popular Serving Cities In India",
      content: loading ? (
        <p className="text-gray-500">Loading cities…</p>
      ) : (
        <div className="flex flex-wrap gap-2 mt-2">
          {cities.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm px-3 py-1 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-800 transition"
            >
              {link.name}
            </a>
          ))}
        </div>
      ),
    },
  ];

  return (
   <section className="bg-white py-10 px-8 sm:px-12 lg:px-20 xl:px-32 border-t border-gray-200">
  <div className="max-w-6xl mx-auto">
    <h2 className="text-2xl font-bold mb-6 text-gray-900">Quick Links</h2>

    <div className="space-y-4">
      {accordions.map((item, i) => (
        <div key={i} className="border-b border-gray-300 pb-3">
          <button
            onClick={() => toggleAccordion(i)}
            className="flex justify-between w-full text-left items-center text-lg font-medium text-gray-800 hover:text-blue-600 transition"
          >
            {item.title}
            {openIndex === i ? (
              <HiChevronUp className="w-5 h-5" />
            ) : (
              <HiChevronDown className="w-5 h-5" />
            )}
          </button>
          {openIndex === i && <div className="mt-3">{item.content}</div>}
        </div>
      ))}
    </div>
  </div>
</section>

  );
};

export default FooterLinks;