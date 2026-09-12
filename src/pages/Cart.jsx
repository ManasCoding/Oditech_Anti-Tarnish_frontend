import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import useCartStore from '../store/cartStore';

const Cart = () => {
  const items = useCartStore((s) => s.items);
  const updateQty = useCartStore((s) => s.updateQty);
  const removeFromCart = useCartStore((s) => s.removeFromCart);

  const subtotal = items.reduce(
    (sum, item) => sum + Number(String(item.price).replace(',', '')) * item.qty,
    0
  );
  const savings = items.reduce(
    (sum, item) =>
      item.originalPrice
        ? sum + (Number(String(item.originalPrice).replace(',', '')) - Number(String(item.price).replace(',', ''))) * item.qty
        : sum,
    0
  );
  const shipping = subtotal >= 999 ? 0 : 99;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[var(--color-primary-cream)] flex flex-col items-center justify-center gap-6 py-20">
        <ShoppingBag className="w-20 h-20 text-gray-300" strokeWidth={1} />
        <h2 className="text-2xl font-serif text-[var(--color-text-dark)]">Your cart is empty</h2>
        <p className="text-[var(--color-text-muted)]">Looks like you haven't added anything yet.</p>
        <Link to="/shop" className="px-8 py-3.5 bg-[#1A1A1A] text-white rounded-xl font-medium hover:bg-[#C69C6D] transition-colors">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-primary-cream)] py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-serif mb-2 text-[var(--color-text-dark)]">Shopping Cart</h1>
        <p className="text-sm text-[var(--color-text-muted)] mb-10">
          {items.length} item{items.length > 1 ? 's' : ''}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row gap-5 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <div className="w-full sm:w-24 h-48 sm:h-24 rounded-xl overflow-hidden bg-[var(--color-primary-beige)] shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-[var(--color-text-dark)] mb-1 truncate">{item.name}</h3>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="font-bold text-gray-900">₹{item.price}</span>
                    {item.originalPrice && (
                      <span className="text-sm text-gray-400 line-through">₹{item.originalPrice}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50">
                      <button
                        onClick={() => updateQty(item.id, item.qty - 1)}
                        className="px-3 py-1.5 hover:bg-gray-100 rounded-l-lg transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-4 py-1.5 border-x border-gray-200 text-sm font-medium min-w-[40px] text-center">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => updateQty(item.id, item.qty + 1)}
                        className="px-3 py-1.5 hover:bg-gray-100 rounded-r-lg transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="text-left sm:text-right shrink-0 mt-2 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-0 border-gray-100">
                  <p className="font-bold text-gray-900">
                    ₹{(Number(String(item.price).replace(',', '')) * item.qty).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm h-fit sticky top-24">
            <h2 className="font-serif text-lg mb-6 text-[var(--color-text-dark)]">Order Summary</h2>
            <div className="space-y-3 text-sm mb-6">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium">₹{subtotal.toLocaleString()}</span>
              </div>
              {savings > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>You save</span>
                  <span className="font-medium">−₹{savings.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500">Shipping</span>
                <span className={shipping === 0 ? 'text-green-600 font-medium' : 'font-medium'}>
                  {shipping === 0 ? 'FREE' : `₹${shipping}`}
                </span>
              </div>
              {shipping === 0 && (
                <p className="text-xs text-green-600 bg-green-50 rounded-lg p-2 text-center">
                  🎉 You've unlocked free shipping!
                </p>
              )}
              <div className="border-t pt-4 flex justify-between font-bold text-base">
                <span>Total</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
            </div>
            <Link
              to="/checkout"
              className="block w-full text-center py-4 bg-[#1A1A1A] text-white font-medium rounded-xl hover:bg-[#C69C6D] transition-colors"
            >
              Proceed to Checkout
            </Link>
            <Link
              to="/shop"
              className="block w-full text-center mt-3 py-3 border border-gray-200 text-sm text-gray-600 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
