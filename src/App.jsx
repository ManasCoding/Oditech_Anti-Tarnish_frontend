import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Admin from './pages/Admin';
import Wishlist from './pages/Wishlist';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import {
  AboutPage,
  ContactPage,
  FAQsPage,
  ShippingPage,
  ReturnsPage,
  TrackOrderPage,
  TermsPage,
  PrivacyPage,
} from './pages/StaticPages';
import TryOnModal from './components/tryon/TryOnModal';

// Layout with Navbar + Footer
const MainLayout = () => (
  <>
    <Navbar />
    <main className="flex-grow">
      <Outlet />
    </main>
    <Footer />
  </>
);

function App() {
  return (
    <Router>
      <ScrollToTop />
      <TryOnModal />
      <div className="flex flex-col min-h-screen">
        <Routes>
          {/* Admin — no navbar/footer */}
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/:tab" element={<Admin />} />

          {/* All other pages — with navbar/footer */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/category/:category" element={<Shop />} />
            <Route path="/best-sellers" element={<Shop />} />
            <Route path="/new-arrivals" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/orders" element={<Orders />} />

            {/* Footer static pages */}
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/faqs" element={<FAQsPage />} />
            <Route path="/shipping" element={<ShippingPage />} />
            <Route path="/returns" element={<ReturnsPage />} />
            <Route path="/track-order" element={<TrackOrderPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
