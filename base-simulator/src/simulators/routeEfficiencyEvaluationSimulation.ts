import { PackasgeDeliveryObservation } from "./models/packasgeDeliveryObservation";
import { PotentialChargingStationObservation } from "./models/potentialChargingStationObservation";
import { RouteObservation } from "./models/routeObservation";
import { RoadType } from "./models/enums/roadtype";
import { DistanceUnit } from "./models/enums/distanceunit";
import { SpeedUnit } from "./models/enums/speedunit";
import { PackageObservation } from "./models/packageObservation";

export class RouteEfficiencyEvaluationSimulation {
  sim(potentialChargingStationObservations: PotentialChargingStationObservation[] | undefined): PackasgeDeliveryObservation[] {
    const simulatedObservations: PackasgeDeliveryObservation[] = [];
    const packagesPerChartingStation = 1;
    const segmentsPerRoute = 3;

    if (potentialChargingStationObservations) {
      for (const potentialChargingStationObservation of potentialChargingStationObservations) {
        for(let i = 0; i < packagesPerChartingStation; i++) {
          let routeSegments = GenerateRoute(segmentsPerRoute);
          const packageObservation = GeneratePackageObservation(i);
          for (const routeSegment of routeSegments) {
            const simulatedObservation: PackasgeDeliveryObservation = new PackasgeDeliveryObservation();

            simulatedObservation.batteryInspection = potentialChargingStationObservation.batteryInspection;
    
            simulatedObservation.forcastObservation = potentialChargingStationObservation.forcastObservation;
    
            simulatedObservation.gridObservation = potentialChargingStationObservation.gridObservation;
    
            simulatedObservation.vehicleInspection = potentialChargingStationObservation.vehicleInspection;
    
            simulatedObservation.chargingStation = potentialChargingStationObservation.chargingStation;

            simulatedObservation.routeObservation = routeSegment;

            simulatedObservation.packageObservation = packageObservation;

            simulatedObservations.push(simulatedObservation);
          }
        }
      }
    }

    return simulatedObservations;
  }
}

function GeneratePackageObservation(packageId: number): PackageObservation {
  const packageObservation: PackageObservation = new PackageObservation(); 

  packageObservation.id = packageId;
  packageObservation.deliveryLocationLat = 1;
  packageObservation.deliveryLocationLng = 1;
  packageObservation.deliveryLocationState = "in-transit";
  packageObservation.deliveryTimePerPackage = 30;
  packageObservation.embodiedcarbon = 0;
  packageObservation.timestamp = new Date().toISOString();
  packageObservation.volume = 1000;
  packageObservation.weight = 10;

  return packageObservation;
}

function GenerateRoute(segmentCount: number): RouteObservation[]{
  let routeObservations: RouteObservation[] = [];

  for (let i = 0; i < segmentCount; i++) {
    const routeObservation: RouteObservation = new RouteObservation(); 

    routeObservation.id = i;
    routeObservation.segmentId = i;
    routeObservation.segmentCurrent = i;
    routeObservation.segmentCurrentWeight = 1000;
    routeObservation.segmentCurrentRoadType = RoadType.HIGHWAY;
    routeObservation.segmentDistance = getRandomNumber(0.1, 10);
    routeObservation.segmentDistanceUnit = DistanceUnit.KM;
    routeObservation.segmentEndLocationLat = 52.9244;
    routeObservation.segmentEndLocationLng = 5.0900;
    routeObservation.segmentRealTimeSpeed = getRandomNumber(10, 100);
    routeObservation.segmentRealTimeSpeedUnit = SpeedUnit.KMH;
    routeObservation.segmentStartLocationLat = 52.3792;
    routeObservation.segmentStartLocationLng = 6.9003;
    routeObservation.segmentTotalCount = segmentCount;  

    routeObservations.push(routeObservation);
  }

  return routeObservations;
}

// Utility methods for generating random data
function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}