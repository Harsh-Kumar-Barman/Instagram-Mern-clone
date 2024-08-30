// Reels.js
import { MdKeyboardArrowRight, MdKeyboardArrowLeft } from "react-icons/md";
import { useRef } from 'react';

const Reels = () => {
  const containerRef = useRef(null);

  const scrollContainer = (direction) => {
    if (containerRef.current) {
      const scrollAmount = direction === 'left' ? -250 : 250;
      containerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="relative flex items-center justify-center w-[90vw] sm:w-[80vw] md:w-[60vw] lg:w-[45vw] mx-auto">
      <div
        ref={containerRef}
        className="flex w-full gap-4 sm:px-2 overflow-x-auto"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((num) => (
          <div key={num} className="flex-shrink-0 flex items-center justify-center w-[60px] h-[60px] rounded-full bg-zinc-500">
            {num}
          </div>
        ))}
      </div>

      <button
        onClick={() => scrollContainer('left')}
        className="hidden sm:inline-block absolute -left-4 md:-left-6 p-2 bg-white rounded-full"
      >
        <MdKeyboardArrowLeft className="text-gray-500" />
      </button>

      <button
        onClick={() => scrollContainer('right')}
        className="hidden sm:inline-block absolute right-4 md:right-6 p-2 bg-white rounded-full"
      >
        <MdKeyboardArrowRight className="text-gray-500" />
      </button>
    </section>
  );
};

export default Reels;
