import { getSupabaseClient } from "@/lib/supabase";
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

/**
 * Pinned scroll-crossfade reel.
 *
 * Perf design (this is the part that replaces the old demo's always-on
 * `window.addEventListener('scroll', ...)`):
 *
 *  - An IntersectionObserver watches the <section data-reel> wrapper.
 *    The expensive per-frame math only runs while the reel is anywhere
 *    near the viewport; the scroll listener is added/removed as it
 *    enters/leaves, instead of running for the whole lifetime of the page.
 *  - Inside the observer's "active" window, a passive scroll listener
 *    schedules a single requestAnimationFrame callback (never more than
 *    one in flight) that reads layout once (getBoundingClientRect) and
 *    only writes compositor-cheap properties (opacity, transform) — no
 *    property reads/writes are interleaved, so there's no forced reflow.
 */
export function initScrollReel(): void {
  const reel = document.querySelector<HTMLElement>("[data-reel]");
  if (!reel) return;

  const frames = Array.from(reel.querySelectorAll<HTMLElement>(".reel-frame"));
  const frameImgs = frames.map((f) => f.querySelector<HTMLImageElement>("img"));
  const stages = Array.from(reel.querySelectorAll<HTMLElement>(".story__stage"));
  const ticks = Array.from(reel.querySelectorAll<HTMLButtonElement>("[data-tick-index]"));
  const countEl = reel.querySelector<HTMLElement>("[data-reel-count]");
  const cueEl = reel.querySelector<HTMLElement>("[data-reel-cue]");

  const n = frames.length;
  if (!n) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let ticking = false;
  let active = -1;

  function update(): void {
    const rect = reel!.getBoundingClientRect();
    const total = rect.height - window.innerHeight;
    const scrolled = -rect.top;
    let progress = total > 0 ? scrolled / total : 0;
    progress = Math.max(0, Math.min(1, progress));

    const pos = progress * (n - 1);
    const nextActive = Math.round(pos);

    frames.forEach((frame, i) => {
      const d = Math.abs(pos - i);
      const opacity = Math.max(0, 1 - d * 2.4);
      frame.style.opacity = opacity.toFixed(3);
      if (!reduceMotion) {
        const img = frameImgs[i];
        if (img) {
          const scale = 1 + 0.08 * Math.max(0, 1 - opacity);
          img.style.transform = `scale(${scale.toFixed(3)})`;
        }
      }
    });

    if (nextActive !== active) {
      active = nextActive;
      stages.forEach((el, i) => {
        const isActive = i === active;
        el.classList.toggle("is-active", isActive);
        el.setAttribute("aria-hidden", isActive ? "false" : "true");
      });
      ticks.forEach((tick, i) => {
        tick.classList.toggle("is-active", i === active);
        tick.classList.toggle("is-past", i < active);
      });
      if (countEl) {
        countEl.textContent = `${String(active + 1).padStart(2, "0")} / ${String(n).padStart(2, "0")}`;
      }
    }

    if (cueEl) cueEl.style.opacity = progress > 0.02 ? "0" : "1";
  }

  function onScroll(): void {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      update();
      ticking = false;
    });
  }

  let listening = false;
  function attach(): void {
    if (listening) return;
    listening = true;
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
  }
  function detach(): void {
    if (!listening) return;
    listening = false;
    window.removeEventListener("scroll", onScroll);
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) attach();
        else detach();
      }
    },
    { rootMargin: "0px", threshold: 0 }
  );
  io.observe(reel);

  window.addEventListener(
    "resize",
    () => {
      if (listening) update();
    },
    { passive: true }
  );

  // Keyboard / click nav: jump the scroll position to a given stage.
  ticks.forEach((tick, i) => {
    tick.addEventListener("click", () => {
      const rect = reel!.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const targetProgress = i / (n - 1);
      const targetY = window.scrollY + rect.top + targetProgress * total;
      window.scrollTo({ top: targetY, behavior: reduceMotion ? "auto" : "smooth" });
    });
  });

  // Initial paint even before the reel scrolls into the IO's active window
  // (e.g. it's already in view on load).
  update();

  attachRealtimeStock(frames);
}

/**
 * Live stock: any visitor with the page open sees "Agotado" the instant an
 * admin sets stock to 0, and the price reappears the instant it's restocked
 * — without a page reload. Falls back to silent no-op if Supabase env vars
 * are absent (e.g. local dev without a project configured yet).
 */
function attachRealtimeStock(frames: HTMLElement[]): void {
  let supabase;
  try {
    supabase = getSupabaseClient();
  } catch {
    return;
  }

  supabase
    .channel("products-stock")
    .on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "products" },
      (payload: RealtimePostgresChangesPayload<{ sku: string; stock: number; price_cents: number }>) => {
        const row = payload.new as { sku?: string; stock?: number; price_cents?: number };
        if (!row?.sku) return;
        applyStockUpdate(frames, row.sku, row.stock ?? 0, row.price_cents ?? 0);
      }
    )
    .subscribe();
}

function applyStockUpdate(
  frames: HTMLElement[],
  sku: string,
  stock: number,
  priceCents: number
): void {
  const stageEl = document.querySelector<HTMLElement>(`.story__stage[data-sku="${sku}"]`);
  const frameEl = frames.find((f) => f.querySelector(`[data-sku="${sku}"]`));

  const priceLabel = (stock <= 0
    ? "Agotado"
    : (priceCents / 100).toLocaleString("es-ES", { style: "currency", currency: "EUR" }));

  if (stageEl) {
    const priceEl = stageEl.querySelector<HTMLElement>("[data-price]");
    if (priceEl) {
      priceEl.textContent = priceLabel;
      priceEl.classList.toggle("line-through", stock <= 0);
      priceEl.classList.toggle("text-rust", stock <= 0);
    }
  }

  const frameIndex = frameEl ? Number(frameEl.dataset.frameIndex) : -1;
  if (frameIndex >= 0) {
    const existingBadge = frameEl!.querySelector(".reel-badge");
    if (stock <= 0 && !existingBadge) {
      const badge = document.createElement("div");
      badge.className =
        "reel-badge absolute top-[4.5rem] left-[1.1rem] z-[3] bg-rust text-bone font-mono text-[0.68rem] tracking-[0.12em] uppercase px-3 py-1.5 -rotate-3 shadow-lg";
      badge.textContent = "Agotado";
      frameEl!.appendChild(badge);
    } else if (stock > 0 && existingBadge) {
      existingBadge.remove();
    }
  }
}
