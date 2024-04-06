import { VehicleInspection } from '../models/vehicleInspection';
import { BatteryInspection } from '../models/batteryInspection';
import { VehicleAssessment } from '../models/vehicleAssessment';
import { Vehicle } from '../models/verhicle';
import { GeoLocation } from '../models/geoLocation';
import { DateRange } from '../models/dateRange';
import { GridObservation } from '../models/gridObservation';
import { ForcastObservation } from '../models/forcastObservation';
import { ImpactObservation } from '../models/impactObservation';
import { BatteryState } from '../models/enums/batteryState';
import { TemperatureUnit } from '../models/enums/tempratureUnit';
import { FuelType } from '../models/enums/fuelType';
import { WeigthUnit } from '../../model/enums/weigthUnit';
import { BatteryType } from '../models/enums/batteryType';
import { MaterialKnowledge } from '../models/materialKnowledge';
import { ChargingStation } from '../models/chargingStation';
import { WeatherRelatedToPowerGenerationKnowledge } from '../models/weatherRelatedToPowerGenerationKnowledge';

export class FleetEngineer {
    vehicleAssessmentObservations(vehicle: Vehicle): VehicleAssessment {

        let returnValue: VehicleAssessment = new VehicleAssessment();

        returnValue.timestamp = new Date().toISOString();

        returnValue.vehicleInspection = this.measureVehicle(vehicle);

        returnValue.batteryInspection = this.measureBattery(vehicle);

        return returnValue;
    }

    private measureVehicle(vehicle: Vehicle): VehicleInspection {
        let returnValue: VehicleInspection = new VehicleInspection();

        // Found vehicle!
        returnValue.vehicle = vehicle;
        returnValue.id = vehicle.id;
        returnValue.manufacturer = vehicle.manufacturer;
        returnValue.name = vehicle.name;
        returnValue.type = vehicle.type;

        // Fill in properties with random values
        returnValue.batteryType = BatteryType.LFP;
        returnValue.cableEfficiency = returnValue.getRandomNumber(80, 99);
        returnValue.converterEfficiency = returnValue.getRandomNumber(90, 96);
        returnValue.emissionsFactorGCo2ePerUnit = 0;
        returnValue.emissionsFactorGCo2eUnit = "kg";
        returnValue.expectedLifespanInYears = returnValue.getRandomNumber(15, 25);
        returnValue.fuelType = FuelType.ELECTRIC;
        returnValue.materialsBreakdown = new MaterialKnowledge().getMaterialBreakdown();
        returnValue.suggestedMaintenanceIntervalInDays = 90;
        returnValue.weigth = 6000; //static
        returnValue.weigthUnit = WeigthUnit.Kg;

        return returnValue;
    }
    private measureBattery(vehicle: Vehicle): BatteryInspection {
        let returnValue: BatteryInspection = new BatteryInspection();

        //check the battery of this vehicle
        returnValue.vehicle = vehicle;

        // Fill in properties with random values
        returnValue.id = 1;
        returnValue.activeCellMaterials = new MaterialKnowledge().getActiveCellMaterials();
        returnValue.amountChargedMah = returnValue.getRandomNumber(9800, 10000);
        returnValue.chargeCycle = returnValue.getRandomNumber(2000, 3000);
        returnValue.chemistry = "LFP";
        returnValue.currentSoc = returnValue.getRandomNumber(80, 100);
        returnValue.efficiency = returnValue.getRandomNumber(90, 98);
        returnValue.expectedLifeSpanInYears = returnValue.getRandomNumber(8, 12);
        returnValue.expectedPercentageRenewableEnergy = returnValue.getRandomNumber(20, 80);
        returnValue.maxCapacityMah = returnValue.getRandomNumber(48000, 50000);
        returnValue.maxPackVoltage = returnValue.getRandomNumber(780, 800);
        returnValue.productionLocation = "South Korea";
        returnValue.socStart = returnValue.getRandomNumber(0, 100);
        returnValue.state = BatteryState.IDLE;
        returnValue.structuralComponents = new MaterialKnowledge().getStructuralComponents();
        returnValue.temperature = returnValue.getRandomNumber(10, 50);
        returnValue.temperatureUnit = TemperatureUnit.CELCIUS;

        return returnValue;
    }

    gatherImpactObservationsBasedOnConditionsAndForecasts(vehicleAssessment: VehicleAssessment, geoLocation: GeoLocation, dateRange: DateRange): ImpactObservation[] {
        const impactObservations: ImpactObservation[] = [];

        // Generate random weather data
        const startDate = dateRange.firstDate;
        const endDate = dateRange.lastDate;
        let currentDate = new Date(startDate);

        const forcastObservations: ForcastObservation[] = [];
        while (currentDate <= endDate) {
            const forcastObservation = new ForcastObservation();
            forcastObservation.timeStamp = currentDate.toISOString();
            forcastObservation.id = forcastObservations.length + 1;
            forcastObservation.latitude = geoLocation.lat;
            forcastObservation.longitude = geoLocation.long;

            // Generate random weather conditions
            forcastObservation.temperatureInCelsius = this.getRandomNumber(-10, 40); // Example range
            forcastObservation.rainfallInMillimeter = this.getRandomNumber(0, 50); // Example range
            forcastObservation.windSpeedInKmh = this.getRandomNumber(0, 50); // Example range
            forcastObservation.windDirectionInDegrees = this.getRandomNumber(0, 360); // Example range
            forcastObservation.cloudCoveragePercentage = this.getRandomNumber(0, 100); // Example range
            forcastObservation.visibilityInMeters = this.getRandomNumber(1000, 10000); // Example range
            forcastObservation.airPressureInHectopascal = this.getRandomNumber(900, 1100); // Example range

            forcastObservations.push(forcastObservation);

            currentDate.setDate(currentDate.getDate() + 1); // Move to next day
        }

        for (let index = 0; index < forcastObservations.length; index++) {
            const impactObservation = new ImpactObservation();

            const forcastObservation = forcastObservations[index];
            const gridObservation = new GridObservation();
            gridObservation.id = index + 1;

            let totalPercentage = 0;

            gridObservation.bio = new WeatherRelatedToPowerGenerationKnowledge().calculateBioPercentage(forcastObservation, totalPercentage);
            totalPercentage += gridObservation.bio;

            gridObservation.carbonIntensityGCo2ePerKwh = new WeatherRelatedToPowerGenerationKnowledge().calculateCarbonIntensity(forcastObservation, totalPercentage);
            totalPercentage += gridObservation.carbonIntensityGCo2ePerKwh;

            gridObservation.coalBituminous = new WeatherRelatedToPowerGenerationKnowledge().calculateCoalBituminousPercentage(forcastObservation, totalPercentage);
            totalPercentage += gridObservation.coalBituminous;

            gridObservation.coalSubBituminous = new WeatherRelatedToPowerGenerationKnowledge().calculateCoalSubBituminousPercentage(forcastObservation, totalPercentage);
            totalPercentage += gridObservation.coalSubBituminous;

            gridObservation.coalLignite = new WeatherRelatedToPowerGenerationKnowledge().calculateCoalLignitePercentage(forcastObservation, totalPercentage);
            totalPercentage += gridObservation.coalLignite;

            gridObservation.gas = new WeatherRelatedToPowerGenerationKnowledge().calculateGasPercentage(forcastObservation, totalPercentage);
            totalPercentage += gridObservation.gas;

            gridObservation.geothermal = new WeatherRelatedToPowerGenerationKnowledge().calculateGeothermalPercentage(forcastObservation, totalPercentage);
            totalPercentage += gridObservation.geothermal;

            gridObservation.hydro = new WeatherRelatedToPowerGenerationKnowledge().calculateHydroPercentage(forcastObservation, totalPercentage);
            totalPercentage += gridObservation.hydro;

            gridObservation.nuclear = new WeatherRelatedToPowerGenerationKnowledge().calculateNuclearPercentage(forcastObservation, totalPercentage);
            totalPercentage += gridObservation.nuclear;

            gridObservation.oil = new WeatherRelatedToPowerGenerationKnowledge().calculateOilPercentage(forcastObservation, totalPercentage);
            totalPercentage += gridObservation.oil;

            gridObservation.solar = new WeatherRelatedToPowerGenerationKnowledge().calculateSolarPercentage(forcastObservation, totalPercentage);
            totalPercentage += gridObservation.solar;

            gridObservation.wind = new WeatherRelatedToPowerGenerationKnowledge().calculateWindPercentage(forcastObservation, totalPercentage);
            totalPercentage += gridObservation.wind;

            if (vehicleAssessment.vehicleInspection) {
                this.remeasureVehicle(vehicleAssessment.vehicleInspection, forcastObservation, gridObservation);
                impactObservation.vehicleInspection = vehicleAssessment.vehicleInspection;
            }

            if (vehicleAssessment.batteryInspection) {
                this.remeasureBattery(vehicleAssessment.batteryInspection, forcastObservation, gridObservation);
                impactObservation.batteryInspection = vehicleAssessment.batteryInspection;
            }

            impactObservation.forcastObservation = forcastObservation;
            impactObservation.gridObservation = gridObservation;

            impactObservation.timestamp = forcastObservation.timeStamp;

            impactObservations.push(impactObservation);
        }

        return impactObservations;
    }

        // Utility methods for generating random data
    private getRandomNumber(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    private remeasureVehicle(vehicleInspection: VehicleInspection, forcastObservation: ForcastObservation, gridObservation: GridObservation) {
        //returnValue.cableEfficiency = 0;
        //returnValue.converterEfficiency = 0;
        vehicleInspection.suggestedMaintenanceIntervalInDays = vehicleInspection.suggestedMaintenanceIntervalInDays;
    }

    private remeasureBattery(batteryInspection: BatteryInspection, forcastObservation: ForcastObservation, gridObservation: GridObservation) {
        batteryInspection.temperature = forcastObservation.temperatureInCelsius + 10;
    }

    inspectElectricChargingStationsPresent(
        location: GeoLocation
    ): ChargingStation[] {
        const chargingStations: ChargingStation[] = [];

        // Define different types of charging stations
        const types = [
            { name: "Fast Charging", type: 1, converterEfficiency: 0.85, cableEfficiency: 0.92 },
            { name: "Slow Charging", type: 2, converterEfficiency: 0.8, cableEfficiency: 0.9 }
            // Add more types as needed
        ];

        // Generate charging stations for each type
        types.forEach((chargingType, index) => {
            const chargingStation = new ChargingStation();
            chargingStation.id = index + 1; // Assign unique ID
            chargingStation.type = chargingType.type;
            chargingStation.converterEfficiency = chargingType.converterEfficiency;
            chargingStation.cableEfficiency = chargingType.cableEfficiency;
            chargingStation.locationLat = location.lat;
            chargingStation.locationIng = location.long;
            chargingStations.push(chargingStation);
        });

        return chargingStations;
    }
}
