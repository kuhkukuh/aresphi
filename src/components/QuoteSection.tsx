export type QuoteSectionProps = {
  image: string;
  quoteText: string;
  quoteEmphasis: string;
  authorName: string;
  authorTitle: string;
};

const defaultProps: QuoteSectionProps = {
  image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1800&q=80",
  quoteText: "We believe a home isn't just a transaction —",
  quoteEmphasis: "it's a life-changing experience.",
  authorName: "Ahmad Wijaya",
  authorTitle: "FOUNDING PARTNER",
};

export default function QuoteSection(props: Partial<QuoteSectionProps> = {}) {
  const { image, quoteText, quoteEmphasis, authorName, authorTitle } = {
    ...defaultProps,
    ...props,
  };

  return (
    <section className="relative h-[80vh] overflow-hidden flex items-center justify-center">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={image}
          alt="Property"
          className="w-full h-full object-cover bg-stone-800"
          onError={(e) => {
            e.currentTarget.style.visibility = "hidden";
          }}
        />
      </div>

      {/* Dark Scrim Overlay */}
      <div className="absolute inset-0 bg-stone-900/55" />

      {/* Quote Content */}
      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <p className="text-2xl sm:text-3xl md:text-4xl leading-snug font-medium tracking-tight text-white">
          {quoteText}{" "}
          <span className="text-white/40">{quoteEmphasis}</span>
        </p>
        <p className="text-sm font-medium mt-8 text-white">{authorName}</p>
        <p className="text-xs tracking-[0.2em] text-white/40 mt-1">{authorTitle}</p>
      </div>
    </section>
  );
}
