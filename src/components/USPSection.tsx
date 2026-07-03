"use client";

export default function USPSection() {
  const handleFlashlightMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
  };

  return (
    <section id="tentang" className="py-32 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <div>
            <div className="eyebrow">
              <span className="eyebrow-left">
                / 01 Mengapa Aresphi
              </span>
              <span className="eyebrow-right">
                [ 01 ]
              </span>
            </div>
            <h2 className="mt-8 text-4xl font-medium leading-[1.02] sm:text-5xl md:text-6xl lg:text-[4.6rem] text-stone-900" style={{ letterSpacing: '-0.055em' }}>
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

          {/* Flashlight Card 01 */}
          <div
            className="flashlight-card overflow-hidden relative rounded-xl bg-white/60 backdrop-blur-xl border border-black/5 cursor-pointer"
            onMouseMove={handleFlashlightMove}
          >
            <span className="absolute -top-2 -right-1 font-playfair text-[120px] italic tracking-tighter text-stone-900/30 leading-none select-none pointer-events-none">
              01
            </span>
            <div className="relative z-10 p-6 h-full flex flex-col justify-end min-h-[180px]">
              <h4 className="font-playfair text-2xl italic text-stone-900 mb-1">
                Layanan Lengkap
              </h4>
              <p className="text-stone-500 text-sm">
                Konsultasi hingga transaksi
              </p>
            </div>
          </div>

          {/* Flashlight Card 02 */}
          <div
            className="flashlight-card overflow-hidden relative rounded-xl bg-white/60 backdrop-blur-xl border border-black/5 cursor-pointer"
            onMouseMove={handleFlashlightMove}
          >
            <span className="absolute -top-2 -right-1 font-playfair text-[120px] italic tracking-tighter text-stone-900/30 leading-none select-none pointer-events-none">
              02
            </span>
            <div className="relative z-10 p-6 h-full flex flex-col justify-end min-h-[180px]">
              <h4 className="font-playfair text-2xl italic text-stone-900 mb-1">
                Jaringan Luas
              </h4>
              <p className="text-stone-500 text-sm">
                Akses properti eksklusif
              </p>
            </div>
          </div>

          {/* Dark Stats Card */}
          <div className="md:col-span-2 bg-[#0a0d1f] rounded-2xl p-8 flex flex-col justify-between relative overflow-hidden text-white min-h-[160px]">
            <span className="absolute -top-2 -right-1 font-playfair text-[120px] italic tracking-tighter text-white/30 leading-none select-none pointer-events-none">
              03
            </span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-orange rounded-full animate-pulse" />
              <span className="text-xs uppercase tracking-wide opacity-80">
                Transparansi Total
              </span>
            </div>
            <div>
              <h3 className="text-3xl tracking-tight mb-2">100%</h3>
              <p className="text-white/60 text-sm">
                Informasi jujur. Tanpa biaya tersembunyi.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
