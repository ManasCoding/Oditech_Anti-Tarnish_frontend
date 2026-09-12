import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Users, Tag, LogOut, Plus, Edit2, Trash2, Eye, X, Image as ImageIcon, IndianRupee, UserCircle2, Camera, Save, ShieldCheck, UserPlus, Lock, Key } from 'lucide-react';

const STATUS_COLORS = {
  placed:    'bg-gray-100 text-gray-700',
  confirmed: 'bg-blue-100 text-blue-700',
  shipped:   'bg-indigo-100 text-indigo-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'orders', label: 'Orders', icon: ShoppingCart },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'categories', label: 'Categories', icon: Tag },
  { id: 'access', label: 'Access Control', icon: ShieldCheck },
  { id: 'profile', label: 'My Profile', icon: UserCircle2 },
];

const API = import.meta.env.VITE_API_URL;

const Admin = () => {
  const navigate = useNavigate();
  const { tab } = useParams();
  const fileRef = useRef(null);

  const [activeTab, setActiveTab] = useState(tab || 'dashboard');

  useEffect(() => {
    if (tab && navItems.some(i => i.id === tab)) {
      setActiveTab(tab);
    } else if (!tab) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [tab, navigate]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Admin profile
  const [adminProfile, setAdminProfile] = useState({ name: '', email: '', phone: '', profileImage: '' });
  const [profileForm, setProfileForm] = useState({ name: '', email: '', phone: '' });
  const [savingProfile, setSavingProfile] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const avatarInputRef = useRef(null);

  // Access Control State
  const [adminsList, setAdminsList] = useState([]);
  const [newAdminForm, setNewAdminForm] = useState({ name: '', email: '', password: '' });
  const [addingAdmin, setAddingAdmin] = useState(false);

  // Category Modal State
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryForm, setCategoryForm] = useState({ id: null, name: '' });
  const [savingCategory, setSavingCategory] = useState(false);

  // Product Modal State
  const [showProductModal, setShowProductModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [productForm, setProductForm] = useState({
    id: '', name: '', category: '', price: '', originalPrice: '', stock: '', description: '', shippingCharge: '0'
  });
  const [imageFiles, setImageFiles] = useState([null, null, null, null]);
  const [imagePreviews, setImagePreviews] = useState(['', '', '', '']);
  const fileRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const [savingProduct, setSavingProduct] = useState(false);

  // Auth check
  const token = sessionStorage.getItem('token');
  const isAdminAuthenticated = sessionStorage.getItem('isAdminAuthenticated') === 'true';

  useEffect(() => {
    if (!isAdminAuthenticated) {
      navigate('/login');
      return;
    }
    fetchProducts();
    fetchCategories();
    fetchUsers();
    fetchOrders();
    fetchAdminProfile();
    fetchAdminsList();
  }, [navigate, isAdminAuthenticated]);

  const fetchAdminsList = async () => {
    try {
      const res = await fetch(`${API}/api/admins`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAdminsList(data);
      }
    } catch (err) {
      console.error('Failed to fetch admins list', err);
    }
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    setAddingAdmin(true);
    try {
      const res = await fetch(`${API}/api/admins`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(newAdminForm)
      });
      if (res.ok) {
        setNewAdminForm({ name: '', email: '', password: '' });
        fetchAdminsList();
      } else {
        const data = await res.json();
        alert(data.message);
      }
    } catch (err) {
      console.error('Failed to add admin', err);
    } finally {
      setAddingAdmin(false);
    }
  };

  const handleDeleteAdmin = async (id) => {
    if (!window.confirm('Are you sure you want to remove this admin?')) return;
    try {
      const res = await fetch(`${API}/api/admins/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchAdminsList();
      } else {
        const data = await res.json();
        alert(data.message);
      }
    } catch (err) {
      console.error('Failed to delete admin', err);
    }
  };

  const handleUpdatePassword = async (id, currentName) => {
    const newPassword = window.prompt(`Enter new password for ${currentName}:`);
    if (!newPassword) return;
    
    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }

    try {
      const res = await fetch(`${API}/api/admins/${id}/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ password: newPassword })
      });
      if (res.ok) {
        alert("Password updated successfully!");
      } else {
        const data = await res.json();
        alert(data.message);
      }
    } catch (err) {
      console.error('Failed to update password', err);
      alert("An error occurred.");
    }
  };

  const handleAddCategoryClick = () => {
    setCategoryForm({ id: null, name: '' });
    setShowCategoryModal(true);
  };

  const handleEditCategoryClick = (id, currentName) => {
    setCategoryForm({ id, name: currentName });
    setShowCategoryModal(true);
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!categoryForm.name) return;
    
    setSavingCategory(true);
    try {
      const isEdit = !!categoryForm.id;
      const url = isEdit ? `${API}/api/categories/${categoryForm.id}` : `${API}/api/categories`;
      const method = isEdit ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: categoryForm.name })
      });
      
      if (res.ok) {
        setShowCategoryModal(false);
        fetchCategories();
      } else {
        const data = await res.json();
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingCategory(false);
    }
  };

  const handleDeleteCategory = async (id, currentName) => {
    if (!window.confirm(`Are you sure you want to delete the category "${currentName}"?`)) return;
    try {
      const res = await fetch(`${API}/api/categories/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchCategories();
      else alert((await res.json()).message);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAdminProfile = async () => {
    try {
      const res = await fetch(`${API}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAdminProfile(data);
        setProfileForm({ name: data.name || '', email: data.email || '', phone: data.phone || '' });
      }
    } catch (err) {
      console.error('Failed to fetch admin profile', err);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await fetch(`${API}/api/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(profileForm)
      });
      if (res.ok) {
        // Re-fetch from DB to keep state in sync — no sessionStorage
        await fetchAdminProfile();
        setProfileSuccess(true);
        setTimeout(() => setProfileSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Failed to update profile', err);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingAvatar(true);
    try {
      const fd = new FormData();
      fd.append('avatar', file);
      const res = await fetch(`${API}/api/profile/avatar`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: fd
      });
      if (res.ok) {
        // Re-fetch from DB to keep state in sync — no sessionStorage
        await fetchAdminProfile();
      }
    } catch (err) {
      console.error('Failed to upload avatar', err);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const response = await fetch(`${API}/api/auth/users`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/products?limit=100`);
      const data = await res.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API}/api/categories`);
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  };

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await fetch(`${API}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId);
    try {
      const res = await fetch(`${API}/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ orderStatus: newStatus })
      });
      if (res.ok) {
        setOrders(prev => prev.map(o => o._id === orderId ? { ...o, orderStatus: newStatus } : o));
      }
    } catch (error) {
      console.error("Failed to update order status", error);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('isAdminAuthenticated');
    navigate('/login');
  };

  // ----- Product Form Handlers -----
  const openAddModal = () => {
    setIsEditing(false);
    setProductForm({ id: '', name: '', category: '', price: '', originalPrice: '', stock: '', description: '', shippingCharge: '0' });
    setImageFiles([null, null, null, null]);
    setImagePreviews(['', '', '', '']);
    setShowProductModal(true);
  };

  const openEditModal = (product) => {
    setIsEditing(true);
    setProductForm({
      id: product._id,
      name: product.name,
      category: product.category?._id || product.category || '',
      price: product.price,
      originalPrice: product.originalPrice || '',
      shippingCharge: product.shippingCharge ?? 0,
      stock: product.stock,
      description: product.description || ''
    });
    setImageFiles([null, null, null, null]);
    
    // Fill up to 4 slots with existing images
    const getImgUrl = (img) => typeof img === 'string' ? img : img?.url;
    const existingImgs = (product.images || []).map(getImgUrl);
    const previews = ['', '', '', ''];
    for(let i = 0; i < existingImgs.length && i < 4; i++) {
      previews[i] = existingImgs[i];
    }
    setImagePreviews(previews);
    
    setShowProductModal(true);
  };

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const newFiles = [...imageFiles];
      newFiles[index] = file;
      setImageFiles(newFiles);
      
      const newPreviews = [...imagePreviews];
      newPreviews[index] = URL.createObjectURL(file);
      setImagePreviews(newPreviews);
    }
  };
  
  const removeImage = (index) => {
    const newFiles = [...imageFiles];
    newFiles[index] = null;
    setImageFiles(newFiles);
    
    const newPreviews = [...imagePreviews];
    newPreviews[index] = '';
    setImagePreviews(newPreviews);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setSavingProduct(true);
    try {
      const formData = new FormData();
      formData.append('name', productForm.name);
      formData.append('category', productForm.category);
      formData.append('price', productForm.price);
      formData.append('stock', productForm.stock);
      formData.append('description', productForm.description || 'A beautiful piece of jewelry.');
      formData.append('shippingCharge', productForm.shippingCharge || 0);
      if (productForm.originalPrice) {
        formData.append('originalPrice', productForm.originalPrice);
      }
      for (let i = 0; i < 4; i++) {
        if (imageFiles[i]) {
          formData.append('images', imageFiles[i]);
          formData.append('imageOrder', 'FILE');
        } else if (imagePreviews[i]) {
          formData.append('imageOrder', `URL:${imagePreviews[i]}`);
        }
      }

      const url = isEditing ? `${API}/api/products/${productForm.id}` : `${API}/api/products`;
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      if (res.ok) {
        setShowProductModal(false);
        fetchProducts(); // Refresh list
      } else {
        const data = await res.json();
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      alert(`Error saving product: ${error.message}`);
    } finally {
      setSavingProduct(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`${API}/api/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchProducts();
      } else {
        const data = await res.json();
        alert(`Error deleting product: ${data.message}`);
      }
    } catch (error) {
      alert(`Error deleting product: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1A1A1A] text-white flex flex-col fixed h-full z-10">
        <div className="p-6 border-b border-white/10">
          <h1 className="text-xl font-serif">ANTI-TARNISH ✨</h1>
          <p className="text-xs text-gray-400 mt-1 tracking-wider">Admin Panel</p>
        </div>

        {/* Sidebar Admin Profile Preview */}
        <div
          onClick={() => navigate('/admin/profile')}
          className="mx-4 mt-4 mb-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-600 shrink-0 flex items-center justify-center">
            {adminProfile.profileImage
              ? <img src={adminProfile.profileImage} alt="avatar" className="w-full h-full object-cover" />
              : <UserCircle2 className="w-6 h-6 text-gray-400" />}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium text-white truncate">{adminProfile.name || 'Admin'}</p>
            <p className="text-xs text-gray-400 truncate">{adminProfile.email || ''}</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => navigate(`/admin/${item.id}`)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors text-left ${
                  activeTab === item.id ? 'bg-white/15 text-white' : 'text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" strokeWidth={1.5} />
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/10">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
            <LogOut className="w-5 h-5" strokeWidth={1.5} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-10 bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between">
          <p className="text-sm text-gray-500 capitalize">
            {activeTab === 'dashboard' ? '🏠 Dashboard' :
             activeTab === 'products' ? '📦 Products' :
             activeTab === 'orders' ? '🛒 Orders' :
             activeTab === 'customers' ? '👥 Customers' :
             activeTab === 'categories' ? '🏷️ Categories' : 
             activeTab === 'access' ? '🛡️ Access Control' : '👤 My Profile'}
          </p>
          <button
            onClick={() => navigate('/admin/profile')}
            className="flex items-center gap-2.5 hover:bg-gray-50 px-3 py-2 rounded-xl transition-colors"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center shrink-0">
              {adminProfile.profileImage
                ? <img src={adminProfile.profileImage} alt="avatar" className="w-full h-full object-cover" />
                : <UserCircle2 className="w-5 h-5 text-gray-400" />}
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-gray-800 leading-none">{adminProfile.name || 'Admin'}</p>
              <p className="text-xs text-gray-400 mt-0.5">Administrator</p>
            </div>
          </button>
        </header>

        <div className="p-8">
        {activeTab === 'dashboard' && (
          <div>
            <h2 className="text-2xl font-serif text-gray-800 mb-8">Dashboard Overview</h2>
            
            {/* Real Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-gray-500">Total Revenue</p>
                  <IndianRupee className="w-5 h-5 text-green-500" />
                </div>
                <p className="text-2xl font-bold text-gray-800 mb-2">
                  ₹{orders.reduce((sum, o) => sum + (o.total || 0), 0).toLocaleString()}
                </p>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-50 text-green-700">
                  from {orders.filter(o => o.orderStatus !== 'cancelled').length} orders
                </span>
              </div>
              <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-gray-500">Total Orders</p>
                  <ShoppingCart className="w-5 h-5 text-blue-500" />
                </div>
                <p className="text-2xl font-bold text-gray-800 mb-2">{orders.length}</p>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-50 text-blue-700">
                  {orders.filter(o => o.orderStatus === 'delivered').length} delivered
                </span>
              </div>
              <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-gray-500">Total Products</p>
                  <Package className="w-5 h-5 text-purple-500" />
                </div>
                <p className="text-2xl font-bold text-gray-800 mb-2">{products.length}</p>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-purple-50 text-purple-700">
                  {products.filter(p => p.stock <= 0).length} out of stock
                </span>
              </div>
              <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-gray-500">Total Customers</p>
                  <Users className="w-5 h-5 text-yellow-500" />
                </div>
                <p className="text-2xl font-bold text-gray-800 mb-2">{users.length}</p>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-yellow-50 text-yellow-700">
                  {users.filter(u => u.role !== 'admin').length} shoppers
                </span>
              </div>
            </div>

            {/* Recent Orders from real data */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm mb-6">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-serif text-lg">Recent Orders</h3>
                <button onClick={() => navigate('/admin/orders')} className="text-sm text-[var(--color-accent-gold)] hover:underline">View All →</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-6 py-3 text-gray-500 font-medium">Order ID</th>
                      <th className="text-left px-6 py-3 text-gray-500 font-medium">Customer</th>
                      <th className="text-left px-6 py-3 text-gray-500 font-medium">Date</th>
                      <th className="text-left px-6 py-3 text-gray-500 font-medium">Total</th>
                      <th className="text-left px-6 py-3 text-gray-500 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {orders.length === 0 ? (
                      <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-400">No orders yet.</td></tr>
                    ) : (
                      orders.slice(0, 5).map(order => (
                        <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 font-medium text-xs text-gray-500">{order._id.slice(-8).toUpperCase()}</td>
                          <td className="px-6 py-4">{order.shippingAddress?.name || order.user?.name || '—'}</td>
                          <td className="px-6 py-4 text-gray-500">{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                          <td className="px-6 py-4 font-medium">₹{(order.total || 0).toLocaleString()}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${STATUS_COLORS[order.orderStatus] || 'bg-gray-100 text-gray-700'}`}>
                              {order.orderStatus}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-serif text-gray-800">Products ({products.length})</h2>
              <button
                onClick={openAddModal}
                className="flex items-center gap-2 bg-[#1A1A1A] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-black transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Product
              </button>
            </div>

            {/* Product Modal */}
            {showProductModal && (
              <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl w-full max-w-2xl p-8 max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-serif text-xl">{isEditing ? 'Edit Product' : 'Add New Product'}</h3>
                    <button onClick={() => setShowProductModal(false)} className="text-gray-400 hover:text-black">
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  
                  <form onSubmit={handleSaveProduct} className="space-y-5">
                    
                    {/* Image Upload Area */}
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Product Images</label>
                      <p className="text-xs text-gray-500 mb-3">Upload a main front image and up to 3 different angles.</p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[
                          { label: 'Main Front', idx: 0 },
                          { label: 'Angle 1', idx: 1 },
                          { label: 'Angle 2', idx: 2 },
                          { label: 'Angle 3', idx: 3 },
                        ].map(slot => (
                          <div key={slot.idx} className="flex flex-col gap-1.5 text-center">
                            <span className="text-xs font-medium text-gray-700">{slot.label}</span>
                            <div 
                              onClick={() => !imagePreviews[slot.idx] && fileRefs[slot.idx].current?.click()}
                              className="w-full aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors overflow-hidden group relative"
                            >
                              {imagePreviews[slot.idx] ? (
                                <>
                                  <img src={imagePreviews[slot.idx]} alt={`Preview ${slot.idx}`} className="w-full h-full object-cover" />
                                  <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity gap-2">
                                    <button
                                      type="button"
                                      onClick={(e) => { e.stopPropagation(); fileRefs[slot.idx].current?.click(); }}
                                      className="p-2 bg-white rounded-full hover:bg-blue-50 text-blue-600 transition-colors"
                                      title="Change Image"
                                    >
                                      <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={(e) => { e.stopPropagation(); removeImage(slot.idx); }}
                                      className="p-2 bg-white rounded-full hover:bg-red-50 text-red-600 transition-colors"
                                      title="Remove Image"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </>
                              ) : (
                                <div className="text-gray-400">
                                  <ImageIcon className="w-6 h-6 mx-auto opacity-50" />
                                  <span className="text-[10px] font-medium mt-1 block">Upload</span>
                                </div>
                              )}
                            </div>
                            <input 
                              ref={fileRefs[slot.idx]}
                              type="file" 
                              accept="image/jpeg,image/png,image/webp"
                              className="hidden" 
                              onChange={(e) => handleImageChange(e, slot.idx)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label className="block text-sm font-medium mb-1.5">Product Name</label>
                        <input value={productForm.name} onChange={e => setProductForm(p => ({...p, name: e.target.value}))} required placeholder="e.g. Gold Chain Necklace" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-gray-400 transition-colors" />
                      </div>
                      
                      <div className="col-span-2">
                        <label className="block text-sm font-medium mb-1.5">Description</label>
                        <textarea value={productForm.description} onChange={e => setProductForm(p => ({...p, description: e.target.value}))} required rows="2" placeholder="Brief product description..." className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-gray-400 transition-colors resize-none" />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1.5">Category</label>
                        <select value={productForm.category} onChange={e => setProductForm(p => ({...p, category: e.target.value}))} required className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-gray-400 transition-colors bg-white">
                          <option value="">Select Category...</option>
                          {categories.map(cat => (
                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1.5">Stock Quantity</label>
                        <input type="number" value={productForm.stock} onChange={e => setProductForm(p => ({...p, stock: e.target.value}))} required min="0" placeholder="0" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-gray-400 transition-colors" />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1.5">Sale Price (₹)</label>
                        <input type="number" value={productForm.price} onChange={e => setProductForm(p => ({...p, price: e.target.value}))} required min="0" placeholder="999" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-gray-400 transition-colors" />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1.5">Original Price (₹) <span className="text-gray-400 font-normal">(Optional)</span></label>
                        <input type="number" value={productForm.originalPrice} onChange={e => setProductForm(p => ({...p, originalPrice: e.target.value}))} min="0" placeholder="1299" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-gray-400 transition-colors" />
                      </div>

                      <div className="col-span-2">
                        <label className="block text-sm font-medium mb-1.5">
                          🚚 Shipping Charge (₹)
                          <span className="ml-2 text-xs text-gray-400 font-normal">Enter 0 for Free Shipping</span>
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">₹</span>
                          <input
                            type="number"
                            value={productForm.shippingCharge}
                            onChange={e => setProductForm(p => ({...p, shippingCharge: e.target.value}))}
                            min="0"
                            placeholder="0"
                            className="w-full border border-gray-200 rounded-lg pl-8 pr-4 py-3 text-sm outline-none focus:border-gray-400 transition-colors"
                          />
                        </div>
                        <p className="text-xs text-gray-400 mt-1.5">
                          {Number(productForm.shippingCharge) === 0
                            ? '✅ Free Shipping — users will see FREE'
                            : `🚚 Users will see ₹${Number(productForm.shippingCharge).toLocaleString()} shipping charge`
                          }
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                      <button type="button" onClick={() => setShowProductModal(false)} disabled={savingProduct} className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50">Cancel</button>
                      <button type="submit" disabled={savingProduct} className="px-6 py-2.5 bg-[#1A1A1A] text-white rounded-lg text-sm font-medium hover:bg-black transition-colors disabled:opacity-70 flex items-center gap-2">
                        {savingProduct ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : null}
                        {isEditing ? 'Save Changes' : 'Add Product'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
              {loading ? (
                <div className="p-8 text-center text-gray-400">Loading products...</div>
              ) : products.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th className="text-left px-6 py-4 text-gray-500 font-medium">Product</th>
                        <th className="text-left px-6 py-4 text-gray-500 font-medium">Category</th>
                        <th className="text-left px-6 py-4 text-gray-500 font-medium">Price</th>
                        <th className="text-left px-6 py-4 text-gray-500 font-medium">Stock</th>
                        <th className="text-left px-6 py-4 text-gray-500 font-medium">Status</th>
                        <th className="text-left px-6 py-4 text-gray-500 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {products.map(product => {
                        const outOfStock = product.stock <= 0;
                        return (
                          <tr key={product._id} className="hover:bg-gray-50/50 transition-colors group">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden border border-gray-200">
                                  {product.images?.[0] ? (
                                    <img src={typeof product.images[0] === 'string' ? product.images[0] : product.images[0]?.url} alt={product.name} className="w-full h-full object-cover" />
                                  ) : (
                                    <Package className="w-5 h-5 m-auto text-gray-300 mt-2.5" />
                                  )}
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900 line-clamp-1">{product.name}</p>
                                  {product.originalPrice && <p className="text-xs text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</p>}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-gray-500">{product.category?.name || '—'}</td>
                            <td className="px-6 py-4 font-medium text-gray-900">₹{product.price.toLocaleString()}</td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold ${outOfStock ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-700'}`}>
                                {product.stock}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${outOfStock ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'}`}>
                                {outOfStock ? 'Out of Stock' : 'Active'}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => window.open(`/product/${product.slug}`, '_blank')} className="p-1.5 hover:bg-gray-100 rounded-md text-gray-500 transition-colors" title="View details">
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button onClick={() => openEditModal(product)} className="p-1.5 hover:bg-blue-50 rounded-md text-blue-500 transition-colors" title="Edit product">
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleDeleteProduct(product._id)} className="p-1.5 hover:bg-red-50 rounded-md text-red-500 transition-colors" title="Delete product">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-12 text-center">
                  <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No products found.</p>
                  <button onClick={openAddModal} className="mt-4 text-sm font-medium text-[var(--color-accent-gold)] hover:underline">
                    Add your first product
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-serif text-gray-800">Orders ({orders.length})</h2>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
              {loadingOrders ? (
                <div className="p-8 text-center text-gray-400">Loading orders...</div>
              ) : orders.length === 0 ? (
                <div className="p-12 text-center">
                  <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No orders yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left px-6 py-3 text-gray-500 font-medium">Order ID</th>
                        <th className="text-left px-6 py-3 text-gray-500 font-medium">Customer</th>
                        <th className="text-left px-6 py-3 text-gray-500 font-medium">Items</th>
                        <th className="text-left px-6 py-3 text-gray-500 font-medium">Date</th>
                        <th className="text-left px-6 py-3 text-gray-500 font-medium">Total</th>
                        <th className="text-left px-6 py-3 text-gray-500 font-medium">Payment</th>
                        <th className="text-left px-6 py-3 text-gray-500 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {orders.map(order => (
                        <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 font-mono text-xs text-gray-500">{order._id.slice(-8).toUpperCase()}</td>
                          <td className="px-6 py-4">
                            <p className="font-medium">{order.shippingAddress?.name || order.user?.name || '—'}</p>
                            <p className="text-xs text-gray-400">{order.shippingAddress?.email || order.user?.email || ''}</p>
                          </td>
                          <td className="px-6 py-4 text-gray-500">{order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}</td>
                          <td className="px-6 py-4 text-gray-500">{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                          <td className="px-6 py-4 font-semibold">₹{(order.total || 0).toLocaleString()}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                              order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' :
                              order.paymentStatus === 'failed' ? 'bg-red-100 text-red-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>{order.paymentStatus}</span>
                          </td>
                          <td className="px-6 py-4">
                            <select
                              value={order.orderStatus}
                              disabled={updatingOrderId === order._id}
                              onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                              className={`text-xs border rounded-lg px-2 py-1.5 capitalize focus:outline-none cursor-pointer ${
                                STATUS_COLORS[order.orderStatus] || 'bg-gray-100 text-gray-700'
                              } ${updatingOrderId === order._id ? 'opacity-50' : ''}`}
                            >
                              {['placed','confirmed','shipped','delivered','cancelled'].map(s => (
                                <option key={s} value={s} className="bg-white text-gray-800">{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Customers Tab */}
        {activeTab === 'customers' && (
          <div>
            <h2 className="text-2xl font-serif text-gray-800 mb-8">Customers</h2>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
              {loadingUsers ? (
                <div className="p-8 text-center text-gray-400">Loading customers...</div>
              ) : users.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left px-6 py-3 text-gray-500 font-medium">Name</th>
                        <th className="text-left px-6 py-3 text-gray-500 font-medium">Email</th>
                        <th className="text-left px-6 py-3 text-gray-500 font-medium">Role</th>
                        <th className="text-left px-6 py-3 text-gray-500 font-medium">Joined Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {users.map(user => (
                        <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-200 shrink-0">
                                {user.profileImage ? (
                                  <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                                ) : (
                                  <span className="text-sm font-bold text-gray-500 uppercase">{user.name.charAt(0)}</span>
                                )}
                              </div>
                              <span className="font-medium">{user.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">{user.email}</td>
                          <td className="px-6 py-4"><span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">{user.role}</span></td>
                          <td className="px-6 py-4 text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 text-center text-gray-400">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p>No customers found.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-serif text-gray-800">Categories</h2>
              <button onClick={handleAddCategoryClick} className="bg-[#1A1A1A] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-black transition-colors flex items-center gap-2 shadow-sm">
                <Plus className="w-4 h-4" /> Add Category
              </button>
            </div>
            
            {showCategoryModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                  <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h3 className="text-xl font-serif">{categoryForm.id ? 'Edit Category' : 'Add New Category'}</h3>
                    <button onClick={() => setShowCategoryModal(false)} className="text-gray-400 hover:bg-gray-100 p-2 rounded-full transition-colors"><X className="w-5 h-5" /></button>
                  </div>
                  <form onSubmit={handleSaveCategory} className="p-6">
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category Name</label>
                      <input
                        type="text"
                        required
                        value={categoryForm.name}
                        onChange={e => setCategoryForm({ ...categoryForm, name: e.target.value })}
                        className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-gray-400 transition-colors"
                        placeholder="e.g. Necklaces"
                        autoFocus
                      />
                    </div>
                    <div className="flex justify-end gap-3">
                      <button type="button" onClick={() => setShowCategoryModal(false)} disabled={savingCategory} className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50">Cancel</button>
                      <button type="submit" disabled={savingCategory} className="px-6 py-2.5 bg-[#1A1A1A] text-white rounded-lg text-sm font-medium hover:bg-black transition-colors disabled:opacity-70 flex items-center gap-2">
                        {savingCategory ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : null}
                        {categoryForm.id ? 'Save Changes' : 'Add Category'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {categories.map(cat => (
                <div key={cat._id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 text-center relative group">
                  <p className="font-medium text-gray-800 mb-1">{cat.name}</p>
                  <p className="text-xs text-gray-400">Active</p>
                  <div className="flex justify-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEditCategoryClick(cat._id, cat.name)} className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-400 transition-colors" title="Edit">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteCategory(cat._id, cat.name)} className="p-1.5 hover:bg-red-50 rounded-lg text-red-400 transition-colors" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl">
            <h2 className="text-2xl font-serif text-gray-800 mb-8">My Profile</h2>

            {/* Avatar Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 mb-6 flex flex-col items-center">
              <div className="relative mb-4">
                <div className="w-28 h-28 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg flex items-center justify-center">
                  {adminProfile.profileImage
                    ? <img src={adminProfile.profileImage} alt="Admin" className="w-full h-full object-cover" />
                    : <UserCircle2 className="w-16 h-16 text-gray-300" />}
                </div>
                <button
                  onClick={() => avatarInputRef.current?.click()}
                  disabled={uploadingAvatar}
                  className="absolute bottom-0 right-0 w-9 h-9 bg-[#1A1A1A] text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors shadow-md disabled:opacity-50"
                >
                  {uploadingAvatar
                    ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    : <Camera className="w-4 h-4" />}
                </button>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">{adminProfile.name || 'Admin'}</h3>
              <p className="text-sm text-gray-400">{adminProfile.email}</p>
              <span className="mt-2 px-3 py-1 bg-[#1A1A1A] text-white text-xs rounded-full font-medium">Administrator</span>
            </div>

            {/* Edit Form */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
              <h3 className="font-semibold text-gray-800 mb-6">Edit Information</h3>
              <form onSubmit={handleSaveProfile} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={e => setProfileForm(p => ({ ...p, name: e.target.value }))}
                    required
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-gray-400 transition-colors"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={e => setProfileForm(p => ({ ...p, email: e.target.value }))}
                    required
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-gray-400 transition-colors"
                    placeholder="admin@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone <span className="text-gray-400 font-normal">(Optional)</span></label>
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={e => setProfileForm(p => ({ ...p, phone: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-gray-400 transition-colors"
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>

                {profileSuccess && (
                  <div className="flex items-center gap-2 text-green-700 bg-green-50 p-3 rounded-lg text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Profile updated successfully!
                  </div>
                )}

                <button
                  type="submit"
                  disabled={savingProfile}
                  className="flex items-center gap-2 bg-[#1A1A1A] text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  {savingProfile
                    ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    : <Save className="w-4 h-4" />}
                  Save Changes
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Access Control Tab */}
        {activeTab === 'access' && (
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#0F172A] rounded-xl flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#0F172A] uppercase tracking-wide">Administrator Access Control</h2>
                  <p className="text-sm text-gray-500">Manage users with full administrative privileges.</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 items-start">
              {/* Add New Admin Form */}
              <div className="w-full lg:w-1/3 bg-white rounded-[24px] p-8 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-8">
                  <UserPlus className="w-6 h-6 text-gray-800" />
                  <h3 className="text-xl font-bold text-gray-800">Add New Admin</h3>
                </div>
                
                <form onSubmit={handleAddAdmin} className="space-y-6">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <input
                        type="email"
                        required
                        value={newAdminForm.email}
                        onChange={e => setNewAdminForm(p => ({ ...p, email: e.target.value }))}
                        className="w-full bg-gray-50/50 border-none rounded-xl pl-11 pr-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-[#0F172A]/10 transition-shadow placeholder:text-gray-400"
                        placeholder="admin@company.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Full Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <UserCircle2 className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        required
                        value={newAdminForm.name}
                        onChange={e => setNewAdminForm(p => ({ ...p, name: e.target.value }))}
                        className="w-full bg-gray-50/50 border-none rounded-xl pl-11 pr-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-[#0F172A]/10 transition-shadow placeholder:text-gray-400"
                        placeholder="Admin Name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Temporary Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        required
                        value={newAdminForm.password}
                        onChange={e => setNewAdminForm(p => ({ ...p, password: e.target.value }))}
                        className="w-full bg-gray-50/50 border-none rounded-xl pl-11 pr-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-[#0F172A]/10 transition-shadow placeholder:text-gray-400"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={addingAdmin}
                    className="w-full bg-[#0F172A] text-white py-4 rounded-xl text-xs font-bold tracking-widest uppercase hover:bg-gray-800 transition-colors disabled:opacity-50 mt-4 shadow-[0_8px_16px_-6px_rgba(15,23,42,0.3)]"
                  >
                    {addingAdmin ? 'Adding...' : 'Grant Admin Access'}
                  </button>
                </form>
              </div>

              {/* Active Administrators List */}
              <div className="w-full lg:w-2/3 bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider">Active Administrators</h3>
                  <span className="px-3 py-1 bg-gray-50 text-gray-500 rounded-full text-xs font-medium border border-gray-100">
                    {adminsList.length} ACCOUNTS
                  </span>
                </div>
                
                <div className="divide-y divide-gray-50">
                  {adminsList.map(admin => (
                    <div key={admin._id} className="p-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center font-bold text-lg border border-gray-200">
                          {admin.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-gray-800">{admin.name}</p>
                            {adminProfile._id === admin._id && (
                              <span className="px-1.5 py-0.5 bg-green-50 text-green-600 text-[10px] font-bold rounded uppercase tracking-wider">YOU</span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">{admin.email}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6">
                        <div className="text-right hidden sm:block">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Created</p>
                          <p className="text-sm text-gray-600 font-medium">{new Date(admin.createdAt).toLocaleDateString('en-GB')}</p>
                        </div>
                        <div className="flex gap-1">
                          <button 
                            onClick={() => handleUpdatePassword(admin._id, admin.name)}
                            className="p-2 text-gray-300 hover:text-blue-500 transition-colors"
                            title="Change Password"
                          >
                            <Key className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => handleDeleteAdmin(admin._id)}
                            disabled={adminProfile._id === admin._id}
                            className="p-2 text-gray-300 hover:text-red-500 transition-colors disabled:opacity-0 disabled:pointer-events-none"
                            title="Remove Admin"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        </div>
      </main>
    </div>
  );
};

export default Admin;
