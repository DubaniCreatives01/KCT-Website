const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'reference_pages', 'home-three.html');
const html = fs.readFileSync(filePath, 'utf8');

console.log('--- SEARCHING FOR ELEMENTOR KIT VARIABLES ---');

// Look for style tags that contain elementor-kit or are named after elementor-kit
const styleRegex = /<style id='elementor-kit-([^']+)'>([\s\S]*?)<\/style>/g;
let match;
let found = false;
while ((match = styleRegex.exec(html)) !== null) {
  found = true;
  console.log(`\nFound elementor-kit style block: id='elementor-kit-${match[1]}'`);
  const content = match[2];
  
  // Find :root inside this block
  const rootMatch = content.match(/:root\s*{([^}]+)}/);
  if (rootMatch) {
    console.log('Root declarations inside elementor-kit:');
    const decls = rootMatch[1].split(';').map(d => d.trim()).filter(Boolean);
    decls.forEach(d => {
      if (d.includes('color') || d.includes('font') || d.startsWith('--e-global-')) {
        console.log('  ' + d);
      }
    });
  } else {
    console.log('No :root found in elementor-kit block, first 500 chars:');
    console.log(content.substring(0, 500) + '...');
  }
}

if (!found) {
  console.log('No elementor-kit style block found in HTML. Let us search for stylesheet links containing elementor/css/post- or similar:');
  const linkRegex = /<link[^>]*href=["']([^"']+)["']/g;
  while ((match = linkRegex.exec(html)) !== null) {
    const url = match[1];
    if (url.includes('elementor/css/post-') || url.includes('elementor/css/global-') || url.includes('elementor/css/kit-')) {
      console.log(' - ' + url);
    }
  }
}
