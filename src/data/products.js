// EcoConstruct Pro - Sustainable Construction Material Product Data
// NOTE: Eco-ratings, certifications, and environmental claims are ILLUSTRATIVE SAMPLE DATA
// for demonstration purposes only.

export const FALLBACK_IMAGE = '/images/fallback-product.svg';

// ── PRODUCT CATALOGUE — Exactly 7 products ───────────────────────────────────

export const products = [
  // ── 1. Bamboo Engineered Boards ─────────────────────────────────────────────
  {
    id: 'p001',
    name: 'Bamboo Engineered Boards',
    category: 'Bamboo',
    price: 1850,
    unit: 'per sq. ft.',
    stock: 'In Stock',
    stockQty: 120,
    ecoRating: 5,
    isRecycled: false,
    isFeatured: true,
    isBestSeller: true,
    description:
      'Cross-laminated engineered bamboo boards offering the strength of hardwood at a fraction of the carbon footprint. Rapidly renewable — bamboo matures in just 4–5 years versus 50+ for timber. Formaldehyde-free E0-grade adhesive makes these boards ideal for flooring, cabinetry, wall cladding and structural panels.',
    specifications: [
      { label: 'Dimensions', value: '2440 × 1220 mm (standard sheet)' },
      { label: 'Thickness', value: '12 mm / 18 mm / 25 mm' },
      { label: 'Density', value: '900–1050 kg/m³' },
      { label: 'Binder', value: 'E0 formaldehyde-free adhesive' },
      { label: 'Finish', value: 'Natural / Carbonised / Caramel' },
    ],
    environmentalBenefits: [
      'Bamboo grows 30× faster than hardwood',
      'Sequesters more CO₂ per hectare than most tree species',
      'No deforestation — harvested without killing the root system',
      'Formaldehyde-free binder — safer indoor air quality',
    ],
    materialSource: 'Moso bamboo (Phyllostachys edulis) from certified plantations, Zhejiang, China',
    certification: '*Illustrative: E0 low-emission, FSC Bamboo certified (sample data only)',
    composition: '100% Moso bamboo fibre, E0 adhesive binder',
    images: [
      {
        label: 'Front View',
        url: '/images/products/p001/front.jpg',
        alt: 'Bamboo Engineered Boards — Smooth cross-laminated architectural bamboo panel face',
      },
      {
        label: 'Side View',
        url: '/images/products/p001/side.jpg',
        alt: 'Bamboo Engineered Boards — Edge profile showing 18 mm multi-ply cross-lamination layers',
      },
      {
        label: 'Top View',
        url: '/images/products/p001/top.jpg',
        alt: 'Bamboo Engineered Boards — Top surface showing uniform linear bamboo node grain',
      },
      {
        label: 'Detail / Close-up',
        url: '/images/products/p001/detail.jpg',
        alt: 'Bamboo Engineered Boards — Macro close-up of compressed bamboo fibre structure and nodes',
      },
    ],
  },

  // ── 2. Reclaimed Timber Planks ───────────────────────────────────────────────
  {
    id: 'p002',
    name: 'Reclaimed Timber Planks',
    category: 'Timber & Wood',
    price: 4200,
    unit: 'per sq. ft.',
    stock: 'In Stock',
    stockQty: 85,
    ecoRating: 5,
    isRecycled: true,
    isFeatured: true,
    isBestSeller: false,
    description:
      'Salvaged from century-old demolition sites across Kerala and Tamil Nadu, these reclaimed teak and rosewood planks carry unparalleled grain patterns and natural oils accumulated over decades. Each plank is de-nailed, kiln-dried and graded A/B for structural or premium decorative use in flooring, beams and feature walls.',
    specifications: [
      { label: 'Species', value: 'Reclaimed Teak (Tectona grandis) / Rosewood' },
      { label: 'Thickness', value: '25 mm / 38 mm / 50 mm' },
      { label: 'Width', value: '100–300 mm (variable, salvaged)' },
      { label: 'Grade', value: 'A (structural) / B (decorative)' },
      { label: 'Moisture Content', value: '≤ 12 % (kiln-dried)' },
    ],
    environmentalBenefits: [
      'Diverts timber from landfill — zero new tree felling',
      'Carbon sequestered in original growth is permanently retained',
      'Dramatically lower embodied carbon than virgin hardwood',
      'Extends timber lifespan by 50–100 additional years',
    ],
    materialSource: 'Reclaimed from pre-1950 heritage buildings, Kerala and Tamil Nadu',
    certification: '*Illustrative: FSC Recycled credit (sample data only)',
    composition: '100% reclaimed Tectona grandis (Teak) / Dalbergia (Rosewood)',
    images: [
      {
        label: 'Front View',
        url: '/images/products/p002/front.jpg',
        alt: 'Reclaimed Timber Planks — Stack of seasoned salvaged teak wood planks front view',
      },
      {
        label: 'Side View',
        url: '/images/products/p002/side.jpg',
        alt: 'Reclaimed Timber Planks — Side edge profile displaying 38 mm thickness and de-nailed edges',
      },
      {
        label: 'Top View',
        url: '/images/products/p002/top.jpg',
        alt: 'Reclaimed Timber Planks — Top plan view showing deep golden-brown reclaimed teak grain',
      },
      {
        label: 'Detail / Close-up',
        url: '/images/products/p002/detail.jpg',
        alt: 'Reclaimed Timber Planks — Macro of oil-rich aged wood grain texture and natural patina',
      },
    ],
  },

  // ── 3. Cork Insulation Boards ────────────────────────────────────────────────
  {
    id: 'p003',
    name: 'Cork Insulation Boards',
    category: 'Insulation',
    price: 980,
    unit: 'per sq. ft.',
    stock: 'In Stock',
    stockQty: 200,
    ecoRating: 5,
    isRecycled: false,
    isFeatured: true,
    isBestSeller: false,
    description:
      'Expanded pure cork agglomerate boards harvested from the bark of cork oak trees (Quercus suber) without felling — the bark regenerates every 9 years. These rigid boards provide excellent thermal resistance (λ = 0.038 W/m·K), outstanding acoustic dampening and natural moisture management, making them ideal for wall, roof and floor insulation in sustainable builds.',
    specifications: [
      { label: 'Dimensions', value: '1000 × 500 mm (standard board)' },
      { label: 'Thickness', value: '25 mm / 40 mm / 50 mm / 80 mm' },
      { label: 'Density', value: '100–140 kg/m³' },
      { label: 'Thermal conductivity', value: 'λ = 0.038 W/m·K' },
      { label: 'Fire class', value: 'E (Euroclass)' },
    ],
    environmentalBenefits: [
      'Zero tree felling — bark harvested sustainably every 9 years',
      'Naturally fire-retardant without chemical additives',
      'Carbon-negative over full lifecycle',
      'Biodegradable at end of life',
      'Excellent acoustic insulation reduces noise pollution',
    ],
    materialSource: 'Quercus suber cork oak forests, Portugal and Spain (MSC/FSC certified forests)',
    certification: '*Illustrative: FSC Forest Management, Cradle-to-Gate EPD (sample data only)',
    composition: '100% natural expanded cork granules, no synthetic binders',
    images: [
      {
        label: 'Front View',
        url: '/images/products/p003/front.jpg',
        alt: 'Cork Insulation Boards — Expanded dark agglomerated cork thermal insulation board front view',
      },
      {
        label: 'Side View',
        url: '/images/products/p003/side.jpg',
        alt: 'Cork Insulation Boards — Cross-section edge showing 50 mm cellular cork insulation thickness',
      },
      {
        label: 'Top View',
        url: '/images/products/p003/top.jpg',
        alt: 'Cork Insulation Boards — Flat top face displaying compressed granular cork texture',
      },
      {
        label: 'Detail / Close-up',
        url: '/images/products/p003/detail.jpg',
        alt: 'Cork Insulation Boards — Macro of expanded cork granule matrix and cellular air pockets',
      },
    ],
  },

  // ── 4. Recycled Plastic Roofing Panels ──────────────────────────────────────
  {
    id: 'p004',
    name: 'Recycled Plastic Roofing Panels',
    category: 'Roofing',
    price: 2200,
    unit: 'per sheet',
    stock: 'In Stock',
    stockQty: 150,
    ecoRating: 4,
    isRecycled: true,
    isFeatured: false,
    isBestSeller: false,
    description:
      'Durable corrugated roofing panels manufactured from post-consumer recycled HDPE and PP plastic waste, diverting thousands of tonnes of plastic from landfill. UV-stabilised and weather-resistant for 20+ years, these lightweight panels are easier to handle than concrete or clay alternatives and provide excellent rain runoff. Suitable for residential roofs, carports, warehouses and agricultural structures.',
    specifications: [
      { label: 'Dimensions', value: '3000 × 900 mm (standard sheet)' },
      { label: 'Thickness', value: '2.8 mm corrugated profile' },
      { label: 'Material', value: '100% recycled HDPE / PP plastic' },
      { label: 'Weight', value: '4.5 kg per sheet' },
      { label: 'Colour options', value: 'Terracotta / Grey / Green / Slate Blue' },
    ],
    environmentalBenefits: [
      'Made from 100% post-consumer recycled plastic waste',
      'Diverts plastics from landfill and ocean pollution',
      '20+ year service life reduces replacement frequency',
      'Fully recyclable at end of product life',
      'Lighter than concrete reduces transport emissions',
    ],
    materialSource: 'Post-consumer HDPE & PP plastic collected from municipal recycling streams, India',
    certification: '*Illustrative: Recycled Content Certificate (RCC), GreenPro rated (sample data only)',
    composition: '70% HDPE + 30% PP recycled polymer blend, UV stabilisers',
    images: [
      {
        label: 'Front View',
        url: '/images/products/p004/front.jpg',
        alt: 'Recycled Plastic Roofing Panels — Weather-resistant corrugated eco roofing sheets installed on a roof',
      },
      {
        label: 'Side View',
        url: '/images/products/p004/side.jpg',
        alt: 'Recycled Plastic Roofing Panels — Side cross-section profile of corrugated polymer roof panel',
      },
      {
        label: 'Top View',
        url: '/images/products/p004/top.jpg',
        alt: 'Recycled Plastic Roofing Panels — Overhead view showing sinusoidal corrugated ridges',
      },
      {
        label: 'Detail / Close-up',
        url: '/images/products/p004/detail.jpg',
        alt: 'Recycled Plastic Roofing Panels — Macro texture of UV-stabilised recycled polymer surface',
      },
    ],
  },

  // ── 5. Hempcrete Blocks ──────────────────────────────────────────────────────
  {
    id: 'p005',
    name: 'Hempcrete Blocks',
    category: 'Composites',
    price: 320,
    unit: 'per block',
    stock: 'In Stock',
    stockQty: 500,
    ecoRating: 5,
    isRecycled: false,
    isFeatured: true,
    isBestSeller: false,
    description:
      'Precast biocomposite building blocks made from hemp shiv (the woody core of the hemp stalk) bound with natural hydraulic lime. Hempcrete is carbon-negative over its lifecycle — hemp absorbs more CO₂ during growth than is emitted in processing and construction. These blocks offer excellent insulation, regulate humidity naturally and improve indoor air quality, making them ideal for walls, partitions and infill panels in sustainable construction.',
    specifications: [
      { label: 'Block size', value: '300 × 200 × 150 mm (standard)' },
      { label: 'Density', value: '330–380 kg/m³' },
      { label: 'Thermal conductivity', value: 'λ = 0.060–0.065 W/m·K' },
      { label: 'Compressive strength', value: '0.25–0.35 N/mm²' },
      { label: 'Binder', value: 'Natural hydraulic lime (NHL 3.5 / 5)' },
    ],
    environmentalBenefits: [
      'Carbon-negative over full lifecycle — hemp sequesters CO₂',
      'Natural humidity regulation — reduces mould risk',
      'Improves indoor air quality naturally',
      'Biodegradable and compostable at end of life',
      'No synthetic chemicals or petrochemical content',
    ],
    materialSource: 'Hemp shiv from certified industrial hemp crops (Cannabis sativa L.), India and France',
    certification: '*Illustrative: Carbon-negative verified, Cradle-to-Gate EPD (sample data only)',
    composition: '78% hemp shiv, 22% natural hydraulic lime binder',
    images: [
      {
        label: 'Front View',
        url: '/images/products/p005/front.jpg',
        alt: 'Hempcrete Blocks — Stack of precast biocomposite hemp-lime building masonry blocks',
      },
      {
        label: 'Side View',
        url: '/images/products/p005/side.jpg',
        alt: 'Hempcrete Blocks — Side face of rectangular 300×200×150 mm insulating hempcrete block',
      },
      {
        label: 'Top View',
        url: '/images/products/p005/top.jpg',
        alt: 'Hempcrete Blocks — Top plan view showing porous lime-bound hemp shiv matrix surface',
      },
      {
        label: 'Detail / Close-up',
        url: '/images/products/p005/detail.jpg',
        alt: 'Hempcrete Blocks — Macro close-up of hemp hurds and hydraulic lime binder micro-structure',
      },
    ],
  },

  // ── 6. Recycled Composite Decking ────────────────────────────────────────────
  {
    id: 'p006',
    name: 'Recycled Composite Decking',
    category: 'Composites',
    price: 1650,
    unit: 'per sq. ft.',
    stock: 'Low Stock',
    stockQty: 45,
    ecoRating: 4,
    isRecycled: true,
    isFeatured: false,
    isBestSeller: true,
    description:
      'Premium wood-plastic composite (WPC) decking boards made from a blend of recycled wood fibre (sawdust and timber offcuts) and recycled polyethylene plastic. The grooved anti-slip surface mimics the natural look of timber while requiring zero painting, sealing or oiling. Resistant to rot, termites, UV fading and moisture — ideal for outdoor decks, terraces, poolside areas and walkways.',
    specifications: [
      { label: 'Dimensions', value: '3660 × 140 × 25 mm (plank)' },
      { label: 'Surface', value: 'Grooved anti-slip embossed woodgrain' },
      { label: 'Material', value: '55% recycled wood fibre + 45% recycled PE' },
      { label: 'Density', value: '1100–1200 kg/m³' },
      { label: 'Maintenance', value: 'Zero — no paint, sealant or oil required' },
    ],
    environmentalBenefits: [
      'Made from recycled wood waste and recycled plastic bottles',
      'Eliminates need for chemical sealants and preservatives',
      'Outlasts natural timber — 25+ year service life',
      'Termite-proof and rot-resistant without chemical treatment',
      'Fully recyclable at end of product life',
    ],
    materialSource: 'Recycled sawmill offcuts and post-consumer HDPE plastic, Rajasthan, India',
    certification: '*Illustrative: Recycled Content Certificate, GreenPro, IGBC approved (sample data only)',
    composition: '55% recycled wood fibre, 45% recycled polyethylene, UV stabiliser',
    images: [
      {
        label: 'Front View',
        url: '/images/products/p006/front.jpg',
        alt: 'Recycled Composite Decking — WPC decking planks with grooved anti-slip surface front view',
      },
      {
        label: 'Side View',
        url: '/images/products/p006/side.jpg',
        alt: 'Recycled Composite Decking — Side cross-section showing 25 mm thickness and hollow-core profile',
      },
      {
        label: 'Top View',
        url: '/images/products/p006/top.jpg',
        alt: 'Recycled Composite Decking — Top view showing parallel anti-slip grooved composite boards',
      },
      {
        label: 'Detail / Close-up',
        url: '/images/products/p006/detail.jpg',
        alt: 'Recycled Composite Decking — Macro of embossed woodgrain hybrid polymer composite texture',
      },
    ],
  },

  // ── 7. Eco-Friendly Decorative Planters & Flower Vases ───────────────────────
  {
    id: 'p007',
    name: 'Eco-Friendly Planters & Flower Vases',
    category: 'Home & Garden',
    price: 650,
    unit: 'per piece',
    stock: 'In Stock',
    stockQty: 300,
    ecoRating: 5,
    isRecycled: true,
    isFeatured: true,
    isBestSeller: false,
    description:
      'Handcrafted decorative planters and flower vases made from sustainable and recycled materials including natural terracotta clay, recycled glass and reclaimed ceramic offcuts. Each piece is kiln-fired at low temperatures using renewable biomass fuel, keeping embodied energy minimal. The natural clay body is breathable, which regulates soil moisture and promotes healthier root systems. Available in a variety of artisan shapes and sizes — perfect for indoor greenery, balcony gardens and gifting.',
    specifications: [
      { label: 'Materials', value: 'Natural terracotta clay / Recycled glass / Reclaimed ceramics' },
      { label: 'Sizes available', value: 'Small (10 cm) / Medium (20 cm) / Large (30 cm)' },
      { label: 'Firing method', value: 'Low-temperature kiln, biomass fuel' },
      { label: 'Drainage', value: 'Drainage hole included (planters)' },
      { label: 'Finish', value: 'Natural unglazed / Artisan slip glaze / Matte' },
    ],
    environmentalBenefits: [
      'Natural clay requires minimal processing energy',
      'Recycled glass diverts waste from landfill',
      'Biodegradable at end of life — no microplastic pollution',
      'Breathable walls promote healthier plant root systems',
      'Supports local artisan communities and traditional crafts',
    ],
    materialSource: 'Alluvial terracotta clay and recycled glass, Khurja and Jaipur pottery clusters, Rajasthan',
    certification: '*Illustrative: GreenPro, IGBC Interior Materials credit (sample data only)',
    composition: 'Natural terracotta clay with recycled glass and ceramic aggregate inclusions',
    images: [
      {
        label: 'Front View',
        url: '/images/products/p007/front.jpg',
        alt: 'Eco-Friendly Planters & Vases — Handcrafted natural terracotta clay decorative flower vase, front view',
      },
      {
        label: 'Side View',
        url: '/images/products/p007/side.jpg',
        alt: 'Eco-Friendly Planters & Vases — Side profile angle of artisanal terracotta vase showing graceful form',
      },
      {
        label: 'Top View',
        url: '/images/products/p007/top.jpg',
        alt: 'Eco-Friendly Planters & Vases — Overhead top view of terracotta vase opening, rim and interior',
      },
      {
        label: 'Detail / Close-up',
        url: '/images/products/p007/detail.jpg',
        alt: 'Eco-Friendly Planters & Vases — Macro of natural porous terracotta clay body and artisan surface finish',
      },
    ],
  },
];

// ── Helper exports required by other pages ───────────────────────────────────

/** Returns a single product by id, or undefined if not found */
export function getProductById(id) {
  return products.find((p) => p.id === id);
}

/** Returns all products marked isFeatured */
export function getFeaturedProducts() {
  return products.filter((p) => p.isFeatured);
}

/** Returns all products marked isBestSeller */
export function getBestSellers() {
  return products.filter((p) => p.isBestSeller);
}
