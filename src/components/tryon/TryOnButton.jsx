import React from 'react';
import useTryOnStore from '../../store/tryOnStore';
import { Sparkles } from 'lucide-react';

const TryOnButton = ({ product, className = "" }) => {
  const openModal = useTryOnStore((state) => state.openModal);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    openModal(product);
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-medium rounded-lg transition-all duration-200 border border-[#C69C6D] text-[#C69C6D] hover:bg-[#C69C6D] hover:text-white bg-white ${className}`}
    >
      <Sparkles className="w-4 h-4" />
      Try It On
    </button>
  );
};

export default TryOnButton;
