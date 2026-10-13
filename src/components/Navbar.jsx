import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Search, Menu, X, Leaf, Package } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { itemCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const menuRef = useRef(null);

  // Close menu on outside click
  useEffect(() => {
    function handler(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  function handleSearch(e) {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMenuOpen(false);
    }
  }

  const navLinkClass = ({ isActive }) =>
    `text-sm font-semibold transition-colors duration-200 ${
      isActive
        ? 'text-primary-600'
        : 'text-gray-700 hover:text-primary-600'
    }`;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 flex-shrink-0 focus-visible:ring-2 focus-visible:ring-primary-500 rounded-lg"
            aria-label="EcoConstruct Pro — Home"
          >
            <div className="bg-primary-600 text-white p-1.5 rounded-lg">
              <Leaf className="w-5 h-5" />
            </div>
            <span className="font-bold text-gray-900 text-lg leading-tight hidden sm:block">
              EcoConstruct<span className="text-primary-600"> Pro</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink to="/" end className={navLinkClass}>Home</NavLink>
            <NavLink to="/products" className={navLinkClass}>Products</NavLink>
            <NavLink to="/orders" className={navLinkClass}>My Orders</NavLink>
            <NavLink to="/about" className={navLinkClass}>About Us</NavLink>
          </div>

          {/* Search + Icons */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Search */}
            <form onSubmit={handleSearch} role="search" className="hidden sm:flex items-center">
              <div className="relative">
                <label htmlFor="nav-search" className="sr-only">Search products</label>
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  id="nav-search"
                  type="search"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search products…"
                  className="pl-9 pr-4 py-2 text-sm bg-gray-100 rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white w-48 transition-all duration-200"
                />
              </div>
            </form>

            {/* My Orders (Quick Desktop Icon) */}
            <Link
              to="/orders"
              aria-label="My Orders"
              title="My Orders"
              className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-primary-500"
            >
              <Package className="w-5 h-5" />
            </Link>

            {/* Wishlist (decorative) */}
            <Link
              to="/products"
              aria-label="Wishlist"
              className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-primary-500"
            >
              <Heart className="w-5 h-5" />
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              aria-label={`Shopping cart, ${itemCount} item${itemCount !== 1 ? 's' : ''}`}
              className="relative p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-primary-500"
            >
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-primary-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 animate-scale-in"
                >
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMenuOpen(o => !o)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              className="md:hidden p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-primary-500"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div
            id="mobile-menu"
            ref={menuRef}
            className="md:hidden py-4 border-t border-gray-100 animate-slide-down"
          >
            <div className="flex flex-col gap-1">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                    isActive ? 'bg-primary-50 text-primary-600' : 'text-gray-700 hover:bg-gray-50'
                  }`
                }
                onClick={() => setMenuOpen(false)}
              >
                Home
              </NavLink>
              <NavLink
                to="/products"
                className={({ isActive }) =>
                  `px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                    isActive ? 'bg-primary-50 text-primary-600' : 'text-gray-700 hover:bg-gray-50'
                  }`
                }
                onClick={() => setMenuOpen(false)}
              >
                Products
              </NavLink>
              <NavLink
                to="/orders"
                className={({ isActive }) =>
                  `px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                    isActive ? 'bg-primary-50 text-primary-600' : 'text-gray-700 hover:bg-gray-50'
                  }`
                }
                onClick={() => setMenuOpen(false)}
              >
                My Orders
              </NavLink>
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                    isActive ? 'bg-primary-50 text-primary-600' : 'text-gray-700 hover:bg-gray-50'
                  }`
                }
                onClick={() => setMenuOpen(false)}
              >
                About Us
              </NavLink>

              {/* Mobile Search */}
              <form onSubmit={handleSearch} role="search" className="mt-2 px-4">
                <label htmlFor="mobile-search" className="sr-only">Search products</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    id="mobile-search"
                    type="search"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search products…"
                    className="w-full pl-9 pr-4 py-2.5 text-sm bg-gray-100 rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </form>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
