import { FleetEngineer } from "./actors/fleetEngineer";
import { DateRange } from "./models/dateRange";
import { GeoLocation } from "./models/geoLocation";
import { VehicleAssessment } from "./models/vehicleAssessment";
import { ImpactObservation } from "./models/impactObservation";

export class WeatherImpactAnalysisSimulator {
    sim(vehicleAssessment: VehicleAssessment, geoLocation: GeoLocation, dateRange: DateRange): ImpactObservation[] {
      
      //dothis for multiple days this week in a for loop

      const fleetEngineer = new FleetEngineer();

      return fleetEngineer.gatherImpactObservationsBasedOnConditionsAndForecasts(vehicleAssessment, geoLocation, dateRange);
    }
  }