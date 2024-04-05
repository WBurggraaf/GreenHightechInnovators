import { PluginParams } from "../../../types";
import { DistanceUnit } from "./enums/distanceunit";
import { RoadType } from "./enums/roadtype";
import { SpeedUnit } from "./enums/speedunit";

export class Route {
    segmentId: number = 0;
    segmentTotalCount: number = 0;
    segmentCurrent: number = 0;
    segmentStartLocationLat: number = 0;
    segmentStartLocationLng: number = 0;
    segmentEndLocationLat: number = 0;
    segmentEndLocationLng: number = 0;
    segmentCurrentWeight: number = 0;
    segmentRealTimeSpeed: number = 0;
    segmentRealTimeSpeedUnit: SpeedUnit = SpeedUnit.KMH;
    segmentCurrentRoadType: RoadType = RoadType.HIGHWAY;
    segmentDistance: number = 0;
    segmentDistanceUnit: DistanceUnit = DistanceUnit.KM;
    expectedEfficiency: number = 0;

    static toModel(inputData: PluginParams): Route {
        let route = new Route();

        route.segmentId = inputData['route/segment-id'];
        route.segmentTotalCount = inputData['route/segment-total-count'];
        route.segmentCurrent = inputData['route/segment-current'];

        route.segmentStartLocationLat = inputData['route/segment-start-location-lat'];
        route.segmentStartLocationLng = inputData['route/segment-start-location-lng'];
        route.segmentEndLocationLat = inputData['route/segment-end-location-lat'];
        route.segmentEndLocationLng = inputData['route/segment-end-location-lng'];

        route.segmentCurrentWeight = inputData['route/segment-current-weight'];
        route.segmentRealTimeSpeed = inputData['route/segment-real-time-speed'];

        if (inputData['route/segment-real-time-speed-unit']) {
            let realTimeSpeedUnitKey: keyof typeof SpeedUnit = inputData['route/segment-real-time-speed-unit'].toUpperCase();
            route.segmentRealTimeSpeedUnit = SpeedUnit[realTimeSpeedUnitKey];
        }

        if (inputData['route/segment-current-road-type']) {
            let currentRoadTypeKey: keyof typeof RoadType = inputData['route/segment-current-road-type'].toUpperCase();
            route.segmentCurrentRoadType = RoadType[currentRoadTypeKey];
        }

        route.segmentDistance = inputData['route/segment-distance'];

        if (inputData['route/segment-distance-unit']) {
            let segmentDistanceUnitKey: keyof typeof DistanceUnit = inputData['route/segment-distance-unit'].toUpperCase();
            route.segmentDistanceUnit = DistanceUnit[segmentDistanceUnitKey];    
        }

        route.expectedEfficiency = inputData['route/expected-efficiency'];

        return route;
    }
}