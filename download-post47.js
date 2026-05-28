const https = require('https');
const fs = require('fs');
const path = require('path');

const url = 'https://town-hall.cmsmasters.studio/main/wp-content/uploads/sites/2/elementor/css/post-47.css';
const outputPath = path.join(__dirname, 'post-47.css');

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    }, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to download: ${res.statusCode}`));
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
  console.log(`Downloading ${url}...`);
  try {
    await downloadFile(url, outputPath);
    console.log(`Saved to ${outputPath}`);
    
    // Read and format first 2000 chars of the file to see the vars
    const css = fs.readFileSync(outputPath, 'utf8');
    
    // Find :root
    const rootMatch = css.match(/:root\s*{([^}]+)}/);
    if (rootMatch) {
      console.log('\n--- ROOT VARIABLES IN POST-47.CSS ---');
      const decls = rootMatch[1].split(';').map(d => d.trim()).filter(Boolean);
      decls.forEach(d => {
        if (d.startsWith('--e-global-')) {
          console.log('  ' + d);
        }
      });
    } else {
      console.log('\nNo :root found in post-47.css, showing first 2000 chars:');
      console.log(css.substring(0, 2000));
    }
  } catch (e) {
    console.error('Error downloading:', e);
  }
}

run();
