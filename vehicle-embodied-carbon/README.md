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
          Lithium: 16
          Iron: 2
          Steel: 2.1
          Aluminum: 10
        waterUsageFactors:
          Lithium: 25000
          Iron: 50
          Steel: 60
          Aluminum: 200
        wasteFactors:
          Lithium: 
            manufacturing: 0.35
            endOfLife: 0.05
          Iron: 
            manufacturing: 0.15
            endOfLife: 0.1
          Steel: 
            manufacturing: 0.2
            endOfLife: 0.1
          Aluminum:
            manufacturing: 0.12
            endOfLife: 0.12
tree:
  children:
    child:
      pipeline:
        - vehicle-embodied-carbon
      config:
      inputs:
        - timestamp: 2024-03-26T14:28:30 
          vehicle/materials-breakdown: "Steel: 1850000; Aluminum: 750000"
          battery/active-cell-materials: "Lithium: 9000; Iron: 15000" 
          battery/structural-components: "Steel: 30000; Aluminum: 30000" 
```

You can run this by passing it to `ie`. Run impact using the following command run from the project root:

```sh
npm i -g @grnsft/if
npm i -g @grnsft/if-unofficial-plugins
ie --manifest ./examples/manifests/vehicle-embodied-carbon.yml --output ./examples/outputs/vehicle-embodied-carbon.yml
```

This yields a result that looks like the following (saved to `/outputs/vehicle-embodied-carbon.yml`):

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
          Lithium: 16
          Iron: 2
          Steel: 2.1
          Aluminum: 10
        waterUsageFactors:
          Lithium: 25000
          Iron: 50
          Steel: 60
          Aluminum: 200
        wasteFactors:
          Lithium: 
            manufacturing: 0.35
            endOfLife: 0.05
          Iron: 
            manufacturing: 0.15
            endOfLife: 0.1
          Steel: 
            manufacturing: 0.2
            endOfLife: 0.1
          Aluminum:
            manufacturing: 0.12
            endOfLife: 0.12
tree:
  children:
    child:
      pipeline:
        - vehicle-embodied-carbon
      config:
      inputs:
        - timestamp: 2024-03-26T14:28:30 
          vehicle/materials-breakdown: "Steel: 1850000; Aluminum: 750000"
          battery/active-cell-materials: "Lithium: 9000; Iron: 15000" 
          battery/structural-components: "Steel: 30000; Aluminum: 30000"
      outputs:
        - timestamp: "2024-03-26T14:28:30.000Z",
          vehicle/materials-breakdown: "Steel: 1850000; Aluminum: 750000",
          battery/active-cell-materials: "Lithium: 9000; Iron: 15000",
          battery/structural-components: "Steel: 30000; Aluminum: 30000",
          vehicle/embodied-carbon-g-co2e: 11922000,
          vehicle/resource-depletion-water-m3: 494.55,
          vehicle/manufacturing-waste-by-material: 
            vehicle/material-waste-Steel: 470000,
            vehicle/material-waste-Aluminum: 106363.63636363638,
            vehicle/material-waste-Lithium: 4846.153846153846,
            vehicle/material-waste-Iron: 2647.0588235294126 
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
