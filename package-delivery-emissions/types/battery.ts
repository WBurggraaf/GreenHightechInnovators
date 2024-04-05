import { PluginParams } from "../../../types";
import { BatteryState } from "./enums/batteryState";
import { TemperatureUnit } from "./enums/tempratureUnit";

export class Battery {
   amountChargedMah: number = 0;
   batteryEfficiency: number = 0;
   chargeCycle: number = 0;
   chemistry: String = '';
   currentSoc: number = 0;
   directCarbonEmissions: number = 0;
   directCarbonEmissionsGCo2e: number = 0;
   efficiency: number = 0;
   energyEfficiencyLostPowerKwh: number = 0;
   expectedChargingDelayInMinutes: number = 0;
   expectedEfficiency: number = 0;
   expectedLifeSpanInYears: number = 0;
   expectedPercentageRenewableEnergy: number = 0;
   id: number = 0;
   maxCapacityMah: number = 0;
   maxPackVoltage: number = 0;
   percentageCurrentIsRenewable: number = 0;
   productionLocation: String = '';
   socStart: number = 0;
   soh: number = 0;
   sohAfterCharge: number = 0;
   sohAfterCharging: number = 0;
   state: BatteryState = BatteryState.IDLE;
   temperature: number = 0;
   temperatureUnit: TemperatureUnit = TemperatureUnit.KELVIN;

   static toModel(inputData: PluginParams): Battery {
      let battery = new Battery();

      battery.amountChargedMah = inputData['battery/amount-charged-mah'];
      battery.batteryEfficiency = inputData['battery/battery-efficiency'];
      battery.chargeCycle = inputData['battery/charge-cycle'];
      battery.chemistry = inputData['battery/chemistry'];
      battery.currentSoc = inputData['battery/current-soc'];
      battery.directCarbonEmissions = inputData['battery/direct-carbon-emissions'];
      battery.directCarbonEmissionsGCo2e = inputData['battery/direct-carbon-emissions-g-co2e'];
      battery.efficiency = inputData['battery/efficiency'];
      battery.energyEfficiencyLostPowerKwh = inputData['battery/energy-efficiency-lost-power-kwh'];
      battery.expectedChargingDelayInMinutes = inputData['battery/expected-charging-delay-in-minutes'];
      battery.expectedEfficiency = inputData['battery/expected-efficiency'];
      battery.expectedLifeSpanInYears = inputData['battery/expected-life-span-in-years'];
      battery.expectedPercentageRenewableEnergy = inputData['battery/expected-percentage-renewable-energy'];
      battery.id = inputData['battery/id'];
      battery.maxCapacityMah = inputData['battery/max-capacity-mah'];
      battery.maxPackVoltage = inputData['battery/max-pack-voltage'];
      battery.percentageCurrentIsRenewable = inputData['battery/percentage-current-is-renewable'];
      battery.productionLocation = inputData['battery/production-location'];
      battery.socStart = inputData['battery/soc-start'];
      battery.soh = inputData['battery/soh'];
      battery.sohAfterCharge = inputData['battery/soh-after-charge'];
      battery.sohAfterCharging = inputData['battery/soh-after-charging'];
      battery.state = inputData['battery/state'];
      battery.temperature = inputData['battery/temperature'];
      battery.temperatureUnit = inputData['battery/temperature-unit'];

      return battery;
   }
}

export class BatteryCycleStats {
   static ChargingCycleCount(battery: Battery): number {
       if(battery.chemistry == 'LFP') {
           return 5000;
       } else if(battery.chemistry == 'NMC') {
           return 2000;
       }

       return 1000;
   };
}