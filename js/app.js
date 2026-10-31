const boot = document.getElementById("boot");
const toast = document.getElementById("toast");
const glow = document.querySelector(".cursor-glow");

const skipBoot = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  || new URLSearchParams(location.search).has("shot");

const finishBoot = () => {
  boot.classList.add("is-done");
  document.body.classList.add("is-ready");
};

if (skipBoot) {
  finishBoot();
} else {
  window.addEventListener("load", () => setTimeout(finishBoot, 650));
}

document.addEventListener("mousemove", (event) => {
  glow.style.left = `${event.clientX}px`;
  glow.style.top = `${event.clientY}px`;
});

const showToast = (text) => {
  toast.textContent = text;
  toast.classList.add("is-on");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("is-on"), 1400);
};

document.querySelectorAll("[data-copy]").forEach((node) => {
  node.addEventListener("click", async () => {
    const value = node.dataset.copy;
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const field = document.createElement("textarea");
      field.value = value;
      document.body.appendChild(field);
      field.select();
      document.execCommand("copy");
      field.remove();
    }
    showToast(`copied  ${value}`);
  });
});

const animateCount = (el) => {
  if (el.dataset.done) return;
  el.dataset.done = "1";
  const target = Number(el.dataset.count);
  const suffix = el.dataset.suffix || "";
  const start = performance.now();
  const duration = 1100;
  el.textContent = `0${suffix}`;

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = `${Math.round(target * eased)}${suffix}`;
    if (progress < 1) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
};

const stats = document.querySelectorAll("[data-count]");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      animateCount(entry.target);
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.25 }
);

stats.forEach((stat) => observer.observe(stat));
