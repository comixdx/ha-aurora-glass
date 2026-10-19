/*!
 * HA Top Sidebar: shows Home Assistant's own sidebar as a bar across the top of the screen,
 * as a frosted glass pill in the colours of the active theme (made for the Aurora Glass themes).
 * Install: copy this file to /config/www/ and load it on every page from configuration.yaml:
 *   frontend:
 *     extra_module_url:
 *       - /local/ha-top-sidebar.js?v=1
 * then restart Home Assistant. Raise ?v= after replacing the file, since browsers cache /local/ files.
 * Phones and the companion app get the same top bar instead of the slide-out drawer.
 * HA kiosk mode and the profile's "Hide sidebar" setting still hide it.
 * The menu button switches between icons only and icons with labels.
 * Written for the HA 2026.10 frontend (ha-drawer .sidebar-shell / .app-content, ha-sidebar with ha-list-nav).
 */
(() => {
  if (window.__haTopSidebar) return;
  window.__haTopSidebar = true;

  // home-assistant-main: the content no longer makes room on the left, and the bar height is shared.
  // The bar is a floating pill, so its slot is the header height plus a margin above and below.
  const MAIN_CSS = `
    :host(:not([modal])) {
      --ha-sidebar-width: 0px !important;
      --ha-top-app-bar-width: 100% !important;
      --ha-top-sidebar-gap: 10px;
      --ha-top-sidebar-height: calc(var(--header-height, 56px) + 2 * var(--ha-top-sidebar-gap) + var(--safe-area-inset-top, 0px));
    }
  `;

  // ha-drawer: the sidebar shell becomes a full-width bar over the top of the page.
  // Headers, page content and pop-ups (Bubble Card too) all leave room for --safe-area-inset-top,
  // the space HA keeps free for a phone's notch, so raising it to the bar height moves everything
  // below the bar while fixed elements stay relative to the screen and stack normally.
  const DRAWER_CSS = `
    :host(:not([type="modal"])) .sidebar-shell {
      inset: 0 0 auto 0;
      width: 100% !important;
      height: var(--ha-top-sidebar-height) !important;
      transform: none !important;
      border-inline-end: none;
      transition: none;
      /* The dashboard background runs behind the bar. It is fixed to the screen, so it lines up with the page below. */
      background: var(--lovelace-background, var(--primary-background-color));
    }
    :host(:not([type="modal"])) .app-content {
      padding-inline-start: 0 !important;
      --safe-area-inset-top: var(--ha-top-sidebar-height);
    }
  `;

  // ha-sidebar: header, panels and the fixed items (settings, notifications, profile) in one row,
  // on a frosted glass pill that matches the dashboard cards (the theme's card variables).
  const SIDEBAR_CSS = `
    :host(:not([narrow])) {
      flex-direction: row;
      align-items: center;
      box-sizing: border-box;
      width: calc(100% - 2 * var(--ha-top-sidebar-gap, 10px));
      height: calc(100% - 2 * var(--ha-top-sidebar-gap, 10px) - var(--safe-area-inset-top, 0px));
      margin: calc(var(--ha-top-sidebar-gap, 10px) + var(--safe-area-inset-top, 0px)) var(--ha-top-sidebar-gap, 10px) var(--ha-top-sidebar-gap, 10px);
      padding: 0 var(--ha-space-2, 8px) 0 var(--ha-space-1, 4px);
      overflow: visible;
      border-radius: 22px;
      background: var(--ha-card-background, rgba(255,255,255,0.07));
      border: 1px solid var(--ha-card-border-color, rgba(255,255,255,0.13));
      box-shadow: var(--ha-card-box-shadow, none);
      backdrop-filter: blur(24px) saturate(170%);
      -webkit-backdrop-filter: blur(24px) saturate(170%);
      font-family: 'Figtree', var(--ha-font-family-body, system-ui), -apple-system, sans-serif;
      --ha-border-radius-sm: 14px;
      --ha-list-item-focus-radius: 14px;
      --ha-row-item-min-height: 40px;
    }
    :host(:not([narrow])) .title {
      font-family: 'Bricolage Grotesque', 'Figtree', system-ui, sans-serif;
      font-weight: 600;
      letter-spacing: -0.02em;
      color: var(--primary-text-color);
    }
    :host(:not([narrow])) .menu { background: transparent; }
    :host(:not([narrow])) ha-list-item-button { border-radius: 14px; }
    :host(:not([narrow])) ha-list-item-button .item-text { font-weight: 600; }
    /* Selected page: an accent-tinted glass chip, like the dashboard's active toggles */
    :host(:not([narrow])) ha-list-item-button.selected:before {
      border-radius: 14px;
      background: color-mix(in srgb, var(--primary-color) 18%, transparent);
      border: 1px solid color-mix(in srgb, var(--primary-color) 55%, transparent);
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.16);
      opacity: 1;
    }
    :host(:not([narrow])) ha-list-item-button.selected::part(headline) { color: var(--primary-color); }
    :host(:not([narrow])) .badge {
      background-color: var(--primary-color);
      color: var(--text-primary-color);
      font-weight: 600;
    }
    :host(:not([narrow])) .menu {
      width: auto !important;
      height: 100%;
      padding-top: 0;
      flex: none;
      border-bottom: none;
      padding-inline-end: var(--ha-space-2, 8px);
    }
    :host(:not([narrow])) .title { flex: none; }
    :host(:not([narrow])) .panels-list,
    :host(:not([narrow])) .wrapper {
      flex-direction: row;
      align-items: center;
      min-width: 0;
      height: 100%;
    }
    :host(:not([narrow])) .wrapper { flex: 1; }
    :host(:not([narrow])) .panels-list { flex: 1; }
    :host(:not([narrow])) .spacer { display: none; }
    :host(:not([narrow])) ha-list-nav {
      margin: 0 !important;
      height: 100%;
      overflow: visible;
    }
    :host(:not([narrow])) ha-list-nav.before-spacer { flex: 1; min-width: 0; }
    :host(:not([narrow])) ha-list-nav.after-spacer { flex: none; }
    :host(:not([narrow])) ha-list-nav::part(nav) { height: 100%; }
    :host(:not([narrow])) ha-list-nav::part(base) {
      flex-direction: row;
      align-items: center;
      gap: var(--ha-space-1, 4px);
      height: 100%;
      overflow-x: auto;
      overflow-y: hidden;
      scrollbar-width: none;
    }
    /* Icons only: HA's own 48px square, which centres the icon. With labels: as wide as the label. */
    :host(:not([narrow])) ha-list-item-button {
      width: var(--ha-space-12, 48px) !important;
      margin: 0 !important;
    }
    :host(:not([narrow])[expanded]) ha-list-item-button { width: auto !important; }
    :host(:not([narrow])) ha-list-item-button .item-text { max-width: none; }
    :host(:not([narrow]):not([expanded])) ha-list-item-button .item-text { display: none; }
  `;

  const sheets = {};
  const sheet = (key, css) => {
    if (!sheets[key]) { sheets[key] = new CSSStyleSheet(); sheets[key].replaceSync(css); }
    return sheets[key];
  };
  // Lit adopts a component's styles once, when its shadow root is created, so a sheet added
  // afterwards stays in place through re-renders.
  const adopt = (el, key, css) => {
    const root = el?.shadowRoot;
    if (!root) return;
    const s = sheet(key, css);
    if (!root.adoptedStyleSheets.includes(s)) root.adoptedStyleSheets = [...root.adoptedStyleSheets, s];
  };

  // On narrow screens and in the companion app, HA makes the sidebar a slide-out drawer.
  // The top bar fits a phone too, so the docked layout is kept there as well:
  // the sidebar only goes away when the user picks "Hide sidebar" in their profile.
  // HA's own kiosk mode still gets the drawer.
  let patched = false;
  const patchMain = (main) => {
    const cls = customElements.get("home-assistant-main");
    if (cls && !patched) {
      Object.defineProperty(cls.prototype, "_sidebarNarrow", {
        configurable: true,
        get() { return this.hass?.dockedSidebar === "always_hidden"; }
      });
      patched = true;
    }
    // The companion app can ask to show its own native sidebar instead. That flag is set on the element, so it is pinned per element.
    if (main && !main.__haTopSidebar) {
      main.__haTopSidebar = true;
      Object.defineProperty(main, "_externalSidebar", { configurable: true, get: () => false, set: () => {} });
      main.requestUpdate?.();
    }
  };

  // The shell elements can be replaced (reconnect, login), so the check repeats. Each pass is a few lookups.
  const apply = () => {
    const main = document.querySelector("home-assistant")?.shadowRoot?.querySelector("home-assistant-main");
    const mr = main?.shadowRoot;
    if (!mr) return;
    patchMain(main);
    adopt(main, "main", MAIN_CSS);
    adopt(mr.querySelector("ha-drawer"), "drawer", DRAWER_CSS);
    adopt(mr.querySelector("ha-sidebar"), "sidebar", SIDEBAR_CSS);
  };
  // The dashboard fonts, so the bar uses them on every page (the Aurora Glass card loads the same file).
  const FONTS = "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,600&family=Figtree:wght@400;500;600;700&display=swap";
  if (!document.querySelector(`link[href="${FONTS}"]`)) {
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = FONTS;
    document.head.appendChild(l);
  }

  apply();
  setInterval(apply, 1000);
})();
