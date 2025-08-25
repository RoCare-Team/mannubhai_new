    const ServiceCard = ({ service, onClick }) => (
  <button
    onClick={() => onClick(service)}
    aria-label={`View ${service.ServiceName} services`}
    className="bg-white rounded-xl p-3 flex flex-col items-center justify-center shadow-md hover:shadow-lg transition-all"
    style={{ aspectRatio: '1/1.2' }}
  >
    <div className="relative w-full aspect-square max-w-[96px] bg-blue-50 rounded-lg mb-2">
      <Image
        src={service.ServiceIcon}
        alt={service.ServiceName}
        fill
        className="object-contain"
        placeholder="blur"
        blurDataURL="/blur.png"
        loading="lazy"
        sizes="(max-width: 640px) 96px, 80px"
        onError={(e) => {
          e.currentTarget.src = DEFAULT_IMAGE;
        }}
      />
    </div>
    <span className="text-xs font-semibold text-center text-gray-700">
      {service.ServiceName}
    </span>
  </button>
);

// Extracted Promo Banner Component
const PromoBanner = () => (
  <section className="mt-4 md:mt-10 max-w-7xl mx-auto">
    <div className="rounded-xl overflow-hidden shadow">
      <Image
        src="/HomeBanner/beauty_mob.webp"
        alt="Beauty services"
        width={768}
        height={300}
        placeholder="blur"
        blurDataURL="/blur-banner.png"
        sizes="100vw"
        className="block md:hidden w-full h-auto"
        priority
      />
      <Image
        src="/HomeBanner/beauty.webp"
        alt="Beauty services"
        width={1920}
        height={400}
        priority
        placeholder="blur"
        blurDataURL="/blur-banner.png"
        sizes="100vw"
        className="hidden md:block w-full h-auto"
      />
    </div>
  </section>
);