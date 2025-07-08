// components/FAQItem.jsx
"use client";

import { useState } from 'react';

export default function FAQItem({ question, answer, index }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="group bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      {/* Question Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
      >
        <h3 className="font-semibold text-lg text-gray-800 pr-4">
          {question}
        </h3>
        <div className="flex-shrink-0">
          <svg
            className={`w-5 h-5 text-gray-400 group-hover:text-blue-600 transform transition-all duration-200 ${
              isOpen ? 'rotate-180' : 'rotate-0'
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Answer Content */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 pb-5 border-t border-gray-100">
          <p className="text-gray-600 leading-relaxed pt-4">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}