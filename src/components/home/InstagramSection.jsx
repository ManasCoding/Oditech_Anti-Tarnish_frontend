const images = [
  {
    src: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=400&q=80',
    alt: 'Gold pendant necklace'
  },
  {
    src: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80',
    alt: 'Diamond earrings'
  },
  {
    src: 'https://images.unsplash.com/photo-1629224316810-9d8805b95e76?w=400&q=80',
    alt: 'Gold rings'
  },
  {
    src: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&q=80',
    alt: 'Gold bracelet'
  },
  {
    src: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=400&q=80',
    alt: 'Model wearing jewellery'
  },
  {
    src: 'https://images.unsplash.com/photo-1584302179602-e4c3d3fd629d?w=400&q=80',
    alt: 'Pearl earrings close-up'
  }
];

const InstagramSection = () => {
  return (
    <section className="py-16 bg-[var(--color-primary-cream)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-serif text-[var(--color-text-dark)] mb-2">Follow Us On Instagram</h2>
          <p className="text-[var(--color-text-muted)]">Tag us @anti_tarnish_jewellery</p>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {images.map((img, i) => (
            <a
              key={i}
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="group block aspect-square overflow-hidden rounded-xl bg-[var(--color-primary-beige)]"
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InstagramSection;
