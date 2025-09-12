// Spectacular confetti effect from center to top then falling down
function createFireworks() {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff', '#ff4757', '#2ed573', '#ffa502', '#ff3838', '#ff9f1a', '#32ff7e', '#7bed9f'];
    const particleCount = 500;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.width = Math.random() * 8 + 4 + 'px';
        particle.style.height = particle.style.width;
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        particle.style.left = centerX + 'px';
        particle.style.top = centerY + 'px';
        particle.style.zIndex = '1000';
        particle.style.borderRadius = Math.random() > 0.5 ? '50%' : '0%';
        particle.style.pointerEvents = 'none';
        particle.style.boxShadow = '0 0 10px currentColor';
        
        document.body.appendChild(particle);
        
        // Random upward direction with spread
        const angle = (Math.random() - 0.5) * Math.PI; // -90 to +90 degrees
        const velocity = Math.random() * 400 + 300;
        const endX = Math.sin(angle) * velocity;
        const endY = -Math.cos(angle) * velocity; // Upward direction
        
        // Shoot up and fade out
        const shootUpAnimation = particle.animate([
            { 
                transform: 'translate(0, 0) rotate(0deg) scale(1)', 
                opacity: 1 
            },
            { 
                transform: `translate(${endX}px, ${endY}px) rotate(720deg) scale(0.3)`, 
                opacity: 0 
            }
        ], {
            duration: Math.random() * 1500 + 1000,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        });
        
        shootUpAnimation.onfinish = () => {
            particle.remove();
        };
    }
}

// Start fireworks effect when page loads
window.addEventListener('load', () => {
    setTimeout(createFireworks, 500);
});
