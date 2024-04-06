import { BatteryState } from '../model/enums/batteryState';
import { FleetEngineer } from './actors/fleetEngineer';
import { GeoLocation } from "./models/geoLocation";
import { ImpactObservation } from "./models/impactObservation";
import { PotentialChargingStationObservation } from './models/potentialChargingStationObservation';


export class PotentialChargingStationsObservationsSimulator {
  sim(impactObservations: ImpactObservation[], geoLocation: GeoLocation): PotentialChargingStationObservation[] | undefined {

    const returnValue: PotentialChargingStationObservation[] = [];

    // Iterate through each impact observation
    for (const impactObservation of impactObservations) {

      const fleetEngineer = new FleetEngineer();
      const chargingStations = fleetEngineer.inspectElectricChargingStationsPresent(geoLocation);

      for (const chargingStation of chargingStations) {
        const potentialChargingStationObservation: PotentialChargingStationObservation = new PotentialChargingStationObservation();

        potentialChargingStationObservation.batteryInspection = impactObservation.batteryInspection;
        if (potentialChargingStationObservation?.batteryInspection)
        {
          potentialChargingStationObservation.batteryInspection.state = BatteryState.CHARGING;
        }
        potentialChargingStationObservation.forcastObservation = impactObservation.forcastObservation;
        potentialChargingStationObservation.gridObservation = impactObservation.gridObservation;
        potentialChargingStationObservation.vehicleInspection = impactObservation.vehicleInspection;
        potentialChargingStationObservation.chargingStation = chargingStation;

        if (potentialChargingStationObservation.forcastObservation) {
          const originalTimestamp: string = potentialChargingStationObservation.forcastObservation.timeStamp;
          const dateObject: Date = new Date(originalTimestamp);
          dateObject.setDate(dateObject.getDate() - 1);
          const adjustedTimestamp: string = dateObject.toISOString();
          impactObservation.timestamp = adjustedTimestamp;
        }

        returnValue.push(potentialChargingStationObservation);
      }

      return returnValue;
    }
  }

}
