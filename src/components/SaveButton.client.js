'use client';

import { Bookmark } from 'lucide-react';
import { useState } from 'react';

export default function SaveButton() {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(!saved);
    // Add your save logic here
  };

  return (
    <button 
      onClick={handleSave}
      className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
        saved 
          ? 'bg-blue-100 border-blue-300 text-blue-700' 
          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
      }`}
    >
      <Bookmark className="w-4 h-4" fill={saved ? 'currentColor' : 'none'} />
      {saved ? 'Saved' : 'Save for later'}
    </button>
  );
}