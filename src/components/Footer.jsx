import { Link } from 'react-router-dom';
import { Leaf, Mail, Phone, MapPin } from 'lucide-react';

const socialLinks = [
  {
    label: 'Facebook',
    href: '#',
    svg: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    label: 'Twitter / X',
    href: '#',
    svg: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: '#',
    svg: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: '#',
    svg: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.738-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
      </svg>
    ),
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="sm:col-span-2 lg:col-span-1">
          <Link to="/" className="flex items-center gap-2 mb-4 group" aria-label="EcoConstruct Pro Home">
            <div className="bg-primary-600 p-1.5 rounded-lg group-hover:bg-primary-500 transition-colors">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-white text-lg">
              EcoConstruct<span className="text-primary-400"> Pro</span>
            </span>
          </Link>
          <p className="text-sm text-gray-400 leading-relaxed mb-4">
            India's curated marketplace for sustainable construction materials. Building a greener future, one project at a time.
          </p>
          <div className="flex gap-3">
            {socialLinks.map(({ svg, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-9 h-9 flex items-center justify-center bg-gray-800 hover:bg-primary-600 text-gray-400 hover:text-white rounded-lg transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary-500"
              >
                {svg}
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h3>
          <ul className="space-y-2.5">
            {[
              { label: 'Home', to: '/' },
              { label: 'All Products', to: '/products' },
              { label: 'Saved Wishlist', to: '/wishlist' },
              { label: 'My Orders', to: '/orders' },
              { label: 'About Us', to: '/about' },
              { label: 'Cart', to: '/cart' },
              { label: 'Checkout', to: '/checkout' },
            ].map(({ label, to }) => (
              <li key={label}>
                <Link
                  to={to}
                  className="text-sm text-gray-400 hover:text-primary-400 transition-colors focus-visible:underline"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Categories</h3>
          <ul className="space-y-2.5">
            {[
              { label: 'Timber & Wood', cat: 'Timber & Wood' },
              { label: 'Insulation', cat: 'Insulation' },
              { label: 'Roofing', cat: 'Roofing' },
              { label: 'Bamboo', cat: 'Bamboo' },
              { label: 'Recycled Materials', cat: 'Recycled Materials' },
              { label: 'Composites', cat: 'Composites' },
            ].map(({ label, cat }) => (
              <li key={label}>
                <Link
                  to={`/products?category=${encodeURIComponent(cat)}`}
                  className="text-sm text-gray-400 hover:text-primary-400 transition-colors focus-visible:underline"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contact Us</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-primary-400 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-gray-400">
                12, Green Tech Park, Whitefield,<br />Bengaluru — 560 066, Karnataka
              </span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-primary-400 flex-shrink-0" />
              <a href="tel:+918001234567" className="text-sm text-gray-400 hover:text-primary-400 transition-colors">
                +91 800 123 4567
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-primary-400 flex-shrink-0" />
              <a href="mailto:hello@ecoconstructpro.in" className="text-sm text-gray-400 hover:text-primary-400 transition-colors">
                hello@ecoconstructpro.in
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-500 text-center">
            © {year} EcoConstruct Pro. All rights reserved. | College Product Design Project — Not a real company.
          </p>
          <p className="text-xs text-gray-600 text-center">
            ⚠ Product data, ratings and certifications are illustrative sample data only.
          </p>
        </div>
      </div>
    </footer>
  );
}
