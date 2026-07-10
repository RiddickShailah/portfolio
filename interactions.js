const SKILLS = [
  "TypeScript", "React", "Next.js", "Node.js", "Python", "Flask",
  "SQL", "Prisma", "LangChain", "Docker", "AWS", "GCP", "Git",
];

function initScrollReveal() {
  const reveals = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("is-visible");
      });
    },
    { threshold: 0.12 }
  );
  reveals.forEach((el) => observer.observe(el));
}

function initParallax() {
  const layers = document.querySelectorAll("[data-parallax]");
  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    layers.forEach((layer) => {
      const speed = parseFloat(layer.dataset.parallax || "0.1");
      layer.style.transform = `translate3d(0, ${y * speed}px, 0)`;
    });
  });
}

function initCursorGlow() {
  const glow = document.getElementById("cursor-glow");
  if (!glow) return;

  window.addEventListener("pointermove", (event) => {
    glow.style.left = `${event.clientX}px`;
    glow.style.top = `${event.clientY}px`;
  });
}

function initTilt() {
  const tiltElements = document.querySelectorAll("[data-tilt]");

  tiltElements.forEach((el) => {
    el.addEventListener("pointermove", (event) => {
      const rect = el.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rotateX = ((y - rect.height / 2) / rect.height) * -10;
      const rotateY = ((x - rect.width / 2) / rect.width) * 12;
      el.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(12px)`;
    });

    el.addEventListener("pointerleave", () => {
      el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0)";
    });
  });
}

function initLiveImages() {
  document.querySelectorAll(".live-img").forEach((img) => {
    img.addEventListener("pointermove", (event) => {
      const rect = img.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 14;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 14;
      img.style.transform = `scale(1.08) translate(${x}px, ${y}px)`;
    });
    img.addEventListener("pointerleave", () => {
      img.style.transform = "scale(1) translate(0, 0)";
    });
  });
}

function initThreeScene() {
  const canvas = document.getElementById("scene-canvas");
  if (!canvas || typeof THREE === "undefined") return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const starCount = 420;
  const positions = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount * 3; i += 1) {
    positions[i] = (Math.random() - 0.5) * 18;
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const stars = new THREE.Points(
    starGeo,
    new THREE.PointsMaterial({ color: 0xffd6a0, size: 0.035, transparent: true, opacity: 0.85 })
  );
  scene.add(stars);

  const emberGeo = new THREE.BufferGeometry();
  const emberPositions = new Float32Array(80 * 3);
  for (let i = 0; i < 80 * 3; i += 1) {
    emberPositions[i] = (Math.random() - 0.5) * 10;
  }
  emberGeo.setAttribute("position", new THREE.BufferAttribute(emberPositions, 3));
  const embers = new THREE.Points(
    emberGeo,
    new THREE.PointsMaterial({ color: 0xff9f5a, size: 0.05, transparent: true, opacity: 0.6 })
  );
  scene.add(embers);

  const glowGeo = new THREE.SphereGeometry(0.35, 24, 24);
  const glowMat = new THREE.MeshBasicMaterial({ color: 0xb8a0ff, transparent: true, opacity: 0.18 });
  const orbs = [];
  for (let i = 0; i < 6; i += 1) {
    const orb = new THREE.Mesh(glowGeo, glowMat.clone());
    orb.position.set((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 5, (Math.random() - 0.5) * 3);
    orb.material.color.setHex(i % 2 === 0 ? 0xff8fab : 0x7ec8ff);
    scene.add(orb);
    orbs.push(orb);
  }

  let mouseX = 0;
  let mouseY = 0;
  window.addEventListener("pointermove", (event) => {
    mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (event.clientY / window.innerHeight - 0.5) * 2;
  });

  const animate = () => {
    requestAnimationFrame(animate);
    stars.rotation.y += 0.0004;
    stars.rotation.x += 0.0001;
    embers.rotation.y -= 0.0006;
    embers.position.y = Math.sin(Date.now() * 0.0004) * 0.15;

    orbs.forEach((orb, index) => {
      orb.position.y += Math.sin(Date.now() * 0.001 + index) * 0.002;
      orb.rotation.x += 0.004;
      orb.rotation.y += 0.003;
    });

    camera.position.x += (mouseX * 0.35 - camera.position.x) * 0.04;
    camera.position.y += (-mouseY * 0.25 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  };
  animate();

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

function initInteractions() {
  initScrollReveal();
  initParallax();
  initCursorGlow();
  initTilt();
  initLiveImages();
  initThreeScene();
}
