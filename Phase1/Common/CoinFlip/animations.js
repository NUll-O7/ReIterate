/* ============================================
   animations.js — Coin flip animation using Motion.js
   Called from logic.js after a valid guess.
   Animates all 3 coins in a staggered sequence.
   ============================================ */

/* --------------------------------------------------
   animateCoinFlip(result)
   Spins each of the 3 coins one-by-one with a stagger.
   Each coin lands on the correct face (H or T)
   matching the generated sequence.
   -------------------------------------------------- */
function animateCoinFlip(result) {
  const coins = DOM.coins;

  // Disable the button while animating
  DOM.submitGuess.disabled = true;

  // Stagger delay between each coin (in ms)
  const staggerDelay = 200;

  // Track completed animations
  let completed = 0;

  coins.forEach(function (coin, i) {
    // Is this coin's result Tails?
    const isTails    = result.seq[i] === 'T';
    // Full spins (1080°) + half-turn extra if tails
    const finalAngle = 1080 + (isTails ? 180 : 0);

    // Slight delay for each subsequent coin
    setTimeout(function () {
      Motion.animate(
        coin,
        { rotateY: [0, finalAngle] },
        { duration: 0.8, easing: 'ease-out' }
      ).then(function () {
        // Set the final resting position
        coin.style.transform = isTails ? 'rotateY(180deg)' : 'rotateY(0deg)';

        completed++;

        // Once all 3 coins have landed, show the result
        if (completed === coins.length) {
          DOM.submitGuess.disabled = false;
          displayResult(result);
        }
      });
    }, i * staggerDelay);
  });
}
