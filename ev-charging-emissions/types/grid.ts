import { PluginParams } from "../../../types";

export class Grid {
    id: number = 0;
    carbonIntensityGCo2ePerKwh: number = 0;

    static toModel(inputParams: PluginParams): Grid {
        let grid = new Grid;
        
        grid.id = inputParams['grid/id'];
        grid.carbonIntensityGCo2ePerKwh = inputParams['grid/carbon-intensity-g-co2e-per-kwh'];

        return grid;
    }
}