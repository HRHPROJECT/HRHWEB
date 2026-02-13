/* ============================================
   VALENTINE WEBSITE - INTERACTIVE LOGIC
   Proximity Detection & Animations
   ============================================ */

// === CONFIGURATION (Easily Editable) ===
const CONFIG = {
    girlfriendName: "My Love",
    shortMessage: [
        "Every day with you feels like magic",
        "Distance makes our hearts grow stronger",
        "You're my favorite person in the world"
    ],
    finalQuestion: "Will you be my Valentine? 💗",
    proximityThreshold: 100, // pixels for desktop proximity detection
    mobileProximityThreshold: 80, // pixels for mobile
    playfulMessages: [
        "Oops 😇",
        "Nice try 😌",
        "That button is broken...",
        "The universe wants YES 💗",
        "Come on now 💕",
        "You know what to click 😊",
        "Still trying? 💫"
    ]
};

// === STATE ===
let swapCount = 0;
let loveProgress = 0;
let buttonsSwapped = false;

// === DOM ELEMENTS ===
const startBtn = document.getElementById('start-btn');
const heartButtons = document.querySelectorAll('.heart-btn');
const loveMeterFill = document.getElementById('love-meter-fill');
const loveMeterPercent = document.getElementById('love-meter-percent');
const unlockMessage = document.getElementById('unlock-message');
const revealBtn = document.getElementById('reveal-btn');
const questionSection = document.getElementById('question');
const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');
const buttonContainer = document.getElementById('button-container');
const playfulMessageEl = document.getElementById('playful-message');
const successOverlay = document.getElementById('success-overlay');
const confettiContainer = document.getElementById('confetti-container');

// === INITIALIZATION ===
document.addEventListener('DOMContentLoaded', () => {
    initFloatingIcons();
    initScrollAnimations();
    initNavigation();
    initLoveMeter();
    initButtonProximity();
});

// === FLOATING BACKGROUND ICONS ===
function initFloatingIcons() {
    const floatingContainer = document.getElementById('floating-icons');
    const icons = [
        'assets/matcha.png',
        'assets/coffee-beans.png',
        'assets/ice-cube.png',
        'assets/sunflower.png',
        'assets/taco.png'
    ];
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
        // Minimal icons for reduced motion
        createFloatingIcons(floatingContainer, icons, 5);
    } else {
        // Full experience
        createFloatingIcons(floatingContainer, icons, 18);
    }
}

function createFloatingIcons(container, icons, count) {
    for (let i = 0; i < count; i++) {
        const icon = document.createElement('img');
        const randomIcon = icons[Math.floor(Math.random() * icons.length)];
        
        icon.src = randomIcon;
        icon.classList.add('floating-icon', 'float');
        
        // Random properties
        const size = Math.random() * 50 + 30; // 30-80px
        const startX = Math.random() * 100; // 0-100%
        const startY = Math.random() * 20 + 100; // 100-120% (start below screen)
        const duration = Math.random() * 4 + 8; // 8-12s
        const delay = Math.random() * 10; // 0-10s
        const opacity = Math.random() * 0.2 + 0.15; // 0.15-0.35
        
        icon.style.width = `${size}px`;
        icon.style.height = `${size}px`;
        icon.style.left = `${startX}%`;
        icon.style.bottom = `-${startY}px`;
        icon.style.animationDuration = `${duration}s`;
        icon.style.animationDelay = `-${delay}s`;
        icon.style.opacity = opacity;
        
        // Add sway to some icons
        if (Math.random() > 0.5) {
            icon.classList.add('sway');
        }
        
        container.appendChild(icon);
    }
}

// === SCROLL ANIMATIONS ===
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe story cards
    document.querySelectorAll('.story-card').forEach(card => {
        observer.observe(card);
    });
}

// === NAVIGATION ===
function initNavigation() {
    startBtn.addEventListener('click', () => {
        document.getElementById('story').scrollIntoView({ 
            behavior: 'smooth',
            block: 'center'
        });
    });
}

// === LOVE METER ===
function initLoveMeter() {
    heartButtons.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            // Add click animation
            btn.classList.add('clicked');
            setTimeout(() => btn.classList.remove('clicked'), 500);
            
            // Update progress (each heart = 20%)
            loveProgress = Math.min(loveProgress + 20, 100);
            updateLoveMeter();
            
            // Disable button after click
            btn.disabled = true;
            btn.style.opacity = '0.3';
            
            // Check if complete
            if (loveProgress >= 100) {
                setTimeout(unlockQuestion, 800);
            }
        });
    });
}

function updateLoveMeter() {
    loveMeterFill.style.width = `${loveProgress}%`;
    loveMeterPercent.textContent = `${loveProgress}%`;
}

function unlockQuestion() {
    unlockMessage.classList.remove('hidden');
    
    revealBtn.addEventListener('click', () => {
        questionSection.classList.remove('hidden');
        questionSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'center'
        });
    });
}

// === PROXIMITY DETECTION (CRITICAL FEATURE) ===
function initButtonProximity() {
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
    
    if (isTouchDevice) {
        // Mobile: Use touch/pointer events
        initMobileProximity();
    } else {
        // Desktop: Use mouse tracking
        initDesktopProximity();
    }
    
    // YES button always works
    yesBtn.addEventListener('click', handleYesClick);
}

// Desktop proximity detection
function initDesktopProximity() {
    buttonContainer.addEventListener('mousemove', (e) => {
        const noBtnRect = noBtn.getBoundingClientRect();
        const noBtnCenterX = noBtnRect.left + noBtnRect.width / 2;
        const noBtnCenterY = noBtnRect.top + noBtnRect.height / 2;
        
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        
        // Calculate distance
        const distance = Math.sqrt(
            Math.pow(mouseX - noBtnCenterX, 2) + 
            Math.pow(mouseY - noBtnCenterY, 2)
        );
        
        // If cursor gets too close, swap buttons
        if (distance < CONFIG.proximityThreshold) {
            swapButtons();
        }
    });
    
    // Also prevent clicking NO
    noBtn.addEventListener('click', (e) => {
        e.preventDefault();
        swapButtons();
    });
}

// Mobile proximity detection
function initMobileProximity() {
    // On mobile, swap immediately when trying to touch NO
    noBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        swapButtons();
    });
    
    noBtn.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        swapButtons();
    });
    
    // Also track touch movement near NO button
    buttonContainer.addEventListener('touchmove', (e) => {
        const touch = e.touches[0];
        const noBtnRect = noBtn.getBoundingClientRect();
        const noBtnCenterX = noBtnRect.left + noBtnRect.width / 2;
        const noBtnCenterY = noBtnRect.top + noBtnRect.height / 2;
        
        const distance = Math.sqrt(
            Math.pow(touch.clientX - noBtnCenterX, 2) + 
            Math.pow(touch.clientY - noBtnCenterY, 2)
        );
        
        if (distance < CONFIG.mobileProximityThreshold) {
            swapButtons();
        }
    });
}

// Swap YES and NO button positions
function swapButtons() {
    // Add swap animation
    yesBtn.classList.add('button-swap');
    noBtn.classList.add('button-swap');
    
    setTimeout(() => {
        yesBtn.classList.remove('button-swap');
        noBtn.classList.remove('button-swap');
    }, 400);
    
    // Swap their order in the DOM (flexbox will reposition them)
    if (buttonsSwapped) {
        buttonContainer.insertBefore(yesBtn, noBtn);
        buttonsSwapped = false;
    } else {
        buttonContainer.insertBefore(noBtn, yesBtn);
        buttonsSwapped = true;
    }
    
    // Update playful message
    updatePlayfulMessage();
}

function updatePlayfulMessage() {
    const messageIndex = swapCount % CONFIG.playfulMessages.length;
    playfulMessageEl.textContent = CONFIG.playfulMessages[messageIndex];
    
    // Re-trigger fade animation
    playfulMessageEl.style.animation = 'none';
    setTimeout(() => {
        playfulMessageEl.style.animation = 'fadeIn 0.3s ease-in';
    }, 10);
    
    swapCount++;
}

// === YES BUTTON SUCCESS ===
function handleYesClick(e) {
    e.preventDefault();
    
    // Remove event listeners to prevent further interaction
    yesBtn.removeEventListener('click', handleYesClick);
    
    // Show success overlay
    successOverlay.classList.remove('hidden');
    setTimeout(() => {
        successOverlay.classList.add('active');
    }, 10);
    
    // Spawn confetti hearts
    spawnConfetti();
    
    // Add glow to valentine card
    const valentineCard = document.querySelector('.valentine-card');
    valentineCard.style.boxShadow = '0 0 60px rgba(127, 183, 126, 0.6)';
}

// === CONFETTI ANIMATION ===
function spawnConfetti() {
    const hearts = ['💕', '💗', '💖', '💝', '💘'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            createConfettiHeart(hearts[Math.floor(Math.random() * hearts.length)]);
        }, i * 80); // Stagger spawn
    }
}

function createConfettiHeart(emoji) {
    const heart = document.createElement('div');
    heart.classList.add('confetti-heart');
    heart.textContent = emoji;
    
    // Random horizontal position
    const startX = Math.random() * 100;
    heart.style.left = `${startX}%`;
    heart.style.top = '-50px';
    
    // Random animation duration
    const duration = Math.random() * 2 + 2; // 2-4s
    heart.style.animationDuration = `${duration}s`;
    
    // Random rotation direction
    const rotateDirection = Math.random() > 0.5 ? 1 : -1;
    heart.style.setProperty('--rotate-direction', rotateDirection);
    
    confettiContainer.appendChild(heart);
    
    // Remove after animation
    setTimeout(() => {
        heart.remove();
    }, duration * 1000);
}

// === PREVENT ACCIDENTAL NAVIGATION ===
window.addEventListener('beforeunload', (e) => {
    if (loveProgress > 0 && !successOverlay.classList.contains('active')) {
        e.preventDefault();
        e.returnValue = '';
    }
});

console.log('💗 Valentine website loaded successfully!');
