import { Link } from 'react-router-dom';

const NewArrivalsBanner = () => {
  return (
    <section className="py-16 bg-[var(--color-primary-cream)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl overflow-hidden min-h-[420px] flex items-center">
          {/* Background image */}
          <img
            src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=1400&q=85"
            alt="New Arrivals Collection"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/30 to-transparent"></div>

          {/* Content */}
          <div className="relative z-10 p-10 lg:p-16 max-w-lg">
            <span className="text-xs font-semibold tracking-[0.25em] text-white/75 uppercase mb-4 block">
              New Arrivals
            </span>
            <h2 className="text-4xl lg:text-5xl font-serif text-white leading-tight mb-5">
              Fresh Styles<br />Just In
            </h2>
            <p className="text-white/80 text-base mb-8 leading-relaxed">
              Explore the latest pieces that blend elegance with everyday style.
            </p>
            <Link
              to="/new-arrivals"
              className="inline-flex items-center bg-white text-[var(--color-text-dark)] px-7 py-3.5 font-medium text-sm hover:bg-[var(--color-primary-beige)] transition-colors rounded-lg group"
            >
              Shop New Arrivals
              <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewArrivalsBanner;
