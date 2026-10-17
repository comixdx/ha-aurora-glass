# Configuring Aurora Glass in YAML

Everything here can also be done in the visual editor. YAML is handy when you want to copy a setup between dashboards, keep it in a backup, or type faster than you click. Both write the same config, so you can switch back and forth at any time.

## 1. Where the YAML goes

![The card editor with YAML on the left and the live preview on the right](images/where-to-edit.svg)

1. Edit the dashboard → click the Aurora Glass card (or **+ Add card** → **Aurora Glass**) → **Show code editor**. The YAML of this one card appears.
2. The preview updates as you type. If something is wrong, the card shows a red line naming the problem.
3. **Save**.

To see the whole dashboard instead (all views and cards), use ⋮ → **Raw configuration editor** while editing the dashboard. The Aurora Glass card is the block that starts with `type: custom:aurora-glass-card`.

## 2. The smallest working card

```yaml
type: custom:aurora-glass-card
widgets:
  - type: weather
    entity: weather.home
```

Two rules matter more than anything else:

- `type: custom:aurora-glass-card` — with `custom:` in front.
- `widgets:` is a list. Each widget starts with `- type:` and everything that belongs to it is indented under it by **two spaces**. YAML uses spaces, never tabs.

## 3. The parts of the card

![Card layout with numbered parts](images/card-anatomy.svg)

| # | What | YAML |
|---|---|---|
| 1 | Greeting and date | `title: Acasă` replaces the greeting; `header: false` hides the whole header |
| 2 | Header chips | `chips:` — a list of sensors |
| 3 | Customize button | `customize: false` hides it |
| 4 | A widget | one item under `widgets:` |
| 5 | Widget size | `size: S`, `M`, `L` or `XL` |
| 6 | Look of the whole card | `preset`, `accent`, `blur`, `motion`, `background`, `dashboard_theme` |

```yaml
type: custom:aurora-glass-card
preset: auto            # auto | midnight | dawn | lagoon | ember
accent: peach           # peach | gold | mint | sky | lilac
blur: 24                # glass blur in px, 0–40
motion: true            # animations
background: true        # the card's own drifting background
dashboard_theme: true   # give every card on this dashboard the glass look
min_height: 100vh       # fill the screen in a Panel view
language: ro            # optional; default is your profile language
title: Acasă            # optional; default is the greeting
chips:                  # (2)
  - entity: sensor.living_room_temperature
    name: Inside
    color: cool         # hex or cool | heat | solar | battery | grid | alert
  - entity: sensor.pv_power
    name: Solar
    color: solar
widgets:
  - type: weather
    entity: weather.home
```

## 4. Widget sizes

![How S, M, L and XL fill the grid on a wide screen, a tablet and a phone](images/widget-sizes.svg)

On a wide screen the card has 12 columns: `S` takes 3, `M` 4 (the default), `L` 6 and `XL` all 12. On a tablet there are 6 columns, and on a phone every widget is full width in the same order. Widgets fill gaps automatically, so `L L` / `M M M` / `S S S S` rows line up neatly.

## 5. Energy flow (solar, grid, battery, inverter, load)

![Each node of the energy flow and the YAML key that feeds it](images/energy-keys.svg)

```yaml
  - type: energy
    size: L
    solar_power: sensor.pv_power                  # W or kW
    grid_power: sensor.active_power
    battery_power: sensor.battery_power
    battery_soc: sensor.battery_state_of_charge    # %
    home_power: sensor.house_consumption           # optional
    inverter_power: sensor.inverter_output_power   # optional
    inverter_status: sensor.work_mode              # optional, any text sensor
    inverter_temperature: sensor.inverter_temperature  # optional
    invert_battery: true    # GoodWe: battery_power is + when discharging
    invert_grid: true       # GoodWe: active_power is + when exporting
```

The entity ids above are examples. Use the ones from **Settings → Devices & services → your inverter**, or start typing in the visual editor's entity picker.

**Which way the dots run.** The card expects the battery to be positive while charging and the grid positive while importing. If a line flows the wrong way on your dashboard, set `invert_battery: true` or `invert_grid: true`. Most GoodWe setups need both.

**Missing sensors are fine.** Without `grid_power` the grid node disappears; without `battery_power` and `battery_soc` the battery node disappears. Without `home_power` the load is calculated as solar + grid import − battery charging. Without `inverter_power` the inverter shows solar minus battery charging.

## 6. Lights and scenes

![What name, subtitle and description change on a tile](images/list-items.svg)

```yaml
  - type: lights
    size: L
    entities:
      - entity: light.living_room_ceiling
        name: Ceiling spots       # optional, default = the entity's name
        subtitle: Living room     # optional
      - light.kitchen_worktop     # short form, entity id only
      - entity: switch.bathroom_intrerupator_baie_switch   # switches work too
        name: Bathroom
  - type: scenes
    entities:
      - entity: scene.good_morning
        description: Lights at 80%, bedroom stays dark
      - entity: script.night       # scripts and buttons work too
        name: Night
        description: Hallway dim, bedroom AC only
```

Tap a tile to toggle it. The slider under the light tiles dims the last light you tapped. Long-press any tile to open Home Assistant's more-info dialog.

## 7. The other widgets

```yaml
  - type: climate
    entity: climate.living_room_ac
    title: Living room
    modes: [cool, heat, dry, off]    # optional, up to 4 buttons

  - type: media
    entity: media_player.living_room
    subtitle: Living room

  - type: fan
    size: S
    entity: fan.bedroom              # tap cycles 33 / 66 / 100 % / off

  - type: floor
    size: S
    entity: climate.bathroom_floor   # or a switch / input_boolean
    temperature: sensor.bathroom_floor_temperature
    subtitle: Bathroom

  - type: security
    size: S
    lock: lock.front_door
    lock_name: Front door
    sensors:
      - binary_sensor.kitchen_window
      - binary_sensor.bedroom_window

  - type: weather
    size: S
    entity: weather.home
```

Every widget also accepts `title:` (replaces the heading) and `id:` (only needed if you use the same widget type twice and want each to keep its own place in Customize mode).

## 8. A complete example

[`examples/dashboard.yaml`](../examples/dashboard.yaml) is a full dashboard view with every widget. Paste it into the **Raw configuration editor** of an empty dashboard and replace the entity ids with yours.

## 9. When something doesn't work

| What you see | Usually means |
|---|---|
| `Custom element doesn't exist: aurora-glass-card` | The card isn't loaded. Install it with HACS and reload the page; check there is only one Aurora Glass entry in Settings → Dashboards → Resources. |
| `Entity not found: light.xxx` on a tile | That entity id doesn't exist. Copy the exact id from Settings → Entities. |
| `add a widgets: list` | `widgets:` is missing or not indented as a list (`- type: …`). |
| `widget 3 needs a type` | The third item under `widgets:` has no `type:`, often because of wrong indentation. |
| The energy dots run the wrong way | Set `invert_battery` or `invert_grid` (section 5). |
| Changes in the editor don't show on one device | That device has its own Customize layout; open Customize → **Reset layout**. |
| The whole YAML turns red | Usually a tab character or a missing space after `:`. Use two spaces per level. |
