import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <>
      {/* ── Full 100vh Hero ──────────────────────────────────── */}
      <section className="relative h-screen w-full overflow-hidden">

        {/* Background image — woman wearing necklace (zoomed out / wide shot) */}
        <img
          src="https://images.unsplash.com/photo-1584302179602-e4c3d3fd629d?w=1800&q=90&auto=format&fit=crop"
          alt="Woman wearing elegant gold necklace and earrings"
          className="absolute inset-0 w-full h-full object-cover object-[center_20%]"
        />

        {/* Gradient overlay — dark on left for text, transparent on right */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/10" />
        {/* Bottom fade */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Content */}
        <div className="relative h-full flex items-center">
          <div className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-20 w-full">
            <div className="max-w-xl">

              {/* Label */}
              <div className="flex items-center gap-3 mb-7">
                <div className="h-px w-10 bg-[#C69C6D]" />
                <span className="text-xs font-semibold tracking-[0.35em] text-[#C69C6D] uppercase">
                  Premium Collection 2026
                </span>
              </div>

              {/* Heading */}
              <h1 className="font-serif text-white leading-[1.06] mb-7">
                <span className="block text-5xl sm:text-6xl lg:text-7xl xl:text-8xl">Jewellery</span>
                <span className="block text-5xl sm:text-6xl lg:text-7xl xl:text-8xl italic text-[#C69C6D]">That Lasts</span>
                <span className="block text-5xl sm:text-6xl lg:text-7xl xl:text-8xl">Forever.</span>
              </h1>

              {/* Sub-text */}
              <p className="text-white/75 text-base sm:text-lg leading-relaxed mb-10 max-w-md">
                Anti-tarnish. Waterproof. Skin-friendly. Crafted to stay radiant through every moment of your life.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 mb-14">
                <Link
                  to="/shop"
                  className="inline-flex items-center justify-center px-9 py-4 bg-[#C69C6D] text-white text-sm font-semibold tracking-wider hover:bg-[#B58B5D] transition-all duration-300 rounded-full group"
                >
                  Shop Collection
                  <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </Link>
                <Link
                  to="/new-arrivals"
                  className="inline-flex items-center justify-center px-9 py-4 border border-white/40 text-white text-sm font-medium tracking-wider hover:border-white hover:bg-white/10 transition-all duration-300 rounded-full backdrop-blur-sm"
                >
                  New Arrivals
                </Link>
              </div>

              {/* Stats row */}
              <div className="flex items-center gap-8">
                {[
                  { num: '50K+', label: 'Happy Customers' },
                  { num: '4.8 ★', label: 'Average Rating' },
                  { num: '100%', label: 'Anti-Tarnish' },
                ].map(({ num, label }, i) => (
                  <div key={label} className={`${i > 0 ? 'pl-8 border-l border-white/20' : ''}`}>
                    <p className="text-2xl font-bold text-white font-serif">{num}</p>
                    <p className="text-xs text-white/60 mt-0.5 tracking-wide">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom right floating trust badge */}
        <div className="absolute bottom-10 right-8 sm:right-16 hidden md:flex flex-col gap-3">
          {[
            { emoji: '✦', text: 'Anti-Tarnish Guaranteed' },
            { emoji: '✦', text: 'Waterproof & Skin Friendly' },
            { emoji: '✦', text: 'Free Shipping above ₹999' },
          ].map(({ emoji, text }) => (
            <div key={text} className="flex items-center gap-2 backdrop-blur-sm bg-white/10 border border-white/20 rounded-full px-4 py-2">
              <span className="text-[#C69C6D] text-xs">{emoji}</span>
              <span className="text-white/90 text-xs font-medium">{text}</span>
            </div>
          ))}
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 hidden sm:flex">
          <span className="text-white/40 text-[10px] tracking-[0.25em] uppercase">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-white/40 to-transparent animate-pulse" />
        </div>
      </section>

      {/* ── Marquee strip ──────────────────────────────────── */}
      <div className="bg-[#1A1A1A] text-white py-3 overflow-hidden">
        <div className="flex whitespace-nowrap" style={{ animation: 'marquee 25s linear infinite' }}>
          {Array(6).fill(['ANTI-TARNISH', 'WATERPROOF', 'SKIN FRIENDLY', 'PREMIUM QUALITY', 'FREE SHIPPING', 'EASY RETURNS']).flat().map((text, i) => (
            <span key={i} className="text-[11px] font-semibold tracking-[0.25em] uppercase mr-10 text-white/70">
              {text} <span className="text-[#C69C6D] mr-10">✦</span>
            </span>
          ))}
        </div>
      </div>
    </>
  );
};

export default Hero;
