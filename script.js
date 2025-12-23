// UI Interaction Scripts

// Smooth scroll to games section
function scrollToGames() {
    const gamesSection = document.getElementById('games');
    gamesSection.scrollIntoView({ behavior: 'smooth' });
}

// Load game in modal
function loadGame(gameType) {
    const modal = document.getElementById('gameModal');
    modal.style.display = 'block';
    
    // Initialize the selected game
    setTimeout(() => {
        initGame(gameType);
    }, 100);
}

// Close game modal
function closeGame() {
    const modal = document.getElementById('gameModal');
    modal.style.display = 'none';
    stopGame();
}

// Restart current game
function restartGame() {
    if (currentGame instanceof SnakeGame) {
        stopGame();
        initGame('snake');
    } else if (currentGame instanceof PongGame) {
        stopGame();
        initGame('pong');
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('gameModal');
    if (event.target === modal) {
        closeGame();
    }
}

// Navigation active state
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Scroll spy for navigation
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
});

// Handle game card placeholder clicks (for games not yet implemented)
const gameCards = document.querySelectorAll('.game-card');
gameCards.forEach(card => {
    const button = card.querySelector('.play-button');
    if (button) {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
    
    card.addEventListener('click', function() {
        const button = this.querySelector('.play-button');
        if (button) {
            button.click();
        }
    });
});

// Show notification for games not yet implemented
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
        z-index: 1001;
        animation: slideInRight 0.3s ease-out;
    `;
    notification.textContent = message;
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Override loadGame for unimplemented games
const originalLoadGame = window.loadGame;
window.loadGame = function(gameType) {
    const implementedGames = ['snake', 'pong'];
    
    if (implementedGames.includes(gameType)) {
        originalLoadGame(gameType);
    } else {
        showNotification(`${gameType.charAt(0).toUpperCase() + gameType.slice(1)} game coming soon!`);
    }
};
