/* ---------- Constants & state ---------- */
const GRID_SIZE = 8;
const WORD_BANK = [
  "அம்மா",
  "அப்பா",
  "வீடு",
  "பால்",
  "மழை",
  "பறவை",
  "காற்று",
  "பூ",
  "கண்",
  "நிலா",
];
const TARGET_MIN = 3,
  TARGET_MAX = 10;

let targetCount =
  Math.floor(Math.random() * (TARGET_MAX - TARGET_MIN + 1)) + TARGET_MIN;
let grid = [],
  placedWords = [],
  actualPlacedCount = 0;
let guess = 0;

/* DOM refs */
const gridEl = document.getElementById("grid");
const guessValueEl = document.getElementById("guessValue");
const incBtn = document.getElementById("incBtn");
const decBtn = document.getElementById("decBtn");
const submitBtn = document.getElementById("submitGuess");
const overlay = document.getElementById("overlay");
const yayAudio = document.getElementById("yayAudio");
const hintBox = document.getElementById("hintBox");
const bgCanvas = document.getElementById("bgCanvas");

guessValueEl.textContent = guess;

/* ---------- Grid helpers ---------- */
function initGrid() {
  grid = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(null));
}

function canPlace(chars, row, col, dir) {
  const len = chars.length;
  if (dir === "H") {
    if (col + len > GRID_SIZE) return false;
    return chars.every(
      (ch, i) => !grid[row][col + i] || grid[row][col + i] === ch
    );
  } else {
    if (row + len > GRID_SIZE) return false;
    return chars.every(
      (ch, i) => !grid[row + i][col] || grid[row + i][col] === ch
    );
  }
}

function placeWord(chars, row, col, dir) {
  chars.forEach((ch, i) => {
    if (dir === "H") grid[row][col + i] = ch;
    else grid[row + i][col] = ch;
  });
}

function fillEmpty() {
  const FILLER = "அஆஇஈஉஊஎஏஐஒஓஔக்ஙசஞடணதநபமயரலவழளஷ".split("");
  grid.forEach((row, r) =>
    row.forEach((cell, c) => {
      if (!grid[r][c])
        grid[r][c] = FILLER[Math.floor(Math.random() * FILLER.length)];
    })
  );
}

function shuffleArray(a) {
  return a.slice().sort(() => Math.random() - 0.5);
}

function placeRandomWords() {
  placedWords = [];
  actualPlacedCount = 0;
  initGrid();
  let pool = shuffleArray(WORD_BANK);
  let i = 0,
    attempts = 0,
    maxAttempts = 5000;

  while (
    actualPlacedCount < targetCount &&
    attempts < maxAttempts &&
    i < pool.length
  ) {
    const word = pool[i];
    const chars = Array.from(word);
    let placed = false;

    for (let t = 0; t < 200; t++) {
      const dir = Math.random() < 0.5 ? "H" : "V";
      const row = Math.floor(Math.random() * GRID_SIZE);
      const col = Math.floor(Math.random() * GRID_SIZE);
      if (canPlace(chars, row, col, dir)) {
        placeWord(chars, row, col, dir);
        placedWords.push({ word, row, col, dir });
        actualPlacedCount++;
        placed = true;
        break;
      }
    }

    if (!placed) pool.push(word); // retry failed words
    i++;
    attempts++;
  }
  fillEmpty();
}

/* ---------- Render grid ---------- */
function renderGrid() {
  gridEl.innerHTML = "";
  grid.forEach((row, r) =>
    row.forEach((ch, c) => {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.dataset.r = r;
      cell.dataset.c = c;

      const chEl = document.createElement("div");
      chEl.className = "ch";
      chEl.textContent = ch;
      cell.appendChild(chEl);

      cell.addEventListener("mouseenter", () => cell.classList.add("revealed"));
      cell.addEventListener("mouseleave", () =>
        cell.classList.remove("revealed")
      );

      gridEl.appendChild(cell);
    })
  );
}

/* ---------- UI controls ---------- */
incBtn.addEventListener("click", () => {
  if (guess < 10) guess++;
  guessValueEl.textContent = guess;
});
decBtn.addEventListener("click", () => {
  if (guess > 0) guess--;
  guessValueEl.textContent = guess;
});

submitBtn.addEventListener("click", () => {
  if (guess === actualPlacedCount) {
    showOverlay();
    localStorage.setItem("level3Completed", "true");
  } else {
    const diff = guess - actualPlacedCount;
    let msg = "மீண்டும் முயற்சி செய்";
    if (diff > 0) msg += " — உங்கள் எண்ணிக்கை அதிகம்.";
    if (diff < 0) msg += " — உங்கள் எண்ணிக்கை குறைவு.";
    hintBox.textContent = msg;

    setTimeout(() => {
      hintBox.textContent =
        "ஒரு எண்ணைக் செருகவும் (0–10). நீங்கள் நினைக்கும் எண்ணை சரிபார்க்கவும்.";
    }, 3000);
  }
});

/* ---------- Overlay & confetti ---------- */
function showOverlay() {
  overlay.style.pointerEvents = "auto";
  overlay.style.opacity = "1";
  try {
    yayAudio.currentTime = 0;
    yayAudio.play();
  } catch (e) {}
  burstConfetti(180);

  setTimeout(() => {
    overlay.style.opacity = "0";
    overlay.style.pointerEvents = "none";
    startRound();
  }, 4000);
}

function burstConfetti(amount = 60) {
  const colors = [
    "#ffd54f",
    "#ff80ab",
    "#8c9eff",
    "#69f0ae",
    "#ff8a65",
    "#b39ddb",
    "#80deea",
  ];
  for (let i = 0; i < amount; i++) {
    const p = document.createElement("div");
    p.className = "confetti";
    p.style.left = `${Math.random() * 100}vw`;
    p.style.background = colors[Math.floor(Math.random() * colors.length)];
    p.style.width = p.style.height = `${Math.random() * 10 + 6}px`;
    p.style.top = `${-Math.random() * 50 - 10}px`;
    p.style.transform = `rotate(${Math.random() * 360}deg)`;
    const dur = Math.random() * 2.5 + 2.2;
    p.style.animationDuration = `${dur}s`;
    document.body.appendChild(p);
    setTimeout(() => p.remove(), (dur + 0.2) * 1000);
  }
}

/* ---------- Background particles (optimized) ---------- */
(function backgroundParticles() {
  const canvas = bgCanvas;
  const ctx = canvas.getContext("2d");
  let w = (canvas.width = innerWidth),
    h = (canvas.height = innerHeight),
    particles = [];
  const rand = (min, max) => Math.random() * (max - min) + min;
  function init() {
    particles = [];
    for (let i = 0; i < Math.max(12, Math.round(Math.min(w, h) / 40)); i++)
      particles.push({
        x: rand(0, w),
        y: rand(0, h),
        r: rand(0.6, 2.2),
        vx: rand(-0.2, 0.2),
        vy: rand(0.05, 0.25),
        hue: rand(220, 320) | 0,
        alpha: rand(0.06, 0.18),
      });
  }
  function resize() {
    w = canvas.width = innerWidth;
    h = canvas.height = innerHeight;
    init();
  }
  window.addEventListener("resize", resize);
  init();
  let t0 = 0;
  (function frame(ts) {
    const dt = (ts - t0) * 0.001 || 0.016;
    t0 = ts;
    ctx.clearRect(0, 0, w, h);
    ctx.globalCompositeOperation = "lighter";
    particles.forEach((p) => {
      p.x += p.vx * (1 + Math.sin(ts * 0.0002 + p.r));
      p.y += p.vy * (1 + Math.cos(ts * 0.0001 + p.r));
      if (p.y > h + 20) {
        p.y = -10;
        p.x = rand(0, w);
      }
      ctx.beginPath();
      ctx.fillStyle = `hsla(${p.hue},60%,60%,${p.alpha})`;
      ctx.arc(
        p.x,
        p.y + Math.sin((p.x + ts * 0.02) / 120) * 6,
        p.r,
        0,
        Math.PI * 2
      );
      ctx.fill();
    });
    ctx.globalCompositeOperation = "source-over";
    requestAnimationFrame(frame);
  })(0);
})();

/* ---------- Init game ---------- */
function startRound() {
  targetCount =
    Math.floor(Math.random() * (TARGET_MAX - TARGET_MIN + 1)) + TARGET_MIN;
  placeRandomWords();
  renderGrid();
  guess = 0;
  guessValueEl.textContent = guess;
  hintBox.innerHTML = `இந்த ஆட்டத்தில் மறைக் சொற்களின் எண்ணிக்கை (உள்ளே): <strong>${actualPlacedCount}</strong>`;
  setTimeout(
    () =>
      (hintBox.innerHTML =
        "ஒரு எண்ணைக் செருகவும் (0–10). நீங்கள் நினைக்கும் எண்ணை சரிபார்க்கவும்."),
    2200
  );
}

/* start first round */
startRound();

/* expose for debugging */
window._level3 = { startRound, placedWords, actualPlacedCount };
