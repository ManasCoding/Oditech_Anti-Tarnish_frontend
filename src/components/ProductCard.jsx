import { Link, useNavigate } from 'react-router-dom';
import { Heart, Star, ShoppingBag, Check } from 'lucide-react';
import { useState } from 'react';
import useCartStore from '../store/cartStore';
import useWishlistStore from '../store/wishlistStore';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const addToCart = useCartStore((s) => s.addToCart);
  const cartItems = useCartStore((s) => s.items);
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const [added, setAdded] = useState(false);

  const getImageUrl = (img) => typeof img === 'string' ? img : img?.url;

  const isWishlisted = isInWishlist(product._id);
  const isInCart = cartItems.some(item => item.id === product._id);

  const handleAddToCart = () => {
    const isLoggedIn = !!sessionStorage.getItem('token');
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    if (isInCart) {
      navigate('/cart');
      return;
    }
    
    addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      shippingCharge: product.shippingCharge || 0,
      image: getImageUrl(product.images?.[0])
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="group flex flex-col bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300">

      {/* Image Container */}
      <div className="relative aspect-square bg-[#F8F5F0] overflow-hidden">
        <Link to={`/product/${product.slug || product._id}`} className="block w-full h-full">
          <img
            src={getImageUrl(product.images?.[0]) || ''}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </Link>

        {/* Discount Badge */}
        {product.discount && (
          <div className="absolute top-3 left-3 bg-[#1A1A1A] text-white text-[10px] font-bold px-2 py-1 rounded">
            {product.discount}% OFF
          </div>
        )}

        {/* Wishlist Button */}
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const isLoggedIn = !!sessionStorage.getItem('token');
            if (!isLoggedIn) {
              navigate('/login');
              return;
            }
            toggleWishlist({
              id: product._id,
              name: product.name,
              price: product.price,
              originalPrice: product.originalPrice,
              image: getImageUrl(product.images?.[0])
            });
          }}
          className={`absolute top-3 right-3 p-2 bg-white/90 rounded-full transition-colors shadow-sm ${isWishlisted ? 'text-red-500 hover:bg-white' : 'text-gray-400 hover:text-red-500 hover:bg-white'}`}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500' : ''}`} />
        </button>
      </div>

      {/* Product Details */}
      <div className="p-4 flex flex-col flex-grow">
        <Link to={`/product/${product.slug || product._id}`}>
          <h3 className="font-medium text-[var(--color-text-dark)] text-sm mb-2 hover:text-[var(--color-accent-gold)] transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-1 mb-3 text-xs text-gray-500">
          <Star className="w-3.5 h-3.5 fill-[#EAB308] text-[#EAB308]" />
          <span className="font-medium text-gray-700">{product.rating || '0'}</span>
          <span>({product.reviewCount || 0})</span>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <span className="font-bold text-gray-900 text-base">₹{product.price?.toLocaleString()}</span>
          {product.originalPrice && (
            <span className="text-xs text-gray-400 line-through">₹{product.originalPrice?.toLocaleString()}</span>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          className={`mt-auto w-full py-2.5 text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
            isInCart ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100' : added ? 'bg-green-600 text-white' : 'bg-[#1A1A1A] text-white hover:bg-[#C69C6D]'
          }`}
        >
          {isInCart ? (
            <>
              <Check className="w-4 h-4" />
              Go to Cart
            </>
          ) : added ? (
            <>
              <Check className="w-4 h-4" />
              Added!
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" />
              Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
