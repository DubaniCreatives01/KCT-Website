# Town Hall Municipality - High-Fidelity Static Clone

A pixel-perfect, high-fidelity static clone of the **Town Hall** WordPress Theme ("Home Three" demo layout) and its **23 connected subpages**. Engineered to be production-ready and fully optimized for direct deployment to **GitHub Pages**.

## 🌟 Key Features

* **Exact Replication:** Cloned every visual element, spacing grid, color swatch, font, card layout, alignment, and hover behavior of the original WordPress theme.
* **All Original Assets Localized:** Includes **all 350 original high-resolution WebP images, custom logos (`Logo-white.svg` / `76-town-hall-logo-2.svg`), indicators, and icons** downloaded directly from the target site. No mockups or generic placeholders.
* **Modern CSS Variable Architecture:** The original site loaded **65 bloated stylesheets**. We re-engineered the entire design system using a single, unified, lightweight **Vanilla CSS custom variables stylesheet** (`assets/css/variables.css`), importing Google Fonts (`Urbanist` and `Inter`) for maximum performance and readability.
* **Interactive JS Components:** Zero-dependency, high-performance vanilla JS widgets:
  * **Dynamic Sticky Navigation:** Smooth scrolling fixed-header shifts on scrolls.
  * **Collapsible Mobile Nav:** Toggled hamburger overlay with interactive mobile sub-dropdown panels.
  * **Hero Image Slider & Testimonials Carousel:** Elegant touch-drag and autoplay sliding transitions.
  * **Count-up Statistics:** Dynamic numeric increase indicators when blocks emerge in viewport.
  * **Weather Simulation Widget:** Shows fair conditions dynamically suited to the time of day.
  * **Full-screen Search Overlay Modal:** Activates search focus on trigger keys.
* **Modular Page Build Engine:** Built a lightweight Node.js compile script (`build.js`) that allows shared templates (`header.html`, `footer.html`, `head.html`) to compile into 23 separate, clean-URL static pages, ensuring easy long-term maintenance!

---

## 📁 Project Directory Structure

```
New KCT website design/
│
├── index.html                                   # Compiled Homepage Portal (Home Three)
├── README.md                                    # Project documentation
├── build.js                                     # Lightweight page compilation compiler
│
├── assets/                                      # Reusable layout assets
│   ├── css/
│   │   ├── variables.css                        # Centralized HSL/Hex design tokens & typography
│   │   ├── base.css                             # Document resets, typography, and flex/grid helpers
│   │   ├── header.css                           # Utility top-bars, navigation dropdowns, mega-menus
│   │   ├── footer.css                           # Newsletter form, widget columns, scroll back-to-top
│   │   └── components.css                       # Sliders, service cards, date event badges, news panels
│   ├── js/
│   │   ├── main.js                              # Mobile toggles, search overlays, count-up stats, weather
│   │   └── slider.js                            # Slideshow carousels transitions (hero slider & reviews)
│   └── images/                                  # 350+ original high-res municipal WebP photos & SVGs
│
├── src/                                         # Dev Development sources
│   ├── partials/                                # Reusable layout components
│   │   ├── head.html                            # Metadata head tag includes
│   │   ├── header.html                          # Complete navigation menu and utility blocks
│   │   ├── footer.html                          # Form inputs, quick links lists, footer icons
│   │   └── scripts.html                         # bottom page script wrappers
│   └── pages/                                   # Flat page unique content body blocks
│       ├── index.html                           # Home Three dashboard body
│       ├── about-us.html                        # History, mission, and vision
│       ├── contacts.html                        # Feedback inputs and maps container
│       ├── blog-page.html                       # 2-column news listing with sidebars
│       ├── ... (other listing files)
│       ├── departments/                         # 6 individual municipal divisions
│       ├── projects/                            # 6 active development initiatives
│       └── posts/                               # 2 individual news recap posts
│
└── reference_pages/                             # Raw crawled WordPress reference files
```

---

## 🛠️ Local Development & Builds

The project uses relative path configurations (`{{relativePath}}`) resolving directories elegantly, meaning **it can be opened and viewed immediately on any local machine by double-clicking the `index.html` files directly in your file explorer!**

### Future Editing & Compilations
If you modify the shared header/footer in `src/partials/` or change page content in `src/pages/`, you can compile the entire site in less than a second by running:

```bash
# Ensure Node.js is installed (v16+)
node build.js
```

The script will automatically recalculate folder depths, inject layout wraps, and compile the final static pages into the repository root directory!

### Local Development Server
To preview the website locally on a loop with clean URL paths, you can use any simple web server:

```bash
# Option A: Using NPM / Serve (Recommended)
npx serve

# Option B: Using Python
python -m http.server 8000
```
Then navigate to `http://localhost:3000` or `http://localhost:8000` in your web browser.

---

## 🚀 Deployment to GitHub Pages

Since the compiler outputs clean-URL directories directly into the repository root, deploying to GitHub Pages is incredibly simple:

1. **Initialize Git & Push to GitHub:**
   Create a new, empty repository on GitHub, then execute the following in your local terminal:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Rebuilt Town Hall static website"
   git branch -M main
   git remote add origin https://github.com/your-username/your-repo-name.git
   git push -u origin main
   ```

2. **Enable GitHub Pages:**
   * Go to your repository on **GitHub.com**.
   * Navigate to **Settings** (tab at the top) -> **Pages** (in the left sidebar).
   * Under **Build and deployment** -> **Source**, select **Deploy from a branch**.
   * Under **Branch**, select `main` and set the folder directory to `/ (root)`.
   * Click **Save**.

3. **Enjoy Clean URLs!**
   GitHub will deploy your site to `https://your-username.github.io/your-repo-name/` within minutes.
   * Homepage: `https://your-username.github.io/your-repo-name/`
   * About Us page: `https://your-username.github.io/your-repo-name/about-us/`
   * Public Works Department: `https://your-username.github.io/your-repo-name/departments/public-works/`
   * All links are fully relative, ensuring 100% path compatibility without broken assets.
