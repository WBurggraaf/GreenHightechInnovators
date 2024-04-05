# Package Delivery Emissions Plugin

> [!NOTE] > `Package Delivery Emissions` is a community plugin, not part of the IF standard library. This means the IF core team are not closely monitoring these plugins to keep them up to date. You should do your own research before implementing them!

# Parameters

## Inputs

- `vehicle/embodied-carbon-g-co2e`: Amount of carbon
- `battery/amount-charged`: State of charge in Mah
- `battery/max-capacity`: Maxmimum rated capacity in Mah
- `route/segment-distance`: How long the segment is.
- `route/segment-real-time-speed`: Current speed in Km/h
- `route/expected-efficiency`: Expected efficiency with the max being 1.00
- `package/weight`: Weight of the package in grams.
- `grid/carbon-intensity-g-co2e-per-kwh`: How much carbon in grams a single kw/h produces.

## Returns

- `battery/energy-consumption-kwh`: Amount of energy consumed during the route in Kw/h
- `battery/emissions-from-energy-g-co2e`: Amount of carbon emitted during the round in grams.
- `battery/degradation-per-segment`: how much a battery is degraded per route segment.
- `battery/degradation-embody-emissions-g-co2e`: Amount of carbon emitted based on vehicle wear in grams.
- `package/estimated-delivery-emissions-g-co2e`: Amount of carbon emitted for current delivery in grams.

# IF Implementation

IF utilizes the Package Delivery Emissions Framework to calculate the carbon emissions and waste materials.

The Package Delivery Emissions Framework is a community plugin, not part of the IF standard library. This means the IF core team are not closely monitoring these plugins to keep them up to date. You should do your own research before implementing them!

## Usage

In IF the plugin is called from an `manifest`. An `manifest` is a `.yaml` file that contains configuration metadata and usage inputs. This is interpreted by the command line tool, `ie`.

Each input is expected to contain `vehicle/embodied-carbon-g-co2e`, `battery/amount-charged`, `battery/max-capacity`, `route/segment-distance`, `route/segment-real-time-speed`, `route/expected-efficiency`, `package/weight` and `grid/carbon-intensity-g-co2e-per-kwh` fields.

## Manifest

The following is an example of how Weather Impact Predition can be invoked using an `manifest`.

```yaml
name: package-delivery-emissions
description: simple demo package-delivery-emissions
tags:
initialize:
  plugins:
    package-delivery-emissions:
      method: PackageDeliveryEmissions
      path: '@grnsft/if-unofficial-plugins'
tree:
  children:
    child:
      pipeline:
        - package-delivery-emissions
      inputs: 
      - timestamp: "2023-12-12T00:00:00.000Z"
        vehicle/embodied-carbon-g-co2e: 0
        package/weight: 10  
        route/segment-real-time-speed: 55
        route/segment-distance: 55
        battery/amount-charged: 500000
        battery/max-capacity: 70000
        grid/carbon-intensity-g-co2e-per-kwh:  1
```

You can run this by passing it to `ie`. Run impact using the following command run from the project root:

```sh
npm i -g @grnsft/if
npm i -g @grnsft/if-unofficial-plugins
ie --manifest ./examples/manifests/package-delivery-emissions.yml --output ./examples/outputs/package-delivery-emissions.yml
```

This yields a result that looks like the following (saved to `/outputs/package-delivery-emissions.yml`):

```yaml
name: package-delivery-emissions
description: simple demo package-delivery-emissions
tags:
initialize:
  plugins:
    package-delivery-emissions:
      method: PackageDeliveryEmissions
      path: '@grnsft/if-unofficial-plugins'
tree:
  children:
    child:
      pipeline:
        - package-delivery-emissions
      inputs: 
      - timestamp: "2023-12-12T00:00:00.000Z"
        vehicle/embodied-carbon-g-co2e: 0
        package/weight: 10  
        route/segment-real-time-speed: 55
        route/segment-distance: 55
        battery/amount-charged: 500000
        battery/max-capacity: 70000
        grid/carbon-intensity-g-co2e-per-kwh:  1
      outputs:
      - timestamp: "2023-12-12T00:00:00.000Z",
        vehicle/embodied-carbon-g-co2e: 0,
        package/weight: 10,
        route/segment-real-time-speed: 55,
        route/segment-distance: 55,
        battery/amount-charged: 500000,
        battery/max-capacity: 70000,
        grid/carbon-intensity-g-co2e-per-kwh: 1,
        package/estimated-delivery-emissions-g-co2e: null,
        battery/energy-consumption-kwh: null,
        battery/energy-source-renewable-percentage: 0,
        battery/emissions-from-energy-g-co2e: null,
        battery/degradation-per-segment: null,
        vehicle/update-suggested-maintenance-interval-in-days: 90
```

## TypeScript

You can see example Typescript invocations for each plugin below.

```typescript
import {PackageDeliveryEmissions} from '@grnsft/if-unofficial-plugins';

const packageDeliveryEmissions = PackageDeliveryEmissions(globalConfig);
const results = await packageDeliveryEmissions.execute(
  [
    {
      timestamp: '2021-01-01T00:00:00Z', // ISO8601 / RFC3339 timestamp
        'vehicle/embodied-carbon-g-co2e': 0
        'package/weight': 10  
        'route/segment-real-time-speed': 55
        'route/segment-distance': 55
        'battery/amount-charged': 500000
        'battery/max-capacity': 70000
        'grid/carbon-intensity-g-co2e-per-kwh':  1
    },
  ]
);
```
