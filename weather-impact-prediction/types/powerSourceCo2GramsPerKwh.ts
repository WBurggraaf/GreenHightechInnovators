
export class PowerSourceCo2GramsPerKwh {
  // this data is based on: https://www.cowi.com/about/news-and-press/comparing-co2-emissions-from-different-energy-sources#:~:text=Carbon%20dioxide%20equivalent%20is%20a,emissions%20of%20different%20greenhouse%20gases.&text=Coal%3A%20740%2D1689%20g%20CO2e%2FkWh.
  static readonly solar: number = 41;
  static readonly wind: number = 11;
  static readonly geothermal: number = 38;
  static readonly hydro: number = 4;
  static readonly nuclear: number = 12;
  static readonly bio: number = 230;
  static readonly oil: number = 840;
  static readonly gas: number = 490;
  static readonly coalBituminous: number = 740;
  static readonly coalSubBituminous: number = 1024; //guess because of how negative people are about brown coal
  static readonly coalLignite: number = 1689;
}
