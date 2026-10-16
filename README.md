# Aurora Glass for Home Assistant

A frosted-glass theme plus a customizable dashboard card whose animations follow real entity states: dots flow along the energy lines at a speed set by the kW, the fan spins at its set speed, air streaks while the AC cools, the floor shimmers while it heats, the music bars move while a speaker plays.


## What's inside

| File | What it is |
|---|---|
| `themes/aurora_glass.yaml` | Themes: **Aurora Glass** (dark = Midnight, light = Dawn), **Aurora Glass Lagoon**, **Aurora Glass Ember**. They style every card, not only this one. |
| `aurora-glass-card.js` | `custom:aurora-glass-card` — the dashboard card. No build step, no dependencies. |
| `examples/dashboard.yaml` | A full example view. |

## Install

**Theme**
1. Copy `themes/aurora_glass.yaml` to `/config/themes/`. `configuration.yaml` needs `frontend: themes: !include_dir_merge_named themes`.
2. Developer tools → Actions → `frontend.reload_themes`, then pick the theme in your profile.
3. For the frosted blur on regular cards, install **card-mod** from HACS. Without it the cards are translucent, not blurred.

**Card**
1. Copy `aurora-glass-card.js` to `/config/www/aurora-glass/`.
2. Settings → Dashboards → ⋮ → Resources → add `/local/aurora-glass/aurora-glass-card.js?v=1` as **JavaScript module**. Bump `?v=` after each update so the phone app reloads it.
3. Edit a dashboard → **Add card** → search **Aurora Glass**. It starts filled in with entities it finds in your Home Assistant (solar, battery, grid, lights, climate, scenes, lock, weather), and everything is set in the visual editor — no YAML needed. A **Panel** view gives it the full width.

Prefer YAML? `examples/dashboard.yaml` is a complete example for the raw configuration editor.

Or add this repo to HACS as a custom repository (category Dashboard).

## Visual editor

Everything below can be set in the card editor: theme preset, accent, blur, animations, header chips, and the widget list (add, remove, reorder, change type and size, pick entities with Home Assistant's own entity pickers). Light and scene lists have their own rows for name, subtitle and description.

## Customize mode

The **Customize** button opens a panel where you can pick the theme preset and accent colour, set the blur strength, and turn animations on or off. Each widget then shows controls to move it, change its size (S → M → L → XL) or take it off the board; removed widgets wait under *Add widgets*. These choices are saved on the device, so a wall tablet and your phone can look different. *Reset layout* returns to the card's configured order. When you change a setting in the card editor, that setting replaces what the device had chosen.

`prefers-reduced-motion` on the device always turns the animations off.

## Card options (YAML reference)

| Key | Default | |
|---|---|---|
| `widgets` | — | List of widgets (below). Order = default layout. |
| `preset` | `auto` | `auto` follows HA dark/light, or `midnight`, `dawn`, `lagoon`, `ember`. |
| `accent` | `peach` | `peach`, `gold`, `mint`, `sky`, `lilac`. |
| `blur` | `24` | Glass blur in px. |
| `motion` | `true` | Animations. |
| `background` | `true` | Draw the card's own drifting background. Set `false` to sit on the theme background. |
| `min_height` | — | e.g. `100vh` in a Panel view. |
| `chips` | — | Sensors in the header: `{entity, name, color, decimals}`; `color` is a hex or `cool`/`heat`/`solar`/`battery`/`grid`/`alert`. |
| `title` | greeting | Header title. `header: false` hides the header. |
| `customize` | `true` | `false` hides the Customize button. |
| `language` | profile | `en`, `ro`. Add others with `translations: { de: { lights: "Licht" } }`. |
| `id` | page path | Key for the saved layout, if you use the card on several dashboards. |

Every widget takes `type`, `size` (`S`/`M`/`L`/`XL`), `title`, `id`, and:

| type | Keys |
|---|---|
| `energy` | `solar_power`, `home_power` (optional), `battery_power`, `battery_soc`, `grid_power`, `invert_battery`, `invert_grid`. W or kW. Battery + = charging, grid + = import, unless inverted. |
| `lights` | `entities`: entity or `{entity, name, subtitle}`. Tap toggles; the slider dims the last tapped light. |
| `climate` | `entity`, `modes` (up to 4, e.g. `[cool, heat, dry, off]`). +/− taps are bundled into one command. |
| `scenes` | `entities`: `scene.*`, `script.*`, `button.*` or `{entity, name, description}`. The most recently run scene is marked active (`active_hours`, default 12). |
| `media` | `entity`, `subtitle`. |
| `fan` | `entity`. Tap cycles 33 / 66 / 100 % / off. |
| `floor` | `entity` (climate, switch or input_boolean), `temperature`, `subtitle`. |
| `security` | `lock`, `lock_name`, `sensors` (binary sensors; open ones pulse). |
| `weather` | `entity`. |

Long-press (or right-click) a light, chip, energy node or sensor to open its more-info dialog.
