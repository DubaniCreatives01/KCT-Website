const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({
        executablePath: 'C:\\\\Program Files\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe'
    });
    const page = await browser.newPage();
    
    // Capture request failures
    page.on('requestfailed', request => {
        console.log(`[REQUEST FAILED]: ${request.url()} - ${request.failure().errorText}`);
    });
    
    // Capture browser console logs
    page.on('console', msg => {
        console.log(`[BROWSER CONSOLE]: ${msg.type().toUpperCase()} - ${msg.text()}`);
    });
    
    // Capture page-level script errors
    page.on('pageerror', err => {
        console.log(`[PAGE ERROR]: ${err.message}`);
    });
    
    // Set viewport
    await page.setViewport({ width: 1280, height: 800 });
    
    // Load local file
    const fileUrl = ('file:///' + __dirname.replace(/\\/g, '/') + '/index.html');
    console.log("Loading", fileUrl);
    await page.goto(fileUrl, { waitUntil: 'networkidle0' });

    // Inject outline CSS
    await page.addStyleTag({
        content: `
        * { outline: 1px solid red !important; }
        *::before, *::after { outline: 1px solid blue !important; }
        `
    });

    // Evaluate in browser context
    const elementsInfo = await page.evaluate(() => {
        const results = [];
        const allElements = document.querySelectorAll('*');
        
        for (const el of allElements) {
            const rect = el.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0 && rect.top <= 50) {
                const style = window.getComputedStyle(el);
                const bg = style.backgroundColor;
                const bgImage = style.backgroundImage;
                
                results.push({
                    tag: el.tagName.toLowerCase(),
                    id: el.id,
                    className: el.className,
                    x: rect.x,
                    y: rect.y,
                    width: rect.width,
                    height: rect.height,
                    top: rect.top,
                    left: rect.left,
                    bg: bg,
                    bgImage: bgImage,
                    opacity: style.opacity,
                    visibility: style.visibility,
                    display: style.display,
                    position: style.position,
                    zIndex: style.zIndex
                });
            }
            
            // Check pseudo-elements
            for (const pseudo of ['::before', '::after']) {
                const pseudoStyle = window.getComputedStyle(el, pseudo);
                const content = pseudoStyle.content;
                if (content && content !== 'none') {
                    results.push({
                        tag: el.tagName.toLowerCase() + pseudo,
                        id: el.id,
                        className: el.className,
                        bg: pseudoStyle.backgroundColor,
                        display: pseudoStyle.display,
                        position: pseudoStyle.position,
                        width: pseudoStyle.width,
                        height: pseudoStyle.height,
                        top: pseudoStyle.top,
                        left: pseudoStyle.left
                    });
                }
            }
        }
        return results;
    });

    console.log("Found " + elementsInfo.length + " elements/pseudo-elements near the top.");
    
    // Filter elements that might be white
    const suspicious = elementsInfo.filter(el => {
        if (el.bg === 'rgb(255, 255, 255)' || el.bg === 'rgba(255, 255, 255, 1)' || el.bg === '#ffffff' || el.bg === 'white') {
            return true;
        }
        // Also look for elements that have NO background but might be rendering text?
        // Wait, the user said "white rectangular block"
        return false;
    });

    console.log("Suspicious elements (white background near top):");
    console.table(suspicious);
    
    // Just in case, let's see ALL elements at top left (x < 100, y < 100)
    const topLeftElements = elementsInfo.filter(el => el.x < 100 && el.y < 100 && el.tag !== 'html' && el.tag !== 'body');
    console.log("All elements at top left (x < 100, y < 100):");
    console.log(JSON.stringify(topLeftElements, null, 2));

    await browser.close();
})();
