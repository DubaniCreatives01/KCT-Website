const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const pagesDir = path.join(srcDir, 'pages');
const partialsDir = path.join(srcDir, 'partials');
const outputDir = __dirname; // Compiled files written in workspace root

// Load partials
const headTemplate = fs.readFileSync(path.join(partialsDir, 'head.html'), 'utf8');
const headerTemplate = fs.readFileSync(path.join(partialsDir, 'header.html'), 'utf8');
const footerTemplate = fs.readFileSync(path.join(partialsDir, 'footer.html'), 'utf8');
const scriptsTemplate = fs.readFileSync(path.join(partialsDir, 'scripts.html'), 'utf8');

const PAGES_MAP = {
  'index.html': 'index.html',
  'about-us.html': 'about-us/index.html',
  'contact-us.html': 'contacts/index.html',
  'kct-team.html': 'kct-team/index.html',
  'our-projects.html': 'our-projects/index.html',
  'kct-mall.html': 'kct-mall/index.html',
  'media.html': 'media/index.html'
};

function calculateRelativePath(destFile) {
  const parts = destFile.split(/[/\\]/);
  if (parts.length <= 1) {
    return './'; // Root level
  }
  // For each subdirectory, add '../'
  return '../'.repeat(parts.length - 1);
}

function parseMetadata(content) {
  const meta = {
    title: 'Town Hall Portal',
    description: 'Town Hall Portal Website',
    pageStyles: '',
    pageScripts: ''
  };

  // Find metadata block between <!-- and --> comments at the top
  const commentMatch = content.match(/^\s*<!--([\s\S]*?)-->/);
  if (commentMatch) {
    const block = commentMatch[1];
    
    // Parse key-value pairs
    const lines = block.split('\n');
    let inStyles = false;
    let inScripts = false;
    let stylesBuffer = [];
    let scriptsBuffer = [];

    for (let line of lines) {
      if (line.trim().startsWith('pageStyles:')) {
        inStyles = true;
        inScripts = false;
        continue;
      }
      if (line.trim().startsWith('pageScripts:')) {
        inScripts = true;
        inStyles = false;
        continue;
      }

      if (inStyles) {
        stylesBuffer.push(line);
        continue;
      }
      if (inScripts) {
        scriptsBuffer.push(line);
        continue;
      }

      const separatorIdx = line.indexOf(':');
      if (separatorIdx !== -1) {
        const key = line.substring(0, separatorIdx).trim().toLowerCase();
        const value = line.substring(separatorIdx + 1).trim();
        if (key === 'title') meta.title = value;
        if (key === 'description') meta.description = value;
      }
    }

    if (stylesBuffer.length > 0) meta.pageStyles = stylesBuffer.join('\n').trim();
    if (scriptsBuffer.length > 0) meta.pageScripts = scriptsBuffer.join('\n').trim();
  }

  // Remove comment metadata block from the content body
  const cleanedContent = content.replace(/^\s*<!--([\s\S]*?)-->/, '');

  return { meta, body: cleanedContent };
}

function compilePage(srcFile, destFile) {
  const srcPath = path.join(pagesDir, srcFile);
  if (!fs.existsSync(srcPath)) {
    console.warn(`[Warning] Source page not found: ${srcPath}`);
    return;
  }

  const rawContent = fs.readFileSync(srcPath, 'utf8');
  const { meta, body } = parseMetadata(rawContent);
  const relativePath = calculateRelativePath(destFile);

  // 1. Replace template tokens in partials
  let pageHead = headTemplate
    .replace(/{{title}}/g, meta.title)
    .replace(/{{description}}/g, meta.description)
    .replace(/{{relativePath}}/g, relativePath)
    .replace(/{{pageStyles}}/g, meta.pageStyles);

  let pageHeader = headerTemplate
    .replace(/{{relativePath}}/g, relativePath);

  let pageFooter = footerTemplate
    .replace(/{{relativePath}}/g, relativePath);

  let pageScripts = scriptsTemplate
    .replace(/{{relativePath}}/g, relativePath)
    .replace(/{{pageScripts}}/g, meta.pageScripts);

  // Replace relative paths in body content as well
  const pageBody = body.replace(/{{relativePath}}/g, relativePath);

  // 2. Stitch the full document
  const fullHtml = pageHead + pageHeader + pageBody + pageFooter + pageScripts;

  // 3. Write output to destination file
  const destPath = path.join(outputDir, destFile);
  const destParentDir = path.dirname(destPath);
  if (!fs.existsSync(destParentDir)) {
    fs.mkdirSync(destParentDir, { recursive: true });
  }

  fs.writeFileSync(destPath, fullHtml);
  console.log(`[Built] Compiled ${srcFile} -> ${destFile} (depth relative: ${relativePath})`);
}

function run() {
  console.log('--- COMPILING STATIC HTML WEBSITE ---');
  for (const [src, dest] of Object.entries(PAGES_MAP)) {
    try {
      compilePage(src, dest);
    } catch (e) {
      console.error(`Failed to compile ${src}:`, e);
    }
  }
  console.log('--- COMPILATION COMPLETE ---');
}

run();
