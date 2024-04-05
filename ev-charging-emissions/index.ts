import { PluginInterface } from "../../interfaces";
import { ConfigParams, PluginParams } from "../../types/common";
import { Battery } from "./types/battery";
import { Grid } from "./types/grid";
import { ChargingStation } from "./types/chargingStation";
import { BatteryState } from "./types/enums/batteryState";
import { Vehicle } from "./types/vehicle";

//The main method that is considered the plugin name. It has to extend PluginInterface for it to be picked up. You also have to implement the async execute function below.
export const EvChargingEmissions = (globalConfig?: ConfigParams): PluginInterface => {
    const metadata = {kind: 'execute'};

    /**
     * Executes the plugin for a list of input parameters.
     */
     async function execute (inputs: PluginParams[]) {
        // You breakup the inputs into single inputs. This is because a single manifest file can consist of mutliple inputs
        // In your manifest file you can specify something called defaults. These are also inside the pluginParams instead of in the config params. This can be used to have default values like for instance newable grid percentage

        const percentageGridRenewableEnergy = globalConfig?.options.averageRenewableEnergyPercentageGrid;
        return inputs.map(input => {

            const battery = Battery.toModel(input);
            const grid = Grid.toModel(input);
            const vehicle = Vehicle.toModel(input);
            const chargeStation = ChargingStation.toModel(input);

            const percentageCurrentIsRenewable = calculatePercentageRenewableBattery(battery, percentageGridRenewableEnergy);
            const predicatedStateOfHealth = calculateStateOfHealth(battery);
            const energyEfficiencyLost = calculateEnergyLossCharging(battery, chargeStation, vehicle);
            const directCarbonEmissions = calculateDirectCarbonEmissions(battery, grid, energyEfficiencyLost);

            //This returns a single frame back. You can either populate this with the input you can do it like this: ...input
            return {
                ...input,
                'battery/energy-efficiency-lost-power-kwh': energyEfficiencyLost,
                'battery/soh-after-charging': predicatedStateOfHealth,
                'battery/direct-carbon-emissions-g-co2e': directCarbonEmissions,
                'battery/percentage-current-is-renewable': percentageCurrentIsRenewable
            }
        });
    }

    /**
     * Calcute energy efficiencly loss based on the type of charging was done
     */
    function calculateEnergyLossCharging (battery: Battery, charger: ChargingStation, vehicle: Vehicle): number {
        let times: Array<number> = [
            charger.cableEfficiency,
            vehicle.cableEfficiency, 
            battery.efficiency
        ];

        //Based on if the converter in the car is used or in the DC fast charger.
        switch (charger.type) {
            case 1:
            case 2:
                times.fill(vehicle.converterEfficiency);
            break;
            case 3:
                times.fill(charger.converterEfficiency);
            break;
        }

        const averageEnergyEfficiency = times.reduce((a,b) => (a+b)) / times.length
        const averageEnergyLoss = (100 - averageEnergyEfficiency)
        const killoWattHourCharged = calculateKiloWattHourCharged(battery);

        return killoWattHourCharged*(averageEnergyLoss/100);
    } 


    /**
     * Calcuate direct carbon Emissions from a charging session
     */
    function calculateDirectCarbonEmissions (battery: Battery, grid: Grid, energyLostKwh: number) {
        const kiloWattHourCharged = calculateKiloWattHourCharged(battery) + energyLostKwh;

        return kiloWattHourCharged * grid.carbonIntensityGCo2ePerKwh;
    }

    /**
     * Calculates the percentage of rewable energy over the whole 
     */
    function calculatePercentageRenewableBattery (battery: Battery, percentageGridRenewableEnergy: number): number {

        const percentageOfTheCurrentBattery = (battery.currentSoc - battery.socStart) / 100 * battery.expectedPercentageRenewableEnergy;
        const percentageAlreadyThere = battery.socStart / 100 * percentageGridRenewableEnergy;
 
        const batteryPercentageRenewable = (percentageOfTheCurrentBattery + percentageAlreadyThere)/ 2;

        return batteryPercentageRenewable;
    };

    /**
     * Calculates the battery health. This is based on the max rated capacity vs the actual max capacity.
     */
    function calculateStateOfHealth (battery: Battery): number {
        let currentStateOfHealth: number = 0;

            switch (battery.state) {
                case BatteryState.CHARGING:
                    const currentMaxChargingCapacity = battery.amountChargedMah / (battery.currentSoc - battery.socStart) * 100;
                    currentStateOfHealth = (currentMaxChargingCapacity - battery.maxCapacityMah) / battery.maxCapacityMah * 100 + 100;
                    break;
            }

        return currentStateOfHealth;
    };

    function calculateKiloWattHourCharged(battery: Battery): number {
        const wattHourCharged = (battery.amountChargedMah / 1000) * battery.maxPackVoltage / 1000;
        return wattHourCharged / 1000;
    }

    //Returns metadata and output to the IF
    return {
        metadata,
        execute,
    };
};

