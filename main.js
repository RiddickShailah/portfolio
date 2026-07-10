const grid = document.getElementById("project-grid");
const year = document.getElementById("year");

year.textContent = new Date().getFullYear();

PROJECTS.forEach((project) => {
  const card = document.createElement("article");
  card.className = "project-card";
  card.style.setProperty("--accent", project.accent);

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
