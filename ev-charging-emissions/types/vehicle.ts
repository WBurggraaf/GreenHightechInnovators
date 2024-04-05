import { PluginParams } from "../../../types";
import { FuelType } from "./enums/fuelType";
import { VehicleType } from "./enums/vehicleType";

export class Vehicle {
    converterEfficiency: number = 0;
    cableEfficiency: number = 0;
    embodiedCarbonGCo2e: number = 0;
    fuelType: FuelType = FuelType.ELECTRIC;
    id: number = 0;
    kwhPerKm: number = 0;
    name: String = '';
    suggestedMaintenanceIntervalInDays: number = 0;
    type: VehicleType = VehicleType.VAN;


    static toModel(inputParams: PluginParams): Vehicle {
        let vehicle = new Vehicle();
        vehicle.converterEfficiency = inputParams['vehicle/converter-efficiency'];
        vehicle.cableEfficiency = inputParams['vehicle/cable-efficiency'];
        if (inputParams['vehicle/fuel-type']) {
            let fuelTypeKey: keyof typeof FuelType = inputParams['vehicle/fuel-type'].toUpperCase();
            vehicle.fuelType = FuelType[fuelTypeKey];
        }   
        vehicle.id = inputParams['vehicle/id'];
        vehicle.kwhPerKm = inputParams['vehicle/kwh-per-km'];
        vehicle.name = inputParams['vehicle/name'];
        vehicle.suggestedMaintenanceIntervalInDays = inputParams['vehicle/suggested-maintenance-interval-in-days'];

        if (inputParams['vehicle/type']) {
            let vehicleTypeKey: keyof typeof VehicleType = inputParams['vehicle/type'].toUpperCase();
            vehicle.type = VehicleType[vehicleTypeKey];
        }

        return vehicle;
    }
}