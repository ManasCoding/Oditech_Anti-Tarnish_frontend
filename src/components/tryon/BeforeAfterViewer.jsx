import React, { useState, useRef, useEffect } from 'react';
import useTryOnStore from '../../store/tryOnStore';

const BeforeAfterViewer = () => {
  const { userImage, generatedResult } = useTryOnStore();
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
    }
    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [containerRef]);

  const handleMove = (e) => {
    if (!isDragging || !containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - containerRect.left;
    const percentage = Math.max(0, Math.min(100, (x / containerRect.width) * 100));
    setSliderPosition(percentage);
  };

  const handlePointerDown = () => setIsDragging(true);
  const handlePointerUp = () => setIsDragging(false);

  if (!userImage || !generatedResult) return null;

  return (
    <div 
      className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden cursor-ew-resize select-none bg-[#F8F5F0]"
      ref={containerRef}
      onMouseMove={handleMove}
      onMouseUp={handlePointerUp}
      onMouseLeave={handlePointerUp}
      onTouchMove={handleMove}
      onTouchEnd={handlePointerUp}
    >
      {/* Before Image (User) */}
      <img 
        src={userImage} 
        alt="Before" 
        className="absolute inset-0 w-full h-full object-cover" 
        draggable="false"
      />
      
      {/* After Image (Generated Result) */}
      <div 
        className="absolute inset-0 overflow-hidden border-r-2 border-white shadow-[1px_0_10px_rgba(0,0,0,0.3)]" 
        style={{ width: `${sliderPosition}%` }}
      >
        <img 
          src={generatedResult.resultUrl} 
          alt="After" 
          className="absolute inset-0 h-full object-cover max-w-none" 
          style={{ width: containerWidth ? `${containerWidth}px` : '100%' }}
          draggable="false"
        />
      </div>

      {/* Slider Handle */}
      <div 
        className="absolute top-0 bottom-0 w-0 flex items-center justify-center cursor-ew-resize z-10"
        style={{ left: `${sliderPosition}%` }}
        onMouseDown={handlePointerDown}
        onTouchStart={handlePointerDown}
      >
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg border border-gray-200">
          <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
          </svg>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute top-4 left-4 bg-black/50 text-white text-[10px] font-medium px-2.5 py-1 rounded-full backdrop-blur-sm tracking-wider z-10">
        AFTER
      </div>
      <div className="absolute top-4 right-4 bg-black/50 text-white text-[10px] font-medium px-2.5 py-1 rounded-full backdrop-blur-sm tracking-wider z-10">
        BEFORE
      </div>
    </div>
  );
};

export default BeforeAfterViewer;
