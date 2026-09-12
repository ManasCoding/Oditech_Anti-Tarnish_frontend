import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-[#E5E0D8]">
      {/* Newsletter Section */}
      <div className="bg-[#1A1A1A] text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Mail className="w-8 h-8 text-[var(--color-accent-gold)]" strokeWidth={1} />
            <div>
              <h3 className="text-xl font-serif mb-1">Stay Glowing</h3>
              <p className="text-sm text-gray-300">Get the latest updates, new arrivals and exclusive offers.</p>
            </div>
          </div>
          <form className="flex flex-col sm:flex-row w-full md:w-auto max-w-md gap-3 sm:gap-0">
            <input 
              type="email" 
              placeholder="Enter your email address" 
              className="px-4 py-3 w-full md:w-72 bg-white text-black outline-none rounded-sm sm:rounded-l-sm sm:rounded-r-none"
              required
            />
            <button 
              type="submit" 
              className="bg-[var(--color-accent-gold)] hover:bg-[#B58B5D] text-white px-6 py-3 font-medium transition-colors rounded-sm sm:rounded-r-sm sm:rounded-l-none whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="text-2xl font-serif tracking-tight text-[var(--color-text-dark)] flex items-center mb-2">
              ANTI-TARNISH
              <span className="ml-1 text-lg">✨</span>
            </Link>
            <p className="text-xs tracking-[0.2em] text-[var(--color-text-muted)] uppercase mb-6">
              Jewellery That Lasts
            </p>
            <p className="text-sm text-[var(--color-text-muted)] leading-relaxed max-w-xs mb-8">
              Premium anti-tarnish jewellery crafted for your everyday moments. Waterproof, skin-friendly, and designed to stay beautiful forever.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium mr-2">Follow Us</span>
              {/* Instagram */}
              <div className="hover:scale-110 transition-transform">
                <img src="https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg" alt="Instagram" className="w-6 h-6" />
              </div>
              {/* Facebook */}
              <div className="hover:scale-110 transition-transform">
                <img src="https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png" alt="Facebook" className="w-6 h-6" />
              </div>
              {/* X / Twitter */}
              <div className="hover:scale-110 transition-transform">
                <img src="https://upload.wikimedia.org/wikipedia/commons/c/ce/X_logo_2023.svg" alt="X" className="w-5 h-5 ml-1" />
              </div>
              {/* YouTube */}
              <div className="hover:scale-110 transition-transform ml-1">
                <img src="https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg" alt="YouTube" className="w-7 h-5" />
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link to="/" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-dark)] transition-colors">Home</Link></li>
              <li><Link to="/about" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-dark)] transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-dark)] transition-colors">Contact Us</Link></li>
              <li><Link to="/faqs" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-dark)] transition-colors">FAQs</Link></li>
            </ul>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-serif text-lg mb-6">Shop</h4>
            <ul className="space-y-3">
              <li><Link to="/new-arrivals" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-dark)] transition-colors">New Arrivals</Link></li>
              <li><Link to="/category/necklaces" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-dark)] transition-colors">Necklaces</Link></li>
              <li><Link to="/category/earrings" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-dark)] transition-colors">Earrings</Link></li>
              <li><Link to="/category/rings" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-dark)] transition-colors">Rings</Link></li>
              <li><Link to="/category/bracelets" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-dark)] transition-colors">Bracelets</Link></li>
              <li><Link to="/best-sellers" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-dark)] transition-colors">Best Sellers</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="font-serif text-lg mb-6">Customer Care</h4>
            <ul className="space-y-3">
              <li><Link to="/shipping" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-dark)] transition-colors">Shipping Policy</Link></li>
              <li><Link to="/returns" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-dark)] transition-colors">Return & Exchange</Link></li>
              <li><Link to="/track-order" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-dark)] transition-colors">Track Order</Link></li>
              <li><Link to="/terms" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-dark)] transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/privacy" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-dark)] transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#E5E0D8] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[var(--color-text-muted)]">
            © 2026 Anti-Tarnish. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--color-text-muted)] mr-2">Secure Payments</span>
            {/* Payment icons placeholders */}
            <div className="flex gap-2 items-center">
              <div className="h-7 w-12 bg-white border border-gray-200 rounded flex items-center justify-center p-1.5">
                <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa" className="w-full object-contain" />
              </div>
              <div className="h-7 w-12 bg-white border border-gray-200 rounded flex items-center justify-center p-1.5">
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="w-full object-contain" />
              </div>
              <div className="h-7 w-12 bg-white border border-gray-200 rounded flex items-center justify-center p-1.5">
                <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" alt="UPI" className="w-full object-contain" />
              </div>
              <div className="h-7 w-12 bg-white border border-gray-200 rounded flex items-center justify-center p-1.5">
                <img src="https://upload.wikimedia.org/wikipedia/commons/d/d1/RuPay.svg" alt="RuPay" className="w-full object-contain" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
