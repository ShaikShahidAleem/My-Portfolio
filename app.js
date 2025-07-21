// Autumn color palette
const colors = {
  primary: '#4C7C04',
  secondary: '#BBA00D', 
  accent: '#E9CD1F',
  dark: '#371A0D',
  darkRed: '#7A1D12',
  light: '#F5F5F0',
  water: '#E0F2F1'
};

// Canvas and animation variables
let canvas, ctx;
let particles = [];
let ripples = [];
let animationId;

// Initialize canvas for ripple effect
function setupRippleCanvas() {
  canvas = document.getElementById('ripple-canvas');
  if (canvas) {
    ctx = canvas.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
  }
}

function resizeCanvas() {
  if (canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  setupRippleCanvas();
  initRippleEffects();
  // startAnimation();
  initScrollAnimations();
  initNavigation();
});

// Ripple class for click effects
class Ripple {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 0;
    this.maxRadius = 150;
    this.opacity = 0.6;
    this.color = this.getRandomRippleColor();
    this.speed = 3;
    this.active = true;
  }
  
  getRandomRippleColor() {
    const rippleColors = [colors.primary, colors.secondary, colors.accent];
    return rippleColors[Math.floor(Math.random() * rippleColors.length)];
  }
  
  update() {
    if (!this.active) return;
    
    this.radius += this.speed;
    this.opacity = Math.max(0, 0.6 * (1 - this.radius / this.maxRadius));
    
    if (this.radius >= this.maxRadius) {
      this.active = false;
    }
  }
  
  draw() {
    if (!this.active || this.opacity <= 0) return;
    
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.stroke();
    
    // Add inner ripple
    ctx.globalAlpha = this.opacity * 0.5;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius * 0.7, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.restore();
  }
}

// Initialize ripple effects for interactive elements
function initRippleEffects() {
  // Get all interactive elements
  const interactiveElements = document.querySelectorAll('button, .btn, .project-card, .hero-cta');
  
  interactiveElements.forEach(element => {
    // Handle both click and touch events
    element.addEventListener('click', handleRippleEffect);
    element.addEventListener('touchstart', handleRippleEffect, { passive: true });
  });
  
  // Handle form submission
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Create ripple effect at submit button
      const submitBtn = document.getElementById('send-btn');
      if (submitBtn) {
        const rect = submitBtn.getBoundingClientRect();
        createRipple(rect.left + rect.width / 2, rect.top + rect.height / 2);
      }
      
      // Simple form feedback
      setTimeout(() => {
        alert('Thank you for your message! I\'ll get back to you soon.');
        contactForm.reset();
      }, 300);
    });
  }
}

// Handle ripple effect creation
function handleRippleEffect(event) {
  event.preventDefault();
  
  let x, y;
  
  if (event.type === 'touchstart') {
    const touch = event.touches[0];
    x = touch.clientX;
    y = touch.clientY;
  } else {
    x = event.clientX;
    y = event.clientY;
  }
  
  createRipple(x, y);
  
  // Handle navigation for hero CTA
  if (event.target.id === 'hero-cta') {
    setTimeout(() => {
      document.getElementById('portfolio').scrollIntoView({ 
        behavior: 'smooth' 
      });
    }, 200);
  }
}

// Create ripple effect at specified coordinates
function createRipple(x, y) {
  // Convert screen coordinates to canvas coordinates
  const rect = canvas.getBoundingClientRect();
  const canvasX = x - rect.left;
  const canvasY = y - rect.top;
  
  ripples.push(new Ripple(canvasX, canvasY));
  
  // Limit number of active ripples for performance
  if (ripples.length > 8) {
    ripples = ripples.filter(ripple => ripple.active);
  }
}

// Handle visibility change for performance
document.addEventListener('visibilitychange', function() {
  if (document.hidden) {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
  } else {
    startAnimation();
  }
});

// Cleanup on page unload
window.addEventListener('beforeunload', function() {
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
});

// Handle window resize
// window.addEventListener('resize', function() {
//   //sresizeCanvas();
// });

// Smooth scrolling for anchor links
document.addEventListener('click', function(e) {
  if (e.target.tagName === 'A' && e.target.getAttribute('href').startsWith('#')) {
    e.preventDefault();
    const targetId = e.target.getAttribute('href').substring(1);
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }
});

document.addEventListener('DOMContentLoaded', function () {
  // ✅ Enable WebGL ripples on body
  if ($.fn.ripples) {
    $('body').ripples({
      resolution: 1024,
      dropRadius: 20,   // default ripple size
      perturbance: 0.03,
      interactive: false // we'll handle all interactions
    });

    // ✅ Click ripple
    $(document).on('click', function (e) {
      $('body').ripples('drop', e.pageX, e.pageY, 25, 0.05);
    });

    // ✅ Touch ripple (mobile)
    $(document).on('touchstart', function (e) {
      const touch = e.originalEvent.touches[0];
      $('body').ripples('drop', touch.pageX, touch.pageY, 25, 0.05);
    });

    // ✅ Moving through water effect
    let isMouseDown = false;

    $(document).on('mousedown', function () {
      isMouseDown = true;
    });

    $(document).on('mouseup', function () {
      isMouseDown = false;
    });

    $(document).on('mousemove', function (e) {
      if (isMouseDown) {
        // Creates smaller ripples while moving
        $('body').ripples('drop', e.pageX, e.pageY, 12, 0.03);
      }
    });

    // ✅ Touch move for mobile dragging
    $(document).on('touchmove', function (e) {
      const touch = e.originalEvent.touches[0];
      $('body').ripples('drop', touch.pageX, touch.pageY, 12, 0.03);
    });

  } else {
    console.error("Ripples plugin not loaded!");
  }
});

// Add subtle hover effects for project cards
document.addEventListener('DOMContentLoaded', function() {
  const projectCards = document.querySelectorAll('.project-card');
  
  projectCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        this.style.transform = 'translateY(-8px)';
      }
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });

  const heroCta = document.getElementById('hero-cta');
  if (heroCta) {
    heroCta.addEventListener('click', function (e) {
      e.preventDefault();
      const portfolioSection = document.getElementById('portfolio');
      if (portfolioSection) {
        portfolioSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
});

// Performance optimization: Reduce particle count on low-end devices
function optimizeForDevice() {
  const isLowEndDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;
  const isMobile = window.innerWidth < 768;
  
  if (isLowEndDevice || isMobile) {
    particles = particles.slice(0, Math.min(10, particles.length));
  }
}

// Call optimization check
setTimeout(optimizeForDevice, 1000);

// Scroll-triggered animations
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observe sections for animation
  const sections = document.querySelectorAll('section');
  sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    observer.observe(section);
  });

  // Observe project cards for staggered animation
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s`;
    observer.observe(card);
  });

  // Observe skills for animation
  const skillItems = document.querySelectorAll('.skills-list .status');
  skillItems.forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'scale(0.8)';
    item.style.transition = `all 0.4s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.05}s`;
    observer.observe(item);
  });
}

// Navigation functionality
function initNavigation() {
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  
  // Mobile menu toggle
  if (navToggle) {
    navToggle.addEventListener('click', function() {
      navMenu.classList.toggle('active');
      navToggle.classList.toggle('active');
    });
  }
  
  // Close mobile menu when clicking on a link
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      navMenu.classList.remove('active');
      navToggle.classList.remove('active');
    });
  });
  
  // Active link highlighting based on scroll position
  window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });
  
  // Smooth scrolling for navigation links
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });
}