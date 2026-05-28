const https = require('https');
const fs = require('fs');
const path = require('path');

const url = 'https://town-hall.cmsmasters.studio/main/wp-content/themes/town-hall/theme-config/assets/css/default-vars.min.css';
const outputPath = path.join(__dirname, 'default-vars.css');

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
    const formatted = css.replace(/;/g, ';\n  ').replace(/{/g, '{\n  ').replace(/}/g, '}\n');
    console.log('\n--- FIRST FEW VARIABLES ---');
    console.log(formatted.substring(0, 3000));
  } catch (e) {
    console.error('Error downloading:', e);
  }
}

run();
