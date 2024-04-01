import { PluginParams } from "../../../types";
import { Material } from "../interfaces/enums/material";
import { MaterialQuantity } from "../interfaces/materialQuantity";


export class Battery {
   id: number = 0;

   chemistry: String = '';
   productionLocation: String = '';
   expectedLifeSpanInYears: number = 0;
   activeCellMaterials: MaterialQuantity[] = [];
   structuralComponents: MaterialQuantity[] = [];

   maxCapacityMAh: number = 0;

   static toModel(inputData: PluginParams): Battery {
      let battery = new Battery();

      battery.id = inputData['battery/id'];

      battery.chemistry = inputData['battery/chemistry'];
      battery.productionLocation = inputData['battery/production-location'];
      battery.expectedLifeSpanInYears = inputData['battery/expected-life-span-in-years'];

      const activeCellMaterialsString = inputData['battery/active-cell-materials'];
      battery.activeCellMaterials = parseMaterialsString(activeCellMaterialsString);

      const structuralComponentsString = inputData['battery/structural-components'];
      battery.structuralComponents = parseMaterialsString(structuralComponentsString);

      battery.maxCapacityMAh = inputData['max-capacity-mAh'];

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