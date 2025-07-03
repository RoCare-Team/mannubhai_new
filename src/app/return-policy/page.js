"use client";
import React from "react";
import Dropdown from "@/components/Dropdown";

const RefundPolicy = () => {
  const countries = [
    { code: "IND", name: "India", flag: "/flags/In-flag.jpeg" },
    { code: "UAE", name: "United Arab Emirates", flag: "/flags/UAE-flag.jpeg" },
    { code: "SGP", name: "Singapore", flag: "/flags/Singapore-flag.jpeg" },
    { code: "KSA", name: "Saudi Arabia", flag: "/flags/KSA-flag.jpeg" },
  ];

  return (
    <section className="bg-white px-4 py-8">
      <div className="max-w-4xl mx-auto text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">MB RETURN & REFUND POLICY</h1>
        <Dropdown countries={countries} />
      </div>

      <div className="max-w-4xl mx-auto text-left text-gray-700 space-y-6 leading-relaxed">
        <div>
          <h3 className="text-2xl font-semibold mb-3">MannuBhai Return Policy</h3>
          <p>
            Most items purchased from MannuBhai are returnable except those that are explicitly
            identified as not returnable.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-3">General Return Policy</h3>
          <ol className="list-decimal list-inside space-y-3">
            <li>
              Products purchased at MannuBhai are returnable only when the item you have received
              at your doorstep is in a physically damaged condition, has missing accessories,
              defective, or different from their description on the product detail page at MannuBhai.
            </li>
            <li>
              If you report an issue with your purchased item, we may schedule a service engineer
              visit at your doorstep for inspection.
            </li>
            <li>
              The return will be processed only when:
              <ol className="list-disc list-inside ml-6 mt-2 space-y-1">
                <li>It is determined that the product did not get damaged while in your processing.</li>
                <li>The product is not different from what was shipped to you.</li>
                <li>
                  The product should be in original condition (should have brand/manufacturers box,
                  MRP tag, user manual, all accessories, and warranty card).
                </li>
              </ol>
            </li>
            <li>
              Product marked as non-returnable on the product detail page cannot be returned.
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
};

export default RefundPolicy;
