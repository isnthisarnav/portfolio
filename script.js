document.getElementById("year").textContent = new Date().getFullYear();

/* Mobile nav */
const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");

toggle.addEventListener("click", () => {
  const open = toggle.getAttribute("aria-expanded") === "true";
  toggle.setAttribute("aria-expanded", String(!open));
  nav.classList.toggle("open", !open);
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    toggle.setAttribute("aria-expanded", "false");
    nav.classList.remove("open");
  });
});

/* Reveal on scroll */
const revealTargets = document.querySelectorAll(
  ".section, .project-card, .timeline-item, .social-card, .stat-card"
);

revealTargets.forEach((el) => el.classList.add("reveal"));

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
);

revealTargets.forEach((el) => revealObserver.observe(el));

/* Scroll progress bar */
const progressBar = document.querySelector(".scroll-progress span");

function updateProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = pct + "%";
}

window.addEventListener("scroll", updateProgress, { passive: true });
updateProgress();

/* Active nav link highlighting */
const navLinks = document.querySelectorAll(".site-nav a[data-section]");
const sections = Array.from(navLinks)
  .map((link) => document.getElementById(link.dataset.section))
  .filter(Boolean);

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const link = document.querySelector(
        `.site-nav a[data-section="${entry.target.id}"]`
      );
      if (!link) return;
      if (entry.isIntersecting) {
        navLinks.forEach((l) => l.classList.remove("active"));
        link.classList.add("active");
      }
    });
  },
  { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
);

sections.forEach((section) => navObserver.observe(section));

/* Hero role rotator */
const roleWords = [
  "Math & Computing student",
  "Building with Python & JS",
  "Treasurer, Traders@BPHC",
  "Squash player",
  "Data curious",
];

const roleEl = document.getElementById("roleRotator");
let roleIndex = 0;

if (roleEl) {
  setInterval(() => {
    roleIndex = (roleIndex + 1) % roleWords.length;
    roleEl.style.animation = "none";
    // eslint-disable-next-line no-unused-expressions
    roleEl.offsetHeight;
    roleEl.style.animation = "";
    roleEl.textContent = roleWords[roleIndex];
  }, 2600);
}

/* Hero cursor glow */
const hero = document.querySelector(".hero");

if (hero) {
  hero.addEventListener("pointermove", (e) => {
    const rect = hero.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    hero.style.setProperty("--mx", x + "%");
    hero.style.setProperty("--my", y + "%");
  });
}

/* Magnetic buttons */
const magneticEls = document.querySelectorAll(".magnetic");

magneticEls.forEach((el) => {
  let raf = null;

  el.addEventListener("pointermove", (e) => {
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - rect.left - rect.width / 2;
    const relY = e.clientY - rect.top - rect.height / 2;

    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      el.style.transform = `translate(${relX * 0.25}px, ${relY * 0.25}px)`;
    });
  });

  el.addEventListener("pointerleave", () => {
    if (raf) cancelAnimationFrame(raf);
    el.style.transform = "translate(0, 0)";
  });
});

/* Project card tilt */
const tiltCards = document.querySelectorAll(".tilt");

tiltCards.forEach((card) => {
  card.addEventListener("pointermove", (e) => {
    const rect = card.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    const rotateX = (-py * 6).toFixed(2);
    const rotateY = (px * 8).toFixed(2);
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });

  card.addEventListener("pointerleave", () => {
    card.style.transform = "";
  });
});

/* Stat counters */
const statNums = document.querySelectorAll(".stat-num");

function animateCount(el) {
  const target = parseFloat(el.dataset.target);
  const decimals = parseInt(el.dataset.decimals || "0", 10);
  const prefix = el.dataset.prefix || "";
  const suffix = el.dataset.suffix || "";
  const duration = 1400;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = target * eased;
    el.textContent = prefix + value.toFixed(decimals) + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

const statObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        statObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

statNums.forEach((el) => statObserver.observe(el));

/* Timeline category filters */
const filterChips = document.querySelectorAll(".filter-chip");
const timelineItems = document.querySelectorAll(".timeline-item");

filterChips.forEach((chip) => {
  chip.addEventListener("click", () => {
    filterChips.forEach((c) => {
      c.classList.remove("active");
      c.setAttribute("aria-selected", "false");
    });
    chip.classList.add("active");
    chip.setAttribute("aria-selected", "true");

    const filter = chip.dataset.filter;

    timelineItems.forEach((item) => {
      const cats = (item.dataset.cat || "").split(" ");
      const show = filter === "all" || cats.includes(filter);
      item.classList.toggle("hidden", !show);
    });
  });
});
