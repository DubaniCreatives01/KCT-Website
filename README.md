# Khayelitsha Community Trust (KCT) - High-Fidelity Static Portal

A premium, high-fidelity static portal for the **Khayelitsha Community Trust (KCT)**. Engineered with a vibrant, modern South African aesthetic, outstanding performance, and clean-URL architecture, fully optimized for direct deployment to **GitHub Pages**.

---

## 🌟 Key Features

* **Brand Color & Visual Rebranding:** Integrated official KCT colors: Slate Blue (`#003c61`), Deep Navy-Teal (`#0E3B4E`), KCT Gold-Orange (`#F5B13A`), and Vibrant Accent Cyan (`#15b7de`) across all subpages and visual states.
* **South African Fabric Patterns:** Implemented subtle repeating geometric SVG chevron/diamond tribal fabric pattern overlays `.african-pattern-dark` on key sectional backgrounds (Governance, Donors, Newsletter, Footer) and absolute masking side overlays on the hero, conveying a premium localized identity while retaining 100% text readability.
* **Ken Burns Slideshow Banner:** Engineered a hardware-accelerated, fading hero slideshow cycling high-res scenery with smooth Ken Burns CSS keyframe zoom transitions (`heroZoomEffect`).
* **Friendly Localized Messenger Popup:** A client-side animated slide-in popup featuring a premium Pixar-style South African character avatar with a circular border, gold accent shadows, and Montserrat typography. Respects user dismissal using `localStorage`.
* **3D Perspective Flip Cards:** Re-engineered the 6 Board Committee cards and 3 quick service cards into high-performance, responsive CSS 3D Y-axis flip cards, snapping smoothly on hover to show full charter details and active links.
* **Aggressive Cache Busting:** Configured asset version parameters (`?v=1.2`) across all shared layout headers and scripts to ensure immediate delivery of visual upgrades on local browsers.
* **Modular Clean-URL Page Builder:** A custom, zero-dependency Node.js compiler (`build.js`) that injects shared partial files (`header.html`, `footer.html`, `head.html`, `scripts.html`) dynamically, allowing easy maintenance and clean-URL page structuring.
* **Asset Clean-up & Purge:** Scanned the codebase and deleted **3,112 unused assets** to recover **260.93 MB of bloat storage space**, leaving a lightweight, high-performance **11.5 MB total codebase**.

---

## 📁 Project Directory Structure

```
New KCT website design/
│
├── index.html                                   # Compiled KCT Homepage
├── README.md                                    # Project documentation
├── build.js                                     # Clean-URL page compiler engine
├── .gitignore                                   # Standard git ignores
│
├── assets/                                      # Shared layout assets
│   ├── css/
│   │   ├── variables.css                        # Central design tokens & brand palettes
│   │   ├── base.css                             # Document resets and typography rules
│   │   ├── header.css                           # Double-tiered solid header & mega-menus
│   │   ├── footer.css                           # African patterns, newsletters, quick links
│   │   └── components.css                       # Slideshow, 3D flip cards, popup alerts
│   ├── js/
│   │   ├── main.js                              # Popup state machine, count-up stats, weather api
│   │   └── slider.js                            # Review carousels and basic sliders
│   └── images/                                  # Curated, optimized KCT brand photos & SVGs
│
└── src/                                         # Dev templates
    ├── partials/                                # Shared components (head, header, footer, scripts)
    └── pages/                                   # Unique content modules for subpages
```

---

## 🛠️ Local Development & Builds

The project uses relative path configurations (`{{relativePath}}`) resolving directories elegantly, meaning **it can be opened and viewed immediately on any local machine by double-clicking the `index.html` files directly in your file explorer!**

### Compilations & Rebuilds
If you modify the shared header/footer in `src/partials/` or change page content in `src/pages/`, you can recompile the entire site in less than a second by running:

```bash
node build.js
```

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
   This has been pre-configured for your repository:
   [https://github.com/DubaniCreatives01/KCT-Website](https://github.com/DubaniCreatives01/KCT-Website)

2. **Enable GitHub Pages:**
   * Go to your repository on **GitHub.com**.
   * Navigate to **Settings** (tab at the top) -> **Pages** (in the left sidebar).
   * Under **Build and deployment** -> **Source**, select **Deploy from a branch**.
   * Under **Branch**, select `main` and set the folder directory to `/ (root)`.
   * Click **Save**.

3. **Enjoy your live site!**
   GitHub will deploy your site to `https://dubanicreatives01.github.io/KCT-Website/` within minutes.
   * Homepage: `https://dubanicreatives01.github.io/KCT-Website/`
   * About Us page: `https://dubanicreatives01.github.io/KCT-Website/about-us/`
   * KCT Team page: `https://dubanicreatives01.github.io/KCT-Website/kct-team/`
   * All links are fully relative, ensuring 100% path compatibility without broken assets.
