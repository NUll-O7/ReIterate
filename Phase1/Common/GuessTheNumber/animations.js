const { animate, stagger } = Motion;

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initIdleAnimations();
  observeGameArea();
  observeResultPopup();
});

/* ── Theme Toggle ── */
function initThemeToggle() {
  const toggle = document.getElementById('theme-toggle');
  const html = document.documentElement;

  const saved = localStorage.getItem('gtn-theme');
  if (saved === 'forest') {
    html.setAttribute('data-theme', 'forest');
    toggle.checked = true;
  } else {
    html.setAttribute('data-theme', 'retro');
    toggle.checked = false;
  }

  toggle.addEventListener('change', () => {
    const theme = toggle.checked ? 'forest' : 'retro';
    html.setAttribute('data-theme', theme);
    localStorage.setItem('gtn-theme', theme);

    animateThemeSwitch();
  });
}

function animateThemeSwitch() {
  animate(
    document.body,
    { opacity: [0.85, 1] },
    { duration: 0.4, easing: 'ease-out' }
  );
}

/* ── Idle Animations ── */
function initIdleAnimations() {
  const title = document.getElementById('game-title');
  if (title) {
    animate(
      title,
      { y: [0, -4, 0] },
      { duration: 3, repeat: Infinity, easing: 'ease-in-out' }
    );
  }

  const rulesPanel = document.getElementById('rules-panel');
  if (rulesPanel) {
    animate(
      rulesPanel,
      { scale: [1, 1.05, 1], opacity: [0.95, 1, 0.95] },
      { duration: 4, repeat: Infinity, easing: 'ease-in-out' }
    );
  }

  const startBtn = document.getElementById('start-btn');
  if (startBtn) {
    animate(
      startBtn,
      { scale: [1, 1.03, 1] },
      { duration: 2, repeat: Infinity, easing: 'ease-in-out' }
    );
  }

  entranceAnimation();
}

function entranceAnimation() {
  const cards = document.querySelectorAll('.card-section:not(.hidden)');
  if (cards.length > 0) {
    animate(
      cards,
      { opacity: [0, 1], y: [30, 0] },
      { duration: 0.6, delay: stagger(0.15), easing: 'ease-out' }
    );
  }

  const header = document.getElementById('header');
  if (header) {
    animate(
      header,
      { opacity: [0, 1], y: [-20, 0] },
      { duration: 0.5, easing: 'ease-out' }
    );
  }
}

/* ── Game Area – Playing Animation ── */
function observeGameArea() {
  const gameArea = document.getElementById('game-area');
  if (!gameArea) return;

  const observer = new MutationObserver(() => {
    if (!gameArea.classList.contains('hidden')) {
      animateGameAreaEntrance(gameArea);
      startInputGlow();
    }
  });

  observer.observe(gameArea, { attributes: true, attributeFilter: ['class'] });
}

function animateGameAreaEntrance(el) {
  animate(
    el,
    { opacity: [0, 1], y: [20, 0], scale: [0.97, 1] },
    { duration: 0.5, easing: 'ease-out' }
  );
}

function startInputGlow() {
  const input = document.getElementById('guess-input');
  if (!input) return;

  animate(
    input,
    {
      boxShadow: [
        '0 0 0 0 oklch(0.69 0.19 149 / 0)',
        '0 0 12px 2px oklch(0.69 0.19 149 / 0.15)',
        '0 0 0 0 oklch(0.69 0.19 149 / 0)',
      ],
    },
    { duration: 2.5, repeat: Infinity, easing: 'ease-in-out' }
  );
}

/* ── Result Popup Animations ── */
function observeResultPopup() {
  const popup = document.getElementById('result-popup');
  if (!popup) return;

  const observer = new MutationObserver(() => {
    if (popup.open) {
      animatePopupEntrance(popup);

      const resultTitle = document.getElementById('result-title');
      if (resultTitle && resultTitle.textContent.includes('Correct')) {
        spawnConfetti();
        animateWinCelebration();
      }
    }
  });

  observer.observe(popup, { attributes: true, attributeFilter: ['open'] });
}

function animatePopupEntrance(popup) {
  const box = popup.querySelector('.result-modal-box');
  if (!box) return;

  animate(
    box,
    { opacity: [0, 1], y: [40, 0], scale: [0.9, 1] },
    { duration: 0.45, easing: [0.22, 1, 0.36, 1] }
  );
}

function animateWinCelebration() {
  const icon = document.getElementById('result-icon');
  if (icon) {
    animate(
      icon,
      { scale: [0, 1.2, 1], rotate: [0, 15, -10, 0] },
      { duration: 0.7, easing: 'ease-out' }
    );
  }

  const title = document.getElementById('result-title');
  if (title) {
    animate(
      title,
      { opacity: [0, 1], y: [15, 0] },
      { duration: 0.5, delay: 0.2, easing: 'ease-out' }
    );
  }
}

/* ── Confetti Burst ── */
function spawnConfetti() {
  const container = document.getElementById('confetti-container');
  if (!container) return;

  container.innerHTML = '';

  const colors = [
    'oklch(0.85 0.2 84)',
    'oklch(0.72 0.19 232)',
    'oklch(0.65 0.15 160)',
    'oklch(0.72 0.22 22)',
    'oklch(0.69 0.19 149)',
    'oklch(0.7 0.13 168)',
  ];

  const pieces = 40;

  for (let i = 0; i < pieces; i++) {
    const piece = document.createElement('div');
    piece.classList.add('confetti-piece');
    piece.style.backgroundColor = colors[i % colors.length];
    piece.style.left = `${50 + (Math.random() - 0.5) * 20}%`;
    piece.style.top = '50%';
    piece.style.width = `${6 + Math.random() * 6}px`;
    piece.style.height = `${6 + Math.random() * 6}px`;
    piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    container.appendChild(piece);

    const xEnd = (Math.random() - 0.5) * 300;
    const yEnd = -(100 + Math.random() * 200);
    const rotation = (Math.random() - 0.5) * 720;

    animate(
      piece,
      {
        opacity: [0, 1, 1, 0],
        x: [0, xEnd * 0.5, xEnd],
        y: [0, yEnd, yEnd + 60],
        rotate: [0, rotation],
        scale: [0.5, 1, 0.3],
      },
      {
        duration: 1.2 + Math.random() * 0.6,
        delay: Math.random() * 0.3,
        easing: [0.22, 1, 0.36, 1],
      }
    );
  }

  setTimeout(() => {
    container.innerHTML = '';
  }, 2500);
}
