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