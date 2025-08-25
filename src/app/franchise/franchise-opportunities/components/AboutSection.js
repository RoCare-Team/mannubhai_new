import { memo, useMemo, useState } from 'react';
import Image from 'next/image';

const AboutSection = memo(() => {
  const [isExpanded, setIsExpanded] = useState(false);
  const features = useMemo(() => [
    {
      icon: "/franchies/time.webp",
      title: "On time Service",
      desc: "Guaranteed punctuality",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: "/franchies/rupees.webp",
      title: "Transparent Price",
      desc: "No hidden fees",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: "/franchies/professional.webp",
      title: "Trained Professionals",
      desc: "Certified experts",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: "/franchies/award.webp",
      title: "Assured Quality",
      desc: "Performance guaranteed",
      color: "from-orange-500 to-red-500"
    },
  ], []);

  const stats = useMemo(() => [
    { value: "2.5M+", label: "Orders Completed", color: "from-green-400 to-emerald-400" },
    { value: "3M+", label: "Happy Customers", color: "from-blue-400 to-cyan-400" },
    { value: "3000+", label: "Verified Partners", color: "from-purple-400 to-pink-400" },
    { value: "PAN India", label: "Service Coverage", color: "from-yellow-400 to-orange-400" },
  ], []);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.05),transparent_50%)]"></div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 relative z-10">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12 md:gap-16">
          <article className="lg:w-1/2 text-center md:text-left space-y-6 md:space-y-8">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full text-sm font-bold shadow-xl hover:shadow-2xl transition-all duration-300">
              <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
              Who We Are
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 leading-tight">
              Redefining
              <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Service Excellence
              </span>
            </h2>

            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p className="text-lg">
                MannuBhai Service Expert is a technology-driven company,
                redefining service excellence through its innovative hybrid
                model. Leveraging advanced technology, we provide swift and
                seamless solutions in home appliance care, home care, and beauty
                care.
              </p>

              <p className="text-lg">
                Our platform integrates intelligent systems to ensure precision,
                reliability, and exceptional customer experiences. Supported by
                a team of highly skilled professionals, we combine cutting-edge
                tools with human expertise to deliver unmatched service quality.
              </p>
              
              {/* Collapsible content */}
              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <p className="text-lg">
                  If you are searching for the top low investment franchise opportunities in India with high returns, then you are on the right page. Setting up a business these days is no longer restricted to huge capital or complicated setups. The Indian service industry is booming, and entrepreneurs are increasingly looking towards profitable, risk-free, and fast-growing franchise models.
                </p>

                <p className="text-lg">
                  Welcome to MannuBhai Franchise – a technology-based franchise venture that enables you to establish your own business in the most sought-after service segments such as home appliance repair, handyman services, beauty salon at home, and home care services. With MannuBhai, you don't merely invest money—you invest in a winning business model with high ROI, assured demand, and complete support.
                </p>
              </div>
              
              {/* Read More/Less Button */}
              <button 
                onClick={toggleExpand}
                className="mt-4 flex items-center text-indigo-600 font-semibold hover:text-indigo-800 transition-colors duration-300"
              >
                {isExpanded ? (
                  <>
                    <span>Read Less</span>
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </>
                ) : (
                  <>
                    <span>Read More</span>
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </article>

          <aside className="lg:w-1/2 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.1),transparent_50%)]"></div>

            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl font-black text-white mb-8 text-center">
                <span className="bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
                  Our Impact Across India
                </span>
              </h3>

              <div className="grid grid-cols-2 gap-4 md:gap-6">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="group bg-white/10 backdrop-blur-sm p-6 rounded-2xl text-center border border-white/20 hover:bg-white/20 transition-all duration-300"
                  >
                    <div className={`text-2xl md:text-3xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                      {stat.value}
                    </div>
                    <div className="text-white/80 text-sm font-medium group-hover:text-white transition-colors">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 text-center">
                <div className="inline-flex items-center text-white/90 text-lg mb-4">
                  <svg className="h-6 w-6 mr-3 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="font-semibold">Trusted by clients nationwide</span>
                </div>
                <p className="text-white/90 text-xl italic font-medium">
                  "Setting new standards in convenience and efficiency"
                </p>
              </div>
            </div>
          </aside>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 p-6 md:p-8 border border-gray-200 rounded-3xl bg-white/80 backdrop-blur-sm shadow-xl mt-12 hover:shadow-2xl transition-all duration-300">
          {features.map((item) => (
            <div
              key={item.title}
              className="group bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <div className="flex flex-col sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
                <div className={`bg-gradient-to-br ${item.color} p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300 self-center sm:self-start`}>
                  <Image
                    src={item.icon}
                    alt={`${item.title} icon`}
                    width={32}
                    height={32}
                    className="object-contain"
                    loading="lazy"
                  />
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="font-bold text-gray-900 text-sm md:text-base mb-1">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-xs md:text-sm">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

AboutSection.displayName = 'AboutSection';

export default AboutSection;