// API endpoint
const API_URL = 'link/api';

// Function to fetch projects from the API
async function fetchProjects() {
    try {
        console.log('Fetching projects from:', `${API_URL}/projects`);
        const response = await fetch(`${API_URL}/projects`);
        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response:', errorText);
            throw new Error(`Failed to fetch projects: ${response.status} ${errorText}`);
        }
        
        const projects = await response.json();
        console.log('Received projects:', projects);
        
        if (!Array.isArray(projects)) {
            console.error('Invalid response format:', projects);
            throw new Error('Invalid response format from server');
        }
        
        // Log each project's image URL
        projects.forEach(project => {
            console.log(`Project ${project.id} image URL:`, project.imageUrl);
        });
        
        displayProjects(projects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        showError(`Failed to load projects: ${error.message}`);
    }
}

// Function to display projects in the grid
function displayProjects(projects) {
    console.log('Displaying projects:', projects);
    const projectsGrid = document.querySelector('.projects-grid');
    if (!projectsGrid) {
        console.error('Projects grid element not found!');
        return;
    }
    
    // Clear loading spinner if it exists
    const loadingSpinner = projectsGrid.querySelector('.loading-spinner');
    if (loadingSpinner) {
        loadingSpinner.remove();
    }
    
    projectsGrid.innerHTML = ''; // Clear existing content

    if (!Array.isArray(projects) || projects.length === 0) {
        console.log('No projects to display');
        showError('No projects available.');
        return;
    }

    projects.forEach(project => {
        console.log('Creating card for project:', project);
        const projectCard = createProjectCard(project);
        projectsGrid.appendChild(projectCard);
    });
}

// Function to create a project card
function createProjectCard(project) {
    console.log('Creating project card with data:', project);
    const card = document.createElement('div');
    card.className = 'project-card';
    card.dataset.project = project.id;

    // Add error handling for image loading
    const imgElement = document.createElement('img');
    
    // Handle both relative and absolute URLs
    let imageUrl = project.imageUrl;
    if (imageUrl) {
        // If it's an Unsplash URL, ensure it's complete
        if (imageUrl.includes('unsplash.com')) {
            if (!imageUrl.includes('https://')) {
                imageUrl = `https://${imageUrl}`;
            }
            // Ensure the URL has all required parameters
            if (!imageUrl.includes('auto=format')) {
                imageUrl += (imageUrl.includes('?') ? '&' : '?') + 'auto=format&fit=crop&w=1200&q=80';
            }
        }
    }
    
    console.log(`Processing image URL for project ${project.id}:`, imageUrl);
    
    imgElement.src = imageUrl;
    imgElement.alt = project.title;
    imgElement.onerror = function() {
        console.error(`Failed to load image for project ${project.id}:`, imageUrl);
        // Try to load a fallback image
        this.src = 'https://via.placeholder.com/800x600?text=No+Image+Available';
        this.onerror = function() {
            console.error('Failed to load fallback image');
            this.style.display = 'none'; // Hide the image if both attempts fail
        };
    };
    imgElement.onload = function() {
        console.log(`Successfully loaded image for project ${project.id}:`, imageUrl);
    };

    card.innerHTML = `
        <div class="project-image">
            ${imgElement.outerHTML}
        </div>
        <div class="project-content">
            <h3>${project.title}</h3>
            <button class="view-details-btn" onclick="openProjectModal(${project.id})">
                <i class="fas fa-eye"></i>
                View Details
            </button>
        </div>
    `;

    return card;
}

// Function to show error message
function showError(message) {
    const projectsGrid = document.querySelector('.projects-grid');
    projectsGrid.innerHTML = `
        <div class="error-message">
            <i class="fas fa-exclamation-circle"></i>
            <p>${message}</p>
        </div>
    `;
}

// Function to open project modal
async function openProjectModal(projectId) {
    try {
        console.log(`Fetching details for project ${projectId}`);
        const response = await fetch(`${API_URL}/projects/${projectId}`);
        console.log('Modal response status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response:', errorText);
            throw new Error(`Failed to fetch project details: ${response.status} ${errorText}`);
        }
        
        const project = await response.json();
        console.log('Received project details:', project);
        
        // Update modal content
        const modalTitle = document.getElementById('modalTitle');
        const modalDescription = document.getElementById('modalDescription');
        const modalImage = document.getElementById('modalImage');
        const videoContainer = document.querySelector('.project-video');
        const modalVideo = document.getElementById('modalVideo');
        const sourceCodeBtn = document.getElementById('sourceCodeBtn');
        
        if (!modalTitle || !modalDescription || !modalImage || !videoContainer || !modalVideo || !sourceCodeBtn) {
            console.error('Modal elements not found:', {
                modalTitle: !!modalTitle,
                modalDescription: !!modalDescription,
                modalImage: !!modalImage,
                videoContainer: !!videoContainer,
                modalVideo: !!modalVideo,
                sourceCodeBtn: !!sourceCodeBtn
            });
            throw new Error('Modal elements not found');
        }
        
        // Update modal content
        modalTitle.textContent = project.title;
        modalDescription.textContent = project.description;
        
        // Handle image URL in modal
        let imageUrl = project.imageUrl;
        if (imageUrl) {
            // If it's an Unsplash URL, ensure it's complete
            if (imageUrl.includes('unsplash.com')) {
                if (!imageUrl.includes('https://')) {
                    imageUrl = `https://${imageUrl}`;
                }
                // Ensure the URL has all required parameters
                if (!imageUrl.includes('auto=format')) {
                    imageUrl += (imageUrl.includes('?') ? '&' : '?') + 'auto=format&fit=crop&w=1200&q=80';
                }
            }
        }
        
        console.log(`Setting modal image URL:`, imageUrl);
        modalImage.src = imageUrl;
        modalImage.alt = project.title;
        
        // Add error handling for modal image
        modalImage.onerror = function() {
            console.error(`Failed to load modal image:`, imageUrl);
            this.src = 'https://via.placeholder.com/800x600?text=No+Image+Available';
            this.onerror = function() {
                console.error('Failed to load fallback image in modal');
                this.style.display = 'none';
            };
        };
        
        // Handle video if available
        if (project.videoUrl) {
            // Ensure the video URL is properly formatted for embedding
            let videoUrl = project.videoUrl;
            if (videoUrl.includes('youtube.com/watch?v=')) {
                const videoId = videoUrl.split('v=')[1];
                videoUrl = `https://www.youtube.com/embed/${videoId}`;
            } else if (videoUrl.includes('youtu.be/')) {
                const videoId = videoUrl.split('youtu.be/')[1];
                videoUrl = `https://www.youtube.com/embed/${videoId}`;
            }
            
            modalVideo.src = videoUrl;
            videoContainer.style.display = 'block';
        } else {
            modalVideo.src = ''; // Clear the iframe source
            videoContainer.style.display = 'none';
        }
        
        // Handle GitHub link if available
        if (project.githubUrl) {
            sourceCodeBtn.href = project.githubUrl;
            sourceCodeBtn.style.display = 'inline-flex';
        } else {
            sourceCodeBtn.style.display = 'none';
        }
        
        // Show modal
        const modal = document.getElementById('projectModal');
        if (!modal) {
            throw new Error('Modal element not found');
        }
        
        // Add fade-in animation
        modal.style.opacity = '0';
        modal.style.display = 'flex';
        requestAnimationFrame(() => {
            modal.style.opacity = '1';
        });
        
        // Add body class to prevent scrolling
        document.body.classList.add('modal-open');
        
        // Add event listener for escape key
        document.addEventListener('keydown', handleEscapeKey);
    } catch (error) {
        console.error('Error fetching project details:', error);
        showError(`Failed to load project details: ${error.message}`);
    }
}

// Function to handle escape key press
function handleEscapeKey(event) {
    if (event.key === 'Escape') {
        closeProjectModal();
    }
}

// Function to close project modal
function closeProjectModal() {
    const modal = document.getElementById('projectModal');
    if (!modal) {
        console.error('Modal element not found');
        return;
    }
    
    // Add fade-out animation
    modal.style.opacity = '0';
    
    // Clear iframe source to stop video playback
    const modalVideo = document.getElementById('modalVideo');
    if (modalVideo) {
        modalVideo.src = '';
    }
    
    // Remove event listener for escape key
    document.removeEventListener('keydown', handleEscapeKey);
    
    // Hide modal after animation
    setTimeout(() => {
        modal.style.display = 'none';
        // Remove body class to restore scrolling
        document.body.classList.remove('modal-open');
    }, 300);
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('projectModal');
    if (event.target === modal) {
        closeProjectModal();
    }
}

// Initialize projects when the page loads
document.addEventListener('DOMContentLoaded', fetchProjects); 
