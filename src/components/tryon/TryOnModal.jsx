import React, { useEffect, useState } from 'react';
import useTryOnStore from '../../store/tryOnStore';
import { X, Sparkles } from 'lucide-react';
import PhotoUploader from './PhotoUploader';
import ProductSelector from './ProductSelector';
import TryOnGenerator from './TryOnGenerator';
import TryOnResult from './TryOnResult';
import { generateVirtualTryOn } from '../../services/virtualTryOn';

const TryOnModal = () => {
  const { 
    isModalOpen, 
    closeModal, 
    userImage, 
    selectedProduct, 
    generatedResult, 
    setGeneratedResult,
    isGenerating,
    setGenerating,
    generationError,
    setGenerationError
  } = useTryOnStore();

  const handleClose = () => {
    closeModal();
  };

  const handleGenerate = async () => {
    if (!userImage || !selectedProduct) return;
    
    setGenerating(true);
    setGenerationError(null);
    
    try {
      const result = await generateVirtualTryOn({
        userImage,
        productImage: selectedProduct.images?.[0] || selectedProduct.image,
        productType: selectedProduct.category?.name || 'Jewellery'
      });
      setGeneratedResult(result);
    } catch (err) {
      setGenerationError(err.message || 'Something went wrong');
    } finally {
      setGenerating(false);
    }
  };

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-300">
        
        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-gray-500 hover:text-[#1A1A1A] transition-colors shadow-sm"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Preview Area */}
        <div className="w-full md:w-1/2 p-6 md:p-10 bg-[#FAFAFA] flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-100 overflow-y-auto">
          {isGenerating ? (
            <TryOnGenerator />
          ) : generatedResult ? (
            <TryOnResult />
          ) : (
            <PhotoUploader />
          )}
        </div>

        {/* Right Side: Steps & Actions */}
        <div className="w-full md:w-1/2 p-6 md:p-10 bg-white flex flex-col overflow-y-auto">
          {!generatedResult && !isGenerating ? (
            <>
              <div className="mb-10">
                <h2 className="text-3xl font-serif text-[#1A1A1A] mb-2">Create Your Look</h2>
                <p className="text-gray-500">See how it looks on you before you buy.</p>
              </div>

              <div className="space-y-8 flex-1">
                {/* Step 1 */}
                <div className={`transition-opacity ${userImage ? 'opacity-50' : 'opacity-100'}`}>
                  <div className="flex items-center gap-4 mb-3">
                    <span className="w-8 h-8 rounded-full bg-[#1A1A1A] text-white text-sm flex items-center justify-center font-medium shrink-0">01</span>
                    <h3 className="font-medium text-[#1A1A1A] text-lg">Upload Your Photo</h3>
                  </div>
                  {!userImage && <p className="text-sm text-gray-500 pl-12">Use the area on the left to upload.</p>}
                  {userImage && <p className="text-sm text-green-600 pl-12 font-medium flex items-center gap-1">✓ Photo uploaded</p>}
                </div>

                {/* Step 2 */}
                <div className={`transition-opacity ${!userImage ? 'opacity-40' : 'opacity-100'}`}>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="w-8 h-8 rounded-full bg-[#1A1A1A] text-white text-sm flex items-center justify-center font-medium shrink-0">02</span>
                    <h3 className="font-medium text-[#1A1A1A] text-lg">Choose Jewellery</h3>
                  </div>
                  <div className="pl-12">
                    <ProductSelector />
                  </div>
                </div>
              </div>

              {/* Action Area */}
              <div className="mt-10 pt-6 border-t border-gray-100">
                {generationError && (
                  <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">
                    {generationError}
                  </div>
                )}
                <button
                  onClick={handleGenerate}
                  disabled={!userImage || !selectedProduct}
                  className="w-full bg-[#1A1A1A] text-white py-4 rounded-xl font-medium hover:bg-[#333333] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg shadow-lg shadow-black/10"
                >
                  <Sparkles className="w-5 h-5" />
                  Create My Look
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
               <div className="w-20 h-20 bg-[#F8F5F0] rounded-full flex items-center justify-center mb-8 shadow-inner">
                 <Sparkles className="w-10 h-10 text-[#C69C6D]" />
               </div>
               <h2 className="text-4xl font-serif text-[#1A1A1A] mb-4">
                 {isGenerating ? "Magic in Progress" : "Your Look is Ready"}
               </h2>
               <p className="text-gray-500 mb-10 max-w-[280px] text-lg">
                 {isGenerating ? "We're using AI to perfectly place the jewellery on your photo." : "View the stunning result on the left side."}
               </p>
               {!isGenerating && (
                 <button 
                   onClick={handleClose}
                   className="text-sm font-medium border-b border-[#1A1A1A] pb-0.5 text-[#1A1A1A] hover:text-[#C69C6D] hover:border-[#C69C6D] transition-colors"
                 >
                   Back to Shopping
                 </button>
               )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TryOnModal;
