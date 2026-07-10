const grid = document.getElementById("project-grid");
const hobbyGrid = document.getElementById("hobby-grid");
const year = document.getElementById("year");

year.textContent = new Date().getFullYear();

PROJECTS.forEach((project) => {
  const card = document.createElement("article");
  card.className = "project-card";
  card.style.setProperty("--accent", project.accent);
  card.dataset.sound = "sparkle";

  const imageBlock = project.image
    ? `<img src="${project.image}" alt="${project.title} preview" loading="lazy" />`
    : `<div class="project-placeholder" aria-hidden="true"><span>${project.title}</span></div>`;

  card.innerHTML = `
    <a class="project-media" href="${project.github}" target="_blank" rel="noopener noreferrer">
      ${imageBlock}
    </a>
    <div class="project-body">
      <p class="project-subtitle">${project.subtitle}</p>
      <h3>${project.title}</h3>
      <p class="project-description">${project.description}</p>
      <ul class="project-stack">
        ${project.stack.map((item) => `<li>${item}</li>`).join("")}
      </ul>
      <a class="project-link" href="${project.github}" target="_blank" rel="noopener noreferrer">
        View on GitHub →
      </a>
    </div>
  `;

  grid.appendChild(card);
});

HOBBIES.forEach((hobby) => {
  const card = document.createElement("button");
  card.type = "button";
  card.className = `hobby-card hobby-card--${hobby.animation}`;
  card.dataset.sound = hobby.sound;
  card.setAttribute("aria-label", `${hobby.title}: ${hobby.caption}`);

  card.innerHTML = `
    <div class="hobby-character-wrap">
      <div class="hobby-glow"></div>
      <img class="hobby-character" src="${hobby.image}" alt="${hobby.title} character" loading="lazy" />
      <span class="hobby-emoji">${hobby.emoji}</span>
    </div>
    <div class="hobby-info">
      <h3>${hobby.title}</h3>
      <p>${hobby.caption}</p>
      <span class="hobby-emote-line">${hobby.emote}</span>
    </div>
  `;

  card.addEventListener("click", (event) => {
    playEmote(hobby.sound, event);
    hobby.emote.split(/\s+/).forEach((emoji, index) => {
      setTimeout(() => {
        spawnEmote(emoji, event.clientX + index * 18, event.clientY - 20 - index * 10);
      }, index * 90);
    });
  });

  hobbyGrid.appendChild(card);
});

initSoundEmotes();
