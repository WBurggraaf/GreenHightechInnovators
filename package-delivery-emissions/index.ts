import { PluginInterface } from "../../interfaces";
import { PluginParams } from "../../types";
import { Route } from "./types/route";
import { Vehicle } from "./types/vehicle";
import { Battery, BatteryCycleStats } from './types/battery';
import { Grid } from "./types/grid";
import { Package } from "./types/package";
import { Weather } from "./types/weather";

export const PackageDeliveryEmissions = (): PluginInterface => {
    const metadata = { kind: 'execute' };

    /**
     * Executes the plugin for a list of input parameters.
     */
    async function execute(inputs: PluginParams[]) {
        // You breakup the inputs into single inputs. This is because a single manifest file can consist of mutliple inputs
        // In your manifest file you can specify something called defaults. These are also inside the pluginParams instead of in the config params. This can be used to have default values like for instance newable grid persentage
        return inputs.map(input => {
            const route = Route.toModel(input);
            const parcel = Package.toModel(input);
            const battery = Battery.toModel(input);
            const vehicle = Vehicle.toModel(input);
            const grid = Grid.toModel(input);
            const weather = Weather.toModel(input);

            const packageEstimatedDeliveryEmissionsGCo2e = calculateEstimatedDeliveryEmissions(grid, vehicle, route, parcel, battery);
            const batteryEnergyConsumptionKwh = calculateEnergyConsumption(vehicle, route, parcel);
            const batteryEnergySourceRenewablePercentage = calculateEnergySourceRenewablePercentage(grid, battery, 1);
            const batteryEmissionsFromEnergyGCo2e = calculateEmissionsFromEnergy(grid, vehicle, route, parcel);
            const batteryDegradationPerSegment = calculateBatteryDegradation(battery);
            const vehicleSuggestedMaintenanceIntervalInDays = calculateMaintenanceInterval(90, weather);

            //This returns a single frame back. You can either populate this with the input you can do it like this: ...input
            return {
                ...input,
                'package/estimated-delivery-emissions-g-co2e': packageEstimatedDeliveryEmissionsGCo2e,
                'battery/energy-consumption-kwh': batteryEnergyConsumptionKwh,
                'battery/energy-source-renewable-percentage': batteryEnergySourceRenewablePercentage,
                'battery/emissions-from-energy-g-co2e': batteryEmissionsFromEnergyGCo2e,
                'battery/degradation-per-segment': batteryDegradationPerSegment,
                'vehicle/update-suggested-maintenance-interval-in-days': vehicleSuggestedMaintenanceIntervalInDays
            }
        });
    }

    function calculateEmissionsFromEnergy(grid: Grid, vehicle: Vehicle, route: Route, parcel: Package): number {
        const energyConsumptionCurrentSegment = calculateEnergyConsumption(vehicle, route, parcel);
        return energyConsumptionCurrentSegment * grid.carbonIntensityGCo2ePerKwh;
    }

    function calculateEstimatedDeliveryEmissions(grid: Grid, vehicle: Vehicle, route: Route, parcel: Package, battery: Battery): number {
        // 1. Calculate energy consumption
        const energyConsumptionCurrentSegment = calculateEnergyConsumption(vehicle, route, parcel);
      
        // 2. Emissions from electricity use
        const gridEmissions = energyConsumptionCurrentSegment * grid.carbonIntensityGCo2ePerKwh;
      
        // 3. Vehicle embodied emissions allocation
        const batteryLifeSpanUsage = calculateBatteryDegradation(battery);
        const embodiedEmissions = vehicle.embodiedCarbonGCo2e * batteryLifeSpanUsage;
      
        // 4. Package's share of emissions (basic)
        const totalEmissions = gridEmissions + embodiedEmissions;
            
        return totalEmissions;
      }

    function calculateEnergyConsumption(vehicle: Vehicle, route: Route, parcel: Package, ): number {
        const inefficientyImpact = 1 / Math.max(0.001, efficiencyCurve(route.segmentRealTimeSpeed));
        const cargeWeightImpact = 1 / Math.max(0.001, cargoWeightEffiecencyPercentage(parcel.weight));

        const energyConsumptionCurrentSegment = route.segmentDistance * vehicle.kwhPerKm * inefficientyImpact * cargeWeightImpact;
        return energyConsumptionCurrentSegment;
    }

    function cargoWeightEffiecencyPercentage(cargoWeight: number): number {
        //Rough estition of efficiency based on the cargo weight is a drop of 1% per 25kg (based on a for F150)
        return Math.max(0.5, 1 - (cargoWeight / 25) * 0.01);
    }

    function calculateBatteryDegradation(battery: Battery): number {
        let dischargeAmount = battery.currentSoc * battery.maxCapacityMah / 10000;
        let dischargePercentage = dischargeAmount / battery.maxCapacityMah;

        //Assume a charging cycle is between 20 and 80% of the battery capacity
        //So one cycle is 60% of the battery capacity
        let dischargeCyclePercentage = dischargePercentage / 0.6;
        return dischargeCyclePercentage / BatteryCycleStats.ChargingCycleCount(battery);
    }

    function calculateEnergySourceRenewablePercentage(grid: Grid, battery: Battery, transmissionLossFactor: number): number {
        // Step 1: Base value from grid
        let renewablePercentage = grid.carbonAverageRenewableEnergyPercentage;

        // Step 2: Adjust for losses
        renewablePercentage *= (1 - transmissionLossFactor);

        // Step 3 (Optional): Preference for renewable charging 
        if (battery?.expectedPercentageRenewableEnergy) {
            const preferenceFactor = 0.5;  // Adjust as needed (0 - ignore, 1 - full preference)
            renewablePercentage = (renewablePercentage * (1 - preferenceFactor)) +
                (battery.expectedPercentageRenewableEnergy * preferenceFactor);
        }

        // Ensure result is within 0 - 100 range
        return Math.max(0, Math.min(100, renewablePercentage));
    }

    function efficiencyCurve(speed: number): number {
        //Rough estimation of efficiency curve based on real efficiency curves of an Tesla Model 3 at ~20 degrees celcius

        if(speed < 10)
            return 0.3;
        else if(speed < 20)
            return 0.45;
        else if(speed < 30)
            return 0.6;
        else if(speed < 40)
            return 0.85;
        else if(speed < 50)
            return 1;
        else if(speed < 60)
            return 95;
        else if(speed < 70)
            return 0.90;
        else if(speed < 80)
            return 0.85;
        else if(speed < 90)
            return 0.80;
        else if(speed < 100)
            return 0.75;
        else if(speed < 110)
            return 0.70;
        else if(speed < 120)
            return 0.65;
        else if(speed < 130)
            return 0.60;
        else if(speed < 140)
            return 0.55;
        else if(speed < 150) 
            return 0.50;
        else if(speed < 160)
            return 0.45;

        return 0.4;
    }

    function calculateMaintenanceInterval(
        baselineInterval: number, 
        weatherData: Weather
      ): number {
        let adjustmentFactor = 0; 
      
        // Temperature Adjustment (Unchanged)
        if (weatherData.temperatureInCelsius < 0) { 
          adjustmentFactor -= 0.1; 
        } else if (weatherData.temperatureInCelsius > 35) {
          adjustmentFactor -= 0.05;
        }
      
        // Rainfall Adjustment 
        if (weatherData.rainfallInMillimeter > 50) {
          adjustmentFactor -= 0.02; 
        }
      
        // Wind Speed Adjustment
        if (weatherData.windSpeedInKmh > 50) { 
          adjustmentFactor -= 0.01; // Decrease by 1% for strong winds
        }
      
        // Calculate adjusted interval
        const adjustedInterval = Math.max(baselineInterval * (1 + adjustmentFactor), 30);
        return adjustedInterval; 
      }

    return {
        metadata,
        execute
    }
}