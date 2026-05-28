const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'reference_pages', 'home-three.html');
const html = fs.readFileSync(filePath, 'utf8');

console.log('--- EXTRACTING ELEMENTOR GLOBAL KIT STYLES ---');

// Search for elementor-kit inline styles or stylesheet links
const kitRegex = /<style id="elementor-post-37"[\s\S]*?>([\s\S]*?)<\/style>|<style id="elementor-kit-[\s\S]*?>([\s\S]*?)<\/style>/g;
let kitMatch;
let foundKit = false;

// Let's just find all styles that contain global color declarations
const styleTags = html.match(/<style[^>]*>([\s\S]*?)<\/style>/g) || [];
styleTags.forEach((tag, idx) => {
  if (tag.includes('--e-global-color-') || tag.includes('--e-global-typography-')) {
    console.log(`\nStyle Tag #${idx} contains Elementor Globals!`);
    // Extract root or kit rules
    const rootMatch = tag.match(/:root\s*{([^}]+)}/);
    if (rootMatch) {
      console.log('Root declarations:');
      const declarations = rootMatch[1].split(';').map(d => d.trim()).filter(Boolean);
      declarations.forEach(d => {
        if (d.startsWith('--e-global-') || d.startsWith('--w-') || d.startsWith('--cmsmasters-')) {
          console.log('  ' + d);
        }
      });
      foundKit = true;
    } else {
      // Print first 500 characters of this tag
      console.log(tag.substring(0, 800) + '\n... (truncated)');
    }
  }
});

if (!foundKit) {
  console.log('\nCould not find root in style tags. Let us search for general declarations containing global color in the entire HTML:');
  const allRootMatch = html.match(/:root\s*{([^}]+)}/g);
  if (allRootMatch) {
    allRootMatch.forEach((rm, i) => {
      console.log(`Root block #${i}:`);
      console.log(rm.substring(0, 1000) + '\n... (truncated)');
    });
  }
}
