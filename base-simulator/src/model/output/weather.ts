import { Output } from "../../interfaces/output";

export class Weather implements Output {
    airPressureInHectopascal: number = 0;
    cloudCoveragePercentage: number = 0;
    id: number = 0;
    latitude: number = 0;
    longitude: number = 0;
    radiusInMeters: number = 0;
    rainfallInMillimeter: number = 0;
    temperatureInCelsius: number = 0;
    visibilityInMeters: number = 0;
    windDirectionInDegrees: number = 0;
    windSpeedInKmh: number = 0;

    toImpactFramework(): object {
      return {
        'weather/air-pressure-in-hectopascal': this.airPressureInHectopascal,
        'weather/cloud-coverage-percentage': this.cloudCoveragePercentage,
        'weather/id': this.id,
        'weather/latitude': this.latitude,
        'weather/longitude': this.longitude,
        'weather/radius-in-meters': this.radiusInMeters,
        'weather/rainfall-in-millimeter': this.rainfallInMillimeter,
        'weather/temperature-in-celsius': this.temperatureInCelsius,
        'weather/visibility-in-meters': this.visibilityInMeters,
        'weather/wind-direction-in-degrees': this.windDirectionInDegrees,
        'weather/wind-speed-in-kmh': this.windSpeedInKmh,
      }
    }
}
