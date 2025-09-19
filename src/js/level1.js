// level1_single.js
(() => {
  /* ====== CONFIG: update these paths/audio names if needed ====== */
  const vowels = [
    {
      glyph: "அ",
      pron: "media/pronunciation/card1.mp3",
      learn: "media/learn/card1.mp3",
    },
    {
      glyph: "ஆ",
      pron: "media/pronunciation/card2.mp3",
      learn: "media/learn/card2.mp3",
    },
    {
      glyph: "இ",
      pron: "media/pronunciation/card3.mp3",
      learn: "media/learn/card3.mp3",
    },
    {
      glyph: "ஈ",
      pron: "media/pronunciation/card4.mp3",
      learn: "media/learn/card4.mp3",
    },
    {
      glyph: "உ",
      pron: "media/pronunciation/card5.mp3",
      learn: "media/learn/card5.mp3",
    },
    {
      glyph: "ஊ",
      pron: "media/pronunciation/card6.mp3",
      learn: "media/learn/card6.mp3",
    },
    {
      glyph: "எ",
      pron: "media/pronunciation/card7.mp3",
      learn: "media/learn/card7.mp3",
    },
    {
      glyph: "ஏ",
      pron: "media/pronunciation/card8.mp3",
      learn: "media/learn/card8.mp3",
    },
    {
      glyph: "ஐ",
      pron: "media/pronunciation/card9.mp3",
      learn: "media/learn/card9.mp3",
    },
    {
      glyph: "ஒ",
      pron: "media/pronunciation/card10.mp3",
      learn: "media/learn/card10.mp3",
    },
    {
      glyph: "ஓ",
      pron: "media/pronunciation/card11.mp3",
      learn: "media/learn/card11.mp3",
    },
    {
      glyph: "ஔ",
      pron: "media/pronunciation/card12.mp3",
      learn: "media/learn/card12.mp3",
    },
    {
      glyph: "ஃ",
      pron: "media/pronunciation/card13.mp3",
      learn: "media/learn/card13.mp3",
    },
  ];

  const TOTAL = vowels.length;
  let index = 0;

  // DOM refs
  const glyphEl = document.getElementById("vowel-glyph");
  const progressEl = document.getElementById("progress");
  const playBtn = document.getElementById("btn-play");
  const learnBtn = document.getElementById("btn-learn");
  const nextBtn = document.getElementById("btn-next");

  // audio players (re-used)
  const pronAudio = new Audio();
  const learnAudio = new Audio();

  // proceed overlay creation (keeps same style behavior as prior script)
  const proceedOverlay = createProceedOverlay();
  document.body.appendChild(proceedOverlay);

  // init
  renderCurrent();

  // event wiring
  playBtn.addEventListener("click", () => playPron(index));
  learnBtn.addEventListener("click", () => playLearn(index));
  nextBtn.addEventListener("click", goNext);

  // keyboard shortcuts
  window.addEventListener("keydown", (e) => {
    const tag = document.activeElement && document.activeElement.tagName;
    if (
      tag === "INPUT" ||
      tag === "TEXTAREA" ||
      document.activeElement.isContentEditable
    )
      return;

    if (e.code === "Space") {
      e.preventDefault();
      playPron(index);
    } else if (e.code === "ArrowRight") {
      e.preventDefault();
      goNext();
    } else if (e.code === "ArrowLeft") {
      e.preventDefault();
      // go back
      if (index > 0) {
        index--;
        stopAllAudio();
        renderCurrent(true);
      }
    }
  });

  // functions
  function renderCurrent(animate = false) {
    const item = vowels[index];
    if (!item) return;

    // update glyph and progress
    glyphEl.textContent = item.glyph;
    progressEl.textContent = `${index + 1} / ${TOTAL}`;

    // small animation (fade/scale)
    if (animate) {
      glyphEl.style.transition =
        "transform .28s cubic-bezier(.2,.9,.2,1), opacity .28s";
      glyphEl.style.transform = "scale(.92)";
      glyphEl.style.opacity = "0.28";
      requestAnimationFrame(() => {
        setTimeout(() => {
          glyphEl.style.transform = "";
          glyphEl.style.opacity = "";
        }, 10);
      });
    }

    // update aria-label for the card
    const card = document.querySelector(".tinder-card");
    if (card) {
      card.setAttribute(
        "aria-label",
        `Card ${index + 1} of ${TOTAL}: ${item.glyph}`
      );
    }
  }

  function playPron(i) {
    const item = vowels[i];
    if (!item) return;
    stopAllAudio();
    const src = item.pron || fallbackPron(i);
    pronAudio.src = src;
    pronAudio.currentTime = 0;
    flashAction("playing-pron");
  }

  function playLearn(i) {
    const item = vowels[i];
    if (!item) return;
    stopAllAudio();
    const src = item.learn || fallbackLearn(i);
    learnAudio.src = src;
    learnAudio.currentTime = 0;
    learnAudio.play().catch((err) => {
      showTempNotice("Cannot play lesson (file missing?)");
      console.warn("learn play failed", err);
    });
    flashAction("playing-learn");
  }

  function goNext() {
    stopAllAudio();
    index++;
    if (index >= TOTAL) {
      // show proceed screen
      showProceedOverlay();
      return;
    }
    renderCurrent(true);
  }

  function stopAllAudio() {
    try {
      pronAudio.pause();
      pronAudio.currentTime = 0;
    } catch (e) {}
    try {
      learnAudio.pause();
      learnAudio.currentTime = 0;
    } catch (e) {}
  }

  function fallbackPron(i) {
    return `media/pronunciation/card${i + 1}.mp3`;
  }
  function fallbackLearn(i) {
    return `media/learn/card${i + 1}.mp3`;
  }

  function flashAction(cls) {
    const c = document.querySelector(".tinder-card");
    if (!c) return;
    c.classList.add(cls);
    setTimeout(() => c.classList.remove(cls), 700);
  }

  // small transient UI toast (non-blocking)
  function showTempNotice(msg, ms = 1200) {
    let t = document.getElementById("inline-toast");
    if (!t) {
      t = document.createElement("div");
      t.id = "inline-toast";
      Object.assign(t.style, {
        position: "fixed",
        left: "50%",
        bottom: "40px",
        transform: "translateX(-50%)",
        background: "rgba(0,0,0,0.7)",
        color: "#fff",
        padding: "10px 14px",
        borderRadius: "10px",
        zIndex: 10000,
        fontSize: "14px",
      });
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.style.opacity = "1";
    clearTimeout(t._hideTimer);
    t._hideTimer = setTimeout(() => {
      t.style.opacity = "0";
    }, ms);
  }

  // proceed overlay (same as previous behavior)
  function createProceedOverlay() {
    const overlay = document.createElement("div");
    overlay.id = "proceed-overlay";
    Object.assign(overlay.style, {
      position: "fixed",
      inset: "0",
      display: "none",
      zIndex: "9999",
      background: "rgba(0,0,0,0.6)",
      justifyContent: "center",
      alignItems: "center",
    });

    const box = document.createElement("div");
    Object.assign(box.style, {
      background: "linear-gradient(180deg,#fff,#f1f1f1)",
      padding: "24px",
      borderRadius: "12px",
      boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
      textAlign: "center",
      minWidth: "260px",
    });

    const h = document.createElement("h2");
    h.textContent = "Level Complete!";
    h.style.margin = "0 0 8px";

    const p = document.createElement("p");
    p.textContent = "Great job — proceed to the next level.";
    p.style.margin = "0 0 12px";

    const proceedBtn = document.createElement("button");
    proceedBtn.textContent = "Proceed to Next Level";
    Object.assign(proceedBtn.style, {
      padding: "10px 14px",
      borderRadius: "8px",
      border: "none",
      background: "#1d2671",
      color: "#fff",
      cursor: "pointer",
    });
    proceedBtn.addEventListener("click", () => {
      window.location.href = "level2.html";
    });

    const replayBtn = document.createElement("button");
    replayBtn.textContent = "Replay Level";
    Object.assign(replayBtn.style, {
      marginLeft: "10px",
      padding: "10px 14px",
      borderRadius: "8px",
      border: "none",
      background: "#4caf50",
      color: "#fff",
      cursor: "pointer",
    });
    replayBtn.addEventListener("click", () => {
      hideProceedOverlay();
      index = 0;
      renderCurrent(true);
    });

    box.appendChild(h);
    box.appendChild(p);
    box.appendChild(proceedBtn);
    box.appendChild(replayBtn);
    overlay.appendChild(box);
    overlay.hidden = true;
    return overlay;
  }

  function showProceedOverlay() {
    proceedOverlay.hidden = false;
    proceedOverlay.style.display = "flex";
  }
  function hideProceedOverlay() {
    proceedOverlay.hidden = true;
    proceedOverlay.style.display = "none";
  }

  // expose simple API on window for debugging/dev (optional)
  window.LVL1 = {
    goNext: goNext,
    playPron: () => playPron(index),
    playLearn: () => playLearn(index),
    restart: () => {
      index = 0;
      renderCurrent(true);
    },
    getIndex: () => index,
    setIndex: (i) => {
      if (i >= 0 && i < TOTAL) {
        index = i;
        renderCurrent(true);
      }
    },
  };
})();
