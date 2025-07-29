// Add this component near your other components
const ComingSoonServices = ({ cityName }) => {
  const comingSoonServices = [
    { name: "Sofa Cleaning", icon: "/coming-soon/sofa-cleaning.webp" },
    { name: "Bathroom Cleaning", icon: "/coming-soon/bathroom-cleaning.webp" },
    { name: "Home Deep Clean", icon: "/coming-soon/home-deep-clean.webp" },
    { name: "Kitchen Cleaning", icon: "/coming-soon/kitchen-cleaning.webp" },
    { name: "Pest Control", icon: "/coming-soon/pest-control.webp" },
    { name: "Water Tank Cleaning", icon: "/coming-soon/water-tank-cleaning.webp" },
  ];

  return (
    <section className="mt-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12" id="coming-soon-services">
      <h2 className="text-left text-lg sm:text-2xl font-bold text-gray-800 mb-5">
        Coming Soon to {cityName}
      </h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-6">
        {comingSoonServices.map((service, index) => (
          <div 
            key={index} 
            className="relative bg-white rounded-xl p-3 flex flex-col items-center justify-center shadow-md border border-gray-200"
          >
            {/* Coin pattern background */}
            <div className="absolute inset-0 opacity-10 bg-[url('/patterns/coin-pattern.png')] bg-repeat" />
            
            {/* Coming Soon Badge */}
            <div className="absolute -top-2 -right-2 bg-yellow-400 text-xs font-bold px-2 py-1 rounded-full z-10 transform rotate-12 shadow-sm">
              SOON
            </div>
            
            {/* Service Icon */}
            <div className="relative w-full aspect-square max-w-[80px] sm:max-w-[96px] mb-2 z-10">
              <Image
                src={service.icon}
                alt={service.name}
                fill
                className="object-contain p-2 grayscale"
                placeholder="blur"
                blurDataURL="/blur.png"
                loading="lazy"
                sizes="(max-width: 640px) 80px, 96px"
              />
            </div>
            
            <span className="text-[10px] sm:text-xs font-semibold text-center text-gray-700 leading-tight z-10">
              {service.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

// Then update your CityDetails component's return statement to include the ComingSoonServices
// Add this right after the HandymanServices section and before the AppDownloadCard section
{(!city.personal_care || !city.home_care || !city.handyman_services) && (
  <ComingSoonServices cityName={city.city_name} />
)}