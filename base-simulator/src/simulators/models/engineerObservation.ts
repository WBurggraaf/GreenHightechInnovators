import { VehicleAssessment } from './vehicleAssessment';
import { ImpactObservation } from './impactObservation';
import { PackasgeDeliveryObservation } from './packasgeDeliveryObservation';
import { PotentialChargingStationObservation } from './potentialChargingStationObservation';
export class EngineerObservation {
    timestamp: string = "";
    vehicleAssessment: VehicleAssessment  | undefined;
    impactObservations: ImpactObservation[] | undefined;
    potentialChargingStationObservations: PotentialChargingStationObservation[] | undefined;
    packasgeDeliveryObservations: PackasgeDeliveryObservation[] | undefined;
}