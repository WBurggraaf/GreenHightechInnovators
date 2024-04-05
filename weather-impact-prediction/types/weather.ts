import { PluginParams } from "../../../types";

export class Weather {
    id: number = 0;
    latitude: number = 0;
    longitude: number = 0;
    radiusInMeters: number = 0;
    temperatureInCelsius: number = 0;
    rainfallInMillimeter: number = 0;
    windSpeedInKmh: number = 0;
    windDirectionInDegrees: number = 0;
    cloudCoveragePercentage: number = 0;
    visibilityInMeters: number = 0;
    airPressureInHectopascal: number = 0;

    static toModel(inputParams: PluginParams): Weather {
      let weather = new Weather();
      weather.id = inputParams['weather/id'];
      weather.latitude = inputParams['weather/latitude'];
      weather.longitude = inputParams['weather/longitude'];
      weather.radiusInMeters = inputParams['weather/radius-in-meters'];
      weather.temperatureInCelsius = inputParams['weather/temperature-in-celsius'];
      weather.rainfallInMillimeter = inputParams['weather/rainfall-in-millimeter'];
      weather.windSpeedInKmh = inputParams['weather/wind-speed-in-kmh'];
      weather.windDirectionInDegrees = inputParams['weather/wind-direction-in-degrees'];
      weather.cloudCoveragePercentage = inputParams['weather/cloud-coverage-percentage'];
      weather.visibilityInMeters = inputParams['weather/visibility-in-meters'];
      weather.airPressureInHectopascal = inputParams['weather/air-pressure-in-hectopascal'];
      return weather;
    }
}
