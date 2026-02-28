// ImageSlider.jsx
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react"; // Icons ke liye
import { sliderData } from "../data.js"; // Apna data import karein

const ImageSlider = () => {
  const [current, setCurrent] = useState(0);
  const length = sliderData.length;

  // Agli slide par jane ka function
  const nextSlide = () => {
    setCurrent(current === length - 1 ? 0 : current + 1);
  };

  // Pichli slide par jane ka function
  const prevSlide = () => {
    setCurrent(current === 0 ? length - 1 : current - 1);
  };

  // Auto-slider ke liye (har 5 second baad slide change hogi)
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000); // 5000ms = 5 seconds
    return () => clearInterval(interval);
  }, [current, length]);

  if (!Array.isArray(sliderData) || sliderData.length <= 0) {
    return null; // Agar data nahi hai to kuch mat dikhao
  }

  return (
    <div className="w-full max-w-4xl mx-auto my-8">
      {/* Slider Container */}
      <div className="relative group">
        {/* Left Arrow */}
        <div className="absolute top-[50%] -translate-y-[50%] left-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer group-hover:bg-black/50 transition-all z-10">
          <ChevronLeft onClick={prevSlide} size={30} />
        </div>
        {/* Right Arrow */}
        <div className="absolute top-[50%] -translate-y-[50%] right-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer group-hover:bg-black/50 transition-all z-10">
          <ChevronRight onClick={nextSlide} size={30} />
        </div>

        {/* Image Display */}
        <div className="w-full h-[400px] md:h-[500px] rounded-xl overflow-hidden shadow-lg relative">
          {sliderData.map((slide, index) => {
            return (
              <div
                key={index}
                className={
                  index === current
                    ? "opacity-100 transition-opacity duration-1000 ease-in-out h-full w-full absolute top-0 left-0"
                    : "opacity-0 transition-opacity duration-1000 ease-in-out h-full w-full absolute top-0 left-0"
                }
              >
                {index === current && (
                  <img
                    src={slide.image}
                    alt={slide.heading}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* --- Heading Section (Image ke neeche) --- */}
      <div className="text-center mt-4">
        <h3 className="text-xl md:text-2xl font-bold text-gray-800">
          {sliderData[current].heading}
        </h3>
      </div>

      {/* Dots Indicators */}
      <div className="flex justify-center mt-4 space-x-2">
        {sliderData.map((_, index) => (
          <div
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-3 w-3 rounded-full cursor-pointer transition-all duration-300 ${
              current === index ? "bg-blue-600 w-6" : "bg-gray-300"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;