import { Material } from "./enums/material";

export interface MaterialQuantity {
    material: Material;
    amount: number; // Amount in grams
}