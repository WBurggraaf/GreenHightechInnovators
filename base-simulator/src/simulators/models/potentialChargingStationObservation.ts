import { BatteryInspection } from './batteryInspection';
import { ForcastObservation } from './forcastObservation';
import { GridObservation } from './gridObservation';
import { VehicleInspection } from './vehicleInspection';
import { ChargingStation } from './chargingStation';
export class PotentialChargingStationObservation {
    timestamp: string = "";
    batteryInspection: BatteryInspection  | undefined;
    vehicleInspection: VehicleInspection  | undefined;
    forcastObservation: ForcastObservation  | undefined;
    gridObservation: GridObservation  | undefined;
    chargingStation: ChargingStation  | undefined;
}