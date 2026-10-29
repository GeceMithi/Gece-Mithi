import { useEffect, useState } from 'react';
import webDevImg from '../../../assets/developer/web-developer.png';
import freelancerImg from '../../../assets/developer/freelancer.png';

const developerSlides = [
  { img: webDevImg, alt: 'Web Developer' },
  { img: freelancerImg, alt: 'Freelancer' },
];

export default function HomeSection() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const slideInterval = window.setInterval(() => {
      setActiveSlide((currentSlide) => (currentSlide + 1) % developerSlides.length);
    }, 2500);

    return () => window.clearInterval(slideInterval);
  }, []);

  return (
    <section className="h-screen overflow-hidden flex flex-col items-center justify-start py-5 sm:py-8 bg-gradient-to-b from-transparent via-slate-950/20 to-slate-950/40 px-4 sm:px-8">
      <div className="w-full max-w-5xl mx-auto text-center mb-6 sm:mb-8">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight transition-all">
          Hi! <span role="img" aria-label="waving hand">👋</span>
          <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400">
            I&apos;m Sandesh Khemani Suther
          </span>
        </h1>
      </div>

      <div className="relative aspect-[3/2] w-full max-w-[560px] max-h-[55vh] flex-shrink-0">
        <div className="absolute inset-y-[6%] -left-[5%] -right-[5%] bg-[#002b45] shadow-lg"></div>
        <div className="absolute inset-y-[10%] -right-[8%] bg-[#5a9fb8] shadow-lg"></div>
        <div className="absolute inset-0 overflow-hidden bg-slate-900 shadow-[0_15px_35px_rgba(0,0,0,0.35)]">
          <img
            key={activeSlide}
            src={developerSlides[activeSlide].img}
            alt={developerSlides[activeSlide].alt}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-2">
            {developerSlides.map((slide, index) => (
              <button
                key={slide.alt}
                type="button"
                onClick={() => setActiveSlide(index)}
                aria-label={`Show ${slide.alt} slide`}
                aria-current={activeSlide === index ? 'true' : undefined}
                className={`h-2 w-2 rounded-full transition-colors ${
                  activeSlide === index ? 'bg-sky-500' : 'bg-slate-400/70 hover:bg-slate-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
