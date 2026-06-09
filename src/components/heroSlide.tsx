import { useEffect, useState } from "react";

const slides = [
  {
    title: "Prepare",
    description: "Build strong fundamentals and understand concepts.",
  },
  {
    title: "Practice",
    description: "Attempt mock tests and improve accuracy.",
  },
  {
    title: "Perform",
    description: "Track progress and achieve your goals.",
  },
];

export default function HeroSlider() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center mt-6">
      {/* Text */}
      <div className="h-[90px] flex flex-col justify-center items-center overflow-hidden">
        <h3
          key={activeSlide}
          className="text-3xl xl:text-4xl font-semibold text-[#5f5b7a] animate-slideUp"
        >
          {slides[activeSlide].title}
        </h3>

        <p
          key={`${activeSlide}-desc`}
          className="mt-2 text-sm text-slate-600 animate-fadeIn text-center max-w-xs"
        >
          {slides[activeSlide].description}
        </p>
      </div>

      {/* Dots */}
      <div className="flex items-center gap-3 mt-5">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveSlide(index)}
            aria-label={`Slide ${index + 1}`}
            className={`
              transition-all duration-500 rounded-full
              ${
                activeSlide === index
                  ? "w-12 h-3 bg-blue-600"
                  : "w-3 h-3 bg-[#d7ddd8]"
              }
            `}
          />
        ))}
      </div>
    </div>
  );
}