"use client";

export default function PageGone() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="text-center max-w-2xl mx-auto">
        {/* Illustration */}
        <div className="mb-8">
          <img 
            src="/404.jpg" 
            alt="410 Gone" 
            className="w-full max-w-md mx-auto"
          />
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Page Not Found
        </h1>

        {/* Message */}
        <p className="text-gray-600 mb-8">
          The content you're looking for has been permanently removed or is no longer active.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => window.location.href = '/'}
            className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-8 rounded-full transition-colors duration-300 shadow-lg"
          >
            🏠 Go Home
          </button>

          <button 
            onClick={() => window.history.back()}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-8 rounded-full border-2 border-gray-300 transition-colors duration-300"
          >
            ← Go Back
          </button>
        </div>
      </div>
    </main>
  );
}
