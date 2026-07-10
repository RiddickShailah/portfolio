let jazzInterval = null;
let jazzPlaying = false;
let jazzGain = null;
let jazzVoices = null;

const JAZZ_CHORDS = [
  [146.83, 174.61, 220.0, 261.63],
  [196.0, 233.08, 293.66, 349.23],
  [261.63, 329.63, 392.0, 493.88],
  [220.0, 261.63, 329.63, 392.0],
];

function createJazzLoop() {
  if (jazzVoices) return;

  const ctx = getAudioContext();
  jazzGain = ctx.createGain();
  jazzGain.gain.value = 0.0001;
  jazzGain.connect(ctx.destination);

  jazzVoices = JAZZ_CHORDS[0].map((freq, index) => {
    const osc = ctx.createOscillator();
    const voiceGain = ctx.createGain();
    osc.type = index === 0 ? "triangle" : "sine";
    osc.frequency.value = freq;
    voiceGain.gain.value = index === 0 ? 0.045 : 0.018;
    osc.connect(voiceGain);
    voiceGain.connect(jazzGain);
    osc.start();
    return { osc, voiceGain };
  });

  let step = 0;
  jazzInterval = setInterval(() => {
    if (!jazzPlaying) return;
    step = (step + 1) % JAZZ_CHORDS.length;
    const chord = JAZZ_CHORDS[step];
    chord.forEach((freq, index) => {
      jazzVoices[index].osc.frequency.exponentialRampToValueAtTime(
        freq,
        ctx.currentTime + 0.55
      );
    });
  }, 2800);
}

function startJazz() {
  const ctx = getAudioContext();
  if (ctx.state === "suspended") ctx.resume();
  createJazzLoop();
  jazzPlaying = true;
  jazzGain.gain.exponentialRampToValueAtTime(0.07, ctx.currentTime + 0.8);
}

function stopJazz() {
  jazzPlaying = false;
  if (!jazzGain) return;
  const ctx = getAudioContext();
  jazzGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
}

function initJazzMusic() {
  const toggle = document.getElementById("jazz-toggle");
  if (!toggle) return;

  toggle.addEventListener("click", () => {
    if (jazzPlaying) {
      stopJazz();
      toggle.setAttribute("aria-pressed", "false");
      toggle.textContent = "🎷 jazz off";
    } else {
      startJazz();
      toggle.setAttribute("aria-pressed", "true");
      toggle.textContent = "🎷 jazz on";
    }
  });
}
