# EvCharginEmission Plugin

> [!NOTE] > `EV Charging Emissions plugin` is a community plugin, not part of the IF standard library. This means the IF core team are not closely monitoring these plugins to keep them up to date. You should do your own research before implementing them!

# Parameters

## Plugin global config

This plugin doesn't use any global configurations. //TODO Add global config support for

- `grid/carbon-average-renewable-energy-percentage`:

## Inputs

- `charging_station/id`: The id of the charging station
- `charging_station/type`: What type of charging station this is. This is indicated by it's level (1,2,3).
- `charging_station/converter-efficiency`: How efficient the AC to DC converter is in the charging station.
- `charging_station/cable-efficency`: How efficient the cables are based on their current load.
- `charging_station/location-lat`: Latitude location of the connected charger.
- `charging_station/location-lng`: Longditude location of the connected charger.

- `vehicle/id`:  The id of the vehicle.
- `vehicle/name`: Name of the vehicle.
- `vehicle/type`: Type of vehicle (Van).
- `vehicle/converter-efficiency`: The efficiency of the AC/DC converter in the vehicle.
- `vehicle/fuel-type`: The efficiency of the AC/DC converter in the vehicle.
- `vehicle/cable-efficiency`: he efficiency of the cables inside of the vehicle that lead towards the battery.

- `battery/soc-start`: State Of Charge when the vehicle started charging.
- `battery/current-soc`: The current State Of Charge when the measurement was taken.
- `battery/amount-charged-mAh`: The amount of energy that is used to change the vehicle in the current session in mAh.
- `battery/max-capacity-mAh`: Maximum rated capacity of the vehicles battery in mAh if it's electric.
- `battery/state`: What the vehicle is currently doing (charing, discharging, none).
- `battery/charge-cycle`: How many cycles the battery has done.
- `battery/temperature`: How hot the battery is currently.
- `battery/temperature-unit`: The unit how the temperature is measured (Kelvin, Farhenheid, Celcius).
- `battery/expected-percentage-renewable-energy`: The expected amount on the current charge session.
- `battery/expected-charging-delay-in-minutes`: The amount of time the battery is expected to charge.
- `battery/max-pack-voltage`: The maximum rated voltage of the battery pack.
- `battery/efficiency`: How efficient the batterypack can store the incoming energy.

- `grid/carbon-intensity-g-co2e-per-kwh`: How much carbon is emitted per Kw/h of energy consumed.

## Returns

- `battery/energy-efficiency-lost-power-kwh`: How much energy in Kwh is lost during this charging session.
- `battery/soh-after-charging`: The expected State Of Health of the battery after the current charging sessions.
- `battery/direct-carbon-emissions-g-co2e`: How many carbon is emitted during this charging session.
- `battery/precentage-current-is-renewable`: Persentage of how many of the energy in the pack is renewable.

# IF Implementation

IF utilizes the EvChargingEmissions plugin to calculate the carbon emissions while charging an electric vehicle. It does this based on different parameters. If doesn't need to install any other moduels to run this plugin.

The EvChargingEmissions plugin is a community plugin, not part of the IF standard library. This means the IF core team are not closely monitoring these plugins to keep them up to date. You should do your own research before implementing them!

## Usage

In IF the plugin is called from an `manifest`. An `manifest` is a `.yaml` file that contains configuration metadata and usage inputs. This is interpreted by the command line tool, `ie`.

The global input should have `grid/carbon-average-renewable-energy-percentage` set.

Each input is expected to contain `charging_station/type`,`charging_station/converter-efficiency`,`charging_station/cable-efficency`,`vehicle/converter-efficiency`,`vehicle/cable-efficiency`, `grid/carbon-intensity-g-co2e-per-kwh`, `battery/soc-start`, `battery/current-soc`, `battery/amount-charged-mAh`, `battery/expected-percentage-renewable-energy`, `battery/max-pack-voltage`, `battery/max-capacity-mAh` and `battery/expected-efficiency` fields.

## Manifest

The following is an exmaple of how EvCharginEmission can be invoked using an `manifest`.

```yaml
name: ev-charging-emissions
description: simple demo ev-charging-emissions
tags:
initialize:
  plugins:
    ev-charging-emissions:
      method: EvChargingEmissions
      path: '@grnsft/if-unofficial-plugins'
      global-config:
        options:
          averageRenewableEnergyPercentageGrid: 13
tree:
  children:
    child:
      pipeline:
        - ev-charging-emissions
      inputs:
        - timestamp: "2023-12-12T00:00:00.000Z"
          charging_station/type: 2
          charging-station/converter-efficiency: 90
          charging-station/cable-efficency: 99
          vehicle/converter-efficiency: 96
          vehicle/cable-efficiency: 99
          battery/soc-start: 40
          battery/current-soc: 80
          battery/amount-charged-mAh: 10000
          battery/max-capacity-mAh: 50000
          battery/state: "charging"
          battery/expected-percentage-renewable-energy: 50
          battery/max-pack-voltage: 800
          battery/efficiency: 98
          grid/carbon-intensity-g-co2e-per-kwh:  1 
```

You can run this by passing it to `ie`. Run impact using the following command run from the project root:

```sh
npm i -g @grnsft/if
npm i -g @grnsft/if-unofficial-plugins
ie --manifest ./examples/manifests/ev-charging-emissions.yml --output ./examples/outputs/ev-charging-emissions.yml
```

This yields a result that looks like the following (saved to `/outputs/ev-charging-emissions.yml`):

```yaml
name: ev-charging-emissions
description: simple demo ev-charging-emissions
tags:
initialize:
  plugins:
    ev-charging-emissions:
      method: EvChargingEmissions
      path: '@grnsft/if-unofficial-plugins'
      global-config:
        options:
          averageRenewableEnergyPercentageGrid: 13
tree:
  children:
    child:
      pipeline:
        - ev-charging-emissions
      inputs:
        - timestamp: "2023-12-12T00:00:00.000Z"
          charging_station/type: 2
          charging-station/converter-efficiency: 90
          charging-station/cable-efficency: 99
          vehicle/converter-efficiency: 96
          vehicle/cable-efficiency: 99
          battery/soc-start: 40
          battery/current-soc: 80
          battery/amount-charged-mAh: 10000
          battery/max-capacity-mAh: 50000
          battery/state: "charging"
          battery/expected-percentage-renewable-energy: 50
          battery/max-pack-voltage: 800
          battery/efficiency: 98
          grid/carbon-intensity-g-co2e-per-kwh:  1
          battery/energy-efficiency-lost-power-kwh: 0.00272
          battery/soh-after-charging: 50
          battery/direct-carbon-emissions-g-co2e: 0.01072
          battery/precentage-current-is-renewable: 12.6 
```

## TypeScript

You can see example Typescript invocations for each plugin below.

```typescript
import {EvChargingEmissions} from '@grnsft/if-unofficial-plugins';

const globalConfig = {
  options: {
    averageRenewableEnergyPercentageGrid: 13
  },
};
const EvChargingEmissions = EvChargingEmissions(globalConfig);
const results = await EvChargingEmissions.execute(
  [
 {
      "timestamp": "2023-12-12T00:00:00.000Z",
      "charging_station/type": 2,
      "charging-station/converter-efficiency": 90,
      "charging-station/cable-efficency": 99,
      "vehicle/converter-efficiency": 96,
      "vehicle/cable-efficiency": 99,
      "battery/soc-start": 40,
      "battery/current-soc": 80,
      "battery/amount-charged-mAh": 10000,
      "battery/max-capacity-mAh": 50000,
      "battery/state": "charging",
      "battery/expected-percentage-renewable-energy": 50,
      "battery/max-pack-voltage": 800,
      "battery/efficiency": 98,
      "grid/carbon-intensity-g-co2e-per-kwh": 1
    }
  ]
);
```
