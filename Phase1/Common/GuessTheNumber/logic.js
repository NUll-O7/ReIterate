document.addEventListener('DOMContentLoaded', () => {
  const DOM = {
    rulesPanel:     document.getElementById('rules-panel'),
    gameArea:       document.getElementById('game-area'),
    feedbackArea:   document.getElementById('feedback-area'),
    rangeHint:      document.getElementById('range-hint'),
    resultPopup:    document.getElementById('result-popup'),

    startBtn:       document.getElementById('start-btn'),
    confirmBtn:     document.getElementById('confirm-btn'),
    guessInput:     document.getElementById('guess-input'),
    resultCloseBtn: document.getElementById('result-close-btn'),

    feedbackText:   document.getElementById('feedback-text'),
    attemptsCount:  document.getElementById('attempts-count'),
    rangeLow:       document.getElementById('range-low'),
    rangeHigh:      document.getElementById('range-high'),

    resultIcon:     document.getElementById('result-icon'),
    resultTitle:    document.getElementById('result-title'),
    resultMessage:  document.getElementById('result-message'),
  };

  const MAX_ATTEMPTS = 10;
  let secretNumber, attempts, lowBound, highBound;

  function resetGame() {
    secretNumber = Math.floor(Math.random() * 100) + 1;
    attempts     = 0;
    lowBound     = 1;
    highBound    = 100;

    DOM.attemptsCount.textContent = '0';
    DOM.rangeLow.textContent      = 'Low: 1';
    DOM.rangeHigh.textContent     = 'High: 100';
    DOM.guessInput.value          = '';

    setFeedback('info', 'fa-circle-info', 'Waiting for your guess…');
  }

  function show(...els) { els.forEach(el => el.classList.remove('hidden')); }
  function hide(...els) { els.forEach(el => el.classList.add('hidden'));    }

  function setFeedback(color, icon, message) {
    DOM.feedbackText.innerHTML =
      `<i class="fa-solid ${icon} mr-1 text-${color}"></i><span>${message}</span>`;
  }

  function showResult(won) {
    if (won) {
      DOM.resultIcon.innerHTML    = '<i class="fa-solid fa-trophy text-warning"></i>';
      DOM.resultTitle.className   = 'font-display text-2xl font-bold mb-2 text-success';
      DOM.resultTitle.textContent = '🎉 Correct!';
      DOM.resultMessage.innerHTML =
        `You guessed it in <strong class="text-primary">${attempts}</strong> attempt${attempts > 1 ? 's' : ''}!`;
    } else {
      DOM.resultIcon.innerHTML    = '<i class="fa-solid fa-heart-crack text-error"></i>';
      DOM.resultTitle.className   = 'font-display text-2xl font-bold mb-2 text-error';
      DOM.resultTitle.textContent = '💀 Game Over';
      DOM.resultMessage.innerHTML =
        `The number was <strong class="text-primary">${secretNumber}</strong>. Better luck next time!`;
    }

    DOM.resultPopup.showModal();
  }

  function handleGuess() {
    const value = parseInt(DOM.guessInput.value, 10);

    if (isNaN(value) || value < 1 || value > 100) {
      setFeedback('warning', 'fa-triangle-exclamation', 'Please enter a number between 1 and 100.');
      DOM.guessInput.focus();
      return;
    }

    attempts++;
    DOM.attemptsCount.textContent = attempts;
    DOM.guessInput.value = '';

    if (value === secretNumber) {
      showResult(true);
      return;
    }

    const remaining = MAX_ATTEMPTS - attempts;

    if (remaining <= 0) {
      showResult(false);
      return;
    }

    if (value < secretNumber) {
      lowBound = Math.max(lowBound, value + 1);
      setFeedback('warning', 'fa-arrow-up', `Too low! Go higher. <span class="text-xs opacity-60">(${remaining} left)</span>`);
    } else {
      highBound = Math.min(highBound, value - 1);
      setFeedback('error', 'fa-arrow-down', `Too high! Go lower. <span class="text-xs opacity-60">(${remaining} left)</span>`);
    }

    DOM.rangeLow.textContent  = `Low: ${lowBound}`;
    DOM.rangeHigh.textContent = `High: ${highBound}`;
    DOM.guessInput.focus();
  }

  // ── Event Listeners ──
  DOM.startBtn.addEventListener('click', () => {
    resetGame();
    hide(DOM.rulesPanel);
    show(DOM.gameArea, DOM.feedbackArea, DOM.rangeHint);
    DOM.guessInput.focus();
  });

  DOM.confirmBtn.addEventListener(['click', 'keydown'], (e) => {
    if (e.type === 'keydown' && e.key !== 'Enter') return;
    handleGuess();
  });

  DOM.guessInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleGuess();
  });

  DOM.resultCloseBtn.addEventListener(['click'], (e) => {
    resetGame();
    hide(DOM.gameArea, DOM.feedbackArea, DOM.rangeHint);
    show(DOM.rulesPanel);
  });

  DOM.resultPopup.addEventListener(['close'], (e) => {
    resetGame();
    hide(DOM.gameArea, DOM.feedbackArea, DOM.rangeHint);
    show(DOM.rulesPanel);
  });
});
