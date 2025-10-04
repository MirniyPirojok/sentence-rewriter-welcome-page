/* Production i18n bootstrap for a static site
 * - Detects language from navigator.* with ru fallback bucket
 * - Loads /i18n/<lang>.json with network fallback to en
 * - Applies text and attribute translations via data-i18n / data-i18n-attr
 * - Updates <html lang> and document.title
 * - Lazily loads canvas-confetti and runs a short effect
 */

/** Detect preferred language bucket. Returns 'ru' for ru*, otherwise 'en'. */
function detectLang() {
    const nav =
      (Array.isArray(navigator.languages) && navigator.languages[0]) ||
      navigator.language ||
      "en";
    return /^ru\b/i.test(nav) ? "ru" : "en";
  }
  
  /** Load JSON translations with fallback to English on any failure. */
  async function loadTranslations(lang) {
    const tryFetch = async (code) => {
      const res = await fetch(`/i18n/${code}.json`, { cache: "no-store" });
      if (!res.ok) throw new Error(`Failed ${code}`);
      return res.json();
    };
  
    try {
      return await tryFetch(lang);
    } catch {
      if (lang !== "en") {
        try {
          return await tryFetch("en");
        } catch {
          // As a last resort return minimal English dictionary
          return {
            title: "Sentence Rewriter Installed",
            heading: "Sentence Rewriter Installed",
            step1:
              "Click the puzzle piece (1) at the top right of your browser. Then click the pin (2) next to the extension:",
            step2:
              "Open the extension (3) on any page to start using Sentence Rewriter:",
            img1Alt: "Sentence Rewriter Welcome Page - Step 1",
            img2Alt: "Sentence Rewriter Welcome Page - Step 2"
          };
        }
      }
      // lang was en and failed; return minimal
      return {
        title: "Sentence Rewriter Installed",
        heading: "Sentence Rewriter Installed",
        step1:
          "Click the puzzle piece (1) at the top right of your browser. Then click the pin (2) next to the extension:",
        step2:
          "Open the extension (3) on any page to start using Sentence Rewriter:",
        img1Alt: "Sentence Rewriter Welcome Page - Step 1",
        img2Alt: "Sentence Rewriter Welcome Page - Step 2"
      };
    }
  }
  
  /** Apply translations to text nodes and attributes. */
  function applyI18n(dict, lang) {
    // Set <html lang="">
    document.documentElement.lang = lang;
  
    // Title element content + document.title
    const titleEl = document.querySelector('[data-i18n="title"]');
    if (titleEl && dict.title) titleEl.textContent = dict.title;
    if (dict.title) document.title = dict.title;
  
    // Replace text for [data-i18n] except title which we handled above
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (!key || key === "title") return;
      if (Object.prototype.hasOwnProperty.call(dict, key)) {
        el.textContent = String(dict[key]);
      }
    });
  
    // Replace attributes as declared in data-i18n-attr e.g. alt:img1Alt, title:tooltip
    document.querySelectorAll("[data-i18n-attr]").forEach((el) => {
      const mappings = el
        .getAttribute("data-i18n-attr")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
  
      mappings.forEach((pair) => {
        const [attr, k] = pair.split(":").map((s) => s.trim());
        if (!attr || !k) return;
        if (Object.prototype.hasOwnProperty.call(dict, k)) {
          el.setAttribute(attr, String(dict[k]));
        }
      });
    });
  }
  
  /** Dynamically load a script tag and await it. */
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src =
        src ||
        "https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js";
      s.async = true;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }
  
  /** Run a short confetti celebration. */
  function runConfetti() {
    if (typeof window.confetti !== "function") return;
    const duration = 100; // ms
    const end = Date.now() + duration;
  
    (function frame() {
      window.confetti({
        particleCount: 7,
        angle: 60,
        spread: 100,
        origin: { x: 0 }
      });
      window.confetti({
        particleCount: 7,
        angle: 120,
        spread: 100,
        origin: { x: 1 }
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  }
  
  document.addEventListener("DOMContentLoaded", async () => {
    const lang = detectLang();
    const dict = await loadTranslations(lang);
    applyI18n(dict, lang);
  
    // Load confetti library lazily then run
    try {
      await loadScript();
      runConfetti();
    } catch {
      // Silent fail is acceptable for a non-critical effect
    }
  });
  