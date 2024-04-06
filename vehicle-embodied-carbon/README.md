# Vehicle Embodied Carbon

> [!NOTE] > `Vehicle Embodied Carbon` is a community plugin, not part of the IF standard library. This means the IF core team are not closely monitoring these plugins to keep them up to date. You should do your own research before implementing them!

# Parameters

## Plugin global config

- `emissionsFactors`: A collection of materials with their emissions factor.
  - [Material-Name]: [Emissions-Factor] - The material name and the emissions factor that matterial has
- `waterUsageFactors`:
  - [Material-Name]: [Water-Usage-Factor] - The material name and the water usage factor.
- `wasteFactors`: Collection of materials that leave waste behind.
  - [Material-Name] - The name of the material that has waste factors.
    - manufacturing - The material factor that is left over after manufactoring.
    - endOfLife - The material factor that can't be recycled.

## Inputs

- `vehicle/materials-breakdown`: All the different materials that go into making a vehicle
- `battery/active-cell-materials`: All the materials that go into making all the cells that go into the battery pack.
- `battery/structural-components`: All the materials that are needed to make the battery pack without the material that goes into active cell components.

The 3 inputs above all need a list. The list is based on a key value pair. The input is structured as followed: `[material Name]: [weight of material in grams]` When there is more then 1 material it's seperated with a semicolon.

## Returns

- `vehicle/embodied-carbon-g-co2e`: The amount of carbon that is embodies into the vehicle from manufactoring.
- `vehicle/resource-depletion-water-m3`: The amount of water that is needed build the vehicle.
- `vehicle/manufacturing-waste-by-material`: The leftover materials after the vehicle is manufactured.

# IF Implementation

IF utilizes the Vehicle embodied carbon Framework to calculate the carbon emissions and waste materials.

The Vehicle embodied carbon Framework is a community plugin, not part of the IF standard library. This means the IF core team are not closely monitoring these plugins to keep them up to date. You should do your own research before implementing them!

## Usage

In IF the plugin is called from an `manifest`. An `manifest` is a `.yaml` file that contains configuration metadata and usage inputs. This is interpreted by the command line tool, `ie`.

The plugin should have a list of material properties in the global config. This includes `Emissions factors`, ` Water usage factors` and `Waste factors`.

Each input is expected to contain `vehicle/materials-breakdown`, `battery/active-cell-materials` and `battery/structural-components` fields.

These fields expect you to have a key value pair list as described in the inputs section of the readme.

## Manifest

The following is an example of how Vehicle Embodied Carbon can be invoked using an `manifest`.

```yaml
name: vehicle-embodied-carbon
description: Calculates the embodied carbon emissions associated with a vehicle's production.
tags:
initialize:
  plugins:
    vehicle-embodied-carbon:
      method: VehicleEmbodiedCarbon
      path: "@grnsft/if-unofficial-plugins"
      global-config:
        emissionsFactors:
          Lithium: 16 # High embodied carbon from energy-intensive extraction and processing
          Iron: 2 # Relatively low embodied carbon compared to other metals
          Phosphate: 4 # Moderate embodied carbon, varies by mining/processing method
          Graphite: 5.5 # Can have high embodied carbon, especially for synthetic graphite
          Binder: 3 # Embodied carbon depends on binder type (bio-based vs. petroleum-based)
          ConductiveAdditive: 4 # Embodied carbon likely dominated by carbon black production
          Electrolyte: 5 # Embodied carbon depends on the specific electrolyte composition
          Separator: 3 # Embodied carbon depends on material (e.g., polymer separators)
          Steel: 2.1 # Moderate embodied carbon, can be reduced through recycled content
          Aluminum: 10 # Very high embodied carbon, focus for factory energy efficiency & sourcing
          Copper: 3 # Moderate embodied carbon, recycling can significantly reduce impact
          Plastics: 2.3 # Varies greatly by plastic type, bioplastics offer lower embodied carbon 
          Glass: 1.8 # Moderate embodied carbon, energy-intensive manufacturing process
          Rubber: 4 # Moderate embodied carbon from extraction & processing, bio-based options exist
          RareEarths: 15 # Extremely high embodied carbon due to complex, energy-intensive extraction
          Electronics: 6 # Embodied carbon dominated by component manufacturing
          Textiles: 4 # Varies by fiber & process, natural fibers can have lower embodied carbon 
          Fluids: 3 # Embodied carbon depends on specific fluid type and production
          SpecializedAlloys: 5 # Varies drastically by alloy, composition matters for embodied carbon

        waterUsageFactors:
          Lithium: 25000 # High water use impacts factory siting, wastewater treatment is crucial
          Iron: 50 # Relatively low impact on factory water use
          Phosphate: 800 # Water use varies with method, impacts factory water sourcing & treatment
          Graphite: 2000 # Water use for synthetic graphite production, closed-loop systems help
          Binder: 500 # Water-based binders increase factory water use and treatment needs
          ConductiveAdditive: 300 # Likely minimal impact on factory water use
          Electrolyte: 200 # Water use in electrolyte production & impacts factory processes
          Separator: 300 # Water use impacts depend on separator type & factory processes 
          Steel: 60 # Significant water use in steelmaking, recycling reduces factory water demand
          Aluminum: 200 # Very high water use; factory water efficiency & recycling are critical
          Copper: 70  # Moderate impact on factory water use 
          Plastics: 500 # Water use varies by plastic type, impacts factory processes 
          Glass: 1500 # Significant water use, water recycling important in factory operations
          Rubber: 800 # Water used in processing, impacts factory water management
          RareEarths: 4000 #  Water use varies, but often high due to extraction methods
          Electronics: 1500 # Water use in component manufacturing, impacts factory processes
          Textiles: 1000 # Water use highly dependent on fiber & process, focus for factory efficiency
          Fluids: 100 # Minimal impact unless fluids are water-based 
          SpecializedAlloys: 300 # Water use depends on alloy composition and production processes

        wasteFactors:
          Lithium: 
            manufacturing: 0.35 # Waste impacts factory processes, focus on material efficiency
            endOfLife: 0.05 # Lack of recycling increases embodied carbon of new materials
          Iron: 
            manufacturing: 0.15 # High recyclability reduces embodied carbon of new steel
            endOfLife: 0.1  # Recycling is key to minimizing embodied carbon from iron use
          Phosphate: 
            manufacturing: 0.4 # Impacts factory waste streams, use in fertilizer can offset embodied carbon
            endOfLife: 0.05 # Low-impact if repurposed, otherwise contributes to landfill
          Graphite: 
            manufacturing: 0.55 # Waste impacts factory processes, focus on material efficiency
            endOfLife: 0.06 # Potential for reuse or downcycling, low embodied carbon impact at end-of-life 
          Binder: 
            manufacturing: 0.3  # Waste from binder production impacts factory processes 
            endOfLife: 0.2 # Biodegradable binders reduce embodied carbon impact at end-of-life
          ConductiveAdditive: 
            manufacturing: 0.2  # Waste generation likely minimal, but impacts factory processes
            endOfLife: 0.1 # Difficult to recover, potentially increasing embodied carbon of new materials
          Electrolyte: 
            manufacturing: 0.3 # Waste impacts factory processes, solvent recovery is important
            endOfLife: 0.1 # Potential for recovery/recycling to offset embodied carbon of new electrolytes
          Separator: 
            manufacturing: 0.3 #  Waste impacts factory processes, material efficiency is key
            endOfLife: 0.2 # Recycling potential varies, landfill increases embodied carbon  
          Steel: 
            manufacturing: 0.2 # Efficient processes minimize waste & associated embodied carbon
            endOfLife: 0.1 # High recycling rates significantly reduce embodied carbon 
          Aluminum:
            manufacturing: 0.12 # Improved technology reduces waste & embodied carbon
            endOfLife: 0.12 # Challenges in recycling increase the embodied carbon of new aluminum 
          Copper:
            manufacturing: 0.15 # Scrap recovery reduces waste & associated embodied carbon
            endOfLife: 0.01 # Efficient recycling minimizes embodied carbon of new copper 
          Plastics:
            manufacturing: 0.8 # Waste can be high, focus on material efficiency & bioplastics 
            endOfLife: 0.3 # Low recycling rates increase embodied carbon of new plastics
          Glass:
            manufacturing: 0.7 # Energy efficiency reduces waste & associated embodied carbon
            endOfLife: 0.1 # More established recycling reduces embodied carbon of new glass 
          Rubber: 
            manufacturing: 0.4 # Waste depends on process, impacts factory efficiency & embodied carbon
            endOfLife: 0.2 # Options for downcycling, but landfill increases embodied carbon burden
          RareEarths: 
            manufacturing: 0.5 # Complex extraction generates waste with high embodied carbon
            endOfLife: 0.03 #  Potential for recovery, but unclear processes increase embodied carbon risk
          Electronics: 
            manufacturing: 0.3 # Impacts factory waste streams, component-level design for reuse matters
            endOfLife: 0.2 # E-waste recycling is critical to offset embodied carbon of new electronics
          Textiles: 
            manufacturing: 0.3 # Impacts factory waste streams, varies by fiber & process
            endOfLife: 0.4 # Landfill, downcycling increase embodied carbon; focus on reuse/recycling
          Fluids: 
            manufacturing: 0.1 # Minimal embodied carbon impact from waste unless fluid production is complex
            endOfLife: 0.3 # Disposal methods impact embodied carbon (incineration vs. landfill)
          SpecializedAlloys: 
            manufacturing: 0.3 # Waste & embodied carbon highly dependent on alloy composition
            endOfLife: 0.2 # Recyclability depends on alloy, impacts embodied carbon of new alloys
      
        options:
          optionPlaceHolder: 0.6
tree:
  children:
    child:
      pipeline:
        - vehicle-embodied-carbon
      config:
      inputs:
        - timestamp: 2024-03-26T14:28:30 
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
ie --manifest ./examples/manifests/vehicle-embodied-carbon.yml --output ./examples/outputs/vehicle-embodied-carbon.yml
```

This yields a result that looks like the following (saved to `/outputs/vehicle-embodied-carbon.yml`):

focus on:
'vehicle/embodied-carbon-g-co2e'
'vehicle/resource-depletion-water-m3'
'vehicle/manufacturing-waste-by-material'

```yaml
children:
  child:
    pipeline:
    - vehicle-embodied-carbon
    config: 
    inputs:
    - timestamp: '2024-04-06T00:00:00.0000'
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
    - timestamp: '2024-04-06T00:00:00.0000'
      vehicle/battery-type: LFP
      vehicle/converter-efficiency: 91
      vehicle/cable-efficiency: 88
      vehicle/emissions-factor-g-co2e-per-unit: 0
      vehicle/emissions-factor-g-co2e-unit: kg
      vehicle/embodied-carbon-g-co2e: 33812942.099999994
      vehicle/expected-lifespan-in-years: 20
      vehicle/fuel-type: electric
      vehicle/id: 1
      vehicle/kwh-per-km: 0.15
      vehicle/manufacturer: EVEletric
      vehicle/materials-breakdown: 'Aluminum: 1202234; Copper: 404827; Steel: 309427;
        Plastics: 76744; Lithium: 133469; Graphite: 96257; RareEarths: 3949; Glass:
        499641; Rubber: 162123; Electronics: 163668; Fluids: 102662'
      vehicle/name: EV Van 1
      vehicle/resource-depletion-water-m3: 5474.2217200000005
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
      vehicle/manufacturing-waste-by-material:
        vehicle/material-waste-Aluminum: 327882
        vehicle/material-waste-Copper: 142880.1176470588
        vehicle/material-waste-Steel: 154713.5
        vehicle/material-waste-Plastics: 613952.0000000001
        vehicle/material-waste-Lithium: 74442.84615384614
        vehicle/material-waste-Graphite: 141517.44444444447
        vehicle/material-waste-Glass: 1165828.9999999998
        vehicle/material-waste-Rubber: 108082
        vehicle/material-waste-Electronics: 70143.42857142858
        vehicle/material-waste-Fluids: 11406.88888888889
```

## TypeScript

You can see example Typescript invocations for each plugin below.

```typescript
import {VehicleEmbodiedCarbon} from '@grnsft/if-unofficial-plugins';

const globalConfig = {
  emissionsFactors: {
    Lithium: 16,
    Iron: 2,
    Steel: 2.1,
    Aluminum: 10
  },
  waterUsageFactors: {
    Lithium: 25000,
    Iron: 50,
    Steel: 60, 
    Aluminum: 200 
  }, 
  wasteFactors: {
    Lithium: {
      manufacturing: 0.35
      endOfLife: 0.05
    }
    Iron: { 
      manufacturing: 0.15
      endOfLife: 0.1
    }
   Steel: { 
      manufacturing: 0.2
      endOfLife: 0.1
   }
   Aluminum: {
      manufacturing: 0.12
      endOfLife: 0.12
   }
  },
};
const vehicleEmbodiedCarbon = VehicleEmbodiedCarbon(globalConfig);
const results = await vehicleEmbodiedCarbon.execute(
  [
    {
      timestamp: '2021-01-01T00:00:00Z', // ISO8601 / RFC3339 timestamp
      'vehicle/materials-breakdown': '"Steel: 1850000; Aluminum: 750000"', 
      'battery/active-cell-materials': 'Lithium: 9000; Iron: 15000',
      'battery/structural-components': 'Steel: 30000; Aluminum: 30000'
    },
  ]
);
```
