/*!
 * Aurora Glass Card for Home Assistant — v0.4.1
 * A frosted-glass, customizable dashboard card with state-driven animations.
 * Widgets: energy flow, lights, climate, scenes, media, fan, floor heating, security, weather.
 * Visual editor: Edit dashboard → Add card → Aurora Glass (no YAML needed).
 * No build step, no dependencies. Add as a dashboard resource (type: JavaScript module).
 * Companion theme: themes/aurora_glass.yaml
 */
(() => {
  const VERSION = "0.4.1";

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
      target: "target", cooling: "Cooling", heating: "Heating", idle: "Idle", tap_to_run: "Tap to run", active: "Active: {n}",
      nothing_playing: "Nothing playing", play: "Play", pause: "Pause", speed: "Speed {n}", tap_speed: "Tap to change speed",
      running: "Running", heating_to: "heating to {t}", locked: "Locked · tap to unlock", unlocked: "Unlocked · tap to lock",
      all_closed: "All closed", n_open: "{n} open", door_unlocked: "Door unlocked", secure: "All secure", not_found: "Entity not found: {e}",
      humidity: "Humidity {h}%", brightness: "Brightness"
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
      target: "țintă", cooling: "Răcire", heating: "Încălzire", idle: "Inactiv", tap_to_run: "Atinge pentru a rula", active: "Activă: {n}",
      nothing_playing: "Nu se redă nimic", play: "Redă", pause: "Pauză", speed: "Viteza {n}", tap_speed: "Atinge pentru a schimba viteza",
      running: "Pornit", heating_to: "încălzește la {t}", locked: "Încuiat · atinge pentru a descuia", unlocked: "Descuiat · atinge pentru a încuia",
      all_closed: "Toate închise", n_open: "{n} deschise", door_unlocked: "Ușa descuiată", secure: "Totul în siguranță", not_found: "Entitate negăsită: {e}",
      humidity: "Umiditate {h}%", brightness: "Luminozitate"
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
    sliders: "M4 6h9M17 6h3M4 12h3M11 12h9M4 18h11M19 18h1M15 4v4M9 10v4M17 16v4"
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
  .flowbox{position:relative;height:380px}
  .flowbox svg.lines{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
  .trk{fill:none;stroke:var(--track);stroke-width:2}
  .flow{fill:none;stroke-width:6;stroke-linecap:round;stroke-dasharray:.1 14;transition:opacity .5s;animation:agDash var(--d,1.2s) linear infinite}
  .node{position:absolute;transform:translate(-50%,-36px);display:flex;flex-direction:column;align-items:center;gap:10px;z-index:1}
  .bub{width:72px;height:72px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:var(--c);background:var(--fill,linear-gradient(var(--glass2),var(--glass2))),var(--ground);backdrop-filter:blur(var(--blur));-webkit-backdrop-filter:blur(var(--blur));border:1.5px solid color-mix(in srgb,var(--c) 55%,transparent);box-shadow:0 0 0 7px color-mix(in srgb,var(--c) 7%,transparent);transition:box-shadow .6s}
  .bub.big{width:84px;height:84px}
  .bub.act{box-shadow:0 0 0 7px color-mix(in srgb,var(--c) 7%,transparent),0 0 34px color-mix(in srgb,var(--c) 40%,transparent)}
  .nv{display:flex;flex-direction:column;align-items:center;gap:1px;white-space:nowrap}
  .nv .disp{font-size:20px}.nv .muted{font-size:12px}
  /* lights */
  .tiles{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
  .w.L .tiles,.w.XL .tiles{grid-template-columns:repeat(3,minmax(0,1fr))}
  @container (max-width:719px){.w.L .tiles,.w.XL .tiles{grid-template-columns:repeat(2,minmax(0,1fr))}}
  .tile{display:flex;flex-direction:column;justify-content:space-between;gap:14px;min-height:120px;padding:14px;border-radius:20px;min-width:0;background:var(--off);border:1px solid var(--faint);transition:background .45s,border-color .45s,box-shadow .45s}
  .tile.on{background:color-mix(in srgb,var(--acc) var(--acc-t),transparent);border-color:color-mix(in srgb,var(--acc) 50%,transparent);box-shadow:0 10px 40px -12px color-mix(in srgb,var(--acc) 55%,transparent)}
  .tile.focus{outline:2px solid color-mix(in srgb,var(--acc) 60%,transparent);outline-offset:2px}
  .bulb{width:38px;height:38px;border-radius:99px;display:flex;align-items:center;justify-content:center;background:var(--faint);color:var(--muted);transition:background .45s,box-shadow .6s,color .3s}
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
  @keyframes agDash{to{stroke-dashoffset:-14.1}}
  @keyframes agAir{0%{transform:translateX(-40%);opacity:0}25%{opacity:.95}100%{transform:translateX(260%);opacity:0}}
  @keyframes agRise{0%{transform:translateY(12px) scale(.6);opacity:0}35%{opacity:.85}100%{transform:translateY(-34px) scale(1.25);opacity:0}}
  @keyframes agEq{0%,100%{transform:scaleY(.22)}50%{transform:scaleY(1)}}
  @keyframes agPing{0%{transform:scale(1);opacity:.75}100%{transform:scale(2.6);opacity:0}}
  @keyframes agWave{to{transform:translateX(-50%)}}
  @keyframes agFloat{0%,100%{transform:translateX(0)}50%{transform:translateX(9px)}}
  @keyframes agFall{0%{transform:translateY(-4px);opacity:0}30%{opacity:1}100%{transform:translateY(12px);opacity:0}}
  `;

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
      if (!config || !Array.isArray(config.widgets) || !config.widgets.length) throw new Error("aurora-glass-card: add a `widgets:` list");
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

    set hass(h) { this._hass = h; this._schedule(); }
    get hass() { return this._hass; }
    getCardSize() { return 12; }
    getGridOptions() { return { columns: "full" }; }

    connectedCallback() {
      loadFonts();
      this._clock = setInterval(() => this._schedule(), 30000);
      this._schedule();
    }
    disconnectedCallback() { clearInterval(this._clock); this._clearDashTheme(); }

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

    /* ----- theme */
    _theme() {
      let id = this._p.preset;
      if (id === "auto" || !PRESETS[id]) id = this._hass?.themes?.darkMode === false ? "dawn" : "midnight";
      const T = PRESETS[id];
      const A = ACCENTS[this._p.accent] || ACCENTS.peach;
      const S = T.dark ? SEM_DARK : SEM_LIGHT;
      return { id, T, A, S };
    }
    _vars() {
      const { T, A, S } = this._theme();
      const v = {
        "--ground": T.ground, "--glass": T.glass, "--glass2": T.glass2, "--border": T.border, "--hi": T.hi, "--shadow": T.shadow,
        "--text": T.text, "--muted": T.muted, "--faint": T.faint, "--track": T.track, "--off": T.off, "--orb-op": T.orbOp,
        "--acc": A.c, "--acc-ink": T.dark ? A.c : A.deep, "--acc-a": T.dark ? "14%" : "28%", "--acc-t": T.dark ? "16%" : "32%",
        "--blur": `${this._p.blur}px`, "--cool": S.cool, "--heat": S.heat, "--solar": S.solar, "--battery": S.battery, "--grid": S.grid, "--alert": S.alert
      };
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
    _clearDashTheme() {
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
        sr.innerHTML = `<style>${CSS}</style><div class="root"></div>`;
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
      const cls = ["root", this._config.background ? "bg" : "", this._p.motion ? "" : "still", this._p.editing ? "editing" : "", this._first ? "enter" : ""].filter(Boolean).join(" ");
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
      return `<header><div class="hello"><div class="muted" style="font-size:14px;letter-spacing:.02em">${esc(date)} · ${esc(time)}</div><h1 class="disp">${esc(title)}</h1></div><div class="chips">${chips}${edit}</div></header>`;
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
          <div class="wh"><div class="wt"><div class="ic">${svgIcon(w.icon_path || ICON[w.type] || ICON.energy)}</div><h2>${esc(this._title(w))}</h2></div>${ctl}</div>${body}</section>`;
      }).join("");
    }

    _missing(e) { return { body: `<div class="err">${esc(this._t("not_found", { e }))}</div>`, meta: "" }; }

    /* ======================================================== widgets */
    _w_energy(w) {
      // Five nodes, inverter in the middle: solar, grid and battery connect to it; it feeds the load.
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
      const soc = socS && isFinite(parseFloat(socS.state)) ? Math.round(parseFloat(socS.state)) : null;
      const stS = this._st(w.inverter_status);
      const tS = this._st(w.inverter_temperature);
      const invTemp = tS && isFinite(parseFloat(tS.state)) ? `${this._num(parseFloat(tS.state), 0)}°` : "";
      const invLabel = [stS && !["unknown", "unavailable"].includes(stS.state) ? stS.state : "", invTemp].filter(Boolean).join(" · ") || (w.inverter_name || this._t("inverter"));
      const live = (kw) => kw != null && Math.abs(kw) > 0.03;
      const dur = (kw) => (Math.round(clamp(2.4 - Math.abs(kw) * 0.45, 0.45, 2.4) * 4) / 4).toFixed(2) + "s";
      const flow = (c, kw, reverse) => `stroke:var(--${c});opacity:${live(kw) ? 1 : 0};--d:${dur(kw || 0)};animation-direction:${reverse ? "reverse" : "normal"}`;
      const kwTxt = (v) => `${this._num(Math.abs(v), Math.abs(v) < 10 ? 1 : 0)} kW`;
      const node = (x, y, c, icon, value, label, act, extra = "", big = false, e = "") =>
        `<button class="node" style="left:${x}%;top:${y}%" data-act="more" data-e="${esc(e)}"><div class="bub ${big ? "big" : ""} ${act ? "act" : ""}" style="--c:var(--${c});${extra}">${svgIcon(ICON[icon], big ? 30 : 26)}</div><div class="nv"><span class="disp">${esc(value)}</span><span class="muted">${esc(label)}</span></div></button>`;
      const hasGrid = grid != null, hasBatt = batt != null || soc != null;
      // viewBox 600 × 380. Inverter at (300,170); corners: solar, grid on top, battery, load at the bottom.
      const P = {
        solar: "M110 60 C 200 60, 230 170, 300 170",
        grid: "M490 60 C 400 60, 370 170, 300 170",
        battery: "M110 280 C 200 280, 230 170, 300 170",
        load: "M300 170 C 370 170, 400 280, 490 280"
      };
      const path = (cls, d, style) => `<path class="${cls}" d="${d}" vector-effect="non-scaling-stroke"${style ? ` style="${style}"` : ""}></path>`;
      const lines = `<svg class="lines" viewBox="0 0 600 380" preserveAspectRatio="none" aria-hidden="true">
        ${path("trk", P.solar)}${hasGrid ? path("trk", P.grid) : ""}${hasBatt ? path("trk", P.battery) : ""}${path("trk", P.load)}
        ${path("flow", P.solar, flow("solar", solar, false))}
        ${hasGrid ? path("flow", P.grid, flow("grid", grid, grid < 0)) : ""}
        ${hasBatt ? path("flow", P.battery, flow("battery", batt, (batt || 0) > 0)) : ""}
        ${path("flow", P.load, flow("acc", home, false))}
      </svg>`;
      const fill = soc != null ? `--fill:linear-gradient(to top, color-mix(in srgb, var(--battery) 30%, transparent) ${soc}%, var(--glass2) ${soc}%)` : "";
      const T = 15.79, M = 44.74, B = 73.68;   // 60, 170, 280 of 380
      const nodes = [
        node(18.33, T, "solar", "solar", kwTxt(solar), w.solar_name || this._t("solar"), solar > 0.03, "", false, w.solar_power),
        hasGrid ? node(81.67, T, "grid", "grid", kwTxt(grid), grid < -0.03 ? this._t("exporting") : grid > 0.03 ? this._t("importing") : this._t("grid_idle"), live(grid), "", false, w.grid_power) : "",
        node(50, M, "text", "inverter", kwTxt(inv), invLabel, live(inv), "", true, w.inverter_power || w.inverter_status || ""),
        hasBatt ? node(18.33, B, "battery", "battery", soc != null ? `${soc}%` : kwTxt(batt || 0),
          (batt || 0) > 0.03 ? this._t("charging", { v: kwTxt(batt) }) : (batt || 0) < -0.03 ? this._t("discharging", { v: kwTxt(batt) }) : this._t("battery_idle"),
          live(batt), fill, false, w.battery_soc || w.battery_power) : "",
        node(81.67, B, "acc", "home", kwTxt(home), w.load_name || this._t("load"), live(home), "", false, w.home_power || "")
      ].join("");
      return { body: `<div class="flowbox">${lines}${nodes}</div>`, meta: this._t("live") };
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
          <div style="display:flex;align-items:center;justify-content:space-between;gap:8px"><div class="bulb">${svgIcon(ICON.lights, 18, 1.9)}</div><div class="ts" style="font-variant-numeric:tabular-nums">${esc(pct)}</div></div>
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

    _w_weather(w) {
      const s = this._st(w.entity);
      if (!s) return this._missing(w.entity);
      const a = s.attributes;
      const cond = s.state;
      const sun = ["sunny", "partlycloudy", "windy", "exceptional"].includes(cond);
      const moon = cond === "clear-night";
      const cloud = !["sunny", "clear-night"].includes(cond);
      const rain = ["rainy", "pouring", "lightning-rainy", "snowy-rainy"].includes(cond);
      const snow = ["snowy", "snowy-rainy"].includes(cond);
      const art = `<svg width="96" height="72" viewBox="0 0 120 90" aria-hidden="true" style="flex:none;overflow:visible">
        ${sun ? `<g class="rays"><path d="M46 8v8M46 62v8M15 39h8M69 39h8M24 17l6 6M62 55l6 6M24 61l6-6M62 23l6-6" fill="none" stroke-width="3" stroke-linecap="round" style="stroke:var(--solar)"></path></g><circle cx="46" cy="39" r="15" style="fill:var(--solar);filter:drop-shadow(0 0 10px var(--solar))"></circle>` : ""}
        ${moon ? `<path d="M60 18a24 24 0 1 0 22 32 20 20 0 0 1-22-32z" style="fill:var(--text);opacity:.85"></path>` : ""}
        ${cloud ? `<g class="cloud"><path d="M50 80h46a14 14 0 0 0 0-28 20 20 0 0 0-38-4 16 16 0 0 0-8 32z" style="fill:${this._theme().T.dark ? "rgba(255,255,255,0.82)" : "#fff"};filter:drop-shadow(0 6px 10px rgba(0,0,0,.18))"></path></g>` : ""}
        ${rain || snow ? [62, 76, 90].map((x, k) => `<circle class="drop" cx="${x}" cy="86" r="${snow ? 2.6 : 2}" style="fill:${snow ? "var(--text)" : "var(--cool)"};--dl:${k * -0.35}s"></circle>`).join("") : ""}
      </svg>`;
      const unit = a.temperature_unit || "°";
      const label = this._loc(`component.weather.entity_component._.state.${cond}`, WX_LABEL[cond] || pretty(cond));
      const hum = a.humidity != null ? ` · ${this._t("humidity", { h: Math.round(a.humidity) })}` : "";
      return {
        body: `<button class="wx" data-act="more" data-e="${esc(w.entity)}">${art}<div style="display:flex;flex-direction:column;gap:2px;text-align:left"><span class="disp big">${a.temperature != null ? this._num(a.temperature, 0) + (unit.startsWith("°") ? "°" : unit) : "—"}</span><span class="muted" style="font-size:13px">${esc(label)}${esc(hum)}</span></div></button>`,
        meta: w.subtitle || ""
      };
    }

    /* ======================================================== events */
    _onDown(e) {
      const el = e.target.closest?.("[data-e]");
      clearTimeout(this._lp);
      if (!el || this._p.editing) return;
      this._lp = setTimeout(() => { this._suppress = true; this._moreInfo(el.dataset.e); }, 550);
    }
    _onContext(e) {
      const el = e.target.closest?.("[data-e]");
      if (!el || !el.dataset.e) return;
      e.preventDefault();
      this._moreInfo(el.dataset.e);
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
        case "more": if (ent) this._moreInfo(ent); return;
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
      device_note: "Tip: the Customize button on the dashboard changes the layout only on that device. Settings here apply everywhere."
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
      device_note: "Sfat: butonul Personalizează de pe tablou schimbă aranjarea doar pe acel dispozitiv. Setările de aici se aplică peste tot."
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
  const TOP_DEFAULTS = { preset: "auto", accent: "peach", blur: 24, motion: true, background: true, header: true, customize: true, dashboard_theme: true, language: "auto" };

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
        { type: "grid", name: "", schema: [
          { name: "title", selector: { text: {} } },
          { name: "language", selector: { select: { mode: "dropdown", options: opt(["auto", "en", "ro"], { auto: this._l("auto"), en: "English", ro: "Română" }) } } }
        ] },
        { name: "min_height", selector: { text: {} } }
      ];
    }
    _widgetSchema(type) {
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
        case "weather": return [sizes, title, { name: "entity", selector: { entity: { domain: "weather" } } }, subtitle];
        default: return [sizes, title];
      }
    }
    _rowSchema(kind) {
      if (kind === "lights") return [{ type: "grid", name: "", schema: [{ name: "entity", selector: { entity: { domain: ["light", "switch", "input_boolean"] } } }, { name: "name", selector: { text: {} } }, { name: "subtitle", selector: { text: {} } }] }];
      if (kind === "scenes") return [{ type: "grid", name: "", schema: [{ name: "entity", selector: { entity: { domain: ["scene", "script", "button", "input_button"] } } }, { name: "name", selector: { text: {} } }] }, { name: "description", selector: { text: {} } }];
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
        sec.body.appendChild(this._form(this._widgetSchema(w.type), data, (v) => {
          const typeChanged = v.type !== w.type;
          const next = { ...w, ...v };
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
          if (typeChanged) this._render();
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
    if (wx) widgets.push({ type: "weather", size: "S", entity: wx });
    if (!widgets.length) widgets.push({ type: "weather", size: "S", entity: "weather.home" });
    return { widgets };
  }

  if (!customElements.get("aurora-glass-card")) customElements.define("aurora-glass-card", AuroraGlassCard);
  window.customCards = window.customCards || [];
  if (!window.customCards.some((c) => c.type === "aurora-glass-card")) {
    window.customCards.push({ type: "aurora-glass-card", name: "Aurora Glass", description: "Frosted-glass, customizable dashboard with state animations", preview: true, documentationURL: "https://github.com/comixdx/ha-aurora-glass" });
  }
  console.info(`%c AURORA-GLASS-CARD %c v${VERSION} `, "background:#ffb27a;color:#1c140c;font-weight:700", "background:#080c18;color:#f2f4fb");
})();
