const https = require('https');
const fs = require('fs');
const path = require('path');

const PAGES = {
  'home-three': 'https://town-hall.cmsmasters.studio/main/home-three/',
  'about-us': 'https://town-hall.cmsmasters.studio/main/about-us/',
  'blog-page': 'https://town-hall.cmsmasters.studio/main/blog-page/',
  'contacts': 'https://town-hall.cmsmasters.studio/main/contacts/',
  'our-departments': 'https://town-hall.cmsmasters.studio/main/our-departments/',
  'our-projects': 'https://town-hall.cmsmasters.studio/main/our-projects/',
  'our-team': 'https://town-hall.cmsmasters.studio/main/our-team/',
  'our-events': 'https://town-hall.cmsmasters.studio/main/our-events/',
  'shop': 'https://town-hall.cmsmasters.studio/main/shop/',
  
  // Departments
  'dept-community-development': 'https://town-hall.cmsmasters.studio/main/departments/community-development/',
  'dept-education-youth': 'https://town-hall.cmsmasters.studio/main/departments/education-youth/',
  'dept-finance-department': 'https://town-hall.cmsmasters.studio/main/departments/finance-department/',
  'dept-parks-recreation': 'https://town-hall.cmsmasters.studio/main/departments/parks-recreation/',
  'dept-public-works': 'https://town-hall.cmsmasters.studio/main/departments/public-works/',
  'dept-transportation': 'https://town-hall.cmsmasters.studio/main/departments/transportation/',
  
  // Projects
  'proj-affordable-housing': 'https://town-hall.cmsmasters.studio/main/projects/affordable-housing-initiative/',
  'proj-community-gardens': 'https://town-hall.cmsmasters.studio/main/projects/community-gardens-project/',
  'proj-evergreen-solar': 'https://town-hall.cmsmasters.studio/main/projects/evergreen-solar-program/',
  'proj-green-mobility': 'https://town-hall.cmsmasters.studio/main/projects/green-mobility-network/',
  'proj-smart-waste': 'https://town-hall.cmsmasters.studio/main/projects/smart-waste-recycling-system/',
  'proj-urban-air-quality': 'https://town-hall.cmsmasters.studio/main/projects/urban-air-quality-monitoring-grid/',
  
  // Sample Blog Posts / Articles
  'post-life-back-heart-city': 'https://town-hall.cmsmasters.studio/main/bringing-life-back-to-the-heart-of-the-city/',
  'post-improving-public-trans': 'https://town-hall.cmsmasters.studio/main/improving-public-transportation-for-all/'
};

const outputDir = path.join(__dirname, 'reference_pages');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        // Handle redirect
        console.log(`Redirecting to ${res.headers.location}...`);
        fetchUrl(res.headers.location).then(resolve).catch(reject);
        return;
      }
      
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => { resolve({ data, statusCode: res.statusCode }); });
    }).on('error', (err) => { reject(err); });
  });
}

async function run() {
  for (const [name, url] of Object.entries(PAGES)) {
    console.log(`Downloading ${name} from ${url}...`);
    try {
      const response = await fetchUrl(url);
      const filePath = path.join(outputDir, `${name}.html`);
      fs.writeFileSync(filePath, response.data);
      console.log(`Saved ${filePath} (Status: ${response.statusCode}, Length: ${response.data.length})`);
      // Wait a bit to be polite
      await new Promise(r => setTimeout(r, 500));
    } catch (e) {
      console.error(`Failed to download ${name}:`, e);
    }
  }
}

run();
