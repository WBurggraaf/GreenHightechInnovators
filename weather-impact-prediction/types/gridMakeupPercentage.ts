import { PluginParams } from "../../../types";


export class GridMakeupPercentage {
  //total maximum output percentages
  id: number = 0;
  solar: number = 0;
  wind: number = 0;
  geothermal: number = 0;
  hydro: number = 0;
  nuclear: number = 0;
  bio: number = 0;
  oil: number = 0;
  gas: number = 0;
  coalBituminous: number = 0; // black coal
  coalSubBituminous: number = 0; // lower grade black coal
  coalLignite: number = 0; //brown coal

  static toModel(inputParams: PluginParams): GridMakeupPercentage {
    let gridMakeupPercentage = new GridMakeupPercentage;
    gridMakeupPercentage.id = inputParams['grid/id'];
    gridMakeupPercentage.solar = inputParams['grid/solar-percentage'];
    gridMakeupPercentage.wind = inputParams['grid/wind-percentage'];
    gridMakeupPercentage.geothermal = inputParams['grid/geothermal-percentage'];
    gridMakeupPercentage.hydro = inputParams['grid/hydro-percentage'];
    gridMakeupPercentage.nuclear = inputParams['grid/nuclear-percentage'];
    gridMakeupPercentage.bio = inputParams['grid/bio-percentage'];
    gridMakeupPercentage.oil = inputParams['grid/oil-percentage'];
    gridMakeupPercentage.gas = inputParams['grid/gas-percentage'];
    gridMakeupPercentage.coalBituminous = inputParams['grid/coal-bituminous-percentage'];
    gridMakeupPercentage.coalSubBituminous = inputParams['grid/coal-sub-bituminous-percentage'];
    gridMakeupPercentage.coalLignite = inputParams['grid/coal-lignite-percentage'];

    return gridMakeupPercentage;
  }
}
