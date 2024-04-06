import { Get, Route } from "tsoa";
import { Manifest } from "../model/manifest";
import { Vehicle } from "../model/output/vehicle";
import { InputPipeline } from "../model/child";
import { Battery } from "../model/output/battery";
import { VehicleEmbodiedCarbonPlugin } from "../model/plugins/vehicleEmbodiedCarbonPlugin";
import { MondayAtGreenLogisticsTheExampleLtdSimulator } from '../simulators/mondayAtGreenLogisticsTheExampleLtdSimulator';
import { EngineerObservation } from "../simulators/models/engineerObservation";
import { FuelType } from "../model/enums/fuelType";
import { VehicleType } from "../model/enums/vehicleType";
import { WeigthUnit } from "../model/enums/weigthUnit";
import { BatteryState } from "../model/enums/batteryState";
import { TemperatureUnit } from "../model/enums/temperatureUnit";
import { BatteryType } from "../simulators/models/enums/batteryType";
import { BatteryInspection } from "../simulators/models/batteryInspection";
import { VehicleInspection } from "../simulators/models/vehicleInspection";
import { Weather } from '../model/output/weather';
import { ForcastObservation } from '../simulators/models/forcastObservation';
import { GridObservation } from "../simulators/models/gridObservation";
import { Grid } from '../model/output/grid';
import { PackasgeDeliveryObservation } from "../simulators/models/packasgeDeliveryObservation";
import { Route as RouteModel } from "../model/output/route"
import { Package } from "../model/output/package"
import { RouteObservation } from "../simulators/models/routeObservation";
import { PackageObservation } from "../simulators/models/packageObservation";
import { WeatherImpactPredictionPlugin } from "../model/plugins/weatherImpactPreditionPlugin";
import { EvChargingEmissionsPlugin } from "../model/plugins/evChargingEmissionsPlugin";
import { ChargingStation } from "../simulators/models/chargingStation";
import { ChargingStation as ChargingStationModel } from "../model/output/chargingStation"
import { PackageDeliveryEmissionsPlugin } from "../model/plugins/packageDeliveryEmissionsPlugin";


//The URL route that this controller belong too. The route URL can be changed in routes/index.ts
@Route("mondayAtGreenLogisticsTheExampleLtd")
export default class MondayAtGreenLogisticsTheExampleLtdController {

  request: any = {};

  @Get("/Simulate")
  public async simulate(): Promise<Manifest> {

    const mondayAtGreenLogisticsTheExampleLtdSimulator = new MondayAtGreenLogisticsTheExampleLtdSimulator();
    const engineerObservations = mondayAtGreenLogisticsTheExampleLtdSimulator.sim();

    const pipeline = this.createPipeline(engineerObservations);

    const manifest = new Manifest();

    manifest.name = 'complete-chain';
    manifest.description = "Calculates all.";
    manifest.addPipeline(pipeline);

    const vehicleEmbodiedCarbon = new VehicleEmbodiedCarbonPlugin();
    vehicleEmbodiedCarbon.addToGlobalConfig(this.getGlobalVehicleEmbodiedCarbonConfig());

    manifest.addPlugin(vehicleEmbodiedCarbon);

    const weatherImpactPredictionPlugin = new WeatherImpactPredictionPlugin();
    weatherImpactPredictionPlugin.addToGlobalConfig(this.getGlobalWeatherImpactPredictionConfig());

    manifest.addPlugin(weatherImpactPredictionPlugin);

    const evChargingEmissionsPlugin = new EvChargingEmissionsPlugin();
    evChargingEmissionsPlugin.addToGlobalConfig(this.getGlobalEvChargingEmissionsConfig());

    manifest.addPlugin(evChargingEmissionsPlugin);

    const packageDeliveryEmissionsPlugin = new PackageDeliveryEmissionsPlugin();
    packageDeliveryEmissionsPlugin.addToGlobalConfig(new Object());

    manifest.addPlugin(packageDeliveryEmissionsPlugin);


    pipeline.addPlugin('vehicle-embodied-carbon');
    pipeline.addPlugin('weather-impact-prediction');
    pipeline.addPlugin('ev-charging-emissions');
    pipeline.addPlugin('package-delivery-emissions');

    return manifest;
  }

  public createPipeline(engineerObservations: EngineerObservation[] | undefined): InputPipeline {
    const pipeline = new InputPipeline();

    if (engineerObservations) {
      engineerObservations.forEach(engineerObservation => {
        const { packasgeDeliveryObservations } = engineerObservation;

        if (packasgeDeliveryObservations) {
          for (const packasgeDeliveryObservation of packasgeDeliveryObservations) {
            const { battery, vehicle, weather, grid, route, packageModel, chargingStation } = this.processImpactObservations(packasgeDeliveryObservation);
            const timestamp = "2024-03-26T14:28:30.000Z"; // packasgeDeliveryObservation.routeObservation?.timestamp ?? "";
            pipeline.addInput(timestamp, vehicle, battery, weather, grid, chargingStation, route, packageModel);
          }
        }
      });
    }

    return pipeline;
  }

  public processImpactObservations(packasgeDeliveryObservation: PackasgeDeliveryObservation): { vehicle: Vehicle, battery: Battery, weather: Weather, grid: Grid, route: RouteModel, packageModel: Package, chargingStation: ChargingStationModel } {
    const battery = this.createBatteryFromInspection(packasgeDeliveryObservation.batteryInspection);
    const vehicle = this.createVehicleFromInspection(packasgeDeliveryObservation.vehicleInspection);
    const weather = this.createWeatherFromForcastObservation(packasgeDeliveryObservation.forcastObservation);
    const grid = this.createGridFromGridObservation(packasgeDeliveryObservation.gridObservation);
    const route = this.createRouteFromRouteObservation(packasgeDeliveryObservation.routeObservation);
    const packageModel = this.createPackageFromPackageObservation(packasgeDeliveryObservation.packageObservation);

    const chargingStation = this.createChargingStationFromChargingStation(packasgeDeliveryObservation.chargingStation);

    return { vehicle, battery, weather, grid, route, packageModel, chargingStation };
  }


  public createVehicleFromInspection(vehicleInspection?: VehicleInspection): Vehicle {
    const vehicle = new Vehicle();
    if (vehicleInspection) {
      vehicle.batteryType = vehicleInspection.batteryType ?? BatteryType.LFP;
      vehicle.converterEfficiency = vehicleInspection.converterEfficiency ?? 0;
      vehicle.cableEfficiency = vehicleInspection.cableEfficiency ?? 0;
      vehicle.emissionsFactorGCo2ePerUnit = vehicleInspection.emissionsFactorGCo2ePerUnit ?? 0;
      vehicle.emissionsFactorGCo2eUnit = vehicleInspection.emissionsFactorGCo2eUnit ?? "";
      vehicle.embodiedCarbonGCo2e = vehicleInspection.embodiedCarbonGCo2e ?? 0;
      vehicle.expectedLifespanInYears = vehicleInspection.expectedLifespanInYears ?? 0;
      vehicle.fuelType = vehicleInspection.fuelType ?? FuelType.ELECTRIC;
      vehicle.id = vehicleInspection?.id ?? -1;
      vehicle.kwhPerKm = vehicleInspection.kwhPerKm ?? 0;
      vehicle.manufacturer = vehicleInspection?.manufacturer ?? "";
      vehicle.materialsBreakdown = vehicleInspection.materialsBreakdown ?? [];
      vehicle.name = vehicleInspection?.name ?? "";
      vehicle.resourceDepletionWaterM3 = vehicleInspection.resourceDepletionWaterM3 ?? 0;
      vehicle.suggestedMaintenanceIntervalInDays = vehicleInspection.suggestedMaintenanceIntervalInDays ?? 0;
      vehicle.type = vehicleInspection?.type ?? VehicleType.VAN;
      vehicle.weigth = vehicleInspection.weigth ?? 0;
      vehicle.weigthUnit = vehicleInspection.weigthUnit ?? WeigthUnit.Kg;
    }
    return vehicle;
  }

  public createBatteryFromInspection(batteryInspection?: BatteryInspection): Battery {
    const battery = new Battery();
    if (batteryInspection) {
      battery.activeCellMaterials = batteryInspection.activeCellMaterials ?? [];
      battery.amountChargedMah = batteryInspection.amountChargedMah ?? 0;
      battery.batteryEfficiency = batteryInspection.batteryEfficiency ?? 0;
      battery.chargeCycle = batteryInspection.chargeCycle ?? 0;
      battery.chemistry = batteryInspection.chemistry ?? "";
      battery.currentSoc = batteryInspection.currentSoc ?? 0;
      battery.directCarbonEmissions = batteryInspection.directCarbonEmissions ?? 0;
      battery.efficiency = batteryInspection.efficiency ?? 0;
      battery.energyEfficiencyLostPowerKwh = batteryInspection.energyEfficiencyLostPowerKwh ?? 0;
      battery.expectedChargingDelayInMinutes = batteryInspection.expectedChargingDelayInMinutes ?? 0;
      battery.expectedLifeSpanInYears = batteryInspection.expectedLifeSpanInYears ?? 0;
      battery.expectedPercentageRenewableEnergy = batteryInspection.expectedPercentageRenewableEnergy ?? 0;
      battery.id = batteryInspection.id ?? 0;
      battery.maxCapacityMah = batteryInspection.maxCapacityMah ?? 0;
      battery.maxPackVoltage = batteryInspection.maxPackVoltage ?? 0;
      battery.percentageCurrentIsRenewable = batteryInspection.percentageCurrentIsRenewable ?? 0;
      battery.productionLocation = batteryInspection.productionLocation ?? "";
      battery.socStart = batteryInspection.socStart ?? 0;
      battery.soh = batteryInspection.soh ?? 0;
      battery.sohAfterCharge = batteryInspection.sohAfterCharge ?? 0;
      battery.state = batteryInspection.state ?? BatteryState.IDLE;
      battery.structuralComponents = batteryInspection.structuralComponents ?? [];
      battery.temperature = batteryInspection.temperature ?? 0;
      battery.temperatureUnit = batteryInspection.temperatureUnit ?? TemperatureUnit.CELCIUS;
    }
    return battery;
  }

  public createWeatherFromForcastObservation(forcastObservation?: ForcastObservation): Weather {
    const weather = new Weather();
    if (forcastObservation) {
      weather.airPressureInHectopascal = forcastObservation.airPressureInHectopascal ?? 0,
        weather.cloudCoveragePercentage = forcastObservation.cloudCoveragePercentage ?? 0,
        weather.id = forcastObservation.id ?? 0,
        weather.latitude = forcastObservation.latitude ?? 0,
        weather.longitude = forcastObservation.longitude ?? 0,
        weather.radiusInMeters = forcastObservation.radiusInMeters ?? 0,
        weather.rainfallInMillimeter = forcastObservation.rainfallInMillimeter ?? 0,
        weather.temperatureInCelsius = forcastObservation.temperatureInCelsius ?? 0,
        weather.visibilityInMeters = forcastObservation.visibilityInMeters ?? 0,
        weather.windDirectionInDegrees = forcastObservation.windDirectionInDegrees ?? 0,
        weather.windSpeedInKmh = forcastObservation.windSpeedInKmh ?? 0
    }
    return weather;
  }

  public createGridFromGridObservation(gridObservation?: GridObservation): Grid {
    const grid = new Grid();
    if (gridObservation) {
      grid.bio = gridObservation.bio;
      grid.carbonAverageRenewableEnergyPercentage = gridObservation.carbonAverageRenewableEnergyPercentage;
      grid.carbonIntensityGCo2ePerKwh = gridObservation.carbonIntensityGCo2ePerKwh;
      grid.coalBituminous = gridObservation.coalBituminous;
      grid.coalLignite = gridObservation.coalLignite;
      grid.coalSubBituminous = gridObservation.coalSubBituminous;
      grid.gas = gridObservation.gas;
      grid.geothermal = gridObservation.geothermal;
      grid.hydro = gridObservation.hydro;
      grid.id = gridObservation.id;
      grid.nuclear = gridObservation.nuclear
      grid.oil = gridObservation.nuclear
      grid.solar = gridObservation.solar;
      grid.wind = gridObservation.wind;
    }
    return grid;
  }

  public createRouteFromRouteObservation(routeObservation?: RouteObservation): RouteModel {
    const route = new RouteModel();
    if (routeObservation) {
      route.expectedEfficiency = routeObservation.expectedEfficiency;
      route.id = routeObservation.id;
      route.segmentCurrent = routeObservation.segmentCurrent;
      route.segmentCurrentRoadType = routeObservation.segmentCurrentRoadType;
      route.segmentCurrentWeight = routeObservation.segmentCurrentWeight;
      route.segmentDistance = routeObservation.segmentDistance;
      route.segmentDistanceUnit = routeObservation.segmentDistanceUnit;
      route.segmentEndLocationLat = routeObservation.segmentEndLocationLat;
      route.segmentEndLocationLng = routeObservation.segmentEndLocationLng;
      route.segmentId = routeObservation.segmentId;
      route.segmentRealTimeSpeed = routeObservation.segmentRealTimeSpeed;
      route.segmentRealTimeSpeedUnit = routeObservation.segmentRealTimeSpeedUnit;
      route.segmentStartLocationLat = routeObservation.segmentStartLocationLat;
      route.segmentStartLocationLng = routeObservation.segmentStartLocationLng;
      route.segmentTotalCount = routeObservation.segmentTotalCount;
    }
    return route;
  }

  public createPackageFromPackageObservation(packageObservation?: PackageObservation): Package {
    const packageModel = new Package();
    if (packageObservation) {
      packageModel.deliveryLocationLat = packageObservation.deliveryLocationLat;
      packageModel.deliveryLocationLng = packageObservation.deliveryLocationLng;
      packageModel.deliveryLocationState = packageObservation.deliveryLocationState;
      packageModel.deliveryTimePerPackage = packageObservation.deliveryTimePerPackage;
      packageModel.embodiedcarbon = packageObservation.embodiedcarbon;
      packageModel.id = packageObservation.id
      packageModel.volume = packageObservation.volume;
      packageModel.weight = packageObservation.weight;
    }
    return packageModel;
  }

    public createChargingStationFromChargingStation(chargingStation?: ChargingStation): ChargingStationModel {
    const chargingStationModel = new ChargingStationModel();
    if (chargingStation) {
      chargingStationModel.cableEfficiency = chargingStation.cableEfficiency;
      chargingStationModel.converterEfficiency = chargingStation.converterEfficiency;
      chargingStationModel.id = chargingStation.id;
      chargingStationModel.locationIng = chargingStation.locationIng;
      chargingStationModel.locationLat = chargingStation.locationLat;
      chargingStationModel.type = chargingStation.type
    }
    return chargingStationModel;
  }

  

  private getGlobalEvChargingEmissionsConfig(): Object {
    return {
      "options":
      {
        "averageRenewableEnergyPercentageGrid": 5
      }
    }
  }

  private getGlobalWeatherImpactPredictionConfig(): Object {
    return {
      "solarStats":
      {
        "efficiencyMonthlyNorthernHemisphere": {
          "january": 0.49,
          "february": 0.61,
          "march": 0.75,
          "april": 0.88,
          "may": 0.94,
          "june": 0.99,
          "july": 1,
          "august": 0.94,
          "september": 0.85,
          "october": 0.68,
          "november": 0.53,
          "december": 0.43
        },
        "efficiencyMonthlySouthernHemisphere": {
          "january": 1,
          "february": 0.94,
          "march": 0.85,
          "april": 0.68,
          "may": 0.53,
          "june": 0.43,
          "july": 0.49,
          "august": 0.61,
          "september": 0.75,
          "october": 0.88,
          "november": 0.94,
          "december": 0.99
        },
        "efficiencyPerHour": {
          "1": 0,
          "2": 0,
          "3": 0,
          "4": 0,
          "5": 0,
          "6": 0.04,
          "7": 0.08,
          "8": 0.14,
          "9": 0.32,
          "10": 0.50,
          "11": 0.65,
          "12": 0.70,
          "13": 0.85,
          "14": 0.91,
          "15": 0.80,
          "16": 0.75,
          "17": 0.68,
          "18": 0.33,
          "19": 0.04,
          "20": 0.00,
          "21": 0.00,
          "22": 0.00,
          "23": 0.00,
          "24": 0.00,
          "0": 0.00
        }
      },
      "powerSource":
      {
        "solar": 41,
        "wind": 11,
        "geothermal": 38,
        "hydro": 4,
        "nuclear": 12,
        "bio": 230,
        "oil": 840,
        "gas": 490,
        "coalBituminous": 740,
        "coalSubBituminous": 1024,
        "coalLignite": 1689
      }
    }
  }

  private getGlobalVehicleEmbodiedCarbonConfig(): Object {
    return {
      "emissionsFactors": {
        "Lithium": 16,
        "Iron": 2,
        "Phosphate": 4,
        "Graphite": 5.5,
        "Binder": 3,
        "ConductiveAdditive": 4,
        "Electrolyte": 5,
        "Separator": 3,
        "Steel": 2.1,
        "Aluminum": 10,
        "Copper": 3,
        "Plastics": 2.3,
        "Glass": 1.8,
        "Rubber": 4,
        "RareEarths": 15,
        "Electronics": 6,
        "Textiles": 4,
        "Fluids": 3,
        "SpecializedAlloys": 5
      },
      "waterUsageFactors": {
        "Lithium": 25000,
        "Iron": 50,
        "Phosphate": 800,
        "Graphite": 2000,
        "Binder": 500,
        "ConductiveAdditive": 300,
        "Electrolyte": 200,
        "Separator": 300,
        "Steel": 60,
        "Aluminum": 200,
        "Copper": 70,
        "Plastics": 500,
        "Glass": 1500,
        "Rubber": 800,
        "RareEarths": 4000,
        "Electronics": 1500,
        "Textiles": 1000,
        "Fluids": 100,
        "SpecializedAlloys": 300
      },
      "wasteFactors": {
        "Lithium": {
          "manufacturing": 0.35,
          "endOfLife": 0.05
        },
        "Iron": {
          "manufacturing": 0.15,
          "endOfLife": 0.1
        },
        "Phosphate": {
          "manufacturing": 0.4,
          "endOfLife": 0.05
        },
        "Graphite": {
          "manufacturing": 0.55,
          "endOfLife": 0.06
        },
        "Binder": {
          "manufacturing": 0.3,
          "endOfLife": 0.2
        },
        "ConductiveAdditive": {
          "manufacturing": 0.2,
          "endOfLife": 0.1
        },
        "Electrolyte": {
          "manufacturing": 0.3,
          "endOfLife": 0.1
        },
        "Separator": {
          "manufacturing": 0.3,
          "endOfLife": 0.2
        },
        "Steel": {
          "manufacturing": 0.2,
          "endOfLife": 0.1
        },
        "Aluminum": {
          "manufacturing": 0.12,
          "endOfLife": 0.12
        },
        "Copper": {
          "manufacturing": 0.15,
          "endOfLife": 0.01
        },
        "Plastics": {
          "manufacturing": 0.8,
          "endOfLife": 0.3
        },
        "Glass": {
          "manufacturing": 0.7,
          "endOfLife": 0.1
        },
        "Rubber": {
          "manufacturing": 0.4,
          "endOfLife": 0.2
        },
        "RareEarths": {
          "manufacturing": 0.5,
          "endOfLife": 0.03
        },
        "Electronics": {
          "manufacturing": 0.3,
          "endOfLife": 0.2
        },
        "Textiles": {
          "manufacturing": 0.3,
          "endOfLife": 0.4
        },
        "Fluids": {
          "manufacturing": 0.1,
          "endOfLife": 0.3
        },
        "SpecializedAlloys": {
          "manufacturing": 0.3,
          "endOfLife": 0.2
        }
      },
      "options": {
        "optionPlaceHolder": 0.6
      }
    }
  }


}