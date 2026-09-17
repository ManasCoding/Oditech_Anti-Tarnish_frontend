import React from 'react';
import useTryOnStore from '../../store/tryOnStore';

const TryOnBanner = () => {
  const openModal = useTryOnStore((state) => state.openModal);

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-[#1A1A1A] text-white shadow-xl">
          <div className="absolute inset-0">
            <img 
              src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=2000" 
              alt="Jewellery lifestyle" 
              className="w-full h-full object-cover opacity-40 mix-blend-overlay"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A1A] via-[#1A1A1A]/80 to-transparent" />
          </div>
          
          <div className="relative z-10 py-16 px-8 md:px-16 lg:w-2/3">
            <p className="text-[#C69C6D] font-medium tracking-widest text-sm mb-4 uppercase">New Experience</p>
            <h2 className="text-3xl md:text-5xl font-serif mb-6 leading-tight">
              Jewellery, but make it yours.
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-md">
              See how it looks on you before you buy. Experience our premium AI Virtual Try-On technology.
            </p>
            <button 
              onClick={() => openModal()}
              className="bg-[#C69C6D] text-white py-3.5 px-8 rounded-full font-medium hover:bg-[#b0885a] transition-all inline-flex items-center gap-2"
            >
              Try Virtual Try-On
              <span>→</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TryOnBanner;
