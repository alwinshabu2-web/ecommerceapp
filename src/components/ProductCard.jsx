import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Eye, Star, Recycle, CheckCircle, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { formatPrice } from '../utils/helpers';

function EcoStars({ rating }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`Eco-rating: ${rating} out of 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300 fill-gray-100'}`}
        />
      ))}
    </div>
  );
}

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const wishlisted = isInWishlist(product.id);

  function handleAddToCart(e) {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock === 'Out of Stock') return;
    addToCart(product);
    addToast({ message: `"${product.name}" added to cart!`, type: 'success' });
  }

  function handleToggleWishlist(e) {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    if (!wishlisted) {
      addToast({ message: `Saved "${product.name}" to wishlist!`, type: 'success' });
    } else {
      addToast({ message: `Removed "${product.name}" from wishlist.`, type: 'info' });
    }
  }

  const isOutOfStock = product.stock === 'Out of Stock';
  const isLowStock = product.stock === 'Low Stock';

  return (
    <article className="card group cursor-pointer" onClick={() => navigate(`/products/${product.id}`)}>
      {/* Image */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50 aspect-[4/3]">
        <img
          src={product.images[0]?.url || '/images/fallback-product.svg'}
          alt={product.images[0]?.alt || product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = '/images/fallback-product.svg';
          }}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isRecycled && (
            <span className="eco-badge text-xs">
              <Recycle className="w-3 h-3" /> Recycled
            </span>
          )}
          {product.isBestSeller && (
            <span className="inline-flex items-center gap-1 bg-amber-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
              ⭐ Best Seller
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          aria-label={wishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          className={`absolute top-3 right-3 z-10 p-2 rounded-full transition-all duration-200 shadow-md ${
            wishlisted
              ? 'bg-rose-500 text-white scale-110 shadow-rose-500/30'
              : 'bg-white/90 text-gray-500 hover:text-rose-500 hover:bg-white hover:scale-105'
          }`}
        >
          <Heart className={`w-4 h-4 transition-transform duration-200 ${wishlisted ? 'fill-white stroke-white' : ''}`} />
        </button>

        {/* Stock overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-gray-900/40 flex items-center justify-center">
            <span className="bg-white text-gray-900 font-semibold text-sm px-4 py-1.5 rounded-full shadow">
              Out of Stock
            </span>
          </div>
        )}

        {isLowStock && !isOutOfStock && (
          <div className="absolute bottom-3 left-3">
            <span className="bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-sm">
              Only {product.stockQty} left
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs font-medium text-primary-600 mb-0.5">{product.category}</p>
            <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2">
              {product.name}
            </h3>
          </div>
        </div>

        {/* Eco Rating */}
        <div className="flex items-center gap-2">
          <EcoStars rating={product.ecoRating} />
          <span className="text-xs text-gray-500">Eco-rating*</span>
        </div>

        {/* Price */}
        <div className="flex items-end justify-between">
          <div>
            <span className="text-xl font-bold text-gray-900">{formatPrice(product.price)}</span>
            <span className="text-xs text-gray-500 ml-1">{product.unit}</span>
          </div>
        </div>

        {/* Certification pill */}
        {product.certification && (
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <CheckCircle className="w-3.5 h-3.5 text-primary-500 flex-shrink-0" />
            <span className="line-clamp-1">{product.certification.replace(/^\*Illustrative: /, '')}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            aria-label={`Add ${product.name} to cart`}
            className={`flex-1 btn-primary text-sm py-2.5 justify-center ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <ShoppingCart className="w-4 h-4" />
            {isOutOfStock ? 'Unavailable' : 'Add to Cart'}
          </button>

          <Link
            to={`/products/${product.id}`}
            onClick={e => e.stopPropagation()}
            aria-label={`View details for ${product.name}`}
            className="btn-secondary text-sm py-2.5 px-3 justify-center"
          >
            <Eye className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
