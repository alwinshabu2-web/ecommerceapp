import { useState, useRef, useEffect, useMemo } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Search, Menu, X, Leaf, Package, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { products } from '../data/products';
import { formatPrice } from '../utils/helpers';

export default function Navbar() {
  const { itemCount } = useCart();
  const { wishlistCount } = useWishlist();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const searchContainerRef = useRef(null);

  // Live search suggestions
  const searchSuggestions = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q || q.length < 2) return [];
    return products
      .filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      )
      .slice(0, 5);
  }, [searchQuery]);

  // Close menu and search suggestions on outside click
  useEffect(() => {
    function handler(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setSearchFocused(false);
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
      setSearchFocused(false);
      setMenuOpen(false);
    }
  }

  function handleSelectSuggestion(product) {
    navigate(`/products/${product.id}`);
    setSearchQuery('');
    setSearchFocused(false);
    setMenuOpen(false);
  }

  const navLinkClass = ({ isActive }) =>
    `text-sm font-semibold transition-colors duration-200 ${
      isActive
        ? 'text-primary-600'
        : 'text-gray-700 hover:text-primary-600'
    }`;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 flex-shrink-0 focus-visible:ring-2 focus-visible:ring-primary-500 rounded-lg group"
            aria-label="EcoConstruct Pro — Home"
          >
            <div className="bg-primary-600 text-white p-1.5 rounded-xl group-hover:scale-105 transition-transform">
              <Leaf className="w-5 h-5" />
            </div>
            <span className="font-bold text-gray-900 text-lg leading-tight tracking-tight hidden sm:block">
              EcoConstruct<span className="text-primary-600"> Pro</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink to="/" end className={navLinkClass}>Home</NavLink>
            <NavLink to="/products" className={navLinkClass}>Catalog</NavLink>
            <NavLink to="/wishlist" className={navLinkClass}>Wishlist</NavLink>
            <NavLink to="/orders" className={navLinkClass}>My Orders</NavLink>
            <NavLink to="/about" className={navLinkClass}>About Us</NavLink>
          </div>

          {/* Search + Icons */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Search (Desktop) */}
            <div ref={searchContainerRef} className="relative hidden sm:block">
              <form onSubmit={handleSearch} role="search" className="flex items-center">
                <div className="relative">
                  <label htmlFor="nav-search" className="sr-only">Search products</label>
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input
                    id="nav-search"
                    type="search"
                    value={searchQuery}
                    onChange={e => {
                      setSearchQuery(e.target.value);
                      setSearchFocused(true);
                    }}
                    onFocus={() => setSearchFocused(true)}
                    placeholder="Search eco materials…"
                    className="pl-9 pr-4 py-2 text-sm bg-gray-100 hover:bg-gray-200/60 rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white w-52 md:w-64 transition-all duration-200"
                  />
                </div>
              </form>

              {/* Instant Search Suggestions Dropdown */}
              {searchFocused && searchQuery.trim().length >= 2 && (
                <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 overflow-hidden animate-slide-down min-w-[280px]">
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                    {searchSuggestions.length > 0 ? 'Suggested Products' : 'No exact matches'}
                  </div>
                  {searchSuggestions.map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectSuggestion(item)}
                      className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors"
                    >
                      <img
                        src={item.images?.[0]?.url || '/images/fallback-product.svg'}
                        alt=""
                        className="w-9 h-9 rounded-lg object-cover bg-gray-100 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-900 truncate">{item.name}</p>
                        <p className="text-[11px] text-gray-500">{item.category}</p>
                      </div>
                      <span className="text-xs font-bold text-primary-600 flex-shrink-0">
                        {formatPrice(item.price)}
                      </span>
                    </button>
                  ))}

                  <div className="pt-2 border-t border-gray-100 mt-1 px-3">
                    <button
                      type="button"
                      onClick={handleSearch}
                      className="w-full py-1.5 text-xs text-center font-semibold text-primary-600 hover:text-primary-700 flex items-center justify-center gap-1"
                    >
                      View all results for "{searchQuery}" <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* My Orders (Quick Desktop Icon) */}
            <Link
              to="/orders"
              aria-label="My Orders"
              title="My Orders"
              className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-primary-500"
            >
              <Package className="w-5 h-5" />
            </Link>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              aria-label={`Wishlist, ${wishlistCount} saved item${wishlistCount !== 1 ? 's' : ''}`}
              title="Saved Wishlist"
              className="relative p-2 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-primary-500"
            >
              <Heart className={`w-5 h-5 ${wishlistCount > 0 ? 'text-rose-600 fill-rose-100' : ''}`} />
              {wishlistCount > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 animate-scale-in shadow-sm"
                >
                  {wishlistCount > 99 ? '99+' : wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              aria-label={`Shopping cart, ${itemCount} item${itemCount !== 1 ? 's' : ''}`}
              title="Shopping Cart"
              className="relative p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-primary-500"
            >
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-primary-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 animate-scale-in shadow-sm"
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

        {/* Mobile Dropdown Menu */}
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
                Catalog & Materials
              </NavLink>
              <NavLink
                to="/wishlist"
                className={({ isActive }) =>
                  `px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center justify-between ${
                    isActive ? 'bg-primary-50 text-primary-600' : 'text-gray-700 hover:bg-gray-50'
                  }`
                }
                onClick={() => setMenuOpen(false)}
              >
                <span>Saved Wishlist</span>
                {wishlistCount > 0 && (
                  <span className="bg-rose-100 text-rose-700 text-xs font-bold px-2 py-0.5 rounded-full">
                    {wishlistCount}
                  </span>
                )}
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
                My Orders & Tracking
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
                About EcoConstruct Pro
              </NavLink>

              {/* Mobile Search */}
              <form onSubmit={handleSearch} role="search" className="mt-3 px-2">
                <label htmlFor="mobile-search" className="sr-only">Search products</label>
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    id="mobile-search"
                    type="search"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search eco materials…"
                    className="w-full pl-9 pr-4 py-2.5 text-sm bg-gray-100 rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white"
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
