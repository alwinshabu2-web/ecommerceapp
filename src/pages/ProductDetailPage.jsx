import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart, ArrowLeft, Star, Leaf, Recycle,
  CheckCircle, Package, Award, Info, ChevronDown, ChevronUp, Heart, Zap
} from 'lucide-react';
import { getProductById, products } from '../data/products';
import ProductGallery from '../components/ProductGallery';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { formatPrice } from '../utils/helpers';

function EcoStars({ rating }) {
  return (
    <div className="flex items-center gap-1" aria-label={`Eco-rating: ${rating} out of 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`w-5 h-5 ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300 fill-gray-100'}`}
        />
      ))}
      <span className="ml-2 text-sm font-semibold text-gray-700">{rating}/5</span>
    </div>
  );
}

function Accordion({ title, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        className="w-full flex items-center justify-between px-5 py-4 text-left bg-white hover:bg-gray-50 transition-colors focus-visible:ring-2 focus-visible:ring-primary-500"
      >
        <span className="font-semibold text-gray-900 text-sm">{title}</span>
        {open ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
      </button>
      {open && (
        <div className="px-5 pb-5 pt-2 bg-white border-t border-gray-100 text-sm text-gray-700 leading-relaxed animate-slide-down">
          {children}
        </div>
      )}
    </div>
  );
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToast } = useToast();
  const [qty, setQty] = useState(1);

  const product = getProductById(id);

  if (!product) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50">
        <p className="text-6xl">🌿</p>
        <h1 className="text-2xl font-bold text-gray-900">Product not found</h1>
        <p className="text-gray-500">This product doesn't exist or has been removed.</p>
        <Link to="/products" className="btn-primary mt-2">Back to Products</Link>
      </main>
    );
  }

  const isOutOfStock = product.stock === 'Out of Stock';
  const isLowStock = product.stock === 'Low Stock';
  const wishlisted = isInWishlist(product.id);

  function handleAddToCart() {
    if (isOutOfStock) return;
    for (let i = 0; i < qty; i++) addToCart(product);
    addToast({ message: `${qty}× "${product.name}" added to cart!`, type: 'success' });
  }

  function handleBuyNow() {
    if (isOutOfStock) return;
    for (let i = 0; i < qty; i++) addToCart(product);
    navigate('/checkout');
  }

  function handleToggleWishlist() {
    toggleWishlist(product);
    if (!wishlisted) {
      addToast({ message: `Saved "${product.name}" to your wishlist!`, type: 'success' });
    } else {
      addToast({ message: `Removed "${product.name}" from wishlist.`, type: 'info' });
    }
  }

  // Related products: same category, not same product
  const related = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-sm">
              <li>
                <Link to="/" className="text-gray-500 hover:text-primary-600 transition-colors">Home</Link>
              </li>
              <li aria-hidden="true" className="text-gray-300">/</li>
              <li>
                <Link to="/products" className="text-gray-500 hover:text-primary-600 transition-colors">Products</Link>
              </li>
              <li aria-hidden="true" className="text-gray-300">/</li>
              <li className="text-gray-900 font-medium truncate max-w-xs">{product.name}</li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary-600 mb-6 transition-colors focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {/* Main product layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
          {/* Gallery */}
          <div>
            <ProductGallery images={product.images} productName={product.name} />
          </div>

          {/* Product Info */}
          <div className="space-y-5">
            {/* Category + badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="eco-badge">{product.category}</span>
              {product.isRecycled && (
                <span className="eco-badge">
                  <Recycle className="w-3 h-3" /> Recycled Content
                </span>
              )}
              {product.isBestSeller && (
                <span className="inline-flex items-center gap-1 bg-amber-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                  ⭐ Best Seller
                </span>
              )}
            </div>

            <h1 className="text-3xl font-bold text-gray-900 leading-tight">{product.name}</h1>

            {/* Eco Rating */}
            <div className="flex items-center gap-4">
              <EcoStars rating={product.ecoRating} />
              <span className="text-xs text-gray-500">* Illustrative eco-rating (sample data)</span>
            </div>

            {/* Price */}
            <div>
              <span className="text-4xl font-extrabold text-gray-900">{formatPrice(product.price)}</span>
              <span className="text-gray-500 ml-2 text-base">{product.unit}</span>
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2">
              {isOutOfStock ? (
                <span className="inline-flex items-center gap-1.5 bg-red-50 text-red-700 border border-red-200 text-sm font-semibold px-3 py-1 rounded-full">
                  <Package className="w-4 h-4" /> Out of Stock
                </span>
              ) : isLowStock ? (
                <span className="inline-flex items-center gap-1.5 bg-orange-50 text-orange-700 border border-orange-200 text-sm font-semibold px-3 py-1 rounded-full">
                  <Package className="w-4 h-4" /> Only {product.stockQty} left
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 bg-primary-50 text-primary-700 border border-primary-200 text-sm font-semibold px-3 py-1 rounded-full">
                  <CheckCircle className="w-4 h-4" /> In Stock ({product.stockQty} units)
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed">{product.description}</p>

            {/* Certification */}
            {product.certification && (
              <div className="flex items-start gap-2.5 bg-primary-50 border border-primary-100 rounded-xl px-4 py-3">
                <Award className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-primary-800">Certification (Illustrative)</p>
                  <p className="text-sm text-primary-700">{product.certification}</p>
                </div>
              </div>
            )}

            {/* Quantity + Actions */}
            {!isOutOfStock && (
              <div className="space-y-3 pt-2">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  {/* Quantity selector */}
                  <div className="flex items-center justify-between sm:justify-start border-2 border-gray-200 rounded-xl overflow-hidden self-start">
                    <button
                      type="button"
                      onClick={() => setQty(q => Math.max(1, q - 1))}
                      aria-label="Decrease quantity"
                      disabled={qty <= 1}
                      className="w-11 h-11 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40 transition-colors focus-visible:ring-2 focus-visible:ring-primary-500 font-bold text-lg"
                    >
                      −
                    </button>
                    <span className="w-14 text-center font-bold text-gray-900 border-x-2 border-gray-200 py-2.5" aria-label={`Quantity: ${qty}`}>
                      {qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQty(q => q + 1)}
                      aria-label="Increase quantity"
                      className="w-11 h-11 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors focus-visible:ring-2 focus-visible:ring-primary-500 font-bold text-lg"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Cart */}
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="btn-primary flex-1 justify-center py-3 text-base shadow-sm"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart — {formatPrice(product.price * qty)}
                  </button>
                </div>

                {/* Secondary Actions: Buy Now & Wishlist */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleBuyNow}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-2 border-emerald-600 font-bold px-6 py-3 rounded-xl transition-all duration-200"
                  >
                    <Zap className="w-5 h-5 fill-emerald-600 text-emerald-600" />
                    Instant Checkout
                  </button>

                  <button
                    type="button"
                    onClick={handleToggleWishlist}
                    aria-label={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
                    className={`p-3.5 rounded-xl border-2 transition-all flex items-center justify-center ${
                      wishlisted
                        ? 'bg-rose-50 border-rose-400 text-rose-600 shadow-sm'
                        : 'bg-white border-gray-200 text-gray-600 hover:text-rose-500 hover:border-rose-200 hover:bg-rose-50/50'
                    }`}
                  >
                    <Heart className={`w-5 h-5 transition-transform duration-200 ${wishlisted ? 'fill-rose-500' : ''}`} />
                  </button>
                </div>
              </div>
            )}

            {isOutOfStock && (
              <p className="text-red-600 font-semibold">This product is currently out of stock.</p>
            )}
          </div>
        </div>

        {/* Detailed Info Accordions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-12">
          <Accordion title="Environmental Benefits">
            <ul className="space-y-2">
              {product.environmentalBenefits.map((b, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Leaf className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
                  {b}
                </li>
              ))}
            </ul>
          </Accordion>

          <Accordion title="Material Composition">
            <div className="space-y-2">
              <p><strong>Composition:</strong> {product.composition}</p>
              <p><strong>Source:</strong> {product.materialSource}</p>
              {product.isRecycled && (
                <p className="flex items-center gap-1.5 text-primary-700 font-medium">
                  <Recycle className="w-4 h-4" /> Contains recycled / reclaimed material
                </p>
              )}
            </div>
          </Accordion>

          <Accordion title="Certification Information">
            <div className="flex items-start gap-2.5">
              <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="mb-2">{product.certification || 'No certification information listed.'}</p>
                <p className="text-xs text-gray-500 italic">
                  ⚠ All certification information is illustrative sample data for this college project demonstration.
                  Always verify certifications directly with accredited bodies.
                </p>
              </div>
            </div>
          </Accordion>

          <Accordion title="Shipping & Returns">
            <div className="space-y-2 text-sm">
              <p>✅ Ships within 2–5 business days of confirmed order.</p>
              <p>✅ Available in Standard, Express, and Overnight options at checkout.</p>
              <p>✅ Returns accepted within 7 days of delivery (unused, original packaging).</p>
              <p className="text-xs text-gray-400 italic mt-2">
                Sample information — not a real service commitment.
              </p>
            </div>
          </Accordion>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <section aria-labelledby="related-heading">
            <h2 id="related-heading" className="text-2xl font-bold text-gray-900 mb-6">
              More in {product.category}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
