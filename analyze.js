const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'reference_pages', 'home-three.html');
if (!fs.existsSync(filePath)) {
  console.error('File not found:', filePath);
  process.exit(1);
}

const html = fs.readFileSync(filePath, 'utf8');

console.log('--- ANALYZING HOME THREE PAGE ---');
console.log('HTML Length:', html.length);

// 1. Find stylesheets
const cssRegex = /<link[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["']/g;
const stylesheets = [];
let match;
while ((match = cssRegex.exec(html)) !== null) {
  stylesheets.push(match[1]);
}
console.log(`\nFound ${stylesheets.length} stylesheets. Showing first 10:`);
stylesheets.slice(0, 10).forEach(s => console.log(' - ' + s));

// 2. Find scripts
const jsRegex = /<script[^>]*src=["']([^"']+)["']/g;
const scripts = [];
while ((match = jsRegex.exec(html)) !== null) {
  scripts.push(match[1]);
}
console.log(`\nFound ${scripts.length} JS files. Showing first 10:`);
scripts.slice(0, 10).forEach(s => console.log(' - ' + s));

// 3. Find image assets
const imgRegex = /<img[^>]*src=["']([^"']+)["']/g;
const images = new Set();
while ((match = imgRegex.exec(html)) !== null) {
  images.add(match[1]);
}
console.log(`\nFound ${images.size} distinct image sources. Showing first 15:`);
Array.from(images).slice(0, 15).forEach(img => console.log(' - ' + img));

// 4. Find Google Fonts
const fontRegex = /fonts\.googleapis\.com\/css[^"']*/g;
const fonts = [];
while ((match = fontRegex.exec(html)) !== null) {
  fonts.push(match[0]);
}
console.log(`\nFound fonts:`);
fonts.forEach(f => console.log(' - ' + f));

// 5. Look at custom CSS variables or color schemes in style tags
const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/g;
let styleCount = 0;
let customVars = [];
while ((match = styleRegex.exec(html)) !== null) {
  styleCount++;
  const content = match[1];
  if (content.includes('--tg-') || content.includes('--wp-') || content.includes(':root')) {
    customVars.push(content.substring(0, 500) + '... (truncated)');
  }
}
console.log(`\nFound ${styleCount} style tags. Custom variables count: ${customVars.length}`);
