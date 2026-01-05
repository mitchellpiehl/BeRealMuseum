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
    stats: document.getElementById("view-stats"),
    worldtour: document.getElementById("viewWorldTour"),
    realmojiwall: document.getElementById("viewRealmojiWall"),
    manager: document.getElementById("viewManager"),
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
  reelAudioFile: document.getElementById("reelAudioFile"),
  reelRecord: document.getElementById("reelRecord"),

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
  tlModeManager: document.getElementById("tlModeManager"),

  // Manager Modal
  favManagerModal: document.getElementById("favManagerModal"),
  mgrClose: document.getElementById("mgrClose"),
  mgrDaysGrid: document.getElementById("mgrDaysGrid"),
  mgrMonthsGrid: document.getElementById("mgrMonthsGrid"),
  mgrDayAll: document.getElementById("mgrDayAll"),
  mgrMonthAll: document.getElementById("mgrMonthAll"),
  mgrTimeStart: document.getElementById("mgrTimeStart"),
  mgrTimeEnd: document.getElementById("mgrTimeEnd"),
  mgrTimeInvert: document.getElementById("mgrTimeInvert"),
  mgrPresetWork: document.getElementById("mgrPresetWork"),
  mgrStats: document.getElementById("mgrStats"),
  mgrShowPreview: document.getElementById("mgrShowPreview"),
  mgrPreviewContainer: document.getElementById("mgrPreviewContainer"),
  mgrPreviewGrid: document.getElementById("mgrPreviewGrid"),
  mgrPreviewCount: document.getElementById("mgrPreviewCount"),
  mgrSelectAllPreview: document.getElementById("mgrSelectAllPreview"),
  mgrActionFav: document.getElementById("mgrActionFav"),
  mgrActionUnfav: document.getElementById("mgrActionUnfav"),
  tlOnThisDayControls: document.getElementById("tlOnThisDayControls"),
  tlMonthPick: document.getElementById("tlMonthPick"),
  tlDayPick: document.getElementById("tlDayPick"),
  timelineGrid: document.getElementById("timelineGrid"),
  timelineStrip: document.getElementById("timelineStrip"),

  btnStats: document.getElementById("btnStats"),
  btnWorldTour: document.getElementById("btnWorldTour"),
  btnManager: document.getElementById("btnManager"),
};

let posts = [];
let friends = [];
let comments = [];
let memories = [];
let realmojiCount = 0;
let realmojiUrls = []; // [{url, path}]
let realmojiFavorites = new Set(JSON.parse(localStorage.getItem("realmojiFavorites") || "[]"));
let mediaObjectUrls = [];
let notes = loadNotes();

let favMode = "grid"; // plus: reel | wall | book | eras
let storyIndex = 0;
let tlMode = "grid";
let mosaicState = {
  tiles: [],         // array of { avgColor: [r,g,b], img: ImageBitmap|Canvas }
  targetImg: null,   // HTMLImageElement of the big picture
  targetData: [],    // array of average colors for the target grid (rows*cols)
  gridW: 50,         // how many cells wide the mosaic is
  gridH: 50,         // derived from aspect ratio
  zoom: 1,
  panX: 0,
  panY: 0,
  cols: 0,
  rows: 0,
  mapping: [],       // which tile index goes to which grid cell
};

let map = null;
let markers = [];

// Mosaic Target Input
const mosaicTargetInput = document.getElementById("mosaicTarget");
if (mosaicTargetInput) {
  mosaicTargetInput.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const bmp = await createImageBitmap(file);
      // Convert to standard img for drawing
      const img = document.createElement("img");
      const url = URL.createObjectURL(file);
      img.src = url;
      await new Promise(r => img.onload = r);
      mosaicState.targetImg = img;

      // We will re-generate the grid metrics when "Build Mosaic" happens
      setStatus(`Target image loaded: ${file.name}`);
      // Auto-enable build if posts exist
      if (posts.length > 0) enable(els.buildMosaic, true);
    } catch (err) {
      console.error(err);
      setStatus("Failed to load target image.");
    }
  });
}



function setStatus(msg) {
  if (els.status) els.status.textContent = msg;
  const entStatus = document.getElementById("entranceStatus");
  if (entStatus) entStatus.textContent = msg.toUpperCase();
}
function enable(el, ok) { if (el) el.disabled = !ok; }

function setView(name) {
  const update = () => {
    for (const [k, v] of Object.entries(els.views)) if (v) v.style.display = (k === name) ? "" : "none";
    els.tabs.forEach(t => t.classList.toggle("active", t.dataset.view === name));

    if (name === "favorites") {
      setFavMode(favMode || "grid");
      refreshFavoritesUI();
    }
    if (name === "stats") renderStats();
    if (name === "worldtour") initMap();
    if (name === "realmojiwall") renderRealmojiWall();
  };

  if (document.startViewTransition) {
    document.startViewTransition(update);
  } else {
    update();
  }
}
window.setView = setView;

function stripExt(name) { return (name || "").replace(/\.(webp|png|jpe?g)$/i, ""); }
function filenameFromPath(p) {
  if (!p || typeof p !== "string") return "";
  const s = p.startsWith("/") ? p.slice(1) : p;
  return s.split("/").pop() || "";
}
function postKey(p) {
  return `${p.date.toISOString()}|${stripExt(p.backName || "")}|${stripExt(p.frontName || "")}`;
}
window.postKey = postKey;

function loadNotes() {
  try { return JSON.parse(localStorage.getItem("bereal_notes") || "{}"); }
  catch { return {}; }
}
function saveNotes() { localStorage.setItem("bereal_notes", JSON.stringify(notes)); }
function getNote(key) { return notes[key] || { favorite: false, label: "" }; }
function setNote(key, patch) { notes[key] = { ...getNote(key), ...patch }; saveNotes(); }

function normalizeText(s) { return (s || "").toLowerCase().trim(); }
function escapeHtml(s) { return (s || "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[c])); }

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
    [...labels.values()].sort((a, b) => a.localeCompare(b))
      .map(l => `<option value="${escapeHtml(l)}">${escapeHtml(l)}</option>`)
      .join("");
  if ([...els.labelFilter.options].some(o => o.value === current)) els.labelFilter.value = current;
}

function populateDayPick(selectEl) {
  if (!selectEl) return;
  selectEl.innerHTML = "";

  const all = document.createElement("option");
  all.value = "-1";
  all.textContent = "All Days";
  selectEl.appendChild(all);

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
    btn.style.background = (m === favMode) ? "#c5a059" : "transparent";
    btn.style.color = (m === favMode) ? "#000" : "#999";
    btn.style.borderColor = (m === favMode) ? "#c5a059" : "#333";
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
  if (d === -1) {
    return list.filter(p => (p.date.getMonth() + 1) === m);
  }
  return list.filter(p => (p.date.getMonth() + 1) === m && p.date.getDate() === d);
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
  } catch { }
}
function saveReelSettings() {
  localStorage.setItem(REEL_KEY, JSON.stringify({
    ms: reelState.ms,
    showLabels: reelState.showLabels,
    music: reelState.music,
  }));
}

const DB_NAME = "BeReal_Assets";
const DB_VERSION = 1;

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains("audio")) {
        db.createObjectStore("audio", { keyPath: "id" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function saveAudioBlob(blob) {
  try {
    const db = await openDB();
    const tx = db.transaction("audio", "readwrite");
    tx.objectStore("audio").put({ id: "custom_track", blob: blob, date: new Date() });
    return new Promise((res, rej) => {
      tx.oncomplete = res;
      tx.onerror = rej;
    });
  } catch (err) {
    console.warn("Failed to save audio to DB", err);
  }
}

async function loadAudioBlob() {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("audio", "readonly");
      const req = tx.objectStore("audio").get("custom_track");
      req.onsuccess = () => resolve(req.result ? req.result.blob : null);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn("Failed to load audio from DB", err);
    return null;
  }
}

let reelCustomBuffer = null;

// Init: Check for saved audio
// Init: Check for saved audio, OR load default asset
(async () => {
  const blob = await loadAudioBlob();
  if (blob) {
    console.log("Found saved custom audio");
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const arrayBuffer = await blob.arrayBuffer();
    reelCustomBuffer = await ctx.decodeAudioData(arrayBuffer);
    setStatus("Loaded custom audio from storage.");
  } else {
    // Load default asset "AgusAlvarez..." if it exists
    const defaultUrl = "AgusAlvarez & Waesto - Hope (freetouse.com).mp3";
    console.log("No saved audio, trying default asset:", defaultUrl);
    try {
      const resp = await fetch(defaultUrl);
      if (resp.ok) {
        const buf = await resp.arrayBuffer();
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        reelCustomBuffer = await ctx.decodeAudioData(buf);
        console.log("Default asset loaded and decoded");
      } else {
        console.log("Default asset not found (404)");
      }
    } catch (err) {
      console.warn("Could not load default asset", err);
    }
  }
})();


// Handle audio file upload
if (els.reelAudioFile) {
  els.reelAudioFile.addEventListener("change", async (e) => {
    console.log("File input changed");
    const file = e.target.files[0];
    if (!file) return;

    setStatus(`Loading audio: ${file.name}...`);
    // Save for next time
    saveAudioBlob(file);

    // We need an audio context to decode
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    try {
      const arrayBuffer = await file.arrayBuffer();
      // decodeAudioData requires a callback or returns promise
      reelCustomBuffer = await ctx.decodeAudioData(arrayBuffer);
      console.log("Audio decoded successfully");
      setStatus(`Audio loaded: ${file.name}`);

      // If currently playing, restart to use new audio
      if (els.reelModal.classList.contains("open") && reelState.music) {
        console.log("Restarting audio with new file");
        reelEnsureAudio(false);
        reelEnsureAudio(true);
      }
    } catch (err) {
      console.error("Audio decode error:", err);
      setStatus("Failed to decode audio file. Try MP3/WAV.");
      alert("Error decoding audio file. See console.");
    }
  });
} else {
  console.error("DEBUG: els.reelAudioFile is missing!");
}

function reelEnsureAudio(on) {
  // Stop existing sources
  if (reelAudio.source) { try { reelAudio.source.stop(); } catch { } }
  if (reelAudio.osc) { try { reelAudio.osc.stop(); } catch { } }
  if (reelAudio.lfo) { try { reelAudio.lfo.stop(); } catch { } }
  if (reelAudio.interval) { clearInterval(reelAudio.interval); }

  // Cleanup old context if turning off
  if (!on) {
    // We don't close the context to allow reuse, just stop nodes (done above)
    reelAudio = { ctx: reelAudio.ctx, osc: null, source: null, gain: null };
    return;
  }

  // Create or reuse context
  const ctx = reelAudio.ctx || new (window.AudioContext || window.webkitAudioContext)();

  // CRITICAL: Resume if suspended (browsers block audio until gesture)
  if (ctx.state === "suspended") {
    ctx.resume().then(() => console.log("AudioContext resumed"));
  }

  const gain = ctx.createGain();
  gain.connect(ctx.destination);

  if (reelCustomBuffer) {
    // Play custom file
    const source = ctx.createBufferSource();
    source.buffer = reelCustomBuffer;
    source.loop = true;
    source.connect(gain);
    source.start();

    gain.gain.value = 0.5;
    reelAudio = { ctx, source, gain };
  } else {
    // Play better synth: A simple 4-chord sequence loop
    // Cmaj7 -> Gmaj7 -> Amin7 -> Fmaj7
    // Frequencies: C4 (261.63), G3 (196.00), A3 (220.00), F3 (174.61)

    const notes = [261.63, 196.00, 220.00, 174.61];
    let noteIdx = 0;

    const osc = ctx.createOscillator();
    osc.type = "triangle"; // CHANGED to triangle for distinct sound

    // Add LFO for warm vibrato
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 3.0; // 3Hz wobble
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 1.5; // depth
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    lfo.start();

    osc.start();
    osc.connect(gain);

    // Envelope / sequencer
    const scheduleNext = () => {
      const freq = notes[noteIdx % notes.length];
      const now = ctx.currentTime;

      // Slide to note
      osc.frequency.setValueAtTime(osc.frequency.value, now);
      osc.frequency.exponentialRampToValueAtTime(freq, now + 0.1);

      // Gentle volume swell per chord
      gain.gain.cancelScheduledValues(now);
      gain.gain.setValueAtTime(gain.gain.value, now);
      gain.gain.linearRampToValueAtTime(0.06, now + 1.0); // swell
      gain.gain.linearRampToValueAtTime(0.04, now + 2.8); // decay

      noteIdx++;
    };

    // Initial note
    scheduleNext();

    // Loop every 3 seconds (aligns with default slide speed)
    const interval = setInterval(() => {
      if (ctx.state === "running") scheduleNext();
    }, 3000);

    reelAudio = { ctx, osc, gain, lfo, interval };
  }
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
  const list = favs.slice().sort((a, b) => a.date - b.date);
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

    const label = (note.label || "").trim();
    const isUntitled = !label || label.toUpperCase() === "UNTITLED";

    if (!isUntitled) {
      const cap = document.createElement("div");
      cap.className = "cap";
      cap.textContent = label;
      plac.appendChild(cap);
    }

    const date = document.createElement("div");
    date.className = "date";
    date.textContent = it.date.toLocaleDateString();
    plac.append(date);
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
  return function () {
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
  const [y, m] = key.split("-").map(x => parseInt(x, 10));
  const dt = new Date(y, m - 1, 1);
  return dt.toLocaleString(undefined, { month: "long", year: "numeric" });
}

function renderBookPreview(favs) {
  if (!els.bookSidebar || !els.bookPageHost) return;

  // build chapters from filtered favorites
  const groups = new Map();
  const ordered = favs.slice().sort((a, b) => a.date - b.date);
  for (const p of ordered) {
    const k = monthKey(p.date);
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k).push(p);
  }

  bookState.chapters = [...groups.entries()].map(([k, items]) => ({ key: k, items }));

  const globalPages = [];

  // 1. Title Page
  const earliest = ordered[0].date;
  const latest = ordered[ordered.length - 1].date;
  const spanStr = `${earliest.toLocaleDateString(undefined, { month: 'short', year: 'numeric' })} – ${latest.toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}`;

  globalPages.push({
    type: 'title',
    title: "Museum Archive",
    subtitle: spanStr,
    recordNo: ordered.length + 1
  });

  // 2. Travel Log (if location bits exist)
  const locPosts = ordered.filter(p => p.location && (p.location.city || p.location.country));
  if (locPosts.length > 0) {
    const cities = [...new Set(locPosts.map(p => p.location.city).filter(Boolean))];
    const countries = [...new Set(locPosts.map(p => p.location.country).filter(Boolean))];
    globalPages.push({ type: 'travel', cities, countries, count: locPosts.length });
  }

  // 3. Content Chapters + Era Spacers
  const eras = loadEras();
  for (const ch of bookState.chapters) {
    globalPages.push({ type: 'divider', label: monthLabel(ch.key) });
    const items = ch.items;
    for (let i = 0; i < items.length; i += 4) {
      globalPages.push({ type: 'content', items: items.slice(i, i + 4), label: monthLabel(ch.key), eras });
    }
  }

  // 4. Collection Stats
  const eraCounts = {};
  ordered.forEach(p => {
    const hits = erasForPost(p, eras);
    hits.forEach(id => {
      eraCounts[id] = (eraCounts[id] || 0) + 1;
    });
  });
  let topEraName = "None";
  let topEraId = null;
  let topC = 0;
  Object.keys(eraCounts).forEach(id => {
    if (eraCounts[id] > topC) {
      topC = eraCounts[id];
      topEraId = id;
    }
  });
  if (topEraId) {
    const found = eras.find(e => e.id === topEraId);
    if (found) topEraName = found.name;
  }

  globalPages.push({
    type: 'stats',
    favCount: ordered.length,
    monthCount: bookState.chapters.length,
    span: `${formatYMDPretty(getLocalDateStr(ordered[0]))} to ${formatYMDPretty(getLocalDateStr(ordered[ordered.length - 1]))}`,
    topEra: topEraName
  });

  bookState.pages = globalPages;

  if (!bookState.chapters.length) {
    els.bookSidebar.innerHTML = `<div class="muted">No favorites match the current filters.</div>`;
    els.bookPageHost.innerHTML = "";
    return;
  }

  // We don't use chapterKey for navigation anymore, we use global pageIndex
  bookState.pageIndex = clamp(bookState.pageIndex || 0, 0, Math.max(0, globalPages.length - 1));

  // render sidebar - now with whole-book navigation
  els.bookSidebar.innerHTML = `
    <div style="margin-bottom:15px; font-weight:700; font-size:14px;">Chapters</div>
    <div class="chapterBtn ${bookState.pageIndex === 0 ? 'active' : ''}" onclick="window.jumpToPage(0)">Title Page</div>
  `;

  let currentP = 1; // skip title
  if (locPosts.length > 0) currentP++; // skip travel log

  for (const ch of bookState.chapters) {
    const startP = currentP;
    const b = document.createElement("div");
    b.className = "chapterBtn";
    const itemsCount = ch.items.length;
    const pagesCount = 1 + Math.ceil(itemsCount / 4);

    if (bookState.pageIndex >= startP && bookState.pageIndex < startP + pagesCount) {
      b.classList.add("active");
    }

    b.textContent = `${monthLabel(ch.key)} (${itemsCount})`;
    b.addEventListener("click", () => {
      window.jumpToPage(startP);
    });
    els.bookSidebar.appendChild(b);
    currentP += pagesCount;
  }

  window.jumpToPage = (idx) => {
    bookState.pageIndex = idx;
    const currentFavs = getFilteredFavoritesForCurrentMode ? getFilteredFavoritesForCurrentMode() : favs;
    renderBookPreview(currentFavs);
  };

  renderBookPage();
}

function paginateChapter(items) {
  // 1–4 per page (simple, consistent): 4 per page, last page remainder
  const pages = [];
  for (let i = 0; i < items.length; i += 4) pages.push(items.slice(i, i + 4));
  return pages;
}

// Helper to render a single page container
function createPageEl(pData, side, totalPages, pageIndex) {
  if (pData.type === 'title') {
    const el = document.createElement("div");
    el.className = "titlePage";
    el.innerHTML = `
      <div style="flex:1; display:flex; flex-direction:column; justify-content:center; align-items:center;">
        <div style="width:60px; height:1px; background:var(--accent); margin-bottom:40px;"></div>
        <div style="font-size:11px; letter-spacing:5px; opacity:0.6; margin-bottom:15px; color:var(--accent); font-weight:600;">OFFICIAL ARCHIVE</div>
        <h1 style="font-size:42px; margin:0; font-weight:700; letter-spacing:-1px;">${pData.title}</h1>
        <div style="width:40px; height:2px; background:#333; margin:30px 0;"></div>
        <div style="font-size:16px; font-weight:400; opacity:0.8; letter-spacing:1px;">${pData.subtitle}</div>
        <div style="margin-top:60px; font-size:10px; opacity:0.4; letter-spacing:2px;">EXHIBITION RECORD NO. ${pData.recordNo || 0}</div>
      </div>
      <div style="font-size:9px; opacity:0.3; letter-spacing:3px; margin-bottom:20px;">CURATED BY BEREAL MUSEUM</div>
    `;
    return el;
  }

  const el = document.createElement("div");
  el.className = `bookPage ${side}`;

  if (pData.type === 'travel') {
    el.innerHTML = `
      <div class="dividerPage">
        <div style="font-size:40px; margin-bottom:20px;">✈️</div>
        <h2 style="font-size:24px; margin:0 0 10px;">Travel Log</h2>
        <div style="font-size:12px; opacity:0.6; margin-bottom:30px;">${pData.count} geotagged memories</div>
        <div style="text-align:left; width:100%; font-size:13px; line-height:1.6;">
          <strong>Countries:</strong> ${pData.countries.join(", ") || "Local"}<br><br>
          <strong>Cities:</strong> ${pData.cities.join(", ")}
        </div>
      </div>
    `;
  } else if (pData.type === 'stats') {
    el.innerHTML = `
      <div class="dividerPage">
        <div style="font-size:40px; margin-bottom:20px;">🏛️</div>
        <h2 style="font-size:24px; margin:0 0 10px;">Collection Wrap-up</h2>
        <div style="font-size:12px; opacity:0.6; margin-bottom:30px;">Archive Summary</div>
        
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:30px; text-align:center; width:100%;">
          <div>
            <div style="font-size:24px; font-weight:700;">${pData.favCount}</div>
            <div style="font-size:10px; opacity:0.6; letter-spacing:1px;">CURATED POSTS</div>
          </div>
          <div>
            <div style="font-size:24px; font-weight:700;">${pData.monthCount}</div>
            <div style="font-size:10px; opacity:0.6; letter-spacing:1px;">ACTIVE MONTHS</div>
          </div>
          <div style="grid-column: span 2; border-top:1px solid #eee; padding-top:20px;">
            <div style="font-size:16px; font-weight:600;">${pData.topEra}</div>
            <div style="font-size:10px; opacity:0.6; letter-spacing:1px;">MOST PROMINENT ERA</div>
          </div>
          <div style="grid-column: span 2;">
            <div style="font-size:14px; font-weight:500; font-style:italic;">${pData.span}</div>
            <div style="font-size:10px; opacity:0.6; letter-spacing:1px;">TIME SPAN</div>
          </div>
        </div>
        <div style="margin-top:40px; font-size:11px; font-style:italic; opacity:0.3;">BeReal Museum Archive System v1.0</div>
      </div>
    `;
  } else if (pData.type === 'divider') {
    const div = document.createElement("div");
    div.className = "dividerPage";
    div.innerHTML = `
      <h2 style="font-size:28px; font-weight:300; letter-spacing:2px; color:#333;">${pData.label}</h2>
      <div style="width:40px; height:1px; background:#ddd; margin:20px 0;"></div>
    `;
    el.appendChild(div);
  } else if (pData.type === 'content') {
    const header = document.createElement("div");
    header.style.fontSize = "10px";
    header.style.color = "#888";
    header.style.marginBottom = "20px";
    header.textContent = pData.label.toUpperCase();
    el.appendChild(header);

    const grid = document.createElement("div");
    grid.className = "bookGrid";
    for (const it of pData.items) {
      const note = getNote(postKey(it));
      const hits = erasForPost(it, pData.eras || []);

      const card = document.createElement("div");
      card.className = "bookPhoto";
      const frame = document.createElement("div");
      frame.className = "frame";
      const back = document.createElement("img");
      back.className = "back";
      back.src = it.backUrl || it.frontUrl || "";
      frame.appendChild(back);
      if (it.frontUrl) {
        const front = document.createElement("img");
        front.className = "front";
        front.src = it.frontUrl;
        frame.appendChild(front);
      }
      const cap = document.createElement("div");
      cap.className = "bookCaption";
      let label = (note.label || "").trim();
      if (label.toUpperCase() === "UNTITLED") label = "";

      const eraTags = hits.length ? hits.map(id => {
        const era = (pData.eras || []).find(e => e.id === id);
        return era ? `<span style="background:#eee; padding:2px 4px; border-radius:4px; margin-right:4px;">${era.name}</span>` : "";
      }).join("") : "";

      cap.innerHTML = `
        <div style="padding:12px;">
          <div style="display:flex; flex-wrap:wrap; gap:4px; margin-bottom:6px;">${eraTags}</div>
          <div style="font-weight:600; font-size:12px; line-height:1.4; color:#111;">${escapeHtml(label)}</div>
          <div style="font-size:10px; opacity:0.5; margin-top:6px; font-weight:500;">${it.date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</div>
        </div>
      `;
      card.append(frame, cap);
      grid.appendChild(card);
    }
    el.appendChild(grid);
  }

  const footer = document.createElement("div");
  footer.style.position = "absolute";
  footer.style.bottom = "20px";
  footer.style[side === 'left' ? 'left' : 'right'] = "30px";
  footer.style.fontSize = "9px";
  footer.style.color = "#ccc";
  footer.textContent = pageIndex + 1;
  el.appendChild(footer);

  return el;
}

function renderBookPage() {
  if (!els.bookPageHost) return;

  const pages = bookState.pages;
  const idx = bookState.pageIndex;

  if (els.bookPageInfo) {
    els.bookPageInfo.textContent = `Page ${idx + 1}/${pages.length}`;
  }

  els.bookPageHost.innerHTML = "";

  // We render a spread: current index and next index
  const spread = document.createElement("div");
  spread.className = "bookSpread";

  const leftPage = pages[idx];
  spread.appendChild(leftPage ? createPageEl(leftPage, 'left', pages.length, idx) : document.createElement("div"));

  const rightPage = pages[idx + 1];
  if (rightPage) {
    spread.appendChild(createPageEl(rightPage, 'right', pages.length, idx + 1));
  } else if (idx > 0) {
    // Blank right page if we are at the end
    const last = document.createElement("div");
    last.className = "bookPage right";
    spread.appendChild(last);
  }

  els.bookPageHost.appendChild(spread);

  enable(els.bookPrev, idx > 0);
  enable(els.bookNext, idx < pages.length - 2); // -2 because we show 2 at a time
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
    start.value = era.startISO.slice(0, 10);
    const end = document.createElement("input");
    end.type = "date";
    end.className = "btn";
    end.value = era.endISO.slice(0, 10);
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
    m.textContent = `${era.startISO.slice(0, 10)} → ${era.endISO.slice(0, 10)} • ${hits.length} favorites`;

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
   Mosaic + Timeline + Photomosaic Logic
   =========================== */

// 1. Compute average color of an image/canvas
function getAverageColor(imgOrCanvas) {
  const c = document.createElement("canvas");
  c.width = 1; c.height = 1;
  const ctx = c.getContext("2d");
  ctx.drawImage(imgOrCanvas, 0, 0, 1, 1);
  const d = ctx.getImageData(0, 0, 1, 1).data; // [r, g, b, a]
  return [d[0], d[1], d[2]];
}

// 2. Color distance (Euclidean is fine for this)
function colorDist(c1, c2) {
  return Math.sqrt(
    (c1[0] - c2[0]) ** 2 + (c1[1] - c2[1]) ** 2 + (c1[2] - c2[2]) ** 2
  );
}

// 3. Process Target Image into a grid of colors
function processTargetImage(img, cols) {
  // cols = e.g. 50
  const aspect = img.naturalHeight / img.naturalWidth;
  const rows = Math.round(cols * aspect);

  const c = document.createElement("canvas");
  c.width = cols;
  c.height = rows;
  const ctx = c.getContext("2d");
  ctx.drawImage(img, 0, 0, cols, rows);

  const data = ctx.getImageData(0, 0, cols, rows).data;
  const colors = [];

  for (let i = 0; i < data.length; i += 4) {
    colors.push([data[i], data[i + 1], data[i + 2]]);
  }
  return { colors, rows, cols };
}

// Reuse the existing ZIP import / code but updated for mosaic logic
let isBuildingMosaic = false;

// ... (existing helper functions: cleanupObjectUrls, loadImage, loadThumbnails, resizeCanvasToDisplaySize are kept below)

function drawMosaic() {
  const canvas = els.mosaic;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const { w, h } = resizeCanvasToDisplaySize(canvas);

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#111"; // dark bg
  ctx.fillRect(0, 0, w, h);

  // If no tiles, nothing to do
  if (!mosaicState.tiles.length) return;

  // We have two modes: 
  // A) Photomosaic (if targetImg is present and mapping exists)
  // B) Plain grid (legacy/fallback)

  const isPhotomosaic = !!(mosaicState.targetImg && mosaicState.mapping.length);

  // Base tile size
  const dpr = window.devicePixelRatio || 1;
  const baseSize = 64;
  const tileSize = baseSize * mosaicState.zoom * dpr;

  // Virtual grid dimensions
  let vCols, vRows;

  if (isPhotomosaic) {
    vCols = mosaicState.gridW;
    vRows = mosaicState.gridH;
  } else {
    // legacy mode: loose pile. Use a FIXED column count for stability
    vCols = mosaicState.gridW || Math.floor(Math.sqrt(mosaicState.tiles.length)) || 10;
    vRows = Math.ceil(mosaicState.tiles.length / vCols);
  }

  const ox = mosaicState.panX;
  const oy = mosaicState.panY;

  // Visible range
  const startCol = Math.max(0, Math.floor((-ox) / tileSize) - 1);
  const endCol = Math.min(vCols, Math.ceil((w - ox) / tileSize) + 1);
  const startRow = Math.max(0, Math.floor((-oy) / tileSize) - 1);
  const endRow = Math.min(vRows, Math.ceil((h - oy) / tileSize) + 1);

  // Draw tiles
  for (let r = startRow; r < endRow; r++) {
    for (let c = startCol; c < endCol; c++) {
      const idx = r * vCols + c;
      if (idx >= (isPhotomosaic ? mosaicState.mapping.length : mosaicState.tiles.length)) continue; // blank spot

      let tileObj;
      if (isPhotomosaic) {
        // get the tile assigned to this cell
        const tileIdx = mosaicState.mapping[idx];
        if (tileIdx === -1) continue; // no match?
        tileObj = mosaicState.tiles[tileIdx];
      } else {
        tileObj = mosaicState.tiles[idx];
      }

      if (!tileObj) continue;

      const x = ox + c * tileSize;
      const y = oy + r * tileSize; // floor/round to avoid gaps?

      // Draw the tile image
      // tileObj.img is a canvas or ImageBitmap
      ctx.drawImage(tileObj.img, x, y, tileSize, tileSize);
    }
  }

  // OVERLAY logic: when zoomed out, fade in the target image to make it look "perfect"
  if (isPhotomosaic && mosaicState.zoom < 0.4) {
    const totalW = vCols * tileSize;
    const totalH = vRows * tileSize;

    // Fade in as zoom gets smaller. 
    // zoom 0.4 -> opacity 0. 
    // zoom 0.1 -> opacity 0.8
    const t = Math.max(0, Math.min(1, (0.4 - mosaicState.zoom) * 3));

    if (t > 0) {
      ctx.globalAlpha = t * 0.85; // max 85% opacity
      ctx.drawImage(mosaicState.targetImg, ox, oy, totalW, totalH);
      ctx.globalAlpha = 1.0;
    }
  }
}

// Add event listener to "Build Mosaic" to do the heavy lifting
if (els.buildMosaic) {
  els.buildMosaic.addEventListener("click", async () => {
    if (!posts.length) return;
    setStatus("Generating mosaic tiles... (this may take a moment)");

    // 1. Generate thumbnails/tiles (if not already or if we need colors)
    if (!mosaicState.tiles.length || (mosaicState.targetImg && !mosaicState.tiles[0].avg)) {
      const urls = posts.map(p => p.backUrl || p.frontUrl).filter(Boolean);
      const capped = urls.slice(0, 2000); // safety cap
      const imgs = await loadThumbnails(capped, 64, 64);

      mosaicState.tiles = imgs.map(img => ({
        img,
        avg: getAverageColor(img)
      }));
    }

    // 2. If target image exists, do the photomosaic matching
    if (mosaicState.targetImg) {
      setStatus("Matching tiles to target image...");

      const GRID_COLS = 60; // resolution
      const { colors, rows, cols } = processTargetImage(mosaicState.targetImg, GRID_COLS);
      mosaicState.gridW = cols;
      mosaicState.gridH = rows;
      mosaicState.targetData = colors;

      mosaicState.mapping = new Array(colors.length);
      const tileColors = mosaicState.tiles.map(t => t.avg);

      for (let i = 0; i < colors.length; i++) {
        const targetC = colors[i];
        let minD = Infinity;
        let bestIdx = -1;
        for (let j = 0; j < tileColors.length; j++) {
          const d = colorDist(targetC, tileColors[j]);
          if (d < minD) { minD = d; bestIdx = j; }
        }
        mosaicState.mapping[i] = bestIdx;
      }

      mosaicState.zoom = 0.5;
      mosaicState.panX = 100; mosaicState.panY = 100;
      setStatus(`Photomosaic ready (${cols}x${rows})`);
    } else {
      // Plain grid mode
      mosaicState.mapping = [];
      mosaicState.gridW = Math.floor(Math.sqrt(mosaicState.tiles.length)) || 10;
      mosaicState.zoom = 1.0;
      mosaicState.panX = 0; mosaicState.panY = 0;
      setStatus(`Grid ready (${mosaicState.tiles.length} tiles)`);
    }

    drawMosaic();
  });
}

// ... (keep the rest: cleanup, loadImage, loadThumbnails etc.)
// CAREFUL: loadThumbnails was used above, make sure it is defined. 
// I will keep existing decls if I don't overwrite them.

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



function populateDayPickForTimeline() {
  populateDayPick(els.tlDayPick);
  const now = new Date();
  if (els.tlMonthPick) els.tlMonthPick.value = String(now.getMonth() + 1);
  if (els.tlDayPick) els.tlDayPick.value = String(now.getDate());
}

function filterPostsOnThisDay(list) {
  const m = parseInt(els.tlMonthPick?.value || "1", 10);
  const d = parseInt(els.tlDayPick?.value || "1", 10);
  if (d === -1) {
    return list.filter(p => (p.date.getMonth() + 1) === m);
  }
  return list.filter(p => (p.date.getMonth() + 1) === m && p.date.getDate() === d);
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
    img.crossOrigin = "anonymous";
    img.onload = async () => {
      try {
        await img.decode(); // Ensure decoded
        resolve(img);
      } catch (e) {
        // Some browsers reject decode but image might still draw
        console.warn("Decode failed, but onload fired", e);
        resolve(img);
      }
    };
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

// Refactored helper: draws a post to a context
async function drawFavoriteToCtx(ctx, W, H, post, note, opts) {
  const backUrl = post.backUrl || post.frontUrl;
  if (!backUrl) return;

  ctx.fillStyle = "#000"; ctx.fillRect(0, 0, W, H);

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
    ctx.stroke();
  }

  // Draw metadata text if requested (e.g. for video)
  if (opts.drawMeta) {
    const dateStr = post.date.toLocaleDateString();
    const label = (note?.label || "").trim();

    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.shadowBlur = 4; ctx.shadowColor = "black";
    ctx.font = `bold ${Math.round(H * 0.025)}px sans-serif`;
    ctx.textAlign = "center";

    // Date at top
    ctx.fillText(dateStr, W / 2, H * 0.05);

    // Label at bottom
    if (label) {
      ctx.font = `${Math.round(H * 0.02)}px sans-serif`;
      ctx.fillText(label, W / 2, H * 0.96);
    }
  } else {
    // Original behavior for JPEG export: baked-in caption at bottom
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
  }
}

async function renderFavoriteToJpegBlob(post, note, opts = {}) {
  const W = opts.width ?? 1080;
  const H = opts.height ?? 1440;
  const canvas = document.createElement("canvas");
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext("2d");

  await drawFavoriteToCtx(ctx, W, H, post, note, { ...opts, drawMeta: false });

  const quality = opts.quality ?? 0.92;
  return new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
}

// VIDEO RECORDER LOGIC
els.reelRecord?.addEventListener("click", async () => {
  const favs = getFilteredFavoritesForCurrentMode();
  if (!favs.length) return;

  if (confirm(`Download highlight reel video (${favs.length} posts)? This will play through them once to record.`)) {
    downloadReelVideo(favs);
  }
});

async function downloadReelVideo(favs) {
  // 1. Setup Canvas (High Quality)
  const W = 1080, H = 1920;
  const canvas = document.createElement("canvas");
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext("2d");

  // Initial fill
  ctx.fillStyle = "#000"; ctx.fillRect(0, 0, W, H);

  setStatus("Preparing video recorder (High Quality)...");

  // 2. Setup Audio
  const ctxAudio = new (window.AudioContext || window.webkitAudioContext)();
  const dest = ctxAudio.createMediaStreamDestination();
  const gain = ctxAudio.createGain();
  gain.connect(dest);

  let sourceNode = null;

  if (reelCustomBuffer) {
    const src = ctxAudio.createBufferSource();
    src.buffer = reelCustomBuffer;
    src.loop = true;
    src.connect(gain);
    src.start();
    sourceNode = src;
    gain.gain.value = 0.5;
  } else {
    const osc = ctxAudio.createOscillator();
    osc.type = "triangle";
    osc.frequency.value = 220;
    osc.connect(gain);
    osc.start();
    sourceNode = osc;
    gain.gain.value = 0.1;
  }

  // 3. Setup Recorder
  // Firefox requires drawing before capture?
  const stream = canvas.captureStream(30);
  const audioTrack = dest.stream.getAudioTracks()[0];
  if (audioTrack) stream.addTrack(audioTrack);

  const chunks = [];
  let rec;
  const options = { videoBitsPerSecond: 8000000 }; // 8 Mbps for crisp quality

  try {
    rec = new MediaRecorder(stream, { ...options, mimeType: 'video/webm; codecs=vp9' });
  } catch (e) {
    console.warn("VP9 not supported, trying default.");
    try {
      rec = new MediaRecorder(stream, { ...options, mimeType: 'video/webm' });
    } catch (e2) {
      rec = new MediaRecorder(stream, options);
    }
  }

  rec.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };
  rec.start();

  const msPerFrame = reelState.ms || 1000;

  setStatus("Recording... please wait.");

  // Wait a tick for recorder to init
  await new Promise(r => setTimeout(r, 200));

  for (let i = 0; i < favs.length; i++) {
    const p = favs[i];
    const note = getNote(postKey(p));

    // Clear
    ctx.fillStyle = "#000"; ctx.fillRect(0, 0, W, H);

    try {
      await drawFavoriteToCtx(ctx, W, H, p, note, { drawMeta: reelState.showLabels });
    } catch (e) {
      console.error("Frame draw failed", e);
      // Draw error text
      ctx.fillStyle = "white";
      ctx.font = "30px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Image Error", W / 2, H / 2);
    }

    setStatus(`Recording: ${i + 1}/${favs.length}`);
    await new Promise(r => setTimeout(r, msPerFrame));
  }

  // Stop everything
  rec.stop();
  sourceNode.stop();

  rec.onstop = () => {
    const blob = new Blob(chunks, { type: "video/webm" });
    setStatus(`Video ready: ${(blob.size / 1024 / 1024).toFixed(2)}MB`);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `BeReal_Reel_${new Date().toISOString().slice(0, 10)}.webm`;
    a.click();
    setStatus("Video downloaded!");
  };
}

/* ===========================
   World Tour (Map)
   =========================== */
function initMap() {
  if (!els.views.worldtour) return;
  // Map is already defined in index.html via script tags, 
  // so L should be available.
  renderMap();
}

function renderMap() {
  const mapContainer = document.getElementById('map');
  if (!mapContainer) return;

  if (!map) {
    map = L.map('map').setView([20, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
  }

  // Ensure map layout is correct
  setTimeout(() => {
    map.invalidateSize();
  }, 100);

  // Clear existing markers
  markers.forEach(m => m.remove());
  markers = [];

  const postsWithLocation = posts.filter(p => p.location && p.location.latitude && p.location.longitude);
  if (!postsWithLocation.length) {
    if (posts.length > 0) setStatus("No posts with location data found.");
    return;
  }

  const latLngs = [];
  postsWithLocation.forEach(p => {
    const lat = p.location.latitude;
    const lng = p.location.longitude;
    latLngs.push([lat, lng]);

    const marker = L.marker([lat, lng]).addTo(map);
    const primaryUrl = p.backUrl || "";
    const secondaryUrl = p.frontUrl || "";

    const popupContent = `
      <div style="width:180px; font-family:system-ui, -apple-system, sans-serif; background:#000; color:#fff; padding:8px; border-radius:12px;">
        <div style="font-size:11px; font-weight:700; text-transform:uppercase; margin-bottom:6px; opacity:0.8;">
          ${p.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
        </div>
        <div style="position:relative; width:100%; aspect-ratio:3/4; background:#111; border-radius:8px; overflow:hidden; margin-bottom:8px;">
          <img src="${primaryUrl}" style="width:100%; height:100%; object-fit:cover;">
          <img src="${secondaryUrl}" style="position:absolute; top:8px; left:8px; width:35%; aspect-ratio:3/4; border:1.5px solid #fff; border-radius:6px; box-shadow:0 4px 12px rgba(0,0,0,0.5); object-fit:cover;">
        </div>
        <div style="font-size:11px; margin-bottom:8px; line-height:1.3; opacity:0.9;">
          ${p.location.city || ''}${p.location.city && p.location.country ? ', ' : ''}${p.location.country || ''}
        </div>
        <button onclick="window.location.hash='#timeline'; setView('timeline'); setTimeout(()=> { 
          const el = document.querySelector('[data-id=\\'${postKey(p)}\\']');
          if(el) {
            el.scrollIntoView({behavior:'smooth', block:'center'});
            el.style.outline = '3px solid #00f';
            setTimeout(() => el.style.outline = '', 2000);
          }
        }, 100);" style="width:100%; height:32px; background:#fff; color:#000; border:none; border-radius:6px; font-size:11px; font-weight:700; cursor:pointer; display:flex; align-items:center; justify-content:center;">
          VIEW IN TIMELINE
        </button>
      </div>
    `;

    marker.bindPopup(popupContent, {
      maxWidth: 220,
      minWidth: 200,
      className: 'bereal-popup'
    });
    markers.push(marker);
  });

  if (latLngs.length > 0) {
    map.fitBounds(latLngs, { padding: [50, 50] });
  }
  setStatus(`Map loaded with ${postsWithLocation.length} location-tagged posts.`);
}

/* ===========================
   Realmoji Wall
   =========================== */
function renderRealmojiWall() {
  const wall = document.getElementById("realmojiWall");
  if (!wall) return;
  wall.innerHTML = "";

  if (!realmojiUrls.length) {
    wall.innerHTML = `<div class="muted" style="padding: 100px; text-align:center;">No personal Realmojis found in your ZIP.</div>`;
    return;
  }

  // Favorites Section
  const favs = realmojiUrls.filter(rm => realmojiFavorites.has(rm.path));
  if (favs.length > 0) {
    const favHeader = document.createElement("div");
    favHeader.className = "wallSectionHeader";
    favHeader.innerHTML = `<h3>💖 Curated Collection</h3>`;
    wall.appendChild(favHeader);

    const favGrid = document.createElement("div");
    favGrid.className = "realmojiGrid";
    favs.forEach(rm => favGrid.appendChild(createRealmojiBubble(rm)));
    wall.appendChild(favGrid);

    const allHeader = document.createElement("div");
    allHeader.className = "wallSectionHeader";
    allHeader.innerHTML = `<h3>🏛️ The Full Archive</h3>`;
    wall.appendChild(allHeader);
  }

  const mainGrid = document.createElement("div");
  mainGrid.className = "realmojiGrid";
  realmojiUrls.forEach(rm => mainGrid.appendChild(createRealmojiBubble(rm)));
  wall.appendChild(mainGrid);
}

function createRealmojiBubble(rm) {
  const bubble = document.createElement("div");
  bubble.className = "emojiBubble";
  if (realmojiFavorites.has(rm.path)) bubble.classList.add("isFavorite");
  bubble.style.setProperty("--delay", `${(Math.random() * 5).toFixed(2)}s`);
  bubble.style.display = "none"; // Hide until image loads

  const img = document.createElement("img");
  img.src = rm.url;

  // Only show bubble if image loads successfully
  img.onload = () => {
    bubble.style.display = "";
  };

  // Remove bubble if image fails to load
  img.onerror = () => {
    bubble.remove();
    console.warn(`Failed to load RealMoji image: ${rm.url}`);
  };

  // Click handler to open lightbox
  bubble.addEventListener("click", () => {
    openRealmojiModal(rm.url);
  });

  // Heart Favorite Button
  const heart = document.createElement("div");
  heart.className = "bubbleHeart";
  heart.innerHTML = "❤";
  heart.addEventListener("click", (e) => {
    e.stopPropagation(); // Don't open lightbox
    toggleRealmojiFavorite(rm.path);
  });

  bubble.appendChild(img);
  bubble.appendChild(heart);
  return bubble;
}

// Toggle RealMoji Favorite
function toggleRealmojiFavorite(path) {
  if (realmojiFavorites.has(path)) {
    realmojiFavorites.delete(path);
  } else {
    realmojiFavorites.add(path);
  }
  localStorage.setItem("realmojiFavorites", JSON.stringify([...realmojiFavorites]));
  renderRealmojiWall(); // Re-render to update UI
}

// Open RealMoji in lightbox modal
function openRealmojiModal(imageUrl) {
  const modal = document.getElementById("realmojiModal");
  const modalImg = document.getElementById("realmojiModalImg");
  if (!modal || !modalImg) return;

  modalImg.src = imageUrl;
  modal.classList.add("open");

  // Prevent body scroll when modal is open
  document.body.style.overflow = "hidden";
}

// Close RealMoji modal
function closeRealmojiModal() {
  const modal = document.getElementById("realmojiModal");
  if (!modal) return;

  modal.classList.remove("open");
  document.body.style.overflow = "";
}

// Set up modal close handlers
const realmojiModal = document.getElementById("realmojiModal");
if (realmojiModal) {
  // Close on background click
  realmojiModal.addEventListener("click", (e) => {
    if (e.target === realmojiModal) {
      closeRealmojiModal();
    }
  });

  // Close on close button click
  const closeBtn = realmojiModal.querySelector(".closeBtn");
  if (closeBtn) {
    closeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      closeRealmojiModal();
    });
  }

  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && realmojiModal.classList.contains("open")) {
      closeRealmojiModal();
    }
  });
}


/* ===========================
   Wire up events (NULL-SAFE)
   =========================== */
els.tabs.forEach(tab => tab?.addEventListener("click", () => setView(tab.dataset.view)));

els.monthPick?.addEventListener("change", () => refreshFavoritesUI());
els.dayPick?.addEventListener("change", () => refreshFavoritesUI());
els.labelFilter?.addEventListener("change", () => refreshFavoritesUI());
els.labelSearch?.addEventListener("input", () => refreshFavoritesUI());

els.sortAsc?.addEventListener("click", () => { posts.sort((a, b) => a.date - b.date); renderTimeline(posts); });
els.sortDesc?.addEventListener("click", () => { posts.sort((a, b) => b.date - a.date); renderTimeline(posts); });

els.tlModeGrid?.addEventListener("click", () => setTimelineMode("grid"));
els.tlModeStrip?.addEventListener("click", () => setTimelineMode("strip"));
els.tlModeOnThisDay?.addEventListener("click", () => setTimelineMode("onthisday"));
els.tlMonthPick?.addEventListener("change", () => renderTimeline(posts));
els.tlDayPick?.addEventListener("change", () => renderTimeline(posts));

els.favModeGrid?.addEventListener("click", () => setFavMode("grid"));
els.favModeStrip?.addEventListener("click", () => setFavMode("strip"));
els.favModeStory?.addEventListener("click", () => setFavMode("story"));
els.btnStats?.addEventListener("click", () => setView("stats"));
els.btnWorldTour?.addEventListener("click", () => setView("worldtour"));
els.btnManager?.addEventListener("click", () => setView("manager"));
els.favModeRoulette?.addEventListener("click", () => setFavMode("roulette"));
els.favModeOnThisDay?.addEventListener("click", () => setFavMode("onthisday"));
els.favModeReel?.addEventListener("click", () => setFavMode("reel"));
els.favModeWall?.addEventListener("click", () => setFavMode("wall"));
els.favModeBook?.addEventListener("click", () => setFavMode("book"));
els.favModeEras?.addEventListener("click", () => setFavMode("eras"));

els.wallRegenerate?.addEventListener("click", () => { wallSeed++; refreshFavoritesUI(); });
els.wallReduceMotion?.addEventListener("change", () => refreshFavoritesUI());

els.bookPrev?.addEventListener("click", () => { bookState.pageIndex = Math.max(0, bookState.pageIndex - 2); renderBookPage(); });
els.bookNext?.addEventListener("click", () => { bookState.pageIndex = Math.min(bookState.pages.length - 1, bookState.pageIndex + 2); renderBookPage(); });
els.bookPrint?.addEventListener("click", () => {
  const container = document.getElementById("printContainer");
  if (!container) return;
  container.innerHTML = "";

  // Render every page in sequence
  bookState.pages.forEach((p, i) => {
    container.appendChild(createPageEl(p, i % 2 === 0 ? 'left' : 'right', bookState.pages.length, i));
  });

  window.print();
});

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
  mosaicState.zoom = clamp(mosaicState.zoom * (delta > 0 ? 0.9 : 1.1), 0.05, 6);

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
  friends = [];
  comments = [];
  memories = [];
  realmojiCount = 0;
  realmojiUrls = [];
  if (els.timelineGrid) els.timelineGrid.innerHTML = "";
  if (els.timelineStrip) els.timelineStrip.innerHTML = "";
  if (els.count) els.count.textContent = "";

  try {
    setStatus("Reading ZIP…");
    const buf = new Uint8Array(await file.arrayBuffer());
    const z = unzipSync(buf);

    const keys = Object.keys(z);

    // Attempt to personalize using user.json
    try {
      const userKey = keys.find(k => k.toLowerCase().endsWith("/user.json") || k.toLowerCase() === "user.json");
      if (userKey) {
        const userData = JSON.parse(strFromU8(z[userKey]));
        if (userData && userData.fullname) {
          const name = userData.fullname.trim();
          const sanitized = name.endsWith("s") ? `${name}'` : `${name}'s`;
          const title = `${sanitized} BeReal Museum`;
          const entH1 = document.querySelector("#entrance h1");
          const mainH1 = document.querySelector("#mainHeader h1");
          if (entH1) entH1.textContent = title;
          if (mainH1) mainH1.textContent = title.toUpperCase();
          document.title = title;
        }
      }
    } catch (e) {
      console.warn("Could not parse user.json for personalization", e);
    }
    const postsKey = keys.find(k => k.toLowerCase().endsWith("/posts.json")) ||
      keys.find(k => k.toLowerCase() === "posts.json");

    if (!postsKey) { setStatus("Couldn't find posts.json in the ZIP."); return; }

    const postsJson = JSON.parse(strFromU8(z[postsKey]));
    if (!Array.isArray(postsJson)) { setStatus("posts.json wasn't an array. Unexpected format."); return; }

    // Parse friends.json
    try {
      const friendsKey = keys.find(k => k.toLowerCase().endsWith("/friends.json") || k.toLowerCase() === "friends.json");
      if (friendsKey) {
        friends = JSON.parse(strFromU8(z[friendsKey]));
      }
    } catch (e) {
      console.warn("Could not parse friends.json", e);
    }

    // Parse comments.json
    try {
      const commentsKey = keys.find(k => k.toLowerCase().endsWith("/comments.json") || k.toLowerCase() === "comments.json");
      if (commentsKey) {
        comments = JSON.parse(strFromU8(z[commentsKey]));
      }
    } catch (e) {
      console.warn("Could not parse comments.json", e);
    }

    // Parse memories.json
    try {
      const memoriesKey = keys.find(k => k.toLowerCase().endsWith("/memories.json") || k.toLowerCase() === "memories.json");
      if (memoriesKey) {
        memories = JSON.parse(strFromU8(z[memoriesKey]));
      }
    } catch (e) {
      console.warn("Could not parse memories.json", e);
    }

    // Count and Collect Realmojis
    const realmojiKeys = keys.filter(k => k.toLowerCase().includes("/realmoji/") && k.toLowerCase().endsWith(".webp"));
    realmojiCount = realmojiKeys.length;

    // Pre-create URLs for Realmoji Wall
    realmojiKeys.forEach(k => {
      const bytes = z[k];
      // Skip empty or very small files (likely corrupted/invalid)
      if (!bytes || bytes.length < 100) return;

      const blob = new Blob([bytes], { type: "image/webp" });
      const url = URL.createObjectURL(blob);
      realmojiUrls.push({ url, path: k });
      mediaObjectUrls.push(url); // Ensure cleanup
    });

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

    posts.sort((a, b) => a.date - b.date);

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
    enable(els.tlModeOnThisDay, true); // Ensure this matches ID
    enable(els.tlModeManager, true);

    populateDayPick(els.dayPick);
    const now = new Date();
    if (els.monthPick) els.monthPick.value = String(now.getMonth() + 1);
    if (els.dayPick) els.dayPick.value = String(now.getDate());
    populateDayPickForTimeline();

    populateLabelFilter();
    renderTimeline(posts);

    // Hide entrance and show header
    const entrance = document.getElementById("entrance");
    const header = document.getElementById("mainHeader");
    const footer = document.getElementById("mainFooter");
    if (entrance) entrance.classList.add("hidden");
    if (header) header.classList.add("active");
    if (footer) footer.classList.add("active");

    setStatus("Welcome to the Museum.");
  } catch (err) {
    console.error(err);
    setStatus("Error importing ZIP. See console for details.");
  }
});

/* ---------- Bootstrap ---------- */
populateLabelFilter();
populateDayPick(els.dayPick);
populateDayPickForTimeline();
// ---------------------------------------------------------
// Bulk Favorite Manager
// ---------------------------------------------------------

const mgrState = {
  days: [true, true, true, true, true, true, true], // Sun-Sat
  months: new Array(12).fill(true), // Jan-Dec
  timeStart: "00:00",
  timeEnd: "23:59",
  timeInvert: false,
  excluded: new Set() // IDs of posts manually excluded in preview
};

if (els.tlModeManager) {
  els.tlModeManager.addEventListener("click", () => {
    openManagerModal();
  });
}

if (els.mgrClose) els.mgrClose.addEventListener("click", () => {
  if (els.favManagerModal) els.favManagerModal.style.display = "none";
});

function openManagerModal() {
  if (!els.favManagerModal) return;
  els.favManagerModal.style.display = "flex";
  renderManagerUI();
  updateManagerStats();
}

function renderManagerUI() {
  // 1. Render Days
  if (els.mgrDaysGrid && els.mgrDaysGrid.children.length === 0) {
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    dayNames.forEach((d, i) => {
      const label = document.createElement("label");
      label.className = "btn";
      label.style.textAlign = "center";
      label.style.fontSize = "13px";
      label.innerHTML = `<input type="checkbox" value="${i}" checked> ${d}`;
      label.querySelector("input").addEventListener("change", (e) => {
        mgrState.days[i] = e.target.checked;
        updateManagerStats();
      });
      els.mgrDaysGrid.appendChild(label);
    });
  }

  // 2. Render Months
  if (els.mgrMonthsGrid && els.mgrMonthsGrid.children.length === 0) {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    monthNames.forEach((m, i) => {
      const label = document.createElement("label");
      label.className = "btn";
      label.style.textAlign = "center";
      label.style.fontSize = "13px";
      label.innerHTML = `<input type="checkbox" value="${i}" checked> ${m}`;
      label.querySelector("input").addEventListener("change", (e) => {
        mgrState.months[i] = e.target.checked;
        updateManagerStats();
      });
      els.mgrMonthsGrid.appendChild(label);
    });
  }
}

// Global toggles
if (els.mgrDayAll) els.mgrDayAll.addEventListener("change", (e) => {
  const val = e.target.checked;
  mgrState.days.fill(val);
  els.mgrDaysGrid.querySelectorAll("input").forEach(el => el.checked = val);
  updateManagerStats();
});

if (els.mgrMonthAll) els.mgrMonthAll.addEventListener("change", (e) => {
  const val = e.target.checked;
  mgrState.months.fill(val);
  els.mgrMonthsGrid.querySelectorAll("input").forEach(el => el.checked = val);
  updateManagerStats();
});

// Time inputs
if (els.mgrTimeStart) els.mgrTimeStart.addEventListener("input", (e) => { mgrState.timeStart = e.target.value; updateManagerStats(); });
if (els.mgrTimeEnd) els.mgrTimeEnd.addEventListener("input", (e) => { mgrState.timeEnd = e.target.value; updateManagerStats(); });
if (els.mgrTimeInvert) els.mgrTimeInvert.addEventListener("change", (e) => { mgrState.timeInvert = e.target.checked; updateManagerStats(); });

// Preset: Work Hours
if (els.mgrPresetWork) els.mgrPresetWork.addEventListener("click", () => {
  // Exclude M-F 9-5
  // Set time 09:00 - 17:00, Invert = true
  els.mgrTimeStart.value = "09:00"; mgrState.timeStart = "09:00";
  els.mgrTimeEnd.value = "17:00"; mgrState.timeEnd = "17:00";
  els.mgrTimeInvert.checked = true; mgrState.timeInvert = true;

  // Set days: M-F checked (since we invert time on them? No, logic is intersection).
  // User wants to FAVORITE things that are NOT work.
  // So: Any time on Sat/Sun OR Before 9am M-F OR After 5pm M-F.
  // This logic is tricky with a single filter set.
  // Simplified Preset: "Filter to Work Hours" (M-F 9-5) then user can "Unfavorite".
  // Or "Filter to Non-Work" -> M-F (Invert 9-5) + Sat/Sun (All Day).
  // Our current filter is AND logic (Day Match AND Month Match AND Time Match).
  // Doing "M-F 9-5" is easy. Doing "Not M-F 9-5" is harder with simple AND.

  // Let's implement the request: "Favorite all except 9-5 M-F"
  // This implies: (Sat OR Sun) OR (Mon-Fri AND (Time < 9 OR Time > 5))
  // This is an OR condition. Our UI implies AND.
  // Compromise: Set UI to "M-F, 9-5". User clicks "Unfavorite Matches".
  // Then User clicks "Select All Days, All Times", "Favorite Matches".
  // Wait, that overwrites.

  // Let's just set the UI to catch the "Work" stuff.
  alert("Preset applied: Mon-Fri, 9am-5pm.\\n\\nClick 'Unfavorite Matches' to remove work photos from favorites.");

  // Days: M-F only
  mgrState.days = [false, true, true, true, true, true, false];
  els.mgrDaysGrid.querySelectorAll("input").forEach((el, i) => el.checked = mgrState.days[i]);

  // Time: 9-5, Normal
  els.mgrTimeStart.value = "09:00"; mgrState.timeStart = "09:00";
  els.mgrTimeEnd.value = "17:00"; mgrState.timeEnd = "17:00";
  els.mgrTimeInvert.checked = false; mgrState.timeInvert = false;

  updateManagerStats();
});

function getManagerMatches() {
  if (!posts.length) return [];

  return posts.filter(p => {
    const d = p.date;
    // 1. Day
    if (!mgrState.days[d.getDay()]) return false;

    // 2. Month
    if (!mgrState.months[d.getMonth()]) return false;

    // 3. Time
    const h = d.getHours();
    const m = d.getMinutes();
    const t = h * 60 + m; // minutes from midnight

    const [h1, m1] = mgrState.timeStart.split(":").map(Number);
    const start = h1 * 60 + m1;
    const [h2, m2] = mgrState.timeEnd.split(":").map(Number);
    const end = h2 * 60 + m2;

    const inside = (t >= start && t <= end);
    if (mgrState.timeInvert) {
      if (inside) return false;
    } else {
      if (!inside) return false;
    }

    return true;
  });
}

function updateManagerStats() {
  const matches = getManagerMatches();
  // Clear exclusion if filter changes significantly? No, keep it specific to IDs.
  // Actually, if the user changes filters, the "matches" changes.
  // The excluded set might contain IDs that are no longer matches. That's fine.

  if (els.mgrStats) els.mgrStats.textContent = `Matches: ${matches.length} posts`;

  // If preview is open, re-render it
  if (els.mgrPreviewContainer && els.mgrPreviewContainer.style.display !== "none") {
    renderManagerPreview();
  }
}

// Preview Logic
if (els.mgrShowPreview) els.mgrShowPreview.addEventListener("click", () => {
  if (els.mgrPreviewContainer.style.display === "none") {
    els.mgrPreviewContainer.style.display = "block";
    renderManagerPreview();
    els.mgrShowPreview.textContent = "Hide Preview";
  } else {
    els.mgrPreviewContainer.style.display = "none";
    els.mgrShowPreview.textContent = "👁️ Preview / Edit";
  }
});

if (els.mgrSelectAllPreview) els.mgrSelectAllPreview.addEventListener("click", () => {
  // Clear exclusions
  mgrState.excluded.clear();
  renderManagerPreview();
});

function renderManagerPreview() {
  const matches = getManagerMatches();
  const container = els.mgrPreviewGrid;
  container.innerHTML = "";

  // Sort by date desc
  matches.sort((a, b) => b.date - a.date);

  // Stats
  const effectiveCount = matches.filter(p => !mgrState.excluded.has(postKey(p))).length;
  if (els.mgrPreviewCount) els.mgrPreviewCount.textContent = `(${effectiveCount} selected / ${matches.length} total)`;

  matches.forEach(p => {
    const key = postKey(p);
    const isExcluded = mgrState.excluded.has(key);

    const div = document.createElement("div");
    div.style.position = "relative";
    div.style.aspectRatio = "3/4";
    div.style.cursor = "pointer";
    div.style.borderRadius = "6px";
    div.style.overflow = "hidden";
    div.style.transition = "opacity 0.2s";

    // Dim if excluded
    if (isExcluded) {
      div.style.opacity = "0.4";
      div.style.filter = "grayscale(100%)";
    } else {
      div.style.boxShadow = "0 0 0 2px #4caf50"; // Green selection border
    }

    const img = document.createElement("img");
    img.src = p.backUrl;
    img.loading = "lazy";
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.objectFit = "cover";

    div.appendChild(img);

    // Checkmark overlay
    if (!isExcluded) {
      const badge = document.createElement("div");
      badge.textContent = "✓";
      badge.style.position = "absolute";
      badge.style.top = "4px";
      badge.style.right = "4px";
      badge.style.background = "#4caf50";
      badge.style.color = "white";
      badge.style.borderRadius = "50%";
      badge.style.width = "18px";
      badge.style.height = "18px";
      badge.style.fontSize = "12px";
      badge.style.display = "flex";
      badge.style.alignItems = "center";
      badge.style.justifyContent = "center";
      div.appendChild(badge);
    }

    div.addEventListener("click", () => {
      if (mgrState.excluded.has(key)) {
        mgrState.excluded.delete(key);
      } else {
        mgrState.excluded.add(key);
      }
      renderManagerPreview();
    });

    container.appendChild(div);
  });
}

function getEffectiveMatches() {
  const matches = getManagerMatches();
  return matches.filter(p => !mgrState.excluded.has(postKey(p)));
}

// Bulk Actions
if (els.mgrActionFav) els.mgrActionFav.addEventListener("click", () => {
  const matches = getEffectiveMatches();
  if (!matches.length) { alert("No posts selected."); return; }
  if (!confirm(`Favorite ${matches.length} selected posts?`)) return;

  let count = 0;
  matches.forEach(p => {
    const k = postKey(p);
    const n = getNote(k);
    if (!n.favorite) {
      setNote(k, { favorite: true });
      count++;
    }
  });

  refreshFavoritesUI(); // Update Favorites View
  renderTimeline(posts); // Update Timeline View (stars)
  alert(`Favorited ${count} new posts.`);
});

if (els.mgrActionUnfav) els.mgrActionUnfav.addEventListener("click", () => {
  const matches = getEffectiveMatches();
  if (!matches.length) { alert("No posts selected."); return; }
  if (!confirm(`Unfavorite ${matches.length} selected posts?`)) return;

  let count = 0;
  matches.forEach(p => {
    const k = postKey(p);
    const n = getNote(k);
    if (n.favorite) {
      setNote(k, { favorite: false });
      count++;
    }
  });

  refreshFavoritesUI(); // Update UI
  renderTimeline(posts); // Update Timeline View (stars)
  alert(`Unfavorited ${count} posts.`);
});

// ---------------------------------------------------------
// Fun Stats Section
// ---------------------------------------------------------

// ---------------------------------------------------------
// Fun Stats Section
// ---------------------------------------------------------
// "View Posts" button for busy day
const btnBusy = document.getElementById("stBusyBtn");
if (btnBusy) btnBusy.addEventListener("click", () => {
  const dateStr = btnBusy.getAttribute("data-date"); // YYYY-MM-DD
  if (!dateStr) return;

  // Parse YYYY-MM-DD
  const [y, m, d] = dateStr.split("-").map(Number);

  // Switch to Timeline
  setView("timeline");

  // Set "On This Day" Mode state manually
  tlMode = "onthisday";

  // Update Controls
  if (els.tlModeGrid) { els.tlModeGrid.disabled = false; els.tlModeGrid.classList.remove("active"); }
  if (els.tlModeStrip) { els.tlModeStrip.disabled = false; els.tlModeStrip.classList.remove("active"); }
  if (els.tlModeOnThisDay) {
    els.tlModeOnThisDay.disabled = false; // Keep enabled so user can toggle off if they want
    els.tlModeOnThisDay.classList.add("active");
  }
  if (els.tlOnThisDayControls) els.tlOnThisDayControls.style.display = "flex";

  // Set Values
  if (els.tlMonthPick) {
    els.tlMonthPick.value = String(m);
    // Repopulate days but DO NOT reset to today
    populateDayPick(els.tlDayPick);
  }
  if (els.tlDayPick) els.tlDayPick.value = String(d);

  // Trigger Render
  renderTimeline(posts);
});

// Helper to format YYYY-MM-DD string to "Month Day, Year" in English (Local Time)
const formatYMDPretty = (ymd) => {
  if (!ymd) return "-";
  const [y, m, d] = ymd.split("-").map(Number);
  // Create LOCAL date (noon to start)
  const date = new Date(y, m - 1, d, 12, 0, 0);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
};

// Helper to get YYYY-MM-DD from a post object (Local Time)
const getLocalDateStr = (p) => {
  if (!p || !p.date) return "";
  const y = p.date.getFullYear();
  const m = String(p.date.getMonth() + 1).padStart(2, '0');
  const d = String(p.date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

let currentStats = null;
function renderStats() {
  if (!posts.length) return;
  const stats = calculateStats(posts, friends, comments, realmojiCount, memories);
  currentStats = stats;

  // Helper text
  const safeText = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  // 0. Punctuality
  safeText("stOnTime", `${stats.onTimePercent}%`);
  safeText("stMemoryCount", `${stats.onTimeCount} / ${stats.totalDays}`);
  safeText("stPrimeTime", stats.bestHour !== -1 ? `${stats.bestHour}:00 (${stats.bestHourRate}%)` : "-");
  safeText("stToughTime", stats.worstHour !== -1 ? `${stats.worstHour}:00 (${stats.worstHourRate}%)` : "-");
  safeText("stAvgReaction", stats.medianReactionTime !== 0 ? `${Math.floor(stats.medianReactionTime / 60)}m ${Math.round(stats.medianReactionTime % 60)}s` : "-");
  safeText("stFastestReaction", stats.fastestReaction !== Infinity ? `${Math.floor(stats.fastestReaction / 60)}m ${Math.round(stats.fastestReaction % 60)}s` : "-");

  // 1. Journey
  safeText("stStartDay", formatYMDPretty(stats.firstDateStr));
  safeText("stDuration", stats.durationStr);
  safeText("stTotal", stats.totalPosts.toLocaleString());

  // 2. Streak & Dry Spell
  safeText("stStreak", `${stats.longestStreak} Days`);
  safeText("stStreakDates", stats.longestStreak > 0 ? `${formatYMDPretty(stats.streakStart)} – ${formatYMDPretty(stats.streakEnd)}` : "");
  safeText("stDrySpell", stats.maxGap > 0 ? `${stats.maxGap} Days` : "No Gaps");
  safeText("stDrySpellDates", stats.maxGap > 0 ? `${formatYMDPretty(stats.gapStart)} – ${formatYMDPretty(stats.gapEnd)}` : "");

  // 3. Consistency
  safeText("stPercent", `${stats.percentPosted}%`);
  safeText("stMulti", stats.multiPostDays.toLocaleString());

  // 4. Busiest
  safeText("stBusyCount", stats.busiestDay.count);
  safeText("stBusyDate", formatYMDPretty(stats.busiestDay.date));

  const btnBusy = document.getElementById("stBusyBtn");
  if (btnBusy) btnBusy.setAttribute("data-date", stats.busiestDay.date);

  // 5. Weekly
  safeText("stWeekMost", `${stats.weekMost.day} (${stats.weekMost.count})`);
  safeText("stWeekLeast", `${stats.weekLeast.day} (${stats.weekLeast.count})`);

  // 6. Monthly
  safeText("stMonthMost", `${stats.monthMost.month} (${stats.monthMost.count})`);
  safeText("stMonthLeast", `${stats.monthLeast.month} (${stats.monthLeast.count})`);

  // 7. Time
  safeText("stTimeEarly", stats.timeEarly);
  safeText("stTimeLate", stats.timeLate);
  safeText("stTimePeak", `${stats.hourPeak}:00 - ${stats.hourPeak + 1}:00`);

  // Moment Stats
  safeText("stMomentEarliest", stats.momentEarliest);
  safeText("stMomentLatest", stats.momentLatest);
  safeText("stMomentCommon", stats.momentCommon);

  // 8. NEW: Retakes
  safeText("stRetakeTotal", stats.retakeTotal.toLocaleString());
  safeText("stRetakeMax", stats.retakeMax.toLocaleString());
  safeText("stRetakeAvg", stats.retakeAvg);

  // 9. NEW: Friends
  safeText("stFriendCount", stats.friendCount.toLocaleString());
  safeText("stFriendOldest", stats.oldestFriend.name);
  safeText("stFriendOldestDate", stats.oldestFriend.date ? `Connected since ${formatYMDPretty(stats.oldestFriend.date)}` : "");

  safeText("stFriendNewest", stats.newestFriend.name);
  safeText("stFriendNewestDate", stats.newestFriend.date ? `Met on ${formatYMDPretty(stats.newestFriend.date)}` : "");

  safeText("stFriendYear", stats.friendsThisYear.toLocaleString());
  safeText("stFriendVelocity", stats.friendVelocity !== "0" ? `1 new friend / ${stats.friendVelocity} days` : "N/A");

  // 10. NEW: Social Activity
  safeText("stCommentCount", stats.commentCount.toLocaleString());
  safeText("stRealmojiCount", stats.realmojiCount.toLocaleString());

  // 11. NEW: Habits & Travels
  safeText("stLocCount", stats.uniqueLocations.toLocaleString());
  safeText("stNightOwl", stats.nightOwlPosts.toLocaleString());

  // 12. NEW: Visualizations
  renderCharts(stats);
}

function calculateStats(list, friendList = [], commentList = [], rCount = 0, memoryList = []) {
  // Sort by date
  const sorted = list.slice().sort((a, b) => a.date - b.date);

  if (!sorted.length) return {};

  const first = sorted[0].date;

  // Duration calculation
  const diffTime = Math.abs(new Date() - first);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const years = Math.floor(diffDays / 365);
  const daysRem = diffDays % 365;
  let durStr = `${diffDays} days`;
  if (years > 0) durStr = `${years}y ${daysRem}d`;

  // Aggregation
  const dayCounts = {};
  const dayPostIds = {}; // de-dupe map: YYYY-MM-DD -> Set(postKey)

  // Calendar Metrics
  const weekMap = new Array(7).fill(0);
  // For percentage month stats
  const monthUniqueDays = new Array(12).fill(null).map(() => new Set());

  // Time Metrics (Local Time is better for "When do I post?")
  const hourMap = new Array(24).fill(0);
  let minTime = 24 * 60;
  let maxTime = -1;
  let minTimeStr = "-";
  let maxTimeStr = "-";

  sorted.forEach(p => {
    // 1. Literal Date Stats (LOCAL)
    const k = getLocalDateStr(p);
    const pk = postKey(p); // dedupe key

    if (!dayPostIds[k]) dayPostIds[k] = new Set();
    dayPostIds[k].add(pk);

    // 2. Week/Month Grouping (LOCAL)
    weekMap[p.date.getDay()]++;

    const m = p.date.getMonth();
    monthUniqueDays[m].add(k);

    // 3. Time Analysis (LOCAL)
    const h = p.date.getHours();
    const min = p.date.getMinutes();
    hourMap[h]++;

    const timeVal = h * 60 + min;
    if (timeVal < minTime) {
      minTime = timeVal;
      minTimeStr = `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
    }
    if (timeVal > maxTime) {
      maxTime = timeVal;
      maxTimeStr = `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
    }
  });

  // NEW: Metadata Metrics
  let retakeTotal = 0;
  let retakeMax = 0;
  const locSet = new Set();
  let nightOwlPosts = 0;

  sorted.forEach(p => {
    // Retakes
    const r = p.retakeCounter || 0;
    retakeTotal += r;
    if (r > retakeMax) retakeMax = r;

    // Locations (round to 2 decimals ~1km)
    if (p.location && p.location.latitude != null) {
      const lk = `${p.location.latitude.toFixed(2)},${p.location.longitude.toFixed(2)}`;
      locSet.add(lk);
    }

    // Night Owl (10PM - 4AM local)
    const h = p.date.getHours();
    if (h >= 22 || h < 4) nightOwlPosts++;
  });

  // NEW: Friend Metrics
  let oldestFriend = { name: "None", date: null };
  let newestFriend = { name: "None", date: null };
  let friendsThisYear = 0;
  const currentYear = new Date().getFullYear();

  if (friendList.length > 0) {
    const fSorted = friendList.slice().filter(f => f.createdAt).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    if (fSorted.length > 0) {
      oldestFriend = { name: fSorted[0].friendFullname || fSorted[0].friendUsername, date: new Date(fSorted[0].createdAt).toISOString().split("T")[0] };
      newestFriend = { name: fSorted[fSorted.length - 1].friendFullname || fSorted[fSorted.length - 1].friendUsername, date: new Date(fSorted[fSorted.length - 1].createdAt).toISOString().split("T")[0] };

      friendsThisYear = fSorted.filter(f => new Date(f.createdAt).getFullYear() === currentYear).length;
    }
  }

  const friendVelocity = (friendList.length > 1 && diffDays > 0) ? (diffDays / friendList.length).toFixed(1) : "0";

  // Finalize Day Counts from Sets
  Object.keys(dayPostIds).forEach(k => {
    dayCounts[k] = dayPostIds[k].size;
  });

  const uniqueDays = Object.keys(dayCounts).sort(); // Sorted Strings "YYYY-MM-DD"
  const totalUnique = uniqueDays.length;

  // Percent Posted
  const pct = ((totalUnique / diffDays) * 100).toFixed(1);

  // Multi-post days
  const multi = Object.values(dayCounts).filter(c => c > 1).length;

  // Streak calculation (already de-duped unique days)
  let maxStreak = 0;
  let currentStreak = 0;
  let streakStart = null;
  let streakEnd = null;
  let currentStart = null;

  // Dry Spell calculation (Gap between unique posting days)
  let maxGap = 0;
  let gapStart = null;
  let gapEnd = null;

  for (let i = 0; i < uniqueDays.length; i++) {
    const d = new Date(uniqueDays[i] + 'T00:00:00');

    // Streak logic
    if (i > 0) {
      const prev = new Date(uniqueDays[i - 1] + 'T00:00:00');
      const diffMs = d - prev;
      const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        currentStreak++;
      } else {
        if (currentStreak > maxStreak) {
          maxStreak = currentStreak;
          streakStart = currentStart;
          streakEnd = uniqueDays[i - 1];
        }
        currentStreak = 1;
        currentStart = uniqueDays[i];

        // Dry Spell logic (gap between unique posting days)
        const gap = diffDays - 1;
        if (gap > maxGap) {
          maxGap = gap;
          gapStart = uniqueDays[i - 1];
          gapEnd = uniqueDays[i];
        }
      }
    } else {
      currentStreak = 1;
      currentStart = uniqueDays[0];
    }
  }
  // Don't forget to check the final streak
  if (currentStreak > maxStreak) {
    maxStreak = currentStreak;
    streakStart = currentStart;
    streakEnd = uniqueDays[uniqueDays.length - 1];
  }

  // Busiest Day
  let busyDate = "";
  let busyCount = 0;
  for (const [d, c] of Object.entries(dayCounts)) {
    if (c > busyCount) {
      busyCount = c;
      busyDate = d; // "YYYY-MM-DD"
    }
  }

  // Days in Month Total (for Percentage)
  const daysInMonthTotal = new Array(12).fill(0);
  // Iterate roughly using first/last
  // We need to properly account for LOCAL days.
  // Easiest is to iterate Date objects and check getMonth()
  const cursor = new Date(sorted[0].date);
  const endLoop = new Date(sorted[sorted.length - 1].date);

  // Reset cursor to start of day
  cursor.setHours(0, 0, 0, 0);
  endLoop.setHours(0, 0, 0, 0);

  const maxIter = 100000;
  let iter = 0;
  while (cursor <= endLoop && iter < maxIter) {
    daysInMonthTotal[cursor.getMonth()]++;
    cursor.setDate(cursor.getDate() + 1);
    iter++;
  }

  // Min/Max Week/Month Helpers
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const monthsByName = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const getMinMax = (arr, names) => {
    let maxV = -1, maxI = -1;
    let minV = Infinity, minI = -1;
    arr.forEach((v, i) => {
      if (v > maxV) { maxV = v; maxI = i; }
      if (v < minV && v > 0) { minV = v; minI = i; }
    });
    if (minI === -1) minI = 0;
    return {
      most: { day: names[maxI], count: maxV },
      least: { day: names[minI], count: minV }
    };
  };

  const wStats = getMinMax(weekMap, daysOfWeek);

  // Month Percentage Stats
  let maxMPct = -1, maxMI = -1;
  let minMPct = 101, minMI = -1;
  daysInMonthTotal.forEach((total, i) => {
    if (total === 0) return;
    const unique = monthUniqueDays[i].size;
    const p = Math.round((unique / total) * 100);
    if (p > maxMPct) { maxMPct = p; maxMI = i; }
    if (p < minMPct) { minMPct = p; minMI = i; }
  });
  if (maxMI === -1) maxMI = 0;
  if (minMI === -1) minMI = 0;

  // Peak Hour
  let peakH = 0;
  let peakHC = 0;
  hourMap.forEach((c, h) => {
    if (c > peakHC) { peakHC = c; peakH = h; }
  });

  // BeReal Moment Analysis
  let momentMin = 24 * 60;
  let momentMax = -1;
  let momentMinStr = "-";
  let momentMaxStr = "-";
  const momentHourMap = new Array(24).fill(0);
  let momentPeakH = -1;
  let momentPeakHC = 0;

  memoryList.forEach(m => {
    if (m.berealMoment) {
      const mDate = new Date(m.berealMoment);
      const h = mDate.getHours();
      const min = mDate.getMinutes();
      const timeVal = h * 60 + min;

      momentHourMap[h]++;
      if (timeVal < momentMin) {
        momentMin = timeVal;
        momentMinStr = `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
      }
      if (timeVal > momentMax) {
        momentMax = timeVal;
        momentMaxStr = `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
      }
    }
  });

  momentHourMap.forEach((c, h) => {
    if (c > momentPeakHC) {
      momentPeakHC = c;
      momentPeakH = h;
    }
  });

  return {
    firstDateStr: getLocalDateStr(sorted[0]),
    durationStr: durStr,
    totalPosts: list.length,
    percentPosted: pct,
    multiPostDays: multi,
    longestStreak: maxStreak,
    streakStart,
    streakEnd,
    // NEW
    maxGap,
    gapStart,
    gapEnd,
    busiestDay: { date: busyDate, count: busyCount },
    weekMost: wStats.most,
    weekLeast: wStats.least,
    monthMost: { month: monthsByName[maxMI], count: `${maxMPct}%` },
    monthLeast: { month: monthsByName[minMI], count: `${minMPct}%` },
    timeEarly: minTimeStr,
    timeLate: maxTimeStr,
    hourPeak: peakH,
    // NEW
    retakeTotal,
    retakeMax,
    retakeAvg: (retakeTotal / list.length).toFixed(2),
    uniqueLocations: locSet.size,
    nightOwlPosts,
    // NEW
    friendCount: friendList.length,
    oldestFriend,
    newestFriend,
    friendsThisYear,
    friendVelocity,
    commentCount: commentList.length,
    realmojiCount: rCount,
    // memories (Unique On-Time Days / Total Days)
    ...(() => {
      const onTimeDays = new Set();
      const hourCounts = new Array(24).fill(0);
      const hourOnTime = new Array(24).fill(0);

      const reactions = [];
      let fastestReaction = Infinity;

      memoryList.forEach(m => {
        if (!m.isLate) {
          const day = m.date.split('T')[0];
          onTimeDays.add(day);
        }

        // Punctuality by Hour of berealMoment
        if (m.berealMoment) {
          const mDate = new Date(m.berealMoment);
          const h = mDate.getHours();
          hourCounts[h]++;
          if (!m.isLate) hourOnTime[h]++;

          // Reaction Time (takenTime - berealMoment)
          if (m.takenTime) {
            const diffSeconds = (new Date(m.takenTime) - mDate) / 1000;
            if (diffSeconds > 0) {
              reactions.push(diffSeconds);
              if (diffSeconds < fastestReaction) fastestReaction = diffSeconds;
            }
          }
        }
      });

      const pByHour = hourCounts.map((count, h) => {
        return count > 0 ? Math.round((hourOnTime[h] / count) * 100) : null;
      });

      let bestH = -1, bestRate = -1;
      let worstH = -1, worstRate = 101;

      pByHour.forEach((rate, h) => {
        if (rate !== null) {
          if (rate > bestRate) { bestRate = rate; bestH = h; }
          if (rate < worstRate) { worstRate = rate; worstH = h; }
        }
      });

      // Median Calculation
      let medianReaction = 0;
      if (reactions.length > 0) {
        reactions.sort((a, b) => a - b);
        const mid = Math.floor(reactions.length / 2);
        medianReaction = reactions.length % 2 !== 0 ? reactions[mid] : (reactions[mid - 1] + reactions[mid]) / 2;
      }

      return {
        onTimePercent: diffDays > 0 ? Math.round((onTimeDays.size / diffDays) * 100) : 0,
        onTimeCount: onTimeDays.size,
        totalDays: diffDays,
        pByHour,
        bestHour: bestH,
        bestHourRate: bestRate,
        worstHour: worstH,
        worstHourRate: worstRate === 101 ? -1 : worstRate,
        medianReactionTime: medianReaction,
        fastestReaction
      };
    })(),
    // Data for charts
    weekMap,
    consistencyData: {
      none: diffDays - totalUnique,
      once: Object.values(dayCounts).filter(c => c === 1).length,
      twice: Object.values(dayCounts).filter(c => c === 2).length,
      threePlus: Object.values(dayCounts).filter(c => c >= 3).length
    },
    scatterData: sorted.map(p => ({
      x: p.date.getTime(),
      y: p.date.getHours() * 60 + p.date.getMinutes(),
      post: p
    })),
    monthMap: monthUniqueDays.map((set, i) => ({
      month: monthsByName[i],
      uniqueCount: set.size,
      totalDays: daysInMonthTotal[i] || 31
    })),
    // NEW: Moment Stats
    momentEarliest: momentMinStr,
    momentLatest: momentMaxStr,
    momentCommon: momentPeakH !== -1 ? `${momentPeakH}:00` : "-",
    momentHourMap
  };
}

function renderCharts(stats) {
  const tt = document.getElementById("chartTooltip");
  const ttImg = document.getElementById("ttImg");
  const ttInfo = document.getElementById("ttInfo");
  const ttDate = document.getElementById("ttDate");
  const ttTime = document.getElementById("ttTime");
  const ttGeneric = document.getElementById("ttGeneric");
  const ttLabel = document.getElementById("ttLabel");
  const ttSub = document.getElementById("ttSub");

  const showTT = (x, y, data) => {
    if (!tt) return;
    tt.style.display = "flex";
    tt.style.left = x + "px";
    tt.style.top = y + "px";

    if (data.img) {
      ttImg.style.display = "block";
      ttImg.src = data.img;
    } else {
      ttImg.style.display = "none";
    }

    if (data.date) {
      ttInfo.style.display = "block";
      ttDate.textContent = data.date;
      ttTime.textContent = data.time || "";
    } else {
      ttInfo.style.display = "none";
    }

    if (data.label) {
      ttGeneric.style.display = "block";
      ttLabel.textContent = data.label;
      ttSub.textContent = data.sub || "";
    } else {
      ttGeneric.style.display = "none";
    }
  };

  const hideTT = () => { if (tt) tt.style.display = "none"; };

  // Helper for responsive canvas setup and event binding
  const setupChart = (id, pointsAttr) => {
    const el = document.getElementById(id);
    if (!el) return null;
    const ctx = el.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const rect = el.getBoundingClientRect();
    el.width = rect.width * dpr;
    el.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    el._points = [];
    if (!el._hasTT) {
      el._hasTT = true;
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const mx = e.clientX - r.left;
        const my = e.clientY - r.top;
        let found = null;
        for (const p of el._points || []) {
          if (p.isRect) {
            if (mx >= p.x && mx <= p.x + p.w && my >= p.y && my <= p.y + p.h) { found = p; break; }
          } else if (p.isSlice) {
            const dx = mx - p.cx;
            const dy = my - p.cy;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx);
            let normAngle = angle < -Math.PI / 2 ? angle + Math.PI * 2 : angle;
            if (dist <= p.r && normAngle >= p.start && normAngle <= p.end) { found = p; break; }
          } else {
            const dx = mx - p.x;
            const dy = my - p.y;
            if (Math.sqrt(dx * dx + dy * dy) < 10) { found = p; break; }
          }
        }
        if (found) showTT(r.left + (found.ttX || found.x), r.top + (found.ttY || found.y), found.data);
        else hideTT();
      });
      el.addEventListener("mouseleave", hideTT);
    }
    return { ctx, W: rect.width, H: rect.height, el };
  };

  // 1. Consistency Pie Chart
  const pie = setupChart("chartConsistency");
  if (pie) {
    const { ctx, W, H, el } = pie;
    const data = [
      { label: "Missed", val: stats.consistencyData.none, col: "#222" },
      { label: "1 Post", val: stats.consistencyData.once, col: "#c5a059" },
      { label: "2 Posts", val: stats.consistencyData.twice, col: "#eac784" },
      { label: "3+ Posts", val: stats.consistencyData.threePlus, col: "#fff" }
    ].filter(d => d.val > 0);
    const total = data.reduce((acc, d) => acc + d.val, 0);
    let startAngle = -Math.PI / 2;
    const centerX = W / 2 - 40;
    const centerY = H / 2;
    const radius = Math.min(centerX, centerY) - 15;
    data.forEach(d => {
      const sliceAngle = (d.val / total) * Math.PI * 2;
      ctx.fillStyle = d.col;
      ctx.beginPath(); ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
      ctx.closePath(); ctx.fill();
      el._points.push({ isSlice: true, cx: centerX, cy: centerY, r: radius, start: startAngle, end: startAngle + sliceAngle, ttX: centerX, ttY: centerY - 20, data: { label: d.label, sub: `${d.val} days (${Math.round(d.val / total * 100)}%)` } });
      startAngle += sliceAngle;
    });
    ctx.textAlign = "left"; ctx.font = "11px sans-serif";
    data.forEach((d, i) => {
      const ty = centerY - (data.length * 10) + i * 20;
      ctx.fillStyle = d.col; ctx.fillRect(W - 75, ty - 8, 12, 12);
      ctx.fillStyle = "#ccc"; ctx.fillText(`${d.label}: ${d.val}`, W - 58, ty + 2);
    });
  }

  // 2. Punctuality by Hour Chart
  const punct = setupChart("chartPunctuality");
  if (punct && stats.pByHour) {
    const { ctx, W, H, el } = punct;
    const data = stats.pByHour;
    const padding = 30;
    const chartW = W - padding * 1.5;
    const chartH = H - padding * 2;
    ctx.strokeStyle = "#444"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(padding, padding); ctx.lineTo(padding + chartW, padding);
    ctx.moveTo(padding, padding + chartH); ctx.lineTo(padding + chartW, padding + chartH); ctx.stroke();
    ctx.strokeStyle = "#c5a059"; ctx.lineWidth = 2; ctx.beginPath();
    let firstSet = false;
    data.forEach((rate, h) => {
      if (rate !== null) {
        const x = padding + (h / 23) * chartW;
        const y = padding + chartH - (rate / 100) * chartH;
        if (!firstSet) { ctx.moveTo(x, y); firstSet = true; } else ctx.lineTo(x, y);
        el._points.push({ x, y, data: { label: `${h}:00 - ${h + 1}:00`, sub: `${Math.round(rate)}% On Time` } });
      }
    });
    ctx.stroke();
    ctx.fillStyle = "#888"; ctx.font = "9px sans-serif"; ctx.textAlign = "center";
    ctx.fillText("12 AM", padding, H - 10); ctx.fillText("12 PM", padding + chartW / 2, H - 10); ctx.fillText("11 PM", padding + chartW, H - 10);
    ctx.textAlign = "right"; ctx.fillText("100%", padding - 5, padding + 3); ctx.fillText("0%", padding - 5, padding + chartH + 3);
  }

  // 3. Monthly Heatmap
  const heat = setupChart("chartMonthHeatmap");
  if (heat) {
    const { ctx, W, H, el } = heat;
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const blockW = W / 6;
    const blockH = H / 2;
    stats.monthMap.forEach((m, i) => {
      const col = i % 6, row = Math.floor(i / 6);
      const x = col * blockW, y = row * blockH;
      const intensity = m.uniqueCount / 31;
      ctx.fillStyle = `rgba(197, 160, 89, ${0.1 + intensity * 0.9})`; // Gold heatmap
      ctx.fillRect(x + 2, y + 2, blockW - 4, blockH - 4);
      ctx.fillStyle = intensity > 0.5 ? "#000" : "#fff"; // Contrast text on gold/dark
      ctx.font = "10px sans-serif"; ctx.textAlign = "center";
      ctx.fillText(monthNames[i], x + blockW / 2, y + blockH / 2 + 4);
      // Finding a representative BeReal for the month (a favorite if possible)
      const yr = new Date().getFullYear(); // Or parse from posts, current year is fine
      const monthPrefix = `${yr}-${String(i + 1).padStart(2, '0')}`;
      const monthPosts = posts.filter(p => p.date.getMonth() === i);
      const fav = monthPosts.find(p => getNote(postKey(p)).favorite) || monthPosts[0];
      el._points.push({ isRect: true, x, y, w: blockW, h: blockH, data: { label: m.month, sub: `${m.uniqueCount} active days`, img: fav ? (fav.backUrl || fav.frontUrl) : null } });
    });
  }

  // 4. Time Machine Scatter Plot
  const scatter = setupChart("chartScatter");
  if (scatter) {
    const { ctx, W, H, el } = scatter;
    if (stats.scatterData.length > 0) {
      const minX = stats.scatterData[0].x, maxX = stats.scatterData[stats.scatterData.length - 1].x, rangeX = maxX - minX || 1;
      ctx.fillStyle = "rgba(197, 160, 89, 0.6)"; // Gold scatter points
      stats.scatterData.forEach(pData => {
        const x = 50 + ((pData.x - minX) / rangeX) * (W - 70);
        const y = 30 + (pData.y / 1440) * (H - 60);
        el._points.push({ x, y, data: { date: pData.post.date.toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' }), time: pData.post.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), img: pData.post.backUrl || pData.post.frontUrl } });
        ctx.beginPath(); ctx.arc(x, y, 2.5, 0, Math.PI * 2); ctx.fill();
      });
      ctx.fillStyle = "#888"; ctx.font = "10px sans-serif"; ctx.textAlign = "right";
      ctx.fillText("12 AM", 40, 33); ctx.fillText("12 PM", 40, H / 2 + 3); ctx.fillText("12 AM", 40, H - 27);
    }
  }

  // 5. Weekly Bar Chart
  const weekly = setupChart("chartWeekly");
  if (weekly) {
    const { ctx, W, H, el } = weekly;
    const maxVal = Math.max(...stats.weekMap, 1);
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const barW = (W - 80) / 7;
    stats.weekMap.forEach((v, i) => {
      const barH = (v / maxVal) * (H - 60);
      const x = 40 + i * barW, y = H - 30 - barH;
      ctx.fillStyle = "#c5a059"; ctx.fillRect(x + 10, y, barW - 20, barH);
      ctx.fillStyle = "#888"; ctx.font = "10px sans-serif"; ctx.textAlign = "center";
      ctx.fillText(dayNames[i], x + barW / 2, H - 15);
      if (v > 0) ctx.fillText(v, x + barW / 2, y - 5);
      el._points.push({ isRect: true, x: x + 10, y, w: barW - 20, h: barH, data: { label: dayNames[i], sub: `${v} posts on this day` } });
    });
  }

  // 12. BeReal Moment Times Distribution
  const moments = setupChart("chartMomentTimes");
  if (moments) {
    const { ctx, W, H, el } = moments;
    const maxVal = Math.max(...stats.momentHourMap, 1);
    const barW = (W - 80) / 24;

    stats.momentHourMap.forEach((v, h) => {
      const barH = (v / maxVal) * (H - 60);
      const x = 40 + h * barW;
      const y = H - 30 - barH;

      ctx.fillStyle = "#c5a059";
      ctx.globalAlpha = 0.8;
      ctx.fillRect(x + 1, y, barW - 2, barH);
      ctx.globalAlpha = 1.0;

      // Every 4 hours show a label
      if (h % 4 === 0) {
        ctx.fillStyle = "#888";
        ctx.font = "9px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(`${h}:00`, x + barW / 2, H - 15);
      }

      el._points.push({
        isRect: true, x: x + 1, y, w: barW - 2, h: barH,
        data: { label: `${h}:00`, sub: `${v} BeReal Moments` }
      });
    });
  }
}

window.addEventListener("resize", () => {
  if (els.views.stats && els.views.stats.style.display !== "none" && currentStats) {
    renderCharts(currentStats);
  }
});
