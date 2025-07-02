"use client";
import React, { useState } from 'react';
import {
  FaPhone,
  FaShoppingCart,
  FaFileAlt,
  FaEnvelope,
  FaClock,
  FaQuestionCircle,
  FaChevronRight,
} from 'react-icons/fa';

const Others = () => {
  const [hoveredItem, setHoveredItem] = useState(null);

  const menuItems = [
    {
      id: 'customer-care',
      icon: <FaPhone size={20} />,
      title: 'Customer Care',
      subtitle: '+91 1234567890',
      description: '24/7 Customer Service',
    },
    {
      id: 'purchasing',
      icon: <FaShoppingCart size={20} />,
      title: 'Purchasing',
      subtitle: 'Resolve issues with orders',
      description: 'Promo codes, gift cards, booking services',
    },
    {
      id: 'user-guides',
      icon: <FaFileAlt size={20} />,
      title: 'User Guides',
      subtitle: 'Find complete instructions',
      description: 'Manuals and documentation',
    },
    {
      id: 'contact-us',
      icon: <FaEnvelope size={20} />,
      title: 'Contact Us',
      subtitle: 'Get in touch with our team',
      description: 'Email, chat, or feedback form',
    },
    {
      id: 'operating-hours',
      icon: <FaClock size={20} />,
      title: 'Operating Hours',
      subtitle: 'When you can reach us',
      description: 'Business hours and availability',
    },
  ];

  return (
    <div className="max-w-lg mx-auto mt-20 p-6 border rounded-xl shadow-md bg-white mt-30 mb-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Support Center</h2>
        <div className="flex items-center space-x-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium cursor-pointer">
          <FaQuestionCircle size={14} />
          <span>Help</span>
        </div>
      </div>

      <div className="space-y-4">
        {menuItems.map((item) => (
          <div
            key={item.id}
            onMouseEnter={() => setHoveredItem(item.id)}
            onMouseLeave={() => setHoveredItem(null)}
            className={`flex items-center justify-between p-4 rounded-xl border hover:shadow-md transition ${
              hoveredItem === item.id ? 'bg-gray-50' : 'bg-white'
            }`}
          >
            <div className="flex items-start space-x-4">
              <div className="p-2 rounded-full bg-gray-100 text-gray-600">{item.icon}</div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-700">{item.subtitle}</p>
                <p className="text-xs text-gray-500">{item.description}</p>
              </div>
            </div>
            <FaChevronRight className="text-gray-400" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Others;
