import { PluginParams } from "../../../types";
import { FuelType } from "./enums/fuelType";
import { VehicleType } from "./enums/vehicleType";
import { BatteryType } from "./enums/batteryType";
import { WeigthUnit } from "./enums/weigthUnit";

export class Vehicle {
    batteryType: BatteryType = BatteryType.NMC;
    converterEfficiency: number = 0;
    cableEfficiency: number = 0;
    emissionsFactorGCo2ePerUnit: number = 0;
    emissionsFactorGCo2eUnit: String = '';
    embodiedCarbonGCo2e: number = 0;
    expectedLifespanInYears: number = 0;
    fuelType: FuelType = FuelType.ELECTRIC;
    id: number = 0;
    kwhPerKm: number = 0;
    manufacturer: String = '';
    name: String = '';
    resourceDepletionWaterM3: number = 0;
    suggestedMaintenanceIntervalInDays: number = 0;
    type: VehicleType = VehicleType.VAN;
    weigth: number = 0;
    weigthUnit: WeigthUnit = WeigthUnit.KG;

    static toModel(inputParams: PluginParams): Vehicle {
        let vehicle = new Vehicle();
        vehicle.batteryType = inputParams['vehicle/battery-type'];
        vehicle.converterEfficiency = inputParams['vehicle/converter-efficiency'];
        vehicle.cableEfficiency = inputParams['vehicle/cable-efficiency'];
        vehicle.emissionsFactorGCo2ePerUnit = inputParams['vehicle/emissions-factor-g-co2e-per-unit'];
        vehicle.emissionsFactorGCo2eUnit = inputParams['vehicle/emissions-factor-g-co2e-unit'];
        vehicle.expectedLifespanInYears = inputParams['vehicle/expected-lifespan-in-years'];   
        if (inputParams['vehicle/fuel-type']) {
            let fuelTypeKey: keyof typeof FuelType = inputParams['vehicle/fuel-type'].toUpperCase();
            vehicle.fuelType = FuelType[fuelTypeKey];
        }   
        vehicle.id = inputParams['vehicle/id'];
        vehicle.kwhPerKm = inputParams['vehicle/kwh-per-km'];
        vehicle.manufacturer = inputParams['vehicle/manufacturer'];
        vehicle.name = inputParams['vehicle/name'];
        vehicle.suggestedMaintenanceIntervalInDays = inputParams['vehicle/suggested-maintenance-interval-in-days'];

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

export class BatteryCycleStats {
    static ChargingCycleCount(battery: BatteryType): number {
        if(battery == BatteryType.LFP) {
            return 5000;
        } else if(battery == BatteryType.NMC) {
            return 2000;
        }

        return 1000;
    };
}