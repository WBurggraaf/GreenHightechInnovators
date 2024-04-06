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
      path: "@grnsft/if-unofficial-plugins"
      global-config:
        options:
          optionPlaceHolder: 0.6
tree:
  children:
    child:
      pipeline:
      - package-delivery-emissions
      defaults:
        grid/carbon-average-renewable-energy-percentage: 13
      inputs:
      - timestamp: '2023-12-12T00:00:00.000Z'

        route/id: 1  # Unique identifier for the entire delivery route
        route/segment-id: 23 # Unique identifier for this specific segment within the route
        route/segment-current: 1 # Indicates this is the currently active segment 
        route/segment-current-weight: 1000  # Current total weight (likely in kg) of the van and its cargo 
        route/segment-current-road-type: highway  # Type of road for this segment 
        route/segment-distance: 50 # Length of this route segment
        route/segment-distance-unit: km # Units for the segment distance (kilometers)
        route/segment-end-location-lat: 52.9244 # Latitude of the end point of this segment
        route/segment-end-location-lng: 5.09 # Longitude of the end point of this segment
        route/segment-real-time-speed: 70  # Current speed of the van 
        route/segment-real-time-speed-unit: km/h # Units for the speed (kilometers per hour)
        route/segment-start-location-lat: 52.3792 # Latitude of the start point of this segment
        route/segment-start-location-lng: 6.9003 # Longitude of the start point of this segment
        route/segment-total-count: 1 # Indicates this is the first segment (assumes more may exist)

        package/id: 1 # Unique identification number for this package
        package/volume: 50  # Size of the package (likely in cubic units, e.g., cubic centimeters)
        package/weight: 10  # Weight of the package (likely in kilograms)
        package/delivery-location-lat: 51.5074  # Latitude of the delivery location
        package/delivery-location-lng: 0.1278  # Longitude of the delivery location
        package/delivery-location-state: in-transit  # Indicates the package is currently being transported
        package/delivery-location-delivery-time-per-package: 30  # Estimated time needed to deliver the package at its destination (likely in minutes)

        # Battery-specific parameters
        battery/active-cell-materials: 'Lithium: 4782; Graphite: 19530; RareEarths: 3949'  # Materials within the battery cells 
        battery/amount-charged-mah: 9911  # Needs context of full battery capacity
        battery/battery-efficiency: 98  # Excellent efficiency during charge/discharge
        battery/charge-cycle: 2952  # Number of charge/discharge cycles 
        battery/chemistry: TeslaNewest  # Likely a proprietary LFP-based Tesla chemistry
        battery/current-soc: 80  # Current state of charge (%)
        battery/direct-carbon-emissions: 0  # No emissions during battery use
        battery/efficiency: 98  # Likely redundant with 'battery-efficiency'
        battery/energy-efficiency-lost-power-kwh: 10  # Energy lost as heat in this charge
        battery/expected-charging-delay-in-minutes: 1  # Minimal charging delay
        battery/expected-efficiency: 97  # Expected slight efficiency decline over time
        battery/expected-life-span-in-years: 8  # LFP batteries can have longer lifespans 
        battery/expected-percentage-renewable-energy: 75  # Goal for renewable energy sources
        battery/id: 1  # Unique battery ID
        battery/max-capacity-mah: 49123 
        battery/max-pack-voltage: 798
        battery/percentage-current-is-renewable: 60 
        battery/production-location: China 
        battery/soc-start: 84  # State of charge at the beginning of charging 
        battery/soh: 98  # State of Health - excellent battery condition
        battery/soh-after-charge: 98 
        battery/state: idle 
        battery/structural-components: 'Aluminum: 1202234; Copper: 404827; Steel: 309427; Plastics: 76744' 
        battery/temperature: 20  # Battery temperature in Celsius
        battery/temperature-unit: celsius" 

        # Overall vehicle specifications
        vehicle/battery-type: LFP  # Lithium Iron Phosphate battery, known for long life and stability
        vehicle/converter-efficiency: 91  # Excellent efficiency converting energy to motion
        vehicle/cable-efficiency: 88  # Typical efficiency, some energy loss as heat in the cable
        vehicle/emissions-factor-g-co2e-per-unit: 0  # No direct tailpipe emissions
        vehicle/emissions-factor-g-co2e-unit: kg  # Emissions measured in kilograms of CO2 equivalent
        vehicle/embodied-carbon-g-co2e: 0  # Needs updating - manufacturing has embodied carbon
        vehicle/expected-lifespan-in-years: 20  # Long lifespan for a logistics van
        vehicle/fuel-type: electric 
        vehicle/id: 1  # Unique vehicle ID
        vehicle/kwh-per-km: 0.15  # Decent energy efficiency for an electric van 
        vehicle/manufacturer: EVEletric 
        vehicle/materials-breakdown: 'Aluminum: 1202234; Copper: 404827; Steel: 309427; Plastics: 76744; Lithium: 133469; Graphite: 96257; RareEarths: 3949; Glass: 499641; Rubber: 162123; Electronics: 163668; Fluids: 102662'  # Detailed material composition
        vehicle/name: EV Van 1
        vehicle/resource-depletion-water-m3: 0  # Needs updating - water used in manufacturing
        vehicle/suggested-maintenance-interval-in-days: 90  # EVs typically have lower maintenance 
        vehicle/type: van 
        vehicle/weight: 6000  # Total vehicle weight
        vehicle/weight-unit: kg 

        grid/id: 1
        grid/bio-percentage: 4  # A small percentage of energy comes from biomass sources
        grid/carbon-intensity-g-co2e-per-kwh: 1  # Very low carbon intensity for the grid, indicating a clean mix
        grid/coal-bituminous-percentage: 0  # No reliance on bituminous coal (a moderately polluting type)
        grid/coal-sub-bituminous-percentage: 0 # No reliance on sub-bituminous coal (less polluting than bituminous)
        grid/coal-lignite-percentage: 0  # No reliance on lignite coal (the most polluting type)
        grid/gas-percentage: 5   # Small reliance on natural gas
        grid/geothermal-percentage: 0  # No geothermal energy in the current mix
        grid/hydro-percentage: 0    # No hydropower in the current mix
        grid/nuclear-percentage: 20  # Significant contribution from nuclear power
        grid/oil-percentage: 10     # Moderate reliance on oil-based generation 
        grid/solar-percentage: 20  #  Solar power provides a good portion of the energy
        grid/wind-percentage: 40   # Wind is the largest contributor to the energy mix 

        weather/id: 1
        weather/latitude: 51.5074  # Location: specifies the location's North-South position (likely London, UK)
        weather/longitude: -0.1278 # Location: specifies the location's East-West position  (likely London, UK)
        weather/radius-in-meters: 1000 # Area covered: defines the radius for localized weather data
        weather/temperature-in-celsius: 15 # Current temperature: 15 degrees Celsius, a mild temperature
        weather/rainfall-in-millimeter: 0 # Precipitation: currently no rainfall
        weather/wind-speed-in-kmh: 25  # Wind intensity: moderate wind speed of 25 kilometers per hour
        weather/wind-direction-in-degrees: 90 # Wind source:  wind blowing from the east (90 degrees)
        weather/cloud-coverage-percentage: 5 # Sky condition: very few clouds 
        weather/visibility-in-meters: 1000 # Visual range: good visibility of 1 kilometer
        weather/air-pressure-in-hectopascal: 1013 # Atmospheric pressure: standard atmospheric pressure
```

You can run this by passing it to `ie`. Run impact using the following command run from the project root:

```sh
npm i -g @grnsft/if
npm i -g @grnsft/if-unofficial-plugins
ie --manifest ./examples/manifests/package-delivery-emissions.yml --output ./examples/outputs/package-delivery-emissions.yml
```

This yields a result that looks like the following (saved to `/outputs/package-delivery-emissions.yml`):

focus on: 'package/estimated-delivery-emissions-g-co2e' 'battery/energy-consumption-kwh' 'battery/energy-source-renewable-percentage' 'battery/emissions-from-energy-g-co2e' 'battery/degradation-per-segment' 'vehicle/update-suggested-maintenance-interval-in-days'

```yaml
children:
  child:
    pipeline:
    - package-delivery-emissions
    defaults:
      grid/carbon-average-renewable-energy-percentage: 13
    inputs:
    - timestamp: '2023-12-12T00:00:00.000Z'
      route/id: 1
      route/segment-id: 23
      route/segment-current: 1
      route/segment-current-weight: 1000
      route/segment-current-road-type: highway
      route/segment-distance: 50
      route/segment-distance-unit: km
      route/segment-end-location-lat: 52.9244
      route/segment-end-location-lng: 5.09
      route/segment-real-time-speed: 70
      route/segment-real-time-speed-unit: km/h
      route/segment-start-location-lat: 52.3792
      route/segment-start-location-lng: 6.9003
      route/segment-total-count: 1
      package/id: 1
      package/volume: 50
      package/weight: 10
      package/delivery-location-lat: 51.5074
      package/delivery-location-lng: 0.1278
      package/delivery-location-state: in-transit
      package/delivery-location-delivery-time-per-package: 30
      battery/active-cell-materials: 'Lithium: 4782; Graphite: 19530; RareEarths:
        3949'
      battery/amount-charged-mah: 9911
      battery/battery-efficiency: 98
      battery/charge-cycle: 2952
      battery/chemistry: TeslaNewest
      battery/current-soc: 80
      battery/direct-carbon-emissions: 0
      battery/efficiency: 98
      battery/energy-efficiency-lost-power-kwh: 10
      battery/expected-charging-delay-in-minutes: 1
      battery/expected-efficiency: 97
      battery/expected-life-span-in-years: 8
      battery/expected-percentage-renewable-energy: 75
      battery/id: 1
      battery/max-capacity-mah: 49123
      battery/max-pack-voltage: 798
      battery/percentage-current-is-renewable: 60
      battery/production-location: China
      battery/soc-start: 84
      battery/soh: 98
      battery/soh-after-charge: 98
      battery/state: idle
      battery/structural-components: 'Aluminum: 1202234; Copper: 404827; Steel: 309427;
        Plastics: 76744'
      battery/temperature: 20
      battery/temperature-unit: celsius
      vehicle/battery-type: LFP
      vehicle/converter-efficiency: 91
      vehicle/cable-efficiency: 88
      vehicle/emissions-factor-g-co2e-per-unit: 0
      vehicle/emissions-factor-g-co2e-unit: kg
      vehicle/embodied-carbon-g-co2e: 0
      vehicle/expected-lifespan-in-years: 20
      vehicle/fuel-type: electric
      vehicle/id: 1
      vehicle/kwh-per-km: 0.15
      vehicle/manufacturer: EVEletric
      vehicle/materials-breakdown: 'Aluminum: 1202234; Copper: 404827; Steel: 309427;
        Plastics: 76744; Lithium: 133469; Graphite: 96257; RareEarths: 3949; Glass:
        499641; Rubber: 162123; Electronics: 163668; Fluids: 102662'
      vehicle/name: EV Van 1
      vehicle/resource-depletion-water-m3: 0
      vehicle/suggested-maintenance-interval-in-days: 90
      vehicle/type: van
      vehicle/weight: 6000
      vehicle/weight-unit: kg
      grid/id: 1
      grid/bio-percentage: 4
      grid/carbon-intensity-g-co2e-per-kwh: 1
      grid/coal-bituminous-percentage: 0
      grid/coal-sub-bituminous-percentage: 0
      grid/coal-lignite-percentage: 0
      grid/gas-percentage: 5
      grid/geothermal-percentage: 0
      grid/hydro-percentage: 0
      grid/nuclear-percentage: 20
      grid/oil-percentage: 10
      grid/solar-percentage: 20
      grid/wind-percentage: 40
      weather/id: 1
      weather/latitude: 51.5074
      weather/longitude: -0.1278
      weather/radius-in-meters: 1000
      weather/temperature-in-celsius: 15
      weather/rainfall-in-millimeter: 0
      weather/wind-speed-in-kmh: 25
      weather/wind-direction-in-degrees: 90
      weather/cloud-coverage-percentage: 5
      weather/visibility-in-meters: 1000
      weather/air-pressure-in-hectopascal: 1013
    outputs:
    - timestamp: '2023-12-12T00:00:00.000Z'
      route/id: 1
      route/segment-id: 23
      route/segment-current: 1
      route/segment-current-weight: 1000
      route/segment-current-road-type: highway
      route/segment-distance: 50
      route/segment-distance-unit: km
      route/segment-end-location-lat: 52.9244
      route/segment-end-location-lng: 5.09
      route/segment-real-time-speed: 70
      route/segment-real-time-speed-unit: km/h
      route/segment-start-location-lat: 52.3792
      route/segment-start-location-lng: 6.9003
      route/segment-total-count: 1
      package/id: 1
      package/volume: 50
      package/weight: 10
      package/delivery-location-lat: 51.5074
      package/delivery-location-lng: 0.1278
      package/delivery-location-state: in-transit
      package/delivery-location-delivery-time-per-package: 30
      battery/active-cell-materials: 'Lithium: 4782; Graphite: 19530; RareEarths:
        3949'
      battery/amount-charged-mah: 9911
      battery/battery-efficiency: 98
      battery/charge-cycle: 2952
      battery/chemistry: TeslaNewest
      battery/current-soc: 80
      battery/efficiency: 98
      battery/energy-efficiency-lost-power-kwh: 10
      battery/expected-charging-delay-in-minutes: 1
      battery/expected-efficiency: 97
      battery/expected-life-span-in-years: 8
      battery/expected-percentage-renewable-energy: 75
      battery/id: 1
      battery/max-capacity-mah: 49123
      battery/max-pack-voltage: 798
      battery/percentage-current-is-renewable: 60
      battery/production-location: China
      battery/soc-start: 84
      battery/soh: 98
      battery/soh-after-charge: 98
      battery/state: idle
      battery/structural-components: 'Aluminum: 1202234; Copper: 404827; Steel: 309427;
        Plastics: 76744'
      battery/temperature: 20
      battery/temperature-unit: celsius
      vehicle/battery-type: LFP
      vehicle/converter-efficiency: 91
      vehicle/cable-efficiency: 88
      vehicle/emissions-factor-g-co2e-unit: kg
      vehicle/expected-lifespan-in-years: 20
      vehicle/fuel-type: electric
      vehicle/id: 1
      vehicle/kwh-per-km: 0.15
      vehicle/manufacturer: EVEletric
      vehicle/materials-breakdown: 'Aluminum: 1202234; Copper: 404827; Steel: 309427;
        Plastics: 76744; Lithium: 133469; Graphite: 96257; RareEarths: 3949; Glass:
        499641; Rubber: 162123; Electronics: 163668; Fluids: 102662'
      vehicle/name: EV Van 1
      vehicle/suggested-maintenance-interval-in-days: 90
      vehicle/type: van
      vehicle/weight: 6000
      vehicle/weight-unit: kg
      grid/id: 1
      grid/bio-percentage: 4
      grid/carbon-intensity-g-co2e-per-kwh: 1
      grid/gas-percentage: 5
      grid/nuclear-percentage: 20
      grid/oil-percentage: 10
      grid/solar-percentage: 20
      grid/wind-percentage: 40
      weather/id: 1
      weather/latitude: 51.5074
      weather/longitude: -0.1278
      weather/radius-in-meters: 1000
      weather/temperature-in-celsius: 15
      weather/wind-speed-in-kmh: 25
      weather/wind-direction-in-degrees: 90
      weather/cloud-coverage-percentage: 5
      weather/visibility-in-meters: 1000
      weather/air-pressure-in-hectopascal: 1013
      grid/carbon-average-renewable-energy-percentage: 13
      package/estimated-delivery-emissions-g-co2e: 8.858965272856132
      battery/energy-consumption-kwh: 8.858965272856132
      battery/energy-source-renewable-percentage: 37.5
      battery/emissions-from-energy-g-co2e: 8.858965272856132
      battery/degradation-per-segment: 1.3333333333333335e-05
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
