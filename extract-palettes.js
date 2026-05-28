const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'reference_pages', 'home-three.html');
const html = fs.readFileSync(filePath, 'utf8');

// Find the town-hall-child-theme-style-inline-css block
const startIdx = html.indexOf("<style id='town-hall-child-theme-style-inline-css'");
if (startIdx === -1) {
  console.log('Could not find town-hall-child-theme-style-inline-css style block.');
  process.exit(0);
}

const endIdx = html.indexOf('</style>', startIdx);
const styleContent = html.substring(startIdx, endIdx);

// Extract color palettes
const paletteRegex = /html\[data-cmsmasters-color-palette="([^"]+)"\][^{]*{([^}]+)}/g;
let match;
console.log('--- FOUND COLOR PALETTES ---');
while ((match = paletteRegex.exec(styleContent)) !== null) {
  console.log(`\nPalette: ${match[1]}`);
  const decls = match[2].split(';');
  decls.forEach(d => {
    if (d.trim()) {
      console.log('  ' + d.trim());
    }
  });
}
