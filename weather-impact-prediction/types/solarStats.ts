export class SolarStats {
  // this data is based on: https://shrinkthatfootprint.com/average-solar-energy-production/
  static readonly efficiencyMonthlyNorthernHemisphere: {[id: string] : number} = {
    january: 0.49,
    february: 0.61,
    march: 0.75,
    april: 0.88,
    may: 0.94,
    june: 0.99,
    july: 1,
    august: 0.94,
    september: 0.85,
    october: 0.68,
    november: 0.53,
    december: 0.43
  }

  static readonly efficiencyMonthlySouthernHemisphere: {[id: string] : number} = {
    january: 1,
    february: 0.94,
    march: 0.85,
    april: 0.68,
    may: 0.53,
    june: 0.43,
    july: 0.49,
    august: 0.61,
    september: 0.75,
    october: 0.88,
    november: 0.94,
    december: 0.99
  }

  static readonly efficiencyPerHour: {[id: number] : number} = { //for this we assume that 55% of panels are south facing with the rest have a 15%, best guesstimate based on my solar panels output
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0.04,
    7: 0.08,
    8: 0.14,
    9: 0.32,
    10:0.50,
    11:0.65,
    12:0.70,
    13:0.85,
    14:0.91,
    15:0.80,
    16:0.75,
    17:0.68,
    18:0.33,
    19:0.04,
    20:0.00,
    21:0.00,
    22:0.00,
    23:0.00,
    24:0.00,
    0: 0.00,
  }
}
