import { DistanceUnit } from "../../simulators/models/enums/distanceunit";
import { RoadType } from "../../simulators/models/enums/roadtype";
import { SpeedUnit } from "../../simulators/models/enums/speedunit";

export class Route {
    expectedEfficiency: number = 0;
    id: number = 0;
    segmentCurrent: number = 0;
    segmentCurrentRoadType: RoadType = RoadType.HIGHWAY;
    segmentCurrentWeight: number = 0;
    segmentDistance: number = 0;
    segmentDistanceUnit: DistanceUnit = DistanceUnit.KM;
    segmentEndLocationLat: number = 0;
    segmentEndLocationLng: number = 0;
    segmentId: number = 0;
    segmentRealTimeSpeed: number = 0;
    segmentRealTimeSpeedUnit: SpeedUnit = SpeedUnit.KMH;
    segmentStartLocationLat: number = 0;
    segmentStartLocationLng: number = 0;
    segmentTotalCount: number = 0;

    toImpactFramework(): object {
        return {
          'route/expected-efficiency': this.expectedEfficiency,
          'route/id': this.id,
          'route/segment-current': this.segmentCurrent,
          'route/segment-current-road-type': this.segmentCurrentRoadType,
          'route/segment-current-weight': this.segmentCurrentWeight,
          'route/segment-distance': this.segmentDistance,
          'route/segment-distance-unit': this.segmentDistanceUnit,
          'route/segment-end-location-lat': this.segmentEndLocationLat,
          'route/segment-end-location-lng': this.segmentEndLocationLng,
          'route/segment-id': this.segmentId,
          'route/segment-real-time-speed': this.segmentRealTimeSpeed,
          'route/segment-real-time-speed-unit': this.segmentRealTimeSpeedUnit,
          'route/segment-start-location-lat': this.segmentStartLocationLat,
          'route/segment-start-location-lng': this.segmentStartLocationLng,
          'route/segment-total-count': this.segmentTotalCount,
        }
      }
}