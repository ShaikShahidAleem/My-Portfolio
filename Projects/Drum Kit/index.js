// Global variables
let hitCount = 0;
let comboCount = 0;
let score = 0;
let lastHitTime = 0;
let particlesEnabled = true;
let autoPlayEnabled = false;
let autoPlayInterval;
let currentTheme = 'default';
let audioContext;
let analyser;
let dataArray;
let canvas;
let canvasCtx;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeAudioVisualizer();
    initializeControls();
    initializeDrumButtons();
    initializeKeyboardEvents();
    updateStats();
});

// Audio Visualizer Setup
function initializeAudioVisualizer() {
    canvas = document.getElementById('audioVisualizer');
    canvasCtx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // Create audio context
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    
    const bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);
    
    // Start visualization
    drawVisualizer();
}

function drawVisualizer() {
    requestAnimationFrame(drawVisualizer);
    
    analyser.getByteFrequencyData(dataArray);
    
    canvasCtx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
    
    const barWidth = (canvas.width / dataArray.length) * 2.5;
    let barHeight;
    let x = 0;
    
    for(let i = 0; i < dataArray.length; i++) {
        barHeight = dataArray[i] / 2;
        
        const gradient = canvasCtx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, `hsl(${i * 360 / dataArray.length}, 70%, 60%)`);
        gradient.addColorStop(1, `hsl(${i * 360 / dataArray.length}, 70%, 30%)`);
        
        canvasCtx.fillStyle = gradient;
        canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        
        x += barWidth + 1;
    }
}

// Controls initialization
function initializeControls() {
    const themeToggle = document.getElementById('themeToggle');
    const particleToggle = document.getElementById('particleToggle');
    const autoPlayBtn = document.getElementById('autoPlay');
    
    themeToggle.addEventListener('click', toggleTheme);
    particleToggle.addEventListener('click', toggleParticles);
    autoPlayBtn.addEventListener('click', toggleAutoPlay);
}

function toggleTheme() {
    const body = document.body;
    const themes = ['default', 'neon', 'sunset'];
    const currentIndex = themes.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    const nextTheme = themes[nextIndex];
    
    // Remove current theme
    body.classList.remove(`theme-${currentTheme}`);
    
    // Add new theme
    if (nextTheme !== 'default') {
        body.classList.add(`theme-${nextTheme}`);
    }
    
    currentTheme = nextTheme;
    
    // Update button text
    const themeBtn = document.getElementById('themeToggle');
    themeBtn.innerHTML = `<i class="fas fa-palette"></i> ${nextTheme.charAt(0).toUpperCase() + nextTheme.slice(1)}`;
    
    // Add click effect
    createParticles(themeBtn.getBoundingClientRect().left + themeBtn.offsetWidth / 2, 
                   themeBtn.getBoundingClientRect().top + themeBtn.offsetHeight / 2);
}

function toggleParticles() {
    particlesEnabled = !particlesEnabled;
    const particleBtn = document.getElementById('particleToggle');
    
    if (particlesEnabled) {
        particleBtn.classList.add('active');
        particleBtn.innerHTML = '<i class="fas fa-sparkles"></i> Particles ON';
    } else {
        particleBtn.classList.remove('active');
        particleBtn.innerHTML = '<i class="fas fa-sparkles"></i> Particles OFF';
    }
}

function toggleAutoPlay() {
    autoPlayEnabled = !autoPlayEnabled;
    const autoPlayBtn = document.getElementById('autoPlay');
    
    if (autoPlayEnabled) {
        autoPlayBtn.classList.add('active');
        autoPlayBtn.innerHTML = '<i class="fas fa-pause"></i> Auto Play ON';
        startAutoPlay();
    } else {
        autoPlayBtn.classList.remove('active');
        autoPlayBtn.innerHTML = '<i class="fas fa-play"></i> Auto Play OFF';
        stopAutoPlay();
    }
}

function startAutoPlay() {
    const drums = ['w', 'a', 's', 'd', 'j', 'k', 'l'];
    autoPlayInterval = setInterval(() => {
        const randomDrum = drums[Math.floor(Math.random() * drums.length)];
        makeSound(randomDrum);
        buttonAnimation(randomDrum);
    }, 500 + Math.random() * 1000);
}

function stopAutoPlay() {
    if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
        autoPlayInterval = null;
    }
}

// Drum button initialization
function initializeDrumButtons() {
    const drumButtons = document.querySelectorAll('.drum');
    
    drumButtons.forEach(button => {
        button.addEventListener('click', function() {
            const key = this.classList[0]; // Get the key class (w, a, s, etc.)
            makeSound(key);
            buttonAnimation(key);
            
            // Create particles at button position
            const rect = this.getBoundingClientRect();
            createParticles(rect.left + rect.width / 2, rect.top + rect.height / 2);
        });
        
        // Add hover sound effect
        button.addEventListener('mouseenter', function() {
            if (audioContext && audioContext.state === 'suspended') {
                audioContext.resume();
            }
        });
    });
}

// Keyboard events
function initializeKeyboardEvents() {
    document.addEventListener('keypress', function(event) {
        const key = event.key.toLowerCase();
        if (['w', 'a', 's', 'd', 'j', 'k', 'l'].includes(key)) {
            makeSound(key);
            buttonAnimation(key);
            
            // Create particles at random position
            createParticles(Math.random() * window.innerWidth, Math.random() * window.innerHeight);
        }
    });
}

// Enhanced sound function
function makeSound(key) {
    // Resume audio context if suspended
    if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume();
    }
    
    let audio;
    
    switch (key) {
        case "w":
            audio = new Audio("sounds/tom-1.mp3");
            break;
        case "a":
            audio = new Audio("sounds/tom-2.mp3");
            break;
        case "s":
            audio = new Audio('sounds/tom-3.mp3');
            break;
        case "d":
            audio = new Audio('sounds/tom-4.mp3');
            break;
        case "j":
            audio = new Audio('sounds/snare.mp3');
            break;
        case "k":
            audio = new Audio('sounds/crash.mp3');
            break;
        case "l":
            audio = new Audio('sounds/kick-bass.mp3');
            break;
        default:
            console.log(key);
            return;
    }
    
    // Create audio source and connect to analyser
    const source = audioContext.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    
    // Play audio
    audio.play().catch(e => console.log('Audio play failed:', e));
    
    // Update statistics
    updateHitStats();
}

// Enhanced button animation
function buttonAnimation(currentKey) {
    const activeButton = document.querySelector("." + currentKey);
    
    if (activeButton) {
        activeButton.classList.add("pressed");
        
        // Add glow effect
        activeButton.style.boxShadow = `
            0 0 30px rgba(255,255,255,0.8),
            0 0 60px rgba(255,255,255,0.4),
            0 0 90px rgba(255,255,255,0.2)
        `;
        
        setTimeout(function() {
            activeButton.classList.remove("pressed");
            activeButton.style.boxShadow = '';
        }, 300);
    }
}

// Statistics tracking
function updateHitStats() {
    const now = Date.now();
    hitCount++;
    
    // Check for combo (hits within 2 seconds)
    if (now - lastHitTime < 2000) {
        comboCount++;
        score += comboCount * 10;
    } else {
        comboCount = 1;
        score += 10;
    }
    
    lastHitTime = now;
    updateStats();
}

function updateStats() {
    document.getElementById('hitCount').textContent = hitCount;
    document.getElementById('comboCount').textContent = comboCount;
    document.getElementById('score').textContent = score;
    
    // Add animation to stats
    const statValues = document.querySelectorAll('.stat-value');
    statValues.forEach(value => {
        value.style.transform = 'scale(1.2)';
        setTimeout(() => {
            value.style.transform = 'scale(1)';
        }, 200);
    });
}

// Particle system
function createParticles(x, y) {
    if (!particlesEnabled) return;
    
    const particleCount = 15;
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'];
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random properties
        const size = Math.random() * 6 + 2;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const angle = (Math.PI * 2 * i) / particleCount;
        const velocity = Math.random() * 100 + 50;
        
        // Set initial position
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.background = color;
        particle.style.boxShadow = `0 0 ${size * 2}px ${color}`;
        
        // Add to container
        document.getElementById('particlesContainer').appendChild(particle);
        
        // Animate particle
        const startX = x;
        const startY = y;
        const endX = startX + Math.cos(angle) * velocity;
        const endY = startY + Math.sin(angle) * velocity;
        
        particle.animate([
            {
                transform: 'translate(0, 0) scale(1)',
                opacity: 1
            },
            {
                transform: `translate(${endX - startX}px, ${endY - startY}px) scale(0)`,
                opacity: 0
            }
        ], {
            duration: 2000,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }).onfinish = () => {
            particle.remove();
        };
    }
}

// Screen shake effect
function screenShake() {
    const container = document.querySelector('.container');
    container.style.animation = 'none';
    container.offsetHeight; // Trigger reflow
    container.style.animation = 'shake 0.5s ease-in-out';
}

// Add shake animation to CSS
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
`;
document.head.appendChild(shakeStyle);

// Easter egg: Konami code
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];

document.addEventListener('keydown', function(event) {
    konamiCode.push(event.code);
    
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        // Activate party mode!
        document.body.style.animation = 'rainbow 2s infinite';
        createParticles(window.innerWidth / 2, window.innerHeight / 2);
        screenShake();
        
        // Add rainbow animation
        const rainbowStyle = document.createElement('style');
        rainbowStyle.textContent = `
            @keyframes rainbow {
                0% { filter: hue-rotate(0deg); }
                100% { filter: hue-rotate(360deg); }
            }
        `;
        document.head.appendChild(rainbowStyle);
        
        setTimeout(() => {
            document.body.style.animation = '';
        }, 5000);
        
        konamiCode = [];
    }
});

// Performance optimization: Throttle particle creation
let lastParticleTime = 0;
const particleThrottle = 100; // ms

function throttledCreateParticles(x, y) {
    const now = Date.now();
    if (now - lastParticleTime > particleThrottle) {
        createParticles(x, y);
        lastParticleTime = now;
    }
}

// Add window resize handler for canvas
window.addEventListener('resize', function() {
    if (canvas) {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }
});

// Add some fun startup effects
window.addEventListener('load', function() {
    // Welcome animation
    const title = document.querySelector('.glitch');
    title.style.opacity = '0';
    title.style.transform = 'translateY(-50px)';
    
    setTimeout(() => {
        title.style.transition = 'all 1s ease-out';
        title.style.opacity = '1';
        title.style.transform = 'translateY(0)';
    }, 500);
    
    // Drum entrance animation
    const drums = document.querySelectorAll('.drum');
    drums.forEach((drum, index) => {
        drum.style.opacity = '0';
        drum.style.transform = 'scale(0) rotate(180deg)';
        
        setTimeout(() => {
            drum.style.transition = 'all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            drum.style.opacity = '1';
            drum.style.transform = 'scale(1) rotate(0deg)';
        }, 1000 + index * 100);
    });
});
