import {PluginInterface} from "../../interfaces";
import {ConfigParams, PluginParams} from "../../types/common";
import {BatteryStats, Vehicle} from "./types/vehicle";
import {Weather} from "./types/weather";
import {SolarStats} from "./types/solarStats";
import {FuelType} from "./types/enums/fuelType";
import {BatteryType} from "./types/enums/batteryType";
import { GridMakeupPercentage } from "./types/gridMakeupPercentage";
import { PowerSourceCo2GramsPerKwh } from "./types/powerSourceCo2GramsPerKwh";
import { IPowerSourceCo2GramsPerKwh } from "./interfaces/powerSourceCo2GramsPerKwh";
import { ISolarStats } from "./interfaces/solarStats";

//The main method that is considered the plugin name. It has to extend PluginInterface for it to be picked up. You also have to implement the async execute function below.
export const WeatherImpactPrediction = (globalConfig?: ConfigParams): PluginInterface => {
    const metadata = {kind: 'execute'};

    /**
     * Executes the plugin for a list of input parameters.
     */
     async function execute (inputs: PluginParams[]) {
        // You breakup the inputs into single inputs. This is because a single manifest file can consist of mutliple inputs
        // In your manifest file you can specify something called defaults. These are also inside the pluginParams instead of in the config params. This can be used to have default values like for instance newable grid persentage
        return inputs.map(input => {
            const timestamp: string = input['timestamp'];
            const weather = Weather.toModel(input);
            const vehicle = Vehicle.toModel(input);
            const grid = GridMakeupPercentage.toModel(input);

            //const percentageGridRenewableEnergy = input['grid/carbon-average-renewable-energy-percentage'];

            const predicateCalculateCarbonIntensityGCo2ePerKwh = calculateCarbonGramsPerKwh(weather,timestamp,grid);
            const predicateCalculateExpectedEfficiencyPercentage = calculateExpectedEfficiency(vehicle,weather);

            //This returns a single frame back. You can either populate this with the input you can do it like this: ...input
            return {
                ...input,
                'grid/carbon-intensity-g-co2e-per-kwh': predicateCalculateCarbonIntensityGCo2ePerKwh,
                'battery/expected-efficiency': predicateCalculateExpectedEfficiencyPercentage,
            }
        });
    }

    /**
     * Calculates the grams of carbon emitted per kw/h at the current time based on gridmakeup.
     */
    function calculateCarbonGramsPerKwh(weather: Weather, timestamp: string, grid: GridMakeupPercentage): number {
       let currentGridCapacityUsed : number = 70;
       let windPercentage = calculatePercentageRenewableWind(weather) * grid.wind;
       let solarPercentage = calculatePercentageRenewableSolar(weather, timestamp) * grid.solar;

       const powerSource = buildPowerSource(globalConfig);

       let totalCo2 = 0;
       let gridPercentage = windPercentage + solarPercentage + grid.geothermal + grid.hydro + grid.nuclear;
       totalCo2 += windPercentage * grid.wind * powerSource.wind;
       totalCo2 += solarPercentage * grid.solar * powerSource.solar;
       totalCo2 += grid.geothermal * powerSource.geothermal;
       totalCo2 += grid.hydro * powerSource.hydro;
       totalCo2 += grid.nuclear * powerSource.nuclear;
       if(gridPercentage < currentGridCapacityUsed)
       {
         totalCo2 += grid.bio * powerSource.bio;
         totalCo2 += grid.coalBituminous * powerSource.coalBituminous;
         totalCo2 += grid.coalSubBituminous * powerSource.coalSubBituminous;
         totalCo2 += grid.coalLignite * powerSource.coalLignite;
         gridPercentage += grid.bio + grid.coalBituminous + grid.coalSubBituminous + grid.coalLignite
       }
       totalCo2 += Math.max(Math.min(grid.gas, currentGridCapacityUsed - gridPercentage), 0) * PowerSourceCo2GramsPerKwh.gas // this might use more gas that available
       return totalCo2;
    }

    /**
     * Calculates the percentage of renewable wind energy based on windspeed.
     */
    function calculatePercentageRenewableWind(weather: Weather): number {
      // source https://energyeducation.ca/encyclopedia/Wind_power
      const cutInSpeed : number = 13;
      const peakEfficiency : number = 50;
      const peakEfficiencyMaxOutput = 125000; //50 pow 3
      const onePercent= 1250;
      const maxSpeed : number = 100;

      if(weather.windSpeedInKmh < cutInSpeed && weather.windSpeedInKmh > maxSpeed)
        return 0;

      let overEfficiencyPeakPercentageReduction = Math.max(weather.windSpeedInKmh - peakEfficiency, 0) / 5;
      let efficiency : number = Math.min(Math.pow(weather.windSpeedInKmh, 3), peakEfficiencyMaxOutput) / onePercent;
      return efficiency - overEfficiencyPeakPercentageReduction;
    }

    /**
     * Calculates the expected the percentage of renewable solar avalible at the current time and weather.
     */
    function calculatePercentageRenewableSolar(weather: Weather, timestamp: string): number {
      const solarStats = buildSolarStats(globalConfig); 
      
      let date = new Date(timestamp);
       let month = date.toLocaleString('en-us', { month: 'long' }).toLowerCase();
       let hour = date.toLocaleTimeString([], { hour: '2-digit' });
       let efficiencyBasedOnMonth = weather.latitude >= 0 ? solarStats.efficiencyMonthlyNorthernHemisphere[month] : solarStats.efficiencyMonthlySouthernHemisphere[month];

      const cloudCoveragePercentage: number = weather.cloudCoveragePercentage;
      const efficiencyPerHour: number = solarStats.efficiencyPerHour[+hour];

      const sum = cloudCoveragePercentage * efficiencyBasedOnMonth * efficiencyPerHour;

       return sum
    }

    /**
     * Calculates the expected battery efficiency based on the weather temperature and the cell makeup.
     */
    function calculateExpectedEfficiency(vehicle: Vehicle, weather: Weather): number {
       if(vehicle.fuelType != FuelType.ELECTRIC)
         return 0;
       if(vehicle.batteryType == BatteryType.NMC)
         return BatteryStats.EfficiencyLithiumNickelManganeseCobalt(weather.temperatureInCelsius);
       else
         return BatteryStats.EfficiencyLithiumIronPhosphate(weather.temperatureInCelsius);
    }

    /**
     * Build a SolarStats object by combinding defaut values together with possible values from the global config.
     */
    function buildSolarStats(globalConfig?: ConfigParams): ISolarStats {
      return {
        efficiencyMonthlyNorthernHemisphere: {
          ...SolarStats.efficiencyMonthlyNorthernHemisphere,
          ...globalConfig?.solarStats.efficiencyMonthlyNorthernHemisphere
        },
        efficiencyMonthlySouthernHemisphere: {
          ...SolarStats.efficiencyMonthlySouthernHemisphere,
          ...globalConfig?.solarStats.efficiencyMonthlySouthernHemisphere
        },
        efficiencyPerHour: {
          ...SolarStats.efficiencyPerHour,
          ...globalConfig?.solarStats.efficiencyPerHour
        }
      };
    }

    /**
     * Build a powerSource object by combinding default values together with possible values from the global config.
     */
    function buildPowerSource(globalConfig?: ConfigParams): IPowerSourceCo2GramsPerKwh {
      return {
        ...PowerSourceCo2GramsPerKwh,
        ...globalConfig?.powerSource
      };
    }

      //Returns metadata and output to the IF
      return {
          metadata,
          execute,
    };
};

