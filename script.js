document.addEventListener('DOMContentLoaded', () => {
    // Mobile navigation toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('nav ul');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('open');
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (navMenu.classList.contains('open')) {
                    navToggle.setAttribute('aria-expanded', 'false');
                    navMenu.classList.remove('open');
                }
            }
        });
    });

    // Form validation
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();
            
            if (name && email && message) {
                // Here you would typically send the form data to a server
                alert('Thank you for your message! I will get back to you soon.');
                this.reset();
            } else {
                alert('Please fill in all fields.');
            }
        });
    }

    // SEARCH FUNCTIONALITY
// ======================
function initSearch() {
    const searchInput = document.getElementById('project-search');
    const projectCards = document.querySelectorAll('.project-card');
    const filterTags = document.querySelectorAll('.filter-tags .tag');
    
    if (!searchInput) return; // Exit if no search bar found
    
    function filterProjects() {
        const searchTerm = searchInput.value.toLowerCase();
        const activeFilter = document.querySelector('.filter-tags .tag.active')?.dataset.filter || 'all';
        
        projectCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            const tags = card.dataset.tags || '';
            
            const matchesSearch = title.includes(searchTerm) || description.includes(searchTerm);
            const matchesFilter = activeFilter === 'all' || tags.includes(activeFilter);
            
            card.style.display = (matchesSearch && matchesFilter) ? 'block' : 'none';
        });
    }
    
    // Tag filtering
    filterTags.forEach(tag => {
        tag.addEventListener('click', function() {
            filterTags.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            filterProjects();
        });
    });
    
    // Search input
    searchInput.addEventListener('input', filterProjects);
}

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', initSearch);
});
