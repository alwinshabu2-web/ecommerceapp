import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Leaf, ShieldCheck, Truck, HeadphonesIcon, Award, Recycle, Wind, Sun } from 'lucide-react';
import { getFeaturedProducts, getBestSellers } from '../data/products';
import ProductCard from '../components/ProductCard';

export default function HomePage() {
  const featured = getFeaturedProducts();
  const bestSellers = getBestSellers();

  return (
    <div className="min-h-screen">
      <HeroSection />
      <CategoriesSection />
      <FeaturedSection products={featured} />
      <SustainabilitySection />
      <BestSellersSection products={bestSellers} />
      <TrustSection />
    </div>
  );
}

// ── Hero ────────────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section
      className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-primary-900 to-gray-900 min-h-[90vh] flex items-center"
      aria-labelledby="hero-heading"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, #059669 0%, transparent 50%),
                              radial-gradient(circle at 75% 75%, #047857 0%, transparent 50%)`,
          }}
        />
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#059669" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="max-w-3xl">
          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 bg-primary-600/20 border border-primary-500/30 text-primary-300 text-sm font-medium px-4 py-1.5 rounded-full mb-8">
            <Leaf className="w-4 h-4" />
            Sustainable Construction Materials
          </div>

          <h1
            id="hero-heading"
            className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-white leading-tight mb-6"
          >
            Build a{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-emerald-300">
              Greener
            </span>{' '}
            Future
          </h1>

          <p className="text-lg sm:text-xl text-gray-300 leading-relaxed mb-10 max-w-2xl">
            Discover India's curated collection of certified eco-friendly construction materials —
            from reclaimed timber to bamboo composites. Build sustainably without compromising on
            strength, beauty, or budget.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              to="/products"
              className="btn-primary text-base py-4 px-8 shadow-lg shadow-primary-900/40"
            >
              Explore Products <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 text-white border-2 border-white/30 hover:border-white/60 hover:bg-white/10 font-semibold px-8 py-4 rounded-lg transition-all duration-200 text-base"
            >
              Learn More
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-6 max-w-lg">
            {[
              { value: '50+', label: 'Products' },
              { value: '6', label: 'Categories' },
              { value: '100%', label: 'Eco-Vetted' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-3xl font-extrabold text-primary-400">{value}</p>
                <p className="text-sm text-gray-400 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-50 to-transparent"
        aria-hidden="true"
      />
    </section>
  );
}

// ── Categories ───────────────────────────────────────────────────────────────

function CategoriesSection() {
  const navigate = useNavigate();

  const catData = [
    { label: 'Timber & Wood', icon: '🌳', desc: 'Reclaimed & FSC-certified wood', filter: 'Timber & Wood' },
    { label: 'Insulation', icon: '🧱', desc: 'Natural thermal & acoustic', filter: 'Insulation' },
    { label: 'Roofing', icon: '🏠', desc: 'Durable, sustainable roofs', filter: 'Roofing' },
    { label: 'Bamboo', icon: '🎋', desc: 'Fastest renewable material', filter: 'Bamboo' },
    { label: 'Recycled Materials', icon: '♻️', desc: 'Second-life construction', filter: 'Recycled Materials' },
    { label: 'Composites', icon: '🔩', desc: 'High-performance hybrids', filter: 'Composites' },
  ];

  return (
    <section className="py-20 bg-gray-50" aria-labelledby="categories-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 id="categories-heading" className="section-heading">Browse by Category</h2>
          <p className="section-subheading">Find the right sustainable material for every part of your build</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {catData.map(({ label, icon, desc, filter }) => (
            <button
              key={label}
              type="button"
              onClick={() => navigate(`/products?category=${encodeURIComponent(filter)}`)}
              className="group bg-white hover:bg-primary-50 border border-gray-100 hover:border-primary-200 rounded-2xl p-5 text-center transition-all duration-300 hover:shadow-md hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-primary-500"
              aria-label={`Browse ${label} products`}
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300" aria-hidden="true">
                {icon}
              </div>
              <p className="font-semibold text-gray-900 text-sm leading-tight">{label}</p>
              <p className="text-xs text-gray-500 mt-1 leading-tight hidden sm:block">{desc}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Featured Products ─────────────────────────────────────────────────────────

function FeaturedSection({ products }) {
  return (
    <section className="py-20 bg-white" aria-labelledby="featured-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 id="featured-heading" className="section-heading">Featured Products</h2>
            <p className="section-subheading">Our most-loved sustainable materials</p>
          </div>
          <Link
            to="/products"
            className="hidden sm:inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 font-semibold text-sm transition-colors"
          >
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
        <div className="mt-8 text-center sm:hidden">
          <Link to="/products" className="btn-outline-primary">
            View All Products <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ── Sustainability Section ────────────────────────────────────────────────────

function SustainabilitySection() {
  const benefits = [
    {
      icon: Leaf,
      color: 'bg-primary-100 text-primary-700',
      title: 'Lower Carbon Footprint',
      desc: 'Eco materials sequester carbon, require less processing energy, and reduce transportation emissions when sourced locally.',
    },
    {
      icon: Recycle,
      color: 'bg-blue-100 text-blue-700',
      title: 'Circular Economy',
      desc: 'Reclaimed and recycled materials give new life to existing resources, diverting waste from landfill and reducing virgin extraction.',
    },
    {
      icon: Wind,
      color: 'bg-indigo-100 text-indigo-700',
      title: 'Better Indoor Air',
      desc: 'Natural materials like wool and recycled cotton insulation are free from VOCs and formaldehyde, creating healthier living spaces.',
    },
    {
      icon: Sun,
      color: 'bg-amber-100 text-amber-700',
      title: 'Energy Efficiency',
      desc: 'Proper insulation and cool-roof materials significantly reduce heating and cooling loads, cutting energy bills over the building\'s lifetime.',
    },
    {
      icon: Award,
      color: 'bg-purple-100 text-purple-700',
      title: 'Third-Party Verified',
      desc: 'Look for industry certifications (FSC, GreenGuard, OEKO-TEX) that independently verify environmental claims — always check authenticity.',
    },
    {
      icon: ShieldCheck,
      color: 'bg-green-100 text-green-700',
      title: 'Structural Integrity',
      desc: 'Sustainable doesn\'t mean weak. Materials like bamboo, fly-ash brick and WPC composites meet or exceed conventional performance standards.',
    },
  ];

  return (
    <section
      className="py-20 bg-gradient-to-br from-primary-900 to-gray-900 relative overflow-hidden"
      aria-labelledby="sustain-heading"
    >
      <div className="absolute inset-0 opacity-5" aria-hidden="true">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dots" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="1.5" fill="#059669" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 id="sustain-heading" className="text-3xl md:text-4xl font-bold text-white mb-4">
            Why Build with Sustainable Materials?
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Every material choice in your project is an environmental decision. Here's why going eco-friendly makes sense.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map(({ icon: Icon, color, title, desc }) => (
            <div key={title} className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/15 transition-colors duration-300">
              <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center mb-4`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
              <p className="text-gray-300 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Best Sellers ──────────────────────────────────────────────────────────────

function BestSellersSection({ products }) {
  return (
    <section className="py-20 bg-gray-50" aria-labelledby="bestsellers-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 id="bestsellers-heading" className="section-heading">Best Sellers</h2>
            <p className="section-subheading">Top picks from our professional builders</p>
          </div>
          <Link
            to="/products"
            className="hidden sm:inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 font-semibold text-sm transition-colors"
          >
            Shop all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </section>
  );
}

// ── Trust / Services ──────────────────────────────────────────────────────────

function TrustSection() {
  const services = [
    {
      icon: ShieldCheck,
      title: 'Product Transparency',
      desc: 'Every product listing includes material source, composition, and any applicable certifications — clearly marked as illustrative data.',
      color: 'text-primary-600',
      bg: 'bg-primary-50',
    },
    {
      icon: Truck,
      title: 'Pan-India Delivery',
      desc: 'Standard, Express and Overnight shipping options with estimated delivery dates (sample estimates — see checkout for details).',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      icon: HeadphonesIcon,
      title: 'Expert Support',
      desc: 'Our sustainability consultants can guide material selection for structural, thermal, or acoustic requirements in your project.',
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
  ];

  return (
    <section className="py-20 bg-white" aria-labelledby="trust-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 id="trust-heading" className="section-heading">Why EcoConstruct Pro?</h2>
          <p className="section-subheading">We make sustainable building accessible, transparent and reliable.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map(({ icon: Icon, title, desc, color, bg }) => (
            <div key={title} className="text-center group">
              <div className={`${bg} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300`}>
                <Icon className={`w-8 h-8 ${color}`} />
              </div>
              <h3 className="font-bold text-gray-900 text-xl mb-3">{title}</h3>
              <p className="text-gray-600 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
