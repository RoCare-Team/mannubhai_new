import { FaApple, FaGooglePlay } from 'react-icons/fa';

const MobileAppDownload = () => {
  return (
    <div className="w-full flex justify-center px-4 sm:px-8 lg:px-12 xl:px-16 py-8">
      <div className="max-w-7xl w-full bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 py-8 px-6 lg:px-10 xl:px-12 rounded-2xl overflow-hidden shadow-2xl">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-center">
            {/* Main Content */}
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 leading-tight">
                Download MannuBhai
              </h1>
              
              <p className="text-white/90 text-base sm:text-lg lg:text-xl xl:text-2xl mb-6 max-w-2xl mx-auto leading-relaxed">
                Experience the future of service booking with our mobile application. Get 1000 free credits in your wallet when you download MannuBhai app
              </p>
              
              {/* Download Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://apps.apple.com/in/app/mannu-bhai-service-expert/id6744962904"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-all duration-200 hover:scale-105 shadow-lg"
                >
                  <FaApple className="text-2xl mr-3" />
                  <div className="text-left">
                    <div className="text-xs opacity-80">Download on the</div>
                    <div className="font-semibold">App Store</div>
                  </div>
                </a>
                <a
                  href="https://play.google.com/store/apps/details?id=com.mannubhai.customer&hl=en_IN&pli=1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-all duration-200 hover:scale-105 shadow-lg"
                >
                  <FaGooglePlay className="text-2xl mr-3" />
                  <div className="text-left">
                    <div className="text-xs opacity-80">Get it on</div>
                    <div className="font-semibold">Google Play</div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileAppDownload;