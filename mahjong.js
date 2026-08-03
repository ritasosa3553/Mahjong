(() => {
  "use strict";

  /* ============================================================
     CONFIGURACIÓN
  ============================================================ */

  const FAMILIES = [
    { name: "Frutas",     chars: false, color: "#22c55e", symbols: ["🍎", "🍌", "🍇", "🍓", "🍉", "🍋", "🍒", "🍑", "🥝"] },
    { name: "Animales",   chars: false, color: "#f97316", symbols: ["🐶", "🐱", "🐼", "🐸", "🦊", "🐵", "🐻", "🐰", "🐯"] },
    { name: "Postres",    chars: false, color: "#ec4899", symbols: ["🍩", "🍪", "🧁", "🍫", "🍦", "🍰", "🍮", "🍯", "🍭"] },
    { name: "Objetos",    chars: false, color: "#8b5cf6", symbols: ["⭐", "❤️", "☀️", "🌙", "🔔", "🎲", "💎", "🎯", "🚀"] },
    { name: "Vientos y Dragones", chars: true, color: "#ef4444", symbols: ["東", "南", "西", "北", "中", "發", "白", "春", "冬"] },
    { name: "Números Chinos",     chars: true, color: "#3b82f6", symbols: ["一", "二", "三", "四", "五", "六", "七", "八", "九"] }
  ];

  /* Conjunto por defecto (la selección original aprobada). */
  const DEFAULT_SELECTION = [
    "🍎", "🍌", "🍇", "🍓", "🍉", "🍋",
    "🐶", "🐱", "🐼", "🐸", "🦊", "🐵",
    "🍩", "🍪", "🧁", "🍫", "🍦", "🍰",
    "⭐", "❤️", "☀️", "🌙", "🔔", "🎲",
    "東", "南", "西", "北", "中", "白",
    "一", "二", "三", "四", "五", "六"
  ];

  /* Índice plano de todos los símbolos disponibles + mapa símbolo -> info. */
  const ALL_SYMBOLS = [];
  const SYMBOL_INFO = new Map();
  FAMILIES.forEach((f, fi) => {
    f.symbols.forEach(s => {
      ALL_SYMBOLS.push({ s: s, chars: f.chars, color: f.color, family: fi });
      SYMBOL_INFO.set(s, { chars: f.chars, color: f.color, family: fi });
    });
  });

  /* Símbolos elegidos para la partida actual (strings). */
  let currentSymbols = [...DEFAULT_SELECTION];
  let pickerSel = new Set(DEFAULT_SELECTION);

  /* Layout tortuga clásico: [col, fila, capa]. Cols 0-14 (paso 2), filas 0-28 (paso 2). */
  const TURTLE = [
    [7,0,0],
    [0,2,0],[6,2,0],[8,2,0],[14,2,0],
    [0,4,0],[4,4,0],[6,4,0],[8,4,0],[10,4,0],[14,4,0],
    [0,6,0],[2,6,0],[4,6,0],[6,6,0],[8,6,0],[10,6,0],[12,6,0],[14,6,0],
    [0,8,0],[2,8,0],[4,8,0],[6,8,0],[8,8,0],[10,8,0],[12,8,0],[14,8,0],
    [2,8,1],[4,8,1],[6,8,1],[8,8,1],[10,8,1],[12,8,1],
    [0,10,0],[2,10,0],[4,10,0],[6,10,0],[8,10,0],[10,10,0],[12,10,0],[14,10,0],
    [2,10,1],[4,10,1],[6,10,1],[8,10,1],[10,10,1],[12,10,1],
    [4,10,2],[6,10,2],[8,10,2],[10,10,2],
    [0,12,0],[2,12,0],[4,12,0],[6,12,0],[8,12,0],[10,12,0],[12,12,0],[14,12,0],
    [2,12,1],[4,12,1],[6,12,1],[8,12,1],[10,12,1],[12,12,1],
    [4,12,2],[6,12,2],[8,12,2],[10,12,2],
    [6,12,3],[8,12,3],
    [7,13,4],
    [0,14,0],[2,14,0],[4,14,0],[6,14,0],[8,14,0],[10,14,0],[12,14,0],[14,14,0],
    [2,14,1],[4,14,1],[6,14,1],[8,14,1],[10,14,1],[12,14,1],
    [4,14,2],[6,14,2],[8,14,2],[10,14,2],
    [6,14,3],[8,14,3],
    [0,16,0],[2,16,0],[4,16,0],[6,16,0],[8,16,0],[10,16,0],[12,16,0],[14,16,0],
    [2,16,1],[4,16,1],[6,16,1],[8,16,1],[10,16,1],[12,16,1],
    [4,16,2],[6,16,2],[8,16,2],[10,16,2],
    [0,18,0],[2,18,0],[4,18,0],[6,18,0],[8,18,0],[10,18,0],[12,18,0],[14,18,0],
    [2,18,1],[4,18,1],[6,18,1],[8,18,1],[10,18,1],[12,18,1],
    [0,20,0],[2,20,0],[4,20,0],[6,20,0],[8,20,0],[10,20,0],[12,20,0],[14,20,0],
    [0,22,0],[4,22,0],[6,22,0],[8,22,0],[10,22,0],[14,22,0],
    [0,24,0],[6,24,0],[8,24,0],[14,24,0],
    [7,26,0],
    [7,28,0]
  ];

  const SAVE_KEY = "mahjong_save";
  const THEME_KEY = "mahjong_theme";
  const MUTE_KEY = "mahjong_muted";
  const ZOOM_KEY = "mahjong_zoom";
  const SELECTION_KEY = "mahjong_selection";

  /* ============================================================
     ESTADO
  ============================================================ */

  const state = {
    tiles: [],          // { id, symbol, col, row, layer, removed }
    map: new Map(),     // "col,row,layer" -> tile
    history: [],        // [{ a: id, b: id }]
    selectedId: null,
    elapsed: 0,
    started: false,
    running: false,
    shuffles: 0,
    muted: false,
    zoom: 1.15,
    timerId: null,
    hintTimeout: null
  };

  /* ============================================================
     DOM
  ============================================================ */

  const $ = (id) => document.getElementById(id);
  const boardEl = $("board");
  const wrapEl = $("board-wrap");
  const statPairs = $("stat-pairs");
  const statTime = $("stat-time");
  const statShuffles = $("stat-shuffles");
  const btnNew = $("btn-new");
  const btnUndo = $("btn-undo");
  const btnShuffle = $("btn-shuffle");
  const btnHint = $("btn-hint");
  const btnSave = $("btn-save");
  const btnLoad = $("btn-load");
  const btnSound = $("btn-sound");
  const btnZoomOut = $("btn-zoom-out");
  const btnZoomIn = $("btn-zoom-in");
  const zoomLabel = $("zoom-label");
  const themeSelect = $("theme-select");
  const winOverlay = $("win-overlay");
  const winTime = $("win-time");
  const winShuffles = $("win-shuffles");
  const toastEl = $("toast");
  const legendContent = $("legend-content");
  const pickerOverlay = $("picker-overlay");
  const pickerSymbols = $("picker-symbols");
  const pickerCount = $("picker-count");
  const btnPickerAll = $("btn-picker-all");
  const btnPickerNone = $("btn-picker-none");
  const btnPickerCancel = $("btn-picker-cancel");
  const btnPickerStart = $("btn-picker-start");
  const toolbar = document.querySelector(".toolbar");
  const btnMenuToggle = $("btn-menu-toggle");

  /* ============================================================
     UTILIDADES
  ============================================================ */

  function keyOf(t) { return t.col + "," + t.row + "," + t.layer; }

  function randInt(n) { return Math.floor(Math.random() * n); }

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = randInt(i + 1);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  /* Pool de 72 pares repartidos entre los símbolos elegidos para la partida. */
  function buildPairPool() {
    const pool = [];
    const n = currentSymbols.length;
    for (let i = 0; i < 72; i++) pool.push(currentSymbols[i % n]);
    shuffle(pool);
    return pool;
  }

  /* ============================================================
     LÓGICA DE FICHA LIBRE
  ============================================================ */

  function isFreeTile(tile) {
    const above = state.map.get(tile.col + "," + tile.row + "," + (tile.layer + 1));
    if (above && !above.removed) return false;
    const left = state.map.get((tile.col - 2) + "," + tile.row + "," + tile.layer);
    const right = state.map.get((tile.col + 2) + "," + tile.row + "," + tile.layer);
    return (!left || left.removed) || (!right || right.removed);
  }

  /* Versión para el algoritmo de reparto: dado un conjunto de posiciones ocupadas. */
  function isFreeIn(positions, key) {
    const [c, r, l] = key.split(",").map(Number);
    if (positions.has(c + "," + r + "," + (l + 1))) return false;
    const left = positions.has((c - 2) + "," + r + "," + l);
    const right = positions.has((c + 2) + "," + r + "," + l);
    return !left || !right;
  }

  /* ============================================================
     REPARTO GARANTIZADO-SOLUCIONABLE
     Construye un plan de retirada: en cada paso toma 2 fichas
     libres y les asigna el mismo símbolo. Al jugar en orden,
     cada par es libre en ese momento -> siempre ganable.
  ============================================================ */

  function buildPlan(positions) {
    const remaining = new Set(positions);
    const keys = [...positions];
    const plan = [];
    let budget = 500000;

    function freeList() {
      const f = [];
      for (let i = 0; i < keys.length; i++) {
        if (isFreeIn(remaining, keys[i])) f.push(keys[i]);
      }
      return f;
    }

    function drop(a, b) {
      remaining.delete(a);
      remaining.delete(b);
      const nk = [];
      for (let i = 0; i < keys.length; i++) {
        if (keys[i] !== a && keys[i] !== b) nk.push(keys[i]);
      }
      keys.length = 0;
      keys.push(...nk);
    }

    function add(a, b) {
      remaining.add(a);
      remaining.add(b);
      keys.push(a, b);
    }

    function dfs() {
      if (--budget <= 0) return false;
      if (keys.length === 0) return true;
      const f = freeList();
      if (f.length < 2) return false;
      shuffle(f);
      for (let i = 0; i < f.length - 1; i++) {
        for (let j = i + 1; j < f.length; j++) {
          const a = f[i], b = f[j];
          drop(a, b);
          plan.push({ a: a, b: b });
          if (dfs()) return true;
          plan.pop();
          add(a, b);
        }
      }
      return false;
    }

    if (dfs()) return plan;
    return null;
  }

  function dealPositions(positions, maxAttempts) {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const plan = buildPlan(positions);
      if (plan) return plan;
    }
    return null;
  }

  /* ============================================================
     CREAR / RENDERIZAR TABLERO
  ============================================================ */

  function newGame() {
    stopTimer();
    state.tiles = [];
    state.map.clear();
    state.history = [];
    state.selectedId = null;
    state.elapsed = 0;
    state.started = false;
    state.running = false;
    state.shuffles = 0;

    const positions = TURTLE.map(p => p.join(","));
    const plan = dealPositions(positions, 30);

    if (!plan) {
      toast("No se pudo generar el tablero, intenta de nuevo.");
      return;
    }

    const assignments = {};
    const pairPool = buildPairPool();
    for (const m of plan) {
      const sym = pairPool.pop();
      assignments[m.a] = sym;
      assignments[m.b] = sym;
    }

    boardEl.innerHTML = "";
    let id = 0;
    for (const p of TURTLE) {
      const [col, row, layer] = p;
      const tile = {
        id: id++,
        symbol: assignments[col + "," + row + "," + layer],
        col: col, row: row, layer: layer,
        removed: false,
        el: null
      };
      state.tiles.push(tile);
      state.map.set(keyOf(tile), tile);

      const el = document.createElement("div");
      el.className = "tile";
      el.dataset.id = tile.id;
      el.addEventListener("click", () => onTileClick(tile));
      el.innerHTML = '<span class="face"></span><span class="bar"></span>';
      tile.el = el;
      boardEl.appendChild(el);
    }

    hideWinOverlay();
    applySymbols();
    recomputeFree();
    if (isMobile()) {
      toolbar.classList.add("menu-collapsed");
      updateMenuIcon();
    }
    layoutBoard();
    updateStats();
    render();
    buildLegend();
  }

  function applySymbols() {
    for (const t of state.tiles) {
      const info = SYMBOL_INFO.get(t.symbol);
      const face = t.el.querySelector(".face");
      face.textContent = t.symbol;
      t.el.classList.toggle("chinese", info.chars);
      t.el.classList.remove("f0", "f1", "f2", "f3", "f4", "f5");
      t.el.classList.add("f" + info.family);
      t.el.style.setProperty("--fc", info.color);
    }
  }

  function recomputeFree() {
    for (const t of state.tiles) {
      t.free = !t.removed && isFreeTile(t);
    }
  }

  /* ============================================================
     LAYOUT / REDIMENSIONADO
  ============================================================ */

  function layoutBoard() {
    const pad = 18;
    const availW = Math.max(200, wrapEl.clientWidth - pad * 2);
    const availH = Math.max(200, wrapEl.clientHeight - pad * 2);

    let cw = 0, ch = 0;
    for (const t of state.tiles) {
      const w = t.col / 2 + t.layer / 2 + 1;
      const h = t.row / 2 + t.layer / 2 + 1;
      if (w > cw) cw = w;
      if (h > ch) ch = h;
    }

    let tw = availW / cw;
    let th = tw * 1.32;
    if (ch * th > availH) {
      th = availH / ch;
      tw = th / 1.32;
    }

    tw *= state.zoom;
    th *= state.zoom;

    boardEl.style.width = (cw * tw) + "px";
    boardEl.style.height = (ch * th) + "px";

    for (const t of state.tiles) {
      const x = t.col * (tw / 2) + t.layer * (tw / 2);
      const y = t.row * (th / 2) + t.layer * (th / 2);
      const info = SYMBOL_INFO.get(t.symbol);
      t.el.style.left = x + "px";
      t.el.style.top = y + "px";
      t.el.style.width = tw + "px";
      t.el.style.height = th + "px";
      t.el.style.fontSize = (info.chars ? tw * 0.52 : tw * 0.6) + "px";
      t.el.style.zIndex = 10 + t.layer * 100 + t.row;
      t.el.style.setProperty("--layer-shadow",
        t.layer > 0 ? "0 " + (t.layer * 2 + 3) + "px " + (t.layer * 2 + 6) + "px rgba(0,0,0,0.25)" : "");
    }
  }

  function render() {
    for (const t of state.tiles) {
      t.el.classList.toggle("removed", t.removed);
      t.el.classList.toggle("free", t.free && !t.removed);
      t.el.classList.toggle("blocked", !t.free && !t.removed);
      t.el.classList.toggle("selected", t.id === state.selectedId && !t.removed);
    }
    updateStats();
  }

  function updateStats() {
    const remaining = state.tiles.filter(t => !t.removed).length;
    statPairs.textContent = (remaining / 2) + "/72";
    statShuffles.textContent = state.shuffles;
  }

  /* ============================================================
     ACCIONES DEL JUGADOR
  ============================================================ */

  function onTileClick(tile) {
    if (tile.removed || !tile.free) return;
    ensureAudio();
    clickSound();

    if (state.selectedId === null) {
      state.selectedId = tile.id;
    } else if (state.selectedId === tile.id) {
      state.selectedId = null;
    } else {
      const sel = state.tiles.find(t => t.id === state.selectedId);
      if (sel && sel.symbol === tile.symbol) {
        removePair(sel, tile);
        return;
      } else {
        state.selectedId = tile.id;
      }
    }
    render();
  }

  function removePair(a, b) {
    a.removed = true;
    b.removed = true;
    state.history.push({ a: a.id, b: b.id });
    state.selectedId = null;

    if (!state.started) { state.started = true; state.running = true; startTimer(); }
    matchSound();

    recomputeFree();
    render();
    updateStats();

    const remaining = state.tiles.filter(t => !t.removed).length;
    if (remaining === 0) {
      win();
    } else {
      scheduleNoMoveCheck();
    }
  }

  function undo() {
    if (state.history.length === 0) {
      toast("No hay movimientos que deshacer.");
      return;
    }
    ensureAudio();
    const last = state.history.pop();
    const a = state.tiles.find(t => t.id === last.a);
    const b = state.tiles.find(t => t.id === last.b);
    a.removed = false;
    b.removed = false;
    state.selectedId = null;
    undoSound();
    hideWinOverlay();
    recomputeFree();
    render();
    updateStats();
    if (state.running) startTimer();
    clearHint();
  }

  function shuffleRemaining() {
    ensureAudio();
    const remainingTiles = state.tiles.filter(t => !t.removed);
    if (remainingTiles.length === 0) {
      toast("No hay fichas que barajar.");
      return;
    }
    const positions = remainingTiles.map(t => keyOf(t));
    const plan = dealPositions(positions, 30);
    if (!plan) {
      toast("No se pudo barajar, intenta de nuevo.");
      return;
    }
    const assignments = {};
    const pairPool = buildPairPool();
    for (const m of plan) {
      const sym = pairPool.pop();
      assignments[m.a] = sym;
      assignments[m.b] = sym;
    }
    for (const t of remainingTiles) {
      t.symbol = assignments[keyOf(t)];
    }
    state.history = [];
    state.selectedId = null;
    state.shuffles++;
    shuffleSound();
    applySymbols();
    recomputeFree();
    render();
    updateStats();
    clearHint();
    toast("Tablero barajado.");
  }

  function hint() {
    if (state.tiles.every(t => t.removed)) return;
    recomputeFree();
    const freeTiles = state.tiles.filter(t => t.free && !t.removed);
    const groups = {};
    for (const t of freeTiles) {
      (groups[t.symbol] = groups[t.symbol] || []).push(t);
    }
    const candidates = Object.values(groups).filter(g => g.length >= 2);
    if (candidates.length === 0) {
      autoShuffle();
      return;
    }
    ensureAudio();
    const pair = candidates[randInt(candidates.length)].slice(0, 2);
    state.selectedId = null;
    clearHint();
    pair.forEach(t => t.el.classList.add("hint"));
    hintSound();
    state.hintTimeout = setTimeout(() => {
      pair.forEach(t => t.el.classList.remove("hint"));
      state.hintTimeout = null;
    }, 1600);
    render();
  }

  function clearHint() {
    if (state.hintTimeout) {
      clearTimeout(state.hintTimeout);
      state.hintTimeout = null;
    }
    document.querySelectorAll(".tile.hint").forEach(el => el.classList.remove("hint"));
  }

  function hasMoves() {
    recomputeFree();
    const freeTiles = state.tiles.filter(t => t.free && !t.removed);
    const seen = new Set();
    for (const t of freeTiles) {
      if (seen.has(t.symbol)) return true;
      seen.add(t.symbol);
    }
    return false;
  }

  let noMoveTimer = null;
  function scheduleNoMoveCheck() {
    clearTimeout(noMoveTimer);
    noMoveTimer = setTimeout(() => {
      if (state.tiles.some(t => !t.removed) && !hasMoves()) {
        autoShuffle();
      }
    }, 400);
  }

  function autoShuffle() {
    toast("Sin movimientos disponibles. Barajando…");
    shuffleRemaining();
  }

  /* ============================================================
     VICTORIA
  ============================================================ */

  function win() {
    stopTimer();
    state.running = false;
    clearHint();
    winTime.textContent = "Tiempo: " + formatTime(state.elapsed);
    winShuffles.textContent = "Barajadas: " + state.shuffles;
    showWinOverlay();
    winSound();
    confetti();
  }

  function showWinOverlay() { winOverlay.classList.remove("hidden"); }
  function hideWinOverlay() { winOverlay.classList.add("hidden"); }

  function confetti() {
    const colors = ["#ef4444", "#f97316", "#facc15", "#22c55e", "#3b82f6", "#8b5cf6", "#ec4899"];
    for (let i = 0; i < 70; i++) {
      const d = document.createElement("div");
      d.className = "confetti";
      d.style.left = Math.random() * 100 + "vw";
      d.style.background = colors[randInt(colors.length)];
      d.style.width = 6 + Math.random() * 8 + "px";
      d.style.height = 10 + Math.random() * 10 + "px";
      d.style.animationDuration = 2.2 + Math.random() * 2.5 + "s";
      d.style.animationDelay = Math.random() * 1.5 + "s";
      winOverlay.appendChild(d);
      setTimeout(() => d.remove(), 6000);
    }
  }

  /* ============================================================
     TEMPORIZADOR
  ============================================================ */

  function formatTime(s) {
    const m = String(Math.floor(s / 60)).padStart(2, "0");
    const ss = String(s % 60).padStart(2, "0");
    return m + ":" + ss;
  }

  function startTimer() {
    stopTimer();
    state.timerId = setInterval(() => {
      state.elapsed++;
      statTime.textContent = formatTime(state.elapsed);
    }, 1000);
  }

  function stopTimer() {
    if (state.timerId) {
      clearInterval(state.timerId);
      state.timerId = null;
    }
  }

  /* ============================================================
     SONIDO (Web Audio)
  ============================================================ */

  let audioCtx = null;

  function ensureAudio() {
    if (!audioCtx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) audioCtx = new AC();
    }
    if (audioCtx && audioCtx.state === "suspended") audioCtx.resume();
  }

  function tone(freq, dur, type, gain, delay) {
    if (state.muted || !audioCtx) return;
    const t0 = audioCtx.currentTime + (delay || 0);
    const osc = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    osc.type = type || "sine";
    osc.frequency.setValueAtTime(freq, t0);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain || 0.12, t0 + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g);
    g.connect(audioCtx.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  }

  function clickSound() { tone(520, 0.05, "triangle", 0.08); }
  function matchSound() { tone(523, 0.09, "sine", 0.12); tone(784, 0.12, "sine", 0.1, 0.07); }
  function undoSound() { tone(330, 0.09, "sine", 0.1); }
  function shuffleSound() { for (let i = 0; i < 5; i++) tone(300 + i * 120, 0.06, "square", 0.05, i * 0.05); }
  function hintSound() { tone(660, 0.1, "sine", 0.1); tone(880, 0.12, "sine", 0.1, 0.08); }
  function winSound() {
    const notes = [523, 659, 784, 1047];
    notes.forEach((f, i) => tone(f, 0.25, "sine", 0.14, i * 0.16));
  }

  /* ============================================================
     GUARDAR / CARGAR
  ============================================================ */

  function saveGame() {
    if (state.tiles.length === 0) { toast("No hay partida en curso."); return; }
    const data = {
      v: 1,
      tiles: state.tiles.map(t => ({ s: t.symbol, c: t.col, r: t.row, l: t.layer, d: t.removed ? 1 : 0 })),
      sel: state.selectedId,
      hist: state.history.map(h => ({ a: h.a, b: h.b })),
      elapsed: state.elapsed,
      started: state.started ? 1 : 0,
      shuffles: state.shuffles
    };
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(data));
      toast("Partida guardada.");
    } catch (e) {
      toast("Error al guardar la partida.");
    }
  }

  function loadGame() {
    let data;
    try {
      data = JSON.parse(localStorage.getItem(SAVE_KEY));
    } catch (e) { data = null; }
    if (!data || !data.tiles || data.tiles.length === 0) {
      toast("No hay partida guardada.");
      return;
    }
    stopTimer();
    boardEl.innerHTML = "";
    state.tiles = [];
    state.map.clear();
    state.history = data.hist.map(h => ({ a: h.a, b: h.b }));
    state.selectedId = data.sel;
    state.elapsed = data.elapsed || 0;
    state.started = !!data.started;
    state.shuffles = data.shuffles || 0;
    statTime.textContent = formatTime(state.elapsed);

    let id = 0;
    for (const t of data.tiles) {
      const tile = {
        id: id++,
        symbol: t.s,
        col: t.c, row: t.r, layer: t.l,
        removed: !!t.d,
        el: null
      };
      state.tiles.push(tile);
      state.map.set(keyOf(tile), tile);
      const el = document.createElement("div");
      el.className = "tile";
      el.dataset.id = tile.id;
      el.addEventListener("click", () => onTileClick(tile));
      el.innerHTML = '<span class="face"></span><span class="bar"></span>';
      tile.el = el;
      boardEl.appendChild(el);
    }

    applySymbols();
    recomputeFree();
    layoutBoard();
    render();
    updateStats();
    hideWinOverlay();
    clearHint();
    currentSymbols = [...new Set(state.tiles.map(t => t.symbol))];
    buildLegend();
    state.running = state.started && state.tiles.some(t => !t.removed);
    if (state.running) startTimer();
    toast("Partida cargada.");
  }

  /* ============================================================
     UI / TOAST / TEMA
  ============================================================ */

  let toastTimer = null;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2200);
  }

  function setTheme(name) {
    document.body.dataset.theme = name;
    themeSelect.value = name;
    try { localStorage.setItem(THEME_KEY, name); } catch (e) {}
    layoutBoard();
  }

  function setZoom(z) {
    state.zoom = Math.min(2.5, Math.max(0.5, Math.round(z * 10) / 10));
    zoomLabel.textContent = Math.round(state.zoom * 100) + "%";
    try { localStorage.setItem(ZOOM_KEY, String(state.zoom)); } catch (e) {}
    layoutBoard();
  }

  function setMuted(m) {
    state.muted = m;
    btnSound.textContent = m ? "🔇" : "🔊";
    btnSound.classList.toggle("primary", m);
    try { localStorage.setItem(MUTE_KEY, m ? "1" : "0"); } catch (e) {}
  }

  function buildLegend() {
    const byFamily = {};
    for (const s of currentSymbols) {
      const info = SYMBOL_INFO.get(s);
      (byFamily[info.family] = byFamily[info.family] || []).push(s);
    }
    let html = "";
    for (const fi of Object.keys(byFamily)) {
      const f = FAMILIES[fi];
      html += '<div class="legend-family"><b>' + f.name + ':</b>';
      for (const s of byFamily[fi]) {
        html += '<span>' + s + '</span>';
      }
      html += '</div>';
    }
    legendContent.innerHTML = html;
  }

  /* ============================================================
     SELECTOR DE FICHAS
  ============================================================ */

  function loadSelection() {
    try {
      const raw = localStorage.getItem(SELECTION_KEY);
      if (raw) {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr) && arr.length >= 2) {
          return new Set(arr.filter(s => SYMBOL_INFO.has(s)));
        }
      }
    } catch (e) {}
    return new Set(DEFAULT_SELECTION);
  }

  function saveSelection(sel) {
    try { localStorage.setItem(SELECTION_KEY, JSON.stringify([...sel])); } catch (e) {}
  }

  function buildPicker() {
    pickerSel = loadSelection();
    pickerSymbols.innerHTML = "";
    for (const f of FAMILIES) {
      const famDiv = document.createElement("div");
      famDiv.className = "picker-family";
      const h = document.createElement("h4");
      h.textContent = f.name;
      famDiv.appendChild(h);
      const row = document.createElement("div");
      row.className = "picker-row";
      for (const s of f.symbols) {
        const b = document.createElement("button");
        b.className = "picker-tile" + (pickerSel.has(s) ? " on" : "") + (f.chars ? " chinese" : "");
        b.style.setProperty("--fc", f.color);
        b.textContent = s;
        b.title = s;
        b.addEventListener("click", () => {
          if (pickerSel.has(s)) { pickerSel.delete(s); b.classList.remove("on"); }
          else { pickerSel.add(s); b.classList.add("on"); }
          updatePickerCount();
          saveSelection(pickerSel);
        });
        row.appendChild(b);
      }
      famDiv.appendChild(row);
      pickerSymbols.appendChild(famDiv);
    }
    updatePickerCount();
  }

  function updatePickerCount() {
    const n = pickerSel.size;
    pickerCount.textContent = n + " símbolos · 72 pares" + (n < 2 ? " (mínimo 2)" : "");
    btnPickerStart.disabled = n < 2;
  }

  function showPicker() {
    hideWinOverlay();
    buildPicker();
    pickerOverlay.classList.remove("hidden");
  }

  function hidePicker() {
    pickerOverlay.classList.add("hidden");
  }

  const mobileQuery = window.matchMedia("(max-width: 640px)");
  const isMobile = () => mobileQuery.matches;

  function updateMenuIcon() {
    btnMenuToggle.textContent = toolbar.classList.contains("menu-collapsed") ? "☰" : "✕";
  }

  function toggleMenu() {
    toolbar.classList.toggle("menu-collapsed");
    updateMenuIcon();
    layoutBoard();
  }

  function startGameWithSelection() {
    if (pickerSel.size < 2) {
      toast("Selecciona al menos 2 símbolos.");
      return;
    }
    const order = new Map(ALL_SYMBOLS.map((s, i) => [s.s, i]));
    currentSymbols = [...pickerSel].sort((a, b) => order.get(a) - order.get(b));
    saveSelection(pickerSel);
    hidePicker();
    newGame();
  }

  /* ============================================================
     EVENTOS
  ============================================================ */

  btnNew.addEventListener("click", () => { showPicker(); });
  btnUndo.addEventListener("click", () => { undo(); });
  btnShuffle.addEventListener("click", () => { shuffleRemaining(); });
  btnHint.addEventListener("click", () => { hint(); });
  btnSave.addEventListener("click", () => { saveGame(); });
  btnLoad.addEventListener("click", () => { loadGame(); });
  btnSound.addEventListener("click", () => { ensureAudio(); setMuted(!state.muted); });
  btnZoomOut.addEventListener("click", () => { setZoom(state.zoom - 0.1); });
  btnZoomIn.addEventListener("click", () => { setZoom(state.zoom + 0.1); });
  themeSelect.addEventListener("change", (e) => { setTheme(e.target.value); });
  btnPickerAll.addEventListener("click", () => {
    pickerSel = new Set(ALL_SYMBOLS.map(s => s.s));
    document.querySelectorAll(".picker-tile").forEach(el => el.classList.add("on"));
    updatePickerCount();
    saveSelection(pickerSel);
  });
  btnPickerNone.addEventListener("click", () => {
    pickerSel = new Set();
    document.querySelectorAll(".picker-tile").forEach(el => el.classList.remove("on"));
    updatePickerCount();
    saveSelection(pickerSel);
  });
  btnPickerCancel.addEventListener("click", () => {
    hidePicker();
    if (state.tiles.length === 0) newGame();
  });
  btnPickerStart.addEventListener("click", () => { startGameWithSelection(); });
  $("btn-win-new").addEventListener("click", () => { showPicker(); });
  btnMenuToggle.addEventListener("click", () => { toggleMenu(); });

  window.addEventListener("resize", () => { layoutBoard(); });

  /* ============================================================
     INICIO
  ============================================================ */

  let theme = "claro";
  try { theme = localStorage.getItem(THEME_KEY) || "claro"; } catch (e) {}
  setTheme(theme);

  let muted = false;
  try { muted = localStorage.getItem(MUTE_KEY) === "1"; } catch (e) {}
  setMuted(muted);

  try {
    const z = parseFloat(localStorage.getItem(ZOOM_KEY));
    if (!isNaN(z) && z >= 0.5 && z <= 2.5) state.zoom = z;
  } catch (e) {}
  setZoom(state.zoom);

  currentSymbols = [...loadSelection()];
  buildLegend();
  buildPicker();
  showPicker();
})();
