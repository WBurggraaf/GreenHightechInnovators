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
description: Calculates the impact of weather on the performance of a vehicle.
tags:
initialize:
  plugins:
    weather-impact-prediction:
      method: WeatherImpactPrediction
      path: "@grnsft/if-unofficial-plugins"
tree:
  children:
    child:
      pipeline:
        - weather-impact-prediction
      config:
      inputs:
        - timestamp: 2024-03-26T14:28:30 
          grid/bio-percentage: 10
          grid/carbon-intensity-g-co2e-per-kwh:  1
          grid/coal-bituminous-percentage: 0
          grid/coal-sub-bituminous-percentage: 0
          grid/coal-lignite-percentage: 0
          grid/gas-percentage: 10
          grid/geothermal-percentage: 0
          grid/hydro-percentage: 0
          grid/nuclear-percentage: 20
          grid/oil-percentage: 10
          grid/solar-percentage: 20
          grid/wind-percentage: 30
          weather/latitude: 52.37403000
          weather/wind-speed-in-kmh: 32
          weather/cloud-coverage-percentage: 70 
          weather/temperature-in-celsius: 21
          vehicle/fuel-type: 'electric'
          vehicle/battery-type: 'LithiumIronPhosphate'
```

You can run this by passing it to `ie`. Run impact using the following command run from the project root:

```sh
npm i -g @grnsft/if
npm i -g @grnsft/if-unofficial-plugins
ie --manifest ./examples/manifests/weather-impact-prediction.yml --output ./examples/outputs/weather-impact-prediction.yml
```

This yields a result that looks like the following (saved to `/outputs/weather-impact-prediction.yml`):

```yaml
name: weather-impact-prediction
description: Calculates the impact of weather on the performance of a vehicle.
tags:
initialize:
  plugins:
    weather-impact-prediction:
      method: WeatherImpactPrediction
      path: "@grnsft/if-unofficial-plugins"
tree:
  children:
    child:
      pipeline:
        - weather-impact-prediction
      config:
      inputs:
        - timestamp: 2024-03-26T14:28:30 
          grid/bio-percentage: 10
          grid/carbon-intensity-g-co2e-per-kwh:  1
          grid/coal-bituminous-percentage: 0
          grid/coal-sub-bituminous-percentage: 0
          grid/coal-lignite-percentage: 0
          grid/gas-percentage: 10
          grid/geothermal-percentage: 0
          grid/hydro-percentage: 0
          grid/nuclear-percentage: 20
          grid/oil-percentage: 10
          grid/solar-percentage: 20
          grid/wind-percentage: 30
          weather/latitude: 52.37403000
          weather/wind-speed-in-kmh: 32
          weather/cloud-coverage-percentage: 70 
          weather/temperature-in-celsius: 21
          vehicle/fuel-type: 'electric'
          vehicle/battery-type: 'LithiumIronPhosphate'
    outputs: 
        - timestamp: 2024-03-26T14:28:30.000Z
          grid/bio-percentage: 10
          grid/carbon-intensity-g-co2e-per-kwh: 948562.56
          grid/coal-bituminous-percentage: 0
          grid/coal-sub-bituminous-percentage: 0
          grid/coal-lignite-percentage: 0
          grid/gas-percentage: 10
          grid/geothermal-percentage: 0
          grid/hydro-percentage: 0
          grid/nuclear-percentage: 20
          grid/oil-percentage: 10
          grid/solar-percentage: 20
          grid/wind-percentage: 30
          weather/latitude: 52.37403
          weather/wind-speed-in-kmh: 32
          weather/cloud-coverage-percentage: 70
          weather/temperature-in-celsius: 21
          vehicle/fuel-type: 'electric'
          vehicle/battery-type: 'LithiumIronPhosphate'
          battery/expected-efficiency: 0.8719399999999999
          
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
