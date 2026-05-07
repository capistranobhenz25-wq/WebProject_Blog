(function () {
  "use strict";


  const loader = document.getElementById("pageLoader");
  if (loader) {
    // Wait for fonts + fill animation to finish
    window.addEventListener("load", () => {
      setTimeout(() => {
        loader.classList.add("loaded");
      }, 1500);
    });
  }


  const dot = document.getElementById("cursorDot");
  const ring = document.getElementById("cursorRing");

  if (dot && ring && window.matchMedia("(pointer: fine)").matches) {
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    let animId;

    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + "px";
      dot.style.top  = mouseY + "px";
    });

    // Smooth ring follow
    function animateCursor() {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      ring.style.left = ringX + "px";
      ring.style.top  = ringY + "px";
      animId = requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover effect on interactive elements
    const hoverEls = document.querySelectorAll("a, button, label, .card, .dot, .slider-nav");
    hoverEls.forEach((el) => {
      el.addEventListener("mouseenter", () => document.body.classList.add("cursor-hover"));
      el.addEventListener("mouseleave", () => document.body.classList.remove("cursor-hover"));
    });

    // Hide on leave / show on enter
    document.addEventListener("mouseleave", () => { dot.style.opacity = "0"; ring.style.opacity = "0"; });
    document.addEventListener("mouseenter", () => { dot.style.opacity = "1"; ring.style.opacity = "0.6"; });
  }


  const slides = [
    document.getElementById("s1"),
    document.getElementById("s2"),
    document.getElementById("s3"),
  ].filter(Boolean);

  const dots = document.querySelectorAll(".dot");
  const counterEl = document.querySelector(".counter-current");

  let currentSlide = 0;
  let autoplayTimer = null;
  const AUTOPLAY_DURATION = 5000; 

  function goToSlide(index, resetTimer = true) {
    // Clamp
    index = ((index % slides.length) + slides.length) % slides.length;

    // Uncheck all, check target
    slides.forEach((s) => (s.checked = false));
    slides[index].checked = true;
    currentSlide = index;

    // Update dot progress
    dots.forEach((d, i) => {
      d.classList.remove("active-dot");
      const prog = d.querySelector(".dot-progress");
      if (prog) prog.style.width = "0%";
    });

    const activeDot = dots[currentSlide];
    if (activeDot) {
      activeDot.classList.add("active-dot");
      // Animate progress bar
      const prog = activeDot.querySelector(".dot-progress");
      if (prog) {
        prog.style.transition = "none";
        prog.style.width = "0%";
        // Force reflow
        void prog.offsetWidth;
        prog.style.transition = `width ${AUTOPLAY_DURATION}ms linear`;
        prog.style.width = "100%";
      }
    }

    // Update counter
    if (counterEl) {
      counterEl.textContent = String(currentSlide + 1).padStart(2, "0");
    }

    if (resetTimer) {
      clearInterval(autoplayTimer);
      startAutoplay();
    }
  }

  function startAutoplay() {
    autoplayTimer = setInterval(() => {
      goToSlide(currentSlide + 1, false);
    }, AUTOPLAY_DURATION);
  }

  // Prev / Next buttons
  const prevBtn = document.getElementById("sliderPrev");
  const nextBtn = document.getElementById("sliderNext");
  if (prevBtn) prevBtn.addEventListener("click", () => goToSlide(currentSlide - 1));
  if (nextBtn) nextBtn.addEventListener("click", () => goToSlide(currentSlide + 1));

  // Dot clicks
  dots.forEach((dotEl, i) => {
    dotEl.addEventListener("click", () => goToSlide(i));
  });

  // Radio change sync (in case user interacts with radio directly)
  slides.forEach((s, i) => {
    s.addEventListener("change", () => {
      if (s.checked) goToSlide(i);
    });
  });

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft")  goToSlide(currentSlide - 1);
    if (e.key === "ArrowRight") goToSlide(currentSlide + 1);
  });

  // Touch / swipe support
  const sliderEl = document.getElementById("mainSlider");
  if (sliderEl) {
    let touchStartX = 0;
    sliderEl.addEventListener("touchstart", (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
    sliderEl.addEventListener("touchend", (e) => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 50) goToSlide(currentSlide + (dx < 0 ? 1 : -1));
    }, { passive: true });
  }

  // Init first slide
  goToSlide(0);

  const revealEls = document.querySelectorAll(".reveal-up");
  if (revealEls.length && "IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
  
    revealEls.forEach((el) => el.classList.add("visible"));
  }

  const slideBgs = document.querySelectorAll(".slide-bg");
  if (slideBgs.length && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.addEventListener("scroll", () => {
      const scrollY = window.scrollY;
      const sliderSection = document.getElementById("mainSlider");
      if (!sliderSection) return;
      const rect = sliderSection.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const progress = scrollY / (sliderSection.offsetHeight * 0.6);
      const offset = Math.min(progress * 30, 30);
      slideBgs.forEach((bg) => {
        bg.style.transform = `scale(1.08) translateY(${offset}px)`;
      });
    }, { passive: true });
  }


  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      if (window.innerWidth < 640) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotX = ((y - cy) / cy) * -4;
      const rotY = ((x - cx) / cx) * 4;
      card.style.transform = `translateY(-8px) perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });

 
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const targetId = anchor.getAttribute("href").slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  const logoEl = document.querySelector(".logo");
  if (logoEl) {
    const originalText = logoEl.textContent;
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ'.";
    let scrambleTimer;

    logoEl.addEventListener("mouseenter", () => {
      let iterations = 0;
      clearInterval(scrambleTimer);
      scrambleTimer = setInterval(() => {
        logoEl.textContent = originalText
          .split("")
          .map((char, i) => {
            if (i < iterations) return originalText[i];
            if (char === " ") return " ";
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("");
        if (iterations >= originalText.length) clearInterval(scrambleTimer);
        iterations += 0.5;
      }, 40);
    });

    logoEl.addEventListener("mouseleave", () => {
      clearInterval(scrambleTimer);
      logoEl.textContent = originalText;
    });
  }

})();