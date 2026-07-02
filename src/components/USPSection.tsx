"use client";

export default function USPSection() {
  return (
    <section id="tentang" className="py-32 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <div>
            <div className="flex justify-between items-baseline mb-4 pb-4 border-b border-stone-400/20">
              <span className="text-xs font-semibold text-orange uppercase tracking-[0.15em]">
                / 01 Mengapa Aresphi
              </span>
              <span className="text-xs text-stone-400 font-mono">
                [ 01 ]
              </span>
            </div>
            <h2 className="mt-8 text-4xl font-medium leading-tight sm:text-5xl md:text-6xl lg:text-[4.6rem] tracking-[-0.055em] text-stone-900">
              Kepercayaan
              <br />
              <span className="font-playfair italic font-normal text-stone-500/80">
                yang Terbukti
              </span>
            </h2>
          </div>
          <p className="text-stone-500 max-w-sm text-sm">
            Kami berkomitmen memberikan layanan terbaik dengan profesionalisme tinggi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:h-[500px]">
          {/* Testimonial Card */}
          <div className="md:col-span-2 md:row-span-2 relative group overflow-hidden rounded-2xl min-h-[300px]">
            <img
              src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80"
              alt="Interior"
              className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-105 bg-stone-200"
              onError={(e) => {
                e.currentTarget.style.visibility = "hidden";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/20 to-transparent" />
            <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
              <p className="text-white/80 text-lg font-light leading-snug mb-4">
                "Tim profesional yang sangat membantu."
              </p>
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80"
                  alt="Ahmad Wijaya"
                  className="w-10 h-10 rounded-full object-cover border-2 border-white/30 bg-stone-600"
                  onError={(e) => {
                    e.currentTarget.style.visibility = "hidden";
                  }}
                />
                <div>
                  <p className="font-medium">Ahmad Wijaya</p>
                  <p className="text-white/60 text-xs">Jakarta</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
