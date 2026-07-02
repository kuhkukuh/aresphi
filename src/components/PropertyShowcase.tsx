"use client";

import { useRef } from "react";

export type Property = {
  id: string;
  name: string;
  location: string;
  price: string;
  image: string;
};

export type PropertyShowcaseProps = {
  properties?: Property[];
};

const defaultProperties: Property[] = [
  {
    id: "1",
    name: "Rumah Modern Pondok Indah",
    location: "Jakarta Selatan",
    price: "Rp 2.5 M",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80",
  },
  {
    id: "2",
    name: "Apartemen Mewah Sudirman",
    location: "Jakarta Pusat",
    price: "Rp 35 jt/bln",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80",
  },
  {
    id: "3",
    name: "Villa Eksklusif BSD",
    location: "Tangerang",
    price: "Rp 4.5 M",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80",
  },
  {
    id: "4",
    name: "Cluster Premium Bandung",
    location: "Bandung",
    price: "Rp 1.8 M",
    image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=600&q=80",
  },
];

// Card heights for visual rhythm (matches design reference)
const cardHeights = ["h-[80%]", "h-[90%]", "h-[75%]", "h-[85%]"];

export default function PropertyShowcase({
  properties = defaultProperties,
}: PropertyShowcaseProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 420; // Card width + gap
    scrollContainerRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section
      id="properti"
      className="py-24 relative overflow-hidden bg-beige w-full"
    >
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-12 flex justify-between items-end">
        <div>
          <div className="flex justify-between items-baseline mb-4 pb-4 border-b border-stone-400/20">
            <span className="text-xs font-semibold text-orange uppercase tracking-[0.15em]">
              / 04 Properti
            </span>
            <span className="text-xs text-stone-400 font-mono">[ 04 ]</span>
          </div>
          <h2 className="mt-6 text-4xl font-medium leading-tight sm:text-5xl md:text-6xl text-stone-900 tracking-[-0.055em]">
            Koleksi
            <br />
            <span className="font-playfair italic font-normal text-stone-500/80">
              Properti Unggulan
            </span>
          </h2>
        </div>
        <a
          href="#"
          className="hidden md:inline-flex items-center gap-2 border border-stone-300 rounded-full px-6 py-3 hover:bg-stone-900 hover:text-white transition-colors text-base font-medium"
        >
          Lihat Semua
        </a>
      </div>

      {/* Scroll Container */}
      <div className="relative">
        {/* Arrow Buttons - Desktop Only */}
        <button
          onClick={() => scroll("left")}
          aria-label="Scroll left"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white shadow-lg hidden md:flex items-center justify-center hover:bg-orange hover:text-white transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <button
          onClick={() => scroll("right")}
          aria-label="Scroll right"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white shadow-lg hidden md:flex items-center justify-center hover:bg-orange hover:text-white transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>

        {/* Cards Container */}
        <div
          ref={scrollContainerRef}
          className="h-[65vh] flex items-center w-full overflow-x-auto no-scrollbar"
        >
          <div className="flex gap-6 px-6 md:px-12 w-max h-[80%] items-center">
            {properties.map((property, index) => (
              <div
                key={property.id}
                className={`relative w-[320px] md:w-[400px] ${
                  cardHeights[index % cardHeights.length]
                } rounded-2xl overflow-hidden group shadow-xl shrink-0`}
              >
                {/* Image */}
                <img
                  src={property.image}
                  alt={property.name}
                  className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                  onError={(e) => {
                    e.currentTarget.style.visibility = "hidden";
                  }}
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 w-full p-6 text-white">
                  <div className="flex justify-between items-end mb-4">
                    <div className="bg-white/20 backdrop-blur-md rounded-full px-4 py-2 text-sm font-medium">
                      {property.price}
                    </div>
                    <button
                      className="w-10 h-10 bg-orange rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-colors text-sm font-bold"
                      aria-label="View property details"
                    >
                      →
                    </button>
                  </div>
                  <h3 className="font-playfair text-2xl italic">
                    {property.name}
                  </h3>
                  <p className="text-white/70 text-sm">{property.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
