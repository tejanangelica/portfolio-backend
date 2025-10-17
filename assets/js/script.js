'use strict';



// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });



// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
const testimonialsModalFunc = function () {
  if (modalContainer) modalContainer.classList.toggle("active");
  if (overlay) overlay.classList.toggle("active");
}

// add click event to all modal items
for (let i = 0; i < testimonialsItem.length; i++) {

  testimonialsItem[i].addEventListener("click", function () {

    if (modalImg && modalTitle && modalText) {
      modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
      modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
      modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
      modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;
    }

    testimonialsModalFunc();

  });

}

// add click event to modal close button (only if elements exist)
if (modalCloseBtn) {
  modalCloseBtn.addEventListener("click", testimonialsModalFunc);
}
if (overlay) {
  overlay.addEventListener("click", testimonialsModalFunc);
}



// custom select variables for portfolio
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-select-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

if (select) {
  select.addEventListener("click", function () { elementToggleFunc(this); });
}

// add event in all select items for portfolio
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    if (selectValue) {
      selectValue.innerText = this.innerText;
    }
    if (select) {
      elementToggleFunc(select);
    }
    filterFunc(selectedValue);

  });
}

// filter variables for portfolio
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {

  for (let i = 0; i < filterItems.length; i++) {

    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }

  }

}

// add event in all filter button items for large screen (portfolio)
let lastClickedBtn = filterBtn.length > 0 ? filterBtn[0] : null;

for (let i = 0; i < filterBtn.length; i++) {

  filterBtn[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    if (selectValue) {
      selectValue.innerText = this.innerText;
    }
    filterFunc(selectedValue);

    if (lastClickedBtn) {
      lastClickedBtn.classList.remove("active");
    }
    this.classList.add("active");
    lastClickedBtn = this;

  });

}

// Blog filtering functionality
// custom select variables for blog
const blogSelect = document.querySelector("[data-blog-select]");
const blogSelectItems = document.querySelectorAll("[data-blog-select-item]");
const blogSelectValue = document.querySelector("[data-blog-select-value]");
const blogFilterBtn = document.querySelectorAll("[data-blog-filter-btn]");

if (blogSelect) {
  blogSelect.addEventListener("click", function () { elementToggleFunc(this); });
}

// add event in all select items for blog
for (let i = 0; i < blogSelectItems.length; i++) {
  blogSelectItems[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    if (blogSelectValue) {
      blogSelectValue.innerText = this.innerText;
    }
    if (blogSelect) {
      elementToggleFunc(blogSelect);
    }
    blogFilterFunc(selectedValue);

  });
}

// filter variables for blog
const blogFilterItems = document.querySelectorAll("[data-blog-filter-item]");

const blogFilterFunc = function (selectedValue) {
  // Get all blog items and portfolio-style items separately
  const blogItems = document.querySelectorAll("[data-blog-filter-item]:not(.visual-works-item):not(.music-production-item):not(.reels-item)");
  const visualWorksItems = document.querySelectorAll(".visual-works-item[data-blog-filter-item]");
  const musicProductionItems = document.querySelectorAll(".music-production-item[data-blog-filter-item]");
  const reelsItems = document.querySelectorAll(".reels-item[data-blog-filter-item]");

  // Handle blog items (regular blog-style items)
  for (let i = 0; i < blogItems.length; i++) {
    if (selectedValue === "all") {
      blogItems[i].classList.add("active");
      // Set order for blog items to appear first
      blogItems[i].style.order = i;
    } else if (selectedValue === blogItems[i].dataset.category) {
      blogItems[i].classList.add("active");
      blogItems[i].style.order = i;
    } else {
      blogItems[i].classList.remove("active");
    }
  }

  // Handle reels items (portfolio-style grid layout)
  for (let i = 0; i < reelsItems.length; i++) {
    if (selectedValue === "all") {
      reelsItems[i].classList.add("active");
      // Set order for reels items to appear after blog items
      reelsItems[i].style.order = blogItems.length + i;
    } else if (selectedValue === "reels") {
      reelsItems[i].classList.add("active");
      reelsItems[i].style.order = i;
    } else {
      reelsItems[i].classList.remove("active");
    }
  }

  // Handle music production items (portfolio-style grid layout)
  for (let i = 0; i < musicProductionItems.length; i++) {
    if (selectedValue === "all") {
      musicProductionItems[i].classList.add("active");
      // Set order for music production items to appear after blog items and reels items
      musicProductionItems[i].style.order = blogItems.length + reelsItems.length + i;
    } else if (selectedValue === "music production") {
      musicProductionItems[i].classList.add("active");
      musicProductionItems[i].style.order = i;
    } else {
      musicProductionItems[i].classList.remove("active");
    }
  }

  // Handle visual works items (portfolio-style grid layout)
  for (let i = 0; i < visualWorksItems.length; i++) {
    if (selectedValue === "all") {
      visualWorksItems[i].classList.add("active");
      // Set order for visual works items to appear after blog items, reels items, and music production items
      visualWorksItems[i].style.order = blogItems.length + reelsItems.length + musicProductionItems.length + i;
    } else if (selectedValue === "visual works") {
      visualWorksItems[i].classList.add("active");
      visualWorksItems[i].style.order = i;
    } else {
      visualWorksItems[i].classList.remove("active");
    }
  }
}

// add event in all filter button items for large screen (blog)
let lastClickedBlogBtn = blogFilterBtn.length > 0 ? blogFilterBtn[0] : null;

for (let i = 0; i < blogFilterBtn.length; i++) {

  blogFilterBtn[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    if (blogSelectValue) {
      blogSelectValue.innerText = this.innerText;
    }
    blogFilterFunc(selectedValue);

    if (lastClickedBlogBtn) {
      lastClickedBlogBtn.classList.remove("active");
    }
    this.classList.add("active");
    lastClickedBlogBtn = this;

  });

}



// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {

    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }

  });
}

// Form submission handling
if (form) {
  form.addEventListener("submit", async function(e) {
    e.preventDefault();

    // Get form data
    const formData = new FormData(form);
    const data = {
      fullname: formData.get("fullname"),
      email: formData.get("email"),
      message: formData.get("message")
    };

    // Show loading state
    const originalBtnContent = formBtn.innerHTML;
    formBtn.innerHTML = '<ion-icon name="hourglass-outline"></ion-icon><span>Sending...</span>';
    formBtn.setAttribute("disabled", "");

    try {
      // Use relative URL for production, localhost for development
      const apiUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? "http://localhost:3000/api/contact"
        : "/api/contact";

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
      });

      // Check if response is ok
      if (!response.ok) {
        // Try to parse JSON error response
        let errorMessage = "Failed to send message. Please try again.";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (parseError) {
          // If JSON parsing fails, it might be an HTML error page
          console.error("Failed to parse error response as JSON:", parseError);
          errorMessage = `Server error (${response.status}). Please try again later.`;
        }
        showFormMessage(errorMessage, "error");
        return;
      }

      // Parse successful response
      const result = await response.json();

      if (result.success) {
        // Success - show success message
        showFormMessage("Message sent successfully! Thank you for contacting me.", "success");
        form.reset();
        formBtn.setAttribute("disabled", "");
      } else {
        // Error from server
        showFormMessage(result.error || "Failed to send message. Please try again.", "error");
      }

    } catch (error) {
      console.error("Error:", error);

      // Handle different types of errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        showFormMessage("Network error. Please check your internet connection and try again.", "error");
      } else if (error.name === 'SyntaxError') {
        showFormMessage("Server response error. Please try again later.", "error");
      } else {
        showFormMessage("An unexpected error occurred. Please try again.", "error");
      }
    } finally {
      // Restore button
      formBtn.innerHTML = originalBtnContent;
      if (form.checkValidity()) {
        formBtn.removeAttribute("disabled");
      }
    }
  });
}

// Create toast container if it doesn't exist
function createToastContainer() {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  return container;
}

// Function to show modern toast notifications
function showToast(title, message, type = 'success') {
  const container = createToastContainer();

  // Create toast element
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  // Create toast content
  toast.innerHTML = `
    <div class="toast-icon">
      <ion-icon name="${type === 'success' ? 'checkmark' : 'close'}"></ion-icon>
    </div>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-message">${message}</div>
    </div>
    <button class="toast-close" onclick="this.parentElement.classList.add('hide')">
      <ion-icon name="close"></ion-icon>
    </button>
  `;

  // Add to container
  container.appendChild(toast);

  // Trigger show animation
  setTimeout(() => {
    toast.classList.add('show');
  }, 100);

  // Auto-remove after 5 seconds
  setTimeout(() => {
    toast.classList.add('hide');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.remove();
      }
    }, 300);
  }, 5000);
}

// Updated function for form messages (now uses toast)
function showFormMessage(message, type) {
  const title = type === 'success' ? 'Message Sent!' : 'Error';
  showToast(title, message, type);
}



// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {

    for (let i = 0; i < pages.length; i++) {
      if (this.innerHTML.toLowerCase() === pages[i].dataset.page) {
        pages[i].classList.add("active");
        navigationLinks[i].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[i].classList.remove("active");
        navigationLinks[i].classList.remove("active");
      }
    }

  });
}



// Theme toggle functionality
const themeToggleBtn = document.getElementById('theme-toggle');

// Check for saved theme preference or default to dark mode
const currentTheme = localStorage.getItem('theme') || 'dark';

// Apply the saved theme on page load
if (currentTheme === 'light') {
  document.documentElement.classList.add('light-mode');
}

// Update the toggle button state based on current theme
function updateToggleState() {
  const isLightMode = document.documentElement.classList.contains('light-mode');
  // The visual state is handled by CSS based on the light-mode class
  // No additional DOM manipulation needed
}

// Theme toggle function
function toggleTheme() {
  const isLightMode = document.documentElement.classList.contains('light-mode');

  if (isLightMode) {
    // Switch to dark mode
    document.documentElement.classList.remove('light-mode');
    localStorage.setItem('theme', 'dark');
  } else {
    // Switch to light mode
    document.documentElement.classList.add('light-mode');
    localStorage.setItem('theme', 'light');
  }

  updateToggleState();
}

// Add click event listener to theme toggle button
if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', toggleTheme);
}

// Initialize the toggle state on page load
updateToggleState();



// Lightbox functionality
class Lightbox {
  constructor() {
    this.overlay = document.getElementById('lightbox-overlay');
    this.container = this.overlay?.querySelector('.lightbox-container');
    this.image = document.getElementById('lightbox-image');
    this.title = document.getElementById('lightbox-title');
    this.category = document.getElementById('lightbox-category');
    this.closeBtn = document.getElementById('lightbox-close');
    this.zoomInBtn = document.getElementById('zoom-in');
    this.zoomOutBtn = document.getElementById('zoom-out');
    this.zoomLevel = document.getElementById('zoom-level');

    // Zoom properties - now based on 70% viewport coverage as baseline
    this.baselineScale = 1; // Will be calculated when image loads (70% viewport coverage)
    this.currentZoom = 1; // Relative to baseline (1 = 100% = 70% viewport coverage)
    this.minZoom = 0.5; // 50% = half of baseline (35% viewport coverage) - allows zoom out to 50%
    this.maxZoom = 4; // 400% of baseline scale
    this.zoomStep = 0.2; // Smaller steps for smoother zooming

    // Drag properties
    this.isDragging = false;
    this.startX = 0;
    this.startY = 0;
    this.translateX = 0;
    this.translateY = 0;

    // Container and image dimensions
    this.containerWidth = 0;
    this.containerHeight = 0;
    this.imageNaturalWidth = 0;
    this.imageNaturalHeight = 0;

    this.init();
  }

  init() {
    if (!this.overlay) {
      console.warn('Lightbox overlay not found');
      return;
    }



    // Close button event
    this.closeBtn?.addEventListener('click', () => this.close());

    // Overlay click to close
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) {
        this.close();
      }
    });

    // Zoom controls
    this.zoomInBtn?.addEventListener('click', () => this.zoomIn());
    this.zoomOutBtn?.addEventListener('click', () => this.zoomOut());

    // Keyboard navigation
    document.addEventListener('keydown', (e) => this.handleKeydown(e));

    // Mouse drag functionality
    this.image?.addEventListener('mousedown', (e) => this.startDrag(e));
    document.addEventListener('mousemove', (e) => this.drag(e));
    document.addEventListener('mouseup', () => this.endDrag());

    // Touch drag functionality
    this.image?.addEventListener('touchstart', (e) => this.startDrag(e));
    document.addEventListener('touchmove', (e) => this.drag(e));
    document.addEventListener('touchend', () => this.endDrag());

    // Mouse wheel zoom
    this.image?.addEventListener('wheel', (e) => this.handleWheel(e));

    // Prevent context menu on image
    this.image?.addEventListener('contextmenu', (e) => e.preventDefault());

    // Handle window resize to recalculate baseline scale
    window.addEventListener('resize', () => {
      if (this.overlay?.classList.contains('active')) {
        setTimeout(() => {
          this.calculateFitToScreen();
          this.constrainPan();
          this.updateZoom();
        }, 100); // Small delay to ensure layout is updated
      }
    });

    // Initialize portfolio items
    this.initPortfolioItems();
  }

  initPortfolioItems() {
    // Get only Visual Works items that should open in lightbox (items with href="#")
    const visualWorksItems = document.querySelectorAll('.visual-works-item');

    visualWorksItems.forEach(item => {
      const link = item.querySelector('a');
      const img = item.querySelector('img');
      const title = item.querySelector('.project-title');
      const category = item.querySelector('.project-category');

      if (link && img && link.getAttribute('href') === '#') {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          this.open({
            src: img.src,
            alt: img.alt,
            title: title?.textContent || '',
            category: category?.textContent || ''
          });
        });
      }
    });
  }

  open(data) {
    if (!this.overlay || !this.image) {
      console.error('Lightbox elements not found');
      return;
    }



    // Set image data
    this.image.src = data.src;
    this.image.alt = data.alt;
    this.title.textContent = data.title;
    this.category.textContent = data.category;

    // Wait for image to load to calculate baseline scale (70% viewport coverage)
    this.image.onload = () => {
      this.calculateFitToScreen();
      this.resetZoom();
    };

    // Show lightbox
    this.overlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Focus management for accessibility
    this.closeBtn?.focus();
  }

  close() {
    if (!this.overlay) return;

    this.overlay.classList.remove('active');
    document.body.style.overflow = '';

    // Reset zoom and position
    this.resetZoom();
  }

  calculateFitToScreen() {
    if (!this.image || !this.image.naturalWidth || !this.image.naturalHeight) return;

    // Get container dimensions
    const container = this.image.parentElement;
    this.containerWidth = container.clientWidth;
    this.containerHeight = container.clientHeight;

    // Get image natural dimensions
    this.imageNaturalWidth = this.image.naturalWidth;
    this.imageNaturalHeight = this.image.naturalHeight;

    // Calculate image aspect ratio
    const imageAspectRatio = this.imageNaturalWidth / this.imageNaturalHeight;
    const containerAspectRatio = this.containerWidth / this.containerHeight;

    // Define minimal margins for maximum image size (in pixels)
    const marginHorizontal = Math.min(this.containerWidth * 0.02, 30); // 2% or max 30px
    const marginVertical = Math.min(this.containerHeight * 0.02, 30); // 2% or max 30px

    // Calculate available space after minimal margins
    const availableWidth = this.containerWidth - (marginHorizontal * 2);
    const availableHeight = this.containerHeight - (marginVertical * 2);

    // Calculate scale to fit within available space while maintaining aspect ratio
    const scaleX = availableWidth / this.imageNaturalWidth;
    const scaleY = availableHeight / this.imageNaturalHeight;

    // Use the smaller scale to ensure image fits completely within available space
    this.baselineScale = Math.min(scaleX, scaleY);

    // Be extremely aggressive with space usage for all image types (10-15% larger)
    if (imageAspectRatio < 0.8) { // Portrait image
      // Allow portrait images to use even more available height
      const portraitScaleY = (availableHeight * 1.6) / this.imageNaturalHeight;
      const portraitScaleX = availableWidth / this.imageNaturalWidth;
      this.baselineScale = Math.min(portraitScaleY, portraitScaleX);
    }
    else if (imageAspectRatio > 1.5) { // Landscape image
      // Allow landscape images to use even more available width
      const landscapeScaleX = (availableWidth * 1.6) / this.imageNaturalWidth;
      const landscapeScaleY = availableHeight / this.imageNaturalHeight;
      this.baselineScale = Math.min(landscapeScaleX, landscapeScaleY);
    }
    else { // Square or near-square images
      // For square images, use even more space in both dimensions
      const squareScale = Math.min(availableWidth, availableHeight) * 1.5 / Math.max(this.imageNaturalWidth, this.imageNaturalHeight);
      this.baselineScale = Math.max(this.baselineScale, squareScale);
    }

    // Apply an additional 10-15% boost to all images for larger default view
    this.baselineScale *= 1.12; // 12% increase for optimal size

    // Ensure minimum scale to prevent images from becoming too small
    this.baselineScale = Math.max(this.baselineScale, 0.1);

    // Ensure maximum scale to prevent images from being too large at baseline
    this.baselineScale = Math.min(this.baselineScale, 3.0);
  }

  zoomIn() {
    if (this.currentZoom < this.maxZoom) {
      this.currentZoom = Math.min(this.currentZoom + this.zoomStep, this.maxZoom);
      this.constrainPan();
      this.updateZoom();
    }
  }

  zoomOut() {
    if (this.currentZoom > this.minZoom) {
      this.currentZoom = Math.max(this.currentZoom - this.zoomStep, this.minZoom);
      this.constrainPan();
      this.updateZoom();
    }
  }

  resetZoom() {
    this.currentZoom = 1; // 100% = 70% viewport coverage baseline
    this.translateX = 0;
    this.translateY = 0;
    this.updateZoom();
  }

  updateZoom() {
    if (!this.image || !this.zoomLevel) return;

    // Calculate actual scale: baseline scale * current zoom level
    const actualScale = this.baselineScale * this.currentZoom;

    const transform = `translate(${this.translateX}px, ${this.translateY}px) scale(${actualScale})`;
    this.image.style.transform = transform;

    // Display zoom level as percentage relative to 70% viewport baseline
    this.zoomLevel.textContent = `${Math.round(this.currentZoom * 100)}%`;

    // Update button states
    if (this.zoomInBtn) {
      this.zoomInBtn.disabled = this.currentZoom >= this.maxZoom;
    }
    if (this.zoomOutBtn) {
      // Disable zoom out when at minimum zoom (50%) or below
      this.zoomOutBtn.disabled = this.currentZoom <= this.minZoom;
    }

    // Update cursor based on zoom level
    if (this.image) {
      this.image.style.cursor = this.currentZoom > 1 ? 'grab' : '';
    }
  }

  constrainPan() {
    if (this.currentZoom <= 1) {
      // If zoom is at or below baseline (70% viewport), center the image
      this.translateX = 0;
      this.translateY = 0;
      return;
    }

    // Calculate the scaled image dimensions
    const actualScale = this.baselineScale * this.currentZoom;
    const scaledWidth = this.imageNaturalWidth * actualScale;
    const scaledHeight = this.imageNaturalHeight * actualScale;

    // Calculate maximum allowed translation to keep image partially visible
    // Allow some buffer to prevent the image from being dragged completely outside
    const bufferX = Math.min(scaledWidth * 0.1, 100); // 10% of image width or 100px, whichever is smaller
    const bufferY = Math.min(scaledHeight * 0.1, 100); // 10% of image height or 100px, whichever is smaller

    const maxTranslateX = Math.max(0, (scaledWidth - this.containerWidth) / 2 + bufferX);
    const maxTranslateY = Math.max(0, (scaledHeight - this.containerHeight) / 2 + bufferY);

    // Constrain translation within bounds
    this.translateX = Math.max(-maxTranslateX, Math.min(maxTranslateX, this.translateX));
    this.translateY = Math.max(-maxTranslateY, Math.min(maxTranslateY, this.translateY));
  }

  startDrag(e) {
    if (this.currentZoom <= 1) return;

    this.isDragging = true;
    const clientX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
    const clientY = e.type === 'mousedown' ? e.clientY : e.touches[0].clientY;

    this.startX = clientX - this.translateX;
    this.startY = clientY - this.translateY;

    if (this.image) {
      this.image.style.cursor = 'grabbing';
    }
  }

  drag(e) {
    if (!this.isDragging || this.currentZoom <= 1) return;

    e.preventDefault();
    const clientX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
    const clientY = e.type === 'mousemove' ? e.clientY : e.touches[0].clientY;

    this.translateX = clientX - this.startX;
    this.translateY = clientY - this.startY;

    // Apply boundary constraints
    this.constrainPan();
    this.updateZoom();
  }

  endDrag() {
    this.isDragging = false;
    if (this.image) {
      this.image.style.cursor = this.currentZoom > 1 ? 'grab' : '';
    }
  }

  handleKeydown(e) {
    if (!this.overlay?.classList.contains('active')) return;

    switch(e.key) {
      case 'Escape':
        this.close();
        break;
      case '+':
      case '=':
        e.preventDefault();
        this.zoomIn();
        break;
      case '-':
        e.preventDefault();
        this.zoomOut();
        break;
    }
  }

  handleWheel(e) {
    if (!this.overlay?.classList.contains('active')) return;

    e.preventDefault();

    // Zoom in/out based on wheel direction
    if (e.deltaY < 0) {
      // Scrolling up - zoom in
      this.zoomIn();
    } else {
      // Scrolling down - zoom out
      this.zoomOut();
    }
  }
}

// Initialize lightbox when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  try {
    new Lightbox();
  } catch (error) {
    console.error('Error initializing lightbox:', error);
  }
});