import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { ChevronDown, Loader } from 'lucide-react';
import { useParams, useSearchParams, useLocation } from 'react-router-dom';

const Shop = () => {
  const { category } = useParams();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [sort, setSort] = useState('featured');
  const [activeCategory, setActiveCategory] = useState(category || 'all');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (searchParams.get('search') !== null) {
      setSearch(searchParams.get('search') || '');
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/api/products?limit=100`),
          fetch(`${import.meta.env.VITE_API_URL}/api/categories`)
        ]);
        
        if (productsRes.ok) {
          const data = await productsRes.json();
          setAllProducts(data.products || []);
        }
        
        if (categoriesRes.ok) {
          const data = await categoriesRes.json();
          setCategories(data);
        }
      } catch (error) {
        console.error("Failed to fetch shop data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const categoryOptions = ['all', ...categories.map(c => c.name.toLowerCase())];

  let filtered = allProducts
    .filter(p => activeCategory === 'all' || (p.category?.name?.toLowerCase() === activeCategory.toLowerCase()))
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  // Filter based on path if activeCategory is 'all'
  if (location.pathname === '/best-sellers') {
    filtered = filtered.filter(p => p.bestSeller);
  } else if (location.pathname === '/new-arrivals') {
    filtered = filtered.filter(p => p.newArrival || p.createdAt); // assuming newest would sort later if no flag
  }

  filtered = filtered.sort((a, b) => {
      if (sort === 'price_asc') return a.price - b.price;
      if (sort === 'price_desc') return b.price - a.price;
      if (sort === 'rating') return (b.rating || 5) - (a.rating || 5);
      return 0;
    });

  let pageTitle = activeCategory === 'all' ? 'All Jewellery' : activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1);
  if (location.pathname === '/best-sellers') pageTitle = 'Best Sellers';
  if (location.pathname === '/new-arrivals') pageTitle = 'New Arrivals';

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-primary-cream)] py-20 flex justify-center items-center">
        <Loader className="w-8 h-8 animate-spin text-[#1A1A1A]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-primary-cream)] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-serif text-[var(--color-text-dark)] mb-1">{pageTitle}</h1>
          <p className="text-[var(--color-text-muted)] text-sm">{filtered.length} products</p>
        </div>

        {/* Controls row */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[var(--color-text-dark)] transition-colors bg-white"
          />
          <div className="relative">
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2.5 pr-9 text-sm outline-none cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Best Rated</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categoryOptions.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors ${
                activeCategory === cat
                  ? 'bg-[#1A1A1A] text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-400'
              }`}
            >
              {cat === 'all' ? 'All Categories' : cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-[var(--color-text-muted)]">
            <p className="text-lg mb-4">No products found.</p>
            <button
              onClick={() => { setSearch(''); setActiveCategory('all'); }}
              className="text-sm underline hover:text-[var(--color-text-dark)]"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {filtered.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
