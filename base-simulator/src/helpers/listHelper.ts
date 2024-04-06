import { Material } from "../interfaces/enums/material";
import { MaterialQuantity } from "../interfaces/materialQuantity";

export class ListHelper {
    static parseMaterialsString(materialsBreakdownString: string): MaterialQuantity[] {
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

    static parseMaterialsQuantityToString(materials: MaterialQuantity[]): string {
        let materialQuantityString = '';

        materials.forEach((material, index) => {
            materialQuantityString += `${material.material}: ${material.amount}`;

            if (index !== materials.length - 1) {
                materialQuantityString += '; ';
            }
        });

        return materialQuantityString;
    }
}