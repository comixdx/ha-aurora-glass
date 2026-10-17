# Aurora Glass for Home Assistant

A frosted-glass dashboard card whose animations follow real entity states: dots flow along the energy lines at a speed set by the kW, the fan spins at its set speed, air streaks while the AC cools, the floor shimmers while it heats, the music bars move while a speaker plays. Hold any tile for a glass pop-up with its controls, and use the Aurora Glass Entity card to give any entity an animated tile. Everything is set up with clicks — no YAML.

## Set up with clicks only

**1. Install** (once)
1. HACS → ⋮ → **Custom repositories** → paste `https://github.com/comixdx/ha-aurora-glass`, type **Dashboard** → Add.
2. Open **Aurora Glass** in HACS → **Download**. HACS registers the card for you.
3. Reload the browser (on the phone app: Settings → Companion app → Debugging → Reset frontend cache, or restart the app).

**2. Create the dashboard**
1. Settings → **Dashboards** → **Add dashboard** → **New dashboard from scratch**. Name it, pick an icon → Create, then open it.
2. ✏️ (top right) → if asked, choose **Start with an empty dashboard**.
3. Click the ✏️ next to the view tab → **View type: Panel (single card)** → Save. *(Optional: a Sections view also works if you want other cards next to it.)*

**3. Add the card**
1. **+ Add card** → search **Aurora Glass** → select it.
2. It opens already filled in with what it finds in your Home Assistant: solar, battery, grid and house power, lights, climate, scenes, media, fans, lock, door and window sensors, weather.
3. Adjust anything in the editor (below) → **Save** → **Done**.

That's it. The glass look is applied to the whole dashboard by the card itself, so no theme file is needed.

## The visual editor

- **Appearance** — theme preset (Auto follows HA's light/dark, or Midnight, Dawn, Lagoon, Ember), accent colour, glass blur, switches for animations, the drifting background, the header, the Customize button and *Apply the glass theme to the whole dashboard*; title, language (Auto / English / Română) and minimum height (`100vh` fills the screen in a Panel view).
- **Header chips** — sensors shown in the header, each with a name and a dot colour.
- **Widgets** — one row per widget, opened with a click:
  - ↑ ↓ to reorder, 🗑 to delete, **Add widget** at the bottom;
  - type (energy flow, lights, climate, scenes, now playing, fan, floor heating, security, weather) and size S / M / L / XL;
  - Home Assistant's own entity pickers for every sensor and device;
  - lights and scenes get their own rows with name, subtitle or description;
  - energy flow shows solar, grid, battery, the inverter in the middle and the load; pick the inverter's power, status (e.g. GoodWe work mode) and temperature sensors to show them on the inverter node, and use the two switches for inverters (such as GoodWe) whose battery sensor is positive when discharging or whose grid sensor is positive when exporting.

## Customize mode (on the dashboard)

The **Customize** button on the dashboard changes the layout on that one device: move, resize or park widgets, switch preset and accent, blur and animations. A wall tablet and your phone can look different this way. *Reset layout* returns to the editor's layout, and any setting you later change in the editor replaces the device's choice.

`prefers-reduced-motion` on a device always turns the animations off.

## Pop-ups and animated entity tiles

**Glass pop-ups.** Hold any tile on the Aurora Glass card (or right-click it), or tap a header chip, an energy-flow node or a widget's icon, and a glass pop-up grows out of it. On a phone it slides up from the bottom and closes with a swipe down. What's inside depends on the entity:

| Entity | In the pop-up |
|---|---|
| Light | Drag-to-dim brightness slab, on/off, colour temperature, colour swatches, effects |
| Switch, input boolean | A big on/off slab |
| Fan | Speed slab, spinning fan, oscillate, direction, preset modes |
| Climate | Large dial with − / +, hvac modes, fan modes, presets, air or heat animation |
| Media player | Artwork, progress, previous / play / next, volume, mute, sources |
| Cover | Moving shutter, position slab, open / stop / close |
| Lock | Animated lock, lock / unlock / open |
| Sensor | Big value, 24-hour chart that draws itself, min / average / max |
| Binary sensor, person | Animated icon and a 24-hour on/off timeline |
| Weather | Animated sky, humidity / wind / pressure, 5-day forecast |
| Scene, script, button | A run button with a ripple |

**⋯** or *More details* opens Home Assistant's own dialog. In the editor, *Hold a tile … to open* lets you choose the Aurora Glass pop-up, Home Assistant's dialog or nothing.

**Aurora Glass Entity card.** + Add card → **Aurora Glass Entity** puts a single entity anywhere as a glass tile (or a row with a switch) whose icon animates with its state: the bulb glows and sends out rays at its brightness, the power ring turns, fan blades spin at their speed, the snowflake turns while cooling and the flame flickers while heating, the speaker bars bounce, the lock shackle jumps, blinds slide, doors swing, motion sends out ripples, the thermometer and battery fill to their level, and power sensors flicker while energy flows. Tap toggles (or runs a scene), hold opens the pop-up; both can be changed in its editor along with layout, icon, theme and accent.

Home Assistant's own dialogs get the glass look too: automatically on dashboards with the Aurora Glass card, and everywhere when you use the theme below.

**Weather service.** In the weather widget pick *Weather service*: a Home Assistant weather entity from any integration, or **Open-Meteo**, built into the card — no integration, account or API key, it uses your home location and also gives the pop-up a 5-day forecast.

**Complete example.** [`examples/dashboard.yaml`](examples/dashboard.yaml) is a whole dashboard: the Aurora Glass card with every widget, kiosk mode (guests get it full screen without the sidebar and top bar) and a small round power button in the top-right corner that opens a glass menu with Restart, Reboot host and Shut down (with confirmation), visible only to your admin user. Kiosk mode needs kiosk-mode; the power menu needs card-mod and Bubble Card.

## Optional: the theme for all of Home Assistant

`themes/aurora_glass.yaml` puts the same look on every dashboard and on the rest of the interface (sidebar, settings, dialogs). This is the only part that needs a file: copy it to `/config/themes/`, make sure `configuration.yaml` has `frontend: themes: !include_dir_merge_named themes`, run `frontend.reload_themes`, then choose **Aurora Glass** in your profile. Not needed for the dashboard itself.

## For YAML users

**Step-by-step YAML tutorial with pictures:** [docs/yaml-tutorial.md](docs/yaml-tutorial.md)

`examples/dashboard.yaml` is a complete example dashboard (with kiosk mode and the power menu). Card options:

| Key | Default | |
|---|---|---|
| `widgets` | — | List of widgets (below). Order = default layout. |
| `preset` | `auto` | `auto`, `midnight`, `dawn`, `lagoon`, `ember`. |
| `accent` | `peach` | `peach`, `gold`, `mint`, `sky`, `lilac`. |
| `blur` | `24` | Glass blur in px. |
| `motion` | `true` | Animations. |
| `background` | `true` | The card's own drifting background. |
| `dashboard_theme` | `true` | Apply the glass look to every card on this dashboard. |
| `min_height` | — | e.g. `100vh` in a Panel view. |
| `chips` | — | `{entity, name, color, decimals}`; `color` is a hex or `cool`/`heat`/`solar`/`battery`/`grid`/`alert`. |
| `title` | greeting | Header title. `header: false` hides the header. |
| `customize` | `true` | `false` hides the Customize button. |
| `popup` | `aurora` | What holding a tile opens: `aurora` (glass pop-up), `native` (Home Assistant's dialog) or `none`. |
| `language` | profile | `en`, `ro`. Add others with `translations: { de: { lights: "Licht" } }`. |
| `id` | page path | Key for the saved device layout, if the card is on several dashboards. |

Every widget takes `type`, `size` (`S`/`M`/`L`/`XL`), `title`, `id`, and:

| type | Keys |
|---|---|
| `energy` | Five nodes with the inverter in the middle: solar, grid and battery connect to the inverter, the inverter feeds the load. `solar_power`, `grid_power`, `battery_power`, `battery_soc`, `home_power` (load, optional), `inverter_power`, `inverter_status`, `inverter_temperature` (all three optional), `invert_battery`, `invert_grid`. W or kW. Battery + = charging, grid + = import, unless inverted. |
| `lights` | `entities`: lights, switches or input_booleans, as an entity id or `{entity, name, subtitle}`. Tap toggles; the slider dims the last tapped light. |
| `climate` | `entity`, `modes` (up to 4, e.g. `[cool, heat, dry, off]`). +/− taps are bundled into one command. |
| `scenes` | `entities`: `scene.*`, `script.*`, `button.*` or `{entity, name, description}`. The most recently run scene is marked active (`active_hours`, default 12). |
| `media` | `entity`, `subtitle`. |
| `fan` | `entity`. Tap cycles 33 / 66 / 100 % / off. |
| `floor` | `entity` (climate, switch or input_boolean), `temperature`, `subtitle`. |
| `security` | `lock`, `lock_name`, `sensors` (binary sensors; open ones pulse). |
| `weather` | `entity` (any weather integration: Met.no, OpenWeatherMap, AccuWeather, …), **or** `source: open_meteo` for the built-in Open-Meteo service (free, no account), with optional `latitude`, `longitude` (default: your home) and `location_name`. |

Hold (or right-click) a tile, or tap a chip, an energy node or a widget icon, to open its pop-up.

**Aurora Glass Entity card**

```yaml
type: custom:aurora-glass-entity
entity: light.living_room_ceiling
name: Ceiling            # optional
icon: mdi:ceiling-light  # optional, replaces the animated icon
layout: tile             # tile | row
tap_action: auto         # auto | toggle | popup | native | none
hold_action: popup       # popup | native | none
subtitle: Living room    # optional, default = the area
preset: auto             # auto | midnight | dawn | lagoon | ember
accent: peach            # peach | gold | mint | sky | lilac
glass: true              # false = no glass background
show_state: true
motion: true
```

`auto` toggles lights, switches, fans and covers, runs scenes, scripts and buttons, and opens the pop-up for everything else.
