import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Edit3, Save, X, User, Mail, Phone, LogOut, ShoppingBag, Heart } from 'lucide-react';

const API = 'http://localhost:5000';

const Profile = () => {
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [previewImg, setPreviewImg] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${API}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) { navigate('/login'); return; }
      const data = await res.json();
      setUser(data);
      setForm({ name: data.name || '', email: data.email || '', phone: data.phone || '' });
      if (data.profileImage) setPreviewImg(data.profileImage);
    } catch {
      setError('Failed to load profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError(''); setSuccess('');
    try {
      const res = await fetch(`${API}/api/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data);
        localStorage.setItem('userName', data.name);
        setSuccess('Profile updated successfully!');
        setEditing(false);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.message || 'Failed to update.');
      }
    } catch {
      setError('Server error. Try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Local preview immediately
    const localUrl = URL.createObjectURL(file);
    setPreviewImg(localUrl);

    setUploadingImg(true);
    setError(''); setSuccess('');
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      const res = await fetch(`${API}/api/profile/avatar`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data);
        setPreviewImg(data.profileImage);
        localStorage.setItem('userAvatar', data.profileImage);
        setSuccess('Profile photo updated!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.message || 'Upload failed.');
        setPreviewImg(user?.profileImage || null);
      }
    } catch {
      setError('Upload failed. Check connection.');
      setPreviewImg(user?.profileImage || null);
    } finally {
      setUploadingImg(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userAvatar');
    navigate('/login');
  };

  const initials = user?.name
    ? user.name.trim().split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : 'U';

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-primary-cream)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-[#1A1A1A] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-primary-cream)] py-12 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-serif text-[#1A1A1A]">My Profile</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1 tracking-wide">Manage your account details</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

          {/* Avatar Section */}
          <div className="bg-gradient-to-br from-[#1A1A1A] to-[#3a3a3a] py-12 flex flex-col items-center">
            <div className="relative group">
              {/* Avatar circle */}
              <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-lg">
                {previewImg ? (
                  <img
                    src={previewImg}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-[var(--color-accent-gold)] flex items-center justify-center">
                    <span className="text-3xl font-bold text-white">{initials}</span>
                  </div>
                )}
              </div>

              {/* Camera overlay */}
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploadingImg}
                className="absolute inset-0 rounded-full flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                title="Change photo"
              >
                {uploadingImg ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Camera className="w-6 h-6 text-white" />
                )}
              </button>

              {/* Upload badge */}
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploadingImg}
                className="absolute -bottom-1 -right-1 bg-white rounded-full p-1.5 shadow-md hover:bg-gray-50 transition-colors"
              >
                <Camera className="w-4 h-4 text-[#1A1A1A]" />
              </button>

              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>

            <h2 className="text-white font-serif text-xl mt-5">{user?.name}</h2>
            <p className="text-gray-400 text-sm mt-1">{user?.email}</p>

            {uploadingImg && (
              <p className="text-gray-300 text-xs mt-2 animate-pulse">Uploading photo...</p>
            )}
          </div>

          {/* Alerts */}
          {(error || success) && (
            <div className={`mx-6 mt-6 px-4 py-3 rounded-lg text-sm ${error ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'}`}>
              {error || success}
            </div>
          )}

          {/* Form Section */}
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-serif text-lg text-[#1A1A1A]">Personal Information</h3>
              {!editing ? (
                <button
                  onClick={() => { setEditing(true); setError(''); setSuccess(''); }}
                  className="flex items-center gap-1.5 text-sm text-[#1A1A1A] border border-gray-200 rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => { setEditing(false); setForm({ name: user.name, email: user.email, phone: user.phone || '' }); setError(''); }}
                    className="flex items-center gap-1.5 text-sm text-gray-500 border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-50 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-1.5 text-sm bg-[#1A1A1A] text-white rounded-lg px-4 py-2 hover:bg-black transition-colors disabled:opacity-60"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-5">
              {/* Full Name */}
              <div>
                <label className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  <User className="w-3.5 h-3.5" />
                  Full Name
                </label>
                {editing ? (
                  <input
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-[#1A1A1A] transition-colors bg-white"
                    placeholder="Your full name"
                  />
                ) : (
                  <p className="text-[#1A1A1A] font-medium px-4 py-3 bg-gray-50 rounded-lg text-sm">{user?.name || '—'}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  <Mail className="w-3.5 h-3.5" />
                  Email Address
                </label>
                {editing ? (
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-[#1A1A1A] transition-colors bg-white"
                    placeholder="your@email.com"
                  />
                ) : (
                  <p className="text-[#1A1A1A] font-medium px-4 py-3 bg-gray-50 rounded-lg text-sm">{user?.email || '—'}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  <Phone className="w-3.5 h-3.5" />
                  Phone Number
                </label>
                {editing ? (
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-[#1A1A1A] transition-colors bg-white"
                    placeholder="+91 98765 43210"
                  />
                ) : (
                  <p className="text-[#1A1A1A] font-medium px-4 py-3 bg-gray-50 rounded-lg text-sm">{user?.phone || 'Not added yet'}</p>
                )}
              </div>
            </div>

            {/* Quick Links */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <h3 className="font-serif text-lg text-[#1A1A1A] mb-4">Quick Links</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => navigate('/cart')}
                  className="flex items-center gap-3 p-4 border border-gray-100 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all text-left group"
                >
                  <span className="w-9 h-9 bg-gray-100 group-hover:bg-[#1A1A1A] rounded-full flex items-center justify-center transition-colors">
                    <ShoppingBag className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-[#1A1A1A]">My Cart</p>
                    <p className="text-xs text-gray-400">View items</p>
                  </div>
                </button>
                <button
                  onClick={() => navigate('/wishlist')}
                  className="flex items-center gap-3 p-4 border border-gray-100 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all text-left group"
                >
                  <span className="w-9 h-9 bg-gray-100 group-hover:bg-red-500 rounded-full flex items-center justify-center transition-colors">
                    <Heart className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-[#1A1A1A]">Wishlist</p>
                    <p className="text-xs text-gray-400">Saved items</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="mt-6 w-full flex items-center justify-center gap-2 py-3 border border-red-100 text-red-500 rounded-xl hover:bg-red-50 transition-colors text-sm font-medium"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>

        {/* Member since */}
        {user?.createdAt && (
          <p className="text-center text-xs text-gray-400 mt-6">
            Member since {new Date(user.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long' })}
          </p>
        )}
      </div>
    </div>
  );
};

export default Profile;
