import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Package, Truck, CheckCircle2, XCircle, Clock, ChevronDown, ChevronUp, ShoppingBag, RotateCcw, AlertTriangle } from 'lucide-react';

const API = import.meta.env.VITE_API_URL;

const STATUS_CONFIG = {
  placed:    { label: 'Order Placed',  color: 'bg-gray-100 text-gray-700',    icon: Clock,          step: 1 },
  confirmed: { label: 'Confirmed',     color: 'bg-blue-100 text-blue-700',    icon: CheckCircle2,   step: 2 },
  shipped:   { label: 'Shipped',       color: 'bg-indigo-100 text-indigo-700',icon: Truck,          step: 3 },
  delivered: { label: 'Delivered',     color: 'bg-green-100 text-green-700',  icon: CheckCircle2,   step: 4 },
  cancelled: { label: 'Cancelled',     color: 'bg-red-100 text-red-700',      icon: XCircle,        step: 0 },
  returned:  { label: 'Returned',      color: 'bg-orange-100 text-orange-700',icon: RotateCcw,      step: 0 },
};

const PAYMENT_LABELS = { upi: 'UPI', card: 'Card', netbanking: 'Net Banking', cod: 'Cash on Delivery' };

// Confirmation Modal
const ConfirmModal = ({ action, onConfirm, onClose }) => {
  const configs = {
    cancelled: {
      title: 'Cancel Order?',
      desc: 'Are you sure you want to cancel this order? This action cannot be undone.',
      btnLabel: 'Yes, Cancel Order',
      btnClass: 'bg-red-600 hover:bg-red-700 text-white',
      icon: XCircle,
      iconColor: 'text-red-500',
    },
    returned: {
      title: 'Return Order?',
      desc: 'Are you sure you want to return this order? Our team will reach out to you shortly.',
      btnLabel: 'Yes, Request Return',
      btnClass: 'bg-orange-500 hover:bg-orange-600 text-white',
      icon: RotateCcw,
      iconColor: 'text-orange-500',
    },
    delivered: {
      title: 'Confirm Delivery?',
      desc: 'Confirm that you have received your order in good condition.',
      btnLabel: 'Yes, Confirm Received',
      btnClass: 'bg-green-600 hover:bg-green-700 text-white',
      icon: CheckCircle2,
      iconColor: 'text-green-500',
    },
  };
  const cfg = configs[action];
  if (!cfg) return null;
  const Icon = cfg.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden">
        <div className="p-6 text-center">
          <div className={`w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-4 ${cfg.iconColor}`}>
            <Icon className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{cfg.title}</h3>
          <p className="text-sm text-gray-500 mb-6">{cfg.desc}</p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Go Back
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${cfg.btnClass}`}
            >
              {cfg.btnLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const OrderCard = ({ order: initialOrder, token }) => {
  const [order, setOrder] = useState(initialOrder);
  const [expanded, setExpanded] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');

  const status = STATUS_CONFIG[order.orderStatus] || STATUS_CONFIG.placed;
  const StatusIcon = status.icon;
  const steps = ['placed', 'confirmed', 'shipped', 'delivered'];
  const currentStep = status.step;

  const handleStatusUpdate = async () => {
    if (!confirmAction) return;
    setUpdating(true);
    setError('');
    try {
      const res = await fetch(`${API}/api/orders/${order._id}/my-status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ orderStatus: confirmAction }),
      });
      const data = await res.json();
      if (res.ok) {
        setOrder(data);
      } else {
        setError(data.message || 'Something went wrong');
      }
    } catch (e) {
      setError('Network error. Please try again.');
    } finally {
      setUpdating(false);
      setConfirmAction(null);
    }
  };

  const canCancel = ['placed', 'confirmed'].includes(order.orderStatus);
  const canConfirmDelivery = order.orderStatus === 'shipped';
  const canReturn = order.orderStatus === 'delivered';
  const isTerminal = ['cancelled', 'returned'].includes(order.orderStatus);
  const showButtons = canCancel || canConfirmDelivery || canReturn;

  return (
    <>
      {confirmAction && (
        <ConfirmModal
          action={confirmAction}
          onConfirm={handleStatusUpdate}
          onClose={() => setConfirmAction(null)}
        />
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-gray-400 tracking-wider">
                #{order._id.slice(-10).toUpperCase()}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize flex items-center gap-1 ${status.color}`}>
                <StatusIcon className="w-3 h-3" />
                {status.label}
              </span>
            </div>
            <p className="text-sm text-gray-500">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-gray-400">Total</p>
              <p className="text-lg font-bold text-gray-900">&#8377;{(order.total || 0).toLocaleString()}</p>
            </div>
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-2 hover:bg-gray-50 rounded-xl transition-colors text-gray-400"
            >
              {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Order items preview */}
        <div className="px-6 pb-4 flex gap-2 overflow-x-auto">
          {(order.items || []).slice(0, 4).map((item, i) => (
            <div key={i} className="shrink-0 w-14 h-14 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
              {item.image
                ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                : <Package className="w-6 h-6 m-auto text-gray-300 mt-4" />
              }
            </div>
          ))}
          {order.items?.length > 4 && (
            <div className="shrink-0 w-14 h-14 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-xs text-gray-500 font-medium">
              +{order.items.length - 4}
            </div>
          )}
        </div>

        {/* Progress Stepper (non-terminal statuses only) */}
        {!isTerminal && (
          <div className="px-6 pb-5">
            <div className="flex items-center">
              {steps.map((step, i) => {
                const cfg = STATUS_CONFIG[step];
                const done = currentStep > cfg.step;
                const active = currentStep === cfg.step;
                return (
                  <div key={step} className="flex-1 flex items-center">
                    <div className="flex flex-col items-center">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                        done ? 'bg-green-500 border-green-500 text-white' :
                        active ? 'bg-[#1A1A1A] border-[#1A1A1A] text-white' :
                        'bg-white border-gray-200 text-gray-300'
                      }`}>
                        {done ? '✓' : i + 1}
                      </div>
                      <span className={`text-[10px] mt-1 font-medium whitespace-nowrap ${active ? 'text-[#1A1A1A]' : done ? 'text-green-600' : 'text-gray-300'}`}>
                        {cfg.label}
                      </span>
                    </div>
                    {i < steps.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-1 mb-4 transition-all ${done ? 'bg-green-400' : 'bg-gray-200'}`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Cancelled / Returned Banner */}
        {isTerminal && (
          <div className={`mx-6 mb-5 rounded-xl px-4 py-3 flex items-center gap-3 ${
            order.orderStatus === 'cancelled' ? 'bg-red-50 border border-red-100' : 'bg-orange-50 border border-orange-100'
          }`}>
            <AlertTriangle className={`w-4 h-4 shrink-0 ${order.orderStatus === 'cancelled' ? 'text-red-500' : 'text-orange-500'}`} />
            <p className={`text-sm font-medium ${order.orderStatus === 'cancelled' ? 'text-red-700' : 'text-orange-700'}`}>
              {order.orderStatus === 'cancelled'
                ? 'This order has been cancelled.'
                : 'Return request submitted. Our team will contact you shortly.'}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        {showButtons && !isTerminal && (
          <div className="px-6 pb-5 flex flex-wrap gap-2">
            {canCancel && (
              <button
                disabled={updating}
                onClick={() => setConfirmAction('cancelled')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-red-200 text-red-600 text-xs font-semibold hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                <XCircle className="w-3.5 h-3.5" /> Cancel Order
              </button>
            )}
            {canConfirmDelivery && (
              <button
                disabled={updating}
                onClick={() => setConfirmAction('delivered')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-green-200 text-green-700 text-xs font-semibold hover:bg-green-50 transition-colors disabled:opacity-50"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Confirm Received
              </button>
            )}
            {canReturn && (
              <button
                disabled={updating}
                onClick={() => setConfirmAction('returned')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-orange-200 text-orange-600 text-xs font-semibold hover:bg-orange-50 transition-colors disabled:opacity-50"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Return Order
              </button>
            )}
            {error && <p className="w-full text-xs text-red-500 mt-1">{error}</p>}
          </div>
        )}

        {/* Expanded details */}
        {expanded && (
          <div className="border-t border-gray-100 px-6 py-5 space-y-5">
            {/* Items list */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Items Ordered</h4>
              <div className="space-y-3">
                {(order.items || []).map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 border border-gray-100 shrink-0">
                      {item.image
                        ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        : <Package className="w-5 h-5 m-auto text-gray-300 mt-3" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                      <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-800 shrink-0">
                      &#8377;{((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Order summary */}
            <div className="bg-gray-50 rounded-xl p-4 text-sm space-y-2">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>&#8377;{(order.subtotal || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Shipping</span>
                <span className={order.shipping === 0 ? 'text-green-600 font-medium' : ''}>
                  {order.shipping === 0 ? 'FREE' : `&#8377;${order.shipping}`}
                </span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 border-t border-gray-200 pt-2 mt-2">
                <span>Total</span>
                <span>&#8377;{(order.total || 0).toLocaleString()}</span>
              </div>
            </div>

            {/* Shipping & Payment */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Shipping Address</h4>
                {order.shippingAddress ? (
                  <div className="text-sm text-gray-700 space-y-0.5">
                    <p className="font-medium">{order.shippingAddress.name}</p>
                    <p>{order.shippingAddress.street}</p>
                    <p>{order.shippingAddress.city}{order.shippingAddress.state ? `, ${order.shippingAddress.state}` : ''} {order.shippingAddress.pincode}</p>
                    {order.shippingAddress.phone && <p className="text-gray-400">{order.shippingAddress.phone}</p>}
                  </div>
                ) : <p className="text-sm text-gray-400">—</p>}
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Payment</h4>
                <p className="text-sm font-medium text-gray-700">
                  {PAYMENT_LABELS[order.paymentMethod] || order.paymentMethod}
                </p>
                <span className={`inline-flex mt-1 px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                  order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' :
                  order.paymentStatus === 'failed' ? 'bg-red-100 text-red-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {order.paymentStatus}
                </span>
                {order.trackingId && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-400">Tracking ID</p>
                    <p className="text-sm font-mono font-medium text-gray-700">{order.trackingId}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = sessionStorage.getItem('token');

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${API}/api/orders/my-orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (err) {
        console.error('Failed to fetch orders', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-[var(--color-primary-cream)] py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-serif text-[#1A1A1A]">My Orders</h1>
          <p className="text-sm text-gray-400 mt-1">Track and manage all your orders</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-2 border-[#1A1A1A] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
            <ShoppingBag className="w-14 h-14 text-gray-200 mx-auto mb-5" />
            <h2 className="text-xl font-serif text-gray-800 mb-2">No orders yet</h2>
            <p className="text-gray-400 text-sm mb-6">Once you place an order, it will appear here.</p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-[#1A1A1A] text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-black transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <OrderCard key={order._id} order={order} token={token} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
