import { memo, useMemo } from 'react';
import Image from 'next/image';

const BusinessOpportunitySection = memo(() => {
    const benefits = useMemo(() => [
        { icon: "💰", text: "Low Investment with High ROI", color: "from-green-500 to-emerald-500" },
        { icon: "📈", text: "Quick Break-Even (3 months)", color: "from-blue-500 to-cyan-500" },
        { icon: "📊", text: "Monthly Profit: ₹1–3 Lakhs", color: "from-purple-500 to-pink-500" },
        { icon: "🎯", text: "360° Marketing Support", color: "from-orange-500 to-red-500" },
        { icon: "🚀", text: "Massive Growth Opportunity", color: "from-indigo-500 to-purple-500" },
    ], []);

    const franchiseeBenefits = useMemo(() => [
        "Exclusive Territory",
        "Training & Certification",
        "Marketing Support",
        "Technology Platform",
        "Operational Manuals",
        "Dedicated Manager",
    ], []);

    const whyFranchisePoints = useMemo(() => [
        {
            title: "Low Investment, High Profit",
            description: "Our model allows even a limited capital investment to lead to a profitable franchise business with minimal risk."
        },
        {
            title: "Quick Break-Even",
            description: "Due to incessant customer demand and robust operational assistance, franchisees generally get a speedy break-even in 3–8 months."
        },
        {
            title: "High ROI Service Franchise",
            description: "Our associates systematically achieve 90–95% ROI per annum, hence one of the highest return service franchise models."
        },
        {
            title: "Monthly Income Potential",
            description: "Franchise owners generate ₹1–2 lakhs every month in profit, giving them consistent cash flow and business growth."
        },
        {
            title: "Trusted Brand",
            description: "Being one of the fastest-growing service franchises in India, MannuBhai has already touched millions of customers and established a solid reputation in the service industry."
        }
    ], []);

    return (
        <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(168,85,247,0.1),transparent_50%)]"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Heading */}
                <div className="text-center max-w-4xl mx-auto mb-12 md:mb-16">
                    <div className="inline-flex items-center px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full text-sm md:text-base font-bold shadow-xl mb-4 md:mb-6">
                        <span className="mr-2">🚀</span>
                        Investment Opportunity
                    </div>

                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-4 md:mb-6 leading-tight">
                        Invest in
                        <span className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Quick Service Delivery
                        </span>
                        <span className="block text-gray-900">Business</span>
                    </h2>
                    <p className="text-lg md:text-xl lg:text-2xl text-gray-600 font-medium">
                        India&apos;s fastest-growing industry with high returns and low risk.
                    </p>
                </div>

                {/* Why Franchise with MannuBhai Section */}
                <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 lg:p-10 mb-12 md:mb-16 border border-gray-100">
                    <div className="text-center mb-8 md:mb-12">
                        <h3 className="text-2xl md:text-3xl lg:text-4xl font-black text-gray-900 mb-4">
                            Why Franchise with <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">MannuBhai?</span>
                        </h3>
                        <p className="text-gray-600 text-lg md:text-xl max-w-4xl mx-auto">
                            Beginning an independent business is not easy—uncertainty, limited brand presence, marketing costs, and operational challenges usually deter entrepreneurs from going for it. But with an investment in a franchise business in the range of ₹10 lakh to ₹15 lakh investment, you obtain the reputation of the brand, tested systems, and robust support from day one.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {whyFranchisePoints.map((point, index) => (
                            <div key={index} className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-2xl border border-indigo-100 hover:shadow-lg transition-shadow duration-300">
                                <h4 className="text-xl font-bold text-indigo-900 mb-3">{point.title}</h4>
                                <p className="text-gray-700">{point.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Content Grid */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-12 md:mb-16">
    {/* Image */}
    <div className="relative order-2 lg:order-1">
    <div className="absolute -inset-2 md:-inset-4 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-3xl blur-xl -z-10"></div>
    <div className="relative z-10 h-64 sm:h-80 md:h-96 lg:h-[28rem] rounded-3xl overflow-hidden shadow-2xl bg-gray-100">
<Image
            src="/franchies/industries-chart.webp"
            alt="Service industry growth chart"
            width={800}
            height={500}
            className="w-full h-full object-contain hover:scale-95 transition-transform duration-500"
            loading="lazy"
            style={{
              maxWidth: '100%',
              height: 'auto',
            }}
          />
        </div>
    </div>
     
    {/* Info Section */}
        <div className="space-y-6 md:space-y-8 order-1 lg:order-2">
            <article className="bg-white/80 backdrop-blur-sm p-6 md:p-8 lg:p-10 rounded-3xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
                <h3 className="text-xl md:text-2xl lg:text-3xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4 md:mb-6">
                    Why Choose Our Franchise?
                </h3>
                <ul className="space-y-3 md:space-y-4">
                    {benefits.map((item, index) => (
                        <li key={item.text} className="group flex items-center text-gray-700 text-base md:text-lg">
                            <div className={`mr-3 md:mr-4 p-2 bg-gradient-to-r ${item.color} rounded-xl text-white font-bold group-hover:scale-110 transition-transform duration-300`}>
                                {item.icon}
                            </div>
                            <span className="group-hover:text-gray-900 transition-colors font-medium">{item.text}</span>
                        </li>
                    ))}
                </ul>
            </article>
        </div>
        </div>

                {/* Franchisee Benefits */}
                <article className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 backdrop-blur-xl p-6 md:p-10 lg:p-12 rounded-3xl shadow-2xl border border-white/10 text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-[conic-gradient(from_180deg_at_50%_50%,rgba(255,255,255,0.05)_0deg,rgba(255,255,255,0.1)_120deg,rgba(255,255,255,0.05)_240deg,rgba(255,255,255,0.1)_360deg)]"></div>

                    <div className="relative z-10">
                        <h3 className="text-xl md:text-2xl lg:text-3xl font-black mb-6 md:mb-8 text-center">
                            <span className="bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
                                🎁 Franchisee Benefits
                            </span>
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 text-base md:text-lg">
                            {franchiseeBenefits.map((benefit, index) => (
                                <div key={benefit} className="group flex items-center p-3 md:p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors duration-300">
                                    <div className="bg-white/20 p-1.5 md:p-2 rounded-full mr-3 md:mr-4 group-hover:bg-white/30 transition-colors duration-300">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4 md:h-5 md:w-5 text-white"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                    <span className="font-medium group-hover:text-yellow-300 transition-colors duration-300">{benefit}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </article>
            </div>
        </section>
    );
});

BusinessOpportunitySection.displayName = 'BusinessOpportunitySection';

export default BusinessOpportunitySection;