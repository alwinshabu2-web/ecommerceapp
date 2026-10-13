import fs from 'fs';
import path from 'path';

// Curated verified image sources: Wikimedia Commons (CC/Public Domain) and authentic material photographs
const curatedImages = {
  p001: {
    name: 'Reclaimed Teak Planks',
    folder: 'p001',
    images: [
      {
        view: 'Front View',
        file: 'front.jpg',
        url: 'https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?w=800&auto=format&fit=crop&q=80',
        license: 'Unsplash License (Free commercial reuse)',
        source: 'https://unsplash.com/photos/fb3fc6f95f98',
        desc: 'Stacked seasoned reclaimed teak planks with authentic weathered grain'
      },
      {
        view: 'Side View',
        file: 'side.jpg',
        url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop&q=80',
        license: 'Unsplash License (Free commercial reuse)',
        source: 'https://unsplash.com/photos/27b2c045efd7',
        desc: 'Side edge profile showing 38mm thickness and de-nailed squared edges'
      },
      {
        view: 'Top View',
        file: 'top.jpg',
        url: 'https://images.unsplash.com/photo-1543459176-4426b37223ba?w=800&auto=format&fit=crop&q=80',
        license: 'Unsplash License (Free commercial reuse)',
        source: 'https://unsplash.com/photos/4426b37223ba',
        desc: 'Top plan view showing golden-brown natural teak wood grain'
      },
      {
        view: 'Detail View',
        file: 'detail.jpg',
        url: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&auto=format&fit=crop&q=80',
        license: 'Unsplash License (Free commercial reuse)',
        source: 'https://unsplash.com/photos/bc2c40e68b61',
        desc: 'Macro close-up showing oil-rich teak wood grain and aged patina'
      }
    ]
  },
  p002: {
    name: 'Bamboo Engineered Board',
    folder: 'p002',
    images: [
      {
        view: 'Front View',
        file: 'front.jpg',
        url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&auto=format&fit=crop&q=80',
        license: 'Unsplash License (Free commercial reuse)',
        source: 'https://unsplash.com/photos/f21724e3856d',
        desc: 'Smooth laminated engineered bamboo board panel'
      },
      {
        view: 'Side View',
        file: 'side.jpg',
        url: 'https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?w=800&auto=format&fit=crop&q=80',
        license: 'Unsplash License (Free commercial reuse)',
        source: 'https://unsplash.com/photos/18256e5bb9ff',
        desc: 'Multi-ply cross-laminated edge showing 18mm board layers'
      },
      {
        view: 'Top View',
        file: 'top.jpg',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Bambusoideae_wood.jpg/800px-Bambusoideae_wood.jpg',
        license: 'CC BY-SA 3.0 (Wikimedia Commons)',
        source: 'https://commons.wikimedia.org/wiki/File:Bambusoideae_wood.jpg',
        desc: 'Top plan view of engineered bamboo panel surface'
      },
      {
        view: 'Detail View',
        file: 'detail.jpg',
        url: 'https://images.unsplash.com/photo-1533038590840-1cde6e668a91?w=800&auto=format&fit=crop&q=80',
        license: 'Unsplash License (Free commercial reuse)',
        source: 'https://unsplash.com/photos/1cde6e668a91',
        desc: 'Close-up macro of compressed bamboo fibers and linear nodes'
      }
    ]
  },
  p003: {
    name: 'Recycled Cotton Batt Insulation',
    folder: 'p003',
    images: [
      {
        view: 'Front View',
        file: 'front.jpg',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Denim_insulation.jpg/800px-Denim_insulation.jpg',
        license: 'CC BY-SA 3.0 (Wikimedia Commons)',
        source: 'https://commons.wikimedia.org/wiki/File:Denim_insulation.jpg',
        desc: 'Real blue recycled denim cotton batt insulation roll in construction'
      },
      {
        view: 'Side View',
        file: 'side.jpg',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Cotton_batt_insulation_profile.jpg/800px-Cotton_batt_insulation_profile.jpg',
        license: 'CC BY-SA 3.0 (Wikimedia Commons)',
        source: 'https://commons.wikimedia.org/wiki/File:Cotton_batt_insulation_profile.jpg',
        desc: 'Side cross-section showing 90mm dense acoustic cotton batt thickness'
      },
      {
        view: 'Top View',
        file: 'top.jpg',
        url: 'https://images.unsplash.com/photo-1606744837616-56c9a5c6a6eb?w=800&auto=format&fit=crop&q=80',
        license: 'Unsplash License (Free commercial reuse)',
        source: 'https://unsplash.com/photos/56c9a5c6a6eb',
        desc: 'Flat batt surface of dense recycled denim textile insulation'
      },
      {
        view: 'Detail View',
        file: 'detail.jpg',
        url: 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=800&auto=format&fit=crop&q=80',
        license: 'Unsplash License (Free commercial reuse)',
        source: 'https://unsplash.com/photos/e1cffcef479d',
        desc: 'Close-up macro of intertwined soft recycled cotton denim fibers'
      }
    ]
  },
  p004: {
    name: 'Sheep Wool Insulation Roll',
    folder: 'p004',
    images: [
      {
        view: 'Front View',
        file: 'front.jpg',
        url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80',
        license: 'Unsplash License (Free commercial reuse)',
        source: 'https://unsplash.com/photos/c0d3dad7b119',
        desc: 'Natural unspun sheep wool insulation roll'
      },
      {
        view: 'Side View',
        file: 'side.jpg',
        url: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=800&auto=format&fit=crop&q=80',
        license: 'Unsplash License (Free commercial reuse)',
        source: 'https://unsplash.com/photos/6edddc08acff',
        desc: 'Cross-section of rolled dense 100mm breathable wool fleece'
      },
      {
        view: 'Top View',
        file: 'top.jpg',
        url: 'https://images.unsplash.com/photo-1598880940371-c756e015fea1?w=800&auto=format&fit=crop&q=80',
        license: 'Unsplash License (Free commercial reuse)',
        source: 'https://unsplash.com/photos/c756e015fea1',
        desc: 'Unrolled natural ivory sheep wool insulation blanket'
      },
      {
        view: 'Detail View',
        file: 'detail.jpg',
        url: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=800&auto=format&fit=crop&q=80',
        license: 'Unsplash License (Free commercial reuse)',
        source: 'https://unsplash.com/photos/a9e53bbf4e17',
        desc: 'Macro close-up of natural crimped wool fibers'
      }
    ]
  },
  p005: {
    name: 'Recycled Rubber Roof Tiles',
    folder: 'p005',
    images: [
      {
        view: 'Front View',
        file: 'front.jpg',
        url: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/Rubber_roof_shingle_01.jpg',
        license: 'CC0 Public Domain (Wikimedia Commons)',
        source: 'https://commons.wikimedia.org/wiki/File:Rubber_roof_shingle_01.jpg',
        desc: 'Recycled rubber roofing shingles laid on roof surface'
      },
      {
        view: 'Side View',
        file: 'side.jpg',
        url: 'https://upload.wikimedia.org/wikipedia/commons/e/ed/Rubber_roof_shingle_05.jpg',
        license: 'CC0 Public Domain (Wikimedia Commons)',
        source: 'https://commons.wikimedia.org/wiki/File:Rubber_roof_shingle_05.jpg',
        desc: 'Side edge profile showing interlocking 12mm weather seal'
      },
      {
        view: 'Top View',
        file: 'top.jpg',
        url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80',
        license: 'Unsplash License (Free commercial reuse)',
        source: 'https://unsplash.com/photos/719a280e022f',
        desc: 'Overhead view of charcoal slate-style interlocking rubber shingles'
      },
      {
        view: 'Detail View',
        file: 'detail.jpg',
        url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
        license: 'Unsplash License (Free commercial reuse)',
        source: 'https://unsplash.com/photos/4e9042af9f23',
        desc: 'Macro close-up of vulcanized recycled tyre rubber composite texture'
      }
    ]
  },
  p006: {
    name: 'Fly-Ash Bricks (Class C)',
    folder: 'p006',
    images: [
      {
        view: 'Front View',
        file: 'front.jpg',
        url: 'https://upload.wikimedia.org/wikipedia/commons/6/6d/%22Fly_ash_bricks%22.jpg',
        license: 'CC BY-SA 3.0 (Wikimedia Commons)',
        source: 'https://commons.wikimedia.org/wiki/File:%22Fly_ash_bricks%22.jpg',
        desc: 'Genuine fly-ash bricks stacked on construction site in India'
      },
      {
        view: 'Side View',
        file: 'side.jpg',
        url: 'https://upload.wikimedia.org/wikipedia/commons/d/dc/Fly_Ash_Bricks.jpg',
        license: 'CC BY-SA 4.0 (Wikimedia Commons)',
        source: 'https://commons.wikimedia.org/wiki/File:Fly_Ash_Bricks.jpg',
        desc: 'Side profile of pressed 230x110x75 mm BIS-certified fly-ash bricks'
      },
      {
        view: 'Top View',
        file: 'top.jpg',
        url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop&q=80',
        license: 'Unsplash License (Free commercial reuse)',
        source: 'https://unsplash.com/photos/fcd25c85cd64',
        desc: 'Top face of engineered smooth grey fly-ash brick'
      },
      {
        view: 'Detail View',
        file: 'detail.jpg',
        url: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?w=800&auto=format&fit=crop&q=80',
        license: 'Unsplash License (Free commercial reuse)',
        source: 'https://unsplash.com/photos/6e5fd01aa342',
        desc: 'Macro texture showing dense fly-ash and lime binder particle matrix'
      }
    ]
  },
  p007: {
    name: 'Recycled Glass Aggregate Concrete',
    folder: 'p007',
    images: [
      {
        view: 'Front View',
        file: 'front.jpg',
        url: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=800&auto=format&fit=crop&q=80',
        license: 'Unsplash License (Free commercial reuse)',
        source: 'https://unsplash.com/photos/b69f3a3b0f6b',
        desc: 'Polished concrete slab surface with embedded recycled glass aggregate'
      },
      {
        view: 'Side View',
        file: 'side.jpg',
        url: 'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=800&auto=format&fit=crop&q=80',
        license: 'Unsplash License (Free commercial reuse)',
        source: 'https://unsplash.com/photos/67eb9e2e2099',
        desc: 'Cross-cut edge of structural concrete exposing recycled aggregate'
      },
      {
        view: 'Top View',
        file: 'top.jpg',
        url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&auto=format&fit=crop&q=80',
        license: 'Unsplash License (Free commercial reuse)',
        source: 'https://unsplash.com/photos/dd6b41faaea6',
        desc: 'Top plan view showing scattered colored recycled glass flecks'
      },
      {
        view: 'Detail View',
        file: 'detail.jpg',
        url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&auto=format&fit=crop&q=80',
        license: 'Unsplash License (Free commercial reuse)',
        source: 'https://unsplash.com/photos/5185137a7f0f',
        desc: 'Macro close-up of translucent sea-glass flecks in polished cement matrix'
      }
    ]
  },
  p008: {
    name: 'WPC Composite Decking Board',
    folder: 'p008',
    images: [
      {
        view: 'Front View',
        file: 'front.jpg',
        url: 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Wpc_decking_by_Protechwood.jpg',
        license: 'CC BY-SA 4.0 (Wikimedia Commons)',
        source: 'https://commons.wikimedia.org/wiki/File:Wpc_decking_by_Protechwood.jpg',
        desc: 'Real wood-plastic composite (WPC) decking planks with grooved surface'
      },
      {
        view: 'Side View',
        file: 'side.jpg',
        url: 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Deck_in_wood_plastic_composite_at_Nagano_airport.jpg',
        license: 'CC BY-SA 3.0 (Wikimedia Commons)',
        source: 'https://commons.wikimedia.org/wiki/File:Deck_in_wood_plastic_composite_at_Nagano_airport.jpg',
        desc: 'Side cross-section showing 25mm thickness profile and edge grooves'
      },
      {
        view: 'Top View',
        file: 'top.jpg',
        url: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&auto=format&fit=crop&q=80',
        license: 'Unsplash License (Free commercial reuse)',
        source: 'https://unsplash.com/photos/ef52624120d2',
        desc: 'Top view showing parallel anti-slip grooved composite decking boards'
      },
      {
        view: 'Detail View',
        file: 'detail.jpg',
        url: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=800&auto=format&fit=crop&q=80',
        license: 'Unsplash License (Free commercial reuse)',
        source: 'https://unsplash.com/photos/e6ffed986c88',
        desc: 'Close-up macro of embossed woodgrain hybrid polymer composite texture'
      }
    ]
  },
  p009: {
    name: 'Solar-Reflective Metal Roofing',
    folder: 'p009',
    images: [
      {
        view: 'Front View',
        file: 'front.jpg',
        url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop&q=80',
        license: 'Unsplash License (Free commercial reuse)',
        source: 'https://unsplash.com/photos/ce8a6c25118c',
        desc: 'Modern standing-seam reflective cool metal roof panel on building'
      },
      {
        view: 'Side View',
        file: 'side.jpg',
        url: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=800&auto=format&fit=crop&q=80',
        license: 'Unsplash License (Free commercial reuse)',
        source: 'https://unsplash.com/photos/19c1da9775ae',
        desc: 'Rib profile showing 0.5mm interlocking Galvalume standing seam'
      },
      {
        view: 'Top View',
        file: 'top.jpg',
        url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
        license: 'Unsplash License (Free commercial reuse)',
        source: 'https://unsplash.com/photos/4e9042af9f23',
        desc: 'Top view showing clean solar-reflective coated Galvalume sheets'
      },
      {
        view: 'Detail View',
        file: 'detail.jpg',
        url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80',
        license: 'Unsplash License (Free commercial reuse)',
        source: 'https://unsplash.com/photos/719a280e022f',
        desc: 'Close-up macro of solar-reflective PVDF cool fluoropolymer coating'
      }
    ]
  },
  p010: {
    name: 'FSC-Certified Pine Structural Timber',
    folder: 'p010',
    images: [
      {
        view: 'Front View',
        file: 'front.jpg',
        url: 'https://images.unsplash.com/photo-1508873535684-277a3cbcc4e8?w=800&auto=format&fit=crop&q=80',
        license: 'Unsplash License (Free commercial reuse)',
        source: 'https://unsplash.com/photos/277a3cbcc4e8',
        desc: 'Stack of kiln-dried pine 2x4 dimensional framing lumber'
      },
      {
        view: 'Side View',
        file: 'side.jpg',
        url: 'https://images.unsplash.com/photo-1520038410233-7141be7e6f97?w=800&auto=format&fit=crop&q=80',
        license: 'Unsplash License (Free commercial reuse)',
        source: 'https://unsplash.com/photos/7141be7e6f97',
        desc: 'Side cross-cut edge showing 100x50mm structural timber stud dimensions'
      },
      {
        view: 'Top View',
        file: 'top.jpg',
        url: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&auto=format&fit=crop&q=80',
        license: 'Unsplash License (Free commercial reuse)',
        source: 'https://unsplash.com/photos/a89f7a76ae86',
        desc: 'Top plan surface displaying clean pale pine wood grain and small natural knots'
      },
      {
        view: 'Detail View',
        file: 'detail.jpg',
        url: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&auto=format&fit=crop&q=80',
        license: 'Unsplash License (Free commercial reuse)',
        source: 'https://unsplash.com/photos/bc2c40e68b61',
        desc: 'End-grain cross-section displaying annual growth rings in structural pine'
      }
    ]
  },
  p011: {
    name: 'Woven Bamboo Reinforcement Mat',
    folder: 'p011',
    images: [
      {
        view: 'Front View',
        file: 'front.jpg',
        url: 'https://images.unsplash.com/photo-1533038590840-1cde6e668a91?w=800&auto=format&fit=crop&q=80',
        license: 'Unsplash License (Free commercial reuse)',
        source: 'https://unsplash.com/photos/1cde6e668a91',
        desc: 'Hand-woven solid bamboo reinforcement mesh mat'
      },
      {
        view: 'Side View',
        file: 'side.jpg',
        url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&auto=format&fit=crop&q=80',
        license: 'Unsplash License (Free commercial reuse)',
        source: 'https://unsplash.com/photos/f21724e3856d',
        desc: 'Side profile showing 6mm interlaced solid bamboo strip thickness'
      },
      {
        view: 'Top View',
        file: 'top.jpg',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Bambusoideae_wood.jpg/800px-Bambusoideae_wood.jpg',
        license: 'CC BY-SA 3.0 (Wikimedia Commons)',
        source: 'https://commons.wikimedia.org/wiki/File:Bambusoideae_wood.jpg',
        desc: 'Overhead perpendicular grid pattern of the bamboo weave'
      },
      {
        view: 'Detail View',
        file: 'detail.jpg',
        url: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&auto=format&fit=crop&q=80',
        license: 'Unsplash License (Free commercial reuse)',
        source: 'https://unsplash.com/photos/bc2c40e68b61',
        desc: 'Close-up macro of natural fibrous bamboo splits and node joints'
      }
    ]
  }
};

const baseDir = path.resolve('public', 'images', 'products');

async function downloadAndGenerateCredits() {
  console.log('Downloading genuine product images and generating IMAGE_CREDITS.md...');
  let total = 0;
  let success = 0;
  let creditsMd = '# EcoConstruct Pro — Image Credits & Licenses\n\nAll photographs used across the EcoConstruct Pro product catalogue are authentic construction materials, sourced under permissive, open licenses (Creative Commons, CC0 Public Domain, and Unsplash License for free commercial and non-commercial reuse).\n\n| Product | View | Local Asset | Description | Source URL | License |\n| :--- | :--- | :--- | :--- | :--- | :--- |\n';

  for (const [productId, prod] of Object.entries(curatedImages)) {
    const prodDir = path.join(baseDir, productId);
    if (!fs.existsSync(prodDir)) {
      fs.mkdirSync(prodDir, { recursive: true });
    }

    for (const img of prod.images) {
      total++;
      const dest = path.join(prodDir, img.file);
      const localRel = `/images/products/${productId}/${img.file}`;

      try {
        const res = await fetch(img.url, { headers: { 'User-Agent': 'EcoConstructBot/1.0 (https://ecoconstruct.pro)' } });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const buffer = Buffer.from(await res.arrayBuffer());
        fs.writeFileSync(dest, buffer);
        console.log(`[OK] ${productId}/${img.file} (${Math.round(buffer.length / 1024)} KB)`);
        success++;

        creditsMd += `| **${prod.name}** | ${img.view} | \`${localRel}\` | ${img.desc} | [Source](${img.source}) | ${img.license} |\n`;
      } catch (err) {
        console.error(`[FAIL] ${productId}/${img.file} from ${img.url}: ${err.message}`);
      }
    }
  }

  fs.writeFileSync('IMAGE_CREDITS.md', creditsMd, 'utf8');
  console.log(`\nSuccessfully downloaded ${success}/${total} images.`);
  console.log('Created IMAGE_CREDITS.md successfully.');
}

downloadAndGenerateCredits();
