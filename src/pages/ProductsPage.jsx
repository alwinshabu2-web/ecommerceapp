import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, Search, Filter } from 'lucide-react';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';

const ALL_CATEGORIES = ['Timber & Wood', 'Insulation', 'Roofing', 'Bamboo', 'Composites', 'Home & Garden'];
const MAX_PRICE = 10000;

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Filter state — initialize from URL params
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);
  const [minEcoRating, setMinEcoRating] = useState(0);
  const [stockFilter, setStockFilter] = useState('all'); // all | instock | lowstock

  // Sync search from URL
  useEffect(() => {
    const q = searchParams.get('search');
    if (q) setSearch(q);
    const cat = searchParams.get('category');
    if (cat) setCategory(cat);
  }, [searchParams]);

  // Derived filtered list
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return products.filter(p => {
      if (q && !p.name.toLowerCase().includes(q) && !p.description.toLowerCase().includes(q) && !p.category.toLowerCase().includes(q)) return false;
      if (category && p.category !== category) return false;
      if (p.price > maxPrice) return false;
      if (p.ecoRating < minEcoRating) return false;
      if (stockFilter === 'instock' && p.stock !== 'In Stock') return false;
      if (stockFilter === 'lowstock' && p.stock !== 'Low Stock') return false;
      return true;
    });
  }, [search, category, maxPrice, minEcoRating, stockFilter]);

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
    <main className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">All Products</h1>
          <p className="text-gray-500">
            {filtered.length} product{filtered.length !== 1 ? 's' : ''} found
            {category ? ` in "${category}"` : ''}
            {search ? ` for "${search}"` : ''}
          </p>
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
            {/* Mobile toolbar */}
            <div className="lg:hidden flex items-center gap-3 mb-6">
              {/* Mobile search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="search"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search…"
                  aria-label="Search products"
                  className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                />
              </div>
              <button
                type="button"
                onClick={() => setFiltersOpen(true)}
                className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors focus-visible:ring-2 focus-visible:ring-primary-500"
                aria-expanded={filtersOpen}
              >
                <Filter className="w-4 h-4" />
                Filters
                {hasActiveFilters && (
                  <span className="bg-primary-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                    !
                  </span>
                )}
              </button>
            </div>

            {/* Active filter tags */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mb-5">
                {search && <FilterTag label={`Search: "${search}"`} onRemove={() => setSearch('')} />}
                {category && <FilterTag label={category} onRemove={() => setCategory('')} />}
                {maxPrice < MAX_PRICE && <FilterTag label={`Up to ₹${maxPrice.toLocaleString('en-IN')}`} onRemove={() => setMaxPrice(MAX_PRICE)} />}
                {minEcoRating > 0 && <FilterTag label={`Eco ≥ ${minEcoRating}★`} onRemove={() => setMinEcoRating(0)} />}
                {stockFilter !== 'all' && <FilterTag label={stockFilter === 'instock' ? 'In Stock' : 'Low Stock'} onRemove={() => setStockFilter('all')} />}
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-xs text-red-500 hover:text-red-700 font-medium px-2 py-1"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Grid */}
            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-4xl mb-4">🔍</p>
                <h2 className="text-xl font-bold text-gray-900 mb-2">No products found</h2>
                <p className="text-gray-500 mb-6">Try adjusting your search or filters.</p>
                <button type="button" onClick={clearFilters} className="btn-primary">
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map(p => <ProductCard key={p.id} product={p} />)}
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
                <SlidersHorizontal className="w-5 h-5" /> Filters
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
              Show {filtered.length} Results
            </button>
          </div>
        </>
      )}
    </main>
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
          <SlidersHorizontal className="w-4 h-4" /> Filters
        </h2>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Search */}
      <div>
        <label htmlFor="filter-search" className="label">Search</label>
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
        <label htmlFor="filter-category" className="label">Category</label>
        <select
          id="filter-category"
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="input-field text-sm"
        >
          <option value="">All Categories</option>
          {ALL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Price range */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="filter-price" className="label mb-0">Max Price</label>
          <span className="text-sm font-semibold text-primary-600">
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
        <label className="label">Min Eco-Rating</label>
        <div className="flex gap-2 mt-1">
          {[0, 1, 2, 3, 4, 5].map(r => (
            <button
              key={r}
              type="button"
              onClick={() => setMinEcoRating(r)}
              aria-label={r === 0 ? 'Any eco rating' : `Minimum ${r} star eco rating`}
              aria-pressed={minEcoRating === r}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                minEcoRating === r
                  ? 'bg-primary-600 text-white'
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
        <label className="label">Stock</label>
        <div className="space-y-2 mt-1">
          {[
            { val: 'all', label: 'All products' },
            { val: 'instock', label: 'In Stock only' },
            { val: 'lowstock', label: 'Low Stock' },
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
              <span className="text-sm text-gray-700 group-hover:text-gray-900">{label}</span>
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
    <span className="inline-flex items-center gap-1.5 bg-primary-50 border border-primary-200 text-primary-700 text-xs font-medium px-3 py-1 rounded-full">
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
