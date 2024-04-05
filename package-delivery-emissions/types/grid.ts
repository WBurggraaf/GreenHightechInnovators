import { PluginParams } from "../../../types";

export class Grid {
    bio: number = 0;
    carbonAverageRenewableEnergyPercentage: number = 0;
    carbonIntensityGCo2ePerKwh: number = 0;
    coalBituminous: number = 0; // black coal
    coalLignite: number = 0; // brown coal
    coalSubBituminous: number = 0; // lower grade black coal
    gas: number = 0;
    geothermal: number = 0;
    hydro: number = 0;
    id: number = 0;
    nuclear: number = 0;
    oil: number = 0;
    solar: number = 0;
    wind: number = 0;

    static toModel(inputParams: PluginParams): Grid {
        let grid = new Grid;
        grid.carbonIntensityGCo2ePerKwh = inputParams['grid/carbon-intensity-g-co2e-per-kwh'];

        return grid;
    }
}