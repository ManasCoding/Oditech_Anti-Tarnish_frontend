import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, MapPin, Loader, CheckCircle2 } from 'lucide-react';
import useCartStore from '../store/cartStore';

const Checkout = () => {
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [form, setForm] = useState({ name: '', email: '', mobile: '', address: '', city: '', state: '', pin: '' });
  const [fetchingLocation, setFetchingLocation] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const navigate = useNavigate();

  const cartItems = useCartStore((s) => s.items);
  const updateQty = useCartStore((s) => s.updateQty);
  const addToCart = useCartStore((s) => s.addToCart);
  const clearCart = useCartStore((s) => s.clearCart);

  // Patch stale cart items that are missing shippingCharge by fetching fresh data
  useEffect(() => {
    const patchStaleItems = async () => {
      const staleItems = cartItems.filter(item => item.shippingCharge === undefined || item.shippingCharge === null);
      if (staleItems.length === 0) return;

      for (const item of staleItems) {
        try {
          // Try to fetch by slug (id field may be the slug or _id)
          const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${item.id}`);
          if (res.ok) {
            const product = await res.json();
            // Patch the cart item's shippingCharge in place via the store
            // We do this by updating the items array in the persisted store
            useCartStore.setState(state => ({
              items: state.items.map(i =>
                i.id === item.id
                  ? { ...i, shippingCharge: product.shippingCharge ?? 0 }
                  : i
              )
            }));
          }
        } catch (e) {
          console.error('Failed to patch cart item shipping:', e);
        }
      }
    };
    patchStaleItems();
  }, []); // run once on mount

  // Compute real totals from cart
  const subtotal = cartItems.reduce((sum, item) => sum + Number(item.price) * item.qty, 0);
  const originalTotal = cartItems.reduce((sum, item) => sum + Number(item.originalPrice || item.price) * item.qty, 0);
  const savings = Math.max(0, originalTotal - subtotal);
  // Use per-product shipping charge set by admin; 0 means free
  const shipping = cartItems.reduce((sum, item) => sum + Number(item.shippingCharge || 0) * item.qty, 0);
  const total = subtotal + shipping;
  const totalItems = cartItems.reduce((sum, item) => sum + item.qty, 0);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    
    setFetchingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          if (!res.ok) throw new Error('Failed to fetch address');
          const data = await res.json();
          
          if (data && data.address) {
            const { road, suburb, neighbourhood, city, town, village, state, postcode } = data.address;
            
            // Construct a reasonable street address
            const streetParts = [neighbourhood, suburb, road].filter(Boolean);
            const streetAddress = streetParts.length > 0 ? streetParts.join(', ') : data.display_name.split(',').slice(0, 2).join(', ');
            
            setForm(f => ({
              ...f,
              address: streetAddress,
              city: city || town || village || '',
              state: state || '',
              pin: postcode || ''
            }));
          }
        } catch (error) {
          console.error(error);
          alert('Could not fetch location details. Please enter manually.');
        } finally {
          setFetchingLocation(false);
        }
      },
      (error) => {
        console.error(error);
        alert('Location access denied or unavailable.');
        setFetchingLocation(false);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    setSubmitting(true);
    try {
      const orderPayload = {
        items: cartItems.map(item => ({
          product: item.id,
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: item.qty,
        })),
        shippingAddress: {
          name: form.name,
          email: form.email,
          phone: form.mobile,
          street: form.address,
          city: form.city,
          state: form.state,
          pincode: form.pin,
        },
        paymentMethod,
        subtotal,
        discount: savings,
        shipping,
        total,
      };

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderPayload),
      });

      if (res.ok) {
        clearCart();
        setOrderSuccess(true);
        setTimeout(() => navigate('/orders'), 2500);
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to place order. Please try again.');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-primary-cream)] py-12">
      {/* Order Success Overlay */}
      {orderSuccess && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center gap-5">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-serif text-gray-800 mb-2">Order Placed Successfully!</h2>
            <p className="text-gray-400 text-sm">Redirecting you to your orders...</p>
          </div>
          <div className="w-8 h-8 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-serif mb-10">Checkout</h1>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6">

            {/* Customer Info */}
            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <h2 className="font-serif text-lg mb-5">Customer Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Full Name</label>
                  <input name="name" value={form.name} onChange={handleChange} required placeholder="Priya Sharma" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-[var(--color-text-dark)] transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Email Address</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="priya@email.com" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-[var(--color-text-dark)] transition-colors" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-1.5">Mobile Number</label>
                  <input name="mobile" type="tel" value={form.mobile} onChange={handleChange} required placeholder="+91 98765 43210" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-[var(--color-text-dark)] transition-colors" />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <div className="flex justify-between items-center mb-5">
                <h2 className="font-serif text-lg">Shipping Address</h2>
                <button 
                  type="button" 
                  onClick={handleGetLocation}
                  disabled={fetchingLocation}
                  className="flex items-center gap-1.5 text-sm font-medium text-[var(--color-accent-gold)] hover:text-black transition-colors disabled:opacity-50"
                >
                  {fetchingLocation ? <Loader className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
                  {fetchingLocation ? 'Locating...' : 'Use Current Location'}
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-1.5">Address</label>
                  <input name="address" value={form.address} onChange={handleChange} required placeholder="Flat no., Building, Street" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-[var(--color-text-dark)] transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">City</label>
                  <input name="city" value={form.city} onChange={handleChange} required placeholder="Mumbai" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-[var(--color-text-dark)] transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">State</label>
                  <input name="state" value={form.state} onChange={handleChange} required placeholder="Maharashtra" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-[var(--color-text-dark)] transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">PIN Code</label>
                  <input name="pin" value={form.pin} onChange={handleChange} required placeholder="400001" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-[var(--color-text-dark)] transition-colors" />
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <h2 className="font-serif text-lg mb-5">Payment Method</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {['upi', 'card', 'netbanking', 'cod'].map(method => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    className={`py-3 px-4 border rounded-lg text-sm font-medium transition-colors ${ paymentMethod === method ? 'border-[#1A1A1A] bg-[#1A1A1A] text-white' : 'border-gray-200 hover:border-gray-400' }`}
                  >
                    {method === 'upi' && 'UPI'}
                    {method === 'card' && 'Card'}
                    {method === 'netbanking' && 'Net Banking'}
                    {method === 'cod' && 'Cash on Delivery'}
                  </button>
                ))}
              </div>
              {paymentMethod === 'upi' && (
                <div className="mt-4">
                  <input placeholder="Enter UPI ID (e.g. name@upi)" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-[var(--color-text-dark)] transition-colors" />
                </div>
              )}
              {paymentMethod === 'card' && (
                <div className="mt-4 space-y-3">
                  <input placeholder="Card Number" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-[var(--color-text-dark)] transition-colors" />
                  <div className="grid grid-cols-2 gap-3">
                    <input placeholder="MM / YY" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-[var(--color-text-dark)] transition-colors" />
                    <input placeholder="CVV" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-[var(--color-text-dark)] transition-colors" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-xl p-6 border border-gray-100 sticky top-24">
              <h2 className="font-serif text-lg mb-5">Order Summary</h2>

              {/* Cart Items */}
              {cartItems.length > 0 && (
                <div className="space-y-3 mb-5 pb-5 border-b border-gray-100">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 rounded-lg object-cover bg-gray-100 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.name}</p>
                        <p className="text-xs text-gray-400">Qty: {item.qty}</p>
                      </div>
                      <p className="text-sm font-semibold shrink-0">₹{(Number(item.price) * item.qty).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'})</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                {savings > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Savings</span>
                    <span>-₹{savings.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Shipping</span>
                  <span className={shipping === 0 ? 'text-green-600' : ''}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-semibold text-base">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
              </div>
              <button
                type="submit"
                disabled={submitting || cartItems.length === 0}
                className="w-full py-4 bg-[#1A1A1A] text-white font-medium rounded hover:bg-black transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <><Loader className="w-4 h-4 animate-spin" /> Placing Order...</>
                ) : (
                  'Place Order'
                )}
              </button>
              <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-500">
                <ShieldCheck className="w-4 h-4" />
                Secure & Encrypted Payment
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
