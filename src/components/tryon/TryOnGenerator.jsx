import React from 'react';
import { Sparkles } from 'lucide-react';

const TryOnGenerator = () => {
  return (
    <div className="w-full aspect-[3/4] bg-[#F8F5F0] rounded-2xl flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      {/* Shimmer background */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent w-[200%] animate-[shimmer_2s_infinite] -translate-x-full" />
      
      <div className="relative z-10 flex flex-col items-center">
        <div className="relative w-16 h-16 mb-6">
          <div className="absolute inset-0 rounded-full border-2 border-[#C69C6D]/20" />
          <div className="absolute inset-0 rounded-full border-2 border-[#C69C6D] border-t-transparent animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center text-[#C69C6D]">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
        </div>
        
        <h3 className="text-xl font-serif text-[#1A1A1A] mb-2">Creating your look...</h3>
        <p className="text-sm text-gray-500 max-w-[220px]">
          Placing your jewellery perfectly. This usually takes a few seconds.
        </p>
      </div>
      
      <style>{`
        @keyframes shimmer {
          100% {
            transform: translateX(50%);
          }
        }
      `}</style>
    </div>
  );
};

export default TryOnGenerator;
