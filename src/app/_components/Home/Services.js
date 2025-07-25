"use client";
import React, { useState, useCallback } from "react";

const SERVICES_DATA = [
  {
    title: "Home Appliances",
    anchor: "appliance",
    paragraphs: [
      "Home appliances are the need of every household. It is an electrical device which makes our life more comfortable and smoother. Home appliances play a significant role in our life since man start using tools. Today we are living in a technologically advanced era as a result of this today we have sophisticated home appliances which have made our life simpler. These days we depend on home appliances from drinking healthy and pure water to the washing of clothes. Home appliances are an essential device which is used in a various activity like cooking, cleaning, exercise, purifying, food preservation, and many others.Most of the home appliances are electrical equipment that needs regular repair and maintenance services. Here at Mannu Bhai, we provide all kinds of home appliance repair services such as water purifiers service, ac repair service, washing machines, kitchen chimney, LED, refrigerator, and many other, repairing and maintenance services. We have a team of expert professionals and service providers, and all of them are dedicated to provides the best and satisfactory services at your doorstep.We are equipped with expert and well-trained professionals who help you with call kinds of service related to the above-listed categories. We are a one-stop service provider here. You can book installation, repair, and maintenance services at your doorstep at best and nominal prices. You can book your services by calling our customer care number. Our customer care executives are friendly and dedicate to help you with all kinds of services related to the above-listed category.",
    ],
  },
  {
    title: "Home Care",
    anchor: "homecare",
    paragraphs: [
      "With the increasing trends in fashion, the home care industry experiences changes that reflected the shift in the value of each generation. According to the statistical data these days, a large number of aged people are planning to stay at home, which has increased the challenge for the home industries. But the home care industries like Mannu Bhai have stepped up to take the challenge and provides more opportunities for care and assistance at home than ever before. Here we offer a service like sofa cleaning, bathroom cleaning, and Kitchen cleaning. Along with these services at Mannu Bhai, people can hire a plumber, electrician, painter, carpenter, and other home care service providers.In recent years, Mannu Bhai has expanded its service, and now its home care services are available in the entire country. Thus people can book Mannu Bhai home care services irrespective of the city in which they live. Here we cover a large number of services, therefore hiring Mannu Bhai can be the best option. At Mannu Bhai, all the service providers are experts and experienced in what they do.",
    ],
  },
  {
    title: "Beauty Care",
    anchor: "beauty",
    paragraphs: [
      "Excellent personal care is essential for both health and social reason. It includes keeping your hand, head, and body clean to stop the spread of germs and illness. Having good personal hygiene benefits your health. Children and old age people are not able to take care of their hygiene. Thus you need to hire a professional for this as we know it is our hygiene, which keeps us safe from various kinds of disease-causing bacteria and viruses.Here at Mannu Bhai, we are providing various kinds of personal-care help. Our care services include Pedicure & Manicure, the saloon at home, Massage, Dietician, Makeup, and others. While hiring personal care professional, you should ensure that your personal care service provider reliable or not. Our team and we at Mannu Bhai are much concerned about you and your loved one health. Thus hiring personal care professionals at Mannu Bhai can be a great deal. One more advantage we offer is that our services are available across the whole nation at the best and economical price.",
    ],
  },
  {
    title: "Handyman Services",
    anchor: "handyman",
    paragraphs: [
      "Looking for handyman services at your doorstep? We are a trusted and leading platform offering the best handyman services across PAN India. Whether you need help with plumbing, electrical repairs, carpentry, painting, or general home repair services, we connect you with verified and skilled professionals who deliver high-quality, timely, and reliable service. Our mission is to make home maintenance easy and stress-free with on-demand handyman services near you.With a strong network of experienced experts, we ensure every job is completed with precision and customer satisfaction. We take pride in offering transparent pricing, quick response times, and professional assistance for all your household needs. From minor fixes to major repairs, we are your go-to destination for all types of handyman services in India.",
    ],
  },
];

const MAX_PREVIEW_LENGTH = 300;

export default function Services() {
  const [expanded, setExpanded] = useState({});

  const toggleExpand = useCallback((title) => {
    setExpanded((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  }, []);

  return (
    <main className="py-8 px-4 sm:px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-xl sm:text-3xl font-bold text-center text-gray-800 mb-8">
          Get Professional Services at Home with{" "}
          <span className="text-blue-600">MannuBhai</span>
        </h2>

        <div className="grid gap-4">
          {SERVICES_DATA.map(({ title, paragraphs, anchor }) => (
            <article
              key={title}
              id={anchor}
              className="bg-white rounded-2xl p-5 sm:p-8 shadow-md hover:shadow-lg transition-shadow"
            >
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">
                {title}
              </h3>

              {paragraphs.map((text, idx) => {
                const isExpanded = expanded[title];
                const needsTruncation = text.length > MAX_PREVIEW_LENGTH;
                const previewText = needsTruncation
                  ? `${text.slice(0, MAX_PREVIEW_LENGTH)}...`
                  : text;

                return (
                  <div key={idx}>
                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-2">
                      {isExpanded ? text : previewText}
                    </p>
                    {needsTruncation && (
                      <button
                        onClick={() => toggleExpand(title)}
                        className="text-blue-600 text-sm font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                        aria-expanded={isExpanded}
                      >
                        {isExpanded ? "Read less ▲" : "Read more ▼"}
                      </button>
                    )}
                  </div>
                );
              })}
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}