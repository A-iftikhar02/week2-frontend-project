// ========== App bootstrap ==========
document.addEventListener("DOMContentLoaded", () => {
  // ---------- Mobile Nav ----------
  const toggle = document.querySelector("[data-nav-toggle]");
  const links = document.querySelector("[data-nav-links]");

  if (toggle && links) {
    const closeNav = () => {
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    };

    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });

    // Close the nav when a link is clicked (mobile UX)
    links.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        if (links.classList.contains("open")) closeNav();
      });
    });

    // If viewport grows beyond mobile, ensure menu is closed
    const mql = window.matchMedia("(min-width: 769px)");
    const handleResize = () => closeNav();
    mql.addEventListener ? mql.addEventListener("change", handleResize)
                         : mql.addListener(handleResize); // Safari fallback
  }

  // ---------- Smooth Scroll for #anchors ----------
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      // ignore plain "#" or empty targets
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({
        behavior: prefersReduced ? "auto" : "smooth",
        block: "start",
      });

      // Optional: update hash without page jump
      if (history.pushState) history.pushState(null, "", id);
    });
  });

  // ---------- Contact Form: Frontend "Sent" Message ----------
  (function setupContactForm() {
    const form = document.getElementById("contactForm");
    if (!form) return;
    const successBox = document.getElementById("formSuccess");
    const submitBtn = form.querySelector('[type="submit"]');

    form.addEventListener("submit", (e) => {
      e.preventDefault(); // no backend, no reload
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      // Simulate send, then show confirmation
      submitBtn && (submitBtn.disabled = true);
      setTimeout(() => {
        form.reset();
        if (successBox) {
          successBox.hidden = false;
          successBox.setAttribute("aria-live", "polite");
          successBox.focus?.();
          setTimeout(() => { successBox.hidden = true; }, 4000); // auto-hide
        } else {
          alert("✅ Your message has been sent!");
        }
        submitBtn && (submitBtn.disabled = false);
      }, 150); // tiny delay for nicer UX
    });
  })();

  // ---------- Policies: Expand All / Collapse All ----------
  (function setupPoliciesToggle() {
    const toggleBtn = document.getElementById("toggleAll");
    const panels = Array.from(document.querySelectorAll("details.policy"));
    if (!toggleBtn || panels.length === 0) return;

    const setBtnLabel = () => {
      const everyOpen = panels.every((p) => p.open);
      toggleBtn.textContent = everyOpen ? "Collapse All" : "Expand All";
      return everyOpen;
    };

    // Reflect initial state
    let allOpen = setBtnLabel();

    // Toggle all on click
    toggleBtn.addEventListener("click", () => {
      allOpen = !allOpen;
      panels.forEach((p) => (p.open = allOpen));
      setBtnLabel();
    });

    // Keep button label in sync with manual toggles
    panels.forEach((p) =>
      p.addEventListener("toggle", () => {
        allOpen = setBtnLabel();
      })
    );
  })();

  // ---------- Scroll to Top ----------
  (function setupScrollToTop() {
    const btn = document.querySelector(".to-top");
    if (!btn) return;

    const showAt = 300; // px
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let ticking = false;
    const update = () => {
      const scrolled = window.pageYOffset || document.documentElement.scrollTop;
      if (scrolled > showAt) {
        btn.classList.add("show");
      } else {
        btn.classList.remove("show");
      }
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    update(); // run once on load

    btn.addEventListener("click", () => {
      if (prefersReducedMotion) {
        window.scrollTo(0, 0);
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  })();
});
