/* ==========================================================================
   MAIN JS INTERACTIONS - TOWN HALL STATIC REBUILD
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileMenu();
  initSearchOverlay();
  initWeatherWidget();
  initBackToTop();
  initCounters();
  initScrollAnimations();
  initHeaderDate();
  initAnnualReportPopup();
  initHeroBackgroundSlider();
});

/* 1. Sticky Navigation Header */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const stickyThreshold = 180;
  window.addEventListener('scroll', () => {
    if (window.scrollY > stickyThreshold) {
      header.classList.add('is-sticky');
    } else {
      header.classList.remove('is-sticky');
    }
  });
}

/* 2. Mobile Menu (Hamburger and collapse toggles) */
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger-toggle');
  const navMenu = document.querySelector('.nav-menu');
  if (!hamburger || !navMenu) return;

  // Toggle Hamburger menu
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('is-active');
    navMenu.classList.toggle('is-active');
    document.body.classList.toggle('overflow-hidden'); // Prevent scroll when menu is active
  });

  // Handle collapsible dropdowns on mobile displays (< 1024px)
  const dropdownParents = document.querySelectorAll('.nav-item:has(.dropdown-menu), .nav-item:has(.mega-menu), .dropdown-item:has(.sub-dropdown-menu)');
  
  dropdownParents.forEach(parent => {
    const link = parent.querySelector('.nav-link, .dropdown-link');
    const dropdown = parent.querySelector('.dropdown-menu, .mega-menu, .sub-dropdown-menu');
    
    if (link && dropdown) {
      // Append a small toggle button next to the link for mobile expansion
      const toggleBtn = document.createElement('button');
      toggleBtn.className = 'mobile-dropdown-toggle';
      toggleBtn.innerHTML = '<span class="dropdown-arrow-indicator">▼</span>';
      toggleBtn.style.cssText = `
        background: none;
        border: none;
        color: inherit;
        padding: 10px;
        cursor: pointer;
        font-size: 10px;
        margin-left: auto;
      `;
      
      link.appendChild(toggleBtn);

      // Make arrow toggle sub-menus on mobile
      toggleBtn.addEventListener('click', (e) => {
        if (window.innerWidth <= 1024) {
          e.preventDefault();
          e.stopPropagation();
          dropdown.classList.toggle('is-open');
          toggleBtn.style.transform = dropdown.classList.contains('is-open') ? 'rotate(180deg)' : 'rotate(0deg)';
        }
      });
    }
  });
}

/* 3. Search Overlay Modal */
function initSearchOverlay() {
  const searchTriggers = document.querySelectorAll('.btn-search-trigger');
  const searchOverlay = document.querySelector('.search-overlay');
  const searchClose = document.querySelector('.search-close');
  const searchInput = document.querySelector('.search-input');

  if (!searchOverlay || searchTriggers.length === 0) return;

  searchTriggers.forEach(btn => {
    btn.addEventListener('click', () => {
      searchOverlay.classList.add('is-active');
      setTimeout(() => {
        if (searchInput) searchInput.focus();
      }, 300);
    });
  });

  if (searchClose) {
    searchClose.addEventListener('click', () => {
      searchOverlay.classList.remove('is-active');
    });
  }

  // Close search overlay with Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchOverlay.classList.contains('is-active')) {
      searchOverlay.classList.remove('is-active');
    }
  });
}

/* 4. Weather Simulation Widget */
async function initWeatherWidget() {
  const tempSpan = document.getElementById('weather-temp');
  const descSpan = document.getElementById('weather-desc');
  const widgetIcon = document.querySelector('.weather-widget .weather-icon');
  
  const heroTempSpan = document.getElementById('hero-weather-temp');
  const heroDescSpan = document.getElementById('hero-weather-desc');

  // Fallback simulation in case the API request fails
  const applyFallback = () => {
    const conditions = [
      { temp: 22, desc: 'Sunny', icon: 'fa-sun' },
      { temp: 20, desc: 'Mostly Sunny', icon: 'fa-cloud-sun' },
      { temp: 18, desc: 'Partly Cloudy', icon: 'fa-cloud-sun' },
      { temp: 21, desc: 'Fair', icon: 'fa-sun' }
    ];
    const currentHour = new Date().getHours();
    let selected = conditions[currentHour % conditions.length];

    if (tempSpan) tempSpan.textContent = `${selected.temp}°C`;
    if (descSpan) descSpan.textContent = selected.desc;
    if (widgetIcon) {
      widgetIcon.className = `fa-solid ${selected.icon} weather-icon`;
    }

    if (heroTempSpan) heroTempSpan.textContent = `${selected.temp}°C`;
    if (heroDescSpan) {
      heroDescSpan.innerHTML = `<i class="fa-solid ${selected.icon}" style="color: var(--color-tertiary);"></i> ${selected.desc.toLowerCase()}`;
    }
  };

  try {
    // Fetch live weather data for Khayelitsha coordinates (-34.02, 18.68)
    const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=-34.02&longitude=18.68&current=temperature_2m,weather_code');
    if (!res.ok) throw new Error('API response error');
    const data = await res.json();
    
    if (!data.current) throw new Error('Invalid weather data structure');
    
    const rawTemp = Math.round(data.current.temperature_2m);
    const code = data.current.weather_code;

    // Map WMO codes to FontAwesome icons and descriptors
    const wmoMap = {
      0: { desc: 'Sunny', icon: 'fa-sun' },
      1: { desc: 'Mainly Clear', icon: 'fa-cloud-sun' },
      2: { desc: 'Partly Cloudy', icon: 'fa-cloud-sun' },
      3: { desc: 'Overcast', icon: 'fa-cloud' },
      45: { desc: 'Foggy', icon: 'fa-smog' },
      48: { desc: 'Foggy', icon: 'fa-smog' },
      51: { desc: 'Light Drizzle', icon: 'fa-cloud-rain' },
      53: { desc: 'Moderate Drizzle', icon: 'fa-cloud-rain' },
      55: { desc: 'Dense Drizzle', icon: 'fa-cloud-rain' },
      61: { desc: 'Light Rain', icon: 'fa-cloud-rain' },
      63: { desc: 'Moderate Rain', icon: 'fa-cloud-showers-heavy' },
      65: { desc: 'Heavy Rain', icon: 'fa-cloud-showers-heavy' },
      71: { desc: 'Light Snow', icon: 'fa-snowflake' },
      73: { desc: 'Moderate Snow', icon: 'fa-snowflake' },
      75: { desc: 'Heavy Snow', icon: 'fa-snowflake' },
      80: { desc: 'Light Showers', icon: 'fa-cloud-rain' },
      81: { desc: 'Moderate Showers', icon: 'fa-cloud-showers-heavy' },
      82: { desc: 'Heavy Showers', icon: 'fa-cloud-showers-heavy' },
      95: { desc: 'Thunderstorm', icon: 'fa-cloud-bolt' }
    };

    const condition = wmoMap[code] || { desc: 'Mostly Sunny', icon: 'fa-cloud-sun' };

    // Update Header topbar display
    if (tempSpan) tempSpan.textContent = `${rawTemp}°C`;
    if (descSpan) descSpan.textContent = condition.desc;
    if (widgetIcon) {
      widgetIcon.className = `fa-solid ${condition.icon} weather-icon`;
    }

    // Update Homepage Hero display
    if (heroTempSpan) heroTempSpan.textContent = `${rawTemp}°C`;
    if (heroDescSpan) {
      heroDescSpan.innerHTML = `<i class="fa-solid ${condition.icon}" style="color: var(--color-tertiary);"></i> ${condition.desc.toLowerCase()}`;
    }
  } catch (err) {
    console.warn('Failed to retrieve live weather data, applying simulated fallback:', err);
    applyFallback();
  }
}

/* 5. Scroll Back-To-Top Button */
function initBackToTop() {
  const backToTopBtn = document.querySelector('.back-to-top');
  if (!backToTopBtn) return;

  const showThreshold = 400;
  window.addEventListener('scroll', () => {
    if (window.scrollY > showThreshold) {
      backToTopBtn.classList.add('is-visible');
    } else {
      backToTopBtn.classList.remove('is-visible');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* 6. Dynamic Count-Up Statistics counters */
function initCounters() {
  const counters = document.querySelectorAll('.counter-num');
  if (counters.length === 0) return;

  const observerOptions = {
    root: null,
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.getAttribute('data-target'), 10) || 0;
        const duration = 2000; // 2 seconds animation duration
        const stepTime = Math.abs(Math.floor(duration / target)) || 15;
        let current = 0;
        
        const timer = setInterval(() => {
          current += Math.ceil(target / (duration / stepTime));
          if (current >= target) {
            counter.textContent = target.toLocaleString();
            clearInterval(timer);
          } else {
            counter.textContent = current.toLocaleString();
          }
        }, stepTime);
        
        obs.unobserve(counter); // Trigger counter animation only once
      }
    });
  }, observerOptions);

  counters.forEach(counter => {
    observer.observe(counter);
  });
}

/* 7. Scroll Reveal Animations */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.reveal-on-scroll');
  if (animatedElements.length === 0) return;

  const observerOptions = {
    root: null,
    threshold: 0.05,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
      }
    });
  }, observerOptions);

  animatedElements.forEach(el => {
    observer.observe(el);
  });
}

/* 8. Today's Date display in Top Bar */
function initHeaderDate() {
  const dateSpan = document.getElementById('header-today-date');
  if (!dateSpan) return;
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const today = new Date();
  dateSpan.textContent = today.toLocaleDateString('en-US', options);
}

/* 9. Animated Pop-up for 2024 Integrated Annual Report */
function initAnnualReportPopup() {
  // Check if user has already dismissed the popup
  if (localStorage.getItem('kct-annual-report-dismissed') === 'true') {
    return;
  }

  // Calculate relative path prefix based on depth of current page for assets
  const pathname = window.location.pathname;
  let prefix = './';
  const subdirs = ['/about-us', '/contacts', '/kct-team', '/our-projects', '/kct-mall', '/media'];
  if (subdirs.some(dir => pathname.includes(dir))) {
    prefix = '../';
  }

  // Fixed Google Drive link to the 2024 Integrated Annual Report
  const reportLink = 'https://drive.google.com/file/d/19FippZMiO7I92uySr--cIinbIFVxnGEW/view?usp=sharing';

  // Create popup container element
  const popup = document.createElement('div');
  popup.id = 'annual-report-popup';
  popup.className = 'annual-report-card';
  
  // Style with big, readable premium styling
  popup.style.cssText = `
    position: fixed;
    bottom: 35px;
    left: 28px;
    width: 380px;
    background: linear-gradient(135deg, #003c61, #00253d);
    border-left: 6px solid var(--color-primary, #ff9900);
    border-radius: 10px;
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
    color: white;
    padding: 24px;
    z-index: 9999;
    transform: translateX(-125%);
    transition: transform 0.8s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.3s ease;
    font-family: 'Montserrat', sans-serif;
  `;

  // Inner HTML — includes a friendly South African waving/speaking character delivering the message
  popup.innerHTML = `
    <button id="annual-report-close" aria-label="Close popup" style="
      position: absolute;
      top: 12px;
      right: 12px;
      background: none;
      border: none;
      color: rgba(255, 255, 255, 0.6);
      font-size: 22px;
      cursor: pointer;
      line-height: 1;
      padding: 0;
      transition: color 0.2s, transform 0.2s;
    " onmouseover="this.style.color='white'; this.style.transform='scale(1.2)';" onmouseout="this.style.color='rgba(255,255,255,0.6)'; this.style.transform='scale(1)';">×</button>
    
    <div style="display: flex; gap: 16px; align-items: flex-start;">
      <div style="
        width: 75px;
        height: 75px;
        border-radius: 50%;
        overflow: hidden;
        flex-shrink: 0;
        border: 3px solid #15b7de;
        box-shadow: 0 0 15px rgba(21, 183, 222, 0.4);
        background: rgba(255, 255, 255, 0.05);
      ">
        <img src="${prefix}assets/images/sa_character_avatar.png" alt="KCT Assistant" style="width: 100%; height: 100%; object-fit: cover;">
      </div>
      <div style="flex-grow: 1;">
        <span style="
          font-family: 'Montserrat', sans-serif;
          font-size: 13px;
          font-weight: 700;
          color: #15b7de;
          text-transform: uppercase;
          letter-spacing: 1px;
          display: block;
          margin-bottom: 8px;
        ">KCT Community Desk</span>
        <p style="
          font-family: 'Montserrat', sans-serif;
          font-size: 13px;
          font-weight: 400;
          line-height: 1.5em;
          color: white;
          opacity: 0.95;
          margin: 0 0 16px 0;
        ">
          Sawubona! The new <strong>2024 Integrated Annual Report</strong> is officially available. Click below to explore our community's growth and milestones! 🇿🇦
        </p>
        
        <a href="${reportLink}" target="_blank" rel="noopener noreferrer" class="popup-btn-action" style="
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background-color: var(--color-primary, #ff9900);
          color: white;
          padding: 10px 20px;
          border-radius: 4px;
          font-weight: 700;
          font-size: 12px;
          text-transform: uppercase;
          text-decoration: none;
          letter-spacing: 0.5px;
          transition: background-color 0.2s, transform 0.2s;
        " onmouseover="this.style.backgroundColor='#e68a00'; this.style.transform='translateY(-1px)';" onmouseout="this.style.backgroundColor='var(--color-primary, #ff9900)'; this.style.transform='translateY(0)';">Download Report ↗</a>
      </div>
    </div>
  `;

  document.body.appendChild(popup);

  // Hover animations on the entire card to make it feel rich and premium
  popup.addEventListener('mouseenter', () => {
    popup.style.boxShadow = '0 15px 40px rgba(21, 183, 222, 0.25)';
    popup.style.transform = 'translateX(0) translateY(-4px)';
  });
  popup.addEventListener('mouseleave', () => {
    popup.style.boxShadow = '0 10px 35px rgba(0, 0, 0, 0.4)';
    popup.style.transform = 'translateX(0) translateY(0)';
  });

  // Slide in after a brief delay
  setTimeout(() => {
    popup.style.transform = 'translateX(0)';
  }, 1500);

  // Set up dismiss click action
  const closeBtn = document.getElementById('annual-report-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      // Slide out animation
      popup.style.transform = 'translateX(-125%)';
      // Mark as dismissed in localStorage to respect user preference
      localStorage.setItem('kct-annual-report-dismissed', 'true');
      // Clean up DOM after slide-out completes
      setTimeout(() => {
        popup.remove();
      }, 800);
    });
  }
}

/* 10. Hero Background Fading Slideshow */
function initHeroBackgroundSlider() {
  const slides = document.querySelectorAll('.hero-bg-slide');
  if (slides.length === 0) return;

  let currentIndex = 0;
  const intervalTime = 6000; // Change background every 6 seconds

  setInterval(() => {
    // Remove active class from current slide
    slides[currentIndex].classList.remove('active');

    // Go to next slide
    currentIndex = (currentIndex + 1) % slides.length;

    // Add active class to next slide
    slides[currentIndex].classList.add('active');
  }, intervalTime);
}
