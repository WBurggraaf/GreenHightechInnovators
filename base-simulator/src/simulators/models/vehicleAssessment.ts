import { BatteryInspection } from './batteryInspection';
import { VehicleInspection } from './vehicleInspection';
export class VehicleAssessment {
    timestamp: string = "";
    batteryInspection: BatteryInspection  | undefined;
    vehicleInspection: VehicleInspection  | undefined;
}