// Theme Toggle Functionality
function initializeThemeToggle() {
    console.log('Initializing theme toggle...');
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    
    if (!themeToggle) {
        console.error('Theme toggle button not found!');
        return;
    }
    
    // Check saved theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    console.log('Saved theme:', savedTheme);
    htmlElement.setAttribute('data-theme', savedTheme);

    themeToggle.addEventListener('click', () => {
        console.log('Theme toggle clicked');
        // Add a pressed effect
        themeToggle.style.transform = 'scale(0.95)';
        setTimeout(() => {
            themeToggle.style.transform = '';
        }, 200);

        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        console.log('Switching theme from', currentTheme, 'to', newTheme);
        
        // Add transition class to body for smooth color changes
        document.body.style.transition = 'background-color 0.5s ease';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);

        // Create ripple effect
        const ripple = document.createElement('div');
        ripple.style.position = 'fixed';
        ripple.style.top = '0';
        ripple.style.left = '0';
        ripple.style.width = '100%';
        ripple.style.height = '100%';
        ripple.style.backgroundColor = newTheme === 'dark' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)';
        ripple.style.transition = 'transform 1s ease-out, opacity 1s ease-out';
        ripple.style.transform = 'scale(0)';
        ripple.style.opacity = '1';
        ripple.style.pointerEvents = 'none';
        ripple.style.zIndex = '9998';
        
        document.body.appendChild(ripple);
        
        // Trigger ripple animation
        setTimeout(() => {
            ripple.style.transform = 'scale(2)';
            ripple.style.opacity = '0';
            setTimeout(() => ripple.remove(), 1000);
        }, 0);
    });
}

// Initialize theme when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing theme...');
    initializeThemeToggle();
}); 