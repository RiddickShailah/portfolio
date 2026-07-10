let audioCtx = null;
let soundEnabled = true;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

function playCuteTone(config) {
  if (!soundEnabled) return;

  const ctx = getAudioContext();
  if (ctx.state === "suspended") ctx.resume();

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = config.type || "sine";
  osc.frequency.setValueAtTime(config.freq, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(config.freq * 1.6, ctx.currentTime + 0.06);

  gain.gain.setValueAtTime(0.0001, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.14, ctx.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + (config.duration || 0.15));

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + (config.duration || 0.15) + 0.05);
}

function spawnEmote(emoji, x, y) {
  const el = document.createElement("span");
  el.className = "floating-emote";
  el.textContent = emoji;
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  document.body.appendChild(el);
  el.addEventListener("animationend", () => el.remove());
}

function playEmote(name, event) {
  const config = EMOTE_SOUNDS[name];
  if (!config) return;

  playCuteTone(config);

  const x = event?.clientX ?? window.innerWidth / 2;
  const y = event?.clientY ?? window.innerHeight / 2;
  const emojis = config.emoji;

  for (let i = 0; i < 3; i += 1) {
    setTimeout(() => {
      spawnEmote(emojis, x + (Math.random() - 0.5) * 60, y + (Math.random() - 0.5) * 40);
    }, i * 80);
  }
}

function initSoundEmotes() {
  const toggle = document.getElementById("sound-toggle");
  const emoteBar = document.getElementById("emote-bar");

  toggle?.addEventListener("click", () => {
    soundEnabled = !soundEnabled;
    toggle.setAttribute("aria-pressed", String(soundEnabled));
    toggle.textContent = soundEnabled ? "sounds on" : "sounds off";
    if (soundEnabled) playEmote("heart");
  });

  emoteBar?.addEventListener("click", (event) => {
    const btn = event.target.closest("[data-emote]");
    if (!btn) return;
    playEmote(btn.dataset.emote, event);
  });

  document.querySelectorAll(".btn, .hobby-card, .emote-chip").forEach((el) => {
    el.addEventListener("click", (event) => {
      if (el.dataset.sound) playEmote(el.dataset.sound, event);
    });
  });
}
