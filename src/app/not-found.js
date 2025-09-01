"use client";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="text-center max-w-2xl mx-auto">
        {/* Robot Illustration */}
        <div className="mb-8">
          <img 
            src="/404.jpg" 
            alt="404 Robot Error" 
            className="w-full max-w-md mx-auto"
          />
        </div>
        
        {/* Title */}
        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => window.location.href = '/'}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-full transition-colors duration-300 flex items-center justify-center gap-2 shadow-lg"
          >
            🏠 Go Home
          </button>
          
          <button 
            onClick={() => window.history.back()}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-8 rounded-full border-2 border-gray-300 transition-colors duration-300 flex items-center justify-center gap-2"
          >
            ← Go Back
          </button>
        </div>
        
     
      </div>
    </main>
  );
}