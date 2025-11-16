// Game state
let gameState = {
  player1Score: 0,
  player2Score: 0,
  gamesPlayed: 0,
  draws: 0,
  isRolling: false
};

// DOM elements
const rollButton = document.getElementById('rollBtn');
const dice1 = document.querySelector('.dice1');
const dice2 = document.querySelector('.dice2');
const resultDisplay = document.getElementById('resultDisplay');
const resultText = document.querySelector('.result-text');
const resultSubtext = document.querySelector('.result-subtext');
const score1Element = document.getElementById('score1');
const score2Element = document.getElementById('score2');
const gamesPlayedElement = document.getElementById('gamesPlayed');
const drawsElement = document.getElementById('draws');
const player1Card = document.querySelector('.player1-card');
const player2Card = document.querySelector('.player2-card');

// Sound effects (optional - using Web Audio API)
let audioContext;
let rollSound;

// Initialize audio context
function initAudio() {
  try {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    createRollSound();
  } catch (e) {
    console.log('Audio not supported');
  }
}

// Create roll sound effect
function createRollSound() {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.1);
  
  gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.1);
}

// Play roll sound
function playRollSound() {
  if (audioContext && audioContext.state === 'suspended') {
    audioContext.resume();
  }
  createRollSound();
}

// Generate random dice number
function getRandomDiceNumber() {
  return Math.floor(Math.random() * 6) + 1;
}

// Update dice image
function updateDiceImage(diceElement, number) {
  diceElement.src = `./images/dice${number}.png`;
}

// Add rolling animation
function addRollingAnimation(diceElement) {
  diceElement.classList.add('rolling');
}

// Remove rolling animation
function removeRollingAnimation(diceElement) {
  diceElement.classList.remove('rolling');
}

// Update scores
function updateScores() {
  score1Element.textContent = gameState.player1Score;
  score2Element.textContent = gameState.player2Score;
  gamesPlayedElement.textContent = gameState.gamesPlayed;
  drawsElement.textContent = gameState.draws;
}

// Show result with animation
function showResult(result, subtext, winner = null) {
  resultText.textContent = result;
  resultSubtext.textContent = subtext;
  
  // Remove previous winner classes
  player1Card.classList.remove('winner');
  player2Card.classList.remove('winner');
  
  // Add winner animation
  if (winner === 'player1') {
    player1Card.classList.add('winner');
  } else if (winner === 'player2') {
    player2Card.classList.add('winner');
  }
  
  // Animate result display
  resultDisplay.style.animation = 'none';
  resultDisplay.offsetHeight; // Trigger reflow
  resultDisplay.style.animation = 'shake 0.5s ease-in-out';
}

// Roll dice function
async function rollDice() {
  if (gameState.isRolling) return;
  
  gameState.isRolling = true;
  rollButton.disabled = true;
  rollButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Rolling...</span>';
  
  // Play sound
  playRollSound();
  
  // Add rolling animations
  addRollingAnimation(dice1);
  addRollingAnimation(dice2);
  
  // Show rolling message
  showResult('Rolling the dice...', 'Get ready for the result!');
  
  // Wait for animation
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Generate random numbers
  const randomNumber1 = getRandomDiceNumber();
  const randomNumber2 = getRandomDiceNumber();
  
  // Update dice images
  updateDiceImage(dice1, randomNumber1);
  updateDiceImage(dice2, randomNumber2);
  
  // Remove rolling animations
  removeRollingAnimation(dice1);
  removeRollingAnimation(dice2);
  
  // Determine winner
  let result, subtext, winner;
  
  if (randomNumber1 > randomNumber2) {
    result = '🎉 Player 1 Wins! 🎉';
    subtext = `Player 1 rolled ${randomNumber1} vs Player 2's ${randomNumber2}`;
    winner = 'player1';
    gameState.player1Score++;
  } else if (randomNumber1 === randomNumber2) {
    result = '🤝 It\'s a Draw! 🤝';
    subtext = `Both players rolled ${randomNumber1}`;
    winner = null;
    gameState.draws++;
  } else {
    result = '🎉 Player 2 Wins! 🎉';
    subtext = `Player 2 rolled ${randomNumber2} vs Player 1's ${randomNumber1}`;
    winner = 'player2';
    gameState.player2Score++;
  }
  
  gameState.gamesPlayed++;
  
  // Update scores
  updateScores();
  
  // Show result
  showResult(result, subtext, winner);
  
  // Reset button
  rollButton.disabled = false;
  rollButton.innerHTML = '<i class="fas fa-play"></i><span>Roll Dice</span>';
  gameState.isRolling = false;
  
  // Add confetti effect for winner
  if (winner) {
    createConfetti();
  }
}

// Create confetti effect
function createConfetti() {
  const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'];
  
  for (let i = 0; i < 50; i++) {
    setTimeout(() => {
      const confetti = document.createElement('div');
      confetti.style.position = 'fixed';
      confetti.style.left = Math.random() * 100 + 'vw';
      confetti.style.top = '-10px';
      confetti.style.width = '10px';
      confetti.style.height = '10px';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.borderRadius = '50%';
      confetti.style.pointerEvents = 'none';
      confetti.style.zIndex = '9999';
      confetti.style.animation = `fall ${Math.random() * 3 + 2}s linear forwards`;
      
      document.body.appendChild(confetti);
      
      // Remove confetti after animation
      setTimeout(() => {
        if (confetti.parentNode) {
          confetti.parentNode.removeChild(confetti);
        }
      }, 5000);
    }, i * 100);
  }
}

// Add fall animation for confetti
const style = document.createElement('style');
style.textContent = `
  @keyframes fall {
    to {
      transform: translateY(100vh) rotate(360deg);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Event listeners
rollButton.addEventListener('click', rollDice);

// Keyboard support
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && !gameState.isRolling) {
    e.preventDefault();
    rollDice();
  }
});

// Initialize game
function initGame() {
  // Initialize audio
  initAudio();
  
  // Set initial state
  updateScores();
  
  // Add click sound to button
  rollButton.addEventListener('click', () => {
    if (audioContext && audioContext.state === 'suspended') {
      audioContext.resume();
    }
  });
  
  // Add hover effects
  rollButton.addEventListener('mouseenter', () => {
    if (!gameState.isRolling) {
      rollButton.style.transform = 'translateY(-3px) scale(1.05)';
    }
  });
  
  rollButton.addEventListener('mouseleave', () => {
    if (!gameState.isRolling) {
      rollButton.style.transform = 'translateY(0) scale(1)';
    }
  });
  
  // Add dice hover effects
  [dice1, dice2].forEach(dice => {
    dice.addEventListener('mouseenter', () => {
      if (!gameState.isRolling) {
        dice.style.transform = 'scale(1.1) rotate(5deg)';
      }
    });
    
    dice.addEventListener('mouseleave', () => {
      if (!gameState.isRolling) {
        dice.style.transform = 'scale(1) rotate(0deg)';
      }
    });
  });
  
  console.log('🎲 Dicee Challenge initialized! Press Space or click the button to roll!');
}

// Start the game when page loads
document.addEventListener('DOMContentLoaded', initGame);

// Add some fun easter eggs
let clickCount = 0;
document.querySelector('.game-title').addEventListener('click', () => {
  clickCount++;
  if (clickCount === 5) {
    alert('🎉 You found the secret! You\'re a true dice master! 🎉');
    clickCount = 0;
  }
});

// Add smooth scrolling for better UX
document.documentElement.style.scrollBehavior = 'smooth';