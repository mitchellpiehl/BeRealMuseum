import { unzipSync, strFromU8, zipSync } from "https://cdn.jsdelivr.net/npm/fflate@0.8.2/esm/browser.js";

const els = {
  file: document.getElementById("file"),
  status: document.getElementById("status"),
  count: document.getElementById("count"),
  tabs: [...document.querySelectorAll(".tab")],
  views: {
    timeline: document.getElementById("view-timeline"),
    favorites: document.getElementById("view-favorites"),
    mosaic: document.getElementById("view-mosaic"),
  },

  exportNotes: document.getElementById("exportNotes"),
  importNotes: document.getElementById("importNotes"),

  favCount: document.getElementById("favCount"),
  favoritesGrid: document.getElementById("favoritesGrid"),
  favoritesStrip: document.getElementById("favoritesStrip"),

  sortAsc: document.getElementById("sortAsc"),
  sortDesc: document.getElementById("sortDesc"),

  buildMosaic: document.getElementById("buildMosaic"),
  shuffleMosaic: document.getElementById("shuffleMosaic"),
  mosaic: document.getElementById("mosaic"),

  favModeGrid: document.getElementById("favModeGrid"),
  favModeStrip: document.getElementById("favModeStrip"),
  favModeStory: document.getElementById("favModeStory"),
  favModeRoulette: document.getElementById("favModeRoulette"),
  favModeOnThisDay: document.getElementById("favModeOnThisDay"),

  // NEW
  favModeReel: document.getElementById("favModeReel"),
  favModeWall: document.getElementById("favModeWall"),
  favModeBook: document.getElementById("favModeBook"),
  favModeEras: document.getElementById("favModeEras"),

  labelFilter: document.getElementById("labelFilter"),
  labelSearch: document.getElementById("labelSearch"),

  onThisDayControls: document.getElementById("onThisDayControls"),
  monthPick: document.getElementById("monthPick"),
  dayPick: document.getElementById("dayPick"),

  exportFavorites: document.getElementById("exportFavorites"),

  rouletteWrap: document.getElementById("rouletteWrap"),
  rouletteSpin: document.getElementById("rouletteSpin"),
  rouletteStage: document.getElementById("rouletteStage"),

  // Museum Wall
  museumWallWrap: document.getElementById("museumWallWrap"),
  museumWall: document.getElementById("museumWall"),
  wallRegenerate: document.getElementById("wallRegenerate"),
  wallReduceMotion: document.getElementById("wallReduceMotion"),

  // Book
  bookWrap: document.getElementById("bookWrap"),
  bookSidebar: document.getElementById("bookSidebar"),
  bookPrev: document.getElementById("bookPrev"),
  bookNext: document.getElementById("bookNext"),
  bookPageInfo: document.getElementById("bookPageInfo"),
  bookPrint: document.getElementById("bookPrint"),
  bookPageHost: document.getElementById("bookPageHost"),

  // Eras
  eraWrap: document.getElementById("eraWrap"),
  eraName: document.getElementById("eraName"),
  eraStart: document.getElementById("eraStart"),
  eraEnd: document.getElementById("eraEnd"),
  eraAdd: document.getElementById("eraAdd"),
  eraList: document.getElementById("eraList"),
  eraWarnings: document.getElementById("eraWarnings"),
  eraGallery: document.getElementById("eraGallery"),
  eraFilterAffects: document.getElementById("eraFilterAffects"),
  eraBrowse: document.getElementById("eraBrowse"),
  eraBrowseTitle: document.getElementById("eraBrowseTitle"),
  eraBrowseGrid: document.getElementById("eraBrowseGrid"),
  eraBack: document.getElementById("eraBack"),

  // Reel
  reelModal: document.getElementById("reelModal"),
  reelBack: document.getElementById("reelBack"),
  reelFront: document.getElementById("reelFront"),
  reelLabel: document.getElementById("reelLabel"),
  reelMeta: document.getElementById("reelMeta"),
  reelPrev: document.getElementById("reelPrev"),
  reelNext: document.getElementById("reelNext"),
  reelPlay: document.getElementById("reelPlay"),
  reelClose: document.getElementById("reelClose"),
  reelSpeed: document.getElementById("reelSpeed"),
  reelShowLabels: document.getElementById("reelShowLabels"),
  reelMusic: document.getElementById("reelMusic"),

  // Story modal
  storyModal: document.getElementById("storyModal"),
  storyBack: document.getElementById("storyBack"),
  storyFront: document.getElementById("storyFront"),
  storyLabel: document.getElementById("storyLabel"),
  storyMeta: document.getElementById("storyMeta"),
  storyPrev: document.getElementById("storyPrev"),
  storyNext: document.getElementById("storyNext"),
  storyClose: document.getElementById("storyClose"),
  storyNavLeft: document.getElementById("storyNavLeft"),
  storyNavRight: document.getElementById("storyNavRight"),

  // Timeline modes
  tlModeGrid: document.getElementById("tlModeGrid"),
  tlModeStrip: document.getElementById("tlModeStrip"),
  tlModeOnThisDay: document.getElementById("tlModeOnThisDay"),
  tlOnThisDayControls: document.getElementById("tlOnThisDayControls"),
  tlMonthPick: document.getElementById("tlMonthPick"),
  tlDayPick: document.getElementById("tlDayPick"),
  timelineGrid: document.getElementById("timelineGrid"),
  timelineStrip: document.getElementById("timelineStrip"),
};

let posts = [];
let mediaObjectUrls = [];
let notes = loadNotes();

let favMode = "grid"; // plus: reel | wall | book | eras
let storyIndex = 0;
let tlMode = "grid";

function setStatus(msg) { if (els.status) els.status.textContent = msg; }
function enable(el, ok) { if (el) el.disabled = !ok; }

function setView(name) {
  for (const [k, v] of Object.entries(els.views)) if (v) v.style.display = (k === name) ? "" : "none";
  els.tabs.forEach(t => t.classList.toggle("active", t.dataset.view === name));
  if (name === "favorites") {
    setFavMode(favMode || "grid");
    #refreshFavoritesUI();
  }
}

function stripExt(name) { return (name || "").replace(/\.(webp|png|jpe?g)$/i, ""); }
function filenameFromPath(p) {
  if (!p || typeof p !== "string") return "";
  const s = p.startsWith("/") ? p.slice(1) : p;
  return s.split("/").pop() || "";
}
function postKey(p) {
  return `${p.date.toISOString()}|${stripExt(p.backName || "")}|${stripExt(p.frontName || "")}`;
}

function loadNotes() {
  try { return JSON.parse(localStorage.getItem("bereal_notes") || "{}"); }
  catch { return {}; }
}
function saveNotes() { localStorage.setItem("bereal_notes", JSON.stringify(notes)); }
function getNote(key) { return notes[key] || { favorite: false, label: "" }; }
function setNote(key, patch) { notes[key] = { ...getNote(key), ...patch }; saveNotes(); }

function normalizeText(s) { return (s || "").toLowerCase().trim(); }
function escapeHtml(s) { return (s || "").replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;" }[c])); }

function getFavoritePosts() { return posts.filter(p => getNote(postKey(p)).favorite); }

function getFilteredFavorites() {
  const favs = getFavoritePosts();
  const labelSel = els.labelFilter?.value || "";
  const q = normalizeText(els.labelSearch?.value);

  return favs.filter(p => {
    const note = getNote(postKey(p));
    const label = note.label || "";
    const matchesLabel = labelSel ? normalizeText(label) === normalizeText(labelSel) : true;
    const matchesSearch = q
      ? (normalizeText(label).includes(q) || p.date.toLocaleDateString().toLowerCase().includes(q))
      : true;
    return matchesLabel && matchesSearch;
  });
}

function populateLabelFilter() {
  if (!els.labelFilter) return;
  const favs = getFavoritePosts();
  const labels = new Map();
  for (const p of favs) {
    const label = (getNote(postKey(p)).label || "").trim();
    if (!label) continue;
    labels.set(normalizeText(label), label);
  }
  const current = els.labelFilter.value;
  els.labelFilter.innerHTML = `<option value="">All labels</option>` +
    [...labels.values()].sort((a,b)=>a.localeCompare(b))
      .map(l => `<option value="${escapeHtml(l)}">${escapeHtml(l)}</option>`)
      .join("");
  if ([...els.labelFilter.options].some(o => o.value === current)) els.labelFilter.value = current;
}

function populateDayPick(selectEl) {
  if (!selectEl) return;
  selectEl.innerHTML = "";
  for (let d = 1; d <= 31; d++) {
    const opt = document.createElement("option");
    opt.value = String(d);
    opt.textContent = String(d);
    selectEl.appendChild(opt);
  }
}

function setFavMode(mode) {
  favMode = mode;

  const buttons = [
    ["grid", els.favModeGrid],
    ["strip", els.favModeStrip],
    ["story", els.favModeStory],
    ["roulette", els.favModeRoulette],
    ["onthisday", els.favModeOnThisDay],
    ["reel", els.favModeReel],
    ["wall", els.favModeWall],
    ["book", els.favModeBook],
    ["eras", els.favModeEras],
  ];
  for (const [m, btn] of buttons) {
    if (!btn) continue;
    btn.style.background = (m === favMode) ? "#111" : "#fff";
    btn.style.color = (m === favMode) ? "#fff" : "#111";
    btn.style.borderColor = (m === favMode) ? "#111" : "#ddd";
  }

  if (mode === "story") {
    const favs = getFilteredFavoritesForCurrentMode();
    if (!favs.length) { setStatus("No favorites to show in Story view."); return; }
    openStory(favs, 0);
    return;
  } else {
    closeStory();
  }

  refreshFavoritesUI();
}

function filterOnThisDay(list, monthSel, daySel) {
  const m = parseInt(monthSel?.value || "1", 10);
  const d = parseInt(daySel?.value || "1", 10);
  return list.filter(p => (p.date.getMonth()+1) === m && p.date.getDate() === d);
}

function getFilteredFavoritesForCurrentMode() {
  let favs = getFilteredFavorites();
  if (favMode === "onthisday") favs = filterOnThisDay(favs, els.monthPick, els.dayPick);
  return favs;
}

function hideFavoritesAll() {
  if (els.favoritesGrid) els.favoritesGrid.style.display = "none";
  if (els.favoritesStrip) els.favoritesStrip.style.display = "none";
  if (els.rouletteWrap) els.rouletteWrap.style.display = "none";
  if (els.onThisDayControls) els.onThisDayControls.style.display = "none";
  if (els.museumWallWrap) els.museumWallWrap.style.display = "none";
  if (els.bookWrap) els.bookWrap.style.display = "none";
  if (els.eraWrap) els.eraWrap.style.display = "none";
}

function refreshFavoritesUI() {
  if (!posts.length) return;

  const favs = getFilteredFavoritesForCurrentMode();
  if (els.favCount) els.favCount.textContent = `${favs.length} favorites`;

  hideFavoritesAll();

  if (favMode === "grid" || favMode === "onthisday") {
    if (els.onThisDayControls) els.onThisDayControls.style.display = (favMode === "onthisday") ? "flex" : "none";
    if (els.favoritesGrid) els.favoritesGrid.style.display = "grid";
    renderFavoritesGrid(favs);
    return;
  }
  if (favMode === "strip") {
    if (els.favoritesStrip) els.favoritesStrip.style.display = "flex";
    renderFavoritesStrip(favs);
    return;
  }
  if (favMode === "roulette") {
    if (els.rouletteWrap) els.rouletteWrap.style.display = "";
    renderRouletteStage(favs);
    return;
  }
  if (favMode === "wall") {
    if (els.museumWallWrap) els.museumWallWrap.style.display = "block";
    renderMuseumWall(favs);
    return;
  }
  if (favMode === "book") {
    if (els.bookWrap) els.bookWrap.style.display = "flex";
    renderBookPreview(favs);
    return;
  }
  if (favMode === "eras") {
    if (els.eraWrap) els.eraWrap.style.display = "block";
    renderEraView(favs);
    return;
  }
  if (favMode === "reel") {
    openHighlightReel(favs);
    return;
  }
}

/* ---------- Favorites Tiles + fast rendering ---------- */
function makeFavoriteTile(it, favListForStory) {
  const key = postKey(it);
  const note = getNote(key);

  const tile = document.createElement("div");
  tile.className = "tile";

  const frame = document.createElement("div");
  frame.className = "frame";

  if (it.backUrl) {
    const back = document.createElement("img");
    back.className = "back";
    back.loading = "lazy";
    back.src = it.backUrl;
    frame.appendChild(back);
  }
  if (it.frontUrl) {
    const front = document.createElement("img");
    front.className = "front";
    front.loading = "lazy";
    front.src = it.frontUrl;
    frame.appendChild(front);
  }

  const meta = document.createElement("div");
  meta.className = "meta";
  meta.style.flexDirection = "column";
  meta.style.gap = "6px";

  const line1 = document.createElement("div");
  line1.textContent = it.date.toLocaleDateString();
  const line2 = document.createElement("div");
  line2.className = "muted";
  line2.textContent = note.label || "";

  meta.append(line1, line2);
  tile.append(frame, meta);

  tile.addEventListener("click", () => {
    const favs = favListForStory || getFilteredFavoritesForCurrentMode();
    const idx = favs.findIndex(x => postKey(x) === postKey(it));
    openStory(favs, Math.max(0, idx));
  });

  return tile;
}

function renderFavoritesGrid(favs) {
  if (!els.favoritesGrid) return;
  els.favoritesGrid.innerHTML = "";

  const frag = document.createDocumentFragment();
  const CHUNK = 40;
  let i = 0;

  const step = () => {
    const end = Math.min(favs.length, i + CHUNK);
    for (; i < end; i++) frag.appendChild(makeFavoriteTile(favs[i], favs));
    els.favoritesGrid.appendChild(frag);
    if (i < favs.length) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function renderFavoritesStrip(favs) {
  if (!els.favoritesStrip) return;
  els.favoritesStrip.innerHTML = "";
  const frag = document.createDocumentFragment();
  for (const it of favs) {
    const tile = makeFavoriteTile(it, favs);
    tile.classList.add("stripCard");
    frag.appendChild(tile);
  }
  els.favoritesStrip.appendChild(frag);
}

/* ---------- Roulette ---------- */
function renderRouletteStage(favs) {
  if (!els.rouletteStage) return;
  els.rouletteStage.innerHTML = "";
  if (!favs.length) {
    els.rouletteStage.innerHTML = `<div class="muted">No favorites match the current filters.</div>`;
    return;
  }
  els.rouletteStage.appendChild(makeFavoriteTile(favs[0], favs));
}

/* ===========================
   Highlight Reel (Favorites)
   =========================== */
const REEL_KEY = "bereal_reel_settings";
let reelState = {
  idx: 0,
  playing: true,
  ms: 3000,
  showLabels: true,
  music: false,
};
let reelTimer = null;
let reelAudio = { ctx: null, osc: null, gain: null };

function loadReelSettings() {
  try {
    const o = JSON.parse(localStorage.getItem(REEL_KEY) || "null");
    if (!o) return;
    reelState = { ...reelState, ...o };
  } catch {}
}
function saveReelSettings() {
  localStorage.setItem(REEL_KEY, JSON.stringify({
    ms: reelState.ms,
    showLabels: reelState.showLabels,
    music: reelState.music,
  }));
}

function reelEnsureAudio(on) {
  if (!on) {
    if (reelAudio.osc) { try { reelAudio.osc.stop(); } catch {} }
    reelAudio = { ctx: null, osc: null, gain: null };
    return;
  }
  if (reelAudio.ctx) return;
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  gain.gain.value = 0.03;
  osc.type = "sine";
  osc.frequency.value = 220;
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  reelAudio = { ctx, osc, gain };
}

function reelStopTimer() {
  if (reelTimer) clearInterval(reelTimer);
  reelTimer = null;
}

function reelSchedule(favs) {
  reelStopTimer();
  if (!reelState.playing) return;
  reelTimer = setInterval(() => {
    reelState.idx = (reelState.idx + 1) % favs.length;
    reelRender(favs, true);
  }, reelState.ms);
}

function reelPreload(favs, idx) {
  // buffer: current + next 2
  for (let k = 0; k <= 2; k++) {
    const p = favs[(idx + k) % favs.length];
    const u = p.backUrl || p.frontUrl;
    if (!u) continue;
    const img = new Image();
    img.src = u;
  }
}

function openHighlightReel(favs) {
  if (!els.reelModal) return;
  if (!favs.length) { setStatus("No favorites match the current filters."); return; }
  loadReelSettings();

  reelState.idx = Math.max(0, Math.min(reelState.idx, favs.length - 1));
  els.reelModal.classList.add("open");

  if (els.reelSpeed) els.reelSpeed.value = String(reelState.ms);
  if (els.reelShowLabels) els.reelShowLabels.checked = !!reelState.showLabels;
  if (els.reelMusic) els.reelMusic.checked = !!reelState.music;

  reelEnsureAudio(reelState.music);
  reelRender(favs, false);
  reelSchedule(favs);
}

function closeHighlightReel() {
  if (!els.reelModal) return;
  els.reelModal.classList.remove("open");
  reelStopTimer();
  reelEnsureAudio(false);
}

function reelRender(favs, anim) {
  const it = favs[reelState.idx];
  const note = getNote(postKey(it));
  const backUrl = it.backUrl || it.frontUrl || "";
  const frontUrl = it.frontUrl || "";

  if (els.reelBack) {
    if (anim) els.reelBack.classList.remove("show");
    els.reelBack.src = backUrl;
    requestAnimationFrame(() => els.reelBack.classList.add("show"));
  }
  if (els.reelFront) {
    els.reelFront.style.display = frontUrl ? "" : "none";
    if (frontUrl) els.reelFront.src = frontUrl;
    if (anim) els.reelFront.classList.remove("show");
    requestAnimationFrame(() => els.reelFront.classList.add("show"));
  }

  const labelText = (note.label || "").trim();
  const metaText = `${it.date.toLocaleDateString()} • ${reelState.idx + 1}/${favs.length}`;

  if (els.reelLabel) {
    els.reelLabel.textContent = labelText || "";
    els.reelLabel.classList.toggle("show", !!reelState.showLabels && !!labelText);
  }
  if (els.reelMeta) {
    els.reelMeta.textContent = metaText;
    els.reelMeta.style.display = reelState.showLabels ? "" : "none";
  }

  reelPreload(favs, reelState.idx);
}

/* ===========================
   Museum Wall (Favorites)
   =========================== */
let wallSeed = 0;

function renderMuseumWall(favs) {
  if (!els.museumWall || !els.museumWallWrap) return;

  const reduceMotion = !!els.wallReduceMotion?.checked;
  els.museumWallWrap.classList.toggle("wallReduceMotion", reduceMotion);

  // Ensure wrapper is visible in wall mode
  els.museumWallWrap.style.display = "block";

  // Build a "grid wall"
  els.museumWall.innerHTML = "";
  els.museumWall.classList.add("museumWall");

  const grid = document.createElement("div");
  grid.className = "museumWallGrid";
  els.museumWall.appendChild(grid);

  // Curate: newest + oldest + a few random "heroes"
  const list = favs.slice().sort((a,b) => a.date - b.date);
  const rng = mulberry32(++wallSeed);

  const pick = (arr, n) => {
    const a = arr.slice();
    a.sort(() => rng() - 0.5);
    return a.slice(0, Math.min(n, a.length));
  };

  const heroes = [];
  if (list.length) heroes.push(list[0]);
  if (list.length > 1) heroes.push(list[list.length - 1]);
  heroes.push(...pick(list.filter(p => !heroes.includes(p)), Math.min(2, Math.floor(list.length / 12) + 1)));

  const rest = list.filter(p => !heroes.includes(p));
  rest.sort(() => rng() - 0.5);

  const ordered = [...heroes, ...rest];

  // Size assignment: big statement pieces + varied supporting pieces
  const sizeForIndex = (i) => {
    if (i === 0) return "hero";
    if (i === 1) return "large";
    const r = rng();
    if (r < 0.08) return "hero";
    if (r < 0.24) return "large";
    if (r < 0.60) return "medium";
    if (r < 0.88) return "small";
    return "mini";
  };

  // Frame style (black/brown wood)
  const frameStyle = () => {
    // 0 = black lacquer, 1 = walnut, 2 = dark oak, 3 = espresso
    const r = rng();
    if (r < 0.40) return { name: "black", fill: "linear-gradient(180deg, #2b2b2b, #0f0f0f)" };
    if (r < 0.70) return { name: "walnut", fill: "linear-gradient(180deg, #6a4a2f, #2a1b12)" };
    if (r < 0.88) return { name: "oak", fill: "linear-gradient(180deg, #4a3a2a, #1b120b)" };
    return { name: "espresso", fill: "linear-gradient(180deg, #3b2a22, #140d0a)" };
  };

  const frag = document.createDocumentFragment();

  for (let i = 0; i < ordered.length; i++) {
    const it = ordered[i];
    const note = getNote(postKey(it));

    const size = sizeForIndex(i);

    const wrap = document.createElement("div");
    wrap.className = `wallSlot wallSize-${size}`;

    // frame
    const f = document.createElement("div");
    f.className = "wallFrame";

    // slight rotation for realism (unless reduce motion)
    const rot = reduceMotion ? 0 : (rng() * 3.2 - 1.6);
    f.style.setProperty("--rot", `${rot.toFixed(2)}deg`);

    const frame = frameStyle();
    f.style.setProperty("--frameFill", frame.fill);

    // window
    const w = document.createElement("div");
    w.className = "wallWindow";

    const back = document.createElement("img");
    back.className = "back";
    back.loading = "lazy";
    back.src = it.backUrl || it.frontUrl || "";
    w.appendChild(back);

    if ((size === "hero" || size === "huge") && it.frontUrl) {
      const front = document.createElement("img");
      front.className = "front";
      front.loading = "lazy";
      front.src = it.frontUrl;
      w.appendChild(front);
    }

    f.appendChild(w);
    wrap.appendChild(f);

    // placard below (classy)
    const plac = document.createElement("div");
    plac.className = "wallPlacard";
    const cap = document.createElement("div");
    cap.className = "cap";
    cap.textContent = (note.label && note.label.trim()) ? note.label.trim() : "Untitled";
    const date = document.createElement("div");
    date.className = "date";
    date.textContent = it.date.toLocaleDateString();
    plac.append(cap, date);
    wrap.appendChild(plac);

    // click opens story
    wrap.addEventListener("click", () => {
      const idx = favs.findIndex(x => postKey(x) === postKey(it));
      openStory(favs, Math.max(0, idx));
    });

    frag.appendChild(wrap);
  }

  grid.appendChild(frag);
}


function mulberry32(a) {
  return function() {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ===========================
   Book Preview (Favorites)
   =========================== */
let bookState = {
  chapterKey: null, // "YYYY-MM"
  pageIndex: 0,
  pages: [],
  chapters: [],
};

function monthKey(d) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${yyyy}-${mm}`;
}
function monthLabel(key) {
  const [y, m] = key.split("-").map(x => parseInt(x,10));
  const dt = new Date(y, m - 1, 1);
  return dt.toLocaleString(undefined, { month: "long", year: "numeric" });
}

function renderBookPreview(favs) {
  if (!els.bookSidebar || !els.bookPageHost) return;

  // build chapters from filtered favorites
  const groups = new Map();
  const ordered = favs.slice().sort((a,b) => a.date - b.date);
  for (const p of ordered) {
    const k = monthKey(p.date);
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k).push(p);
  }

  bookState.chapters = [...groups.entries()].map(([k, items]) => ({ key: k, items }));
  if (!bookState.chapters.length) {
    els.bookSidebar.innerHTML = `<div class="muted">No favorites match the current filters.</div>`;
    els.bookPageHost.innerHTML = "";
    return;
  }

  if (!bookState.chapterKey || !groups.has(bookState.chapterKey)) {
    bookState.chapterKey = bookState.chapters[0].key;
    bookState.pageIndex = 0;
  }

  // render sidebar
  els.bookSidebar.innerHTML = "";
  for (const ch of bookState.chapters) {
    const b = document.createElement("div");
    b.className = "chapterBtn" + (ch.key === bookState.chapterKey ? " active" : "");
    b.textContent = `${monthLabel(ch.key)} (${ch.items.length})`;
    b.addEventListener("click", () => {
      bookState.chapterKey = ch.key;
      bookState.pageIndex = 0;
      renderBookPreview(favs);
    });
    els.bookSidebar.appendChild(b);
  }

  // build pages lazily for current chapter only
  const items = groups.get(bookState.chapterKey) || [];
  bookState.pages = paginateChapter(items);

  bookState.pageIndex = clamp(bookState.pageIndex, 0, Math.max(0, bookState.pages.length - 1));
  renderBookPage();
}

function paginateChapter(items) {
  // 1–4 per page (simple, consistent): 4 per page, last page remainder
  const pages = [];
  for (let i = 0; i < items.length; i += 4) pages.push(items.slice(i, i + 4));
  return pages;
}

function renderBookPage() {
  if (!els.bookPageHost) return;

  const ch = bookState.chapters.find(x => x.key === bookState.chapterKey);
  if (!ch) { els.bookPageHost.innerHTML = ""; return; }

  const pages = bookState.pages;
  const idx = bookState.pageIndex;

  if (els.bookPageInfo) {
    els.bookPageInfo.textContent = `${monthLabel(ch.key)} • Page ${idx + 1}/${Math.max(1, pages.length)}`;
  }

  const pageItems = pages[idx] || [];
  els.bookPageHost.innerHTML = "";

  const page = document.createElement("div");
  page.className = "bookPage";

  const title = document.createElement("div");
  title.style.fontWeight = "700";
  title.style.margin = "0 0 12px";
  title.textContent = monthLabel(ch.key);
  page.appendChild(title);

  const grid = document.createElement("div");
  grid.className = "bookGrid";

  for (const it of pageItems) {
    const note = getNote(postKey(it));
    const card = document.createElement("div");
    card.className = "bookPhoto";

    const frame = document.createElement("div");
    frame.className = "frame";

    const back = document.createElement("img");
    back.className = "back";
    back.loading = "lazy";
    back.src = it.backUrl || it.frontUrl || "";
    frame.appendChild(back);

    if (it.frontUrl) {
      const front = document.createElement("img");
      front.className = "front";
      front.loading = "lazy";
      front.src = it.frontUrl;
      frame.appendChild(front);
    }

    const cap = document.createElement("div");
    cap.className = "bookCaption";
    cap.innerHTML = `<div style="font-weight:650">${escapeHtml(note.label || "(no caption)")}</div>
                     <div class="muted">${escapeHtml(it.date.toLocaleDateString())}</div>`;

    card.append(frame, cap);
    grid.appendChild(card);
  }

  page.appendChild(grid);
  els.bookPageHost.appendChild(page);

  enable(els.bookPrev, idx > 0);
  enable(els.bookNext, idx < pages.length - 1);
}

/* ===========================
   Eras (Favorites)
   =========================== */
const ERA_KEY = "bereal_eras";

function loadEras() {
  try {
    const arr = JSON.parse(localStorage.getItem(ERA_KEY) || "[]");
    return Array.isArray(arr) ? arr : [];
  } catch { return []; }
}
function saveEras(eras) { localStorage.setItem(ERA_KEY, JSON.stringify(eras)); }

function isoFromDateInput(v) {
  if (!v) return null;
  // input type=date gives yyyy-mm-dd
  return new Date(v + "T00:00:00").toISOString();
}
function inEra(p, era) {
  const t = +p.date;
  const a = +new Date(era.startISO);
  const b = +new Date(era.endISO);
  return t >= a && t <= b;
}
function erasForPost(p, eras) {
  const hits = [];
  for (const e of eras) if (inEra(p, e)) hits.push(e.id);
  return hits;
}
function overlaps(a, b) {
  const a1 = +new Date(a.startISO), a2 = +new Date(a.endISO);
  const b1 = +new Date(b.startISO), b2 = +new Date(b.endISO);
  return (a1 <= b2) && (b1 <= a2);
}

function renderEraView(filteredFavs) {
  if (!els.eraList || !els.eraGallery) return;

  const eras = loadEras();
  const filterAffects = !!els.eraFilterAffects?.checked;
  const baseFavs = filterAffects ? filteredFavs : getFavoritePosts();

  // warnings: overlaps
  if (els.eraWarnings) {
    const warnPairs = [];
    for (let i = 0; i < eras.length; i++) {
      for (let j = i + 1; j < eras.length; j++) {
        if (overlaps(eras[i], eras[j])) warnPairs.push(`${eras[i].name} ↔ ${eras[j].name}`);
      }
    }
    els.eraWarnings.textContent = warnPairs.length ? `Overlaps detected: ${warnPairs.join(", ")}` : "";
  }

  // manager list
  els.eraList.innerHTML = "";
  for (const era of eras) {
    const row = document.createElement("div");
    row.className = "eraListItem";

    const left = document.createElement("div");
    left.style.display = "flex";
    left.style.flexDirection = "column";
    left.style.gap = "4px";
    left.style.minWidth = "220px";

    const name = document.createElement("input");
    name.className = "btn";
    name.style.padding = "8px 10px";
    name.value = era.name;

    const dates = document.createElement("div");
    dates.className = "row";
    const start = document.createElement("input");
    start.type = "date";
    start.className = "btn";
    start.value = era.startISO.slice(0,10);
    const end = document.createElement("input");
    end.type = "date";
    end.className = "btn";
    end.value = era.endISO.slice(0,10);
    dates.append(start, end);

    left.append(name, dates);

    const right = document.createElement("div");
    right.className = "row";

    const saveBtn = document.createElement("button");
    saveBtn.className = "btn";
    saveBtn.textContent = "Save";
    saveBtn.addEventListener("click", () => {
      const n = name.value.trim() || "Untitled Era";
      const sIso = isoFromDateInput(start.value);
      const eIso = isoFromDateInput(end.value);
      if (!sIso || !eIso || +new Date(sIso) >= +new Date(eIso)) {
        setStatus("Era dates invalid (start must be before end).");
        return;
      }
      const next = loadEras().map(x => x.id === era.id ? ({ ...x, name: n, startISO: sIso, endISO: eIso }) : x);
      saveEras(next);
      refreshFavoritesUI();
    });

    const del = document.createElement("button");
    del.className = "btn";
    del.textContent = "Delete";
    del.addEventListener("click", () => {
      const next = loadEras().filter(x => x.id !== era.id);
      saveEras(next);
      refreshFavoritesUI();
    });

    right.append(saveBtn, del);

    row.append(left, right);
    els.eraList.appendChild(row);
  }

  // gallery cards
  els.eraGallery.innerHTML = "";
  if (els.eraBrowse) els.eraBrowse.style.display = "none";
  if (els.eraGallery) els.eraGallery.style.display = "";

  if (!eras.length) {
    els.eraGallery.innerHTML = `<div class="muted">No eras yet. Add one on the left.</div>`;
    return;
  }

  for (const era of eras) {
    const card = document.createElement("div");
    card.className = "eraCard";
    card.style.cursor = "pointer";

    const hits = baseFavs.filter(p => inEra(p, era));
    const h = document.createElement("h3");
    h.textContent = era.name;
    const m = document.createElement("div");
    m.className = "muted";
    m.textContent = `${era.startISO.slice(0,10)} → ${era.endISO.slice(0,10)} • ${hits.length} favorites`;

    card.append(h, m);

    card.addEventListener("click", () => {
      // browse
      if (!els.eraBrowse || !els.eraBrowseGrid) return;
      els.eraGallery.style.display = "none";
      els.eraBrowse.style.display = "";
      if (els.eraBrowseTitle) els.eraBrowseTitle.textContent = `${era.name} • ${hits.length} favorites`;

      // indicate multi-era membership by tiny dot in caption (simple)
      els.eraBrowseGrid.innerHTML = "";
      const frag = document.createDocumentFragment();
      const allEras = loadEras();
      for (const p of hits) {
        const t = makeFavoriteTile(p, hits);
        const multi = erasForPost(p, allEras).length > 1;
        if (multi) {
          const dot = document.createElement("div");
          dot.textContent = "• in multiple eras";
          dot.className = "muted";
          dot.style.fontSize = "12px";
          dot.style.padding = "0 10px 10px";
          t.appendChild(dot);
        }
        frag.appendChild(t);
      }
      els.eraBrowseGrid.appendChild(frag);
    });

    els.eraGallery.appendChild(card);
  }
}

/* ---------- Story modal (unchanged behavior) ---------- */
function openStory(favs, startIndex) {
  storyIndex = clamp(startIndex, 0, Math.max(0, favs.length - 1));
  if (els.storyModal) {
    els.storyModal.classList.add("open");
    els.storyModal._favs = favs;
  }
  renderStory(favs);
}
function closeStory() {
  if (els.storyModal) {
    els.storyModal.classList.remove("open");
    els.storyModal._favs = null;
  }
}
function renderStory(favs) {
  if (!favs || !favs.length) return;
  const it = favs[storyIndex];
  const note = getNote(postKey(it));

  if (els.storyBack) els.storyBack.src = it.backUrl || it.frontUrl || "";
  if (els.storyFront) {
    els.storyFront.src = it.frontUrl || "";
    els.storyFront.style.display = it.frontUrl ? "" : "none";
  }
  if (els.storyLabel) els.storyLabel.textContent = note.label || "Favorite";
  if (els.storyMeta) els.storyMeta.textContent = `${it.date.toLocaleDateString()} • ${storyIndex + 1}/${favs.length}`;
}
function storyPrev(favs) { storyIndex = (storyIndex - 1 + favs.length) % favs.length; renderStory(favs); }
function storyNext(favs) { storyIndex = (storyIndex + 1) % favs.length; renderStory(favs); }

/* ===========================
   Mosaic + Timeline (your original)
   =========================== */

// --- ZIP import / timeline / mosaic code is preserved with only null-guards added ---
let mosaicState = { tiles: [], zoom: 1, panX: 0, panY: 0, cols: 0, rows: 0 };

function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

function cleanupObjectUrls() {
  for (const u of mediaObjectUrls) URL.revokeObjectURL(u);
  mediaObjectUrls = [];
}

function loadImage(url) {
  return new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = rej;
    img.src = url;
  });
}

async function loadThumbnails(urls, w, h) {
  const out = [];
  for (const u of urls) {
    const img = await loadImage(u);
    const c = document.createElement("canvas");
    c.width = w; c.height = h;
    c.getContext("2d").drawImage(img, 0, 0, w, h);
    out.push(c);
  }
  return out;
}

function resizeCanvasToDisplaySize(canvas) {
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  const w = Math.floor(rect.width * dpr);
  const h = Math.floor(rect.height * dpr);
  if (canvas.width !== w || canvas.height !== h) canvas.width = w, canvas.height = h;
  return { w, h, dpr };
}

function drawMosaic() {
  const canvas = els.mosaic;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const { w, h } = resizeCanvasToDisplaySize(canvas);

  ctx.setTransform(1,0,0,1,0,0);
  ctx.clearRect(0,0,w,h);
  ctx.fillStyle = "#111";
  ctx.fillRect(0,0,w,h);

  const tiles = mosaicState.tiles;
  if (!tiles.length) return;

  const dpr = window.devicePixelRatio || 1;
  const tileSize = 64 * mosaicState.zoom * dpr;

  const cols = Math.max(1, Math.floor(w / tileSize));
  const rows = Math.ceil(tiles.length / cols);
  mosaicState.cols = cols;
  mosaicState.rows = rows;

  const ox = mosaicState.panX;
  const oy = mosaicState.panY;

  const startCol = Math.max(0, Math.floor((-ox) / tileSize) - 1);
  const endCol   = Math.min(cols, Math.ceil((w - ox) / tileSize) + 1);
  const startRow = Math.max(0, Math.floor((-oy) / tileSize) - 1);
  const endRow   = Math.min(rows, Math.ceil((h - oy) / tileSize) + 1);

  for (let r = startRow; r < endRow; r++) {
    for (let c = startCol; c < endCol; c++) {
      const i = r * cols + c;
      if (i >= tiles.length) break;
      const x = ox + c * tileSize;
      const y = oy + r * tileSize;
      ctx.drawImage(tiles[i], x, y, tileSize, tileSize);
    }
  }
}

function populateDayPickForTimeline() {
  populateDayPick(els.tlDayPick);
  const now = new Date();
  if (els.tlMonthPick) els.tlMonthPick.value = String(now.getMonth() + 1);
  if (els.tlDayPick) els.tlDayPick.value = String(now.getDate());
}

function filterPostsOnThisDay(list) {
  const m = parseInt(els.tlMonthPick?.value || "1", 10);
  const d = parseInt(els.tlDayPick?.value || "1", 10);
  return list.filter(p => (p.date.getMonth()+1) === m && p.date.getDate() === d);
}

function setTimelineMode(mode) {
  tlMode = mode;
  const buttons = [
    ["grid", els.tlModeGrid],
    ["strip", els.tlModeStrip],
    ["onthisday", els.tlModeOnThisDay],
  ];
  for (const [m, btn] of buttons) {
    if (!btn) continue;
    btn.style.background = (m === tlMode) ? "#111" : "#fff";
    btn.style.color = (m === tlMode) ? "#fff" : "#111";
    btn.style.borderColor = (m === tlMode) ? "#111" : "#ddd";
  }
  if (els.tlOnThisDayControls) els.tlOnThisDayControls.style.display = (mode === "onthisday") ? "flex" : "none";
  if (els.timelineGrid) els.timelineGrid.style.display = (mode === "grid" || mode === "onthisday") ? "grid" : "none";
  if (els.timelineStrip) els.timelineStrip.style.display = (mode === "strip") ? "flex" : "none";
  renderTimeline(posts);
}

function makeTimelineTile(it) {
  const key = postKey(it);
  const note = getNote(key);

  const tile = document.createElement("div");
  tile.className = "tile";

  const frame = document.createElement("div");
  frame.className = "frame";

  if (it.backUrl) {
    const back = document.createElement("img");
    back.className = "back";
    back.loading = "lazy";
    back.src = it.backUrl;
    frame.appendChild(back);
  }
  if (it.frontUrl) {
    const front = document.createElement("img");
    front.className = "front";
    front.loading = "lazy";
    front.src = it.frontUrl;
    frame.appendChild(front);
  }

  const star = document.createElement("button");
  star.className = "btn";
  star.style.position = "absolute";
  star.style.left = "10px";
  star.style.top = "10px";
  star.style.padding = "6px 10px";
  star.style.borderRadius = "999px";
  star.style.background = note.favorite ? "#111" : "rgba(255,255,255,.9)";
  star.style.color = note.favorite ? "#fff" : "#111";
  star.style.borderColor = note.favorite ? "#111" : "rgba(0,0,0,.15)";
  star.textContent = note.favorite ? "★ Favorited" : "☆ Favorite";
  star.addEventListener("click", (ev) => {
    ev.stopPropagation();
    setNote(key, { favorite: !getNote(key).favorite });
    renderTimeline(posts);
    populateLabelFilter();
    refreshFavoritesUI();
  });
  frame.appendChild(star);

  const meta = document.createElement("div");
  meta.className = "meta";
  meta.style.flexDirection = "column";
  meta.style.gap = "8px";

  const topRow = document.createElement("div");
  topRow.style.display = "flex";
  topRow.style.justifyContent = "space-between";
  topRow.style.gap = "8px";

  const left = document.createElement("span");
  left.textContent = it.date.toLocaleDateString();
  const right = document.createElement("span");
  right.textContent = it.retakeCounter ? `retakes: ${it.retakeCounter}` : "";
  topRow.append(left, right);

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = 'Add a label… (e.g., "Vacation in Florida!")';
  input.value = note.label || "";
  input.style.width = "100%";
  input.style.padding = "8px 10px";
  input.style.borderRadius = "10px";
  input.style.border = "1px solid #ddd";
  input.style.fontSize = "13px";
  input.addEventListener("click", (ev) => ev.stopPropagation());
  input.addEventListener("input", () => {
    setNote(key, { label: input.value });
    populateLabelFilter();
    refreshFavoritesUI();
  });

  meta.append(topRow, input);
  tile.append(frame, meta);

  tile.addEventListener("click", () => {
    const u = it.backUrl || it.frontUrl;
    if (u) window.open(u, "_blank", "noopener,noreferrer");
  });

  return tile;
}

function renderTimeline(items) {
  if (!items || !els.timelineGrid || !els.timelineStrip) return;
  let list = items.slice();
  if (tlMode === "onthisday") list = filterPostsOnThisDay(list);

  if (els.count) els.count.textContent = `${list.length} posts`;
  els.timelineGrid.innerHTML = "";
  els.timelineStrip.innerHTML = "";

  const frag = document.createDocumentFragment();
  for (const it of list) {
    const tile = makeTimelineTile(it);
    if (tlMode === "strip") tile.classList.add("stripCard");
    frag.appendChild(tile);
  }

  if (tlMode === "strip") els.timelineStrip.appendChild(frag);
  else els.timelineGrid.appendChild(frag);
}

/* ===========================
   Export favorites JPEG ZIP (kept)
   =========================== */
function pad(n) { return String(n).padStart(2, "0"); }
function safeName(s) {
  return (s || "").replace(/[^\w\- ]+/g, "").trim().replace(/\s+/g, "_").slice(0, 60);
}
async function loadImageForCanvas(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}
function drawCover(ctx, img, x, y, w, h) {
  const ir = img.width / img.height;
  const r = w / h;
  let sx = 0, sy = 0, sw = img.width, sh = img.height;
  if (ir > r) { sh = img.height; sw = sh * r; sx = (img.width - sw) / 2; }
  else { sw = img.width; sh = sw / r; sy = (img.height - sh) / 2; }
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}
async function renderFavoriteToJpegBlob(post, note, opts = {}) {
  const W = opts.width ?? 1080;
  const H = opts.height ?? 1440;

  const canvas = document.createElement("canvas");
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#000"; ctx.fillRect(0, 0, W, H);

  const backUrl = post.backUrl || post.frontUrl;
  if (!backUrl) throw new Error("Missing image URL");

  const backImg = await loadImageForCanvas(backUrl);
  drawCover(ctx, backImg, 0, 0, W, H);

  if (post.frontUrl) {
    const frontImg = await loadImageForCanvas(post.frontUrl);
    const fw = Math.round(W * 0.28);
    const fh = Math.round(fw * 4 / 3);
    const margin = Math.round(W * 0.03);
    const x = W - fw - margin;
    const y = H - fh - margin;

    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.35)";
    ctx.shadowBlur = Math.round(W * 0.02);
    ctx.shadowOffsetY = Math.round(W * 0.01);

    const r = Math.round(W * 0.02);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + fw, y, x + fw, y + fh, r);
    ctx.arcTo(x + fw, y + fh, x, y + fh, r);
    ctx.arcTo(x, y + fh, x, y, r);
    ctx.arcTo(x, y, x + fw, y, r);
    ctx.closePath();
    ctx.clip();
    drawCover(ctx, frontImg, x, y, fw, fh);
    ctx.restore();

    ctx.strokeStyle = "rgba(255,255,255,0.95)";
    ctx.lineWidth = Math.max(2, Math.round(W * 0.004));
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + fw, y, x + fw, y + fh, r);
    ctx.arcTo(x + fw, y + fh, x, y + fh, r);
    ctx.arcTo(x, y + fh, x, y, r);
    ctx.arcTo(x, y, x + fw, y, r);
    ctx.closePath();
    ctx.stroke();
  }

  const dateStr = post.date.toLocaleDateString();
  const label = (note?.label || "").trim();
  const caption = label ? `${dateStr} — ${label}` : dateStr;

  const gh = Math.round(H * 0.16);
  const g = ctx.createLinearGradient(0, H - gh, 0, H);
  g.addColorStop(0, "rgba(0,0,0,0)");
  g.addColorStop(1, "rgba(0,0,0,0.65)");
  ctx.fillStyle = g;
  ctx.fillRect(0, H - gh, W, gh);

  ctx.fillStyle = "rgba(255,255,255,0.95)";
  ctx.font = `600 ${Math.round(W * 0.035)}px system-ui, -apple-system, Segoe UI, Roboto, sans-serif`;
  ctx.textBaseline = "bottom";
  ctx.fillText(caption, Math.round(W * 0.03), H - Math.round(H * 0.03));

  const quality = opts.quality ?? 0.92;
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
  return blob;
}

/* ===========================
   Wire up events (NULL-SAFE)
   =========================== */
els.tabs.forEach(tab => tab?.addEventListener("click", () => setView(tab.dataset.view)));

els.monthPick?.addEventListener("change", () => refreshFavoritesUI());
els.dayPick?.addEventListener("change", () => refreshFavoritesUI());
els.labelFilter?.addEventListener("change", () => refreshFavoritesUI());
els.labelSearch?.addEventListener("input", () => refreshFavoritesUI());

els.sortAsc?.addEventListener("click", () => { posts.sort((a,b)=>a.date-b.date); renderTimeline(posts); });
els.sortDesc?.addEventListener("click", () => { posts.sort((a,b)=>b.date-a.date); renderTimeline(posts); });

els.tlModeGrid?.addEventListener("click", () => setTimelineMode("grid"));
els.tlModeStrip?.addEventListener("click", () => setTimelineMode("strip"));
els.tlModeOnThisDay?.addEventListener("click", () => setTimelineMode("onthisday"));
els.tlMonthPick?.addEventListener("change", () => renderTimeline(posts));
els.tlDayPick?.addEventListener("change", () => renderTimeline(posts));

els.favModeGrid?.addEventListener("click", () => setFavMode("grid"));
els.favModeStrip?.addEventListener("click", () => setFavMode("strip"));
els.favModeStory?.addEventListener("click", () => setFavMode("story"));
els.favModeRoulette?.addEventListener("click", () => setFavMode("roulette"));
els.favModeOnThisDay?.addEventListener("click", () => setFavMode("onthisday"));
els.favModeReel?.addEventListener("click", () => setFavMode("reel"));
els.favModeWall?.addEventListener("click", () => setFavMode("wall"));
els.favModeBook?.addEventListener("click", () => setFavMode("book"));
els.favModeEras?.addEventListener("click", () => setFavMode("eras"));

els.wallRegenerate?.addEventListener("click", () => { wallSeed++; refreshFavoritesUI(); });
els.wallReduceMotion?.addEventListener("change", () => refreshFavoritesUI());

els.bookPrev?.addEventListener("click", () => { bookState.pageIndex--; renderBookPage(); });
els.bookNext?.addEventListener("click", () => { bookState.pageIndex++; renderBookPage(); });
els.bookPrint?.addEventListener("click", () => window.print());

els.eraFilterAffects?.addEventListener("change", () => refreshFavoritesUI());
els.eraBack?.addEventListener("click", () => {
  if (els.eraBrowse) els.eraBrowse.style.display = "none";
  if (els.eraGallery) els.eraGallery.style.display = "";
});

els.eraAdd?.addEventListener("click", () => {
  const name = (els.eraName?.value || "").trim() || "Untitled Era";
  const sIso = isoFromDateInput(els.eraStart?.value);
  const eIso = isoFromDateInput(els.eraEnd?.value);
  if (!sIso || !eIso || +new Date(sIso) >= +new Date(eIso)) {
    setStatus("Era dates invalid (start must be before end).");
    return;
  }
  const eras = loadEras();
  eras.push({
    id: crypto?.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()),
    name,
    startISO: sIso,
    endISO: eIso,
    createdAt: new Date().toISOString()
  });
  saveEras(eras);
  if (els.eraName) els.eraName.value = "";
  refreshFavoritesUI();
});

els.reelClose?.addEventListener("click", () => closeHighlightReel());
els.reelPrev?.addEventListener("click", () => {
  const favs = getFilteredFavoritesForCurrentMode();
  if (!favs.length) return;
  reelState.idx = (reelState.idx - 1 + favs.length) % favs.length;
  reelRender(favs, true);
  reelSchedule(favs);
});
els.reelNext?.addEventListener("click", () => {
  const favs = getFilteredFavoritesForCurrentMode();
  if (!favs.length) return;
  reelState.idx = (reelState.idx + 1) % favs.length;
  reelRender(favs, true);
  reelSchedule(favs);
});
els.reelPlay?.addEventListener("click", () => {
  reelState.playing = !reelState.playing;
  if (els.reelPlay) els.reelPlay.textContent = reelState.playing ? "⏸" : "▶";
  saveReelSettings();
  const favs = getFilteredFavoritesForCurrentMode();
  reelSchedule(favs);
});
els.reelSpeed?.addEventListener("change", () => {
  reelState.ms = parseInt(els.reelSpeed.value, 10);
  saveReelSettings();
  const favs = getFilteredFavoritesForCurrentMode();
  reelSchedule(favs);
});
els.reelShowLabels?.addEventListener("change", () => {
  reelState.showLabels = !!els.reelShowLabels.checked;
  saveReelSettings();
  const favs = getFilteredFavoritesForCurrentMode();
  reelRender(favs, false);
});
els.reelMusic?.addEventListener("change", () => {
  reelState.music = !!els.reelMusic.checked;
  saveReelSettings();
  reelEnsureAudio(reelState.music);
});

window.addEventListener("keydown", (e) => {
  // Story keys
  if (els.storyModal?.classList.contains("open")) {
    const favs = els.storyModal._favs;
    if (!favs) return;
    if (e.key === "Escape") closeStory();
    if (e.key === "ArrowLeft") storyPrev(favs);
    if (e.key === "ArrowRight") storyNext(favs);
  }

  // Reel keys
  if (els.reelModal?.classList.contains("open")) {
    const favs = getFilteredFavoritesForCurrentMode();
    if (!favs.length) return;
    if (e.key === "Escape") closeHighlightReel();
    if (e.key === "ArrowLeft") { reelState.idx = (reelState.idx - 1 + favs.length) % favs.length; reelRender(favs, true); reelSchedule(favs); }
    if (e.key === "ArrowRight") { reelState.idx = (reelState.idx + 1) % favs.length; reelRender(favs, true); reelSchedule(favs); }
    if (e.key === " " || e.code === "Space") {
      e.preventDefault();
      reelState.playing = !reelState.playing;
      if (els.reelPlay) els.reelPlay.textContent = reelState.playing ? "⏸" : "▶";
      saveReelSettings();
      reelSchedule(favs);
    }
  }
});

/* ---------- Story clicks ---------- */
els.storyPrev?.addEventListener("click", () => { const favs = els.storyModal?._favs; if (favs) storyPrev(favs); });
els.storyNext?.addEventListener("click", () => { const favs = els.storyModal?._favs; if (favs) storyNext(favs); });
els.storyClose?.addEventListener("click", (e) => { e.preventDefault(); e.stopPropagation(); closeStory(); }, true);
els.storyNavLeft?.addEventListener("click", () => { const favs = els.storyModal?._favs; if (favs) storyPrev(favs); });
els.storyNavRight?.addEventListener("click", () => { const favs = els.storyModal?._favs; if (favs) storyNext(favs); });

/* ---------- Roulette spin ---------- */
els.rouletteSpin?.addEventListener("click", async () => {
  const favs = getFilteredFavoritesForCurrentMode();
  if (favs.length < 2) return;

  els.rouletteSpin.disabled = true;

  let i = 0;
  let delay = 40;
  let steps = 45 + Math.floor(Math.random() * 25);
  const tick = () => new Promise(res => setTimeout(res, delay));

  while (steps-- > 0) {
    i = (i + 1) % favs.length;
    if (els.rouletteStage) {
      els.rouletteStage.innerHTML = "";
      els.rouletteStage.appendChild(makeFavoriteTile(favs[i], favs));
    }
    if (steps < 18) delay += 25;
    await tick();
  }

  els.rouletteSpin.disabled = false;
  openStory(favs, i);
});

/* ---------- Export favorites ZIP ---------- */
els.exportFavorites?.addEventListener("click", async () => {
  try {
    const favs = getFavoritePosts();
    if (!favs.length) { setStatus("No favorites to export."); return; }
    setStatus(`Rendering ${favs.length} favorites to JPEG…`);

    const files = {};
    const ordered = favs.slice().sort((a, b) => a.date - b.date);

    for (let i = 0; i < ordered.length; i++) {
      const p = ordered[i];
      const note = getNote(postKey(p));
      const blob = await renderFavoriteToJpegBlob(p, note, { width: 1080, height: 1440, quality: 0.92 });
      const u8 = new Uint8Array(await blob.arrayBuffer());

      const yyyy = p.date.getFullYear();
      const mm = pad(p.date.getMonth() + 1);
      const dd = pad(p.date.getDate());
      const labelPart = note?.label ? `_${safeName(note.label)}` : "";
      const filename = `${yyyy}-${mm}-${dd}_${pad(i + 1)}${labelPart}.jpg`;

      files[filename] = u8;
      if ((i + 1) % 25 === 0) setStatus(`Rendered ${i + 1}/${ordered.length}…`);
    }

    setStatus("Zipping JPEGs…");
    const zipped = zipSync(files, { level: 6 });
    const zipBlob = new Blob([zipped], { type: "application/zip" });

    const a = document.createElement("a");
    a.href = URL.createObjectURL(zipBlob);
    a.download = "bereal-favorites-jpegs.zip";
    document.body.appendChild(a);
    a.click();
    a.remove();

    setStatus("Exported favorites JPEG ZIP!");
  } catch (err) {
    console.error(err);
    setStatus("Failed to export favorites. See console.");
  }
});

/* ---------- Export notes / Import notes ---------- */
els.exportNotes?.addEventListener("click", () => {
  const payload = { version: 1, exportedAt: new Date().toISOString(), notes };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "bereal-notes.json";
  document.body.appendChild(a);
  a.click();
  a.remove();

  URL.revokeObjectURL(url);
});

els.importNotes?.addEventListener("change", async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  try {
    const text = await file.text();
    const parsed = JSON.parse(text);
    const incoming = parsed?.notes && typeof parsed.notes === "object" ? parsed.notes : parsed;

    notes = { ...notes, ...incoming };
    saveNotes();

    if (posts.length) {
      setTimelineMode("grid");
      refreshFavoritesUI();
      setStatus("Notes imported and applied.");
    } else {
      setStatus("Notes imported. Now import the BeReal ZIP to apply them to posts.");
    }
  } catch (err) {
    console.error(err);
    setStatus("Failed to import notes JSON.");
  } finally {
    e.target.value = "";
  }
});

/* ---------- Mosaic controls ---------- */
els.buildMosaic?.addEventListener("click", async () => {
  if (!posts.length) return;
  setStatus("Building mosaic thumbnails…");
  const urls = posts.map(p => p.backUrl || p.frontUrl).filter(Boolean);
  const capped = urls.slice(0, 1500);
  mosaicState.tiles = await loadThumbnails(capped, 64, 64);
  mosaicState.zoom = 1; mosaicState.panX = 0; mosaicState.panY = 0;
  drawMosaic();
  setStatus(`Mosaic ready (${mosaicState.tiles.length} tiles).`);
});

els.shuffleMosaic?.addEventListener("click", () => {
  if (!mosaicState.tiles.length) return;
  mosaicState.tiles.sort(() => Math.random() - 0.5);
  drawMosaic();
});

let dragging = false, lastX = 0, lastY = 0;
els.mosaic?.addEventListener("wheel", (e) => {
  e.preventDefault();
  const delta = Math.sign(e.deltaY);
  const prev = mosaicState.zoom;
  mosaicState.zoom = clamp(mosaicState.zoom * (delta > 0 ? 0.9 : 1.1), 0.2, 6);

  const rect = els.mosaic.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  const cx = (e.clientX - rect.left) * dpr;
  const cy = (e.clientY - rect.top) * dpr;

  const z = mosaicState.zoom / prev;
  mosaicState.panX = cx - z * (cx - mosaicState.panX);
  mosaicState.panY = cy - z * (cy - mosaicState.panY);

  drawMosaic();
}, { passive: false });

els.mosaic?.addEventListener("pointerdown", (e) => {
  dragging = true;
  els.mosaic.setPointerCapture(e.pointerId);
  lastX = e.clientX; lastY = e.clientY;
});
els.mosaic?.addEventListener("pointermove", (e) => {
  if (!dragging) return;
  const dpr = window.devicePixelRatio || 1;
  mosaicState.panX += (e.clientX - lastX) * dpr;
  mosaicState.panY += (e.clientY - lastY) * dpr;
  lastX = e.clientX; lastY = e.clientY;
  drawMosaic();
});
els.mosaic?.addEventListener("pointerup", () => dragging = false);
window.addEventListener("resize", () => drawMosaic());

/* ---------- ZIP import ---------- */
els.file?.addEventListener("change", async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  cleanupObjectUrls();
  posts = [];
  if (els.timelineGrid) els.timelineGrid.innerHTML = "";
  if (els.timelineStrip) els.timelineStrip.innerHTML = "";
  if (els.count) els.count.textContent = "";

  try {
    setStatus("Reading ZIP…");
    const buf = new Uint8Array(await file.arrayBuffer());
    const z = unzipSync(buf);

    const keys = Object.keys(z);
    const postsKey = keys.find(k => k.toLowerCase().endsWith("/posts.json")) ||
                     keys.find(k => k.toLowerCase() === "posts.json");

    if (!postsKey) { setStatus("Couldn't find posts.json in the ZIP."); return; }

    const postsJson = JSON.parse(strFromU8(z[postsKey]));
    if (!Array.isArray(postsJson)) { setStatus("posts.json wasn't an array. Unexpected format."); return; }

    setStatus("Indexing media files…");
    const mediaFiles = Object.keys(z).filter(p => /\.(webp|jpe?g|png)$/i.test(p));
    const mediaUrl = new Map();

    for (const p of mediaFiles) {
      const bytes = z[p];
      const lower = p.toLowerCase();
      const mime = lower.endsWith(".png") ? "image/png" : lower.endsWith(".webp") ? "image/webp" : "image/jpeg";
      const blob = new Blob([bytes], { type: mime });
      const url = URL.createObjectURL(blob);
      mediaObjectUrls.push(url);

      const key = p.startsWith("/") ? p.slice(1) : p;
      mediaUrl.set(key, url);
    }

    const fileByName = new Map();
    for (const k of mediaUrl.keys()) {
      const name = k.split("/").pop();
      if (name) fileByName.set(name, mediaUrl.get(k));
    }

    const resolve = (path) => {
      if (!path || typeof path !== "string") return null;
      let key = path.startsWith("/") ? path.slice(1) : path;
      if (mediaUrl.has(key)) return mediaUrl.get(key);
      const filename = key.split("/").pop();
      if (filename && fileByName.has(filename)) return fileByName.get(filename);
      const lower = key.toLowerCase();
      for (const k of mediaUrl.keys()) if (k.toLowerCase().endsWith(lower)) return mediaUrl.get(k);
      return null;
    };

    setStatus("Building timeline items…");
    posts = postsJson.map(p => {
      const date = p.takenAt ? new Date(p.takenAt) : null;
      const backName = filenameFromPath(p.primary?.path);
      const frontName = filenameFromPath(p.secondary?.path);
      return {
        date,
        backUrl: resolve(p.primary?.path),
        frontUrl: resolve(p.secondary?.path),
        backName,
        frontName,
        retakeCounter: p.retakeCounter ?? 0,
        location: p.location ?? null,
      };
    }).filter(p => p.date && !isNaN(+p.date) && (p.backUrl || p.frontUrl));

    if (!posts.length) { setStatus("Imported posts.json, but couldn't match image paths inside ZIP."); return; }

    posts.sort((a,b) => a.date - b.date);

    enable(els.sortAsc, true);
    enable(els.sortDesc, true);
    enable(els.buildMosaic, true);
    enable(els.shuffleMosaic, true);
    enable(els.exportNotes, true);
    enable(els.exportFavorites, true);

    enable(els.favModeGrid, true);
    enable(els.favModeStrip, true);
    enable(els.favModeStory, true);
    enable(els.favModeRoulette, true);
    enable(els.favModeOnThisDay, true);
    enable(els.favModeReel, true);
    enable(els.favModeWall, true);
    enable(els.favModeBook, true);
    enable(els.favModeEras, true);

    enable(els.labelFilter, true);
    enable(els.labelSearch, true);
    enable(els.rouletteSpin, true);

    enable(els.tlModeGrid, true);
    enable(els.tlModeStrip, true);
    enable(els.tlModeOnThisDay, true);

    populateDayPick(els.dayPick);
    const now = new Date();
    if (els.monthPick) els.monthPick.value = String(now.getMonth() + 1);
    if (els.dayPick) els.dayPick.value = String(now.getDate());
    populateDayPickForTimeline();

    populateLabelFilter();
    renderTimeline(posts);
    setStatus("Loaded! Click Mosaic to build the zoomable mosaic.");
  } catch (err) {
    console.error(err);
    setStatus("Error importing ZIP. See console for details.");
  }
});

/* ---------- Bootstrap ---------- */
populateLabelFilter();
populateDayPick(els.dayPick);
populateDayPickForTimeline();
