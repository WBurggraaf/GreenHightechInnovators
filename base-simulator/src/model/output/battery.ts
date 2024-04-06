
import { ListHelper } from "../../helpers/listHelper";
import { MaterialQuantity } from "../../interfaces/materialQuantity";
import { Output } from "../../interfaces/output";
import { BatteryState } from "../enums/batteryState";
import { ChargeUnit } from "../enums/chargeUnit";
import { TemperatureUnit } from "../enums/temperatureUnit";


export class Battery implements Output {
    activeCellMaterials: MaterialQuantity[] = [];
    amountChargedMah: number = 0;
    batteryEfficiency: number = 0;
    chargeCycle: number = 0;
    chemistry: String = '';
    currentSoc: number = 0;
    directCarbonEmissions: number = 0;
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
    state: BatteryState = BatteryState.IDLE;
    structuralComponents: MaterialQuantity[] = [];
    temperature: number = 0;
    temperatureUnit: TemperatureUnit = TemperatureUnit.KELVIN;
    
    toImpactFramework(): object {
        return {
            'battery/active-cell-materials': ListHelper.parseMaterialsQuantityToString(this.activeCellMaterials),
            'battery/amount-charged-mah': this.amountChargedMah,
            'battery/battery-efficiency': this.batteryEfficiency,
            'battery/charge-cycle': this.chargeCycle,
            'battery/chemistry': this.chemistry,
            'battery/current-soc': this.currentSoc,
            'battery/direct-carbon-emissions': this.directCarbonEmissions,
            'battery/efficiency': this.efficiency,
            'battery/energy-efficiency-lost-power-kwh': this.energyEfficiencyLostPowerKwh,
            'battery/expected-charging-delay-in-minutes': this.expectedChargingDelayInMinutes,
            'battery/expected-efficiency': this.expectedEfficiency,
            'battery/expected-life-span-in-years': this.expectedLifeSpanInYears,
            'battery/expected-percentage-renewable-energy': this.expectedPercentageRenewableEnergy,
            'battery/id': this.id,
            'battery/max-capacity-mah': this.maxCapacityMah,
            'battery/max-pack-voltage': this.maxPackVoltage,
            'battery/percentage-current-is-renewable': this.percentageCurrentIsRenewable,
            'battery/production-location': this.productionLocation,
            'battery/soc-start': this.socStart,
            'battery/soh': this.soh,
            'battery/soh-after-charge': this.sohAfterCharge,
            'battery/state': this.state,
            'battery/structural-components': ListHelper.parseMaterialsQuantityToString(this.structuralComponents),
            'battery/temperature': this.temperature,
            'battery/temperature-unit': this.temperatureUnit
        }
    }
}