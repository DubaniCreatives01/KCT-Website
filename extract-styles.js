const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'reference_pages', 'home-three.html');
const html = fs.readFileSync(filePath, 'utf8');

console.log('--- COLOR AND CONFIGURATION EXTRACTION ---');

// Search for colors using hex codes
const hexRegex = /#([a-fA-F0-9]{3,8})\b/g;
const colorCount = {};
let match;
while ((match = hexRegex.exec(html)) !== null) {
  const color = '#' + match[1].toLowerCase();
  colorCount[color] = (colorCount[color] || 0) + 1;
}

const sortedColors = Object.entries(colorCount).sort((a, b) => b[1] - a[1]);
console.log('\nTop Hex Colors in HTML:');
sortedColors.slice(0, 20).forEach(([color, count]) => {
  console.log(` - ${color}: ${count} occurrences`);
});

// Search for elementor variable definitions or theme config
// Theme colors are often in --tg- or --wp- or custom properties
const styleTags = html.match(/<style[^>]*>([\s\S]*?)<\/style>/g) || [];
console.log(`\nAnalyzing ${styleTags.length} style tags for CSS custom properties...`);

const variables = new Set();
styleTags.forEach(tag => {
  const varRegex = /(--[a-zA-Z0-9_-]+)\s*:/g;
  let varMatch;
  while ((varMatch = varRegex.exec(tag)) !== null) {
    variables.add(varMatch[1]);
  }
});

console.log(`Found ${variables.size} unique CSS custom variables.`);
console.log('Showing interesting ones (e.g. colors, primary, theme, background):');
Array.from(variables)
  .filter(v => v.includes('color') || v.includes('theme') || v.includes('primary') || v.includes('bg') || v.includes('accent') || v.includes('font') || v.includes('tg-') || v.includes('wp--'))
  .slice(0, 30)
  .forEach(v => console.log(' - ' + v));
