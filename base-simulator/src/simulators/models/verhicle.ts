import { VehicleType } from "./enums/vehicleType";

export class Vehicle {
    id: number = 0;
    manufacturer: string = "";
    name: string = "";
    type: VehicleType = VehicleType.VAN;
}