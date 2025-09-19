// level2.js — robust Level 2 match-sound game
document.addEventListener('DOMContentLoaded', () => {
  // Data: 13 Tamil vowels + roman hint
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
    { letter: 'ஃ', roman: 'AYTHAM' }
  ];

  // Elements
  const grid = document.getElementById('grid');
  const playBtn = document.getElementById('playBtn');
  const romanEl = document.getElementById('roman');
  const soundHint = document.getElementById('soundHint');
  const feedback = document.getElementById('feedback');
  const roundEl = document.getElementById('round');
  const scoreEl = document.getElementById('score');
  const shuffleBtn = document.getElementById('shuffleBtn');
  const nextBtn = document.getElementById('nextBtn');
  const resetBtn = document.getElementById('resetBtn');
  const confettiCanvas = document.getElementById('confetti');
  const confettiCtx = confettiCanvas.getContext ? confettiCanvas.getContext('2d') : null;

  // State
  let current = null; // chosen target object
  let shuffled = [];
  let rounds = 0;
  let score = 0;
  let accepting = true;

  // helpers
  function shuffleArr(a){
    const arr = a.slice();
    for(let i=arr.length-1;i>0;i--){
      const j = Math.floor(Math.random()*(i+1));
      [arr[i],arr[j]] = [arr[j],arr[i]];
    }
    return arr;
  }

  function fitCanvas(){
    if(!confettiCtx) return;
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', fitCanvas);
  fitCanvas();

  // render grid
  function renderGrid(list){
    grid.innerHTML = '';
    list.forEach(v => {
      const b = document.createElement('button');
      b.className = 'tile';
      b.type = 'button';
      b.setAttribute('data-letter', v.letter);
      b.innerHTML = '<div class="letter">${v.letter}</div><div class="roman" style="font-size:12px;color:#6b8a6b">${v.roman}</div>'';
      b.addEventListener('click', ()=> onChoose(v,b));
      grid.appendChild(b);
    });
  }

  // choose handler
  function onChoose(v, el){
    if(!accepting) return;
    if(!current){
      feedback.textContent = 'முதலில் ஒலியை அழுத்துங்கள்!';
      feedback.style.color = '#c62828';
      return;
    }
    if(v.letter === current.letter){
      accepting = false;
      el.classList.add('correct');
      feedback.textContent = 'சரி! 🎉';
      feedback.style.color = '#2e7d32';
      playBeep(880,0.12);
      score += 10;
      scoreEl.textContent = score;
      disableTiles(true);
      celebrateConfetti();
      setTimeout(()=> {
        accepting = true;
        startRound(); // auto next
      }, 900);
    } else {
      el.classList.add('wrong');
      feedback.textContent = 'மன்னிக்கவும் — மறுபடி முயற்சி செய்யுங்கள்';
      feedback.style.color = '#b00020';
      playBeep(300,0.14);
      setTimeout(()=> el.classList.remove('wrong'), 600);
      // speak gentle hint (non-invasive)
      speakText('மீண்டும் முயற்சி செய்');
    }
  }

  function disableTiles(state){
    Array.from(grid.children).forEach(c => {
      if(state) c.classList.add('disabled'); else c.classList.remove('disabled');
    });
  }

  // TTS
  function speakText(text){
    try {
      if(!('speechSynthesis' in window)) return;
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'ta-IN';
      const voices = speechSynthesis.getVoices();
      const ta = voices.find(v => v.lang && v.lang.startsWith('ta'));
      if(ta) u.voice = ta;
      speechSynthesis.cancel();
      speechSynthesis.speak(u);
    } catch(e){ console.warn('TTS failed', e); }
  }

  // play target sound (letter)
  function playTargetSound(){
    if(!current) return;
    // prefer TTS speaking the letter
    speakText(current.letter);
  }

  function playBeep(freq=440,dur=0.08){
    try{
      const ctx = new (window.AudioContext||window.webkitAudioContext)();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine'; o.frequency.value = freq;
      o.connect(g); g.connect(ctx.destination);
      g.gain.setValueAtTime(0.0001,ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime+0.01);
      o.start();
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime+dur);
      setTimeout(()=>{ o.stop(); ctx.close(); }, dur*1000+60);
    }catch(e){}
  }

  // confetti
  function celebrateConfetti(){
    if(!confettiCtx) return;
    const pieces = [];
    const w = confettiCanvas.width;
    const h = confettiCanvas.height;
    for(let i=0;i<80;i++){
      pieces.push({
        x: Math.random()*w,
        y: -20-Math.random()*200,
        vy: 2+Math.random()*4,
        vx: (Math.random()-0.5)*3,
        rot: Math.random()*6,
        vr: (Math.random()-0.5)*0.2,
        w: 6+Math.random()*12,
        h: 6+Math.random()*10,
        color: randomColor()
      });
    }
    let t=0;
    function loop(){
      t++;
      confettiCtx.clearRect(0,0,w,h);
      for(const p of pieces){
        p.x += p.vx; p.y += p.vy; p.rot += p.vr;
        confettiCtx.save();
        confettiCtx.translate(p.x,p.y);
        confettiCtx.rotate(p.rot);
        confettiCtx.fillStyle = p.color;
        confettiCtx.fillRect(-p.w/2,-p.h/2,p.w,p.h);
        confettiCtx.restore();
      }
      if(t<120) requestAnimationFrame(loop); else confettiCtx.clearRect(0,0,w,h);
    }
    loop();
  }
  function randomColor(){ const cols=['#ffb703','#fb8500','#219ebc','#8ecae6','#ff006e','#2a9d8f']; return cols[Math.floor(Math.random()*cols.length)]; }

  // start round: pick target, shuffle grid
  function startRound(){
    accepting = true;
    rounds++;
    roundEl.textContent = rounds;
    current = VOWELS[Math.floor(Math.random()*VOWELS.length)];
    romanEl.textContent = current.roman;
    soundHint.textContent = '🔊 ' + current.roman;
    shuffled = shuffleArr(VOWELS);
    renderGrid(shuffled);
    feedback.textContent = '';
    scoreEl.textContent = score;
    // auto-play once (requires user gesture earlier to allow TTS)
    setTimeout(()=> {
      try { playTargetSound(); } catch(e){ console.warn(e); }
    }, 240);
  }

  // UI buttons
  playBtn.addEventListener('click', ()=>{
    if(!current) startRound();
    playTargetSound();
  });
  shuffleBtn.addEventListener('click', ()=>{
    shuffled = shuffleArr(shuffled);
    renderGrid(shuffled);
  });
  nextBtn.addEventListener('click', ()=> startRound());
  resetBtn.addEventListener('click', ()=>{
    rounds = 0; score = 0; roundEl.textContent = rounds; scoreEl.textContent = score;
    startRound();
  });

  // preload voices (some browsers populate voices on interaction)
  if(window.speechSynthesis) window.speechSynthesis.getVoices();

  // initial start
  startRound();

  // debug
  console.log('Level2 script loaded. VOWELS count:', VOWELS.length);
});