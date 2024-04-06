import { BatteryInspection } from './batteryInspection';
import { ForcastObservation } from './forcastObservation';
import { GridObservation } from './gridObservation';
import { VehicleInspection } from './vehicleInspection';
export class ImpactObservation {
    timestamp: string = "";
    batteryInspection: BatteryInspection  | undefined;
    vehicleInspection: VehicleInspection  | undefined;
    forcastObservation: ForcastObservation  | undefined;
    gridObservation: GridObservation  | undefined;
}