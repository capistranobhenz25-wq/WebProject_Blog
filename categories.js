(function () {
  "use strict";

 

  const revealEls = document.querySelectorAll(".reveal-up");
  if ("IntersectionObserver" in window) {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -48px 0px" }
    );
    revealEls.forEach((el) => obs.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("visible"));
  }


  const ratingFills = document.querySelectorAll(".rating-fill");
  if (ratingFills.length && "IntersectionObserver" in window) {
    const ratingObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Staggered animation
            entry.target.parentElement.closest(".rating-card")
              ?.querySelectorAll(".rating-fill")
              .forEach((fill, i) => {
                setTimeout(() => fill.classList.add("animated"), i * 120);
              });
            ratingObs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    document.querySelectorAll(".rating-card").forEach((card) => {
      const firstFill = card.querySelector(".rating-fill");
      if (firstFill) ratingObs.observe(firstFill);
    });
  }


  const xpFills = document.querySelectorAll(".xp-fill");
  if (xpFills.length && "IntersectionObserver" in window) {
    const xpObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            document.querySelectorAll(".xp-fill").forEach((fill, i) => {
              setTimeout(() => fill.classList.add("animated"), i * 150);
            });
            xpObs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    if (xpFills[0]) xpObs.observe(xpFills[0]);
  }

  const heroBg = document.querySelector(".hero-bg");
  if (heroBg && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.addEventListener("scroll", () => {
      const scrollY = window.scrollY;
      const heroEl = document.querySelector(".article-hero");
      if (!heroEl) return;
      if (scrollY > heroEl.offsetHeight) return;
      const progress = scrollY / heroEl.offsetHeight;
      heroBg.style.transform = `scale(1.08) translateY(${progress * 40}px)`;
    }, { passive: true });
  }


  const logoEl = document.querySelector(".logo");
  if (logoEl) {
    const originalText = logoEl.textContent;
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ'.";
    let timer;

    logoEl.addEventListener("mouseenter", () => {
      let iterations = 0;
      clearInterval(timer);
      timer = setInterval(() => {
        logoEl.textContent = originalText
          .split("")
          .map((char, i) => {
            if (i < iterations) return originalText[i];
            if (char === " ") return " ";
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("");
        if (iterations >= originalText.length) clearInterval(timer);
        iterations += 0.5;
      }, 40);
    });
    logoEl.addEventListener("mouseleave", () => {
      clearInterval(timer);
      logoEl.textContent = originalText;
    });
  }


  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href").slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });


  document.querySelectorAll(".game-card, .food-card, .related-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      if (window.innerWidth < 640) return;
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const rx = ((y - r.height / 2) / (r.height / 2)) * -3;
      const ry = ((x - r.width  / 2) / (r.width  / 2)) *  3;
      card.style.transform = `translateY(-4px) perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
    card.addEventListener("mouseleave", () => { card.style.transform = ""; });
  });

})();