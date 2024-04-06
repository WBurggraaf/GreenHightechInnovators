import { BatteryInspection } from './batteryInspection';
import { ChargingStation } from './chargingStation';
import { ForcastObservation } from './forcastObservation';
import { GridObservation } from './gridObservation';
import { RouteObservation } from './routeObservation';
import { VehicleInspection } from './vehicleInspection';
import { PackageObservation } from './packageObservation';
export class PackasgeDeliveryObservation {
    timestamp: string = "";
    batteryInspection: BatteryInspection  | undefined;
    vehicleInspection: VehicleInspection  | undefined;
    forcastObservation: ForcastObservation  | undefined;
    gridObservation: GridObservation  | undefined;
    chargingStation: ChargingStation  | undefined;
    routeObservation: RouteObservation | undefined;
    packageObservation: PackageObservation | undefined;
}