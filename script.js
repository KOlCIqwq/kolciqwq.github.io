// Mobile menu toggle
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav-links');
toggle?.addEventListener('click', () => nav.classList.toggle('open'));

// Reveal on scroll
const revealables = document.querySelectorAll('[data-reveal]');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('reveal-in');
      revealObs.unobserve(entry.target);
    }
  });
}, {threshold: 0.12});
revealables.forEach(el => revealObs.observe(el));

// Infinite scroll for skills
function initInfiniteScroll() {
  const skillsContainer = document.querySelector('.skill-icons');
  const firstUl = skillsContainer.querySelector('ul:first-child');
  
  if (!skillsContainer || !firstUl) return;
  
  // Remove the second ul if it exists (we'll create clones instead)
  const secondUl = skillsContainer.querySelector('ul[aria-hidden="true"]');
  if (secondUl) {
    secondUl.remove();
  }
  
  // Clone the first ul multiple times for seamless loop
  const clone1 = firstUl.cloneNode(true);
  const clone2 = firstUl.cloneNode(true);
  
  // Set aria-hidden for clones
  clone1.setAttribute('aria-hidden', 'true');
  clone2.setAttribute('aria-hidden', 'true');
  
  // Append clones
  skillsContainer.appendChild(clone1);
  skillsContainer.appendChild(clone2);
  
  // Reset animation when it completes one cycle
  let animationReset = false;
  
  firstUl.addEventListener('animationiteration', () => {
    if (!animationReset) {
      // Briefly pause animation, reset position, then resume
      firstUl.style.animationPlayState = 'paused';
      clone1.style.animationPlayState = 'paused';
      clone2.style.animationPlayState = 'paused';
      
      requestAnimationFrame(() => {
        firstUl.style.transform = 'translateX(0)';
        clone1.style.transform = 'translateX(0)';
        clone2.style.transform = 'translateX(0)';
        
        requestAnimationFrame(() => {
          firstUl.style.animationPlayState = 'running';
          clone1.style.animationPlayState = 'running';
          clone2.style.animationPlayState = 'running';
        });
      });
      
      animationReset = true;
      setTimeout(() => animationReset = false, 100);
    }
  });
}

// Initialize infinite scroll when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initInfiniteScroll);
} else {
  initInfiniteScroll();
}

document.addEventListener('DOMContentLoaded', () => {
  const modalOverlay = document.getElementById('modal-overlay');
  const modalContent = document.getElementById('modal-content');
  const modalBody = document.getElementById('modal-body');
  const closeBtn = document.getElementById('modal-close-btn');
  let isModalOpen = false;
  
  // Function to calculate centered position
  function calculateCenteredPosition() {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const finalWidth = Math.min(viewportWidth * 0.9, 900);
    const finalHeight = Math.min(viewportHeight * 0.85, 800);
    const finalTop = (viewportHeight - finalHeight) / 2;
    const finalLeft = (viewportWidth - finalWidth) / 2;
    
    return { finalWidth, finalHeight, finalTop, finalLeft };
  }
  
  // Function to update modal position (for resize events)
  function updateModalPosition() {
    if (!isModalOpen) return;
    
    const { finalWidth, finalHeight, finalTop, finalLeft } = calculateCenteredPosition();
    
    modalContent.style.top = `${finalTop}px`;
    modalContent.style.left = `${finalLeft}px`;
    modalContent.style.width = `${finalWidth}px`;
    modalContent.style.height = `${finalHeight}px`;
  }
  
  // Add resize listener
  window.addEventListener('resize', updateModalPosition);
  
  // Function to load markdown content
  async function loadMarkdownContent(filename) {
    try {
      const response = await fetch(`/blog/${filename}.md`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const markdown = await response.text();
      return marked.parse(markdown);
    } catch (error) {
      console.error('Error loading markdown:', error);
      return `
        <div class="error-message">
          <h3>Content Not Found</h3>
          <p>Sorry, the project details could not be loaded at this time.</p>
        </div>
      `;
    }
  }

  // Handle modal opening
  document.querySelectorAll('[data-modal-id]').forEach(button => {
    button.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const modalId = button.getAttribute('data-modal-id');
      const projectCard = button.closest('.project');
      
      if (!modalId || !projectCard) return;
      
      // Get the position and dimensions of the clicked card
      const cardRect = projectCard.getBoundingClientRect();
      
      // Calculate final centered position
      const { finalWidth, finalHeight, finalTop, finalLeft } = calculateCenteredPosition();
      
      // Set initial position and size to match the card (relative to viewport)
      modalContent.style.position = 'fixed';
      modalContent.style.top = `${cardRect.top}px`;
      modalContent.style.left = `${cardRect.left}px`;
      modalContent.style.width = `${cardRect.width}px`;
      modalContent.style.height = `${cardRect.height}px`;
      modalContent.style.transform = 'scale(1)';
      modalContent.style.visibility = 'visible';
      modalContent.style.opacity = '1';
      modalContent.style.overflow = 'hidden';
      
      // Load markdown content
      const content = await loadMarkdownContent(modalId);
      modalBody.innerHTML = `<div class="project-details">${content}</div>`;
      
      // Show overlay and set modal as open
      modalOverlay.classList.add('active');
      isModalOpen = true;
      
      // Trigger the animation to final position
      setTimeout(() => {
        modalContent.style.top = `${finalTop}px`;
        modalContent.style.left = `${finalLeft}px`;
        modalContent.style.width = `${finalWidth}px`;
        modalContent.style.height = `${finalHeight}px`;
        modalContent.style.overflow = 'auto';
        modalContent.style.padding = '40px';
      }, 50);
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    });
  });

  // Handle modal closing
  function closeModal() {
    isModalOpen = false;
    modalContent.style.overflow = 'hidden';
    modalContent.style.padding = '18px';
    modalOverlay.classList.remove('active');
    
    // Re-enable body scroll
    document.body.style.overflow = '';
    
    // Reset modal content after animation completes
    setTimeout(() => {
      modalContent.style.visibility = 'hidden';
      modalContent.style.opacity = '0';
      modalBody.innerHTML = '';
    }, 400);
  }

  // Close button event
  closeBtn.addEventListener('click', closeModal);

  // Click outside to close
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });

  // ESC key to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });
});

const bioContent = document.getElementById('bioContent');
const bioShort = document.getElementById('bioShort');
const bioLong = document.getElementById('bioLong');
const bioToggle = document.getElementById('bioToggle');

// State
let isExpanded = false;

// Functions
function toggleBio() {
    if (isExpanded) {
        // Switch to short bio
        bioLong.style.display = 'none';
        bioShort.style.display = 'block';
        bioContent.classList.remove('bio-long');
        bioContent.classList.add('bio-short');
        bioToggle.classList.remove('expanded');
        isExpanded = false;
    } else {
        // Switch to long bio
        bioShort.style.display = 'none';
        bioLong.style.display = 'block';
        bioContent.classList.remove('bio-short');
        bioContent.classList.add('bio-long');
        bioToggle.classList.add('expanded');
        isExpanded = true;
    }
}

// Event listeners
bioToggle.addEventListener('click', toggleBio);