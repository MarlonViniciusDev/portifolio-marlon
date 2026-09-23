document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("header");
  const menuToggle = document.querySelector(".menu-toggle");
  const menu = document.getElementById("main-menu");
  const backToTop = document.getElementById("back-to-top");
  const year = document.getElementById("year");
  const navLinks = [...document.querySelectorAll(".menu a")];
  const sections = [...document.querySelectorAll("main section[id]")];
  const revealElements = document.querySelectorAll(".reveal");
  const form = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");

  year.textContent = new Date().getFullYear();

  function updateScrollUI() {
    const scrolled = window.scrollY > 20;
    header.classList.toggle("scrolled", scrolled);
    backToTop.classList.toggle("visible", window.scrollY > 500);

    let current = "inicio";
    sections.forEach((section) => {
      const top = section.offsetTop - 150;
      if (window.scrollY >= top) current = section.id;
    });

    navLinks.forEach((link) => {
      link.classList.toggle(
        "active",
        link.getAttribute("href") === `#${current}`,
      );
    });
  }

  window.addEventListener("scroll", updateScrollUI, { passive: true });
  updateScrollUI();

  function closeMenu() {
    menu.classList.remove("open");
    menuToggle.classList.remove("active");
    menuToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  }

  menuToggle.addEventListener("click", () => {
    const open = !menu.classList.contains("open");
    menu.classList.toggle("open", open);
    menuToggle.classList.toggle("active", open);
    menuToggle.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("menu-open", open);
  });

  navLinks.forEach((link) => link.addEventListener("click", closeMenu));

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );

  revealElements.forEach((el) => observer.observe(el));

  document.querySelectorAll(".placeholder-link").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const type = link.dataset.placeholder;
      formStatus.textContent = `Substitua o placeholder de ${type} no index.html antes de publicar.`;
      formStatus.style.color = "#a8ffcf";
    });
  });

  function setError(field, message) {
    const input = document.getElementById(field);
    const error = document.querySelector(`[data-error-for="${field}"]`);
    input.classList.toggle("invalid", Boolean(message));
    error.textContent = message;
  }

  form.addEventListener("submit", (event) => {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();
    let valid = true;

    setError("name", "");
    setError("email", "");
    setError("message", "");

    if (name.length < 2) {
      setError("name", "Informe seu nome.");
      valid = false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("email", "Informe um e-mail válido.");
      valid = false;
    }

    if (message.length < 10) {
      setError("message", "A mensagem deve ter pelo menos 10 caracteres.");
      valid = false;
    }

    if (!valid) {
      event.preventDefault();
      formStatus.textContent = "Revise os campos destacados.";
      formStatus.style.color = "#ff8d8d";
      return;
    }
  });
});
