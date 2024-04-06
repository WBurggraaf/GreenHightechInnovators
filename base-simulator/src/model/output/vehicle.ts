
import { FuelType } from "../enums/fuelType";
import { VehicleType } from "../enums/vehicleType";
import { MaterialQuantity } from "../../interfaces/materialQuantity";
import { WeigthUnit } from '../enums/weigthUnit';
import { ListHelper } from "../../helpers/listHelper";
import { Output } from "../../interfaces/output";
import { BatteryType } from "../../simulators/models/enums/batteryType";

export class Vehicle implements Output {
    batteryType: BatteryType = BatteryType.NMC;
    converterEfficiency: number = 0;
    cableEfficiency: number = 0;
    emissionsFactorGCo2ePerUnit: number = 0;
    emissionsFactorGCo2eUnit: String = '';
    embodiedCarbonGCo2e: number = 0;
    expectedLifespanInYears: number = 0;
    fuelType: FuelType = FuelType.ELECTRIC;
    id: number = 0;
    kwhPerKm: number = 0;
    manufacturer: String = '';
    materialsBreakdown: MaterialQuantity[] = [];
    name: String = '';
    resourceDepletionWaterM3: number = 0;
    suggestedMaintenanceIntervalInDays: number = 0;
    type: VehicleType = VehicleType.VAN;
    weigth: number = 0;
    weigthUnit: WeigthUnit = WeigthUnit.Kg;

    toImpactFramework(): object {
        return {
            'vehicle/battery-type': this.batteryType,
            'vehicle/converter-efficiency': this.converterEfficiency,
            'vehicle/cable-efficiency': this.cableEfficiency,
            'vehicle/emissions-factor-g-co2e-per-unit': this.emissionsFactorGCo2ePerUnit,
            'vehicle/emissions-factor-g-co2e-unit': this.emissionsFactorGCo2eUnit,
            'vehicle/embodied-carbon-g-co2e': this.embodiedCarbonGCo2e,
            'vehicle/expected-lifespan-in-years': this.expectedLifespanInYears,
            'vehicle/fuel-type': this.fuelType,
            'vehicle/id': this.id,
            'vehicle/kwh-per-km': this.kwhPerKm,
            'vehicle/manufacturer': this.manufacturer,
            'vehicle/materials-breakdown': ListHelper.parseMaterialsQuantityToString(this.materialsBreakdown),
            'vehicle/name': this.name,
            'vehicle/resource-depletion-water-m3': this.resourceDepletionWaterM3,
            'vehicle/suggested-maintenance-interval-in-days': this.suggestedMaintenanceIntervalInDays,
            'vehicle/type': this.type,
            'vehicle/weigth': this.weigth,
            'vehicle/weigth-unit': this.weigthUnit,
        };
    }
}

