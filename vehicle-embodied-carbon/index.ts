import { PluginInterface } from '../../interfaces';
import { ConfigParams, PluginParams } from '../../types/common';
import { Vehicle } from './types/vehicle';
import { Battery } from './types/battery';
import { MaterialQuantity } from './interfaces/materialQuantity';
import { CriticalMaterialWasteOutput } from './interfaces/CriticalMaterialWasteOutput';

export const VehicleEmbodiedCarbon = (globalConfig?: ConfigParams): PluginInterface => {
    const metadata = { kind: 'execute' };

    async function execute(inputs: PluginParams[]) {
        return inputs.map(input => {

            const vehicle = Vehicle.toModel(input);
            const battery = Battery.toModel(input);

            const materialEmissions = calculateEmbodiedEmissions(vehicle.materialsBreakdown, globalConfig?.emissionsFactors);
            const batteryActiveCellMaterialsEmissions = calculateEmbodiedEmissions(battery.activeCellMaterials, globalConfig?.emissionsFactors);
            const batteryStructuralComponentsEmissions = calculateEmbodiedEmissions(battery.structuralComponents, globalConfig?.emissionsFactors);

            const embodiedCarbon = materialEmissions + batteryActiveCellMaterialsEmissions + batteryStructuralComponentsEmissions;

            const resourceDepletionWaterM3 = calculateWaterDepletion(vehicle, battery, globalConfig?.waterUsageFactors) / 1000;

            const criticalMaterialDepletion = calculateCriticalMaterialWaste(
                vehicle, battery, globalConfig?.wasteFactors
            );

            return {
                ...input,
                'vehicle/embodied-carbon-g-co2e': embodiedCarbon,
                'vehicle/resource-depletion-water-m3': resourceDepletionWaterM3,
                'vehicle/manufacturing-waste-by-material': criticalMaterialDepletion,
            };
        });
    }

    /**
     * Calculates carbon emissions that are emitted while producing the vehicle
     */
    function calculateEmbodiedEmissions(materials: MaterialQuantity[], emissionsFactors: Object): number {
        let totalEmissions = 0;

        for (const materialEntry of materials) {
            try {
                const emissionsFactor = (emissionsFactors as Record<string, number>)[materialEntry.material.toString()];

                if (emissionsFactor) {
                    totalEmissions += calculateEmbodiedEmissionsInCO2e(
                        materialEntry.amount,
                        emissionsFactor
                    );
                } else {
                    console.warn(
                        `Embodied emissions data not found for material: ${materialEntry.material}`
                    );
                }
            } catch (error) {
                // ... handle potential errors
            }
        }

        return totalEmissions;
    }

    /**
     * Calculates the amount of carbon emitted by the product based on amount and emissions factor of the material.
     */
    function calculateEmbodiedEmissionsInCO2e(amount: number, emissionsFactor: number): number {
        return amount * emissionsFactor; // g-CO2e
    }

    /**
     * Calculates all the water that is used up in the manufacturing porcess
     */
    function calculateWaterDepletion(vehicle: Vehicle, battery: Battery, waterUsageFactors: Object): number {
        let totalWaterDepletion = 0;

        // Water depletion from vehicle materials
        totalWaterDepletion += calculateMaterialWaterDepletion(
            vehicle.materialsBreakdown,
            waterUsageFactors
        );

        // Water depletion from battery - active cell materials
        totalWaterDepletion += calculateMaterialWaterDepletion(
            battery.activeCellMaterials,
            waterUsageFactors
        );

        // Water depletion from battery - structural components
        totalWaterDepletion += calculateMaterialWaterDepletion(
            battery.structuralComponents,
            waterUsageFactors
        );

        return totalWaterDepletion;
    }

    /**
     * Calculates how much water is used up per material in the manufacturing process of a vehicle.
     */
    function calculateMaterialWaterDepletion(
        materials: MaterialQuantity[],
        waterUsageFactors: Object
    ): number {
        let totalWaterDepletion = 0;

        for (const materialEntry of materials) {
            try {
                const factor = (waterUsageFactors as Record<string, number>)[materialEntry.material.toString()];
                if (factor) {
                    const amountInKg = materialEntry.amount / 1000;
                    totalWaterDepletion += amountInKg * factor;
                } else {
                    console.warn(
                        `Water usage factor not found for material: ${materialEntry.material}`
                    );
                }
            } catch (error) {
                // ... handle potential errors
            }
        }

        return totalWaterDepletion;
    }

    /**
     * Calculates all wasted material for every subcomponent of the vehicle.
     */
    function calculateCriticalMaterialWaste(
        vehicle: Vehicle,
        battery: Battery,
        wasteFactors: Object,
    ): Record<string, number> {
        const wasteOutput: Record<string, number> = {};

        subCalculateCriticalMaterialWaste(vehicle.materialsBreakdown, wasteFactors, wasteOutput);
        subCalculateCriticalMaterialWaste(battery.activeCellMaterials, wasteFactors, wasteOutput);
        subCalculateCriticalMaterialWaste(battery.structuralComponents, wasteFactors, wasteOutput);

        return wasteOutput;
    }

    interface MaterialWasteData {
        manufacturing: number;
        endOfLife: number;
    }

    /**
     * Calculate how much material is wasted during the manufacturing cycle.
     */
    function subCalculateCriticalMaterialWaste(
        materials: MaterialQuantity[],
        wasteFactors: Object,
        wasteOutput: CriticalMaterialWasteOutput
    ) {
        for (const materialEntry of materials) {
            try {
                const materialWasteData = (wasteFactors as Record<string, MaterialWasteData>)[materialEntry.material.toString()];

                if (materialWasteData && materialWasteData.manufacturing) {
                    const wasteFactor = materialWasteData.manufacturing;

                    // Calculation based on producing usable material
                    const totalMaterialUsed = materialEntry.amount / (1 - wasteFactor);
                    const wasteGenerated = totalMaterialUsed - materialEntry.amount;

                    const key = `vehicle/material-waste-${materialEntry.material}`;
                    wasteOutput[key] = (wasteOutput[key] || 0) + wasteGenerated;
                } else {
                    console.warn(
                        `Waste factor not found for material: ${materialEntry.material}`
                    );
                }
            } catch (error) {
                // ... handle potential errors
            }
        }
    }

    return {
        metadata,
        execute,
    };
};
