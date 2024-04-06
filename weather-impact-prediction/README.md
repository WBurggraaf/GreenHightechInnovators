# Weather Impact Prediction

> [!NOTE] > `Weather Impact Prediction` is a community plugin, not part of the IF standard library. This means the IF core team are not closely monitoring these plugins to keep them up to date. You should do your own research before implementing them!

# Parameters

## Plugin global config

- `powerSource`: All the different powersources that can be used for emissions calculations.
  - `solar` - Grams of carbon emitted by solar per kw/h
  - `wind` - Grams of carbon emitted by wind per kw/h
  - `geothermal` - Grams of carbon emitted by geothermal per kw/h
  - `hydro` - Grams of carbon emitted by hydro per kw/h
  - `nuclear` - Grams of carbon emitted by nuclear per kw/h
  - `bio` - Grams of carbon emitted by bio gas per kw/h
  - `oil` - Grams of carbon emitted by oil per kw/h
  - `gas` - Grams of carbon emitted by gas per kw/h
  - `coalBituminous` - Grams of carbon emitted by Bituminous coal per kw/h
  - `coalSubBituminous` - Grams of carbon emitted by SubBituminous coal per kw/h
  - `coalLignite` - Grams of carbon emitted by Lignite coal per kw/h

- `SolarStats`: All the different stats that are used for calculation solar production
  - `efficiencyMonthlyNorthernHemisphere` - How efficient solar pannels are in the northern hemisphere per month.
    - `[Month]`: `[Montly Efficiency]` - The month in full and the efficiency factor where 1.00 is 100% efficient.
  - `efficiencyMonthlySouthernHemisphere` - How efficient solar pannels are in the southern hemisphere per month.
    - `[Month]`: `[Montly Efficiency]` - The month in full and the efficiency factor where 1.00 is 100% efficient.
  - `efficiencyPerHour` - How efficient a solar pannel is per hour.
    - `[Time in hours]`: `[Hourly efficiency]` - The hour in military time (0-24) and the efficiency factor where 1.00 is 100% efficient.

## Inputs

- `grid/solar-percentage`: Percentage of current energy being produced by solar.
- `grid/wind-percentage`: Percentage of current energy being produced by wind.
- `grid/geothermal-percentage`: Percentage of current energy being produced by geothermal.
- `grid/hydro-percentage`: Percentage of current energy being hydro electric.
- `grid/nuclear-percentage`: Percentage of current energy being produced by nuclear.
- `grid/bio-percentage`: Percentage of current energy being produced using bio gas.
- `grid/oil-percentage`: Percentage of current energy being produced using oil.
- `grid/gas-percentage`: Percentage of current energy being produced using fosil gas.
- `grid/coal-bituminous-percentage`: Percentage of current energy being produced using bitumous coal.
- `grid/coal-sub-bituminous-percentage`: Percentage of current energy being produced using sub bitumous coal.
- `grid/coal-lignite-percentage`: Percentage of current energy being produced using lignite coal.
- `weather/latitude`: Latitude of where the weather is measured.
- `weather/wind-speed-in-kmh`: Windspeed in kmh of the weather location.
- `weather/cloud-coverage-percentage`: Percentage cloud coverage of the weather location.
- `weather/temperature-in-celsius`: Temperature of location in celcius.
- `vehicle/fuel-type`: What type of fuel the car uses.
- `vehicle/battery-type`: What battery type the electic car uses.

`vehicle/battery-type` and `vehicle/fuel-type` have restricted input.
`vehicle/battery-type` accepts the following values: `LithiumIronPhosphate` and `LithiumNickelManganeseCobalt`
`vehicle/fuel-type` accepts the following values: `electric`, `benzine`, `diesel` and `hybrid`.

## Returns

- `grid/carbon-intensity-g-co2e-per-kwh`: The amount of carbon that is edmitted per Kw/h of electricity.
- `battery/expected-efficiency`: Expected efficiency of the batteries based on chemistry.

# IF Implementation

IF utilizes the Weather impact prediction Framework to calculate grid emissions and battery efficiency by temperature.

The Weather impact prediction Framework is a community plugin, not part of the IF standard library. This means the IF core team are not closely monitoring these plugins to keep them up to date. You should do your own research before implementing them!

## Usage

In IF the plugin is called from an `manifest`. An `manifest` is a `.yaml` file that contains configuration metadata and usage inputs. This is interpreted by the command line tool, `ie`.

Each input is expected to contain `grid/solar-percentage`, `grid/wind-percentage`, `grid/geothermal-percentage`, `grid/hydro-percentage`, `grid/nuclear-percentage`, `grid/bio-percentage`, `grid/oil-percentage`, `grid/gas-percentage`, `grid/coal-bituminous-percentage`, `grid/coal-sub-bituminous-percentage`, `grid/coal-lignite-percentage`, `weather/latitude`, `weather/wind-speed-in-kmh`, `weather/cloud-coverage-percentage`, `weather/temperature-in-celsius`, `vehicle/fuel-type` and `vehicle/battery-type`.

## Manifest

The following is an example of how Weather Impact Predition can be invoked using an `manifest`.

```yaml
name: weather-impact-prediction
description: Calculates the embodied carbon emissions associated with a vehicle's
  production.
tags: 
initialize:
  plugins:
    weather-impact-prediction:
      method: WeatherImpactPrediction
      path: "@grnsft/if-unofficial-plugins"
      global-config:
        solarStats:
          efficiencyMonthlyNorthernHemisphere:
            january: 0.49  # Low efficiency due to shorter days and lower sun angle in winter
            february: 0.61   # Increased efficiency as days lengthen and sun angle improves
            march: 0.75      # Further efficiency gains leading towards spring
            april: 0.88      # Approaching peak solar efficiency 
            may: 0.94        # Close to optimal solar production
            june: 0.99       # Peak solar efficiency during summer solstice
            july: 1          # Maximum theoretical efficiency under ideal conditions
            august: 0.94     # Slight efficiency drop as days begin to shorten 
            september: 0.85  # Noticeable efficiency decline as fall approaches
            october: 0.68    # Further efficiency drops as sun angle lowers
            november: 0.53   # Efficiency decreases as days shorten
            december: 0.43   # Lowest efficiency during winter solstice
          efficiencyMonthlySouthernHemisphere:
            january: 1          # Peak efficiency during Southern Hemisphere summer
            february: 0.94      # Slight drop in efficiency, but still high
            march: 0.85         # Efficiency remains good as autumn approaches
            april: 0.68         # Noticeable efficiency decline as days shorten
            may: 0.53           # Further efficiency drop with the approach of winter
            june: 0.43          # Lowest efficiency during the winter solstice
            july: 0.49          # Efficiency begins to increase as days lengthen
            august: 0.61        # Increased efficiency as spring approaches
            september: 0.75     # Significant efficiency gains
            october: 0.88       # Approaching peak efficiency towards summer
            november: 0.94      # Close to optimal solar production
            december: 0.99      # Peak efficiency during summer solstice 
          efficiencyPerHour:
            '0': 0         # Zero solar output at midnight
            '1': 0         # Zero output in the very early morning
            '2': 0         # ...
            '3': 0         
            '4': 0         
            '5': 0         # Minimal output at dawn
            '6': 0.04      # Gradual increase in efficiency as the sun rises
            '7': 0.08      # ...
            '8': 0.14      # ...
            '9': 0.32      # Noticeable increase in efficiency
            '10': 0.5      # Significant output approaching midday
            '11': 0.65     # ...
            '12': 0.7      # Strong output around midday 
            '13': 0.85     # Potentially peak output early afternoon
            '14': 0.91     # ...  
            '15': 0.8      # Slight decline in efficiency 
            '16': 0.75     # ...
            '17': 0.68     # Decreased efficiency as the sun sets
            '18': 0.33     # ...
            '19': 0.04     # Minimal output at dusk
            '20': 0        # Zero output during nighttime 
            '21': 0        # ...
            '22': 0        # ...
            '23': 0        # ...
            '24': 0        # Zero output at midnight (repeating the cycle)
        powerSource:
          solar: 41         # Amount of energy sourced from solar (units need context)
          wind: 11          # ...  
          geothermal: 38    # ...
          hydro: 4          # ...
          nuclear: 12       # ...
          bio: 230          # ...
          oil: 840          # High output from oil, indicating a less sustainable mix
          gas: 490          # Significant reliance on gas
          coalBituminous: 740   # ...
          coalSubBituminous: 1024 # ...
          coalLignite: 1689     # Largest contribution from the most polluting coal type 
        options:
          optionPlaceHolder: 0.6
tree:
  children:
    child:
      pipeline:
      - weather-impact-prediction
      config: 
      inputs:
      - timestamp: '2024-03-26T14:28:30.000Z'
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

        # Battery-specific parameters
        battery/active-cell-materials: 'Lithium: 4782; Graphite: 19530; RareEarths: 3949'  # Materials within the battery cells 
        battery/amount-charged-mah: 9911  # Needs context of full battery capacity
        battery/battery-efficiency: 98  # Excellent efficiency during charge/discharge
        battery/charge-cycle: 2952  # Number of charge/discharge cycles 
        battery/chemistry: TeslaNewest  # Likely a proprietary LFP-based Tesla chemistry
        battery/current-soc: 84  # Current state of charge (%)
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
        battery/state: charging 
        battery/structural-components: 'Aluminum: 1202234; Copper: 404827; Steel: 309427; Plastics: 76744' 
        battery/temperature: 20  # Battery temperature in Celsius
        battery/temperature-unit: celsius" 
```

You can run this by passing it to `ie`. Run impact using the following command run from the project root:

```sh
npm i -g @grnsft/if
npm i -g @grnsft/if-unofficial-plugins
ie --manifest ./examples/manifests/weather-impact-prediction.yml --output ./examples/outputs/weather-impact-prediction.yml
```

This yields a result that looks like the following (saved to `/outputs/weather-impact-prediction.yml`):

focus on:
'grid/carbon-intensity-g-co2e-per-kwh'
'battery/expected-efficiency'

```yaml
children:
  child:
    pipeline:
    - weather-impact-prediction
    config: 
    inputs:
    - timestamp: '2024-03-26T14:28:30.000Z'
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
      battery/active-cell-materials: 'Lithium: 4782; Graphite: 19530; RareEarths:
        3949'
      battery/amount-charged-mah: 9911
      battery/battery-efficiency: 98
      battery/charge-cycle: 2952
      battery/chemistry: TeslaNewest
      battery/current-soc: 84
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
      battery/state: charging
      battery/structural-components: 'Aluminum: 1202234; Copper: 404827; Steel: 309427;
        Plastics: 76744'
      battery/temperature: 20
      battery/temperature-unit: celsius
    outputs:
    - timestamp: '2024-03-26T14:28:30.000Z'
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
      grid/id: 1
      grid/bio-percentage: 4
      grid/carbon-intensity-g-co2e-per-kwh: 269440
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
      battery/active-cell-materials: 'Lithium: 4782; Graphite: 19530; RareEarths:
        3949'
      battery/amount-charged-mah: 9911
      battery/battery-efficiency: 98
      battery/charge-cycle: 2952
      battery/chemistry: TeslaNewest
      battery/current-soc: 84
      battery/direct-carbon-emissions: 0
      battery/efficiency: 98
      battery/energy-efficiency-lost-power-kwh: 10
      battery/expected-charging-delay-in-minutes: 1
      battery/expected-efficiency: 0.03
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
      battery/state: charging
      battery/structural-components: 'Aluminum: 1202234; Copper: 404827; Steel: 309427;
        Plastics: 76744'
      battery/temperature: 20
      battery/temperature-unit: celsius
```

## TypeScript

You can see example Typescript invocations for each plugin below.

```typescript
import {WeatherImpactPrediction} from '@grnsft/if-unofficial-plugins';

const weatherImpactPrediction = WeatherImpactPrediction();
const results = await weatherImpactPrediction.execute(
  [
    {
        'timestamp': '2024-03-26T14:28:30.000Z',
        'grid/bio-percentage': 10,
        'grid/carbon-intensity-g-co2e-per-kwh': 1,
        'grid/coal-bituminous-percentage': 0,
        'grid/coal-sub-bituminous-percentage': 0,
        'grid/coal-lignite-percentage': 0,
        'grid/gas-percentage': 10,
        'grid/geothermal-percentage': 0,
        'grid/hydro-percentage': 0,
        'grid/nuclear-percentage': 20,
        'grid/oil-percentage': 10,
        'grid/solar-percentage': 20,
        'grid/wind-percentage': 30,
        'weather/latitude': 52.37403,
        'weather/wind-speed-in-kmh': 32,
        'weather/cloud-coverage-percentage': 70,
        'weather/temperature-in-celsius': 21,
        'vehicle/fuel-type': 'electric',
        'vehicle/battery-type': 'LithiumIronPhosphate'
    },
  ]
);
```
