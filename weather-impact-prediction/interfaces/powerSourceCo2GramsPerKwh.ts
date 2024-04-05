
export interface IPowerSourceCo2GramsPerKwh {
    // this data is based on: https://www.cowi.com/about/news-and-press/comparing-co2-emissions-from-different-energy-sources#:~:text=Carbon%20dioxide%20equivalent%20is%20a,emissions%20of%20different%20greenhouse%20gases.&text=Coal%3A%20740%2D1689%20g%20CO2e%2FkWh.
    solar: number;
    wind: number;
    geothermal: number;
    hydro: number;
    nuclear: number;
    bio: number;
    oil: number;
    gas: number;
    coalBituminous: number;
    coalSubBituminous: number; //guess because of how negative people are about brown coal
    coalLignite: number;
  }
  