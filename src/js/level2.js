// level2.js
// Level 2 — Match the sound to the correct Tamil vowel
// Save this file as level2.js and place alongside level2.html + level2.css

const VOWELS = [
  { letter: 'அ', roman: 'AH' },
  { letter: 'ஆ', roman: 'AA' },
  { letter: 'இ', roman: 'IH' },
  { letter: 'ஈ', roman: 'EE' },
  { letter: 'உ', roman: 'U' },
  { letter: 'ஊ', roman: 'OO' },
  { letter: 'எ', roman: 'E' },
  { letter: 'ஏ', roman: 'AE' },
  { letter: 'ஐ', roman: 'AI' },
  { letter: 'ஒ', roman: 'O' },
  { letter: 'ஓ', roman: 'OH' },
  { letter: 'ஔ', roman: 'AU' },
  { letter: 'ஃ', roman: 'ஃ' } // aytham shown as itself
];

const gridEl = document.getElementById('grid');
const playSoundBtn = document.getElementById('playSoundBtn');
const romanLabel = document.getElementById('romanLabel');
const soundHint = document.getElementById('soundHint');
const nextBtn = document.getElementById('nextBtn');
const shuffleBtn = document.getElementById('shuffleBtn');
const resetBtn = document.getElementById('resetBtn');
const roundLabel = document.getElementById('roundLabel');
const scoreLabel = document.getElementById('scoreLabel');
const confettiCanvas = document.getElementById('confetti');
const confettiCtx = confettiCanvas.getContext ? confettiCanvas.getContext('2d') : null;

let currentTarget = null;
let shuffled = [];
let rounds = 0;
let score = 0;
let accepting = true;

// init canvas
function fitCanvas(){
  if (!confettiCtx) return;
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}
window.addEventListener('resize', fitCanvas);
fitCanvas();

// util shuffle
function shuffle(arr){
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random()*(i+1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// render vowel grid
function renderGrid(list){
  gridEl.innerHTML = '';
  list.forEach(item => {
    const btn = document.createElement('button');
    btn.className = 'vowel-card';
    btn.setAttribute('data-letter', item.letter);
    btn.setAttribute('aria-label', `எழுத்து ${item.letter}`);
    btn.innerHTML = `<div class="letter">${item.letter}</div><div class="card-roman">${item.roman}</div>`;
    btn.addEventListener('click', ()=> handleChoice(item, btn));
    gridEl.appendChild(btn);
  });
}

// start a new round
function newRound(){
  accepting = true;
  rounds++;
  roundLabel.textContent = rounds;
  currentTarget = VOWELS[Math.floor(Math.random()*VOWELS.length)];
  romanLabel.textContent = currentTarget.roman;
  soundHint.textContent = '🔊 ' + currentTarget.roman;
  shuffled = shuffle(VOWELS);
  renderGrid(shuffled);
  // auto play sound
  speakTamil(currentTarget.letter);
}

// handle choice
function handleChoice(item, el){
  if(!accepting) return;
  if(item.letter === currentTarget.letter){
    accepting = false;
    el.classList.add('correct');
    playBeep(880,0.12);
    score += 10;
    scoreLabel.textContent = score;
    // disable other cards
    Array.from(gridEl.children).forEach(c => c.classList.add('disabled'));
    celebrateConfetti();
    setTimeout(()=>{
      Array.from(gridEl.children).forEach(c => c.classList.remove('disabled'));
      // next round
      newRound();
    }, 800);
  } else {
    el.classList.add('wrong');
    playBeep(300,0.14);
    speakTamil('இடமில்லை, மறுபடி முயற்சி செய்திடுங்கள்');
    setTimeout(()=> el.classList.remove('wrong'), 650);
  }
}

// TTS: speak Tamil letter
function speakTamil(text){
  if (!('speechSynthesis' in window)) return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'ta-IN';
  const voices = speechSynthesis.getVoices();
  const ta = voices.find(v => v.lang && v.lang.startsWith('ta'));
  if (ta) u.voice = ta;
  speechSynthesis.cancel();
  speechSynthesis.speak(u);
}

// small beep via WebAudio
function playBeep(freq=440, duration=0.08){
  try{
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sine';
    o.frequency.value = freq;
    o.connect(g); g.connect(ctx.destination);
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime+0.01);
    o.start();
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime+duration);
    setTimeout(()=>{ o.stop(); ctx.close(); }, duration*1000+50);
  }catch(e){}
}

// confetti
function celebrateConfetti(){
  if (!confettiCtx) return;
  const pieces = [];
  const w = confettiCanvas.width;
  const h = confettiCanvas.height;
  for (let i=0;i<80;i++){
    pieces.push({
      x: Math.random()*w,
      y: -20 - Math.random()*200,
      vy: 2 + Math.random()*4,
      vx: (Math.random()-0.5)*3,
      rot: Math.random()*6,
      vr: (Math.random()-0.5)*0.2,
      w: 6 + Math.random()*12,
      h: 6 + Math.random()*10,
      color: randomColor()
    });
  }
  let t = 0;
  function loop(){
    t++;
    confettiCtx.clearRect(0,0,w,h);
    for (const p of pieces){
      p.x += p.vx; p.y += p.vy; p.rot += p.vr;
      confettiCtx.save();
      confettiCtx.translate(p.x,p.y);
      confettiCtx.rotate(p.rot);
      confettiCtx.fillStyle = p.color;
      confettiCtx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
      confettiCtx.restore();
    }
    if (t < 120) requestAnimationFrame(loop); else confettiCtx.clearRect(0,0,w,h);
  }
  loop();
}
function randomColor(){
  const cols = ['#ffb703','#fb8500','#219ebc','#8ecae6','#ff006e','#2a9d8f','#ffd166'];
  return cols[Math.floor(Math.random()*cols.length)];
}

// UI wiring
playSoundBtn.addEventListener('click', ()=> {
  if (currentTarget) speakTamil(currentTarget.letter);
});
nextBtn.addEventListener('click', ()=> newRound());
shuffleBtn.addEventListener('click', ()=> {
  shuffled = shuffle(shuffled);
  renderGrid(shuffled);
});
resetBtn.addEventListener('click', ()=> {
  rounds = 0; score = 0;
  roundLabel.textContent = rounds;
  scoreLabel.textContent = score;
  newRound();
});

// preload voices (some browsers require user gesture)
if (window.speechSynthesis) window.speechSynthesis.getVoices();

// start
setTimeout(()=> newRound(), 200);
