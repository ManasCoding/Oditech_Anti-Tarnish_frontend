import React, { useState, useEffect } from 'react';
import useTryOnStore from '../../store/tryOnStore';
import { ChevronRight, Loader } from 'lucide-react';

const ProductSelector = () => {
  const { selectedProduct, setSelectedProduct } = useTryOnStore();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products?limit=15`);
        if (response.ok) {
          const data = await response.json();
          setProducts(data.products || []);
          if (!selectedProduct && data.products && data.products.length > 0) {
            setSelectedProduct(data.products[0]);
          }
        }
      } catch (error) {
        console.error("Failed to fetch products for try-on:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (products.length === 0) {
      fetchProducts();
    }
  }, [selectedProduct, setSelectedProduct, products.length]);

  const getImgUrl = (img) => typeof img === 'string' ? img : img?.url;

  if (loading && !selectedProduct) {
    return (
      <div className="w-full p-4 border border-gray-100 rounded-xl flex items-center justify-center bg-gray-50/50">
        <Loader className="w-5 h-5 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="w-full relative">
      <div 
        className="w-full p-3 border border-gray-200 rounded-xl flex items-center justify-between cursor-pointer hover:border-[#C69C6D] transition-colors bg-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          {selectedProduct ? (
            <>
              <div className="w-12 h-12 rounded-lg bg-[#F8F5F0] overflow-hidden shrink-0 border border-gray-100">
                <img 
                  src={getImgUrl(selectedProduct.images?.[0]) || selectedProduct.image} 
                  alt={selectedProduct.name} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="text-left">
                <p className="text-xs text-gray-400 mb-0.5">Selected Jewellery</p>
                <h4 className="text-sm font-medium text-[#1A1A1A] line-clamp-1">{selectedProduct.name}</h4>
              </div>
            </>
          ) : (
            <span className="text-sm text-gray-500">Choose jewellery to try on...</span>
          )}
        </div>
        <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} />
      </div>

      {isOpen && (
        <div className="mt-2 w-full max-h-[300px] overflow-y-auto border border-gray-100 rounded-xl bg-white shadow-xl p-3 absolute top-full left-0 z-50">
          <div className="grid grid-cols-3 gap-3">
            {products.map(p => (
              <div 
                key={p._id} 
                onClick={() => {
                  setSelectedProduct(p);
                  setIsOpen(false);
                }}
                className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                  selectedProduct?._id === p._id ? 'border-[#C69C6D]' : 'border-transparent hover:border-gray-200'
                }`}
              >
                <div className="aspect-square bg-[#F8F5F0]">
                  <img src={getImgUrl(p.images?.[0])} alt={p.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-2 text-center bg-gray-50">
                  <p className="text-[10px] font-medium text-[#1A1A1A] line-clamp-2 leading-tight">{p.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductSelector;
