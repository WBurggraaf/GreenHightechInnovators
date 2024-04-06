import { ForcastObservation } from "./forcastObservation";

export class WeatherRelatedToPowerGenerationKnowledge {

    private getRandomNumber(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    public calculateBioPercentage(forcastObservation: ForcastObservation, currentTotalPercentage: number): number {
        // We'll calculate bioenergy production based on weather conditions

        // Calculate temperature and rainfall factors
        const temperatureFactor = forcastObservation.temperatureInCelsius / 40; // Normalize temperature between 0 and 1
        const rainfallFactor = forcastObservation.rainfallInMillimeter / 50; // Normalize rainfall between 0 and 1

        // Calculate max bioenergy production based on temperature and rainfall
        const maxBioEnergyProduction = 100 * temperatureFactor * rainfallFactor; // Maximum potential bioenergy production in kWh

        // Calculate available bioenergy production based on remaining percentage and maximum potential
        const remainingPercentage = 100 - currentTotalPercentage;
        const bioEnergyProduction = (remainingPercentage / 100) * maxBioEnergyProduction;

        // Return the estimated bioenergy production
        return Math.round(bioEnergyProduction); // Round to nearest whole number (kWh)
    }

    public calculateCarbonIntensity(forecast: ForcastObservation, currentTotalPercentage: number): number {
        // We'll calculate carbon intensity based on temperature and wind speed
        // Example: Carbon intensity increases with higher temperature and wind speed
        const temperatureFactor = forecast.temperatureInCelsius / 40; // Assuming max temperature is 40 degrees Celsius
        const windSpeedFactor = forecast.windSpeedInKmh / 50; // Assuming max wind speed is 50 km/h

        // Assuming base carbon intensity is between 200 and 500
        const baseCarbonIntensity = this.getRandomNumber(200, 500);
        // Calculate maxCarbonIntensity based on factors
        const remainingPercentage = 100 - currentTotalPercentage;
        const maxCarbonIntensity = Math.min(remainingPercentage, baseCarbonIntensity * temperatureFactor * windSpeedFactor); // Max carbon intensity scales with temperature and wind speed

        // Ensure maxCarbonIntensity doesn't exceed remaining percentage
        return this.getRandomNumber(0, maxCarbonIntensity);
    }

    public calculateCoalBituminousPercentage(forecast: ForcastObservation, currentTotalPercentage: number): number {
        // We'll calculate coal bituminous percentage based on cloud coverage and wind speed
        // Example: Coal bituminous percentage increases with higher cloud coverage and wind speed
        const cloudCoverageFactor = forecast.cloudCoveragePercentage / 100; // Assuming max cloud coverage is 100%
        const windSpeedFactor = forecast.windSpeedInKmh / 50; // Assuming max wind speed is 50 km/h

        // Assuming base coal bituminous percentage is between 0 and 20
        const baseCoalBituminousPercentage = this.getRandomNumber(0, 20);
        // Calculate maxCoalBituminousPercentage based on factors
        const remainingPercentage = 100 - currentTotalPercentage;
        const maxCoalBituminousPercentage = Math.min(remainingPercentage, baseCoalBituminousPercentage * cloudCoverageFactor * windSpeedFactor); // Max coal bituminous percentage scales with cloud coverage and wind speed

        // Ensure maxCoalBituminousPercentage doesn't exceed remaining percentage
        return this.getRandomNumber(0, maxCoalBituminousPercentage);
    }

    public calculateCoalSubBituminousPercentage(forecast: ForcastObservation, currentTotalPercentage: number): number {
        // We'll calculate coal sub-bituminous percentage based on rainfall and visibility
        // Example: Coal sub-bituminous percentage increases with higher rainfall and lower visibility
        const rainfallFactor = forecast.rainfallInMillimeter / 50; // Assuming max rainfall is 50 millimeters
        const visibilityFactor = (100 - forecast.visibilityInMeters) / 10000; // Assuming max visibility is 10,000 meters

        // Assuming base coal sub-bituminous percentage is between 0 and 20
        const baseCoalSubBituminousPercentage = this.getRandomNumber(0, 20);
        // Calculate maxCoalSubBituminousPercentage based on factors
        const remainingPercentage = 100 - currentTotalPercentage;
        const maxCoalSubBituminousPercentage = Math.min(remainingPercentage, baseCoalSubBituminousPercentage * rainfallFactor * visibilityFactor); // Max coal sub-bituminous percentage scales with rainfall and visibility

        // Ensure maxCoalSubBituminousPercentage doesn't exceed remaining percentage
        return this.getRandomNumber(0, maxCoalSubBituminousPercentage);
    }

    public calculateCoalLignitePercentage(forecast: ForcastObservation, currentTotalPercentage: number): number {
        // We'll calculate coal lignite percentage based on wind speed and cloud coverage
        // Example: Coal lignite percentage increases with higher wind speed and cloud coverage
        const windSpeedFactor = forecast.windSpeedInKmh / 50; // Assuming max wind speed is 50 km/h
        const cloudCoverageFactor = forecast.cloudCoveragePercentage / 100; // Assuming max cloud coverage is 100%

        // Assuming base coal lignite percentage is between 0 and 20
        const baseCoalLignitePercentage = this.getRandomNumber(0, 20);
        // Calculate maxCoalLignitePercentage based on factors
        const remainingPercentage = 100 - currentTotalPercentage;
        const maxCoalLignitePercentage = Math.min(remainingPercentage, baseCoalLignitePercentage * windSpeedFactor * cloudCoverageFactor); // Max coal lignite percentage scales with wind speed and cloud coverage

        // Ensure maxCoalLignitePercentage doesn't exceed remaining percentage
        return this.getRandomNumber(0, maxCoalLignitePercentage);
    }

    public calculateGasPercentage(forecast: ForcastObservation, currentTotalPercentage: number): number {
        // We'll calculate gas percentage based on temperature and cloud coverage
        // Example: Gas percentage increases with higher temperature and cloud coverage
        const temperatureFactor = forecast.temperatureInCelsius / 40; // Assuming max temperature is 40 degrees Celsius
        const cloudCoverageFactor = forecast.cloudCoveragePercentage / 100; // Assuming max cloud coverage is 100%

        // Assuming base gas percentage is between 0 and 40
        const baseGasPercentage = this.getRandomNumber(0, 40);
        // Calculate maxGasPercentage based on factors
        const remainingPercentage = 100 - currentTotalPercentage;
        const maxGasPercentage = Math.min(remainingPercentage, baseGasPercentage * temperatureFactor * cloudCoverageFactor); // Max gas percentage scales with temperature and cloud coverage

        // Ensure maxGasPercentage doesn't exceed remaining percentage
        return this.getRandomNumber(0, maxGasPercentage);
    }

    public calculateGeothermalPercentage(forecast: ForcastObservation, currentTotalPercentage: number): number {
        // We'll calculate geothermal percentage based on temperature and wind speed
        // Example: Geothermal percentage increases with higher temperature and lower wind speed
        const temperatureFactor = forecast.temperatureInCelsius / 40; // Assuming max temperature is 40 degrees Celsius
        const windSpeedFactor = (50 - forecast.windSpeedInKmh) / 50; // Assuming max wind speed is 50 km/h

        // Assuming base geothermal percentage is between 0 and 30
        const baseGeothermalPercentage = this.getRandomNumber(0, 30);
        // Calculate maxGeothermalPercentage based on factors
        const remainingPercentage = 100 - currentTotalPercentage;
        const maxGeothermalPercentage = Math.min(remainingPercentage, baseGeothermalPercentage * temperatureFactor * windSpeedFactor); // Max geothermal percentage scales with temperature and wind speed

        // Ensure maxGeothermalPercentage doesn't exceed remaining percentage
        return this.getRandomNumber(0, maxGeothermalPercentage);
    }

    public calculateHydroPercentage(forecast: ForcastObservation, currentTotalPercentage: number): number {
        // We'll calculate hydro percentage based on rainfall and cloud coverage
        // Example: Hydro percentage increases with higher rainfall and cloud coverage
        const rainfallFactor = forecast.rainfallInMillimeter / 50; // Assuming max rainfall is 50 millimeters
        const cloudCoverageFactor = forecast.cloudCoveragePercentage / 100; // Assuming max cloud coverage is 100%

        // Assuming base hydro percentage is between 0 and 30
        const baseHydroPercentage = this.getRandomNumber(0, 30);
        // Calculate maxHydroPercentage based on factors
        const remainingPercentage = 100 - currentTotalPercentage;
        const maxHydroPercentage = Math.min(remainingPercentage, baseHydroPercentage * rainfallFactor * cloudCoverageFactor); // Max hydro percentage scales with rainfall and cloud coverage

        // Ensure maxHydroPercentage doesn't exceed remaining percentage
        return this.getRandomNumber(0, maxHydroPercentage);
    }

    public calculateNuclearPercentage(forecast: ForcastObservation, currentTotalPercentage: number): number {
        // We'll calculate nuclear percentage based on temperature and cloud coverage
        // Example: Nuclear percentage increases with higher temperature and lower cloud coverage
        const temperatureFactor = forecast.temperatureInCelsius / 40; // Assuming max temperature is 40 degrees Celsius
        const cloudCoverageFactor = (100 - forecast.cloudCoveragePercentage) / 100; // Assuming max cloud coverage is 100%

        // Assuming base nuclear percentage is between 0 and 30
        const baseNuclearPercentage = this.getRandomNumber(0, 30);
        // Calculate maxNuclearPercentage based on factors
        const remainingPercentage = 100 - currentTotalPercentage;
        const maxNuclearPercentage = Math.min(remainingPercentage, baseNuclearPercentage * temperatureFactor * cloudCoverageFactor); // Max nuclear percentage scales with temperature and cloud coverage

        // Ensure maxNuclearPercentage doesn't exceed remaining percentage
        return this.getRandomNumber(0, maxNuclearPercentage);
    }

    public calculateOilPercentage(forecast: ForcastObservation, currentTotalPercentage: number): number {
        // We'll calculate oil percentage based on temperature and wind speed
        // Example: Oil percentage increases with higher temperature and wind speed
        const temperatureFactor = forecast.temperatureInCelsius / 40; // Assuming max temperature is 40 degrees Celsius
        const windSpeedFactor = forecast.windSpeedInKmh / 50; // Assuming max wind speed is 50 km/h

        // Assuming base oil percentage is between 0 and 30
        const baseOilPercentage = this.getRandomNumber(0, 30);
        // Calculate maxOilPercentage based on factors
        const remainingPercentage = 100 - currentTotalPercentage;
        const maxOilPercentage = Math.min(remainingPercentage, baseOilPercentage * temperatureFactor * windSpeedFactor); // Max oil percentage scales with temperature and wind speed

        // Ensure maxOilPercentage doesn't exceed remaining percentage
        return this.getRandomNumber(0, maxOilPercentage);
    }

    public calculateSolarPercentage(forecast: ForcastObservation, currentTotalPercentage: number): number {
        // We'll calculate solar percentage based on cloud coverage and visibility
        // Example: Solar percentage increases with lower cloud coverage and higher visibility
        const cloudCoverageFactor = (100 - forecast.cloudCoveragePercentage) / 100; // Assuming max cloud coverage is 100%
        const visibilityFactor = forecast.visibilityInMeters / 10000; // Assuming max visibility is 10,000 meters

        // Assuming base solar percentage is between 0 and 40
        const baseSolarPercentage = this.getRandomNumber(0, 40);
        // Calculate maxSolarPercentage based on factors
        const remainingPercentage = 100 - currentTotalPercentage;
        const maxSolarPercentage = Math.min(remainingPercentage, baseSolarPercentage * cloudCoverageFactor * visibilityFactor); // Max solar percentage scales with cloud coverage and visibility

        // Ensure maxSolarPercentage doesn't exceed remaining percentage
        return this.getRandomNumber(0, maxSolarPercentage);
    }

    public calculateWindPercentage(forecast: ForcastObservation, currentTotalPercentage: number): number {
        // We'll calculate wind percentage based on wind speed and cloud coverage
        // Example: Wind percentage increases with higher wind speed and lower cloud coverage
        const windSpeedFactor = forecast.windSpeedInKmh / 50; // Assuming max wind speed is 50 km/h
        const cloudCoverageFactor = (100 - forecast.cloudCoveragePercentage) / 100; // Assuming max cloud coverage is 100%

        // Assuming base wind percentage is between 0 and 30
        const baseWindPercentage = this.getRandomNumber(0, 30);
        // Calculate maxWindPercentage based on factors
        const remainingPercentage = 100 - currentTotalPercentage;
        const maxWindPercentage = Math.min(remainingPercentage, baseWindPercentage * windSpeedFactor * cloudCoverageFactor); // Max wind percentage scales with wind speed and cloud coverage

        // Ensure maxWindPercentage doesn't exceed remaining percentage
        return this.getRandomNumber(0, maxWindPercentage);
    }

}