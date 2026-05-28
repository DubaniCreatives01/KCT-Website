/* ==========================================================================
   SLIDER & CAROUSEL COMPONENT - TOWN HALL STATIC REBUILD
   ========================================================================== */

class TownHallSlider {
  constructor(containerSelector, options = {}) {
    this.container = document.querySelector(containerSelector);
    if (!this.container) return;

    this.slider = this.container.querySelector('.hero-slider, .testimonials-slider');
    if (!this.slider) return;

    this.slides = Array.from(this.slider.children);
    if (this.slides.length === 0) return;

    // Config defaults
    this.options = {
      autoplay: options.autoplay !== undefined ? options.autoplay : true,
      autoplayDelay: options.autoplayDelay || 5000,
      effect: options.effect || 'slide', // 'slide' or 'fade'
      ...options
    };

    this.currentIndex = 0;
    this.autoplayTimer = null;

    this.init();
  }

  init() {
    // Style adjustments for effects
    if (this.options.effect === 'fade') {
      this.slider.style.position = 'relative';
      this.slides.forEach((slide, idx) => {
        slide.style.position = 'absolute';
        slide.style.top = 0;
        slide.style.left = 0;
        slide.style.width = '100%';
        slide.style.height = '100%';
        slide.style.opacity = idx === 0 ? 1 : 0;
        slide.style.transition = 'opacity 0.8s ease-in-out';
        slide.style.zIndex = idx === 0 ? 2 : 1;
      });
    }

    // Set up control buttons
    const prevBtn = this.container.querySelector('.slider-btn-prev');
    const nextBtn = this.container.querySelector('.slider-btn-next');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        this.prev();
        this.resetAutoplay();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        this.next();
        this.resetAutoplay();
      });
    }

    // Initialize Autoplay
    if (this.options.autoplay) {
      this.startAutoplay();
    }
  }

  goTo(index) {
    if (index === this.currentIndex) return;

    // Boundary handling
    if (index < 0) {
      index = this.slides.length - 1;
    } else if (index >= this.slides.length) {
      index = 0;
    }

    const prevIndex = this.currentIndex;
    this.currentIndex = index;

    if (this.options.effect === 'slide') {
      // Move slider along the X axis
      this.slider.style.transform = `translateX(-${this.currentIndex * 100}%)`;
    } else if (this.options.effect === 'fade') {
      // Fade in/out slides
      this.slides[prevIndex].style.opacity = 0;
      this.slides[prevIndex].style.zIndex = 1;
      
      this.slides[this.currentIndex].style.opacity = 1;
      this.slides[this.currentIndex].style.zIndex = 2;
    }
  }

  next() {
    this.goTo(this.currentIndex + 1);
  }

  prev() {
    this.goTo(this.currentIndex - 1);
  }

  startAutoplay() {
    this.autoplayTimer = setInterval(() => {
      this.next();
    }, this.options.autoplayDelay);
  }

  stopAutoplay() {
    if (this.autoplayTimer) {
      clearInterval(this.autoplayTimer);
      this.autoplayTimer = null;
    }
  }

  resetAutoplay() {
    if (this.options.autoplay) {
      this.stopAutoplay();
      this.startAutoplay();
    }
  }
}

// Instantiate Sliders upon page load
document.addEventListener('DOMContentLoaded', () => {
  // Hero slide (slide effect)
  new TownHallSlider('.hero-slider-container', {
    autoplay: true,
    autoplayDelay: 6000,
    effect: 'slide'
  });

  // Testimonial slideshow carousel (fade effect)
  new TownHallSlider('.testimonials-slider-container', {
    autoplay: true,
    autoplayDelay: 5000,
    effect: 'fade'
  });
});
