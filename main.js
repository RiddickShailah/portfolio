const grid = document.getElementById("project-grid");
const hobbyGrid = document.getElementById("hobby-grid");
const skillOrbit = document.getElementById("skill-orbit");
const year = document.getElementById("year");

year.textContent = new Date().getFullYear();

PROJECTS.forEach((project) => {
  const card = document.createElement("article");
  card.className = "project-card";
  card.dataset.tilt = "true";
  card.dataset.sound = "sparkle";
  card.style.setProperty("--accent", project.accent);

  const imageBlock = project.image
    ? `<img src="${project.image}" alt="${project.title} preview" loading="lazy" class="project-live-img" />`
    : `<div class="project-placeholder"><span>${project.title}</span></div>`;

  card.innerHTML = `
    <a class="project-media" href="${project.github}" target="_blank" rel="noopener noreferrer">
      ${imageBlock}
      <span class="project-shine"></span>
    </a>
    <div class="project-body">
      <p class="project-subtitle">${project.subtitle}</p>
      <h3>${project.title}</h3>
      <p class="project-description">${project.description}</p>
      <ul class="project-stack">
        ${project.stack.map((item) => `<li>${item}</li>`).join("")}
      </ul>
      <a class="project-link" href="${project.github}" target="_blank" rel="noopener noreferrer">View on GitHub →</a>
    </div>
  `;

  grid.appendChild(card);
});

HOBBIES.forEach((hobby, index) => {
  const card = document.createElement("button");
  card.type = "button";
  card.className = `hobby-card hobby-card--${hobby.animation}`;
  card.dataset.tilt = "true";
  card.dataset.sound = hobby.sound;
  card.style.setProperty("--delay", `${index * 0.08}s`);
  card.setAttribute("aria-label", `${hobby.title}: ${hobby.caption}`);

  card.innerHTML = `
    <div class="hobby-card__scene">
      <div class="hobby-character-wrap">
        <img class="hobby-character" src="${hobby.image}" alt="${hobby.title}" loading="lazy" />
        <span class="hobby-emoji">${hobby.emoji}</span>
        <span class="hobby-shine"></span>
      </div>
      <div class="hobby-info">
        <h3>${hobby.title}</h3>
        <p>${hobby.caption}</p>
        <span class="hobby-emote-line">${hobby.emote}</span>
      </div>
    </div>
  `;

  card.addEventListener("click", (event) => {
    playEmote(hobby.sound, event);
    [...hobby.emote].forEach((emoji, i) => {
      setTimeout(() => {
        spawnEmote(emoji, event.clientX + i * 18, event.clientY - 20 - i * 10);
      }, i * 90);
    });
  });

  hobbyGrid.appendChild(card);
});

SKILLS.forEach((skill, index) => {
  const tag = document.createElement("span");
  tag.className = "skill-tag";
  tag.textContent = skill;
  tag.style.setProperty("--i", index);
  tag.style.setProperty("--total", SKILLS.length);
  skillOrbit.appendChild(tag);
});

initSoundEmotes();
initInteractions();

// Re-bind tilt for dynamically created cards
setTimeout(() => {
  document.querySelectorAll(".project-card, .hobby-card").forEach((el) => {
    if (el.dataset.tiltBound) return;
    el.dataset.tiltBound = "true";
    el.addEventListener("pointermove", (event) => {
      const rect = el.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rotateX = ((y - rect.height / 2) / rect.height) * -14;
      const rotateY = ((x - rect.width / 2) / rect.width) * 16;
      el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(18px)`;
    });
    el.addEventListener("pointerleave", () => {
      el.style.transform = "perspective(1000px) rotateX(0) rotateY(0) translateZ(0)";
    });
  });
}, 0);
