"use client";
import Image from "next/image";

const awards = [
  { src: "/award/iso.webp", alt: "ISO Certification" },
  { src: "/award/td.webp", alt: "Trademark Registered" },
  { src: "/award/cum.webp", alt: "Consumer Award" },
  { src: "/award/dungs.jpg", alt: "DUNS Registered" },
];

export default function AwardCertifications() {
  return (
    <section className="bg-white-50 py-8 px-4">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Award & Certifications
      </h2>
      <div className="border-t border-gray-200 pt-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 place-items-center">
          {awards.map((award, index) => (
            <Image
              key={index}
              src={award.src}
              alt={award.alt}
              width={140}
              height={140}
              className="object-contain h-24 w-auto"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
