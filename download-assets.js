const fs = require('fs');
const https = require('https');
const path = require('path');

const referenceDir = path.join(__dirname, 'reference_pages');
const outputDir = path.join(__dirname, 'assets', 'images');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Map to hold unique remote URL -> local file name mappings
const downloadedUrls = new Map();

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    }, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to download: ${res.statusCode} for url ${url}`));
        return;
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function run() {
  console.log('Scanning reference pages for image URLs...');
  const files = fs.readdirSync(referenceDir).filter(f => f.endsWith('.html'));
  const imageUrls = new Set();

  for (const file of files) {
    const filePath = path.join(referenceDir, file);
    const html = fs.readFileSync(filePath, 'utf8');

    // 1. Scan for <img src="..."> tags
    const imgRegex = /<img[^>]*src=["']([^"']+)["']/g;
    let match;
    while ((match = imgRegex.exec(html)) !== null) {
      let src = match[1];
      if (src.startsWith('https://town-hall.cmsmasters.studio/')) {
        imageUrls.add(src);
      }
    }

    // 2. Scan for background images in inline styles
    const bgRegex = /url\(['"]?([^'")]+)['"]?\)/g;
    while ((match = bgRegex.exec(html)) !== null) {
      let src = match[1];
      if (src.startsWith('https://town-hall.cmsmasters.studio/')) {
        imageUrls.add(src);
      } else if (src.includes('wp-content/uploads/')) {
        // Absolute path if it starts with /
        if (src.startsWith('/')) {
          imageUrls.add('https://town-hall.cmsmasters.studio' + src);
        } else {
          imageUrls.add('https://town-hall.cmsmasters.studio/main/' + src);
        }
      }
    }

    // 3. Scan for source tag srcset attributes
    const srcsetRegex = /srcset=["']([^"']+)["']/g;
    while ((match = srcsetRegex.exec(html)) !== null) {
      const srcset = match[1];
      const items = srcset.split(',');
      for (const item of items) {
        const parts = item.trim().split(/\s+/);
        if (parts[0] && parts[0].startsWith('https://town-hall.cmsmasters.studio/')) {
          imageUrls.add(parts[0]);
        }
      }
    }
  }

  console.log(`Found ${imageUrls.size} unique image assets to download.`);

  // Let's download them
  let count = 0;
  for (const url of imageUrls) {
    count++;
    // Clean URL
    const cleanUrl = url.split('?')[0];
    const basename = path.basename(cleanUrl);
    
    // Skip empty basenames or directory lookalikes
    if (!basename || !basename.includes('.')) {
      continue;
    }

    const destPath = path.join(outputDir, basename);
    console.log(`[${count}/${imageUrls.size}] Downloading ${basename}...`);
    try {
      await downloadFile(cleanUrl, destPath);
      downloadedUrls.set(url, basename);
      console.log(` -> Saved to ${destPath}`);
      // Wait a little to avoid hitting the rate limit
      await new Promise(r => setTimeout(r, 200));
    } catch (e) {
      console.error(` -> Failed to download ${cleanUrl}:`, e.message);
    }
  }

  console.log('\n--- ASSET SCRAPING COMPLETE ---');
  console.log(`Successfully downloaded ${downloadedUrls.size} assets to assets/images/`);
}

run();
