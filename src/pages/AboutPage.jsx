import { Link } from 'react-router-dom';
import { Leaf, Target, Users, Award, ArrowRight, Globe, TreePine, Zap } from 'lucide-react';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-900 to-gray-900 py-24 px-4" aria-labelledby="about-heading">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary-600/20 border border-primary-500/30 text-primary-300 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <Leaf className="w-4 h-4" />
            Our Story
          </div>
          <h1 id="about-heading" className="text-4xl sm:text-5xl font-extrabold text-white mb-6">
            About EcoConstruct Pro
          </h1>
          <p className="text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto">
            A college product design project exploring how digital commerce can
            accelerate the adoption of sustainable building materials in India.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
        {/* Mission */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 eco-badge mb-4">
              <Target className="w-4 h-4" /> Our Mission
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-5">
              Making sustainable construction the default, not the exception
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              EcoConstruct Pro is a concept e-commerce platform designed as a college Product Design project.
              It demonstrates how a well-designed digital marketplace could help architects, contractors,
              and self-builders discover, evaluate, and purchase sustainable building materials with ease.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              The construction industry is one of the largest contributors to global CO₂ emissions and
              resource consumption. By making eco-friendly materials as easy to buy online as conventional
              ones — with transparent specifications, certifications, and environmental data — we can shift
              purchasing decisions at scale.
            </p>
            <p className="text-xs text-gray-400 italic">
              Note: All products, certifications, ratings, and company information on this site are
              illustrative sample data for a college demonstration project.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Globe, color: 'bg-primary-100 text-primary-700', title: 'Pan-India Reach', desc: 'Connecting suppliers of sustainable materials with builders nationwide' },
              { icon: TreePine, color: 'bg-green-100 text-green-700', title: 'Forest-Positive', desc: 'Prioritising FSC-certified, reclaimed and plantation-grown timber' },
              { icon: Zap, color: 'bg-amber-100 text-amber-700', title: 'Energy Smart', desc: 'Materials that reduce operational energy through better insulation and reflectivity' },
              { icon: Users, color: 'bg-blue-100 text-blue-700', title: 'Community First', desc: 'Supporting artisan producers and fair-trade cooperative supply chains' },
            ].map(({ icon: Icon, color, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center mb-3`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-1">{title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Team / Project credits */}
        <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-10">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 eco-badge mb-4">
              <Users className="w-4 h-4" /> The Project Team
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Built for a College Project</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">
              This platform was designed and built as part of a Product Design course, exploring
              UX, UI, and full-stack frontend concepts for sustainable e-commerce.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { role: 'Product Design', desc: 'UX research, user journeys, wireframing, and prototyping of the shopping flow', emoji: '🎨' },
              { role: 'Frontend Development', desc: 'React + Tailwind CSS implementation with cart, checkout and localStorage persistence', emoji: '⚙️' },
              { role: 'Content Strategy', desc: 'Product data, sustainability messaging, and responsible eco-claims disclaimer system', emoji: '📝' },
            ].map(({ role, desc, emoji }) => (
              <div key={role} className="text-center p-6 bg-gray-50 rounded-2xl">
                <div className="text-4xl mb-4" aria-hidden="true">{emoji}</div>
                <h3 className="font-bold text-gray-900 mb-2">{role}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Our Approach / Values */}
        <section>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Our Design Principles</h2>
            <p className="text-gray-500 mt-3">What guided every decision in building EcoConstruct Pro</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: Award,
                color: 'text-amber-600 bg-amber-50',
                title: 'Transparency over Greenwashing',
                desc: 'Every eco claim on this platform is clearly marked as illustrative sample data. In a real deployment, all certifications would be verified against accredited certification bodies before display.',
              },
              {
                icon: Leaf,
                color: 'text-primary-600 bg-primary-50',
                title: 'Functionality Before Decoration',
                desc: 'The shopping journey — discovering, evaluating, and purchasing — is optimised first. Visual design enhances the experience without compromising accessibility or usability.',
              },
              {
                icon: Users,
                color: 'text-blue-600 bg-blue-50',
                title: 'Accessibility for Everyone',
                desc: 'Keyboard navigation, screen reader labels, sufficient colour contrast, and clear error messages ensure the platform works for all users, not just those with perfect vision or mouse control.',
              },
              {
                icon: Globe,
                color: 'text-purple-600 bg-purple-50',
                title: 'Privacy by Design',
                desc: 'No real card numbers, CVVs, or UPI credentials are ever collected or stored. The checkout is explicitly marked as a demo. All data stays in the user\'s own browser (localStorage).',
              },
            ].map(({ icon: Icon, color, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex gap-4">
                <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center bg-gradient-to-r from-primary-600 to-primary-700 rounded-3xl p-12">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to explore sustainable materials?</h2>
          <p className="text-primary-100 mb-8 max-w-lg mx-auto">
            Browse our sample catalogue of eco-friendly construction materials, each with detailed
            environmental data, images and specifications.
          </p>
          <Link to="/products" className="inline-flex items-center gap-2 bg-white text-primary-700 hover:bg-gray-100 font-bold px-8 py-4 rounded-xl transition-all duration-200 shadow-lg text-base">
            Browse Products <ArrowRight className="w-5 h-5" />
          </Link>
        </section>
      </div>
    </main>
  );
}
