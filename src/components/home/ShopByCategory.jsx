import { Link } from 'react-router-dom';

const categories = [
  {
    id: 1,
    name: 'Necklaces',
    image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=600&q=80',
    path: '/category/necklaces'
  },
  {
    id: 2,
    name: 'Earrings',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80',
    path: '/category/earrings'
  },
  {
    id: 3,
    name: 'Rings',
    image: 'https://images.unsplash.com/photo-1629224316810-9d8805b95e76?w=600&q=80',
    path: '/category/rings'
  },
  {
    id: 4,
    name: 'Bracelets',
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&q=80',
    path: '/category/bracelets'
  },
  {
    id: 5,
    name: 'Anklets',
    image: 'https://images.unsplash.com/photo-1589831377283-33cb1cc6bd5d?w=600&q=80',
    path: '/category/anklets'
  }
];

const ShopByCategory = () => {
  return (
    <section className="py-20 bg-[var(--color-primary-cream)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-3xl lg:text-4xl font-serif text-[var(--color-text-dark)] mb-2">Shop By Category</h2>
          <p className="text-[var(--color-text-muted)]">Find your perfect piece</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-5">
          {categories.map((category) => (
            <Link 
              key={category.id} 
              to={category.path}
              className="group block relative overflow-hidden rounded-xl bg-[var(--color-primary-beige)]"
            >
              <div className="aspect-[3/4] overflow-hidden">
                <img 
                  src={category.image} 
                  alt={category.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 via-black/20 to-transparent">
                <h3 className="font-semibold text-white text-base mb-0.5">{category.name}</h3>
                <span className="text-xs text-white/80 flex items-center group-hover:text-white transition-colors">
                  Shop Now 
                  <span className="ml-1 group-hover:translate-x-1 transition-transform inline-block">→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopByCategory;
