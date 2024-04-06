import { FleetEngineer } from "./actors/fleetEngineer";
import { VehicleAssessment } from "./models/vehicleAssessment";
import { Vehicle } from "./models/verhicle";

export class VehicleAssessmentSimulator {
    sim(vehicle: Vehicle): VehicleAssessment {

        const fleetEngineer = new FleetEngineer();
        const vehicleAssessment = fleetEngineer.vehicleAssessmentObservations(vehicle);

        return vehicleAssessment;
    }
}