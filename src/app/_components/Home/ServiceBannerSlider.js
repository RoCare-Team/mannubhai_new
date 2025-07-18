"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const serviceBannerData = [
  {
    ServiceIcon: "/Appliance Slider Banner/RO Repair.webp",
    link: "water-purifier-service",
    alt: "RO Repair Service",
  },
  {
    ServiceIcon: "/Appliance Slider Banner/AC Repair.webp",
    link: "ac-service",
    alt: "AC Repair Service",
  },
  {
    ServiceIcon: "/Appliance Slider Banner/fridge repair.webp",
    link: "refrigerator-repair-service",
    alt: "Refrigerator Repair Service",
  },
  {
    ServiceIcon: "/Appliance Slider Banner/washing machine repair.webp",
    link: "washing-machine-repair",
    alt: "Washing Machine Repair Service",
  },
  {
    ServiceIcon: "/Appliance Slider Banner/all repairs.webp",
    link: "appliance",
    alt: "All Appliance Repairs",
  },
];

export default function GlideSlider() {
  useEffect(() => {
    if (typeof window !== "undefined" && window.Glide) {
      new window.Glide(".glide", {
        type: "carousel",
        startAt: 0,
        perView: 1,
        breakpoints: {
          640: {
            perView: 2,
          },
          1024: {
            perView: 3,
          },
        },
      }).mount();
    }
  }, []);

  return (
    <div className="glide w-full max-w-7xl px-4 mx-auto">
      <div className="glide__track" data-glide-el="track">
        <ul className="glide__slides">
          {serviceBannerData.map((item, idx) => (
            <li key={idx} className="glide__slide">
              <Link href={item.link} prefetch={false}>
                <div className="relative aspect-[16/9] overflow-hidden rounded-lg shadow hover:shadow-lg hover:scale-[1.02] transition-transform duration-300">
                  <Image
                    src={item.ServiceIcon}
                    alt={item.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    quality={80}
                    placeholder="blur"
                    blurDataURL="/blur-placeholder.png"
                  />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Arrows */}
      <div className="glide__arrows" data-glide-el="controls">
        <button className="glide__arrow glide__arrow--left" data-glide-dir="<">
          &#8592;
        </button>
        <button className="glide__arrow glide__arrow--right" data-glide-dir=">">
          &#8594;
        </button>
      </div>
    </div>
  );
}
