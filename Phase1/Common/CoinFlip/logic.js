/* ============================================
   logic.js — Core game logic for Coin Flip Streak
   Handles input, validation, scoring, and display.
   ============================================ */

// ---- DOM References ----
const DOM = {
  score: document.getElementById('score'),
  streak: document.getElementById('streak'),
  streakLabel: document.getElementById('streak-label'),
  userGuess: document.getElementById('user-guess'),
  submitGuess: document.getElementById('submit-guess'),
  result: document.getElementById('result'),
  resultContainer: document.getElementById('result-container'),
  generatedSequence: document.getElementById('generated-sequence'),
  themeToggle: document.getElementById('toggle-theme'),
  coins: document.querySelectorAll('.coin'),
};

// ---- Game State ----
const gameState = {
  correct: 0,
  wrong: 0,
  streak: 0
};

/* --------------------------------------------------
   generateSequence(length)
   Generates a random sequence of 'H' and 'T'.
   Uses bitwise operations for efficient randomness —
   one Math.random() call produces up to 30 coin flips.
   -------------------------------------------------- */
function generateSequence(length) {
  let seq = '';
  let bits = 0;

  for (let i = 0; i < length; i++) {
    // Refresh the random bits pool every 30 iterations
    if (i % 30 === 0) {
      bits = (Math.random() * (1 << 30)) | 0;
    }
    seq += (bits & 1) ? 'H' : 'T';
    bits >>= 1;
  }

  return seq;
}

/* --------------------------------------------------
   validateInput(input)
   Ensures the user's guess is exactly 3 characters
   and only contains 'H' or 'T'.
   Returns true if valid, displays UI error and returns false otherwise.
   -------------------------------------------------- */
function validateInput(input) {
  DOM.resultContainer.classList.remove('hidden');

  // Must be exactly 3 characters
  if (input.length !== 1) {
    DOM.result.textContent = 'Please enter exactly 1 character (H or T).';
    DOM.result.className = 'text-error font-bold text-lg';
    DOM.generatedSequence.textContent = '';
    return false;
  }

  // Each character must be H or T
  const validChars = ['H', 'T'];
  for (let i = 0; i < input.length; i++) {
    if (!validChars.includes(input[i])) {
      DOM.result.textContent = "Please enter only 'H' or 'T'.";
      DOM.result.className = 'text-error font-bold text-lg';
      DOM.generatedSequence.textContent = '';
      return false;
    }
  }

  // Clear any previous error before returning true
  DOM.result.textContent = '';
  DOM.result.className = '';
  return true;
}

/* --------------------------------------------------
   handleGuess()
   Reads user input, validates, generates a sequence,
   compares, updates game state, and returns result.
   Returns null if input is invalid.
   -------------------------------------------------- */
function handleGuess() {
  // Prevent guessing while an animation is playing
  if (DOM.submitGuess.disabled) {
    return null;
  }

  const userInput = DOM.userGuess.value.trim().toUpperCase();

  if (!validateInput(userInput)) {
    return null;
  }

  const seq = generateSequence(1);
  const isMatch = userInput === seq;

  // Update score & streak
  if (isMatch) {
    gameState.correct++;
    gameState.streak++;
  } else {
    gameState.wrong++;
    gameState.streak = 0;
  }

  return {
    match: isMatch,
    seq: seq,
    correct: gameState.correct,
    wrong: gameState.wrong,
    streak: gameState.streak
  };
}

/* --------------------------------------------------
   displayResult(result)
   Updates the UI with the outcome of the guess.
   Shows score, streak, generated sequence, and
   triggers appropriate CSS classes for feedback.
   -------------------------------------------------- */
function displayResult(result) {
  const total = result.correct + result.wrong;

  // Update score & streak text
  DOM.score.textContent = `${result.correct}/${total}`;
  DOM.streak.textContent = `${result.streak}`;

  // Show the result container
  DOM.resultContainer.classList.remove('hidden');

  // Clear old animation classes
  DOM.result.classList.remove('result-correct', 'result-wrong');

  // Small delay so the browser can re-trigger the animation
  requestAnimationFrame(() => {
    if (result.match) {
      DOM.result.textContent = 'Correct!';
      DOM.result.classList.add('result-correct');
    } else {
      DOM.result.textContent = 'Wrong!';
      DOM.result.classList.add('result-wrong');
    }
  });

  // Display the generated sequence
  DOM.generatedSequence.textContent = `Generated: ${result.seq}`;

  // Streak fire effect when streak >= 3
  if (result.streak >= 3) {
    DOM.streak.classList.add('on-fire');
    DOM.streakLabel.textContent = '🔥 On fire!';
  } else {
    DOM.streak.classList.remove('on-fire');
    DOM.streakLabel.textContent = 'Current streak';
  }

  // Clear the input for the next guess
  DOM.userGuess.value = '';
  DOM.userGuess.focus();
}

/* --------------------------------------------------
   Theme Toggle
   Switches between "autumn" (light) and "coffee" (dark).
   Persists the choice in localStorage.
   -------------------------------------------------- */
function applyTheme(isDark) {
  document.documentElement.setAttribute('data-theme', isDark ? 'coffee' : 'autumn');
}

// Restore saved theme on load
const savedDark = localStorage.getItem('coinflip-dark') === 'true';
DOM.themeToggle.checked = savedDark;
applyTheme(savedDark);

// Listen for toggle changes
DOM.themeToggle.addEventListener('change', function () {
  const isDark = this.checked;
  localStorage.setItem('coinflip-dark', isDark);
  applyTheme(isDark);
});

/* --------------------------------------------------
   Event Listeners
   -------------------------------------------------- */

// Click the Guess button
DOM.submitGuess.addEventListener('click', function () {
  const result = handleGuess();
  if (result) {
    // Trigger coin flip animation, then display result
    animateCoinFlip(result);
  }
});

// Press Enter inside the input
DOM.userGuess.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    const result = handleGuess();
    if (result) {
      animateCoinFlip(result);
    }
  }
});