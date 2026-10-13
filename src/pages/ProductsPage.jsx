import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import {
  SlidersHorizontal, X, Search, Filter, LayoutGrid, List,
  ArrowUpDown, Star, Recycle, ShoppingCart, Eye, Heart
} from 'lucide-react';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { formatPrice } from '../utils/helpers';

const ALL_CATEGORIES = ['Timber & Wood', 'Insulation', 'Roofing', 'Bamboo', 'Composites', 'Home & Garden'];
const MAX_PRICE = 10000;

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  // Filter state — initialize from URL params
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);
  const [minEcoRating, setMinEcoRating] = useState(0);
  const [stockFilter, setStockFilter] = useState('all'); // all | instock | lowstock

  // Sync search from URL
  useEffect(() => {
    const q = searchParams.get('search');
    if (q !== null) setSearch(q);
    const cat = searchParams.get('category');
    if (cat !== null) setCategory(cat);
  }, [searchParams]);

  // Derived filtered & sorted list
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    let result = products.filter(p => {
      if (q && !p.name.toLowerCase().includes(q) && !p.description.toLowerCase().includes(q) && !p.category.toLowerCase().includes(q)) return false;
      if (category && p.category !== category) return false;
      if (p.price > maxPrice) return false;
      if (p.ecoRating < minEcoRating) return false;
      if (stockFilter === 'instock' && p.stock !== 'In Stock') return false;
      if (stockFilter === 'lowstock' && p.stock !== 'Low Stock') return false;
      return true;
    });

    // Sorting
    switch (sortBy) {
      case 'price_asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'eco_desc':
        result.sort((a, b) => b.ecoRating - a.ecoRating);
        break;
      case 'name_asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'featured':
      default:
        // Featured products first, then others
        result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        break;
    }

    return result;
  }, [search, category, maxPrice, minEcoRating, stockFilter, sortBy]);

  function clearFilters() {
    setSearch('');
    setCategory('');
    setMaxPrice(MAX_PRICE);
    setMinEcoRating(0);
    setStockFilter('all');
    setSearchParams({});
  }

  const hasActiveFilters = search || category || maxPrice < MAX_PRICE || minEcoRating > 0 || stockFilter !== 'all';

  return (
    <main className="min-h-screen bg-gray-50 pb-12">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Sustainable Building Materials</h1>
              <p className="text-gray-500 text-sm mt-1">
                Showing {filtered.length} curated material{filtered.length !== 1 ? 's' : ''}
                {category ? ` in "${category}"` : ''}
                {search ? ` matching "${search}"` : ''}
              </p>
            </div>

            {/* Quick Category Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full no-scrollbar">
              <button
                type="button"
                onClick={() => setCategory('')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  category === ''
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              {ALL_CATEGORIES.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(category === cat ? '' : cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    category === cat
                      ? 'bg-primary-600 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar filters — desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <FilterPanel
              search={search} setSearch={setSearch}
              category={category} setCategory={setCategory}
              maxPrice={maxPrice} setMaxPrice={setMaxPrice}
              minEcoRating={minEcoRating} setMinEcoRating={setMinEcoRating}
              stockFilter={stockFilter} setStockFilter={setStockFilter}
              clearFilters={clearFilters}
              hasActiveFilters={hasActiveFilters}
            />
          </aside>

          {/* Products area */}
          <div className="flex-1 min-w-0">
            {/* Top Toolbar: Search, Filters Trigger, Sort & View Mode */}
            <div className="bg-white rounded-2xl border border-gray-100 p-3 sm:p-4 mb-6 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Mobile search & filter toggle */}
              <div className="flex items-center gap-2 flex-1">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="search"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search materials…"
                    aria-label="Search products"
                    className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50 focus:bg-white"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setFiltersOpen(true)}
                  className="lg:hidden flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-xl px-3.5 py-2 text-sm font-semibold text-gray-700 transition-colors"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                  {hasActiveFilters && (
                    <span className="bg-primary-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                      !
                    </span>
                  )}
                </button>
              </div>

              {/* Sorting & Layout mode switcher */}
              <div className="flex items-center justify-between sm:justify-end gap-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <ArrowUpDown className="w-4 h-4 text-gray-400 hidden sm:block" />
                  <label htmlFor="sort-select" className="sr-only">Sort By</label>
                  <select
                    id="sort-select"
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                    className="bg-gray-50 border border-gray-200 text-gray-800 text-xs sm:text-sm rounded-xl px-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="featured">Featured First</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="eco_desc">Highest Eco-Rating</option>
                    <option value="name_asc">Name: A to Z</option>
                  </select>
                </div>

                {/* Grid / List view toggle */}
                <div className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200">
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    aria-label="Grid View"
                    className={`p-1.5 rounded-lg transition-colors ${
                      viewMode === 'grid' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('list')}
                    aria-label="List View"
                    className={`p-1.5 rounded-lg transition-colors ${
                      viewMode === 'list' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Active filter tags */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mb-5 items-center">
                <span className="text-xs font-semibold text-gray-400">Active filters:</span>
                {search && <FilterTag label={`Search: "${search}"`} onRemove={() => setSearch('')} />}
                {category && <FilterTag label={category} onRemove={() => setCategory('')} />}
                {maxPrice < MAX_PRICE && <FilterTag label={`Up to ₹${maxPrice.toLocaleString('en-IN')}`} onRemove={() => setMaxPrice(MAX_PRICE)} />}
                {minEcoRating > 0 && <FilterTag label={`Eco ≥ ${minEcoRating}★`} onRemove={() => setMinEcoRating(0)} />}
                {stockFilter !== 'all' && <FilterTag label={stockFilter === 'instock' ? 'In Stock' : 'Low Stock'} onRemove={() => setStockFilter('all')} />}
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-xs text-red-500 hover:text-red-700 font-semibold px-2 py-1 ml-1"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Products display */}
            {filtered.length === 0 ? (
              <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center shadow-sm">
                <p className="text-5xl mb-4">🌿</p>
                <h2 className="text-xl font-bold text-gray-900 mb-2">No matching materials found</h2>
                <p className="text-gray-500 max-w-sm mx-auto mb-6 text-sm">
                  We couldn't find any eco-materials matching your filter settings. Try adjusting your search term or clearing filters.
                </p>
                <button type="button" onClick={clearFilters} className="btn-primary">
                  Reset All Filters
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            ) : (
              <div className="space-y-4">
                {filtered.map(p => <ProductListItem key={p.id} product={p} />)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {filtersOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={() => setFiltersOpen(false)}
            aria-hidden="true"
          />
          <div className="fixed inset-y-0 right-0 w-80 max-w-full bg-white z-50 shadow-2xl overflow-y-auto p-6 lg:hidden animate-slide-down">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-primary-600" /> Filters
              </h2>
              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                aria-label="Close filters"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-primary-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <FilterPanel
              search={search} setSearch={setSearch}
              category={category} setCategory={setCategory}
              maxPrice={maxPrice} setMaxPrice={setMaxPrice}
              minEcoRating={minEcoRating} setMinEcoRating={setMinEcoRating}
              stockFilter={stockFilter} setStockFilter={setStockFilter}
              clearFilters={clearFilters}
              hasActiveFilters={hasActiveFilters}
            />
            <button
              type="button"
              onClick={() => setFiltersOpen(false)}
              className="btn-primary w-full justify-center mt-6"
            >
              Show {filtered.length} Materials
            </button>
          </div>
        </>
      )}
    </main>
  );
}

// ── Product List Item View ───────────────────────────────────────────────────

function ProductListItem({ product }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const wishlisted = isInWishlist(product.id);
  const isOutOfStock = product.stock === 'Out of Stock';

  function handleAddToCart(e) {
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product);
    addToast({ message: `"${product.name}" added to cart!`, type: 'success' });
  }

  function handleToggleWishlist(e) {
    e.stopPropagation();
    toggleWishlist(product);
    if (!wishlisted) {
      addToast({ message: `Saved "${product.name}" to wishlist!`, type: 'success' });
    } else {
      addToast({ message: `Removed "${product.name}" from wishlist.`, type: 'info' });
    }
  }

  return (
    <article
      onClick={() => navigate(`/products/${product.id}`)}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-5 cursor-pointer transition-all hover:border-primary-100"
    >
      <div className="relative w-full sm:w-44 h-36 sm:h-36 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
        <img
          src={product.images?.[0]?.url || '/images/fallback-product.svg'}
          alt=""
          className="w-full h-full object-cover"
        />
        {product.isRecycled && (
          <span className="absolute top-2 left-2 eco-badge text-[10px]">
            <Recycle className="w-3 h-3" /> Recycled
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0 space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-primary-600 uppercase tracking-wider">{product.category}</span>
          <span className="text-gray-300">•</span>
          <div className="flex items-center gap-1 text-xs text-amber-500 font-semibold">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span>{product.ecoRating}/5 Eco</span>
          </div>
        </div>

        <h3 className="font-bold text-gray-900 text-base leading-snug hover:text-primary-600 transition-colors">
          {product.name}
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        <div className="pt-1 flex items-center gap-3">
          <span className="text-xl font-bold text-gray-900">{formatPrice(product.price)}</span>
          <span className="text-xs text-gray-500">{product.unit}</span>
          {isOutOfStock ? (
            <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">Out of Stock</span>
          ) : (
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">In Stock</span>
          )}
        </div>
      </div>

      <div className="flex sm:flex-col items-center gap-2 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`btn-primary text-xs py-2.5 px-4 justify-center w-full sm:w-auto ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          Add to Cart
        </button>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleToggleWishlist}
            aria-label="Wishlist"
            className={`p-2.5 rounded-xl border transition-colors ${
              wishlisted ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-gray-50 border-gray-200 text-gray-500 hover:text-rose-500'
            }`}
          >
            <Heart className={`w-4 h-4 ${wishlisted ? 'fill-rose-500' : ''}`} />
          </button>
          <Link
            to={`/products/${product.id}`}
            onClick={e => e.stopPropagation()}
            className="p-2.5 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors"
          >
            <Eye className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}

// ── Filter Panel ─────────────────────────────────────────────────────────────

function FilterPanel({
  search, setSearch,
  category, setCategory,
  maxPrice, setMaxPrice,
  minEcoRating, setMinEcoRating,
  stockFilter, setStockFilter,
  clearFilters, hasActiveFilters,
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-6 sticky top-20">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-gray-900 flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-primary-600" /> Filters
        </h2>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-xs text-red-500 hover:text-red-700 font-semibold transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Search */}
      <div>
        <label htmlFor="filter-search" className="label text-xs uppercase tracking-wider text-gray-500">Search</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            id="filter-search"
            type="search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Name, description…"
            className="input-field pl-9 text-sm"
          />
        </div>
      </div>

      {/* Category */}
      <div>
        <label htmlFor="filter-category" className="label text-xs uppercase tracking-wider text-gray-500">Category</label>
        <select
          id="filter-category"
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="input-field text-sm font-medium"
        >
          <option value="">All Categories</option>
          {ALL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Price range */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="filter-price" className="label mb-0 text-xs uppercase tracking-wider text-gray-500">Max Price</label>
          <span className="text-sm font-bold text-primary-600">
            ₹{maxPrice.toLocaleString('en-IN')}
          </span>
        </div>
        <input
          id="filter-price"
          type="range"
          min={0}
          max={MAX_PRICE}
          step={100}
          value={maxPrice}
          onChange={e => setMaxPrice(Number(e.target.value))}
          className="w-full"
          aria-valuemin={0}
          aria-valuemax={MAX_PRICE}
          aria-valuenow={maxPrice}
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>₹0</span>
          <span>₹{MAX_PRICE.toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* Eco Rating */}
      <div>
        <label className="label text-xs uppercase tracking-wider text-gray-500">Min Eco-Rating</label>
        <div className="flex gap-1.5 mt-1">
          {[0, 1, 2, 3, 4, 5].map(r => (
            <button
              key={r}
              type="button"
              onClick={() => setMinEcoRating(r)}
              aria-label={r === 0 ? 'Any eco rating' : `Minimum ${r} star eco rating`}
              aria-pressed={minEcoRating === r}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                minEcoRating === r
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {r === 0 ? 'Any' : `${r}★`}
            </button>
          ))}
        </div>
      </div>

      {/* Stock */}
      <div>
        <label className="label text-xs uppercase tracking-wider text-gray-500">Stock Status</label>
        <div className="space-y-2 mt-1">
          {[
            { val: 'all', label: 'All products' },
            { val: 'instock', label: 'In Stock only' },
            { val: 'lowstock', label: 'Low Stock only' },
          ].map(({ val, label }) => (
            <label key={val} htmlFor={`stock-${val}`} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="radio"
                id={`stock-${val}`}
                name="stock-filter"
                value={val}
                checked={stockFilter === val}
                onChange={() => setStockFilter(val)}
                className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900 font-medium">{label}</span>
            </label>
          ))}
        </div>
      </div>

      <p className="text-xs text-gray-400 italic">
        * Eco-ratings are illustrative sample data only.
      </p>
    </div>
  );
}

function FilterTag({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-primary-50 border border-primary-200 text-primary-700 text-xs font-semibold px-3 py-1 rounded-full">
      {label}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove filter: ${label}`}
        className="hover:text-primary-900 transition-colors focus-visible:ring-1 focus-visible:ring-primary-500 rounded-full"
      >
        <X className="w-3 h-3" />
      </button>
    </span>
  );
}
