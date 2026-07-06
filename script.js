const select = (target, all = false) => {
  const method = all ? "querySelectorAll" : "querySelector";
  return document[method](target);
};

const words = ["Python Developer", "Django Developer", "Web Developer"];
const typeText = select(".type.text");
let wordIndex = 0;
let charIndex = 0;
let deleting = false;

function typeLoop() {
  if (!typeText) return;

  const word = words[wordIndex];
  const nextText = deleting ? word.slice(0, charIndex - 1) : word.slice(0, charIndex + 1);
  typeText.textContent = nextText;
  charIndex = nextText.length;

  if (!deleting && charIndex === word.length) {
    deleting = true;
    setTimeout(typeLoop, 1350);
    return;
  }

  if (deleting && charIndex === 0) {
    deleting = false;
    wordIndex = (wordIndex + 1) % words.length;
  }

  setTimeout(typeLoop, deleting ? 46 : 78);
}

function navMenu() {
  const button = select(".menu.btn");
  const list = select(".nav.list");
  const links = select(".nav.link", true);

  if (!button || !list) return;

  const closeMenu = () => {
    button.classList.remove("open");
    list.classList.remove("open");
    document.body.classList.remove("menu-open");
    button.setAttribute("aria-expanded", "false");
  };

  button.addEventListener("click", () => {
    const open = button.classList.toggle("open");
    list.classList.toggle("open", open);
    document.body.classList.toggle("menu-open", open);
    button.setAttribute("aria-expanded", String(open));
  });

  links.forEach((link) => link.addEventListener("click", closeMenu));
  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) closeMenu();
  });
}

function activeNav() {
  const sections = select("main section[id]", true);
  const links = select(".nav.link", true);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  }, { rootMargin: "-42% 0px -52% 0px", threshold: 0 });

  sections.forEach((section) => observer.observe(section));
}

function revealOn() {
  const items = select(".reveal", true);

  if (!("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("show"));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("show");
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.16 });

  items.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index % 4, 3) * 80}ms`;
    observer.observe(item);
  });
}

function scrollUi() {
  const header = select(".site.head");
  const topBtn = select(".top.btn");

  const update = () => {
    const moved = window.scrollY > 24;
    header?.classList.toggle("scrolled", moved);
    topBtn?.classList.toggle("show", window.scrollY > 520);
  };

  topBtn?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  window.addEventListener("scroll", update, { passive: true });
  update();
}

function loadPage() {
  const loader = select(".page.loader");
  const year = select("#year");

  if (year) year.textContent = new Date().getFullYear();
  window.addEventListener("load", () => {
    window.setTimeout(() => loader?.classList.add("hide"), 450);
  });
}

function init() {
  loadPage();
  navMenu();
  activeNav();
  revealOn();
  scrollUi();
  typeLoop();
}

init();
