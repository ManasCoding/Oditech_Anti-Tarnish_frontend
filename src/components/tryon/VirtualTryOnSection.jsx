import React from 'react';
import useTryOnStore from '../../store/tryOnStore';
import { Sparkles } from 'lucide-react';
import PhotoUploader from './PhotoUploader';
import ProductSelector from './ProductSelector';
import TryOnGenerator from './TryOnGenerator';
import TryOnResult from './TryOnResult';
import { generateVirtualTryOn } from '../../services/virtualTryOn';

const VirtualTryOnSection = () => {
  const { 
    userImage, 
    selectedProduct, 
    generatedResult, 
    setGeneratedResult,
    isGenerating,
    setGenerating,
    generationError,
    setGenerationError
  } = useTryOnStore();

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

  return (
    <section className="py-20 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-serif text-[#1A1A1A] mb-4 uppercase tracking-wide">
            See It On You
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Upload your photo and discover how your favourite BLACKCAT LOOKS jewellery looks on you. Try before you buy.
          </p>
        </div>

        <div className="bg-[#FAFAFA] rounded-3xl overflow-hidden shadow-sm border border-gray-100 flex flex-col lg:flex-row">
          
          {/* Left Side: Preview Area */}
          <div className="w-full lg:w-1/2 p-6 md:p-10 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-gray-200">
            {isGenerating ? (
              <TryOnGenerator />
            ) : generatedResult ? (
              <TryOnResult />
            ) : (
              <PhotoUploader />
            )}
          </div>

          {/* Right Side: Steps */}
          <div className="w-full lg:w-1/2 p-6 md:p-12 bg-white flex flex-col justify-center">
            {!generatedResult && !isGenerating ? (
              <>
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

                <div className="mt-10 pt-6 border-t border-gray-100">
                  {generationError && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">
                      {generationError}
                    </div>
                  )}
                  <button
                    onClick={handleGenerate}
                    disabled={!userImage || !selectedProduct}
                    className="w-full bg-[#1A1A1A] text-white py-4 rounded-xl font-medium hover:bg-[#333333] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg shadow-md"
                  >
                    <Sparkles className="w-5 h-5" />
                    Create My Look
                  </button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-10">
                 <div className="w-20 h-20 bg-[#F8F5F0] rounded-full flex items-center justify-center mb-8 shadow-inner">
                   <Sparkles className="w-10 h-10 text-[#C69C6D]" />
                 </div>
                 <h2 className="text-4xl font-serif text-[#1A1A1A] mb-4">
                   {isGenerating ? "Magic in Progress" : "Your Look is Ready"}
                 </h2>
                 <p className="text-gray-500 max-w-[280px] text-lg">
                   {isGenerating ? "We're using AI to perfectly place the jewellery on your photo." : "Your generated look is ready on the left."}
                 </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};

export default VirtualTryOnSection;
