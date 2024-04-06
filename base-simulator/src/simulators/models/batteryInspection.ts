import { Material } from "../../interfaces/enums/material";
import { MaterialQuantity } from "../../interfaces/materialQuantity";
import { Battery } from "../../model/output/battery";
import { Vehicle as VehicleChild } from "./verhicle"

export class BatteryInspection extends Battery {
    vehicle: VehicleChild  | undefined;

    getRandomNumber(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}