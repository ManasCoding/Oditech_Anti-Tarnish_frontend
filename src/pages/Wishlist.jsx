import { Link } from 'react-router-dom';
import useWishlistStore from '../store/wishlistStore';
import ProductCard from '../components/ProductCard';

const Wishlist = () => {
  const { items } = useWishlistStore();

  return (
    <div className="min-h-screen bg-[var(--color-primary-cream)] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-serif text-[var(--color-text-dark)] mb-2">My Wishlist</h1>
        <p className="text-[var(--color-text-muted)] text-sm mb-8">
          {items.length} {items.length === 1 ? 'item' : 'items'} saved
        </p>

        {items.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🤍</span>
            </div>
            <h2 className="text-xl font-serif text-[var(--color-text-dark)] mb-2">Your wishlist is empty</h2>
            <p className="text-[var(--color-text-muted)] mb-6">Save your favorite pieces here.</p>
            <Link
              to="/shop"
              className="inline-block bg-[#1A1A1A] text-white px-8 py-3 font-medium hover:bg-[#C69C6D] transition-colors"
            >
              Explore Collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {items.map((product) => {
              // Normalize: wishlist saves `image` (string), ProductCard expects `images` (array)
              const normalized = {
                ...product,
                _id: product._id || product.id,
                images: product.images?.length ? product.images : [product.image].filter(Boolean),
              };
              return <ProductCard key={product.id} product={normalized} />;
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
