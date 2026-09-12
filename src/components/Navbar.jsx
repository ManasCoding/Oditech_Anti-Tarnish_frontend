import { Link, useNavigate } from 'react-router-dom';
import { Search, User, Heart, ShoppingBag, Menu, Package, LogOut } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import useCartStore from '../store/cartStore';
import useWishlistStore from '../store/wishlistStore';

const AnnouncementBar = () => (
  <div className="bg-[#1A1A1A] text-white text-xs py-2 px-4 justify-between items-center hidden md:flex">
    <div className="flex-1 flex items-center">
      <span className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
        Free Shipping on Orders Above ₹999
      </span>
    </div>
    <div className="flex-1 text-center font-medium tracking-wide">
      ✨ 100% Anti-Tarnish | Waterproof | Skin Friendly ✨
    </div>
    <div className="flex-1 text-right flex items-center justify-end gap-2">
      <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
      Easy Returns | 7 Days Return Policy
    </div>
  </div>
);

const MobileAnnouncement = () => (
  <div className="bg-[#1A1A1A] text-white text-xs py-2 px-4 text-center md:hidden font-medium tracking-wide">
    ✨ 100% Anti-Tarnish | Waterproof ✨
  </div>
);

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'New Arrivals', path: '/new-arrivals' },
  { name: 'Necklaces', path: '/category/necklaces' },
  { name: 'Earrings', path: '/category/earrings' },
  { name: 'Rings', path: '/category/rings' },
  { name: 'Bracelets', path: '/category/bracelets' },
];

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const items = useCartStore((s) => s.items);
  const totalItems = items.reduce((sum, i) => sum + i.qty, 0);
  const wishlistItems = useWishlistStore((s) => s.items.length);
  const navigate = useNavigate();

  // Get first word of user's name from sessionStorage (saved on login/register)
  const userName = sessionStorage.getItem('userName');
  const firstWord = userName ? userName.trim().split(' ')[0] : null;
  const userAvatar = sessionStorage.getItem('userAvatar');
  const isLoggedIn = !!sessionStorage.getItem('token');

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userName');
    sessionStorage.removeItem('userAvatar');
    setUserDropdownOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-[var(--color-primary-cream)] border-b border-[#E5E0D8]">
      <AnnouncementBar />
      <MobileAnnouncement />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* Logo */}
          <div className="flex flex-col justify-center flex-shrink-0">
            <Link to="/" className="text-2xl font-serif tracking-tight text-[var(--color-text-dark)] flex items-center">
              ANTI-TARNISH
              <span className="ml-1 text-lg">✨</span>
            </Link>
            <span className="text-[0.65rem] tracking-[0.2em] text-[var(--color-text-muted)] uppercase mt-0.5">
              Jewellery That Lasts
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-sm font-medium text-[var(--color-text-dark)] hover:text-[var(--color-accent-gold)] transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex items-center space-x-5">

            {/* Search */}
            <div className="relative hidden sm:flex items-center">
              <input
                type="text"
                placeholder="Search products..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.target.value.trim()) {
                    navigate(`/shop?search=${encodeURIComponent(e.target.value.trim())}`);
                    e.target.value = '';
                  }
                }}
                className="w-0 focus:w-48 opacity-0 focus:opacity-100 transition-all duration-300 absolute right-8 bg-gray-100 border-none rounded-full px-4 py-1.5 text-sm outline-none focus:ring-1 focus:ring-gray-300"
                id="nav-search"
              />
              <label
                htmlFor="nav-search"
                className="text-[var(--color-text-dark)] hover:text-[var(--color-accent-gold)] transition-colors cursor-pointer relative z-10"
              >
                <Search className="w-5 h-5" strokeWidth={1.5} />
              </label>
            </div>

            {/* User / Name / Avatar with Dropdown */}
            <div className="relative hidden sm:block" ref={dropdownRef}>
              {isLoggedIn ? (
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1.5 hover:text-[var(--color-accent-gold)] transition-colors"
                >
                  {userAvatar ? (
                    <img src={userAvatar} alt={firstWord || 'Profile'} className="w-8 h-8 rounded-full object-cover border border-gray-200" />
                  ) : (
                    <span className="bg-[#1A1A1A] text-white text-xs font-semibold w-8 h-8 rounded-full flex items-center justify-center tracking-wide">
                      {firstWord ? firstWord.charAt(0).toUpperCase() : 'U'}
                    </span>
                  )}
                  <span className="text-sm font-medium text-[var(--color-text-dark)]">{firstWord}</span>
                </button>
              ) : (
                <Link to="/login" className="text-[var(--color-text-dark)] hover:text-[var(--color-accent-gold)] transition-colors">
                  <User className="w-5 h-5" strokeWidth={1.5} />
                </Link>
              )}

              {/* Dropdown Menu */}
              {userDropdownOpen && isLoggedIn && (
                <div className="absolute right-0 top-full mt-3 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2 border-b border-gray-50 mb-1">
                    <p className="text-xs text-gray-400">Signed in as</p>
                    <p className="text-sm font-semibold text-gray-800 truncate">{userName}</p>
                  </div>
                  <button
                    onClick={() => { setUserDropdownOpen(false); navigate('/profile'); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <User className="w-4 h-4 text-gray-400" />
                    My Profile
                  </button>
                  <button
                    onClick={() => { setUserDropdownOpen(false); navigate('/orders'); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Package className="w-4 h-4 text-gray-400" />
                    My Orders
                  </button>
                  <div className="border-t border-gray-50 mt-1 pt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Wishlist */}
            <Link to="/wishlist" className="text-[var(--color-text-dark)] hover:text-[var(--color-accent-gold)] transition-colors hidden sm:block relative">
              <Heart className="w-5 h-5" strokeWidth={1.5} />
              {wishlistItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistItems > 9 ? '9+' : wishlistItems}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link to="/cart" className="text-[var(--color-text-dark)] hover:text-[var(--color-accent-gold)] transition-colors relative">
              <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#1A1A1A] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </Link>

            {/* Mobile hamburger */}
            <button
              className="md:hidden text-[var(--color-text-dark)]"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="w-6 h-6" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[var(--color-primary-cream)] border-t border-[#E5E0D8] absolute w-full shadow-lg">
          <div className="px-4 pt-4 pb-4 space-y-1">
            {/* Mobile Search Bar */}
            <div className="mb-4 relative px-3">
              <input 
                id="mobile-search"
                type="text"
                placeholder="Search products..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.target.value.trim()) {
                    navigate(`/shop?search=${encodeURIComponent(e.target.value.trim())}`);
                    e.target.value = '';
                    setIsMobileMenuOpen(false);
                  }
                }}
                className="w-full bg-white border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm outline-none focus:border-[var(--color-text-dark)] transition-colors"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-6 top-1/2 -translate-y-1/2" />
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="block px-3 py-2 text-base font-medium text-[var(--color-text-dark)] hover:bg-[var(--color-primary-beige)] rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="flex justify-around pt-4 border-t border-[#E5E0D8]">
              <button 
                onClick={() => document.getElementById('mobile-search')?.focus()}
                className="flex flex-col items-center text-[var(--color-text-muted)] hover:text-[var(--color-text-dark)] transition-colors"
              >
                <Search className="w-5 h-5" />
                <span className="text-xs mt-1">Search</span>
              </button>
              <Link 
                to={isLoggedIn ? '/profile' : '/login'} 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex flex-col items-center text-[var(--color-text-muted)] hover:text-[var(--color-text-dark)] transition-colors"
              >
                {userAvatar ? (
                  <img src={userAvatar} alt="profile" className="w-6 h-6 rounded-full object-cover" />
                ) : firstWord ? (
                  <span className="bg-[#1A1A1A] text-white text-xs font-semibold w-6 h-6 rounded-full flex items-center justify-center">
                    {firstWord.charAt(0).toUpperCase()}
                  </span>
                ) : (
                  <User className="w-5 h-5" />
                )}
                <span className="text-xs mt-1">{firstWord || 'Account'}</span>
              </Link>
              <Link 
                to="/orders" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex flex-col items-center text-[var(--color-text-muted)] hover:text-[var(--color-text-dark)] transition-colors"
              >
                <Package className="w-5 h-5" />
                <span className="text-xs mt-1">Orders</span>
              </Link>
              <Link 
                to="/wishlist" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex flex-col items-center text-[var(--color-text-muted)] hover:text-[var(--color-text-dark)] transition-colors"
              >
                <Heart className="w-5 h-5" />
                <span className="text-xs mt-1">Wishlist</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
