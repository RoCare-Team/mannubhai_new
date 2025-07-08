    // components/FAQSection.jsx
    "use client";

    import FAQItem from './FAQItem';
    import Image from 'next/image';

    export default function FAQSection({ faqData }) {
    return (
        <div className="my-16 px-4 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Frequently Asked Questions
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Find answers to common questions about our services and policies
            </p>
        </div>

        {/* FAQ Content with Images */}
        <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* Left Image - Only shown on larger screens */}
       <div className="hidden lg:block flex-1 relative min-h-[500px] rounded-xl overflow-hidden shadow-lg">
  <Image
    src="/Faq/faq.jpeg"
    alt="Customer support illustration"
    fill
    className="object-contain"
    sizes="(max-width: 1024px) 100vw, 50vw"
    priority
  />
</div>

            {/* FAQ Items */}
            <div className="flex-1 w-full lg:max-w-2xl">
            <div className="space-y-4">
                {faqData.map((item, index) => (
                <FAQItem
                    key={index}
                    question={item.question}
                    answer={item.answer}
                    index={index}
                />
                ))}
            </div>
            </div>
        </div>
        </div>
    );
    }