import { VehicleAssessmentSimulator } from './vehicleAssessmentSimulator';
import { WeatherImpactAnalysisSimulator } from './weatherImpactAnalysisSimulator';
import { RouteEfficiencyEvaluationSimulation } from './routeEfficiencyEvaluationSimulation';
import { EngineerObservation } from './models/engineerObservation';
import { Vehicle } from './models/verhicle';
import { GeoLocation } from './models/geoLocation';
import { DateRange } from './models/dateRange';
import { PotentialChargingStationsObservationsSimulator } from './potentialChargingStationsObservationsSimulator';
import { VehicleType } from './models/enums/vehicleType';

export class MondayAtGreenLogisticsTheExampleLtdSimulator {
  sim(): EngineerObservation[] {

    const vehicles: Vehicle[] = [
      {
          id: 1,
          manufacturer: "EVD",
          name: "EV Delivery 1",
          type: VehicleType.VAN
      },
      {
          id: 2,
          manufacturer: "EVD",
          name: "EV Delivery 2",
          type: VehicleType.VAN
      },
      {
          id: 3,
          manufacturer: "EVD",
          name: "EV Delivery 3",
          type: VehicleType.VAN
      }
  ];

    // Array to store engineer observations for all vehicles
    const engineerObservations: EngineerObservation[] = [];

    // Iterate over all vehicles
    for (const vehicle of vehicles) {

      const vehicleAssessmentSimulator = new VehicleAssessmentSimulator();
      const weatherImpactAnalysisSimulator = new WeatherImpactAnalysisSimulator();
      const potentialChargingStationsObservationsSimulator = new PotentialChargingStationsObservationsSimulator();
      const routeEfficiencyEvaluationSimulation = new RouteEfficiencyEvaluationSimulation();

      const engineerObservation: EngineerObservation = new EngineerObservation();

      // Simulate each step
      engineerObservation.vehicleAssessment = vehicleAssessmentSimulator.sim(vehicle);       

      const chargingStationLocation: GeoLocation = new GeoLocation(); 
      chargingStationLocation.lat = 1;
      chargingStationLocation.long = 1;

      const dateRange: DateRange = new DateRange();
      dateRange.firstDate = new Date(2024, 8, 1);
      dateRange.lastDate = new Date(2024, 8, 7);

      const ImpactObservations = weatherImpactAnalysisSimulator.sim(engineerObservation.vehicleAssessment, chargingStationLocation, dateRange);
      engineerObservation.impactObservations = ImpactObservations;

      const potentialChargingStationObservations = potentialChargingStationsObservationsSimulator.sim(engineerObservation.impactObservations, chargingStationLocation);
      engineerObservation.potentialChargingStationObservations = potentialChargingStationObservations;

      const packasgeDeliveryObservations = routeEfficiencyEvaluationSimulation.sim(potentialChargingStationObservations);

      engineerObservation.packasgeDeliveryObservations = packasgeDeliveryObservations;

      // Store the engineer observation for this vehicle
      engineerObservations.push(engineerObservation);

    }

    return engineerObservations;
  }
}
