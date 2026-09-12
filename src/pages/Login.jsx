import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [tab, setTab] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (tab === 'admin') {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: form.email, password: form.password })
        });
        const data = await response.json();
        
        if (response.ok) {
          if (data.role !== 'admin') {
            alert('Access denied. You are not an admin.');
            return;
          }
          if (data.token) sessionStorage.setItem('token', data.token);
          if (data.name) sessionStorage.setItem('userName', data.name);
          if (data.profileImage) sessionStorage.setItem('userAvatar', data.profileImage);
          sessionStorage.setItem('isAdminAuthenticated', 'true');
          navigate('/admin');
        } else {
          alert(`Error: ${data.message || 'Invalid admin credentials'}`);
        }
      } catch (err) {
        alert(`Error connecting to server: ${err.message}`);
      }
      return;
    }

    try {
      const endpoint = tab === 'login' ? '/api/auth/login' : '/api/auth/register';
      const response = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await response.json();
      
      if (response.ok) {
        if (data.token) sessionStorage.setItem('token', data.token);
        if (data.name) sessionStorage.setItem('userName', data.name);
        if (data.profileImage) sessionStorage.setItem('userAvatar', data.profileImage);
        navigate('/');
      } else {
        alert(`Error: ${data.message || 'Something went wrong'}`);
      }
    } catch (err) {
      alert(`Error connecting to server: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-primary-cream)] flex items-center justify-center py-16 px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-md p-8">
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-serif tracking-tight">
            ANTI-TARNISH ✨
          </Link>
          <p className="text-xs tracking-[0.2em] text-[var(--color-text-muted)] uppercase mt-1">Jewellery That Lasts</p>
        </div>

        {/* Tabs */}
        <div className="flex mb-8 border-b border-gray-200">
          <button
            onClick={() => setTab('login')}
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
              tab === 'login' ? 'border-[#1A1A1A] text-[#1A1A1A]' : 'border-transparent text-gray-500'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setTab('register')}
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
              tab === 'register' ? 'border-[#1A1A1A] text-[#1A1A1A]' : 'border-transparent text-gray-500'
            }`}
          >
            Register
          </button>
          <button
            onClick={() => setTab('admin')}
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
              tab === 'admin' ? 'border-[#1A1A1A] text-[#1A1A1A]' : 'border-transparent text-gray-500'
            }`}
          >
            Admin
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {tab === 'register' && (
            <div>
              <label className="block text-sm font-medium mb-1.5">Full Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Your name"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-[var(--color-text-dark)] transition-colors"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-1.5">Email Address</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder={tab === 'admin' ? "admin email" : "you@email.com"}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-[var(--color-text-dark)] transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder={tab === 'admin' ? "Enter admin password" : "••••••••"}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-[var(--color-text-dark)] transition-colors"
            />
          </div>
          <button
            type="submit"
            className="w-full py-4 bg-[#1A1A1A] text-white font-medium rounded-lg hover:bg-black transition-colors mt-2"
          >
            {tab === 'login' ? 'Login' : tab === 'admin' ? 'Admin Login' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
