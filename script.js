// Example partial TSCII → Unicode map
const tsciiToUnicode = {
  "\xA1": "அ",
  "\xA2": "ஆ",
  "\xA3": "இ",
  "\xA4": "ஈ",
  "\xA5": "உ",
  "\xA6": "ஊ",
  "\xA7": "எ",
  "\xA8": "ஏ",
  "\xA9": "ஐ",
  "\xAA": "ஒ",
  "\xAB": "ஓ",
  "\xAC": "ஔ",
  "\xAD": "க",
  "\xAE": "ங",
  "\xAF": "ச",
  "\xB0": "ஜ",
  "\xB1": "ஞ",
  "\xB2": "ட",
  "\xB3": "ண",
  "\xB4": "த",
  "\xB5": "ந",
  "\xB6": "ன",
  "\xB7": "ப",
  "\xB8": "ம",
  "\xB9": "ய",
  "\xBA": "ர",
  "\xBB": "ற",
  "\xBC": "ல",
  "\xBD": "ள",
  "\xBE": "ழ",
  "\xBF": "வ",
  "\xC0": "ஷ",
  "\xC1": "ஸ",
  "\xC2": "ஹ",
  "\xC3": "ஶ",
  "\xC4": "க்ஷ",
  "\xC5": "ஃ",

  // Dependent vowel signs (matras)
  "\xC6": "ா",
  "\xC7": "ி",
  "\xC8": "ீ",
  "\xC9": "ு",
  "\xCA": "ூ",
  "\xCB": "ெ",
  "\xCC": "ே",
  "\xCD": "ை",
  "\xCE": "ொ",
  "\xCF": "ோ",
  "\xD0": "ௌ",

  // Virama + special signs
  "\xD1": "்",
  "\xD2": "ௐ",
  "\xD3": "ௗ",

  // Tamil digits
  "\xD4": "௦", // 0
  "\xD5": "௧", // 1
  "\xD6": "௨", // 2
  "\xD7": "௩", // 3
  "\xD8": "௪", // 4
  "\xD9": "௫", // 5
  "\xDA": "௬", // 6
  "\xDB": "௭", // 7
  "\xDC": "௮", // 8
  "\xDD": "௯", // 9

  // Tamil symbols
  "\xDE": "௰", // 10
  "\xDF": "௱", // 100
  "\xE0": "௲", // 1000
};

function convertTSCIItoUnicode(tsciiText) {
  let result = "";
  for (let i = 0; i < tsciiText.length; i++) {
    const ch = tsciiText[i];
    result += tsciiToUnicodeMap[ch] || ch;
  }
  return result;
}

// Convert
document.getElementById("convertBtn").addEventListener("click", () => {
  const input = document.getElementById("tsciiInput").value;
  const output = convertTSCIItoUnicode(input);
  console.log(output);
  document.getElementById("unicodeOutput").value = output;
});

// Clear
document.getElementById("clearBtn").addEventListener("click", () => {
  document.getElementById("tsciiInput").value = "";
  document.getElementById("unicodeOutput").value = "";
});

// Copy
document.getElementById("copyBtn").addEventListener("click", () => {
  const output = document.getElementById("unicodeOutput");
  output.select();
  document.execCommand("copy");
  alert("✅ Unicode text copied to clipboard!");
});

// Download Output
document.getElementById("downloadBtn").addEventListener("click", () => {
  const text = document.getElementById("unicodeOutput").value;
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "unicode_output.txt";
  link.click();
});

// Theme Switcher
document.getElementById("themeSelect").addEventListener("change", (e) => {
  document.body.className = e.target.value; // switch themes
});
