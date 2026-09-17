import React, { useState } from 'react';
import useTryOnStore from '../../store/tryOnStore';
import BeforeAfterViewer from './BeforeAfterViewer';
import { ShoppingBag, RefreshCcw, Camera, Heart, Share } from 'lucide-react';
import useCartStore from '../../store/cartStore';
import { useNavigate } from 'react-router-dom';

const TryOnResult = () => {
  const { selectedProduct, resetResult, closeModal, setUserImage } = useTryOnStore();
  const [added, setAdded] = useState(false);
  const addToCart = useCartStore((s) => s.addToCart);
  const navigate = useNavigate();

  const getImgUrl = (img) => typeof img === 'string' ? img : img?.url;

  const handleAddToCart = () => {
    if (!selectedProduct) return;
    
    addToCart({
      id: selectedProduct._id,
      name: selectedProduct.name,
      price: selectedProduct.price,
      originalPrice: selectedProduct.originalPrice,
      shippingCharge: selectedProduct.shippingCharge || 0,
      image: getImgUrl(selectedProduct.images?.[0]) || selectedProduct.image
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleViewProduct = () => {
    if (selectedProduct) {
      closeModal();
      navigate(`/product/${selectedProduct.slug || selectedProduct._id}`);
    }
  };

  const handleChangePhoto = () => {
    setUserImage(null);
    resetResult();
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      <h3 className="text-xl font-serif text-[#1A1A1A] mb-4 text-center">Your Look</h3>
      
      <div className="flex-1 min-h-[300px] w-full max-w-[360px] mx-auto mb-6">
        <BeforeAfterViewer />
      </div>

      <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-white overflow-hidden shrink-0 border border-gray-100">
            <img 
              src={getImgUrl(selectedProduct?.images?.[0]) || selectedProduct?.image} 
              alt={selectedProduct?.name} 
              className="w-full h-full object-cover" 
            />
          </div>
          <div>
            <h4 className="text-sm font-medium text-[#1A1A1A] line-clamp-1">{selectedProduct?.name}</h4>
            <span className="text-sm font-bold text-[#C69C6D]">₹{selectedProduct?.price?.toLocaleString()}</span>
          </div>
        </div>
        <div className="flex gap-2 shrink-0 ml-2">
          <button className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-500 hover:text-red-500 transition-colors shadow-sm border border-gray-100">
            <Heart className="w-4 h-4" />
          </button>
          <button className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-500 hover:text-[#1A1A1A] transition-colors shadow-sm border border-gray-100">
            <Share className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <button 
          onClick={handleAddToCart}
          className={`py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors ${
            added ? 'bg-green-600 text-white' : 'bg-[#1A1A1A] text-white hover:bg-[#333333]'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          {added ? 'Added to Bag!' : 'Add to Bag'}
        </button>
        
        <button 
          onClick={handleViewProduct}
          className="py-3 px-4 rounded-lg font-medium border border-[#1A1A1A] text-[#1A1A1A] hover:bg-gray-50 transition-colors flex items-center justify-center"
        >
          View Product
        </button>
      </div>

      <div className="flex items-center justify-center gap-6 mt-2">
        <button 
          onClick={() => resetResult()}
          className="text-sm text-gray-500 hover:text-[#1A1A1A] transition-colors flex items-center gap-1.5"
        >
          <RefreshCcw className="w-3.5 h-3.5" />
          Try Another
        </button>
        
        <button 
          onClick={handleChangePhoto}
          className="text-sm text-gray-500 hover:text-[#1A1A1A] transition-colors flex items-center gap-1.5"
        >
          <Camera className="w-3.5 h-3.5" />
          Change Photo
        </button>
      </div>
    </div>
  );
};

export default TryOnResult;
