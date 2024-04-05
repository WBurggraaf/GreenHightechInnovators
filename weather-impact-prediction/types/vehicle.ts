import {PluginParams} from "../../../types";
import {FuelType} from "./enums/fuelType";
import {VehicleType} from "./enums/vehicleType";
import {BatteryType} from "./enums/batteryType";

export class Vehicle {
  batteryType: BatteryType = BatteryType.NMC;
  converterEfficiency: number = 0;
  cableEfficiency: number = 0;
  embodiedCarbonGCo2e: number = 0;
  fuelType: FuelType = FuelType.ELECTRIC;
  id: number = 0;
  name: String = '';
  resourceDepletionWaterM3: number = 0;
  suggestedMaintenanceIntervalInDays: number = 0;
  type: VehicleType = VehicleType.VAN;

    static toModel(inputParams: PluginParams): Vehicle {
      let vehicle = new Vehicle();
      vehicle.batteryType = inputParams['vehicle/battery-type'];
      vehicle.converterEfficiency = inputParams['vehicle/converter-efficiency'];
      vehicle.cableEfficiency = inputParams['vehicle/cable-efficiency'];
      if (inputParams['vehicle/fuel-type']) {
          let fuelTypeKey: keyof typeof FuelType = inputParams['vehicle/fuel-type'].toUpperCase();
          vehicle.fuelType = FuelType[fuelTypeKey];
      }   
      vehicle.id = inputParams['vehicle/id'];
      vehicle.name = inputParams['vehicle/name'];
      vehicle.suggestedMaintenanceIntervalInDays = inputParams['vehicle/suggested-maintenance-interval-in-days'];

      if (inputParams['vehicle/type']) {
          let vehicleTypeKey: keyof typeof VehicleType = inputParams['vehicle/type'].toUpperCase();
          vehicle.type = VehicleType[vehicleTypeKey];
      }

      return vehicle;
    }
}

export class BatteryStats {
    //guess based on driving rage from this graph: https://youtu.be/cwiG3dZgAaw?feature=shared&t=177
    static EfficiencyLithiumIronPhosphate(tempInC: number) : number {
      if(tempInC <= 20)
        return 0.03;
      else if(tempInC < 10)
        return 0.833 * ((tempInC+20)/29);
      else if(tempInC <= 60)
        return 0.833 + 0.177 * ((tempInC-10)/50);
      else
        return 1;
    }

  static EfficiencyLithiumNickelManganeseCobalt(tempInC: number) : number {
    if(tempInC <= 20)
      return 0.38;
    else if(tempInC < 10)
      return 0.89 * ((tempInC+20)/29);
    else if(tempInC <= 22)
      return 0.89 + 0.11 * ((tempInC-10)/12);
    else if(tempInC <= 60)
      return 1 - 0.1 * (tempInC-22)/38;
    else
      return 0.9;
  }
}
