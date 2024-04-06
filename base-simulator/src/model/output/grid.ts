import { Output } from "../../interfaces/output";

export class Grid implements Output {
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

    toImpactFramework(): object {
        return {
            'grid/bio-percentage': this.bio,
            'grid/carbon-average-renewable-energy-percentage': this.carbonAverageRenewableEnergyPercentage,
            'grid/carbon-intensity-g-co2e-per-kwh': this.carbonIntensityGCo2ePerKwh,
            'grid/coal-bituminous-percentage': this.coalBituminous,
            'grid/coal-lignite-percentage': this.coalLignite,
            'grid/coal-sub-bituminous-percentage': this.coalSubBituminous,
            'grid/gas-percentage': this.gas,
            'grid/geothermal-percentage': this.geothermal,
            'grid/hydro-percentage': this.hydro,
            'grid/id': this.id,
            'grid/nuclear-percentage': this.nuclear,
            'grid/oil-percentage': this.oil,
            'grid/solar-percentage': this.solar,
            'grid/wind-percentage': this.wind
        }
    }
}