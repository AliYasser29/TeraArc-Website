// Project Data and API Integration
let projectData = {};

// Fetch projects from API
async function fetchProjects() {
    try {
        // Try to fetch from API first
        const response = await fetch('http://127.0.0.1:5000/api/projects', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            mode: 'cors'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const projects = await response.json();
        console.log('Projects fetched successfully:', projects);
        
        // Convert array to object with id as key
        projectData = projects.reduce((acc, project) => {
            acc[project.id] = {
                title: project.title,
                description: project.description,
                image: project.imageUrl,
                video: project.videoUrl,
                github: project.githubUrl
            };
            return acc;
        }, {});

        // Update project cards with real data
        updateProjectCards(projects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        // Fallback to default data if API fails
        const defaultProjects = [
            {
                id: 1,
                title: "E-Commerce Platform",
                description: "A full-featured online shopping platform with real-time inventory management. Features include user authentication, product catalog, shopping cart, payment processing, and admin dashboard.",
                imageUrl: "https://via.placeholder.com/800x600",
                videoUrl: "https://www.youtube.com/embed/your-video-id",
                githubUrl: "https://github.com/your-username/project"
            },
            {
                id: 2,
                title: "Task Management App",
                description: "A modern task management application with real-time updates, team collaboration, and progress tracking. Built with React and Firebase.",
                imageUrl: "https://via.placeholder.com/800x600",
                videoUrl: "https://www.youtube.com/embed/your-video-id",
                githubUrl: "https://github.com/your-username/project"
            },
            {
                id: 3,
                title: "Weather Dashboard",
                description: "A weather dashboard that displays current weather conditions and forecasts using OpenWeather API. Features include location search, 5-day forecast, and weather alerts.",
                imageUrl: "https://via.placeholder.com/800x600",
                videoUrl: "https://www.youtube.com/embed/your-video-id",
                githubUrl: "https://github.com/your-username/project"
            }
        ];

        // Convert default projects to projectData format
        projectData = defaultProjects.reduce((acc, project) => {
            acc[project.id] = {
                title: project.title,
                description: project.description,
                image: project.imageUrl,
                video: project.videoUrl,
                github: project.githubUrl
            };
            return acc;
        }, {});

        // Update project cards with default data
        updateProjectCards(defaultProjects);
    }
}

// Update project cards with real data
function updateProjectCards(projects) {
    const projectsGrid = document.querySelector('.projects-grid');
    if (!projectsGrid) return;

    projectsGrid.innerHTML = projects.map(project => `
        <div class="project-card" data-project="${project.id}">
            <div class="project-content">
                <div class="project-image">
                    <img src="${project.imageUrl}" alt="${project.title}" loading="lazy">
                </div>
                <h3>${project.title}</h3>
            </div>
        </div>
    `).join('');

    // Reinitialize project cards after updating
    initializeProjectCards();
}

// Project Card Functionality
function initializeProjectCards() {
    // Handle project card clicks
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('click', (e) => {
            const projectId = card.dataset.project;
            const project = projectData[projectId];
            
            if (!project) {
                console.error('Project not found:', projectId);
                return;
            }

            // Toggle expanded state
            const isExpanded = card.classList.contains('expanded');
            
            // If already expanded, just collapse
            if (isExpanded) {
                card.classList.remove('expanded');
                return;
            }

            // Add project details if not exists
            if (!card.querySelector('.project-details')) {
                const details = document.createElement('div');
                details.className = 'project-details';
                details.innerHTML = `
                    <p>${project.description}</p>
                    ${project.video ? `
                        <div class="project-video">
                            <iframe src="${project.video}" allowfullscreen loading="lazy"></iframe>
                        </div>
                    ` : ''}
                    <a href="${project.github}" target="_blank" class="github-button">
                        <i class="fab fa-github"></i>
                        <span>View Source Code</span>
                    </a>
                `;
                card.querySelector('.project-content').appendChild(details);
            }

            // Expand card
            card.classList.add('expanded');

            // Scroll card into view if needed
            setTimeout(() => {
                card.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        });
    });

    // Close expanded card when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.project-card')) {
            document.querySelectorAll('.project-card.expanded').forEach(card => {
                card.classList.remove('expanded');
            });
        }
    });

    // Handle escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.project-card.expanded').forEach(card => {
                card.classList.remove('expanded');
            });
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Initialize page transitions
    initializePageTransitions();

    // Initialize mobile menu
    initializeMobileMenu();

    // Fetch projects when page loads
    fetchProjects();

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Parallax Effect for Hero
    const hero = document.querySelector('.hero');
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    });

    // Intersection Observer for Fade-in Animations
    const fadeInElements = document.querySelectorAll('.hero-content > *, .social-icon');
    
    const fadeInOptions = {
        threshold: 0.3,
        rootMargin: '0px'
    };

    const fadeInObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, fadeInOptions);

    fadeInElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        fadeInObserver.observe(element);
    });

    // Mouse Move Effect on Hero
    const heroContent = document.querySelector('.hero-content');
    hero.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const { left, top, width, height } = hero.getBoundingClientRect();
        const x = (clientX - left) / width - 0.5;
        const y = (clientY - top) / height - 0.5;

        heroContent.style.transform = `translate(${x * 20}px, ${y * 20}px)`;
    });

    hero.addEventListener('mouseleave', () => {
        heroContent.style.transform = 'translate(0, 0)';
    });
});

// Page Transition Functionality
function initializePageTransitions() {
    // Create transition overlay
    const transitionOverlay = document.createElement('div');
    transitionOverlay.className = 'transition-overlay';
    document.body.appendChild(transitionOverlay);

    // Handle all internal links
    document.querySelectorAll('a').forEach(link => {
        // Skip external links, anchors, and links with no href
        if (link.href && 
            link.href.startsWith(window.location.origin) && 
            !link.href.includes('#') &&
            !link.classList.contains('social-icon')) {
            
            link.addEventListener('click', e => {
                e.preventDefault();
                const target = link.href;
                
                // Start transition
                transitionOverlay.classList.add('active');
                
                // Navigate after transition
                setTimeout(() => {
                    window.location.href = target;
                }, 600);
            });
        }
    });

    // Handle browser back/forward buttons
    window.addEventListener('pageshow', (event) => {
        if (event.persisted) {
            transitionOverlay.classList.remove('active');
        }
    });

    // Remove transition overlay when page is loaded
    window.addEventListener('load', () => {
        transitionOverlay.classList.remove('active');
    });
}

// Mobile Menu Functionality
function initializeMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('nav ul');
    
    // Create overlay element if it doesn't exist
    let overlay = document.querySelector('.nav-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'nav-overlay';
        document.body.appendChild(overlay);
    }
    
    if (menuToggle && navMenu) {
        // Toggle menu
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
            overlay.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking overlay
        overlay.addEventListener('click', () => {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        });

        // Close menu when clicking a link
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        // Prevent clicks inside menu from closing it
        navMenu.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
}

