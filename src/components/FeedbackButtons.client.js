'use client';

import { useState } from 'react';

export default function FeedbackButtons() {
  const [feedback, setFeedback] = useState(null);

  const handleFeedback = (type) => {
    setFeedback(type);
    // Add your feedback submission logic here
  };

  return (
    <div className="flex items-center space-x-4">
      <span className="text-sm text-gray-600">Was this article helpful?</span>
      <div className="flex space-x-2">
        <button 
          onClick={() => handleFeedback('like')}
          className={`p-2 transition-colors ${
            feedback === 'like' ? 'text-green-500' : 'text-gray-400 hover:text-green-500'
          }`}
        >
          👍
        </button>
        <button 
          onClick={() => handleFeedback('dislike')}
          className={`p-2 transition-colors ${
            feedback === 'dislike' ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
          }`}
        >
          👎
        </button>
      </div>
    </div>
  );
}