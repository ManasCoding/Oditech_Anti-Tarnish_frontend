import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../ProductCard';
import { Loader } from 'lucide-react';

const BestSellers = () => {
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products?bestSeller=true&limit=6`);
        if (response.ok) {
          const data = await response.json();
          setBestSellers(data.products || []);
        }
      } catch (error) {
        console.error("Failed to fetch best sellers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBestSellers();
  }, []);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl lg:text-4xl font-serif text-[var(--color-text-dark)] mb-2">Best Sellers</h2>
            <p className="text-[var(--color-text-muted)]">Loved by thousands</p>
          </div>
          <Link to="/shop" className="text-sm font-medium hover:text-[var(--color-accent-gold)] transition-colors hidden md:flex items-center gap-1">
            View All <span>→</span>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-10">
            <Loader className="w-8 h-8 animate-spin text-[#1A1A1A]" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {bestSellers.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        <div className="mt-8 text-center md:hidden">
          <Link to="/shop" className="text-sm font-medium hover:text-[var(--color-accent-gold)] transition-colors">
            View All →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BestSellers;
