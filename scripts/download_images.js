import fs from 'fs';
import path from 'path';

const productImages = {
  p001: [
    // Reclaimed Teak Planks
    { view: 'Front View', url: 'https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?w=800&auto=format&fit=crop&q=80', file: 'front.jpg' },
    { view: 'Side View', url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&auto=format&fit=crop&q=80', file: 'side.jpg' },
    { view: 'Top View', url: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&auto=format&fit=crop&q=80', file: 'top.jpg' },
    { view: 'Detail View', url: 'https://images.unsplash.com/photo-1543459176-4426b37223ba?w=800&auto=format&fit=crop&q=80', file: 'detail.jpg' },
  ],
  p002: [
    // Bamboo Engineered Board
    { view: 'Front View', url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80', file: 'front.jpg' },
    { view: 'Side View', url: 'https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?w=800&auto=format&fit=crop&q=80', file: 'side.jpg' },
    { view: 'Top View', url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&auto=format&fit=crop&q=80', file: 'top.jpg' },
    { view: 'Detail View', url: 'https://images.unsplash.com/photo-1533038590840-1cde6e668a91?w=800&auto=format&fit=crop&q=80', file: 'detail.jpg' },
  ],
  p003: [
    // Recycled Cotton Batt Insulation
    { view: 'Front View', url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80', file: 'front.jpg' },
    { view: 'Side View', url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80', file: 'side.jpg' },
    { view: 'Top View', url: 'https://images.unsplash.com/photo-1606744837616-56c9a5c6a6eb?w=800&auto=format&fit=crop&q=80', file: 'top.jpg' },
    { view: 'Detail View', url: 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=800&auto=format&fit=crop&q=80', file: 'detail.jpg' },
  ],
  p004: [
    // Sheep Wool Insulation Roll
    { view: 'Front View', url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80', file: 'front.jpg' },
    { view: 'Side View', url: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=800&auto=format&fit=crop&q=80', file: 'side.jpg' },
    { view: 'Top View', url: 'https://images.unsplash.com/photo-1598880940371-c756e015fea1?w=800&auto=format&fit=crop&q=80', file: 'top.jpg' },
    { view: 'Detail View', url: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=800&auto=format&fit=crop&q=80', file: 'detail.jpg' },
  ],
  p005: [
    // Recycled Rubber Roof Tiles
    { view: 'Front View', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80', file: 'front.jpg' },
    { view: 'Side View', url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&auto=format&fit=crop&q=80', file: 'side.jpg' },
    { view: 'Top View', url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80', file: 'top.jpg' },
    { view: 'Detail View', url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80', file: 'detail.jpg' },
  ],
  p006: [
    // Fly-Ash Bricks (Class C)
    { view: 'Front View', url: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=800&auto=format&fit=crop&q=80', file: 'front.jpg' },
    { view: 'Side View', url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop&q=80', file: 'side.jpg' },
    { view: 'Top View', url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop&q=80', file: 'top.jpg' },
    { view: 'Detail View', url: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?w=800&auto=format&fit=crop&q=80', file: 'detail.jpg' },
  ],
  p007: [
    // Recycled Glass Aggregate Concrete
    { view: 'Front View', url: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=800&auto=format&fit=crop&q=80', file: 'front.jpg' },
    { view: 'Side View', url: 'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=800&auto=format&fit=crop&q=80', file: 'side.jpg' },
    { view: 'Top View', url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&auto=format&fit=crop&q=80', file: 'top.jpg' },
    { view: 'Detail View', url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&auto=format&fit=crop&q=80', file: 'detail.jpg' },
  ],
  p008: [
    // WPC Composite Decking Board
    { view: 'Front View', url: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&auto=format&fit=crop&q=80', file: 'front.jpg' },
    { view: 'Side View', url: 'https://images.unsplash.com/photo-1508873535684-277a3cbcc4e8?w=800&auto=format&fit=crop&q=80', file: 'side.jpg' },
    { view: 'Top View', url: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=800&auto=format&fit=crop&q=80', file: 'top.jpg' },
    { view: 'Detail View', url: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&auto=format&fit=crop&q=80', file: 'detail.jpg' },
  ],
  p009: [
    // Solar-Reflective Metal Roofing
    { view: 'Front View', url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop&q=80', file: 'front.jpg' },
    { view: 'Side View', url: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=800&auto=format&fit=crop&q=80', file: 'side.jpg' },
    { view: 'Top View', url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80', file: 'top.jpg' },
    { view: 'Detail View', url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80', file: 'detail.jpg' },
  ],
  p010: [
    // FSC-Certified Pine Structural Timber
    { view: 'Front View', url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop&q=80', file: 'front.jpg' },
    { view: 'Side View', url: 'https://images.unsplash.com/photo-1520038410233-7141be7e6f97?w=800&auto=format&fit=crop&q=80', file: 'side.jpg' },
    { view: 'Top View', url: 'https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?w=800&auto=format&fit=crop&q=80', file: 'top.jpg' },
    { view: 'Detail View', url: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&auto=format&fit=crop&q=80', file: 'detail.jpg' },
  ],
  p011: [
    // Woven Bamboo Reinforcement Mat
    { view: 'Front View', url: 'https://images.unsplash.com/photo-1533038590840-1cde6e668a91?w=800&auto=format&fit=crop&q=80', file: 'front.jpg' },
    { view: 'Side View', url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80', file: 'side.jpg' },
    { view: 'Top View', url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&auto=format&fit=crop&q=80', file: 'top.jpg' },
    { view: 'Detail View', url: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&auto=format&fit=crop&q=80', file: 'detail.jpg' },
  ],
};

const baseDir = path.resolve('public', 'images', 'products');

async function downloadAll() {
  console.log('Starting image downloads...');
  let total = 0;
  let success = 0;

  for (const [productId, images] of Object.entries(productImages)) {
    const prodDir = path.join(baseDir, productId);
    if (!fs.existsSync(prodDir)) {
      fs.mkdirSync(prodDir, { recursive: true });
    }

    for (const img of images) {
      total++;
      const dest = path.join(prodDir, img.file);
      try {
        const res = await fetch(img.url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const buffer = Buffer.from(await res.arrayBuffer());
        fs.writeFileSync(dest, buffer);
        console.log(`[OK] ${productId}/${img.file} (${Math.round(buffer.length / 1024)} KB)`);
        success++;
      } catch (err) {
        console.error(`[FAIL] ${productId}/${img.file}: ${err.message}`);
      }
    }
  }

  console.log(`\nDownloaded ${success}/${total} images.`);
}

downloadAll();
