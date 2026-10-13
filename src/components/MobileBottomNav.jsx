import { NavLink } from 'react-router-dom';
import { Home, Compass, Heart, Package, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function MobileBottomNav() {
  const { itemCount } = useCart();
  const { wishlistCount } = useWishlist();

  const navItem = (to, icon, label, badgeCount = 0) => (
    <NavLink
      to={to}
      end={to === '/'}
      className={({ isActive }) =>
        `flex flex-col items-center justify-center flex-1 py-1.5 px-1 relative transition-colors duration-150 ${
          isActive ? 'text-primary-600 font-bold' : 'text-gray-500 hover:text-gray-900 font-medium'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <div className="relative">
            <span
              className={`p-1 rounded-xl transition-all ${
                isActive ? 'bg-primary-50 text-primary-600 scale-105' : 'text-gray-500'
              }`}
            >
              {icon}
            </span>
            {badgeCount > 0 && (
              <span className="absolute -top-1 -right-2 min-w-[17px] h-[17px] bg-primary-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-0.5 shadow-sm">
                {badgeCount > 99 ? '99+' : badgeCount}
              </span>
            )}
          </div>
          <span className="text-[11px] tracking-tight mt-0.5 leading-none">{label}</span>
        </>
      )}
    </NavLink>
  );

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-200/80 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] pb-safe">
      <nav aria-label="Mobile Navigation" className="flex items-center justify-around h-16 max-w-md mx-auto px-2">
        {navItem('/', <Home className="w-5 h-5" />, 'Home')}
        {navItem('/products', <Compass className="w-5 h-5" />, 'Catalog')}
        {navItem('/wishlist', <Heart className="w-5 h-5" />, 'Wishlist', wishlistCount)}
        {navItem('/orders', <Package className="w-5 h-5" />, 'Orders')}
        {navItem('/cart', <ShoppingCart className="w-5 h-5" />, 'Cart', itemCount)}
      </nav>
    </div>
  );
}
