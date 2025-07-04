import { FaApple, FaGooglePlay } from 'react-icons/fa';

const MobileAppDownload = () => {
  return (
    <div className="w-full bg-white py-0 md:py-8 px-4 mb-4">
      <div className="max-w-md mx-auto">
        {/* Heading */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Download MannuBhai</h2>
          <p className="text-sm text-gray-600">
            Experience the future of service booking with<br />
            our mobile application
          </p>
        </div>

        {/* Buttons - Different colors for both mobile and desktop */}
        <div className="flex justify-center gap-3">
          {/* iOS Button - Always Black */}
          <a
            href="#"
            className="flex items-center justify-center bg-black text-white px-4 py-2 rounded-lg text-xs w-full transition hover:bg-gray-800"
          >
            <FaApple className="mr-2 text-sm" />
            <div>
              <p>Download on the</p>
              <p className="font-medium">App Store</p>
            </div>
          </a>

          {/* Android Button - Always Blue Gradient */}
          <a
            href="#"
            className="flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg text-xs w-full transition hover:from-blue-500 hover:to-indigo-500"
          >
            <FaGooglePlay className="mr-2 text-sm" />
            <div>
              <p>Get it on</p>
              <p className="font-medium">Google Play</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default MobileAppDownload;