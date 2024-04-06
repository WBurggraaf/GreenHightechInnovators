import { Material } from "../../interfaces/enums/material";
import { MaterialQuantity } from "../../interfaces/materialQuantity";
import { Vehicle as VehicleBase } from "../../model/output/vehicle";
import { Vehicle as VehicleChild } from "./verhicle"

export class VehicleInspection extends VehicleBase {
    vehicle: VehicleChild  | undefined;
    timestamp: string = "";

    getRandomNumber(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    getRandomMaterialBreakdown(): MaterialQuantity[] {
        const materialQuantities: MaterialQuantity[] = [
            { material: Material.STEEL, amount: this.getRandomNumber(1650000, 2050000) },
            { material: Material.ALUMINUM, amount: this.getRandomNumber(730000, 790000) },
            { material: Material.PLASTICS, amount: this.getRandomNumber(280000, 320000) },
            { material: Material.COPPER, amount: this.getRandomNumber(68000, 72000) },
            { material: Material.GLASS, amount: this.getRandomNumber(90000, 100000) },
            { material: Material.RUBBER, amount: this.getRandomNumber(40000, 50000) },
            { material: Material.RARE_EARTHS, amount: this.getRandomNumber(9000, 10000) },
            { material: Material.ELECTRONICS, amount: this.getRandomNumber(19000, 20000) },
            { material: Material.TEXTILES, amount: this.getRandomNumber(14000, 15000) },
            { material: Material.FLUIDS, amount: this.getRandomNumber(4800, 5000) },
            { material: Material.SPECIALIZED_ALLOYS, amount: this.getRandomNumber(9000, 10000) }
        ];
    
        return materialQuantities;
    }
}