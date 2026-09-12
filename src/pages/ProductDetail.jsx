import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, Star, ShieldCheck, Truck, RefreshCcw, Minus, Plus, ShoppingBag, Check } from 'lucide-react';
import useCartStore from '../store/cartStore';
import useWishlistStore from '../store/wishlistStore';
import ProductCard from '../components/ProductCard';

const accordion = [
  { id: 'desc', label: 'Description' },
  { id: 'mat', label: 'Material' },
  { id: 'care', label: 'Care Instructions' },
  { id: 'ship', label: 'Shipping' },
  { id: 'ret', label: 'Returns' },
];

const ProductDetail = () => {
  const { id } = useParams(); // actually this is the slug
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const addToCart = useCartStore((s) => s.addToCart);
  const cartItems = useCartStore((s) => s.items);
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const getImgUrl = (img) => typeof img === 'string' ? img : img?.url;
  const [selectedImage, setSelectedImage] = useState(0);
  const [openAccordion, setOpenAccordion] = useState('desc');
  const [addedToCart, setAddedToCart] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${id}`);
        if (!response.ok) {
          throw new Error('Product not found');
        }
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (product) {
      const fetchReviews = async () => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${product._id}/reviews`);
          if (response.ok) {
            const data = await response.json();
            setReviews(data);
            // Check if logged-in user already submitted a review
            const userName = sessionStorage.getItem('userName');
            if (userName) {
              const myReview = data.find(r => r.user?.name === userName);
              if (myReview) setAlreadyReviewed(true);
            }
          }
        } catch (err) {
          console.error('Failed to fetch reviews', err);
        }
      };
      fetchReviews();
    }
  }, [product]);

  useEffect(() => {
    if (product?.category?._id) {
      const fetchRelatedProducts = async () => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products?category=${product.category._id}&limit=10`);
          if (response.ok) {
            const data = await response.json();
            const filtered = data.products.filter(p => p._id !== product._id);
            setRelatedProducts(filtered);
          }
        } catch (error) {
          console.error("Failed to fetch related products:", error);
        }
      };
      fetchRelatedProducts();
    }
  }, [product]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-primary-cream)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-[#1A1A1A] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-gray-500">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[var(--color-primary-cream)] flex items-center justify-center">
        <p className="text-red-500">{error || 'Product not found'}</p>
      </div>
    );
  }

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
      image: getImgUrl(product.images[0]),
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleWishlistToggle = () => {
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
      image: getImgUrl(product.images[0])
    });
  };

  const handleBuyNow = () => {
    const isLoggedIn = !!sessionStorage.getItem('token');
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    handleAddToCart();
    navigate('/checkout');
  };

  const submitReview = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    setSubmittingReview(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${product._id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ rating, comment })
      });
      if (response.ok) {
        const data = await response.json();
        setReviews([data.review, ...reviews]);
        setComment('');
        setRating(5);
        // Optionally update product's rating locally here if needed
      } else {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          const errorData = await response.json();
          alert(errorData.message || 'Failed to submit review');
        } else {
          alert(`Failed to submit review: ${response.status} ${response.statusText}`);
        }
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong');
    } finally {
      setSubmittingReview(false);
    }
  };

  // Provide defaults for fields not in DB
  const careInstructions = 'Avoid harsh chemicals. Store in the provided pouch. Wipe gently with a soft cloth.';
  const shippingInfo = 'Free shipping on orders above ₹999. Delivered in 3–5 business days.';
  const returnInfo = '7-day easy return policy. No questions asked.';
  
  // Fake discount calc
  const discount = product.originalPrice && product.originalPrice > product.price 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  const accordionContent = {
    desc: product.description,
    mat: product.material || 'Premium Anti-Tarnish Metal',
    care: careInstructions,
    ship: shippingInfo,
    ret: returnInfo,
  };

  return (
    <div className="bg-[var(--color-primary-cream)] min-h-screen py-10 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

          {/* Image Gallery */}
          <div className="lg:col-span-7 flex flex-col-reverse lg:flex-row gap-5 items-start">
            {/* Thumbnails */}
            {product.images && product.images.length > 0 && (
              <div className="flex lg:flex-col gap-3 overflow-x-auto scrollbar-hide shrink-0 w-full lg:w-24 pr-1 pb-1 lg:pb-0">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`rounded-xl overflow-hidden transition-all shrink-0 w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-28 ${
                      selectedImage === i ? 'ring-2 ring-[#1A1A1A] ring-offset-2 opacity-100 shadow-md' : 'opacity-50 hover:opacity-100'
                    }`}
                  >
                    <img src={getImgUrl(img)} alt={`Thumbnail ${i+1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
            
            {/* Main image */}
            <div className="flex-1 rounded-2xl overflow-hidden bg-gray-50 flex items-center justify-center w-full">
              {product.images && product.images.length > 0 ? (
                <img
                  src={getImgUrl(product.images[selectedImage])}
                  alt={product.name}
                  className="w-full h-auto object-contain md:object-cover hover:scale-105 transition-transform duration-700 ease-out"
                />
              ) : (
                <div className="aspect-square flex items-center justify-center w-full">
                  <span className="text-gray-400">No image available</span>
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="lg:col-span-5 flex flex-col items-start lg:sticky lg:top-28 lg:h-max">
            <h1 className="text-3xl font-serif text-[var(--color-text-dark)] mb-3">{product.name}</h1>

            <div className="flex items-center gap-2 mb-5">
              {reviews.length > 0 ? (
                <>
                  <div className="flex">
                    {(() => {
                      const avg = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
                      return [...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < Math.round(avg) ? 'fill-[#EAB308] text-[#EAB308]' : 'text-gray-200 fill-gray-200'}`} />
                      ));
                    })()}
                  </div>
                  <span className="text-sm font-medium">
                    {(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)}
                  </span>
                  <span className="text-sm text-[var(--color-text-muted)]">({reviews.length} reviews)</span>
                </>
              ) : (
                <span className="text-sm text-gray-400">No reviews yet</span>
              )}
            </div>

            <div className="flex items-baseline gap-3 mb-1">
              <span className="text-3xl font-bold text-[var(--color-text-dark)]">₹{product.price.toLocaleString()}</span>
              {product.originalPrice && (
                <span className="text-lg text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
              )}
              {discount > 0 && (
                <span className="text-sm font-semibold text-green-700 bg-green-50 px-2.5 py-1 rounded-full">{discount}% OFF</span>
              )}
            </div>
            <p className="text-xs text-[var(--color-text-muted)] mb-8">Tax included. Free shipping above ₹999.</p>


            {/* Actions */}
            <div className="flex flex-wrap gap-3 mb-8 items-stretch">
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0 && !isInCart}
                className={`flex-1 border py-3 px-4 font-medium transition-colors flex justify-center items-center gap-2 disabled:opacity-50 whitespace-nowrap ${
                  isInCart ? 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100' : 'bg-white border-[#1A1A1A] text-[#1A1A1A] hover:bg-gray-50'
                }`}
              >
                {isInCart ? (
                  <><Check className="w-5 h-5" /> Go to Cart</>
                ) : addedToCart ? (
                  <><Check className="w-5 h-5 text-green-500" /> Added!</>
                ) : (
                  <><ShoppingBag className="w-5 h-5" /> {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}</>
                )}
              </button>
              <button 
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className="flex-1 bg-[#1A1A1A] text-white py-3 px-4 font-medium hover:bg-[#333333] transition-colors disabled:opacity-50 whitespace-nowrap"
              >
                Buy it Now
              </button>
              <button
                onClick={handleWishlistToggle}
                className={`aspect-square py-3 px-3 shrink-0 border transition-colors flex items-center justify-center ${
                  isWishlisted ? 'border-red-500 bg-red-50 text-red-500' : 'border-[#1A1A1A] bg-white hover:bg-gray-50 text-[#1A1A1A]'
                }`}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500' : ''}`} />
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-3 mb-8 p-5 bg-white rounded-2xl border border-gray-100">
              {[
                { icon: ShieldCheck, text: '100% Anti-Tarnish' },
                { icon: ShieldCheck, text: 'Waterproof' },
                { icon: ShieldCheck, text: 'Skin Friendly' },
                { icon: Truck, text: 'Free Shipping' },
                { icon: RefreshCcw, text: '7-Day Easy Returns' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-sm text-gray-700">
                  <Icon className="w-4 h-4 text-green-600 shrink-0" />
                  {text}
                </div>
              ))}
            </div>

            {/* Accordion */}
            <div className="border-t border-gray-200 w-full">
              {accordion.map((item) => (
                <div key={item.id} className="border-b border-gray-100">
                  <button
                    onClick={() => setOpenAccordion(openAccordion === item.id ? null : item.id)}
                    className="w-full flex justify-between items-center py-4 text-left text-sm font-medium hover:text-[var(--color-accent-gold)] transition-colors"
                  >
                    {item.label}
                    <span className="text-xl font-light text-gray-400">{openAccordion === item.id ? '−' : '+'}</span>
                  </button>
                  {openAccordion === item.id && (
                    <p className="text-sm text-[var(--color-text-muted)] pb-4 leading-relaxed">{accordionContent[item.id]}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 border-t border-gray-100 pt-10">
            <h2 className="text-2xl font-serif text-[var(--color-text-dark)] mb-6">Related Products</h2>
            <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {relatedProducts.map((p) => (
                <div key={p._id} className="snap-start shrink-0 w-[200px] md:w-[240px]">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews Section */}
        <div className="mt-16 border-t border-gray-100 pt-10">
          <h2 className="text-2xl font-serif text-[var(--color-text-dark)] mb-6">Customer Reviews</h2>

          {/* Overall Rating Summary */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8 flex flex-col sm:flex-row gap-8 items-center">
            {/* Big average score */}
            <div className="flex flex-col items-center shrink-0">
              <span className="text-6xl font-bold text-[var(--color-text-dark)]">
                {reviews.length > 0
                  ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
                  : (product.rating || 0).toFixed(1)}
              </span>
              <div className="flex mt-2 mb-1">
                {[...Array(5)].map((_, i) => {
                  const avg = reviews.length > 0
                    ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
                    : (product.rating || 0);
                  return (
                    <Star key={i} className={`w-5 h-5 ${i < Math.round(avg) ? 'fill-[#EAB308] text-[#EAB308]' : 'text-gray-200 fill-gray-200'}`} />
                  );
                })}
              </div>
              <span className="text-sm text-gray-500">{reviews.length || product.reviewCount || 0} reviews</span>
            </div>

            {/* Star breakdown bars */}
            <div className="flex-1 w-full space-y-2">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = reviews.filter(r => r.rating === star).length;
                const total = reviews.length || 1;
                const pct = Math.round((count / total) * 100);
                return (
                  <div key={star} className="flex items-center gap-3">
                    <span className="text-xs font-medium w-4 shrink-0 text-right text-gray-600">{star}</span>
                    <Star className="w-3.5 h-3.5 fill-[#EAB308] text-[#EAB308] shrink-0" />
                    <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-[#EAB308] h-2 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400 w-8 shrink-0">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl border border-gray-100 mb-8">
            {alreadyReviewed ? (
              <div className="flex items-center gap-3 text-green-700 bg-green-50 p-4 rounded-xl">
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <span className="text-sm font-medium">You have already reviewed this product. Thank you for your feedback!</span>
              </div>
            ) : (
              <>
                <h3 className="font-medium text-lg mb-4">Leave a Review</h3>
                <form onSubmit={submitReview}>
                  <div className="mb-4 flex items-center gap-2">
                    <span className="text-sm font-medium">Rating:</span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="focus:outline-none"
                        >
                          <Star className={`w-6 h-6 ${star <= rating ? 'fill-[#EAB308] text-[#EAB308]' : 'text-gray-300 fill-gray-300'}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mb-4">
                    <textarea
                      required
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share your thoughts about this product..."
                      className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]"
                      rows="4"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="bg-[#1A1A1A] text-white py-2 px-6 rounded-lg font-medium hover:bg-[#333333] transition-colors disabled:opacity-50"
                  >
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              </>
            )}
          </div>

          <div className="space-y-6">
            {reviews.length === 0 ? (
              <p className="text-gray-500">No reviews yet. Be the first to review!</p>
            ) : (
              reviews.map((review) => (
                <div key={review._id} className="bg-white p-5 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center text-gray-500 font-bold shrink-0">
                      {review.user?.profileImage ? (
                        <img src={review.user.profileImage} alt={review.user.name} className="w-full h-full object-cover" />
                      ) : (
                        review.user?.name?.charAt(0) || 'U'
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{review.user?.name || 'Anonymous User'}</h4>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-[#EAB308] text-[#EAB308]' : 'text-gray-200 fill-gray-200'}`} />
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 ml-auto">{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-gray-700 mt-3">{review.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetail;
