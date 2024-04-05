import { PluginParams } from "../../../types";
import { BatteryState } from "./enums/batteryState";
import { TemperatureUnit } from "./enums/temperatureUnit";


export class Battery {
   amountChargedMah: number = 0;
   batteryEfficiency: number = 0;
   chargeCycle: number = 0;
   currentSoc: number = 0;
   efficiency: number = 0;
   expectedChargingDelayInMinutes: number = 0;
   expectedEfficiency: number = 0;
   expectedPercentageRenewableEnergy: number = 0;
   id: number = 0;
   maxCapacityMah: number = 0;
   maxPackVoltage: number = 0;
   socStart: number = 0;
   soh: number = 0;
   state: BatteryState = BatteryState.IDLE;
   temperature: number = 0;
   temperatureUnit: TemperatureUnit = TemperatureUnit.KELVIN;
   
   static toModel(inputData: PluginParams): Battery {
      let battery = new Battery();

      battery.amountChargedMah = inputData['battery/amount-charged-mah'];
      battery.batteryEfficiency = inputData['battery/battery-efficiency'];
      battery.chargeCycle = inputData['battery/charge-cycle'];
      battery.currentSoc = inputData['battery/current-soc'];
      battery.efficiency = inputData['battery/efficiency'];
      battery.expectedEfficiency = inputData['battery/expected-efficiency'];
      battery.expectedChargingDelayInMinutes = inputData['battery/expected-charging-delay-in-minutes'];
      battery.expectedPercentageRenewableEnergy = inputData['battery/expected-percentage-renewable-energy'];
      battery.id = inputData['battery/id'];
      battery.maxCapacityMah = inputData['battery/max-capacity-mah'];
      battery.maxPackVoltage = inputData['battery/max-pack-voltage'];
      battery.socStart = inputData['battery/soc-start'];
      battery.soh = inputData['battery/soh'];
      battery.state = inputData['battery/state'];
      battery.temperature = inputData['battery/temperature'];
      battery.temperatureUnit = inputData['battery/temperature-unit'];

      return battery;
   }
}