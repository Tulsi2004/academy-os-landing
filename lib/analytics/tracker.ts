/**
 * First-party analytics beacon. Browser-only — never import from a Server
 * Component.
 *
 * Collects page views, scroll depth, CTA interactions, the form funnel, Core Web
 * Vitals, JS errors, rage/dead clicks and heatmap coordinates, batches them, and
 * POSTs to /api/track. Session replay (rrweb) is loaded lazily and streamed to
 * /api/replay.
 *
 * Everything degrades quietly: this must never break the page it measures.
 */

const VISITOR_KEY = "tulsi_va_vid";
const SESSION_KEY = "tulsi_va_sid";
const REPLAY_OPTOUT_KEY = "tulsi_va_replay_optout";

const FLUSH_INTERVAL_MS = 10_000;
const REPLAY_FLUSH_INTERVAL_MS = 15_000;
const SCROLL_MILESTONES = [25, 50, 75, 100] as const;

// Rage click: this many clicks inside this window and radius.
const RAGE_CLICK_COUNT = 3;
const RAGE_CLICK_WINDOW_MS = 800;
const RAGE_CLICK_RADIUS_PX = 30;
// A click that causes no DOM change and no navigation within this window.
const DEAD_CLICK_WINDOW_MS = 700;

type Json = Record<string, unknown>;

type Queues = {
  pageViews: Json[];
  events: Json[];
  scrolls: Json[];
  ctas: Json[];
  forms: Json[];
  metrics: Json[];
  errors: Json[];
  mouse: Json[];
  heatmap: Json[];
};

function emptyQueues(): Queues {
  return {
    pageViews: [],
    events: [],
    scrolls: [],
    ctas: [],
    forms: [],
    metrics: [],
    errors: [],
    mouse: [],
    heatmap: [],
  };
}

function uuid(): string {
  try {
    if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  } catch {
    /* fall through */
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

function safeGet(store: Storage | undefined, key: string): string | null {
  try {
    return store?.getItem(key) ?? null;
  } catch {
    // Private mode / blocked storage.
    return null;
  }
}

function safeSet(store: Storage | undefined, key: string, value: string): void {
  try {
    store?.setItem(key, value);
  } catch {
    /* ignore */
  }
}

/** Coarse UA parsing — enough to segment traffic, not to identify anyone. */
function readDevice() {
  const ua = navigator.userAgent;

  let browser = "Unknown";
  let browserVersion = "";
  const matchers: Array<[string, RegExp]> = [
    ["Edge", /Edg\/([\d.]+)/],
    ["Opera", /OPR\/([\d.]+)/],
    ["Samsung Internet", /SamsungBrowser\/([\d.]+)/],
    ["Chrome", /Chrome\/([\d.]+)/],
    ["Firefox", /Firefox\/([\d.]+)/],
    ["Safari", /Version\/([\d.]+).*Safari/],
  ];
  for (const [name, re] of matchers) {
    const m = ua.match(re);
    if (m) {
      browser = name;
      browserVersion = m[1] ?? "";
      break;
    }
  }

  let os = "Unknown";
  if (/Windows NT/.test(ua)) os = "Windows";
  else if (/Android/.test(ua)) os = "Android";
  else if (/(iPhone|iPad|iPod)/.test(ua)) os = "iOS";
  else if (/Mac OS X/.test(ua)) os = "macOS";
  else if (/Linux/.test(ua)) os = "Linux";

  const isTablet = /iPad/.test(ua) || (/Android/.test(ua) && !/Mobile/.test(ua));
  const isMobile = /Mobi|iPhone|iPod/.test(ua);
  const deviceType = isTablet ? "tablet" : isMobile ? "mobile" : "desktop";

  return {
    browser,
    browserVersion,
    os,
    deviceType,
    screenWidth: window.screen?.width,
    screenHeight: window.screen?.height,
    language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
}

function currentPath(): string {
  return window.location.pathname || "/";
}

/** Attribution is captured once, when the tab's session starts. */
function readAttribution() {
  const params = new URLSearchParams(window.location.search);
  const get = (k: string) => params.get(k) ?? undefined;
  return {
    entryPath: currentPath(),
    referrer: document.referrer || undefined,
    utmSource: get("utm_source"),
    utmMedium: get("utm_medium"),
    utmCampaign: get("utm_campaign"),
    utmContent: get("utm_content"),
    utmTerm: get("utm_term"),
    gclid: get("gclid"),
    fbclid: get("fbclid"),
    msclkid: get("msclkid"),
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
  };
}

type TrackerState = {
  visitor: Json;
  session: Json;
  queues: Queues;
  lastActivityAt: number;
  currentPageEnteredAt: number;
  currentPagePath: string;
  reachedDepths: Set<number>;
  ctaSeen: Set<string>;
  formsStarted: Set<string>;
  formsSubmitted: Set<string>;
  pageStartTime: number;
  cleanups: Array<() => void>;
};

let state: TrackerState | null = null;
let started = false;

function bump(): void {
  if (state) state.lastActivityAt = Date.now();
}

// --- Transport ---------------------------------------------------------------

function buildPayload(final: boolean): Json | null {
  if (!state) return null;
  const q = state.queues;
  const hasEvents = Object.values(q).some((arr) => arr.length > 0);
  // Nothing to say, and not the final beacon: skip the request entirely.
  if (!hasEvents && !final) return null;

  state.queues = emptyQueues();

  return {
    visitor: state.visitor,
    session: state.session,
    ...q,
    exitPath: currentPath(),
    lastActivityAt: state.lastActivityAt,
  };
}

function send(payload: Json, useBeacon: boolean): void {
  const body = JSON.stringify(payload);
  try {
    if (useBeacon && navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      if (navigator.sendBeacon("/api/track", blob)) return;
    }
    void fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: useBeacon,
    }).catch(() => {
      /* analytics must never surface an error to the page */
    });
  } catch {
    /* ignore */
  }
}

function flush(final = false): void {
  const payload = buildPayload(final);
  if (payload) send(payload, final);
}

// --- Page views --------------------------------------------------------------

function closeCurrentPageView(): void {
  if (!state || !state.currentPagePath) return;
  const now = Date.now();
  const entry = state.queues.pageViews.find(
    (pv) => pv.path === state!.currentPagePath && pv.exitedAt === null,
  );
  if (entry) {
    entry.exitedAt = now;
    entry.timeOnPage = now - state.currentPageEnteredAt;
  }
}

export function trackPageView(path: string, title?: string): void {
  if (!state) return;
  closeCurrentPageView();

  const now = Date.now();
  state.currentPagePath = path;
  state.currentPageEnteredAt = now;
  state.pageStartTime = now;
  state.reachedDepths = new Set();

  state.queues.pageViews.push({
    path,
    title: title ?? document.title,
    enteredAt: now,
    exitedAt: null,
    timeOnPage: null,
  });
  bump();
}

/** Fire an arbitrary named event from anywhere in the app. */
export function trackEvent(name: string, metadata?: Json): void {
  if (!state) return;
  state.queues.events.push({ name, metadata, createdAt: Date.now() });
  bump();
}

/**
 * The visitor/session block /api/leads expects, so a lead submitted from the
 * page is attributed to the same visitor the beacon is already tracking.
 * Null when the beacon never started (admin page, ad blocker, JS error) — the
 * lead still saves, just unattributed.
 */
export function getTrackingIdentity(): { visitor: Json; session: Json } | null {
  if (!state) return null;
  return { visitor: state.visitor, session: state.session };
}

/** Record a form-funnel step (viewed/started/field_focus/.../submitted). */
export function trackFormEvent(
  formId: string,
  action: string,
  extra?: { fieldName?: string; errorMessage?: string },
): void {
  if (!state) return;
  state.queues.forms.push({ formId, action, ...extra, createdAt: Date.now() });
  bump();
}

// --- Listeners ---------------------------------------------------------------

function watchScrollDepth(): () => void {
  const onScroll = () => {
    if (!state) return;
    bump();
    const doc = document.documentElement;
    const scrollable = doc.scrollHeight - window.innerHeight;
    if (scrollable <= 0) return;
    const pct = Math.min(100, Math.round(((window.scrollY || 0) / scrollable) * 100));

    for (const milestone of SCROLL_MILESTONES) {
      if (pct >= milestone && !state.reachedDepths.has(milestone)) {
        state.reachedDepths.add(milestone);
        state.queues.scrolls.push({
          path: state.currentPagePath,
          depth: milestone,
          timeToReach: Date.now() - state.pageStartTime,
          createdAt: Date.now(),
        });
      }
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  return () => window.removeEventListener("scroll", onScroll);
}

/** CTAs opt in with `data-cta="some-id"`. */
function watchCtas(): () => void {
  const hoverStart = new WeakMap<Element, number>();

  const observer = new IntersectionObserver(
    (entries) => {
      if (!state) return;
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const id = (entry.target as HTMLElement).dataset.cta;
        if (!id || state.ctaSeen.has(id)) continue;
        state.ctaSeen.add(id);
        state.queues.ctas.push({ ctaId: id, action: "viewed", createdAt: Date.now() });
      }
    },
    { threshold: 0.5 },
  );

  const observeAll = () => {
    document.querySelectorAll<HTMLElement>("[data-cta]").forEach((el) => observer.observe(el));
  };
  observeAll();

  // The landing pages reveal sections on scroll, so CTAs mount after first paint.
  const mutations = new MutationObserver(observeAll);
  mutations.observe(document.body, { childList: true, subtree: true });

  const onOver = (e: Event) => {
    const el = (e.target as Element | null)?.closest?.("[data-cta]");
    if (el) hoverStart.set(el, Date.now());
  };

  const onOut = (e: Event) => {
    if (!state) return;
    const el = (e.target as Element | null)?.closest?.("[data-cta]");
    if (!el) return;
    const startedAt = hoverStart.get(el);
    if (startedAt === undefined) return;
    hoverStart.delete(el);
    // Ignore pointer grazes.
    if (Date.now() - startedAt < 250) return;
    const id = (el as HTMLElement).dataset.cta;
    if (id) state.queues.ctas.push({ ctaId: id, action: "hovered", createdAt: Date.now() });
  };

  const onClick = (e: Event) => {
    if (!state) return;
    const el = (e.target as Element | null)?.closest?.("[data-cta]");
    const id = el && (el as HTMLElement).dataset.cta;
    if (!id) return;
    state.queues.ctas.push({
      ctaId: id,
      action: "clicked",
      timeBeforeClick: Date.now() - state.pageStartTime,
      createdAt: Date.now(),
    });
    bump();
  };

  document.addEventListener("mouseover", onOver, true);
  document.addEventListener("mouseout", onOut, true);
  document.addEventListener("click", onClick, true);

  return () => {
    observer.disconnect();
    mutations.disconnect();
    document.removeEventListener("mouseover", onOver, true);
    document.removeEventListener("mouseout", onOut, true);
    document.removeEventListener("click", onClick, true);
  };
}

/** Forms opt in with `data-form="some-id"`. */
function watchForms(): () => void {
  const observer = new IntersectionObserver(
    (entries) => {
      if (!state) return;
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const id = (entry.target as HTMLElement).dataset.form;
        if (!id || state.ctaSeen.has(`form:${id}`)) continue;
        state.ctaSeen.add(`form:${id}`);
        trackFormEvent(id, "viewed");
      }
    },
    { threshold: 0.4 },
  );

  const observeAll = () => {
    document.querySelectorAll<HTMLElement>("[data-form]").forEach((el) => observer.observe(el));
  };
  observeAll();
  const mutations = new MutationObserver(observeAll);
  mutations.observe(document.body, { childList: true, subtree: true });

  const formIdOf = (target: EventTarget | null): string | undefined =>
    (target as Element | null)?.closest?.("[data-form]")
      ? ((target as Element).closest("[data-form]") as HTMLElement).dataset.form
      : undefined;

  const onFocus = (e: Event) => {
    if (!state) return;
    const formId = formIdOf(e.target);
    if (!formId) return;
    const field = e.target as HTMLInputElement;
    if (!("name" in field)) return;

    if (!state.formsStarted.has(formId)) {
      state.formsStarted.add(formId);
      trackFormEvent(formId, "started");
    }
    trackFormEvent(formId, "field_focus", { fieldName: field.name || field.id || undefined });
  };

  const onBlur = (e: Event) => {
    const formId = formIdOf(e.target);
    if (!formId) return;
    const field = e.target as HTMLInputElement;
    if (!("value" in field)) return;
    const fieldName = field.name || field.id || undefined;

    if (field.value && field.value.trim()) {
      trackFormEvent(formId, "field_complete", { fieldName });
    }
    if (typeof field.checkValidity === "function" && !field.checkValidity()) {
      trackFormEvent(formId, "validation_error", {
        fieldName,
        errorMessage: field.validationMessage || "invalid",
      });
    }
  };

  const onSubmit = (e: Event) => {
    if (!state) return;
    const formId = formIdOf(e.target);
    if (!formId) return;
    state.formsSubmitted.add(formId);
    trackFormEvent(formId, "submitted");
    flush();
  };

  document.addEventListener("focusin", onFocus, true);
  document.addEventListener("focusout", onBlur, true);
  document.addEventListener("submit", onSubmit, true);

  return () => {
    observer.disconnect();
    mutations.disconnect();
    document.removeEventListener("focusin", onFocus, true);
    document.removeEventListener("focusout", onBlur, true);
    document.removeEventListener("submit", onSubmit, true);
  };
}

/** A form the visitor started but never submitted counts as abandoned. */
function reportAbandonedForms(): void {
  if (!state) return;
  for (const formId of state.formsStarted) {
    if (!state.formsSubmitted.has(formId)) {
      state.queues.forms.push({ formId, action: "abandoned", createdAt: Date.now() });
    }
  }
}

function describeElement(el: Element | null): string | undefined {
  if (!el) return undefined;
  const tag = el.tagName.toLowerCase();
  const id = el.id ? `#${el.id}` : "";
  const cls =
    typeof el.className === "string" && el.className.trim()
      ? `.${el.className.trim().split(/\s+/).slice(0, 3).join(".")}`
      : "";
  return `${tag}${id}${cls}`.slice(0, 256);
}

/** Rage clicks, dead clicks, and normalised heatmap coordinates. */
function watchMouse(): () => void {
  let recent: Array<{ x: number; y: number; t: number }> = [];
  let ragePosted = 0;

  const onClick = (e: MouseEvent) => {
    if (!state) return;
    const now = Date.now();
    const target = e.target as Element | null;
    const path = state.currentPagePath;

    // Heatmap point: x normalised to viewport width, y to full document height,
    // so the overlay lines up regardless of the admin's screen size.
    const docHeight = Math.max(document.documentElement.scrollHeight, 1);
    state.queues.heatmap.push({
      path,
      type: "click",
      xPct: Math.min(100, Math.max(0, (e.clientX / Math.max(window.innerWidth, 1)) * 100)),
      yPct: Math.min(100, Math.max(0, ((e.pageY || e.clientY) / docHeight) * 100)),
      viewportWidth: window.innerWidth,
      createdAt: now,
    });

    // --- rage click ---
    recent = recent.filter((c) => now - c.t < RAGE_CLICK_WINDOW_MS);
    recent.push({ x: e.clientX, y: e.clientY, t: now });
    const cluster = recent.filter(
      (c) => Math.hypot(c.x - e.clientX, c.y - e.clientY) <= RAGE_CLICK_RADIUS_PX,
    );
    if (cluster.length >= RAGE_CLICK_COUNT && now - ragePosted > RAGE_CLICK_WINDOW_MS) {
      ragePosted = now;
      state.queues.mouse.push({
        path,
        type: "rage_click",
        x: Math.round(e.clientX),
        y: Math.round(e.pageY || e.clientY),
        targetSelector: describeElement(target),
        createdAt: now,
      });
    }

    // --- dead click: no DOM mutation and no navigation shortly after ---
    const interactive = target?.closest?.(
      "a,button,input,select,textarea,label,summary,[role=button],[data-cta],[contenteditable=true]",
    );
    if (!interactive) {
      let mutated = false;
      const mo = new MutationObserver(() => {
        mutated = true;
      });
      mo.observe(document.body, { childList: true, subtree: true, attributes: true });
      const pathAtClick = currentPath();

      window.setTimeout(() => {
        mo.disconnect();
        if (mutated || currentPath() !== pathAtClick || !state) return;
        state.queues.mouse.push({
          path,
          type: "dead_click",
          x: Math.round(e.clientX),
          y: Math.round(e.pageY || e.clientY),
          targetSelector: describeElement(target),
          createdAt: now,
        });
      }, DEAD_CLICK_WINDOW_MS);
    }

    bump();
  };

  const onDoubleClick = (e: MouseEvent) => {
    if (!state) return;
    state.queues.mouse.push({
      path: state.currentPagePath,
      type: "double_click",
      x: Math.round(e.clientX),
      y: Math.round(e.pageY || e.clientY),
      targetSelector: describeElement(e.target as Element | null),
      createdAt: Date.now(),
    });
  };

  document.addEventListener("click", onClick, true);
  document.addEventListener("dblclick", onDoubleClick, true);
  return () => {
    document.removeEventListener("click", onClick, true);
    document.removeEventListener("dblclick", onDoubleClick, true);
  };
}

function watchErrors(): () => void {
  const onError = (e: ErrorEvent) => {
    if (!state) return;
    state.queues.errors.push({
      type: "js",
      message: e.message || "Unknown error",
      stack: e.error?.stack,
      path: currentPath(),
      createdAt: Date.now(),
    });
  };

  const onRejection = (e: PromiseRejectionEvent) => {
    if (!state) return;
    const reason = e.reason;
    state.queues.errors.push({
      type: "unhandled_rejection",
      message:
        (reason instanceof Error ? reason.message : String(reason ?? "")) || "Unhandled rejection",
      stack: reason instanceof Error ? reason.stack : undefined,
      path: currentPath(),
      createdAt: Date.now(),
    });
  };

  // Image/resource load failures do not bubble, so this listens in the capture phase.
  const onResourceError = (e: Event) => {
    if (!state) return;
    const el = e.target as HTMLElement | null;
    if (!el || el.tagName !== "IMG") return;
    state.queues.errors.push({
      type: "image_load",
      message: `Image failed to load: ${(el as HTMLImageElement).src || "unknown"}`,
      path: currentPath(),
      createdAt: Date.now(),
    });
  };

  window.addEventListener("error", onError);
  window.addEventListener("unhandledrejection", onRejection);
  window.addEventListener("error", onResourceError, true);

  return () => {
    window.removeEventListener("error", onError);
    window.removeEventListener("unhandledrejection", onRejection);
    window.removeEventListener("error", onResourceError, true);
  };
}

async function watchWebVitals(): Promise<void> {
  try {
    const { onCLS, onFCP, onINP, onLCP, onTTFB } = await import("web-vitals");
    const record = (metric: { name: string; value: number; rating: string }) => {
      if (!state) return;
      state.queues.metrics.push({
        path: state.currentPagePath,
        metric: metric.name,
        // CLS is unitless and tiny; everything else is milliseconds.
        value: metric.value,
        rating: metric.rating,
        createdAt: Date.now(),
      });
    };
    onCLS(record);
    onFCP(record);
    onINP(record);
    onLCP(record);
    onTTFB(record);
  } catch {
    /* web-vitals unavailable — skip silently */
  }
}

// --- Session replay (rrweb) --------------------------------------------------

function replayAllowed(): boolean {
  if (safeGet(window.localStorage, REPLAY_OPTOUT_KEY) === "1") return false;
  // Respect an explicit Do Not Track signal.
  if (navigator.doNotTrack === "1") return false;
  return true;
}

async function startReplay(clientId: string): Promise<() => void> {
  if (!replayAllowed()) return () => {};

  try {
    const { record } = await import("rrweb");

    let buffer: unknown[] = [];
    let pending: unknown[] = [];
    let seq = 0;

    const post = async (events: unknown[], nextSeq: number) => {
      const res = await fetch("/api/replay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId, seq: nextSeq, events }),
      });
      const data = (await res.json().catch(() => ({}))) as { retry?: boolean };
      // The session row does not exist yet — hold the chunk and try again.
      if (data.retry) pending = events.concat(pending);
      else seq = nextSeq + 1;
    };

    const flushReplay = () => {
      const events = pending.concat(buffer);
      buffer = [];
      pending = [];
      if (events.length === 0) return;
      void post(events, seq).catch(() => {
        pending = events.concat(pending);
      });
    };

    const stopRecording = record({
      emit(event) {
        buffer.push(event);
        // Guard against a runaway buffer if the network is down.
        if (buffer.length > 2000) buffer.splice(0, buffer.length - 2000);
      },
      maskAllInputs: true,
      maskTextClass: "rr-mask",
      blockClass: "rr-block",
      recordCanvas: false,
      collectFonts: false,
    });

    const timer = window.setInterval(flushReplay, REPLAY_FLUSH_INTERVAL_MS);

    return () => {
      window.clearInterval(timer);
      flushReplay();
      stopRecording?.();
    };
  } catch {
    return () => {};
  }
}

// --- Lifecycle ---------------------------------------------------------------

export function startTracking(): () => void {
  // React strict mode mounts effects twice in development.
  if (started || typeof window === "undefined") return () => {};
  started = true;

  const device = readDevice();

  let fingerprint = safeGet(window.localStorage, VISITOR_KEY);
  const isReturning = Boolean(fingerprint);
  if (!fingerprint) {
    fingerprint = uuid();
    safeSet(window.localStorage, VISITOR_KEY, fingerprint);
  }

  // One session per tab.
  let clientId = safeGet(window.sessionStorage, SESSION_KEY);
  let attribution: ReturnType<typeof readAttribution>;
  if (clientId) {
    attribution = readAttribution();
  } else {
    clientId = uuid();
    safeSet(window.sessionStorage, SESSION_KEY, clientId);
    attribution = readAttribution();
  }

  const now = Date.now();

  state = {
    visitor: { fingerprint, isReturning, ...device },
    session: { clientId, startedAt: now, ...attribution },
    queues: emptyQueues(),
    lastActivityAt: now,
    currentPageEnteredAt: now,
    currentPagePath: currentPath(),
    reachedDepths: new Set(),
    ctaSeen: new Set(),
    formsStarted: new Set(),
    formsSubmitted: new Set(),
    pageStartTime: now,
    cleanups: [],
  };

  trackPageView(currentPath());

  state.cleanups.push(watchScrollDepth(), watchCtas(), watchForms(), watchMouse(), watchErrors());
  void watchWebVitals();

  let stopReplay: (() => void) | null = null;
  void startReplay(clientId).then((stop) => {
    stopReplay = stop;
  });

  const timer = window.setInterval(() => flush(), FLUSH_INTERVAL_MS);

  const onHide = () => {
    if (document.visibilityState !== "hidden") return;
    closeCurrentPageView();
    reportAbandonedForms();
    flush(true);
  };
  // pagehide is the reliable one on iOS Safari; visibilitychange covers the rest.
  document.addEventListener("visibilitychange", onHide);
  window.addEventListener("pagehide", onHide);

  return () => {
    window.clearInterval(timer);
    document.removeEventListener("visibilitychange", onHide);
    window.removeEventListener("pagehide", onHide);
    state?.cleanups.forEach((fn) => fn());
    stopReplay?.();
    closeCurrentPageView();
    reportAbandonedForms();
    flush(true);
    state = null;
    started = false;
  };
}
