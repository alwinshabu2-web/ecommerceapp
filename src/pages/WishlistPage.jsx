import { Link, useNavigate } from 'react-router-dom';
import { Heart, Trash2, ArrowRight, ShoppingCart, Eye, Recycle } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { formatPrice } from '../utils/helpers';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { addToast } = useToast();
  const navigate = useNavigate();

  function handleAddToCart(product, e) {
    e.stopPropagation();
    if (product.stock === 'Out of Stock') return;
    addToCart(product);
    addToast({ message: `"${product.name}" added to cart!`, type: 'success' });
  }

  function handleRemove(id, name, e) {
    e.stopPropagation();
    removeFromWishlist(id);
    addToast({ message: `Removed "${name}" from wishlist`, type: 'info' });
  }

  function handleAddAllToCart() {
    let addedCount = 0;
    wishlist.forEach(item => {
      if (item.stock !== 'Out of Stock') {
        addToCart(item);
        addedCount++;
      }
    });
    if (addedCount > 0) {
      addToast({ message: `Added ${addedCount} available item(s) to cart!`, type: 'success' });
    } else {
      addToast({ message: 'No items in wishlist are currently in stock.', type: 'error' });
    }
  }

  if (wishlist.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-16">
        <div className="text-center max-w-md bg-white p-8 sm:p-10 rounded-3xl border border-gray-100 shadow-sm">
          <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6 text-rose-500">
            <Heart className="w-10 h-10 fill-rose-100 text-rose-500" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Your wishlist is empty</h1>
          <p className="text-gray-500 mb-8 text-sm sm:text-base leading-relaxed">
            Save materials you love while browsing to keep track of them for your green building projects.
          </p>
          <Link to="/products" className="btn-primary text-base py-3 px-8 w-full sm:w-auto justify-center">
            Explore Materials <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-16">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-rose-50 text-rose-600 rounded-xl">
                <Heart className="w-5 h-5 fill-rose-600" />
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Saved Materials</h1>
            </div>
            <p className="text-gray-500 text-sm mt-1">
              {wishlist.length} saved item{wishlist.length !== 1 ? 's' : ''} in your wishlist
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={clearWishlist}
              className="text-xs sm:text-sm font-semibold text-gray-600 hover:text-red-600 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
            >
              Clear All
            </button>
            <button
              type="button"
              onClick={handleAddAllToCart}
              className="btn-primary text-sm py-2.5 px-4"
            >
              <ShoppingCart className="w-4 h-4" />
              Add All In Stock to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map(product => {
            const isOutOfStock = product.stock === 'Out of Stock';
            return (
              <div
                key={product.id}
                onClick={() => navigate(`/products/${product.id}`)}
                className="card group cursor-pointer relative flex flex-col"
              >
                {/* Image */}
                <div className="relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50 aspect-[4/3]">
                  <img
                    src={product.images?.[0]?.url || '/images/fallback-product.svg'}
                    alt={product.images?.[0]?.alt || product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/images/fallback-product.svg';
                    }}
                  />

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={(e) => handleRemove(product.id, product.name, e)}
                    aria-label={`Remove ${product.name} from wishlist`}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/90 text-gray-400 hover:text-red-500 hover:bg-white shadow-md transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    {product.isRecycled && (
                      <span className="eco-badge text-xs">
                        <Recycle className="w-3 h-3" /> Recycled
                      </span>
                    )}
                  </div>

                  {isOutOfStock && (
                    <div className="absolute inset-0 bg-gray-900/40 flex items-center justify-center">
                      <span className="bg-white text-gray-900 font-semibold text-xs px-3 py-1 rounded-full shadow">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <p className="text-xs font-medium text-primary-600 mb-0.5">{product.category}</p>
                    <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2">
                      {product.name}
                    </h3>

                    {/* Price */}
                    <div className="mt-2">
                      <span className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</span>
                      <span className="text-xs text-gray-500 ml-1">{product.unit}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={(e) => handleAddToCart(product, e)}
                      disabled={isOutOfStock}
                      className={`flex-1 btn-primary text-xs py-2 justify-center ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                    <Link
                      to={`/products/${product.id}`}
                      onClick={e => e.stopPropagation()}
                      className="btn-secondary text-xs py-2 px-3 justify-center"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
