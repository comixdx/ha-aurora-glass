/*!
 * Aurora Glass Card for Home Assistant — v0.6.1
 * A frosted-glass, customizable dashboard card with state-driven animations.
 * Widgets: energy flow, lights, climate, scenes, media, fan, floor heating, security, weather.
 * Each widget (and the header) is also its own card, e.g. custom:aurora-glass-lights, to place anywhere on a dashboard.
 * Also: glass pop-ups for any entity (hold a tile) and the custom:aurora-glass-entity card with animated icons.
 * Visual editor: Edit dashboard → Add card → Aurora Glass (no YAML needed).
 * No build step, no dependencies. Add as a dashboard resource (type: JavaScript module).
 * Companion theme: themes/aurora_glass.yaml
 */
(() => {
  const VERSION = "0.6.1";

  /* ---------------------------------------------------------------- palette */
  const PRESETS = {
    midnight: { name: "Midnight", dark: true, ground: "#080c18", orbs: ["#4552d8", "#0f9e98", "#b24f80"], orbOp: 0.55,
      glass: "rgba(255,255,255,0.07)", glass2: "rgba(255,255,255,0.12)", border: "rgba(255,255,255,0.13)", hi: "rgba(255,255,255,0.16)",
      shadow: "rgba(0,0,0,0.55)", text: "#f2f4fb", muted: "#aeb6cb", faint: "rgba(255,255,255,0.09)", track: "rgba(255,255,255,0.14)", off: "rgba(255,255,255,0.05)" },
    dawn: { name: "Dawn", dark: false, ground: "#e9ecf4", orbs: ["#ffb196", "#97bfff", "#cbb0ff"], orbOp: 0.85,
      glass: "rgba(255,255,255,0.48)", glass2: "rgba(255,255,255,0.7)", border: "rgba(255,255,255,0.85)", hi: "rgba(255,255,255,0.95)",
      shadow: "rgba(55,65,110,0.25)", text: "#151827", muted: "#4c5369", faint: "rgba(20,24,40,0.08)", track: "rgba(20,24,40,0.12)", off: "rgba(255,255,255,0.4)" },
    lagoon: { name: "Lagoon", dark: true, ground: "#03131a", orbs: ["#0a8a82", "#2453c6", "#4fc58d"], orbOp: 0.5,
      glass: "rgba(220,255,250,0.07)", glass2: "rgba(220,255,250,0.12)", border: "rgba(200,255,245,0.14)", hi: "rgba(220,255,250,0.16)",
      shadow: "rgba(0,0,0,0.55)", text: "#eefaf8", muted: "#a3c2bf", faint: "rgba(220,255,250,0.09)", track: "rgba(220,255,250,0.14)", off: "rgba(220,255,250,0.05)" },
    ember: { name: "Ember", dark: true, ground: "#140b09", orbs: ["#c24d2c", "#7a2f8e", "#d4962a"], orbOp: 0.5,
      glass: "rgba(255,240,230,0.07)", glass2: "rgba(255,240,230,0.12)", border: "rgba(255,230,215,0.14)", hi: "rgba(255,240,230,0.16)",
      shadow: "rgba(0,0,0,0.6)", text: "#fbf2ee", muted: "#c8b1a8", faint: "rgba(255,240,230,0.09)", track: "rgba(255,240,230,0.14)", off: "rgba(255,240,230,0.05)" }
  };
  const ACCENTS = {
    peach: { name: "Peach", c: "#ffb27a", deep: "#c4602a" },
    gold: { name: "Gold", c: "#f3cf5e", deep: "#9c7a0c" },
    mint: { name: "Mint", c: "#6fe0b0", deep: "#1c8a5e" },
    sky: { name: "Sky", c: "#7cc4ff", deep: "#2a72c2" },
    lilac: { name: "Lilac", c: "#c4a7ff", deep: "#6e4fd0" }
  };
  const SEM_DARK = { cool: "#6cb6ff", heat: "#ff8a66", solar: "#f6c84a", battery: "#5fdca6", grid: "#b3a4ff", home: "#f2f4fb", alert: "#ff6b7f" };
  const SEM_LIGHT = { cool: "#2b74cc", heat: "#d4552e", solar: "#b4840a", battery: "#178a5c", grid: "#6450cf", home: "#151827", alert: "#cf3049" };
  // Energy flow nodes: solar DC, grid AC, inverter, house, battery
  const EF_DARK = { pv: "#ef9f27", grid: "#378add", inv: "#1d9e75", house: "#639922", batt: "#d4537e" };
  const EF_LIGHT = { pv: "#c27a0e", grid: "#2a6fc0", inv: "#138a66", house: "#4f8a1a", batt: "#c23d6a" };

  /* ------------------------------------------------------------------ i18n */
  const I18N = {
    en: {
      good_morning: "Good morning", good_afternoon: "Good afternoon", good_evening: "Good evening",
      customize: "Customize", done: "Done", theme: "Theme", accent: "Accent", blur: "Glass blur", motion: "Motion",
      on: "On", off: "Off", auto: "Auto", add_widgets: "Add widgets", all_on_board: "Every widget is on the board. Remove one with − to park it here.",
      reset: "Reset layout", move_earlier: "Move earlier", move_later: "Move later", change_size: "Change size", remove: "Remove from board",
      energy: "Energy flow", lights: "Lights", climate: "Climate", scenes: "Scenes", media: "Now playing", fan: "Fan",
      floor: "Floor heating", security: "Security", weather: "Weather",
      live: "Live", n_of_m_on: "{n} of {m} on", solar: "Solar", home: "Home", inverter: "Inverter", load: "Load", exporting: "Exporting to grid", importing: "From grid",
      grid_idle: "Grid idle", charging: "Charging {v}", discharging: "Discharging {v}", battery_idle: "Battery idle",
      grid: "Grid", battery: "Battery", throughput: "throughput", of_supply: "{p} of supply", no_production: "no production", self_now: "Self-sufficiency now",
      ef_export: "Solar covers the house — the surplus goes back to the grid.", ef_export_charge: "Solar covers the house and charges the battery — the surplus goes back to the grid.",
      ef_solar: "Solar is covering the house.", ef_solar_charge: "Solar covers the house and charges the battery.", ef_solar_grid: "Solar covers part of the house; the grid tops up the rest.",
      ef_batt_grid: "The battery is carrying most of the load; the grid tops up the rest.", ef_grid_batt: "The grid is carrying most of the load; the battery helps.",
      ef_batt: "The battery is powering the house.", ef_grid: "Drawing from the grid.", ef_quiet: "No power is flowing right now.",
      target: "target", cooling: "Cooling", heating: "Heating", idle: "Idle", tap_to_run: "Tap to run", active: "Active: {n}",
      nothing_playing: "Nothing playing", play: "Play", pause: "Pause", speed: "Speed {n}", tap_speed: "Tap to change speed",
      running: "Running", heating_to: "heating to {t}", locked: "Locked · tap to unlock", unlocked: "Unlocked · tap to lock",
      all_closed: "All closed", n_open: "{n} open", door_unlocked: "Door unlocked", secure: "All secure", not_found: "Entity not found: {e}",
      humidity: "Humidity {h}%", brightness: "Brightness",
      close: "Close", more_details: "More details", turn_on: "Turn on", turn_off: "Turn off", color_temp: "Colour temperature", color: "Colour", effect: "Effect",
      changed: "Changed {t}", just_now: "just now", oscillate: "Oscillate", direction: "Direction", forward: "Forward", reverse: "Reverse", preset: "Preset",
      fan_mode: "Fan", cover_open: "Open", cover_close: "Close", stop: "Stop", position: "Position", lock_act: "Lock", unlock_act: "Unlock", open_act: "Open",
      run: "Run", ran: "Done", last_24h: "Last 24 hours", min: "Min", avg: "Average", max: "Max", forecast: "Forecast", volume: "Volume", mute: "Mute",
      source: "Source", no_history: "No history yet", wind: "Wind", pressure: "Pressure", previous: "Previous", next: "Next", hold_hint: "Hold any tile for details",
      opening: "Opening", closing: "Closing", open: "Open", closed: "Closed", detected: "Detected", clear: "Clear", home_state: "Home", away: "Away", mode: "Mode",
      updated: "Updated {t}", no_location: "Set your home location in Settings → System → General, or enter latitude and longitude in the widget"
    },
    ro: {
      good_morning: "Bună dimineața", good_afternoon: "Bună ziua", good_evening: "Bună seara",
      customize: "Personalizează", done: "Gata", theme: "Temă", accent: "Accent", blur: "Estompare sticlă", motion: "Animații",
      on: "Pornit", off: "Oprit", auto: "Auto", add_widgets: "Adaugă widgeturi", all_on_board: "Toate widgeturile sunt pe ecran. Scoate unul cu − ca să-l parchezi aici.",
      reset: "Resetează aranjarea", move_earlier: "Mută înainte", move_later: "Mută după", change_size: "Schimbă mărimea", remove: "Scoate de pe ecran",
      energy: "Flux energie", lights: "Lumini", climate: "Climatizare", scenes: "Scene", media: "Se redă", fan: "Ventilator",
      floor: "Încălzire în pardoseală", security: "Securitate", weather: "Vremea",
      live: "Live", n_of_m_on: "{n} din {m} aprinse", solar: "Solar", home: "Casă", inverter: "Invertor", load: "Consum", exporting: "Injectare în rețea", importing: "Din rețea",
      grid_idle: "Rețea inactivă", charging: "Se încarcă {v}", discharging: "Se descarcă {v}", battery_idle: "Baterie inactivă",
      grid: "Rețea", battery: "Baterie", throughput: "tranzit", of_supply: "{p} din alimentare", no_production: "fără producție", self_now: "Autonomie acum",
      ef_export: "Soarele acoperă casa — surplusul merge în rețea.", ef_export_charge: "Soarele acoperă casa și încarcă bateria — surplusul merge în rețea.",
      ef_solar: "Soarele acoperă consumul casei.", ef_solar_charge: "Soarele acoperă casa și încarcă bateria.", ef_solar_grid: "Soarele acoperă o parte din consum; rețeaua completează restul.",
      ef_batt_grid: "Bateria duce cea mai mare parte a consumului; rețeaua completează restul.", ef_grid_batt: "Rețeaua duce cea mai mare parte a consumului; bateria ajută.",
      ef_batt: "Bateria alimentează casa.", ef_grid: "Se consumă din rețea.", ef_quiet: "Nu circulă energie acum.",
      target: "țintă", cooling: "Răcire", heating: "Încălzire", idle: "Inactiv", tap_to_run: "Atinge pentru a rula", active: "Activă: {n}",
      nothing_playing: "Nu se redă nimic", play: "Redă", pause: "Pauză", speed: "Viteza {n}", tap_speed: "Atinge pentru a schimba viteza",
      running: "Pornit", heating_to: "încălzește la {t}", locked: "Încuiat · atinge pentru a descuia", unlocked: "Descuiat · atinge pentru a încuia",
      all_closed: "Toate închise", n_open: "{n} deschise", door_unlocked: "Ușa descuiată", secure: "Totul în siguranță", not_found: "Entitate negăsită: {e}",
      humidity: "Umiditate {h}%", brightness: "Luminozitate",
      close: "Închide", more_details: "Mai multe detalii", turn_on: "Pornește", turn_off: "Oprește", color_temp: "Temperatura culorii", color: "Culoare", effect: "Efect",
      changed: "Schimbat {t}", just_now: "chiar acum", oscillate: "Oscilare", direction: "Direcție", forward: "Înainte", reverse: "Invers", preset: "Presetare",
      fan_mode: "Ventilator", cover_open: "Deschide", cover_close: "Închide", stop: "Stop", position: "Poziție", lock_act: "Încuie", unlock_act: "Descuie", open_act: "Deschide",
      run: "Rulează", ran: "Gata", last_24h: "Ultimele 24 de ore", min: "Min", avg: "Medie", max: "Max", forecast: "Prognoză", volume: "Volum", mute: "Fără sunet",
      source: "Sursă", no_history: "Încă nu există istoric", wind: "Vânt", pressure: "Presiune", previous: "Anterior", next: "Următor", hold_hint: "Ține apăsat pe orice element pentru detalii",
      opening: "Se deschide", closing: "Se închide", open: "Deschis", closed: "Închis", detected: "Detectat", clear: "Liber", home_state: "Acasă", away: "Plecat", mode: "Mod",
      updated: "Actualizat {t}", no_location: "Setează locația casei în Setări → Sistem → General sau introdu latitudinea și longitudinea în widget"
    }
  };

  /* ----------------------------------------------------------------- icons */
  const ICON = {
    energy: "M13 2 4 14h7l-1 8 9-12h-7z",
    lights: "M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z",
    climate: "M14 14.8V5a2 2 0 1 0-4 0v9.8a4 4 0 1 0 4 0z",
    scenes: "M12 3v4M12 17v4M3 12h4M17 12h4M6.3 6.3l2.5 2.5M15.2 15.2l2.5 2.5M6.3 17.7l2.5-2.5M15.2 8.8l2.5-2.5",
    media: "M9 18V5l11-2v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM20 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0z",
    fan: "M12 10.5C12 6 13 3 15.5 3S19 6 12 10.5zM13.5 12c4.5 0 7.5 1 7.5 3.5S18 19 13.5 12zM12 13.5c0 4.5-1 7.5-3.5 7.5S5 18 12 13.5zM10.5 12C6 12 3 11 3 8.5S6 5 10.5 12z",
    floor: "M3 8c2-2 4-2 6 0s4 2 6 0 4-2 6 0M3 13c2-2 4-2 6 0s4 2 6 0 4-2 6 0M3 18c2-2 4-2 6 0s4 2 6 0 4-2 6 0",
    security: "M12 3l8 3v6c0 4.5-3.4 8.2-8 9-4.6-.8-8-4.5-8-9V6z",
    weather: "M8 5V3M3.5 7.5 2 6M13.5 6.5 15 5M5 12H3M12.5 10A4.5 4.5 0 0 0 4.6 12.2M17 20H8a4 4 0 1 1 .6-7.95A5 5 0 0 1 18 13a3.5 3.5 0 0 1-1 7z",
    solar: "M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z",
    grid: "M8 21l4-18 4 18M6 9h12M5 14h14M9.5 14 12 21l2.5-7",
    home: "M3 11 12 4l9 7M5 10v10h14V10M10 20v-5h4v5",
    inverter: "M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM7 12c1.2-2.6 2.6-2.6 3.8 0s2.6 2.6 3.8 0 2.2-2.4 2.4-1.6",
    battery: "M7 6h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2zM10 3h4M12 10l-2 4h4l-2 4",
    left: "M15 6l-6 6 6 6", right: "M9 6l6 6-6 6", minus: "M5 12h14", plus: "M12 5v14M5 12h14",
    sliders: "M4 6h9M17 6h3M4 12h3M11 12h9M4 18h11M19 18h1M15 4v4M9 10v4M17 16v4",
    power: "M12 3.5v7.5M7.2 6.6a7 7 0 1 0 9.6 0", x: "M6 6l12 12M18 6 6 18", dots: "M5 12h.01M12 12h.01M19 12h.01",
    prev: "M18 6v12L9 12zM6 6v12", next: "M6 6v12l9-6zM18 6v12", vol: "M4 9.5h3.5L12 6v12l-4.5-3.5H4zM16 9a4 4 0 0 1 0 6M18.5 6.5a7.5 7.5 0 0 1 0 11",
    mute: "M4 9.5h3.5L12 6v12l-4.5-3.5H4zM16 10l4 4M20 10l-4 4", up: "M6 15l6-6 6 6", down: "M6 9l6 6 6-6", stopsq: "M7 7h10v10H7z"
  };
  const svgIcon = (d, size = 18, sw = 1.8) =>
    `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d}"></path></svg>`;

  /* --------------------------------------------------------------- helpers */
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const hexA = (hex, a) => {
    const n = parseInt(hex.slice(1), 16);
    return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
  };
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const asList = (v) => (v == null ? [] : Array.isArray(v) ? v : [v]);
  const entOf = (x) => (typeof x === "string" ? { entity: x } : x || {});
  const pretty = (s) => { s = String(s || "").replace(/_/g, " "); return s.charAt(0).toUpperCase() + s.slice(1); };
  const WX_LABEL = { partlycloudy: "Partly cloudy", "clear-night": "Clear night", "lightning-rainy": "Lightning, rainy", "snowy-rainy": "Snowy, rainy", fog: "Fog" };
  const INACTIVE = new Set(["off", "idle", "standby", "paused", "unavailable", "unknown", "closed", "locked", "docked", ""]);

  // Minimal DOM morph: keeps existing nodes (and their running CSS animations) when markup barely changes.
  function morph(a, b, active) {
    for (let i = a.attributes.length - 1; i >= 0; i--) {
      const n = a.attributes[i].name;
      if (!b.hasAttribute(n)) a.removeAttribute(n);
    }
    for (const at of Array.from(b.attributes)) {
      if (a.getAttribute(at.name) === at.value) continue;
      if (at.name === "value" && a === active) continue;
      a.setAttribute(at.name, at.value);
      if (at.name === "value" && "value" in a) a.value = at.value;
    }
    if (a.tagName === "INPUT" && a !== active && b.hasAttribute("value") && a.value !== b.getAttribute("value")) a.value = b.getAttribute("value");
    const ac = Array.from(a.childNodes), bc = Array.from(b.childNodes);
    for (let i = 0; i < bc.length; i++) {
      const x = ac[i], y = bc[i];
      if (!x) { a.appendChild(y); continue; }
      const sameEl = x.nodeType === 1 && y.nodeType === 1 && x.tagName === y.tagName && x.getAttribute("data-k") === y.getAttribute("data-k");
      if (x.nodeType !== y.nodeType || (x.nodeType === 1 && !sameEl)) { a.replaceChild(y, x); continue; }
      if (x.nodeType !== 1) { if (x.nodeValue !== y.nodeValue) x.nodeValue = y.nodeValue; continue; }
      morph(x, y, active);
    }
    for (let i = ac.length - 1; i >= bc.length; i--) a.removeChild(ac[i]);
  }

  let fontsLoaded = false;
  function loadFonts() {
    if (fontsLoaded || typeof document === "undefined") return;
    fontsLoaded = true;
    if (document.querySelector("link[data-aurora-glass-fonts]")) return;
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.dataset.auroraGlassFonts = "1";
    l.href = "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,600&family=Figtree:wght@400;500;600;700&display=swap";
    document.head.appendChild(l);
  }

  /* ------------------------------------------------------------------- CSS */
  const CSS = `
  :host{display:block}
  *{box-sizing:border-box}
  button{font:inherit;color:inherit;background:none;border:0;padding:0;margin:0;cursor:pointer;text-align:inherit;-webkit-tap-highlight-color:transparent}
  button:focus-visible{outline:2px solid var(--text);outline-offset:3px}
  input[type=range]{-webkit-appearance:none;appearance:none;background:transparent;cursor:pointer;margin:0;height:44px}
  input[type=range]::-webkit-slider-runnable-track{height:6px;border-radius:99px;background:var(--track)}
  input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:22px;height:22px;margin-top:-8px;border-radius:99px;background:#fff;box-shadow:0 2px 10px rgba(0,0,0,.35)}
  input[type=range]::-moz-range-track{height:6px;border-radius:99px;background:var(--track)}
  input[type=range]::-moz-range-thumb{width:22px;height:22px;border:0;border-radius:99px;background:#fff}
  .root{position:relative;container-type:inline-size;color:var(--text);font-family:'Figtree',var(--ha-font-family-body,system-ui),-apple-system,sans-serif;transition:color .5s}
  .root.bg{background:var(--ground);border-radius:var(--root-radius,0);overflow:hidden;min-height:var(--min-h,auto);transition:background .8s,color .5s}
  .orbs{position:absolute;inset:0;overflow:hidden;pointer-events:none}
  .orb{position:absolute;border-radius:50%;filter:blur(30px);opacity:var(--orb-op);transition:background 1s,opacity 1s}
  .orb.o1{left:-8%;top:-12%;width:640px;height:640px;animation:agDrift1 38s ease-in-out infinite}
  .orb.o2{left:58%;top:8%;width:560px;height:560px;animation:agDrift2 45s ease-in-out infinite}
  .orb.o3{left:22%;top:52%;width:620px;height:620px;animation:agDrift3 52s ease-in-out infinite}
  .wrap{position:relative;z-index:1;max-width:1360px;margin:0 auto;display:flex;flex-direction:column;gap:22px}
  .root.bg .wrap{padding:32px clamp(14px,3vw,40px) calc(40px + env(safe-area-inset-bottom))}
  .disp{font-family:'Bricolage Grotesque','Figtree',system-ui,sans-serif;font-weight:600;font-variant-numeric:tabular-nums}
  .muted{color:var(--muted)}
  .glass{background:var(--glass);backdrop-filter:blur(var(--blur)) saturate(170%);-webkit-backdrop-filter:blur(var(--blur)) saturate(170%);border:1px solid var(--border);box-shadow:inset 0 1px 0 var(--hi),0 30px 60px -32px var(--shadow)}
  .glass2{background:var(--glass2);backdrop-filter:blur(var(--blur)) saturate(170%);-webkit-backdrop-filter:blur(var(--blur)) saturate(170%);border:1px solid var(--border);box-shadow:inset 0 1px 0 var(--hi)}
  header{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:16px 24px}
  .hello{display:flex;flex-direction:column;gap:8px}
  .hello h1{margin:0;font-size:clamp(30px,5vw,48px);letter-spacing:-.035em;line-height:1}
  .chips{display:flex;flex-wrap:wrap;align-items:center;gap:10px}
  .chip{display:flex;align-items:center;gap:10px;min-height:44px;padding:0 16px;border-radius:99px;font-size:13px}
  .chip .disp{font-size:17px}
  .dot{width:8px;height:8px;border-radius:99px;background:var(--c);box-shadow:0 0 10px var(--c)}
  .pill{display:flex;align-items:center;gap:8px;min-height:44px;padding:0 18px;border-radius:99px;font-size:14px;font-weight:600;transition:background .3s,color .3s}
  .pill.on{background:var(--acc);color:#1c140c;border-color:var(--acc)}
  .hbs{display:flex;align-items:center;gap:8px;flex:none}
  .hb{flex:none;width:44px;height:44px;border-radius:99px;display:flex;align-items:center;justify-content:center;color:var(--text);--mdc-icon-size:20px;transition:transform .2s}
  .hb:active{transform:scale(.92)}
  .hb ha-icon{display:flex}
  .panel{display:flex;flex-wrap:wrap;align-items:flex-start;gap:22px 32px;padding:20px 24px;border-radius:26px;animation:agDrop .45s cubic-bezier(.2,.8,.2,1) both}
  .grp{display:flex;flex-direction:column;gap:10px}
  .lbl{font-size:12px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--muted)}
  .row{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
  .tchip{display:flex;align-items:center;gap:10px;min-height:44px;padding:0 14px 0 10px;border-radius:99px;font-size:14px;font-weight:600;background:var(--off);border:1.5px solid var(--faint)}
  .tchip.on{background:color-mix(in srgb,var(--acc) 18%,transparent);border-color:var(--acc)}
  .tdot{width:14px;height:14px;border-radius:99px;border:1.5px solid var(--border);margin-left:-5px}
  .tdot:first-child{margin-left:0}
  .sw{width:44px;height:44px;border-radius:99px;background:var(--c);box-shadow:inset 0 0 0 1px rgba(0,0,0,.12);transition:box-shadow .3s}
  .sw.on{box-shadow:0 0 0 3px var(--ground),0 0 0 5px var(--c)}
  .toggle{flex:none;width:50px;height:30px;border-radius:99px;padding:3px;display:flex;justify-content:flex-start;background:var(--track);transition:background .25s}
  .toggle.on{justify-content:flex-end;background:var(--c,var(--acc))}
  .toggle i{width:24px;height:24px;border-radius:99px;background:#fff;box-shadow:0 1px 4px rgba(0,0,0,.35)}
  .toggle.on i{background:#141622}
  .grid{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));grid-auto-flow:row dense;gap:18px}
  .w{grid-column:span 4;position:relative;min-width:0;display:flex;flex-direction:column;gap:16px;padding:20px 22px 22px;border-radius:28px;outline:1.5px dashed transparent;outline-offset:5px;transition:outline-color .3s}
  .w.S{grid-column:span 3}.w.L{grid-column:span 6}.w.XL{grid-column:span 12}
  .enter .w{animation:agIn .8s cubic-bezier(.2,.8,.2,1) both;animation-delay:calc(var(--i) * 70ms)}
  .editing .w{outline-color:color-mix(in srgb,var(--acc) 75%,transparent);animation:agWiggle 2.6s ease-in-out infinite;animation-delay:calc(var(--i) * -0.37s)}
  @container (max-width:1099px){.grid{grid-template-columns:repeat(6,minmax(0,1fr))}.w,.w.S{grid-column:span 3}.w.L,.w.XL{grid-column:span 6}}
  @container (max-width:719px){.grid{grid-template-columns:minmax(0,1fr);gap:14px}.w,.w.S,.w.L,.w.XL{grid-column:auto;padding:16px}.wrap{gap:16px}}
  .single,.single .wrap{height:100%}.single .grid{grid-template-columns:minmax(0,1fr);height:100%}.single .grid:empty{display:none}.single .w{grid-column:1/-1;box-sizing:border-box;height:100%}
  .wh{display:flex;align-items:center;justify-content:space-between;gap:10px;min-height:40px}
  .wt{display:flex;align-items:center;gap:10px;min-width:0}
  .wt h2{margin:0;font-size:15px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .ic{width:36px;height:36px;flex:none;border-radius:12px;display:flex;align-items:center;justify-content:center;color:var(--acc-ink);background:color-mix(in srgb,var(--acc) var(--acc-a),transparent)}
  .meta{font-size:13px;white-space:nowrap;color:var(--muted)}
  .ctl{display:flex;gap:4px;margin-left:auto}
  .editing .wh{flex-wrap:wrap}
  .ctl button{width:40px;height:40px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700}
  .err{font-size:13px;color:var(--alert)}
  /* energy */
  /* A cross: solar on top, grid left, inverter in the middle, house right, battery below.
     Sizes follow the widget's own width, so the same layout fits a phone. */
  .ef{container-type:inline-size;display:flex;flex-direction:column;gap:14px;--sz:clamp(58px,15cqw,96px);--szb:calc(var(--sz) * 1.125);--leg:clamp(28px,11cqw,84px)}
  .efsum{font-size:13px;line-height:1.4;color:var(--muted)}
  .efg{display:grid;grid-template-columns:minmax(0,1fr) var(--leg) minmax(0,1fr) var(--leg) minmax(0,1fr);grid-template-rows:auto var(--leg) auto var(--leg) auto;justify-items:center}
  .en{display:flex;flex-direction:column;align-items:center;gap:3px;min-width:0;max-width:100%;padding:0;border:0;background:none;color:inherit;font:inherit;text-align:center;cursor:pointer}
  .en.up{flex-direction:column-reverse}
  .en svg{width:var(--sz);height:var(--sz);flex:none;overflow:visible;transition:filter .6s}
  .en.big svg{width:var(--szb);height:var(--szb)}
  .en.side svg{margin-top:calc((var(--szb) - var(--sz)) / 2)}
  .en.act svg{filter:drop-shadow(0 0 14px color-mix(in srgb,var(--c) 45%,transparent))}
  .en .ring{fill:color-mix(in srgb,var(--c) 22%,var(--ground));stroke:var(--c);stroke-width:3}
  .en .ln{fill:none;stroke:var(--ci);stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
  .en .thin{stroke-width:1.2;opacity:.7}
  .en .fl{fill:var(--ci)}
  .en .bdg{fill:var(--c)}
  .en .bdt{fill:#fff;font:700 9px 'Figtree',system-ui,sans-serif;text-anchor:middle}
  .en .bdt.sm{font-size:8px}
  .en{--ci:color-mix(in srgb,var(--c) 62%,var(--text))}
  .el{display:flex;align-items:baseline;gap:6px;font-size:12px;font-weight:600;color:var(--ci)}
  .el small{font-size:12px;font-weight:500;font-variant-numeric:tabular-nums}
  .ev{display:flex;align-items:baseline;gap:6px;font-size:clamp(15px,4.4cqw,20px);line-height:1.1;white-space:nowrap}
  .es{max-width:100%;overflow:hidden;font-size:11px;color:var(--muted);white-space:nowrap;text-overflow:ellipsis}
  .ev .es{font-family:'Figtree',var(--ha-font-family-body,system-ui),sans-serif;font-weight:400}
  .esoc{width:min(108px,90%);height:4px;margin:2px 0;border-radius:2px;overflow:hidden;background:var(--track)}
  .esoc i{display:block;height:100%;border-radius:2px;background:var(--c);transition:width .6s}
  .eleg{position:relative;width:100%;height:100%;--lc:var(--c)}
  .eleg.h{height:var(--szb)}
  .eleg::before{content:"";position:absolute;background:linear-gradient(var(--ld,180deg),transparent,var(--lc) 22%,var(--lc) 78%,transparent);transition:background .5s}
  .eleg.v::before{top:0;bottom:0;left:calc(50% - 1px);width:2px}
  .eleg.h::before{top:calc(50% - 1px);left:0;right:0;height:2px;--ld:90deg}
  .eleg.idle{--lc:var(--track)}
  .edot{position:absolute;width:7px;height:7px;border-radius:50%;background:var(--lc);box-shadow:0 0 8px var(--lc);animation:var(--an) var(--d,1.6s) linear infinite var(--dr,normal)}
  .edot:nth-of-type(2){animation-delay:calc(var(--d,1.6s) * -.333)}
  .edot:nth-of-type(3){animation-delay:calc(var(--d,1.6s) * -.667)}
  .eleg.v .edot{left:calc(50% - 3.5px);--an:agFv}
  .eleg.h .edot{top:calc(50% - 3.5px);--an:agFh}
  .eleg.idle .edot,.still .edot{display:none}
  .etag{position:absolute;font-size:11px;color:var(--muted);white-space:nowrap;font-variant-numeric:tabular-nums}
  .eleg.v .etag{top:50%;left:calc(50% + 12px);transform:translateY(-50%)}
  .eleg.h .etag{top:calc(50% + 10px);left:50%;transform:translateX(-50%)}
  @container (max-width:520px){.etag .pc{display:none}}
  .efoot{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px 16px;padding-top:12px;border-top:1px solid var(--faint);font-size:12px;color:var(--muted)}
  .elg{display:flex;flex-wrap:wrap;gap:6px 14px}
  .elg span{display:flex;align-items:center;gap:6px}
  .elg i{width:7px;height:7px;border-radius:50%;background:var(--c)}
  .efoot b{font-weight:600;color:var(--text)}
  /* lights */
  .tiles{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
  .w.L .tiles,.w.XL .tiles{grid-template-columns:repeat(3,minmax(0,1fr))}
  @container (max-width:719px){.w.L .tiles,.w.XL .tiles{grid-template-columns:repeat(2,minmax(0,1fr))}}
  .tile{display:flex;flex-direction:column;justify-content:space-between;gap:14px;min-height:120px;padding:14px;border-radius:20px;min-width:0;background:var(--off);border:1px solid var(--faint);transition:background .45s,border-color .45s,box-shadow .45s}
  .tile.on{background:color-mix(in srgb,var(--acc) var(--acc-t),transparent);border-color:color-mix(in srgb,var(--acc) 50%,transparent);box-shadow:0 10px 40px -12px color-mix(in srgb,var(--acc) 55%,transparent)}
  .tile.focus{outline:2px solid color-mix(in srgb,var(--acc) 60%,transparent);outline-offset:2px}
  .bulb{width:38px;height:38px;border-radius:99px;display:flex;align-items:center;justify-content:center;background:var(--faint);color:var(--muted);transition:background .45s,box-shadow .6s,color .3s}
  .bulb .ai{color:inherit}
  .tile.on .bulb{background:var(--acc);color:#1c140c;box-shadow:0 0 0 4px color-mix(in srgb,var(--acc) 18%,transparent),0 0 var(--glow,24px) color-mix(in srgb,var(--acc) 60%,transparent)}
  .tn{font-size:15px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .ts{font-size:12px;color:var(--muted)}
  .bar{height:4px;border-radius:99px;overflow:hidden;background:var(--track)}
  .bar i{display:block;height:100%;border-radius:99px;background:var(--acc);transition:width .4s}
  .dim{display:flex;align-items:center;gap:14px;padding:4px 4px 0}
  .dim input{flex:1;min-width:0}
  /* climate */
  .clim{display:flex;flex-wrap:wrap;align-items:center;gap:20px}
  .ring{position:relative;width:150px;height:150px;flex:none}
  .ring svg{transform:rotate(135deg)}
  .ring circle{fill:none;stroke-width:10;stroke-linecap:round}
  .ring .rf{transition:stroke-dasharray .6s cubic-bezier(.2,.8,.2,1),stroke .4s}
  .ring .in{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px}
  .ring .disp{font-size:40px;letter-spacing:-.03em;line-height:1}
  .cside{flex:1 1 150px;min-width:0;display:flex;flex-direction:column;gap:12px}
  .stepper{display:flex;align-items:center;justify-content:space-between;gap:8px}
  .round{width:48px;height:48px;border-radius:99px;display:flex;align-items:center;justify-content:center;font-size:22px}
  .modes{display:grid;grid-template-columns:repeat(var(--n,3),minmax(0,1fr));gap:6px}
  .mode{min-height:44px;border-radius:14px;text-align:center;font-size:14px;font-weight:600;background:var(--off);color:var(--muted);border:1px solid var(--faint);transition:background .3s,color .3s}
  .mode.on{background:color-mix(in srgb,var(--c) 22%,transparent);color:var(--c);border-color:color-mix(in srgb,var(--c) 60%,transparent)}
  .strip{position:relative;height:40px;border-radius:14px;overflow:hidden;background:var(--off);border:1px solid var(--faint)}
  .air{position:absolute;left:0;width:38%;height:2px;border-radius:99px;background:linear-gradient(90deg,transparent,var(--cool),transparent);animation:agAir var(--d) ease-in infinite;animation-delay:var(--dl)}
  .heatb{position:absolute;bottom:4px;width:14px;height:14px;border-radius:99px;background:color-mix(in srgb,var(--heat) 55%,transparent);filter:blur(3px);animation:agRise var(--d) ease-out infinite;animation-delay:var(--dl)}
  /* scenes */
  .scenes{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
  .scene{display:flex;flex-direction:column;gap:6px;padding:16px;min-height:96px;border-radius:20px;background:var(--off);border:1px solid var(--faint);transition:background .35s,color .35s,border-color .35s}
  .scene .sn{display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:15px;font-weight:600}
  .scene .sd{font-size:13px;line-height:1.35;color:var(--muted)}
  .scene.on{background:var(--acc);color:#1c140c;border-color:var(--acc);box-shadow:0 14px 40px -16px color-mix(in srgb,var(--acc) 80%,transparent)}
  .scene.on .sd{color:#3b2a1c}
  .ping{position:relative;width:8px;height:8px;flex:none}
  .ping::before,.ping::after{content:"";position:absolute;inset:0;border-radius:99px;background:var(--c,currentColor)}
  .ping::before{animation:agPing 1.5s ease-out infinite}
  /* media */
  .mrow{display:flex;align-items:center;gap:16px}
  .art{width:72px;height:72px;flex:none;border-radius:18px;display:flex;align-items:center;justify-content:center;color:var(--acc-ink);background:color-mix(in srgb,var(--acc) var(--acc-a),transparent) center/cover no-repeat;border:1px solid color-mix(in srgb,var(--acc) 40%,transparent)}
  .mt{flex:1;min-width:0;display:flex;flex-direction:column;gap:4px}
  .mt b{font-size:16px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .mt span{font-size:13px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .mfoot{display:flex;align-items:center;justify-content:space-between;gap:12px}
  .eq{display:flex;align-items:flex-end;gap:4px;height:34px}
  .eq i{width:5px;height:100%;border-radius:99px;transform-origin:bottom;background:var(--acc);transform:scaleY(.18);transition:transform .4s}
  .eq.on i{transform:scaleY(.6);animation:agEq var(--d) ease-in-out infinite;animation-delay:var(--dl)}
  .play{width:52px;height:52px;border-radius:99px;display:flex;align-items:center;justify-content:center;background:var(--acc);color:#1c140c;box-shadow:0 10px 30px -10px color-mix(in srgb,var(--acc) 90%,transparent)}
  /* fan */
  .fanbtn{display:flex;align-items:center;gap:16px;min-height:96px}
  .blades{fill:var(--muted);transform-origin:50px 50px;transform-box:view-box;transition:fill .4s}
  .fan-on .blades{fill:var(--cool);animation:agSpin var(--d) linear infinite}
  .pips{display:flex;gap:4px}
  .pips i{width:18px;height:5px;border-radius:99px;background:var(--track);transition:background .3s}
  .pips i.on{background:var(--cool)}
  /* floor */
  .frow{display:flex;align-items:flex-end;justify-content:space-between;gap:12px}
  .big{font-size:34px;letter-spacing:-.03em;line-height:1}
  .waves{position:relative;height:40px;overflow:hidden;border-radius:12px}
  .waves svg{position:absolute;left:0;width:200%;height:28px}
  .waves path{fill:none;stroke-width:2.5;stroke-linecap:round;stroke:var(--track);transition:stroke .5s}
  .waves.on path{stroke:var(--heat)}
  .waves.on svg{animation:agWave var(--d) linear infinite}
  .waves.on svg.r{animation-direction:reverse}
  /* security */
  .lockbtn{display:flex;align-items:center;gap:14px;min-height:64px}
  .lockb{width:56px;height:56px;flex:none;border-radius:18px;display:flex;align-items:center;justify-content:center;transition:background .35s,color .35s;background:color-mix(in srgb,var(--c) 16%,transparent);color:var(--c)}
  .shackle{transition:transform .45s cubic-bezier(.3,1.7,.5,1)}
  .unl .shackle{transform:translateY(-3.5px)}
  .sens{display:flex;flex-direction:column;gap:8px;padding-top:12px;border-top:1px solid var(--faint)}
  .sline{display:flex;align-items:center;gap:10px;font-size:13px}
  /* weather */
  .wx{display:flex;align-items:center;gap:14px}
  .rays{transform-origin:46px 39px;transform-box:view-box;animation:agSpin 24s linear infinite}
  .cloud{animation:agFloat 7s ease-in-out infinite}
  .drop{animation:agFall 1.1s linear infinite;animation-delay:var(--dl)}
  /* motion off / reduced */
  .still *,.still{animation:none !important}
  @media (prefers-reduced-motion:reduce){*{animation:none !important;transition:none !important}}
  @keyframes agDrift1{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(140px,80px) scale(1.18)}}
  @keyframes agDrift2{0%,100%{transform:translate(0,0) scale(1.1)}50%{transform:translate(-160px,60px) scale(.92)}}
  @keyframes agDrift3{0%,100%{transform:translate(0,0) scale(.95)}50%{transform:translate(90px,-110px) scale(1.12)}}
  @keyframes agIn{0%{opacity:0;transform:translateY(18px) scale(.985)}100%{opacity:1;transform:none}}
  @keyframes agDrop{0%{opacity:0;transform:translateY(-10px)}100%{opacity:1;transform:none}}
  @keyframes agWiggle{0%,100%{transform:rotate(-.35deg)}50%{transform:rotate(.35deg)}}
  @keyframes agSpin{to{transform:rotate(360deg)}}
  @keyframes agFv{0%{top:-4px;opacity:0}18%,82%{opacity:1}100%{top:calc(100% - 3px);opacity:0}}
  @keyframes agFh{0%{left:-4px;opacity:0}18%,82%{opacity:1}100%{left:calc(100% - 3px);opacity:0}}
  @keyframes agAir{0%{transform:translateX(-40%);opacity:0}25%{opacity:.95}100%{transform:translateX(260%);opacity:0}}
  @keyframes agRise{0%{transform:translateY(12px) scale(.6);opacity:0}35%{opacity:.85}100%{transform:translateY(-34px) scale(1.25);opacity:0}}
  @keyframes agEq{0%,100%{transform:scaleY(.22)}50%{transform:scaleY(1)}}
  @keyframes agPing{0%{transform:scale(1);opacity:.75}100%{transform:scale(2.6);opacity:0}}
  @keyframes agWave{to{transform:translateX(-50%)}}
  @keyframes agFloat{0%,100%{transform:translateX(0)}50%{transform:translateX(9px)}}
  @keyframes agFall{0%{transform:translateY(-4px);opacity:0}30%{opacity:1}100%{transform:translateY(12px);opacity:0}}
  `;

  /* ------------------------------------------------- shared theme + i18n helpers */
  const trLang = (hass, forced) => { const l = (forced || hass?.locale?.language || hass?.language || "en").split("-")[0]; return I18N[l] ? l : "en"; };
  const tr = (lang, k, vars) => {
    let s = I18N[lang]?.[k] ?? I18N.en[k] ?? k;
    if (vars) Object.keys(vars).forEach((v) => { s = s.replace(`{${v}}`, vars[v]); });
    return s;
  };
  function resolveTheme(preset, accent, hass) {
    let id = preset || "auto";
    if (id === "auto" || !PRESETS[id]) id = hass?.themes?.darkMode === false ? "dawn" : "midnight";
    const T = PRESETS[id];
    const A = ACCENTS[accent] || ACCENTS.peach;
    return { id, T, A, S: T.dark ? SEM_DARK : SEM_LIGHT };
  }
  function themeVars({ T, A, S }, blur) {
    const v = {
      "--ground": T.ground, "--glass": T.glass, "--glass2": T.glass2, "--border": T.border, "--hi": T.hi, "--shadow": T.shadow,
      "--text": T.text, "--muted": T.muted, "--faint": T.faint, "--track": T.track, "--off": T.off, "--orb-op": T.orbOp,
      "--acc": A.c, "--acc-ink": T.dark ? A.c : A.deep, "--acc-a": T.dark ? "14%" : "28%", "--acc-t": T.dark ? "16%" : "32%",
      "--blur": `${blur}px`, "--cool": S.cool, "--heat": S.heat, "--solar": S.solar, "--battery": S.battery, "--grid": S.grid, "--alert": S.alert,
      "--on-acc": "#1c140c"
    };
    return Object.keys(v).map((k) => `${k}:${v[k]}`).join(";");
  }
  const domainOf = (id) => String(id || "").split(".")[0];
  const isOn = (s) => !!s && !INACTIVE.has(s.state) && s.state !== "not_home";
  const TOGGLE_DOMAINS = ["light", "switch", "input_boolean", "fan", "cover", "automation", "siren", "humidifier", "climate", "media_player", "vacuum"];
  const RUN_DOMAINS = ["scene", "script", "button", "input_button"];
  function relTime(iso, lang) {
    const t = Date.parse(iso);
    if (!isFinite(t)) return "";
    const s = (t - Date.now()) / 1000;
    if (Math.abs(s) < 45) return tr(lang, "just_now");
    const units = [["day", 86400], ["hour", 3600], ["minute", 60]];
    for (const [u, n] of units) if (Math.abs(s) >= n) {
      try { return new Intl.RelativeTimeFormat(lang, { numeric: "auto" }).format(Math.round(s / n), u); } catch (e) { return `${Math.round(-s / n)} ${u}`; }
    }
    return tr(lang, "just_now");
  }
  function stateText(hass, st, lang) {
    if (!st) return "";
    const d = domainOf(st.entity_id);
    if (RUN_DOMAINS.includes(d) && isFinite(Date.parse(st.state))) return relTime(st.state, lang);
    try { const f = hass?.formatEntityState?.(st); if (f) return f; } catch (e) { /* older HA */ }
    if (d === "weather") return WX_LABEL[st.state] || pretty(st.state);
    const u = st.attributes.unit_of_measurement;
    const n = parseFloat(st.state);
    if (isFinite(n) && String(n) === String(st.state).trim()) return `${n.toLocaleString(lang)}${u ? " " + u : ""}`;
    return pretty(st.state);
  }
  function areaOf(hass, id) {
    const e = hass?.entities?.[id];
    if (!e) return "";
    const aid = e.area_id || hass?.devices?.[e.device_id]?.area_id;
    return (aid && hass?.areas?.[aid]?.name) || "";
  }
  function toggleCall(hass, st) {
    if (!hass || !st) return;
    const id = st.entity_id, d = domainOf(id);
    if (d === "cover") return hass.callService("cover", "toggle", { entity_id: id });
    if (d === "lock") return hass.callService("lock", st.state === "locked" ? "unlock" : "lock", { entity_id: id });
    if (d === "media_player") return hass.callService("media_player", "media_play_pause", { entity_id: id });
    if (d === "climate") return hass.callService("climate", st.state === "off" ? "turn_on" : "turn_off", { entity_id: id });
    if (["light", "switch", "input_boolean", "fan", "automation", "siren", "humidifier"].includes(d)) return hass.callService(d, "toggle", { entity_id: id });
    if (d === "vacuum") return hass.callService("vacuum", st.state === "cleaning" ? "return_to_base" : "start", { entity_id: id });
    return hass.callService("homeassistant", "toggle", { entity_id: id });
  }
  function runCall(hass, st) {
    if (!hass || !st) return;
    const id = st.entity_id, d = domainOf(id);
    if (d === "scene" || d === "script") return hass.callService(d, "turn_on", { entity_id: id });
    if (d === "button" || d === "input_button") return hass.callService(d, "press", { entity_id: id });
  }

  /* -------------------------------------------------------- animated entity icons */
  // Colour of an entity, taken from the theme: accent for "on", semantic colours where they mean something.
  function aiColor(st) {
    if (!st) return "var(--muted)";
    const d = domainOf(st.entity_id), a = st.attributes || {}, s = st.state;
    if (s === "unavailable") return "var(--muted)";
    if (d === "light" && s === "on" && Array.isArray(a.rgb_color) && a.color_mode && !/color_temp|brightness|onoff|white/.test(a.color_mode)) return `rgb(${a.rgb_color.join(",")})`;
    if (d === "climate") { const act = a.hvac_action || s; return /cool|dry/.test(act) ? "var(--cool)" : /heat/.test(act) ? "var(--heat)" : s === "off" ? "var(--muted)" : "var(--acc)"; }
    if (d === "fan") return s === "on" ? "var(--cool)" : "var(--muted)";
    if (d === "lock") return s === "locked" ? "var(--battery)" : s === "unlocked" || s === "open" || s === "jammed" ? "var(--alert)" : "var(--acc)";
    if (d === "binary_sensor") {
      if (s !== "on") return "var(--muted)";
      const dc = a.device_class;
      if (["smoke", "gas", "problem", "safety", "moisture", "carbon_monoxide", "tamper", "heat"].includes(dc)) return "var(--alert)";
      if (["door", "window", "opening", "garage_door", "lock"].includes(dc)) return "var(--heat)";
      return "var(--acc)";
    }
    if (d === "sensor") {
      const dc = a.device_class;
      if (dc === "temperature") return "var(--heat)";
      if (dc === "humidity" || dc === "moisture" || dc === "water") return "var(--cool)";
      if (dc === "battery") return parseFloat(s) < 20 ? "var(--alert)" : "var(--battery)";
      if (["power", "energy", "current", "voltage", "apparent_power"].includes(dc)) return "var(--solar)";
      return "var(--acc)";
    }
    if (d === "weather" || d === "sun") return "var(--solar)";
    if (d === "person" || d === "device_tracker") return s === "home" ? "var(--battery)" : "var(--muted)";
    return isOn(st) ? "var(--acc)" : "var(--muted)";
  }

  // An SVG icon whose animation follows the entity's state. size in px; sw = stroke width (thinner for big icons).
  function animIcon(st, size = 24, sw = 1.8, iconOverride) {
    const d = domainOf(st?.entity_id), a = st?.attributes || {}, s = st?.state;
    const on = isOn(st);
    const svg = (body) => `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
    let kind = d, cls = "", extra = "", inner = "";
    if (iconOverride) return `<span class="ai ${on ? "on" : ""}" style="--ai:${aiColor(st)}"><ha-icon icon="${esc(iconOverride)}" style="--mdc-icon-size:${size}px;width:${size}px;height:${size}px"></ha-icon></span>`;
    switch (d) {
      case "light": {
        const bri = on ? (a.brightness ?? 255) / 255 : 0;
        extra = `--glow:${(3 + bri * 9).toFixed(1)}px;--ro:${on ? (0.35 + bri * 0.65).toFixed(2) : 0}`;
        inner = svg(`<g class="ai-rays">${[-76, -38, 0, 38, 76].map((r) => `<path d="M12 -1.6v2.1" transform="rotate(${r} 12 9.5)"></path>`).join("")}</g><path class="ai-bulb" d="${ICON.lights}"></path>`);
        break;
      }
      case "switch": case "input_boolean": case "automation": case "siren": case "humidifier":
        kind = "power";
        inner = svg(`<circle class="ai-ring" cx="12" cy="12" r="10.6" pathLength="100"></circle><path d="${ICON.power}" transform="translate(2.4 2.4) scale(.8)"></path>`);
        break;
      case "fan": {
        const pct = on ? (a.percentage ?? 100) : 0;
        extra = `--spd:${(1.7 - pct / 100 * 1.3).toFixed(2)}s`;
        const blade = "M12 12C10.4 9 10.4 4.4 12.9 3.6c2.4-.7 2.8 4.4-.9 8.4z";
        inner = svg(`<g class="ai-spin" fill="currentColor" stroke="none" opacity=".92"><path d="${blade}"></path><path d="${blade}" transform="rotate(120 12 12)"></path><path d="${blade}" transform="rotate(240 12 12)"></path></g><circle cx="12" cy="12" r="1.8" fill="currentColor" stroke="none"></circle><circle cx="12" cy="12" r="10.4" opacity=".35"></circle>`);
        break;
      }
      case "climate": {
        const act = a.hvac_action || s;
        if (/cool/.test(act)) { cls = "ai-cool"; inner = svg(`<g class="ai-spin"><path d="M12 2.5v19M3.8 7.2l16.4 9.6M3.8 16.8l16.4-9.6"></path><path d="M9.6 4.2 12 6.3l2.4-2.1M9.6 19.8 12 17.7l2.4 2.1M3.4 10.4l3.1.7-1 3M20.6 10.4l-3.1.7 1 3"></path></g>`); }
        else if (/heat/.test(act)) { cls = "ai-heat"; inner = svg(`<path class="ai-flame" d="M12 21.2c-3.7 0-6.2-2.5-6.2-5.8 0-3.5 2.7-5.1 3.5-8.7 2.5 1.4 3.7 3.5 3.7 5.4 1-.6 1.7-1.9 1.7-3.3 2.1 1.6 3.5 3.9 3.5 6.6 0 3.3-2.5 5.8-6.2 5.8z"></path>`); }
        else if (/dry/.test(act)) { cls = "ai-dry"; inner = svg(`<path class="ai-bobp" d="M12 3.2c3.3 4.2 5.6 7.4 5.6 10.4a5.6 5.6 0 0 1-11.2 0c0-3 2.3-6.2 5.6-10.4z"></path>`); }
        else if (/fan/.test(act)) { kind = "fan"; cls = "on"; extra = "--spd:1s"; const blade = "M12 12C10.4 9 10.4 4.4 12.9 3.6c2.4-.7 2.8 4.4-.9 8.4z"; inner = svg(`<g class="ai-spin" fill="currentColor" stroke="none"><path d="${blade}"></path><path d="${blade}" transform="rotate(120 12 12)"></path><path d="${blade}" transform="rotate(240 12 12)"></path></g>`); }
        else { const lv = a.current_temperature != null ? clamp((a.current_temperature - 10) / 25, 0.08, 1) : 0.5; extra = `--lv:${lv.toFixed(2)}`; cls = "ai-level"; inner = svg(`<path d="${ICON.climate}"></path><path class="ai-fillr" d="M12 17.6V8.8" stroke-width="${sw * 1.4}"></path>`); }
        break;
      }
      case "media_player":
        if (s === "playing") { cls = "ai-playing"; inner = svg(`<g fill="currentColor" stroke="none">${[[4, 0.9], [9.2, 1.2], [14.4, 0.8], [19.6, 1.05]].map(([x, dd], k) => `<rect class="ai-eqb" x="${x - 1.6}" y="4" width="3.2" height="16" rx="1.6" style="--d:${dd}s;--dl:${k * -0.23}s"></rect>`).join("")}</g>`); }
        else inner = svg(`<path d="${ICON.media}"></path>`);
        break;
      case "lock": {
        const moving = s === "locking" || s === "unlocking";
        cls = `${s === "locked" ? "" : "unl"} ${moving ? "moving" : ""}`;
        inner = svg(`<g class="ai-shackle"><path d="M8 11V7a4 4 0 0 1 8 0v4"></path></g><rect x="5" y="11" width="14" height="10" rx="2.5"></rect><path d="M12 15v2"></path>`);
        break;
      }
      case "cover": {
        const pos = a.current_position ?? (s === "open" || s === "opening" ? 100 : 0);
        const moving = s === "opening" || s === "closing";
        cls = moving ? "moving" : "";
        extra = `--cv:${(1 - pos / 100).toFixed(2)}`;
        inner = svg(`<rect x="3.5" y="3" width="17" height="18" rx="2"></rect><g class="ai-shut"><rect x="4.5" y="4" width="15" height="16" rx="1" fill="currentColor" fill-opacity=".22" stroke="none"></rect><path d="M4.5 8h15M4.5 12h15M4.5 16h15" stroke-width="${sw * 0.7}"></path></g>${moving ? `<path class="ai-arrow" d="${s === "opening" ? "M9 14l3-3 3 3" : "M9 10l3 3 3-3"}"></path>` : ""}`);
        break;
      }
      case "binary_sensor": {
        const dc = a.device_class;
        if (["door", "garage_door", "opening"].includes(dc)) { kind = "door"; inner = svg(`<path d="M5 21V4.5A1.5 1.5 0 0 1 6.5 3h11A1.5 1.5 0 0 1 19 4.5V21M3 21h18"></path><g class="ai-leaf"><path d="M6.5 21V4.6l9.5 1.2V21" fill="currentColor" fill-opacity=".18"></path><circle cx="13.5" cy="13" r=".9" fill="currentColor"></circle></g>`); }
        else if (dc === "window") { kind = "window"; inner = svg(`<rect x="4" y="3" width="16" height="18" rx="1.5"></rect><path d="M12 3v18"></path><g class="ai-leaf2"><rect x="12" y="4" width="7" height="16" fill="currentColor" fill-opacity=".18" stroke="none"></rect></g>`); }
        else if (["motion", "occupancy", "presence", "moving", "vibration", "sound"].includes(dc)) { kind = "ripple"; inner = svg(`<circle class="rp" cx="12" cy="12" r="9" style="--dl:0s"></circle><circle class="rp" cx="12" cy="12" r="9" style="--dl:-.9s"></circle><circle cx="12" cy="7" r="2.1"></circle><path d="M8.5 21l1.6-6.2L8 12l3-2.8h2L16 12l-2 2.8 1.5 6.2"></path>`); }
        else if (["moisture", "water"].includes(dc)) { kind = "ripple"; inner = svg(`<circle class="rp" cx="12" cy="19" r="4" style="--dl:0s"></circle><path d="M12 3.5c2.8 3.6 4.8 6.3 4.8 8.9a4.8 4.8 0 0 1-9.6 0c0-2.6 2-5.3 4.8-8.9z"></path>`); }
        else if (["smoke", "gas", "problem", "safety", "carbon_monoxide", "tamper", "heat"].includes(dc)) { kind = "alert"; inner = svg(`<path d="M12 3.5 21 19.5H3z"></path><path d="M12 10v4.2M12 17h.01"></path>`); }
        else if (dc === "connectivity" || dc === "plug" || dc === "power") { kind = "power"; inner = svg(`<circle class="ai-ring" cx="12" cy="12" r="10.6" pathLength="100"></circle><path d="${ICON.power}" transform="translate(2.4 2.4) scale(.8)"></path>`); }
        else { kind = "ripple"; inner = svg(`<circle class="rp" cx="12" cy="12" r="7" style="--dl:0s"></circle><circle cx="12" cy="12" r="4.2" fill="currentColor" fill-opacity=".35"></circle>`); }
        break;
      }
      case "sensor": {
        const dc = a.device_class, n = parseFloat(s);
        if (dc === "temperature") { kind = "level"; const lv = isFinite(n) ? clamp((n + 5) / 40, 0.06, 1) : 0.5; extra = `--lv:${lv.toFixed(2)}`; inner = svg(`<path d="${ICON.climate}"></path><path class="ai-fillr" d="M12 17.6V8.8" stroke-width="${sw * 1.4}"></path>`); }
        else if (dc === "humidity" || dc === "moisture") { kind = "level"; const lv = isFinite(n) ? clamp(n / 100, 0.05, 1) : 0.5; extra = `--lv:${lv.toFixed(2)}`; inner = svg(`<defs><clipPath id="agd"><path d="M12 3.2c3.3 4.2 5.6 7.4 5.6 10.4a5.6 5.6 0 0 1-11.2 0c0-3 2.3-6.2 5.6-10.4z"></path></clipPath></defs><g clip-path="url(#agd)"><rect class="ai-fillr2" x="5" y="3" width="14" height="17" fill="currentColor" fill-opacity=".35" stroke="none"></rect></g><path d="M12 3.2c3.3 4.2 5.6 7.4 5.6 10.4a5.6 5.6 0 0 1-11.2 0c0-3 2.3-6.2 5.6-10.4z"></path>`); }
        else if (dc === "battery") { kind = "level"; const lv = isFinite(n) ? clamp(n / 100, 0.04, 1) : 0.5; extra = `--lv:${lv.toFixed(2)}`; inner = svg(`<rect x="6" y="5" width="12" height="16" rx="2.2"></rect><path d="M10 3h4"></path><rect class="ai-fillr2" x="8" y="7" width="8" height="12" rx="1" fill="currentColor" fill-opacity=".55" stroke="none"></rect>`); }
        else if (["power", "energy", "current", "voltage", "apparent_power"].includes(dc)) { kind = "bolt"; cls = isFinite(n) && Math.abs(n) > 0 ? "on" : ""; inner = svg(`<path class="ai-bp" d="${ICON.energy}"></path>`); }
        else if (dc === "illuminance") { kind = "wx"; inner = svg(`<g class="ai-sunr"><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"></path></g><circle cx="12" cy="12" r="4.2" fill="currentColor" fill-opacity=".3"></circle>`); }
        else { kind = "chart"; inner = svg(`<path d="M4 20h16" opacity=".5"></path><path class="ai-line" pathLength="1" d="M4 16l4.5-5 3.5 3 3.5-6 4.5 4"></path>`); }
        break;
      }
      case "scene":
        inner = svg(`${[[12, 12, 7, 0], [5, 5.5, 3, -0.8], [19, 6, 2.6, -1.6]].map(([x, y, r, dl]) => `<path class="ai-star" style="--dl:${dl}s" d="M${x} ${y - r}C${x + r * 0.15} ${y - r * 0.15} ${x + r * 0.15} ${y - r * 0.15} ${x + r} ${y}C${x + r * 0.15} ${y + r * 0.15} ${x + r * 0.15} ${y + r * 0.15} ${x} ${y + r}C${x - r * 0.15} ${y + r * 0.15} ${x - r * 0.15} ${y + r * 0.15} ${x - r} ${y}C${x - r * 0.15} ${y - r * 0.15} ${x - r * 0.15} ${y - r * 0.15} ${x} ${y - r}z" fill="currentColor" fill-opacity=".25"></path>`).join("")}`);
        break;
      case "script":
        kind = "run";
        inner = svg(`<circle class="ai-ring" cx="12" cy="12" r="10.4" pathLength="100"></circle><path d="M9.5 7.8v8.4l7-4.2z" fill="currentColor" fill-opacity=".25"></path>`);
        break;
      case "button": case "input_button":
        kind = "run";
        inner = svg(`<circle cx="12" cy="12" r="9"></circle><circle cx="12" cy="12" r="4.5" fill="currentColor" fill-opacity=".3"></circle>`);
        break;
      case "vacuum":
        cls = s === "cleaning" ? "on" : "";
        inner = svg(`<circle cx="12" cy="12" r="9.4"></circle><g class="ai-spin"><circle cx="12" cy="12" r="4.2"></circle><path d="M12 7.8V5.2M16.2 12h2.6"></path></g>`);
        break;
      case "person": case "device_tracker":
        if (s === "home") { kind = "home"; inner = svg(`<path d="${ICON.home}"></path>`); }
        else { kind = "away"; inner = svg(`<g class="ai-pin"><path d="M12 21s-6-5.4-6-10.2a6 6 0 0 1 12 0C18 15.6 12 21 12 21z"></path><circle cx="12" cy="10.6" r="2.2"></circle></g>`); }
        break;
      case "weather": case "sun":
        kind = "wx";
        inner = svg(`<g class="ai-sunr"><path d="M9 1.8v1.6M9 14.6v1.6M1.8 9h1.6M14.6 9h1.6M3.9 3.9l1.1 1.1M13 13l1.1 1.1M3.9 14.1 5 13M13 5l1.1-1.1"></path></g><circle cx="9" cy="9" r="3.4" fill="currentColor" fill-opacity=".3"></circle>${s !== "sunny" && s !== "clear-night" && s !== "above_horizon" ? `<path class="ai-cl" d="M9.5 20.5h8.3a3.7 3.7 0 0 0 .2-7.4 5 5 0 0 0-9.4 1.3 3.1 3.1 0 0 0 .9 6.1z" fill="var(--ground)"></path>` : ""}`);
        break;
      default:
        if (a.icon) return `<span class="ai ${on ? "on" : ""}" style="--ai:${aiColor(st)}"><ha-icon icon="${esc(a.icon)}" style="--mdc-icon-size:${size}px;width:${size}px;height:${size}px"></ha-icon></span>`;
        inner = svg(`<circle cx="12" cy="12" r="8.5"></circle><circle cx="12" cy="12" r="3" fill="currentColor"></circle>`);
    }
    return `<span class="ai ai-${kind} ${on ? "on" : ""} ${cls}" style="--ai:${aiColor(st)};${extra}">${inner}</span>`;
  }

  function weatherArt(cond, dark, w = 96, h = 72) {
    const sun = ["sunny", "partlycloudy", "windy", "exceptional"].includes(cond);
    const moon = cond === "clear-night";
    const cloud = !["sunny", "clear-night"].includes(cond);
    const rain = ["rainy", "pouring", "lightning-rainy", "snowy-rainy"].includes(cond);
    const snow = ["snowy", "snowy-rainy"].includes(cond);
    return `<svg width="${w}" height="${h}" viewBox="0 0 120 90" aria-hidden="true" style="flex:none;overflow:visible">
      ${sun ? `<g class="rays"><path d="M46 8v8M46 62v8M15 39h8M69 39h8M24 17l6 6M62 55l6 6M24 61l6-6M62 23l6-6" fill="none" stroke-width="3" stroke-linecap="round" style="stroke:var(--solar)"></path></g><circle cx="46" cy="39" r="15" style="fill:var(--solar);filter:drop-shadow(0 0 10px var(--solar))"></circle>` : ""}
      ${moon ? `<path d="M60 18a24 24 0 1 0 22 32 20 20 0 0 1-22-32z" style="fill:var(--text);opacity:.85"></path>` : ""}
      ${cloud ? `<g class="cloud"><path d="M50 80h46a14 14 0 0 0 0-28 20 20 0 0 0-38-4 16 16 0 0 0-8 32z" style="fill:${dark ? "rgba(255,255,255,0.82)" : "#fff"};filter:drop-shadow(0 6px 10px rgba(0,0,0,.18))"></path></g>` : ""}
      ${rain || snow ? [62, 76, 90].map((x, k) => `<circle class="drop" cx="${x}" cy="86" r="${snow ? 2.6 : 2}" style="fill:${snow ? "var(--text)" : "var(--cool)"};--dl:${k * -0.35}s"></circle>`).join("") : ""}
    </svg>`;
  }

  const ANIM_CSS = `
  .ai{display:inline-flex;align-items:center;justify-content:center;flex:none;color:var(--ai);line-height:0;transition:color .4s}
  .ai svg{overflow:visible;display:block}
  .ai svg *{transform-box:view-box}
  .ai-rays path{opacity:0;transition:opacity .5s}
  .ai-light.on .ai-rays path{opacity:var(--ro);animation:agRay 2.8s ease-in-out infinite}
  .ai-light .ai-bulb{transition:fill .5s,filter .6s}
  .ai-light.on .ai-bulb{fill:color-mix(in srgb,var(--ai) 38%,transparent);filter:drop-shadow(0 0 var(--glow) var(--ai))}
  .ai-ring{stroke-dasharray:0 100;opacity:0;transition:stroke-dasharray .7s cubic-bezier(.2,.8,.2,1),opacity .4s;transform-origin:12px 12px}
  .ai-power.on .ai-ring,.ai-run.on .ai-ring{stroke-dasharray:30 70;opacity:1;animation:agSpin 2.6s linear infinite}
  .ai-run.on .ai-ring{animation-duration:1.1s}
  .ai-power.on svg{filter:drop-shadow(0 0 5px color-mix(in srgb,var(--ai) 70%,transparent))}
  .ai-spin{transform-origin:12px 12px}
  .ai-fan.on .ai-spin{animation:agSpin var(--spd,1s) linear infinite}
  .ai-climate.ai-cool .ai-spin{animation:agSpin 9s linear infinite}
  .ai-flame{transform-origin:12px 21px;animation:agFlick 1.1s ease-in-out infinite alternate;fill:color-mix(in srgb,var(--ai) 30%,transparent)}
  .ai-bobp{animation:agBob 1.8s ease-in-out infinite;fill:color-mix(in srgb,var(--ai) 25%,transparent)}
  .ai-eqb{transform-origin:center 20px;animation:agEq var(--d) ease-in-out infinite;animation-delay:var(--dl)}
  .ai-shackle{transition:transform .45s cubic-bezier(.3,1.7,.5,1)}
  .ai-lock.unl .ai-shackle{transform:translateY(-3px)}
  .ai-lock.moving svg{animation:agShake .45s ease-in-out infinite}
  .ai-shut{transform-origin:12px 4px;transform:scaleY(var(--cv,1));transition:transform 1s cubic-bezier(.2,.8,.2,1)}
  .ai-arrow{animation:agBob 1s ease-in-out infinite}
  .ai-leaf{transform-origin:6.5px 12px;transition:transform .6s cubic-bezier(.3,1.4,.5,1)}
  .ai-door.on .ai-leaf{transform:scaleX(.55)}
  .ai-leaf2{transform-origin:19px 12px;transition:transform .6s cubic-bezier(.3,1.4,.5,1)}
  .ai-window.on .ai-leaf2{transform:scaleX(.35)}
  .ai-ripple .rp{opacity:0;transform-origin:12px 12px}
  .ai-ripple.on .rp{animation:agRip 1.8s ease-out infinite;animation-delay:var(--dl)}
  .ai-alert.on svg{animation:agPulse 1.1s ease-in-out infinite}
  .ai-alert.on path:first-child{fill:color-mix(in srgb,var(--ai) 25%,transparent)}
  .ai-fillr{transform-origin:12px 17.6px;transform:scaleY(var(--lv,.5));transition:transform .9s cubic-bezier(.2,.8,.2,1)}
  .ai-fillr2{transform-origin:12px 20px;transform:scaleY(var(--lv,.5));transition:transform .9s cubic-bezier(.2,.8,.2,1)}
  .ai-bolt .ai-bp{transition:fill .4s}
  .ai-bolt.on .ai-bp{fill:color-mix(in srgb,var(--ai) 35%,transparent);animation:agFlick2 2.4s ease-in-out infinite}
  .ai .ai-star{transform-box:fill-box;transform-origin:center;animation:agTw 2.6s ease-in-out infinite;animation-delay:var(--dl)}
  .ai-vacuum.on .ai-spin{animation:agSpin 1.4s linear infinite}
  .ai-pin{animation:agBob 1.8s ease-in-out infinite}
  .ai-sunr{transform-origin:9px 9px;animation:agSpin 22s linear infinite}
  .ai-sensor .ai-sunr,.ai-wx.on .ai-sunr{transform-origin:12px 12px}
  .ai-cl{animation:agFloat 6s ease-in-out infinite}
  .ai-line{stroke-dasharray:1;stroke-dashoffset:1;animation:agDraw 1.6s cubic-bezier(.3,.7,.2,1) forwards}
  @keyframes agRay{0%,100%{opacity:var(--ro)}50%{opacity:calc(var(--ro) * .35)}}
  @keyframes agFlick{0%{transform:scale(1,1)}100%{transform:scale(.9,1.09)}}
  @keyframes agShake{0%,100%{transform:rotate(0)}25%{transform:rotate(-9deg)}75%{transform:rotate(9deg)}}
  @keyframes agBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-1.6px)}}
  @keyframes agRip{0%{transform:scale(.35);opacity:.9}100%{transform:scale(1.35);opacity:0}}
  @keyframes agPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.14)}}
  @keyframes agFlick2{0%,44%,56%,100%{opacity:1}50%{opacity:.5}}
  @keyframes agTw{0%,100%{transform:scale(.62);opacity:.55}50%{transform:scale(1.08);opacity:1}}
  @keyframes agDraw{to{stroke-dashoffset:0}}
  @keyframes agSpin{to{transform:rotate(360deg)}}
  @keyframes agEq{0%,100%{transform:scaleY(.22)}50%{transform:scaleY(1)}}
  @keyframes agFloat{0%,100%{transform:translateX(0)}50%{transform:translateX(9px)}}
  `;

  /* ------------------------------------------------ built-in weather service (Open-Meteo) */
  // Free, no account or API key. Used when a weather widget has `source: open_meteo`.
  const OM_ID = "weather.aurora_open_meteo";
  const OM_CACHE = {};
  const OM_LISTENERS = new Set();
  function omCondition(code, day) {
    if (code === 0) return day ? "sunny" : "clear-night";
    if (code === 1 || code === 2) return day ? "partlycloudy" : "clear-night";
    if (code === 3) return "cloudy";
    if (code === 45 || code === 48) return "fog";
    if (code === 65 || code === 82) return "pouring";
    if (code === 66 || code === 67) return "snowy-rainy";
    if ((code >= 71 && code <= 77) || code === 85 || code === 86) return "snowy";
    if (code >= 95) return "lightning-rainy";
    if ((code >= 51 && code <= 64) || code === 80 || code === 81) return "rainy";
    return "cloudy";
  }
  function omPlace(hass, w) {
    const lat = Number(w.latitude ?? hass?.config?.latitude), lon = Number(w.longitude ?? hass?.config?.longitude);
    if (!isFinite(lat) || !isFinite(lon)) return null;
    const imperial = hass?.config?.unit_system?.temperature === "°F";
    return { lat: Math.round(lat * 100) / 100, lon: Math.round(lon * 100) / 100, imperial, name: w.location_name || hass?.config?.location_name || "Home" };
  }
  const omKey = (p) => `${p.lat},${p.lon},${p.imperial ? "i" : "m"}`;
  function omFetch(p) {
    const k = omKey(p), c = OM_CACHE[k];
    if (c && (c.loading || Date.now() - c.at < 15 * 60e3)) return c;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${p.lat}&longitude=${p.lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,pressure_msl,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min&forecast_days=5&timezone=auto${p.imperial ? "&temperature_unit=fahrenheit&wind_speed_unit=mph" : ""}`;
    OM_CACHE[k] = { ...(c || {}), loading: true, at: c?.at || 0 };
    fetch(url).then((r) => (r.ok ? r.json() : Promise.reject(new Error(`Open-Meteo ${r.status}`)))).then((j) => {
      OM_CACHE[k] = { at: Date.now(), data: j };
    }).catch((e) => {
      OM_CACHE[k] = { at: Date.now() - 13 * 60e3, data: c?.data, error: e.message };   // retry in ~2 minutes
    }).finally(() => OM_LISTENERS.forEach((fn) => fn()));
    return OM_CACHE[k];
  }
  // A weather "state" shaped like a Home Assistant weather entity, so the widget and the pop-up treat both alike.
  function omState(hass, w) {
    const p = omPlace(hass, w);
    if (!p) return null;
    const c = omFetch(p), j = c.data;
    if (!j || !j.current) return { entity_id: OM_ID, state: "unknown", attributes: { friendly_name: p.name, attribution: "Open-Meteo", aurora_loading: !c.error, aurora_error: c.error }, last_changed: new Date().toISOString() };
    const cur = j.current;
    const st = {
      entity_id: OM_ID, state: omCondition(cur.weather_code, !!cur.is_day),
      attributes: {
        friendly_name: p.name, attribution: "Open-Meteo", temperature: cur.temperature_2m, humidity: cur.relative_humidity_2m,
        wind_speed: cur.wind_speed_10m, wind_speed_unit: p.imperial ? "mph" : "km/h", pressure: cur.pressure_msl, pressure_unit: "hPa",
        temperature_unit: p.imperial ? "°F" : "°C", supported_features: 0
      },
      last_changed: new Date(c.at).toISOString(), last_updated: new Date(c.at).toISOString()
    };
    const d = j.daily || {};
    st.aurora_forecast = (d.time || []).map((t, i) => ({ datetime: `${t}T12:00:00`, condition: omCondition(d.weather_code[i], true), temperature: d.temperature_2m_max[i], templow: d.temperature_2m_min[i] }));
    return st;
  }

  /* ================================================================ glass pop-up */
  const POP_CSS = `
  :host{display:contents}
  dialog.pop{position:fixed;inset:0;margin:auto;width:min(440px,calc(100vw - 32px));max-width:none;max-height:calc(100dvh - 40px);padding:0;border:0;background:transparent;color:var(--text);overflow:visible;font-family:'Figtree',var(--ha-font-family-body,system-ui),-apple-system,sans-serif}
  dialog.pop:focus{outline:none}
  dialog.pop::backdrop{background:var(--scrim,rgba(4,6,14,.45));backdrop-filter:blur(7px) saturate(120%);-webkit-backdrop-filter:blur(7px) saturate(120%);animation:agFade .35s ease both}
  dialog.pop.closing::backdrop{animation:agFadeOut .3s ease both}
  .sheet{position:relative;display:flex;flex-direction:column;gap:18px;max-height:calc(100dvh - 40px);overflow:hidden auto;overscroll-behavior:contain;padding:18px 20px 20px;border-radius:32px;
    background:color-mix(in srgb,var(--ground) 64%,transparent);backdrop-filter:blur(calc(var(--blur) + 14px)) saturate(170%);-webkit-backdrop-filter:blur(calc(var(--blur) + 14px)) saturate(170%);
    border:1px solid var(--border);box-shadow:inset 0 1px 0 var(--hi),0 40px 90px -30px rgba(0,0,0,.7);transform-origin:center}
  .sheet:focus{outline:none}
  .sheet>*:not(.halo){position:relative;z-index:1}
  .halo{position:absolute;left:-25%;right:-25%;top:-140px;height:340px;z-index:0;pointer-events:none;background:radial-gradient(closest-side,color-mix(in srgb,var(--ai) 34%,transparent),transparent);opacity:.35;transition:opacity .8s,background .8s}
  .halo.on{opacity:.9;animation:agBreath 6s ease-in-out infinite}
  .grab{display:none;width:44px;height:5px;border-radius:9px;background:var(--track);margin:-8px auto -6px;flex:none}
  @media (max-width:600px){
    dialog.pop{margin:auto 0 0;width:100vw;max-height:92dvh}
    .sheet{border-radius:30px 30px 0 0;max-height:92dvh;padding-bottom:calc(22px + env(safe-area-inset-bottom));border-bottom:0}
    .grab{display:block}
  }
  .ph{display:flex;align-items:center;gap:14px;touch-action:none}
  .pic{width:56px;height:56px;border-radius:18px;display:flex;align-items:center;justify-content:center;flex:none;background:color-mix(in srgb,var(--ai) 16%,transparent);border:1px solid color-mix(in srgb,var(--ai) 38%,transparent);transition:background .5s,border-color .5s}
  .pt{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}
  .pt b{font-size:18px;font-weight:700;letter-spacing:-.01em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .pt span{font-size:13px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .xb{width:44px;height:44px;border-radius:99px;display:flex;align-items:center;justify-content:center;flex:none}
  .hero{display:flex;align-items:center;justify-content:center;gap:22px;min-height:100px;flex-wrap:wrap}
  .hero .ai svg{stroke-width:1.15}
  .slab{position:relative;width:120px;height:250px;border-radius:38px;overflow:hidden;background:var(--off);border:1px solid var(--faint);touch-action:none;cursor:ns-resize;box-shadow:inset 0 1px 0 var(--hi);flex:none;outline:none}
  .slab:focus-visible{box-shadow:0 0 0 3px color-mix(in srgb,var(--ai) 60%,transparent)}
  .slab>i{position:absolute;left:0;right:0;bottom:0;height:var(--v);background:linear-gradient(to top,color-mix(in srgb,var(--ai) 92%,transparent),color-mix(in srgb,var(--ai) 62%,transparent));box-shadow:0 0 50px color-mix(in srgb,var(--ai) 55%,transparent);transition:height .5s cubic-bezier(.2,.8,.2,1)}
  .slab.drag>i{transition:none}
  .slab.tog{cursor:pointer}
  .slab .sv{position:absolute;left:0;right:0;top:20px;text-align:center;font-size:26px;pointer-events:none}
  .slab .sic{position:absolute;left:50%;bottom:20px;transform:translateX(-50%);pointer-events:none}
  .slab .sic .ai{color:rgba(255,255,255,.95);filter:drop-shadow(0 1px 3px rgba(0,0,0,.35))}
  .side{display:flex;flex-direction:column;align-items:center;gap:12px}
  .cbtn{width:60px;height:60px;border-radius:22px;display:flex;align-items:center;justify-content:center;background:var(--off);border:1px solid var(--faint);color:var(--muted);transition:background .35s,color .35s,border-color .35s,transform .2s}
  .cbtn:active{transform:scale(.94)}
  .cbtn.on{background:var(--ai);border-color:var(--ai);color:var(--on-acc);box-shadow:0 12px 34px -12px var(--ai)}
  .cbtn.big{width:72px;height:72px;border-radius:99px}
  .clabel{font-size:12px;color:var(--muted)}
  .grp{display:flex;flex-direction:column;gap:10px}
  .lbl{font-size:12px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--muted)}
  .chips2{display:flex;flex-wrap:wrap;gap:8px}
  .chipb{min-height:40px;padding:0 15px;border-radius:99px;font-size:14px;font-weight:600;background:var(--off);border:1px solid var(--faint);color:var(--muted);transition:background .3s,color .3s,border-color .3s}
  .chipb.on{background:color-mix(in srgb,var(--ai) 20%,transparent);border-color:color-mix(in srgb,var(--ai) 60%,transparent);color:var(--text)}
  .swr{display:flex;flex-wrap:wrap;gap:10px}
  .sw2{width:38px;height:38px;border-radius:99px;background:var(--c);box-shadow:inset 0 0 0 1px rgba(0,0,0,.15);transition:transform .2s}
  .sw2:active{transform:scale(.9)}
  .rng{display:flex;flex-direction:column;gap:6px}
  .rng input{width:100%}
  input.ct::-webkit-slider-runnable-track{background:linear-gradient(90deg,#ff9d4d,#ffe7c4 45%,#e8f1ff 70%,#a9cbff)}
  input.ct::-moz-range-track{background:linear-gradient(90deg,#ff9d4d,#ffe7c4 45%,#e8f1ff 70%,#a9cbff)}
  .stats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
  .stat{display:flex;flex-direction:column;gap:2px;padding:10px 12px;border-radius:16px;background:var(--off);border:1px solid var(--faint);min-width:0}
  .stat span{font-size:12px;color:var(--muted)}
  .stat b{font-size:16px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-variant-numeric:tabular-nums}
  .chart{position:relative;height:120px;border-radius:18px;overflow:hidden;background:var(--off);border:1px solid var(--faint)}
  .chart svg{position:absolute;inset:0;width:100%;height:100%}
  .chart .ln{fill:none;stroke:var(--ai);stroke-width:2.2;stroke-linejoin:round;stroke-linecap:round;stroke-dasharray:1;stroke-dashoffset:1;animation:agDraw 1.5s cubic-bezier(.3,.7,.2,1) .15s forwards}
  .chart .ar{opacity:0;animation:agFade 1s ease .7s forwards}
  .chart .dotn{fill:var(--ai);stroke:var(--ground);stroke-width:2;opacity:0;animation:agFade .4s ease 1.5s forwards}
  .empty{display:flex;align-items:center;justify-content:center;height:100%;font-size:13px;color:var(--muted)}
  .tl{display:flex;height:16px;border-radius:99px;overflow:hidden;background:var(--off);border:1px solid var(--faint)}
  .tl i{height:100%;transform-origin:left;animation:agGrow .9s cubic-bezier(.2,.8,.2,1) both}
  .bigv{display:flex;align-items:baseline;justify-content:center;gap:6px}
  .bigv .disp{font-size:58px;letter-spacing:-.04em;line-height:1}
  .bigv span{font-size:18px;color:var(--muted)}
  .pfoot{display:flex;align-items:center;justify-content:space-between;gap:10px;padding-top:14px;border-top:1px solid var(--faint);font-size:13px;color:var(--muted)}
  .link{min-height:40px;padding:0 14px;border-radius:99px;font-weight:600;color:var(--text);display:flex;align-items:center;gap:6px}
  .stag>*:not(.halo){animation:agIn .6s cubic-bezier(.2,.8,.2,1) both;animation-delay:calc(var(--j,0) * 55ms + 90ms)}
  .orbw{position:relative;width:150px;height:150px;flex:none}
  .orb2{position:absolute;inset:0;border-radius:99px;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle at 35% 30%,color-mix(in srgb,var(--ai) 70%,#fff 10%),color-mix(in srgb,var(--ai) 55%,transparent));color:var(--on-acc);box-shadow:0 20px 60px -18px var(--ai),inset 0 1px 0 rgba(255,255,255,.4);transition:transform .2s}
  .orb2:active{transform:scale(.95)}
  .orbw .wave{position:absolute;inset:0;border-radius:99px;border:2px solid var(--ai);opacity:0;pointer-events:none}
  .orbw.burst .wave{animation:agBurst 1s ease-out both}
  .orbw.burst .wave:nth-child(2){animation-delay:.18s}
  .art2{width:100%;aspect-ratio:16/10;border-radius:24px;display:flex;align-items:center;justify-content:center;background:color-mix(in srgb,var(--ai) 16%,transparent) center/cover no-repeat;border:1px solid color-mix(in srgb,var(--ai) 35%,transparent);color:var(--ai);overflow:hidden}
  .mtt{display:flex;flex-direction:column;gap:4px;text-align:center}
  .mtt b{font-size:19px}
  .mtt span{font-size:14px;color:var(--muted)}
  .prog{height:6px;border-radius:99px;background:var(--track);overflow:hidden}
  .prog i{display:block;height:100%;border-radius:99px;background:var(--ai);transition:width 1s linear}
  .ptime{display:flex;justify-content:space-between;font-size:12px;color:var(--muted);font-variant-numeric:tabular-nums}
  .mctl{display:flex;align-items:center;justify-content:center;gap:18px}
  .vol{display:flex;align-items:center;gap:12px}
  .vol input{flex:1;min-width:0}
  .ring2{position:relative;width:210px;height:210px;flex:none}
  .ring2 svg{transform:rotate(135deg)}
  .ring2 circle{fill:none;stroke-width:12;stroke-linecap:round}
  .ring2 .rf{transition:stroke-dasharray .6s cubic-bezier(.2,.8,.2,1),stroke .4s}
  .ring2 .in{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px}
  .ring2 .disp{font-size:52px;letter-spacing:-.04em;line-height:1}
  .stepper2{display:flex;align-items:center;justify-content:center;gap:16px}
  .fc{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:6px}
  .fcd{display:flex;flex-direction:column;align-items:center;gap:4px;padding:10px 4px;border-radius:16px;background:var(--off);border:1px solid var(--faint);font-size:12px;color:var(--muted);min-width:0}
  .fcd b{font-size:15px;color:var(--text)}
  .attrs{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
  .shutter{position:relative;width:150px;height:200px;border-radius:22px;overflow:hidden;background:linear-gradient(color-mix(in srgb,var(--cool) 25%,transparent),color-mix(in srgb,var(--solar) 18%,transparent));border:1px solid var(--border);flex:none}
  .shutter .sl{position:absolute;left:0;right:0;top:0;height:var(--cp);background:repeating-linear-gradient(to bottom,color-mix(in srgb,var(--text) 22%,var(--ground)) 0 13px,color-mix(in srgb,var(--text) 12%,var(--ground)) 13px 16px);transition:height 1s cubic-bezier(.2,.8,.2,1);box-shadow:0 6px 18px rgba(0,0,0,.35)}
  .lockbig{width:150px;height:150px;border-radius:99px;display:flex;align-items:center;justify-content:center;background:color-mix(in srgb,var(--ai) 14%,transparent);border:1.5px solid color-mix(in srgb,var(--ai) 45%,transparent);box-shadow:0 0 60px -10px color-mix(in srgb,var(--ai) 50%,transparent)}
  .bigicon{width:150px;height:150px;border-radius:99px;display:flex;align-items:center;justify-content:center;background:color-mix(in srgb,var(--ai) 12%,transparent);border:1.5px solid color-mix(in srgb,var(--ai) 35%,transparent)}
  .bigicon.on{box-shadow:0 0 0 10px color-mix(in srgb,var(--ai) 7%,transparent),0 0 60px -6px color-mix(in srgb,var(--ai) 60%,transparent)}
  .err{font-size:13px;color:var(--alert)}
  @keyframes agFade{from{opacity:0}to{opacity:1}}
  @keyframes agFadeOut{from{opacity:1}to{opacity:0}}
  @keyframes agBreath{0%,100%{transform:scale(1);opacity:.75}50%{transform:scale(1.12);opacity:1}}
  @keyframes agGrow{from{transform:scaleX(0)}to{transform:none}}
  @keyframes agBurst{0%{transform:scale(1);opacity:.85}100%{transform:scale(1.6);opacity:0}}
  `;

  class AuroraGlassPopup extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this._hist = {};
      this._pend = {};
      this._drag = null;
    }
    static get() {
      let p = document.querySelector("aurora-glass-popup");
      if (!p) { p = document.createElement("aurora-glass-popup"); document.body.appendChild(p); }
      return p;
    }
    // Owners (cards) push every hass update; only the card that opened the pop-up drives it.
    static sync(owner, hass) {
      const p = document.querySelector("aurora-glass-popup");
      if (p && p._o && p._o.owner === owner) p.hass = hass;
    }
    set hass(h) { this._hass = h; this._schedule(); }

    get _lang() { return this._o?.lang || "en"; }
    _t(k, v) { return tr(this._lang, k, v); }
    _st() { return this._o?.getState ? this._o.getState() : this._hass?.states?.[this._ent]; }
    _call(d, s, data) { this._hass?.callService(d, s, data); }
    _num(v, dgt = 1) { try { return Number(v).toLocaleString(this._lang, { minimumFractionDigits: dgt, maximumFractionDigits: dgt }); } catch (e) { return Number(v).toFixed(dgt); } }

    _build() {
      this.shadowRoot.innerHTML = `<style>${CSS}${ANIM_CSS}${POP_CSS}</style><dialog class="pop" aria-modal="true"><div class="sheet" role="document" tabindex="-1" autofocus></div></dialog>`;
      this._dlg = this.shadowRoot.querySelector("dialog");
      this._sheet = this.shadowRoot.querySelector(".sheet");
      const sr = this.shadowRoot;
      this._dlg.addEventListener("cancel", (e) => { e.preventDefault(); this.close(); });
      this._dlg.addEventListener("click", (e) => { if (e.target === this._dlg) this.close(); });
      sr.addEventListener("click", (e) => this._onClick(e));
      sr.addEventListener("change", (e) => this._onChange(e));
      sr.addEventListener("input", (e) => this._onInputLive(e));
      sr.addEventListener("pointerdown", (e) => this._onDown(e));
      sr.addEventListener("pointermove", (e) => this._onMove(e));
      sr.addEventListener("pointerup", (e) => this._onUp(e));
      sr.addEventListener("pointercancel", (e) => this._onUp(e, true));
      sr.addEventListener("keydown", (e) => this._onKey(e));
    }

    /* o: { owner, hass, entity, name, origin (DOMRect), vars, motion, lang, scrim } */
    open(o) {
      if (!this._dlg) this._build();
      if (this._dlg.open) { this._finishClose(); }
      this._o = o;
      this._hass = o.hass;
      this._ent = o.entity;
      this._pend = {};
      this._fc = null;
      this._dlg.setAttribute("style", `${o.vars};--scrim:${o.scrim || "rgba(4,6,14,.45)"}`);
      this._dlg.classList.toggle("still", !o.motion);
      this._first = true;
      this._render();
      this._dlg.showModal();
      this._sheet.scrollTop = 0;
      this._animateIn();
      this._first = false;
      setTimeout(() => this._sheet?.classList.remove("stag"), 1400);
      clearInterval(this._tick);
      this._tick = setInterval(() => this._render(), 1000);
      this._subForecast();
      this._loadHist();
    }

    _reduced() { return !this._o?.motion || matchMedia("(prefers-reduced-motion: reduce)").matches; }
    _mobile() { return matchMedia("(max-width:600px)").matches; }

    _animateIn() {
      const sh = this._sheet;
      if (this._reduced() || !sh.animate) return;
      if (this._mobile()) { sh.animate([{ transform: "translateY(100%)" }, { transform: "none" }], { duration: 460, easing: "cubic-bezier(.2,.9,.25,1)" }); return; }
      const r = sh.getBoundingClientRect(), o = this._o.origin;
      if (o && o.width) {
        const dx = o.left + o.width / 2 - (r.left + r.width / 2), dy = o.top + o.height / 2 - (r.top + r.height / 2);
        const s = clamp(Math.min(o.width / r.width, o.height / r.height), 0.12, 1);
        sh.animate([{ transform: `translate(${dx}px,${dy}px) scale(${s})`, opacity: 0, borderRadius: "28px" }, { opacity: 1, offset: 0.3 }, { transform: "none", opacity: 1 }],
          { duration: 540, easing: "cubic-bezier(.2,.95,.3,1.1)" });
      } else sh.animate([{ transform: "scale(.9)", opacity: 0 }, { transform: "none", opacity: 1 }], { duration: 380, easing: "cubic-bezier(.2,.9,.3,1.15)" });
    }

    close() {
      if (!this._dlg || !this._dlg.open || this._closing) return;
      this._closing = true;
      clearInterval(this._tick);
      if (this._unsub) { try { this._unsub(); } catch (e) { /* closed */ } this._unsub = null; }
      const sh = this._sheet;
      if (this._reduced() || !sh.animate) return this._finishClose();
      this._dlg.classList.add("closing");
      let a;
      const cur = sh.style.transform || "none";
      if (this._mobile()) a = sh.animate([{ transform: cur }, { transform: "translateY(105%)" }], { duration: 300, easing: "cubic-bezier(.4,0,.8,.6)" });
      else {
        const r = sh.getBoundingClientRect(), o = this._o?.origin;
        if (o && o.width) {
          const dx = o.left + o.width / 2 - (r.left + r.width / 2), dy = o.top + o.height / 2 - (r.top + r.height / 2);
          const s = clamp(Math.min(o.width / r.width, o.height / r.height), 0.12, 1);
          a = sh.animate([{ transform: "none", opacity: 1 }, { opacity: 1, offset: 0.6 }, { transform: `translate(${dx}px,${dy}px) scale(${s})`, opacity: 0 }], { duration: 320, easing: "cubic-bezier(.4,0,.6,1)" });
        } else a = sh.animate([{ transform: "none", opacity: 1 }, { transform: "scale(.94)", opacity: 0 }], { duration: 240, easing: "ease-in" });
      }
      const tok = (this._tok = (this._tok || 0) + 1);
      this._closeAnim = a;
      a.onfinish = () => { if (this._tok === tok) this._finishClose(); };
    }
    _finishClose() {
      this._tok = (this._tok || 0) + 1;
      if (this._closeAnim) { try { this._closeAnim.cancel(); } catch (e) { /* done */ } this._closeAnim = null; }
      clearInterval(this._tick);
      if (this._unsub) { try { this._unsub(); } catch (e) { /* closed */ } this._unsub = null; }
      if (this._dlg?.open) this._dlg.close();
      this._dlg?.classList.remove("closing");
      if (this._sheet) this._sheet.style.transform = "";
      this._closing = false;
      this._o = null;
      this._drag = null;
    }

    _schedule() {
      if (this._raf || !this._o) return;
      this._raf = requestAnimationFrame(() => { this._raf = 0; this._render(); });
    }

    _render() {
      if (!this._o || !this._sheet) return;
      const st = this._st();
      const tpl = document.createElement("template");
      tpl.innerHTML = `<div>${this._html(st)}</div>`;
      const next = tpl.content.firstElementChild;
      [...next.children].forEach((c, j) => c.style.setProperty("--j", j));
      next.className = `sheet${this._first ? " stag" : this._sheet.classList.contains("stag") ? " stag" : ""}`;
      next.setAttribute("style", `--ai:${aiColor(st)}${this._sheet.style.transform ? `;transform:${this._sheet.style.transform}` : ""}`);
      next.setAttribute("role", "document");
      next.setAttribute("tabindex", "-1");
      next.setAttribute("autofocus", "");
      morph(this._sheet, next, this.shadowRoot.activeElement);
    }

    /* ----- markup */
    _html(st) {
      const t = (k, v) => this._t(k, v);
      const name = this._o.name || st?.attributes?.friendly_name || this._ent;
      const area = st ? areaOf(this._hass, this._ent) : "";
      const sub = st ? [stateText(this._hass, st, this._lang), area].filter(Boolean).join(" · ") : this._ent;
      const head = `<div class="grab" data-swipe="1"></div>
        <div class="ph" data-swipe="1"><div class="pic">${st ? animIcon(st, 30, 1.7, this._o.icon) : ""}</div>
        <div class="pt"><b>${esc(name)}</b><span>${esc(sub)}</span></div>
        ${this._o.virtual ? "" : `<button class="xb glass2" data-act="native" aria-label="${t("more_details")}" title="${t("more_details")}">${svgIcon(ICON.dots, 22, 2.6)}</button>`}
        <button class="xb glass2" data-act="close" aria-label="${t("close")}" title="${t("close")}">${svgIcon(ICON.x, 18, 2)}</button></div>`;
      if (!st) return `<div class="halo"></div>${head}<div class="err">${esc(t("not_found", { e: this._ent }))}</div>`;
      const d = domainOf(this._ent);
      const fn = this[`_p_${d}`] || (RUN_DOMAINS.includes(d) ? this._p_run : null) || (d === "input_boolean" || d === "automation" || d === "siren" || d === "humidifier" ? this._p_switch : null) || (d === "person" ? this._p_device_tracker : null) || this._p_default;
      let body = "";
      try { body = fn.call(this, st, t); } catch (e) { body = `<div class="err">${esc(e.message)}</div>`; }
      const foot = this._o.virtual
        ? `<div class="pfoot"><span>${esc(t("updated", { t: relTime(st.last_changed, this._lang) }))}</span><span>${esc(st.attributes.attribution || "")}</span></div>`
        : `<div class="pfoot"><span>${esc(t("changed", { t: relTime(st.last_changed, this._lang) }))}</span><button class="link glass2" data-act="native">${esc(t("more_details"))}</button></div>`;
      return `<div class="halo ${isOn(st) ? "on" : ""}" aria-hidden="true"></div>${head}${body}${foot}`;
    }

    _val(key, fallback) {
      if (this._drag && this._drag.key === key) return this._drag.v;
      const p = this._pend[key];
      if (p && Date.now() < p.until) return p.v;
      return fallback;
    }
    _slab(key, v, label, toggle, icon = "") {
      const dragging = this._drag && this._drag.key === key;
      return `<div class="slab ${toggle ? "tog" : ""} ${dragging ? "drag" : ""}" data-slab="${key}" data-k="slab-${key}" ${toggle ? `role="switch" aria-checked="${v > 0}"` : `role="slider" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${v}"`} tabindex="0" style="--v:${v}%"><i></i><span class="sv disp">${esc(label)}</span><span class="sic">${icon}</span></div>`;
    }
    _chips(items, act, cur, label) {
      if (!items || !items.length) return "";
      return `<div class="grp"><span class="lbl">${esc(label)}</span><div class="chips2">${items.slice(0, 12).map((m) => {
        const v = typeof m === "object" ? m.v : m, l = typeof m === "object" ? m.l : pretty(m);
        return `<button class="chipb ${v === cur ? "on" : ""}" data-act="${act}" data-v="${esc(v)}" aria-pressed="${v === cur}">${esc(l)}</button>`;
      }).join("")}</div></div>`;
    }
    _loc(key, fb) { const s = this._hass?.localize?.(key); return s || fb; }

    _p_light(st, t) {
      const a = st.attributes, on = st.state === "on";
      const modes = a.supported_color_modes || [];
      const dimmable = modes.some((m) => m !== "onoff");
      const bri = this._val("bri", on ? Math.max(1, Math.round((a.brightness ?? 255) / 2.55)) : 0);
      const slab = dimmable ? this._slab("bri", bri, bri ? `${bri}%` : t("off"), false, animIcon(st, 28, 1.6)) : this._slab("toggle", on ? 100 : 0, t(on ? "on" : "off"), true, animIcon(st, 28, 1.6));
      const side = `<div class="side"><button class="cbtn ${on ? "on" : ""}" data-act="toggle" aria-pressed="${on}" aria-label="${t(on ? "turn_off" : "turn_on")}">${svgIcon(ICON.power, 26, 2)}</button><span class="clabel">${t(on ? "on" : "off")}</span></div>`;
      let extras = "";
      if (modes.includes("color_temp")) {
        const lo = a.min_color_temp_kelvin || 2000, hi = a.max_color_temp_kelvin || 6500;
        const k = this._val("ct", a.color_temp_kelvin || Math.round((lo + hi) / 2));
        extras += `<label class="rng"><span class="lbl">${t("color_temp")} · ${k} K</span><input class="ct" type="range" min="${lo}" max="${hi}" step="50" value="${k}" data-act="ct"></label>`;
      }
      if (modes.some((m) => ["hs", "rgb", "rgbw", "rgbww", "xy"].includes(m))) {
        const hues = [[255, 177, 122], [255, 96, 64], [255, 64, 129], [190, 110, 255], [92, 120, 255], [64, 196, 255], [80, 224, 170], [255, 214, 90]];
        extras += `<div class="grp"><span class="lbl">${t("color")}</span><div class="swr">${hues.map((c) => `<button class="sw2" style="--c:rgb(${c})" data-act="rgb" data-v="${c.join(",")}" aria-label="rgb ${c.join(" ")}"></button>`).join("")}</div></div>`;
      }
      if (on && Array.isArray(a.effect_list) && a.effect_list.length) extras += this._chips(a.effect_list.map((e) => ({ v: e, l: e })), "effect", a.effect, t("effect"));
      return `<div class="hero">${slab}${side}</div>${extras}`;
    }

    _p_switch(st, t) {
      const on = st.state === "on";
      return `<div class="hero">${this._slab("toggle", on ? 100 : 0, t(on ? "on" : "off"), true, animIcon(st, 30, 1.6))}</div>`;
    }

    _p_fan(st, t) {
      const a = st.attributes, on = st.state === "on", f = a.supported_features || 0;
      const pct = this._val("pct", on ? (a.percentage ?? 100) : 0);
      const big = `<div class="bigicon ${on ? "on" : ""}">${animIcon(st, 96, 1.1)}</div>`;
      const slab = f & 1 ? this._slab("pct", pct, pct ? `${pct}%` : t("off"), false) : "";
      const side = `<div class="side">${big}<div style="display:flex;gap:10px">
        <button class="cbtn ${on ? "on" : ""}" data-act="toggle" aria-pressed="${on}" aria-label="${t(on ? "turn_off" : "turn_on")}">${svgIcon(ICON.power, 24, 2)}</button>
        ${f & 2 ? `<button class="cbtn ${a.oscillating ? "on" : ""}" data-act="osc" aria-pressed="${!!a.oscillating}" aria-label="${t("oscillate")}" title="${t("oscillate")}">${svgIcon("M4 12a8 8 0 0 1 16 0M4 12l-1.5-2.5M4 12l2.5-1.5M20 12l1.5-2.5M20 12l-2.5-1.5", 24, 2)}</button>` : ""}
        ${f & 4 ? `<button class="cbtn" data-act="dir" aria-label="${t("direction")}" title="${t(a.direction === "reverse" ? "reverse" : "forward")}">${svgIcon(a.direction === "reverse" ? "M17 7a7 7 0 1 0 2 5M17 3v4h4" : "M7 7a7 7 0 1 1-2 5M7 3v4H3", 24, 2)}</button>` : ""}
        </div></div>`;
      return `<div class="hero">${slab}${side}</div>${f & 8 ? this._chips(a.preset_modes, "preset", a.preset_mode, t("preset")) : ""}`;
    }

    _p_climate(st, t) {
      const a = st.attributes, mode = st.state;
      const action = a.hvac_action || (mode === "cool" ? "cooling" : mode === "heat" ? "heating" : mode === "off" ? "off" : "idle");
      const lo = a.min_temp ?? 7, hi = a.max_temp ?? 35;
      const target = this._val("temp", a.temperature);
      const cur = a.current_temperature;
      const c = /cool|dry/.test(action) ? "cool" : /heat/.test(action) ? "heat" : null;
      const C = 2 * Math.PI * 88, ARC = C * 0.75;
      const p = target != null ? clamp((target - lo) / (hi - lo), 0, 1) : 0;
      const col = c ? `var(--${c})` : mode === "off" ? "var(--muted)" : "var(--acc)";
      const step = a.target_temp_step || (a.temperature_unit === "°F" ? 1 : 0.5);
      const capt = action === "cooling" ? t("cooling") : action === "heating" ? t("heating") : mode === "off" ? t("off") : t("idle");
      const ring = `<div class="ring2"><svg viewBox="0 0 210 210" width="210" height="210" aria-hidden="true">
          <circle cx="105" cy="105" r="88" style="stroke:var(--track);stroke-dasharray:${ARC.toFixed(1)} ${C.toFixed(1)}"></circle>
          <circle class="rf" cx="105" cy="105" r="88" style="stroke:${col};stroke-dasharray:${(mode === "off" || target == null ? 0 : ARC * p).toFixed(1)} ${C.toFixed(1)};filter:drop-shadow(0 0 10px color-mix(in srgb, ${col} 55%, transparent))"></circle></svg>
          <div class="in"><span class="muted" style="font-size:13px">${esc(capt)}</span><span class="disp">${target != null ? this._num(target, step < 1 ? 1 : 0) + "°" : cur != null ? this._num(cur, 1) + "°" : "—"}</span>
          <span class="muted" style="font-size:13px">${cur != null && target != null ? `${this._num(cur, 1)}° ${a.current_humidity != null ? "· " + Math.round(a.current_humidity) + "%" : ""}` : ""}</span></div></div>`;
      const stepper = target != null ? `<div class="stepper2"><button class="cbtn big" data-act="temp" data-d="${-step}" aria-label="−" style="font-size:28px">−</button><button class="cbtn big" data-act="temp" data-d="${step}" aria-label="+" style="font-size:28px">+</button></div>` : "";
      let strip = "";
      if (c === "cool") strip = [0, 1, 2, 3, 4, 5].map((k) => `<i class="air" style="top:${6 + k * 5}px;--d:${2 + (k % 3) * 0.35}s;--dl:${k * -0.45}s"></i>`).join("");
      if (c === "heat") strip = [0, 1, 2, 3, 4, 5].map((k) => `<i class="heatb" style="left:${8 + k * 16}%;--d:${2.4 + (k % 2) * 0.5}s;--dl:${k * -0.5}s"></i>`).join("");
      const lab = (m) => this._loc(`component.climate.entity_component._.state.${m}`, pretty(m));
      const modes = (a.hvac_modes || []).map((m) => ({ v: m, l: lab(m) }));
      return `<div class="hero" style="flex-direction:column;gap:14px">${ring}${stepper}</div>
        <div class="strip" aria-hidden="true">${strip}</div>
        ${this._chips(modes, "hvac", mode, t("mode"))}
        ${this._chips(a.fan_modes, "fanmode", a.fan_mode, t("fan_mode"))}
        ${this._chips(a.preset_modes, "cpreset", a.preset_mode, t("preset"))}`;
    }

    _p_media_player(st, t) {
      const a = st.attributes, f = a.supported_features || 0, playing = st.state === "playing";
      const pic = a.entity_picture ? `background-image:url('${esc(a.entity_picture).replace(/'/g, "%27")}')` : "";
      const eq = [0.9, 1.15, 0.75, 1.3, 1.0, 0.85, 1.2].map((dd, k) => `<i style="--d:${dd}s;--dl:${k * -0.17}s"></i>`).join("");
      const title = a.media_title || (INACTIVE.has(st.state) ? t("nothing_playing") : a.source || pretty(st.state));
      const subt = [a.media_artist, a.media_album_name].filter(Boolean).join(" · ") || a.app_name || "";
      let prog = "";
      if (a.media_duration && a.media_position != null) {
        const upd = Date.parse(a.media_position_updated_at || st.last_updated);
        const pos = clamp(a.media_position + (playing && isFinite(upd) ? (Date.now() - upd) / 1000 : 0), 0, a.media_duration);
        const mmss = (x) => `${Math.floor(x / 60)}:${String(Math.floor(x % 60)).padStart(2, "0")}`;
        prog = `<div class="grp" style="gap:6px"><div class="prog"><i style="width:${(pos / a.media_duration * 100).toFixed(2)}%"></i></div><div class="ptime"><span>${mmss(pos)}</span><span>${mmss(a.media_duration)}</span></div></div>`;
      }
      const vol = this._val("vol", Math.round((a.volume_level ?? 0) * 100));
      const ctl = `<div class="mctl">
        ${f & 16 ? `<button class="cbtn" data-act="prev" aria-label="${t("previous")}">${svgIcon(ICON.prev, 22, 2)}</button>` : ""}
        <button class="cbtn big on" data-act="playpause" aria-label="${t(playing ? "pause" : "play")}"><svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="${playing ? "M7 5h3v14H7zM14 5h3v14h-3z" : "M8 5l11 7-11 7z"}"></path></svg></button>
        ${f & 32 ? `<button class="cbtn" data-act="next" aria-label="${t("next")}">${svgIcon(ICON.next, 22, 2)}</button>` : ""}</div>`;
      const volRow = f & 4 ? `<div class="vol">${f & 8 ? `<button class="xb glass2" data-act="mute" aria-label="${t("mute")}" aria-pressed="${!!a.is_volume_muted}">${svgIcon(a.is_volume_muted ? ICON.mute : ICON.vol, 20, 1.9)}</button>` : ""}<input type="range" min="0" max="100" value="${vol}" data-act="vol" aria-label="${t("volume")}"><span style="width:40px;text-align:right;font-size:13px;font-variant-numeric:tabular-nums">${vol}%</span></div>` : "";
      const src = f & 2048 && Array.isArray(a.source_list) ? this._chips(a.source_list.map((s) => ({ v: s, l: s })), "source", a.source, t("source")) : "";
      return `<div class="art2" style="${pic}">${pic ? "" : `<div class="eq ${playing ? "on" : ""}" style="height:54px" aria-hidden="true">${eq}</div>`}</div>
        <div class="mtt"><b>${esc(title)}</b><span>${esc(subt)}</span></div>${prog}${ctl}${volRow}${src}`;
    }

    _p_cover(st, t) {
      const a = st.attributes, f = a.supported_features ?? 15;
      const pos = this._val("pos", a.current_position ?? (st.state === "open" ? 100 : 0));
      const shutter = `<div class="shutter" aria-hidden="true"><div class="sl" style="--cp:${100 - pos}%"></div></div>`;
      const slab = f & 4 ? this._slab("pos", pos, `${pos}%`, false) : "";
      const btns = `<div class="side">
        ${f & 1 ? `<button class="cbtn ${st.state === "opening" ? "on" : ""}" data-act="cover_open" aria-label="${t("cover_open")}">${svgIcon(ICON.up, 24, 2.2)}</button>` : ""}
        ${f & 8 ? `<button class="cbtn" data-act="cover_stop" aria-label="${t("stop")}">${svgIcon(ICON.stopsq, 20, 2)}</button>` : ""}
        ${f & 2 ? `<button class="cbtn ${st.state === "closing" ? "on" : ""}" data-act="cover_close" aria-label="${t("cover_close")}">${svgIcon(ICON.down, 24, 2.2)}</button>` : ""}</div>`;
      return `<div class="hero">${shutter}${slab}${btns}</div>`;
    }

    _p_lock(st, t) {
      const locked = st.state === "locked", f = st.attributes.supported_features || 0;
      return `<div class="hero" style="flex-direction:column;gap:18px"><div class="lockbig">${animIcon(st, 84, 1.2)}</div>
        <div style="display:flex;gap:12px"><button class="pill ${locked ? "glass2" : "on"}" data-act="${locked ? "unlock" : "lock"}" style="min-width:150px;justify-content:center">${esc(t(locked ? "unlock_act" : "lock_act"))}</button>
        ${f & 1 ? `<button class="pill glass2" data-act="lock_open">${esc(t("open_act"))}</button>` : ""}</div></div>`;
    }

    _p_run(st, t) {
      const d = domainOf(this._ent);
      return `<div class="hero"><div class="orbw ${this._burst ? "burst" : ""}" data-k="orb-${this._burstN || 0}"><span class="wave"></span><span class="wave"></span>
        <button class="orb2" data-act="run" aria-label="${t("run")}">${svgIcon(d === "scene" ? ICON.scenes : "M9 6.5v11l9-5.5z", 44, 1.8)}</button></div></div>
        <div style="text-align:center" class="muted">${esc(this._burst ? t("ran") : t("tap_to_run"))}</div>`;
    }

    _p_binary_sensor(st, t) {
      const on = st.state === "on";
      return `<div class="hero" style="flex-direction:column;gap:14px"><div class="bigicon ${on ? "on" : ""}">${animIcon(st, 84, 1.2)}</div></div>${this._timeline(st, t)}`;
    }

    _p_sensor(st, t) {
      const a = st.attributes, n = parseFloat(st.state);
      const numeric = isFinite(n) && (a.unit_of_measurement || a.state_class || /^-?\d+(\.\d+)?$/.test(st.state));
      if (!numeric) return `<div class="hero"><div class="bigicon">${animIcon(st, 84, 1.2)}</div></div>`;
      const prec = this._hass?.entities?.[this._ent]?.display_precision ?? (Math.abs(n) >= 100 ? 0 : 1);
      const big = `<div class="bigv"><span class="disp">${esc(this._num(n, prec))}</span><span>${esc(a.unit_of_measurement || "")}</span></div>`;
      return `${big}${this._chart(st, t, prec)}`;
    }

    _p_weather(st, t) {
      const a = st.attributes;
      const dark = !!PRESETS[this._o.preset || "midnight"]?.dark;
      const label = this._loc(`component.weather.entity_component._.state.${st.state}`, WX_LABEL[st.state] || pretty(st.state));
      const unit = a.temperature_unit || "°";
      const stats = [
        a.humidity != null ? [t("humidity", { h: "" }).replace(/\s*%?$/, "").trim() || "Humidity", `${Math.round(a.humidity)}%`] : null,
        a.wind_speed != null ? [t("wind"), `${this._num(a.wind_speed, 0)} ${a.wind_speed_unit || ""}`] : null,
        a.pressure != null ? [t("pressure"), `${this._num(a.pressure, 0)} ${a.pressure_unit || ""}`] : null
      ].filter(Boolean);
      const fcType = st.aurora_forecast ? "daily" : this._fc?.type;
      const fc = (st.aurora_forecast || this._fc?.list || []).slice(0, 5).map((x) => {
        let day = "";
        try { day = new Date(x.datetime).toLocaleDateString(this._lang, fcType === "hourly" ? { hour: "2-digit" } : { weekday: "short" }); } catch (e) { day = ""; }
        return `<div class="fcd"><span>${esc(day)}</span>${weatherArt(x.condition, dark, 38, 28)}<b>${x.temperature != null ? this._num(x.temperature, 0) + "°" : ""}</b><span>${x.templow != null ? this._num(x.templow, 0) + "°" : ""}</span></div>`;
      }).join("");
      return `<div class="hero">${weatherArt(st.state, dark, 150, 112)}<div style="display:flex;flex-direction:column;gap:4px"><span class="disp" style="font-size:56px;line-height:1">${a.temperature != null ? this._num(a.temperature, 0) + (unit.startsWith("°") ? "°" : unit) : "—"}</span><span class="muted">${esc(label)}</span></div></div>
        ${stats.length ? `<div class="stats">${stats.map(([k, v]) => `<div class="stat"><span>${esc(k)}</span><b>${esc(v)}</b></div>`).join("")}</div>` : ""}
        ${fc ? `<div class="grp"><span class="lbl">${t("forecast")}</span><div class="fc">${fc}</div></div>` : ""}`;
    }

    _p_device_tracker(st, t) {
      return `<div class="hero"><div class="bigicon ${st.state === "home" ? "on" : ""}">${animIcon(st, 84, 1.2)}</div></div>${this._timeline(st, t)}`;
    }

    _p_vacuum(st, t) {
      const on = st.state === "cleaning";
      return `<div class="hero" style="flex-direction:column;gap:16px"><div class="bigicon ${on ? "on" : ""}">${animIcon(st, 84, 1.2)}</div>
        <button class="pill ${on ? "on" : "glass2"}" data-act="toggle">${esc(on ? pretty("return to base") : t("run"))}</button></div>`;
    }

    _p_default(st, t) {
      const toggle = ["on", "off"].includes(st.state);
      const attrs = Object.entries(st.attributes).filter(([k, v]) => !["friendly_name", "icon", "supported_features", "entity_picture", "attribution", "device_class", "unit_of_measurement", "state_class"].includes(k) && (typeof v === "string" || typeof v === "number" || typeof v === "boolean")).slice(0, 8);
      return `<div class="hero"><div class="bigicon ${isOn(st) ? "on" : ""}">${animIcon(st, 84, 1.2)}</div>${toggle ? `<div class="side"><button class="cbtn ${st.state === "on" ? "on" : ""}" data-act="toggle">${svgIcon(ICON.power, 24, 2)}</button></div>` : ""}</div>
        ${attrs.length ? `<div class="attrs">${attrs.map(([k, v]) => `<div class="stat"><span>${esc(pretty(k))}</span><b>${esc(String(v))}</b></div>`).join("")}</div>` : ""}`;
    }

    /* ----- history */
    async _loadHist() {
      const id = this._ent, d = domainOf(id);
      if (!["sensor", "binary_sensor", "device_tracker", "person"].includes(d) || !this._hass?.callApi) return;
      const c = this._hist[id];
      if (c && Date.now() - c.at < 60000) return;
      const end = new Date(), start = new Date(end.getTime() - 24 * 3600e3);
      this._hist[id] = { at: Date.now(), loading: true, pts: c?.pts || [] };
      try {
        const r = await this._hass.callApi("GET", `history/period/${start.toISOString()}?filter_entity_id=${encodeURIComponent(id)}&end_time=${encodeURIComponent(end.toISOString())}&minimal_response&no_attributes`);
        const rows = (Array.isArray(r) && r[0]) || [];
        this._hist[id] = { at: Date.now(), start: start.getTime(), pts: rows.map((x) => ({ t: Date.parse(x.last_changed || x.last_updated) || (x.lu ? x.lu * 1000 : NaN), s: x.state ?? x.s })).filter((x) => isFinite(x.t)) };
      } catch (e) {
        this._hist[id] = { at: Date.now(), start: start.getTime(), pts: [], err: true };
      }
      this._schedule();
    }

    _chart(st, t, prec) {
      const h = this._hist[this._ent];
      const n = parseFloat(st.state);
      const pts = (h?.pts || []).map((p) => ({ t: p.t, v: parseFloat(p.s) })).filter((p) => isFinite(p.v));
      if (!h || h.loading) return `<div class="grp"><span class="lbl">${t("last_24h")}</span><div class="chart"></div></div>`;
      if (pts.length < 2) return `<div class="grp"><span class="lbl">${t("last_24h")}</span><div class="chart"><div class="empty">${t("no_history")}</div></div></div>`;
      const now = Date.now();
      pts.push({ t: now, v: isFinite(n) ? n : pts[pts.length - 1].v });
      const t0 = Math.max(h.start || pts[0].t, pts[0].t), W = 300, H = 120, pad = 10;
      let lo = Math.min(...pts.map((p) => p.v)), hi = Math.max(...pts.map((p) => p.v));
      if (hi - lo < 1e-9) { lo -= 1; hi += 1; }
      const X = (tt) => ((tt - t0) / (now - t0)) * W, Y = (v) => H - pad - ((v - lo) / (hi - lo)) * (H - pad * 2);
      // step line (sensors hold their value until the next change)
      let dPath = `M${X(pts[0].t).toFixed(1)} ${Y(pts[0].v).toFixed(1)}`;
      for (let i = 1; i < pts.length; i++) dPath += `H${X(pts[i].t).toFixed(1)}V${Y(pts[i].v).toFixed(1)}`;
      const area = `${dPath}V${H}H${X(pts[0].t).toFixed(1)}Z`;
      // time-weighted average
      let sum = 0, dur = 0;
      for (let i = 0; i < pts.length - 1; i++) { const dt = pts[i + 1].t - pts[i].t; sum += pts[i].v * dt; dur += dt; }
      const avg = dur ? sum / dur : n;
      const u = st.attributes.unit_of_measurement || "";
      const fmt = (v) => `${this._num(v, prec)}${u ? " " + u : ""}`;
      const realLo = Math.min(...pts.map((p) => p.v)), realHi = Math.max(...pts.map((p) => p.v));
      return `<div class="grp"><span class="lbl">${t("last_24h")}</span><div class="chart" data-k="chart-${this._ent}-${pts.length}"><svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true">
          <defs><linearGradient id="agg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="var(--ai)" stop-opacity=".38"></stop><stop offset="1" stop-color="var(--ai)" stop-opacity="0"></stop></linearGradient></defs>
          <path class="ar" d="${area}" fill="url(#agg)"></path><path class="ln" d="${dPath}" pathLength="1" vector-effect="non-scaling-stroke"></path></svg></div>
        <div class="stats"><div class="stat"><span>${t("min")}</span><b>${esc(fmt(realLo))}</b></div><div class="stat"><span>${t("avg")}</span><b>${esc(fmt(avg))}</b></div><div class="stat"><span>${t("max")}</span><b>${esc(fmt(realHi))}</b></div></div></div>`;
    }

    _timeline(st, t) {
      const h = this._hist[this._ent];
      if (!h || h.loading || !h.pts.length) return `<div class="grp"><span class="lbl">${t("last_24h")}</span><div class="tl"></div>${h && !h.loading ? `<span class="muted" style="font-size:13px">${t("no_history")}</span>` : ""}</div>`;
      const now = Date.now(), t0 = h.start || h.pts[0].t;
      const pts = h.pts.slice();
      const segs = pts.map((p, i) => {
        const a = Math.max(p.t, t0), b = i + 1 < pts.length ? pts[i + 1].t : now;
        const active = p.s === "on" || p.s === "home" || p.s === "open" || p.s === "unlocked";
        return `<i style="width:${(Math.max(0, b - a) / (now - t0) * 100).toFixed(3)}%;background:${active ? "var(--ai)" : "transparent"};animation-delay:${(i * 0.02).toFixed(2)}s" title="${esc(p.s)}"></i>`;
      }).join("");
      const lab = (k) => { try { return new Date(k).toLocaleTimeString(this._lang, { hour: "2-digit", minute: "2-digit" }); } catch (e) { return ""; } };
      return `<div class="grp"><span class="lbl">${t("last_24h")}</span><div class="tl" data-k="tl-${pts.length}">${segs}</div><div class="ptime"><span>${lab(t0)}</span><span>${lab(now)}</span></div></div>`;
    }

    _subForecast() {
      if (this._unsub) { try { this._unsub(); } catch (e) { /* closed */ } this._unsub = null; }
      const st = this._st();
      if (!st || this._o?.virtual || domainOf(this._ent) !== "weather" || !this._hass?.connection?.subscribeMessage) return;
      const f = st.attributes.supported_features || 0;
      const type = f & 1 ? "daily" : f & 4 ? "twice_daily" : f & 2 ? "hourly" : null;
      if (!type) return;
      const ent = this._ent;
      this._hass.connection.subscribeMessage((m) => { if (this._ent === ent) { this._fc = { type, list: m.forecast || [] }; this._schedule(); } },
        { type: "weather/subscribe_forecast", forecast_type: type, entity_id: ent })
        .then((u) => { if (this._o && this._ent === ent) this._unsub = u; else u(); }).catch(() => { /* no forecast */ });
    }

    /* ----- events */
    _onClick(e) {
      if (this._swallow) { this._swallow = false; return; }
      const el = e.target.closest?.("[data-act]");
      if (!el) return;
      const st = this._st(), id = this._ent, act = el.dataset.act, v = el.dataset.v;
      const a = st?.attributes || {};
      switch (act) {
        case "close": return this.close();
        case "native": {
          const owner = this._o?.owner || this;
          this._finishClose();
          const ev = new Event("hass-more-info", { bubbles: true, composed: true });
          ev.detail = { entityId: id };
          return owner.dispatchEvent(ev);
        }
        case "toggle": return toggleCall(this._hass, st);
        case "rgb": return this._call("light", "turn_on", { entity_id: id, rgb_color: v.split(",").map(Number) });
        case "effect": return this._call("light", "turn_on", { entity_id: id, effect: v });
        case "osc": return this._call("fan", "oscillate", { entity_id: id, oscillating: !a.oscillating });
        case "dir": return this._call("fan", "set_direction", { entity_id: id, direction: a.direction === "reverse" ? "forward" : "reverse" });
        case "preset": return this._call("fan", "set_preset_mode", { entity_id: id, preset_mode: v });
        case "hvac": return this._call("climate", "set_hvac_mode", { entity_id: id, hvac_mode: v });
        case "fanmode": return this._call("climate", "set_fan_mode", { entity_id: id, fan_mode: v });
        case "cpreset": return this._call("climate", "set_preset_mode", { entity_id: id, preset_mode: v });
        case "temp": {
          const base = this._val("temp", a.temperature);
          if (base == null) return;
          const tt = clamp(Math.round((base + Number(el.dataset.d)) * 10) / 10, a.min_temp ?? 7, a.max_temp ?? 35);
          this._pend.temp = { v: tt, until: Date.now() + 4000 };
          clearTimeout(this._tempT);
          this._tempT = setTimeout(() => this._call("climate", "set_temperature", { entity_id: id, temperature: tt }), 650);
          return this._render();
        }
        case "playpause": return this._call("media_player", "media_play_pause", { entity_id: id });
        case "prev": return this._call("media_player", "media_previous_track", { entity_id: id });
        case "next": return this._call("media_player", "media_next_track", { entity_id: id });
        case "mute": return this._call("media_player", "volume_mute", { entity_id: id, is_volume_muted: !a.is_volume_muted });
        case "source": return this._call("media_player", "select_source", { entity_id: id, source: v });
        case "cover_open": return this._call("cover", "open_cover", { entity_id: id });
        case "cover_close": return this._call("cover", "close_cover", { entity_id: id });
        case "cover_stop": return this._call("cover", "stop_cover", { entity_id: id });
        case "lock": return this._call("lock", "lock", { entity_id: id });
        case "unlock": return this._call("lock", "unlock", { entity_id: id });
        case "lock_open": return this._call("lock", "open", { entity_id: id });
        case "run": {
          runCall(this._hass, st);
          this._burst = true;
          this._burstN = (this._burstN || 0) + 1;
          clearTimeout(this._burstT);
          this._burstT = setTimeout(() => { this._burst = false; this._render(); }, 1600);
          return this._render();
        }
      }
    }

    _onInputLive(e) {
      const el = e.target;
      if (el?.dataset?.act === "vol") { const s = el.parentElement.querySelector("span"); if (s) s.textContent = `${el.value}%`; this._pend.vol = { v: Number(el.value), until: Date.now() + 3000 }; }
      if (el?.dataset?.act === "ct") { this._pend.ct = { v: Number(el.value), until: Date.now() + 3000 }; const l = el.parentElement.querySelector(".lbl"); if (l) l.textContent = `${this._t("color_temp")} · ${el.value} K`; }
    }
    _onChange(e) {
      const el = e.target, id = this._ent;
      if (el?.dataset?.act === "ct") this._call("light", "turn_on", { entity_id: id, color_temp_kelvin: Number(el.value) });
      if (el?.dataset?.act === "vol") this._call("media_player", "volume_set", { entity_id: id, volume_level: Number(el.value) / 100 });
    }

    _slabValue(el, y) {
      const r = el.getBoundingClientRect();
      return clamp(Math.round(((r.bottom - y) / r.height) * 100), 0, 100);
    }
    _onDown(e) {
      const slab = e.target.closest?.("[data-slab]");
      if (slab) {
        this._drag = { key: slab.dataset.slab, el: slab, y0: e.clientY, moved: false, v: this._slabValue(slab, e.clientY), toggle: slab.classList.contains("tog"), pid: e.pointerId };
        try { slab.setPointerCapture(e.pointerId); } catch (er) { /* ok */ }
        return;
      }
      const sw = e.target.closest?.("[data-swipe]");
      if (sw && this._mobile() && !e.target.closest("button")) {
        this._swipe = { y0: e.clientY, dy: 0, pid: e.pointerId };
        try { sw.setPointerCapture(e.pointerId); } catch (er) { /* ok */ }
      }
    }
    _onMove(e) {
      const d = this._drag;
      if (d && e.pointerId === d.pid) {
        if (Math.abs(e.clientY - d.y0) > 4) d.moved = true;
        if (d.toggle || !d.moved) return;
        d.v = this._slabValue(d.el, e.clientY);
        d.el.classList.add("drag");
        d.el.style.setProperty("--v", `${d.v}%`);
        const sv = d.el.querySelector(".sv");
        if (sv) sv.textContent = d.v ? `${d.v}%` : this._t("off");
        return;
      }
      const s = this._swipe;
      if (s && e.pointerId === s.pid) {
        s.dy = Math.max(0, e.clientY - s.y0);
        this._sheet.style.transform = s.dy ? `translateY(${s.dy}px)` : "";
      }
    }
    _onUp(e, cancel) {
      const d = this._drag;
      if (d && e.pointerId === d.pid) {
        this._drag = null;
        d.el.classList.remove("drag");
        if (cancel) return this._render();
        const st = this._st();
        if (d.toggle) { if (!d.moved) toggleCall(this._hass, st); this._swallow = true; setTimeout(() => { this._swallow = false; }, 50); return; }
        const v = d.moved ? d.v : this._slabValue(d.el, e.clientY);
        this._commitSlab(d.key, v);
        this._swallow = true;
        setTimeout(() => { this._swallow = false; }, 50);
        return;
      }
      const s = this._swipe;
      if (s && e.pointerId === s.pid) {
        this._swipe = null;
        if (s.dy > 110 && !cancel) return this.close();
        if (s.dy && this._sheet.animate) this._sheet.animate([{ transform: `translateY(${s.dy}px)` }, { transform: "none" }], { duration: 260, easing: "cubic-bezier(.2,.9,.3,1.2)" });
        this._sheet.style.transform = "";
      }
    }
    _commitSlab(key, v) {
      const id = this._ent;
      this._pend[key] = { v, until: Date.now() + 3000 };
      if (key === "bri") v ? this._call("light", "turn_on", { entity_id: id, brightness_pct: v }) : this._call("light", "turn_off", { entity_id: id });
      if (key === "pct") v ? this._call("fan", "set_percentage", { entity_id: id, percentage: v }) : this._call("fan", "turn_off", { entity_id: id });
      if (key === "pos") this._call("cover", "set_cover_position", { entity_id: id, position: v });
      this._render();
    }
    _onKey(e) {
      const slab = e.target.closest?.("[data-slab]");
      if (!slab) return;
      if (slab.classList.contains("tog")) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleCall(this._hass, this._st()); } return; }
      const delta = { ArrowUp: 5, ArrowRight: 5, ArrowDown: -5, ArrowLeft: -5, PageUp: 20, PageDown: -20 }[e.key];
      if (delta == null) return;
      e.preventDefault();
      const key = slab.dataset.slab;
      const cur = Number(slab.getAttribute("aria-valuenow")) || 0;
      const v = clamp(cur + delta, 0, 100);
      this._pend[key] = { v, until: Date.now() + 3000 };
      this._render();
      clearTimeout(this._keyT);
      this._keyT = setTimeout(() => this._commitSlab(key, v), 450);
    }
  }
  if (!customElements.get("aurora-glass-popup")) customElements.define("aurora-glass-popup", AuroraGlassPopup);

  // Opens the glass pop-up (or HA's own dialog) for an entity, themed like the card that asked.
  function openEntityPopup(owner, entity, { origin, name, icon, mode, theme, blur, motion, lang } = {}) {
    if (!entity) return;
    if (mode === "none") return;
    if (mode === "native") {
      const ev = new Event("hass-more-info", { bubbles: true, composed: true });
      ev.detail = { entityId: entity };
      return owner.dispatchEvent(ev);
    }
    const th = theme || resolveTheme("auto", "peach", owner.hass);
    AuroraGlassPopup.get().open({
      owner, hass: owner.hass, entity, name, icon, origin, lang, motion: motion !== false, preset: th.id,
      vars: themeVars(th, blur ?? 24), scrim: th.T.dark ? "rgba(4,6,14,.45)" : "rgba(40,46,72,.22)"
    });
  }

  /* ------------------------------------------------------------------ card */
  class AuroraGlassCard extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this._focus = {};
      this._pending = {};
      this._first = true;
      this._raf = 0;
    }

    static getStubConfig(hass) { return stubFromHass(hass); }
    static getConfigElement() { return document.createElement("aurora-glass-card-editor"); }

    setConfig(config) {
      // `single` is set by the one-widget cards below: the header card has no widgets at all.
      if (!config || !Array.isArray(config.widgets) || (!config.widgets.length && !config.single)) throw new Error("aurora-glass-card: add a `widgets:` list");
      const seen = {};
      this._config = { background: true, ...config };
      this._widgets = config.widgets.map((w, i) => {
        if (!w || !w.type) throw new Error(`aurora-glass-card: widget ${i + 1} needs a type`);
        let id = w.id || w.type;
        if (seen[id]) id = `${id}-${i}`;
        seen[id] = 1;
        return { size: "M", ...w, id };
      });
      this._loadPrefs();
      this._schedule();
    }

    set hass(h) { this._hass = h; AuroraGlassPopup.sync(this, h); this._schedule(); }
    get hass() { return this._hass; }
    getCardSize() { return 12; }
    getGridOptions() { return { columns: "full" }; }

    connectedCallback() {
      loadFonts();
      this._clock = setInterval(() => this._schedule(), 30000);
      this._omL = this._omL || (() => this._schedule());
      OM_LISTENERS.add(this._omL);
      this._schedule();
    }
    disconnectedCallback() { clearInterval(this._clock); OM_LISTENERS.delete(this._omL); this._clearDashTheme(); }

    /* ----- prefs (per device, per card) */
    get _key() { return `aurora-glass:${this._config.id || location.pathname}`; }
    _loadPrefs() {
      const def = { order: [], size: {}, hidden: [], preset: this._config.preset || "auto", accent: this._config.accent || "peach",
        blur: this._config.blur ?? 24, motion: this._config.motion ?? true, editing: false };
      let saved = {};
      try { saved = JSON.parse(localStorage.getItem(this._key) || "{}") || {}; } catch (e) { saved = {}; }
      // A device keeps its own Customize choices only until the card's settings change in the editor:
      // any setting edited there since the device saved wins over the device's copy.
      const base = this._base();
      const sb = saved.base || {};
      ["preset", "accent", "blur", "motion"].forEach((k) => { if (k in saved && sb[k] !== base[k]) delete saved[k]; });
      if (sb.order !== base.order) delete saved.order;
      if (sb.size !== base.size) delete saved.size;
      if (sb.ids !== base.ids) saved.hidden = (saved.hidden || []).filter((id) => base.ids.split("|").includes(id));
      this._p = { ...def, ...saved, editing: false };
    }
    _base() {
      const c = this._config;
      return { preset: c.preset || "auto", accent: c.accent || "peach", blur: c.blur ?? 24, motion: c.motion ?? true,
        order: this._widgets.map((w) => w.id).join("|"), ids: this._widgets.map((w) => w.id).join("|"),
        size: this._widgets.map((w) => w.size || "M").join("|") };
    }
    _savePrefs() {
      try { const { editing, ...rest } = this._p; localStorage.setItem(this._key, JSON.stringify({ ...rest, base: this._base() })); } catch (e) { /* storage blocked */ }
    }
    _set(patch) { Object.assign(this._p, patch); this._savePrefs(); this._schedule(); }

    /* ----- i18n / format */
    get _lang() { const l = (this._config.language || this._hass?.locale?.language || this._hass?.language || "en").split("-")[0]; return I18N[l] ? l : "en"; }
    _t(k, vars) {
      let s = (this._config.translations?.[this._lang]?.[k]) ?? I18N[this._lang][k] ?? I18N.en[k] ?? k;
      if (vars) Object.keys(vars).forEach((v) => { s = s.replace(`{${v}}`, vars[v]); });
      return s;
    }
    _num(v, d = 1) {
      try { return Number(v).toLocaleString(this._hass?.locale?.language || "en", { minimumFractionDigits: d, maximumFractionDigits: d }); } catch (e) { return Number(v).toFixed(d); }
    }
    _loc(key, fb) { const s = this._hass?.localize?.(key); return s || fb; }

    /* ----- state access */
    _st(id) { return id ? this._hass?.states?.[id] : undefined; }
    _name(id, fb) { const s = this._st(id); return fb || s?.attributes?.friendly_name || id; }
    _kw(id) {
      const s = this._st(id);
      if (!s) return null;
      let v = parseFloat(s.state);
      if (!isFinite(v)) return null;
      const u = String(s.attributes.unit_of_measurement || "W").toLowerCase();
      if (u === "w") v /= 1000; else if (u === "mw") v *= 1000;
      return v;
    }
    _call(domain, service, data) { if (this._hass) this._hass.callService(domain, service, data); }
    _moreInfo(entityId) {
      const ev = new Event("hass-more-info", { bubbles: true, composed: true });
      ev.detail = { entityId };
      this.dispatchEvent(ev);
    }
    // Long-press / right-click / tapping a chip, node or widget icon: the glass pop-up (or HA's dialog, per `popup:`).
    _popup(entityId, el) {
      if (!entityId) return;
      if (entityId === OM_ID) {
        const w = this._widgets.find((x) => x.type === "weather" && x.source === "open_meteo");
        if (!w) return;
        return AuroraGlassPopup.get().open({
          owner: this, hass: this._hass, entity: OM_ID, origin: el?.getBoundingClientRect?.(), lang: this._lang, motion: this._p.motion,
          preset: this._theme().id, vars: themeVars(this._theme(), this._p.blur), virtual: true, getState: () => omState(this._hass, w),
          scrim: this._theme().T.dark ? "rgba(4,6,14,.45)" : "rgba(40,46,72,.22)"
        });
      }
      const names = {};
      this._widgets.forEach((w) => asList(w.entities).map(entOf).forEach((x) => { if (x.entity && x.name) names[x.entity] = x.name; }));
      asList(this._config.chips).map(entOf).forEach((x) => { if (x.entity && x.name) names[x.entity] = x.name; });
      openEntityPopup(this, entityId, {
        origin: el?.getBoundingClientRect?.(), name: names[entityId], mode: this._config.popup || "aurora",
        theme: this._theme(), blur: this._p.blur, motion: this._p.motion, lang: this._lang
      });
    }

    /* ----- theme */
    _theme() { return resolveTheme(this._p.preset, this._p.accent, this._hass); }
    _vars() {
      const { T, A, S } = this._theme();
      const v = {
        "--ground": T.ground, "--glass": T.glass, "--glass2": T.glass2, "--border": T.border, "--hi": T.hi, "--shadow": T.shadow,
        "--text": T.text, "--muted": T.muted, "--faint": T.faint, "--track": T.track, "--off": T.off, "--orb-op": T.orbOp,
        "--acc": A.c, "--acc-ink": T.dark ? A.c : A.deep, "--acc-a": T.dark ? "14%" : "28%", "--acc-t": T.dark ? "16%" : "32%",
        "--blur": `${this._p.blur}px`, "--cool": S.cool, "--heat": S.heat, "--solar": S.solar, "--battery": S.battery, "--grid": S.grid, "--alert": S.alert
      };
      const EF = T.dark ? EF_DARK : EF_LIGHT;
      Object.keys(EF).forEach((k) => { v[`--ef-${k}`] = EF[k]; });
      if (this._config.min_height && !this.preview && !this.editMode) v["--min-h"] = this._config.min_height;
      if (this._config.radius) v["--root-radius"] = this._config.radius;
      return Object.keys(v).map((k) => `${k}:${v[k]}`).join(";");
    }

    /* ----- dashboard-wide theme: no theme file or YAML needed */
    _dashHost() {
      let n = this;
      while (n) {
        if (n.tagName === "HUI-ROOT") return n;
        n = n.assignedSlot || n.parentNode || n.host;
      }
      return null;
    }
    _applyDashTheme() {
      const on = this._config.dashboard_theme !== false && !this.preview;
      this._applyDocDialogs(on && this.isConnected);
      const host = on && this.isConnected ? this._dashHost() : null;
      if (this._themed && this._themed !== host) this._clearDashTheme();
      if (!host) return;
      const { T, A, S } = this._theme();
      const blur = `blur(${this._p.blur}px) saturate(170%)`;
      const bg = `radial-gradient(circle at 8% 0%, ${hexA(T.orbs[0], T.orbOp)}, transparent 42%), radial-gradient(circle at 85% 35%, ${hexA(T.orbs[1], T.orbOp * 0.85)}, transparent 42%), radial-gradient(circle at 30% 100%, ${hexA(T.orbs[2], T.orbOp * 0.75)}, transparent 48%), ${T.ground} fixed`;
      const vars = {
        "--lovelace-background": bg, "--primary-background-color": T.ground,
        "--ha-card-background": T.glass, "--ha-card-border-color": T.border, "--ha-card-border-radius": "28px",
        "--ha-card-box-shadow": `inset 0 1px 0 ${T.hi}, 0 30px 60px -32px ${T.shadow}`, "--ha-card-backdrop-filter": blur,
        "--primary-text-color": T.text, "--secondary-text-color": T.muted, "--divider-color": T.faint,
        "--primary-color": T.dark ? A.c : A.deep, "--accent-color": T.dark ? A.c : A.deep,
        "--state-light-active-color": A.c, "--state-climate-cool-color": S.cool, "--state-climate-heat-color": S.heat,
        "--energy-solar-color": S.solar, "--energy-battery-in-color": S.battery, "--energy-battery-out-color": S.battery, "--energy-grid-return-color": S.grid,
        "--app-header-background-color": hexA(T.ground, 0.55), "--app-header-text-color": T.text, "--app-header-backdrop-filter": blur
      };
      const sig = JSON.stringify(vars);
      if (this._themed === host && this._themeSig === sig) return;
      Object.keys(vars).forEach((k) => host.style.setProperty(k, vars[k]));
      this._themed = host;
      this._themeSig = sig;
      this._themeKeys = Object.keys(vars);
    }
    // HA's own dialogs (more-info, settings) are outside the dashboard, so their glass look is set on the
    // document while this card is on screen, and the previous values are put back when it leaves.
    _applyDocDialogs(on) {
      const root = document.documentElement;
      if (!on) {
        if (window.__agDialogOwner === this) {
          const prev = this._docPrev || {};
          Object.keys(prev).forEach((k) => (prev[k] ? root.style.setProperty(k, prev[k]) : root.style.removeProperty(k)));
          window.__agDialogOwner = null;
        }
        this._docPrev = null;
        this._docSig = null;
        return;
      }
      const { T } = this._theme();
      const glass = hexA(T.ground, T.dark ? 0.66 : 0.74);
      const v = {
        "--ha-dialog-surface-background": glass, "--ha-bottom-sheet-surface-background": glass,
        "--ha-dialog-surface-backdrop-filter": `blur(${this._p.blur + 14}px) saturate(170%)`,
        "--ha-dialog-scrim-backdrop-filter": "blur(7px)", "--dialog-backdrop-filter": "blur(7px)",
        "--mdc-dialog-scrim-color": T.dark ? "rgba(4,6,14,0.45)" : "rgba(40,46,72,0.22)",
        "--ha-dialog-border-radius": "30px", "--ha-bottom-sheet-border-radius": "30px",
        "--dialog-box-shadow": `inset 0 1px 0 ${T.hi}, 0 40px 90px -30px rgba(0,0,0,0.7)`
      };
      const sig = JSON.stringify(v);
      if (window.__agDialogOwner === this && this._docSig === sig) return;
      if (window.__agDialogOwner && window.__agDialogOwner !== this && window.__agDialogOwner.isConnected) return;   // another Aurora card already themes them
      if (window.__agDialogOwner !== this) {
        this._docPrev = {};
        Object.keys(v).forEach((k) => { this._docPrev[k] = root.style.getPropertyValue(k); });
        window.__agDialogOwner = this;
      }
      Object.keys(v).forEach((k) => root.style.setProperty(k, v[k]));
      this._docSig = sig;
    }
    _clearDashTheme() {
      this._applyDocDialogs(false);
      if (this._themed) (this._themeKeys || []).forEach((k) => this._themed.style.removeProperty(k));
      this._themed = null;
      this._themeSig = null;
    }

    /* ----- render loop */
    _schedule() {
      if (this._raf) return;
      this._raf = requestAnimationFrame(() => { this._raf = 0; this._render(); });
    }

    _render() {
      if (!this._config || !this.shadowRoot) return;
      const sr = this.shadowRoot;
      if (!this._root) {
        sr.innerHTML = `<style>${CSS}${ANIM_CSS}</style><div class="root"></div>`;
        this._root = sr.querySelector(".root");
        sr.addEventListener("click", (e) => this._onClick(e));
        sr.addEventListener("input", (e) => this._onInput(e, false));
        sr.addEventListener("change", (e) => this._onInput(e, true));
        sr.addEventListener("contextmenu", (e) => this._onContext(e));
        sr.addEventListener("pointerdown", (e) => this._onDown(e));
        ["pointerup", "pointercancel", "pointerleave"].forEach((t) => sr.addEventListener(t, () => clearTimeout(this._lp)));
      }
      const html = this._html();
      const tpl = document.createElement("template");
      tpl.innerHTML = `<div>${html}</div>`;
      const next = tpl.content.firstElementChild;
      const cls = ["root", this._config.background ? "bg" : "", this._config.single ? "single" : "", this._p.motion ? "" : "still", this._p.editing ? "editing" : "", this._first ? "enter" : ""].filter(Boolean).join(" ");
      next.className = cls;
      next.setAttribute("style", this._vars());
      morph(this._root, next, sr.activeElement);
      this._applyDashTheme();
      if (this._first) { this._first = false; setTimeout(() => { if (this._root) this._root.classList.remove("enter"); }, 1500); }
    }

    _html() {
      const { T } = this._theme();
      const orbs = this._config.background
        ? `<div class="orbs" aria-hidden="true">${T.orbs.map((c, k) => `<div class="orb o${k + 1}" style="background:radial-gradient(circle, ${c} 0%, ${hexA(c, 0)} 68%)"></div>`).join("")}</div>`
        : "";
      return `${orbs}<div class="wrap">${this._header()}${this._p.editing ? this._panel() : ""}<div class="grid">${this._grid()}</div></div>`;
    }

    _header() {
      if (this._config.header === false) return "";
      const now = new Date();
      const hr = now.getHours();
      const lang = this._hass?.locale?.language || "en";
      let date = "", time = "";
      try {
        date = now.toLocaleDateString(lang, { weekday: "long", day: "numeric", month: "long" });
        time = now.toLocaleTimeString(lang, { hour: "2-digit", minute: "2-digit" });
      } catch (e) { date = now.toDateString(); }
      const title = this._config.title ?? this._t(hr < 12 ? "good_morning" : hr < 18 ? "good_afternoon" : "good_evening");
      const chips = asList(this._config.chips).map((c) => {
        c = entOf(c);
        const s = this._st(c.entity);
        if (!s) return "";
        const n = parseFloat(s.state);
        const isDeg = /°/.test(s.attributes.unit_of_measurement || "");
        const val = isFinite(n) ? `${this._num(n, c.decimals ?? (isDeg || Math.abs(n) < 10 ? 1 : 0))}${s.attributes.unit_of_measurement ? (s.attributes.unit_of_measurement === "°C" || s.attributes.unit_of_measurement === "°F" ? "°" : " " + s.attributes.unit_of_measurement) : ""}` : s.state;
        const color = c.color ? (c.color.startsWith("#") ? c.color : `var(--${c.color})`) : "var(--acc)";
        return `<button class="chip glass2" data-act="more" data-e="${esc(c.entity)}"><div class="dot" style="--c:${esc(color)}"></div><span class="muted">${esc(c.name || s.attributes.friendly_name)}</span><span class="disp">${esc(val)}</span></button>`;
      }).join("");
      const edit = this._config.customize === false ? "" :
        `<button class="pill ${this._p.editing ? "on" : "glass2"}" data-act="edit" aria-pressed="${this._p.editing}">${svgIcon(ICON.sliders)}<span>${this._t(this._p.editing ? "done" : "customize")}</span></button>`;
      // Small round buttons after Customize (e.g. logout, power menu); each runs a normal HA tap_action.
      const isAdmin = !!this._hass?.user?.is_admin, uid = this._hass?.user?.id;
      const hb = asList(this._config.header_buttons).map((b, i) => [b, i])
        .filter(([b]) => b && (!b.admin_only || isAdmin) && (!b.users || asList(b.users).includes(uid)))
        .map(([b, i]) => `<button class="hb glass2" data-act="hb" data-i="${i}" aria-label="${esc(b.name || b.icon || "")}" title="${esc(b.name || "")}"><ha-icon icon="${esc(b.icon || "mdi:gesture-tap")}"></ha-icon></button>`).join("");
      return `<header><div class="hello"><div class="muted" style="font-size:14px;letter-spacing:.02em">${esc(date)} · ${esc(time)}</div><h1 class="disp">${esc(title)}</h1></div><div class="chips">${chips}${edit || hb ? `<div class="hbs">${edit}${hb}</div>` : ""}</div></header>`;
    }

    _panel() {
      const { id: cur } = this._theme();
      const presets = ["auto", ...Object.keys(PRESETS)].map((k) => {
        const P = k === "auto" ? null : PRESETS[k];
        const on = this._p.preset === k || (this._p.preset === k);
        const dots = P ? [P.ground, ...P.orbs].map((c) => `<i class="tdot" style="background:${c}"></i>`).join("")
          : `<i class="tdot" style="background:${PRESETS.dawn.ground}"></i><i class="tdot" style="background:${PRESETS.midnight.ground}"></i>`;
        return `<button class="tchip ${on ? "on" : ""}" data-act="preset" data-v="${k}" aria-pressed="${on}"><span style="display:flex">${dots}</span>${P ? P.name : this._t("auto")}</button>`;
      }).join("");
      const accents = Object.keys(ACCENTS).map((k) =>
        `<button class="sw ${this._p.accent === k ? "on" : ""}" style="--c:${ACCENTS[k].c}" data-act="accent" data-v="${k}" aria-label="${ACCENTS[k].name}" aria-pressed="${this._p.accent === k}"></button>`).join("");
      const hidden = this._widgets.filter((w) => this._p.hidden.includes(w.id));
      const restore = hidden.length
        ? `<div class="row">${hidden.map((w) => `<button class="pill glass2" data-act="restore" data-w="${esc(w.id)}">${svgIcon(ICON.plus, 16, 2)}<span>${esc(this._title(w))}</span></button>`).join("")}</div>`
        : `<div class="muted" style="font-size:14px;min-height:44px;display:flex;align-items:center">${this._t("all_on_board")}</div>`;
      return `<section class="panel glass" aria-label="${this._t("customize")}" data-k="panel">
        <div class="grp"><div class="lbl">${this._t("theme")}</div><div class="row">${presets}</div></div>
        <div class="grp"><div class="lbl">${this._t("accent")}</div><div class="row">${accents}</div></div>
        <label class="grp"><span class="lbl">${this._t("blur")} · ${this._p.blur}px</span><input type="range" min="0" max="40" value="${this._p.blur}" data-act="blur" style="width:180px"></label>
        <div class="grp"><div class="lbl">${this._t("motion")}</div><button data-act="motion" aria-pressed="${this._p.motion}" style="display:flex;align-items:center;gap:10px;min-height:44px"><span class="toggle ${this._p.motion ? "on" : ""}"><i></i></span><span>${this._t(this._p.motion ? "on" : "off")}</span></button></div>
        <div class="grp" style="flex:1 1 260px;min-width:0"><div class="lbl">${this._t("add_widgets")}</div>${restore}</div>
        <div class="grp"><div class="lbl">&nbsp;</div><button class="pill glass2" data-act="reset">${this._t("reset")}</button></div>
      </section>`;
    }

    _ordered() {
      const ids = this._widgets.map((w) => w.id);
      const order = this._p.order.filter((id) => ids.includes(id)).concat(ids.filter((id) => !this._p.order.includes(id)));
      return order.map((id) => this._widgets.find((w) => w.id === id)).filter((w) => !this._p.hidden.includes(w.id));
    }

    _title(w) {
      if (w.title) return w.title;
      if ((w.type === "fan" || w.type === "climate" || w.type === "floor") && w.entity && this._st(w.entity)) return this._name(w.entity);
      return this._t(w.type);
    }

    _grid() {
      return this._ordered().map((w, i) => {
        const size = this._p.size[w.id] || w.size || "M";
        let body = "", meta = "";
        try {
          const fn = this[`_w_${w.type}`];
          if (!fn) body = `<div class="err">Unknown widget type: ${esc(w.type)}</div>`;
          else ({ body, meta } = fn.call(this, w));
        } catch (e) {
          body = `<div class="err">${esc(e.message)}</div>`;
        }
        const ctl = this._p.editing
          ? `<div class="ctl">
              <button class="glass2" data-act="mv" data-w="${esc(w.id)}" data-d="-1" aria-label="${this._t("move_earlier")}">${svgIcon(ICON.left, 16, 2)}</button>
              <button class="glass2" data-act="mv" data-w="${esc(w.id)}" data-d="1" aria-label="${this._t("move_later")}">${svgIcon(ICON.right, 16, 2)}</button>
              <button class="glass2" data-act="sz" data-w="${esc(w.id)}" aria-label="${this._t("change_size")}" style="width:44px">${size}</button>
              <button class="glass2" data-act="hide" data-w="${esc(w.id)}" aria-label="${this._t("remove")}">${svgIcon(ICON.minus, 16, 2)}</button></div>`
          : `<div class="meta">${esc(meta || "")}</div>`;
        return `<section class="w glass ${size}" data-k="${esc(w.id)}" style="--i:${i}" aria-label="${esc(this._title(w))}">
          <div class="wh"><div class="wt">${(() => { const ie = w.entity || w.lock; const ico = svgIcon(w.icon_path || ICON[w.type] || ICON.energy); return ie && !this._p.editing ? `<button class="ic" data-act="more" data-e="${esc(ie)}" aria-label="${esc(this._t("more_details"))}">${ico}</button>` : `<div class="ic">${ico}</div>`; })()}<h2>${esc(this._title(w))}</h2></div>${ctl}</div>${body}</section>`;
      }).join("");
    }

    _missing(e) { return { body: `<div class="err">${esc(this._t("not_found", { e }))}</div>`, meta: "" }; }

    /* ======================================================== widgets */
    _w_energy(w) {
      // A cross with the inverter in the middle: solar above, grid to the left, battery below, the house to the right.
      const solar = Math.max(0, this._kw(w.solar_power) ?? 0);
      let batt = this._kw(w.battery_power);            // + = charging (flip with invert_battery)
      if (batt != null && w.invert_battery) batt = -batt;
      let grid = this._kw(w.grid_power);               // + = import (flip with invert_grid)
      if (grid != null && w.invert_grid) grid = -grid;
      let home = this._kw(w.home_power);
      if (home == null) home = Math.max(0, solar + (grid ?? 0) - (batt ?? 0));
      let inv = this._kw(w.inverter_power);            // AC side of the inverter
      if (inv == null) inv = Math.max(0, solar - (batt ?? 0));
      const socS = this._st(w.battery_soc);
      const soc = socS && isFinite(parseFloat(socS.state)) ? clamp(Math.round(parseFloat(socS.state)), 0, 100) : null;
      const stS = this._st(w.inverter_status);
      const tS = this._st(w.inverter_temperature);
      const invTemp = tS && isFinite(parseFloat(tS.state)) ? `${this._num(parseFloat(tS.state), 0)}°` : "";
      const invSub = [stS && !["unknown", "unavailable"].includes(stS.state) ? stS.state : "", invTemp].filter(Boolean).join(" · ") || this._t("throughput");
      const hasGrid = grid != null, hasBatt = batt != null || soc != null;

      const on = (kw) => kw != null && Math.abs(kw) > 0.02;
      const imp = Math.max(0, grid ?? 0), exp = Math.max(0, -(grid ?? 0));
      const charge = Math.max(0, batt ?? 0), discharge = Math.max(0, -(batt ?? 0));
      const supply = solar + discharge + imp;
      const kw = (v) => `${this._num(Math.abs(v), Math.abs(v) < 10 ? 2 : 1)} kW`;
      const pct = (v) => `${supply > 0 ? Math.round(v / supply * 100) : 0}%`;
      const summary = on(exp) ? this._t(on(charge) ? "ef_export_charge" : "ef_export")
        : on(solar) && !on(imp) && !on(discharge) ? this._t(on(charge) ? "ef_solar_charge" : "ef_solar")
        : on(discharge) && on(imp) ? this._t(discharge >= imp ? "ef_batt_grid" : "ef_grid_batt")
        : on(discharge) ? this._t("ef_batt")
        : on(solar) && on(imp) ? this._t("ef_solar_grid")
        : on(imp) ? this._t("ef_grid") : this._t("ef_quiet");

      // A line between two nodes with three dots running along it; `back` runs them the other way.
      const leg = (axis, col, row, c, v, back) => {
        const live = on(v);
        const d = clamp(2.6 - Math.abs(v) * 0.4, 0.8, 2.6).toFixed(2);
        const tag = live ? `${kw(v)}<span class="pc"> · ${pct(Math.abs(v))}</span>` : esc(this._t("idle").toLowerCase());
        return `<div class="eleg ${axis} ${live ? "" : "idle"}" style="grid-column:${col};grid-row:${row};--c:var(--ef-${c});--d:${d}s;--dr:${back ? "reverse" : "normal"}" aria-hidden="true">
          <i class="edot"></i><i class="edot"></i><i class="edot"></i><span class="etag">${tag}</span></div>`;
      };
      // Node icons from the design: a ring, line art in a lighter tint and a small badge.
      const badge = (x, y, r, t, sm) => `<circle class="bdg" cx="${x}" cy="${y}" r="${r}"></circle><text class="bdt${sm ? " sm" : ""}" x="${x}" y="${y + 4}">${t}</text>`;
      const cells = soc == null ? [1, 0.55, 0.22] : [0, 1, 2].map((i) => (soc > i * 33 + 5 ? 1 : 0.2));
      const ART = {
        pv: `<svg viewBox="12 14 116 116" aria-hidden="true"><circle class="ring" cx="68" cy="70" r="52"></circle><circle class="ln" cx="68" cy="48" r="8"></circle>
          <path class="ln" d="M68 35V31M79 39l3-3M83 53h4M57 39l-3-3M53 53h-4"></path><rect class="ln" x="46" y="62" width="44" height="20" rx="3"></rect>
          <path class="ln thin" d="M61 62V82M75 62V82M46 72H90"></path>${badge(112, 102, 11, "PV")}</svg>`,
        grid: `<svg viewBox="148 14 116 116" aria-hidden="true"><circle class="ring" cx="204" cy="70" r="52"></circle>
          <path class="ln" d="M192 94V60M184 70h16M185 78h14M184 70l8-10M200 70l-8-10M216 94V60M208 70h16M209 78h14M208 70l8-10M224 70l-8-10"></path>
          <path class="ln thin" d="M184 70Q204 80 224 70M185 78Q204 87 223 78"></path>${badge(248, 102, 11, "AC")}</svg>`,
        inv: `<svg viewBox="278 8 132 132" aria-hidden="true"><circle class="ring" cx="340" cy="70" r="58"></circle><rect class="ln" x="308" y="54" width="64" height="34" rx="6"></rect>
          <polyline class="ln" points="315,80 315,64 323,64 323,80 329,80"></polyline><path class="ln thin" d="M340 57V85" stroke-dasharray="2.5 2"></path>
          <path class="ln" d="M348 71Q353 60 358 71Q363 82 368 71"></path>${badge(392, 106, 12, "INV", true)}</svg>`,
        house: `<svg viewBox="420 14 116 116" aria-hidden="true"><circle class="ring" cx="476" cy="70" r="52"></circle><polygon class="ln" points="476,46 500,60 500,90 452,90 452,60"></polygon>
          <rect class="ln" x="468" y="72" width="16" height="18" rx="2"></rect><rect class="ln" x="457" y="66" width="10" height="9" rx="1.5"></rect>
          <path class="ln thin" d="M462 66v9M457 70.5h10"></path><circle class="ln" cx="490" cy="66" r="6"></circle><path class="ln" d="M487 71.5h6M487.5 75h5"></path>${badge(520, 102, 11, "~W", true)}</svg>`,
        batt: `<svg viewBox="556 14 116 116" aria-hidden="true"><circle class="ring" cx="612" cy="70" r="52"></circle><rect class="ln" x="588" y="60" width="38" height="22" rx="4"></rect>
          <rect class="ln" x="626" y="66" width="6" height="10" rx="2.5"></rect>
          ${[592, 602, 612].map((x, i) => `<rect class="fl" x="${x}" y="64" width="${i < 2 ? 8 : 6}" height="14" rx="1.8" opacity="${cells[i]}"></rect>`).join("")}
          ${on(charge) ? `<polygon class="fl" points="608,42 602,53 607,53 604,66 615,51 609,51 613,42" opacity=".85"></polygon>` : ""}${badge(656, 102, 11, "DC")}</svg>`
      };
      const node = (col, row, c, e, act, inner, cls = "") =>
        `<button class="en ${cls} ${act ? "act" : ""}" style="grid-column:${col};grid-row:${row};--c:var(--ef-${c})" data-act="more" data-e="${esc(e || "")}">${ART[c]}${inner}</button>`;
      const lbl = (t, extra = "") => `<div class="el">${esc(t)}${extra}</div>`;
      const val = (t, sub = "") => `<div class="ev disp">${esc(t)}${sub}</div>`;
      const sub = (t) => (t ? `<div class="es">${esc(t)}</div>` : "");

      const battVal = batt == null ? `${soc}%` : `${on(charge) ? "+" : on(discharge) ? "−" : ""}${kw(charge || discharge)}`;
      const battSub = batt == null ? "" : on(charge) ? this._t("charging", { v: "" }).trim() : on(discharge) ? this._t("discharging", { v: "" }).trim() : this._t("idle");
      const grid3 = [
        // Solar sits above its line with the icon at the bottom, next to the line.
        node(3, 1, "pv", w.solar_power, on(solar), `${sub(on(solar) ? this._t("of_supply", { p: pct(solar) }) : this._t("no_production"))}${val(kw(solar))}${lbl(w.solar_name || this._t("solar"))}`, "up"),
        leg("v", 3, 2, "pv", solar, false),
        hasGrid ? node(1, 3, "grid", w.grid_power, on(grid), `${lbl(this._t("grid"))}${val(kw(grid))}${sub(on(exp) ? this._t("exporting") : on(imp) ? this._t("importing") : this._t("grid_idle"))}`, "side") : "",
        hasGrid ? leg("h", 2, 3, "grid", grid, on(exp)) : "",
        node(3, 3, "inv", w.inverter_power || w.inverter_status, on(inv), `${lbl(w.inverter_name || this._t("inverter"))}${val(kw(inv))}${sub(invSub)}`, "big"),
        leg("h", 4, 3, "house", home, false),
        node(5, 3, "house", w.home_power, on(home), `${lbl(w.load_name || this._t("load"))}${val(kw(home))}`, "side"),
        hasBatt ? leg("v", 3, 4, "batt", batt ?? 0, on(discharge)) : "",
        hasBatt ? node(3, 5, "batt", w.battery_soc || w.battery_power, on(batt),
          `${lbl(this._t("battery"), soc != null && batt != null ? `<small>${soc}%</small>` : "")}${soc != null ? `<div class="esoc"><i style="width:${soc}%"></i></div>` : ""}${val(battVal, battSub ? `<span class="es">${esc(battSub)}</span>` : "")}`) : ""
      ].join("");
      const legend = [["pv", this._t("solar")], hasGrid ? ["grid", this._t("grid")] : null, hasBatt ? ["batt", this._t("battery")] : null, ["house", this._t("load")]]
        .filter(Boolean).map(([c, t]) => `<span><i style="--c:var(--ef-${c})"></i>${esc(t)}</span>`).join("");
      const self = supply > 0 ? `${Math.round((supply - imp) / supply * 100)}%` : "—";
      return {
        body: `<div class="ef"><div class="efsum">${esc(summary)}</div><div class="efg">${grid3}</div>
          <div class="efoot"><div class="elg">${legend}</div><div>${esc(this._t("self_now"))} <b>${self}</b></div></div></div>`,
        meta: this._t("live")
      };
    }

    _w_lights(w) {
      const list = asList(w.entities).map(entOf).filter((l) => l.entity);
      const focusId = this._focus[w.id] && list.some((l) => l.entity === this._focus[w.id]) ? this._focus[w.id] : list[0]?.entity;
      let onCount = 0;
      const tiles = list.map((l) => {
        const s = this._st(l.entity);
        if (!s) return `<div class="tile"><div class="err">${esc(this._t("not_found", { e: l.entity }))}</div></div>`;
        const on = s.state === "on";
        if (on) onCount++;
        const bri = on ? Math.round(((s.attributes.brightness ?? 255) / 255) * 100) : 0;
        const pct = on ? (s.attributes.brightness != null ? `${bri}%` : this._t("on")) : this._t("off");
        const area = l.subtitle ?? (s.attributes.area || "");
        return `<button class="tile ${on ? "on" : ""} ${l.entity === focusId && list.length > 1 ? "focus" : ""}" data-k="${esc(l.entity)}" data-act="light" data-e="${esc(l.entity)}" data-w="${esc(w.id)}" aria-pressed="${on}" style="--glow:${14 + bri * 0.3}px">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:8px"><div class="bulb">${animIcon(s.entity_id ? s : { ...s, entity_id: l.entity }, 20, 1.9)}</div><div class="ts" style="font-variant-numeric:tabular-nums">${esc(pct)}</div></div>
          <div style="display:flex;flex-direction:column;gap:2px;min-width:0"><div class="tn">${esc(l.name || s.attributes.friendly_name)}</div><div class="ts">${esc(area)}</div></div>
          <div class="bar"><i style="width:${bri}%"></i></div></button>`;
      }).join("");
      const fs = this._st(focusId);
      const supportsBri = fs && (fs.attributes.supported_color_modes || []).some((m) => m !== "onoff");
      const fBri = fs && fs.state === "on" ? Math.round(((fs.attributes.brightness ?? 255) / 255) * 100) : 0;
      const dim = supportsBri
        ? `<label class="dim"><span class="muted" style="font-size:13px;white-space:nowrap">${esc(list.find((l) => l.entity === focusId)?.name || fs.attributes.friendly_name)}</span>
           <input type="range" min="1" max="100" value="${fBri || 1}" data-act="bri" data-e="${esc(focusId)}" aria-label="${this._t("brightness")}">
           <span style="font-size:13px;width:40px;text-align:right;font-variant-numeric:tabular-nums">${fBri}%</span></label>`
        : "";
      return { body: `<div class="tiles">${tiles}</div>${dim}`, meta: this._t("n_of_m_on", { n: onCount, m: list.length }) };
    }

    _w_climate(w) {
      const s = this._st(w.entity);
      if (!s) return this._missing(w.entity);
      const a = s.attributes;
      const mode = s.state;
      const action = a.hvac_action || (mode === "cool" ? "cooling" : mode === "heat" ? "heating" : mode === "off" ? "off" : "idle");
      const lo = a.min_temp ?? 16, hi = a.max_temp ?? 30;
      const target = this._pending[w.entity]?.t ?? a.temperature;
      const cur = a.current_temperature ?? (w.temperature ? parseFloat(this._st(w.temperature)?.state) : null);
      const c = action === "cooling" ? "cool" : action === "heating" ? "heat" : null;
      const C = 389.56, ARC = 292.17;
      const p = target != null ? clamp((target - lo) / (hi - lo), 0, 1) : 0;
      const ringColor = c ? `var(--${c})` : "var(--muted)";
      const modesWanted = w.modes || ["cool", "heat", "heat_cool", "auto", "off"];
      const avail = a.hvac_modes || [];
      const max = w.modes ? 4 : 3;
      const modes = modesWanted.filter((m) => avail.includes(m) && m !== "off").slice(0, avail.includes("off") ? max - 1 : max);
      if (avail.includes("off")) modes.push("off");
      const mbtn = modes.map((m) => {
        const mc = m === "cool" || m === "dry" ? "var(--cool)" : m === "heat" ? "var(--heat)" : m === "off" ? "var(--text)" : "var(--acc)";
        const label = this._loc(`component.climate.entity_component._.state.${m}`, pretty(m));
        return `<button class="mode ${mode === m ? "on" : ""}" style="--c:${mc}" data-act="hvac" data-e="${esc(w.entity)}" data-m="${m}" aria-pressed="${mode === m}">${esc(label)}</button>`;
      }).join("");
      let strip = "";
      if (c === "cool") strip = [0, 1, 2, 3, 4, 5].map((k) => `<i class="air" style="top:${6 + k * 5}px;--d:${2 + (k % 3) * 0.35}s;--dl:${k * -0.45}s"></i>`).join("");
      if (c === "heat") strip = [0, 1, 2, 3, 4, 5].map((k) => `<i class="heatb" style="left:${8 + k * 16}%;--d:${2.4 + (k % 2) * 0.5}s;--dl:${k * -0.5}s"></i>`).join("");
      const capt = action === "cooling" ? this._t("cooling") : action === "heating" ? this._t("heating") : mode === "off" ? this._t("off") : this._t("idle");
      const step = a.target_temp_step || (a.temperature_unit === "°F" ? 1 : 0.5);
      const hasTarget = target != null;
      return {
        body: `<div class="clim">
          <div class="ring"><svg viewBox="0 0 150 150" width="150" height="150" aria-hidden="true">
            <circle cx="75" cy="75" r="62" style="stroke:var(--track);stroke-dasharray:${ARC} ${C}"></circle>
            <circle class="rf" cx="75" cy="75" r="62" style="stroke:${ringColor};stroke-dasharray:${(mode === "off" ? 0 : ARC * p).toFixed(2)} ${C};filter:drop-shadow(0 0 8px ${c ? `color-mix(in srgb, var(--${c}) 60%, transparent)` : "transparent"})"></circle></svg>
            <div class="in"><span class="disp">${cur != null && isFinite(cur) ? this._num(cur, 1) + "°" : "—"}</span><span style="font-size:12px;color:${c ? ringColor : "var(--muted)"}">${esc(capt)}</span></div></div>
          <div class="cside">
            ${hasTarget ? `<div class="stepper"><button class="round glass2" data-act="temp" data-e="${esc(w.entity)}" data-d="${-step}" aria-label="−">−</button>
              <div style="display:flex;flex-direction:column;align-items:center"><span class="disp" style="font-size:26px">${this._num(target, step < 1 ? 1 : 0)}°</span><span class="muted" style="font-size:12px">${this._t("target")}</span></div>
              <button class="round glass2" data-act="temp" data-e="${esc(w.entity)}" data-d="${step}" aria-label="+">+</button></div>` : ""}
            <div class="modes" style="--n:${Math.max(1, modes.length)}">${mbtn}</div>
          </div></div>
          <div class="strip" aria-hidden="true">${strip}</div>`,
        meta: w.subtitle || (a.current_humidity != null ? this._t("humidity", { h: a.current_humidity }) : "")
      };
    }

    _w_scenes(w) {
      const list = asList(w.entities).map(entOf).filter((x) => x.entity);
      // Active = most recently activated scene (scene state is its activation timestamp) or a running script.
      let activeId = null, best = 0;
      list.forEach((x) => {
        const s = this._st(x.entity);
        if (!s) return;
        if (x.entity.startsWith("script.") && s.state === "on") { activeId = x.entity; best = Infinity; return; }
        const t = Date.parse(s.state);
        const max = (w.active_hours ?? 12) * 3600e3;
        if (isFinite(t) && t > best && Date.now() - t < max) { best = t; activeId = x.entity; }
      });
      const tiles = list.map((x) => {
        const s = this._st(x.entity);
        const on = x.entity === activeId;
        const name = x.name || s?.attributes?.friendly_name || x.entity;
        return `<button class="scene ${on ? "on" : ""}" data-k="${esc(x.entity)}" data-act="scene" data-e="${esc(x.entity)}" aria-pressed="${on}">
          <div class="sn"><span>${esc(name)}</span>${on ? `<span class="ping"></span>` : ""}</div>${x.description ? `<div class="sd">${esc(x.description)}</div>` : ""}</button>`;
      }).join("");
      const act = list.find((x) => x.entity === activeId);
      return { body: `<div class="scenes">${tiles}</div>`, meta: act ? this._t("active", { n: act.name || this._st(act.entity)?.attributes?.friendly_name || "" }) : this._t("tap_to_run") };
    }

    _w_media(w) {
      const s = this._st(w.entity);
      if (!s) return this._missing(w.entity);
      const a = s.attributes;
      const playing = s.state === "playing";
      const title = a.media_title || (INACTIVE.has(s.state) ? this._t("nothing_playing") : a.source || s.state);
      const sub = [a.media_artist, a.media_album_name].filter(Boolean).join(" · ") || a.friendly_name;
      const pic = a.entity_picture ? `background-image:url('${esc(a.entity_picture).replace(/'/g, "%27")}')` : "";
      const eq = [0.9, 1.15, 0.75, 1.3, 1.0, 0.85, 1.2].map((d, k) => `<i style="--d:${d}s;--dl:${k * -0.17}s"></i>`).join("");
      return {
        body: `<div class="mrow"><div class="art" style="${pic}">${pic ? "" : svgIcon(ICON.media, 30, 1.6)}</div><div class="mt"><b>${esc(title)}</b><span>${esc(sub)}</span></div></div>
          <div class="mfoot"><div class="eq ${playing ? "on" : ""}" aria-hidden="true">${eq}</div>
          <button class="play" data-act="playpause" data-e="${esc(w.entity)}" aria-label="${this._t(playing ? "pause" : "play")}">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="${playing ? "M7 5h3v14H7zM14 5h3v14h-3z" : "M8 5l11 7-11 7z"}"></path></svg></button></div>`,
        meta: w.subtitle || ""
      };
    }

    _w_fan(w) {
      const s = this._st(w.entity);
      if (!s) return this._missing(w.entity);
      const on = s.state === "on";
      const pct = on ? (s.attributes.percentage ?? 100) : 0;
      const lvl = on ? clamp(Math.ceil(pct / 34), 1, 3) : 0;
      const d = [0, 1.6, 0.9, 0.45][lvl];
      const blade = "M50 50 C 42 34, 42 14, 54 10 C 66 8, 66 32, 50 50 Z";
      return {
        body: `<button class="fanbtn ${on ? "fan-on" : ""}" data-act="fan" data-e="${esc(w.entity)}" aria-label="${esc(this._title(w))}">
          <svg width="88" height="88" viewBox="0 0 100 100" aria-hidden="true" style="flex:none">
            <circle cx="50" cy="50" r="46" fill="none" stroke-width="2" style="stroke:${on ? "color-mix(in srgb, var(--cool) 50%, transparent)" : "var(--track)"}"></circle>
            <g class="blades" style="--d:${d}s"><path d="${blade}"></path><path d="${blade}" transform="rotate(120 50 50)"></path><path d="${blade}" transform="rotate(240 50 50)"></path></g>
            <circle cx="50" cy="50" r="6" style="fill:var(--text)"></circle></svg>
          <div style="display:flex;flex-direction:column;gap:6px"><span class="disp" style="font-size:24px">${on ? (s.attributes.percentage != null ? this._t("speed", { n: lvl }) : this._t("on")) : this._t("off")}</span>
          <div class="pips">${[1, 2, 3].map((k) => `<i class="${lvl >= k ? "on" : ""}"></i>`).join("")}</div><span class="muted" style="font-size:12px">${this._t("tap_speed")}</span></div></button>`,
        meta: on ? this._t("running") : this._t("idle")
      };
    }

    _w_floor(w) {
      const s = this._st(w.entity);
      if (!s) return this._missing(w.entity);
      const isClimate = w.entity.startsWith("climate.");
      const a = s.attributes;
      const on = isClimate ? s.state !== "off" : s.state === "on";
      const heating = isClimate ? (a.hvac_action ? a.hvac_action === "heating" : on) : on;
      const tS = this._st(w.temperature);
      const temp = tS && isFinite(parseFloat(tS.state)) ? parseFloat(tS.state) : a.current_temperature;
      const capt = on ? (isClimate && a.temperature != null ? this._t("heating_to", { t: this._num(a.temperature, 0) + "°" }) : this._t("on")) : this._t("off");
      const wave = "M0 20 Q 25 8 50 20 T 100 20 T 150 20 T 200 20 T 250 20 T 300 20 T 350 20 T 400 20";
      const waves = [0, 1, 2].map((k) => `<svg class="${k === 1 ? "r" : ""}" viewBox="0 0 400 40" preserveAspectRatio="none" style="top:${k * 13 - 2}px;--d:${5 + k * 1.6}s;opacity:${1 - k * 0.25}"><path d="${wave}"></path></svg>`).join("");
      return {
        body: `<div class="frow"><div style="display:flex;flex-direction:column;gap:2px"><span class="disp big">${temp != null && isFinite(temp) ? this._num(temp, 1) + "°" : "—"}</span><span class="muted" style="font-size:12px">${esc(capt)}</span></div>
          <button data-act="floor" data-e="${esc(w.entity)}" aria-pressed="${on}" aria-label="${esc(this._title(w))}" style="display:flex;align-items:center;min-height:44px"><span class="toggle ${on ? "on" : ""}" style="--c:var(--heat)"><i></i></span></button></div>
          <div class="waves ${heating ? "on" : ""}" aria-hidden="true">${waves}</div>`,
        meta: w.subtitle || (on ? this._t("on") : this._t("off"))
      };
    }

    _w_security(w) {
      const lock = this._st(w.lock);
      const sensors = asList(w.sensors).map(entOf).filter((x) => x.entity);
      const open = sensors.filter((x) => this._st(x.entity)?.state === "on");
      let lockHtml = "";
      let locked = true;
      if (w.lock) {
        if (!lock) return this._missing(w.lock);
        locked = lock.state === "locked";
        const c = locked ? "battery" : "alert";
        lockHtml = `<button class="lockbtn ${locked ? "" : "unl"}" data-act="lock" data-e="${esc(w.lock)}" aria-pressed="${locked}">
          <div class="lockb" style="--c:var(--${c})"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><g class="shackle"><path d="M8 11V7a4 4 0 0 1 8 0v4"></path></g><rect x="5" y="11" width="14" height="10" rx="2.5"></rect></svg></div>
          <div style="display:flex;flex-direction:column;gap:2px"><span style="font-size:16px;font-weight:600">${esc(w.lock_name || lock.attributes.friendly_name)}</span><span style="font-size:13px;color:${locked ? "var(--muted)" : "var(--alert)"}">${this._t(locked ? "locked" : "unlocked")}</span></div></button>`;
      }
      const lines = sensors.length
        ? `<div class="sens">${(open.length ? open : [null]).map((x) => x
            ? `<button class="sline" data-act="more" data-e="${esc(x.entity)}"><span class="ping" style="--c:var(--alert)"></span><span>${esc(x.name || this._st(x.entity).attributes.friendly_name)}</span></button>`
            : `<div class="sline"><span class="dot" style="--c:var(--battery);box-shadow:none"></span><span class="muted">${this._t("all_closed")}</span></div>`).join("")}</div>`
        : "";
      const meta = !locked ? this._t("door_unlocked") : open.length ? this._t("n_open", { n: open.length }) : this._t("secure");
      return { body: lockHtml + lines, meta };
    }

    _wxProvider(w) {
      if (w.source === "open_meteo") return "Open-Meteo";
      const e = this._hass?.entities?.[w.entity];
      const p = e?.platform;
      const names = { met: "Met.no", openweathermap: "OpenWeatherMap", accuweather: "AccuWeather", open_meteo: "Open-Meteo", pirateweather: "Pirate Weather", tomorrowio: "Tomorrow.io", metoffice: "Met Office", nws: "NWS", buienradar: "Buienradar", meteo_france: "Météo-France", smhi: "SMHI", ipma: "IPMA", aemet: "AEMET", dwd_weather: "DWD", template: "Template" };
      return p ? names[p] || pretty(p) : "";
    }
    _w_weather(w) {
      const om = w.source === "open_meteo";
      const s = om ? omState(this._hass, w) : this._st(w.entity);
      if (om && !s) return { body: `<div class="err">${esc(this._t("no_location"))}</div>`, meta: "Open-Meteo" };
      if (!s) return this._missing(w.entity);
      const a = s.attributes;
      const cond = s.state;
      const art = weatherArt(cond, this._theme().T.dark);
      const unit = a.temperature_unit || "°";
      const label = this._loc(`component.weather.entity_component._.state.${cond}`, WX_LABEL[cond] || pretty(cond));
      const hum = a.humidity != null ? ` · ${this._t("humidity", { h: Math.round(a.humidity) })}` : "";
      return {
        body: `<button class="wx" data-act="more" data-e="${esc(om ? OM_ID : w.entity)}">${art}<div style="display:flex;flex-direction:column;gap:2px;text-align:left"><span class="disp big">${a.temperature != null ? this._num(a.temperature, 0) + (unit.startsWith("°") ? "°" : unit) : "—"}</span><span class="muted" style="font-size:13px">${esc(s.state === "unknown" && om ? (s.attributes.aurora_error || "…") : label)}${esc(hum)}</span></div></button>`,
        meta: w.subtitle || this._wxProvider(w)
      };
    }

    /* ======================================================== events */
    _onDown(e) {
      const el = e.target.closest?.("[data-e]");
      clearTimeout(this._lp);
      if (!el || this._p.editing) return;
      this._lp = setTimeout(() => { this._suppress = true; this._popup(el.dataset.e, el); }, 550);
    }
    _onContext(e) {
      const el = e.target.closest?.("[data-e]");
      if (!el || !el.dataset.e) return;
      e.preventDefault();
      this._popup(el.dataset.e, el);
    }

    _onClick(e) {
      if (this._suppress) { this._suppress = false; e.preventDefault(); return; }
      const el = e.target.closest?.("[data-act]");
      if (!el) return;
      const { act, e: ent, w: wid, d, v, m } = el.dataset;
      switch (act) {
        case "edit": return this._set({ editing: !this._p.editing });
        case "preset": return this._set({ preset: v });
        case "accent": return this._set({ accent: v });
        case "motion": return this._set({ motion: !this._p.motion });
        case "reset": return this._set({ order: [], size: {}, hidden: [] });
        case "restore": return this._set({ hidden: this._p.hidden.filter((x) => x !== wid) });
        case "hide": return this._set({ hidden: [...this._p.hidden, wid] });
        case "sz": {
          const w = this._widgets.find((x) => x.id === wid);
          const curS = this._p.size[wid] || w.size || "M";
          const nxt = { S: "M", M: "L", L: "XL", XL: "S" }[curS] || "M";
          return this._set({ size: { ...this._p.size, [wid]: nxt } });
        }
        case "mv": {
          const vis = this._ordered().map((x) => x.id);
          const all = this._widgets.map((x) => x.id);
          const order = this._p.order.filter((id) => all.includes(id)).concat(all.filter((id) => !this._p.order.includes(id)));
          const i = vis.indexOf(wid), j = i + Number(d);
          if (j < 0 || j >= vis.length) return;
          const a = order.indexOf(vis[i]), b = order.indexOf(vis[j]);
          [order[a], order[b]] = [order[b], order[a]];
          return this._set({ order });
        }
      }
      if (this._p.editing) return;
      const st = this._st(ent);
      switch (act) {
        case "more": if (ent) this._popup(ent, el); return;
        case "hb": {
          const b = asList(this._config.header_buttons)[Number(el.dataset.i)];
          if (!b) return;
          const ev = new Event("hass-action", { bubbles: true, composed: true });
          ev.detail = { config: { entity: b.entity, tap_action: b.tap_action || { action: "none" } }, action: "tap" };
          // after this tap has finished, so a pop-up it opens (e.g. Bubble Card) isn't closed by the same tap
          setTimeout(() => this.dispatchEvent(ev), 150);
          return;
        }
        case "light": {
          // Tiles can be lights, switches or input_booleans: use each entity's own toggle service.
          this._focus[wid] = ent;
          const dom = ent.split(".")[0];
          if (["light", "switch", "input_boolean", "fan"].includes(dom)) this._call(dom, "toggle", { entity_id: ent });
          else this._call("homeassistant", "toggle", { entity_id: ent });
          return this._schedule();
        }
        case "scene": {
          const dom = ent.split(".")[0];
          if (dom === "scene") this._call("scene", "turn_on", { entity_id: ent });
          else if (dom === "script") this._call("script", "turn_on", { entity_id: ent });
          else if (dom === "button" || dom === "input_button") this._call(dom, "press", { entity_id: ent });
          else this._call("homeassistant", "toggle", { entity_id: ent });
          return;
        }
        case "hvac": return this._call("climate", "set_hvac_mode", { entity_id: ent, hvac_mode: m });
        case "temp": {
          if (!st) return;
          const a = st.attributes;
          const base = this._pending[ent]?.t ?? a.temperature;
          const t = clamp(Math.round((base + Number(d)) * 10) / 10, a.min_temp ?? 7, a.max_temp ?? 35);
          clearTimeout(this._pending[ent]?.timer);
          this._pending[ent] = { t, timer: setTimeout(() => {
            this._call("climate", "set_temperature", { entity_id: ent, temperature: t });
            setTimeout(() => { delete this._pending[ent]; this._schedule(); }, 1500);
          }, 600) };
          return this._schedule();
        }
        case "playpause": return this._call("media_player", "media_play_pause", { entity_id: ent });
        case "fan": {
          if (!st) return;
          if (st.attributes.percentage == null) return this._call("fan", "toggle", { entity_id: ent });
          const pct = st.state === "on" ? st.attributes.percentage || 0 : 0;
          const next = pct < 30 ? 33 : pct < 63 ? 66 : pct < 99 ? 100 : 0;
          return next ? this._call("fan", "set_percentage", { entity_id: ent, percentage: next }) : this._call("fan", "turn_off", { entity_id: ent });
        }
        case "floor":
          if (ent.startsWith("climate.")) return this._call("climate", "set_hvac_mode", { entity_id: ent, hvac_mode: st && st.state !== "off" ? "off" : "heat" });
          return this._call("homeassistant", "toggle", { entity_id: ent });
        case "lock": return this._call("lock", st && st.state === "locked" ? "unlock" : "lock", { entity_id: ent });
      }
    }

    _onInput(e, committed) {
      const el = e.target;
      if (!el || !el.dataset) return;
      if (el.dataset.act === "blur") { this._p.blur = Number(el.value); if (committed) this._savePrefs(); this._schedule(); }
      if (el.dataset.act === "bri" && committed) this._call("light", "turn_on", { entity_id: el.dataset.e, brightness_pct: Number(el.value) });
    }
  }

  /* ================================================================ visual editor */
  const WIDGET_TYPES = ["energy", "lights", "climate", "scenes", "media", "fan", "floor", "security", "weather"];
  const ED_LABELS = {
    en: {
      appearance: "Appearance", chips: "Header chips", widgets: "Widgets", add_widget: "Add widget", add_chip: "Add chip", add_light: "Add light", add_scene: "Add scene",
      preset: "Theme preset", accent: "Accent colour", blur: "Glass blur", motion: "Animations", background: "Draw the glass background", header: "Show header",
      customize: "Show the Customize button", dashboard_theme: "Apply the glass theme to the whole dashboard (no theme file needed)", title: "Title", top_title: "Title (empty = greeting)", min_height: "Minimum height (e.g. 100vh for a Panel view)", language: "Language",
      type: "Widget type", size: "Size", entity: "Entity", name: "Name", subtitle: "Subtitle", color: "Dot colour", decimals: "Decimals", description: "Description",
      solar_power: "Solar power", home_power: "Load / house consumption (optional, computed if empty)", inverter_power: "Inverter output power (optional)", inverter_status: "Inverter status (optional, e.g. work mode)", inverter_temperature: "Inverter temperature (optional)", battery_power: "Battery power", battery_soc: "Battery charge (%)",
      grid_power: "Grid power", invert_battery: "Battery sensor is positive when discharging (GoodWe)", invert_grid: "Grid sensor is positive when exporting (GoodWe)",
      modes: "Mode buttons (empty = automatic)", active_hours: "Keep a scene marked active for (hours)", temperature: "Temperature sensor",
      lock: "Lock", lock_name: "Lock name", sensors: "Door and window sensors", move_up: "Move up", move_down: "Move down", delete: "Delete",
      loading: "Loading Home Assistant editor components…", no_lights: "No lights yet.", no_scenes: "No scenes yet.", no_chips: "No chips yet.",
      device_note: "Tip: the Customize button on the dashboard changes the layout only on that device. Settings here apply everywhere.",
      popup: "Hold a tile (or tap a chip, energy node or widget icon) to open", popup_aurora: "Aurora Glass pop-up", popup_native: "Home Assistant's dialog", popup_none: "Nothing",
      layout: "Layout", layout_tile: "Tile", layout_row: "Row", tap_action: "Tap", hold_action: "Hold", act_auto: "Automatic (toggle or run, else pop-up)", act_toggle: "Toggle",
      act_popup: "Aurora Glass pop-up", act_native: "Home Assistant's dialog", act_none: "Nothing", icon: "Icon (optional)", show_state: "Show the state", glass: "Glass background", auto: "Auto",
      source: "Weather service", src_entity: "A Home Assistant weather entity (Met.no, OpenWeatherMap, AccuWeather, …)", src_om: "Open-Meteo (built in, free, no account)",
      latitude: "Latitude (empty = home)", longitude: "Longitude (empty = home)", location_name: "Place name (optional)",
      header_buttons: "Header buttons", add_button: "Add button", no_buttons: "No buttons yet.", admin_only: "Admins only"
    },
    ro: {
      appearance: "Aspect", chips: "Indicatori în antet", widgets: "Widgeturi", add_widget: "Adaugă widget", add_chip: "Adaugă indicator", add_light: "Adaugă lumină", add_scene: "Adaugă scenă",
      preset: "Temă", accent: "Culoare de accent", blur: "Estompare sticlă", motion: "Animații", background: "Fundal de sticlă", header: "Afișează antetul",
      customize: "Afișează butonul Personalizează", dashboard_theme: "Aplică tema de sticlă pe tot tabloul (fără fișier de temă)", title: "Titlu", top_title: "Titlu (gol = salut)", min_height: "Înălțime minimă (ex. 100vh pentru vizualizare Panou)", language: "Limbă",
      type: "Tip widget", size: "Mărime", entity: "Entitate", name: "Nume", subtitle: "Subtitlu", color: "Culoare punct", decimals: "Zecimale", description: "Descriere",
      solar_power: "Putere solară", home_power: "Consum / sarcină (opțional, calculat dacă e gol)", inverter_power: "Putere ieșire invertor (opțional)", inverter_status: "Stare invertor (opțional, ex. mod de lucru)", inverter_temperature: "Temperatură invertor (opțional)", battery_power: "Putere baterie", battery_soc: "Încărcare baterie (%)",
      grid_power: "Putere rețea", invert_battery: "Senzorul bateriei e pozitiv la descărcare (GoodWe)", invert_grid: "Senzorul rețelei e pozitiv la injectare (GoodWe)",
      modes: "Butoane moduri (gol = automat)", active_hours: "Păstrează scena activă timp de (ore)", temperature: "Senzor temperatură",
      lock: "Încuietoare", lock_name: "Nume încuietoare", sensors: "Senzori uși și ferestre", move_up: "Mută sus", move_down: "Mută jos", delete: "Șterge",
      loading: "Se încarcă editorul Home Assistant…", no_lights: "Nicio lumină încă.", no_scenes: "Nicio scenă încă.", no_chips: "Niciun indicator încă.",
      device_note: "Sfat: butonul Personalizează de pe tablou schimbă aranjarea doar pe acel dispozitiv. Setările de aici se aplică peste tot.",
      popup: "Ține apăsat pe un element (sau atinge un indicator, un nod sau iconița unui widget) pentru", popup_aurora: "Fereastra Aurora Glass", popup_native: "Fereastra Home Assistant", popup_none: "Nimic",
      layout: "Aspect", layout_tile: "Pătrat", layout_row: "Rând", tap_action: "Atingere", hold_action: "Ținere apăsată", act_auto: "Automat (comută sau rulează, altfel fereastră)", act_toggle: "Comută",
      act_popup: "Fereastra Aurora Glass", act_native: "Fereastra Home Assistant", act_none: "Nimic", icon: "Iconiță (opțional)", show_state: "Afișează starea", glass: "Fundal de sticlă", auto: "Auto",
      source: "Serviciu meteo", src_entity: "O entitate meteo din Home Assistant (Met.no, OpenWeatherMap, AccuWeather, …)", src_om: "Open-Meteo (inclus, gratuit, fără cont)",
      latitude: "Latitudine (gol = casa)", longitude: "Longitudine (gol = casa)", location_name: "Numele locului (opțional)",
      header_buttons: "Butoane în antet", add_button: "Adaugă buton", no_buttons: "Niciun buton încă.", admin_only: "Doar administratori"
    }
  };
  const MDI = {
    up: "M13,20H11V8L5.5,13.5L4.08,12.08L12,4.16L19.92,12.08L18.5,13.5L13,8V20Z",
    down: "M11,4H13V16L18.5,10.5L19.92,11.92L12,19.84L4.08,11.92L5.5,10.5L11,16V4Z",
    del: "M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z",
    plus: "M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z",
    chev: "M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"
  };
  const opt = (values, labels) => values.map((v) => ({ value: v, label: labels ? labels[v] || v : v }));
  const TOP_DEFAULTS = { preset: "auto", accent: "peach", blur: 24, motion: true, background: true, header: true, customize: true, dashboard_theme: true, language: "auto", popup: "aurora" };

  function cleanCfg(v) {
    if (Array.isArray(v)) return v.map(cleanCfg).filter((x) => x !== undefined);
    if (v && typeof v === "object") {
      const o = {};
      Object.keys(v).forEach((k) => {
        const c = cleanCfg(v[k]);
        if (c === undefined || c === "" || c === null) return;
        if (Array.isArray(c) && !c.length && k !== "widgets") return;
        o[k] = c;
      });
      return o;
    }
    return v;
  }
  // A list item with only an entity is written back as a plain entity id.
  const compactItem = (x) => (x && typeof x === "object" && Object.keys(cleanCfg(x)).length === 1 && x.entity ? x.entity : cleanCfg(x));

  let helpersPromise = null;
  function ensureHaComponents() {
    if (customElements.get("ha-form") && customElements.get("ha-entity-picker")) return Promise.resolve();
    if (!helpersPromise) {
      helpersPromise = (async () => {
        try {
          const helpers = await window.loadCardHelpers?.();
          if (helpers) {
            const c = await helpers.createCardElement({ type: "entities", entities: [] });
            if (c?.constructor?.getConfigElement) await c.constructor.getConfigElement();
          }
        } catch (e) { /* fall through */ }
        await Promise.race([customElements.whenDefined("ha-form"), new Promise((r) => setTimeout(r, 4000))]);
      })();
    }
    return helpersPromise;
  }

  class AuroraGlassCardEditor extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this._open = new Set(["appearance"]);
      this._forms = [];
    }
    setConfig(config) {
      const incoming = JSON.stringify(config || {});
      if (this._config && incoming === this._lastFired) return;   // our own change echoed back: keep the live objects the forms edit
      this._config = JSON.parse(incoming);
      if (!Array.isArray(this._config.widgets)) this._config.widgets = [];
      this._render();
    }
    set hass(h) {
      const first = !this._hass;
      this._hass = h;
      this._forms.forEach((f) => { f.hass = h; });
      if (first) this._render();
    }
    connectedCallback() { ensureHaComponents().then(() => { this._ready = true; this._render(); }); }

    get _lang() { const l = (this._hass?.locale?.language || "en").split("-")[0]; return ED_LABELS[l] ? l : "en"; }
    _l(k) { return ED_LABELS[this._lang][k] ?? ED_LABELS.en[k] ?? I18N[this._lang]?.[k] ?? I18N.en[k] ?? k; }
    _typeName(t) { return I18N[this._lang]?.[t] || I18N.en[t] || t; }

    _fire() {
      const cfg = cleanCfg(this._config);
      cfg.type = this._config.type || "custom:aurora-glass-card";
      this._lastFired = JSON.stringify(cfg);
      this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: cfg }, bubbles: true, composed: true }));
    }

    /* ----- schemas */
    _topSchema() {
      const presetLabels = { auto: this._l("auto") + " (HA light/dark)" };
      Object.keys(PRESETS).forEach((k) => { presetLabels[k] = PRESETS[k].name; });
      const accentLabels = {};
      Object.keys(ACCENTS).forEach((k) => { accentLabels[k] = ACCENTS[k].name; });
      return [
        { type: "grid", name: "", schema: [
          { name: "preset", selector: { select: { mode: "dropdown", options: opt(["auto", ...Object.keys(PRESETS)], presetLabels) } } },
          { name: "accent", selector: { select: { mode: "dropdown", options: opt(Object.keys(ACCENTS), accentLabels) } } }
        ] },
        { name: "blur", selector: { number: { min: 0, max: 40, step: 1, mode: "slider", unit_of_measurement: "px" } } },
        { type: "grid", name: "", schema: [
          { name: "motion", selector: { boolean: {} } },
          { name: "background", selector: { boolean: {} } },
          { name: "header", selector: { boolean: {} } },
          { name: "customize", selector: { boolean: {} } }
        ] },
        { name: "dashboard_theme", selector: { boolean: {} } },
        { name: "popup", selector: { select: { mode: "dropdown", options: opt(["aurora", "native", "none"], { aurora: this._l("popup_aurora"), native: this._l("popup_native"), none: this._l("popup_none") }) } } },
        { type: "grid", name: "", schema: [
          { name: "title", selector: { text: {} } },
          { name: "language", selector: { select: { mode: "dropdown", options: opt(["auto", "en", "ro"], { auto: this._l("auto"), en: "English", ro: "Română" }) } } }
        ] },
        { name: "min_height", selector: { text: {} } }
      ];
    }
    _widgetSchema(type, w = {}) {
      const sizes = { type: "grid", name: "", schema: [
        { name: "type", selector: { select: { mode: "dropdown", options: WIDGET_TYPES.map((t) => ({ value: t, label: this._typeName(t) })) } } },
        { name: "size", selector: { select: { mode: "dropdown", options: opt(["S", "M", "L", "XL"]) } } }
      ] };
      const title = { name: "title", selector: { text: {} } };
      const subtitle = { name: "subtitle", selector: { text: {} } };
      const power = (n) => ({ name: n, selector: { entity: { domain: "sensor" } } });
      switch (type) {
        case "energy": return [sizes, title, power("solar_power"), power("grid_power"),
          { type: "grid", name: "", schema: [power("battery_power"), power("battery_soc")] }, power("home_power"),
          power("inverter_power"),
          { type: "grid", name: "", schema: [{ name: "inverter_status", selector: { entity: { domain: "sensor" } } }, power("inverter_temperature")] },
          { name: "invert_battery", selector: { boolean: {} } }, { name: "invert_grid", selector: { boolean: {} } }];
        case "lights": return [sizes, title];
        case "climate": return [sizes, title, { name: "entity", selector: { entity: { domain: "climate" } } },
          { name: "modes", selector: { select: { multiple: true, mode: "list", options: ["cool", "heat", "heat_cool", "auto", "dry", "fan_only", "off"].map((m) => ({ value: m, label: this._hass?.localize?.(`component.climate.entity_component._.state.${m}`) || pretty(m) })) } } },
          subtitle];
        case "scenes": return [sizes, title, { name: "active_hours", selector: { number: { min: 1, max: 48, step: 1, mode: "box", unit_of_measurement: "h" } } }];
        case "media": return [sizes, title, { name: "entity", selector: { entity: { domain: "media_player" } } }, subtitle];
        case "fan": return [sizes, title, { name: "entity", selector: { entity: { domain: "fan" } } }];
        case "floor": return [sizes, title, { name: "entity", selector: { entity: { domain: ["climate", "switch", "input_boolean"] } } },
          { name: "temperature", selector: { entity: { domain: "sensor" } } }, subtitle];
        case "security": return [sizes, title, { type: "grid", name: "", schema: [{ name: "lock", selector: { entity: { domain: "lock" } } }, { name: "lock_name", selector: { text: {} } }] },
          { name: "sensors", selector: { entity: { multiple: true, domain: "binary_sensor" } } }];
        case "weather": return [sizes, title,
          { name: "source", selector: { select: { mode: "dropdown", options: [{ value: "entity", label: this._l("src_entity") }, { value: "open_meteo", label: this._l("src_om") }] } } },
          ...(w.source === "open_meteo"
            ? [{ type: "grid", name: "", schema: [{ name: "latitude", selector: { number: { min: -90, max: 90, step: 0.01, mode: "box" } } }, { name: "longitude", selector: { number: { min: -180, max: 180, step: 0.01, mode: "box" } } }] },
              { name: "location_name", selector: { text: {} } }]
            : [{ name: "entity", selector: { entity: { domain: "weather" } } }]),
          subtitle];
        default: return [sizes, title];
      }
    }
    _rowSchema(kind) {
      if (kind === "lights") return [{ type: "grid", name: "", schema: [{ name: "entity", selector: { entity: { domain: ["light", "switch", "input_boolean"] } } }, { name: "name", selector: { text: {} } }, { name: "subtitle", selector: { text: {} } }] }];
      if (kind === "scenes") return [{ type: "grid", name: "", schema: [{ name: "entity", selector: { entity: { domain: ["scene", "script", "button", "input_button"] } } }, { name: "name", selector: { text: {} } }] }, { name: "description", selector: { text: {} } }];
      if (kind === "buttons") return [{ type: "grid", name: "", schema: [{ name: "icon", selector: { icon: {} } }, { name: "name", selector: { text: {} } }, { name: "admin_only", selector: { boolean: {} } }] },
        { name: "tap_action", selector: { ui_action: {} } }];
      const colors = { "": this._l("accent"), cool: "Cool (blue)", heat: "Heat (orange)", solar: "Solar (yellow)", battery: "Battery (green)", grid: "Grid (violet)", alert: "Alert (red)" };
      return [{ type: "grid", name: "", schema: [{ name: "entity", selector: { entity: { domain: "sensor" } } }, { name: "name", selector: { text: {} } },
        { name: "color", selector: { select: { mode: "dropdown", options: opt(["", "cool", "heat", "solar", "battery", "grid", "alert"], colors) } } }] }];
    }

    /* ----- DOM helpers */
    _form(schema, data, onChange, labels) {
      const f = document.createElement("ha-form");
      f.computeLabel = (s) => this._l((labels && labels[s.name]) || s.name);
      f.hass = this._hass;
      f.schema = schema;
      f.data = data;
      f.addEventListener("value-changed", (ev) => { ev.stopPropagation(); f.data = ev.detail.value; onChange(ev.detail.value); });
      this._forms.push(f);
      return f;
    }
    _iconBtn(path, label, onClick, disabled) {
      const b = document.createElement("button");
      b.className = "ib";
      b.type = "button";
      b.title = label;
      b.setAttribute("aria-label", label);
      b.disabled = !!disabled;
      b.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="${path}" fill="currentColor"></path></svg>`;
      b.addEventListener("click", (e) => { e.preventDefault(); e.stopPropagation(); onClick(); });
      return b;
    }
    _addBtn(label, onClick) {
      const b = document.createElement("button");
      b.className = "add";
      b.type = "button";
      b.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="${MDI.plus}" fill="currentColor"></path></svg><span>${esc(label)}</span>`;
      b.addEventListener("click", (e) => { e.preventDefault(); onClick(); });
      return b;
    }
    _section(key, title, badge) {
      const d = document.createElement("details");
      d.className = "sec";
      d.open = this._open.has(key);
      d.addEventListener("toggle", () => { if (d.open) this._open.add(key); else this._open.delete(key); });
      const s = document.createElement("summary");
      s.innerHTML = `<span class="st">${esc(title)}</span>${badge ? `<span class="badge">${esc(badge)}</span>` : ""}<svg class="chev" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="${MDI.chev}" fill="currentColor"></path></svg>`;
      d.appendChild(s);
      const body = document.createElement("div");
      body.className = "body";
      d.appendChild(body);
      return { d, s, body };
    }

    /* list of {entity,…} rows stored at obj[key] */
    _list(container, obj, key, kind, emptyKey, addKey) {
      const items = asList(obj[key]).map(entOf);
      obj[key] = items;
      if (!items.length) {
        const p = document.createElement("div");
        p.className = "empty";
        p.textContent = this._l(emptyKey);
        container.appendChild(p);
      }
      items.forEach((it, i) => {
        const row = document.createElement("div");
        row.className = "row";
        const data = kind === "chips" ? { ...it, color: it.color || "" } : { ...it };
        row.appendChild(this._form(this._rowSchema(kind), data, (v) => {
          items[i] = { ...v };
          obj[key] = items.map(compactItem);
          this._fire();
        }));
        const tools = document.createElement("div");
        tools.className = "tools";
        tools.appendChild(this._iconBtn(MDI.up, this._l("move_up"), () => { [items[i - 1], items[i]] = [items[i], items[i - 1]]; obj[key] = items.map(compactItem); this._fire(); this._render(); }, i === 0));
        tools.appendChild(this._iconBtn(MDI.down, this._l("move_down"), () => { [items[i + 1], items[i]] = [items[i], items[i + 1]]; obj[key] = items.map(compactItem); this._fire(); this._render(); }, i === items.length - 1));
        tools.appendChild(this._iconBtn(MDI.del, this._l("delete"), () => { items.splice(i, 1); obj[key] = items.map(compactItem); this._fire(); this._render(); }));
        row.appendChild(tools);
        container.appendChild(row);
      });
      obj[key] = items.map(compactItem);
      container.appendChild(this._addBtn(this._l(addKey), () => { obj[key] = [...asList(obj[key]), { entity: "" }]; this._render(); }));
    }

    _render() {
      if (!this._config || !this.shadowRoot) return;
      const sr = this.shadowRoot;
      this._forms = [];
      sr.innerHTML = `<style>${ED_CSS}</style><div class="ed"></div>`;
      const root = sr.querySelector(".ed");
      if (!this._ready || !customElements.get("ha-form") || !this._hass) {
        root.innerHTML = `<div class="empty">${esc(this._l("loading"))}</div>`;
        return;
      }
      const c = this._config;

      // Appearance
      const ap = this._section("appearance", this._l("appearance"));
      const top = {};
      Object.keys(TOP_DEFAULTS).forEach((k) => { top[k] = c[k] ?? TOP_DEFAULTS[k]; });
      top.title = c.title || "";
      top.min_height = c.min_height || "";
      ap.body.appendChild(this._form(this._topSchema(), top, (v) => {
        Object.keys(v).forEach((k) => {
          if (k in TOP_DEFAULTS && v[k] === TOP_DEFAULTS[k]) delete c[k]; else c[k] = v[k];
        });
        if (c.language === "auto") delete c.language;
        this._fire();
      }, { title: "top_title" }));
      const note = document.createElement("div");
      note.className = "note";
      note.textContent = this._l("device_note");
      ap.body.appendChild(note);
      root.appendChild(ap.d);

      // Chips
      const ch = this._section("chips", this._l("chips"), String(asList(c.chips).length));
      this._list(ch.body, c, "chips", "chips", "no_chips", "add_chip");
      root.appendChild(ch.d);

      // Widgets
      const wl = this._section("widgets", this._l("widgets"), String(c.widgets.length));
      c.widgets.forEach((w, i) => {
        const key = `w${i}:${w.type}`;
        const sec = this._section(key, `${this._typeName(w.type)}${w.title ? " · " + w.title : ""}`, w.size || "M");
        sec.d.classList.add("wd");
        const tools = document.createElement("span");
        tools.className = "tools";
        tools.appendChild(this._iconBtn(MDI.up, this._l("move_up"), () => { [c.widgets[i - 1], c.widgets[i]] = [c.widgets[i], c.widgets[i - 1]]; this._fire(); this._render(); }, i === 0));
        tools.appendChild(this._iconBtn(MDI.down, this._l("move_down"), () => { [c.widgets[i + 1], c.widgets[i]] = [c.widgets[i], c.widgets[i + 1]]; this._fire(); this._render(); }, i === c.widgets.length - 1));
        tools.appendChild(this._iconBtn(MDI.del, this._l("delete"), () => { c.widgets.splice(i, 1); this._fire(); this._render(); }));
        sec.s.insertBefore(tools, sec.s.querySelector(".chev"));
        const data = { size: "M", ...w };
        if (w.type === "security") data.sensors = asList(w.sensors).map((x) => entOf(x).entity).filter(Boolean);
        if (w.type === "weather") data.source = w.source || "entity";
        sec.body.appendChild(this._form(this._widgetSchema(w.type, w), data, (v) => {
          const typeChanged = v.type !== w.type;
          const sourceChanged = w.type === "weather" && (v.source || "entity") !== (w.source || "entity");
          const next = { ...w, ...v };
          if (next.source === "entity") delete next.source;
          if (typeChanged) {
            const keep = { type: v.type, size: v.size, title: v.title };
            if (w.id) keep.id = w.id;
            c.widgets[i] = keep;
            this._open.add(`w${i}:${v.type}`);
          } else c.widgets[i] = next;
          this._fire();
          const label = sec.s.querySelector(".st");
          if (label) label.textContent = `${this._typeName(c.widgets[i].type)}${c.widgets[i].title ? " · " + c.widgets[i].title : ""}`;
          const badge = sec.s.querySelector(".badge");
          if (badge) badge.textContent = c.widgets[i].size || "M";
          if (typeChanged || sourceChanged) this._render();
        }));
        if (w.type === "lights") { const box = document.createElement("div"); box.className = "sub"; this._list(box, w, "entities", "lights", "no_lights", "add_light"); sec.body.appendChild(box); }
        if (w.type === "scenes") { const box = document.createElement("div"); box.className = "sub"; this._list(box, w, "entities", "scenes", "no_scenes", "add_scene"); sec.body.appendChild(box); }
        wl.body.appendChild(sec.d);
      });
      const addRow = document.createElement("div");
      addRow.className = "addrow";
      const sel = document.createElement("select");
      sel.setAttribute("aria-label", this._l("type"));
      sel.innerHTML = WIDGET_TYPES.map((t) => `<option value="${t}">${esc(this._typeName(t))}</option>`).join("");
      addRow.appendChild(sel);
      addRow.appendChild(this._addBtn(this._l("add_widget"), () => {
        const t = sel.value;
        c.widgets.push({ type: t, size: t === "energy" || t === "lights" ? "L" : ["fan", "floor", "security", "weather"].includes(t) ? "S" : "M" });
        this._open.add("widgets");
        this._open.add(`w${c.widgets.length - 1}:${t}`);
        this._fire();
        this._render();
      }));
      wl.body.appendChild(addRow);
      root.appendChild(wl.d);
    }
  }

  const ED_CSS = `
    :host{display:block}
    .ed{display:flex;flex-direction:column;gap:12px}
    .sec{border:1px solid var(--divider-color,rgba(127,127,127,.25));border-radius:12px;background:var(--card-background-color,transparent)}
    .sec>summary{list-style:none;display:flex;align-items:center;gap:8px;min-height:48px;padding:0 8px 0 16px;cursor:pointer;font-weight:500;color:var(--primary-text-color)}
    .sec>summary::-webkit-details-marker{display:none}
    .sec .st{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    .badge{font-size:12px;padding:2px 8px;border-radius:99px;background:var(--secondary-background-color,rgba(127,127,127,.15));color:var(--secondary-text-color)}
    .chev{color:var(--secondary-text-color);transition:transform .2s;flex:none}
    .sec[open]>summary .chev{transform:rotate(180deg)}
    .body{display:flex;flex-direction:column;gap:12px;padding:4px 16px 16px}
    .wd{border-radius:10px}
    .tools{display:flex;gap:2px;flex:none}
    .ib{width:40px;height:40px;border:0;border-radius:50%;background:none;color:var(--secondary-text-color);cursor:pointer;display:flex;align-items:center;justify-content:center}
    .ib:hover:not(:disabled){background:var(--secondary-background-color,rgba(127,127,127,.15));color:var(--primary-text-color)}
    .ib:disabled{opacity:.35;cursor:default}
    .row{display:flex;align-items:flex-start;gap:4px;padding:8px 0;border-bottom:1px solid var(--divider-color,rgba(127,127,127,.2))}
    .row>ha-form{flex:1;min-width:0}
    .sub{display:flex;flex-direction:column;gap:4px;padding-top:4px}
    .add{align-self:flex-start;display:inline-flex;align-items:center;gap:6px;min-height:40px;padding:0 16px;border-radius:20px;border:1px solid var(--primary-color);background:none;color:var(--primary-color);font:inherit;font-weight:500;cursor:pointer}
    .add:hover{background:color-mix(in srgb,var(--primary-color) 10%,transparent)}
    .addrow{display:flex;flex-wrap:wrap;align-items:center;gap:10px;padding-top:4px}
    .addrow select{min-height:40px;padding:0 12px;border-radius:8px;border:1px solid var(--divider-color,rgba(127,127,127,.4));background:var(--card-background-color,transparent);color:var(--primary-text-color);font:inherit}
    .empty,.note{font-size:14px;color:var(--secondary-text-color)}
    .note{font-size:13px;line-height:1.4}
  `;

  if (!customElements.get("aurora-glass-card-editor")) customElements.define("aurora-glass-card-editor", AuroraGlassCardEditor);

  /* Card-picker stub: builds a starting config from what the user's HA actually has. */
  function stubFromHass(hass) {
    const st = hass?.states || {};
    const ids = Object.keys(st);
    const of = (dom) => ids.filter((id) => id.startsWith(dom + "."));
    const nm = (id) => `${id} ${st[id].attributes.friendly_name || ""}`.toLowerCase();
    const power = ids.filter((id) => id.startsWith("sensor.") && (st[id].attributes.device_class === "power" || /^(k?w)$/i.test(st[id].attributes.unit_of_measurement || "")));
    const pick = (list, re) => list.find((id) => re.test(nm(id)));
    const widgets = [];
    const solar = pick(power, /pv|solar|fotovolt/);
    if (solar) {
      const e = { type: "energy", size: "L", solar_power: solar };
      const bat = pick(power, /batt/); if (bat) e.battery_power = bat;
      const grid = pick(power, /grid|meter|active_power|retea/); if (grid) e.grid_power = grid;
      const home = pick(power, /load|house|home|consum/); if (home) e.home_power = home;
      const soc = ids.find((id) => id.startsWith("sensor.") && st[id].attributes.device_class === "battery" && /batt|soc|charge/.test(nm(id)));
      if (soc) e.battery_soc = soc;
      const sensors = ids.filter((id) => id.startsWith("sensor."));
      const ist = sensors.find((id) => /work.?mode|inverter.*(status|state)|(status|state).*inverter/.test(nm(id)));
      if (ist) e.inverter_status = ist;
      const itemp = sensors.find((id) => st[id].attributes.device_class === "temperature" && /inverter|radiator|module|goodwe/.test(nm(id)));
      if (itemp) e.inverter_temperature = itemp;
      widgets.push(e);
    }
    const lights = of("light").filter((id) => !st[id].attributes.entity_id).slice(0, 6);
    if (lights.length) widgets.push({ type: "lights", size: "L", entities: lights });
    const clim = of("climate");
    if (clim[0]) widgets.push({ type: "climate", entity: clim[0] });
    const scenes = of("scene").slice(0, 4);
    if (scenes.length) widgets.push({ type: "scenes", entities: scenes });
    const media = of("media_player");
    if (media.length) widgets.push({ type: "media", entity: media.find((id) => st[id].state === "playing") || media[0] });
    const fans = of("fan");
    if (fans[0]) widgets.push({ type: "fan", size: "S", entity: fans[0] });
    const lock = of("lock")[0];
    const opens = of("binary_sensor").filter((id) => ["door", "window", "opening", "garage_door"].includes(st[id].attributes.device_class)).slice(0, 6);
    if (lock || opens.length) { const s = { type: "security", size: "S" }; if (lock) s.lock = lock; if (opens.length) s.sensors = opens; widgets.push(s); }
    const wx = of("weather")[0];
    widgets.push(wx ? { type: "weather", size: "S", entity: wx } : { type: "weather", size: "S", source: "open_meteo" });
    return { widgets };
  }

  /* ================================================================ widget cards */
  // Each widget as its own card (custom:aurora-glass-energy, custom:aurora-glass-lights, …) plus the header,
  // so a dashboard can place and size them one by one. The widget is rendered by an inner aurora-glass-card
  // with the header and background off, so the look, animations and pop-ups are the same as on the board.
  const WIDGET_CARDS = {
    energy: { size: "L", desc: "Solar, battery, grid and home power flow" },
    lights: { size: "L", desc: "Lights and switches with toggles" },
    climate: { size: "M", desc: "A thermostat with mode buttons" },
    scenes: { size: "M", desc: "Scenes and scripts as tap-to-run rows" },
    media: { size: "M", desc: "A media player with artwork and controls" },
    fan: { size: "S", desc: "A fan with an animated icon" },
    floor: { size: "S", desc: "A heated floor with its temperature" },
    security: { size: "S", desc: "A lock and door and window sensors" },
    weather: { size: "S", desc: "Current weather and forecast" },
    header: { size: "XL", desc: "Greeting, date, chips and header buttons" }
  };
  const WIDGET_COLUMNS = { S: 6, M: 12, L: 12, XL: "full" };
  const WIDGET_ROWS = { S: 3, M: 5, L: 6, XL: 2 };
  // Settings of the whole board that a single widget card also has
  const WIDGET_APPEARANCE = ["preset", "accent", "blur", "motion", "popup", "dashboard_theme", "language"];

  class AuroraGlassWidgetCard extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.shadowRoot.innerHTML = `<style>:host{display:block;height:100%}</style>`;
      this._card = document.createElement("aurora-glass-card");
      this.shadowRoot.appendChild(this._card);
    }

    static getConfigElement() { return document.createElement("aurora-glass-widget-editor"); }
    static getStubConfig(hass) {
      if (this.kind === "header") {
        const st = hass?.states || {};
        const temp = Object.keys(st).find((id) => id.startsWith("sensor.") && st[id].attributes.device_class === "temperature");
        return { chips: temp ? [{ entity: temp, color: "cool" }] : [] };
      }
      const { type, size, ...w } = stubFromHass(hass).widgets.find((x) => x.type === this.kind) || {};
      return w;
    }

    get _size() { return this._config?.size || WIDGET_CARDS[this.constructor.kind].size; }

    setConfig(config) {
      if (!config) throw new Error("Invalid configuration");
      const kind = this.constructor.kind;
      const { type, ...rest } = config;
      const inner = { single: true, background: false, customize: false, id: `widget-${kind}` };
      WIDGET_APPEARANCE.forEach((k) => { if (k in rest) inner[k] = rest[k]; });
      if (kind === "header") {
        Object.assign(inner, { header: true, title: rest.title, chips: rest.chips, header_buttons: rest.header_buttons, widgets: [] });
      } else {
        const w = { type: kind, size: this._size };
        Object.keys(rest).forEach((k) => { if (!WIDGET_APPEARANCE.includes(k)) w[k] = rest[k]; });
        Object.assign(inner, { header: false, widgets: [w] });
      }
      this._config = config;
      this._card.setConfig(inner);
    }

    set hass(h) { this._card.hass = h; }
    set preview(v) { this._card.preview = v; }
    set editMode(v) { this._card.editMode = v; }
    getCardSize() { return WIDGET_ROWS[this._size] || 4; }
    getGridOptions() { return { columns: WIDGET_COLUMNS[this._size] || 12, min_columns: this._size === "S" ? 3 : 6 }; }
  }

  // The board editor's forms, for one widget: no widget list and no type switch.
  class AuroraGlassWidgetEditor extends AuroraGlassCardEditor {
    constructor() { super(); this._open = new Set(); }
    get _kind() { return String(this._config?.type || "").replace("custom:aurora-glass-", ""); }

    setConfig(config) {
      const incoming = JSON.stringify(config || {});
      if (this._config && incoming === this._lastFired) return;
      this._config = JSON.parse(incoming);
      this._render();
    }

    _render() {
      if (!this._config || !this.shadowRoot) return;
      const sr = this.shadowRoot;
      this._forms = [];
      sr.innerHTML = `<style>${ED_CSS}</style><div class="ed"></div>`;
      const root = sr.querySelector(".ed");
      if (!this._ready || !customElements.get("ha-form") || !this._hass) {
        root.innerHTML = `<div class="empty">${esc(this._l("loading"))}</div>`;
        return;
      }
      const kind = this._kind;
      const c = this._config;
      const defSize = WIDGET_CARDS[kind]?.size || "M";

      if (kind === "header") {
        root.appendChild(this._form([{ name: "title", selector: { text: {} } }], { title: c.title || "" }, (v) => { c.title = v.title; this._fire(); }, { title: "top_title" }));
        const ch = this._section("chips", this._l("chips"), String(asList(c.chips).length));
        this._list(ch.body, c, "chips", "chips", "no_chips", "add_chip");
        root.appendChild(ch.d);
        const hb = this._section("buttons", this._l("header_buttons"), String(asList(c.header_buttons).length));
        this._list(hb.body, c, "header_buttons", "buttons", "no_buttons", "add_button");
        root.appendChild(hb.d);
      } else {
        const [head, ...fields] = this._widgetSchema(kind, c);
        const schema = [{ ...head, schema: head.schema.filter((s) => s.name !== "type") }, ...fields];
        const data = { size: defSize, ...c };
        if (kind === "security") data.sensors = asList(c.sensors).map((x) => entOf(x).entity).filter(Boolean);
        if (kind === "weather") data.source = c.source || "entity";
        root.appendChild(this._form(schema, data, (v) => {
          const sourceChanged = kind === "weather" && (v.source || "entity") !== (c.source || "entity");
          Object.assign(c, v);
          if (c.source === "entity") delete c.source;
          if (c.size === defSize) delete c.size;
          this._fire();
          if (sourceChanged) this._render();
        }));
        if (kind === "lights" || kind === "scenes") {
          const box = document.createElement("div");
          box.className = "sub";
          this._list(box, c, "entities", kind, `no_${kind}`, kind === "lights" ? "add_light" : "add_scene");
          root.appendChild(box);
        }
      }

      // Appearance: the board's settings that apply to one widget
      const keep = (items) => items
        .map((s) => (s.type === "grid" ? { ...s, schema: keep(s.schema) } : s))
        .filter((s) => (s.type === "grid" ? s.schema.length : WIDGET_APPEARANCE.includes(s.name)));
      const ap = this._section("appearance", this._l("appearance"));
      const top = {};
      WIDGET_APPEARANCE.forEach((k) => { top[k] = c[k] ?? TOP_DEFAULTS[k]; });
      ap.body.appendChild(this._form(keep(this._topSchema()), top, (v) => {
        WIDGET_APPEARANCE.forEach((k) => { if (v[k] === TOP_DEFAULTS[k]) delete c[k]; else c[k] = v[k]; });
        if (c.language === "auto") delete c.language;
        this._fire();
      }));
      root.appendChild(ap.d);
    }
  }
  if (!customElements.get("aurora-glass-widget-editor")) customElements.define("aurora-glass-widget-editor", AuroraGlassWidgetEditor);

  /* ================================================================ entity card */
  const ENT_CSS = `
  :host{display:block;height:100%}
  .ec{position:relative;width:100%;height:100%;min-height:var(--minh,120px);display:flex;flex-direction:column;justify-content:space-between;gap:12px;padding:16px;border-radius:var(--ha-card-border-radius,24px);
    color:var(--text);font-family:'Figtree',var(--ha-font-family-body,system-ui),-apple-system,sans-serif;text-align:left;overflow:hidden;isolation:isolate;
    transition:background .5s,border-color .5s,box-shadow .5s,transform .18s cubic-bezier(.3,1.5,.6,1)}
  .ec.glass{background:var(--glass);backdrop-filter:blur(var(--blur)) saturate(170%);-webkit-backdrop-filter:blur(var(--blur)) saturate(170%);border:1px solid var(--border);box-shadow:inset 0 1px 0 var(--hi),0 24px 50px -30px var(--shadow)}
  .ec.flat{background:transparent;border:1px solid transparent}
  .ec:active{transform:scale(.97)}
  .ec.on{background:color-mix(in srgb,var(--ai) var(--acc-t),var(--glass));border-color:color-mix(in srgb,var(--ai) 45%,transparent);box-shadow:inset 0 1px 0 var(--hi),0 16px 44px -18px color-mix(in srgb,var(--ai) 60%,transparent)}
  .ec::after{content:"";position:absolute;inset:-40%;z-index:-1;background:radial-gradient(circle at 20% 15%,color-mix(in srgb,var(--ai) 30%,transparent),transparent 45%);opacity:0;transition:opacity .8s}
  .ec.on::after{opacity:1;animation:agBreath 7s ease-in-out infinite}
  .ec.pulse{animation:agPop .55s cubic-bezier(.3,1.6,.5,1)}
  .eh{display:flex;align-items:flex-start;justify-content:space-between;gap:10px}
  .eic{width:46px;height:46px;flex:none;border-radius:16px;display:flex;align-items:center;justify-content:center;background:color-mix(in srgb,var(--ai) 16%,transparent);transition:background .5s}
  .ec.on .eic{background:color-mix(in srgb,var(--ai) 26%,transparent)}
  .eval{font-size:13px;color:var(--muted);font-variant-numeric:tabular-nums;white-space:nowrap}
  .en{display:flex;flex-direction:column;gap:2px;min-width:0}
  .en b{font-size:15px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .en span{font-size:13px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .ebig{font-family:'Bricolage Grotesque','Figtree',system-ui,sans-serif;font-weight:600;font-size:26px;letter-spacing:-.03em;color:var(--text)}
  .bar{height:4px;border-radius:99px;overflow:hidden;background:var(--track)}
  .bar i{display:block;height:100%;border-radius:99px;background:var(--ai);transition:width .5s}
  .ec.row{flex-direction:row;align-items:center;min-height:var(--minh,64px);padding:10px 12px 10px 10px;gap:12px}
  .ec.row .en{flex:1}
  .tg{flex:none;width:50px;height:30px;border-radius:99px;padding:3px;display:flex;justify-content:flex-start;background:var(--track);transition:background .25s;border:0;cursor:pointer}
  .tg.on{justify-content:flex-end;background:var(--ai)}
  .tg i{width:24px;height:24px;border-radius:99px;background:#fff;box-shadow:0 1px 4px rgba(0,0,0,.35)}
  .tg.on i{background:#141622}
  .ripple{position:absolute;border-radius:50%;pointer-events:none;background:color-mix(in srgb,var(--ai) 45%,transparent);transform:scale(0);animation:agRipple .6s ease-out forwards;z-index:-1}
  @keyframes agPop{0%{transform:scale(1)}40%{transform:scale(1.035)}100%{transform:scale(1)}}
  @keyframes agRipple{to{transform:scale(1);opacity:0}}
  @keyframes agBreath{0%,100%{transform:scale(1);opacity:.75}50%{transform:scale(1.12);opacity:1}}
  `;

  class AuroraGlassEntityCard extends HTMLElement {
    constructor() { super(); this.attachShadow({ mode: "open" }); }
    static getConfigElement() { return document.createElement("aurora-glass-entity-editor"); }
    static getStubConfig(hass) {
      const ids = Object.keys(hass?.states || {});
      const pref = ["light.", "switch.", "fan.", "climate.", "cover.", "lock.", "media_player.", "input_boolean.", "sensor."];
      for (const p of pref) { const f = ids.find((id) => id.startsWith(p)); if (f) return { entity: f }; }
      return { entity: ids[0] || "sun.sun" };
    }
    setConfig(c) {
      if (!c || !c.entity) throw new Error("aurora-glass-entity: choose an entity");
      this._config = { layout: "tile", tap_action: "auto", hold_action: "popup", glass: true, show_state: true, ...c };
      this._schedule();
    }
    set hass(h) { this._hass = h; AuroraGlassPopup.sync(this, h); this._schedule(); }
    get hass() { return this._hass; }
    getCardSize() { return this._config?.layout === "row" ? 1 : 2; }
    getGridOptions() { return this._config?.layout === "row" ? { columns: 6, rows: 1, min_columns: 3, min_rows: 1 } : { columns: 3, rows: 2, min_columns: 2, min_rows: 2 }; }
    connectedCallback() { loadFonts(); this._schedule(); }

    get _lang() { return trLang(this._hass, this._config?.language); }
    _theme() { return resolveTheme(this._config.preset, this._config.accent, this._hass); }
    _schedule() { if (this._raf) return; this._raf = requestAnimationFrame(() => { this._raf = 0; this._render(); }); }

    _render() {
      if (!this._config || !this.shadowRoot) return;
      const sr = this.shadowRoot;
      if (!this._root) {
        sr.innerHTML = `<style>${CSS}${ANIM_CSS}${ENT_CSS}</style><div class="host"></div>`;
        this._root = sr.querySelector(".host");
        sr.addEventListener("click", (e) => this._onClick(e));
        sr.addEventListener("contextmenu", (e) => { e.preventDefault(); this._hold(); });
        sr.addEventListener("pointerdown", (e) => this._onDown(e));
        ["pointerup", "pointercancel", "pointerleave"].forEach((t) => sr.addEventListener(t, () => clearTimeout(this._lp)));
      }
      const c = this._config, id = c.entity, st = this._hass?.states?.[id];
      const th = this._theme();
      const lang = this._lang;
      const d = domainOf(id);
      const on = isOn(st);
      if (st && this._lastState !== undefined && this._lastState !== st.state && c.motion !== false) {
        this._pulse = true;
        clearTimeout(this._pulseT);
        this._pulseT = setTimeout(() => { this._pulse = false; this._schedule(); }, 600);
      }
      this._lastState = st?.state;
      const name = c.name || st?.attributes?.friendly_name || id;
      let html;
      if (!st) html = `<div class="ec glass"><div class="err" style="color:var(--alert);font-size:13px">${esc(tr(lang, "not_found", { e: id }))}</div></div>`;
      else {
        const stTxt = stateText(this._hass, st, lang);
        const a = st.attributes;
        const area = c.subtitle ?? areaOf(this._hass, id);
        const numeric = d === "sensor" && isFinite(parseFloat(st.state));
        const bri = d === "light" && on && a.brightness != null ? Math.round(a.brightness / 2.55) : null;
        const pct = bri ?? (d === "fan" && on && a.percentage != null ? a.percentage : d === "cover" && a.current_position != null ? a.current_position : null);
        const canToggle = TOGGLE_DOMAINS.includes(d) && !["climate", "media_player", "vacuum", "cover"].includes(d);
        const cls = `ec ${c.glass === false ? "flat" : "glass"} ${c.layout === "row" ? "row" : ""} ${on ? "on" : ""} ${this._pulse ? "pulse" : ""}`;
        const icon = `<div class="eic">${animIcon(st, c.layout === "row" ? 24 : 26, 1.8, c.icon)}</div>`;
        if (c.layout === "row") {
          html = `<div class="${cls}" data-k="ec" role="button" tabindex="0" aria-label="${esc(name)}">${icon}
            <div class="en"><b>${esc(name)}</b>${c.show_state !== false ? `<span>${esc([stTxt, area].filter(Boolean).join(" · "))}</span>` : ""}</div>
            ${canToggle ? `<button class="tg ${st.state === "on" ? "on" : ""}" data-act="toggle" role="switch" aria-checked="${st.state === "on"}" aria-label="${esc(name)}"><i></i></button>` : numeric ? `<span class="ebig" style="font-size:20px">${esc(stTxt)}</span>` : ""}</div>`;
        } else {
          html = `<div class="${cls}" data-k="ec" role="button" tabindex="0" aria-label="${esc(name)}">
            <div class="eh">${icon}${c.show_state !== false && !numeric ? `<span class="eval">${esc(pct != null ? pct + "%" : stTxt)}</span>` : ""}</div>
            <div class="en">${numeric && c.show_state !== false ? `<span class="ebig">${esc(stTxt)}</span>` : ""}<b>${esc(name)}</b>${area ? `<span>${esc(area)}</span>` : ""}</div>
            ${pct != null ? `<div class="bar"><i style="width:${pct}%"></i></div>` : ""}</div>`;
        }
      }
      const tpl = document.createElement("template");
      tpl.innerHTML = `<div>${html}</div>`;
      const next = tpl.content.firstElementChild;
      next.className = `host ${c.motion === false ? "still" : ""}`;
      next.setAttribute("style", `${themeVars(th, c.blur ?? 24)};--ai:${aiColor(st)};height:100%;${c.min_height ? `--minh:${esc(c.min_height)}` : ""}`);
      morph(this._root, next, sr.activeElement);
    }

    _act(kind) {
      const c = this._config, st = this._hass?.states?.[c.entity];
      const d = domainOf(c.entity);
      let a = kind === "tap" ? c.tap_action : c.hold_action;
      if (a === "auto") a = RUN_DOMAINS.includes(d) ? "run" : TOGGLE_DOMAINS.includes(d) && !["climate", "media_player", "vacuum"].includes(d) ? "toggle" : "popup";
      if (a === "toggle") return toggleCall(this._hass, st);
      if (a === "run") return runCall(this._hass, st);
      if (a === "popup" || a === "native" || a === "more-info") {
        const el = this.shadowRoot.querySelector(".ec");
        return openEntityPopup(this, c.entity, { origin: el?.getBoundingClientRect(), name: c.name, icon: c.icon, mode: a === "popup" ? "aurora" : "native", theme: this._theme(), blur: c.blur ?? 24, motion: c.motion !== false, lang: this._lang });
      }
    }
    _hold() { this._act("hold"); }
    _ripple(e) {
      const card = this.shadowRoot.querySelector(".ec");
      if (!card || this._config.motion === false) return;
      const r = card.getBoundingClientRect(), size = Math.max(r.width, r.height) * 1.4;
      const sp = document.createElement("span");
      sp.className = "ripple";
      sp.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - r.left - size / 2}px;top:${e.clientY - r.top - size / 2}px`;
      card.appendChild(sp);
      setTimeout(() => sp.remove(), 650);
    }
    _onDown(e) {
      clearTimeout(this._lp);
      if (!e.target.closest?.(".ec")) return;
      this._lp = setTimeout(() => { this._suppress = true; this._hold(); }, 520);
    }
    _onClick(e) {
      if (this._suppress) { this._suppress = false; return; }
      if (!e.target.closest?.(".ec")) return;
      this._ripple(e);
      if (e.target.closest("[data-act='toggle']")) return toggleCall(this._hass, this._hass?.states?.[this._config.entity]);
      this._act("tap");
    }
  }

  class AuroraGlassEntityEditor extends HTMLElement {
    constructor() { super(); this.attachShadow({ mode: "open" }); }
    setConfig(c) {
      const incoming = JSON.stringify(c || {});
      if (this._config && incoming === this._lastFired) return;
      this._config = JSON.parse(incoming);
      this._render();
    }
    set hass(h) { const first = !this._hass; this._hass = h; if (this._form) this._form.hass = h; if (first) this._render(); }
    connectedCallback() { ensureHaComponents().then(() => { this._ready = true; this._render(); }); }
    get _lang() { const l = (this._hass?.locale?.language || "en").split("-")[0]; return ED_LABELS[l] ? l : "en"; }
    _l(k) { return ED_LABELS[this._lang][k] ?? ED_LABELS.en[k] ?? I18N[this._lang]?.[k] ?? I18N.en[k] ?? k; }
    _render() {
      if (!this._config || !this.shadowRoot) return;
      if (!this._ready || !customElements.get("ha-form") || !this._hass) { this.shadowRoot.innerHTML = `<div style="color:var(--secondary-text-color)">${esc(this._l("loading"))}</div>`; return; }
      const presetLabels = { auto: this._l("auto") }; Object.keys(PRESETS).forEach((k) => { presetLabels[k] = PRESETS[k].name; });
      const accentLabels = {}; Object.keys(ACCENTS).forEach((k) => { accentLabels[k] = ACCENTS[k].name; });
      const acts = (list) => opt(list, { auto: this._l("act_auto"), toggle: this._l("act_toggle"), popup: this._l("act_popup"), native: this._l("act_native"), none: this._l("act_none") });
      const schema = [
        { name: "entity", required: true, selector: { entity: {} } },
        { type: "grid", name: "", schema: [{ name: "name", selector: { text: {} } }, { name: "icon", selector: { icon: {} } }] },
        { type: "grid", name: "", schema: [
          { name: "layout", selector: { select: { mode: "dropdown", options: opt(["tile", "row"], { tile: this._l("layout_tile"), row: this._l("layout_row") }) } } },
          { name: "subtitle", selector: { text: {} } }] },
        { type: "grid", name: "", schema: [
          { name: "tap_action", selector: { select: { mode: "dropdown", options: acts(["auto", "toggle", "popup", "native", "none"]) } } },
          { name: "hold_action", selector: { select: { mode: "dropdown", options: acts(["popup", "native", "none"]) } } }] },
        { type: "grid", name: "", schema: [
          { name: "preset", selector: { select: { mode: "dropdown", options: opt(["auto", ...Object.keys(PRESETS)], presetLabels) } } },
          { name: "accent", selector: { select: { mode: "dropdown", options: opt(Object.keys(ACCENTS), accentLabels) } } }] },
        { type: "grid", name: "", schema: [{ name: "show_state", selector: { boolean: {} } }, { name: "glass", selector: { boolean: {} } }, { name: "motion", selector: { boolean: {} } }] }
      ];
      const DEF = { layout: "tile", tap_action: "auto", hold_action: "popup", preset: "auto", accent: "peach", show_state: true, glass: true, motion: true };
      const data = { ...DEF, ...this._config };
      this.shadowRoot.innerHTML = "";
      const f = document.createElement("ha-form");
      f.hass = this._hass;
      f.schema = schema;
      f.data = data;
      f.computeLabel = (s) => this._l(s.name);
      f.addEventListener("value-changed", (ev) => {
        ev.stopPropagation();
        const v = { ...ev.detail.value };
        f.data = v;
        const cfg = { type: this._config.type || "custom:aurora-glass-entity" };
        Object.keys(v).forEach((k) => { if (v[k] === "" || v[k] == null || DEF[k] === v[k]) return; cfg[k] = v[k]; });
        this._config = { ...cfg };
        this._lastFired = JSON.stringify(cfg);
        this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: cfg }, bubbles: true, composed: true }));
      });
      this._form = f;
      this.shadowRoot.appendChild(f);
    }
  }
  if (!customElements.get("aurora-glass-entity-editor")) customElements.define("aurora-glass-entity-editor", AuroraGlassEntityEditor);
  if (!customElements.get("aurora-glass-entity")) customElements.define("aurora-glass-entity", AuroraGlassEntityCard);

  if (!customElements.get("aurora-glass-card")) customElements.define("aurora-glass-card", AuroraGlassCard);
  window.customCards = window.customCards || [];
  if (!window.customCards.some((c) => c.type === "aurora-glass-card")) {
    window.customCards.push({ type: "aurora-glass-card", name: "Aurora Glass", description: "Frosted-glass, customizable dashboard with state animations", preview: true, documentationURL: "https://github.com/comixdx/ha-aurora-glass" });
  }
  if (!window.customCards.some((c) => c.type === "aurora-glass-entity")) {
    window.customCards.push({ type: "aurora-glass-entity", name: "Aurora Glass Entity", description: "One entity as an animated glass tile, with the Aurora Glass pop-up", preview: true, documentationURL: "https://github.com/comixdx/ha-aurora-glass" });
  }
  Object.keys(WIDGET_CARDS).forEach((kind) => {
    const tag = `aurora-glass-${kind}`;
    if (!customElements.get(tag)) customElements.define(tag, class extends AuroraGlassWidgetCard { static get kind() { return kind; } });
    if (window.customCards.some((c) => c.type === tag)) return;
    const name = kind === "header" ? "Header" : I18N.en[kind] || pretty(kind);
    window.customCards.push({ type: tag, name: `Aurora Glass ${name}`, description: WIDGET_CARDS[kind].desc, preview: true, documentationURL: "https://github.com/comixdx/ha-aurora-glass" });
  });
  console.info(`%c AURORA-GLASS-CARD %c v${VERSION} `, "background:#ffb27a;color:#1c140c;font-weight:700", "background:#080c18;color:#f2f4fb");
})();
