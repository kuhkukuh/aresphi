export default function BackgroundDecor() {
  return (
    <>
      <div className="fixed inset-0 z-50 flex w-full justify-center opacity-[0.04] pointer-events-none">
        <div className="flex h-full w-full max-w-7xl justify-between px-6 lg:px-12">
          <div className="h-full w-px bg-stone-800" />
          <div className="hidden h-full w-px bg-stone-800 md:block" />
          <div className="hidden h-full w-px bg-stone-800 lg:block" />
          <div className="h-full w-px bg-stone-800" />
        </div>
      </div>

      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <svg
          className="absolute top-0 left-[-25vw] h-[150vh] w-[150vw]"
          viewBox="0 0 1000 1000"
          fill="none"
        >
          <path
            d="M -100 200 C 300 100, 600 500, 1100 300"
            stroke="#f97316"
            strokeWidth="2"
            opacity="0.25"
            className="path-draw"
          />
          <path
            d="M -100 600 C 400 800, 500 200, 1100 700"
            stroke="#f97316"
            strokeWidth="1.5"
            opacity="0.15"
            className="path-draw"
            style={{ animationDelay: "0.5s" }}
          />
        </svg>
      </div>
    </>
  );
}
