import { Material } from "../../interfaces/enums/material";
import { MaterialQuantity } from "../../interfaces/materialQuantity";
import { FactoryEfficiency } from "./factoryEfficiency";

export class MaterialKnowledge {

    // Function to adjust quantities with external variation
    private applyVariationToMaterials(
        materials: MaterialQuantity[],
        variationFactors: number[]
    ): MaterialQuantity[] {
        // Ensure we have a variation factor for each material
        if (materials.length !== variationFactors.length) {
            throw new Error("Number of materials and variation factors must match");
        }

        return materials.map((material, index) => {
            const updatedAmount = material.amount * (1 + variationFactors[index]);
            const roundedAmount = Math.round(updatedAmount); // Round to nearest integer




            // Alternatively, you can use toFixed(0) to convert the number to a string with zero decimals
            // const roundedAmount = updatedAmount.toFixed(0);
            return {
                ...material,
                amount: roundedAmount
            };
        });
    }

    private simulateMaterialProduction(
        baseMaterialQuantities: MaterialQuantity[],
        minVariation: number,
        maxVariation: number
    ): MaterialQuantity[] {
        // Generate variation factors 
        const variationFactors = baseMaterialQuantities.map(() => this.getRandomVariationFactor(minVariation, maxVariation)
        );

        // Apply the variation
        const adjustedMaterialQuantities = this.applyVariationToMaterials(baseMaterialQuantities, variationFactors);

        return adjustedMaterialQuantities;
    }

    public getActiveCellMaterials(): MaterialQuantity[] {
        // Base material quantities without variation
        const baseMaterialQuantities: MaterialQuantity[] = [
            { material: Material.LITHIUM, amount: 2500 }, // Lithium is relatively scarce
            { material: Material.IRON, amount: 20000 }, // Iron is a major component of LFP
            { material: Material.PHOSPHATE, amount: 23000 }, // Phosphate is also plentiful
            { material: Material.GRAPHITE, amount: 10000 }, // Graphite for conductivity
            { material: Material.BINDER, amount: 800 }, // Increased slightly for larger cells
            { material: Material.CONDUCTIVE_ADDITIVE, amount: 600 }, // Also increased 
            { material: Material.ELECTROLYTE, amount: 15000 }, // Electrolyte is significant 
            { material: Material.SEPARATOR, amount: 500 }, // Increased, separators scale with cell size
        ];

        const dailyEfficiency: FactoryEfficiency = {
            equipmentStatus: 0.92, // Simulate slightly worn equipment
            workerSkill: 0.85,
            temperature: 28 // Within optimal range 
            // ... other factors as needed
        };

        const { minVariation, maxVariation } = this.calculateEfficiencyVariation(dailyEfficiency);

        // Apply the variation using our function
        return this.simulateMaterialProduction(baseMaterialQuantities, minVariation, maxVariation);
    }

    
    public getStructuralComponents(): MaterialQuantity[] {
        // Base material quantities without variation
        const baseMaterialQuantities: MaterialQuantity[] = [
            // Battery Structural Component Materials
            { material: Material.ALUMINUM, amount: 600000 }, // Cell casings, current collectors (anode), module frame, pack housing 
            { material: Material.COPPER, amount: 200000 }, // Current collectors (cathode), busbars
            { material: Material.STEEL, amount: 150000 }, // Pack housing (reinforcements), module components
            { material: Material.PLASTICS, amount: 40000 }, // Separator, minor internal components
        ];

        const dailyEfficiency: FactoryEfficiency = {
            equipmentStatus: 0.92, // Simulate slightly worn equipment
            workerSkill: 0.85,
            temperature: 28 // Within optimal range 
            // ... other factors as needed
        };

        const { minVariation, maxVariation } = this.calculateEfficiencyVariation(dailyEfficiency);

        // Apply the variation using our function
        return this.simulateMaterialProduction(baseMaterialQuantities, minVariation, maxVariation);
    }

    private calculateEfficiencyVariation(efficiency: FactoryEfficiency): { minVariation: number; maxVariation: number; } {
        const overallEfficiency = (efficiency.equipmentStatus + efficiency.workerSkill) / 3;

        // Example mapping - tighter variation around higher efficiency:
        if (overallEfficiency >= 0.9) {
            return { minVariation: 0.98, maxVariation: 1.02 };
        } else if (overallEfficiency >= 0.75) {
            return { minVariation: 0.95, maxVariation: 1.05 };
        } else {
            return { minVariation: 0.9, maxVariation: 1.1 }; // Wider variation for lower efficiency
        }
    }

    private getRandomVariationFactor(minFactor: number, maxFactor: number): number {
        return Math.random() * (maxFactor - minFactor) + minFactor;
    }

    public getMaterialBreakdown(): MaterialQuantity[] {
        // Base material quantities without variation
        const baseMaterialQuantities: MaterialQuantity[] = [
            // Structural
            { material: Material.STEEL, amount: 3500000 }, // ~58% of weight
            { material: Material.ALUMINUM, amount: 1000000 }, // ~17%


            // Powertrain 
            { material: Material.LITHIUM, amount: 70000 }, // ~1.2% 
            { material: Material.COBALT, amount: 15000 }, // ~0.25%
            { material: Material.NICKEL, amount: 40000 }, // ~0.7%
            { material: Material.COPPER, amount: 80000 }, // ~1.3%
            { material: Material.GRAPHITE, amount: 50000 }, // ~0.8%
            { material: Material.MANGANESE, amount: 8000 }, // ~0.15%
            { material: Material.RARE_EARTHS, amount: 2000 }, // ~0.03%


            // Interior
            { material: Material.PLASTICS, amount: 400000 }, // ~6.7%
            { material: Material.TEXTILES, amount: 50000 }, // ~0.8%


            // Other
            { material: Material.GLASS, amount: 250000 }, // ~ 4%
            { material: Material.RUBBER, amount: 80000 }, // ~1.3%
            { material: Material.ELECTRONICS, amount: 80000 }, // ~1.3%
            { material: Material.FLUIDS, amount: 50000 }, // ~0.8% 
        ];

        const dailyEfficiency: FactoryEfficiency = {
            equipmentStatus: 0.92, // Simulate slightly worn equipment
            workerSkill: 0.85,
            temperature: 28 // Within optimal range 
            // ... other factors as needed
        };

        const { minVariation, maxVariation } = this.calculateEfficiencyVariation(dailyEfficiency);

        // Apply the variation using our function
        return this.simulateMaterialProduction(baseMaterialQuantities, minVariation, maxVariation);
    }
}