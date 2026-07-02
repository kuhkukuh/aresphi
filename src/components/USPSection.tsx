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

        {/* Grid placeholder */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:h-[500px]">
          {/* Cards will go here */}
        </div>
      </div>
    </section>
  );
}
