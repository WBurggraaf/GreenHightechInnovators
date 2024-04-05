import { PluginParams } from "../../../types";
import { FuelType } from "./enums/fuelType";
import { VehicleType } from "./enums/vehicleType";
import { MaterialQuantity } from "../interfaces/materialQuantity";
import { Material } from "../interfaces/enums/material";
import { WeigthUnit } from './enums/weigthUnit';

export class Vehicle {
    emissionsFactorGCo2ePerUnit: number = 0;
    emissionsFactorGCo2eUnit: String = '';
    expectedLifespanInYears: number = 0;
    fuelType: FuelType = FuelType.ELECTRIC;
    id: number = 0;
    manufacturer: String = '';
    materialsBreakdown: MaterialQuantity[] = [];
    name: String = '';
    type: VehicleType = VehicleType.VAN;
    weigth: number = 0;
    weigthUnit: WeigthUnit = WeigthUnit.KG;

    static toModel(inputParams: PluginParams): Vehicle {
        let vehicle = new Vehicle();
        vehicle.emissionsFactorGCo2ePerUnit = inputParams['vehicle/emissions-factor-g-co2e-per-unit'];
        vehicle.emissionsFactorGCo2eUnit = inputParams['vehicle/emissions-factor-g-co2e-unit'];
        vehicle.expectedLifespanInYears = inputParams['vehicle/expected-lifespan-in-years'];   
        if (inputParams['vehicle/fuel-type']) {
            let fuelTypeKey: keyof typeof FuelType = inputParams['vehicle/fuel-type'].toUpperCase();
            vehicle.fuelType = FuelType[fuelTypeKey];
        }   
        vehicle.id = inputParams['vehicle/id'];
        vehicle.manufacturer = inputParams['vehicle/manufacturer'];
        const materialsBreakdownString = inputParams['vehicle/materials-breakdown'];
        vehicle.materialsBreakdown = parseMaterialsString(materialsBreakdownString);
        vehicle.name = inputParams['vehicle/name'];

        if (inputParams['vehicle/type']) {
            let vehicleTypeKey: keyof typeof VehicleType = inputParams['vehicle/type'].toUpperCase();
            vehicle.type = VehicleType[vehicleTypeKey];
        }
        vehicle.weigth = inputParams['vehicle/weigth'];
        if (inputParams['vehicle/weigth-unit']) {
            let vehicleWeigthUnitKey: keyof typeof WeigthUnit = inputParams['vehicle/weigth-unit'].toUpperCase();
            vehicle.weigthUnit = WeigthUnit[vehicleWeigthUnitKey];
        }

        return vehicle;
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