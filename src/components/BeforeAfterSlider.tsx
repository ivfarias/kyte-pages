import { useState, useRef, useEffect } from 'react';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
}

const BeforeAfterSlider = ({
  beforeImage,
  afterImage,
  beforeLabel = 'Before',
  afterLabel = 'After'
}: BeforeAfterSliderProps) => {
  const [isResizing, setIsResizing] = useState(false);
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleStart = () => {
    setIsResizing(true);
  };

  const handleEnd = () => {
    setIsResizing(false);
  };

  const handleMove = (clientX: number) => {
    if (isResizing && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const containerWidth = containerRef.current.offsetWidth;
      const newPosition = (x / containerWidth) * 100;

      setPosition(Math.min(Math.max(newPosition, 0), 100));
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (isResizing) {
      e.preventDefault();
      handleMove(e.touches[0].clientX);
    }
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleEnd);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isResizing]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[500px] overflow-hidden rounded-xl select-none mt-8"
    >
      {/* Before Image */}
      <div className="absolute inset-0">
        <img
          src={beforeImage}
          alt="Before"
          className="w-full h-full object-cover"
        />
        <span className="absolute left-4 bottom-4 bg-red-700/75 text-white px-2 py-1 rounded">
          {beforeLabel}
        </span>
      </div>

      {/* After Image */}
      <div
        className="absolute inset-0"
        style={{
          clipPath: `inset(0 0 0 ${position}%)`,
        }}
      >
        <img
          src={afterImage}
          alt="After"
          className="w-full h-full object-cover"
        />
        <span className="absolute right-4 bottom-4 bg-primary/75 text-white px-2 py-1 rounded">
          {afterLabel}
        </span>
      </div>

      {/* Before Image (Top layer with clip) */}
      <div
        className="absolute inset-0"
        style={{
          clipPath: `inset(0 ${100 - position}% 0 0)`,
        }}
      >
        <img
          src={beforeImage}
          alt="Before"
          className="w-full h-full object-cover"
        />
        <span className="absolute left-4 bottom-4 bg-red-600/75 text-white px-2 py-1 rounded">
          {beforeLabel}
        </span>
      </div>

      {/* Slider Handle */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize"
        style={{ left: `${position}%` }}
        onMouseDown={handleStart}
        onTouchStart={handleStart}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
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
            <polyline points="15 18 9 12 15 6" />
          </svg>
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
            className="rotate-180"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default BeforeAfterSlider;