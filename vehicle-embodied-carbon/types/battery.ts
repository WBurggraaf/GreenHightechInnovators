import { PluginParams } from "../../../types";
import { Material } from "../interfaces/enums/material";
import { MaterialQuantity } from "../interfaces/materialQuantity";

export class Battery {
    activeCellMaterials: MaterialQuantity[] = [];
    chemistry: String = '';
    directCarbonEmissions: number = 0;
    expectedLifeSpanInYears: number = 0;
    id: number = 0;
    maxCapacityMah: number = 0;
    productionLocation: String = '';
    structuralComponents: MaterialQuantity[] = [];

   static toModel(inputData: PluginParams): Battery {
      let battery = new Battery();

      const activeCellMaterialsString = inputData['battery/active-cell-materials'];
      battery.activeCellMaterials = parseMaterialsString(activeCellMaterialsString);
      battery.chemistry = inputData['battery/chemistry'];
      battery.directCarbonEmissions = inputData['battery/direct-carbon-emissions'];
      battery.expectedLifeSpanInYears = inputData['battery/expected-life-span-in-years'];
      battery.id = inputData['battery/id'];
      battery.maxCapacityMah = inputData['battery/max-capacity-mah'];
      battery.productionLocation = inputData['battery/production-location'];
      const structuralComponentsString = inputData['battery/structural-components'];
      battery.structuralComponents = parseMaterialsString(structuralComponentsString);

      return battery;
   }
}

//Dupe I know.
function parseMaterialsString(materialsBreakdownString: string): MaterialQuantity[] {
    const materialsBreakdown: MaterialQuantity[] = [];

    const lines = materialsBreakdownString.split(';');

    for (let lineCount = 0; lineCount < lines.length; lineCount++) {
        const line = lines[lineCount].trim();
        const parts = line.split(': ');

        if (parts.length !== 2) {
            console.error(`Invalid format on line ${lineCount + 1}: ${line}`);
            continue;
        }

        const [materialStr, amountStr] = parts;

        try {
            const materialKey = materialStr.toUpperCase() as keyof typeof Material;
            const material = Material[materialKey];

            const amount = parseFloat(amountStr); // Assumes input is in grams

            materialsBreakdown.push({ material, amount });
        } catch (error) {
            console.error(`Error parsing line ${lineCount + 1}: ${line}`, error);
        }
    }

    return materialsBreakdown;
}