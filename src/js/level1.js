(() => {
  const learnData = {
    அ: ["அறம் செய்ய விரும்பு", "Intend to do the right deeds."],
    ஆ: ["ஆறுவது சினம்", "The nature of anger is to subside."],
    இ: ["இயல்வது கரவேல்", "Help others as much as you can."],
    ஈ: ["ஈவது விலக்கேல்", "Do not stop charitable deeds."],
    உ: ["உடையது விளம்பேல்", "Do not brag about possessions."],
    ஊ: ["ஊக்கமது கைவிடேல்", "Never lose hope."],
    எ: ["எண் எழுத்து இகழேல்", "Do not despise numbers and letters."],
    ஏ: ["ஏற்பது இகழ்ச்சி", "Do not beg."],
    ஐ: ["ஐயமிட்டு உண்", "Eat after offering alms."],
    ஒ: ["ஒப்புரவு ஒழுகு", "Adapt to your world."],
    ஓ: ["ஓதுவது ஒழியேல்", "Never stop learning."],
    ஔ: ["ஒளவியம் பேசேல்", "Do not gossip."],
    ஃ: ["ஃகஞ் சுருக்கேல்", "Do not hinder creativity."],
  };

  const letters = [
    {
      char: "அ",
      sound:
        "https://upload.wikimedia.org/wikipedia/commons/transcoded/5/51/Ta-%E0%AE%85.ogg/Ta-%E0%AE%85.ogg.mp3",
    },
    {
      char: "ஆ",
      sound:
        "https://upload.wikimedia.org/wikipedia/commons/transcoded/e/e8/Ta-%E0%AE%86.ogg/Ta-%E0%AE%86.ogg.mp3",
    },
    {
      char: "இ",
      sound:
        "https://upload.wikimedia.org/wikipedia/commons/transcoded/c/c8/Ta-%E0%AE%87.ogg/Ta-%E0%AE%87.ogg.mp3",
    },
    {
      char: "ஈ",
      sound:
        "https://upload.wikimedia.org/wikipedia/commons/transcoded/d/dd/Ta-%E0%AE%88.ogg/Ta-%E0%AE%88.ogg.mp3",
    },
    {
      char: "உ",
      sound:
        "https://upload.wikimedia.org/wikipedia/commons/transcoded/2/24/Ta-%E0%AE%89.ogg/Ta-%E0%AE%89.ogg.mp3?download",
    },
    {
      char: "ஊ",
      sound:
        "https://upload.wikimedia.org/wikipedia/commons/transcoded/a/aa/Ta-%E0%AE%8A.ogg/Ta-%E0%AE%8A.ogg.mp3?download",
    },
    {
      char: "எ",
      sound:
        "https://upload.wikimedia.org/wikipedia/commons/transcoded/6/65/Ta-%E0%AE%8E.ogg/Ta-%E0%AE%8E.ogg.mp3?download",
    },
    {
      char: "ஏ",
      sound:
        "https://upload.wikimedia.org/wikipedia/commons/transcoded/a/ab/Ta-%E0%AE%8F.ogg/Ta-%E0%AE%8F.ogg.mp3?download",
    },
    {
      char: "ஐ",
      sound:
        "https://upload.wikimedia.org/wikipedia/commons/transcoded/2/20/Ta-%E0%AE%90.ogg/Ta-%E0%AE%90.ogg.mp3?download",
    },
    {
      char: "ஒ",
      sound:
        "https://upload.wikimedia.org/wikipedia/commons/transcoded/d/d0/Ta-%E0%AE%92.ogg/Ta-%E0%AE%92.ogg.mp3?download",
    },
    {
      char: "ஓ",
      sound:
        "https://upload.wikimedia.org/wikipedia/commons/transcoded/1/15/Ta-%E0%AE%93.ogg/Ta-%E0%AE%93.ogg.mp3?download",
    },
    {
      char: "ஔ",
      sound:
        "https://upload.wikimedia.org/wikipedia/commons/transcoded/5/53/Ta-%E0%AE%94.ogg/Ta-%E0%AE%94.ogg.mp3?download",
    },
    {
      char: "ஃ",
      sound:
        "https://upload.wikimedia.org/wikipedia/commons/transcoded/0/0f/Ta-%E0%AE%83.ogg/Ta-%E0%AE%83.ogg.mp3?download",
    },
  ];

  let currentIndex = 0;

  // refs
  const vowelGlyph = document.getElementById("vowel-glyph");
  const progress = document.getElementById("progress");
  const playBtn = document.getElementById("btn-play");
  const learnBtn = document.getElementById("btn-learn");
  const nextBtn = document.getElementById("btn-next");
  const drawBtn = document.getElementById("btn-draw");
  const restartBtn = document.getElementById("btn-restart");

  const learnModal = document.getElementById("learnModal");
  const learnChar = document.getElementById("learnChar");
  const learnTamil = document.getElementById("learnTamil");
  const learnEnglish = document.getElementById("learnEnglish");
  const closeLearn = document.getElementById("closeLearn");

  const drawModal = document.getElementById("drawModal");
  const drawImg = drawModal.querySelector("img");
  const closeDraw = document.getElementById("closeDraw");

  const audio = new Audio();

  function updateCard() {
    vowelGlyph.textContent = letters[currentIndex].char;
    progress.textContent = `${currentIndex + 1} / ${letters.length}`;
  }

  // play sound
  playBtn.addEventListener("click", () => {
    audio.pause();
    audio.currentTime = 0;
    audio.src = letters[currentIndex].sound;
    audio.play();
  });

  // learn
  learnBtn.addEventListener("click", () => {
    const ch = letters[currentIndex].char;
    const [tamil, english] = learnData[ch] || ["", ""];
    learnChar.textContent = ch;
    learnTamil.textContent = tamil;
    learnEnglish.textContent = english;
    learnModal.style.display = "flex";
  });
  closeLearn.addEventListener(
    "click",
    () => (learnModal.style.display = "none")
  );

  // draw
  drawBtn.addEventListener("click", () => {
    drawImg.src = `Image/GIFS/V${currentIndex + 1}.gif`;
    drawModal.style.display = "flex";
  });
  closeDraw.addEventListener("click", () => (drawModal.style.display = "none"));

  // next
  nextBtn.addEventListener("click", () => {
    if (currentIndex < letters.length - 1) {
      currentIndex++;
      updateCard();
      console.log("NEXT");
    } else {
      localStorage.setItem("level1Completed", "true");
      window.location.href = "buttonPage.html";
    }
  });

  // restart
  restartBtn.addEventListener("click", () => {
    currentIndex = 0;
    updateCard();
  });

  // init
  updateCard();
})();
